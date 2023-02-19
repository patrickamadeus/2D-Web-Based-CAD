import { euclideanDistance } from "../helpers/utility.js";
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

    deleteVertex = (id) => {
        let oldVertices = this.vertices;
        let newVertices = []
    
        for (let i = 0; i < oldVertices.length; i++) {
          if (i != id) {
            newVertices.push(oldVertices[i]);
          }
        }
    
        this.vertices = newVertices;
        this.computeCenter();
    }

    newVertex = (coordinate) => {
        // get vertices with smallest distance to coordinate
        let minDistance = 10000;
        let minDistanceId = -1;
        for (let i = 0; i < this.vertices.length; i++) {
            let distance = euclideanDistance(this.vertices[i].coordinate, coordinate);
            if (distance < minDistance) {
                minDistance = distance;
                minDistanceId = i;
            }
        }

        // compate left and right neighbors
        let leftId = (minDistanceId - 1);
        if (leftId < 0) {
            leftId = this.vertices.length - 1;
        }

        let rightId = (minDistanceId + 1) % this.vertices.length;
        let leftDistance = euclideanDistance(this.vertices[leftId].coordinate, coordinate);
        let rightDistance = euclideanDistance(this.vertices[rightId].coordinate, coordinate);

        // insert vertex
        if (leftDistance < rightDistance) {
            this.vertices.splice(leftId + 1, 0, new Point(coordinate, this.vertices[minDistanceId].color, this.vertices.length));
        } else {
            this.vertices.splice(rightId, 0, new Point(coordinate, this.vertices[minDistanceId].color, this.vertices.length));
        }

        this.computeCenter();
    }
}