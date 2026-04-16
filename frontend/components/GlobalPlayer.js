/**
 * GlobalPlayer Component
 * Manages the sticky bottom audio player.
 */

export class GlobalPlayer {
    constructor(songs = []) {
        this.songs = songs;
        this.currentIndex = 0;
        this.player = null;
        this.isPlaying = false;
        this.isApiReady = false;
        this.init();
    }

    init() {
        this.elements = {
            container: document.getElementById('global-player'),
            thumb: document.getElementById('gp-thumbnail'),
            title: document.getElementById('gp-title'),
            playBtn: document.getElementById('gp-play'),
            prevBtn: document.getElementById('gp-prev'),
            nextBtn: document.getElementById('gp-next'),
            closeBtn: document.getElementById('gp-close'),
            ytContainer: document.getElementById('gp-youtube-container')
        };

        if (!this.elements.container) return;

        this.bindEvents();
        this.initYouTubeApi();
    }

    initYouTubeApi() {
        if (window.YT && window.YT.Player) {
            this.handleApiReady();
            return;
        }

        const checkReady = setInterval(() => {
            if (window.YT && window.YT.Player) {
                this.handleApiReady();
                clearInterval(checkReady);
            }
        }, 500);
    }

    handleApiReady() {
        this.isApiReady = true;
        this.player = new YT.Player('gp-youtube-container', {
            height: '0',
            width: '0',
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
            },
            events: {
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
    }

    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.updatePlayBtn();
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            this.isPlaying = false;
            this.updatePlayBtn();
            if (event.data === YT.PlayerState.ENDED) {
                this.next(); // Auto-play next song
            }
        }
    }

    bindEvents() {
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        this.elements.prevBtn.addEventListener('click', () => this.prev());
        this.elements.nextBtn.addEventListener('click', () => this.next());
        this.elements.closeBtn.addEventListener('click', () => {
            this.pause();
            this.elements.container.classList.remove('active');
        });

        // Optional: hook into MusicSection play buttons
        document.body.addEventListener('click', (e) => {
            const musicPlayBtn = e.target.closest('.play-btn');
            if (musicPlayBtn) {
                const ytId = musicPlayBtn.dataset.ytId;
                const songId = musicPlayBtn.dataset.songId;
                if (ytId) this.playSongById(songId);
            }
        });
    }

    playSongById(songId) {
        const index = this.songs.findIndex(s => s.id === songId);
        if (index > -1) {
            this.currentIndex = index;
            this.loadCurrentSong(true);
        }
    }

    loadCurrentSong(autoPlay = false) {
        if (!this.songs.length) return;
        const song = this.songs[this.currentIndex];
        
        this.elements.title.textContent = song.title;
        this.elements.thumb.src = song.thumbnail;
        this.elements.container.classList.add('active'); // Show player

        if (this.isApiReady && this.player && this.player.loadVideoById) {
            if (autoPlay) {
                this.player.loadVideoById(song.youtubeId);
                this.isPlaying = true;
            } else {
                this.player.cueVideoById(song.youtubeId);
                this.isPlaying = false;
            }
            this.updatePlayBtn();
        }
    }

    togglePlay() {
        if (!this.player || !this.player.getPlayerState) return;
        
        const state = this.player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.player && this.player.playVideo) {
            this.player.playVideo();
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.player && this.player.pauseVideo) {
            this.player.pauseVideo();
            this.isPlaying = false;
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.songs.length;
        this.loadCurrentSong(true);
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
        this.loadCurrentSong(true);
    }

    updatePlayBtn() {
        this.elements.playBtn.innerHTML = this.isPlaying 
            ? '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
            : '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }
}
