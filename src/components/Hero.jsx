import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiDownload } from 'react-icons/fi';
import ErrorBoundary from './ErrorBoundary';
import './Hero.css';

const LazyOrangeRibbon = lazy(() => import('./OrangeRibbonBackground'));

const Hero = () => {
  const [showBg, setShowBg] = useState(false);
  const sectionRef = useRef(null);

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
        <ErrorBoundary fallback={<div className="orange-ribbon-background" />}>
          <Suspense fallback={<div className="orange-ribbon-background" />}>
            <LazyOrangeRibbon />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <div className="orange-ribbon-background" />
      )}

      <div className="hero-content">
        <div className="hero-main">
        <motion.p
          className="hero-status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="hero-status-dot" aria-hidden="true" />
          React Native Developer&ensp;·&ensp;Android & iOS&ensp;·&ensp;Open to Work
        </motion.p>

        <h1 className="hero-statement">
          <motion.span
            className="hero-statement-line"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0, 0.2, 1] }}
          >
            LIMITLESS
          </motion.span>
          <motion.span
            className="hero-statement-line hero-statement-accent"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0, 0.2, 1] }}
          >
            CREATION.
          </motion.span>
        </h1>
        </div>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
        >
          <p className="hero-intro-text">
            I&apos;m <span className="hero-intro-name">Durga Shankar</span> —<br />
            every idea taken<br />
            <span className="hero-intro-accent">from concept to production</span>.
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="hero-cta hero-cta--primary">
              Selected Work <FiArrowDown aria-hidden="true" />
            </a>
            <a
              href="/Profile.pdf"
              download="Durga_Shankar_Resume.pdf"
              className="hero-cta hero-cta--secondary"
            >
              Résumé <FiDownload aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
