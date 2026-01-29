import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, toRgbString } from '../../utils/colors';
import { UserIcon } from '../icons/UserIcon';
import { BriefcaseIcon } from '../icons/BriefcaseIcon';
import { ChartIcon } from '../icons/ChartIcon';
import { BoltIcon } from '../icons/BoltIcon';
import { EmailIcon } from '../icons/EmailIcon';

type HomeHeaderProps = {
  visible: boolean;
};

type IconProps = {
  size: number;
  color: string;
  progress: number;
};

// Navigation items with icons
const navItems: { id: string; label: string; icon: ComponentType<IconProps> }[] = [
  { id: 'summary', label: 'Summary', icon: UserIcon },
  { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
  { id: 'impact', label: 'Impact', icon: ChartIcon },
  { id: 'skills', label: 'Skills', icon: BoltIcon },
  { id: 'contact', label: 'Contact', icon: EmailIcon },
];

// Hamburger icon component
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      style={{
        width: 20,
        height: 14,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <motion.span
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 6 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'block',
          width: '100%',
          height: 2,
          backgroundColor: toRgbString(colors.textPrimary),
          borderRadius: 1,
          transformOrigin: 'center',
        }}
      />
      <motion.span
        animate={{
          opacity: isOpen ? 0 : 1,
          scaleX: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'block',
          width: '100%',
          height: 2,
          backgroundColor: toRgbString(colors.textPrimary),
          borderRadius: 1,
        }}
      />
      <motion.span
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -6 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'block',
          width: '100%',
          height: 2,
          backgroundColor: toRgbString(colors.textPrimary),
          borderRadius: 1,
          transformOrigin: 'center',
        }}
      />
    </div>
  );
}

export function HomeHeader({ visible }: HomeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when scrolling
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleScroll = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* Hamburger button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2, delay: 0 } }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
              delay: 0.55, // Sync with profile image spring animation settling
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 60,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <HamburgerIcon isOpen={isMenuOpen} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal overlay and menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 55,
                background: 'rgba(10, 22, 40, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            />

            {/* Menu modal container - centered with flex */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <motion.nav
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: 16,
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  minWidth: 200,
                  pointerEvents: 'auto',
                }}
              >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 20px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: 16,
                    fontWeight: 500,
                    color: toRgbString(colors.textPrimary),
                    textAlign: 'left',
                    transition: 'background 0.2s ease',
                  }}
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={20} color={toRgbString(colors.textSecondary)} progress={1} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
              </motion.nav>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
