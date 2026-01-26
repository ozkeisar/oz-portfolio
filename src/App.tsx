import { AnimationCanvas } from './components/AnimationCanvas';
import { ScrollController } from './components/ScrollController';
import { ContactSection } from './components/sections/ContactSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { HeroSection } from './components/sections/HeroSection';
import { ImpactSection } from './components/sections/ImpactSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { SummarySection } from './components/sections/SummarySection';
import './App.css';

function App() {
  return (
    <AnimationCanvas backgroundColor="#0a1628">
      <ScrollController>
        <HeroSection />
        <SummarySection />
        <ExperienceSection />
        <ImpactSection />
        <SkillsSection />
        <ContactSection />
      </ScrollController>
    </AnimationCanvas>
  );
}

export default App;
