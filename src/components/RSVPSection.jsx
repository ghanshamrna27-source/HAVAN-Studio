import React from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar } from 'lucide-react';
import NumberTicker from './NumberTicker';
import { playPop, playCelebrationChord } from '../utils/soundEffects';

export default function RSVPSection({
  rsvpOptions,
  selectedStatus,
  onSelectStatus,
  guestCount,
  onOpenShare,
  onTriggerReaction
}) {
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FF1493', '#00F0FF', '#FFD700', '#8B5CF6', '#FFFFFF', '#FF4500']
      });

      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF1493', '#00F0FF', '#FFD700']
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#8B5CF6', '#FFD700', '#00F0FF']
        });
      }, 250);
    } catch (e) {
      console.error('Confetti error:', e);
    }
  };

  const handleChoice = (statusKey) => {
    onSelectStatus(statusKey);
    if (statusKey === 'yes') {
      playCelebrationChord();
      triggerConfetti();
      if (onTriggerReaction) onTriggerReaction('🍾');
    } else if (statusKey === 'maybe') {
      playPop();
      if (onTriggerReaction) onTriggerReaction('🍹');
    } else {
      playPop();
      if (onTriggerReaction) onTriggerReaction('😴');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>
          Will you make it?
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-accent)' }}>
          <NumberTicker value={guestCount} className="guest-ticker-num" />
          <span style={{ color: 'var(--text-muted)' }}>attending</span>
        </div>
      </div>

      <div className="rsvp-buttons-row">
        {/* YES BUTTON */}
        <button
          type="button"
          onClick={() => handleChoice('yes')}
          className={`rsvp-btn shimmer-hover ${selectedStatus === 'yes' ? 'selected-yes' : ''}`}
        >
          <span className="rsvp-emoji">{rsvpOptions.yes.emoji || '🍾'}</span>
          <span className="rsvp-btn-title">{rsvpOptions.yes.title || "Hell Yeah, I'm In!"}</span>
          <span className="rsvp-btn-sub">{rsvpOptions.yes.sub || 'Going'}</span>
        </button>

        {/* MAYBE BUTTON */}
        <button
          type="button"
          onClick={() => handleChoice('maybe')}
          className={`rsvp-btn ${selectedStatus === 'maybe' ? 'selected-maybe' : ''}`}
        >
          <span className="rsvp-emoji">{rsvpOptions.maybe.emoji || '🍹'}</span>
          <span className="rsvp-btn-title">{rsvpOptions.maybe.title || 'Might Slide Through'}</span>
          <span className="rsvp-btn-sub">{rsvpOptions.maybe.sub || 'Maybe'}</span>
        </button>

        {/* NO BUTTON */}
        <button
          type="button"
          onClick={() => handleChoice('no')}
          className={`rsvp-btn ${selectedStatus === 'no' ? 'selected-no' : ''}`}
        >
          <span className="rsvp-emoji">{rsvpOptions.no.emoji || '😴'}</span>
          <span className="rsvp-btn-title">{rsvpOptions.no.title || 'FOMO Sleeping In'}</span>
          <span className="rsvp-btn-sub">{rsvpOptions.no.sub || "Can't Go"}</span>
        </button>
      </div>

      {selectedStatus === 'yes' && (
        <div style={{
          marginTop: 6,
          padding: '10px 14px',
          background: 'rgba(255, 20, 147, 0.12)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          animation: 'fadeInScale 0.35s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>
              You're on the list! See you there.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenShare}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          >
            <Calendar size={12} />
            <span>Add Event</span>
          </button>
        </div>
      )}
    </div>
  );
}
