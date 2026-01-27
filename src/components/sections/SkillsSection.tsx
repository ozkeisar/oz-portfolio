import { useEffect, useRef, useState } from 'react';
import { FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { CATEGORY_COUNT, skillCategories } from '../../data/skillsData';
import { calculateExitAnimation } from '../../hooks/useExitAnimation';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

// Animation timing constants (frames at 30 FPS)
// The profile image moves from Impact header to Skills center during frames 30-75
const IMAGE_ARRIVAL_FRAME = 75; // When image arrives at center (30 delay + ~45 spring)
const PHASE_1_END = 30; // Header reveal complete
const PHASE_2_START = IMAGE_ARRIVAL_FRAME; // Categories start expanding after image arrives
const PHASE_2_END = 150; // Categories expanded
const PHASE_3_START = PHASE_2_END; // Skills start populating
const TOTAL_ANIMATION_DURATION = 300; // Full animation
const FAST_ENTER_DURATION = 180; // Compressed entrance
const EXIT_DURATION = 15; // Exit animation duration (500ms at 30fps) - fast reverse of entrance
const FORWARD_ENTRANCE_DELAY = 30; // Wait for Impact exit to start
const BACKWARD_ENTRANCE_DELAY = 15; // Wait for Contact exit (500ms at 30fps)

// Spring configs
const CATEGORY_SPRING = { damping: 14, stiffness: 80 };
const SKILL_SPRING = { damping: 14, stiffness: 120 };

/**
 * Calculate polar position for category nodes
 * Supports oval/elliptical distribution with separate X and Y radii
 */
function getCategoryPosition(
  index: number,
  total: number,
  radiusX: number,
  radiusY?: number
): { x: number; y: number } {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
  const rY = radiusY ?? radiusX; // Use radiusX for both if radiusY not provided
  return {
    x: Math.cos(angle) * radiusX,
    y: Math.sin(angle) * rY,
  };
}

/**
 * Calculate skill position around a category with orbital rotation
 */
function getSkillPosition(
  skillIndex: number,
  totalSkills: number,
  innerRadius: number,
  rotationOffset: number = 0
): { x: number; y: number } {
  // Evenly distribute skills in a full circle around the category
  const angleStep = (2 * Math.PI) / totalSkills;
  const baseAngle = skillIndex * angleStep - Math.PI / 2; // Start from top
  const angle = baseAngle + rotationOffset;

  return {
    x: Math.cos(angle) * innerRadius,
    y: Math.sin(angle) * innerRadius,
  };
}

/**
 * Skills Section with Neural Network Animation
 *
 * Animation Phases:
 * 1. Core Reveal (0-30): Header + center pulse
 * 2. Category Expansion (30-90): Categories spring outward
 * 3. Skill Population (90-180): Skills populate around categories
 * 4. Network Complete (180-240): Final state with connections
 */
export function SkillsSection() {
  const { sequenceFrame, direction, viewport } = useAnimationContext();
  const { isVisible, isExiting, isReversing, isEntering, isActive, isEnteringBackward } =
    useSectionVisibility('skills');

  // Continuous frame counter for orbital/breathing animations
  // This keeps incrementing as long as the section is visible
  const [continuousFrame, setContinuousFrame] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Continuous animation loop - runs whenever section is visible
  useEffect(() => {
    if (!isVisible) {
      // Reset when section becomes invisible
      setContinuousFrame(0);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;
      const frameDelta = elapsed / (1000 / FPS);

      setContinuousFrame((prev) => prev + frameDelta);
      lastTimeRef.current = timestamp;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Responsive breakpoints
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;

  // Detect entering/exiting directions
  const isEnteringForward = isEntering && !isEnteringBackward;
  const isExitingForward = isExiting && direction === 'forward';

  // Calculate effective frame for animation
  // Maps sequenceFrame to animation progress with delays for transitions
  let effectiveFrame: number;

  if (isReversing || isExitingForward) {
    // Reverse/Exit: TOTAL → 0 (network contracts)
    effectiveFrame = Math.max(0, TOTAL_ANIMATION_DURATION * (1 - sequenceFrame / EXIT_DURATION));
  } else if (isEnteringForward) {
    // Forward entrance: wait for Impact exit, then animate
    const delayedFrame = Math.max(0, sequenceFrame - FORWARD_ENTRANCE_DELAY);
    effectiveFrame = Math.min(
      TOTAL_ANIMATION_DURATION,
      TOTAL_ANIMATION_DURATION * (delayedFrame / FAST_ENTER_DURATION)
    );
  } else if (isEnteringBackward) {
    // Backward entrance from Contact: shorter delay
    const delayedFrame = Math.max(0, sequenceFrame - BACKWARD_ENTRANCE_DELAY);
    effectiveFrame = Math.min(
      TOTAL_ANIMATION_DURATION,
      TOTAL_ANIMATION_DURATION * (delayedFrame / FAST_ENTER_DURATION)
    );
  } else if (isEntering) {
    // Generic entering
    effectiveFrame = Math.min(
      TOTAL_ANIMATION_DURATION,
      TOTAL_ANIMATION_DURATION * (sequenceFrame / FAST_ENTER_DURATION)
    );
  } else {
    // Active/idle state - show full animation
    effectiveFrame = TOTAL_ANIMATION_DURATION;
  }

  // Phase 1 progress (used for header)
  const phase1Progress = interpolate(effectiveFrame, [0, PHASE_1_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Section entrance animation
  const entranceProgress = spring({
    frame: effectiveFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  // Exit animation
  const exitAnimation =
    isReversing || isExitingForward
      ? { opacity: 1, translateX: 0, scale: 1 }
      : calculateExitAnimation({
          direction: 'left',
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

  // Network layout dimensions - responsive for all screen sizes
  const networkSize = Math.min(
    viewport.width - horizontalPadding * 2,
    viewport.height - verticalPadding * 2 - 100, // Account for header
    isMobile ? 320 : isTablet ? 480 : 600
  );

  // Responsive radius - oval shape on mobile (egg-like), circular on desktop
  const categoryRadiusX = networkSize * (isMobile ? 0.38 : isTablet ? 0.36 : 0.38);
  const categoryRadiusY = networkSize * (isMobile ? 0.48 : isTablet ? 0.36 : 0.38);
  const skillRadius = networkSize * (isMobile ? 0.18 : 0.15); // Larger orbit on mobile for more spacing

  // Use orbital layout on all screen sizes
  const useMobileLayout = false;

  // Content width
  const contentMaxWidth = responsiveValue(viewport.width, 350, 800, 320, 1200);

  // Header animation
  const headerOpacity = interpolate(phase1Progress, [0, 1], [0, 1]);
  const headerY = interpolate(phase1Progress, [0, 1], [20, 0]);

  // Section number animation
  const numberFrame = Math.max(0, effectiveFrame - 5);
  const numberProgress = spring({
    frame: numberFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });

  // Mobile image spacer (matches other sections)
  const mobileImageSize = 32;
  let mobileImageProgress = 0;
  if (isMobile) {
    if (isEnteringForward) {
      mobileImageProgress = entranceProgress;
    } else if (isActive || isEnteringBackward) {
      mobileImageProgress = 1;
    } else if (isReversing) {
      mobileImageProgress = entranceProgress;
    }
  }
  const mobileImageSpacerWidth = mobileImageProgress * (mobileImageSize + 8);

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
        opacity: exitAnimation.opacity * Math.min(1, entranceProgress),
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
          marginBottom: responsiveSpacing(viewport.width, 16, 24),
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
          {/* Dynamic spacer for profile image on mobile */}
          {isMobile && mobileImageSpacerWidth > 0 && (
            <div
              style={{
                width: mobileImageSpacerWidth,
                height: mobileImageSize,
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
            04.
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
            Skills
          </h2>
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: toRgbaString(colors.textSecondary, 0.3),
              marginLeft: 16,
              maxWidth: isTablet ? 120 : 200,
            }}
          />
        </div>
      </div>

      {/* Network Visualization */}
      {useMobileLayout ? (
        // Mobile: Vertical card stack
        <MobileSkillsLayout effectiveFrame={effectiveFrame} viewport={viewport} />
      ) : (
        // Desktop/Tablet: Radial network centered in viewport
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: networkSize,
            height: networkSize,
          }}
        >
          {/* Profile image acts as center node - rendered by ProfileImageTransition */}

          {/* Category nodes with skills - evenly spaced around center */}
          {skillCategories.map((category, categoryIndex) => {
            const categoryPos = getCategoryPosition(
              categoryIndex,
              CATEGORY_COUNT,
              categoryRadiusX,
              categoryRadiusY
            );

            // Staggered category animation - starts after image arrives at center
            const categoryDelay = categoryIndex * 10;
            const categoryFrame = Math.max(0, effectiveFrame - PHASE_2_START - categoryDelay);
            const categoryProgress = spring({
              frame: categoryFrame,
              fps: FPS,
              config: CATEGORY_SPRING,
            });

            // Calculate animated position (from center to final)
            const animatedX = interpolate(categoryProgress, [0, 1], [0, categoryPos.x]);
            const animatedY = interpolate(categoryProgress, [0, 1], [0, categoryPos.y]);

            // Orbital rotation - uses continuousFrame for smooth continuous rotation
            // Each category rotates at slightly different speed for visual interest
            // Rotation starts as soon as category appears (based on categoryProgress)
            // Very slow rotation: ~0.002 = one full rotation every ~100 seconds at 30fps
            const rotationSpeed = 0.002 + categoryIndex * 0.0004;
            const rotationOffset = continuousFrame * rotationSpeed * categoryProgress;

            // Breathing frame - uses continuousFrame, offset per category for varied timing
            const breatheOffset = categoryIndex * 30;
            const breatheFrame = continuousFrame + breatheOffset;

            return (
              <div
                key={category.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${animatedX}px), calc(-50% + ${animatedY}px))`,
                }}
              >
                {/* Category label */}
                <CategoryNode
                  name={category.name}
                  progress={categoryProgress}
                  size={networkSize * (isMobile ? 0.14 : 0.16)}
                  breatheFrame={breatheFrame}
                  categoryIndex={categoryIndex}
                  isMobile={isMobile}
                />

                {/* Skills orbiting around category */}
                {category.skills.map((skill, skillIndex) => {
                  // Staggered skill appearance animation
                  const skillDelay = categoryIndex * 12 + skillIndex * 6;
                  const skillFrame = Math.max(0, effectiveFrame - PHASE_3_START - skillDelay);
                  const skillProgress = spring({
                    frame: skillFrame,
                    fps: FPS,
                    config: SKILL_SPRING,
                  });

                  // Calculate orbital position with continuous rotation
                  // Skills orbit as soon as they appear (scaled by skillProgress)
                  const skillPos = getSkillPosition(
                    skillIndex,
                    category.skills.length,
                    skillRadius,
                    rotationOffset
                  );

                  const skillOpacity = interpolate(skillProgress, [0, 1], [0, 1]);
                  const skillScale = interpolate(skillProgress, [0, 1], [0.5, 1]);

                  return (
                    <div
                      key={skill.name}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${skillPos.x}px), calc(-50% + ${skillPos.y}px)) scale(${skillScale})`,
                        opacity: skillOpacity,
                      }}
                    >
                      <SkillNode
                        name={skill.abbr || skill.name}
                        breatheFrame={breatheFrame}
                        skillIndex={categoryIndex * 10 + skillIndex}
                        isMobile={isMobile}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Generate a wavy orbit path that undulates in and out
 */
function generateWavyOrbitPath(
  centerX: number,
  centerY: number,
  baseRadius: number,
  waveAmplitude: number,
  waveFrequency: number,
  phaseOffset: number,
  points: number = 60
): string {
  const pathPoints: string[] = [];

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // Radius varies with sine wave - creates the in/out undulation
    const radiusVariation = Math.sin(angle * waveFrequency + phaseOffset) * waveAmplitude;
    const r = baseRadius + radiusVariation;

    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;

    if (i === 0) {
      pathPoints.push(`M ${x} ${y}`);
    } else {
      // Use smooth curve for organic look
      const prevAngle = ((i - 1) / points) * Math.PI * 2;

      // Control points for bezier curve
      const cp1Angle = prevAngle + (angle - prevAngle) * 0.5;
      const cp1RadiusVar = Math.sin(cp1Angle * waveFrequency + phaseOffset) * waveAmplitude;
      const cp1R = baseRadius + cp1RadiusVar;
      const cp1X = centerX + Math.cos(cp1Angle) * cp1R;
      const cp1Y = centerY + Math.sin(cp1Angle) * cp1R;

      pathPoints.push(`Q ${cp1X} ${cp1Y} ${x} ${y}`);
    }
  }

  return pathPoints.join(' ');
}

/**
 * Dynamic orbit ring with wavy, undulating curves
 */
function OrbitRing({
  radius,
  progress,
  breatheFrame,
  categoryIndex,
  isMobile,
}: {
  radius: number;
  progress: number;
  breatheFrame: number;
  categoryIndex: number;
  isMobile: boolean;
}) {
  const baseOpacity = interpolate(progress, [0, 1], [0, 0.7]);
  const center = radius;

  // Create multiple wavy orbit layers - fewer on mobile for cleaner look
  const layers = [];
  const numLayers = isMobile ? 1 : 3;

  // Unique seed values per category for varied but consistent patterns
  const seed1 = (categoryIndex * 1.7 + 0.3) % 1;
  const seed2 = (categoryIndex * 2.3 + 0.5) % 1;
  const seed3 = (categoryIndex * 1.1 + 0.7) % 1;

  for (let i = 0; i < numLayers; i++) {
    // Each layer has unique wave characteristics based on category seed
    const waveFrequency = 3 + i + Math.floor(seed1 * 3); // 3-5 waves around the circle
    const waveAmplitude = 4 + i * 2 + Math.floor(seed2 * 3); // How far in/out it goes

    // Animate the phase - varied speeds based on seeds
    const speedMultiplier = 0.003 + i * 0.0015 + seed3 * 0.002;
    const animatedPhase =
      breatheFrame * speedMultiplier + categoryIndex * 2.1 + i * 1.8 + seed1 * Math.PI;

    // Generate the wavy path
    const path = generateWavyOrbitPath(
      center,
      center,
      radius - 6 - i * 5, // Each layer at slightly different radius
      waveAmplitude,
      waveFrequency,
      animatedPhase
    );

    // Varying opacity - medium speed breathing with unique phase
    const layerOpacity =
      baseOpacity * (0.45 + Math.sin(breatheFrame * 0.012 + i * 1.2 + seed2 * Math.PI) * 0.2 + 0.2);

    // Varying stroke width - slow pulsing with unique phase
    const strokeWidth = 2.5 + Math.sin(breatheFrame * 0.005 + i * 0.8 + seed1 * Math.PI) * 1.2;

    // Dash pattern - movement along path with unique characteristics
    const dashLength = 35 + Math.sin(breatheFrame * 0.006 + i + seed3 * Math.PI) * 15;
    const gapLength = 20 + Math.cos(breatheFrame * 0.005 + i * 1.5 + seed2 * Math.PI) * 12;
    const dashOffset = breatheFrame * (0.06 + i * 0.02 + seed1 * 0.03);

    layers.push(
      <path
        key={`layer-${i}`}
        d={path}
        fill="none"
        stroke={toRgbString(colors.accent)}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength} ${gapLength}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={layerOpacity}
      />
    );

    // Add a glow version of each layer
    layers.push(
      <path
        key={`glow-${i}`}
        d={path}
        fill="none"
        stroke={toRgbString(colors.accent)}
        strokeWidth={strokeWidth + 4}
        strokeDasharray={`${dashLength} ${gapLength}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={layerOpacity * 0.2}
        style={{ filter: 'blur(4px)' }}
      />
    );
  }

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      {layers}
    </svg>
  );
}

/**
 * Category node with label and dynamic orbit ring
 */
function CategoryNode({
  name,
  progress,
  size,
  breatheFrame,
  categoryIndex,
  isMobile,
}: {
  name: string;
  progress: number;
  size: number;
  breatheFrame: number;
  categoryIndex: number;
  isMobile: boolean;
}) {
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  // Breathing effect for center dot - medium speed
  const breatheCycle = Math.sin(breatheFrame * 0.015) * progress;
  const dotScale = 1 + breatheCycle * 0.1;

  const orbitRadius = size * 0.35;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size * 0.7,
          height: size * 0.7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Dynamic orbit ring */}
        <OrbitRing
          radius={orbitRadius}
          progress={progress}
          breatheFrame={breatheFrame}
          categoryIndex={categoryIndex}
          isMobile={isMobile}
        />

        {/* Center dot */}
        <div
          style={{
            width: size * 0.18,
            height: size * 0.18,
            borderRadius: '50%',
            backgroundColor: toRgbString(colors.accent),
            transform: `scale(${dotScale})`,
            boxShadow: `0 0 ${10 + breatheCycle * 6}px ${toRgbaString(colors.accent, 0.4)}`,
          }}
        />
      </div>
      {/* Hide category name on mobile */}
      {!isMobile && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: toRgbString(colors.textPrimary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
      )}
    </div>
  );
}

/**
 * Individual skill node
 */
function SkillNode({
  name,
  breatheFrame,
  skillIndex,
  isMobile,
}: {
  name: string;
  breatheFrame: number;
  skillIndex: number;
  isMobile: boolean;
}) {
  // Unique phase offset for each skill
  const phaseOffset = skillIndex * 1.3;

  // Subtle breathing glow
  const glowIntensity = 0.15 + Math.sin(breatheFrame * 0.02 + phaseOffset) * 0.1;
  const borderOpacity = 0.4 + Math.sin(breatheFrame * 0.015 + phaseOffset) * 0.2;

  // Responsive sizes
  const padding = isMobile ? '4px 10px' : '6px 14px';
  const fontSize = isMobile ? 9 : 11;
  const dotSize = isMobile ? 3 : 4;
  const dotLeft = isMobile ? 5 : 6;
  const textMarginLeft = isMobile ? 6 : 8;

  return (
    <div
      style={{
        position: 'relative',
        padding,
        borderRadius: 20,
        background: `linear-gradient(135deg, ${toRgbaString(colors.background, 0.95)}, ${toRgbaString(colors.cardBackground, 0.9)})`,
        border: `1px solid ${toRgbaString(colors.accent, borderOpacity)}`,
        whiteSpace: 'nowrap',
        boxShadow: `
          0 0 ${12 * glowIntensity}px ${toRgbaString(colors.accent, glowIntensity * 0.5)},
          inset 0 1px 0 ${toRgbaString(colors.textPrimary, 0.05)}
        `,
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Small accent dot */}
      <div
        style={{
          position: 'absolute',
          left: dotLeft,
          top: '50%',
          transform: 'translateY(-50%)',
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: toRgbString(colors.accent),
          opacity: 0.6 + Math.sin(breatheFrame * 0.025 + phaseOffset) * 0.3,
          boxShadow: `0 0 4px ${toRgbaString(colors.accent, 0.6)}`,
        }}
      />
      <span
        style={{
          fontSize,
          fontWeight: 500,
          color: toRgbString(colors.textSecondary),
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          letterSpacing: '0.02em',
          marginLeft: textMarginLeft,
        }}
      >
        {name}
      </span>
    </div>
  );
}

/**
 * Mobile layout: Vertical card stack
 */
function MobileSkillsLayout({
  effectiveFrame,
  viewport,
}: {
  effectiveFrame: number;
  viewport: { width: number; height: number };
}) {
  const cardGap = 12;
  const bodySize = responsiveFontSize(viewport.width, 12, 14);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: cardGap,
        width: '100%',
        maxWidth: 400,
        flex: 1,
        overflowY: 'auto',
        paddingBottom: 20,
      }}
    >
      {skillCategories.map((category, categoryIndex) => {
        // Staggered category animation - starts after image arrives
        const categoryDelay = categoryIndex * 10;
        const categoryFrame = Math.max(0, effectiveFrame - PHASE_2_START - categoryDelay);
        const categoryProgress = spring({
          frame: categoryFrame,
          fps: FPS,
          config: CATEGORY_SPRING,
        });

        const cardOpacity = interpolate(categoryProgress, [0, 1], [0, 1]);
        const cardY = interpolate(categoryProgress, [0, 1], [20, 0]);

        return (
          <div
            key={category.id}
            style={{
              backgroundColor: toRgbaString(colors.cardBackground, 0.5),
              borderRadius: 12,
              padding: 16,
              border: `1px solid ${toRgbaString(colors.cardBorder, 0.4)}`,
              opacity: cardOpacity,
              transform: `translateY(${cardY}px)`,
            }}
          >
            {/* Category title */}
            <h3
              style={{
                margin: 0,
                marginBottom: 12,
                fontSize: bodySize + 2,
                fontWeight: 600,
                color: toRgbString(colors.accent),
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {category.name}
            </h3>

            {/* Skills as tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {category.skills.map((skill, skillIndex) => {
                // Staggered skill animation - after categories
                const skillDelay = categoryIndex * 8 + skillIndex * 4;
                const skillFrame = Math.max(0, effectiveFrame - PHASE_3_START - skillDelay);
                const skillProgress = spring({
                  frame: skillFrame,
                  fps: FPS,
                  config: SKILL_SPRING,
                });

                const skillOpacity = interpolate(skillProgress, [0, 1], [0, 1]);
                const skillScale = interpolate(skillProgress, [0, 1], [0.8, 1]);

                return (
                  <span
                    key={skill.name}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      backgroundColor: toRgbaString(colors.background, 0.8),
                      color: toRgbString(colors.textSecondary),
                      fontSize: bodySize - 1,
                      fontWeight: 500,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      border: `1px solid ${toRgbaString(colors.cardBorder, 0.3)}`,
                      opacity: skillOpacity,
                      transform: `scale(${skillScale})`,
                    }}
                  >
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
