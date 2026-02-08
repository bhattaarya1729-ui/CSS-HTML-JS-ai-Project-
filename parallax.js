document.body.classList.add('loading');

window.addEventListener('load', () => {
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
});

"use strict";

const GuptaEmpire = {
  config: {
    scrollThrottle: 16,
    intersectionThreshold: 0.1,
    mobileBreakpoint: 768,
  },

  dom: {},
  initialized: false,
  eventListeners: [],

  // ===============================
  // INIT
  // ===============================
  init() {
    if (this.initialized) return;
    this.initialized = true;
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');

    this.cacheDOM();
    this.cacheDOM();
    this.setupDisclaimer();
    this.setupNavbar();
    this.setupScrollProgress();
    this.setupHeroParallax();
    this.setupScrollAnimations();

    this.logSuccess();
  },

  cacheDOM() {
    this.dom = {
      body: document.body,
      navbar: document.querySelector(".navbar"),
      hero: document.querySelector(".hero"),
      heroBackground: document.querySelector(".hero-background"),
      overlayImage: document.querySelector(".overlay-image"),
      heroText: document.querySelector(".hero-text"),
      scrollProgress: document.querySelector(".scroll-progress"),
      mobileMenuBtn: document.querySelector(".mobile-menu-btn"),
      navLinks: document.querySelector(".nav-links"),
      disclaimerBar: document.querySelector(".disclaimer-bar"),
      disclaimerClose: document.querySelector(".disclaimer-close"),
      timelineItems: document.querySelectorAll(".timeline-item"),
      rulerCards: document.querySelectorAll(".ruler-card"),
      sourceCategories: document.querySelectorAll(".source-category"),
      sections: document.querySelectorAll(".section-animate"),
    };
  },

  // ===============================
  // UTILITIES
  // ===============================
  throttle(fn, delay) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, args);
      }
    };
  },

  isMobile() {
    return window.innerWidth < this.config.mobileBreakpoint;
  },

  addEventListener(target, event, handler, options = {}) {
    if (!target) return;
    target.addEventListener(event, handler, options);
    this.eventListeners.push({ target, event, handler });
  },

  cleanup() {
    this.eventListeners.forEach(({ target, event, handler }) => {
      target?.removeEventListener(event, handler);
    });
    this.eventListeners = [];
    this.initialized = false;
  },

  // ===============================
  // DISCLAIMER
  // ===============================
  this.addEventListener(this.dom.disclaimerClose, "click", () => {
      this.dom.disclaimerBar.classList.add("hidden");
      this.dom.body.classList.remove("has-disclaimer");
      this.dom.body.classList.add("disclaimer-dismissed"); // Add this
      localStorage.setItem("disclaimerDismissed", "true");

      setTimeout(() => {
        this.dom.disclaimerBar.style.display = "none";
      }, 300);
    });

    this.addEventListener(this.dom.disclaimerClose, "click", () => {
      this.dom.disclaimerBar.classList.add("hidden");
      this.dom.body.classList.remove("has-disclaimer");
      localStorage.setItem("disclaimerDismissed", "true");

      setTimeout(() => {
        this.dom.disclaimerBar.style.display = "none";
      }, 300);
    });
  },

  // ===============================
  // NAVBAR
  // ===============================
  setupNavbar() {
    this.setupNavbarScroll();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  },

  setupNavbarScroll() {
    if (!this.dom.navbar) return;

    const onScroll = this.throttle(() => {
      this.dom.navbar.classList.toggle("scrolled", window.scrollY > 100);
    }, 100);

    this.addEventListener(window, "scroll", onScroll, { passive: true });
  },

  setupMobileMenu() {
    const btn = this.dom.mobileMenuBtn;
    const menu = this.dom.navLinks;
    if (!btn || !menu) return;

    this.addEventListener(btn, "click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !expanded);
      menu.classList.toggle("active");
      this.dom.body.style.overflow = expanded ? "" : "hidden";
    });

    menu.querySelectorAll("a").forEach(link => {
      this.addEventListener(link, "click", () => {
        menu.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        this.dom.body.style.overflow = "";
      });
    });

    this.addEventListener(document, "click", (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        this.dom.body.style.overflow = "";
      }
    });
  },

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      this.addEventListener(link, "click", e => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;

        e.preventDefault();

        const navHeight = this.dom.navbar?.offsetHeight || 70;
        const disclaimerHeight =
          this.dom.disclaimerBar && !this.dom.disclaimerBar.classList.contains("hidden")
            ? 52
            : 0;

        window.scrollTo({
          top: target.offsetTop - navHeight - disclaimerHeight,
          behavior: "smooth",
        });
      });
    });
  },

  // ===============================
  // SCROLL PROGRESS
  // ===============================
  setupScrollProgress() {
    if (!this.dom.scrollProgress) return;

    const update = this.throttle(() => {
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const percent = (window.scrollY / height) * 100;
      this.dom.scrollProgress.style.width = `${percent}%`;
    }, this.config.scrollThrottle);

    this.addEventListener(window, "scroll", update, { passive: true });
  },

  // ===============================
  // HERO PARALLAX
  // ===============================
  setupHeroParallax() {
    if (!this.dom.hero) return;

    const onScroll = this.throttle(() => {
      if (this.isMobile()) return;

      const y = window.scrollY;
      const h = this.dom.hero.offsetHeight;
      if (y > h) return;

      this.dom.overlayImage &&
        (this.dom.overlayImage.style.transform =
          `translate(-50%, calc(-50% + ${y * 0.5}px))`);

      if (this.dom.heroText) {
        this.dom.heroText.style.transform =
          `translate(-50%, calc(-50% + ${y * 0.3}px))`;
        this.dom.heroText.style.opacity = Math.max(0, 1 - y / h);
      }

      this.dom.heroBackground &&
        (this.dom.heroBackground.style.transform =
          `translateY(${y * 0.4}px) scale(1.05)`);
    }, this.config.scrollThrottle);

    this.addEventListener(window, "scroll", onScroll, { passive: true });
  },

  // ===============================
  // INTERSECTION ANIMATIONS
  // ===============================
  setupScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          console.log("Made visible:", entry.target); // Debug line
        }
      });
    }, {
      threshold: 0.01, // Much lower threshold
      rootMargin: "0px 0px 0px 0px", // Remove negative margin
    });

    [
      ...this.dom.timelineItems,
      ...this.dom.rulerCards,
      ...this.dom.sourceCategories,
      ...this.dom.sections,
    ].forEach(el => el && observer.observe(el));
  },

  logSuccess() {
    console.log(
      "%c✅ Gupta Empire JS Loaded (No Loader)",
      "color:#c9a24d;font-weight:bold;font-size:14px;"
    );
  },
};

// ===============================
// BOOTSTRAP
// ===============================
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", () => GuptaEmpire.init(), { once: true })
  : GuptaEmpire.init();

window.addEventListener("unload", () => GuptaEmpire.cleanup());



