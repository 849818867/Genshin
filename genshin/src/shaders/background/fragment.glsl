uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uStop1;
uniform float uStop2;
uniform vec3 uResolution;

varying vec2 vUv;
#include '../common/aces.glsl';

void main(){
  vec2 uv=vUv;
  
  vec3 col1=uColor1;
  vec3 col2=uColor2;
  vec3 col3=uColor3;
  vec3 col=vec3(0.);
  float stop1=uStop1;
  float stop2=uStop2;
  // 根据不同的y值设置mask权值
  float y=1.-uv.y;
  float mask1=1.-smoothstep(0.,stop1,y);
  float mask2=(1.-smoothstep(stop1,stop2,y));
  float mask3=smoothstep(stop1,stop2,y);
  col+=col1*mask1;
  col+=col2*mask2;
  col+=col3*mask3;
  col=ACES_Inv(col);
  gl_FragColor=vec4(col,1.);
}