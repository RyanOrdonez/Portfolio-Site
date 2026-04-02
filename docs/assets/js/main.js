/**
 * main.js - Ryan Ordonez Portfolio Website
 * Vanilla JavaScript, no frameworks.
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. SMOOTH SCROLL
  // =========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetId = this.getAttribute("href");
        if (targetId === "#") return;
        var target = document.querySelector(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });

        // Close mobile menu if open
        var menu = document.querySelector(".mobile-nav-menu");
        var toggle = document.querySelector(".mobile-nav-toggle");
        if (menu) menu.classList.remove("active");
        if (toggle) toggle.classList.remove("active");
      });
    });
  }

  // =========================================================================
  // 2. MOBILE MENU
  // =========================================================================
  function initMobileMenu() {
    var toggle = document.querySelector(".mobile-nav-toggle");
    var menu = document.querySelector(".mobile-nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      toggle.classList.toggle("active");
      menu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        menu.classList.contains("active") &&
        !menu.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        toggle.classList.remove("active");
        menu.classList.remove("active");
      }
    });
  }

  // =========================================================================
  // 3. SCROLL ANIMATIONS
  // =========================================================================
  function initScrollAnimations() {
    var elements = document.querySelectorAll(".fade-in, .slide-in-left, .scale-in, .stagger-in");
    if (elements.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =========================================================================
  // 4. ACTIVE SIDEBAR LINK
  // =========================================================================
  function initActiveSidebarLink() {
    var sections = document.querySelectorAll("section[id]");
    var sidebarLinks = document.querySelectorAll(".sidebar-link");
    if (sections.length === 0 || sidebarLinks.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          sidebarLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("data-section") === id) {
              link.classList.add("active");
            }
          });
        });
      },
      { rootMargin: "-30% 0px -70% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // =========================================================================
  // 5. TYPING EFFECT
  // =========================================================================
  function initTypingEffect() {
    var element = document.querySelector(".hero-subtitle");
    if (!element) return;

    var fullText = element.textContent.trim();
    element.textContent = "";
    element.classList.add("typed-cursor");

    var charIndex = 0;

    function typeNextChar() {
      if (charIndex < fullText.length) {
        element.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, 40);
      } else {
        setTimeout(function () {
          element.classList.remove("typed-cursor");
        }, 2000);
      }
    }

    setTimeout(typeNextChar, 400);
  }

  // =========================================================================
  // 6. SCROLL TO TOP
  // =========================================================================
  function initScrollToTop() {
    var button = document.createElement("button");
    button.className = "scroll-to-top";
    button.setAttribute("aria-label", "Scroll to top");
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(button);

    function toggle() {
      if (window.scrollY > 400) {
        button.classList.add("visible");
      } else {
        button.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================================
  // INIT
  // =========================================================================
  function init() {
    initSmoothScroll();
    initMobileMenu();
    initScrollAnimations();
    initActiveSidebarLink();
    initTypingEffect();
    initScrollToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
