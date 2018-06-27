window.onload = function(){

    //============VAR DECLARATIONS================


    
    //select html elements

    var hud = document.getElementById('hud');
    var initial = document.getElementById('initial');
    var gameover = document.getElementById('gameover'); 
    var finalDistanceHold = document.getElementById('final-distance');
    var finalScoreHold = document.getElementById('final-score');
    var canvas = document.getElementById('glCanvas');

    //set gl context

    var gl = canvas.getContext("webgl");

    //create objects

    var engine = new Engine(gl);
    var world = new World(gl, engine);
    var cube = new Cube(engine, world);
    var plane = new Plane(engine, world);
    var line = new Line(engine, world);
    var keyboard = {
        space: 32,
        left: 37,
        right: 39
    }

    //create buffers

    var cBuffer = cube.buffer(gl);
    var pBuffer = plane.buffer(gl);
    var lBuffer = line.buffer(gl);

    //3d elements arrays declaration

    var arrayLines = [];
    var arrayCube = [];
    
    //Fill line array
    var totalLines = world.numberOfLines;
    for (var i= -totalLines / 2; i < totalLines / 2; i++ ){
        arrayLines.push(new Line(engine, world, (world.width/ totalLines * i)))
    }

    //Set cube collision range
    var collisionSize = world.cubeSize +2;

    //Game settings
    var invertCounter = 0;
    var isGameOver = false;
    var isStarted = false;
    var prevTime = 0;
    var counter = 0;
    var counterToCreateCube = 10;



    //=====FUNCTION DECLARATION===============



    //RESET

    function reset(){
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

    function drawLines(delta){
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


    //HUD

    function truncateDecimals (number) {
        return (Math.floor(number* 10)) / 10;
    };

    var score = 0;
    var scoreHold = document.getElementById('score');

    function updateScore(){
        score += 13;
        scoreHold.innerText = "SCORE: "+ truncateDecimals(score);
    }
    var speed = world.Zspeed;
    var speedHold = document.getElementById('speed');

    function updateSpeed(){
        speedHold.innerText = "SPEED: "+ truncateDecimals(30 + world.Zspeed);
    }

    var distance = 0;
    var distanceHold = document.getElementById('distance');

    function updateDistance(){
        distance += 0.3;
        distanceHold.innerText = "DISTANCE: "+ truncateDecimals(distance);
    }

    /////ANIMATION

    function render(time) {

        //Calculate delta
        
        time *= 0.001; // to seconds
        var delta = time - prevTime;
        prevTime = time;

        //Calculate changes

        addCubes();
        move();
        turnWorld();
        invertRotation();
        updateScore();
        updateSpeed();
        updateDistance();
        changeColors();
        checkCollision();

        //Clear canvas

        gl.clearColor(world.horizonColor[0],world.horizonColor[1],world.horizonColor[2],world.horizonColor[3]);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        //Draw

        plane.draw(gl, plane.engine.programInfo, pBuffer, delta);
        drawAllCubes(delta);
        drawLines(delta);

        //Call next frame

        if(isStarted == true){
            requestAnimationFrame(render);
        }
    }

    //EVENTS / CONTROLS

    document.addEventListener('keydown', function(e){
        if(e.keyCode == keyboard.right){
            e.preventDefault();
            if(world.isUpsideDown){
                turnLeft();
            }else{
                turnRight();
            }
            hud.classList.add('right'); 
            hud.classList.remove('left');
        }
        if(e.keyCode == keyboard.left){
            e.preventDefault();
            if(world.isUpsideDown){
                turnRight();
            }else{
                turnLeft();
            }
            hud.classList.add('left');
            hud.classList.remove('right');
        }
        if(e.keyCode == keyboard.space && !isGameOver && !isStarted){
            e.preventDefault();
            isStarted = true;
            requestAnimationFrame(render);
            hud.classList.add('show');
            initial.classList.add('hide');
            world.music.play();
        }
        if(e.keyCode == 32 && isGameOver){
            e.preventDefault();
            reset();
        }
    });

    document.addEventListener('keyup', function(e){
        if(e.keyCode == keyboard.left || e.keyCode == keyboard.right){
            world.rotateDirection = 0;
            hud.classList.remove('left');
            hud.classList.remove('right');
        }
    });
}