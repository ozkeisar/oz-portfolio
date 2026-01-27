import type { ElementType, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FPS, TYPEWRITER_CHAR_DELAY, TYPEWRITER_PUNCTUATION_DELAY } from '../config/sections';
import type { ScrollDirection } from '../types/animation';

type TypewriterProps = {
  /** The text to type out */
  text: string;
  /** Milliseconds per character (default: 55) */
  charDelay?: number;
  /** Animation sequence frame to start typing */
  startFrame: number;
  /** Current animation sequence frame */
  currentFrame: number;
  /** Frames per second (default: 30) */
  fps?: number;
  /** Callback when typing completes */
  onComplete?: () => void;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** HTML element to render as (default: 'span') */
  as?: ElementType;
  /** Scroll direction for reverse playback */
  direction?: ScrollDirection;
  /** Whether to show cursor (default: true during typing) */
  showCursor?: boolean;
  /** Children to render after the text (e.g., highlighted spans) */
  children?: ReactNode;
};

/**
 * Check if a character is punctuation that should have a longer pause
 */
function isPunctuation(char: string): boolean {
  return ['.', ',', '!', '?', ';', ':'].includes(char);
}

/**
 * Calculate cumulative timing for each character
 * Punctuation gets longer delays for natural rhythm
 */
function calculateCharTimings(
  text: string,
  baseDelay: number
): { totalDuration: number; charTimes: number[] } {
  const charTimes: number[] = [];
  let cumulative = 0;

  for (let i = 0; i < text.length; i++) {
    charTimes.push(cumulative);
    const char = text[i];
    const delay = isPunctuation(char) ? TYPEWRITER_PUNCTUATION_DELAY : baseDelay;
    cumulative += delay;
  }

  return { totalDuration: cumulative, charTimes };
}

/**
 * Typewriter component that reveals text character by character
 * Synced with the animation frame system
 */
export function Typewriter({
  text,
  charDelay = TYPEWRITER_CHAR_DELAY,
  startFrame,
  currentFrame,
  fps = FPS,
  onComplete,
  className,
  style,
  as: Component = 'span',
  direction = 'forward',
  showCursor = true,
  children,
}: TypewriterProps) {
  const completedRef = useRef(false);
  const [displayedChars, setDisplayedChars] = useState(0);

  // Calculate character timings
  const { totalDuration, charTimes } = useMemo(
    () => calculateCharTimings(text, charDelay),
    [text, charDelay]
  );

  // Calculate how many characters should be visible based on frame
  useEffect(() => {
    if (currentFrame < startFrame) {
      setDisplayedChars(direction === 'backward' ? text.length : 0);
      completedRef.current = false;
      return;
    }

    const elapsedFrames = currentFrame - startFrame;
    const elapsedMs = (elapsedFrames / fps) * 1000;

    let charsToShow: number;

    if (direction === 'backward') {
      // Reverse: start with all chars, remove as time passes
      const reverseElapsed = totalDuration - elapsedMs;
      charsToShow = charTimes.filter((t) => t < reverseElapsed).length;
    } else {
      // Forward: add chars as time passes
      charsToShow = charTimes.filter((t) => t <= elapsedMs).length;
    }

    const clampedChars = Math.max(0, Math.min(charsToShow, text.length));
    setDisplayedChars(clampedChars);

    // Fire completion callback once (forward only)
    if (direction === 'forward' && clampedChars >= text.length && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  }, [currentFrame, startFrame, fps, text.length, charTimes, totalDuration, direction, onComplete]);

  // Reset completion ref when text changes
  useEffect(() => {
    completedRef.current = false;
  }, []);

  const visibleText = text.slice(0, displayedChars);
  const isTyping = displayedChars > 0 && displayedChars < text.length;

  // Blinking cursor using frame for animation
  const cursorVisible = showCursor && isTyping && Math.sin(currentFrame * 0.4) > 0;

  return (
    <Component className={className} style={style}>
      {visibleText}
      {cursorVisible && (
        <span
          style={{
            color: 'inherit',
            fontWeight: 'normal',
            opacity: 0.7,
          }}
        >
          |
        </span>
      )}
      {/* Render children (highlighted text) only after main text is complete */}
      {displayedChars >= text.length && children}
    </Component>
  );
}

/**
 * Calculate total frames needed for a typewriter animation
 * Useful for staggering subsequent elements
 */
export function getTypewriterDuration(
  text: string,
  charDelay: number = TYPEWRITER_CHAR_DELAY,
  fps: number = FPS
): number {
  const { totalDuration } = calculateCharTimings(text, charDelay);
  return Math.ceil((totalDuration / 1000) * fps);
}
