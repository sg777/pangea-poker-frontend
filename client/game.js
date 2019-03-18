var $ = window.$
var console = window.console
var pangea = window.pangea
var WebSocket = window.WebSocket

pangea.game = new Object()
pangea.game.gametype = "Pangea Poker"
pangea.game.pot = [0]  // List of pots and side pots
pangea.game.bigblind = 0
pangea.game.tocall = pangea.game.bigblind
pangea.game.limit = 0
pangea.game.myturn = false
pangea.game.timer = 0
pangea.seats = []
pangea.dealer = undefined
pangea.tableOrder = [0,1]//[0,1,2,3,4,5,6,7,8]
pangea.cards = []
pangea.game.seats = 2 // 2, 6 and 9 configurations available

pangea.options = {
  'tablefelt':'black',
  'showChips':1,
  'showChat':1,
  'showSeats':1,
  'showCustom':0,
  'custom1':'5%',
  'custom2':'25%',
  'custom3':'50%',
  'custom4':'100%',
  'chooseDeck':'normal'
}

pangea.oldOptions = {
  'tablefelt':'black',
  'showChips':1,
  'showChat':1,
  'showSeats':1,
  'showCustom':0,
  'custom1':'5%',
  'custom2':'25%',
  'custom3':'50%',
  'custom4':'100%',
  'chooseDeck':'normal'
}

for (var card in pangea.deck){
  if (pangea.deck.hasOwnProperty(card)){
    pangea.cards.push(card)
  }
}

pangea.getTableOrder = function(){
  console.log('pangea.getTableOrder: dealer',pangea.dealer)
  pangea.tableOrder = []
  pangea.dealer=0
  var start = pangea.dealer + 1 // start with position after the dealer
  for (var i=start; i<start + pangea.seats.length; i++){
    var seatnum = i
    if (seatnum > pangea.seats.length - 1){
        seatnum = seatnum - pangea.seats.length
    }
    pangea.tableOrder.push(seatnum)
  }

}

pangea.Player = function(seat, stack){
  this.seat = seat
  this.stack = stack
  this.holecards = []
  this.sitting = 0
}

pangea.player = new pangea.Player(null, 0)

