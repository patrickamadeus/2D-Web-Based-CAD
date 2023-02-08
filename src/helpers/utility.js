const euclideanDistance = (x,y) => {
    return Math.sqrt(
        (x[0]-y[0])*(x[0]-y[0]) + (x[1]-y[1])*(x[1]-y[1])
    );
};

const norm = (deg) => {
    return ((((deg + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
};

const atan3 = (x, y) => {
    return Math.atan2(y[1] - x[1], y[0] - x[0]);
};

const dec_hex = (dec) => {
    dec = Math.min(255, dec);
    return hexcode[Math.floor(dec / 16)] + hexcode[dec % 16];
};

const hex_dec = (hex) => {
    let toReturn = 0;
    for (let i = 0; i < hex.length; i++) {
        toReturn = toReturn * 16 + deccode[hex[i]];
    }
    return toReturn;
};

function flatten(v) {
    if(v.matrix === true) {
        v = transpose(v);
    }

    let n = v.length;
    let elemsAreArrays = false;

    if (Array.isArray(v[0])) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    const floats = new Float32Array(n);

    if(elemsAreArrays) {
        let idx = 0;
        for (let i = 0; i < v.length; i++) {
            for (let j = 0; j < v[i].length; j++) {
                floats[idx++] = v[i][j];
            }
        }
    } else {
        for (let i = 0; i < v.length; i++) {
            floats[i] = v[i];
        }
    }

    return floats;
}

window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();


export { flatten, dec_hex, hex_dec, atan3, norm, euclideanDistance };