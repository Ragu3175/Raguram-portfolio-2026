import React, { useEffect, useRef, useState } from 'react';
import styles from './Atmosphere.module.css';

const Atmosphere = ({ isActive }) => {
  const audioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-play attempt on interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (isActive && hasInteracted && audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(err => console.log("Audio play blocked", err));
      
      // Gradually fade in the crackling sound
      let vol = 0;
      const fadeIn = setInterval(() => {
        if (vol < 0.15) {
          vol += 0.01;
          audioRef.current.volume = vol;
        } else {
          clearInterval(fadeIn);
        }
      }, 100);
    }
  }, [isActive, hasInteracted]);

  return (
    <div className={styles.container}>
      {/* We'll use a high-quality royalty free fireplace loop if provided, otherwise silence for now */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://www.soundjay.com/nature/sounds/fire-crackling-01.mp3" 
      />
    </div>
  );
};

export default Atmosphere;
