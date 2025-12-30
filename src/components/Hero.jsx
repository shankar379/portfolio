import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Welcome To My Space: Where Code Comes To Life.";
  const roles = ["BUILDING", "EVOLVING", "SHIPPING"];

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section id="home" className="hero">
      {/* Main Hero Content */}
      <div className="hero-content">
        <motion.div
          className="hero-text-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="hero-greeting">Hi I&apos;m</p>
          <h1 className="hero-name">
            <span>DURGA</span>
            <span className="name-accent"> SHANKAR</span>
          </h1>
          
          <div className="hero-roles">
            {roles.map((role, index) => (
              <motion.span
                key={index}
                className="role-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
              >
                {role}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {typedText}
            <span className="cursor">|</span>
          </motion.p>

          <motion.button
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let&apos;s Talk
            <span className="cta-arrow">→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Right Resume Download */}
      <div className="hero-resume">
        <motion.a
          href="/Durga_Shankar_Resume.html"
          target="_blank"
          rel="noopener noreferrer"
          className="resume-text"
          initial={{ opacity: 0, rotate: 90 }}
          animate={{ opacity: 1, rotate: 90 }}
          transition={{ delay: 1 }}
          whileHover={{ color: '#a78bfa', scale: 1.05 }}
          title="View Resume (Print to PDF using browser print function)"
        >
          VIEW RESUME
        </motion.a>
      </div>

      {/* Decorative Shapes */}
      <div className="hero-shapes">
        <motion.div
          className="shape shape-circle-1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.div
          className="shape shape-circle-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        />
        <motion.div
          className="shape shape-diamond"
          initial={{ opacity: 0, rotate: 45 }}
          animate={{ opacity: 0.25, rotate: 45 }}
          transition={{ delay: 0.9, duration: 1 }}
        />
      </div>
    </section>
  );
};

export default Hero;
