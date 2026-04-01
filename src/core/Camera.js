import * as THREE from 'three'
import gsap from 'gsap'
import { Experience } from '../Experience.js'

export class Camera {
  constructor() {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes

    this.frustumSize = 5

    this.instance = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    this.applyFrustum()

    const distance = 30
    const azimuth = Math.PI / 4
    const elevation = Math.PI / 5.5

    this.instance.position.set(
      distance * Math.cos(elevation) * Math.sin(azimuth),
      distance * Math.sin(elevation),
      distance * Math.cos(elevation) * Math.cos(azimuth)
    )
    this.instance.lookAt(0, 0, 0)
    this.instance.updateProjectionMatrix()
    this.experience.scene.add(this.instance)
  }

  applyFrustum() {
    const aspect = this.sizes.width / this.sizes.height
    this.instance.left = this.frustumSize * aspect / -2
    this.instance.right = this.frustumSize * aspect / 2
    this.instance.top = this.frustumSize / 2
    this.instance.bottom = this.frustumSize / -2
    this.instance.updateProjectionMatrix()
  }

  onResize() {
    const container = document.getElementById('canvas-container')
    if (!container) return
    this.applyFrustum()
  }

  /**
   * GSAP tween frustumSize from current value to target.
   * Called by Experience during transition.
   */
  zoomTo(targetFrustumSize, duration = 1.0, ease = 'power2.inOut') {
    const state = { v: this.frustumSize }
    gsap.to(state, {
      v: targetFrustumSize,
      duration,
      ease,
      onUpdate: () => {
        this.frustumSize = state.v
        this.applyFrustum()
      },
    })
  }
}
