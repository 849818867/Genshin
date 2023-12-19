import * as doraemon from "doraemonjs";
import * as THREE from "three";
import * as POSTPROCESSING from "postprocessing";
import gsap from "gsap";

import type Experience from "./Experience";

import BloomTranstionEffect from "./effect/BloomEffect";

export default class Postprogressing extends doraemon.Component
{
  declare doraemon: Experience;
  composer
  params

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    // 创建后期处理参数
    this.params = {
      dofBokehScale: 0,
      dofFocusDistance: 0,
      dofFocalLength: 0.05,
    }

    // 创建合成器
    const composer = new POSTPROCESSING.EffectComposer(this.doraemon.renderer, {
      frameBufferType: THREE.HalfFloatType,
      multisampling: 8
    })
    this.composer = composer

    // 添加常规渲染pass
    composer.addPass(
      new POSTPROCESSING.RenderPass(this.doraemon.scene, this.doraemon.camera)
    )

    // 创建bloom tonemapping pass
    const bloom = new POSTPROCESSING.BloomEffect({
      blendFunction: POSTPROCESSING.BlendFunction.ADD,
      mipmapBlur: true,
      luminanceThreshold: 2,
      intensity: 0.6,
    });

    const tonemapping = new POSTPROCESSING.ToneMappingEffect({
      mode: POSTPROCESSING.ToneMappingMode.ACES_FILMIC,
    });

    const effectPass = new POSTPROCESSING.EffectPass(
      this.doraemon.camera,
      bloom,
      tonemapping
    );

    composer.addPass(effectPass)
  }
}