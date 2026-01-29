import { useEffect, useRef } from 'react';
import { FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { EXPERIENCE_ITEM_COUNT, experienceData } from '../../data/experienceData';
import { calculateExitAnimation } from '../../hooks/useExitAnimation';
import {
  getItemState,
  getTimelineScrollState,
  getTotalExperienceScroll,
} from '../../hooks/useTimelineScroll';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { TimelineItem } from '../experience/TimelineItem';
import { TimelineRail } from '../experience/TimelineRail';

// Layout constants
const STACKED_ITEM_HEIGHT = 44; // Height of a stacked (collapsed) item
const EXPANDED_ITEM_HEIGHT = 280; // Approximate height of expanded item

// Entrance animation timing
const ENTRANCE_DURATION = 45; // Frames for entrance animation (1.5s total: 0.5s delay + 1s typewriter)
const FIRST_ITEM_WRITE_START = 15; // Frame when first item starts writing (after header appears)
const FIRST_ITEM_WRITE_DURATION = 30; // 1 second for typewriter (30 frames at 30fps)
const FORWARD_ENTRANCE_DELAY = 15; // Wait for Summary exit (500ms) before appearing
const BACKWARD_ENTRANCE_DELAY = 15; // Wait for Impact exit (500ms) before appearing

/**
 * Experience Section with scroll-driven timeline animation
 *
 * Features:
 * - Entrance animation with first item typewriter
 * - Scroll-controlled progression through career history
 * - Items stack/unstack as user scrolls
 * - Bidirectional navigation (forward and backward)
 */
export function ExperienceSection() {
  const {
    sequenceFrame,
    direction,
    viewport,
    contentScrollOffset,
    setMaxContentScroll,
    setContentScrollOffset,
    state,
  } = useAnimationContext();
  const { isVisible, isExiting, isReversing, isEntering, isActive, isEnteringBackward } =
    useSectionVisibility('experience');

  // Detect if entering forward from Summary (not backward from a later section)
  const isEnteringForward = isEntering && !isEnteringBackward;

  // Ref for content measurement
  const contentRef = useRef<HTMLDivElement>(null);
  // Track if we've already set scroll for backward entry
  const hasSetBackwardScroll = useRef(false);

  // Set max content scroll when section becomes active
  // Also jump to end when entering backward from Impact
  useEffect(() => {
    if (isActive) {
      const totalScroll = getTotalExperienceScroll();
      setMaxContentScroll(totalScroll);

      // When entering backward (from Impact), jump to the end of the timeline
      if (isEnteringBackward || hasSetBackwardScroll.current) {
        // Jump to max scroll to show last item
        setContentScrollOffset(totalScroll);
        hasSetBackwardScroll.current = false;
      }
    }
  }, [isActive, setMaxContentScroll, setContentScrollOffset, isEnteringBackward]);

  // Track backward entry for when section becomes active
  useEffect(() => {
    if (isEnteringBackward) {
      hasSetBackwardScroll.current = true;
    }
  }, [isEnteringBackward]);

  // Reset scroll when section is no longer visible
  useEffect(() => {
    if (!isVisible) {
      setMaxContentScroll(0);
      hasSetBackwardScroll.current = false;
    }
  }, [isVisible, setMaxContentScroll]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Calculate entrance/exit progress
  // During TRANSITIONING (entering), sequenceFrame goes 0 → enterDuration
  // When isReversing (exiting backward), we reverse the animation
  const REVERSE_DURATION = 15; // 500ms reverse animation (15 frames at 30fps)

  // Detect if exiting forward (to Impact)
  const isExitingForward = isExiting && direction === 'forward';

  let entranceProgress: number;
  if (isReversing) {
    // Reversing: fade out from 1 → 0
    entranceProgress = interpolate(sequenceFrame, [0, REVERSE_DURATION], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (isExitingForward) {
    // Exiting forward to Impact: keep at 1, exit animation handles fade
    entranceProgress = 1;
  } else if (isEnteringForward) {
    // Forward entrance: delay until Summary text deletion is mostly done
    const delayedFrame = Math.max(0, sequenceFrame - FORWARD_ENTRANCE_DELAY);
    entranceProgress = spring({
      frame: delayedFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
  } else if (isEnteringBackward) {
    // Backward entrance from Impact: wait for Impact exit (500ms) before appearing
    const delayedFrame = Math.max(0, sequenceFrame - BACKWARD_ENTRANCE_DELAY);
    entranceProgress = spring({
      frame: delayedFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
  } else {
    // Active state
    entranceProgress = 1;
  }

  // Effective frame for typewriter during entrance
  // Maps entrance animation to typewriter timing
  let effectiveTypewriterFrame = 0;
  if (isEnteringForward) {
    // Forward entrance: wait for Summary text deletion, then start typewriter
    const delayedFrame = Math.max(0, sequenceFrame - FORWARD_ENTRANCE_DELAY);
    effectiveTypewriterFrame = Math.max(0, delayedFrame - FIRST_ITEM_WRITE_START);
  } else if (isEnteringBackward) {
    // Backward entrance from Impact: wait for Impact exit, then start typewriter
    const delayedFrame = Math.max(0, sequenceFrame - BACKWARD_ENTRANCE_DELAY);
    effectiveTypewriterFrame = Math.max(0, delayedFrame - FIRST_ITEM_WRITE_START);
  } else if (isActive) {
    // Section is active - use full entrance animation time for first item
    // Then content scroll drives the rest
    effectiveTypewriterFrame = ENTRANCE_DURATION;
  } else if (isReversing) {
    // Reversing: collapse content as sequenceFrame progresses
    // Map sequenceFrame to reverse the typewriter (text deletes)
    effectiveTypewriterFrame = interpolate(
      sequenceFrame,
      [0, REVERSE_DURATION],
      [ENTRANCE_DURATION, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );
  }

  // Calculate scroll state for timeline progression
  // Only apply scroll when in CONTENT_SCROLL state or active
  // When entering backward or exiting forward, use max scroll to show last item
  const totalScroll = getTotalExperienceScroll();
  const activeScrollOffset =
    isEnteringBackward || isExitingForward
      ? totalScroll
      : isActive || state === 'CONTENT_SCROLL'
        ? contentScrollOffset
        : 0;
  const scrollState = getTimelineScrollState(activeScrollOffset);

  // Exit animation
  // - isReversing: fade out handled by entranceProgress above
  // - isExiting forward: slide left
  const exitAnimation = isReversing
    ? { opacity: 1, translateX: 0, scale: 1 } // Opacity controlled by entranceProgress
    : calculateExitAnimation({
        direction: 'left',
        duration: 45,
        currentFrame: sequenceFrame,
        isExiting,
        scrollDirection: direction,
      });

  // Responsive values - desktop only
  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const numberSize = responsiveFontSize(viewport.width, 15, 20);
  const horizontalPadding = responsiveSpacing(viewport.width, 24, 80);
  const verticalPadding = responsiveSpacing(viewport.width, 20, 40);
  const contentGap = responsiveSpacing(viewport.width, 16, 40);

  // Content area dimensions
  // Calculate max content width but ensure it fits within available space
  const baseContentMaxWidth = responsiveValue(viewport.width, 320, 600, 320, 1200);
  // Available width after padding (safe area is handled separately in CSS)
  const availableWidth = viewport.width - horizontalPadding * 2;
  // Use the smaller of the two to prevent overflow
  const contentMaxWidth = Math.min(baseContentMaxWidth, availableWidth);

  // Rail height calculation
  const railHeight = Math.min(400, viewport.height * 0.5);

  // Header animation
  const headerOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const headerY = interpolate(entranceProgress, [0, 1], [20, 0]);

  // Section number animation (slightly delayed)
  const numberFrame = Math.max(0, sequenceFrame - 5);
  const numberProgress = spring({
    frame: numberFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });

  // ===========================================
  // Content container entrance/exit animation
  // ===========================================
  // Entrance: slides up and fades in (delayed after header)
  // Exit: slides in exit direction and fades out

  const CONTENT_ENTRANCE_DELAY = 10; // Start after header begins appearing

  let contentOpacity: number;
  let contentTranslateY: number;
  let contentTranslateX: number;

  if (isReversing) {
    // Reversing (going back to Summary): slide right and fade out
    const reverseProgress = interpolate(sequenceFrame, [0, REVERSE_DURATION], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    contentOpacity = interpolate(reverseProgress, [0, 0.6], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    contentTranslateY = 0;
    contentTranslateX = interpolate(reverseProgress, [0, 1], [0, 50], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (isExitingForward) {
    // Exiting forward (to Impact): slide left and fade out
    const exitProgress = interpolate(sequenceFrame, [0, 30], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    contentOpacity = interpolate(exitProgress, [0, 0.6], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    contentTranslateY = 0;
    contentTranslateX = interpolate(exitProgress, [0, 1], [0, -50], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (isEnteringForward) {
    // Forward entrance from Summary: morph animation reveals content
    // Opacity fades in quickly at the start, then clip-path handles the reveal
    const delayedFrame = Math.max(0, sequenceFrame - FORWARD_ENTRANCE_DELAY);
    contentOpacity = interpolate(delayedFrame, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    contentTranslateY = 0;
    contentTranslateX = 0;
  } else if (isEnteringBackward) {
    // Backward entrance from Impact: wait for Impact exit, then slide in from left
    const delayedFrame = Math.max(0, sequenceFrame - BACKWARD_ENTRANCE_DELAY);
    const contentEntranceProgress = spring({
      frame: Math.max(0, delayedFrame - CONTENT_ENTRANCE_DELAY),
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
    contentOpacity = interpolate(contentEntranceProgress, [0, 1], [0, 1]);
    contentTranslateY = 0;
    contentTranslateX = interpolate(contentEntranceProgress, [0, 1], [-30, 0]);
  } else {
    // Active state: fully visible
    contentOpacity = 1;
    contentTranslateY = 0;
    contentTranslateX = 0;
  }

  // During entrance, show first item writing
  // After entrance, use scroll state to determine what to show
  // Skip entrance phase when entering backward - show last item immediately
  const isEntrancePhase =
    isEntering && !isReversing && !isEnteringBackward && sequenceFrame < ENTRANCE_DURATION;

  // Calculate first item typewriter progress during entrance
  // Fast typewriter: 1 second (30 frames) to write all content
  const entranceTypewriterProgress = isEntrancePhase
    ? interpolate(effectiveTypewriterFrame, [0, FIRST_ITEM_WRITE_DURATION], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // Use CSS calc to add safe area insets for devices with notches/rounded corners
        paddingLeft: `calc(${horizontalPadding}px + env(safe-area-inset-left, 0px))`,
        paddingRight: `calc(${horizontalPadding}px + env(safe-area-inset-right, 0px))`,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
        opacity: exitAnimation.opacity * entranceProgress,
        transform: `translateX(${exitAnimation.translateX}px) scale(${exitAnimation.scale})`,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          width: '100%',
          maxWidth: contentMaxWidth + 60, // Account for rail width
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: responsiveSpacing(viewport.width, 16, 24),
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: interpolate(numberProgress, [0, 1], [0, 1]),
          }}
        >
          <span
            style={{
              fontSize: numberSize + 10,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: toRgbString(colors.accent),
              fontWeight: 400,
            }}
          >
            02.
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: titleSize,
              fontWeight: 600,
              color: toRgbString(colors.textPrimary),
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Experience
          </h2>
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: toRgbaString(colors.textSecondary, 0.3),
              marginLeft: 16,
              maxWidth: 200,
            }}
          />
        </div>
      </div>

      {/* Main content area: Rail + Items */}
      <div
        ref={contentRef}
        style={{
          display: 'flex',
          gap: contentGap,
          width: '100%',
          maxWidth: contentMaxWidth + 60,
          flex: 1,
          overflow: 'hidden',
          opacity: contentOpacity,
          transform: `translateY(${contentTranslateY}px) translateX(${contentTranslateX}px)`,
          boxSizing: 'border-box',
        }}
      >
        {/* Timeline Rail */}
        <TimelineRail
          scrollState={scrollState}
          entranceFrame={sequenceFrame}
          railHeight={railHeight}
        />

        {/* Timeline Items */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
            minWidth: 0, // Allow flex item to shrink below content size
          }}
        >
          {experienceData.map((item, index) => {
            // During entrance phase, only show first item with typewriter
            if (isEntrancePhase) {
              if (index > 0) return null;

              return (
                <TimelineItem
                  key={item.id}
                  item={item}
                  itemState={{
                    state: 'expanding',
                    typewriterProgress: entranceTypewriterProgress,
                    collapseProgress: 0,
                    stackOffset: 0,
                    isVisible: true,
                  }}
                  viewport={viewport}
                  expandedHeight={EXPANDED_ITEM_HEIGHT}
                  stackedHeight={STACKED_ITEM_HEIGHT}
                />
              );
            }

            // After entrance, use scroll-driven state
            const itemState = getItemState(index, scrollState, STACKED_ITEM_HEIGHT);

            return (
              <TimelineItem
                key={item.id}
                item={item}
                itemState={itemState}
                viewport={viewport}
                expandedHeight={EXPANDED_ITEM_HEIGHT}
                stackedHeight={STACKED_ITEM_HEIGHT}
                useMorphAnimation={index > 0} // Only items after the first use morph
              />
            );
          })}
        </div>
      </div>

      {/* Scroll hint (shows when content is scrollable) */}
      {isActive && scrollState.currentItemIndex < EXPERIENCE_ITEM_COUNT - 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: `calc(${verticalPadding}px + env(safe-area-inset-bottom, 0px))`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            opacity: 0.5,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: toRgbString(colors.textMuted),
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: 20,
              height: 30,
              border: `1px solid ${toRgbaString(colors.textMuted, 0.5)}`,
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 6,
            }}
          >
            <div
              style={{
                width: 3,
                height: 6,
                backgroundColor: toRgbString(colors.textMuted),
                borderRadius: 2,
                animation: 'scrollBounce 1.5s infinite',
              }}
            />
          </div>
        </div>
      )}

      {/* CSS animation for scroll indicator */}
      <style>
        {`
          @keyframes scrollBounce {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(4px); opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}
