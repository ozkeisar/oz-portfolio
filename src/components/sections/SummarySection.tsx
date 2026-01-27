import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { FPS, FRAME_CONFIG, getSectionProgress, useScrollContext } from '../ScrollController';

// Highlighted company/project link component
function HighlightedText({
  children,
  href,
  delay,
  textFrame,
}: {
  children: string;
  href?: string;
  delay: number;
  textFrame: number;
}) {
  const linkFrame = Math.max(0, textFrame - delay);
  const linkProgress = spring({
    frame: linkFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 120 },
  });

  const style: React.CSSProperties = {
    color: toRgbString(colors.accent),
    textDecoration: 'none',
    opacity: interpolate(linkProgress, [0, 1], [0.5, 1]),
    fontWeight: 500,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {children}
      </a>
    );
  }

  return <span style={style}>{children}</span>;
}

export function SummarySection() {
  const { frame, viewport } = useScrollContext();
  const { start, end } = FRAME_CONFIG.summary;
  const sectionProgress = getSectionProgress(frame, 'summary');

  // Only render when near or in section
  if (frame < start - 30 || frame > end + 50) {
    return null;
  }

  // Entrance animation
  const entranceFrame = Math.max(0, frame - start);
  const entranceProgress = spring({
    frame: entranceFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  // Section number animation
  const numberFrame = Math.max(0, entranceFrame - 5);
  const numberProgress = spring({
    frame: numberFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });

  // Text animation (slightly delayed)
  const textFrame = Math.max(0, entranceFrame - 15);
  const textProgress = spring({
    frame: textFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [30, 0]);

  // Exit animation
  const exitOpacity = interpolate(sectionProgress, [0.7, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitY = interpolate(sectionProgress, [0.7, 1], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        opacity: exitOpacity * entranceProgress,
        transform: `translateY(${exitY}px)`,
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

        {/* Professional narrative */}
        <div
          style={{
            fontSize: bodySize,
            fontWeight: 400,
            color: toRgbString(colors.textSecondary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: 1.75,
          }}
        >
          <p style={{ margin: 0 }}>
            Engineering leader with 9+ years of experience architecting and delivering complex
            systems at scale. From{' '}
            <HighlightedText delay={20} textFrame={textFrame}>
              mission-critical defense systems
            </HighlightedText>{' '}
            in the Israeli Air Force to leading development teams at{' '}
            <HighlightedText delay={25} textFrame={textFrame} href="https://abra-bm.com">
              Abra
            </HighlightedText>
            , I specialize in turning ambitious technical challenges into production-ready
            solutions.
          </p>

          <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
            Currently directing AI-first development initiatives and managing cross-functional teams
            delivering{' '}
            <HighlightedText delay={30} textFrame={textFrame}>
              enterprise banking platforms
            </HighlightedText>{' '}
            (1M+ users),{' '}
            <HighlightedText delay={35} textFrame={textFrame}>
              real-time security systems
            </HighlightedText>
            , and{' '}
            <HighlightedText delay={40} textFrame={textFrame}>
              medical imaging software
            </HighlightedText>
            .
          </p>

          <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
            Committed to advancing developer productivity through tooling and methodology. Creator
            of{' '}
            <HighlightedText
              delay={45}
              textFrame={textFrame}
              href="https://github.com/ozkeisar/mockingbird"
            >
              Mockingbird
            </HighlightedText>{' '}
            and architect of AI-augmented development workflows adopted across engineering teams.
          </p>
        </div>

        {/* Tech stack */}
        <div style={{ marginTop: responsiveSpacing(viewport.width, 20, 28) }}>
          <p
            style={{
              margin: 0,
              marginBottom: responsiveSpacing(viewport.width, 8, 12),
              fontSize: bodySize - 1,
              color: toRgbaString(colors.textSecondary, 0.8),
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Core competencies:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px 32px',
              justifyItems: 'start',
            }}
          >
            {techStack.map((tech, index) => {
              const techItemFrame = Math.max(0, textFrame - 50 - index * 3);
              const techProgress = spring({
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
      </div>
    </div>
  );
}
