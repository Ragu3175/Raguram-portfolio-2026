import React, { useEffect, useRef } from 'react';

const STAR_COUNT = 160;

const random = (min, max) => Math.random() * (max - min) + min;

const generateStars = () =>
  Array.from({ length: STAR_COUNT }, () => ({
    x: random(0, 100),
    y: random(0, 100),
    size: random(0.5, 2.2),
    opacity: random(0.08, 0.35),
    speed: random(0.02, 0.08), // parallax multiplier
  }));

const StarField = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef(generateStars());
  const scrollRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stars = starsRef.current;

      stars.forEach(star => {
        const px = (star.x / 100) * canvas.width;
        // Stars shift upward slightly as you scroll — parallax
        const py =
          ((star.y / 100) * canvas.height) -
          scrollRef.current * star.speed;

        // Wrap vertically
        const wrappedY =
          ((py % canvas.height) + canvas.height) % canvas.height;

        ctx.beginPath();
        ctx.arc(px, wrappedY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 237, 230, ${star.opacity})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default StarField;
