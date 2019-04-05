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
    stat: 'ship',
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
    stat: 'ship',
    value: 1,
    text: 'Found a new ally!. Gain ships: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a merchant!',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'ship', qty: 1, price: 200},
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
      {item: 'ship', qty: 1, price: 200},
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
      {item: 'ship', qty: 1, price: 300},
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

///////////SHIP/////////////

Ship = {};

Ship.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.clan = stats.clan;
  this.food = stats.food;
  this.ship = stats.oxen;
  this.gold= stats.gold;
  this.wp = stats.wp;
};


//update weight and capacity
Ship.updateWeight = function(){
  var droppedFood = 0;
  var droppedWeapons = 0;

  //how much can the caravan carry
  this.capacity = this.ship * weightPerShip + this.clan* weightPerPerson;

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
Caravan.updateDistance = function() {
  //the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = SLOW_SPEED + diff/this.capacity * FULL_SPEED;
  this.distance += speed;
};

//food consumption
Caravan.consumeFood = function() {
  this.food -= this.crew * FOOD_PER_PERSON;

  if(this.food < 0) {
    this.food = 0;
  }
};



UI = {};

//show a notification in the message area
UI.notify = function(message, type){
  document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.caravan.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
};

//refresh visual caravan stats
UI.refreshStats = function() {
  //modify the dom
  document.getElementById('stat-day').innerHTML = Math.ceil(this.caravan.day);
  document.getElementById('stat-distance').innerHTML = Math.floor(this.caravan.distance);
  document.getElementById('stat-crew').innerHTML = this.caravan.crew;
  document.getElementById('stat-oxen').innerHTML = this.caravan.oxen;
  document.getElementById('stat-food').innerHTML = Math.ceil(this.caravan.food);
  document.getElementById('stat-money').innerHTML = this.caravan.money;
  document.getElementById('stat-firepower').innerHTML = this.caravan.firepower;
  document.getElementById('stat-weight').innerHTML = Math.ceil(this.caravan.weight) + '/' + this.caravan.capacity;

  //update caravan position
  document.getElementById('caravan').style.left = (380 * this.caravan.distance/FINAL_DISTANCE) + 'px';
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
  if(product.price > UI.caravan.money) {
    UI.notify('Not enough money', 'negative');
    return false;
  }

  UI.caravan.money -= product.price;

  UI.caravan[product.item] += +product.qty;

  UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

  //update weight
  UI.caravan.updateWeight();

  //update visuals
  UI.refreshStats();

  return true;

};

//show attack
UI.showAttack = function(firepower, gold) {
  var attackDiv = document.getElementById('attack');
  attackDiv.classList.remove('hidden');

  //keep properties
  this.firepower = firepower;
  this.gold = gold;

  //show firepower
  document.getElementById('attack-description').innerHTML = 'Firepower: ' + firepower;

  //init once
  if(!this.attackInitiated) {

    //fight
    document.getElementById('fight').addEventListener('click', this.fight.bind(this));

    //run away
    document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

    this.attackInitiated = true;
  }
};

//fight
UI.fight = function(){

  var firepower = this.firepower;
  var gold = this.gold;

  var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.caravan.firepower));

  //check there are survivors
  if(damage < this.caravan.crew) {
    this.caravan.crew -= damage;
    this.caravan.money += gold;
    this.notify(damage + ' people were killed fighting', 'negative');
    this.notify('Found $' + gold, 'gold');
  }
  else {
    this.caravan.crew = 0;
    this.notify('Everybody died in the fight', 'negative');
  }

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();
};

//runing away from enemy
UI.runaway = function(){

  var firepower = this.firepower;

  var damage = Math.ceil(Math.max(0, firepower * Math.random()/2));

  //check there are survivors
  if(damage < this.caravan.crew) {
    this.caravan.crew -= damage;
    this.notify(damage + ' people were killed running', 'negative');
  }
  else {
    this.caravan.crew = 0;
    this.notify('Everybody died running away', 'negative');
  }

  //remove event listener
  document.getElementById('runaway').removeEventListener('click');

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();

};



//constants
WEIGHT_PER_OX = 20;
WEIGHT_PER_PERSON = 2;
FOOD_WEIGHT = 0.6;
FIREPOWER_WEIGHT = 5;
GAME_SPEED = 800;
DAY_PER_STEP = 0.2;
FOOD_PER_PERSON = 0.02;
FULL_SPEED = 5;
SLOW_SPEED = 3;
FINAL_DISTANCE = 1000;
EVENT_PROBABILITY = 0.15;
ENEMY_FIREPOWER_AVG = 5;
ENEMY_GOLD_AVG = 50;

Game = {};

//initiate the game
Game.init = function(){

  //reference ui
  this.ui = UI;

  //reference event manager
  this.eventManager = Event;

  //setup caravan
  this.caravan = Caravan;
  this.caravan.init({
    day: 0,
    distance: 0,
    crew: 30,
    food: 80,
    oxen: 2,
    money: 300,
    firepower: 2
  });

  //pass references
  this.caravan.ui = this.ui;
  this.caravan.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.caravan = this.caravan;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.caravan = this.caravan;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start the journey and time starts running
Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('A great adventure begins', 'positive');

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
  if(progress >= GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  //we use "bind" so that we can refer to the context "this" inside of the step method
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
Game.updateGame = function() {
  //day update
  this.caravan.day += DAY_PER_STEP;

  //food consumption
  this.caravan.consumeFood();

  if(this.caravan.food === 0) {
    this.ui.notify('Your caravan starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.caravan.updateWeight();

  //update progress
  this.caravan.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.caravan.crew <= 0) {
    this.caravan.crew = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.caravan.distance >= FINAL_DISTANCE) {
    this.ui.notify('You have returned home!', 'positive');
    this.gameActive = false;
    return;
  }

  //random events
  if(Math.random() <= EVENT_PROBABILITY) {
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