import { Model, Point } from "./Model.js";

export class Polygon extends Model {
    constructor(id) {
        super(id);
        this.shape = 'Polygon';
        this.name = `Polygon_${id}`;
    }

    addVertex = (x, y, rgba) => {
        this.vertices.push(new Point([x, y], rgba, this.vertices.length));
    }

    setVertexCoordinate = (id, x, y) => {
        this.vertices[id].coordinate = [x, y];
    }
    
    getCountVertex = () => {
        return this.vertices.length;
    }

    moveVertex = (id, coordinate) => {
        this.vertices[id].coordinate = coordinate;
    }
}