import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: 'SETHU Web App',
      description: 'Public-facing site for SETHU initiative with storytelling-driven UX.',
      technologies: ['React', 'Vite', 'Tailwind CSS']
    },
    {
      id: 2,
      title: 'Time Table Generator',
      description: 'Constraint-driven timetable engine for academic departments.',
      technologies: ['Python', 'Django', 'SQLite3']
    },
    {
      id: 3,
      title: 'Student Communication Platform',
      description: 'Real-time messaging and announcement hub for universities.',
      technologies: ['React', 'Firebase', 'Cloud Functions']
    },
    {
      id: 4,
      title: 'Smart Attendance Manager',
      description: 'Automated biometric attendance tracking with analytics dashboards.',
      technologies: ['Python', 'Django', 'SQLite3']
    },
    {
      id: 5,
      title: 'Race the Sun: Challenge Edition',
      description: '3D infinite runner game with procedural generation and solar energy mechanics.',
      technologies: ['React', 'Three.js', 'WebGL']
    }
  ];

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

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
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleProjectClick(project.id)}
            >
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-technologies">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
