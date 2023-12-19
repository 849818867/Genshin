uniform float uTime;
uniform float uResolution;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
  vec2 uv=vUv;
  
  vec4 tex=texture(uTexture,uv);
  
  vec3 col=vec3(1.8);
  
  float alpha=tex.r*.4;
  
  gl_FragColor=vec4(col,alpha);
}