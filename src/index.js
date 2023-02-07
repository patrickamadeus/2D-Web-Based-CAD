import { triangle } from './models/triangle.js';
// import { line } from './models/line.js';
import { square } from './models/square.js';
import { rectangle } from './models/rectangle.js';
// import { polygon } from './models/polygon.js';

var canvas = document.querySelector("#canvas");
canvas.width = 150;
canvas.height = 150;


// config change
const model_choice = document.getElementById('model_choice');

model_choice.addEventListener('change', (e) => {
    if (e.target.value === 'line') {        //
        document.getElementById('height_val').disabled = true;
        // line();
    } else if (e.target.value === 'square') {
        document.getElementById('height_val').disabled = true;
        square();
    } else if (e.target.value === 'rectangle') {
        document.getElementById('width_val').disabled = false;
        document.getElementById('height_val').disabled = false;
        rectangle();
    } else if (e.target.value === 'polygon') {
        document.getElementById('height_val').disabled = true;
        document.getElementById('width_val').disabled = true;
        // polygon();
    } else {
        triangle();
    }
});