// uv坐标
varying highp vec2 vTextureCoord;
// 世界坐标
varying highp vec3 vFragPos;
// 法线向量
varying highp vec3 vNormal;

void main(){
  vec3 p=position;
  vec3 n=normal;
  
  // 实例化渲染
  #ifdef USE_INSTANCING
  p=vec3(instanceMatrix*vec4(p,1.));
  n=(instanceMatrix*vec4(normal,0.)).xyz;
  #endif
  
  // varying
  vFragPos=(modelMatrix*vec4(p,1.)).xyz;
  vNormal=(modelMatrix*vec4(n,0.)).xyz;
  vTextureCoord=uv;
  
  //mvp变换 => 输出裁剪空间坐标
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
  
}