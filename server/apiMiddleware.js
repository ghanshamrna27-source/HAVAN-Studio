import { db } from './db.js';

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Generate simple auth token
function createToken(user) {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, name: user.name, exp: Date.now() + 7 * 86400000 })).toString('base64');
}

function decodeToken(token) {
  try {
    if (!token) return null;
    const clean = token.replace('Bearer ', '');
    const json = Buffer.from(clean, 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    if (parsed.exp && parsed.exp < Date.now()) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

export function apiMiddleware() {
  return async (req, res, next) => {
    // Only intercept requests starting with /api/v1
    if (!req.url.startsWith('/api/v1')) {
      return next();
    }

    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = urlObj.pathname;
    const method = req.method;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-host-key, x-guest-contact');

    if (method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    try {
      // 1. AUTH: Login
      if (pathname === '/api/v1/auth/login' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, password } = body;

        if (!email || !password) {
          return sendJson(res, 400, { success: false, error: 'Email and password are required' });
        }

        const user = db.findUserByEmail(email);
        if (!user || user.password !== password) {
          return sendJson(res, 401, { success: false, error: 'Invalid email or password' });
        }

        const token = createToken(user);
        return sendJson(res, 200, {
          success: true,
          token,
          user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
        });
      }

      // 2. AUTH: Register
      if (pathname === '/api/v1/auth/register' && method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, password, name, avatar } = body;

        if (!email || !password) {
          return sendJson(res, 400, { success: false, error: 'Email and password are required' });
        }

        const existing = db.findUserByEmail(email);
        if (existing) {
          return sendJson(res, 409, { success: false, error: 'User with this email already exists' });
        }

        const user = db.createUser({ email, password, name, avatar });
        const token = createToken(user);
        return sendJson(res, 201, {
          success: true,
          token,
          user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
        });
      }

      // 3. AUTH: Me
      if (pathname === '/api/v1/auth/me' && method === 'GET') {
        const authHeader = req.headers['authorization'];
        const decoded = decodeToken(authHeader);
        if (!decoded) {
          return sendJson(res, 401, { success: false, error: 'Unauthorized' });
        }
        const user = db.findUserByEmail(decoded.email);
        if (!user) {
          return sendJson(res, 404, { success: false, error: 'User not found' });
        }
        return sendJson(res, 200, {
          success: true,
          user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
        });
      }

      // 4. EVENTS: List All
      if (pathname === '/api/v1/events' && method === 'GET') {
        const events = db.getAllEvents();
        return sendJson(res, 200, { success: true, data: events });
      }

      // 5. EVENTS: Create New
      if (pathname === '/api/v1/events' && method === 'POST') {
        const body = await parseJsonBody(req);
        const authHeader = req.headers['authorization'];
        const decoded = decodeToken(authHeader);

        const eventData = {
          ...body,
          hostEmail: decoded ? decoded.email : (body.hostEmail || 'guest@havan.studio')
        };

        const event = db.createEvent(eventData);
        return sendJson(res, 201, {
          success: true,
          data: event,
          hostKey: event.hostKey,
          token: decoded ? null : createToken({ id: 'anon', email: event.hostEmail, name: event.hostName })
        });
      }

      // 6. CHECK INVITE: Lookup by code/slug/title
      const checkMatch = pathname.match(/^\/api\/v1\/invites\/check\/(.+)$/);
      if (checkMatch && method === 'GET') {
        const query = decodeURIComponent(checkMatch[1]).trim().toLowerCase();
        const event = db.findEventBySlug(query) ||
          db.getAllEvents().find(e => e.title.toLowerCase().includes(query) || e.slug.includes(query));

        if (!event) {
          return sendJson(res, 404, { success: false, error: 'No gathering found with this code or name' });
        }

        return sendJson(res, 200, { success: true, data: event });
      }

      // 7. USER: My Invites (Hosted & Accepted)
      if (pathname === '/api/v1/my-invites' && method === 'GET') {
        const authHeader = req.headers['authorization'];
        const decoded = decodeToken(authHeader);
        const queryContact = urlObj.searchParams.get('contact');
        const contact = decoded ? decoded.email : queryContact;

        if (!contact) {
          return sendJson(res, 200, { success: true, data: { hosted: [], accepted: [] } });
        }

        const userInvites = db.getUserInvites(contact);
        return sendJson(res, 200, { success: true, data: userInvites });
      }

      // 8. EVENTS: Details by Slug
      const eventSlugMatch = pathname.match(/^\/api\/v1\/events\/([a-zA-Z0-9_-]+)$/);
      if (eventSlugMatch && method === 'GET') {
        const slug = eventSlugMatch[1];
        const event = db.findEventBySlug(slug);

        if (!event) {
          return sendJson(res, 404, { success: false, error: 'Event not found' });
        }

        const hostKey = req.headers['x-host-key'];
        const guestContact = req.headers['x-guest-contact'];
        const isHost = hostKey && hostKey === event.hostKey;

        // Check if guest has RSVP'd
        const guestRsvp = guestContact ? db.findUserRsvp(event._id, guestContact) : null;
        const isRsvpd = isHost || (guestRsvp && (guestRsvp.rsvpStatus === 'going' || guestRsvp.rsvpStatus === 'maybe'));

        // Sanitize location if not unlocked
        const sanitizedLocation = {
          name: event.location?.name || 'Secret Venue',
          address: isRsvpd ? event.location?.address : 'Revealed upon RSVP confirmation',
          doorCode: isRsvpd ? event.location?.doorCode : 'Locked 🔒 RSVP to receive passcode',
          byobNote: event.location?.byobNote || '',
          isUnlocked: Boolean(isRsvpd)
        };

        const responseEvent = {
          ...event,
          location: sanitizedLocation,
          callerGuestRsvp: guestRsvp || null,
          isHost: Boolean(isHost)
        };

        return sendJson(res, 200, { success: true, data: responseEvent });
      }

      // 9. EVENTS: RSVP Submission
      const rsvpMatch = pathname.match(/^\/api\/v1\/events\/([a-zA-Z0-9_-]+)\/rsvp$/);
      if (rsvpMatch && method === 'POST') {
        const eventIdOrSlug = rsvpMatch[1];
        const event = db.findEventBySlug(eventIdOrSlug);

        if (!event) {
          return sendJson(res, 404, { success: false, error: 'Event not found' });
        }

        const body = await parseJsonBody(req);
        const { guestName, contact, rsvpStatus, dietaryNotes, plusOnes } = body;

        if (!contact) {
          return sendJson(res, 400, { success: false, error: 'Contact/Email is required to RSVP' });
        }

        const rsvpRecord = db.saveRsvp({
          eventId: event._id,
          eventSlug: event.slug,
          guestName: guestName || 'Guest',
          contact: contact.trim(),
          rsvpStatus: rsvpStatus || 'going',
          dietaryNotes: dietaryNotes || '',
          plusOnes: Number(plusOnes) || 0
        });

        // Return unlocked location details
        return sendJson(res, 200, {
          success: true,
          message: 'RSVP confirmed! Venue passcode unlocked.',
          rsvp: rsvpRecord,
          unlockedLocation: {
            name: event.location?.name,
            address: event.location?.address,
            doorCode: event.location?.doorCode,
            byobNote: event.location?.byobNote,
            isUnlocked: true
          }
        });
      }

      // 10. EVENTS: Comments / Hype Wall
      const commentsMatch = pathname.match(/^\/api\/v1\/events\/([a-zA-Z0-9_-]+)\/comments$/);
      if (commentsMatch) {
        const eventIdOrSlug = commentsMatch[1];
        const event = db.findEventBySlug(eventIdOrSlug);
        const eventId = event ? event._id : eventIdOrSlug;

        if (method === 'GET') {
          const comments = db.getCommentsForEvent(eventId);
          return sendJson(res, 200, { success: true, data: comments });
        }

        if (method === 'POST') {
          const body = await parseJsonBody(req);
          const comment = db.addComment({
            eventId,
            authorName: body.authorName || 'Guest',
            authorContact: body.authorContact || '',
            avatarEmoji: body.avatarEmoji || '✨',
            message: body.message || ''
          });
          return sendJson(res, 201, { success: true, data: comment });
        }
      }

      // 11. EVENTS: QR Code endpoint
      const qrMatch = pathname.match(/^\/api\/v1\/events\/([a-zA-Z0-9_-]+)\/qr$/);
      if (qrMatch && method === 'GET') {
        const slug = qrMatch[1];
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`http://${req.headers.host}/#/invite/${slug}`)}`;
        return sendJson(res, 200, { success: true, data: { qrUrl } });
      }

      // Fallthrough
      return sendJson(res, 404, { success: false, error: 'Endpoint not found' });
    } catch (err) {
      console.error('[API Middleware Error]', err);
      return sendJson(res, 500, { success: false, error: 'Internal Server Error' });
    }
  };
}
