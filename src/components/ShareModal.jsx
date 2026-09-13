import React, { useState } from 'react';
import { X, Calendar, Share2, Copy, Check, ExternalLink } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, eventData }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const downloadCalendarFile = () => {
    const startDate = '20261018T200000Z';
    const endDate = '20261019T030000Z';

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AfterhoursStudio//HousePartyInvitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${eventData.title}`,
      `DESCRIPTION:${(eventData.subtitle + '\\n' + eventData.description).replace(/\n/g, '\\n')}`,
      `LOCATION:${eventData.venue} (${eventData.address})`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${eventData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(eventData.title);
    const details = encodeURIComponent(`${eventData.subtitle}\n\n${eventData.description}\nHost: ${eventData.host}`);
    const location = encodeURIComponent(`${eventData.venue}, ${eventData.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261018T200000Z/20261019T030000Z`;
  };

  const inviteSnippet = `🎉 YOU'RE INVITED: ${eventData.title}
✨ ${eventData.subtitle}
🗓️ ${eventData.date} • ${eventData.time}
📍 ${eventData.venue}
👔 Dress Code: ${eventData.dressCodeNote || 'Casual Chic'}
🍾 BYOB & Snacks: ${eventData.byobNote || 'Bring your favorite drinks'}

RSVP & get secret door entry code here:
${window.location.href}`;

  const copyInviteText = () => {
    navigator.clipboard.writeText(inviteSnippet);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        padding: '24px',
        position: 'relative'
      }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: 32,
            height: 32,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff' }}>
          Add to Calendar & Share
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Save the date so you don't miss the party of the season!
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
          <button
            type="button"
            onClick={downloadCalendarFile}
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '10px 14px' }}
          >
            <Calendar size={15} />
            <span>Download .ICS</span>
          </button>

          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '10px 14px', textDecoration: 'none' }}
          >
            <span>Google Cal</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--glass-border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Ready-to-Send WhatsApp / SMS Invite:
            </span>
            <button
              type="button"
              onClick={copyInviteText}
              style={{
                background: 'transparent',
                border: 'none',
                color: copiedText ? '#10B981' : 'var(--text-accent)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {copiedText ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid var(--glass-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: '0.76rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {inviteSnippet}
          </div>
        </div>

        <button
          type="button"
          onClick={copyUrl}
          className="btn-secondary"
          style={{ width: '100%', marginTop: 16 }}
        >
          {copiedLink ? <Check size={16} color="#10B981" /> : <Share2 size={16} />}
          <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Webpage Link'}</span>
        </button>
      </div>
    </div>
  );
}
