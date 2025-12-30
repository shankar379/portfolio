import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  return (
    <>
      <Navbar />
      <SocialSidebar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <World />
      <Contact />
      <Footer />
    </>
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
