import React, { useState, useEffect, useCallback } from 'react';
import Loader from './components/Loader';
import Hero from './components/Hero';
import CustomCursor from './components/CustomCursor';
import Atmosphere from './components/Atmosphere';

// NEW SECTIONS
import HeroExit from './components/HeroExit';
import WhoAmI from './components/WhoAmI';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    // Lenis is already loaded via CDN in index.html, but we handle initialization here
    if (window.Lenis) {
      const lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }
  }, []);

  const handleHeroReady = useCallback(() => {
    setIsHeroReady(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoadingFinished(true);
  }, []);

  return (
    <main style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', position: 'relative' }}>
      <CustomCursor />
      <div className="grid-overlay" /> {/* Note: swapped grain-overlay for grid-overlay as per prompt */}
      <Atmosphere isActive={loadingFinished} />

      {/* Hero: Always rendered but possibly covered by Loader */}
      <Hero onReady={handleHeroReady} />
      
      {loadingFinished && (
        <>
          <HeroExit />
          <WhoAmI />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </>
      )}
      
      {/* Loader: Synchronized with Hero readiness */}
      {!loadingFinished && (
        <Loader 
          isReady={isHeroReady} 
          onComplete={handleLoaderComplete} 
        />
      )}
    </main>
  );
}

export default App;
