import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = [
    {
      id: 1,
      title: 'SETHU WEB APP',
      description: 'Public-facing site for SETHU initiative with storytelling-driven UX. Engineered a high-performance web interface serving 5k+ monthly users, improving engagement by 40%.',
      technologies: ['React', 'Vite', 'Tailwind CSS'],
      primaryColor: '#1E1B4B',
      accentColor: '#10B981',
      image: '/sethu_web.png',
      liveUrl: 'https://team-sethu.web.app/',
      githubUrl: ''
    },
    {
      id: 2,
      title: 'TIME TABLE GENERATOR',
      description: 'Constraint-driven timetable engine for academic departments. Automated scheduling system handling 500+ weekly schedules with 98% accuracy, cutting generation time from 3 weeks to under 3 hours.',
      technologies: ['Python', 'Django', 'SQLite3'],
      primaryColor: '#93C5FD',
      accentColor: '#3B82F6',
      image: '/timetable.png',
      liveUrl: 'https://timetable-genaretor-vs.vercel.app/',
      githubUrl: 'https://github.com/shankar379/TG_NEW'
    },
    {
      id: 3,
      title: 'STUDENT COMMUNICATION PLATFORM',
      description: 'Real-time messaging and announcement hub for universities. Scalable chat system supporting 200+ concurrent users, enhancing student collaboration efficiency by 70%.',
      technologies: ['React', 'Firebase', 'Cloud Functions'],
      primaryColor: '#F97316',
      accentColor: '#1F2937',
      image: '/student-communication.png',
      liveUrl: 'https://student-communication-vs.web.app/',
      githubUrl: ''
    },
    {
      id: 4,
      title: 'SMART ATTENDANCE MANAGER',
      description: 'Automated biometric attendance tracking with analytics dashboards. AI-powered system processing 10k+ records monthly, reducing administrative errors by 90%.',
      technologies: ['Python', 'Django', 'SQLite3'],
      primaryColor: '#F5792A',
      accentColor: '#1F2937',
      image: '/project-attendance.jpg',
      liveUrl: '',
      githubUrl: ''
    },
    {
      id: 5,
      title: 'RACE THE SUN: CHALLENGE EDITION',
      description: '3D infinite runner game with procedural generation and solar energy mechanics. Achieved 90+ FPS performance on mid-range devices through WebGL optimizations.',
      technologies: ['React', 'Three.js', 'WebGL'],
      primaryColor: '#61DAFB',
      accentColor: '#1E3A5F',
      image: '/project-race.jpg',
      liveUrl: '',
      githubUrl: ''
    }
  ];

  const currentProject = projects[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleProjectClick = () => {
    navigate(`/project/${currentProject.id}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [projects.length]);

  return (
    <section id="projects" className="projects">
      <div className="projects-background-text">PROJECTS</div>
      <div className="projects-wrapper">
        <div className="projects-content">
          {/* Left Section - Text Content */}
          <div className="projects-left">
            <div className="projects-logo">PROJECTS</div>
            <div className="projects-breadcrumb">Home / Projects</div>
            <motion.h1
              key={currentProject.id}
              className="project-main-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {currentProject.title}
            </motion.h1>
            <motion.p
              key={`desc-${currentProject.id}`}
              className="project-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {currentProject.description}
            </motion.p>
            <motion.button
              className="project-view-button"
              onClick={handleProjectClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </motion.button>
          </div>

          {/* Right Section - Image with Diagonal Cut */}
          <div
            className="projects-right"
            style={{ backgroundColor: currentProject.primaryColor }}
          >
            <div
              className="project-diagonal-cut"
              style={{ backgroundColor: currentProject.accentColor }}
            ></div>
            <div className="project-image-container">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentProject.id}
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="project-image"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x1000/2d2d50/a78bfa?text=' + encodeURIComponent(currentProject.title);
                  }}
                />
              </AnimatePresence>
            </div>
            {/* Project Indicators */}
            <div className="project-indicators">
              {projects.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="projects-navigation">
          <button className="nav-button nav-button-left" onClick={handlePrev}>
            <FaChevronLeft />
          </button>
          <button className="nav-button nav-button-right" onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
