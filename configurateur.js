/* ============================================
   LUXEO — Composer V2 (Phase 2)
   Appel réel au backend /api/generate-image (fal.ai)
   Pas de localStorage ni sessionStorage — état en mémoire uniquement
   ============================================ */

(function () {
  'use strict';

  // Endpoint du backend (configurable via window.LUXEO_API_BASE)
  const API_BASE = (window.LUXEO_API_BASE || '').replace(/\/$/, '');
  const API_GENERATE = API_BASE + '/api/generate-image';
  const API_QUOTE = API_BASE + '/api/send-quote';

  const SVG_COL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><line x1="12" y1="6" x2="12" y2="14"/><circle cx="12" cy="14" r="3.2"/><line x1="9" y1="17" x2="8.5" y2="20.5"/><line x1="12" y1="17" x2="12" y2="20.5"/><line x1="15" y1="17" x2="15.5" y2="20.5"/></svg>';
  const SVG_PAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><line x1="4" y1="9" x2="20" y2="9" opacity="0.4"/><line x1="4" y1="15" x2="20" y2="15" opacity="0.4"/></svg>';

  const CATALOG = {
    sol: [
      { ref: 'LUXEO-SOL-01', name: 'Marbre Calacatta', desc: 'blanc veiné gris',  img: '/assets/tiles/LUX-MAR-001.jpg', en: 'white veined Calacatta marble' },
      { ref: 'LUXEO-SOL-02', name: 'Travertin clair',  desc: 'beige naturel',      img: '/assets/tiles/LUX-MAR-004.jpg', en: 'light travertine stone, warm beige' },
      { ref: 'LUXEO-SOL-03', name: 'Béton ciré',       desc: 'gris moyen',         img: '/assets/tiles/LUX-BET-005.jpg', en: 'polished concrete, medium grey, matte' },
      { ref: 'LUXEO-SOL-04', name: 'Anthracite mat',   desc: '60×60 cm',           img: '/assets/tiles/LUX-BET-004.jpg', en: 'matte anthracite large-format tiles 60x60cm' },
      { ref: 'LUXEO-SOL-05', name: 'Effet bois chêne', desc: 'lasuré clair',       img: '/assets/tiles/LUX-BOI-001.jpg', en: 'light oak wood-effect porcelain tiles, plank format' },
      { ref: 'LUXEO-SOL-06', name: 'Ardoise noire',    desc: 'mate texturée',      img: '/assets/tiles/LUX-PIE-003.jpg', en: 'matte black slate, textured, anti-slip' },
    ],
    murs: [
      { ref: 'LUXEO-MUR-01', name: 'Grand format blanc',     desc: 'mat 60×120',     img: '/assets/tiles/LUX-MAR-003.jpg', en: 'large-format matte white tiles 60x120cm' },
      { ref: 'LUXEO-MUR-02', name: 'Grand format anthracite', desc: 'mat 60×120',    img: '/assets/tiles/LUX-MFO-002.jpg', en: 'large-format matte anthracite tiles 60x120cm' },
      { ref: 'LUXEO-MUR-03', name: 'Mosaïque verticale',     desc: 'beige & blanc',   img: '/assets/tiles/LUX-MOS-003.jpg', en: 'vertical mosaic strips, beige and white' },
      { ref: 'LUXEO-MUR-04', name: 'Béton ciré clair',       desc: 'mat',             img: '/assets/tiles/LUX-BET-001.jpg', en: 'light polished concrete, matte' },
      { ref: 'LUXEO-MUR-05', name: 'Pierre naturelle',       desc: 'beige',           img: '/assets/tiles/LUX-PIE-001.jpg', en: 'natural beige stone wall' },
      { ref: 'LUXEO-MUR-06', name: 'Lambris teck',           desc: 'vertical',        img: '/assets/tiles/LUX-BOI-002.jpg', en: 'vertical teak wood paneling, warm tone' },
    ],
    colonne: [
      { ref: 'LUXEO-COL-01', name: 'Inox brossé',     desc: 'thermostatique', gradient: 'linear-gradient(135deg,#9ca3a8,#5a6166)', en: 'brushed stainless steel thermostatic shower column' },
      { ref: 'LUXEO-COL-02', name: 'Noir mat',        desc: 'thermostatique', gradient: 'linear-gradient(135deg,#2a2a2a,#0a0a0a)', en: 'matte black thermostatic shower column' },
      { ref: 'LUXEO-COL-03', name: 'Or brossé',       desc: 'thermostatique', gradient: 'linear-gradient(135deg,#d4b265,#9e7d3b)', en: 'brushed gold thermostatic shower column' },
      { ref: 'LUXEO-COL-04', name: 'Chromé classique', desc: 'brillant',      gradient: 'linear-gradient(135deg,#e8edf0,#a8b0b6)', en: 'polished chrome classic shower column' },
    ],
    paroi: [
      { ref: 'LUXEO-PAR-01', name: 'Verre clair',         desc: '8 mm sécurit',   gradient: 'linear-gradient(135deg,#e8f4f5,#bcd9dc)', en: 'clear 8mm tempered glass walk-in panel, frameless' },
      { ref: 'LUXEO-PAR-02', name: 'Verre sablé',         desc: '8 mm opaque',    gradient: 'linear-gradient(135deg,#f4f7f7,#d0d8d8)', en: 'sandblasted frosted 8mm glass walk-in panel' },
      { ref: 'LUXEO-PAR-03', name: 'Profilé noir + verre', desc: 'cadre noir mat', gradient: 'linear-gradient(135deg,#1a1a1a 0%,#1a1a1a 14%,#e8f4f5 14%,#bcd9dc 100%)', en: 'matte black framed walk-in panel with clear glass' },
    ],
  };

  const PACKS = {
    'suite-marbre': {
      label: 'Suite Marbre',
      sol:     { ref: 'LUXEO-SOL-01', name: 'Marbre Calacatta',            en: 'white veined Calacatta marble' },
      murs:    { ref: 'LUXEO-MUR-01', name: 'Grand format blanc mat',      en: 'large-format matte white tiles 60x120cm' },
      colonne: { ref: 'LUXEO-COL-03', name: 'Or brossé thermostatique',    en: 'brushed gold thermostatic shower column' },
      paroi:   { ref: 'LUXEO-PAR-01', name: 'Verre clair 8 mm',            en: 'clear 8mm tempered glass walk-in panel, frameless' },
    },
    'spa-zen': {
      label: 'Spa Zen',
      sol:     { ref: 'LUXEO-SOL-06', name: 'Ardoise noire mate',          en: 'matte black slate, textured, anti-slip' },
      murs:    { ref: 'LUXEO-MUR-06', name: 'Lambris teck vertical',       en: 'vertical teak wood paneling, warm tone' },
      colonne: { ref: 'LUXEO-COL-02', name: 'Noir mat thermostatique',     en: 'matte black thermostatic shower column' },
      paroi:   { ref: 'LUXEO-PAR-03', name: 'Profilé noir + verre clair',  en: 'matte black framed walk-in panel with clear glass' },
    },
    'provence': {
      label: 'Provence',
      sol:     { ref: 'LUXEO-SOL-02', name: 'Pierre travertin beige',      en: 'light travertine stone, warm beige' },
      murs:    { ref: 'LUXEO-MUR-05', name: 'Pierre naturelle beige',      en: 'natural beige stone wall' },
      colonne: { ref: 'LUXEO-COL-03', name: 'Or brossé thermostatique',    en: 'brushed gold thermostatic shower column' },
      paroi:   { ref: 'LUXEO-PAR-01', name: 'Verre clair (profilé bronze)', en: 'clear glass walk-in panel with bronze profile' },
    },
  };

  // État en mémoire — pas de localStorage
  const state = {
    photo: null,            // { file: File, dataUrl: string, name: string }
    pack: null,
    libreSelections: { sol: null, murs: null, colonne: null, paroi: null },
    lastResultUrl: null,
    lastPromptUsed: null,
    essaisUsed: 0,          // compteur en mémoire (reset au reload — backend rate-limit prend le relais)
  };

  const ESSAIS_MAX = 2;

  function getEssaisRestants() { return Math.max(0, ESSAIS_MAX - state.essaisUsed); }
  function incrementEssais() {
    state.essaisUsed += 1;
    updateEssaisUI();
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
    if (inp) inp.value = state.essaisUsed;
  }

  // ============================================
  // ÉTAPE 01 — UPLOAD
  // ============================================
  function initUpload() {
    const drop = document.getElementById('cpDrop');
    const fileInput = document.getElementById('cpFile');
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

    function setPreviewFromFile(file, dataUrl) {
      previewImg.src = dataUrl;
      previewName.textContent = file.name || 'photo';
      empty.hidden = true;
      preview.hidden = false;
      actions.hidden = false;
      state.photo = { file, dataUrl, name: file.name };
    }

    function resetUpload() {
      fileInput.value = '';
      empty.hidden = false;
      preview.hidden = true;
      actions.hidden = true;
      state.photo = null;
      previewImg.src = '';
    }

    function handleFile(f) {
      clearError();
      if (!f) return;
      const okType = /image\/(jpeg|jpg|png|heic|heif|webp)/i.test(f.type) || /\.(jpe?g|png|heic|heif|webp)$/i.test(f.name);
      if (!okType) { showError('Format non supporté. Utilisez JPG, PNG, HEIC ou WEBP.'); return; }
      if (f.size > 10 * 1024 * 1024) { showError('Le fichier dépasse 10 Mo. Réduisez la taille.'); return; }
      const reader = new FileReader();
      reader.onload = (e) => setPreviewFromFile(f, e.target.result);
      reader.onerror = () => showError('Impossible de lire le fichier.');
      reader.readAsDataURL(f);
    }

    drop.addEventListener('click', (e) => {
      if (e.target.closest('.cp-drop-preview')) return;
      fileInput.click();
    });
    drop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
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

    // Démo : charge before-avignon.jpg comme File
    demoLink.addEventListener('click', async () => {
      try {
        const res = await fetch('/assets/before-avignon.jpg');
        const blob = await res.blob();
        const file = new File([blob], 'photo-de-demo.jpg', { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = (e) => setPreviewFromFile(file, e.target.result);
        reader.readAsDataURL(file);
      } catch {
        showError('Impossible de charger la photo de démo.');
      }
    });
  }

  // ============================================
  // ÉTAPE 02 — STYLE
  // ============================================
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
        if (!state.photo) {
          showStep('cpStep1', true);
          return;
        }
        state.pack = packId;
        document.querySelectorAll('.cp-pack').forEach(p => p.classList.remove('cp-pack-selected'));
        const card = btn.closest('.cp-pack');
        if (card) card.classList.add('cp-pack-selected');
        runGeneration();
      });
    });

    const libreToggle = document.getElementById('cpLibreToggle');
    const libreBlock = document.getElementById('cpLibre');
    libreToggle.addEventListener('click', () => {
      const open = libreBlock.hidden;
      libreBlock.hidden = !open;
      libreToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) libreBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      if (!state.photo) { showStep('cpStep1', true); return; }
      state.pack = 'libre';
      runGeneration();
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

  // ============================================
  // LOADER (animation pendant l'appel API)
  // ============================================
  const LOADER_STEPS = [
    'Analyse de votre photo…',
    'Application des matériaux sélectionnés…',
    'Construction de la perspective…',
    'Réglage de l\'ambiance lumière…',
    'Touches finales…',
  ];
  let loaderTimers = null;

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

    const totalDuration = 20000; // ~20s (vraie latence IA)
    const start = Date.now();
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(92, (elapsed / totalDuration) * 92 + 5);
      bar.style.width = pct + '%';
    }, 200);

    loaderTimers = { stepTimer, progressTimer };
  }

  function hideLoader() {
    const loader = document.getElementById('cpLoader');
    const bar = document.getElementById('cpLoaderBar');
    if (loaderTimers) {
      clearInterval(loaderTimers.stepTimer);
      clearInterval(loaderTimers.progressTimer);
      loaderTimers = null;
    }
    bar.style.width = '100%';
    setTimeout(() => {
      loader.hidden = true;
      bar.style.width = '0%';
      document.body.style.overflow = '';
    }, 400);
  }

  // ============================================
  // GÉNÉRATION — appel réel au backend
  // ============================================
  async function runGeneration() {
    if (!state.photo || !state.pack) return;

    showLoader();

    try {
      const sel = state.pack === 'libre' ? state.libreSelections : PACKS[state.pack];

      const fd = new FormData();
      // Photo : envoie le File (multipart/form-data)
      fd.append('image', state.photo.file, state.photo.name || 'photo.jpg');
      // Options en anglais pour le modèle IA (clearer prompt)
      fd.append('pack', state.pack);
      if (sel.sol)     fd.append('sol',     sel.sol.en || sel.sol.name || '');
      if (sel.murs)    fd.append('murs',    sel.murs.en || sel.murs.name || '');
      if (sel.colonne) fd.append('colonne', sel.colonne.en || sel.colonne.name || '');
      if (sel.paroi)   fd.append('paroi',   sel.paroi.en || sel.paroi.name || '');

      const res = await fetch(API_GENERATE, {
        method: 'POST',
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg = data.error || `Erreur HTTP ${res.status}`;
        throw new Error(errMsg);
      }
      if (!data.image_url) {
        throw new Error('Réponse incomplète du serveur.');
      }

      // Précharge l'image avant de cacher le loader (évite un flash blanc)
      await preloadImage(data.image_url);

      state.lastResultUrl = data.image_url;
      state.lastPromptUsed = data.prompt_used || '';
      incrementEssais();
      hideLoader();
      showResult();
    } catch (err) {
      console.error('[Composer] generation failed:', err);
      hideLoader();
      showGenerationError(err.message || 'La génération a échoué.');
    }
  }

  function preloadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // continue quand même
      img.src = url;
    });
  }

  function showGenerationError(message) {
    // Affiche un toast d'erreur en revenant à l'étape 2
    const step2 = document.getElementById('cpStep2');
    let toast = document.getElementById('cpGenError');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cpGenError';
      toast.className = 'cp-drop-error';
      toast.style.maxWidth = '720px';
      toast.style.margin = '24px auto 0';
      step2.querySelector('.wrap').appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span><b>Génération impossible :</b> ${escapeHTML(message)}. Réessayez dans quelques instants ou demandez un devis en direct au <a href="tel:+33769010202">07 69 01 02 02</a>.</span>
    `;
    toast.hidden = false;
    toast.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { toast.hidden = true; }, 9000);
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // ============================================
  // ÉTAPE 04 — RÉSULTAT
  // ============================================
  function getRecapDetails() {
    if (state.pack === 'libre') {
      const s = state.libreSelections;
      return `${s.sol.name} au sol, ${s.murs.name} aux murs, ${s.colonne.name}, ${s.paroi.name}.`;
    }
    const p = PACKS[state.pack];
    return `${p.sol.name} au sol, ${p.murs.name} aux murs, ${p.colonne.name}, ${p.paroi.name}.`;
  }
  function getPackLabel() {
    if (state.pack === 'libre') return 'Composition libre';
    return PACKS[state.pack] ? PACKS[state.pack].label : 'Composition';
  }

  function showResult() {
    const img = document.getElementById('cpResultImg');
    const title = document.getElementById('cpResultTitle');
    const packLabel = document.getElementById('cpResultPack');

    img.src = state.lastResultUrl;
    img.alt = `Rendu IA — ${getPackLabel()}`;

    const label = getPackLabel();
    title.innerHTML = state.pack === 'libre'
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
      runGeneration();
    });
    document.getElementById('cpEditChoices').addEventListener('click', () => {
      showStep('cpStep2', true);
    });
    document.getElementById('cpGoToQuote').addEventListener('click', () => {
      buildRecap();
      showStep('cpStep5', true);
    });
  }

  // ============================================
  // ÉTAPE 05 — Formulaire devis
  // ============================================
  function buildRecap() {
    if (!state.pack) return;
    const recapImg = document.getElementById('cpRecapImg');
    const recapTitle = document.getElementById('cpRecapTitle');
    const recapDetails = document.getElementById('cpRecapDetails');

    recapImg.src = state.lastResultUrl || '';
    recapTitle.textContent = state.pack === 'libre' ? 'Composition libre' : `Pack ${getPackLabel()}`;
    recapDetails.textContent = getRecapDetails();

    const sel = state.pack === 'libre' ? state.libreSelections : PACKS[state.pack];
    setVal('cf-composer-pack', state.pack === 'libre' ? 'Composition libre' : `Pack ${getPackLabel()}`);
    setVal('cf-composer-sol-ref',     sel.sol ? sel.sol.ref : '');
    setVal('cf-composer-sol-nom',     sel.sol ? sel.sol.name : '');
    setVal('cf-composer-murs-ref',    sel.murs ? sel.murs.ref : '');
    setVal('cf-composer-murs-nom',    sel.murs ? sel.murs.name : '');
    setVal('cf-composer-colonne-ref', sel.colonne ? sel.colonne.ref : '');
    setVal('cf-composer-colonne-nom', sel.colonne ? sel.colonne.name : '');
    setVal('cf-composer-paroi-ref',   sel.paroi ? sel.paroi.ref : '');
    setVal('cf-composer-paroi-nom',   sel.paroi ? sel.paroi.name : '');
    setVal('cf-composer-essais',      String(state.essaisUsed));

    // Ajoute l'URL du rendu généré pour que ça arrive dans le mail Formspree
    let urlInput = document.getElementById('cf-composer-image-url');
    if (!urlInput) {
      urlInput = document.createElement('input');
      urlInput.type = 'hidden';
      urlInput.id = 'cf-composer-image-url';
      urlInput.name = 'composer_image_generee_url';
      document.getElementById('cpForm').appendChild(urlInput);
    }
    urlInput.value = state.lastResultUrl || '';
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
        // Joint la photo originale uploadée par l'utilisateur (Composer)
        if (state.photo && state.photo.file) {
          fd.append('photo_originale', state.photo.file, state.photo.name || 'photo.jpg');
        }
        // Transmet le prompt utilisé (utile pour debug côté Luxeo)
        if (state.lastPromptUsed) {
          fd.append('composer_prompt_utilise', state.lastPromptUsed);
        }

        const res = await fetch(API_QUOTE, {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success !== false) {
          form.reset();
          form.querySelectorAll('input, textarea, select').forEach(i => i.dispatchEvent(new Event('input')));
          okBox.hidden = false;
          okBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          const errText = (data && data.error) ? data.error : `Erreur HTTP ${res.status}`;
          showFormError('<b>Envoi impossible :</b> ' + escapeHTML(errText));
        }
      } catch (err) {
        showFormError('<b>Erreur réseau :</b> ' + (err && err.message ? err.message : 'connexion impossible au serveur Luxeo.'));
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
    updateEssaisUI();
    initUpload();
    initStep2();
    initStep4();
    initStep5();
    console.log('Luxeo Composer V2 (real AI) — ready · API:', API_GENERATE);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
