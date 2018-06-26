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

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

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

    //CUBE RELATED

    function addCubes(){
        counter++;
        if(counter % counterToCreateCube == 0){
            arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));
            arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));
            arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));
            arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));
            arrayCube.push(new Cube(engine, world, Math.random()*world.width*2 - world.width, -world.depth+5));   
        }
        if(counter % 1875 == 0){
            counterToCreateCube--;
        }
    }

    function acelerate(i){
        world.speed += world.aceleration;
        arrayCube[i].zoom += world.speed;
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

    function move(){
        if(world.camera[0] < world.width - 40 && world.rotateDirection ==="right"){
            world.camera[0] += 0.3;
            console.log(world.camera[0]);
       }
       if(world.camera[0] > -1* (world.width - 40) && world.rotateDirection ==="left"){
            world.camera[0] -= 0.3;
        }
    }

    //COLLISIONS

    function checkCollision(){
        for(var i= 0; i < arrayCube.length; i++){
            if(arrayCube[i].zoom > -2.5 && arrayCube[i].zoom < 2.5){
                if(world.camera[0] > arrayCube[i].position -2.5 && world.camera[0] < arrayCube[i].position + 2.5){
                    alert('Collision!')
                }
            }
        }
    }

    /////ANIMATION
    var prevTime = 0;
    var counter = 0;
    var counterToCreateCube = 10;

    function render(time) {
        checkCollision();
        
        addCubes();
        move();
        turnWorld();

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
        
        requestAnimationFrame(render);
    }

    //EVENTS / CONTROLS

    document.addEventListener('keydown', function(e){
        if(e.keyCode == 39){
            turnRight();
        }
        if(e.keyCode == 37){
            turnLeft();
        }
        if(e.keyCode == 32){
            requestAnimationFrame(render);
        }
    });

    document.addEventListener('keyup', function(e){
        world.rotateDirection = 0;
    });

}