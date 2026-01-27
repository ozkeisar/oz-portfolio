import { interpolate } from '../../utils/animation';

type WhatsAppIconProps = {
  size: number;
  color: string;
  progress: number; // 0-1 for line drawing animation
};

export function WhatsAppIcon({ size, color, progress }: WhatsAppIconProps) {
  // Total path length for stroke animation
  const totalLength = 150;

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
      aria-label="WhatsApp"
      style={{
        strokeDasharray: totalLength,
        strokeDashoffset: dashOffset,
      }}
    >
      <title>WhatsApp</title>
      {/* Chat bubble outline */}
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      {/* Phone icon inside bubble */}
      <path d="M14.5 13.5c-.3.3-.7.4-1.1.3-.8-.3-1.5-.8-2.1-1.4-.6-.6-1.1-1.3-1.4-2.1-.1-.4 0-.8.3-1.1l.4-.4c.2-.2.2-.5 0-.7l-.9-.9c-.2-.2-.5-.2-.7 0l-.5.5c-.5.5-.7 1.2-.5 1.9.3 1.2 1 2.3 1.9 3.2.9.9 2 1.6 3.2 1.9.7.2 1.4 0 1.9-.5l.5-.5c.2-.2.2-.5 0-.7l-.9-.9c-.2-.2-.5-.2-.7 0l-.4.4z" />
    </svg>
  );
}
