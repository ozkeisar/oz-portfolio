import ozPhoto from '../assets/oz-photo.webp';
import { useAnimationContext, useSectionVisibility } from '../context/AnimationContext';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../hooks/useViewport';
import { interpolate } from '../utils/animation';
import { colors, toRgbString } from '../utils/colors';

// Timing constants for backward transition
const IMAGE_BACKWARD_MOVE_DELAY = 80; // Image starts moving back after text is mostly deleted
const IMAGE_MOVE_DURATION = 30; // Duration for image to move back to hero (faster to match hero fade-in)

/**
 * Profile image that starts inside the "O" letter and transitions
 * to the summary section as the user scrolls.
 * Has a permanent white background that travels with it.
 *
 * Coordinates with SummarySection for proper positioning on both mobile and desktop.
 */
export function ProfileImageTransition() {
  const { introFrame, isIntroComplete, sequenceFrame, direction, viewport } = useAnimationContext();
  const heroVisibility = useSectionVisibility('hero');
  const summaryVisibility = useSectionVisibility('summary');

  // Image appearance in the O (after title animation completes during intro)
  const appearanceProgress = interpolate(introFrame, [85, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Don't render until animation starts appearing
  if (appearanceProgress <= 0 && !isIntroComplete) {
    return null;
  }

  // Hide when neither hero nor summary is visible
  if (!heroVisibility.isVisible && !summaryVisibility.isVisible) {
    return null;
  }

  // Calculate transition progress: 0 = hero position, 1 = summary position
  // Transition when hero is exiting or we're on summary section
  let transitionProgress = 0;

  if (heroVisibility.isEnteringBackward) {
    // Going backward from summary to hero
    // Wait until text deletion is mostly done, then move image back
    transitionProgress = interpolate(
      sequenceFrame,
      [IMAGE_BACKWARD_MOVE_DELAY, IMAGE_BACKWARD_MOVE_DELAY + IMAGE_MOVE_DURATION],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  } else if (heroVisibility.isExiting && direction === 'forward') {
    // Hero is exiting forward - animate image to summary position
    transitionProgress = interpolate(sequenceFrame, [0, 45], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  } else if (
    summaryVisibility.isCurrent &&
    !summaryVisibility.isExiting &&
    !summaryVisibility.isReversing
  ) {
    // On summary section (not exiting or reversing) - stay at summary position
    transitionProgress = 1;
  } else if (summaryVisibility.isReversing) {
    // Summary is reversing (text deleting) - stay at summary position until image moves
    transitionProgress = 1;
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
  const opacity = isIntroComplete ? 1 : appearanceProgress;

  // Exit opacity when summary section is exiting (forward only, not when reversing)
  const exitOpacity =
    summaryVisibility.isExiting && !summaryVisibility.isReversing && direction === 'forward'
      ? interpolate(sequenceFrame, [0, 30], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

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
