export class EventEmitter {
  constructor() {
    this._listeners = {}
  }

  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = new Set()
    this._listeners[event].add(fn)
    return () => this.off(event, fn)
  }

  off(event, fn) {
    this._listeners[event]?.delete(fn)
  }

  emit(event, ...args) {
    const set = this._listeners[event]
    if (!set) return
    for (const fn of set) fn(...args)
  }
}

