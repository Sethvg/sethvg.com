//*****************************************//
//Written by:   Seth Vg
//              9/21/2015
//*****************************************//

// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 pos;\n' +
    'uniform mat4 xform;\n' +
    'void main() {\n' +
    '  gl_Position = xform * pos;\n' +
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
    'uniform mat4 xform;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_Position = xform * a_Position;\n' +
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


//*****************************************//
//       Cordinate Conversion
//
//          Param:
//              val (0 - 100)
//
//          Returns -1 - 1
//*****************************************//

function loc(x){
    var percentage = x/100;
    return 2 * percentage - 1;
}

function locR(x){
    x += 1;
    x = x/2;
    return x*100;
}




//*****************************************//
//        Helper - Get Random Integer
//
//          Param:
//              Min Int
//              Max Int
//*****************************************//
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.controller("main", ['$rootScope','$scope','$location', function ($rootScope, $scope,$location) {


    //Starship Enterprise
    var ship;

    //Initalize Game Variablers
    $scope.shots = 50;
    $scope.score = 0;

    //Param level handler
    var iLvl = $location.search().lvl;
    if (iLvl) $scope.level = iLvl;
    else $scope.level = 0;

    //game state
    var over = false;

    // anglar scoping front end helper
    $scope.addScore = function (score) {
        $scope.score += score;
    };

    //Angular front end helper
    $scope.getELength = function () {
        return enemies.length;
    };

    //*****************************************//
    //        Handles Left Right Arrow Ship movement
    //
    //          Param:
    //              Javascript Event
    //
    //  Called from HTML
    //*****************************************//
    $scope.keyP = function (event) {

        if (event.keyCode == 37) {
            if (ship.move.dir == "Right")
                ship.move.dir = "None";
            else
                ship.move.dir = "Left";
        } else if (event.keyCode == 39) {
            if (ship.move.dir == "Left")
                ship.move.dir = "None";
            else
                ship.move.dir = "Right";
        }

    };

    var moveStep = .01;

    //*****************************************//
    //        Handles Ship Movement on animation
    //*****************************************//
    function moveShip() {


        if (ship.move.dir == "Left") {

            if (ship.vertices[5] - moveStep <= -1) {
                ship.move.dir = "None";
                return;
            }


            ship.vertices[0] -= moveStep;
            ship.vertices[5] -= moveStep;
            ship.vertices[10] -= moveStep;

            ship.point.x -= moveStep;

        } else if (ship.move.dir == "Right") {

            if (ship.vertices[10] + moveStep >= 1) {
                ship.move.dir = "None";
                return;
            }

            ship.point.x += moveStep;
            ship.vertices[0] += moveStep;
            ship.vertices[5] += moveStep;
            ship.vertices[10] += moveStep;

        }

    }


    var ticks = 0;

    //Speed of triangle shots
    var speed = 1;


    //*****************************************//
    //        Animation Block
    //*****************************************//




    function tick() {
        //gl.clear(gl.COLOR_BUFFER_BIT);






        ticks++;

        var tbr = [];




        initRectange(bg);
        render(bg);
        drawBG();


        initTriangle(ship);
        render(ship);

        for (var a = 0; a < blocks.length; a++) {
            var b = blocks[a];
            initRectange(b);
            render(b);
        }

        for (var a = 0; a < enemies.length; a++) {
            var r = enemies[a];
            r = enemyMove(r);
            doesEnemyShoot(r);
            r = initRectange(r);
            render(r);
            drawEnemy(r.hits, r.matrix);
        }

        for (var a = 0; a < triangles.length; a++) {
            var t = triangles[a];
            var xdir = t.direction.x;
            var ydir = t.direction.y;
            var rad = Math.sqrt(xdir * xdir + ydir * ydir);
            xdir = xdir / rad;
            ydir = ydir / rad;
            xInit = t.init.x;
            yInit = t.init.y;
            var curTicks = ticks - t.tickCount * speed;
            var xTrans = curTicks * xdir / 200;
            var yTrans = curTicks * ydir / 200;
            t.cur.x = xTrans + xInit;
            t.cur.y = yTrans + yInit;
            t.matrix.setTranslate(xTrans, yTrans, 0);
            t.matrix.translate(xInit, 0, 0);
            t.matrix.rotate(curTicks, 0, 1, 0);
            t.matrix.translate(-xInit, 0, 0);

            if (t.cur.x > 1 || t.cur.x < -1 || t.cur.y > 1 || t.cur.y < -1 || checkBlock(t, xdir, ydir) || checkHit(t)) {

                tbr.unshift(a);

            } else {
                t = initTriangle(t);
                render(t);
            }

        }

        for (var a = 0; a < tbr.length; a++) {
            triangles.splice(tbr[a], 1);
        }


        moveShip();


        var shotsToRemove = [];
        for (var a = 0; a < enemyShots.length; a++) {
            var curShot = enemyShots[a];
            if (handleCurShots(curShot)) {
                shotsToRemove.unshift(a);
            }
        }

        for (var a = 0; a < shotsToRemove.length; a++) {
            enemyShots.splice(shotsToRemove[a], 1);
        }

        for (var a = 0; a < enemyShots.length; a++) {
            var curShot = enemyShots[a];
            initRectange(curShot);
            render(curShot);
        }

        if ($scope.shots == 0 && triangles.length == 0 && $scope.level != 13) {
            endGame();
        } else if (enemies.length == 0 && $scope.level != 13) {
            triangles = [];
            handleLevel();
            if (!$scope.$$phase) $scope.$apply();
        }










        if (!over) requestAnimationFrame(tick, canvas);
    }

    $scope.msg = '';

    //*****************************************//
    //        Handles End of Game win / lose
    //*****************************************//
    function endGame() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (enemies.length == 0) $scope.msg = "YOU WIN!!!";
        else {
            $scope.msg = "You Lose, try again.";

        }

        over = true;

        if (!$scope.$$phase) $scope.$apply();

    }


    //*****************************************//
    //  Checks if Triangle hits Rectangle Object
    //
    //          Param:
    //             Triangle Object
    //*****************************************//

    function checkHit(t) {
        var hit = false;
        var x = t.cur.x;
        var y = t.cur.y;
        for (var a = 0; a < enemies.length; a++) {
            var rect = enemies[a];
            if (x > rect.cur.x && x < (rect.cur.x + rect.cur.xoffset) && y > rect.cur.y && y < (rect.cur.y + rect.cur.yoffset)) {
                hit = true;
                if (rect.hits == 1) {
                    $scope.addScore(rect.score);
                    enemies.splice(a, 1);
                } else {
                    rect.hits--;
                    convertHitsIntoType(rect);
                }
            }
        }


        if (!$scope.$$phase) $scope.$apply();
        return hit;
    }

    //Variable to pad block with for blocking
    var blockPadding = .005;


    //*****************************************//
    //        Checks Triangle Blocked by Block Object
    //
    //          Param:
    //              Triangle
    //*****************************************//





    function checkBlock(t) {
        var x = t.cur.x;
        var y = t.cur.y;


        for (var a = 0; a < blocks.length; a++) {
            var b = blocks[a];
            var left = b.vertices[0];
            var right = b.vertices[2];
            var top = b.vertices[1];
            var bot = b.vertices[3];




            if (top < bot) {
                var temp = top;
                top = bot;
                bot = temp;
            }

            bot -= blockPadding;
            top += blockPadding;


            if (left > right) {
                var temp = left;
                left = right;
                right = temp;
            }

            left -= blockPadding;
            right += blockPadding;
            if (y <= top + blockPadding && y >= bot && x >= left && x <= right) {
                return true;
            }
        }


    }







    //*****************************************//
    //        Creates SHOT triange Object
    //
    //          Param:
    //              X Movement Direction
    //              Y Movement Direction
    //*****************************************//

    function createTriangle(x,y){
        var triangle = {
            type : SHAPE_TYPES.TRIANGLE,
            vertices:   new Float32Array([
                    ship.point.x +.02,ship.point.y,    1, 0, 0,
                    ship.point.x -.02,ship.point.y,    0, 1, 0,
                    ship.point.x,ship.point.y - .02,    0, 0, 1
            ]),
            n: 3,
            matrix: new Matrix4() ,
            buffer: gl.createBuffer(),
            direction:{x:x,y:y},
            color:[Math.random(), Math.random(), Math.random()],
            tickCount : ticks,
            init:{x:ship.point.x,y:ship.point.y - .02},
            cur:{x:0,y:0}

        };

        triangle = initTriangle(triangle);
        triangles.push(triangle);
    }

    var blocks = [];

    //*****************************************//
    //        Creates Block Line Object
    //
    //          Param:
    //              X Left
    //              Y Left
    //              X Right
    //              Y Right
    //*****************************************//

    function createBlock(x,y,x2,y2) {
        var l = {
            type: SHAPE_TYPES.LINE,
            matrix: new Matrix4(),
            vertices: new Float32Array([
                loc(x), loc(y),
                loc(x2), loc(y2)
            ]),
            n: 2,
            buffer: gl.createBuffer(),
            color: [0,0,0],
            drawType: gl.LINES
        };

        blocks.push(l);
    }

    //*****************************************//
    //        Creates Enemy Object
    //
    //          Param:
    //              X Left
    //              Y Bot
    //              Direction String
    //              Score Value
    //              GL Shape Type
    //              LEFT BOUND - 0 - 100
    //              RIGHT BOUND - 0 - 100
    //*****************************************//



    function convertHitsIntoType(shape){
            shape.drawType = gl.TRIANGLE_STRIP;
    }


    function createEnemy(x,y,dir,speed,score,boundLeft,boundRight,hits,shootVert,shootInterval){
        if(!shootInterval) shootInterval = 500;
        if(!shootVert) shootVert = false;
        if(!hits || hits >= 5) hits = 4;
        if(!x) x = 0;
        if(!y) y = 0;
        if(!dir) dir = "None";
        if(!speed) speed = 1;
        if(!score) score = hits;
        if(!boundLeft) boundLeft = 0;
        if(!boundRight) boundRight = 100;
        if(boundRight-boundLeft < 15){
            boundLeft = 0;
            boundRight = 100;
        }
        var quad = {
            type : SHAPE_TYPES.RECTANGLE,
            hits:hits,
            matrix: new Matrix4() ,
            vertices:   new Float32Array([
                loc(x),loc(y+2),
                loc(x),  loc(y),
                loc(x+10), loc(y+2),
                loc(x+10), loc(y)
            ]),
            n: 4,
            cur:{x:loc(x),y:loc(y),xoffset:loc(x+10)-loc(x),yoffset:loc(y+2)-loc(y)},
            direction:dir,
            buffer: gl.createBuffer(),
            color:[Math.random(), Math.random(), Math.random()],
            speed:speed,
            score:score,
            init:{x:loc(x),y:loc(y),xoffset:loc(x+10)-loc(x),yoffset:loc(y+2)-loc(y)},
            bound:{left:loc(boundLeft),right:loc(boundRight)},
            shoot:shootVert,
            shootInterval: shootInterval,
            shootCounter : shootInterval

        };

        if(quad.color[0] + quad.color[1] + quad.color[2] < 1){
            quad.color[getRandomInt(0,2)]=1 ;
        }

        convertHitsIntoType(quad);
        enemies.push(quad);
    }

    //*****************************************//
    //         Handles Movement of Blocks
    //
    //          Param:
    //              Shape Object - Rectangle
    //*****************************************//


    function enemyMove(r){

        if(r.direction == "None") return r;
        var speed = r.speed;
        var dist = speed/1000;
        var xLeft = r.cur.x;
        var xRight = r.cur.x + r.cur.xoffset;
        
        function dir(d){
            if(d != "None" && d != "Right" && d != "Left"){
                console.log("Invalid Direction " + d);
                d = "None";
            }
            r.direction = d;
        }





        if(r.direction == "Left"){

            if(xLeft - dist < r.bound.left){
                dir("Right");
                r = enemyMove(r);
            }else{
                xLeft -= dist;
                r.cur.x = xLeft;
                r.matrix.setTranslate(xLeft- r.init.x,0,0);
            }

        }else if(r.direction == "Right"){

            if(dist + xRight > r.bound.right){
                dir("Left");
                r = enemyMove(r);
            }else{
                xLeft += dist;
                r.cur.x = xLeft;
                r.matrix.setTranslate(xLeft- r.init.x,0,0);
            }

        }

            return r;
    }

    //Shape Type enum

    var SHAPE_TYPES = {};
    SHAPE_TYPES.TRIANGLE = "T";
    SHAPE_TYPES.RECTANGLE = "R";
    SHAPE_TYPES.SHIP = "S";
    SHAPE_TYPES.LINE = "L";

    //Global Variables
    var canvas;
    var triangles = [];
    var enemies = [];
    var height;
    var width;
    var gl;

    var shader = {};


    //*****************************************//
    //         Renders Object to Screen TRIANGLE
    //
    //          Param:
    //              Shape Object - Triangle
    //*****************************************//


    function initTriangle(shape){
        if(!shape) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW);

        var FSIZE = shape.vertices.BYTES_PER_ELEMENT;

        gl.vertexAttribPointer(
            shader.a, 2, gl.FLOAT, false, FSIZE*5, 0);
        gl.enableVertexAttribArray(shader.a);
        return shape;
    }

    //*****************************************//
    //         Initalizes Shape Object RECTANGLE
    //
    //          Param:
    //              Shape Object - Rectangle
    //*****************************************//

    function initRectange(shape){
        if(!shape) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW);


        gl.vertexAttribPointer(
            shader.a, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shader.a);
        return shape;
    }

    //*****************************************//
    //         Renders Object to Screen
    //
    //          Param:
    //              Shape Object
    //*****************************************//

    function render(shape) {
        if(!shape) return;

        if(shape.type == SHAPE_TYPES.TRIANGLE || shape.type == SHAPE_TYPES.SHIP){

            gl.uniform4f(shader.color, shape.color[0], shape.color[1], shape.color[2], 1);
            gl.uniformMatrix4fv(
                shader.x, false, shape.matrix.elements);
            gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.n);


        }else if(shape.type == SHAPE_TYPES.RECTANGLE || shape.type==SHAPE_TYPES.LINE){
            gl.uniform4f(shader.color, shape.color[0], shape.color[1], shape.color[2], 1);
            gl.uniformMatrix4fv(
                shader.x, false, shape.matrix.elements);
            gl.bindBuffer(gl.ARRAY_BUFFER, shape.buffer);
            gl.drawArrays(shape.drawType, 0, shape.n);
        }


    }


        //*****************************************//
        //      HANDLES THE ENENY CREATION PER LEVEL
        //*****************************************//
    function handleLevel(){

        $scope.level++;

        if($scope.level >= 8) $scope.shots = 10000;
        blocks = [];
        enemyShots = [];
        if($scope.level == 1){
            createEnemy(45,10,null,null,null,null,null,2);
            createBlock(35,50,65,50);
        }else if($scope.level == 2){
            createBlock(10,52.5,70,52.5);
            createBlock(10,52.5,10,0);
            createEnemy(30,50,"Right",1,2,null,10,100);
            createEnemy(0,0);
        }else if($scope.level == 3){
            createEnemy(Math.random()*90,50,"Right",1,2);
            createEnemy(Math.random()*90,40,"Left",1,2);
            createEnemy(Math.random()*90,30,"Right",1,2);
            createEnemy(Math.random()*90,20,"Left",1,2);
        }else if($scope.level == 4){
            for(var a = 0; a < 10; a++){
                createEnemy(a*10,20);
            }

            createEnemy(45,10,"Left",3,10,20,80);
            createEnemy(45,10,"Right",3,10,20,80);

        }else if($scope.level == 5){

            createBlock(0,50,45,50);
            createBlock(55,50,100,50);
            createBlock(45,30,55,30);
            createEnemy(40,20,"Left",3,10);
            createEnemy(50,10,"Right",3,10);

        }else if($scope.level == 6){

            createBlock(0,10,60,10);
            createBlock(65,10,100,10);
            for(var a = 0; a < 5; a++){
                createEnemy(0,5-a,"Right",a+1,15);
            }

        }else if($scope.level == 7){

            for(var a = 0; a < 7; a++){
                createBlock(a * 10, a * 10 + 5, a * 10 + 10, a * 10 + 5);
                createEnemy(a * 10, a * 10, "Right", 5,20, a * 10, a * 10 + 20);
            }

        }else if($scope.level == 8){
            createEnemy(45,10,"None",null,2,null,null,3,false,null);
            createEnemy(29,10,"Left",4,2,19,39,4,true,50);
            createEnemy(61,10,"Right",4,2,61,81,4,true,50);

            createBlock(40,80,60,80);

        }else if($scope.level == 9){
            for(var a = 0; a < 5; a++){
                createEnemy(0,5-a,"Right",a+1,15,null,null,1,true,200+a*20);
            }
        }else if($scope.level == 10){
            createBlock(10,20,20,20);
            createBlock(30,30,40,30);
            createBlock(60,30,70,30);
            createBlock(80,20,90,20);



            for(var a = 0; a < 20; a++){
                createEnemy(Math.random()*90,Math.random()*15,(Math.random() >.5 ? "Left" : "Right"),Math.random() * 7, 7, null, null, 4, true, Math.floor(Math.random() * 400 + 50));
            }
        }else if($scope.level == 11){
            for(var a = 0; a < 3; a++){
                createEnemy(a + 5,10, "Right",1,1,null,null,1,true,10);
            }
            for(var a = 0; a < 3; a++){
                createEnemy(a + 5,10, "Right",2,1,null,null,1,true,10);
            }
            for(var a = 0; a < 3; a++){
                createEnemy(a + 5,10, "Right",3,1,null,null,1,true,10);
            }

            for(var a = 0; a < 15; a++){
                createEnemy(a * 5,0, null,null,1,null,null,4,true,10);
            }

        }else if($scope.level == 12){
            createBlock(0,5,40,5);
            createBlock(60,5,100,5);
            createBlock(60,5,60,70);
            createBlock(40,5,40,70);
            for(var a = 0; a < 7; a++){
                createEnemy(a + 5,0, "Right",Math.random()*10 + 4,1,null,null,1,true,20);
            }
        }
        else if($scope.level==13){
            message();
        }else{
            endGame();
        }


    }



    //*****************************************//
    // HANDLES THE CREATION OF THE SHOTS
    //
    // Params: JS EVENT Function
    // Called from HTML
    //*****************************************//


    enemyShots = [];

    function createEnemyShot(x,y){
        var shotHeight = 2;
        var l = {
            height:shotHeight,
            type: SHAPE_TYPES.LINE,
            matrix: new Matrix4(),
            vertices: new Float32Array([
                loc(x), loc(y),
                loc(x), loc(y+shotHeight)
            ]),
            n: 2,
            buffer: gl.createBuffer(),
            color: [1,0,0],
            drawType: gl.LINES,
            cur:{x:loc(x), yTop:loc(y+shotHeight), yBot:loc(y)},
            init:{x:loc(x),y:loc(y)}
        };

        enemyShots.push(l);
    }

    //*****************************************//
    //        Mouse Click
    //          PARAMS JS event
    //          RETURNS NONE
    //*****************************************//

    $scope.click = function(event){
        if($scope.shots == 0) return;
        var x = loc(event.offsetX/width * 100);
        x = x - ship.point.x;
        var y = loc(((height - event.offsetY)/height) * 100);
        y = y - ship.point.y;
        createTriangle(x,y);

        $scope.shots--;
    };


    var shotSpeed = loc(50.25);


    //*****************************************//
    //        MISSLE TRANSFORM
    //          PARAMS Line Object
    //          RETURNS Boolean
    //*****************************************//
    function handleCurShots(line){


            var dist = line.cur.yBot - line.init.y + shotSpeed;
            line.cur.yTop = line.init.y + dist+loc(50+line.height);
            line.cur.yBot = line.init.y + dist;

        if(didShotHitShip(line)) endGame();


            for(var a = 0; a < blocks.length; a++){
                var b = blocks[a];


                var top = b.vertices[1];
                var bot = b.vertices[3];

                if(top < bot){
                    var temp = top;
                    top = bot;
                    bot = temp;
                }

                bot -= blockPadding;
                top += blockPadding;


                var left = b.vertices[0];
                var right = b.vertices[2];

                if(left > right){
                    var temp = left;
                    left = right;
                    right = temp;
                }

                left-=blockPadding;
                right+=blockPadding;
                if(line.cur.yTop <= top + blockPadding && line.cur.yTop >= bot &&  line.cur.x >=  left && line.cur.x <= right){
                    return true;
                }
            }





            if(line.cur.yBot > 1){
                return true;
            }else {
                line.matrix.setTranslate(0, dist, 0);
            }

        return false;
    }

    //*****************************************//
    //        COLLISSION DETECTION
    //          PARAMS POINT XY
    //          RETURNS BOOLEAN
    //*****************************************//

    function didShotHitShip(l){
        return isPointInShip(l.cur.x, l.cur.yTop) || isPointInShip(l.cur.x, l.cur.yBot);
    }


    //*****************************************//
    //        COLLISSION DETECTION
    //          PARAMS POINT XY
    //          RETURNS BOOLEAN
    //*****************************************//

    function isPointInShip(x,y){

        var x1 = ship.vertices[0];
        var y1 = ship.vertices[1];

        var x2 = ship.vertices[5];
        var y2 = ship.vertices[6];

        var x3 = ship.vertices[10];
        var y3 = ship.vertices[11];


        if(y < Math.min(y1,y2,y3)) return false;


        return is_in_triangle(x,y,x1,y1,x2,y2,x3,y3);

    }

    //*****************************************//
    //        COLLISISON DETETCTION
    //          PARAMS:POINT x,y
    //              TRIANGLE VERTICES x 3 (x,y)
    //          returns boolean
    //*****************************************//
    function is_in_triangle (px,py,ax,ay,bx,by,cx,cy){

//credit: http://www.blackpawn.com/texts/pointinpoly/default.html

        var v0 = [cx-ax,cy-ay];
        var v1 = [bx-ax,by-ay];
        var v2 = [px-ax,py-ay];

        var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
        var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
        var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
        var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
        var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

        var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return ((u >= 0) && (v >= 0) && (u + v < 1));
    }





    function doesEnemyShoot(r){

        if(r.shoot){
            r.shootCounter--;

            if(r.shootCounter == 0){
                createEnemyShot(locR(r.cur.x),locR(r.cur.y+ r.cur.yoffset));
                createEnemyShot(locR(r.cur.x+ r.cur.xoffset),locR(r.cur.y+ r.cur.yoffset));
                r.shootCounter = r.shootInterval;

            }
        }

    }


    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //*****************************************//


    function message(){
        createBlock(0,80,100,80);

        d(0,100,8,l1);

    }

    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //          Patrams: xLeft, xRight, time, functionPTR next
    //*****************************************//

    function d(x,x1,d,next){
        for(var a = 0; a < d; a++){
            setTimeout(function(){
                createLine(x,x1);
            },a * 100);
        }

        if(next)setTimeout(next,d * 100);
    }

    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //         XLEFT XRIGHT
    //*****************************************//

    function createLine(x,x1){
        x = x/100 * 40;
        x1 = x1/100 * 40;
        for(var a = x; a <= x1; a++){
            createEnemyShot(a * 2.5, 0);
        }
    }




    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //*****************************************//




    function l1(){
        d(0,10,6);
        d(40,50,6);

        d(50,60,6);
        d(70,80,6);
        d(90,100,6,l2);
    }

    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //*****************************************//

    function l2(){
        d(0,20,2);
        d(30,50,2);

        d(50,60,2);
        d(90,100,2,l3);
    }

    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //*****************************************//

    function l3(){
        d(0,20,2);
        d(30,50,2);

        d(50,60,2);
        d(90,100,2,l4);
    }

    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //*****************************************//

    function l4(){
        d(0,20,13);
        d(30,50,13);
        d(50,70,13);
        d(80,100,13,l5)
    }

    //*****************************************//
    //        DRAW HELPERS FOR LEVEL 12
    //*****************************************//

    function l5(){
        d(0,100,8);
        setTimeout(handleLevel,10000);
    }





    var program2;






    //*****************************************//
    //  Initilize all Variables
    //      Called after everything loads.
    //      No Params
    //*****************************************//



    $scope.init = function () {
        //Create the contexts
        canvas = document.getElementById("mycanvas");
        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);




        program2 = createProgram(gl,VSHADER_SOURCE2,FSHADER_SOURCE2);

        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Failed to intialize shaders.');
            return;
        }


        program = gl.program;



        width = canvas.width;
        height = canvas.height;

        shader.a = gl.getAttribLocation(program, 'pos');
        shader.color =  gl.getUniformLocation(program, 'color');
        shader.x = gl.getUniformLocation(program, 'xform');
        imgMatrix = gl.getUniformLocation(program2, 'xform');


        ship =  {
            type : SHAPE_TYPES.SHIP,
            vertices:   new Float32Array([
                loc(50),loc(94),    1, 0, 0,
                loc(45),loc(99),    0, 1, 0,
                loc(55),loc(99),    0, 0, 1
            ]),
            n: 3,
            matrix: new Matrix4() ,
            buffer: gl.createBuffer(),
            color:[Math.random(), Math.random(), Math.random()],
            point:{x:loc(50),y:loc(94)},
            move:{dir:"None"}

        };

        bg =  {
            type: SHAPE_TYPES.RECTANGLE,
            matrix: new Matrix4(),
            vertices: new Float32Array([
                -1,1,
                -1, -1,
                1,1,
                1, -1
            ]),
            n: 4,
            color:[Math.random(), Math.random(), Math.random()],
            buffer: gl.createBuffer()

        };





        gl.useProgram(program2);
        var n = initVertexBuffers();
        if (!initTextures(n)) {
            console.log('Failed to intialize the texture.');
            return;
        }
        gl.useProgram(program);

        handleLevel();

        tick();


    };

    var bg;
    var imgMatrix;


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
        var a_Position = gl.getAttribLocation(program2, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
        gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

        // Get the storage location of a_TexCoord
        var a_TexCoord = gl.getAttribLocation(program2, 'a_TexCoord');
        if (a_TexCoord < 0) {
            console.log('Failed to get the storage location of a_TexCoord');
            return -1;
        }
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
        gl.enableVertexAttribArray(a_TexCoord);  // Enable the buffer assignment

        return n;
    }

    var image0;
    var image1;
    var image2;
    var image3;
    var image4;
    var u_Sampler;



    //*****************************************//
    //                  Init Texture
    //          Params: N (Unused)
    //          Returns None
    //*****************************************//


    function initTextures(n) {
        // Create a texture object
        texture0 = gl.createTexture();
        texture1 = gl.createTexture();
        texture2 = gl.createTexture();
        texture3 = gl.createTexture();
        texture4 = gl.createTexture();


        if (!texture0 || !texture1) {
            console.log('Failed to create the texture object');
            return false;
        }

        // Get the storage location of u_Sampler0 and u_Sampler1
        u_Sampler = gl.getUniformLocation(program2, 'u_Sampler');
        if (!u_Sampler) {
            console.log('Failed to get the storage location of u_Sampler');
            return false;
        }

        // Create the image object
         image0 = new Image();
         image1 = new Image();
         image2 = new Image();
         image3 = new Image();
        image4 = new Image();

        // Register the event handler to be called when image loading is completed
        image0.onload = function(){ loadTexture(gl, n, texture0, image0, 0); };
        image1.onload = function(){ loadTexture(gl, n, texture1, image1, 1); };
        image2.onload = function(){ loadTexture(gl, n, texture2, image2, 2); };
        image3.onload = function(){ loadTexture(gl, n, texture3, image3, 3); };
        image4.onload = function(){ loadTexture(gl, n, texture4, image4, 4); };
        // Tell the browser to load an Image
        image0.src = 'local/space.jpg';
        image1.src = 'local/1.png';
        image2.src = 'local/2.png';
        image3.src = 'local/3.png';
        image4.src = 'local/4.png';
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
        } else if(texUnit == 1) {
            gl.activeTexture(gl.TEXTURE1);
        }else if(texUnit == 2) {
            gl.activeTexture(gl.TEXTURE2);
        }else if(texUnit == 3) {
            gl.activeTexture(gl.TEXTURE3);
        }else if(texUnit == 4) {
            gl.activeTexture(gl.TEXTURE4);
        }

        // bind to target
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // upload image to GPU
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


    }


    //*****************************************//
    //                  Draw Background
    //          Params: None    Returns None
    //*****************************************//


    function drawBG() {
        gl.useProgram(program2);
        // draw first triangle with first texture map
        gl.uniformMatrix4fv(
            imgMatrix, false, bg.matrix.elements);
        gl.uniform1i(u_Sampler, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(program);

    }


    //*****************************************//
    //                  DRAW ENEMY
    //                  h = hits remaining
    //                  m = transition matrix
    //                  Returns none
    //*****************************************//


    function drawEnemy(h,m){
        gl.useProgram(program2);



        gl.uniformMatrix4fv(
            imgMatrix, false, m.elements);


        // draw first triangle with first texture map
        gl.uniform1i(u_Sampler, h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(program);
    }






}]);





