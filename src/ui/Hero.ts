import { personal, heroProof } from '@/data/personal'
import { esc } from '@/utils/dom'

/**
 * The first screen. Answers the three questions a recruiter has in the first 5 seconds:
 * who is this, what do they do, and what should I click.
 */
export class Hero {
  private root: HTMLElement
  private content: HTMLElement | null = null

  constructor(root: HTMLElement) {
    this.root = root
  }

  mount(): void {
    const proof = heroProof
      .map(p => `
        <li class="hero__proof-item">
          <span class="hero__proof-value">${esc(p.value)}</span>
          <span class="hero__proof-label">${esc(p.label)}</span>
        </li>`)
      .join('')

    this.root.innerHTML = `
      <div class="hero__sticky">
        <div class="hero__content">
          <p class="hero__status"><span class="hero__status-dot" aria-hidden="true"></span>${esc(personal.availability)}</p>
          <h1 class="hero__name">${esc(personal.name)}</h1>
          <p class="hero__role">${esc(personal.role)} <span class="hero__role-sep" aria-hidden="true">/</span> ${esc(personal.tagline)}</p>
          <p class="hero__pitch">${esc(personal.pitch)}</p>
          <ul class="hero__proof" aria-label="Selected results">${proof}</ul>
          <div class="hero__cta">
            <a class="btn btn--primary" href="#experience">See my work</a>
            <a class="btn btn--secondary" href="${esc(personal.resumePath)}" target="_blank" rel="noopener" data-track="resume-hero">Resume (PDF)</a>
            <a class="btn btn--ghost" href="mailto:${esc(personal.email)}">Email me</a>
          </div>
        </div>
        <p class="hero__scroll-hint" aria-hidden="true">scroll to boot the terminal</p>
      </div>
    `
    this.content = this.root.querySelector('.hero__sticky')
  }

  /** 0 at the top of the page, 1 when the camera has fully zoomed into the screen. */
  setProgress(t: number): void {
    if (!this.content) return
    const fade = Math.max(0, 1 - t * 2.2)
    this.content.style.setProperty('--hero-fade', fade.toFixed(3))
    this.content.classList.toggle('is-hidden', fade <= 0.01)
  }
}
