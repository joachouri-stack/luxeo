/* ============================================
   LUXEO — Interactions
   ============================================ */

(function () {
  'use strict';
console.log('Luxeo v.1780579225 — form handler ready');

  /* ---------- NAV — Scroll state + mobile menu ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-mobile-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav-mobile-open');
      if (burger) {
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Ouvrir le menu');
      }
    });
  });

  /* ---------- HERO PARALLAX ---------- */
  const heroBg = document.getElementById('heroBg');
  function parallax() {
    if (!heroBg) return;
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1 + y * 0.0003})`;
    }
  }
  window.addEventListener('scroll', parallax, { passive: true });

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- BEFORE / AFTER SLIDERS (clip-path based) ---------- */
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    let isDragging = false;

    function setPosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      // After image clipped from the RIGHT: inset(0 right 0 0)
      slider.style.setProperty('--clip', (100 - pct) + '%');
    }

    function pctFromEvent(e) {
      const rect = slider.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    }

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(pctFromEvent(e));
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(pctFromEvent(e));
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(pctFromEvent(e));
    }, { passive: true });
    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(pctFromEvent(e));
    }, { passive: true });
    slider.addEventListener('touchend', () => { isDragging = false; });

    // Initialize to 50%
    setPosition(50);
  });

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-q').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item.open').forEach((o) => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- SMOOTH SCROLL OFFSET FOR FIXED NAV ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      // href="#" or "#top" → smooth scroll to top of page
      if (href === '#' || href === '#top' || href.length < 2) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- ANIMATED COUNTERS ---------- */
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimal || '0', 10);
        const duration = 1600;
        const start = performance.now();
        function step(t) {
          const elapsed = t - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = decimals ? value.toFixed(decimals) : Math.floor(value).toString();
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = decimals ? target.toFixed(decimals) : target.toString();
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('.counter[data-target]').forEach((el) => countObserver.observe(el));

  /* ---------- STICKY BOTTOM CTA ---------- */
  const stickyCta = document.getElementById('stickyCta');
  const stickyClose = document.getElementById('stickyClose');
  let stickyDismissed = false;
  function updateStickyCta() {
    if (!stickyCta || stickyDismissed) return;
    const showThreshold = window.innerHeight * 0.9;
    const footerEl = document.querySelector('footer');
    const footerTop = footerEl ? footerEl.getBoundingClientRect().top + window.scrollY : Infinity;
    const scrolled = window.scrollY;
    const past = scrolled > showThreshold;
    const beforeFooter = scrolled + window.innerHeight < footerTop - 50;
    if (past && beforeFooter) {
      stickyCta.classList.add('show');
    } else {
      stickyCta.classList.remove('show');
    }
  }
  window.addEventListener('scroll', updateStickyCta, { passive: true });
  if (stickyClose) {
    stickyClose.addEventListener('click', () => {
      stickyDismissed = true;
      stickyCta.classList.remove('show');
    });
  }

  /* ---------- PACK 3D TILT ---------- */
  document.querySelectorAll('.pack').forEach((card) => {
    let raf = null;
    card.addEventListener('mousemove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (y - 0.5) * -6;
        const ry = (x - 0.5) * 6;
        const isFeatured = card.classList.contains('pack-featured');
        const baseTransform = isFeatured ? 'translateY(-14px) scale(1.02)' : 'translateY(-8px)';
        card.style.transform = `${baseTransform} perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });

  /* ---------- CUSTOM CURSOR (desktop only) ---------- */
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    const dot = document.getElementById('curDot');
    const ring = document.getElementById('curRing');
    // Only hide native cursor if both custom-cursor elements exist
    if (dot && ring) document.body.classList.add('has-custom-cursor');
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    });
    function followRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) {
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(followRing);
    }
    followRing();

    document.querySelectorAll('a, button, input, select, textarea, [data-slider], .pack, .zone-card, .avis-card, .faq-q, .gal-card, .mat, .timeline-day').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (ring) ring.classList.add('hover');
        if (dot) dot.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        if (ring) ring.classList.remove('hover');
        if (dot) dot.classList.remove('hover');
      });
    });

    // Hide cursor on touch
    window.addEventListener('touchstart', () => {
      if (dot) dot.style.display = 'none';
      if (ring) ring.style.display = 'none';
      document.body.style.cursor = '';
    }, { once: true });
  }

  /* ---------- AMBIANCE PICKER ---------- */
  const ambStage = document.getElementById('ambianceStage');
  if (ambStage) {
    const ambImg = document.getElementById('ambImg');
    const ambImgNext = document.getElementById('ambImgNext');
    const ambTag = document.getElementById('ambTag');
    const ambIndex = document.getElementById('ambIndex');
    const ambOptions = document.querySelectorAll('.amb-opt');
    const ambPrev = document.getElementById('ambPrev');
    const ambNext = document.getElementById('ambNext');
    const ambCta = document.getElementById('ambCta');
    const ambFrame = ambStage.querySelector('.amb-frame');

    const ambiances = Array.from(ambOptions).map(opt => ({
      amb: opt.dataset.amb,
      label: opt.dataset.label,
      ref: opt.dataset.ref,
      el: opt,
    }));

    let currentIdx = 0;
    let isTransitioning = false;
    let preloadedSrc = new Set();

    // Preload all images
    ambiances.forEach(a => {
      const img = new Image();
      img.src = `assets/ambiance/${a.amb}.jpg`;
      preloadedSrc.add(a.amb);
    });

    function setAmbience(idx, direction) {
      if (isTransitioning || idx === currentIdx) return;
      isTransitioning = true;
      const target = ambiances[idx];
      const newSrc = `assets/ambiance/${target.amb}.jpg`;

      // Crossfade: put new image into the back layer, fade it in, then swap
      ambImgNext.src = newSrc;
      ambImgNext.alt = `Ambiance ${target.label}`;
      ambImgNext.classList.remove('is-active');

      // Force reflow
      void ambImgNext.offsetWidth;

      // Trigger enter animation
      ambImgNext.classList.add('is-entering');
      ambImg.style.opacity = '0';

      setTimeout(() => {
        // Copy state from next to current
        ambImg.src = newSrc;
        ambImg.alt = ambImgNext.alt;
        ambImg.style.opacity = '';
        ambImg.classList.add('is-active');
        ambImgNext.classList.remove('is-entering');
        isTransitioning = false;
      }, 750);

      // Update labels & UI
      ambTag.style.opacity = '0';
      setTimeout(() => {
        ambTag.textContent = target.label;
        ambTag.style.opacity = '1';
      }, 280);

      ambIndex.textContent = String(idx + 1).padStart(2, '0');

      ambOptions.forEach(o => o.classList.remove('is-active'));
      target.el.classList.add('is-active');

      currentIdx = idx;
    }

    // Click an option
    ambOptions.forEach((opt, i) => {
      opt.addEventListener('click', () => setAmbience(i));
    });

    // Arrows
    ambPrev.addEventListener('click', () => {
      const next = (currentIdx - 1 + ambiances.length) % ambiances.length;
      setAmbience(next, 'prev');
    });
    ambNext.addEventListener('click', () => {
      const next = (currentIdx + 1) % ambiances.length;
      setAmbience(next, 'next');
    });

    // Swipe (touch)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    ambFrame.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });
    ambFrame.addEventListener('touchend', (e) => {
      const dt = Date.now() - touchStartTime;
      if (dt > 600) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) {
          setAmbience((currentIdx + 1) % ambiances.length, 'next');
        } else {
          setAmbience((currentIdx - 1 + ambiances.length) % ambiances.length, 'prev');
        }
      }
    }, { passive: true });

    // Click on frame area also advances (but not on arrows/tag)
    ambFrame.addEventListener('click', (e) => {
      if (e.target.closest('.amb-arrow, .amb-overlay, .amb-counter')) return;
      setAmbience((currentIdx + 1) % ambiances.length, 'next');
    });

    // CTA prefill — inject ambience into devis form msg
    ambCta.addEventListener('click', () => {
      setTimeout(() => {
        const msg = document.getElementById('f-msg');
        const current = ambiances[currentIdx];
        if (msg) {
          const desc = `Ambiance choisie : ${current.label} (réf. ${current.ref}).`;
          if (!msg.value.includes(current.ref)) {
            msg.value = desc + (msg.value ? '\n' + msg.value : '');
            msg.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }, 600);
    });
  }

})();

/* ============================================
   BOUTIQUE — Pré-remplissage form depuis ?ref= ou ?cart=
   ============================================ */
(function () {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const cart = params.get('cart');
  if (!ref && !cart) return;

  const fill = () => {
    const msg = document.getElementById('f-msg');
    const pack = document.getElementById('f-pack');
    if (!msg) return;

    let prefill = '';
    if (cart) {
      // cart param format: REF:QTY,REF:QTY,...
      const items = cart.split(',').map(s => {
        const [r, q] = s.split(':');
        return { ref: r, qty: parseInt(q, 10) || 1 };
      }).filter(i => i.ref);
      if (items.length) {
        prefill = "Demande de devis pour ma sélection :\n" +
          items.map(i => `  • ${i.ref} — ${i.qty} m²`).join('\n');
      }
    } else if (ref) {
      prefill = `Demande de devis pour le carrelage ${ref}.`;
    }

    if (prefill && !msg.value.includes('Demande de devis')) {
      msg.value = prefill + (msg.value ? '\n' + msg.value : '');
      msg.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (pack) {
      const conseil = Array.from(pack.options).find(o => o.value === 'conseil');
      if (conseil) pack.value = 'conseil';
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();

/* ============================================
   FORMULAIRE DEVIS — Soumission AJAX Formspree
   Affiche la VRAIE erreur Formspree pour debug
   ============================================ */
(function () {
  const form = document.getElementById('devisForm');
  if (!form) return;
  const btn = document.getElementById('devisSubmit');
  const ok = document.getElementById('devisSuccess');
  const ko = document.getElementById('devisError');
  const errMsgEl = document.getElementById('devisErrorMsg');
  if (!btn || !ok || !ko) return;

  const defaultErrorHTML = errMsgEl ? errMsgEl.innerHTML : '';
  const btnOriginalHTML = btn.innerHTML;

  function showError(detailHTML) {
    if (errMsgEl) {
      errMsgEl.innerHTML = (detailHTML || defaultErrorHTML) +
        '<br><br>Ou appelez-nous au <a href="tel:+33769010202">07 69 01 02 02</a> · <a href="mailto:info@luxeo.pro">info@luxeo.pro</a>';
    }
    ko.hidden = false;
    ko.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    ok.hidden = true;
    ko.hidden = true;
    btn.disabled = true;
    btn.innerHTML = 'Envoi en cours…';

    try {
      const fd = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        form.reset();
        form.querySelectorAll('input, textarea, select').forEach(i => i.dispatchEvent(new Event('input')));
        ok.hidden = false;
        ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        console.error('Formspree responded', res.status, data);
        // Extrait un message lisible des erreurs Formspree
        let detail = '';
        if (Array.isArray(data.errors) && data.errors.length) {
          detail = '<b>Formspree refuse l\'envoi :</b><br>' +
            data.errors.map(er => '• ' + (er.message || JSON.stringify(er))).join('<br>');
        } else if (data.error) {
          detail = '<b>Formspree refuse l\'envoi :</b> ' + data.error;
        } else {
          detail = '<b>Erreur HTTP ' + res.status + '</b> sans détail.';
        }
        showError(detail);
      }
    } catch (err) {
      console.error('Network error', err);
      showError('<b>Erreur réseau :</b> ' + (err && err.message ? err.message : 'connexion impossible à Formspree.'));
    } finally {
      btn.disabled = false;
      btn.innerHTML = btnOriginalHTML;
    }
  });
})();
