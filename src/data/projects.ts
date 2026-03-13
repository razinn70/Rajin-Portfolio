export interface ProjectEntry {
  name: string
  slug: string
  subtitle: string
  description: string
  impact: string
  techStack: string[]
  year: string
  githubUrl?: string
  liveUrl?: string
}

export const projects: ProjectEntry[] = [
  {
    name: 'JadeEd',
    slug: 'jadeed',
    subtitle: 'Canada Education Facility Dashboard',
    description:
      'Led a 6-person Agile team as Scrum Master to architect a full-stack geospatial dashboard on Statistics Canada ODEF data, with an interactive clustered map, province/facility-type filters, and a Spring Boot REST API.',
    impact:
      'Set up GitLab CI/CD with linters, unit tests, and Docker Compose; delivered grouped bar charts enabling analysts to spot underserved regions without manual table filtering.',
    techStack: ['React', 'TypeScript', 'Spring Boot', 'MariaDB', 'Docker'],
    year: '2026',
  },
  {
    name: 'BrainyYack',
    slug: 'brainyyack',
    subtitle: 'Intelligent Tutoring System',
    description:
      'Built 5 ML personalization algorithms (collaborative filtering, decision trees) on 10,000+ sessions, achieving 87% accuracy on at-risk detection and reducing teacher workload by 60%.',
    impact:
      'Validated via A/B testing across 500+ students; cohort analysis revealed features tied to 3x higher retention, driving a 45% engagement increase and 32% test score improvement.',
    techStack: ['Python', 'Streamlit', 'PostgreSQL', 'scikit-learn'],
    year: '2025',
  },
  {
    name: 'E-Commerce Sales Dashboard',
    slug: 'ecommerce-dashboard',
    subtitle: 'Global Sales Analytics Platform',
    description:
      'Processed 500,000+ transactions across 38 countries using SQL (CTEs, window functions) and pandas; built a 10-visualization Tableau dashboard with revenue, order volume, and cohort filters.',
    impact:
      'Identified top 3 countries driving 82% of revenue and top 20 SKUs at 30% of sales, directly informing inventory prioritization and geographic expansion strategy.',
    techStack: ['Python', 'SQL', 'Tableau', 'pandas'],
    year: '2026',
  },
]
