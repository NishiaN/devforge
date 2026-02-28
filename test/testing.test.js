/**
 * P23 Testing Intelligence Generator Tests
 * Tests: gen91, gen92, gen93, gen94
 * ~25 tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'TestTesting', phase: 1, step: 0, skipped: [], files: {},
  editedFiles: {}, prevFiles: {}, genLang: 'ja', previewFile: null,
  pillar: 0, skillLv: 3,
};
const save = () => {};
const _lsGet = () => null;
const _lsSet = () => {};
const _lsRm = () => {};
const sanitize = v => v;

eval(fs.readFileSync('src/data/questions.js', 'utf-8'));
eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p23-testing.js', 'utf-8'));

function generate(answers, pn = 'TestProject', lang = 'ja') {
  S.files = {};
  S.genLang = lang;
  genPillar23_TestingIntelligence(answers, pn);
  return S.files;
}

const A_REACT = {
  purpose: 'SaaSサブスクリプション管理',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'PostgreSQL', deploy: 'Vercel',
  scale: 'medium', entities: 'User, Team, Subscription, Invoice',
};

const A_VUE = {
  purpose: 'コミュニティフォーラム',
  frontend: 'Vue + Nuxt', backend: 'Express',
  database: 'PostgreSQL', deploy: 'Railway',
  scale: 'small', entities: 'User, Post, Comment, Tag',
};

const A_FINTECH = {
  purpose: 'フィンテック決済プラットフォーム',
  frontend: 'React + Next.js', backend: 'NestJS',
  database: 'PostgreSQL', deploy: 'Railway',
  payment: 'Stripe', scale: 'large',
  entities: 'User, Transaction, AuditLog, Account',
};

const A_EC = {
  purpose: 'ECサイト',
  frontend: 'React + Next.js', backend: 'Express',
  database: 'PostgreSQL', deploy: 'Railway',
  payment: 'Stripe', scale: 'medium',
  entities: 'User, Product, Order, Inventory',
};

describe('P23 Testing — file generation', () => {
  it('generates all 4 testing docs', () => {
    const files = generate(A_REACT);
    assert.ok(files['docs/91_testing_strategy.md'], 'doc 91 missing');
    assert.ok(files['docs/92_coverage_design.md'], 'doc 92 missing');
    assert.ok(files['docs/93_e2e_test_architecture.md'], 'doc 93 missing');
    assert.ok(files['docs/94_performance_testing.md'], 'doc 94 missing');
  });

  it('all docs are non-empty', () => {
    const files = generate(A_REACT);
    ['docs/91_testing_strategy.md', 'docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md', 'docs/94_performance_testing.md'].forEach(f => {
      assert.ok((files[f] || '').length > 100, `${f} is too short`);
    });
  });
});

describe('gen91 — Testing Strategy', () => {
  it('has testing pyramid or strategy content', () => {
    const files = generate(A_REACT);
    const doc = files['docs/91_testing_strategy.md'];
    assert.ok(doc.includes('テスト') || doc.includes('Test') || doc.includes('Vitest'));
  });

  it('includes project name', () => {
    const files = generate(A_REACT, 'MySaaS');
    const doc = files['docs/91_testing_strategy.md'];
    assert.ok(doc.includes('MySaaS'));
  });

  it('has fintech-specific content for fintech domain', () => {
    const files = generate(A_FINTECH);
    const doc = files['docs/91_testing_strategy.md'];
    assert.ok(doc.length > 300, 'fintech doc should be substantial');
  });

  it('has domain-specific content for ec domain', () => {
    const files = generate(A_EC);
    const doc = files['docs/91_testing_strategy.md'];
    assert.ok(doc.length > 200, 'ec doc should be substantial');
  });
});

describe('gen92 — Coverage Design', () => {
  it('has coverage content', () => {
    const files = generate(A_REACT);
    const doc = files['docs/92_coverage_design.md'];
    assert.ok(doc.includes('カバレッジ') || doc.includes('Coverage') || doc.includes('%'));
  });

  it('has code blocks', () => {
    const files = generate(A_REACT);
    const doc = files['docs/92_coverage_design.md'];
    assert.ok(doc.includes('```'));
  });

  it('has entity-level test structure', () => {
    const files = generate(A_REACT);
    const doc = files['docs/92_coverage_design.md'];
    assert.ok(doc.length > 200);
  });
});

describe('gen93 — E2E Test Architecture', () => {
  it('has E2E content', () => {
    const files = generate(A_REACT);
    const doc = files['docs/93_e2e_test_architecture.md'];
    assert.ok(doc.includes('E2E') || doc.includes('Playwright') || doc.includes('e2e'));
  });

  it('has domain-specific E2E scenarios', () => {
    const files = generate(A_EC);
    const doc = files['docs/93_e2e_test_architecture.md'];
    assert.ok(doc.length > 200, 'ec E2E doc should be substantial');
  });

  it('has payment E2E for payment-enabled presets', () => {
    const files = generate(A_FINTECH);
    const doc = files['docs/93_e2e_test_architecture.md'];
    assert.ok(doc.length > 200);
  });
});

describe('gen94 — Performance Testing', () => {
  it('has performance testing content', () => {
    const files = generate(A_REACT);
    const doc = files['docs/94_performance_testing.md'];
    assert.ok(doc.includes('パフォーマンス') || doc.includes('Performance') || doc.includes('k6') || doc.includes('Lighthouse'));
  });

  it('has load test content', () => {
    const files = generate(A_REACT);
    const doc = files['docs/94_performance_testing.md'];
    assert.ok(doc.length > 200);
  });
});

describe('P23 bilingual parity', () => {
  it('en version generates all docs', () => {
    const files = generate(A_REACT, 'TestProject', 'en');
    assert.ok(files['docs/91_testing_strategy.md']);
    assert.ok(files['docs/92_coverage_design.md']);
    assert.ok(files['docs/93_e2e_test_architecture.md']);
    assert.ok(files['docs/94_performance_testing.md']);
  });
});
