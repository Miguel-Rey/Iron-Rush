window.onload = function(){

    //============VAR DECLARATIONS================
    
    //select html elements

    var hudWrap = document.getElementById('hud');
    var initial = document.getElementById('initial');
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
    var game = new Game(world, gl, cube, plane, line);

    
    //Fill line array
    var totalLines = world.numberOfLines;
    for (var i= -totalLines / 2; i < totalLines / 2; i++ ){
        game.arrayLines.push(new Line(engine, world, (world.width/ totalLines * i)))
    }



    //=====FUNCTION DECLARATION===============


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

    var prevTime = 0;

    function render(time) {

        //Calculate delta
        
        time *= 0.001; // to seconds
        var delta = time - prevTime;
        prevTime = time;

        //Calculate changes

        game.addCubes();
        game.move();
        game.turnWorld();
        game.invertRotation();
        updateScore();
        updateSpeed();
        updateDistance();
        game.changeColors();
        game.checkCollision();

        //Clear canvas

        gl.clearColor(world.horizonColor[0],world.horizonColor[1],world.horizonColor[2],world.horizonColor[3]);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        //Draw

        game.plane.draw(gl, plane.engine.programInfo, game.plane.pBuffer, delta);
        game.drawAllCubes(delta);
        game.drawLines(delta);

        //Call next frame

        if(game.isStarted == true){
            requestAnimationFrame(render);
        }
    }

    //EVENTS / CONTROLS

    document.addEventListener('keydown', function(e){
        if(e.keyCode == keyboard.right){
            e.preventDefault();
            if(world.isUpsideDown){
                game.turnLeft();
            }else{
                game.turnRight();
            }
            hudWrap.classList.add('right'); 
            hudWrap.classList.remove('left');
        }
        if(e.keyCode == keyboard.left){
            e.preventDefault();
            if(world.isUpsideDown){
                game.turnRight();
            }else{
                game.turnLeft();
            }
            hudWrap.classList.add('left');
            hudWrap.classList.remove('right');
        }
        if(e.keyCode == keyboard.space && !game.isGameOver && !game.isStarted){
            e.preventDefault();
            game.isStarted = true;
            requestAnimationFrame(render);
            hudWrap.classList.add('show');
            initial.classList.add('hide');
            world.music.play();
        }
        if(e.keyCode == 32 && game.isGameOver){
            e.preventDefault();
            game.reset();
        }
    });

    document.addEventListener('keyup', function(e){
        if(e.keyCode == keyboard.left || e.keyCode == keyboard.right){
            world.rotateDirection = 0;
            hudWrap.classList.remove('left');
            hudWrap.classList.remove('right');
        }
    });
}