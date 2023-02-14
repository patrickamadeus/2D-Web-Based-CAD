import { Model, Point } from "./Model.js";
import { euclideanDistance, rotatePoint, norm, atan3 } from "../helpers/utility.js";

export class Square extends Model {
    constructor(id) {
        super(id);
        this.vertices.push(new Point([0,0], [0,0,0,1], 0));
        this.vertices.push(new Point([0,0], [0,0,0,1], 1));
        this.vertices.push(new Point([0,0], [0,0,0,1], 2));
        this.vertices.push(new Point([0,0], [0,0,0,1], 3));
        this.shape = 'square';
        this.name = `Square_${id}`;
    }

    copy(obj) {
        super.copy(obj);
        // this.setWidth(obj.getWidth());
        this.shape = 'square';
        this.name = obj.name;
    }

    getWidth = () => {
        return euclideanDistance(this.vertices[1].coordinate, this.vertices[0].coordinate);
    }

    setWidth = (w) => {
        const diff = (w - this.getWidth()) / 2;
        const angle = this.rotation * Math.PI / 180;

        this.vertices[0].coordinate = rotatePoint(
            this.vertices[0].coordinate[0] - diff, 
            this.vertices[0].coordinate[1] + diff, 
            this.vertices[0].coordinate[0],this.vertices[0].coordinate[1],angle, -1);

        this.vertices[1].coordinate = rotatePoint(
            this.vertices[1].coordinate[0] + diff, 
            this.vertices[1].coordinate[1] + diff, 
            this.vertices[1].coordinate[0],this.vertices[1].coordinate[1],angle, -1);

        this.vertices[2].coordinate = rotatePoint(
            this.vertices[2].coordinate[0] + diff, 
            this.vertices[2].coordinate[1] - diff, 
            this.vertices[2].coordinate[0],this.vertices[2].coordinate[1],angle, -1);

        this.vertices[3].coordinate = rotatePoint(
            this.vertices[3].coordinate[0] - diff, 
            this.vertices[3].coordinate[1] - diff, 
            this.vertices[3].coordinate[0],this.vertices[3].coordinate[1],angle, -1);
    }

    moveVertex = (coor) => {
      const p0 = this.vertices[0].coordinate;
      const p2 = coor;
      const dist = euclideanDistance(p0, p2) / Math.sqrt(2);
      const baseAngle = Math.atan(-1);
      const angle = atan3(p0,p2);
      const diff = baseAngle - angle;

      let p1  = [p0[0] + dist, p0[1]];
      let p3 = [p0[0], p0[1] - dist];

      p1 = rotatePoint(p1[0], p1[1], p0[0], p0[1], diff, -1);
      p3 = rotatePoint(p3[0], p3[1], p0[0], p0[1], diff, -1);

      this.rotation = diff * 180 / Math.PI;

      if (this.rotation < 0) {
        this.rotation += 360;
      }

      this.vertices[1].coordinate = p1;
      this.vertices[2].coordinate = p2;
      this.vertices[3].coordinate = p3;
    }
};
