import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: 'SETHU WEB APP',
      description: 'Public-facing site for SETHU initiative with storytelling-driven UX. Engineered a high-performance web interface serving 5k+ monthly users, improving engagement by 40%.',
      technologies: ['React', 'Vite', 'Tailwind CSS'],
      primaryColor: '#ff4800',
      accentColor: '#ffaa00',
      image: '/sethu_web.webp',
      liveUrl: 'https://team-sethu.web.app/',
      githubUrl: 'https://github.com/shankar379/SETHU-public'
    },
    {
      id: 2,
      title: 'TIME TABLE GENERATOR',
      description: 'Constraint-driven timetable engine for academic departments. Automated scheduling system handling 500+ weekly schedules with 98% accuracy, cutting generation time from 3 weeks to under 3 hours.',
      technologies: ['Python', 'Django', 'SQLite3'],
      primaryColor: '#ff6d00',
      accentColor: '#ffb600',
      image: '/timetable.webp',
      liveUrl: 'https://timetable-genaretor-vs.vercel.app/',
      githubUrl: 'https://github.com/shankar379/TG_NEW'
    },
    {
      id: 3,
      title: 'STUDENT COMMUNICATION PLATFORM',
      description: 'Real-time messaging and announcement hub for universities. Scalable chat system supporting 200+ concurrent users, enhancing student collaboration efficiency by 70%.',
      technologies: ['React', 'Firebase', 'Cloud Functions'],
      primaryColor: '#ff8500',
      accentColor: '#ff5400',
      image: '/student-communication.webp',
      liveUrl: 'https://student-communication-vs.web.app/',
      githubUrl: ''
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="projects-bg"></div>
      <div className="projects-container">
        <div className="projects-header">
          <h2 className="projects-title">Projects</h2>
          <p className="projects-subtitle">Neumorphic 3D project cards</p>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              className="project-neu-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              whileHover={{ y: -8, scale: 1.01 }}
            >
              <div className="project-neu-media">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-neu-image"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/1200x800/2d2d50/ff6d00?text=${encodeURIComponent(project.title)}`;
                  }}
                />
                <div className="project-neu-gradient"></div>
                <div className="project-neu-media-content">
                  <div>
                    <h3 className="project-neu-title">{project.title}</h3>
                    <p className="project-neu-subtitle">{project.technologies[0]} Build</p>
                  </div>
                  <div className="project-neu-pill">#{project.id}</div>
                </div>
              </div>

              <div className="project-neu-info">
                <h4 className="project-neu-label">Project Overview</h4>
                <p className="project-neu-description">{project.description}</p>

                <div className="project-neu-tech-list">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="project-neu-tech-pill">{tech}</span>
                  ))}
                </div>

                <div className="project-neu-actions">
                  <button
                    className="project-neu-primary-btn"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    View Details <FaArrowRight />
                  </button>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-neu-icon-btn" aria-label="Live Demo">
                      <FaExternalLinkAlt />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-neu-icon-btn" aria-label="Github Repo">
                      <FaGithub />
                    </a>
                  )}
                </div>
              </div>

              <div className="project-neu-side"></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
