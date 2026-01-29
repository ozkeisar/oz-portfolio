import { motion } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString } from '../../utils/colors';
import { fadeInUp, slideInLeft, staggerContainer, viewportConfig } from '../../lib/animations';
import { experienceData } from '../../data/experienceData';

export function HomeExperience() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;

  return (
    <section
      id="experience"
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
            textAlign: isMobile ? 'left' : 'center',
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
            Career Journey
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
            Experience
          </h2>
        </motion.div>

        {/* Timeline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: responsiveSpacing(viewport.width, 24, 32),
          }}
        >
          {experienceData.map((item, index) => (
            <motion.div
              key={item.id}
              variants={slideInLeft}
              custom={index}
              className="home-card"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: responsiveSpacing(viewport.width, 16, 24),
              }}
            >
              {/* Period */}
              <div
                style={{
                  minWidth: isMobile ? 'auto' : 140,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: toRgbString(colors.accent),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {item.period}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    marginBottom: 4,
                    fontSize: responsiveFontSize(viewport.width, 18, 22),
                    fontWeight: 600,
                    color: toRgbString(colors.textPrimary),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {item.role}
                </h3>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 12,
                    fontSize: 14,
                    color: toRgbString(colors.textSecondary),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {item.company}
                  {item.client && ` / ${item.client}`}
                </p>
                <p
                  style={{
                    margin: 0,
                    marginBottom: 16,
                    fontSize: responsiveFontSize(viewport.width, 14, 16),
                    color: toRgbString(colors.textSecondary),
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </p>

                {/* Technologies */}
                {item.technologies && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="skill-tag"
                        style={{
                          fontSize: 12,
                          padding: '4px 10px',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
