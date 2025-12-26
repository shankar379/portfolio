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
          <motion.div
            className="about-intro"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="about-title">I build digital products from idea to reality.</h2>
            <p className="about-subtitle">
              From web apps and mobile experiences to 3D worlds and games, I use modern tools to turn complex ideas into things people can actually use. Simplicity isn&apos;t accidental—it&apos;s the result of deliberate engineering.
            </p>
          </motion.div>
          
          <div className="about-sections">
            <motion.div
              className="about-section"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="section-title">What I Build</h3>
              <div className="identity-items">
                <div className="identity-item">
                  <div>
                    <h4>Web Development</h4>
                    <p>Web apps with <strong>React</strong> & <strong>Firebase</strong>.</p>
                  </div>
                </div>
                <div className="identity-item">
                  <div>
                    <h4>Mobile Development</h4>
                    <p>Mobile apps with <strong>React Native</strong>.</p>
                  </div>
                </div>
                <div className="identity-item">
                  <div>
                    <h4>3D & Game Development</h4>
                    <p>3D models with <strong>Blender</strong> and games with <strong>Unreal Engine</strong>.</p>
                  </div>
                </div>
                <div className="identity-item">
                  <div>
                    <h4>Cloud & Infrastructure</h4>
                    <p>Production systems on <strong>AWS</strong> with <strong>MongoDB</strong> & <strong>S3</strong>.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="about-section"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="section-title">How I Think</h3>
              <div className="identity-items">
                <div className="identity-item">
                  <div>
                    <h4>Problem Solving</h4>
                    <p>Breaking down complex problems into simple solutions.</p>
                  </div>
                </div>
                <div className="identity-item">
                  <div>
                    <h4>Building with Intent</h4>
                    <p>Every decision improves speed, clarity, or impact.</p>
                  </div>
                </div>
                <div className="identity-item">
                  <div>
                    <h4>Always Evolving</h4>
                    <p>Staying adaptable across web, mobile, 3D, and games.</p>
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

