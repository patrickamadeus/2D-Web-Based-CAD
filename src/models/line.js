import { Model, Point } from "./Model.js";

export class Line extends Model {
    constructor(id) {
        super(id);
        this.shape = 'line';
        this.name = `Line_${id}`;
    }
}