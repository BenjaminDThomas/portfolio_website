/* Generated with Claude — scroll-driven road animation,
   section reveal, nav transparency, and connector lines.
*/

/*
-----------------
Workflow — Road + connectors
-----------------
*/
(function () {
    'use strict';
    var roadBody  = document.getElementById('wfRoadBody');
    var track     = document.getElementById('wfTrack');
    var progress  = document.getElementById('wfProgress');
    var car       = document.getElementById('wfCar');
    var road      = document.getElementById('wfRoad');
    var scrollBtn = document.getElementById('scrollTop');
    var cards     = document.querySelectorAll('.wf-card');
    var nav       = document.querySelector('.site-nav');
    var NAV_H     = 78;
    var navSolid  = false;
    var allSections     = document.querySelectorAll('.wf-section');
    var contentSections = Array.prototype.filter.call(allSections, function (s) {
        return !s.classList.contains('wf-section--deliverable');
    });
    var deliverableSection = document.querySelector('.wf-section--deliverable');
    var gCx = 0, gFirstNodeY = 0, gRoadEndY = 0;
    var svgNS = 'http://www.w3.org/2000/svg';

    /* table of contents drawer */
    var tocToggle = document.getElementById('wfTocToggle');
    var tocDrawer = document.getElementById('wfTocDrawer');
    var tocClose  = document.getElementById('wfTocClose');
    var tocBackdrop = document.getElementById('wfTocBackdrop');

    function openToc() {
        if (tocDrawer) tocDrawer.classList.add('wf-toc-drawer--open');
        if (tocBackdrop) tocBackdrop.classList.add('wf-toc-backdrop--active');
        if (tocToggle) tocToggle.style.display = 'none';
    }

    function closeToc() {
        if (tocDrawer) tocDrawer.classList.remove('wf-toc-drawer--open');
        if (tocBackdrop) tocBackdrop.classList.remove('wf-toc-backdrop--active');
        if (tocToggle) tocToggle.style.display = 'inline-block';
    }

    if (tocToggle) tocToggle.addEventListener('click', openToc);
    if (tocClose)  tocClose.addEventListener('click', closeToc);
    if (tocBackdrop) tocBackdrop.addEventListener('click', closeToc);

    document.querySelectorAll('.wf-toc-list a').forEach(function (link) {
        link.addEventListener('click', function () {
            closeToc();
        });
    });

    /* helpers */
    function pageY(el) { var y = 0, cur = el; while (cur && cur !== document.body) { y += cur.offsetTop || 0; cur = cur.offsetParent; } return Math.round(y); }
    function pageX(el) { var x = 0, cur = el; while (cur && cur !== document.body) { x += cur.offsetLeft || 0; cur = cur.offsetParent; } return Math.round(x); }
    /* nav */
    function updateNav() {
        if (!nav) return;
        if (window.pageYOffset > 10) {
            navSolid = true;
            nav.setAttribute('style', 'background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.06);transition:background 0.35s ease,border-color 0.35s ease;');
        } else {
            navSolid = false;
            nav.setAttribute('style', 'background:transparent;border-bottom:1px solid transparent;transition:background 0.35s ease,border-color 0.35s ease;');
        }
    }
    updateNav();
    /* road clip */
    function updateRoadClip() {
        if (!road) return;
        if (navSolid) {
            var clip = 'inset(' + (window.pageYOffset + NAV_H) + 'px 0px 0px 0px)';
            road.style.clipPath = clip;
            road.style.webkitClipPath = clip;
        } else {
            road.style.clipPath = 'none';
            road.style.webkitClipPath = 'none';
        }
    }
    /* segment definitions */
    var segDefs = [
        { id: 'wfSegGym',     cls: 'wf-section--gym',        stroke: 'rgba(255,255,255,0.7)' },
        { id: 'wfSegCycling', cls: 'wf-section--cycling',    stroke: '#4ade80' },
        { id: 'wfSegChess',   cls: 'wf-section--chess',      stroke: '#a78bfa' },
        { id: 'wfSegCoding',  cls: 'wf-section--coding',     stroke: '#60a5fa' },
        { id: 'wfSegEval',    cls: 'wf-section--evaluation', stroke: '#f87171' }
    ];
    /* car + line colour per section */
    var carColours = [
        { cls: 'wf-section--gym',        colour: '#ffffff' },
        { cls: 'wf-section--cycling',    colour: '#4ade80' },
        { cls: 'wf-section--chess',      colour: '#a78bfa' },
        { cls: 'wf-section--coding',     colour: '#60a5fa' },
        { cls: 'wf-section--evaluation', colour: '#f87171' }
    ];
    /* coloured progress segments — one path per section, drawn in order */
    var progressSegs = [];
    function buildProgressSegs() {
        /* remove by reference */
        progressSegs.forEach(function (p) { if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el); });
        /* also sweep any orphaned wf-road__progress paths left in the SVG */
        var orphans = road.querySelectorAll('path.wf-road__progress');
        orphans.forEach(function (o) { o.parentNode.removeChild(o); });
        progressSegs = [];
        /* hero entry segment — white (matches gym/research section) */
        var heroSeg = document.createElementNS(svgNS, 'path');
        heroSeg.setAttribute('class', 'wf-road__progress');
        heroSeg.setAttribute('stroke', '#ffffff');
        heroSeg.style.filter = 'drop-shadow(0 0 6px #ffffff)';
        road.insertBefore(heroSeg, car);
        progressSegs.push({ el: heroSeg, colour: '#ffffff', sectionCls: null });
        /* one segment per section */
        carColours.forEach(function (c) {
            var seg = document.createElementNS(svgNS, 'path');
            seg.setAttribute('class', 'wf-road__progress');
            seg.setAttribute('stroke', c.colour);
            seg.style.filter = 'drop-shadow(0 0 6px ' + c.colour + ')';
            road.insertBefore(seg, car);
            progressSegs.push({ el: seg, colour: c.colour, sectionCls: c.cls });
        });
    }
    /* build road */
    function buildRoad() {
        if (!road) return;
        document.documentElement.classList.add('wf-measuring');
        var docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        var docW = window.innerWidth || document.documentElement.clientWidth;
        road.setAttribute('height', docH);
        road.setAttribute('width',  docW);
        gRoadEndY = docH - 20;
        if (deliverableSection) { var dY = pageY(deliverableSection); if (dY > 0) gRoadEndY = dY + 2; }
        var firstNode = document.querySelector('.wf-exercise-node');
        if (!firstNode) { document.documentElement.classList.remove('wf-measuring'); return; }
        gFirstNodeY = Math.round(pageY(firstNode) + firstNode.offsetHeight / 2);
        gCx         = Math.round(pageX(firstNode) + firstNode.offsetWidth  / 2);
        var fn = gFirstNodeY, amp = Math.min(docW * 0.26, 260), startX = Math.round(docW * 0.82);
        var curve    = 'M ' + startX + ',0 C ' + startX + ',' + Math.round(fn * 0.60) + ' ' + Math.round(gCx + amp * 0.3) + ',' + Math.round(fn * 0.90) + ' ' + gCx + ',' + fn;
        var fullPath = curve + ' L ' + gCx + ',' + gRoadEndY;
        if (roadBody) roadBody.setAttribute('d', fullPath);
        if (track)    track.setAttribute('d', fullPath);
        if (progress) { progress.setAttribute('d', ''); progress.style.display = 'none'; }
        var heroDash = document.getElementById('wfHeroDash');
        if (heroDash) heroDash.setAttribute('d', curve);
        var sectionTops = segDefs.map(function (seg) { var sec = document.querySelector('.' + seg.cls); return sec ? pageY(sec) : null; });
        segDefs.forEach(function (seg, i) {
            var el = document.getElementById(seg.id);
            if (!el || sectionTops[i] === null) return;
            var y1 = Math.max(sectionTops[i], fn);
            var y2 = Math.min((i + 1 < sectionTops.length && sectionTops[i + 1] !== null) ? sectionTops[i + 1] : gRoadEndY, gRoadEndY);
            el.style.stroke = seg.stroke;
            el.setAttribute('d', y2 > y1 ? 'M ' + gCx + ',' + y1 + ' L ' + gCx + ',' + y2 : '');
        });
        var endDot = document.getElementById('wfEndDot');
        if (endDot) { endDot.setAttribute('cx', String(gCx)); endDot.setAttribute('cy', String(gRoadEndY)); }
        /* initial car colour white to match gym section */
        if (car) { car.setAttribute('cx', String(startX)); car.setAttribute('cy', '0'); car.setAttribute('fill', '#ffffff'); }
        buildProgressSegs();
        updateRoadClip();
        document.documentElement.classList.remove('wf-measuring');
    }
    /* build connectors */
    function buildConnectors() {
        var gConn = document.getElementById('wfConnectors');
        if (!road || !gConn) return;
        gConn.innerHTML = '';
        var circleR = 68;
        contentSections.forEach(function (sec) {
            var accent = 'rgba(255,255,255,0.45)';
            if (sec.classList.contains('wf-section--cycling'))    accent = 'rgba(74,222,128,0.6)';
            if (sec.classList.contains('wf-section--chess'))      accent = 'rgba(167,139,250,0.6)';
            if (sec.classList.contains('wf-section--coding'))     accent = 'rgba(96,165,250,0.6)';
            if (sec.classList.contains('wf-section--evaluation')) accent = 'rgba(248,113,113,0.6)';
            Array.prototype.forEach.call(sec.querySelectorAll('.wf-step'), function (stepEl) {
                var nameEl = stepEl.querySelector('.wf-step__name');
                var cardEl = stepEl.querySelector('.wf-card');
                if (!nameEl || !cardEl) return;
                var cy = pageY(nameEl) + nameEl.offsetHeight / 2;
                var cardL = pageX(cardEl), cardR = cardL + cardEl.offsetWidth;
                var isRight = cardL > gCx;
                var circEdge = isRight ? gCx + circleR : gCx - circleR;
                var cardEdge = isRight ? cardL : cardR;
                if (Math.abs(cardEdge - circEdge) < 8) return;
                var p = document.createElementNS(svgNS, 'path');
                p.setAttribute('class', 'wf-connector');
                p.setAttribute('d', 'M ' + circEdge + ',' + cy + ' L ' + cardEdge + ',' + cy);
                p.setAttribute('stroke', accent);
                p.classList.add(isRight ? 'wf-connector--march-right' : 'wf-connector--march-left');
                var dot = document.createElementNS(svgNS, 'circle');
                dot.setAttribute('cx', String(circEdge));
                dot.setAttribute('cy', String(cy));
                dot.setAttribute('r', '3');
                dot.setAttribute('fill', accent);
                gConn.appendChild(p);
                gConn.appendChild(dot);
            });
        });
    }
    /* update road progress segments + car */
    function updateRoad() {
        if (!track) return;
        var len = track.getTotalLength ? track.getTotalLength() : 0;
        if (!len || !progressSegs.length) return;
        var roadScroll = gRoadEndY > window.innerHeight ? gRoadEndY - window.innerHeight : document.documentElement.scrollHeight - window.innerHeight;
        var pct = roadScroll > 0 ? Math.max(0, Math.min(window.pageYOffset / roadScroll, 1)) : 0;
        var scrollDriven = pct * len, drawLen = scrollDriven;
        if (navSolid && track.getPointAtLength) {
            var targetDocY = window.pageYOffset + NAV_H + (window.innerHeight - NAV_H) * 0.6;
            var lo = 0, hi = len, mid;
            for (var i = 0; i < 24; i++) { mid = (lo + hi) / 2; if (track.getPointAtLength(mid).y < targetDocY) { lo = mid; } else { hi = mid; } }
            drawLen = Math.min(Math.max(lo, scrollDriven), len);
        }
        /* for each segment find its y range, clamp drawn length to that range */
        progressSegs.forEach(function (seg, idx) {
            var segStart, segEnd;
            if (seg.sectionCls === null) {
                /* hero segment covers from start to gFirstNodeY on the path */
                segStart = 0;
                if (track.getPointAtLength) {
                    var slo = 0, shi = len, smid;
                    for (var si = 0; si < 24; si++) { smid = (slo + shi) / 2; if (track.getPointAtLength(smid).y < gFirstNodeY) { slo = smid; } else { shi = smid; } }
                    segEnd = slo;
                } else { segEnd = len; }
            } else {
                var thisSec  = document.querySelector('.' + seg.sectionCls);
                var nextSeg  = progressSegs[idx + 1];
                var nextCls  = nextSeg ? nextSeg.sectionCls : null;
                var nextSec  = nextCls ? document.querySelector('.' + nextCls) : null;
                if (!thisSec || !track.getPointAtLength) { seg.el.setAttribute('d', ''); return; }
                var thisTop = pageY(thisSec);
                var slo2 = 0, shi2 = len, smid2;
                for (var si2 = 0; si2 < 24; si2++) { smid2 = (slo2 + shi2) / 2; if (track.getPointAtLength(smid2).y < thisTop) { slo2 = smid2; } else { shi2 = smid2; } }
                segStart = slo2;
                if (nextSec) {
                    var nextTop = pageY(nextSec);
                    var slo3 = 0, shi3 = len, smid3;
                    for (var si3 = 0; si3 < 24; si3++) { smid3 = (slo3 + shi3) / 2; if (track.getPointAtLength(smid3).y < nextTop) { slo3 = smid3; } else { shi3 = smid3; } }
                    segEnd = slo3;
                } else { segEnd = len; }
            }
            var clampedEnd = Math.min(drawLen, segEnd);
            if (clampedEnd <= segStart) {
                seg.el.setAttribute('d', '');
                seg.el.style.strokeDasharray = '';
            } else {
                seg.el.setAttribute('d', track.getAttribute('d'));
                var dashOffset = segStart;
                var dashDraw   = clampedEnd - segStart;
                seg.el.style.strokeDasharray  = '0 ' + dashOffset + ' ' + dashDraw + ' ' + len;
                seg.el.style.strokeDashoffset = '0';
            }
        });
        /* update car colour from current section */
        if (car && track.getPointAtLength) {
            var pt = track.getPointAtLength(drawLen);
            car.setAttribute('cx', String(pt.x));
            car.setAttribute('cy', String(pt.y));
            var carColour = '#ffffff';
            for (var ci = carColours.length - 1; ci >= 0; ci--) {
                var csec = document.querySelector('.' + carColours[ci].cls);
                if (csec && pt.y >= pageY(csec)) { carColour = carColours[ci].colour; break; }
            }
            car.setAttribute('fill', carColour);
            car.style.filter = 'drop-shadow(0 0 10px ' + carColour + ')';
        }
        updateRoadClip();
    }
    /* centre scale */
    function updateCentreScale() {
        var vCentre = window.pageYOffset + window.innerHeight * 0.5;
        var closest = null, closestDist = Infinity;
        cards.forEach(function (card) {
            var r = card.getBoundingClientRect();
            var mid = window.pageYOffset + r.top + r.height / 2;
            var dist = Math.abs(mid - vCentre);
            card.classList.remove('is-centered');
            if (dist < closestDist) { closestDist = dist; closest = card; }
        });
        if (closest && closestDist < window.innerHeight * 0.6) closest.classList.add('is-centered');
    }
    /* intersection observer */
    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.06 });
        allSections.forEach(function (s) { obs.observe(s); });
    } else {
        allSections.forEach(function (s) { s.classList.add('is-visible'); });
    }
    /* scroll to top */
    function updateScrollBtn() {
        if (!scrollBtn) return;
        scrollBtn[window.pageYOffset > 400 ? 'removeAttribute' : 'setAttribute']('hidden', '');
    }
    if (scrollBtn) { scrollBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }); }
    /* smooth scroll focused cards to centre of viewport */
    document.querySelectorAll('.wf-card').forEach(function (card) {
        card.addEventListener('focus', function () {
            setTimeout(function () { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
        });
    });
    /* rebuild */
    function rebuild() { buildRoad(); buildConnectors(); updateRoad(); }
    var roadReady = false, lastScrollY = -1, lastDocH = -1, isResizing = false, resizeTimer = null;
    function rafLoop() {
        if (!isResizing) {
            var sy = window.pageYOffset, dh = document.documentElement.scrollHeight;
            if (dh !== lastDocH) { lastDocH = dh; roadReady = false; scheduleRebuild(); }
            if (sy !== lastScrollY) { lastScrollY = sy; if (!roadReady) { rebuild(); roadReady = true; } }
        }
        requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);
    function onScroll() {
        if (!roadReady && !isResizing) { rebuild(); roadReady = true; }
        updateNav();
        updateRoad();
        updateScrollBtn();
        updateCentreScale();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
        isResizing = true; roadReady = false;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { isResizing = false; lastDocH = -1; lastScrollY = -1; rebuild(); roadReady = true; }, 300);
    }, { passive: true });
    var rebuildPending = false;
    function scheduleRebuild() {
        if (rebuildPending) return;
        rebuildPending = true;
        requestAnimationFrame(function () { requestAnimationFrame(function () { rebuild(); rebuildPending = false; roadReady = true; }); });
    }
    var trackedHeight = 0;
    function checkAndRebuild() {
        var h = document.documentElement.scrollHeight;
        if (h !== trackedHeight) { trackedHeight = h; roadReady = false; scheduleRebuild(); }
    }
    Array.prototype.forEach.call(document.querySelectorAll('img'), function (img) {
        if (!img.complete) { img.addEventListener('load', checkAndRebuild); img.addEventListener('error', checkAndRebuild); }
    });
    scheduleRebuild();
    window.addEventListener('load', function () {
        roadReady = false; scheduleRebuild();
        setTimeout(function () { roadReady = false; scheduleRebuild(); }, 300);
    });
}());