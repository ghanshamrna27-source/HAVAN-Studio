/* ================================================================
   PARTICLES & VISUAL FX ENGINE — Master Ambient System for Mehfil
   Modes:
     1. stardust     - Golden celestial starlight with mouse gravity
     2. embers       - Rising warm lantern coals with turbulence
     3. petals       - 3D tumbling deep red & velvet rose petals
     4. meteors      - Fast diagonal shooting stars with glowing ion tails
     5. bokeh        - Dreamy drifting soft-focus aura orbs
     6. aurora       - Fluid undulating northern-lights ribbon waves
     7. jasmine      - Delicate falling white mogra / jasmine blossoms
     8. soundwaves   - Ambient sonic rings emanating from music player
     9. none         - Minimal distraction-free mode
   ================================================================ */

(function () {
    'use strict';

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let currentEffect = 'stardust';
    let animationId = null;
    let isRunning = false;
    let densityMultiplier = 1; // 0.5 (subtle), 1 (standard), 1.8 (euphoric)
    let speedMultiplier = 1;   // 0.5 (relaxed), 1 (normal), 1.6 (energetic)

    // Mouse coordinates for interactive attraction/deflection
    const mouse = {
        x: -9999,
        y: -9999,
        radius: 120,
        isActive: false
    };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.isActive = true;
    });
    window.addEventListener('mouseleave', () => {
        mouse.isActive = false;
        mouse.x = -9999;
        mouse.y = -9999;
    });
    resize();

    /* ================================================================
       1. STARDUST PARTICLES (Golden celestial starlight + mouse attraction)
       ================================================================ */
    class StardustParticle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 2.4 + 0.6;
            this.size = this.baseSize;
            this.vx = (Math.random() - 0.5) * 0.35 * speedMultiplier;
            this.vy = -(Math.random() * 0.45 + 0.1) * speedMultiplier;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.twinkleSpeed = (Math.random() * 0.025 + 0.008) * speedMultiplier;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.hue = 38 + Math.random() * 22; // Rich Gold & Champagne
        }
        update() {
            // Mouse interaction: gentle gravitational pull
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

            // 4-point sparkle cross on larger stars
            if (this.baseSize > 2 && Math.sin(this.twinklePhase) > 0.7) {
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 85%, ${this.opacity * 0.8})`;
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.moveTo(this.x - this.size * 2, this.y);
                ctx.lineTo(this.x + this.size * 2, this.y);
                ctx.moveTo(this.x, this.y - this.size * 2);
                ctx.lineTo(this.x, this.y + this.size * 2);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    /* ================================================================
       2. LANTERN EMBERS (Rising warm coals with turbulence & heat glow)
       ================================================================ */
    class EmberParticle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 3.5 + 1;
            this.vx = (Math.random() - 0.5) * 0.7 * speedMultiplier;
            this.vy = -(Math.random() * 1.1 + 0.4) * speedMultiplier;
            this.opacity = Math.random() * 0.85 + 0.2;
            this.life = 1;
            this.decay = (Math.random() * 0.003 + 0.0012) * speedMultiplier;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = (Math.random() * 0.035 + 0.015) * speedMultiplier;
            this.temp = Math.random(); // 0 = dark red, 1 = blazing gold
        }
        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.vx + Math.sin(this.wobble) * 0.4;
            this.y += this.vy;
            this.life -= this.decay;
            this.opacity = this.life * 0.85;

            // Mouse repulsion
            if (mouse.isActive) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    const force = (1 - dist / 80) * 1.5;
                    this.x += (dx / (dist || 1)) * force;
                }
            }

            if (this.life <= 0 || this.y < -20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            const rad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.2);
            if (this.temp > 0.6) {
                rad.addColorStop(0, 'rgba(255, 220, 120, 0.95)');
                rad.addColorStop(0.4, 'rgba(255, 120, 30, 0.6)');
                rad.addColorStop(1, 'rgba(200, 30, 10, 0)');
            } else {
                rad.addColorStop(0, 'rgba(255, 140, 40, 0.9)');
                rad.addColorStop(0.5, 'rgba(210, 60, 20, 0.5)');
                rad.addColorStop(1, 'rgba(120, 20, 10, 0)');
            }
            ctx.fillStyle = rad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    /* ================================================================
       3. ROSE PETALS (Velvety Sufi petals tumbling in gentle breeze)
       ================================================================ */
    class PetalParticle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * (canvas.width + 100) - 50;
            this.y = -30 - Math.random() * 80;
            this.size = Math.random() * 7 + 4;
            this.vx = (Math.random() * 0.6 - 0.2) * speedMultiplier;
            this.vy = (Math.random() * 0.9 + 0.4) * speedMultiplier;
            this.opacity = Math.random() * 0.55 + 0.35;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 2.2 * speedMultiplier;
            this.flip = Math.random() * Math.PI * 2;
            this.flipSpeed = (Math.random() * 0.03 + 0.015) * speedMultiplier;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = (Math.random() * 0.02 + 0.008) * speedMultiplier;
            this.hue = 342 + Math.random() * 18; // Crimson to Deep Rose
        }
        update() {
            this.wobble += this.wobbleSpeed;
            this.flip += this.flipSpeed;
            this.x += this.vx + Math.sin(this.wobble) * 0.7;
            this.y += this.vy;
            this.rotation += this.rotSpeed;

            if (this.y > canvas.height + 30) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            const scaleY = Math.sin(this.flip); // 3D flip effect

            ctx.scale(1, scaleY);
            ctx.fillStyle = `hsla(${this.hue}, 75%, ${48 + Math.abs(scaleY) * 15}%, 0.85)`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = `hsla(${this.hue}, 80%, 30%, 0.5)`;

            // Elegant petal curve
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.8, this.size * 0.8, this.size * 0.4, 0, this.size);
            ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.4, -this.size * 0.7, -this.size * 0.8, 0, -this.size);
            ctx.fill();

            // Petal central vein
            ctx.strokeStyle = `hsla(${this.hue}, 60%, 35%, 0.3)`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.7);
            ctx.lineTo(0, this.size * 0.8);
            ctx.stroke();

            ctx.restore();
        }
    }

    /* ================================================================
       4. METEORS & SHOOTING STARS (Fast diagonal streaks with ionized tails)
       ================================================================ */
    class MeteorParticle {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.active = initial ? Math.random() > 0.6 : true;
            this.x = Math.random() * (canvas.width * 1.2) - canvas.width * 0.1;
            this.y = -40 - Math.random() * (initial ? canvas.height : 200);
            this.speed = (Math.random() * 8 + 8) * speedMultiplier;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15; // ~45 deg downward
            this.length = Math.random() * 110 + 60;
            this.width = Math.random() * 2 + 1.2;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.colorHue = Math.random() > 0.5 ? 42 : 190; // Gold or Cyan trail
            this.cooldown = Math.random() * 180 + 60; // Delay between streaks
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
            grad.addColorStop(0.15, `hsla(${this.colorHue}, 90%, 75%, 0.8)`);
            grad.addColorStop(0.6, `hsla(${this.colorHue}, 80%, 55%, 0.2)`);
            grad.addColorStop(1, 'transparent');

            ctx.strokeStyle = grad;
            ctx.lineWidth = this.width;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${this.colorHue}, 100%, 70%, 0.8)`;

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            // Bright head dot
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width * 1.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    /* ================================================================
       5. MYSTIC BOKEH ORBS (Dreamy, soft-focus luminous aura spheres)
       ================================================================ */
    class BokehParticle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 45 + 18;
            this.vx = (Math.random() - 0.5) * 0.4 * speedMultiplier;
            this.vy = (Math.random() - 0.5) * 0.4 * speedMultiplier;
            this.opacity = Math.random() * 0.18 + 0.05;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = (Math.random() * 0.015 + 0.005) * speedMultiplier;
            const hues = [42, 275, 160, 335, 215];
            this.hue = hues[Math.floor(Math.random() * hues.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulse += this.pulseSpeed;

            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
        }
        draw() {
            ctx.save();
            const currentAlpha = this.opacity * (0.8 + Math.sin(this.pulse) * 0.35);
            ctx.globalAlpha = Math.max(0, currentAlpha);

            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, `hsla(${this.hue}, 85%, 65%, 0.9)`);
            grad.addColorStop(0.5, `hsla(${this.hue}, 75%, 50%, 0.4)`);
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    /* ================================================================
       6. AURORA WAVES (Undulating northern lights ribbon bands)
       ================================================================ */
    class AuroraWave {
        constructor(index) {
            this.index = index;
            this.points = [];
            this.yBase = canvas.height * (0.2 + index * 0.2);
            this.speed = (0.006 + index * 0.003) * speedMultiplier;
            this.phase = index * 1.5;
            this.hues = [165, 210, 280, 45]; // Emerald, Cyan, Violet, Gold
            this.hue = this.hues[index % this.hues.length];
        }
        update() {
            this.phase += this.speed;
        }
        draw() {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.12;

            ctx.beginPath();
            ctx.moveTo(0, canvas.height);

            const segments = 16;
            const segWidth = canvas.width / segments;

            for (let i = 0; i <= segments; i++) {
                const x = i * segWidth;
                const wave1 = Math.sin(this.phase + i * 0.35) * 60;
                const wave2 = Math.cos(this.phase * 0.7 + i * 0.2) * 40;
                const y = this.yBase + wave1 + wave2;
                if (i === 0) ctx.lineTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.closePath();

            const grad = ctx.createLinearGradient(0, this.yBase - 80, 0, canvas.height);
            grad.addColorStop(0, `hsla(${this.hue}, 90%, 65%, 0.4)`);
            grad.addColorStop(0.5, `hsla(${this.hue + 30}, 80%, 45%, 0.15)`);
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }
    }

    /* ================================================================
       7. JASMINE (MOGRA) BLOSSOMS (Pure white petals with fragrant rotation)
       ================================================================ */
    class JasmineBlossom {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20 - Math.random() * 60;
            this.size = Math.random() * 5 + 3.5;
            this.vx = (Math.random() - 0.5) * 0.5 * speedMultiplier;
            this.vy = (Math.random() * 0.7 + 0.3) * speedMultiplier;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 1.6 * speedMultiplier;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = (Math.random() * 0.02 + 0.01) * speedMultiplier;
            this.opacity = Math.random() * 0.5 + 0.4;
        }
        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.vx + Math.sin(this.wobble) * 0.6;
            this.y += this.vy;
            this.rotation += this.rotSpeed;

            if (this.y > canvas.height + 25) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);

            // Draw 5 white delicate rounded petals
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(255, 245, 210, 0.4)';

            for (let i = 0; i < 5; i++) {
                ctx.rotate((Math.PI * 2) / 5);
                ctx.beginPath();
                ctx.ellipse(0, this.size * 0.9, this.size * 0.45, this.size * 0.75, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Pale yellow/gold pistil center
            ctx.fillStyle = '#FFDE59';
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.28, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    /* ================================================================
       8. KINETIC SOUNDWAVES (Expanding sonic harmonic ripple rings)
       ================================================================ */
    class AudioPulseWave {
        constructor() { this.reset(); }
        reset() {
            const audioElem = document.getElementById('audioPlayer');
            if (audioElem) {
                const rect = audioElem.getBoundingClientRect();
                this.x = rect.left + rect.width / 2;
                this.y = rect.top + rect.height / 2;
            } else {
                this.x = canvas.width / 2;
                this.y = canvas.height * 0.65;
            }
            this.radius = Math.random() * 20 + 5;
            this.maxRadius = Math.max(canvas.width, canvas.height) * 0.65;
            this.speed = (Math.random() * 2 + 1.2) * speedMultiplier;
            this.opacity = Math.random() * 0.4 + 0.3;
            this.hue = Math.random() > 0.5 ? 42 : 160; // Gold or Jade
        }
        update() {
            this.radius += this.speed;
            this.opacity = (1 - this.radius / this.maxRadius) * 0.5;
            if (this.radius >= this.maxRadius || this.opacity <= 0) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.strokeStyle = `hsla(${this.hue}, 85%, 65%, ${this.opacity})`;
            ctx.lineWidth = 1.4;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsla(${this.hue}, 90%, 60%, 0.5)`;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    /* ================================================================
       INITIALIZATION & ORCHESTRATION
       ================================================================ */

    function createParticles(effect) {
        particles = [];
        const isMobile = window.innerWidth < 640;
        const baseCount = isMobile ? 35 : 65;
        const count = Math.round(baseCount * densityMultiplier);

        switch (effect) {
            case 'stardust':
                for (let i = 0; i < count; i++) particles.push(new StardustParticle());
                break;
            case 'embers':
                for (let i = 0; i < Math.round(count * 1.1); i++) particles.push(new EmberParticle());
                break;
            case 'petals':
                for (let i = 0; i < Math.round(count * 0.7); i++) particles.push(new PetalParticle());
                break;
            case 'meteors':
                for (let i = 0; i < Math.round(count * 0.4); i++) particles.push(new StardustParticle());
                for (let i = 0; i < Math.max(4, Math.round(8 * densityMultiplier)); i++) particles.push(new MeteorParticle());
                break;
            case 'bokeh':
                for (let i = 0; i < Math.round(count * 0.4); i++) particles.push(new BokehParticle());
                break;
            case 'aurora':
                for (let i = 0; i < 4; i++) particles.push(new AuroraWave(i));
                for (let i = 0; i < Math.round(count * 0.3); i++) particles.push(new StardustParticle());
                break;
            case 'jasmine':
                for (let i = 0; i < Math.round(count * 0.65); i++) particles.push(new JasmineBlossom());
                break;
            case 'soundwaves':
                for (let i = 0; i < Math.round(count * 0.35); i++) particles.push(new AudioPulseWave());
                for (let i = 0; i < Math.round(count * 0.3); i++) particles.push(new StardustParticle());
                break;
            case 'none':
                break;
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        if (isRunning) {
            animationId = requestAnimationFrame(animate);
        }
    }

    function startEffect(effect) {
        if (animationId) cancelAnimationFrame(animationId);
        currentEffect = effect;

        if (effect === 'none') {
            isRunning = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        createParticles(effect);
        isRunning = true;
        animate();
    }

    function setDensity(multiplier) {
        densityMultiplier = multiplier;
        if (isRunning && currentEffect !== 'none') {
            createParticles(currentEffect);
        }
    }

    function setSpeed(multiplier) {
        speedMultiplier = multiplier;
        if (isRunning && currentEffect !== 'none') {
            createParticles(currentEffect);
        }
    }

    // Expose Global API
    window.ParticleEngine = {
        start: startEffect,
        getCurrentEffect: () => currentEffect,
        setDensity: setDensity,
        setSpeed: setSpeed,
        getDensity: () => densityMultiplier,
        getSpeed: () => speedMultiplier
    };

    // Auto-start with stardust
    startEffect('stardust');
})();
