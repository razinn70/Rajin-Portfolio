import * as THREE from 'three'
import { prefersReducedMotion } from '@/utils/dom'

const CAMERA_FAR = new THREE.Vector3(0, 0.3, 3.6)
const CAMERA_FAR_LOOK = new THREE.Vector3(0, 0.1, 0)

// Close enough that the CRT fills the viewport
const CAMERA_NEAR = new THREE.Vector3(0, 0.4, 1.12)
const CAMERA_NEAR_LOOK = new THREE.Vector3(0, 0.4, 0)

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * Drives the zoom from the hero section's scroll range only (not the whole page),
 * so the zoom finishes exactly as the content starts to slide over the canvas.
 */
export class CameraController {
  private targetT = 0
  private currentT = 0
  private screenVisible = false
  private sideOffset = 0
  private lookAt = new THREE.Vector3()

  constructor(
    private camera: THREE.PerspectiveCamera,
    private model: THREE.Object3D,
    private hero: HTMLElement,
    private onProgress: (t: number) => void,
  ) {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
    this.onResize()
    this.onScroll()
  }

  private onResize = (): void => {
    // On wide screens the computer sits to the right of the hero copy, then glides to center as you zoom in.
    this.sideOffset = window.innerWidth >= 1024 ? Math.min(1.2, (window.innerWidth / window.innerHeight) * 0.68) : 0
    this.onScroll()
  }

  private onScroll = (): void => {
    const range = Math.max(1, this.hero.offsetHeight - window.innerHeight)
    this.targetT = Math.max(0, Math.min(1, window.scrollY / range))
  }

  update(): void {
    const reduced = prefersReducedMotion()
    this.currentT = reduced ? this.targetT : this.currentT + (this.targetT - this.currentT) * 0.08
    this.onProgress(this.currentT)

    // Reduced motion: keep the scene still, no zoom.
    const t = reduced ? 0 : easeInOut(this.currentT)

    this.model.position.x = this.sideOffset * (1 - t)
    this.camera.position.lerpVectors(CAMERA_FAR, CAMERA_NEAR, t)
    this.lookAt.lerpVectors(CAMERA_FAR_LOOK, CAMERA_NEAR_LOOK, t)
    this.camera.lookAt(this.lookAt)

    if (!this.screenVisible && this.currentT > 0.8) {
      this.screenVisible = true
      window.dispatchEvent(new CustomEvent('crt-screen-visible'))
    } else if (this.screenVisible && this.currentT < 0.6) {
      this.screenVisible = false
    }
  }

  dispose(): void {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  }
}
