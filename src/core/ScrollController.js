import gsap from 'gsap'
import { MAX_TOWER_Y } from './constants.js'

const DAMPING = 0.06
const SCROLL_SPEED = 0.0008

export class ScrollController {
  constructor() {
    this.enabled = false
    this.targetProgress = 0
    this.progress = 0
    this.scrollSpeed = SCROLL_SPEED
    this._tw = null

    this._onWheel = this._onWheel.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)
    this._touch = { active: false, lastY: 0 }

    window.addEventListener('wheel', this._onWheel, { passive: false })
    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: true })
    window.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false })
    window.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: true })
  }

  _onWheel(e) {
    if (!this.enabled) return
    e.preventDefault()
    const delta = e.deltaY * this.scrollSpeed
    this.targetProgress = Math.min(1, Math.max(0, this.targetProgress + delta))
  }

  _onKeyDown(e) {
    if (!this.enabled) return
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault()
      this.targetProgress = Math.min(1, this.targetProgress + 0.08)
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      this.targetProgress = Math.max(0, this.targetProgress - 0.08)
    } else if (e.key === 'Home') {
      e.preventDefault()
      this.targetProgress = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      this.targetProgress = 1
    }
  }

  _onTouchStart(e) {
    if (!e.touches.length) return
    this._touch.active = true
    this._touch.lastY = e.touches[0].clientY
  }

  _onTouchMove(e) {
    if (!this.enabled || !this._touch.active || !e.touches.length) return
    e.preventDefault()
    const y = e.touches[0].clientY
    const dy = this._touch.lastY - y
    this._touch.lastY = y
    this.targetProgress = Math.min(1, Math.max(0, this.targetProgress + dy * this.scrollSpeed * 1.2))
  }

  _onTouchEnd() {
    this._touch.active = false
  }

  update() {
    if (this._tw) return
    this.progress += (this.targetProgress - this.progress) * DAMPING
  }

  getTowerY() {
    return -(this.progress * MAX_TOWER_Y)
  }

  /** @param {number} target — 0–1 progress */
  goTo(target, duration = 1.2) {
    const t = Math.min(1, Math.max(0, target))
    if (this._tw) this._tw.kill()
    const state = { p: this.progress }
    this._tw = gsap.to(state, {
      p: t,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.progress = state.p
        this.targetProgress = state.p
      },
      onComplete: () => {
        this.progress = t
        this.targetProgress = t
        this._tw = null
      },
    })
  }
}
