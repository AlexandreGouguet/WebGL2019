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
var mousePositions = [];
var buffer;
var rota = 0;
var project; //matrice de projection

function initContext(){
    canvas = document.getElementById('dawin-webgl');
    gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('ERREUR : echec chargement du contexte');
        return;
    }
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
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
}

//Initialisation des buffers
function initBuffers(){
    //init buffer de points
    buffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mousePositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribPos);
    gl.vertexAttribPointer(attribPos, 3, gl.FLOAT, true, 0, 0);
}

function triangleGrid(){
//face1 (devant)
    //triangle1
    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);

    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    //triangle2
    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);

    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);
    
    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

//face2 (derriere)
    //triangle1
    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);

    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

    //triangle2
    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);

    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);
    
    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

//face3 (gauche)
    //triangle1
    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);

    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);
    

    //triangle2
    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);

//face4 (droite)
    //triangle1
    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);

    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);

    //triangle2
    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);

//face5 (haut)
    //triangle1
    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    //triangle2
    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(0);

    mousePositions.push(0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

    mousePositions.push(-0.5);
    mousePositions.push(0.5);
    mousePositions.push(-1);

//face6 (bas)
    //triangle1
    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);

    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);

    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);

    //triangle2
    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(0);

    mousePositions.push(0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);

    mousePositions.push(-0.5);
    mousePositions.push(-0.5);
    mousePositions.push(-1);
}
/*
//Mise a jour des buffers : necessaire car les coordonnees des points sont ajoutees a chaque clic
function refreshBuffers(){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mousePositions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(attribPos, 3, gl.FLOAT, true, 0, 0);  
}*/

//Fonction permettant le dessin dans le canvas
function draw(){
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, mousePositions.length/3);
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
        mat4.fromXRotation(rotation, document.getElementById("rx").value/100);
        gl.uniformMatrix4fv(attribRot, false, rotation);
        draw();
    }
    document.getElementById("ry").onclick = function(e){
        mat4.fromYRotation(rotation, document.getElementById("ry").value/100);
        gl.uniformMatrix4fv(attribRot, false, rotation);
        draw();
    }
    document.getElementById("rz").onclick = function(e){
        mat4.fromZRotation(rotation, document.getElementById("rz").value/100);
        gl.uniformMatrix4fv(attribRot, false, rotation);
        draw();
    }
    document.getElementById("tx").onclick = function(e){
        var vec = vec3.fromValues(-document.getElementById("tx").value,0,0);
        mat4.fromTranslation(translate,vec);
        gl.uniformMatrix4fv(attribTrans, false, translate);
        draw();
    }
    document.getElementById("ty").onclick = function(e){
        var vec = vec3.fromValues(0,-document.getElementById("ty").value,0);
        mat4.fromTranslation(translate,vec);
        gl.uniformMatrix4fv(attribTrans, false, translate);
        draw();
    }
    document.getElementById("tz").onclick = function(e){
        var vec = vec3.fromValues(0,0,-document.getElementById("tz").value);
        mat4.fromTranslation(translate,vec);
        gl.uniformMatrix4fv(attribTrans, false, translate);
        draw();
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

function main(){
    initContext();
    triangleGrid();
    initShaders();
    initAttributes();
    initProject();
    initEvents();
    initBuffers();
    draw();
}
