import { useCallback, useEffect, useState } from 'react';
import { interpolate } from '../utils/animation';

/**
 * Viewport dimensions and responsive utilities
 */
type ViewportData = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

/**
 * Hook that provides viewport dimensions and responsive utilities
 */
export function useViewport(): ViewportData {
  const [viewport, setViewport] = useState<ViewportData>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1200,
        height: 800,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width,
      height,
      isMobile: width < 640,
      isTablet: width >= 640 && width < 1024,
      isDesktop: width >= 1024,
    };
  });

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setViewport({
      width,
      height,
      isMobile: width < 640,
      isTablet: width >= 640 && width < 1024,
      isDesktop: width >= 1024,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return viewport;
}

/**
 * Responsive value interpolation
 * Smoothly scales a value based on viewport width
 */
export function responsiveValue(
  viewportWidth: number,
  mobileValue: number,
  desktopValue: number,
  mobileBreakpoint = 320,
  desktopBreakpoint = 1200
): number {
  return interpolate(
    viewportWidth,
    [mobileBreakpoint, desktopBreakpoint],
    [mobileValue, desktopValue],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
}

/**
 * Get font size based on viewport
 */
export function responsiveFontSize(
  viewportWidth: number,
  mobilePx: number,
  desktopPx: number
): number {
  return responsiveValue(viewportWidth, mobilePx, desktopPx);
}

/**
 * Get spacing value based on viewport
 */
export function responsiveSpacing(
  viewportWidth: number,
  mobilePx: number,
  desktopPx: number
): number {
  return responsiveValue(viewportWidth, mobilePx, desktopPx);
}
