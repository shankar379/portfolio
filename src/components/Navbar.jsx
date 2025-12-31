import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // Minimum scroll distance to trigger change

  useEffect(() => {
    const sections = ['home', 'about', 'skills', 'projects', 'world', 'contact'];
    let ticking = false;
    let lastActiveSectionUpdate = 0;

    const updateActiveSection = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      let bestSection = null;
      let smallestDistance = Infinity;

      // Find section whose center is closest to viewport center
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        
        // Skip if section is completely off-screen
        if (rect.bottom <= 0 || rect.top >= viewportHeight) continue;
        
        // Calculate visible height
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Skip if visible height is too small (less than 20% of viewport)
        if (visibleHeight < viewportHeight * 0.2) continue;
        
        // Calculate section center in viewport
        const sectionCenter = rect.top + rect.height / 2;
        
        // Distance from section center to viewport center
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        // Find the section with center closest to viewport center
        if (distance < smallestDistance) {
          smallestDistance = distance;
          bestSection = sectionId;
        }
      }

      // Update active section if found
      if (bestSection) {
        setActiveSection(prev => prev !== bestSection ? bestSection : prev);
      }
    };

    const handleLocomotiveScroll = (args) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = args.scroll.y;

          // Throttle active section updates (only every 100ms)
          const now = Date.now();
          if (now - lastActiveSectionUpdate > 100) {
            updateActiveSection();
            lastActiveSectionUpdate = now;
          }

          // Show/hide navbar based on scroll direction
          if (currentScrollY < 50) {
            setIsVisible(true);
          } else {
            const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
            if (scrollDifference >= scrollThreshold) {
              if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
              } else if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
              }
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Wait for Locomotive Scroll to initialize
    const checkScroll = setInterval(() => {
      if (window.locomotiveScroll) {
        clearInterval(checkScroll);
        window.locomotiveScroll.on('scroll', handleLocomotiveScroll);
        // Initial update with delay to ensure DOM is ready
        setTimeout(() => {
          updateActiveSection();
        }, 300);
      }
    }, 100);

    return () => {
      clearInterval(checkScroll);
      if (window.locomotiveScroll) {
        window.locomotiveScroll.off('scroll', handleLocomotiveScroll);
      }
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'world', label: 'WORLD' },
    { id: 'contact', label: 'CONTACT' }
  ];

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);

    if (section && window.locomotiveScroll) {
      window.locomotiveScroll.scrollTo(section, {
        offset: 0,
        duration: 800,
        easing: [0.25, 0.0, 0.35, 1.0],
      });
    }

    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="nav-container">
            <div className="nav-logo">
          <span className="logo-name">DURGA SHANKAR</span>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {item.label}
              {activeSection === item.id && <span className="active-dot"></span>}
            </a>
          ))}
        </div>

        <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
