import { useState, useEffect, useCallback } from 'react';
import { HomeEntrance } from '../components/home/HomeEntrance';
import { HomeHero } from '../components/home/HomeHero';
import { HomeSummary } from '../components/home/HomeSummary';
import { HomeExperience } from '../components/home/HomeExperience';
import { HomeImpact } from '../components/home/HomeImpact';
import { HomeSkills } from '../components/home/HomeSkills';
import { HomeContact } from '../components/home/HomeContact';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeProfileImage } from '../components/home/HomeProfileImage';
import { HeroOPositionProvider } from '../context/HeroOPositionContext';
import ozPhoto from '../assets/oz-photo.webp';
import '../styles/home.css';

type AnimationPhase = 'entrance' | 'content';

const ENTRANCE_DURATION_MS = 3700; // ~110 frames at 30fps
const IMAGE_APPEAR_DELAY_MS = 2500; // Frame 75 at 30fps - syncs with subtitle

export function Home() {
  const [phase, setPhase] = useState<AnimationPhase>('entrance');
  const [isAtTop, setIsAtTop] = useState(true); // Track if user is at top of page
  const [imageTimerReady, setImageTimerReady] = useState(false); // Timer elapsed
  const [imageLoaded, setImageLoaded] = useState(false); // Image preloaded

  // Lock scroll during entrance
  useEffect(() => {
    if (phase === 'entrance') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [phase]);

  // Transition to content phase after entrance completes
  useEffect(() => {
    if (phase === 'entrance') {
      const timer = setTimeout(() => {
        setPhase('content');
      }, ENTRANCE_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Preload profile image immediately (doesn't block animation)
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = ozPhoto;
  }, []);

  // Timer for when image should appear (synced with subtitle)
  useEffect(() => {
    if (phase === 'entrance' && !imageTimerReady) {
      const timer = setTimeout(() => {
        setImageTimerReady(true);
      }, IMAGE_APPEAR_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [phase, imageTimerReady]);

  // Show image only when both timer elapsed AND image is loaded
  const showImage = imageTimerReady && imageLoaded;

  // Track scroll position for profile image transition
  // Image goes to header on first scroll, returns only when back at top
  useEffect(() => {
    if (phase !== 'content') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Image returns to hero position only when scrolled to the very top
      setIsAtTop(scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [phase]);

  const handleEntranceComplete = useCallback(() => {
    setPhase('content');
  }, []);

  return (
    <HeroOPositionProvider>
      <div
        className="home-container"
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a1628',
          color: 'white',
        }}
      >
        {/* Entrance animation overlay */}
        {phase === 'entrance' && (
          <HomeEntrance onComplete={handleEntranceComplete} />
        )}

        {/* Header - visible on first scroll, same as profile image */}
        <HomeHeader visible={phase === 'content' && !isAtTop} />

        {/* Profile image that transitions between hero and header */}
        <HomeProfileImage
          phase={phase}
          isAtTop={isAtTop}
          visible={showImage}
        />

        {/* Main content - visible after entrance */}
        <main
          style={{
            opacity: phase === 'content' ? 1 : 0,
          }}
        >
          <HomeHero />
          <HomeSummary />
          <HomeExperience />
          <HomeImpact />
          <HomeSkills />
          <HomeContact />
        </main>
      </div>
    </HeroOPositionProvider>
  );
}

export default Home;
