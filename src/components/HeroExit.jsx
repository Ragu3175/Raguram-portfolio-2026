import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/HeroExit.module.css';

gsap.registerPlugin(ScrollTrigger);

const HeroExit = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const topHalfRef = useRef(null);
  const bottomHalfRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { width: 0 });
      gsap.set(topHalfRef.current, { yPercent: 0 });
      gsap.set(bottomHalfRef.current, { yPercent: 0 });
      gsap.set(textRef.current, { opacity: 0, scale: 0.85 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1.5,
        },
      });

      // Line grows across screen
      tl.to(lineRef.current, { width: '100vw', duration: 0.4, ease: 'power2.inOut' });

      // Line splits — top goes up, bottom goes down
      tl.to(topHalfRef.current, { yPercent: -100, duration: 0.4, ease: 'power3.inOut' }, '>');
      tl.to(bottomHalfRef.current, { yPercent: 100, duration: 0.4, ease: 'power3.inOut' }, '<');

      // Text reveals as split happens
      tl.to(textRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }, '<+=0.1');

      // Hold
      tl.to({}, { duration: 0.3 });

      // Ensure it's hidden after animation finishes to prevent bleeding
      tl.set(sectionRef.current, { autoAlpha: 0 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Star field — pure CSS */}
      <div className={styles.stars} />

      {/* The splitting line */}
      <div className={styles.lineWrap}>
        <div ref={topHalfRef} className={styles.lineHalf}>
          <div ref={lineRef} className={styles.line} />
        </div>
        <div ref={bottomHalfRef} className={`${styles.lineHalf} ${styles.lineHalfBottom}`} />
      </div>

      {/* Revealed text */}
      <div ref={textRef} className={styles.textWrap}>
        <h2 className={styles.headline}>
          BUILDING THINGS<br />
          <span>THAT MATTER.</span>
        </h2>
      </div>
    </section>
  );
};

export default HeroExit;
