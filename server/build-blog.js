#!/usr/bin/env node
/* ============================================
   LUXEO BLOG — Script de build statique
   Convertit blog/posts/*.md en pages HTML.
   Génère :
   - /blog/index.html         (home blog)
   - /blog/articles/[slug]/   (article pages)
   - /blog/categorie/[slug]/  (category pages)
   - /blog/rss.xml            (flux RSS)
   Mise à jour /sitemap.xml (en append).
   ============================================ */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour exécution depuis /server/ : remonte d'un niveau pour atteindre le repo
const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const ARTICLES_DIR = path.join(ROOT, 'blog', 'articles');
const CATEGORIES_DIR = path.join(ROOT, 'blog', 'categorie');
const BLOG_INDEX = path.join(ROOT, 'blog', 'index.html');
const RSS_PATH = path.join(ROOT, 'blog', 'rss.xml');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');

const CATEGORIES = {
  'prix-financement':     { name: 'Prix & financement',      emoji: '💰', desc: 'Prix, devis, aides, financement de votre douche italienne — décryptés sans langue de bois.' },
  'technique-pratique':   { name: 'Technique & pratique',    emoji: '🔧', desc: 'Pose, étanchéité, normes, choix techniques — l\'expertise de nos artisans.' },
  'inspiration-design':   { name: 'Inspiration & design',    emoji: '✨', desc: 'Styles, matériaux, ambiances — pour vous aider à imaginer votre projet.' },
  'senior-accessibilite': { name: 'Senior & accessibilité',  emoji: '🦽', desc: 'Adapter sa salle de bain, MaPrimeAdapt\', sécurité — guide complet senior.' },
  'notre-region':         { name: 'Notre région',            emoji: '📍', desc: 'Vaucluse, Gard, Bouches-du-Rhône, Hérault — chantiers et actualités locales.' },
};

// CTA alternés
const CTA_VARIANTS = [
  {
    text: 'Vous voulez votre devis personnalisé ?',
    cta_label: 'Demander mon devis',
    cta_href: '/#contact',
  },
  {
    text: 'Composez votre douche italienne en direct.',
    cta_label: 'Lancer le composer',
    cta_href: '/configurateur/',
  },
  {
    text: 'À combien estimez-vous votre douche italienne ?',
    cta_label: 'Estimation gratuite',
    cta_href: '/#contact',
  },
];

// ============================================
// MINI MARKDOWN PARSER + frontmatter
// ============================================
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  m[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx < 0) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    }
    meta[key] = val;
  });
  return { meta, body: m[2] };
}

function escapeHTML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Typographie FR : insère des espaces insécables là où c'est utile
// pour éviter les orphelins sur titres (ex : "en 2026 :", "à 4 000 €").
function prettyTitleFR(s) {
  return escapeHTML(s)
    // espace avant ponctuation double (: ; ! ?) → NBSP
    .replace(/ ([:;!?])/g, ' $1')
    // préposition courte + année 4 chiffres → NBSP entre les deux
    .replace(/\b(en|de|du|depuis|vers|jusqu'en|d['’])\s(\d{4})\b/gi, '$1 $2')
    // montant + euros → NBSP
    .replace(/(\d)\s(€)/g, '$1 $2');
}

function slugify(s) {
  return String(s).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function mdToHTML(md, ctaIndex = { i: 0 }) {
  const blocks = md.split(/\n\n+/);
  let html = '';
  let wordCount = 0;

  blocks.forEach((block) => {
    block = block.trim();
    if (!block) return;
    wordCount += block.split(/\s+/).length;

    // Inject un CTA tous les ~1000 mots
    if (wordCount > 1000 && ctaIndex.injectedThisRun !== true) {
      const cta = CTA_VARIANTS[ctaIndex.i % CTA_VARIANTS.length];
      html += `<div class="article-cta">\n  <p class="article-cta-text">${escapeHTML(cta.text)}</p>\n  <a href="${cta.cta_href}">${escapeHTML(cta.cta_label)} <span class="arrow">→</span></a>\n</div>\n`;
      ctaIndex.i++;
      wordCount = 0;
    }

    // Headings
    if (block.startsWith('### ')) {
      const text = block.slice(4);
      html += `<h3 id="${slugify(text)}">${inline(text)}</h3>\n`;
      return;
    }
    if (block.startsWith('## ')) {
      const text = block.slice(3);
      html += `<h2 id="${slugify(text)}">${inline(text)}</h2>\n`;
      return;
    }
    if (block.startsWith('# ')) {
      // ignore h1 dans le corps (déjà dans le hero)
      return;
    }

    // Quote
    if (block.startsWith('> ')) {
      const text = block.split('\n').map(l => l.replace(/^> /, '')).join(' ');
      html += `<blockquote>${inline(text)}</blockquote>\n`;
      return;
    }

    // Liste à puces
    if (/^[-*] /.test(block)) {
      const items = block.split('\n').map(l => l.replace(/^[-*] /, ''));
      html += '<ul>\n' + items.map(li => `  <li>${inline(li)}</li>`).join('\n') + '\n</ul>\n';
      return;
    }

    // Liste ordonnée
    if (/^\d+\. /.test(block)) {
      const items = block.split('\n').map(l => l.replace(/^\d+\. /, ''));
      html += '<ol>\n' + items.map(li => `  <li>${inline(li)}</li>`).join('\n') + '\n</ol>\n';
      return;
    }

    // Paragraphe
    html += `<p>${inline(block)}</p>\n`;
  });

  return html;
}

function inline(s) {
  return s
    // bold + italic combinés ne sont pas gérés ici (rare en pratique)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function extractTOC(htmlBody) {
  const items = [];
  const re = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h[23]>/g;
  let m;
  while ((m = re.exec(htmlBody)) !== null) {
    items.push({
      level: parseInt(m[1], 10),
      id: m[2],
      text: m[3].replace(/<[^>]+>/g, ''),
    });
  }
  return items;
}

function authorInitials(name) {
  if (!name) return 'L';
  return name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ============================================
// PARTIALS HTML
// ============================================
const NAV_LINKS = `
<nav class="nav scrolled" id="nav">
  <a href="/" class="logo">LUXEO</a>
  <ul class="nav-links">
    <li><a href="/">Accueil</a></li>
    <li><a href="/configurateur/">Composer</a></li>
    <li><a href="/realisations/">Réalisations</a></li>
    <li><a href="/boutique/">Boutique</a></li>
    <li><a href="/blog/" style="color: var(--turquoise); font-weight: 500;">Blog</a></li>
    <li><a href="/#parrainage">Parrainage</a></li>
  </ul>
  <div class="nav-cta">
    <a href="tel:+33769010202" class="nav-phone">
      <span class="ico"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>
      <span>Devis téléphone</span>
    </a>
    <a href="/#contact" class="btn btn-gold">Devis gratuit <span class="arrow">→</span></a>
    <button class="burger" id="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer>
  <div class="foot-grid">
    <div class="foot-col foot-brand">
      <a href="/" class="logo">LUXEO</a>
      <p>Installation clé en main de douches italiennes premium dans le Sud de la France — Vaucluse, Gard, Bouches-du-Rhône, Hérault.</p>
      <p style="color:rgba(255,255,255,0.4); font-size:12px;">SIREN 105 755 458</p>
    </div>
    <div class="foot-col">
      <h5>Notre offre</h5>
      <ul>
        <li><a href="/#packs">Clé en Main</a></li>
        <li><a href="/configurateur/">Composer</a></li>
        <li><a href="/boutique/">Boutique carrelage</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>Le Magazine</h5>
      <ul>
        <li><a href="/blog/">Tous les articles</a></li>
        <li><a href="/blog/categorie/prix-financement/">Prix & financement</a></li>
        <li><a href="/blog/categorie/technique-pratique/">Technique & pratique</a></li>
        <li><a href="/blog/categorie/inspiration-design/">Inspiration & design</a></li>
        <li><a href="/blog/categorie/senior-accessibilite/">Senior & accessibilité</a></li>
        <li><a href="/blog/categorie/notre-region/">Notre région</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h5>Légal</h5>
      <ul>
        <li><a href="/mentions-legales/">Mentions légales</a></li>
        <li><a href="/cgv/">CGV</a></li>
        <li><a href="/confidentialite/">Politique de confidentialité</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <span>© 2026 Luxeo — Tous droits réservés · luxeo.pro</span>
    <span><a href="mailto:info@luxeo.pro" style="color:inherit;text-decoration:none;">info@luxeo.pro</a></span>
  </div>
</footer>`;

const HEAD_FAVICON = `<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

// ============================================
// TEMPLATES
// ============================================
function renderArticle(post) {
  const toc = extractTOC(post.contentHTML);
  const tocHTML = toc.length > 2 ? `
<aside class="article-toc">
  <div class="article-toc-head">Sommaire</div>
  <ul></ul>
</aside>` : '';

  const cat = CATEGORIES[post.category] || CATEGORIES['notre-region'];

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0a2a2a">
${HEAD_FAVICON}
<title>${escapeHTML(post.seo_title || post.title + ' | Luxeo')}</title>
<meta name="description" content="${escapeHTML(post.seo_description || post.excerpt)}">
<link rel="canonical" href="https://luxeo.pro/blog/articles/${post.slug}/">
<meta property="og:type" content="article">
<meta property="og:url" content="https://luxeo.pro/blog/articles/${post.slug}/">
<meta property="og:title" content="${escapeHTML(post.title)}">
<meta property="og:description" content="${escapeHTML(post.excerpt)}">
<meta property="og:image" content="https://luxeo.pro${post.image}">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Luxeo">
<meta property="article:published_time" content="${post.date}">
<meta property="article:author" content="${escapeHTML(post.author)}">
<meta property="article:section" content="${escapeHTML(cat.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(post.title)}">
<meta name="twitter:description" content="${escapeHTML(post.excerpt)}">
<meta name="twitter:image" content="https://luxeo.pro${post.image}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/blog.css">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": ${JSON.stringify(post.title)},
  "image": ${JSON.stringify('https://luxeo.pro' + post.image)},
  "datePublished": ${JSON.stringify(post.date)},
  "dateModified": ${JSON.stringify(post.date)},
  "author": { "@type": "Organization", "name": "Luxeo", "url": "https://luxeo.pro/" },
  "publisher": {
    "@type": "Organization",
    "name": "Luxeo",
    "logo": { "@type": "ImageObject", "url": "https://luxeo.pro/favicon.png" }
  },
  "description": ${JSON.stringify(post.excerpt)},
  "mainEntityOfPage": ${JSON.stringify('https://luxeo.pro/blog/articles/' + post.slug + '/')},
  "articleSection": ${JSON.stringify(cat.name)},
  "keywords": ${JSON.stringify(Array.isArray(post.tags) ? post.tags.join(', ') : '')}
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://luxeo.pro/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://luxeo.pro/blog/" },
    { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(cat.name)}, "item": ${JSON.stringify('https://luxeo.pro/blog/categorie/' + post.category + '/')} },
    { "@type": "ListItem", "position": 4, "name": ${JSON.stringify(post.title)}, "item": ${JSON.stringify('https://luxeo.pro/blog/articles/' + post.slug + '/')} }
  ]
}
</script>
</head>
<body>
${NAV_LINKS}

<header class="article-hero reveal" style="background-image: url('${post.image}');">
  <div class="article-hero-inner">
    <span class="cat-badge ${post.category}">${cat.emoji} ${escapeHTML(cat.name)}</span>
    <h1>${prettyTitleFR(post.title)}</h1>
    <div class="article-hero-meta">
      <span class="author">
        <span class="author-avatar">${authorInitials(post.author)}</span>
        <span>${escapeHTML(post.author)}</span>
      </span>
      <span class="sep">·</span>
      <span>📅 ${formatDateFR(post.date)}</span>
      <span class="sep">·</span>
      <span>⏱ ${post.read_time || 5} min de lecture</span>
    </div>
  </div>
</header>

<section class="article-layout">
  <div class="article-layout-inner">
    ${tocHTML}
    <article class="article-body reveal">
${post.contentHTML}
    </article>
  </div>
</section>

<section class="article-share-section">
  <div class="article-share">
    <span class="article-share-label">Partager</span>
    <a class="share-btn" data-share="linkedin" href="#" aria-label="Partager sur LinkedIn">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
    </a>
    <a class="share-btn" data-share="facebook" href="#" aria-label="Partager sur Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
    </a>
    <a class="share-btn" data-share="whatsapp" href="#" aria-label="Partager sur WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2.05-.4-.05-.5-.1-.2-.6-1.5-.8-2-.2-.5-.5-.4-.6-.4h-.6c-.2 0-.5.1-.7.4-.2.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.2.2 2 3.1 5 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.05-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
    </a>
    <a class="share-btn" data-share="email" href="#" aria-label="Partager par email">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></svg>
    </a>
    <button class="share-btn" data-share="copy" aria-label="Copier le lien">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
    </button>
  </div>

  <div class="author-bio">
    <div class="author-bio-avatar">${authorInitials(post.author)}</div>
    <div>
      <div class="author-bio-name">${escapeHTML(post.author)}</div>
      <p class="author-bio-text">L'équipe d'artisans Luxeo installe des douches à l'italienne clé en main dans le Sud de la France depuis 2024. SIREN 105 755 458, basés à Orange (84).</p>
    </div>
  </div>
</section>

<section class="related-articles">
  <div class="wrap">
    <h2>À lire aussi</h2>
    <div class="articles-grid" id="relatedGrid"></div>
  </div>
</section>

<section class="article-cta-final">
  <div class="article-cta-final-inner">
    <h2>Prêt à concrétiser votre projet ?</h2>
    <p>Devis gratuit sous 24 h. Visite technique à domicile, sans engagement.</p>
    <div class="article-cta-final-actions">
      <a href="/#contact" class="btn-gold">Demander mon devis <span class="arrow">→</span></a>
      <a href="/configurateur/" class="btn-outline-white">Composer ma douche</a>
    </div>
  </div>
</section>

${FOOTER_HTML}

<script>
  // Injection des articles liés (même catégorie)
  window.__LUXEO_RELATED__ = ${JSON.stringify(post.related)};
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('relatedGrid');
    if (!grid || !window.__LUXEO_RELATED__) return;
    grid.innerHTML = window.__LUXEO_RELATED__.map(r => \`
      <a class="article-card" href="\${r.url}">
        <div class="article-card-img"><img src="\${r.image}" alt="\${r.image_alt}" loading="lazy"><span class="cat-badge \${r.category}">\${r.cat_emoji} \${r.cat_name}</span></div>
        <div class="article-card-body">
          <h3>\${r.title}</h3>
          <p class="excerpt">\${r.excerpt}</p>
          <div class="article-card-meta">\${r.date_fr} · \${r.read_time} min</div>
        </div>
      </a>
    \`).join('');
  });
</script>
<script src="/main.js"></script>
<script src="/blog.js"></script>
</body>
</html>`;
}

function renderBlogHome(posts) {
  const featured = posts[0];
  const rest = posts.slice(1);
  const catCounts = {};
  posts.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0a2a2a">
${HEAD_FAVICON}
<title>Le Magazine Luxeo — Inspirations, conseils & expertise douche italienne</title>
<meta name="description" content="Tout ce qu'il faut savoir pour réussir votre projet de douche italienne : prix, technique, design, aides senior. Par les artisans Luxeo.">
<link rel="canonical" href="https://luxeo.pro/blog/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://luxeo.pro/blog/">
<meta property="og:title" content="Le Magazine Luxeo">
<meta property="og:description" content="Tout ce qu'il faut savoir pour réussir votre projet de douche italienne.">
<meta property="og:image" content="https://luxeo.pro/assets/hero-luxeo-v3.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/blog.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Le Magazine Luxeo",
  "url": "https://luxeo.pro/blog/",
  "publisher": { "@type": "Organization", "name": "Luxeo", "url": "https://luxeo.pro/" }
}
</script>
</head>
<body>
${NAV_LINKS}

<header class="blog-hero">
  <div class="blog-hero-overlay" aria-hidden="true"></div>
  <div class="blog-hero-inner">
    <span class="badge">Le Magazine Luxeo</span>
    <h1>Inspirations, conseils <em>& expertise.</em></h1>
    <p class="sub">Tout ce qu'il faut savoir pour réussir votre douche italienne, par les artisans Luxeo.</p>
    <form class="blog-search" onsubmit="event.preventDefault();">
      <input type="search" placeholder="Rechercher un article…" aria-label="Rechercher">
      <button type="submit" aria-label="Rechercher">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
    </form>
  </div>
</header>

${featured ? `
<section class="featured-article reveal">
  <div class="wrap">
    <div class="featured-grid">
      <a class="featured-img" href="/blog/articles/${featured.slug}/">
        <img src="${featured.image}" alt="${escapeHTML(featured.image_alt || featured.title)}">
      </a>
      <div class="featured-body">
        <span class="featured-eyebrow">Article à la une</span>
        <span class="cat-badge ${featured.category}" style="display:inline-block;margin-bottom:14px;">${(CATEGORIES[featured.category] || {}).emoji} ${escapeHTML((CATEGORIES[featured.category] || {}).name)}</span>
        <h2>${prettyTitleFR(featured.title)}</h2>
        <p class="excerpt">${escapeHTML(featured.excerpt)}</p>
        <div class="featured-meta">
          <span>${escapeHTML(featured.author)}</span>
          <span class="sep">·</span>
          <span>${formatDateFR(featured.date)}</span>
          <span class="sep">·</span>
          <span>${featured.read_time || 5} min de lecture</span>
        </div>
        <a class="featured-cta" href="/blog/articles/${featured.slug}/">Lire l'article <span class="arrow">→</span></a>
      </div>
    </div>
  </div>
</section>
` : ''}

<section class="cat-nav reveal">
  <div class="wrap">
    <div class="cat-nav-grid">
      ${Object.entries(CATEGORIES).map(([slug, cat]) => `
        <a class="cat-card" href="/blog/categorie/${slug}/">
          <span class="emoji">${cat.emoji}</span>
          <div class="cat-card-name">${escapeHTML(cat.name)}</div>
          <div class="cat-card-count">${catCounts[slug] || 0} article${(catCounts[slug] || 0) > 1 ? 's' : ''}</div>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<section class="articles-grid-section reveal">
  <div class="wrap">
    <div class="articles-grid-head">
      <h2>Tous les articles</h2>
    </div>
    <div class="articles-grid">
      ${rest.map(p => renderArticleCard(p)).join('')}
    </div>
  </div>
</section>

<section class="newsletter-section reveal">
  <div class="newsletter-card">
    <span class="icon">✉️</span>
    <h3>Recevez nos meilleurs conseils</h3>
    <p>1 email par mois. Conseils douche italienne, aides senior, inspirations. Aucun spam.</p>
    <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Merci ! La newsletter sera connectée bientôt.');">
      <input type="email" placeholder="votre.email@exemple.fr" required>
      <button type="submit">S'inscrire</button>
    </form>
  </div>
</section>

${FOOTER_HTML}

<script src="/main.js"></script>
<script src="/blog.js"></script>
</body>
</html>`;
}

function renderArticleCard(p) {
  const cat = CATEGORIES[p.category] || {};
  return `
    <a class="article-card" href="/blog/articles/${p.slug}/">
      <div class="article-card-img">
        <img src="${p.image}" alt="${escapeHTML(p.image_alt || p.title)}" loading="lazy">
        <span class="cat-badge ${p.category}">${cat.emoji} ${escapeHTML(cat.name)}</span>
      </div>
      <div class="article-card-body">
        <h3>${prettyTitleFR(p.title)}</h3>
        <p class="excerpt">${escapeHTML(p.excerpt)}</p>
        <div class="article-card-meta">${formatDateFR(p.date)} · ${p.read_time || 5} min de lecture</div>
      </div>
    </a>`;
}

function renderCategoryPage(slug, cat, posts) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0a2a2a">
${HEAD_FAVICON}
<title>${escapeHTML(cat.name)} — Le Magazine Luxeo</title>
<meta name="description" content="${escapeHTML(cat.desc)}">
<link rel="canonical" href="https://luxeo.pro/blog/categorie/${slug}/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://luxeo.pro/blog/categorie/${slug}/">
<meta property="og:title" content="${escapeHTML(cat.name)} — Magazine Luxeo">
<meta property="og:description" content="${escapeHTML(cat.desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/blog.css">
</head>
<body>
${NAV_LINKS}

<header class="category-hero">
  <span class="badge-emoji">${cat.emoji}</span>
  <h1>${escapeHTML(cat.name)}</h1>
  <p>${escapeHTML(cat.desc)}</p>
  <div class="count">${posts.length} article${posts.length > 1 ? 's' : ''}</div>
</header>

<section class="articles-grid-section">
  <div class="wrap">
    <div class="articles-grid">
      ${posts.map(p => renderArticleCard(p)).join('')}
    </div>
  </div>
</section>

${FOOTER_HTML}

<script src="/main.js"></script>
<script src="/blog.js"></script>
</body>
</html>`;
}

function formatDateFR(iso) {
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function renderRSS(posts) {
  const items = posts.map(p => `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>https://luxeo.pro/blog/articles/${p.slug}/</link>
    <guid>https://luxeo.pro/blog/articles/${p.slug}/</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description><![CDATA[${p.excerpt}]]></description>
    <category>${escapeHTML((CATEGORIES[p.category] || {}).name || '')}</category>
  </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Le Magazine Luxeo</title>
    <link>https://luxeo.pro/blog/</link>
    <description>Inspirations, conseils &amp; expertise douche italienne.</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;
}

// ============================================
// MAIN
// ============================================
function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('Pas de dossier blog/posts/');
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const ctaIndex = { i: 0 };
    const contentHTML = mdToHTML(body, ctaIndex);
    return {
      slug: meta.slug || file.replace(/\.md$/, ''),
      title: meta.title || 'Sans titre',
      category: meta.category || 'notre-region',
      author: meta.author || 'L\'équipe Luxeo',
      date: meta.date || new Date().toISOString().slice(0, 10),
      excerpt: meta.excerpt || '',
      image: meta.image || '/blog/images/default.jpg',
      image_alt: meta.image_alt || meta.title || '',
      read_time: parseInt(meta.read_time, 10) || estimateReadTime(body),
      seo_title: meta.seo_title || '',
      seo_description: meta.seo_description || meta.excerpt || '',
      tags: meta.tags || [],
      contentHTML,
    };
  });

  // Tri par date desc
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Pour chaque article : calcule les 3 liés (même catégorie en priorité)
  posts.forEach(p => {
    p.related = posts
      .filter(o => o.slug !== p.slug)
      .sort((a, b) => {
        const sameA = a.category === p.category ? 0 : 1;
        const sameB = b.category === p.category ? 0 : 1;
        return sameA - sameB;
      })
      .slice(0, 3)
      .map(r => ({
        url: `/blog/articles/${r.slug}/`,
        title: prettyTitleFR(r.title),
        excerpt: r.excerpt,
        image: r.image,
        image_alt: r.image_alt,
        category: r.category,
        cat_emoji: (CATEGORIES[r.category] || {}).emoji,
        cat_name: (CATEGORIES[r.category] || {}).name,
        date_fr: formatDateFR(r.date),
        read_time: r.read_time,
      }));
  });

  // Crée les dossiers
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  fs.mkdirSync(CATEGORIES_DIR, { recursive: true });

  // Articles individuels
  posts.forEach(p => {
    const dir = path.join(ARTICLES_DIR, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderArticle(p));
    console.log('✓ Article :', p.slug);
  });

  // Catégories
  Object.entries(CATEGORIES).forEach(([slug, cat]) => {
    const catPosts = posts.filter(p => p.category === slug);
    const dir = path.join(CATEGORIES_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderCategoryPage(slug, cat, catPosts));
    console.log('✓ Catégorie :', slug, `(${catPosts.length})`);
  });

  // Home blog
  fs.writeFileSync(BLOG_INDEX, renderBlogHome(posts));
  console.log('✓ Home blog');

  // RSS
  fs.writeFileSync(RSS_PATH, renderRSS(posts));
  console.log('✓ RSS feed');

  console.log(`\n✅ Build terminé : ${posts.length} articles`);
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

main();
