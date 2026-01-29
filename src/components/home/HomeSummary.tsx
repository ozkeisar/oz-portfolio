import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { responsiveFontSize, responsiveSpacing, useViewport } from '../../hooks/useViewport';
import { staggerContainer, viewportConfig } from '../../lib/animations';
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

// Highlighted text component with typewriter effect
function Highlight({
  text,
  href,
  delay = 0,
  isInView,
}: {
  text: string;
  href?: string;
  delay?: number;
  isInView: boolean;
}) {
  const style: React.CSSProperties = {
    color: toRgbString(colors.accent),
    textDecoration: 'none',
    fontWeight: 500,
    display: 'inline',
  };

  const characters = text.split('');

  const content = (
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
      style={style}
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

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {content}
      </a>
    );
  }

  return content;
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

// Calculate delay based on text length (characters * speed)
// Adjusted for ~2 second total animation
const charDelay = 0.002;
const getTextDelay = (text: string) => text.length * charDelay;

export function HomeSummary() {
  const viewport = useViewport();
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const titleSize = responsiveFontSize(viewport.width, 20, 32);
  const bodySize = responsiveFontSize(viewport.width, 14, 17);
  const numberSize = isMobile ? titleSize : responsiveFontSize(viewport.width, 15, 20);

  // Calculate sequential delays for each text segment
  const para1Part1 =
    'Engineering leader with 9+ years of experience architecting and delivering complex systems at scale. From ';
  const para1Highlight1 = 'mission-critical defense systems';
  const para1Part2 = ' in the Israeli Air Force to leading development teams at ';
  const para1Highlight2 = 'Abra';
  const para1Part3 =
    ', I specialize in turning ambitious technical challenges into production-ready solutions.';

  const para2Part1 =
    'Currently directing AI-first development initiatives and managing cross-functional teams delivering ';
  const para2Highlight1 = 'enterprise banking platforms';
  const para2Part2 = ' (1M+ users), ';
  const para2Highlight2 = 'real-time security systems';
  const para2Part3 = ', and ';
  const para2Highlight3 = 'medical imaging software';
  const para2Part4 = '.';

  const para3Part1 =
    'Committed to advancing developer productivity through tooling and methodology. Creator of ';
  const para3Highlight1 = 'Mockingbird';
  const para3Part2 =
    ' and architect of AI-augmented development workflows adopted across engineering teams.';

  // Calculate cumulative delays - total animation ~2 seconds
  const headerDelay = 0;

  const p1d1 = 0.15; // Start paragraph 1 after header
  const p1d2 = p1d1 + getTextDelay(para1Part1);
  const p1d3 = p1d2 + getTextDelay(para1Highlight1);
  const p1d4 = p1d3 + getTextDelay(para1Part2);
  const p1d5 = p1d4 + getTextDelay(para1Highlight2);
  const p1End = p1d5 + getTextDelay(para1Part3);

  const p2d1 = p1End + 0.02; // Small gap between paragraphs
  const p2d2 = p2d1 + getTextDelay(para2Part1);
  const p2d3 = p2d2 + getTextDelay(para2Highlight1);
  const p2d4 = p2d3 + getTextDelay(para2Part2);
  const p2d5 = p2d4 + getTextDelay(para2Highlight2);
  const p2d6 = p2d5 + getTextDelay(para2Part3);
  const p2d7 = p2d6 + getTextDelay(para2Highlight3);
  const p2End = p2d7 + getTextDelay(para2Part4);

  const p3d1 = p2End + 0.02;
  const p3d2 = p3d1 + getTextDelay(para3Part1);
  const p3d3 = p3d2 + getTextDelay(para3Highlight1);
  const p3End = p3d3 + getTextDelay(para3Part2);

  const coreCompDelay = p3End + 0.05;
  const techStackDelay = coreCompDelay + 0.1;

  return (
    <section
      ref={sectionRef}
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
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.2, delay: headerDelay }}
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

        {/* Professional narrative with typewriter effect */}
        <div
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
            <TypewriterText text={para1Part1} delay={p1d1} isInView={isInView} />
            <Highlight text={para1Highlight1} delay={p1d2} isInView={isInView} />
            <TypewriterText text={para1Part2} delay={p1d3} isInView={isInView} />
            <Highlight
              text={para1Highlight2}
              href="https://abra-bm.com"
              delay={p1d4}
              isInView={isInView}
            />
            <TypewriterText text={para1Part3} delay={p1d5} isInView={isInView} />
          </p>

          {/* Paragraph 2 */}
          <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
            <TypewriterText text={para2Part1} delay={p2d1} isInView={isInView} />
            <Highlight text={para2Highlight1} delay={p2d2} isInView={isInView} />
            <TypewriterText text={para2Part2} delay={p2d3} isInView={isInView} />
            <Highlight text={para2Highlight2} delay={p2d4} isInView={isInView} />
            <TypewriterText text={para2Part3} delay={p2d5} isInView={isInView} />
            <Highlight text={para2Highlight3} delay={p2d6} isInView={isInView} />
            <TypewriterText text={para2Part4} delay={p2d7} isInView={isInView} />
          </p>

          {/* Paragraph 3 */}
          <p style={{ margin: 0, marginTop: responsiveSpacing(viewport.width, 12, 16) }}>
            <TypewriterText text={para3Part1} delay={p3d1} isInView={isInView} />
            <Highlight
              text={para3Highlight1}
              href="https://github.com/ozkeisar/mockingbird"
              delay={p3d2}
              isInView={isInView}
            />
            <TypewriterText text={para3Part2} delay={p3d3} isInView={isInView} />
          </p>
        </div>

        {/* Core competencies / Tech stack */}
        <div style={{ marginTop: responsiveSpacing(viewport.width, 20, 28) }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.15, delay: coreCompDelay }}
            style={{
              margin: 0,
              marginBottom: responsiveSpacing(viewport.width, 8, 12),
              fontSize: bodySize - 1,
              color: toRgbaString(colors.textSecondary, 0.8),
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            Core competencies:
          </motion.p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px 32px',
              justifyItems: 'start',
            }}
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.15, delay: techStackDelay + index * 0.04 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
