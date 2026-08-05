/* ==========================================================================
   FAHAD SAJAD — EDITOR PORTFOLIO — behavior
   ========================================================================== */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loading screen (no edits needed) ----------
     Shows a short, simulated progress count while the page settles,
     then fades out. Purely cosmetic — nothing to configure here. */
  document.body.classList.add('is-loading');
  const loader = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  const loaderTC = document.getElementById('loaderTC');

  function finishLoading() {
    if (loader) loader.classList.add('loader--done');
    document.body.classList.remove('is-loading');
  }

  if (prefersReduced || !loader) {
    finishLoading();
  } else {
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += Math.random() * 18 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        if (loaderFill) loaderFill.style.width = '100%';
        if (loaderTC) loaderTC.textContent = '100%';
        setTimeout(finishLoading, 300);
        return;
      }
      if (loaderFill) loaderFill.style.width = `${progress}%`;
      if (loaderTC) loaderTC.textContent = `${Math.floor(progress)}%`;
    }, 130);
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Timecode helpers ---------- */
  function toTimecode(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const f = Math.floor((totalSeconds % 1) * 24); // pseudo-frames at 24fps
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
  }

  /* ---------- Live "REC" clock in hero ---------- */
  const liveClock = document.getElementById('liveClock');
  if (liveClock && !prefersReduced) {
    const start = performance.now();
    function tickClock(now) {
      const elapsed = (now - start) / 1000;
      liveClock.textContent = toTimecode(elapsed % 3600);
      requestAnimationFrame(tickClock);
    }
    requestAnimationFrame(tickClock);
  } else if (liveClock) {
    liveClock.textContent = '00:00:00:00';
  }

  /* ---------- Scroll progress scrubber (signature element) ---------- */
  const scrubberFill = document.getElementById('scrubberFill');
  const scrubberHead = document.getElementById('scrubberHead');
  const scrubberTC = document.getElementById('scrubberTC');
  const totalRunSeconds = 180; // maps full page scroll to a nominal 00:03:00:00 "runtime"

  function updateScrubber() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    if (scrubberFill) scrubberFill.style.width = `${progress * 100}%`;
    if (scrubberHead) scrubberHead.style.left = `${progress * 100}%`;
    if (scrubberTC) scrubberTC.textContent = toTimecode(progress * totalRunSeconds);
  }

  let scrubberTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrubberTicking) {
      requestAnimationFrame(() => {
        updateScrubber();
        scrubberTicking = false;
      });
      scrubberTicking = true;
    }
  }, { passive: true });
  updateScrubber();

  /* ---------- Nav background on scroll ---------- */
  const nav = document.getElementById('nav');
  function updateNavBg() {
    if (!nav) return;
    nav.style.background = window.scrollY > 40 ? 'rgba(10,10,9,.75)' : 'transparent';
    nav.style.backdropFilter = window.scrollY > 40 ? 'blur(10px)' : 'none';
  }
  window.addEventListener('scroll', updateNavBg, { passive: true });
  updateNavBg();

  /* ---------- Scroll-triggered reveals ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // stagger children of the same section slightly
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Project cards: auto-generate YouTube thumbnails ----------
     Each project card only needs a YouTube link in its
     data-youtube="..." attribute (see index.html). This code reads
     that link, pulls out the video ID, and sets the card's thumbnail
     image automatically (from YouTube's own image API). If the link
     hasn't been filled in yet, the card just keeps its placeholder
     color and does nothing else — no errors. */
  function getYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  document.querySelectorAll('.card[data-youtube]').forEach(card => {
    const link = card.getAttribute('data-youtube');
    const videoId = getYouTubeId(link);
    if (!videoId) return; // still a placeholder — leave the fallback color in place

    const frameBg = card.querySelector('.card__frame-bg');
    if (frameBg) {
      frameBg.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
    }
  });

  /* ---------- Video modal / lightbox ----------
     Clicking a project card opens its YouTube video in an on-page
     popup instead of a new tab. No edits needed — it reads the same
     data-youtube link already on each card. */
  const modal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalCloseBtn = document.getElementById('modalClose');

  function openModal(videoId, title) {
    if (!modal || !modalIframe) return;
    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    const label = title ? `${title} — project video player` : 'Project video player';
    modalIframe.title = label;
    modal.setAttribute('aria-label', label);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!modal || !modalIframe) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalIframe.src = ''; // stops playback when closed
  }

  document.querySelectorAll('.card[data-youtube]').forEach(card => {
    const trigger = card.querySelector('.card__frame');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const videoId = getYouTubeId(card.getAttribute('data-youtube'));
      if (!videoId) return; // no real link added yet — nothing to open
      const titleEl = card.querySelector('.card__info h3');
      openModal(videoId, titleEl ? titleEl.textContent.trim() : '');
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ---------- Custom cursor on project cards ----------
     Only activates on devices with a real mouse (see the media query
     in style.css) — touch devices keep their normal behavior. */
  const customCursor = document.getElementById('customCursor');
  const allCards = document.querySelectorAll('#projectGrid .card');
  if (customCursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
    });
    allCards.forEach(card => {
      card.addEventListener('mouseenter', () => customCursor.classList.add('is-active'));
      card.addEventListener('mouseleave', () => customCursor.classList.remove('is-active'));
    });
  }

  /* ---------- Smooth-scroll for in-page nav links (with header offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

})();
