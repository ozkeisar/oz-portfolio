import { motion } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString } from '../../utils/colors';
import { fadeInUp, scaleIn, staggerContainer, viewportConfig } from '../../lib/animations';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { GitHubIcon } from '../icons/GitHubIcon';
import { EmailIcon } from '../icons/EmailIcon';

const contactLinks = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ozkeisar/',
    icon: LinkedInIcon,
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/ozkeisar',
    icon: GitHubIcon,
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:oz.keisar@gmail.com',
    icon: EmailIcon,
  },
];

export function HomeContact() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;

  return (
    <section
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
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        style={{
          textAlign: 'center',
          maxWidth: 600,
        }}
      >
        {/* Section header */}
        <motion.div
          variants={fadeInUp}
          style={{
            marginBottom: responsiveSpacing(viewport.width, 32, 48),
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 600,
              color: toRgbString(colors.accent),
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 16,
            }}
          >
            Get in Touch
          </span>
          <h2
            style={{
              margin: 0,
              marginBottom: 16,
              fontSize: responsiveFontSize(viewport.width, 28, 42),
              fontWeight: 700,
              color: toRgbString(colors.textPrimary),
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              lineHeight: 1.2,
            }}
          >
            Let's Connect
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: responsiveFontSize(viewport.width, 16, 18),
              color: toRgbString(colors.textSecondary),
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: 1.6,
            }}
          >
            I'm always interested in discussing new opportunities, innovative projects, or ways to collaborate on impactful work.
          </p>
        </motion.div>

        {/* Contact links */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: responsiveSpacing(viewport.width, 16, 24),
            flexWrap: 'wrap',
          }}
        >
          {contactLinks.map((link) => (
            <motion.a
              key={link.id}
              variants={scaleIn}
              href={link.href}
              target={link.id !== 'email' ? '_blank' : undefined}
              rel={link.id !== 'email' ? 'noopener noreferrer' : undefined}
              className="home-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: responsiveSpacing(viewport.width, 20, 28),
                minWidth: isMobile ? 100 : 120,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <link.icon
                size={32}
                color={toRgbString(colors.accent)}
                progress={1}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: toRgbString(colors.textPrimary),
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {link.label}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          variants={fadeInUp}
          style={{
            marginTop: responsiveSpacing(viewport.width, 60, 80),
            paddingTop: 32,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: toRgbString(colors.textMuted),
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            © {new Date().getFullYear()} Oz Keisar. Built with React & Framer Motion.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
