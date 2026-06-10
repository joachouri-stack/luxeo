/* ============================================
   LUXEO BLOG — Interactions front
   - Progress bar de lecture
   - Sommaire (TOC) scrollspy + smooth scroll
   - Partage social
   - FadeUp au scroll
   ============================================ */
(function () {
  'use strict';

  // ============================================
  // PROGRESS BAR (top of viewport)
  // ============================================
  const article = document.querySelector('.article-body');
  if (article) {
    let bar = document.querySelector('.blog-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'blog-progress';
      document.body.appendChild(bar);
    }
    function updateProgress() {
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ============================================
  // TOC GÉNÉRATION + SCROLLSPY
  // ============================================
  const tocContainer = document.querySelector('.article-toc ul');
  if (tocContainer && article) {
    const headings = article.querySelectorAll('h2, h3');
    const tocItems = [];
    headings.forEach((h, i) => {
      // Génère un id basé sur le texte si pas déjà présent
      if (!h.id) {
        h.id = slugify(h.textContent) || ('section-' + i);
      }
      const li = document.createElement('li');
      li.className = h.tagName.toLowerCase();
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocContainer.appendChild(li);
      tocItems.push({ id: h.id, el: h, link: a });
    });

    // Scrollspy
    function updateActive() {
      let active = tocItems[0];
      const offset = 120;
      for (const item of tocItems) {
        const rect = item.el.getBoundingClientRect();
        if (rect.top - offset <= 0) active = item;
        else break;
      }
      tocItems.forEach(it => it.link.classList.toggle('active', it === active));
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    // Smooth scroll sur les ancres TOC
    tocContainer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        const targetId = a.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  // ============================================
  // PARTAGE SOCIAL
  // ============================================
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.dataset.share;
      const url = encodeURIComponent(location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';
      switch (type) {
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${title}%20${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${title}&body=${url}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(location.href).then(() => {
            btn.classList.add('copied');
            const orig = btn.getAttribute('aria-label');
            btn.setAttribute('aria-label', 'Lien copié !');
            setTimeout(() => {
              btn.classList.remove('copied');
              btn.setAttribute('aria-label', orig);
            }, 2000);
          });
          return;
      }
      if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
    });
  });

  // ============================================
  // FADEUP au scroll
  // ============================================
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // ============================================
  // HELPER : slugify
  // ============================================
  function slugify(s) {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }
})();
