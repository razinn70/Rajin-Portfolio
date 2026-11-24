import { Shell } from '@/terminal/Shell'
import { revealOnScroll } from '@/utils/dom'

const SUGGESTIONS = ['help', 'whoami', 'ls projects', 'cat projects/jadeed.md', 'skills']

/**
 * A real, accessible terminal: a native <input> plus an output log.
 * Works with a keyboard, a screen reader, and a phone keyboard, unlike the 3D screen.
 */
export class TerminalSection {
  private shell = new Shell()
  private output!: HTMLElement
  private input!: HTMLInputElement
  private promptEl!: HTMLElement
  private rendered = 0

  constructor(private container: HTMLElement) {}

  mount(): void {
    this.container.innerHTML = `
      <div class="section-container">
        <header class="section-head">
          <p class="section-eyebrow">04 / terminal</p>
          <h2 class="section-title">Prefer the command line?</h2>
          <p class="section-lede">Everything above is also a file system. Type a command or tap one below.</p>
        </header>
        <div class="term reveal">
          <div class="term__bar"><span class="term__title">rajin@portfolio: ~</span></div>
          <div class="term__screen">
            <pre class="term__output" role="log" aria-live="polite" aria-label="Terminal output"></pre>
            <form class="term__form" autocomplete="off">
              <label class="term__prompt" for="term-input"></label>
              <input id="term-input" class="term__input" type="text" spellcheck="false"
                autocapitalize="off" autocorrect="off" enterkeyhint="send" aria-label="Terminal command" />
            </form>
          </div>
          <div class="term__chips" aria-label="Example commands">
            ${SUGGESTIONS.map(s => `<button type="button" class="chip" data-cmd="${s}">${s}</button>`).join('')}
          </div>
        </div>
      </div>`

    this.output = this.container.querySelector('.term__output')!
    this.input = this.container.querySelector('.term__input')!
    this.promptEl = this.container.querySelector('.term__prompt')!

    this.shell.addEventListener('terminal-output-changed', () => this.render())

    this.container.querySelector('form')!.addEventListener('submit', e => {
      e.preventDefault()
      this.run(this.input.value)
    })

    // History and tab completion reuse the shell's own key handling.
    this.input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Tab') {
        this.shell.setCurrentInput(this.input.value)
        this.shell.handleKeydown(e)
        this.input.value = this.shell.getCurrentInput()
      }
    })

    this.container.querySelectorAll<HTMLButtonElement>('.chip').forEach(btn =>
      btn.addEventListener('click', () => {
        this.run(btn.dataset['cmd'] ?? '')
        this.input.focus({ preventScroll: true })
      })
    )

    this.container.querySelector('.term__screen')!.addEventListener('click', () => {
      if (!window.getSelection()?.toString()) this.input.focus({ preventScroll: true })
    })

    this.shell.execute('whoami')
    revealOnScroll(this.container)
  }

  private run(cmd: string): void {
    this.shell.setCurrentInput(cmd)
    this.shell.execute(cmd)
    this.input.value = ''
  }

  private render(): void {
    const lines = this.shell.getHistory()
    if (lines.length < this.rendered) {
      this.output.textContent = ''
      this.rendered = 0
    }
    const frag = document.createDocumentFragment()
    for (const line of lines.slice(this.rendered)) {
      const div = document.createElement('div')
      if (line.startsWith(this.shell.getPromptPrefix())) {
        const cut = line.indexOf('$ ') + 2
        const p = document.createElement('span')
        p.className = 'term__ps1'
        p.textContent = line.slice(0, cut)
        div.append(p, document.createTextNode(line.slice(cut)))
      } else {
        div.textContent = line || ' '
      }
      frag.appendChild(div)
    }
    this.output.appendChild(frag)
    this.rendered = lines.length
    this.promptEl.textContent = this.shell.getPrompt()
    this.output.scrollTop = this.output.scrollHeight
  }
}
