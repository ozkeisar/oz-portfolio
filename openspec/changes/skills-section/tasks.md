# Skills Section Implementation Tasks

## Pre-Implementation
- [x] 0.1 Read Remotion skill rules: `animations.md` and `timing.md`
- [x] 0.2 Review SummarySection.tsx entrance/exit patterns
- [x] 0.3 Review ExperienceSection.tsx bidirectional animation patterns

## 1. Cleanup
- [x] 1.1 Delete existing `src/components/sections/SkillsSection.tsx`

## 2. Data Layer
- [x] 2.1 Create `src/data/skillsData.ts` with structured skill categories
- [x] 2.2 Define skill node positions/layouts for each breakpoint (polar coordinates for desktop, grid for mobile)

## 3. Core Component Structure
- [x] 3.1 Create new `src/components/sections/SkillsSection.tsx` with base structure
- [x] 3.2 Implement section visibility and animation context hooks
- [x] 3.3 Add section header with number (04.) matching Summary/Experience pattern

## 4. Network Visualization Components
- [x] 4.1 Create SkillNode component (inline) - individual skill display
- [x] 4.2 Create CategoryNode component (inline) - category hub with label
- [x] 4.3 Create ConnectionLine component (inline) - animated SVG connections
- [x] 4.4 Profile image acts as center node (via ProfileImageTransition)

## 5. Animation Implementation
- [x] 5.1 Implement Phase 1: Header reveal animation (frames 0-30)
- [x] 5.2 Implement "shared element" profile image transition from Impact to Skills center
- [x] 5.3 Implement Phase 2: Category expansion with springs (after image arrives, ~frame 75+)
- [x] 5.4 Implement connection line draw animation (extends from center)
- [x] 5.5 Implement Phase 3: Skill population with staggered timing
- [x] 5.6 Implement exit animation (reverse of entrance)
- [x] 5.7 Implement backward entrance animation (from Contact section)

## 6. Responsive Design
- [x] 6.1 Implement mobile layout (< 768px) - vertical card stack
- [x] 6.2 Implement tablet layout (768-1024px) - radial with limited space
- [x] 6.3 Implement desktop layout (> 1024px) - full radial network

## 7. ProfileImageTransition Integration
- [x] 7.1 Add Skills section visibility tracking
- [x] 7.2 Calculate Skills center position (center of network diagram)
- [x] 7.3 Add skillsTransitionProgress for smooth image movement
- [x] 7.4 Coordinate image arrival timing with Skills section animation

## 8. Polish
- [x] 8.1 Ensure smooth entrance/exit timing with adjacent sections
- [x] 8.2 Configure section config with proper enterDuration (285 frames)
- [x] 8.3 Verify no CSS transitions/animations (frame-based only)

## 9. Validation
- [x] 9.1 Run `npm run lint:fix` and fix any issues
- [x] 9.2 Run `npm run build` and verify no errors
- [ ] 9.3 Test on mobile viewport
- [ ] 9.4 Test on desktop viewport
- [ ] 9.5 Test animation playback in both directions
