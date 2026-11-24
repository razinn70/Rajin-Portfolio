export interface ExperienceEntry {
  role: string
  company: string
  location: string
  period: string
  startDate: string
  endDate: string | null
  current: boolean
  bullets: string[]
}

// Mirrors the Experience section of /public/resume/UddinRajinResume.pdf
export const experience: ExperienceEntry[] = [
  {
    role: 'Lead Software Developer',
    company: 'MapleKey Media',
    location: 'Waterloo Region, ON',
    period: 'Jan 2026 to Present',
    startDate: '2026-01',
    endDate: null,
    current: true,
    bullets: [
      'Lead all technical strategy and engineering for a digital agency, shipping 3 client websites with landing pages and lead funnels for real estate, political campaign, and local business clients in 2 week build cycles.',
      'Architected the agency platform and marketing stack with React, TypeScript, serverless edge functions, PostgreSQL, CI/CD, and Meta ad integration, cutting intake to a 24 hour turnaround and driving a 403% increase in client inquiries.',
      'Built an AI lead scraping agent in Python that automates prospect discovery, plus Python workflow automations that remove repetitive manual work for clients.',
    ],
  },
  {
    role: 'Software Developer Intern',
    company: 'Cross World Ltd.',
    location: 'Dhaka, Bangladesh',
    period: 'May 2025 to Aug 2025',
    startDate: '2025-05',
    endDate: '2025-08',
    current: false,
    bullets: [
      'Diagnosed and fixed front end performance bottlenecks across 12 landing pages with Lighthouse and Chrome DevTools, for 57% faster page loads and a 23% higher mobile conversion rate.',
      'Wrote Python scripts that parsed JIRA data across 8 sprints and surfaced recurring blockers to engineering leadership, informing changes that cut cycle time by 2.3 days and raised velocity by 15%.',
    ],
  },
]
