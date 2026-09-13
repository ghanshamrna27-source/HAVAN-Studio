import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../data/database.json');

// Initial seed data
const SEED_DATA = {
  users: [
    {
      id: 'usr-seed-1',
      email: 'user@123',
      password: 'user@123',
      name: 'VIP Host',
      avatar: '👑',
      createdAt: new Date().toISOString()
    }
  ],
  events: [
    {
      _id: 'evt-sufi-qawwali',
      slug: 'sufi-qawwali-night',
      title: 'Chishtia Sufi & Qawwali Night',
      subtitle: 'Candlelit courtyards, ecstatic poetry & mystic chants',
      hostName: 'Hazrat Khusro Foundation',
      hostEmail: 'user@123',
      description: 'An evening honoring Amir Khusro and Bulleh Shah. Live harmonium, dholak, and communal saffron tea under strings of marigolds.',
      dateTime: {
        startTime: '2026-11-12T19:30:00.000Z',
        dateString: 'Thursday, Nov 12',
        timeString: '7:30 PM — Midnight',
        timezone: 'Asia/Kolkata'
      },
      location: {
        name: 'The Red Sandstone Haveli Courtyard',
        address: 'Brass Gate #1, Heritage Quarter, Old Delhi',
        doorCode: 'CODE: #7721 — Knock 3 times at Brass Gate',
        byobNote: 'Communal saffron tea & artisanal sherbet provided',
        hideUntilRsvp: true
      },
      theme: {
        presetId: 'theme-royal-marigold',
        posterUrl: '/media/img5.jpeg'
      },
      customization: {
        category: 'mehfil',
        vibeTag: 'Sufi Mehfil',
        seal: { id: 'seal-lotus', name: 'Kamal (Lotus Crest)', icon: '🪷', category: 'mehfil' },
        framingBorder: { id: 'border-mughal', name: 'Mughal Jali Arch', cssClass: 'frame-mughal' },
        dressCode: { id: 'raw-silk', title: 'Raw Silk, Kurta & Bohemia', icon: '👘', category: 'mehfil' },
        rsvpOptions: {
          yes: { emoji: '🪔', title: 'Hazir Hain', sub: 'Confirmed Attending' },
          maybe: { emoji: '🌸', title: 'Koshish Karenge', sub: 'Tentative' },
          no: { emoji: '🙏', title: 'Shubhkamnayein', sub: 'With you in spirit' }
        },
        soundFreqs: [146.83, 220.00, 293.66],
        effect: 'stardust',
        coverImage: '/media/img5.jpeg'
      },
      guestCount: 48,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'evt-disco-house',
      slug: 'disco-house-party',
      title: 'Groovy Retro House Jam',
      subtitle: 'Vinyl records, disco lights & late night energy',
      hostName: 'Aarav & Maya',
      hostEmail: 'user@123',
      description: 'We are clearing out the living room for a full vinyl DJ set, punch bowls, and 70s strobe lights. BYOB encouraged, good vibes mandatory.',
      dateTime: {
        startTime: '2026-11-14T20:30:00.000Z',
        dateString: 'Saturday, Nov 14',
        timeString: '8:30 PM till sunrise',
        timezone: 'Asia/Kolkata'
      },
      location: {
        name: 'The Secret Loft & Terrace',
        address: '4th Floor, Skyline Penthouse, 742 Evergreen Blvd',
        doorCode: 'CODE: #9042 — Dial #402 at front gate elevator',
        byobNote: 'Artisanal punch provided • BYOB welcome',
        hideUntilRsvp: true
      },
      theme: {
        presetId: 'theme-retro-disco',
        posterUrl: '/media/img3.jpeg'
      },
      customization: {
        category: 'happyhours',
        vibeTag: 'Happy Hours',
        seal: { id: 'seal-disco', name: 'Disco Mirrorball', icon: '🪩', category: 'happyhours' },
        framingBorder: { id: 'border-cyber', name: 'Cyber Neon Rim', cssClass: 'frame-cyber' },
        dressCode: { id: 'retro-flare', title: 'Retro 70s Flare & Glitter', icon: '🕺', category: 'happyhours' },
        rsvpOptions: {
          yes: { emoji: '🍾', title: 'Hell Yeah!', sub: 'Count me in' },
          maybe: { emoji: '🍹', title: 'Pulling Up Late', sub: 'Tentative' },
          no: { emoji: '😴', title: 'FOMO Sleeping', sub: "Can't make it" }
        },
        soundFreqs: [130.81, 164.81, 196.00],
        effect: 'stardust',
        coverImage: '/media/img3.jpeg'
      },
      guestCount: 38,
      createdAt: new Date().toISOString()
    }
  ],
  rsvps: [
    {
      id: 'rsvp-seed-1',
      eventId: 'evt-sufi-qawwali',
      eventSlug: 'sufi-qawwali-night',
      guestName: 'VIP Host',
      contact: 'user@123',
      rsvpStatus: 'going',
      dietaryNotes: 'Chai lover',
      plusOnes: 1,
      timestamp: new Date().toISOString()
    }
  ],
  comments: [
    {
      id: 'cmt-1',
      eventId: 'evt-sufi-qawwali',
      authorName: 'Rohan Deshmukh',
      authorContact: 'rohan@deshmukh.in',
      avatarEmoji: '🪷',
      message: 'So thrilled for this acoustic session! Bringing two boxes of saffron sweets.',
      timestamp: new Date().toISOString()
    }
  ]
};

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

class Database {
  constructor() {
    this.init();
  }

  init() {
    ensureDirExists(DB_FILE);
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf8');
    } else {
      // Ensure seed user exists in existing database
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const data = JSON.parse(raw);
        let modified = false;

        if (!data.users || data.users.length === 0) {
          data.users = SEED_DATA.users;
          modified = true;
        } else {
          const hasUser123 = data.users.some(u => u.email === 'user@123');
          if (!hasUser123) {
            data.users.unshift(SEED_DATA.users[0]);
            modified = true;
          }
        }

        if (!data.events || data.events.length === 0) {
          data.events = SEED_DATA.events;
          modified = true;
        }

        if (!data.rsvps) {
          data.rsvps = SEED_DATA.rsvps;
          modified = true;
        }

        if (!data.comments) {
          data.comments = SEED_DATA.comments;
          modified = true;
        }

        if (modified) {
          fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        }
      } catch (e) {
        fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf8');
      }
    }
  }

  read() {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return SEED_DATA;
    }
  }

  write(data) {
    try {
      ensureDirExists(DB_FILE);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error('[DB] Write error:', e);
      return false;
    }
  }

  // Users
  findUserByEmail(email) {
    const db = this.read();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const db = this.read();
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: userData.email.trim(),
      password: userData.password,
      name: userData.name || userData.email.split('@')[0],
      avatar: userData.avatar || '✨',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    this.write(db);
    return newUser;
  }

  // Events
  getAllEvents() {
    const db = this.read();
    return db.events;
  }

  findEventBySlug(slug) {
    const db = this.read();
    return db.events.find(e => e.slug.toLowerCase() === slug.toLowerCase() || e._id === slug);
  }

  createEvent(eventData) {
    const db = this.read();
    const slugBase = (eventData.title || 'gathering')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Date.now().toString(36).substr(-4)}`;

    const newEvent = {
      _id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      slug,
      hostKey: `hk-${Math.random().toString(36).substr(2, 12)}`,
      ...eventData,
      guestCount: eventData.guestCount || 1,
      createdAt: new Date().toISOString()
    };

    db.events.unshift(newEvent);
    this.write(db);
    return newEvent;
  }

  // RSVPs
  findRsvpsForEvent(eventId) {
    const db = this.read();
    return db.rsvps.filter(r => r.eventId === eventId);
  }

  findUserRsvp(eventId, contact) {
    const db = this.read();
    return db.rsvps.find(r => r.eventId === eventId && r.contact?.toLowerCase() === contact?.toLowerCase());
  }

  saveRsvp(rsvpData) {
    const db = this.read();
    const existingIdx = db.rsvps.findIndex(
      r => r.eventId === rsvpData.eventId && r.contact?.toLowerCase() === rsvpData.contact?.toLowerCase()
    );

    const rsvp = {
      id: existingIdx >= 0 ? db.rsvps[existingIdx].id : `rsvp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      ...rsvpData,
      timestamp: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      db.rsvps[existingIdx] = rsvp;
    } else {
      db.rsvps.unshift(rsvp);
    }

    // Update guestCount on event if RSVP is going
    const event = db.events.find(e => e._id === rsvpData.eventId || e.slug === rsvpData.eventSlug);
    if (event) {
      const goingCount = db.rsvps.filter(r => (r.eventId === event._id || r.eventSlug === event.slug) && r.rsvpStatus === 'going').length;
      event.guestCount = Math.max(event.guestCount || 1, goingCount);
    }

    this.write(db);
    return rsvp;
  }

  // Find all invites for a user: both hosted and accepted
  getUserInvites(contactOrEmail) {
    if (!contactOrEmail) return { hosted: [], accepted: [] };
    const db = this.read();
    const emailNorm = contactOrEmail.toLowerCase();

    const hosted = db.events.filter(e => e.hostEmail?.toLowerCase() === emailNorm);
    const userRsvps = db.rsvps.filter(r => r.contact?.toLowerCase() === emailNorm);

    const accepted = userRsvps.map(r => {
      const ev = db.events.find(e => e._id === r.eventId || e.slug === r.eventSlug);
      return {
        rsvp: r,
        event: ev || { title: 'Gathering', slug: r.eventSlug }
      };
    });

    return { hosted, accepted };
  }

  // Comments
  getCommentsForEvent(eventId) {
    const db = this.read();
    return db.comments.filter(c => c.eventId === eventId);
  }

  addComment(commentData) {
    const db = this.read();
    const newComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      ...commentData,
      timestamp: new Date().toISOString()
    };
    db.comments.unshift(newComment);
    this.write(db);
    return newComment;
  }
}

export const db = new Database();
