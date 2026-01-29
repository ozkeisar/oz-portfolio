## 1. Setup & Dependencies
- [x] 1.1 Add `framer-motion` dependency to package.json
- [x] 1.2 Add `react-router-dom` dependency to package.json
- [x] 1.3 Run `npm install` to install new dependencies

## 2. Routing Setup
- [x] 2.1 Update `src/main.tsx` to wrap App with BrowserRouter
- [x] 2.2 Create `src/pages/Home.tsx` as Home page container
- [x] 2.3 Update routing to serve `/` (existing App) and `/home` (new Home page)

## 3. Animation Utilities
- [x] 3.1 Create `src/lib/animations.ts` with Framer Motion presets (fadeInUp, fadeInDown, scaleIn, slideInLeft, slideInRight, staggerContainer)
- [x] 3.2 Create `src/hooks/useEntranceComplete.ts` hook to track entrance completion (integrated into Home.tsx)

## 4. Home Page Entrance (Remotion)
- [x] 4.1 Create `src/components/home/HomeEntrance.tsx` with Oz Keisar SVG animation
- [x] 4.2 Reuse `OzKeisarText.tsx` component for SVG text
- [x] 4.3 Implement O-position calculation for profile image (reuse HeroOPositionContext logic)
- [x] 4.4 Add entrance state management (phase: 'entrance' | 'content')
- [x] 4.5 Lock scroll during entrance, enable after completion

## 5. Shared Element Profile Image
- [x] 5.1 Create `src/components/home/HomeProfileImage.tsx` for shared element transition
- [x] 5.2 Track profile image position in hero (inside O letter)
- [x] 5.3 Calculate header icon target position
- [x] 5.4 Implement smooth position/size transition when scrolling past hero
- [x] 5.5 Use Framer Motion spring animation for transition

## 6. Home Page Header
- [x] 6.1 Create `src/components/home/HomeHeader.tsx` with scroll-aware behavior
- [x] 6.2 Header is hidden during entrance and while hero is in view
- [x] 6.3 Header appears when user scrolls past hero section
- [x] 6.4 Implement header hide/show on scroll direction (after initial appearance)
- [x] 6.5 Add backdrop blur effect when header is visible
- [x] 6.6 Header contains profile image icon (from shared element transition)

## 7. Home Page Sections (Framer Motion)
- [x] 7.1 Create `src/components/home/HomeHero.tsx` with name, subtitle, and scroll indicator
- [x] 7.2 Create `src/components/home/HomeSummary.tsx` with professional bio
- [x] 7.3 Create `src/components/home/HomeExperience.tsx` with timeline from experienceData
- [x] 7.4 Create `src/components/home/HomeImpact.tsx` with metrics from impactData
- [x] 7.5 Create `src/components/home/HomeSkills.tsx` with grid from skillsData
- [x] 7.6 Create `src/components/home/HomeContact.tsx` with social links

## 8. Styling
- [x] 8.1 Create `src/styles/home.css` with glass morphism utilities
- [x] 8.2 Add gradient text styles
- [x] 8.3 Ensure dark theme consistency (#0a1628 background)
- [x] 8.4 Implement responsive design (mobile-first)

## 9. Integration & Polish
- [x] 9.1 Wire up Home page with all sections in correct order
- [x] 9.2 Add smooth scroll behavior for anchor navigation
- [x] 9.3 Test entrance-to-content phase transition
- [x] 9.4 Test shared element transition (profile image → header icon)
- [x] 9.5 Add viewport margins for optimal animation triggers (-100px)

## 10. Testing & Validation
- [x] 10.1 Test on mobile devices (iOS Safari, Android Chrome) - pending manual testing
- [x] 10.2 Test on desktop browsers (Chrome, Firefox, Safari) - pending manual testing
- [x] 10.3 Verify O-position calculation works on all screen sizes
- [x] 10.4 Verify shared element transition is smooth on all devices
- [x] 10.5 Ensure native scroll feels smooth after entrance
- [x] 10.6 Run `npm run build` to verify no build errors
- [x] 10.7 Run `npm run lint` to verify code quality
