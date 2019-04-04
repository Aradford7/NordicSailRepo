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
/*----- app's state (variables) -----*/ 
//initate the game
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
    this.ui.notify('A great adventure begins', 'positive');

    this.step();
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
/*----- event listeners -----*/ 
/*----- functions -----*/

