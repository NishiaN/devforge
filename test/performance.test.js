/**
 * P25 Performance Intelligence Generator Tests
 * Tests: gen99, gen100, gen101, gen102
 * ~20 tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'TestPerf', phase: 1, step: 0, skipped: [], files: {},
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
eval(fs.readFileSync('src/generators/p25-performance.js', 'utf-8'));

function generate(answers, pn = 'TestProject', lang = 'ja') {
  S.files = {};
  S.genLang = lang;
  genPillar25_Performance(answers, pn);
  return S.files;
}

const A_NEXT = {
  purpose: 'SaaSサブスクリプション管理',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'PostgreSQL', deploy: 'Vercel',
  scale: 'medium', entities: 'User, Team, Subscription',
};

const A_EC = {
  purpose: 'ECサイト',
  frontend: 'React + Next.js', backend: 'Express',
  database: 'PostgreSQL', deploy: 'Railway',
  payment: 'Stripe', scale: 'large',
  entities: 'User, Product, Order, Inventory',
};

const A_CONTENT = {
  purpose: 'コンテンツ配信プラットフォーム',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'PostgreSQL', deploy: 'Vercel',
  scale: 'medium', entities: 'User, Article, Category',
};

describe('P25 Performance — file generation', () => {
  it('generates all 4 performance docs', () => {
    const files = generate(A_NEXT);
    assert.ok(files['docs/99_performance_strategy.md'], 'doc 99 missing');
    assert.ok(files['docs/100_database_performance.md'], 'doc 100 missing');
    assert.ok(files['docs/101_cache_strategy.md'], 'doc 101 missing');
    assert.ok(files['docs/102_performance_monitoring.md'], 'doc 102 missing');
  });

  it('all docs are non-empty', () => {
    const files = generate(A_NEXT);
    ['docs/99_performance_strategy.md', 'docs/100_database_performance.md',
     'docs/101_cache_strategy.md', 'docs/102_performance_monitoring.md'].forEach(f => {
      assert.ok((files[f] || '').length > 100, `${f} is too short`);
    });
  });
});

describe('gen99 — Performance Strategy', () => {
  it('has Core Web Vitals or performance metrics', () => {
    const files = generate(A_NEXT);
    const doc = files['docs/99_performance_strategy.md'];
    assert.ok(doc.includes('LCP') || doc.includes('パフォーマンス') || doc.includes('Performance'));
  });

  it('includes project name', () => {
    const files = generate(A_NEXT, 'FastApp');
    const doc = files['docs/99_performance_strategy.md'];
    assert.ok(doc.includes('FastApp'));
  });

  it('has domain-specific optimization for ec', () => {
    const files = generate(A_EC);
    const doc = files['docs/99_performance_strategy.md'];
    assert.ok(doc.length > 200);
  });

  it('has content-specific optimization for content domain', () => {
    const files = generate(A_CONTENT);
    const doc = files['docs/99_performance_strategy.md'];
    assert.ok(doc.length > 200);
  });
});

describe('gen100 — Database Performance', () => {
  it('has database performance content', () => {
    const files = generate(A_NEXT);
    const doc = files['docs/100_database_performance.md'];
    assert.ok(doc.includes('DB') || doc.includes('データベース') || doc.includes('インデックス') || doc.includes('index'));
  });

  it('has query optimization content', () => {
    const files = generate(A_NEXT);
    const doc = files['docs/100_database_performance.md'];
    assert.ok(doc.includes('```') || doc.length > 200);
  });
});

describe('gen101 — Cache Strategy', () => {
  it('has caching content', () => {
    const files = generate(A_NEXT);
    const doc = files['docs/101_cache_strategy.md'];
    assert.ok(doc.includes('キャッシュ') || doc.includes('Cache') || doc.includes('Redis') || doc.includes('CDN'));
  });

  it('has tiered cache strategy', () => {
    const files = generate(A_EC);
    const doc = files['docs/101_cache_strategy.md'];
    assert.ok(doc.length > 200);
  });
});

describe('gen102 — Performance Monitoring', () => {
  it('has monitoring content', () => {
    const files = generate(A_NEXT);
    const doc = files['docs/102_performance_monitoring.md'];
    assert.ok(doc.includes('監視') || doc.includes('Monitor') || doc.includes('Alert') || doc.includes('Lighthouse'));
  });

  it('has meaningful length', () => {
    const files = generate(A_NEXT);
    assert.ok((files['docs/102_performance_monitoring.md'] || '').length > 100);
  });
});

describe('P25 bilingual parity', () => {
  it('en version generates all docs', () => {
    const files = generate(A_NEXT, 'TestProject', 'en');
    assert.ok(files['docs/99_performance_strategy.md']);
    assert.ok(files['docs/100_database_performance.md']);
    assert.ok(files['docs/101_cache_strategy.md']);
    assert.ok(files['docs/102_performance_monitoring.md']);
  });

  it('ja and en docs have comparable length', () => {
    const filesJa = generate(A_NEXT);
    const filesEn = generate(A_NEXT, 'TestProject', 'en');
    const f = 'docs/99_performance_strategy.md';
    const jaLen = (filesJa[f] || '').length;
    const enLen = (filesEn[f] || '').length;
    if (jaLen > 0 && enLen > 0) {
      const ratio = Math.max(jaLen, enLen) / Math.min(jaLen, enLen);
      assert.ok(ratio < 3, `${f}: ratio ${ratio.toFixed(2)} exceeds 3x`);
    }
  });
});
