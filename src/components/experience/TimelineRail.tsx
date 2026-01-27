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
  const dotSize = 12;
  const activeDotSize = 16;

  // Calculate dot positions
  const itemCount = EXPERIENCE_ITEM_COUNT;
  const firstDotY = 20;
  const lastDotY = railHeight - 20;
  const dotSpacing = (lastDotY - firstDotY) / (itemCount - 1);

  // Progress indicator position
  const progressY = interpolate(
    currentItemIndex + localProgress,
    [0, itemCount - 1],
    [firstDotY, lastDotY]
  );

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
      {/* Background rail line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: firstDotY,
          width: railWidth,
          height: lastDotY - firstDotY,
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

      {/* Dots for each item */}
      {Array.from({ length: itemCount }).map((_, dotIndex) => {
        const dotY = firstDotY + dotIndex * dotSpacing;
        const isActive = dotIndex === currentItemIndex;
        const isCompleted = dotIndex < currentItemIndex;

        // Dot entrance stagger
        const dotEntranceFrame = Math.max(0, entranceFrame - 10 - dotIndex * 5);
        const dotProgress = spring({
          frame: dotEntranceFrame,
          fps: FPS,
          config: { damping: 14, stiffness: 120 },
        });

        // Active dot scale
        const dotScale = isActive ? 1.3 : 1;
        const currentDotSize = isActive ? activeDotSize : dotSize;

        return (
          <div
            key={`timeline-dot-position-${dotY}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: dotY,
              width: currentDotSize,
              height: currentDotSize,
              borderRadius: '50%',
              backgroundColor:
                isCompleted || isActive
                  ? toRgbString(colors.accent)
                  : toRgbaString(colors.textMuted, 0.3),
              border: `2px solid ${toRgbString(colors.background)}`,
              boxShadow: isActive
                ? `0 0 0 2px ${toRgbString(colors.accent)}, 0 2px 8px ${toRgbaString(colors.accent, 0.3)}`
                : 'none',
              transform: `translate(-50%, -50%) scale(${dotScale * dotProgress})`,
              transition: 'box-shadow 0.2s ease',
              zIndex: isActive ? 2 : 1,
            }}
          />
        );
      })}

      {/* Moving indicator (glow effect around current position) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: progressY,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: toRgbaString(colors.accent, 0.15),
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});
