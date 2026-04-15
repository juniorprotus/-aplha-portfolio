/**
 * VideoGrid Component
 * Renders a responsive grid of embedded YouTube video cards.
 * Accepts external data via constructor for backend-ready architecture.
 */

export class VideoGrid {
    constructor(containerId, videos = []) {
        this.container = document.getElementById(containerId);
        this.videos = videos;
        this.activeFilter = 'all';
    }

    /**
     * Creates the HTML for the filter tabs.
     * @returns {string} HTML string for the filter bar.
     */
    createFilterTabs() {
        const categories = [
            { key: 'all', label: 'All Releases' },
            { key: 'music-video', label: 'Music Videos' },
            { key: 'freestyle', label: 'Freestyles' },
            { key: 'live', label: 'Live' }
        ];

        const tabs = categories.map(cat => `
            <button
                class="video-tab ${cat.key === this.activeFilter ? 'active' : ''}"
                data-filter="${cat.key}">
                ${cat.label}
            </button>
        `).join('');

        return `<div class="video-tabs" id="video-tabs">${tabs}</div>`;
    }

    /**
     * Creates the HTML for a single video card.
     * @param {Object} video - Video data object.
     * @returns {string} HTML string for the video card.
     */
    createVideoCard(video) {
        const aspectClass = video.isShort ? 'short-format' : '';
        return `
            <div class="video-card" data-video-id="${video.id}" data-category="${video.category}">
                <div class="video-wrapper ${aspectClass}">
                    <iframe
                        src="${video.embedUrl}"
                        title="${video.title}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                        loading="lazy">
                    </iframe>
                </div>
                <div class="video-card-info">
                    <h3 class="video-card-title">${video.title}</h3>
                    <span class="video-card-category">${this.formatCategory(video.category)}</span>
                </div>
            </div>
        `;
    }

    /**
     * Formats a category slug into a human-readable label.
     * @param {string} category - Category slug.
     * @returns {string} Formatted category name.
     */
    formatCategory(category) {
        const labels = {
            'music-video': 'MV',
            'live': 'Live',
            'behind-the-scenes': 'BTS',
            'freestyle': 'Freestyle'
        };
        return labels[category] || category;
    }

    bindEvents() {
        const tabContainer = document.getElementById('video-tabs');
        if (tabContainer) {
            tabContainer.addEventListener('click', (e) => {
                const tab = e.target.closest('.video-tab');
                if (!tab) return;

                this.activeFilter = tab.dataset.filter;
                this.render();
            });
        }
    }

    getFilteredVideos() {
        if (this.activeFilter === 'all') return this.videos;
        return this.videos.filter(v => v.category === this.activeFilter);
    }

    render() {
        if (!this.container) return;
        
        const filtered = this.getFilteredVideos();
        const videosHtml = filtered.length > 0
            ? filtered.map(v => this.createVideoCard(v)).join('')
            : '<p class="no-results">No videos found in this category.</p>';

        this.container.innerHTML = `
            ${this.createFilterTabs()}
            <div class="video-grid-inner">
                ${videosHtml}
            </div>
        `;

        this.bindEvents();
    }
}

