import mitt, { type Emitter } from "mitt";

import type { Doraemon } from "../doraemon";

export class Component
{
  doraemon: Doraemon | any
  emitter: Emitter<any>
  scene: THREE.Scene

  constructor(_doraemon: Doraemon | any)
  {
    this.doraemon = _doraemon

    this.emitter = mitt()

    this.scene = this.doraemon.scene

    this.doraemon.addUpdate(this.addUpdate.bind(this))
  }

  // update 
  addUpdate()
  {
    1 + 1;
  }
  // 监听事件
  on(type: string, handler: any)
  {
    this.emitter.on(type, handler);
  }
  // 移除事件
  off(type: string, handler: any)
  {
    this.emitter.off(type, handler);
  }
  // 触发事件
  emit(type: string, event: any = {})
  {
    this.emitter.emit(type, event);
  }
}