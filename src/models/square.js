import { Model, Point } from "./Model.js";
import { euclideanDistance, rotatePoint, norm, atan3 } from "../helpers/utility.js";

export class Square extends Model {
    constructor(id) {
        super(id);
        this.vertices.push(new Point([0,0], [0,0,0,1], 0));
        this.vertices.push(new Point([0,0], [0,0,0,1], 1));
        this.vertices.push(new Point([0,0], [0,0,0,1], 2));
        this.vertices.push(new Point([0,0], [0,0,0,1], 3));
        this.shape = 'square';
        this.name = `Square_${id}`;
    }

    copy(obj) {
        super.copy(obj);
        // this.setWidth(obj.getWidth());
        this.shape = 'square';
        this.name = obj.name;
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
            this.vertices[1].coordinate[0] + diff, 
            this.vertices[1].coordinate[1] + diff, 
            this.vertices[1].coordinate[0],this.vertices[1].coordinate[1],angle, -1);

        this.vertices[2].coordinate = rotatePoint(
            this.vertices[2].coordinate[0] + diff, 
            this.vertices[2].coordinate[1] - diff, 
            this.vertices[2].coordinate[0],this.vertices[2].coordinate[1],angle, -1);

        this.vertices[3].coordinate = rotatePoint(
            this.vertices[3].coordinate[0] - diff, 
            this.vertices[3].coordinate[1] - diff, 
            this.vertices[3].coordinate[0],this.vertices[3].coordinate[1],angle, -1);
    }

    moveVertex = (i,coor) => {
        let dp = [];
        if      (i == 2){ dp = [0,1,2,3] } 
        else if (i == 1){ dp = [3,0,1,2] }
        else if (i == 0){ dp = [2,3,0,1] }
        else if (i == 3){ dp = [1,2,3,0] }

        const c = this.center.coordinate
        const p2 = coor;
        
        const dist = euclideanDistance(c, p2) / Math.sqrt(2);
        const baseAngle = Math.atan(-1);
        const angle = atan3(c,p2);
        const diff = baseAngle - angle;

        let n_p0 = [c[0] - dist , c[1] + dist]
        let n_p1  = [c[0] + dist, c[1] + dist];
        let n_p3 = [c[0] - dist, c[1] - dist];

        n_p0 = rotatePoint(n_p0[0], n_p0[1], c[0] , c[1] , diff , -1)
        n_p1 = rotatePoint(n_p1[0], n_p1[1],  c[0] , c[1], diff, -1);
        n_p3 = rotatePoint(n_p3[0], n_p3[1],  c[0] , c[1], diff, -1);

        
        this.rotation = (diff * 180 / Math.PI);
        if (i == 3){
            this.rotation -= 90;
        } else if (i == 0){
            this.rotation -= 180;
        } else if (i == 1){
            this.rotation -= 270;
        }
        
        if (this.rotation < 0) {
            this.rotation += 360;
          }
        
        this.vertices[dp[0]].coordinate = n_p0;
        this.vertices[dp[1]].coordinate = n_p1;
        this.vertices[dp[2]].coordinate = p2;
        this.vertices[dp[3]].coordinate = n_p3;
    }
};
