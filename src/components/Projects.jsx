import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
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
    images: [
      '/projects/curalink/1.jpg',
      '/projects/curalink/Screenshot 2026-04-19 095858.png',
      '/projects/curalink/Screenshot 2026-04-19 193855.png',
    ],
    mesh: {
      c1: '0, 180, 140',   // teal
      c2: '0, 120, 100',   // deep teal
      c3: '232, 255, 71',  // lime accent
    },
    bgTint: 'rgba(0, 180, 120, 0.03)',
    glowRgba: 'rgba(0, 180, 140, 0.45)',
  },
  {
    id: '02',
    name: 'CODEPILOT',
    stack: ['React Native', 'Expo', 'Node.js', 'Gemini', 'Groq'],
    desc: 'Mobile AI code editor with file tree, diff viewer, and 20-step undo stack.',
    live: 'https://github.com/Ragu3175/Mobile-AiCode-Editor',
    github: 'https://github.com/Ragu3175/Mobile-AiCode-Editor',
    images: [
      '/projects/codepilot/1.jpg',
      '/projects/codepilot/Edit-with-AI.jpeg',
      '/projects/codepilot/codepilot-logo.png',
    ],
    mesh: {
      c1: '100, 80, 255',  // purple
      c2: '60, 40, 180',   // deep indigo
      c3: '180, 160, 255', // lavender accent
    },
    bgTint: 'rgba(100, 100, 255, 0.03)',
    isMobile: true,
    glowRgba: 'rgba(100, 80, 255, 0.45)',
  },
  {
    id: '03',
    name: 'SAFEDRIVE AI',
    stack: ['React', 'Node.js', 'ESP32', 'Render', 'Vercel'],
    desc: 'Real-time vehicle telemetry dashboard with live sensor data and violation detection.',
    live: 'https://final-year-project-three-red.vercel.app/',
    github: 'https://github.com/Ragu3175',
    images: [
      '/projects/safedrive/1.jpg',
      '/projects/safedrive/Screenshot 2026-02-28 124005.png',
      '/projects/safedrive/Screenshot 2026-02-28 124019.png',
    ],
    mesh: {
      c1: '255, 140, 0',   // amber
      c2: '200, 90, 0',    // deep orange
      c3: '255, 200, 80',  // gold accent
    },
    bgTint: 'rgba(255, 140, 0, 0.03)',
    glowRgba: 'rgba(255, 140, 0, 0.45)',
  },
];

const Projects = () => {
  const sectionRef = useRef(null);
  const [activeImages, setActiveImages] = useState(
    PROJECTS.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {})
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(`.${styles.panel}`);

      panels.forEach((panel, i) => {
        if (i === 0) {
          gsap.set(panel, { pointerEvents: 'auto' });
          return;
        }
        gsap.set(panel, { y: '100vh', autoAlpha: 0, pointerEvents: 'none' });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: 2,
        },
      });

      // Pause at the beginning so the first panel is readable
      tl.to({}, { duration: 0.5 });

      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return;
        const next = panels[i + 1];
        
        // Stagger the transitions with pauses in between
        const startTime = 0.5 + i * 2.5;

        // Swap pointer events exactly when the transition starts
        tl.set(panel, { pointerEvents: 'none' }, startTime)
          .set(next, { pointerEvents: 'auto' }, startTime)
          .to(panel, {
            rotateX: 6,
            scale: 0.94,
            autoAlpha: 0,
            duration: 1.5,
            ease: 'power2.inOut',
          }, startTime)
          .fromTo(next,
            { y: '100vh', autoAlpha: 0 },
            { y: '0vh', autoAlpha: 1, duration: 1.5, ease: 'power2.out' },
            startTime
          );
      });

      // Pause at the end
      tl.to({}, { duration: 1.0 });

      // Mouse move — directional rim light on each panel
      const handleMouseMove = (e) => {
        panels.forEach(panel => {
          const rect = panel.getBoundingClientRect();
          if (rect.top > window.innerHeight || rect.bottom < 0) return;
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          panel.style.setProperty('--rx', `${x}%`);
          panel.style.setProperty('--ry', `${y}%`);
        });
      };
      window.addEventListener('mousemove', handleMouseMove);

      return () => window.removeEventListener('mousemove', handleMouseMove);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleThumbClick = (projectId, index) => {
    setActiveImages(prev => ({ ...prev, [projectId]: index }));
  };

  return (
    <section ref={sectionRef} id="work" className={styles.section}>
      <div className={styles.container}>
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            className={styles.panel}
            style={{ zIndex: PROJECTS.length - i }}
          >
            {/* Gradient mesh background */}
            <div
              className={styles.meshBg}
              style={{
                '--c1': p.mesh.c1,
                '--c2': p.mesh.c2,
                '--c3': p.mesh.c3,
              }}
            />
            {/* Directional rim light overlay */}
            <div className={styles.rimLight} />

            <div className={styles.panelContent}>

              {/* LEFT — Info */}
              <div className={styles.infoCol}>
                <span className={styles.number}>{p.id}</span>
                <h2 className={styles.name} data-project-name>{p.name}</h2>
                <div className={styles.stack}>
                  {p.stack.map(s => (
                    <span key={s} className={styles.stackItem}>{s}</span>
                  ))}
                </div>
                <p className={styles.desc}>{p.desc}</p>
                <div className={styles.actions}>
                  <a href={p.live} target="_blank" rel="noreferrer" className={styles.btnLive}>
                    View Live
                  </a>
                  <a href={p.github} target="_blank" rel="noreferrer" className={styles.btnGh}>
                    GitHub →
                  </a>
                </div>
              </div>

              {/* RIGHT — Stacked card images */}
              <div className={styles.visualCol}>
                <div className={`${styles.cardStack} ${p.isMobile ? styles.mobileStack : ''}`}>

                  {/* Background thumbnail cards — dynamically filter out the active image */}
                  {p.images
                    .map((img, idx) => ({ img, idx }))
                    .filter(item => item.idx !== activeImages[p.id])
                    .map((item, i) => (
                    <div
                      key={item.idx}
                      className={`${styles.thumbCard} ${styles[`thumbCard${i + 1}`]}`}
                      onClick={() => handleThumbClick(p.id, item.idx)}
                    >
                      <img src={item.img} alt={`${p.name} screenshot ${item.idx + 1}`} />
                    </div>
                  ))}

                  {/* Main card — front */}
                  <div
                    className={styles.mainCard}
                    onClick={() => handleThumbClick(p.id, 0)}
                  >
                    <img
                      src={p.images[activeImages[p.id]]}
                      alt={p.name}
                    />
                  </div>
                  <div className={styles.cardGlow}
                    style={{ background: p.glowRgba, filter: 'blur(35px)' }}
                  />

                  {/* Thumbnail dots navigation */}
                  <div className={styles.thumbDots}>
                    {p.images.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        className={`${styles.dot} ${activeImages[p.id] === dotIdx ? styles.dotActive : ''}`}
                        onClick={() => handleThumbClick(p.id, dotIdx)}
                      />
                    ))}
                  </div>

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
