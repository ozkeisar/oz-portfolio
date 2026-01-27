/**
 * Impact metrics data extracted from Oz Keisar's professional summary
 * Used by the Impact section for animated metric display
 */

export type MetricIcon =
  | 'users'
  | 'clock'
  | 'folder'
  | 'person-plus'
  | 'graduation'
  | 'trending-down';

export type ImpactMetric = {
  id: string;
  value: number;
  suffix: string; // '+', 'M+', '%', etc.
  label: string;
  subLabel?: string; // Optional detail line
  icon?: MetricIcon; // Icon identifier for visual display
  featured?: boolean; // Whether this is the hero/featured metric
};

export const impactMetrics: ImpactMetric[] = [
  {
    id: 'users',
    value: 1,
    suffix: 'M+',
    label: 'Users Impacted',
    subLabel: 'Leumi Bank App',
    icon: 'users',
    featured: true, // This is the hero metric
  },
  {
    id: 'years',
    value: 9,
    suffix: '+',
    label: 'Years Experience',
    subLabel: 'Full Stack & Leadership',
    icon: 'clock',
  },
  {
    id: 'projects',
    value: 5,
    suffix: '',
    label: 'Projects Managed',
    subLabel: 'Concurrent Oversight',
    icon: 'folder',
  },
  {
    id: 'team',
    value: 5,
    suffix: '',
    label: 'Developers Hired',
    subLabel: 'Leumi React Native',
    icon: 'person-plus',
  },
  {
    id: 'trained',
    value: 12,
    suffix: '',
    label: 'Juniors Trained',
    subLabel: 'AI-First Bootcamp',
    icon: 'graduation',
  },
  {
    id: 'improvement',
    value: 40,
    suffix: '%',
    label: 'Issues Reduced',
    subLabel: 'Mockingbird OSS',
    icon: 'trending-down',
  },
];

/**
 * Get the featured metric (hero display)
 */
export const featuredMetric = impactMetrics.find((m) => m.featured)!;

/**
 * Get supporting metrics (non-featured)
 */
export const supportingMetrics = impactMetrics.filter((m) => !m.featured);

/**
 * Total number of impact metrics
 */
export const IMPACT_METRIC_COUNT = impactMetrics.length;
