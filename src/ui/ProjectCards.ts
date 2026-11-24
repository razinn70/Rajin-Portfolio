import { projects } from '@/data/projects'
import { esc, revealOnScroll } from '@/utils/dom'

export class ProjectCards {
  constructor(private container: HTMLElement) {}

  mount(): void {
    const cards = projects.map(p => {
      const links = [
        p.liveUrl ? `<a class="link-arrow" href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer">Live demo</a>` : '',
        p.githubUrl ? `<a class="link-arrow" href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer">Source</a>` : '',
      ].join('')
      return `
        <li class="project reveal${p.featured ? ' project--featured' : ''}">
          <article aria-labelledby="proj-${esc(p.slug)}">
            <header class="project__head">
              <p class="project__year">${esc(p.year)}${p.featured ? ' <span class="badge">featured</span>' : ''}</p>
              <h3 class="project__title" id="proj-${esc(p.slug)}">${esc(p.name)}</h3>
              <p class="project__subtitle">${esc(p.subtitle)}</p>
              <p class="project__role">${esc(p.role)}</p>
            </header>
            <dl class="project__story">
              <div><dt>Problem</dt><dd>${esc(p.problem)}</dd></div>
              <div><dt>Built</dt><dd>${esc(p.built)}</dd></div>
              <div class="project__result"><dt>Result</dt><dd>${esc(p.result)}</dd></div>
            </dl>
            <ul class="tags" aria-label="Tech stack">${p.techStack.map(t => `<li class="tag">${esc(t)}</li>`).join('')}</ul>
            ${links ? `<div class="project__links">${links}</div>` : ''}
          </article>
        </li>`
    }).join('')

    this.container.innerHTML = `
      <div class="section-container">
        <header class="section-head">
          <p class="section-eyebrow">02 / projects</p>
          <h2 class="section-title">Problems I picked and what came out</h2>
        </header>
        <ul class="project-grid">${cards}</ul>
      </div>`
    revealOnScroll(this.container)
  }
}
