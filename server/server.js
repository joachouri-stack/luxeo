/* ============================================
   LUXEO COMPOSER API — Express backend
   Endpoint /api/generate-image pour fal.ai
   ============================================ */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import generateRouter from './routes/generate.js';
import quoteRouter from './routes/quote.js';
import { verifyMailer } from './services/mailer.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Coolify / nginx → derrière un proxy : récupère la vraie IP du client
app.set('trust proxy', 1);

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://luxeo.pro,http://localhost:8080,http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origine non autorisée (${origin})`));
  },
  methods: ['GET', 'POST'],
  credentials: false,
}));

// Body parsers (multipart est géré par multer dans chaque route)
app.use(express.urlencoded({ extended: true, limit: '12mb' }));
app.use(express.json({ limit: '12mb' }));

// Healthcheck (pour Coolify et debugging)
app.get('/health', async (_req, res) => {
  const mailer = await verifyMailer().catch(e => ({ ok: false, error: e.message }));
  res.json({
    ok: true,
    service: 'luxeo-composer-api',
    version: '1.1.0',
    model: process.env.FAL_MODEL || 'fal-ai/flux-pro/kontext',
    falKeyConfigured: !!process.env.FAL_KEY,
    smtp: mailer,
    quoteTo: process.env.QUOTE_TO || 'info@luxeo.pro',
  });
});

// Rate limit pour la génération d'image (coût API)
const generateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: parseInt(process.env.RATE_LIMIT_GENERATE || process.env.RATE_LIMIT_MAX || '5', 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de générations en peu de temps. Réessayez dans 30 minutes ou demandez un devis pour un rendu sur-mesure.' },
});

// Rate limit pour le formulaire de devis (anti-spam)
const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: parseInt(process.env.RATE_LIMIT_QUOTE || '4', 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de demandes de devis en peu de temps. Réessayez plus tard ou appelez le 07 69 01 02 02.' },
});

app.use('/api/generate-image', generateLimiter, generateRouter);
app.use('/api/send-quote', quoteLimiter, quoteRouter);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint introuvable.', path: req.path });
});

// Error handler global
app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: err.message || 'Erreur serveur interne.' });
});

app.listen(PORT, () => {
  console.log(`[Luxeo Composer API] listening on :${PORT}`);
  console.log(`[CORS] allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`[fal.ai] model: ${process.env.FAL_MODEL || 'fal-ai/flux-pro/kontext'}`);
  if (!process.env.FAL_KEY) {
    console.warn('⚠ FAL_KEY non définie — les requêtes échoueront');
  }
});
