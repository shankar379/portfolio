import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaLinkedin, FaGithub, FaDribbble, FaYoutube, FaInstagram } from 'react-icons/fa';
import './SocialSidebar.css';

// Sections whose backdrop is dark/colorful → white icons; the rest → orange.
const WHITE_SECTIONS = new Set(['home', 'skills', 'projects']);
const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'contact'];

const socialLinks = [
  { icon: FaLinkedin, url: 'https://www.linkedin.com/in/durga-shankar-react-native-developer/', name: 'LinkedIn' },
  { icon: FaGithub, url: 'https://github.com/shankar379/', name: 'GitHub' },
  { icon: FaDribbble, url: 'https://dribbble.com/Durgashankar3616', name: 'Dribbble' },
  { icon: FaYoutube, url: 'https://www.youtube.com/@CodeAndCreate369', name: 'YouTube' },
  { icon: FaInstagram, url: 'https://www.instagram.com/nine_tale_fox369/', name: 'Instagram' },
];

const SocialSidebar = () => {
  const [iconColor, setIconColor] = useState('#ffffff');
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    // IntersectionObserver reports visual position even under Locomotive's
    // transform, so we never touch getBoundingClientRect during scroll — zero
    // forced reflows, zero per-frame setState. Colour follows the most-visible
    // section; the sidebar hides once Contact is ≥30% in view.
    const ratios = new Map(SECTION_IDS.map((id) => [id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          if (entry.target.id === 'contact') {
            setShouldHide(entry.isIntersecting && entry.intersectionRatio >= 0.3);
          }
        }

        let activeId = 'home';
        let best = -1;
        for (const id of SECTION_IDS) {
          const r = ratios.get(id) ?? 0;
          if (r > best) {
            best = r;
            activeId = id;
          }
        }

        setIconColor((prev) => {
          const next = WHITE_SECTIONS.has(activeId) ? '#ffffff' : '#ff6d00';
          return prev === next ? prev : next;
        });
      },
      { threshold: [0, 0.25, 0.3, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const hoverColor = iconColor === '#ffffff' ? '#ffffff' : '#ff4800';
  const iconFilter =
    iconColor === '#ffffff'
      ? 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.5))'
      : 'drop-shadow(0 2px 4px rgba(255, 109, 0, 0.3))';

  return (
    <motion.div
      className="social-sidebar"
      animate={{ x: 0, opacity: shouldHide ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.0, 0.35, 1.0] }}
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-sidebar-icon"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, color: iconColor, filter: iconFilter }}
          transition={{ delay: index * 0.1, color: { duration: 0.3 }, filter: { duration: 0.3 } }}
          whileHover={{ scale: 1.2, color: hoverColor }}
          style={{ color: iconColor, filter: iconFilter }}
        >
          <social.icon />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialSidebar;
