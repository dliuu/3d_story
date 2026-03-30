import * as THREE from 'three'
import { Experience } from '../Experience.js'

export class Camera {
  constructor() {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes

    const aspect = this.sizes.width / this.sizes.height
    const frustumSize = 8

    this.instance = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      100
    )

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

  onResize() {
    const container = document.getElementById('canvas-container')
    if (!container) return
    const aspect = container.clientWidth / container.clientHeight
    const frustumSize = 8
    this.instance.left = frustumSize * aspect / -2
    this.instance.right = frustumSize * aspect / 2
    this.instance.top = frustumSize / 2
    this.instance.bottom = frustumSize / -2
    this.instance.updateProjectionMatrix()
  }
}
