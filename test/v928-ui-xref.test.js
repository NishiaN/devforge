/**
 * v9.28 UI層クロスリファレンス整合 — 回帰テスト
 * v9.25 (生成md内参照) の残りギャップ2種を閉鎖:
 *  1. UI層 (qbar/dashboard/export/launcher/templates/compat-rules) の docs 参照が
 *     実生成ファイル名を指すことを保証 (旧命名スキーム残存の根絶)
 *  2. 条件付き生成パス (fintech+payment / BDD手法) の生成md内参照スキャン
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

// postGenerationAudit() が実アプリ時に生成するがハーネスの generate() には含まれないファイル
const AUDIT_ONLY = new Set([
  'docs/82_architecture_integrity_check.md',
]);

// ドメイン条件付きファイルを網羅するシナリオ群 (saas→P19/73, fintech→126, health→125,
// manufacturing→127, booking→122分岐; payment→38, ai_auto→98-2/128-130)
const UNIVERSE_SCENARIOS = [
  { purpose: 'BtoB SaaS 顧客管理・請求管理プラットフォーム', target: '企業, 管理者', frontend: 'React (Next.js)',
    backend: 'Supabase', database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth', payment: 'Stripe',
    deploy: 'Vercel', data_entities: 'User, Team, Invoice, Subscription', mvp_features: 'ユーザー登録, 請求管理, 決済',
    dev_methods: 'SDD, TDD', scale: 'medium', ai_tools: 'Claude Code', ai_auto: 'マルチAgent協調', admin: 'あり' },
  { purpose: '個人投資家向け資産管理・家計簿フィンテックアプリ', target: '個人投資家', frontend: 'React (Next.js)',
    backend: 'Node.js + Express', database: 'PostgreSQL', auth: 'Email/Password', payment: 'Stripe',
    deploy: 'Railway', data_entities: 'User, Account, Transaction, AuditLog', mvp_features: '資産管理, 取引記録, 決済',
    dev_methods: 'BDD', scale: 'medium', admin: 'あり' },
  { purpose: 'クリニック向け電子カルテ・患者管理システム', target: '医師, 看護師', frontend: 'React (Next.js)',
    backend: 'NestJS', database: 'PostgreSQL', auth: 'Email/Password',
    deploy: 'Railway', data_entities: 'User, Patient, Record, AuditLog', mvp_features: '患者管理, カルテ記録',
    dev_methods: 'TDD', scale: 'medium', admin: 'あり' },
  { purpose: '製造業向け生産管理・IoT監視システム', target: '工場管理者', frontend: 'Vue (Vite)',
    backend: 'Python + FastAPI', database: 'PostgreSQL', auth: 'Email/Password',
    deploy: 'AWS', data_entities: 'User, Machine, Sensor, Alert', mvp_features: '生産監視, アラート',
    dev_methods: 'TDD', scale: 'large', admin: 'あり' },
  { purpose: '美容室向けオンライン予約システム', target: '顧客, 店舗', frontend: 'React (Next.js)',
    backend: 'Supabase', database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth',
    deploy: 'Vercel', data_entities: 'User, Salon, Reservation', mvp_features: '予約, キャンセル',
    dev_methods: 'TDD', scale: 'small' },
];

function buildUniverse() {
  const universe = new Set(AUDIT_ONLY);
  for (const ans of UNIVERSE_SCENARIOS) {
    for (const lang of ['ja', 'en']) {
      const files = generate({ ...ans }, 'T', lang);
      Object.keys(files).forEach(k => universe.add(k));
    }
  }
  return universe;
}

const UI_SRC = [
  'src/ui/qbar.js', 'src/ui/dashboard.js', 'src/ui/export.js',
  'src/ui/launcher.js', 'src/ui/templates.js', 'src/data/compat-rules.js',
];

describe('v9.28: UI層docs参照の実在保証', () => {
  const universe = buildUniverse();
  const basenames = new Set([...universe].map(p => p.replace(/^docs\//, '')));

  for (const src of UI_SRC) {
    test(src + ': docs/NN_ フルパス参照が全て実生成名', () => {
      const code = fs.readFileSync(src, 'utf8');
      const refs = [...new Set(code.match(/docs\/[0-9][0-9-]*_[a-zA-Z0-9_]+\.md/g) || [])];
      const broken = refs.filter(r => !universe.has(r));
      assert.deepEqual(broken, [], src + ' broken refs: ' + broken.join(', '));
    });
  }

  test('templates.js: 裸のNN_*.md表記も実生成名', () => {
    const code = fs.readFileSync('src/ui/templates.js', 'utf8');
    const refs = [...new Set(code.match(/[0-9]{2,3}(?:-[0-9])?_[a-z0-9_]+\.md/g) || [])];
    const broken = refs.filter(r => !basenames.has(r));
    assert.deepEqual(broken, [], 'templates.js stale bare names: ' + broken.join(', '));
  });

  test('export.js: EXPORT_ROLES の docs/ prefix が全て1件以上に一致', () => {
    const code = fs.readFileSync('src/ui/export.js', 'utf8');
    const prefixes = [...new Set(code.match(/'docs\/[0-9][0-9-]*_'/g) || [])].map(s => s.slice(1, -1));
    const dead = prefixes.filter(pr => ![...universe].some(k => k.startsWith(pr)));
    assert.deepEqual(dead, [], 'export.js dead prefixes: ' + dead.join(', '));
  });

  // v9.25 のギャップ閉鎖: 条件付き生成パス (fintech+payment→docs/126, BDD→12_driven_dev分岐)
  for (const lang of ['ja', 'en']) {
    test('fintech+payment+BDD [' + lang + ']: 生成md内の未生成docs参照ゼロ', () => {
      const files = generate({ ...UNIVERSE_SCENARIOS[1] }, 'T', lang);
      const gen = new Set(Object.keys(files));
      const broken = {};
      for (const [p, c] of Object.entries(files)) {
        if (!p.endsWith('.md')) continue;
        (String(c).match(/docs\/[0-9][0-9-]*_[a-zA-Z0-9_]+\.md/g) || []).forEach(r => {
          if (!gen.has(r) && !AUDIT_ONLY.has(r)) (broken[r] = broken[r] || new Set()).add(p);
        });
      }
      const keys = Object.keys(broken);
      const detail = keys.map(r => r + ' ← ' + [...broken[r]].slice(0, 2).join(', ')).join('\n  ');
      assert.equal(keys.length, 0, 'Broken cross-references:\n  ' + detail);
    });
  }
});
