import * as doraemon from "doraemonjs";
import * as THREE from "three";
import gsap from "gsap";

import type Experience from "../Experience";

type Direction = 'front' | 'back' | 'left' | 'right'

type Params = {
  speed: number;
  direction: Direction;
  isRun: boolean;
}

export default class FirstCamera extends doraemon.Component
{
  declare doraemon: Experience
  params: Params
  t1: ReturnType<typeof gsap.timeline>
  center

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    // 相机状态
    this.params = {
      speed: 0,
      direction: 'front',
      isRun: true
    }

    // 相机中心坐标
    this.center = new THREE.Vector3(0, 0, 0)

    this.t1 = gsap.timeline()
  }

  setSpeed(_speed: number)
  {
    this.params.speed = _speed
  }

  setDirection(_direction)
  {
    this.params.direction = _direction
  }

  getCenter()
  {
    return this.center
  }

  firstToThird()
  {

  }

  addUpdate(): void
  {
    if (this.params.isRun && Math.abs(this.center.x) < 21)
    {
      // 获取deltaTime
      const delta = this.doraemon.clock.deltaTime
      // 判断方向
      switch (this.params.direction)
      {
        case 'front':
          this.center.add(
            new THREE.Vector3(0, 0, -this.params.speed).multiplyScalar(delta)
          )
          break
        case 'back':
          this.center.add(
            new THREE.Vector3(0, 0, 0).multiplyScalar(delta)
          )
          break
        case 'left':
          this.center.add(
            new THREE.Vector3(-this.params.speed, 0, 0).multiplyScalar(delta)
          )
          break
        case 'right':
          this.center.add(
            new THREE.Vector3(this.params.speed, 0, 0).multiplyScalar(delta)
          )
          break
        default:
          break
      }

      // 调整相机位置
      this.doraemon.camera.position.copy(this.center)
    }
  }
}