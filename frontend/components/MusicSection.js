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
        return `
            <div class="song-card" data-song-id="${song.id}" data-category="${song.category}" id="song-${song.id}">
                <div class="song-thumbnail">
                    <img src="${song.thumbnail}" alt="${song.title}" loading="lazy">
                    <div class="song-overlay">
                        <button class="play-btn" aria-label="Play ${song.title}" data-song-id="${song.id}">
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
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

        // Play button clicks (UI only — no actual playback)
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
     * Toggles the visual playing state for a song card.
     * @param {string} songId - The song ID to toggle.
     */
    togglePlay(songId) {
        const allCards = this.container.querySelectorAll('.song-card');

        allCards.forEach(card => {
            if (card.dataset.songId === songId) {
                const isPlaying = card.classList.toggle('is-playing');
                this.currentlyPlaying = isPlaying ? songId : null;

                // Update play button icon
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
            } else {
                card.classList.remove('is-playing');
                const btn = card.querySelector('.play-btn');
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
