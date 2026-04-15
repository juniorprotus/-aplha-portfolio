/**
 * MusicSection Component
 * Renders a filterable grid of song cards with play button UI.
 * Accepts external data via constructor for backend-ready architecture.
 */


export class MusicSection {
    constructor(containerId, songs = []) {
        this.container = document.getElementById(containerId);
        this.songs = songs;
        this.activeFilter = 'all';
        this.currentlyPlaying = null;
        this.player = null;
        this.isApiReady = false;
        
        this.initYouTubeApi();
    }

    /**
     * Initializes the YouTube IFrame Player API.
     */
    initYouTubeApi() {
        if (window.YT && window.YT.Player) {
            this.isApiReady = true;
            return;
        }

        // Add API script if not already present
        if (!document.getElementById('youtube-api-script')) {
            const tag = document.createElement('script');
            tag.id = 'youtube-api-script';
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Global callback for YT API
        window.onYouTubeIframeAPIReady = () => {
            this.isApiReady = true;
            // Notify components if needed, or just rely on checks before play
        };
    }

    /**
     * Creates or gets the hidden player container.
     */
    ensurePlayer(youtubeId) {
        let playerContainer = document.getElementById('music-player-hidden');
        if (!playerContainer) {
            playerContainer = document.createElement('div');
            playerContainer.id = 'music-player-hidden';
            playerContainer.style.display = 'none';
            document.body.appendChild(playerContainer);
        }

        if (this.player && this.player.getIframe()) {
            this.player.loadVideoById(youtubeId);
            return;
        }

        this.player = new YT.Player('music-player-hidden', {
            height: '0',
            width: '0',
            videoId: youtubeId,
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'rel': 0,
                'modestbranding': 1
            },
            events: {
                'onReady': (event) => {
                    event.target.playVideo();
                },
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        this.stopAllPlaybackUI();
                    }
                }
            }
        });
    }

    /**
     * Creates the HTML for the filter tabs.
     * @returns {string} HTML string for the filter bar.
     */
    createFilterTabs() {
        const categories = [
            { key: 'all', label: 'All Tracks' },
            { key: 'single', label: 'Singles' },
            { key: 'freestyle', label: 'Freestyles' }
        ];

        const tabs = categories.map(cat => `
            <button
                class="music-tab ${cat.key === this.activeFilter ? 'active' : ''}"
                data-filter="${cat.key}"
                id="music-tab-${cat.key}">
                ${cat.label}
            </button>
        `).join('');

        return `<div class="music-tabs" id="music-tabs">${tabs}</div>`;
    }

    /**
     * Creates the HTML for a single song card.
     * @param {Object} song - Song data object.
     * @returns {string} HTML string for the song card.
     */
    createSongCard(song) {
        const isCurrent = this.currentlyPlaying === song.id;
        return `
            <div class="song-card ${isCurrent ? 'is-playing' : ''}" data-song-id="${song.id}" data-category="${song.category}" id="song-${song.id}">
                <div class="song-thumbnail">
                    <img src="${song.thumbnail}" alt="${song.title}" loading="lazy">
                    <div class="song-overlay">
                        <button class="play-btn" aria-label="Play ${song.title}" data-song-id="${song.id}">
                            ${isCurrent ? `
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                </svg>
                            ` : `
                                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            `}
                        </button>
                    </div>
                </div>
                <div class="song-info">
                    <h3 class="song-title">${song.title}</h3>
                    <div class="song-meta">
                        <span class="song-category-badge">${song.category === 'single' ? 'Single' : 'Freestyle'}</span>
                        <span class="song-duration">${song.duration}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Returns songs filtered by the active category.
     * @returns {Array} Filtered songs.
     */
    getFilteredSongs() {
        if (this.activeFilter === 'all') return this.songs;
        return this.songs.filter(song => song.category === this.activeFilter);
    }

    /**
     * Binds click events to filter tabs and play buttons.
     */
    bindEvents() {
        // Filter tab clicks
        const tabContainer = document.getElementById('music-tabs');
        if (tabContainer) {
            tabContainer.addEventListener('click', (e) => {
                const tab = e.target.closest('.music-tab');
                if (!tab) return;

                this.activeFilter = tab.dataset.filter;
                this.render();
            });
        }

        // Play button clicks
        const songGrid = document.getElementById('song-grid');
        if (songGrid) {
            songGrid.addEventListener('click', (e) => {
                const playBtn = e.target.closest('.play-btn');
                if (!playBtn) return;

                const songId = playBtn.dataset.songId;
                this.togglePlay(songId);
            });
        }
    }

    /**
     * Toggles the visual playing state and actual audio for a song card.
     * @param {string} songId - The song ID to toggle.
     */
    togglePlay(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;

        if (this.currentlyPlaying === songId) {
            // Already playing this song, so pause
            this.pausePlayback();
        } else {
            // Playing a new song
            this.startPlayback(song);
        }
    }

    startPlayback(song) {
        this.currentlyPlaying = song.id;
        this.updateUI();

        if (this.isApiReady) {
            this.ensurePlayer(song.youtubeId);
            if (this.player && this.player.playVideo) {
                this.player.playVideo();
            }
        } else {
            console.warn('YouTube API not ready yet.');
        }
    }

    pausePlayback() {
        this.currentlyPlaying = null;
        this.updateUI();

        if (this.player && this.player.pauseVideo) {
            this.player.pauseVideo();
        }
    }

    stopAllPlaybackUI() {
        this.currentlyPlaying = null;
        this.updateUI();
    }

    updateUI() {
        const allCards = this.container.querySelectorAll('.song-card');
        allCards.forEach(card => {
            const sid = card.dataset.songId;
            const isPlaying = sid === this.currentlyPlaying;
            
            card.classList.toggle('is-playing', isPlaying);
            
            const btn = card.querySelector('.play-btn');
            if (isPlaying) {
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>`;
            } else {
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>`;
            }
        });
    }

    render() {
        if (!this.container) return;

        const filtered = this.getFilteredSongs();

        const songsHtml = filtered.length > 0
            ? filtered.map(song => this.createSongCard(song)).join('')
            : '<p class="no-results">No tracks found in this category.</p>';

        this.container.innerHTML = `
            ${this.createFilterTabs()}
            <div class="song-grid" id="song-grid">
                ${songsHtml}
            </div>
        `;

        this.bindEvents();
    }
}

