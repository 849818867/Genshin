uniform float uTime;
uniform float uResolution;

varying vec2 vUv;

varying vec3 vWorldPosition;

void main(){
  vec3 p=position;
  
  // 实例化渲染
  #ifdef USE_INSTANCING
  p=vec3(instanceMatrix*vec4(p,1.));
  #endif
  
  // mvp变换 => 裁剪空间
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
  
  // varyings
  vUv=uv;
  vUv.y=1.-uv.y;
  vWorldPosition=vec3(modelMatrix*vec4(p,1.));
}

