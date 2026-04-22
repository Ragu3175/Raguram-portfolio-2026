import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Transition.module.css';

gsap.registerPlugin(ScrollTrigger);

const WORDS = [
  { text: 'OBSESS.', color: 'rgba(240,237,230,0.5)' },
  { text: 'BUILD.',  color: '#F0EDE6' },
  { text: 'OUTLAST.', color: '#E8FF47' },
];

const Transition = () => {
  const sectionRef  = useRef(null);
  const wordRefs    = useRef([]);
  const lineRef     = useRef(null);

  useLayoutEffect(() => {
    // Keep the refresh delay from before to ensure Lenis/DOM settles
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 800);
    
    const ctx = gsap.context(() => {

      gsap.set(wordRefs.current, { opacity: 0, y: 20 });
      gsap.set(lineRef.current,  { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',   // was 250%
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Words slam in staggered
      tl.to(wordRefs.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Lime underline draws across after all 3 land
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      // Just a tiny micro-pause to let the line visually finish before unpinning
      tl.to({}, { duration: 0.1 });

    }, sectionRef);

    return () => {
      clearTimeout(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <section className={styles.section}>
      {/* Used pinWrapper to prevent React 18 insertBefore DOM crash */}
      <div ref={sectionRef} className={styles.pinWrapper}>
        <div className={styles.titleContainer}>
          <div className={styles.row}>
            {WORDS.map((w, i) => (
              <span
                key={i}
                ref={el => wordRefs.current[i] = el}
                className={styles.word}
                style={{ color: w.color }}
              >
                {w.text}
              </span>
            ))}
          </div>
          <div ref={lineRef} className={styles.line} />
        </div>
      </div>
    </section>
  );
};

export default Transition;
