import React from 'react';
import { Image, Lock, Send, Sparkles, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Choose Artwork & Vibe',
      subtitle: 'Set an unmistakable visual tone',
      description: 'Pick from curated psychedelic, vintage, cubist, or heritage event art—or upload your own event poster. Watch the background auras adapt in real time.',
      icon: <Image size={24} color="#ff407d" />
    },
    {
      number: '02',
      title: 'Configure Secrets & Witty RSVPs',
      subtitle: 'Lock the venue & personalize replies',
      description: 'Hide your loft code or villa address behind confirmed attendance. Replace generic "Yes/No" with emojis and playful party slang your crowd loves.',
      icon: <Lock size={24} color="#ffd700" />
    },
    {
      number: '03',
      title: 'Drop The Link Anywhere',
      subtitle: 'Zero app friction, 94%+ turnout',
      description: 'Share on WhatsApp groups, Instagram stories, or iMessage. Friends tap once, experience live sound, RSVP in 5 seconds, and get auto calendar reminders.',
      icon: <Send size={24} color="#06b6d4" />
    }
  ];

  return (
    <section id="how-it-works" className="section-wrapper" style={{ background: 'rgba(7, 10, 16, 0.6)' }}>
      <div className="page-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="var(--accent-glow)" />
            <span>Effortless Flow</span>
          </div>
          <h2 className="section-title">
            From Zero to Viral Link in <span className="text-gradient">3 Minutes</span>
          </h2>
          <p className="section-subtitle">
            No design degrees. No tedious web forms. Just pick your artwork, lock your venue, and send.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              className="glass-panel"
              style={{
                padding: '36px 28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Step Number Tag */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 900,
                      color: 'rgba(255, 255, 255, 0.12)',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-glow)', fontWeight: 600, marginBottom: '14px' }}>
                  {step.subtitle}
                </div>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#10b981' }}>
                <CheckCircle size={15} />
                <span>Instant automated flow</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
