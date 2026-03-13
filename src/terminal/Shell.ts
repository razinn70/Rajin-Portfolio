import { FileSystem } from './FileSystem'
import { History } from './History'
import { commands } from './Commands'
import { virtualFS } from '@/data/filesystem'

export class Shell extends EventTarget {
  private fs: FileSystem
  private hist: History
  private outputHistory: string[] = []
  private currentInput = ''
  readonly PROMPT_PREFIX = 'rajin@rajinuddin.dev:'

  constructor() {
    super()
    this.fs = new FileSystem(virtualFS)
    this.hist = new History()
  }

  getHistory(): string[] {
    return this.outputHistory
  }

  getPromptPrefix(): string {
    return this.PROMPT_PREFIX
  }

  getPrompt(): string {
    return `${this.PROMPT_PREFIX}${this.fs.getPromptPath()}$ `
  }

  getCurrentInput(): string {
    return this.currentInput
  }

  setCurrentInput(input: string): void {
    this.currentInput = input
    this.dispatchChange()
  }

  execute(rawInput: string): void {
    const input = rawInput.trim()

    // Echo prompt + command to history
    this.outputHistory.push(this.getPrompt() + input)

    if (input === '') {
      this.dispatchChange()
      return
    }

    const parts = input.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    const handler = commands[cmd]
    if (!handler) {
      this.outputHistory.push(`command not found: ${cmd}. Type "help" for available commands.`)
    } else {
      const result = handler(args, this.fs)

      if (result.clear) {
        this.outputHistory = []
      } else if (result.output) {
        // Split multi-line output into separate history lines
        const lines = result.output.split('\n')
        this.outputHistory.push(...lines)
      }
    }

    this.hist.push(input)
    this.currentInput = ''
    this.dispatchChange()
  }

  handleKeydown(e: KeyboardEvent): boolean {
    if (e.key === 'Enter') {
      this.execute(this.currentInput)
      return true
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = this.hist.prev()
      if (prev !== null) {
        this.currentInput = prev
        this.dispatchChange()
      }
      return true
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = this.hist.next()
      if (next !== null) {
        this.currentInput = next
        this.dispatchChange()
      }
      return true
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      this.handleTab()
      return true
    }

    if (e.key === 'Backspace') {
      this.currentInput = this.currentInput.slice(0, -1)
      this.dispatchChange()
      return true
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      this.outputHistory = []
      this.dispatchChange()
      return true
    }

    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      this.outputHistory.push(this.getPrompt() + this.currentInput + '^C')
      this.currentInput = ''
      this.dispatchChange()
      return true
    }

    // Printable characters
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      this.currentInput += e.key
      this.dispatchChange()
      return true
    }

    return false
  }

  private handleTab(): void {
    const lastWord = this.currentInput.split(/\s+/).pop() ?? ''
    const completions = this.fs.complete(lastWord)

    if (completions.length === 1) {
      const base = this.currentInput.slice(0, this.currentInput.length - lastWord.length)
      this.currentInput = base + completions[0]
      this.dispatchChange()
    } else if (completions.length > 1) {
      this.outputHistory.push(completions.join('  '))
      this.dispatchChange()
    }
  }

  private dispatchChange(): void {
    this.dispatchEvent(new Event('terminal-output-changed'))
  }
}
