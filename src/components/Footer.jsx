import { motion } from 'framer-motion';
import WaveLines from './WaveLines';
import './Footer.css';

const navigationLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' }
];

const connectLinks = [
  { label: 'GitHub', url: 'https://github.com/shankar379' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/durga-shankar-react-native-developer/' },
  { label: 'YouTube', url: 'https://www.youtube.com/@CodeAndCreate369' },
  { label: 'Email', url: 'mailto:durga369shankar@gmail.com' }
];

const Footer = () => {
  return (
    <footer className="footer">
      <WaveLines variant="backdrop" className="footer-backdrop" />
      <div className="footer-container">
        <motion.div
          className="footer-statement"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="footer-name">DURGA SHANKAR<span className="footer-dot">.</span></h2>
          <div className="footer-mantra">
            <span>Designed.</span>
            <span>Built.</span>
            <span>Shipped.</span>
          </div>
        </motion.div>

        <div className="footer-links-row">
          <nav className="footer-nav" aria-label="Footer navigation">
            {navigationLinks.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="footer-connect">
            {connectLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Durga Shankar. All rights reserved.</p>
          <p className="footer-made">Built with React, Three.js & AI — from idea to production.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
