import * as THREE from 'three'

export class SceneManager {
  readonly scene: THREE.Scene
  readonly renderer: THREE.WebGLRenderer
  readonly camera: THREE.PerspectiveCamera
  readonly clock: THREE.Clock

  private onFrame: ((delta: number, elapsed: number) => void) | null = null
  private running = false
  private paused = false
  private announcedReady = false

  constructor() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0b1013)

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100)
    this.camera.position.set(0, 0.25, 5)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const canvas = this.renderer.domElement
    canvas.className = 'scene-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    // If the GPU drops the context (common on phones and old laptops), hide the canvas instead of leaving a black hole.
    canvas.addEventListener('webglcontextlost', e => {
      e.preventDefault()
      this.stop()
      document.documentElement.classList.add('no-3d')
    })
    document.body.appendChild(canvas)

    // Do not burn GPU while the tab is hidden.
    document.addEventListener('visibilitychange', () => this.sync())
    this.clock = new THREE.Clock()
  }

  start(onFrame: (delta: number, elapsed: number) => void): void {
    this.onFrame = onFrame
    this.running = true
    this.sync()
  }

  /** Pause while the canvas is fully covered by page content. */
  setPaused(paused: boolean): void {
    if (paused === this.paused) return
    this.paused = paused
    this.sync()
  }

  private sync(): void {
    const shouldRun = this.running && !this.paused && !document.hidden
    if (!shouldRun) {
      this.renderer.setAnimationLoop(null)
      return
    }
    this.renderer.setAnimationLoop(() => {
      const delta = this.clock.getDelta()
      const elapsed = this.clock.getElapsedTime()
      this.onFrame?.(delta, elapsed)
      this.renderer.render(this.scene, this.camera)
      if (!this.announcedReady) {
        this.announcedReady = true
        requestAnimationFrame(() => document.documentElement.classList.add('scene-ready'))
      }
    })
  }

  stop(): void {
    this.running = false
    this.renderer.setAnimationLoop(null)
  }

  dispose(): void {
    this.stop()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
