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

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ==========================================
    // Mobile Navigation Toggle
    // ==========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        if (!navLinks.id) navLinks.id = 'site-nav-links';
        navToggle.setAttribute('aria-controls', navLinks.id);
        navToggle.setAttribute('aria-label', 'Open navigation');

        function isMenuOpen() {
            return navToggle.getAttribute('aria-expanded') === 'true';
        }

        function setMenu(open, returnFocus) {
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
            navToggle.classList.toggle('active', open);
            navLinks.classList.toggle('active', open);
            if (open) {
                // Wait for the menu to become visible; hidden elements can't take focus.
                const first = navLinks.querySelector('a');
                if (first) {
                    window.setTimeout(function() {
                        if (isMenuOpen()) first.focus({ preventScroll: true });
                    }, 60);
                }
            } else if (returnFocus) {
                navToggle.focus();
            }
        }

        navToggle.addEventListener('click', function() {
            setMenu(!isMenuOpen(), false);
        });

        // Close when a link is chosen
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                setMenu(false, false);
            });
        });

        // Close on Escape and return focus to the menu button
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen()) {
                setMenu(false, true);
            }
        });

        // Close on a tap or click outside the menu
        document.addEventListener('click', function(e) {
            if (isMenuOpen() && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                setMenu(false, false);
            }
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
            e.preventDefault();

            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) {
                showError('Please enter your email address.');
                return;
            }

            if (!validateEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }

            clearError();

            // Local development handling
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Form submitted with email:', email);
                window.location.href = '/success.html';
                return;
            }

            // Submit form via fetch and redirect to success page
            const formData = new FormData(downloadForm);

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(function(response) {
                if (response.ok) {
                    window.location.href = '/success.html';
                } else {
                    showError('Something went wrong. Please try again.');
                }
            })
            .catch(function(error) {
                console.error('Form submission error:', error);
                showError('Something went wrong. Please try again.');
            });
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

        window.addEventListener('scroll', handleScrollIndicatorFade, { passive: true });
    }

    // ==========================================
    // Reader Progress Tracker
    // ==========================================
    const readerProgressBar = document.querySelector('.reader-progress-bar');
    const readerProgressText = document.querySelector('.reader-progress-text');
    const readerContent = document.querySelector('.reader-content');
    let updateReadingProgress = null;

    if (readerProgressBar && readerContent) {
        let progressTimeout;

        updateReadingProgress = function() {
            const contentRect = readerContent.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how much of the content has been scrolled past
            const contentTop = contentRect.top;
            const contentHeight = contentRect.height;

            // Start counting progress when content starts to enter viewport
            // End when bottom of content reaches top of viewport
            const scrolled = -contentTop + windowHeight * 0.3; // Start earlier
            const total = contentHeight;

            let progress = Math.max(0, Math.min(100, (scrolled / total) * 100));

            // Update progress bar
            readerProgressBar.style.width = progress + '%';

            // Update progress text
            if (readerProgressText) {
                readerProgressText.textContent = Math.round(progress) + '% read';
                readerProgressText.classList.add('visible');

                // Hide after inactivity
                clearTimeout(progressTimeout);
                progressTimeout = setTimeout(function() {
                    readerProgressText.classList.remove('visible');
                }, 2000);
            }
        };

        window.addEventListener('scroll', updateReadingProgress, { passive: true });
        window.addEventListener('resize', updateReadingProgress);

        // Initial calculation
        updateReadingProgress();
    }

    // ==========================================
    // Initialize on DOM Ready
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
        // Initial scroll check for nav
        handleNavScroll();

        // Add loaded class for any initial animations
        document.body.classList.add('loaded');

        // Initial progress update for reader pages
        if (updateReadingProgress) {
            updateReadingProgress();
        }
    });

})();
