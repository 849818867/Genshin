import { Pane } from 'tweakpane'
import StatsImpl from "stats.js"

import { Doraemon } from '../doraemon'

export class Debug
{
  pane: any
  stats: StatsImpl

  constructor(_doraemon: Doraemon, _config = { debug: true })
  {
    const { debug } = _config
    if (debug)
    {
      this.pane = new Pane()
      this.stats = new StatsImpl()

      _doraemon.dom.appendChild(this.stats.dom)
    }

    // this.pane.containerElem_.style.width = "320px"
  }

  update()
  {
    if (this.stats)
      this.stats.update();
  }
}