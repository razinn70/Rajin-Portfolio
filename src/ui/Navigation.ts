import { personal } from '@/data/personal'

export class Navigation {
  private nav: HTMLElement | null = null
  private mobileMenu: HTMLElement | null = null
  private hamburger: HTMLButtonElement | null = null
  private menuOpen = false

  mount(): void {
    this.nav = document.createElement('nav')
    this.nav.className = 'nav'
    this.nav.setAttribute('aria-label', 'Main navigation')

    this.nav.innerHTML = `
      <div class="nav__inner">
        <a href="#" class="nav__logo" aria-label="Rajin Uddin — Home">RU</a>
        <ul class="nav__links" role="list">
          <li><a href="#projects" class="nav__link">work</a></li>
          <li><a href="#about" class="nav__link">about</a></li>
          <li><a href="#contact" class="nav__link">contact</a></li>
        </ul>
        <a href="${personal.resumePath}" download class="nav__resume" aria-label="Download Resume PDF">resume</a>
        <button class="nav__hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-nav">
          <span class="nav__hamburger-line"></span>
          <span class="nav__hamburger-line"></span>
          <span class="nav__hamburger-line"></span>
        </button>
      </div>
    `

    // Mobile menu (separate element)
    this.mobileMenu = document.createElement('div')
    this.mobileMenu.id = 'mobile-nav'
    this.mobileMenu.className = 'nav__mobile'
    this.mobileMenu.setAttribute('role', 'dialog')
    this.mobileMenu.setAttribute('aria-modal', 'true')
    this.mobileMenu.setAttribute('aria-label', 'Mobile navigation')
    this.mobileMenu.innerHTML = `
      <ul role="list" style="list-style:none;display:flex;flex-direction:column;align-items:center;gap:48px">
        <li><a href="#projects" class="nav__link" style="font-size:2rem">work</a></li>
        <li><a href="#about"    class="nav__link" style="font-size:2rem">about</a></li>
        <li><a href="#contact"  class="nav__link" style="font-size:2rem">contact</a></li>
        <li><a href="${personal.resumePath}" download class="nav__resume" style="font-size:1rem">resume</a></li>
      </ul>
    `

    document.body.prepend(this.mobileMenu)
    document.body.prepend(this.nav)

    this.hamburger = this.nav.querySelector('.nav__hamburger')
    this.hamburger?.addEventListener('click', () => this.toggleMenu())

    // Close on mobile link click
    this.mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => this.closeMenu())
    )

    // Scroll class
    window.addEventListener('scroll', this.onScroll, { passive: true })
  }

  private toggleMenu(): void {
    this.menuOpen ? this.closeMenu() : this.openMenu()
  }

  private openMenu(): void {
    this.menuOpen = true
    this.mobileMenu?.classList.add('is-open')
    this.hamburger?.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'
  }

  private closeMenu(): void {
    this.menuOpen = false
    this.mobileMenu?.classList.remove('is-open')
    this.hamburger?.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
  }

  private onScroll = (): void => {
    if (!this.nav) return
    if (window.scrollY > 50) {
      this.nav.classList.add('nav--scrolled')
    } else {
      this.nav.classList.remove('nav--scrolled')
    }
  }

  dispose(): void {
    window.removeEventListener('scroll', this.onScroll)
    this.nav?.remove()
    this.mobileMenu?.remove()
  }
}
