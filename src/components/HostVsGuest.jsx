import React from 'react';
import { Check, X, ShieldAlert, Sparkles, UserCheck, Heart } from 'lucide-react';
import { COMPARISON_POINTS } from '../data/templates';

export default function HostVsGuest() {
  return (
    <section className="section-wrapper">
      <div className="page-container">
        {/* Header */}
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <UserCheck size={14} color="var(--primary-glow)" />
            <span>Why Hosts & Guests Love Us</span>
          </div>
          <h2 className="section-title">
            The Difference Between <span className="text-gradient">“Maybe” and “I’m There!”</span>
          </h2>
          <p className="section-subtitle">
            See how the interactive gathering platform transforms the entire RSVP lifecycle compared to outdated invitation methods.
          </p>
        </div>

        {/* Comparison Table */}
        <div
          className="glass-panel"
          style={{
            padding: '32px',
            overflowX: 'auto',
            borderRadius: '24px'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <th style={{ textAlign: 'left', padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Feature Experience
                </th>
                <th style={{ textAlign: 'left', padding: '16px 20px', color: '#94a3b8', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Traditional Forms / PDFs / DMs
                </th>
                <th style={{ textAlign: 'left', padding: '16px 20px', color: 'var(--primary-glow)', fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
                  ✨ HAVAN Studio
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_POINTS.map((pt, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '20px', fontWeight: 700, color: '#f8fafc', fontSize: '0.96rem' }}>
                    {pt.feature}
                  </td>
                  <td style={{ padding: '20px', color: '#94a3b8', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <X size={16} color="#ef4444" />
                      <span>{pt.traditional}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px', color: '#ffffff', fontSize: '0.94rem', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={16} color="#10b981" />
                      <span>{pt.partiful}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
