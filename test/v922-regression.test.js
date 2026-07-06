/**
 * v9.22 信頼性ファーストバッチ — 回帰テスト
 * Phase A: MCP実在パッケージ / Claude Code手順 / detectDomain ML / coverageThreshold / Vitest分岐 /
 *          Stripe例示 / エンティティフォールバック / .cursor/rules現行形式
 * Phase B: EN 5テンプレート共有ブロック / JP-in-EN解消
 * ~24 tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

global.S = {
  genLang: 'ja', files: {}, lang: 'ja', answers: {},
  skill: 'intermediate', skillLv: 3, preset: 'custom', projectName: 'T',
  phase: 1, step: 0, skipped: [], editedFiles: {}, prevFiles: {}, previewFile: null, pillar: 0,
};
const save = () => {};
const _lsGet = () => null;
const _lsSet = () => {};
const _lsRm = () => {};
const sanitize = v => v;

eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p3-mcp.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p4-airules.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p23-testing.js', 'utf-8'));

const A_BASE = {
  purpose: '学習管理システム', frontend: 'React (Next.js)', backend: 'Supabase',
  database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth', deploy: 'Vercel',
  data_entities: 'User, Course', mvp_features: 'ユーザー登録', dev_methods: 'TDD', scale: 'medium',
};

/* ═══ A-1〜A-3: MCP ═══ */
describe('v9.22 A-1〜3: MCP実在パッケージ・手順', () => {
  test('mcp-config.json は実在パッケージ名のみ使用', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar3_MCP(A_BASE, 'TestP');
    const cfg = S.files['mcp-config.json'];
    assert.ok(cfg, 'mcp-config.json should exist');
    assert.ok(!cfg.includes('@anthropic/mcp-context7'), 'non-existent @anthropic/mcp-context7 must not appear');
    assert.ok(!cfg.includes('@anthropic/mcp-playwright'), 'non-existent @anthropic/mcp-playwright must not appear');
    assert.ok(cfg.includes('@upstash/context7-mcp'), 'should use @upstash/context7-mcp');
    assert.ok(cfg.includes('@playwright/mcp'), 'should use @playwright/mcp');
  });

  test('Supabase MCP は @supabase/mcp-server-supabase', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar3_MCP(A_BASE, 'TestP');
    const cfg = S.files['mcp-config.json'];
    assert.ok(!cfg.includes('@modelcontextprotocol/server-supabase'), 'old supabase package must not appear');
    assert.ok(cfg.includes('@supabase/mcp-server-supabase'), 'should use @supabase/mcp-server-supabase');
  });

  test('README は .mcp.json / claude mcp add を案内 (旧 ~/.config/claude 廃止)', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar3_MCP(A_BASE, 'TestP');
    const readme = S.files['.mcp/README.md'];
    assert.ok(readme, '.mcp/README.md should exist');
    assert.ok(!readme.includes('~/.config/claude/mcp-config.json'), 'old config path must not appear');
    assert.ok(readme.includes('.mcp.json'), 'should mention .mcp.json');
    assert.ok(readme.includes('claude mcp add'), 'should mention claude mcp add CLI');
  });

  test('エスケープバグ解消: 生JS式が出力に混入しない', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar3_MCP({ ...A_BASE, backend: 'Node.js + Express', database: 'PostgreSQL' }, 'TestP');
    const readme = S.files['.mcp/README.md'];
    assert.ok(!readme.includes("${(a.database||'')"), 'unevaluated JS expression must not leak into output');
  });
});

/* ═══ A-4〜A-6: AIルール現行形式 ═══ */
describe('v9.22 A-4〜6: AIルール現行形式', () => {
  test('.cursor/rules/main.mdc (frontmatter付) + .cursorrules 両生成', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar4_AIRules(A_BASE, 'TestP');
    assert.ok(S.files['.cursor/rules/main.mdc'], '.cursor/rules/main.mdc should exist');
    assert.ok(S.files['.cursor/rules/main.mdc'].startsWith('---'), 'main.mdc should start with frontmatter');
    assert.ok(S.files['.cursor/rules/main.mdc'].includes('alwaysApply: true'), 'frontmatter should have alwaysApply');
    assert.ok(S.files['.cursorrules'], 'legacy .cursorrules should also exist (referenced by guide/export)');
  });

  test('CLAUDE.md は自動読込を主張しない (手動@参照を案内)', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar4_AIRules(A_BASE, 'TestP');
    const claude = S.files['CLAUDE.md'];
    assert.ok(!claude.includes('自動読み込みします'), 'must not claim auto-loading');
    assert.ok(claude.includes('@.claude/rules/'), 'should instruct manual @-reference');
  });

  test('Stripe価格は例示明記 + EN出力は$表記', () => {
    S.files = {}; S.genLang = 'en';
    genPillar4_AIRules({ ...A_BASE, payment: 'Stripe' }, 'TestP');
    const brief = S.files['AI_BRIEF.md'];
    assert.ok(brief.includes('example pricing'), 'EN brief should mark pricing as example');
    assert.ok(!/Plans.*¥980/.test(brief), 'EN brief must not use ¥ pricing');
    S.genLang = 'ja';
  });
});

/* ═══ A-9: detectDomain ML ═══ */
describe('v9.22 A-9: detectDomain 機械学習→ai', () => {
  test('機械学習/深層学習/MLOps は ai (education誤検出解消)', () => {
    assert.equal(detectDomain('機械学習モデル管理基盤'), 'ai');
    assert.equal(detectDomain('深層学習による画像解析'), 'ai');
    assert.equal(detectDomain('machine learning pipeline platform'), 'ai');
    assert.equal(detectDomain('MLOps基盤の構築'), 'ai');
    assert.equal(detectDomain('異常検知システム'), 'ai');
  });

  test('education は引き続き正しく検出', () => {
    assert.equal(detectDomain('オンライン学習プラットフォーム'), 'education');
    assert.equal(detectDomain('社員教育管理システム'), 'education');
  });

  test('臨床試験×機械学習 は health 優先を維持', () => {
    assert.equal(detectDomain('臨床試験データの機械学習解析'), 'health');
  });
});

/* ═══ A-15: getEntityColumns フォールバック ═══ */
describe('v9.22 A-15: 未知エンティティのカラム合成', () => {
  test('未知エンティティは最低限の実カラムを返す (空配列でない)', () => {
    const cols = getEntityColumns('FooBarBaz123Unknown', true, []);
    assert.ok(cols.length >= 3, 'should synthesize at least name/description/status');
    assert.ok(cols.some(c => c.col === 'name'), 'should include name column');
    assert.ok(cols.some(c => c.col === 'status'), 'should include status column');
  });

  test('ヒューリスティック: Log系はoccurred_at / 金額系はamount', () => {
    assert.ok(getEntityColumns('ShipmentLog', true, []).some(c => c.col === 'occurred_at'));
    assert.ok(getEntityColumns('CustomFee', true, []).some(c => c.col === 'amount'));
  });

  test('User既知ならFK(user_id)を付与', () => {
    const cols = getEntityColumns('UnknownWidget', true, ['User']);
    assert.ok(cols.some(c => c.col === 'user_id' && c.constraint.includes('FK(User)')));
  });

  test('既知エンティティは従来通り (フォールバック非適用)', () => {
    const cols = getEntityColumns('User', true, []);
    assert.ok(cols.some(c => c.col === 'email'), 'known entity keeps its real definition');
  });
});

/* ═══ A-7/A-8: coverageThreshold + Vitest分岐 ═══ */
describe('v9.22 A-7〜8: Jest/Vitest設定', () => {
  test('Jest設定は coverageThreshold (単数形; 複数形は無効キー)', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar23_TestingIntelligence({ ...A_BASE, frontend: 'React (Next.js)' }, 'TestP');
    const doc = S.files['docs/92_coverage_design.md'];
    assert.ok(doc.includes('coverageThreshold:'), 'should use singular coverageThreshold');
    assert.ok(!doc.includes('coverageThresholds:'), 'plural form (silently ignored by Jest) must not appear');
  });

  test('Vite系FEは vitest.config.ts + vitest-runner を生成', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar23_TestingIntelligence({ ...A_BASE, frontend: 'Vue (Vite)' }, 'TestP');
    const doc = S.files['docs/92_coverage_design.md'];
    assert.ok(doc.includes('vitest.config.ts'), 'should generate vitest config for Vite FE');
    assert.ok(doc.includes('@stryker-mutator/vitest-runner'), 'should use vitest-runner for Stryker');
  });

  test('カバレッジ閾値は 80/75/85 に統一', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar23_TestingIntelligence({ ...A_BASE, frontend: 'React (Next.js)' }, 'TestP');
    const doc = S.files['docs/92_coverage_design.md'];
    assert.ok(doc.includes('branches: 75') && doc.includes('functions: 85'), 'thresholds should match documented 80/75/85');
  });
});

/* ═══ B: EN整合性 (ソース静的検証) ═══ */
describe('v9.22 B: EN整合性', () => {
  const launcherSrc = fs.readFileSync('src/ui/launcher.js', 'utf-8');

  test('B-1: 5テンプレートは共有Object.assignブロックに存在 (ENでも利用可能)', () => {
    const sharedIdx = launcherSrc.indexOf('Object.assign(PT,{');
    assert.ok(sharedIdx > 0, 'shared template block should exist');
    const shared = launcherSrc.slice(sharedIdx);
    ['enterprise_arch', 'workflow_audit', 'incident_postmortem', 'capacity_plan', 'sla_review'].forEach(k => {
      assert.ok(shared.includes(k + ':{'), k + ' should be in shared block');
    });
  });

  test('B-3: launcher参照の文書名が旧名を含まない', () => {
    ['docs/99_db_performance_tuning', 'docs/100_cache_strategy', 'docs/101_frontend_performance',
     'docs/104_metrics_collection', 'docs/105_log_pipeline', 'docs/106_alerting_runbook',
     'docs/14_risks.md', 'docs/88_query_optimization.md', 'docs/43_security_architecture'].forEach(bad => {
      assert.ok(!launcherSrc.includes(bad), bad + ' must not be referenced');
    });
  });

  test('B-2: p5-quality に JP-in-EN が残っていない', () => {
    const p5 = fs.readFileSync('src/generators/p5-quality.js', 'utf-8');
    assert.ok(!p5.includes("G?'に記録':'に記録'"), 'に記録 EN leak fixed');
    assert.ok(!p5.includes("G?'に追加':'に追加'"), 'に追加 EN leak fixed');
  });
});
