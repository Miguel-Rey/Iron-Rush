window.onload = function(){

    function main(){

        var canvas = document.getElementById('glCanvas');
        //Init GL context
        var gl = canvas.getContext("webgl");

        //Only continue if WebGl is available

        if (!gl){
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return "No GL";
        }

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

        var shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        var programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
            }
        };

        var buffers = initBuffers(gl);

        //animation

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

            drawPlane(gl, programInfo, buffers);
            drawCube(gl, programInfo, buffers, delta);
            

            requestAnimationFrame(render);
        }

        this.requestAnimationFrame(render);

    }

    function initShaderProgram(gl, vsSource, fsSource) {
        var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
      
        // Create the shader program
      
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
      
        // If creating the shader program failed, alert
      
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
          return null;
        }
      
        return shaderProgram;
      }

    function loadShader(gl, type, source){
        var shader = gl.createShader(type);

        //Send the source to the shader object

        gl.shaderSource(shader, source);

        //Compile the shader program

        gl.compileShader(shader);

        //Check if successfull

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function initBuffers(gl){

        
        //Position Plane


        var positionPlane = [
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
        ]

        var planeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, planeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(positionPlane),
            gl.STATIC_DRAW);

        //Position Cube

        var positionCube = [
             // Front face
                -1.0, -1.0,  1.0,
                1.0, -1.0,  1.0,
                1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,
                
                // Back face
                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0, -1.0, -1.0,
                
                // Top face
                -1.0,  1.0, -1.0,
                -1.0,  1.0,  1.0,
                1.0,  1.0,  1.0,
                1.0,  1.0, -1.0,
                
                // Bottom face
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0,  1.0,
                -1.0, -1.0,  1.0,
                
                // Right face
                1.0, -1.0, -1.0,
                1.0,  1.0, -1.0,
                1.0,  1.0,  1.0,
                1.0, -1.0,  1.0,
                
                // Left face
                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0,  1.0, -1.0,
        ]

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(positionCube),
            gl.STATIC_DRAW);

        //Color 

        var faceColors = [
            [1.0,  1.0,  1.0,  1.0],    // Front face: white
            [1.0,  0.0,  0.0,  1.0],    // Back face: red
            [0.0,  1.0,  0.0,  1.0],    // Top face: green
            [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
            [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
            [1.0,  0.0,  1.0,  1.0],    // Left face: purple
        ];
        var colors = [];

        for (var j = 0; j < faceColors.length; ++j) {
            var c = faceColors[j];
        
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
          }

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        //Indices

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW)

        return {
                position: positionBuffer,
                color: colorBuffer,
                indices: indexBuffer,
                positionPlane : planeBuffer,
        };
    }

    //Render function

    function drawCube (gl, programInfo, buffers, delta) {


        //Perspective matrix variables

        var fieldOfView = 45 * Math.PI / 180;   // in radians
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 0.1;
        var zFar = 100.0;
        var projectionMatrix = mat4.create();

        //Set perspective matrix

        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        var modelViewMatrix = mat4.create();

        //Transformation matrix

        mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [0.0, 0.0, -6.0]);  // amount to translate
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * .7, [0, 1, 0]);

        //Buffer interpretation settings

        //Position

        {
            var numComponents = 3;  // pull out 2 values per iteration
            var type = gl.FLOAT;    // the data in the buffer is 32bit floats
            var normalize = false;  // don't normalize
            var stride = 0;         // how many bytes to get from one set of values to the next
                                        // 0 = use type and numComponents above
            var offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        //Color

        {
            var numComponents = 4;
            var type = gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
          }

          //Indices

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

          
            //Tell WebGL to use our program when drawing

            gl.useProgram(programInfo.program);

            //Set the shader uniforms

            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix);
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix);
        
        {
            var type = gl.UNSIGNED_SHORT;
            var offset = 0;
            var vertexCount = 36;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

        cubeRotation += delta;
    }

    function drawPlane (gl, programInfo, buffers) {


        //Perspective matrix variables

        var fieldOfView = 45 * Math.PI / 180;   // in radians
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 0.1;
        var zFar = 100.0;
        var projectionMatrix = mat4.create();

        //Set perspective matrix

        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        var modelViewMatrix = mat4.create();

        //Transformation matrix

        mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [0.0, 0.0, -6.0]);  // amount to translate
        //Buffer interpretation settings

        //Position

        {
            var numComponents = 3;  // pull out 2 values per iteration
            var type = gl.FLOAT;    // the data in the buffer is 32bit floats
            var normalize = false;  // don't normalize
            var stride = 0;         // how many bytes to get from one set of values to the next
                                        // 0 = use type and numComponents above
            var offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        //Color

        {
            var numComponents = 4;
            var type = gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
          }

          //Indices

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

          
            //Tell WebGL to use our program when drawing

            gl.useProgram(programInfo.program);

            //Set the shader uniforms

            gl.uniformMatrix4fv(
                programInfo.uniformLocations.projectionMatrix,
                false,
                projectionMatrix);
            gl.uniformMatrix4fv(
                programInfo.uniformLocations.modelViewMatrix,
                false,
                modelViewMatrix);
        
        {
            var type = gl.UNSIGNED_SHORT;
            var offset = 0;
            var vertexCount = 36;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
    

    var cubeRotation = 0.0;
    main();
}


