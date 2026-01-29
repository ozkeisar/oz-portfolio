import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString, toRgbaString } from '../../utils/colors';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { GitHubIcon } from '../icons/GitHubIcon';
import { EmailIcon } from '../icons/EmailIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

// Typewriter text component using Framer Motion
function TypewriterText({
  text,
  delay = 0,
  isInView,
}: {
  text: string;
  delay?: number;
  isInView: boolean;
}) {
  const characters = text.split('');

  return (
    <motion.span
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.002,
            delayChildren: delay,
          },
        },
      }}
      style={{ display: 'inline' }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.01 }}
          style={{ display: 'inline' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Contact method data
const contactMethods = [
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

// Calculate delay based on text length
const getTextDelay = (text: string) => text.length * 0.002;

export function HomeContact() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);
  const invitationSize = responsiveFontSize(viewport.width, 18, 28);
  const cardLabelSize = responsiveFontSize(viewport.width, 12, 14);
  const cardValueSize = responsiveFontSize(viewport.width, 11, 13);
  const iconSize = responsiveFontSize(viewport.width, 28, 36);

  // Animation timing - complete in ~2 seconds
  const headerDelay = 0;
  const invitationDelay = 0.15;
  const invitationText1 = 'Ready to Build Something Great?';
  const invitationText2 = "I'm always open to new opportunities and collaborations";
  const invitation2Delay = invitationDelay + 0.1 + getTextDelay(invitationText1);
  const primaryRowDelay = 0.5;
  const secondaryRowDelay = 0.9;
  const cardStagger = 0.12;

  // Split contacts
  const primaryContacts = contactMethods.slice(0, 3);
  const secondaryContacts = contactMethods.slice(3);

  const cardGap = responsiveSpacing(viewport.width, 12, 20);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="home-section"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        className="home-container-inner"
        style={{
          maxWidth: 700,
          textAlign: 'left',
        }}
      >
        {/* Section number and title with line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.2, delay: headerDelay }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: responsiveSpacing(viewport.width, 24, 32),
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
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            style={{
              flex: 1,
              height: 1,
              backgroundColor: toRgbaString(colors.textSecondary, 0.3),
              marginLeft: 16,
              maxWidth: isTablet ? 120 : 200,
              transformOrigin: 'left',
            }}
          />
        </motion.div>

        {/* Central Invitation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: invitationDelay }}
          style={{
            textAlign: 'center',
            marginBottom: responsiveSpacing(viewport.width, 32, 48),
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
            }}
          >
            <TypewriterText
              text={invitationText1}
              delay={invitationDelay + 0.1}
              isInView={isInView}
            />
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
            <TypewriterText
              text={invitationText2}
              delay={invitation2Delay}
              isInView={isInView}
            />
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: cardGap,
            width: '100%',
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
              const cardDelay = primaryRowDelay + index * cardStagger;
              const IconComponent = contact.icon;

              return (
                <motion.a
                  key={contact.type}
                  href={contact.href}
                  target={contact.type !== 'email' && contact.type !== 'phone' ? '_blank' : undefined}
                  rel={contact.type !== 'email' && contact.type !== 'phone' ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: cardDelay }}
                  whileHover={{ scale: 1.02, borderColor: toRgbaString(colors.accent, 0.4) }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: isMobile ? undefined : 1,
                    width: isMobile ? '100%' : undefined,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                    padding: responsiveSpacing(viewport.width, 16, 20),
                    backgroundColor: toRgbaString(colors.textSecondary, 0.05),
                    borderRadius: 12,
                    border: `1px solid ${toRgbaString(colors.accent, 0.2)}`,
                    textDecoration: 'none',
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
                      progress={1}
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
                </motion.a>
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
              const cardDelay = secondaryRowDelay + index * cardStagger;
              const IconComponent = contact.icon;

              return (
                <motion.a
                  key={contact.type}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: cardDelay }}
                  whileHover={{ scale: 1.02, borderColor: toRgbaString(colors.accent, 0.4) }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: isMobile ? '100%' : 180,
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    alignItems: 'center',
                    gap: isMobile ? 16 : 12,
                    padding: responsiveSpacing(viewport.width, 16, 20),
                    backgroundColor: toRgbaString(colors.textSecondary, 0.05),
                    borderRadius: 12,
                    border: `1px solid ${toRgbaString(colors.accent, 0.2)}`,
                    textDecoration: 'none',
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
                      progress={1}
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
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 1.5 }}
          style={{
            margin: 0,
            marginTop: responsiveSpacing(viewport.width, 48, 64),
            textAlign: 'center',
            fontSize: 12,
            color: toRgbString(colors.textMuted),
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Built with React + Framer Motion
        </motion.p>
      </motion.div>
    </section>
  );
}
