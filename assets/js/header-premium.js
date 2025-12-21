/**
 * Premium Header Scroll Effects
 * Handles header shrinking on scroll and mobile menu
 */

(function() {
  'use strict';

  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navClose = document.querySelector('[data-nav-close]');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

  let lastScrollY = window.scrollY;
  let ticking = false;

  // Scroll handler with RAF for performance
  function onScroll() {
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Update header based on scroll position
  function updateHeader() {
    if (lastScrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  // Open mobile menu
  function openMobileMenu() {
    if (mobileNav && mobileBackdrop) {
      mobileNav.classList.add('is-open');
      mobileBackdrop.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Focus first link
      const firstLink = mobileNav.querySelector('.mobile-nav-link');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }
  }

  // Close mobile menu
  function closeMobileMenu() {
    if (mobileNav && mobileBackdrop) {
      mobileNav.classList.remove('is-open');
      mobileBackdrop.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  }

  // Event listeners
  if (header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader(); // Check initial state
  }

  if (navToggle) {
    navToggle.addEventListener('click', openMobileMenu);
  }

  if (navClose) {
    navClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on window resize above mobile breakpoint
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 920 && mobileNav && mobileNav.classList.contains('is-open')) {
        closeMobileMenu();
      }
    }, 250);
  });

})();
