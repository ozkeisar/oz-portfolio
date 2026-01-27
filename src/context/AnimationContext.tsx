import { createContext, type ReactNode, useContext } from 'react';
import { FPS } from '../config/sections';
import { useAnimationController } from '../hooks/useAnimationController';
import { useViewport } from '../hooks/useViewport';
import type { AnimationControllerReturn, SectionId, ViewportInfo } from '../types/animation';

/**
 * Combined context value with animation and viewport
 */
type AnimationContextValue = AnimationControllerReturn & {
  viewport: ViewportInfo;
  fps: number;
};

const AnimationContext = createContext<AnimationContextValue | null>(null);

/**
 * Animation Provider component
 * Provides animation state and viewport info to all children
 */
export function AnimationProvider({ children }: { children: ReactNode }) {
  const animationController = useAnimationController();
  const viewport = useViewport();

  const value: AnimationContextValue = {
    ...animationController,
    viewport,
    fps: FPS,
  };

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}

/**
 * Hook to access animation context
 * Must be used within AnimationProvider
 */
export function useAnimationContext(): AnimationContextValue {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider');
  }
  return context;
}

/**
 * Hook to check if a specific section should be visible
 * Useful for conditional rendering of sections
 */
export function useSectionVisibility(sectionId: SectionId): {
  isVisible: boolean;
  isCurrent: boolean;
  isPrevious: boolean;
  isEntering: boolean;
  isExiting: boolean;
  isActive: boolean;
  /** True when this section is reversing (going backward while it's the previous section) */
  isReversing: boolean;
  /** True when entering via backward scroll (from a later section) */
  isEnteringBackward: boolean;
  /** True when entering via forward scroll with wrap (from contact to hero) */
  isEnteringFromWrap: boolean;
  /** True when exiting via wrap transition */
  isExitingToWrap: boolean;
} {
  const { state, direction, isCurrentSection, isPreviousSection, isWrapping } = useAnimationContext();

  const isCurrent = isCurrentSection(sectionId);
  const isPrevious = isPreviousSection(sectionId);

  // Section is visible if it's current or previous (during transition)
  const isVisible = isCurrent || (isPrevious && state === 'TRANSITIONING');

  // Entering: current section during TRANSITIONING
  const isEntering = isCurrent && state === 'TRANSITIONING';

  // Entering backward: current section during TRANSITIONING with backward direction
  const isEnteringBackward = isEntering && direction === 'backward';

  // Entering from wrap: entering forward during a wrap transition (contact→hero or backward hero→contact)
  const isEnteringFromWrap = isEntering && isWrapping;

  // Exiting: PREVIOUS section during TRANSITIONING (exits as new section enters)
  // OR current section during EXITING state (after content scroll)
  const isExiting = (isPrevious && state === 'TRANSITIONING') || (isCurrent && state === 'EXITING');

  // Exiting to wrap: previous section during a wrap transition
  const isExitingToWrap = isExiting && isWrapping;

  // Reversing: previous section going backward (should play reverse animation, not exit)
  const isReversing = isPrevious && state === 'TRANSITIONING' && direction === 'backward';

  const isActive = isCurrent && (state === 'IDLE' || state === 'CONTENT_SCROLL');

  return {
    isVisible,
    isCurrent,
    isPrevious,
    isEntering,
    isExiting,
    isActive,
    isReversing,
    isEnteringBackward,
    isEnteringFromWrap,
    isExitingToWrap,
  };
}
