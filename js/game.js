function Game(world, gl, cube, plane, line, hud) {
    
    //pass other objects
    this.gl = gl;
    this.world = world;
    this.hud = hud;
    this.cube = cube;
    this.cube.cBuffer = cube.buffer(this.gl);
    this.plane = plane;
    this.plane.pBuffer = plane.buffer(this.gl);
    this.line = line;
    this.line.lBuffer = line.buffer(this.gl);

    //game functioning
    this.counter = 0;
    this.counterToCreateCube = 10;
    this.invertCounter = 0;
    this.isStarted = false;
    this.isGameOver = false;
    this.arrayLines = [];
    this.arrayCube = [];
}

//RESET

Game.prototype.reset = function(){
    this.arrayCube = [];
    this.world.Zspeed = 3;
    this.world.Xspeed = 4;
    this.counter = 0;
    this.invertCounter = 0;
    this.hud.initial.classList.remove('hide');
    this.hud.gameover.classList.add('hide');
    this.hud.hudWrap.classList.remove('show');
    this.isGameOver = false;
    this.isStarted = false;
    this.hud.score = 0;
    this.hud.distance = 0;
    this.hud.speed = this.world.Zspeed;
    this.world.inversionRotation = 0;
    this.world.isUpsideDown = false;
    this.world.camera[0] = 0;
    this.counterToCreateCube = 10;
}

//LINES 

Game.prototype.drawLines = function(delta){
    for(var i= 0; i < this.arrayLines.length; i++){
        this.arrayLines[i].draw(this.gl, this.arrayLines[i].engine.programInfo, this.line.lBuffer, delta, this.arrayLines[i].Xposition);
    }
}

Game.prototype.createLines = function(){
    for (var i= -this.world.numberOfLines / 2; i < this.world.numberOfLines / 2; i++ ){
        this.arrayLines.push(new Line(this.world.engine, this.world, (this.world.width/ this.world.numberOfLines * i)))
    }  
}

//CUBES

Game.prototype.addCubes = function(){
    this.counter++;
    if(this.counter % this.counterToCreateCube == 0){
        for(var i = 0; i < 14; i++){
            this.arrayCube.push(new Cube(this.world.engine, this.world, Math.random()*this.world.width*2 - this.world.width, -this.world.depth+5));
        }
        if(this.counter > 1000){
            for(var i = 0; i < 4; i++){
                this.arrayCube.push(new Cube(this.world.engine, this.world, Math.random()*this.world.width*2 - this.world.width, -this.world.depth+5));
            }
        }
        if(this.counter > 2000){
            for(var i = 0; i < 4; i++){
                this.arrayCube.push(new Cube(this.world.engine, this.world, Math.random()*this.world.width*2 - this.world.width, -this.world.depth+5));
            }
        }
    }
    if(this.counter % 500 == 0){
        this.counterToCreateCube--;
    }
    if(this.counterToCreateCube < 0){
        this.counterToCreateCube = 0;
    }
}

Game.prototype.drawAllCubes = function(delta){
    for(var i= 0; i < this.arrayCube.length; i++){
        if(this.arrayCube[i].zoom > 50){
            this.arrayCube.splice([i],1);
        }
        this.acelerate(i);
        this.arrayCube[i].draw(this.gl, this.arrayCube[i].engine.programInfo, this.cube.cBuffer, delta, this.arrayCube[i].zoom);
    }
}

// TURN RELATED

Game.prototype.turnRight = function(){
    this.world.rotateDirection = "right";
}

Game.prototype.turnLeft = function(){
    this.world.rotateDirection = "left";
}

Game.prototype.turnWorld = function(){
    if(this.world.rotateDirection ==="right" && this.world.rotation > -this.world.maxRotation){
        this.world.rotation -= 0.5;
    }
    if(this.world.rotateDirection ==="left" && this.world.rotation < this.world.maxRotation){
        this.world.rotation += 0.5;
    }
    if(this.world.rotateDirection === 0 && this.world.rotation !== 0){
        if(this.world.rotation> 0){
            this.world.rotation -= 0.5;
        }else if(this.world.rotation < 0){
            this.world.rotation += 0.5;
        }
    }
}

//INVERT WORLD

Game.prototype.invertRotation = function(){
    this.invertCounter++;
    if(this.invertCounter > 1500 && this.world.inversionRotation < 180 && this.invertCounter < 3000){
        this.world.isUpsideDown = true;
        this.world.inversionRotation += 2.5;
    }
    if(this.invertCounter > 3000 && this.world.inversionRotation > 0 && this.invertCounter < 4500){
        this.world.isUpsideDown = false;
        this.world.inversionRotation -= 2.5;
    }
    if(this.invertCounter > 4500){
        this.invertCounter = 0;
    }
}

//ACELERATION 

Game.prototype.acelerate = function(i){
    this.world.Zspeed += this.world.aceleration;
    this.arrayCube[i].zoom += this.world.Zspeed;
}

//MOVEMENT

Game.prototype.move = function(){
    if(this.world.camera[0] < this.world.width - 40 && this.world.rotateDirection ==="right"){
        this.world.camera[0] += this.world.Xspeed;
    }
    if(this.world.camera[0] > -1* (this.world.width - 40) && this.world.rotateDirection ==="left"){
        this.world.camera[0] -= this.world.Xspeed;
    }
}

//COLOR CHANGES

Game.prototype.changeColors = function(){
    if (this.counter % 1000 == 0 || this.counter == 1){ // Second condition is to trigger the function at the beggining
        
        var colorA = Math.floor(Math.random()*255);
        var colorB = Math.floor(Math.random()*255);
        var colorC = Math.floor(Math.random()*255);
        this.world.cubeColors = [colorA-20,colorB-20,colorC-20];
        this.world.horizonColor = [colorA / 255 , colorB /255 , colorC /255 ,1];
        this.world.planeColor = [colorA+30 , colorB+30, colorC+30];
        this.world.lineColor = [colorA-50, colorB-50, colorC-50];
        this.cube.cBuffer = this.cube.buffer(this.gl);
        this.plane.pBuffer = this.plane.buffer(this.gl);
        this.line.lBuffer = this.line.buffer(this.gl);
        this.hud.hudWrap.setAttribute('style','color: rgb('+ (colorA -80 )+', '+(colorB - 80)+', '+(colorC -80)+')');

    }
}

//COLLISIONS

Game.prototype.checkCollision = function(){
    for(var i= 0; i < this.arrayCube.length; i++){
        if(this.arrayCube[i].zoom > -this.world.collisionSize && this.arrayCube[i].zoom < this.world.collisionSize){
            if(this.world.camera[0] > this.arrayCube[i].position -this.world.collisionSize && this.world.camera[0] < this.arrayCube[i].position + this.world.collisionSize){
                this.collisionConsecuences();
            }
        }
    }
}

Game.prototype.collisionConsecuences = function(){
    this.hud.gameover.classList.remove('hide');
    this.hud.hudWrap.classList.remove('show');
    this.hud.finalDistanceHold.innerText = "Distance travelled: "+ this.truncateDecimals(this.hud.distance);
    this.hud.finalScoreHold.innerText = "Final score: "+ this.truncateDecimals(this.hud.score);
    this.isStarted = false;
    this.isGameOver = true;

}

Game.prototype.truncateDecimals = function (number){
    return (Math.floor(number* 10)) / 10;
}