//*****************************************//
//Written by:   Seth Vg
//              9/21/2015
//*****************************************//

// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 pos;\n' +
    'uniform mat4 view;\n' +
    'void main() {\n' +
    '  gl_Position =  view * pos;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +

    'uniform vec4 color;\n' +
    'void main() {\n' +
    '  gl_FragColor = color;\n' +

    '}\n';



var VSHADER_SOURCE2 =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'uniform mat4 imgView;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_Position = imgView * a_Position;\n' +
    '  v_TexCoord = a_TexCoord;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE2 =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_FragColor  = texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';



var app = angular.module("app", []);



var gl;
var shader = {};
var quad;
var floor;
var r = 0;
var wR = 0;



var lookAngle = 0;

windColor = [];
towerColor = [];



var width;
var height;

var imgProgram;

app.controller("main", ['$rootScope','$scope','$location', function ($rootScope, $scope, $location) {



    //*****************************************//
    //                  RENDER FUNCTION
    //         PARAMS:
    //              MATRIX (VIEW PERSPECTIVE XFORM)
    //              COLOR ARRAY (x6) RGB
    //              Boolean: Use Image Render
    //

    //          RETURNS: NONE
    //*****************************************//


    function render(m,c,i) {
        if(!quad) return;

       // view.setOrtho(-10,10,-10,10,2,22);
        var proj = new Matrix4().setPerspective(30,width/height,.001,100);

        var vec = getMoveVector();

        var look = new Matrix4().setLookAt($scope.eye.x, $scope.eye.y, $scope.eye.z,
            $scope.eye.x + vec[0] ,$scope.eye.y + vec[1],$scope.eye.z,
            0,0,1);
        var view = new Matrix4().set(proj).multiply(look).multiply(m);


        if(i){
            gl.useProgram(imgProgram);

            var n = initVertexBuffers();
            if (!initTextures(n)) {
                console.log('Failed to intialize the texture.');
                return;
            }

            // draw first triangle with first texture map
            gl.uniformMatrix4fv(
                shader.img, false, view.elements);
            gl.uniform1i(u_Sampler, 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, quad.n);


            gl.useProgram(program);
        }else {
            for (var a = 0; a < 6; a++) {
                gl.bufferData(gl.ARRAY_BUFFER, quad.faces[a], gl.STATIC_DRAW);
                gl.vertexAttribPointer(
                    shader.a, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(shader.a);
                gl.uniform4f(shader.color, c[a][0], c[a][1], c[a][2], 1);
                gl.uniformMatrix4fv(
                    shader.view, false, view.elements);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, quad.n);
            }
        }




    }

    $scope.eye = {};
   var buildingLocations = [];
    var buildingColors = [];

    //CREATE RANDOM BUILDINGS
    for(var a = 0; a < 6; a++){
        h = Math.random()*50;
        var b = new Matrix4();
        b.setTranslate(((Math.random()*2)-1)*5, 10+10*a, h/10);
        b.scale(Math.random()*5+1,Math.random()*5+1, h);
        buildingLocations.push(b);
    }


    //*****************************************//
    //                  ANIMATION BLOCK
    //     PARAMS: NONE RETURNS: NONE
    //    Called Continuously From Init
    //*****************************************//


    function tick() {
        if ($scope.windmill) r++;

        r%=360;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        render(floor,[[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],true);

        for (var a = 0; a < 4; a++) {
            var b = new Matrix4();
            b.setRotate(wR,0,0,1);
            b.translate(0, -.11, 1.7);
            b.rotate(a * 90 + r, 0, 1, 0);
            b.scale(.5,.1, 10);
            render(b,windColor);
        }

        for(var a = 0; a < buildingLocations.length; a++){
            render(buildingLocations[a], buildingColors)
        }

        var tower = new Matrix4();
        tower.setRotate(wR,0,0,1);
        tower.translate(0, 0, 1);
        tower.scale(3,1, 10);

        render(tower,towerColor);

        requestAnimationFrame(tick, canvas);

    }

    //Creation of Floor Cube
     floor = new Matrix4();
    floor.setScale(10000,10000,.1);
    floor.translate(0,0, -.1);


    //*****************************************//
    //                  INIT FUNCTION
    //      PARAMS: NONE,   RETURNS : NONE
    //      Called On Body Load
    //*****************************************//


    $scope.init = function () {
        //Create the contexts
        canvas = document.getElementById("mycanvas");
        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        width = canvas.width;
        height = canvas.height;


        if (!initShaders(gl, VSHADER_SOURCE2, FSHADER_SOURCE2)) {
            console.log('Failed to intialize shaders.');
            return;
        }
        imgProgram = gl.program;
        shader.img = gl.getUniformLocation(imgProgram, 'imgView');





        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Failed to intialize shaders.');
            return;
        }


        program = gl.program;



        width = canvas.width;
        height = canvas.height;

        shader.a = gl.getAttribLocation(program, 'pos');
        shader.color =  gl.getUniformLocation(program, 'color');
        shader.view = gl.getUniformLocation(program, 'view');





        gl.useProgram(program);
        gl.enable(gl.DEPTH_TEST);


        xform = new Matrix4();


        //ONE QUAD TO RENDER THEM ALL
        quad = {


            matrix: new Matrix4(),
            faces:   [

                new Float32Array([
                -.1,-.1, -.1,
                .1,-.1, -.1,
                -.1,.1, -.1,
                .1,.1, -.1
                ]),

                new Float32Array([
                .1,.1, -.1,
                .1,.1,.1,
                .1, -.1,-.1,
                .1, -.1,.1
                ]),
                new Float32Array([
                    .1,-.1, .1,
                    -.1,-.1,.1,
                    .1, .1,.1,
                    -.1, .1,.1
                ]),
                new Float32Array([
                   -.1,.1, .1,
                    -.1,.1, -.1,
                    -.1,-.1, .1,
                    -.1,-.1, -.1
                ]),

                new Float32Array([
                    -.1,-.1, -.1,
                    -.1,-.1, .1,
                    .1,-.1, -.1,
                    .1,-.1, .1
                ]),

                new Float32Array([
                    -.1,.1, -.1,
                    -.1,.1, .1,
                    .1,.1, -.1,
                    .1,.1, .1
                ])
            ],
            n: 4,
            buffer: gl.createBuffer()

        };

            windColor = [];
            towerColor = [];

        //COLOR ARRAY GEN
        for(var a = 0; a < 6; a++){
            towerColor.push([0,0,0]);
            windColor.push([Math.random(),Math.random(),Math.random()]);
            buildingColors.push([Math.random(),Math.random(),Math.random()])
        }


        gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);



        tick();


    };

    $scope.eye.x = 0;
    $scope.eye.y =-20;
    $scope.eye.z = 2;

    $scope.windmill = false;

    //*****************************************//
    //                  KEYBOARD CLICK HANDLER
    //          PARAMS:
    //              JS EVENT
    //          RETURNS: NONE
    //
    //*****************************************//


    $scope.move = function(event){
        var kc = event.keyCode;
        if(kc===37){
            if(lookAngle == 0) lookAngle =359;
            else lookAngle -= 1;
        }else if(kc === 39){
            if(lookAngle == 359) lookAngle = 0;
            else lookAngle += 1;
        }else if(kc === 38){
            var vec = getMoveVector();
            $scope.eye.x+=vec[0];
            $scope.eye.y+=vec[1];
        }else if(kc === 40){
            var vec = getMoveVector();
            $scope.eye.x-=vec[0];
            $scope.eye.y-=vec[1];
        }else if(kc === 87){
            $scope.windmill=!$scope.windmill;
        }else if(kc === 85){
            $scope.eye.z+=.2;
        }else if(kc === 68){
            $scope.eye.z-=.2;
        }else if(kc === 89){
            wR+=1;
            wR%=360;
        }

        $scope.lookAngle = lookAngle;
        var vec = getMoveVector();
        $scope.lookAt = [$scope.eye.x + vec[0] ,$scope.eye.y + vec[1],$scope.eye.z];
    }

   //*****************************************//
   //                  Normal Vector Helper
    //              Gets normal vector to view plane
    //              PARAMS: NONE, RETURNS, :[X,Y] Of Normal Vector
   //*****************************************//


    function getMoveVector(){
        var d = .2;
        return [Math.sin(lookAngle/180*Math.PI) * d, Math.cos(lookAngle/180*Math.PI) * d];
    }


    $scope.lookAngle = 0;
    $scope.lookAt = -1;



    //*****************************************//
    //               FROM Example
    //              modified to use different program variable for diff shaders
    //              draw function diff
    //              removed a bit
    //*****************************************//


    //*****************************************//
    //                  Init Vertex
    //              Params + Return : None
    //*****************************************//



    function initVertexBuffers() {
        var verticesTexCoords = new Float32Array([
            // Vertex coordinate, Texture coordinate
            -0.5,  0.5,   0.0, 1.0,
            -0.5, -0.5,   0.0, 0.0,
            0.5,  0.5,   1.0, 1.0,
            0.5, -0.5,   1.0, 0.0
        ]);
        var n = 4; // The number of vertices

        // Create a buffer object
        var vertexTexCoordBuffer = gl.createBuffer();
        if (!vertexTexCoordBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Write the positions of vertices to a vertex shader
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

        var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
        //Get the storage location of a_Position, assign and enable buffer
        var a_Position = gl.getAttribLocation(imgProgram, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
        gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

        // Get the storage location of a_TexCoord
        var a_TexCoord = gl.getAttribLocation(imgProgram, 'a_TexCoord');
        if (a_TexCoord < 0) {
            console.log('Failed to get the storage location of a_TexCoord');
            return -1;
        }
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
        gl.enableVertexAttribArray(a_TexCoord);  // Enable the buffer assignment

        return n;
    }

    var image0;
    var u_Sampler;



    //*****************************************//
    //                  Init Texture
    //          Params: N (Unused)
    //          Returns None
    //*****************************************//


    function initTextures(n) {
        // Create a texture object
        texture0 = gl.createTexture();


        if (!texture0) {
            console.log('Failed to create the texture object');
            return false;
        }

        // Get the storage location of u_Sampler0 and u_Sampler1
        u_Sampler = gl.getUniformLocation(imgProgram, 'u_Sampler');
        if (!u_Sampler) {
            console.log('Failed to get the storage location of u_Sampler');
            return false;
        }

        // Create the image object
        image0 = new Image();


        // Register the event handler to be called when image loading is completed
        image0.onload = function(){ loadTexture(gl, n, texture0, image0, 0); };

        // Tell the browser to load an Image
        image0.src = 'grass.jpg';

        return true;
    }






    //*****************************************//
    //                  Load Texture
    //          Params: GL, Unused, JS texture Obj
    //                  JS image OBJ,
    //                  Texture Unit Identifier
    //          Returns None
    //*****************************************//


    function loadTexture(gl, n, texture, image, texUnit) {

        // flip y when unpacking
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        // make texture unit active
        if (texUnit == 0) {
            gl.activeTexture(gl.TEXTURE0);
        }

        // bind to target
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // upload image to GPU
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


    }






}]);





