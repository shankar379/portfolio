import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const LazyOrangeRibbon = lazy(() => import('./OrangeRibbonBackground'));

const Hero = () => {
  const [typedText, setTypedText] = useState('');
  const [showBg, setShowBg] = useState(false);
  const sectionRef = useRef(null);
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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShowBg(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="hero" ref={sectionRef}>
      {/* Background Shader - lazy loaded */}
      {showBg ? (
        <Suspense fallback={<div className="orange-ribbon-background" />}>
          <LazyOrangeRibbon />
        </Suspense>
      ) : (
        <div className="orange-ribbon-background" />
      )}
      
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
        </div>
      </div>

      <a
        href="/Profile.pdf"
        download="Durga_Shankar_ATS_Resume.pdf"
        className="hero-resume-stick"
        aria-label="Download resume"
      >
        RESUME
      </a>
    </section>
  );
};

export default Hero;
