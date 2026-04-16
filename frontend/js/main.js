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

document.addEventListener('DOMContentLoaded', () => {
    // ─── Initialize Components ───────────────────────────────────
    const videoGrid = new VideoGrid('video-grid-container', videos);
    videoGrid.render();

    const musicSection = new MusicSection('music-section-container', songs);
    musicSection.render();

    const globalPlayer = new GlobalPlayer(songs);

    // ─── Render Tour Section ───
    const tourContainer = document.getElementById('tour-grid-container');
    if (tourContainer) {
        tourContainer.innerHTML = events.map(e => `
            <div class="tour-card" data-status="${e.status}">
                <div class="tour-info">
                    <div class="tour-date">${new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
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
    }

    // ─── Render Merch Section ───
    const merchContainer = document.getElementById('merch-grid-container');
    if (merchContainer) {
        merchContainer.innerHTML = merch.map(m => `
            <div class="merch-card">
                <div class="merch-badge">${m.status.replace('-', ' ').toUpperCase()}</div>
                <div class="merch-img-container">
                    <img src="${m.imageUrl}" alt="${m.title}" loading="lazy">
                </div>
                <div class="merch-details">
                    <h3 class="merch-title">${m.title}</h3>
                    <div class="merch-price">${m.price}</div>
                    <button class="btn btn-outline" style="width: 100%;">Pre-Order / View</button>
                </div>
            </div>
        `).join('');
    }

    // ─── VIP Newsletter Form Submission ─────────────────────────────────
    const vipForm = document.getElementById('vip-form');
    if (vipForm) {
        vipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = vipForm.querySelector('input');
            if (input && input.value) {
                // Mock Backend POST /api/fans logic here locally
                console.log('Subscribing email:', input.value);
                const btn = vipForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Subscribed!';
                btn.style.backgroundColor = 'var(--color-accent-gold)';
                btn.style.color = 'var(--color-bg)';
                input.value = '';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
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

