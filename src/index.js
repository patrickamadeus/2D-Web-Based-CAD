// importing setup config
import { WebGLUtils } from './helpers/webgl-utils.js';
import { createProgramFromScratch, vSource, fSource } from './helpers/shader.js';

// Helpers & Utils
import { flatten, dec_hex, hex_dec, atan3, norm, euclideanDistance } from './helpers/utility.js';
import { colorMap } from './helpers/const.js';

// Models
import { Line } from './models/line.js';
import { Square } from './models/square.js';
import { Rectangle } from './models/rectangle.js';
import { Polygon } from './models/polygon.js';


/* ----------- Global Variables -----------------------------------------------------------*/
var objects = [];
var canvas = document.querySelector("#canvas");
var isDrawing = false;
var rectangleID = 0
var polygonID = 0
var squareID = 0
var lineID = 0


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

            objects[objects.length-1].modifyVertexCoordinate(3,x,y);
            objects[objects.length-1].modifyVertexAbsis(2,x);
            objects[objects.length-1].modifyVertexOrdinate(1,y);
        }
    } else if (modelChoice == "square") {

    } else if (modelChoice == "line") {
        
    } else if (modelChoice == "polygon") {
        
    }
});

canvas.addEventListener('mousedown', (e) => {
    modelChoice = document.querySelector("#model_choice").value;
    colorChoice = document.querySelector("#color_choice").value;

    console.log(objects)

    if (modelChoice == "none" || colorChoice == "none") {
        alert("Please choose model and color");
        return;
    }

    if(!isDrawing && objects.length == 5){
        alert("You can only draw 5 objects!");
        return;
    }

    if (modelChoice == "rectangle") {
        if (!isDrawing){
            let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
            let y =  1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
            
            let rectangle = new Rectangle(rectangleID++);
            for(let i = 0; i < 4; i++) {
                rectangle.modifyVertexCoordinate(i, x, y);
            }
            rectangle.modifyColor(colorMap.get(colorChoice));
            objects.push(rectangle);
            isDrawing = true;
        } else{
            isDrawing = false;
            updateModelList();            
        }
    } else if (modelChoice == "square") {
        
    } else if (modelChoice == "line") {
        
    } else if (modelChoice == "polygon") {
        
    }
})

var modelList = document.getElementById('model_list');
const updateModelList = () =>{
    modelList.innerHTML = `<option disabled selected value="none"> -- select a color -- </option>`;
    for (let i = 0; i < objects.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = objects[i].name;
        modelList.appendChild(opt);
    }
}


/* ----------- Canvas Rendering -----------------------------------------------------------*/
const render = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < objects.length; i++) {
        objects[i].render(gl, program, vBuffer, cBuffer);
    }
    window.requestAnimFrame(render);
}

render();

    
/* ------- Model Selection ---------------------------------------- */
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


const existing_model = document.getElementById('model_list');
existing_model.addEventListener('change', (e) => {
    let selectedModel = objects[e.target.value];
    if (selectedModel instanceof Rectangle) {
        document.getElementById('width_val').disabled = false;
        document.getElementById('height_val').disabled = false;

        // update current size
        document.getElementById('width_val').value = selectedModel.getWidth() / 2 * canvas.width;
        document.getElementById('width_output').textContent = selectedModel.getWidth() / 2 * canvas.width;

        document.getElementById('height_val').value = selectedModel.getHeight() / 2 * canvas.height;
        document.getElementById('height_output').textContent =  selectedModel.getHeight() / 2 * canvas.height;
    }
});

/* --------- Model Sizing Area ---------- */
const widthSlider = document.getElementById('width_val');
widthSlider.addEventListener('input', (e) => {
    document.getElementById('width_output').textContent = e.target.value;
});



/* --------- Transformation Area --------- */

// Translation
const translateSliderX = document.getElementById('trans_x_val');
translateSliderX.addEventListener('input', (e) => {
    document.getElementById("trans_x_output").textContent = e.target.value;
    console.log(e.target.value)

});

// Rotation
// TODO: Make Array of Theta to keep on track on every corresponding shape
var theta = 0;

const rotateSlider = document.getElementById('rotate_val');
rotateSlider.addEventListener('input', (e) => {
    document.getElementById('rotate_output').textContent = e.target.value;
    theta = e.target.value;
});
