import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Music, Shield, Sliders } from 'lucide-react';
import InteractiveCard from './InteractiveCard';

export default function TemplatePlayground({
  templates,
  activeTemplate,
  onSelectTemplate,
  onOpenCreateModal,
  onOpenMaker
}) {
  const [filter, setFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Gatherings' },
    { id: 'mehfil', label: '🪔 Mehfil' },
    { id: 'happyhours', label: '🍹 Happy Hours' },
    { id: 'wedding', label: '💍 Wedding' },
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'House Party', label: '🪩 House Party' }
  ];

  const filteredTemplates = filter === 'all'
    ? templates
    : templates.filter(t => t.category === filter || t.vibeTag === filter);

  return (
    <section id="templates" className="section-wrapper" style={{ background: 'rgba(10, 13, 20, 0.5)' }}>
      <div className="page-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} color="var(--accent-glow)" />
            <span>Curated Event Archetypes</span>
          </div>
          <h2 className="section-title">
            Crafted For Every Kind of Gathering
          </h2>
          <p className="section-subtitle">
            Whether you’re throwing an intimate living-room jam, an underground DJ warehouse rave, or a soulful midnight poetry mehfil—start with an artwork that sets the tone.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`badge-pill ${filter === cat.id ? 'active' : ''}`}
                style={{
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  padding: '8px 18px',
                  border: filter === cat.id ? '1px solid var(--primary-glow)' : '1px solid var(--glass-border)',
                  background: filter === cat.id ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.05)',
                  color: filter === cat.id ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '32px'
          }}
        >
          {filteredTemplates.map((template) => {
            const isSelected = activeTemplate.id === template.id;
            return (
              <div
                key={template.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isSelected ? '2px solid var(--primary-glow)' : '1px solid var(--glass-border)',
                  boxShadow: isSelected ? '0 12px 35px rgba(255, 64, 125, 0.25)' : 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                {/* Active Indicator Ribbon */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'var(--primary-glow)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      zIndex: 3
                    }}
                  >
                    CURRENT HERO VIBE
                  </div>
                )}

                {/* Embedded Live Interactive Card */}
                <InteractiveCard template={template} isFeatured={false} />

                {/* Template Specs & Action Bar */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      Wax Seal: <strong style={{ color: '#fff' }}>{template.badge}</strong>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      RSVP Preset: <strong style={{ color: 'var(--accent-glow)' }}>{template.rsvpPreset.yes.title}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      onClick={() => onSelectTemplate(template)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        color: '#fff',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isSelected ? '✓ Active in Hero' : 'Preview in Hero'}
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenMaker) {
                          onOpenMaker(template.category || 'all');
                        } else {
                          onSelectTemplate(template);
                          onOpenCreateModal();
                        }
                      }}
                      className="btn-primary"
                      style={{
                        padding: '10px 14px',
                        fontSize: '0.84rem',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #ffd700, #ff407d)',
                        color: '#000',
                        fontWeight: 700
                      }}
                    >
                      <span>Customize ✨</span>
                      <ArrowRight size={14} color="#000" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
