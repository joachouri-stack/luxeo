/* ============================================================
   LUXEO — composer.js
   Configurateur interactif :
   - Catalogue 4 onglets (Sol/Murs/Colonne/Paroi) avec photos HD
   - Visualiseur photoréaliste : photo de base + overlays teintés
   - Application instantanée + références transmises au formulaire
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     CATALOGUE — Photos HD via Unsplash
     Chaque produit a : ref, name, dims, price, img (photo HD),
     tint (couleur dominante pour l'overlay du visualiseur).
     ============================================================ */
  const U = 'https://images.unsplash.com/';

  const CATALOG = {
    sol: [
      { ref: 'LM-MARB-6060', name: 'Marbre Calacatta Blanc',  dims: '60×60 cm', price: '49 €/m²',
        img: U+'photo-1615971677499-5467cbab01c0?auto=format&fit=crop&w=400&q=80',
        tint: '#e8e2d4' },
      { ref: 'LM-PIER-8080', name: 'Pierre Naturelle Beige',  dims: '80×80 cm', price: '38 €/m²',
        img: U+'photo-1620626011761-996317b8d101?auto=format&fit=crop&w=400&q=80',
        tint: '#c9b994' },
      { ref: 'LM-BOIS-2090', name: 'Effet Bois Chêne Doré',   dims: '20×90 cm', price: '42 €/m²',
        img: U+'photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80',
        tint: '#a8825a' },
      { ref: 'LM-BETN-6060', name: 'Béton Ciré Gris Clair',   dims: '60×60 cm', price: '34 €/m²',
        img: U+'photo-1600566753086-00f18fe6929e?auto=format&fit=crop&w=400&q=80',
        tint: '#8a8d8a' },
      { ref: 'LM-NOIR-6060', name: 'Noir Mat Ardoise',         dims: '60×60 cm', price: '45 €/m²',
        img: U+'photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=400&q=80',
        tint: '#2a2a2c' },
      { ref: 'LM-TERR-3030', name: 'Terrazzo Crème Vénitien',  dims: '30×30 cm', price: '52 €/m²',
        img: U+'photo-1622372738946-62e02505feb3?auto=format&fit=crop&w=400&q=80',
        tint: '#d8cdb4' },
      { ref: 'LM-BLAN-8080', name: 'Blanc Pur Brillant',       dims: '80×80 cm', price: '36 €/m²',
        img: U+'photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        tint: '#f0eee8' },
      { ref: 'LM-GRIS-6060', name: 'Gris Anthracite Mat',      dims: '60×60 cm', price: '40 €/m²',
        img: U+'photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80',
        tint: '#4a4d50' },
    ],
    murs: [
      { ref: 'LM-MAR2-3060', name: 'Marbre Veiné Blanc',      dims: '30×60 cm', price: '55 €/m²',
        img: U+'photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=400&q=80',
        tint: '#ece8df' },
      { ref: 'LM-MOSA-2525', name: 'Mosaïque Turquoise',      dims: '2,5×2,5 cm', price: '68 €/m²',
        img: U+'photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80',
        tint: '#1ba8a7' },
      { ref: 'LM-FAYE-3060', name: 'Faïence Blanc Mat Lisse', dims: '30×60 cm', price: '28 €/m²',
        img: U+'photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=400&q=80',
        tint: '#f5f4f0' },
      { ref: 'LM-GRDF-12060', name: 'Grand Format Beige Sable', dims: '60×120 cm', price: '72 €/m²',
        img: U+'photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80',
        tint: '#d8cfb8' },
      { ref: 'LM-MMOS-1530', name: 'Mosaïque Marbre & Or',    dims: '15×30 cm', price: '85 €/m²',
        img: U+'photo-1613685044094-2cd5b6b1e2a2?auto=format&fit=crop&w=400&q=80',
        tint: '#c9a84c' },
      { ref: 'LM-BETM-3060', name: 'Béton Ciré Anthracite',   dims: '30×60 cm', price: '38 €/m²',
        img: U+'photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=400&q=80',
        tint: '#3d4144' },
      { ref: 'LM-VERT-2525', name: 'Mosaïque Vert Sapin',     dims: '2,5×2,5 cm', price: '64 €/m²',
        img: U+'photo-1564540583246-934409427776?auto=format&fit=crop&w=400&q=80',
        tint: '#2e5a4e' },
      { ref: 'LM-CHEV-1075', name: 'Chevron Marbre Clair',    dims: '10×75 cm', price: '78 €/m²',
        img: U+'photo-1576675466969-38eeae4b41f6?auto=format&fit=crop&w=400&q=80',
        tint: '#e0dccf' },
    ],
    colonne: [
      { ref: 'GR-RAINSH-450', name: 'Grohe Rainshower SmartActive',
        dims: 'Thermostatique chrome', price: '850 €',
        img: U+'photo-1620626011989-d0c3e51e1cc3?auto=format&fit=crop&w=400&q=80',
        tint: '#c8ccd0' },
      { ref: 'HG-PULSI-300',  name: 'Hansgrohe Pulsify Encastrée',
        dims: 'Mitigeur encastré',    price: '720 €',
        img: U+'photo-1573612664822-d7d347da7b80?auto=format&fit=crop&w=400&q=80',
        tint: '#d4d8dc' },
      { ref: 'GR-THERM-500',  name: 'Grohe SmartControl Digital',
        dims: 'Thermostatique digital', price: '1 250 €',
        img: U+'photo-1593620659530-d3c47e1bf5d3?auto=format&fit=crop&w=400&q=80',
        tint: '#b8bcc0' },
      { ref: 'HG-CROMA-280',  name: 'Hansgrohe Croma Select',
        dims: 'Mitigeur classique',   price: '480 €',
        img: U+'photo-1610501977078-9c3ff6dc1ac9?auto=format&fit=crop&w=400&q=80',
        tint: '#cdd1d5' },
      { ref: 'GR-ESSEN-OR',   name: 'Grohe Essence Or Brossé',
        dims: 'Thermo or PVD',        price: '1 480 €',
        img: U+'photo-1604152135912-04a022e23696?auto=format&fit=crop&w=400&q=80',
        tint: '#c9a84c' },
      { ref: 'HG-AXOR-NOIR',  name: 'Axor Showers Noir Mat',
        dims: 'Encastrée noir mat',   price: '1 380 €',
        img: U+'photo-1603798125914-7b5d28e64c61?auto=format&fit=crop&w=400&q=80',
        tint: '#1a1a1c' },
    ],
    paroi: [
      { ref: 'PA-FIXE-6mm',  name: 'Paroi Fixe Verre 6 mm',
        dims: '90×200 cm',            price: '380 €',
        img: U+'photo-1576675466969-38eeae4b41f6?auto=format&fit=crop&w=400&q=80',
        tint: '#dde5e8' },
      { ref: 'PA-FIXE-8mm',  name: 'Paroi Fixe 8 mm Sécurit',
        dims: '120×200 cm',           price: '590 €',
        img: U+'photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
        tint: '#d5dde0' },
      { ref: 'PA-PIVOT-8mm', name: 'Paroi Pivotante 8 mm',
        dims: '90×200 cm',            price: '720 €',
        img: U+'photo-1564540583246-934409427776?auto=format&fit=crop&w=400&q=80',
        tint: '#d8e0e3' },
      { ref: 'PA-WALK-8mm',  name: 'Walk-in 8 mm Sécurit',
        dims: '140×200 cm',           price: '890 €',
        img: U+'photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=400&q=80',
        tint: '#dce4e7' },
      { ref: 'PA-NOIR-8mm',  name: 'Walk-in Profilé Noir Mat',
        dims: '120×200 cm',           price: '980 €',
        img: U+'photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
        tint: '#2a2a2a' },
      { ref: 'PA-OR-8mm',    name: 'Pivotante Profilé Or Brossé',
        dims: '90×200 cm',            price: '1 120 €',
        img: U+'photo-1620626011761-996317b8d101?auto=format&fit=crop&w=400&q=80',
        tint: '#c9a84c' },
    ],
  };

  /* ============================================================
     ÉTAT
     ============================================================ */
  const selection = { sol: null, murs: null, colonne: null, paroi: null };
  const ZONE_LABELS = { sol: 'Sol', murs: 'Murs', colonne: 'Colonne', paroi: 'Paroi' };
  let currentTab = 'sol';

  /* ============================================================
     RÉFÉRENCES DOM
     ============================================================ */
  const productsEl = document.getElementById('cmpProducts');
  const tabsEl = document.querySelectorAll('.cmp-tab');
  const zones = {
    sol:     document.getElementById('zoneFloor'),
    murs:    document.getElementById('zoneWalls'),
    colonne: document.getElementById('zoneColumn'),
    paroi:   document.getElementById('zoneGlass'),
  };
  const sceneEl   = document.getElementById('cmpScene');
  const infoVal   = document.getElementById('scInfoVal');
  const legendBtn = document.getElementById('scLegendToggle');

  /* ============================================================
     CATALOGUE — Rendu
     ============================================================ */
  function renderProducts() {
    const items = CATALOG[currentTab];
    productsEl.innerHTML = items.map(p => {
      const isSelected = selection[currentTab] && selection[currentTab].ref === p.ref;
      return `
        <article class="cmp-product${isSelected ? ' selected' : ''}" data-ref="${p.ref}" data-zone="${currentTab}">
          <div class="cmp-prod-img">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
          </div>
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
     ONGLETS
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
     APPLICATION VISUELLE — overlay teinté + photo du produit
     ============================================================ */
  function applySelection(zone, product) {
    selection[zone] = product;
    const el = zones[zone];

    // Pour Sol et Murs : on applique la photo du produit + teinte multiply
    if (zone === 'sol' || zone === 'murs') {
      el.style.backgroundImage = `url('${product.img}')`;
      el.style.backgroundColor = product.tint;
      el.classList.add('filled');
    }
    // Pour Colonne et Paroi : on applique la photo du produit en cover normal
    else if (zone === 'colonne') {
      el.style.backgroundImage =
        `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.4)), url('${product.img}')`;
      el.classList.add('filled');
    }
    else if (zone === 'paroi') {
      el.style.backgroundImage =
        `linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.1) 50%, rgba(180,210,220,0.25)), url('${product.img}')`;
      el.classList.add('filled');
    }

    // Effet flash
    flashScene();
    infoVal.textContent = `${ZONE_LABELS[zone]} : ${product.name} (Réf. ${product.ref})`;

    updateChips();
    updateRecap();
    updateHidden();
    renderProducts();
    showToast(`${ZONE_LABELS[zone]} appliqué : ${product.name}`);
  }

  function flashScene() {
    sceneEl.style.transition = 'box-shadow .4s var(--ease)';
    sceneEl.style.boxShadow = '0 0 0 3px var(--turquoise), var(--sh-strong), 0 0 80px rgba(14,124,123,0.4)';
    setTimeout(() => {
      sceneEl.style.boxShadow = '';
    }, 700);
  }

  /* ============================================================
     LEGEND TOGGLE — afficher les 4 zones cliquables
     ============================================================ */
  if (legendBtn) {
    legendBtn.addEventListener('click', () => {
      sceneEl.classList.toggle('show-legend');
    });
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
        imgEl.innerHTML = `<img src="${sel.img}" alt="${sel.name}" loading="lazy">`;
        refEl.innerHTML = `<strong>${sel.name}</strong><br><span style="font-size:10px;color:var(--texte-clair);">Réf. ${sel.ref}</span>`;
      } else {
        chip.classList.remove('filled');
        imgEl.innerHTML = '<span class="chip-empty">+</span>';
        refEl.textContent = '— Non sélectionné —';
      }
    });

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
    const el = zones[zone];
    if (el) {
      el.style.backgroundImage = '';
      el.style.backgroundColor = '';
      el.classList.remove('filled');
    }
    if (!Object.values(selection).some(Boolean)) {
      infoVal.textContent = 'Cliquez sur un produit du catalogue';
    } else {
      infoVal.textContent = `${ZONE_LABELS[zone]} retiré`;
    }
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
      setVal('composer_' + zone, s
        ? `${s.name} - Réf. ${s.ref} - ${s.dims} - ${s.price}`
        : '');
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
      infoVal.textContent = 'Cliquez sur un produit du catalogue';
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
    showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  /* ============================================================
     SUBMIT du formulaire composer
     ============================================================ */
  const cmpForm = document.getElementById('cmpForm');
  if (cmpForm) {
    cmpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateHidden();

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
