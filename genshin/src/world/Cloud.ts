import * as THREE from 'three'
import * as doraemon from 'doraemonjs'

import type Experience from "../Experience"
import { meshList } from '../data/cloud'

//@ts-ignore
import vertexShader from '../shaders/cloud/vertex.glsl'
//@ts-ignore
import fragmentShader from '../shaders/cloud/fragment.glsl'

export default class Cloud extends doraemon.Component
{
  declare doraemon: Experience
  params
  meshInfos
  material
  uniformInjector
  instanceMesh

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    this.params = {
      color1: "#00a2f0",
      color2: "#f0f0f5",
    };

    // 转化所有物体的属性格式
    this.meshInfos = meshList.map(item =>
    {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1),
        rotation: new THREE.Quaternion(),
        scale: new THREE.Vector3(1, 1, 1)
      }
    })

    // 安装深度进行排序
    this.meshInfos.sort((a, b) =>
    {
      return a.position.z - b.position.z;
    });

    // 创建几何体
    const geometry = new THREE.PlaneGeometry(3000, 1500)

    // 创建材质
    const uniformInjector = new doraemon.UniformInjector(_doraemon)
    this.uniformInjector = uniformInjector

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uniformInjector.shaderUniforms,
        uTexture: {
          value: this.doraemon.assetManager.items["Tex_0062"]
        },
        uColor1: {
          value: new THREE.Color(this.params.color1)
        },
        uColor2: {
          value: new THREE.Color(this.params.color2)
        },
      }
    })
    this.material = material

    // 创建实例化渲染对象
    const instanceMesh = new THREE.InstancedMesh(
      geometry,
      material,
      meshList.length
    )
    this.instanceMesh = instanceMesh
    this.instanceMesh.frustumCulled = true;

    this.createDebug()
  }

  addExisting()
  {
    this.scene.add(this.instanceMesh)
    this.updateInstance()
  }

  // 设置实例化渲染的物体属性
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
  createDebug()
  {

  }
}