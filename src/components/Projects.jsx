import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { projects } from '../data/projects';
import './Projects.css';

const ProjectRow = ({ project, index }) => {
  const navigate = useNavigate();
  const { id, title, tagline, description, tags, status } = project;
  const number = `N°${String(index + 1).padStart(2, '0')}`;

  return (
    <motion.button
      type="button"
      className="case-row"
      onClick={() => navigate(`/project/${id}`)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: 'easeOut' }}
      aria-label={`View details of ${title}`}
    >
      <span className="case-row-number">{number}</span>
      <span className="case-row-main">
        <span className="case-row-title">{title}</span>
        <span className="case-row-tagline">{tagline || description}</span>
      </span>
      <span className="case-row-meta">
        <span className="case-row-tags">{tags}</span>
        <span className="case-row-status"><span className="case-row-dot" aria-hidden="true">●</span> {status}</span>
      </span>
      <FaArrowRight className="case-row-arrow" aria-hidden="true" />
    </motion.button>
  );
};

const Projects = () => {
  const production = projects.filter((p) => p.category === 'production').length;

  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="projects-label">( 02 )&ensp;Selected Work&ensp;·&ensp;{projects.length} Case Studies</span>
          <h2 className="projects-title">
            {production} products in production, <span className="projects-title-accent">all live,</span><br />
            all working for real users.
          </h2>
        </motion.div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
