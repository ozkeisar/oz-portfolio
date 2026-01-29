import { motion } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString } from '../../utils/colors';
import { fadeInUp, staggerContainer, viewportConfig } from '../../lib/animations';

const summaryText = `With 9+ years of full-stack development and engineering leadership experience, I specialize in building high-impact products and teams. Currently leading AI-first development initiatives at Abra, where I've architected solutions for major clients including Leumi Bank, serving 1M+ active users.

My approach combines technical excellence with strategic thinking—whether it's building React Native teams from scratch, creating developer tools that reduce integration issues by 40%, or training the next generation of developers through AI-First bootcamps. I thrive at the intersection of cutting-edge technology and practical business outcomes.`;

export function HomeSummary() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;

  return (
    <section
      id="summary"
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
          maxWidth: 800,
          textAlign: isMobile ? 'left' : 'center',
        }}
      >
        {/* Section label */}
        <motion.span
          variants={fadeInUp}
          style={{
            display: 'inline-block',
            fontSize: 12,
            fontWeight: 600,
            color: toRgbString(colors.accent),
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: responsiveSpacing(viewport.width, 16, 24),
          }}
        >
          About Me
        </motion.span>

        {/* Heading */}
        <motion.h2
          variants={fadeInUp}
          style={{
            margin: 0,
            marginBottom: responsiveSpacing(viewport.width, 24, 32),
            fontSize: responsiveFontSize(viewport.width, 28, 42),
            fontWeight: 700,
            color: toRgbString(colors.textPrimary),
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            lineHeight: 1.2,
          }}
        >
          Building Products & Teams at Scale
        </motion.h2>

        {/* Summary text */}
        <motion.p
          variants={fadeInUp}
          style={{
            margin: 0,
            fontSize: responsiveFontSize(viewport.width, 16, 18),
            color: toRgbString(colors.textSecondary),
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}
        >
          {summaryText}
        </motion.p>
      </motion.div>
    </section>
  );
}
