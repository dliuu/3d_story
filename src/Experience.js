import * as THREE from 'three'
import gsap from 'gsap'
import { FLOORS } from './core/constants.js'
import { AssetLoader } from './core/AssetLoader.js'
import { Camera } from './core/Camera.js'
import { Renderer } from './core/Renderer.js'
import { ScrollController } from './core/ScrollController.js'
import { FloorTracker } from './core/FloorTracker.js'
import { HTMLPanelController } from './core/HTMLPanelController.js'
import { AudioController } from './core/AudioController.js'
import { Tower } from './world/Tower.js'

/**
 * Add optional .glb dioramas here: { name: `floor-${FLOORS[i].id}`, type: 'gltf', path: '/models/....glb' }
 */
const ASSET_MANIFEST = []

export class Experience {
  static instance = null

  constructor(canvas) {
    if (Experience.instance) return Experience.instance
    Experience.instance = this

    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()

    this.sizes = {
      width: 1,
      height: 1,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    }
    this._updateSizes()

    this.assetLoader = new AssetLoader(ASSET_MANIFEST)

    this.camera = new Camera()
    this.renderer = new Renderer()
    this.scroll = new ScrollController()
    this.floorTracker = new FloorTracker()
    this._zoomTween = null

    this.floorTracker.on('floorChange', () => {
      if (this._zoomTween) this._zoomTween.kill()

      const cam = this.camera
      const BASE = 8
      const PEAK = 6.2

      this._zoomTween = gsap
        .timeline()
        .to(cam, {
          frustumSize: PEAK,
          duration: 0.28,
          ease: 'power2.in',
          onUpdate: () => cam.applyFrustum(),
        })
        .to(cam, {
          frustumSize: BASE,
          duration: 0.55,
          ease: 'power2.out',
          onUpdate: () => cam.applyFrustum(),
        })
    })

    this.htmlPanels = new HTMLPanelController()

    this._setupLighting()

    this.tower = new Tower(this.assetLoader)
    this.scene.add(this.tower.group)

    this.assetLoader.on('complete', () => {
      const hasAll = FLOORS.every((f) => {
        const data = this.assetLoader.items[`floor-${f.id}`]
        return data && data.scene
      })
      if (hasAll) {
        this.scene.remove(this.tower.group)
        this.tower = new Tower(this.assetLoader)
        this.scene.add(this.tower.group)
      }
      const loaderEl = document.getElementById('loader')
      loaderEl?.classList.add('hidden')
    })

    this.assetLoader.on('progress', (loaded, total) => {
      const fill = document.querySelector('#loader .loader-fill')
      if (!fill) return
      const t = total ? loaded / total : 1
      fill.style.width = `${Math.min(100, Math.max(0, t * 100))}%`
    })

    this.assetLoader.startLoading()

    this.audioController = new AudioController()
    this.audioController.loadTrack('/audio/ambient.mp3')

    const n = FLOORS.length - 1
    this.htmlPanels.onNavClick = (i) => {
      this.scroll.goTo(n > 0 ? i / n : 0)
    }

    window.addEventListener('resize', () => this.onResize())

    this.tick()
  }

  _updateSizes() {
    const el = document.getElementById('canvas-container')
    if (!el) return
    this.sizes.width = el.clientWidth || 1
    this.sizes.height = el.clientHeight || 1
    this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
  }

  _setupLighting() {
    const amb = new THREE.AmbientLight(0xb8b4c8, 0.35)
    this.scene.add(amb)

    const fill = new THREE.DirectionalLight(0xc8c2dc, 0.45)
    fill.position.set(-8, 10, 6)
    this.scene.add(fill)

    const key = new THREE.DirectionalLight(0xfff5e8, 0.95)
    key.position.set(12, 18, 10)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 60
    key.shadow.camera.left = -15
    key.shadow.camera.right = 15
    key.shadow.camera.top = 15
    key.shadow.camera.bottom = -15
    this.scene.add(key)
  }

  onResize() {
    this._updateSizes()
    this.camera.onResize()
    this.renderer.onResize()
  }

  tick() {
    window.requestAnimationFrame(() => this.tick())

    this.scroll.update()
    this.tower.setY(this.scroll.getTowerY())
    this.floorTracker.update(this.scroll.progress)
    this.htmlPanels.setActivePanel(this.floorTracker.activeFloorIndex)

    const progressFill = document.querySelector('#scroll-progress .progress-fill')
    if (progressFill) {
      progressFill.style.width = `${this.scroll.progress * 100}%`
    }

    this.audioController.updateWithProgress(this.scroll.progress)
    this.renderer.render()
  }
}
