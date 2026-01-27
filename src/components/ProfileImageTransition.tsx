import ozPhoto from '../assets/oz-photo.webp';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../hooks/useViewport';
import { interpolate } from '../utils/animation';
import { colors, toRgbString } from '../utils/colors';
import { FRAME_CONFIG, useScrollContext } from './ScrollController';

/**
 * Profile image that starts inside the "O" letter and transitions
 * to the summary section as the user scrolls.
 * Has a permanent white background that travels with it.
 *
 * Coordinates with SummarySection for proper positioning on both mobile and desktop.
 */
export function ProfileImageTransition() {
  const { frame, viewport, entranceFrame, isEntranceComplete } = useScrollContext();

  // Calculate transition progress (hero -> summary)
  const heroEnd = FRAME_CONFIG.hero.end;
  const summaryMid = FRAME_CONFIG.summary.start + 50;

  const transitionProgress = interpolate(frame, [heroEnd - 30, summaryMid], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Image appearance in the O (after title animation completes)
  const appearanceProgress = interpolate(entranceFrame, [85, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Don't render until animation starts appearing
  if (appearanceProgress <= 0 && !isEntranceComplete) {
    return null;
  }

  // Hide after summary section
  if (frame > FRAME_CONFIG.summary.end + 50) {
    return null;
  }

  // Responsive breakpoints (must match SummarySection)
  const isMobile = viewport.width < 768;

  // Responsive title sizing (must match HeroSection exactly)
  const titleWidth = responsiveValue(viewport.width, 280, 600, 320, 1200);
  const titleHeight = titleWidth * 0.22; // matches OzKeisarText height ratio

  // O letter in viewBox "0 0 320 70":
  const oViewBoxCenterX = 35;
  const oViewBoxCenterY = 35;
  const oViewBoxInnerWidth = 49;
  const oViewBoxInnerHeight = 53;

  // Convert to screen coordinates
  const oScreenCenterX = (oViewBoxCenterX / 320) * titleWidth;
  const oScreenCenterY = (oViewBoxCenterY / 70) * titleHeight;
  const oWidth = (oViewBoxInnerWidth / 320) * titleWidth;
  const oHeight = (oViewBoxInnerHeight / 70) * titleHeight;

  // Hero position calculations
  const subtitleFontSize = responsiveFontSize(viewport.width, 16, 22);
  const subtitleMargin = responsiveSpacing(viewport.width, 16, 24);
  const subtitleHeight = subtitleFontSize * 1.2;
  const accentMargin = responsiveSpacing(viewport.width, 24, 40);
  const accentHeight = 3;

  const belowTitleHeight = subtitleMargin + subtitleHeight + accentMargin + accentHeight;
  const verticalOffset = belowTitleHeight / 2;

  const titleLeft = (viewport.width - titleWidth) / 2;
  const titleTop = (viewport.height - titleHeight) / 2 - verticalOffset;

  const heroX = titleLeft + oScreenCenterX;
  const heroY = titleTop + oScreenCenterY;

  // Summary position - must match SummarySection layout exactly
  // Photo is smaller on mobile
  const summaryPhotoSize = isMobile
    ? responsiveFontSize(viewport.width, 80, 100)
    : responsiveFontSize(viewport.width, 160, 200);
  const contentGap = responsiveSpacing(viewport.width, 24, 60);
  const textMaxWidth = responsiveValue(viewport.width, 320, 500, 320, 1200);

  let summaryX: number;
  let summaryY: number;

  if (isMobile) {
    // Mobile: photo is at top of content, positioned higher on screen
    // Position photo in upper portion of viewport
    const topOffset = viewport.height * 0.12; // 12% from top

    summaryX = viewport.width / 2;
    summaryY = topOffset + summaryPhotoSize / 2;
  } else {
    // Desktop: photo on left side of centered row
    // Total content width = photoSize + gap + textWidth
    const totalContentWidth = summaryPhotoSize + contentGap + textMaxWidth;
    const contentStartX = (viewport.width - totalContentWidth) / 2;

    summaryX = contentStartX + summaryPhotoSize / 2;
    summaryY = viewport.height / 2;
  }

  // Interpolate between positions
  const currentX = interpolate(transitionProgress, [0, 1], [heroX, summaryX]);
  const currentY = interpolate(transitionProgress, [0, 1], [heroY, summaryY]);

  // Interpolate from ellipse (O shape) to circle (summary)
  const currentWidth = interpolate(transitionProgress, [0, 1], [oWidth, summaryPhotoSize]);
  const currentHeight = interpolate(transitionProgress, [0, 1], [oHeight, summaryPhotoSize]);

  // Opacity: fade in during appearance, stay visible during transition
  const opacity = isEntranceComplete ? 1 : appearanceProgress;

  // Exit opacity for summary section
  const exitOpacity = interpolate(
    frame,
    [FRAME_CONFIG.summary.end - 30, FRAME_CONFIG.summary.end + 20],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // White border padding (grows during transition)
  const borderPadding = interpolate(transitionProgress, [0, 0.5], [3, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle shadow
  const shadowOpacity = interpolate(transitionProgress, [0.1, 0.5], [0.1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'fixed',
        left: currentX,
        top: currentY,
        width: currentWidth + borderPadding * 2,
        height: currentHeight + borderPadding * 2,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        opacity: opacity * exitOpacity,
        backgroundColor: toRgbString(colors.textPrimary),
        boxShadow: `0 10px 40px rgba(0, 0, 0, ${shadowOpacity})`,
        zIndex: 100,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={ozPhoto}
        alt="Oz Keisar"
        style={{
          width: currentWidth,
          height: currentHeight,
          objectFit: 'cover',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
