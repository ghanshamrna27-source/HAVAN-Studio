import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles, Calendar, MapPin, Key, Lock, Unlock, Volume2, VolumeX,
  Share2, ArrowLeft, Check, Download, ExternalLink, Sliders, Image,
  Palette, Tag, CheckCircle2, Copy, Send, Eye, ShieldCheck
} from 'lucide-react';
import {
  CATEGORIES, TEMPLATES, THEME_PALETTES, WAX_SEALS,
  FRAMING_BORDERS, DRESS_CODES
} from '../data/templates';
import { playPop, playCelebrationChord, playWhoosh } from '../utils/soundEffects';
import CanvasParticles from './CanvasParticles';

export default function InvitationCardMaker({ initialCategory = 'all', onBack }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  // Find initial template based on category
  const getInitialTemplate = (cat) => {
    if (cat && cat !== 'all') {
      const match = TEMPLATES.find((t) => t.category === cat);
      if (match) return match;
    }
    return TEMPLATES[0];
  };

  const [currentTemplate, setCurrentTemplate] = useState(() => getInitialTemplate(initialCategory));

  // Customization State
  const [selectedThemeId, setSelectedThemeId] = useState(currentTemplate.theme);
  const [selectedSeal, setSelectedSeal] = useState(
    WAX_SEALS.find((s) => s.category === currentTemplate.category) || WAX_SEALS[0]
  );
  const [selectedBorder, setSelectedBorder] = useState(FRAMING_BORDERS[0]);
  const [selectedDressCode, setSelectedDressCode] = useState(
    DRESS_CODES.find((d) => d.category === currentTemplate.category) || DRESS_CODES[0]
  );
  const [coverImage, setCoverImage] = useState(currentTemplate.image);
  const [particleEffect, setParticleEffect] = useState('stardust');

  // Event Details Form
  const [title, setTitle] = useState(currentTemplate.title);
  const [subtitle, setSubtitle] = useState(currentTemplate.subtitle);
  const [host, setHost] = useState(currentTemplate.host);
  const [date, setDate] = useState(currentTemplate.date);
  const [time, setTime] = useState(currentTemplate.time);
  const [venue, setVenue] = useState(currentTemplate.venue);
  const [address, setAddress] = useState(currentTemplate.venue + ', City Center');
  const [doorCode, setDoorCode] = useState(currentTemplate.doorCode || 'CODE: #7721');
  const [description, setDescription] = useState(currentTemplate.description);
  const [byobNotes, setByobNotes] = useState('Artisanal drinks provided • BYOB welcome');

  // Sender-Customizable RSVP Replies
  const [rsvpOptions, setRsvpOptions] = useState({
    yes: { ...currentTemplate.rsvpPreset.yes },
    maybe: { ...currentTemplate.rsvpPreset.maybe },
    no: { ...currentTemplate.rsvpPreset.no }
  });

  // UI States
  const [activeTab, setActiveTab] = useState('archetype'); // 'archetype' | 'design' | 'rsvp' | 'details'
  const [previewLocked, setPreviewLocked] = useState(false); // false = preview locked, true = preview unlocked
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedEvent, setPublishedEvent] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Audio Synth
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);

  // 3D Card tilt
  const cardRef = useRef(null);

  // Sync category selection with template
  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    if (catId !== 'all') {
      const matched = TEMPLATES.find((t) => t.category === catId);
      if (matched) applyTemplate(matched);
    }
  };

  const applyTemplate = (tpl) => {
    setCurrentTemplate(tpl);
    setTitle(tpl.title);
    setSubtitle(tpl.subtitle);
    setHost(tpl.host);
    setDate(tpl.date);
    setTime(tpl.time);
    setVenue(tpl.venue);
    setAddress(tpl.venue + ', City Center');
    setDoorCode(tpl.doorCode || 'CODE: #7721');
    setDescription(tpl.description);
    setCoverImage(tpl.image);
    setSelectedThemeId(tpl.theme);

    const sealMatch = WAX_SEALS.find((s) => s.category === tpl.category) || WAX_SEALS[0];
    setSelectedSeal(sealMatch);

    const dressMatch = DRESS_CODES.find((d) => d.category === tpl.category) || DRESS_CODES[0];
    setSelectedDressCode(dressMatch);

    setRsvpOptions({
      yes: { ...tpl.rsvpPreset.yes },
      maybe: { ...tpl.rsvpPreset.maybe },
      no: { ...tpl.rsvpPreset.no }
    });

    playPop();
  };

  const activeThemeObj = THEME_PALETTES.find((t) => t.id === selectedThemeId) || THEME_PALETTES[0];

  // Mouse 3D tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  // Audio Synthesizer
  const toggleSynthesizer = () => {
    if (isPlayingAudio) {
      stopSynthesizer();
    } else {
      startSynthesizer();
    }
  };

  const startSynthesizer = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.2, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, ctx.currentTime);
      master.connect(filter);
      filter.connect(ctx.destination);

      const freqs = currentTemplate.soundFreqs || [138.59, 207.65, 277.18];
      oscillatorsRef.current = freqs.map((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 0.8;
        lfo.connect(osc.frequency);
        lfo.start();

        osc.connect(master);
        osc.start();
        return osc;
      });

      setIsPlayingAudio(true);
    } catch (e) {}
  };

  const stopSynthesizer = () => {
    if (oscillatorsRef.current) {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch (e) {}
      });
      oscillatorsRef.current = [];
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    return () => {
      stopSynthesizer();
    };
  }, []);

  // Publish to Backend API
  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please provide an event title');
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        title: title.trim(),
        hostName: host.trim() || 'Havan Host',
        description: description || subtitle,
        dateTime: {
          startTime: new Date(Date.now() + 86400000 * 5).toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: {
          name: venue || 'Secret Venue',
          address: address || venue,
          doorCode: doorCode || 'CODE: #7721',
          byobNote: byobNotes,
          hideUntilRsvp: true
        },
        theme: {
          presetId: selectedThemeId,
          posterUrl: coverImage
        },
        customization: {
          seal: selectedSeal,
          framingBorder: selectedBorder,
          dressCode: selectedDressCode,
          rsvpOptions,
          soundFreqs: currentTemplate.soundFreqs || [138.59, 207.65, 277.18],
          effect: particleEffect,
          vibeTag: currentTemplate.vibeTag || 'Havan Gathering',
          coverImage
        }
      };

      const res = await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish event');
      }

      const ev = data.data;
      setPublishedEvent(ev);

      if (data.token) localStorage.setItem('fiesta_token', data.token);
      if (data.hostKey) localStorage.setItem(`fiesta_host_key_${ev.slug}`, data.hostKey);

      // Fetch QR
      try {
        const qrRes = await fetch(`/api/v1/events/${ev.slug}/qr`);
        const qrJson = await qrRes.json();
        if (qrJson.success && qrJson.data?.qrUrl) setQrDataUrl(qrJson.data.qrUrl);
      } catch (e) {}

      playCelebrationChord();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF407D', '#10B981', '#06B6D4', '#FFFFFF']
      });

      setIsShareModalOpen(true);
    } catch (err) {
      alert(err.message || 'Error publishing invitation');
    } finally {
      setIsPublishing(false);
    }
  };

  const copyShareLink = () => {
    if (!publishedEvent) return;
    const url = `${window.location.origin}/invite/${publishedEvent.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const filteredTemplates = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#07090e', color: '#fff', overflowX: 'hidden' }}>
      {/* Dynamic Ambient Background Orbs */}
      <div className="ambient-backdrop">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* 60fps Canvas Particle Layer */}
      <CanvasParticles effectType={particleEffect} particleColor={activeThemeObj.primary} />

      {/* Studio Header Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          background: 'rgba(7, 9, 14, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} />
            <span>Havan Home</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>🔥</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.04em', background: 'linear-gradient(90deg, #ffd700, #ff407d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HAVAN STUDIO
            </span>
          </div>
        </div>

        {/* Category Pill Switchers in Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                border: activeCategory === cat.id ? '1px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeCategory === cat.id ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: activeCategory === cat.id ? '#ffd700' : 'rgba(255, 255, 255, 0.75)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap'
              }}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={toggleSynthesizer}
            title="Toggle Live Web Audio Synthesizer"
            style={{
              background: isPlayingAudio ? 'rgba(255, 64, 125, 0.25)' : 'rgba(255, 255, 255, 0.06)',
              border: isPlayingAudio ? '1px solid #ff407d' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isPlayingAudio ? '#ff407d' : '#fff',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            {isPlayingAudio ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span>{isPlayingAudio ? 'Audio Live' : 'Sound'}</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Sparkles size={15} />
            <span>{isPublishing ? 'Publishing...' : 'Publish & Share ✨'}</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Studio Layout */}
      <main style={{ maxWidth: 1320, margin: '24px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'minmax(340px, 480px) 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* LEFT PANE: Sticky Live Preview Card */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Eye size={13} color="#ffd700" />
              <span>Live Sticky Guest Card</span>
            </div>
            
            {/* Secret Venue Toggle Button */}
            <button
              onClick={() => {
                setPreviewLocked(!previewLocked);
                playPop();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: previewLocked ? '#10b981' : '#ffd700',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              {previewLocked ? <Unlock size={12} /> : <Lock size={12} />}
              <span>{previewLocked ? 'Simulate Unlocked' : 'Simulate Locked'}</span>
            </button>
          </div>

          {/* 3D Spotlight Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`spotlight-card ${selectedBorder.cssClass}`}
            style={{
              borderRadius: 22,
              overflow: 'hidden',
              background: 'linear-gradient(165deg, rgba(20, 24, 38, 0.95) 0%, rgba(10, 13, 22, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.1)',
              transition: 'transform 0.15s ease-out'
            }}
          >
            {/* Artwork Cover */}
            <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
              <img
                src={coverImage}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(10, 13, 22, 0.95) 100%)'
                }}
              />

              {/* Badges & Wax Seal */}
              <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 999,
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sparkles size={11} color="#ff407d" />
                  <span>{currentTemplate.vibeTag || 'Gathering'}</span>
                </div>

                <div
                  onClick={() => {
                    playWhoosh();
                    confetti({ particleCount: 25, spread: 45, origin: { y: 0.2 } });
                  }}
                  title={`Wax Seal: ${selectedSeal.name}`}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #ffd700, #b8860b)',
                    border: '2px solid #fff',
                    boxShadow: '0 4px 14px rgba(255, 215, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    transform: 'rotate(-8deg)'
                  }}
                >
                  {selectedSeal.icon}
                </div>
              </div>

              {/* Title & Host overlay */}
              <div style={{ position: 'absolute', bottom: 14, left: 18, right: 18 }}>
                <div style={{ fontSize: '0.76rem', color: '#ff407d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  Hosted by {host || 'Host Name'}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                  {title || 'Your Event Title'}
                </h2>
              </div>
            </div>

            {/* Card Content */}
            <div style={{ padding: '16px 20px' }}>
              {subtitle && (
                <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: 16, lineHeight: 1.4 }}>
                  {subtitle}
                </p>
              )}

              {/* Logistics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '10px' }}>
                  <div style={{ color: '#ff407d', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} />
                    <span>When</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', marginTop: 3 }}>
                    {date}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {time}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '10px' }}>
                  <div style={{ color: '#ffd700', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{selectedDressCode.icon}</span>
                    <span>Dress Code</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', marginTop: 3 }}>
                    {selectedDressCode.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Curated Vibe
                  </div>
                </div>
              </div>

              {/* Secret Venue Box */}
              <div
                style={{
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: 16,
                  background: previewLocked
                    ? 'linear-gradient(145deg, rgba(255, 215, 0, 0.12), rgba(16, 185, 129, 0.08))'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: previewLocked
                    ? '1px solid rgba(255, 215, 0, 0.5)'
                    : '1px dashed rgba(255, 255, 255, 0.14)'
                }}
              >
                {!previewLocked ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255, 64, 125, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff407d', flexShrink: 0 }}>
                      <Lock size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ff407d', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>SECRET VENUE LOCKED</span>
                        <span>🔒</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 }}>
                        {venue} (Address & gate code locked until RSVP)
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ffd700' }}>
                        ✨ VENUE UNLOCKED — VIP ACCESS
                      </span>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>
                        UNLOCKED
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{venue}</div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: 2 }}>{address}</div>
                    {doorCode && (
                      <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0, 0, 0, 0.4)', padding: '4px 8px', borderRadius: 6, fontSize: '0.76rem', color: '#ffd700', fontFamily: 'monospace', fontWeight: 800 }}>
                        <Key size={12} />
                        <span>{doorCode}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Custom RSVP Buttons */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8 }}>
                  Interactive RSVP Replies:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  <div style={{ padding: '8px 4px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem' }}>{rsvpOptions.yes.emoji}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{rsvpOptions.yes.title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#10b981' }}>{rsvpOptions.yes.sub}</div>
                  </div>

                  <div style={{ padding: '8px 4px', borderRadius: 10, background: 'rgba(255, 215, 0, 0.12)', border: '1px solid rgba(255, 215, 0, 0.3)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem' }}>{rsvpOptions.maybe.emoji}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{rsvpOptions.maybe.title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#ffd700' }}>{rsvpOptions.maybe.sub}</div>
                  </div>

                  <div style={{ padding: '8px 4px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem' }}>{rsvpOptions.no.emoji}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', marginTop: 2 }}>{rsvpOptions.no.title}</div>
                    <div style={{ fontSize: '0.65rem', color: '#ef4444' }}>{rsvpOptions.no.sub}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Full Control Suite */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 12, overflowX: 'auto' }}>
            <button
              onClick={() => setActiveTab('archetype')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: activeTab === 'archetype' ? '1px solid #ffd700' : '1px solid transparent',
                background: activeTab === 'archetype' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                color: activeTab === 'archetype' ? '#ffd700' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Image size={15} />
              <span>1. Artwork & Archetype</span>
            </button>

            <button
              onClick={() => setActiveTab('design')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: activeTab === 'design' ? '1px solid #ffd700' : '1px solid transparent',
                background: activeTab === 'design' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                color: activeTab === 'design' ? '#ffd700' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Palette size={15} />
              <span>2. Theme & Wax Seal</span>
            </button>

            <button
              onClick={() => setActiveTab('rsvp')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: activeTab === 'rsvp' ? '1px solid #ffd700' : '1px solid transparent',
                background: activeTab === 'rsvp' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                color: activeTab === 'rsvp' ? '#ffd700' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Tag size={15} />
              <span>3. RSVP Reply Copy</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: activeTab === 'details' ? '1px solid #ffd700' : '1px solid transparent',
                background: activeTab === 'details' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
                color: activeTab === 'details' ? '#ffd700' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Sliders size={15} />
              <span>4. Details & Secret Passcode</span>
            </button>
          </div>

          {/* TAB 1: ARCHETYPE & ARTWORK */}
          {activeTab === 'archetype' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>
                  Choose Gathering Archetype:
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: 14 }}>
                  Selecting a preset instantly loads tailored artwork, wax seals, dress codes, and soundscapes.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                  {filteredTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => applyTemplate(tpl)}
                      style={{
                        padding: 10,
                        borderRadius: 14,
                        border: currentTemplate.id === tpl.id ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: currentTemplate.id === tpl.id ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <img
                        src={tpl.image}
                        alt={tpl.title}
                        style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#ff407d', fontWeight: 700 }}>
                        <span>{tpl.badgeEmoji}</span>
                        <span>{tpl.vibeTag}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tpl.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Cover Art URL */}
              <div style={{ marginTop: 10, padding: 16, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
                  Or Provide Custom Cover Image URL:
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    fontSize: '0.84rem'
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: THEME, WAX SEAL & BORDER */}
          {activeTab === 'design' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Theme Palette */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>
                  Aura Color Palette:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {THEME_PALETTES.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedThemeId(t.id);
                        playPop();
                      }}
                      style={{
                        padding: 10,
                        borderRadius: 12,
                        border: selectedThemeId === t.id ? `2px solid ${t.primary}` : '1px solid rgba(255, 255, 255, 0.1)',
                        background: selectedThemeId === t.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: t.primary }} />
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: t.accent }} />
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{t.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>{t.tag}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Royal Wax Seal */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>
                  Wax Seal Monogram:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
                  {WAX_SEALS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedSeal(s);
                        playWhoosh();
                      }}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 12,
                        border: selectedSeal.id === s.id ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: selectedSeal.id === s.id ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.icon}</div>
                      <div style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dress Code */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>
                  Dress Code Aesthetic:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                  {DRESS_CODES.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setSelectedDressCode(d);
                        playPop();
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: selectedDressCode.id === d.id ? '2px solid #ff407d' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: selectedDressCode.id === d.id ? 'rgba(255, 64, 125, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{d.icon}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>{d.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM RSVP REPLY BUTTONS */}
          {activeTab === 'rsvp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: 'rgba(255, 215, 0, 0.08)', border: '1px solid rgba(255, 215, 0, 0.25)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ffd700', fontWeight: 800, fontSize: '0.86rem' }}>
                  <Sparkles size={14} />
                  <span>Sender-Customizable RSVP Experience</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: 4 }}>
                  Personalize the 3 reply buttons your guests will see. Edits update the live sticky preview card in real time!
                </p>
              </div>

              {/* YES BUTTON CONFIG */}
              <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#10b981', marginBottom: 10 }}>
                  1. Positive Reply ("Going") Button:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Emoji</label>
                    <input
                      type="text"
                      value={rsvpOptions.yes.emoji}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, yes: { ...rsvpOptions.yes, emoji: e.target.value } })}
                      style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textAlign: 'center', fontSize: '1.2rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Button Title</label>
                    <input
                      type="text"
                      value={rsvpOptions.yes.title}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, yes: { ...rsvpOptions.yes, title: e.target.value } })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Subtitle Tag</label>
                    <input
                      type="text"
                      value={rsvpOptions.yes.sub}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, yes: { ...rsvpOptions.yes, sub: e.target.value } })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* MAYBE BUTTON CONFIG */}
              <div style={{ background: 'rgba(255, 215, 0, 0.06)', border: '1px solid rgba(255, 215, 0, 0.25)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffd700', marginBottom: 10 }}>
                  2. Tentative Reply ("Maybe") Button:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Emoji</label>
                    <input
                      type="text"
                      value={rsvpOptions.maybe.emoji}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, maybe: { ...rsvpOptions.maybe, emoji: e.target.value } })}
                      style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textAlign: 'center', fontSize: '1.2rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Button Title</label>
                    <input
                      type="text"
                      value={rsvpOptions.maybe.title}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, maybe: { ...rsvpOptions.maybe, title: e.target.value } })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Subtitle Tag</label>
                    <input
                      type="text"
                      value={rsvpOptions.maybe.sub}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, maybe: { ...rsvpOptions.maybe, sub: e.target.value } })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* NO BUTTON CONFIG */}
              <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ef4444', marginBottom: 10 }}>
                  3. Decline Reply ("Can't Go") Button:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Emoji</label>
                    <input
                      type="text"
                      value={rsvpOptions.no.emoji}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, no: { ...rsvpOptions.no, emoji: e.target.value } })}
                      style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textAlign: 'center', fontSize: '1.2rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Button Title</label>
                    <input
                      type="text"
                      value={rsvpOptions.no.title}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, no: { ...rsvpOptions.no, title: e.target.value } })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Subtitle Tag</label>
                    <input
                      type="text"
                      value={rsvpOptions.no.sub}
                      onChange={(e) => setRsvpOptions({ ...rsvpOptions, no: { ...rsvpOptions.no, sub: e.target.value } })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DETAILS & SECRET VENUE */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Title & Host */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    Host Name / Collective *
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                  Catchy Hook / Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    Date Display
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    Time Display
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Secret Venue & Gate Passcode */}
              <div style={{ background: 'rgba(255, 64, 125, 0.05)', border: '1px solid rgba(255, 64, 125, 0.25)', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff407d', fontWeight: 800, fontSize: '0.86rem', marginBottom: 12 }}>
                  <ShieldCheck size={16} />
                  <span>Secret Location Security (Locked until RSVP)</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', marginBottom: 4 }}>
                      Venue Name (Shown publicly) *
                    </label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#ffd700', marginBottom: 4 }}>
                      Secret Entry / Gate Code (Locked) *
                    </label>
                    <input
                      type="text"
                      value={doorCode}
                      onChange={(e) => setDoorCode(e.target.value)}
                      placeholder="e.g. CODE: #7721"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', fontFamily: 'monospace', fontSize: '0.86rem', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', marginBottom: 4 }}>
                    Full Secret Address (Revealed to confirmed guests only) *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                  Full Description & Story
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.84rem', resize: 'vertical' }}
                />
              </div>

              {/* BYOB / Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                  BYOB & Instructions Note
                </label>
                <input
                  type="text"
                  value={byobNotes}
                  onChange={(e) => setByobNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>
            </div>
          )}

          {/* Bottom Publish Bar */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Ready to send? Publish instantly to get your live WhatsApp share link.
            </div>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Sparkles size={16} />
              <span>{isPublishing ? 'Publishing Event...' : 'Publish & Get Shareable Invite ✨'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Published Success & Share Sheet Modal */}
      {isShareModalOpen && publishedEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(5, 7, 12, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: 480,
              padding: 28,
              borderRadius: 22,
              background: 'linear-gradient(150deg, #131726, #090c14)',
              border: '1px solid rgba(255, 215, 0, 0.4)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}
              >
                <Check size={28} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Your Havan Invite is Live!
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.84rem', marginTop: 4 }}>
                Guests can open this link on any phone or browser and RSVP in 15 seconds without creating an account.
              </p>
            </div>

            {/* Link Preview Bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/invite/${publishedEvent.slug}`}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffd700',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={copyShareLink}
                className="btn-secondary"
                style={{ padding: '0 16px', fontSize: '0.82rem', flexShrink: 0 }}
              >
                {copiedLink ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            {/* QR Code */}
            {qrDataUrl && (
              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, marginBottom: 16 }}>
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  style={{ width: 120, height: 120, borderRadius: 8, margin: '0 auto', display: 'block' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: 4, display: 'block' }}>
                  Scan to RSVP instantly
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => {
                  window.location.href = `/invite/${publishedEvent.slug}`;
                }}
                className="btn-primary"
                style={{ padding: '12px', width: '100%', background: 'linear-gradient(135deg, #ff407d, #9333ea)', fontSize: '0.92rem' }}
              >
                <ExternalLink size={17} />
                <span>Open Live Invitation Now ✨</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🎉 YOU'RE INVITED: ${title}\n🗓️ ${date} • ${time}\n📍 ${venue} (Secret gate code locked until RSVP)\n\nRSVP & get secret door entry code here:\n${window.location.origin}/invite/${publishedEvent.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px',
                  width: '100%',
                  borderRadius: 12,
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <span>💬 Send via WhatsApp</span>
              </a>

              <button
                onClick={() => setIsShareModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  marginTop: 6
                }}
              >
                Close & keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
