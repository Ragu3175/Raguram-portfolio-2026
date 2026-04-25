import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/sections/Process.module.css';

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    id: '01',
    verb: 'Decode',
    title: 'Find the real problem',
    input: 'Loose idea, broken flow, unclear constraints',
    decision: 'Map users, data, risks, and the shortest useful path',
    output: 'A buildable scope with sharp acceptance points',
    signal: 'Requirements -> system map',
    tools: ['UX Audit', 'Data Flow', 'Edge Cases'],
  },
  {
    id: '02',
    verb: 'Architect',
    title: 'Shape the system',
    input: 'Features, APIs, screens, and moving parts',
    decision: 'Choose state, routes, storage, and failure boundaries',
    output: 'Clean module plan before the code gets loud',
    signal: 'Modules -> contracts',
    tools: ['React', 'Node', 'MongoDB'],
  },
  {
    id: '03',
    verb: 'Build',
    title: 'Move from plan to product',
    input: 'Screens, endpoints, auth, AI calls, device data',
    decision: 'Implement in slices that can be tested and shipped',
    output: 'Working product surfaces instead of static mockups',
    signal: 'Commits -> usable flows',
    tools: ['MERN', 'REST', 'GSAP'],
  },
  {
    id: '04',
    verb: 'Harden',
    title: 'Break it before users do',
    input: 'Happy path app with hidden weak spots',
    decision: 'Stress loading, empty states, latency, and bad input',
    output: 'Stable behavior under real-world pressure',
    signal: 'Bugs -> safeguards',
    tools: ['QA', 'Perf', 'Resilience'],
  },
  {
    id: '05',
    verb: 'Ship',
    title: 'Launch, observe, refine',
    input: 'Production candidate and deployment target',
    decision: 'Release with logs, feedback loops, and next actions',
    output: 'A live product that can keep improving',
    signal: 'Deploy -> iteration',
    tools: ['Vercel', 'Render', 'Docker'],
  },
];

export default function Process() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const scanRef = useRef(null);
  const phaseRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const phases = phaseRefs.current.filter(Boolean);

      gsap.set(phases, { autoAlpha: 0, y: 36, filter: 'blur(10px)' });
      gsap.set(phases[0], { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
      gsap.set(progressRef.current, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(scanRef.current, { yPercent: -20, autoAlpha: 0.35 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${PHASES.length * 95}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(
              PHASES.length - 1,
              Math.floor(self.progress * PHASES.length)
            );
            setActiveIndex(next);
          },
        },
      });

      tl.to(progressRef.current, {
        scaleY: 1,
        ease: 'none',
        duration: PHASES.length,
      }, 0);

      tl.to(scanRef.current, {
        yPercent: 120,
        autoAlpha: 0.8,
        ease: 'none',
        duration: PHASES.length,
      }, 0);

      phases.forEach((phase, index) => {
        const at = index + 0.1;
        if (index > 0) {
          tl.to(phases[index - 1], {
            autoAlpha: 0,
            y: -30,
            filter: 'blur(10px)',
            duration: 0.35,
            ease: 'power2.inOut',
          }, at - 0.22);
          tl.to(phase, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'power3.out',
          }, at);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activePhase = PHASES[activeIndex];

  return (
    <section ref={sectionRef} id="process" className={styles.section}>
      <div className={styles.gridOverlay} />
      <div ref={scanRef} className={styles.scanLine} />

      <div className={styles.shell}>
        <div className={styles.header}>
          <span className={styles.label}>05 / Execution Pipeline</span>
          <h2 className={styles.heading}>How I turn chaos into shipped software.</h2>
        </div>

        <div className={styles.stage}>
          <aside className={styles.rail} aria-label="Execution pipeline steps">
            <div className={styles.railLine}>
              <div ref={progressRef} className={styles.railProgress} />
            </div>

            {PHASES.map((phase, index) => (
              <button
                key={phase.id}
                className={`${styles.railStep} ${index === activeIndex ? styles.railStepActive : ''}`}
                type="button"
                aria-current={index === activeIndex ? 'step' : undefined}
              >
                <span>{phase.id}</span>
                <strong>{phase.verb}</strong>
              </button>
            ))}
          </aside>

          <div className={styles.wordStack}>
            <span className={styles.kicker}>Current Module</span>
            <div className={styles.phaseViewport}>
              {PHASES.map((phase, index) => (
                <div
                  key={phase.id}
                  ref={el => phaseRefs.current[index] = el}
                  className={styles.phaseWord}
                >
                  <span>{phase.id}</span>
                  <h3>{phase.verb}</h3>
                  <p>{phase.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTop}>
              <span>system.trace</span>
              <span>{activePhase.signal}</span>
            </div>

            <div className={styles.traceRows}>
              <TraceRow label="input" value={activePhase.input} />
              <TraceRow label="decision" value={activePhase.decision} />
              <TraceRow label="output" value={activePhase.output} />
            </div>

            <div className={styles.toolGrid}>
              {activePhase.tools.map(tool => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TraceRow({ label, value }) {
  return (
    <div className={styles.traceRow}>
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}
