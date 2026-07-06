/**
 * v9.30 scope_out のAI可視化 — 回帰テスト
 * ウィザードN-8のスコープ外が、AIが最初に読む生成物 (CLAUDE.md / AI_BRIEF.md) に
 * 直接届くことを保証。従来は .spec/constitution.md §7 と docs/107 のみだった。
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

const BASE = {
  purpose: 'BtoB SaaS 顧客管理プラットフォーム', target: '企業', frontend: 'React (Next.js)',
  backend: 'Supabase', database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth', payment: 'Stripe',
  deploy: 'Vercel', data_entities: 'User, Team, Invoice', mvp_features: 'ユーザー登録, 請求管理',
  dev_methods: 'TDD', scale: 'medium',
};

function tokens(text) { return Math.round((text || '').length / 3.5); }

describe('v9.30: scope_out が CLAUDE.md / AI_BRIEF.md に反映', () => {
  for (const lang of ['ja', 'en']) {
    test('scope_out設定時 [' + lang + ']: CLAUDE.md禁止事項 + AI_BRIEF Stack節に出現', () => {
      const f = generate({ ...BASE, scope_out: '決済, モバイルアプリ' }, 'T', lang);
      const cm = String(f['CLAUDE.md'] || '');
      const br = String(f['AI_BRIEF.md'] || '');
      assert.ok(cm.includes('決済, モバイルアプリ'), 'CLAUDE.md missing scope_out value');
      assert.ok(cm.includes('.spec/constitution.md'), 'CLAUDE.md missing constitution pointer');
      assert.ok(br.includes('決済, モバイルアプリ'), 'AI_BRIEF.md missing scope_out value');
      assert.ok(br.includes(lang === 'ja' ? 'スコープ外' : 'Out of scope'), 'AI_BRIEF.md missing scope-out label');
      assert.ok(tokens(br) < 1400, 'AI_BRIEF.md over token budget: ' + tokens(br));
    });
  }

  test('scope_out「なし」: どちらにも行が追加されない', () => {
    const f = generate({ ...BASE, scope_out: 'なし' }, 'T', 'ja');
    assert.ok(!String(f['CLAUDE.md'] || '').includes('スコープ外機能の実装禁止'), 'CLAUDE.md should not add line for なし');
    assert.ok(!String(f['AI_BRIEF.md'] || '').includes('スコープ外: '), 'AI_BRIEF.md should not add line for なし');
  });

  test('scope_out未設定: 行なし・生成は正常', () => {
    const f = generate({ ...BASE }, 'T', 'ja');
    assert.ok(!String(f['CLAUDE.md'] || '').includes('スコープ外機能の実装禁止'));
    assert.ok(String(f['AI_BRIEF.md'] || '').length > 500, 'AI_BRIEF should generate normally');
  });
});
