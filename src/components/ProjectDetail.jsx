import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Navbar from './Navbar';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projects = {
    1: {
      id: 1,
      title: 'SETHU Web App',
      subtitle: 'Public-facing site for SETHU initiative with storytelling-driven UX.',
      liveUrl: 'https://team-sethu.web.app/',
      githubUrl: '',
      challenge: 'Creating an engaging public-facing website that effectively communicates the SETHU initiative\'s mission while maintaining high performance for 5k+ monthly users.',
      solution: 'Developed a high-performance web interface using React and Node.js with Firebase integration. Implemented code splitting, lazy loading, and optimized state management to ensure smooth performance even under high traffic conditions.',
      impactPoints: [
        'Improved user engagement by 40% through intuitive storytelling-driven UX',
        'Reduced loading times by 60% through optimized code practices',
        'Successfully served 5k+ monthly active users with consistent performance'
      ],
      technologies: ['React', 'Node.js', 'FireBase'],
      summary: 'A public-facing website for the SETHU initiative featuring storytelling-driven user experience, real-time data synchronization, and responsive design that serves thousands of users monthly.'
    },
    2: {
      id: 2,
      title: 'Time Table Generator',
      subtitle: 'Constraint-driven timetable engine for academic departments.',
      liveUrl: 'https://timetable-genaretor-vs.vercel.app/',
      githubUrl: 'https://github.com/shankar379/TG_NEW',
      challenge: 'Creating timetables manually was a time-consuming process (3 weeks) prone to errors, conflicts, and resource allocation issues across multiple departments.',
      solution: 'Built an automated scheduling system using Python and Django that intelligently resolves scheduling conflicts, allocates resources efficiently, and considers multiple constraints including room availability, faculty preferences, and course requirements.',
      impactPoints: [
        'Cuts timetable generation time from 3 weeks to under 3 hours',
        'Handles 500+ weekly schedules with 98% accuracy',
        'Saved 200+ admin hours annually through process automation',
        'Supports cross-department resource sharing with collision detection'
      ],
      technologies: ['Python', 'Django', 'SQLite3'],
      summary: 'A scheduling assistant that automates timetables across departments by respecting faculty availability, room capacity, and curriculum priorities. Modular architecture ready for API and campus-wide integrations.'
    },
    3: {
      id: 3,
      title: 'Student Communication Platform',
      subtitle: 'Real-time messaging and announcement hub for universities.',
      liveUrl: 'https://student-communication-vs.web.app/',
      githubUrl: '',
      challenge: 'Students and faculty needed a reliable, scalable communication system that could handle high concurrency while providing real-time messaging, file sharing, and group collaboration features.',
      solution: 'Architected a scalable real-time chat system using React, Node.js, and Firebase. Implemented WebSocket connections for instant message delivery, optimized backend for high concurrency, and included features like message encryption, user presence indicators, and message history.',
      impactPoints: [
        'Supports 200+ concurrent users without performance degradation',
        'Enhanced student collaboration efficiency by 70%',
        'Real-time messaging and file sharing capabilities',
        'Improved communication flow between students and faculty'
      ],
      technologies: ['React', 'Node.js', 'FireBase'],
      summary: 'Scalable real-time messaging system designed to facilitate seamless communication and collaboration among students and faculty, featuring instant messaging, group chats, and announcement capabilities.'
    },
    4: {
      id: 4,
      title: 'Smart Attendance Manager',
      subtitle: 'Automated biometric attendance tracking with analytics dashboards.',
      liveUrl: '',
      githubUrl: '',
      challenge: 'Manual attendance tracking was error-prone, time-consuming, and difficult to manage across large institutions processing 10k+ records monthly.',
      solution: 'Developed an AI-powered attendance system using Python and Django with automated face recognition, QR code scanning, and biometric integration. Implemented machine learning algorithms for improved recognition accuracy and intelligent reporting features.',
      impactPoints: [
        'Processes 10k+ attendance records monthly with minimal intervention',
        'Reduced administrative errors by 90%',
        'Automated face recognition and biometric integration',
        'Real-time analytics and reporting dashboards'
      ],
      technologies: ['Python', 'Django', 'SQLite3'],
      summary: 'An AI-powered attendance system that automates and streamlines attendance tracking in educational institutions with automated recognition, intelligent reporting, and comprehensive analytics.'
    },
    5: {
      id: 5,
      title: 'Race the Sun: Challenge Edition',
      subtitle: '3D infinite runner game with procedural generation and solar energy mechanics.',
      liveUrl: '',
      githubUrl: '',
      challenge: 'Creating an engaging 3D browser-based game with procedural generation while maintaining high frame rates (90+ FPS) on mid-range devices.',
      solution: 'Developed a 3D infinite runner game using React, Three.js, and WebGL. Implemented procedural generation algorithms, optimized WebGL rendering pipelines, efficient geometry management, and intelligent level-of-detail (LOD) systems for optimal performance.',
      impactPoints: [
        'Achieved 90+ FPS performance on mid-range devices through WebGL optimizations',
        'Procedurally generated environments ensure unique gameplay experiences',
        'Solar energy mechanics and physics-based movement systems',
        'Stunning 3D graphics rendered entirely in the browser'
      ],
      technologies: ['React', 'Three.js', 'WebGL'],
      summary: 'An innovative 3D infinite runner game featuring procedural generation, solar energy mechanics, and stunning graphics. Demonstrates the power of modern web technologies in game development with optimized performance.'
    }
  };

  const project = projects[parseInt(id)];

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="project-detail">
          <div className="project-detail-container">
            <h2>Project not found</h2>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const projectsSection = document.getElementById('projects');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }} 
              className="back-button"
            >
              <FaArrowLeft /> Back to Projects
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="project-detail">
        <div className="project-detail-container">
        <motion.button
          className="back-button"
          onClick={() => {
            navigate('/');
            setTimeout(() => {
              const projectsSection = document.getElementById('projects');
              if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
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
            <span className="case-study-label">Case Study</span>
            <h1 className="project-detail-title">{project.title}</h1>
            <p className="project-subtitle">{project.subtitle}</p>
            
            <div className="project-links">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link live-link"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link github-link"
                >
                  <FaGithub /> View Code
                </a>
              )}
            </div>
          </div>

          <div className="project-detail-body">
            <section className="project-section">
              <h2 className="section-title">Project Summary</h2>
              <p className="section-content">{project.summary}</p>
            </section>

            <section className="project-section">
              <h2 className="section-title">Challenge</h2>
              <p className="section-content">{project.challenge}</p>
            </section>

            <section className="project-section">
              <h2 className="section-title">Solution</h2>
              <p className="section-content">{project.solution}</p>
            </section>

            <section className="project-section">
              <h2 className="section-title">Impact</h2>
              <div className="case-study-section">
                {project.impactPoints.map((point, index) => (
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
                {project.technologies.map((tech, index) => (
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

