import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

const Skills = () => {
  const hardSkills = [
    { name: 'Django', icon: '🔥' },
    { name: 'Figma', icon: '🎨' },
    { name: 'React', icon: '⚛️' },
    { name: 'Tailwind', icon: '💨' },
    { name: 'Three.js', icon: '🎮' },
    { name: 'Java', icon: '☕' },
    { name: 'Python', icon: '🐍' },
    { name: 'Blender 3D', icon: '🎬' },
    { name: '3D Modeling', icon: '🎯' },
    { name: 'Animation', icon: '✨' }
  ];

  const softSkills = [
    'Communication',
    'Teamwork',
    'Problem-Solving',
    'Time Management',
    'Adaptability',
    'Critical Thinking',
    'Leadership'
  ];

  const skillCategories = [
    {
      title: 'Problem Solving',
      icon: '🧠',
      description: 'Complex algorithm expertise & system architecture design'
    },
    {
      title: 'Innovation',
      icon: '🚀',
      description: 'Early adopter of emerging technologies & creative solutions'
    },
    {
      title: 'Learning',
      icon: '📚',
      description: 'Continuous skill development across multiple tech stacks'
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="skills-container">
        <motion.h2
          className="skills-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Skills of Reality Craft
        </motion.h2>
        <motion.p
          className="skills-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          "These are the tools I bend to reshape ideas into living code and three-dimensional worlds."
        </motion.p>

        <div className="skills-categories">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              className="skill-category-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-description">{category.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="skills-grid">
          <motion.div
            className="skills-section"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="section-title">
              <span className="title-icon">🔥</span>
              Hard Skills
            </h3>
            <div className="skills-list">
              {hardSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="skill-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-name">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="skills-section"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="section-title">
              <span className="title-icon">🧠</span>
              Soft Skills
            </h3>
            <div className="skills-list">
              {softSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="skill-item soft-skill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
