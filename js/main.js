window.onload = function(){
    
    //set gl context

    var canvas = document.getElementById('glCanvas');
    var gl = canvas.getContext("webgl");

    //create objects

    var engine = new Engine(gl);
    var world = new World(gl, engine);
    var cube = new Cube(engine, world);
    var plane = new Plane(engine, world);
    var line = new Line(engine, world);
    var hLine = new HLine(engine, world);
    var hud = new Hud(world);
    var game = new Game(world, gl, cube, plane, line, hLine, hud);

    var keyboard = {
        space: 32,
        left: 37,
        right: 39
    }

    //Fill the line-array

    game.createLines();

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
        game.hud.updateScore();
        game.hud.updateSpeed();
        game.hud.updateDistance();
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
        game.hLine.draw(gl, hLine.engine.programInfo, game.hLine.hlBuffer, -15);
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
            hud.hudWrap.classList.add('right'); 
            hud.hudWrap.classList.remove('left');
        }
        if(e.keyCode == keyboard.left){
            e.preventDefault();
            if(world.isUpsideDown){
                game.turnRight();
            }else{
                game.turnLeft();
            }
            hud.hudWrap.classList.add('left');
            hud.hudWrap.classList.remove('right');
        }
        if(e.keyCode == keyboard.space && !game.isGameOver && !game.isStarted){
            e.preventDefault();
            game.isStarted = true;
            requestAnimationFrame(render);
            hud.hudWrap.classList.add('show');
            hud.initial.classList.add('hide');
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
            hud.hudWrap.classList.remove('left');
            hud.hudWrap.classList.remove('right');
        }
    });
}