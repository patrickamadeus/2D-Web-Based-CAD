import { Model, Point } from "./Model.js";
import { euclideanDistance, rotatePoint, norm, atan3 } from "../helpers/utility.js";

export class Square extends Model {
    constructor(id) {
        super(id);
        this.vertices.push(new Point([0.1, 0], [0, 0, 0, 1], 0));
        this.vertices.push(new Point([0, 0.1], [0, 0, 0, 1], 1));
        this.vertices.push(new Point([-0.1, 0], [0, 0, 0, 1], 2));
        this.vertices.push(new Point([0, -0.1], [0, 0, 0, 1], 3));
        this.shape = 'square';
        this.name = `Square_${id}`;
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
            this.vertices[1].coordinate[0] - diff, 
            this.vertices[1].coordinate[1] - diff, 
            this.vertices[1].coordinate[0],this.vertices[1].coordinate[1],angle, -1);

        this.vertices[2].coordinate = rotatePoint(
            this.vertices[2].coordinate[0] + diff, 
            this.vertices[2].coordinate[1] + diff, 
            this.vertices[2].coordinate[0],this.vertices[2].coordinate[1],angle, -1);

        this.vertices[3].coordinate = rotatePoint(
            this.vertices[3].coordinate[0] + diff, 
            this.vertices[3].coordinate[1] - diff, 
            this.vertices[3].coordinate[0],this.vertices[3].coordinate[1],angle, -1);
    }

    moveVertex = (id, coordinate) => {
        let dist = 10000000;
        for (let i = 0; i < this.vertices.length; i++) {
          dist = Math.min(euclideanDistance(this.center.coordinate, this.vertices[i].coordinate), dist);
        }
    
        const mul =
          euclideanDistance(this.center.coordinate, coordinate) /
          euclideanDistance(this.center.coordinate, this.vertices[id].coordinate);
        const deg = norm(
          atan3(this.center.coordinate, coordinate) - atan3(this.center.coordinate, this.vertices[id].coordinate)
        );
    
        if (dist * mul < 0.01) {
          return;
        }
    
        this.initRotate(deg);
        this.dilate(mul);
    }

    initRotate = (deg) => {
      for (let i = 0; i < this.vertices.length; i++) {
        const dis = euclideanDistance(this.center.coordinate, this.vertices[i].coordinate);
        const arg = norm(atan3(this.center.coordinate, this.vertices[i].coordinate) + deg);
        this.vertices[i].coordinate[0] = this.center.coordinate[0] + Math.cos(arg) * dis;
        this.vertices[i].coordinate[1] = this.center.coordinate[1] + Math.sin(arg) * dis;
      }
    }
};
