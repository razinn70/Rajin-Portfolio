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

${personal.pitch}

4th year Computer Science student at the University of Guelph, minor in
Project Management, graduating May 2027. Grew up in Dhaka, now building
in Guelph and Waterloo Region.

Now: Lead Software Developer at MapleKey Media. I run engineering for the
agency, from client sites and lead funnels to an AI lead scraping agent.

Next: ${personal.availability}.

## Education

University of Guelph, Guelph ON
Honours Bachelor of Computing, Computer Science
Minor in Project Management, expected May 2027
`

const skillsContent = skills
  .map(cat => `## ${cat.category}\n${cat.skills.map(s => `  ${s}`).join('\n')}`)
  .join('\n\n')

const contactContent = `# Contact

Email:    ${personal.email}
Phone:    ${personal.phone}
GitHub:   ${personal.githubUrl}
LinkedIn: ${personal.linkedinUrl}
Resume:   ${personal.siteUrl}${personal.resumePath}
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
    content: `# ${p.name}: ${p.subtitle}\n${p.techStack.join(', ')} | ${p.year}\n\nRole: ${p.role}\n\nProblem: ${p.problem}\n\nBuilt: ${p.built}\n\nResult: ${p.result}\n`,
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
