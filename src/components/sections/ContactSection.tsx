import { FPS } from '../../config/sections';
import { useAnimationContext, useSectionVisibility } from '../../context/AnimationContext';
import { responsiveFontSize, responsiveSpacing, responsiveValue } from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';
import { EmailIcon } from '../icons/EmailIcon';
import { GitHubIcon } from '../icons/GitHubIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

// Contact method data type
type ContactMethod = {
  type: 'email' | 'phone' | 'whatsapp' | 'linkedin' | 'github';
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ size: number; color: string; progress: number }>;
};

// Contact methods data
const contactMethods: ContactMethod[] = [
  {
    type: 'email',
    label: 'Email',
    value: 'ozkeisar@gmail.com',
    href: 'mailto:ozkeisar@gmail.com',
    icon: EmailIcon,
  },
  {
    type: 'phone',
    label: 'Phone',
    value: '058-599-90055',
    href: 'tel:+972585990055',
    icon: PhoneIcon,
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    value: 'Message me',
    href: 'https://wa.me/972585990055',
    icon: WhatsAppIcon,
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    value: '/in/oz-keisar',
    href: 'https://linkedin.com/in/oz-keisar',
    icon: LinkedInIcon,
  },
  {
    type: 'github',
    label: 'GitHub',
    value: '/ozkeisar',
    href: 'https://github.com/ozkeisar',
    icon: GitHubIcon,
  },
];

// Animation timing constants
const CONTACT_ENTER_DURATION = 180; // Full animation (~6 seconds)
const CONTACT_FAST_ENTER_DURATION = 75; // Fast enter from Skills
const CONTACT_REVERSE_DURATION = 15; // Exit animation (500ms at 30fps) - reverse of entrance
const CONTACT_ENTER_DELAY = 15; // Wait for Skills exit to complete (500ms at 30fps)

// Wrap transition timing
const WRAP_EXIT_DURATION = 45; // Exit animation for wrap to hero (1.5 seconds)
const WRAP_ENTRANCE_DELAY = 15; // Wait for hero to start exiting
const WRAP_ENTRANCE_DURATION = 45; // Entrance from hero wrap (1.5 seconds)

export function ContactSection() {
  const { sequenceFrame, direction, viewport } = useAnimationContext();
  const { isVisible, isExiting, isReversing, isEntering, isEnteringBackward, isEnteringFromWrap, isExitingToWrap } =
    useSectionVisibility('contact');

  // Wrap transition states
  const isExitingToHeroWrap = isExitingToWrap && direction === 'forward';
  const isEnteringFromHeroWrap = isEnteringFromWrap && direction === 'backward';

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Calculate effectiveFrame for bidirectional animations
  const isExitingForward = isExiting && direction === 'forward' && !isExitingToHeroWrap;
  let effectiveFrame: number;

  if (isExitingToHeroWrap) {
    // Exiting forward via wrap to hero - animated exit
    effectiveFrame = Math.max(
      0,
      CONTACT_ENTER_DURATION * (1 - sequenceFrame / WRAP_EXIT_DURATION)
    );
  } else if (isReversing || isExitingForward) {
    // Reverse: 180 → 0
    effectiveFrame = Math.max(
      0,
      CONTACT_ENTER_DURATION * (1 - sequenceFrame / CONTACT_REVERSE_DURATION)
    );
  } else if (isEnteringFromHeroWrap) {
    // Entering from hero via backward wrap
    const delayedFrame = Math.max(0, sequenceFrame - WRAP_ENTRANCE_DELAY);
    effectiveFrame = Math.min(
      CONTACT_ENTER_DURATION,
      CONTACT_ENTER_DURATION * (delayedFrame / WRAP_ENTRANCE_DURATION)
    );
  } else if (isEnteringBackward) {
    // Entering from end (backward from skills)
    effectiveFrame = Math.min(
      CONTACT_ENTER_DURATION,
      CONTACT_ENTER_DURATION * (sequenceFrame / CONTACT_FAST_ENTER_DURATION)
    );
  } else if (isEntering) {
    // Forward enter with delay
    const delayedFrame = Math.max(0, sequenceFrame - CONTACT_ENTER_DELAY);
    effectiveFrame = Math.min(
      CONTACT_ENTER_DURATION,
      CONTACT_ENTER_DURATION * (delayedFrame / CONTACT_FAST_ENTER_DURATION)
    );
  } else {
    // Idle - show full animation
    effectiveFrame = CONTACT_ENTER_DURATION;
  }

  // Responsive breakpoints
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;

  // Responsive values
  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);
  const invitationSize = responsiveFontSize(viewport.width, 18, 28);
  const cardLabelSize = responsiveFontSize(viewport.width, 12, 14);
  const cardValueSize = responsiveFontSize(viewport.width, 11, 13);
  const iconSize = responsiveFontSize(viewport.width, 28, 36);
  const horizontalPadding = responsiveSpacing(viewport.width, 24, 80);
  const verticalPadding = responsiveSpacing(viewport.width, 20, 40);

  // Phase 1: Header reveal (frames 0-30)
  const headerFrame = effectiveFrame;
  const headerProgress = spring({
    frame: headerFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });

  const numberFrame = Math.max(0, headerFrame - 5);
  const numberProgress = spring({
    frame: numberFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });

  const lineProgress = interpolate(effectiveFrame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Central invitation (frames 20-60)
  const invitationFrame = Math.max(0, effectiveFrame - 20);
  const invitationProgress = spring({
    frame: invitationFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });
  const invitationScale = interpolate(invitationProgress, [0, 1], [0.8, 1]);
  const invitationOpacity = interpolate(invitationProgress, [0, 1], [0, 1]);
  const invitationY = interpolate(invitationProgress, [0, 1], [20, 0]);

  // Ambient glow effect using continuous frame counter for pulse
  const glowPulse = Math.sin((effectiveFrame / 30) * Math.PI) * 0.3 + 0.7;

  // Primary contacts (Email, Phone, WhatsApp) start at frame 40
  const primaryContacts = contactMethods.slice(0, 3);
  // Secondary contacts (LinkedIn, GitHub) start at frame 80
  const secondaryContacts = contactMethods.slice(3);

  // Card grid gap
  const cardGap = responsiveSpacing(viewport.width, 12, 20);

  // Container opacity based on entrance
  const containerOpacity = interpolate(headerProgress, [0, 1], [0, 1]);

  // Content max width (matching other sections)
  const contentMaxWidth = responsiveValue(viewport.width, 350, 700, 320, 1200);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
        opacity: containerOpacity,
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          width: '100%',
          maxWidth: contentMaxWidth,
          opacity: interpolate(numberProgress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headerProgress, [0, 1], [20, 0])}px)`,
          marginBottom: responsiveSpacing(viewport.width, 16, 24),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
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
            05.
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
            Let's Connect
          </h2>
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: toRgbaString(colors.textSecondary, 0.3),
              marginLeft: 16,
              maxWidth: isTablet ? 120 : 200,
              transform: `scaleX(${lineProgress})`,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>

      {/* Content wrapper - centers invitation and cards in remaining space */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Image spacer - reserves space for ProfileImageTransition */}
        <div
          style={{
            width: isMobile ? 50 : 70,
            height: isMobile ? 50 : 70,
            marginBottom: responsiveSpacing(viewport.width, 16, 24),
            opacity: invitationOpacity,
            transform: `scale(${invitationScale})`,
          }}
        />

        {/* Central Invitation */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: responsiveSpacing(viewport.width, 32, 50),
            opacity: invitationOpacity,
            transform: `scale(${invitationScale}) translateY(${invitationY}px)`,
          }}
        >
          <p
          style={{
            margin: 0,
            fontSize: invitationSize,
            fontWeight: 500,
            color: toRgbString(colors.textPrimary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: 1.4,
            textShadow: `0 0 ${20 * glowPulse}px ${toRgbaString(colors.accent, 0.3 * glowPulse)}`,
          }}
        >
          Ready to Build Something Great?
        </p>
        <p
          style={{
            margin: 0,
            marginTop: 8,
            fontSize: responsiveFontSize(viewport.width, 14, 16),
            fontWeight: 400,
            color: toRgbString(colors.textSecondary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          I'm always open to new opportunities and collaborations
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: cardGap,
          width: '100%',
          maxWidth: responsiveValue(viewport.width, 320, 700, 320, 1200),
          alignItems: 'center',
        }}
      >
        {/* Primary Row: Email, Phone, WhatsApp */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: cardGap,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {primaryContacts.map((contact, index) => {
            const cardStartFrame = 40 + index * 15;
            const cardFrame = Math.max(0, effectiveFrame - cardStartFrame);
            const cardProgress = spring({
              frame: cardFrame,
              fps: FPS,
              config: { damping: 14, stiffness: 100 },
            });

            const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
            const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
            const cardY = interpolate(cardProgress, [0, 1], [30, 0]);

            // Icon draw progress
            const iconDrawProgress = interpolate(
              effectiveFrame,
              [cardStartFrame + 10, cardStartFrame + 40],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const IconComponent = contact.icon;

            return (
              <a
                key={contact.type}
                href={contact.href}
                target={contact.type !== 'email' && contact.type !== 'phone' ? '_blank' : undefined}
                rel={
                  contact.type !== 'email' && contact.type !== 'phone'
                    ? 'noopener noreferrer'
                    : undefined
                }
                style={{
                  flex: isMobile ? undefined : 1,
                  width: isMobile ? '100%' : undefined,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  padding: responsiveSpacing(viewport.width, 16, 20),
                  backgroundColor: toRgbaString(colors.cardBackground, 0.5),
                  borderRadius: 12,
                  border: `1px solid ${toRgbaString(colors.accent, 0.2 + 0.1 * glowPulse)}`,
                  textDecoration: 'none',
                  opacity: cardOpacity,
                  transform: `scale(${cardScale}) translateY(${cardY}px)`,
                  boxShadow: `0 0 ${15 * glowPulse}px ${toRgbaString(colors.accent, 0.1 * glowPulse)}`,
                }}
              >
                <div
                  style={{
                    width: iconSize + 16,
                    height: iconSize + 16,
                    borderRadius: 10,
                    backgroundColor: toRgbaString(colors.accent, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent
                    size={iconSize}
                    color={toRgbString(colors.accent)}
                    progress={iconDrawProgress}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span
                    style={{
                      fontSize: cardLabelSize,
                      fontWeight: 600,
                      color: toRgbString(colors.textPrimary),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {contact.label}
                  </span>
                  <span
                    style={{
                      fontSize: cardValueSize,
                      fontWeight: 400,
                      color: toRgbString(colors.textSecondary),
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                  >
                    {contact.value}
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Secondary Row: LinkedIn, GitHub */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: cardGap,
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'center',
          }}
        >
          {secondaryContacts.map((contact, index) => {
            const cardStartFrame = 80 + index * 15;
            const cardFrame = Math.max(0, effectiveFrame - cardStartFrame);
            const cardProgress = spring({
              frame: cardFrame,
              fps: FPS,
              config: { damping: 14, stiffness: 100 },
            });

            const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
            const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
            const cardY = interpolate(cardProgress, [0, 1], [30, 0]);

            // Icon draw progress
            const iconDrawProgress = interpolate(
              effectiveFrame,
              [cardStartFrame + 10, cardStartFrame + 40],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const IconComponent = contact.icon;

            return (
              <a
                key={contact.type}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: isMobile ? '100%' : responsiveValue(viewport.width, 140, 200, 140, 1200),
                  display: 'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  alignItems: 'center',
                  gap: isMobile ? 16 : 12,
                  padding: responsiveSpacing(viewport.width, 16, 20),
                  backgroundColor: toRgbaString(colors.cardBackground, 0.5),
                  borderRadius: 12,
                  border: `1px solid ${toRgbaString(colors.accent, 0.2 + 0.1 * glowPulse)}`,
                  textDecoration: 'none',
                  opacity: cardOpacity,
                  transform: `scale(${cardScale}) translateY(${cardY}px)`,
                  boxShadow: `0 0 ${15 * glowPulse}px ${toRgbaString(colors.accent, 0.1 * glowPulse)}`,
                }}
              >
                <div
                  style={{
                    width: iconSize + 16,
                    height: iconSize + 16,
                    borderRadius: 10,
                    backgroundColor: toRgbaString(colors.accent, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent
                    size={iconSize}
                    color={toRgbString(colors.accent)}
                    progress={iconDrawProgress}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: isMobile ? 'flex-start' : 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: cardLabelSize,
                      fontWeight: 600,
                      color: toRgbString(colors.textPrimary),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {contact.label}
                  </span>
                  <span
                    style={{
                      fontSize: cardValueSize,
                      fontWeight: 400,
                      color: toRgbString(colors.textSecondary),
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                  >
                    {contact.value}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      </div>

      {/* Footer */}
      <p
        style={{
          position: 'absolute',
          bottom: responsiveSpacing(viewport.width, 16, 32),
          margin: 0,
          fontSize: 12,
          color: toRgbString(colors.textMuted),
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: interpolate(effectiveFrame, [120, 150], [0, 0.7], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Built with React + Remotion animations
      </p>
    </div>
  );
}
