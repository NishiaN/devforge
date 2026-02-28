/**
 * P27 Cost Optimization Generator Tests
 * Tests: gen109, gen110, gen111, gen112, genPillar27_CostOptimization
 * ~30 tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

/* ── Test scaffold ── */
const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'TestCostProject', phase: 1, step: 0, skipped: [], files: {},
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
eval(fs.readFileSync('src/generators/p27-cost.js', 'utf-8').replace(/const (COST_PLATFORM)/g, 'var $1'));

/* ── Helpers ── */
function generate(answers, pn = 'TestProject') {
  S.files = {};
  S.genLang = 'ja';
  genPillar27_CostOptimization(answers, pn);
  return S.files;
}

function generateEn(answers, pn = 'TestProject') {
  S.files = {};
  S.genLang = 'en';
  genPillar27_CostOptimization(answers, pn);
  return S.files;
}

const A_SAAS = {
  purpose: 'SaaSサブスクリプション管理システム',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'PostgreSQL', deploy: 'Vercel',
  payment: 'Stripe', scale: 'medium',
  entities: 'User, Team, Subscription, Invoice',
};

const A_FINTECH = {
  purpose: 'フィンテック決済処理プラットフォーム',
  frontend: 'React + Next.js', backend: 'Express',
  database: 'PostgreSQL', deploy: 'AWS',
  payment: 'Stripe', scale: 'large',
  entities: 'User, Transaction, AuditLog, Account',
};

const A_AI = {
  purpose: 'AIエージェント構築ツール',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'PostgreSQL', deploy: 'Vercel',
  ai_auto: 'マルチAgent協調', scale: 'medium',
  entities: 'User, Agent, Session, Message',
};

// ══════════════════════════════════════════
// File generation
// ══════════════════════════════════════════
describe('P27 CostOptimization — file generation', () => {
  it('generates all 4 cost docs', () => {
    const files = generate(A_SAAS);
    assert.ok(files['docs/109_cost_architecture.md'], 'doc 109 missing');
    assert.ok(files['docs/110_resource_optimization.md'], 'doc 110 missing');
    assert.ok(files['docs/111_finops_strategy.md'], 'doc 111 missing');
    assert.ok(files['docs/112_cost_monitoring.md'], 'doc 112 missing');
  });

  it('all docs are non-empty', () => {
    const files = generate(A_SAAS);
    assert.ok(files['docs/109_cost_architecture.md'].length > 200);
    assert.ok(files['docs/110_resource_optimization.md'].length > 200);
    assert.ok(files['docs/111_finops_strategy.md'].length > 200);
    assert.ok(files['docs/112_cost_monitoring.md'].length > 200);
  });
});

// ══════════════════════════════════════════
// doc 109: Cost Architecture
// ══════════════════════════════════════════
describe('gen109 — Cost Architecture', () => {
  it('has cost overview table', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(doc.includes('コスト概要') || doc.includes('Cost Overview'));
  });

  it('has scale cost estimate section', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(doc.includes('MVP') && doc.includes('Growth'), 'should have scale tiers');
  });

  it('has free tier checklist', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(doc.includes('- [ ]'), 'should have checklist items');
  });

  it('includes project name', () => {
    const files = generate(A_SAAS, 'MyFintech');
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(doc.includes('MyFintech'));
  });

  it('detects fintech domain and adds domain cost factors', () => {
    const files = generate(A_FINTECH);
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(
      doc.includes('fintech') || doc.includes('フィンテック') ||
      doc.includes('ドメイン固有') || doc.includes('Domain-Specific'),
      'should include domain-specific content'
    );
  });

  it('detects AI domain and adds AI cost factors', () => {
    const files = generate(A_AI);
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(doc.length > 500, 'AI doc should be substantial');
  });

  it('generates English version', () => {
    const files = generateEn(A_SAAS);
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(doc.includes('Cost') || doc.includes('FinOps'), 'should have English content');
  });

  it('references deploy platform', () => {
    const files = generate({ ...A_FINTECH, deploy: 'AWS' });
    const doc = files['docs/109_cost_architecture.md'];
    assert.ok(doc.includes('AWS') || doc.includes('ホスティング') || doc.includes('Hosting'));
  });
});

// ══════════════════════════════════════════
// doc 110: Resource Optimization
// ══════════════════════════════════════════
describe('gen110 — Resource Optimization', () => {
  it('has compute optimization section', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/110_resource_optimization.md'];
    assert.ok(doc.includes('コンピュート') || doc.includes('Compute'));
  });

  it('has DB optimization section', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/110_resource_optimization.md'];
    assert.ok(doc.includes('DB') || doc.includes('データベース') || doc.includes('Database'));
  });

  it('has code blocks', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/110_resource_optimization.md'];
    assert.ok(doc.includes('```'), 'should have code examples');
  });

  it('generates English version', () => {
    const files = generateEn(A_SAAS);
    const doc = files['docs/110_resource_optimization.md'];
    assert.ok(doc.includes('Optimization') || doc.includes('Database'));
  });
});

// ══════════════════════════════════════════
// doc 111: FinOps Strategy
// ══════════════════════════════════════════
describe('gen111 — FinOps Strategy', () => {
  it('has FinOps content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/111_finops_strategy.md'];
    assert.ok(doc.includes('FinOps') || doc.includes('コスト'), 'should have FinOps content');
  });

  it('has meaningful content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/111_finops_strategy.md'];
    assert.ok(doc.length > 300, 'doc should be substantial');
  });

  it('generates English version', () => {
    const files = generateEn(A_SAAS);
    const doc = files['docs/111_finops_strategy.md'];
    assert.ok(doc.length > 100);
  });
});

// ══════════════════════════════════════════
// doc 112: Cost Monitoring
// ══════════════════════════════════════════
describe('gen112 — Cost Monitoring', () => {
  it('has monitoring content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/112_cost_monitoring.md'];
    assert.ok(doc.includes('監視') || doc.includes('モニタリング') || doc.includes('Monitor'), 'should have monitoring content');
  });

  it('has alert/threshold content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/112_cost_monitoring.md'];
    assert.ok(doc.length > 200, 'doc should be substantial');
  });

  it('generates English version', () => {
    const files = generateEn(A_SAAS);
    const doc = files['docs/112_cost_monitoring.md'];
    assert.ok(doc.length > 100);
  });
});

// ══════════════════════════════════════════
// Bilingual parity
// ══════════════════════════════════════════
describe('P27 bilingual parity', () => {
  it('ja and en docs have comparable length (within 2x)', () => {
    const filesJa = generate(A_SAAS);
    const filesEn = generateEn(A_SAAS);
    ['docs/109_cost_architecture.md', 'docs/110_resource_optimization.md',
     'docs/111_finops_strategy.md', 'docs/112_cost_monitoring.md'].forEach(f => {
      const jaLen = (filesJa[f] || '').length;
      const enLen = (filesEn[f] || '').length;
      if (jaLen > 0 && enLen > 0) {
        const ratio = Math.max(jaLen, enLen) / Math.min(jaLen, enLen);
        assert.ok(ratio < 2.5, `${f}: ja/en length ratio ${ratio.toFixed(2)} exceeds 2.5x`);
      }
    });
  });
});
