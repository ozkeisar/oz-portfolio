import { interpolate } from '../../utils/animation';

type SubtitleTextProps = {
  progress: number; // 0-1 for line drawing animation
  color: string;
  width: number;
};

/**
 * SVG text for "Engineering Manager & AI Innovation Lead"
 * Clean, professional sans-serif with line-drawing animation
 */
export function SubtitleText({ progress, color, width }: SubtitleTextProps) {
  const height = width * 0.08;

  // Calculate dash offset for text stroke animation (line drawing only, no fill)
  const textDashOffset = interpolate(progress, [0, 1], [600, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 520 42"
      fill="none"
      role="img"
      aria-label="Engineering Manager & AI Innovation Lead"
    >
      <title>Engineering Manager & AI Innovation Lead</title>

      {/* Main text using SVG text element with stroke animation */}
      <text
        x="260"
        y="28"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="400"
        letterSpacing="0.5"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 600,
          strokeDashoffset: textDashOffset,
        }}
      >
        Engineering Manager & AI Innovation Lead
      </text>
    </svg>
  );
}
