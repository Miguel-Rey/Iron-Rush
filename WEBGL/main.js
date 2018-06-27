window.onload = function(){
    var vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec3 aVertexNormal;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

      // Color

      vColor = aVertexColor;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.4, 0.4, 0.4);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(-0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

    // Fragment shader program

    var fsSource = `
        varying lowp vec4 vColor;
        varying highp vec3 vLighting;

        void main(void) {
            gl_FragColor = vec4(vColor.rgb * vLighting, 1.0);
        }
    `;

    //DECLARATIONS

    
    var canvas = document.getElementById('glCanvas');
    var gl = canvas.getContext("webgl");
    var engine = new Engine(gl, vsSource, fsSource);
    var world = new World(gl, engine);
    var cube = new Cube(engine, world);
    var cBuffer = cube.buffer(gl);
    var plane = new Plane(engine, world);
    var pBuffer = plane.buffer(gl);
    var hud = document.getElementById('hud');
    var initial = document.getElementById('initial');
    var gameover = document.getElementById('gameover'); 
    var finalDistanceHold = document.getElementById('final-distance');
    var finalScoreHold = document.getElementById('final-score');

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

    function acelerate(i){
        world.Zspeed += world.aceleration;
        arrayCube[i].zoom += world.Zspeed;
    }

    var arrayCube = [];
    function drawAllCubes(delta){
        for(var i= 0; i < arrayCube.length; i++){
            if(arrayCube[i].zoom > 50){
                arrayCube.splice([i],1);
            }
            acelerate(i);
            arrayCube[i].draw(gl, arrayCube[i].engine.programInfo, cBuffer, delta, arrayCube[i].zoom);
        }
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
    var invertCounter = 0;
    function invertRotation(){
        invertCounter++;
        if(invertCounter > 1000 && world.inversionRotation < 180 && invertCounter < 2000){
            world.isUpsideDown = true;
            world.inversionRotation += 3.7:
        }
        if(invertCounter > 2000 && world.inversionRotation > 0 && invertCounter < 3000){
            console.log(world.inversionRotation);
            world.isUpsideDown = false;
            world.inversionRotation -= 3.7;
        }
        if(invertCounter > 3000){
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
            cBuffer = cube.buffer(gl);
            pBuffer = plane.buffer(gl);
            hud.setAttribute('style','color: rgb('+ (colorA -80 )+', '+(colorB - 80)+', '+(colorC -80)+')');

        }
    }

    //COLLISIONS
    var collisionSize = world.cubeSize +1;
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
        score += 35;
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
    var prevTime = 0;
    var counter = 0;
    var counterToCreateCube = 10;
    var isStarted = false;
    var isGameOver = false;

    function render(time) {
        
        addCubes();
        move();
        turnWorld();
        invertRotation();
        updateScore();
        updateSpeed();
        updateDistance();
        changeColors();
        checkCollision();
        gl.clearColor(world.horizonColor[0],world.horizonColor[1],world.horizonColor[2],world.horizonColor[3]);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        time *= 0.001; // to seconds
        var delta = time - prevTime;
        prevTime = time;
        drawAllCubes(delta);
        plane.draw(gl, plane.engine.programInfo, pBuffer, delta)
        if(isStarted == true){
            requestAnimationFrame(render);
        }
    }

    //EVENTS / CONTROLS

    document.addEventListener('keydown', function(e){
        e.preventDefault();
        if(e.keyCode == 39){
            if(world.isUpsideDown){
                turnLeft();
            }else{
                turnRight();
            }
            hud.classList.add('right'); 
            hud.classList.remove('left');
        }
        if(e.keyCode == 37){
            if(world.isUpsideDown){
                turnRight();
            }else{
                turnLeft();
            }
            hud.classList.add('left');
            hud.classList.remove('right');
        }
        if(e.keyCode == 32 && !isGameOver && !isStarted){
            isStarted = true;
            requestAnimationFrame(render);
            hud.classList.add('show');
            initial.classList.add('hide');
        }
        if(e.keyCode == 32 && isGameOver){
            location.reload();
        }
    });

    document.addEventListener('keyup', function(e){
        world.rotateDirection = 0;
        hud.classList.remove('left');
        hud.classList.remove('right');
    });
}