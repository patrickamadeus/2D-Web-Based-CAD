import { Model, Point } from "./Model.js";

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
};
