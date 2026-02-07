// ===============================
// GUPTA EMPIRE — MASTER SCRIPT
// Fixed, Integrated & Optimized
// ===============================

'use strict';

/* ===============================
   CONFIGURATION
================================ */
const CONFIG = {
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  scrollThrottle: 16,
  intersectionThreshold: 0.1,
  particleCount: {
    desktop: 30,
    mobile: 10
  }
};

/* ===============================
   UTILITIES
================================ */
const Utils = {
  throttle(fn, delay) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn(...args);
      }
    };
  },

  debounce(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  },

  isMobile() {
    return window.innerWidth < CONFIG.breakpoints.mobile;
  },

  qs(sel) {
    try { return document.querySelector(sel); }
    catch { return null; }
  },

  qsa(sel) {
    try { return document.querySelectorAll(sel); }
    catch { return []; }
  }
};

/* ===============================
   DOM CACHE
================================ */
const DOM = {
  init() {
    this.navbar = Utils.qs('.navbar');
    this.hero = Utils.qs('.hero');
    this.overlayImage = Utils.qs('.overlay-image');
    this.heroText = Utils.qs('.hero-text');
    this.heroBackground = Utils.qs('.hero-background');
    this.scrollProgress = Utils.qs('.scroll-progress');
    this.mobileMenuBtn = Utils.qs('.mobile-menu-btn');
    this.navLinks = Utils.qs('.nav-links');
    this.timelineItems = Utils.qsa('.timeline-item');
    this.rulerCards = Utils.qsa('.ruler-card');
    this.sourceCategories = Utils.qsa('.source-category');
    this.sections = Utils.qsa('.section-animate');
  }
};

/* ===============================
   NAVBAR
================================ */
const Navbar = {
  init() {
    this.scrollEffect();
    this.mobileMenu();
    this.smoothScroll();
  },

  scrollEffect() {
    if (!DOM.navbar) return;

    window.addEventListener(
      'scroll',
      Utils.throttle(() => {
        DOM.navbar.classList.toggle('scrolled', window.scrollY > 100);
      }, 100),
      { passive: true }
    );
  },

  mobileMenu() {
    const btn = DOM.mobileMenuBtn;
    const menu = DOM.navLinks;
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !open);
      menu.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      })
    );
  },

  smoothScroll() {
    Utils.qsa('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href');
        if (id === '#') return;

        const target = Utils.qs(id);
        if (!target) return;

        e.preventDefault();
        const offset = DOM.navbar?.offsetHeight || 70;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      });
    });
  }
};

/* ===============================
   HERO PARALLAX
================================ */
const HeroParallax = {
  init() {
    if (Utils.isMobile() || !DOM.hero) return;

    window.addEventListener(
      'scroll',
      Utils.throttle(() => {
        const y = window.scrollY;
        const h = DOM.hero.offsetHeight;
        if (y > h) return;

        DOM.overlayImage &&
          (DOM.overlayImage.style.transform =
            `translate(-50%, calc(-50% + ${y * 0.5}px))`);

        DOM.heroText &&
          (DOM.heroText.style.transform =
            `translate(-50%, calc(-50% + ${y * 0.3}px))`);

        DOM.heroBackground &&
          (DOM.heroBackground.style.transform =
            `translateY(${y * 0.4}px) scale(1.05)`);
      }, CONFIG.scrollThrottle),
      { passive: true }
    );
  }
};

/* ===============================
   SCROLL ANIMATIONS
================================ */
const ScrollAnimations = {
  init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, {
      threshold: CONFIG.intersectionThreshold,
      rootMargin: '0px 0px -50px'
    });

    [
      ...DOM.timelineItems,
      ...DOM.rulerCards,
      ...DOM.sourceCategories,
      ...DOM.sections
    ].forEach(el => observer.observe(el));
  }
};

/* ===============================
   SCROLL PROGRESS
================================ */
const ScrollProgress = {
  init() {
    if (!DOM.scrollProgress) return;

    window.addEventListener(
      'scroll',
      Utils.throttle(() => {
        const h =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        DOM.scrollProgress.style.width =
          `${(window.scrollY / h) * 100}%`;
      }, CONFIG.scrollThrottle),
      { passive: true }
    );
  }
};

/* ===============================
   PAGE LOADER
================================ */
const PageLoader = {
  init() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
      }, 400);
    });
  }
};

/* ===============================
   APP BOOTSTRAP
================================ */
const App = {
  init() {
    DOM.init();
    PageLoader.init();
    Navbar.init();
    ScrollProgress.init();
    HeroParallax.init();
    ScrollAnimations.init();
    console.log('✅ Gupta Empire JS Loaded');
  }
};

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', App.init)
  : App.init();
