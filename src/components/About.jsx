import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="about-title">Code Space Interface</h2>
          <div className="about-header">
            <span className="code-prompt">{'>>>'}</span>
            <span className="code-cursor">|</span>
          </div>
          
          <div className="about-sections">
            <motion.div
              className="about-section"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="section-title">Copy Cosmic Code</h3>
              <p className="section-description">
                Full-Stack Developer with 1 year of hands-on experience in Python & React.js. 
                From revamping educational platforms to building AI-powered features, I craft 
                performant, scalable web solutions that truly engage users.
              </p>
            </motion.div>

            <motion.div
              className="about-section"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="section-title">Mindscapes & Identity</h3>
              <div className="identity-items">
                <div className="identity-item">
                  <span className="identity-icon">🧠</span>
                  <div>
                    <h4>Problem Solving</h4>
                    <p>Complex algorithm expertise & system architecture design</p>
                  </div>
                </div>
                <div className="identity-item">
                  <span className="identity-icon">🚀</span>
                  <div>
                    <h4>Innovation</h4>
                    <p>Early adopter of emerging technologies & creative solutions</p>
                  </div>
                </div>
                <div className="identity-item">
                  <span className="identity-icon">📚</span>
                  <div>
                    <h4>Learning</h4>
                    <p>Continuous skill development across multiple tech stacks</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

