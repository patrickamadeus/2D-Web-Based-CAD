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
    this.setWidth(euclideanDistance(
      this.vertices[1].coordinate,
      this.vertices[0].coordinate
    ));
    this.setHeight(euclideanDistance(
      this.vertices[3].coordinate,
      this.vertices[0].coordinate
    ));
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

  moveVertex = (i, coor) => {
    let dp = [];
    if      (i == 2){ dp = [0,1,2,3] } 
    else if (i == 1){ dp = [3,0,1,2] }
    else if (i == 0){ dp = [2,3,0,1] }
    else if (i == 3){ dp = [1,2,3,0] }

    const c = this.center.coordinate;
    const p2 = coor;
    
    let bigAngle = atan3(c, this.vertices[dp[2]].coordinate);
    let smallAngle = atan3(c, this.vertices[dp[1]].coordinate);
    let angle = atan3(c, p2);

    if (bigAngle > 0 && smallAngle < 0) {
      bigAngle -= 360 / 180 * Math.PI;
      angle -= 360 / 180 * Math.PI;
    }

    const baseAngle = (bigAngle - smallAngle) / 2;
    const diff = baseAngle - angle;

    const dist = euclideanDistance(c, p2);
    const deltaX = dist * Math.cos(Math.abs(baseAngle));
    const deltaY = dist * Math.sin(Math.abs(baseAngle));
    
    let n_p0 = [c[0] - deltaX, c[1] + deltaY];
    let n_p1 = [c[0] + deltaX, c[1] + deltaY];
    let n_p3 = [c[0] - deltaX, c[1] - deltaY];

    n_p0 = rotatePoint(n_p0[0], n_p0[1], c[0], c[1], diff, -1);
    n_p1 = rotatePoint(n_p1[0], n_p1[1], c[0], c[1], diff, -1);
    n_p3 = rotatePoint(n_p3[0], n_p3[1], c[0], c[1], diff, -1);

    this.rotation = (diff * 180) / Math.PI;
    if (i == 3){
      this.rotation -= 90;
    } else if (i == 0){
        this.rotation -= 180;
    } else if (i == 1){
        this.rotation -= 270;
    }

    if (this.rotation < 0) {
      this.rotation += 360;
    }

    this.vertices[dp[0]].coordinate = n_p0;
    this.vertices[dp[1]].coordinate = n_p1;
    this.vertices[dp[2]].coordinate = p2;
    this.vertices[dp[3]].coordinate = n_p3;
  }
}
