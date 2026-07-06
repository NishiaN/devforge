/**
 * v9.23 Pro深度バッチ — スキルLv適応 28/28 完結の回帰テスト
 * 12柱 (p5/p10/p13/p14/p15/p16/p17/p18/p19/p24/p26/p28) の
 * Pro (skillLv>=5) セクション出現 / Int (3) 非出現 / Beg (<=1) 入門出現 を検証。
 * ~16 tests
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// snapshot.test.js のハーネス (eval ロード部 + generate 定義) を流用
// const宣言はevalスコープ外に漏れないため var 化 (S をこのファイルから参照可能に)
const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

const ANSWERS = {
  purpose: 'SaaS型学習管理システム', target: '学生, 講師, 管理者',
  frontend: 'React (Next.js)', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
  auth: 'Supabase Auth', payment: 'Stripe', deploy: 'Vercel',
  data_entities: 'User, Course, Lesson, Enrollment, Progress, Review',
  mvp_features: 'ユーザー登録, コース管理, 決済, 進捗トラッキング',
  dev_methods: 'SDD, TDD', scale: 'medium', ai_tools: 'Claude Code, Cursor',
  ai_auto: 'マルチAgent協調', admin: 'あり', mobile: 'なし',
};

// { file: [ProマーカーJA, 柱名] }
const PRO_MARKERS = {
  'docs/73_enterprise_architecture.md': ['エンタープライズ認証統合', 'p19'],
  'docs/53_ops_runbook.md': ['プログレッシブデリバリー', 'p14'],
  'docs/103_observability_architecture.md': ['サンプリング戦略 (Head vs Tail)', 'p26'],
  'docs/105_metrics_alerting.md': ['マルチウィンドウ・マルチバーンレート', 'p26'],
  'docs/95_ai_safety_framework.md': ['レッドチーム評価のCI自動化', 'p24'],
  'docs/128_xai_intelligence_architecture.md': ['反実仮想説明', 'p28'],
  'docs/32_qa_blueprint.md': ['フレーキーテスト隔離', 'p5'],
  'docs/50_stakeholder_strategy.md': ['RICE優先度スコアリング', 'p13'],
  'docs/56_market_positioning.md': ['シナリオプランニング', 'p15'],
  'docs/60_methodology_intelligence.md': ['DORA 4メトリクス計測ガイド', 'p16'],
  'docs/65_prompt_genome.md': ['プロンプト評価ハーネス設計', 'p17'],
  'docs/69_prompt_ops_pipeline.md': ['プロンプト回帰テストCI', 'p18'],
};

const BEG_MARKERS = {
  'docs/53_ops_runbook.md': ['運用はじめの3ステップ', 'p14'],
  'docs/95_ai_safety_framework.md': ['AI安全はじめの3ステップ', 'p24'],
  'docs/32_qa_blueprint.md': ['品質保証はじめの3ステップ', 'p5'],
  'docs/29_reverse_engineering.md': ['リバースエンジニアリング（逆算設計）とは', 'p10'],
};

function genAt(lv, genLang) {
  S.skillLv = lv;
  const files = generate({ ...ANSWERS }, 'LMS', genLang || 'ja'); // generate()が第3引数でS.genLangを設定
  S.skillLv = undefined; S.genLang = 'ja';
  return files;
}

describe('v9.23: Pro (skillLv=5) セクション出現', () => {
  const files = genAt(5);
  for (const [file, [marker, pillar]] of Object.entries(PRO_MARKERS)) {
    test(pillar + ': ' + file + ' に Pro節 (' + marker + ')', () => {
      assert.ok(files[file], file + ' should exist');
      assert.ok(files[file].includes(marker), pillar + ' Pro marker "' + marker + '" should appear at skillLv=5');
    });
  }
  test('p10: docs/29 にアーキテクチャ適応度関数 (Pro)', () => {
    assert.ok(files['docs/29_reverse_engineering.md'].includes('アーキテクチャ適応度関数'));
  });
});

describe('v9.23: Int (skillLv=3) では Pro/Beg 節が非出現 (ADD-only検証)', () => {
  const files = genAt(3);
  test('全Proマーカーが intermediate 出力に存在しない', () => {
    for (const [file, [marker, pillar]] of Object.entries(PRO_MARKERS)) {
      assert.ok(files[file], file + ' should exist');
      assert.ok(!files[file].includes(marker), pillar + ' Pro marker must NOT appear at skillLv=3');
    }
    assert.ok(!files['docs/29_reverse_engineering.md'].includes('アーキテクチャ適応度関数'));
  });
  test('全Begマーカーが intermediate 出力に存在しない', () => {
    for (const [file, [marker, pillar]] of Object.entries(BEG_MARKERS)) {
      assert.ok(!files[file].includes(marker), pillar + ' Beg marker must NOT appear at skillLv=3');
    }
  });
});

describe('v9.23: Beg (skillLv=0) 入門出現', () => {
  const files = genAt(0);
  test('4柱のBeg入門が出現する', () => {
    for (const [file, [marker, pillar]] of Object.entries(BEG_MARKERS)) {
      assert.ok(files[file], file + ' should exist');
      assert.ok(files[file].includes(marker), pillar + ' Beg intro "' + marker + '" should appear at skillLv=0');
    }
  });
});

describe('v9.23: EN出力のバイリンガル整合', () => {
  const files = genAt(5, 'en');
  test('EN Pro節が英語で出現 (p14/p16/p19)', () => {
    assert.ok(files['docs/53_ops_runbook.md'].includes('Progressive Delivery'), 'p14 EN Pro');
    assert.ok(files['docs/60_methodology_intelligence.md'].includes('DORA Four Keys'), 'p16 EN Pro');
    assert.ok(files['docs/73_enterprise_architecture.md'].includes('Enterprise Auth Integration'), 'p19 EN Pro');
  });
  test('EN Pro節に日本語見出しが混入しない', () => {
    const seg = files['docs/53_ops_runbook.md'].split('Progressive Delivery')[1] || '';
    assert.ok(!seg.includes('カナリア分析メトリクス'), 'JA table must not leak into EN output');
  });
});
