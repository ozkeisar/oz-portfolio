import { useState, useEffect, useRef, useCallback } from 'react';
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
import '../styles/home.css';

type AnimationPhase = 'entrance' | 'content';

const ENTRANCE_DURATION_MS = 3700; // ~110 frames at 30fps

export function Home() {
  const [phase, setPhase] = useState<AnimationPhase>('entrance');
  const [heroInView, setHeroInView] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

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

  // Track hero visibility for header appearance
  useEffect(() => {
    if (phase !== 'content' || !heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
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

        {/* Header - only visible after scrolling past hero */}
        <HomeHeader visible={phase === 'content' && !heroInView} />

        {/* Profile image that transitions between hero and header */}
        <HomeProfileImage
          phase={phase}
          heroInView={heroInView}
        />

        {/* Main content - visible after entrance */}
        <main
          style={{
            opacity: phase === 'content' ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          <HomeHero ref={heroRef} />
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
