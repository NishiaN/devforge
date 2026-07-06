#!/usr/bin/env node
/**
 * Full-output integrity sweep across ALL presets (v9.34)
 * Generates every standard preset (×ja/en) and every field preset (×4 scales ×ja/en)
 * and scans the real rendered output for:
 *  - undefined leakage (": undefined", "| undefined", headings/list items, 助詞直結)
 *  - [object Object] / NaN in prose
 *  - template-literal leaks (${...}) outside code fences
 *  - invalid .json files, near-empty files
 *  - broken docs/XX_ cross-references (C13-equivalent, all presets)   [v9.35]
 *  - empty/invalid mermaid blocks (C14-equivalent, all presets)       [v9.35]
 *  - unclosed code fences in .md files                                [v9.35]
 * Usage: node scripts/sweep-preset-integrity.js   (run from repo root; ~5300 generations, few minutes)
 * Expected result: 0 findings. Non-zero exit on findings.
 */
const fs = require('fs');
const path = require('path');
process.chdir(path.join(__dirname, '..'));

// ── preset→answers via the APP's real apply path (v9.38) ──
// 手組み注入はアプリ実回答と乖離する（_SCALE_DEFAULTS 4層マージ不通過で
// フィールドプリセット16キー欠落・7キー値相違 — v9.38実測）。start() 経由に統一。
const app = require('../test/app-answers.js');
const sb = app.sb;
const answersForStandard = (key) => app.answersForStandard(key);
const answersForField = (key, scale) => app.answersForField(key, scale);

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

// v9.35: C14-equivalent mermaid validity (same valid-start list as postGenerationAudit)
const MERMAID_RE = /```mermaid\s*\n([\s\S]*?)\n```/g;
const MERMAID_VALID = /^(graph|flowchart|sequenceDiagram|erDiagram|gantt|pie|classDiagram|stateDiagram|gitGraph|journey|quadrantChart|timeline|block-beta|xychart|mindmap)/;
// v9.35: C13-equivalent cross-reference (same regex as postGenerationAudit)
// docs/82 is built after generate() in the app flow (finishGen) — always exists in real output
const XREF_RE = /docs\/(\d+[_-][^`'\s")\]]+\.md)/g;
const XREF_ALLOW = new Set(['docs/82_architecture_integrity_check.md']);

const findings = [];
function scanFiles(files, tag) {
  for (const [p, c] of Object.entries(files)) {
    const raw = String(c);
    if (raw.trim().length < 10) { findings.push({tag, file:p, id:'empty', sample:'len='+raw.length}); continue; }
    // xref integrity — all file types, matching C13 behavior
    let xm;
    while ((xm = XREF_RE.exec(raw)) !== null) {
      const ref = 'docs/' + xm[1];
      if (!files[ref] && !XREF_ALLOW.has(ref)) findings.push({tag, file:p, id:'xref', sample:ref});
    }
    XREF_RE.lastIndex = 0;
    if (p.endsWith('.json')) {
      try { JSON.parse(raw); } catch (e) { findings.push({tag, file:p, id:'badjson', sample:String(e.message).slice(0,80)}); }
      continue;
    }
    if (/\[object Object\]/.test(raw)) { findings.push({tag, file:p, id:'objobj', sample:'[object Object]'}); continue; }
    if (!p.endsWith('.md')) continue;
    // mermaid block validity
    let mm;
    while ((mm = MERMAID_RE.exec(raw)) !== null) {
      const body = (mm[1] || '').trim();
      if (!body) findings.push({tag, file:p, id:'mmd-empty', sample:'(empty block)'});
      else if (!MERMAID_VALID.test(body)) findings.push({tag, file:p, id:'mmd-invalid', sample:body.slice(0,60)});
    }
    MERMAID_RE.lastIndex = 0;
    // unclosed code fence — odd count of fence-delimiter lines
    const fenceCount = raw.split('\n').filter(l => /^\s{0,3}(`{3,}|~{3,})/.test(l)).length;
    if (fenceCount % 2 !== 0) findings.push({tag, file:p, id:'fence-odd', sample:'fence lines='+fenceCount});
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
