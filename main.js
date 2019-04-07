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
    text: 'Another clan raids you! They steal ' 
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'gold',
    value: +150,
    text: 'You took down an rival chief! Gain  ' 
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
    text: 'Found a new ally! Gain ships: '
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
      {item: 'ships', qty: 1, price: 200},
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
      {item: 'ships', qty: 1, price: 200},
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
      {item: 'ships', qty: 1, price: 300},
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
    this.raidEvent(eventData);
  }
};

Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.NordicS[eventData.stat] >= 0) {
    this.NordicS[eventData.stat] += eventData.value;
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
    var ax = Math.round((0.7 +0.6* Math.random())* enemyWeaponDmgAvg);
    var spoils = Math.round((0.7+0.6 * Math.random())*enemyGoldAvg);
    
    this.ui.showRaid(ax,spoils);
};

///////////NordicS/////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

NordicS = {};

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
NordicS.updateWeight = function(){
  var droppedFood = 0;
  var droppedWeapons = 0;

  //how much can the caravan carry
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
NordicS.updateDistance = function() {
  //the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = slowSpeed + diff/this.capacity * fullSpeed;
  this.distance += speed;
};

//food consumption
NordicS.consumeFood = function() {
  this.food -= this.clan * foodPerPerson

  if(this.food < 0) {
    this.food = 0;
  }
};

//////////UI/////////////////////////////////////////

UI = {};

//show a notification in the message area
UI.notify = function(message, type){
  document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.NordicS.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
};

//refresh visual caravan stats
UI.refreshStats = function() {
  //modify the dom
  document.getElementById('stat-day').innerHTML = Math.ceil(this.NordicS.day);
  document.getElementById('stat-distance').innerHTML = Math.floor(this.NordicS.distance);
  document.getElementById('stat-clan').innerHTML = this.NordicS.clan;
  document.getElementById('stat-ships').innerHTML = this.NordicS.ships;
  document.getElementById('stat-food').innerHTML = Math.ceil(this.NordicS.food);
  document.getElementById('stat-gold').innerHTML = this.NordicS.gold;
  document.getElementById('stat-ax').innerHTML = this.NordicS.ax;
  document.getElementById('stat-weight').innerHTML = Math.ceil(this.NordicS.weight) + '/' + this.NordicS.capacity;

  //update caravan position
  document.getElementById('vship').style.left = (380 * this.NordicS.distance/finalDistance) + 'px';
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

        //console.log('buying')

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

//show attack
UI.showRaid = function(ax, spoils) {
  var raidDiv = document.getElementById('raid');
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

//RAID
UI.raid = function(){

  var ax = this.ax;
  var spoils = this.spoils;

  var damage = Math.ceil(Math.max(0, ax * 2 * Math.random() - this.NordicS.ax));

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

  var ax = this.ax;

  var damage = Math.ceil(Math.max(0, ax * Math.random()/2));

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



//constants
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

//initiate the game
Game.init = function(){

  //reference ui
  this.ui = UI;

  //reference event manager
  this.eventManager = Event;

  //setup caravan
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




///image animations
function myDragon(){
  document,getElementById("dragon").style.WebkitAnimationDirection = "alternate-reverse";
  document.getElementById("dragon").style.animationDirection = "alternate-reverse";
}