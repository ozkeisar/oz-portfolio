import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { EmailIcon } from '../icons/EmailIcon';
import { GitHubIcon } from '../icons/GitHubIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { FPS, FRAME_CONFIG, getSectionProgress, useScrollContext } from '../ScrollController';

type ContactLink = {
  name: string;
  url: string;
  icon: 'linkedin' | 'github' | 'email';
};

const contactLinks: ContactLink[] = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/ozkeisar', icon: 'linkedin' },
  { name: 'GitHub', url: 'https://github.com/ozkeisar', icon: 'github' },
  { name: 'Email', url: 'mailto:oz@example.com', icon: 'email' },
];

export function ContactSection() {
  const { frame, viewport } = useScrollContext();
  const { start } = FRAME_CONFIG.contact;
  const sectionProgress = getSectionProgress(frame, 'contact');

  // Only render when near or in section
  if (frame < start - 30) {
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

  // Subtitle animation (delayed)
  const subtitleFrame = Math.max(0, entranceFrame - 10);
  const subtitleProgress = spring({
    frame: subtitleFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);

  // Responsive values
  const titleSize = responsiveFontSize(viewport.width, 28, 44);
  const subtitleSize = responsiveFontSize(viewport.width, 16, 20);
  const iconSize = responsiveFontSize(viewport.width, 48, 64);
  const padding = responsiveSpacing(viewport.width, 20, 60);

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
        opacity: entranceProgress,
      }}
    >
      {/* Section title */}
      <h2
        style={{
          margin: 0,
          fontSize: titleSize,
          fontWeight: 600,
          color: toRgbString(colors.textPrimary),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        Let's Connect
      </h2>

      {/* Subtitle */}
      <p
        style={{
          margin: 0,
          marginTop: responsiveSpacing(viewport.width, 16, 24),
          marginBottom: responsiveSpacing(viewport.width, 40, 60),
          fontSize: subtitleSize,
          fontWeight: 400,
          color: toRgbString(colors.textSecondary),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
          maxWidth: 500,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        I'm always open to discussing new opportunities, collaborations, or just having a chat.
      </p>

      {/* Contact icons */}
      <div
        style={{
          display: 'flex',
          gap: responsiveSpacing(viewport.width, 32, 48),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {contactLinks.map((link, index) => {
          // Staggered entrance for each icon
          const iconFrame = Math.max(0, entranceFrame - 20 - index * 15);
          const iconEntrance = spring({
            frame: iconFrame,
            fps: FPS,
            config: { damping: 14, stiffness: 100 },
          });

          const iconOpacity = interpolate(iconEntrance, [0, 1], [0, 1]);
          const iconScale = interpolate(iconEntrance, [0, 1], [0.7, 1]);

          // Draw progress for line animation
          const drawProgress = interpolate(
            sectionProgress,
            [0.2 + index * 0.1, 0.5 + index * 0.1],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const IconComponent = {
            linkedin: LinkedInIcon,
            github: GitHubIcon,
            email: EmailIcon,
          }[link.icon];

          return (
            <a
              key={link.icon}
              href={link.url}
              target={link.icon !== 'email' ? '_blank' : undefined}
              rel={link.icon !== 'email' ? 'noopener noreferrer' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                textDecoration: 'none',
                opacity: iconOpacity,
                transform: `scale(${iconScale})`,
              }}
            >
              <div
                style={{
                  width: iconSize + 24,
                  height: iconSize + 24,
                  borderRadius: 16,
                  backgroundColor: toRgbaString(colors.cardBackground, 0.5),
                  border: `1px solid ${toRgbaString(colors.cardBorder, 0.4)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComponent
                  size={iconSize}
                  color={toRgbString(colors.accent)}
                  progress={drawProgress}
                />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: toRgbString(colors.textSecondary),
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {link.name}
              </span>
            </a>
          );
        })}
      </div>

      {/* Footer */}
      <p
        style={{
          position: 'absolute',
          bottom: responsiveSpacing(viewport.width, 20, 40),
          margin: 0,
          fontSize: 12,
          color: toRgbString(colors.textMuted),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: subtitleOpacity * 0.7,
        }}
      >
        Built with React + Remotion animations
      </p>
    </div>
  );
}
