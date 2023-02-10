import { flatten, dec_hex, hex_dec, atan3, norm, euclideanDistance, rotatePoint } from '../helpers/utility.js';

export class Model {
    constructor(id) {
        this.vertices = [];
        this.name = `Model_${id}`;
        this.center = new Point([0,0],[0,0,0,1],0);
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.id = id;
    }

    computeCenter = () => {
        this.center.coordinate = [0,0];

        for (let i = 0 ; i < this.vertices.length; i++) {
            this.center.coordinate[0] += this.vertices[i].coordinate[0];
            this.center.coordinate[1] += this.vertices[i].coordinate[1];
        }

        this.center.coordinate[0] /= this.vertices.length;
        this.center.coordinate[1] /= this.vertices.length;
    }

    getCenter = () => {
        return this.center.coordinate
    }

    setRotation = (angle) => {
        this.rotation = angle;
    }

    setTranslateX = (x) => {
        for (let j = 0; j < this.vertices.length; j++) {
            this.vertices[j].coordinate[0] += x;
        }

        this.computeCenter();
    }

    setTranslateY = (y) => {
        for (let j = 0; j < this.vertices.length; j++) {
            this.vertices[j].coordinate[1] += y;
        }

        this.computeCenter();
    }

    rotate = (angle) => {
        const diffAngle = (angle - this.rotation) * Math.PI / 180;
        this.rotation = angle;

        for (let j = 0; j < this.vertices.length; j++) {
            const rotatedPoint = rotatePoint(this.vertices[j].coordinate[0],this.vertices[j].coordinate[1],this.center.coordinate[0],this.center.coordinate[1],diffAngle,-1);

            this.vertices[j].coordinate[0] = rotatedPoint[0];
            this.vertices[j].coordinate[1] = rotatedPoint[1];
        }
    }

    render = (gl, program, vBuffer, cBuffer) => {
        const vertices = [];
        const colors = [];

        for (let j = 0; j < this.vertices.length; j++) {
            vertices.push(this.vertices[j].coordinate)
            colors.push(this.vertices[j].color);
        }

        
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
        const vPosition = gl.getAttribLocation(program, 'vPosition');
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    
        const vColor = gl.getAttribLocation(program, 'vColor');
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
    
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);
    }
}

export class Point {
    constructor(coordinate, color, id){
        this.id = id;
        this.name = `Point_${id}`;
        this.coordinate = coordinate;
        this.color = color;
    }

    setColor = (color) => {
        this.color = color;
    }
}