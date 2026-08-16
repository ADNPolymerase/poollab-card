/**
 * poollab-card — behaviour tests.  Run with:  node test/run.mjs
 *
 * These cover what a screenshot cannot tell you apart: whether a reading is
 * colored against the right bound, what an OVER reading falls back to, how many
 * previous measurements survive a short history — and whether the editor's
 * ha-form schema still speaks the same key names as the card that reads them.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadCard, freezeClock, now, check, contains, report }
  from './harness.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// The card caches thresholds per entity so they outlive a measurement that
// stops publishing them. Node has no localStorage: without this the cache is a
// silent no-op and tier 3 of the threshold cascade is never exercised.
const _store = new Map();
globalThis.localStorage = {
  getItem: k => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => { _store.set(k, String(v)); },
  removeItem: k => { _store.delete(k); },
  clear: () => _store.clear(),
};

const registry = await loadCard(join(HERE, '..', 'dist', 'poollab-card.js'));
const Card   = registry.get('poollab-card');
const Editor = registry.get('poollab-card-editor');

// The harness's nodes swallow listeners, and the editor's whole contract runs
// through the ha-form value-changed it subscribes to — so make created nodes
// able to fire back.
let created = 0;   // counts elements built, to catch a form rebuilt in a loop
const _create = globalThis.document.createElement;
globalThis.document.createElement = tag => {
  const n = _create(tag), ls = {};
  n.addEventListener = (type, fn) => { (ls[type] = ls[type] || []).push(fn); };
  n.dispatchEvent = ev => { (ls[ev.type] || []).forEach(fn => fn(ev)); return true; };
  created++;
  return n;
};

freezeClock('2026-08-12T12:00:00Z');

const ID  = 'sensor.pool_pl_ph';
const AID = 'sensor.pool_pl_alkalinity';
const DASH = String.fromCharCode(8212);   // — used by the unavailable row
const NDASH = String.fromCharCode(8211);  // – used between target bounds

/** A PoolLab sensor state: value in .state, everything else in attributes. */
function sensor(parameter, value, attrs = {}) {
  return {
    state: String(value),
    attributes: {
      parameter, unit_of_measurement: 'mg/l',
      measured_at: '2026-08-10T09:00:00Z', ...attrs,
    },
  };
}

/**
 * Renders a card and hands back what landed in each slot.
 *   hist       pre-loaded history, newest first — [current, prev1, prev2, …]
 *   keepCache  keeps the localStorage threshold cache from the previous render
 */
function renderCard(config, states, { hist = {}, keepCache = false } = {}) {
  if (!keepCache) localStorage.clear();
  const c = new Card();
  const slots = {};
  c.querySelector = sel => (slots[sel] = slots[sel] || { innerHTML: '', textContent: '' });
  c.setConfig(config);
  c._hist   = hist;
  c._histAt = now();  // history already folded in → the WS call must not fire
  c.hass = {
    states, locale: { language: config.language || 'en' },
    callWS: () => { throw new Error('callWS ne devrait pas être appelé'); },
  };
  return {
    card : c,
    rows : slots['#pl-rows'].innerHTML,
    sub  : slots['#pl-sub'].textContent,
    title: slots['#pl-title-text'].textContent,
  };
}

/** One pH row, the shorthand most tests below use. */
function ph(value, entity = {}, attrs = {}, opts = {}, cfg = {}) {
  return renderCard(
    { title: 'PoolLab', entities: [{ entity: ID, ...entity }], ...cfg },
    { [ID]: sensor('pH', value, attrs) },
    opts,
  ).rows;
}

// ── Readers over the rendered markup ────────────────────────────────────────

const cls      = h => (h.match(/class="pl-cur ([a-z-]+)"/)         || [])[1] ?? '(aucune)';
const value    = h => (h.match(/class="pl-cur [a-z-]+">([^<]*)</)  || [])[1] ?? '(aucune)';
const pill     = h => (h.match(/class="pl-pill (pl-pill-[a-z]+)">([^<]*)</) || []).slice(1, 3).join(' ') || '(aucune)';
const target   = h => (h.match(/class="pl-target">([^<]*)</)       || [])[1] ?? '(aucune)';
const unit     = h => (h.match(/class="pl-unit">([^<]*)</)         || [])[1] ?? '(aucune)';
const arrow    = h => (h.match(/class="pl-arrow ([a-z-]+)" icon="mdi:arrow-(top|bottom)-right"/) || []).slice(1, 3).join(' ') || '(aucune)';
const dates    = h => (h.match(/class="pl-mdate"/g)               || []).length;
/** Previous readings only: the current one renders as .pl-cur, never .pl-mval. */
const prevs    = h => [...h.matchAll(/<div class="pl-m"><span class="pl-mval">([^<]*)</g)]
                        .map(m => m[1]);

// ── Coloring against the target: the bounds are inclusive ───────────────────
// A value sitting exactly on min or max is in range. Both comparisons are
// strict; flipping either one to >= / <= flags a perfectly good reading.

const TH = { min: 7.2, max: 7.6, critical_min: 6.8, critical_max: 8 };

check('milieu de cible → vert',            cls(ph(7.4, TH)), 'pl-ok');
check('pile sur la borne basse → dans la cible', cls(ph(7.2, TH)), 'pl-ok');
check('pile sur la borne haute → dans la cible', cls(ph(7.6, TH)), 'pl-ok');
check('juste sous la borne basse → orange', cls(ph(7.19, TH)), 'pl-warn');
check('juste au-dessus de la borne haute → orange', cls(ph(7.61, TH)), 'pl-warn');

check('pastille dans la cible',   pill(ph(7.4,  TH)), 'pl-pill-ok OK');
check('pastille trop bas',        pill(ph(7.19, TH)), 'pl-pill-warn Too low');
check('pastille trop haut',       pill(ph(7.61, TH)), 'pl-pill-warn Too high');

// Third tier: orange outside min/max, red only beyond the critical bounds —
// which are inclusive too.
check('pile sur le seuil critique bas → encore orange',  cls(ph(6.8,  TH)), 'pl-warn');
check('sous le seuil critique bas → rouge',              cls(ph(6.79, TH)), 'pl-crit');
check('pile sur le seuil critique haut → encore orange', cls(ph(8,    TH)), 'pl-warn');
check('au-dessus du seuil critique haut → rouge',        cls(ph(8.01, TH)), 'pl-crit');
check('pastille rouge en bas',  pill(ph(6.79, TH)), 'pl-pill-crit Too low');
check('pastille rouge en haut', pill(ph(8.01, TH)), 'pl-pill-crit Too high');

check('hors cible sans seuil critique → jamais rouge',
  cls(ph(6.0, { min: 7.2, max: 7.6 })), 'pl-warn');

// Priority of the threshold sources. A bound typed by hand is an explicit
// decision and outranks the one the PoolLab app publishes: what the editor
// shows and what the card displays have to be the same number.
const APP = { ideal_low: 7.0, ideal_high: 7.8 };

check('seuil saisi à la main → c\'est lui qui s\'affiche',
  target(ph(7.4, { min: 7.2, max: 7.6 }, APP)), `target 7.2${NDASH}7.6`);
check('seuil saisi à la main → c\'est lui qui colore',
  cls(ph(7.7, { min: 7.2, max: 7.6 }, APP)), 'pl-warn');
check('aucun seuil saisi → celui de l\'app PoolLab',
  target(ph(7.4, {}, APP)), `target 7${NDASH}7.8`);
check('aucun seuil saisi → celui de l\'app colore',
  cls(ph(7.7, {}, APP)), 'pl-ok');
check('un seul seuil saisi → l\'autre borne reste celle de l\'app',
  target(ph(7.4, { min: 7.1 }, APP)), `target 7.1${NDASH}7.8`);
check('ideal_low/high à -1 = pas de seuil → le YAML reprend la main',
  cls(ph(7.7, { min: 7.2, max: 7.6 }, { ideal_low: -1, ideal_high: -1 })), 'pl-warn');

// Tier 3: once seen, thresholds survive a measurement that no longer carries
// them — the reason the cache exists at all.
const seeded = renderCard(
  { entities: [{ entity: AID }] },
  { [AID]: sensor('Alkalinity', 100, { ideal_low: 80, ideal_high: 120 }) },
);
check('relevé avec seuils → dans la cible', cls(seeded.rows), 'pl-ok');
check('relevé suivant sans seuils → seuils repris du cache',
  cls(renderCard({ entities: [{ entity: AID }] },
    { [AID]: sensor('Alkalinity', 200) }, { keepCache: true }).rows), 'pl-warn');
check('cache vidé → plus aucun seuil, valeur neutre',
  cls(renderCard({ entities: [{ entity: AID }] },
    { [AID]: sensor('Alkalinity', 200) }).rows), 'pl-neutral');

// Only the app's values are cached. Caching a hand-typed bound would make it
// outlive its own removal from the config — the same mismatch, one step later.
renderCard({ entities: [{ entity: AID, min: 80, max: 120 }] },
  { [AID]: sensor('Alkalinity', 100) });
check('seuil saisi à la main puis retiré → rien ne subsiste du cache',
  cls(renderCard({ entities: [{ entity: AID }] },
    { [AID]: sensor('Alkalinity', 200) }, { keepCache: true }).rows), 'pl-neutral');
check('aucun seuil → aucune pastille',
  pill(renderCard({ entities: [{ entity: AID }] },
    { [AID]: sensor('Alkalinity', 200) }).rows), '(aucune)');

// The target line, and the two one-sided forms. pH always has both bounds (it
// is the one parameter with a built-in default), so use one that has neither.
const alkTarget = entity => target(renderCard({ entities: [{ entity: AID, ...entity }] },
  { [AID]: sensor('Alkalinity', 100) }).rows);
check('cible affichée',    target(ph(7.4, TH)), `target 7.2${NDASH}7.6`);
check('cible alcalinité',  alkTarget({ min: 80, max: 120 }), `target 80${NDASH}120`);
check('seuil haut seul',   alkTarget({ max: 120 }), 'max 120');
check('seuil bas seul',    alkTarget({ min: 80 }), 'min 80');
check('show_target: false → cible masquée',
  target(ph(7.4, TH, {}, {}, { show_target: false })), '(aucune)');

// Tier 4, the built-in defaults. The table is keyed on parameter names, which
// arrive as free text — so extra words are tolerated, whole words only. A bare
// substring match had "Phosphate LR" and "PHMB" inherit the pH target.
const bare = (parameter, value) => renderCard({ entities: [{ entity: AID }] },
  { [AID]: sensor(parameter, value) }).rows;

check('pH sans seuils → cible par défaut',      target(bare('pH', 7.4)), `target 7.2${NDASH}7.6`);
check('préfixe PL ignoré',                      target(bare('PL pH', 7.4)), `target 7.2${NDASH}7.6`);
check('mot en plus toléré (pH-Wert)',           target(bare('pH-Wert', 7.4)), `target 7.2${NDASH}7.6`);
check("Phosphate LR n'hérite pas de la cible du pH", target(bare('Phosphate LR', 0.5)), '(aucune)');
check('Phosphate LR reste donc neutre, pas « trop bas »', cls(bare('Phosphate LR', 0.5)), 'pl-neutral');
check("PHMB n'hérite pas de la cible du pH",    target(bare('PHMB', 30)), '(aucune)');
check("l'alcalinité n'a pas de cible par défaut", target(bare('Alkalinity', 100)), '(aucune)');

// ── OVER: past the ceiling of the test, there is no number to color ─────────

const OVER = 999999;
const over = (entity = {}, param = 'Chlorine free', opts = {}) => renderCard(
  { entities: [{ entity: ID, ...entity }] },
  { [ID]: sensor(param, OVER) }, opts,
);

check('OVER → repli sur le plafond du test',  value(over().rows), '&gt; 6');
check('OVER → pastille OVER',                 pill(over().rows), 'pl-pill-warn OVER');
check('OVER → orange sans seuil critique',    cls(over().rows), 'pl-warn');
check('OVER → rouge si seuil critique haut défini',
  cls(over({ critical_max: 5 }).rows), 'pl-crit');
check('OVER → pastille rouge si seuil critique haut défini',
  pill(over({ critical_max: 5 }).rows), 'pl-pill-crit OVER');
check('OVER → test_max du YAML prime sur la table interne',
  value(over({ test_max: 10 }).rows), '&gt; 10');
check('OVER → à défaut, repli sur le seuil haut',
  value(over({ max: 3.5 }, 'Salinity').rows), '&gt; 3.5');
check('OVER → sans plafond connu ni seuil, mot OVER',
  value(over({}, 'Salinity').rows), 'OVER');
// Same whole-word rule on the ceilings table, which also has a "ph" row.
check('OVER → plafond tolère les mots en plus',
  value(over({}, 'Chlorine free DPD').rows), '&gt; 6');
check('OVER → un paramètre inconnu contenant « ph » n\'emprunte pas le plafond du pH',
  value(over({}, 'Phosphonate').rows), 'OVER');
check("OVER → pas d'unité (elle n'a plus de sens)", unit(over().rows), '(aucune)');

// The threshold is a floor, not a ceiling: 99999 is still a real reading.
check('juste sous le seuil OVER → valeur normale',
  value(renderCard({ entities: [{ entity: ID }] },
    { [ID]: sensor('Salinity', 99999) }).rows), '99999');
check('pile sur le seuil OVER → OVER',
  value(renderCard({ entities: [{ entity: ID }] },
    { [ID]: sensor('Salinity', 100000) }).rows), 'OVER');

// An OVER row hides the trend: comparing "off the scale" to a number is noise.
const overHist = { [ID]: [{ value: OVER, measured_at: '2026-08-10T09:00:00Z' },
                          { value: 3.1,  measured_at: '2026-08-08T09:00:00Z' },
                          { value: 2.4,  measured_at: '2026-08-06T09:00:00Z' }] };
check('OVER → aucune mesure précédente affichée',
  prevs(over({}, 'Chlorine free', { hist: overHist }).rows).length, 0);
check('OVER → aucune flèche de tendance',
  arrow(over({}, 'Chlorine free', { hist: overHist }).rows), '(aucune)');

// ── Previous measurements: 0, 1, or not enough for a trend ──────────────────
// history[0] is the reading already shown as the current value, so a history of
// one entry has nothing previous to show and nothing to compare against.

const H = (...vals) => ({ [ID]: vals.map((v, i) => ({
  value: v, measured_at: `2026-08-0${8 - i}T09:00:00Z` })) });

check('aucun historique → aucune mesure précédente',  prevs(ph(7.4, TH, {}, { hist: {} })).length, 0);
check('aucun historique → aucune flèche',             arrow(ph(7.4, TH, {}, { hist: {} })), '(aucune)');
check('aucun historique → la date du relevé reste affichée',
  dates(ph(7.4, TH, {}, { hist: {} })), 1);

check('un seul relevé en historique → aucune mesure précédente',
  prevs(ph(7.4, TH, {}, { hist: H(7.4) })).length, 0);
check('un seul relevé en historique → aucune flèche',
  arrow(ph(7.4, TH, {}, { hist: H(7.4) })), '(aucune)');

check('deux relevés → une seule mesure précédente',
  prevs(ph(7.4, TH, {}, { hist: H(7.4, 7.1) })).join(','), '7.10');
check('quatre relevés, measurements=3 → les deux précédentes, plus ancienne à gauche',
  prevs(ph(7.4, TH, {}, { hist: H(7.4, 7.3, 7.1, 6.9) })).join(','), '7.10,7.30');
check('measurements=2 → une seule précédente',
  prevs(ph(7.4, TH, {}, { hist: H(7.4, 7.3, 7.1) }, { measurements: 2 })).join(','), '7.30');
check('measurements=1 → aucune précédente malgré l\'historique',
  prevs(ph(7.4, TH, {}, { hist: H(7.4, 7.3, 7.1) }, { measurements: 1 })).length, 0);
check('measurements=1 → aucune flèche non plus',
  arrow(ph(7.4, TH, {}, { hist: H(7.4, 7.3, 7.1) }, { measurements: 1 })), '(aucune)');

// The arrow reads "is this getting better", not "is this going up".
check('valeur qui se rapproche du centre de la cible → flèche verte',
  arrow(ph(7.4, TH, {}, { hist: H(7.4, 7.1) })), 'pl-ok top');
check("valeur qui s'éloigne du centre de la cible → flèche orange",
  arrow(ph(7.9, TH, {}, { hist: H(7.9, 7.5) })), 'pl-warn top');
check('baisse → flèche vers le bas',
  arrow(ph(7.1, TH, {}, { hist: H(7.1, 7.5) })), 'pl-warn bottom');
check('valeur inchangée → aucune flèche',
  arrow(ph(7.4, TH, {}, { hist: H(7.4, 7.4) })), '(aucune)');
check('trend: false → précédente affichée mais pas de flèche',
  arrow(ph(7.4, { ...TH, trend: false }, {}, { hist: H(7.4, 7.1) })), '(aucune)');
check('trend: false → la mesure précédente reste affichée',
  prevs(ph(7.4, { ...TH, trend: false }, {}, { hist: H(7.4, 7.1) })).join(','), '7.10');

// ── Silent-failure guards ───────────────────────────────────────────────────

const missing = renderCard({ entities: [{ entity: 'sensor.absent', name: 'Chlore' }] }, {}).rows;
contains('entité absente → ligne grisée', missing, 'pl-row pl-unavailable');
contains('entité absente → tiret à la place de la valeur', missing, DASH);
contains('entité absente → le nom configuré reste lisible', missing, 'Chlore');

const dirty = ph(7.4, { name: 'Chlore "piscine" <b>', icon: 'mdi:x" onload="x' }, {}, {});
contains('nom échappé', dirty, 'Chlore &quot;piscine&quot; &lt;b&gt;');
check('nom : rien d\'injecté', /Chlore "piscine" <b>/.test(dirty), false);
check('icône : guillemet neutralisé', /icon="mdi:x" onload=/.test(dirty), false);

// ── Header ──────────────────────────────────────────────────────────────────

const head = renderCard({ title: 'Ma piscine', entities: [{ entity: ID }] },
  { [ID]: sensor('pH', 7.4) });
check('titre repris de la config', head.title, 'Ma piscine');
contains('sous-titre = date du dernier relevé', head.sub, 'last reading');
check('show_date: false → aucune date dans les lignes',
  dates(ph(7.4, TH, {}, {}, { show_date: false })), 0);
check('show_date: false → aucun sous-titre',
  renderCard({ show_date: false, entities: [{ entity: ID }] },
    { [ID]: sensor('pH', 7.4) }).sub, '');

// ── Editor: the config-changed contract ─────────────────────────────────────
// CustomEvent.detail is a readonly accessor: assigning it after construction
// silently drops the payload and every edit made in the editor is discarded.

function makeEditor(config, states, language = 'en') {
  localStorage.clear();
  const ed = new Editor();
  ed.setConfig(config);
  ed.hass = { states, locale: { language } };
  const form = ed.children[ed.children.length - 1];
  return { ed, form, schema: form.schema, data: form.data };
}

/**
 * Every key the editor is supposed to own, with a value that is visible in the
 * rendering. The suite feeds these through the *schema's own* names, so a key
 * renamed on one side only loses its value on the way and fails below.
 */
const ROOT_KEYS   = { title: 'Ma piscine', language: 'fr', measurements: '2',
                      show_date: false, show_target: false, entities: [AID] };
const ENTITY_KEYS = { icon: 'mdi:flask', name: 'Alcalinité', min: 80, max: 120,
                      critical_min: 60, critical_max: 160, trend: false };

const alk = { [AID]: sensor('Alkalinity', 100) };
const { ed, form, schema } = makeEditor(
  { type: 'custom:poollab-card', entities: [{ entity: AID }] }, alk);

const rootNames = schema.filter(s => s.type !== 'expandable').map(s => s.name);
const subSchema = schema.find(s => s.type === 'expandable').schema;
const subNames  = subSchema.map(s => s.name);

check('schéma racine : les clés attendues, ni plus ni moins',
  rootNames.slice().sort().join(','), Object.keys(ROOT_KEYS).sort().join(','));
check('schéma par entité : les clés attendues, ni plus ni moins',
  subNames.slice().sort().join(','), Object.keys(ENTITY_KEYS).sort().join(','));

// Build the ha-form payload from the schema itself, never from hardcoded names.
const payload = {};
for (const s of schema) {
  if (s.type === 'expandable') {
    payload[s.name] = Object.fromEntries(s.schema.map(f => [f.name, ENTITY_KEYS[f.name]]));
  } else payload[s.name] = ROOT_KEYS[s.name];
}
form.dispatchEvent({ type: 'value-changed', detail: { value: payload } });

const ev = ed.events.at(-1);
check("l'éditeur émet config-changed", ev?.type, 'config-changed');
check('config-changed porte bien detail.config', typeof ev?.detail?.config, 'object');

const out = ev.detail.config;
// Dropping `type` on the way out is what made the card crash on any edit once.
check('type de la card conservé', out.type, 'custom:poollab-card');
check('titre transmis',        out.title, 'Ma piscine');
check('langue transmise',      out.language, 'fr');
check('measurements converti en nombre', out.measurements, 2);
check('show_date transmis',    out.show_date, false);
check('show_target transmis',  out.show_target, false);
check('entités transmises',    out.entities.map(e => e.entity).join(','), AID);
check('clés par entité transmises',
  Object.keys(out.entities[0]).sort().join(','),
  ['entity', ...Object.keys(ENTITY_KEYS)].sort().join(','));

// Same trip, end to end: the config the editor just emitted must drive the card.
// This is the half that a renamed key would break invisibly.
const rt = renderCard(out,
  { [AID]: sensor('Alkalinity', 130) },
  { hist: { [AID]: [{ value: 130 }, { value: 110 }, { value: 90 }] } });

contains('aller-retour : icône appliquée',   rt.rows, 'icon="mdi:flask"');
contains('aller-retour : nom appliqué',      rt.rows, 'Alcalinité');
check('aller-retour : titre appliqué',       rt.title, 'Ma piscine');
check('aller-retour : langue appliquée (pastille traduite)',
  pill(rt.rows), 'pl-pill-warn Trop haut');
check('aller-retour : max appliqué',         cls(rt.rows), 'pl-warn');
check('aller-retour : critical_max appliqué',
  cls(renderCard(out, { [AID]: sensor('Alkalinity', 170) }).rows), 'pl-crit');
check('aller-retour : min appliqué',
  pill(renderCard(out, { [AID]: sensor('Alkalinity', 70) }).rows), 'pl-pill-warn Trop bas');
check('aller-retour : critical_min appliqué',
  cls(renderCard(out, { [AID]: sensor('Alkalinity', 50) }).rows), 'pl-crit');
check('aller-retour : measurements appliqué', prevs(rt.rows).length, 1);
check('aller-retour : trend: false appliqué', arrow(rt.rows), '(aucune)');
check('aller-retour : show_date appliqué',    dates(rt.rows), 0);
check('aller-retour : show_target appliqué',  target(rt.rows), '(aucune)');

// The editor also has to hand back what it does not display. unit/decimals/
// test_max are YAML-only; a round trip through the form must not eat them.
const keep = makeEditor(
  { entities: [{ entity: AID, unit: 'ppm', decimals: 3, test_max: 42 }] }, alk);
keep.form.dispatchEvent({ type: 'value-changed', detail: { value: {
  title: 'PoolLab', measurements: '3', show_date: true, show_target: true,
  entities: [AID], language: '',
} } });
const kept = keep.ed.events.at(-1).detail.config.entities[0];
check('unit non affichée mais préservée',     kept.unit, 'ppm');
check('decimals non affiché mais préservé',   kept.decimals, 3);
check('test_max non affiché mais préservé',   kept.test_max, 42);

// measurements is a dropdown of 1..3; anything else has to fall back, not crash.
keep.form.dispatchEvent({ type: 'value-changed', detail: { value: {
  title: 'PoolLab', measurements: '9', show_date: true, show_target: true,
  entities: [AID], language: '',
} } });
check('measurements hors bornes → repli sur 3',
  keep.ed.events.at(-1).detail.config.measurements, 3);

// A threshold left at the value the sensor already provides is a default, not a
// choice: persisting it would freeze the app's own target into the YAML.
const dflt = makeEditor({ entities: [{ entity: AID }] },
  { [AID]: sensor('Alkalinity', 100, { ideal_low: 80, ideal_high: 120 }) });
check("seuils pré-remplis depuis le relevé",
  `${dflt.data[Object.keys(dflt.data).find(k => k.startsWith('e_'))].min}/${dflt.data[Object.keys(dflt.data).find(k => k.startsWith('e_'))].max}`,
  '80/120');
const key = Object.keys(dflt.data).find(k => k.startsWith('e_'));
dflt.form.dispatchEvent({ type: 'value-changed', detail: { value: {
  title: 'PoolLab', measurements: '3', show_date: true, show_target: true,
  entities: [AID], language: '', [key]: { min: 80, max: 120, icon: 'mdi:water-percent', name: '', trend: true },
} } });
const un = dflt.ed.events.at(-1).detail.config.entities[0];
check('seuil laissé à la valeur du relevé → non recopié dans la config', un.min, undefined);
dflt.form.dispatchEvent({ type: 'value-changed', detail: { value: {
  title: 'PoolLab', measurements: '3', show_date: true, show_target: true,
  entities: [AID], language: '', [key]: { min: 85, max: 120, icon: 'mdi:water-percent', name: '', trend: true },
} } });
check('seuil modifié → écrit dans la config',
  dflt.ed.events.at(-1).detail.config.entities[0].min, 85);

// ── Editor: no rebuild loop, no echo ────────────────────────────────────────
// Home Assistant calls setConfig again after every config-changed the editor
// emits. An editor that rebuilds its form on each call recreates its child
// controls, and a control that has just been created can emit an empty
// value-changed which is then saved over the configured entity — a card losing
// its sensor with nobody touching anything. This editor builds its ha-form once
// and refreshes values in place; these two assertions are what keeps it so.

const KEEP = { type: 'custom:poollab-card', entities: [{ entity: AID }] };
const stable = makeEditor(KEEP, alk);
stable.ed.innerHTML = 'SENTINELLE';
const builtBefore = created;
stable.ed.setConfig(KEEP);
stable.ed.setConfig(KEEP);
stable.ed.hass = { states: alk, locale: { language: 'en' } };
check('setConfig répété ne reconstruit aucun élément', created - builtBefore, 0);
check('setConfig répété laisse le DOM en place', stable.ed.markup, 'SENTINELLE');

// The echo has to stay silent too, or the editor and HA ping-pong config
// changes at each other.
const echo = makeEditor(KEEP, alk);
const emittedBefore = echo.ed.events.length;
echo.ed.setConfig(JSON.parse(JSON.stringify(echo.ed._config)));
echo.ed.hass = { states: alk, locale: { language: 'en' } };
check("l'écho de setConfig n'émet aucun config-changed",
  echo.ed.events.length - emittedBefore, 0);
check("l'écho de setConfig ne perd pas l'entité",
  echo.ed._config.entities.map(e => e.entity).join(','), AID);

// ── Editor and card must show the same target ───────────────────────────────
// The number pre-filled in the editor's threshold box and the number printed on
// the card's target line come from two separate cascades. They have to resolve
// identically, or the user reads one target in the menu and gets another on the
// card.

const menuVsCard = (entity, attrs) => {
  const states = { [AID]: sensor('Alkalinity', 100, attrs) };
  const e = makeEditor({ entities: [{ entity: AID, ...entity }] }, states);
  const box = e.data[Object.keys(e.data).find(k => k.startsWith('e_'))];
  const shown = target(renderCard({ entities: [{ entity: AID, ...entity }] },
    states, { keepCache: true }).rows).replace(/^\S+\s/, '');
  return `menu ${box.min}${NDASH}${box.max} / card ${shown}`;
};

check('menu et card d\'accord — deux seuils saisis',
  menuVsCard({ min: 80, max: 120 }, { ideal_low: 70, ideal_high: 130 }),
  `menu 80${NDASH}120 / card 80${NDASH}120`);
check('menu et card d\'accord — aucun seuil saisi',
  menuVsCard({}, { ideal_low: 70, ideal_high: 130 }),
  `menu 70${NDASH}130 / card 70${NDASH}130`);
check('menu et card d\'accord — un seul seuil saisi',
  menuVsCard({ min: 75 }, { ideal_low: 70, ideal_high: 130 }),
  `menu 75${NDASH}130 / card 75${NDASH}130`);

// ── Languages: whatever the card speaks, the editor has to offer ────────────
// The dropdown is built from its own table, which drifted five releases behind
// the translations without anything showing: sv/no/da/pl/ru were reachable
// from YAML only.

const LANGS = ['en', 'fr', 'de', 'es', 'it', 'nl', 'pt', 'sv', 'no', 'da', 'pl', 'ru'];

/** "target" is worded differently in all twelve, so a fallback to English shows. */
const targetWord = l => target(renderCard(
  { language: l, entities: [{ entity: AID, min: 80, max: 120 }] },
  { [AID]: sensor('Alkalinity', 100) }).rows).split(' ')[0];

check('les langues annoncées sont réellement traduites',
  LANGS.filter(l => l !== 'en' && targetWord(l) === targetWord('en')).join(','), '');

const langField = makeEditor({ entities: [{ entity: AID }] }, alk)
  .schema.find(s => s.name === 'language');
const offered = langField.selector.select.options.map(o => o.value).filter(Boolean);

check("l'éditeur propose toutes les langues traduites",
  LANGS.filter(l => !offered.includes(l)).join(','), '');
check("l'éditeur ne propose aucune langue non traduite",
  offered.filter(l => !LANGS.includes(l)).join(','), '');

// The dropdown's own label comes from a second table, which can fall behind the
// same way — a Swedish editor showing an English "Language" row.
check('libellé du menu de langue localisé partout',
  LANGS.filter(l => l !== 'en' && makeEditor({ entities: [{ entity: AID }] }, alk, l)
    .schema.find(s => s.name === 'language').label === 'Language').join(','), '');

report();
