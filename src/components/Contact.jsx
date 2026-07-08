import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import './Contact.css';

const EMAIL = 'durga369shankar@gmail.com';

const columns = [
  {
    title: 'Connect',
    links: [
      { label: 'GitHub', href: 'https://github.com/shankar379' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/durga-shankar-react-native-developer/' },
      { label: 'YouTube', href: 'https://www.youtube.com/@CodeAndCreate369' }
    ]
  },
  {
    title: 'Contact',
    links: [
      { label: EMAIL, href: `mailto:${EMAIL}` },
      { label: '+91 63034 49205', href: 'tel:+916303449205' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Résumé', href: '/Profile.pdf', download: 'Durga_Shankar_Resume.pdf' },
      { label: 'Selected Work', href: '#projects' }
    ]
  }
];

const Contact = () => {
  return (
    <section id="contact" className="contact">
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

        <motion.a
          className="contact-email-cta"
          href={`mailto:${EMAIL}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {EMAIL}
          <FiArrowUpRight className="contact-email-arrow" aria-hidden="true" />
        </motion.a>

        <motion.div
          className="contact-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {columns.map((col) => (
            <div className="contact-col" key={col.title}>
              <h3 className="contact-col-title">{col.title}</h3>
              {col.links.map((link) => {
                const external = link.href.startsWith('http');
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="contact-col-link"
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    download={link.download}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          ))}
          <div className="contact-col contact-col--right">
            <h3 className="contact-col-title">Location</h3>
            <span className="contact-col-text">Hyderabad, India</span>
            <span className="contact-col-text contact-col-text--muted">Remote friendly</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
