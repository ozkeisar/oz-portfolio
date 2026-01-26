import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration for scroll-to-frame mapping
 */
type UseScrollFrameConfig = {
  totalFrames: number; // Total number of frames (default: 900)
  scrollMultiplier?: number; // How many pixels per frame (default: 3)
};

/**
 * Hook that converts scroll position to frame number
 * Enables bidirectional scroll-driven animations
 */
export function useScrollFrame(config: UseScrollFrameConfig = { totalFrames: 900 }) {
  const { totalFrames, scrollMultiplier = 3 } = config;
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Calculate total scroll height needed
  const totalScrollHeight = totalFrames * scrollMultiplier;

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const maxScroll = totalScrollHeight - window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
      const newFrame = Math.round(scrollProgress * totalFrames);

      if (newFrame !== frameRef.current) {
        frameRef.current = newFrame;
        setFrame(newFrame);
      }
    });
  }, [totalFrames, totalScrollHeight]);

  useEffect(() => {
    // Passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return {
    frame,
    totalFrames,
    totalScrollHeight,
    progress: frame / totalFrames,
  };
}

/**
 * Get section progress based on current frame and section's frame range
 * Returns 0-1 progress within the section
 */
export function getSectionProgress(frame: number, startFrame: number, endFrame: number): number {
  if (frame < startFrame) return 0;
  if (frame > endFrame) return 1;
  return (frame - startFrame) / (endFrame - startFrame);
}

/**
 * Check if a section is active (visible)
 */
export function isSectionActive(frame: number, startFrame: number, endFrame: number): boolean {
  return frame >= startFrame && frame <= endFrame;
}
