/**
 * sh-inject.js
 * Injects: film grain, custom cursor, scroll-stick nav, scroll reveal
 * Loaded on sub-pages (about, blogs, publications)
 */
(function () {
  'use strict';

  /* ── inject grain ─────────────────────────────────────────── */
  const grain = document.createElement('div');
  grain.id = 'sh-grain';
  document.body.appendChild(grain);

  /* ── inject cursor ────────────────────────────────────────── */
  const dot  = document.createElement('div');
  dot.id     = 'sh-cur-dot';
  const ring = document.createElement('div');
  ring.id    = 'sh-cur-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let cx = 0, cy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function (e) {
    cx = e.clientX; cy = e.clientY;
    dot.style.left = cx + 'px';
    dot.style.top  = cy + 'px';
  });

  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity = ''; ring.style.opacity = '';
  });

  (function tick() {
    rx += (cx - rx) * 0.13;
    ry += (cy - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      document.body.classList.add('sh-hover');
    });
    el.addEventListener('mouseleave', function () {
      document.body.classList.remove('sh-hover');
    });
  });

  /* ── sticky nav ───────────────────────────────────────────── */
  var header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        header.classList.add('sh-stuck');
      } else {
        header.classList.remove('sh-stuck');
      }
    }, { passive: true });
  }

  /* ── scroll reveal ────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '.sh-reveal { opacity: 0; transform: translateY(28px);',
    '  transition: opacity .7s cubic-bezier(0.16,1,0.3,1),',
    '              transform .7s cubic-bezier(0.16,1,0.3,1); }',
    '.sh-reveal.sh-vis { opacity: 1; transform: translateY(0); }'
  ].join('\n');
  document.head.appendChild(style);

  // Mark sections for reveal
  var targets = document.querySelectorAll(
    '.elementor-section, .elementor-widget-container > h1,' +
    '.elementor-widget-container > h2, .elementor-widget-image'
  );
  targets.forEach(function (el) {
    el.classList.add('sh-reveal');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('sh-vis');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(function (el) { io.observe(el); });

  /* ── page-entry fade ──────────────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  window.addEventListener('load', function () {
    document.body.style.opacity = '1';
  });
  // Fallback
  setTimeout(function () { document.body.style.opacity = '1'; }, 500);

})();
