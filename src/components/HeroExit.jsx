import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/HeroExit.module.css';

gsap.registerPlugin(ScrollTrigger);

const HeroExit = () => {
  const sectionRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const lineRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Main timeline for the whole sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          // markers: true,
        }
      });

      // 1. Line draws out
      tl.fromTo(lineRef.current, 
        { width: 0 }, 
        { width: "100%", duration: 1, ease: "none" }
      );

      // 2. Line splits and content reveals
      tl.to(topRef.current, { yPercent: -100, duration: 1 }, "split")
        .to(bottomRef.current, { yPercent: 100, duration: 1 }, "split")
        .fromTo(textRef.current, 
          { opacity: 0, scale: 0.85, filter: "blur(10px)" }, 
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }, 
          "split+=0.1"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background Starfield */}
      <div className={styles.stars}></div>

      {/* Center Reveal Content */}
      <div className={styles.revealContent}>
        <h2 ref={textRef} className={styles.headline}>
          BUILDING THINGS<br />THAT MATTER.
        </h2>
      </div>

      {/* The Split Panels */}
      <div ref={topRef} className={styles.panelTop}>
        <div className={styles.line}></div>
      </div>
      <div ref={bottomRef} className={styles.panelBottom}></div>
    </section>
  );
};

export default HeroExit;
