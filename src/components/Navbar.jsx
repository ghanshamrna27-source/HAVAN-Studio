import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, Menu, X, Flame, Music, ChevronRight, Ticket, User, LogOut, CheckCircle2 } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

export default function Navbar({
  onOpenCreateModal,
  onOpenMaker,
  activeThemeObj,
  currentFrequencies,
  activeCategory = 'all',
  onSelectCategory,
  currentUser,
  onOpenAuth,
  onOpenCheckInvite,
  onLogout
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    const targetSection = document.getElementById('templates');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '10px 16px' : '16px 20px',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      {/* Floating Pill Capsule Bar */}
      <nav
        style={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '1280px',
          background: scrolled ? 'rgba(9, 12, 20, 0.92)' : 'rgba(12, 16, 26, 0.78)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          padding: '8px 12px 8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: scrolled
            ? '0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 255, 255, 0.04)'
            : '0 12px 35px -8px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.02)',
          transition: 'all 0.35s ease'
        }}
      >
        {/* Brand Identity */}
        <a
          href="#"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #ffd700 0%, #ff407d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(255, 64, 125, 0.45)',
              fontSize: '1.15rem'
            }}
          >
            🔥
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(90deg, #ffffff 0%, #ffd700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                HAVAN
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.35)',
                  color: '#ffd700',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                Studio
              </span>
            </div>
          </div>
        </a>

        {/* Center Pill Nav Links (Sufi Night, Happy Hours, Check Invite Prominent) */}
        <div
          className="desktop-nav-links"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px 6px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          {/* Sufi Night Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('mehfil')}
            className={`partiful-nav-pill ${activeCategory === 'mehfil' ? 'active-sufi' : ''}`}
            style={{
              background: activeCategory === 'mehfil'
                ? 'rgba(16, 185, 129, 0.22)'
                : 'transparent',
              border: activeCategory === 'mehfil'
                ? '1px solid #10b981'
                : '1px solid transparent',
              color: activeCategory === 'mehfil' ? '#34d399' : '#e2e8f0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: activeCategory === 'mehfil' ? '0 0 15px rgba(16, 185, 129, 0.35)' : 'none'
            }}
          >
            <span style={{ fontSize: '1rem' }}>🪔</span>
            <span>Sufi Night</span>
            <span
              style={{
                fontSize: '0.62rem',
                background: 'rgba(16, 185, 129, 0.3)',
                color: '#a7f3d0',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontWeight: 800
              }}
            >
              BAITHAK
            </span>
          </button>

          {/* Happy Hours Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('happyhours')}
            className={`partiful-nav-pill ${activeCategory === 'happyhours' ? 'active-happy' : ''}`}
            style={{
              background: activeCategory === 'happyhours'
                ? 'rgba(255, 64, 125, 0.22)'
                : 'transparent',
              border: activeCategory === 'happyhours'
                ? '1px solid #ff407d'
                : '1px solid transparent',
              color: activeCategory === 'happyhours' ? '#ff66a3' : '#e2e8f0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: activeCategory === 'happyhours' ? '0 0 15px rgba(255, 64, 125, 0.35)' : 'none'
            }}
          >
            <span style={{ fontSize: '1rem' }}>🍹</span>
            <span>Happy Hours</span>
            <span
              style={{
                fontSize: '0.62rem',
                background: 'rgba(255, 64, 125, 0.3)',
                color: '#fbcfe8',
                padding: '1px 6px',
                borderRadius: '9999px',
                fontWeight: 800
              }}
            >
              DISCO
            </span>
          </button>

          {/* NEW: Check Invite Pill */}
          <button
            type="button"
            onClick={onOpenCheckInvite}
            className="partiful-nav-pill"
            style={{
              background: 'rgba(255, 215, 0, 0.12)',
              border: '1px solid rgba(255, 215, 0, 0.35)',
              color: '#ffd700',
              padding: '6px 13px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 12px rgba(255, 215, 0, 0.15)'
            }}
          >
            <Ticket size={15} color="#ffd700" />
            <span>Check Invite</span>
          </button>

          {/* Wedding Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('wedding')}
            className={`partiful-nav-pill ${activeCategory === 'wedding' ? 'active' : ''}`}
            style={{
              background: activeCategory === 'wedding'
                ? 'rgba(245, 158, 11, 0.22)'
                : 'transparent',
              border: activeCategory === 'wedding'
                ? '1px solid #f59e0b'
                : '1px solid transparent',
              color: activeCategory === 'wedding' ? '#fbbf24' : 'rgba(255, 255, 255, 0.75)',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>💍</span>
            <span>Wedding</span>
          </button>

          {/* Birthday Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('birthday')}
            className={`partiful-nav-pill ${activeCategory === 'birthday' ? 'active' : ''}`}
            style={{
              background: activeCategory === 'birthday'
                ? 'rgba(6, 182, 212, 0.22)'
                : 'transparent',
              border: activeCategory === 'birthday'
                ? '1px solid #06b6d4'
                : '1px solid transparent',
              color: activeCategory === 'birthday' ? '#67e8f9' : 'rgba(255, 255, 255, 0.75)',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🎂</span>
            <span>Birthday</span>
          </button>

          {/* 5 Layers Guide */}
          <a
            href="#five-layers"
            style={{
              color: 'rgba(255, 255, 255, 0.55)',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: '9999px',
              transition: 'all 0.2s ease'
            }}
            className="hover-bright"
          >
            5 Layers
          </a>
        </div>

        {/* Right CTA, Auth, & Sound Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Ambient Web Audio Synthesizer Widget */}
          <AudioPlayer frequencies={currentFrequencies} />

          {/* User Auth Profile / Login Button */}
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  background: 'rgba(255, 215, 0, 0.15)',
                  border: '1px solid rgba(255, 215, 0, 0.4)',
                  borderRadius: '9999px',
                  padding: '5px 12px',
                  color: '#fff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span>{currentUser.avatar || '👑'}</span>
                <span>{currentUser.name || currentUser.email}</span>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '210px',
                    background: 'rgba(12, 16, 26, 0.98)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    padding: '8px',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8)',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)' }}>Signed in as</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffd700' }}>{currentUser.email}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenCheckInvite) onOpenCheckInvite();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <Ticket size={14} color="#ffd700" />
                    <span>My Invites & Passes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onOpenMaker) onOpenMaker('all');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <Sparkles size={14} color="#ff407d" />
                    <span>Host Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      if (onLogout) onLogout();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                    className="dropdown-item"
                  >
                    <LogOut size={14} color="#f87171" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '9999px',
                padding: '7px 14px',
                color: '#fff',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              className="partiful-login-btn"
            >
              <User size={14} />
              <span>Log In</span>
            </button>
          )}

          {/* Partiful-Style Primary CTA Pill Button */}
          <button
            type="button"
            onClick={() => onOpenMaker ? onOpenMaker(activeCategory === 'all' ? 'mehfil' : activeCategory) : onOpenCreateModal()}
            className="partiful-cta-btn"
            style={{
              padding: '9px 18px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'linear-gradient(135deg, #ffd700 0%, #ff407d 100%)',
              color: '#07090e',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 64, 125, 0.45)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={15} color="#07090e" />
            <span>Create Event ✨</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px'
            }}
            className="mobile-menu-btn"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Card */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '74px',
            left: '16px',
            right: '16px',
            maxWidth: '480px',
            margin: '0 auto',
            background: 'rgba(10, 14, 24, 0.98)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
            pointerEvents: 'auto'
          }}
        >
          {/* User Auth Banner in Mobile Menu */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{currentUser.avatar || '👑'}</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#ffd700' }}>{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                VIP Host Account: <code style={{ color: '#ffd700' }}>user@123</code>
              </div>
            )}

            {currentUser ? (
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onLogout && onLogout(); }}
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '5px 10px', borderRadius: '8px', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); onOpenAuth && onOpenAuth('login'); }}
                style={{ background: 'linear-gradient(135deg, #ffd700, #ff407d)', border: 'none', color: '#000', fontWeight: 800, padding: '6px 14px', borderRadius: '9999px', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Sign In 👑
              </button>
            )}
          </div>

          {/* Check Invite in Mobile */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCheckInvite && onOpenCheckInvite();
            }}
            style={{
              background: 'rgba(255, 215, 0, 0.12)',
              border: '1px solid rgba(255, 215, 0, 0.35)',
              borderRadius: '16px',
              padding: '12px 16px',
              color: '#ffd700',
              fontSize: '0.96rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Ticket size={20} color="#ffd700" />
              <div>Check Invite & Passes</div>
            </div>
            <ChevronRight size={18} color="#ffd700" />
          </button>

          {/* Featured Archetypes */}
          <button
            type="button"
            onClick={() => {
              handleNavClick('mehfil');
              setMobileMenuOpen(false);
            }}
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '16px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>🪔</span>
              <div>
                <div>Sufi Night & Mehfil</div>
                <div style={{ fontSize: '0.72rem', color: '#a7f3d0', fontWeight: 500 }}>Qawwali, Poetry & Tanpura Drone</div>
              </div>
            </div>
            <ChevronRight size={18} color="#10b981" />
          </button>

          <button
            type="button"
            onClick={() => {
              handleNavClick('happyhours');
              setMobileMenuOpen(false);
            }}
            style={{
              background: 'rgba(255, 64, 125, 0.12)',
              border: '1px solid rgba(255, 64, 125, 0.35)',
              borderRadius: '16px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>🍹</span>
              <div>
                <div>Happy Hours & Disco</div>
                <div style={{ fontSize: '0.72rem', color: '#fbcfe8', fontWeight: 500 }}>Retro House, Cocktails & Jam</div>
              </div>
            </div>
            <ChevronRight size={18} color="#ff407d" />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                handleNavClick('wedding');
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '10px',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>💍</span>
              <span>Wedding</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleNavClick('birthday');
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '10px',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>🎂</span>
              <span>Birthday</span>
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a
              href="#five-layers"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '0.85rem' }}
            >
              The 5 Layers Architecture
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMaker ? onOpenMaker('all') : onOpenCreateModal();
              }}
              style={{
                background: 'linear-gradient(135deg, #ffd700, #ff407d)',
                color: '#000',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Launch Studio ✨
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .desktop-nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        .partiful-nav-pill:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .partiful-login-btn:hover {
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: translateY(-1px);
        }
        .partiful-cta-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 28px rgba(255, 64, 125, 0.65) !important;
        }
        .hover-bright:hover {
          color: #ffffff !important;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>
    </header>
  );
}
