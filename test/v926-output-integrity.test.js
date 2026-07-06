/**
 * v9.26 生成物 end-to-end 完全性 — 回帰テスト
 * ユニットテストが見逃す「実際にレンダリングされた成果物」の欠陥を検出:
 *  - コードフェンス外のテンプレートリテラル漏洩 (${...})
 *  - フィールド名ミスによる undefined 出力 (docs/41 の r.severity/msg_ja バグ回帰)
 *  - crown-jewel の有効性 (mcp-config/settings.json が有効JSON、コア資産が非空)
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

const ANSWERS = {
  purpose: 'SaaS型学習管理システム', target: '学生, 講師', frontend: 'React (Next.js)',
  backend: 'Supabase', database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth', payment: 'Stripe',
  deploy: 'Vercel', data_entities: 'User, Course, Lesson, Enrollment', mvp_features: 'ユーザー登録, コース管理, 決済',
  dev_methods: 'SDD, TDD', scale: 'medium', ai_tools: 'Claude Code', ai_auto: 'マルチAgent協調', admin: 'あり',
};

// remove fenced + inline code so we only inspect PROSE, where ${...} is always a bug
function stripCode(s) {
  return String(s).replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
}

describe('v9.26: 生成物 end-to-end 完全性', () => {
  for (const lang of ['ja', 'en']) {
    test('[' + lang + '] 散文中にテンプレートリテラル漏洩がない', () => {
      const f = generate({ ...ANSWERS }, 'T', lang);
      const leaks = [];
      for (const [p, c] of Object.entries(f)) {
        if (!p.endsWith('.md')) continue;
        const m = stripCode(c).match(/\$\{[a-zA-Z_][^}]*\}/g);
        if (m) leaks.push(p + ': ' + m.slice(0, 2).join(' | '));
      }
      assert.equal(leaks.length, 0, 'Template-literal leaks in prose:\n  ' + leaks.join('\n  '));
    });

    test('[' + lang + '] フィールド未定義による undefined 出力がない', () => {
      const f = generate({ ...ANSWERS }, 'T', lang);
      const bad = [];
      for (const [p, c] of Object.entries(f)) {
        if (!p.endsWith('.md')) continue;
        // ": undefined" or "**: undefined" or "undefined |" in a table = missing field
        if (/:\s*undefined|\*\*:\s*undefined|undefined\s*\|/.test(stripCode(c))) bad.push(p);
      }
      assert.equal(bad.length, 0, 'Undefined-field output in: ' + bad.join(', '));
    });
  }

  test('crown-jewel が有効JSON / 非空', () => {
    const f = generate({ ...ANSWERS }, 'T', 'ja');
    assert.doesNotThrow(() => JSON.parse(f['mcp-config.json']), 'mcp-config.json must be valid JSON');
    assert.doesNotThrow(() => JSON.parse(f['.claude/settings.json']), '.claude/settings.json must be valid JSON');
    assert.doesNotThrow(() => JSON.parse(f['.mcp/tools-manifest.json']), 'tools-manifest must be valid JSON');
    ['CLAUDE.md', 'AI_BRIEF.md', '.spec/specification.md', '.spec/constitution.md', 'README.md'].forEach(k => {
      assert.ok(f[k] && f[k].length >= 200, k + ' must exist and be substantial');
    });
  });

  test('docs/41 互換性アラートが実メッセージを表示 (r.severity/msg_ja バグ回帰)', () => {
    const f = generate({ ...ANSWERS }, 'T', 'ja');
    const d41 = f['docs/41_growth_intelligence.md'] || '';
    if (d41.includes('互換性アラート')) {
      assert.ok(!d41.includes(': undefined'), 'compat alerts must not render "undefined"');
    }
  });
});
