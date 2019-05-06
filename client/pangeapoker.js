var $ = window.$
var console = window.console
var WebSocket = window.WebSocket

var pangea = new Object()
pangea.pokerRoom = document.getElementById('poker-room')

pangea.randomIntFromInterval = function(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

pangea.dealerTray = function(){
  function addDealerChip(row){
    var rows = ['edge-1', 'edge-2', 'edge-3', 'edge-4', 'edge-5']
    var baseTop = 65
    var pokerRoom = document.getElementById('poker-room')
    var chipDiv = document.createElement('div')
    chipDiv.className = 'chip-edge ' + rows[row]
    var thistop = baseTop + (3 * dealerchips[row])
    chipDiv.style.top = String(thistop) + 'px'
    var chipSpot = document.createElement('div')
    chipSpot.className = 'chip-spot'
    chipSpot.style.left = String(pangea.randomIntFromInterval(2,8))
                        + 'px'
    chipDiv.appendChild(chipSpot)
    pokerRoom.appendChild(chipDiv)
    dealerchips[row] += 1
    return chipDiv
  }

  function addChips(row, quantity){
    for (var i=0; i<quantity; i++){
      addDealerChip(row)
    }
  }

  var dealerchips = [0, 0, 0, 0, 0]
  for (var i=0; i<5; i++){
    addChips(i, pangea.randomIntFromInterval(5,14))
  }
}

pangea.addChip = function(chipnum, left, top, extraClass){
  var chipDiv = document.createElement('div')
  if (extraClass == undefined){extraClass = 1}
  if (extraClass.length > 1){
    chipDiv.className = 'chip chip' + chipnum + ' ' + extraClass
  } else {
    chipDiv.className = 'chip chip' + chipnum
  }
  chipDiv.style.top = String(top) + 'px'
  chipDiv.style.left = String(left) + 'px'
  pangea.pokerRoom.appendChild(chipDiv)
}

pangea.playerChips = function(playernum, stacknum, chipnum, quantity){
  // var p0 = [[494, 90], [475, 92], [488, 106], [507, 104], [470, 108]]
  // var p1 = [[644, 132], [630, 142], [648, 149], [631, 160], [647, 167]]
  // var p2 = [[644, 257], [630, 267], [648, 274], [631, 285], [647, 292]]
  // var p3 = [[582, 333], [565, 328], [599, 328], [549, 333], [616, 333]]
  // var p4 = [[395, 345], [378, 340], [412, 340], [362, 345], [429, 345]]
  // var p5 = [[208, 333], [191, 328], [225, 328], [175, 333], [242, 333]]
  // var p6 = [[145, 257], [159, 267], [141, 274], [158, 285], [142, 292]]
  // var p7 = [[145, 132], [159, 142], [141, 149], [158, 160], [142, 167]]
  // var p8 = [[291, 90], [310, 92], [297, 106], [278, 104], [315, 108]]
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
  var player = players[playernum]
  var pokerRoom = document.getElementById('poker-room')
  var bottom_chip = player[stacknum]
  if (bottom_chip == undefined){
    console.log(stacknum)
    console.log(player)
  }
  for (var i=0; i<quantity; i++){
    var top = bottom_chip[1] - (2 * i)
    pangea.addChip(chipnum, bottom_chip[0], top)
  }
}

pangea.potChips = function(potnum, stacknum, chipnum, quantity){
  var pot1 = [[390, 280], [372, 280], [408, 280], [354, 280], [426, 280]]
  var pot2 = [[277, 280], [259, 280], [295, 280], [241, 280], [313, 280]]
  var pot3 = [[508, 280], [490, 280], [526, 280], [472, 280], [544, 280]]
  var pots = Array(pot1, pot2, pot3)
  var pot = pots[potnum]
  var bottom_chip = pot[stacknum]
  if (bottom_chip == undefined){
    console.log(stacknum)
    console.log(pot[stacknum])
  }
  for (var i=0; i<quantity; i++){
    var top = bottom_chip[1] - (2 * i)
    var extraClass = 'potchip' + potnum
    pangea.addChip(chipnum, bottom_chip[0], top, extraClass)
  }
}

pangea.openWebSocket = function(){
  var ws  = new WebSocket(pangea.wsURI)
  ws.onmessage = function(event){
    pangea.onMessage(event.data)
  }
  return ws
}

pangea.processDefault = function(message){
  message=JSON.parse(message)
  console.log(message)
  for(var key in message)
    console.log(key,':',message[key])
}

pangea.onMessage = function(message){
	/*
	var handlers = {'action':pangea.API.action, 'game':pangea.API.game, 'seats':pangea.API.seats, 
	'player':pangea.API.player, 'deal':pangea.API.deal,'chat':pangea.API.chat,'default':pangea.API.default,
	'bvv':pangea.API.bvv, 'dcv':pangea.API.dcv, 'method':pangea.API.method}
	message = JSON.parse(message)
	console.log('Recieved: ', message)
	for (var key in message){
	if (handlers.hasOwnProperty(key)){
	    var handler = handlers[key]
	    handler(message[key])  
	}
	}
	*/
	console.log('Received: DCV: ',message)
	message=JSON.parse(message)
	if(message["method"] == "game")
	{
		pangea.API.game(message["game"])
		 pangea.seatsAPI()	
	}
	else if(message["method"] == "seats")
	{
		pangea.API.seats(message["seats"])
		pangea.dcv()	
	}
	else if(message["method"] == "dcv")
	{
		pangea.bvv()	
	}
	else if(message["method"] =="bvv_join")
	{
		pangea.API.chat("BVV is Joined")
	}
	else if(message["method"] =="join_res")
	{
		message["gui_playerID"]=0
		pangea.sendMessage_player1(message)
		message["gui_playerID"]=1
		pangea.sendMessage_player2(message)

	}
	else if(message["method"] =="check_bvv_ready")
	{
		 pangea.sendMessage_bvv(message); 
	}
	else if(message["method"] =="init")
	{
		 message["gui_playerID"]=0
		 pangea.sendMessage_player1(message)
		 message["gui_playerID"]=1
		 pangea.sendMessage_player2(message) 
	}
	else if(message["method"] =="init_d")
	{
	  /*
	  Actually this message should be forwarded to players along BVV, since in the backe end the same buffer is getting used and
	  which causing the sync issues, what I'm doing is at this moment I'm just forwading this message to BVV frome from UI and BVV 
	  in the backend forwards this message to Players
	  */
	  message["method"]="init_d_bvv"    
	  pangea.sendMessage_bvv(message)

	 message["method"]="init_d_player"  
	 message["gui_playerID"]=0
	 pangea.sendMessage_player1(message)

	  message["gui_playerID"]=1
	 pangea.sendMessage_player2(message) 
	 

	}
	else if(message["method"] == "dealer")
	{
		console.log("We got the dealer")

		message["method"]="dealer_bvv"    
		pangea.sendMessage_bvv(message)

		message["method"]="dealer_player"  
		message["gui_playerID"]=0
		pangea.sendMessage_player1(message)
		message["gui_playerID"]=1
		pangea.sendMessage_player2(message)
		/*
		message["playerID"]=1
		pangea.sendMessage_player2(message) 
		*/
	}
	else if(message["method"] == "turn")
	{
		console.log("Received the turn info")

		if(message["playerid"] == 0)
		{
		  message["gui_playerID"]=0
		  pangea.sendMessage_player1(message)
		}
		else
		{
		  message["gui_playerID"]=1  
		  pangea.sendMessage_player2(message)
		}

	}
	else if(message["method"] == "betting")
	{
		if((message["action"] == "small_blind")||(message["action"] == "big_blind")||(message["action"] == "round_betting"))
		{
		  console.log(message["action"])
		  if(message["playerid"] == 0)
		  {
		     message["gui_playerID"]=0
		     pangea.sendMessage_player1(message) 
		  }
		  else if(message["playerid"] == 1)
		  {
		    message["gui_playerID"]=1
		    pangea.sendMessage_player2(message)
		  }
		}
		else if(message["action"]=="small_blind_bet")
		{
			console.log("small_blind_bet")
			message["action"]="small_blind_bet_player"
			message["gui_playerID"]=0
			pangea.sendMessage_player1(message)

			message["gui_playerID"]=1
			pangea.sendMessage_player2(message)
		}
		else if(message["action"]=="big_blind_bet")
		{
			console.log("big_blind_bet")
			message["action"]="big_blind_bet_player"
			message["gui_playerID"]=0
			pangea.sendMessage_player1(message)

			message["gui_playerID"]=1
			pangea.sendMessage_player2(message)
		}
		else if((message["action"] =="check")||(message["action"] =="call")||(message["action"] =="raise")||(message["action"] =="fold")||(message["action"] =="allin"))
		{
		    message["action"]=message["action"]+"_player"
			if(message["gui_playerID"] == 0)
			{
				message["gui_playerID"]=1
				pangea.sendMessage_player2(message)	
			}
			else if(message["gui_playerID"] == 1)
			{
				message["gui_playerID"]=0
				pangea.sendMessage_player1(message)	
			}
			
		}
	}
	else if(message["method"] == "invoice")
	{
		pangea.game.pot[0]+=message["betAmount"]
		pangea.gui.updatePotAmount()
		if(message["playerID"] == 0)
		{
			message["gui_playerID"]=0
			pangea.sendMessage_player1(message);	
		}
		else if(message["playerID"] == 1)
		{
			message["gui_playerID"]=1
			pangea.sendMessage_player2(message);	
		}
	}
	else if(message["method"] == "winningInvoiceRequest")
	{
		if(message["playerID"] == 0)
		{
			message["gui_playerID"]=0
			pangea.sendMessage_player1(message);	
		}
		else if(message["playerID"] == 1)
		{
			message["gui_playerID"]=1
			pangea.sendMessage_player2(message);	
		}
	}
}

pangea.onMessage_bvv = function(message){
  message=JSON.parse(message)
  console.log('Received: bvv: ',message)
  console.log(message["method"])
   if(message["method"] =="init_b")
   {
    /*
    sg777: In the back end this message is forwarded to both the players, this should be changed in the future
    */
    message["method"]="init_b_player"
	message["gui_playerID"]=0
	pangea.sendMessage_player1(message)  
    
    message["gui_playerID"]=1
    pangea.sendMessage_player2(message)   
       
   } 
   else
      pangea.sendMessage(message)
}

pangea.onMessage_player1 = function(message){
  message=JSON.parse(message)
  console.log('Received: player1: ',message)

  if(message["method"] == "deal")
  {
  	pangea.player.seat=0
  	pangea.API.deal(message["deal"])
 
  }
  else if(message["method"] == "requestShare")
  {
    if(message["toPlayer"] == 1)
    {
        message["gui_playerID"]=1
        pangea.sendMessage_player2(message)
    }
  }
  else if(message["method"] == "share_info")
  {
    if(message["toPlayer"] == 1)
    {
        message["gui_playerID"]=1
        pangea.sendMessage_player2(message)
    }

  }
  else if(message["method"] == "playerCardInfo")
  {
    console.log("playerCardInfo")
    pangea.sendMessage(message)
  }
  else if((message["action"] =="check")||(message["action"] =="call")||(message["action"] =="raise")||(message["action"] =="fold")||(message["action"] =="allin"))
  {
    message["gui_playerID"]=0;
    pangea.sendMessage(message)
  }  
  else
  {
     pangea.sendMessage(message)
  } 
}

pangea.onMessage_player2 = function(message){
  message=JSON.parse(message)
  console.log('Received: player2: ',message)

  if(message["method"] == "deal")
  {
  	pangea.player.seat=1
 	pangea.API.deal(message["deal"])
  }
  else if(message["method"] == "requestShare")
  {
    if(message["toPlayer"] == 0)
    {
      message["gui_playerID"]=0
      pangea.sendMessage_player1(message)
    }
  }
  else if(message["method"] == "share_info")
  {
    if(message["toPlayer"] == 0)
    {
        message["gui_playerID"]=0
        pangea.sendMessage_player1(message)
    }

  }
  else if(message["method"] == "playerCardInfo")
  {
    console.log("playerCardInfo")
    pangea.sendMessage(message)
  }
  else if((message["action"] =="check")||(message["action"] =="call")||(message["action"] =="raise")||(message["action"] =="fold")||(message["action"] =="allin"))
  {
    message["gui_playerID"]=1;
    pangea.sendMessage(message)
  }    
  else
  {
     pangea.sendMessage(message)
  }
}



pangea.sendMessage = function(message){
  if (typeof message != 'string'){
    message = JSON.stringify(message)
  }
  pangea.ws.send(message)
  console.log('Sent: ', message)
}

pangea.dealerTray()
pangea.wsURI = 'ws://159.69.23.30:9000'//'ws://localhost:9000'
pangea.ws = pangea.openWebSocket()

// For DCV

pangea.sendMessage_bvv = function(message){
  if (typeof message != 'string'){
    message = JSON.stringify(message)
  }
  pangea.ws_bvv.send(message)
  console.log('Sent: ', message)
}

pangea.openWebSocket_bvv = function(){
  var ws  = new WebSocket(pangea.wsURI_bvv)
  ws.onmessage = function(event){
    pangea.onMessage_bvv(event.data)
  }
  return ws
}

pangea.wsURI_bvv = 'ws://159.69.23.31:9001'
pangea.ws_bvv = pangea.openWebSocket_bvv()

//For Player1

pangea.sendMessage_player1 = function(message){
  if (typeof message != 'string'){
    message = JSON.stringify(message)
  }
  pangea.ws_player1.send(message)
  console.log('Sent: ', message)
}

pangea.openWebSocket_player1 = function(){
  var ws  = new WebSocket(pangea.wsURI_player1)
  ws.onmessage = function(event){
    pangea.onMessage_player1(event.data)
  }
  return ws
}

pangea.wsURI_player1 = 'ws://159.69.23.28:9002'
pangea.ws_player1 = pangea.openWebSocket_player1()

// For Player2

pangea.sendMessage_player2 = function(message){
  if (typeof message != 'string'){
    message = JSON.stringify(message)
  }
  pangea.ws_player2.send(message)
  console.log('Sent: ', message)
}

pangea.openWebSocket_player2 = function(){
  var ws  = new WebSocket(pangea.wsURI_player2)
  ws.onmessage = function(event){
    pangea.onMessage_player2(event.data)
  }
  return ws
}

pangea.wsURI_player2 = 'ws://159.69.23.29:9003'
pangea.ws_player2 = pangea.openWebSocket_player2()
