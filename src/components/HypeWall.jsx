import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, UserCheck } from 'lucide-react';

export default function HypeWall({ guests, onAddGuestMessage }) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddGuestMessage({
      name: authorName.trim() || 'Party VIP',
      avatar: ['🔥', '✨', '🪩', '⚡', '🍸', '🍕', '🎧'][Math.floor(Math.random() * 7)],
      status: 'Going',
      message: commentText.trim(),
      time: 'Just now'
    });

    setCommentText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>
          <MessageSquare size={16} color="var(--accent-primary)" />
          <span>Party Hype Wall</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {guests.length} comments
        </span>
      </div>

      <div className="hype-wall-container" style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
        {guests.map((g) => (
          <div key={g.id} className="hype-item">
            <div className="guest-avatar-bubble">{g.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                  {g.name}
                </span>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                  {g.time}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {g.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <input
          type="text"
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="input-field"
          style={{ width: '110px', fontSize: '0.78rem', padding: '8px 10px' }}
        />
        <input
          type="text"
          placeholder="Drop a hype note (e.g. Bringing ice & snacks!)..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="input-field"
          style={{ flex: 1, fontSize: '0.78rem', padding: '8px 12px' }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '8px 12px', fontSize: '0.78rem' }}
          title="Post note"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
