import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Transition.module.css';

gsap.registerPlugin(ScrollTrigger);

const Transition = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const countersRef = useRef(null);
  const proj = useRef(null);
  const yrs = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.2,
        },
      });

      // Headline fades in as you scroll
      tl.to(headlineRef.current,
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      // Counters fade in
      tl.to(countersRef.current,
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );

      // Numbers count up
      const counts = { projects: 0, years: 0 };
      tl.to(counts, {
        projects: 27,
        years: 3,
        duration: 1.2,
        ease: 'power1.out',
        onUpdate: () => {
          if (proj.current)
            proj.current.textContent = Math.floor(counts.projects) + '+';
          if (yrs.current)
            yrs.current.textContent = Math.floor(counts.years);
        },
      }, '<');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 ref={headlineRef} className={styles.headline}
          style={{ transform: 'translateY(30px)' }}>
        FROM IDEA TO{' '}
        <span>DEPLOYMENT.</span>
      </h2>

      <div ref={countersRef} className={styles.counters}>
        <div className={styles.counter}>
          <span ref={proj} className={styles.number}>0+</span>
          <span className={styles.countLabel}>Projects Built</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.counter}>
          <span ref={yrs} className={styles.number}>0</span>
          <span className={styles.countLabel}>Years Coding</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.counter}>
          <span className={styles.number}>∞</span>
          <span className={styles.countLabel}>Cups of Coffee</span>
        </div>
      </div>
    </section>
  );
};

export default Transition;
