import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from '../styles/sections/Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/Ragu3175',                      sub: 'Ragu3175'        },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/raguram-r-92504a286',       sub: 'raguram-r'       },
  { label: 'Resume',   href: '/Raguram_Resume.pdf',                               sub: 'Download PDF', download: true },
  { label: 'Phone',    href: 'tel:+919489624436',                                 sub: '+91 9489 624436' },
]

export default function Contact() {
  const sectionRef   = useRef(null)
  const word1Ref     = useRef(null)
  const word2Ref     = useRef(null)
  const word3Ref     = useRef(null)
  const terminalRef  = useRef(null)
  const linksRef     = useRef([])
  const foldRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([word1Ref.current, word2Ref.current, word3Ref.current], { opacity: 0, y: 70 })
      gsap.set(terminalRef.current, { opacity: 0, y: 20 })
      gsap.set(linksRef.current.filter(Boolean), { opacity: 0, y: 24 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      tl
        .to(word1Ref.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' })
        .to(word2Ref.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.5')
        .to(word3Ref.current, { opacity: 1, y: 0, duration: 0.85, ease: 'back.out(1.6)' }, '-=0.45')
        .to(terminalRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
        .to(linksRef.current.filter(Boolean), {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        }, '-=0.3')

    }, sectionRef)

    const els = sectionRef.current.querySelectorAll('[data-mag]')
    const cleanups = []
    els.forEach(el => {
      const onMove = (e) => {
        const r  = el.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3
        gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power3.out' })
      }
      const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' })
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => {
      ctx.revert()
      cleanups.forEach(fn => fn())
    }
  }, [])

  return (
    <section ref={sectionRef} id="contact" className={styles.container}>
      <div ref={foldRef} className={styles.foldWrapper}>
        <div className={styles.header}>
          <span className="section-label">08 · Contact</span>
          <div className={styles.labelLine} />
        </div>

        <div className={`font-display ${styles.headline}`}>
          <div className={styles.wordContainer}>
            <span ref={word1Ref} className={`${styles.word} ${styles.cream}`}>LET'S</span>
          </div>
          <div className={styles.wordContainer}>
            <span ref={word2Ref} className={`${styles.word} ${styles.cream}`}>BUILD</span>
          </div>
          <div className={styles.wordContainer}>
            <span ref={word3Ref} className={`${styles.word} ${styles.lime}`}>SOMETHING.</span>
          </div>
        </div>

        <div ref={terminalRef} className={styles.terminalWrapper}>
          <TerminalBlock />
        </div>

        <div className={styles.linksContainer}>
          {LINKS.map((link, i) => (
            <a
              key={i}
              ref={el => linksRef.current[i] = el}
              href={link.href}
              target={link.download ? undefined : '_blank'}
              rel="noreferrer"
              download={link.download || undefined}
              data-mag
              className={styles.link}
            >
              <span className={styles.linkLabel}>
                {link.label}
              </span>
              <span className={styles.linkSub}>
                {link.sub}
              </span>
            </a>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerText}>
            Raguram R · Full Stack Developer · 2025
          </span>
          <span className={styles.footerText}>
            Built with React + GSAP + Lenis
          </span>
        </div>

        <div className={styles.bgGlow} />
      </div>
    </section>
  )
}

function TerminalBlock() {
  const [typedLines, setTypedLines] = useState([])
  const containerRef = useRef(null)

  const terminalLines = [
    "initializing contact protocol...",
    "target: ragu317317@gmail.com",
    "status: OPEN TO WORK...",
    "location: Bengaluru / Chennai / Hyderabad",
    "availability: IMMEDIATE"
  ]

  useEffect(() => {
    let timeouts = []
    
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: () => {
        let currentLineIdx = 0;
        let currentCharIdx = 0;
        let currentText = [""];

        const typeChar = () => {
          if (currentLineIdx >= terminalLines.length) return;
          
          const targetLine = terminalLines[currentLineIdx];
          
          if (currentCharIdx < targetLine.length) {
            currentText[currentLineIdx] = targetLine.substring(0, currentCharIdx + 1);
            setTypedLines([...currentText]);
            currentCharIdx++;
            timeouts.push(setTimeout(typeChar, Math.random() * 10 + 5)); 
          } else {
            currentLineIdx++;
            currentCharIdx = 0;
            if (currentLineIdx < terminalLines.length) {
              currentText.push("");
              setTypedLines([...currentText]);
              timeouts.push(setTimeout(typeChar, 100));
            }
          }
        };

        timeouts.push(setTimeout(typeChar, 200));
      },
      once: true
    })

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [])

  return (
    <div ref={containerRef} className={styles.terminal}>
      <div className={styles.terminalControls}>
        <div className={`${styles.controlDot} ${styles.red}`} />
        <div className={`${styles.controlDot} ${styles.yellow}`} />
        <div className={`${styles.controlDot} ${styles.green}`} />
      </div>

      <div>
        {typedLines.map((line, idx) => {
          const fullLineText = terminalLines[idx];
          const isHighlighted = fullLineText.includes('target:') || fullLineText.includes('status:');
          
          return (
            <div key={idx} className={isHighlighted ? styles.lime : ''} style={{ fontWeight: isHighlighted ? 600 : 400 }}>
              <span className={styles.linePrefix}>&gt;</span>
              {line}
              {idx === typedLines.length - 1 && (
                <div className={styles.cursor} />
              )}
            </div>
          )
        })}
        {typedLines.length === 0 && (
          <div>
            <span className={styles.linePrefix}>&gt;</span>
            <div className={styles.cursor} />
          </div>
        )}
      </div>
    </div>
  )
}
