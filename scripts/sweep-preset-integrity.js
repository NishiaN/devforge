#!/usr/bin/env node
/**
 * Full-output integrity sweep across ALL presets (v9.34)
 * Generates every standard preset (×ja/en) and every field preset (×4 scales ×ja/en)
 * and scans the real rendered output for:
 *  - undefined leakage (": undefined", "| undefined", headings/list items, 助詞直結)
 *  - [object Object] / NaN in prose
 *  - template-literal leaks (${...}) outside code fences
 *  - invalid .json files, near-empty files
 * Usage: node scripts/sweep-preset-integrity.js   (run from repo root; ~5300 generations, few minutes)
 * Expected result: 0 findings. Non-zero exit on findings.
 */
const fs = require('fs');
const path = require('path');
process.chdir(path.join(__dirname, '..'));

// ── sandbox for preset→answers conversion (same as compat-check-all-presets.js) ──
const h = require('../test/harness.js');
h.loadModule('data/compat-rules.js');
h.loadModule('generators/common.js');
h.loadModule('ui/presets.js');
const sb = h.sandbox;

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

function answersForStandard(key) {
  resetS({ preset: key });
  const p = sb.PR[key];
  Object.assign(sb.S.answers, {
    purpose: p.purpose||'', target: Array.isArray(p.target)?p.target.join(', '):(p.target||''),
    mvp_features: Array.isArray(p.features)?p.features.join(', '):(p.features||''),
    data_entities: p.entities||'', frontend: p.frontend||'', backend: p.backend||'',
    database: p.database||'', auth: p.auth||'', orm: p.orm||'', deploy: p.deploy||'',
    payment: p.payment||'', mobile: p.mobile||'', scale: p.scale||'medium',
    ai_auto: p.ai_auto||'', ai_tools: p.ai_tools||'', org_model: p.org_model||'',
  });
  sb._applyUniversalPostProcess(false);
  return JSON.parse(JSON.stringify(sb.S.answers));
}

function answersForField(key, scale) {
  resetS({ preset: 'field:'+key });
  sb.S.answers = { scale };
  const fp = sb.PR_FIELD[key];
  const fields = ['purpose','frontend','backend','database','auth','orm','deploy',
                  'payment','mobile','ai_auto','ai_tools','org_model'];
  for (const f of fields) { if (fp[f]) sb.S.answers[f] = fp[f]; }
  if (fp.features) sb.S.answers.mvp_features = Array.isArray(fp.features)?fp.features.join(', '):fp.features;
  if (fp.entities) sb.S.answers.data_entities = fp.entities;
  sb._applyUniversalPostProcess(false);
  return JSON.parse(JSON.stringify(sb.S.answers));
}

// ── generate() context (snapshot harness prefix) ──
const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

// ── integrity checks ──
function stripCode(s) {
  return String(s).replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
}
const CHECKS = [
  { id:'undef',  test:(prose)=>{ const m = prose.match(/(:\s*undefined\b|\bundefined\s*\||\|\s*undefined\b|^#+\s*undefined|^-\s*undefined\b|\*\*undefined\*\*|\(undefined\)|undefined(件|の|を|に|が))/m); return m && m[0]; } },
  { id:'objobj', test:(prose,raw)=>{ const m = raw.match(/\[object Object\]/); return m && m[0]; } },
  { id:'nan',    test:(prose)=>{ const m = prose.match(/(:\s*NaN\b|\bNaN\s*\||\|\s*NaN\b|\(NaN|NaN(件|円|%|人|時間|h\b))/m); return m && m[0]; } },
  { id:'tpl',    test:(prose)=>{ const m = prose.match(/\$\{[a-zA-Z_][^}]*\}/); return m && m[0]; } },
];

const findings = [];
function scanFiles(files, tag) {
  for (const [p, c] of Object.entries(files)) {
    const raw = String(c);
    if (raw.trim().length < 10) { findings.push({tag, file:p, id:'empty', sample:'len='+raw.length}); continue; }
    if (p.endsWith('.json')) {
      try { JSON.parse(raw); } catch (e) { findings.push({tag, file:p, id:'badjson', sample:String(e.message).slice(0,80)}); }
      continue;
    }
    if (/\[object Object\]/.test(raw)) { findings.push({tag, file:p, id:'objobj', sample:'[object Object]'}); continue; }
    if (!p.endsWith('.md')) continue;
    const prose = stripCode(raw);
    for (const chk of CHECKS) {
      const hit = chk.test(prose, raw);
      if (hit) findings.push({tag, file:p, id:chk.id, sample:String(hit).slice(0,80)});
    }
  }
}

// ── sweep ──
const stdKeys = Object.keys(sb.PR);
const fieldKeys = Object.keys(sb.PR_FIELD);
let done = 0;
console.log(`Sweeping ${stdKeys.length} standard (×ja/en) + ${fieldKeys.length} field presets (×4 scales ×ja/en)`);

for (const key of stdKeys) {
  const ans = answersForStandard(key);
  for (const lang of ['ja','en']) {
    scanFiles(generate({...ans}, 'T', lang), `std:${key}:${lang}`);
    if (++done % 500 === 0) console.log(`  ${done} done (findings: ${findings.length})`);
  }
}
for (const key of fieldKeys) {
  for (const scale of ['solo','small','medium','large']) {
    const ans = answersForField(key, scale);
    for (const lang of ['ja','en']) {
      scanFiles(generate({...ans}, 'T', lang), `fld:${key}:${scale}:${lang}`);
      if (++done % 500 === 0) console.log(`  ${done} done (findings: ${findings.length})`);
    }
  }
}

// ── report ──
const uniq = {};
for (const f of findings) {
  const k = f.id + '|' + f.file + '|' + f.sample;
  if (!uniq[k]) uniq[k] = { count: 0, example: f.tag };
  uniq[k].count++;
}
console.log(`\nDONE: ${done} generations, ${findings.length} findings (${Object.keys(uniq).length} unique file×pattern)`);
for (const [k, v] of Object.entries(uniq)) console.log(`  ${v.count}x ${k}  e.g. ${v.example}`);
process.exit(findings.length ? 1 : 0);
