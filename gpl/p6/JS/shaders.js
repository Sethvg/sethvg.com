// Vertex shader program


var shaders = {};
var programs = {};

//*****************************************//
//              SHADERS
//        MAIN DRAWABLE SHADER
//        TRHEE FRAGMENT SHADERS BASED ON WHICH LIGHTS ARE ON
//
//*****************************************//
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform vec3 NormalVec;\n' +
    'uniform vec4 color;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec3 v_Normal;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Position = vec3(a_Position);\n' +
    '  v_Normal = NormalVec;\n' +
    '  v_Color = color;\n' +
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
    'varying vec4 v_Color;\n' +
    'void main() {\n' +

        // Normalize the normal because it is interpolated and not 1.0 in length any more
    '  vec3 normal = normalize(v_Normal);\n' +
        // Calculate the light direction and make it 1.0 in length
    '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
        // The dot product of the light direction and the normal
    '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
    '  float nDotL2 = max(dot(normalize(vec3(1,1,1)), normal), 0.0);\n' +
        // Calculate the final color from diffuse reflection and ambient reflection
    '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
    '  vec3 directional = u_LightColor * v_Color.rgb * nDotL2;\n' +
    '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
    '  gl_FragColor = vec4(diffuse + ambient + directional, v_Color.a);\n' +

    '}\n';

// Fragment shader program
var FSHADER_SOURCE_NO_POINT =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +

        // Normalize the normal because it is interpolated and not 1.0 in length any more
    '  vec3 normal = normalize(v_Normal);\n' +
        // Calculate the light direction and make it 1.0 in length
        // The dot product of the light direction and the normal
    '  float nDotL2 = max(dot(normalize(vec3(1,1,1)), normal), 0.0);\n' +
        // Calculate the final color from diffuse reflection and ambient reflection
    '  vec3 directional = u_LightColor * v_Color.rgb * nDotL2;\n' +
    '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
    '  gl_FragColor = vec4(ambient + directional, v_Color.a);\n' +

    '}\n';

// Fragment shader program
var FSHADER_SOURCE_NO_DIRECTIONAL =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +

        // Normalize the normal because it is interpolated and not 1.0 in length any more
    '  vec3 normal = normalize(v_Normal);\n' +
        // Calculate the light direction and make it 1.0 in length
    '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
        // The dot product of the light direction and the normal
    '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
        // Calculate the final color from diffuse reflection and ambient reflection
    '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
    '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
    '  gl_FragColor = vec4(diffuse + ambient , v_Color.a);\n' +

    '}\n';



//*****************************************//
//              TEXTURE SHADERS
//      Shaders for rendering texture maps
//
//*****************************************//

var FSHADER_SOURCE_NONE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform vec3 u_LightColor;\n' +     // Light color
    'uniform vec3 u_LightPosition;\n' +  // Position of the light source
    'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
    'varying vec3 v_Normal;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
    '  gl_FragColor = vec4( ambient , v_Color.a);\n' +

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




//*****************************************//
//              SHADER PROGRAM
//          PARAMS:
//              vsh Vertex Shader
//              fsh Fragment Shader
//          RETURNS:
//              none
//
//*****************************************//
function ShaderProgram(vsh, fsh) {

    if (!initShaders(gl, vsh, fsh)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    this.program = gl.program;


}

//*****************************************//
//              Init all Shaders
//          PARAMS:
//              None
//          RETURNS:
//              None
//
//*****************************************//
function initAllShaders() {

    shaders.img = new ShaderProgram(VSHADER_SOURCE2, FSHADER_SOURCE2);

    shaders.img.imgView = gl.getUniformLocation(shaders.img.program, 'imgView');
    shaders.img.pos = gl.getAttribLocation(shaders.img.program, 'a_Position');
    shaders.img.cords = gl.getAttribLocation(shaders.img.program, 'a_TexCoord');
    shaders.img.sampler = gl.getUniformLocation(shaders.img.program, 'u_Sampler');


    shaders.noLight = new ShaderProgram(VSHADER_SOURCE, FSHADER_SOURCE_NO_POINT);
    // Get the storage locations of uniform variables
    shaders.noLight.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    shaders.noLight.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    shaders.noLight.u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    shaders.noLight.u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    shaders.noLight.u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    shaders.noLight.normal = gl.getUniformLocation(gl.program, 'NormalVec');
    shaders.noLight.aPos = gl.getAttribLocation(gl.program, "a_Position");
    shaders.noLight.color = gl.getUniformLocation(gl.program, 'color');

    shaders.noDirection = new ShaderProgram(VSHADER_SOURCE, FSHADER_SOURCE_NO_DIRECTIONAL);
    // Get the storage locations of uniform variables
    shaders.noDirection.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    shaders.noDirection.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    shaders.noDirection.u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    shaders.noDirection.u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    shaders.noDirection.u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    shaders.noDirection.normal = gl.getUniformLocation(gl.program, 'NormalVec');
    shaders.noDirection.aPos = gl.getAttribLocation(gl.program, "a_Position");
    shaders.noDirection.color = gl.getUniformLocation(gl.program, 'color');

    shaders.none = new ShaderProgram(VSHADER_SOURCE, FSHADER_SOURCE_NONE);
    // Get the storage locations of uniform variables
    shaders.none.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    shaders.none.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    shaders.none.u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    shaders.none.u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    shaders.none.u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    shaders.none.normal = gl.getUniformLocation(gl.program, 'NormalVec');
    shaders.none.aPos = gl.getAttribLocation(gl.program, "a_Position");
    shaders.none.color = gl.getUniformLocation(gl.program, 'color');

    shaders.main = new ShaderProgram(VSHADER_SOURCE, FSHADER_SOURCE);

    // Get the storage locations of uniform variables
    shaders.main.u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    shaders.main.u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    shaders.main.u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    shaders.main.u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    shaders.main.u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    shaders.main.normal = gl.getUniformLocation(gl.program, 'NormalVec');
    shaders.main.aPos = gl.getAttribLocation(gl.program, "a_Position");
    shaders.main.color = gl.getUniformLocation(gl.program, 'color');


}



