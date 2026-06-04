/* ============================================
   ROUTE /api/send-quote
   Reçoit le formulaire + photo originale, fetch
   l'image générée depuis fal.ai, et envoie un email
   avec les 2 images en pièces jointes.
   ============================================ */
import express from 'express';
import multer from 'multer';
import { sendQuoteEmail, sendClientConfirmation } from '../services/mailer.js';
import { buildLuxeoEmailHTML, buildClientConfirmationHTML } from '../services/emailTemplates.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const okMime = /^image\/(jpe?g|png|webp|heic|heif)$/i.test(file.mimetype);
    const okExt = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.originalname || '');
    if (!okMime && !okExt) return cb(new Error('Format de photo non supporté.'));
    cb(null, true);
  },
});

router.post('/', (req, res, next) => {
  // image originale = champ "photo_originale" (multipart); peut être absente
  upload.single('photo_originale')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'Photo trop lourde (max 10 Mo).' });
      }
      return res.status(400).json({ error: err.message || 'Upload refusé.' });
    }
    handleQuote(req, res).catch(next);
  });
});

async function handleQuote(req, res) {
  try {
    const b = req.body || {};

    // Validation des champs requis
    const required = ['prenom', 'nom', 'telephone', 'email', 'ville'];
    const missing = required.filter(k => !b[k] || !String(b[k]).trim());
    if (missing.length) {
      return res.status(400).json({ error: 'Champs manquants : ' + missing.join(', ') });
    }
    if (!isValidEmail(b.email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }

    // Pièces jointes
    const attachments = [];

    if (req.file) {
      attachments.push({
        filename: 'photo-originale' + extFromMime(req.file.mimetype),
        content: req.file.buffer,
        contentType: req.file.mimetype,
      });
    }

    // Fetch de l'image générée (URL fal.ai) côté serveur
    const generatedUrl = sanitize(b.composer_image_generee_url);
    if (generatedUrl) {
      try {
        const resp = await fetch(generatedUrl);
        if (resp.ok) {
          const buf = Buffer.from(await resp.arrayBuffer());
          const ct = resp.headers.get('content-type') || 'image/jpeg';
          attachments.push({
            filename: 'rendu-luxeo' + extFromContentType(ct),
            content: buf,
            contentType: ct,
          });
        } else {
          console.warn(`[quote] Fetch rendu IA HTTP ${resp.status}`);
        }
      } catch (e) {
        console.warn('[quote] Fetch rendu IA échoué:', e.message);
      }
    }

    // Destinataires
    const to = process.env.QUOTE_TO || 'info@luxeo.pro';
    const subject = process.env.QUOTE_SUBJECT || 'Nouvelle composition Composer — devis Luxeo';

    // Construction de l'email Luxeo
    const html = buildLuxeoEmailHTML({
      prenom: b.prenom,
      nom: b.nom,
      email: b.email,
      telephone: b.telephone,
      ville: b.ville,
      pack_souhaite: b.pack_souhaite,
      message: b.message,
      parrainage: b.parrainage,
      composer_pack_predefini: b.composer_pack_predefini,
      composer_sol_ref: b.composer_sol_ref,
      composer_sol_nom: b.composer_sol_nom,
      composer_murs_ref: b.composer_murs_ref,
      composer_murs_nom: b.composer_murs_nom,
      composer_colonne_ref: b.composer_colonne_ref,
      composer_colonne_nom: b.composer_colonne_nom,
      composer_paroi_ref: b.composer_paroi_ref,
      composer_paroi_nom: b.composer_paroi_nom,
      composer_nb_essais_utilises: b.composer_nb_essais_utilises,
      composer_image_generee_url: generatedUrl,
      composer_prompt_utilise: b.composer_prompt_utilise,
    });

    // Envoi de l'email principal
    await sendQuoteEmail({
      to,
      replyTo: `${b.prenom} ${b.nom} <${b.email}>`,
      subject,
      html,
      attachments,
    });

    // Email de confirmation au client (best-effort, ne bloque pas la réponse)
    sendClientConfirmation({
      to: b.email,
      prenom: b.prenom,
      html: buildClientConfirmationHTML({ prenom: b.prenom }),
    }).catch(e => console.warn('[quote] confirmation client échouée:', e.message));

    res.json({ success: true, message: 'Devis envoyé !' });
  } catch (err) {
    console.error('[send-quote] error:', err);
    res.status(500).json({ error: err.message || 'Erreur lors de l\'envoi.' });
  }
}

function sanitize(v) { return v ? String(v).trim() : ''; }
function isValidEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s)); }
function extFromMime(m) {
  if (!m) return '.jpg';
  if (/png/i.test(m)) return '.png';
  if (/webp/i.test(m)) return '.webp';
  if (/heic|heif/i.test(m)) return '.heic';
  return '.jpg';
}
function extFromContentType(ct) { return extFromMime(ct); }

export default router;
