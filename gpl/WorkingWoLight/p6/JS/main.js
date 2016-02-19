//*****************************************//
//Written by:   Seth Vg
//              9/21/2012
//*****************************************//




var app = angular.module("app", []);



var gl;
var lookAngle = 0;






var width;
var height;

var floor;




var table;
var drawables = [];

app.controller("main", ['$rootScope','$scope','$location', function ($rootScope, $scope, $location) {



    var dLight = [1,1,1];
    //*****************************************//
    //                  RENDER FUNCTION
    //         PARAMS:
    //              MATRIX (VIEW PERSPECTIVE XFORM)
    //              COLOR ARRAY (x6) RGB
    //              Boolean: Use Image Render
    //

    //          RETURNS: NONE
    //*****************************************//




    $scope.eye = {};

    $scope.eye.x = 0;
    $scope.eye.y =-20;
    $scope.eye.z = 2;


    //*****************************************//
    //                  ANIMATION BLOCK
    //     PARAMS: NONE RETURNS: NONE
    //    Called Continuously From Init
    //*****************************************//


    function tick() {


            var moveSpeed = 2;
            var turnSpeed = 2;

            if(keys.left){
                lookAngle -= turnSpeed;
                if(lookAngle < 0) lookAngle = 360 + lookAngle;
            }
            else if(keys.right){
                lookAngle+=turnSpeed;
                if(lookAngle >= 360) lookAngle %= 360;
            }
            if(keys.up) {
                var vec = getMoveVector();
                $scope.eye.x += moveSpeed * vec[0];
                $scope.eye.y += moveSpeed * vec[1];
            }
            else if(keys.down){
                var vec = getMoveVector();
                $scope.eye.x-=moveSpeed*vec[0];
                $scope.eye.y-=moveSpeed*vec[1];
            }

        sunAngle++;
        sun.xform = new Matrix4().rotate(sunAngle/80,1,0,0);





        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for(var a = 0; a < drawables.length; a++){
            drawables[a].render($scope.eye);
        }
        requestAnimationFrame(tick, canvas);

    }


    var sun;
    var sunAngle=  -10;


    $scope.init = function () {
        //Create the contexts
        canvas = document.getElementById("mycanvas");
        gl = canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        width = canvas.width;
        height = canvas.height;

        initAllShaders();
        gl.enable(gl.DEPTH_TEST);


        floor = new Drawable();
        floor.setInner(0,0,-1);
     floor.addFace(new Float32Array([
            -200,-200, -.1,
            200,-200, -.1,
            -200,200, -.1,
            200,200, -.1
        ]));


        floor.setColor(0,.6 ,.4);
        drawables.push(floor);






        table = new Drawable();
        table.setColor(1,0,0);
        table.setInner(0,0,1.05);
        table.addFace(new Float32Array([-2,-2,1, 2, -2, 1, -2, 2, 1, 2, 2, 1]));
        table.addFace(new Float32Array([-2,-2,1.1, 2, -2, 1.1, -2, 2, 1.1, 2, 2, 1.1]));

        table.addFace(new Float32Array([-2,-2,1.1, -2, -2, 1, 2, -2, 1.1, 2, -2, 1]));
        table.addFace(new Float32Array([-2,-2,1.1, -2, -2, 1, -2, 2, 1.1, -2, 2, 1]));
        table.addFace(new Float32Array([2,2,1.1, 2, 2, 1, -2, 2, 1.1, -2, 2, 1]));
        table.addFace(new Float32Array([2,2,1.1, 2, 2, 1, 2, -2, 1.1, 2, -2, 1]));


       // table.printNormals();
        drawables.push(table);


        var tableLeg = [new Drawable(),new Drawable(), new Drawable(), new Drawable()];
        tableLeg[0].setColor(0,0,1);
        tableLeg[0].setInner(-1.8,-1.8,1);
        tableLeg[0].addFace(new Float32Array([-2,-2,1, -2,-2,0, -1.7,-2, 1,-1.7,-2,0]));
        tableLeg[0].addFace(new Float32Array([-2,-2,1, -2,-2,0, -2,-1.7, 1,-2,-1.7,0]));
        tableLeg[0].addFace(new Float32Array([-1.7,-2,1, -1.7,-2,0, -2,-1.7, 1,-2,-1.7,0]));


        tableLeg[1].setColor(0,0,1);
        tableLeg[1].setInner(1.8,1.8,1);
        tableLeg[1].addFace(new Float32Array([2,2,1, 2,2,0, 1.7,2, 1,1.7,2,0]));
        tableLeg[1].addFace(new Float32Array([2,2,1, 2,2,0, 2,1.7, 1,2,1.7,0]));
        tableLeg[1].addFace(new Float32Array([1.7,2,1, 1.7,2,0, 2,1.7, 1,2,1.7,0]));


        tableLeg[2].setColor(0,0,1);
        tableLeg[2].setInner(-1.8,1.8,1);
        tableLeg[2].addFace(new Float32Array([-2,2,1, -2,2,0, -1.7,2, 1,-1.7,2,0]));
        tableLeg[2].addFace(new Float32Array([-2,2,1, -2,2,0, -2,1.7, 1,-2,1.7,0]));
        tableLeg[2].addFace(new Float32Array([-1.7,2,1, -1.7,2,0, -2,1.7, 1,-2,1.7,0]));

        tableLeg[3].setColor(0,0,1);
        tableLeg[3].setInner(1.8,-1.8,1);
        tableLeg[3].addFace(new Float32Array([2,-2,1, 2,-2,0, 1.7,-2, 1,1.7,-2,0]));
        tableLeg[3].addFace(new Float32Array([2,-2,1, 2,-2,0, 2,-1.7, 1,2,-1.7,0]));
        tableLeg[3].addFace(new Float32Array([1.7,-2,1, 1.7,-2,0, 2,-1.7, 1,2,-1.7,0]));

        drawables.push(tableLeg[0]);
        drawables.push(tableLeg[1]);
        drawables.push(tableLeg[2]);
        drawables.push(tableLeg[3]);





        var rug = new Drawable();
        rug.addFace( new Float32Array([-5,-5,-1,-5,5,-1,5,-5,-1,5,5,-1]),new Vector(0,0,1));
        rug.setColor(1,1,1);
        drawables.push(rug);
        var text = new Texture('assets/tree.jpg',gl);
        drawables.push(text);



        var lightBase = new Drawable();
        drawables.push(lightBase);

        lightBase.setColor(0,0,0);


        var lightTop = new Drawable();
        drawables.push(lightTop);
        lightTop.setColor(.2,.2,.2);


        var center = [10,10];
        lightTop.setInner(center[0],center[1],0);
        lightBase.setInner(center[0],center[1],0);
        var l = 3;
        var i;
        var h = .4;
        for(var a = 0; a <= 360; a++){
            var rad = a/180*Math.PI;
            var y = center[1] + l * Math.cos(rad);
            var x = center[0] + l * Math.sin(rad);
            if(a!= 0) lightBase.addFace(new Float32Array([ i[0] , i[1] , 0, i[0], i[1],h, x, y, 0, x, y,h ]));
            if(a!= 0)lightTop.addFace(new Float32Array([i[0],i[1],h, center[0],center[1],h, x,y,h]));
            i = [x,y];
        }

    lightBase.printNormals();

        var cone = new Drawable();
        cone.makeCone(-1,0,1.1,.5,2);
        cone.setColor(0,0,.5);
        drawables.push(cone);




        var dis = 200;
        var mountWidth = 200;
        var mountHeight = 20;



        for(var a = 0 ; a < 360; a++){
            var mBase = Math.random() * mountWidth;
            if(mBase < 50) mBase+=50;
            var mHeight = Math.random()*mountHeight;

           var rad = a/180*Math.PI;
            var mp = [dis*Math.sin(rad),dis*Math.cos(rad)];

            aN = Math.atan(mBase/2/dis);
            d = Math.sqrt(mBase/2*(mBase/2) + dis * dis);

            var p1 = [d*Math.sin(rad+aN),d*Math.cos(rad+aN)];
            var p2 = [d*Math.sin(rad-aN),d*Math.cos(rad-aN)];

            var mountains = new Drawable();
            mountains.setInner(0,0,0);
            var c = (Math.random()*55+200)/255;
            mountains.setColor(0,1,1);
            mountains.addFace(new Float32Array([p1[0],p1[1],0,  mp[0],mp[1],mHeight, p2[0],p2[1],0]));
            drawables.push(mountains);
        }



        sun = new Drawable();
        sun.setInner(0,0,0);
        var sunnyD = 250;
        sun.setColor(.7,.1,.1);
        var sunnyWidth = 20;


        var old;
        for(var a = 0; a <= 360; a++){
            var rad = a/180*Math.PI;
            var mp = [sunnyWidth * Math.cos(rad),sunnyWidth * Math.sin(rad)];
            if(a!=0) sun.addFace(new Float32Array([old[0],sunnyD,old[1],0,sunnyD,0,mp[0],sunnyD,mp[1]]));


            old = mp;
        }


        drawables.push(sun);


        tick();


    };





    //*****************************************//
    //                  KEYBOARD CLICK HANDLER
    //          PARAMS:
    //              JS EVENT
    //          RETURNS: NONE
    //
    //*****************************************//




   //*****************************************//
   //                  Normal Vector Helper
    //              Gets normal vector to view plane
    //              PARAMS: NONE, RETURNS, :[X,Y] Of Normal Vector
   //*****************************************//


    var keys = {};
    keys.left = false;
    keys.right = false;
    keys.up = false;
    keys.down = false;



    $scope.keyUp = function(event){
        var kc = event.keyCode;
        if(kc===37){
            keys.left = true;
        }else if(kc === 39){
           keys.right = true;
        }else if(kc === 38){
            keys.up=true;
        }else if(kc === 40){
            keys.down = true;
        }

        if(kc === 82){
            $scope.eye.z+=.2;
        }else if(kc === 68){
            $scope.eye.z-=.2;
        }
    }

    $scope.keyDown = function(event){
        var kc = event.keyCode;
        if(kc===37){
            keys.left = false;
        }else if(kc === 39){
            keys.right = false;
        }else if(kc === 38){
            keys.up = false;
        }else if(kc === 40){
            keys.down=false;
        }
    }








}]);

function getMoveVector(){
    var d = .2;
    return [Math.sin(lookAngle/180*Math.PI) * d, Math.cos(lookAngle/180*Math.PI) * d];
}





