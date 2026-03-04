const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

global.S = { genLang: 'ja', lang: 'ja', files: {}, answers: {}, skill: 'intermediate', skillLv: 3 };

eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p1-sdd.js', 'utf-8'));

const BASE_ANSWERS = {
  purpose: 'タスク管理SaaSアプリを開発する',
  frontend: 'React + Next.js',
  backend: 'Node.js + Express',
  database: 'PostgreSQL',
  auth: 'Supabase Auth',
  data_entities: 'User, Task, Team, Comment',
  mvp_features: 'タスク作成, ユーザー認証, チーム管理',
  deploy: 'Railway',
  scale: 'medium',
  payment: 'Stripe',
};

describe('Pillar ① SDD 仕様書生成', () => {

  test('constitution.md が生成される', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['.spec/constitution.md'], '.spec/constitution.md should be generated');
    assert.ok(S.files['.spec/constitution.md'].length > 200, 'constitution.md should be non-empty');
  });

  test('specification.md が生成される', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['.spec/specification.md'], '.spec/specification.md should be generated');
    assert.ok(S.files['.spec/specification.md'].length > 200, 'specification.md should be non-empty');
  });

  test('technical-plan.md が生成される', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['.spec/technical-plan.md'], '.spec/technical-plan.md should be generated');
    assert.ok(S.files['.spec/technical-plan.md'].length > 200, 'technical-plan.md should be non-empty');
  });

  test('tasks.md が生成される', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['.spec/tasks.md'], '.spec/tasks.md should be generated');
    assert.ok(S.files['.spec/tasks.md'].length > 50, 'tasks.md should be non-empty');
  });

  test('verification.md が生成される', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['.spec/verification.md'], '.spec/verification.md should be generated');
  });

  test('constitution.md にプロジェクト名が含まれる', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'MyTaskApp');
    const doc = S.files['.spec/constitution.md'];
    assert.ok(doc.includes('MyTaskApp'), 'constitution.md should include project name');
  });

  test('specification.md にエンティティリストが含まれる', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    const doc = S.files['.spec/specification.md'];
    assert.ok(
      doc.includes('User') || doc.includes('Task'),
      'specification.md should include entity names'
    );
  });

  test('specification.md に認証情報が含まれる', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    const doc = S.files['.spec/specification.md'];
    assert.ok(
      doc.includes('Auth') || doc.includes('認証') || doc.includes('auth'),
      'specification.md should include auth information'
    );
  });

  test('English mode: constitution.md が英語で生成される', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar1_SDD({ ...BASE_ANSWERS, purpose: 'Build a task management SaaS app' }, 'TestProject');
    const doc = S.files['.spec/constitution.md'];
    assert.ok(doc, 'constitution.md should be generated in English mode');
    S.genLang = 'ja';
  });

  test('5つの .spec ファイルがすべて生成される', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    const specFiles = ['.spec/constitution.md', '.spec/specification.md', '.spec/technical-plan.md', '.spec/tasks.md', '.spec/verification.md'];
    specFiles.forEach(f => {
      assert.ok(S.files[f], `${f} should be generated`);
    });
  });

  test('Stripe決済あり: specification.md に payment 情報が含まれる', () => {
    S.files = {};
    genPillar1_SDD({ ...BASE_ANSWERS, payment: 'Stripe' }, 'PayProject');
    const doc = S.files['.spec/specification.md'];
    assert.ok(
      doc.includes('Stripe') || doc.includes('決済') || doc.includes('payment'),
      'specification.md should reference Stripe payment'
    );
  });

  test('technical-plan.md に技術スタック情報が含まれる', () => {
    S.files = {};
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    const doc = S.files['.spec/technical-plan.md'];
    assert.ok(
      doc.includes('Next.js') || doc.includes('React') || doc.includes('Express') || doc.includes('PostgreSQL'),
      'technical-plan.md should contain tech stack info'
    );
  });

  test('verification.md §6: fintechドメインで不変条件テーブルが生成される', () => {
    S.files = {};
    S.skillLv = 3;
    genPillar1_SDD({ ...BASE_ANSWERS, purpose: '送金・決済処理fintechサービス' }, 'FintechApp');
    const doc = S.files['.spec/verification.md'];
    assert.ok(doc, 'verification.md should be generated');
    assert.ok(
      doc.includes('Domain Invariants') || doc.includes('ドメイン不変条件'),
      'verification.md should contain domain invariants section for fintech'
    );
    assert.ok(
      doc.includes('property-based') || doc.includes('Balance') || doc.includes('残高'),
      'verification.md should contain invariant content for fintech'
    );
  });

  test('verification.md §6: toolドメインでは不変条件セクションが生成されない', () => {
    S.files = {};
    S.skillLv = 3;
    genPillar1_SDD({ ...BASE_ANSWERS, purpose: '汎用ユーティリティツール' }, 'ToolApp');
    const doc = S.files['.spec/verification.md'];
    assert.ok(doc, 'verification.md should be generated');
    const hasInvariantSec = doc.includes('Domain Invariants') || doc.includes('ドメイン不変条件');
    assert.ok(!hasInvariantSec, 'tool domain should NOT have domain invariants section');
  });

  test('verification.md §7: クロスリファレンスマップが常時生成される', () => {
    S.files = {};
    S.skillLv = 3;
    genPillar1_SDD(BASE_ANSWERS, 'TestProject');
    const doc = S.files['.spec/verification.md'];
    assert.ok(
      doc.includes('Cross-Reference Map') || doc.includes('クロスリファレンスマップ'),
      'verification.md should contain cross-reference map section'
    );
    assert.ok(
      doc.includes('docs/32_qa_blueprint') || doc.includes('docs/91_testing_strategy'),
      'cross-reference map should link to QA documents'
    );
  });

  test('verification.md §6 Pro: fast-check property-based test例が生成される (skillLv=5)', () => {
    S.files = {};
    S.skillLv = 5;
    genPillar1_SDD({ ...BASE_ANSWERS, purpose: '送金・決済処理fintechサービス' }, 'FintechPro');
    const doc = S.files['.spec/verification.md'];
    assert.ok(doc, 'verification.md should be generated');
    assert.ok(
      doc.includes('fast-check') || doc.includes('fc.assert'),
      'Pro mode verification.md should include fast-check property-based test example'
    );
  });

  test('invariants.test.ts: 高リスクドメイン(fintech)でtest/invariants.test.tsが生成される', () => {
    S.files = {};
    S.skillLv = 3;
    genPillar1_SDD({ ...BASE_ANSWERS, purpose: '送金・決済処理fintechサービス' }, 'FintechApp');
    assert.ok(
      S.files['test/invariants.test.ts'],
      'test/invariants.test.ts should be generated for fintech domain'
    );
    const inv = S.files['test/invariants.test.ts'];
    assert.ok(
      inv.includes('describe') && (inv.includes('fintech') || inv.includes('Domain Invariants')),
      'invariants.test.ts should contain describe block with domain name'
    );
    assert.ok(
      inv.includes('fast-check') || inv.includes('fc'),
      'invariants.test.ts should import fast-check'
    );
  });

  test('invariants.test.ts: 汎用ドメイン(tool)ではtest/invariants.test.tsが生成されない', () => {
    S.files = {};
    S.skillLv = 3;
    genPillar1_SDD({ ...BASE_ANSWERS, purpose: '汎用ユーティリティツール' }, 'ToolApp');
    assert.ok(
      !S.files['test/invariants.test.ts'],
      'test/invariants.test.ts should NOT be generated for generic tool domain'
    );
  });

});
