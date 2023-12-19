import * as THREE from 'three'
import { Component } from "./component"
import { Doraemon } from '../doraemon'

export class Clock extends Component
{
  clock: THREE.Clock
  deltaTime: number
  elapsedTime: number

  constructor(_doraemon: Doraemon)
  {
    super(_doraemon)

    this.clock = new THREE.Clock()
    this.deltaTime = 0
    this.elapsedTime = 0
  }

  addUpdate()
  {
    const newElapsedTime = this.clock.getElapsedTime();
    const deltaTime = newElapsedTime - this.elapsedTime;
    this.deltaTime = deltaTime;
    this.elapsedTime = newElapsedTime;
    this.emit("tick");
  }
}