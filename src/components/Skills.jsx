import { motion } from 'framer-motion';
import {
  FiSmartphone,
  FiGlobe,
  FiServer,
  FiCloud,
  FiCpu,
  FiBox
} from 'react-icons/fi';
import WaveLines from './WaveLines';
import './Skills.css';

const capabilities = [
  {
    icon: FiSmartphone,
    title: 'Mobile Apps',
    description:
      'Production Android & iOS apps with React Native and Expo — payments, NFC, Bluetooth printing, QR check-in and biometric auth.',
    tags: ['React Native', 'Expo', 'TypeScript']
  },
  {
    icon: FiGlobe,
    title: 'Web Platforms',
    description:
      'Responsive, high-performance web applications with modern component architectures and clean, fast interfaces.',
    tags: ['React', 'Vite', 'Tailwind']
  },
  {
    icon: FiServer,
    title: 'Backend & APIs',
    description:
      'REST APIs, authentication and role-based access with realtime data — built to stay reliable under load.',
    tags: ['Node.js', 'FastAPI', 'PostgreSQL']
  },
  {
    icon: FiCloud,
    title: 'Cloud & DevOps',
    description:
      'Deployment pipelines and cloud infrastructure — automated builds, releases and hosting that scale.',
    tags: ['AWS', 'GitHub Actions', 'CI/CD']
  },
  {
    icon: FiCpu,
    title: 'AI-Powered Development',
    description:
      'AI woven into how I build — agentic coding workflows and LLM features integrated directly into products.',
    tags: ['Claude Code', 'Cursor', 'Gemini API']
  },
  {
    icon: FiBox,
    title: '3D & Interactive',
    description:
      'Interactive WebGL experiences and 3D content — this portfolio runs a custom shader scene.',
    tags: ['Three.js', 'Blender', 'WebGL']
  }
];

const stack = [
  'React Native',
  'Expo',
  'TypeScript',
  'React',
  'Node.js',
  'FastAPI',
  'Firebase',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'GitHub Actions',
  'Three.js'
];

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="skills-container">
        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="skills-label">( 01 )&ensp;What I Build</span>
          <h2 className="skills-title">Capabilities, <span className="skills-title-accent">not just skills.</span></h2>
        </motion.div>

        <div className="skills-cards">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <motion.article
                key={cap.title}
                className="capability-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
              >
                <Icon className="capability-icon" aria-hidden="true" />
                <h3 className="capability-title">{cap.title}</h3>
                <p className="capability-description">{cap.description}</p>
                <div className="capability-tags">
                  {cap.tags.map((tag) => (
                    <span key={tag} className="capability-tag">{tag}</span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="skills-stack"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="skills-stack-label">Core stack</span>
          <div className="skills-stack-list">
            {stack.map((item) => (
              <span key={item} className="skills-stack-item">{item}</span>
            ))}
          </div>
        </motion.div>

        <WaveLines variant="divider" className="skills-stack-wave" />
      </div>
    </section>
  );
};

export default Skills;
