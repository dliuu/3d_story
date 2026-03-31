import * as THREE from 'three'
import gsap from 'gsap'

export class LandingScene {
  /**
   * @param {import('../core/AssetLoader.js').AssetLoader} assetLoader
   * @param {{ width?: number, height?: number }} [sizes]
   */
  constructor(assetLoader, sizes = {}) {
    this.assetLoader = assetLoader
    this.scene = new THREE.Scene()

    const width = sizes.width ?? window.innerWidth
    const height = sizes.height ?? window.innerHeight
    const aspect = Math.max(1e-6, width / Math.max(1, height))

    this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 100)
    this.camera.position.set(0, 1.4, 5)
    this.camera.lookAt(0, 1.2, 0)

    this._tweens = []
    this._mixers = []

    this._setupLighting()
    this._buildEnvironment()
    this._buildCharacters()
    this._buildParticles()
    this._setupCameraSway()
  }

  _setupLighting() {
    const key = new THREE.DirectionalLight(0xfff4e8, 1.0)
    key.position.set(4, 6, 5)
    this.scene.add(key)

    const fill = new THREE.DirectionalLight(0xc4d4ff, 0.35)
    fill.position.set(-4, 4, 2)
    this.scene.add(fill)

    this.scene.add(new THREE.AmbientLight(0xfaf7f2, 0.5))

    const rim = new THREE.DirectionalLight(0xffeedd, 0.3)
    rim.position.set(0, 3, -5)
    this.scene.add(rim)
  }

  _buildEnvironment() {
    const platformGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.18, 48)
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x3a3450,
      roughness: 0.95,
      metalness: 0.0,
    })
    const platform = new THREE.Mesh(platformGeo, platformMat)
    platform.position.set(0, 0.06, 0)
    this.scene.add(platform)

    const groundGeo = new THREE.PlaneGeometry(40, 40)
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x2d2640,
      roughness: 1.0,
      metalness: 0.0,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    this.scene.add(ground)
  }

  _buildCharacters() {
    const owenGltf = this.assetLoader?.items?.['char-owen']
    const yilinGltf = this.assetLoader?.items?.['char-yilin']

    const owen =
      owenGltf && owenGltf.scene ? this._useGltfCharacter(owenGltf.scene) : this._buildPlaceholderOwen()
    const yilin =
      yilinGltf && yilinGltf.scene ? this._useGltfCharacter(yilinGltf.scene) : this._buildPlaceholderYilin()

    owen.position.set(-0.6, 0, 0)
    yilin.position.set(0.6, 0, 0)
    owen.rotation.y = 0.15
    yilin.rotation.y = -0.15

    this.scene.add(owen, yilin)

    const owenArm = owen.getObjectByName('arm-right')
    const yilinArm = yilin.getObjectByName('arm-right')

    if (owenArm) {
      owenArm.rotation.z = -2.2
      this._tweens.push(
        gsap.to(owenArm.rotation, {
          z: -1.6,
          duration: 0.5,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
        })
      )
    }

    if (yilinArm) {
      yilinArm.rotation.z = 2.2
      this._tweens.push(
        gsap.to(yilinArm.rotation, {
          z: 1.6,
          duration: 0.5,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.2,
        })
      )
    }
  }

  _useGltfCharacter(scene) {
    const group = new THREE.Group()
    const model = scene.clone(true)
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    model.position.set(0, 0, 0)
    model.scale.setScalar(1)
    group.add(model)
    return group
  }

  _buildPlaceholderOwen() {
    return this._buildPlaceholderCharacter({
      suit: 0x1a1a2e,
      shirt: 0xf5f0e8,
      skin: 0xf5d0a9,
      hair: 0x2a1f14,
      shoes: 0x1a1010,
      dress: null,
    })
  }

  _buildPlaceholderYilin() {
    return this._buildPlaceholderCharacter({
      suit: null,
      shirt: null,
      skin: 0xf5d0a9,
      hair: 0x1a1010,
      shoes: 0xd4c8b8,
      dress: 0xfaf5f0,
    })
  }

  _buildPlaceholderCharacter(colors) {
    const g = new THREE.Group()

    const matSuit = colors.suit != null ? new THREE.MeshStandardMaterial({ color: colors.suit, roughness: 0.9 }) : null
    const matShirt =
      colors.shirt != null ? new THREE.MeshStandardMaterial({ color: colors.shirt, roughness: 0.95 }) : null
    const matDress =
      colors.dress != null ? new THREE.MeshStandardMaterial({ color: colors.dress, roughness: 0.95 }) : null
    const matSkin = new THREE.MeshStandardMaterial({ color: colors.skin, roughness: 0.85 })
    const matHair = new THREE.MeshStandardMaterial({ color: colors.hair, roughness: 0.9 })
    const matShoes = new THREE.MeshStandardMaterial({ color: colors.shoes, roughness: 0.95 })

    const shoeGeo = new THREE.BoxGeometry(0.16, 0.08, 0.26)
    const legGeo = new THREE.BoxGeometry(0.16, 0.6, 0.16)
    const torsoGeo = new THREE.BoxGeometry(0.52, 0.62, 0.26)
    const shirtGeo = new THREE.BoxGeometry(0.22, 0.5, 0.02)
    const headGeo = new THREE.SphereGeometry(0.22, 24, 18)
    const hairGeo = new THREE.SphereGeometry(0.235, 24, 18)

    const shoeL = new THREE.Mesh(shoeGeo, matShoes)
    shoeL.position.set(-0.12, 0.04, 0)
    const shoeR = new THREE.Mesh(shoeGeo, matShoes)
    shoeR.position.set(0.12, 0.04, 0)
    g.add(shoeL, shoeR)

    const legL = new THREE.Mesh(legGeo, matSuit ?? matDress ?? matSkin)
    legL.position.set(-0.12, 0.38, 0)
    const legR = new THREE.Mesh(legGeo, matSuit ?? matDress ?? matSkin)
    legR.position.set(0.12, 0.38, 0)
    g.add(legL, legR)

    const torso = new THREE.Mesh(torsoGeo, matSuit ?? matDress ?? matSkin)
    torso.position.set(0, 1.0, 0)
    g.add(torso)

    if (matShirt) {
      const shirt = new THREE.Mesh(shirtGeo, matShirt)
      shirt.position.set(0, 1.0, 0.14)
      g.add(shirt)
    }

    const head = new THREE.Mesh(headGeo, matSkin)
    head.position.set(0, 1.52, 0)
    g.add(head)

    const hair = new THREE.Mesh(hairGeo, matHair)
    hair.position.set(0, 1.56, -0.01)
    hair.scale.set(1.0, 0.85, 1.0)
    g.add(hair)

    const armGeo = new THREE.CylinderGeometry(0.055, 0.06, 0.44, 16)
    armGeo.translate(0, -0.22, 0)

    const armMat = matSuit ?? matDress ?? matSkin

    const armL = new THREE.Mesh(armGeo, armMat)
    armL.position.set(-0.34, 1.26, 0)
    armL.rotation.z = 0.35
    g.add(armL)

    const armR = new THREE.Mesh(armGeo, armMat)
    armR.name = 'arm-right'
    armR.position.set(0.34, 1.26, 0)
    armR.rotation.z = -0.35
    g.add(armR)

    g.scale.setScalar(1.15)
    return g
  }

  _buildParticles() {
    const count = 200
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 1.6 * Math.sqrt(Math.random())
      positions[i * 3 + 0] = Math.cos(a) * r
      positions[i * 3 + 1] = 0.35 + Math.random() * 1.9
      positions[i * 3 + 2] = Math.sin(a) * r
      speeds[i] = 0.2 + Math.random() * 0.55
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xe8d7b8,
      size: 0.02,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75,
    })

    this._particleSpeeds = speeds
    this._particles = new THREE.Points(geo, mat)
    this.scene.add(this._particles)
  }

  _setupCameraSway() {
    const base = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
    }

    this._tweens.push(
      gsap.to(base, {
        x: 0.12,
        duration: 4.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        onUpdate: () => {
          this.camera.position.set(base.x, base.y, base.z)
          this.camera.lookAt(0, 1.2, 0)
        },
      })
    )
  }

  onResize(width, height) {
    const aspect = Math.max(1e-6, width / Math.max(1, height))
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
  }

  update(dt) {
    for (const m of this._mixers) m.update(dt)
    if (this._particles) {
      const pos = this._particles.geometry.attributes.position.array
      for (let i = 0; i < this._particleSpeeds.length; i++) {
        const idx = i * 3 + 1
        pos[idx] += this._particleSpeeds[i] * dt
        if (pos[idx] > 2.6) pos[idx] = 0.35
      }
      this._particles.geometry.attributes.position.needsUpdate = true
    }
  }

  dispose() {
    for (const tw of this._tweens) tw?.kill?.()
    this._tweens = []

    if (this.scene) {
      this.scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose?.()
          const m = o.material
          if (Array.isArray(m)) m.forEach((mm) => mm?.dispose?.())
          else m?.dispose?.()
        } else if (o.isPoints) {
          o.geometry?.dispose?.()
          o.material?.dispose?.()
        }
      })
    }
  }
}

