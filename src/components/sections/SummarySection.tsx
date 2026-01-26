import ozPhoto from '../../assets/oz-photo.webp';
import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { FPS, FRAME_CONFIG, getSectionProgress, useScrollContext } from '../ScrollController';

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

  // Photo animation (comes in first)
  const photoProgress = spring({
    frame: entranceFrame,
    fps: FPS,
    config: { damping: 16, stiffness: 100 },
  });
  const photoOpacity = interpolate(photoProgress, [0, 1], [0, 1]);
  const photoScale = interpolate(photoProgress, [0, 1], [0.8, 1]);
  const photoX = interpolate(photoProgress, [0, 1], [-30, 0]);

  // Text animation (slightly delayed)
  const textFrame = Math.max(0, entranceFrame - 10);
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

  // Responsive values
  const titleSize = responsiveFontSize(viewport.width, 28, 44);
  const bodySize = responsiveFontSize(viewport.width, 16, 20);
  const padding = responsiveSpacing(viewport.width, 20, 60);
  const photoSize = responsiveFontSize(viewport.width, 120, 200);

  const isMobileLayout = viewport.width < 768;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: isMobileLayout ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding,
        gap: responsiveSpacing(viewport.width, 30, 60),
        opacity: exitOpacity * entranceProgress,
        transform: `translateY(${exitY}px)`,
      }}
    >
      {/* Photo */}
      <div
        style={{
          flexShrink: 0,
          width: photoSize,
          height: photoSize,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${toRgbString(colors.accent)}, ${toRgbString(colors.accentDark)})`,
          opacity: photoOpacity,
          transform: `translateX(${photoX}px) scale(${photoScale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 20px 50px ${toRgbaString(colors.accent, 0.3)}`,
          overflow: 'hidden',
        }}
      >
        <img
          src={ozPhoto}
          alt="Oz Keisar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          maxWidth: 600,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: titleSize,
            fontWeight: 600,
            color: toRgbString(colors.textPrimary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: isMobileLayout ? 'center' : 'left',
            lineHeight: 1.2,
          }}
        >
          Building the Future of AI
        </h2>

        <p
          style={{
            margin: 0,
            marginTop: responsiveSpacing(viewport.width, 16, 24),
            fontSize: bodySize,
            fontWeight: 400,
            color: toRgbString(colors.textSecondary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: isMobileLayout ? 'center' : 'left',
            lineHeight: 1.7,
          }}
        >
          A passionate engineering leader with expertise in AI systems, driving innovation and
          building high-performing teams. Transforming complex challenges into elegant solutions
          that make a real impact.
        </p>

        {/* Key highlights */}
        <div
          style={{
            marginTop: responsiveSpacing(viewport.width, 24, 32),
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: isMobileLayout ? 'center' : 'flex-start',
          }}
        >
          {['AI/ML', 'Leadership', 'Innovation'].map((tag, index) => {
            const tagFrame = Math.max(0, textFrame - index * 5);
            const tagProgress = spring({
              frame: tagFrame,
              fps: FPS,
              config: { damping: 14, stiffness: 120 },
            });

            return (
              <span
                key={tag}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  backgroundColor: toRgbaString(colors.accent, 0.15),
                  color: toRgbString(colors.accent),
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  opacity: interpolate(tagProgress, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(tagProgress, [0, 1], [0.8, 1])})`,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
