/* ============================================================
   LUXEO — composer.js
   Configurateur interactif : catalogue 4 zones + visualiseur live
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     CATALOGUE — 4 onglets · refs LM-XXX
     Chaque produit a un "render" décrivant comment l'appliquer
     dans le visualiseur (couleur, motif, classe css).
     ============================================================ */
  const CATALOG = {
    sol: [
      { ref: 'LM-MARB-6060', name: 'Marbre Calacatta',     dims: '60x60 cm', price: '49 €/m²', color: '#e8e2d4', pattern: 'marble' },
      { ref: 'LM-PIER-8080', name: 'Pierre Naturelle Beige', dims: '80x80 cm', price: '38 €/m²', color: '#c9b994', pattern: 'stone' },
      { ref: 'LM-BOIS-2090', name: 'Effet Bois Chêne',     dims: '20x90 cm', price: '42 €/m²', color: '#a8825a', pattern: 'wood' },
      { ref: 'LM-BETN-6060', name: 'Béton Ciré Gris',      dims: '60x60 cm', price: '34 €/m²', color: '#8a8d8a', pattern: 'concrete' },
      { ref: 'LM-NOIR-6060', name: 'Noir Mat Ardoise',     dims: '60x60 cm', price: '45 €/m²', color: '#2a2a2c', pattern: 'matte' },
      { ref: 'LM-TERR-3030', name: 'Terrazzo Crème',       dims: '30x30 cm', price: '52 €/m²', color: '#d8cdb4', pattern: 'terrazzo' },
      { ref: 'LM-BLAN-8080', name: 'Blanc Pur Brillant',   dims: '80x80 cm', price: '36 €/m²', color: '#f0eee8', pattern: 'gloss' },
      { ref: 'LM-GRIS-6060', name: 'Gris Anthracite Mat',  dims: '60x60 cm', price: '40 €/m²', color: '#4a4d50', pattern: 'matte' },
    ],
    murs: [
      { ref: 'LM-MAR2-3060', name: 'Marbre Veiné Blanc',   dims: '30x60 cm', price: '55 €/m²', color: '#ece8df', pattern: 'marble' },
      { ref: 'LM-MOSA-2525', name: 'Mosaïque Turquoise',   dims: '2,5x2,5 cm', price: '68 €/m²', color: '#1ba8a7', pattern: 'mosaic' },
      { ref: 'LM-FAYE-3060', name: 'Faïence Blanc Mat',    dims: '30x60 cm', price: '28 €/m²', color: '#f5f4f0', pattern: 'matte' },
      { ref: 'LM-GRDF-12060', name: 'Grand Format Beige',  dims: '60x120 cm', price: '72 €/m²', color: '#d8cfb8', pattern: 'stone' },
      { ref: 'LM-MMOS-1530', name: 'Mosaïque Marbre Or',   dims: '15x30 cm', price: '85 €/m²', color: '#c9a84c', pattern: 'gold' },
      { ref: 'LM-BETM-3060', name: 'Béton Ciré Anthracite', dims: '30x60 cm', price: '38 €/m²', color: '#3d4144', pattern: 'concrete' },
      { ref: 'LM-VERT-2525', name: 'Mosaïque Vert Sapin',  dims: '2,5x2,5 cm', price: '64 €/m²', color: '#2e5a4e', pattern: 'mosaic' },
      { ref: 'LM-CHEV-1075', name: 'Chevron Marbre Clair', dims: '10x75 cm', price: '78 €/m²', color: '#e0dccf', pattern: 'chevron' },
    ],
    colonne: [
      { ref: 'GR-RAINSH-450', name: 'Grohe Rainshower',     dims: 'Thermostatique', price: '850 €', color: '#c8ccd0', style: 'grohe' },
      { ref: 'HG-PULSI-300',  name: 'Hansgrohe Pulsify',    dims: 'Encastrée',     price: '720 €', color: '#d4d8dc', style: 'hansgrohe' },
      { ref: 'GR-THERM-500',  name: 'Grohe SmartControl',   dims: 'Thermo digital', price: '1 250 €', color: '#b8bcc0', style: 'thermo' },
      { ref: 'HG-CROMA-280',  name: 'Hansgrohe Croma',      dims: 'Mitigeur',      price: '480 €', color: '#cdd1d5', style: 'hansgrohe' },
      { ref: 'GR-ESSEN-OR',   name: 'Grohe Essence Or',     dims: 'Thermo or brossé', price: '1 480 €', color: '#c9a84c', style: 'or' },
      { ref: 'HG-AXOR-NOIR',  name: 'Axor Noir Mat',        dims: 'Encastrée noir', price: '1 380 €', color: '#1a1a1c', style: 'noir' },
    ],
    paroi: [
      { ref: 'PA-FIXE-6mm',  name: 'Paroi Fixe 6 mm',       dims: '90x200 cm', price: '380 €', color: '#dde5e8', style: 'fixe' },
      { ref: 'PA-FIXE-8mm',  name: 'Paroi Fixe 8 mm Sécurit', dims: '120x200 cm', price: '590 €', color: '#d5dde0', style: 'fixe' },
      { ref: 'PA-PIVOT-8mm', name: 'Paroi Pivotante 8 mm',  dims: '90x200 cm', price: '720 €', color: '#d8e0e3', style: 'pivot' },
      { ref: 'PA-WALK-8mm',  name: 'Walk-in 8 mm',          dims: '140x200 cm', price: '890 €', color: '#dce4e7', style: 'walkin' },
      { ref: 'PA-NOIR-8mm',  name: 'Walk-in Profilé Noir',  dims: '120x200 cm', price: '980 €', color: '#2a2a2a', style: 'noir' },
      { ref: 'PA-OR-8mm',    name: 'Pivotante Profilé Or',  dims: '90x200 cm', price: '1 120 €', color: '#c9a84c', style: 'or' },
    ],
  };

  /* ============================================================
     ÉTAT — sélection actuelle
     ============================================================ */
  const selection = {
    sol: null, murs: null, colonne: null, paroi: null
  };

  const ZONE_LABELS = { sol: 'Sol', murs: 'Murs', colonne: 'Colonne', paroi: 'Paroi' };

  /* ============================================================
     GÉNÉRATION D'IMAGE PRODUIT (SVG inline encodé)
     ============================================================ */
  function productImage(p, zone) {
    const c = encodeURIComponent(p.color);
    // motif selon le pattern
    let bg;
    if (p.pattern === 'marble' || p.pattern === 'gloss') {
      bg = `linear-gradient(135deg, ${p.color} 0%, #ffffff 50%, ${p.color} 100%)`;
    } else if (p.pattern === 'wood') {
      bg = `linear-gradient(90deg, ${p.color}, #8a6a44 30%, ${p.color} 60%, #6a4a24)`;
    } else if (p.pattern === 'concrete' || p.pattern === 'matte') {
      bg = `linear-gradient(135deg, ${p.color}, ${shade(p.color, -15)})`;
    } else if (p.pattern === 'mosaic') {
      bg = `repeating-conic-gradient(${p.color} 0% 25%, ${shade(p.color, 15)} 25% 50%)`;
    } else if (p.pattern === 'terrazzo') {
      bg = `radial-gradient(circle at 30% 30%, ${shade(p.color, -20)} 6%, ${p.color} 6%), radial-gradient(circle at 70% 70%, ${shade(p.color, 20)} 5%, transparent 5%), ${p.color}`;
    } else if (p.pattern === 'stone') {
      bg = `linear-gradient(135deg, ${p.color} 0%, ${shade(p.color, -10)} 50%, ${p.color} 100%)`;
    } else if (p.pattern === 'chevron') {
      bg = `linear-gradient(135deg, ${p.color} 25%, ${shade(p.color, -10)} 25%, ${shade(p.color, -10)} 50%, ${p.color} 50%, ${p.color} 75%, ${shade(p.color, -10)} 75%)`;
    } else if (p.pattern === 'gold') {
      bg = `linear-gradient(135deg, ${p.color}, #e6c878 50%, ${p.color})`;
    } else {
      bg = p.color;
    }

    // Colonnes et parois : icon + couleur
    if (zone === 'colonne') {
      return `linear-gradient(180deg, ${p.color}, ${shade(p.color, -25)}), radial-gradient(circle at 50% 20%, ${shade(p.color, 30)} 0%, transparent 30%)`;
    }
    if (zone === 'paroi') {
      return `linear-gradient(135deg, rgba(255,255,255,0.4), rgba(180,210,220,0.3)), linear-gradient(${p.color}, ${shade(p.color, -20)})`;
    }
    return bg;
  }

  function shade(hex, percent) {
    const f = parseInt(hex.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = Math.abs(percent) / 100;
    const R = f >> 16, G = (f >> 8) & 0x00FF, B = f & 0x0000FF;
    const newR = Math.round((t - R) * p) + R;
    const newG = Math.round((t - G) * p) + G;
    const newB = Math.round((t - B) * p) + B;
    return '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
  }

  /* ============================================================
     RENDU CATALOGUE
     ============================================================ */
  const productsEl = document.getElementById('cmpProducts');
  const tabsEl = document.querySelectorAll('.cmp-tab');
  let currentTab = 'sol';

  function renderProducts() {
    const items = CATALOG[currentTab];
    productsEl.innerHTML = items.map(p => {
      const isSelected = selection[currentTab] && selection[currentTab].ref === p.ref;
      const img = productImage(p, currentTab);
      const style = `background: ${img};`;
      return `
        <article class="cmp-product${isSelected ? ' selected' : ''}" data-ref="${p.ref}" data-zone="${currentTab}">
          <div class="cmp-prod-img" style="${style}"></div>
          <div class="cmp-prod-info">
            <div class="cmp-prod-ref">Réf. ${p.ref}</div>
            <div class="cmp-prod-name">${p.name}</div>
            <div class="cmp-prod-meta">
              <span>${p.dims}</span>
              <span class="cmp-prod-price">${p.price}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    productsEl.querySelectorAll('.cmp-product').forEach(card => {
      card.addEventListener('click', () => {
        const ref = card.dataset.ref;
        const zone = card.dataset.zone;
        const product = CATALOG[zone].find(x => x.ref === ref);
        applySelection(zone, product);
      });
    });
  }

  /* ============================================================
     TABS
     ============================================================ */
  tabsEl.forEach(tab => {
    tab.addEventListener('click', () => {
      tabsEl.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderProducts();
    });
  });

  /* ============================================================
     APPLICATION DANS LE VISUALISEUR
     ============================================================ */
  const scene = {
    floor: document.getElementById('scFloor'),
    wallBack: document.getElementById('scWallBack'),
    wallLeft: document.getElementById('scWallLeft'),
    column: document.getElementById('scColumn'),
    glass: document.getElementById('scGlass'),
    info: document.getElementById('scInfoVal'),
  };

  function applySelection(zone, product) {
    selection[zone] = product;

    // Application visuelle
    if (zone === 'sol') {
      applyTileTexture(scene.floor, product, 'floor');
    } else if (zone === 'murs') {
      applyTileTexture(scene.wallBack, product, 'wall');
      applyTileTexture(scene.wallLeft, product, 'wallLeft');
    } else if (zone === 'colonne') {
      // reset classes style-*
      scene.column.className = 'sc-column';
      scene.column.classList.add('style-' + product.style);
    } else if (zone === 'paroi') {
      scene.glass.className = 'sc-glass';
      scene.glass.classList.add('style-' + product.style);
    }

    // Effet "flash" rapide
    scene.info.textContent = product.name + ' (Réf. ' + product.ref + ')';
    flashScene();

    updateChips();
    updateRecap();
    updateHidden();
    renderProducts();
    showToast(`${ZONE_LABELS[zone]} : ${product.name}`);
  }

  function applyTileTexture(el, p, kind) {
    if (!el) return;
    const color = p.color;
    const dark = shade(color, -15);
    const light = shade(color, 15);

    let pattern;
    if (p.pattern === 'marble' || p.pattern === 'gloss') {
      pattern = `
        linear-gradient(${kind === 'floor' ? '180deg' : '135deg'}, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(0,0,0,0.2) 100%),
        repeating-linear-gradient(0deg, ${dark} 0 1px, transparent 1px 60px),
        repeating-linear-gradient(90deg, ${dark} 0 1px, transparent 1px 60px),
        linear-gradient(135deg, ${color}, ${light} 50%, ${color})`;
    } else if (p.pattern === 'mosaic') {
      pattern = `
        repeating-conic-gradient(${color} 0% 25%, ${dark} 25% 50%),
        linear-gradient(${color}, ${color})`;
      el.style.backgroundSize = '20px 20px, 100% 100%';
    } else if (p.pattern === 'wood') {
      pattern = `
        linear-gradient(180deg, rgba(0,0,0,0.2), transparent 50%),
        repeating-linear-gradient(90deg, ${color} 0 80px, ${dark} 80px 84px, ${color} 84px 162px),
        linear-gradient(${color}, ${color})`;
    } else if (p.pattern === 'concrete' || p.pattern === 'matte') {
      pattern = `
        radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06) 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, rgba(0,0,0,0.1) 0%, transparent 50%),
        linear-gradient(${color}, ${dark})`;
    } else if (p.pattern === 'terrazzo') {
      pattern = `
        radial-gradient(circle at 25% 30%, ${dark} 4%, transparent 4%),
        radial-gradient(circle at 75% 60%, ${light} 3%, transparent 3%),
        radial-gradient(circle at 50% 80%, ${dark} 5%, transparent 5%),
        linear-gradient(${color}, ${color})`;
      el.style.backgroundSize = '40px 40px, 50px 50px, 60px 60px, 100% 100%';
    } else if (p.pattern === 'chevron') {
      pattern = `
        linear-gradient(135deg, ${color} 25%, ${dark} 25%, ${dark} 50%, ${color} 50%, ${color} 75%, ${dark} 75%),
        linear-gradient(${color}, ${color})`;
      el.style.backgroundSize = '40px 40px, 100% 100%';
    } else if (p.pattern === 'gold') {
      pattern = `
        linear-gradient(135deg, rgba(255,255,255,0.3), transparent 50%),
        linear-gradient(135deg, ${color}, #e6c878 50%, ${dark})`;
    } else {
      pattern = `linear-gradient(135deg, ${color}, ${dark})`;
    }

    // Pour la perspective, on ajoute des overlays
    if (kind === 'floor') {
      el.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 60%, rgba(255,255,255,0.06) 100%), ${pattern}`;
    } else if (kind === 'wallLeft') {
      el.style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.08) 100%), ${pattern}`;
    } else {
      el.style.backgroundImage = `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%), ${pattern}`;
    }
    el.style.backgroundColor = color;
  }

  function flashScene() {
    const sceneEl = document.getElementById('cmpScene');
    sceneEl.style.transition = 'box-shadow .4s var(--ease)';
    sceneEl.style.boxShadow = '0 0 0 3px var(--turquoise), var(--sh-strong), 0 0 80px rgba(14,124,123,0.4)';
    setTimeout(() => {
      sceneEl.style.boxShadow = '';
    }, 600);
  }

  /* ============================================================
     CHIPS "Vos carrelages sélectionnés"
     ============================================================ */
  function updateChips() {
    document.querySelectorAll('.cmp-chip').forEach(chip => {
      const zone = chip.dataset.zone;
      const sel = selection[zone];
      const imgEl = chip.querySelector('.chip-img');
      const refEl = chip.querySelector('.chip-ref');
      const emptyEl = chip.querySelector('.chip-empty');

      if (sel) {
        chip.classList.add('filled');
        imgEl.style.background = productImage(sel, zone);
        if (emptyEl) emptyEl.style.display = 'none';
        refEl.textContent = `${sel.name} · ${sel.ref}`;
      } else {
        chip.classList.remove('filled');
        imgEl.style.background = '';
        if (emptyEl) emptyEl.style.display = '';
        refEl.textContent = '— Non sélectionné —';
      }
    });

    // Bind X buttons (only once needed but safe to re-bind)
    document.querySelectorAll('.chip-x').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const zone = btn.closest('.cmp-chip').dataset.zone;
        selection[zone] = null;
        resetZone(zone);
        updateChips();
        updateRecap();
        updateHidden();
        renderProducts();
      };
    });
  }

  function resetZone(zone) {
    if (zone === 'sol') {
      scene.floor.style.backgroundImage = '';
      scene.floor.style.backgroundColor = '';
      scene.floor.removeAttribute('style');
    } else if (zone === 'murs') {
      scene.wallBack.removeAttribute('style');
      scene.wallLeft.removeAttribute('style');
    } else if (zone === 'colonne') {
      scene.column.className = 'sc-column';
    } else if (zone === 'paroi') {
      scene.glass.className = 'sc-glass';
    }
    scene.info.textContent = 'Composez votre douche';
  }

  /* ============================================================
     RÉCAP devis + champs cachés
     ============================================================ */
  function updateRecap() {
    document.querySelectorAll('.cmp-recap-item').forEach(item => {
      const zone = item.dataset.zone;
      const sel = selection[zone];
      const r = item.querySelector('.r');
      if (sel) {
        item.classList.add('filled');
        r.textContent = `${sel.name} (${sel.ref})`;
      } else {
        item.classList.remove('filled');
        r.textContent = '—';
      }
    });
  }

  function updateHidden() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    Object.keys(selection).forEach(zone => {
      const s = selection[zone];
      setVal('composer_' + zone, s ? `${s.name} - Réf. ${s.ref} - ${s.dims} - ${s.price}` : '');
    });
  }

  /* ============================================================
     "TOUT EFFACER"
     ============================================================ */
  const clearBtn = document.getElementById('cmpClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Object.keys(selection).forEach(zone => {
        selection[zone] = null;
        resetZone(zone);
      });
      updateChips();
      updateRecap();
      updateHidden();
      renderProducts();
      showToast('Sélection effacée');
    });
  }

  /* ============================================================
     TOAST
     ============================================================ */
  let toastEl;
  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'cmp-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ============================================================
     SUBMIT du formulaire composer
     ============================================================ */
  const cmpForm = document.getElementById('cmpForm');
  if (cmpForm) {
    cmpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateHidden();

      // Construire un récap pour confirmation visuelle
      const data = {};
      Object.keys(selection).forEach(z => {
        data[z] = selection[z] ? `${selection[z].name} (${selection[z].ref})` : 'non sélectionné';
      });

      const btn = cmpForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Composition envoyée à info@luxeo.pro';
      btn.disabled = true;
      btn.style.background = 'var(--or)';
      btn.style.borderColor = 'var(--or)';
      btn.style.color = '#1a1100';
      console.log('Composer submit — sélections transmises :', data);
      setTimeout(() => {
        cmpForm.reset();
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 4500);
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  renderProducts();
  updateChips();
  updateRecap();
})();
