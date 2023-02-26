import { atan3, euclideanDistance } from "../helpers/utility.js";
import { Model, Point } from "./Model.js";

export class Line extends Model {
  constructor(id) {
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
    this.shape = "line";
    this.name = `Line_${id}`;
  }

  copy(obj) {
    super.copy(obj);
  }

  getWidth = () => {
    return euclideanDistance(this.vertices[1].coordinate, this.vertices[0].coordinate);
  };

  getHeight = () => {
    return euclideanDistance(this.vertices[1].coordinate, this.vertices[0].coordinate);
  };

  setWidth = (w) => {
    const diff = (w - this.getWidth()) / 2;

    this.vertices[0].coordinate[0] -=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[0].coordinate[1] +=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.vertices[1].coordinate[0] +=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[1].coordinate[1] -=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.computeCenter();
  };

  setVertexCoordinate = (id, x, y) => {
    this.vertices[id].coordinate = [x, y];
    let angle =
      360 -
      (atan3(this.vertices[0].coordinate, this.vertices[1].coordinate) * 180) /
        Math.PI;

    if (angle > 360) {
      angle -= 360;
    }
    this.rotation = angle;
  };

  moveVertex = (i, coor) => {
    this.vertices[i].coordinate = coor;
    let angle = -(atan3(this.vertices[0].coordinate, this.vertices[1].coordinate) / Math.PI * 180)
    if(angle < 0)
        angle += 360
    this.rotation = angle;
    this.computeCenter();
  };
}
