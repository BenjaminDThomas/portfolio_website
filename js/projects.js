(function () {
    'use strict';

    var tags = document.querySelectorAll('.proj-card__tag[data-tooltip]');
    var cards = document.querySelectorAll('.proj-card');

    cards.forEach(function (card) {
        var primaryLink = card.querySelector('.proj-card__link');
        if (!primaryLink) return;

        card.addEventListener('click', function (event) {
            if (window.innerWidth <= 900) return;
            if (event.target.closest('.proj-card__link')) return;
            if (event.target.closest('.proj-card__tag')) return;
            window.location.href = primaryLink.getAttribute('href');
        });

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', primaryLink.textContent.trim());
        card.addEventListener('keydown', function (event) {
            if (window.innerWidth <= 900) return;
            if (event.key === 'Enter') {
                event.preventDefault();
                window.location.href = primaryLink.getAttribute('href');
            }
        });
    });

    tags.forEach(function (tag) {
        tag.setAttribute('tabindex', '0');
        tag.setAttribute('role', 'button');
        tag.setAttribute('aria-expanded', 'false');

        function openTag() {
            tags.forEach(function (other) {
                if (other !== tag) {
                    other.classList.remove('is-active');
                    other.setAttribute('aria-expanded', 'false');
                }
            });
            tag.classList.add('is-active');
            tag.setAttribute('aria-expanded', 'true');
        }

        function closeTag() {
            tag.classList.remove('is-active');
            tag.setAttribute('aria-expanded', 'false');
        }

        tag.addEventListener('click', function () {
            if (window.innerWidth > 900) return;
            var isOpen = tag.classList.contains('is-active');
            if (isOpen) {
                closeTag();
            } else {
                openTag();
            }
        });

        tag.addEventListener('keydown', function (event) {
            if (window.innerWidth > 900) return;
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                var isOpen = tag.classList.contains('is-active');
                if (isOpen) {
                    closeTag();
                } else {
                    openTag();
                }
            }
            if (event.key === 'Escape') {
                closeTag();
            }
        });
    });

    document.addEventListener('click', function (event) {
        if (window.innerWidth > 900) return;
        if (!event.target.closest('.proj-card__tag')) {
            tags.forEach(function (tag) {
                tag.classList.remove('is-active');
                tag.setAttribute('aria-expanded', 'false');
            });
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) {
            tags.forEach(function (tag) {
                tag.classList.remove('is-active');
                tag.setAttribute('aria-expanded', 'false');
            });
        }
    });
}());
