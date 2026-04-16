/**
 * Main Application Entry Point
 * Initializes all components and global behaviors.
 */

import { VideoGrid } from '../components/VideoGrid.js';
import { MusicSection } from '../components/MusicSection.js';
import { GlobalPlayer } from '../components/GlobalPlayer.js';
import { videos } from '../data/videos.js';
import { songs } from '../data/songs.js';
import { events } from '../data/events.js';
import { merch } from '../data/merch.js';

document.addEventListener('DOMContentLoaded', async () => {
    // ─── Data Fetching Helper ───
    async function fetchData(endpoint, fallbackData) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.warn(`Failed to fetch from ${endpoint}, using static fallback.`, error);
            return fallbackData;
        }
    }

    // ─── Fetch All Data ───
    const liveVideos = await fetchData('/api/videos', videos);
    const liveSongs = await fetchData('/api/songs', songs);
    const liveEvents = await fetchData('/api/events', events);
    const liveMerch = await fetchData('/api/merch', merch);

    // ─── Initialize Components with Live Data ───
    // Map backend thumbnail_url to thumbnail if needed
    const mappedVideos = liveVideos.map(v => ({ ...v, thumbnail: v.thumbnail_url || v.thumbnail }));
    const mappedSongs = liveSongs.map(s => ({ ...s, thumbnail: s.thumbnail_url || s.thumbnail }));

    const videoGrid = new VideoGrid('video-grid-container', mappedVideos);
    videoGrid.render();

    const musicSection = new MusicSection('music-section-container', mappedSongs);
    musicSection.render();

    const globalPlayer = new GlobalPlayer(mappedSongs);

    // ─── Render Tour Section ───
    const tourContainer = document.getElementById('tour-grid-container');
    if (tourContainer) {
        if (liveEvents.length > 0) {
            tourContainer.innerHTML = liveEvents.map(e => `
                <div class="tour-card" data-status="${e.status}">
                    <div class="tour-info">
                        <div class="tour-date">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div class="tour-title">${e.title}</div>
                        <div class="tour-venue">${e.venue} • ${e.location}</div>
                    </div>
                    <div class="tour-actions">
                        ${e.status === 'upcoming'
                            ? `<span class="tour-status upcoming">Tickets</span>`
                            : `<span class="tour-status past">Past</span>`}
                    </div>
                </div>
            `).join('');
        } else {
            tourContainer.innerHTML = `
                <div class="text-center py-5">
                    <p class="text-muted">No upcoming shows scheduled. Check back later for updates!</p>
                </div>
            `;
        }
    }

    // ─── Render Merch Section ───
    const merchContainer = document.getElementById('merch-grid-container');
    if (merchContainer) {
        merchContainer.innerHTML = liveMerch.map(m => `
            <div class="merch-card">
                <div class="merch-badge">${m.status.replace('-', ' ').toUpperCase()}</div>
                <div class="merch-img-container">
                    <img src="${m.image_url || m.imageUrl}" alt="${m.title}" loading="lazy">
                </div>
                <div class="merch-details">
                    <h3 class="merch-title">${m.title}</h3>
                    <div class="merch-price">${m.price}</div>
                    <button class="btn btn-outline" style="width: 100%;">Pre-Order / View</button>
                </div>
            </div>
        `).join('');
    }

    // ─── VIP Newsletter Form Submission (Real implementation ready) ───────────
    const vipForm = document.getElementById('vip-form');
    if (vipForm) {
        vipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = vipForm.querySelector('input');
            const btn = vipForm.querySelector('button');
            
            if (input && input.value) {
                const originalText = btn.textContent;
                btn.textContent = 'Joining...';
                btn.disabled = true;

                try {
                    const res = await fetch('/api/fans', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: 'Fan', email: input.value, message: 'VIP Newsletter Signup' })
                    });

                    if (!res.ok) throw new Error('API request failed');

                    btn.textContent = 'Welcome to the Circle!';
                    btn.style.backgroundColor = 'var(--color-accent-gold)';
                    input.value = '';
                } catch (err) {
                    console.error('Signup error:', err);
                    btn.textContent = 'Error. Try again?';
                } finally {
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.backgroundColor = '';
                    }, 4000);
                }
            }
        });
    }

    // ─── Mobile Navigation Toggle ────────────────────────────────
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ─── Navbar Scroll Effect ────────────────────────────────────
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // ─── Active Nav Link Tracking ────────────────────────────────
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    // ─── Smooth Scrolling ────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ─── Scroll Reveal Animations ────────────────────────────────
    const revealElements = document.querySelectorAll('.about, .videos, .music');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
});

