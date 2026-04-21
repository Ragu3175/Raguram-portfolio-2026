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

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);

  // Fix 1: Initialize Lenis Smooth Scroll (npm version)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Fix 2: Refresh ScrollTrigger after sections mount
  useEffect(() => {
    if (!loadingFinished) return;
    // Wait one frame for React to commit the new sections to DOM
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [loadingFinished]);

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
