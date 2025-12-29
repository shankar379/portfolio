import React from 'react';
import { motion } from 'framer-motion';
import AboutParticles from './AboutParticles';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      {/* 3D Particle Model on Left */}
      <AboutParticles />
      
      {/* Content on Right */}
      <div className="about-content-wrapper">
        <motion.div
          className="about-text"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="about-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I turn ideas into reliable digital products.
          </motion.h2>

          <motion.p
            className="about-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Clarity and performance are designed, not assumed.
          </motion.p>

          <motion.div 
            className="about-accent-line"
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
