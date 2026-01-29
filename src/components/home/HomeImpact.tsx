import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString, toRgbaString } from '../../utils/colors';
import { featuredMetric, supportingMetrics } from '../../data/impactData';

// Typewriter text component using Framer Motion
function TypewriterText({
  text,
  delay = 0,
  isInView,
}: {
  text: string;
  delay?: number;
  isInView: boolean;
}) {
  const characters = text.split('');

  return (
    <motion.span
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.002,
            delayChildren: delay,
          },
        },
      }}
      style={{ display: 'inline' }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.01 }}
          style={{ display: 'inline' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Animated counter component
function AnimatedCounter({
  value,
  suffix,
  duration = 1500,
  delay = 0,
  isInView,
}: {
  value: number;
  suffix: string;
  duration?: number;
  delay?: number;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;

    const delayMs = delay * 1000;
    const timeoutId = setTimeout(() => {
      hasStarted.current = true;
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
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [isInView, value, duration, delay]);

  return (
    <span>
      {count}{suffix}
    </span>
  );
}

// Calculate delay based on text length
const getTextDelay = (text: string) => text.length * 0.002;

export function HomeImpact() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);

  // Animation timing - complete in ~2 seconds
  const headerDelay = 0;
  const featuredDelay = 0.15;
  const metricsDelay = 0.4;
  const cardStagger = 0.12;

  return (
    <section
      ref={sectionRef}
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
        style={{
          maxWidth: 600,
          textAlign: 'left',
        }}
      >
        {/* Section number and title with line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.2, delay: headerDelay }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: responsiveSpacing(viewport.width, 24, 32),
          }}
        >
          <span
            style={{
              fontSize: numberSize + 10,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: toRgbString(colors.accent),
              fontWeight: 400,
            }}
          >
            03.
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: titleSize,
              fontWeight: 600,
              color: toRgbString(colors.textPrimary),
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Impact
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            style={{
              flex: 1,
              height: 1,
              backgroundColor: toRgbaString(colors.textSecondary, 0.3),
              marginLeft: 16,
              maxWidth: isTablet ? 120 : 200,
              transformOrigin: 'left',
            }}
          />
        </motion.div>

        {/* Featured Metric (Hero) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, delay: featuredDelay }}
          style={{
            textAlign: 'center',
            padding: responsiveSpacing(viewport.width, 24, 40),
            marginBottom: responsiveSpacing(viewport.width, 20, 28),
            background: `linear-gradient(135deg, ${toRgbaString(colors.accent, 0.1)} 0%, ${toRgbaString(colors.accent, 0.05)} 100%)`,
            borderRadius: 16,
            border: `1px solid ${toRgbaString(colors.accent, 0.2)}`,
          }}
        >
          <div
            style={{
              fontSize: responsiveFontSize(viewport.width, 48, 72),
              fontWeight: 700,
              color: toRgbString(colors.accent),
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            <AnimatedCounter
              value={featuredMetric.value}
              suffix={featuredMetric.suffix}
              delay={featuredDelay + 0.1}
              isInView={isInView}
            />
          </div>
          <div
            style={{
              fontSize: responsiveFontSize(viewport.width, 16, 20),
              fontWeight: 600,
              color: toRgbString(colors.textPrimary),
              fontFamily: 'system-ui, -apple-system, sans-serif',
              marginBottom: 4,
            }}
          >
            <TypewriterText
              text={featuredMetric.label}
              delay={featuredDelay + 0.2}
              isInView={isInView}
            />
          </div>
          {featuredMetric.subLabel && (
            <div
              style={{
                fontSize: 14,
                color: toRgbString(colors.textMuted),
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              <TypewriterText
                text={featuredMetric.subLabel}
                delay={featuredDelay + 0.2 + getTextDelay(featuredMetric.label)}
                isInView={isInView}
              />
            </div>
          )}
        </motion.div>

        {/* Supporting Metrics - 2x2 Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: responsiveSpacing(viewport.width, 12, 16),
          }}
        >
          {supportingMetrics.map((metric, index) => {
            const cardDelay = metricsDelay + index * cardStagger;
            const labelDelay = cardDelay + 0.15;
            const subLabelDelay = labelDelay + getTextDelay(metric.label);

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.25, delay: cardDelay }}
                style={{
                  textAlign: 'center',
                  padding: responsiveSpacing(viewport.width, 16, 20),
                  background: toRgbaString(colors.textSecondary, 0.05),
                  borderRadius: 12,
                  border: `1px solid ${toRgbaString(colors.textSecondary, 0.1)}`,
                }}
              >
                <div
                  style={{
                    fontSize: responsiveFontSize(viewport.width, 28, 36),
                    fontWeight: 700,
                    color: toRgbString(colors.textPrimary),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    marginBottom: 4,
                  }}
                >
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    delay={cardDelay + 0.1}
                    duration={1000}
                    isInView={isInView}
                  />
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: toRgbString(colors.textSecondary),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    marginBottom: 2,
                  }}
                >
                  <TypewriterText text={metric.label} delay={labelDelay} isInView={isInView} />
                </div>
                {metric.subLabel && (
                  <div
                    style={{
                      fontSize: 11,
                      color: toRgbString(colors.textMuted),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    <TypewriterText text={metric.subLabel} delay={subLabelDelay} isInView={isInView} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
