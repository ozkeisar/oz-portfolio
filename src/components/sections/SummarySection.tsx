import { FPS, TYPEWRITER_CHAR_DELAY } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { calculateExitAnimation } from '../../hooks/useExitAnimation';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { getTypewriterDuration, Typewriter } from '../Typewriter';

// Calculate frame duration for a text string
function getTextDuration(text: string): number {
  return getTypewriterDuration(text, TYPEWRITER_CHAR_DELAY, FPS);
}

// Styled highlight with typewriter effect
function Highlight({
  text,
  href,
  startFrame,
  currentFrame,
}: {
  text: string;
  href?: string;
  startFrame: number;
  currentFrame: number;
}) {
  // Don't render until we've reached this point in the animation
  if (currentFrame < startFrame) {
    return null;
  }

  const style: React.CSSProperties = {
    color: toRgbString(colors.accent),
    textDecoration: 'none',
    fontWeight: 500,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        <Typewriter
          text={text}
          startFrame={startFrame}
          currentFrame={currentFrame}
          direction="forward"
          showCursor={false}
        />
      </a>
    );
  }

  return (
    <span style={style}>
      <Typewriter
        text={text}
        startFrame={startFrame}
        currentFrame={currentFrame}
        direction="forward"
        showCursor={false}
      />
    </span>
  );
}

// Constants for animation timing
const SUMMARY_ENTER_DURATION = 660; // Full animation duration (for effectiveFrame mapping)
const SUMMARY_FAST_ENTER_DURATION = 90; // ~3 seconds fast enter (same speed as exit)
const SUMMARY_REVERSE_DURATION = 90; // ~3 seconds to delete all text
const SUMMARY_ENTER_DELAY = 35; // Delay before starting enter animation (let hero exit finish)

// OLD SLOW ENTER: To restore slow typewriter, change SUMMARY_FAST_ENTER_DURATION to 660
// and set effectiveFrame = sequenceFrame for forward direction (non-reversing)

export function SummarySection() {
  const { sequenceFrame, direction, viewport } = useAnimationContext();
  const { isVisible, isExiting, isReversing, isEntering } = useSectionVisibility('summary');

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Calculate effectiveFrame - compress animation for both fast enter and reverse exit
  // Forward (entering): sequenceFrame 0→90 maps to effectiveFrame 0→660 (fast forward) with delay
  // Backward (reversing): sequenceFrame 0→90 maps to effectiveFrame 660→0 (fast reverse)
  let effectiveFrame: number;
  if (isReversing) {
    // Reverse: 660 → 0
    effectiveFrame = Math.max(0, SUMMARY_ENTER_DURATION * (1 - sequenceFrame / SUMMARY_REVERSE_DURATION));
  } else if (isEntering) {
    // Fast forward enter with delay: wait for hero to exit first
    const delayedFrame = Math.max(0, sequenceFrame - SUMMARY_ENTER_DELAY);
    effectiveFrame = Math.min(SUMMARY_ENTER_DURATION, SUMMARY_ENTER_DURATION * (delayedFrame / SUMMARY_FAST_ENTER_DURATION));
  } else {
    // Idle/active state - show full animation
    effectiveFrame = SUMMARY_ENTER_DURATION;
  }

  // Entrance animations - use effectiveFrame for spring calculations
  const entranceSpringFrame = effectiveFrame;
  const entranceProgress = spring({
    frame: entranceSpringFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  // Section number animation (slightly delayed)
  const numberFrame = Math.max(0, entranceSpringFrame - 5);
  const numberProgress = spring({
    frame: numberFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });

  // Text container animation (slightly delayed)
  const textContainerProgress = spring({
    frame: Math.max(0, entranceSpringFrame - 15),
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const textOpacity = interpolate(textContainerProgress, [0, 1], [0, 1]);
  const textY = interpolate(textContainerProgress, [0, 1], [30, 0]);

  // Exit animation (slides to the right) - only for forward exit, not when reversing
  const exitAnimation = isReversing
    ? { opacity: 1, translateX: 0, scale: 1 }
    : calculateExitAnimation({
        direction: 'right',
        duration: 45,
        currentFrame: sequenceFrame,
        isExiting,
        scrollDirection: direction,
      });

  // Typewriter timing - starts after entrance animations settle
  const typewriterStartFrame = 25;

  // Responsive breakpoints
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;

  // Responsive values - more nuanced for different screens
  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const bodySize = responsiveFontSize(viewport.width, 14, 17);
  // Number size matches title size on mobile, smaller on desktop
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);

  // Padding adjusts for screen size
  const horizontalPadding = responsiveSpacing(viewport.width, 24, 80);
  const verticalPadding = responsiveSpacing(viewport.width, 20, 40);

  // Photo size matches ProfileImageTransition - smaller on mobile
  const photoSize = isMobile
    ? responsiveFontSize(viewport.width, 80, 100)
    : responsiveFontSize(viewport.width, 160, 200);

  // Gap between photo and text
  const contentGap = responsiveSpacing(viewport.width, 24, 60);

  // Max width for text content - narrower on mobile
  const textMaxWidth = responsiveValue(viewport.width, 320, 500, 320, 1200);

  // Tech stack items
  const techStack = [
    'TypeScript',
    'React / React Native',
    'Node.js',
    'AI & LLM Integration',
    'Team Leadership',
    'System Architecture',
  ];

  // Calculate layout positions to match ProfileImageTransition
  // Desktop: photo on left, text on right, both centered vertically
  // Mobile: photo on top (handled by ProfileImageTransition), text below

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: isMobile ? 'flex-start' : 'center',
        alignItems: 'center',
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: isMobile ? viewport.height * 0.12 : verticalPadding,
        paddingBottom: verticalPadding,
        gap: contentGap,
        opacity: exitAnimation.opacity * entranceProgress,
        transform: `translateX(${exitAnimation.translateX}px) scale(${exitAnimation.scale})`,
      }}
    >
      {/* Photo spacer - reserves space for ProfileImageTransition */}
      <div
        style={{
          flexShrink: 0,
          width: photoSize,
          height: photoSize,
          // On mobile, this sits at top; on desktop, left side
        }}
      />

      {/* Text content */}
      <div
        style={{
          maxWidth: textMaxWidth,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          textAlign: 'left',
        }}
      >
        {/* Section number and title with line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: responsiveSpacing(viewport.width, 16, 24),
            opacity: interpolate(numberProgress, [0, 1], [0, 1]),
            justifyContent: 'flex-start',
          }}
        >
          <span
            style={{
              fontSize: numberSize + 10,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: toRgbString(colors.accent),
              fontWeight: 400,
            }}
          >
            01.
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
            About Me
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

        {/* Professional narrative with sequential Typewriter effects */}
        {(() => {
          // Define paragraphs with their full text
          const para1 =
            'Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From mission-critical defense systems in the Israeli Air Force to leading development teams at Abra, I specialize in turning ambitious technical challenges into production-ready solutions.';
          const para2 =
            'Currently directing AI-first development initiatives and managing cross-functional teams delivering enterprise banking platforms (1M+ users), real-time security systems, and medical imaging software.';
          const para3 =
            'Committed to advancing developer productivity through tooling and methodology. Creator of Mockingbird and architect of AI-augmented development workflows adopted across engineering teams.';
          const coreCompLabel = 'Core competencies:';

          // Calculate sequential timing - each starts after previous ends
          const para1Start = typewriterStartFrame;
          const para1Duration = getTextDuration(para1);

          const para2Start = para1Start + para1Duration + 5; // 5 frame gap
          const para2Duration = getTextDuration(para2);

          const para3Start = para2Start + para2Duration + 5;
          const para3Duration = getTextDuration(para3);

          const coreCompStart = para3Start + para3Duration + 10;
          const coreCompDuration = getTextDuration(coreCompLabel);

          const techStackStart = coreCompStart + coreCompDuration + 5;

          return (
            <>
              <div
                style={{
                  fontSize: bodySize,
                  fontWeight: 400,
                  color: toRgbString(colors.textSecondary),
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: 1.75,
                }}
              >
                {/* Paragraph 1 */}
                <p style={{ margin: 0 }}>
                  <Typewriter
                    text="Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From "
                    startFrame={para1Start}
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={!isReversing && effectiveFrame < para1Start + para1Duration}
                  />
                  <Highlight
                    text="mission-critical defense systems"
                    startFrame={
                      para1Start +
                      getTextDuration(
                        'Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From '
                      )
                    }
                    currentFrame={effectiveFrame}
                  />
                  <Typewriter
                    text=" in the Israeli Air Force to leading development teams at "
                    startFrame={
                      para1Start +
                      getTextDuration(
                        'Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From mission-critical defense systems'
                      )
                    }
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={false}
                  />
                  <Highlight
                    text="Abra"
                    href="https://abra-bm.com"
                    startFrame={
                      para1Start +
                      getTextDuration(
                        'Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From mission-critical defense systems in the Israeli Air Force to leading development teams at '
                      )
                    }
                    currentFrame={effectiveFrame}
                  />
                  <Typewriter
                    text=", I specialize in turning ambitious technical challenges into production-ready solutions."
                    startFrame={
                      para1Start +
                      getTextDuration(
                        'Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From mission-critical defense systems in the Israeli Air Force to leading development teams at Abra'
                      )
                    }
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={false}
                  />
                </p>

                {/* Paragraph 2 */}
                <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
                  <Typewriter
                    text="Currently directing AI-first development initiatives and managing cross-functional teams delivering "
                    startFrame={para2Start}
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={
                      !isReversing &&
                      effectiveFrame >= para2Start &&
                      effectiveFrame < para2Start + para2Duration
                    }
                  />
                  <Highlight
                    text="enterprise banking platforms"
                    startFrame={
                      para2Start +
                      getTextDuration(
                        'Currently directing AI-first development initiatives and managing cross-functional teams delivering '
                      )
                    }
                    currentFrame={effectiveFrame}
                  />
                  <Typewriter
                    text=" (1M+ users), "
                    startFrame={
                      para2Start +
                      getTextDuration(
                        'Currently directing AI-first development initiatives and managing cross-functional teams delivering enterprise banking platforms'
                      )
                    }
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={false}
                  />
                  <Highlight
                    text="real-time security systems"
                    startFrame={
                      para2Start +
                      getTextDuration(
                        'Currently directing AI-first development initiatives and managing cross-functional teams delivering enterprise banking platforms (1M+ users), '
                      )
                    }
                    currentFrame={effectiveFrame}
                  />
                  <Typewriter
                    text=", and "
                    startFrame={
                      para2Start +
                      getTextDuration(
                        'Currently directing AI-first development initiatives and managing cross-functional teams delivering enterprise banking platforms (1M+ users), real-time security systems'
                      )
                    }
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={false}
                  />
                  <Highlight
                    text="medical imaging software"
                    startFrame={
                      para2Start +
                      getTextDuration(
                        'Currently directing AI-first development initiatives and managing cross-functional teams delivering enterprise banking platforms (1M+ users), real-time security systems, and '
                      )
                    }
                    currentFrame={effectiveFrame}
                  />
                  <Typewriter
                    text="."
                    startFrame={
                      para2Start +
                      getTextDuration(
                        'Currently directing AI-first development initiatives and managing cross-functional teams delivering enterprise banking platforms (1M+ users), real-time security systems, and medical imaging software'
                      )
                    }
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={false}
                  />
                </p>

                {/* Paragraph 3 */}
                <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
                  <Typewriter
                    text="Committed to advancing developer productivity through tooling and methodology. Creator of "
                    startFrame={para3Start}
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={
                      !isReversing &&
                      effectiveFrame >= para3Start &&
                      effectiveFrame < para3Start + para3Duration
                    }
                  />
                  <Highlight
                    text="Mockingbird"
                    href="https://github.com/ozkeisar/mockingbird"
                    startFrame={
                      para3Start +
                      getTextDuration(
                        'Committed to advancing developer productivity through tooling and methodology. Creator of '
                      )
                    }
                    currentFrame={effectiveFrame}
                  />
                  <Typewriter
                    text=" and architect of AI-augmented development workflows adopted across engineering teams."
                    startFrame={
                      para3Start +
                      getTextDuration(
                        'Committed to advancing developer productivity through tooling and methodology. Creator of Mockingbird'
                      )
                    }
                    currentFrame={effectiveFrame}
                    direction="forward"
                    showCursor={false}
                  />
                </p>
              </div>

              {/* Tech stack */}
              <div style={{ marginTop: responsiveSpacing(viewport.width, 20, 28) }}>
                <Typewriter
                  text={coreCompLabel}
                  startFrame={coreCompStart}
                  currentFrame={effectiveFrame}
                  direction="forward"
                  as="p"
                  style={{
                    margin: 0,
                    marginBottom: responsiveSpacing(viewport.width, 8, 12),
                    fontSize: bodySize - 1,
                    color: toRgbaString(colors.textSecondary, 0.8),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                  showCursor={
                    !isReversing &&
                    effectiveFrame >= coreCompStart &&
                    effectiveFrame < coreCompStart + coreCompDuration
                  }
                />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px 32px',
                    justifyItems: 'start',
                  }}
                >
                  {techStack.map((tech, index) => {
                    const techItemStart = techStackStart + index * 5;
                    const techItemFrame = Math.max(0, effectiveFrame - techItemStart);
                    const techProgress = isReversing
                      ? effectiveFrame >= techItemStart
                        ? 1
                        : 0
                      : spring({
                          frame: techItemFrame,
                          fps: FPS,
                          config: { damping: 14, stiffness: 120 },
                        });

                    return (
                      <div
                        key={tech}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          opacity: interpolate(techProgress, [0, 1], [0, 1]),
                          transform: `translateX(${interpolate(techProgress, [0, 1], [isMobile ? 0 : -10, 0])}px)`,
                        }}
                      >
                        <span
                          style={{
                            color: toRgbString(colors.accent),
                            fontSize: 10,
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                          }}
                        >
                          ▹
                        </span>
                        <span
                          style={{
                            fontSize: bodySize - 2,
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                            color: toRgbString(colors.textSecondary),
                          }}
                        >
                          {tech}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
