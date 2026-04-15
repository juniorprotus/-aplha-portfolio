/**
 * VideoGrid Component
 * Renders a responsive grid of embedded YouTube video cards.
 * Accepts external data via constructor for backend-ready architecture.
 */

export class VideoGrid {
    constructor(containerId, videos = []) {
        this.container = document.getElementById(containerId);
        this.videos = videos;
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
            'music-video': 'Music Video',
            'live': 'Live Performance',
            'behind-the-scenes': 'Behind the Scenes',
            'freestyle': 'Freestyle'
        };
        return labels[category] || category;
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = this.videos.map(v => this.createVideoCard(v)).join('');
    }
}
