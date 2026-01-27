import { FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { featuredMetric, supportingMetrics } from '../../data/impactData';
import { calculateExitAnimation } from '../../hooks/useExitAnimation';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { FeaturedMetric } from '../impact/FeaturedMetric';
import { MetricCard } from '../impact/MetricCard';

// Entrance animation timing (must match ProfileImageTransition)
const FORWARD_ENTRANCE_DELAY = 30; // Wait for Experience exit animation before appearing
const REVERSE_DURATION = 30; // Frames for reverse animation

// Animation sequence timing
const FEATURED_START = 20; // Featured metric starts after header begins
const SUPPORTING_ROW1_START = 50; // First row of supporting metrics
const SUPPORTING_ROW2_START = 70; // Second row of supporting metrics
const SUPPORTING_STAGGER = 10; // Stagger between metrics in same row

/**
 * Impact Section - "Achievement Constellation" Design
 *
 * Features:
 * - Featured hero metric (1M+ Users) with prominent display
 * - Asymmetric layout with supporting metrics in rows
 * - Staggered cascade entrance animations
 * - Number counting animations
 * - Coordinates with ProfileImageTransition
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

  // Calculate effective frame for child component animations
  // This ensures components start animating at the right time
  const effectiveFrame = isEnteringForward
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
  let imageSpacerProgress = 0;
  if (isEnteringForward) {
    imageSpacerProgress = entranceProgress;
  } else if (isEnteringBackward) {
    imageSpacerProgress = 1;
  } else if (isReversing) {
    imageSpacerProgress = entranceProgress;
  } else {
    imageSpacerProgress = 1;
  }
  const imageSpacerWidth = imageSpacerProgress * (imageSize + 8);

  // Section number animation (slightly delayed from entrance)
  const numberFrame = Math.max(0, effectiveFrame - 5);
  const numberProgress = spring({
    frame: numberFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });

  // Split supporting metrics into rows for asymmetric layout
  // Row 1: 3 metrics, Row 2: 2 metrics (desktop)
  // Mobile: 2-column grid
  const row1Metrics = supportingMetrics.slice(0, 3);
  const row2Metrics = supportingMetrics.slice(3);

  // Spacing
  const sectionGap = responsiveSpacing(viewport.width, 16, 24);
  const cardGap = responsiveSpacing(viewport.width, 10, 16);

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
          marginBottom: sectionGap,
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

      {/* Metrics Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: sectionGap,
          maxWidth: contentMaxWidth,
          width: '100%',
        }}
      >
        {/* Featured Metric (Hero) */}
        <FeaturedMetric
          metric={featuredMetric}
          entranceFrame={FEATURED_START}
          sequenceFrame={effectiveFrame}
          viewportWidth={viewport.width}
        />

        {/* Supporting Metrics - Row 1 (3 items) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: cardGap,
          }}
        >
          {row1Metrics.map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              entranceFrame={SUPPORTING_ROW1_START + index * SUPPORTING_STAGGER}
              sequenceFrame={effectiveFrame}
              viewportWidth={viewport.width}
            />
          ))}
        </div>

        {/* Supporting Metrics - Row 2 (2 items) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: cardGap,
          }}
        >
          {row2Metrics.map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              entranceFrame={SUPPORTING_ROW2_START + index * SUPPORTING_STAGGER}
              sequenceFrame={effectiveFrame}
              viewportWidth={viewport.width}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
