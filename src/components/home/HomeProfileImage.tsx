import { motion } from 'framer-motion';
import { useHeroOPosition } from '../../context/HeroOPositionContext';
import ozPhoto from '../../assets/oz-photo.webp';

// Header icon position (fixed values)
const HEADER_PADDING = 16;
const HEADER_ICON_SIZE = 40;

type HomeProfileImageProps = {
  phase: 'entrance' | 'content';
  heroInView: boolean;
};

export function HomeProfileImage({ phase, heroInView }: HomeProfileImageProps) {
  const { oPosition } = useHeroOPosition();

  // Don't render until we have the O position
  if (!oPosition) return null;

  // During entrance: position in the O
  // After entrance with hero in view: position in the O
  // After scrolling past hero: transition to header icon position
  const inHeroPosition = phase === 'entrance' || heroInView;

  // Calculate positions
  const heroX = oPosition.x;
  const heroY = oPosition.y;
  const heroSize = Math.min(oPosition.width, oPosition.height) * 0.85;

  // Header icon position (top-left with padding)
  const headerX = HEADER_PADDING + HEADER_ICON_SIZE / 2;
  const headerY = HEADER_PADDING + HEADER_ICON_SIZE / 2;

  // Current target position
  const targetX = inHeroPosition ? heroX : headerX;
  const targetY = inHeroPosition ? heroY : headerY;
  const targetSize = inHeroPosition ? heroSize : HEADER_ICON_SIZE;

  // Opacity: visible during entrance and when hero is in view, or when header is visible
  const opacity = phase === 'entrance'
    ? 1
    : (heroInView ? 1 : 1); // Always visible, just transitions position

  // Border padding for the white outline
  const borderPadding = inHeroPosition ? 3 : 2;

  return (
    <motion.div
      style={{
        position: 'fixed',
        zIndex: inHeroPosition ? 101 : 51, // Above entrance during entrance, below header otherwise
        pointerEvents: 'none',
        borderRadius: '50%',
        backgroundColor: 'white', // White border
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      initial={false}
      animate={{
        left: targetX,
        top: targetY,
        width: targetSize + borderPadding * 2,
        height: targetSize + borderPadding * 2,
        x: '-50%',
        y: '-50%',
        opacity,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
        mass: 1,
      }}
    >
      <img
        src={ozPhoto}
        alt="Oz Keisar"
        style={{
          width: targetSize,
          height: targetSize,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    </motion.div>
  );
}
