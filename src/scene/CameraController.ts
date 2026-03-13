import * as THREE from 'three'

const CAMERA_FAR = new THREE.Vector3(0, 0.2, 5)
const CAMERA_FAR_LOOK = new THREE.Vector3(0, 0, 0)

// Zoomed right into the CRT screen
const CAMERA_NEAR = new THREE.Vector3(0, 0.38, 1.05)
const CAMERA_NEAR_LOOK = new THREE.Vector3(0, 0.38, 0)

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export class CameraController {
  private camera: THREE.PerspectiveCamera
  private targetT = 0
  private currentT = 0
  private screenVisible = false

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    window.addEventListener('scroll', this.onScroll, { passive: true })
  }

  private onScroll = (): void => {
    const maxScroll = document.body.scrollHeight - window.innerHeight
    if (maxScroll <= 0) return
    this.targetT = Math.max(0, Math.min(1, window.scrollY / maxScroll))
  }

  update(): void {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      this.currentT = this.targetT
    } else {
      this.currentT += (this.targetT - this.currentT) * 0.06
    }

    const t = easeInOut(this.currentT)

    // Lerp camera position
    this.camera.position.lerpVectors(CAMERA_FAR, CAMERA_NEAR, t)

    // Lerp look-at target
    const lookAt = new THREE.Vector3().lerpVectors(CAMERA_FAR_LOOK, CAMERA_NEAR_LOOK, t)
    this.camera.lookAt(lookAt)

    // Dispatch event when screen becomes fully visible
    if (!this.screenVisible && this.currentT > 0.85) {
      this.screenVisible = true
      window.dispatchEvent(new CustomEvent('crt-screen-visible'))
    } else if (this.screenVisible && this.currentT < 0.7) {
      this.screenVisible = false
    }
  }

  getScrollT(): number {
    return this.currentT
  }

  dispose(): void {
    window.removeEventListener('scroll', this.onScroll)
  }
}
