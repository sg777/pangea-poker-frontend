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
  /*
  var obj = {}
  obj['method']='action'
  obj['join']=seatnum
  pangea.sendMessage(JSON.stringify(obj))
  */	
  	if(seatnum == 0)
  	{
  		var message={"method":"player_join", "gui_playerID":seatnum}
  		pangea.sendMessage_player1(message)
  	}
	else if(seatnum == 1)
	{
		var message={"method":"player_join", "gui_playerID":seatnum}
		pangea.sendMessage_player2(message)
	}

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
  $('#seats').addClass('hide')
  $('#bvv').addClass('hide')	
  $('#bvv').addClass('hide')
  $('#player1').addClass('hide')
  $('#player2').addClass('hide')
 	
  for (var i=0; i<9; i++){
    var newSeat = new pangea.Seat(i)
    pangea.seats.push(newSeat)
    newSeat.update()
  }
  pangea.initBoardCards()
  pangea.update()
  	
}

pangea.update = function(){
  pangea.gui.updateSeats()
  for (var seat in pangea.seats){
    pangea.seats[seat].update()
  }
  pangea.gui.addNoLabelandControls()
  //pangea.gui.addPlayerControls()	
  /*
  if (pangea.player.sitting != 0){
    pangea.gui.addPlayerControls()
  }  else {
    pangea.gui.addJoinLabel()
  }
  */
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
  //pangea.gui.callRaise()
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
/*
  if (pangea.game.myturn == 1){
    pangea.sendMessage({'action':{'fold':'1'}})
  } else {
    $('#checkbox1').click()
  }
 */
 	var possibilities=["","small_blind","big_blind","check","raise","call","allin","fold"]

	for(var i=0;i<pangea.controls["possibilities"].length;i++)
	{
		if(pangea.controls["possibilities"][i]!=possibilities.indexOf("fold"))
		{
			pangea.controls["possibilities"].splice(i,1)
			i=-1
		}
	}
  	if(pangea.controls["playerid"] == 0)
	{
		pangea.controls["gui_playerID"]=0
 		pangea.sendMessage_player1(pangea.controls) 
	}
	else if(pangea.controls["playerid"] == 1)
	{
		pangea.controls["gui_playerID"]=1
		pangea.sendMessage_player2(pangea.controls)
	}
	pangea.gui.addNoLabelandControls()
	console.log(pangea.controls)	

})

$('#check').click(function(){
/*
  var thisBet = pangea.game.tocall
  if (pangea.game.myturn == 1){
    pangea.sendMessage({'action':{'bet':thisBet}})
  }
*/

	var possibilities=["","small_blind","big_blind","check","raise","call","allin","fold"]

	for(var i=0;i<pangea.controls["possibilities"].length;i++)
	{
		if(pangea.controls["possibilities"][i]!=possibilities.indexOf("check"))
		{
			pangea.controls["possibilities"].splice(i,1)
			i=-1
		}
	}
  	if(pangea.controls["playerid"] == 0)
	{
		pangea.controls["gui_playerID"]=0
 		pangea.sendMessage_player1(pangea.controls) 
	}
	else if(pangea.controls["playerid"] == 1)
	{
		pangea.controls["gui_playerID"]=1
		pangea.sendMessage_player2(pangea.controls)
	}
	pangea.gui.addNoLabelandControls()
	console.log(pangea.controls)	


})

$('#bet').click(function(){
/*
  var thisBet = $('#bet-amount').val()
  if (thisBet >= pangea.game.tocall){
    pangea.sendMessage({'action':{'bet':thisBet}})
  }
*/  
})

$('#allin').click(function(){
	var possibilities=["","small_blind","big_blind","check","raise","call","allin","fold"]

	for(var i=0;i<pangea.controls["possibilities"].length;i++)
	{
		if(pangea.controls["possibilities"][i]!=possibilities.indexOf("allin"))
		{
			pangea.controls["possibilities"].splice(i,1)
			i=-1
		}
	}
  	if(pangea.controls["playerid"] == 0)
	{
		pangea.controls["gui_playerID"]=0
 		pangea.sendMessage_player1(pangea.controls) 
	}
	else if(pangea.controls["playerid"] == 1)
	{
		pangea.controls["gui_playerID"]=1
		pangea.sendMessage_player2(pangea.controls)
	}
	pangea.gui.addNoLabelandControls()
	console.log(pangea.controls)	
 })

$('#raise').click(function(){
	var possibilities=["","small_blind","big_blind","check","raise","call","allin","fold"]
	var thisBet = $('#bet-amount').val()

	if((thisBet < pangea.big_blind) || (thisBet < pangea.controls["min_amount"]))
	{
		window.alert("The raise amount should be greater than "+pangea.big_blind+ " and "+pangea.controls["min_amount"])
	}
	else
	{
		pangea.controls["bet_amount"]=thisBet
		var poss_array = pangea.controls["possibilities"] 	
		for(var i=0;i<pangea.controls["possibilities"].length;i++)
		{
			if(pangea.controls["possibilities"][i]!=possibilities.indexOf("raise"))
			{
				pangea.controls["possibilities"].splice(i,1)
				i=-1
			}
		}

		console.log(pangea.controls)
	  	if(pangea.controls["playerid"] == 0)
		{
			pangea.controls["gui_playerID"]=0
	 		pangea.sendMessage_player1(pangea.controls) 
		}
		else if(pangea.controls["playerid"] == 1)
		{
			pangea.controls["gui_playerID"]=1
			pangea.sendMessage_player2(pangea.controls)
		}
		document.getElementById('bet_amount').value = "";
		pangea.gui.addNoLabelandControls()
	}
		
 })

$('#call').click(function(){
	var possibilities=["","small_blind","big_blind","check","raise","call","allin","fold"]

	for(var i=0;i<pangea.controls["possibilities"].length;i++)
	{
		if(pangea.controls["possibilities"][i]!=possibilities.indexOf("call"))
		{
			pangea.controls["possibilities"].splice(i,1)
			i=-1
		}
	}

	console.log(pangea.controls)	

  	if(pangea.controls["playerid"] == 0)
	{
		pangea.controls["gui_playerID"]=0
 		pangea.sendMessage_player1(pangea.controls) 
	}
	else if(pangea.controls["playerid"] == 1)
	{
		pangea.controls["gui_playerID"]=1
		pangea.sendMessage_player2(pangea.controls)
	}

	pangea.gui.addNoLabelandControls()
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

  $('#game').addClass('hide')
	
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
  	var message={"method":"player_join", "gui_playerID":1}
  	pangea.sendMessage_player2(message)
  //pangea.sendMessage_player2({'method':'player_join'})
}
$('#player2').click(function(){
  pangea.player2()
})

pangea.player1 = function(){
  console.log('player1')

  	var message={"method":"player_join", "gui_playerID":0}
	pangea.sendMessage_player1(message)
  //pangea.sendMessage_player1({'method':'player_join'})
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

    
