import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import SocialSidebar from './components/SocialSidebar';
import Footer from './components/Footer';

const ProjectDetail = lazy(() => import('./components/ProjectDetail'));

function HomePage({ isLoading }) {
  const scrollRef = useRef(null);
  const scrollInstanceRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isSnappingRef = useRef(false);
  const visibleSectionRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollTimeRef = useRef(Date.now());
  useEffect(() => {
    // Don't initialize scroll until loading is complete
    if (isLoading) return;

    // Section IDs to track
    const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
    
    // Detect mobile device - use window width for more reliable detection
    const checkMobile = () => window.innerWidth <= 768;
    const isMobile = checkMobile();
    
    // On mobile, use native scrolling instead of Locomotive Scroll
    if (isMobile) {
      // Remove overflow hidden for native scrolling
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      
      // Set a flag so other components know we're on mobile
      window.isMobileDevice = true;
      
      // Handle resize to re-check mobile status
      const handleResize = () => {
        if (!checkMobile() && !window.locomotiveScroll) {
          // Switched to desktop, reload page to initialize Locomotive Scroll
          window.location.reload();
        }
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        delete window.isMobileDevice;
      };
    }
    
    // Desktop: Initialize Locomotive Scroll (dynamic import)
    window.isMobileDevice = false;
    let destroyed = false;

    const initLocomotiveScroll = async () => {
      const [{ default: LocomotiveScroll }] = await Promise.all([
        import('locomotive-scroll'),
        import('locomotive-scroll/dist/locomotive-scroll.css'),
      ]);
      if (destroyed) return;

      const scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        smoothMobile: false,
        multiplier: 0.8,
        lerp: 0.08,
      });

      scrollInstanceRef.current = scroll;
      window.locomotiveScroll = scroll;

      // Find section with 51-99% visibility that needs snapping
      const findVisibleSection = () => {
        const viewportHeight = window.innerHeight;
        const minThreshold = 0.51;
        const maxThreshold = 0.99;
        let bestSection = null;
        let highestScore = 0;

        for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (!section) continue;

          const rect = section.getBoundingClientRect();
          const sectionHeight = rect.height;
          if (rect.bottom <= 0 || rect.top >= viewportHeight) continue;

          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          if (visibleHeight < viewportHeight * 0.3) continue;

          const sectionVisibilityRatio = visibleHeight / sectionHeight;
          const viewportCoverage = visibleHeight / viewportHeight;
          const visibilityRatio = Math.max(sectionVisibilityRatio, viewportCoverage);
          const isFitted = rect.top >= -20 && rect.top <= 20;

          if (visibilityRatio >= minThreshold && visibilityRatio < maxThreshold && !isFitted) {
            const score = visibilityRatio;
            if (score > highestScore) {
              highestScore = score;
              bestSection = section;
            }
          }
        }
        return bestSection;
      };

      const handleScrollStop = () => {
        if (isSnappingRef.current || isUserScrollingRef.current) return;
        const section = findVisibleSection();
        if (section) {
          isSnappingRef.current = true;
          visibleSectionRef.current = section;
          scroll.scrollTo(section, {
            offset: 0,
            duration: 800,
            easing: [0.25, 0.0, 0.35, 1.0],
            callback: () => { isSnappingRef.current = false; },
          });
        } else {
          visibleSectionRef.current = null;
          isSnappingRef.current = false;
        }
      };

      scroll.on('scroll', () => {
        isUserScrollingRef.current = true;
        lastScrollTimeRef.current = Date.now();
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isUserScrollingRef.current = false;
          handleScrollStop();
        }, 300);
      });

      const handleResize = () => scroll.update();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scroll.destroy();
      };
    };

    let cleanupScroll;
    initLocomotiveScroll().then((cleanup) => { cleanupScroll = cleanup; });

    return () => {
      destroyed = true;
      if (cleanupScroll) cleanupScroll();
    };
  }, [isLoading]);

  return (
    <div ref={scrollRef} data-scroll-container>
      <Navbar />
      <SocialSidebar />
      <div data-scroll-section>
        <Hero />
      </div>
      <div data-scroll-section>
        <About />
      </div>
      <div data-scroll-section>
        <Skills />
      </div>
      <div data-scroll-section>
        <Projects />
      </div>
      <div data-scroll-section>
        <Contact />
      </div>
      <div data-scroll-section>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <Router>
      <div className="App">
        {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />}
        <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          <Routes>
            <Route path="/" element={<HomePage isLoading={isLoading} />} />
            <Route path="/project/:id" element={<Suspense fallback={<div />}><ProjectDetail /></Suspense>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
