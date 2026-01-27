import { FPS } from '../../config/sections';
import type { ImpactMetric } from '../../data/impactData';
import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

type MetricBoxProps = {
  metric: ImpactMetric;
  index: number;
  sequenceFrame: number;
  viewportWidth: number;
};

// Animation timing constants
const BOX_STAGGER = 15; // Frames between each box starting to draw
const BOX_START_FRAME = 20; // Frame when first box starts drawing
const NUMBER_START_OFFSET = 40; // Frames after box starts before number counts
const NUMBER_DURATION = 60; // Frames for number to count up

/**
 * MetricBox Component
 *
 * Displays a single impact metric with:
 * 1. SVG rect with stroke-dasharray line-drawing animation
 * 2. Number counting animation (starts after box draws)
 * 3. Label text that fades in with number
 */
export function MetricBox({ metric, index, sequenceFrame, viewportWidth }: MetricBoxProps) {
  // Calculate timing for this specific box
  const boxStartFrame = BOX_START_FRAME + index * BOX_STAGGER;
  const boxFrame = Math.max(0, sequenceFrame - boxStartFrame);
  const numberStartFrame = boxStartFrame + NUMBER_START_OFFSET;
  const numberFrame = Math.max(0, sequenceFrame - numberStartFrame);

  // SVG box dimensions - dynamic scaling for even spacing
  const boxWidth = responsiveSpacing(viewportWidth, 130, 200);
  const boxHeight = responsiveSpacing(viewportWidth, 95, 140);
  const borderRadius = responsiveSpacing(viewportWidth, 12, 16);
  const strokeWidth = 2;

  // Calculate path length for the rounded rectangle
  // For a rounded rect: 2*(width + height) - 8*radius + 2*PI*radius
  // Simplified: perimeter = 2*(w-2r) + 2*(h-2r) + 2*PI*r
  const straightSides = 2 * (boxWidth - 2 * borderRadius) + 2 * (boxHeight - 2 * borderRadius);
  const corners = 2 * Math.PI * borderRadius;
  const pathLength = straightSides + corners;

  // Box drawing animation using spring
  const drawProgress = spring({
    frame: boxFrame,
    fps: FPS,
    config: { damping: 20, stiffness: 60 },
  });

  // Stroke dashoffset: pathLength (invisible) → 0 (fully drawn)
  const strokeDashoffset = interpolate(drawProgress, [0, 1], [pathLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Content opacity (fades in as box draws)
  const contentOpacity = interpolate(drawProgress, [0.3, 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Number counting animation
  const countProgress = interpolate(numberFrame, [0, NUMBER_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayValue = Math.round(metric.value * countProgress);

  // Responsive font sizes
  const numberSize = responsiveFontSize(viewportWidth, 36, 52);
  const suffixSize = numberSize * 0.5;
  const labelSize = responsiveFontSize(viewportWidth, 11, 14);
  const subLabelSize = responsiveFontSize(viewportWidth, 9, 11);
  const padding = responsiveSpacing(viewportWidth, 12, 20);

  return (
    <div
      style={{
        position: 'relative',
        width: boxWidth,
        height: boxHeight,
      }}
    >
      {/* SVG for animated border */}
      <svg
        width={boxWidth}
        height={boxHeight}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={boxWidth - strokeWidth}
          height={boxHeight - strokeWidth}
          rx={borderRadius}
          ry={borderRadius}
          style={{
            fill: toRgbaString(colors.cardBackground, 0.3),
            stroke: toRgbString(colors.accent),
            strokeWidth: strokeWidth,
            strokeDasharray: pathLength,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>

      {/* Content inside the box */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: padding,
          opacity: contentOpacity,
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
    </div>
  );
}
