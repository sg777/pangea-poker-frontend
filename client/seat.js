var $ = window.$
var console = window.console
var pangea = window.pangea
var WebSocket = window.WebSocket

pangea.Seat = function(seat, avatar, name, stack){
  this.seat = seat
  this.bg = pangea.constants.seatbg
  if (avatar === undefined) {this.avatar = './images/avatar-default.png'}
  else {this.avatar = avatar}
  this.name = name
  this.stack = stack
  this.action = ''
  this.playing = 0
  this.player = 0
  this.empty = 1
  this.setSelectors()
  this.initcards()
  this.updateCSS()
  this.sitdown()
  this.playercards = null
  this.bet = ''
}

pangea.Seat.prototype.setSelectors = function(){
  this.select = {}
  this.select.seat = '#seat-' + String(this.seat)
  this.select.status = '#seat-' + String(this.seat) + ' > .player-status'
  this.select.action = '#seat' + String(this.seat) + 'action'
  this.select.name = this.select.status + " > .player-name"
  this.select.stack = this.select.status + " > .player-amount"
  this.select.facedown1 = this.select.seat + " > .down0"
  this.select.facedown2 = this.select.seat + " > .down1"
  this.select.faceup1 = this.select.seat + " > .card0"
  this.select.faceup2 = this.select.seat + " > .card1"
  this.select.button = '#seat' + String(this.seat) + 'button'
  this.select.bet = '#stack' + String(this.seat) + 'span'
}

pangea.Seat.prototype.initcards = function(){
  this.facedown1 = new pangea.Card(pangea.constants.facedown, this.select.facedown1, this)
  this.facedown2 = new pangea.Card(pangea.constants.facedown, this.select.facedown2, this)
  this.faceup1 = new pangea.Card(undefined, this.select.faceup1, this)
  this.faceup2 = new pangea.Card(undefined, this.select.faceup2, this)
}

pangea.Seat.prototype.emptycss = function(){
  $(this.select.seat).addClass('empty-seat')
  $(this.select.seat).addClass('can-sit')
  $(this.select.status).addClass('hide')
  $(this.select.action).text('')
  $(this.select.seat).css('background', pangea.constants.emptyseatbg)
  $(this.select.seat).css('opacity', '0.5')
  $(this.select.seat).css('background-image', 'none')
  $(this.select.seat).css('border-color', pangea.constants.emptyseatbg)
  if (pangea.player.sitting != 0){
    $(this.select.seat).removeClass('can-sit')
  }
}

pangea.Seat.prototype.occupiedcss = function(){
  $(this.select.seat).removeClass('empty-seat')
  $(this.select.seat).removeClass('can-sit')
  $(this.select.seat).addClass('player-info')
  $(this.select.seat).css('background', this.bg)
  $(this.select.seat).css('opacity', '1')
  $(this.select.seat).css('background-image', 'url(' + this.avatar + ')')
  $(this.select.action).html(this.action)
  $(this.select.status).removeClass('hide')
  $(this.select.name).text(this.name)
  $(this.select.stack).text(this.stack)
  $(this.select.seat).css('border-color', pangea.constants.seatborder)
}

pangea.Seat.prototype.onTheButton = function(){
  if (this.seat == pangea.dealer){
    $(this.select.button).removeClass('hide')
  } else {
    $(this.select.button).addClass('hide')
  }
}

pangea.Seat.prototype.updateCSS = function(){
  if (this.empty == 1){this.emptycss()}
  else {this.occupiedcss()}
}

pangea.Seat.prototype.sitdown = function(){
  $(this.select.seat).unbind('click')
  if (pangea.player.sitting == 0){
    $(this.select.seat).click(function(){
      var seatnum = Number(this.id.split('-')[1])
      pangea.actions.join(seatnum)
    })
  } 
}

pangea.Seat.prototype.holdingCards = function(){
  var theseCards = [this.faceup1, this.faceup2,
                    this.facedown1, this.facedown2]
  for (var i=0; i < theseCards.length; i++){
    var hasImage = theseCards[i].selector
    if (theseCards[i].selector.has('img').length > 0){
      return true
    }
  }
  return false
}

pangea.Seat.prototype.returnCards = function(){
  if (this.holdingCards()){
    this.faceup1.clearCard()
    this.faceup2.clearCard()
    this.facedown1.clearCard()
    this.facedown2.clearCard()
    this.facedown1.returnCard()
    this.facedown2.returnCard()
    this.playercards = null
  }
}

pangea.Seat.prototype.showCards = function(){
  if (this.player == 1){return true}
  if (Array.isArray(this.playercards)){
    if (pangea.cards.indexOf(this.playercards[0]) > -1 &&
        pangea.cards.indexOf(this.playercards[1]) > -1){
      this.facedown1.clearCard()
      this.facedown2.clearCard()
      this.faceup1.showCard()
      this.faceup2.showCard()
    }
  } else { 
    this.faceup1.clearCard()
    this.faceup2.clearCard()
  }
}

pangea.Seat.prototype.showBet = function(thisseat){
  function sortChips(a,b){
    return(a[1] - b[1])
  }

  function showChips(){
    if (pangea.options.showChips == 1){
      var chips1 = [25, 10, 5, 1]
      var chips2 = [250, 100, 50, 25, 10, 5, 1]
      var chips3 = [250, 100, 50, 25, 20, 10, 5, 1]
      var chips4 = [10000, 5000, 2000, 1000, 500, 250, 100, 50, 25, 20, 10, 5, 1]
      var chipsets = [chips1, chips2, chips3, chips4]
      var bet = thisseat.bet
      var betStacks = null
      function getStacks(thisBet, chips){
        var thisBetStack = []
        for (var i=0; i<chips.length; i++){
          var chipval = chips[i]
          if (thisBet/chipval > 1){
            if (Math.floor(thisBet/chipval) > 10){
              return false
            }
            thisBetStack.push([chipval, Math.floor(thisBet/chipval)])
            thisBet %= chipval
          }
        }
        return thisBetStack
      }

      for (var k=0; k<chipsets.length; k++){
        betStacks = getStacks(bet, chipsets[k])
        if (betStacks != false){break}
      }

      betStacks.sort(sortChips)
      betStacks.reverse()
      for (var j=0; j<betStacks.length && j<5; j++){
        pangea.playerChips(thisseat.seat, j, betStacks[j][0], betStacks[j][1])
      }
    }
  }
  if (this.bet != ''){
    $(this.select.bet).text(this.bet)
    $(this.select.bet).removeClass('hide')
    showChips()
  } else {
    $(this.select.bet).addClass('hide')     
  }
}



pangea.Seat.prototype.update = function(params){
  for (var param in params){
    if (this.hasOwnProperty(param)){
      this[param] = params[param]
    } else {
      console.log("Parameter not found ", param)
    }
  }
  if (this.seat === pangea.player.seat){
    this.player = 1
  } else { this.player = 0}
  var thisseat = this
  this.updateCSS()
  this.sitdown()
  this.onTheButton()
  this.showCards()
  $(this.select.action).html(this.action)
  this.showBet(thisseat)
}
