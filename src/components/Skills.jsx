import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Skills.module.css';

gsap.registerPlugin(ScrollTrigger);

const SKILLS_DATA = [
  // Technical Line
  { name: "JavaScript", level: 92, category: "Frontend", isPrimary: true },
  { name: "Python", level: 85, category: "Backend", isPrimary: true },
  { name: "Java", level: 80, category: "Backend", isPrimary: true },
  { name: "React.js", level: 95, category: "Frontend", isPrimary: true },
  { name: "React Native", level: 88, category: "Frontend", isPrimary: true },
  { name: "Node.js", level: 90, category: "Backend", isPrimary: true },
  { name: "Express.js", level: 88, category: "Backend", isPrimary: true },
  { name: "REST APIs", level: 85, category: "Backend", isPrimary: true },
  { name: "JWT", level: 82, category: "Backend", isPrimary: true },
  { name: "Git", level: 90, category: "Tools", isPrimary: true },
  // LLMs & GenAI Line
  { name: "Gemini API", level: 85, category: "AI/LLM", isPrimary: true },
  { name: "Groq (llama-3.3-70b)", level: 83, category: "AI/LLM", isPrimary: true },
  { name: "LLM Orchestration", level: 80, category: "AI/LLM", isPrimary: true },
  { name: "Multi-Model Architectures", level: 78, category: "AI/LLM", isPrimary: true },
  { name: "Prompt Engineering", level: 88, category: "AI/LLM", isPrimary: true },
  // Tools & Cloud Line
  { name: "MongoDB", level: 88, category: "Backend", isPrimary: true },
  { name: "PostgreSQL", level: 82, category: "Backend", isPrimary: true },
  { name: "Docker", level: 75, category: "Tools", isPrimary: true },
  { name: "AWS (EC2, S3)", level: 70, category: "Tools", isPrimary: true },
  { name: "GitHub OAuth", level: 82, category: "Tools", isPrimary: true },
  // Coursework Line
  { name: "Data Structures & Algorithms", level: 85, category: "Tools", isPrimary: true },
  { name: "DBMS", level: 80, category: "Tools", isPrimary: true },
  { name: "OOP", level: 88, category: "Tools", isPrimary: true },
  // Additional Skills
  { name: "Tailwind CSS", level: 90, category: "Frontend", isPrimary: false },
  { name: "Next.js", level: 85, category: "Frontend", isPrimary: false },
  { name: "Redux", level: 80, category: "Frontend", isPrimary: false },
  { name: "Framer Motion", level: 84, category: "Frontend", isPrimary: false },
  { name: "GSAP", level: 80, category: "Frontend", isPrimary: false },
  { name: "Three.js", level: 65, category: "Frontend", isPrimary: false },
  { name: "CodeMirror", level: 78, category: "Frontend", isPrimary: false },
  { name: "Prisma", level: 78, category: "Backend", isPrimary: false },
  { name: "Socket.io", level: 80, category: "Backend", isPrimary: false },
  { name: "Spring Boot", level: 72, category: "Backend", isPrimary: false },
  { name: "LangChain", level: 70, category: "AI/LLM", isPrimary: false },
  { name: "Scikit-learn", level: 65, category: "AI/LLM", isPrimary: false },
  { name: "Figma", level: 75, category: "Tools", isPrimary: false }
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
    if (activeTab === "All") return SKILLS_DATA.filter(skill => skill.isPrimary);
    return SKILLS_DATA.filter(skill => skill.category === activeTab);
  }, [activeTab]);

  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('[data-skill-card]');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  // Reset refs array on each render
  cardsRef.current = cardsRef.current.slice(0, filteredSkills.length);

  // 1) Header scroll animation — runs ONCE on mount only
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // 2) Card fly-in — runs when filteredSkills changes OR on first scroll entry
  useLayoutEffect(() => {
    if (!cardsRef.current.length) return;
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    // Start cards invisible but IN PLACE — no scatter yet
    gsap.set(cards, { opacity: 0, scale: 0.8 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 65%',
        onEnter: flyIn,
        onEnterBack: flyIn,
      });

      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight * 0.65) {
        flyIn();
      }
    });

    function flyIn() {
      // Scatter then animate to home — all inside flyIn so positions are correct
      gsap.fromTo(cards,
        {
          x: () => gsap.utils.random(-400, 400),
          y: () => gsap.utils.random(-150, 150),
          opacity: 0,
          scale: 0.5,
          rotation: () => gsap.utils.random(-15, 15),
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.9,
          ease: 'back.out(1.4)',
          stagger: {
            each: 0.035,
            from: 'random',
          },
          overwrite: true,
        }
      );
    }

    return () => ctx.revert();
  }, [filteredSkills]);

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

      <div className={styles.grid} ref={gridRef} onMouseMove={handleMouseMove}>
        {filteredSkills.map((skill, i) => (
          <div 
            key={skill.name} 
            className={styles.card}
            ref={el => cardsRef.current[i] = el}
            data-skill-card
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
