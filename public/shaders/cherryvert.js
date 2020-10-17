export const cherryvert = `
uniform sampler2D texturePosition;
uniform float time;
void main(){
  vec3 pos=texture2D(texturePosition,uv).xyz;
  vec3 c=vec3(uv.x, uv.y, 1.0);
  vec4 mvPosition=modelViewMatrix*vec4(pos+position,1.);
  gl_PointSize = 8.0 *cos(time) * ( 256.0 / -mvPosition.z );
  gl_Position=projectionMatrix*mvPosition;
}
`;