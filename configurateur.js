/* ============================================
   LUXEO — Configurateur logic
   ============================================ */
(function () {
  'use strict';

  const grid       = document.getElementById('cfgGrid');
  const filtersEl  = document.getElementById('cfgFilters');
  const shownEl    = document.getElementById('cfgShown');
  const scene      = document.getElementById('cfgScene');
  const prevRef    = document.getElementById('cfgPreviewRef');
  const prevName   = document.getElementById('cfgPreviewName');
  const prevMeta   = document.getElementById('cfgPreviewMeta');
  const chipsEl    = document.getElementById('cfgChips');
  const countEl    = document.getElementById('cfgCount');
  const panelEl    = document.getElementById('cfgPanel');
  const listEl     = document.getElementById('cfgList');
  const emptyEl    = document.getElementById('cfgEmpty');
  const clearBtn   = document.getElementById('cfgClear');
  const refsHidden = document.getElementById('cf-refs');

  let currentFilter = 'all';
  const selected = new Map(); // ref => product

  /* ---------- FILTERS ---------- */
  filtersEl.innerHTML = LUXEO_FILTERS.map(f => `
    <button class="cfg-filter${f.id === 'all' ? ' active' : ''}" data-filter="${f.id}">
      ${f.label} <span class="count">${f.count}</span>
    </button>
  `).join('');

  filtersEl.querySelectorAll('.cfg-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      filtersEl.querySelectorAll('.cfg-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderGrid();
    });
  });

  /* ---------- GRID ---------- */
  function renderGrid() {
    const items = currentFilter === 'all'
      ? LUXEO_CATALOG
      : LUXEO_CATALOG.filter(p => p.cat === currentFilter);
    shownEl.textContent = items.length;

    grid.innerHTML = items.map(p => `
      <article class="cfg-tile${selected.has(p.ref) ? ' selected' : ''}" data-ref="${p.ref}">
        <div class="cfg-tile-img" style="background-image:url('assets/tiles/${p.ref}.jpg');"></div>
        <div class="cfg-tile-info">
          <div class="cfg-tile-ref">Réf. ${p.ref}</div>
          <div class="cfg-tile-name">${p.name}</div>
          <div class="cfg-tile-meta">
            <span>${p.dims} · ${p.finish}</span>
            <span class="cfg-tile-price">${p.price}</span>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.cfg-tile').forEach(card => {
      card.addEventListener('click', () => {
        const ref = card.dataset.ref;
        const product = LUXEO_CATALOG.find(p => p.ref === ref);
        applyPreview(product);
        toggleSelect(product);
      });
    });
  }

  /* ---------- PREVIEW ---------- */
  function applyPreview(p) {
    scene.style.setProperty('--tile-img', `url('assets/tiles/${p.ref}.jpg')`);
    prevRef.textContent = p.ref;
    prevName.textContent = p.name;
    prevMeta.textContent = `${p.dims} · ${p.finish}`;

    // Flash effect
    scene.style.transition = 'box-shadow .4s ease';
    scene.style.boxShadow = '0 0 0 3px var(--turquoise), var(--sh-strong, 0 30px 80px rgba(0,0,0,.3)), 0 0 80px rgba(14,124,123,0.35)';
    clearTimeout(applyPreview._t);
    applyPreview._t = setTimeout(() => scene.style.boxShadow = '', 700);
  }

  /* ---------- SELECTION ---------- */
  function toggleSelect(p) {
    if (selected.has(p.ref)) {
      selected.delete(p.ref);
    } else {
      selected.set(p.ref, p);
    }
    updateUI();
  }

  function updateUI() {
    // Tile cards highlight
    grid.querySelectorAll('.cfg-tile').forEach(card => {
      card.classList.toggle('selected', selected.has(card.dataset.ref));
    });

    // Sticky panel chips
    countEl.textContent = selected.size;
    chipsEl.innerHTML = Array.from(selected.values()).slice(0, 4).map(p => `
      <div class="cfg-chip" data-ref="${p.ref}">
        <div class="chip-img" style="background-image:url('assets/tiles/${p.ref}.jpg');"></div>
        <span>${p.ref}</span>
        <button class="chip-x" aria-label="Retirer">×</button>
      </div>
    `).join('') + (selected.size > 4 ? `<div class="cfg-chip more">+${selected.size - 4}</div>` : '');

    chipsEl.querySelectorAll('.chip-x').forEach(x => {
      x.addEventListener('click', (e) => {
        e.stopPropagation();
        const ref = x.closest('.cfg-chip').dataset.ref;
        selected.delete(ref);
        updateUI();
      });
    });

    panelEl.classList.toggle('show', selected.size > 0);

    // Devis selection list
    if (selected.size === 0) {
      emptyEl.style.display = '';
      listEl.style.display = 'none';
      listEl.innerHTML = '';
    } else {
      emptyEl.style.display = 'none';
      listEl.style.display = '';
      listEl.innerHTML = Array.from(selected.values()).map(p => `
        <li class="cfg-sel-item" data-ref="${p.ref}">
          <div class="sel-img" style="background-image:url('assets/tiles/${p.ref}.jpg');"></div>
          <div class="sel-info">
            <div class="sel-ref">Réf. ${p.ref}</div>
            <div class="sel-name">${p.name}</div>
            <div class="sel-meta">${p.dims} · ${p.finish} · ${p.price}</div>
          </div>
          <button class="sel-x" aria-label="Retirer">×</button>
        </li>
      `).join('');
      listEl.querySelectorAll('.sel-x').forEach(x => {
        x.addEventListener('click', () => {
          const ref = x.closest('.cfg-sel-item').dataset.ref;
          selected.delete(ref);
          updateUI();
        });
      });
    }

    // Hidden field
    if (refsHidden) {
      refsHidden.value = Array.from(selected.values())
        .map(p => `${p.name} (${p.ref}) ${p.dims} ${p.finish} ${p.price}`)
        .join(' | ');
    }
  }

  /* ---------- CLEAR ALL ---------- */
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      selected.clear();
      updateUI();
    });
  }

  /* ---------- SUBMIT ---------- */
  window.cfgSubmit = function (form) {
    if (refsHidden) refsHidden.value = Array.from(selected.values())
      .map(p => `${p.name} (${p.ref}) ${p.dims} ${p.finish} ${p.price}`)
      .join(' | ');
    const btn = form.querySelector('button[type=submit]');
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Composition envoyée à info@luxeo.pro';
    btn.disabled = true;
    btn.style.background = 'var(--or)';
    btn.style.borderColor = 'var(--or)';
    btn.style.color = '#1a1100';
    console.log('Configurateur — refs transmises :', refsHidden ? refsHidden.value : '');
    setTimeout(() => {
      form.reset();
      selected.clear();
      updateUI();
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 4500);
  };

  /* ---------- INIT ---------- */
  renderGrid();
  updateUI();
})();
