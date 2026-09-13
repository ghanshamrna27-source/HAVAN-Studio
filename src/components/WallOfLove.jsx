import React from 'react';
import { Sparkles, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/templates';

export default function WallOfLove() {
  return (
    <section id="wall-of-love" className="section-wrapper" style={{ background: 'rgba(9, 12, 19, 0.4)' }}>
      <div className="page-container">
        {/* Header */}
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="var(--accent-glow)" />
            <span>Community Wall of Love</span>
          </div>
          <h2 className="section-title">
            Loved By 10,000+ Gatherings Worldwide
          </h2>
          <p className="section-subtitle">
            From underground rooftop DJ sessions to sacred ghazal baithaks, see what creators and hosts say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}
        >
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '20px'
              }}
            >
              <div>
                {/* 5 Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                  ))}
                </div>

                <p style={{ fontSize: '1.02rem', color: '#f1f5f9', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                  {item.text}
                </p>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}
                >
                  {item.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.96rem' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {item.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
