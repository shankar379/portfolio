import { motion } from 'framer-motion';
import WaveLines from './WaveLines';
import './Experience.css';

const milestones = [
  {
    period: 'Jun 2025 — Present',
    title: 'React Native Developer',
    place: 'Elevents Metaestate Pvt Ltd, Hyderabad',
    detail:
      '7 white-label app flavors shipped from one codebase — Tickets99, EventTitans, Poultry India and more. 35+ screens, 100+ reusable components, payments, NFC, Bluetooth printing and biometric auth on Google Play and the App Store.'
  },
  {
    period: 'Aug 2023 — May 2025',
    title: 'Freelance Full Stack Developer',
    place: 'Remote',
    detail:
      'Full-stack applications with React, Node.js, Express, Firebase and MongoDB — RESTful APIs, authentication, role-based access, deployment and cloud hosting.'
  },
  {
    period: '2021 — 2025',
    title: 'B.Tech, Computer Science & Engineering',
    place: 'Rajamahendri Institute of Engineering & Technology (JNTUK)',
    detail:
      'Deep learning, Django with machine learning, and cloud-based DevOps certifications alongside the degree.'
  }
];

const Experience = () => {
  return (
    <section id="experience" className="experience">
      <div className="experience-container">
        <WaveLines variant="divider" className="experience-wave" />
        <motion.div
          className="experience-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="experience-label">( 03 )&ensp;Trajectory</span>
          <h2 className="experience-title">Experience & <span className="experience-title-accent">milestones.</span></h2>
        </motion.div>

        <div className="experience-timeline">
          {milestones.map((m, index) => (
            <motion.div
              key={m.title}
              className="experience-item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            >
              <div className="experience-item-marker" aria-hidden="true" />
              <span className="experience-item-period">{m.period}</span>
              <h3 className="experience-item-title">{m.title}</h3>
              <p className="experience-item-place">{m.place}</p>
              <p className="experience-item-detail">{m.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Currently Building — hidden for now, will be shown in the future */}
        {false && (
        <motion.div
          className="currently-building"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="currently-building-info">
            <span className="currently-building-label">( ● )&ensp;On the Bench</span>
            <h3 className="currently-building-title">
              Currently building <span className="currently-building-name">MediVoice</span>
            </h3>
            <p className="currently-building-description">
              A multi-role medicine reminder & assistance platform for patients, sellers and
              doctors — TTS voice alerts, missed-dose escalation through SMS and automated
              calls, and an AI chat assistant with persistent history.
            </p>
            <div className="currently-building-tech">
              {['React Native', 'Next.js', 'Node.js', 'MongoDB', 'Twilio', 'Gemini'].map((t) => (
                <span key={t} className="currently-building-chip">{t}</span>
              ))}
            </div>
          </div>
          <div className="currently-building-status">
            <span className="status-pulse" aria-hidden="true" />
            <span className="status-text">Active Development</span>
          </div>
        </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experience;
