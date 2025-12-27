import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Experience.css';

const Experience = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 20 + 5,
          y: Math.random() * 30 + 10,
          size: Math.random() * 6 + 3,
          delay: Math.random() * 2
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <section id="experience" className="experience-dropping">
      {/* Background gradient */}
      <div className="dropping-bg"></div>
      
      {/* Floating particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Decorative pink circle */}
      <motion.div 
        className="pink-circle"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main frame */}
      <div className="dropping-frame">
        {/* Corner brackets */}
        <div className="corner corner-tl"></div>
        <div className="corner corner-tr"></div>
        <div className="corner corner-bl"></div>
        <div className="corner corner-br"></div>

        {/* Directional arrows */}
        <div className="arrow arrow-top">↓</div>
        <div className="arrow arrow-bottom">↑</div>
        <div className="arrow arrow-left">→</div>
        <div className="arrow arrow-right">←</div>

        {/* Main text */}
        <motion.div
          className="dropping-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="dropping-title">
            <span className="title-line">DROPPING</span>
            <span className="title-line">SOON</span>
          </h2>

          {/* Progress bar */}
          <div className="progress-container">
            <div className="progress-line"></div>
            <div className="progress-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
