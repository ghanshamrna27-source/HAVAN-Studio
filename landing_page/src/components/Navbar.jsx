import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Menu, X } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

export default function Navbar({ onOpenCreateModal, onOpenMaker, activeThemeObj, currentFrequencies }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 0' : '18px 0',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(7, 9, 14, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent'
      }}
    >
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo - HAVAN */}
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffd700, #ff407d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255, 64, 125, 0.4)',
              fontSize: '1.25rem'
            }}
          >
            🔥
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.04em', background: 'linear-gradient(90deg, #fff, #ffd700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                HAVAN
              </span>
            </div>
            <div style={{ fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255, 255, 255, 0.5)' }}>
              Digital Invitation Studio
            </div>
          </div>
        </a>

        {/* Desktop Category Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '22px' }} className="desktop-nav-links">
          <button
            onClick={() => onOpenMaker ? onOpenMaker('mehfil') : onOpenCreateModal()}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 8 }}
            className="hover:text-gold"
          >
            <span>🪔</span>
            <span>Mehfil</span>
          </button>

          <button
            onClick={() => onOpenMaker ? onOpenMaker('happyhours') : onOpenCreateModal()}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 8 }}
          >
            <span>🍹</span>
            <span>Happy Hours</span>
          </button>

          <button
            onClick={() => onOpenMaker ? onOpenMaker('wedding') : onOpenCreateModal()}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 8 }}
          >
            <span>💍</span>
            <span>Wedding</span>
          </button>

          <button
            onClick={() => onOpenMaker ? onOpenMaker('birthday') : onOpenCreateModal()}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 8 }}
          >
            <span>🎂</span>
            <span>Birthday</span>
          </button>

          <a href="#five-layers" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.2s' }}>
            5 Layers
          </a>
        </div>

        {/* Right CTA & Sound Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Audio Synthesizer Widget */}
          <AudioPlayer frequencies={currentFrequencies} />

          {/* Primary Make Invitation Button */}
          <button
            onClick={() => onOpenMaker ? onOpenMaker('all') : onOpenCreateModal()}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #ffd700, #ff407d)', color: '#000', fontWeight: 800 }}
          >
            <Sparkles size={16} color="#000" />
            <span>Make Invitation ✨</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(7, 9, 14, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <a onClick={() => setMobileMenuOpen(false)} href="#playground" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>
            Live Studio
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#templates" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>
            Event Archetypes
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#five-layers" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>
            The 5 Layers
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#how-it-works" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>
            How It Works
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#wall-of-love" style={{ color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>
            Wall of Love
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .desktop-nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
