# Rajin Uddin portfolio: rules for AI and humans editing this repo

Live: https://rajin-portfolio.vercel.app (Vercel, auto deploys from `main`).
Stack: TypeScript + Vite + Three.js, no framework. Static site, no backend.

## Who the site is for
Recruiters and engineers screening interns. They give it about 6 seconds before deciding to read on.
Every change must make one of these faster: knowing who Rajin is, believing the claims, contacting him.

## Source of truth
- Content lives only in `src/data/*.ts`. UI files render data, they never hold copy.
- `src/data/*` must match `public/resume/UddinRajinResume.pdf`. When the resume changes, update both in the same commit.
- Do not mention PixelPro Analytics anywhere.

## Hard rules (these broke the site before)
1. Never commit `.js` files inside `src/`. Vite resolves `.js` before `.ts`, so a stale compiled file silently replaces your source. `tsconfig.json` has `noEmit: true` and `.gitignore` blocks them. Keep it that way.
2. The CSP in `vercel.json` is strict: `script-src 'self'; style-src 'self'; font-src 'self'`.
   - No inline `style="..."` attributes in HTML strings. Use classes, or set styles from JS with `el.style.setProperty`.
   - No external fonts, scripts or CDNs. Fonts come from `@fontsource/*` and are bundled.
3. Every value interpolated into an `innerHTML` template goes through `esc()` from `src/utils/dom.ts`.
4. The 3D scene is optional decoration. The page must be complete without it (phones, tablets, no WebGL, reduced motion, context loss).
5. Text contrast must pass WCAG AA. Use the tokens in `src/styles/global.css`, never raw hex in components.

## Design system
- Palette: black basalt `#0B1013` background, bone `#E8F3F6` text, glacier blue `#1BA6CD` accent.
- Neutrals carry content. Glacier blue (`--color-accent`) is only for things you can click. Green (`--color-available`) only means "available for hire".
- One filled primary button per screen. Secondary is outlined, tertiary is ghost.
- Touch targets at least 44px. Body text 17px. Measure under 70ch.
- Section order follows what recruiters scan first: hero, experience, projects, about, terminal, contact.

## Copy voice
Direct, short, specific. State the result, then how. No "leveraged", "utilized", "passionate".
No em dashes and no hyphens in prose (write "full stack", "4th year", "2 week").
Every number on the site must be defensible in an interview.

## Checks before pushing
```
npm run build          # must pass with zero TypeScript errors
npm run preview        # click through hero, terminal (try `ls`, `cat projects/jadeed.md`), contact copy button
```
Then run Lighthouse (mobile) and axe. Targets: Performance 90+, Accessibility 100, zero console errors.
