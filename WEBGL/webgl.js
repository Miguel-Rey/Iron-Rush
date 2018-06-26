function Engine(gl, vsSource, fsSource){

    //Only continue if WebGl is available

    if (!gl){
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return "No GL";
    };

    this.vsSource = vsSource;
    this.fsSource = fsSource;

    this.shaderProgram = this.initShaderProgram(gl, vsSource, fsSource);

    this.programInfo = {
        program: this.shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
            vertexNormal: gl.getAttribLocation(this.shaderProgram, 'aVertexNormal'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(this.shaderProgram, 'uNormalMatrix'),
        }
    };


}

Engine.prototype.initShaderProgram = function (gl, vsSource, fsSource) {
    var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
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
};

Engine.prototype.loadShader = function (gl, type, source){
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