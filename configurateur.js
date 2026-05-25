/* ============================================
   LUXEO — Configurateur (Sol / Murs séparés)
   ============================================ */
(function () {
  'use strict';

  const grid        = document.getElementById('cfgGrid');
  const filtersEl   = document.getElementById('cfgFilters');
  const shownEl     = document.getElementById('cfgShown');
  const scene       = document.getElementById('cfgScene');
  const panelEl     = document.getElementById('cfgPanel');
  const clearBtn    = document.getElementById('cfgClear');
  const activeLbl   = document.getElementById('cfgActiveZoneLbl');

  // Zone tabs
  const zoneTabs = document.querySelectorAll('.cfg-zone-tab');

  // Zone summary (in preview)
  const zsRef = {
    sol:  document.getElementById('zsRefSol'),
    murs: document.getElementById('zsRefMurs'),
  };
  const zsMeta = {
    sol:  document.getElementById('zsMetaSol'),
    murs: document.getElementById('zsMetaMurs'),
  };

  // Zone status (in tabs)
  const ztStatus = {
    sol:  document.getElementById('ztStatusSol'),
    murs: document.getElementById('ztStatusMurs'),
  };

  // Sticky panel refs
  const cpRef = {
    sol:  document.getElementById('cpRefSol'),
    murs: document.getElementById('cpRefMurs'),
  };

  // Devis slots
  const slotEl = {
    sol:  document.getElementById('zoneSlotSol'),
    murs: document.getElementById('zoneSlotMurs'),
  };

  // Hidden form fields
  const hiddenSol  = document.getElementById('composer_sol');
  const hiddenMurs = document.getElementById('composer_murs');

  const ZONE_LABELS = { sol: 'Sol', murs: 'Murs' };

  // ---- STATE ----
  let currentFilter = 'all';
  let activeZone    = 'sol';
  const selection   = { sol: null, murs: null };

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

  /* ---------- ZONE TABS ---------- */
  zoneTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      zoneTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeZone = tab.dataset.zone;
      if (activeLbl) activeLbl.textContent = 'zone ' + ZONE_LABELS[activeZone];
      renderGrid(); // refresh "selected" markers
    });
  });

  /* ---------- GRID ---------- */
  function renderGrid() {
    const items = currentFilter === 'all'
      ? LUXEO_CATALOG
      : LUXEO_CATALOG.filter(p => p.cat === currentFilter);
    shownEl.textContent = items.length;

    const activeSel = selection[activeZone];

    grid.innerHTML = items.map(p => {
      const isActiveSel = activeSel && activeSel.ref === p.ref;
      const inOther = (activeZone === 'sol' && selection.murs && selection.murs.ref === p.ref)
                   || (activeZone === 'murs' && selection.sol && selection.sol.ref === p.ref);
      return `
        <article class="cfg-tile${isActiveSel ? ' selected' : ''}${inOther ? ' in-other' : ''}" data-ref="${p.ref}">
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
      `;
    }).join('');

    grid.querySelectorAll('.cfg-tile').forEach(card => {
      card.addEventListener('click', () => {
        const ref = card.dataset.ref;
        const product = LUXEO_CATALOG.find(p => p.ref === ref);
        setZoneSelection(activeZone, product);
      });
    });
  }

  /* ---------- SELECTION ---------- */
  function setZoneSelection(zone, product) {
    selection[zone] = product;
    applyToScene(zone, product);
    flashScene();
    updateUI();
  }

  function applyToScene(zone, product) {
    const varName = zone === 'sol' ? '--tile-sol' : '--tile-murs';
    scene.style.setProperty(varName, `url('assets/tiles/${product.ref}.jpg')`);
  }

  function flashScene() {
    scene.style.transition = 'box-shadow .4s ease';
    scene.style.boxShadow = '0 0 0 3px var(--turquoise), 0 40px 80px -30px rgba(10,42,42,0.4), 0 0 80px rgba(14,124,123,0.35)';
    clearTimeout(flashScene._t);
    flashScene._t = setTimeout(() => scene.style.boxShadow = '', 700);
  }

  /* ---------- UI UPDATE ---------- */
  function updateUI() {
    ['sol', 'murs'].forEach(zone => {
      const sel = selection[zone];

      // Zone summary in preview
      if (zsRef[zone] && zsMeta[zone]) {
        if (sel) {
          zsRef[zone].textContent  = sel.name + ' · ' + sel.ref;
          zsMeta[zone].textContent = sel.dims + ' · ' + sel.finish + ' · ' + sel.price;
          zsRef[zone].classList.add('filled');
        } else {
          zsRef[zone].textContent  = '— Aucun choix —';
          zsMeta[zone].textContent = 'Sélectionnez la zone ' + ZONE_LABELS[zone] + ' ci-dessous';
          zsRef[zone].classList.remove('filled');
        }
      }

      // Status badge in zone tab
      if (ztStatus[zone]) {
        ztStatus[zone].textContent = sel ? '✓ ' + sel.ref : 'À choisir';
        ztStatus[zone].classList.toggle('done', !!sel);
      }

      // Sticky panel ref
      if (cpRef[zone]) {
        cpRef[zone].textContent = sel ? sel.ref : '—';
        cpRef[zone].classList.toggle('filled', !!sel);
      }

      // Devis slot
      if (slotEl[zone]) {
        if (sel) {
          slotEl[zone].innerHTML = `
            <div class="zs-tile">
              <div class="zs-img" style="background-image:url('assets/tiles/${sel.ref}.jpg');"></div>
              <div class="zs-tile-info">
                <div class="zs-tile-ref">Réf. ${sel.ref}</div>
                <div class="zs-tile-name">${sel.name}</div>
                <div class="zs-tile-meta">${sel.dims} · ${sel.finish} · ${sel.price}</div>
              </div>
              <button type="button" class="zs-x" aria-label="Retirer" data-zone="${zone}">×</button>
            </div>
          `;
          slotEl[zone].querySelector('.zs-x').addEventListener('click', () => clearZone(zone));
        } else {
          slotEl[zone].innerHTML = `<div class="zs-empty">— Aucun carrelage sélectionné —<br><span>Choisissez la zone ${ZONE_LABELS[zone]} puis un carrelage</span></div>`;
        }
      }
    });

    // Sticky panel visibility
    const hasAny = selection.sol || selection.murs;
    panelEl.classList.toggle('show', !!hasAny);

    // Hidden fields
    if (hiddenSol)  hiddenSol.value  = selection.sol  ? `${selection.sol.name}  - Réf. ${selection.sol.ref}  - ${selection.sol.dims}  - ${selection.sol.finish}  - ${selection.sol.price}` : '';
    if (hiddenMurs) hiddenMurs.value = selection.murs ? `${selection.murs.name} - Réf. ${selection.murs.ref} - ${selection.murs.dims} - ${selection.murs.finish} - ${selection.murs.price}` : '';

    // Re-render grid to update selection markers
    refreshGridSelection();
  }

  function refreshGridSelection() {
    const activeSel = selection[activeZone];
    grid.querySelectorAll('.cfg-tile').forEach(card => {
      const ref = card.dataset.ref;
      const isActiveSel = activeSel && activeSel.ref === ref;
      const inOther = (activeZone === 'sol' && selection.murs && selection.murs.ref === ref)
                   || (activeZone === 'murs' && selection.sol && selection.sol.ref === ref);
      card.classList.toggle('selected', !!isActiveSel);
      card.classList.toggle('in-other', !!inOther);
    });
  }

  function clearZone(zone) {
    selection[zone] = null;
    scene.style.removeProperty(zone === 'sol' ? '--tile-sol' : '--tile-murs');
    updateUI();
  }

  /* ---------- CLEAR ALL ---------- */
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      selection.sol = null;
      selection.murs = null;
      scene.style.removeProperty('--tile-sol');
      scene.style.removeProperty('--tile-murs');
      updateUI();
    });
  }

  /* ---------- SUBMIT ---------- */
  window.cfgSubmit = function (form) {
    if (hiddenSol)  hiddenSol.value  = selection.sol  ? `${selection.sol.name}  - Réf. ${selection.sol.ref}  - ${selection.sol.dims}  - ${selection.sol.finish}  - ${selection.sol.price}` : '';
    if (hiddenMurs) hiddenMurs.value = selection.murs ? `${selection.murs.name} - Réf. ${selection.murs.ref} - ${selection.murs.dims} - ${selection.murs.finish} - ${selection.murs.price}` : '';

    const btn = form.querySelector('button[type=submit]');
    const original = btn.innerHTML;
    btn.innerHTML = '✓ Composition envoyée à info@luxeo.pro';
    btn.disabled = true;
    btn.style.background = 'var(--or)';
    btn.style.borderColor = 'var(--or)';
    btn.style.color = '#1a1100';
    console.log('Configurateur — Sol :',  hiddenSol  ? hiddenSol.value  : '');
    console.log('Configurateur — Murs :', hiddenMurs ? hiddenMurs.value : '');
    setTimeout(() => {
      form.reset();
      selection.sol = null;
      selection.murs = null;
      scene.style.removeProperty('--tile-sol');
      scene.style.removeProperty('--tile-murs');
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
