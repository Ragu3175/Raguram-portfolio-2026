import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Skills.module.css';

gsap.registerPlugin(ScrollTrigger);

const SKILLS_DATA = [
  // Frontend
  { name: "React", level: 95, category: "Frontend" },
  { name: "React Native", level: 88, category: "Frontend" },
  { name: "TypeScript", level: 82, category: "Frontend" },
  { name: "GSAP", level: 80, category: "Frontend" },
  { name: "Three.js", level: 65, category: "Frontend" },
  // Backend
  { name: "Node.js", level: 92, category: "Backend" },
  { name: "Express", level: 90, category: "Backend" },
  { name: "MongoDB", level: 88, category: "Backend" },
  { name: "PostgreSQL", level: 75, category: "Backend" },
  { name: "Prisma", level: 78, category: "Backend" },
  { name: "Socket.io", level: 80, category: "Backend" },
  // AI/LLM
  { name: "Groq API", level: 85, category: "AI/LLM" },
  { name: "Gemini API", level: 83, category: "AI/LLM" },
  { name: "Python", level: 72, category: "AI/LLM" },
  { name: "LangChain", level: 70, category: "AI/LLM" },
  // Tools
  { name: "Docker", level: 74, category: "Tools" },
  { name: "AWS", level: 68, category: "Tools" },
  { name: "Git", level: 90, category: "Tools" },
  { name: "Figma", level: 75, category: "Tools" },
  { name: "JWT", level: 88, category: "Tools" }
];

const CATEGORIES = ["All", "Frontend", "Backend", "AI/LLM", "Tools"];

const getLevelText = (level) => {
  if (level >= 90) return "Expert";
  if (level >= 80) return "Advanced";
  if (level >= 70) return "Proficient";
  return "Learning";
};

const Skills = () => {
  const [activeTab, setActiveTab] = useState("All");
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  const filteredSkills = useMemo(() => {
    if (activeTab === "All") return SKILLS_DATA;
    return SKILLS_DATA.filter(skill => skill.category === activeTab);
  }, [activeTab]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      // Cards Animation - Random positions
      // We animate cards that are currently visible
      const animateCards = () => {
        gsap.fromTo(cardsRef.current.filter(Boolean),
          { 
            x: () => gsap.utils.random(-300, 300), 
            y: () => gsap.utils.random(-200, 200), 
            opacity: 0, 
            scale: 0.6 
          },
          { 
            x: 0, 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            duration: 0.8, 
            ease: "back.out(1.2)", 
            stagger: 0.03,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
            }
          }
        );
      };

      animateCards();

    }, sectionRef);

    return () => ctx.revert();
  }, [activeTab]); // Re-animate when tab changes? The prompt implies entry animation, but let's re-run for filter feel.

  return (
    <section ref={sectionRef} className={styles.section} id="skills">
      <div className={styles.header} ref={headerRef}>
        <span className={styles.label}>03 · Stack</span>
        <h2 className={styles.title}>What I Build With</h2>
        <span className={styles.subtitle}>{SKILLS_DATA.length} technologies</span>
      </div>

      <div className={styles.filterRow}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.tab} ${activeTab === cat ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid} ref={gridRef}>
        {filteredSkills.map((skill, i) => (
          <div 
            key={skill.name} 
            className={styles.card}
            ref={el => cardsRef.current[i] = el}
          >
            <span className={styles.skillName}>{skill.name}</span>
            <div className={styles.barTrack}>
              <div 
                className={styles.barFill} 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            <span className={styles.levelLabel}>{getLevelText(skill.level)}</span>
          </div>
        ))}
      </div>

      <div className={styles.footerLine}>
        <div className={styles.pulseDot}></div>
        <span>Currently building: CodePilot (React Native AI editor) + this portfolio</span>
      </div>
    </section>
  );
};

export default Skills;
