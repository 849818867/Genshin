import * as THREE from 'three'
import * as doraemon from 'doraemonjs'
import * as STDLIB from "three-stdlib"
import gsap from "gsap"

import type Experience from "../Experience"
import { getToonMaterialRoad, getToonMaterialDoor } from '../utils'

export default class Road extends doraemon.Component
{
  declare doraemon: Experience;
  model
  offset
  isDoorCreateActive
  firstCamera
  roadCount
  zLength
  originPosList
  animationManager
  door

  constructor(_doraemon: Experience, _firstCamera)
  {
    super(_doraemon)

    this.isDoorCreateActive = false;
    this.firstCamera = _firstCamera

    // 获取模型
    const model = this.doraemon.assetManager.items["SM_Road"] as STDLIB.GLTF
    this.model = model

    model.scene.traverse((mesh: THREE.Mesh) =>
    {
      if (mesh.isMesh)
      {
        mesh.receiveShadow = true
        const material = mesh.material as THREE.MeshStandardMaterial
        const toonMaterial = getToonMaterialRoad(material, this.doraemon.renderer);
        mesh.material = toonMaterial
        mesh.frustumCulled = true;
      }
    })

    // 创建偏移
    this.offset = new THREE.Vector3(0, 34, 200)

    // 调整模型位置，size
    model.scene.children.forEach((obj: THREE.Mesh) =>
    {
      obj.position.multiplyScalar(0.1);
      obj.scale.multiplyScalar(0.1);
      obj.position.sub(this.offset);
    })

    const zLength = 212.4027;
    const roadCount = model.scene.children.length;
    this.roadCount = roadCount;

    // 克隆一批相同的路块，把它们放在后面
    for (let i = 0; i < roadCount; i++)
    {
      const cloned = model.scene.children[i].clone();
      cloned.position.add(new THREE.Vector3(0, 0, -zLength));
      model.scene.add(cloned);
    }

    this.zLength = zLength * 2;

    // 把路的原始位置存起来
    this.originPosList = [];
    this.model.scene.children.forEach((item) =>
    {
      this.originPosList.push(item.position.clone());
    });
  }

  addExisting()
  {
    this.doraemon.scene.add(this.model.scene)
  }

  // 激活传送门
  activeDoor()
  {
    // 获取最前面的路块
    // const lastRoad = this.model.scene.children[this.roadCount - 1]
    const doorPosition = this.doraemon.camera.position

    this.createDoor(doorPosition.z + 140);

    // 发送事件
    this.emit("stop-camera");
  }

  // 创建传送门
  async createDoor(_z: number)
  {
    const door = this.doraemon.assetManager.items['DOOR'] as STDLIB.GLTF
    this.door = door
    // 设置传送门材质
    door.scene.traverse((_mesh: THREE.Mesh) =>
    {
      if (_mesh.isMesh)
      {
        _mesh.receiveShadow = true
        _mesh.castShadow = true
        const material = _mesh.material as THREE.MeshStandardMaterial
        const toonMaterial = getToonMaterialDoor(material)
        _mesh.material = toonMaterial
      }
    })
    door.scene.scale.set(0.1, 0.1, 0.04)

    // 计算传送门偏移
    const offset = new THREE.Vector3().copy(
      new THREE.Vector3(0, -this.offset.y, _z - this.zLength)
    )
    door.scene.position.copy(offset);

    // 将们添加到场景中
    this.doraemon.scene.add(door.scene)

    // 创建animationManager
    const animationManager = new doraemon.AnimationManager(
      this.doraemon,
      door.animations,
      door.scene)

    this.animationManager = animationManager;

    for (const action of Object.values(this.animationManager.actions))
    {
      // @ts-ignore
      action.setLoop(THREE.LoopOnce, 1);
      // @ts-ignore
      action.play();
    }
    // 执行完拼合门后停止
    await doraemon.sleep(1458);
    for (const action of Object.values(this.animationManager.actions))
    {
      // @ts-ignore
      action.paused = true;
    }
    this.createWhitePlane()
  }

  // 打开传送门
  async openDoor()
  {
    // 继续动画
    for (const action of Object.values(this.animationManager.actions))
    {
      // @ts-ignore
      action.paused = false;
    }

    // 等待300ms
    await doraemon.sleep(300);

    // 停止动画
    for (const action of Object.values(this.animationManager.actions))
    {
      // @ts-ignore
      action.paused = true;
    }
  }

  createWhitePlane()
  {
    const plane = this.doraemon.assetManager.items["WHITE_PLANE"] as STDLIB.GLTF
    plane.scene.scale.setScalar(0.1)
    plane.scene.position.copy(this.door.scene.position)

    plane.scene.traverse((_mesh: THREE.Mesh) =>
    {
      if (_mesh.isMesh)
      {
        const material = _mesh.material as THREE.MeshStandardMaterial;
        material.color = new THREE.Color("#ffffff").multiplyScalar(3);
      }
    })
    this.doraemon.scene.add(plane.scene)
  }

  addUpdate()
  {
    if (this.firstCamera.params.speed !== 0)
    {
      this.model.scene.children.forEach((item, i) =>
      {
        if (item.position.z > this.doraemon.camera.position.z)
        {
          // 将走过的路快移动到前方
          const zOffset = new THREE.Vector3(0, 0, this.zLength)
          item.position.sub(zOffset)
          this.originPosList[i].sub(zOffset)

          // 设置路块上浮
          const originPos = this.originPosList[i].clone()
          item.position.add(new THREE.Vector3(0, -70, 0))
          gsap.to(item.position, {
            x: originPos.x,
            y: originPos.y,
            z: originPos.z,
            duration: 2,
            ease: "back.out"
          })
        }
      })
    }
  }
}