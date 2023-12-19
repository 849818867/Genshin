import * as THREE from 'three'
import * as doraemon from 'doraemonjs'
import * as STDLIB from "three-stdlib"

import type Experience from "../Experience"
import { meshList } from '../data/polarLight'

// @ts-ignore
import vertexShader from '../shaders/polar/vertex.glsl'
// @ts-ignore
import fragmentShader from '../shaders/polar/fragment.glsl'

export default class PolarLight extends doraemon.Component
{
  declare doraemon: Experience
  debugFolder
  meshInfos
  instanceMesh
  material
  uniformsInjector

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    // 转换为属性格式
    const meshInfos = meshList.map(item =>
    {
      return {
        Object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1),
        rotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(item.rotation[0], -item.rotation[1], item.rotation[2])
        ),
        scale: new THREE.Vector3(0.1, 0.1, 0.1)
      }
    })

    // 根据深度潘排序
    meshInfos.sort((a, b) =>
    {
      return a.position.z - b.position.z;
    });

    this.meshInfos = meshInfos

    // 获取模型数据
    const model = this.doraemon.assetManager.items["SM_Light"] as STDLIB.GLTF;
    const mesh = model.scene.children[0] as THREE.Mesh;
    const geometry = mesh.geometry;
    const tex = this.doraemon.assetManager.items["Tex_0071"] as THREE.Texture;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    const uniformsInjector = new doraemon.UniformInjector(_doraemon)
    this.uniformsInjector = uniformsInjector
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uniformsInjector.shaderUniforms,
        uTexture: {
          value: tex,
        },
      }
    })
    this.material = material

    // 实例化渲染对象
    const instanceMesh = new THREE.InstancedMesh(
      geometry,
      material,
      meshInfos.length
    )
    this.instanceMesh = instanceMesh
    this.instanceMesh.frustumCulled = true
  }

  addExisting()
  {
    this.doraemon.scene.add(this.instanceMesh)
    this.updateInstance()
  }

  addUpdate(): void
  {
    this.uniformsInjector.injectShaderUniforms(this.material.uniforms)
  }

  updateInstance()
  {
    this.meshInfos.forEach((item, i) =>
    {
      const mat = new THREE.Matrix4()
      mat.compose(item.position, item.rotation, item.scale)
      this.instanceMesh.setMatrixAt(i, mat)
    })
    this.instanceMesh.instanceMatrix.needsUpdate = true
  }
}