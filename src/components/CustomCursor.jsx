import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Track which section the cursor is in
    const workSection = document.getElementById('work');

    // Torch overlay element (projects section)
    const torch = document.createElement('div');
    torch.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 4;
      opacity: 0;
      transition: opacity 0.5s ease;
      background: radial-gradient(
        200px circle at var(--tx, 50%) var(--ty, 50%),
        rgba(232, 255, 71, 0.06),
        transparent 70%
      );
    `;
    document.body.appendChild(torch);

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      
      torch.style.setProperty('--tx', `${x}px`);
      torch.style.setProperty('--ty', `${y}px`);

      const inWork = workSection && (() => {
        const r = workSection.getBoundingClientRect();
        return y >= r.top && y <= r.bottom;
      })();

      torch.style.opacity = inWork ? '1' : '0';
      
      // Fixed dot follows instantly
      gsap.to(dotRef.current, {
        x,
        y,
        duration: 0.1,
        overwrite: true
      });

      // Ring follows with a lag
      gsap.to(ringRef.current, {
        x,
        y,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true
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

    const handleDelegate = (e) => {
      if (e.target.closest('button, a, [data-mag]')) {
        handleMouseEnter();
      }
    };
    const handleDelegateLeave = (e) => {
      if (e.target.closest('button, a, [data-mag]')) {
        handleMouseLeave();
      }
    };
    document.body.addEventListener('mouseenter', handleDelegate, true);
    document.body.addEventListener('mouseleave', handleDelegateLeave, true);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeEventListener('mouseenter', handleDelegate, true);
      document.body.removeEventListener('mouseleave', handleDelegateLeave, true);
      if (torch.parentNode) document.body.removeChild(torch);
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
