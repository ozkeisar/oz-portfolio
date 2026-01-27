# Tasks: Create Portfolio Site

## 1. Foundation (Core Utilities)
- [x] 1.1 Create `src/utils/animation.ts` with `interpolate` and `spring` functions
- [x] 1.2 Create `src/utils/colors.ts` with RGB color system
- [x] 1.3 Create `src/hooks/useViewport.ts` for responsive values

## 2. Animation State Machine Architecture
- [x] 2.1 Create `src/types/animation.ts` with state machine types
- [x] 2.2 Create `src/config/sections.ts` with section timing configuration
- [x] 2.3 Create `src/reducers/animationReducer.ts` with state transitions
- [x] 2.4 Create `src/hooks/useAnimationController.ts` core controller
- [x] 2.5 Create `src/context/AnimationContext.tsx` provider and hooks
- [x] 2.6 Create `src/hooks/useExitAnimation.ts` for exit animations

## 3. Animation Components
- [x] 3.1 Create `src/components/Typewriter.tsx` letter-by-letter text reveal
- [x] 3.2 Update `src/components/AnimationCanvas.tsx` (fixed viewport, no scroll spacer)
- [x] 3.3 Remove old `src/components/ScrollController.tsx` (replaced by AnimationContext)

## 4. Section Components
- [x] 4.1 Create `src/components/sections/HeroSection.tsx` with entrance + exit animation
- [x] 4.2 Create `src/components/sections/SummarySection.tsx` with Typewriter effect
- [x] 4.3 Create `src/components/sections/ExperienceSection.tsx` with vertical timeline
- [x] 4.4 Create `src/components/sections/ImpactSection.tsx` with animated numbers
- [x] 4.5 Create `src/components/sections/SkillsSection.tsx` with grid layout
- [x] 4.6 Create `src/components/sections/ContactSection.tsx` with SVG line icons
- [x] 4.7 Create `src/components/ProfileImageTransition.tsx` animated photo

## 5. SVG Icons
- [x] 5.1 Create `src/components/icons/LinkedInIcon.tsx` with line-drawing animation
- [x] 5.2 Create `src/components/icons/GitHubIcon.tsx` with line-drawing animation
- [x] 5.3 Create `src/components/icons/EmailIcon.tsx` with line-drawing animation

## 6. Integration
- [x] 6.1 Wire AnimationProvider in `src/App.tsx`
- [x] 6.2 Add Oz's photo to `src/assets/oz-photo.webp`
- [x] 6.3 Migrate all sections to use new AnimationContext
- [x] 6.4 Verify scroll triggers one section transition at a time
- [x] 6.5 Verify sections exit with alternating directions (L, R, L, R)

## 7. Polish & Testing
- [ ] 7.1 Test on mobile viewport sizes
- [ ] 7.2 Test on desktop viewport sizes
- [x] 7.3 Verify intro animation plays once on load
- [x] 7.4 Verify typewriter timing is sequential (no overlap)
- [ ] 7.5 Fine-tune animation durations for optimal UX
- [x] 7.6 Run lint and build verification

## Architecture Changes Log

### Removed Files
- `src/components/ScrollController.tsx` - Replaced by AnimationContext
- `src/hooks/useScrollFrame.ts` - Replaced by useAnimationController

### New Files Created
```
src/types/animation.ts           - Type definitions
src/config/sections.ts           - Section configuration
src/reducers/animationReducer.ts - State machine reducer
src/hooks/useAnimationController.ts - Core controller
src/hooks/useExitAnimation.ts    - Exit animation helpers
src/context/AnimationContext.tsx - React context provider
src/components/Typewriter.tsx    - Typewriter text effect
```

### Key Architectural Decisions
1. **State Machine Model**: Replaced continuous scroll-to-frame mapping with triggered animation sequences
2. **Scroll Locking**: Scroll events ignored during animations (no queuing)
3. **Sequential Typewriter**: Each paragraph starts after previous completes
4. **Alternating Exits**: Sections exit left/right in alternating pattern
5. **Visibility Hook**: `useSectionVisibility()` encapsulates rendering logic

## Dependencies
- Task 1.x must complete before Task 2.x
- Task 2.x must complete before Task 3.x and 4.x
- Task 5.x can run in parallel with Task 4.x
- Task 6.x requires Tasks 2-5 complete
- Task 7.x is ongoing polish work
