/* Generated with Claude — progress bar, section-nav active
   highlight on scroll, section reveal animations, mobile dropdown,
   and scroll-to-top behaviour.
*/

/*
-----------------
Case Study
-----------------
*/

/* Disable browser scroll restoration so page always starts at top */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

(function () {
    'use strict';
    var nav          = document.querySelector('.site-nav');
    var scrollBtn    = document.getElementById('scrollTop');
    var progressFill = document.getElementById('csProgressFill');
    /* nav is always solid on case study pages */
    if (nav) {
        nav.style.background   = '#0a0a0a';
        nav.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
    }
    /* force similar section visible immediately — no animation */
    document.querySelectorAll('.cs-section--similar').forEach(function (s) {
        s.classList.add('is-visible');
        s.style.opacity   = '1';
        s.style.transform = 'none';
    });
    /* scroll to top */
    function updateScrollBtn() {
        if (!scrollBtn) return;
        scrollBtn[window.pageYOffset > 400 ? 'removeAttribute' : 'setAttribute']('hidden', '');
    }
    if (scrollBtn) { scrollBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }); }
    /* reading progress bar */
    function updateProgress() {
        if (!progressFill) return;
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var pct  = docH > 0 ? Math.min(100, (window.pageYOffset / docH) * 100) : 0;
        progressFill.style.width = pct + '%';
    }
    /* active section nav link */
    var navLinks = document.querySelectorAll('.cs-section-nav__list a');
    var sections = document.querySelectorAll('.cs-section[id]');
    function updateActiveNav() {
        var scrollY = window.pageYOffset + 200;
        var current = '';
        sections.forEach(function (sec) {
            if (sec.offsetTop <= scrollY) { current = sec.id; }
        });
        navLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', function () {
        updateScrollBtn();
        updateProgress();
        updateActiveNav();
    }, { passive: true });
    updateScrollBtn();
    updateProgress();
    updateActiveNav();
    /* smooth scroll tabbed sections to centre */
    document.querySelectorAll('.cs-section, .cs-outcome').forEach(function (el) {
        el.addEventListener('focus', function () {
            setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
        });
    });

    var allSections = document.querySelectorAll('.cs-section:not(.cs-section--similar)');

    if (!('IntersectionObserver' in window)) {
        /* fallback — just show everything */
        allSections.forEach(function (s) { s.classList.add('is-visible'); });
    } else {
        allSections.forEach(function (s) {
            if (s.getBoundingClientRect().top > window.innerHeight) {
                s.classList.add('cs-reveal');
            }
        });

        /* Step 2: observe the hidden sections and reveal them as they scroll in */
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    /* tiny stagger based on index */
                    var idx = 0;
                    allSections.forEach(function (s, i) { if (s === e.target) { idx = i; } });
                    var delay = (idx % 3) * 80;
                    setTimeout(function () {
                        e.target.classList.add('is-visible');
                    }, delay);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });

        allSections.forEach(function (s) {
            if (s.classList.contains('cs-reveal')) {
                obs.observe(s);
            }
        });
    }

    /* section nav mobile dropdown */
    var navToggle   = document.querySelector('.cs-section-nav__toggle');
    var navDropdown = document.getElementById('cs-section-dropdown');
    if (navToggle && navDropdown) {
        navToggle.addEventListener('click', function () {
            var expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navDropdown.hidden = expanded;
        });
        navDropdown.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navToggle.setAttribute('aria-expanded', 'false');
                navDropdown.hidden = true;
            });
        });
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navDropdown.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navDropdown.hidden = true;
            }
        });
    }
}());