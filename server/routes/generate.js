/* ============================================
   ROUTE /api/generate-image
   ============================================ */
import express from 'express';
import multer from 'multer';
import { generateImage } from '../services/fal.js';
import { buildPrompt } from '../services/prompt.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Mo
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const okMime = /^image\/(jpe?g|png|webp|heic|heif)$/i.test(file.mimetype);
    const okExt = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.originalname || '');
    if (!okMime && !okExt) {
      return cb(new Error('Format non supporté. Utilisez JPG, PNG, WEBP ou HEIC.'));
    }
    cb(null, true);
  },
});

router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'Image trop lourde (max 10 Mo). Réduisez-la avant d\'uploader.' });
      }
      return res.status(400).json({ error: err.message || 'Upload refusé.' });
    }
    handleGenerate(req, res, next);
  });
});

async function handleGenerate(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image reçue. Joignez votre photo (champ "image").' });
    }
    if (!process.env.FAL_KEY) {
      return res.status(503).json({
        error: 'Service IA indisponible — clé API non configurée côté serveur.',
        hint: 'Variable d\'environnement FAL_KEY manquante.',
      });
    }

    // Options envoyées par le frontend
    const options = {
      pack:    sanitize(req.body.pack),
      sol:     sanitize(req.body.sol),
      murs:    sanitize(req.body.murs),
      colonne: sanitize(req.body.colonne),
      paroi:   sanitize(req.body.paroi),
    };

    const prompt = buildPrompt(options);

    const result = await generateImage({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      prompt,
    });

    res.json({
      success: true,
      image_url: result.image_url,
      prompt_used: prompt,
      model: result.model,
    });
  } catch (err) {
    console.error('[generate-image] error:', err);
    const msg = err && err.message ? err.message : 'Échec de la génération.';
    res.status(502).json({ error: msg });
  }
}

function sanitize(v) {
  if (!v) return '';
  return String(v).trim().slice(0, 200);
}

export default router;
