# Proposal: Remove Mobile Code from Desktop Page

## Summary

Clean up all mobile-related code, responsive breakpoints, and conditional mobile rendering from the original desktop-only page (App.tsx and its components). Since the app now dynamically routes mobile users to the new Home page at app startup, the original page only needs to support desktop displays (≥768px).

## Context

The application now uses device-based routing in `main.tsx`:
- Mobile devices (width < 768px): Render the new `Home` page (Framer Motion)
- Desktop devices (width ≥ 768px): Render the original `App` page (Remotion)

This means all mobile-specific code in the desktop page is dead code that:
- Increases bundle size unnecessarily
- Adds complexity to components
- Creates maintenance burden
- Can cause confusion when reading the codebase

## Scope

### In Scope (Desktop Page Components)
Files that need mobile code removal:
- `src/components/sections/HeroSection.tsx`
- `src/components/sections/SummarySection.tsx`
- `src/components/sections/ExperienceSection.tsx`
- `src/components/sections/ImpactSection.tsx`
- `src/components/sections/SkillsSection.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/components/ProfileImageTransition.tsx`
- `src/components/experience/TimelineItem.tsx`
- `src/components/impact/MetricCard.tsx`
- `src/components/impact/FeaturedMetric.tsx`
- `src/hooks/useViewport.ts` (remove `isMobile` flag, keep responsive utilities for desktop range)

### Out of Scope
- `src/components/home/*` - Mobile Home page components (still need responsive code)
- `src/pages/Home.tsx` - Mobile Home page
- `src/styles/home.css` - Mobile Home page styles

## Changes Required

1. **Remove `isMobile` conditionals** - Replace with desktop-only values
2. **Simplify responsive utilities** - Use fixed desktop values or narrow desktop range (768-1200px)
3. **Remove mobile-specific layouts** - Column stacking, mobile spacing, etc.
4. **Remove mobile image/spacer code** - Mobile-specific positioning calculations
5. **Clean up useViewport hook** - Remove mobile breakpoint logic for desktop page usage

## Non-Goals

- This proposal does NOT remove the `useViewport` hook entirely (still needed for desktop responsive scaling)
- This proposal does NOT modify the mobile Home page components
- This proposal does NOT change the routing logic
