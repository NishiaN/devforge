/**
 * v9.31 EN生成の日本語純度 — 回帰テスト
 * 英語回答+genLang='en' のフル生成物に、生成器ハードコード由来の日本語が
 * 混入しないことを保証（かな2文字以上連続を検出シグナルとする — 漢字のみは
 * 中国語と共有のため対象外、かなは日本語ハードコードの確実な証拠）。
 * v9.31時点で36ファイル180行の混入をソース根絶した再発防止。
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

const SCENARIOS = {
  'SaaS (Supabase/Stripe/AI)': {
    purpose: 'BtoB SaaS customer and billing management platform', target: 'Companies, Admins',
    frontend: 'React (Next.js)', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
    auth: 'Supabase Auth', payment: 'Stripe', deploy: 'Vercel',
    data_entities: 'User, Team, Invoice, Subscription',
    mvp_features: 'User registration, Billing management, Payment',
    dev_methods: 'SDD, TDD', scale: 'medium', ai_tools: 'Claude Code', ai_auto: 'Multi-agent', admin: 'あり',
  },
  'Fintech (Express/BDD)': {
    purpose: 'Personal finance and investment management fintech app', target: 'Retail investors',
    frontend: 'React (Next.js)', backend: 'Node.js + Express', database: 'PostgreSQL',
    auth: 'Email/Password', payment: 'Stripe', deploy: 'Railway',
    data_entities: 'User, Account, Transaction, AuditLog',
    mvp_features: 'Asset management, Transaction log, Payment',
    dev_methods: 'BDD', scale: 'medium', admin: 'あり',
  },
  // 条件付きパス網羅: health→docs/125, manufacturing+Python+AWS+large→docs/127/117/120+SQLAlchemy technical-plan
  'Health (NestJS)': {
    purpose: 'Clinic electronic medical records and patient management system', target: 'Doctors, Nurses',
    frontend: 'React (Next.js)', backend: 'NestJS', database: 'PostgreSQL', auth: 'Email/Password',
    deploy: 'Railway', data_entities: 'User, Patient, Record, AuditLog',
    mvp_features: 'Patient management, Medical records', dev_methods: 'TDD', scale: 'medium', admin: 'あり',
  },
  'Manufacturing (FastAPI/AWS/large)': {
    purpose: 'Manufacturing production management and IoT monitoring system', target: 'Factory managers',
    frontend: 'Vue (Vite)', backend: 'Python + FastAPI', database: 'PostgreSQL', auth: 'Email/Password',
    deploy: 'AWS', data_entities: 'User, Machine, Sensor, Alert',
    mvp_features: 'Production monitoring, Alerts', dev_methods: 'TDD', scale: 'large', admin: 'あり',
  },
  'Booking (Supabase/small)': {
    purpose: 'Online reservation system for beauty salons', target: 'Customers, Salons',
    frontend: 'React (Next.js)', backend: 'Supabase', database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth',
    deploy: 'Vercel', data_entities: 'User, Salon, Reservation',
    mvp_features: 'Reservations, Cancellation', dev_methods: 'TDD', scale: 'small',
  },
};

// 意図的に日本語を残す箇所（行単位マッチ）
const ALLOW = [
  /にしあん/,            // README.md 著者クレジット
];

const KANA = /[぀-ゟ゠-ヿ]{2,}/;

describe('v9.31: EN生成物に日本語ハードコード混入ゼロ', () => {
  for (const [name, ans] of Object.entries(SCENARIOS)) {
    test('シナリオ ' + name + ': かな混入ゼロ (許容リスト除く)', () => {
      const files = generate({ ...ans }, 'T', 'en');
      const bad = [];
      for (const [p, c] of Object.entries(files)) {
        String(c).split('\n').forEach((l, i) => {
          if (KANA.test(l) && !ALLOW.some(rx => rx.test(l))) {
            bad.push(p + ':' + (i + 1) + ' ' + l.trim().slice(0, 80));
          }
        });
      }
      assert.equal(bad.length, 0,
        'Japanese leaked into EN generation (' + bad.length + ' lines):\n  ' + bad.slice(0, 25).join('\n  '));
    });
  }

  test('JA生成は従来どおり日本語を含む (回帰ガード)', () => {
    const files = generate({ ...Object.values(SCENARIOS)[0] }, 'T', 'ja');
    const jaCount = Object.values(files).filter(c => KANA.test(String(c))).length;
    assert.ok(jaCount > 100, 'JA generation should contain Japanese in >100 files, got ' + jaCount);
  });
});
