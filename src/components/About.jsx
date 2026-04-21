import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

const QUOTE = "I don't just write code.\nI build experiences.";

const BADGES = [
  { text: "MERN Stack",    top: "8%",  right: "-5%",  left: "auto" },
  { text: "React Native",  top: "32%", right: "-8%",  left: "auto" },
  { text: "AI / LLM",      top: "62%", right: "-5%",  left: "auto" },
  { text: "Open to Work",  top: "82%", left: "10%",   right: "auto" }
];

const About = () => {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const glowRef = useRef(null);
  const ghostNumRef = useRef(null);
  const labelRef = useRef(null);
  const badgeRefs = useRef([]);
  
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  
  const yearsRef = useRef(null);
  const projectsRef = useRef(null);
  const typewriterRef = useRef(null);
  const scanLineRef = useRef(null);
  const bioRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([card1Ref.current, card2Ref.current, card3Ref.current], { opacity: 0 });
      gsap.set(photoRef.current, { clipPath: 'circle(0% at 50% 50%)' });
      const profileImg = photoRef.current?.querySelector('img');
      if (profileImg) gsap.set(profileImg, { filter: 'grayscale(1)' });
      gsap.set(glowRef.current, { opacity: 0 });
      gsap.set(badgeRefs.current, { opacity: 0, x: 30 });
      gsap.set(labelRef.current, { opacity: 0 });
      gsap.set(ghostNumRef.current, { scale: 3, opacity: 0.05 });

      const st = {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Phase 3-4: Counter updates (Identity Card)
          if (p >= 0.4 && p <= 0.7) {
            const cp = (p - 0.4) / 0.3;
            if (yearsRef.current) yearsRef.current.textContent = Math.floor(cp * 3);
            if (projectsRef.current) projectsRef.current.textContent = Math.floor(cp * 27);
          }

          // Phase 5-6: Typewriter (Philosophy Card)
          if (p >= 0.65 && p <= 0.88) {
            const tp = (p - 0.65) / 0.23;
            const chars = Math.floor(tp * QUOTE.length);
            if (typewriterRef.current) {
              typewriterRef.current.innerHTML = QUOTE.substring(0, chars).replace('\n', '<br/>');
            }
          }

          // Phase 7: Scan line & Bio reveal (Bio Card)
          if (p >= 0.86) {
            const sp = Math.min(1, (p - 0.86) / 0.12);
            if (scanLineRef.current) gsap.set(scanLineRef.current, { top: `${sp * 100}%` });
            if (bioRef.current) {
              const pct = sp * 120;
              const mask = `linear-gradient(to bottom, black ${pct}%, transparent ${pct + 15}%)`;
              gsap.set(bioRef.current, { 
                maskImage: mask, 
                WebkitMaskImage: mask 
              });
            }
          }
        }
      };

      const tl = gsap.timeline({ scrollTrigger: st });

      // Phase 0 [0-1]: ghost number fade + label fade in
      tl.fromTo(ghostNumRef.current, 
        { scale: 3, opacity: 0.05 }, 
        { scale: 1, opacity: 0, ease: 'none', duration: 2 }, 0
      );
      tl.to(labelRef.current, { opacity: 1, duration: 0.5 }, 0.5);

      // Phase 1 [1-3]: iris expand + B&W to color + badge 1
      tl.to(photoRef.current, { 
        clipPath: 'circle(75% at 50% 50%)', 
        ease: 'power2.inOut', 
        duration: 2 
      }, 1);
      
      if (profileImg) {
        tl.to(profileImg, { 
          filter: 'grayscale(0)', 
          ease: 'none', 
          duration: 2 
        }, 1);
      }
      
      tl.to(glowRef.current, { opacity: 0.15, duration: 1.5 }, 1.5);
      tl.fromTo(badgeRefs.current[0], 
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.6 }, 2
      );

      // Phase 2 [3-4]: Badge 2 flies in
      tl.fromTo(badgeRefs.current[1], 
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5 }, 3.5
      );

      // Phase 3 [4-6]: Card 1 (Identity) rises in
      tl.fromTo(card1Ref.current,
        { y: 70, opacity: 0, scale: 0.96, rotateX: -4 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'power3.out' }, 4
      );

      // Phase 4 [6-6.5]: Badge 3 flies in
      tl.fromTo(badgeRefs.current[2], 
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5 }, 6
      );

      // Phase 5 [6.5-8]: Card 1 folds away, Card 2 (Philosophy) rises
      tl.to(card1Ref.current, { 
        rotateX: 8, scale: 0.92, opacity: 0, duration: 1.2, ease: 'power2.in' 
      }, 6.5);
      
      tl.fromTo(card2Ref.current,
        { y: 70, opacity: 0, scale: 0.96, rotateX: -4 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'power3.out' }, 7
      );

      // Phase 6 [8-8.5]: Badge 4 flies in
      tl.fromTo(badgeRefs.current[3], 
        { x: -20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5 }, 8
      );

      // Phase 7 [8.5-10]: Card 2 folds away, Card 3 (Bio) rises
      tl.to(card2Ref.current, { 
        rotateX: 8, scale: 0.92, opacity: 0, duration: 1.2, ease: 'power2.in' 
      }, 8.5);
      
      tl.fromTo(card3Ref.current,
        { y: 70, opacity: 0, scale: 0.96, rotateX: -4 },
        { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 1.5, ease: 'power3.out' }, 9
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>
          <div ref={ghostNumRef} className={styles.ghostNum}>03</div>
          
          <div className={styles.photoWrapper}>
            <div ref={photoRef} className={styles.photoIris}>
              <img src="/profile.png" alt="Raguram R" className={styles.profileImg} />
              <div className={styles.scanlines} />
            </div>
            <div ref={glowRef} className={styles.photoGlow} />
          </div>

          <div ref={labelRef} className={styles.sectionLabel}>
            <span>03 · About</span>
            <div className={styles.labelLine} />
          </div>

          {BADGES.map((b, i) => (
            <div 
              key={i} 
              ref={el => badgeRefs.current[i] = el} 
              className={styles.badge} 
              style={{ top: b.top, right: b.right, left: b.left }}
            >
              {b.text}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
          {/* CARD 1 - IDENTITY */}
          <div ref={card1Ref} className={`${styles.card} ${styles.card1}`}>
            <div className={styles.card1Border} />
            <h3 className={styles.card1Name}>RAGURAM R</h3>
            <p className={styles.card1Role}>Full Stack Developer · MERN · AI</p>
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span ref={yearsRef} className={styles.statNum}>0</span>
                <span className={styles.statSuffix}>+</span>
                <p className={styles.statLabel}>Years Building</p>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span ref={projectsRef} className={styles.statNum}>0</span>
                <span className={styles.statSuffix}>+</span>
                <p className={styles.statLabel}>Projects Shipped</p>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>ECE</span>
                <p className={styles.statLabel}>KIT Coimbatore</p>
              </div>
            </div>
          </div>

          {/* CARD 2 - PHILOSOPHY */}
          <div ref={card2Ref} className={`${styles.card} ${styles.card2}`}>
            <div className={styles.quoteBg}>"</div>
            <p ref={typewriterRef} className={styles.quoteText}></p>
            <div className={styles.quoteLine} />
          </div>

          {/* CARD 3 - BIO + STACK */}
          <div ref={card3Ref} className={`${styles.card} ${styles.card3}`}>
            <div className={styles.card3Header}>
              <span className={styles.card3Label}>About me</span>
            </div>
            <div className={styles.bioWrapper}>
              <div ref={scanLineRef} className={styles.scanLine} />
              <p ref={bioRef} className={styles.bioText}>
                I obsess over <span className={styles.lime}>clean architecture</span> and{' '}
                <span className={styles.lime}>smooth UX</span>. From{' '}
                <span className={styles.lime}>ESP32 firmware</span> to{' '}
                <span className={styles.lime}>LLM orchestration</span> — I build across the full stack.
                Currently targeting SDE1 in{' '}
                <span className={styles.lime}>Bengaluru · Chennai · Hyderabad</span>.
              </p>
            </div>
            <div className={styles.stackPills}>
              {['React', 'Node.js', 'MongoDB', 'React Native', 'TypeScript', 'Groq API', 'GSAP', 'Docker'].map(s => (
                <span key={s} className={styles.pill}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
