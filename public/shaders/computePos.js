export const computePos = `
// 現在の位置情報を決定する

void main(){
  const float delta = 1./60.;
  if(gl_FragCoord.x<=1.){
    vec2 uv=gl_FragCoord.xy/resolution.xy;
    vec4 pos=texture2D(texturePosition,uv);
    vec4 vel=texture2D(textureVelocity,uv);
    // velが移動する方向(もう一つ下のcomputeShaderVelocityを参照)

    // 移動する方向に速度を掛け合わせた数値を現在地に加える。
    pos.xyz+=vel.xyz*delta;
    gl_FragColor=vec4(pos.xyz,1.);
  }else{
    vec2 bUV=(gl_FragCoord.xy-vec2(1.,0.))/resolution.xy;
    vec3 bPos=texture2D(texturePosition,bUV).xyz;
    gl_FragColor=vec4(bPos,1.);
  }
}

`;
