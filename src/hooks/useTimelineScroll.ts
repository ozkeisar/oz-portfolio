import { EXPERIENCE_ITEM_COUNT, SCROLL_PER_ITEM } from '../data/experienceData';

/**
 * Timeline item state during scroll progression
 */
export type ItemPhase = 'writing' | 'visible' | 'collapsing';

/**
 * Scroll state for the timeline
 */
export type TimelineScrollState = {
  /** Current item index (0-based) */
  currentItemIndex: number;
  /** Progress within current item (0-1) */
  localProgress: number;
  /** Current phase of the active item */
  phase: ItemPhase;
  /** Number of completed (stacked) items */
  stackedCount: number;
};

/**
 * Get the scroll state from a content scroll offset
 * Maps continuous scroll to discrete item states
 */
export function getTimelineScrollState(scrollOffset: number): TimelineScrollState {
  // Clamp scroll offset to valid range
  const clampedOffset = Math.max(0, scrollOffset);

  // Calculate which item we're on and progress within it
  const rawIndex = clampedOffset / SCROLL_PER_ITEM;
  const currentItemIndex = Math.min(Math.floor(rawIndex), EXPERIENCE_ITEM_COUNT - 1);
  const localProgress = Math.min(rawIndex - currentItemIndex, 1);

  // Determine phase based on local progress
  let phase: ItemPhase;
  if (localProgress < 0.3) {
    phase = 'writing';
  } else if (localProgress < 0.7) {
    phase = 'visible';
  } else {
    phase = 'collapsing';
  }

  // Items before current are stacked
  const stackedCount = currentItemIndex;

  return {
    currentItemIndex,
    localProgress,
    phase,
    stackedCount,
  };
}

/**
 * Calculate individual item state based on scroll position
 */
export type ItemState = {
  /** Visual state of the item */
  state: 'stacked' | 'expanding' | 'active' | 'collapsing' | 'upcoming';
  /** Typewriter progress (0-1), for text animation */
  typewriterProgress: number;
  /** Collapse progress (0-1), for shrinking animation */
  collapseProgress: number;
  /** Y offset when stacked (in stack position) */
  stackOffset: number;
  /** Whether this item should be visible */
  isVisible: boolean;
};

/**
 * Get the state for a specific item based on scroll position
 */
export function getItemState(
  itemIndex: number,
  scrollState: TimelineScrollState,
  stackedItemHeight: number
): ItemState {
  const { currentItemIndex, localProgress, phase, stackedCount } = scrollState;

  // Item is before current - it's stacked
  if (itemIndex < currentItemIndex) {
    return {
      state: 'stacked',
      typewriterProgress: 1, // Text fully visible in stacked state (title only)
      collapseProgress: 1, // Fully collapsed
      stackOffset: itemIndex * stackedItemHeight,
      isVisible: true,
    };
  }

  // Item is the current one
  if (itemIndex === currentItemIndex) {
    // Special case: First item (index 0) starts fully visible after entrance animation
    // Its "writing" phase already happened during entrance, so we skip to visible/collapsing
    if (itemIndex === 0) {
      if (localProgress < 0.7) {
        // First item is fully visible until collapse phase
        return {
          state: 'active',
          typewriterProgress: 1,
          collapseProgress: 0,
          stackOffset: 0,
          isVisible: true,
        };
      } else {
        // Collapsing phase: 0.7-1.0 local progress
        const collapseProgress = (localProgress - 0.7) / 0.3;
        return {
          state: 'collapsing',
          typewriterProgress: 1 - collapseProgress,
          collapseProgress,
          stackOffset: 0,
          isVisible: true,
        };
      }
    }

    // For items after the first, use normal phase logic
    if (phase === 'writing') {
      // Expanding/writing phase: 0-0.3 local progress
      const writeProgress = localProgress / 0.3;
      return {
        state: 'expanding',
        typewriterProgress: writeProgress,
        collapseProgress: 0,
        stackOffset: stackedCount * stackedItemHeight,
        isVisible: true,
      };
    } else if (phase === 'visible') {
      // Fully visible phase: 0.3-0.7 local progress
      return {
        state: 'active',
        typewriterProgress: 1,
        collapseProgress: 0,
        stackOffset: stackedCount * stackedItemHeight,
        isVisible: true,
      };
    } else {
      // Collapsing phase: 0.7-1.0 local progress
      const collapseProgress = (localProgress - 0.7) / 0.3;
      return {
        state: 'collapsing',
        typewriterProgress: 1 - collapseProgress, // Text deletes as we collapse
        collapseProgress,
        stackOffset: stackedCount * stackedItemHeight,
        isVisible: true,
      };
    }
  }

  // Item is after current - it's upcoming (hidden)
  return {
    state: 'upcoming',
    typewriterProgress: 0,
    collapseProgress: 0,
    stackOffset: 0,
    isVisible: false,
  };
}

/**
 * Calculate the total scroll needed for the experience section
 */
export function getTotalExperienceScroll(): number {
  // We need enough scroll to reach the last item and show it fully
  // Last item doesn't need collapse scroll, just writing + visible phases
  return SCROLL_PER_ITEM * (EXPERIENCE_ITEM_COUNT - 1) + SCROLL_PER_ITEM * 0.7;
}
