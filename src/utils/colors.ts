/**
 * Color system for the portfolio site
 * Colors stored as RGB objects for smooth interpolation
 */

export type RGBColor = {
  r: number;
  g: number;
  b: number;
};

/**
 * Main color palette
 */
export const colors = {
  // Backgrounds
  background: { r: 10, g: 22, b: 40 } as RGBColor, // #0a1628
  backgroundLight: { r: 20, g: 40, b: 70 } as RGBColor,
  backgroundDark: { r: 5, g: 12, b: 25 } as RGBColor,

  // Primary/Accent
  accent: { r: 205, g: 127, b: 50 } as RGBColor, // Bronze #cd7f32
  accentLight: { r: 222, g: 160, b: 90 } as RGBColor, // Light bronze
  accentDark: { r: 166, g: 100, b: 40 } as RGBColor, // Dark bronze

  // Text
  textPrimary: { r: 255, g: 255, b: 255 } as RGBColor,
  textSecondary: { r: 148, g: 163, b: 184 } as RGBColor, // slate-400
  textMuted: { r: 100, g: 116, b: 139 } as RGBColor, // slate-500

  // UI Elements
  cardBackground: { r: 15, g: 30, b: 55 } as RGBColor,
  cardBorder: { r: 30, g: 50, b: 80 } as RGBColor,

  // Success/Error
  success: { r: 34, g: 197, b: 94 } as RGBColor,
  error: { r: 239, g: 68, b: 68 } as RGBColor,
};

/**
 * Convert hex color to RGB object
 */
export function hexToRgb(hex: string): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
  };
}

/**
 * Convert RGB object to hex string
 */
export function rgbToHex(color: RGBColor): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Convert RGB object to CSS rgb() string
 */
export function toRgbString(color: RGBColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Convert RGB object to CSS rgba() string
 */
export function toRgbaString(color: RGBColor, alpha: number): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}
