import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Skills.module.css';

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  "React", "Node.js", "MongoDB", "Express", "React Native", 
  "TypeScript", "Python", "GSAP", "Three.js", "Docker", 
  "AWS", "PostgreSQL", "Prisma", "Socket.io", "Groq API",
  "Gemini API", "Git", "Figma", "REST APIs", "JWT"
];

const Skills = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Fly-in animation
      const pills = sectionRef.current.querySelectorAll(`.${styles.pill}`);
      
      gsap.fromTo(pills, 
        {
          x: () => (Math.random() - 0.5) * window.innerWidth * 2,
          y: () => (Math.random() - 0.5) * window.innerHeight * 2,
          opacity: 0,
          scale: 0.5,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.2)",
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      // Title drift
      gsap.to(titleRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 ref={titleRef} className={styles.ghostTitle}>STACK</h2>
      
      <div ref={containerRef} className={styles.pillContainer}>
        {SKILLS.map((skill, index) => (
          <div key={index} className={styles.pill}>
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
