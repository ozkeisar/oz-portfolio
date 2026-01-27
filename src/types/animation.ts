import type { ElementType } from 'react';

/**
 * Animation System Type Definitions
 * State machine for triggered animation sequences
 */

/**
 * Animation states for the state machine
 */
export type AnimationState =
  | 'INTRO' // Initial entrance animation (scroll locked)
  | 'IDLE' // Waiting for scroll input
  | 'TRANSITIONING' // Playing enter animation sequence (scroll locked)
  | 'CONTENT_SCROLL' // Section active, smooth scroll reveals overflow
  | 'EXITING' // Playing exit animation (scroll locked)
  | 'BUFFERING'; // Post-animation buffer period (scroll locked)

/**
 * Scroll direction for navigation
 */
export type ScrollDirection = 'forward' | 'backward';

/**
 * Exit animation direction
 */
export type ExitDirection = 'left' | 'right';

/**
 * Section identifiers
 */
export type SectionId = 'hero' | 'summary' | 'experience' | 'impact' | 'skills' | 'contact';

/**
 * Configuration for a single section
 */
export type SectionConfig = {
  id: SectionId;
  enterDuration: number; // Frames for enter animation
  reverseDuration?: number; // Frames for reverse animation (when going backward), defaults to enterDuration
  exitDuration: number; // Frames for exit animation
  exitDirection: ExitDirection;
  hasOverflowContent: boolean; // Whether section can scroll content
};

/**
 * Animation context state
 */
export type AnimationContext = {
  state: AnimationState;
  currentSection: number; // 0-based index into sections array
  previousSection: number | null;
  direction: ScrollDirection;
  sequenceFrame: number; // Frame within current animation sequence
  contentScrollOffset: number; // For CONTENT_SCROLL state
  maxContentScroll: number; // Max scroll for current section
  queuedDirection: ScrollDirection | null; // Scroll captured during lock
};

/**
 * Actions for the animation reducer
 */
export type AnimationAction =
  | { type: 'INTRO_COMPLETE' }
  | { type: 'START_TRANSITION'; direction: ScrollDirection }
  | { type: 'START_EXIT'; direction: ScrollDirection }
  | { type: 'UPDATE_SEQUENCE_FRAME'; frame: number }
  | { type: 'UPDATE_CONTENT_SCROLL'; offset: number }
  | { type: 'SET_MAX_CONTENT_SCROLL'; maxScroll: number }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'BUFFER_COMPLETE' }
  | { type: 'QUEUE_DIRECTION'; direction: ScrollDirection }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'JUMP_TO_SECTION'; index: number };

/**
 * Return type from useAnimationController hook
 */
export type AnimationControllerReturn = {
  // State
  state: AnimationState;
  currentSection: number;
  previousSection: number | null;
  direction: ScrollDirection;

  // Animation values
  sequenceFrame: number;
  sequenceProgress: number; // 0-1 progress in current sequence

  // Content scroll (for CONTENT_SCROLL state)
  contentScrollOffset: number;
  maxContentScroll: number;
  contentScrollProgress: number; // 0-1

  // Intro state (for HeroSection)
  introFrame: number;
  isIntroComplete: boolean;

  // Section helpers
  isCurrentSection: (sectionId: SectionId) => boolean;
  isPreviousSection: (sectionId: SectionId) => boolean;
  getCurrentSectionConfig: () => SectionConfig;

  // Manual control
  setMaxContentScroll: (maxScroll: number) => void;
};

/**
 * Props for the Typewriter component
 */
export type TypewriterProps = {
  text: string;
  charDelay?: number; // ms per character (default: 55)
  startFrame: number; // Animation sequence frame to start at
  currentFrame: number; // Current animation sequence frame
  fps?: number; // Default: 30
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
  direction?: ScrollDirection; // For reverse playback
};

/**
 * Exit animation configuration
 */
export type ExitAnimationConfig = {
  direction: ExitDirection;
  duration: number; // frames
  currentFrame: number;
  isExiting: boolean;
  scrollDirection?: ScrollDirection; // For reverse playback
};

/**
 * Exit animation computed values
 */
export type ExitAnimationValues = {
  opacity: number;
  translateX: number;
  scale: number;
};

/**
 * Viewport information
 */
export type ViewportInfo = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};
