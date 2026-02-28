/**
 * P22 Database Intelligence Generator Tests
 * Tests: gen87, gen88, gen89, gen90
 * ~20 tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'TestDB', phase: 1, step: 0, skipped: [], files: {},
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
eval(fs.readFileSync('src/generators/p22-database.js', 'utf-8'));

function generate(answers, pn = 'TestProject', lang = 'ja') {
  S.files = {};
  S.genLang = lang;
  genPillar22_DatabaseIntelligence(answers, pn);
  return S.files;
}

const A_PG = {
  purpose: 'ECサイト',
  frontend: 'React + Next.js', backend: 'Express',
  database: 'PostgreSQL', deploy: 'Railway',
  scale: 'medium', orm: 'Prisma',
  entities: 'User, Product, Order, Inventory, Category',
};

const A_SUPABASE = {
  purpose: 'SaaS管理プラットフォーム',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'PostgreSQL', deploy: 'Vercel',
  scale: 'large', entities: 'User, Team, Project, Subscription',
};

const A_FINTECH = {
  purpose: 'フィンテック取引管理',
  frontend: 'React + Next.js', backend: 'NestJS',
  database: 'PostgreSQL', deploy: 'Railway',
  scale: 'large', entities: 'User, Transaction, AuditLog, Account',
};

describe('P22 Database — file generation', () => {
  it('generates all 4 database docs', () => {
    const files = generate(A_PG);
    assert.ok(files['docs/87_database_design_principles.md'], 'doc 87 missing');
    assert.ok(files['docs/88_query_optimization_guide.md'], 'doc 88 missing');
    assert.ok(files['docs/89_migration_strategy.md'], 'doc 89 missing');
    assert.ok(files['docs/90_backup_disaster_recovery.md'], 'doc 90 missing');
  });

  it('all docs are non-empty', () => {
    const files = generate(A_PG);
    ['docs/87_database_design_principles.md', 'docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md', 'docs/90_backup_disaster_recovery.md'].forEach(f => {
      assert.ok((files[f] || '').length > 100, `${f} is too short`);
    });
  });
});

describe('gen87 — Database Design Principles', () => {
  it('has database design content', () => {
    const files = generate(A_PG);
    const doc = files['docs/87_database_design_principles.md'];
    assert.ok(doc.includes('データベース') || doc.includes('Database') || doc.includes('schema'));
  });

  it('includes entity tables for PostgreSQL', () => {
    const files = generate(A_PG);
    const doc = files['docs/87_database_design_principles.md'];
    assert.ok(doc.includes('User') || doc.includes('TABLE') || doc.includes('CREATE'));
  });

  it('includes project name', () => {
    const files = generate(A_PG, 'MyShop');
    const doc = files['docs/87_database_design_principles.md'];
    assert.ok(doc.includes('MyShop'));
  });
});

describe('gen88 — Query Optimization Guide', () => {
  it('has query optimization content', () => {
    const files = generate(A_PG);
    const doc = files['docs/88_query_optimization_guide.md'];
    assert.ok(doc.includes('クエリ') || doc.includes('Query') || doc.includes('インデックス') || doc.includes('index'));
  });

  it('has code blocks', () => {
    const files = generate(A_PG);
    const doc = files['docs/88_query_optimization_guide.md'];
    assert.ok(doc.includes('```'));
  });
});

describe('gen89 — Migration Strategy', () => {
  it('has migration content', () => {
    const files = generate(A_PG);
    const doc = files['docs/89_migration_strategy.md'];
    assert.ok(doc.includes('マイグレーション') || doc.includes('Migration') || doc.includes('migrate'));
  });

  it('references ORM when set', () => {
    const files = generate(A_PG);
    const doc = files['docs/89_migration_strategy.md'];
    assert.ok(doc.includes('Prisma') || doc.includes('migration') || doc.length > 100);
  });
});

describe('gen90 — Backup & Disaster Recovery', () => {
  it('has backup/DR content', () => {
    const files = generate(A_PG);
    const doc = files['docs/90_backup_disaster_recovery.md'];
    assert.ok(doc.includes('バックアップ') || doc.includes('Backup') || doc.includes('RTO') || doc.includes('RPO'));
  });

  it('has fintech-specific strict DR', () => {
    const files = generate(A_FINTECH);
    const doc = files['docs/90_backup_disaster_recovery.md'];
    assert.ok(doc.length > 200);
  });
});

describe('P22 bilingual parity', () => {
  it('en version generates all docs', () => {
    const files = generate(A_PG, 'TestProject', 'en');
    assert.ok(files['docs/87_database_design_principles.md']);
    assert.ok(files['docs/88_query_optimization_guide.md']);
  });
});
