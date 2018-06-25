// WebGL2 - 3D Perspective matrix
// from https://webgl2fundamentals.org/webgl/webgl-3d-perspective-matrix.html

"use strict";

var vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// a varying the color to the fragment shader
out vec4 v_color;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
`;

var fragmentShaderSource = `#version 300 es

precision mediump float;

// the varied color passed from the vertex shader
in vec4 v_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = v_color;
}
`;


function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl,
      [vertexShaderSource, fragmentShaderSource]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  // look up uniform locations
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer
  var positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Set Geometry.
  setGeometry(gl);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  // create the color buffer, make it the current ARRAY_BUFFER
  // and copy in the color values
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(colorAttributeLocation);

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      colorAttributeLocation, size, type, normalize, stride, offset);


  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  // First let's make some variables
  // to hold the translation,
  var randRotationX = Math.floor(Math.random()*90);
  var randRotationY = Math.floor(Math.random()*90);
  var randRotationZ = Math.floor(Math.random()*90);
  var translation = [-50, -150, -720];
  var rotation = [degToRad(0), degToRad(0), degToRad(0)];
  var rotationSpeed = 1.2;
  var scale = [1, 1, 1];
  var fieldOfViewRadians = degToRad(120);
  var then = 0;
  var deltaTime = 0;

  window.addEventListener('keydown', function(e){
    drawScene();
  })

  // Draw the scene.
  function drawScene(now) {
    for (var i=0; i < 2; i++){

      webglUtils.resizeCanvasToDisplaySize(gl.canvas);

      // Every frame increase the rotation a little.
      // Convert to seconds
   //   now *= 0.001;
      // Subtract the previous time from the current time
   //   var deltaTime = now - then;
      // Remember the current time for the next frame.
      then = now;
   //   var newValue = translation[2] + Math.floor(deltaTime* 125);
   //   if(!isNaN(newValue)){
    //    translation = [translation[0], translation[1], newValue ];
    //  }

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // turn on depth testing
      gl.enable(gl.DEPTH_TEST);

      // tell webgl to cull faces
      gl.enable(gl.CULL_FACE);

      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);

      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao);

      // Compute the matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
      matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

      // Set the matrix.
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      // Draw the geometry.
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 6 * 6;
      gl.drawArrays(primitiveType, offset, count);

      // Call drawScene again next frame
      requestAnimationFrame(drawScene);

    }    
  }
} 

// Fill the current ARRAY_BUFFER buffer
// with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
           // bottom side
           0,   0,  0,
           0,   150,  0,
           150, 0,  0,
           0, 150,  0,
           150,   150,  0,
           150, 0,  0,
        
        // top side
           0,   0,  150,
           150,   0,  150,
           0, 150,  150,
           0, 150,  150,
           150,   0,  150,
           150, 150,  150,
        
        // left side
           0,   0,  0,
           0,   0,  150,
           0, 150,  0,
           0, 150,  0,
           0,   0,  150,
           0, 150,  150,
        
        // right side
           150,   0,  0,
           150,   150,  0,
           150, 0,  150,
           150, 150,  0,
           150,   150,  150,
           150, 0,  150,
        
        // front side 
           0,   150,  0,
           0,   150,  150,
           150, 150,  0,
           0, 150,  150,
           150,   150,  150,
           150, 150,  0,
        
        // back side
           0,   0,  0,
           150,   0,  0,
           0, 0,  150,
           150, 0,  0,
           150,   0,  150,
           0, 0,  150,
      ]),
      gl.STATIC_DRAW);
}

// Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
function setColors(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([

          // bottomm  back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back 
        80, 70, 100,
        80, 70, 100,
        80, 70, 100,
        80, 70, 100,
        80, 70, 100,
        80, 70, 100,

          // left
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // front
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
 
          // back
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
      ]),
      gl.STATIC_DRAW);
}



var m4 = {

  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0,
    ];
  },

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

  translate: function(m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function(m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function(m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

};

main();