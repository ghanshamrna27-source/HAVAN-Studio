import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, MapPin, Lock, Unlock, Sparkles, CheckCircle2, Music, Users } from 'lucide-react';

export default function InteractiveCard({ template, isFeatured = false }) {
  const [rsvpState, setRsvpState] = useState(null);
  const [guestCount, setGuestCount] = useState(template.guestCount);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    // Subtle 3D tilt for featured card
    if (isFeatured) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current && isFeatured) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleRSVP = (status) => {
    if (status === 'yes') {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FF407D', '#FFD700', '#06B6D4', '#10B981', '#A855F7', '#FFFFFF']
      });

      if (rsvpState !== 'yes') {
        setGuestCount((prev) => prev + 1);
      }
      setIsUnlocked(true);
    } else {
      if (rsvpState === 'yes') {
        setGuestCount((prev) => Math.max(template.guestCount, prev - 1));
      }
      setIsUnlocked(false);
    }
    setRsvpState(status);
  };

  const downloadIcsCalendar = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HAVAN Platform//Universal Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${template.title}`,
      `DESCRIPTION:${template.description} (Host: ${template.host})`,
      `LOCATION:${template.venue}`,
      'DTSTART:20261114T193000Z',
      'DTEND:20261115T020000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${template.id}-invitation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="spotlight-card"
      style={{
        maxWidth: isFeatured ? '490px' : '100%',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        background: 'linear-gradient(165deg, rgba(22, 27, 42, 0.9) 0%, rgba(13, 17, 28, 0.95) 100%)',
        position: 'relative',
        zIndex: 2,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease'
      }}
    >
      {/* Top Bar: Wax Seal & Guest Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div className="badge-pill" style={{ background: 'rgba(255, 215, 0, 0.1)', borderColor: 'rgba(255, 215, 0, 0.3)' }}>
          <span style={{ fontSize: '1.1rem' }}>{template.badgeEmoji}</span>
          <span style={{ color: '#ffd700', fontWeight: 600 }}>{template.badge}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Users size={15} color="var(--primary-glow)" />
          <span><strong style={{ color: '#fff' }}>{guestCount}</strong> Attending</span>
        </div>
      </div>

      {/* Main Artwork with Smooth Overlay */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isFeatured ? '270px' : '230px',
          borderRadius: '18px',
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <img
          src={template.image}
          alt={template.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="card-artwork-img"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(7, 9, 14, 0.9) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            right: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'rgba(0, 0, 0, 0.65)',
              padding: '4px 10px',
              borderRadius: '6px',
              backdropFilter: 'blur(8px)',
              color: '#ffd700',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}
          >
            {template.vibeTag}
          </span>
          <span
            style={{
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(0, 0, 0, 0.65)',
              padding: '4px 10px',
              borderRadius: '6px',
              backdropFilter: 'blur(8px)'
            }}
          >
            Host: <strong>{template.host}</strong>
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div style={{ marginBottom: '18px' }}>
        <h3
          style={{
            fontSize: isFeatured ? '1.5rem' : '1.3rem',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            marginBottom: '6px',
            color: '#ffffff'
          }}
        >
          {template.title}
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          {template.subtitle}
        </p>
      </div>

      {/* Date & Time Pill */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '20px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px' }}>
          <Calendar size={14} color="var(--accent-glow)" />
          <span style={{ color: '#fff' }}>{template.date}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px' }}>
          <span style={{ color: '#94a3b8' }}>{template.time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '8px' }}>
          <span>Dress: <strong style={{ color: '#fff' }}>{template.dressCode}</strong></span>
        </div>
      </div>

      {/* Secret Venue Container (Locked until RSVP) */}
      <div style={{ marginBottom: '22px' }}>
        {isUnlocked ? (
          <div className="shine-border">
            <div className="shine-border-inner">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Unlock size={17} color="#ffd700" />
                  <span style={{ color: '#ffd700', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Secret Venue Unlocked!
                  </span>
                </div>
                <button
                  onClick={downloadIcsCalendar}
                  style={{
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.4)',
                    color: '#ffd700',
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  title="Add to Calendar"
                >
                  + Add to Calendar
                </button>
              </div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.96rem', marginBottom: '4px' }}>
                📍 {template.venue}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                🔑 {template.doorCode}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.06)' }}>
                <Lock size={16} color="#94a3b8" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>Secret Venue Protected</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>RSVP "Going" to unlock exact address & code</div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary-glow)', fontWeight: 600 }}>TAP RSVP 👇</span>
          </div>
        )}
      </div>

      {/* Interactive RSVP Buttons (Customized Copy) */}
      <div>
        <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '10px', fontWeight: 700 }}>
          Will you join? (Try clicking!)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {/* YES */}
          <button
            onClick={() => handleRSVP('yes')}
            style={{
              padding: '12px 8px',
              borderRadius: '12px',
              border: rsvpState === 'yes' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
              background: rsvpState === 'yes' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.2s ease',
              boxShadow: rsvpState === 'yes' ? '0 0 18px rgba(16, 185, 129, 0.4)' : 'none'
            }}
          >
            <span style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{template.rsvpPreset.yes.emoji}</span>
            <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700 }}>{template.rsvpPreset.yes.title}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{template.rsvpPreset.yes.sub}</span>
          </button>

          {/* MAYBE */}
          <button
            onClick={() => handleRSVP('maybe')}
            style={{
              padding: '12px 8px',
              borderRadius: '12px',
              border: rsvpState === 'maybe' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
              background: rsvpState === 'maybe' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{template.rsvpPreset.maybe.emoji}</span>
            <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700 }}>{template.rsvpPreset.maybe.title}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{template.rsvpPreset.maybe.sub}</span>
          </button>

          {/* NO */}
          <button
            onClick={() => handleRSVP('no')}
            style={{
              padding: '12px 8px',
              borderRadius: '12px',
              border: rsvpState === 'no' ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.12)',
              background: rsvpState === 'no' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{template.rsvpPreset.no.emoji}</span>
            <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700 }}>{template.rsvpPreset.no.title}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{template.rsvpPreset.no.sub}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
