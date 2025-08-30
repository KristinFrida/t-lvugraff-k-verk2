"use strict";

var canvas, gl;
var points = [];
var NumTimesToSubdivide = 4;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    var a = vec2(-1.0, -1.0);
    var b = vec2( 1.0, -1.0);
    var c = vec2( 1.0,  1.0);
    var d = vec2(-1.0,  1.0);

    divideSquare(a, b, c, d, NumTimesToSubdivide);

    // WebGL stillingar
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

function square(a, b, c, d) {
    points.push(a, b, c);
    points.push(a, c, d);
}
function grid4x4(a, b, c, d) {
    var cols = [];
    var ts = [0.0, 1.0/3.0, 2.0/3.0, 1.0];
    for (var i = 0; i < 4; i++) {
        var ab = mix(a, b, ts[i]);
        var dc = mix(d, c, ts[i]);
        cols.push([ab, dc]);
    }
    var G = []; 
    for (var i = 0; i < 4; i++) {
        var col = [];
        for (var j = 0; j < 4; j++) {
            col.push( mix(cols[i][0], cols[i][1], ts[j]) );
        }
        G.push(col);
    }
    return G;
}

function divideSquare(a, b, c, d, count) {
    if (count === 0) {
        square(a, b, c, d);
        return;
    }

    var G = grid4x4(a, b, c, d);
    function P(i, j) { return G[i][j]; }
    count = count - 1;

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var isCenter = (i === 1 && j === 1);
            if (isCenter) continue;

            var a2 = P(i,   j);
            var b2 = P(i+1, j);
            var c2 = P(i+1, j+1);
            var d2 = P(i,   j+1);
            divideSquare(a2, b2, c2, d2, count);
        }
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
