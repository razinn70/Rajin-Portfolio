import { personal } from '@/data/personal'
import { esc } from '@/utils/dom'

const LINKS = [
  { href: '#experience', label: 'experience' },
  { href: '#projects', label: 'projects' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
]

export class Navigation {
  private nav!: HTMLElement
  private panel!: HTMLElement
  private toggle!: HTMLButtonElement
  private open = false

  mount(): void {
    const skip = document.createElement('a')
    skip.className = 'skip-link'
    skip.href = '#main-content'
    skip.textContent = 'Skip to content'

    const linkItems = LINKS.map(l => `<li><a href="${l.href}" class="nav__link">${l.label}</a></li>`).join('')

    this.nav = document.createElement('header')
    this.nav.className = 'nav'
    this.nav.innerHTML = `
      <nav class="nav__inner" aria-label="Main">
        <a href="#top" class="nav__logo">RU<span class="sr-only">, ${esc(personal.name)}, back to top</span></a>
        <ul class="nav__links">${linkItems}</ul>
        <a href="${esc(personal.resumePath)}" target="_blank" rel="noopener" class="btn btn--secondary btn--sm nav__resume" data-track="resume-nav">Resume</a>
        <button class="nav__toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-panel">
          <span class="nav__toggle-line"></span><span class="nav__toggle-line"></span>
        </button>
      </nav>
      <div class="nav__panel" id="nav-panel" hidden>
        <ul>${linkItems}<li><a href="${esc(personal.resumePath)}" target="_blank" rel="noopener" class="nav__link">resume (pdf)</a></li></ul>
      </div>`

    document.body.prepend(this.nav)
    document.body.prepend(skip)

    this.panel = this.nav.querySelector('.nav__panel')!
    this.toggle = this.nav.querySelector('.nav__toggle')!
    this.toggle.addEventListener('click', () => this.setOpen(!this.open))
    this.panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => this.setOpen(false)))
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.open) {
        this.setOpen(false)
        this.toggle.focus()
      }
    })

    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.onScroll()
    this.watchSections()
  }

  private setOpen(open: boolean): void {
    this.open = open
    this.panel.hidden = !open
    this.toggle.setAttribute('aria-expanded', String(open))
    this.toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    this.nav.classList.toggle('nav--open', open)
    if (open) this.panel.querySelector<HTMLElement>('a')?.focus()
  }

  private onScroll = (): void => {
    this.nav.classList.toggle('nav--scrolled', window.scrollY > 24)
  }

  /** Highlight the nav item for the section in view, so people always know where they are. */
  private watchSections(): void {
    if (!('IntersectionObserver' in window)) return
    const links = Array.from(this.nav.querySelectorAll<HTMLAnchorElement>('.nav__links .nav__link'))
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        links.forEach(a => {
          const on = a.getAttribute('href') === `#${e.target.id}`
          a.classList.toggle('is-active', on)
          if (on) a.setAttribute('aria-current', 'true')
          else a.removeAttribute('aria-current')
        })
      })
    }, { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach(l => {
      const el = document.querySelector(l.href)
      if (el) obs.observe(el)
    })
  }
}
