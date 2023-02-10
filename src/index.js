// importing setup config
import { WebGLUtils } from './helpers/webgl-utils.js';
import { createProgramFromScratch, vSource, fSource } from './helpers/shader.js';

// Helpers & Utils
import { flatten, dec_hex, hex_dec, atan3, norm, euclideanDistance } from './helpers/utility.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, CMAP } from './helpers/const.js';

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
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
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

            objects[objects.length-1].changeVertexCoordinate(3,x,y);
            objects[objects.length-1].changeVertexAbsis(2,x);
            objects[objects.length-1].changeVertexOrdinate(1,y);
        }
    } else if (modelChoice == "square") {
        if(isDrawing){
            let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
            let y =  1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    
            objects[objects.length-1].changeVertexCoordinate(3,x,y);
            objects[objects.length-1].changeVertexAbsis(2,x);
            objects[objects.length-1].changeVertexOrdinate(1,y);
        }
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
                rectangle.changeVertexCoordinate(i, x, y);
            }
            rectangle.changeColor(CMAP.get(colorChoice));
            objects.push(rectangle);
            isDrawing = true;
        } else{
            isDrawing = false;
            objects[objects.length-1].computeCenter();
            updateModelList();
        }
    } else if (modelChoice == "square") {
        if (!isDrawing){
            let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
            let y =  1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
            
            let square = new Square(squareID++);
            for(let i = 0; i < 4; i++) {
                square.changeVertexCoordinate(i, x, y);
            }
            square.changeColor(CMAP.get(colorChoice));
            objects.push(square);
            isDrawing = true;
        } else{
            isDrawing = false;
            objects[objects.length-1].computeCenter();
            updateModelList();
        }
        
    } else if (modelChoice == "line") {
        
    } else if (modelChoice == "polygon") {
        
    }
})

var modelList = document.getElementById('model_list');
const updateModelList = () =>{
    modelList.innerHTML = `<option disabled selected value="none"> -- select a model -- </option>`;
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

    


const existing_model = document.getElementById('model_list');
if (existing_model.value == "none") {
    document.getElementById('width_val').disabled = true;
    document.getElementById('height_val').disabled = true;
    document.getElementById('trans_x_val').disabled = true;
    document.getElementById('trans_y_val').disabled = true;
    document.getElementById('rotate_val').disabled = true;
    document.getElementById('dilatation_val').disabled = true;
}

existing_model.addEventListener('change', (e) => {
    let selectedModel = objects[e.target.value];
    if (selectedModel instanceof Rectangle) {

        // Update option accessibility
        document.getElementById('width_val').disabled = false;
        document.getElementById('height_val').disabled = false;
        document.getElementById('trans_x_val').disabled = false;
        document.getElementById('trans_y_val').disabled = false;
        document.getElementById('rotate_val').disabled = false;
        document.getElementById('dilatation_val').disabled = false;
    
        // update current size
        document.getElementById('width_val').value = selectedModel.getWidth() / 2 * CANVAS_WIDTH;
        document.getElementById('width_output').textContent = selectedModel.getWidth() / 2 * CANVAS_WIDTH;        
        document.getElementById('height_val').value = selectedModel.getHeight() / 2 * CANVAS_HEIGHT;
        document.getElementById('height_output').textContent =  selectedModel.getHeight() / 2 * CANVAS_HEIGHT;

        // update current position in canvas
        let x = selectedModel.getCenter()[0] / 2 * CANVAS_WIDTH;
        let y = selectedModel.getCenter()[1] / 2 * CANVAS_HEIGHT;
        document.getElementById("trans_x_val").value = x;
        document.getElementById("trans_x_output").textContent = x;
        document.getElementById("trans_y_val").value = y;
        document.getElementById("trans_y_output").textContent = y;


    } else if (selectedModel instanceof Square) {

        // Update option accessibility
        document.getElementById('width_val').disabled = false;
        document.getElementById('height_val').disabled = true;
        document.getElementById('trans_x_val').disabled = false;
        document.getElementById('trans_y_val').disabled = false;
        document.getElementById('rotate_val').disabled = false;
        document.getElementById('dilatation_val').disabled = false;

        // update current size
        document.getElementById('width_val').value = selectedModel.getWidth() / 2 * CANVAS_WIDTH;
        document.getElementById('width_output').textContent = selectedModel.getWidth() / 2 * CANVAS_WIDTH; 

        // update current position in canvas
        let x = selectedModel.getCenter()[0] / 2 * CANVAS_WIDTH;
        let y = selectedModel.getCenter()[1] / 2 * CANVAS_HEIGHT;
        document.getElementById("trans_x_val").value = x;
        document.getElementById("trans_x_output").textContent = x;
        document.getElementById("trans_y_val").value = y;
        document.getElementById("trans_y_output").textContent = y;


    } else if (selectedModel instanceof Line) {
        // TODO: implement line
    } else if (selectedModel instanceof Polygon) {
        // TODO: implement polygon
    }

});

/* --------- Model Sizing Area ---------- */
const widthSlider = document.getElementById('width_val');
widthSlider.addEventListener('input', (e) => {
    document.getElementById('width_output').textContent = e.target.value;

    const width = e.target.value / CANVAS_WIDTH * 2;
    objects[existing_model.value].setWidth(width);
});

const heightSlider = document.getElementById('height_val');
heightSlider.addEventListener('input', (e) => {
    document.getElementById('height_output').textContent = e.target.value;

    const height = e.target.value / CANVAS_HEIGHT * 2;
    objects[existing_model.value].setHeight(height);
});



/* --------- Transformation Area --------- */

// Translation
const translateSliderX = document.getElementById('trans_x_val');
translateSliderX.addEventListener('input', (e) => {
    document.getElementById("trans_x_output").textContent = e.target.value;

    let x = objects[existing_model.value].getCenter()[0];

    objects[existing_model.value].setTranslateX(e.target.value / CANVAS_WIDTH * 2 - x);
});

const translateSliderY = document.getElementById('trans_y_val');
translateSliderY.addEventListener('input', (e) => {
    document.getElementById("trans_y_output").textContent = e.target.value;

    let y = objects[existing_model.value].getCenter()[1];

    objects[existing_model.value].setTranslateY(e.target.value / CANVAS_WIDTH * 2 - y);
});



// rotation
const rotateSlider = document.getElementById('rotate_val');
rotateSlider.addEventListener('input', (e) => {
    document.getElementById('rotate_output').textContent = e.target.value;
    objects[existing_model.value].rotate(e.target.value, -1);
});



// dilatation
const dilatationSlider = document.getElementById('dilatation_val')
dilatationSlider.addEventListener( 'input' , (e) => {
    document.getElementById('dilatation_output').textContent = e.target.value
    objects[existing_model.value].dilate(e.target.value)
})
