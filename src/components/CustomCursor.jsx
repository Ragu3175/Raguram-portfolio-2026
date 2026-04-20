import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      
      // Fixed dot follows instantly
      gsap.to(dotRef.current, {
        x,
        y,
        duration: 0.1
      });

      // Ring follows with a lag
      gsap.to(ringRef.current, {
        x,
        y,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Interaction with hoverables
    const handleMouseEnter = () => {
      gsap.to(ringRef.current, {
        scale: 2,
        backgroundColor: "rgba(232, 255, 71, 0.15)",
        borderColor: "rgba(232, 255, 71, 1)",
        duration: 0.3
      });
      gsap.to(dotRef.current, {
        scale: 1.5,
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      gsap.to(ringRef.current, {
        scale: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(240, 237, 230, 0.3)",
        duration: 0.3
      });
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.3
      });
    };

    const hoverables = document.querySelectorAll('button, a, .hover-target');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div className={styles.dot} ref={dotRef} />
      <div className={styles.ring} ref={ringRef} />
    </>
  );
};

export default CustomCursor;
