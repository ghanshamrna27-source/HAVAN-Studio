// Client API Service for HAVAN Persistent Backend
const TOKEN_KEY = 'havan_auth_token';
const USER_KEY = 'havan_auth_user';

export const api = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  // Auth: Login
  async login(email, password) {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to log in');
    }
    this.setSession(data.token, data.user);
    return data.user;
  },

  // Auth: Register
  async register(email, password, name, avatar = '✨') {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password, name: name.trim(), avatar })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to create account');
    }
    this.setSession(data.token, data.user);
    return data.user;
  },

  // Auth: Verify token
  async fetchMe() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/v1/auth/me', { headers: this.getHeaders() });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      this.clearSession();
      return null;
    } catch (e) {
      return this.getCurrentUser();
    }
  },

  // Check Invite: Search by code, slug or name
  async checkInvite(query) {
    const res = await fetch(`/api/v1/invites/check/${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invite not found');
    }
    return data.data;
  },

  // My Invites: Hosted and Accepted
  async getMyInvites(contactEmail) {
    const user = this.getCurrentUser();
    const contact = contactEmail || (user ? user.email : '');
    const url = contact ? `/api/v1/my-invites?contact=${encodeURIComponent(contact)}` : '/api/v1/my-invites';
    const res = await fetch(url, { headers: this.getHeaders() });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch your invites');
    }
    return data.data;
  },

  // Events: Fetch single
  async getEvent(slug, hostKey, guestContact) {
    const headers = {};
    if (hostKey) headers['x-host-key'] = hostKey;
    if (guestContact) headers['x-guest-contact'] = guestContact;
    const res = await fetch(`/api/v1/events/${slug}`, { headers: this.getHeaders(headers) });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load event');
    }
    return data.data;
  },

  // Events: Submit RSVP
  async submitRsvp(eventIdOrSlug, payload) {
    const res = await fetch(`/api/v1/events/${eventIdOrSlug}/rsvp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to submit RSVP');
    }
    return data;
  }
};
