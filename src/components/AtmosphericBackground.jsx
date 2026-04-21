import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AtmosphericBackground.module.css';

const AtmosphericBackground = () => {
  const containerRef = useRef(null);
  const node1Ref = useRef(null);
  const node2Ref = useRef(null);
  const node3Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Idle drifting animation
      const driftSpeed = 8;
      
      gsap.to(node1Ref.current, {
        x: '+=30',
        y: '+=20',
        duration: driftSpeed,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(node2Ref.current, {
        x: '-=40',
        y: '-=30',
        duration: driftSpeed * 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(node3Ref.current, {
        x: '+=20',
        y: '-=15',
        duration: driftSpeed * 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // 2. Scroll-synced parallax
      gsap.to([node1Ref.current, node2Ref.current, node3Ref.current], {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
        y: (i) => (i + 1) * -150, // Different parallax depths
        ease: "none"
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <div className={styles.glowContainer}>
        <div ref={node1Ref} className={`${styles.glowNode} ${styles.node1}`} />
        <div ref={node2Ref} className={`${styles.glowNode} ${styles.node2}`} />
        <div ref={node3Ref} className={`${styles.glowNode} ${styles.node3}`} />
      </div>
      <div className={styles.vignette} />
      <div className={styles.noise} />
    </div>
  );
};

export default AtmosphericBackground;
