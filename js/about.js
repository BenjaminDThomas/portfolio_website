/* Generated with Claude — scroll-to-top button behaviour. */

(function () {
    'use strict';

    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        btn.hidden = window.scrollY < 400;
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}());