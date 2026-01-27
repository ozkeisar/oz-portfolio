# Contact Section Implementation Tasks

## Pre-Implementation
- [x] 0.1 Read Remotion skill rules: `animations.md` and `timing.md`
- [x] 0.2 Review SummarySection.tsx bidirectional animation patterns
- [x] 0.3 Review SkillsSection.tsx entrance/exit patterns

## 1. Cleanup
- [x] 1.1 Delete existing `src/components/sections/ContactSection.tsx`

## 2. Data Layer
- [x] 2.1 Create contact methods data structure in new ContactSection.tsx
- [x] 2.2 Define contact card type with all fields (type, label, value, href, icon)

## 3. Icon Components
- [x] 3.1 Create PhoneIcon component with draw animation (progress prop)
- [x] 3.2 Create WhatsAppIcon component with draw animation (progress prop)
- [x] 3.3 Verify existing icons (EmailIcon, LinkedInIcon, GitHubIcon) support progress prop

## 4. Core Component Structure
- [x] 4.1 Create new `src/components/sections/ContactSection.tsx` with base structure
- [x] 4.2 Implement section visibility and animation context hooks
- [x] 4.3 Add section header with number (05.) matching other sections pattern

## 5. Animation Implementation
- [x] 5.1 Implement effectiveFrame pattern for bidirectional animations
- [x] 5.2 Implement Phase 1: Header reveal animation (frames 0-30)
- [x] 5.3 Implement Phase 2: Central invitation animation (frames 20-60)
- [x] 5.4 Implement Phase 3: Primary contact nodes with stagger (frames 40-120)
- [x] 5.5 Implement Phase 4: Secondary contact nodes (frames 80-140)
- [x] 5.6 Implement connection line SVG draw animations (integrated into icon draw progress)
- [x] 5.7 Implement exit animation (reverse of entrance)
- [x] 5.8 Implement backward entrance animation (from end of page)

## 6. Contact Card Component
- [x] 6.1 Create inline ContactCard component with icon, label, value
- [x] 6.2 Add card styling with gradient background and border glow
- [x] 6.3 Implement card entrance animation with scale and opacity
- [x] 6.4 Add ambient glow/pulse effect (frame-based)

## 7. Central Invitation
- [x] 7.1 Create central invitation text element
- [x] 7.2 Add scale and fade animation
- [x] 7.3 Implement ambient glow effect

## 8. Connection Lines (SVG)
- [x] 8.1 Icon draw animations serve as visual connection (simplified approach)
- [x] 8.2 Border glow provides visual connectivity
- [x] 8.3 Implement strokeDashoffset animation via interpolate (in icons)

## 9. Responsive Design
- [x] 9.1 Implement mobile layout (< 768px) - vertical card stack
- [x] 9.2 Implement tablet layout (768-1024px) - 2-column grid
- [x] 9.3 Implement desktop layout (> 1024px) - constellation layout
- [x] 9.4 Adjust animation complexity per breakpoint

## 10. Section Configuration
- [x] 10.1 Update `src/config/sections.ts` with new Contact section timing

## 11. Polish
- [x] 11.1 Ensure smooth entrance/exit timing with Skills section
- [x] 11.2 Fine-tune spring configs for natural motion
- [x] 11.3 Verify no CSS transitions/animations (frame-based only)
- [x] 11.4 Add footer text with build credit

## 12. Validation
- [x] 12.1 Run `npm run lint:fix` and fix any issues
- [x] 12.2 Run `npm run build` and verify no errors
- [ ] 12.3 Test on mobile viewport
- [ ] 12.4 Test on desktop viewport
- [ ] 12.5 Test animation playback in both directions
- [ ] 12.6 Verify all contact links work correctly
