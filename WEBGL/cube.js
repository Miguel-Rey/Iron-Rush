function Cube(engine, world, position, zoom){
    this.engine = engine;
    this.world = world;
    this.height = 50;
    this.position = position;
    this.zoom = zoom;
}

Cube.prototype.buffer = function(gl){
        
        //Position Cube
    
        var positionCube = [
             // Front face
                -this.world.cubeSize, 0.0* this.height,  this.world.cubeSize,
                this.world.cubeSize, 0.0* this.height,  this.world.cubeSize,
                this.world.cubeSize,  2.0* this.height,  this.world.cubeSize,
                -this.world.cubeSize,  2.0* this.height,  this.world.cubeSize,
                
                // Back face
                -this.world.cubeSize, 0.0* this.height, -this.world.cubeSize,
                -this.world.cubeSize,  2.0* this.height, -this.world.cubeSize,
                this.world.cubeSize,  2.0* this.height, -this.world.cubeSize,
                this.world.cubeSize, 0.0* this.height, -this.world.cubeSize,
                
                // Top face
                -this.world.cubeSize,  2.0* this.height, -this.world.cubeSize,
                -this.world.cubeSize,  2.0* this.height,  this.world.cubeSize,
                this.world.cubeSize,  2.0* this.height,  this.world.cubeSize,
                this.world.cubeSize,  2.0* this.height, -this.world.cubeSize,
                
                // Bottom face
                -this.world.cubeSize, 0.0* this.height, -this.world.cubeSize,
                this.world.cubeSize, 0.0* this.height, -this.world.cubeSize,
                this.world.cubeSize, 0.0* this.height,  this.world.cubeSize,
                -this.world.cubeSize, 0.0* this.height,  this.world.cubeSize,
                
                // Right face
                this.world.cubeSize, 0.0* this.height, -this.world.cubeSize,
                this.world.cubeSize,  2.0* this.height, -this.world.cubeSize,
                this.world.cubeSize,  2.0* this.height,  this.world.cubeSize,
                this.world.cubeSize, 0.0* this.height,  this.world.cubeSize,
                
                // Left face
                -this.world.cubeSize, 0.0* this.height, -this.world.cubeSize,
                -this.world.cubeSize, 0.0* this.height,  this.world.cubeSize,
                -this.world.cubeSize,  2.0* this.height,  this.world.cubeSize,
                -this.world.cubeSize,  2.0* this.height, -this.world.cubeSize,
        ]
    
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(positionCube),
            gl.STATIC_DRAW);
    
        //Color 
    
        var faceColors = [
            this.world.setColors(this.world.cubeColors),    // Front face: white
            this.world.setColors(this.world.cubeColors),    // Back face: red
            this.world.setColors(this.world.cubeColors),    // Top face: green
            this.world.setColors(this.world.cubeColors),    // Bottom face: blue
            this.world.setColors(this.world.cubeColors),    // Right face: yellow
            this.world.setColors(this.world.cubeColors),    // Left face: purple
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

        //Normals

        var normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    
        var vertexNormals = [
            // Front
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
        
            // Back
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
        
            // Top
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
        
            // Bottom
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
        
            // Right
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
        
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
          ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
        gl.STATIC_DRAW);
        

        return {
                position: positionBuffer,
                color: colorBuffer,
                indices: indexBuffer,
                normal: normalBuffer,
        };
    
}

Cube.prototype.draw = function(gl, programInfo, buffers, delta, zoomIn){

    //Perspective matrix variables

    var fieldOfView = this.world.fieldOfView
    var aspect = this.world.aspect
    var zNear = this.world.zNear
    var zFar = this.world.zFar
    var projectionMatrix = mat4.create();

    //Set perspective matrix

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    var modelViewMatrix = mat4.create();
        

    //Set camera matrix
    var cameraAngleRadians = (this.world.rotation * Math.PI / 180) + (this.world.inversionRotation * Math.PI / 180);
    var cameraMatrix = mat4.translate(mat4.create(), modelViewMatrix, this.world.camera);
    mat4.rotateZ(cameraMatrix, cameraMatrix, cameraAngleRadians);
    
    //View matrix
    
    var viewMatrix = mat4.invert(cameraMatrix, cameraMatrix);

    //Compute

    var viewProjectionMatrix = mat4.multiply(projectionMatrix, projectionMatrix, viewMatrix);


    //Transformation matrix
    mat4.translate(modelViewMatrix,     // destination matrix
    modelViewMatrix,     // matrix to translate
    [0.0 + this.position, -3, zoomIn]);  // amount to translate


    //Set light matrix

    var normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    

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
            viewProjectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);

    //Normals

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexNormal);
      }
    
    {
        var type = gl.UNSIGNED_SHORT;
        var offset = 0;
        var vertexCount = 36;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}
