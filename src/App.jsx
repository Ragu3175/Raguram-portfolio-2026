import React, { useState, useEffect, useCallback } from 'react';
import Loader from './components/Loader';
import Hero from './components/Hero';
import CustomCursor from './components/CustomCursor';
import Atmosphere from './components/Atmosphere';

// NEW SECTIONS
import Transition from './components/Transition';
import StarField from './components/StarField';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Process from './components/Process';
import Contact from './components/Contact';
import DotNav from './components/DotNav';


import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);

  const [lenis, setLenis] = useState(null);
 
  // Fix 1: Initialize Lenis Smooth Scroll (npm version)
  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
 
    instance.on('scroll', ScrollTrigger.update);
    setLenis(instance);
 
    const raf = (time) => {
      instance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
 
    return () => instance.destroy();
  }, []);
 
  const scrollTo = useCallback((target, offset = 0) => {
    if (lenis) {
      lenis.scrollTo(target, { offset });
    }
  }, [lenis]);

  // Fix 2: Refresh ScrollTrigger after sections mount
  useEffect(() => {
    if (!loadingFinished) return;
    // Wait for React to commit the new sections to DOM
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1200);

    // Also refresh on resize to handle dynamic layout shifts
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(id);
      resizeObserver.disconnect();
    };
  }, [loadingFinished]);

  const handleHeroReady = useCallback(() => {
    setIsHeroReady(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoadingFinished(true);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const handler = (e) => {
      const el = document.getElementById(e.detail.id)
      if (el) lenis.scrollTo(el, { offset: 0 })
    }
    window.addEventListener('dotnav:scrollto', handler)
    return () => window.removeEventListener('dotnav:scrollto', handler)
  }, [lenis])


  return (
    <main style={{ backgroundColor: '#000000', minHeight: '100vh', position: 'relative' }}>
      {/* <StarField /> */}
      <CustomCursor />

      <Atmosphere isActive={loadingFinished} />

      {/* Hero: Always rendered but possibly covered by Loader */}
      <Hero onReady={handleHeroReady} scrollTo={scrollTo} />
      
      {loadingFinished && (
        <>
          <div id="whoami"><Transition /></div>
          <About />
          <Skills />
          <Projects />
          <Process />
          <Contact />
          <DotNav />
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
