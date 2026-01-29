## Context

The current oz-portfolio uses a fully Remotion-based animation system that requires excessive scrolling to trigger content discovery. The addit_web project demonstrates a more user-friendly approach with native scrolling and viewport-triggered animations.

This change creates a new `/home` page that combines the best of both:
- The impressive "Oz Keisar" entrance animation (Remotion)
- Native scroll experience with viewport-triggered content (Framer Motion)

### Stakeholders
- End users (recruiters, potential clients)
- Oz Keisar (site owner)

### Constraints
- Must NOT modify the existing `/` landing page
- Must reuse the "Oz Keisar" SVG and O-position calculation logic
- Must work seamlessly on mobile and desktop
- Must maintain dark theme (#0a1628 background)

## Goals / Non-Goals

**Goals:**
- Hybrid animation system: Remotion entrance + Framer Motion scroll
- Native scrolling after entrance completes
- Viewport-triggered content animations (like addit_web)
- Mobile-responsive entrance with perfect image-in-O positioning
- Reuse existing data files (experienceData, skillsData, impactData)

**Non-Goals:**
- Modifying the existing `/` landing page
- Changing the entrance animation design
- Adding new content beyond what exists in data files
- Server-side rendering

## Decisions

### Decision 1: Hybrid Animation Architecture
**What:** Use Remotion for entrance, Framer Motion for content scroll
**Why:**
- Remotion excels at complex, frame-based sequences (entrance)
- Framer Motion excels at viewport-triggered, native-scroll animations
- Best user experience for both "wow" entrance and content discovery

### Decision 2: Animation Phase Transition
**What:** Use state machine to transition from entrance to scroll phase
**Why:**
- Clear separation of concerns
- Scroll locked during entrance (prevents janky interaction)
- Native scroll enabled only after entrance completes

```tsx
type AnimationPhase = 'entrance' | 'content';

// In Home page:
const [phase, setPhase] = useState<AnimationPhase>('entrance');

// After entrance animation completes:
useEffect(() => {
  if (entranceFrame >= ENTRANCE_DURATION) {
    setPhase('content');
    document.body.style.overflow = 'auto'; // Enable native scroll
  }
}, [entranceFrame]);
```

### Decision 3: Reuse O-Position Calculation
**What:** Extract and reuse `HeroOPositionContext` logic for Home page
**Why:**
- DRY principle - same calculation needed
- Already handles responsive scaling
- Already handles SVG viewBox to screen coordinate conversion

### Decision 4: Framer Motion Animation Presets
**What:** Create reusable animation variants similar to addit_web
**Why:**
- Consistency across sections
- Easy to maintain and adjust
- Matches proven UX patterns

```tsx
// src/lib/animations.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
```

### Decision 5: Component Structure
**What:** Create dedicated `src/components/home/` directory
**Why:**
- Clear separation from existing landing page components
- Can evolve independently
- Easy to find and maintain

```
src/components/home/
├── HomeHero.tsx          # Entrance + hero content
├── HomeEntrance.tsx      # Remotion-based entrance animation
├── HomeSummary.tsx       # About section
├── HomeExperience.tsx    # Experience timeline
├── HomeImpact.tsx        # Impact metrics
├── HomeSkills.tsx        # Skills grid
├── HomeContact.tsx       # Contact section
├── HomeHeader.tsx        # Sticky header (scroll-aware)
└── HomeProfileImage.tsx  # Shared element transition image
```

### Decision 6: Header with Shared Element Transition
**What:** Header appears only after scrolling past hero, with profile image transitioning to header icon
**Why:**
- Hero section should be immersive without header distraction
- Shared element transition creates visual continuity
- Profile image "follows" user into the content sections

**Behavior:**
1. During entrance: No header visible
2. Hero section in view: No header visible
3. User scrolls past hero: Header animates in, profile image transitions from hero position to header icon
4. Subsequent scrolling: Header hide/show based on scroll direction

```tsx
// Track scroll position to trigger header appearance
const [headerVisible, setHeaderVisible] = useState(false);
const heroRef = useRef<HTMLElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      // Header appears when hero is NOT intersecting (scrolled past)
      setHeaderVisible(!entry.isIntersecting);
    },
    { threshold: 0 }
  );
  if (heroRef.current) observer.observe(heroRef.current);
  return () => observer.disconnect();
}, []);
```

### Decision 7: No Skip Intro / No Logo Navigation
**What:** No skip button, logo does not navigate between routes
**Why:**
- Intro is short (~3.7 seconds) - acceptable wait time
- Logo navigation would confuse user intent

### Alternatives Considered

**Alternative 1: Full Framer Motion (no Remotion entrance)**
- Pros: Simpler, single animation system
- Cons: Loses the impressive entrance animation
- Decision: Rejected - entrance is key differentiator

**Alternative 2: Full Remotion (scroll-driven content)**
- Pros: Consistent with project.md constraints
- Cons: Poor mobile UX, excessive scrolling, complex debugging
- Decision: Rejected - user explicitly requested native scroll

**Alternative 3: Scroll-triggered Remotion**
- Pros: Uses existing patterns
- Cons: Still requires scroll hijacking, not native feel
- Decision: Rejected - doesn't solve the core UX problem

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Two animation libraries increase bundle size | framer-motion is ~40KB gzipped, acceptable trade-off |
| Phase transition may feel jarring | Use opacity crossfade, ensure seamless visual transition |
| Entrance may delay content on slow devices | users will wait, the overall site dosent have much wight to load|
| Mobile performance concerns | Test on real devices, use `will-change` hints |

## Migration Plan

1. Add dependencies (framer-motion, react-router-dom)
2. Set up routing in main.tsx
3. Create Home page with entrance animation
4. Implement content sections with Framer Motion
5. Test on mobile and desktop
6. No migration needed - new page only

## Resolved Questions

1. **Skip Intro button?** → No. The intro is short enough (~3.7s) to bear.
2. **Header during entrance?** → No. Header appears only after user scrolls past hero section. Profile image performs "shared element" transition to become the header icon.
3. **Logo navigation between routes?** → No. Logo does not navigate between `/` and `/home`.
