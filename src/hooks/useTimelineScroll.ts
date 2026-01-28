import { EXPERIENCE_ITEM_COUNT, SCROLL_PER_ITEM } from '../data/experienceData';

/**
 * Timeline item state during scroll progression
 * Sequential: collapsing (0-0.5) then writing (0.5-1.0)
 */
export type ItemPhase = 'collapsing' | 'writing';

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
 *
 * Sequential behavior:
 * - 0 to 0.5: Current item collapses (fast)
 * - 0.5 to 1.0: Next item writes/expands
 * Items don't overlap - current must finish collapsing before next appears
 */
export function getTimelineScrollState(scrollOffset: number): TimelineScrollState {
  // Clamp scroll offset to valid range
  const clampedOffset = Math.max(0, scrollOffset);

  // Calculate which item we're on and progress within it
  const rawIndex = clampedOffset / SCROLL_PER_ITEM;
  const currentItemIndex = Math.min(Math.floor(rawIndex), EXPERIENCE_ITEM_COUNT - 1);
  const localProgress = Math.min(rawIndex - currentItemIndex, 1);

  // Determine phase based on local progress
  // Sequential: collapse first (0-0.5), then write next (0.5-1.0)
  let phase: ItemPhase;
  if (localProgress < 0.5) {
    phase = 'collapsing'; // Current item collapses first
  } else {
    phase = 'writing'; // Next item appears after collapse
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
 *
 * Sequential behavior:
 * - Current item collapses during 0-0.5 of local progress
 * - Next item writes/expands during 0.5-1.0 of local progress
 * - Items don't overlap - one finishes before next begins
 */
export function getItemState(
  itemIndex: number,
  scrollState: TimelineScrollState,
  stackedItemHeight: number
): ItemState {
  const { currentItemIndex, localProgress, stackedCount } = scrollState;

  // Item is before current - it's fully stacked
  if (itemIndex < currentItemIndex) {
    return {
      state: 'stacked',
      typewriterProgress: 1, // Text fully visible in stacked state (title only)
      collapseProgress: 1, // Fully collapsed
      stackOffset: itemIndex * stackedItemHeight,
      isVisible: true,
    };
  }

  // Item is the current one - it collapses during 0-0.5
  if (itemIndex === currentItemIndex) {
    if (localProgress < 0.5) {
      // Collapsing phase: 0-0.5 local progress (fast collapse)
      const collapseProgress = localProgress / 0.5;
      return {
        state: 'collapsing',
        typewriterProgress: 1 - collapseProgress, // Text deletes as we collapse
        collapseProgress,
        stackOffset: stackedCount * stackedItemHeight,
        isVisible: true,
      };
    } else {
      // Current item is fully collapsed (stacked) during 0.5-1.0
      return {
        state: 'stacked',
        typewriterProgress: 1,
        collapseProgress: 1,
        stackOffset: stackedCount * stackedItemHeight,
        isVisible: true,
      };
    }
  }

  // Item is the NEXT one (currentItemIndex + 1) - it appears during 0.5-1.0
  if (itemIndex === currentItemIndex + 1) {
    if (localProgress >= 0.5) {
      // Writing/expanding phase: 0.5-1.0 local progress
      const writeProgress = (localProgress - 0.5) / 0.5;
      return {
        state: 'expanding',
        typewriterProgress: writeProgress,
        collapseProgress: 0,
        stackOffset: (stackedCount + 1) * stackedItemHeight, // +1 because current is now stacked
        isVisible: true,
      };
    } else {
      // Next item is hidden until current item finishes collapsing
      return {
        state: 'upcoming',
        typewriterProgress: 0,
        collapseProgress: 0,
        stackOffset: 0,
        isVisible: false,
      };
    }
  }

  // Item is further ahead - it's upcoming (hidden)
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
  // Sequential behavior: each item takes SCROLL_PER_ITEM to collapse + next item to write
  // Last item doesn't need to collapse, just needs to be fully written (0.5 of scroll range)
  // Total: (N-1) full transitions + 0.5 for last item to appear
  return SCROLL_PER_ITEM * (EXPERIENCE_ITEM_COUNT - 1) + SCROLL_PER_ITEM * 0.5;
}
