import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OrangeRibbonBackground from './OrangeRibbonBackground';
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
      {/* Background Shader */}
      <OrangeRibbonBackground />
      
      {/* Main Hero Content */}
      <div className="hero-content">
        <div className="hero-layout">
          <motion.div
            className="hero-text-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="hero-greeting">Hi I&apos;m</p>
            <h1 className="hero-name">
              <span className="hero-name-first">DURGA</span>{' '}
              <span className="hero-name-last">SHANKAR</span>
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
          </motion.div>

          <motion.div
            className="hero-image-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero-image-card">
              <img 
                src="/profile.png" 
                alt="Durga Shankar" 
                className="hero-profile-image"
                loading="eager"
                fetchpriority="high"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
