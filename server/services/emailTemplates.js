/* ============================================
   EMAIL TEMPLATES (HTML)
   Style sobre, lisible sur tous les clients mail
   ============================================ */

const COLORS = {
  turquoise: '#0e7c7b',
  or: '#c9a84c',
  dark: '#0a2a2a',
  text: '#1a1a2e',
  muted: '#5b6770',
  border: '#e6ecec',
  bgSoft: '#f0fafa',
};

function esc(v) {
  if (v == null) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.muted};width:160px;vertical-align:top;font-weight:600;">${esc(label)}</td>
      <td style="padding:8px 0;font-size:14px;color:${COLORS.text};vertical-align:top;">${esc(value)}</td>
    </tr>`;
}

/**
 * Email à info@luxeo.pro
 */
export function buildLuxeoEmailHTML(data) {
  const {
    prenom, nom, email, telephone, ville, pack_souhaite, message, parrainage,
    composer_pack_predefini,
    composer_sol_ref, composer_sol_nom,
    composer_murs_ref, composer_murs_nom,
    composer_colonne_ref, composer_colonne_nom,
    composer_paroi_ref, composer_paroi_nom,
    composer_nb_essais_utilises,
    composer_image_generee_url,
    composer_prompt_utilise,
  } = data;

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouvelle demande Composer</title></head>
<body style="margin:0;padding:0;background:${COLORS.bgSoft};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bgSoft};padding:30px 16px;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border-radius:12px;box-shadow:0 8px 24px -10px rgba(10,42,42,0.15);overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${COLORS.dark} 0%,${COLORS.turquoise} 100%);padding:32px 36px;color:#fff;">
            <div style="font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:${COLORS.or};font-weight:600;margin-bottom:6px;">Composer Luxeo</div>
            <h1 style="margin:0;font-size:24px;font-weight:300;letter-spacing:-0.01em;color:#fff;">Nouvelle demande de devis</h1>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.78);">Avec photo originale + rendu IA en pièces jointes.</p>
          </td>
        </tr>

        <!-- Client -->
        <tr><td style="padding:28px 36px 8px;">
          <h2 style="margin:0 0 12px;font-size:14px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.turquoise};">Client</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row('Prénom · Nom', `${esc(prenom)} ${esc(nom)}`)}
            ${row('Téléphone', telephone ? `<a href="tel:${esc(telephone)}" style="color:${COLORS.text};text-decoration:none;">${esc(telephone)}</a>` : '')}
            ${row('Email', email ? `<a href="mailto:${esc(email)}" style="color:${COLORS.text};text-decoration:none;">${esc(email)}</a>` : '')}
            ${row('Ville', ville)}
            ${row('Type de projet', pack_souhaite)}
            ${parrainage ? row('Parrainage', parrainage) : ''}
            ${message ? row('Message', `<div style="white-space:pre-wrap;">${esc(message)}</div>`) : ''}
          </table>
        </td></tr>

        <!-- Composition -->
        <tr><td style="padding:8px 36px 4px;">
          <hr style="border:0;border-top:1px solid ${COLORS.border};margin:18px 0;">
          <h2 style="margin:0 0 12px;font-size:14px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.turquoise};">Composition Composer</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row('Pack', composer_pack_predefini)}
            ${(composer_sol_ref || composer_sol_nom) ? row('Sol', `<b>${esc(composer_sol_nom)}</b> <span style="color:${COLORS.muted};font-size:12px;font-feature-settings:'tnum';">${esc(composer_sol_ref)}</span>`) : ''}
            ${(composer_murs_ref || composer_murs_nom) ? row('Murs', `<b>${esc(composer_murs_nom)}</b> <span style="color:${COLORS.muted};font-size:12px;font-feature-settings:'tnum';">${esc(composer_murs_ref)}</span>`) : ''}
            ${(composer_colonne_ref || composer_colonne_nom) ? row('Colonne', `<b>${esc(composer_colonne_nom)}</b> <span style="color:${COLORS.muted};font-size:12px;font-feature-settings:'tnum';">${esc(composer_colonne_ref)}</span>`) : ''}
            ${(composer_paroi_ref || composer_paroi_nom) ? row('Paroi', `<b>${esc(composer_paroi_nom)}</b> <span style="color:${COLORS.muted};font-size:12px;font-feature-settings:'tnum';">${esc(composer_paroi_ref)}</span>`) : ''}
            ${composer_nb_essais_utilises ? row('Essais IA utilisés', composer_nb_essais_utilises) : ''}
          </table>
        </td></tr>

        ${composer_image_generee_url ? `
        <!-- Aperçu rendu -->
        <tr><td style="padding:8px 36px 4px;">
          <hr style="border:0;border-top:1px solid ${COLORS.border};margin:18px 0;">
          <h2 style="margin:0 0 12px;font-size:14px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.turquoise};">Rendu généré (pièce jointe)</h2>
          <p style="margin:0 0 12px;font-size:13px;color:${COLORS.muted};">Image en pièce jointe <b>rendu-luxeo.jpg</b>. URL source :</p>
          <p style="margin:0;font-size:11px;color:${COLORS.muted};word-break:break-all;"><a href="${esc(composer_image_generee_url)}" style="color:${COLORS.turquoise};">${esc(composer_image_generee_url)}</a></p>
        </td></tr>` : ''}

        ${composer_prompt_utilise ? `
        <!-- Prompt utilisé (debug) -->
        <tr><td style="padding:8px 36px 4px;">
          <hr style="border:0;border-top:1px solid ${COLORS.border};margin:18px 0;">
          <h2 style="margin:0 0 12px;font-size:14px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.muted};">Prompt IA (debug)</h2>
          <pre style="margin:0;padding:14px 16px;background:${COLORS.bgSoft};border-radius:8px;font-size:11px;line-height:1.5;color:${COLORS.text};white-space:pre-wrap;font-family:Menlo,Monaco,Consolas,monospace;">${esc(composer_prompt_utilise)}</pre>
        </td></tr>` : ''}

        <!-- Footer -->
        <tr><td style="padding:24px 36px 32px;">
          <hr style="border:0;border-top:1px solid ${COLORS.border};margin:18px 0 14px;">
          <p style="margin:0;font-size:11px;color:${COLORS.muted};line-height:1.6;">
            Email automatique envoyé par <b>Luxeo Composer</b> · ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}<br>
            Photo originale en pièce jointe : <b>photo-originale.jpg</b>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/**
 * Email de confirmation au client
 */
export function buildClientConfirmationHTML({ prenom }) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Votre demande Luxeo</title></head>
<body style="margin:0;padding:0;background:${COLORS.bgSoft};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bgSoft};padding:30px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px -10px rgba(10,42,42,0.12);">

        <tr><td style="background:linear-gradient(135deg,${COLORS.dark} 0%,${COLORS.turquoise} 100%);padding:34px 36px;text-align:center;">
          <div style="font-size:24px;letter-spacing:0.32em;font-weight:300;color:#fff;">LUXEO</div>
        </td></tr>

        <tr><td style="padding:36px 36px 8px;">
          <h1 style="margin:0 0 14px;font-size:24px;font-weight:300;color:${COLORS.text};letter-spacing:-0.01em;">Merci ${esc(prenom || '')} 👋</h1>
          <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${COLORS.text};">
            Votre demande de devis a bien été reçue, accompagnée de votre composition et du rendu généré par notre Composer IA.
          </p>
          <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${COLORS.text};">
            Un conseiller Luxeo vous recontacte <b>sous 24 h ouvrées</b> pour valider votre projet, programmer une visite technique gratuite et établir votre devis personnalisé — sans engagement.
          </p>
        </td></tr>

        <tr><td style="padding:0 36px 8px;">
          <div style="background:${COLORS.bgSoft};border-radius:10px;padding:18px 20px;border-left:3px solid ${COLORS.or};">
            <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${COLORS.or};font-weight:600;margin-bottom:6px;">Une question urgente ?</div>
            <div style="font-size:14px;color:${COLORS.text};">
              📞 <a href="tel:+33769010202" style="color:${COLORS.text};text-decoration:none;font-weight:500;">07 69 01 02 02</a><br>
              ✉️ <a href="mailto:info@luxeo.pro" style="color:${COLORS.text};text-decoration:none;font-weight:500;">info@luxeo.pro</a>
            </div>
          </div>
        </td></tr>

        <tr><td style="padding:22px 36px 32px;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${COLORS.muted};">
            <b>Luxeo</b> — SASU · SIREN 105 755 458<br>
            151 rue Albert Camus, 84100 Orange<br>
            Installation clé en main de douches à l'italienne en Vaucluse, Gard, Bouches-du-Rhône, Hérault.<br><br>
            Cet email est envoyé automatiquement, vous n'avez pas besoin d'y répondre.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
