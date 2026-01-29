import { memo } from 'react';
import type { ExperienceItem } from '../../data/experienceData';
import type { ItemState } from '../../hooks/useTimelineScroll';
import { responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import type { ViewportInfo } from '../../types/animation';
import { interpolate } from '../../utils/animation';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

type TimelineItemProps = {
  item: ExperienceItem;
  itemState: ItemState;
  viewport: ViewportInfo;
  /** Height when fully expanded */
  expandedHeight: number;
  /** Height when stacked (compact) */
  stackedHeight: number;
  /** Whether to use morph animation (circle → rectangle) when expanding */
  useMorphAnimation?: boolean;
};

/**
 * Individual timeline item component
 * Renders in three visual states: stacked (compact), active (expanded), upcoming (hidden)
 */
export const TimelineItem = memo(function TimelineItem({
  item,
  itemState,
  viewport,
  expandedHeight,
  stackedHeight,
  useMorphAnimation = false,
}: TimelineItemProps) {
  const { state, typewriterProgress, collapseProgress, isVisible } = itemState;

  // Don't render upcoming items
  if (!isVisible) {
    return null;
  }

  const isMobile = viewport.width < 768;

  // Morph animation for expanding items (circle → rectangle reveal)
  // Only applies when useMorphAnimation is true and state is 'expanding'
  const shouldMorph = useMorphAnimation && state === 'expanding';

  // Morph progress based on typewriter progress (0 = start, 1 = complete)
  // Scale: starts at 0.1 (small), grows to 1 (full size)
  const morphScale = shouldMorph
    ? interpolate(typewriterProgress, [0, 0.3], [0.1, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Border radius: starts at 50% (circle), morphs to 12px (card corners)
  const morphBorderRadius = shouldMorph
    ? interpolate(typewriterProgress, [0, 0.3], [50, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Opacity: fade in during morph
  const morphOpacity = shouldMorph
    ? interpolate(typewriterProgress, [0, 0.15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Transform origin: start from left edge (near image), move to center
  // morphOriginX is passed in pixels but we use percentage for transform-origin
  const morphOriginProgress = shouldMorph
    ? interpolate(typewriterProgress, [0, 0.3], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  // Start from 0% (left edge, closest to image) and move to 50% (center)
  const transformOriginXPercent = interpolate(morphOriginProgress, [0, 1], [0, 50]);
  const transformOriginYPercent = shouldMorph ? 0 : 50; // Start from top

  // Responsive typography
  const titleSize = responsiveFontSize(viewport.width, 16, 22);
  const subtitleSize = responsiveFontSize(viewport.width, 13, 15);
  const bodySize = responsiveFontSize(viewport.width, 13, 15);
  const basePadding = responsiveSpacing(viewport.width, 12, 20);

  // For stacked state, use final stacked values
  const isStacked = state === 'stacked';
  const effectiveCollapseProgress = isStacked ? 1 : collapseProgress;

  // Smoothly interpolate all visual properties during collapse
  // Card → Stacked transitions:
  // - padding vertical: basePadding → basePadding/2
  // - background opacity: 0.6 → 0.4
  // - border radius: 12 → 8
  // - border opacity: 0.3 → 0
  // - margin bottom: 8 → 4
  // - height: auto (expanded) → stackedHeight (collapsed)

  // Use auto height when fully expanded, fixed height when collapsing/collapsed
  const isFullyExpanded = effectiveCollapseProgress === 0;
  const currentHeight = isFullyExpanded
    ? 'auto'
    : interpolate(effectiveCollapseProgress, [0, 1], [expandedHeight, stackedHeight]);
  const paddingVertical = interpolate(
    effectiveCollapseProgress,
    [0, 1],
    [basePadding, basePadding / 2]
  );
  const paddingHorizontal = basePadding;
  const bgOpacity = interpolate(effectiveCollapseProgress, [0, 1], [0.6, 0.4]);
  const borderRadius = interpolate(effectiveCollapseProgress, [0, 1], [12, 8]);
  const borderOpacity = interpolate(effectiveCollapseProgress, [0, 1], [0.3, 0]);
  const marginBottom = interpolate(effectiveCollapseProgress, [0, 1], [8, 4]);

  // Opacity for expanded content (fades out during collapse)
  const expandedContentOpacity = interpolate(effectiveCollapseProgress, [0, 0.5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Opacity for compact header elements (fades in during collapse)
  const compactHeaderOpacity = interpolate(effectiveCollapseProgress, [0.5, 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Title size transition (from titleSize to subtitleSize)
  const currentTitleSize = interpolate(
    effectiveCollapseProgress,
    [0.5, 1],
    [titleSize, subtitleSize],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Title weight transition (from 600 to 500)
  const currentTitleWeight = interpolate(effectiveCollapseProgress, [0.5, 1], [600, 500], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ===========================================
  // Calculate typewriter effect for ALL content
  // ===========================================
  // Total content: description + achievements + technologies
  // We'll calculate the total "length" and distribute progress across all

  const descriptionText = item.description;
  const achievementsText = item.achievements || [];
  const technologiesText = item.technologies || [];

  // Calculate total content length for progress distribution
  // Description gets written first, then achievements, then technologies
  const descriptionLength = descriptionText.length;
  const achievementsTotalLength = achievementsText.reduce((acc, a) => acc + a.length, 0);
  const technologiesTotalLength = technologiesText.reduce((acc, t) => acc + t.length, 0);
  const totalContentLength = descriptionLength + achievementsTotalLength + technologiesTotalLength;

  // Calculate progress thresholds
  const descriptionEndProgress = descriptionLength / totalContentLength;
  const achievementsEndProgress = (descriptionLength + achievementsTotalLength) / totalContentLength;

  // Description typewriter
  const descriptionProgress = Math.min(1, typewriterProgress / descriptionEndProgress);
  const visibleDescriptionChars = Math.floor(descriptionProgress * descriptionText.length);
  const visibleDescription = descriptionText.slice(0, visibleDescriptionChars);
  const isDescriptionComplete = descriptionProgress >= 1;

  // Achievements typewriter (starts after description)
  const achievementsRawProgress = Math.max(0, (typewriterProgress - descriptionEndProgress) / (achievementsEndProgress - descriptionEndProgress));
  const achievementsProgress = Math.min(1, achievementsRawProgress);

  // Technologies typewriter (starts after achievements)
  const technologiesProgress = achievementsTotalLength > 0
    ? Math.max(0, (typewriterProgress - achievementsEndProgress) / (1 - achievementsEndProgress))
    : Math.max(0, (typewriterProgress - descriptionEndProgress) / (1 - descriptionEndProgress));

  // Calculate visible characters for each achievement
  const getVisibleAchievementText = (achievement: string, index: number) => {
    if (achievementsProgress <= 0) return '';

    // Calculate how much of the total achievements progress applies to this achievement
    let charsBefore = 0;
    for (let i = 0; i < index; i++) {
      charsBefore += achievementsText[i].length;
    }

    const totalAchievementsChars = achievementsProgress * achievementsTotalLength;
    const charsForThis = Math.max(0, totalAchievementsChars - charsBefore);
    const visibleChars = Math.min(achievement.length, Math.floor(charsForThis));

    return achievement.slice(0, visibleChars);
  };

  // Calculate visible technologies
  const getVisibleTechnologies = () => {
    if (technologiesProgress <= 0) return [];

    let charsSoFar = 0;
    const totalTechChars = technologiesProgress * technologiesTotalLength;
    const visibleTechs: string[] = [];

    for (const tech of technologiesText) {
      if (charsSoFar >= totalTechChars) break;

      const charsForThis = Math.min(tech.length, Math.floor(totalTechChars - charsSoFar));
      if (charsForThis > 0) {
        visibleTechs.push(tech.slice(0, charsForThis));
      }
      charsSoFar += tech.length;
    }

    return visibleTechs;
  };

  const visibleTechnologies = getVisibleTechnologies();

  // Show cursor at the end of currently writing content
  const showCursor = typewriterProgress > 0 && typewriterProgress < 1;

  return (
    <div
      style={{
        height: typeof currentHeight === 'number' ? currentHeight : undefined,
        minHeight: isFullyExpanded ? undefined : stackedHeight,
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        backgroundColor: toRgbaString(colors.cardBackground, bgOpacity),
        borderRadius: shouldMorph ? `${morphBorderRadius}%` : borderRadius,
        border:
          borderOpacity > 0.01 && !shouldMorph
            ? `1px solid ${toRgbaString(colors.cardBorder, borderOpacity)}`
            : 'none',
        marginBottom,
        overflow: isFullyExpanded ? 'visible' : 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Morph animation properties
        transform: shouldMorph ? `scale(${morphScale})` : undefined,
        transformOrigin: shouldMorph ? `${transformOriginXPercent}% ${transformOriginYPercent}%` : undefined,
        opacity: morphOpacity,
        // Ensure proper sizing on mobile
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* Header row - transitions from two-line to single-line layout */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: effectiveCollapseProgress > 0.7 ? 'nowrap' : 'wrap',
          minHeight: effectiveCollapseProgress > 0.8 ? stackedHeight - paddingVertical * 2 : 'auto',
        }}
      >
        {/* Role title */}
        <span
          style={{
            fontSize: currentTitleSize,
            fontWeight: currentTitleWeight,
            color: toRgbString(colors.textPrimary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            whiteSpace: effectiveCollapseProgress > 0.7 ? 'nowrap' : 'normal',
            overflow: effectiveCollapseProgress > 0.7 ? 'hidden' : 'visible',
            textOverflow: effectiveCollapseProgress > 0.7 ? 'ellipsis' : 'clip',
            flex: effectiveCollapseProgress > 0.7 ? '0 1 auto' : '1 0 auto',
          }}
        >
          {item.role}
        </span>

        {/* Separator and Company - appear during collapse */}
        {compactHeaderOpacity > 0 && (
          <>
            <span
              style={{
                fontSize: subtitleSize - 2,
                color: toRgbString(colors.textMuted),
                fontFamily: 'system-ui, -apple-system, sans-serif',
                opacity: compactHeaderOpacity,
              }}
            >
              |
            </span>
            <span
              style={{
                fontSize: subtitleSize - 2,
                color: toRgbString(colors.accent),
                fontFamily: 'system-ui, -apple-system, sans-serif',
                whiteSpace: 'nowrap',
                opacity: compactHeaderOpacity,
              }}
            >
              {item.client || item.company}
            </span>
            <span
              style={{
                fontSize: subtitleSize - 2,
                color: toRgbString(colors.textMuted),
                fontFamily: 'system-ui, -apple-system, sans-serif',
                opacity: compactHeaderOpacity,
              }}
            >
              |
            </span>
          </>
        )}

        {/* Period - always visible but style changes */}
        <span
          style={{
            fontSize: subtitleSize - 1,
            color: toRgbString(colors.textMuted),
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            whiteSpace: 'nowrap',
            marginLeft: effectiveCollapseProgress < 0.7 ? 'auto' : 0,
          }}
        >
          {item.period}
        </span>
      </div>

      {/* Expanded content - fades out during collapse */}
      {expandedContentOpacity > 0.01 && (
        <div
          style={{
            opacity: expandedContentOpacity,
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {/* Company/Client - separate line when expanded */}
          <p
            style={{
              margin: 0,
              marginTop: 4,
              marginBottom: 12,
              fontSize: subtitleSize,
              color: toRgbString(colors.accent),
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {item.client ? `${item.company} @ ${item.client}` : item.company}
          </p>

          {/* Description with typewriter effect */}
          <p
            style={{
              margin: 0,
              marginBottom: 12,
              fontSize: bodySize,
              color: toRgbString(colors.textSecondary),
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: 1.6,
              minHeight: isMobile ? 60 : 48,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {visibleDescription}
            {showCursor && !isDescriptionComplete && (
              <span style={{ opacity: 0.7 }}>|</span>
            )}
          </p>

          {/* Achievements with typewriter effect */}
          {item.achievements && item.achievements.length > 0 && isDescriptionComplete && (
            <ul
              style={{
                margin: 0,
                padding: 0,
                paddingLeft: 16,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {item.achievements.map((achievement, achievementIndex) => {
                const visibleText = getVisibleAchievementText(achievement, achievementIndex);
                if (visibleText.length === 0) return null;

                const isLastVisibleAchievement =
                  achievementIndex === item.achievements!.length - 1 ||
                  getVisibleAchievementText(item.achievements![achievementIndex + 1], achievementIndex + 1).length === 0;
                const isAchievementComplete = visibleText.length === achievement.length;

                return (
                  <li
                    key={`achievement-${achievement.slice(0, 20)}`}
                    style={{
                      fontSize: bodySize - 1,
                      color: toRgbString(colors.textSecondary),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      lineHeight: 1.5,
                      marginBottom: 4,
                    }}
                  >
                    {visibleText}
                    {showCursor && isLastVisibleAchievement && !isAchievementComplete && (
                      <span style={{ opacity: 0.7 }}>|</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Technologies with typewriter effect */}
          {item.technologies && item.technologies.length > 0 && visibleTechnologies.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 12,
              }}
            >
              {visibleTechnologies.map((tech, index) => {
                const fullTech = item.technologies![index];
                const isComplete = tech.length === fullTech.length;
                const isLastVisible = index === visibleTechnologies.length - 1;

                return (
                  <span
                    key={fullTech}
                    style={{
                      fontSize: bodySize - 2,
                      color: toRgbString(colors.textMuted),
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      backgroundColor: toRgbaString(colors.accent, 0.1),
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {tech}
                    {showCursor && isLastVisible && !isComplete && (
                      <span style={{ opacity: 0.7 }}>|</span>
                    )}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
