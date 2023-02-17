// create a map containing color and its hex code
const CMAP = new Map();
CMAP.set("red", [1, 0, 0, 1]);
CMAP.set("green", [0, 1, 0, 1]);
CMAP.set("blue", [0, 0, 1, 1]);
CMAP.set("yellow", [1, 1, 0, 1]);
CMAP.set("black", [0, 0, 0, 1]);

const RCMAP = new Map();
RCMAP.set([1, 0, 0, 1].toString(), "red");
RCMAP.set([0, 1, 0, 1].toString(), "green");
RCMAP.set([0, 0, 1, 1].toString(), "blue");
RCMAP.set([1, 1, 0, 1].toString(), "yellow");
RCMAP.set([0, 0, 0, 1].toString(), "black");

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

export { CMAP, RCMAP, CANVAS_HEIGHT, CANVAS_WIDTH };
