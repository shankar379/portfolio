import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import './ExploreWorld.css';

const ExploreWorld = () => {
  const navigate = useNavigate();

  return (
    <div className="explore-world">
      <motion.button
        className="back-button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft />
        <span>Back to Portfolio</span>
      </motion.button>

      <motion.div
        className="explore-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1 className="explore-title">3D World</h1>
        <p className="explore-subtitle">Coming Soon</p>
        <div className="explore-placeholder">
          <div className="placeholder-orb"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExploreWorld;
