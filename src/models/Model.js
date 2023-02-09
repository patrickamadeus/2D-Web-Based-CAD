import { flatten, dec_hex, hex_dec, atan3, norm, euclideanDistance } from '../helpers/utility.js';


export class Model {
    constructor(id) {
        this.vertices = [];
        this.name = `Model_${id}`;
        this.center = [0, 0];
        this.id = id;
    }

    render = (gl, program, vBuffer, cBuffer) => {
        const vertices = [];
        const colors = [];
    
        for (let j = 0; j < this.vertices.length; j++) {
            vertices.push(this.vertices[j].coordinate);
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