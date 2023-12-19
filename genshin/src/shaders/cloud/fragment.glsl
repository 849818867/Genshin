uniform sampler2D uTexture;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

#include "../Common/aces.glsl"

void main(){
  vec2 uv=vUv;
  
  vec4 tex=texture(uTexture,uv);
  
  vec3 col=uColor1;
  col=mix(col,uColor2,pow(tex.r,.6));
  
  float alpha=tex.a;
  
  col=ACES_Inv(col);
  
  gl_FragColor=vec4(col,alpha);
}