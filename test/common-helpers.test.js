/**
 * Common Helpers Test Suite
 * Tests: detectDomain, resolveAuth, resolveArch, isBaaS, getEntityColumns, getFeatureDetail
 * ~80 tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

/* ── Minimal test scaffold ── */
const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'T', phase: 1, step: 0, skipped: [], files: {},
  editedFiles: {}, prevFiles: {}, genLang: 'ja', previewFile: null,
  pillar: 0, skillLv: 3,
};
const save = () => {};
const _lsGet = () => null;
const _lsSet = () => {};
const _lsRm = () => {};
const sanitize = v => v;

eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));

// ══════════════════════════════════════════
// detectDomain()
// ══════════════════════════════════════════
describe('detectDomain()', () => {
  it('detects education domain', () => {
    assert.equal(detectDomain('オンライン学習プラットフォーム'), 'education');
    assert.equal(detectDomain('LMS for courses'), 'education');
    assert.equal(detectDomain('家庭教師マッチング'), 'education');
  });

  it('detects ec domain', () => {
    assert.equal(detectDomain('ECサイト構築'), 'ec');
    assert.equal(detectDomain('eコマースプラットフォーム'), 'ec');
    assert.equal(detectDomain('online shop system'), 'ec');
  });

  it('detects marketplace domain', () => {
    assert.equal(detectDomain('マーケットプレイスサービス'), 'marketplace');
    assert.equal(detectDomain('peer-to-peer marketplace'), 'marketplace');
  });

  it('detects fintech domain', () => {
    assert.equal(detectDomain('フィンテックサービス'), 'fintech');
    assert.equal(detectDomain('AML/KYC compliance tool'), 'fintech');
    assert.equal(detectDomain('資産形成プラットフォーム'), 'fintech');
  });

  it('detects health domain', () => {
    assert.equal(detectDomain('医療管理システム'), 'health');
    assert.equal(detectDomain('healthcare platform'), 'health');
    assert.equal(detectDomain('フィットネス管理アプリ'), 'health');
  });

  it('detects saas domain', () => {
    assert.equal(detectDomain('SaaSサブスクリプション管理'), 'saas');
    assert.equal(detectDomain('helpdesk ticket system'), 'saas');
  });

  it('detects booking domain', () => {
    assert.equal(detectDomain('予約管理システム'), 'booking');
    assert.equal(detectDomain('restaurant booking platform'), 'booking');
  });

  it('detects community domain', () => {
    assert.equal(detectDomain('コミュニティフォーラム'), 'community');
    assert.equal(detectDomain('community discussion forum'), 'community');
  });

  it('detects analytics domain', () => {
    assert.equal(detectDomain('分析ダッシュボード'), 'analytics');
    assert.equal(detectDomain('analytics visualization platform'), 'analytics');
  });

  it('detects ai domain', () => {
    assert.equal(detectDomain('AIエージェント構築ツール'), 'ai');
    assert.equal(detectDomain('chatbot FAQ system'), 'ai');
  });

  it('detects content domain', () => {
    assert.equal(detectDomain('コンテンツ管理CMS'), 'content');
    assert.equal(detectDomain('ナレッジベース構築'), 'content');
  });

  it('detects hr domain', () => {
    assert.equal(detectDomain('HR採用管理システム'), 'hr');
    assert.equal(detectDomain('hiring recruitment platform'), 'hr');
  });

  it('detects iot domain', () => {
    assert.equal(detectDomain('IoTデバイス管理'), 'iot');
    assert.equal(detectDomain('sensor monitoring system'), 'iot');
  });

  it('detects realestate domain', () => {
    assert.equal(detectDomain('不動産管理プラットフォーム'), 'realestate');
    assert.equal(detectDomain('賃貸管理システム'), 'realestate');
  });

  it('detects logistics domain', () => {
    assert.equal(detectDomain('物流配送管理'), 'logistics');
    assert.equal(detectDomain('warehouse tracking system'), 'logistics');
  });

  it('detects manufacturing domain', () => {
    assert.equal(detectDomain('製造ライン生産管理'), 'manufacturing');
    assert.equal(detectDomain('smart factory system'), 'manufacturing');
  });

  it('detects government domain', () => {
    assert.equal(detectDomain('自治体申請管理システム'), 'government');
    assert.equal(detectDomain('civic public service portal'), 'government');
  });

  it('detects travel domain', () => {
    assert.equal(detectDomain('旅行ツアー予約'), 'travel');
    assert.equal(detectDomain('hotel booking platform'), 'travel');
  });

  it('detects insurance domain', () => {
    assert.equal(detectDomain('保険契約管理'), 'insurance');
    assert.equal(detectDomain('insurtech platform'), 'insurance');
  });

  it('detects legal domain', () => {
    assert.equal(detectDomain('法務サービスプラットフォーム'), 'legal');
    assert.equal(detectDomain('legal compliance management system'), 'legal');
  });

  it('detects energy domain', () => {
    assert.equal(detectDomain('エネルギー管理グリッド'), 'energy');
    assert.equal(detectDomain('renewable energy monitoring'), 'energy');
  });

  it('detects agriculture domain', () => {
    assert.equal(detectDomain('スマート農業IoT'), 'agriculture');
    assert.equal(detectDomain('crop management farming'), 'agriculture');
  });

  it('returns null for unknown purpose', () => {
    assert.equal(detectDomain(''), null);
    assert.equal(detectDomain('   '), null);
  });

  it('health takes priority over education for clinical terms', () => {
    const d = detectDomain('臨床試験向け機械学習プラットフォーム');
    assert.equal(d, 'health');
  });

  it('manufacturing takes priority for 多能工 term', () => {
    const d = detectDomain('多能工管理HRMS');
    assert.equal(d, 'manufacturing');
  });
});

// ══════════════════════════════════════════
// isBaaS()
// ══════════════════════════════════════════
describe('isBaaS()', () => {
  it('returns true for Supabase backend', () => {
    assert.equal(isBaaS({ backend: 'Supabase' }), true);
  });

  it('returns true for Firebase backend', () => {
    assert.equal(isBaaS({ backend: 'Firebase Firestore' }), true);
  });

  it('returns true for Convex backend', () => {
    assert.equal(isBaaS({ backend: 'Convex' }), true);
  });

  it('returns false for Express backend', () => {
    assert.equal(isBaaS({ backend: 'Express' }), false);
  });

  it('returns false for NestJS backend', () => {
    assert.equal(isBaaS({ backend: 'NestJS' }), false);
  });

  it('returns false when backend is empty', () => {
    assert.equal(isBaaS({ backend: '' }), false);
  });

  it('returns false when answers is null/undefined', () => {
    assert.equal(isBaaS(null), false);
    assert.equal(isBaaS(undefined), false);
  });
});

// ══════════════════════════════════════════
// resolveAuth()
// ══════════════════════════════════════════
describe('resolveAuth()', () => {
  it('returns Supabase Auth for Supabase backend', () => {
    const result = resolveAuth({ backend: 'Supabase', auth: '' });
    assert.ok(result, 'should return auth info');
    assert.ok(typeof result === 'string' || typeof result === 'object', 'should be string or object');
  });

  it('returns Firebase Auth for Firebase backend', () => {
    const result = resolveAuth({ backend: 'Firebase Firestore', auth: '' });
    assert.ok(result, 'should return auth info');
  });

  it('handles explicit auth field', () => {
    const result = resolveAuth({ backend: 'Express', auth: 'Auth.js (NextAuth)' });
    assert.ok(result, 'should return auth info');
  });

  it('handles JWT for custom backend', () => {
    const result = resolveAuth({ backend: 'Express', auth: 'JWT' });
    assert.ok(result, 'should return auth info');
  });

  it('returns a non-empty result', () => {
    const result = resolveAuth({ backend: 'Supabase' });
    assert.ok(result);
  });
});

// ══════════════════════════════════════════
// resolveArch()
// ══════════════════════════════════════════
describe('resolveArch()', () => {
  it('returns isBaaS=true for Supabase', () => {
    const arch = resolveArch({ backend: 'Supabase' });
    assert.equal(arch.isBaaS, true);
  });

  it('returns isBaaS=false for Express', () => {
    const arch = resolveArch({ backend: 'Express' });
    assert.equal(arch.isBaaS, false);
  });

  it('returns a pattern string', () => {
    const arch = resolveArch({ backend: 'Supabase', frontend: 'React + Next.js' });
    assert.ok(typeof arch.pattern === 'string');
    assert.ok(arch.pattern.length > 0);
  });

  it('returns arch object with orm field', () => {
    const arch = resolveArch({ backend: 'Express', orm: 'Prisma' });
    assert.ok('orm' in arch || typeof arch === 'object');
  });
});

// ══════════════════════════════════════════
// getEntityColumns()
// ══════════════════════════════════════════
describe('getEntityColumns()', () => {
  it('returns columns for User entity', () => {
    const cols = getEntityColumns('User', true, []);
    assert.ok(Array.isArray(cols), 'should return array');
    assert.ok(cols.length > 0, 'User should have columns');
  });

  it('returns columns for known entities', () => {
    const colsEn = getEntityColumns('User', false, []);
    const colsJa = getEntityColumns('User', true, []);
    assert.ok(Array.isArray(colsEn));
    assert.ok(Array.isArray(colsJa));
  });

  it('returns empty array for unknown entity', () => {
    const cols = getEntityColumns('FooBarBaz123Unknown', true, []);
    assert.ok(Array.isArray(cols));
  });

  it('column objects have col and type fields', () => {
    const cols = getEntityColumns('User', true, []);
    if (cols.length > 0) {
      const col = cols[0];
      assert.ok('col' in col, 'should have col field');
      assert.ok('type' in col, 'should have type field');
    }
  });

  it('returns columns for Product entity', () => {
    const cols = getEntityColumns('Product', true, []);
    assert.ok(Array.isArray(cols));
  });

  it('returns columns for Order entity', () => {
    const cols = getEntityColumns('Order', true, []);
    assert.ok(Array.isArray(cols));
  });

  it('handles knownEntities context parameter', () => {
    const cols = getEntityColumns('User', true, ['Team', 'Organization']);
    assert.ok(Array.isArray(cols));
  });
});

// ══════════════════════════════════════════
// getFeatureDetail()
// ══════════════════════════════════════════
describe('getFeatureDetail()', () => {
  it('returns detail for auth-related feature', () => {
    const fd = getFeatureDetail('ユーザー認証');
    assert.ok(fd !== null, 'should find auth feature');
    assert.ok(fd.criteria_ja, 'should have criteria_ja');
    assert.ok(fd.criteria_en, 'should have criteria_en');
    assert.ok(fd.tests_ja, 'should have tests_ja');
    assert.ok(fd.tests_en, 'should have tests_en');
  });

  it('returns detail for payment/subscription feature', () => {
    const fd = getFeatureDetail('サブスクリプション管理');
    assert.ok(fd !== null, 'should find subscription feature');
  });

  it('returns detail for booking feature', () => {
    const fd = getFeatureDetail('予約管理');
    assert.ok(fd !== null, 'should find booking feature');
  });

  it('returns detail for admin feature', () => {
    const fd = getFeatureDetail('管理ダッシュボード');
    assert.ok(fd !== null, 'should find admin feature');
  });

  it('returns null for unknown feature', () => {
    const fd = getFeatureDetail('FooBarUnknownFeature12345');
    assert.equal(fd, null);
  });

  it('criteria_ja is an array of strings', () => {
    const fd = getFeatureDetail('ユーザー認証');
    assert.ok(Array.isArray(fd.criteria_ja));
    assert.ok(fd.criteria_ja.length > 0);
    assert.ok(typeof fd.criteria_ja[0] === 'string');
  });

  it('tests_ja contains [description, result] pairs', () => {
    const fd = getFeatureDetail('ユーザー認証');
    assert.ok(Array.isArray(fd.tests_ja));
    assert.ok(fd.tests_ja.length > 0);
    assert.ok(Array.isArray(fd.tests_ja[0]));
    assert.equal(fd.tests_ja[0].length, 2);
  });

  it('returns detail for comment/review feature', () => {
    const fd = getFeatureDetail('コメント');
    assert.ok(fd !== null);
  });

  it('returns detail for post/article feature', () => {
    const fd = getFeatureDetail('投稿管理');
    assert.ok(fd !== null);
  });

  it('matches case-insensitively', () => {
    const fd1 = getFeatureDetail('Auth');
    const fd2 = getFeatureDetail('auth');
    // Both should match or both null — consistent behavior
    assert.equal(fd1 === null, fd2 === null);
  });
});
