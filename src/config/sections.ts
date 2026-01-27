import type { SectionConfig, SectionId } from '../types/animation';

/**
 * Animation timing constants
 */
export const FPS = 30;
export const INTRO_DURATION_FRAMES = 110; // ~3.7 seconds at 30fps
export const BUFFER_DURATION_MS = 200; // Buffer after animation completes

/**
 * Typewriter timing
 */
export const TYPEWRITER_CHAR_DELAY = 25; // ms per character (~40 chars/sec) - fast readable speed
export const TYPEWRITER_PUNCTUATION_DELAY = 60; // Shorter pause for punctuation

/**
 * Section configurations
 * Defines timing and behavior for each section
 */
export const SECTIONS: SectionConfig[] = [
  {
    id: 'hero',
    // enterDuration handles both:
    // - Intro animation (first time): full 110 frames
    // - Forward wrap from Contact: 15 delay + 60 animation = 75 frames (110 is plenty)
    enterDuration: 110,
    // reverseDuration for backward wrap to Contact
    reverseDuration: 90, // Hero → Contact backward wrap: 60 frames (30 exit + 60 image move overlap)
    exitDuration: 45, // ~1.5s slide out
    exitDirection: 'left',
    hasOverflowContent: false,
  },
  {
    id: 'summary',
    // OLD SLOW ENTER: was 660 frames (~22s) for full typewriter animation
    // enterDuration needs to support both:
    // - Forward from hero: 35 delay + 90 animation = 125 frames
    // - Backward from experience: 60 delay (wait for exp reverse) + 90 animation = 150 frames
    enterDuration: 150, // Max of forward and backward durations
    reverseDuration: 90, // ~3s compressed reverse (text deletion) when going backward
    exitDuration: 45,
    exitDirection: 'right',
    hasOverflowContent: true, // Text may overflow on mobile
  },
  {
    id: 'experience',
    // enterDuration needs to support:
    // - Forward from summary: 110 delay (wait for text deletion) + 90 animation = 200 frames
    // - Backward from later section: 90 animation (no delay)
    enterDuration: 200, // Max of forward and backward durations
    reverseDuration: 90, // Reverse animation when going backward
    exitDuration: 45,
    exitDirection: 'left',
    hasOverflowContent: true, // Enables scroll-driven timeline
  },
  {
    id: 'impact',
    enterDuration: 210, // 7 seconds for full SVG + number animation sequence (6 items)
    exitDuration: 45,
    exitDirection: 'right',
    hasOverflowContent: false, // Animation-based, not scroll-driven
  },
  {
    id: 'skills',
    // enterDuration needs to support:
    // - Forward from impact: 30 delay + image arrival (75) + 180 animation = 285 frames
    // - Backward from contact: 15 delay + 180 animation = 195 frames
    enterDuration: 285, // Max of forward and backward durations
    reverseDuration: 195, // Backward entrance: 15 delay (wait for Contact exit) + 180 animation
    exitDuration: 15, // 500ms fast exit (reverse of entrance animation)
    exitDirection: 'left',
    hasOverflowContent: false, // Animation-based, no scroll-driven content
  },
  {
    id: 'contact',
    // enterDuration handles:
    // - Forward from skills: 15 delay + 75 fast animation = 90 frames
    // - Forward wrap from Hero: handled by wrap-specific logic in component
    enterDuration: 90,
    // reverseDuration handles backward entrance:
    // - Backward from skills: 75 frames fast animation
    // - Backward wrap from Hero: 15 delay + 45 animation = 60 frames
    reverseDuration: 90, // Use 90 to accommodate both cases
    // exitDuration handles forward exit:
    // - Forward to Skills: 15 frames (500ms)
    // - Forward wrap to Hero: 45 frames for dramatic exit (handled in component)
    exitDuration: 45, // 1.5s exit animation for wrap transition
    exitDirection: 'right',
    hasOverflowContent: false,
  },
];

/**
 * Get section config by ID
 */
export function getSectionConfig(id: SectionId): SectionConfig {
  const config = SECTIONS.find((s) => s.id === id);
  if (!config) {
    throw new Error(`Section config not found for: ${id}`);
  }
  return config;
}

/**
 * Get section index by ID
 */
export function getSectionIndex(id: SectionId): number {
  const index = SECTIONS.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Section not found: ${id}`);
  }
  return index;
}

/**
 * Get section ID by index
 */
export function getSectionId(index: number): SectionId {
  const section = SECTIONS[index];
  if (!section) {
    throw new Error(`Section not found at index: ${index}`);
  }
  return section.id;
}

/**
 * Total number of sections
 */
export const TOTAL_SECTIONS = SECTIONS.length;
