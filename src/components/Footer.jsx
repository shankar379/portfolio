import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import './Footer.css';

const Footer = () => {

  const navigationLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  const connectLinks = [
    { label: 'GitHub', url: 'https://github.com/durga369shankar' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/durga-shankar' },
    { label: 'YouTube', url: 'https://youtube.com' },
    { label: 'Email', url: 'mailto:durga369shankar@gmail.com' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Left Column - Personal Info */}
          <motion.div
            className="footer-column footer-personal"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="footer-logo">
              <div className="logo-square">
                <img src="/ds_logo.png" alt="DS Logo" className="logo-letter" />
              </div>
              <h2 className="footer-name">Durga Shankar</h2>
            </div>

            <p className="footer-role">AI-Powered Creative Technologist</p>

            <p className="footer-description">
              Building smarter experiences using AI, code, and design.
            </p>

            <div className="footer-contact">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>India</span>
              </div>
              <div className="contact-item">
                <MdEmail className="contact-icon" />
                <a href="mailto:durga369shankar@gmail.com">durga369shankar@gmail.com</a>
              </div>
            </div>
          </motion.div>

          {/* Middle Column - Navigation */}
          <motion.div
            className="footer-column footer-navigation"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="footer-column-title">
              Navigation
              <span className="title-underline"></span>
            </h3>
            <ul className="footer-links">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column - Connect */}
          <motion.div
            className="footer-column footer-connect"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="footer-column-title">
              Connect
              <span className="title-underline"></span>
            </h3>
            <ul className="footer-links">
              {connectLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target={link.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <motion.p
            className="footer-copyright"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            © {new Date().getFullYear()} Durga Shankar • All rights reserved
          </motion.p>

          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms">Terms of Use</a>
            <span className="separator">•</span>
            <a href="#sitemap">Sitemap</a>
          </div>

          <motion.p
            className="footer-tagline"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            CRAFTING DIGITAL EXCELLENCE
          </motion.p>

          <div className="footer-decorative-dot"></div>
        </div>

        {/* Background Decorative Elements */}
        <div className="footer-bg-elements">
          <div className="bg-year">2025</div>
          <div className="bg-copyright">©</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
