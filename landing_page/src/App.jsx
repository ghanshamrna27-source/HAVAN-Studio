import React, { useState, useEffect } from 'react';
import { TEMPLATES, THEME_PALETTES } from './data/templates';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TemplatePlayground from './components/TemplatePlayground';
import FiveLayersShowcase from './components/FiveLayersShowcase';
import HowItWorks from './components/HowItWorks';
import HostVsGuest from './components/HostVsGuest';
import WallOfLove from './components/WallOfLove';
import QuickCreateModal from './components/QuickCreateModal';
import Footer from './components/Footer';
import CanvasParticles from './components/CanvasParticles';
import LiveInviteView from './components/LiveInviteView';
import InvitationCardMaker from './components/InvitationCardMaker';

function getSlugFromLocation() {
  const path = window.location.pathname;
  const match = path.match(/^\/(?:invite|e)\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  const params = new URLSearchParams(window.location.search);
  const querySlug = params.get('invite') || params.get('e');
  if (querySlug) return querySlug;

  const hash = window.location.hash;
  const hashMatch = hash.match(/^#(?:\/)?(?:invite|e)\/([a-zA-Z0-9_-]+)/);
  if (hashMatch && hashMatch[1]) return hashMatch[1];

  return null;
}

function getMakerStateFromLocation() {
  const hash = window.location.hash;
  const isMaker = hash.startsWith('#maker') || hash.startsWith('#/maker');
  let category = 'all';
  const catMatch = hash.match(/[?&]category=([a-zA-Z0-9_-]+)/);
  if (catMatch) {
    category = catMatch[1];
  } else {
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) category = params.get('category');
  }
  return { isMaker, category };
}

export default function App() {
  const [inviteSlug, setInviteSlug] = useState(getSlugFromLocation);
  const initialMakerState = getMakerStateFromLocation();
  const [isMakerOpen, setIsMakerOpen] = useState(initialMakerState.isMaker);
  const [makerCategory, setMakerCategory] = useState(initialMakerState.category || 'all');
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      setInviteSlug(getSlugFromLocation());
      const makerState = getMakerStateFromLocation();
      setIsMakerOpen(makerState.isMaker);
      if (makerState.category) {
        setMakerCategory(makerState.category);
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Sync active theme with document body
  useEffect(() => {
    document.body.setAttribute('data-active-theme', activeTemplate.theme);
  }, [activeTemplate.theme]);

  const handleOpenMaker = (category = 'all') => {
    setMakerCategory(category);
    setIsMakerOpen(true);
    window.history.pushState(null, '', `#/maker?category=${category}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseMaker = () => {
    setIsMakerOpen(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  // If viewing an invite, render LiveInviteView
  if (inviteSlug) {
    return (
      <LiveInviteView
        slug={inviteSlug}
        onBackToStudio={() => {
          window.history.pushState(null, '', '/');
          setInviteSlug(null);
        }}
      />
    );
  }

  // If viewing the invitation card maker studio, render InvitationCardMaker
  if (isMakerOpen) {
    return (
      <InvitationCardMaker
        initialCategory={makerCategory}
        onBack={handleCloseMaker}
      />
    );
  }

  const activeThemeObj = THEME_PALETTES.find(t => t.id === activeTemplate.theme) || THEME_PALETTES[0];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Dynamic Ambient Background Orbs */}
      <div className="ambient-backdrop">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      {/* 60fps Canvas Particle Layer */}
      <CanvasParticles
        effectType="stardust"
        particleColor={activeThemeObj.primary}
      />

      {/* Sticky Glassmorphic Navbar */}
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenMaker={handleOpenMaker}
        activeThemeObj={activeThemeObj}
        currentFrequencies={activeTemplate.soundFreqs}
      />

      {/* Hero Section with Live 3D Spotlight Card */}
      <HeroSection
        templates={TEMPLATES}
        activeTemplate={activeTemplate}
        onSelectTemplate={setActiveTemplate}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenMaker={handleOpenMaker}
      />

      {/* The 5-Layer Architectural Blueprint Showcase */}
      <FiveLayersShowcase
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Live Curated Event Archetypes & Template Playground */}
      <TemplatePlayground
        templates={TEMPLATES}
        activeTemplate={activeTemplate}
        onSelectTemplate={setActiveTemplate}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenMaker={handleOpenMaker}
      />

      {/* 3-Step Interactive Workflow */}
      <HowItWorks />

      {/* Host vs Guest Comparison Table */}
      <HostVsGuest />

      {/* Wall of Love & Testimonials */}
      <WallOfLove />

      {/* Interactive Quick-Create Invite Modal */}
      <QuickCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        templates={TEMPLATES}
        initialTemplate={activeTemplate}
      />

      {/* Rich Footer */}
      <Footer
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenMaker={handleOpenMaker}
      />
    </div>
  );
}
