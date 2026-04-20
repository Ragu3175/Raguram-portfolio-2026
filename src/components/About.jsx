import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/About.module.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textLinesRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Image Parallax
      gsap.to(imageRef.current, {
        y: (i, target) => -target.offsetHeight * 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Line Wipe Reveal for text
      const textContainers = sectionRef.current.querySelectorAll(`.${styles.lineContent}`);
      
      textContainers.forEach((container, i) => {
        const line = container.querySelector(`.${styles.wipeLine}`);
        const text = container.querySelector(`.${styles.revealedText}`);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            // toggleActions: "play none none none"
          }
        });

        tl.fromTo(line, 
          { scaleX: 0 }, 
          { scaleX: 1, duration: 0.8, ease: "power2.inOut", transformOrigin: "left" }
        )
        .to(text, { opacity: 1, duration: 0.4 }, "-=0.2")
        .to(line, { scaleX: 0, duration: 0.6, ease: "power2.inOut", transformOrigin: "right" });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.grid}>
        {/* Left: Image */}
        <div className={styles.leftCol}>
          <div className={styles.imageWrapper}>
            <img 
              ref={imageRef}
              src="/profile.png" 
              alt="Raguram R" 
              className={styles.profileImg} 
            />
            <div className={styles.glow}></div>
          </div>
        </div>

        {/* Right: Content */}
        <div className={styles.rightCol}>
          <div className={styles.textStack}>
            <div className={styles.lineContent}>
              <div className={styles.wipeLine}></div>
              <h3 className={styles.revealedText}>Final year ECE student at KIT Coimbatore</h3>
            </div>
            <div className={styles.lineContent}>
              <div className={styles.wipeLine}></div>
              <h3 className={styles.revealedText}>Full Stack Developer — MERN · React Native · AI</h3>
            </div>
            <div className={styles.lineContent}>
              <div className={styles.wipeLine}></div>
              <h3 className={styles.revealedText}>Building production-grade apps since day one</h3>
            </div>
          </div>

          <p className={styles.bio}>
            I obsess over clean architecture, smooth UX, and shipping things that 
            actually work in production. From ESP32 firmware to LLM orchestration — 
            I build across the full stack.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
