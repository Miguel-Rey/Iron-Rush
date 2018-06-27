function Game(world) {
    this.world = world;
    this.prevTime = 0;
    this.counter = 0;
    this.counterToCreateCube = 10;
    this.isStarted = false;
    this.isGameOver = false;
}

Game.prototype.reset = function(){
    arrayCube = [];
    world.Zspeed = 3;
    world.Xspeed = 1.5;
    counter = 0;
    invertCounter = 0;
    initial.classList.remove('hide');
    gameover.classList.add('hide');
    hud.classList.remove('show');
    isGameOver = false;
    isStarted = false;
    score = 0;
    distance = 0;
    speed = world.Zspeed;
    world.inversionRotation = 0;
    world.isUpsideDown = false;
    world.camera[0] = 0;
}

//LINES IN GROUND

Game.prototype.drawLines = function(delta){
    for(var i= 0; i < arrayLines.length; i++){
        arrayLines[i].draw(gl, arrayLines[i].engine.programInfo, lBuffer, delta, arrayLines[i].Xposition);
    }
}

//CUBE RELATED

function addCubes(){
    counter++;
    if(counter % counterToCreateCube == 0){
        for(var i = 0; i < 14; i++){
            arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));
        }
        if(counter > 1000){
            for(var i = 0; i < 4; i++){
                arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));
            }
        }
        if(counter > 2000){
            for(var i = 0; i < 4; i++){
                arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));
            }
        }
    }
    if(counter % 500 == 0){
        counterToCreateCube--;
    }
    if(counterToCreateCube < 0){
        counterToCreateCube = 0;
    }
}

function drawAllCubes(delta){
    for(var i= 0; i < arrayCube.length; i++){
        if(arrayCube[i].zoom > 50){
            arrayCube.splice([i],1);
        }
        acelerate(i);
        arrayCube[i].draw(gl, arrayCube[i].engine.programInfo, cBuffer, delta, arrayCube[i].zoom);
    }
}

function acelerate(i){
    world.Zspeed += world.aceleration;
    arrayCube[i].zoom += world.Zspeed;
}

// TURN/MOVEMENT RELATED

function turnRight(){
    world.rotateDirection = "right";
}

function turnLeft(){
    world.rotateDirection = "left";
}

function turnWorld(){
    if(world.rotateDirection ==="right" && world.rotation > -world.maxRotation){
        world.rotation -= 0.5;
    }
    if(world.rotateDirection ==="left" && world.rotation < world.maxRotation){
        world.rotation += 0.5;
    }
    if(world.rotateDirection === 0 && world.rotation !== 0){
        if(world.rotation> 0){
            world.rotation -= 0.5;
        }else if(world.rotation < 0){
            world.rotation += 0.5;
        }
    }
}

//INVERT WORLD

function invertRotation(){
    invertCounter++;
    if(invertCounter > 1500 && world.inversionRotation < 180 && invertCounter < 3000){
        world.isUpsideDown = true;
        world.inversionRotation += 2.5;
    }
    if(invertCounter > 3000 && world.inversionRotation > 0 && invertCounter < 4500){
        console.log(world.inversionRotation);
        world.isUpsideDown = false;
        world.inversionRotation -= 2.5;
    }
    if(invertCounter > 4500){
        invertCounter = 0;
    }
}

function move(){
    world.Xspeed += world.aceleration;
    if(world.camera[0] < world.width - 40 && world.rotateDirection ==="right"){
        world.camera[0] += world.Xspeed;
    }
    if(world.camera[0] > -1* (world.width - 40) && world.rotateDirection ==="left"){
        world.camera[0] -= world.Xspeed;
    }
}

//COLOR CHANGES

function changeColors(){
    if (counter % 1000 == 0 || counter == 1){
        
        var colorA = Math.floor(Math.random()*255);
        var colorB = Math.floor(Math.random()*255);
        var colorC = Math.floor(Math.random()*255);
        world.cubeColors = [colorA-20,colorB-20,colorC-20];
        world.horizonColor = [colorA / 255 , colorB /255 , colorC /255 ,1];
        world.planeColor = [colorA+30 , colorB+30, colorC+30];
        world.lineColor = [colorA-50, colorB-50, colorC-50];
        cBuffer = cube.buffer(gl);
        pBuffer = plane.buffer(gl);
        lBuffer = line.buffer(gl);
        hud.setAttribute('style','color: rgb('+ (colorA -80 )+', '+(colorB - 80)+', '+(colorC -80)+')');

    }
}

//COLLISIONS
function checkCollision(){
    for(var i= 0; i < arrayCube.length; i++){
        if(arrayCube[i].zoom > -collisionSize && arrayCube[i].zoom < collisionSize){
            if(world.camera[0] > arrayCube[i].position -collisionSize && world.camera[0] < arrayCube[i].position + collisionSize){
                collisionConsecuences();
            }
        }
    }
}

function collisionConsecuences(){
    gameover.classList.remove('hide');
    hud.classList.remove('show');
    finalDistanceHold.innerText = "Distance travelled: "+ truncateDecimals(distance);
    finalScoreHold.innerText = "Final score: "+ truncateDecimals(score);
    isStarted = false;
    isGameOver = true;

}