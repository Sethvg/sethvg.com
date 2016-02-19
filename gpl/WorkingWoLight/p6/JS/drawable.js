function Drawable(){

    this.xform = new Matrix4();
    this.faces = [];
    this.buffer = gl.createBuffer();
    this.faces = [];
    this.n = 0;
    this.color = [];
    this.cb = false;
    this.inner = false;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

}

Drawable.prototype.onTick = function(cb){
    this.cb = cb;
};

Drawable.prototype.setInner = function(x,y,z){
  this.inner = [x,y,z];
};

Drawable.prototype.addFace = function(face,vec){

    if(!vec && !this.inner) throw new Error("Must Provide a Normal Vector to the face");
    else if (!vec) vec = calcVec(face,this.inner);




    this.faces.push({face:face,n:face.length/3,normal:vec});


};


Drawable.prototype.printNormals = function(){
    for(var a = 0; a < this.faces.length; a++){
        console.log('-------------------');
        console.log();
        console.log("Face: " + this.faces[a].face);
        console.log(this.faces[a].normal);
        console.log();
        console.log('-------------------');
    }
}

Drawable.prototype.setColor = function(r,g,b){
    this.color = [r,g,b];
};




Drawable.prototype.makeCone = function(x,y,z,r,h,deg){
    if(!deg) deg = 360;

    this.setInner(x,y,z+(h/2));



    var old = [];
    for(var a = 0; a <= 360; a++){
        var rad = a/180*Math.PI;
        var n = [r*Math.sin(rad),r*Math.cos(rad)];





        if(a != 0){
            this.addFace(new Float32Array([x+old[0],y+old[1],z ,  x,y,z   ,    x+n[0], y+n[1],z,  x+old[0],y+old[1],z,   x,y,z+h, x+n[0],y+n[1],z]));
        }

        old = n;
    }
};








Drawable.prototype.render = function(eye){
    // view.setOrtho(-10,10,-10,10,2,22);

    if(this.cb)cb();
    var proj = new Matrix4().setPerspective(30,width/height,.001,500);

    var vec = getMoveVector();

    var look = new Matrix4().setLookAt(eye.x, eye.y, eye.z,
        eye.x + vec[0], eye.y + vec[1], eye.z,
        0,0,1);

    var final = new Matrix4().set(proj).multiply(look).multiply(this.xform);


    for (var a = 0; a < this.faces.length; a++) {
        var face = this.faces[a];


        gl.bufferData(gl.ARRAY_BUFFER, face.face, gl.STATIC_DRAW);
        gl.vertexAttribPointer(
            shaders.main.pos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaders.main.pos);
        gl.uniform4f(shaders.main.color, this.color[0],this.color[1],this.color[2], 1);
        gl.uniformMatrix4fv(
            shaders.main.view, false, final.elements);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, face.n);
    }
};







