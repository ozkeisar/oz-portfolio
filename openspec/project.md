# Project Context

## Purpose
Professional portfolio site for Oz Keisar - Engineering Manager & AI Innovation Lead. Demonstrate quality as a programmer, team leader, and technical innovator through the site experience itself.

## Tech Stack
- React 19 + Vite + TypeScript
- Remotion (for animation patterns)
- Biome (linting/formatting)
- Deployed to GitHub Pages

---

## ABSOLUTE REQUIREMENTS - ANIMATION TECHNIQUE

**ALL element transitions, movements, and animations MUST use the morph pattern from `/Users/ozkeisar/addit/addit-demos/src/demos/FullFlowDemo.tsx` (line 274 button example).**

### Core Animation Principles (MANDATORY):

1. **Spring-based animations** for natural motion:
   ```tsx
   const progress = spring({
     frame,
     fps,
     config: { damping: 14, stiffness: 100 },
   });
   ```

2. **Interpolate for ALL value transitions** - Never CSS transitions:
   ```tsx
   const opacity = interpolate(progress, [0, 1], [0, 1]);
   const translateY = interpolate(progress, [0, 1], [30, 0]);
   const scale = interpolate(progress, [0, 1], [0.9, 1]);
   ```

3. **Crossfade pattern for state morphs** - Overlap fade-out/fade-in:
   ```tsx
   // Element A fades OUT (0 → 0.5 of progress)
   const elementAOpacity = interpolate(progress, [0, 0.5], [1, 0], {
     extrapolateRight: 'clamp',
   });

   // Element B fades IN (0.4 → 0.9 of progress) - OVERLAPS!
   const elementBOpacity = interpolate(progress, [0.4, 0.9], [0, 1], {
     extrapolateLeft: 'clamp',
     extrapolateRight: 'clamp',
   });
   ```

4. **Color morphing via RGB interpolation**:
   ```tsx
   const bgR = interpolate(progress, [0, 1], [10, 30]);
   const bgG = interpolate(progress, [0, 1], [22, 50]);
   const bgB = interpolate(progress, [0, 1], [40, 80]);
   // Use: background: `rgb(${bgR}, ${bgG}, ${bgB})`
   ```

5. **Width/dimension morphing** for smooth size changes:
   ```tsx
   const width = interpolate(progress, [0.3, 0.7], [380, 130], {
     extrapolateLeft: 'clamp',
     extrapolateRight: 'clamp',
   });
   ```

6. **ALL values must be responsive** - dynamically calculated based on screen size

### FORBIDDEN:
- CSS `transition` property
- CSS `animation` property
- Tailwind animation classes
- Any animation library that doesn't use frame-based interpolation

---

## Project Conventions

### Code Style
- Biome for linting and formatting
- Single quotes, semicolons
- Functional components with TypeScript

### Architecture Patterns
- Frame-based animation system (scroll position → frame → interpolated values)
- Mobile-first responsive design
- Component-based sections

## Domain Context
Target audience: Recruiters, potential clients, tech leaders seeking engineering talent.
Goal: Fast information delivery - busy professionals should grasp key info quickly.

## Important Constraints
- Single page application
- Full viewport sections
- Scroll-driven animations that work forwards AND backwards
- Must work seamlessly on mobile and desktop
- Deep blue background (#0a1628)
