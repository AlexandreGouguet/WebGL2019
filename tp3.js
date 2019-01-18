function loadText(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType("text/plain");
    xhr.send(null);
    if(xhr.status === 200)
        return xhr.responseText;
    else {
        return null;
    }
}

// variables globales du programme;
var canvas;
var gl; //contexte
var program; //shader program
var attribPos; //attribute position
var attribProj; //attribute projection
var attribTrans;
var getPosition = [0, 0];
var pointSize = 10.0;
var buffer;
var rota = 0;
var project; //matrice de projection
var arrayPositions = [
    //face1 (devant)
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,

    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,

    //face2 (derriere)
    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,

    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,

    //face3 (gauche)
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,

    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,

    //face4 (droite)
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,

    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    //face5 (haut)
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,

    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,

    //face6 (bas)
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,

    0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5
];

var color = [
    0,0,127,
    0,0,127,
    0,0,127,
    0,0,127,
    0,0,127,
    0,0,127,

    127,0,0,
    127,0,0,
    127,0,0,
    127,0,0,
    127,0,0,
    127,0,0,

    0,127,0,
    0,127,0,
    0,127,0,
    0,127,0,
    0,127,0,
    0,127,0,

    0,127,127,
    0,127,127,
    0,127,127,
    0,127,127,
    0,127,127,
    0,127,127,

    127,127,0,
    127,127,0,
    127,127,0,
    127,127,0,
    127,127,0,
    127,127,0,

    127,127,127,
    127,127,127,
    127,127,127,
    127,127,127,
    127,127,127,
    127,127,127,
]

function initContext(){
    canvas = document.getElementById('dawin-webgl');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('ERREUR : echec chargement du contexte');
        return;
    }
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
}

//Initialisation des shaders et du program
function initShaders(){
    var fragmentSource = loadText('fragment.glsl');
    var vertexSource = loadText('vertex.glsl');

    var fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, fragmentSource);
    gl.compileShader(fragment);

    var vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, vertexSource);
    gl.compileShader(vertex);

    gl.getShaderParameter(fragment, gl.COMPILE_STATUS);
    gl.getShaderParameter(vertex, gl.COMPILE_STATUS);

    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragment));
    }

    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertex));
    }

    program = gl.createProgram();
    gl.attachShader(program, fragment);
    gl.attachShader(program, vertex);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Could not initialise shaders");
    }
    gl.useProgram(program);
}

//Fonction initialisant les attributs pour l'affichage (position et taille)
function initAttributes(){
    attribPos = gl.getAttribLocation(program, "position");
    attribTrans = gl.getUniformLocation(program, "translation");
    attribRot = gl.getUniformLocation(program, "rotation");
    attribProj = gl.getUniformLocation(program, "projection");
    colorLocation = gl.getAttribLocation(program, "a_color");
}

//Initialisation des buffers
function initBuffers(){
    //init buffer de points
    buffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrayPositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribPos);
    gl.vertexAttribPointer(attribPos, 3, gl.FLOAT, true, 0, 0);

    colorBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, true, 0, 0);
}

//Fonction permettant le dessin dans le canvas
function draw(){
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, arrayPositions.length/3);
}

function initProject(){
    project = mat4.create();
    mat4.perspective(project, 1.5, 1, 0.01, 15);
    gl.uniformMatrix4fv(attribProj, false, project);

    var vec = vec3.fromValues(0,0,-2);
    translate = mat4.create();
    mat4.fromTranslation(translate,vec);
    gl.uniformMatrix4fv(attribTrans, false, translate);

    rotation = mat4.create();
    mat4.fromYRotation(rotation, 0.8);
    gl.uniformMatrix4fv(attribRot, false, rotation);
}

function initEvents() {
    document.getElementById("rx").onclick = function(e){
        mat4.rotateX(rotation, rotation, document.getElementById("rx").value/100);
        rotationDrawing();
    }
    document.getElementById("ry").onclick = function(e){
        mat4.rotateY(rotation, rotation, document.getElementById("ry").value/100);
        rotationDrawing();
    }
    document.getElementById("rz").onclick = function(e){
        mat4.rotateZ(rotation, rotation, document.getElementById("rz").value/100);
        rotationDrawing();
    }

    document.getElementById("tx").onclick = function(e){
        translationDrawing();
    }
    document.getElementById("ty").onclick = function(e){
        translationDrawing();
    }
    document.getElementById("tz").onclick = function(e){
        translationDrawing();
    }

    document.getElementById("zoom").onclick = function(e){
        mat4.perspective(project, document.getElementById("zoom").value/10, 1, 0.01, 15);
        gl.uniformMatrix4fv(attribProj, false, project);
        draw();
    }
    document.getElementById("fov").onclick = function(e){
        mat4.perspective(project, 1.5, 1+document.getElementById("fov").value/10, 0.01, 15);
        gl.uniformMatrix4fv(attribProj, false, project);
        draw();
    }
}

function translationDrawing(){
    //go to 0,0,-2 (init)
    translate = mat4.create();
    var vec = vec3.fromValues(0,0,-2);
    mat4.fromTranslation(translate,vec);
    gl.uniformMatrix4fv(attribTrans, false, translate);

    //Apply transform
    var vec = vec3.fromValues(document.getElementById("tx").value,document.getElementById("ty").value,document.getElementById("tz").value);
    mat4.translate(translate, translate, vec);
    gl.uniformMatrix4fv(attribTrans, false, translate);
    draw();
}

function rotationDrawing(){
    gl.uniformMatrix4fv(attribRot, false, rotation);
    draw();
}

function main(){
    initContext();
    initShaders();
    initAttributes();
    initProject();
    initEvents();
    initBuffers();
    draw();
}
