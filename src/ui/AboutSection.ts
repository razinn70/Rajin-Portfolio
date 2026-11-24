import { personal } from '@/data/personal'
import { skills } from '@/data/skills'
import { esc, revealOnScroll } from '@/utils/dom'

const BIO = [
  'I grew up in Dhaka and came to Guelph for Computer Science, with a minor in Project Management. I graduate in May 2027.',
  'Most of what I know came from shipping. At MapleKey Media I run engineering for a small agency: client sites, lead funnels, the intake platform, and an AI agent that finds new prospects. Clients judge the work by one thing, whether more people reach out, so I measure that.',
  'The Project Management minor shows up in how I work. I ran Scrum for a 6 person team on JadeEd and I like owning a problem from the first conversation to the release.',
]

export class AboutSection {
  constructor(private container: HTMLElement) {}

  mount(): void {
    const skillsHTML = skills.map(cat => `
      <div class="skills__group">
        <h3 class="skills__label">${esc(cat.category)}</h3>
        <ul class="tags">${cat.skills.map(s => `<li class="tag">${esc(s)}</li>`).join('')}</ul>
      </div>`).join('')

    this.container.innerHTML = `
      <div class="section-container about">
        <header class="section-head">
          <p class="section-eyebrow">03 / about</p>
          <h2 class="section-title">The person behind the commits</h2>
        </header>
        <div class="about__grid">
          <div class="about__bio reveal">
            ${BIO.map(p => `<p>${esc(p)}</p>`).join('')}
            <p class="about__next"><strong>Next:</strong> ${esc(personal.availability)}.</p>
          </div>
          <div class="skills reveal" aria-label="Technical skills">${skillsHTML}</div>
        </div>
      </div>`
    revealOnScroll(this.container)
  }
}
