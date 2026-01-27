import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  BUFFER_DURATION_MS,
  FPS,
  getSectionId,
  INTRO_DURATION_FRAMES,
  SECTIONS,
} from '../config/sections';
import { animationReducer, initialAnimationContext } from '../reducers/animationReducer';
import type { AnimationControllerReturn, SectionId } from '../types/animation';

/**
 * Scroll threshold in pixels to trigger a transition
 */
const SCROLL_THRESHOLD = 50;

/**
 * Core animation controller hook
 * Manages the state machine, scroll events, and animation playback
 */
export function useAnimationController(): AnimationControllerReturn {
  const [context, dispatch] = useReducer(animationReducer, initialAnimationContext);

  // Intro animation state (separate from main state machine)
  const [introFrame, setIntroFrame] = useState(0);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  // RAF and timing refs
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedScrollRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  // Boundary scroll tracking - requires fresh scroll after hitting edge
  const boundaryScrollRef = useRef(0);
  const boundaryTimeoutRef = useRef<number | null>(null);
  const atBoundaryRef = useRef<'top' | 'bottom' | null>(null);

  // ========================================
  // Intro Animation (plays on mount)
  // ========================================
  useEffect(() => {
    if (isIntroComplete) return;

    const introStartTime = performance.now();

    const animateIntro = (timestamp: number) => {
      const elapsed = timestamp - introStartTime;
      const frameDuration = 1000 / FPS;
      const currentFrame = Math.floor(elapsed / frameDuration);

      if (currentFrame >= INTRO_DURATION_FRAMES) {
        setIntroFrame(INTRO_DURATION_FRAMES);
        setIsIntroComplete(true);
        dispatch({ type: 'INTRO_COMPLETE' });
        return;
      }

      setIntroFrame(currentFrame);
      rafRef.current = requestAnimationFrame(animateIntro);
    };

    rafRef.current = requestAnimationFrame(animateIntro);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isIntroComplete]);

  // ========================================
  // Animation Sequence Playback
  // ========================================
  useEffect(() => {
    // Only run RAF loop during TRANSITIONING or EXITING states
    if (context.state !== 'TRANSITIONING' && context.state !== 'EXITING') {
      return;
    }

    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const frameDuration = 1000 / FPS;
      const currentFrame = Math.floor(elapsed / frameDuration);

      // Get target duration based on state and direction
      const sectionConfig = SECTIONS[context.currentSection];
      const targetDuration =
        context.state === 'TRANSITIONING'
          ? context.direction === 'backward' && sectionConfig.reverseDuration
            ? sectionConfig.reverseDuration
            : sectionConfig.enterDuration
          : sectionConfig.exitDuration;

      if (currentFrame >= targetDuration) {
        // Animation complete
        dispatch({ type: 'ANIMATION_COMPLETE' });
        startTimeRef.current = null;
        return;
      }

      dispatch({ type: 'UPDATE_SEQUENCE_FRAME', frame: currentFrame });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [context.state, context.currentSection]);

  // ========================================
  // Buffer Timer
  // ========================================
  useEffect(() => {
    if (context.state !== 'BUFFERING') return;

    const timeoutId = setTimeout(() => {
      dispatch({ type: 'BUFFER_COMPLETE' });
    }, BUFFER_DURATION_MS);

    return () => clearTimeout(timeoutId);
  }, [context.state]);

  // ========================================
  // Scroll Lock
  // ========================================
  useEffect(() => {
    const isLocked =
      !isIntroComplete ||
      context.state === 'INTRO' ||
      context.state === 'TRANSITIONING' ||
      context.state === 'EXITING' ||
      context.state === 'BUFFERING';

    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isIntroComplete, context.state]);

  // Reset accumulated scroll when state changes (ensures clean slate when returning to IDLE)
  useEffect(() => {
    if (context.state !== 'IDLE') {
      accumulatedScrollRef.current = 0;
    }
  }, [context.state]);

  // ========================================
  // Wheel Event Handler
  // ========================================
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // During intro, ignore all scroll
      if (!isIntroComplete) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 'forward' : 'backward';

      if (context.state === 'IDLE') {
        // Accumulate scroll delta
        accumulatedScrollRef.current += e.deltaY;

        if (Math.abs(accumulatedScrollRef.current) > SCROLL_THRESHOLD) {
          // Trigger transition
          dispatch({ type: 'START_TRANSITION', direction });
          accumulatedScrollRef.current = 0;
        }
      } else if (context.state === 'CONTENT_SCROLL') {
        // Allow scroll within content bounds
        const newOffset = context.contentScrollOffset + e.deltaY * 0.5; // Dampen scroll speed

        // Check if we're at or hitting a boundary
        const atBottom = newOffset >= context.maxContentScroll;
        const atTop = newOffset <= 0;

        // Clear boundary timeout on any scroll
        if (boundaryTimeoutRef.current) {
          clearTimeout(boundaryTimeoutRef.current);
        }

        if (atBottom && direction === 'forward') {
          // At bottom, scrolling down
          if (atBoundaryRef.current === 'bottom') {
            // Already at boundary, accumulate scroll
            boundaryScrollRef.current += Math.abs(e.deltaY);
            if (boundaryScrollRef.current > SCROLL_THRESHOLD * 2) {
              // Enough accumulated scroll, trigger exit
              dispatch({ type: 'START_EXIT', direction: 'forward' });
              boundaryScrollRef.current = 0;
              atBoundaryRef.current = null;
            }
          } else {
            // Just hit bottom boundary - start fresh accumulation
            atBoundaryRef.current = 'bottom';
            boundaryScrollRef.current = 0;
          }
          // Set timeout to reset boundary state after pause
          boundaryTimeoutRef.current = window.setTimeout(() => {
            boundaryScrollRef.current = 0;
          }, 300);
          // Clamp to max
          dispatch({ type: 'UPDATE_CONTENT_SCROLL', offset: context.maxContentScroll });
        } else if (atTop && direction === 'backward') {
          // At top, scrolling up
          if (atBoundaryRef.current === 'top') {
            // Already at boundary, accumulate scroll
            boundaryScrollRef.current += Math.abs(e.deltaY);
            if (boundaryScrollRef.current > SCROLL_THRESHOLD * 2) {
              // Enough accumulated scroll, trigger exit
              dispatch({ type: 'START_EXIT', direction: 'backward' });
              boundaryScrollRef.current = 0;
              atBoundaryRef.current = null;
            }
          } else {
            // Just hit top boundary - start fresh accumulation
            atBoundaryRef.current = 'top';
            boundaryScrollRef.current = 0;
          }
          // Set timeout to reset boundary state after pause
          boundaryTimeoutRef.current = window.setTimeout(() => {
            boundaryScrollRef.current = 0;
          }, 300);
          // Clamp to 0
          dispatch({ type: 'UPDATE_CONTENT_SCROLL', offset: 0 });
        } else {
          // Normal scrolling within bounds - clear boundary state
          atBoundaryRef.current = null;
          boundaryScrollRef.current = 0;
          dispatch({ type: 'UPDATE_CONTENT_SCROLL', offset: newOffset });
        }
      }
      // In locked states (TRANSITIONING, EXITING, BUFFERING), ignore scroll completely
      // Don't queue - user must scroll again after animation completes

      // Prevent default to stop page scroll
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isIntroComplete, context.state, context.contentScrollOffset, context.maxContentScroll]);

  // ========================================
  // Touch Event Handlers (Mobile)
  // ========================================
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      if (!isIntroComplete) {
        e.preventDefault();
        return;
      }

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - touchY;
      const direction = deltaY > 0 ? 'forward' : 'backward';

      if (context.state === 'IDLE') {
        if (Math.abs(deltaY) > SCROLL_THRESHOLD) {
          dispatch({ type: 'START_TRANSITION', direction });
          touchStartYRef.current = touchY; // Reset for next swipe
        }
      } else if (context.state === 'CONTENT_SCROLL') {
        const newOffset = context.contentScrollOffset + deltaY * 0.3;

        // Check if we're at or hitting a boundary
        const atBottom = newOffset >= context.maxContentScroll;
        const atTop = newOffset <= 0;

        // Clear boundary timeout on any touch move
        if (boundaryTimeoutRef.current) {
          clearTimeout(boundaryTimeoutRef.current);
        }

        if (atBottom && direction === 'forward') {
          if (atBoundaryRef.current === 'bottom') {
            boundaryScrollRef.current += Math.abs(deltaY);
            if (boundaryScrollRef.current > SCROLL_THRESHOLD * 1.5) {
              dispatch({ type: 'START_EXIT', direction: 'forward' });
              boundaryScrollRef.current = 0;
              atBoundaryRef.current = null;
            }
          } else {
            atBoundaryRef.current = 'bottom';
            boundaryScrollRef.current = 0;
          }
          boundaryTimeoutRef.current = window.setTimeout(() => {
            boundaryScrollRef.current = 0;
          }, 300);
          dispatch({ type: 'UPDATE_CONTENT_SCROLL', offset: context.maxContentScroll });
        } else if (atTop && direction === 'backward') {
          if (atBoundaryRef.current === 'top') {
            boundaryScrollRef.current += Math.abs(deltaY);
            if (boundaryScrollRef.current > SCROLL_THRESHOLD * 1.5) {
              dispatch({ type: 'START_EXIT', direction: 'backward' });
              boundaryScrollRef.current = 0;
              atBoundaryRef.current = null;
            }
          } else {
            atBoundaryRef.current = 'top';
            boundaryScrollRef.current = 0;
          }
          boundaryTimeoutRef.current = window.setTimeout(() => {
            boundaryScrollRef.current = 0;
          }, 300);
          dispatch({ type: 'UPDATE_CONTENT_SCROLL', offset: 0 });
        } else {
          atBoundaryRef.current = null;
          boundaryScrollRef.current = 0;
          dispatch({ type: 'UPDATE_CONTENT_SCROLL', offset: newOffset });
        }

        touchStartYRef.current = touchY;
      }
      // In locked states, ignore touch - don't queue

      e.preventDefault();
    };

    const handleTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isIntroComplete, context.state, context.contentScrollOffset, context.maxContentScroll]);

  // ========================================
  // Helper Functions
  // ========================================
  const isCurrentSection = useCallback(
    (sectionId: SectionId): boolean => {
      return getSectionId(context.currentSection) === sectionId;
    },
    [context.currentSection]
  );

  const isPreviousSection = useCallback(
    (sectionId: SectionId): boolean => {
      if (context.previousSection === null) return false;
      return getSectionId(context.previousSection) === sectionId;
    },
    [context.previousSection]
  );

  const getCurrentSectionConfig = useCallback(() => {
    return SECTIONS[context.currentSection];
  }, [context.currentSection]);

  const setMaxContentScroll = useCallback((maxScroll: number) => {
    dispatch({ type: 'SET_MAX_CONTENT_SCROLL', maxScroll });
  }, []);

  const setContentScrollOffset = useCallback((offset: number) => {
    dispatch({ type: 'UPDATE_CONTENT_SCROLL', offset });
  }, []);

  // ========================================
  // Computed Values
  // ========================================
  const sectionConfig = SECTIONS[context.currentSection];
  const targetDuration =
    context.state === 'EXITING'
      ? sectionConfig.exitDuration
      : context.direction === 'backward' && sectionConfig.reverseDuration
        ? sectionConfig.reverseDuration
        : sectionConfig.enterDuration;

  const sequenceProgress =
    targetDuration > 0 ? Math.min(context.sequenceFrame / targetDuration, 1) : 0;

  const contentScrollProgress =
    context.maxContentScroll > 0 ? context.contentScrollOffset / context.maxContentScroll : 0;

  return {
    // State
    state: context.state,
    currentSection: context.currentSection,
    previousSection: context.previousSection,
    direction: context.direction,

    // Animation values
    sequenceFrame: context.sequenceFrame,
    sequenceProgress,

    // Content scroll
    contentScrollOffset: context.contentScrollOffset,
    maxContentScroll: context.maxContentScroll,
    contentScrollProgress,

    // Intro state
    introFrame,
    isIntroComplete,

    // Section helpers
    isCurrentSection,
    isPreviousSection,
    getCurrentSectionConfig,

    // Manual control
    setMaxContentScroll,
    setContentScrollOffset,
  };
}
