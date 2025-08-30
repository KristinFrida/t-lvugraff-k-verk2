/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Teiknar punkt á strigann þar sem notandinn smellir
//     með músinni
//
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

// Þarf hámarksfjölda punkta til að taka frá pláss í grafíkminni
var maxNumPoints = 300;  
var index = 0;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPoints * 3, gl.DYNAMIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    canvas.addEventListener("mousedown", function(e){

        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
     
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = 2 * (x / canvas.width) - 1;
        var cy = 2 * ((canvas.height - y) / canvas.height) - 1;

        var r = 0.05;
        var angles = [90, 210, 330];
        var tri = [];
        for (var i = 0; i < angles.length; i++) {
            var a = angles[i] * Math.PI / 180.0;
            tri.push(cx + r * Math.cos(a));
            tri.push(cy + r * Math.sin(a));
        }

        var offsetBytes = 8 * index;
        gl.bufferSubData(gl.ARRAY_BUFFER, offsetBytes, new Float32Array(tri));
        index += 3;
    });

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, index );

    window.requestAnimFrame(render);
}
