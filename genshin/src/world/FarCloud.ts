import * as doraemon from 'doraemonjs'
import * as THREE from 'three'
import * as STDLIB from "three-stdlib";

import Experience from '../Experience'
// @ts-ignore
import farCloudVertexShader from '../shaders/farCloud/vertex.glsl'
// @ts-ignore
import farCloudBgFragmentShader from '../shaders/farCloud/fragment-bg.glsl'
// @ts-ignore
import farCloudFragmentShader from '../shaders/farCloud/fragment.glsl'


export default class FarCloud extends doraemon.Component
{
  model: STDLIB.GLTF
  constructor(_doraemon: Experience)
  {
    super(_doraemon)
    // 获取模型对象
    this.model = _doraemon.assetManager.items['SM_BigCloud'] as STDLIB.GLTF

    const material1 = new THREE.ShaderMaterial({
      vertexShader: farCloudVertexShader,
      fragmentShader: farCloudFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: _doraemon.assetManager.items['Tex_0063']
        }
      }
    })

    const material2 = new THREE.ShaderMaterial({
      vertexShader: farCloudVertexShader,
      fragmentShader: farCloudBgFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: _doraemon.assetManager.items['Tex_0067b']
        }
      }
    })

    this.model.scene.traverse((mesh: THREE.Mesh) =>
    {
      if (mesh.isMesh)
      {
        mesh.position.multiplyScalar(0.1);
        mesh.scale.multiplyScalar(0.1);
        mesh.renderOrder = -1;
        mesh.frustumCulled = true;
        if (mesh.name === "Plane011")
        {
          mesh.material = material1;
        } else
        {
          mesh.material = material2;
        }
      }
    })
  }

  addExisting(): void
  {
    this.scene.add(this.model.scene)
  }
}