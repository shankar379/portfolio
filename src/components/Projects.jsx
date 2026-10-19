/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaApple, FaGooglePlay, FaGithub } from 'react-icons/fa';
import { FiArrowUpRight, FiArrowRight } from 'react-icons/fi';
import { productionProjects, academicProjects, groupStores } from '../data/projects';
import './Projects.css';

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] },
});

const HEADLINE_STATS = [
  { value: '7', label: 'branded apps, one codebase' },
  { value: '4', label: 'user roles served' },
  { value: '5k+', label: 'monthly web users' },
  { value: '3w→3h', label: 'scheduling, automated' },
];

const StoreIcon = ({ type }) => (type === 'play' ? <FaGooglePlay aria-hidden="true" /> : <FaApple aria-hidden="true" />);
const storeName = (type) => (type === 'play' ? 'Google Play' : 'App Store');

function StoreLinks({ project }) {
  const { groups, unlabeled } = groupStores(project.stores);
  return (
    <div className="ship-stores">
      {groups.map((group) => (
        <div className="ship-store-group" key={group.label}>
          <span>{group.label}</span>
          {group.items.map((item) => (
            <a key={item.type} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${group.label} on ${storeName(item.type)}`}>
              <StoreIcon type={item.type} />
            </a>
          ))}
        </div>
      ))}
      {unlabeled.map((item) => (
        <a key={item.type} className="ship-store-pill" href={item.url} target="_blank" rel="noopener noreferrer">
          <StoreIcon type={item.type} /> {storeName(item.type)}
        </a>
      ))}
    </div>
  );
}

function ProductionCard({ project, index }) {
  const icons = project.icons || (project.icon ? [project.icon] : []);
  return (
    <motion.article className={`ship-card ship-card--${index % 2 ? 'b' : 'a'}`} {...reveal(index * 0.08)}>
      <div className="ship-card-visual" aria-hidden="true">
        <div className="ship-glow" />
        <div className={`ship-icons ship-icons--${icons.length}`}>
          {icons.map((src, i) => <img key={src} src={src} alt="" style={{ '--i': i }} loading="lazy" />)}
        </div>
        <span className="ship-platforms">{project.platforms}</span>
      </div>
      <div className="ship-card-body">
        <div className="ship-card-top">
          <span className="ship-live"><i /> Live on Play &amp; App Store</span>
          <span className="ship-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3>{project.title}</h3>
        <p className="ship-role">{project.role} · {project.company}</p>
        <div className="ship-metric">
          <strong>{project.metric.value}</strong>
          <span>{project.metric.label}</span>
        </div>
        <p className="ship-desc">{project.description}</p>
        <ul className="ship-tech">{project.technologies.map((t) => <li key={t}>{t}</li>)}</ul>
        <StoreLinks project={project} />
        <Link className="ship-case" to={`/project/${project.id}`}>
          Read the case study <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}

function WebCard({ project, index }) {
  return (
    <motion.article className="web-card" {...reveal(index * 0.08)}>
      <Link to={`/project/${project.id}`} className="web-card-shot" aria-label={`${project.title} case study`}>
        <span className="web-card-bar" aria-hidden="true"><i /><i /><i /></span>
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" />
      </Link>
      <div className="web-card-body">
        <div className="web-card-metric"><strong>{project.metric.value}</strong><span>{project.metric.label}</span></div>
        <h3><Link to={`/project/${project.id}`}>{project.title}</Link></h3>
        <p>{project.tagline}</p>
        <div className="web-card-links">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live <FiArrowUpRight aria-hidden="true" /></a>}
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden="true" /> Code</a>}
          <Link to={`/project/${project.id}`}>Case study <FiArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="ship" aria-labelledby="projects-heading">
      <div className="ship-container">
        <motion.header className="ship-header" {...reveal()}>
          <span className="ship-label">( 02 )&ensp;Selected work</span>
          <div className="ship-heading-row">
            <h2 id="projects-heading">Shipped. Live.<br /><span>In real hands.</span></h2>
            <p>Not demos. Products people download, sign in to and rely on every day — built, released and maintained by me.</p>
          </div>
        </motion.header>

        <motion.ul className="ship-stats" {...reveal(0.1)}>
          {HEADLINE_STATS.map((s) => <li key={s.label}><strong>{s.value}</strong><span>{s.label}</span></li>)}
        </motion.ul>

        <div className="ship-tier">
          <span className="ship-tier-label">In production</span>
          <span className="ship-tier-line" />
          <span className="ship-tier-count">{String(productionProjects.length).padStart(2, '0')}</span>
        </div>
        <div className="ship-production">
          {productionProjects.map((p, i) => <ProductionCard key={p.id} project={p} index={i} />)}
        </div>

        <div className="ship-tier">
          <span className="ship-tier-label">Also shipped · live on the web</span>
          <span className="ship-tier-line" />
          <span className="ship-tier-count">{String(academicProjects.length).padStart(2, '0')}</span>
        </div>
        <div className="ship-web">
          {academicProjects.map((p, i) => <WebCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
