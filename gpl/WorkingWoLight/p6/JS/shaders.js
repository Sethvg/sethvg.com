// Vertex shader program


var shaders = {};
var programs = {};



var VSHADER_SOURCE =
    'attribute vec4 pos;\n' +
    'uniform mat4 view;\n' +

    'void main() {\n' +
    '  gl_Position =  view * pos;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
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



function ShaderProgram(vsh,fsh){

    if (!initShaders(gl, vsh, fsh)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    this.program = gl.program;


}


function initAllShaders() {

    shaders.img = new ShaderProgram(VSHADER_SOURCE2, FSHADER_SOURCE2);

    shaders.img.imgView = gl.getUniformLocation(shaders.img.program, 'imgView');
    shaders.img.pos = gl.getAttribLocation(shaders.img.program, 'a_Position');
    shaders.img.cords = gl.getAttribLocation(shaders.img.program, 'a_TexCoord');
    shaders.img.sampler = gl.getUniformLocation(shaders.img.program, 'u_Sampler');

    shaders.main = new ShaderProgram(VSHADER_SOURCE, FSHADER_SOURCE);

    shaders.main.pos = gl.getAttribLocation(gl.program, 'pos');
    shaders.main.color = gl.getUniformLocation(gl.program, 'color');
    shaders.main.view = gl.getUniformLocation(gl.program, 'view');




}



