import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaExternalLinkAlt, FaGithub, FaGooglePlay, FaApple } from 'react-icons/fa';
import { productionProjects, academicProjects, groupStores } from '../data/projects';
import './Projects.css';

// Local inline fallback (orange-themed) — no external placeholder service,
// so a failed image can never trigger a network retry loop.
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='1200' height='800' fill='%232d2d50'/%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23ff4800' stop-opacity='0.35'/%3E%3Cstop offset='1' stop-color='%23ffb600' stop-opacity='0.15'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='50%25' y='50%25' fill='%23ffaa00' font-family='Outfit,Arial,sans-serif' font-size='48' font-weight='700' text-anchor='middle' dominant-baseline='middle'%3EProject Preview%3C/text%3E%3C/svg%3E";

const ProjectCard = ({ project, index }) => {
  const navigate = useNavigate();
  const { id, title, company, role, description, technologies, image, icon, icons, primaryColor, accentColor, liveUrl, githubUrl, stores = [] } = project;
  const iconList = icons || (icon ? [icon] : []);

  // Each flavor name shown once with its platform icons beside it.
  const { groups: storeGroups, unlabeled: plainStores } = groupStores(stores);

  const StoreIcon = ({ store }) => (
    <a
      href={store.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-neu-store-link"
      aria-label={store.type === 'app' ? 'App Store' : 'Google Play'}
      title={store.type === 'app' ? 'App Store' : 'Google Play'}
    >
      {store.type === 'app' ? <FaApple /> : <FaGooglePlay />}
    </a>
  );

  return (
    <motion.article
      className="project-neu-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={{ y: -8, scale: 1.01 }}
    >
      <div className="project-neu-media">
        {image ? (
          <img
            src={image}
            alt={title}
            className="project-neu-image"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Guard against an infinite onError loop: detach the handler
              // before swapping to a local inline fallback (no external service).
              const img = e.currentTarget;
              img.onerror = null;
              img.src = FALLBACK_IMAGE;
            }}
          />
        ) : (
          // No screenshot (production apps) → branded gradient panel with the
          // app icon(s) centered on top. Never breaks if an icon is missing.
          <div
            className="project-neu-image project-neu-image--gradient"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)` }}
          >
            {iconList.length > 0 && (
              <div className="project-neu-icons">
                {iconList.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${title} app icon`}
                    className="project-neu-app-icon"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="project-neu-gradient"></div>
        <div className="project-neu-media-content">
          <div>
            <h3 className="project-neu-title">{title}</h3>
            <p className="project-neu-subtitle">{technologies[0]} Build</p>
          </div>
          <div className="project-neu-pill">#{id}</div>
        </div>
      </div>

      <div className="project-neu-info">
        {company ? (
          <div className="project-neu-meta">
            <span className="project-neu-company">{company}</span>
            <span className="project-neu-role">{role}</span>
          </div>
        ) : (
          <h4 className="project-neu-label">Project Overview</h4>
        )}
        <p className="project-neu-description">{description}</p>

        <div className="project-neu-tech-list">
          {technologies.map((tech) => (
            <span key={tech} className="project-neu-tech-pill">{tech}</span>
          ))}
        </div>

        <div className="project-neu-actions">
          <button
            className="project-neu-primary-btn"
            onClick={() => navigate(`/project/${id}`)}
          >
            View Details <FaArrowRight />
          </button>
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="project-neu-icon-btn" aria-label="Live Demo">
              <FaExternalLinkAlt />
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="project-neu-icon-btn" aria-label="GitHub Repo">
              <FaGithub />
            </a>
          )}
          {/* Single-app store icons (no flavor label) sit inline with the actions */}
          {plainStores.map((store) => (
            <StoreIcon key={store.url} store={store} />
          ))}
        </div>

        {/* Multi-flavor cards: each flavor once, with its platform icons */}
        {storeGroups.length > 0 && (
          <div className="project-neu-stores">
            {storeGroups.map((g) => (
              <div className="project-neu-store-row" key={g.label}>
                <span className="project-neu-store-flavor">{g.label}</span>
                <span className="project-neu-store-links">
                  {g.items.map((store) => (
                    <StoreIcon key={store.url} store={store} />
                  ))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </motion.article>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <div className="projects-bg"></div>
      <div className="projects-container">
        <div className="projects-header">
          <h2 className="projects-title">Projects</h2>
          <p className="projects-subtitle">Production apps & personal builds</p>
        </div>

        {productionProjects.length > 0 && (
          <>
            <div className="projects-category">
              <span className="projects-category-label">Production Work</span>
              <span className="projects-category-note">Elevents Metaestate Pvt Ltd</span>
            </div>
            <div className="projects-grid">
              {productionProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </>
        )}

        {academicProjects.length > 0 && (
          <>
            <div className="projects-category">
              <span className="projects-category-label">Academic & Freelance</span>
            </div>
            <div className="projects-grid">
              {academicProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
