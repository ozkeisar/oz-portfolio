# Tasks: Rebuild Impact Section

## Pre-Implementation
- [x] 0.1 Read Remotion skill files before any implementation:
  - `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
  - `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`
  - `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/sequencing.md`
- [x] 0.2 Review existing section patterns (SummarySection, ExperienceSection) for entrance/exit coordination

## 1. Cleanup - Remove Existing Components
- [x] 1.1 Delete `src/components/sections/ImpactSection.tsx`
- [x] 1.2 Delete `src/components/impact/MetricBox.tsx`
- [x] 1.3 Delete `src/components/impact/` directory if empty
- [x] 1.4 Verify build still compiles (may have temporary errors until new components created)

## 2. Data Layer Updates
- [x] 2.1 Update `src/data/impactData.ts`:
  - Add `icon` field to `ImpactMetric` type
  - Add `featured` boolean field to identify the hero metric
  - Assign icon identifiers to each metric
  - Mark "users" metric as featured

## 3. Create Base Components (No Animation)
- [x] 3.1 Create `src/components/impact/` directory structure
- [x] 3.2 Create `MetricCard.tsx` - supporting metric card component
  - Basic layout with number, label, sublabel
  - Responsive sizing (mobile vs desktop)
  - Accept `animationProgress` prop for later animation integration
- [x] 3.3 Create `FeaturedMetric.tsx` - hero metric component
  - Larger layout for featured metric
  - Same structure as MetricCard but with different sizing
  - Prominent number display
- [x] 3.4 Create new `ImpactSection.tsx` with:
  - Header (section number, title, profile image spacer)
  - Asymmetric grid layout (featured + supporting)
  - Responsive breakpoints (mobile vs desktop)
  - Basic entrance/exit animation structure (copy from ExperienceSection)

## 4. Add Entrance Animations
- [x] 4.1 Implement header entrance animation (fade + translateY)
- [x] 4.2 Implement featured metric entrance:
  - Scale from 0.85 → 1.0
  - Opacity from 0 → 1
  - Spring-based timing
- [x] 4.3 Implement supporting metrics cascade:
  - Staggered delays (10 frames between each)
  - Fade + slide from bottom
  - Row-by-row reveal pattern
- [x] 4.4 Coordinate all entrance timing with ProfileImageTransition

## 5. Add Number Counting Animation
- [x] 5.1 Implement number interpolation in FeaturedMetric
  - Start counting after card entrance settles
  - Use linear interpolation for count-up
- [x] 5.2 Implement number interpolation in MetricCard
  - Stagger based on entrance order
  - Shorter duration than featured
- [x] 5.3 Handle special number formats (M+, %, etc.)

## 6. Add Exit Animation
- [x] 6.1 Implement reverse animation (going back to Experience)
  - Fade out entranceProgress 1 → 0
  - Keep content stable (no slide)
- [x] 6.2 Implement forward exit (going to Skills)
  - Use calculateExitAnimation with direction 'right'
  - Standard slide-out pattern

## 7. Responsive Testing & Polish
- [x] 7.1 Test on mobile viewport (< 768px) - cards wrap appropriately
- [x] 7.2 Test on tablet viewport (768px - 1024px) - layout adapts
- [x] 7.3 Test on desktop viewport (> 1024px) - full layout displays
- [x] 7.4 Test forward navigation (Experience → Impact → Skills)
- [x] 7.5 Test backward navigation (Skills → Impact → Experience)
- [x] 7.6 Verify ProfileImageTransition sync

## 8. Build & Validation
- [x] 8.1 Run `npm run build` - ensure no TypeScript errors
- [x] 8.2 Run `npm run lint:fix` - fix any linting issues
- [x] 8.3 Visual review of animation timing
- [x] 8.4 Adjust `enterDuration` in `sections.ts` if needed

## 9. Optional Enhancements (Phase 2)
- [ ] 9.1 Add SVG icons for each metric type
- [ ] 9.2 Add subtle glow effect on featured metric
- [ ] 9.3 Add connecting lines between metrics (if desired)

## Dependencies
- Task 1 must complete before Task 3
- Task 2 can run in parallel with Task 1
- Task 3 must complete before Task 4, 5, 6
- Task 4, 5, 6 can be developed incrementally
- Task 7 requires Tasks 4, 5, 6 complete
- Task 8 is final validation
