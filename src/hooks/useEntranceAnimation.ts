import { useCallback, useEffect, useRef, useState } from 'react';

type UseEntranceAnimationConfig = {
  durationFrames: number; // Total frames for entrance animation
  fps: number; // Frames per second
  onComplete?: () => void;
};

type EntranceAnimationState = {
  entranceFrame: number;
  isEntranceComplete: boolean;
  isPlaying: boolean;
};

/**
 * Hook for time-based entrance animation
 * Plays automatically on mount and tracks frame progress
 */
export function useEntranceAnimation(config: UseEntranceAnimationConfig): EntranceAnimationState {
  const { durationFrames, fps, onComplete } = config;
  const [entranceFrame, setEntranceFrame] = useState(0);
  const [isEntranceComplete, setIsEntranceComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const frameDuration = 1000 / fps;
      const currentFrame = Math.floor(elapsed / frameDuration);

      if (currentFrame >= durationFrames) {
        // Animation complete
        setEntranceFrame(durationFrames);
        setIsEntranceComplete(true);
        setIsPlaying(false);
        onCompleteRef.current?.();
        return;
      }

      setEntranceFrame(currentFrame);
      rafRef.current = requestAnimationFrame(animate);
    },
    [durationFrames, fps]
  );

  useEffect(() => {
    // Start animation on mount
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate]);

  return {
    entranceFrame,
    isEntranceComplete,
    isPlaying,
  };
}
