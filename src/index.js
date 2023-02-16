// importing setup config
import { WebGLUtils } from "./helpers/webgl-utils.js";
import {
  createProgramFromScratch,
  vSource,
  fSource,
} from "./helpers/shader.js";

// Helpers & Utils
import { CANVAS_HEIGHT, CANVAS_WIDTH, CMAP } from "./helpers/const.js";
import { exportFile } from "./helpers/load.js";

// Models
import { Line } from "./models/line.js";
import { Square } from "./models/square.js";
import { Rectangle } from "./models/rectangle.js";
import { Polygon } from "./models/polygon.js";

/* ----------- Global Variables -----------------------------------------------------------*/
var objects = [];
var canvas = document.querySelector("#canvas");
var isDrawing = false;
var isEditing = false;
var rectangleID = 0;
var polygonID = 0;
var squareID = 0;
var lineID = 0;

/* ----------- Initialization -----------------------------------------------------------*/
const gl = WebGLUtils.setupWebGL(canvas);
if (!gl) {
  alert("Ur browser doesn't support WebGL tot");
}

// set size and scale
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.getElementById("width_val").setAttribute("max", CANVAS_WIDTH);
document.getElementById("height_val").setAttribute("max", CANVAS_HEIGHT);
document
  .getElementById("trans_x_val")
  .setAttribute("min", (CANVAS_WIDTH / 2) * -1);
document.getElementById("trans_x_val").setAttribute("max", CANVAS_WIDTH / 2);
document
  .getElementById("trans_y_val")
  .setAttribute("min", (CANVAS_HEIGHT / 2) * -1);
document.getElementById("trans_y_val").setAttribute("max", CANVAS_HEIGHT / 2);

// initialize program
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.8, 0.8, 1, 1.0);
const program = createProgramFromScratch(gl, vSource, fSource);
gl.useProgram(program);

const vBuffer = gl.createBuffer();
const cBuffer = gl.createBuffer();

/* ----------- Canvas Event Listener -----------------------------------------------------------*/
var modelChoice;
var colorChoice;

canvas.addEventListener("mousemove", function (e) {
  if (isDrawing) {
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    let object = objects[objects.length - 1];

    if (modelChoice == "rectangle") {
      object.setVertexCoordinate(1, x, object.getVertexCoor(0)[1]);
      object.setVertexCoordinate(2, x, y);
      object.setVertexCoordinate(3, object.getVertexCoor(0)[0], y);
    } else if (modelChoice == "square") {
      object.moveVertex(2, [x, y]); // default kanan bawah
    } else if (modelChoice == "line") {
      object.setVertexCoordinate(1, x, y);
    } else if (modelChoice == "polygon") {
    }
  }
});

canvas.addEventListener("mousedown", (e) => {
  modelChoice = document.querySelector("#model_choice").value;
  colorChoice = document.querySelector("#color_choice").value;

  let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
  let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;

  if (modelChoice == "none" || colorChoice == "none") {
    alert("Please choose model and color");
    return;
  }

  if (!isDrawing && objects.length == 5) {
    alert("You can only draw 5 objects!");
    return;
  }

  if (modelChoice == "rectangle") {
    if (!isDrawing) {
      let rectangle = new Rectangle(rectangleID++);

      rectangle.vertices[0].coordinate = [x, y];
      rectangle.setColor(CMAP.get(colorChoice));
      objects.push(rectangle);
      isDrawing = true;
    } else {
      isDrawing = false;
      objects[objects.length - 1].computeCenter();
      updateModelList();
    }
  } else if (modelChoice == "square") {
    if (!isDrawing) {
      let square = new Square(squareID++);

      square.vertices[0].coordinate = [x, y];
      square.center.coordinate = [x, y];
      square.setColor(CMAP.get(colorChoice));
      objects.push(square);
      isDrawing = true;
    } else {
      isDrawing = false;
      objects[objects.length - 1].computeCenter();
      updateModelList();
    }
  } else if (modelChoice == "line") {
    if (!isDrawing) {
      let line = new Line(lineID++);
      line.vertices[0].coordinate = [x, y];
      line.vertices[1].coordinate = [x, y];
      line.setColor(CMAP.get(colorChoice));
      objects.push(line);
      isDrawing = true;
    } else {
      isDrawing = false;
      objects[objects.length - 1].computeCenter();
      updateModelList();
    }
  } else if (modelChoice == "polygon") {
  }
});

var modelList = document.getElementById("model_list");
const updateModelList = () => {
  modelList.innerHTML = `<option disabled selected value="none"> -- select a model -- </option>`;
  for (let i = 0; i < objects.length; i++) {
    let opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = objects[i].name;
    modelList.appendChild(opt);
  }
};

/* ----------- Canvas Rendering -----------------------------------------------------------*/
const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i = 0; i < objects.length; i++) {
    objects[i].render(gl, program, vBuffer, cBuffer);
  }
  window.requestAnimFrame(render);
};

render();

/* New Model Create Selection Section */
const new_model = document.getElementById("model_choice");
new_model.addEventListener("change", (e) => {
  document.getElementById("model_list").value = "none";
  document.getElementById("model_list").text = " -- select a model -- ";
  document.getElementById("edit_color_choice").value = "none";
  document.getElementById("edit_color_choice").text = " -- model color -- ";
});

/* Existing Model Edit Section */
const existing_model = document.getElementById("model_list");
if (existing_model.value == "none") {
  document.getElementById("width_val").disabled = true;
  document.getElementById("height_val").disabled = true;
  document.getElementById("trans_x_val").disabled = true;
  document.getElementById("trans_y_val").disabled = true;
  document.getElementById("rotate_val").disabled = true;
  document.getElementById("dilatation_val").disabled = true;
  document.getElementById("edit_color_choice").disabled = true;
}

existing_model.addEventListener("change", (e) => {
  let selectedModel = objects[e.target.value];

  // disable CREATE NEW MODEL
  document.getElementById("model_choice").value = "none";
  document.getElementById("model_choice").text = " -- select a model -- ";
  document.getElementById("color_choice").value = "none";
  document.getElementById("color_choice").text = " -- select a color -- ";

  if (selectedModel instanceof Rectangle) {
    // Update option accessibility
    document.getElementById("width_val").disabled = false;
    document.getElementById("height_val").disabled = false;
    document.getElementById("trans_x_val").disabled = false;
    document.getElementById("trans_y_val").disabled = false;
    document.getElementById("rotate_val").disabled = false;
    document.getElementById("dilatation_val").disabled = false;
    document.getElementById("edit_color_choice").disabled = false;
    isDrawing = false;

    // update current size
    document.getElementById("width_val").value =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("height_val").value =
      (selectedModel.getHeight() / 2) * CANVAS_HEIGHT;
    document.getElementById("height_output").textContent =
      (selectedModel.getHeight() / 2) * CANVAS_HEIGHT;

    // update current position in canvas
    let x = (selectedModel.getCenter()[0] / 2) * CANVAS_WIDTH;
    let y = (selectedModel.getCenter()[1] / 2) * CANVAS_HEIGHT;
    document.getElementById("trans_x_val").value = x;
    document.getElementById("trans_x_output").textContent = x;
    document.getElementById("trans_y_val").value = y;
    document.getElementById("trans_y_output").textContent = y;
    document.getElementById("rotate_val").value = selectedModel.rotation;
    document.getElementById("rotate_output").value = selectedModel.rotation;
  } else if (selectedModel instanceof Square) {
    // Update option accessibility
    document.getElementById("width_val").disabled = false;
    document.getElementById("height_val").disabled = true;
    document.getElementById("trans_x_val").disabled = false;
    document.getElementById("trans_y_val").disabled = false;
    document.getElementById("rotate_val").disabled = false;
    document.getElementById("dilatation_val").disabled = false;
    document.getElementById("edit_color_choice").disabled = false;

    // update current size
    document.getElementById("width_val").value =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;

    // update current position in canvas
    let x = (selectedModel.getCenter()[0] / 2) * CANVAS_WIDTH;
    let y = (selectedModel.getCenter()[1] / 2) * CANVAS_HEIGHT;
    document.getElementById("trans_x_val").value = x;
    document.getElementById("trans_x_output").textContent = x;
    document.getElementById("trans_y_val").value = y;
    document.getElementById("trans_y_output").textContent = y;

    // update rotation angle
    document.getElementById("rotate_val").value = selectedModel.rotation;
    document.getElementById("rotate_output").value = selectedModel.rotation;
  } else if (selectedModel instanceof Line) {
    // Update option accessibility
    document.getElementById("width_val").disabled = false;
    document.getElementById("height_val").disabled = true;
    document.getElementById("trans_x_val").disabled = false;
    document.getElementById("trans_y_val").disabled = false;
    document.getElementById("rotate_val").disabled = false;
    document.getElementById("dilatation_val").disabled = false;
    document.getElementById("edit_color_choice").disabled = false;

    // update current size
    document.getElementById("width_val").value =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("height_val").value =
      (selectedModel.getHeight() / 2) * CANVAS_HEIGHT;
    document.getElementById("height_output").textContent =
      (selectedModel.getHeight() / 2) * CANVAS_HEIGHT;

    // update current position in canvas
    let x = (selectedModel.getCenter()[0] / 2) * CANVAS_WIDTH;
    let y = (selectedModel.getCenter()[1] / 2) * CANVAS_HEIGHT;
    document.getElementById("trans_x_val").value = x;
    document.getElementById("trans_x_output").textContent = x;
    document.getElementById("trans_y_val").value = y;
    document.getElementById("trans_y_output").textContent = y;
    document.getElementById("rotate_val").value = selectedModel.rotation;
    document.getElementById("rotate_output").value = selectedModel.rotation;

    // update rotation angle
    document.getElementById("rotate_val").value =
      selectedModel.getRotatedIdiot();
    document.getElementById("rotate_output").value =
      selectedModel.getRotatedIdiot();
  } else if (selectedModel instanceof Polygon) {
    // TODO: implement polygon
  }
});

/* --------- Model Sizing Area ---------- */
const widthSlider = document.getElementById("width_val");
widthSlider.addEventListener("input", (e) => {
  document.getElementById("width_output").textContent = e.target.value;

  const width = (e.target.value / CANVAS_WIDTH) * 2;
  objects[existing_model.value].setWidth(width);
});

const heightSlider = document.getElementById("height_val");
heightSlider.addEventListener("input", (e) => {
  document.getElementById("height_output").textContent = e.target.value;

  const height = (e.target.value / CANVAS_HEIGHT) * 2;
  objects[existing_model.value].setHeight(height);
});

/* --------- Transformation Area --------- */

// Translation
const translateSliderX = document.getElementById("trans_x_val");
translateSliderX.addEventListener("input", (e) => {
  document.getElementById("trans_x_output").textContent = e.target.value;

  let x = objects[existing_model.value].getCenter()[0];

  objects[existing_model.value].setTranslateX(
    (e.target.value / CANVAS_WIDTH) * 2 - x
  );
});

const translateSliderY = document.getElementById("trans_y_val");
translateSliderY.addEventListener("input", (e) => {
  document.getElementById("trans_y_output").textContent = e.target.value;

  let y = objects[existing_model.value].getCenter()[1];

  objects[existing_model.value].setTranslateY(
    (e.target.value / CANVAS_WIDTH) * 2 - y
  );
});

// rotation
const rotateSlider = document.getElementById("rotate_val");
rotateSlider.addEventListener("input", (e) => {
  document.getElementById("rotate_output").textContent = e.target.value;
  objects[existing_model.value].rotate(e.target.value, -1);
});

// dilatation
const dilatationSlider = document.getElementById("dilatation_val");
dilatationSlider.addEventListener("input", (e) => {
  document.getElementById("dilatation_output").textContent = e.target.value;
  objects[existing_model.value].dilate(e.target.value);
});

/* --------- Color Editing Area --------- */
const modelColor = document.getElementById("edit_color_choice");
modelColor.addEventListener("change", (e) => {
  objects[existing_model.value].setColor(CMAP.get(e.target.value));
});

/* --------- Import & Export Section --------- */
const exportButton = document.getElementById("export_button");
exportButton.addEventListener("click", (e) => {
  const exportFilename = document.getElementById("export_file").value;
  exportFile(exportFilename, objects);
});

const importFileContainer = document.getElementById("import_file");
const importButton = document.getElementById("import_button");

if (importFileContainer.files.length == 0) {
  importButton.disabled = true;
}

// File Event Listener
importFileContainer.addEventListener("change", (e) => {
  if (importFileContainer.files.length > 0) {
    importButton.disabled = false;
  } else {
    importButton.disabled = true;
  }
});

importButton.addEventListener("click", (e) => {
  importFile(importFileContainer.files[0]);

  // delete import filecontainer files
  importFileContainer.value = "";
  importButton.disabled = true;
});

// IMPORT
const importFile = (file) => {
  const reader = new FileReader();
  reader.onload = function (e) {
    const toAppend = JSON.parse(e.target.result);

    for (let i = 0; i < toAppend.length; i++) {
      if (toAppend[i].shape == "line") {
        objects.push(new Line(lineID++));
      } else if (toAppend[i].shape == "square") {
        objects.push(new Square(squareID++));
      } else if (toAppend[i].shape == "rectangle") {
        objects.push(new Rectangle(rectangleID++));
      } else if (toAppend[i].shape == "polygon") {
        objects.push(new Polygon(polygonID++));
      }
      objects[objects.length - 1].copy(toAppend[i]);
    }
    updateModelList();
  };

  reader.readAsText(file);
};
