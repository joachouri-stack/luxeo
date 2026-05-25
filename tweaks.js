/* ============================================
   LUXEO — Tweaks panel logic
   3 expressive controls: mood, atmosphere, density
   ============================================ */

(function () {
  'use strict';

  // Read defaults from inline <script> in index.html (between EDITMODE markers)
  const defaults = (typeof window.LUXEO_TWEAK_DEFAULTS === 'object' && window.LUXEO_TWEAK_DEFAULTS)
    ? window.LUXEO_TWEAK_DEFAULTS
    : { mood: 'spa', atmo: 'naturel', dens: 'magazine' };

  let state = { ...defaults };

  // ===== Apply current state to body classes =====
  function apply() {
    const body = document.body;
    body.className = body.className
      .replace(/\bmood-\w+/g, '')
      .replace(/\batmo-\w+/g, '')
      .replace(/\bdens-\w+/g, '')
      .trim();
    body.classList.add('mood-' + state.mood);
    body.classList.add('atmo-' + state.atmo);
    body.classList.add('dens-' + state.dens);
  }

  // Apply immediately on load (BEFORE panel is built — design must respond)
  apply();

  // ===== Build panel markup =====
  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'luxeoTweaks';
    panel.innerHTML = `
      <div class="tweaks-head">
        <h4>Tweaks</h4>
        <button class="tweaks-close" aria-label="Fermer">×</button>
      </div>
      <div class="tweaks-body">
        <div class="tweak-group">
          <div class="lbl">
            Ambiance
            <span class="current" id="cur-mood"></span>
          </div>
          <div class="tweak-segments" data-key="mood">
            <button class="tweak-seg" data-value="spa" data-label="Spa lumineux">Spa</button>
            <button class="tweak-seg" data-value="elegant" data-label="Élégant bronze">Élégant</button>
            <button class="tweak-seg" data-value="nuit" data-label="Nuit indigo">Nuit</button>
          </div>
        </div>

        <div class="tweak-group">
          <div class="lbl">
            Atmosphère
            <span class="current" id="cur-atmo"></span>
          </div>
          <div class="tweak-segments" data-key="atmo">
            <button class="tweak-seg" data-value="calme" data-label="Statique, sans bruit">Calme</button>
            <button class="tweak-seg" data-value="naturel" data-label="Vivant, équilibré">Naturel</button>
            <button class="tweak-seg" data-value="spa" data-label="Eau, lumière, mouvement">Spa</button>
          </div>
        </div>

        <div class="tweak-group">
          <div class="lbl">
            Densité éditoriale
            <span class="current" id="cur-dens"></span>
          </div>
          <div class="tweak-segments" data-key="dens">
            <button class="tweak-seg" data-value="aere" data-label="Generous breathing">Aéré</button>
            <button class="tweak-seg" data-value="magazine" data-label="Editorial rhythm">Magazine</button>
            <button class="tweak-seg" data-value="dens" data-label="Dense, scannable">Compact</button>
          </div>
        </div>
      </div>
      <div class="tweak-foot">Tweaks Luxeo</div>
    `;
    document.body.appendChild(panel);

    // Wire up segments
    panel.querySelectorAll('.tweak-segments').forEach(group => {
      const key = group.dataset.key;
      group.querySelectorAll('.tweak-seg').forEach(btn => {
        btn.addEventListener('click', () => {
          // Map UI value 'dens' to actual class value 'compact' for density's third option
          let value = btn.dataset.value;
          if (key === 'dens' && value === 'dens') value = 'compact';
          state[key] = value;
          apply();
          syncUI();
          // Persist via host protocol
          try {
            window.parent.postMessage({
              type: '__edit_mode_set_keys',
              edits: { [key]: value }
            }, '*');
          } catch (e) { /* ignore */ }
        });
      });
    });

    // Close button
    panel.querySelector('.tweaks-close').addEventListener('click', () => {
      panel.classList.remove('show');
      try {
        window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
      } catch (e) { /* ignore */ }
    });

    return panel;
  }

  // Reflect state in the UI
  function syncUI() {
    const panel = document.getElementById('luxeoTweaks');
    if (!panel) return;
    panel.querySelectorAll('.tweak-segments').forEach(group => {
      const key = group.dataset.key;
      const currentValue = state[key];
      group.querySelectorAll('.tweak-seg').forEach(btn => {
        // For density, internal class is 'compact' but UI value is 'dens'
        let btnValue = btn.dataset.value;
        if (key === 'dens' && btnValue === 'dens') btnValue = 'compact';
        const isActive = btnValue === currentValue;
        btn.classList.toggle('active', isActive);
        if (isActive) {
          // Update label
          const curEl = panel.querySelector('#cur-' + key);
          if (curEl) curEl.textContent = btn.dataset.label;
        }
      });
    });
  }

  // ===== Host protocol — set listener BEFORE announcing availability =====
  window.addEventListener('message', (e) => {
    const data = e.data || {};
    if (data.type === '__activate_edit_mode') {
      let panel = document.getElementById('luxeoTweaks');
      if (!panel) panel = buildPanel();
      syncUI();
      panel.classList.add('show');
    } else if (data.type === '__deactivate_edit_mode') {
      const panel = document.getElementById('luxeoTweaks');
      if (panel) panel.classList.remove('show');
    }
  });

  // Announce we're ready for Tweaks
  try {
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  } catch (e) { /* ignore */ }
})();
