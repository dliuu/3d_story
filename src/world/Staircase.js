import * as THREE from 'three'

const LAVENDER = 0xb8b0d0

/**
 * Switchback stairs between two floor Y levels.
 * 12 steps per flight, lavender treads, offset to the +X side of the tower.
 */
export class Staircase {
  constructor(fromFloorY, toFloorY) {
    this.group = new THREE.Group()

    const rise = toFloorY - fromFloorY
    const stepsPerFlight = 12
    const stepCount = stepsPerFlight * 2
    const halfSteps = stepsPerFlight
    const stepH = rise / stepCount
    const stepD = 0.38
    const stepW = 2.0
    const landingD = 1.2
    const x = 3.0

    const stepMat = new THREE.MeshStandardMaterial({
      color: LAVENDER,
      roughness: 0.55,
      metalness: 0.05,
    })

    for (let i = 0; i < halfSteps; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH * 0.9, stepD), stepMat)
      const zJitter = (i % 3) * 0.02
      step.position.set(
        x,
        fromFloorY + i * stepH + stepH / 2,
        -halfSteps * stepD / 2 + i * stepD + zJitter
      )
      step.castShadow = true
      step.receiveShadow = true
      this.group.add(step)
    }

    const landingY = fromFloorY + halfSteps * stepH
    const landingZ = -halfSteps * stepD / 2 + halfSteps * stepD + landingD / 2
    const landing = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH * 0.9, landingD), stepMat)
    landing.position.set(x, landingY, landingZ)
    landing.receiveShadow = true
    this.group.add(landing)

    for (let i = 0; i < halfSteps; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH * 0.9, stepD), stepMat)
      const zJitter = (i % 3) * 0.02
      step.position.set(
        x,
        landingY + (i + 1) * stepH,
        landingZ + landingD / 2 - i * stepD + zJitter
      )
      step.castShadow = true
      step.receiveShadow = true
      this.group.add(step)
    }
  }
}
