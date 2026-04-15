/**
 * VideoGrid Component
 * Handles the rendering of embedded YouTube videos for the platform phase 1 MVP.
 */

export class VideoGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        
        // Hardcoded latest videos for MVP phase 1
        // In Phase 2/3, this will be fetched via API and rendered dynamically
        this.videos = [
            {
                id: '1',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder until actual channel embeds are confirmed
                title: 'Official Music Video',
                isShort: false
            },
            {
                id: '2',
                embedUrl: 'https://www.youtube.com/embed/JGwWNGJdvx8', 
                title: 'Live Session performance',
                isShort: false
            },
            {
                id: '3',
                embedUrl: 'https://www.youtube.com/embed/y6120QOlsfU',
                title: 'Studio Vibes',
                isShort: false
            }
        ];
    }

    render() {
        if (!this.container) return;

        let html = '';
        
        this.videos.forEach(video => {
            const aspectClass = video.isShort ? 'short-format' : '';
            html += `
                <div class="video-card">
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
                </div>
            `;
        });

        this.container.innerHTML = html;
    }
}
