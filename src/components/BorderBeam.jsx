import React from 'react';

export default function BorderBeam({
  className = '',
  size = 200,
  duration = 12,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#FF1493',
  colorTo = '#00F0FF',
  delay = 0
}) {
  return (
    <div
      style={{
        '--size': `${size}px`,
        '--duration': `${duration}s`,
        '--anchor': `${anchor}%`,
        '--border-width': `${borderWidth}px`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--delay': `-${delay}s`
      }}
      className={`border-beam ${className}`}
    />
  );
}
