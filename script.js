/* ==========================================================================
   FAHAD SAJAD — EDITOR PORTFOLIO — behavior
   ========================================================================== */
(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scrub-bar nav: playhead position ----------
     The playhead's position (how far across the track it sits)
     mirrors how far down the page you've scrolled, like a video
     timeline's playhead. Driven by CSS scroll-driven animation where
     supported (zero JS cost); falls back to a throttled scroll
     listener in older browsers. */
  const scrubPlayhead = document.getElementById('scrubPlayhead');
  const supportsScrollTimeline = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: scroll()');
  if (scrubPlayhead && !supportsScrollTimeline) {
    let ticking = false;
    const updatePlayhead = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      scrubPlayhead.style.left = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updatePlayhead); ticking = true; }
    }, { passive: true });
    updatePlayhead();
  }

  /* ---------- Scrub-bar nav: drag/click to jump anywhere ----------
     Clicking or dragging across the track scrubs the page, like
     scrubbing a video timeline. Clicking directly on a stop (Work,
     Experience, etc.) still works as a normal link. */
  const scrubTrack = document.getElementById('scrubTrack');
  if (scrubTrack) {
    let dragging = false;
    const scrubTo = (clientX, smooth) => {
      const rect = scrubTrack.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: pct * max, behavior: smooth && !prefersReduced ? 'smooth' : 'auto' });
    };
    scrubTrack.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.scrub__stop')) return; // let the real link handle it
      dragging = true;
      document.documentElement.classList.add('is-scrubbing'); // suspend scroll-snap while dragging
      scrubTrack.setPointerCapture(e.pointerId);
      scrubTo(e.clientX, false);
    });
    scrubTrack.addEventListener('pointermove', (e) => {
      if (dragging) scrubTo(e.clientX, false);
    });
    ['pointerup', 'pointercancel'].forEach(ev => scrubTrack.addEventListener(ev, () => {
      dragging = false;
      document.documentElement.classList.remove('is-scrubbing');
    }));
  }

  /* ---------- Scrub-bar nav: highlight the current section ---------- */
  const scrubStops = document.querySelectorAll('.scrub__stop[href^="#"]');
  if ('IntersectionObserver' in window && scrubStops.length) {
    const stopFor = id => document.querySelector(`.scrub__stop[href="#${id}"]`);
    const sectionIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const stop = stopFor(entry.target.id);
        if (!stop) return;
        if (entry.isIntersecting) {
          scrubStops.forEach(s => s.classList.remove('is-current'));
          stop.classList.add('is-current');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    scrubStops.forEach(stop => {
      const id = stop.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) sectionIo.observe(section);
    });
  }

  /* ---------- Hero raw/graded comparison slider ----------
     Drag the handle (or click/tap anywhere in the frame) to reveal
     more of the graded side vs. the raw side. Keyboard users can
     focus the handle and use the arrow keys. */
  const gradeFrame = document.getElementById('gradeFrame');
  const gradeHandle = document.getElementById('gradeHandle');
  if (gradeFrame && gradeHandle) {
    const setSplit = (pct) => {
      pct = Math.max(0, Math.min(100, pct));
      gradeFrame.style.setProperty('--split', pct + '%');
      gradeHandle.setAttribute('aria-valuenow', String(Math.round(pct)));
    };
    const setSplitFromPointer = (clientX) => {
      const rect = gradeFrame.getBoundingClientRect();
      setSplit(((clientX - rect.left) / rect.width) * 100);
    };
    let gradeDragging = false;
    gradeFrame.addEventListener('pointerdown', (e) => {
      gradeDragging = true;
      gradeFrame.setPointerCapture(e.pointerId);
      setSplitFromPointer(e.clientX);
    });
    gradeFrame.addEventListener('pointermove', (e) => {
      if (gradeDragging) setSplitFromPointer(e.clientX);
    });
    ['pointerup', 'pointercancel'].forEach(ev => gradeFrame.addEventListener(ev, () => { gradeDragging = false; }));
    gradeHandle.addEventListener('keydown', (e) => {
      const current = parseFloat(gradeHandle.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft') { setSplit(current - 5); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { setSplit(current + 5); e.preventDefault(); }
      else if (e.key === 'Home') { setSplit(0); e.preventDefault(); }
      else if (e.key === 'End') { setSplit(100); e.preventDefault(); }
    });
  }

  /* ---------- Scroll-triggered reveals ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
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

  /* ---------- Smooth-scroll for in-page nav links (with header offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

})();
