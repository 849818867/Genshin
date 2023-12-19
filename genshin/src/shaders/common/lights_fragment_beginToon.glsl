// https://ycw.github.io/three-shaderlib-skim/dist/#/latest/standard/fragment
// 将原本的RE_Direct转为自定义的RE_Direct_ToonPhysical
vec3 geometryPosition=-vViewPosition;
vec3 geometryNormal=normal;
vec3 geometryViewDir=(isOrthographic)?vec3(0,0,1):normalize(vViewPosition);
vec3 geometryClearcoatNormal;
#ifdef USE_CLEARCOAT
geometryClearcoatNormal=clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
float dotNVi=saturate(dot(normal,geometryViewDir));
if(material.iridescenceThickness==0.){
  material.iridescence=0.;
}else{
  material.iridescence=saturate(material.iridescence);
}
if(material.iridescence>0.){
  material.iridescenceFresnel=evalIridescence(1.,material.iridescenceIOR,dotNVi,material.iridescenceThickness,material.specularColor);
  material.iridescenceF0=Schlick_to_F0(material.iridescenceFresnel,1.,dotNVi);
}
#endif
IncidentLight directLight;
#if(NUM_POINT_LIGHTS>0)&&defined(RE_Direct)
PointLight pointLight;
#if defined(USE_SHADOWMAP)&&NUM_POINT_LIGHT_SHADOWS>0
PointLightShadow pointLightShadow;
#endif
#pragma unroll_loop_start
for(int i=0;i<NUM_POINT_LIGHTS;i++){
  pointLight=pointLights[i];
  getPointLightInfo(pointLight,geometryPosition,directLight);
  #if defined(USE_SHADOWMAP)&&(UNROLLED_LOOP_INDEX<NUM_POINT_LIGHT_SHADOWS)
  pointLightShadow=pointLightShadows[i];
  directLight.color*=(directLight.visible&&receiveShadow)?getPointShadow(pointShadowMap[i],pointLightShadow.shadowMapSize,pointLightShadow.shadowBias,pointLightShadow.shadowRadius,vPointShadowCoord[i],pointLightShadow.shadowCameraNear,pointLightShadow.shadowCameraFar):1.;
  #endif
  RE_Direct(directLight,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,material,reflectedLight);
}
#pragma unroll_loop_end
#endif
#if(NUM_SPOT_LIGHTS>0)&&defined(RE_Direct)
SpotLight spotLight;
vec4 spotColor;
vec3 spotLightCoord;
bool inSpotLightMap;
#if defined(USE_SHADOWMAP)&&NUM_SPOT_LIGHT_SHADOWS>0
SpotLightShadow spotLightShadow;
#endif
#pragma unroll_loop_start
for(int i=0;i<NUM_SPOT_LIGHTS;i++){
  spotLight=spotLights[i];
  getSpotLightInfo(spotLight,geometryPosition,directLight);
  #if(UNROLLED_LOOP_INDEX<NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS)
  #define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
  #elif(UNROLLED_LOOP_INDEX<NUM_SPOT_LIGHT_SHADOWS)
  #define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
  #else
  #define SPOT_LIGHT_MAP_INDEX(UNROLLED_LOOP_INDEX-NUM_SPOT_LIGHT_SHADOWS+NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS)
  #endif
  #if(SPOT_LIGHT_MAP_INDEX<NUM_SPOT_LIGHT_MAPS)
  spotLightCoord=vSpotLightCoord[i].xyz/vSpotLightCoord[i].w;
  inSpotLightMap=all(lessThan(abs(spotLightCoord*2.-1.),vec3(1.)));
  spotColor=texture2D(spotLightMap[SPOT_LIGHT_MAP_INDEX],spotLightCoord.xy);
  directLight.color=inSpotLightMap?directLight.color*spotColor.rgb:directLight.color;
  #endif
  #undef SPOT_LIGHT_MAP_INDEX
  #if defined(USE_SHADOWMAP)&&(UNROLLED_LOOP_INDEX<NUM_SPOT_LIGHT_SHADOWS)
  spotLightShadow=spotLightShadows[i];
  directLight.color*=(directLight.visible&&receiveShadow)?getShadow(spotShadowMap[i],spotLightShadow.shadowMapSize,spotLightShadow.shadowBias,spotLightShadow.shadowRadius,vSpotLightCoord[i]):1.;
  #endif
  RE_Direct(directLight,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,material,reflectedLight);
}
#pragma unroll_loop_end
#endif
#if(NUM_DIR_LIGHTS>0)&&defined(RE_Direct)
DirectionalLight directionalLight;
#if defined(USE_SHADOWMAP)&&NUM_DIR_LIGHT_SHADOWS>0
DirectionalLightShadow directionalLightShadow;
#endif
#pragma unroll_loop_start
for(int i=0;i<NUM_DIR_LIGHTS;i++){
  directionalLight=directionalLights[i];
  getDirectionalLightInfo(directionalLight,directLight);
  #if defined(USE_SHADOWMAP)&&(UNROLLED_LOOP_INDEX<NUM_DIR_LIGHT_SHADOWS)
  directionalLightShadow=directionalLightShadows[i];
  directLight.color*=(directLight.visible&&receiveShadow)?getShadow(directionalShadowMap[i],directionalLightShadow.shadowMapSize,directionalLightShadow.shadowBias,directionalLightShadow.shadowRadius,vDirectionalShadowCoord[i]):1.;
  #endif
  // RE_Direct(directLight,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,material,reflectedLight);
  RE_Direct_ToonPhysical(directLight,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,material,reflectedLight,metalnessFactor);
}
#pragma unroll_loop_end
#endif
#if(NUM_RECT_AREA_LIGHTS>0)&&defined(RE_Direct_RectArea)
RectAreaLight rectAreaLight;
#pragma unroll_loop_start
for(int i=0;i<NUM_RECT_AREA_LIGHTS;i++){
  rectAreaLight=rectAreaLights[i];
  RE_Direct_RectArea(rectAreaLight,geometryPosition,geometryNormal,geometryViewDir,geometryClearcoatNormal,material,reflectedLight);
}
#pragma unroll_loop_end
#endif
#if defined(RE_IndirectDiffuse)
vec3 iblIrradiance=vec3(0.);
vec3 irradiance=getAmbientLightIrradiance(ambientLightColor);
#if defined(USE_LIGHT_PROBES)
irradiance+=getLightProbeIrradiance(lightProbe,geometryNormal);
#endif
#if(NUM_HEMI_LIGHTS>0)
#pragma unroll_loop_start
for(int i=0;i<NUM_HEMI_LIGHTS;i++){
  irradiance+=getHemisphereLightIrradiance(hemisphereLights[i],geometryNormal);
}
#pragma unroll_loop_end
#endif
#endif
#if defined(RE_IndirectSpecular)
vec3 radiance=vec3(0.);
vec3 clearcoatRadiance=vec3(0.);
#endif