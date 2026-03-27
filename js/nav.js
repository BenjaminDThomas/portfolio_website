(function () {
    'use strict';

    var toggles = document.querySelectorAll('.nav-toggle');

    toggles.forEach(function (toggle) {
        var controlsId = toggle.getAttribute('aria-controls');
        var menu = controlsId ? document.getElementById(controlsId) : null;
        if (!menu) return;

        function closeMenu() {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('is-open');
        }

        toggle.addEventListener('click', function () {
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            menu.classList.toggle('is-open', !expanded);
        });

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (event) {
            if (!toggle.contains(event.target) && !menu.contains(event.target)) {
                closeMenu();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    });
}());
