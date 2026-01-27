# Change: Rebuild Impact Section with Beautiful Visual Design

## Why
The current Impact section displays metrics in a uniform grid of boxes. While functional, it lacks the visual punch and personality that would make it memorable. As this section showcases Oz's career achievements, it should have a distinctive, beautiful design that reflects his personal style - technical precision combined with human impact.

## What Changes
- **DELETE** current `ImpactSection.tsx` and `MetricBox.tsx` components entirely - start fresh
- **CREATE** new `ImpactSection.tsx` with a distinctive "Achievement Constellation" design
- **CREATE** new animated components for displaying metrics with visual storytelling
- **UPDATE** `impactData.ts` to include icon identifiers for each metric
- **PRESERVE** all existing animation patterns (spring, interpolate, entrance/exit coordination)
- **PRESERVE** ProfileImageTransition integration and header spacer logic

## Design Vision: "Achievement Constellation"

**Visual Concept:**
A large featured metric (1M+ Users) takes center stage, with supporting metrics arranged in an asymmetric, editorial layout. Each metric has an animated geometric symbol that represents its category (people, time, tools, etc.).

**Animation Sequence:**
1. Header with section number fades in
2. Featured metric animates in (scale + fade) with SVG symbol drawing
3. Supporting metrics cascade in with staggered delays
4. Numbers count up after their containers settle
5. Subtle glow/accent effects add polish

**Key Differentiators from Current:**
- Asymmetric layout vs. uniform grid
- Featured/hero metric treatment
- Custom SVG symbols for each achievement type
- More dramatic entrance animations
- Editorial typography hierarchy

## Impact
- Affected code: `src/components/sections/ImpactSection.tsx` (delete & recreate)
- Affected code: `src/components/impact/MetricBox.tsx` (delete)
- Affected code: `src/components/impact/*` (new components)
- Affected data: `src/data/impactData.ts` (minor updates)
- Affected config: `src/config/sections.ts` (timing may need adjustment)

## Technical Notes
- **MUST** read Remotion skill rules before implementation (animations.md, timing.md, sequencing.md)
- **MUST** follow project animation patterns from `project.md`
- **MUST** use spring-based animations, never CSS transitions
- **MUST** coordinate with ProfileImageTransition (header spacer, entrance timing)
- **MUST** work responsively on mobile and desktop
