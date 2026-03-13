import * as THREE from 'three'

export class ResponsiveHandler {
  private renderer: THREE.WebGLRenderer
  private camera: THREE.PerspectiveCamera
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
    this.renderer = renderer
    this.camera = camera
    window.addEventListener('resize', this.onResize)
    // Fire once to set initial state
    this.applyResize()
  }

  private onResize = (): void => {
    if (this.debounceTimer !== null) clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => this.applyResize(), 150)
  }

  private applyResize(): void {
    const w = window.innerWidth
    const h = window.innerHeight

    this.renderer.setSize(w, h)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()

    if (w < 768) {
      window.dispatchEvent(new CustomEvent('scene-mobile-mode'))
    } else {
      window.dispatchEvent(new CustomEvent('scene-desktop-mode'))
    }
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResize)
    if (this.debounceTimer !== null) clearTimeout(this.debounceTimer)
  }
}
