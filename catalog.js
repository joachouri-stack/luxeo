/* ============================================
   LUXEO — Catalogue des 32 carrelages
   ============================================ */

const LUXEO_CATALOG = [
  // BÉTON CIRÉ (5)
  { ref: 'LUX-BET-001', name: 'Béton Ciré Blanc', cat: 'beton', dims: '60×60 cm', finish: 'Mat', price: '34 €/m²' },
  { ref: 'LUX-BET-002', name: 'Béton Ciré Crème', cat: 'beton', dims: '80×80 cm', finish: 'Mat', price: '38 €/m²' },
  { ref: 'LUX-BET-003', name: 'Béton Ciré Sable', cat: 'beton', dims: '60×60 cm', finish: 'Mat', price: '34 €/m²' },
  { ref: 'LUX-BET-004', name: 'Béton Ciré Anthracite', cat: 'beton', dims: '60×60 cm', finish: 'Mat', price: '36 €/m²' },
  { ref: 'LUX-BET-005', name: 'Béton Ciré Gris Clair', cat: 'beton', dims: '80×80 cm', finish: 'Mat', price: '38 €/m²' },

  // EFFET BOIS (5)
  { ref: 'LUX-BOI-001', name: 'Effet Bois Chêne Clair', cat: 'bois', dims: '20×90 cm', finish: 'Lasuré', price: '42 €/m²' },
  { ref: 'LUX-BOI-002', name: 'Effet Bois Chêne Doré', cat: 'bois', dims: '20×120 cm', finish: 'Lasuré', price: '46 €/m²' },
  { ref: 'LUX-BOI-003', name: 'Effet Bois Noyer', cat: 'bois', dims: '20×90 cm', finish: 'Lasuré', price: '44 €/m²' },
  { ref: 'LUX-BOI-004', name: 'Effet Bois Naturel', cat: 'bois', dims: '20×120 cm', finish: 'Lasuré', price: '46 €/m²' },
  { ref: 'LUX-BOI-005', name: 'Effet Bois Foncé', cat: 'bois', dims: '20×90 cm', finish: 'Lasuré', price: '44 €/m²' },

  // MARBRE (5)
  { ref: 'LUX-MAR-001', name: 'Marbre Calacatta', cat: 'marbre', dims: '60×60 cm', finish: 'Brillant', price: '52 €/m²' },
  { ref: 'LUX-MAR-002', name: 'Marbre Statuario', cat: 'marbre', dims: '60×120 cm', finish: 'Brillant', price: '58 €/m²' },
  { ref: 'LUX-MAR-003', name: 'Marbre Beige', cat: 'marbre', dims: '60×60 cm', finish: 'Mat', price: '49 €/m²' },
  { ref: 'LUX-MAR-004', name: 'Marbre Travertin', cat: 'marbre', dims: '60×60 cm', finish: 'Mat', price: '49 €/m²' },
  { ref: 'LUX-MAR-005', name: 'Marbre Veiné Or', cat: 'marbre', dims: '60×120 cm', finish: 'Brillant', price: '62 €/m²' },

  // MARBRE GRAND FORMAT (5)
  { ref: 'LUX-MFO-001', name: 'Grand Format Calacatta', cat: 'grandformat', dims: '120×60 cm', finish: 'Brillant', price: '68 €/m²' },
  { ref: 'LUX-MFO-002', name: 'Grand Format Noir Mat', cat: 'grandformat', dims: '120×60 cm', finish: 'Mat', price: '64 €/m²' },
  { ref: 'LUX-MFO-003', name: 'Grand Format Marbre Veiné', cat: 'grandformat', dims: '120×60 cm', finish: 'Brillant', price: '68 €/m²' },
  { ref: 'LUX-MFO-004', name: 'Grand Format Beige', cat: 'grandformat', dims: '120×60 cm', finish: 'Mat', price: '64 €/m²' },
  { ref: 'LUX-MFO-005', name: 'Grand Format Gris', cat: 'grandformat', dims: '120×60 cm', finish: 'Mat', price: '64 €/m²' },

  // MOSAÏQUE (4)
  { ref: 'LUX-MOS-001', name: 'Mosaïque Turquoise', cat: 'mosaique', dims: '30×30 cm', finish: 'Brillant', price: '68 €/m²' },
  { ref: 'LUX-MOS-002', name: 'Mosaïque Bleu Profond', cat: 'mosaique', dims: '30×30 cm', finish: 'Brillant', price: '68 €/m²' },
  { ref: 'LUX-MOS-003', name: 'Mosaïque Marbre & Or', cat: 'mosaique', dims: '30×30 cm', finish: 'Brillant', price: '85 €/m²' },
  { ref: 'LUX-MOS-004', name: 'Mosaïque Verte Sapin', cat: 'mosaique', dims: '30×30 cm', finish: 'Brillant', price: '64 €/m²' },

  // PIERRE NATURELLE (5)
  { ref: 'LUX-PIE-001', name: 'Pierre Naturelle Beige', cat: 'pierre', dims: '60×60 cm', finish: 'Mat', price: '44 €/m²' },
  { ref: 'LUX-PIE-002', name: 'Pierre Naturelle Crème', cat: 'pierre', dims: '60×60 cm', finish: 'Mat', price: '44 €/m²' },
  { ref: 'LUX-PIE-003', name: 'Pierre Ardoise Brute', cat: 'pierre', dims: '60×60 cm', finish: 'Texturé', price: '48 €/m²' },
  { ref: 'LUX-PIE-004', name: 'Pierre Travertin Naturel', cat: 'pierre', dims: '60×60 cm', finish: 'Mat', price: '52 €/m²' },
  { ref: 'LUX-PIE-005', name: 'Pierre Bleu Ardoise', cat: 'pierre', dims: '60×60 cm', finish: 'Texturé', price: '48 €/m²' },

  // TERRAZZO (3)
  { ref: 'LUX-TER-001', name: 'Terrazzo Crème', cat: 'terrazzo', dims: '60×60 cm', finish: 'Mat', price: '54 €/m²' },
  { ref: 'LUX-TER-002', name: 'Terrazzo Beige', cat: 'terrazzo', dims: '60×60 cm', finish: 'Mat', price: '54 €/m²' },
  { ref: 'LUX-TER-003', name: 'Terrazzo Gris Clair', cat: 'terrazzo', dims: '60×60 cm', finish: 'Mat', price: '54 €/m²' },
];

const LUXEO_FILTERS = [
  { id: 'all',         label: 'Tous',          count: 32 },
  { id: 'beton',       label: 'Béton ciré',    count: 5 },
  { id: 'bois',        label: 'Effet bois',    count: 5 },
  { id: 'marbre',      label: 'Marbre',        count: 5 },
  { id: 'grandformat', label: 'Grand format',  count: 5 },
  { id: 'mosaique',    label: 'Mosaïque',      count: 4 },
  { id: 'pierre',      label: 'Pierre',        count: 5 },
  { id: 'terrazzo',    label: 'Terrazzo',      count: 3 },
];
