# Tasks: Remove Mobile Code from Desktop Page

## Overview
Remove all mobile-specific code from the desktop-only App page since mobile users are now routed to the separate Home page.

---

## Phase 1: Section Components (Parallelizable)

### Task 1.1: Clean HeroSection.tsx
- [x] Remove mobile-specific responsive values (already minimal mobile code)
- [x] Simplify `responsiveValue` calls to use desktop range (768-1200)
- [x] Verify animations work correctly

### Task 1.2: Clean SummarySection.tsx
- [x] Remove `isMobile` variable and all conditionals using it
- [x] Remove mobile photo size calculations
- [x] Remove mobile layout (column direction)
- [x] Remove mobile image spacer code
- [x] Remove mobile-specific `availableHeight` calculation
- [x] Simplify to desktop-only row layout

### Task 1.3: Clean ExperienceSection.tsx
- [x] Remove `isMobile` variable and all conditionals
- [x] Remove mobile layout adjustments
- [x] Remove mobile image spacer code
- [x] Keep desktop timeline rail visible always
- [x] Simplify content max-width calculation

### Task 1.4: Clean ImpactSection.tsx
- [x] Remove `isMobile` variable and conditionals
- [x] Remove mobile image size calculations
- [x] Simplify to desktop-only layout

### Task 1.5: Clean SkillsSection.tsx
- [x] Remove `isMobile` variable and all conditionals
- [x] Remove mobile network size calculations
- [x] Remove mobile orbit/radius adjustments
- [x] Remove mobile image spacer code
- [x] Remove `isMobile` prop from child components (CategoryNode, SkillNode)
- [x] Simplify CategoryNode to desktop-only (always show name)
- [x] Simplify SkillNode sizing to desktop values
- [x] Remove MobileSkillsLayout component (unused)

### Task 1.6: Clean ContactSection.tsx
- [x] Remove `isMobile` variable and conditionals
- [x] Remove mobile layout (column direction for contact cards)
- [x] Remove mobile sizing for profile image placeholder
- [x] Simplify to desktop row layouts

---

## Phase 2: Supporting Components

### Task 2.1: Clean ProfileImageTransition.tsx
- [x] Remove `isMobile` variable and all conditionals (extensive mobile code)
- [x] Remove mobile-specific position calculations for each section
- [x] Remove mobile image size variants
- [x] Remove mobile border/shadow adjustments
- [x] Remove mobile scroll progress logic
- [x] Simplify to desktop-only transition logic

### Task 2.2: Clean TimelineItem.tsx
- [x] Remove `isMobile` variable and conditionals
- [x] Remove mobile minHeight adjustments
- [x] Simplify to desktop-only layout

### Task 2.3: Clean MetricCard.tsx (if has mobile code)
- [x] Checked - no mobile code present

### Task 2.4: Clean FeaturedMetric.tsx (if has mobile code)
- [x] Checked - no mobile code present

---

## Phase 3: Utilities

### Task 3.1: Update useViewport.ts for desktop-only usage
- [x] Keep `isMobile` for now (used by Home page components)
- [x] Document that desktop App page ignores mobile breakpoints

---

## Phase 4: Validation

### Task 4.1: Build and test
- [x] Run `npm run build` to verify no TypeScript errors
- [x] Run `npm run lint:fix` to format modified files
- [ ] Test desktop page at various desktop widths (768px, 1024px, 1440px)
- [ ] Verify all animations work correctly
- [ ] Verify profile image transitions work at all desktop sizes

### Task 4.2: Code review
- [x] Search for any remaining `isMobile` references in desktop components
- [x] Search for any remaining `< 768` conditionals in desktop components
- [x] Verify no broken imports or unused variables

---

## Completion Criteria
- [x] No `isMobile` conditionals in any `src/components/sections/*.tsx` files
- [x] No `isMobile` conditionals in `ProfileImageTransition.tsx`
- [x] No mobile-specific layouts (column stacking) in desktop components
- [x] Build passes with no errors
- [ ] Desktop page renders correctly at 768px+ widths (manual testing required)
