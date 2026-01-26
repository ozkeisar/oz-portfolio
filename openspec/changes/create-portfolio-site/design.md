# Design: Oz Keisar Portfolio Site

## Context
Creating a single-page portfolio that uses scroll-driven animations to present Oz Keisar's professional profile. The site must demonstrate technical excellence through its implementation while remaining performant on mobile devices.

**Key Constraint**: ALL animations MUST follow the morph pattern from `/Users/ozkeisar/addit/addit-demos/src/demos/FullFlowDemo.tsx` - using `spring()` and `interpolate()` functions, never CSS transitions.

## Goals / Non-Goals

### Goals
- Scroll-driven frame-based animation system
- Bidirectional playback (scroll up = reverse)
- Seamless mobile and desktop experience
- Fast information delivery for busy professionals
- SVG line-drawing animations for contact icons

### Non-Goals
- Multi-page navigation
- Backend/API integration
- CMS or content management
- Video/audio media embedding

## Architecture

### Animation Flow
```
User Scroll → Scroll Position (px) → Frame Number → Section Progress → Element Values
```

### Frame Distribution (Total: 900 frames)
| Section | Frame Range | Duration |
|---------|-------------|----------|
| Hero | 0-100 | Entry + static |
| Summary | 100-250 | Photo + bio |
| Experience | 250-500 | Timeline build |
| Impact | 500-650 | Numbers animate |
| Skills | 650-800 | Grid reveal |
| Contact | 800-900 | Icons draw |

### Component Hierarchy
```
App
└── AnimationCanvas (full viewport)
    └── ScrollController (provides frame context)
        ├── HeroSection
        ├── SummarySection (with photo)
        ├── ExperienceSection (vertical timeline)
        ├── ImpactSection (animated numbers)
        ├── SkillsSection (grid)
        └── ContactSection (SVG line icons)
```

## Decisions

### 1. Frame-Based Animation System
**Decision**: Use pure `interpolate()` function for all animations, no CSS.

**Rationale**:
- Enables scroll-driven control (bidirectional)
- Consistent with Remotion patterns
- Full control over timing curves
- No layout thrashing from CSS recalculation

**Implementation**:
```tsx
const interpolate = (
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options?: { extrapolateLeft?: 'clamp'; extrapolateRight?: 'clamp' }
) => { ... }
```

### 2. Spring Function for Entrance Animations
**Decision**: Implement spring physics for initial load animation.

**Rationale**: Natural feeling motion for one-time entrance effects.

### 3. Color System with RGB Objects
**Decision**: Store colors as `{ r, g, b }` objects for morphing.

**Rationale**: Enables smooth color transitions via interpolating each channel.

```tsx
const colors = {
  background: { r: 10, g: 22, b: 40 },
  accent: { r: 251, g: 191, b: 36 },
};
```

### 4. SVG Line Drawing for Contact Icons
**Decision**: Use `stroke-dasharray` and `stroke-dashoffset` animated via interpolate.

**Rationale**: Creates "drawing" effect without morphing shapes, more elegant for icons.

```tsx
const pathLength = getTotalLength();
const dashOffset = interpolate(progress, [0, 1], [pathLength, 0]);
```

### 5. Responsive Values via Interpolation
**Decision**: All sizing values derived from viewport dimensions.

**Rationale**: Single source of truth, no media queries needed.

```tsx
const fontSize = interpolate(viewportWidth, [320, 1200], [32, 80]);
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Performance on low-end mobile | Use `will-change: transform` sparingly, batch reads |
| Scroll jank | Use passive scroll listeners, requestAnimationFrame |
| Large bundle size | Tree-shake unused Remotion code |
| Browser compatibility | Test on Safari, handle vendor prefixes |

## Open Questions
- Exact photo of Oz to use (user to provide)
- Specific accent color shade (gold #fbbf24 as starting point)
