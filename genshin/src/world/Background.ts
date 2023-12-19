import * as doraemon from 'doraemonjs'
import * as THREE from 'three'

import Experience from '../Experience'
// @ts-ignore
import fragmentShader from '../shaders/background/fragment.glsl'

export default class Background extends doraemon.Component
{
  params
  backgroundPlane

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    // 背景颜色层参数
    this.params = {
      color1: "#001c54",
      color2: "#023fa1",
      color3: "#26a8ff",
      stop1: 0.2,
      stop2: 0.6,
    };

    this.backgroundPlane = new doraemon.ScreenPlane(_doraemon, {
      fragmentShader,
      uniforms: {
        uColor1: {
          value: new THREE.Color(this.params.color1)
        },
        uColor2: {
          value: new THREE.Color(this.params.color2)
        },
        uColor3: {
          value: new THREE.Color(this.params.color3)
        },
        uStop1: {
          value: this.params.stop1
        },
        uStop2: {
          value: this.params.stop2
        },
        ...new doraemon.UniformInjector(_doraemon).shaderUniforms,
      }
    })

    const mesh = this.backgroundPlane.mesh;
    mesh.position.z = -1000;
    mesh.renderOrder = -1;
    mesh.frustumCulled = false;

    const material = this.backgroundPlane.mesh.material as THREE.ShaderMaterial;
    material.depthWrite = false;

  }
  addExisting(): void
  {
    this.backgroundPlane.addExisting();
  }
}