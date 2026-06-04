/* ============================================
   FAL.AI WRAPPER — édition d'image par instruction
   Modèle par défaut : fal-ai/flux-pro/kontext
   Alternative : fal-ai/nano-banana/edit
   ============================================ */
import { fal } from '@fal-ai/client';

let configured = false;

function ensureConfigured() {
  if (configured) return;
  if (!process.env.FAL_KEY) {
    throw new Error('FAL_KEY non configurée');
  }
  fal.config({ credentials: process.env.FAL_KEY });
  configured = true;
}

/**
 * Génère une image éditée à partir d'une photo + instruction.
 * @param {Object} args
 * @param {Buffer} args.imageBuffer - photo originale (buffer)
 * @param {string} args.mimeType - mime type (image/jpeg, image/png, ...)
 * @param {string} args.prompt - instruction d'édition
 * @returns {Promise<{image_url: string, model: string, raw: any}>}
 */
export async function generateImage({ imageBuffer, mimeType, prompt }) {
  ensureConfigured();

  const model = process.env.FAL_MODEL || 'fal-ai/flux-pro/kontext';

  // Convertit le buffer en data URL pour fal (évite l'étape de storage upload)
  const dataUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

  // Input commun (la plupart des modèles d'édition de fal acceptent image_url + prompt)
  const input = {
    image_url: dataUrl,
    prompt: prompt,
    // Aperçu basse résolution pour limiter les coûts (Phase 1)
    image_size: process.env.FAL_IMAGE_SIZE || 'landscape_4_3',
    num_inference_steps: parseInt(process.env.FAL_STEPS || '28', 10),
    guidance_scale: parseFloat(process.env.FAL_GUIDANCE || '3.5'),
    output_format: 'jpeg',
    safety_tolerance: '2',
  };

  let result;
  try {
    result = await fal.subscribe(model, {
      input,
      logs: false,
    });
  } catch (err) {
    // Erreur explicite remontée au frontend
    const msg = err && err.message ? err.message : String(err);
    throw new Error(`fal.ai (${model}) a refusé la requête : ${msg}`);
  }

  // Extraction de l'URL de l'image renvoyée (format peut varier selon le modèle)
  const data = result.data || result;
  let imageUrl = null;

  if (Array.isArray(data.images) && data.images[0] && data.images[0].url) {
    imageUrl = data.images[0].url;
  } else if (data.image && data.image.url) {
    imageUrl = data.image.url;
  } else if (typeof data.image === 'string') {
    imageUrl = data.image;
  } else if (data.url) {
    imageUrl = data.url;
  }

  if (!imageUrl) {
    console.error('[fal] Réponse inattendue :', JSON.stringify(data).slice(0, 500));
    throw new Error('fal.ai n\'a pas renvoyé d\'image exploitable.');
  }

  return {
    image_url: imageUrl,
    model,
    raw: data,
  };
}
