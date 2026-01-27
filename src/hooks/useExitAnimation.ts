import type {
  ExitAnimationConfig,
  ExitAnimationValues,
  ExitDirection,
  ScrollDirection,
} from '../types/animation';
import { interpolate } from '../utils/animation';

/**
 * Ease-in-out cubic function for smooth exit motion
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * Calculate exit animation values
 * Returns opacity, translateX, and scale based on current frame
 */
export function calculateExitAnimation(config: ExitAnimationConfig): ExitAnimationValues {
  const { direction, duration, currentFrame, isExiting, scrollDirection = 'forward' } = config;

  // When not exiting, return neutral values
  if (!isExiting) {
    return { opacity: 1, translateX: 0, scale: 1 };
  }

  // Calculate progress (0 to 1)
  const rawProgress = Math.min(currentFrame / duration, 1);

  // For backward scroll direction, reverse the progress
  const progress = scrollDirection === 'backward' ? 1 - rawProgress : rawProgress;

  // Apply easing
  const eased = easeInOutCubic(progress);

  // Calculate translate direction
  // 'left' means slide to the left (negative X)
  // 'right' means slide to the right (positive X)
  const translateMultiplier = direction === 'left' ? -1 : 1;

  // Calculate final values
  const opacity = interpolate(eased, [0, 1], [1, 0]);
  const translateX = interpolate(eased, [0, 1], [0, 300 * translateMultiplier]);
  const scale = interpolate(eased, [0, 1], [1, 0.95]);

  return { opacity, translateX, scale };
}

/**
 * Get the opposite exit direction
 * Useful for entrance animations (enter from opposite side of exit)
 */
export function getOppositeDirection(direction: ExitDirection): ExitDirection {
  return direction === 'left' ? 'right' : 'left';
}

/**
 * Calculate entrance animation values
 * Elements enter from the opposite direction of their exit
 */
export function calculateEntranceAnimation(config: {
  exitDirection: ExitDirection;
  duration: number;
  currentFrame: number;
  isEntering: boolean;
  scrollDirection?: ScrollDirection;
}): ExitAnimationValues {
  const { exitDirection, duration, currentFrame, isEntering, scrollDirection = 'forward' } = config;

  // When not entering, return completed state (fully visible)
  if (!isEntering) {
    return { opacity: 1, translateX: 0, scale: 1 };
  }

  // Calculate progress (0 to 1)
  const rawProgress = Math.min(currentFrame / duration, 1);

  // For backward scroll direction, reverse the progress
  const progress = scrollDirection === 'backward' ? 1 - rawProgress : rawProgress;

  // Apply easing
  const eased = easeInOutCubic(progress);

  // Enter from opposite direction of exit
  const entranceDirection = getOppositeDirection(exitDirection);
  const translateMultiplier = entranceDirection === 'left' ? -1 : 1;

  // Animate from off-screen to center
  const opacity = interpolate(eased, [0, 1], [0, 1]);
  const translateX = interpolate(eased, [0, 1], [300 * translateMultiplier, 0]);
  const scale = interpolate(eased, [0, 1], [0.95, 1]);

  return { opacity, translateX, scale };
}

/**
 * Combined function for section animations
 * Handles both entrance and exit based on state
 */
export function calculateSectionAnimation(config: {
  exitDirection: ExitDirection;
  enterDuration: number;
  exitDuration: number;
  currentFrame: number;
  isEntering: boolean;
  isExiting: boolean;
  scrollDirection?: ScrollDirection;
}): ExitAnimationValues {
  const {
    exitDirection,
    enterDuration,
    exitDuration,
    currentFrame,
    isEntering,
    isExiting,
    scrollDirection = 'forward',
  } = config;

  if (isExiting) {
    return calculateExitAnimation({
      direction: exitDirection,
      duration: exitDuration,
      currentFrame,
      isExiting: true,
      scrollDirection,
    });
  }

  if (isEntering) {
    return calculateEntranceAnimation({
      exitDirection,
      duration: enterDuration,
      currentFrame,
      isEntering: true,
      scrollDirection,
    });
  }

  // Idle state - fully visible
  return { opacity: 1, translateX: 0, scale: 1 };
}
