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

      {/* Contact Information */}
      <motion.div
        className="contact-info"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="contact-item">
          📧 Email: durga369shankar@gmail.com
        </div>
        <div className="contact-item">
          📞 Phone: 6303449205
        </div>
        <div className="contact-item">
          🔗 Portfolio: Durga Shankar
        </div>
        <div className="contact-item">
          🔗 GitHub: shankar379
        </div>
        <div className="contact-item">
          🔗 LinkedIn: durga-shankar-295286249
        </div>
      </motion.div>
    </div>
  );
};

export default SocialSidebar;
