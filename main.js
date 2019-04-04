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
/*----- cached element references -----*/ 
/*----- event listeners -----*/ 
/*----- functions -----*/

//initate the game
NordicS.Game.init = function(){
    //reference ui
    this.ui = NordicS.UI;
    //reference event manager
    this.eventManager = NordicS.Event;
    //setup ship
    this.ship = NordicS.Ship;
}