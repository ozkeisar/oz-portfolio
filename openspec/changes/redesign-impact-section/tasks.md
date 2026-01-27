# Tasks: Redesign Impact Section

**Remotion Skill Reminder**: Before starting implementation, read:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`

## 1. Preparation

- [x] 1.1 Delete existing `src/components/sections/ImpactSection.tsx`
- [x] 1.2 Create `src/data/impactData.ts` with metrics configuration

## 2. ProfileImageTransition Updates

- [x] 2.1 Add Impact section visibility detection (`useSectionVisibility('impact')`)
- [x] 2.2 Calculate Impact header position for desktop (centered)
- [x] 2.3 Calculate Impact header position for mobile (in header row)
- [x] 2.4 Add `impactTransitionProgress` calculation (Experience → Impact)
- [x] 2.5 Add `isTransitioningToImpact` and `isTransitioningFromImpact` conditions
- [x] 2.6 Update position interpolation to include Impact as a destination

## 3. Section Configuration

- [x] 3.1 Update `src/config/sections.ts` - set Impact `enterDuration` to 180 frames
- [x] 3.2 Verify `hasOverflowContent: false` (animation-based, not scroll-driven)

## 4. ImpactSection Component - Structure

- [x] 4.1 Create new `src/components/sections/ImpactSection.tsx` with basic structure
- [x] 4.2 Add section header with "03. Impact" title
- [x] 4.3 Add mobile image spacer in header (like Experience)
- [x] 4.4 Create responsive grid layout for metric boxes (4 columns desktop, 2 mobile)

## 5. SVG MetricBox Component

- [x] 5.1 Create `src/components/impact/MetricBox.tsx` component
- [x] 5.2 Implement SVG rect with `stroke-dasharray` for line-drawing effect
- [x] 5.3 Calculate path length for stroke animation
- [x] 5.4 Add spring-based `drawProgress` animation
- [x] 5.5 Implement `strokeDashoffset` interpolation (pathLength → 0)

## 6. Number Counting Animation

- [x] 6.1 Add number counting animation in MetricBox (starts after box draws)
- [x] 6.2 Implement staggered delay per metric box
- [x] 6.3 Add suffix display ('+', 'M+', '%')
- [x] 6.4 Add label text animation (appears with number)

## 7. Animation Sequencing

- [x] 7.1 Profile image entrance: frames 0-30
- [x] 7.2 Header fade in: frames 0-40
- [x] 7.3 Box 1 draws: frames 20-60
- [x] 7.4 Box 2 draws: frames 35-75
- [x] 7.5 Box 3 draws: frames 50-90
- [x] 7.6 Box 4 draws: frames 65-105
- [x] 7.7 Numbers count up: frames 60-120 (staggered per box)

## 8. Exit Animation

- [x] 8.1 Implement exit animation (slide right, matching Experience pattern)
- [x] 8.2 Ensure ProfileImageTransition handles Impact → Skills transition

## 9. Responsive Design

- [x] 9.1 Test and adjust desktop layout (4 columns)
- [x] 9.2 Test and adjust mobile layout (2 columns)
- [x] 9.3 Ensure responsive font sizes for numbers and labels
- [x] 9.4 Verify profile image positioning on both breakpoints

## 10. Testing & Polish

- [x] 10.1 Test full flow: Experience → Impact → Skills
- [x] 10.2 Test backward navigation: Skills → Impact → Experience
- [x] 10.3 Verify animation timing feels right (not too fast/slow)
- [x] 10.4 Run build and lint checks
- [x] 10.5 Test on mobile viewport sizes

## Dependencies

- Tasks 2.x depend on understanding existing ProfileImageTransition patterns
- Tasks 5.x and 6.x can be developed in parallel
- Task 7.x (sequencing) requires tasks 4-6 to be complete
- Task 8 requires task 7 to be complete for timing coordination
