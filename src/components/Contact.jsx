import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
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
    <section id="contact" className="contact">
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
                  rows="6"
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

        {/* Right Side - Image Section */}
        <motion.div
          className="contact-image-section"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="image-wrapper">
            <div className="wavy-divider"></div>
            <div className="contact-image">
              <img 
                src="/contact_bg2.png" 
                alt="Durga Shankar - Developer" 
                className="contact-photo"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;

