import { CMAP } from "../helpers/const.js";
import {
  flatten,
  dec_hex,
  hex_dec,
  atan3,
  norm,
  euclideanDistance,
  rotatePoint,
} from "../helpers/utility.js";

export class Model {
  constructor(id) {
    this.vertices = [];
    this.name = `Model_${id}`;
    this.center = new Point([0, 0], [0, 0, 0, 1], 0);
    this.rotation = 0;
    this.dilatation = 1;
    this.ShearAnchor = []
    this.InitMap = [];    // As shearing might messed up individual vertices, shearing required to copy raw vertices data
    this.ShearMap = [];   // Contain values of shearing strength for each vertices
    this.id = id;
    this.shape = "none";
  }

  copy(obj) {
    this.vertices = obj.vertices;
    this.name = obj.name;
    this.center = obj.center;
    this.rotation = obj.rotation;
    this.dilatation = obj.dilatation;
  }

  getVertexCoor = (id) => {
    return this.vertices[id].coordinate;
  };

  setVertexAbsis = (id, x) => {
    this.vertices[id].coordinate[0] = x;
  };

  setVertexOrdinate = (id, y) => {
    this.vertices[id].coordinate[1] = y;
  };

  setVertexCoordinate = (id, x, y) => {
    this.vertices[id].coordinate = [x, y];
  };

  setColor = (rgba) => {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].setColor(rgba);
    }
  };

  setVertexColor = (id, r, g, b, a) => {
    this.vertices[id].setColor([r, g, b, a]);
  };

  SetShearMap = () => {
    this.ShearAnchor = [this.center.coordinate[0], this.center.coordinate[1]];
    for (let i = 0; i < this.vertices.length; i++) {
      this.InitMap.push([this.vertices[i].coordinate[0], this.vertices[i].coordinate[1]]);
      this.ShearMap.push([0, 0]);
    }
  };

  computeCenter = () => {
    this.center.coordinate = [0, 0];

    for (let i = 0; i < this.vertices.length; i++) {
      this.center.coordinate[0] += this.vertices[i].coordinate[0];
      this.center.coordinate[1] += this.vertices[i].coordinate[1];
    }

    this.center.coordinate[0] /= this.vertices.length;
    this.center.coordinate[1] /= this.vertices.length;
  };

  getCenter = () => {
    return this.center.coordinate;
  };

  setTranslateX = (x) => {
    for (let j = 0; j < this.vertices.length; j++) {
      this.vertices[j].coordinate[0] += x;
    }

    this.computeCenter();
  };

  setTranslateY = (y) => {
    for (let j = 0; j < this.vertices.length; j++) {
      this.vertices[j].coordinate[1] += y;
    }

    this.computeCenter();
  };

  rotate = (angle, cw) => {
    const diffAngle = ((angle - this.rotation) * Math.PI) / 180;
    this.rotation = angle;

    for (let j = 0; j < this.vertices.length; j++) {
      const rotatedPoint = rotatePoint(
        this.vertices[j].coordinate[0],
        this.vertices[j].coordinate[1],
        this.center.coordinate[0],
        this.center.coordinate[1],
        diffAngle,
        cw
      );

      this.vertices[j].coordinate[0] = rotatedPoint[0];
      this.vertices[j].coordinate[1] = rotatedPoint[1];
    }
  };

  dilate = (mul) => {
    const nMul = mul / this.dilatation;
    this.dilatation = mul;

    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].coordinate[0] =
        nMul * (this.vertices[i].coordinate[0] - this.center.coordinate[0]) +
        this.center.coordinate[0];
      this.vertices[i].coordinate[1] =
        nMul * (this.vertices[i].coordinate[1] - this.center.coordinate[1]) +
        this.center.coordinate[1];
    }
  };

  ShearingX = (angle, strength) => {
    angle = -angle;   // Somehow Shearing X will shearing counterclockwise, therefore we need to negate it
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].coordinate[0] -= this.ShearMap[i][0] * this.dilatation * Math.cos(Math.PI / 180 * angle);
      this.vertices[i].coordinate[1] -= this.ShearMap[i][0] * this.dilatation * Math.sin(Math.PI / 180 * angle);
    }
    for (let i = 0; i < this.vertices.length; i++) {
      this.ShearMap[i][0] = strength * (this.InitMap[i][1] - this.ShearAnchor[1]);
    }
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].coordinate[0] += this.ShearMap[i][0] * this.dilatation * Math.cos(Math.PI / 180 * angle);
      this.vertices[i].coordinate[1] += this.ShearMap[i][0] * this.dilatation * Math.sin(Math.PI / 180 * angle);
    }
  };

  ShearingY = (angle, strength) => {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].coordinate[0] -= this.ShearMap[i][1] * this.dilatation * Math.sin(Math.PI / 180 * angle);
      this.vertices[i].coordinate[1] -= this.ShearMap[i][1] * this.dilatation * Math.cos(Math.PI / 180 * angle);
    }
    for (let i = 0; i < this.vertices.length; i++) {
      this.ShearMap[i][1] = strength * (this.InitMap[i][0] - this.ShearAnchor[0]);
    }
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].coordinate[0] += this.ShearMap[i][1] * this.dilatation * Math.sin(Math.PI / 180 * angle);
      this.vertices[i].coordinate[1] += this.ShearMap[i][1] * this.dilatation * Math.cos(Math.PI / 180 * angle);
    }
  };

  render = (gl, program, vBuffer, cBuffer) => {
    const vertices = [];
    const colors = [];

    for (let j = 0; j < this.vertices.length; j++) {
      vertices.push(this.vertices[j].coordinate);
      colors.push(this.vertices[j].color);
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

    if (this.shape == "line") {
      gl.drawArrays(gl.LINES, 0, vertices.length);
    } else {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);
    }
  };
}

export class Point {
  constructor(coordinate, color, id) {
    this.id = id;
    this.name = `Point_${id}`;
    this.coordinate = coordinate;
    this.color = color;
  }

  setColor = (color) => {
    this.color = color;
  };

  renderPoint = (gl, color, program, vBuffer, cBuffer) => {
    const vertices = [
      [this.coordinate[0] + 0.02, this.coordinate[1]],
      [this.coordinate[0], this.coordinate[1] + 0.02],
      [this.coordinate[0] - 0.02, this.coordinate[1]],
      [this.coordinate[0], this.coordinate[1] - 0.02],
    ];
    const colors = [color, color, color, color];

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

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length);
  };
}
