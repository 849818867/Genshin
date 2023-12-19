import * as doraemon from 'doraemonjs'
import * as THREE from 'three'

import Experience from '../Experience'
// @ts-ignore
import fragmentShader from '../shaders/fog/fragment.glsl'
// @ts-ignore
import vertexShader from '../shaders/fog/vertex.glsl'

export default class Fog extends doraemon.Component
{
  declare doraemon: Experience
  uniformInjector
  material
  mesh

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    // 创建平面几何体
    const geometry = new THREE.PlaneGeometry(1000, 1000)

    // uniformInjector
    const uniformInjector = new doraemon.UniformInjector(_doraemon)
    this.uniformInjector = uniformInjector

    // 材质
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uniformInjector.shaderUniforms
      }
    })
    this.material = material

    // 组装mesh
    const mesh = new THREE.Mesh(geometry, material)
    this.mesh = mesh
    this.mesh.position.z = -400;
    this.mesh.frustumCulled = true;
  }

  addExisting()
  {
    this.doraemon.scene.add(this.mesh)
  }

  addUpdate(): void
  {
    this.uniformInjector.injectShaderUniforms(this.material.uniforms)

    // 让mesh跟着相机移动
    this.mesh.position.copy(
      new THREE.Vector3(0, 0, this.doraemon.camera.position.z - 400)
    )
  }

}