import * as THREE from 'three'

const BOOK_COLORS = [0x8b2500, 0x1b3f6b, 0x2d5a27, 0xc9a96e, 0x4a2d6b, 0xcccccc]

/**
 * Library diorama interior for Floor 1 ("How They Met", FLOORS index 1).
 * Local room space: y=0 is floor; shell built by ProceduralFloors.
 */
export class LibraryScene {
  constructor() {
    this.group = new THREE.Group()
    this.group.name = 'library-interior'

    /** @type {THREE.MeshStandardMaterial[]} */
    this._textureMaterials = []

    this._bookshelfFrontMat = this._stdMat({
      color: 0x6b6058,
      roughness: 0.9,
      transparent: true,
      opacity: 0.96,
    })
    this._bookshelfFrontMat.userData.textureHint = 'bookshelf_books'
    this._textureMaterials.push(this._bookshelfFrontMat)

    this._buildTable()
    this._buildTableProps()
    this._buildChairs()
    this._buildCharacterOwen()
    this._buildCharacterYilin()
    this._buildBookshelves()
    this._buildWindow()
    this._buildOverheadLight()
    this._buildExtras()

    this._loadOptionalTextures()
  }

  _stdMat(params) {
    const m = new THREE.MeshStandardMaterial({ metalness: 0, ...params })
    return m
  }

  _addMesh(mesh) {
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.group.add(mesh)
  }

  _loadOptionalTextures() {
    const loader = new THREE.TextureLoader()
    const base = '/textures/library/'

    const tryMap = (file, mat) => {
      if (!mat || !mat.isMeshStandardMaterial) return
      loader.load(
        `${base}${file}`,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          mat.map = tex
          mat.needsUpdate = true
        },
        undefined,
        () => {}
      )
    }

    for (const m of this._textureMaterials) {
      const tag = m.userData?.textureHint
      if (tag === 'wood_desk') tryMap('wood_desk.jpg', m)
      if (tag === 'mcgill_red') tryMap('mcgill_red.jpg', m)
      if (tag === 'grey_sweater') tryMap('grey_sweater.jpg', m)
      if (tag === 'window_glow') tryMap('window_glow.jpg', m)
      if (tag === 'bookshelf_books') tryMap('bookshelf_books.jpg', m)
    }
  }

  _buildTable() {
    const deskMat = this._stdMat({
      color: 0x8b6f4e,
      roughness: 0.75,
    })
    deskMat.userData.textureHint = 'wood_desk'
    this._textureMaterials.push(deskMat)

    const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.07, 1.0), deskMat)
    top.position.set(0, 0.82, 0.3)
    this._addMesh(top)

    const legGeo = new THREE.BoxGeometry(0.07, 0.78, 0.07)
    const legMat = this._stdMat({ color: 0x6b5344, roughness: 0.8 })
    const legPos = [
      [-0.95, 0.39, -0.38],
      [0.95, 0.39, -0.38],
      [-0.95, 0.39, 0.38],
      [0.95, 0.39, 0.38],
    ]
    for (const [x, y, z] of legPos) {
      const leg = new THREE.Mesh(legGeo, legMat)
      leg.position.set(x, y, z)
      this._addMesh(leg)
    }
  }

  _buildTableProps() {
    const openBook = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.02, 0.18),
      this._stdMat({ color: 0xf5f0e0, roughness: 0.9 })
    )
    openBook.position.set(-0.4, 0.87, 0.3)
    openBook.rotation.y = 0.1
    this._addMesh(openBook)

    const stack = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.06, 0.15),
      this._stdMat({ color: 0x2d4a7a, roughness: 0.85 })
    )
    stack.position.set(0.4, 0.88, 0.3)
    this._addMesh(stack)

    const pencil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.18, 6),
      this._stdMat({ color: 0xe8c840, roughness: 0.5 })
    )
    pencil.position.set(-0.15, 0.86, 0.15)
    pencil.rotation.z = Math.PI / 2
    pencil.rotation.y = 0.3
    this._addMesh(pencil)
  }

  _buildChairAt(cx, cz) {
    const wood = this._stdMat({ color: 0x6b5d4f, roughness: 0.88 })

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.35), wood)
    seat.position.set(cx, 0.42, cz)
    this._addMesh(seat)

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.4, 0.04), wood)
    back.position.set(cx, 0.64, cz - 0.15)
    this._addMesh(back)

    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.42, 6)
    const ox = 0.16
    const oz = 0.14
    for (const [dx, dz] of [
      [-ox, -oz],
      [ox, -oz],
      [-ox, oz],
      [ox, oz],
    ]) {
      const leg = new THREE.Mesh(legGeo, wood)
      leg.position.set(cx + dx, 0.21, cz + dz)
      this._addMesh(leg)
    }
  }

  _buildChairs() {
    this._buildChairAt(-0.55, 0.75)
    this._buildChairAt(0.55, 0.75)
  }

  _buildCharacterOwen() {
    const bx = -0.55
    const bz = 0.3

    const torsoMat = this._stdMat({ color: 0xed1b24, roughness: 0.9 })
    torsoMat.userData.textureHint = 'mcgill_red'
    this._textureMaterials.push(torsoMat)

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 0.22), torsoMat)
    torso.position.set(bx, 0.95, bz)
    this._addMesh(torso)

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 12, 10),
      this._stdMat({ color: 0xf5d0a9, roughness: 0.8 })
    )
    head.position.set(bx, 1.25, bz)
    this._addMesh(head)

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.125, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      this._stdMat({ color: 0x2a1f14, roughness: 0.9 })
    )
    hair.position.set(bx, 1.3, bz)
    this._addMesh(hair)

    const armMat = this._stdMat({ color: 0xed1b24, roughness: 0.9 })
    const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 8)

    const armL = new THREE.Mesh(armGeo, armMat)
    armL.position.set(-0.22, 0.88, 0.3)
    armL.rotation.z = -0.5
    this._addMesh(armL)

    const armR = new THREE.Mesh(armGeo, armMat)
    armR.position.set(0.0, 0.88, 0.3)
    armR.rotation.z = 0.5
    this._addMesh(armR)

    const legGeo = new THREE.BoxGeometry(0.12, 0.25, 0.18)
    const legMat = this._stdMat({ color: 0x3a3a50, roughness: 0.9 })
    const legL = new THREE.Mesh(legGeo, legMat)
    legL.position.set(bx - 0.08, 0.52, bz)
    this._addMesh(legL)
    const legR = new THREE.Mesh(legGeo, legMat)
    legR.position.set(bx + 0.08, 0.52, bz)
    this._addMesh(legR)
  }

  _buildCharacterYilin() {
    const bx = 0.55
    const bz = 0.3

    const torsoMat = this._stdMat({ color: 0x8c8c8c, roughness: 0.9 })
    torsoMat.userData.textureHint = 'grey_sweater'
    this._textureMaterials.push(torsoMat)

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.2), torsoMat)
    torso.position.set(bx, 0.93, bz)
    this._addMesh(torso)

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 12, 10),
      this._stdMat({ color: 0xf5d0a9, roughness: 0.8 })
    )
    head.position.set(bx, 1.22, bz)
    this._addMesh(head)

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 12, 10),
      this._stdMat({ color: 0x1a1010, roughness: 0.85 })
    )
    hair.position.set(bx, 1.25, bz)
    hair.scale.set(1, 0.9, 1.1)
    this._addMesh(hair)

    const armMat = this._stdMat({ color: 0x8c8c8c, roughness: 0.9 })
    const armGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.26, 8)

    const armL = new THREE.Mesh(armGeo, armMat)
    armL.position.set(0.22, 0.88, 0.3)
    armL.rotation.z = 0.5
    this._addMesh(armL)

    const armR = new THREE.Mesh(armGeo, armMat)
    armR.position.set(0.88, 0.88, 0.3)
    armR.rotation.z = -0.5
    this._addMesh(armR)

    const legGeo = new THREE.BoxGeometry(0.11, 0.24, 0.17)
    const legMat = this._stdMat({ color: 0x3a3a50, roughness: 0.9 })
    const legL = new THREE.Mesh(legGeo, legMat)
    legL.position.set(bx - 0.07, 0.51, bz)
    this._addMesh(legL)
    const legR = new THREE.Mesh(legGeo, legMat)
    legR.position.set(bx + 0.07, 0.51, bz)
    this._addMesh(legR)
  }

  _buildBookshelfUnit(cx, cz) {
    const frameMat = this._stdMat({ color: 0x5a4e42, roughness: 0.85 })
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.2, 0.5), frameMat)
    frame.position.set(cx, 1.6, cz)
    this._addMesh(frame)

    const shelfY = [0.5, 1.2, 1.9, 2.6]
    for (const y of shelfY) {
      const plank = new THREE.Mesh(
        new THREE.BoxGeometry(0.84, 0.03, 0.46),
        frameMat
      )
      plank.position.set(cx, y, cz)
      this._addMesh(plank)
    }

    const front = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 3.0), this._bookshelfFrontMat)
    front.position.set(cx, 1.55, cz + 0.26)
    this._addMesh(front)

    let bookIndex = 0
    for (const y of shelfY) {
      let xOff = -0.32
      const count = 6
      for (let b = 0; b < count; b++) {
        const w = 0.06 + (b % 3) * 0.015
        const h = 0.18 + (b % 4) * 0.025
        const d = 0.16
        const col = BOOK_COLORS[bookIndex % BOOK_COLORS.length]
        bookIndex++
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, d),
          this._stdMat({ color: col, roughness: 0.75 })
        )
        book.position.set(cx + xOff + w / 2, y + 0.03 + h / 2, cz + 0.06)
        xOff += w + 0.012
        this._addMesh(book)
      }
    }
  }

  _buildBookshelves() {
    this._buildBookshelfUnit(-1.6, -1.8)
    this._buildBookshelfUnit(1.6, -1.8)
  }

  _buildWindow() {
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.4, 0.06),
      this._stdMat({ color: 0xd4c8b8, roughness: 0.75 })
    )
    frame.position.set(-2.38, 2.0, -0.5)
    frame.rotation.y = Math.PI / 2
    this._addMesh(frame)

    const paneMat = this._stdMat({
      color: 0xfff8e0,
      emissive: 0xffeebb,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
    })
    paneMat.userData.textureHint = 'window_glow'
    this._textureMaterials.push(paneMat)

    const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.2), paneMat)
    pane.position.set(-2.35, 2.0, -0.5)
    pane.rotation.y = Math.PI / 2
    this._addMesh(pane)

    const barH = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.03, 0.03),
      this._stdMat({ color: 0xd4c8b8, roughness: 0.75 })
    )
    barH.position.set(-2.32, 2.0, -0.5)
    barH.rotation.y = Math.PI / 2
    this._addMesh(barH)

    const barV = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 1.2, 0.03),
      this._stdMat({ color: 0xd4c8b8, roughness: 0.75 })
    )
    barV.position.set(-2.32, 2.0, -0.5)
    barV.rotation.y = Math.PI / 2
    this._addMesh(barV)
  }

  _buildOverheadLight() {
    const metal = this._stdMat({ color: 0x2a2a2a, roughness: 0.45, metalness: 0.35 })
    const fixture = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.08, 0.06, 12),
      metal
    )
    fixture.position.set(0, 4.1, 0.3)
    this._addMesh(fixture)

    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.4, 4),
      this._stdMat({ color: 0x222222, roughness: 0.9 })
    )
    cord.position.set(0, 4.3, 0.3)
    this._addMesh(cord)

    const point = new THREE.PointLight(0xfff0d4, 1.2, 6, 2)
    point.position.set(0, 3.8, 0.3)
    this.group.add(point)

    const target = new THREE.Object3D()
    target.position.set(0, 0.82, 0.3)
    this.group.add(target)

    const spot = new THREE.SpotLight(0xfff0d4, 0.8, 12, Math.PI / 5, 0.6, 1.2)
    spot.position.set(0, 4.0, 0.3)
    spot.target = target
    spot.castShadow = true
    spot.shadow.mapSize.set(1024, 1024)
    this.group.add(spot)
  }

  _buildExtras() {
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 1.6),
      this._stdMat({ color: 0x6b4a3a, roughness: 0.95 })
    )
    rug.rotation.x = -Math.PI / 2
    rug.position.set(0, 0.13, 0.35)
    rug.receiveShadow = true
    rug.castShadow = false
    this.group.add(rug)

    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 0.04, 12),
      this._stdMat({ color: 0x3a3a3a, roughness: 0.4, metalness: 0.4 })
    )
    lampBase.position.set(0.85, 0.87, -0.1)
    this._addMesh(lampBase)

    const lampNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8),
      this._stdMat({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.3 })
    )
    lampNeck.position.set(0.85, 0.99, -0.18)
    lampNeck.rotation.x = 0.5
    this._addMesh(lampNeck)

    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 0.12, 12, 1, true),
      this._stdMat({
        color: 0xfff4dd,
        emissive: 0xffe4b8,
        emissiveIntensity: 0.55,
        roughness: 0.6,
        side: THREE.DoubleSide,
      })
    )
    shade.position.set(0.85, 1.08, -0.28)
    shade.rotation.x = 0.5
    this._addMesh(shade)

    const face = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.03, 20),
      this._stdMat({ color: 0xf5f0e0, roughness: 0.8 })
    )
    face.position.set(0, 3.2, -2.38)
    face.rotation.x = Math.PI / 2
    this._addMesh(face)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.21, 0.02, 8, 24),
      this._stdMat({ color: 0x8b6f4e, roughness: 0.75 })
    )
    ring.position.set(0, 3.2, -2.36)
    ring.rotation.y = Math.PI / 2
    this._addMesh(ring)
  }
}
