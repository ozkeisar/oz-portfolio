import { forwardRef } from 'react';
import { interpolate } from '../../utils/animation';

type OzKeisarTextProps = {
  progress: number; // 0-1 for line drawing animation
  color: string;
  width: number;
};

/**
 * Custom easing that mimics brush/pen movement:
 * - Smooth, consistent drawing speed throughout
 * - Slight ease-in at start (brush touching canvas)
 * - Slight ease-out at end (brush lifting)
 */
function artistEase(t: number): number {
  // Smooth ease-in-out for natural brush movement
  // Using a sine-based easing for organic feel
  return t - Math.sin(t * Math.PI * 2) / (Math.PI * 2.5);
}

/**
 * SVG handwriting-style text for "Oz Keisar"
 * Clean, readable cursive with artist-like line-drawing animation
 *
 * Forwards ref to the SVG element for position measurement
 */
export const OzKeisarText = forwardRef<SVGSVGElement, OzKeisarTextProps>(
  function OzKeisarText({ progress, color, width }, ref) {
    const height = width * 0.22;
    const totalLength = 600;

    // Staggered animation for each letter with artist-like timing
    // Includes small "pauses" between letters (gaps in timing ranges)
    const getLetterDashOffset = (letterStart: number, letterEnd: number) => {
      const letterProgress = interpolate(progress, [letterStart, letterEnd], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      // Apply artist easing for natural brush movement
      const eased = artistEase(letterProgress);
      return interpolate(eased, [0, 1], [totalLength, 0]);
    };

    // O no longer has fill - profile image will show through

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox="0 0 320 70"
        fill="none"
        role="img"
        aria-label="Oz Keisar"
      >
      <title>Oz Keisar</title>

      {/* O - smooth oval (no fill - profile image shows through) */}
      <path
        d="M8 35 C8 18, 22 6, 35 6 C48 6, 62 18, 62 35 C62 52, 48 64, 35 64 C22 64, 8 52, 8 35 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.95),
        }}
      />

      {/* z - diagonal sweep */}
      <path
        d="M72 24 L96 24 C92 32, 80 48, 72 56 L98 56"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.75),
        }}
      />

      {/* K - vertical stem */}
      <path
        d="M120 10 L120 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.55),
        }}
      />

      {/* K - diagonal strokes */}
      <path
        d="M148 10 L120 38 L152 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.7),
        }}
      />

      {/* e - curved e */}
      <path
        d="M160 40 L184 40 C184 28, 174 22, 166 22 C156 22, 150 32, 150 42 C150 54, 160 60, 172 58 C178 57, 184 52, 186 46"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.8),
        }}
      />

      {/* i - stem (short, finishes early) */}
      <path
        d="M198 26 L198 58"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.4),
        }}
      />

      {/* i dot */}
      <circle
        cx="198"
        cy="14"
        r="3"
        fill={color}
        opacity={interpolate(progress, [0.38, 0.42], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      />

      {/* s - flowing s curve */}
      <path
        d="M224 28 C218 24, 210 26, 210 32 C210 38, 218 40, 224 44 C230 48, 230 56, 222 60 C216 62, 208 58, 208 54"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.85),
        }}
      />

      {/* a - rounded a */}
      <path
        d="M256 58 C244 58, 236 50, 236 42 C236 32, 246 24, 256 24 C266 24, 272 32, 272 42 L272 58"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.88),
        }}
      />

      {/* r - final letter */}
      <path
        d="M284 58 L284 36 C284 28, 292 24, 302 26"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.5),
        }}
      />
    </svg>
  );
  }
);
