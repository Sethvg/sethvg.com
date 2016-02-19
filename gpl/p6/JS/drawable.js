

/*
    Class: Drawable
    Required: Render Function
    This class is how you render any object in this framework.  Add faces with the
    add Face Method
 */


/*
    Constructor:
        Params: None
 */
function Drawable() {

    this.xform = new Matrix4();
    this.faces = [];
    this.buffer = gl.createBuffer();
    this.faces = [];
    this.n = 0;
    this.color = [];
    this.cb = false;
    this.inner = false;
    this.shader = false;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

}

/*
    On Tick:
        This is the callback to happen pre render.  If none is set wont be called.
 */
Drawable.prototype.onTick = function (cb) {
    this.cb = cb;
};

/*
    SetInner:
        Sets an inner point to calculate the normals of the faces.
        Params: X,Y,Z in the world cordinates
 */
Drawable.prototype.setInner = function (x, y, z) {
    this.inner = [x, y, z];
};

/*
    Add Face:
        Adds a face to be drawn with this object.  If no vector is provided, will calculate a normal based on the inner point
        Params:
            Face: Float32Array
            Vec: [OPTIONAL] Normal to the face you wish to use for lighting.
 */

Drawable.prototype.addFace = function (face, vec) {

    if (!vec && !this.inner) throw new Error("Must Provide a Normal Vector to the face");
    else if (!vec) vec = calcVec(face, this.inner);


    this.faces.push({face: face, n: face.length / 3, normal: vec});


};


/*
    printNormals
        Debug Function for printing the normals.
        Params: None
 */
Drawable.prototype.printNormals = function () {
    for (var a = 0; a < this.faces.length; a++) {
        console.log(" ");
        console.log(" ");
        console.log(this.faces[a].face);
        console.log(this.faces[a].normal);
        console.log(" ");
        console.log(" ");

    }
}


/*
    Set Color
        Sets the color for the faces to be rendered with.
            Params: RGB [0-1]
 */
Drawable.prototype.setColor = function (r, g, b) {
    this.color = [r, g, b];
};


/*
    Make Cone
        Turns this drawable into a cone based on the params given
        Params:
            x, y, z
 */

Drawable.prototype.makeCone = function (x, y, z, r, h, deg) {
    if (!deg) deg = 360;

    this.setInner(x, y, z + (h / 2));


    var old = [];
    for (var a = 0; a <= 360; a++) {
        var rad = a / 180 * Math.PI;
        var n = [r * Math.sin(rad), r * Math.cos(rad)];


        if (a != 0) {
            this.addFace(new Float32Array([x + old[0], y + old[1], z, x, y, z, x + n[0], y + n[1], z]));
            this.addFace(new Float32Array([x + old[0], y + old[1], z, x, y, z + h, x + n[0], y + n[1], z]));
        }

        old = n;
    }
};


/*
    Inverse Normals:
        Funtion to invert all the face normals.  Can be used for lighting effects.
 */


Drawable.prototype.inverseNormals = function () {
    for (var a = 0; a < this.faces.length; a++) {
        this.faces[a].normal.inverse();
    }
}


/*
    Render
    Workhorse of the class.
    Renders the drawable object to the webGL canvas either using the default shader or the shader given.
    Params:
        Eye: {X,Y,Z}
        aVal: Ambient Light Value
 */
Drawable.prototype.render = function (eye, aVal) {

    var pType;
    if (!this.shader) pType = lightOn ? (directionOn ? 'main' : 'noDirection') : (directionOn ? 'noLight' : 'none');
    else pType = this.shader;
    gl.useProgram(shaders[pType].program);


    // Set the light color (white)
    gl.uniform3f(shaders[pType].u_LightColor, 0.8, 0.8, 0.8);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(shaders[pType].u_LightPosition, -4, 0, 2);
    // Set the ambient light
    gl.uniform3f(shaders[pType].u_AmbientLight, aVal, aVal, aVal);

    if (this.cb)cb();
    var proj = new Matrix4().setPerspective(30, width / height, .001, 500);

    var vec = getMoveVector();

    var look = new Matrix4().setLookAt(eye.x, eye.y, eye.z,
        eye.x + vec[0], eye.y + vec[1], eye.z,
        0, 0, 1);

    var final = new Matrix4().set(proj).multiply(look).multiply(this.xform);


    for (var a = 0; a < this.faces.length; a++) {
        var face = this.faces[a];

        gl.uniform3f(shaders[pType].normal, face.normal.x, face.normal.y, face.normal.z);
        gl.bufferData(gl.ARRAY_BUFFER, face.face, gl.STATIC_DRAW);
        gl.vertexAttribPointer(
            shaders[pType].aPos, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(shaders[pType].aPos);
        gl.uniform4f(shaders[pType].color, this.color[0], this.color[1], this.color[2], 1);
        gl.uniformMatrix4fv(
            shaders[pType].u_MvpMatrix, false, final.elements);
        gl.uniformMatrix4fv(
            shaders[pType].u_MvpMatrix, false, final.elements);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, face.n);
    }

    gl.useProgram(shaders['main'].program);
};







