/**
 * Animation utilities for frame-based interpolation
 * Following the morph pattern from Remotion
 */

type ExtrapolateConfig = {
  extrapolateLeft?: 'clamp' | 'extend';
  extrapolateRight?: 'clamp' | 'extend';
};

/**
 * Interpolate a value from an input range to an output range
 * This is a pure function that maps one range to another
 */
export function interpolate(
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options: ExtrapolateConfig = {}
): number {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  // Handle clamping
  let clampedValue = value;
  if (options.extrapolateLeft === 'clamp' && value < inputMin) {
    clampedValue = inputMin;
  }
  if (options.extrapolateRight === 'clamp' && value > inputMax) {
    clampedValue = inputMax;
  }

  // Linear interpolation
  const progress = (clampedValue - inputMin) / (inputMax - inputMin);
  return outputMin + progress * (outputMax - outputMin);
}

/**
 * Spring physics configuration
 */
type SpringConfig = {
  damping?: number;
  stiffness?: number;
  mass?: number;
};

/**
 * Calculate spring animation progress
 * Returns a value from 0 to 1 based on spring physics
 */
export function spring(params: { frame: number; fps: number; config?: SpringConfig }): number {
  const { frame, fps, config = {} } = params;
  const { damping = 14, stiffness = 100, mass = 1 } = config;

  // Handle negative frames
  if (frame < 0) {
    return 0;
  }

  // Spring physics calculation
  const w0 = Math.sqrt(stiffness / mass);
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const t = frame / fps;

  let progress: number;

  if (dampingRatio < 1) {
    // Underdamped
    const wd = w0 * Math.sqrt(1 - dampingRatio * dampingRatio);
    progress =
      1 -
      Math.exp(-dampingRatio * w0 * t) *
        (Math.cos(wd * t) + (dampingRatio * w0 * Math.sin(wd * t)) / wd);
  } else if (dampingRatio === 1) {
    // Critically damped
    progress = 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  } else {
    // Overdamped
    const s1 = w0 * (-dampingRatio + Math.sqrt(dampingRatio * dampingRatio - 1));
    const s2 = w0 * (-dampingRatio - Math.sqrt(dampingRatio * dampingRatio - 1));
    progress = 1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1);
  }

  // Clamp between 0 and 1
  return Math.min(1, Math.max(0, progress));
}

/**
 * Interpolate RGB color values
 */
export function interpolateColor(
  progress: number,
  from: { r: number; g: number; b: number },
  to: { r: number; g: number; b: number }
): { r: number; g: number; b: number } {
  return {
    r: Math.round(interpolate(progress, [0, 1], [from.r, to.r])),
    g: Math.round(interpolate(progress, [0, 1], [from.g, to.g])),
    b: Math.round(interpolate(progress, [0, 1], [from.b, to.b])),
  };
}

/**
 * Convert RGB object to CSS string
 */
export function rgbToString(color: { r: number; g: number; b: number }): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Convert RGB object to CSS string with alpha
 */
export function rgbaToString(color: { r: number; g: number; b: number }, alpha: number): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}
