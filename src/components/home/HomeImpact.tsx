import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString } from '../../utils/colors';
import { fadeInUp, scaleIn, staggerContainer, viewportConfig } from '../../lib/animations';
import { impactMetrics } from '../../data/impactData';

// Animated counter component
function AnimatedCounter({
  value,
  suffix,
  duration = 2000
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export function HomeImpact() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;

  return (
    <section
      id="impact"
      className="home-section"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        className="home-container-inner"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Section header */}
        <motion.div
          variants={fadeInUp}
          style={{
            marginBottom: responsiveSpacing(viewport.width, 40, 60),
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 600,
              color: toRgbString(colors.accent),
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 16,
            }}
          >
            Results
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: responsiveFontSize(viewport.width, 28, 42),
              fontWeight: 700,
              color: toRgbString(colors.textPrimary),
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              lineHeight: 1.2,
            }}
          >
            Impact & Achievements
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: responsiveSpacing(viewport.width, 16, 24),
          }}
        >
          {impactMetrics.map((metric) => (
            <motion.div
              key={metric.id}
              variants={scaleIn}
              className="home-card"
              style={{
                textAlign: 'center',
                padding: responsiveSpacing(viewport.width, 20, 32),
              }}
            >
              <div
                className="metric-value"
                style={{
                  fontSize: responsiveFontSize(viewport.width, 36, 56),
                  marginBottom: 8,
                }}
              >
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <div
                className="metric-label"
                style={{
                  marginBottom: 4,
                }}
              >
                {metric.label}
              </div>
              {metric.subLabel && (
                <div
                  style={{
                    fontSize: 12,
                    color: toRgbString(colors.textMuted),
                  }}
                >
                  {metric.subLabel}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
