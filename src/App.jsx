import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import SocialSidebar from './components/SocialSidebar';
import Footer from './components/Footer';
import MouseFollower from './components/MouseFollower';
import LiveClock from './components/LiveClock';

const ProjectDetail = lazy(() => import('./components/ProjectDetail'));

function HomePage() {
  // Native browser scrolling — no Locomotive Scroll. Smooth-scroll for anchor
  // navigation is handled via CSS (`scroll-behavior: smooth`) and scrollIntoView.
  return (
    <div>
      <Navbar />
      <SocialSidebar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <Router>
      <div className="App">
        <MouseFollower />
        <LiveClock />
        {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />}
        <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:id" element={<Suspense fallback={<div />}><ProjectDetail /></Suspense>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
