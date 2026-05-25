/* ============================================================
   LUXEO — main.js
   Interactivité globale (nav, reveal, sliders, simu, etc.)
   ============================================================ */
(function () {
  'use strict';

  /* -------- NAV scroll + burger mobile -------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const setScrolled = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      document.body.classList.toggle('nav-mobile-open');
      burger.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('nav-mobile-open');
      burger.classList.remove('open');
    }));
  }

  /* -------- REVEAL on scroll -------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* -------- HERO parallaxe -------- */
  const heroBg = document.getElementById('heroBg');
  if (heroBg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `translateY(${y * 0.35}px)`;
      }
    }, { passive: true });
  }

  /* -------- SIMULATEUR PRIX -------- */
  const simu = document.getElementById('simu');
  if (simu) {
    const simuOld = document.getElementById('simuOld');
    const simuReal = document.getElementById('simuReal');
    const simuSave = document.getElementById('simuSave');
    const fmt = n => n.toLocaleString('fr-FR');
    const update = () => {
      const val = parseInt(simu.value, 10);
      const half = Math.round(val / 2);
      simuOld.textContent = fmt(val);
      simuReal.textContent = fmt(half);
      simuSave.textContent = fmt(val - half);
    };
    simu.addEventListener('input', update);
    update();
  }

  /* -------- COMPARATEUR AVANT/APRÈS -------- */
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const after = slider.querySelector('.slot-after');
    const handle = slider.querySelector('.handle');
    if (!after || !handle) return;
    let isDragging = false;

    const setPos = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    };

    const onDown = (e) => {
      isDragging = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPos(x);
    };
    const onUp = () => { isDragging = false; };

    slider.addEventListener('mousedown', onDown);
    slider.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
  });

  /* -------- COMPTEUR animé -------- */
  const counterNum = document.getElementById('counterNum');
  if (counterNum) {
    const target = parseInt(counterNum.textContent, 10) || 47;
    counterNum.textContent = '0';
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          let cur = 0;
          const step = Math.max(1, Math.round(target / 50));
          const tick = () => {
            cur = Math.min(target, cur + step);
            counterNum.textContent = cur;
            if (cur < target) requestAnimationFrame(tick);
          };
          tick();
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(counterNum);
  }

  /* -------- CONTACT FORM submit -------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = 'Demande envoyée ✓';
      btn.disabled = true;
      btn.style.background = 'var(--or)';
      btn.style.borderColor = 'var(--or)';
      btn.style.color = '#1a1100';
      setTimeout(() => {
        contactForm.reset();
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 3500);
    });
  }
})();
