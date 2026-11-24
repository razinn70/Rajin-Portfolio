export interface ProjectEntry {
  name: string
  slug: string
  subtitle: string
  role: string
  problem: string
  built: string
  result: string
  techStack: string[]
  year: string
  featured?: boolean
  // Add these as soon as they exist. A clickable repo or demo is worth more than any metric.
  githubUrl?: string
  liveUrl?: string
}

// Mirrors the Projects section of the resume PDF, plus the sales dashboard.
export const projects: ProjectEntry[] = [
  {
    name: 'JadeEd',
    slug: 'jadeed',
    subtitle: 'Canada education facility dashboard',
    role: 'Scrum Master and full stack developer, team of 6',
    problem: 'Analysts had to filter raw Statistics Canada tables by hand to find regions without enough schools.',
    built: 'A geospatial dashboard with a React and TypeScript front end, a Spring Boot REST API, a clustered map with province and facility filters, and a GitLab CI/CD pipeline with linters, unit tests, and Docker Compose.',
    result: 'Underserved regions are visible at a glance instead of after manual filtering.',
    techStack: ['React', 'TypeScript', 'Spring Boot', 'MariaDB', 'Docker', 'GitLab CI'],
    year: '2026',
    featured: true,
  },
  {
    name: 'BrainyYack',
    slug: 'brainyyack',
    subtitle: 'Intelligent tutoring system',
    role: 'Machine learning and data',
    problem: 'Teachers could not tell which students were falling behind until test results came in.',
    built: '5 personalization models (collaborative filtering, decision trees) trained on 10,000+ sessions, compared through A/B tests and cohort analysis.',
    result: '87% accuracy flagging at risk students; cohort analysis found features tied to 3x higher retention.',
    techStack: ['Python', 'scikit-learn', 'PostgreSQL', 'Streamlit'],
    year: '2025',
  },
  {
    name: 'VCard',
    slug: 'vcard',
    subtitle: 'Contact management system',
    role: 'Solo developer',
    problem: 'A systems course project: handle large contact files in C without a single memory leak.',
    built: 'A C backend with a Python (ctypes) GUI on top, a normalized MySQL schema with foreign keys, packaged in Docker.',
    result: 'Zero leaks under Valgrind and lookups under 50ms across 10,000+ contacts.',
    techStack: ['C', 'Python', 'MySQL', 'Docker', 'Valgrind'],
    year: '2025',
  },
  {
    name: 'Sales Performance Dashboard',
    slug: 'sales-dashboard',
    subtitle: 'Global ecommerce analytics',
    role: 'Solo analyst',
    problem: 'Half a million transactions across 38 countries with no clear view of what drives revenue.',
    built: 'SQL (CTEs, window functions) and pandas pipelines feeding a 10 view Tableau dashboard with revenue, order, and cohort filters.',
    result: 'Showed 3 countries drive 82% of revenue and 20 SKUs make up 30% of sales.',
    techStack: ['SQL', 'Python', 'pandas', 'Tableau'],
    year: '2026',
  },
]
