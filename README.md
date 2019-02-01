# Pangea Frontend API Overview

#REQUIREMENTS ubuntu 16.04
```
sudo apt-get install apache2
sudo apt-get install python-pip
sudo pip install ws4py
cd /var/www/html
git clone https://github.com/mdashx/pangea-poker-frontend
cd pangea-poker-frontend/client
python server.py
browse to http://localhost/pangea-poker-frontend/client/
```
## Where to find more info

The sample servers print JSON strings to the terminal as they are sent. Looking at this output is a good way to get example API calls.

Check out `api.js` to see how the various API calls are dispatched to the various methods.

The list of available API calls is in the `pangea.onMessage` method:

```
pangea.onMessage = function(message){
  var handlers = {'action':pangea.API.action, 'game':pangea.API.game, 'seats':pangea.API.seats, 'player':pangea.API.player, 'deal':pangea.API.deal, 'chat':pangea.API.chat}
  message = JSON.parse(message)
  console.log('Recieved: ', message)
  for (var key in message){
    if (message.hasOwnProperty(key)){
      var handler = handlers[key]
      handler(message[key])
    }
  }
}
```

The keys of the `handlers` associative array make up the valid API calls. To expand the API, simply add a new handler and specify the method for it to call.

I will answer any and all questions about the Pangea API as quickly as I can, just email <tom@hobofife.com>. Thanks.

## Available API Calls

* 'game'

Update any properties of the pangea.game object.

`gametype`: HTML Displayed in the top left corner of the screen. Use to display the name of the table, the limit, the type of game, etc.

`pot`: A list `[]` of pots, starting with the main pot, and then the side pots.

`bigblind`: Set the big blind, this is used by the bet amount slider.

`tocall`: Set the amount to call, this is used by the bet amount slider.

`limit`: Set the limit, this is used by the bet amount slider.

`myturn`: Set to '1' if it is the first person player's turn. This enables showing the red countdown timer.

`timer`: Set to '1' to show the 9 second countdown timer on the player's turn.

`seats`: Set to '9', '6', or '2' to add/remove seats from the table.

* 'seats'

`seat`: The seat number (0-8).

`name`: The name of the player at that seat.

`stack`: This value will be displayed as the seat's chip stack amount.

`action`: This value will be displayed as the seat's status bar. An empty string ('') hides the status bar.

`playing`: Set to '0' to sit out, or '1' to play.

`player`: Set to '1' if the first person player is in this seat.

`empty`: Set to '1' if the seat is empty (will make it available in the GUI to choose as a seat), set to '0' when it is occupied.

`playercards`: A list of the cards to display at the seat, ex: `['AH', 'AS']`.

`bet`: This value is used to place chips in front of the seat and adjust the bet amount label in front of the seat.

* 'action'

`chipsToPot`: Moves all chips from the seat's bets to the pots. No assoc. array necessary. Ex: `{'action':{'chipsToPot':'whatever'}}`.

`chipsToPlayer`: Moves all chips to a seat. (does not update the seat's stack value). Specify the number of the seat to move the chips to. Ex: `{'action':{'chipsToPlayer':3}}`.

`returnPlayerCards`: Fold/Muck/Return a seat's cards to the deck. Ex: `{'action':{'returnPlayerCards':7}}`.

* 'player'

`seat`: Set the first person player's seat.

`stack`: Set the first person player's stack (the stack value for the seat may need to be updated inependently).

`holecards`:Set the player's cards, ex: `['2C', '7H']`

`sitting`: Set to 1 when the player is sitting at the table. This value is used to control the seat selection GUI.

* 'deal'

`dealer`: Places the dealer button and determines which seat dealing animation starts with.

`holecards`: Used to display the seat's holecards. Set to 'null' until the showdown.

`boardcards`: Used to display flop, turn and river. See example in the following section.

* 'chat'

Just send a list of messages to display in the chatbox. Each member of the list will be printed on a new line.

{'chat':['Dealer: LaurePalmer bets 666', 'Dealer: Audrey folds']}

# Examples

### Connecting To A Backend Using The WebSocket Protocol

The websocket URI is set in the `pangeapoker.js` file on the `pangea.wsURI` property, ex: `pangea.wsURI = 'ws://localhost:9000'`.

The file ./client/server.py contains an example server listening for web socket connections, using the ws4py module.

`server = make_server('', 9000, server_class=WSGIServer,
                     handler_class=WebSocketWSGIRequestHandler,
                     app=WebSocketWSGIApplication(handler_cls=myserver))`

So just make sure that the server's URI is the same that the Pangea frontend expects, and the frontend will connect to it when the page loads.

The example server is single threaded, so don't get confused by that if you use it and the frontend doesn't connect... another window might already be connected to it.

### API Basics & Setting Up A Game

As described in the YouTube videos, some of the API verbs simply allow for updating associative arrays in the `pangea` object. This is how a game is set up.

All of the properties of `pangea.game` are found in `game.js`:

Example:
```
pangea.game.gametype = "NL Hold'em<br>Blinds: 3/6"
pangea.game.pot = [0]  // List of pots and side pots
pangea.game.bigblind = 6
pangea.game.seats = 9 // 2, 6 and 9 configurations available
```

So to setup a game, the backend sends a JSON string with the API call 'game', followed by an assoc. array setting game properties. The API is 'update only', i.e. any property not set by the API will remain in it's current state. So to set the pot to zero, {'game':{'pot':[0]}} must be sent to the frontend from the server.

*Reminder:* "Setting the pot to zero" on the frontend does not change the game in any way, it is simply a display. The actual pot amount must be kept up to date on the backend. Everything on the frontend is purely an interface and all constraints, etc. must be enforced by the server.

### API Calls For A Hand Of Poker

Writing the JSON for the API calls by hand would be a nightmare, you never want to do that. I'll be using JSON generated for the sample  server by the functions in `sample_games.py`. The JSON string is created by the json.dumps() method of the built-in json lib.

* Setup Game

`{"game": {"tocall": 0, "pot": [0], "bigblind": 3, "gametype": "NL Hold'em<br>Blinds: 3/6"}}`

* Add Seat Information (Players) To Table

The players don't need to be added all at once like this. The API works the same whether upating 1 seat or all 9. Any number of seats and properties can be updated.

`{"seats": [{"name": "espasasp4", "seat": 0, "stack": 563.67, "empty": 0, "playing": 1}, {"name": "aikokj", "seat": 1, "stack": 397.32, "empty": 0, "playing": 1}, {"name": "hondan87", "seat": 2, "stack": 712.93, "empty": 0, "playing": 1}, {"name": "mietlicada", "seat": 3, "stack": 93.83, "empty": 0, "playing": 1}, {"name": "outflowbs", "seat": 4, "stack": 197.88, "empty": 0, "playing": 1}, {"name": "duvaye62", "seat": 5, "stack": 66.82, "empty": 0, "playing": 1}, {"name": "possano9s", "seat": 6, "stack": 285.65, "empty": 0, "playing": 1}, {"name": "fliblySnallbr", "seat": 7, "stack": 254.9, "empty": 0, "playing": 1}, {"name": "oklepankal6", "seat": 8, "stack": 2.34, "empty": 0, "playing": 1}]}`

For example, just one player:

`{"seats": [{"name": "espasasp4", "seat": 0, "stack": 563.67, "empty": 0, "playing": 1}]}`

...and then another:

`{"seats": [{"name": "fliblySnallbr", "seat": 7, "stack": 254.9, "empty": 0, "playing": 1}]}`

The 'seats' value does need to be a list of seats, even if updating only one seat.

* Join A Game

`{"player": {"sitting": 1, "stack": 504.88, "seat": 1}}`

In addition to updating the player object, the seat (seat 1 in this case) needs to be updated too.

`{"seats": [{"player": 1, "name": "LauraPalmer", "playercards": null, "playing": 1, "stack": 504.88, "empty": 0, "seat": 1}]}`

I apologize for including silly properties like 'sitting' and 'player', but they are used right now to manage various states of the seat information elements.

* Dealing And Betting

First, the holecards:

`{"deal": {"holecards": [null, null], "dealer": 0}}`

"dealer" specifies where to place the dealer button. The dealing animation will start with the following occupied seat.

Check;

`{"seats": [{"action": "<span>Check<br></span>", "bet": 0, "seat": 2}]}`

When the player bets, we update the seat infomation, and also the game info for the pot and the "to call" amount:

Bet:

`{"game": {"tocall": 6, "pot": ["6"]}, "seats": [{"action": "<span>Bet<br>6</span>", "bet": 6, "seat": 0}]}`

The 'action' property of the seat displays a status bar on top of the seat. An empty string will clear the status bar. This should probably be renamed to 'status' avoid confusion.

Fold:

`{"action": {"returnPlayerCards": "1"}, "seats": [{"action": "<span>Fold</span>", "seat": 1}]}`

The 'action' API call is used to return player cards to the deck, move chips to the pot, and move chips to a player.

Call:

`{"game": {"pot": ["12"]}, "seats": [{"action": "<span>Call<br>6</span>", "bet": 6, "seat": 2}, {"action": "", "seat": 1}]}`

Raise:

`{"game": {"tocall": 24, "pot": ["42"]}, "seats": [{"action": "<span>Raise<br>24</span>", "bet": 24, "seat": 8}, {"action": "", "seat": 7}]}`

Raising is not different from betting as far as the frontend is concerned, just use the status "Raise" instead of "Bet" and change the 'tocall' amount appropriately.

* End A Round Of Betting

`{"action": {"chipsToPot": 0}, "seats": [{"action": "", "seat": 0}, {"action": "", "seat": 1}, {"action": "", "seat": 2}, {"action": "", "seat": 3}, {"action": "", "seat": 4}, {"action": "", "seat": 5}, {"action": "", "seat": 6}, {"action": "", "seat": 7}, {"action": "", "seat": 8}]}`

Most important is 'chipsToPot'. The 0 following chipsToPot doesn't actually matter, what determines how the pots are displayed is the list of pot and side pot amounts.

* More Dealing

`{"deal": {"board": {"0": "AH", "1": "2C", "2": "6S"}}}`

For the board cards, the position needs to be paired with the code for the card to show.

Suits: "S", "D", "H", "C"
Ranks: "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"

The Turn:

`{"deal": {"board": {"3": "6H"}}}`

The River:

`{"deal": {"board": {"4": "JD"}}}`

# WebSocket Messages To Listen For

The GUI won't do much without checking with the server first, for instance, instead of letting the player just take a seat, a request is sent to the server.

* Request to join a table:

`{"action":{"join":<seat_num>}}`

`{"action":{"join":1}}`

* First person player makes a bet:

{"action":{"bet":"145"}}

* First person player folds:

`{"action":{"fold":"1"}}`

* First person sends chat:

`{"chat":"This is a chat message"}`





