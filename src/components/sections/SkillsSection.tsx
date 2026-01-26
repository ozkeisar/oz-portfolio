import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { FPS, FRAME_CONFIG, getSectionProgress, useScrollContext } from '../ScrollController';

type SkillCategory = {
  name: string;
  skills: string[];
};

const skillCategories: SkillCategory[] = [
  {
    name: 'AI & Machine Learning',
    skills: ['LLMs', 'Computer Vision', 'NLP', 'MLOps'],
  },
  {
    name: 'Engineering',
    skills: ['TypeScript', 'Python', 'React', 'Node.js'],
  },
  {
    name: 'Leadership',
    skills: ['Team Building', 'Strategy', 'Mentoring', 'Agile'],
  },
  {
    name: 'Infrastructure',
    skills: ['AWS', 'Kubernetes', 'CI/CD', 'Monitoring'],
  },
];

export function SkillsSection() {
  const { frame, viewport } = useScrollContext();
  const { start, end } = FRAME_CONFIG.skills;
  const sectionProgress = getSectionProgress(frame, 'skills');

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
  const exitOpacity = interpolate(sectionProgress, [0.8, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitY = interpolate(sectionProgress, [0.8, 1], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Responsive values
  const titleSize = responsiveFontSize(viewport.width, 28, 44);
  const categoryTitleSize = responsiveFontSize(viewport.width, 16, 20);
  const skillSize = responsiveFontSize(viewport.width, 12, 14);
  const padding = responsiveSpacing(viewport.width, 20, 60);

  // Calculate columns based on viewport
  const columns = viewport.width < 640 ? 1 : viewport.width < 1024 ? 2 : 4;

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
          marginBottom: responsiveSpacing(viewport.width, 40, 60),
          fontSize: titleSize,
          fontWeight: 600,
          color: toRgbString(colors.textPrimary),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Skills
      </h2>

      {/* Skills grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: responsiveSpacing(viewport.width, 20, 28),
          maxWidth: 1000,
          width: '100%',
        }}
      >
        {skillCategories.map((category, categoryIndex) => {
          // Staggered entrance for each category
          const categoryFrame = Math.max(0, entranceFrame - 15 - categoryIndex * 12);
          const categoryProgress = spring({
            frame: categoryFrame,
            fps: FPS,
            config: { damping: 14, stiffness: 100 },
          });

          const categoryOpacity = interpolate(categoryProgress, [0, 1], [0, 1]);
          const categoryY = interpolate(categoryProgress, [0, 1], [30, 0]);

          return (
            <div
              key={category.name}
              style={{
                backgroundColor: toRgbaString(colors.cardBackground, 0.5),
                borderRadius: 16,
                padding: responsiveSpacing(viewport.width, 20, 24),
                border: `1px solid ${toRgbaString(colors.cardBorder, 0.4)}`,
                opacity: categoryOpacity,
                transform: `translateY(${categoryY}px)`,
              }}
            >
              {/* Category title */}
              <h3
                style={{
                  margin: 0,
                  marginBottom: responsiveSpacing(viewport.width, 16, 20),
                  fontSize: categoryTitleSize,
                  fontWeight: 600,
                  color: toRgbString(colors.accent),
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {category.name}
              </h3>

              {/* Skills list */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {category.skills.map((skill, skillIndex) => {
                  // Staggered entrance for each skill
                  const skillFrame = Math.max(0, categoryFrame - 5 - skillIndex * 4);
                  const skillProgress = spring({
                    frame: skillFrame,
                    fps: FPS,
                    config: { damping: 14, stiffness: 120 },
                  });

                  const skillOpacity = interpolate(skillProgress, [0, 1], [0, 1]);
                  const skillScale = interpolate(skillProgress, [0, 1], [0.8, 1]);

                  return (
                    <span
                      key={skill}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 8,
                        backgroundColor: toRgbaString(colors.background, 0.8),
                        color: toRgbString(colors.textSecondary),
                        fontSize: skillSize,
                        fontWeight: 500,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        border: `1px solid ${toRgbaString(colors.cardBorder, 0.3)}`,
                        opacity: skillOpacity,
                        transform: `scale(${skillScale})`,
                      }}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
