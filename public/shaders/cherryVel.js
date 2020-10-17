export const cherryVel = `
uniform float time;
void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D( texturePosition, uv ).xyz;
  vec3 vel = texture2D( textureVelocity, uv ).xyz;
  gl_FragColor = vec4( vel.xyz, 1.0 );
}
`;
