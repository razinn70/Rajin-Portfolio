# Rajin Uddin, portfolio

Personal site: **https://rajin-portfolio.vercel.app**

A recruiter friendly portfolio with a scroll driven 3D retro computer and a working terminal you can type into.

## What is in here
- **Hero, experience, projects, about, contact** rendered from typed data in `src/data/`
- **3D scene** (Three.js): a CRT computer that the camera zooms into as you scroll. It boots and types `whoami` on its own. Loaded lazily and only on desktop, so phones get a fast, plain page.
- **Terminal section**: a real, accessible shell with a virtual file system (`ls`, `cd`, `cat`, `skills`, `contact`, `resume`, history and Tab completion)
- **Strict security headers** (CSP without `unsafe-inline`, HSTS, Permissions Policy) in `vercel.json`
- Self hosted fonts, Vercel Web Analytics, Open Graph card, sitemap

## Run it
```bash
npm install
npm run dev       # local dev server
npm run build     # type check + production build to dist/
npm run preview   # serve the production build
```

## Structure
```
src/
  data/        all site content (keep in sync with public/resume/*.pdf)
  ui/          section components (Hero, Experience, Projects, About, Terminal, Contact, Navigation)
  scene/       Three.js scene, camera zoom, resize handling
  computer/    3D computer model, CRT shader, screen renderer
  terminal/    shell, virtual file system, commands, history
  styles/      design tokens and section styles
  utils/       escaping, reveal on scroll, clipboard helpers
public/        resume PDF, OG image, favicon, robots.txt, sitemap.xml
```

See `CLAUDE.md` for the rules any contributor (human or AI) must follow.
