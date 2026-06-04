# Luxeo Composer API

Backend Node.js + Express qui :

1. **Transforme une photo de salle de bain en rendu de douche italienne** via fal.ai (édition d'image par instruction, FLUX.1 Kontext Pro par défaut).
2. **Envoie l'email de devis** à info@luxeo.pro avec la photo originale + le rendu généré en pièces jointes (Nodemailer SMTP).
3. **Envoie un email de confirmation au client** automatiquement.

---

## Endpoints

### `POST /api/generate-image`

Génère le rendu IA. Multipart/form-data.

**Champs :**
- `image` (file) — photo de la salle de bain (JPG/PNG/WEBP/HEIC, max 10 Mo)
- `pack` — `suite-marbre` / `spa-zen` / `provence` / `libre`
- `sol`, `murs`, `colonne`, `paroi` — descriptions anglaises envoyées au modèle

**Réponse :**
```json
{ "success": true, "image_url": "https://...", "prompt_used": "...", "model": "fal-ai/flux-pro/kontext" }
```

### `POST /api/send-quote`

Envoie l'email de devis à Luxeo + confirmation au client. Multipart/form-data.

**Champs requis :** `prenom`, `nom`, `telephone`, `email`, `ville`

**Champs optionnels :**
- `pack_souhaite`, `message`, `parrainage`
- `photo_originale` (file) — la photo uploadée par le client
- `composer_pack_predefini`, `composer_sol_ref`/`nom`, `composer_murs_ref`/`nom`, `composer_colonne_ref`/`nom`, `composer_paroi_ref`/`nom`
- `composer_image_generee_url` — URL du rendu IA (fetchée et attachée côté serveur)
- `composer_prompt_utilise`, `composer_nb_essais_utilises`

**Réponse :**
```json
{ "success": true, "message": "Devis envoyé !" }
```

### `GET /health`

Status. Inclut une vérification SMTP (`smtp.ok`).

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner :

| Variable | Obligatoire | Description |
|---|---|---|
| `FAL_KEY` | ✅ | Clé fal.ai ([dashboard](https://fal.ai/dashboard/keys)) |
| `SMTP_HOST` | ✅ | `smtp.hostinger.com`, `smtp.gmail.com`, `ssl0.ovh.net`, etc. |
| `SMTP_PORT` | ✅ | `587` (STARTTLS) ou `465` (SSL) |
| `SMTP_USER` | ✅ | `info@luxeo.pro` |
| `SMTP_PASS` | ✅ | Mot de passe ou App Password |
| `SMTP_FROM` | ⚠ | `"Luxeo Composer" <info@luxeo.pro>` |
| `QUOTE_TO` | ⚠ | Destinataire du devis (défaut `info@luxeo.pro`) |
| `FAL_MODEL` | ⬜ | Défaut `fal-ai/flux-pro/kontext` |
| `ALLOWED_ORIGINS` | ⬜ | CORS, défaut `https://luxeo.pro` |
| `RATE_LIMIT_GENERATE` | ⬜ | 5 / 30 min / IP |
| `RATE_LIMIT_QUOTE` | ⬜ | 4 / 60 min / IP |

---

## Test local

```bash
cd server
cp .env.example .env
# édite .env (FAL_KEY + SMTP_*)
npm install
npm start
```

```bash
curl http://localhost:3000/health
```

Doit renvoyer `smtp.ok: true` si la config SMTP est bonne.

---

## Déploiement Coolify

1. **New Application** → **Public Repository** (ou Private)
2. Repo Luxeo, **Base Directory** = `/server`
3. **Build Pack** = `Dockerfile`
4. **Environment Variables** : remplir le tableau ci-dessus
5. **Port** : 3000
6. **Routage** :
   - **A (recommandé)** : reverse-proxy sur l'app statique → `luxeo.pro/api/* → composer-api:3000`
   - **B** : sous-domaine `api.luxeo.pro` + sur la page Composer ajouter avant le script :
     ```html
     <script>window.LUXEO_API_BASE='https://api.luxeo.pro';</script>
     ```
7. **Deploy** → test sur `/health`

---

## Coûts indicatifs

- **fal.ai FLUX.1 Kontext Pro** : ~$0.05 / image
- **Rate limit 5/30min/IP** → max ~$0.25 / visiteur
- Pour 100 visiteurs/mois : ~$25
- SMTP : gratuit avec Hostinger/Gmail/OVH

---

## Sécurité

- Container Docker user non-root (`luxeo`)
- CORS strict via `ALLOWED_ORIGINS`
- Rate limit IP sur chaque endpoint
- Healthcheck Dockerfile (`/health` toutes les 30 s)
- Toutes les clés API en env vars (jamais en code)
- Validation MIME + taille des uploads
