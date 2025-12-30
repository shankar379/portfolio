import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import GreetingModel from './GreetingModel';
import './Contact.css';

const Contact = () => {
  const sectionRef = useRef(null);
  const [shouldPlayGreeting, setShouldPlayGreeting] = useState(false);

  // Intersection Observer for 40% visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setShouldPlayGreeting(true);
          } else {
            setShouldPlayGreeting(false);
          }
        });
      },
      {
        threshold: [0, 0.4, 1],
        rootMargin: '0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

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
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="contact-container">
        {/* Left Side - Contact Form */}
        <motion.div
          className="contact-form-section"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        {/* Right Side - 3D Greeting Animation */}
        <motion.div
          className="contact-envelope-section"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GreetingModel shouldPlay={shouldPlayGreeting} />
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

