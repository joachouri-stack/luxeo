# LUXEO — Site web premium

Site web ultra-premium pour Luxeo, spécialiste de l'installation de douches italiennes clé en main dans le Sud de la France.

## 📂 Structure

```
luxeo/
├── index.html              # Page d'accueil
├── composer.html           # Configurateur interactif (visualiseur + catalogue)
├── mentions-legales.html
├── cgv.html
├── confidentialite.html
├── styles.css              # CSS principal (charte + composants)
├── composer.css            # CSS dédié au visualiseur 3D
├── main.js                 # JS global (nav, reveal, sliders, simu)
├── composer.js             # JS du configurateur (catalogue, application live)
├── robots.txt
└── sitemap.xml
```

## 🎨 Charte

- **Turquoise** `#0e7c7b` (principale)
- **Or** `#c9a84c` (secondaire)
- **Police** : Sora (Google Fonts)
- Mobile-first, WCAG AA, sans framework — vanilla HTML / CSS / JS

## ✨ Fonctionnalités

### Page d'accueil
- Hero plein écran avec parallaxe + image Unsplash
- Bandeau urgence créneaux
- 3 packs interactifs (Starter / Confort / Luxe)
- Section composer (CTA vers le configurateur)
- Simulateur de prix interactif (–50%)
- Grille de créneaux disponibles
- Galerie avant/après (slider draggable)
- Programme parrainage
- 4 témoignages + compteur animé
- Cartes zones d'intervention
- FAQ accordéon
- Formulaire devis complet
- WhatsApp flottant

### Page Composer (`composer.html`)
- **Visualiseur 3D photoréaliste** d'une douche italienne en perspective avec 4 zones :
  - Sol
  - Murs (arrière + latéral en perspective)
  - Colonne de douche (animée avec eau)
  - Paroi vitrée
- **Catalogue 4 onglets** : Sol · Murs · Colonne · Paroi (32 produits référencés LM-XXX)
- **Application instantanée** au clic — chaque produit modifie la zone correspondante
- **Vos carrelages sélectionnés** : 4 vignettes avec photo + référence + croix pour retirer
- **Bouton "Tout effacer"**
- **Formulaire de devis** avec champs cachés (`composer_sol`, `composer_murs`, `composer_colonne`, `composer_paroi`) transmettant automatiquement les références sélectionnées

## 📱 Responsive

- **Mobile 320–768** : burger nav, packs en colonne, CTA full-width
- **Tablette 768–1024** : packs 2 colonnes, formulaire 2 colonnes
- **Desktop 1024+** : layout complet 3 colonnes
- Toutes les images optimisées avec `object-fit: cover`
- Safe-area insets pour iPhone X+

## 🚀 Ouvrir le site

Tout statique. Aucune build step.

```bash
# Avec Python
python3 -m http.server 8000
# Puis http://localhost:8000

# Avec npx
npx serve
```

## 📝 À compléter avant production

- Téléphone Luxeo (chercher `tel:` dans le HTML)
- SIRET (footer + mentions légales)
- Hébergeur (mentions légales)
- Photos clients (remplacer les Unsplash par les vraies réalisations)
- Lien WhatsApp (`https://wa.me/` + numéro)
- Backend du formulaire pour réception sur info@luxeo.pro
