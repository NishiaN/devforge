/**
 * v9.25 生成物クロスリファレンス完全解消 — 回帰テスト
 * フル生成の全md内 docs/NN_ 参照が実在ファイルを指すことを保証 (2シナリオ)。
 * v9.22 B-3 (launcher参照) の生成ドキュメント版。
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

function scanBroken(files) {
  const gen = new Set(Object.keys(files));
  const broken = {};
  for (const [p, c] of Object.entries(files)) {
    if (!p.endsWith('.md')) continue;
    const refs = String(c).match(/docs\/[0-9][0-9-]*_[a-zA-Z0-9_]+\.md/g) || [];
    refs.forEach(r => {
      if (!gen.has(r) && !AUDIT_ONLY.has(r)) {
        (broken[r] = broken[r] || new Set()).add(p);
      }
    });
  }
  return broken;
}

const SCENARIOS = {
  'A (LMS/Supabase/Stripe/AI)': {
    purpose: 'SaaS型学習管理システム', target: '学生, 講師', frontend: 'React (Next.js)',
    backend: 'Supabase', database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth', payment: 'Stripe',
    deploy: 'Vercel', data_entities: 'User, Course, Lesson, Enrollment', mvp_features: 'ユーザー登録, コース管理, 決済',
    dev_methods: 'SDD, TDD', scale: 'medium', ai_tools: 'Claude Code', ai_auto: 'マルチAgent協調', admin: 'あり',
  },
  'B (Blog/Vite/Netlify/no-AI)': {
    purpose: '技術ブログCMS', target: '読者, 執筆者', frontend: 'Vue (Vite)', backend: 'Node.js + Express',
    database: 'PostgreSQL', auth: 'Email/Password', deploy: 'Netlify', data_entities: 'User, Post, Comment',
    mvp_features: '記事投稿, コメント', dev_methods: 'TDD', scale: 'small',
  },
};

describe('v9.25: 生成ドキュメントのクロスリファレンス整合', () => {
  for (const [name, ans] of Object.entries(SCENARIOS)) {
    for (const lang of ['ja', 'en']) {
      test('シナリオ' + name + ' [' + lang + ']: 未生成docs参照がゼロ', () => {
        const files = generate({ ...ans }, 'T', lang);
        const broken = scanBroken(files);
        const keys = Object.keys(broken);
        const detail = keys.map(r => r + ' ← ' + [...broken[r]].slice(0, 2).join(', ')).join('\n  ');
        assert.equal(keys.length, 0, 'Broken cross-references found:\n  ' + detail);
      });
    }
  }
});
