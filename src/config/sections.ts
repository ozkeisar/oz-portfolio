import type { SectionConfig, SectionId } from '../types/animation';

/**
 * Animation timing constants
 */
export const FPS = 30;
export const INTRO_DURATION_FRAMES = 110; // ~3.7 seconds at 30fps
export const BUFFER_DURATION_MS = 0; // No buffer - user can scroll immediately after animation completes

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
    // - Intro animation (first load): full 110 frames (title draw, subtitle, accent, scroll indicator)
    // - Forward wrap from Contact: 15 delay (wait for Contact exit) + 110 intro = 125 frames
    enterDuration: 125, // Full intro animation after Contact exit
    // reverseDuration handles backward entrance (full intro animation):
    // - From Summary: 15 delay (wait for Summary exit) + 110 intro = 125 frames
    reverseDuration: 125, // Full intro animation after Summary exit
    // exitDuration: reverse of intro animation compressed to 500ms
    exitDuration: 15, // 500ms exit (both to Summary and wrap to Contact)
    exitDirection: 'left',
    hasOverflowContent: false,
  },
  {
    id: 'summary',
    // enterDuration needs to support both:
    // - Forward from hero: 15 delay + 30 animation = 45 frames
    // - Backward from experience: 15 delay + 30 animation = 45 frames
    enterDuration: 45, // 1s entry animation (15 delay + 30 animation)
    reverseDuration: 45, // Same for backward entry
    exitDuration: 15, // 500ms exit animation
    exitDirection: 'right',
    hasOverflowContent: true, // Text may overflow on mobile
  },
  {
    id: 'experience',
    // enterDuration needs to support:
    // - Forward from summary: 15 delay (wait for 500ms exit) + 30 animation = 45 frames
    // - Backward from later section: 30 animation (no delay)
    enterDuration: 45, // Max of forward and backward durations
    // reverseDuration handles backward entrance from Impact:
    // - 16 frames for Impact exit to complete (0-15 inclusive)
    // - 15 frames delay (BACKWARD_ENTRANCE_DELAY)
    // - 30 frames for Experience entrance animation
    reverseDuration: 60, // Backward entrance from Impact (needs time for Impact exit + Experience entrance)
    exitDuration: 45,
    exitDirection: 'left',
    hasOverflowContent: true, // Enables scroll-driven timeline
  },
  {
    id: 'impact',
    enterDuration: 90, // 3 seconds: 30 delay + 60 for animation sequence (2s)
    // reverseDuration handles backward entrance from Skills:
    // - 16 frames for Skills exit to complete (0-15 inclusive)
    // - 15 frames delay (BACKWARD_ENTRANCE_DELAY)
    // - 60 frames for Impact's animation sequence
    reverseDuration: 90, // Backward entrance from Skills
    exitDuration: 15, // 500ms exit animation
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
    // - Forward wrap to Hero: 15 frames (500ms), then Hero appears immediately
    exitDuration: 45, // Total transition time for wrap (contact exit + hero entrance overlap)
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
