/**
 * main.js - Ryan Ordonez Portfolio Website
 * Vanilla JavaScript, no frameworks.
 * Handles navigation, animations, GitHub project fetching, and UI interactions.
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. SMOOTH SCROLL NAVIGATION
  // =========================================================================

  /**
   * Attach smooth scroll behavior to all anchor links that point to an
   * on-page section (href starts with "#").
   */
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /**
   * Make the navigation bar background more opaque as the user scrolls
   * down the page. A class "scrolled" is toggled on the nav element.
   */
  function initNavScrollEffect() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on load in case the page is already scrolled.
    onScroll();
  }

  // =========================================================================
  // 2. MOBILE MENU TOGGLE
  // =========================================================================

  function initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const mobileNav = document.querySelector(".nav-links");
    if (!hamburger || !mobileNav) return;

    // Toggle the menu open/closed when the hamburger button is clicked.
    hamburger.addEventListener("click", function (event) {
      event.stopPropagation();
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("active");
    });

    // Close the menu when any nav link inside it is clicked.
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
      });
    });

    // Close the menu when clicking anywhere outside of it.
    document.addEventListener("click", function (event) {
      if (
        mobileNav.classList.contains("active") &&
        !mobileNav.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
      }
    });
  }

  // =========================================================================
  // 3. SCROLL ANIMATIONS (IntersectionObserver)
  // =========================================================================

  /**
   * Observe all elements with the class "fade-in". When they scroll into
   * the viewport, add the "visible" class to trigger a CSS transition.
   * Grid children receive a staggered delay based on their index.
   */
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll(".fade-in");
    if (fadeElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const element = entry.target;

        // If the element is inside a grid or flex container, stagger its
        // children so they animate one after another.
        const parent = element.parentElement;
        if (parent) {
          const siblings = Array.from(
            parent.querySelectorAll(".fade-in")
          );
          const index = siblings.indexOf(element);
          if (index > 0) {
            element.style.transitionDelay = index * 0.1 + "s";
          }
        }

        element.classList.add("visible");
        obs.unobserve(element);
      });
    }, observerOptions);

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =========================================================================
  // 4. GITHUB PROJECTS FETCHER
  // =========================================================================

  /** Map of programming languages to their brand colors. */
  const LANGUAGE_COLORS = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    "Jupyter Notebook": "#DA5B0B",
    HTML: "#e34c26",
    R: "#198CE7",
  };

  /** Repos that should never appear in the projects grid. */
  const EXCLUDED_REPOS = [
    "RyanOrdonez",
    "Claude-Clode-Start",
    "MyFirstRepo",
    "Data-Science-For-Beginners",
  ];

  /**
   * Convert a repo name such as "my-cool-project" into "My Cool Project".
   */
  function formatRepoName(name) {
    return name
      .replace(/-/g, " ")
      .replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
  }

  /**
   * Format a date string from the GitHub API into a human-readable form
   * like "Mar 26, 2026".
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /**
   * Build the HTML string for a single project card.
   */
  function createProjectCard(repo) {
    const languageDot = repo.language
      ? '<span class="language-dot" style="background-color: ' +
        (LANGUAGE_COLORS[repo.language] || "#858585") +
        ';"></span>' +
        '<span class="language-name">' +
        repo.language +
        "</span>"
      : "";

    return (
      '<div class="repo-card">' +
      "<h4>" +
      '<a href="' +
      repo.html_url +
      '" target="_blank" rel="noopener noreferrer">' +
      formatRepoName(repo.name) +
      "</a></h4>" +
      "<p>" +
      (repo.description || "No description provided.") +
      "</p>" +
      '<div class="repo-meta">' +
      '<span class="repo-language">' +
      languageDot +
      "</span>" +
      '<span class="repo-updated">Updated ' +
      formatDate(repo.updated_at) +
      "</span>" +
      "</div>" +
      "</div>"
    );
  }

  /**
   * Fetch public repositories from GitHub, filter them, and render project
   * cards into the #github-projects container.
   */
  async function fetchGitHubProjects() {
    const container = document.getElementById("github-repos");
    if (!container) return;

    // Show a loading indicator while the request is in flight.
    container.innerHTML =
      '<div class="loading-indicator">' +
      '<div class="loading-spinner"></div>' +
      "<p>Loading projects...</p>" +
      "</div>";

    try {
      const response = await fetch(
        "https://api.github.com/users/RyanOrdonez/repos?per_page=100&sort=updated&type=public"
      );

      if (!response.ok) {
        throw new Error("GitHub API responded with status " + response.status);
      }

      const repos = await response.json();

      // Remove excluded repositories.
      const filtered = repos.filter(function (repo) {
        return !EXCLUDED_REPOS.includes(repo.name);
      });

      if (filtered.length === 0) {
        container.innerHTML =
          '<p class="projects-empty">No projects to display at this time.</p>';
        return;
      }

      // Build and insert all project cards.
      container.innerHTML = filtered.map(createProjectCard).join("");

      // Re-observe newly created fade-in elements so they animate on scroll.
      initScrollAnimations();
    } catch (error) {
      console.error("Failed to fetch GitHub projects:", error);
      container.innerHTML =
        '<div class="projects-error">' +
        "<p>Unable to load projects right now. Please visit " +
        '<a href="https://github.com/RyanOrdonez" target="_blank" rel="noopener noreferrer">' +
        "my GitHub profile</a> directly.</p>" +
        "</div>";
    }
  }

  // =========================================================================
  // 5. TYPING EFFECT FOR HERO
  // =========================================================================

  /**
   * Type out the contents of the hero subtitle one character at a time.
   * A blinking cursor is appended via CSS on the element with the class
   * "typed-cursor".
   */
  function initTypingEffect() {
    const element = document.querySelector(".hero-subtitle");
    if (!element) return;

    const fullText = element.textContent.trim();
    element.textContent = "";
    element.classList.add("typed-cursor");

    let charIndex = 0;
    var typingSpeed = 50; // milliseconds per character

    function typeNextChar() {
      if (charIndex < fullText.length) {
        element.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        // Keep the cursor blinking for a moment, then remove it.
        setTimeout(function () {
          element.classList.remove("typed-cursor");
        }, 2000);
      }
    }

    // Short delay after page load before typing begins.
    setTimeout(typeNextChar, 500);
  }

  // =========================================================================
  // 6. ACTIVE NAVIGATION HIGHLIGHTING
  // =========================================================================

  /**
   * Track which section is currently in the viewport and mark the
   * corresponding nav link as active.
   */
  function initActiveNavHighlighting() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.getAttribute("id");

        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + currentId) {
            link.classList.add("active");
          }
        });
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // =========================================================================
  // 7. CONTACT FORM (visual-only, no backend)
  // =========================================================================

  /**
   * Intercept contact form submission, display a confirmation message,
   * and reset the form fields.
   */
  function initContactForm() {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Create and display a brief confirmation message.
      var confirmation = document.createElement("div");
      confirmation.className = "form-confirmation";
      confirmation.textContent = "Message sent! Thank you for reaching out.";

      // Replace submit button text or append confirmation after the form.
      var existingConfirmation = form.parentElement.querySelector(
        ".form-confirmation"
      );
      if (existingConfirmation) {
        existingConfirmation.remove();
      }

      form.parentElement.appendChild(confirmation);
      form.reset();

      // Remove the confirmation after a few seconds.
      setTimeout(function () {
        confirmation.classList.add("fade-out");
        setTimeout(function () {
          confirmation.remove();
        }, 500);
      }, 4000);
    });
  }

  // =========================================================================
  // 8. SCROLL TO TOP BUTTON
  // =========================================================================

  /**
   * Create a "back to top" button that appears when the user scrolls
   * past 500 pixels. Clicking it smoothly scrolls back to the top.
   */
  function initScrollToTop() {
    // Create the button element dynamically.
    const button = document.createElement("button");
    button.className = "scroll-to-top";
    button.setAttribute("aria-label", "Scroll to top");
    button.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" width="24" height="24">' +
      '<polyline points="18 15 12 9 6 15"></polyline>' +
      "</svg>";

    document.body.appendChild(button);

    // Show or hide based on scroll position.
    function toggleButton() {
      if (window.scrollY > 500) {
        button.classList.add("visible");
      } else {
        button.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", toggleButton, { passive: true });
    toggleButton();

    // Scroll to top on click.
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================================
  // 9. COUNTER ANIMATION FOR STATS
  // =========================================================================

  /**
   * Animate numeric stat elements so they count up from zero to their
   * target value when scrolled into view. The target value is read from
   * the data-count attribute or from the element's text content.
   */
  function initCounterAnimation() {
    const counters = document.querySelectorAll(".stat-number");
    if (counters.length === 0) return;

    var duration = 2000; // Total animation duration in milliseconds.

    function animateCounter(element) {
      var target = parseInt(
        element.getAttribute("data-count") || element.textContent,
        10
      );
      if (isNaN(target)) return;

      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out curve for a natural feel.
        var easedProgress = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(easedProgress * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = target;
        }
      }

      requestAnimationFrame(step);
    }

    var observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  /**
   * Boot everything up once the DOM is fully parsed.
   */
  function init() {
    initSmoothScroll();
    initNavScrollEffect();
    initMobileMenu();
    initScrollAnimations();
    initActiveNavHighlighting();
    initTypingEffect();
    initContactForm();
    initScrollToTop();
    initCounterAnimation();

    // Fetch GitHub projects (async, runs in the background).
    fetchGitHubProjects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
