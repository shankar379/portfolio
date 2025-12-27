import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SiDjango,
  SiFigma,
  SiReact,
  SiTailwindcss,
  SiThreedotjs,
  SiPython,
  SiBlender,
  SiOpenai,
  SiGoogle,
  SiUnrealengine
} from 'react-icons/si';
import { FaGithub, FaCube, FaRobot, FaEdit, FaFilm } from 'react-icons/fa';
import './Skills.css';

// Custom Java Icon
const JavaIcon = ({ style }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 384 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 53.2 242.84 0 242.84 0c21.5 84.5-75.6 110.1-110.7 162.6-23.9 35.9 11.7 74.4 60.2 118.2zm114.6-176.2c.1 0-175.2 43.8-91.5 140.2 24.7 28.4-6.5 54-6.5 54s62.7-32.4 33.9-72.9c-26.9-37.8-47.5-56.6 64.1-121.3zm-6.1 270.5a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6.7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zm179.8 97.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z"></path>
  </svg>
);

// Custom DeepSeek Icon
const DeepSeekIcon = ({ style }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 24 24"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const allSkills = [
    { name: 'React', icon: SiReact, color: '#61DAFB', category: 'development' },
    { name: 'Python', icon: SiPython, color: '#3776AB', category: 'development' },
    { name: 'Django', icon: SiDjango, color: '#092e20', category: 'development' },
    { name: 'Three.js', icon: SiThreedotjs, color: '#2d2d50', category: 'development' },
    { name: 'Java', icon: JavaIcon, color: '#ED8B00', category: 'development' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4', category: 'development' },
    { name: 'GitHub', icon: FaGithub, color: '#181717', category: 'development' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E', category: 'design' },
    { name: 'Blender', icon: SiBlender, color: '#F5792A', category: 'design' },
    { name: 'Unreal Engine', icon: SiUnrealengine, color: '#2d2d50', category: 'design' },
    { name: '3D Modeling', icon: FaCube, color: '#a78bfa', category: 'design' },
    { name: 'Animation', icon: FaFilm, color: '#a78bfa', category: 'design' },
    { name: 'ChatGPT', icon: SiOpenai, color: '#10A37F', category: 'ai' },
    { name: 'Claude AI', icon: FaRobot, color: '#D97757', category: 'ai' },
    { name: 'Gemini', icon: SiGoogle, color: '#4285F4', category: 'ai' },
    { name: 'DeepSeek', icon: DeepSeekIcon, color: '#1E40AF', category: 'ai' },
    { name: 'Cursor AI', icon: FaEdit, color: '#a78bfa', category: 'ai' }
  ];


  return (
    <section id="skills" className="skills">
      {/* Background Elements */}
      <div className="skills-bg">
        <div className="skills-grid-pattern"></div>
        <div className="skills-glow skills-glow-1"></div>
        <div className="skills-glow skills-glow-2"></div>
      </div>

      <div className="skills-container">
        {/* Header */}
        <motion.div
          className="skills-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="skills-label">EXPERTISE</span>
          <h2 className="skills-title">Skills & Technologies</h2>
          <p className="skills-subtitle">Tools and technologies I use to bring ideas to life</p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="skills-grid"
          layout
        >
          {allSkills.map((skill, index) => {
            const IconComponent = skill.icon;
            const isHovered = hoveredSkill === skill.name;

            return (
              <motion.div
                key={skill.name}
                className={`skill-card ${isHovered ? 'hovered' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                layout
              >
                <div className="skill-card-inner">
                  <div
                    className="skill-icon-wrapper"
                    style={{
                      '--skill-color': skill.color,
                      boxShadow: isHovered ? `0 0 30px ${skill.color}40` : 'none'
                    }}
                  >
                    <IconComponent
                      className="skill-icon"
                      style={{ color: skill.color }}
                    />
                  </div>
                  <h3 className="skill-name">{skill.name}</h3>
                </div>
                <div
                  className="skill-card-glow"
                  style={{ background: `radial-gradient(circle, ${skill.color}20 0%, transparent 70%)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
