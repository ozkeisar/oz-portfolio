import { FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { calculateExitAnimation } from '../../hooks/useExitAnimation';
import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

type ImpactMetric = {
  value: number;
  suffix: string;
  label: string;
};

const metrics: ImpactMetric[] = [
  { value: 50, suffix: '+', label: 'Team Members Led' },
  { value: 10, suffix: 'M+', label: 'Users Impacted' },
  { value: 99, suffix: '%', label: 'System Uptime' },
  { value: 25, suffix: '+', label: 'Projects Delivered' },
];

export function ImpactSection() {
  const { sequenceFrame, direction, viewport } = useAnimationContext();
  const { isVisible, isExiting } = useSectionVisibility('impact');

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Section entrance
  const entranceProgress = spring({
    frame: sequenceFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  // Title animation
  const titleOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const titleY = interpolate(entranceProgress, [0, 1], [30, 0]);

  // Exit animation (slides right - alternating from experience which went left)
  const exitAnimation = calculateExitAnimation({
    direction: 'right',
    duration: 45,
    currentFrame: sequenceFrame,
    isExiting,
    scrollDirection: direction,
  });

  // Responsive values
  const titleSize = responsiveFontSize(viewport.width, 28, 44);
  const numberSize = responsiveFontSize(viewport.width, 40, 64);
  const labelSize = responsiveFontSize(viewport.width, 12, 16);
  const padding = responsiveSpacing(viewport.width, 20, 60);

  // Calculate columns based on viewport
  const columns = viewport.width < 640 ? 2 : 4;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding,
        opacity: exitAnimation.opacity * entranceProgress,
        transform: `translateX(${exitAnimation.translateX}px) scale(${exitAnimation.scale})`,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          margin: 0,
          marginBottom: responsiveSpacing(viewport.width, 40, 60),
          fontSize: titleSize,
          fontWeight: 600,
          color: toRgbString(colors.textPrimary),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Impact
      </h2>

      {/* Metrics grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: responsiveSpacing(viewport.width, 24, 40),
          maxWidth: 900,
          width: '100%',
        }}
      >
        {metrics.map((metric, index) => {
          // Staggered entrance for each metric
          const metricFrame = Math.max(0, sequenceFrame - 15 - index * 10);
          const metricProgress = spring({
            frame: metricFrame,
            fps: FPS,
            config: { damping: 14, stiffness: 100 },
          });

          const metricOpacity = interpolate(metricProgress, [0, 1], [0, 1]);
          const metricScale = interpolate(metricProgress, [0, 1], [0.8, 1]);
          const metricY = interpolate(metricProgress, [0, 1], [20, 0]);

          // Animated number counting based on sequenceFrame
          const countProgress = interpolate(
            sequenceFrame,
            [15 + index * 10, 60 + index * 10],
            [0, 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          );
          const displayValue = Math.round(metric.value * countProgress);

          return (
            <div
              key={metric.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: responsiveSpacing(viewport.width, 20, 32),
                backgroundColor: toRgbaString(colors.cardBackground, 0.4),
                borderRadius: 20,
                border: `1px solid ${toRgbaString(colors.cardBorder, 0.3)}`,
                opacity: metricOpacity,
                transform: `translateY(${metricY}px) scale(${metricScale})`,
              }}
            >
              {/* Number */}
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
                    fontSize: numberSize * 0.5,
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
                  fontWeight: 500,
                  color: toRgbString(colors.textSecondary),
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {metric.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
