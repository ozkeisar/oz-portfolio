import { interpolate } from '../../utils/animation';

type LinkedInIconProps = {
  size: number;
  color: string;
  progress: number; // 0-1 for line drawing animation
};

export function LinkedInIcon({ size, color, progress }: LinkedInIconProps) {
  // Total path length for stroke animation
  const totalLength = 100;

  // Animate stroke-dashoffset from totalLength to 0
  const dashOffset = interpolate(progress, [0, 1], [totalLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="LinkedIn"
      style={{
        strokeDasharray: totalLength,
        strokeDashoffset: dashOffset,
      }}
    >
      <title>LinkedIn</title>
      {/* Outer rounded rectangle */}
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />

      {/* Profile circle */}
      <circle cx="8.5" cy="8.5" r="1.5" />

      {/* Vertical line for profile */}
      <line x1="8.5" y1="12" x2="8.5" y2="17" />

      {/* Connection path */}
      <path d="M12 17v-3.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" />
      <line x1="12" y1="12" x2="12" y2="17" />
    </svg>
  );
}
