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
}: TimelineItemProps) {
  const { state, typewriterProgress, collapseProgress, isVisible } = itemState;

  // Don't render upcoming items
  if (!isVisible) {
    return null;
  }

  const isMobile = viewport.width < 768;

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

  // Calculate visible text for typewriter effect
  const descriptionText = item.description;
  const visibleDescriptionChars = Math.floor(typewriterProgress * descriptionText.length);
  const visibleDescription = descriptionText.slice(0, visibleDescriptionChars);

  // Achievements visibility (appears after description is written)
  const achievementsProgress = Math.max(0, (typewriterProgress - 0.8) / 0.2);

  return (
    <div
      style={{
        height: typeof currentHeight === 'number' ? currentHeight : undefined,
        minHeight: isFullyExpanded ? undefined : stackedHeight,
        padding: `${paddingVertical}px ${paddingHorizontal}px`,
        backgroundColor: toRgbaString(colors.cardBackground, bgOpacity),
        borderRadius,
        border:
          borderOpacity > 0.01
            ? `1px solid ${toRgbaString(colors.cardBorder, borderOpacity)}`
            : 'none',
        marginBottom,
        overflow: isFullyExpanded ? 'visible' : 'hidden',
        display: 'flex',
        flexDirection: 'column',
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
            }}
          >
            {visibleDescription}
            {typewriterProgress < 1 && typewriterProgress > 0 && (
              <span style={{ opacity: 0.7 }}>|</span>
            )}
          </p>

          {/* Achievements */}
          {item.achievements && item.achievements.length > 0 && achievementsProgress > 0 && (
            <ul
              style={{
                margin: 0,
                padding: 0,
                paddingLeft: 16,
                opacity: achievementsProgress,
              }}
            >
              {item.achievements.map((achievement, achievementIndex) => {
                // Stagger achievement appearance
                const achievementItemProgress = Math.max(
                  0,
                  (achievementsProgress - achievementIndex * 0.15) / (1 - achievementIndex * 0.15)
                );
                if (achievementItemProgress <= 0) return null;

                return (
                  <li
                    key={`achievement-${achievement.slice(0, 20)}`}
                    style={{
                      fontSize: bodySize - 1,
                      color: toRgbString(colors.textSecondary),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      lineHeight: 1.5,
                      marginBottom: 4,
                      opacity: achievementItemProgress,
                      transform: `translateX(${interpolate(achievementItemProgress, [0, 1], [-10, 0])}px)`,
                    }}
                  >
                    {achievement}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Technologies */}
          {item.technologies && item.technologies.length > 0 && achievementsProgress > 0.5 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 12,
                opacity: interpolate(achievementsProgress, [0.5, 1], [0, 1]),
              }}
            >
              {item.technologies.map((tech) => (
                <span
                  key={tech}
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
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
