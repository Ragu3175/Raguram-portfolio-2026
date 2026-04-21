import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: '01',
    name: 'CURALINK AI',
    stack: ['React', 'Node.js', 'MongoDB', 'Groq', 'PubMed API'],
    desc: 'Medical AI research assistant with parallel retrieval, re-ranking, and multi-turn memory.',
    live: 'https://curalink-ai-gilt.vercel.app/',
    github: 'https://github.com/Ragu3175/Curalink-AI',
    image: '/projects/curalink/1.jpg',
    type: 'landscape',
    bgTint: 'rgba(0, 180, 120, 0.02)',
  },
  {
    id: '02',
    name: 'CODEPILOT',
    stack: ['React Native', 'Expo', 'Node.js', 'Gemini', 'Groq'],
    desc: 'Mobile AI code editor with file tree, diff viewer, and 20-step undo stack.',
    live: 'https://github.com/Ragu3175/Mobile-AiCode-Editor',
    github: 'https://github.com/Ragu3175/Mobile-AiCode-Editor',
    image: '/projects/codepilot/1.jpg',
    type: 'portrait',
    bgTint: 'rgba(100, 100, 255, 0.02)',
  },
  {
    id: '03',
    name: 'SAFEDRIVE AI',
    stack: ['React', 'Node.js', 'ESP32', 'Render', 'Vercel'],
    desc: 'Real-time vehicle telemetry dashboard with live sensor data and violation detection.',
    live: 'https://final-year-project-three-red.vercel.app/',
    github: 'https://github.com/Ragu3175',
    image: '/projects/safedrive/1.jpg',
    type: 'landscape',
    bgTint: 'rgba(255, 140, 0, 0.02)',
  },
];

const Projects = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(`.${styles.panel}`);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=350%',       // slower — more scroll per transition
          pin: true,
          scrub: 2,            // heavier scrub = more resistance = slower feel
        },
      });

      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return;
        const next = panels[i + 1];

        tl.to(panel, {
          rotateX: 6,
          scale: 0.94,
          opacity: 0,
          duration: 1.5,       // longer duration
          ease: 'power2.inOut',
        }, i * 1.5)
        .fromTo(next,
          { y: '100vh', opacity: 0 },
          { y: '0vh', opacity: 1, duration: 1.5, ease: 'power2.out' },
          i * 1.5
        );
      });

      // Float animation — only on visible images
      const images = sectionRef.current.querySelectorAll(`.${styles.frameWrap} img, .${styles.phoneScreen} img`);
      images.forEach((img, i) => {
        gsap.to(img, {
          y: -10,
          duration: 3.5 + i * 0.4,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className={styles.section}>
      <div className={styles.container}>
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            className={styles.panel}
            style={{
              zIndex: PROJECTS.length - i,
              backgroundColor: p.bgTint,
            }}
          >
            <div className={styles.panelContent}>

              {/* INFO */}
              <div className={styles.infoCol}>
                <span className={styles.number}>{p.id}</span>
                <h2 className={styles.name}>{p.name}</h2>
                <div className={styles.stack}>
                  {p.stack.map(s => (
                    <span key={s} className={styles.stackItem}>{s}</span>
                  ))}
                </div>
                <p className={styles.desc}>{p.desc}</p>
                <div className={styles.actions}>
                  <a href={p.live} target="_blank" rel="noreferrer"
                     className={styles.btnLive}>
                    View Live
                  </a>
                  <a href={p.github} target="_blank" rel="noreferrer"
                     className={styles.btnGh}>
                    GitHub →
                  </a>
                </div>
              </div>

              {/* VISUAL — landscape or portrait */}
              <div className={styles.visualCol}>
                {p.type === 'portrait' ? (
                  <div className={styles.phoneWrap}>
                    <div className={styles.phoneShell}>
                      <div className={styles.phoneNotch} />
                      <div className={styles.phoneScreen}>
                        <img src={p.image} alt={p.name} />
                      </div>
                    </div>
                    <div className={styles.imageGlow} />
                  </div>
                ) : (
                  <div className={styles.frameWrap}>
                    <img src={p.image} alt={p.name} />
                    <div className={styles.imageGlow} />
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
