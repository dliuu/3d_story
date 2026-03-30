import { FLOOR_COUNT } from './constants.js'

export class FloorTracker {
  constructor() {
    this.activeFloorIndex = 0
  }

  getFloorIndex(progress) {
    const p = Math.min(1, Math.max(0, progress))
    const idx = Math.floor(p * FLOOR_COUNT)
    return Math.min(FLOOR_COUNT - 1, idx)
  }

  update(progress) {
    const next = this.getFloorIndex(progress)
    const changed = next !== this.activeFloorIndex
    this.activeFloorIndex = next
    return changed
  }
}
