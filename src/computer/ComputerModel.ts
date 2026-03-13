import * as THREE from 'three'
import { createCRTMaterial } from './CRTShader'

export class ComputerModel {
  readonly group: THREE.Group
  private screenMesh: THREE.Mesh
  private crtMaterial: THREE.ShaderMaterial | null = null

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group()

    // --- Materials ---
    const darkPlastic = new THREE.MeshStandardMaterial({
      color: 0x1c1c1c,
      roughness: 0.75,
      metalness: 0.05,
    })

    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x242424,
      roughness: 0.7,
      metalness: 0.05,
    })

    const keyboardMat = new THREE.MeshStandardMaterial({
      color: 0x202020,
      roughness: 0.8,
      metalness: 0.0,
    })

    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.9,
      metalness: 0.0,
    })

    // --- Monitor body ---
    const monitorGeo = new THREE.BoxGeometry(1.4, 1.1, 0.3)
    const monitor = new THREE.Mesh(monitorGeo, darkPlastic)
    monitor.position.set(0, 0.4, 0)
    monitor.castShadow = true
    this.group.add(monitor)

    // --- Screen bezel (inset ring) ---
    const bezelGeo = new THREE.BoxGeometry(1.1, 0.85, 0.025)
    const bezel = new THREE.Mesh(bezelGeo, bezelMat)
    bezel.position.set(0, 0.4, 0.16)
    this.group.add(bezel)

    // --- CRT screen plane ---
    const screenGeo = new THREE.PlaneGeometry(0.95, 0.72)
    // Placeholder mesh — CRTMaterial assigned once texture is created
    this.screenMesh = new THREE.Mesh(
      screenGeo,
      new THREE.MeshBasicMaterial({ color: 0x050a0a })
    )
    this.screenMesh.position.set(0, 0.4, 0.166)
    this.group.add(this.screenMesh)

    // --- Monitor neck / stand ---
    const neckGeo = new THREE.BoxGeometry(0.14, 0.22, 0.1)
    const neck = new THREE.Mesh(neckGeo, darkPlastic)
    neck.position.set(0, -0.16, 0.0)
    this.group.add(neck)

    // --- Base ---
    const baseGeo = new THREE.BoxGeometry(0.6, 0.04, 0.35)
    const base = new THREE.Mesh(baseGeo, darkPlastic)
    base.position.set(0, -0.27, 0.06)
    base.receiveShadow = true
    this.group.add(base)

    // --- Keyboard ---
    const kbGeo = new THREE.BoxGeometry(1.2, 0.04, 0.35)
    const keyboard = new THREE.Mesh(kbGeo, keyboardMat)
    keyboard.position.set(0, -0.32, 0.55)
    keyboard.receiveShadow = true
    this.group.add(keyboard)

    // Key rows — 3 rows × 10 keys
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 10; col++) {
        const keyGeo = new THREE.BoxGeometry(0.085, 0.015, 0.068)
        const key = new THREE.Mesh(keyGeo, keyMat)
        key.position.set(
          -0.49 + col * 0.105,
          -0.305,
          0.43 + row * 0.09
        )
        this.group.add(key)
      }
    }

    // --- Mouse ---
    const mouseBodyGeo = new THREE.BoxGeometry(0.1, 0.03, 0.14)
    const mouseBody = new THREE.Mesh(mouseBodyGeo, darkPlastic)
    mouseBody.position.set(0.72, -0.31, 0.55)
    this.group.add(mouseBody)

    // Rounded mouse top
    const mouseTopGeo = new THREE.SphereGeometry(0.055, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.5)
    const mouseTop = new THREE.Mesh(mouseTopGeo, darkPlastic)
    mouseTop.position.set(0.72, -0.294, 0.55)
    mouseTop.scale.set(1, 0.5, 1.3)
    this.group.add(mouseTop)

    // Mouse button divider line
    const dividerGeo = new THREE.BoxGeometry(0.001, 0.035, 0.1)
    const dividerMat = new THREE.MeshStandardMaterial({ color: 0x111111 })
    const divider = new THREE.Mesh(dividerGeo, dividerMat)
    divider.position.set(0.72, -0.3, 0.52)
    this.group.add(divider)

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff0e5, 0.5)
    scene.add(ambientLight)

    const keyLight = new THREE.PointLight(0xffcba4, 60, 15)
    keyLight.position.set(-2, 3, 4)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0xffffff, 10, 10)
    fillLight.position.set(2, 1, 3)
    scene.add(fillLight)

    // Screen glow — soft peach emanating from the monitor
    const screenGlow = new THREE.PointLight(0xffcba4, 5, 2)
    screenGlow.position.set(0, 0.4, 0.5)
    this.group.add(screenGlow)
  }

  /** Call once ScreenRenderer has created the CanvasTexture */
  attachCRTMaterial(texture: THREE.CanvasTexture): void {
    this.crtMaterial = createCRTMaterial(texture)
    this.screenMesh.material = this.crtMaterial
  }

  /** Update CRT shader time uniform every frame */
  updateShaderTime(elapsed: number): void {
    if (this.crtMaterial) {
      this.crtMaterial.uniforms['uTime'].value = elapsed
    }
  }

  getScreenPlane(): THREE.Mesh {
    return this.screenMesh
  }

  dispose(): void {
    this.group.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
    this.crtMaterial?.dispose()
  }
}
