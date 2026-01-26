import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { FPS, FRAME_CONFIG, getSectionProgress, useScrollContext } from '../ScrollController';

type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

const experiences: Experience[] = [
  {
    title: 'Engineering Manager',
    company: 'AI Innovation Company',
    period: '2022 - Present',
    description: 'Leading cross-functional teams in developing cutting-edge AI solutions.',
  },
  {
    title: 'Senior Software Engineer',
    company: 'Tech Startup',
    period: '2019 - 2022',
    description: 'Built scalable infrastructure for machine learning pipelines.',
  },
  {
    title: 'Software Engineer',
    company: 'Enterprise Solutions',
    period: '2016 - 2019',
    description: 'Developed full-stack applications and mentored junior developers.',
  },
];

export function ExperienceSection() {
  const { frame, viewport } = useScrollContext();
  const { start, end } = FRAME_CONFIG.experience;
  const sectionProgress = getSectionProgress(frame, 'experience');

  // Only render when near or in section
  if (frame < start - 30 || frame > end + 50) {
    return null;
  }

  // Section entrance
  const entranceFrame = Math.max(0, frame - start);
  const entranceProgress = spring({
    frame: entranceFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  // Title animation
  const titleOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const titleY = interpolate(entranceProgress, [0, 1], [30, 0]);

  // Exit animation
  const exitOpacity = interpolate(sectionProgress, [0.85, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitY = interpolate(sectionProgress, [0.85, 1], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Responsive values
  const titleSize = responsiveFontSize(viewport.width, 28, 44);
  const cardTitleSize = responsiveFontSize(viewport.width, 18, 24);
  const bodySize = responsiveFontSize(viewport.width, 14, 16);
  const padding = responsiveSpacing(viewport.width, 20, 60);

  // Timeline line progress
  const lineProgress = interpolate(sectionProgress, [0.1, 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
        opacity: exitOpacity * entranceProgress,
        transform: `translateY(${exitY}px)`,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          margin: 0,
          marginBottom: responsiveSpacing(viewport.width, 32, 48),
          fontSize: titleSize,
          fontWeight: 600,
          color: toRgbString(colors.textPrimary),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Experience
      </h2>

      {/* Timeline container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: responsiveSpacing(viewport.width, 24, 32),
          maxWidth: 700,
          width: '100%',
        }}
      >
        {/* Vertical timeline line */}
        <div
          style={{
            position: 'absolute',
            left: viewport.width < 768 ? 8 : 16,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: toRgbaString(colors.accent, 0.2),
          }}
        >
          {/* Animated progress line */}
          <div
            style={{
              width: '100%',
              height: `${lineProgress * 100}%`,
              backgroundColor: toRgbString(colors.accent),
              borderRadius: 1,
            }}
          />
        </div>

        {/* Experience cards */}
        {experiences.map((exp, index) => {
          // Staggered entrance for each card
          const cardFrame = Math.max(0, entranceFrame - 20 - index * 30);
          const cardProgress = spring({
            frame: cardFrame,
            fps: FPS,
            config: { damping: 14, stiffness: 100 },
          });

          const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
          const cardX = interpolate(cardProgress, [0, 1], [40, 0]);

          // Dot reveal based on scroll
          const dotThreshold = 0.1 + index * 0.25;
          const dotActive = sectionProgress >= dotThreshold;
          const dotScale = dotActive ? 1 : 0.5;
          const dotOpacity = dotActive ? 1 : 0.3;

          return (
            <div
              key={exp.period}
              style={{
                display: 'flex',
                gap: responsiveSpacing(viewport.width, 16, 24),
                opacity: cardOpacity,
                transform: `translateX(${cardX}px)`,
              }}
            >
              {/* Timeline dot */}
              <div
                style={{
                  position: 'relative',
                  width: viewport.width < 768 ? 18 : 34,
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: viewport.width < 768 ? 14 : 18,
                    height: viewport.width < 768 ? 14 : 18,
                    borderRadius: '50%',
                    backgroundColor: toRgbString(colors.accent),
                    border: `3px solid ${toRgbString(colors.background)}`,
                    boxShadow: `0 0 0 2px ${toRgbString(colors.accent)}`,
                    transform: `scale(${dotScale})`,
                    opacity: dotOpacity,
                  }}
                />
              </div>

              {/* Card content */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: toRgbaString(colors.cardBackground, 0.6),
                  borderRadius: 16,
                  padding: responsiveSpacing(viewport.width, 16, 24),
                  border: `1px solid ${toRgbaString(colors.cardBorder, 0.5)}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: cardTitleSize,
                        fontWeight: 600,
                        color: toRgbString(colors.textPrimary),
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {exp.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        marginTop: 4,
                        fontSize: bodySize,
                        color: toRgbString(colors.accent),
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {exp.company}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: bodySize - 2,
                      color: toRgbString(colors.textMuted),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: bodySize,
                    color: toRgbString(colors.textSecondary),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {exp.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
