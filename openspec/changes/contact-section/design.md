# Contact Section Design Document

## Pre-Implementation Requirement
**READ FIRST** before any animation implementation:
- `~/.claude/skills/remotion-best-practices/rules/animations.md`
- `~/.claude/skills/remotion-best-practices/rules/timing.md`

## Visual Design Concept

### Layout Structure
```
┌─────────────────────────────────────────┐
│                                         │
│    05. ────────── Let's Connect         │
│                                         │
│         ┌─────────────────────┐         │
│         │  Central Invitation │         │
│         │  "Ready to Build    │         │
│         │   Something Great?" │         │
│         └─────────────────────┘         │
│                    │                    │
│     ┌──────────────┼──────────────┐     │
│     │              │              │     │
│   [Email]      [Phone]      [WhatsApp]  │
│     │              │              │     │
│     └──────────────┼──────────────┘     │
│                    │                    │
│         ┌─────────┴─────────┐           │
│         │                   │           │
│     [LinkedIn]         [GitHub]         │
│                                         │
│    ─── Built with React + Remotion ───  │
└─────────────────────────────────────────┘
```

### Desktop Layout
- Central invitation text with ambient glow effect
- Contact nodes arranged in two rows: primary (Email, Phone, WhatsApp) and secondary (LinkedIn, GitHub)
- Connecting lines from center to each node (SVG animated paths)
- Subtle floating animation on contact nodes

### Mobile Layout
- Vertical stack of contact methods
- Central invitation text at top
- Contact nodes as full-width cards with icon + text
- Simplified connection lines or gradient dividers

## Color Palette (from existing `colors.ts`)
- Background: Deep blue (#0a1628)
- Primary text: White/light gray
- Accent: Cyan/teal for highlights
- Card background: Semi-transparent with border glow
- Connection lines: Gradient from accent to transparent

## Animation Architecture

### Bidirectional Animation Pattern
Following SummarySection.tsx pattern with `effectiveFrame` mapping:

```typescript
// Constants for timing
const CONTACT_ENTER_DURATION = 180; // Full animation (~6 seconds)
const CONTACT_FAST_ENTER_DURATION = 75; // Fast enter from Skills
const CONTACT_REVERSE_DURATION = 75; // Reverse animation
const CONTACT_ENTER_DELAY = 30; // Wait for Skills exit to settle

let effectiveFrame: number;
const isExitingForward = isExiting && direction === 'forward';

if (isReversing || isExitingForward) {
  // Reverse: 180 → 0
  effectiveFrame = Math.max(0, CONTACT_ENTER_DURATION * (1 - sequenceFrame / CONTACT_REVERSE_DURATION));
} else if (isEnteringBackward) {
  // Entering from "end" (if applicable)
  effectiveFrame = Math.min(CONTACT_ENTER_DURATION, CONTACT_ENTER_DURATION * (sequenceFrame / CONTACT_FAST_ENTER_DURATION));
} else if (isEntering) {
  // Forward enter with delay
  const delayedFrame = Math.max(0, sequenceFrame - CONTACT_ENTER_DELAY);
  effectiveFrame = Math.min(CONTACT_ENTER_DURATION, CONTACT_ENTER_DURATION * (delayedFrame / CONTACT_FAST_ENTER_DURATION));
} else {
  effectiveFrame = CONTACT_ENTER_DURATION; // Idle - show full animation
}
```

### Animation Phases (using effectiveFrame)

**Phase 1: Header Reveal (frames 0-30)**
- Section number "05." fades in with spring
- Title "Let's Connect" slides in from right
- Horizontal line draws across

**Phase 2: Central Invitation (frames 20-60)**
- Central text container scales up from 0.8 to 1.0
- Text fades in with slight Y translation
- Ambient glow effect begins

**Phase 3: Contact Nodes (frames 40-120)**
- Primary row (Email, Phone, WhatsApp) appears with stagger
- Each node: scale spring + opacity fade
- Connection lines draw from center (SVG strokeDashoffset animation via interpolate)

**Phase 4: Secondary Nodes (frames 80-140)**
- LinkedIn and GitHub appear with stagger
- Connection lines complete

**Phase 5: Ambient Animation (frames 120+)**
- Subtle pulse on accent elements
- Gentle floating on nodes (optional, using continuous frame counter mod cycle)

### Exit Animation (Reverse)
When `isReversing` or `isExitingForward`:
- effectiveFrame counts down from 180 → 0
- All animations play in reverse order
- No slide-out transform (content fades/scales away)

## Component Structure

```
ContactSection.tsx
├── Section Container (absolute positioning, flex center)
├── Header Row
│   ├── Section Number ("05.")
│   ├── Title ("Let's Connect")
│   └── Horizontal Line
├── Central Invitation
│   └── Animated text with glow
├── Contact Grid
│   ├── Primary Row
│   │   ├── EmailCard
│   │   ├── PhoneCard
│   │   └── WhatsAppCard
│   └── Secondary Row
│       ├── LinkedInCard
│       └── GitHubCard
├── SVG Connection Lines (inline, animated)
└── Footer ("Built with React + Remotion")
```

## Contact Card Design

Each contact method as a card with:
- Icon (SVG with draw animation using `progress` prop)
- Label (contact type name)
- Value (actual email/phone/handle)
- Hover-like glow effect (frame-based, not CSS hover)

```typescript
type ContactCard = {
  type: 'email' | 'phone' | 'whatsapp' | 'linkedin' | 'github';
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ size: number; color: string; progress: number }>;
};

const contactMethods: ContactCard[] = [
  { type: 'email', label: 'Email', value: 'ozkeisar@gmail.com', href: 'mailto:ozkeisar@gmail.com', icon: EmailIcon },
  { type: 'phone', label: 'Phone', value: '058-599-90055', href: 'tel:+972585990055', icon: PhoneIcon },
  { type: 'whatsapp', label: 'WhatsApp', value: 'Message me', href: 'https://wa.me/972585990055', icon: WhatsAppIcon },
  { type: 'linkedin', label: 'LinkedIn', value: '/in/oz-keisar', href: 'https://linkedin.com/in/oz-keisar', icon: LinkedInIcon },
  { type: 'github', label: 'GitHub', value: '/ozkeisar', href: 'https://github.com/ozkeisar', icon: GitHubIcon },
];
```

## Responsive Breakpoints

### Mobile (< 768px)
- Vertical card stack
- Full-width contact cards
- Simplified or hidden connection lines
- Smaller font sizes
- Reduced animation complexity

### Tablet (768-1024px)
- 2-column grid for contact cards
- Proportionally scaled elements
- Full animation set

### Desktop (> 1024px)
- Full constellation layout
- Maximum visual impact
- Complete SVG connection lines

## Technical Constraints

### FORBIDDEN
- CSS `transition` property
- CSS `animation` property
- CSS hover pseudo-class effects
- Tailwind animation utilities
- Any non-frame-based animation

### REQUIRED
- All animations via `spring()` and `interpolate()` from Remotion
- `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'` on interpolations
- Responsive values via `responsiveFontSize()`, `responsiveSpacing()`, `responsiveValue()`
- Frame-based values for all visual properties

## Section Configuration Update

Update `src/config/sections.ts` to reflect new timing:

```typescript
{
  id: 'contact',
  enterDuration: 120, // ~4 seconds for full animation
  exitDuration: 45,
  exitDirection: 'right',
  hasOverflowContent: false,
}
```

## New Icons Required
- PhoneIcon (with draw animation support)
- WhatsAppIcon (with draw animation support)

Follow existing icon patterns (EmailIcon, LinkedInIcon, GitHubIcon) with:
- `size: number` prop
- `color: string` prop
- `progress: number` prop for SVG stroke animation
