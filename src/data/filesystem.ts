import { personal } from './personal'
import { experience } from './experience'
import { projects } from './projects'
import { skills } from './skills'

export interface FSFile {
  type: 'file'
  name: string
  content: string
}

export interface FSDir {
  type: 'dir'
  name: string
  children: (FSFile | FSDir)[]
}

const aboutContent = `# Rajin Uddin

I build things that work and look good doing it.

From Dhaka to Guelph, I've spent the last few years turning coffee and curiosity into production
systems that move real numbers. 3rd-year Computer Science student at the University of Guelph,
minor in Project Management, graduating May 2027.

Right now I lead development at MapleKey Media — sole dev on a full-stack platform that replaced
an entire manual intake process and guarantees 24-hour turnaround at scale. Before that, 15+ web
apps shipped at PixelPro Analytics. Before that, a summer in Dhaka shaving 57% off page load
times.

I want to ship software that matters. If you're building it, let's talk.

## Education

University of Guelph — Guelph, ON
Honours Bachelor of Computing, Computer Science | Minor in Project Management
Aug 2023 – May 2027

Relevant: Data Structures & Algorithms, Operating Systems, Software Engineering,
Database Systems, Computer Networks, Theory of Computation
`

const skillsContent = skills
  .map(cat => `## ${cat.category}\n${cat.skills.map(s => `  ${s}`).join('\n')}`)
  .join('\n\n')

const contactContent = `# Contact

Email:    ${personal.email}
Phone:    ${personal.phone}
GitHub:   ${personal.githubUrl}
LinkedIn: ${personal.linkedinUrl}
Resume:   https://${personal.domain}${personal.resumePath}
`

function makeExperienceFile(e: typeof experience[0]): FSFile {
  return {
    type: 'file',
    name: e.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.md',
    content: `# ${e.role} @ ${e.company}
${e.location} | ${e.period}

${e.bullets.map(b => `- ${b}`).join('\n')}
`,
  }
}

function makeProjectFile(p: typeof projects[0]): FSFile {
  return {
    type: 'file',
    name: p.slug + '.md',
    content: `# ${p.name} — ${p.subtitle}
${p.techStack.join(', ')} | ${p.year}

${p.description}

${p.impact}
`,
  }
}

export const virtualFS: FSDir = {
  type: 'dir',
  name: '/',
  children: [
    {
      type: 'dir',
      name: 'home',
      children: [
        {
          type: 'dir',
          name: 'rajin',
          children: [
            { type: 'file', name: 'about.md', content: aboutContent },
            { type: 'file', name: 'skills.md', content: `# Skills\n\n${skillsContent}` },
            { type: 'file', name: 'contact.md', content: contactContent },
            {
              type: 'dir',
              name: 'experience',
              children: experience.map(makeExperienceFile),
            },
            {
              type: 'dir',
              name: 'projects',
              children: projects.map(makeProjectFile),
            },
          ],
        },
      ],
    },
  ],
}
