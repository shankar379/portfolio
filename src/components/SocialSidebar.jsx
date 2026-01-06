import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaLinkedin, FaGithub, FaDribbble, FaYoutube, FaInstagram } from 'react-icons/fa';
import './SocialSidebar.css';

const SocialSidebar = ({ isExploreClicked = false }) => {
  const iconRefs = useRef([]);
  const [iconColors, setIconColors] = useState({});
  const [shouldHide, setShouldHide] = useState(false);
  const socialLinks = [
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/durga-shankar-295286249/', name: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com/shankar379/', name: 'GitHub' },
    { icon: FaDribbble, url: 'https://dribbble.com/Durgashankar3616', name: 'Dribbble' },
    { icon: FaYoutube, url: 'https://www.youtube.com/@CodeAndCreate369', name: 'YouTube' },
    { icon: FaInstagram, url: 'https://www.instagram.com/nine_tale_fox369/', name: 'Instagram' }
  ];

  // Update icon colors based on their position relative to sections
  const updateIconColors = () => {
    const newColors = {};

    // Get all sections
    const heroSection = document.getElementById('home');
    const skillsSection = document.getElementById('skills');
    const projectsSection = document.getElementById('projects');
    const aboutSection = document.getElementById('about');
    const worldSection = document.getElementById('world');
    const contactSection = document.getElementById('contact');

    if (!heroSection) return;

    iconRefs.current.forEach((iconRef, index) => {
      if (!iconRef) return;

      const iconRect = iconRef.getBoundingClientRect();
      const iconCenterY = iconRect.top + iconRect.height / 2;

      let currentSection = null;
      let sectionRect = null;

      // Check which section the icon is currently in (in order)
      if (contactSection) {
        sectionRect = contactSection.getBoundingClientRect();
        if (iconCenterY >= sectionRect.top && iconCenterY <= sectionRect.bottom) {
          currentSection = 'contact';
        }
      }

      if (!currentSection && worldSection) {
        sectionRect = worldSection.getBoundingClientRect();
        if (iconCenterY >= sectionRect.top && iconCenterY <= sectionRect.bottom) {
          currentSection = 'world';
        }
      }

      if (!currentSection && aboutSection) {
        sectionRect = aboutSection.getBoundingClientRect();
        if (iconCenterY >= sectionRect.top && iconCenterY <= sectionRect.bottom) {
          currentSection = 'about';
        }
      }

      if (!currentSection && projectsSection) {
        sectionRect = projectsSection.getBoundingClientRect();
        if (iconCenterY >= sectionRect.top && iconCenterY <= sectionRect.bottom) {
          currentSection = 'projects';
        }
      }

      if (!currentSection && skillsSection) {
        sectionRect = skillsSection.getBoundingClientRect();
        if (iconCenterY >= sectionRect.top && iconCenterY <= sectionRect.bottom) {
          currentSection = 'skills';
        }
      }

      if (!currentSection && heroSection) {
        sectionRect = heroSection.getBoundingClientRect();
        if (iconCenterY >= sectionRect.top && iconCenterY <= sectionRect.bottom) {
          currentSection = 'home';
        }
      }

      // Set color based on section
      // White: home, skills, projects
      // Orange: about, world, contact
      if (currentSection === 'home' || currentSection === 'skills' || currentSection === 'projects') {
        newColors[index] = '#ffffff';
      } else if (currentSection === 'about' || currentSection === 'world' || currentSection === 'contact') {
        newColors[index] = '#ff6d00';
      } else {
        // Default: check if below hero section
        const heroRect = heroSection.getBoundingClientRect();
        if (iconCenterY > heroRect.bottom) {
          // Below hero, likely in orange sections
          newColors[index] = '#ff6d00';
        } else {
          // Above or in hero, use white
          newColors[index] = '#ffffff';
        }
      }
    });

    setIconColors(newColors);
  };

  useEffect(() => {
    // Check if contact section is 30% visible
    const checkContactVisibility = () => {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return;

      const contactRect = contactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = contactRect.top;
      const sectionHeight = contactRect.height;
      
      // Calculate visible percentage
      const visibleHeight = windowHeight - sectionTop;
      const visiblePercentage = (visibleHeight / sectionHeight) * 100;
      
      if (visiblePercentage >= 30) {
        setShouldHide(true);
      } else {
        setShouldHide(false);
      }
    };

    // Throttle function for performance
    let ticking = false;
    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateIconColors();
          checkContactVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial update
    const initialTimeout = setTimeout(() => {
      updateIconColors();
      checkContactVisibility();
    }, 500);

    // Handle scroll - works for both Locomotive Scroll and native scroll
    const handleScroll = () => {
      throttledUpdate();
    };

    // Check if Locomotive Scroll is available (desktop)
    let scrollCheckInterval = null;
    if (window.locomotiveScroll) {
      // Locomotive Scroll is already available
      window.locomotiveScroll.on('scroll', handleScroll);
    } else {
      // Wait for Locomotive Scroll to initialize (with timeout for mobile)
      scrollCheckInterval = setInterval(() => {
        if (window.locomotiveScroll) {
          clearInterval(scrollCheckInterval);
          window.locomotiveScroll.on('scroll', handleScroll);
        }
      }, 100);
      
      // Set timeout to stop checking after 2 seconds (mobile fallback)
      setTimeout(() => {
        if (scrollCheckInterval) {
          clearInterval(scrollCheckInterval);
        }
      }, 2000);
    }

    // Always listen to native scroll events (works on mobile and as fallback)
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    return () => {
      clearTimeout(initialTimeout);
      if (scrollCheckInterval) {
        clearInterval(scrollCheckInterval);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', throttledUpdate);
      if (window.locomotiveScroll) {
        window.locomotiveScroll.off('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <motion.div 
      className="social-sidebar"
      animate={{
        x: isExploreClicked ? -100 : 0,
        opacity: isExploreClicked || shouldHide ? 0 : 1
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.0, 0.35, 1.0]
      }}
    >
      {socialLinks.map((social, index) => {
        const iconColor = iconColors[index] || '#ffffff';
        const hoverColor = iconColor === '#ffffff' ? '#ffffff' : '#ff4800';
        const iconFilter = iconColor === '#ffffff' 
          ? 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5))' 
          : 'drop-shadow(0 2px 4px rgba(255, 109, 0, 0.3))';

        return (
          <motion.a
            key={index}
            ref={(el) => (iconRefs.current[index] = el)}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-sidebar-icon"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              color: iconColor,
              filter: iconFilter
            }}
            transition={{ delay: index * 0.1, color: { duration: 0.3 }, filter: { duration: 0.3 } }}
            whileHover={{ scale: 1.2, color: hoverColor }}
            style={{ color: iconColor, filter: iconFilter }}
          >
            <social.icon />
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default SocialSidebar;
