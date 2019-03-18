var $ = window.$
var console = window.console
var pangea = window.pangea
var WebSocket = window.WebSocket

pangea.gui = new Object()

pangea.gui.addJoinLabel = function(){
  $('#fold').addClass('hide')
  $('#check').addClass('hide')
  $('#bet').addClass('hide')
  $('#bet_slider').addClass('hide')
  $('#bet-amount').addClass('hide')
  $('#bet-label').addClass('hide')
  $('.custom-bet-btn').addClass('hide')
  $('#autocontrols').addClass('hide')
  if ($('#join-label').length == 0){
    var joinLabel = $('<div id="join-label">Choose a seat to join the table.</div>')
    $('#poker-room').append(joinLabel)
  } else {
    $('#join-label').removeClass('hide')
  }
}

pangea.gui.addPlayerControls = function(){
  $('#join-label').addClass('hide')
  $('#fold').removeClass('hide')
  $('#check').removeClass('hide')
  $('#bet').removeClass('hide')
  $('#bet_slider').removeClass('hide')
  $('#bet-amount').removeClass('hide')
  $('#bet-label').removeClass('hide')
  $('#autocontrols').removeClass('hide')
  // $('.custom-bet-btn').removeClass('hide')
}

pangea.gui.centerPotAmount = function(){
  var width = $('#pot-amount').outerWidth()
  var center = 400
  $('#pot-amount').css({left:center - (width/2)})
}

pangea.gui.updatePotAmount = function(){
  var amount = pangea.game.pot[0]
  $('#pot-amount').text('Pot: ' + String(amount))
  pangea.gui.centerPotAmount()
  if (pangea.game.pot.length > 1){
    $('#side-pots').removeClass('hide')
    var potList = $('#side-pots ol')
    potList.html('')
    for (var i=0; i<pangea.game.pot.length; i++){
      var thisPot = pangea.game.pot[i]
      var thisHtml = '<li>' + thisPot  + '</li>'
      potList.append(thisHtml)
    }
  } else {
     $('#side-pots').addClass('hide')
  }
}

pangea.gui.tocall = function(){
  var selector = '#tocall'
  if (pangea.game.tocall === undefined){
    $(selector).text('To call: 0')
  } else {
    $(selector).text('To call: ' + pangea.game.tocall)
  }
}

pangea.gui.playerstack = function(){
  var selector = '#player-total'
  if (pangea.player.stack === undefined){
    $(selector).text('Stack: 0')
  } else {
    $(selector).text('Stack: ' + pangea.player.stack)
  }
}

pangea.gui.gametype = function(){
  var selector = '#gametype'
  if (pangea.game.gametype != undefined){
    $(selector).html(pangea.game.gametype)
  }
}

pangea.gui.dealcards = function(){
  var delay = 50
  var dealTheseCards = []
  for (var i=0; i < pangea.seats.length; i++){
    var index = pangea.tableOrder[i]
    var seat = pangea.seats[index]
    if (seat.playing == 1){
      if (seat.player == 1){
        seat.faceup1.image = pangea.deck[pangea.player.holecards[0]]
        dealTheseCards.push(seat.faceup1)
      } else {dealTheseCards.push(seat.facedown1)}
    }
  }
  for (var j=0; j < pangea.seats.length; j++){
    var seat = pangea.seats[j]
    if (seat.playing == 1){
      if (seat.player == 1){
        seat.faceup2.image = pangea.deck[pangea.player.holecards[1]]
        dealTheseCards.push(seat.faceup2)
      } else {dealTheseCards.push(seat.facedown2)}
    }
  }
  for (var k=0; k < dealTheseCards.length; k++){
    window.setTimeout(function(){
      var thiscard = dealTheseCards.shift()
      thiscard.deal()
    }, delay * k)
  }
}

pangea.gui.showboardcards = function(){
  for (var card in pangea.boardcards){
    pangea.boardcards[card].deal()}
}

pangea.gui.returnCards = function(){
  for (var seat in pangea.seats){
    pangea.seats[seat].returnCards()
  }
  for (var card in pangea.boardcards){
    pangea.boardcards[card].returnCard()
  }
}

pangea.gui.showPotChips = function(potnum){
  if (pangea.options.showChips == 1){
    function sortChips(a,b){
      return(a[1] - b[1])
    }
    var chips1 = [25, 10, 5, 1]
    var chips2 = [250, 100, 50, 25, 10, 5, 1]
    var chips3 = [250, 100, 50, 25, 20, 10, 5, 1]
    var chips4 = [10000, 5000, 2000, 1000, 500, 250, 100, 50, 25, 20, 10, 5, 1]
    var chipsets = [chips1, chips2, chips3, chips4]
    var potAmount = pangea.game.pot[potnum]
    var potStacks = null
    function getStacks(thisPot, chips){
      var thisPotStack = []
      for (var i=0; i<chips.length; i++){
        var chipval = chips[i]
        if (thisPot/chipval > 1){
          if (Math.floor(thisPot/chipval) > 10){
            return false
          }
          thisPotStack.push([chipval, Math.floor(thisPot/chipval)])
          thisPot %= chipval
        }
      }
      return thisPotStack
    }
    for (var k=0; k<chipsets.length; k++){
      potStacks = getStacks(potAmount, chipsets[k])
      if (potStacks != false){break}
    }
    potStacks.sort(sortChips)
    potStacks.reverse()
    for (var j=0; j<potStacks.length && j<5; j++){
      pangea.potChips(potnum, j, potStacks[j][0], potStacks[j][1])
    }
  }
}

pangea.gui.chipsToPot = function(){
  var potCenter = [390, 280]
  $('.chip').animate(
    {'left':potCenter[0], 'top':potCenter[1]},
    700, function(){
           $('.chip').remove()
           for (var i=0; i<pangea.game.pot.length && i<3; i++){
             pangea.gui.showPotChips(i)    
           }
         })
  for (var j=0; j<pangea.seats.length; j++){
    pangea.seats[j].bet = 0
  }
  pangea.update()
}

pangea.gui.chipsToPlayer = function(seatnum){
  if (pangea.options.showChips == 1){
    var p0 = pangea.constants.p0
    var p1 = pangea.constants.p1
    var p2 = pangea.constants.p2
    var p3 = pangea.constants.p3
    var p4 = pangea.constants.p4
    var p5 = pangea.constants.p5
    var p6 = pangea.constants.p6
    var p7 = pangea.constants.p7
    var p8 = pangea.constants.p8
    var players = Array(p0, p1, p2, p3, p4, p5, p6, p7, p8)
    var potCenter = players[seatnum][0]
    $('.chip').animate(
      {'left':potCenter[0], 'top':potCenter[1]},
      600, function(){
             $('.chip').remove()
           })
  }
}

pangea.gui.betSlider = function(){
  var slider = $('#bet_slider')
  slider.prop('min', pangea.game.tocall)
  slider.prop('step', pangea.game.bigblind)
  if (pangea.game.limit > 0){
    slider.prop('max', pangea.game.limit)
  } else {
    slider.prop('max', pangea.player.stack)
  }
}

pangea.gui.callRaise = function(){
  if (pangea.game.tocall > 0){
    $('#check').text('Call')
    $('#bet').text('Raise')
  } else {
    $('#check').text('Check')
    $('#bet').text('Bet')
  }
}

pangea.gui.timer = function(){
  if (pangea.game.myturn == 1){
    if (pangea.game.timer != 0){
      $('#timer').removeClass('hide')
      var timerImg = "./images/timer.gif?" + new Date().getTime();
      var timerHtml = "<img src='"+ timerImg +"'>"
      // var timerHtml = '10'
      $('#timer').html(timerHtml)
      var timerElement = $('#timer > img')
      timerElement.css('position', 'absolute')
      // var xoffset = ($('#timer').width() - timerElement.width())/2
      var xoffset = 9
      timerElement.css('left', xoffset)
      // var yoffset = ($('#timer').height() - timerElement.height())/2
      var yoffset = 16
      timerElement.css('top', yoffset)
    } 
  } else {
    $('#timer').addClass('hide')
    var timerElement = $('#timer > img')
    timerElement.remove()
  }
}

pangea.gui.setCustomBet = function(selector, betAmount){
  if (betAmount != ""){
    $(selector).html(betAmount)    
  }
}

pangea.gui.refreshImages = function(){
  var allImages = $('img')
  for (var i=0; i < allImages.length; i++){
    var thisImg = allImages[i]
    var thisSrc = $(thisImg).attr('src')
    if (pangea.deck == pangea.deck1){
      thisSrc = thisSrc.replace('4color', 'cards')
      $(thisImg).attr('src', thisSrc)
    }
    if (pangea.deck == pangea.deck2){
      thisSrc = thisSrc.replace('cards', '4color')
      $(thisImg).attr('src', thisSrc)
    }
  }
}

pangea.gui.optionHandlers = {
  'tablefelt':function(feltColor){
    if (feltColor == 'black'){
      $('#poker-room').css('background-image', "url('./images/bg.png')")
    }
    if (feltColor == 'green'){
      $('#poker-room').css('background-image', "url('./images/bg-green.png')")
    }
  },
  'showChips':function(bool){
    console.log(bool)
    if (bool == 1){
      console.log('show')
      $('.chip').removeClass('hide')
    }
    if (bool == 0){
      $('.chip').addClass('hide')
    }
  },
  'showChat':function(bool){
    if (bool == 1){
      $('#chatbox').removeClass('hide')
    }
    if (bool == 0){
      $('#chatbox').addClass('hide') 
    }
  },
  'showSeats':function(bool){
  },
  'showCustom':function(bool){
    if (bool == 1){
      $('.custom-bet-btn').removeClass('hide')
    }
    if (bool == 0){
      $('.custom-bet-btn').addClass('hide')
    }
  },
  'custom1':function(betAmount){
    pangea.gui.setCustomBet('#custom-bet-1', betAmount)
  },
  'custom2':function(betAmount){
    pangea.gui.setCustomBet('#custom-bet-2', betAmount)
  },
  'custom3':function(betAmount){
    pangea.gui.setCustomBet('#custom-bet-3', betAmount)
  },
  'custom4':function(betAmount){
    pangea.gui.setCustomBet('#custom-bet-4', betAmount)
  },
  'chooseDeck':function(whichDeck){
    var theDecks = {'normal':pangea.deck1, 'fourcolor':pangea.deck2}
    pangea.deck = theDecks[whichDeck]
    pangea.gui.refreshImages()
  } 
}


pangea.gui.hideSeats = function(){
  if (pangea.options.showSeats == 0){
    $('.player-info').show()
    $('.empty-seat').hide()
  }
  if (pangea.options.showSeats == 1){
    $('.player-info').show()
    $('.empty-seat').show()
  }
}

pangea.gui.updateOptions = function(){
  for (var key in pangea.options){
    if (pangea.options[key] != pangea.oldOptions[key]){
      // console.log("Option changed: " + String(pangea.options[key]))
      var handler = pangea.gui.optionHandlers[key]
      handler(pangea.options[key])
      pangea.oldOptions[key] = pangea.options[key]
    }
  }
}

pangea.gui.changeSeats = function(config){
  var removeFor2 = [$('#seat-7'), $('#seat-2'), $('#seat-3'), $('#seat-4'), $('#seat-5'), $('#seat-6'), $('#seat-8')]
  var removeFor6 = [$('#seat-3'), $('#seat-4'), $('#seat-5')]
  var configs = {2:removeFor2, 6:removeFor6}
  if (Object.keys(configs).indexOf(String(config)) >= 0){
    var toRemove = configs[config]
    for (var i=0; i<toRemove.length; i++){
      $(toRemove[i]).remove()
    }    
  }
}

pangea.gui.updateSeats = function(){
  if (pangea.game.seats != pangea.seats.length){
    pangea.gui.changeSeats(pangea.game.seats)
  }
}