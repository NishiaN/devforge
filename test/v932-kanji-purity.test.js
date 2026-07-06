/**
 * v9.32 EN生成の漢字純度 — 回帰テスト
 * v9.31(かな検出)が拾えなかった「漢字のみ・全角記号のみ」の日本語残留を検出する。
 * EN生成物には CJK漢字・日本語全角記号（、。・「」〜※等）が一切含まれないことを保証
 * （v9.32時点で79ユニーク行/延べ262箇所をソース根絶した再発防止）。
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

// CJK統合漢字(+拡張A) と 日本語全角記号（v9.32スキャンと同一クラス）
const KANJI = /[㐀-䶿一-鿿]/;
const ZKIGO = /[、。・「」『』（）：；？！〜※]/;

describe('v9.32: EN生成物に漢字・全角記号の残留ゼロ', () => {
  for (const [name, ans] of Object.entries(SCENARIOS)) {
    test('シナリオ ' + name + ': 漢字/全角記号ゼロ (許容リスト除く)', () => {
      const files = generate({ ...ans }, 'T', 'en');
      const bad = [];
      for (const [p, c] of Object.entries(files)) {
        String(c).split('\n').forEach((l, i) => {
          if ((KANJI.test(l) || ZKIGO.test(l)) && !ALLOW.some(rx => rx.test(l))) {
            bad.push(p + ':' + (i + 1) + ' ' + l.trim().slice(0, 80));
          }
        });
      }
      assert.equal(bad.length, 0,
        'Kanji/zenkaku leaked into EN generation (' + bad.length + ' lines):\n  ' + bad.slice(0, 25).join('\n  '));
    });
  }

  test('JA生成は従来どおり漢字を含む (回帰ガード)', () => {
    const files = generate({ ...Object.values(SCENARIOS)[0] }, 'T', 'ja');
    const jaCount = Object.values(files).filter(c => KANJI.test(String(c))).length;
    assert.ok(jaCount > 100, 'JA generation should contain kanji in >100 files, got ' + jaCount);
  });
});
