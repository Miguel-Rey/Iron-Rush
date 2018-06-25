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
    

    /////ANIMATION
    var squareRotation = 0;
    var zoomIn = -world.depth;
    var prevTime = 0;
    function render(time) {

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        time *= 0.001; // to seconds
        var delta = time - prevTime;
        prevTime = time;

        plane.draw(gl, plane.engine.programInfo, pBuffer, delta, squareRotation)
        cube.draw(gl, cube.engine.programInfo, cBuffer, delta, zoomIn)
        requestAnimationFrame(render);
        squareRotation -= 0.01;
        zoomIn += 0.1;
    }

    requestAnimationFrame(render);
    
    document.addEventListener('keydown', function(e){
        console.log(e.keyCode);
        if(e.keyCode == 32){
        
        }
    });

}