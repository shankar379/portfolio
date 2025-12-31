import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import BrainParticleModel from './BrainParticleModel';
import './World.css';

const World = ({ onExploreClick }) => {
  const navigate = useNavigate();
  const [isExploding, setIsExploding] = useState(false);
  const [shouldMorph, setShouldMorph] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to detect 75% visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Morph when 75% or more visible, unmorph when less
          if (entry.intersectionRatio >= 0.75) {
            setShouldMorph(true);
          } else {
            setShouldMorph(false);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1], // Multiple thresholds for smoother detection
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleExplore = () => {
    setIsExploding(true);
    // Trigger social sidebar animation
    if (onExploreClick) {
      onExploreClick();
    }
  };

  const handleExplodeComplete = () => {
    navigate('/explore');
  };

  return (
    <section id="world" className="world" ref={sectionRef}>
      {/* Transition Overlay */}
      <div className={`world-transition-overlay ${isExploding ? 'active' : ''}`} />

      {/* 3D Brain Particle Model - Left Side */}
      <BrainParticleModel
        isExploding={isExploding}
        onExplodeComplete={handleExplodeComplete}
        shouldMorph={shouldMorph}
      />

      <div className={`world-container ${isExploding ? 'fading' : ''}`}>
        <div className="world-text-content">
          <motion.p
            className="world-tagline"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Building Digital Experiences
          </motion.p>
          <motion.p
            className="world-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From Mobile Apps to Immersive 3D Worlds
          </motion.p>
          <motion.button
            className="world-explore-button"
            onClick={handleExplore}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="world-button-text">Explore My 3D World</span>
            <FaArrowRight className="world-button-arrow" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default World;

