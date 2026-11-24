import { experience } from '@/data/experience'
import { esc, revealOnScroll } from '@/utils/dom'

export class ExperienceSection {
  constructor(private container: HTMLElement) {}

  mount(): void {
    const items = experience.map(e => `
      <li class="xp reveal">
        <div class="xp__meta">
          <span class="xp__period">${esc(e.period)}</span>
          <span class="xp__location">${esc(e.location)}</span>
        </div>
        <article class="xp__body" aria-label="${esc(e.role)} at ${esc(e.company)}">
          <h3 class="xp__role">${esc(e.role)} <span class="xp__company">at ${esc(e.company)}</span>
            ${e.current ? '<span class="badge badge--live">now</span>' : ''}
          </h3>
          <ul class="xp__bullets">
            ${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}
          </ul>
        </article>
      </li>`).join('')

    this.container.innerHTML = `
      <div class="section-container">
        <header class="section-head">
          <p class="section-eyebrow">01 / experience</p>
          <h2 class="section-title">Where I have shipped</h2>
        </header>
        <ol class="xp-list">${items}</ol>
      </div>`
    revealOnScroll(this.container)
  }
}
