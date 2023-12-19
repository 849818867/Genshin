import * as THREE from "three"

import { Component } from './component'
import { Doraemon } from '../doraemon'

export class UniformInjector extends Component
{
  shaderUniforms: { [key: string]: THREE.IUniform<any> }

  constructor(_doraemon: Doraemon)
  {
    super(_doraemon)

    const dom = _doraemon.dom

    this.shaderUniforms = {
      uGlobalTime: {
        value: 0
      },
      uTime: {
        value: 0
      },
      uTimeDelta: {
        value: 0
      },
      uResolution: {
        value: new THREE.Vector3(dom.clientWidth, dom.clientHeight, 1)
      },
    }
  }

  // 注入uniform变量
  injectShaderUniforms(uniforms: { [key: string]: THREE.IUniform<any> } = this.shaderUniforms)
  {
    const { elapsedTime, deltaTime } = this.doraemon.clock

    // 时间赋值
    uniforms.uGlobalTime.value = elapsedTime
    uniforms.uTime.value = elapsedTime
    uniforms.uTimeDelta.value = deltaTime

  }
}