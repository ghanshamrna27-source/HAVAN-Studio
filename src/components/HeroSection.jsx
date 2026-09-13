import React from 'react';
import { ArrowRight, Sparkles, Flame, ShieldCheck, Zap } from 'lucide-react';
import InteractiveCard from './InteractiveCard';

export default function HeroSection({
  templates,
  activeTemplate,
  onSelectTemplate,
  onOpenCreateModal,
  onOpenMaker
}) {
  return (
    <section className="section-wrapper" style={{ paddingTop: '140px', paddingBottom: '70px' }}>
      <div className="page-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Hero Narrative & Controls */}
          <div>
            {/* Live Social Proof Badge */}
            <div
              className="badge-pill active"
              style={{
                marginBottom: '22px',
                display: 'inline-flex',
                background: 'rgba(255, 215, 0, 0.12)',
                border: '1px solid rgba(255, 215, 0, 0.35)'
              }}
            >
              <Sparkles size={15} color="#ffd700" />
              <span style={{ fontSize: '0.84rem', color: '#ffd700', fontWeight: 700 }}>
                HAVAN — Viral Digital Gathering Studio
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: '20px'
              }}
            >
              Invitations People <br />
              <span className="text-gradient">Actually Show Up To.</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.14rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '540px'
              }}
            >
              Ditch lifeless calendar links and dry group chats. <strong>HAVAN</strong> turns your gathering into an unforgettable ritual with <strong>interactive 3D physical cards</strong>, <strong>secret venue gate passcodes</strong>, <strong>dopamine confetti RSVPs</strong>, and <strong>live synthesized soundscapes</strong>.
            </p>

            {/* Category Quick Launch Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              <button
                onClick={() => onOpenMaker ? onOpenMaker('mehfil') : onOpenCreateModal()}
                style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#fff', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>🪔</span>
                <span>Sufi Night Studio</span>
              </button>

              <button
                onClick={() => onOpenMaker ? onOpenMaker('happyhours') : onOpenCreateModal()}
                style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255, 64, 125, 0.12)', border: '1px solid rgba(255, 64, 125, 0.35)', color: '#fff', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>🍹</span>
                <span>Happy Hours</span>
              </button>

              <button
                onClick={() => onOpenMaker ? onOpenMaker('wedding') : onOpenCreateModal()}
                style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255, 215, 0, 0.12)', border: '1px solid rgba(255, 215, 0, 0.35)', color: '#fff', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>💍</span>
                <span>Wedding Gala</span>
              </button>

              <button
                onClick={() => onOpenMaker ? onOpenMaker('birthday') : onOpenCreateModal()}
                style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)', color: '#fff', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span>🎂</span>
                <span>Birthday Bash</span>
              </button>
            </div>

            {/* Primary CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '36px' }}>
              <button
                onClick={() => onOpenMaker ? onOpenMaker('all') : onOpenCreateModal()}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #ffd700, #ff407d)', color: '#000', fontWeight: 800, padding: '12px 26px', fontSize: '0.94rem' }}
              >
                <span>Create Event ✨</span>
                <ArrowRight size={18} color="#000" />
              </button>
              <a href="#playground" className="btn-secondary" style={{ padding: '12px 22px' }}>
                <span>Explore Live Presets</span>
              </a>
            </div>

            {/* Quick Vibe Preset Switcher inside Hero */}
            <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 700 }}>
                <Zap size={14} color="var(--accent-glow)" />
                <span>Switch Preview Vibe:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => onSelectTemplate(tpl)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: activeTemplate.id === tpl.id ? '1px solid var(--primary-glow)' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: activeTemplate.id === tpl.id ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.05)',
                      color: activeTemplate.id === tpl.id ? '#ffffff' : '#94a3b8',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{tpl.badgeEmoji}</span>
                    <span>{tpl.vibeTag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Value Props Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginTop: '28px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '20px'
              }}
            >
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>94.6%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Avg. RSVP Turnout</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>0 App</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Downloads Required</div>
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>5 Sec</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Frictionless RSVP</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive 3D Card Spotlight */}
          <div style={{ position: 'relative' }}>
            {/* Decorative Ambient Aura behind card */}
            <div
              style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                opacity: 0.22,
                filter: 'blur(45px)',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            {/* Helper Tag */}
            <div
              style={{
                position: 'absolute',
                top: '-16px',
                right: '24px',
                zIndex: 3,
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid var(--accent-glow)',
                color: 'var(--accent-glow)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '9999px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                letterSpacing: '0.04em'
              }}
            >
              ⚡ LIVE INTERACTIVE PREVIEW
            </div>

            {/* The Live Interactive Card */}
            <InteractiveCard template={activeTemplate} isFeatured={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
