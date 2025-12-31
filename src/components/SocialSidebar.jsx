import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaDribbble, FaYoutube, FaInstagram } from 'react-icons/fa';
import './SocialSidebar.css';

const SocialSidebar = ({ isExploreClicked = false }) => {
  const socialLinks = [
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/durga-shankar-295286249/', name: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com/shankar379/', name: 'GitHub' },
    { icon: FaDribbble, url: 'https://dribbble.com/Durgashankar3616', name: 'Dribbble' },
    { icon: FaYoutube, url: 'https://www.youtube.com/@CodeAndCreate369', name: 'YouTube' },
    { icon: FaInstagram, url: 'https://www.instagram.com/nine_tale_fox369/', name: 'Instagram' }
  ];

  return (
    <motion.div 
      className="social-sidebar"
      animate={{
        x: isExploreClicked ? -100 : 0,
        opacity: isExploreClicked ? 0 : 1
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.0, 0.35, 1.0]
      }}
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-sidebar-icon"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.2, color: '#a78bfa' }}
        >
          <social.icon />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialSidebar;
