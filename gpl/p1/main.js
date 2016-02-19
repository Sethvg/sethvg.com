//*****************************************//
//Written by:   Seth Vg
//              9/6/2015
//              Templates: http://www.creativebloq.com/javascript/get-started-webgl-draw-square-7112981
//*****************************************//



var app = angular.module("app", []);

app.controller("main", ['$scope', function ($scope) {


    $scope.t1 = {};
    $scope.t1.red = 70;
    $scope.t1.blue = 174;
    $scope.t1.green = 187;

    $scope.t2 = {};
    $scope.t2.red = 114;
    $scope.t2.blue = 167;
    $scope.t2.green = 226;

    $scope.t3 = {};
    $scope.t3.red = 202;
    $scope.t3.blue = 112;
    $scope.t3.green = 56;

    $scope.t4 = {};
    $scope.t4.red = 252;
    $scope.t4.blue = 116;
    $scope.t4.green = 178;

    $scope.init = function () {
        canvas = document.getElementById("mycanvas");
        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0.5, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var v = document.getElementById("vertex").firstChild.nodeValue;
        var f = document.getElementById("fragment").firstChild.nodeValue;

        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, v);
        gl.compileShader(vs);

        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, f);
        gl.compileShader(fs);

        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
            console.log(gl.getShaderInfoLog(vs));

        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
            console.log(gl.getShaderInfoLog(fs));

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            console.log(gl.getProgramInfoLog(program));


        var aspect = canvas.width / canvas.height;

        //Left
        var T1 = new Float32Array([
            -.9, -.9,
            -.9, .9,
            -.1, 0   // Triangle 1
        ]);

        //Top
        var T3 = new Float32Array([
            -.9, -.9,
            -.1, 0,
            .10, -.28   // Triangle 1
        ]);

        //bottom
        var T2 = new Float32Array([
            -.9, .9
            , -.1, 0,
            .10, .28   // Triangle 1
        ]);

        //right
        var T4 = new Float32Array([
            -.1, 0,
            .5, 0,
            .10, .28,  // Triangle 1

            -.1, 0,
            .5, 0,
            .10, -.28   // Triangle 1
        ]);

        function draw(T, num, color) {
            vbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            gl.bufferData(gl.ARRAY_BUFFER, T, gl.STATIC_DRAW);

            itemSize = num;
            numItems = T.length / itemSize;

            gl.useProgram(program);

            program.uColor = gl.getUniformLocation(program, "uColor");
            gl.uniform4fv(program.uColor, [color.red / 255, color.green / 255, color.blue / 255, 1.0]);

            program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            gl.enableVertexAttribArray(program.aVertexPosition);
            gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);


            gl.drawArrays(gl.TRIANGLES, 0, numItems);
        }

        draw(T1, 2, $scope.t1);
        draw(T2, 2, $scope.t2);
        draw(T3, 2, $scope.t3);
        draw(T4, 2, $scope.t4);


    }
}]);

