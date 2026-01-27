import type { ReactNode } from 'react';

type AnimationCanvasProps = {
  children?: ReactNode;
  backgroundColor?: string;
};

/**
 * AnimationCanvas provides a fixed full-viewport container for animations.
 * No scroll spacer needed - scroll is handled by AnimationController.
 */
export const AnimationCanvas = ({
  children,
  backgroundColor = '#0a1628',
}: AnimationCanvasProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor,
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};
