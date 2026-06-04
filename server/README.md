# Luxeo Composer API

Backend Node.js + Express qui transforme une photo de salle de bain en rendu de douche à l'italienne, via fal.ai.

## Endpoint

```
POST /api/generate-image
Content-Type: multipart/form-data

Champs attendus :
- image    (file)     : photo de la salle de bain (JPG/PNG/WEBP/HEIC, max 10 Mo)
- pack     (string)   : suite-marbre | spa-zen | provence | libre
- sol      (string)   : description du carrelage de sol choisi
- murs     (string)   : description des murs choisis
- colonne  (string)   : description de la robinetterie
- paroi    (string)   : description de la paroi

Réponse (200) :
{
  "success": true,
  "image_url": "https://...",
  "prompt_used": "Edit this photo...",
  "model": "fal-ai/flux-pro/kontext"
}

Réponse (erreur) :
{ "error": "message lisible" }
```

## Healthcheck

```
GET /health → { ok: true, model: "...", falKeyConfigured: true }
```

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner :
- `FAL_KEY` : clé fal.ai (https://fal.ai/dashboard/keys) — **obligatoire**
- `FAL_MODEL` : modèle (défaut `fal-ai/flux-pro/kontext`)
- `ALLOWED_ORIGINS` : domaines autorisés en CORS

## Déploiement local

```bash
cd server
cp .env.example .env
# éditer .env et renseigner FAL_KEY
npm install
npm start
```

L'API écoute sur `http://localhost:3000`.

Test :
```bash
curl http://localhost:3000/health
```

## Déploiement Coolify

1. Sur Coolify, **New Application** → **Public Repository** ou **Private** (selon ton repo Git)
2. Pointer sur le repo Luxeo, **Base Directory** = `/server`
3. **Build Pack** = `Dockerfile` (le Dockerfile inclus s'occupe de tout)
4. **Environment Variables** : ajouter `FAL_KEY`, optionnellement `FAL_MODEL`, `ALLOWED_ORIGINS`
5. **Port** : 3000 (déjà exposé dans Dockerfile)
6. Si tu veux que `luxeo.pro/api/*` route vers ce service :
   - Dans Coolify, **Domains** de l'app statique principale, ajouter une règle proxy `/api → http://composer-api:3000`
   - OU déployer l'API sur un sous-domaine `api.luxeo.pro` et adapter le frontend (variable JS)
7. Click **Deploy**

## Modèle d'IA

Par défaut : **FLUX.1 Kontext Pro** (`fal-ai/flux-pro/kontext`) — édition d'image par instruction, excellent pour la préservation de la pièce.

Alternatives (modifier `FAL_MODEL`) :
- `fal-ai/nano-banana/edit`
- `fal-ai/gemini-flash-edit`

Le prompt généré insiste sur la préservation EXACTE de la pièce et n'autorise la modification que de la zone baignoire / ancienne douche.

## Sécurité

- Rate limit : 5 requêtes par IP par 30 min (configurable via `RATE_LIMIT_MAX`)
- CORS strict : seuls les domaines de `ALLOWED_ORIGINS` peuvent appeler l'API
- Container Docker en utilisateur non-root
- Healthcheck intégré

## Coûts

FLUX.1 Kontext Pro sur fal.ai : ~$0.05 par image généré.
Avec rate limit à 5 essais/IP/30min, max ~$0.25/visiteur. Pour 100 visiteurs uniques/mois → ~$25.
