import { FPS } from '../../config/sections';
import type { ImpactMetric } from '../../data/impactData';
import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

type MetricCardProps = {
  metric: ImpactMetric;
  /** Frame offset for this card's entrance animation */
  entranceFrame: number;
  /** Global sequence frame for coordinating animations */
  sequenceFrame: number;
  /** Viewport width for responsive sizing */
  viewportWidth: number;
};

// Animation timing constants
const NUMBER_START_OFFSET = 20; // Frames after card starts before number counts
const NUMBER_DURATION = 40; // Frames for number to count up

/**
 * MetricCard Component
 *
 * Supporting metric card with:
 * - Fade + slide entrance animation
 * - Number counting animation (delayed until card settles)
 * - Compact responsive sizing
 */
export function MetricCard({
  metric,
  entranceFrame,
  sequenceFrame,
  viewportWidth,
}: MetricCardProps) {
  // Calculate local frame for this card
  const cardFrame = Math.max(0, sequenceFrame - entranceFrame);

  // Card entrance animation (fade + slide up)
  const cardProgress = spring({
    frame: cardFrame,
    fps: FPS,
    config: { damping: 20, stiffness: 100 },
  });

  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardTranslateY = interpolate(cardProgress, [0, 1], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Number counting animation (starts after card entrance settles)
  const numberStartFrame = entranceFrame + NUMBER_START_OFFSET;
  const numberFrame = Math.max(0, sequenceFrame - numberStartFrame);
  const countProgress = interpolate(numberFrame, [0, NUMBER_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayValue = Math.round(metric.value * countProgress);

  // Responsive sizing
  const cardWidth = responsiveSpacing(viewportWidth, 130, 160);
  const cardHeight = responsiveSpacing(viewportWidth, 95, 110);
  const padding = responsiveSpacing(viewportWidth, 12, 16);
  const borderRadius = responsiveSpacing(viewportWidth, 10, 12);

  // Responsive typography
  const numberSize = responsiveFontSize(viewportWidth, 28, 36);
  const suffixSize = numberSize * 0.5;
  const labelSize = responsiveFontSize(viewportWidth, 10, 12);
  const subLabelSize = responsiveFontSize(viewportWidth, 8, 10);

  return (
    <div
      style={{
        width: cardWidth,
        height: cardHeight,
        padding: padding,
        backgroundColor: toRgbaString(colors.cardBackground, 0.4),
        borderRadius: borderRadius,
        border: `1px solid ${toRgbaString(colors.cardBorder, 0.3)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: cardOpacity,
        transform: `translateY(${cardTranslateY}px)`,
      }}
    >
      {/* Number with suffix */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: numberSize,
            fontWeight: 700,
            color: toRgbString(colors.accent),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: 1,
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            fontSize: suffixSize,
            fontWeight: 600,
            color: toRgbString(colors.accent),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            marginLeft: 2,
          }}
        >
          {metric.suffix}
        </span>
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: labelSize,
          fontWeight: 600,
          color: toRgbString(colors.textPrimary),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {metric.label}
      </span>

      {/* Sub-label (optional) */}
      {metric.subLabel && (
        <span
          style={{
            fontSize: subLabelSize,
            fontWeight: 400,
            color: toRgbString(colors.textMuted),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            marginTop: 2,
            textAlign: 'center',
          }}
        >
          {metric.subLabel}
        </span>
      )}
    </div>
  );
}
