import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaDribbble, FaYoutube, FaInstagram } from 'react-icons/fa';
import './SocialSidebar.css';

const SocialSidebar = () => {
  const socialLinks = [
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/durga-shankar-295286249/', name: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com/shankar379/', name: 'GitHub' },
    { icon: FaDribbble, url: 'https://dribbble.com/Durgashankar3616', name: 'Dribbble' },
    { icon: FaYoutube, url: 'https://www.youtube.com/@CodeAndCreate369', name: 'YouTube' },
    { icon: FaInstagram, url: 'https://www.instagram.com/nine_tale_fox369/', name: 'Instagram' }
  ];

  return (
    <div className="social-sidebar">
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
    </div>
  );
};

export default SocialSidebar;
