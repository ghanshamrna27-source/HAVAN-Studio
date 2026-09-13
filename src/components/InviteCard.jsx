import React, { useState } from 'react';
import SpotlightCard from './SpotlightCard';
import SecretVenue from './SecretVenue';
import RSVPSection from './RSVPSection';
import AudioPlayer from './AudioPlayer';
import HypeWall from './HypeWall';
import Marquee from './Marquee';
import FloatingReactions from './FloatingReactions';
import { Calendar, Clock, Shirt, Sparkles, Flame, Share2, Music2 } from 'lucide-react';
import { playPop, playWhoosh } from '../utils/soundEffects';

export default function InviteCard({
  artwork,
  theme,
  seal,
  framingBorder,
  dressCode,
  eventData,
  rsvpOptions,
  selectedStatus,
  onSelectStatus,
  guestCount,
  guests,
  onAddGuestMessage,
  onOpenShare,
  onCycleSeal
}) {
  const [reactionTrigger, setReactionTrigger] = useState(null);
  const borderClass = framingBorder ? `frame-${framingBorder.id}` : 'frame-neon-cyber';

  const triggerReaction = (emoji) => {
    playPop();
    setReactionTrigger({ emoji, timestamp: Date.now() });
  };

  const handleSealClick = () => {
    playWhoosh();
    triggerReaction(seal.icon);
    onCycleSeal();
  };

  return (
    <div className="sticky-preview-col" style={{ position: 'relative' }}>
      {/* Floating Reaction Emojis Overlay */}
      <FloatingReactions triggerReaction={reactionTrigger} />

      <SpotlightCard className={`invite-card-container ${borderClass}`}>
        <div className="invite-card-inner">
          {/* Hero Artwork Stage */}
          <div className="card-hero-stage">
            <img
              src={artwork.src}
              alt={artwork.title}
              className="card-hero-image"
              loading="eager"
            />
            <div className="hero-gradient-overlay" />

            {/* Top Bar: Tag & Wax Seal */}
            <div className="hero-top-bar">
              <div className="artwork-mood-badge">
                <Sparkles size={12} color="var(--accent-secondary)" />
                <span>{artwork.tag || 'House Party'}</span>
              </div>

              <div
                className="wax-seal-badge interactive-stamp"
                title={`Seal: ${seal.name} (Click to change & react)`}
                onClick={handleSealClick}
              >
                <span>{seal.icon}</span>
              </div>
            </div>

            {/* Bottom Bar: Mood & Countdown */}
            <div className="hero-bottom-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: '0.78rem', fontWeight: 600 }}>
                <Flame size={14} color="var(--accent-primary)" />
                <span>{artwork.mood}</span>
              </div>

              <div className="countdown-pill">
                <span>⏱️ Starts in 4d 6h</span>
              </div>
            </div>
          </div>

          {/* Magic UI Infinite Marquee Ticker */}
          <Marquee speed={24} className="party-vibe-marquee">
            <div className="marquee-item">🪩 LIVE VINYL SELECTORS</div>
            <span className="marquee-dot">•</span>
            <div className="marquee-item">🍹 ARTISANAL BAR</div>
            <span className="marquee-dot">•</span>
            <div className="marquee-item">⚡ ROOFTOP SOUNDS</div>
            <span className="marquee-dot">•</span>
            <div className="marquee-item">🍕 2AM PIZZA RUN</div>
            <span className="marquee-dot">•</span>
            <div className="marquee-item">🔥 SECRET VENUE UNLOCKED</div>
            <span className="marquee-dot">•</span>
            <div className="marquee-item">🍾 BYOB WELCOME</div>
            <span className="marquee-dot">•</span>
          </Marquee>

          {/* Title & Host info */}
          <div>
            <h1 className="event-title-shimmer">{eventData.title}</h1>
            <p className="event-subtitle">{eventData.subtitle}</p>

            <div className="host-badge-row">
              <div className="host-avatar">🍸</div>
              <span>Hosted by <strong style={{ color: '#fff' }}>{eventData.host}</strong></span>
              <span>•</span>
              <span style={{ color: 'var(--text-accent)' }}>Private Gathering</span>
            </div>
          </div>

          {/* Quick Hype Reactions Bar */}
          <div className="quick-react-bar">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Send Hype:</span>
            {['🔥', '🪩', '🍾', '⚡', '🍸', '🍕'].map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-react-btn"
                onClick={() => triggerReaction(emoji)}
                title={`Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Quick Details Chips */}
          <div className="details-chip-grid">
            <div className="detail-chip">
              <span className="detail-chip-label">
                <Calendar size={12} color="var(--accent-primary)" />
                <span>Date</span>
              </span>
              <span className="detail-chip-value">{eventData.date}</span>
            </div>

            <div className="detail-chip">
              <span className="detail-chip-label">
                <Clock size={12} color="var(--accent-secondary)" />
                <span>Time</span>
              </span>
              <span className="detail-chip-value">{eventData.time}</span>
            </div>

            <div className="detail-chip">
              <span className="detail-chip-label">
                <Shirt size={12} color="var(--text-accent)" />
                <span>Dress Code</span>
              </span>
              <span className="detail-chip-value">{dressCode?.title || 'Casual Chic'}</span>
            </div>

            <div className="detail-chip">
              <span className="detail-chip-label">
                <span>🍾</span>
                <span>Bar & Fuel</span>
              </span>
              <span className="detail-chip-value">{eventData.byobNote || 'BYOB & Shared Snacks'}</span>
            </div>
          </div>

          {/* Secret Venue Box */}
          <SecretVenue
            isUnlocked={selectedStatus === 'yes'}
            venue={eventData.venue}
            address={eventData.address}
            doorCode={eventData.doorCode}
            notes={eventData.locationNotes}
          />

          {/* RSVP Choice Section */}
          <RSVPSection
            rsvpOptions={rsvpOptions}
            selectedStatus={selectedStatus}
            onSelectStatus={onSelectStatus}
            guestCount={guestCount}
            onOpenShare={onOpenShare}
            onTriggerReaction={triggerReaction}
          />

          {/* Audio Synthesizer Bar */}
          <AudioPlayer />

          {/* Social Hype Wall */}
          <HypeWall guests={guests} onAddGuestMessage={onAddGuestMessage} />

          {/* Footer Share Button with Shimmer Sweep */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              onClick={onOpenShare}
              className="btn-primary shimmer-hover"
              style={{ flex: 1, padding: '10px 16px', fontSize: '0.84rem' }}
            >
              <Share2 size={16} />
              <span>Share / Add to Calendar</span>
            </button>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
