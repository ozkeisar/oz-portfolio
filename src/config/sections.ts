import type { SectionConfig, SectionId } from '../types/animation';

/**
 * Animation timing constants
 */
export const FPS = 30;
export const INTRO_DURATION_FRAMES = 110; // ~3.7 seconds at 30fps
export const BUFFER_DURATION_MS = 400; // Buffer after animation completes

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
    enterDuration: 110, // Uses existing intro animation
    exitDuration: 45, // ~1.5s slide out
    exitDirection: 'left',
    hasOverflowContent: false,
  },
  {
    id: 'summary',
    // OLD SLOW ENTER: was 660 frames (~22s) for full typewriter animation
    enterDuration: 125, // 35 frame delay + 90 frame animation (~4s total)
    reverseDuration: 90, // ~3s compressed reverse (text deletion) when going backward
    exitDuration: 45,
    exitDirection: 'right',
    hasOverflowContent: true, // Text may overflow on mobile
  },
  {
    id: 'experience',
    enterDuration: 120, // Longer for timeline
    exitDuration: 45,
    exitDirection: 'left',
    hasOverflowContent: true,
  },
  {
    id: 'impact',
    enterDuration: 90,
    exitDuration: 45,
    exitDirection: 'right',
    hasOverflowContent: false,
  },
  {
    id: 'skills',
    enterDuration: 90,
    exitDuration: 45,
    exitDirection: 'left',
    hasOverflowContent: true,
  },
  {
    id: 'contact',
    enterDuration: 75,
    exitDuration: 45,
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
