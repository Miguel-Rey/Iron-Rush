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

function main(){

    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl2');
    if(!gl){
      return;
    }
    var buffers = twgl.primitives.createBufferInfoFromArrays(gl, );

    var program = twgl.createProgramFromSources(gl, vertexShaderSource, fragmentShaderSource);


    // At initialiation time
    var uniformSetters = twgl.createUniformSetters(gl, program);
    var attribSetters  = twgl.createAttributeSetters(gl, program);
     
    // Setup all the buffers and attributes
    var attribs = {
      a_position: { buffer: buffers.position, numComponents: 3, },
      a_normal:   { buffer: buffers.normal,   numComponents: 3, },
      a_texcoord: { buffer: buffers.texcoord, numComponents: 2, },
    };
    var vao = twgl.createVAOAndSetAttributes(gl, attribSetters, attribs, buffers.indices);
     
    // At init time or draw time depending
    var uniformsThatAreTheSameForAllObjects = {
      u_lightWorldPos:         [100, 200, 300],
      u_viewInverse:           computeInverseViewMatrix(),
      u_lightColor:            [1, 1, 1, 1],
    };
     
    var uniformsThatAreComputedForEachObject = {
      u_worldViewProjection:   perspective(...),
      u_world:                 computeWorldMatrix(),
      u_worldInverseTranspose: computeWorldInverseTransposeMatrix(),
    };
     
    var objects = [
      { translation: [10, 50, 100],
        materialUniforms: {
          u_ambient:               [0.1, 0.1, 0.1, 1],
          u_diffuse:               diffuseTexture,
          u_specular:              [1, 1, 1, 1],
          u_shininess:             60,
          u_specularFactor:        1,
        },
      },
      { translation: [-120, 20, 44],
        materialUniforms: {
          u_ambient:               [0.1, 0.2, 0.1, 1],
          u_diffuse:               someOtherDiffuseTexture,
          u_specular:              [1, 1, 0, 1],
          u_shininess:             30,
          u_specularFactor:        0.5,
        },
      },
      { translation: [200, -23, -78],
        materialUniforms: {
          u_ambient:               [0.2, 0.2, 0.1, 1],
          u_diffuse:               yetAnotherDiffuseTexture,
          u_specular:              [1, 0, 0, 1],
          u_shininess:             45,
          u_specularFactor:        0.7,
        },
      },
    ];
     
    // At draw time
    gl.useProgram(program);
     
    // Setup the parts that are common for all objects
     
    // Bind the VAO that has all our buffers and attribute settings
    gl.bindAttribArray(vao);
    twgl.setUniforms(uniformSetters, uniformThatAreTheSameForAllObjects);
     
    objects.forEach(function(object) {
      computeMatricesForObject(object, uniformsThatAreComputedForEachObject);
      twgl.setUniforms(uniformSetters, uniformThatAreComputedForEachObject);
      twgl.setUniforms(unifromSetters, objects.materialUniforms);
      gl.drawArrays(...);
    });

}

main()