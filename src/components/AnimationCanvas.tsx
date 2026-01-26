import type { ReactNode } from 'react';
import { useScrollFrame } from '../hooks/useScrollFrame';

type AnimationCanvasProps = {
  children?: ReactNode;
  backgroundColor?: string;
  totalFrames?: number;
};

export const AnimationCanvas = ({
  children,
  backgroundColor = '#0a1628',
  totalFrames = 900,
}: AnimationCanvasProps) => {
  const { totalScrollHeight } = useScrollFrame({ totalFrames });

  return (
    <>
      {/* Scroll spacer - creates the scrollable area */}
      <div
        style={{
          height: totalScrollHeight,
          position: 'relative',
        }}
      />

      {/* Fixed viewport for animation content */}
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
    </>
  );
};
