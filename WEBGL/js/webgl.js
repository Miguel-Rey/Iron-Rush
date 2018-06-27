function Engine(gl) {

    //Only continue if WebGl is available

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return "No GL";
    };

    this.vsSource = `
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
    this.fsSource = `
    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(void) {
        gl_FragColor = vec4(vColor.rgb * vLighting, 1.0);
    }
`;

    this.shaderProgram = this.initShaderProgram(gl, this.vsSource, this.fsSource);

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

Engine.prototype.loadShader = function (gl, type, source) {
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