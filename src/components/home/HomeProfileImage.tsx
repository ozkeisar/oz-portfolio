import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHeroOPosition } from '../../context/HeroOPositionContext';
import { colors, toRgbString } from '../../utils/colors';
import ozPhoto from '../../assets/oz-photo.webp';

// Header icon position (fixed values)
const HEADER_PADDING = 16;
const HEADER_ICON_SIZE = 40;

type HomeProfileImageProps = {
  phase: 'entrance' | 'content';
  isAtTop: boolean;
  visible: boolean;
};

export function HomeProfileImage({ phase, isAtTop, visible }: HomeProfileImageProps) {
  const { oPosition } = useHeroOPosition();
  const [safeAreaTop, setSafeAreaTop] = useState(0);

  // Get safe area inset for header positioning
  useEffect(() => {
    const updateSafeArea = () => {
      // Get the computed safe area inset
      const safeArea = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0',
        10
      );
      // Fallback: try to get from env() by measuring a test element
      if (safeArea === 0) {
        const testEl = document.createElement('div');
        testEl.style.paddingTop = 'env(safe-area-inset-top, 0px)';
        document.body.appendChild(testEl);
        const computed = getComputedStyle(testEl).paddingTop;
        setSafeAreaTop(parseInt(computed, 10) || 0);
        document.body.removeChild(testEl);
      } else {
        setSafeAreaTop(safeArea);
      }
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  // Don't render until we have the O position and should be visible
  if (!oPosition || !visible) return null;

  // During entrance: position in the O
  // After entrance and at top: position in the O
  // After ANY scroll: transition to header icon position
  const inHeroPosition = phase === 'entrance' || isAtTop;

  // Calculate positions - use actual O dimensions for oval shape
  const heroX = oPosition.x;
  const heroY = oPosition.y;
  // Use O dimensions directly (creates the oval/egg shape)
  const heroWidth = oPosition.width;
  const heroHeight = oPosition.height;

  // Header icon position (top-left with padding, accounting for safe area)
  const headerX = HEADER_PADDING + HEADER_ICON_SIZE / 2;
  const headerY = HEADER_PADDING + HEADER_ICON_SIZE / 2 + safeAreaTop;

  // Current target position and dimensions
  // In hero: oval shape (width ≠ height)
  // In header: circle shape (width = height)
  const targetX = inHeroPosition ? heroX : headerX;
  const targetY = inHeroPosition ? heroY : headerY;
  const targetWidth = inHeroPosition ? heroWidth : HEADER_ICON_SIZE;
  const targetHeight = inHeroPosition ? heroHeight : HEADER_ICON_SIZE;

  // Border padding (grows during transition, matches original)
  const borderPadding = inHeroPosition ? 3 : 2;

  // Shadow opacity (subtle in hero, more visible in header)
  const shadowOpacity = inHeroPosition ? 0.1 : 0.25;

  return (
    <motion.div
      style={{
        position: 'fixed',
        zIndex: inHeroPosition ? 101 : 51,
        pointerEvents: 'none',
        backgroundColor: toRgbString(colors.textPrimary), // White border
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // GPU acceleration - prevents jitter on first animation
        willChange: 'transform, width, height, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
      initial={{
        opacity: 0,
        scale: 0.8,
        // Use targetX/targetY to ensure initial matches animate exactly
        left: targetX,
        top: targetY,
        width: targetWidth + borderPadding * 2,
        height: targetHeight + borderPadding * 2,
        x: '-50%',
        y: '-50%',
        borderRadius: '50%',
        boxShadow: `0 10px 40px rgba(0, 0, 0, ${shadowOpacity})`,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        left: targetX,
        top: targetY,
        width: targetWidth + borderPadding * 2,
        height: targetHeight + borderPadding * 2,
        borderRadius: '50%',
        x: '-50%',
        y: '-50%',
        boxShadow: `0 10px 40px rgba(0, 0, 0, ${shadowOpacity})`,
      }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 40,
        mass: 1,
        // Fade in quickly, position animates with normal spring
        opacity: { duration: 0.3 },
        scale: { type: 'spring', damping: 14, stiffness: 100 },
      }}
    >
      <motion.img
        src={ozPhoto}
        alt="Oz Keisar"
        style={{
          objectFit: 'cover',
          // GPU acceleration for image
          willChange: 'transform, width, height',
          backfaceVisibility: 'hidden',
        }}
        initial={false}
        animate={{
          width: targetWidth,
          height: targetHeight,
          borderRadius: '50%',
        }}
        transition={{
          type: 'spring',
          damping: 18,
          stiffness: 40,
          mass: 1,
        }}
      />
    </motion.div>
  );
}
