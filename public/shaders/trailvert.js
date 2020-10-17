export const trailvert = `
uniform sampler2D texturePosition;
varying vec4 vColor;

void main(){
  vec3 pos=texture2D(texturePosition,uv).xyz;

  vec3 c=vec3(uv.x, uv.y, 1.0);
  vColor=vec4(c,1.);
  gl_PointSize=15.;
  vec4 mvPosition=modelViewMatrix*vec4(pos+position,1.);
  gl_Position=projectionMatrix*mvPosition;
}
`;