// importing setup config
import { WebGLUtils } from "./helpers/webgl-utils.js";
import {
  createProgramFromScratch,
  vSource,
  fSource,
} from "./helpers/shader.js";

// Helpers & Utils
import { CANVAS_HEIGHT, CANVAS_WIDTH, CMAP, RCMAP } from "./helpers/const.js";
import { exportFile } from "./helpers/load.js";

// Models
import { Line } from "./models/line.js";
import { Square } from "./models/square.js";
import { Rectangle } from "./models/rectangle.js";
import { Polygon } from "./models/polygon.js";
import { Point } from "./models/Model.js";
import {
  euclideanDistance,
  myConvexHull,
  quickSort,
  sortClockwise,
} from "./helpers/utility.js";

// Global object array
var objects = [];
var initialVertex;
var canvas = document.querySelector("#canvas");

// Global event state
var isDrawingModel = false;
var isSelectingVertex = false;
var isDraggingVertex = false;
var isAddingVertex = false;

// Global object ID
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

var modelChoice;
var colorChoice;
var vertexChoice;

//* ------------------- Change Vertex Properties Segment -------------------------------*/
canvas.addEventListener("mousedown", (e) => {
  let selectedModel = objects[document.getElementById("model_list").value];
  if (!isDrawingModel && selectedModel) {
    let vertices = selectedModel.vertices;
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;

    for (let i = 0; i < vertices.length; i++) {
      // If there exists a vertex within 0.05 distance from mouse click
      if (euclideanDistance([x, y], vertices[i].coordinate) < 0.05) {
        vertexChoice = i;
        document.getElementById("vertex_color_choice").disabled = false;
        document.getElementById("vertex_color_choice").value = RCMAP.get(
          vertices[i].color.toString()
        );

        if (selectedModel instanceof Polygon) {
          document.getElementById("delete_vertex_button").disabled = false;
        }

        isSelectingVertex = true;
        isDraggingVertex = true;
        break;
      }

      // ...if not, then reset the vertex selection
      else {
        vertexChoice = -1;
        isSelectingVertex = false;
        document.getElementById("vertex_color_choice").disabled = true;
        document.getElementById("vertex_color_choice").value = "none";
        document.getElementById("delete_vertex_button").disabled = true;
      }
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isDraggingVertex) {
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;

    let selectedModel = objects[document.getElementById("model_list").value];
    if (selectedModel instanceof Rectangle) {
      selectedModel.moveVertex(vertexChoice, [x, y]);
    } else {
      selectedModel.moveVertex(vertexChoice, [x, y]);
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (isSelectingVertex) {
    isDraggingVertex = false;
  }
});

// Change vertex color
const vertexColorChoice = document.getElementById("vertex_color_choice");
vertexColorChoice.addEventListener("change", (e) => {
  let selectedModel = objects[document.getElementById("model_list").value];
  if (selectedModel) {
    objects[document.getElementById("model_list").value].vertices[
      vertexChoice
    ].color = CMAP.get(vertexColorChoice.value);
  }
});

// mouse move untuk creating object
canvas.addEventListener("mousemove", function (e) {
  if (isDrawingModel) {
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    let object = objects[objects.length - 1];

    if (modelChoice == "rectangle") {
      object.setVertexCoordinate(1, x, object.getVertexCoor(0)[1]);
      object.setVertexCoordinate(2, x, y);
      object.setVertexCoordinate(3, object.getVertexCoor(0)[0], y);

      initialVertex = [x, y];
    } else if (modelChoice == "square") {
      object.moveVertex(2, [x, y]); // default kanan bawah
    } else if (modelChoice == "line") {
      object.setVertexCoordinate(1, x, y);
    } else if (modelChoice == "polygon") {
      object.setVertexCoordinate(object.vertices.length - 1, x, y);
    }
  }
});

/*
█▀▄ █▄█ █▄░█ ▄▀█ █▀▄▀█ █ █▀▀   █░█ █▀█ █▀▄ ▄▀█ ▀█▀ █▀▀
█▄▀ ░█░ █░▀█ █▀█ █░▀░█ █ █▄▄   █▄█ █▀▀ █▄▀ █▀█ ░█░ ██▄
*/
canvas.addEventListener("mousemove", (e) => {
  let object;
  if (isDrawingModel) {
    object = objects[objects.length - 1];
  } else if (!isDrawingModel && isDraggingVertex) {
    object = objects[document.getElementById("model_list").value];
  } else {
    return;
  }
  let x = (object.getCenter()[0] / 2) * CANVAS_WIDTH;
  let y = (object.getCenter()[1] / 2) * CANVAS_HEIGHT;

  // Update base selection access
  document.getElementById("width_val").disabled = false;
  document.getElementById("height_val").disabled = false;
  document.getElementById("trans_x_val").disabled = false;
  document.getElementById("trans_y_val").disabled = false;
  document.getElementById("rotate_val").disabled = false;
  document.getElementById("dilatation_val").disabled = false;
  document.getElementById("shearGX_val").disabled = false;
  document.getElementById("shearGY_val").disabled = false;
  document.getElementById("shearLX_val").disabled = false;
  document.getElementById("shearLY_val").disabled = false;
  document.getElementById("edit_color_choice").disabled = false;

  // Update position
  document.getElementById("trans_x_val").value = x;
  document.getElementById("trans_x_output").textContent = x;
  document.getElementById("trans_y_val").value = y;
  document.getElementById("trans_y_output").textContent = y;

  // update rotation angle
  document.getElementById("rotate_val").value = object.rotation;
  document.getElementById("rotate_output").value = object.rotation;

  // Special case for each shape
  if (object instanceof Rectangle) {
    // Update RECTANGLE accessibility
    document.getElementById("width_val").value =
      (object.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (object.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("height_val").value =
      (object.getHeight() / 2) * CANVAS_HEIGHT;
    document.getElementById("height_output").textContent =
      (object.getHeight() / 2) * CANVAS_HEIGHT;
  } else if (object instanceof Square) {
    // Update SQUARE accessibility
    document.getElementById("height_val").disabled = true;
    document.getElementById("width_val").value =
      (object.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (object.getWidth() / 2) * CANVAS_WIDTH;
  } else if (object instanceof Line) {
    // Update LINE accessibility
    document.getElementById("height_val").disabled = true;
    document.getElementById("width_val").value =
      (object.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (object.getWidth() / 2) * CANVAS_WIDTH;
  } else if (object instanceof Polygon) {
    // Do nothing
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (document.getElementById("model_list").value != "none") return;
  modelChoice = document.querySelector("#model_choice").value;
  colorChoice = document.querySelector("#color_choice").value;

  let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
  let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;

  if (modelChoice == "none" || colorChoice == "none") {
    alert("Please choose model and color");
    return;
  }

  if (!isDrawingModel && objects.length == 5) {
    alert("You can only draw 5 objects!");
    return;
  }

  document.getElementById("width_val").disabled = true;
  document.getElementById("height_val").disabled = true;
  document.getElementById("trans_x_val").disabled = true;
  document.getElementById("trans_y_val").disabled = true;
  document.getElementById("rotate_val").disabled = true;
  document.getElementById("dilatation_val").disabled = true;
  document.getElementById("shearGX_val").disabled = true;
  document.getElementById("shearGY_val").disabled = true;
  document.getElementById("shearLX_val").disabled = true;
  document.getElementById("shearLY_val").disabled = true;
  document.getElementById("edit_color_choice").disabled = true;
  document.getElementById("vertex_color_choice").disabled = true;

  if (modelChoice == "rectangle") {
    if (!isDrawingModel) {
      let rectangle = new Rectangle(rectangleID++);

      rectangle.vertices[0].coordinate = [x, y];
      rectangle.setColor(CMAP.get(colorChoice));
      objects.push(rectangle);
      isDrawingModel = true;
    } else {
      isDrawingModel = false;
      objects[objects.length - 1].computeCenter();
      updateModelList();
    }
  } else if (modelChoice == "square") {
    if (!isDrawingModel) {
      let square = new Square(squareID++);

      square.vertices[0].coordinate = [x, y];
      square.center.coordinate = [x, y];
      square.setColor(CMAP.get(colorChoice));
      objects.push(square);
      isDrawingModel = true;
    } else {
      isDrawingModel = false;
      objects[objects.length - 1].computeCenter();
      updateModelList();
    }
  } else if (modelChoice == "line") {
    if (!isDrawingModel) {
      let line = new Line(lineID++);
      line.vertices[0].coordinate = [x, y];
      line.vertices[1].coordinate = [x, y];
      line.setColor(CMAP.get(colorChoice));
      objects.push(line);
      isDrawingModel = true;
    } else {
      isDrawingModel = false;
      objects[objects.length - 1].computeCenter();
      updateModelList();
    }
  } else if (modelChoice == "polygon") {
    if (!isDrawingModel) {
      let polygon = new Polygon(polygonID++);
      polygon.addVertex(x, y, CMAP.get(colorChoice));
      polygon.addVertex(x, y, CMAP.get(colorChoice));
      objects.push(polygon);
      isDrawingModel = true;
    } else {
      let polygon = objects[objects.length - 1];
      polygon.addVertex(x, y, CMAP.get(colorChoice));
    }
  }
});

// POLYGON STOPPER
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (isDrawingModel && modelChoice == "polygon") {
    let object = objects[objects.length - 1];
    object.vertices.pop();
    object.vertices.pop();

    isDrawingModel = false;
    objects[objects.length - 1].computeCenter();
    updateModelList();
  }
});

// POLYGON VERTEX DELETION
document
  .getElementById("delete_vertex_button")
  .addEventListener("click", (e) => {
    let object = objects[document.getElementById("model_list").value];
    object.deleteVertex(vertexChoice);
  });

// POLYGON VERTEX ADDITION
let addVertexButton = document.getElementById("add_vertex_button");
addVertexButton.addEventListener("click", (e) => {
  if (isAddingVertex) {
    isAddingVertex = false;
    addVertexButton.textContent = "Add Vertex";

    // UNBLOCK ALL OTHER BUTTON
    document.getElementById("delete_vertex_button").disabled = false;
    document.getElementById("convex_hull_button").disabled = false;
  } else {
    isAddingVertex = true;
    addVertexButton.textContent = "Cancel Add Vertex";

    // BLOCK ALL OTHER BUTTON
    document.getElementById("delete_vertex_button").disabled = true;
    document.getElementById("convex_hull_button").disabled = true;
  }
});

// POLYGON CONVEX HULL
let convexHullButton = document.getElementById("convex_hull_button");
convexHullButton.addEventListener("click", (e) => {
  console.log("hi");
  let object = objects[document.getElementById("model_list").value];
  if (object instanceof Polygon) {
    let coordinates = quickSort(
      object.vertices.map((vertex) => vertex.coordinate)
    );
    let convex_coordinates = myConvexHull(coordinates);

    let newVertices = [];
    let id = 0;
    for (let i = 0; i < convex_coordinates.length; i++) {
      newVertices.push(
        new Point(
          [convex_coordinates[i][0], convex_coordinates[i][1]],
          object.vertices[0].color,
          id++
        )
      );
    }

    object.vertices = sortClockwise(newVertices, object.center);
  }
});

canvas.addEventListener("mousedown", (e) => {
  if (isAddingVertex) {
    let object = objects[document.getElementById("model_list").value];
    let x = (2 * (e.clientX - canvas.offsetLeft)) / canvas.clientWidth - 1;
    let y = 1 - (2 * (e.clientY - canvas.offsetTop)) / canvas.clientHeight;
    object.newVertex([x, y], CMAP.get(colorChoice));
    object.computeCenter();
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

/* New Model Create Selection Section */
const new_model = document.getElementById("model_choice");
new_model.addEventListener("change", (e) => {
  document.getElementById("model_list").value = "none";
  document.getElementById("model_list").text = " -- select a model -- ";
  document.getElementById("edit_color_choice").disabled = true;
  document.getElementById("edit_color_choice").value = "none";
  document.getElementById("edit_color_choice").text =
    " -- choose existing model -- ";
  document.getElementById("vertex_color_choice").disabled = true;
  document.getElementById("vertex_color_choice").value = "none";
  document.getElementById("vertex_color_choice").text = " -- choose vertex -- ";
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
  document.getElementById("shearGX_val").disabled = true;
  document.getElementById("shearGY_val").disabled = true;
  document.getElementById("shearLX_val").disabled = true;
  document.getElementById("shearLY_val").disabled = true;
  document.getElementById("edit_color_choice").disabled = true;
  document.getElementById("vertex_color_choice").disabled = true;
}

existing_model.addEventListener("change", (e) => {
  // Disable create new model access
  document.getElementById("model_choice").value = "none";
  document.getElementById("color_choice").value = "none";

  let selectedModel = objects[e.target.value];
  let x = (selectedModel.getCenter()[0] / 2) * CANVAS_WIDTH;
  let y = (selectedModel.getCenter()[1] / 2) * CANVAS_HEIGHT;

  // Update base selection access
  document.getElementById("width_val").disabled = false;
  document.getElementById("height_val").disabled = false;
  document.getElementById("trans_x_val").disabled = false;
  document.getElementById("trans_y_val").disabled = false;
  document.getElementById("rotate_val").disabled = false;
  document.getElementById("dilatation_val").disabled = false;
  document.getElementById("shearGX_val").disabled = false;
  document.getElementById("shearGY_val").disabled = false;
  document.getElementById("shearLX_val").disabled = false;
  document.getElementById("shearLY_val").disabled = false;
  document.getElementById("edit_color_choice").disabled = false;

  // Update position
  document.getElementById("trans_x_val").value = x;
  document.getElementById("trans_x_output").textContent = x;
  document.getElementById("trans_y_val").value = y;
  document.getElementById("trans_y_output").textContent = y;

  // update rotation angle
  document.getElementById("rotate_val").value = selectedModel.rotation;
  document.getElementById("rotate_output").value = selectedModel.rotation;

  // Polygon vertex
  document.getElementById("add_vertex_button").disabled = true;
  document.getElementById("delete_vertex_button").disabled = true;
  document.getElementById("convex_hull_button").disabled = true;

  // Special case for each shape
  if (selectedModel instanceof Rectangle) {
    // Update RECTANGLE accessibility
    document.getElementById("width_val").value =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("height_val").value =
      (selectedModel.getHeight() / 2) * CANVAS_HEIGHT;
    document.getElementById("height_output").textContent =
      (selectedModel.getHeight() / 2) * CANVAS_HEIGHT;
  } else if (selectedModel instanceof Square) {
    // Update SQUARE accessibility
    document.getElementById("height_val").disabled = true;
    document.getElementById("width_val").value =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
  } else if (selectedModel instanceof Line) {
    // Update LINE accessibility
    document.getElementById("height_val").disabled = true;
    document.getElementById("width_val").value =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
    document.getElementById("width_output").textContent =
      (selectedModel.getWidth() / 2) * CANVAS_WIDTH;
  } else if (selectedModel instanceof Polygon) {
    document.getElementById("width_val").disabled = true;
    document.getElementById("height_val").disabled = true;
    document.getElementById("add_vertex_button").disabled = false;
    document.getElementById("convex_hull_button").disabled = false;
  }
});

/*
█▀ █ ▀█ █ █▄░█ █▀▀
▄█ █ █▄ █ █░▀█ █▄█
*/
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

/*
▀█▀ █▀█ ▄▀█ █▄░█ █▀ █░░ ▄▀█ ▀█▀ █ █▀█ █▄░█
░█░ █▀▄ █▀█ █░▀█ ▄█ █▄▄ █▀█ ░█░ █ █▄█ █░▀█
*/

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
    (e.target.value / CANVAS_HEIGHT) * 2 - y
  );
});

/*
█▀█ █▀█ ▀█▀ ▄▀█ ▀█▀ █ █▀█ █▄░█
█▀▄ █▄█ ░█░ █▀█ ░█░ █ █▄█ █░▀█ 
*/
const rotateSlider = document.getElementById("rotate_val");
rotateSlider.addEventListener("input", (e) => {
  document.getElementById("rotate_output").textContent = e.target.value;
  objects[existing_model.value].rotate(e.target.value, -1);
});

/*
█▀▄ █ █░░ ▄▀█ ▀█▀ ▄▀█ ▀█▀ █ █▀█ █▄░█
█▄▀ █ █▄▄ █▀█ ░█░ █▀█ ░█░ █ █▄█ █░▀█
*/
const dilatationSlider = document.getElementById("dilatation_val");
dilatationSlider.addEventListener("input", (e) => {
  document.getElementById("dilatation_output").textContent = e.target.value;
  objects[existing_model.value].dilate(e.target.value);
});

/*
█▀ █░█ █▀▀ ▄▀█ █▀█
▄█ █▀█ ██▄ █▀█ █▀▄
*/
const shearSliderGX = document.getElementById("shearGX_val");
shearSliderGX.addEventListener("input", (e) => {
  document.getElementById("shearGX_output").textContent = e.target.value;
  objects[existing_model.value].GlobalShearingX(e.target.value);
});

const shearSliderGY = document.getElementById("shearGY_val");
shearSliderGY.addEventListener("input", (e) => {
  document.getElementById("shearGY_output").textContent = e.target.value;
  objects[existing_model.value].GlobalShearingY(e.target.value);
});

/*
█▀ █░█ ▄▀█ █▀█ █▀▀   █▀▀ █▀█ █░░ █▀█ █▀█
▄█ █▀█ █▀█ █▀▀ ██▄   █▄▄ █▄█ █▄▄ █▄█ █▀▄
*/
const modelColor = document.getElementById("edit_color_choice");
modelColor.addEventListener("change", (e) => {
  objects[existing_model.value].setColor(CMAP.get(e.target.value));
});

/*
█ █▀▄▀█ █▀█ █▀█ █▀█ ▀█▀  &   █▀▀ ▀▄▀ █▀█ █▀█ █▀█ ▀█▀
█ █░▀░█ █▀▀ █▄█ █▀▄ ░█░  &   ██▄ █░█ █▀▀ █▄█ █▀▄ ░█░ 
*/
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

const render = () => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (let i = 0; i < objects.length; i++) {
    objects[i].render(gl, program, vBuffer, cBuffer);
  }
  window.requestAnimFrame(render);
};

render();
