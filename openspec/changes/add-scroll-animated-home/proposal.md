# Change: Add Scroll-Animated Home Page

## Why
The current portfolio site requires excessive scrolling to discover content, especially on mobile. Users need a more intuitive, native-scroll experience while preserving the impressive "Oz Keisar" entrance animation.

## What Changes
- Add new `/home` route with hybrid animation system
- Reuse the "Oz Keisar" SVG entrance animation with image-in-O positioning (Remotion)
- After entrance completes, switch to native scrolling with viewport-triggered animations (Framer Motion)
- Add React Router for `/` and `/home` routing
- Add `framer-motion` dependency for content scroll animations
- Create new Home page components under `src/components/home/`

## Impact
- Affected specs: New `scroll-animated-home` capability
- Affected code:
  - `src/main.tsx` - Add React Router
  - `src/App.tsx` - Wrap with Router, keep as landing page
  - New `src/pages/Home.tsx` - Home page container
  - New `src/components/home/` - All home page sections
  - Reuse `src/components/text/OzKeisarText.tsx` - SVG text component
  - Reuse `src/context/HeroOPositionContext.tsx` - O position calculation
  - `package.json` - Add framer-motion, react-router-dom

## Architecture

### Two-Phase Animation System

**Phase 1 - Entrance (Remotion)**
- Duration: ~3.7 seconds (110 frames at 30fps)
- "Oz Keisar" SVG handwriting animation with stroke-dashoffset
- Profile image positioned inside the "O" letter
- Mobile-responsive calculation for perfect O fit
- Scroll locked during entrance

**Phase 2 - Content Scroll (Framer Motion)**
- Native browser scrolling enabled
- Viewport-triggered animations using `useInView`
- Stagger patterns for sequential reveals
- Glass morphism and modern styling

### Content Sections (from existing data)
1. Hero - Name + subtitle (part of entrance)
2. Summary - Professional bio with scrollable text
3. Experience - Timeline of 7 positions (from experienceData.ts)
4. Impact - 6 metrics with animated counters (from impactData.ts)
5. Skills - 6 categories in grid layout (from skillsData.ts)
6. Contact - Social links and contact info
