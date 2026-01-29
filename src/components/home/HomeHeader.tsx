import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HomeHeaderProps = {
  visible: boolean;
};

export function HomeHeader({ visible }: HomeHeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Hide/show header based on scroll direction
  useEffect(() => {
    if (!visible) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const pastThreshold = currentScrollY > 80;

      if (scrollingDown && pastThreshold) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: isHidden ? -100 : 0,
            opacity: isHidden ? 0 : 1
          }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            paddingLeft: 'calc(16px + 40px + 16px)', // Space for profile image
            background: 'rgba(10, 22, 40, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Name */}
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'white',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Oz Keisar
          </span>

          {/* Navigation links */}
          <nav
            style={{
              display: 'flex',
              gap: 24,
            }}
          >
            {['Summary', 'Experience', 'Impact', 'Skills', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
