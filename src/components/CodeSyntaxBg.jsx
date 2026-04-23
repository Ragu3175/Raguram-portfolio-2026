import React, { useEffect, useRef } from 'react';
import styles from '../styles/CodeSyntaxBg.module.css';

const TOKEN_POOL = [
  'const', 'let', 'var', '=>', '{}', '[]', '()', ';', '=', '+', '-', '*', '/',
  'return', 'import', 'export', 'from', 'default', 'as', 'if', 'else', 'elif',
  '&&', '||', '===', '!==', '>=', '<=', '=>', '??', '?', ':', '!', '~', '^', '&', '|',
  'async', 'await', '.map', '.filter', '.reduce', '.forEach', '.find',
  '.then', '.catch', '.finally', '.push', '.pop', '.slice', '.splice',
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity', 'void', 'typeof',
  'function', 'class', 'new', 'this', 'super', 'extends', 'static',
  'try', 'catch', 'finally', 'throw', 'break', 'continue', 'switch', 'case',
  'for', 'while', 'do', 'in', 'of', '...', 'delete', 'instanceof', 'yield',
  'React', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
  'useContext', 'props', 'children', 'key', 'ref', 'style', 'className',
  'console.log', 'Math.random', 'Object.keys', 'Array.from', 'JSON.parse',
  'Promise', 'resolve', 'reject', 'setTimeout', 'clearTimeout', 'fetch',
  '#0A0A0F', '#E8FF47', 'rgb()', 'rgba()', 'px', 'rem', 'vh', 'vw', '%',
  'node', 'npm', 'git', 'api', 'env', 'http', 'url', '404', '200', '500'
];

const CodeSyntaxBg = () => {
  const canvasRef = useRef(null);
  const tokensRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollYRef = useRef(0);
  const rafIdRef = useRef(null);
  const deadZonesRef = useRef({ hero: [0, 0], projects: [0, 0] });
  const docHeightRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateBounds = () => {
      const vh = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      docHeightRef.current = scrollHeight;

      // Hero dead zone
      deadZonesRef.current.hero = [0, vh];

      // Projects dead zone
      const projectsSection = document.querySelector('#work');
      if (projectsSection) {
        const rect = projectsSection.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const absoluteBottom = rect.bottom + window.scrollY;
        deadZonesRef.current.projects = [absoluteTop, absoluteBottom];
      }

      canvas.width = window.innerWidth;
      canvas.height = vh;
    };

    const initTokens = () => {
      const tokens = [];
      const scrollHeight = document.documentElement.scrollHeight;
      const vw = window.innerWidth;

      for (let i = 0; i < 220; i++) {
        const text = TOKEN_POOL[Math.floor(Math.random() * TOKEN_POOL.length)];
        const size = Math.random() * (16 - 9) + 9;
        const isLime = Math.random() < 0.3;
        const baseOpacity = Math.random() * (0.08 - 0.03) + 0.03;
        
        tokens.push({
          text,
          x: Math.random() * vw,
          pageY: Math.random() * scrollHeight,
          vx: Math.random() * 0.3 - 0.15,
          vy: Math.random() * 0.16 - 0.08,
          size,
          baseOpacity,
          isLime,
          // Fixed colors for non-glow state
          creamColor: `rgba(240, 237, 230, `,
          limeColor: `rgba(232, 255, 71, `
        });
      }
      tokensRef.current = tokens;
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scrollY = scrollYRef.current;
      const mouse = mouseRef.current;
      const docHeight = docHeightRef.current;
      const { hero, projects } = deadZonesRef.current;

      tokensRef.current.forEach((token) => {
        // Update position
        token.x += token.vx;
        token.pageY += token.vy;

        // Wrap x
        if (token.x < -80) token.x = canvas.width + 80;
        else if (token.x > canvas.width + 80) token.x = -80;

        // Wrap y (pageY)
        if (token.pageY < -20) token.pageY = docHeight + 20;
        else if (token.pageY > docHeight + 20) token.pageY = -20;

        const screenY = token.pageY - scrollY;

        // Cull if outside viewport
        if (screenY < -20 || screenY > canvas.height + 20) return;

        // Cull if in dead zones
        if (token.pageY >= hero[0] && token.pageY <= hero[1]) return;
        if (token.pageY >= projects[0] && token.pageY <= projects[1]) return;

        // Mouse reaction
        const dx = token.x - mouse.x;
        const dy = screenY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let drawOpacity = token.baseOpacity;
        let drawSize = token.size;
        let fillStyle = token.isLime 
          ? `${token.limeColor}${drawOpacity})` 
          : `${token.creamColor}${drawOpacity})`;

        // Repel
        if (dist < 180) {
          const force = (180 - dist) / 180;
          token.x += (dx / dist) * force * 2.0;
          token.pageY += (dy / dist) * force * 2.0;
        }

        // Glow
        const glowRadius = 220;
        if (dist < glowRadius) {
          const glowStrength = 1 - (dist / glowRadius);
          drawOpacity = token.baseOpacity + glowStrength * 0.55;
          drawSize = token.size + glowStrength * 6;
          fillStyle = `rgba(232, 255, 71, ${drawOpacity})`;
          
          ctx.shadowColor = 'rgba(232, 255, 71, 0.9)';
          ctx.shadowBlur = glowStrength * 18;
        } else {
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'transparent';
        }

        ctx.font = `${drawSize}px monospace`;
        ctx.fillStyle = fillStyle;
        ctx.fillText(token.text, token.x, screenY);
        
        // Reset shadow for next token
        ctx.shadowBlur = 0;
      });

      rafIdRef.current = requestAnimationFrame(animate);
    };

    updateBounds();
    initTokens();
    
    window.addEventListener('resize', () => {
      updateBounds();
      // Adjust existing tokens to new scrollHeight potentially? 
      // User says "recompute on resize", but usually tokens stay valid in px.
    });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={styles.canvas}
    />
  );
};

export default CodeSyntaxBg;
