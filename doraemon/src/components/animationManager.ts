import * as THREE from "three"

import { Component } from "./component"
import { Doraemon } from '../doraemon'

export class AnimationManager extends Component
{
  declare doraemon: Doraemon;
  clips: THREE.AnimationClip[]
  root: THREE.Object3D
  mixer: THREE.AnimationMixer

  constructor(_doraemon: Doraemon, _clips: THREE.AnimationClip[], _root: THREE.Object3D)
  {
    super(_doraemon)

    this.clips = _clips
    this.root = _root
    this.mixer = new THREE.AnimationMixer(_root)
  }

  get names()
  {
    return this.clips.map(item => item.name)
  }

  get actions()
  {
    return Object.fromEntries(
      this.clips.map(item => [item.name, this.mixer.clipAction(item)])
    )
  }

  addUpdate(): void
  {
    this.mixer.update(this.doraemon.clock.deltaTime)
  }
}