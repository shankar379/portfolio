import React from 'react';
import { motion } from 'framer-motion';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      title: 'Full-Stack Developer',
      company: 'Time Table Generator',
      period: 'Jan 2022 - Apr 2022',
      description: 'Developed an automated scheduling tool that increased efficiency by 30%, streamlining timetable generation.',
      technologies: ['Python', 'Django', 'SQLite3']
    },
    {
      id: 2,
      title: 'Software Engineer',
      company: 'Attendance Manager',
      period: 'Sep 2022 - Dec 2022',
      description: 'Built an automated attendance tracking system for 1000+ students, reducing administrative tasks and providing real-time data updates and reports.',
      technologies: ['Python', 'Django', 'SQLite3']
    },
    {
      id: 3,
      title: 'Web Developer',
      company: 'SETHU Project',
      period: 'Jan 2023 - Apr 2023',
      description: 'Designed and developed a user-friendly interface using modern frameworks to enhance engagement for educational resources.',
      technologies: ['React', 'Node.js', 'FireBase']
    },
    {
      id: 4,
      title: 'Backend Developer',
      company: 'Student Communication Platform',
      period: 'May 2023 - Aug 2023',
      description: 'Implemented real-time chat functionality and secure user authentication for 200+ students, improving collaboration and communication.',
      technologies: ['React', 'Node.js', 'FireBase']
    }
  ];

  return (
    <section id="experience" className="experience">
      <div className="experience-container">
        <motion.h2
          className="experience-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Milestones of Time
        </motion.h2>
        <motion.p
          className="experience-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Full-Stack Developer with 1 year of hands-on experience in Python & React.js. From revamping educational platforms to building AI-powered features, I craft performant, scalable web solutions that truly engage users.
        </motion.p>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="experience-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="timeline-marker">
                <div className="marker-dot"></div>
                {index !== experiences.length - 1 && <div className="marker-line"></div>}
              </div>
              
              <div className="experience-content">
                <div className="experience-header">
                  <h3 className="experience-role">{exp.title}</h3>
                  <span className="experience-company">- {exp.company}</span>
                </div>
                <span className="experience-period">{exp.period}</span>
                <p className="experience-description">{exp.description}</p>
                <div className="experience-tech">
                  {exp.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

