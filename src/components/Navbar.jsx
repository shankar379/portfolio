import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10; // Minimum scroll distance to trigger change

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
          const scrollPosition = currentScrollY + 100;

          // Update active section
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section);
                break;
              }
            }
          }

          // Show/hide navbar based on scroll direction
          if (currentScrollY < 50) {
            // Always show at top of page
            setIsVisible(true);
          } else {
            const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
            
            // Only update if scroll difference is significant
            if (scrollDifference >= scrollThreshold) {
              if (currentScrollY < lastScrollY.current) {
                // Scrolling UP - show navbar (expand and appear)
                setIsVisible(true);
              } else if (currentScrollY > lastScrollY.current) {
                // Scrolling DOWN - hide navbar (shrink and disappear)
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'experience', label: 'WORK' },
    { id: 'contact', label: 'CONTACT' }
  ];

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
              onClick={() => {
                setActiveSection(item.id);
                setIsMenuOpen(false);
              }}
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
