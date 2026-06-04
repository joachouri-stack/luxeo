/* ============================================
   LUXEO — Composer V2
   Frontend complet (Phase 1A — sans backend IA)
   Mocked AI : utilise des photos "after" pré-existantes
   ============================================ */

(function () {
  'use strict';

  const SVG_COL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><line x1="12" y1="6" x2="12" y2="14"/><circle cx="12" cy="14" r="3.2"/><line x1="9" y1="17" x2="8.5" y2="20.5"/><line x1="12" y1="17" x2="12" y2="20.5"/><line x1="15" y1="17" x2="15.5" y2="20.5"/></svg>';
  const SVG_PAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="4" y1="9" x2="20" y2="9" opacity="0.4"/><line x1="4" y1="15" x2="20" y2="15" opacity="0.4"/></svg>';

  const CATALOG = {
    sol: [
      { ref: 'LUXEO-SOL-01', name: 'Marbre Calacatta', desc: 'blanc veiné gris', img: '/assets/tiles/LUX-MAR-001.jpg' },
      { ref: 'LUXEO-SOL-02', name: 'Travertin clair',  desc: 'beige naturel',    img: '/assets/tiles/LUX-MAR-004.jpg' },
      { ref: 'LUXEO-SOL-03', name: 'Béton ciré',       desc: 'gris moyen',       img: '/assets/tiles/LUX-BET-005.jpg' },
      { ref: 'LUXEO-SOL-04', name: 'Anthracite mat',   desc: '60×60 cm',         img: '/assets/tiles/LUX-BET-004.jpg' },
      { ref: 'LUXEO-SOL-05', name: 'Effet bois chêne', desc: 'lasuré clair',     img: '/assets/tiles/LUX-BOI-001.jpg' },
      { ref: 'LUXEO-SOL-06', name: 'Ardoise noire',    desc: 'mate texturée',    img: '/assets/tiles/LUX-PIE-003.jpg' },
    ],
    murs: [
      { ref: 'LUXEO-MUR-01', name: 'Grand format blanc',     desc: 'mat 60×120',  img: '/assets/tiles/LUX-MAR-003.jpg' },
      { ref: 'LUXEO-MUR-02', name: 'Grand format anthracite', desc: 'mat 60×120', img: '/assets/tiles/LUX-MFO-002.jpg' },
      { ref: 'LUXEO-MUR-03', name: 'Mosaïque verticale',     desc: 'beige & blanc', img: '/assets/tiles/LUX-MOS-003.jpg' },
      { ref: 'LUXEO-MUR-04', name: 'Béton ciré clair',       desc: 'mat',         img: '/assets/tiles/LUX-BET-001.jpg' },
      { ref: 'LUXEO-MUR-05', name: 'Pierre naturelle',       desc: 'beige',       img: '/assets/tiles/LUX-PIE-001.jpg' },
      { ref: 'LUXEO-MUR-06', name: 'Lambris teck',           desc: 'vertical',    img: '/assets/tiles/LUX-BOI-002.jpg' },
    ],
    colonne: [
      { ref: 'LUXEO-COL-01', name: 'Inox brossé',     desc: 'thermostatique', gradient: 'linear-gradient(135deg,#9ca3a8,#5a6166)' },
      { ref: 'LUXEO-COL-02', name: 'Noir mat',        desc: 'thermostatique', gradient: 'linear-gradient(135deg,#2a2a2a,#0a0a0a)' },
      { ref: 'LUXEO-COL-03', name: 'Or brossé',       desc: 'thermostatique', gradient: 'linear-gradient(135deg,#d4b265,#9e7d3b)' },
      { ref: 'LUXEO-COL-04', name: 'Chromé classique', desc: 'brillant',      gradient: 'linear-gradient(135deg,#e8edf0,#a8b0b6)' },
    ],
    paroi: [
      { ref: 'LUXEO-PAR-01', name: 'Verre clair',         desc: '8 mm sécurit',  gradient: 'linear-gradient(135deg,#e8f4f5,#bcd9dc)' },
      { ref: 'LUXEO-PAR-02', name: 'Verre sablé',         desc: '8 mm opaque',   gradient: 'linear-gradient(135deg,#f4f7f7,#d0d8d8)' },
      { ref: 'LUXEO-PAR-03', name: 'Profilé noir + verre', desc: 'cadre noir mat', gradient: 'linear-gradient(135deg,#1a1a1a 0%,#1a1a1a 14%,#e8f4f5 14%,#bcd9dc 100%)' },
    ],
  };

  const PACKS = {
    'suite-marbre': {
      label: 'Suite Marbre',
      sol:     { ref: 'LUXEO-SOL-01', name: 'Marbre Calacatta' },
      murs:    { ref: 'LUXEO-MUR-01', name: 'Grand format blanc mat' },
      colonne: { ref: 'LUXEO-COL-03', name: 'Or brossé thermostatique' },
      paroi:   { ref: 'LUXEO-PAR-01', name: 'Verre clair 8 mm' },
      mockImage: '/assets/after-marseille.jpg',
      altMockImage: '/assets/intro-detail.jpg',
    },
    'spa-zen': {
      label: 'Spa Zen',
      sol:     { ref: 'LUXEO-SOL-06', name: 'Ardoise noire mate' },
      murs:    { ref: 'LUXEO-MUR-06', name: 'Lambris teck vertical' },
      colonne: { ref: 'LUXEO-COL-02', name: 'Noir mat thermostatique' },
      paroi:   { ref: 'LUXEO-PAR-03', name: 'Profilé noir + verre clair' },
      mockImage: '/assets/after-nimes.jpg',
      altMockImage: '/assets/after-montpellier.jpg',
    },
    'provence': {
      label: 'Provence',
      sol:     { ref: 'LUXEO-SOL-02', name: 'Pierre travertin beige' },
      murs:    { ref: 'LUXEO-MUR-05', name: 'Pierre naturelle beige' },
      colonne: { ref: 'LUXEO-COL-03', name: 'Or brossé thermostatique' },
      paroi:   { ref: 'LUXEO-PAR-01', name: 'Verre clair (profilé bronze)' },
      mockImage: '/assets/after-avignon.jpg',
      altMockImage: '/assets/intro-detail.jpg',
    },
    'libre': {
      label: 'Composition libre',
      mockImages: [
        '/assets/after-avignon.jpg',
        '/assets/after-marseille.jpg',
        '/assets/after-nimes.jpg',
        '/assets/after-montpellier.jpg',
        '/assets/intro-detail.jpg',
      ],
    },
  };

  const state = {
    photo: null,
    pack: null,
    libreSelections: { sol: null, murs: null, colonne: null, paroi: null },
    lastResultImg: null,
  };

  const ESSAIS_MAX = 2;
  const KEY_USED = 'luxeo_essais_used';
  const KEY_DATE = 'luxeo_essais_date';

  function getEssaisUsed() { return parseInt(localStorage.getItem(KEY_USED) || '0', 10) || 0; }
  function getEssaisRestants() { return Math.max(0, ESSAIS_MAX - getEssaisUsed()); }
  function incrementEssais() {
    const used = getEssaisUsed() + 1;
    localStorage.setItem(KEY_USED, String(used));
    localStorage.setItem(KEY_DATE, new Date().toISOString());
    updateEssaisUI();
  }
  function checkResetEssais() {
    const lastDate = localStorage.getItem(KEY_DATE);
    if (!lastDate) return;
    const diffDays = (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 30) {
      localStorage.removeItem(KEY_USED);
      localStorage.removeItem(KEY_DATE);
    }
  }
  function updateEssaisUI() {
    const restants = getEssaisRestants();
    const countEl = document.getElementById('cpEssaisCount');
    if (countEl) countEl.textContent = restants;

    const regenBtn = document.getElementById('cpRegen');
    const regenLabel = document.getElementById('cpRegenLabel');
    const emptyMsg = document.getElementById('cpEssaisEmpty');
    if (restants <= 0) {
      if (regenBtn) regenBtn.hidden = true;
      if (emptyMsg) emptyMsg.hidden = false;
    } else {
      if (regenBtn) regenBtn.hidden = false;
      if (regenLabel) regenLabel.textContent = `Régénérer (${restants} essai${restants > 1 ? 's' : ''} restant${restants > 1 ? 's' : ''})`;
      if (emptyMsg) emptyMsg.hidden = true;
    }
    const inp = document.getElementById('cf-composer-essais');
    if (inp) inp.value = getEssaisUsed();
  }

  // ÉTAPE 01 — UPLOAD
  function initUpload() {
    const drop = document.getElementById('cpDrop');
    const file = document.getElementById('cpFile');
    const empty = document.getElementById('cpDropEmpty');
    const preview = document.getElementById('cpDropPreview');
    const previewImg = document.getElementById('cpPreviewImg');
    const previewName = document.getElementById('cpPreviewName');
    const actions = document.getElementById('cpDropActions');
    const errorBox = document.getElementById('cpDropError');
    const errorMsg = document.getElementById('cpDropErrorMsg');
    const changeBtn = document.getElementById('cpChangePhoto');
    const continueBtn = document.getElementById('cpContinueToStep2');
    const demoLink = document.getElementById('cpDemoLink');

    function showError(msg) {
      errorMsg.textContent = msg;
      errorBox.hidden = false;
      setTimeout(() => { errorBox.hidden = true; }, 4500);
    }
    function clearError() { errorBox.hidden = true; }

    function setPreview(dataUrl, name) {
      previewImg.src = dataUrl;
      previewName.textContent = name || 'photo';
      empty.hidden = true;
      preview.hidden = false;
      actions.hidden = false;
      state.photo = { dataUrl, name };
    }

    function resetUpload() {
      file.value = '';
      empty.hidden = false;
      preview.hidden = true;
      actions.hidden = true;
      state.photo = null;
      previewImg.src = '';
    }

    function handleFile(f) {
      clearError();
      if (!f) return;
      const okType = /image\/(jpeg|jpg|png|heic|webp)/i.test(f.type) || /\.(jpe?g|png|heic|webp)$/i.test(f.name);
      if (!okType) { showError('Format non supporté. Utilisez JPG, PNG, HEIC ou WEBP.'); return; }
      if (f.size > 10 * 1024 * 1024) { showError('Le fichier dépasse 10 Mo. Réduisez la taille.'); return; }
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result, f.name);
      reader.onerror = () => showError('Impossible de lire le fichier.');
      reader.readAsDataURL(f);
    }

    drop.addEventListener('click', (e) => {
      if (e.target.closest('.cp-drop-preview')) return;
      file.click();
    });
    drop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); }
    });
    file.addEventListener('change', (e) => handleFile(e.target.files[0]));
    ['dragenter', 'dragover'].forEach(ev => {
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('cp-drop-dragover'); });
    });
    ['dragleave', 'dragend', 'drop'].forEach(ev => {
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('cp-drop-dragover'); });
    });
    drop.addEventListener('drop', (e) => {
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
    changeBtn.addEventListener('click', resetUpload);
    continueBtn.addEventListener('click', () => {
      if (!state.photo) return;
      showStep('cpStep2', true);
    });
    demoLink.addEventListener('click', () => {
      const demoSrc = '/assets/before-avignon.jpg';
      previewImg.src = demoSrc;
      previewName.textContent = 'photo-de-demo.jpg';
      empty.hidden = true;
      preview.hidden = false;
      actions.hidden = false;
      state.photo = { dataUrl: demoSrc, name: 'photo-de-demo.jpg' };
    });
  }

  // ÉTAPE 02
  function renderLibreGrids() {
    Object.keys(CATALOG).forEach(cat => {
      const grid = document.querySelector(`.cp-libre-grid[data-grid="${cat}"]`);
      if (!grid) return;
      grid.innerHTML = CATALOG[cat].map(item => `
        <button type="button" class="cp-mat" data-cat="${cat}" data-ref="${item.ref}" aria-pressed="false">
          <span class="cp-mat-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <div class="cp-mat-img">
            ${item.img
              ? `<img src="${item.img}" alt="${item.name}" loading="lazy">`
              : `<div class="cp-mat-img-placeholder" style="background:${item.gradient};">${cat === 'colonne' ? SVG_COL : SVG_PAR}</div>`
            }
          </div>
          <div class="cp-mat-body">
            <div class="cp-mat-name">${item.name}</div>
            <div class="cp-mat-ref">${item.ref}</div>
          </div>
        </button>
      `).join('');
    });
  }

  function initStep2() {
    document.querySelectorAll('.cp-pack-cta').forEach(btn => {
      btn.addEventListener('click', () => {
        const packId = btn.getAttribute('data-pack');
        if (!packId || getEssaisRestants() <= 0) return;
        state.pack = packId;
        document.querySelectorAll('.cp-pack').forEach(p => p.classList.remove('cp-pack-selected'));
        const card = btn.closest('.cp-pack');
        if (card) card.classList.add('cp-pack-selected');
        runGeneration(packId);
      });
    });

    const libreToggle = document.getElementById('cpLibreToggle');
    const libreBlock = document.getElementById('cpLibre');
    libreToggle.addEventListener('click', () => {
      const open = libreBlock.hidden;
      libreBlock.hidden = !open;
      libreToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        libreBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    renderLibreGrids();
    document.querySelectorAll('.cp-libre-grid').forEach(grid => {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.cp-mat');
        if (!card) return;
        const cat = card.dataset.cat;
        const ref = card.dataset.ref;
        grid.querySelectorAll('.cp-mat').forEach(c => {
          c.classList.remove('cp-mat-selected');
          c.setAttribute('aria-pressed', 'false');
        });
        card.classList.add('cp-mat-selected');
        card.setAttribute('aria-pressed', 'true');
        const item = (CATALOG[cat] || []).find(x => x.ref === ref);
        state.libreSelections[cat] = item || null;
        updateLibreCTA();
      });
    });

    document.getElementById('cpGenerateLibre').addEventListener('click', () => {
      if (!isLibreComplete() || getEssaisRestants() <= 0) return;
      state.pack = 'libre';
      runGeneration('libre');
    });
  }

  function isLibreComplete() {
    const s = state.libreSelections;
    return !!(s.sol && s.murs && s.colonne && s.paroi);
  }
  function updateLibreCTA() {
    const btn = document.getElementById('cpGenerateLibre');
    const note = document.getElementById('cpLibreNote');
    const complete = isLibreComplete();
    btn.disabled = !complete;
    if (note) {
      note.textContent = complete
        ? 'Tous les éléments sont sélectionnés. Lancez la génération.'
        : 'Sélectionnez un élément dans chaque catégorie pour générer.';
    }
  }

  // LOADER
  const LOADER_STEPS = [
    'Analyse de votre photo…',
    'Application des matériaux sélectionnés…',
    'Construction de la perspective…',
    'Réglage de l\'ambiance lumière…',
    'Touches finales…',
  ];

  function showLoader() {
    const loader = document.getElementById('cpLoader');
    const stepEl = document.getElementById('cpLoaderStep');
    const bar = document.getElementById('cpLoaderBar');
    loader.hidden = false;
    document.body.style.overflow = 'hidden';

    let idx = 0;
    stepEl.textContent = LOADER_STEPS[0];
    bar.style.width = '5%';

    const stepTimer = setInterval(() => {
      idx = (idx + 1) % LOADER_STEPS.length;
      stepEl.textContent = LOADER_STEPS[idx];
    }, 2500);

    const totalDuration = 9000;
    const start = Date.now();
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / totalDuration) * 95 + 5);
      bar.style.width = pct + '%';
      if (elapsed >= totalDuration) clearInterval(progressTimer);
    }, 120);

    return { stepTimer, progressTimer };
  }

  function hideLoader(timers) {
    const loader = document.getElementById('cpLoader');
    const bar = document.getElementById('cpLoaderBar');
    if (timers) {
      clearInterval(timers.stepTimer);
      clearInterval(timers.progressTimer);
    }
    bar.style.width = '100%';
    setTimeout(() => {
      loader.hidden = true;
      bar.style.width = '0%';
      document.body.style.overflow = '';
    }, 400);
  }

  function runGeneration(packId) {
    const timers = showLoader();
    setTimeout(() => {
      hideLoader(timers);
      showResult(packId);
      incrementEssais();
    }, 8500);
  }

  // RESULT
  function pickResultImage(packId) {
    if (packId === 'libre') {
      const list = PACKS.libre.mockImages;
      return list[getEssaisUsed() % list.length];
    }
    const p = PACKS[packId];
    if (!p) return PACKS.libre.mockImages[0];
    return (getEssaisUsed() % 2 === 0) ? p.mockImage : (p.altMockImage || p.mockImage);
  }

  function getRecapDetails(packId) {
    if (packId === 'libre') {
      const s = state.libreSelections;
      const sol = s.sol ? s.sol.name : '—';
      const murs = s.murs ? s.murs.name : '—';
      const col = s.colonne ? s.colonne.name : '—';
      const par = s.paroi ? s.paroi.name : '—';
      return `${sol} au sol, ${murs} aux murs, ${col}, ${par}.`;
    }
    const p = PACKS[packId];
    return `${p.sol.name} au sol, ${p.murs.name} aux murs, ${p.colonne.name}, ${p.paroi.name}.`;
  }

  function getPackLabel(packId) {
    const p = PACKS[packId];
    return p ? p.label : 'Composition libre';
  }

  function showResult(packId) {
    const img = document.getElementById('cpResultImg');
    const title = document.getElementById('cpResultTitle');
    const packLabel = document.getElementById('cpResultPack');

    const resultSrc = pickResultImage(packId);
    state.lastResultImg = resultSrc;
    img.src = resultSrc;
    img.alt = `Rendu IA — ${getPackLabel(packId)}`;

    const label = getPackLabel(packId);
    title.innerHTML = packId === 'libre'
      ? 'Voilà votre <em>création unique.</em>'
      : `Voilà votre <em>${label}.</em>`;
    packLabel.textContent = label;

    showStep('cpStep4', true);
    updateEssaisUI();
  }

  function initStep4() {
    document.getElementById('cpRegen').addEventListener('click', () => {
      if (getEssaisRestants() <= 0) return;
      if (!state.pack) return;
      runGeneration(state.pack);
    });
    document.getElementById('cpEditChoices').addEventListener('click', () => {
      showStep('cpStep2', true);
    });
    document.getElementById('cpGoToQuote').addEventListener('click', () => {
      buildRecap();
      showStep('cpStep5', true);
    });
  }

  // FORM
  function buildRecap() {
    if (!state.pack) return;
    const recapImg = document.getElementById('cpRecapImg');
    const recapTitle = document.getElementById('cpRecapTitle');
    const recapDetails = document.getElementById('cpRecapDetails');

    recapImg.src = state.lastResultImg || '';
    recapTitle.textContent = state.pack === 'libre' ? 'Composition libre' : `Pack ${getPackLabel(state.pack)}`;
    recapDetails.textContent = getRecapDetails(state.pack);

    const sel = state.pack === 'libre' ? state.libreSelections : PACKS[state.pack];
    setVal('cf-composer-pack', state.pack === 'libre' ? 'Composition libre' : `Pack ${getPackLabel(state.pack)}`);
    setVal('cf-composer-sol-ref', sel.sol ? sel.sol.ref : '');
    setVal('cf-composer-sol-nom', sel.sol ? sel.sol.name : '');
    setVal('cf-composer-murs-ref', sel.murs ? sel.murs.ref : '');
    setVal('cf-composer-murs-nom', sel.murs ? sel.murs.name : '');
    setVal('cf-composer-colonne-ref', sel.colonne ? sel.colonne.ref : '');
    setVal('cf-composer-colonne-nom', sel.colonne ? sel.colonne.name : '');
    setVal('cf-composer-paroi-ref', sel.paroi ? sel.paroi.ref : '');
    setVal('cf-composer-paroi-nom', sel.paroi ? sel.paroi.name : '');
    setVal('cf-composer-essais', String(getEssaisUsed()));
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  function initStep5() {
    document.getElementById('cpRecapEdit').addEventListener('click', () => {
      showStep('cpStep2', true);
    });

    const form = document.getElementById('cpForm');
    const okBox = document.getElementById('cpFormSuccess');
    const koBox = document.getElementById('cpFormError');
    const errMsg = document.getElementById('cpFormErrorMsg');
    const submitBtn = document.getElementById('cpFormSubmit');
    const submitOriginal = submitBtn.innerHTML;

    function showFormError(detailHTML) {
      if (detailHTML && errMsg) errMsg.innerHTML = detailHTML +
        '<br><br>Ou appelez-nous au <a href="tel:+33769010202">07 69 01 02 02</a> · <a href="mailto:info@luxeo.pro">info@luxeo.pro</a>';
      koBox.hidden = false;
      koBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      okBox.hidden = true;
      koBox.hidden = true;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Envoi en cours…';

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
          okBox.hidden = false;
          okBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          let detail = '';
          if (Array.isArray(data.errors) && data.errors.length) {
            detail = '<b>Formspree refuse l\'envoi :</b><br>' +
              data.errors.map(er => '• ' + (er.message || JSON.stringify(er))).join('<br>');
          } else if (data.error) {
            detail = '<b>Formspree refuse l\'envoi :</b> ' + data.error;
          } else {
            detail = '<b>Erreur HTTP ' + res.status + '</b> sans détail.';
          }
          showFormError(detail);
        }
      } catch (err) {
        showFormError('<b>Erreur réseau :</b> ' + (err && err.message ? err.message : 'connexion impossible.'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitOriginal;
      }
    });
  }

  function showStep(id, scroll) {
    const step = document.getElementById(id);
    if (!step) return;
    step.hidden = false;
    if (scroll) {
      const y = step.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  function init() {
    checkResetEssais();
    updateEssaisUI();
    initUpload();
    initStep2();
    initStep4();
    initStep5();
    console.log('Luxeo Composer V2 — ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
