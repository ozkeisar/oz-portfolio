import { interpolate } from '../../utils/animation';

type PhoneIconProps = {
  size: number;
  color: string;
  progress: number; // 0-1 for line drawing animation
};

export function PhoneIcon({ size, color, progress }: PhoneIconProps) {
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
      aria-label="Phone"
      style={{
        strokeDasharray: totalLength,
        strokeDashoffset: dashOffset,
      }}
    >
      <title>Phone</title>
      {/* Phone receiver path */}
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
