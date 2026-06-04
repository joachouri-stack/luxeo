/* ============================================
   PROMPT BUILDER — composé dynamiquement
   Insiste sur la préservation de la pièce existante
   ============================================ */

export function buildPrompt({ pack, sol, murs, colonne, paroi }) {
  // Base : préservation maximale de la pièce
  const base = [
    "Edit this photo of a real bathroom.",
    "Keep the room EXACTLY as it is — same walls, same windows, same doors, same window frames, same floor layout, same perspective, same proportions and same natural lighting.",
    "Do NOT move, add or invent any window or door.",
    "Replace ONLY the existing bathtub or old shower area with a modern walk-in Italian shower.",
  ].join(' ');

  // Style demandé
  const styleLine = pack
    ? ` Overall style: ${packToStyle(pack)}.`
    : '';

  // Détails matériaux (anglais pour le modèle)
  const details = [];
  if (sol)     details.push(`floor in ${sol}`);
  if (murs)    details.push(`walls in ${murs}`);
  if (colonne) details.push(`fixtures and shower column in ${colonne}`);
  if (paroi)   details.push(`glass walk-in panel: ${paroi}`);

  const detailsLine = details.length
    ? ` Materials & finishes: ${details.join('; ')}.`
    : '';

  // Specs de rendu
  const renderLine = ' Add an extra-flat shower tray, modern fixtures, photorealistic editorial render, magazine quality, sharp focus, high dynamic range, same camera angle and same exposure as the input photo. Subtle warm vapor in the shower zone for life. No people. No text or watermark.';

  return base + styleLine + detailsLine + renderLine;
}

function packToStyle(pack) {
  const map = {
    'suite-marbre': 'Suite Marbre — luxury 5-star hotel feel, white veined marble, brushed gold fixtures, clean lines',
    'spa-zen':       'Spa Zen — japanese onsen mood, dark slate, teak wood accents, matte black fixtures, soft warm lighting',
    'provence':      'Provence — Mediterranean mas, beige travertine, natural stone accents, brushed gold fixtures, warm sunlight',
    'libre':         'Custom premium walk-in shower',
  };
  return map[pack] || pack;
}
