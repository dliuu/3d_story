import { EventEmitter } from './EventEmitter.js'
import { FLOORS } from './constants.js'

export class FloorTracker extends EventEmitter {
  constructor() {
    super()
    this.activeFloorIndex = 0
  }

  update(progress) {
    const seg = 1 / FLOORS.length
    const next = Math.min(Math.floor(progress / seg), FLOORS.length - 1)
    if (next !== this.activeFloorIndex) {
      this.activeFloorIndex = next
      this.emit('floorChange', next)
    }
  }
}
