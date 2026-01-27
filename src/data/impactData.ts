/**
 * Impact metrics data extracted from Oz Keisar's professional summary
 * Used by the Impact section for animated metric boxes
 */

export type ImpactMetric = {
  id: string;
  value: number;
  suffix: string; // '+', 'M+', '%', etc.
  label: string;
  subLabel?: string; // Optional detail line
};

export const impactMetrics: ImpactMetric[] = [
  {
    id: 'years',
    value: 9,
    suffix: '+',
    label: 'Years Experience',
    subLabel: 'Full Stack & Leadership',
  },
  {
    id: 'users',
    value: 1,
    suffix: 'M+',
    label: 'Users Impacted',
    subLabel: 'Leumi Bank App',
  },
  {
    id: 'projects',
    value: 5,
    suffix: '',
    label: 'Projects Managed',
    subLabel: 'Concurrent Oversight',
  },
  {
    id: 'team',
    value: 5,
    suffix: '',
    label: 'Developers Hired',
    subLabel: 'Leumi React Native',
  },
  {
    id: 'trained',
    value: 12,
    suffix: '',
    label: 'Juniors Trained',
    subLabel: 'AI-First Bootcamp',
  },
  {
    id: 'improvement',
    value: 40,
    suffix: '%',
    label: 'Issues Reduced',
    subLabel: 'Mockingbird OSS',
  },
];

/**
 * Total number of impact metrics
 */
export const IMPACT_METRIC_COUNT = impactMetrics.length;
