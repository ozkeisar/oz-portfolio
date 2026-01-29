import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { useHeroOPosition } from '../../context/HeroOPositionContext';
import {
  responsiveFontSize,
  responsiveSpacing,
  responsiveValue,
  useViewport,
} from '../../hooks/useViewport';
import { colors, toRgbString } from '../../utils/colors';
import { OzKeisarText } from '../text/OzKeisarText';

// "O" letter position constants in viewBox coordinates (0 0 320 70)
// Must match the O path in OzKeisarText: "M8 35 C8 18, 22 6, 35 6 C48 6, 62 18, 62 35..."
// O goes from (8,6) to (62,64), so center is (35, 35)
const O_VIEWBOX_CENTER_X = 35;
const O_VIEWBOX_CENTER_Y = 35;
const O_VIEWBOX_WIDTH = 54; // 62 - 8
const O_VIEWBOX_HEIGHT = 58; // 64 - 6
const VIEWBOX_WIDTH = 320;
const VIEWBOX_HEIGHT = 70;

export function HomeHero() {
  const viewport = useViewport();
  const { setOPosition } = useHeroOPosition();
  const svgRef = useRef<SVGSVGElement>(null);

  const titleWidth = responsiveValue(viewport.width, 280, 600, 320, 1200);
  const padding = responsiveSpacing(viewport.width, 20, 40);

  // Measure and report the "O" position whenever the SVG is rendered
  const measureOPosition = useCallback(() => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();

    // Convert viewBox coordinates to screen coordinates
    const scaleX = svgRect.width / VIEWBOX_WIDTH;
    const scaleY = svgRect.height / VIEWBOX_HEIGHT;

    // Calculate "O" center in screen coordinates
    const oCenterX = svgRect.left + O_VIEWBOX_CENTER_X * scaleX;
    const oCenterY = svgRect.top + O_VIEWBOX_CENTER_Y * scaleY;
    const oWidth = O_VIEWBOX_WIDTH * scaleX;
    const oHeight = O_VIEWBOX_HEIGHT * scaleY;

    setOPosition({
      x: oCenterX,
      y: oCenterY,
      width: oWidth,
      height: oHeight,
    });
  }, [setOPosition]);

  // Measure position after render and on resize
  useEffect(() => {
    // Initial measurement (with small delay to ensure layout is complete)
    const initialTimer = setTimeout(measureOPosition, 50);

    // Re-measure on resize
    window.addEventListener('resize', measureOPosition);

    // Also use ResizeObserver for more accurate tracking
    let resizeObserver: ResizeObserver | null = null;
    if (svgRef.current) {
      resizeObserver = new ResizeObserver(measureOPosition);
      resizeObserver.observe(svgRef.current);
    }

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener('resize', measureOPosition);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [measureOPosition, viewport.width, viewport.height]);

  return (
    <section
      id="hero"
      style={{
        height: viewport.height,
        minHeight: viewport.height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: `calc(${padding}px + env(safe-area-inset-left, 0px))`,
        paddingRight: `calc(${padding}px + env(safe-area-inset-right, 0px))`,
        paddingTop: `calc(${padding}px + env(safe-area-inset-top, 0px))`,
        paddingBottom: `calc(${padding}px + env(safe-area-inset-bottom, 0px))`,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Main title - SVG (fully drawn) */}
        <OzKeisarText
          ref={svgRef}
          progress={1}
          color={toRgbString(colors.textPrimary)}
          width={titleWidth}
        />

        {/* Subtitle */}
        <p
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
        </p>

        {/* Accent line */}
        <div
          style={{
            marginTop: responsiveSpacing(viewport.width, 24, 40),
            width: 80,
            height: 3,
            backgroundColor: toRgbString(colors.accent),
            borderRadius: 2,
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div
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
      </div>
    </section>
  );
}
