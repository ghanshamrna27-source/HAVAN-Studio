import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer({ onOpenCreateModal, onOpenMaker }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#05070a', padding: '70px 0 40px' }}>
      <div className="page-container">
        {/* Pre-footer Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '48px',
            textAlign: 'center',
            marginBottom: '60px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(30, 15, 38, 0.8), rgba(15, 25, 45, 0.8))',
            border: '1px solid var(--glass-border-highlight)'
          }}
        >
          <div className="badge-pill active" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} color="var(--primary-glow)" />
            <span>Ready To Elevate Your Gathering?</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
            Throw An Event People Never Forget.
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 28px', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Set up your custom sensory invite in under 3 minutes. Zero cost, no app download required for guests.
          </p>
          <button
            onClick={() => onOpenMaker ? onOpenMaker('all') : onOpenCreateModal()}
            className="btn-primary"
            style={{ padding: '16px 36px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #ffd700, #ff407d)', color: '#000', fontWeight: 800 }}
          >
            <span>Launch Custom Invite Studio ✨</span>
          </button>
        </div>

        {/* Footer Links & Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '50px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ffd700, #ff407d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}
              >
                🔥
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.04em', color: '#fff' }}>HAVAN</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '280px' }}>
              The sensory digital invitation studio engineered for Mehfils, Happy Hours, Weddings & celebrations.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Event Archetypes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>🪩 Retro House Parties</span>
              <span>🪷 Sufi & Poetry Mehfils</span>
              <span>🍸 Cocktail Salons & Galas</span>
              <span>🎸 Live Indie Gigs & Jams</span>
              <span>🪔 Shahi Festivals & Utsavs</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Platform Tech
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>60fps Canvas Particle FX</span>
              <span>Web Audio API Synthesizer</span>
              <span>Spotlight 3D Card Engine</span>
              <span>Secret Venue Protection Lock</span>
              <span>Hardware Confetti & .ics Sync</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Community
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Host Guidelines</span>
              <span>Creator Collective</span>
              <span>Curated Soundtracks</span>
              <span>Safety & Privacy</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © 2026 HAVAN Platform. Built with passion for gatherings people never forget.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Made with</span>
            <Heart size={14} fill="#ef4444" color="#ef4444" />
            <span>for parties & mehfils worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
