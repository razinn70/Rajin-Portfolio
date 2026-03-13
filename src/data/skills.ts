export interface SkillCategory {
  category: string
  skills: string[]
}

export const skills: SkillCategory[] = [
  {
    category: 'Languages',
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'SQL', 'R', 'Rust', 'HTML', 'CSS'],
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['React', 'Node.js', 'Spring Boot', 'Flask', 'FastAPI', 'Streamlit', 'scikit-learn', 'pandas', 'NumPy'],
  },
  {
    category: 'Databases & Tools',
    skills: ['PostgreSQL', 'MariaDB', 'Supabase', 'Docker', 'Git', 'GitHub', 'GitLab', 'GCP', 'Tableau', 'JIRA'],
  },
  {
    category: 'Concepts',
    skills: ['REST APIs', 'CI/CD', 'Agile', 'Scrum', 'OOP', 'A/B Testing', 'Serverless Architecture', 'Data Structures', 'Algorithms'],
  },
]
