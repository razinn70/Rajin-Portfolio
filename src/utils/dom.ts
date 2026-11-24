const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

/** Escape text before it goes into an innerHTML template. Every interpolated data value must pass through this. */
export function esc(value: string): string {
  return value.replace(/[&<>"']/g, ch => ESCAPES[ch])
}

/** Fade elements with .reveal in once they enter the viewport. Staggers siblings via JS (inline style attributes are blocked by the CSP). */
export function revealOnScroll(root: ParentNode): void {
  const els = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'))
    return
  }
  els.forEach((el, i) => el.style.setProperty('transition-delay', `${Math.min(i, 4) * 60}ms`))
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible')
        obs.unobserve(e.target)
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  els.forEach(el => obs.observe(el))
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Clipboard with a fallback for browsers or contexts without the async API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the legacy path */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.className = 'sr-only'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  ta.remove()
  return ok
}
