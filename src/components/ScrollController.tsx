import { createContext, type ReactNode, useContext, useEffect } from 'react';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';
import { useScrollFrame } from '../hooks/useScrollFrame';
import { useViewport } from '../hooks/useViewport';

/**
 * Frame configuration for each section
 * Total: 900 frames
 */
export const FRAME_CONFIG = {
  hero: { start: 0, end: 100 },
  summary: { start: 100, end: 250 },
  experience: { start: 250, end: 500 },
  impact: { start: 500, end: 650 },
  skills: { start: 650, end: 800 },
  contact: { start: 800, end: 900 },
} as const;

export const TOTAL_FRAMES = 900;
export const FPS = 30; // Virtual FPS for spring calculations
export const ENTRANCE_DURATION_FRAMES = 110; // ~3.7 seconds at 30fps

type ScrollContextValue = {
  frame: number;
  totalFrames: number;
  progress: number;
  fps: number;
  entranceFrame: number;
  isEntranceComplete: boolean;
  viewport: {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  };
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

/**
 * Provider component that supplies frame and viewport data
 */
export function ScrollController({ children }: { children: ReactNode }) {
  const { frame, totalFrames, progress } = useScrollFrame({
    totalFrames: TOTAL_FRAMES,
  });
  const viewport = useViewport();

  // Entrance animation - plays on load
  const { entranceFrame, isEntranceComplete } = useEntranceAnimation({
    durationFrames: ENTRANCE_DURATION_FRAMES,
    fps: FPS,
  });

  // Block scrolling during entrance animation
  useEffect(() => {
    if (!isEntranceComplete) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      // Ensure we're at top
      window.scrollTo(0, 0);
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isEntranceComplete]);

  return (
    <ScrollContext.Provider
      value={{
        frame,
        totalFrames,
        progress,
        fps: FPS,
        entranceFrame,
        isEntranceComplete,
        viewport,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

/**
 * Hook to access scroll/frame context
 */
export function useScrollContext(): ScrollContextValue {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollController');
  }
  return context;
}

/**
 * Get local progress for a specific section (0-1)
 */
export function getSectionProgress(frame: number, section: keyof typeof FRAME_CONFIG): number {
  const { start, end } = FRAME_CONFIG[section];
  if (frame < start) return 0;
  if (frame > end) return 1;
  return (frame - start) / (end - start);
}

/**
 * Check if frame is within section range
 */
export function isSectionVisible(
  frame: number,
  section: keyof typeof FRAME_CONFIG,
  buffer = 20
): boolean {
  const { start, end } = FRAME_CONFIG[section];
  return frame >= start - buffer && frame <= end + buffer;
}
