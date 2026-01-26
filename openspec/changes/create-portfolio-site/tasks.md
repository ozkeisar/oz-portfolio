# Tasks: Create Portfolio Site

## 1. Foundation
- [x] 1.1 Create `src/utils/animation.ts` with `interpolate` and `spring` functions
- [x] 1.2 Create `src/utils/colors.ts` with RGB color system
- [x] 1.3 Create `src/hooks/useScrollFrame.ts` scroll-to-frame controller
- [x] 1.4 Create `src/hooks/useViewport.ts` for responsive values

## 2. Core Components
- [x] 2.1 Update `src/components/AnimationCanvas.tsx` with scroll integration
- [x] 2.2 Create `src/components/ScrollController.tsx` context provider

## 3. Section Components
- [x] 3.1 Create `src/components/sections/HeroSection.tsx` with entrance animation
- [x] 3.2 Create `src/components/sections/SummarySection.tsx` with photo placement
- [x] 3.3 Create `src/components/sections/ExperienceSection.tsx` with vertical timeline
- [x] 3.4 Create `src/components/sections/ImpactSection.tsx` with animated numbers
- [x] 3.5 Create `src/components/sections/SkillsSection.tsx` with grid layout
- [x] 3.6 Create `src/components/sections/ContactSection.tsx` with SVG line icons

## 4. SVG Icons
- [x] 4.1 Create `src/components/icons/LinkedInIcon.tsx` with line-drawing animation
- [x] 4.2 Create `src/components/icons/GitHubIcon.tsx` with line-drawing animation
- [x] 4.3 Create `src/components/icons/EmailIcon.tsx` with line-drawing animation

## 5. Integration
- [x] 5.1 Wire all sections in `src/App.tsx`
- [ ] 5.2 Add Oz's photo to `src/assets/`
- [x] 5.3 Verify scroll behavior works bidirectionally

## 6. Polish
- [ ] 6.1 Test on mobile viewport sizes
- [ ] 6.2 Test on desktop viewport sizes
- [x] 6.3 Verify entrance animation plays once on load
- [x] 6.4 Run lint and build verification

## Dependencies
- Task 1.x must complete before Task 2.x
- Task 2.x must complete before Task 3.x
- Task 4.x can run in parallel with Task 3.x
- Task 5.x requires all previous tasks
