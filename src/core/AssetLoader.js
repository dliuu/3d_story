import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EventEmitter } from './EventEmitter.js'

/**
 * GLTF/texture/HDR/audio loader with progress events.
 * Types: 'gltf' | 'texture' | 'hdr' | 'audio'
 */
export class AssetLoader extends EventEmitter {
  constructor(manifest = []) {
    super()

    this.items = {}
    this.loaded = 0
    this.toLoad = 0
    this.manifest = manifest

    this.loaders = {}

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    this.loaders.gltf = new GLTFLoader()
    this.loaders.gltf.setDRACOLoader(dracoLoader)

    this.loaders.texture = new THREE.TextureLoader()
    this.loaders.rgbe = new RGBELoader()
    this.loaders.audio = new THREE.AudioLoader()
  }

  startLoading() {
    this.toLoad = this.manifest.length
    this.loaded = 0

    if (this.toLoad === 0) {
      setTimeout(() => {
        this.emit('progress', 1, 1)
        this.emit('complete', this.items)
      }, 500)
      return
    }

    this.emit('progress', 0, this.toLoad)

    for (const asset of this.manifest) {
      switch (asset.type) {
        case 'gltf':
        case 'glb':
          this.loaders.gltf.load(
            asset.path,
            (gltf) => this.onAssetLoaded(asset.name, gltf),
            undefined,
            (err) => {
              console.warn('[AssetLoader] gltf load failed', asset.path, err)
              this.onAssetLoaded(asset.name, null)
            }
          )
          break

        case 'texture':
          this.loaders.texture.load(
            asset.path,
            (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace
              this.onAssetLoaded(asset.name, texture)
            },
            undefined,
            (err) => {
              console.warn('[AssetLoader] texture load failed', asset.path, err)
              this.onAssetLoaded(asset.name, null)
            }
          )
          break

        case 'hdr':
          this.loaders.rgbe.load(
            asset.path,
            (hdr) => {
              hdr.mapping = THREE.EquirectangularReflectionMapping
              this.onAssetLoaded(asset.name, hdr)
            },
            undefined,
            (err) => {
              console.warn('[AssetLoader] hdr load failed', asset.path, err)
              this.onAssetLoaded(asset.name, null)
            }
          )
          break

        case 'audio':
          this.loaders.audio.load(
            asset.path,
            (buffer) => this.onAssetLoaded(asset.name, buffer),
            undefined,
            (err) => {
              console.warn('[AssetLoader] audio load failed', asset.path, err)
              this.onAssetLoaded(asset.name, null)
            }
          )
          break

        default:
          this.onAssetLoaded(asset.name, null)
      }
    }
  }

  onAssetLoaded(name, item) {
    this.items[name] = item
    this.loaded++

    this.emit('progress', this.loaded, this.toLoad)

    if (this.loaded === this.toLoad) {
      this.emit('complete', this.items)
    }
  }
}
