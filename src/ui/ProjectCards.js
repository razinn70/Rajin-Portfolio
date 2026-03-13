import { projects } from '@/data/projects';
import { experience } from '@/data/experience';
export class ProjectCards {
    container;
    constructor(container) {
        this.container = container;
    }
    mount() {
        const projectsHTML = projects.map((p, i) => `
      <div class="timeline__item reveal" style="transition-delay:${i * 80}ms">
        <div class="timeline__year">${p.year}</div>
        <article class="project-card" aria-label="${p.name}">
          <div class="project-card__header">
            <div>
              <h3 class="project-card__title">${p.name}</h3>
              <div class="project-card__subtitle">${p.subtitle}</div>
            </div>
          </div>
          <p class="project-card__description">${p.description}</p>
          <p class="project-card__impact">${p.impact}</p>
          <div class="tech-tags">
            ${p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </article>
      </div>
    `).join('');
        const experienceHTML = experience.map((e, i) => `
      <div class="timeline__item reveal" style="transition-delay:${i * 80}ms">
        <article class="experience-card" aria-label="${e.role} at ${e.company}">
          <div class="experience-card__header">
            <div>
              <div class="experience-card__role">
                ${e.role}
                ${e.current ? '<span class="experience-card__current">current</span>' : ''}
              </div>
              <div class="experience-card__company">${e.company} — ${e.location}</div>
            </div>
            <div class="experience-card__period">${e.period}</div>
          </div>
          <ul class="experience-card__bullets">
            ${e.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </article>
      </div>
    `).join('');
        this.container.innerHTML = `
      <div class="section-container">
        <p class="section-title">projects</p>
        <div class="timeline projects__grid">
          ${projectsHTML}
        </div>
        <p class="section-title" style="margin-top:64px">experience</p>
        <div class="timeline">
          ${experienceHTML}
        </div>
      </div>
    `;
        this.setupReveal();
    }
    setupReveal() {
        const revealEls = this.container.querySelectorAll('.reveal');
        const obs = new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                obs.unobserve(e.target);
            }
        }), { threshold: 0.1 });
        revealEls.forEach(el => obs.observe(el));
    }
}
