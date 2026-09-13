import React from 'react';

export default function Marquee({
  children,
  className = '',
  reverse = false,
  pauseOnHover = true,
  speed = 28
}) {
  return (
    <div
      className={`marquee-container ${className}`}
      style={{
        '--speed': `${speed}s`,
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'
      }}
    >
      <div
        className={`marquee-track ${reverse ? 'reverse' : ''} ${pauseOnHover ? 'pause-hover' : ''}`}
      >
        <div className="marquee-content">{children}</div>
        <div className="marquee-content" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
