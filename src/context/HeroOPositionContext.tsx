import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

/**
 * Position of the "O" letter center in screen coordinates
 */
type OPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

type HeroOPositionContextValue = {
  oPosition: OPosition;
  setOPosition: (position: OPosition) => void;
};

const HeroOPositionContext = createContext<HeroOPositionContextValue | null>(null);

/**
 * Provider for sharing the measured "O" letter position
 * between HeroSection (which measures it) and ProfileImageTransition (which uses it)
 */
export function HeroOPositionProvider({ children }: { children: ReactNode }) {
  const [oPosition, setOPositionState] = useState<OPosition>(null);

  const setOPosition = useCallback((position: OPosition) => {
    setOPositionState(position);
  }, []);

  return (
    <HeroOPositionContext.Provider value={{ oPosition, setOPosition }}>
      {children}
    </HeroOPositionContext.Provider>
  );
}

/**
 * Hook to access the "O" position context
 */
export function useHeroOPosition(): HeroOPositionContextValue {
  const context = useContext(HeroOPositionContext);
  if (!context) {
    throw new Error('useHeroOPosition must be used within HeroOPositionProvider');
  }
  return context;
}
