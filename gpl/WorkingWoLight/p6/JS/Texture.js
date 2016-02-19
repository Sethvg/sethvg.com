function Texture(loc,gl){

    gl.useProgram(shaders.img.program);
    this.location = loc;
    this.xform = new Matrix4().scale(1,1,0);
    var vCords =  new Float32Array([

         -0.5,  0.5,   0.0, 1.0,
         -0.5, -0.5,   0.0, 0.0,
         0.5,  0.5,   1.0, 1.0,
         0.5, -0.5,   1.0, 0.0

    ]);
    var n = 4; // The number of vertices


    var vBuffer = gl.createBuffer();



    // Write the positions of vertices to a vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vCords, gl.STATIC_DRAW);

    var FSIZE = vCords.BYTES_PER_ELEMENT;
    //Get the storage location of a_Position, assign and enable buffer


    gl.vertexAttribPointer(shaders.img.pos, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(shaders.img.pos);  // Enable the assignment of the buffer object

    gl.vertexAttribPointer(shaders.img.cords, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(shaders.img.cords);  // Enable the buffer assignment





   var texture0;
    var image0;

    //*****************************************//
    //                  Init Texture
    //          Params: N (Unused)
    //          Returns None
    //*****************************************//


    function initTextures() {
        // Create a texture object
        texture0 = gl.createTexture();


        if (!texture0) {
            console.log('Failed to create the texture object');
            return false;
        }

        image0 = new Image();


        // Register the event handler to be called when image loading is completed
        image0.onload = function(){ loadTexture(gl,  texture0, image0); };

        // Tell the browser to load an Image
        image0.src = loc;

        return true;
    }






    //*****************************************//
    //                  Load Texture
    //          Params: GL, Unused, JS texture Obj
    //                  JS image OBJ,
    //                  Texture Unit Identifier
    //          Returns None
    //*****************************************//


    function loadTexture(gl, texture, image) {

        // flip y when unpacking
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.activeTexture(gl.TEXTURE0);


        // bind to target
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // set texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // upload image to GPU
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


    }


    initTextures();

    gl.useProgram(shaders.main.program);


    this.render = function(eye){

        gl.useProgram(shaders.img.program);

       // loadTexture(gl,texture0,image0);

        var proj = new Matrix4().setPerspective(30,width/height,.001,500);
        var vec = getMoveVector();
        var look = new Matrix4().setLookAt(eye.x, eye.y, eye.z,
            eye.x + vec[0], eye.y + vec[1], eye.z,
            0,0,1);
        var final = new Matrix4().set(proj).multiply(look).multiply(this.xform);




        gl.uniformMatrix4fv(
            shaders.img.imgView, false, final.elements);
        gl.uniform1i(shaders.img.sampler, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(shaders.main.program);
    }


}