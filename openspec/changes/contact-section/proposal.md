# Contact Section Redesign

## Overview
Complete redesign of the Contact section from scratch. Delete the existing `ContactSection.tsx` and create a beautiful, immersive contact experience with multiple connection methods, frame-based animations, and bidirectional animation support.

## Motivation
The current Contact section is minimal with only 3 contact options (LinkedIn, GitHub, Email). As the portfolio's final impression, it deserves:
- More connection methods (WhatsApp, phone)
- A beautiful visual design that reflects Oz's personal touch
- Proper bidirectional animation patterns matching other sections
- A memorable closing experience for visitors

## Contact Methods to Include
1. **Email**: ozkeisar@gmail.com
2. **Phone**: 058-5999-0055
3. **WhatsApp**: Using phone number (wa.me/972585990055)
4. **LinkedIn**: linkedin.com/in/oz-keisar
5. **GitHub**: github.com/ozkeisar

## Design Vision
A constellation-inspired layout where contact methods radiate from a central invitation. The design should feel:
- **Welcoming**: Personal invitation to connect
- **Professional**: Clean, sophisticated aesthetics
- **Dynamic**: Animated elements that draw attention without overwhelming
- **Cohesive**: Matches the established portfolio visual language

## Animation Requirements
- **Frame-based only**: NO CSS transitions or animations (FORBIDDEN per project rules)
- **Bidirectional**: Support entering forward (from Skills), entering backward (from end), and exiting
- **Complete before scroll**: Animation finishes entirely before user can proceed
- **Coordinated timing**: Entrance/exit coordination with Skills section

## Pre-Implementation Requirement
**IMPORTANT**: Before implementing any animation code, read the Remotion skill rules:
- `~/.claude/skills/remotion-best-practices/rules/animations.md`
- `~/.claude/skills/remotion-best-practices/rules/timing.md`

## Technical Approach
- Use `useSectionVisibility('contact')` for state management
- Implement `effectiveFrame` pattern for bidirectional animation mapping
- Spring-based animations with `{ damping: 14, stiffness: 80 }` config
- Responsive design with `responsiveFontSize()`, `responsiveSpacing()`, `responsiveValue()`
- Section header pattern: "05." prefix matching other sections

## Success Criteria
- Beautiful visual design that impresses visitors
- Smooth bidirectional animations (forward/backward)
- All contact methods functional with proper links
- Responsive across mobile/tablet/desktop
- No CSS transitions or animations
- Passes lint and build checks
