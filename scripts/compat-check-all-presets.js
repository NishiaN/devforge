#!/usr/bin/env node
/**
 * Compat check against all 329 presets (63 standard + 266 field × 4 scales)
 * Applies _applyUniversalPostProcess() then runs checkCompat() on each.
 * Reports any ERROR or WARN hits grouped by rule ID.
 */
const h = require('../test/harness.js');

// Load additional modules into the sandbox
h.loadModule('data/compat-rules.js');
h.loadModule('generators/common.js');   // detectDomain
h.loadModule('ui/presets.js');          // _applyUniversalPostProcess

const sb = h.sandbox;
const SCALES = ['solo', 'small', 'medium', 'large'];

const hits = {};  // { ruleId: { level, entries: [{presetKey, scale}] } }
let totalChecked = 0;

function resetS(overrides) {
  sb.S = Object.assign({
    phase:0, step:0, answers:{}, projectName:'Test Project',
    skill:'intermediate', preset:'custom', lang:'ja',
    genLang:'ja', theme:'dark', pillar:0, previewFile:null,
    files:{}, skipped:[], progress:{},
    editedFiles:{}, prevFiles:{}, _v:9, skillLv:3,
    pinnedFiles:[], recentFiles:[], exportedOnce:false, compatAcked:[]
  }, overrides||{});
}

function record(ruleId, level, presetKey, scale) {
  if (!hits[ruleId]) hits[ruleId] = { level, entries: [] };
  hits[ruleId].entries.push({ presetKey, scale });
}

// ── Standard presets (63) ──
process.stdout.write('Checking standard presets…');
const PR = sb.PR;
for (const key of Object.keys(PR)) {
  resetS({ preset: key, skillLv: 3 });
  sb.S.answers = {};
  const p = PR[key];
  Object.assign(sb.S.answers, {
    purpose:      p.purpose       || '',
    target:       Array.isArray(p.target)   ? p.target.join(', ')   : (p.target||''),
    mvp_features: Array.isArray(p.features) ? p.features.join(', ') : (p.features||''),
    data_entities:p.entities      || '',
    frontend:     p.frontend      || '',
    backend:      p.backend       || '',
    database:     p.database      || '',
    auth:         p.auth          || '',
    orm:          p.orm           || '',
    deploy:       p.deploy        || '',
    payment:      p.payment       || '',
    mobile:       p.mobile        || '',
    scale:        p.scale         || 'medium',
    ai_auto:      p.ai_auto       || '',
    ai_tools:     p.ai_tools      || '',
    org_model:    p.org_model     || '',
  });
  sb._applyUniversalPostProcess(false);
  const results = sb.checkCompat(sb.S.answers);
  for (const r of results) {
    if (r.level === 'error' || r.level === 'warn') {
      record(r.id, r.level, key, 'standard');
    }
  }
  totalChecked++;
}
console.log(` ${Object.keys(PR).length} done.`);

// ── Field presets (266 × 4 scales) ──
process.stdout.write('Checking field presets × 4 scales…');
const PR_FIELD = sb.PR_FIELD;
for (const key of Object.keys(PR_FIELD)) {
  for (const scale of SCALES) {
    resetS({ preset: 'field:' + key, skillLv: 3 });
    sb.S.answers = { scale };
    const fp = PR_FIELD[key];
    const fields = ['purpose','frontend','backend','database','auth','orm','deploy',
                    'payment','mobile','ai_auto','ai_tools','org_model'];
    for (const f of fields) { if (fp[f]) sb.S.answers[f] = fp[f]; }
    if (fp.features) sb.S.answers.mvp_features = Array.isArray(fp.features) ? fp.features.join(', ') : fp.features;
    if (fp.entities) sb.S.answers.data_entities = fp.entities;
    sb._applyUniversalPostProcess(false);
    const results = sb.checkCompat(sb.S.answers);
    for (const r of results) {
      if (r.level === 'error' || r.level === 'warn') {
        record(r.id, r.level, key, scale);
      }
    }
    totalChecked++;
  }
}
console.log(` ${Object.keys(PR_FIELD).length} presets × 4 done.`);

// ── Report ──
console.log('\n════════════════════════════════════════════');
console.log(`Checked ${totalChecked} combos (${Object.keys(PR).length} standard + ${Object.keys(PR_FIELD).length}×4 field)`);
console.log('════════════════════════════════════════════\n');

const NEW_RULE_IDS = [
  'dom-saas-nopay','dom-government-firebase','dom-legal-noaudit',
  'mob-flutter-drizzle','mob-flutter-kysely','sem-auth-nofb-fbauth','db-redis-primary',
  'be-dep-py-fbh','be-dep-java-fbh','be-dep-py-cf',
  'orm-typeorm-fs','orm-sqla-fs','orm-sqla-mongo','orm-typeorm-mongo',
];

const errorRules = Object.entries(hits).filter(([,v])=>v.level==='error');
const warnRules  = Object.entries(hits).filter(([,v])=>v.level==='warn');

if (errorRules.length === 0 && warnRules.length === 0) {
  console.log('✅ No ERROR or WARN hits on any preset combo.\n');
} else {
  if (errorRules.length > 0) {
    console.log(`❌ ERROR rules firing (${errorRules.length} rules):\n`);
    for (const [id, {entries}] of errorRules) {
      const isNew = NEW_RULE_IDS.includes(id) ? ' ← NEW' : '';
      console.log(`  [ERROR] ${id}${isNew} — ${entries.length} hit(s):`);
      for (const e of entries) console.log(`    • ${e.presetKey} (${e.scale})`);
    }
    console.log('');
  }
  if (warnRules.length > 0) {
    console.log(`⚠️  WARN rules firing (${warnRules.length} rules):\n`);
    for (const [id, {entries}] of warnRules) {
      const isNew = NEW_RULE_IDS.includes(id) ? ' ← NEW' : '';
      console.log(`  [WARN] ${id}${isNew} — ${entries.length} hit(s):`);
      for (const e of entries) console.log(`    • ${e.presetKey} (${e.scale})`);
    }
    console.log('');
  }
}

// New-rule summary
const newHits = NEW_RULE_IDS.filter(id => hits[id]);
console.log('── New rules (14 added today) ──');
if (newHits.length === 0) {
  console.log('✅ None of the 14 new rules fire on any existing preset.\n');
} else {
  for (const id of newHits) {
    const {level, entries} = hits[id];
    console.log(`  [${level.toUpperCase()}] ${id} — ${entries.length} hit(s):`);
    for (const e of entries) console.log(`    • ${e.presetKey} (${e.scale})`);
  }
}
