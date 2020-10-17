export const cherryfrag = `
uniform sampler2D cherry;
void main(){
  vec4 color=texture2D( cherry, gl_PointCoord );
  if ( color.a < 0.5 ) discard;
  gl_FragColor = color;
}
`;