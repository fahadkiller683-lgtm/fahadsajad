/* ==========================================================================
   FAHAD SAJAD — EDITOR PORTFOLIO — behavior
   Contact Sheet / Light Table build
   ========================================================================== */
(() => {
  'use strict';

  /* Flips the no-js/js gate immediately, before anything below can throw,
     so CSS that depends on JS being alive (like hiding the system cursor
     in favor of the loupe) never fires unless this script actually ran. */
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loading screen ---------- */
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
        setTimeout(finishLoading, 250);
        return;
      }
      if (loaderFill) loaderFill.style.width = `${progress}%`;
      if (loaderTC) loaderTC.textContent = `${Math.floor(progress)}%`;
    }, 120);
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

  /* ---------- Light bar: shows scroll position along the sheet ---------- */
  const lightWindow = document.getElementById('scrubberHead');
  function updateLightbar() {
    if (!lightWindow) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    lightWindow.style.left = `${progress * 92}%`;
  }
  let lbTicking = false;
  window.addEventListener('scroll', () => {
    if (!lbTicking) {
      requestAnimationFrame(() => { updateLightbar(); lbTicking = false; });
      lbTicking = true;
    }
  }, { passive: true });
  updateLightbar();

  /* ---------- Spine background on scroll ---------- */
  const nav = document.getElementById('nav');
  function updateNavBg() {
    if (!nav) return;
    nav.style.background = window.scrollY > 40
      ? 'linear-gradient(to bottom, rgba(236,229,211,.96), rgba(236,229,211,.85) 85%, transparent)'
      : 'linear-gradient(to bottom, rgba(236,229,211,.94), rgba(236,229,211,.75) 80%, transparent)';
  }
  window.addEventListener('scroll', updateNavBg, { passive: true });
  updateNavBg();

  /* ---------- Active section state in the spine nav ----------
     Marks whichever sheet is currently in view so the nav's own
     frame-number prefix can answer "where am I" the same way the
     rest of the page's indexing does. */
  const navTabs = document.querySelectorAll('.spine__tabs a[href^="#"]');
  if ('IntersectionObserver' in window && navTabs.length) {
    const tabsByTarget = new Map();
    navTabs.forEach(tab => tabsByTarget.set(tab.getAttribute('href').slice(1), tab));

    const sectionIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const tab = tabsByTarget.get(entry.target.id);
        if (!tab) return;
        tab.classList.toggle('is-current', entry.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    tabsByTarget.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) sectionIo.observe(section);
    });
  }

  /* ---------- Scroll-triggered reveals (fade/rise) ---------- */
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

  /* ---------- Cascade-flip headings ----------
     Splits each [data-flip] heading into per-word spans and reveals
     them with a staggered flip as the section scrolls into view —
     the page's one signature motion, used consistently everywhere
     instead of scattered one-off effects. Falls back to a plain
     reveal (no split) under reduced motion or without IO support. */
  const flipEls = document.querySelectorAll('[data-flip]');

  function splitIntoWordSpans(root) {
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(chunk => {
          if (chunk === '') return;
          if (/^\s+$/.test(chunk)) {
            frag.appendChild(document.createTextNode(chunk));
          } else {
            const span = document.createElement('span');
            span.textContent = chunk;
            frag.appendChild(span);
          }
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    Array.from(root.childNodes).forEach(walk);
    root.querySelectorAll('span').forEach((span, i) => {
      span.style.transitionDelay = `${Math.min(i * 0.035, 0.6)}s`;
    });
  }

  if (flipEls.length && !prefersReduced) {
    flipEls.forEach(splitIntoWordSpans);
    if ('IntersectionObserver' in window) {
      const flipIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            flipIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      flipEls.forEach(el => flipIo.observe(el));
    } else {
      flipEls.forEach(el => el.classList.add('is-visible'));
    }
  } else {
    flipEls.forEach(el => el.classList.add('is-visible'));
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
      frameBg.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;
      frameBg.dataset.thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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
    modalIframe.src = '';
  }

  document.querySelectorAll('.card[data-youtube]').forEach(card => {
    const trigger = card.querySelector('.card__frame');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const videoId = getYouTubeId(card.getAttribute('data-youtube'));
      if (!videoId) return;
      const titleEl = card.querySelector('.card__info h3');
      openModal(videoId, titleEl ? titleEl.textContent.trim() : '');
    });
  });

  /* ---------- Hero reel: opens the same modal as a project card ---------- */
  const heroReel = document.querySelector('.hero__reel[data-youtube]');
  if (heroReel) {
    heroReel.addEventListener('click', () => {
      const videoId = getYouTubeId(heroReel.getAttribute('data-youtube'));
      if (!videoId) return;
      openModal(videoId, 'OVO Café');
    });
  }

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

  /* ---------- Loupe cursor on project frames ----------
     Tracks the mouse over a card and shows a zoomed crop of that
     card's own thumbnail inside the loupe — a real magnifier, not a
     decorative circle. Only activates on devices with a real mouse. */
  const loupe = document.getElementById('customCursor');
  const workCards = document.querySelectorAll('#projectGrid .card');
  if (loupe && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let activeFrame = null;

    document.addEventListener('mousemove', (e) => {
      loupe.style.left = `${e.clientX}px`;
      loupe.style.top = `${e.clientY}px`;
      if (activeFrame) {
        const rect = activeFrame.getBoundingClientRect();
        const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1) * 100;
        const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1) * 100;
        loupe.style.backgroundPosition = `${px}% ${py}%`;
      }
    });

    workCards.forEach(card => {
      const frame = card.querySelector('.card__frame');
      const bg = card.querySelector('.card__frame-bg');
      if (!frame) return;
      frame.addEventListener('mouseenter', () => {
        activeFrame = frame;
        loupe.classList.add('is-active');
        const thumb = bg && bg.dataset.thumb;
        if (thumb) {
          loupe.style.backgroundImage = `url(${thumb})`;
          loupe.style.backgroundSize = '280%';
        }
      });
      frame.addEventListener('mouseleave', () => {
        activeFrame = null;
        loupe.classList.remove('is-active');
        loupe.style.backgroundImage = '';
      });
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
      const offset = nav ? nav.offsetHeight + 4 : 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

})();
