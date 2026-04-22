const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

export const scrambleText = (el, finalText, duration = 1200) => {
  let frame = 0;
  const totalFrames = Math.floor(duration / 30);
  const interval = setInterval(() => {
    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (frame / totalFrames > i / finalText.length) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
    frame++;
    if (frame >= totalFrames) {
      el.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
};
