// --- Fonts (self hosted, so the strict CSP can stay strict) ---
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'

// --- Styles ---
import '@/styles/global.css'
import '@/styles/navigation.css'
import '@/styles/hero.css'
import '@/styles/sections.css'

import { inject } from '@vercel/analytics'

import { Navigation } from '@/ui/Navigation'
import { Hero } from '@/ui/Hero'
import { ExperienceSection } from '@/ui/ExperienceSection'
import { ProjectCards } from '@/ui/ProjectCards'
import { AboutSection } from '@/ui/AboutSection'
import { TerminalSection } from '@/ui/TerminalSection'
import { ContactSection } from '@/ui/ContactSection'

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** 3D is a bonus layer. Skip it on phones and tablets, without WebGL, or when the visitor asked for less data or motion. */
function shouldRun3D(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return (
    window.matchMedia('(min-width: 1024px) and (min-height: 600px)').matches &&
    !conn?.saveData &&
    hasWebGL()
  )
}

function byId(id: string): HTMLElement | null {
  return document.getElementById(id)
}

async function start3D(heroEl: HTMLElement, hero: Hero): Promise<void> {
  // Three.js is ~115 KB gzipped. Load it after the page content is already readable.
  const [{ SceneManager }, { CameraController }, { ResponsiveHandler }, { ComputerModel }, { ScreenRenderer }, { Shell }] =
    await Promise.all([
      import('@/scene/SceneManager'),
      import('@/scene/CameraController'),
      import('@/scene/ResponsiveHandler'),
      import('@/computer/ComputerModel'),
      import('@/computer/ScreenRenderer'),
      import('@/terminal/Shell'),
    ])

  const sceneManager = new SceneManager()
  const computer = new ComputerModel(sceneManager.scene)
  sceneManager.scene.add(computer.group)

  const screen = new ScreenRenderer(new Shell())
  computer.attachCRTMaterial(screen.canvasTexture)

  const camera = new CameraController(sceneManager.camera, computer.group, heroEl, t => hero.setProgress(t))
  new ResponsiveHandler(sceneManager.renderer, sceneManager.camera)

  const syncPause = (): void => sceneManager.setPaused(window.scrollY > heroEl.offsetHeight + 40)
  window.addEventListener('scroll', syncPause, { passive: true })
  syncPause()

  sceneManager.start((_delta, elapsed) => {
    camera.update()
    screen.update(elapsed * 1000)
    computer.updateShaderTime(elapsed)
  })
}

function init(): void {
  new Navigation().mount()

  const heroEl = byId('top')
  const hero = heroEl ? new Hero(heroEl) : null
  hero?.mount()

  const sections: [string, new (el: HTMLElement) => { mount(): void }][] = [
    ['experience', ExperienceSection],
    ['projects', ProjectCards],
    ['about', AboutSection],
    ['terminal', TerminalSection],
    ['contact', ContactSection],
  ]
  sections.forEach(([id, Ctor]) => {
    const el = byId(id)
    if (el) new Ctor(el).mount()
  })

  if (heroEl && hero && shouldRun3D()) {
    document.documentElement.classList.add('has-3d')
    start3D(heroEl, hero).catch(err => {
      console.error('3D scene failed, continuing without it', err)
      document.documentElement.classList.remove('has-3d')
      document.documentElement.classList.add('no-3d')
    })
  } else {
    document.documentElement.classList.add('no-3d')
  }

  // Privacy friendly page view analytics. Turn on "Web Analytics" for this project in the Vercel dashboard.
  inject()
}

init()
