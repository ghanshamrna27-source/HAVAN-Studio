import React, { useState } from 'react';
import {
  Image,
  Palette,
  CheckSquare,
  FileText,
  Sliders,
  Sparkles,
  Check,
  ShieldCheck,
  Music,
  Share2,
  Settings
} from 'lucide-react';
import { ARTWORKS } from '../data/artworks';
import { THEMES } from '../data/themes';
import {
  WAX_SEALS,
  FRAMING_BORDERS,
  DRESS_CODES,
  RSVP_PRESETS,
  PARTICLE_EFFECTS
} from '../data/decorations';
import { playPop, playWhoosh } from '../utils/soundEffects';

export default function DesignSuite({
  currentArtwork,
  onSelectArtwork,
  currentTheme,
  onSelectTheme,
  currentSeal,
  onSelectSeal,
  currentBorder,
  onSelectBorder,
  currentDressCode,
  onSelectDressCode,
  currentEffect,
  onSelectEffect,
  density,
  onSelectDensity,
  speed,
  onSelectSpeed,
  rsvpOptions,
  onChangeRsvpOptions,
  eventData,
  onChangeEventData,
  onOpenShare
}) {
  const [activeTab, setActiveTab] = useState('artwork');

  const handleTabClick = (tab) => {
    playPop();
    setActiveTab(tab);
  };

  const handleApplyPreset = (preset) => {
    playPop();
    onChangeRsvpOptions({
      yes: { ...preset.yes },
      maybe: { ...preset.maybe },
      no: { ...preset.no }
    });
  };

  const handleEventChange = (field, value) => {
    onChangeEventData({
      ...eventData,
      [field]: value
    });
  };

  const handleRsvpFieldChange = (choiceKey, subfield, value) => {
    onChangeRsvpOptions({
      ...rsvpOptions,
      [choiceKey]: {
        ...rsvpOptions[choiceKey],
        [subfield]: value
      }
    });
  };

  const handleSelectArtworkWithSound = (art) => {
    playWhoosh();
    onSelectArtwork(art);
  };

  const handleSelectThemeWithSound = (th) => {
    playPop();
    onSelectTheme(th);
  };

  return (
    <div className="design-suite-card">
      {/* Tab Navigation */}
      <div className="suite-tabs-nav">
        <button
          type="button"
          onClick={() => handleTabClick('artwork')}
          className={`suite-tab-btn ${activeTab === 'artwork' ? 'active' : ''}`}
        >
          <Image size={15} />
          <span>Cover & Style</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('themes')}
          className={`suite-tab-btn ${activeTab === 'themes' ? 'active' : ''}`}
        >
          <Palette size={15} />
          <span>Themes & FX</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('rsvp')}
          className={`suite-tab-btn ${activeTab === 'rsvp' ? 'active' : ''}`}
        >
          <CheckSquare size={15} />
          <span>Custom RSVP</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('details')}
          className={`suite-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
        >
          <FileText size={15} />
          <span>Event Info</span>
        </button>
      </div>

      <div className="suite-tab-content">
        {/* ================= TAB 1: COVER & STYLE ================= */}
        {activeTab === 'artwork' && (
          <>
            <div>
              <div className="section-header">
                <div className="section-title">
                  <Image size={18} color="var(--accent-primary)" />
                  <span>Choose Cover Artwork (13 Party Photos)</span>
                </div>
                <div className="section-sub">Live real-time preview</div>
              </div>

              <div className="photo-gallery-grid">
                {ARTWORKS.map((art) => {
                  const isSelected = currentArtwork.id === art.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => handleSelectArtworkWithSound(art)}
                      className={`photo-thumbnail-card ${isSelected ? 'selected' : ''}`}
                      title={art.title}
                    >
                      <img src={art.src} alt={art.title} loading="lazy" />
                      <div className="thumbnail-tag">{art.tag}</div>
                      {isSelected && (
                        <div className="thumbnail-check">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seals & Badges */}
            <div>
              <div className="section-header">
                <div className="section-title">
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span>Party Badge / Monogram Stamp</span>
                </div>
                <div className="section-sub">Top right corner seal</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                {WAX_SEALS.map((s) => {
                  const isSelected = currentSeal.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        playPop();
                        onSelectSeal(s);
                      }}
                      style={{
                        background: isSelected ? 'var(--accent-soft)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Framing Borders */}
            <div>
              <div className="section-header">
                <div className="section-title">
                  <ShieldCheck size={18} color="var(--accent-primary)" />
                  <span>Card Framing Border</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {FRAMING_BORDERS.map((b) => {
                  const isSelected = currentBorder.id === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        playPop();
                        onSelectBorder(b);
                      }}
                      style={{
                        background: isSelected ? 'var(--accent-soft)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{b.name}</span>
                      {isSelected && <Check size={14} color="var(--accent-primary)" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 2: THEMES & ATMOSPHERE ================= */}
        {activeTab === 'themes' && (
          <>
            <div>
              <div className="section-header">
                <div className="section-title">
                  <Palette size={18} color="var(--accent-primary)" />
                  <span>Curated Party Color Palettes</span>
                </div>
                <div className="section-sub">Updates orbs, glow & cards</div>
              </div>

              <div className="theme-grid">
                {THEMES.map((th) => {
                  const isSelected = currentTheme.id === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => handleSelectThemeWithSound(th)}
                      className={`theme-selector-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{th.name}</span>
                        {isSelected && <Check size={14} color="var(--accent-primary)" />}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {th.tagline}
                      </div>

                      <div className="theme-color-dots">
                        {th.orbs.map((color, i) => (
                          <div key={i} className="color-dot" style={{ background: color }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Particle Effects */}
            <div>
              <div className="section-header">
                <div className="section-title">
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span>Atmospheric Canvas Particles</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {PARTICLE_EFFECTS.map((fx) => {
                  const isSelected = currentEffect === fx.id;
                  return (
                    <button
                      key={fx.id}
                      type="button"
                      onClick={() => {
                        playPop();
                        onSelectEffect(fx.id);
                      }}
                      style={{
                        background: isSelected ? 'var(--accent-soft)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{fx.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{fx.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Sliders */}
              <div className="form-row-2" style={{ marginTop: 16 }}>
                <div className="input-group">
                  <div className="input-label">
                    <span>Particle Density:</span>
                    <span style={{ color: 'var(--text-accent)' }}>{density}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.2"
                    step="0.2"
                    value={density}
                    onChange={(e) => onSelectDensity(parseFloat(e.target.value))}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </div>

                <div className="input-group">
                  <div className="input-label">
                    <span>Flow Speed:</span>
                    <span style={{ color: 'var(--text-accent)' }}>{speed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.2"
                    value={speed}
                    onChange={(e) => onSelectSpeed(parseFloat(e.target.value))}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 3: CUSTOM RSVP REPLIES ================= */}
        {activeTab === 'rsvp' && (
          <>
            <div>
              <div className="section-header">
                <div className="section-title">
                  <CheckSquare size={18} color="var(--accent-primary)" />
                  <span>Sender-Customizable RSVP Buttons</span>
                </div>
                <div className="section-sub">Two-way live card binding</div>
              </div>

              {/* Preset Quick Loader */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Presets:</span>
                {RSVP_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="btn-secondary"
                    style={{ fontSize: '0.74rem', padding: '6px 10px', whiteSpace: 'nowrap' }}
                  >
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>

              {/* 3 RSVP Customizer Boxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* YES */}
                <div className="rsvp-customizer-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1rem' }}>🟢</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>"Going" Button Reply</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 10 }}>
                    <div className="input-group">
                      <label className="input-label">Emoji</label>
                      <input
                        type="text"
                        value={rsvpOptions.yes.emoji}
                        onChange={(e) => handleRsvpFieldChange('yes', 'emoji', e.target.value)}
                        className="input-field"
                        style={{ textAlign: 'center', fontSize: '1.2rem' }}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Button Title</label>
                      <input
                        type="text"
                        value={rsvpOptions.yes.title}
                        onChange={(e) => handleRsvpFieldChange('yes', 'title', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Subtitle</label>
                      <input
                        type="text"
                        value={rsvpOptions.yes.sub}
                        onChange={(e) => handleRsvpFieldChange('yes', 'sub', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* MAYBE */}
                <div className="rsvp-customizer-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1rem' }}>🟡</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>"Maybe" Button Reply</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 10 }}>
                    <div className="input-group">
                      <label className="input-label">Emoji</label>
                      <input
                        type="text"
                        value={rsvpOptions.maybe.emoji}
                        onChange={(e) => handleRsvpFieldChange('maybe', 'emoji', e.target.value)}
                        className="input-field"
                        style={{ textAlign: 'center', fontSize: '1.2rem' }}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Button Title</label>
                      <input
                        type="text"
                        value={rsvpOptions.maybe.title}
                        onChange={(e) => handleRsvpFieldChange('maybe', 'title', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Subtitle</label>
                      <input
                        type="text"
                        value={rsvpOptions.maybe.sub}
                        onChange={(e) => handleRsvpFieldChange('maybe', 'sub', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* NO */}
                <div className="rsvp-customizer-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1rem' }}>🔴</span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>"Can't Go" Button Reply</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 10 }}>
                    <div className="input-group">
                      <label className="input-label">Emoji</label>
                      <input
                        type="text"
                        value={rsvpOptions.no.emoji}
                        onChange={(e) => handleRsvpFieldChange('no', 'emoji', e.target.value)}
                        className="input-field"
                        style={{ textAlign: 'center', fontSize: '1.2rem' }}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Button Title</label>
                      <input
                        type="text"
                        value={rsvpOptions.no.title}
                        onChange={(e) => handleRsvpFieldChange('no', 'title', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Subtitle</label>
                      <input
                        type="text"
                        value={rsvpOptions.no.sub}
                        onChange={(e) => handleRsvpFieldChange('no', 'sub', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 4: EVENT INFO LIVE FORM ================= */}
        {activeTab === 'details' && (
          <>
            <div>
              <div className="section-header">
                <div className="section-title">
                  <FileText size={18} color="var(--accent-primary)" />
                  <span>Event Details & Secret Venue Info</span>
                </div>
                <div className="section-sub">Instant live synchronization</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-row-2">
                  <div className="input-group">
                    <label className="input-label">Event Headline Title</label>
                    <input
                      type="text"
                      value={eventData.title}
                      onChange={(e) => handleEventChange('title', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Host Name or Collective</label>
                    <input
                      type="text"
                      value={eventData.host}
                      onChange={(e) => handleEventChange('host', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Tagline or Mood Hook</label>
                  <input
                    type="text"
                    value={eventData.subtitle}
                    onChange={(e) => handleEventChange('subtitle', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="form-row-2">
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input
                      type="text"
                      value={eventData.date}
                      onChange={(e) => handleEventChange('date', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Time</label>
                    <input
                      type="text"
                      value={eventData.time}
                      onChange={(e) => handleEventChange('time', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="input-group">
                    <label className="input-label">Dress Code Style</label>
                    <select
                      value={currentDressCode.id}
                      onChange={(e) => {
                        const dc = DRESS_CODES.find((d) => d.id === e.target.value);
                        if (dc) {
                          playPop();
                          onSelectDressCode(dc);
                        }
                      }}
                      className="select-field"
                    >
                      {DRESS_CODES.map((dc) => (
                        <option key={dc.id} value={dc.id}>
                          {dc.icon} {dc.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">BYOB / Food Note</label>
                    <input
                      type="text"
                      value={eventData.byobNote}
                      onChange={(e) => handleEventChange('byobNote', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Secret Venue Details */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border-subtle)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFD700', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>🔒 Secret Location Setup (Revealed after RSVP)</span>
                  </div>

                  <div className="form-row-2">
                    <div className="input-group">
                      <label className="input-label">Venue / Place Name</label>
                      <input
                        type="text"
                        value={eventData.venue}
                        onChange={(e) => handleEventChange('venue', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Gate / Door Code</label>
                      <input
                        type="text"
                        value={eventData.doorCode}
                        onChange={(e) => handleEventChange('doorCode', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="input-group" style={{ marginTop: 10 }}>
                    <label className="input-label">Full Street Address (for Maps)</label>
                    <input
                      type="text"
                      value={eventData.address}
                      onChange={(e) => handleEventChange('address', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group" style={{ marginTop: 10 }}>
                    <label className="input-label">Door Instructions / Buzzer</label>
                    <input
                      type="text"
                      value={eventData.locationNotes}
                      onChange={(e) => handleEventChange('locationNotes', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Event Description */}
                <div className="input-group">
                  <label className="input-label">Party Overview & Story</label>
                  <textarea
                    rows={3}
                    value={eventData.description}
                    onChange={(e) => handleEventChange('description', e.target.value)}
                    className="textarea-field"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Global Footer Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 16, borderTop: '1px solid var(--glass-border-subtle)' }}>
          <button
            type="button"
            onClick={() => {
              playPop();
              onOpenShare();
            }}
            className="btn-primary shimmer-hover"
            style={{ flex: 1 }}
          >
            <Share2 size={16} />
            <span>Export & Share Invitation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
