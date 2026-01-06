import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import './App.css';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import World from './components/World';
import Contact from './components/Contact';
import ProjectDetail from './components/ProjectDetail';
import SocialSidebar from './components/SocialSidebar';
import Footer from './components/Footer';
import ExploreWorld from './components/ExploreWorld';

function HomePage({ isLoading }) {
  const scrollRef = useRef(null);
  const scrollInstanceRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const isSnappingRef = useRef(false);
  const visibleSectionRef = useRef(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollTimeRef = useRef(Date.now());
  const [isExploreClicked, setIsExploreClicked] = useState(false);

  useEffect(() => {
    // Don't initialize scroll until loading is complete
    if (isLoading) return;

    // Section IDs to track
    const sectionIds = ['home', 'about', 'skills', 'projects', 'world', 'contact'];
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smoothMobile: true,
      multiplier: 0.8,
      lerp: 0.05,
    });

    scrollInstanceRef.current = scroll;

    // Expose scroll instance globally for navbar
    window.locomotiveScroll = scroll;

    // Find section with 51-99% visibility that needs snapping
    const findVisibleSection = () => {
      const viewportHeight = window.innerHeight;
      const minThreshold = 0.51; // Minimum 51% of section must be visible
      const maxThreshold = 0.99; // Maximum 99% (if 100% it's already perfectly fitted)
      let bestSection = null;
      let highestScore = 0;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;
        
        // Skip if section is completely off-screen
        if (rect.bottom <= 0 || rect.top >= viewportHeight) continue;
        
        // Calculate visible portion of section in viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Skip if visible height is too small (less than 30% of viewport)
        if (visibleHeight < viewportHeight * 0.3) continue;
        
        // Calculate how much of the SECTION is visible (0 to 1)
        const sectionVisibilityRatio = visibleHeight / sectionHeight;
        
        // Also calculate viewport coverage
        const viewportCoverage = visibleHeight / viewportHeight;
        
        // Use the higher of the two ratios
        const visibilityRatio = Math.max(sectionVisibilityRatio, viewportCoverage);

        // Check if section is already perfectly fitted (top is at or near viewport top, within 20px)
        const isFitted = rect.top >= -20 && rect.top <= 20;

        // Only consider sections that are 51-99% visible and NOT already fitted
        if (visibilityRatio >= minThreshold && 
            visibilityRatio < maxThreshold && 
            !isFitted) {
          
          // Score: prioritize higher visibility
          const score = visibilityRatio;
          
          if (score > highestScore) {
            highestScore = score;
            bestSection = section;
          }
        }
      }

      // If a section is 51-99% visible and needs snapping, return it
      return bestSection;
    };

    // Scroll stop detection and snap
    const handleScrollStop = () => {
      // Don't snap if user is actively scrolling or already snapping
      if (isSnappingRef.current || isUserScrollingRef.current) return;

      const section = findVisibleSection();
      
      // Only snap if a section is 51-99% visible and needs to be fitted
      if (section) {
        isSnappingRef.current = true;
        visibleSectionRef.current = section;

        scroll.scrollTo(section, {
          offset: 0,
          duration: 800,
          easing: [0.25, 0.0, 0.35, 1.0],
          callback: () => {
            isSnappingRef.current = false;
          },
        });
      } else {
        // No section needs snapping, reset tracking
        visibleSectionRef.current = null;
        isSnappingRef.current = false;
      }
    };

    // Listen for scroll events
    scroll.on('scroll', () => {
      // Mark that user is scrolling
      isUserScrollingRef.current = true;
      lastScrollTimeRef.current = Date.now();

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout - snap after 300ms of no scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        // Mark that user has stopped scrolling
        isUserScrollingRef.current = false;
        // Trigger snap check
        handleScrollStop();
      }, 300);
    });

    // Update scroll on window resize
    window.addEventListener('resize', () => scroll.update());

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scroll.destroy();
    };
  }, [isLoading]);

  return (
    <div ref={scrollRef} data-scroll-container>
      <Navbar />
      <SocialSidebar isExploreClicked={isExploreClicked} />
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
        <World onExploreClick={() => setIsExploreClicked(true)} />
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
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/explore" element={<ExploreWorld />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
