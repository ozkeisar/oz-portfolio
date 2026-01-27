# Change: Redesign Impact Section

## Why

The current Impact section uses generic placeholder metrics and basic fade-in animations. It needs to be redesigned to:
1. Display real, verified metrics from Oz Keisar's professional history
2. Feature visually stunning SVG line-drawing animations (no fade-in)
3. Integrate the profile image component like Summary and Experience sections
4. Use animation-based sequencing (not scroll-driven) for dramatic entrance

## What Changes

- **DELETE** existing `ImpactSection.tsx` entirely - start fresh
- **CREATE** new `ImpactSection.tsx` with:
  - Profile image animates into header row (matching Summary/Experience pattern)
  - SVG metric boxes with stroke-dasharray line-drawing animation
  - Staggered sequence: image → boxes draw → numbers count up
  - Animation blocks scrolling until complete
- **CREATE** `impactData.ts` for metrics configuration
- **UPDATE** `ProfileImageTransition.tsx` to support Impact section positioning
- **UPDATE** `sections.ts` config if animation timing changes needed

## Impact

- **Affected specs**: impact-section (new capability)
- **Affected code**:
  - `src/components/sections/ImpactSection.tsx` (delete & recreate)
  - `src/components/ProfileImageTransition.tsx` (add Impact position)
  - `src/data/impactData.ts` (new file)
  - `src/config/sections.ts` (timing adjustments)

## Key Design Decisions

1. **Animation-driven, not scroll-driven**: Section locks scrolling during entrance animation
2. **SVG line-drawing**: Uses `stroke-dasharray` and `stroke-dashoffset` animated via `interpolate()`
3. **Real metrics**: 9+ years, 1M+ users, 12 juniors trained, 40% improvement (from professional summary)
4. **Sequence**: Image → SVG outlines draw → numbers count up

## Remotion Skill Reminder

**IMPORTANT**: Before implementing, read the Remotion skill files:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`

Key principles:
- ALL animations MUST use `interpolate()` and `spring()` - NO CSS transitions/animations
- Frame-based animation driven by `sequenceFrame`
- Use `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'` for bounded values
