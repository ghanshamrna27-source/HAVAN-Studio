import React from 'react';
import { Lock, MapPin, Key, ExternalLink, Sparkles } from 'lucide-react';
import BorderBeam from './BorderBeam';

export default function SecretVenue({ isUnlocked, venue, address, doorCode, notes }) {
  if (!isUnlocked) {
    return (
      <div className="secret-venue-box">
        <div className="venue-locked-view">
          <div className="lock-icon-bubble">
            <Lock size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-accent)' }}>
              <span>SECRET VENUE LOCKED</span>
              <span>🔒</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              RSVP "Going" to instantly unlock address, gate code & directions
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="secret-venue-box unlocked" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Magic UI Border Beam */}
      <BorderBeam
        size={240}
        duration={8}
        colorFrom="#FFD700"
        colorTo="var(--accent-primary)"
        borderWidth={2}
      />

      <div className="shine-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', fontWeight: 800, color: '#FFD700', letterSpacing: '0.04em' }}>
            <Sparkles size={14} />
            <span>VENUE UNLOCKED — VIP ACCESS</span>
          </div>
          <span style={{ fontSize: '0.65rem', background: 'rgba(255, 215, 0, 0.2)', color: '#FFD700', padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(255, 215, 0, 0.4)' }}>
            CONFIRMED
          </span>
        </div>

        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={16} color="var(--accent-primary)" />
          <span>{venue || 'The Penthouse & Skyline Terrace'}</span>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2, marginLeft: 22 }}>
          {address || '742 Evergreen Boulevard, Loft 4B (Rooftop Access)'}
        </div>

        {doorCode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '6px 10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8 }}>
            <Key size={14} color="#FFD700" />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Entry / Gate Code:</span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#FFD700' }}>
              {doorCode}
            </span>
          </div>
        )}

        {notes && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic', marginLeft: 4 }}>
            💡 {notes}
          </div>
        )}

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((venue || '') + ' ' + (address || ''))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ marginTop: 12, padding: '6px 12px', fontSize: '0.75rem', width: 'fit-content' }}
        >
          <span>Open in Google Maps</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
