import * as doraemon from 'doraemonjs'
import * as THREE from 'three'
import * as STDLIB from "three-stdlib";

import Experience from '../Experience'
import { meshList } from '../data/column'
import { groupBy, getToonMaterial } from '../utils';

export default class column extends doraemon.Component
{
  declare doraemon: Experience;
  meshInfos
  instanceInfos

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    // 将对象转化为属性格式
    this.meshInfos = meshList.map(item =>
    {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1),
        rotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(item.rotation[0], item.rotation[2], item.rotation[1])
        ),
        scale: new THREE.Vector3(
          item.scale[0],
          item.scale[2],
          item.scale[1]
        ).multiplyScalar(0.1)
      }
    })

    // groupby 将相同obj分成一组
    const meshGrouped = groupBy(this.meshInfos, item => item.object)

    // 获取instanceInfos
    this.instanceInfos = Object.entries(meshGrouped).map(([k, v]) =>
    {
      return {
        object: k,
        instanceList: v,
        meshList: [],
      }
    })

    // 添加meshList
    this.instanceInfos.forEach(item =>
    {
      const model = this.doraemon.assetManager.items[item.object] as STDLIB.GLTF

      // this.scene.add(model.scene)
      model.scene.traverse((mesh: THREE.Mesh) =>
      {
        if (mesh.isMesh)
        {
          const material = mesh.material as THREE.MeshStandardMaterial;
          const toonMaterial = getToonMaterial(material);
          // 创建实例化渲染实例，这里使用的是相同的几何体放置在不同位置
          const instanceMesh = new THREE.InstancedMesh(
            mesh.geometry,
            toonMaterial,
            item.instanceList.length
          )
          instanceMesh.castShadow = true
          instanceMesh.frustumCulled = true
          item.meshList.push(instanceMesh)
        }
      })
    })
  }

  addExisting()
  {
    this.instanceInfos.forEach(item =>
    {
      item.meshList.forEach(instanceMesh =>
      {
        this.scene.add(instanceMesh)
      })
    })
    this.updateInstance()
  }

  addUpdate(): void
  {
    // this.updateInstance()
  }

  updateInstance()
  {

    this.instanceInfos.forEach((item) =>
    {
      item.meshList.forEach((mesh) =>
      {
        item.instanceList.forEach((e, i) =>
        {
          const mat = new THREE.Matrix4();
          mat.compose(e.position, e.rotation, e.scale);
          mesh.setMatrixAt(i, mat);
        });
        mesh.instanceMatrix.needsUpdate = true;
      });
    });
  }
}