import { personal } from '@/data/personal'
import { skills } from '@/data/skills'

const BIO_LINES = [
  'I build things that work and look good doing it.',
  '',
  'From Dhaka to Guelph — 3rd-year CS student at the University of Guelph,',
  'minor in Project Management, graduating May 2027.',
  '',
  'Right now I lead dev at MapleKey Media: sole developer on a full-stack',
  'platform that replaced a manual intake process and ships 24-hour',
  'turnaround at scale. Before that, 15+ web apps at PixelPro Analytics.',
  '',
  `Next: Summer 2026 internship at a company shipping software that matters.`,
]

export class AboutSection {
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  mount(): void {
    const skillsHTML = skills
      .map(cat => `
        <div class="skills-category">
          <div class="skills-category__label">${cat.category}</div>
          <div class="skills-category__tags">
            ${cat.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
      `)
      .join('')

    const bioHTML = BIO_LINES
      .map(line => line === '' ? '<p>&nbsp;</p>' : `<p>${line}</p>`)
      .join('')

    this.container.innerHTML = `
      <div class="section-container">
        <p class="section-title">about</p>
        <div class="mac-window reveal">
          <div class="mac-titlebar">
            <div class="mac-buttons">
              <span class="mac-btn mac-btn--close" aria-hidden="true"></span>
              <span class="mac-btn mac-btn--min"   aria-hidden="true"></span>
              <span class="mac-btn mac-btn--max"   aria-hidden="true"></span>
            </div>
            <span class="mac-title">about.md — ${personal.name}</span>
          </div>
          <div class="mac-body">
            <div class="mac-prompt">
              <span class="mac-prompt__symbol">$</span>
              <span class="mac-prompt__cmd">cat ~/about.md</span>
            </div>
            <div class="mac-output" id="about-bio">
              ${bioHTML}
            </div>
            <div class="skills-grid">
              ${skillsHTML}
            </div>
          </div>
        </div>
      </div>
    `

    this.setupReveal()
    this.setupTypingEffect()
  }

  private setupTypingEffect(): void {
    const bioEl = this.container.querySelector<HTMLElement>('#about-bio')
    if (!bioEl) return

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          bioEl.style.opacity = '0'
          setTimeout(() => {
            bioEl.style.transition = 'opacity 0.8s ease'
            bioEl.style.opacity = '1'
          }, 200)
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.3 }
    )
    obs.observe(bioEl)
  }

  private setupReveal(): void {
    const revealEls = this.container.querySelectorAll<HTMLElement>('.reveal')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.1 }
    )
    revealEls.forEach(el => obs.observe(el))
  }
}
