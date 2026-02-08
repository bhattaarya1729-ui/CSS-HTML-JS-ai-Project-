// ===============================
// GUPTA EMPIRE - COMPLETE JS
// Fixed & Optimized Version
// ===============================

"use strict";

const GuptaEmpire = {
  // Configuration
  config: {
    scrollThrottle: 16,
    intersectionThreshold: 0.1,
    mobileBreakpoint: 768,
  },

  // DOM Elements Cache
  dom: {},

  // Initialize
  init() {
    this.cacheDOM();
    this.setupPageLoader();
    this.setupDisclaimer();
    this.setupNavbar();
    this.setupScrollProgress();
    this.setupHeroParallax();
    this.setupScrollAnimations();
    this.logSuccess();
  },

  // Cache DOM elements
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
      pageLoader: document.querySelector(".page-loader"),
      timelineItems: document.querySelectorAll(".timeline-item"),
      rulerCards: document.querySelectorAll(".ruler-card"),
      sourceCategories: document.querySelectorAll(".source-category"),
      sections: document.querySelectorAll(".section-animate"),
    };
  },

  // Utility: Throttle function
  throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  },

  // Utility: Check if mobile
  isMobile() {
    return window.innerWidth < this.config.mobileBreakpoint;
  },

  
  setupPageLoader() {
    document.addEventListener("DOMContentLoaded", () => {
      this.dom.body.classList.remove("loading");
      this.dom.body.classList.add("loaded");

      if (this.dom.pageLoader) {
        this.dom.pageLoader.style.display = "none";
      }
    });
  },

  // Setup Disclaimer Bar
  setupDisclaimer() {
    if (!this.dom.disclaimerBar) return;

    // Check if disclaimer was previously dismissed
    const dismissed = localStorage.getItem("disclaimerDismissed");

    if (dismissed === "true") {
      this.dom.disclaimerBar.style.display = "none";
    } else {
      this.dom.body.classList.add("has-disclaimer");
    }

    // Close button handler
    if (this.dom.disclaimerClose) {
      this.dom.disclaimerClose.addEventListener("click", () => {
        this.dom.disclaimerBar.classList.add("hidden");
        this.dom.body.classList.remove("has-disclaimer");
        localStorage.setItem("disclaimerDismissed", "true");

        setTimeout(() => {
          this.dom.disclaimerBar.style.display = "none";
        }, 300);
      });
    }
  },

  // Setup Navbar
  setupNavbar() {
    this.setupNavbarScroll();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  },

  // Navbar scroll effect
  setupNavbarScroll() {
    if (!this.dom.navbar) return;

    const handleScroll = this.throttle(() => {
      if (window.scrollY > 100) {
        this.dom.navbar.classList.add("scrolled");
      } else {
        this.dom.navbar.classList.remove("scrolled");
      }
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
  },

  // Mobile menu
  setupMobileMenu() {
    const btn = this.dom.mobileMenuBtn;
    const menu = this.dom.navLinks;

    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !isExpanded);
      menu.classList.toggle("active");

      // Prevent body scroll when menu is open
      if (!isExpanded) {
        this.dom.body.style.overflow = "hidden";
      } else {
        this.dom.body.style.overflow = "";
      }
    });

    // Close menu when clicking on links
    const links = menu.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        this.dom.body.style.overflow = "";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        this.dom.body.style.overflow = "";
      }
    });
  },

  // Smooth scroll for navigation links
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navHeight = this.dom.navbar?.offsetHeight || 70;
        const disclaimerHeight =
          this.dom.disclaimerBar &&
          !this.dom.disclaimerBar.classList.contains("hidden")
            ? 52
            : 0;
        const offset = navHeight + disclaimerHeight;

        const targetPosition = target.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      });
    });
  },

  // Scroll Progress Bar
  setupScrollProgress() {
    if (!this.dom.scrollProgress) return;

    const updateProgress = this.throttle(() => {
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;

      this.dom.scrollProgress.style.width = `${scrolled}%`;
      this.dom.scrollProgress.setAttribute(
        "aria-valuenow",
        Math.round(scrolled),
      );
    }, this.config.scrollThrottle);

    window.addEventListener("scroll", updateProgress, { passive: true });
  },

  // Hero Parallax Effect
  setupHeroParallax() {
    // Skip parallax on mobile for performance
    if (this.isMobile() || !this.dom.hero) return;

    const handleParallax = this.throttle(() => {
      const scrollY = window.scrollY;
      const heroHeight = this.dom.hero.offsetHeight;

      // Only apply parallax when in hero section
      if (scrollY > heroHeight) return;

      // Sun moves slower (0.5x)
      if (this.dom.overlayImage) {
        this.dom.overlayImage.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.5}px))`;
      }

      // Text moves even slower (0.3x) and fades out
      if (this.dom.heroText) {
        const opacity = 1 - (scrollY / heroHeight) * 1.5;
        this.dom.heroText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
        this.dom.heroText.style.opacity = Math.max(0, opacity);
      }

      // Background moves slowest (0.4x)
      if (this.dom.heroBackground) {
        this.dom.heroBackground.style.transform = `translateY(${scrollY * 0.4}px) scale(1.05)`;
      }
    }, this.config.scrollThrottle);

    window.addEventListener("scroll", handleParallax, { passive: true });
  },

  // Scroll Animations with Intersection Observer
  setupScrollAnimations() {
    const observerOptions = {
      threshold: this.config.intersectionThreshold,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Optional: Stop observing after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const elementsToAnimate = [
      ...this.dom.timelineItems,
      ...this.dom.rulerCards,
      ...this.dom.sourceCategories,
      ...this.dom.sections,
    ];

    elementsToAnimate.forEach((el) => {
      if (el) observer.observe(el);
    });
  },

  // Log success message
  logSuccess() {
    console.log(
      "%c✅ Gupta Empire Loaded Successfully",
      "color: #c9a24d; font-size: 16px; font-weight: bold;",
    );
    console.log(
      "%cWebsite created by Aarya",
      "color: #f7c110; font-size: 12px;",
    );
  },
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => GuptaEmpire.init());
} else {
  GuptaEmpire.init();
}

// Expose for debugging (optional)
window.GuptaEmpire = GuptaEmpire;
