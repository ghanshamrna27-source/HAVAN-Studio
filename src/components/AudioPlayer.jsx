import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function AudioPlayer({ frequencies = [138.59, 207.65, 277.18], label = 'Warm Ambient Chords' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const oscNodesRef = useRef([]);

  const toggleAudio = () => {
    if (!isPlaying) {
      startSynth();
    } else {
      stopSynth();
    }
  };

  const startSynth = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master Gain with smooth fade in
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 1.2);

      // Warm acoustic lowpass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);

      master.connect(filter);
      filter.connect(ctx.destination);
      masterGainRef.current = master;

      // Clear existing nodes
      oscNodesRef.current.forEach(node => {
        try { node.stop(); node.disconnect(); } catch (e) {}
      });
      oscNodesRef.current = [];

      // Create oscillators for the harmonic chord
      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle LFO for warm human vibrato / shimmer
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.8, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        osc.connect(master);
        osc.start();

        oscNodesRef.current.push(osc, lfo);
      });

      setIsPlaying(true);
    } catch (err) {
      console.error('Audio synthesizer error:', err);
    }
  };

  const stopSynth = () => {
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
      masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      setTimeout(() => {
        oscNodesRef.current.forEach(node => {
          try { node.stop(); node.disconnect(); } catch (e) {}
        });
        oscNodesRef.current = [];
        setIsPlaying(false);
      }, 850);
    } else {
      setIsPlaying(false);
    }
  };

  // Update frequencies if template changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopSynth();
      setTimeout(() => {
        startSynth();
      }, 900);
    }
    return () => {
      stopSynth();
    };
  }, [frequencies]);

  return (
    <button
      onClick={toggleAudio}
      className={`badge-pill ${isPlaying ? 'active' : ''}`}
      style={{
        cursor: 'pointer',
        border: isPlaying ? '1px solid var(--primary-glow)' : '1px solid var(--glass-border)',
        background: isPlaying ? 'rgba(255, 64, 125, 0.18)' : 'rgba(255, 255, 255, 0.06)',
        transition: 'all 0.25s ease'
      }}
      title={isPlaying ? 'Click to pause synthesized audio' : 'Click to preview live browser synthesizer'}
    >
      {isPlaying ? (
        <>
          <Volume2 size={15} color="var(--primary-glow)" />
          <span style={{ color: 'var(--primary-glow)', fontWeight: 600 }}>Audio Live</span>
          <div className="sound-waveform">
            <span className="sound-bar"></span>
            <span className="sound-bar"></span>
            <span className="sound-bar"></span>
            <span className="sound-bar"></span>
          </div>
        </>
      ) : (
        <>
          <VolumeX size={15} color="var(--text-secondary)" />
          <span>Sound Vibe: Synthesized Chords</span>
        </>
      )}
    </button>
  );
}
