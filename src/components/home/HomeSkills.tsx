import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { skillCategories } from '../../data/skillsData';
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
const getTextDelay = (text: string) => text.length * 0.002;

export function HomeSkills() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);

  // Animation timing - complete in ~2 seconds
  const headerDelay = 0;
  const row1Delay = 0.15;
  const row2Delay = 0.5;
  const row3Delay = 0.85;
  const cardStagger = 0.12;

  // Split categories into rows of 2
  const row1 = skillCategories.slice(0, 2);
  const row2 = skillCategories.slice(2, 4);
  const row3 = skillCategories.slice(4, 6);

  const cardGap = responsiveSpacing(viewport.width, 12, 16);

  return (
    <section
      ref={sectionRef}
      id="skills"
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
            04.
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
            Skills
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

        {/* Skills Grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: cardGap,
          }}
        >
          {/* Row 1 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: cardGap,
            }}
          >
            {row1.map((category, index) => {
              const cardDelay = row1Delay + index * cardStagger;
              const nameDelay = cardDelay + 0.1;
              const skillsDelay = nameDelay + getTextDelay(category.name);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={
                    isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }
                  }
                  transition={{ duration: 0.25, delay: cardDelay }}
                  style={{
                    padding: responsiveSpacing(viewport.width, 16, 20),
                    backgroundColor: toRgbaString(colors.textSecondary, 0.05),
                    borderRadius: 12,
                    border: `1px solid ${toRgbaString(colors.textSecondary, 0.1)}`,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: 12,
                      fontSize: responsiveFontSize(viewport.width, 14, 16),
                      fontWeight: 600,
                      color: toRgbString(colors.accent),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    <TypewriterText text={category.name} delay={nameDelay} isInView={isInView} />
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15, delay: skillsDelay + skillIndex * 0.04 }}
                        style={{
                          fontSize: 12,
                          padding: '4px 10px',
                          borderRadius: 6,
                          backgroundColor: toRgbaString(colors.accent, 0.1),
                          color: toRgbString(colors.textSecondary),
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        }}
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Row 2 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: cardGap,
            }}
          >
            {row2.map((category, index) => {
              const cardDelay = row2Delay + index * cardStagger;
              const nameDelay = cardDelay + 0.1;
              const skillsDelay = nameDelay + getTextDelay(category.name);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={
                    isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }
                  }
                  transition={{ duration: 0.25, delay: cardDelay }}
                  style={{
                    padding: responsiveSpacing(viewport.width, 16, 20),
                    backgroundColor: toRgbaString(colors.textSecondary, 0.05),
                    borderRadius: 12,
                    border: `1px solid ${toRgbaString(colors.textSecondary, 0.1)}`,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: 12,
                      fontSize: responsiveFontSize(viewport.width, 14, 16),
                      fontWeight: 600,
                      color: toRgbString(colors.accent),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    <TypewriterText text={category.name} delay={nameDelay} isInView={isInView} />
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15, delay: skillsDelay + skillIndex * 0.04 }}
                        style={{
                          fontSize: 12,
                          padding: '4px 10px',
                          borderRadius: 6,
                          backgroundColor: toRgbaString(colors.accent, 0.1),
                          color: toRgbString(colors.textSecondary),
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        }}
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Row 3 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: cardGap,
            }}
          >
            {row3.map((category, index) => {
              const cardDelay = row3Delay + index * cardStagger;
              const nameDelay = cardDelay + 0.1;
              const skillsDelay = nameDelay + getTextDelay(category.name);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={
                    isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }
                  }
                  transition={{ duration: 0.25, delay: cardDelay }}
                  style={{
                    padding: responsiveSpacing(viewport.width, 16, 20),
                    backgroundColor: toRgbaString(colors.textSecondary, 0.05),
                    borderRadius: 12,
                    border: `1px solid ${toRgbaString(colors.textSecondary, 0.1)}`,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: 12,
                      fontSize: responsiveFontSize(viewport.width, 14, 16),
                      fontWeight: 600,
                      color: toRgbString(colors.accent),
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    <TypewriterText text={category.name} delay={nameDelay} isInView={isInView} />
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15, delay: skillsDelay + skillIndex * 0.04 }}
                        style={{
                          fontSize: 12,
                          padding: '4px 10px',
                          borderRadius: 6,
                          backgroundColor: toRgbaString(colors.accent, 0.1),
                          color: toRgbString(colors.textSecondary),
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                        }}
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
