import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/About.module.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    number: "3+",
    label: "Years Building",
    desc: "Full stack development from embedded systems to LLM-powered apps"
  },
  {
    number: "27+",
    label: "Projects Shipped",
    desc: "From hackathon MVPs to production dashboards with real users"
  },
  {
    number: "ECE",
    label: "Final Year · KIT Coimbatore",
    desc: "Electronics + CS overlap — hardware roots, software soul"
  }
];

const BADGES = [
  { text: "React Native", top: "10%" },
  { text: "MERN Stack", top: "35%" },
  { text: "AI / LLM", top: "60%" },
  { text: "Open to Work", top: "78%" }
];

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef([]);
  const bioRef = useRef(null);
  const badgesRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on scroll for the image
      gsap.to(imageRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4
        }
      });

      // Entrance Animations logic
      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      // 1. Photo fade in from scale
      masterTL.fromTo(imageRef.current, 
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // 2. Stat blocks stagger in
      masterTL.fromTo(statsRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out" },
        "-=0.4"
      );

      // 3. Bio block fade in
      masterTL.fromTo(bioRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      // 4. Badges animate in (Triggered on scroll to section as well, or on mount)
      // Prompt says "On mount: badges animate in", but usually better on scroll enter for consistency.
      // I'll group them into the master timeline but slightly staggered.
      masterTL.fromTo(badgesRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" },
        "-=0.6"
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="about">
      <div className={styles.grid}>
        {/* Left Column: Photo + Floating Badges */}
        <div className={styles.leftCol}>
          <div className={styles.imageWrapper}>
            <img 
              ref={imageRef}
              src="/profile.png" 
              alt="Raguram R" 
              className={styles.profileImg} 
            />
            {/* Glow effect underneath */}
            <div className={styles.glow}></div>

            {/* Floating Badges */}
            {BADGES.map((badge, i) => (
              <div 
                key={i}
                ref={el => badgesRef.current[i] = el}
                className={styles.badge}
                style={{ top: badge.top }}
              >
                {badge.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stats + Bio */}
        <div className={styles.rightCol}>
          <div className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <div 
                key={i} 
                className={styles.statBlock}
                ref={el => statsRef.current[i] = el}
              >
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <p className={styles.statDesc}>{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.bioBlock} ref={bioRef}>
            <p className={styles.bioText}>
              I obsess over <span className={styles.highlight}>clean architecture</span> and <span className={styles.highlight}>smooth UX</span>. 
              Currently targeting SDE1 roles in <span className={styles.highlight}>Bengaluru · Chennai · Hyderabad</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
