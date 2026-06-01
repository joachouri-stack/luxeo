/* ============================================
   LUXEO CART — Panier localStorage + UI bridge
   Utilisable sur boutique.html, produit.html, panier.html
   ============================================ */
(function (global) {
  const KEY = 'luxeoCart';

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }
  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
    updatePill();
    global.dispatchEvent(new CustomEvent('luxeo:cart', { detail: items }));
  }
  function add(ref, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const items = read();
    const existing = items.find(i => i.ref === ref);
    if (existing) existing.qty += qty;
    else items.push({ ref, qty });
    write(items);
    return items;
  }
  function setQty(ref, qty) {
    qty = Math.max(0, parseInt(qty, 10) || 0);
    let items = read();
    if (qty === 0) items = items.filter(i => i.ref !== ref);
    else {
      const existing = items.find(i => i.ref === ref);
      if (existing) existing.qty = qty;
      else items.push({ ref, qty });
    }
    write(items);
    return items;
  }
  function remove(ref) {
    const items = read().filter(i => i.ref !== ref);
    write(items);
    return items;
  }
  function clear() { write([]); }
  function count() { return read().reduce((s, i) => s + i.qty, 0); }
  function items() { return read(); }

  function updatePill() {
    const pill = document.getElementById('bqCartPill');
    const countEl = document.getElementById('bqCartCount');
    if (!pill || !countEl) return;
    const c = count();
    countEl.textContent = c;
    if (c > 0) {
      pill.hidden = false;
      requestAnimationFrame(() => pill.classList.add('bq-cart-pill-show'));
    } else {
      pill.classList.remove('bq-cart-pill-show');
      setTimeout(() => { pill.hidden = true; }, 280);
    }
  }

  // Init when DOM ready
  function init() {
    updatePill();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.LuxeoCart = { add, setQty, remove, clear, count, items, updatePill };
})(window);
