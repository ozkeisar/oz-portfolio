import { useCallback, useEffect, useRef, useState } from 'react';
import { useHeroOPosition } from '../../context/HeroOPositionContext';
import {
  responsiveFontSize,
  responsiveSpacing,
  responsiveValue,
  useViewport,
} from '../../hooks/useViewport';
import { interpolate, spring } from '../../utils/animation';
import { colors, toRgbString } from '../../utils/colors';
import { OzKeisarText } from '../text/OzKeisarText';

// Animation timing constants (at 30fps)
const FPS = 30;
const TITLE_DRAW_END = 90;
const SUBTITLE_START = 75;
const ACCENT_LINE_START = 85;
const TOTAL_DURATION_FRAMES = 110;

// "O" letter center position in viewBox coordinates (0 0 320 70)
const O_VIEWBOX_CENTER_X = 35;
const O_VIEWBOX_CENTER_Y = 35;
const O_VIEWBOX_WIDTH = 54;
const O_VIEWBOX_HEIGHT = 58;
const VIEWBOX_WIDTH = 320;
const VIEWBOX_HEIGHT = 70;

type HomeEntranceProps = {
  onComplete: () => void;
};

export function HomeEntrance({ onComplete }: HomeEntranceProps) {
  const [frame, setFrame] = useState(0);
  const { setOPosition } = useHeroOPosition();
  const svgRef = useRef<SVGSVGElement>(null);
  const viewport = useViewport();
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Measure and report the "O" position
  const measureOPosition = useCallback(() => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / VIEWBOX_WIDTH;
    const scaleY = svgRect.height / VIEWBOX_HEIGHT;

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

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const currentFrame = Math.floor((elapsed / 1000) * FPS);

      if (currentFrame >= TOTAL_DURATION_FRAMES) {
        setFrame(TOTAL_DURATION_FRAMES);
        onComplete();
        return;
      }

      setFrame(currentFrame);
      measureOPosition();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onComplete, measureOPosition]);

  // Also measure on resize
  useEffect(() => {
    const handleResize = () => measureOPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureOPosition]);

  // Calculate animation values
  const titleDrawProgress = interpolate(frame, [0, TITLE_DRAW_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleProgress = spring({
    frame: frame - SUBTITLE_START,
    fps: FPS,
    config: { damping: 14, stiffness: 100 },
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [20, 0]);

  const accentLineProgress = spring({
    frame: frame - ACCENT_LINE_START,
    fps: FPS,
    config: { damping: 14, stiffness: 120 },
  });
  const accentLineWidth = interpolate(accentLineProgress, [0, 1], [0, 80]);
  const accentLineOpacity = interpolate(accentLineProgress, [0, 1], [0, 1]);

  // Responsive sizes
  const titleWidth = responsiveValue(viewport.width, 280, 600, 320, 1200);
  const padding = responsiveSpacing(viewport.width, 20, 40);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a1628',
        paddingLeft: `calc(${padding}px + env(safe-area-inset-left, 0px))`,
        paddingRight: `calc(${padding}px + env(safe-area-inset-right, 0px))`,
        paddingTop: `calc(${padding}px + env(safe-area-inset-top, 0px))`,
        paddingBottom: `calc(${padding}px + env(safe-area-inset-bottom, 0px))`,
        boxSizing: 'border-box',
      }}
    >
      {/* Main title - SVG with handwriting animation */}
      <OzKeisarText
        ref={svgRef}
        progress={titleDrawProgress}
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
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        Engineering Manager & AI Innovation Lead
      </p>

      {/* Accent line */}
      <div
        style={{
          marginTop: responsiveSpacing(viewport.width, 24, 40),
          width: accentLineWidth,
          height: 3,
          backgroundColor: toRgbString(colors.accent),
          borderRadius: 2,
          opacity: accentLineOpacity,
        }}
      />
    </div>
  );
}
