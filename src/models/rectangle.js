import { Model, Point } from "./Model.js";
import { euclideanDistance } from "../helpers/utility.js";

export class Rectangle extends Model {
    constructor(id) {
        super(id);
        this.vertices.push(new Point([0,0],[0,0,0,1],0));
        this.vertices.push(new Point([0,0],[0,0,0,1],1));
        this.vertices.push(new Point([0,0],[0,0,0,1],2));
        this.vertices.push(new Point([0,0],[0,0,0,1],3));
        this.shape = 'rectangle';
        this.name = `Rectangle_${id}`;
    }

    modifyVertexAbsis = (id, x) => {
        this.vertices[id].coordinate[0] = x;
    }

    modifyVertexOrdinate = (id, y) => {
        this.vertices[id].coordinate[1] = y;
    }

    modifyVertexCoordinate = (id, x, y) => {
        this.vertices[id].coordinate = [x, y];
    }

    modifyColor = (rgba) => {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].setColor(rgba);
        }
    }

    modifyVertexColor = (id, r, g, b, a) => {
        this.vertices[id].setColor([r,g,b,a]);
    }

    getWidth = () => {
        return euclideanDistance(this.vertices[1].coordinate, this.vertices[0].coordinate);
    }

    getHeight = () => {
        return euclideanDistance(this.vertices[2].coordinate, this.vertices[1].coordinate);
    }
}