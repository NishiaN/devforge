/**
 * v9.35 列挙生成検査の横展開（xref/Mermaid/フェンス）— 回帰テスト
 * 5330生成の全数掃引で発見した3クラスの実バグの回帰ガード:
 *  - docs/33 (p5) / docs/43 (p12): 閉じフェンス '```' の直前に改行が無く
 *    コード行末に連結 → 行頭に来ずフェンスとして機能しない（全生成で再現）
 *  - docs/84 (p21): 閉じフェンスがエンティティループ内にあり、1体目の後で
 *    YAMLブロックが閉じ、2体目のpathsがフェンス外に露出（全生成で再現）
 *  - C14 _validStarts に mindmap 欠落 → docs/30/56/59 の有効な mindmap 図を
 *    「Mermaid構文異常」と誤警告（~12,000ヒット）
 *  - C13 が docs/82 参照を誤検出（82は監査後に生成される設計 → 監査時点で常に未存在）
 *  - 回答キー誤用: a.entities / a.features は生成フローでは常に undefined
 *    （正キーは data_entities / mvp_features）→ docs/84 が常に User/Post 固定、
 *    docs/87 テーブル定義例・docs/91 フィクスチャが全生成でサイレント欠落、
 *    docs/107 DEC-009 が payment='none'(EN小文字) で存在しない docs/38 を参照
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

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

function fenceLineCount(raw) {
  return String(raw).split('\n').filter(l => /^\s{0,3}(`{3,}|~{3,})/.test(l)).length;
}

describe('v9.35: 生成md構造の健全性（フェンス/Mermaid/xref）', () => {
  for (const lang of ['ja', 'en']) {
    test('[' + lang + '] 全生成mdのコードフェンスが偶数（閉じ忘れゼロ）', () => {
      const f = generate(answersFromPreset(PR.saas), 'T', lang);
      const odd = [];
      for (const [p, c] of Object.entries(f)) {
        if (!p.endsWith('.md')) continue;
        const n = fenceLineCount(c);
        if (n % 2 !== 0) odd.push(p + ' (fences=' + n + ')');
      }
      assert.deepEqual(odd, [], 'md files with unclosed code fence: ' + odd.join(', '));
    });

    test('[' + lang + '] docs/84: 全エンティティのpathsがYAMLフェンス内に収まる', () => {
      const a = answersFromPreset(PR.saas);
      const f = generate(a, 'T', lang);
      const doc = f['docs/84_openapi_specification.md'] || '';
      const open = doc.indexOf('```yaml');
      const close = doc.indexOf('\n```\n', open);
      assert.ok(open >= 0 && close > open, 'docs/84 must have a closed yaml block');
      const inside = doc.slice(open, close);
      const ents = a.data_entities.split(',').map(s => s.trim()).filter(Boolean).slice(0, 2);
      assert.equal(ents.length, 2, 'saas preset must have 2+ entities');
      for (const ent of ents) {
        assert.ok(inside.includes('  /' + ent.toLowerCase() + 's:'),
          '[' + lang + '] path for ' + ent + ' must be inside the yaml fence');
      }
      assert.ok(!/^\s{2}\/\w+s?:/m.test(doc.slice(close + 5)),
        '[' + lang + '] no YAML path lines may leak after the closing fence');
    });
  }

  test('postGenerationAudit: 実生成物に対し mindmap 誤警告と docs/82 xref 誤警告が出ない', () => {
    const a = answersFromPreset(PR.saas);
    const f = generate(a, 'T', 'ja');
    // saas 実生成物は mindmap 図 (docs/56, docs/59) と docs/82 参照 (docs/00系) を含む
    assert.ok(/```mermaid\s*\nmindmap/.test(f['docs/56_market_positioning.md'] || ''), 'premise: docs/56 has mindmap');
    assert.ok(Object.values(f).some(c => String(c).includes('82_architecture_integrity_check.md')), 'premise: docs/82 is referenced');
    const findings = postGenerationAudit(f, a);
    const mmd = findings.filter(x => /Mermaid/.test(x.msg));
    assert.deepEqual(mmd.map(x => x.msg), [], 'no Mermaid false positives on valid output');
    const x82 = findings.filter(x => String(x.msg).includes('82_architecture_integrity_check'));
    assert.deepEqual(x82.map(x => x.msg), [], 'docs/82 (built after audit) must not be flagged as broken xref');
  });

  test('docs/84: スキーマがプロジェクトの実エンティティを反映する（User/Post固定でない）', () => {
    const a = answersFromPreset(PR.saas); // entities: User, Team, Subscription, ...
    const f = generate(a, 'T', 'ja');
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('    Team:'), 'Team schema must be generated from data_entities');
    assert.ok(doc.includes('  /teams:'), 'paths must use the 2nd real entity (Team), not fallback Post');
    assert.ok(!doc.includes('  /posts:'), 'fallback User/Post paths must not appear when entities are defined');
  });

  test('docs/87: エンティティ別テーブル定義例が欠落しない（a.entitiesキー誤用の回帰）', () => {
    // section renders only for non-BaaS non-Mongo backends with entities
    const key = Object.keys(PR).find(k => (PR[k].entities || '').includes(',') &&
      !/Supabase|Firebase|Convex/i.test(PR[k].backend || '') && !/Mongo/i.test(PR[k].database || ''));
    assert.ok(key, 'need a non-BaaS preset with entities');
    const f = generate(answersFromPreset(PR[key]), 'T', 'ja');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('エンティティ別テーブル定義例'), 'entity table definition section must render (preset: ' + key + ')');
  });

  test('docs/91: エンティティ別テストフィクスチャが欠落しない（a.entitiesキー誤用の回帰)', () => {
    const f = generate(answersFromPreset(PR.saas), 'T', 'ja');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(/fixture|フィクスチャ/i.test(doc), 'entity fixture section must render');
  });

  test('docs/107: payment=none(EN小文字) の DEC-009 が docs/38 を参照しない', () => {
    const key = Object.keys(PR).find(k => /^(none|なし)$/i.test(PR[k].payment || ''));
    assert.ok(key, 'need a preset with payment none');
    for (const lang of ['ja', 'en']) {
      const f = generate(answersFromPreset(PR[key]), 'T', lang);
      const doc = f['docs/107_project_governance.md'] || '';
      const dec9 = doc.split('\n').find(l => l.includes('DEC-009')) || '';
      assert.ok(!dec9.includes('38_business_model'),
        '[' + lang + '] DEC-009 must not point to docs/38 when payment is none');
    }
  });

  test('postGenerationAudit: C13/C14 検出器自体は引き続き機能する', () => {
    const a = answersFromPreset(PR.saas);
    const f = generate(a, 'T', 'ja');
    f['docs/98_bad_probe.md'] = '```mermaid\nnotadiagram X-->Y\n```\n\n```mermaid\n\n```\n\nsee docs/99_missing_probe.md\n';
    const findings = postGenerationAudit(f, a);
    assert.ok(findings.some(x => /Mermaid/.test(x.msg) && x.msg.includes('docs/98_bad_probe.md')),
      'C14 must still flag invalid/empty mermaid blocks');
    assert.ok(findings.some(x => x.msg.includes('docs/99_missing_probe.md')),
      'C13 must still flag genuinely broken cross-references');
  });
});
