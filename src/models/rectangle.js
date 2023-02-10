import { Model, Point } from "./Model.js";
import { euclideanDistance,norm,atan3 } from "../helpers/utility.js";

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

    changeVertexAbsis = (id, x) => {
        this.vertices[id].coordinate[0] = x;
    }

    changeVertexOrdinate = (id, y) => {
        this.vertices[id].coordinate[1] = y;
    }

    changeVertexCoordinate = (id, x, y) => {
        this.vertices[id].coordinate = [x, y];
    }

    changeColor = (rgba) => {
        for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i].setColor(rgba);
        }
    }

    changeVertexColor = (id, r, g, b, a) => {
        this.vertices[id].setColor([r,g,b,a]);
    }

    getWidth = () => {
        return euclideanDistance(this.vertices[2].coordinate, this.vertices[0].coordinate);
    }

    getHeight = () => {
        return euclideanDistance(this.vertices[1].coordinate, this.vertices[0].coordinate);
    }

    setWidth = (w) => {
        const diff = (w - this.getWidth()) / 2;

        this.vertices[0].coordinate[0] -= diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[0].coordinate[1] += diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[1].coordinate[0] -= diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[1].coordinate[1] += diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[2].coordinate[0] += diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[2].coordinate[1] -= diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[3].coordinate[0] += diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[3].coordinate[1] -= diff * Math.sin(this.rotation * Math.PI / 180);

        this.computeCenter();
    }

    setHeight = (h) => {
        const diff = (h - this.getHeight()) / 2;

        this.vertices[0].coordinate[1] += diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[0].coordinate[0] += diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[1].coordinate[1] -= diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[1].coordinate[0] -= diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[2].coordinate[1] += diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[2].coordinate[0] += diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[3].coordinate[1] -= diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[3].coordinate[0] -= diff * Math.sin(this.rotation * Math.PI / 180);

        this.computeCenter();
    }

    getCenterPoint = () => {
        return this.vertices[0].coordinate;
    }
}