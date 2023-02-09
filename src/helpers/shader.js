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
  createProgramFromScratch,
vSource,
fSource };