export interface PersonalInfo {
  name: string
  role: string
  tagline: string
  pitch: string
  availability: string
  location: string
  email: string
  phone: string
  github: string
  githubUrl: string
  linkedin: string
  linkedinUrl: string
  domain: string
  siteUrl: string
  resumePath: string
}

// Single source of truth for identity. Keep this in sync with the resume PDF in /public/resume.
export const personal: PersonalInfo = {
  name: 'Rajin Uddin',
  role: 'Software Developer',
  tagline: 'Guelph Computer Science, class of 2027',
  pitch: 'I build production software for real clients, then measure what it changed.',
  availability: 'Open to Summer 2027 internships and 12 to 16 month terms',
  location: 'Guelph and Waterloo Region, ON',
  email: 'muddinal@uoguelph.ca',
  phone: '+1 (437) 808-1738',
  github: 'razinn70',
  githubUrl: 'https://github.com/razinn70',
  linkedin: 'rajinu',
  linkedinUrl: 'https://www.linkedin.com/in/rajinu',
  domain: 'rajin-portfolio.vercel.app',
  siteUrl: 'https://rajin-portfolio.vercel.app',
  resumePath: '/resume/UddinRajinResume.pdf',
}

// Three proof points shown in the hero. Each must be backed by the resume.
export const heroProof: { value: string; label: string }[] = [
  { value: '403%', label: 'more client inquiries after the MapleKey platform launch' },
  { value: '57%', label: 'faster page loads across 12 landing pages at Cross World' },
  { value: '6', label: 'person Scrum team led to ship JadeEd' },
]
