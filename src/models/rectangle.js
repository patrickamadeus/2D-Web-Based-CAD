import { Model, Point } from "./Model.js";
import {
  euclideanDistance,
  rotatePoint,
  norm,
  atan3,
} from "../helpers/utility.js";

// FAN
/*
    0----------------------1
    |                      |
    |                      |
    |                      |
    |                      |
    |                      |
    3----------------------2
*/

export class Rectangle extends Model {
  constructor(id) {
    super(id);
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 0));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 1));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 2));
    this.vertices.push(new Point([0, 0], [0, 0, 0, 1], 3));
    this.shape = "rectangle";
    this.name = `Rectangle_${id}`;
  }

  copy(obj) {
    super.copy(obj);
    this.setWidth(obj.getWidth());
    this.setHeight(obj.getHeight());
    this.computeCenter();
    this.shape = "rectangle";
    this.name = obj.name;
  }

  getWidth = () => {
    return euclideanDistance(
      this.vertices[1].coordinate,
      this.vertices[0].coordinate
    );
  };

  getHeight = () => {
    return euclideanDistance(
      this.vertices[3].coordinate,
      this.vertices[0].coordinate
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

    this.vertices[2].coordinate[0] +=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[2].coordinate[1] -=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.vertices[3].coordinate[0] -=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[3].coordinate[1] +=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.computeCenter();
  };

  setHeight = (h) => {
    const diff = (h - this.getHeight()) / 2;

    this.vertices[0].coordinate[1] +=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[0].coordinate[0] +=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.vertices[1].coordinate[1] +=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[1].coordinate[0] +=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.vertices[2].coordinate[1] -=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[2].coordinate[0] -=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.vertices[3].coordinate[1] -=
      diff * Math.cos((this.rotation * Math.PI) / 180);
    this.vertices[3].coordinate[0] -=
      diff * Math.sin((this.rotation * Math.PI) / 180);

    this.computeCenter();
  };

  getCenterPoint = () => {
    return this.vertices[0].coordinate;
  };

  moveVertex = (i, coor, initial) => {
    console.log("moving vertex rectangle");
    let dp = [];
    if (i == 2) {
      dp = [0, 1, 2, 3];
    } else if (i == 1) {
      dp = [3, 0, 1, 2];
    } else if (i == 0) {
      dp = [2, 3, 0, 1];
    } else if (i == 3) {
      dp = [1, 2, 3, 0];
    }

    const c = this.center.coordinate;
    const p2 = coor;

    const baseAngle = atan3(c, initial);
    const angle = atan3(c, p2);
    const diff = baseAngle - angle;

    const dist_x = euclideanDistance(c, p2) * Math.cos(Math.abs(angle));
    const dist_y = euclideanDistance(c, p2) * Math.sin(Math.abs(angle));

    let n_p0 = [c[0] - dist_x, c[1] + dist_y];
    let n_p1 = [c[0] + dist_x, c[1] + dist_y];
    let n_p3 = [c[0] - dist_x, c[1] - dist_y];

    console.log("vertex 0", n_p0);
    console.log("vertex 1", n_p1);
    console.log("vertex 2", p2);
    console.log("vertex 3", n_p3);

    n_p0 = rotatePoint(n_p0[0], n_p0[1], c[0], c[1], diff, -1);
    n_p1 = rotatePoint(n_p1[0], n_p1[1], c[0], c[1], diff, -1);
    n_p3 = rotatePoint(n_p3[0], n_p3[1], c[0], c[1], diff, -1);

    console.log("vertex 0..", n_p0);
    console.log("vertex 1..", n_p1);
    console.log("vertex 2..", p2);
    console.log("vertex 3..", n_p3);

    this.rotation = (diff * 180) / Math.PI;

    if (this.rotation < 0) {
      this.rotation += 360;
    }
    this.vertices[dp[0]].coordinate = n_p0;
    this.vertices[dp[1]].coordinate = n_p1;
    this.vertices[dp[2]].coordinate = p2;
    this.vertices[dp[3]].coordinate = n_p3;
  };
}
