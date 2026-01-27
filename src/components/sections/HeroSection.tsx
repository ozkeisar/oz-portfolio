import { FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbString } from '../../utils/colors';
import { OzKeisarText } from '../text/OzKeisarText';

// Timing constants for backward transition
const HERO_BACKWARD_ENTRANCE_DELAY = 80; // Hero starts entering after summary text is mostly deleted (90 frame reverse)

// Timing constants for wrap transition (entering from contact via infinite loop)
const HERO_WRAP_ENTRANCE_DELAY = 15; // Start fading in shortly after contact exit begins
const HERO_WRAP_ENTRANCE_DURATION = 45; // Full fade-in duration to sync with image arrival

export function HeroSection() {
  const { introFrame, isIntroComplete, sequenceFrame, viewport, direction } = useAnimationContext();

  const { isVisible, isCurrent, isExiting, isEnteringBackward, isEnteringFromWrap, isExitingToWrap } =
    useSectionVisibility('hero');

  // Forward wrap entrance: coming from Contact section (infinite loop)
  const isEnteringFromContactWrap = isEnteringFromWrap && direction === 'forward';

  // Don't render if not visible
  if (!isVisible && isIntroComplete) {
    return null;
  }

  // Calculate text drawing progress (0-1) based on intro frame
  // Title draws from frame 0 to 90 (3 seconds)
  const titleDrawProgress = interpolate(introFrame, [0, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle spring animation (appears as title nears completion)
  const subtitleProgress = spring({
    frame: introFrame - 75,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);

  // Accent line animation (appears with subtitle)
  const accentLineProgress = spring({
    frame: introFrame - 85,
    fps: FPS,
    config: { damping: 14, stiffness: 120 },
  });
  const accentLineWidth = interpolate(accentLineProgress, [0, 1], [0, 80]);
  const accentLineOpacity = interpolate(accentLineProgress, [0, 1], [0, 1]);

  // Scroll indicator animation (appears right after)
  const scrollIndicatorProgress = spring({
    frame: introFrame - 100,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const scrollIndicatorOpacity = interpolate(scrollIndicatorProgress, [0, 1], [0, 1]);
  const scrollIndicatorY = interpolate(scrollIndicatorProgress, [0, 1], [20, 0]);

  // Exit animation - fade out upward (not using calculateExitAnimation)
  // Also handle wrap exit (hero→contact when scrolling backward at hero)
  const isExitingNormal = isExiting && !isExitingToWrap;
  const exitOpacity = isExitingNormal
    ? interpolate(sequenceFrame, [0, 30], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : isExitingToWrap
      ? interpolate(sequenceFrame, [0, 30], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;
  const exitTranslateY = isExitingNormal
    ? interpolate(sequenceFrame, [0, 35], [0, -50], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : isExitingToWrap
      ? interpolate(sequenceFrame, [0, 35], [0, 50], {
          // Slide down for backward wrap
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const exitAnimation =
    isEnteringBackward || isEnteringFromContactWrap
      ? { opacity: 1, translateY: 0 }
      : { opacity: exitOpacity, translateY: exitTranslateY };

  // Backward entrance animation - fade in after summary text deletion
  // Duration matches image movement (30 frames) for sync
  const backwardEntranceOpacity = isEnteringBackward
    ? interpolate(
        sequenceFrame,
        [HERO_BACKWARD_ENTRANCE_DELAY, HERO_BACKWARD_ENTRANCE_DELAY + 30],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Forward wrap entrance animation - fade in as image returns to "O"
  // Delayed to sync with image animation
  const wrapEntranceOpacity = isEnteringFromContactWrap
    ? interpolate(
        sequenceFrame,
        [HERO_WRAP_ENTRANCE_DELAY, HERO_WRAP_ENTRANCE_DELAY + HERO_WRAP_ENTRANCE_DURATION],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Forward wrap entrance translateY - subtle slide up effect
  const wrapEntranceTranslateY = isEnteringFromContactWrap
    ? interpolate(
        sequenceFrame,
        [HERO_WRAP_ENTRANCE_DELAY, HERO_WRAP_ENTRANCE_DELAY + HERO_WRAP_ENTRANCE_DURATION],
        [30, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Responsive sizes
  const titleWidth = responsiveValue(viewport.width, 280, 600, 320, 1200);
  const padding = responsiveSpacing(viewport.width, 20, 40);

  // Bounce animation for scroll indicator (only when visible and not exiting/entering)
  const bounceOffset =
    scrollIndicatorProgress > 0.5 &&
    isCurrent &&
    !isExiting &&
    !isEnteringBackward &&
    !isEnteringFromContactWrap
      ? Math.sin((introFrame + sequenceFrame) * 0.1) * 8
      : 0;

  // Combined opacity: exit animation * backward entrance * wrap entrance
  const finalOpacity = exitAnimation.opacity * backwardEntranceOpacity * wrapEntranceOpacity;

  // Combined translateY for wrap entrance
  const finalTranslateY = exitAnimation.translateY + wrapEntranceTranslateY;

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
          opacity: scrollIndicatorOpacity * exitAnimation.opacity,
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
