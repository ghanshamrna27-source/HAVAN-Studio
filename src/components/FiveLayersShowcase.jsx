import React, { useState } from 'react';
import { Sparkles, Layers, Sliders, MessageSquare, PartyPopper, Volume2, ArrowRight } from 'lucide-react';
import { FIVE_LAYERS } from '../data/templates';

export default function FiveLayersShowcase({ onOpenCreateModal }) {
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  const iconMap = {
    Sparkles: <Sparkles size={24} color="#ff407d" />,
    Layout: <Layers size={24} color="#3b82f6" />,
    MessageSquareHeart: <MessageSquare size={24} color="#f59e0b" />,
    PartyPopper: <PartyPopper size={24} color="#10b981" />,
    Volume2: <Volume2 size={24} color="#a855f7" />
  };

  return (
    <section id="five-layers" className="section-wrapper">
      <div className="page-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <Layers size={14} color="var(--primary-glow)" />
            <span>The 5-Layer Blueprint</span>
          </div>
          <h2 className="section-title">
            The Science Behind The <span className="text-gradient">Viral RSVP Rate</span>
          </h2>
          <p className="section-subtitle">
            Most event invitations are forgotten in minutes. Every HAVAN invitation is engineered across five sensory and psychological layers to evoke FOMO, excitement, and instant confirmation.
          </p>
        </div>

        {/* Interactive Layers Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          {/* Left: Interactive Layer Navigation Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FIVE_LAYERS.map((layer, index) => {
              const isActive = activeLayerIndex === index;
              return (
                <div
                  key={layer.number}
                  onClick={() => setActiveLayerIndex(index)}
                  className="glass-panel"
                  style={{
                    padding: '20px 24px',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    border: isActive ? '1px solid var(--primary-glow)' : '1px solid var(--glass-border)',
                    background: isActive ? 'rgba(255, 64, 125, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    boxShadow: isActive ? '0 8px 30px rgba(255, 64, 125, 0.2)' : 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '18px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {iconMap[layer.icon]}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-glow)', letterSpacing: '0.08em' }}>
                        LAYER {layer.number}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.12rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                      {layer.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {layer.tagline}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Layer Visualizer Card */}
          <div
            className="glass-panel"
            style={{
              padding: '36px',
              borderRadius: '24px',
              border: '1px solid var(--glass-border-highlight)',
              background: 'linear-gradient(145deg, rgba(20, 24, 38, 0.95), rgba(11, 14, 23, 0.95))',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div className="badge-pill active">
                <Sparkles size={14} color="var(--primary-glow)" />
                <span>Layer {FIVE_LAYERS[activeLayerIndex].number} Deep Dive</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Blueprint Anatomy
              </span>
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '14px', letterSpacing: '-0.01em' }}>
              {FIVE_LAYERS[activeLayerIndex].name}
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '28px' }}>
              {FIVE_LAYERS[activeLayerIndex].description}
            </p>

            {/* Interactive Feature Visual Callout */}
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '28px'
              }}
            >
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-glow)', fontWeight: 700, marginBottom: '8px' }}>
                Technical Execution:
              </div>
              <div style={{ fontSize: '0.94rem', color: '#e2e8f0', fontWeight: 500 }}>
                💡 {FIVE_LAYERS[activeLayerIndex].visualPreview}
              </div>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <span>Build an Invite with This Layer Stack</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
