attribute vec3 position;
uniform mat4 translation;
uniform mat4 projection;
uniform mat4 rotation;
void main() {
    gl_Position = projection*translation*rotation*vec4(position[0], position[1], position[2], 1.0);
}