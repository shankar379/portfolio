import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaLinkedin, FaGithub, FaDribbble, FaYoutube, FaInstagram } from 'react-icons/fa';
import './SocialSidebar.css';

// Icons alternate black / orange — each icon tracks the section under
// its own position, so colors flip one by one as boundaries cross them.
const BLACK_SECTIONS = new Set(['home', 'skills', 'projects']);
const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];

const socialLinks = [
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/durga-shankar-react-native-developer/', name: 'LinkedIn' },
  { icon: FaGithub, url: 'https://github.com/shankar379/', name: 'GitHub' },
  { icon: FaDribbble, url: 'https://dribbble.com/Durgashankar3616', name: 'Dribbble' },
  { icon: FaYoutube, url: 'https://www.youtube.com/@CodeAndCreate369', name: 'YouTube' },
  { icon: FaInstagram, url: 'https://www.instagram.com/mr.durga_shankar09/', name: 'Instagram' },
];

const SocialSidebar = () => {
  const [shouldHide, setShouldHide] = useState(false);
  const iconRefs = useRef([]);

  // Hide the rail once Contact is ≥30% in view.
  useEffect(() => {
    const contact = document.getElementById('contact');
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShouldHide(entry.isIntersecting && entry.intersectionRatio >= 0.3),
      { threshold: [0, 0.3] }
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  // Per-icon color: on scroll, find which section sits under each icon's
  // own center Y and theme that icon alone. rAF-throttled; styles are
  // mutated directly so nothing re-renders during scroll.
  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    let raf = 0;

    const applyColors = () => {
      raf = 0;
      const ranges = sections.map((el) => {
        const rect = el.getBoundingClientRect();
        return { id: el.id, top: rect.top, bottom: rect.bottom };
      });

      for (const el of iconRefs.current) {
        if (!el) continue;
        const iconRect = el.getBoundingClientRect();
        const y = iconRect.top + iconRect.height / 2;
        // Which section is under this icon right now?
        let sectionId = null;
        for (const r of ranges) {
          if (y >= r.top && y < r.bottom) {
            sectionId = r.id;
            break;
          }
        }
        if (!sectionId) continue; // between sections (footer etc.) — keep last color
        const theme = BLACK_SECTIONS.has(sectionId) ? 'black' : 'orange';
        if (el.dataset.theme !== theme) {
          el.dataset.theme = theme;
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(applyColors);
    };

    applyColors();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <motion.div
      className="social-sidebar"
      animate={{ x: 0, opacity: shouldHide ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.0, 0.35, 1.0] }}
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          ref={(el) => { iconRefs.current[index] = el; }}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-sidebar-icon"
          data-theme="black"
          aria-label={social.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          <social.icon />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialSidebar;
