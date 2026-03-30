import * as THREE from 'three'
import { Experience } from '../Experience.js'

export class Renderer {
  constructor() {
    this.experience = Experience.instance
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas ?? undefined,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)

    this.instance.toneMapping = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure = 0.88

    this.instance.outputColorSpace = THREE.SRGBColorSpace

    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap

    this.instance.setClearColor(0x2d2640, 1)
  }

  onResize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  render() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
