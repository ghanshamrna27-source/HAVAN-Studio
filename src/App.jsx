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
import AuthModal from './components/AuthModal';
import CheckInviteModal from './components/CheckInviteModal';
import { api } from './services/api';

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
  
  // Selected category in navbar / playground
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Active template
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Check Invite Modal State
  const [isCheckInviteOpen, setIsCheckInviteOpen] = useState(false);

  useEffect(() => {
    // Check current session from API
    api.fetchMe().then(user => {
      if (user) setCurrentUser(user);
    });

    const handleLocationChange = () => {
      setInviteSlug(getSlugFromLocation());
      const makerState = getMakerStateFromLocation();
      setIsMakerOpen(makerState.isMaker);
      if (makerState.category) {
        setMakerCategory(makerState.category);
      }
      if (window.location.hash === '#check-invite') {
        setIsCheckInviteOpen(true);
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
    if (activeTemplate && activeTemplate.theme) {
      document.body.setAttribute('data-active-theme', activeTemplate.theme);
      document.body.setAttribute('data-theme', activeTemplate.theme);
    }
  }, [activeTemplate]);

  // When category changes from navbar or hero
  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    if (catId && catId !== 'all') {
      const match = TEMPLATES.find(t => t.category === catId);
      if (match) {
        setActiveTemplate(match);
      }
    }
  };

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

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    api.clearSession();
    setCurrentUser(null);
  };

  const handleSelectInviteFromCheck = (slug) => {
    setInviteSlug(slug);
    window.history.pushState(null, '', `#/invite/${slug}`);
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
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary, #07090e)', color: '#f8fafc' }}>
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

      {/* Partiful-Style Floating Capsule Navbar with Check Invite & Auth */}
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenMaker={handleOpenMaker}
        activeThemeObj={activeThemeObj}
        currentFrequencies={activeTemplate.soundFreqs}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenCheckInvite={() => setIsCheckInviteOpen(true)}
        onLogout={handleLogout}
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
        activeCategory={activeCategory}
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

      {/* Authentication Modal: Log In & Register */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        initialMode={authModalMode}
      />

      {/* Check Invite Modal: Lookup, Accepted RSVPs & Hosted Invites */}
      <CheckInviteModal
        isOpen={isCheckInviteOpen}
        onClose={() => setIsCheckInviteOpen(false)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSelectInvite={handleSelectInviteFromCheck}
      />

      {/* Rich Footer */}
      <Footer
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenMaker={handleOpenMaker}
      />
    </div>
  );
}
