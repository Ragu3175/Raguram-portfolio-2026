import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/About.module.css';

gsap.registerPlugin(ScrollTrigger);

const STATEMENTS = [
  { bold: 'ECE Graduate', rest: ' from KIT Coimbatore.' },
  { bold: 'Full Stack Developer', rest: ' — MERN · React Native · AI.' },
  { bold: 'Production-grade apps', rest: ' shipped since day one.' },
];

const About = () => {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const tagRef = useRef(null);
  const nameRef = useRef(null);
  const wipeRefs = useRef([]);
  const textRefs = useRef([]);
  const bioRef = useRef(null);
  const statsRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Set initial states
      gsap.set(tagRef.current, { opacity: 0 });
      gsap.set(nameRef.current, { opacity: 0, y: 30 });
      gsap.set(bioRef.current, { opacity: 0 });
      gsap.set(statsRef.current, { opacity: 0 });
      gsap.set(textRefs.current, { opacity: 0 });
      gsap.set(wipeRefs.current, { width: '0%' });

      // Photo parallax — unchanged
      gsap.to(photoRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // PIN the section for the full reveal sequence
      // This gives the user 200vh of scroll to read everything
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Tag + Name
      tl.to(tagRef.current, { opacity: 1, duration: 0.3 });
      tl.to(nameRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '<+=0.1');

      // Photo iris open
      tl.fromTo(photoRef.current,
        { opacity: 0, clipPath: 'circle(0% at 50% 50%)' },
        { opacity: 1, clipPath: 'circle(100% at 50% 50%)', duration: 0.5, ease: 'power4.inOut' },
        '<'
      );

      // Line wipe + text for each statement
      STATEMENTS.forEach((_, i) => {
        const wipe = wipeRefs.current[i];
        const text = textRefs.current[i];
        tl.to(wipe, { width: '100%', duration: 0.25, ease: 'power3.inOut' }, i === 0 ? '>-0.1' : '>');
        tl.to(text, { opacity: 1, duration: 0.01 }, '>');
        tl.to(wipe, { left: '100%', duration: 0.25, ease: 'power3.inOut' }, '>');
      });

      // Bio + Stats
      tl.to(bioRef.current, { opacity: 1, duration: 0.3 }, '>-0.1');
      tl.to(statsRef.current, { opacity: 1, duration: 0.3 }, '<+=0.1');

      // Hold so user can read
      tl.to({}, { duration: 0.4 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={styles.section}>
      <div className={styles.inner}>

        {/* LEFT — Photo */}
        <div className={styles.photoCol}>
          <div className={styles.photoWrap}>
            <img
              ref={photoRef}
              src="/profile.png"
              alt="Raguram R"
              className={styles.photo}
              style={{ opacity: 0 }}
            />
            <div className={styles.photoGlow} />
          </div>
        </div>

        {/* RIGHT — Content */}
        <div className={styles.contentCol}>

          <span ref={tagRef} className={styles.sectionTag}>
            02 · About
          </span>

          <h2 ref={nameRef} className={styles.name}>
            RAGURAM R
          </h2>

          <div className={styles.statements}>
            {STATEMENTS.map((s, i) => (
              <div key={i} className={styles.statementRow}>
                <div
                  ref={el => wipeRefs.current[i] = el}
                  className={styles.wipe}
                />
                <p
                  ref={el => textRefs.current[i] = el}
                  className={styles.statementText}
                >
                  <strong>{s.bold}</strong>{s.rest}
                </p>
              </div>
            ))}
          </div>

          <p ref={bioRef} className={styles.bio}>
            I obsess over <em>clean architecture</em> and <em>smooth UX</em>.
            From <em>ESP32 firmware</em> to <em>LLM orchestration</em> —
            I build across the full stack.
            Targeting SDE1 roles in{' '}
            <em>Bengaluru · Chennai · Hyderabad</em>.
          </p>

          <div ref={statsRef} className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>3<sup>+</sup></span>
              <span className={styles.statLabel}>Years Building</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>27<sup>+</sup></span>
              <span className={styles.statLabel}>Projects Shipped</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>ECE</span>
              <span className={styles.statLabel}>KIT Coimbatore</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
