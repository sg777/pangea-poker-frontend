var $ = window.$
var console = window.console
var pangea = window.pangea
var WebSocket = window.WebSocket

pangea.actions = new Object()
pangea.actions.join = function(seatnum){
  var message = {'action':{'join':seatnum}}
  message = JSON.stringify(message)
  pangea.sendMessage(message)
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
  for (var i=0; i<9; i++){
    var newSeat = new pangea.Seat(i)
    pangea.seats.push(newSeat)
    newSeat.update()
  }
  pangea.initBoardCards()
}

pangea.update = function(){
  for (var seat in pangea.seats){
    pangea.seats[seat].update()
  }
  if (pangea.player.sitting != 0){
    pangea.gui.addPlayerControls()
  }  else {
    pangea.gui.addJoinLabel()
  }
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

$('#click').click(function(){
  if (pangea.game.myturn == 1){
    pangea.sendMessage({'action':{'check':'1'}})
  }
})

$('#bet').click(function(){
  var thisBet = $('#bet-amount').val()
  if (thisBet >= pangea.game.tocall){
    pangea.sendMessage({'action':{'bet':thisBet}})
  }
})

pangea.init()
pangea.update()
