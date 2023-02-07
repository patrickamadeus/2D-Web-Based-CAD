import { createProgramFromScratch, vertexShaderSource_2, fragmentShaderSource } from '../helpers/shader.js';

const square = () => {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }
  
  var program = createProgramFromScratch(gl, vertexShaderSource_2, fragmentShaderSource);
  var positionLocation = gl.getAttribLocation(program, "a_position");

  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var translation = [0,0];
  var length = 90;
  var color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();

  function drawScene() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    setSquare(gl, translation[0], translation[1], length);

    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4fv(colorLocation, color);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  const widthSlider = document.getElementById('width_val');
  const translateXSlider = document.getElementById('trans_x_val');
  const translateYSlider = document.getElementById('trans_y_val');

  widthSlider.addEventListener('input', (e) => {
      document.getElementById('width_output').textContent = e.target.value;
      length = parseInt(e.target.value);
      drawScene();
  });

  translateXSlider.addEventListener('input', (e) => {
    document.getElementById('trans_x_output').textContent = e.target.value;
    translation[0] = parseInt(e.target.value);
    drawScene();
  });

  translateYSlider.addEventListener('input', (e) => {
    document.getElementById('trans_y_output').textContent = e.target.value;
    translation[1] = parseInt(e.target.value);
    drawScene();
  });
}

// Fill the buffer with the values that define a rectangle.
function setSquare(gl, x, y, length) {
  var x1 = x;
  var x2 = x + length;
  var y1 = y;
  var y2 = y + length;
  console.log(x1,x2,y1,y2);
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
      ]),
      gl.STATIC_DRAW);
}

export { square };
