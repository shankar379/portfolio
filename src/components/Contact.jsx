import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiGithub, FiLinkedin, FiFileText, FiArrowUpRight } from 'react-icons/fi';
import WaveLines from './WaveLines';
import './Contact.css';

const EMAIL = 'durga369shankar@gmail.com';

const quickLinks = [
  { icon: FiMail, label: 'Email', href: `mailto:${EMAIL}` },
  { icon: FiGithub, label: 'GitHub', href: 'https://github.com/shankar379' },
  { icon: FiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/durga-shankar-react-native-developer/' },
  { icon: FiFileText, label: 'Resume', href: '/Profile.pdf' }
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // No backend — compose the message in the visitor's email client.
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${formData.name || 'a visitor'}`);
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name}\n${formData.email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="contact">
      <WaveLines variant="backdrop" />
      <div className="contact-container">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="contact-label">( 04 )&ensp;Connect</span>
          <h2 className="contact-title">
            Let&apos;s build something <span className="contact-title-accent">meaningful.</span>
          </h2>
          <p className="contact-subtitle">
            Have an idea, a role, or a product that needs shipping? I&apos;m open to work.
          </p>
        </motion.div>

        <div className="contact-body">
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="contact-field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="contact-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project…"
                required
              />
            </div>

            <button type="submit" className="contact-send">
              Send message <FiArrowUpRight aria-hidden="true" />
            </button>
          </motion.form>

          <motion.div
            className="contact-links"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {quickLinks.map((link) => {
              const Icon = link.icon;
              const external = link.href.startsWith('http');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="contact-link"
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  download={link.label === 'Resume' ? 'Durga_Shankar_Resume.pdf' : undefined}
                >
                  <span className="contact-link-icon"><Icon aria-hidden="true" /></span>
                  <span className="contact-link-label">{link.label}</span>
                  <FiArrowUpRight className="contact-link-arrow" aria-hidden="true" />
                </a>
              );
            })}
            <div className="contact-location">
              <span className="contact-location-label">Location</span>
              <span className="contact-location-value">Hyderabad, India</span>
              <span className="contact-location-note">Remote friendly</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
