import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/HeroExit.module.css';

gsap.registerPlugin(ScrollTrigger);

const HeroExit = () => {
  const sectionRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const textRef = useRef(null);

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
        }
      });

      // 1. Split panels and reveal content (no line)
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
      <div className={styles.stars} />

      {/* Reveal text — sits behind panels, z-index 1 */}
      <div className={styles.revealContent}>
        <h2 ref={textRef} className={styles.headline}>
          BUILDING THINGS<br />THAT MATTER.
        </h2>
      </div>

      {/* Split panels — z-index 5, cover text until split */}
      <div ref={topRef} className={styles.panelTop} />
      <div ref={bottomRef} className={styles.panelBottom} />
    </section>
  );
};

export default HeroExit;
