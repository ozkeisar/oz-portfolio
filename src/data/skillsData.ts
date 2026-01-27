/**
 * Skills data derived from Oz Keisar's professional background
 */

export type Skill = {
  name: string;
  abbr?: string; // Short abbreviation for compact display
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: Skill[];
};

/**
 * Skill categories organized by domain
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Languages',
    skills: [
      { name: 'JavaScript', abbr: 'JS' },
      { name: 'TypeScript', abbr: 'TS' },
      { name: 'C#' },
      { name: 'Python', abbr: 'PY' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    skills: [{ name: 'React' }, { name: 'React Native', abbr: 'RN' }, { name: 'Angular' }],
  },
  {
    id: 'backend',
    name: 'Backend',
    skills: [{ name: 'Node.js', abbr: 'Node' }, { name: '.NET' }],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    skills: [
      { name: 'AWS' },
      { name: 'Azure' },
      { name: 'Kubernetes', abbr: 'K8s' },
      { name: 'Docker' },
      { name: 'Microservices', abbr: 'MSA' },
    ],
  },
  {
    id: 'data',
    name: 'Data',
    skills: [
      { name: 'SQL' },
      { name: 'PostgreSQL', abbr: 'PG' },
      { name: 'MongoDB', abbr: 'Mongo' },
    ],
  },
  {
    id: 'leadership',
    name: 'Leadership',
    skills: [
      { name: 'Team Building' },
      { name: 'Hiring' },
      { name: 'Client Management', abbr: 'Client Mgmt' },
      { name: 'Business Development', abbr: 'Biz Dev' },
    ],
  },
];

/**
 * Total count of skills across all categories
 */
export const TOTAL_SKILLS_COUNT = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

/**
 * Total count of categories
 */
export const CATEGORY_COUNT = skillCategories.length;
