import { motion } from 'framer-motion';
import { useViewport, responsiveFontSize, responsiveSpacing } from '../../hooks/useViewport';
import { colors, toRgbString, toRgbaString } from '../../utils/colors';
import { fadeInUp, staggerContainer, viewportConfig } from '../../lib/animations';

// Highlighted text component
function Highlight({ text, href }: { text: string; href?: string }) {
  const style: React.CSSProperties = {
    color: toRgbString(colors.accent),
    textDecoration: 'none',
    fontWeight: 500,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {text}
      </a>
    );
  }

  return <span style={style}>{text}</span>;
}

// Tech stack items
const techStack = [
  'TypeScript',
  'React / React Native',
  'Node.js',
  'AI & LLM Integration',
  'Team Leadership',
  'System Architecture',
];

export function HomeSummary() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;

  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const bodySize = responsiveFontSize(viewport.width, 14, 17);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);

  return (
    <section
      id="summary"
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
        style={{
          maxWidth: 600,
          textAlign: 'left',
        }}
      >
        {/* Section number and title with line */}
        <motion.div
          variants={fadeInUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: responsiveSpacing(viewport.width, 16, 24),
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
            01.
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
            About Me
          </h2>
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: toRgbaString(colors.textSecondary, 0.3),
              marginLeft: 16,
              maxWidth: isTablet ? 120 : 200,
            }}
          />
        </motion.div>

        {/* Professional narrative */}
        <motion.div
          variants={fadeInUp}
          style={{
            fontSize: bodySize,
            fontWeight: 400,
            color: toRgbString(colors.textSecondary),
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: 1.75,
          }}
        >
          {/* Paragraph 1 */}
          <p style={{ margin: 0 }}>
            Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From{' '}
            <Highlight text="mission-critical defense systems" /> in the Israeli Air Force to leading development teams at{' '}
            <Highlight text="Abra" href="https://abra-bm.com" />, I specialize in turning ambitious technical challenges into production-ready solutions.
          </p>

          {/* Paragraph 2 */}
          <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
            Currently directing AI-first development initiatives and managing cross-functional teams delivering{' '}
            <Highlight text="enterprise banking platforms" /> (1M+ users),{' '}
            <Highlight text="real-time security systems" />, and{' '}
            <Highlight text="medical imaging software" />.
          </p>

          {/* Paragraph 3 */}
          <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
            Committed to advancing developer productivity through tooling and methodology. Creator of{' '}
            <Highlight text="Mockingbird" href="https://github.com/ozkeisar/mockingbird" /> and architect of AI-augmented development workflows adopted across engineering teams.
          </p>
        </motion.div>

        {/* Core competencies / Tech stack */}
        <motion.div
          variants={fadeInUp}
          style={{ marginTop: responsiveSpacing(viewport.width, 20, 28) }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: responsiveSpacing(viewport.width, 8, 12),
              fontSize: bodySize - 1,
              color: toRgbaString(colors.textSecondary, 0.8),
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Core competencies:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px 32px',
              justifyItems: 'start',
            }}
          >
            {techStack.map((tech) => (
              <div
                key={tech}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: toRgbString(colors.accent),
                    fontSize: 10,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  }}
                >
                  ▹
                </span>
                <span
                  style={{
                    fontSize: bodySize - 2,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    color: toRgbString(colors.textSecondary),
                  }}
                >
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
