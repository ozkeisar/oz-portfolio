/**
 * Experience data extracted from Oz-Keisar-Professional-Summary.md
 * Used by the Experience section timeline
 */

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  client?: string;
  period: string;
  description: string;
  achievements?: string[];
  technologies?: string[];
};

export const experienceData: ExperienceItem[] = [
  {
    id: 'ai-architect',
    role: 'AI Solution Architect & R&D Manager',
    company: 'Abra',
    period: '2024 - Present',
    description:
      'Leading AI-first development initiatives and managing cross-functional teams. Architecting solutions for new clients and assembling development teams.',
    achievements: [
      '7 direct reports across 5 active projects',
      'Proposed and created AI-first delivery team business plan',
      'Delivered internal app in 2 months vs 3-month estimate',
      'Developed AI-First Development bootcamp for 12 junior developers',
    ],
    technologies: ['AI/LLM Integration', 'React', 'TypeScript', 'Node.js'],
  },
  {
    id: 'leumi-lead',
    role: 'Team Lead - Mobile Development',
    company: 'Abra',
    client: 'Leumi Bank & Pepper',
    period: '2023 - 2024',
    description:
      'Led development of Leumi Bank mobile app serving 1M+ active users. Built the entire React Native team through hiring process.',
    achievements: [
      'Built React Native team of 5 developers',
      'Led rebuild of Pepper mobile app in React Native',
      'Created Mockingbird - reduced integration issues by ~40%',
      'Established shared code packages between Leumi and Pepper',
    ],
    technologies: ['React Native', 'TypeScript', 'Mobile Development'],
  },
  {
    id: 'oosto-lead',
    role: 'Team Lead',
    company: 'Abra',
    client: 'Oosto',
    period: '2021 - 2023',
    description:
      'Led team of 5 developers and 2 QA engineers on face recognition platform with real-time video processing.',
    achievements: [
      'Managed team of 7 (5 developers + 2 QA)',
      'Built real-time video processing features',
      'Microservices architecture on Kubernetes',
    ],
    technologies: ['React', 'Kubernetes', 'Microservices', 'SQL'],
  },
  {
    id: 'aspect-lead',
    role: 'Team Lead',
    company: 'Abra',
    client: 'Aspect Imaging',
    period: '2020 - 2021',
    description:
      'Led rebuild of MRI scanner control system, replacing legacy codebase with modern React-based solution.',
    achievements: [
      'Complete system modernization',
      'Replaced legacy codebase with React',
      'Medical device software compliance',
    ],
    technologies: ['React', 'TypeScript', 'Medical Imaging'],
  },
  {
    id: 'champion-dev',
    role: 'Full Stack Developer',
    company: 'Abra',
    client: 'Champion Motors',
    period: '2019 - 2020',
    description: 'Web and mobile application development for automotive industry.',
    achievements: ['Cross-platform mobile development', 'Full-stack web applications'],
    technologies: ['React', 'React Native', 'TypeScript', '.NET C#'],
  },
  {
    id: 'zebra-dev',
    role: 'Full Stack Developer',
    company: 'Abra',
    client: 'Zebra Medical Vision',
    period: '2019',
    description: 'Developed medical imaging applications for AI-powered diagnostics.',
    achievements: ['Medical imaging application development', 'Healthcare software compliance'],
    technologies: ['Angular', 'Node.js', 'Medical Imaging'],
  },
  {
    id: 'idf-dev',
    role: 'Full Stack Developer',
    company: 'IDF - Israeli Air Force',
    period: '2015 - 2017',
    description:
      'Application development for mission-critical defense systems. Received Base Excellence Award.',
    achievements: ['Base Excellence Award recipient', 'Mission-critical system development'],
    technologies: ['Full Stack Development', 'Defense Systems'],
  },
];

/**
 * Total number of experience items
 */
export const EXPERIENCE_ITEM_COUNT = experienceData.length;

/**
 * Scroll amount per timeline item (in pixels)
 */
export const SCROLL_PER_ITEM = 400;

/**
 * Total scroll range for the experience section
 */
export const TOTAL_EXPERIENCE_SCROLL = SCROLL_PER_ITEM * (EXPERIENCE_ITEM_COUNT - 1);
