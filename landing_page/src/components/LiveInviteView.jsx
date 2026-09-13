import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar, MapPin, Lock, Unlock, Sparkles, CheckCircle2, Music, Users,
  Share2, Key, Download, ExternalLink, ArrowLeft, Send, Check, QrCode, Copy, Volume2, VolumeX, MessageSquare
} from 'lucide-react';
import { playPop, playCelebrationChord, playWhoosh } from '../utils/soundEffects';
import CanvasParticles from './CanvasParticles';

export default function LiveInviteView({ slug, onBackToStudio }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // RSVP State
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('going');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [myRsvp, setMyRsvp] = useState(null);
  const [unlockedLocation, setUnlockedLocation] = useState(null);

  // Social Guest Wall
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Share Modal & QR
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Audio Synth
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);

  const cardRef = useRef(null);

  // Fetch Event Data
  const loadEvent = async () => {
    try {
      setLoading(true);
      const hostKey = localStorage.getItem(`fiesta_host_key_${slug}`);
      const headers = {};
      if (hostKey) headers['x-host-key'] = hostKey;

      const savedRsvp = localStorage.getItem(`fiesta_rsvp_${slug}`);
      if (savedRsvp) {
        try {
          const parsed = JSON.parse(savedRsvp);
          if (parsed.contact) headers['x-guest-contact'] = parsed.contact;
          setMyRsvp(parsed);
          setSelectedStatus(parsed.rsvpStatus === 'going' ? 'yes' : parsed.rsvpStatus === 'maybe' ? 'maybe' : 'no');
        } catch (e) {}
      }

      const res = await fetch(`/api/v1/events/${slug}`, { headers });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Event not found');
      }

      setEvent(data.data);
      if (data.data.callerGuestRsvp) {
        setMyRsvp(data.data.callerGuestRsvp);
        setSelectedStatus(data.data.callerGuestRsvp.rsvpStatus === 'going' ? 'yes' : data.data.callerGuestRsvp.rsvpStatus === 'maybe' ? 'maybe' : 'no');
      }

      if (data.data.location?.isUnlocked) {
        setUnlockedLocation(data.data.location);
      }

      // Fetch comments/hype wall
      try {
        const cRes = await fetch(`/api/v1/events/${data.data._id}/comments`);
        const cData = await cRes.json();
        if (cData.success && cData.data) setComments(cData.data);
      } catch (err) {}

      // Fetch QR Code
      try {
        const qrRes = await fetch(`/api/v1/events/${data.data.slug}/qr`);
        const qrData = await qrRes.json();
        if (qrData.success && qrData.data?.qrUrl) setQrCodeUrl(qrData.data.qrUrl);
      } catch (err) {}

    } catch (err) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
    return () => {
      stopSynthesizer();
    };
  }, [slug]);

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

  // Web Audio Synthesizer
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
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      master.connect(filter);
      filter.connect(ctx.destination);

      const freqs = event?.customization?.soundFreqs?.length
        ? event.customization.soundFreqs
        : [138.59, 207.65, 277.18];

      oscillatorsRef.current = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;

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
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
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

  // Trigger RSVP Click
  const handleRsvpOptionClick = (statusKey) => {
    playPop();
    const backendStatus = statusKey === 'yes' ? 'going' : statusKey === 'maybe' ? 'maybe' : 'cant_go';
    setPendingStatus(backendStatus);

    if (myRsvp) {
      // Already filled contact, update directly
      submitRsvpPayload(backendStatus, myRsvp.name, myRsvp.contact);
    } else {
      setIsRsvpModalOpen(true);
    }
  };

  const submitRsvpPayload = async (status, name, contact, note = '') => {
    if (!name.trim() || !contact.trim()) return;
    setIsSubmittingRsvp(true);

    try {
      const res = await fetch(`/api/v1/events/${event._id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          rsvpStatus: status
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      const rsvpData = { ...data.data.guest, rsvpStatus: status };
      localStorage.setItem(`fiesta_rsvp_${slug}`, JSON.stringify(rsvpData));
      setMyRsvp(rsvpData);
      setSelectedStatus(status === 'going' ? 'yes' : status === 'maybe' ? 'maybe' : 'no');

      if (data.data.unlockedLocation) {
        setUnlockedLocation(data.data.unlockedLocation);
      }

      // Update count
      if (data.data.counts) {
        setEvent((prev) => ({
          ...prev,
          rsvpCounts: data.data.counts
        }));
      }

      // Celebration effects if Going
      if (status === 'going') {
        playCelebrationChord();
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FF1493', '#00F0FF', '#FFD700', '#8B5CF6', '#FFFFFF', '#10B981']
        });
      }

      // If user provided a note, post as a blessing/comment
      if (note.trim()) {
        try {
          await fetch(`/api/v1/events/${event._id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              authorName: name.trim(),
              text: note.trim()
            })
          });
          // Refresh comments
          const cRes = await fetch(`/api/v1/events/${event._id}/comments`);
          const cData = await cRes.json();
          if (cData.success && cData.data) setComments(cData.data);
        } catch (e) {}
      }

      setIsRsvpModalOpen(false);
    } catch (err) {
      alert(err.message || 'Error saving RSVP');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  // Post Standalone Comment/Blessing
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const author = commentName.trim() || myRsvp?.name || 'Guest';

    setIsPostingComment(true);
    try {
      const res = await fetch(`/api/v1/events/${event._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: author,
          text: newComment.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setComments((prev) => [data.data, ...prev]);
        setNewComment('');
        playPop();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingComment(false);
    }
  };

  // Download .ics Calendar File
  const downloadCalendarFile = () => {
    if (!event) return;
    const title = event.title || 'Event Invitation';
    const desc = (event.description || '').replace(/\n/g, ' ');
    const venue = unlockedLocation ? `${unlockedLocation.name}, ${unlockedLocation.address}` : event.location?.name || 'Secret Location';

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HAVAN//Live Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc} Host: ${event.hostName || 'Host'}`,
      `LOCATION:${venue}`,
      'DTSTART:20261114T193000Z',
      'DTEND:20261115T020000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyShareUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getWhatsAppShareUrl = () => {
    if (!event) return '';
    const text = `🎉 YOU'RE INVITED: ${event.title}\n🗓️ ${new Date(event.dateTime?.startTime).toLocaleDateString()} • ${event.dateTime?.startTime ? new Date(event.dateTime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}\n📍 ${event.location?.name || 'Secret Location'}\n\nRSVP & get secret door entry code here:\n${window.location.href}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080a12', color: '#fff' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(255, 64, 125, 0.2)', borderTopColor: '#ff407d', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ marginTop: 16, fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.6)' }}>Loading sensory invitation...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080a12', color: '#fff', padding: 24, textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Invitation Not Found</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', maxWidth: 400, marginBottom: 24 }}>{error || "We couldn't locate this gathering. The link might be expired or invalid."}</p>
        <button onClick={onBackToStudio} className="btn-primary" style={{ padding: '12px 24px' }}>
          <ArrowLeft size={16} />
          <span>Back to Gathering Studio</span>
        </button>
      </div>
    );
  }

  const custom = event.customization || {};
  const rsvpOptions = custom.rsvpOptions || {
    yes: { emoji: '🍾', title: "Hell Yeah, I'm In!", sub: 'Going' },
    maybe: { emoji: '🍹', title: 'Might Slide Through', sub: 'Maybe' },
    no: { emoji: '😴', title: 'FOMO Sleeping In', sub: "Can't Go" }
  };

  const seal = custom.seal || { icon: '🪩', name: 'Disco Monogram' };
  const dressCode = custom.dressCode || { title: 'Retro Chic', icon: '👔' };
  const coverImg = custom.coverImage || event.theme?.posterUrl || '/media/img3.jpeg';
  const attendingCount = (event.rsvpCounts?.going || 0) + 12; // base sample + live count
  const isVenueUnlocked = Boolean(unlockedLocation || !event.location?.hideUntilRsvp);

  const formattedDate = new Date(event.dateTime?.startTime).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
  const formattedTime = new Date(event.dateTime?.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit'
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#07090e', color: '#fff', overflowX: 'hidden', paddingBottom: 60 }}>
      {/* Dynamic Ambient Background Orbs */}
      <div className="ambient-backdrop">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* 60fps Canvas Particle Layer */}
      <CanvasParticles effectType={custom.effect || 'stardust'} particleColor="#ff407d" />

      {/* Sticky Floating Action Nav */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          background: 'rgba(7, 9, 14, 0.75)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <button
          onClick={onBackToStudio}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={14} />
          <span>Invite Studio</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Web Audio Synthesizer Toggle */}
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
            <span>{isPlayingAudio ? 'Audio Playing' : 'Play Vibes'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Sensory Card Container */}
      <main style={{ maxWidth: 520, margin: '28px auto 0', padding: '0 16px', position: 'relative', zIndex: 10 }}>
        
        {/* Host Banner if Creator */}
        {localStorage.getItem(`fiesta_host_key_${slug}`) && (
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.15), rgba(255, 64, 125, 0.15))',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ffd700', fontWeight: 700 }}>
              <Sparkles size={14} />
              <span>Host Mode Active — Ready to Send!</span>
            </div>
            <button
              onClick={() => setIsShareOpen(true)}
              style={{
                background: '#ffd700',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Copy WhatsApp Invite
            </button>
          </div>
        )}

        {/* 3D Spotlight Interactive Invitation Card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="spotlight-card"
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            background: 'linear-gradient(165deg, rgba(20, 24, 38, 0.95) 0%, rgba(10, 13, 22, 0.98) 100%)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 64, 125, 0.15)',
            transition: 'transform 0.15s ease-out'
          }}
        >
          {/* Artwork Stage */}
          <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
            <img
              src={coverImg}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(10, 13, 22, 0.95) 100%)'
              }}
            />

            {/* Top Bar: Vibe Badge & Wax Seal */}
            <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Sparkles size={12} color="#ff407d" />
                <span>{custom.vibeTag || 'Exclusive Event'}</span>
              </div>

              {/* Royal Wax Seal */}
              <div
                onClick={() => {
                  playWhoosh();
                  confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
                }}
                title="Royal Seal of Authenticity"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #ffd700, #b8860b)',
                  border: '2px solid #fff',
                  boxShadow: '0 4px 16px rgba(255, 215, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  transform: 'rotate(-8deg)'
                }}
              >
                {seal.icon || '🪩'}
              </div>
            </div>

            {/* Title & Host on Artwork */}
            <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
              <div style={{ fontSize: '0.8rem', color: '#ff407d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Hosted by {event.hostName || 'Host'}
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                {event.title}
              </h1>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '20px 24px' }}>
            {/* Description */}
            {event.description && (
              <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5, marginBottom: 20 }}>
                {event.description}
              </p>
            )}

            {/* Event Logistics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ff407d', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  <Calendar size={13} />
                  <span>Date & Time</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                  {formattedDate}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 }}>
                  {formattedTime}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ffd700', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  <span>{dressCode.icon || '👔'}</span>
                  <span>Dress Code</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                  {dressCode.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 }}>
                  Look fabulous
                </div>
              </div>
            </div>

            {/* Layer 3: Secret Venue Box (Locked vs Unlocked) */}
            <div
              style={{
                borderRadius: 16,
                padding: '16px',
                marginBottom: 24,
                position: 'relative',
                overflow: 'hidden',
                background: isVenueUnlocked
                  ? 'linear-gradient(145deg, rgba(255, 215, 0, 0.12), rgba(16, 185, 129, 0.08))'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isVenueUnlocked
                  ? '1px solid rgba(255, 215, 0, 0.5)'
                  : '1px dashed rgba(255, 255, 255, 0.15)'
              }}
            >
              {!isVenueUnlocked ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: 'rgba(255, 64, 125, 0.15)',
                      border: '1px solid rgba(255, 64, 125, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff407d',
                      flexShrink: 0
                    }}
                  >
                    <Lock size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: '#ff407d' }}>
                      <span>SECRET VENUE LOCKED</span>
                      <span>🔒</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: 3 }}>
                      RSVP "Going" to instantly reveal the address, door access code & directions!
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 800, color: '#ffd700' }}>
                      <Sparkles size={14} />
                      <span>VENUE UNLOCKED — VIP ACCESS</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', background: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', padding: '2px 8px', borderRadius: 999, border: '1px solid rgba(255, 215, 0, 0.4)', fontWeight: 700 }}>
                      CONFIRMED GUEST
                    </span>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} color="#ff407d" />
                    <span>{unlockedLocation?.name || event.location?.name}</span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: 2, marginLeft: 22 }}>
                    {unlockedLocation?.address || event.location?.address}
                  </div>

                  {(unlockedLocation?.doorCode || event.location?.doorCode) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '8px 12px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: 8 }}>
                      <Key size={14} color="#ffd700" />
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>Gate / Entry Code:</span>
                      <span style={{ fontSize: '0.88rem', fontFamily: 'monospace', fontWeight: 800, color: '#ffd700' }}>
                        {unlockedLocation?.doorCode || event.location?.doorCode}
                      </span>
                    </div>
                  )}

                  <div style={{ marginTop: 12 }}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((unlockedLocation?.name || '') + ' ' + (unlockedLocation?.address || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Layer 4: Interactive RSVP Buttons */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>
                  Will you make it?
                </span>
                <span style={{ fontSize: '0.78rem', color: '#ff407d', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={13} />
                  <strong>{attendingCount}</strong> attending
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {/* YES BUTTON */}
                <button
                  type="button"
                  onClick={() => handleRsvpOptionClick('yes')}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 14,
                    border: selectedStatus === 'yes' ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: selectedStatus === 'yes' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{rsvpOptions.yes.emoji || '🍾'}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
                    {rsvpOptions.yes.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>
                    {selectedStatus === 'yes' ? '✓ Attending' : 'Going'}
                  </span>
                </button>

                {/* MAYBE BUTTON */}
                <button
                  type="button"
                  onClick={() => handleRsvpOptionClick('maybe')}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 14,
                    border: selectedStatus === 'maybe' ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: selectedStatus === 'maybe' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{rsvpOptions.maybe.emoji || '🍹'}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
                    {rsvpOptions.maybe.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#ffd700', fontWeight: 600 }}>
                    {selectedStatus === 'maybe' ? '✓ Tentative' : 'Maybe'}
                  </span>
                </button>

                {/* NO BUTTON */}
                <button
                  type="button"
                  onClick={() => handleRsvpOptionClick('no')}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 14,
                    border: selectedStatus === 'no' ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: selectedStatus === 'no' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{rsvpOptions.no.emoji || '😴'}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
                    {rsvpOptions.no.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 600 }}>
                    {selectedStatus === 'no' ? "✓ Can't Go" : 'Decline'}
                  </span>
                </button>
              </div>

              {selectedStatus === 'yes' && (
                <div
                  style={{
                    marginTop: 12,
                    padding: '10px 14px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
                    <CheckCircle2 size={16} />
                    <span>You're on the list, {myRsvp?.name || 'Friend'}!</span>
                  </div>
                  <button
                    onClick={downloadCalendarFile}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                  >
                    <Download size={12} />
                    <span>.ICS</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                onClick={downloadCalendarFile}
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '0.82rem', width: '100%' }}
              >
                <Download size={14} />
                <span>Add to Calendar</span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="btn-primary"
                style={{ padding: '10px', fontSize: '0.82rem', width: '100%' }}
              >
                <Share2 size={14} />
                <span>Share Invite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Social Guest Wall / Hype Board */}
        <div
          style={{
            marginTop: 28,
            borderRadius: 20,
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquare size={16} color="#ff407d" />
              <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#fff' }}>
                Blessings & Guest Notes
              </span>
            </div>
            <span style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              {comments.length} notes
            </span>
          </div>

          {/* Form to leave a note */}
          <form onSubmit={handlePostComment} style={{ marginBottom: 20 }}>
            {!myRsvp && (
              <input
                type="text"
                placeholder="Your Name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  marginBottom: 8
                }}
              />
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Leave a message or vibe check..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
              <button
                type="submit"
                disabled={isPostingComment}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.82rem', flexShrink: 0 }}
              >
                <Send size={14} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.82rem' }}>
                Be the first to leave love on the wall!
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c._id || Math.random()}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffd700' }}>
                      {c.authorName || 'Guest'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                      {new Date(c.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: 4 }}>
                    {c.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Guest Fast RSVP Modal (10 seconds, zero signup) */}
      {isRsvpModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(5, 7, 12, 0.85)',
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
              maxWidth: 420,
              padding: 24,
              borderRadius: 20,
              background: 'linear-gradient(150deg, #131726, #090c14)',
              border: '1px solid rgba(255, 64, 125, 0.3)'
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              Complete Your RSVP
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: 18 }}>
              No password needed! Just enter your name so the host knows you're coming.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitRsvpPayload(pendingStatus, guestName, guestContact, guestNote);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                  Phone or Email (for gate code updates) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. maya@gmail.com or +1 (555) 019-2831"
                  value={guestContact}
                  onChange={(e) => setGuestContact(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
                  Note to Host / Blessing (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Can't wait! Bringing vinyl records."
                  value={guestNote}
                  onChange={(e) => setGuestNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setIsRsvpModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px' }}
                >
                  {isSubmittingRsvp ? 'Submitting...' : 'Confirm RSVP ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal & WhatsApp/QR Sheet */}
      {isShareOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(5, 7, 12, 0.85)',
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
              maxWidth: 440,
              padding: 24,
              borderRadius: 20,
              background: 'linear-gradient(150deg, #131726, #090c14)',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Share2 size={18} color="#ffd700" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  Send Invitation
                </h3>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: 16 }}>
              Share this sensory link on any app. Guests RSVP in under 15 seconds without creating an account!
            </p>

            {/* QR Code */}
            {qrCodeUrl && (
              <div style={{ textAlign: 'center', padding: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 14, marginBottom: 16 }}>
                <img
                  src={qrCodeUrl}
                  alt="Invitation QR Code"
                  style={{ width: 140, height: 140, borderRadius: 10, margin: '0 auto', display: 'block' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: 6, display: 'block' }}>
                  Scan to RSVP instantly
                </span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={copyShareUrl}
                className="btn-primary"
                style={{ padding: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? '✓ Link Copied!' : 'Copy Shareable Link'}</span>
              </button>

              <a
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px',
                  width: '100%',
                  borderRadius: 12,
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
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
                onClick={downloadCalendarFile}
                className="btn-secondary"
                style={{ padding: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Download size={16} />
                <span>Download .ICS Calendar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
