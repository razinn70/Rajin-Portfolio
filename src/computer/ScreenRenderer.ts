import * as THREE from 'three'
import type { Shell } from '@/terminal/Shell'

// Rendered at 2x so text stays sharp when the camera fills the viewport with the screen.
const CANVAS_W = 1024
const CANVAS_H = 768
const FONT_SIZE = 26
const LINE_HEIGHT = 38
const PADDING = 40
const CURSOR_W = 14
const MAX_LINES = Math.floor((CANVAS_H - PADDING * 2) / LINE_HEIGHT)

const COLOR_BG = '#050c10'
const COLOR_TEXT = '#d4eef5'
const COLOR_DIM = '#5f8794'
const COLOR_PROMPT = '#3dbbdd'
const COLOR_CURSOR = '#3dbbdd'

const BOOT_LINES = [
  'RU-BIOS 2.0  rajin@portfolio',
  'Checking system................ OK',
  'Loading THREE.js scene......... OK',
  'Mounting virtual filesystem.... OK',
  'Starting terminal.............. OK',
  '',
  'Ready.',
  '',
]

const AUTOPLAY = ['whoami', 'ls']

export class ScreenRenderer {
  readonly canvasTexture: THREE.CanvasTexture

  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private shell: Shell
  private dirty = true
  private fontsReady = false
  private screenVisible = false
  private bootDone = false
  private bootLines: string[] = []
  private cursorVisible = true
  private lastCursorToggle = 0
  private autoplayed = false
  private charW = 0

  constructor(shell: Shell) {
    this.shell = shell

    this.canvas = document.createElement('canvas')
    this.canvas.width = CANVAS_W
    this.canvas.height = CANVAS_H
    this.ctx = this.canvas.getContext('2d')!

    this.canvasTexture = new THREE.CanvasTexture(this.canvas)
    this.canvasTexture.minFilter = THREE.LinearFilter
    this.canvasTexture.magFilter = THREE.LinearFilter

    // Listen for shell output changes
    this.shell.addEventListener('terminal-output-changed', () => {
      this.dirty = true
    })

    // Show full terminal when camera zooms in
    window.addEventListener('crt-screen-visible', () => {
      this.screenVisible = true
      this.dirty = true
      if (!this.autoplayed && this.bootDone) this.autoplay()
    })

    // Pre-load font then start boot sequence
    document.fonts.load(`${FONT_SIZE}px "JetBrains Mono"`).then(() => {
      this.fontsReady = true
      this.startBoot()
    }).catch(() => {
      this.fontsReady = true
      this.startBoot()
    })
  }

  /** Type a couple of commands by itself so the zoom ends on real content instead of an empty prompt. */
  private autoplay(): void {
    this.autoplayed = true
    let c = 0
    const typeNext = (): void => {
      if (c >= AUTOPLAY.length) return
      const cmd = AUTOPLAY[c]
      let i = 0
      const tick = (): void => {
        i++
        this.shell.setCurrentInput(cmd.slice(0, i))
        if (i < cmd.length) {
          window.setTimeout(tick, 70)
        } else {
          window.setTimeout(() => {
            this.shell.execute(cmd)
            c++
            window.setTimeout(typeNext, 500)
          }, 250)
        }
      }
      tick()
    }
    typeNext()
  }

  /** Canvas text does not wrap on its own. Break long lines so nothing runs off the screen. */
  private wrap(lines: string[]): string[] {
    const max = Math.max(20, Math.floor((CANVAS_W - PADDING * 2) / (this.charW || FONT_SIZE * 0.6)))
    const out: string[] = []
    for (const line of lines) {
      if (line.length <= max) { out.push(line); continue }
      let rest = line
      while (rest.length > max) {
        let cut = rest.lastIndexOf(' ', max)
        if (cut <= 0) cut = max
        out.push(rest.slice(0, cut))
        rest = '  ' + rest.slice(cut).trimStart()
      }
      out.push(rest)
    }
    return out
  }

  private startBoot(): void {
    this.bootLines = []

    const addLine = (i: number): void => {
      if (i >= BOOT_LINES.length) {
        this.bootDone = true
        this.dirty = true
        if (this.screenVisible && !this.autoplayed) this.autoplay()
        return
      }
      this.bootLines.push(BOOT_LINES[i])
      this.dirty = true
      setTimeout(() => addLine(i + 1), i === 0 ? 200 : 180)
    }

    addLine(0)
  }

  update(now: number): void {
    if (!this.fontsReady) return

    // Cursor blink every 530ms
    if (now - this.lastCursorToggle > 530) {
      this.cursorVisible = !this.cursorVisible
      this.lastCursorToggle = now
      this.dirty = true
    }

    if (!this.dirty) return
    this.dirty = false

    this.draw()
    this.canvasTexture.needsUpdate = true
  }

  private draw(): void {
    const ctx = this.ctx

    // Background
    ctx.fillStyle = COLOR_BG
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    // Subtle glacier blue gradient overlay (CRT phosphor glow)
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
    grad.addColorStop(0, 'rgba(27,166,205,0.06)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`
    ctx.textBaseline = 'top'
    if (!this.charW) this.charW = ctx.measureText('M').width

    if (!this.bootDone) {
      this.drawBootLines()
    } else if (this.screenVisible) {
      this.drawTerminal()
    } else {
      this.drawBootLines()
    }
  }

  private drawBootLines(): void {
    const ctx = this.ctx
    let y = PADDING

    for (const line of this.bootLines) {
      ctx.fillStyle = line.startsWith('BIOS') ? COLOR_PROMPT : COLOR_DIM
      ctx.fillText(line, PADDING, y)
      y += LINE_HEIGHT
    }

    // Blinking cursor on last line if boot not done
    if (!this.bootDone && this.cursorVisible) {
      ctx.fillStyle = COLOR_CURSOR
      ctx.fillRect(PADDING, y, CURSOR_W, FONT_SIZE)
    }
  }

  private drawTerminal(): void {
    const ctx = this.ctx
    const history = this.wrap(this.shell.getHistory())

    // Show the last lines that fit, leaving a row for the live prompt
    const visible = history.slice(-(MAX_LINES - 1))
    let y = PADDING

    for (const line of visible) {
      if (line.startsWith(this.shell.getPromptPrefix())) {
        // Prompt line — split into prompt + command
        const promptEnd = line.indexOf('$') + 2
        ctx.fillStyle = COLOR_PROMPT
        ctx.fillText(line.slice(0, promptEnd), PADDING, y)
        ctx.fillStyle = COLOR_TEXT
        ctx.fillText(line.slice(promptEnd), PADDING + ctx.measureText(line.slice(0, promptEnd)).width, y)
      } else if (line.startsWith('  ') || line === '') {
        ctx.fillStyle = COLOR_DIM
        ctx.fillText(line, PADDING, y)
      } else {
        ctx.fillStyle = COLOR_TEXT
        ctx.fillText(line, PADDING, y)
      }
      y += LINE_HEIGHT
    }

    // Current prompt + input
    const prompt = this.shell.getPrompt()
    ctx.fillStyle = COLOR_PROMPT
    ctx.fillText(prompt, PADDING, y)

    const promptWidth = ctx.measureText(prompt).width
    const input = this.shell.getCurrentInput()
    ctx.fillStyle = COLOR_TEXT
    ctx.fillText(input, PADDING + promptWidth, y)

    // Cursor
    if (this.cursorVisible) {
      const cursorX = PADDING + promptWidth + ctx.measureText(input).width
      ctx.fillStyle = COLOR_CURSOR
      ctx.fillRect(cursorX, y, CURSOR_W, FONT_SIZE)
    }
  }

  dispose(): void {
    this.canvasTexture.dispose()
  }
}
