import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbString } from '../../utils/colors';
import { FPS, getSectionProgress, useScrollContext } from '../ScrollController';
import { OzKeisarText } from '../text/OzKeisarText';

export function HeroSection() {
  const { frame, viewport, entranceFrame, isEntranceComplete } = useScrollContext();
  const sectionProgress = getSectionProgress(frame, 'hero');

  // Calculate text drawing progress (0-1) based on entrance frame
  // Title draws from frame 0 to 90 (3 seconds)
  const titleDrawProgress = interpolate(entranceFrame, [0, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle spring animation (appears as title nears completion)
  const subtitleProgress = spring({
    frame: entranceFrame - 75,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);

  // Accent line animation (appears with subtitle)
  const accentLineProgress = spring({
    frame: entranceFrame - 85,
    fps: FPS,
    config: { damping: 14, stiffness: 120 },
  });
  const accentLineWidth = interpolate(accentLineProgress, [0, 1], [0, 80]);
  const accentLineOpacity = interpolate(accentLineProgress, [0, 1], [0, 1]);

  // Scroll indicator animation (appears right after)
  const scrollIndicatorProgress = spring({
    frame: entranceFrame - 100,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const scrollIndicatorOpacity = interpolate(scrollIndicatorProgress, [0, 1], [0, 1]);
  const scrollIndicatorY = interpolate(scrollIndicatorProgress, [0, 1], [20, 0]);

  // Exit animation (fade out as we scroll into summary) - only after entrance complete
  const exitOpacity = isEntranceComplete
    ? interpolate(sectionProgress, [0.3, 0.8], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  const exitY = isEntranceComplete
    ? interpolate(sectionProgress, [0.3, 0.8], [0, -50], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Responsive sizes
  const titleWidth = responsiveValue(viewport.width, 280, 600, 320, 1200);
  const padding = responsiveSpacing(viewport.width, 20, 40);

  // Bounce animation for scroll indicator
  const bounceFrame = isEntranceComplete ? entranceFrame + frame : entranceFrame;
  const bounceOffset = scrollIndicatorProgress > 0.5 ? Math.sin(bounceFrame * 0.1) * 8 : 0;

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
        opacity: exitOpacity,
        transform: `translateY(${exitY}px)`,
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
          opacity: scrollIndicatorOpacity * exitOpacity,
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
