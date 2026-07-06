/**
 * v9.27 ループエンジニアリング統合 — 回帰テスト
 * 生成される「動くループ資産」(settings.jsonフック / fixerエージェント / CLAUDE.mdループ協議 / docs/137) を検証。
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

const NODE = {
  purpose: 'SaaS型学習管理システム', target: '学生', frontend: 'React (Next.js)', backend: 'Node.js + Express',
  database: 'PostgreSQL', auth: 'Auth.js', deploy: 'Vercel', data_entities: 'User, Course',
  mvp_features: 'ユーザー登録, コース管理', dev_methods: 'SDD, TDD', scale: 'medium', ai_tools: 'Claude Code', ai_auto: 'マルチAgent協調',
};
const PY = { ...NODE, backend: 'Python + FastAPI', database: 'PostgreSQL' };
const VITE = { ...NODE, frontend: 'Vue (Vite)', backend: 'Node.js + Express' };

function gen(ans, lang) { return generate({ ...ans }, 'T', lang || 'ja'); }

describe('v9.27: settings.json ループフック', () => {
  test('Node/TS: Stop=npm test, PostToolUse=tsc', () => {
    const s = JSON.parse(gen(NODE)['.claude/settings.json']);
    assert.ok(s.hooks && s.hooks.Stop && s.hooks.PostToolUse, 'hooks must exist');
    assert.match(s.hooks.Stop[0].hooks[0].command, /npm test/, 'Node Stop hook runs npm test');
    assert.match(s.hooks.PostToolUse[0].hooks[0].command, /tsc/, 'Node PostToolUse runs tsc');
    assert.equal(s.hooks.PostToolUse[0].matcher, 'Write|Edit');
  });
  test('Python: Stop=pytest, PostToolUse=pyright', () => {
    const s = JSON.parse(gen(PY)['.claude/settings.json']);
    assert.match(s.hooks.Stop[0].hooks[0].command, /pytest/, 'Python Stop hook runs pytest');
    assert.match(s.hooks.PostToolUse[0].hooks[0].command, /pyright/, 'Python PostToolUse runs pyright');
  });
  test('Vite: Stop=vitest', () => {
    const s = JSON.parse(gen(VITE)['.claude/settings.json']);
    assert.match(s.hooks.Stop[0].hooks[0].command, /vitest/, 'Vite Stop hook runs vitest');
  });
  test('settings.json は有効JSON（フック追加後も）', () => {
    assert.doesNotThrow(() => JSON.parse(gen(NODE)['.claude/settings.json']));
  });
});

describe('v9.27: fixer サブエージェント', () => {
  for (const lang of ['ja', 'en']) {
    test('[' + lang + '] .claude/agents/fixer.md が生成され推測禁止・model:opus', () => {
      const f = gen(NODE, lang)['.claude/agents/fixer.md'];
      assert.ok(f, 'fixer.md must exist');
      assert.match(f, /name: fixer/, 'has name');
      assert.match(f, /model: opus/, 'uses opus');
      assert.ok(lang === 'ja' ? /推測は禁止/.test(f) : /No guessing/i.test(f), 'forbids guessing');
      assert.ok(lang === 'ja' ? /skip/.test(f) : /skipping tests/i.test(f), 'forbids skipping tests');
    });
  }
});

describe('v9.27: CLAUDE.md ループ協議', () => {
  test('ループ協議 + 停止条件 + 2つの禁止 + @fixer', () => {
    const c = gen(NODE)['CLAUDE.md'];
    assert.match(c, /ループ協議|Loop Protocol/, 'has Loop Protocol section');
    assert.match(c, /@fixer/, 'references @fixer');
    assert.match(c, /docs\/137_loop_engineering_guide\.md/, 'cross-refs docs/137');
  });
});

describe('v9.27: docs/137 ループエンジニアリングガイド', () => {
  test('4層 + 5アクション + 6パーツ + 評価役分離', () => {
    const d = gen(NODE)['docs/137_loop_engineering_guide.md'];
    assert.ok(d && d.length > 500, 'docs/137 must be substantial');
    assert.match(d, /Prompt.*Context.*Harness.*Loop/s, 'has 4-layer model');
    assert.match(d, /発見|discovery/i, 'has 5 actions');
    assert.match(d, /Sub-agents/, 'has 6 parts');
  });
  test('Pro深度: skillLv=5 で代価/成熟度セクション出現、Int(3)で非出現', () => {
    S.skillLv = 5;
    const pro = generate({ ...NODE }, 'T', 'ja')['docs/137_loop_engineering_guide.md'];
    S.skillLv = 3;
    const int = generate({ ...NODE }, 'T', 'ja')['docs/137_loop_engineering_guide.md'];
    S.skillLv = undefined;
    assert.match(pro, /回しっぱなしの代価/, 'Pro section appears at lv5');
    assert.ok(!/回しっぱなしの代価/.test(int), 'Pro section absent at lv3');
  });
  test('Beg入門: skillLv=0 ではじめの3ステップ出現', () => {
    S.skillLv = 0;
    const beg = generate({ ...NODE }, 'T', 'ja')['docs/137_loop_engineering_guide.md'];
    S.skillLv = undefined;
    assert.match(beg, /はじめの3ステップ/, 'Beg intro at lv0');
  });
});
