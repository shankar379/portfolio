import React from 'react';
import { motion } from 'framer-motion';
import { FaAndroid, FaReact, FaNodeJs, FaBrain, FaCode, FaCubes } from 'react-icons/fa';
import { SiThreedotjs, SiBlender, SiFirebase } from 'react-icons/si';
import './ProfileHighlights.css';

const ProfileHighlights = () => {
  const expertise = [
    { icon: FaAndroid, label: 'Android Dev', delay: 0 },
    { icon: FaReact, label: 'Full-Stack', delay: 0.1 },
    { icon: SiThreedotjs, label: '3D Systems', delay: 0.2 },
    { icon: FaBrain, label: 'AI Integration', delay: 0.3 },
  ];

  const techStack = [
    'React Native', 'Node.js', 'MongoDB', 'AWS',
    'Firebase', 'Three.js', 'Blender', 'Python'
  ];

  return (
    <div className="profile-highlights">
      {/* Glowing orbs background */}
      <div className="glow-orbs">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <div className="highlights-wrapper">
        {/* Title */}
        <motion.div
          className="highlight-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="title-accent">//</span> WHAT I DO
        </motion.div>

        {/* Expertise cards */}
        <div className="expertise-grid">
          {expertise.map((item, index) => (
            <motion.div
              key={index}
              className="expertise-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(167, 139, 250, 0.8)'
              }}
            >
              <item.icon className="expertise-icon" />
              <span className="expertise-label">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          className="stats-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="stat-box">
            <span className="stat-value">2+</span>
            <span className="stat-text">Years Exp</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">10+</span>
            <span className="stat-text">Projects</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">8+</span>
            <span className="stat-text">Tech Stack</span>
          </div>
        </motion.div>

        {/* Tech tags */}
        <motion.div
          className="tech-cloud"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {techStack.map((tech, index) => (
            <motion.span
              key={index}
              className="tech-tag"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.05 }}
              whileHover={{
                backgroundColor: 'rgba(167, 139, 250, 0.3)',
                scale: 1.05
              }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Current role */}
        <motion.div
          className="current-role"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="role-indicator">
            <span className="pulse-dot"></span>
            <span className="role-status">CURRENTLY</span>
          </div>
          <span className="role-title">Android Developer @ Tickets99</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileHighlights;
