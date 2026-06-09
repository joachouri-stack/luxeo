/* ============================================
   LUXEO — Inject BreadcrumbList JSON-LD per page
   Permet d'afficher un fil d'Ariane dans la SERP
   au lieu de l'URL brute.
   ============================================ */
(function () {
  'use strict';
  const BASE = 'https://luxeo.pro';
  const path = location.pathname.replace(/\/$/, '') || '/';

  // Mapping path → breadcrumb (sans la home, qui est ajoutée auto)
  const map = {
    '/boutique':         [{ name: 'Boutique', url: BASE + '/boutique/' }],
    '/produit':          [{ name: 'Boutique', url: BASE + '/boutique/' }, { name: 'Produit', url: BASE + '/produit/' + location.search }],
    '/panier':           [{ name: 'Boutique', url: BASE + '/boutique/' }, { name: 'Panier', url: BASE + '/panier/' }],
    '/configurateur':    [{ name: 'Composer ma douche italienne', url: BASE + '/configurateur/' }],
    '/realisations':     [{ name: 'Réalisations', url: BASE + '/realisations/' }],
    '/mentions-legales': [{ name: 'Mentions légales', url: BASE + '/mentions-legales/' }],
    '/cgv':              [{ name: 'CGV', url: BASE + '/cgv/' }],
    '/confidentialite':  [{ name: 'Politique de confidentialité', url: BASE + '/confidentialite/' }],
  };

  const segs = map[path];
  if (!segs) return; // pas de breadcrumb pour la home

  const items = [{ name: 'Accueil', url: BASE + '/' }, ...segs];
  const list = items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: it.url,
  }));

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: list,
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
})();
