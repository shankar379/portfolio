import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { preloadAssets } from '../utils/preloadAssets';
import './Loader.css';

const Loader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let progressInterval;
    let isMounted = true;

    // Start preloading assets
    const loadAssets = async () => {
      // Start progress animation
      progressInterval = setInterval(() => {
        if (!isMounted) return;
        setProgress(prev => {
          // Cap at 90% until assets are loaded
          if (prev >= 90) {
            return 90;
          }
          const increment = prev < 70 ? Math.random() * 15 + 5 : Math.random() * 3 + 1;
          return Math.min(prev + increment, 90);
        });
      }, 100);

      try {
        // Wait for critical assets to load
        await preloadAssets();
        
        if (!isMounted) return;

        // Complete progress to 100%
        setProgress(100);
        
        // Clear progress interval
        if (progressInterval) {
          clearInterval(progressInterval);
        }

        // Small delay for smooth transition
        setTimeout(() => {
          if (!isMounted) return;
          setIsComplete(true);
          setTimeout(() => {
            if (!isMounted) return;
            onLoadingComplete();
          }, 500);
        }, 300);
      } catch (error) {
        console.error('Error preloading assets:', error);
        // Even if preload fails, continue after a delay
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        setProgress(100);
        setTimeout(() => {
          if (!isMounted) return;
          setIsComplete(true);
          setTimeout(() => {
            if (!isMounted) return;
            onLoadingComplete();
          }, 500);
        }, 300);
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="loader-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="loader-content">
            {/* Logo/Name */}
            <motion.div
              className="loader-logo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="loader-name">SHANKAR</span>
            </motion.div>

            {/* Loading bar */}
            <div className="loader-bar-container">
              <motion.div
                className="loader-bar"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Progress percentage */}
            <motion.div
              className="loader-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="loader-percent">{Math.round(progress)}%</span>
              <span className="loader-text">Loading...</span>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="loader-bg-elements">
            <motion.div
              className="loader-circle loader-circle-1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="loader-circle loader-circle-2"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
