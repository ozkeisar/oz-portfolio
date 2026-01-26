import { interpolate } from '../../utils/animation';

type EmailIconProps = {
  size: number;
  color: string;
  progress: number; // 0-1 for line drawing animation
};

export function EmailIcon({ size, color, progress }: EmailIconProps) {
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
      aria-label="Email"
      style={{
        strokeDasharray: totalLength,
        strokeDashoffset: dashOffset,
      }}
    >
      <title>Email</title>
      {/* Envelope body */}
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />

      {/* Envelope flap */}
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
