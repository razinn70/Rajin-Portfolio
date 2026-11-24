export interface SkillCategory {
  category: string
  skills: string[]
}

// Mirrors the Technical Skills section of the resume PDF. Strongest first.
export const skills: SkillCategory[] = [
  { category: 'Languages', skills: ['TypeScript', 'Python', 'Java', 'SQL', 'JavaScript', 'C', 'Dart', 'R', 'Rust'] },
  { category: 'Frameworks', skills: ['React', 'Node.js', 'Spring Boot', 'FastAPI', 'Flask', 'Flutter', 'Streamlit'] },
  { category: 'Data and ML', skills: ['pandas', 'NumPy', 'scikit-learn', 'A/B testing', 'Tableau'] },
  { category: 'Infra and tools', skills: ['PostgreSQL', 'MySQL', 'Supabase', 'Docker', 'GCP', 'Linux', 'Git', 'GitLab CI', 'Valgrind'] },
]
