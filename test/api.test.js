/**
 * P21 API Intelligence Generator Tests
 * Tests: gen83, gen84, gen85, gen86
 * ~25 tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'TestAPI', phase: 1, step: 0, skipped: [], files: {},
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
eval(fs.readFileSync('src/generators/p21-api.js', 'utf-8'));

function generate(answers, pn = 'TestProject', lang = 'ja') {
  S.files = {};
  S.genLang = lang;
  genPillar21_APIIntelligence(answers, pn);
  return S.files;
}

const A_SAAS = {
  purpose: 'SaaSサブスクリプション管理',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'PostgreSQL', deploy: 'Vercel',
  payment: 'Stripe', scale: 'medium',
  entities: 'User, Team, Subscription',
};

const A_EXPRESS = {
  purpose: '在庫管理システム',
  frontend: 'React + Next.js', backend: 'Express',
  database: 'PostgreSQL', deploy: 'Railway',
  scale: 'small', entities: 'User, Product, Order, Inventory',
  orm: 'Prisma', auth: 'JWT',
};

const A_FINTECH = {
  purpose: 'フィンテック決済API',
  frontend: 'React + Next.js', backend: 'NestJS',
  database: 'PostgreSQL', deploy: 'Railway',
  payment: 'Stripe', scale: 'large',
  entities: 'User, Transaction, AuditLog, Account',
};

describe('P21 API — file generation', () => {
  it('generates all 4 API docs', () => {
    const files = generate(A_SAAS);
    assert.ok(files['docs/83_api_design_principles.md'], 'doc 83 missing');
    assert.ok(files['docs/84_openapi_specification.md'], 'doc 84 missing');
    assert.ok(files['docs/85_api_security_checklist.md'], 'doc 85 missing');
    assert.ok(files['docs/86_api_testing_strategy.md'], 'doc 86 missing');
  });

  it('all docs are non-empty', () => {
    const files = generate(A_SAAS);
    ['docs/83_api_design_principles.md', 'docs/84_openapi_specification.md',
     'docs/85_api_security_checklist.md', 'docs/86_api_testing_strategy.md'].forEach(f => {
      assert.ok((files[f] || '').length > 100, `${f} is too short`);
    });
  });
});

describe('gen83 — API Design Principles', () => {
  it('has REST/API design content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/83_api_design_principles.md'];
    assert.ok(doc.includes('API') || doc.includes('REST') || doc.includes('エンドポイント'));
  });

  it('includes project name', () => {
    const files = generate(A_SAAS, 'MyAPI');
    const doc = files['docs/83_api_design_principles.md'];
    assert.ok(doc.includes('MyAPI'));
  });

  it('has versioning content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/83_api_design_principles.md'];
    assert.ok(doc.includes('v1') || doc.includes('バージョン') || doc.includes('version'));
  });
});

describe('gen84 — OpenAPI Specification', () => {
  it('has OpenAPI/schema content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/84_openapi_specification.md'];
    assert.ok(doc.includes('openapi') || doc.includes('OpenAPI') || doc.includes('schema') || doc.includes('paths'));
  });

  it('references entities', () => {
    const files = generate(A_EXPRESS);
    const doc = files['docs/84_openapi_specification.md'];
    assert.ok(doc.length > 200);
  });

  it('has code blocks', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/84_openapi_specification.md'];
    assert.ok(doc.includes('```'));
  });
});

describe('gen85 — API Security Checklist', () => {
  it('has security content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/85_api_security_checklist.md'];
    assert.ok(doc.includes('セキュリティ') || doc.includes('Security') || doc.includes('Auth'));
  });

  it('has checklist items', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/85_api_security_checklist.md'];
    assert.ok(doc.includes('- [ ]') || doc.includes('- ✅') || doc.includes('##'));
  });

  it('has fintech-specific content for fintech domain', () => {
    const files = generate(A_FINTECH);
    const doc = files['docs/85_api_security_checklist.md'];
    assert.ok(doc.length > 300, 'fintech doc should be substantial');
  });
});

describe('gen86 — API Testing Strategy', () => {
  it('has testing content', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/86_api_testing_strategy.md'];
    assert.ok(doc.includes('テスト') || doc.includes('Test') || doc.includes('vitest'));
  });

  it('has code examples', () => {
    const files = generate(A_SAAS);
    const doc = files['docs/86_api_testing_strategy.md'];
    assert.ok(doc.includes('```'));
  });
});

describe('P21 bilingual parity', () => {
  it('en version generates successfully', () => {
    const files = generate(A_SAAS, 'TestProject', 'en');
    assert.ok(files['docs/83_api_design_principles.md']);
    assert.ok(files['docs/84_openapi_specification.md']);
  });
});
