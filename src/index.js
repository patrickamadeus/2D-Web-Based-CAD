// import { triangle } from "./models/triangle";

// config change
const model_choice = document.getElementById('model_choice');
const dummy = document.getElementById('dummy');

model_choice.addEventListener('change', (e) => {
    console.log(e.target.value)

    if (e.target.value === 'triangle') {
        // triangle();
        console.log("MASOK")
    }
});