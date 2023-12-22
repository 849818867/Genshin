import * as THREE from 'three'
import * as doraemon from 'doraemonjs'

import type Experience from "../Experience"

export default class DirectLight extends doraemon.Component
{
  declare doraemon: Experience
  dirLight: THREE.DirectionalLight
  params
  target
  originPos
  debugFolder

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    this.params = {
      color: 0xff6222,
      intensity: 35
    }

    const dirLight = new THREE.DirectionalLight(
      this.params.color,
      this.params.intensity
    )
    this.dirLight = dirLight

    // 设置阴影
    dirLight.castShadow = true
    // 设置shadowmap尺寸
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    // 设置shadowmap相机参数
    dirLight.shadow.camera.top = 400
    dirLight.shadow.camera.bottom = -100
    dirLight.shadow.camera.left = -100
    dirLight.shadow.camera.right = 400
    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 50000
    // bias修正shadermap导致的锯齿
    dirLight.shadow.bias = -0.00005

    // 直射光目标物
    const target = new THREE.Object3D()
    this.target = target
    dirLight.target = target

    const originPos = new THREE.Vector3(10000, 0, 6000)
    originPos.y = Math.hypot(originPos.x, originPos.z) / 1.35
    this.originPos = originPos
    // 相机位置
    this.createDebug()
  }

  addExisting()
  {
    this.scene.add(this.dirLight)
    this.scene.add(this.target)
  }

  addUpdate(): void
  {
    // 太阳光源随着相机位置移动
    this.dirLight.position.copy(
      this.doraemon.camera.position.clone().add(this.originPos)
    )
    this.dirLight.target.position.copy(this.doraemon.camera.position)
  }

  createDebug()
  {
    const debug = this.doraemon.debug
    const params = this.params

    this.debugFolder = debug?.pane?.addFolder({
      title: 'directLight',
      expended: true
    })

    this.debugFolder?.addInput(
      this.params,
      'color',
      {
        view: 'color'
      }).on('change', (val: number) =>
      {
        this.dirLight.color.copy(new THREE.Color(val))
      })

    this.debugFolder?.addInput(
      this.dirLight,
      'intensity',
      {
        label: 'intensity', min: 0, max: 100
      }
    )
  }
}