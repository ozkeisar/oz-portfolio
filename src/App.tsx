import { AnimationCanvas } from './components/AnimationCanvas';
import { ProfileImageTransition } from './components/ProfileImageTransition';
import { ContactSection } from './components/sections/ContactSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { HeroSection } from './components/sections/HeroSection';
import { ImpactSection } from './components/sections/ImpactSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { SummarySection } from './components/sections/SummarySection';
import { AnimationProvider } from './context/AnimationContext';
import { HeroOPositionProvider } from './context/HeroOPositionContext';
import './App.css';

function App() {
  return (
    <AnimationProvider>
      <HeroOPositionProvider>
        <AnimationCanvas backgroundColor="#0a1628">
          <HeroSection />
          <SummarySection />
          <ExperienceSection />
          <ImpactSection />
          <SkillsSection />
          <ContactSection />
          <ProfileImageTransition />
        </AnimationCanvas>
      </HeroOPositionProvider>
    </AnimationProvider>
  );
}

export default App;
