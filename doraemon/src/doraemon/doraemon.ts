import * as THREE from "three";
import type { EffectComposer } from "three-stdlib";
import { InteractionManager } from "three.interactive";

import { Clock, Resizer, Debug } from '../components'
import { Animator } from './animator'
import { downloadBlob } from "../utils";

export interface Baseconfig
{
  rendererparams: THREE.WebGLRendererParameters;
  debug: boolean
};

/** 继承该类可以简单的创建基础的threejs场景 */
export class Doraemon
{
  // 相机
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  // 场景
  scene: THREE.Scene
  // 渲染器
  renderer: THREE.WebGLRenderer
  // composer
  composer: EffectComposer | null
  // 容器
  dom: any
  // interaction
  interactionManager: InteractionManager
  // clock
  clock: Clock
  // resizer
  resizer: Resizer
  // debug
  debug: Debug
  // animator
  animator: Animator

  constructor(_dom, config: Partial<Baseconfig> = { debug: true })
  {
    // 获取容器
    const width = _dom.clientWidth
    const height = _dom.clientHeight

    // 创建renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      ...config.rendererparams
    })
    renderer.setSize(width, height)
    THREE.ColorManagement.enabled = false;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.useLegacyLights = true;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    this.renderer = renderer

    // rendererdom添加到容器
    _dom?.appendChild(this.renderer.domElement)
    this.dom = _dom

    // 创建scene
    this.scene = new THREE.Scene()

    // animator
    this.animator = new Animator(this)

    // 创建camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      width / height,
      0.01,
      100
    )
    this.camera.position.z = 1;

    // composer
    this.composer = null;

    // clock
    this.clock = new Clock(this);

    // resizer
    this.resizer = new Resizer(this);

    // debug 
    this.debug = new Debug(this, { debug: config.debug })
    // InteractionManager
    // const interactionManager = new InteractionManager(
    //   this.renderer,
    //   this.camera,
    //   this.renderer.domElement
    // );
    // this.interactionManager = interactionManager;

    // 添加监听
    this.addEventListeners()
    // render
    this.init()

  }

  // 添加监听
  addEventListeners()
  {
    this.resizer.listenForResize();
  }

  // 销毁场景中的物体
  destroy()
  {
    this.scene.traverse(_child =>
    {

      if (_child instanceof THREE.Mesh)
      {
        _child.geometry?.dispose();

        Object.values(_child.material).forEach((value: any) =>
        {
          if (value && typeof value.dispose === "function")
          {
            console.log(value)
            value.dispose();
          }
        });
      }
    })

    this.camera.clear()
    this.scene.clear()
  }

  init()
  {
    this.animator.update()
  }
  // 渲染
  render()
  {
    // 合成器与原renderer
    this.debug.update()
    this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera)
  }

  addUpdate(fn)
  {
    this.animator.addUpdate(fn)
  }

  async saveScreenshot(name = `screenshot.png`)
  {
    this.render()
    const blob: Blob | null = await new Promise(_data =>
    {
      this.renderer.domElement.toBlob(_data, "image/png");
    })
    if (blob)
    {
      downloadBlob(blob, name)
    }
  }
}