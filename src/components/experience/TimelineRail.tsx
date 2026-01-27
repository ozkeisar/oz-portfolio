import { memo } from 'react';
import { FPS } from '../../config/sections';
import { EXPERIENCE_ITEM_COUNT } from '../../data/experienceData';
import type { TimelineScrollState } from '../../hooks/useTimelineScroll';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

type TimelineRailProps = {
  scrollState: TimelineScrollState;
  /** Frame for entrance animation */
  entranceFrame: number;
  /** Height available for the rail */
  railHeight: number;
};

/**
 * Vertical timeline rail with dots for each experience item
 * Shows progress indicator and highlights active dot
 */
export const TimelineRail = memo(function TimelineRail({
  scrollState,
  entranceFrame,
  railHeight,
}: TimelineRailProps) {
  const { currentItemIndex, localProgress } = scrollState;

  // Entrance animation
  const entranceProgress = spring({
    frame: entranceFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  // Rail dimensions
  const railWidth = 2;
  const dotSize = 8; // Small dots only, image is the main indicator

  // Calculate dot positions (add extra dot at end for last item's line)
  const itemCount = EXPERIENCE_ITEM_COUNT;
  const firstDotY = 20;
  const lastDotY = railHeight - 60; // Leave room for extra dot below
  const extraDotY = railHeight - 20; // Final dot position
  const dotSpacing = (lastDotY - firstDotY) / (itemCount - 1);

  // Progress indicator position
  const baseProgressY = interpolate(
    currentItemIndex + localProgress,
    [0, itemCount - 1],
    [firstDotY, lastDotY]
  );

  // Extend to extra dot when at last item
  const atLastItem = currentItemIndex === itemCount - 1;
  const progressY = atLastItem
    ? baseProgressY + localProgress * (extraDotY - lastDotY)
    : baseProgressY;

  // Progress line height (from top to current position)
  const progressLineHeight = progressY - firstDotY;

  return (
    <div
      style={{
        position: 'relative',
        width: 40,
        height: railHeight,
        opacity: entranceProgress,
        transform: `translateX(${interpolate(entranceProgress, [0, 1], [-20, 0])}px)`,
      }}
    >
      {/* Background rail line (extends to extra dot) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: firstDotY,
          width: railWidth,
          height: extraDotY - firstDotY,
          backgroundColor: toRgbaString(colors.textMuted, 0.2),
          transform: 'translateX(-50%)',
          borderRadius: railWidth / 2,
        }}
      />

      {/* Progress line (animated) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: firstDotY,
          width: railWidth,
          height: Math.max(0, progressLineHeight),
          backgroundColor: toRgbString(colors.accent),
          transform: 'translateX(-50%)',
          borderRadius: railWidth / 2,
        }}
      />

      {/* Dots for each item (small uniform dots, image is the main indicator) */}
      {Array.from({ length: itemCount }).map((_, dotIndex) => {
        const dotY = firstDotY + dotIndex * dotSpacing;
        const isCompleted = dotIndex <= currentItemIndex;

        // Dot entrance stagger
        const dotEntranceFrame = Math.max(0, entranceFrame - 10 - dotIndex * 5);
        const dotProgress = spring({
          frame: dotEntranceFrame,
          fps: FPS,
          config: { damping: 14, stiffness: 120 },
        });

        return (
          <div
            key={`timeline-dot-position-${dotY}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: dotY,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: isCompleted
                ? toRgbString(colors.accent)
                : toRgbaString(colors.textMuted, 0.3),
              transform: `translate(-50%, -50%) scale(${dotProgress})`,
            }}
          />
        );
      })}

      {/* Extra dot at the end for last item's line */}
      {(() => {
        const dotEntranceFrame = Math.max(0, entranceFrame - 10 - itemCount * 5);
        const dotProgress = spring({
          frame: dotEntranceFrame,
          fps: FPS,
          config: { damping: 14, stiffness: 120 },
        });
        const isCompleted = currentItemIndex >= itemCount - 1 && localProgress > 0.5;

        return (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: extraDotY,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: isCompleted
                ? toRgbString(colors.accent)
                : toRgbaString(colors.textMuted, 0.3),
              transform: `translate(-50%, -50%) scale(${dotProgress})`,
            }}
          />
        );
      })()}
    </div>
  );
});
