import { Model, Point } from "./Model.js";

export class Line extends Model {
    constructor(id) {
        super(id);
        this.vertices.push(new Point([0,0],[0,0,0,1],0));
        this.vertices.push(new Point([0,0],[0,0,0,1],1));
        this.shape = 'line';
        this.name = `Line_${id}`;
    }

    getWidth = () => {
        return Math.abs(this.vertices[0].coordinate[0] - this.vertices[1].coordinate[0]);
    }

    getHeight = () => {
        return Math.abs(this.vertices[0].coordinate[1] - this.vertices[1].coordinate[1]);
    }

    setWidth = (w) => {
        const diff = (w - this.getWidth()) / 2;
        const angle = this.rotation * Math.PI / 180;
    }

    setWidth = (w) => {
        const diff = (w - this.getWidth()) / 2;

        this.vertices[0].coordinate[0] -= diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[0].coordinate[1] += diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[1].coordinate[0] += diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[1].coordinate[1] -= diff * Math.sin(this.rotation * Math.PI / 180);

        this.computeCenter();
    }

    setHeight = (h) => {
        const diff = (h - this.getHeight()) / 2;

        this.vertices[0].coordinate[1] += diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[0].coordinate[0] += diff * Math.sin(this.rotation * Math.PI / 180);

        this.vertices[1].coordinate[1] += diff * Math.cos(this.rotation * Math.PI / 180);
        this.vertices[1].coordinate[0] += diff * Math.sin(this.rotation * Math.PI / 180);

        this.computeCenter();
    }
}