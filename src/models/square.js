import { Model, Point } from "./Model.js";
import { euclideanDistance, rotatePoint } from "../helpers/utility.js";

export class Square extends Model {
    constructor(id) {
        super(id);
        this.vertices.push(new Point(0));
        this.vertices.push(new Point(1));
        this.vertices.push(new Point(2));
        this.vertices.push(new Point(3));
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
};
