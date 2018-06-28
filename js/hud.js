function Hud(world){
    this.hudWrap = document.getElementById('hud');
    this.initial = document.getElementById('initial');
    this.gameover = document.getElementById('gameover');
    this.finalScoreHold = document.getElementById('final-score');
    this.finalDistanceHold = document.getElementById('final-distance');
    this.score = 0;
    this.scoreHold = document.getElementById('score');
    this.world = world
    this.speed = world.Zspeed;
    this.speedHold = document.getElementById('speed');
    this.distance = 0;
    this.distanceHold = document.getElementById('distance');
}

Hud.prototype.truncateDecimals = function(number){
    return (Math.floor(number* 10)) / 10;
}
Hud.prototype.updateSpeed = function(){
    this.speedHold.innerText = "SPEED: "+ this.truncateDecimals(30 + this.world.Zspeed);
}
Hud.prototype.updateDistance = function(){
    this.distance += 0.3;
    this.distanceHold.innerText = "DISTANCE: "+ this.truncateDecimals(this.distance);
}
Hud.prototype.updateScore = function(){
    this.score += 13;
    this.scoreHold.innerText = "SCORE: "+ this.truncateDecimals(this.score);
}