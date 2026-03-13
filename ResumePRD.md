# Project Requirement Document: rajinuddin.dev

## ICM Workspace -- Personal Portfolio Website

This document defines the complete ICM (Interpretable Context Methodology) workspace for building rajinuddin.dev -- a personal portfolio website for Rajin Uddin. The workspace follows Jake Van Clief's folder-as-architecture pattern: numbered stages, markdown-driven context, selective loading, and human edit surfaces at every handoff.

**Owner:** Rajin Uddin
**Version:** 1.0
**Date:** March 2026

---

## Executive Summary

rajinuddin.dev is a personal portfolio website that serves as both a professional showcase for FAANG/top-tier internship applications and a technical demonstration piece. The design draws heavy inspiration from edh.dev (Ed Hinrichsen's Awwwards Honorable Mention portfolio), featuring a 3D retro computer rendered with THREE.js, a functional terminal interface, smooth scroll-driven zoom transitions, and a minimalist peach-and-black color palette.

The project uses a multi-folder modular architecture built with TypeScript, Vite, and THREE.js, deployed via Vercel.

**Target Audience:** Technical recruiters, hiring managers, and engineering leads at FAANG companies, Canadian banks, and tech startups.

**Primary Goal:** Convert portfolio visitors into interview requests by demonstrating design sensibility, engineering depth, and professional credibility.

**Timeline:** 6 weeks -- staged delivery following the ICM pipeline below.

---

## Workspace Folder Structure

```
rajinuddin-portfolio/
├── CLAUDE.md                              # Layer 0: orientation + triggers
├── CONTEXT.md                             # Layer 1: task routing table
├── setup/
│   └── questionnaire.md                   # One-time onboarding config
├── _config/                               # Layer 3: stable identity + design
│   ├── CONTEXT.md                         # Routes agents to correct sections
│   ├── identity.md                        # Brand name, audience, positioning
│   ├── voice-rules.md                     # Writing voice, tone, style
│   └── design-system.md                   # Colors, typography, spacing, motion
├── stages/
│   ├── 01-research/
│   │   ├── CONTEXT.md                     # Stage contract
│   │   ├── references/
│   │   │   ├── inspiration-analysis.md    # edh.dev teardown + patterns
│   │   │   └── competitor-audit.md        # Top developer portfolio benchmarks
│   │   └── output/
│   │       └── .gitkeep
│   ├── 02-design/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── layout-patterns.md         # Section wireframes + content hierarchy
│   │   │   └── interaction-patterns.md    # Scroll zoom, terminal UX, transitions
│   │   └── output/
│   │       └── .gitkeep
│   ├── 03-content/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── resume-data.md             # Structured resume content
│   │   │   └── filesystem-map.md          # Virtual FS tree for terminal
│   │   └── output/
│   │       └── .gitkeep
│   ├── 04-build/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   ├── build-conventions.md       # File naming, code patterns, imports
│   │   │   ├── component-registry.md      # Available UI + 3D components
│   │   │   └── shader-reference.md        # CRT effects, glow, scanlines
│   │   └── output/
│   │       └── .gitkeep
│   ├── 05-polish/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   │   └── performance-budget.md      # Lighthouse targets, bundle limits
│   │   └── output/
│   │       └── .gitkeep
│   └── 06-launch/
│       ├── CONTEXT.md
│       ├── references/
│       │   └── deployment-checklist.md    # Vercel, DNS, SEO, analytics
│       └── output/
│           └── .gitkeep
└── shared/                                # Layer 3: cross-stage resources
    ├── tech-stack.md                      # Technology decisions + rationale
    ├── project-structure.md               # Multi-folder source code architecture
    └── success-metrics.md                 # KPIs that all stages validate against
```

---

## Layer 0: CLAUDE.md

```markdown
# rajinuddin.dev Portfolio Workspace

Build a personal portfolio website for Rajin Uddin, inspired by edh.dev.

## Folder Map

- `_config/` -- identity, voice, design system (stable across runs)
- `stages/01-research/` -- inspiration analysis + competitor audit
- `stages/02-design/` -- visual spec + interaction design
- `stages/03-content/` -- resume data + virtual filesystem content
- `stages/04-build/` -- TypeScript/THREE.js implementation
- `stages/05-polish/` -- performance, accessibility, responsive QA
- `stages/06-launch/` -- deployment, SEO, analytics
- `shared/` -- tech stack, project structure, success metrics

## Routing

| You want to... | Go to |
|-----------------|-------|
| Start a new build run | `CONTEXT.md` |
| Research inspiration sites | `stages/01-research/CONTEXT.md` |
| Design layout and interactions | `stages/02-design/CONTEXT.md` |
| Write site content from resume | `stages/03-content/CONTEXT.md` |
| Implement the site | `stages/04-build/CONTEXT.md` |
| Optimize performance + a11y | `stages/05-polish/CONTEXT.md` |
| Deploy and launch | `stages/06-launch/CONTEXT.md` |

## Triggers

| Keyword | Action |
|---------|--------|
| `setup` | Run onboarding questionnaire from `setup/questionnaire.md` |
| `status` | Show which stages have output artifacts |
| `build` | Start from Stage 04 (assumes research, design, content done) |

## Stage Handoff Convention

Each stage writes artifacts to its `output/` folder. The next stage reads from
the previous stage's `output/`. Edit any output file before proceeding and the
next stage picks up your edits.
```

---

## Layer 1: CONTEXT.md

```markdown
# Portfolio Build Pipeline

Sequential 6-stage pipeline for building rajinuddin.dev.

## Pipeline

| Stage | Purpose | Input From | Output |
|-------|---------|-----------|--------|
| 01-research | Analyze edh.dev + benchmark portfolios | User brief | Inspiration report |
| 02-design | Visual spec + interaction design | 01 output | Design spec |
| 03-content | Structure all site content from resume | 02 output + resume | Content package |
| 04-build | TypeScript/THREE.js implementation | 02 + 03 output | Working site code |
| 05-polish | Performance, a11y, responsive QA | 04 output | Optimized build |
| 06-launch | Deploy, SEO, analytics setup | 05 output | Live site |

## Entry Points

- **Full pipeline:** Start at `stages/01-research/CONTEXT.md`
- **Content only:** Start at `stages/03-content/CONTEXT.md`
- **Build only:** Start at `stages/04-build/CONTEXT.md` (needs design + content done)
- **Relaunch:** Start at `stages/06-launch/CONTEXT.md`
```

---

## Setup: questionnaire.md

```markdown
# Onboarding Questionnaire

Answer all questions in a single message. Defaults shown in brackets.

1. What is your full display name for the site?
   - Placeholder: {{DISPLAY_NAME}}
   - Files: _config/identity.md, stages/03-content/references/resume-data.md
   - Type: free text
   - Default: Rajin Uddin

2. What is your one-line professional tagline?
   - Placeholder: {{TAGLINE}}
   - Files: _config/identity.md
   - Type: free text
   - Default: CS Student & Full-Stack Developer at University of Guelph

3. What is your primary peach accent color hex?
   - Placeholder: {{COLOR_PEACH}}
   - Files: _config/design-system.md
   - Type: free text
   - Default: #FFCBA4

4. What is your primary dark/background color hex?
   - Placeholder: {{COLOR_DARK}}
   - Files: _config/design-system.md
   - Type: free text
   - Default: #0A0A0A

5. What terminal font should be used inside the retro computer screen?
   - Placeholder: {{FONT_TERMINAL}}
   - Files: _config/design-system.md, stages/04-build/references/build-conventions.md
   - Type: free text
   - Default: Chill Pixels Mono

6. What UI font should be used outside the terminal?
   - Placeholder: {{FONT_UI}}
   - Files: _config/design-system.md
   - Type: free text
   - Default: Inter

7. Give me 2-3 sentences that sound like the voice of your site. Write them as
   if they were copy on the homepage.
   - Placeholder: {{VOICE_EXAMPLES}}
   - Files: _config/voice-rules.md
   - Type: free text
   - Default: "I build things that work and look good doing it. From full-stack
     platforms to data dashboards, I ship software that moves numbers."

8. What is your GitHub username?
   - Placeholder: {{GITHUB_USER}}
   - Files: _config/identity.md, stages/03-content/references/resume-data.md
   - Type: free text
   - Default: razinn70

9. What is your LinkedIn URL slug?
   - Placeholder: {{LINKEDIN_SLUG}}
   - Files: _config/identity.md, stages/03-content/references/resume-data.md
   - Type: free text
   - Default: rajinu

10. What is your email address?
    - Placeholder: {{EMAIL}}
    - Files: _config/identity.md, stages/03-content/references/resume-data.md
    - Type: free text
    - Default: muddinal@uoguelph.ca

11. What is your phone number?
    - Placeholder: {{PHONE}}
    - Files: _config/identity.md, stages/03-content/references/resume-data.md
    - Type: free text
    - Default: +1 (437) 808-1738

12. What domain will the site be deployed to?
    - Placeholder: {{DOMAIN}}
    - Files: stages/06-launch/references/deployment-checklist.md
    - Type: free text
    - Default: rajinuddin.dev

13. Do you want the terminal interface included?
    - If NO: Remove `stages/04-build/references/shader-reference.md` terminal
      sections, simplify `src/terminal/` to a static about section
    - If YES: Full UNIX shell, virtual filesystem, markdown renderer
    - Default: YES

14. Do you want the hidden admin analytics dashboard?
    - If NO: Remove analytics references from `shared/project-structure.md`
    - If YES: Ctrl+Alt+A keyboard shortcut, session tracking
    - Default: YES
```

---

## _config/identity.md

```markdown
# Identity

## Core

- **Name:** {{DISPLAY_NAME}}
- **Tagline:** {{TAGLINE}}
- **Domain:** {{DOMAIN}}

## Contact

- **Email:** {{EMAIL}}
- **Phone:** {{PHONE}}
- **GitHub:** github.com/{{GITHUB_USER}}
- **LinkedIn:** linkedin.com/in/{{LINKEDIN_SLUG}}

## Audience

Primary: Technical recruiters and hiring managers at FAANG companies, Canadian
banks (RBC, BMO, TD), and tech startups (Shopify, Wealthsimple).

Secondary: Engineering leads evaluating candidates for summer 2026 internships.

Tertiary: Fellow developers and open-source community members.

## Positioning

Rajin is a 3rd-year Computer Science student at the University of Guelph with a
minor in Project Management, graduating May 2027. He positions himself at the
intersection of full-stack development and data analytics -- building production
systems that ship measurable business impact, not just demo projects.

Differentiators: real client work (MapleKey Media, PixelPro Analytics), proven
metrics (403% inquiry increase, 35% revenue lift), and systems thinking (Agile
leadership, CI/CD pipelines, data-driven dashboards).
```

---

## _config/voice-rules.md

```markdown
# Voice Rules

## Voice Examples

{{VOICE_EXAMPLES}}

## What the Voice Is

- Direct. Short sentences. No filler.
- Confident without being arrogant. Let metrics speak.
- Technical when showing work. Plain when telling the story.
- Slightly informal -- contractions are fine, but no slang.
- Action-oriented. "Built X that did Y" not "Responsible for X."

## What the Voice Is NOT

- Not academic. No "utilized," "leveraged," "facilitated."
- Not humble-braggy. State the fact, skip the qualifier.
- Not generic. Every sentence should only be true about Rajin.
- Not robotic. There is a human behind the terminal.

## Writing Constraints

- Project descriptions: max 2 sentences. First sentence = what it is. Second =
  what it achieved.
- Bio: max 4 sentences. Identity, what you do, what drives you, what is next.
- Terminal responses: terse. Match UNIX convention -- output the answer, nothing
  extra.
```

---

## _config/design-system.md

```markdown
# Design System

## Color Palette

| Token | Hex | Usage | Ratio |
|-------|-----|-------|-------|
| --color-peach | {{COLOR_PEACH}} | Accents, CTAs, highlights, hover states | 15% |
| --color-dark | {{COLOR_DARK}} | Background, primary surface | 60% |
| --color-text | #F5F5F5 | Body text, headings | 20% |
| --color-subtle | #666666 | Secondary text, borders, metadata | 5% |
| --color-peach-light | #FFF0E5 | Subtle backgrounds, card hovers | Accent |
| --color-peach-dark | #E8A87C | Active states, underlines | Accent |

## Typography

| Context | Font | Fallback | Base Size |
|---------|------|----------|-----------|
| Terminal / CRT screen | {{FONT_TERMINAL}} | "Courier New", monospace | 14px |
| UI / out-of-terminal | {{FONT_UI}} | system-ui, -apple-system, sans-serif | 16px |

- Type scale: 1.618 (golden ratio) modular scale
- Line height: 1.5 for body, 1.2 for headings
- Max content width: 720px for readability

## Spacing

- Base unit: 8px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Section gaps: 96px desktop, 64px mobile

## Motion

- Default duration: 300ms
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1.0)
- Scroll-zoom transition: 800ms with easeInOut
- Reduce motion: respect `prefers-reduced-motion`, disable 3D, simplify to
  opacity/translate only
- CRT effects: scanlines at 2px interval, 8% opacity; glow radius 4px; subtle
  curvature distortion via GLSL vertex displacement

## Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| mobile | < 768px | Simplified 3D, stacked layout, touch gestures |
| tablet | 768-1024px | Reduced 3D complexity, side navigation |
| desktop | > 1024px | Full 3D experience, hover interactions |
```

---

## Stage 01-research: CONTEXT.md

```markdown
# Stage 01: Research

Analyze edh.dev and benchmark developer portfolios to extract design patterns,
interaction models, and content strategies that inform the design stage.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Config | ../../_config/identity.md | "Positioning" section | Know who this site represents |
| Config | ../../_config/design-system.md | "Color Palette" section | Anchor analysis to chosen palette |
| Reference | references/inspiration-analysis.md | Full file | edh.dev teardown framework |
| Reference | references/competitor-audit.md | Full file | Benchmark portfolio list |
| Shared | ../../shared/success-metrics.md | Full file | What "good" looks like |

## Process

1. Fetch and analyze edh.dev: document the 3D retro computer interaction model,
   scroll-zoom behavior, terminal UX, content structure, and typography choices
2. Analyze 4-5 benchmark portfolios from the competitor audit list: note layout
   patterns, project showcase styles, loading animations, and mobile adaptations
3. For each site, extract: what works, what does not, and what to adapt for
   Rajin's context
4. Identify the 3 design patterns that matter most for recruiter conversion
5. Map findings to Rajin's specific content (resume, projects, experience)
6. Write the research report

## Checkpoints

| After Step | Pause For |
|-----------|-----------|
| 3 | Present top 3 inspiration sites with pros/cons. User picks direction. |

## Audit

| Check | Pass Condition |
|-------|---------------|
| edh.dev covered | Report includes specific analysis of scroll-zoom, terminal, CRT effects |
| Actionable findings | Every observation maps to a concrete recommendation for Rajin's site |
| Metric-aware | At least 2 findings tie back to success metrics (session duration, load time) |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Research report | output/research-report.md | Markdown with sections: edh.dev analysis, benchmark findings, design recommendations, content strategy |
```

---

## Stage 02-design: CONTEXT.md

```markdown
# Stage 02: Design

Produce a visual and interaction specification that defines WHAT the site looks
like and WHEN things happen -- not HOW they are implemented.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../01-research/output/research-report.md | Full file | Design recommendations to implement |
| Config | ../../_config/design-system.md | Full file | Color, type, spacing, motion rules |
| Config | ../../_config/voice-rules.md | "Writing Constraints" section | Content length limits |
| Reference | references/layout-patterns.md | Full file | Section wireframe options |
| Reference | references/interaction-patterns.md | Full file | Scroll zoom, terminal, transitions |

## Process

1. Read the research report and extract the top design recommendations
2. Define the 4-section content hierarchy: Home, About, Projects, Contact
3. For each section, write a visual concept: what a visitor sees, what draws
   attention, what the scroll behavior is
4. Define the scroll-zoom journey: full computer view at top, zoom into screen
   on scroll, content fills viewport at bottom
5. Define the retro Mac about section: window chrome, CRT screen interior,
   terminal text rendering
6. Define project card layout: chronological cards with year markers, tech tags,
   impact metrics
7. Define the loading screen: retro boot sequence animation
8. Define mobile adaptation: what changes, what simplifies, what stays
9. Write the design spec

## Checkpoints

| After Step | Pause For |
|-----------|-----------|
| 3 | Present section hierarchy with visual concepts. User approves or redirects. |
| 7 | Present loading screen concept. User approves or redirects. |

## Audit

| Check | Pass Condition |
|-------|---------------|
| No HOW | Spec contains zero component names, zero CSS properties, zero frame numbers |
| Mobile covered | Every section has an explicit mobile adaptation note |
| Palette adherence | All color references use design system tokens, not raw hex |
| Content hierarchy | Visitor can understand what Rajin does within 6 seconds of landing |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Design spec | output/design-spec.md | Markdown with sections: page journey, section specs, interaction model, loading sequence, mobile adaptations |
```

---

## Stage 03-content: CONTEXT.md

```markdown
# Stage 03: Content

Structure all site content from Rajin's resume and professional profiles into
format-ready content blocks and a virtual filesystem tree for the terminal.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../02-design/output/design-spec.md | "Section Specs" section | Content slots to fill |
| Config | ../../_config/identity.md | Full file | Contact info, positioning |
| Config | ../../_config/voice-rules.md | Full file | Tone and length constraints |
| Reference | references/resume-data.md | Full file | Structured resume content |
| Reference | references/filesystem-map.md | Full file | Virtual FS directory tree |

## Process

1. Read the design spec to understand content slots per section
2. Write the Home section: name, tagline, one-sentence hook, CTA
3. Write the About section: personal narrative (Bangladesh to Guelph, passion
   for building, what drives you), formatted as retro Mac terminal output
4. Write each project entry: title, 2-sentence description (what + impact),
   tech stack tags, links
5. Write each experience entry: role, company, dates, 2 bullet points with
   metrics
6. Write the Contact section: email, phone, GitHub, LinkedIn, resume download
7. Build the virtual filesystem: create markdown content for each file in the
   terminal FS tree (about.md, projects/*.md, experience/*.md, etc.)
8. Write terminal command responses: whoami output, help text, contact output
9. Validate all content against voice rules

## Audit

| Check | Pass Condition |
|-------|---------------|
| Voice compliance | Zero instances of "utilized," "leveraged," "facilitated," or passive voice |
| Length compliance | Project descriptions max 2 sentences, bio max 4 sentences |
| Metric coverage | Every project and experience entry includes at least one quantified impact |
| FS completeness | Every file in the filesystem map has corresponding content written |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Site content | output/site-content.md | Section-by-section content blocks ready for implementation |
| Terminal content | output/terminal-content.md | Virtual filesystem files with markdown content |
```

---

## Stage 04-build: CONTEXT.md

```markdown
# Stage 04: Build

Implement the portfolio site in TypeScript with THREE.js, following the design
spec and using the prepared content. The builder has creative freedom on
implementation details within the quality floor defined by the design system.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Design stage | ../02-design/output/design-spec.md | Full file | Visual and interaction spec |
| Content stage | ../03-content/output/site-content.md | Full file | All site copy |
| Content stage | ../03-content/output/terminal-content.md | Full file | Virtual FS content |
| Config | ../../_config/design-system.md | Full file | Colors, fonts, spacing, motion |
| Reference | references/build-conventions.md | Full file | Code patterns, file naming |
| Reference | references/component-registry.md | Full file | Available components |
| Reference | references/shader-reference.md | Full file | CRT GLSL shader patterns |
| Shared | ../../shared/project-structure.md | Full file | Multi-folder source architecture |
| Shared | ../../shared/tech-stack.md | Full file | Dependencies + versions |

## Process

1. Scaffold the project: Vite + TypeScript config, folder structure per
   `shared/project-structure.md`
2. Implement the THREE.js scene: renderer, camera, lighting, responsive handler
3. Load and position the 3D retro computer model
4. Implement scroll-driven camera zoom from full view into CRT screen
5. Implement CRT shader effects: scanlines, glow, screen curvature
6. Build the terminal: shell parser, virtual filesystem, core commands (ls, cd,
   cat, help, clear, whoami, open, contact, resume), tab completion, history
7. Build the markdown renderer for terminal content display
8. Build UI overlay components: navigation, project cards, about section (retro
   Mac window), contact section, loading screen
9. Integrate all site content from Stage 03 output
10. Implement custom cursor with interactive hover states
11. Wire GitHub API integration with static fallback data
12. Test locally: all sections render, terminal commands work, scroll zoom
    functions on desktop and mobile

## Checkpoints

| After Step | Pause For |
|-----------|-----------|
| 4 | Demo the scroll-zoom. User confirms the feel before adding shaders. |
| 6 | Demo terminal with basic commands. User tests interaction. |
| 9 | Full content integration review. User checks copy accuracy. |

## Audit

| Check | Pass Condition |
|-------|---------------|
| Design system adherence | All colors from CSS variables, all fonts from design system, all spacing from scale |
| Build conventions | File naming follows build-conventions.md, imports are clean, no dead code |
| Terminal functional | All 9 core commands produce correct output |
| Responsive | Site renders correctly at 320px, 768px, and 1440px widths |
| No hardcoded content | All text comes from data files, not inline strings in components |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Working site | output/ | Complete Vite project: src/, public/, config files, package.json |
```

---

## Stage 05-polish: CONTEXT.md

```markdown
# Stage 05: Polish

Optimize performance, accessibility, and cross-browser compatibility to meet
the quality bar defined in the performance budget.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../04-build/output/ | Full project | The site to optimize |
| Reference | references/performance-budget.md | Full file | Target metrics |
| Shared | ../../shared/success-metrics.md | Full file | KPIs to validate |

## Process

1. Run Lighthouse audit on the built site. Record baseline scores.
2. Optimize 3D: DRACO-compress GLTF, implement LOD switching, lazy-load model
3. Optimize assets: convert images to WebP, subset fonts, tree-shake unused CSS
4. Implement code splitting: terminal module loads on interaction, not on page load
5. Add preconnect hints for GitHub API and font CDN
6. Run accessibility audit: verify WCAG 2.1 AA, test keyboard navigation, verify
   screen reader compatibility for non-3D content
7. Test across browsers: Chrome, Firefox, Safari, Edge on desktop; iOS Safari and
   Chrome Android on mobile
8. Test progressive enhancement: verify 2D fallback renders on non-WebGL browsers
9. Re-run Lighthouse. Compare against performance budget.
10. Fix any metrics that miss target.

## Audit

| Check | Pass Condition |
|-------|---------------|
| Lighthouse performance | 95+ score |
| First contentful paint | < 1.5s |
| Largest contentful paint | < 2.5s |
| Bundle size | < 500KB gzipped |
| 3D frame rate | 60fps desktop, 30fps mobile |
| Accessibility | WCAG 2.1 AA compliance |
| Mobile | Full feature parity at 320px width |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Optimized site | output/ | Production-ready Vite project |
| Performance report | output/performance-report.md | Before/after metrics with pass/fail |
```

---

## Stage 06-launch: CONTEXT.md

```markdown
# Stage 06: Launch

Deploy the site, configure DNS, set up SEO metadata, and establish the
analytics baseline.

## Inputs

| Source | File/Location | Section/Scope | Why |
|--------|--------------|---------------|-----|
| Previous stage | ../05-polish/output/ | Full project | Production-ready site |
| Config | ../../_config/identity.md | Full file | Domain, contact, social links |
| Reference | references/deployment-checklist.md | Full file | Step-by-step deploy process |

## Process

1. Push to GitHub repository (public, clean README with project description)
2. Connect to Vercel: link repo, configure build command (`npm run build`),
   set Node.js 20 LTS
3. Configure custom domain: {{DOMAIN}} with HTTPS enforced
4. Add security headers: X-Content-Type-Options, X-Frame-Options,
   X-XSS-Protection, Content-Security-Policy
5. Add SEO metadata: Open Graph tags, Twitter Card, JSON-LD Person schema,
   meta description, canonical URL, robots.txt, sitemap.xml
6. Generate OG image: screenshot of the site at the scroll-zoom midpoint
7. Verify preview deployments work on PR branches
8. Test the live site: all links work, terminal functional, contact info correct,
   resume downloads, GitHub API returns data
9. Submit to Google Search Console
10. Share on LinkedIn with a post about the build process

## Audit

| Check | Pass Condition |
|-------|---------------|
| HTTPS | Site loads over HTTPS with valid cert |
| OG tags | LinkedIn/Twitter share preview shows correct title, description, image |
| Structured data | Google Rich Results Test passes for Person schema |
| All links | Zero broken links (internal and external) |
| Resume download | PDF downloads correctly from the contact section and terminal |

## Outputs

| Artifact | Location | Format |
|----------|----------|--------|
| Launch report | output/launch-report.md | Live URL, deployment config, SEO verification, analytics baseline |
```

---

## shared/tech-stack.md

```markdown
# Technology Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Language | TypeScript | 5.x | Type safety, IDE tooling, scalability |
| 3D Engine | THREE.js | r160+ | 3D rendering, camera, shaders, GLTF loading |
| Build Tool | Vite | 5.x | Fast HMR, tree-shaking, code splitting |
| Deployment | Vercel | -- | Edge CDN, auto-deploy from GitHub, preview URLs |
| Styling | CSS Modules + Vanilla CSS | -- | Scoped styles, CSS custom properties for theming |
| Shaders | GLSL | -- | CRT scanlines, glow, screen curvature |
| Version Control | Git / GitHub | -- | Source control, CI/CD trigger |
| Package Manager | npm | 10.x | Dependency management |
| Runtime | Node.js | 20 LTS | Build environment |
```

---

## shared/project-structure.md

```markdown
# Multi-Folder Source Code Architecture

The built site follows a modular folder structure. Each folder has a single
responsibility. No folder exceeds one level of nesting inside src/.

## Source Tree

```
rajinuddin.dev/
├── public/
│   ├── models/              # 3D model files (.glb, DRACO-compressed)
│   ├── fonts/               # Chill Pixels Mono, Inter (subsetted)
│   ├── icons/               # Favicon, OG image, apple-touch-icon
│   ├── resume/              # Downloadable resume PDF
│   └── textures/            # 3D textures, screen assets
├── src/
│   ├── main.ts              # Entry point: scene init, event binding
│   ├── scene/               # THREE.js scene lifecycle
│   │   ├── SceneManager.ts
│   │   ├── CameraController.ts   # Scroll-driven zoom
│   │   ├── LightingSetup.ts
│   │   └── ResponsiveHandler.ts
│   ├── computer/            # 3D retro computer
│   │   ├── ComputerModel.ts      # GLTF loader + interactions
│   │   ├── ScreenRenderer.ts     # CRT content rendering
│   │   └── CRTShader.ts          # Scanline/glow GLSL
│   ├── terminal/            # UNIX shell system
│   │   ├── Shell.ts              # Command parser + router
│   │   ├── FileSystem.ts         # Virtual directory tree
│   │   ├── Commands.ts           # Command implementations
│   │   ├── Autocomplete.ts       # Tab completion
│   │   └── History.ts            # Arrow key history
│   ├── renderer/            # Terminal content rendering
│   │   ├── MarkdownParser.ts     # MD to formatted output
│   │   ├── TextLayout.ts         # Monospaced layout engine
│   │   └── SyntaxHighlighter.ts  # Code block colors
│   ├── ui/                  # HTML/CSS overlay components
│   │   ├── Navigation.ts
│   │   ├── ProjectCards.ts
│   │   ├── AboutSection.ts       # Retro Mac window
│   │   ├── ContactForm.ts
│   │   ├── LoadingScreen.ts      # Boot sequence
│   │   └── Cursor.ts             # Custom cursor
│   ├── data/                # Content + config (canonical source)
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   ├── personal.ts
│   │   └── filesystem.ts         # Virtual FS content map
│   ├── utils/
│   │   ├── math.ts
│   │   ├── dom.ts
│   │   ├── performance.ts        # FPS monitor, LOD triggers
│   │   └── analytics.ts          # Hidden admin tracking
│   ├── shaders/
│   │   ├── crt.vert
│   │   ├── crt.frag
│   │   └── glow.frag
│   └── styles/
│       ├── global.css            # CSS variables, resets
│       ├── navigation.css
│       ├── projects.css
│       ├── about.css
│       ├── contact.css
│       ├── animations.css
│       └── responsive.css
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
├── vercel.json
└── README.md
```

## Folder Responsibilities

**public/** -- Static assets served as-is by Vercel CDN. 3D models exported
from Blender as DRACO-compressed GLTF. Fonts subsetted to used characters only.

**src/scene/** -- THREE.js scene lifecycle. SceneManager owns the render loop.
CameraController handles scroll-driven zoom from full computer into CRT.
ResponsiveHandler adjusts viewport and triggers LOD switches.

**src/computer/** -- 3D retro computer module. ComputerModel loads GLTF and
handles click/hover. ScreenRenderer manages CRT display content. CRTShader
implements GLSL scanlines, phosphor glow, and screen curvature.

**src/terminal/** -- UNIX shell. Shell parses and routes commands. FileSystem
maintains the virtual directory tree. Commands implements: ls, cd, cat, help,
clear, whoami, open, contact, resume. Autocomplete provides tab completion.
History manages arrow key navigation.

**src/renderer/** -- Content rendering inside the terminal. MarkdownParser
converts .md virtual files to formatted terminal output. TextLayout handles
monospaced character positioning and line wrapping. SyntaxHighlighter colors
code blocks.

**src/ui/** -- HTML/CSS overlay components rendered on top of the 3D scene.
Each component is self-contained with its own CSS module.

**src/data/** -- Canonical content source. All text lives here. Components
read from data files, never hardcode strings.

**src/shaders/** -- GLSL files imported via Vite raw imports.

**src/styles/** -- CSS organized by component. global.css defines all custom
properties and resets.
```

---

## shared/success-metrics.md

```markdown
# Success Metrics

These KPIs are validated at every stage. Every design decision, content choice,
and implementation detail should move at least one metric in the right direction.

## Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse performance | 95+ | Chrome DevTools audit |
| First contentful paint | < 1.5s | Lighthouse |
| Largest contentful paint | < 2.5s | Core Web Vitals |
| Total bundle size | < 500KB gzipped | Vite build output |
| 3D frame rate | 60fps desktop, 30fps mobile | requestAnimationFrame monitor |
| Time to interactive | < 3s on 4G | Lighthouse TTI |

## Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| Average session duration | 45+ seconds | Analytics |
| Bounce rate | < 40% | Analytics |
| Project section reach | 60%+ of sessions scroll to projects | Scroll tracking |
| Terminal interaction rate | 20%+ of desktop sessions | Event tracking |

## Conversion

| Metric | Target | Measurement |
|--------|--------|-------------|
| Recruiter contacts | 3+ within 60 days of launch | Email/form tracking |
| Resume downloads | 10+ within 60 days | Click tracking |
| GitHub profile clicks | 5%+ of sessions | Link tracking |

## Quality

| Metric | Target | Measurement |
|--------|--------|-------------|
| Accessibility | WCAG 2.1 AA | axe DevTools |
| Cross-browser | Chrome, Firefox, Safari, Edge, iOS Safari, Chrome Android | Manual testing |
| Mobile parity | Full feature set at 320px | Device testing |
```

---

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| 3D performance on mobile | High | Poor UX, high bounce rate | LOD system with simplified geometry; 2D CSS-only fallback for non-WebGL; progressive enhancement |
| Scope creep | Medium | Delayed launch past internship cycle | Strict MVP at Stage 04; post-MVP features tracked in backlog, not built in pipeline |
| GitHub API rate limits | Medium | Missing project star/fork counts | Static fallback data in src/data/projects.ts; client-side caching with 1hr TTL |
| 3D model file size | Medium | Slow initial load | DRACO compression; LOD model variants; lazy loading behind boot screen |
| Browser WebGL compat | Low | Broken 3D on older browsers | Feature detection at load; graceful 2D fallback with CSS CRT effects |
| Font loading delay | Low | FOUT on terminal text | Font preload in HTML head; font-display: swap; system font fallback stack |

---

## References and Inspiration

| Source | What to Extract | URL |
|--------|----------------|-----|
| edh.dev (Ed Hinrichsen) | 3D retro computer, THREE.js, scroll zoom, UNIX shell, CRT shaders, Awwwards Honorable Mention | https://edh.dev |
| edhinrichsen/retro-computer-website | Open-source reference: TypeScript, THREE.js, file system, markdown renderer, text layout engine (384+ stars) | https://github.com/edhinrichsen/retro-computer-website |
| Brittany Chiang | Clean developer portfolio structure, project case study format | https://brittanychiang.com |
| matthisgarnier.webflow.io | Loading animations, page transitions | https://matthisgarnier.webflow.io |
| flowman.dev | Typography hierarchy, layout spacing | https://flowman.dev |

---

## Timeline

| Week | Stage | Deliverable |
|------|-------|-------------|
| 1 | 01-research + 02-design | Research report, design spec |
| 2 | 03-content | Site content package, terminal filesystem content |
| 3 | 04-build (scene + computer) | THREE.js scene, 3D model, scroll zoom, CRT shaders |
| 4 | 04-build (terminal + UI) | Shell system, overlay components, content integration |
| 5 | 05-polish | Performance optimization, a11y, cross-browser QA |
| 6 | 06-launch | Vercel deploy, DNS, SEO, OG tags, go-live |