export const CATEGORIES = [
  { id: 'all', label: 'All Experiences', emoji: '✨' },
  { id: 'mehfil', label: 'Mehfil', emoji: '🪔', desc: 'Sufi, Ghazal, Classical Baithak & Poetry' },
  { id: 'happyhours', label: 'Happy Hours', emoji: '🍹', desc: 'Retro Disco, House Jam, Rooftop Lounge & Rave' },
  { id: 'wedding', label: 'Wedding', emoji: '💍', desc: 'Shaadi, Sangeet Night, Mehendi & Haldi Gala' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂', desc: 'Neon Midnight Bash, Milestone Soirée & Club Night' }
];

export const WAX_SEALS = [
  { id: 'seal-peacock', name: 'Mor Pankh (Peacock)', icon: '🦚', category: 'mehfil' },
  { id: 'seal-lotus', name: 'Kamal (Lotus Crest)', icon: '🪷', category: 'mehfil' },
  { id: 'seal-diya', name: 'Noor Diya (Sacred Flame)', icon: '🪔', category: 'mehfil' },
  { id: 'seal-disco', name: 'Disco Mirrorball', icon: '🪩', category: 'happyhours' },
  { id: 'seal-martini', name: 'Champagne Flute', icon: '🍸', category: 'happyhours' },
  { id: 'seal-vinyl', name: 'Vinyl Record', icon: '🎵', category: 'happyhours' },
  { id: 'seal-elephant', name: 'Gajraj (Royal Elephant)', icon: '🐘', category: 'wedding' },
  { id: 'seal-rings', name: 'Bandhan Monogram', icon: '💍', category: 'wedding' },
  { id: 'seal-rose', name: 'Gulab Flower', icon: '🌹', category: 'wedding' },
  { id: 'seal-crown', name: 'Celebration Crown', icon: '👑', category: 'birthday' },
  { id: 'seal-bolt', name: 'Electric Bolt', icon: '⚡', category: 'birthday' },
  { id: 'seal-cake', name: 'Birthday Confection', icon: '🎂', category: 'birthday' }
];

export const FRAMING_BORDERS = [
  { id: 'border-gold-zari', name: 'Gold Zari Lace', cssClass: 'frame-gold-zari' },
  { id: 'border-mughal', name: 'Mughal Jali Arch', cssClass: 'frame-mughal' },
  { id: 'border-cyber', name: 'Cyber Neon Rim', cssClass: 'frame-cyber' },
  { id: 'border-glass', name: 'Minimal Frosted Glass', cssClass: 'frame-glass' }
];

export const DRESS_CODES = [
  { id: 'raw-silk', title: 'Raw Silk, Kurta & Bohemia', icon: '👘', category: 'mehfil' },
  { id: 'retro-flare', title: 'Retro 70s Flare & Glitter', icon: '🕺', category: 'happyhours' },
  { id: 'cocktail-chic', title: 'Chic Cocktail & Editorial', icon: '🍸', category: 'happyhours' },
  { id: 'royal-shaadi', title: 'Regal Velvet & Zari Sherwani', icon: '👑', category: 'wedding' },
  { id: 'pastel-ethnic', title: 'Pastel Chiffon & Linen', icon: '🌸', category: 'wedding' },
  { id: 'neon-casual', title: 'Cyber Chic & Sneakers', icon: '👟', category: 'birthday' },
  { id: 'black-tie', title: 'Black Tie & Golden Hour', icon: '👔', category: 'birthday' }
];

export const TEMPLATES = [
  // MEHFIL
  {
    id: 'simla-beat-mehfil',
    category: 'mehfil',
    title: 'Simla Beat Psychedelic Baithak',
    subtitle: 'Vintage rock, poetry & midnight chai vibrations',
    host: 'Kabir & The Collective',
    date: 'Friday, Oct 24',
    time: '9:00 PM — 3:00 AM',
    venue: 'Terrace Garden Baithak, Sector 7',
    doorCode: 'Follow the fairy lights to the roof',
    vibeTag: 'Cultural Mehfil',
    image: '/media/img4.jpeg',
    theme: 'theme-mystic-sufi',
    badge: '🦚 Peacock Crest',
    badgeEmoji: '🦚',
    dressCode: 'Raw Silk, Kurta & Bohemia',
    spotifyLink: 'https://open.spotify.com/playlist/indian-retro-psychedelia',
    rsvpPreset: {
      yes: { emoji: '✨', title: 'Aana Hi Hai', sub: 'Soul is there' },
      maybe: { emoji: '🫖', title: 'Dil Chahta Hai', sub: 'Trying hard' },
      no: { emoji: '🕊️', title: 'Duaon Mein', sub: 'In spirit only' }
    },
    guestCount: 29,
    soundFreqs: [138.59, 207.65, 277.18], // C# Tanpura drone
    description: 'An acoustic and psychedelic fusion gathering. Live sitar, poetry recitations under the open stars, Kashmiri kahwa, and Simla 71 vintage record spins.'
  },
  {
    id: 'sufi-qawwali-night',
    category: 'mehfil',
    title: 'Chishtia Sufi & Qawwali Night',
    subtitle: 'Candlelit courtyards, ecstatic poetry & mystic chants',
    host: 'Hazrat Khusro Foundation',
    date: 'Thursday, Nov 12',
    time: '7:30 PM — Midnight',
    venue: 'The Red Sandstone Haveli Courtyard',
    doorCode: 'Knock 3 times at Brass Gate #1',
    vibeTag: 'Sufi Mehfil',
    image: '/media/img5.jpeg',
    theme: 'theme-royal-marigold',
    badge: '🪷 Golden Lotus',
    badgeEmoji: '🪷',
    dressCode: 'Raw Silk, Kurta & Bohemia',
    spotifyLink: 'https://open.spotify.com',
    rsvpPreset: {
      yes: { emoji: '🪔', title: 'Hazir Hain', sub: 'Confirmed Attending' },
      maybe: { emoji: '🌸', title: 'Koshish Karenge', sub: 'Tentative' },
      no: { emoji: '🙏', title: 'Shubhkamnayein', sub: 'With you in spirit' }
    },
    guestCount: 48,
    soundFreqs: [146.83, 220.00, 293.66], // D Tanpura
    description: 'An evening honoring Amir Khusro and Bulleh Shah. Live harmonium, dholak, and communal saffron tea under strings of marigolds.'
  },

  // HAPPY HOURS
  {
    id: 'disco-house-party',
    category: 'happyhours',
    title: 'Groovy Retro House Jam',
    subtitle: 'Vinyl records, disco lights & late night energy',
    host: 'Aarav & Maya',
    date: 'Saturday, Nov 14',
    time: '8:30 PM till sunrise',
    venue: 'Secret Loft, 4th Floor',
    doorCode: 'Dial #402 at front gate',
    vibeTag: 'Happy Hours',
    image: '/media/img3.jpeg',
    theme: 'theme-retro-disco',
    badge: '🪩 Disco Seal',
    badgeEmoji: '🪩',
    dressCode: 'Retro 70s Flare & Glitter',
    spotifyLink: 'https://open.spotify.com/playlist/disco-fever',
    rsvpPreset: {
      yes: { emoji: '🍾', title: 'Hell Yeah!', sub: 'Count me in' },
      maybe: { emoji: '🍹', title: 'Pulling Up Late', sub: 'Tentative' },
      no: { emoji: '😴', title: 'FOMO Sleeping', sub: "Can't make it" }
    },
    guestCount: 38,
    soundFreqs: [130.81, 164.81, 196.00], // C major house chord
    description: 'We are clearing out the living room for a full vinyl DJ set, punch bowls, and 70s strobe lights. BYOB encouraged, good vibes mandatory.'
  },
  {
    id: 'cocktail-cubist-soiree',
    category: 'happyhours',
    title: 'Contemporary Salon & Cocktails',
    subtitle: 'Art, conversation & crafted mixology',
    host: 'Tara & Rohan',
    date: 'Saturday, Dec 5',
    time: '7:00 PM — Midnight',
    venue: 'The Atrium Penthouse',
    doorCode: 'Keypad Code: 7921#',
    vibeTag: 'Cocktail Soirée',
    image: '/media/img1.jpeg',
    theme: 'theme-cubist-blush',
    badge: '🍸 Champagne Monogram',
    badgeEmoji: '🍸',
    dressCode: 'Chic Cocktail & Editorial',
    spotifyLink: 'https://open.spotify.com/playlist/neo-soul-jazz',
    rsvpPreset: {
      yes: { emoji: '🥂', title: 'Cheers, Attending', sub: 'VIP Pass' },
      maybe: { emoji: '🍸', title: 'Drop In For A Drink', sub: 'Likely' },
      no: { emoji: '💌', title: 'Sending Warmth', sub: 'Decline' }
    },
    guestCount: 42,
    soundFreqs: [146.83, 185.00, 220.00], // D major 7 warmth
    description: 'A curated gathering of designers, artists, and storytellers. Crafted botanical cocktails, intimate jazz records, and decadent hors d’oeuvres.'
  },
  {
    id: 'jam-session-lounge',
    category: 'happyhours',
    title: 'Midnight Jazz & Acoustic Jam',
    subtitle: 'Bring your instrument, open mic & craft beers',
    host: 'Dev & Nina',
    date: 'Sunday, Nov 22',
    time: '6:30 PM — 11:30 PM',
    venue: 'The Acoustic Basement Studio',
    doorCode: 'Rooftop doorbell or ring Dev',
    vibeTag: 'Indie Gig / Jam',
    image: '/media/img2.jpeg',
    theme: 'theme-electric-cyan',
    badge: '🎸 Melody Crest',
    badgeEmoji: '🎸',
    dressCode: 'Casual Indie & Corduroy',
    spotifyLink: 'https://open.spotify.com/playlist/acoustic-sessions',
    rsvpPreset: {
      yes: { emoji: '🎵', title: 'Jamming With You', sub: 'Will bring gear' },
      maybe: { emoji: '🎙️', title: 'Listener Seat', sub: 'Tentative' },
      no: { emoji: '👋', title: 'Catch Next Set', sub: "Can't make it" }
    },
    guestCount: 24,
    soundFreqs: [164.81, 207.65, 246.94], // E minor 7
    description: 'Plug in or chill out. An unplugged jam session with electric guitars, bongo drums, and impromptu vocals. Free flowing brews on tap.'
  },

  // WEDDING
  {
    id: 'shahi-shaadi-gala',
    category: 'wedding',
    title: 'Ananya & Siddharth: Shahi Sangeet & Shaadi',
    subtitle: 'Two dynasties, royal dhol, champagne & endless celebration',
    host: 'The Kapoor & Singhania Families',
    date: 'Saturday, Dec 19',
    time: '6:00 PM — Late Night',
    venue: 'The Palatial Rose Courtyard, Heritage Palace',
    doorCode: 'VIP Valet: Royal Arch Entrance',
    vibeTag: 'Royal Wedding',
    image: '/media/img11.jpeg',
    theme: 'theme-royal-marigold',
    badge: '🐘 Royal Elephant Seal',
    badgeEmoji: '🐘',
    dressCode: 'Regal Velvet & Zari Sherwani',
    spotifyLink: 'https://open.spotify.com',
    rsvpPreset: {
      yes: { emoji: '💖', title: 'Baraat Mein Aana Hi Hai', sub: 'Going with family' },
      maybe: { emoji: '🫖', title: 'Koshish Zaroor Karenge', sub: 'Tentative' },
      no: { emoji: '🕊️', title: 'Duaon Mein Saath Hain', sub: 'In spirit only' }
    },
    guestCount: 160,
    soundFreqs: [138.59, 207.65, 277.18], // Shehnai Tanpura
    description: 'Join us as we celebrate love under the stars. Live Rajasthani folk orchestra, royal banquet, champagne towers, and non-stop dancing.'
  },
  {
    id: 'mehendi-sundowner',
    category: 'wedding',
    title: 'Mehendi, Mimosas & Sangeet Sundowner',
    subtitle: 'Henna artists, marigold canopies & Punjabi dholak beats',
    host: 'Priya & Arjun',
    date: 'Friday, Dec 18',
    time: '3:00 PM — 9:00 PM',
    venue: 'Villa Bougainvillea Poolside Lawn',
    doorCode: 'Garden Gate Code: #8832',
    vibeTag: 'Wedding Sundowner',
    image: '/media/img12.jpeg',
    theme: 'theme-mystic-sufi',
    badge: '💍 Bandhan Monogram',
    badgeEmoji: '💍',
    dressCode: 'Pastel Chiffon & Linen',
    spotifyLink: 'https://open.spotify.com',
    rsvpPreset: {
      yes: { emoji: '✨', title: 'Dholak Pe Nachna Hai', sub: 'Attending' },
      maybe: { emoji: '🍹', title: 'Drop in for Mimosas', sub: 'Maybe' },
      no: { emoji: '💌', title: 'Bhej Rahe Hain Pyaar', sub: 'Decline' }
    },
    guestCount: 95,
    soundFreqs: [146.83, 185.00, 220.00],
    description: 'Bespoke henna artists, fresh mango bellinis, artisanal chaat street, and sunset sufi-pop fusion by the pool.'
  },

  // BIRTHDAY
  {
    id: 'neon-midnight-birthday',
    category: 'birthday',
    title: 'Zoya’s 25th: Cyber Midnight Afterparty',
    subtitle: 'Electric violet lights, bespoke shots & deep basslines',
    host: 'Zoya & Crew',
    date: 'Saturday, Nov 28',
    time: '10:00 PM — Sunrise',
    venue: 'The Obsidian Warehouse Lounge',
    doorCode: 'Password at door: ELECTRIC25',
    vibeTag: 'Milestone Birthday',
    image: '/media/bday5.png',
    theme: 'theme-electric-cyan',
    badge: '👑 Birthday Crown',
    badgeEmoji: '👑',
    dressCode: 'Cyber Chic & Sneakers',
    spotifyLink: 'https://open.spotify.com',
    rsvpPreset: {
      yes: { emoji: '🍾', title: "Hell Yeah, Raging!", sub: 'Birthday squad' },
      maybe: { emoji: '🍹', title: 'Sliding After Midnight', sub: 'Maybe' },
      no: { emoji: '😴', title: 'FOMO Sleeping In', sub: "Can't make it" }
    },
    guestCount: 54,
    soundFreqs: [130.81, 164.81, 196.00],
    description: 'Quarter century celebration! Custom cocktail menu named after bad decisions, laser mapping, and birthday cake at 2 AM.'
  },
  {
    id: 'golden-hour-milestone',
    category: 'birthday',
    title: 'Rishi’s 30th: Sunset Terraces & Vinyl',
    subtitle: 'Golden hour spritzes, charcoal grill & vinyl lounge',
    host: 'Rishi & Friends',
    date: 'Saturday, Oct 31',
    time: '5:30 PM — 11:30 PM',
    venue: 'The Skyline Pergola & Terrace',
    doorCode: 'Keypad #3030',
    vibeTag: 'Milestone Birthday',
    image: '/media/img3.png',
    theme: 'theme-cubist-blush',
    badge: '⚡ Neon Bolt',
    badgeEmoji: '⚡',
    dressCode: 'Chic Cocktail & Editorial',
    spotifyLink: 'https://open.spotify.com',
    rsvpPreset: {
      yes: { emoji: '🥂', title: 'Toast to 30!', sub: 'Attending' },
      maybe: { emoji: '🍸', title: 'Catch Sunset Drink', sub: 'Maybe' },
      no: { emoji: '🎂', title: 'Happy Birthday From Afar', sub: 'Decline' }
    },
    guestCount: 36,
    soundFreqs: [146.83, 185.00, 220.00],
    description: 'Turning 30 with style. Woodfired pizzas, natural wines, funk records, and sunset polaroids over the skyline.'
  }
];

export const THEME_PALETTES = [
  {
    id: 'theme-mystic-sufi',
    name: 'Mystic Emerald & Ochre',
    tag: 'Sufi & Mehfil',
    primary: '#10B981',
    accent: '#F59E0B',
    bg: '#05100B',
    cardBg: 'rgba(11, 28, 20, 0.85)',
    border: 'rgba(16, 185, 129, 0.3)'
  },
  {
    id: 'theme-retro-disco',
    name: 'Retro Disco Warmth',
    tag: 'Happy Hours',
    primary: '#FF407D',
    accent: '#FFD700',
    bg: '#0F0914',
    cardBg: 'rgba(25, 15, 33, 0.85)',
    border: 'rgba(255, 64, 125, 0.3)'
  },
  {
    id: 'theme-royal-marigold',
    name: 'Royal Crimson & Gold',
    tag: 'Royal Wedding',
    primary: '#E11D48',
    accent: '#F59E0B',
    bg: '#120406',
    cardBg: 'rgba(30, 8, 12, 0.85)',
    border: 'rgba(225, 29, 72, 0.3)'
  },
  {
    id: 'theme-electric-cyan',
    name: 'Electric Neon Midnight',
    tag: 'Cyber Birthday',
    primary: '#06B6D4',
    accent: '#A855F7',
    bg: '#060B14',
    cardBg: 'rgba(12, 22, 38, 0.85)',
    border: 'rgba(6, 182, 212, 0.3)'
  },
  {
    id: 'theme-cubist-blush',
    name: 'Cubist Blush & Champagne',
    tag: 'Modern Editorial',
    primary: '#F472B6',
    accent: '#FBBF24',
    bg: '#140A10',
    cardBg: 'rgba(32, 16, 26, 0.85)',
    border: 'rgba(244, 114, 182, 0.3)'
  }
];

export const FIVE_LAYERS = [
  {
    number: '01',
    name: 'Ambient Sensory Backdrop',
    tagline: 'Immersion before a single word is read',
    description: 'Dynamic canvas particles (sparkling stardust, floating rose petals, glowing embers) combined with 3 hardware-accelerated aura orbs that glide smoothly across the screen, matching your gathering palette.',
    icon: 'Sparkles',
    visualPreview: 'Canvas Particles + 130px Blur Ambient Orbs'
  },
  {
    number: '02',
    name: 'Dual-Pane Interactive Studio',
    tagline: 'Zero-lag real-time previewing',
    description: 'Hosts design on the fly with sticky live previewing. Change artwork, rewrite dress code, toggle wax seals, or adjust the secret door instructions—every change mirrors instantly.',
    icon: 'Layout',
    visualPreview: 'Real-time Two-Way Reactive UI'
  },
  {
    number: '03',
    name: 'Customizable RSVP Responses',
    tagline: 'Personality over generic radio buttons',
    description: 'Instead of sterile Yes/No checks, customize playful cultural reply buttons like "Aana Hi Hai", "Hell Yeah, Going!", or "Duaon Mein Saath Hain".',
    icon: 'CheckCircle2',
    visualPreview: 'Bespoke Status Emojis & Cultural Micro-copy'
  },
  {
    number: '04',
    name: 'High-Dopamine Acceptance Pipeline',
    tagline: 'Rewarding the guest the second they commit',
    description: 'Clicking "Going" triggers hardware-accelerated confetti bursts, play-chime synthesis, live headcount ticker animation, and instantly unlocks the secret venue & gate entry passcode.',
    icon: 'Zap',
    visualPreview: 'Confetti Explosion + Secret Location Gate Unlock'
  },
  {
    number: '05',
    name: 'Live Web Audio Sound Synthesis',
    tagline: 'Zero external MP3 audio files needed',
    description: 'Synthesizes acoustic Tanpura drones, 70s house chords, and warm jazz harmonics live in the browser using the Web Audio API with audio waveform feedback.',
    icon: 'Volume2',
    visualPreview: 'Real-time Oscillator & Chord Synthesis'
  }
];

export const COMPARISON_POINTS = [
  {
    feature: 'First Impression',
    traditional: 'Static image attachment or drab Google Calendar link',
    partiful: '3D physical card physics, wax seals & ambient soundscape'
  },
  {
    feature: 'Venue Security',
    traditional: 'Sent openly in group chat or screenshot leaked',
    partiful: 'Redacted secret venue & passcode unlocked strictly upon RSVP'
  },
  {
    feature: 'RSVP Conversion',
    traditional: 'Silent form submission or left on "seen" in chat',
    partiful: 'Immediate dopamine reward, confetti burst & calendar drop'
  },
  {
    feature: 'Guest Experience',
    traditional: 'Requires downloading 50MB apps or creating passwords',
    partiful: 'Zero app download, zero password frictionless guest web view'
  },
  {
    feature: 'Vibe & Aesthetic',
    traditional: 'Generic corporate blue grids & uninspired typography',
    partiful: 'Curated Indian heritage & modern party archetypes with audio'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Kabir & Tara',
    role: 'Sufi Baithak Hosts, Delhi',
    quote: 'Our guests gasped when opening the invitation. The ambient tanpura and wax seal made it feel like a real royal farmaan.',
    event: 'Midnight Ghazal Mehfil',
    avatar: '🪷'
  },
  {
    name: 'Rohan Deshmukh',
    role: 'Warehouse Rave Curator, Mumbai',
    quote: 'The secret venue lock is game-changing for underground events. Gate passcode only revealed after they confirmed going.',
    event: 'Neon Warehouse Afterparty',
    avatar: '⚡'
  },
  {
    name: 'Ananya & Sahil',
    role: 'Destination Wedding, Udaipur',
    quote: 'No clumsy WhatsApp PDF could ever match HAVAN. Guests were texting us just to compliment the invitation design.',
    event: 'Lake Palace Sangeet',
    avatar: '👑'
  }
];

