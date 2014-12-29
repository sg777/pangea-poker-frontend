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

