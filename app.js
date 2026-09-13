/* ================================================================
   MEHFIL — Split-Screen Live Invitation Studio
   Real-Time Simultaneous Preview & Customization Engine
   ================================================================ */

(function () {
    'use strict';

    /* ================================================================
       1. ARTWORK DATABASE (15 Sufi Artworks from Sufi-music/)
       ================================================================ */
    const ARTWORKS = [
        {
            src: 'Sufi-music/img3.jpeg',
            title: 'Whirling Dervish Gold Moon',
            category: 'mystic',
            theme: 'mystic-sufi',
            effect: 'stardust',
            tag: 'Whirling Dervish'
        },
        {
            src: 'Sufi-music/img1.jpeg',
            title: 'Lantern String Masters',
            category: 'mystic',
            theme: 'mystic-sufi',
            effect: 'embers',
            tag: 'Night Baithak'
        },
        {
            src: 'Sufi-music/img15.jpeg',
            title: 'White Kurta Courtyard Baithak',
            category: 'mystic',
            theme: 'mystic-sufi',
            effect: 'petals',
            tag: 'Sufi Circle'
        },
        {
            src: 'Sufi-music/img7.jpeg',
            title: 'Moonlit Warli Dance Circle',
            category: 'tribal',
            theme: 'folk-tribal',
            effect: 'embers',
            tag: 'Warli Folk'
        },
        {
            src: 'Sufi-music/img9.jpeg',
            title: 'Terracotta Harvest Rhythms',
            category: 'tribal',
            theme: 'folk-tribal',
            effect: 'embers',
            tag: 'Terracotta'
        },
        {
            src: 'Sufi-music/img8.jpeg',
            title: 'Tribal Procession & Horns',
            category: 'tribal',
            theme: 'folk-tribal',
            effect: 'bokeh',
            tag: 'Tribal Drums'
        },
        {
            src: 'Sufi-music/img4.jpeg',
            title: 'Turban Percussion Troupe',
            category: 'tribal',
            theme: 'desert-caravan',
            effect: 'embers',
            tag: 'Dhol & Raag'
        },
        {
            src: 'Sufi-music/img13.jpeg',
            title: 'Padosan Pop Retro Qawwali',
            category: 'retro',
            theme: 'psychedelic-retro',
            effect: 'petals',
            tag: '70s Pop Art'
        },
        {
            src: 'Sufi-music/img10.jpeg',
            title: 'Simla Beat Psychedelic 1971',
            category: 'retro',
            theme: 'psychedelic-retro',
            effect: 'meteors',
            tag: 'Psychedelic'
        },
        {
            src: 'Sufi-music/img12.jpeg',
            title: 'Shravanam Temple Arch',
            category: 'retro',
            theme: 'noor-kashmir',
            effect: 'aurora',
            tag: 'Archway'
        },
        {
            src: 'Sufi-music/img2.jpeg',
            title: 'Cubist Classical Strings',
            category: 'classical',
            theme: 'contemporary-minimal',
            effect: 'jasmine',
            tag: 'Cubist Raag'
        },
        {
            src: 'Sufi-music/img5.jpeg',
            title: 'Blue Cubist Sarod Master',
            category: 'classical',
            theme: 'contemporary-minimal',
            effect: 'bokeh',
            tag: 'Sarod & Jade'
        },
        {
            src: 'Sufi-music/img6.jpeg',
            title: 'Three Musicians Geometric',
            category: 'classical',
            theme: 'contemporary-minimal',
            effect: 'soundwaves',
            tag: 'Avant-Garde'
        },
        {
            src: 'Sufi-music/img14.jpeg',
            title: 'Maiden With Sarangi',
            category: 'classical',
            theme: 'noor-kashmir',
            effect: 'jasmine',
            tag: 'Silk Sarangi'
        },
        {
            src: 'Sufi-music/img16.jpeg',
            title: 'Monochrome Tanpura Meditation',
            category: 'classical',
            theme: 'desert-caravan',
            effect: 'stardust',
            tag: 'Tanpura Sketch'
        }
    ];

    let currentArtwork = ARTWORKS[0];
    let currentTheme = 'mystic-sufi';
    let currentEffect = 'stardust';
    let currentCategory = 'all';
    let rsvpStatus = null;

    /* ================================================================
       2. DOM REFERENCES
       ================================================================ */
    // Card Elements (Left Side)
    const inviteCard = document.getElementById('inviteCard');
    const coverArt = document.getElementById('coverArt');
    const cardHostName = document.getElementById('cardHostName');
    const hostAvatarInitial = document.getElementById('hostAvatarInitial');
    const cardEventTitle = document.getElementById('cardEventTitle');
    const cardEventSubtitle = document.getElementById('cardEventSubtitle');
    const cardEventDate = document.getElementById('cardEventDate');
    const cardEventTime = document.getElementById('cardEventTime');
    const cardEventVenue = document.getElementById('cardEventVenue');
    const cardEventDescription = document.getElementById('cardEventDescription');
    const cardVibeTags = document.getElementById('cardVibeTags');

    // Editor Elements (Right Side)
    const coverGrid = document.getElementById('coverGrid');
    const artworkCategoryTabs = document.getElementById('artworkCategoryTabs');
    const artworkCountTag = document.getElementById('artworkCountTag');
    const themePresetList = document.getElementById('themePresetList');
    const effectList = document.getElementById('effectList');

    const densityToggleGroup = document.getElementById('densityToggleGroup');
    const speedToggleGroup = document.getElementById('speedToggleGroup');

    const inputTitle = document.getElementById('inputTitle');
    const inputSubtitle = document.getElementById('inputSubtitle');
    const inputHost = document.getElementById('inputHost');
    const inputDate = document.getElementById('inputDate');
    const inputTime = document.getElementById('inputTime');
    const inputVenue = document.getElementById('inputVenue');
    const inputDescription = document.getElementById('inputDescription');
    const inputVibeTags = document.getElementById('inputVibeTags');

    // RSVP & Social Elements
    const rsvpGoing = document.getElementById('rsvpGoing');
    const rsvpMaybe = document.getElementById('rsvpMaybe');
    const rsvpCant = document.getElementById('rsvpCant');
    const rsvpSection = document.getElementById('rsvpSection');
    const rsvpConfirmed = document.getElementById('rsvpConfirmed');
    const confirmedText = document.getElementById('confirmedText');
    const rsvpChangeBtn = document.getElementById('rsvpChangeBtn');
    const btnAddToCalendar = document.getElementById('btnAddToCalendar');

    const locationMeta = document.getElementById('locationMeta');
    const locationText = document.getElementById('locationText');
    const locationLock = document.getElementById('locationLock');

    const btnExportInvite = document.getElementById('btnExportInvite');
    const shareToast = document.getElementById('shareToast');
    const toastMessage = document.getElementById('toastMessage');

    const audioPlayBtn = document.getElementById('audioPlayBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const audioWave = document.getElementById('audioWave');

    const commentInput = document.getElementById('commentInput');
    const commentSendBtn = document.getElementById('commentSendBtn');
    const commentsList = document.getElementById('commentsList');

    const mobileViewTabs = document.getElementById('mobileViewTabs');

    /* ================================================================
       3. SPOTLIGHT CARD (React Bits style mouse-following glow)
       ================================================================ */
    if (inviteCard) {
        inviteCard.addEventListener('mousemove', (e) => {
            const rect = inviteCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            inviteCard.style.setProperty('--mouse-x', `${x}px`);
            inviteCard.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    /* ================================================================
       4. REAL-TIME TWO-WAY CONTENT BINDING (Right inputs -> Left card)
       ================================================================ */
    function syncContentInputs() {
        // Pre-populate description textarea if empty
        if (inputDescription && cardEventDescription && !inputDescription.value) {
            inputDescription.value = cardEventDescription.textContent.trim();
        }

        // Live Title
        if (inputTitle) {
            inputTitle.addEventListener('input', (e) => {
                cardEventTitle.textContent = e.target.value || 'Mehfil-e-Samaa';
            });
        }

        // Live Subtitle
        if (inputSubtitle) {
            inputSubtitle.addEventListener('input', (e) => {
                cardEventSubtitle.textContent = e.target.value;
            });
        }

        // Live Host
        if (inputHost) {
            inputHost.addEventListener('input', (e) => {
                const name = e.target.value || 'Host';
                cardHostName.textContent = name;
                if (hostAvatarInitial) {
                    hostAvatarInitial.textContent = name.trim().charAt(0).toUpperCase() || 'A';
                }
            });
        }

        // Live Date
        if (inputDate) {
            inputDate.addEventListener('input', (e) => {
                cardEventDate.textContent = e.target.value;
            });
        }

        // Live Time
        if (inputTime) {
            inputTime.addEventListener('input', (e) => {
                cardEventTime.textContent = e.target.value;
            });
        }

        // Live Venue
        if (inputVenue) {
            inputVenue.addEventListener('input', (e) => {
                cardEventVenue.textContent = e.target.value;
            });
        }

        // Live Description
        if (inputDescription) {
            inputDescription.addEventListener('input', (e) => {
                cardEventDescription.textContent = e.target.value;
            });
        }

        // Live Vibe Tags
        if (inputVibeTags) {
            inputVibeTags.addEventListener('input', (e) => {
                const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                cardVibeTags.innerHTML = '';
                tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'vibe-tag';
                    span.textContent = tag;
                    cardVibeTags.appendChild(span);
                });
            });
        }
    }

    /* ================================================================
       5. ARTWORK GALLERY & CATEGORIES (15 Sufi Artworks)
       ================================================================ */
    function renderCoverGrid() {
        coverGrid.innerHTML = '';
        const filtered = currentCategory === 'all'
            ? ARTWORKS
            : ARTWORKS.filter(item => item.category === currentCategory);

        if (artworkCountTag) {
            artworkCountTag.textContent = `${filtered.length} Artworks`;
        }

        filtered.forEach((art) => {
            const item = document.createElement('div');
            item.className = 'cover-grid-item' + (art.src === currentArtwork.src ? ' active' : '');
            item.title = `${art.title} (${art.tag})`;

            const img = document.createElement('img');
            img.src = art.src;
            img.alt = art.title;
            img.loading = 'lazy';

            const badge = document.createElement('span');
            badge.className = 'cover-badge-mini';
            badge.textContent = art.tag;

            item.appendChild(img);
            item.appendChild(badge);

            item.addEventListener('click', () => selectCoverArt(art, item));
            coverGrid.appendChild(item);
        });
    }

    function selectCoverArt(art, itemEl) {
        currentArtwork = art;

        // Smooth image transition on left-hand preview card
        coverArt.style.opacity = '0';
        coverArt.style.transform = 'scale(1.06)';
        setTimeout(() => {
            coverArt.src = art.src;
            coverArt.onload = () => {
                coverArt.style.opacity = '1';
                coverArt.style.transform = 'scale(1)';
            };
        }, 200);

        // Update active class in grid
        coverGrid.querySelectorAll('.cover-grid-item').forEach(el => el.classList.remove('active'));
        if (itemEl) itemEl.classList.add('active');

        // Automatically update theme & particle effect simultaneously!
        switchTheme(art.theme);
        switchEffect(art.effect);

        showToast(`🎨 Applied "${art.title}" & matched theme`);
    }

    // Category Tabs click handler
    if (artworkCategoryTabs) {
        artworkCategoryTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.category-tab');
            if (!tab) return;
            artworkCategoryTabs.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.cat;
            renderCoverGrid();
        });
    }

    /* ================================================================
       6. THEME PRESETS SWITCHING (6 Palettes)
       ================================================================ */
    function switchTheme(theme) {
        currentTheme = theme;
        document.body.setAttribute('data-theme', theme);

        themePresetList.querySelectorAll('.theme-preset').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    themePresetList.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-preset');
        if (!btn) return;
        switchTheme(btn.dataset.theme);
        showToast(`Applied ${btn.querySelector('.theme-name').textContent}`);
    });

    /* ================================================================
       7. ATMOSPHERIC FLOATING FX (8 Modes + Sliders)
       ================================================================ */
    function switchEffect(effect) {
        currentEffect = effect;

        effectList.querySelectorAll('.effect-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.effect === effect);
        });

        if (window.ParticleEngine) {
            window.ParticleEngine.start(effect);
        }
    }

    effectList.addEventListener('click', (e) => {
        const btn = e.target.closest('.effect-btn');
        if (!btn) return;
        switchEffect(btn.dataset.effect);
        showToast(`FX Mode: ${btn.querySelector('.effect-name').textContent}`);
    });

    // FX Density controls
    if (densityToggleGroup) {
        densityToggleGroup.addEventListener('click', (e) => {
            const btn = e.target.closest('.fx-pill-toggle');
            if (!btn) return;
            densityToggleGroup.querySelectorAll('.fx-pill-toggle').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mult = parseFloat(btn.dataset.density);
            if (window.ParticleEngine) window.ParticleEngine.setDensity(mult);
        });
    }

    // FX Speed controls
    if (speedToggleGroup) {
        speedToggleGroup.addEventListener('click', (e) => {
            const btn = e.target.closest('.fx-pill-toggle');
            if (!btn) return;
            speedToggleGroup.querySelectorAll('.fx-pill-toggle').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const speed = parseFloat(btn.dataset.speed);
            if (window.ParticleEngine) window.ParticleEngine.setSpeed(speed);
        });
    }

    /* ================================================================
       8. RSVP FLOW, CONFETTI & VENUE UNLOCK
       ================================================================ */
    function handleRSVP(status) {
        rsvpStatus = status;

        [rsvpGoing, rsvpMaybe, rsvpCant].forEach(btn => btn.classList.remove('active'));

        if (status === 'going') {
            rsvpGoing.classList.add('active');
            confirmedText.textContent = "You're in the Mehfil! ✨";
            confirmedText.style.color = 'var(--rsvp-going)';
            launchConfetti();
            unlockLocation();
            playChimeSound();
        } else if (status === 'maybe') {
            rsvpMaybe.classList.add('active');
            confirmedText.textContent = "Marked as Maybe 🌙";
            confirmedText.style.color = 'var(--rsvp-maybe)';
        } else {
            rsvpCant.classList.add('active');
            confirmedText.textContent = "Alvida for now 🙏";
            confirmedText.style.color = 'var(--rsvp-cant)';
        }

        // Animate RSVP transition
        rsvpSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        rsvpSection.style.opacity = '0';
        rsvpSection.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            rsvpSection.style.display = 'none';
            rsvpConfirmed.style.display = 'flex';
            rsvpConfirmed.style.opacity = '0';
            rsvpConfirmed.style.transform = 'translateY(10px)';
            rsvpConfirmed.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            requestAnimationFrame(() => {
                rsvpConfirmed.style.opacity = '1';
                rsvpConfirmed.style.transform = 'translateY(0)';
            });
        }, 300);

        animateGuestCount(status);
    }

    rsvpGoing.addEventListener('click', () => handleRSVP('going'));
    rsvpMaybe.addEventListener('click', () => handleRSVP('maybe'));
    rsvpCant.addEventListener('click', () => handleRSVP('cant'));

    rsvpChangeBtn.addEventListener('click', () => {
        rsvpConfirmed.style.display = 'none';
        rsvpSection.style.display = 'block';
        rsvpSection.style.opacity = '1';
        rsvpSection.style.transform = 'translateY(0)';
        [rsvpGoing, rsvpMaybe, rsvpCant].forEach(btn => btn.classList.remove('active'));
        rsvpStatus = null;
    });

    function animateGuestCount(status) {
        const countEl = document.getElementById('guestCount');
        const going = status === 'going' ? 25 : 24;
        const maybe = status === 'maybe' ? 9 : 8;

        countEl.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
        countEl.style.opacity = '0.4';
        countEl.style.transform = 'translateY(-3px)';

        setTimeout(() => {
            countEl.textContent = `${going} going · ${maybe} maybe`;
            countEl.style.opacity = '1';
            countEl.style.transform = 'translateY(0)';
        }, 200);
    }

    function unlockLocation() {
        setTimeout(() => {
            locationMeta.classList.add('location-unlocked', 'shine-border');
            locationText.textContent = '📍 Secret Venue Unlocked!';
            locationText.classList.remove('location-locked');
            showToast('🗝️ Secret venue location unlocked on card!');
        }, 600);
    }

    locationMeta.addEventListener('click', () => {
        if (!locationMeta.classList.contains('location-unlocked')) {
            showToast('🔒 Please RSVP "Aana Hi Hai" on the card to unlock the venue!');
        }
    });

    /* ================================================================
       9. CONFETTI CELEBRATION BURST
       ================================================================ */
    function launchConfetti() {
        const confettiCanvas = document.getElementById('confettiCanvas');
        if (!confettiCanvas) return;
        const cctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const confettiPieces = [];
        const colors = ['#D4AF37', '#FFD700', '#FF6B35', '#FF2A7A', '#8B5CF6', '#00F5D4', '#F59E0B', '#22C55E', '#FFFFFF'];

        for (let i = 0; i < 140; i++) {
            confettiPieces.push({
                x: confettiCanvas.width * 0.35 + (Math.random() - 0.5) * 240,
                y: confettiCanvas.height * 0.55,
                w: Math.random() * 11 + 4,
                h: Math.random() * 7 + 3,
                vx: (Math.random() - 0.5) * 18,
                vy: -(Math.random() * 20 + 6),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 14,
                gravity: 0.28 + Math.random() * 0.15,
                opacity: 1,
                decay: 0.007 + Math.random() * 0.005
            });
        }

        let confettiFrame;
        function animateConfetti() {
            cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let alive = false;
            confettiPieces.forEach(p => {
                if (p.opacity <= 0) return;
                alive = true;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.98;
                p.rotation += p.rotSpeed;
                p.opacity -= p.decay;

                cctx.save();
                cctx.globalAlpha = Math.max(0, p.opacity);
                cctx.translate(p.x, p.y);
                cctx.rotate((p.rotation * Math.PI) / 180);
                cctx.fillStyle = p.color;
                cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                cctx.restore();
            });
            if (alive) {
                confettiFrame = requestAnimationFrame(animateConfetti);
            } else {
                cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
                cancelAnimationFrame(confettiFrame);
            }
        }
        animateConfetti();
    }

    /* ================================================================
       10. REAL WEB AUDIO API SUFI DRONE SYNTHESIZER
       ================================================================ */
    let audioCtx = null;
    let masterGain = null;
    let isPlayingAudio = false;

    function initWebAudio() {
        if (audioCtx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(480, audioCtx.currentTime);

        masterGain.connect(filter);
        filter.connect(audioCtx.destination);

        const notes = [
            { freq: 138.59, type: 'sawtooth', gain: 0.18 },
            { freq: 138.59, type: 'sine', gain: 0.25 },
            { freq: 207.65, type: 'triangle', gain: 0.14 },
            { freq: 277.18, type: 'sine', gain: 0.1 }
        ];

        notes.forEach(n => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = n.type;
            osc.frequency.setValueAtTime(n.freq, audioCtx.currentTime);

            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.value = 0.2 + Math.random() * 0.15;
            lfoGain.gain.value = 0.8;
            lfo.connect(osc.frequency);
            lfo.start();

            g.gain.setValueAtTime(n.gain, audioCtx.currentTime);
            osc.connect(g);
            g.connect(masterGain);
            osc.start();
        });
    }

    function toggleAudio() {
        if (!audioCtx) initWebAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        isPlayingAudio = !isPlayingAudio;

        if (isPlayingAudio) {
            masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
            masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 1.5);

            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            audioWave.classList.add('active');
            audioPlayBtn.classList.add('playing');
            showToast('🎶 Playing live Sufi Tanpura drone');
        } else {
            masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
            masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);

            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            audioWave.classList.remove('active');
            audioPlayBtn.classList.remove('playing');
        }
    }

    audioPlayBtn.addEventListener('click', toggleAudio);

    function playChimeSound() {
        try {
            if (!audioCtx) initWebAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const chimeOsc = audioCtx.createOscillator();
            const chimeGain = audioCtx.createGain();
            chimeOsc.type = 'sine';
            chimeOsc.frequency.setValueAtTime(880, audioCtx.currentTime);
            chimeOsc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.8);

            chimeGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

            chimeOsc.connect(chimeGain);
            chimeGain.connect(audioCtx.destination);
            chimeOsc.start();
            chimeOsc.stop(audioCtx.currentTime + 1.9);
        } catch (e) {
            // Policy
        }
    }

    /* ================================================================
       11. COMMENTS & EMOJI REACTIONS
       ================================================================ */
    const guestColors = ['#D4AF37', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1', '#EF4444', '#06B6D4'];

    function addComment(customText = null, senderName = 'You') {
        const text = customText || commentInput.value.trim();
        if (!text) return;

        const color = guestColors[Math.floor(Math.random() * guestColors.length)];
        const initial = senderName.charAt(0).toUpperCase();

        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `
            <div class="comment-avatar" style="background:${color};">${initial}</div>
            <div class="comment-content">
                <span class="comment-name">${escapeHTML(senderName)}</span>
                <p class="comment-text">${escapeHTML(text)}</p>
            </div>
        `;
        commentsList.appendChild(item);
        commentsList.scrollTop = commentsList.scrollHeight;

        if (!customText) commentInput.value = '';
        showToast('✨ Blessing sent to the wall!');
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    commentSendBtn.addEventListener('click', () => addComment());
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addComment();
    });

    document.querySelectorAll('.emoji-reaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const emoji = btn.dataset.emoji;
            const messages = {
                '✨': 'Sending pure divine light & blessings! ✨',
                '👏': 'Wah wah! Soulful applause for the mehfil 👏',
                '🫖': 'Pour the zafrani chai, let the music flow! 🫖',
                '🌹': 'A fragrant rose petal for the baithak 🌹',
                '💖': 'Deep love & reverence for this gathering 💖'
            };
            addComment(messages[emoji] || emoji, 'You');
        });
    });

    /* ================================================================
       12. CALENDAR EXPORT (.ICS)
       ================================================================ */
    if (btnAddToCalendar) {
        btnAddToCalendar.addEventListener('click', () => {
            const title = cardEventTitle.textContent || 'Mehfil-e-Samaa';
            const desc = cardEventDescription.textContent || 'Sufi Music Baithak';
            const location = cardEventVenue.textContent || 'The Haveli Courtyard, Hauz Khas Village, Delhi';

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Mehfil//Sufi Music Invitation//EN',
                'BEGIN:VEVENT',
                'SUMMARY:' + title,
                'DESCRIPTION:' + desc.replace(/\n/g, ' '),
                'LOCATION:' + location,
                'DTSTART:20261018T143000Z',
                'DTEND:20261018T203000Z',
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'mehfil-e-samaa.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('📅 Calendar invite (.ics) downloaded!');
        });
    }

    /* ================================================================
       13. SHARE INVITATION & TOAST
       ================================================================ */
    btnExportInvite.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => showToast('🔗 Invite link copied to clipboard!'));
        } else {
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showToast('🔗 Invite link copied to clipboard!');
        }
    });

    function showToast(msg) {
        if (toastMessage) toastMessage.textContent = msg;
        shareToast.classList.add('show');
        setTimeout(() => shareToast.classList.remove('show'), 2600);
    }

    /* ================================================================
       14. MOBILE VIEW SWITCHER (Small screens only)
       ================================================================ */
    if (mobileViewTabs) {
        mobileViewTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.mobile-tab');
            if (!tab) return;
            mobileViewTabs.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const view = tab.dataset.view;
            if (view === 'preview') {
                document.body.classList.remove('show-editor-view');
                document.body.classList.add('show-preview-view');
            } else {
                document.body.classList.remove('show-preview-view');
                document.body.classList.add('show-editor-view');
            }
        });
    }

    /* ================================================================
       15. INITIALIZATION
       ================================================================ */
    function init() {
        renderCoverGrid();
        syncContentInputs();
        document.body.setAttribute('data-theme', currentTheme);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
