import React, { useRef, useState } from 'react';

export default function SpotlightCard({
  children,
  className = '',
  enableTilt = true,
  maxTilt = 4, // subtle, elegant degrees
  ...props
}) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (enableTilt && window.innerWidth >= 1024) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setStyle({
        transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.005, 1.005, 1.005)`,
        transition: 'transform 0.1s ease-out'
      });
    }
  }

  function handleMouseLeave() {
    if (enableTilt) {
      setStyle({
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      });
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`spotlight-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
