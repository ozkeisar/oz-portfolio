# Tasks: Redesign Experience Section

## Pre-Implementation
**IMPORTANT**: Before starting any task, read the Remotion best practices:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`

---

## Phase 1: Foundation

### Task 1.1: Create Experience Data Structure
- [x] Create `src/data/experienceData.ts`
- [x] Define `ExperienceItem` type
- [x] Extract career history from `Oz-Keisar-Professional-Summary.md`
- [x] Include: role, company, client, period, description, achievements
- **Verification**: Data compiles, all 7 career items included

### Task 1.2: Delete Current ExperienceSection
- [x] Remove `src/components/sections/ExperienceSection.tsx`
- [x] Update any imports that reference it
- [x] Create placeholder component that renders null
- **Verification**: Build passes, no runtime errors

### Task 1.3: Update Section Config
- [x] Modify `config/sections.ts` for experience section
- [x] Set `hasOverflowContent: true`
- [x] Adjust `enterDuration` for initial typewriter animation
- **Verification**: Config validates, section transitions work

---

## Phase 2: Summary Section Updates

### Task 2.1: Remove Slide-Out Exit for Experience Transition
- [x] Modify SummarySection exit animation
- [x] When next section is 'experience', use backward-write instead of slide
- [x] Keep existing backward-write for hero transition
- **Verification**: Summary text deletes when transitioning to experience

### Task 2.2: Update ProfileImageTransition for Experience
- [x] Add `experienceVisibility` from `useSectionVisibility`
- [x] Calculate experience section header position
- [x] Image moves from summary position to experience header
- [x] Handle both forward and backward transitions
- **Verification**: Image smoothly transitions summary → experience

---

## Phase 3: Core Experience Components

### Task 3.1: Create TimelineItem Component
- [x] Create `src/components/experience/TimelineItem.tsx`
- [x] Props: item data, state (stacked/active/upcoming), progress values
- [x] Stacked state: compact single line (title | company | date)
- [x] Active state: expanded with typewriter text
- [x] Use `interpolate()` for all size/position animations
- **Verification**: Component renders in all three states

### Task 3.2: Create TimelineRail Component
- [x] Create `src/components/experience/TimelineRail.tsx`
- [x] Vertical line with dots for each item
- [x] Active dot highlighted and scaled
- [x] Progress indicator between dots
- [x] Hide on mobile (< 768px)
- **Verification**: Rail displays, dots positioned correctly

### Task 3.3: Create Scroll-to-Item Mapping Logic
- [x] Create `src/hooks/useTimelineScroll.ts`
- [x] Map `contentScrollOffset` to item index and local progress
- [x] Define scroll phases: writing, visible, collapsing
- [x] Calculate max scroll based on item count
- **Verification**: Hook returns correct values for various scroll positions

---

## Phase 4: Experience Section Assembly

### Task 4.1: Create ExperienceSection Shell
- [x] Create new `src/components/sections/ExperienceSection.tsx`
- [x] Use `useAnimationContext` and `useSectionVisibility`
- [x] Header with section number and dynamic image spacer (like Summary)
- [x] Container for timeline rail and content area
- **Verification**: Section renders, visibility logic works

### Task 4.2: Implement Entrance Animation
- [x] First item writes during `TRANSITIONING` state
- [x] Use `sequenceFrame` for typewriter timing
- [x] Header and timeline fade in with spring animation
- [x] Set `maxContentScroll` when entering complete
- **Verification**: Entrance animation plays smoothly

### Task 4.3: Implement Scroll-Controlled Item Progression
- [x] Active item renders with typewriter based on scroll
- [x] Stacked items render above in compact form
- [x] Upcoming items hidden
- [x] Items transition between states as scroll progresses
- **Verification**: Scrolling down progresses through items

### Task 4.4: Implement Item Collapse Animation
- [x] When localProgress > 0.7, item begins collapsing
- [x] Text backward-writes (characters delete)
- [x] Height shrinks from expanded to stacked
- [x] Item moves upward to stack position
- **Verification**: Items collapse smoothly

### Task 4.5: Implement Item Stack Animation
- [x] Collapsed items stack at top of content area
- [x] Each stacked item offset by `stackedItemHeight`
- [x] Stacked items show only title line
- [x] Stack scrolls if too many items
- **Verification**: Multiple items stack correctly

---

## Phase 5: Backward Navigation

### Task 5.1: Handle Backward Scroll Within Experience
- [x] Scrolling up reverses item progression
- [x] Collapsed items expand back
- [x] Text re-types (forward typewriter)
- [x] Items unstack and move back down
- **Verification**: Backward scroll reverses animations

### Task 5.2: Handle Backward Transition to Summary
- [x] When at scroll top and scroll backward, exit to summary
- [x] Experience items collapse/hide during exit
- [x] Image transitions back to summary position
- **Verification**: Smooth backward transition to summary

---

## Phase 6: Polish

### Task 6.1: Mobile Responsiveness
- [x] Hide timeline rail on mobile
- [x] Full-width content area
- [x] Adjust padding and font sizes
- [x] Test touch scroll
- **Verification**: Works on mobile viewport

### Task 6.2: Performance Optimization
- [x] Memoize TimelineItem components
- [x] Only render visible items + buffer
- [x] Use transform-only animations
- **Verification**: Smooth 60fps animations

### Task 6.3: Edge Cases
- [x] Rapid scroll handling
- [x] Section boundary behavior
- [x] Resize handling
- [x] First/last item bounds
- **Verification**: No glitches in edge cases

---

## Validation Checklist

- [x] `npm run build` passes
- [x] `npm run lint` passes
- [x] Entrance animation plays correctly
- [x] Scroll controls item progression
- [x] Items stack/unstack smoothly
- [x] Backward scroll reverses animations
- [x] Summary → Experience transition smooth
- [x] Experience → Summary transition smooth
- [x] Works on desktop (> 768px)
- [x] Works on mobile (< 768px)
- [x] Image transitions through all states
- [x] Timeline indicator syncs with content
