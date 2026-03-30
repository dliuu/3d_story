import * as THREE from 'three'
import { FLOORS } from '../core/constants.js'

const W = 5
const H = 4.5
const D = 5

function wallMat(color, roughness = 0.85) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
  })
}

function makeRoomShell(accentHex) {
  const g = new THREE.Group()
  const floorM = wallMat(0x3a3548)
  const ceilM = wallMat(0x2a2538)
  const sideM = wallMat(0x4a4458)
  const backM = wallMat(accentHex, 0.7)

  const floor = new THREE.Mesh(new THREE.BoxGeometry(W, 0.12, D), floorM)
  floor.position.y = 0.06
  floor.receiveShadow = true
  g.add(floor)

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(W, 0.1, D), ceilM)
  ceiling.position.y = H - 0.05
  ceiling.receiveShadow = true
  g.add(ceiling)

  const left = new THREE.Mesh(new THREE.BoxGeometry(0.12, H, D), sideM)
  left.position.set(-W / 2 + 0.06, H / 2, 0)
  left.castShadow = true
  left.receiveShadow = true
  g.add(left)

  const right = new THREE.Mesh(new THREE.BoxGeometry(0.12, H, D), sideM)
  right.position.set(W / 2 - 0.06, H / 2, 0)
  right.castShadow = true
  right.receiveShadow = true
  g.add(right)

  const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.12), backM)
  back.position.set(0, H / 2, -D / 2 + 0.06)
  back.castShadow = true
  back.receiveShadow = true
  g.add(back)

  return g
}

export class ProceduralFloors {
  constructor() {
    this.group = new THREE.Group()

    FLOORS.forEach((floor, i) => {
      const room = new THREE.Group()
      room.position.y = floor.y

      let accent = 0x1a1824
      if (i === 1) accent = 0xd4a4a0
      if (i === 2) accent = 0xc9a96e
      if (i === 3) accent = 0x5c4a78
      if (i === 4) accent = 0xf0ebe3

      room.add(makeRoomShell(accent))

      if (i === 0) {
        const geo = new THREE.BufferGeometry()
        const count = 420
        const pos = new Float32Array(count * 3)
        for (let p = 0; p < count; p++) {
          pos[p * 3] = (Math.random() - 0.5) * 4
          pos[p * 3 + 1] = Math.random() * 3.5 + 0.2
          pos[p * 3 + 2] = (Math.random() - 0.5) * 3
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        const pts = new THREE.Points(
          geo,
          new THREE.PointsMaterial({ color: 0xc9a96e, size: 0.04, transparent: true, opacity: 0.85 })
        )
        room.add(pts)
      }

      if (i === 1) {
        const desk = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.08, 0.7),
          wallMat(0x6a6058)
        )
        desk.position.set(0, 0.9, 0.5)
        desk.castShadow = true
        room.add(desk)

        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 2.4, 1.8),
          wallMat(0x555050)
        )
        shelf.position.set(-1.5, 1.3, -1.2)
        shelf.castShadow = true
        room.add(shelf)

        const bookColors = [0x8fa4b8, 0xed1b2f, 0xcccccc]
        for (let b = 0; b < 8; b++) {
          const bk = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 0.22, 0.18),
            wallMat(bookColors[b % 3], 0.6)
          )
          bk.position.set(-1.48 + (b % 4) * 0.16, 1.05 + Math.floor(b / 4) * 0.24, -1.0)
          bk.castShadow = true
          room.add(bk)
        }
      }

      if (i === 2) {
        const table = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.6, 0.08, 24),
          wallMat(0x6b5344)
        )
        table.position.set(0, 0.85, 0.2)
        table.castShadow = true
        room.add(table)

        const cup1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12), wallMat(0xffffff))
        cup1.position.set(-0.15, 0.98, 0.15)
        room.add(cup1)
        const cup2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 12), wallMat(0xf5f0e8))
        cup2.position.set(0.18, 0.98, 0.22)
        room.add(cup2)

        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.2, 10), wallMat(0xfff8e8))
        candle.position.set(0.05, 1.05, -0.05)
        room.add(candle)

        const glow = new THREE.PointLight(0xffcc88, 0.8, 8)
        glow.position.set(0, 1.4, 0.5)
        room.add(glow)
      }

      if (i === 3) {
        for (let c = 0; c < 24; c++) {
          const s = new THREE.Mesh(
            new THREE.SphereGeometry(0.08 + Math.random() * 0.1, 10, 10),
            new THREE.MeshStandardMaterial({
              color: c % 2 ? 0xe8a0c8 : 0xb8a0e8,
              transparent: true,
              opacity: 0.45,
              roughness: 0.3,
            })
          )
          s.position.set((Math.random() - 0.5) * 3, 0.5 + Math.random() * 3, (Math.random() - 0.5) * 2.5)
          room.add(s)
        }
      }

      if (i === 4) {
        const card = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 1.0, 0.04),
          wallMat(0xfffdf8, 0.35)
        )
        card.position.set(0, 2.2, -D / 2 + 0.2)
        card.castShadow = true
        room.add(card)

        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.5, 8), wallMat(0x4a7c4a))
        stem.position.set(1.2, 0.55, 0.8)
        room.add(stem)
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), wallMat(0xf2b8c6, 0.4))
        petal.position.set(1.2, 0.95, 0.8)
        room.add(petal)
      }

      this.group.add(room)
    })
  }
}
