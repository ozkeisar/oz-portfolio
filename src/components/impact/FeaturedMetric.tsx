import { FPS } from '../../config/sections';
import type { ImpactMetric } from '../../data/impactData';
import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

type FeaturedMetricProps = {
  metric: ImpactMetric;
  /** Frame when this metric should start animating */
  entranceFrame: number;
  /** Global sequence frame for coordinating animations */
  sequenceFrame: number;
  /** Viewport width for responsive sizing */
  viewportWidth: number;
};

// Animation timing constants (compressed for faster entrance)
const NUMBER_START_OFFSET = 10; // Frames after card starts before number counts
const NUMBER_DURATION = 30; // Frames for number to count up
const GLOW_PULSE_START = 30; // Frames after entrance when glow starts

/**
 * FeaturedMetric Component
 *
 * Large hero metric card with:
 * - Scale + fade entrance animation
 * - Prominent number counting animation
 * - Subtle glow effect for emphasis
 */
export function FeaturedMetric({
  metric,
  entranceFrame,
  sequenceFrame,
  viewportWidth,
}: FeaturedMetricProps) {
  // Calculate local frame for this card
  const cardFrame = Math.max(0, sequenceFrame - entranceFrame);

  // Card entrance animation (scale + fade)
  const cardProgress = spring({
    frame: cardFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardScale = interpolate(cardProgress, [0, 1], [0.85, 1], {
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

  // Special handling for "users" metric: animate from 0 to M
  // Shows 0 → 100K → 500K → 999K → 1M+
  const isUsersMetric = metric.id === 'users';
  let displayValue: number | string;
  let displaySuffix: string;

  if (isUsersMetric) {
    // Animate through thousands up to 1 million
    const rawValue = Math.round(1000 * countProgress); // 0 to 1000 (representing K)
    if (countProgress >= 1) {
      // Final state: show 1M+
      displayValue = 1;
      displaySuffix = 'M+';
    } else if (rawValue === 0) {
      // Start from 0 with no suffix
      displayValue = 0;
      displaySuffix = '';
    } else {
      // Counting state: show in K
      displayValue = rawValue;
      displaySuffix = 'K';
    }
  } else {
    displayValue = Math.round(metric.value * countProgress);
    displaySuffix = metric.suffix;
  }

  // Subtle glow animation (pulsing after entrance)
  const glowFrame = Math.max(0, cardFrame - GLOW_PULSE_START);
  const glowIntensity = interpolate(
    Math.sin(glowFrame * 0.1) * 0.5 + 0.5, // Oscillate between 0 and 1
    [0, 1],
    [0.1, 0.25],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Responsive sizing - featured is significantly larger
  const cardWidth = responsiveSpacing(viewportWidth, 260, 380);
  const cardHeight = responsiveSpacing(viewportWidth, 140, 180);
  const padding = responsiveSpacing(viewportWidth, 20, 32);
  const borderRadius = responsiveSpacing(viewportWidth, 16, 20);

  // Responsive typography - larger for featured
  const numberSize = responsiveFontSize(viewportWidth, 56, 80);
  const suffixSize = numberSize * 0.45;
  const labelSize = responsiveFontSize(viewportWidth, 14, 18);
  const subLabelSize = responsiveFontSize(viewportWidth, 11, 14);

  return (
    <div
      style={{
        width: cardWidth,
        height: cardHeight,
        padding: padding,
        backgroundColor: toRgbaString(colors.cardBackground, 0.5),
        borderRadius: borderRadius,
        border: `2px solid ${toRgbaString(colors.accent, 0.4)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        boxShadow:
          cardProgress > 0.5
            ? `0 0 ${40 * glowIntensity}px ${20 * glowIntensity}px ${toRgbaString(colors.accent, glowIntensity)}`
            : 'none',
      }}
    >
      {/* Number with suffix */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          marginBottom: 8,
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
            marginLeft: 4,
          }}
        >
          {displaySuffix}
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
          letterSpacing: '0.08em',
          textAlign: 'center',
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
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          {metric.subLabel}
        </span>
      )}
    </div>
  );
}
