console.log("Nordic Sail Game");
//////////////////////////////////////////////////////////////////////////////
///EVENTS///////////////////////
Event = {};

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
    value: -4,
    text: 'Rebellion!. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Fat Stoick eat all the raid provisions!. Food lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'gold',
    value: -50,
    text: 'Another clan raids you! They steal '
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
    text: 'Found a school of fish!. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Raided a farmer!. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'ships',
    value: 1,
    text: 'Found a new ally!. Gain ships: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a merchant!',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'ships', qty: 1, price: 200},
      {item: 'wp', qty: 2, price: 50},
      {item: 'clan', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found an ally merchant',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'ships', qty: 1, price: 200},
      {item: 'wp', qty: 2, price: 20},
      {item: 'clan', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Stumble upon a viking village selling various goods!',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'ships', qty: 1, price: 300},
      {item: 'wp', qty: 2, price: 80},
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

Event.generateEvent = function(){
  //pick random one
  var eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  var eventData = this.eventTypes[eventIndex];

  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  }

  //shops
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.shopEvent(eventData);
  }

  //attacks
  else if(eventData.type == 'RAID') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.attackEvent(eventData);
  }
};

Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.ship[eventData.stat] >= 0) {
    this.ship[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

Event.shopEvent = function(eventData) {
  //number of products for sale
  var numProds = Math.ceil(Math.random() * 4);

  //product list
  var products = [];
  var j, priceFactor;

  for(var i = 0; i < numProds; i++) {
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
Event.raidEvent = function(eventData){
    var wp = Math.round((0.7 +0.6* Math*random())* enemyWeaponDmgAvg);
    var spoils = Math.round((0.7+0.6 * Math.random())*enemyGoldAvg);
    
    this.ui.showRaid(wp,spoils);
};

///////////SHIP/////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Ship = {};

Ship.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.clan = stats.clan;
  this.food = stats.food;
  this.ships = stats.ships;
  this.gold= stats.gold;
  this.wp = stats.wp;
};


//update weight and capacity
Ship.updateWeight = function(){
  var droppedFood = 0;
  var droppedWeapons = 0;

  //how much can the caravan carry
  this.capacity = this.ships * weightPerShip + this.clan* weightPerPerson;

  //how much weight do we currently have
  this.weight = this.food * foodWeight + this.wp * wpWeight;

  //drop things behind if it's too much weight
  //assume guns get dropped before food
  while(this.wp && this.capacity <= this.weight) {
    this.wp--;
    this.weight -= wpWeight;
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
Ship.updateDistance = function() {
  //the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = slowSpeed + diff/this.capacity * fullSpeed;
  this.distance += speed;
};

//food consumption
Ship.consumeFood = function() {
  this.food -= this.clan * foodPerPerson

  if(this.food < 0) {
    this.food = 0;
  }
};

//////////UI/////////////////////////////////////////

UI = {};

//show a notification in the message area
UI.notify = function(message, type){
  document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.ship.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
};

//refresh visual caravan stats
UI.refreshStats = function() {
  //modify the dom
  document.getElementById('stat-day').innerHTML = Math.ceil(this.ship.day);
  document.getElementById('stat-distance').innerHTML = Math.floor(this.ship.distance);
  document.getElementById('stat-clan').innerHTML = this.ship.clan;
  document.getElementById('stat-ships').innerHTML = this.ship.ships;
  document.getElementById('stat-food').innerHTML = Math.ceil(this.ship.food);
  document.getElementById('stat-gold').innerHTML = this.ship.gold;
  document.getElementById('stat-wp').innerHTML = this.ship.wp;
  document.getElementById('stat-weight').innerHTML = Math.ceil(this.ship.weight) + '/' + this.ship.capacity;

  //update caravan position
  document.getElementById('vship').style.left = (380 * this.ship.distance/finalDistance) + 'px';
};

//show shop
UI.showShop = function(products){

  //get shop area
  var shopDiv = document.getElementById('shop');
  shopDiv.classList.remove('hidden');

  //init the shop just once
  if(!this.shopInitiated) {

    //event delegation
    shopDiv.addEventListener('click', function(e){
      //what was clicked
      var target = e.target || e.src;

      //exit button
      if(target.tagName == 'BUTTON') {
        //resume journey
        shopDiv.classList.add('hidden');
        UI.game.resumeJourney();
      }
      else if(target.tagName == 'DIV' && target.className.match(/product/)) {

        console.log('buying')

        var bought = UI.buyProduct({
          item: target.getAttribute('data-item'),
          qty: target.getAttribute('data-qty'),
          price: target.getAttribute('data-price')
        });

        if(bought) target.html = '';
      }
    });

    this.shopInitiated = true;
  }

  //clear existing content
  var prodsDiv = document.getElementById('prods');
  prodsDiv.innerHTML = '';

  //show products
  var product;
  for(var i=0; i < products.length; i++) {
    product = products[i];
    prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
  }

  //setup click event
  //document.getElementsByClassName('product').addEventListener(UI.buyProduct);
};

//buy product
UI.buyProduct = function(product) {
  //check we can afford it
  if(product.price > UI.ship.gold) {
    UI.notify('Not enough gold!', 'negative');
    return false;
  }

  UI.ship.gold -= product.price;

  UI.ship[product.item] += +product.qty;

  UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

  //update weight
  UI.ship.updateWeight();

  //update visuals
  UI.refreshStats();

  return true;

};

//show attack
UI.showRaid = function(wp, spoils) {
  var raidDiv = document.getElementById('raid');
  raidDiv.classList.remove('hidden');

  //keep properties
  this.wp = wp;
  this.spoils = spoils;

  //show firepower
  document.getElementById('attack-description').innerHTML = 'Weapon Damage: ' + firepower;

  //init once
  if(!this.raidInitiated) {

    //fight
    document.getElementById('raid').addEventListener('click', this.raid.bind(this));

    //run away
    document.getElementById('retreat').addEventListener('click', this.retreat.bind(this));

    this.attackInitiated = true;
  }
};

//RAID
UI.raid = function(){

  var wp = this.wp;
  var spoils = this.spoils;

  var damage = Math.ceil(Math.max(0, wp * 2 * Math.random() - this.ship.wp));

  //check there are survivors
  if(damage < this.ship.clan) {
    this.ship.clan -= damage;
    this.ship.gold += spoils;
    this.notify(damage + 'warriors are in Valhalla now...', 'negative');
    this.notify('Found ' + spoils, 'worth of loot');
  }
  else {
    this.ship.clan = 0;
    this.notify('You have fallen in battle! Your clan has reach Valhalla!', 'negative');
  }

  //resume journey
  document.getElementById('raid').classList.add('hidden');
  this.game.resumeJourney();
};

//runing away from enemy
UI.retreat = function(){

  var wp = this.wp;

  var damage = Math.ceil(Math.max(0, wp * Math.random()/2));

  //check there are survivors
  if(damage < this.ship.clan) {
    this.ship.clan -= damage;
    this.notify(damage + ' clansmen were killed during the retreat!', 'negative');
  }
  else {
    this.ship.clan = 0;
    this.notify('Everyone died during the retreat,', 'negative');
  }

  //remove event listener
  document.getElementById('retreat').removeEventListener('click');

  //resume journey
  document.getElementById('raid').classList.add('hidden');
  this.game.resumeJourney();

};



//constants
weightPerShip = 20;
weightPerPerson = 2;
foodWeight = 0.6;
wpWeight = 5;
gameSpeed= 800;
dayPerStep = 0.2;
foodPerPerson= 0.02;
fullSpeed = 5;
slowSpeed = 3;
finalDistance = 1000;
eventProbability = 0.15;
enemyWeaponDmgAvg = 5;
enemyGoldAvg = 50;

Game = {};

//initiate the game
Game.init = function(){

  //reference ui
  this.ui = UI;

  //reference event manager
  this.eventManager = Event;

  //setup caravan
  this.ship = Ship;
  this.ship.init({
    day: 0,
    distance: 0,
    clan: 30,
    food: 80,
    ship: 2,
    gold: 300,
    wp: 2
  });

  //pass references
  this.ship.ui = this.ui;
  this.ship.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.ship = this.ship;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.ship = this.ship;
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
  var progress = timestamp - this.previousTime;

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
  this.ship.day += dayPerStep;

  //food consumption
  this.ship.consumeFood();

  if(this.ship.food === 0) {
    this.ui.notify('Your clan starved to death!', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.ship.updateWeight();

  //update progress
  this.ship.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.ship.clan <= 0) {
    this.ship.clan = 0;
    this.ui.notify('Your clan has fallen! Everyone is dead', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.ship.distance >= finalDistance) {
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