import * as THREE from 'three'
import * as doraemon from 'doraemonjs'

import type Experience from "../Experience"

export default class AmbientLight extends doraemon.Component
{
  declare doraemon: Experience
  ambientLight: THREE.AmbientLight
  params
  debugFolder

  constructor(_doraemon: Experience)
  {
    super(_doraemon)

    this.params = {
      color: 0xffffff,
      intensity: 1
    }

    this.ambientLight = new THREE.AmbientLight(
      this.params.color,
      this.params.intensity
    )

    this.createDebug()
  }

  addExisting()
  {
    this.scene.add(this.ambientLight)
  }

  createDebug()
  {
    const debug = this.doraemon.debug
    const params = this.params

    this.debugFolder = debug.pane.addFolder({
      title: 'directLight',
      expended: true
    })

    this.debugFolder.addInput(
      this.params,
      'color',
      {
        view: 'color'
      }).on('change', (val: number) =>
      {
        this.ambientLight.color = new THREE.Color(val)
      })

    this.debugFolder.addInput(
      this.ambientLight,
      'intensity',
      {
        label: 'intensity', min: 0, max: 10
      }
    )
  }
}