window.onload = function(){
    var vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            vColor = aVertexColor;
        }
    `;

    // Fragment shader program

    var fsSource = `
        varying lowp vec4 vColor;

        void main(void) {
          gl_FragColor = vColor;
        }
    `;

    
    var canvas = document.getElementById('glCanvas');
    var gl = canvas.getContext("webgl");
    var engine = new Engine(gl, vsSource, fsSource);
    var world = new World(gl, engine);
    var cube = new Cube(engine, world);
    var cBuffer = cube.buffer(gl);
    var plane = new Plane(engine, world);
    var pBuffer = plane.buffer(gl);

    //ZONA DE TEST

    var arrayCube = [];
    function drawAllCubes(delta){
        for(var i= 0; i < arrayCube.length; i++){
            if(arrayCube[i].zoom > 50){
                arrayCube.splice([i],1);
            }
            arrayCube[i].zoom += 1;
            arrayCube[i].draw(gl, arrayCube[i].engine.programInfo, arrayCube[i].buffer(gl), delta, arrayCube[i].zoom)
        }
    }

    /////ANIMATION
    var squareRotation = 0;
    var prevTime = 0;
    var counter = 0;
    var planeTurn = 0;
    function render(time) {
        checkCollision();
        counter++
        if(counter > 5){
            counter = 0;
            addCube();
        }
        if(world.rotateDirection ==="right"){
            //world.rotation -= 0.5;
            if(world.camera[0] < world.depth / 3){
                 world.camera[0] += 0.3;
            }
        }
        if(world.rotateDirection ==="left"){
            //world.rotation += 0.5;
            if(world.camera[0] > world.depth / -3){
                world.camera[0] -= 0.3;
            }
        }
        if(world.rotateDirection === 0 && world.rotation !== 0){
            if(world.rotation> 0){
                world.rotation -= 0.5;
            }else if(world.rotation < 0){
                world.rotation += 0.5;
            }
        }


        gl.clearColor(world.horizonColor[0],world.horizonColor[1],world.horizonColor[2],world.horizonColor[3]);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        time *= 0.001; // to seconds
        var delta = time - prevTime;
        prevTime = time;
        drawAllCubes(delta);
        plane.draw(gl, plane.engine.programInfo, pBuffer, delta, squareRotation)
        
        requestAnimationFrame(render);
    }

    
    function addCube(){
        var randomHeight = Math.random()+6;
        var randPosition = Math.random()*world.depth*2 - world.depth;
        arrayCube.push(new Cube(engine, world, randomHeight, randPosition, -world.depth+5));
    }

    function turnRight(){
        world.rotateDirection = "right";
    }

    function turnLeft(){
        world.rotateDirection = "left";
    }


    function checkCollision(){
        for(var i= 0; i < arrayCube.length; i++){
            if(arrayCube[i].zoom > -1 && arrayCube[i].zoom < 1){
                if(world.camera[0] > arrayCube[i].position -1 && world.camera[0] < arrayCube[i].position + 1){
                    alert('Collision!')
                }
            }
        }
    }

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