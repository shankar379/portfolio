import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaGooglePlay, FaApple } from 'react-icons/fa';
import Navbar from './Navbar';
import WaveLines from './WaveLines';
import { getProjectById, groupStores } from '../data/projects';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const goBackToProjects = () => {
    navigate('/');
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const project = getProjectById(id);

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="project-detail">
          <div className="project-detail-container">
            <h2>Project not found</h2>
            <button onClick={goBackToProjects} className="back-button">
              <FaArrowLeft /> Back to Projects
            </button>
          </div>
        </div>
      </>
    );
  }

  const { title, company, role, liveUrl, githubUrl, technologies, stores = [], detail } = project;
  const { subtitle, summary, challenge, solution, impactPoints } = detail;
  const { groups: storeGroups, unlabeled: plainStores } = groupStores(stores);
  const storeName = (s) => (s.type === 'app' ? 'App Store' : 'Google Play');

  return (
    <>
      <Navbar />
      <div className="project-detail">
        <div className="project-detail-container">
          <motion.button
            className="back-button"
            onClick={goBackToProjects}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaArrowLeft /> Explore More Projects
          </motion.button>

          <motion.div
            className="project-detail-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="case-study-header">
              <WaveLines variant="strip" />
              <span className="case-study-label">Case Study</span>
              <h1 className="project-detail-title">{title}</h1>
              {company && (
                <p className="project-detail-meta">
                  {role} · <strong>{company}</strong>
                </p>
              )}
              <p className="project-subtitle">{subtitle}</p>

              <div className="project-links">
                {liveUrl && (
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="project-link live-link">
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="project-link github-link">
                    <FaGithub /> View Code
                  </a>
                )}
                {plainStores.map((store) => (
                  <a
                    key={store.url}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link store-link"
                  >
                    {store.type === 'app' ? <FaApple /> : <FaGooglePlay />}
                    {storeName(store)}
                  </a>
                ))}
              </div>
            </div>

            {storeGroups.length > 0 && (
              <section className="project-section flavors-section">
                <h2 className="section-title">Available As</h2>
                <div className="flavor-list">
                  {storeGroups.map((g) => (
                    <div className="flavor-row" key={g.label}>
                      <span className="flavor-name">{g.label}</span>
                      <span className="flavor-links">
                        {g.items.map((store) => (
                          <a
                            key={store.url}
                            href={store.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link store-link"
                          >
                            {store.type === 'app' ? <FaApple /> : <FaGooglePlay />}
                            {storeName(store)}
                          </a>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="project-detail-body">
              <section className="project-section">
                <h2 className="section-title">Project Summary</h2>
                <p className="section-content">{summary}</p>
              </section>

              <section className="project-section">
                <h2 className="section-title">Challenge</h2>
                <p className="section-content">{challenge}</p>
              </section>

              <section className="project-section">
                <h2 className="section-title">Solution</h2>
                <p className="section-content">{solution}</p>
              </section>

              <section className="project-section">
                <h2 className="section-title">Impact</h2>
                <div className="case-study-section">
                  {impactPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      className="case-study-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="case-study-number">{String(index + 1).padStart(2, '0')}</div>
                      <p className="case-study-text">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="project-section">
                <h2 className="section-title">Technologies</h2>
                <div className="project-technologies">
                  {technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {String(index + 1).padStart(2, '0')} {tech}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
