import React, { useState, useEffect } from 'react';

export default function FloatingReactions({ triggerReaction }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!triggerReaction) return;

    const id = Date.now() + Math.random();
    const newParticle = {
      id,
      emoji: triggerReaction.emoji,
      left: Math.random() * 60 + 20, // percentage
      rotation: (Math.random() - 0.5) * 45
    };

    setParticles((prev) => [...prev.slice(-15), newParticle]);

    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1800);

    return () => clearTimeout(timer);
  }, [triggerReaction]);

  return (
    <div className="floating-reactions-overlay" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-reaction-item"
          style={{
            left: `${p.left}%`,
            transform: `rotate(${p.rotation}deg)`
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
