"use strict";

const GuptaEmpire = {
    config: {
        mobileBreakpoint: 768,
    },

    dom: {},
    initialized: false,
    eventListeners: [],
    scrollObserver: null,

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.cacheDOM();
        this.setupDisclaimer();
        this.setupNavbar();
        this.setupScrollProgress();
        this.setupHeroParallax();
        this.setupScrollAnimations();
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
        
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
            this.scrollObserver = null;
        }
        
        this.initialized = false;
    },

    setupDisclaimer() {
        if (!this.dom.disclaimerBar || !this.dom.disclaimerClose) return;
        
        if (localStorage.getItem("disclaimerDismissed") === "true") {
            this.dom.disclaimerBar.style.display = "none";
            this.dom.body.classList.add("disclaimer-dismissed");
            return;
        }
        
        this.dom.body.classList.add("has-disclaimer");
        
        this.addEventListener(this.dom.disclaimerClose, "click", () => {
            this.dom.disclaimerBar.classList.add("hidden");
            this.dom.body.classList.remove("has-disclaimer");
            this.dom.body.classList.add("disclaimer-dismissed");
            localStorage.setItem("disclaimerDismissed", "true");
            
            setTimeout(() => {
                this.dom.disclaimerBar.style.display = "none";
            }, 300);
        });
    },

    setupNavbar() {
        this.setupNavbarScroll();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    },

    setupNavbarScroll() {
        if (!this.dom.navbar) return;

        const onScroll = () => {
            this.dom.navbar.classList.toggle("scrolled", window.scrollY > 100);
        };

        this.addEventListener(window, "scroll", onScroll, { passive: true });
    },

    setupMobileMenu() {
        const btn = this.dom.mobileMenuBtn;
        const menu = this.dom.navLinks;
        if (!btn || !menu) return;

        const updateMenuPosition = () => {
            const navHeight = this.dom.navbar.offsetHeight;
            const disclaimerHeight = this.dom.disclaimerBar && 
                !this.dom.disclaimerBar.classList.contains("hidden") 
                ? this.dom.disclaimerBar.offsetHeight 
                : 0;
            menu.style.top = `${navHeight + disclaimerHeight}px`;
            menu.style.height = `calc(100vh - ${navHeight + disclaimerHeight}px)`;
        };

        this.addEventListener(btn, "click", () => {
            const expanded = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", !expanded);
            menu.classList.toggle("active");
            this.dom.body.style.overflow = expanded ? "" : "hidden";
            
            if (!expanded) {
                updateMenuPosition();
            }
        });

        menu.querySelectorAll("a").forEach(link => {
            this.addEventListener(link, "click", () => {
                menu.classList.remove("active");
                btn.setAttribute("aria-expanded", "false");
                this.dom.body.style.overflow = "";
            });
        });

        this.addEventListener(document, "click", (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target) && menu.classList.contains("active")) {
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
                        ? this.dom.disclaimerBar.offsetHeight
                        : 0;

                window.scrollTo({
                    top: target.offsetTop - navHeight - disclaimerHeight,
                    behavior: "smooth",
                });
            });
        });
    },

    setupScrollProgress() {
        if (!this.dom.scrollProgress) return;

        const update = () => {
            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const percent = (window.scrollY / height) * 100;
            this.dom.scrollProgress.style.width = `${percent}%`;
        };

        this.addEventListener(window, "scroll", update, { passive: true });
    },

    setupHeroParallax() {
        if (!this.dom.hero) return;
        let ticking = false;

        const updateParallax = () => {
            if (this.isMobile()) {
                ticking = false;
                return;
            }
            
            const y = window.scrollY;
            const h = this.dom.hero.offsetHeight;
            
            if (y > h) {
                ticking = false;
                return;
            }

            if (this.dom.overlayImage) {
                this.dom.overlayImage.style.transform = 
                    `translate(-50%, calc(-50% + ${y * 0.5}px))`;
            }
            
            if (this.dom.heroText) {
                this.dom.heroText.style.transform = 
                    `translate(-50%, calc(-50% + ${y * 0.3}px))`;
                this.dom.heroText.style.opacity = Math.max(0, 1 - y / h);
            }
            
            if (this.dom.heroBackground) {
                this.dom.heroBackground.style.transform = 
                    `translateY(${y * 0.4}px) scale(1.05)`;
            }
            
            ticking = false;
        };

        this.addEventListener(window, "scroll", () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    },

    setupScrollAnimations() {
        this.scrollObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px",
        });

        [
            ...this.dom.timelineItems,
            ...this.dom.rulerCards,
            ...this.dom.sourceCategories,
            ...this.dom.sections,
        ].forEach(el => el && this.scrollObserver.observe(el));
    },
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => GuptaEmpire.init(), { once: true });
} else {
    GuptaEmpire.init();
}

window.addEventListener("unload", () => GuptaEmpire.cleanup());
