import React from 'react';
import { motion } from 'framer-motion';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'SETHU Project',
      duration: 'Jan 2023 - Apr 2023',
      role: 'Web Developer',
      description: 'Engineered a high-performance web interface serving 5k+ monthly users, improving engagement by 40%',
      technologies: ['React', 'Node.js', 'FireBase'],
      impact: 'Reduced loading times by 60% through optimized code practices',
      icon: '🌐'
    },
    {
      id: 2,
      title: 'Time Table Generator',
      duration: 'Jan 2022 - Apr 2022',
      role: 'Full-Stack Developer',
      description: 'Automated scheduling system handling 500+ weekly schedules with 98% accuracy',
      technologies: ['Python', 'Django', 'SQLite3'],
      impact: 'Saved 200+ admin hours annually through process automation',
      icon: '📅'
    },
    {
      id: 3,
      title: 'Student Communication Platform',
      duration: 'May 2023 - Aug 2023',
      role: 'Backend Developer',
      description: 'Scalable real-time chat system supporting 200+ concurrent users',
      technologies: ['React', 'Node.js', 'FireBase'],
      impact: 'Enhanced student collaboration efficiency by 70%',
      icon: '💬'
    },
    {
      id: 4,
      title: 'Attendance Manager',
      duration: 'Sep 2022 - Dec 2022',
      role: 'Software Engineer',
      description: 'AI-powered attendance system processing 10k+ records monthly',
      technologies: ['Python', 'Django', 'SQLite3'],
      impact: 'Reduced administrative errors by 90%',
      icon: '✅'
    },
    {
      id: 5,
      title: 'Race the Sun: Challenge Edition',
      duration: 'May 2025 - Present',
      role: 'Full-Stack Developer & Game Designer',
      description: 'Developed a 3D infinite runner game inspired by "Race the Sun" with procedural generation and solar energy mechanics',
      technologies: ['React', 'Three.js', 'WebGL'],
      impact: 'Achieved 90+ FPS performance on mid-range devices through WebGL optimizations',
      icon: '🎮'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <motion.h2
          className="projects-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Power Projects
        </motion.h2>
        <motion.p
          className="projects-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          End-to-End Web Architecture • 3D & Animation (Three.js, Blender) • Deep Learning & AI Integration
        </motion.p>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="project-header">
                <div className="project-icon">{project.icon}</div>
                <div className="project-meta">
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-info">
                    <span className="project-duration">{project.duration}</span>
                    <span className="project-role">{project.role}</span>
                  </div>
                </div>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              <div className="project-technologies">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              <div className="project-impact">
                <span className="impact-icon">🚀</span>
                <span className="impact-text">Impact: {project.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
