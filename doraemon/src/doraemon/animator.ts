import type { Doraemon } from './doraemon'

export class Animator
{
  doraemon
  animationList: Array<any>

  constructor(_doraemon: Doraemon)
  {
    this.doraemon = _doraemon
    this.animationList = []
  }

  // 添加animation
  addUpdate(fn: any)
  {
    this.animationList.push(fn)
  }

  // update
  update()
  {
    this.doraemon.renderer.setAnimationLoop((time: number) =>
    {
      this.tick(time)
      this.doraemon.render()
    })
  }

  // 调用animationList
  tick(time = 0)
  {
    this.animationList.forEach(task =>
    {
      task(time)
    })
  }
}