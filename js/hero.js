/* ai generated */
/*
-----------------
Hero Interaction
-----------------
*/
/* slide panels */
(function () {
    'use strict';
    var hero = document.getElementById('hero');
    var left = document.getElementById('heroLeft');
    var right = document.getElementById('heroRight');
    if (!hero || !left || !right) return;
    /* skip on touch devices */
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    /* hero width */
    var MIN = 42, MAX = 58, state = 'none';
    function apply(s) {
        if (s === state) return;
        state = s;
        hero.classList.remove('hover-left', 'hover-right');
        if (s === 'left') hero.classList.add('hover-left');
        if (s === 'right') hero.classList.add('hover-right');
    }
    hero.addEventListener('mousemove', function (e) {
        var pct = ((e.clientX - hero.getBoundingClientRect().left) / hero.offsetWidth) * 100;
        if (pct < MIN) apply('left');
        else if (pct > MAX) apply('right');
        else apply('centre');
    });
    hero.addEventListener('mouseleave', function () { apply('none'); });
}());