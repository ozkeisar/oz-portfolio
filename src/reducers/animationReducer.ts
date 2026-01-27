import { SECTIONS, TOTAL_SECTIONS } from '../config/sections';
import type { AnimationAction, AnimationContext } from '../types/animation';

/**
 * Initial state for the animation context
 */
export const initialAnimationContext: AnimationContext = {
  state: 'INTRO',
  currentSection: 0, // Start at hero
  previousSection: null,
  direction: 'forward',
  sequenceFrame: 0,
  contentScrollOffset: 0,
  maxContentScroll: 0,
  queuedDirection: null,
};

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Animation state machine reducer
 */
export function animationReducer(
  state: AnimationContext,
  action: AnimationAction
): AnimationContext {
  switch (action.type) {
    case 'INTRO_COMPLETE': {
      // Transition from INTRO to IDLE after hero entrance
      return {
        ...state,
        state: 'IDLE',
        sequenceFrame: 0,
      };
    }

    case 'START_TRANSITION': {
      // Can only start transition from IDLE
      if (state.state !== 'IDLE') {
        return state;
      }

      const nextSection =
        action.direction === 'forward'
          ? Math.min(state.currentSection + 1, TOTAL_SECTIONS - 1)
          : Math.max(state.currentSection - 1, 0);

      // If at boundaries, stay in IDLE
      if (nextSection === state.currentSection) {
        return state;
      }

      return {
        ...state,
        state: 'TRANSITIONING',
        previousSection: state.currentSection,
        currentSection: nextSection,
        direction: action.direction,
        sequenceFrame: 0,
        contentScrollOffset: 0,
      };
    }

    case 'START_EXIT': {
      // Can only start exit from CONTENT_SCROLL or IDLE
      if (state.state !== 'CONTENT_SCROLL' && state.state !== 'IDLE') {
        return state;
      }

      // Skip EXITING state and go directly to TRANSITIONING
      // This ensures a single animation phase where:
      // - Previous section plays its exit animation (backward-typewriter)
      // - Current section waits, then plays its entrance animation
      // Using separate EXITING then TRANSITIONING would reset sequenceFrame mid-animation

      if (action.direction === 'backward') {
        const prevSection = Math.max(state.currentSection - 1, 0);
        if (prevSection === state.currentSection) {
          // At first section, can't go back
          return state;
        }
        return {
          ...state,
          state: 'TRANSITIONING',
          previousSection: state.currentSection,
          currentSection: prevSection,
          direction: 'backward',
          sequenceFrame: 0,
        };
      }

      // Forward direction
      const nextSection = Math.min(state.currentSection + 1, TOTAL_SECTIONS - 1);
      if (nextSection === state.currentSection) {
        // At last section, can't go forward
        return state;
      }
      return {
        ...state,
        state: 'TRANSITIONING',
        previousSection: state.currentSection,
        currentSection: nextSection,
        direction: 'forward',
        sequenceFrame: 0,
      };
    }

    case 'UPDATE_SEQUENCE_FRAME': {
      return {
        ...state,
        sequenceFrame: action.frame,
      };
    }

    case 'UPDATE_CONTENT_SCROLL': {
      return {
        ...state,
        contentScrollOffset: clamp(action.offset, 0, state.maxContentScroll),
      };
    }

    case 'SET_MAX_CONTENT_SCROLL': {
      return {
        ...state,
        maxContentScroll: Math.max(0, action.maxScroll),
      };
    }

    case 'ANIMATION_COMPLETE': {
      if (state.state === 'TRANSITIONING') {
        const sectionConfig = SECTIONS[state.currentSection];

        // If section has overflow content, go to CONTENT_SCROLL
        // The section will measure itself and set maxContentScroll when active
        // If no overflow, first scroll will trigger exit immediately
        if (sectionConfig.hasOverflowContent) {
          return {
            ...state,
            state: 'CONTENT_SCROLL',
            // Always start at top - each section has its own scroll range
            // The previous section's contentScrollOffset doesn't apply to this section
            contentScrollOffset: 0,
          };
        }

        // Keep sequenceFrame at final value - don't reset!
        // This maintains the entrance animation's final state
        return {
          ...state,
          state: 'BUFFERING',
          // sequenceFrame stays at its current value (enterDuration)
        };
      }

      if (state.state === 'EXITING') {
        // After exit animation, start transitioning to next/prev section
        const nextSection =
          state.direction === 'forward'
            ? Math.min(state.currentSection + 1, TOTAL_SECTIONS - 1)
            : Math.max(state.currentSection - 1, 0);

        // If at boundaries, go to BUFFERING instead
        if (nextSection === state.currentSection) {
          return {
            ...state,
            state: 'BUFFERING',
            // Keep sequenceFrame at final value
          };
        }

        // Starting new transition - NOW reset sequenceFrame
        return {
          ...state,
          state: 'TRANSITIONING',
          previousSection: state.currentSection,
          currentSection: nextSection,
          sequenceFrame: 0,
          contentScrollOffset: 0,
        };
      }

      return state;
    }

    case 'BUFFER_COMPLETE': {
      // Simply transition to IDLE - user must scroll again to trigger next transition
      return {
        ...state,
        state: 'IDLE',
        queuedDirection: null,
      };
    }

    case 'QUEUE_DIRECTION': {
      // Only queue if in a locked state
      if (
        state.state === 'TRANSITIONING' ||
        state.state === 'EXITING' ||
        state.state === 'BUFFERING'
      ) {
        return {
          ...state,
          queuedDirection: action.direction,
        };
      }
      return state;
    }

    case 'CLEAR_QUEUE': {
      return {
        ...state,
        queuedDirection: null,
      };
    }

    case 'JUMP_TO_SECTION': {
      // For debugging/testing - jump directly to a section
      const targetIndex = clamp(action.index, 0, TOTAL_SECTIONS - 1);
      return {
        ...state,
        state: 'IDLE',
        currentSection: targetIndex,
        previousSection: state.currentSection,
        sequenceFrame: 0,
        contentScrollOffset: 0,
        queuedDirection: null,
      };
    }

    default:
      return state;
  }
}
