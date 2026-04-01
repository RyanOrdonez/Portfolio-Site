/* ============================================================
   Shared Navigation - Ryan Ordonez Portfolio
   Generates sidebar and mobile nav on every page.
   ============================================================ */
(function () {
  // Detect if we're in a subdirectory (e.g., posts/)
  var path = window.location.pathname;
  var inSubdir = /\/posts\//.test(path) || /\/blog\//.test(path);
  var prefix = inSubdir ? '../' : '';

  // Determine active section from current URL
  var active = 'hero';
  if (/about\.html/.test(path)) active = 'about';
  else if (/projects\.html/.test(path)) active = 'projects';
  else if (/skills\.html/.test(path)) active = 'skills';
  else if (/blog\.html/.test(path) || /\/posts\//.test(path) || /\/blog\//.test(path)) active = 'blog';
  else if (/#contact/.test(window.location.hash)) active = 'contact';

  function activeClass(section) {
    return section === active ? ' active' : '';
  }

  // Nav links data
  var navLinks = [
    { href: 'index.html', section: 'hero', label: 'Home', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { href: 'about.html', section: 'about', label: 'About', icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { href: 'projects.html', section: 'projects', label: 'Projects', icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
    { href: 'skills.html', section: 'skills', label: 'Skills', icon: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
    { href: 'index.html#contact', section: 'contact', label: 'Contact', icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
    { href: 'blog.html', section: 'blog', label: 'Blog', icon: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>' }
  ];

  // Build sidebar nav links HTML
  var navHTML = navLinks.map(function (link) {
    // On index.html, hero link should be "#hero" not "index.html"
    var href = prefix + link.href;
    if (link.section === 'hero' && active === 'hero' && !inSubdir) href = '#hero';
    return '<a href="' + href + '" class="sidebar-link' + activeClass(link.section) + '" data-section="' + link.section + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + link.icon + '</svg>' +
      '<span>' + link.label + '</span></a>';
  }).join('\n      ');

  // Build mobile nav links
  var mobileLinksHTML = navLinks.map(function (link) {
    return '<a href="' + prefix + link.href + '">' + link.label + '</a>';
  }).join('\n      ');

  // Theme toggle icons
  var sunIcon = '<svg class="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var moonIcon = '<svg class="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';

  // Sidebar HTML
  var sidebarHTML = '<div class="sidebar-profile">' +
    '<img src="' + prefix + 'assets/profile.png" alt="Ryan Ordonez" class="sidebar-avatar" />' +
    '<h2 class="sidebar-name">Ryan Ordonez</h2>' +
    '<div class="sidebar-socials">' +
      '<a href="https://github.com/RyanOrdonez" target="_blank" rel="noopener noreferrer" aria-label="GitHub">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>' +
      '</a>' +
      '<a href="https://linkedin.com/in/ryanordonez7" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' +
      '</a>' +
      '<a href="mailto:ryanordonez7@gmail.com" aria-label="Email">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
      '</a>' +
    '</div></div>' +
    '<nav class="sidebar-nav">' + navHTML + '</nav>' +
    '<button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">' +
      sunIcon + moonIcon + '<span class="theme-toggle-label">Light Mode</span>' +
    '</button>';

  // Mobile nav HTML
  var mobileHTML = '<a href="' + prefix + 'index.html" class="mobile-nav-logo">RO</a>' +
    '<div style="display:flex;align-items:center;gap:0.25rem;">' +
      '<button class="mobile-theme-toggle" id="mobile-theme-toggle" aria-label="Toggle theme">' + sunIcon + moonIcon + '</button>' +
      '<button class="mobile-nav-toggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>' +
    '</div>' +
    '<div class="mobile-nav-menu">' + mobileLinksHTML + '</div>';

  // Inject into DOM
  var sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = sidebarHTML;

  var mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) mobileNav.innerHTML = mobileHTML;

  // Theme toggle logic
  function getStoredTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* noop */ }
    var label = document.querySelector('.theme-toggle-label');
    if (label) label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  var storedTheme = getStoredTheme() || 'dark';
  setTheme(storedTheme);

  function handleToggle() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  var sidebarToggle = document.getElementById('theme-toggle');
  if (sidebarToggle) sidebarToggle.addEventListener('click', handleToggle);

  var mobileToggle = document.getElementById('mobile-theme-toggle');
  if (mobileToggle) mobileToggle.addEventListener('click', handleToggle);
})();
