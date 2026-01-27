import { FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { impactMetrics } from '../../data/impactData';
import { calculateExitAnimation } from '../../hooks/useExitAnimation';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { MetricBox } from '../impact/MetricBox';

// Entrance animation timing (must match ProfileImageTransition)
const FORWARD_ENTRANCE_DELAY = 30; // Wait for Experience exit animation before appearing

/**
 * Impact Section with SVG line-drawing animations
 *
 * Features:
 * - Profile image transitions from Experience header
 * - SVG metric boxes with stroke-dasharray line-drawing animation
 * - Staggered sequence: image → boxes draw → numbers count up
 * - Animation-based (not scroll-driven) for dramatic entrance
 */
export function ImpactSection() {
  const { sequenceFrame, direction, viewport } = useAnimationContext();
  const { isVisible, isExiting, isEnteringBackward, isEntering, isReversing } =
    useSectionVisibility('impact');

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Detect if entering forward from Experience (not backward from a later section)
  const isEnteringForward = isEntering && !isEnteringBackward;

  // Responsive breakpoints
  const isMobile = viewport.width < 768;

  // Reverse animation timing - faster than entrance for snappy backward navigation
  const REVERSE_DURATION = 30; // Frames for reverse animation

  // Section entrance animation - with delay when entering forward
  let entranceProgress: number;
  if (isReversing) {
    // Reversing: fade out from 1 → 0
    entranceProgress = interpolate(sequenceFrame, [0, REVERSE_DURATION], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (isEnteringForward) {
    // Forward entrance: delay until Experience exit animation is mostly done
    const delayedFrame = Math.max(0, sequenceFrame - FORWARD_ENTRANCE_DELAY);
    entranceProgress = spring({
      frame: delayedFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
  } else {
    // Backward entrance or active state
    entranceProgress = spring({
      frame: sequenceFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
  }

  // Calculate effective frame for MetricBox animations
  // This ensures boxes start animating at the right time
  const effectiveMetricFrame = isEnteringForward
    ? Math.max(0, sequenceFrame - FORWARD_ENTRANCE_DELAY)
    : sequenceFrame;

  // Header animation (slightly faster than content)
  const headerOpacity = interpolate(entranceProgress, [0, 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headerY = interpolate(entranceProgress, [0, 1], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit animation
  // - isReversing: fade out handled by entranceProgress above
  // - isExiting forward: slide right
  const exitAnimation = isReversing
    ? { opacity: 1, translateX: 0, scale: 1 } // Opacity controlled by entranceProgress
    : calculateExitAnimation({
        direction: 'right',
        duration: 45,
        currentFrame: sequenceFrame,
        isExiting,
        scrollDirection: direction,
      });

  // Responsive values
  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);
  const horizontalPadding = responsiveSpacing(viewport.width, 24, 80);
  const verticalPadding = responsiveSpacing(viewport.width, 20, 40);

  // Content area dimensions (must match ProfileImageTransition)
  const contentMaxWidth = responsiveValue(viewport.width, 320, 600, 320, 1200);

  // Mobile image spacer (must match ProfileImageTransition)
  const mobileImageSize = 32;
  const desktopImageSize = 40;
  const imageSize = isMobile ? mobileImageSize : desktopImageSize;

  // Calculate image spacer progress for header
  // Image is present when entering forward, active, or exiting backward
  let imageSpacerProgress = 0;
  if (isEnteringForward) {
    // Animate spacer in as entrance progresses
    imageSpacerProgress = entranceProgress;
  } else if (isEnteringBackward) {
    // Entering backward: fully visible immediately
    imageSpacerProgress = 1;
  } else if (isReversing) {
    // Reversing: animate spacer out as entranceProgress goes 1→0
    imageSpacerProgress = entranceProgress;
  } else {
    // Active state: fully visible
    imageSpacerProgress = 1;
  }
  const imageSpacerWidth = imageSpacerProgress * (imageSize + 8);

  // Section number animation (slightly delayed from entrance)
  const numberFrame = Math.max(0, effectiveMetricFrame - 5);
  const numberProgress = spring({
    frame: numberFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });

  // Always use 2 columns layout
  const columns = 2;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
        opacity: exitAnimation.opacity * entranceProgress,
        transform: `translateX(${exitAnimation.translateX}px) scale(${exitAnimation.scale})`,
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          width: '100%',
          maxWidth: contentMaxWidth,
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: responsiveSpacing(viewport.width, 32, 48),
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
          {/* Dynamic spacer for profile image */}
          {imageSpacerWidth > 0 && (
            <div
              style={{
                width: imageSpacerWidth,
                height: imageSize,
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontSize: numberSize + 10,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: toRgbString(colors.accent),
              fontWeight: 400,
            }}
          >
            03.
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
            Impact
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

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: responsiveSpacing(viewport.width, 12, 32),
          maxWidth: contentMaxWidth,
          width: '100%',
          justifyItems: 'center',
          padding: responsiveSpacing(viewport.width, 8, 16),
        }}
      >
        {impactMetrics.map((metric, index) => (
          <MetricBox
            key={metric.id}
            metric={metric}
            index={index}
            sequenceFrame={effectiveMetricFrame}
            viewportWidth={viewport.width}
          />
        ))}
      </div>
    </div>
  );
}
