import * as THREE from 'three'
import _ from 'lodash'

import { Doraemon } from '../doraemon'
import { Component } from './component'

export interface ResizerConfig
{
  enabled: boolean
}

export class Resizer extends Component
{
  enabled: boolean
  width: number
  height: number

  constructor(_doraemon: Doraemon, config: Partial<ResizerConfig> = {})
  {
    super(_doraemon)

    this.enabled = true

    this.resize()
  }

  // renderer resize
  resizeRenderer(renderer: THREE.WebGLRenderer)
  {
    renderer.setSize(this.width, this.height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  }

  // camera resize
  resizeCamera(camera: THREE.Camera)
  {
    const { aspect } = this

    if (camera instanceof THREE.PerspectiveCamera)
    {
      camera.aspect = aspect
      camera.updateProjectionMatrix()
    }
  }

  // 重新调整camera renderer的尺寸
  resize()
  {
    const { renderer, camera, composer, dom } = this.doraemon
    this.width = dom.clientWidth
    this.height = dom.clientHeight

    this.resizeRenderer(renderer)

    this.resizeCamera(camera)
  }

  listenForResize()
  {
    // 添加防抖
    const debounceResize = _.debounce(this.resize.bind(this), 50)
    // 监听目标dom的size变化
    const resizeObserver = new ResizeObserver(() =>
    {
      debounceResize()
    })
    resizeObserver.observe(this.doraemon.dom)
  }

  get aspect()
  {
    return this.width / this.height
  }
}