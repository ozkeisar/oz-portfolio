import { motion } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString } from '../../utils/colors';
import { fadeInUp, scaleIn, staggerContainer, viewportConfig } from '../../lib/animations';
import { skillCategories } from '../../data/skillsData';

export function HomeSkills() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;

  return (
    <section
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
            Expertise
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
            Skills & Technologies
          </h2>
        </motion.div>

        {/* Skills grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: responsiveSpacing(viewport.width, 16, 24),
          }}
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={scaleIn}
              className="home-card"
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: 16,
                  fontSize: responsiveFontSize(viewport.width, 16, 18),
                  fontWeight: 600,
                  color: toRgbString(colors.accent),
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {category.name}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="skill-tag"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
