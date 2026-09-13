import React, { useEffect, useRef } from 'react';

export default function Backdrop({ currentTheme, effect = 'stardust', density = 1, speed = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate particles
    const baseCount = effect === 'meteors' ? 25 : effect === 'fireflies' ? 40 : 70;
    const count = Math.floor(baseCount * density);
    const particles = [];

    const colors = currentTheme?.orbs || ['#FF1493', '#00F0FF', '#FFD700'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: effect === 'fireflies' ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: effect === 'meteors' ? (Math.random() * 3 + 2) * speed : (Math.random() - 0.5) * 0.8 * speed,
        vy: effect === 'meteors' ? (Math.random() * 4 + 3) * speed : effect === 'sparks' ? (-Math.random() * 2 - 0.5) * speed : (Math.random() - 0.5) * 0.8 * speed,
        alpha: Math.random() * 0.7 + 0.3,
        alphaSpeed: (Math.random() * 0.02 + 0.005) * speed,
        length: Math.random() * 20 + 15
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.9 || p.alpha < 0.2) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

        if (effect === 'meteors') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.stroke();
        } else if (effect === 'fireflies') {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Stardust or Sparks
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme, effect, density, speed]);

  return (
    <div className="ambient-backdrop">
      <div className="aura-orb orb-1" />
      <div className="aura-orb orb-2" />
      <div className="aura-orb orb-3" />
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
}
