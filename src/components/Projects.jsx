import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: "01",
    name: "CURALINK AI",
    stack: ["React", "Node.js", "MongoDB", "Groq", "PubMed API"],
    desc: "Medical AI research assistant with parallel retrieval, re-ranking, and multi-turn memory",
    live: "https://curalink-ai-gilt.vercel.app/",
    github: "https://github.com/Ragu3175/Curalink-AI",
    image: "/projects/curalink/1.jpg",
    bgTint: "rgba(0, 180, 120, 0.03)"
  },
  {
    id: "02",
    name: "CODEPILOT",
    stack: ["React Native", "Expo", "Node.js", "Gemini", "Groq"],
    desc: "Mobile AI code editor with file tree, diff viewer, and 20-step undo stack",
    live: "https://github.com/Ragu3175/Mobile-AiCode-Editor",
    github: "https://github.com/Ragu3175/Mobile-AiCode-Editor",
    image: "/projects/codepilot/1.jpg",
    bgTint: "rgba(100, 100, 255, 0.03)"
  },
  {
    id: "03",
    name: "SAFEDRIVE AI",
    stack: ["React", "Node.js", "ESP32", "Render", "Vercel"],
    desc: "Real-time vehicle telemetry dashboard with live sensor data and violation detection",
    live: "https://final-year-project-three-red.vercel.app/",
    github: "https://github.com/Ragu3175",
    image: "/projects/safedrive/1.jpg",
    bgTint: "rgba(255, 140, 0, 0.03)"
  }
];

const Projects = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(`.${styles.panel}`);
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
        }
      });

      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return; // Last panel doesn't exit

        const nextPanel = panels[i + 1];
        
        // Panel out animation
        tl.to(panel, {
          rotateX: 8,
          scale: 0.92,
          opacity: 0,
          duration: 1,
        }, i)
        // Next panel in animation
        .fromTo(nextPanel, 
          { y: "100vh" }, 
          { y: 0, duration: 1 }, 
          i
        );
      });

      // Infinite floating animation for images
      const images = sectionRef.current.querySelectorAll(`.${styles.projectImage}`);
      images.forEach((img, i) => {
        gsap.to(img, {
          y: -15,
          duration: 3 + i * 0.5,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={containerRef} className={styles.container}>
        {PROJECTS.map((project, index) => (
          <div 
            key={project.id} 
            className={styles.panel}
            style={{ 
              zIndex: PROJECTS.length - index,
              backgroundColor: project.bgTint 
            }}
          >
            <div className={styles.panelContent}>
              {/* Left Side: Info */}
              <div className={styles.infoCol}>
                <span className={styles.number}>{project.id}</span>
                <h2 className={styles.name}>{project.name}</h2>
                <div className={styles.stack}>
                  {project.stack.map(s => <span key={s} className={styles.stackItem}>{s}</span>)}
                </div>
                <p className={styles.desc}>{project.desc}</p>
                
                <div className={styles.actions}>
                  <a href={project.live} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                    VIEW LIVE
                  </a>
                  <a href={project.github} target="_blank" rel="noreferrer" className={styles.btnSecondary}>
                    GITHUB →
                  </a>
                </div>
              </div>

              {/* Right Side: Image */}
              <div className={styles.visualCol}>
                <div className={styles.imageCard}>
                  <img src={project.image} alt={project.name} className={styles.projectImage} />
                  <div className={styles.imageGlow}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
