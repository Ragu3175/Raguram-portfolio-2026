import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Loader({ isReady, onComplete }) {
  const loaderRef = useRef(null)
  const lettersRef = useRef([])
  const barRef = useRef(null)
  const dotRef = useRef(null)
  const statusRef = useRef(null)
  const tlRef = useRef(null)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tlRef.current = tl

      // Set initial state
      gsap.set(lettersRef.current, { y: 20, opacity: 0, filter: 'blur(10px)' })
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(statusRef.current, { opacity: 0 })

      // Letters blur and fade in smoothly
      tl.to(lettersRef.current, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        stagger: 0.1,
        ease: 'power4.out'
      })

        // Progress bar fills to 90%
        .to(barRef.current, {
          scaleX: 0.9,
          duration: 2.5,
          ease: 'power2.out'
        }, '-=0.5')

        .addLabel('optimized')

      // Waiting logic will happen in the other useEffect
      tl.pause()

    }, loaderRef)

    // Show status message if it takes too long
    const timer = setTimeout(() => setShowStatus(true), 3000)

    return () => {
      ctx.revert()
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (isReady && tlRef.current) {
      const tl = tlRef.current

      // If we are at the pause point, finish it
      tl.to(barRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: 'power4.inOut'
      })
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            if (onComplete) onComplete()
            if (loaderRef.current) loaderRef.current.style.display = 'none'
          }
        })
        .play()
    }
  }, [isReady])

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A0A0F',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem'
      }}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.05em' }}>
        {[...('RAGURAM'.split('').map(l => ({ char: l, color: '#F0EDE6' }))), 
          ...('.R'.split('').map(l => ({ char: l, color: '#E8FF47' })))].map((item, i) => (
          <span
            key={i}
            ref={el => lettersRef.current[i] = el}
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
              fontWeight: 800,
              color: item.color,
              letterSpacing: '0.05em',
              display: 'inline-block',
              fontFamily: 'Clash Display, DM Sans, sans-serif',
              opacity: 0,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>

      {/* Progress container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '320px', height: '1px', background: 'rgba(232,255,71,0.1)' }}>
          <div
            ref={barRef}
            style={{
              width: '100%',
              height: '100%',
              background: '#E8FF47',
              transformOrigin: 'left center',
              boxShadow: '0 0 15px rgba(232,255,71,0.3)'
            }}
          />
        </div>

        {/* Status message */}
        <div
          ref={statusRef}
          style={{
            height: '12px',
            opacity: showStatus ? 1 : 0,
            transition: 'opacity 0.5s ease',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(240,237,230,0.3)',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          {isReady ? 'System Ready' : 'Optimizing Assets...'}
        </div>
      </div>
    </div>
  )
}
