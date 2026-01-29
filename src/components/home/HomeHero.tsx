import { motion } from 'framer-motion';
import { useViewport, responsiveValue, responsiveSpacing, responsiveFontSize } from '../../hooks/useViewport';
import { colors, toRgbString } from '../../utils/colors';
import { OzKeisarText } from '../text/OzKeisarText';
import { fadeInUp, staggerContainer, viewportConfig } from '../../lib/animations';

export function HomeHero() {
  const viewport = useViewport();

  const titleWidth = responsiveValue(viewport.width, 280, 600, 320, 1200);
  const padding = responsiveSpacing(viewport.width, 20, 40);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding,
        paddingTop: `calc(${padding}px + env(safe-area-inset-top, 0px))`,
        paddingBottom: `calc(${padding}px + env(safe-area-inset-bottom, 0px))`,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Main title - SVG (fully drawn) */}
        <motion.div variants={fadeInUp}>
          <OzKeisarText
            progress={1}
            color={toRgbString(colors.textPrimary)}
            width={titleWidth}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          style={{
            margin: 0,
            marginTop: responsiveSpacing(viewport.width, 16, 24),
            fontSize: responsiveFontSize(viewport.width, 16, 22),
            fontWeight: 400,
            color: toRgbString(colors.textSecondary),
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '0.5px',
            textAlign: 'center',
          }}
        >
          Engineering Manager & AI Innovation Lead
        </motion.p>

        {/* Accent line */}
        <motion.div
          variants={fadeInUp}
          style={{
            marginTop: responsiveSpacing(viewport.width, 24, 40),
            width: 80,
            height: 3,
            backgroundColor: toRgbString(colors.accent),
            borderRadius: 2,
          }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: `calc(${responsiveSpacing(viewport.width, 40, 60)}px + env(safe-area-inset-bottom, 0px))`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          style={{
            fontSize: 14,
            color: toRgbString(colors.textMuted),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Scroll to explore
        </motion.span>
        <motion.svg
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={toRgbString(colors.textMuted)}
          strokeWidth="2"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
