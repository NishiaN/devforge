/**
 * v9.38 ハーネス注入キー整合 + 衛生機能追記（UPP-H） — 回帰テスト
 *
 * 背景: sweep/compat-check は回答を手組み Object.assign で注入しており、アプリの
 * 実適用経路（start() の _SCALE_DEFAULTS 4層マージ + UPP）と乖離していた —
 * フィールドプリセットで16キー欠落・7キー値相違。この乖離の陰で、実アプリ回答では
 * compat が 46 ERROR + 4063 WARN 発火していた（手組み注入では 0/0 に見えていた）。
 * v9.38 で (1) 回答構築を test/app-answers.js（start() 経由）に統一、
 * (2) UPP-H 衛生機能追記でスタック・規模が要求する緩和策を明記し実回答でも 0/0 に。
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const app = require('./app-answers.js');
const sb = app.sb;

const SRC = path.join(__dirname, '..', 'src');

/* answer-keys.test.js と同じ正キー集合（questions.js id + S.answers.<k>= 代入） */
function collectValidKeys() {
  const keys = new Set();
  const qsrc = fs.readFileSync(path.join(SRC, 'data', 'questions.js'), 'utf8');
  for (const m of qsrc.matchAll(/id:'([a-zA-Z_][\w]*)'/g)) keys.add(m[1]);
  const walk = (dir, out) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, out);
      else if (e.name.endsWith('.js')) out.push(p);
    }
    return out;
  };
  for (const f of walk(SRC, [])) {
    const s = fs.readFileSync(f, 'utf8');
    for (const m of s.matchAll(/S\.answers\.([a-zA-Z_$][\w$]*)\s*=(?!=)/g)) keys.add(m[1]);
  }
  return keys;
}

describe('v9.38: ハーネス回答構築のアプリ経路統一', () => {

  test('sweep / compat-check は app-answers.js を使う（手組み注入への回帰を静的に拒否）', () => {
    for (const script of ['scripts/sweep-preset-integrity.js', 'scripts/compat-check-all-presets.js']) {
      const s = fs.readFileSync(path.join(__dirname, '..', script), 'utf8');
      assert.ok(/require\(['"]\.\.\/test\/app-answers(\.js)?['"]\)/.test(s),
        script + ' は test/app-answers.js を require すること');
      assert.ok(!/Object\.assign\(sb\.S\.answers/.test(s),
        script + ' に手組みの Object.assign(sb.S.answers 注入が残っていないこと');
    }
  });

  test('アプリ経路の回答キーは全て正キー集合内（注入キー整合の本体）', () => {
    const VALID = collectValidKeys();
    const samples = [
      app.answersForStandard(Object.keys(sb.PR)[0]),
      app.answersForStandard('saas'),
      app.answersForField(Object.keys(sb.PR_FIELD)[0], 'solo'),
      app.answersForField(Object.keys(sb.PR_FIELD)[0], 'large'),
    ];
    for (const ans of samples) {
      for (const k of Object.keys(ans)) {
        assert.ok(VALID.has(k), 'アプリ回答キー "' + k + '" が正キー集合にあること');
      }
    }
  });

  test('アプリ経路はフィールドプリセットに _SCALE_DEFAULTS スタックを与える（乖離の再発ガード）', () => {
    const key = Object.keys(sb.PR_FIELD)[0];
    const ans = app.answersForField(key, 'large');
    // 手組み注入時代はこの4キーが欠落していた（backend空 = 静的サイト扱いで生成が別物になる）
    for (const k of ['frontend', 'backend', 'deploy', 'database']) {
      assert.ok(ans[k], 'field preset の回答に ' + k + ' が設定されること (was: ' + JSON.stringify(ans[k]) + ')');
    }
    assert.equal(ans.scale, 'large');
  });
});

describe('v9.38: UPP-H 衛生機能追記（実アプリ回答での compat 0 ERROR/0 WARN）', () => {

  // v9.38 実測で発火していた代表組合せ（46E+4063W の主要源）— 全て 0 になったことを固定
  const PREV_FIRING = [
    ['field', 'eng_inspection', 'solo'],   // be-python-sync-driver + api-cors-wildcard
    ['field', 'eng_inspection', 'medium'], // api-cors-wildcard (Express)
    ['field', 'eng_inspection', 'large'],  // ai-canary-deploy + api-cors-wildcard (NestJS)
    ['field', 'edu_progress', 'large'],    // cl-payment-nowebhook + auth-no-mfa-payment
    ['field', 'med_symptom', 'small'],     // mt-supabase-no-rls (ERROR)
    ['field', 'cc_finance', 'small'],      // dom-childcare-minors
    ['field', 'fin_crypto', 'solo'],       // web3-nowalletauth
    ['field', 'eng5_digital_twin', 'solo'], // features空プリセット（UPP-Hが機能リストを生成）
    ['std', 'marketplace', null],          // ai-pii-masking
    ['std', 'medical_image_ai', null],     // ai-medical-legal-noguard
  ];

  for (const [kind, key, scale] of PREV_FIRING) {
    const label = kind === 'std' ? 'std:' + key : 'fld:' + key + ':' + scale;
    test('実アプリ回答で ERROR/WARN ゼロ — ' + label, () => {
      const dict = kind === 'std' ? sb.PR : sb.PR_FIELD;
      assert.ok(dict[key], key + ' がプリセットに存在すること（改名時はテストを更新）');
      const ans = kind === 'std' ? app.answersForStandard(key) : app.answersForField(key, scale);
      // vm sandbox の配列はホストと prototype が異なるため deepEqual は使わない
      const bad = sb.checkCompat(ans).filter(r => r.level === 'error' || r.level === 'warn');
      assert.equal(bad.length, 0, label + ' で ERROR/WARN が発火しないこと (fired: ' + bad.map(r => r.id).join(', ') + ')');
    });
  }

  test('UPP-H: 非BaaS APIサーバー構成に CORS 明示が追記される', () => {
    const ans = app.answersForField('eng_inspection', 'medium'); // Express
    assert.match(ans.mvp_features, /CORS/, 'CORSホワイトリスト設定が追記されること');
  });

  test('UPP-H: 決済×非solo は MFA、決済×large は Webhook が追記される', () => {
    const ansL = app.answersForField('edu_progress', 'large');
    assert.match(ansL.mvp_features, /MFA/, 'large: MFA 追記');
    assert.match(ansL.mvp_features, /Webhook/i, 'large: Stripe Webhook 追記');
    const ansS = app.answersForField('edu_progress', 'solo');
    assert.ok(!/MFA/.test(ansS.mvp_features || ''), 'solo: MFA は追記されない');
  });

  test('UPP-H: Supabase×マルチテナントに RLS が追記される（旧 46 ERROR の根絶）', () => {
    const ans = app.answersForField('med_symptom', 'small'); // small = Supabase
    assert.match(ans.mvp_features, /RLS/, 'RLS (Row Level Security) が追記されること');
  });

  test('UPP-H: features 空のプリセットでも機能リストが生成される（先頭カンマなし）', () => {
    const ans = app.answersForField('eng5_digital_twin', 'solo');
    assert.ok(ans.mvp_features && ans.mvp_features.length > 0, 'mvp_features が非空になること');
    assert.ok(!/^\s*,/.test(ans.mvp_features), '先頭に区切りカンマが残らないこと');
  });

  test('UPP-H2: SEO重要ドメイン×solo は CSR-only を回避する', () => {
    // portfolio ドメインの field preset を動的に特定（detectDomain 依存）
    const key = Object.keys(sb.PR_FIELD).find(k =>
      ['content', 'media', 'ec', 'creator', 'newsletter', 'portfolio', 'travel']
        .includes(sb.detectDomain(sb.PR_FIELD[k].purpose || '')));
    assert.ok(key, 'SEOドメインの field preset が存在すること');
    const ans = app.answersForField(key, 'solo');
    assert.ok(!/(React|Vue|Angular|Svelte)\b/i.test(ans.frontend) || /(Next|Nuxt|SvelteKit|Astro)/i.test(ans.frontend),
      'solo でも CSR-only にならないこと (frontend: ' + ans.frontend + ')');
  });

  test('be-python-sync-driver: asyncpg 明記で発火しない脱出条件（ルール校正の回帰）', () => {
    const rule = sb.COMPAT_RULES.find(r => r.id === 'be-python-sync-driver');
    assert.ok(rule, 'ルールが存在すること');
    const base = { backend: 'Python (FastAPI)', database: 'PostgreSQL', mvp_features: 'タスク管理' };
    assert.equal(rule.t(base), true, '緩和策なしでは発火する（ルールが死んでいない）');
    assert.equal(rule.t({ ...base, mvp_features: 'タスク管理, 非同期DBドライバ（asyncpg）' }), false, 'features の asyncpg で脱出');
    assert.equal(rule.t({ ...base, orm: 'SQLAlchemy + asyncpg' }), false, 'orm の asyncpg で脱出');
  });
});
