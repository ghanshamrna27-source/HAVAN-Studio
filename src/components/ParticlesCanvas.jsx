import React, { useEffect, useRef } from 'react';

export default function ParticlesCanvas({ effect = 'stardust', density = 1, speed = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let isRunning = true;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: -9999, y: -9999, radius: 130, isActive: false };
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };
    const onMouseLeave = () => {
      mouse.isActive = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // 1. Stardust
    class StardustParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2.5 + 0.6;
        this.size = this.baseSize;
        this.vx = (Math.random() - 0.5) * 0.35 * speed;
        this.vy = -(Math.random() * 0.45 + 0.1) * speed;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.twinkleSpeed = (Math.random() * 0.025 + 0.008) * speed;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.hue = 38 + Math.random() * 22;
      }
      update() {
        if (mouse.isActive) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 1) {
            const force = (1 - dist / mouse.radius) * 0.6;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }
        this.x += this.vx;
        this.y += this.vy;
        this.twinklePhase += this.twinkleSpeed;
        this.opacity = 0.25 + Math.abs(Math.sin(this.twinklePhase)) * 0.65;
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 85%, 72%)`;
        ctx.shadowBlur = this.size * 7;
        ctx.shadowColor = `hsl(${this.hue}, 90%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Embers
    class EmberParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 3.5 + 1;
        this.vx = (Math.random() - 0.5) * 0.7 * speed;
        this.vy = -(Math.random() * 1.1 + 0.4) * speed;
        this.opacity = Math.random() * 0.85 + 0.2;
        this.life = 1;
        this.decay = (Math.random() * 0.003 + 0.0012) * speed;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = (Math.random() * 0.035 + 0.015) * speed;
      }
      update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobble) * 0.4;
        this.y += this.vy;
        this.life -= this.decay;
        this.opacity = this.life * 0.85;
        if (this.life <= 0 || this.y < -20) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        const rad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.2);
        rad.addColorStop(0, 'rgba(255, 200, 100, 0.95)');
        rad.addColorStop(0.5, 'rgba(235, 90, 25, 0.5)');
        rad.addColorStop(1, 'rgba(150, 20, 10, 0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 3. Petals
    class PetalParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * (canvas.width + 100) - 50;
        this.y = -30 - Math.random() * 80;
        this.size = Math.random() * 7 + 4;
        this.vx = (Math.random() * 0.6 - 0.2) * speed;
        this.vy = (Math.random() * 0.9 + 0.4) * speed;
        this.opacity = Math.random() * 0.55 + 0.35;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 2.2 * speed;
        this.flip = Math.random() * Math.PI * 2;
        this.flipSpeed = (Math.random() * 0.03 + 0.015) * speed;
        this.hue = 342 + Math.random() * 18;
      }
      update() {
        this.flip += this.flipSpeed;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        if (this.y > canvas.height + 30) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(1, Math.sin(this.flip));
        ctx.fillStyle = `hsla(${this.hue}, 75%, 52%, 0.85)`;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.8, this.size * 0.8, this.size * 0.4, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.4, -this.size * 0.7, -this.size * 0.8, 0, -this.size);
        ctx.fill();
        ctx.restore();
      }
    }

    // 4. Meteors
    class MeteorParticle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.active = initial ? Math.random() > 0.5 : true;
        this.x = Math.random() * (canvas.width * 1.2) - canvas.width * 0.1;
        this.y = -40 - Math.random() * 150;
        this.speed = (Math.random() * 8 + 9) * speed;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15;
        this.length = Math.random() * 110 + 60;
        this.width = Math.random() * 2 + 1.2;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.cooldown = Math.random() * 180 + 60;
      }
      update() {
        if (!this.active) {
          this.cooldown--;
          if (this.cooldown <= 0) {
            this.active = true;
            this.x = Math.random() * (canvas.width * 1.2) - canvas.width * 0.1;
            this.y = -30;
          }
          return;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.y > canvas.height + 150 || this.x > canvas.width + 150) {
          this.active = false;
          this.cooldown = Math.random() * 240 + 80;
        }
      }
      draw() {
        if (!this.active) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;
        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.2, 'rgba(212, 175, 55, 0.8)');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. Bokeh
    class BokehParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 45 + 18;
        this.vx = (Math.random() - 0.5) * 0.4 * speed;
        this.vy = (Math.random() - 0.5) * 0.4 * speed;
        this.opacity = Math.random() * 0.18 + 0.05;
        this.hue = [42, 275, 160, 335, 215][Math.floor(Math.random() * 5)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, `hsla(${this.hue}, 85%, 65%, 0.8)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 6. Aurora
    class AuroraWave {
      constructor(index) {
        this.index = index;
        this.yBase = canvas.height * (0.2 + index * 0.2);
        this.speed = (0.006 + index * 0.003) * speed;
        this.phase = index * 1.5;
        this.hue = [165, 210, 280, 45][index % 4];
      }
      update() { this.phase += this.speed; }
      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        const segs = 14;
        const segW = canvas.width / segs;
        for (let i = 0; i <= segs; i++) {
          const x = i * segW;
          const y = this.yBase + Math.sin(this.phase + i * 0.35) * 55;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, this.yBase - 80, 0, canvas.height);
        grad.addColorStop(0, `hsla(${this.hue}, 90%, 65%, 0.4)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    }

    // 7. Jasmine (Mogra)
    class JasmineParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20 - Math.random() * 60;
        this.size = Math.random() * 5 + 3.5;
        this.vx = (Math.random() - 0.5) * 0.5 * speed;
        this.vy = (Math.random() * 0.7 + 0.3) * speed;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 1.6 * speed;
        this.opacity = Math.random() * 0.5 + 0.4;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        if (this.y > canvas.height + 25) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 5; i++) {
          ctx.rotate((Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.ellipse(0, this.size * 0.85, this.size * 0.4, this.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 8. Soundwaves
    class SoundWaveParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height * 0.6;
        this.radius = Math.random() * 20 + 5;
        this.maxRadius = Math.max(canvas.width, canvas.height) * 0.65;
        this.speed = (Math.random() * 2 + 1.2) * speed;
        this.opacity = 0.4;
      }
      update() {
        this.radius += this.speed;
        this.opacity = (1 - this.radius / this.maxRadius) * 0.45;
        if (this.radius >= this.maxRadius || this.opacity <= 0) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    let particles = [];
    const count = Math.round((window.innerWidth < 640 ? 30 : 60) * density);

    if (effect === 'stardust') {
      for (let i = 0; i < count; i++) particles.push(new StardustParticle());
    } else if (effect === 'embers') {
      for (let i = 0; i < Math.round(count * 1.1); i++) particles.push(new EmberParticle());
    } else if (effect === 'petals') {
      for (let i = 0; i < Math.round(count * 0.7); i++) particles.push(new PetalParticle());
    } else if (effect === 'meteors') {
      for (let i = 0; i < Math.round(count * 0.4); i++) particles.push(new StardustParticle());
      for (let i = 0; i < Math.max(4, Math.round(7 * density)); i++) particles.push(new MeteorParticle());
    } else if (effect === 'bokeh') {
      for (let i = 0; i < Math.round(count * 0.4); i++) particles.push(new BokehParticle());
    } else if (effect === 'aurora') {
      for (let i = 0; i < 4; i++) particles.push(new AuroraWave(i));
      for (let i = 0; i < Math.round(count * 0.3); i++) particles.push(new StardustParticle());
    } else if (effect === 'jasmine') {
      for (let i = 0; i < Math.round(count * 0.65); i++) particles.push(new JasmineParticle());
    } else if (effect === 'soundwaves') {
      for (let i = 0; i < Math.round(count * 0.35); i++) particles.push(new SoundWaveParticle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      if (isRunning && effect !== 'none') {
        animationId = requestAnimationFrame(animate);
      }
    }

    if (effect !== 'none') {
      animate();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [effect, density, speed]);

  return <canvas ref={canvasRef} id="particleCanvas" />;
}
