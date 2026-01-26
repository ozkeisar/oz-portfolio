import { interpolate } from '../../utils/animation';

type OzKeisarTextProps = {
  progress: number; // 0-1 for line drawing animation
  color: string;
  width: number;
};

/**
 * Custom easing that mimics brush/pen movement:
 * - Slight hesitation at start (artist placing brush)
 * - Smooth acceleration into the stroke
 * - Gradual deceleration at end (brush lifting)
 */
function artistEase(t: number): number {
  // Bezier-like curve: slow start, smooth middle, slow end
  if (t < 0.15) {
    // Initial hesitation - artist placing brush
    return t * t * 4.44; // Slow start
  } else if (t < 0.85) {
    // Main stroke - smooth consistent movement
    const adjusted = (t - 0.15) / 0.7;
    return 0.1 + adjusted * 0.8;
  } else {
    // Brush lifting - deceleration
    const adjusted = (t - 0.85) / 0.15;
    return 0.9 + (1 - (1 - adjusted) * (1 - adjusted)) * 0.1;
  }
}

/**
 * SVG handwriting-style text for "Oz Keisar"
 * Clean, readable cursive with artist-like line-drawing animation
 */
export function OzKeisarText({ progress, color, width }: OzKeisarTextProps) {
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

  // Fill fades in gently at the end
  const fillOpacity = interpolate(progress, [0.92, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 70"
      fill="none"
      role="img"
      aria-label="Oz Keisar"
    >
      <title>Oz Keisar</title>

      {/* O - smooth oval, drawn as single continuous stroke */}
      {/* Artist draws O slowly, feeling the curve */}
      <path
        d="M8 35 C8 18, 22 6, 35 6 C48 6, 62 18, 62 35 C62 52, 48 64, 35 64 C22 64, 8 52, 8 35 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity={fillOpacity}
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0, 0.18),
        }}
      />

      {/* Small pause before z (0.18 to 0.20) - artist lifts brush */}

      {/* z - flowing z with diagonal sweep */}
      <path
        d="M72 24 L96 24 C92 32, 80 48, 72 56 L98 56"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0.2, 0.32),
        }}
      />

      {/* Longer pause before K (0.32 to 0.36) - moving to new word */}

      {/* K - vertical stem first, artist grounds the letter */}
      <path
        d="M120 10 L120 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0.36, 0.44),
        }}
      />

      {/* K - diagonal strokes, flowing from top-right */}
      <path
        d="M148 10 L120 38 L152 60"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0.44, 0.54),
        }}
      />

      {/* Brief pause (0.54 to 0.56) */}

      {/* e - curved e, one flowing motion */}
      <path
        d="M160 40 L184 40 C184 28, 174 22, 166 22 C156 22, 150 32, 150 42 C150 54, 160 60, 172 58 C178 57, 184 52, 186 46"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0.56, 0.66),
        }}
      />

      {/* i - stem drawn with intention */}
      <path
        d="M198 26 L198 58"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0.66, 0.71),
        }}
      />

      {/* i dot - quick flick, appears after stem */}
      <circle
        cx="198"
        cy="14"
        r="3"
        fill={color}
        opacity={interpolate(progress, [0.71, 0.73], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      />

      {/* Brief pause (0.73 to 0.75) */}

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
          strokeDashoffset: getLetterDashOffset(0.75, 0.84),
        }}
      />

      {/* a - rounded a, drawn in one motion */}
      <path
        d="M256 58 C244 58, 236 50, 236 42 C236 32, 246 24, 256 24 C266 24, 272 32, 272 42 L272 58"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0.84, 0.93),
        }}
      />

      {/* r - final letter, ends with a gentle lift */}
      <path
        d="M284 58 L284 36 C284 28, 292 24, 302 26"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: getLetterDashOffset(0.93, 1),
        }}
      />
    </svg>
  );
}
