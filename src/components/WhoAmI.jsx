import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/WhoAmI.module.css';

gsap.registerPlugin(ScrollTrigger);

const WhoAmI = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const word3Ref = useRef(null);
  
  const projectsRef = useRef(null);
  const yearsRef = useRef(null);
  const coffeeRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
        }
      });

      // Words Animation
      tl.fromTo(word1Ref.current, 
        { opacity: 0, filter: "blur(20px)", y: 60 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1 }
      );
      
      tl.fromTo(word2Ref.current, 
        { opacity: 0, filter: "blur(20px)", y: 60 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1 },
        "+=0.5"
      );

      tl.fromTo(word3Ref.current, 
        { opacity: 0, filter: "blur(20px)", y: 60 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1 },
        "+=0.5"
      );

      // Counters Reveal
      tl.fromTo(".counter-box", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 },
        "+=0.3"
      );

      // Counter Counting Logic
      const counts = { projects: 0, years: 0 };
      
      tl.to(counts, {
        projects: 27,
        years: 3,
        duration: 1,
        onUpdate: () => {
          if (projectsRef.current) projectsRef.current.innerText = Math.floor(counts.projects) + "+";
          if (yearsRef.current) yearsRef.current.innerText = Math.floor(counts.years);
        }
      }, "-=0.5");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.content}>
        <div className={styles.wordStack}>
          <h2 ref={word1Ref} className={styles.word}>I BUILD</h2>
          <h2 ref={word2Ref} className={styles.word}>THINGS</h2>
          <h2 ref={word3Ref} className={styles.word}>
            THAT WORK<span className={styles.dot}>.</span>
          </h2>
        </div>

        <div className={styles.counters}>
          <div className={`${styles.counterItem} counter-box`}>
            <span ref={projectsRef} className={styles.number}>0+</span>
            <span className={styles.label}>PROJECTS BUILT</span>
          </div>
          <div className={`${styles.counterItem} counter-box`}>
            <span ref={yearsRef} className={styles.number}>0</span>
            <span className={styles.label}>YEARS CODING</span>
          </div>
          <div className={`${styles.counterItem} counter-box`}>
            <span className={styles.number}>∞</span>
            <span className={styles.label}>CUPS OF COFFEE</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAmI;
