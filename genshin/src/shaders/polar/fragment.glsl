uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
  vec2 uv=vUv;
  float mask=1.5*texture(uTexture,uv+vec2(uTime*.015,0.)).r;
  vec3 col=vec3(1.8);
  
  float alpha=mask;
  // 虚化光的一部分
  float mask1=1.;
  mask1*=smoothstep(0.,.5,uv.y);
  mask1*=smoothstep(0.,.1,uv.x);
  mask1*=smoothstep(1.,.9,uv.x);
  alpha*=mask1;
  
  gl_FragColor=vec4(col,alpha);
}