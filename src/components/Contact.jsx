import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPaperPlane, FaPaperclip, FaHandshake, FaLinkedin, FaGithub, FaDribbble, FaYoutube, FaInstagram } from 'react-icons/fa';
import OrangeRibbonBackground from './OrangeRibbonBackground';
import './Contact.css';

const Contact = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shouldHideIcons, setShouldHideIcons] = useState(false);
  const contactSectionRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const socialLinks = [
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/durga-shankar-295286249/', name: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com/shankar379/', name: 'GitHub' },
    { icon: FaDribbble, url: 'https://dribbble.com/Durgashankar3616', name: 'Dribbble' },
    { icon: FaYoutube, url: 'https://www.youtube.com/@CodeAndCreate369', name: 'YouTube' },
    { icon: FaInstagram, url: 'https://www.instagram.com/nine_tale_fox369/', name: 'Instagram' }
  ];

  useEffect(() => {
    const checkScrollPosition = () => {
      if (!contactSectionRef.current) return;

      const rect = contactSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate visible percentage
      const visibleHeight = windowHeight - sectionTop;
      const visiblePercentage = (visibleHeight / sectionHeight) * 100;
      
      // Hide icons when 30% visible
      if (visiblePercentage >= 30) {
        setShouldHideIcons(true);
      } else {
        setShouldHideIcons(false);
      }
    };

    // Throttle function for performance
    let ticking = false;
    const throttledCheck = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check on mount
    checkScrollPosition();

    // Handle scroll - works for both Locomotive Scroll and native scroll
    const handleScroll = () => {
      throttledCheck();
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
    window.addEventListener('resize', throttledCheck, { passive: true });

    return () => {
      if (scrollCheckInterval) {
        clearInterval(scrollCheckInterval);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', throttledCheck);
      if (window.locomotiveScroll) {
        window.locomotiveScroll.off('scroll', handleScroll);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent! I\'ll get back to you soon.');
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact" ref={contactSectionRef}>
      <div className="contact-container">
        {/* Flip Container */}
        <div className={`contact-flip-container ${isFormOpen ? 'flipped' : ''}`}>
          {/* Front Side - Contact Card */}
          <div className="contact-card-front">
            <motion.div
              className="contact-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="contact-card-background">
                <OrangeRibbonBackground />
              </div>
              <div className="contact-card-content">
              <div className="business-card-info">
                <h2 className="business-card-name">Durga Shankar Guttula</h2>
                <p className="business-card-role">Android Developer</p>
              </div>
                <motion.button
                  className="contact-card-icon-button"
                  onClick={() => setIsFormOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHandshake className="contact-card-icon" />
                </motion.button>
              </div>
              
              {/* Social Icons Container at Bottom */}
              <div className="contact-card-social-icons">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card-social-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.2, y: -5 }}
                    style={{ color: '#ffffff' }}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Back Side - Contact Form */}
          <div className="contact-card-back">
            <div className="contact-form-section">
          <div className="contact-header">
            <h2 className="contact-title">
              Let&apos;s work together.
              <span className="title-dot"></span>
            </h2>
            <p className="contact-subtitle">
              Or reach us via: <a href="mailto:durga369shankar@gmail.com">durga369shankar@gmail.com</a>
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your first name"
                    className="form-input"
                  />
                  <FaUser className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your last name"
                    className="form-input"
                  />
                  <FaUser className="input-icon" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="form-input"
                  required
                />
                <FaEnvelope className="input-icon email-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <div className="input-wrapper">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  className="form-textarea"
                  rows="3"
                  required
                ></textarea>
                <FaPaperPlane className="input-icon message-icon" />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-attachment">
                <FaPaperclip className="btn-icon" />
                Add attachment
              </button>
              <button type="submit" className="btn-send">
                Send message
              </button>
            </div>
          </form>
              <button 
                className="close-form-button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
