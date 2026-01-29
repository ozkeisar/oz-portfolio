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
};

export function HomeProfileImage({ phase, isAtTop }: HomeProfileImageProps) {
  const { oPosition } = useHeroOPosition();

  // Don't render until we have the O position
  if (!oPosition) return null;

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

  // Header icon position (top-left with padding)
  const headerX = HEADER_PADDING + HEADER_ICON_SIZE / 2;
  const headerY = HEADER_PADDING + HEADER_ICON_SIZE / 2;

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
      }}
      initial={false}
      animate={{
        left: targetX,
        top: targetY,
        width: targetWidth + borderPadding * 2,
        height: targetHeight + borderPadding * 2,
        borderRadius: '50%', // 50% makes oval when width ≠ height, circle when equal
        x: '-50%',
        y: '-50%',
        boxShadow: `0 10px 40px rgba(0, 0, 0, ${shadowOpacity})`,
      }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 40, // Slow, smooth spring to match original wrap transition
        mass: 1,
      }}
    >
      <motion.img
        src={ozPhoto}
        alt="Oz Keisar"
        style={{
          objectFit: 'cover',
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
