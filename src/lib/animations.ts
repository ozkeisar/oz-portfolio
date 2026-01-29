/**
 * Framer Motion animation presets
 * Inspired by addit_web animation system
 */

import type { Variants, Transition } from 'framer-motion';

// Default transition config
const defaultTransition: Transition = {
  duration: 0.6,
  ease: 'easeOut',
};

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Fade in from top
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Simple fade in
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// Scale in
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Stagger container for children animations
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Slower stagger container
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Float animation for decorative elements
export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

// Viewport configuration for scroll-triggered animations
export const viewportConfig = {
  once: true,
  margin: '-100px',
};

// Card hover effect
export const cardHover = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

// Card tap effect
export const cardTap = {
  scale: 0.98,
};

// Counter animation helper - creates variants for number counting
export function createCounterVariants(duration = 2): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration },
    },
  };
}
