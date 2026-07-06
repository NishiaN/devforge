/**
 * v9.34 全プリセット完全性掃引 — 回帰テスト
 * 1718生成の全数掃引（全257標準+603分野プリセット×ja/en）で発見した2バグの回帰ガード:
 *  - docs/53: rateLimits の重要操作キーがドメイン毎に異なり、ハードコードチェーンが
 *    22/29ドメインで undefined を出力（742/1718生成 = 43%で再現していた）
 *  - docs/44: STRIDE_PATTERNS.hasFile の R キー欠落 → ファイル列を持つエンティティの
 *    Repudiation 列が undefined（76/1718生成で再現していた）
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));
// STRIDE_PATTERNS is const in p12 (does not escape eval scope) — reload with var
eval(fs.readFileSync('src/generators/p12-security.js', 'utf-8').replace('const STRIDE_PATTERNS', 'var STRIDE_PATTERNS'));

function answersFromPreset(p) {
  return {
    purpose: p.purpose || '', target: Array.isArray(p.target) ? p.target.join(', ') : (p.target || ''),
    mvp_features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''),
    data_entities: p.entities || '', frontend: p.frontend || '', backend: p.backend || '',
    database: p.database || '', auth: p.auth || '', orm: p.orm || '', deploy: p.deploy || '',
    payment: p.payment || '', mobile: p.mobile || '', scale: p.scale || 'medium',
    ai_auto: p.ai_auto || '', ai_tools: p.ai_tools || '', org_model: p.org_model || '',
  };
}

// pick a real preset per domain (robust to preset renames)
function presetForDomain(domain) {
  const key = Object.keys(PR).find(k => detectDomain(PR[k].purpose || '') === domain);
  return key ? PR[key] : null;
}

describe('v9.34: 全プリセット掃引で発見したundefined漏出の回帰ガード', () => {
  // domains whose rateLimits entry uses a non-standard critical-op key (old fallback chain missed them)
  const RATE_LIMIT_DOMAINS = ['ai', 'marketplace', 'iot', 'booking', 'automation', 'devtool'];

  for (const domain of RATE_LIMIT_DOMAINS) {
    test('docs/53 重要操作が undefined にならない (' + domain + ')', () => {
      const p = presetForDomain(domain);
      assert.ok(p, 'no preset maps to domain ' + domain + ' — update RATE_LIMIT_DOMAINS');
      for (const lang of ['ja', 'en']) {
        const f = generate(answersFromPreset(p), 'T', lang);
        const d53 = f['docs/53_ops_runbook.md'] || '';
        assert.ok(d53.length > 0, 'docs/53 must exist');
        assert.ok(!/:\s*undefined\b/.test(d53), '[' + lang + '] docs/53 renders ": undefined"');
        const label = lang === 'ja' ? '重要操作' : 'Critical Operations';
        const line = d53.split('\n').find(l => l.includes(label));
        assert.ok(line, '[' + lang + '] critical-ops line must exist');
        assert.match(line, /: .+/, '[' + lang + '] critical-ops line must have a value');
      }
    });
  }

  test('docs/44 STRIDE表: ファイル列持ちエンティティの R 列が undefined にならない', () => {
    const key = Object.keys(PR).find(k => /(^|,\s*)Product(,|$)/.test(PR[k].entities || ''));
    assert.ok(key, 'no preset with a Product entity — pick another file-column entity');
    for (const lang of ['ja', 'en']) {
      const f = generate(answersFromPreset(PR[key]), 'T', lang);
      const d44 = f['docs/44_threat_model.md'] || '';
      assert.ok(d44.includes('| Product |'), '[' + lang + '] STRIDE table must include Product row');
      assert.ok(!/\bundefined\b/.test(d44), '[' + lang + '] docs/44 must not render undefined');
    }
  });

  test('STRIDE_PATTERNS 全パターンが S/T/R/I/D/E 6キー完備', () => {
    for (const [name, pat] of Object.entries(STRIDE_PATTERNS)) {
      for (const k of ['S', 'T', 'R', 'I', 'D', 'E']) {
        assert.ok(pat[k], 'STRIDE_PATTERNS.' + name + ' missing key ' + k);
      }
    }
  });
});
