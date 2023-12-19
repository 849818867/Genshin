import * as THREE from 'three'
import * as doraemon from 'doraemonjs'

import type Experience from "../Experience"

// @ts-ignore
import fragmentShader from '../shaders/stars/fragment.glsl'
// @ts-ignore
import vertexShader from '../shaders/stars/vertex.glsl'

export default class Stars extends doraemon.Component
{
  declare doraemon: Experience
  uniformInjector
  material
  points

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    // 数量
    const count = 1000
    // 创建几何体缓冲区
    const geometry = new THREE.BufferGeometry()
    // 创建随机位置
    let positions = Float32Array.from(
      Array.from({ length: count }, () =>
        [2500, 2500, 300].map(THREE.MathUtils.randFloatSpread)
      ).flat()
    )
    // 几何体顶点填充坐标
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    // 添加arandom
    const randoms = Float32Array.from(
      Array.from({ length: count }, () => [1, 1, 1].map(Math.random)).flat()
    );
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));


    // uniformInjector
    const uniformInjector = new doraemon.UniformInjector(_doraemon)
    this.uniformInjector = uniformInjector

    // 创建材质
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      // depthWrite: false,
      uniforms: {
        ...uniformInjector.shaderUniforms,
        uPointSize: {
          value: 10000,
        },
        uPixelRatio: {
          value: this.doraemon.renderer.getPixelRatio(),
        },
        uTexture: {
          value: this.doraemon.assetManager.items["Tex_0075"],
        },
      }
    })
    this.material = material;

    // 创建points mesh
    const points = new THREE.Points(geometry, material)
    this.points = points
    this.points.position.set(0, 0, -1000)
    // this.points.frustumCulled = false
  }

  addExisting()
  {
    this.doraemon.scene.add(this.points)
  }

  addUpdate(): void
  {
    this.uniformInjector.injectShaderUniforms(this.material.uniforms)

    // 使物体紧跟相机
    this.points.position.copy(
      new THREE.Vector3(
        this.doraemon.camera.position.x,
        this.doraemon.camera.position.y,
        this.doraemon.camera.position.z - 200
      )
    )
  }
}