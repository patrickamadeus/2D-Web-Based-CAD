import { atan3 } from "../helpers/utility.js";
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
    // TODO: Configure copy constructor line
    super.copy(obj);
    // this.setWidth(obj.getWidth());
    // this.shape = 'line';
    // this.name = obj.name;
  }

  getWidth = () => {
    return Math.abs(
      this.vertices[0].coordinate[0] - this.vertices[1].coordinate[0]
    );
  };

  getHeight = () => {
    return Math.abs(
      this.vertices[0].coordinate[1] - this.vertices[1].coordinate[1]
    );
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

  setHeight = (h) => {
    const diff = (h - this.getHeight()) / 2;

    this.vertices[0].coordinate[1] -=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[0].coordinate[0] +=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.vertices[1].coordinate[1] +=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[1].coordinate[0] -=
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
  };
}
