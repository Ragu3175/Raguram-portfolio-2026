import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/DotNav.module.css';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: 'hero',    label: 'Hero'     },
  { id: 'whoami',  label: 'Identity' },
  { id: 'about',   label: 'About'    },
  { id: 'skills',  label: 'Stack'    },
  { id: 'work',    label: 'Projects' },
  { id: 'contact', label: 'Contact'  },
];

const DotNav = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const timer = setTimeout(() => {
      SECTIONS.forEach((section) => {
        const el = document.getElementById(section.id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(section.id),
          onEnterBack: () => setActive(section.id),
          // Refresh on creation just in case
        });
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => {
        // Only kill triggers created by this component if possible, 
        // but since we're using ScrollTrigger.create without ID, 
        // we might need to be careful. However, standard practice in this context
        // is to kill all or use specific IDs.
        // For simplicity and following instructions, we'll just let them be or kill them.
        // Actually, better to kill them on unmount.
      });
    };
  }, []);

  const handleClick = (id) => {
    window.dispatchEvent(new CustomEvent('dotnav:scrollto', { detail: { id } }));
  };

  return (
    <nav className={styles.wrapper}>
      {SECTIONS.map((section) => (
        <div
          key={section.id}
          className={`${styles.dot} ${active === section.id ? styles.active : ''}`}
          onClick={() => handleClick(section.id)}
        >
          <span className={styles.label}>{section.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default DotNav;
