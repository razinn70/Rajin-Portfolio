# rajinuddin.dev -- Enterprise PRD v2.0

## ICM Workspace | Personal Portfolio Website

**Owner:** Rajin Uddin
**Version:** 2.0 -- Production Hardened
**Date:** March 13, 2026
**Status:** Pre-Launch Security Review Complete
**Classification:** Internal -- Engineering

---

## 0. Document Control

| Field | Value |
|-------|-------|
| Author | Rajin Uddin |
| Reviewers | -- |
| Last Updated | 2026-03-13 |
| Review Cadence | Biweekly during active development |
| Source of Truth | This document. All stage CONTEXT.md files defer here. |

### Revision History

| Version | Date | Change Summary |
|---------|------|----------------|
| 1.0 | 2026-03-13 | Initial PRD with ICM workspace structure |
| 2.0 | 2026-03-13 | Security audit, production hardening, enterprise alignment |

---

## 1. Executive Summary

### 1.1 Problem Statement

Rajin Uddin's current portfolio is a single-file HTML page (Res.html) with no build pipeline, no security headers beyond basic Vercel defaults, and no interactive differentiation from thousands of competing student portfolios. Recruiters spend 6-8 seconds on a portfolio. The current site does not command that attention, nor does it demonstrate the engineering depth required for FAANG-tier internship applications.

### 1.2 Proposed Solution

A complete rebuild using a multi-folder TypeScript architecture with THREE.js for 3D rendering, inspired by edh.dev (Ed Hinrichsen's Awwwards Honorable Mention portfolio). The site features an interactive 3D retro computer as the primary interface element, a functional UNIX-like terminal, smooth scroll-driven zoom transitions, and a minimalist peach-and-black color palette. Deployed via Vercel with production-grade security headers, performance budgets, and accessibility compliance.

### 1.3 Target Users

| Persona | Context | Success Criteria |
|---------|---------|-----------------|
| Technical Recruiter | Scanning 50+ portfolios/day, mobile or desktop | Understands Rajin's value in < 6 seconds |
| Engineering Lead | Evaluating technical depth for intern screening | Finds evidence of systems thinking and clean code |
| Hiring Manager (Canadian Banks) | Assessing fit for RBC/BMO/TD summer programs | Sees professional presentation and measurable impact |
| Fellow Developer | Browsing GitHub, evaluating open-source quality | Finds clean architecture, good docs, proper conventions |

### 1.4 Out of Scope

- Backend server or database (static site only)
- User authentication or login flows
- CMS or admin content editing (content lives in TypeScript data files)
- E-commerce or payment processing
- Blog/CMS integration (post-MVP consideration)
- Native mobile app

### 1.5 Assumptions

1. The domain rajinuddin.dev is available and will be purchased before launch
2. Vercel free tier is sufficient for expected traffic (< 100 GB bandwidth/month)
3. The 3D model will be created in Blender and exported as DRACO-compressed GLTF
4. JetBrains Mono (current implementation) or Chill Pixels Mono will be used as terminal font
5. Resume PDF will be manually updated and placed in /public/resume/

### 1.6 Dependencies

| Dependency | Owner | Risk | Mitigation |
|-----------|-------|------|------------|
| THREE.js r160+ | THREE.js maintainers | Breaking API changes | Pin to exact version in package.json |
| Vercel deployment | Vercel | Service outage | Static export fallback; site works as plain HTML |
| GitHub API | GitHub | Rate limiting (60 req/hr unauthenticated) | Static fallback data in src/data/projects.ts |
| Google Fonts (JetBrains Mono, Inter) | Google | CDN outage | Local font fallback stack; font-display: swap |
| Domain registrar | TBD | DNS propagation delay | Register 72 hours before planned launch |

---

## 2. Security Audit -- Current Codebase

### 2.1 Critical Findings

**FINDING S-01: innerHTML Used Without Sanitization (Severity: HIGH)**

Every UI component (AboutSection.ts, ContactSection.ts, ProjectCards.ts, Navigation.ts, LoadingScreen.ts) uses `innerHTML` to render content. While the data currently comes from static TypeScript files (not user input), this pattern is dangerous because:

- If any data source is ever connected to external input (GitHub API, URL parameters), it becomes an XSS vector immediately
- innerHTML parses and executes any HTML, including `<script>` tags and event handlers
- This violates OWASP secure coding guidelines

Affected files:
- `src/ui/AboutSection.ts` -- lines using `this.container.innerHTML = ...`
- `src/ui/ContactSection.ts` -- same pattern
- `src/ui/ProjectCards.ts` -- same pattern
- `src/ui/Navigation.ts` -- same pattern

**Remediation:** Replace innerHTML with DOM API methods (createElement, textContent, appendChild) for all dynamic content. For template-heavy components, use a sanitization library (DOMPurify) or tagged template literals with escaping.

---

**FINDING S-02: CSP Uses 'unsafe-inline' (Severity: HIGH)**

The current vercel.json CSP header includes:
```
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```

`'unsafe-inline'` for script-src defeats the primary purpose of CSP (XSS mitigation). Any injected inline script will execute. `'unsafe-inline'` for style-src is less critical but still weakens the policy.

**Remediation:**
1. Remove `'unsafe-inline'` from script-src. The codebase already uses external .ts/.js files compiled by Vite -- no inline scripts are needed.
2. For style-src, move all inline styles (LoadingScreen.ts, Cursor.ts use `Object.assign(el.style, {...})`) to CSS classes. Then remove `'unsafe-inline'` from style-src or use nonce-based CSP.
3. Add `style-src-elem` directive for Google Fonts specifically.

---

**FINDING S-03: Missing Security Headers (Severity: MEDIUM)**

The current vercel.json includes X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, and a basic CSP. Missing headers:

| Header | Purpose | Priority |
|--------|---------|----------|
| Referrer-Policy | Prevents leaking referrer data to external sites | High |
| Permissions-Policy | Disables unused browser APIs (camera, microphone, etc.) | High |
| Strict-Transport-Security (HSTS) | Forces HTTPS for all subsequent visits | High |
| X-Permitted-Cross-Domain-Policies | Prevents Flash/PDF cross-domain access | Low |

**Remediation:** Add to vercel.json headers:
```json
{ "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
{ "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
{ "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
```

---

**FINDING S-04: No Subresource Integrity (SRI) for External Resources (Severity: MEDIUM)**

Google Fonts are loaded via `<link>` in index.html without integrity attributes. If the Google Fonts CDN is compromised, malicious CSS could be injected.

**Remediation:** Self-host fonts (recommended for performance anyway) or add SRI hashes. Self-hosting also eliminates the privacy concern of Google tracking font requests.

---

### 2.2 Moderate Findings

**FINDING S-05: Terminal Input Not Rate-Limited (Severity: LOW)**

The Shell.ts handleKeydown method processes every keystroke without throttling. While this is a local-only terminal (no server communication), rapid key events could cause excessive canvas redraws on low-end devices.

**Remediation:** Add a requestAnimationFrame gate on ScreenRenderer redraws (already partially implemented via the dirty flag). Consider debouncing rapid-fire keydown events.

---

**FINDING S-06: Clipboard API Without Feature Detection (Severity: LOW)**

ContactSection.ts uses `navigator.clipboard.writeText()` with a bare try/catch. The catch block silently fails. Users on HTTP (localhost during dev) or older browsers get no feedback.

**Remediation:** Add explicit feature detection. Provide fallback copy mechanism (textarea + execCommand) for unsupported environments. Show user-facing error state if copy fails.

---

**FINDING S-07: open Command Creates Clickjacking Vector (Severity: LOW)**

Commands.ts `open` command creates an `<a>` element, appends it to the body, clicks it, then removes it. This pattern can be flagged by security scanners. The links are hardcoded to personal.githubUrl and personal.linkedinUrl, so the actual risk is minimal.

**Remediation:** Use `window.open()` with rel=noopener instead of the DOM element click pattern.

---

**FINDING S-08: No Error Boundary for THREE.js (Severity: MEDIUM)**

If THREE.js fails to initialize (GPU driver crash, WebGL context loss, out-of-memory), the entire page breaks with no recovery. The hasWebGL() check only detects initial capability, not runtime failures.

**Remediation:** Add a `webglcontextlost` event listener on the canvas. On context loss, hide the 3D scene and show the mobile-hero fallback. Add a global error handler for unhandled promise rejections from the init() chain.

---

### 2.3 Informational Findings

**FINDING S-09: Duplicate .js and .ts Files**

Every TypeScript source file has a corresponding compiled .js file committed to the repo. This doubles the attack surface for code inspection and creates confusion about which files are authoritative.

**Remediation:** Add compiled .js files to .gitignore. Only commit .ts source files. Let Vite compile during build.

---

**FINDING S-10: Hardcoded Admin Credentials Reference**

Previous portfolio iterations included hardcoded admin panel credentials (username: rajin_dev, password: UofG2025!). The current codebase does not include this, but any future admin panel must use environment variables, not hardcoded strings.

**Remediation:** If admin analytics dashboard is added (post-MVP), use Vercel environment variables + edge middleware for authentication. Never commit credentials to source.

---

## 3. Production Readiness Checklist

### 3.1 Build & Deploy

| Check | Status | Action Required |
|-------|--------|----------------|
| TypeScript strict mode enabled | PASS | tsconfig.json has strict: true |
| Vite production build works | PASS | npm run build configured |
| Tree-shaking enabled | PASS | Vite handles automatically |
| THREE.js vendor chunk split | PASS | vite.config.ts manualChunks configured |
| Source maps disabled in production | NEEDS CHECK | Verify Vite build.sourcemap is false |
| .env files excluded from repo | PASS | No .env files present |
| Node.js version pinned | NEEDS FIX | Add engines field to package.json |
| Lock file committed | NEEDS CHECK | Verify package-lock.json is in repo |

### 3.2 Performance

| Metric | Target | Current Estimate | Status |
|--------|--------|-----------------|--------|
| Lighthouse Performance | 95+ | Unknown (pre-launch) | PENDING |
| First Contentful Paint | < 1.5s | ~1.2s (loading screen masks) | LIKELY PASS |
| Largest Contentful Paint | < 2.5s | ~2.0s (depends on 3D model size) | AT RISK |
| Total Bundle Size (gzipped) | < 500KB | THREE.js alone ~150KB gzipped | NEEDS MONITORING |
| 3D Frame Rate | 60fps desktop / 30fps mobile | Untested | PENDING |
| Time to Interactive | < 3s on 4G | ~2.5s estimate | LIKELY PASS |

### 3.3 Accessibility

| Check | Status | Action Required |
|-------|--------|----------------|
| Semantic HTML structure | PASS | main, section, nav, article, footer used |
| ARIA labels on interactive elements | PASS | nav, buttons, links all labeled |
| Keyboard navigation | PARTIAL | Terminal works; project cards need focus styles |
| Screen reader compatibility | PARTIAL | 3D scene is decorative; content sections readable |
| prefers-reduced-motion respected | PASS | CSS and CameraController both check |
| Color contrast (WCAG AA) | NEEDS CHECK | Peach on dark needs 4.5:1 ratio verification |
| Skip navigation link | MISSING | Add "Skip to main content" link |
| Focus visible styles | PARTIAL | Buttons have hover but missing :focus-visible |

### 3.4 SEO

| Check | Status | Action Required |
|-------|--------|----------------|
| Meta description | PASS | Present in index.html |
| Open Graph tags | PASS | og:title, og:description, og:image configured |
| Twitter Card tags | PASS | Summary large image configured |
| JSON-LD Person schema | PASS | Structured data in index.html |
| Canonical URL | PASS | Set to https://rajinuddin.dev |
| robots.txt | MISSING | Create /public/robots.txt |
| sitemap.xml | MISSING | Create /public/sitemap.xml |
| OG image file | MISSING | Need to generate og-image.png |

---

## 4. ICM Workspace Architecture

### 4.1 Layer Map

```
Layer 0: CLAUDE.md           "Where am I?"          Always loaded (~800 tokens)
Layer 1: CONTEXT.md          "Where do I go?"        Read on entry (~300 tokens)
Layer 2: Stage CONTEXT.md    "What do I do?"          Read per-task (~200-500 tokens)
Layer 3: Reference material  "What rules apply?"      Loaded selectively (varies)
Layer 4: Working artifacts   "What am I working with?" Loaded selectively (varies)
```

### 4.2 Workspace Structure

```
rajinuddin-portfolio/
├── CLAUDE.md
├── CONTEXT.md
├── setup/
│   └── questionnaire.md
├── _config/
│   ├── CONTEXT.md
│   ├── identity.md
│   ├── voice-rules.md
│   └── design-system.md
├── stages/
│   ├── 01-research/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── inspiration-analysis.md
│   │   │   └── competitor-audit.md
│   │   └── output/
│   │       └── .gitkeep
│   ├── 02-design/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── layout-patterns.md
│   │   │   └── interaction-patterns.md
│   │   └── output/
│   │       └── .gitkeep
│   ├── 03-content/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── resume-data.md
│   │   │   └── filesystem-map.md
│   │   └── output/
│   │       └── .gitkeep
│   ├── 04-build/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── build-conventions.md
│   │   │   ├── component-registry.md
│   │   │   └── shader-reference.md
│   │   └── output/
│   │       └── .gitkeep
│   ├── 05-security/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── security-checklist.md
│   │   │   └── owasp-frontend-top10.md
│   │   └── output/
│   │       └── .gitkeep
│   ├── 06-polish/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   └── performance-budget.md
│   │   └── output/
│   │       └── .gitkeep
│   └── 07-launch/
│       ├── CONTEXT.md
│       ├── references/
│       │   └── deployment-checklist.md
│       └── output/
│           └── .gitkeep
└── shared/
    ├── tech-stack.md
    ├── project-structure.md
    └── success-metrics.md
```

Note: Stage 05-security is new in v2.0. It sits between build and polish to ensure security hardening happens before performance optimization (some security changes affect bundle size and load behavior).

---

## 5. Stage Contracts

### Stage 01: Research

Analyze edh.dev and benchmark developer portfolios to extract design patterns, interaction models, and content strategies.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Config | ../../_config/identity.md | "Positioning" section | Who this site represents |
| Config | ../../_config/design-system.md | "Color Palette" section | Anchor analysis to palette |
| Reference | references/inspiration-analysis.md | Full file | edh.dev teardown framework |
| Reference | references/competitor-audit.md | Full file | Benchmark portfolio list |
| Shared | ../../shared/success-metrics.md | Full file | What "good" looks like |

**Process**

1. Fetch and analyze edh.dev: document 3D interaction model, scroll-zoom behavior, terminal UX, content structure, typography
2. Analyze 4-5 benchmark portfolios: layout patterns, project showcases, loading animations, mobile adaptations
3. For each site, extract: what works, what does not, what to adapt for Rajin
4. Identify 3 design patterns that matter most for recruiter conversion
5. Map findings to Rajin's resume content

**Checkpoints**

| After Step | Pause For |
|-----------|-----------|
| 3 | Present top 3 sites with pros/cons. User picks direction. |

**Audit**

| Check | Pass Condition |
|-------|---------------|
| edh.dev covered | Report includes scroll-zoom, terminal, CRT effects analysis |
| Actionable | Every observation maps to a concrete recommendation |
| Metric-aware | At least 2 findings tie to success metrics |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Research report | output/research-report.md | Markdown: edh.dev analysis, benchmarks, recommendations |

---

### Stage 02: Design

Produce a visual and interaction specification defining WHAT the site looks like and WHEN things happen -- not HOW they are implemented.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../01-research/output/research-report.md | Full file | Design recommendations |
| Config | ../../_config/design-system.md | Full file | Color, type, spacing, motion |
| Config | ../../_config/voice-rules.md | "Writing Constraints" | Content length limits |
| Reference | references/layout-patterns.md | Full file | Section wireframes |
| Reference | references/interaction-patterns.md | Full file | Scroll zoom, terminal UX |

**Process**

1. Extract top design recommendations from research report
2. Define 4-section hierarchy: Home, About, Projects, Contact
3. Write visual concept per section: what visitor sees, what draws attention, scroll behavior
4. Define scroll-zoom journey: full computer at top, zoom into screen, content fills viewport
5. Define retro Mac about section: window chrome, CRT interior, terminal rendering
6. Define project card layout: chronological cards, year markers, tech tags, impact metrics
7. Define loading screen: retro boot sequence
8. Define mobile adaptation per section

**Checkpoints**

| After Step | Pause For |
|-----------|-----------|
| 3 | Present section hierarchy with concepts. User approves or redirects. |
| 7 | Present loading screen concept. User approves or redirects. |

**Audit**

| Check | Pass Condition |
|-------|---------------|
| No HOW | Zero component names, zero CSS properties, zero frame numbers in spec |
| Mobile covered | Every section has explicit mobile adaptation note |
| Palette adherence | All color references use design system tokens |
| 6-second test | Visitor understands what Rajin does within 6 seconds |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Design spec | output/design-spec.md | Page journey, section specs, interaction model, mobile adaptations |

---

### Stage 03: Content

Structure all site content from resume into format-ready blocks and a virtual filesystem tree for the terminal.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../02-design/output/design-spec.md | "Section Specs" | Content slots to fill |
| Config | ../../_config/identity.md | Full file | Contact info, positioning |
| Config | ../../_config/voice-rules.md | Full file | Tone and length constraints |
| Reference | references/resume-data.md | Full file | Structured resume content |
| Reference | references/filesystem-map.md | Full file | Virtual FS directory tree |

**Process**

1. Read design spec for content slots per section
2. Write Home: name, tagline, one-sentence hook, CTA
3. Write About: personal narrative (Bangladesh to Guelph), retro Mac terminal format
4. Write each project: title, 2-sentence description (what + impact), tech tags, links
5. Write each experience: role, company, dates, 2 bullet points with metrics
6. Write Contact: email, phone, GitHub, LinkedIn, resume download
7. Build virtual filesystem: markdown content for each terminal file
8. Write terminal command responses: whoami, help, contact output
9. Validate all content against voice rules

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Voice compliance | Zero "utilized," "leveraged," "facilitated," or passive voice |
| Length compliance | Projects max 2 sentences, bio max 4 sentences |
| Metric coverage | Every project and experience has quantified impact |
| FS completeness | Every filesystem-map file has content written |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Site content | output/site-content.md | Section-by-section content blocks |
| Terminal content | output/terminal-content.md | Virtual filesystem markdown files |

---

### Stage 04: Build

Implement the site in TypeScript with THREE.js. Builder has creative freedom on implementation within the design system's quality floor.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Design | ../02-design/output/design-spec.md | Full file | Visual + interaction spec |
| Content | ../03-content/output/site-content.md | Full file | All site copy |
| Content | ../03-content/output/terminal-content.md | Full file | Virtual FS content |
| Config | ../../_config/design-system.md | Full file | Colors, fonts, spacing, motion |
| Reference | references/build-conventions.md | Full file | Code patterns, naming |
| Reference | references/component-registry.md | Full file | Available components |
| Reference | references/shader-reference.md | Full file | CRT GLSL patterns |
| Shared | ../../shared/project-structure.md | Full file | Source code architecture |
| Shared | ../../shared/tech-stack.md | Full file | Dependencies + versions |

**Process**

1. Scaffold: Vite + TypeScript, folder structure per project-structure.md
2. Implement THREE.js scene: renderer, camera, lighting, responsive handler
3. Load and position 3D retro computer model
4. Implement scroll-driven camera zoom
5. Implement CRT shader effects: scanlines, glow, curvature
6. Build terminal: shell parser, virtual filesystem, core commands (ls, cd, cat, help, clear, whoami, open, contact, resume), tab completion, history
7. Build markdown renderer for terminal content
8. Build UI overlay: navigation, project cards, about section (retro Mac), contact, loading screen
9. Integrate all content from Stage 03
10. Implement custom cursor with hover states
11. Wire GitHub API with static fallback
12. Local testing: all sections, terminal commands, scroll zoom on desktop + mobile

**Checkpoints**

| After Step | Pause For |
|-----------|-----------|
| 4 | Demo scroll-zoom. User confirms feel. |
| 6 | Demo terminal with basic commands. User tests interaction. |
| 9 | Full content review. User checks accuracy. |

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Design system | All colors from CSS variables, fonts from system, spacing from scale |
| Build conventions | Naming follows conventions, imports clean, no dead code |
| Terminal functional | All 9 core commands produce correct output |
| Responsive | Renders at 320px, 768px, 1440px |
| No hardcoded content | All text from data files, not inline strings |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Working site | output/ | Complete Vite project |

---

### Stage 05: Security (NEW in v2.0)

Harden the built site against OWASP Frontend Top 10 vulnerabilities and production security requirements.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../04-build/output/ | Full project | Site to harden |
| Reference | references/security-checklist.md | Full file | Vulnerability checklist |
| Reference | references/owasp-frontend-top10.md | Full file | OWASP guidance |

**Process**

1. **Eliminate innerHTML usage.** Replace all innerHTML assignments in UI components with DOM API (createElement, textContent, appendChild). Use DOMPurify if HTML rendering is required.
2. **Harden CSP.** Remove 'unsafe-inline' from script-src and style-src. Move all inline styles to CSS classes. Verify site works with strict CSP.
3. **Add missing security headers.** Referrer-Policy, Permissions-Policy, Strict-Transport-Security. Update vercel.json.
4. **Self-host fonts.** Download JetBrains Mono and Inter. Subset to used characters. Serve from /public/fonts/. Remove Google Fonts CDN dependency.
5. **Add WebGL error boundary.** Listen for webglcontextlost. Show fallback on context loss. Add global unhandled rejection handler.
6. **Fix open command.** Replace DOM click pattern with window.open() + noopener.
7. **Remove .js duplicates.** Add compiled JS to .gitignore. Only ship .ts sources.
8. **Add Subresource Integrity.** If any external CDN resources remain, add integrity attributes.
9. **Validate all external links.** Ensure all hrefs use https:// and include rel="noopener noreferrer" for target="_blank".
10. **Run security scan.** Use OWASP ZAP or Mozilla Observatory against deployed preview.

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Zero innerHTML | grep -r "innerHTML" src/ returns zero results (or all use DOMPurify) |
| Strict CSP | No 'unsafe-inline' or 'unsafe-eval' in CSP header |
| Headers complete | Mozilla Observatory score B+ or higher |
| No external font CDN | Zero requests to fonts.googleapis.com or fonts.gstatic.com |
| WebGL fallback | Site remains usable when WebGL context is force-killed |
| No .js source files | Only .ts files in src/ directory |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Hardened site | output/ | Security-patched Vite project |
| Security report | output/security-report.md | Checklist with pass/fail, CVEs checked, header scan results |

---

### Stage 06: Polish

Optimize performance, accessibility, and cross-browser compatibility.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../05-security/output/ | Full project | Hardened site to optimize |
| Reference | references/performance-budget.md | Full file | Target metrics |
| Shared | ../../shared/success-metrics.md | Full file | KPIs to validate |

**Process**

1. Run Lighthouse audit. Record baseline.
2. Optimize 3D: DRACO-compress GLTF, LOD switching, lazy-load model
3. Optimize assets: WebP images, font subsetting, tree-shake CSS
4. Code splitting: terminal module loads on interaction only
5. Preconnect hints for GitHub API
6. Accessibility audit: WCAG 2.1 AA, keyboard nav, screen reader compat, skip-nav link, focus-visible styles
7. Color contrast verification: peach (#FFCBA4) on dark (#0A0A0A) must meet 4.5:1
8. Cross-browser: Chrome, Firefox, Safari, Edge desktop; iOS Safari, Chrome Android mobile
9. Progressive enhancement: 2D fallback on non-WebGL
10. Re-run Lighthouse. Compare to budget. Fix misses.

**Audit**

| Check | Pass Condition |
|-------|---------------|
| Lighthouse | 95+ performance score |
| FCP | < 1.5s |
| LCP | < 2.5s |
| Bundle | < 500KB gzipped |
| Frame rate | 60fps desktop, 30fps mobile |
| Accessibility | WCAG 2.1 AA, zero axe violations |
| Mobile | Full feature parity at 320px |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Optimized site | output/ | Production-ready project |
| Performance report | output/performance-report.md | Before/after with pass/fail |

---

### Stage 07: Launch

Deploy, configure DNS, SEO, and establish analytics baseline.

**Inputs**

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../06-polish/output/ | Full project | Production-ready site |
| Config | ../../_config/identity.md | Full file | Domain, contact, socials |
| Reference | references/deployment-checklist.md | Full file | Deploy steps |

**Process**

1. Push to GitHub (public, clean README)
2. Connect Vercel: link repo, build command, Node.js 20 LTS
3. Configure domain: rajinuddin.dev, HTTPS enforced
4. Verify security headers live (use securityheaders.com)
5. SEO: OG tags, Twitter Card, JSON-LD, meta description, canonical, robots.txt, sitemap.xml
6. Generate OG image
7. Verify preview deployments on PR branches
8. Full live test: links, terminal, contact info, resume download, GitHub API
9. Submit to Google Search Console
10. Run Mozilla Observatory scan. Target B+ or higher.
11. Share launch post on LinkedIn

**Audit**

| Check | Pass Condition |
|-------|---------------|
| HTTPS | Valid cert, no mixed content |
| OG tags | LinkedIn/Twitter preview correct |
| Structured data | Google Rich Results Test passes |
| Links | Zero broken (internal + external) |
| Resume | PDF downloads from contact + terminal |
| Security headers | securityheaders.com grade A or B+ |
| Observatory | Mozilla Observatory score B+ or higher |

**Outputs**

| Artifact | Location | Format |
|----------|----------|--------|
| Launch report | output/launch-report.md | Live URL, config, SEO verification, security scan, analytics baseline |

---

## 6. Configuration Files

### 6.1 _config/identity.md

```markdown
# Identity

## Core
- Name: {{DISPLAY_NAME}}
- Tagline: {{TAGLINE}}
- Domain: {{DOMAIN}}

## Contact
- Email: {{EMAIL}}
- Phone: {{PHONE}}
- GitHub: github.com/{{GITHUB_USER}}
- LinkedIn: linkedin.com/in/{{LINKEDIN_SLUG}}

## Audience
Primary: Technical recruiters and hiring managers at FAANG, Canadian banks
(RBC, BMO, TD), and tech startups (Shopify, Wealthsimple).
Secondary: Engineering leads evaluating summer 2026 intern candidates.
Tertiary: Fellow developers and open-source community.

## Positioning
3rd-year CS student at University of Guelph, minor in Project Management,
graduating May 2027. Intersection of full-stack development and data analytics.
Differentiators: real client work (MapleKey Media, PixelPro Analytics), proven
metrics (403% inquiry increase, 35% revenue lift), systems thinking (Agile,
CI/CD, data dashboards).
```

### 6.2 _config/voice-rules.md

```markdown
# Voice Rules

## Examples
{{VOICE_EXAMPLES}}

## What the Voice Is
- Direct. Short sentences. No filler.
- Confident without arrogance. Let metrics speak.
- Technical when showing work. Plain when telling the story.
- Slightly informal -- contractions fine, no slang.
- Action-oriented. "Built X that did Y" not "Responsible for X."

## What the Voice Is NOT
- Not academic. No "utilized," "leveraged," "facilitated."
- Not humble-braggy. State fact, skip qualifier.
- Not generic. Every sentence only true about Rajin.
- Not robotic. Human behind the terminal.

## Constraints
- Project descriptions: max 2 sentences. First = what. Second = impact.
- Bio: max 4 sentences. Identity, work, drive, next.
- Terminal responses: terse. UNIX convention -- answer, nothing extra.
```

### 6.3 _config/design-system.md

```markdown
# Design System

## Color Palette
| Token | Hex | Usage | Ratio |
|-------|-----|-------|-------|
| --color-peach | {{COLOR_PEACH}} | Accents, CTAs, highlights | 15% |
| --color-dark | {{COLOR_DARK}} | Background, primary surface | 60% |
| --color-text | #F5F5F5 | Body text, headings | 20% |
| --color-subtle | #666666 | Secondary text, borders | 5% |
| --color-peach-light | #FFF0E5 | Card hovers, subtle bgs | Accent |
| --color-peach-dark | #E8A87C | Active states, underlines | Accent |

## Typography
| Context | Font | Fallback | Size |
|---------|------|----------|------|
| Terminal | {{FONT_TERMINAL}} | "Courier New", monospace | 14px |
| UI | {{FONT_UI}} | system-ui, -apple-system, sans-serif | 16px |

Scale: 1.618 golden ratio. Line height: 1.5 body, 1.2 headings. Max width: 720px.

## Spacing
Base: 8px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

## Motion
Default: 300ms. Easing: cubic-bezier(0.25, 0.1, 0.25, 1.0). Scroll-zoom: 800ms.
Reduce motion: respect prefers-reduced-motion, disable 3D, opacity/translate only.

## Breakpoints
| Name | Width | Behavior |
|------|-------|----------|
| mobile | < 768px | Simplified 3D, stacked, touch |
| tablet | 768-1024px | Reduced 3D, side nav |
| desktop | > 1024px | Full 3D, hover interactions |
```

---

## 7. Onboarding Questionnaire

All questions answered in a single message. Defaults in brackets.

1. Display name? `{{DISPLAY_NAME}}` [Rajin Uddin]
2. Professional tagline? `{{TAGLINE}}` [CS Student & Full-Stack Developer at University of Guelph]
3. Peach accent hex? `{{COLOR_PEACH}}` [#FFCBA4]
4. Dark background hex? `{{COLOR_DARK}}` [#0A0A0A]
5. Terminal font? `{{FONT_TERMINAL}}` [JetBrains Mono]
6. UI font? `{{FONT_UI}}` [Inter]
7. Voice examples (2-3 sentences as homepage copy)? `{{VOICE_EXAMPLES}}` ["I build things that work and look good doing it. From full-stack platforms to data dashboards, I ship software that moves numbers."]
8. GitHub username? `{{GITHUB_USER}}` [razinn70]
9. LinkedIn slug? `{{LINKEDIN_SLUG}}` [rajinu]
10. Email? `{{EMAIL}}` [muddinal@uoguelph.ca]
11. Phone? `{{PHONE}}` [+1 (437) 808-1738]
12. Domain? `{{DOMAIN}}` [rajinuddin.dev]
13. Include terminal? If NO: static about section. [YES]
14. Include admin analytics? If NO: remove analytics module. [YES]

---

## 8. Source Code Architecture

```
rajinuddin.dev/
├── public/
│   ├── models/              # DRACO-compressed .glb
│   ├── fonts/               # Self-hosted, subsetted
│   ├── icons/               # Favicon, OG image, apple-touch-icon
│   ├── resume/              # Downloadable PDF
│   ├── textures/            # 3D textures
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.ts              # Entry point
│   ├── scene/
│   │   ├── SceneManager.ts
│   │   ├── CameraController.ts
│   │   ├── LightingSetup.ts
│   │   └── ResponsiveHandler.ts
│   ├── computer/
│   │   ├── ComputerModel.ts
│   │   ├── ScreenRenderer.ts
│   │   └── CRTShader.ts
│   ├── terminal/
│   │   ├── Shell.ts
│   │   ├── FileSystem.ts
│   │   ├── Commands.ts
│   │   ├── Autocomplete.ts
│   │   └── History.ts
│   ├── renderer/
│   │   ├── MarkdownParser.ts
│   │   ├── TextLayout.ts
│   │   └── SyntaxHighlighter.ts
│   ├── ui/
│   │   ├── Navigation.ts
│   │   ├── ProjectCards.ts
│   │   ├── AboutSection.ts
│   │   ├── ContactSection.ts
│   │   ├── LoadingScreen.ts
│   │   └── Cursor.ts
│   ├── data/
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   ├── personal.ts
│   │   └── filesystem.ts
│   ├── utils/
│   │   ├── math.ts
│   │   ├── dom.ts
│   │   ├── performance.ts
│   │   └── analytics.ts
│   ├── shaders/
│   │   ├── crt.vert
│   │   ├── crt.frag
│   │   └── glow.frag
│   └── styles/
│       ├── global.css
│       ├── navigation.css
│       ├── projects.css
│       ├── about.css
│       ├── contact.css
│       ├── animations.css
│       └── responsive.css
├── index.html
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── package.json
├── vercel.json
└── README.md
```

---

## 9. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | TypeScript | 5.3+ | Type safety, IDE tooling, compile-time error catching |
| 3D Engine | THREE.js | r160 (pinned) | 3D rendering, GLTF loading, shader support, 384+ star reference impl |
| Build | Vite | 5.1+ | Sub-second HMR, tree-shaking, code splitting, GLSL plugin |
| Deploy | Vercel | -- | Edge CDN, auto-deploy, preview URLs, security headers |
| Styling | CSS Modules + Vanilla CSS | -- | Scoped styles, custom properties, no runtime cost |
| Shaders | GLSL | -- | CRT scanlines, phosphor glow, barrel distortion |
| VCS | Git / GitHub | -- | Source control, CI/CD trigger, public portfolio proof |

---

## 10. Success Metrics

### Performance KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Performance | 95+ | Chrome DevTools |
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Core Web Vitals |
| Bundle size (gzipped) | < 500KB | Vite build |
| 3D frame rate | 60fps desktop / 30fps mobile | rAF monitor |
| Time to Interactive | < 3s on 4G | Lighthouse TTI |

### Engagement KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Session duration | 45+ seconds | Analytics |
| Bounce rate | < 40% | Analytics |
| Projects section reach | 60%+ sessions | Scroll tracking |
| Terminal interaction rate | 20%+ desktop sessions | Event tracking |

### Conversion KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Recruiter contacts | 3+ within 60 days | Email/form tracking |
| Resume downloads | 10+ within 60 days | Click tracking |
| GitHub clicks | 5%+ of sessions | Link tracking |

### Quality KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Accessibility | WCAG 2.1 AA | axe DevTools |
| Security headers | A or B+ grade | securityheaders.com |
| Mozilla Observatory | B+ or higher | observatory.mozilla.org |
| Cross-browser | 6 browsers tested | Manual |
| Mobile parity | Full features at 320px | Device testing |

---

## 11. Risk Register

| ID | Risk | Prob | Impact | Mitigation | Owner |
|----|------|------|--------|------------|-------|
| R-01 | 3D performance on mobile | High | High bounce, poor UX | LOD system, 2D CSS fallback, progressive enhancement | Build |
| R-02 | Scope creep past internship deadline | Medium | Missed application cycle | Strict MVP at Stage 04; backlog for post-MVP | PM |
| R-03 | GitHub API rate limits | Medium | Missing star/fork counts | Static fallback in projects.ts; 1hr client cache | Build |
| R-04 | 3D model file size > 2MB | Medium | Slow initial load | DRACO compression, LOD variants, lazy load behind boot screen | Build |
| R-05 | CSP breaks Google Fonts | Medium | FOUT or missing fonts | Self-host fonts (eliminates dependency entirely) | Security |
| R-06 | WebGL context loss on mobile | Medium | Blank screen | webglcontextlost handler, auto-fallback to 2D | Build |
| R-07 | innerHTML XSS if data source changes | Low | Data exfiltration | Eliminate innerHTML in Stage 05-security | Security |
| R-08 | Browser compat (Safari WebGL quirks) | Low | Broken 3D on Safari | Feature detection, test on real Safari devices | Polish |

---

## 12. Hardened vercel.json (Target State)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/((?!Res\\.html|UddinRajinResume\\.pdf).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "0" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data: blob:; connect-src 'self' https://api.github.com; worker-src blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
        }
      ]
    }
  ]
}
```

Key changes from current:
- Removed `'unsafe-inline'` from script-src and style-src (requires self-hosted fonts and no inline styles)
- Changed X-XSS-Protection to `0` (deprecated; CSP is the proper mitigation; non-zero values can introduce vulnerabilities in older browsers)
- Added Referrer-Policy, Permissions-Policy, HSTS
- Added `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`
- Removed Google Fonts CDN from font-src (self-hosted)

---

## 13. References and Inspiration

| Source | What to Extract | URL |
|--------|----------------|-----|
| edh.dev | 3D retro computer, THREE.js, scroll zoom, UNIX shell, CRT shaders | https://edh.dev |
| edhinrichsen/retro-computer-website | Open-source reference (TypeScript, THREE.js, 384+ stars) | https://github.com/edhinrichsen/retro-computer-website |
| Brittany Chiang | Clean developer portfolio structure | https://brittanychiang.com |
| matthisgarnier.webflow.io | Loading animations, transitions | https://matthisgarnier.webflow.io |
| flowman.dev | Typography, layout spacing | https://flowman.dev |
| OWASP CSP Cheat Sheet | Content Security Policy best practices | https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html |
| web.dev Strict CSP | Nonce-based CSP implementation guide | https://web.dev/articles/strict-csp |
| Mozilla Observatory | Security header grading and recommendations | https://observatory.mozilla.org |
| Atlassian PRD Template | Enterprise PRD structure and section guidance | https://www.atlassian.com/agile/product-management/requirements |

---

## 14. Timeline

| Week | Stage | Deliverable | Gate |
|------|-------|-------------|------|
| 1 | 01-research + 02-design | Research report, design spec | User approves direction |
| 2 | 03-content | Content package, terminal FS content | Voice rules validated |
| 3 | 04-build (scene + 3D) | THREE.js scene, model, scroll zoom, CRT shaders | Scroll-zoom demo approved |
| 4 | 04-build (terminal + UI) | Shell, overlay components, content integration | Terminal demo + content review |
| 5 | 05-security + 06-polish | Security hardening, perf optimization, a11y, QA | All audits pass |
| 6 | 07-launch | Vercel deploy, DNS, SEO, go-live | Observatory B+, Lighthouse 95+ |

---

## 15. Acceptance Criteria

The project is complete when ALL of the following are true:

1. Site is live at https://rajinuddin.dev with valid HTTPS
2. Lighthouse performance score >= 95
3. Mozilla Observatory score >= B+
4. securityheaders.com grade >= B+
5. Zero innerHTML usage in source (or all sanitized via DOMPurify)
6. CSP contains no 'unsafe-inline' or 'unsafe-eval'
7. All 9 terminal commands produce correct output
8. Site renders correctly at 320px, 768px, and 1440px
9. WebGL fallback works when context is force-killed
10. Resume PDF downloads from both contact section and terminal
11. OG tags render correctly on LinkedIn and Twitter
12. Google Rich Results Test passes for Person schema
13. Zero broken links (internal and external)
14. All fonts self-hosted (zero external font CDN requests)
15. WCAG 2.1 AA compliance with zero axe-core violations