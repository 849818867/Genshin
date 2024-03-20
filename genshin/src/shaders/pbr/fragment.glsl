// 相机位置
uniform vec3 uCameraPos;
// 直射光向量
uniform vec3 uLightDir;
// 光源颜色
uniform vec3 uLightColor;
// 光照强度
uniform float uLightRadiance;
// 自发光颜色
uniform vec3 uAmbientColor;

// 贴图
uniform sampler2D uMap;
// roughnessMap
uniform sampler2D uRoughnessMap;
// metalnessMap
uniform sampler2D uMetalnessMap;

// uv坐标
varying highp vec2 vTextureCoord;
// 世界坐标
varying highp vec3 vFragPos;
// 法线向量
varying highp vec3 vNormal;

// PI值
const float PI=3.14159265359;

#include '../common/aces.glsl';

float DistributionGGX(vec3 N,vec3 H,float roughness)
{
  // TODO: To calculate GGX NDF here
  
  float a=roughness*roughness;
  float a2=a*a;
  float NdotH=max(dot(N,H),0.);
  float NdotH2=NdotH*NdotH;
  
  float nom=a2;
  float denom=(NdotH2*(a2-1.)+1.);
  denom=PI*denom*denom;
  
  return nom/max(denom,.0001);
}

float GeometrySchlickGGX(float NdotV,float roughness)
{
  float a=roughness;
  float k=(a*a)/2.;
  
  float nom=NdotV;
  float denom=NdotV*(1.-k)+k;
  
  return nom/denom;
}

float GeometrySmith(vec3 N,vec3 V,vec3 L,float roughness)
{
  float NdotV=max(dot(N,V),0.);
  float NdotL=max(dot(N,L),0.);
  float ggx2=GeometrySchlickGGX(NdotV,roughness);
  float ggx1=GeometrySchlickGGX(NdotL,roughness);
  
  return ggx1*ggx2;
}

vec3 fresnelSchlick(vec3 F0,vec3 V,vec3 H)
{
  return F0+(1.-F0)*pow(clamp(1.-max(dot(H,V),0.),0.,1.),5.);
}

void main(){
  // cook-torrance pbr
  vec3 color=pow(texture2D(uMap,vTextureCoord).rgb,vec3(2.2));
  vec3 lightColor=pow(uLightColor,vec3(2.2));
  vec3 ambientColor=pow(uAmbientColor,vec3(2.2));
  float roughness=pow(texture(uRoughnessMap,vTextureCoord).g,2.2);
  float metalness=pow(texture(uMetalnessMap,vTextureCoord).b,2.2);
  // float metalness=.5;
  
  vec3 albedo=vec3(.8);
  vec3 N=normalize(vNormal);
  vec3 V=normalize(uCameraPos-vFragPos);
  float NdotV=max(dot(N,V),0.);
  
  vec3 L=normalize(uLightDir);
  vec3 H=normalize(V+L);
  float NdotL=max(dot(N,L),0.);
  
  // 基础反射率
  vec3 F0=vec3(.04);
  F0=mix(F0,albedo,metalness);
  
  // 光照强度
  vec3 radiance=uLightRadiance*lightColor;
  
  // 法线分布函数
  float NDF=DistributionGGX(N,H,roughness);
  
  // 几何函数
  float G=GeometrySmith(N,V,L,roughness);
  
  // 菲涅尔函数
  vec3 F=fresnelSchlick(F0,V,H);
  
  // BRDF
  vec3 BRDF=NDF*G*F/max((4.*NdotL*NdotV),.001);
  
  // ambient
  vec3 ambient=ambientColor*color;
  
  // specular
  vec3 specular=vec3(0.);
  float ks=.8;
  specular+=BRDF*ks;
  
  // diffuse
  vec3 diffuse=vec3(0.);
  float kd=.2;
  diffuse+=kd*color/PI;
  
  // 阶梯化光照强度
  float dotNL_toon=smoothstep(.25,.27,NdotL)*pow(NdotL,.5)*1.4;
  dotNL_toon+=smoothstep(.75,.8,NdotL)*pow(NdotL,1.);
  
  // color = (brdf*ks + kd*color/PI)*radiance*NdotL
  vec3 radiance_out=(specular*dotNL_toon+diffuse)*radiance*NdotL*3000.;
  
  // 线性空间 =>非线性空间
  color=pow(radiance_out,vec3(1./2.2));
  
  // 添加外发光(类似于菲涅尔)
  float dotNL_reflect_faker=1.-smoothstep(0.,.3,NdotL);
  float fresnelTerm=dot(V,N);
  fresnelTerm=clamp(1.-fresnelTerm,0.,1.)*dotNL_reflect_faker;
  vec3 fresnelCol=vec3(.333,.902,3.418);
  vec3 outlight=fresnelCol*pow(fresnelTerm,4.5)*.8;
  
  // 颜色输出
  gl_FragColor=vec4(vec3(color+outlight),1.);
}