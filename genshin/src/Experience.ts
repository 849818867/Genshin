import * as doraemon from 'doraemonjs'
import * as THREE from "three";

import { resources } from "./Resources";
import World from './world/World';
import Postprogressing from './Processing'

export default class Experience extends doraemon.Doraemon 
{
  // 静态实例
  static instance: null | Experience

  // 资源管理器
  assetManager
  // world
  world

  constructor(_dom, progressValue)
  {
    // 单例模式，保证只有一个实例
    if (Experience.instance)
    {
      return Experience.instance
    }

    super(_dom, { debug: false })

    Experience.instance = this

    this.assetManager = new doraemon.AssetManager(this, resources, {
      useDracoLoader: true,
    })

    this.assetManager.on('load-progress', (_progress) =>
    {
      progressValue.value = _progress
    })

    // 设置相机
    this.camera.position.set(0, 0, 0);
    const camera = this.camera as THREE.PerspectiveCamera;
    camera.fov = 45;
    camera.near = 10;
    camera.far = 100000;
    camera.rotation.x = THREE.MathUtils.degToRad(5.5);
    camera.updateProjectionMatrix();

    doraemon.enableShadow(this.renderer)

    // 创建场景
    this.world = new World(this);

    // 启用合成器 添加后处理
    this.composer = new Postprogressing(this).composer
  }
}