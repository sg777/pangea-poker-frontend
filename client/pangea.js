var $ = window.$
var console = window.console
var pangea = window.pangea
var WebSocket = window.WebSocket

pangea.actions = new Object()
pangea.actions.join = function(seatnum){
  /*
  var message = {'action':{'join':seatnum}}
  message = JSON.stringify(message)
  pangea.sendMessage(message)
  */
  var obj = {}
  obj['method']='action'
  obj['join']=seatnum
  pangea.sendMessage(JSON.stringify(obj))
}

pangea.boardcards = []

pangea.initBoardCards = function(){
  for (var i=0; i<5; i++){
    var selector = '#card-' + i
    var newBoardCard = new pangea.BoardCard(selector)
    pangea.boardcards.push(newBoardCard)
  }
}

pangea.init = function(){
  console.log('pangea.init called')
  for (var i=0; i<9; i++){
    var newSeat = new pangea.Seat(i)
    pangea.seats.push(newSeat)
    newSeat.update()
  }
  pangea.initBoardCards()
}

pangea.update = function(){
  console.log('pangea.update called')
  pangea.gui.updateSeats()
  for (var seat in pangea.seats){
    pangea.seats[seat].update()
  }
  if (pangea.player.sitting != 0){
    pangea.gui.addPlayerControls()
  }  else {
    pangea.gui.addJoinLabel()
  }
  pangea.gui.updateOptions()
  pangea.gui.hideSeats()
  pangea.gui.updatePotAmount()
  // pangea.gui.hideBetLabels()
  pangea.gui.tocall()
  pangea.gui.gametype()
  pangea.gui.playerstack()
  pangea.getTableOrder()

  pangea.gui.showboardcards()
  pangea.gui.betSlider()
  pangea.gui.callRaise()
  pangea.API.checkAutoControls()
  pangea.gui.timer()
}

$('.player-info').hover(
  function(){
    if ($(this).hasClass('can-sit')){
      $(this).css('background-color', '#37FF00')
    }},
  function(){
    if ($(this).hasClass('can-sit')){
      $(this).css('background-color', pangea.constants.emptyseatbg)
    }
  })

$('#bet_slider').on("input", function(){
  var currentBet = $('#bet_slider').val()
  $('#bet-amount').val(currentBet)
})

$('#fold').click(function(){
  if (pangea.game.myturn == 1){
    pangea.sendMessage({'action':{'fold':'1'}})
  } else {
    $('#checkbox1').click()
  }
})

$('#check').click(function(){
  var thisBet = pangea.game.tocall
  if (pangea.game.myturn == 1){
    pangea.sendMessage({'action':{'bet':thisBet}})
  }
})

$('#bet').click(function(){
  var thisBet = $('#bet-amount').val()
  if (thisBet >= pangea.game.tocall){
    pangea.sendMessage({'action':{'bet':thisBet}})
  }
})

pangea.sendChat = function(){
  console.log('pangea.sendChat')
  var chatMessage = $('#chat-input > input').val()
  //pangea.sendMessage({'chat':chatMessage})
  $('#chat-input > input').val('')  
  var obj={}
  obj['method']='chat'
  obj['value']=chatMessage
  pangea.sendMessage(JSON.stringify(obj))
}

pangea.sendChat_bvv = function(){
  console.log('pangea.sendChat_bvv')
  var chatMessage = $('#chat-input > input').val()
  //pangea.sendMessage({'chat':chatMessage})
  $('#chat-input > input').val('')  
  var obj={}
  obj['method']='chat'
  obj['value']=chatMessage
  pangea.sendMessage_bvv(JSON.stringify(obj))
}

$('#submitchat').click(function(){
  pangea.sendChat()
  pangea.sendChat_bvv()
})

pangea.gameAPI = function(){
  console.log('game')
  var chatMessage = 'game'
  pangea.sendMessage({'method':chatMessage})
  
}

$('#game').click(function(){
  pangea.gameAPI()
})

pangea.seatsAPI = function(){
  console.log('seats')
  var chatMessage = 'seats'
  pangea.sendMessage({'method':chatMessage})
  
}

$('#seats').click(function(){
  pangea.seatsAPI()
})


pangea.player2 = function(){
  console.log('player2')
  pangea.sendMessage_player2({'method':'player_join'})
}
$('#player2').click(function(){
  pangea.player2()
})

pangea.player1 = function(){
  console.log('player1')
  pangea.sendMessage_player1({'method':'player_join'})
}
$('#player1').click(function(){
  pangea.player1()
})

pangea.bvv = function(){
  console.log('bvv')
  var chatMessage = 'bvv'
  pangea.sendMessage_bvv({'method':chatMessage})
}
$('#bvv').click(function(){
  pangea.bvv()
})

pangea.dcv = function(){
  console.log('dcv')
  var chatMessage = 'dcv'
  pangea.sendMessage({'method':chatMessage})
}
$('#dcv').click(function(){
  pangea.dcv()
})


pangea.chatKeyPress = function(){
  if(window.event.keyCode==13){
   pangea.sendChat()
 }
}

pangea.optionSelectors = {
  'tablefelt':'#table-felt',
  'showChips':'#show-chips',
  'showChat':'#show-chat',
  'showSeats':'#show-seats',
  'showCustom':'#show-custom',
  'custom1':'#bet-option-1',
  'custom2':'#bet-option-2',
  'custom3':'#bet-option-3',
  'custom4':'#bet-option-4',
  'chooseDeck':'#choose-deck'
}

$('#settings').click(function(){
  $('#options-window').toggleClass('hide')
})

$('#options-cancel').click(function(){
  $('#options-window').toggleClass('hide')
})

$('#options-confirm').click(function(){
  for (var key in pangea.optionSelectors){
    var selector = pangea.optionSelectors[key]
    var thisValue = $(selector).val()
    pangea.options[key] = thisValue
    pangea.update()
  }
  $('#options-window').toggleClass('hide')
})

$('#disconnect').click(function(){
  $('#disconnect-window').toggleClass('hide')
})

$('#disconnect-cancel').click(function(){
  $('#disconnect-window').toggleClass('hide')
})

$('#disconnect-confirm').click(function(){
  pangea.ws.close()
  $('#disconnect-window').toggleClass('hide')
  $('#options-window').toggleClass('hide')
})

$('.custom-bet-btn').click(function(){
  function getBetAmount(customVal){
    var percent_re=/\d+%/i
    // http://stackoverflow.com/questions/9011524/javascript-regexp-number-only-check
    var onlydigits_re= /^-?\d+\.?\d*$/
      var betPercent = customVal.match(percent_re)
    if (betPercent != null){
      var betAmount = betPercent[0].replace("%", "")
      betAmount = parseFloat(betAmount) * .01
      betAmount = (pangea.player.stack * betAmount).toFixed(2)
      return betAmount
    }
    var betAmount = customVal.match(onlydigits_re)
    if (betAmount != null){
      return betAmount[0]
    }
    return null
  }
  var customVal = $(this).html()
  var betAmount = getBetAmount(customVal)
  if (betAmount != null){
    $('#bet-amount').val(betAmount)
  }
})
pangea.init()
pangea.update()

    
