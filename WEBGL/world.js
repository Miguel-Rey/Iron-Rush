function World(gl, engine){
    this.gl = gl;
    this.engine = engine
    this.fieldOfView = 45 * Math.PI / 180;  // in radians
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.zNear = 0.1;
    this.zFar = 100.0;
    this.projectionMatrix = mat4.create();
    this.modelViewMatrix = mat4.create();
    this.drawPosition = function(buffer){
        var numComponents = 3;  // pull out 2 values per iteration
        var type = gl.FLOAT;    // the data in the buffer is 32bit floats
        var normalize = false;  // don't normalize
        var stride = 0;         // how many bytes to get from one set of values to the next
                                    // 0 = use type and numComponents above
        var offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        gl.vertexAttribPointer(
            this.engine.programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            this.engine.programInfo.attribLocations.vertexPosition);
    };
    this.drawColor = function(buffer){
        var numComponents = 4;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.color);
        gl.vertexAttribPointer(
            this.engine.programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            this.engine.programInfo.attribLocations.vertexColor);
    };
    this.drawInd = function(buffer){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

  
        //Tell WebGL to use our program when drawing

        gl.useProgram(this.engine.programInfo.program);

        //Set the shader uniforms

        gl.uniformMatrix4fv(
            this.engine.programInfo.uniformLocations.projectionMatrix,
            false,
            this.projectionMatrix);
        gl.uniformMatrix4fv(
            this.engine.programInfo.uniformLocations.modelViewMatrix,
            false,
            this.modelViewMatrix);
    };
    this.draw = function(buffer){
        this.drawPosition(buffer);
        this.drawColor(buffer);
        this.drawInd(buffer);
    }
}
