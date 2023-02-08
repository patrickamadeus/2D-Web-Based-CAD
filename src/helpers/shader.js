// This file contains the functions to create a shader program from scratch and its helper functions.

const vSource = `
    attribute vec4 vPosition;
    attribute vec4 vColor;
    varying vec4 fColor;
    void main() {
        gl_Position = vPosition;
        fColor = vColor;
    }
`;

const fSource = `
    precision mediump float;
    varying vec4 fColor;
    void main() {
        gl_FragColor = fColor;
    }
`;


const vertexShaderSource = `
// an attribute will receive data from a buffer
  attribute vec4 a_position;

  // all shaders have a main function
  void main() {

    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
`

const vertexShaderSource_1 = `
attribute vec4 vPosition;
attribute vec4 vColor;

varying vec4 fColor;

void main()
{
    gl_Position = vPosition;
    fColor = vColor;
}
`

const vertexShaderSource_2 = `
  attribute vec2 a_position;
  uniform vec2 u_resolution;
  uniform vec2 u_rotation;

  void main() {
    // vec2 a_position = vec2(
    //   a_position.x * u_rotation.y + a_position.y * u_rotation.x,
    //   a_position.y * u_rotation.y - a_position.x * u_rotation.x);
    
    
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`

const fragmentShaderSource = `
// fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
  }
`

const fragmentShaderSource_1 = `
  precision mediump float;

  varying vec4 fColor;
  void main()
  {
      gl_FragColor = fColor;
  }

`



/** 
 * Create Shader with specific type and source given by user
 */
const createShader = (gl, type, source) => {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    alert(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}


/** 
 * Create Program built with vertex and fragment shaders
 */
const createProgram = (gl, vertexShader, fragmentShader) => {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    alert(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

/**
 * Wrapper Function for the whole program initializing process
 */
const createProgramFromScratch = (gl, vertexShaderSource, fragmentShaderSource) => {

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = createProgram(gl, vertexShader, fragmentShader);
    return program;

}

export { 
  vertexShaderSource,
  vertexShaderSource_1,
  vertexShaderSource_2,
  fragmentShaderSource,
  fragmentShaderSource_1,
  createProgramFromScratch,
vSource,
fSource };