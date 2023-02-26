const euclideanDistance = (x, y) => {
  return Math.sqrt(
    (x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1])
  );
};

const rotatePoint = (oriX, oriY, cX, cY, angle, clockwise) => {
  const x =
    (oriX - cX) * Math.cos(clockwise * angle) -
    (oriY - cY) * Math.sin(clockwise * angle) +
    cX;
  const y =
    (oriX - cX) * Math.sin(clockwise * angle) +
    (oriY - cY) * Math.cos(clockwise * angle) +
    cY;
  return [x, y];
};

const norm = (deg) => {
  return (
    ((((deg + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) -
    Math.PI
  );
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
  if (v.matrix === true) {
    v = transpose(v);
  }

  let n = v.length;
  let elemsAreArrays = false;

  if (Array.isArray(v[0])) {
    elemsAreArrays = true;
    n *= v[0].length;
  }

  const floats = new Float32Array(n);

  if (elemsAreArrays) {
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


const quickSort = (points) => {
  if (points.length <= 1) {
    return points;
  } else {
    const pivot = points[0];
    const less = points
      .slice(1)
      .filter(
        (point) =>
          point.coordinate[0] < pivot.coordinate[0] || (point.coordinate[0] === pivot.coordinate[0] && point.coordinate[1] < pivot.coordinate[1])
      );
    const greater = points
      .slice(1)
      .filter(
        (point) =>
          point.coordinate[0] > pivot.coordinate[0] || (point.coordinate[0] === pivot.coordinate[0] && point.coordinate[1] >= pivot.coordinate[1])
      );
    return quickSort(less).concat([pivot], quickSort(greater));
  }
}

const distPtLine = (p1, p2, pt) => {
  const A = p2[1] - p1[1];
  const B = p1[0] - p2[0];
  const C = p1[0] * (p1[1] - p2[1]) + p1[1] * (p2[0] - p1[0]);
  return Math.abs(A * pt[0] + B * pt[1] + C) / Math.sqrt(A ** 2 + B ** 2);
};

const linearValue = (p1, p2, pt) => {
  const A = p2[1] - p1[1];
  const B = p1[0] - p2[0];
  const C = p1[0] * (p1[1] - p2[1]) + p1[1] * (p2[0] - p1[0]);
  return A * pt[0] + B * pt[1] + C;
};

const myConvexHull = (points, p1 = null, p2 = null, types = 0) => {
  if (points.length <= 1) {
    return points;
  }

  if (!types) {
    let p_min = points[0];
    let p_max = points[points.length - 1];

    let upper = [];
    let lower = [];

    for (let point of points) {
      if (linearValue(p_min.coordinate, p_max.coordinate, point.coordinate) < 0) {
        upper.push(point);
      } else if (linearValue(p_min.coordinate, p_max.coordinate, point.coordinate) > 0) {
        lower.push(point);
      }
    }

    return [p_min]
      .concat(myConvexHull(upper, p_min, p_max, 1))
      .concat([p_max])
      .concat(myConvexHull(lower, p_min, p_max, -1));
  }

  let distance = 0;
  let p_max = null;

  for (let point of points) {
    if (distPtLine(p1.coordinate, p2.coordinate, point.coordinate) > distance) {
      distance = distPtLine(p1.coordinate, p2.coordinate, point.coordinate);
      p_max = point;
    }
  }

  let left = [];
  let right = [];

  for (let point of points) {
    if (linearValue(p1.coordinate, p_max.coordinate, point.coordinate) * types < 0) {
      left.push(point);
    }
    if (linearValue(p_max.coordinate, p2.coordinate, point.coordinate) * types < 0) {
      right.push(point);
    }
  }

  if (types == 1) {
    return myConvexHull(left, p1, p_max, types)
      .concat([p_max])
      .concat(myConvexHull(right, p_max, p2, types));
  } else {
    return myConvexHull(right, p_max, p2, types)
      .concat([p_max])
      .concat(myConvexHull(left, p1, p_max, types));
  }
};

const sortClockwise = (pArr, c) => {
  let arr = [];

  for (let i = 0; i < pArr.length; i++) {
    const angle = atan3(pArr[i].coordinate, c.coordinate);
    arr.push([angle, i, pArr[i].coordinate[0], pArr[i].coordinate[1]]);
  }

  arr = arr.sort((a, b) => b[0] - a[0]);

  const n_pArr = [];
  for (let i = 0; i < arr.length; i++) {
    n_pArr.push(pArr[arr[i][1]]);
  }

  return n_pArr;
};

const dec_2_hex = (rgb) => {
  var hex =
    Number(rgb[0] * 255)
      .toString(16)
      .padStart(2, "0") +
    Number(rgb[1] * 255)
      .toString(16)
      .padStart(2, "0") +
    Number(rgb[2] * 255)
      .toString(16)
      .padStart(2, "0");
  // Return the hex code
  return "#" + hex;
};

const hex_2_dec = (hex) => {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);

  return [r / 255, g / 255, b / 255, 1];
};

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

export {
  flatten,
  dec_hex,
  hex_dec,
  atan3,
  norm,
  euclideanDistance,
  rotatePoint,
  myConvexHull,
  sortClockwise,
  quickSort,
  dec_2_hex,
  hex_2_dec,
};
