import { triangle } from './models/triangle.js';
// import { line } from './models/line.js';
import { square } from './models/square.js';
import { rectangle } from './models/rectangle.js';
// import { polygon } from './models/polygon.js';

// importing setup config
import { WebGLUtils } from './helpers/webgl-utils.js';
import { createProgramFromScratch, vSource, fSource } from './helpers/shader.js';

// Helpers
import { flatten, dec_hex, hex_dec, atan3, norm, euclideanDistance } from './helpers/utility.js';
import { colorMap } from './helpers/const.js';


/* ----------- Global Variables -----------------------------------------------------------*/
var vertices = [];
var colors = [];
var canvas = document.querySelector("#canvas");
var isDrawing = false;



/* ----------- Initialization -----------------------------------------------------------*/
const gl = WebGLUtils.setupWebGL(canvas);
if ( !gl ) { alert( "WebGL isn't available" ); }

// set Canvas size
canvas.width = 500;
canvas.height = 500;
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.8, 0.8, 0.8, 1.0);

// initialize program
const program = createProgramFromScratch(gl, vSource, fSource);
gl.useProgram(program);

const vBuffer = gl.createBuffer();
const cBuffer = gl.createBuffer();



/* ----------- Canvas Event Listener -----------------------------------------------------------*/
var modelChoice;
var colorChoice;

canvas.addEventListener("mousemove", function(e) {
    if (modelChoice == "rectangle") {
        if(isDrawing) {
            let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
            let y =  1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
            vertices[vertices.length-1][0]  = x;
            vertices[vertices.length-1][1]  = y;
            vertices[vertices.length-2][0]  = x;
            vertices[vertices.length-3][1]  = y;
        }
    } else if (modelChoice == "square") {

    } else if (modelChoice == "line") {
        
    } else if (modelChoice == "polygon") {
        
    }
});

canvas.addEventListener('mousedown', (e) => {
    modelChoice = document.querySelector("#model_choice").value;
    colorChoice = document.querySelector("#color_choice").value;

    if (modelChoice == "none" || colorChoice == "none") {
        alert("Please choose model and color");
        return;
    }

    if (modelChoice == "rectangle") {
        isDrawing = !isDrawing;
    
        let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
        let y =  1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    
        // untuk kotak
        for(let i = 0; i < 4; i++) {
            vertices.push([x,y]);
            colors.push(colorMap.get(colorChoice));
        }
    } else if (modelChoice == "square") {
        
    } else if (modelChoice == "line") {
        
    } else if (modelChoice == "polygon") {
        
    }
})




/* ----------- Canvas Rendering -----------------------------------------------------------*/
const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);

    let verticesFinal = [];
    for(let i=0; i<vertices.length; i+=4) {
        let centroid = [(vertices[i][0] + vertices[i+3][0])/2, (vertices[i][1] + vertices[i+3][1])/2];
        for(let j=0; j<4; j++) {
            let dis = euclideanDistance(centroid, vertices[i+j]);
            let arg = norm(Math.atan2(vertices[i+j][0] - centroid[0], vertices[i+j][1] - centroid[1]) + theta/180 * Math.PI);
            verticesFinal.push([
                centroid[0] + dis * Math.cos(arg),
                centroid[1] + dis * Math.sin(arg)
            ])
        }
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    
    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);
    for(let i=0; i<vertices.length; i+=4) {
        gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    }
    
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
    
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);
    // for(let i=0; i<vertices.length; i+=4) {
    //         gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
    //     }
        
    window.requestAnimFrame(render);
}
    
    
/* * * * * * Model Selection * * * * * */
const model_choice = document.getElementById('model_choice');
model_choice.addEventListener('change', (e) => {
    if (e.target.value === 'line') {        //
        document.getElementById('height_val').disabled = true;
    } else if (e.target.value === 'square') {
        document.getElementById('height_val').disabled = true;
    } else if (e.target.value === 'rectangle') {
        document.getElementById('width_val').disabled = false;
        document.getElementById('height_val').disabled = false;
    } else if (e.target.value === 'polygon') {
        document.getElementById('height_val').disabled = true;
        document.getElementById('width_val').disabled = true;
    }
});


/* --------- Transformation Area --------- */

// Translation


// Rotation
// TODO: Make Array of Theta to keep on track on every corresponding shape
var theta = 0;

const rotateSlider = document.getElementById('rotate_val');
rotateSlider.addEventListener('input', (e) => {
    document.getElementById('rotate_output').textContent = e.target.value;
    theta = e.target.value;
});




render();
