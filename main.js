console.log("NordicSail JS running?")
/*----- constants -----*/ 
var NordicS = NordicS || {};

NordicS.weightPerOx = 20;
NordicS.weightPerPerson = 2;
NordicS.foodWeight = 0.6;
NordicS.wpWeight = 5;
NordicS.gameSpeed = 800;
NordicS.dayPerStep = 0.2;
NordicS.foodPerPerson = 0.02;
NordicS.fullSpeed = 5;
NordicS.slowSpeed =3;
NordicS.finalDistance = 1000;
NordicS.eventProbability = 0.15;
NordicS.enemyWeaponDmgAvg = 5;
NordicS.enemyGoldAvg = 50;

NordicS.Game = {};
NordicS.UI = {};
/*----- app's state (variables) -----*/ 
//initate the game
//NordicS.Game.init();
NordicS.Game.init = function(){
    //reference ui
    this.ui = NordicS.UI;
    //reference event manager
    this.eventManager = NordicS.Event;
    //setup ship
    this.ship = NordicS.Ship;
    this.ship.init({
        day:0,
        distance:0,
        clan: 30,
        food: 80,
        ships:2,
        gold: 300,
        weapon:2
    });

    //pass references
    this.ship.ui = this.ui;
    this.ship.eventManager = this.eventManager;

    this.ui.game = this;
    this.ui.ship = this.ship;
    this.ui.eventManager = this.eventManager;

    this.eventManager.game = this;
    this.eventManager.ship = this.ship;
    this.eventManager.ui = this. ui;

    //begin adventure!
    this.startJourney();
};

//start the journey and time starts running
NordicS.Game.startJourney = function(){
    this.gameActive = true;
    this.previousTime = null;
    this.ui.notify('Sail And Pillage The West!', 'positive');

    this.step();
};

//pause the journey
NordicS.Game.pauseJourney = function(){
    this.gameActive = false;
};
//resume the journey
NordicS.Game.resumeJourney = function(){
    this.gameActive = false;
};
/*----- cached element references -----*/ 
document.getElementById('stat-day').innerHTML
document.getElementById('stat-distance').innerHTML
document.getElementById('stat-clan').innerHTML
document.getElementById('stat-ships').innerHTML
document.getElementById('stat-gold').innerHTML
document.getElementById('stat-wp').innerHTML
document.getElementById('stat-loot').innerHTML

//update ship position
document.getElementById('ship')
//show a notification in the message area
NordicS.UI.notify = function(message, type){
    document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.ship.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
  };
/*----- event listeners -----*/ 

//document.getElementsByClassName('product').addEventListener(NordicS.UI.buyProduct);

/*----- functions -----*/

//game loop
NordicS.Game.step = function(timestamp){

    //starting, set up the previous time for the first time
    if(!this.previousTime){
        this.previousTime = timestamp;
        this.updateGame();
    }
    //time difference
    var progress =timestamp - this.previousTime;
    //game update
    if(progress >= NordicS.gameSpeed){
        this.previousTime = timestamp;
        this.updateGame();
    }
    //use "bind" so that it can be refered to the context "this" inside of the step method
    //binds ship animation to active game window animation goes with step counter
    if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
    };

    //update game stats
    NordicS.Game.updateGame = function (){
        //day update
        this.ship.day += NordicS.dayPerStep;

        //food consumption
        this.ship.consumeFood();

        if(this.ship.food ===0){
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
        if(this.ship.clan <= 0){
            this.ship.clan = 0;
            this.ui.notify('Your clan has fallen! Everyone is dead.', 'negative');
            this.gameActive = false;
            return;
        }
        //check win game
        if(this.ship.distance >= NordicS.finalDistance){
            this.ui.notify('You have returned home! Celebrate your victory!', 'positive');
            this.gameActive = false;
            return;
        }
        //random events
        if(Math.random() <= NordicS.eventProbability){
            this.eventManager.generateEvent();
        }
    };

//UI
//refresh visual caravan stats
NordicS.UI.refreshStats = function (){
    //modify dom
    document.getElementById('stat-day').innerHTML = Math.ceil(this.ship.day);
    document.getElementById('stat-distance').innerHTML = Math.floor(this.ship.distance);
    document.getElementById('stat-clan').innerHTML = this.ship.clan;
    document.getElementById('stat-ships').innerHTML = this.ship.ships;
    document.getElementById('stat-food').innerHTML = Math.ceil(this.ship.food);
    document.getElementById('stat-gold').innerHTML = this.ship.gold;
    document.getElementById('stat-wp').innerHTML = this.ship.weapon;
    document.getElementById('stat-loot').innerHTML = Math.ceil(this.ship.loot) + '/' + this.ship.capacity;

    //update ship position
    document.getElementById('ship').style.left = (380 * this.ship.distance/NordicS.finalDistance) + 'px';
};

//show shop
//villageshop products
NordicS.UI.showShop = function(villageshop){
    //get shop area
    var shopDiv = document.getElementById('shop');
    shopDiv.classList.remove('hidden');

    //init the shop just once
    if(!this.shopInitiated){
        //event delegation
        shopDiv.addEventListener('click',function(e){
            //what was clicked
            var target = e.target || e.src;
            
            //exit button
            if(target.tagName == 'BUTTON'){
                //resume journey
                shopDiv.classList.add('hidden');
                NordicS.UI.game.resumeJourney();
            }
            else if(target.tagName == 'DIV'& target.className.match(/villageshop/)){
                console.log('buying')

                var bought = NordicS.UI.buyProduct({
                    item:target.getAttribute('data-item'),  //shop list
                    qty: target.getAttribute('data-qty'),
                    price:target.getAttribute('data-price')
                });
                if(bought)target.html = '';
            }
        });
        this.shopInitated = true;
    }
    //clear existing content
    var prodsDiv = document.getElementById('prods'); //product list from html
    prodsDiv.innerHTML = '';
    //show products
    var product;
    for(var i = 0; i < products.length; i++){
        product = product [i];
        prodsDiv.innerHTML += '<div class = "product" data-qty"' + product.qty + '"data-item=' + product.item + '"data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' -$' + product.price + '</div>';
    }
    //setup click event
};

//buy product
NordicS.UI.buyProduct = function(product){
    //check we can afford it
    if(product.price > NordicS.UI.ship.gold){
        NordicS.UI.notify('Not enough gold! Come back after you pillage some more.', 'negative');
        return false;
    }
    NordicS.UI.ship.gold -= product.price;

    NordicS.UI.ship[product.item] += +product.qty;

    NordicS.UI.notify ('Bought' + product.qty + 'x'+ product.item, 'positive');

    //update weight
    NordicS.UI.ship.updateWeight();
    //update visuals
    NordicS.UI.refreshStats();
    return true;

};

//show attack
NordicS.UI.showAttack = function(weapon,gold){
    var attackDiv = document.getElementById('attack');
    attackDiv.classList.remove('hidden');

    //keep properties
    this.weapon = weapon;
    this. spoils = this. spoils
}