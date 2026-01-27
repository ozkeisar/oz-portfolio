# Redesign Experience Section

## Summary

Complete redesign of the Experience section with scroll-driven timeline animation. The profile image transitions from Summary section, first timeline item writes during entrance, then user scroll controls the progression through career history with typewriter effects and stacking animations.

## Motivation

The current Experience section uses a basic timeline layout. The new design creates a cinematic, scroll-controlled experience where:
- Career progression unfolds as user scrolls
- Each role expands/contracts with typewriter text animation
- Completed items shrink and stack upward
- Timeline indicator syncs with scroll progress

## Key Design Decisions

### Animation Approach
**IMPORTANT**: Before implementing, read the Remotion best practices skill files:
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/animations.md`
- `/Users/ozkeisar/.claude/skills/remotion-best-practices/rules/timing.md`

All animations use frame-based `interpolate()` and `spring()` functions per project requirements.

### Section Transition
1. **No fade-out exit from Summary** - Remove slide-out animation when transitioning to Experience
2. **Image continuation** - ProfileImageTransition moves to Experience section header
3. **Backward writing exit** - Summary text deletes (reverse typewriter) as exit animation

### Experience Section Flow

#### Entrance Animation (Auto-play)
1. Image animates into section header position
2. First timeline item (current role) writes fast via typewriter
3. Timeline indicator appears synced with text progress
4. Animation completes → control passes to user scroll

#### Scroll-Controlled Content
User scroll drives `contentScrollOffset` which maps to:
1. **Current item backward-writes** - Text deletes character by character
2. **Item shrinks** - Full content → title only → compact stacked form
3. **Item stacks upward** - Moves to top, joins previously completed items
4. **Next item writes** - New role expands and typewriter begins
5. **Timeline updates** - Indicator moves to current position

### Data Structure

Timeline items from `Oz-Keisar-Professional-Summary.md`:
1. **AI Solution Architect & R&D Manager** (2024-Present) - Abra
2. **Team Lead - Mobile Development** (2023-2024) - Leumi Bank & Pepper
3. **Team Lead** (2021-2023) - Oosto
4. **Team Lead** (2020-2021) - Aspect Imaging
5. **Full Stack Developer** (2019-2020) - Champion Motors
6. **Full Stack Developer** (2019) - Zebra Medical Vision
7. **Full Stack Developer** (2015-2017) - IDF Israeli Air Force

## Scope

### In Scope
- Delete current ExperienceSection.tsx and create from scratch
- ProfileImageTransition updates for Experience section
- Summary section exit animation change (backward-write instead of slide)
- New scroll-controlled timeline component
- Stacking animation for completed items
- Section config updates

### Out of Scope
- Changes to other sections (Impact, Skills, Contact)
- Changes to animation controller core logic
- Mobile-specific layouts (follow existing responsive patterns)

## Dependencies

- Existing animation system (`useAnimationContext`, `useSectionVisibility`)
- Typewriter component (may need enhancements)
- ProfileImageTransition component
- Section config in `config/sections.ts`

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Complex scroll math | Break into discrete scroll "segments" per timeline item |
| Performance with many DOM updates | Use CSS transforms, minimize re-renders |
| Backward animation timing | Reuse proven patterns from Summary section |

## Success Criteria

1. Smooth entrance animation with typewriter effect
2. Scroll controls timeline progression bidirectionally
3. Items stack/unstack smoothly
4. Works on mobile and desktop
5. Timeline indicator syncs with content
6. Backward scroll reverses the animation naturally
