import ozPhoto from '../assets/oz-photo.webp';
import { FPS } from '../config/sections';
import { useAnimationContext, useSectionVisibility } from '../context/AnimationContext';
import { EXPERIENCE_ITEM_COUNT } from '../data/experienceData';
import { getTimelineScrollState, getTotalExperienceScroll } from '../hooks/useTimelineScroll';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../hooks/useViewport';
import { interpolate, spring } from '../utils/animation';
import { colors, toRgbString } from '../utils/colors';

// Timing constants for backward transition
const IMAGE_BACKWARD_MOVE_DELAY = 80; // Image starts moving back after text is mostly deleted
const IMAGE_MOVE_DURATION = 30; // Duration for image to move back to hero (faster to match hero fade-in)

// Timing constants for experience transition
const EXPERIENCE_TRANSITION_DELAY = 110; // Wait for summary text deletion before moving (~3.7s at 30fps)
const EXPERIENCE_TRANSITION_DURATION = 30; // Frames for image to move to experience position

// Timing constants for impact transition
const IMPACT_TRANSITION_DELAY = 10; // Small delay to sync with experience exit start
const IMPACT_TRANSITION_DURATION = 20; // Frames for image to move back to experience (fast)

/**
 * Profile image that starts inside the "O" letter and transitions
 * through sections as the user scrolls.
 * - Hero: Inside the "O" letter
 * - Summary: Left side on desktop, top on mobile
 * - Experience: Fades out (experience section has its own content)
 *
 * Coordinates with SummarySection for proper positioning on both mobile and desktop.
 */
export function ProfileImageTransition() {
  const {
    introFrame,
    isIntroComplete,
    sequenceFrame,
    direction,
    viewport,
    contentScrollOffset,
    state,
  } = useAnimationContext();
  const heroVisibility = useSectionVisibility('hero');
  const summaryVisibility = useSectionVisibility('summary');
  const experienceVisibility = useSectionVisibility('experience');
  const impactVisibility = useSectionVisibility('impact');

  // Image appearance in the O (after title animation completes during intro)
  const appearanceProgress = interpolate(introFrame, [85, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Don't render until animation starts appearing
  if (appearanceProgress <= 0 && !isIntroComplete) {
    return null;
  }

  // Transition states
  const isTransitioningToExperience = summaryVisibility.isExiting && direction === 'forward';
  const isTransitioningFromExperience =
    experienceVisibility.isReversing ||
    (experienceVisibility.isExiting && direction === 'backward');
  const isTransitioningToImpact = experienceVisibility.isExiting && direction === 'forward';
  const isTransitioningFromImpact =
    impactVisibility.isReversing || (impactVisibility.isExiting && direction === 'backward');

  // Hide when not on any relevant section
  if (
    !heroVisibility.isVisible &&
    !summaryVisibility.isVisible &&
    !experienceVisibility.isVisible &&
    !impactVisibility.isVisible &&
    !isTransitioningToExperience &&
    !isTransitioningFromExperience &&
    !isTransitioningToImpact &&
    !isTransitioningFromImpact
  ) {
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
  } else if (isTransitioningToExperience || isTransitioningFromExperience) {
    // During summary→experience or experience→summary transition, stay at summary position
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

  // Mobile layout calculations (must match SummarySection exactly)
  const mobileTopPadding = viewport.height * 0.15; // Must match SummarySection paddingTop
  const mobileScrolledSize = 32; // Small image next to section number
  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);
  const sectionNumberFontSize = numberSize + 10;

  if (isMobile) {
    // Mobile: photo centered above the text content
    // Position so image bottom is above where text starts (mobileTopPadding)
    const gapAboveText = 16; // gap between image bottom and text top
    summaryX = viewport.width / 2;
    summaryY = mobileTopPadding - gapAboveText - summaryPhotoSize / 2;
  } else {
    // Desktop: photo on left side of centered row
    // Total content width = photoSize + gap + textWidth
    const totalContentWidth = summaryPhotoSize + contentGap + textMaxWidth;
    const contentStartX = (viewport.width - totalContentWidth) / 2;

    summaryX = contentStartX + summaryPhotoSize / 2;
    summaryY = viewport.height / 2;
  }

  // Mobile scroll-based transition: move image into section number row
  // Calculate text content position (centered div with maxWidth)
  const textContentLeftEdge = (viewport.width - textMaxWidth) / 2;

  // Position image at the LEFT of the section number row, inside the spacer
  // Image sits at: textContentLeftEdge + imageSize/2 (for center positioning within spacer)
  const mobileScrolledX = textContentLeftEdge + mobileScrolledSize / 2;

  // Y position: align with section number row
  // Section number row starts at: mobileTopPadding (top of text content on mobile)
  // Center image vertically with the section number text
  const sectionNumberCenterY = mobileTopPadding + sectionNumberFontSize / 2;
  const mobileScrolledY = sectionNumberCenterY;

  // ===========================================
  // Experience section position calculations
  // ===========================================
  // Must match ExperienceSection layout exactly

  // Experience layout constants (from ExperienceSection)
  const expVerticalPadding = responsiveSpacing(viewport.width, 20, 40);
  const expContentMaxWidth = responsiveValue(viewport.width, 320, 600, 320, 1200);

  // Timeline rail dimensions (from TimelineRail)
  const railWidth = 40;
  const railHeight = Math.min(400, viewport.height * 0.5);
  const timelineImageSize = 28; // Image size when in timeline

  // ExperienceSection uses alignItems: 'center' with maxWidth: contentMaxWidth + 60
  // This centers the content at viewport center
  // Content left edge = (viewport.width - totalMaxWidth) / 2
  const expTotalMaxWidth = expContentMaxWidth + (isMobile ? 0 : 60);
  const expContentLeftEdge = (viewport.width - expTotalMaxWidth) / 2;

  // Rail is the first flex child with width 40px, centered at left edge + 20
  const expRailCenterX = expContentLeftEdge + railWidth / 2;

  // Y position calculation:
  // - verticalPadding (top of container)
  // - + header height (section number row)
  // - + header marginBottom
  // - + progressY (position within rail)
  const expHeaderMarginBottom = responsiveSpacing(viewport.width, 16, 24);
  const expSectionNumberHeight =
    (isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20)) + 10;
  const expHeaderTotalHeight = expSectionNumberHeight + expHeaderMarginBottom;

  // Timeline dots position (from TimelineRail - must match exactly!)
  const firstDotY = 20;
  const lastDotY = railHeight - 60; // Leave room for extra dot below (matches TimelineRail)
  const extraDotY = railHeight - 20; // Final dot position

  // Get scroll state for timeline position (same calculation as ExperienceSection)
  // When entering backward from Impact, use max scroll to position at bottom of timeline
  // When exiting to Impact, preserve current scroll position (at bottom)
  const totalExperienceScroll = getTotalExperienceScroll();
  const experienceScrollOffset = experienceVisibility.isEnteringBackward
    ? totalExperienceScroll
    : experienceVisibility.isActive || state === 'CONTENT_SCROLL' || isTransitioningToImpact
      ? contentScrollOffset
      : 0;
  const expScrollState = getTimelineScrollState(experienceScrollOffset);

  // Calculate progressY matching TimelineRail exactly
  const baseProgressY = interpolate(
    expScrollState.currentItemIndex + expScrollState.localProgress,
    [0, EXPERIENCE_ITEM_COUNT - 1],
    [firstDotY, lastDotY]
  );

  // Extend to extra dot when at last item (matches TimelineRail)
  const atLastItem = expScrollState.currentItemIndex === EXPERIENCE_ITEM_COUNT - 1;
  const progressY = atLastItem
    ? baseProgressY + expScrollState.localProgress * (extraDotY - lastDotY)
    : baseProgressY;

  // Desktop experience position: center of rail, following progress
  // Add small offset to align with dot center (accounting for image size difference)
  const expDesktopX = expRailCenterX;
  const expDesktopY = expVerticalPadding + expHeaderTotalHeight + progressY + 8;

  // Mobile experience position: in the Experience section header row
  // Must match ExperienceSection's header layout exactly
  const expMobileImageSize = 32; // Must match ExperienceSection's mobileImageSize

  // X position: left edge of content area + image center
  const expMobileContentLeftEdge = (viewport.width - expContentMaxWidth) / 2;
  const expMobileX = expMobileContentLeftEdge + expMobileImageSize / 2;

  // Y position: verticalPadding + center of header row
  // The header row height on mobile is determined by the spacer (32px)
  const expMobileRowHeight = expMobileImageSize; // Row height matches image size

  // Account for header entrance animation on mobile
  // The header has transform: translateY(headerY) where headerY goes 20 → 0
  // We need to apply the same offset so the image follows the header
  let expHeaderAnimationOffset = 0;
  if (experienceVisibility.isEntering && !experienceVisibility.isEnteringBackward) {
    // Calculate the same delayed entrance progress as ExperienceSection
    const delayedFrame = Math.max(0, sequenceFrame - EXPERIENCE_TRANSITION_DELAY);
    const entranceProgress = spring({
      frame: delayedFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
    // Header Y offset during entrance animation (20 → 0)
    expHeaderAnimationOffset = interpolate(entranceProgress, [0, 1], [20, 0]);
  }

  const expMobileY = expVerticalPadding + expMobileRowHeight / 2 + expHeaderAnimationOffset;

  const experienceX = isMobile ? expMobileX : expDesktopX;
  const experienceY = isMobile ? expMobileY : expDesktopY;
  const experienceImageSize = isMobile ? expMobileImageSize : timelineImageSize;

  // ===========================================
  // Impact section position calculations
  // ===========================================
  // Must match ImpactSection layout exactly

  // Impact layout constants (from ImpactSection)
  const impactVerticalPadding = responsiveSpacing(viewport.width, 20, 40);
  const impactContentMaxWidth = responsiveValue(viewport.width, 320, 600, 320, 1200);
  const impactImageSize = isMobile ? 32 : 40; // Matches Impact header image size

  // Impact content left edge for positioning
  const impactContentLeftEdge = (viewport.width - impactContentMaxWidth) / 2;

  // Impact header position - image in header row like Experience
  const impactMobileX = impactContentLeftEdge + impactImageSize / 2;
  const impactDesktopX = impactContentLeftEdge + impactImageSize / 2;

  // Account for header entrance animation
  // The header has transform: translateY(headerY) where headerY goes 20 → 0
  // We need to apply the same offset so the image follows the header
  let impactHeaderAnimationOffset = 0;
  if (impactVisibility.isEntering && !impactVisibility.isEnteringBackward) {
    // Calculate the same delayed entrance progress as ImpactSection
    const delayedFrame = Math.max(0, sequenceFrame - IMPACT_TRANSITION_DELAY);
    const entranceProgress = spring({
      frame: delayedFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
    // Header Y offset during entrance animation (20 → 0)
    impactHeaderAnimationOffset = interpolate(entranceProgress, [0, 1], [20, 0]);
  }

  const impactMobileY = impactVerticalPadding + impactImageSize / 2 + impactHeaderAnimationOffset;
  const impactDesktopY = impactVerticalPadding + impactImageSize / 2 + impactHeaderAnimationOffset;

  const impactX = isMobile ? impactMobileX : impactDesktopX;
  const impactY = isMobile ? impactMobileY : impactDesktopY;

  // ===========================================
  // Calculate experience transition progress
  // ===========================================

  // Transition from summary → experience (0 = summary scrolled position, 1 = experience position)
  let experienceTransitionProgress = 0;

  if (isTransitioningToExperience) {
    // Summary exiting forward to experience - WAIT for text deletion, then move
    // Use same spring timing as Experience header/spacer for coordinated animation
    const delayedFrame = Math.max(0, sequenceFrame - EXPERIENCE_TRANSITION_DELAY);
    experienceTransitionProgress = spring({
      frame: delayedFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
  } else if (experienceVisibility.isEntering) {
    if (experienceVisibility.isEnteringBackward) {
      // Entering backward from later section - jump immediately
      experienceTransitionProgress = 1;
    } else {
      // Entering forward from summary - continue animation with same spring timing
      const delayedFrame = Math.max(0, sequenceFrame - EXPERIENCE_TRANSITION_DELAY);
      experienceTransitionProgress = spring({
        frame: delayedFrame,
        fps: FPS,
        config: { damping: 14, stiffness: 80 },
      });
    }
  } else if (experienceVisibility.isActive) {
    // On experience section (not transitioning)
    experienceTransitionProgress = 1;
  } else if (isTransitioningToImpact || impactVisibility.isEntering || impactVisibility.isActive || impactVisibility.isCurrent) {
    // Experience exiting forward to Impact, or on Impact section (including buffering) - stay at experience position
    experienceTransitionProgress = 1;
  } else if (isTransitioningFromExperience) {
    // Experience reversing back to summary - move first, then text writes
    experienceTransitionProgress = interpolate(
      sequenceFrame,
      [0, EXPERIENCE_TRANSITION_DURATION],
      [1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // ===========================================
  // Calculate impact transition progress
  // ===========================================

  // Transition from experience → impact (0 = experience position, 1 = impact position)
  let impactTransitionProgress = 0;

  if (isTransitioningToImpact) {
    // Experience exiting forward to impact - WAIT for experience exit animation, then move
    // Use same spring timing as Impact header/spacer for coordinated animation
    const delayedFrame = Math.max(0, sequenceFrame - IMPACT_TRANSITION_DELAY);
    impactTransitionProgress = spring({
      frame: delayedFrame,
      fps: FPS,
      config: { damping: 14, stiffness: 80 },
    });
  } else if (impactVisibility.isEntering) {
    if (impactVisibility.isEnteringBackward) {
      // Entering backward from later section - jump immediately
      impactTransitionProgress = 1;
    } else {
      // Entering forward from experience - continue animation with same spring timing
      const delayedFrame = Math.max(0, sequenceFrame - IMPACT_TRANSITION_DELAY);
      impactTransitionProgress = spring({
        frame: delayedFrame,
        fps: FPS,
        config: { damping: 14, stiffness: 80 },
      });
    }
  } else if (impactVisibility.isActive || impactVisibility.isCurrent) {
    // On impact section (active or buffering)
    impactTransitionProgress = 1;
  } else if (isTransitioningFromImpact) {
    // Impact reversing back to experience - move first, then experience writes
    impactTransitionProgress = interpolate(sequenceFrame, [0, IMPACT_TRANSITION_DURATION], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // Calculate scroll progress for mobile (0 = summary position, 1 = scrolled position)
  // Image should complete moving quickly so it's in place before exit animation
  // Using a small threshold (20px) for fast but smooth transition
  const scrollMoveThreshold = 20;

  // Calculate base scroll progress from contentScrollOffset
  const baseScrollProgress = interpolate(contentScrollOffset, [0, scrollMoveThreshold], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let mobileScrollProgress = 0;
  if (isMobile) {
    if (state === 'CONTENT_SCROLL' && summaryVisibility.isCurrent) {
      // Normal content scroll on summary - use scroll offset directly
      mobileScrollProgress = baseScrollProgress;
    } else if (summaryVisibility.isReversing) {
      // Backward transition from summary to hero - animate scroll position back to 0
      // contentScrollOffset is preserved, so we can use it
      const reverseAnimationProgress = interpolate(sequenceFrame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      mobileScrollProgress = baseScrollProgress * (1 - reverseAnimationProgress);
    } else if (isTransitioningToExperience) {
      // When transitioning to experience, use actual scroll progress to prevent jump
      // The image will animate from its current position to experience position
      mobileScrollProgress = baseScrollProgress;
    } else if (experienceVisibility.isActive || experienceVisibility.isEntering) {
      // When on experience section, keep at fully scrolled position
      mobileScrollProgress = 1;
    } else if (isTransitioningFromExperience) {
      // When coming back from experience, animate from scrolled position to main position
      // Use the same timing as experienceTransitionProgress going 1 → 0
      const reverseProgress = interpolate(sequenceFrame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      mobileScrollProgress = 1 - reverseProgress; // Goes from 1 → 0
    }
    // In other states (IDLE, forward TRANSITIONING, etc.), mobileScrollProgress stays 0
  }

  // Base position from hero → summary transition
  const baseX = interpolate(transitionProgress, [0, 1], [heroX, summaryX]);
  const baseY = interpolate(transitionProgress, [0, 1], [heroY, summaryY]);
  const baseWidth = interpolate(transitionProgress, [0, 1], [oWidth, summaryPhotoSize]);
  const baseHeight = interpolate(transitionProgress, [0, 1], [oHeight, summaryPhotoSize]);

  // Apply mobile scroll transition on top of base position
  // The scrolled position also moves with content scroll (same as text translateY)
  // During backward transition, animate scrollY back to 0 along with mobileScrollProgress
  let scrollY = 0;
  if (state === 'CONTENT_SCROLL' && summaryVisibility.isCurrent) {
    scrollY = contentScrollOffset;
  } else if (isTransitioningToExperience) {
    // Maintain scroll position during exit to prevent vertical jump
    scrollY = contentScrollOffset;
  } else if (summaryVisibility.isReversing) {
    // Animate scrollY back to 0 over the first 30 frames of reverse transition
    const reverseAnimationProgress = interpolate(sequenceFrame, [0, 30], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    scrollY = contentScrollOffset * (1 - reverseAnimationProgress);
  }

  // Calculate summary scrolled position (before experience transition)
  const summaryScrolledX = isMobile
    ? interpolate(mobileScrollProgress, [0, 1], [baseX, mobileScrolledX])
    : baseX;
  const summaryScrolledY = isMobile
    ? interpolate(mobileScrollProgress, [0, 1], [baseY, mobileScrolledY]) -
      scrollY * mobileScrollProgress
    : baseY;
  const summaryScrolledWidth = isMobile
    ? interpolate(mobileScrollProgress, [0, 1], [baseWidth, mobileScrolledSize])
    : baseWidth;
  const summaryScrolledHeight = isMobile
    ? interpolate(mobileScrollProgress, [0, 1], [baseHeight, mobileScrolledSize])
    : baseHeight;

  // Position: interpolate from summary scrolled → experience
  // Experience position on desktop follows the timeline; on mobile stays in header
  const experiencePositionX = interpolate(
    experienceTransitionProgress,
    [0, 1],
    [summaryScrolledX, experienceX]
  );
  const experiencePositionY = interpolate(
    experienceTransitionProgress,
    [0, 1],
    [summaryScrolledY, experienceY]
  );
  const experiencePositionWidth = interpolate(
    experienceTransitionProgress,
    [0, 1],
    [summaryScrolledWidth, experienceImageSize]
  );
  const experiencePositionHeight = interpolate(
    experienceTransitionProgress,
    [0, 1],
    [summaryScrolledHeight, experienceImageSize]
  );

  // Final position: interpolate from experience → impact
  const currentX = interpolate(impactTransitionProgress, [0, 1], [experiencePositionX, impactX]);
  const currentY = interpolate(impactTransitionProgress, [0, 1], [experiencePositionY, impactY]);
  const currentWidth = interpolate(
    impactTransitionProgress,
    [0, 1],
    [experiencePositionWidth, impactImageSize]
  );
  const currentHeight = interpolate(
    impactTransitionProgress,
    [0, 1],
    [experiencePositionHeight, impactImageSize]
  );

  // Opacity: fade in during appearance, stay visible during transitions
  const opacity = isIntroComplete ? 1 : appearanceProgress;

  // Image no longer fades when transitioning to/from experience - it moves instead
  const exitOpacity = 1;

  // White border padding (grows during transition, shrinks when scrolled/in timeline)
  const baseBorderPadding = interpolate(transitionProgress, [0, 0.5], [3, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const summaryBorderPadding = isMobile
    ? interpolate(mobileScrollProgress, [0, 1], [baseBorderPadding, 2])
    : baseBorderPadding;
  // Shrink border when in experience timeline
  const experienceBorderPadding = interpolate(
    experienceTransitionProgress,
    [0, 1],
    [summaryBorderPadding, 2]
  );
  // Keep small border in impact section
  const borderPadding = interpolate(impactTransitionProgress, [0, 1], [experienceBorderPadding, 2]);

  // Subtle shadow (reduces when scrolled/in timeline)
  const baseShadowOpacity = interpolate(transitionProgress, [0.1, 0.5], [0.1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const summaryShadowOpacity = isMobile
    ? interpolate(mobileScrollProgress, [0, 1], [baseShadowOpacity, 0.15])
    : baseShadowOpacity;
  // Reduce shadow when in experience timeline
  const experienceShadowOpacity = interpolate(
    experienceTransitionProgress,
    [0, 1],
    [summaryShadowOpacity, 0.1]
  );
  // Keep small shadow in impact section
  const shadowOpacity = interpolate(
    impactTransitionProgress,
    [0, 1],
    [experienceShadowOpacity, 0.15]
  );

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
