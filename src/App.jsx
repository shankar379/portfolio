import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import World from './components/World';
import Contact from './components/Contact';
import ProjectDetail from './components/ProjectDetail';
import SocialSidebar from './components/SocialSidebar';
import Footer from './components/Footer';
import ExploreWorld from './components/ExploreWorld';

function HomePage() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smoothMobile: true,
      multiplier: 0.8,
      lerp: 0.05,
    });

    // Update scroll on window resize
    window.addEventListener('resize', () => scroll.update());

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      <Navbar />
      <SocialSidebar />
      <div data-scroll-section>
        <Hero />
      </div>
      <div data-scroll-section>
        <About />
      </div>
      <div data-scroll-section>
        <Skills />
      </div>
      <div data-scroll-section>
        <Projects />
      </div>
      <div data-scroll-section>
        <World />
      </div>
      <div data-scroll-section>
        <Contact />
      </div>
      <div data-scroll-section>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/explore" element={<ExploreWorld />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
