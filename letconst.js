
//THIS FILE IS ACTIVELY WORKING NEW UPDATED VARIABLES


///music
// const isChrome browser = test for chrome and google if it not chrome then remove the iframe link and play Audio. 
// iframe= chrome
//so if it is chrome iframe plays.
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
if(!isChrome){
  $('#iframeAudio').remove()
}
else{
 $('#playAudio').remove() //just to make sure that it will not have 2x audio in the background 
}


//object.addEventListener("load", myScript);
//////////////////////////////////////////////////////////////////////////////
///EVENTS///////////////////////

// Event object elements of event type inside// get rid of first object and make it DRY-ER!!
const Event = {};

Event.eventTypes = [
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'clan',
    value: -3,
    text: 'Alcohol intoxication. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'clan',
    value: -2,
    text: 'Rebellion! Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Fat Stoick ate all the raid provisions! Food lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'gold',
    value: -50,
    text: 'Another clan raids you! Gold lost:' 
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'gold',
    value: +300,
    text: 'You took down an rival chief! Gold gain:  ' 
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'ships',
    value: -1,
    text: 'Your ships were destroyed during battle. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found a school of fish! Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Raided a farmer! Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'ships',
    value: 3,
    text: 'Found a new ally! Ships gained: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'clan',
    value: 3,
    text: 'Saved a viking village! Gain clansmen: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a merchant!',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'ships', qty: 1, price: 300},
      {item: 'ax', qty: 2, price: 50},
      {item: 'clan', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found an ally merchant',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'ships', qty: 1, price: 100},
      {item: 'ax', qty: 2, price: 20},
      {item: 'clan', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Stumble upon a viking village selling various goods!',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'ships', qty: 1, price: 200},
      {item: 'ax', qty: 2, price: 80},
      {item: 'clan', qty: 5, price: 60}
    ]
  },
  {
    type: 'RAID',
    notification: 'negative',
    text: 'Villagers are attacking you!'
  },
  {
    type: 'RAID',
    notification: 'negative',
    text: 'Villagers are attacking you!'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Rival vikings are attacking you!'
  }
];
// Function pulls object Event and generates events by randomly selecting one from eventindex
// math floor rounds down the number to whole and math randomize times entire length of the eventtype string from Event object literal
//eventdata  =  event types[calls on index]
//if event data  type is stat-change - this object stateChangeEvent shows the eventData; event that consist in updating a stat
Event.generateEvent = function(){
  //pick random one
  let eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  let eventData = this.eventTypes[eventIndex];

  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  }

  //shops 
  // if the eventData type is shop then pause the game, tell the user (object ui) to notify player with the eventData text and notification.
  //this shopEvent pulls from eventData and this. state ChangeEvent(eventData) so it updates
  //this.shopEvent prepares the event to run
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.shopEvent(eventData);
  }

  //attacks
  // if the eventData type is Raid then pause the game, tell the user(UI) the eventdata text and notification
  //this raidEvent pulls from the event Data and changes the update the eventdata
  //and prepares the event to run
  else if(eventData.type == 'RAID') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.raidEvent(eventData);
  }
};
//function for the stateChange event to activate
// cant have negative quantiies if the eventdata value and the game eventdata stat is over or equal to 0
//then the object game(eventdata stats) adds to the eventdata value
//then the ui notify player the eventtext and rounds the eventdata value as whole numbers and shows eventdata notification.
Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.NordicS[eventData.stat] >= 0) {
    this.NordicS[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};
// object event that calls upon shopEvent is equal to eventData (same array)
//let number of products for sale equal to a random number up to 4 items
//product list is in a set array, declare variables j and priceFactor
//for loop i = 0, i is less than number of product (4), j equal to rounding down to whole number  and randomizing the products in that array
// priceFactor sets a random price between 30-35% of original set price (so each item can have different prices)
//then push the product in the new array - with elements of the item product, the quantity, and random product price * the scale of the price 30-35%
//the ui shows players of the products in the show with item price and  qty 
Event.shopEvent = function(eventData) {
  //number of products for sale
  let numProds = Math.ceil(Math.random() * 4);

  //product list
  let products = [];
  let j, priceFactor;

  for(let i = 0; i < numProds; i++) {
    //random product
    j = Math.floor(Math.random() * eventData.products.length);

    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }

  this.ui.showShop(products);
};



//prepare an attack event
//object event raid events function calls on ax(weapondamage) = round between 30-35% of base enemy damage
//spoils(gold)rounds 30-35% of the enemy gold average
//30-35% give user advantage to overtake the AI increasing chance of winning
//show the gold and damage to player via ui object (only the numbers!) later they are put in a string to show the notifcation to user
Event.raidEvent = function(eventData){
    let ax = Math.round((0.7 +0.6* Math.random())* enemyWeaponDmgAvg);
    let spoils = Math.round((0.7+0.6 * Math.random())*enemyGoldAvg);
    
    this.ui.showRaid(ax,spoils);
};

///////////NordicS=player/////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//this is the Game function! NordicS= Game controls
 const NordicS = {};

//game starts allow these stats to be objects can be alter/call upon later as the game updates itself with values from the eventtypes
NordicS.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.clan = stats.clan;
  this.food = stats.food;
  this.ships = stats.ships;
  this.gold= stats.gold;
  this.ax = stats.ax;
};


//update weight and capacity
// game update weight stats, ship starts up with dropping 0 food and weapons, decalre droppedFood and droppedWeapons as a variable to be able to alter later as
//the ship weight increases and maxed out. If max out drop the items.
//capacity is equal to (number of ships* weight of the ships) add + (number of clan people * weight of each clan person)//HOW MUCH IT CAN CARRY
//Current weight this weight equal to (number of food *food weight) + (number of weapons-ax * weapon weight ) //Tracks weight the player has only values that contribute to capacity player has
//to drop items... drop items if the weight is over the capacity of what the ship can hold (number of ship/wt and number of ppl*weight)
//while loop ( ax and capacity is less than current weight), decrease ax by 1 and the capacity decrease its value by the weapon weight. increase the droppweapon number to show how many weapons are dropped
//if weapons are dropped tell the user via ui that x amount of weapons were dropped, negative is only to show color style to the notification message that its a negative stat.
//another exact function to show that food has been dropped
NordicS.updateWeight = function(){
  let droppedFood = 0;
  let droppedWeapons = 0;

  //how much can the ship carry
  this.capacity = this.ships * weightPerShip + this.clan* weightPerPerson;

  //how much weight do we currently have
  this.weight = this.food * foodWeight + this.ax * axWeight;

  //drop things behind if it's too much weight
  //assume guns get dropped before food
  while(this.ax && this.capacity <= this.weight) {
    this.ax--;
    this.weight -= axWeight;
    droppedWeapons++;
  }

  if(droppedWeapons) {
    this.ui.notify('Left '+droppedWeapons+' axes behind', 'negative');
  }

  while(this.food && this.capacity <= this.weight) {
    this.food--;
    this.weight -= foodWeight;
    droppedFood++;
  }

  if(droppedFood) {
    this.ui.notify('Left '+droppedFood+' food provisions behind', 'negative');
  }
};

//update covered distance

//object game update distance function
// let the difference =  to capacity minus weight
// let the speed =  (slow speed + difference of capacity and weight / capacity * fullspeed)
// speed =  set variable of slow + weight difference then / max of capacity * full speed to allow speed to increase or decrease depending on how much weight being carried
//basically like oxen in Oregon trail, more oxen = faster speed
// allow the distance to increase by adding speed
NordicS.updateDistance = function() {
  //the closer to capacity, the slower
  let diff = this.capacity - this.weight;
  let speed = slowSpeed + diff/this.capacity * fullSpeed;
  this.distance += speed;
};

//food consumption

// game object consume food function
// food decreases by number of people in the clan* require amount of food per person
// if the food is less than 0 food strictly equal to 0 // set this so it can be called upon later in ui to show user than they lost bc clan starved to death
//loss condition food == 0  then game is lost.
NordicS.consumeFood = function() {
  this.food -= this.clan * foodPerPerson

  if(this.food < 0) {
    this.food = 0;
  }
};

//////////UI/////////////////////////////////////////

const UI = {};



//show a notification in the message area
// pulls object UI 's notification to appear in the updates area via dom maniuplation 
// this allow the div class containing update to display current day (math ceil to give whole number increase on current day(nordics.day) and current message in div via dom multipation
UI.notify = function(message, type){
  document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.NordicS.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
};

/*----- cached element references -----*/ 
//refresh visual ship stats

UI.refreshStats = function() {
  //modify the dom

  //dom modification to show updated/dynamic stat change and give whole intergers
  document.getElementById('stat-day').innerHTML = Math.ceil(this.NordicS.day);  //ceil increase
  document.getElementById('stat-distance').innerHTML = Math.floor(this.NordicS.distance);  //floor round down to closet whole number
  document.getElementById('stat-clan').innerHTML = this.NordicS.clan;
  document.getElementById('stat-ships').innerHTML = this.NordicS.ships;
  document.getElementById('stat-food').innerHTML = Math.ceil(this.NordicS.food);
  document.getElementById('stat-gold').innerHTML = this.NordicS.gold;
  document.getElementById('stat-ax').innerHTML = this.NordicS.ax;
  document.getElementById('stat-weight').innerHTML = Math.ceil(this.NordicS.weight) + '/' + this.NordicS.capacity; // shows in  ui like this current weight / max weight (both stat changes max weight due # of ships)

  //update ship position

  //dom mod to dynamically grab the ship image and style it to move left to (base speed of 380 * current game distance/final distance) 
  //px string image to move
  document.getElementById('vship').style.left = (380 * this.NordicS.distance/finalDistance) + 'px';
};

//show shop

//UI shop items to show for user
// shop div calls on shop remove the hidden class once shop is initaited
// if shop not  initated  add eventlistner to target e. src = product 
UI.showShop = function(products){

  //get shop area
  let shopDiv = document.getElementById('shop');
  shopDiv.classList.remove('hidden');

  //init the shop just once
  if(!this.shopInitiated) {               //needs to be not initated so that the eventlistner can target the user choice of item to buy or not to buy but to continue the game by exit after hitting button

    //event delegation
    shopDiv.addEventListener('click', function(e){
      //what was clicked
      let target = e.target || e.src;

      //exit button
      if(target.tagName == 'BUTTON') {          // after target if the the target has tag name  ==  button exit by hiding the shop and resume journey, if doesnt buy just to continue the game
        //resume journey
        shopDiv.classList.add('hidden');
        UI.game.resumeJourney();
      }
      else if(target.tagName == 'DIV' && target.className.match(/product/)) {      //if else the target tag name == 'DIV' and the target className match in products 

        //console.log('buying')

        // bought =  buy product in UI. show item attribute data item, show item attribute qty and price
        let bought = UI.buyProduct({
          item: target.getAttribute('data-item'),
          qty: target.getAttribute('data-qty'),
          price: target.getAttribute('data-price')
        });

        if(bought) target.html = '';    // if the item is bought target the inner html in shopDiv products
      }
    });

    this.shopInitiated = true;
  }

  //clear existing content

  // let the product div dom manipluation from inner html
  let prodsDiv = document.getElementById('prods');
  prodsDiv.innerHTML = '';

  //show products
  
  // product for i = 0, and i is less than the product length increase make product =  to product[i] <= so all items are in an array
  // use dom manipluation to pull the inner html prod and link product qty, product item and product price
  let product;
  for(let i=0; i < products.length; i++) {
    product = products[i];
    prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
  }

  //setup click event
  //document.getElementsByClassName('product').addEventListener(UI.buyProduct);
};

//buy product
//

UI.buyProduct = function(product) {
  //check we can afford it
  if(product.price > UI.NordicS.gold) {
    UI.notify('Not enough gold!', 'negative');
    return false;
  }

  UI.NordicS.gold -= product.price;

  UI.NordicS[product.item] += +product.qty;

  UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

  //update weight
  UI.NordicS.updateWeight();

  //update visuals
  UI.refreshStats();

  return true;

};
/*----- event listeners -----*/
//show attack
UI.showRaid = function(ax, spoils) {
  let raidDiv = document.getElementById('raid');
  raidDiv.classList.remove('hidden');

  //keep properties
  this.ax = ax;
  this.spoils = spoils;

  //show firepower
  document.getElementById('attack-description').innerHTML = 'Weapon Damage: ' + ax;

  //init once
  if(!this.raidInitiated) {

    //fight
    document.getElementById('raid').addEventListener('click', this.raid.bind(this));

    //run away
    document.getElementById('retreat').addEventListener('click', this.retreat.bind(this));

    this.attackInitiated = true;
  }
};
/*----- functions -----*/
//RAID
UI.raid = function(){

  let ax = this.ax;
  let spoils = this.spoils;

  let damage = Math.ceil(Math.max(0, ax * 2 * Math.random() - this.NordicS.ax));

  //check there are survivors
  if(damage < this.NordicS.clan) {
    this.NordicS.clan -= damage;
    this.NordicS.gold += spoils;
    this.notify(damage + ' '+'warriors are in Valhalla now...', 'negative');
    this.notify('Found ' + spoils + ' gold worth of loot');
  }
  else {
    this.NordicS.clan = 0;
    this.notify('You have fallen in battle! Your clan has reach Valhalla!', 'negative');
  }

  //resume journey
  document.getElementById('raid').classList.add('hidden');
  this.game.resumeJourney();
};

//runing away from enemy
UI.retreat = function(){

  let ax = this.ax;

  let damage = Math.ceil(Math.max(0, ax * Math.random()/2));

  //check there are survivors
  if(damage < this.NordicS.clan) {
    this.NordicS.clan -= damage;
    this.notify(damage + '' + ' clansmen were killed during the retreat!', 'negative');
  }
  else {
    this.NordicS.clan = 0;
    this.notify('Everyone died during the retreat,', 'negative');
  }

  //remove event listener
  document.getElementById('retreat').removeEventListener('click', UI.retreat);

  //resume journey
  document.getElementById('raid').classList.add('hidden');
  this.game.resumeJourney();

};


//constants/////////////////////////////////CONSTANTS///////////////////////////////////
/*----- constants -----*/
weightPerShip = 20;
weightPerPerson = 2;
foodWeight = 0.6;
axWeight = 5;
gameSpeed= 800;
dayPerStep = 0.2; //0.2 for gameplay
foodPerPerson= 0.02;
fullSpeed = 5;
slowSpeed = 3;
finalDistance = 1000;
eventProbability = 0.15;
enemyWeaponDmgAvg = 5;
enemyGoldAvg = 50;

Game = {};

/*----- app's state (variables) -----*/
//initiate the game
Game.init = function(){

  //reference ui
  this.ui = UI;

  //reference event manager
  this.eventManager = Event;

  //setup game
  this.NordicS = NordicS;
  this.NordicS.init({
    day: 0,
    distance: 0,
    clan: 30,
    food: 80,
    ships: 2,
    gold: 300,
    ax: 2
  });

  //pass references
  this.NordicS.ui = this.ui;
  this.NordicS.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.NordicS = this.NordicS;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.NordicS = this.NordicS;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start the journey and time starts running
Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('Sail And Pillage The West', 'positive');

  this.step();
};

//game loop
Game.step = function(timestamp) {

  //starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  //time difference
  let progress = timestamp - this.previousTime;

  //game update
  if(progress >= gameSpeed) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  //we use "bind" so that we can refer to the context "this" inside of the step method
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
Game.updateGame = function() {
 
  //day update
  this.NordicS.day += dayPerStep;

  //food consumption
  this.NordicS.consumeFood();

  if(this.NordicS.food === 0) {
    this.ui.notify('Your clan starved to death!', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.NordicS.updateWeight();

  //update progress
  this.NordicS.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.NordicS.clan <= 0) {
    this.NordicS.clan = 0;
    this.ui.notify('Your clan has fallen! Everyone is dead', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.NordicS.distance >= finalDistance) {
    this.ui.notify('Bless Odin! You have returned home! Celebrate your victory!', 'positive');
    this.gameActive = false;
    return;
  }

  //random events
  if(Math.random() <= eventProbability) {
    this.eventManager.generateEvent();
  }
};

//pause the journey
Game.pauseJourney = function() {
  this.gameActive = false;
};

//resume the journey
Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};


//init game
Game.init();



/*----- event listeners -----*/
///image animations
function myDragon(){
  document,getElementById("dragon").style.WebkitAnimationDirection = "alternate-reverse";
  document.getElementById("dragon").style.animationDirection = "alternate-reverse";
}

document.getElementById("rulecontainer").addEventListener('mouseover', () => 
  document.getElementById('text').classList.add('show')
)

document.getElementById("rulecontainer").addEventListener('mouseout', () => 
  document.getElementById('text').classList.remove('show')
)

document.getElementById("contactinfo").addEventListener('mouseover', () => 
  document.getElementById('contactlinks').classList.add('show')
)

document.getElementById("contactinfo").addEventListener('mouseout', () => 
  document.getElementById('contactlinks').classList.remove('show')
)

//render

// function render() {
// 	renderHands();
// 	renderControls();
// 	if (this.NordicS.distance >= finalDistance) {
// 		renderWinnerMessage('You have won!');
// 	} else {
// 		renderTurnMessage();
// 	}
// }