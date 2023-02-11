// create a map containing color and its hex code
const CMAP = new Map();
CMAP.set("red", [255,0,0,1]);
CMAP.set("green",[0,255,0,1]);
CMAP.set("blue", [0,0,255,1]);
CMAP.set("yellow", [255,255,0,1]);
CMAP.set("black", [0,0,0,1]);

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 700;

export { CMAP, CANVAS_HEIGHT, CANVAS_WIDTH };
