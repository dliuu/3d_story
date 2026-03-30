import * as THREE from 'three'
import { FLOORS } from '../core/constants.js'
import { Staircase } from './Staircase.js'
import { ProceduralFloors } from './ProceduralFloors.js'

export class Tower {
  constructor(assetLoader) {
    this.group = new THREE.Group()
    this.group.name = 'tower'

    const allGlb =
      FLOORS.length > 0 &&
      FLOORS.every((f) => {
        const data = assetLoader.items[`floor-${f.id}`]
        return data && data.scene
      })

    if (allGlb) {
      for (const floor of FLOORS) {
        const gltf = assetLoader.items[`floor-${floor.id}`]
        const root = gltf.scene.clone(true)
        root.position.set(0, floor.y, 0)
        root.traverse((c) => {
          if (c.isMesh) {
            c.castShadow = true
            c.receiveShadow = true
          }
        })
        this.group.add(root)
      }
    } else {
      const procedural = new ProceduralFloors()
      this.group.add(procedural.group)
    }

    for (let i = 0; i < FLOORS.length - 1; i++) {
      const stair = new Staircase(FLOORS[i].y, FLOORS[i + 1].y)
      this.group.add(stair.group)
    }
  }

  setY(y) {
    this.group.position.y = y
  }
}
