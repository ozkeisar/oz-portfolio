import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { experienceData } from '../../data/experienceData';
import { responsiveFontSize, responsiveSpacing, useViewport } from '../../hooks/useViewport';
import { colors, toRgbaString, toRgbString } from '../../utils/colors';

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

// Calculate delay based on text length
const charDelay = 0.002;
const getTextDelay = (text: string) => text.length * charDelay;

export function HomeExperience() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const bodySize = responsiveFontSize(viewport.width, 14, 16);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);

  // Calculate delays for each experience item
  // Total animation should be ~2 seconds
  const headerDelay = 0;
  const itemBaseDelay = 0.2; // Start items after header
  const itemStagger = 0.25; // Time between each item starting

  return (
    <section
      ref={sectionRef}
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
        style={{
          maxWidth: 700,
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
            02.
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
            Experience
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

        {/* Timeline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: responsiveSpacing(viewport.width, 24, 32),
          }}
        >
          {experienceData.map((item, index) => {
            const itemDelay = itemBaseDelay + index * itemStagger;

            // Calculate text delays within this item
            const roleDelay = itemDelay + 0.05;
            const companyText = item.company + (item.client ? ` / ${item.client}` : '');
            const companyDelay = roleDelay + getTextDelay(item.role);
            const descDelay = companyDelay + getTextDelay(companyText);
            const techDelay = descDelay + getTextDelay(item.description);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: itemDelay }}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: responsiveSpacing(viewport.width, 12, 20),
                  paddingBottom: responsiveSpacing(viewport.width, 20, 28),
                  borderBottom:
                    index < experienceData.length - 1
                      ? `1px solid ${toRgbaString(colors.textSecondary, 0.15)}`
                      : 'none',
                }}
              >
                {/* Period */}
                <div
                  style={{
                    minWidth: isMobile ? 'auto' : 120,
                    flexShrink: 0,
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.2, delay: itemDelay }}
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: toRgbString(colors.accent),
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                  >
                    {item.period}
                  </motion.span>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  {/* Role */}
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: 4,
                      fontSize: responsiveFontSize(viewport.width, 16, 20),
                      fontWeight: 600,
                      color: toRgbString(colors.textPrimary),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    <TypewriterText text={item.role} delay={roleDelay} isInView={isInView} />
                  </h3>

                  {/* Company / Client */}
                  <p
                    style={{
                      margin: 0,
                      marginBottom: 10,
                      fontSize: 14,
                      color: toRgbString(colors.textSecondary),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    <TypewriterText text={companyText} delay={companyDelay} isInView={isInView} />
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      margin: 0,
                      marginBottom: item.technologies ? 12 : 0,
                      fontSize: bodySize,
                      color: toRgbaString(colors.textSecondary, 0.85),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      lineHeight: 1.6,
                    }}
                  >
                    <TypewriterText text={item.description} delay={descDelay} isInView={isInView} />
                  </p>

                  {/* Technologies */}
                  {item.technologies && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 6,
                      }}
                    >
                      {item.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15, delay: techDelay + techIndex * 0.03 }}
                          style={{
                            fontSize: 11,
                            padding: '3px 8px',
                            borderRadius: 4,
                            backgroundColor: toRgbaString(colors.accent, 0.1),
                            color: toRgbString(colors.accent),
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
