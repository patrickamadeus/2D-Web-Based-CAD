import { Model, Point } from "./Model.js";

export class Polygon extends Model {
    constructor(id) {
        super(id);
        this.shape = 'Polygon';
        this.name = `Polygon_${id}`;
    }
}