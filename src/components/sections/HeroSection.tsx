import { useCallback, useEffect, useRef } from 'react';
import { INTRO_DURATION_FRAMES, FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { useHeroOPosition } from '../../context/HeroOPositionContext';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbString } from '../../utils/colors';
import { OzKeisarText } from '../text/OzKeisarText';

// "O" letter center position in viewBox coordinates (0 0 320 70)
// The O path goes from (8,6) to (62,64), so center is (35, 35)
const O_VIEWBOX_CENTER_X = 35;
const O_VIEWBOX_CENTER_Y = 35;
const O_VIEWBOX_WIDTH = 54; // 62 - 8
const O_VIEWBOX_HEIGHT = 58; // 64 - 6
const VIEWBOX_WIDTH = 320;
const VIEWBOX_HEIGHT = 70;

// Timing constants for backward transition (from Summary)
// Hero starts AFTER Summary exit completes (500ms = 15 frames)
const HERO_BACKWARD_ENTRANCE_DELAY = 15; // Wait for Summary exit to complete

// Timing constants for wrap transition (from Contact)
// Hero starts AFTER Contact exit completes (500ms = 15 frames)
const HERO_WRAP_ENTRANCE_DELAY = 15; // Wait for Contact exit to complete

// Exit animation duration (500ms = 15 frames at 30fps)
const EXIT_DURATION = 15;

// Intro animation key frames (used for both intro and wrap entrance)
const TITLE_DRAW_END = 90; // Title draws from 0-90
const SUBTITLE_START = 75; // Subtitle starts appearing
const ACCENT_LINE_START = 85; // Accent line starts appearing
const SCROLL_INDICATOR_START = 100; // Scroll indicator starts appearing

export function HeroSection() {
  const { introFrame, isIntroComplete, sequenceFrame, viewport, direction } = useAnimationContext();
  const { setOPosition } = useHeroOPosition();
  const svgRef = useRef<SVGSVGElement>(null);

  const { isVisible, isCurrent, isExiting, isEnteringBackward, isEnteringFromWrap } =
    useSectionVisibility('hero');

  // Forward wrap entrance: coming from Contact section (infinite loop)
  const isEnteringFromContactWrap = isEnteringFromWrap && direction === 'forward';

  // Measure and report the "O" position whenever the SVG is rendered
  const measureOPosition = useCallback(() => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();

    // Convert viewBox coordinates to screen coordinates
    const scaleX = svgRect.width / VIEWBOX_WIDTH;
    const scaleY = svgRect.height / VIEWBOX_HEIGHT;

    // Calculate "O" center in screen coordinates
    const oCenterX = svgRect.left + O_VIEWBOX_CENTER_X * scaleX;
    const oCenterY = svgRect.top + O_VIEWBOX_CENTER_Y * scaleY;
    const oWidth = O_VIEWBOX_WIDTH * scaleX;
    const oHeight = O_VIEWBOX_HEIGHT * scaleY;

    setOPosition({
      x: oCenterX,
      y: oCenterY,
      width: oWidth,
      height: oHeight,
    });
  }, [setOPosition]);

  // Measure position after render and on resize
  useEffect(() => {
    if (!isVisible && isIntroComplete) return;

    // Initial measurement
    measureOPosition();

    // Re-measure on resize
    const handleResize = () => {
      measureOPosition();
    };

    window.addEventListener('resize', handleResize);

    // Also use ResizeObserver for more accurate tracking
    let resizeObserver: ResizeObserver | null = null;
    if (svgRef.current) {
      resizeObserver = new ResizeObserver(measureOPosition);
      resizeObserver.observe(svgRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isVisible, isIntroComplete, measureOPosition, viewport.width, viewport.height]);

  // Don't render if not visible
  if (!isVisible && isIntroComplete) {
    return null;
  }

  // ===========================================
  // Determine the effective animation frame
  // ===========================================
  // - During intro: use introFrame (0 → INTRO_DURATION_FRAMES)
  // - During wrap entrance from Contact: use sequenceFrame as intro-like frame
  // - During backward entrance from Summary: use sequenceFrame with delay (full intro animation)
  // - During exit: use reversed frame (INTRO_DURATION_FRAMES → 0 compressed to EXIT_DURATION)
  // - Otherwise: use full intro values (everything visible)

  let effectiveFrame = introFrame;
  let isAnimatingExit = false;

  if (isEnteringFromContactWrap) {
    // Wrap entrance from Contact: play full intro animation AFTER Contact exit completes
    // sequenceFrame starts at 0 when Hero starts entering
    // We delay the animation start by HERO_WRAP_ENTRANCE_DELAY frames
    effectiveFrame = Math.max(0, sequenceFrame - HERO_WRAP_ENTRANCE_DELAY);
  } else if (isEnteringBackward) {
    // Backward entrance from Summary: play full intro animation after Summary exit completes
    // sequenceFrame starts at 0 when Hero starts entering
    // We delay the animation start by HERO_BACKWARD_ENTRANCE_DELAY frames
    effectiveFrame = Math.max(0, sequenceFrame - HERO_BACKWARD_ENTRANCE_DELAY);
  } else if (isExiting) {
    // Exit animation: reverse the intro in EXIT_DURATION frames
    // Map sequenceFrame (0 → EXIT_DURATION) to effectiveFrame (INTRO_DURATION_FRAMES → 0)
    effectiveFrame = interpolate(sequenceFrame, [0, EXIT_DURATION], [INTRO_DURATION_FRAMES, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    isAnimatingExit = true;
  } else if (isIntroComplete) {
    // Normal state after intro: everything visible
    effectiveFrame = INTRO_DURATION_FRAMES;
  }

  // ===========================================
  // Calculate animation values based on effectiveFrame
  // ===========================================

  // Title drawing progress (0-1)
  const titleDrawProgress = interpolate(effectiveFrame, [0, TITLE_DRAW_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle spring animation (appears as title nears completion)
  // During exit, use interpolation instead of spring for smooth reverse
  let subtitleOpacity: number;
  let subtitleY: number;

  if (isAnimatingExit) {
    // Exit: linear interpolation for smooth reverse
    const subtitleProgress = interpolate(effectiveFrame, [SUBTITLE_START, SUBTITLE_START + 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    subtitleOpacity = subtitleProgress;
    subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);
  } else {
    // Entrance: use spring for natural feel
    const subtitleProgress = spring({
      frame: effectiveFrame - SUBTITLE_START,
      fps: FPS,
      config: { damping: 14, stiffness: 100 },
    });
    subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
    subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);
  }

  // Accent line animation
  let accentLineWidth: number;
  let accentLineOpacity: number;

  if (isAnimatingExit) {
    // Exit: linear interpolation
    const accentProgress = interpolate(effectiveFrame, [ACCENT_LINE_START, ACCENT_LINE_START + 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    accentLineWidth = interpolate(accentProgress, [0, 1], [0, 80]);
    accentLineOpacity = accentProgress;
  } else {
    // Entrance: use spring
    const accentLineProgress = spring({
      frame: effectiveFrame - ACCENT_LINE_START,
      fps: FPS,
      config: { damping: 14, stiffness: 120 },
    });
    accentLineWidth = interpolate(accentLineProgress, [0, 1], [0, 80]);
    accentLineOpacity = interpolate(accentLineProgress, [0, 1], [0, 1]);
  }

  // Scroll indicator animation
  let scrollIndicatorOpacity: number;
  let scrollIndicatorY: number;
  let scrollIndicatorProgress: number;

  if (isAnimatingExit) {
    // Exit: linear interpolation
    scrollIndicatorProgress = interpolate(effectiveFrame, [SCROLL_INDICATOR_START, SCROLL_INDICATOR_START + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    scrollIndicatorOpacity = scrollIndicatorProgress;
    scrollIndicatorY = interpolate(scrollIndicatorProgress, [0, 1], [20, 0]);
  } else {
    // Entrance: use spring
    scrollIndicatorProgress = spring({
      frame: effectiveFrame - SCROLL_INDICATOR_START,
      fps: FPS,
      config: { damping: 14, stiffness: 100 },
    });
    scrollIndicatorOpacity = interpolate(scrollIndicatorProgress, [0, 1], [0, 1]);
    scrollIndicatorY = interpolate(scrollIndicatorProgress, [0, 1], [20, 0]);
  }

  // Responsive sizes
  const titleWidth = responsiveValue(viewport.width, 280, 600, 320, 1200);
  const padding = responsiveSpacing(viewport.width, 20, 40);

  // Bounce animation for scroll indicator (only when visible and not animating)
  const bounceOffset =
    scrollIndicatorProgress > 0.5 &&
    isCurrent &&
    !isExiting &&
    !isEnteringBackward &&
    !isEnteringFromContactWrap
      ? Math.sin((introFrame + sequenceFrame) * 0.1) * 8
      : 0;

  // Final opacity: all entrance animations are handled by effectiveFrame
  const finalOpacity = 1;

  // No translateY needed - animations are self-contained
  const finalTranslateY = 0;

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
        opacity: finalOpacity,
        transform: `translateY(${finalTranslateY}px)`,
      }}
    >
      {/* Main title - SVG with handwriting animation */}
      <OzKeisarText
        ref={svgRef}
        progress={titleDrawProgress}
        color={toRgbString(colors.textPrimary)}
        width={titleWidth}
      />

      {/* Subtitle - spring animation entrance */}
      <p
        style={{
          margin: 0,
          marginTop: responsiveSpacing(viewport.width, 16, 24),
          fontSize: responsiveFontSize(viewport.width, 16, 22),
          fontWeight: 400,
          color: toRgbString(colors.textSecondary),
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '0.5px',
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        Engineering Manager & AI Innovation Lead
      </p>

      {/* Accent line */}
      <div
        style={{
          marginTop: responsiveSpacing(viewport.width, 24, 40),
          width: accentLineWidth,
          height: 3,
          backgroundColor: toRgbString(colors.accent),
          borderRadius: 2,
          opacity: accentLineOpacity,
        }}
      />

      {/* Scroll indicator - animates in as part of entrance sequence */}
      <div
        style={{
          position: 'absolute',
          bottom: responsiveSpacing(viewport.width, 40, 60),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: scrollIndicatorOpacity,
          transform: `translateY(${scrollIndicatorY + bounceOffset}px)`,
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: toRgbString(colors.textMuted),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Scroll to explore
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={toRgbString(colors.textMuted)}
          strokeWidth="2"
          role="img"
          aria-label="Scroll down"
        >
          <title>Scroll down</title>
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
