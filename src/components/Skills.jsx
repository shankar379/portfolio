import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SiDjango,
  SiReact,
  SiThreedotjs,
  SiUnrealengine,
  SiAndroidstudio,
  SiAmazonec2,
  SiExpo,
  SiFirebase
} from 'react-icons/si';
import { FaGithub } from 'react-icons/fa';
import './Skills.css';
import NodeCanvas from './NodeCanvas';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const themeColor = '#ff6d00';

  const allSkills = [
    { name: 'React', icon: SiReact },
    { name: 'Django', icon: SiDjango },
    { name: 'Android Studio', icon: SiAndroidstudio },
    { name: 'React Native + Expo', icon: SiExpo },
    { name: 'GitHub', icon: FaGithub },
    { name: 'Three.js', icon: SiThreedotjs },
    { name: 'Unreal Engine', icon: SiUnrealengine },
    { name: 'AWS EC2 + CI/CD', icon: SiAmazonec2 },
    { name: 'Firebase', icon: SiFirebase }
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
                      boxShadow: isHovered ? `0 0 30px ${themeColor}40` : 'none'
                    }}
                  >
                    <IconComponent
                      className="skill-icon"
                      style={{ color: themeColor }}
                    />
                  </div>
                  <h3 className="skill-name">{skill.name}</h3>
                </div>
                <div
                  className="skill-card-glow"
                  style={{ background: `radial-gradient(circle, ${themeColor}20 0%, transparent 70%)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Node Canvas Section */}
        <NodeCanvas />
      </div>
    </section>
  );
};

export default Skills;
