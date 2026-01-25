/**
 * The Ghosts We Carry - Main JavaScript
 */

(function() {
    'use strict';

    // ==========================================
    // Navigation Scroll Effect
    // ==========================================
    const nav = document.querySelector('.nav');

    function handleNavScroll() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll);

    // ==========================================
    // Mobile Navigation Toggle
    // ==========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // Form Validation
    // ==========================================
    const downloadForm = document.getElementById('download-form');

    if (downloadForm) {
        const emailInput = downloadForm.querySelector('input[type="email"]');
        const errorDisplay = downloadForm.querySelector('.form-error');

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function validateEmail(email) {
            return emailRegex.test(email);
        }

        function showError(message) {
            if (errorDisplay) {
                errorDisplay.textContent = message;
            }
        }

        function clearError() {
            if (errorDisplay) {
                errorDisplay.textContent = '';
            }
        }

        // Clear error on input
        if (emailInput) {
            emailInput.addEventListener('input', clearError);
        }

        downloadForm.addEventListener('submit', function(e) {
            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) {
                e.preventDefault();
                showError('Please enter your email address.');
                return;
            }

            if (!validateEmail(email)) {
                e.preventDefault();
                showError('Please enter a valid email address.');
                return;
            }

            clearError();

            // Local development handling
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                e.preventDefault();
                console.log('Form submitted with email:', email);
                alert('Form submission simulated (local dev). Email: ' + email);
                return;
            }

            // In production, form will submit normally to Netlify
        });
    }

    // ==========================================
    // Thread Card Click-to-Link
    // ==========================================
    document.querySelectorAll('.thread-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking the actual link
            if (e.target.tagName === 'A') return;

            const href = this.dataset.href;
            if (href) {
                window.location.href = href;
            }
        });
    });

    // ==========================================
    // Keyboard Navigation for Cards
    // ==========================================
    document.querySelectorAll('.thread-card').forEach(function(card) {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const href = this.dataset.href;
                if (href) {
                    window.location.href = href;
                }
            }
        });
    });

    // ==========================================
    // Scroll Indicator Fade
    // ==========================================
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        function handleScrollIndicatorFade() {
            const scrollY = window.scrollY;
            const opacity = Math.max(0, 1 - (scrollY / 300));
            scrollIndicator.style.opacity = opacity * 0.6; // Base opacity is 0.6
        }

        window.addEventListener('scroll', handleScrollIndicatorFade);
    }

    // ==========================================
    // Initialize on DOM Ready
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
        // Initial scroll check for nav
        handleNavScroll();

        // Add loaded class for any initial animations
        document.body.classList.add('loaded');
    });

})();
