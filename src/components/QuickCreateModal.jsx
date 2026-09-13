import React, { useState } from 'react';
import { X, Sparkles, Check, Share2, Download, ExternalLink, Calendar, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuickCreateModal({ isOpen, onClose, templates, initialTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate || templates[0]);
  const [title, setTitle] = useState(initialTemplate ? initialTemplate.title : 'My Epic Gathering');
  const [host, setHost] = useState(initialTemplate ? initialTemplate.host : 'Alex & Friends');
  const [date, setDate] = useState('Saturday, Dec 12');
  const [venue, setVenue] = useState('Secret Rooftop Lounge');
  const [doorCode, setDoorCode] = useState('Ring #302 or text host');
  const [rsvpYes, setRsvpYes] = useState('Hell Yeah, Going!');
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);
  const [shareLink, setShareLink] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        hostName: host.trim(),
        description: selectedTemplate.description || 'You are invited to an unforgettable sensory gathering.',
        dateTime: {
          startTime: new Date(Date.now() + 86400000 * 4).toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: {
          name: venue || 'Secret Venue',
          address: venue ? `${venue}, City Center` : 'Secret Address',
          doorCode: doorCode || 'CODE: #9042',
          hideUntilRsvp: true
        },
        theme: {
          presetId: selectedTemplate.theme,
          posterUrl: selectedTemplate.image
        },
        customization: {
          seal: {
            id: selectedTemplate.id,
            name: selectedTemplate.badge,
            icon: selectedTemplate.badgeEmoji || '✨'
          },
          dressCode: {
            id: 'dress-code-1',
            title: selectedTemplate.dressCode || 'Dress To Impress',
            desc: 'Look sharp and vibrant',
            icon: '👔'
          },
          rsvpOptions: {
            yes: { emoji: selectedTemplate.rsvpPreset?.yes?.emoji || '🍾', title: rsvpYes || selectedTemplate.rsvpPreset?.yes?.title || "Hell Yeah, I'm In!", sub: selectedTemplate.rsvpPreset?.yes?.sub || 'Going' },
            maybe: { emoji: selectedTemplate.rsvpPreset?.maybe?.emoji || '🍹', title: selectedTemplate.rsvpPreset?.maybe?.title || 'Might Slide Through', sub: selectedTemplate.rsvpPreset?.maybe?.sub || 'Maybe' },
            no: { emoji: selectedTemplate.rsvpPreset?.no?.emoji || '😴', title: selectedTemplate.rsvpPreset?.no?.title || 'FOMO Sleeping In', sub: selectedTemplate.rsvpPreset?.no?.sub || "Can't Go" }
          },
          soundFreqs: selectedTemplate.soundFreqs || [138.59, 207.65, 277.18],
          effect: 'stardust',
          vibeTag: selectedTemplate.vibeTag || 'House Party',
          coverImage: selectedTemplate.image
        }
      };

      const res = await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create event');
      }

      const ev = data.data;
      setCreatedEvent(ev);

      if (data.token) localStorage.setItem('fiesta_token', data.token);
      if (data.hostKey) localStorage.setItem(`fiesta_host_key_${ev.slug}`, data.hostKey);

      const liveUrl = `${window.location.origin}/invite/${ev.slug}`;
      setShareLink(liveUrl);

      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 }
      });
      setIsGenerated(true);
    } catch (err) {
      alert(err.message || 'Error creating event on backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    const urlToCopy = shareLink || `${window.location.origin}/invite/${createdEvent?.slug || selectedTemplate.id}`;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const openLiveInvite = () => {
    if (createdEvent?.slug) {
      window.location.href = `/invite/${createdEvent.slug}`;
    }
  };

  const downloadCalendarFile = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HAVAN//Event Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:Created with HAVAN Studio. Host: ${host}`,
      `LOCATION:${venue}`,
      'DTSTART:20261212T200000Z',
      'DTEND:20261213T020000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '24px',
          position: 'relative',
          background: 'linear-gradient(150deg, #131726, #090c14)',
          border: '1px solid var(--glass-border-highlight)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {!isGenerated ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="var(--primary-glow)" />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                Create Your Digital Invite
              </h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Quickly draft a sensory invite with custom cover art, locked venue, and custom reply tags.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Template Choice */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
                  1. Choose Artwork Archetype:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                  {templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        setTitle(tpl.title);
                        setHost(tpl.host);
                        setVenue(tpl.venue);
                        setRsvpYes(tpl.rsvpPreset.yes.title);
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        border: selectedTemplate.id === tpl.id ? '2px solid var(--primary-glow)' : '1px solid var(--glass-border)',
                        background: selectedTemplate.id === tpl.id ? 'rgba(255, 64, 125, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        textAlign: 'center'
                      }}
                    >
                      <img
                        src={tpl.image}
                        alt={tpl.title}
                        style={{ width: '100%', height: '55px', objectFit: 'cover', borderRadius: '8px', marginBottom: '4px' }}
                      />
                      <div style={{ fontSize: '0.74rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tpl.badgeEmoji} {tpl.vibeTag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Host */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--glass-border)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                    Host Name
                  </label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--glass-border)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Date & Secret Venue */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--glass-border)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                    Secret Venue (Locked)
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--glass-border)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Custom RSVP Label */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
                  Custom RSVP "Yes" Button Copy
                </label>
                <input
                  type="text"
                  value={rsvpYes}
                  onChange={(e) => setRsvpYes(e.target.value)}
                  placeholder="e.g. Hell Yeah! or Aana Hi Hai"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '10px', padding: '14px' }}
              >
                <Sparkles size={18} />
                <span>Generate Live Sensory Invite</span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Check size={32} color="#10b981" />
            </div>

            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Your Invite is Ready!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginBottom: '24px' }}>
              We prepared the sensory experience with locked venue, custom confetti burst, and calendar sync.
            </p>

            {/* Preview Card Mini */}
            <div
              className="glass-panel"
              style={{
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left',
                border: '1px solid var(--primary-glow)',
                background: 'rgba(0, 0, 0, 0.35)'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img
                  src={selectedTemplate.image}
                  alt={title}
                  style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{title}</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Host: {host} • {date}</div>
                  <div style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '4px' }}>
                    🔒 Secret Venue: {venue} (Protected)
                  </div>
                </div>
              </div>
            </div>

            {/* Link Input Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                readOnly
                value={shareLink || `${window.location.origin}/invite/${createdEvent?.slug || ''}`}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffd700',
                  fontSize: '0.84rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={copyShareLink}
                className="btn-secondary"
                style={{ padding: '0 16px', fontSize: '0.84rem', flexShrink: 0 }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={openLiveInvite}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #ff407d, #9333ea)', fontSize: '0.92rem' }}
              >
                <ExternalLink size={18} />
                <span>Open Live Invitation Now ✨</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🎉 YOU'RE INVITED: ${title}\n🗓️ ${date}\n📍 Secret Venue (RSVP to reveal)\n\nRSVP & get secret door entry code here:\n${shareLink || window.location.origin}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <span>💬 Send via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={downloadCalendarFile}
                className="btn-secondary"
                style={{ width: '100%', padding: '12px' }}
              >
                <Download size={18} />
                <span>Download .ics Calendar File</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGenerated(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  marginTop: '4px'
                }}
              >
                ← Create another invite or edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
