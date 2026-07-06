/**
 * v9.37 scale伝播の実挙動 — 回帰テスト
 * v9.36 で S.answers.scale がフィールドプリセット適用時に初めて書き込まれるようになった
 * （それ以前は生成30箇所+compat116参照が常時 'medium' フォールバック）。
 * answer-keys.test.js は「代入行が存在する」静的検査のみ — 本テストは伝播チェーン全体を
 * 実挙動で固定する:
 *   1. アプリの実適用関数 start() が4スケール全てで S.answers.scale を書き込む
 *   2. scaleゲート付き生成コンテンツが solo で省略 / large で出力される
 *      （回答を固定し scale のみ反転 → 純粋に a.scale で分岐することを検証）
 *   3. p:['scale'] を持つ compat ルールがアプリ構築回答で発火する
 *      （scale キー欠落時は p ゲートで全スキップ = v9.20〜v9.35 の死に状態の再現ガード）
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// ── アプリ適用経路 (harness sandbox + ui/presets.js の start()) ──
const h = require('./harness.js');
const sb = h.sandbox;
// start() が触る UI 依存の最小スタブ（$('nameIn').value がプロジェクト名になる）
const _fakeEl = () => ({ value: 'ScaleTest', style: {}, classList: { add() {}, remove() {}, toggle() {} } });
sb.$ = () => _fakeEl();
sb.sanitizeName = s => s; sb.sanitize = s => s;
sb.toast = () => {}; sb.save = () => {}; sb.saveProject = () => {};
sb.initPills = () => {}; sb.updProgress = () => {}; sb.showQ = () => {};
sb.addMsg = () => {}; sb.initSidebar = () => {};
h.loadModule('data/questions.js');
h.loadModule('data/presets.js');
h.loadModule('data/compat-rules.js');
h.loadModule('generators/common.js');
h.loadModule('ui/presets.js');

const FIELD_KEY = 'edu_progress'; // presets.js 定義の分野プリセット（meta.revenue=subscription → payment 推論あり）

function answersViaApp(scale) {
  sb.S = {
    phase: 0, step: 0, answers: {}, projectName: '', skill: 'intermediate', skillLv: 3,
    preset: 'field:' + FIELD_KEY, lang: 'ja', genLang: 'ja', theme: 'dark', pillar: 0, previewFile: null,
    files: {}, skipped: [], progress: {}, editedFiles: {}, prevFiles: {}, pinnedFiles: [], recentFiles: [],
    exportedOnce: false, compatAcked: [], _v: 9,
  };
  sb._fieldScale = scale; // スケールボタン選択に相当
  sb._selectedThemeOverlays = new Set();
  sb.start(); // アプリの実適用関数（4層マージ + _applyUniversalPostProcess）
  return JSON.parse(JSON.stringify(sb.S.answers));
}

// ── 生成ハーネス (snapshot prefix 流用 — v934 と同方式) ──
const _snapSrc = fs.readFileSync('test/snapshot.test.js', 'utf8');
eval(_snapSrc.slice(0, _snapSrc.indexOf('describe(')).replace('const S = {', 'var S = {'));

// scale ゲート付きコンテンツ: [説明, jaマーカー, enマーカー, ソース]
const LARGE_ONLY_MARKERS = [
  ['p25 容量計画セクション', 'ピーク QPS', 'Peak QPS', 'p25-performance.js (scale!==solo)'],
  ['p21 AMQP推奨 (payment×large)', 'AMQP/メッセージキュー推奨条件', 'AMQP / Message Queue Recommendation', 'p21-api.js _isLarge83'],
  ['p12 認可変更監査 (large)', '認可ルールのバージョン管理', 'versioned authorization rules', 'p12-security.js _isLarge43'],
  ['p12 OAuth+PKCE (non-solo)', 'OAuth 2.0 + PKCE 認可フロー', 'OAuth 2.0 + PKCE Authorization Flow', 'p12-security.js (scale!==solo)'],
  ['p22 レプリケーション (non-solo)', 'レプリケーション & シャーディングパターン', 'Replication & Sharding Patterns', 'p22-database.js (scale!==solo)'],
  ['p2 チームDevContainer (non-solo)', 'チーム開発DevContainer標準化', 'Team DevContainer Standardization', 'p2-devcontainer.js (scale!==solo)'],
  ['p20 エラーバジェットゲート (non-solo)', 'エラーバジェットデプロイゲート', 'Error Budget Deploy Gate', 'p20-cicd.js isSolo'],
];

const _hitAny = (files, marker) => Object.values(files).some(c => String(c).includes(marker));

describe('v9.37: scale伝播の実挙動（アプリ適用経路 → 生成 → compat）', () => {

  test('start() が4スケール全てで S.answers.scale を書き込む', () => {
    assert.ok(sb.PR_FIELD && sb.PR_FIELD[FIELD_KEY], FIELD_KEY + ' が PR_FIELD に存在すること（改名時はテストを更新）');
    for (const scale of ['solo', 'small', 'medium', 'large']) {
      const ans = answersViaApp(scale);
      assert.equal(ans.scale, scale, 'S.answers.scale が UI 選択値 ' + scale + ' になること');
      assert.ok(ans._meta_regulation, '_meta_regulation も適用時に設定されること (v9.36)');
    }
  });

  test('scaleのみ反転で scaleゲート付きコンテンツが分岐する（ja生成）', () => {
    const ansLarge = answersViaApp('large');
    const ansSoloFlip = { ...ansLarge, scale: 'solo' }; // 回答固定・scaleのみ反転（スタック交絡の除去）
    const fL = generate({ ...ansLarge }, 'ScaleTest', 'ja');
    const fS = generate({ ...ansSoloFlip }, 'ScaleTest', 'ja');
    for (const [label, jaMarker, , src] of LARGE_ONLY_MARKERS) {
      assert.ok(_hitAny(fL, jaMarker), label + ': large 生成に出力されること [' + src + ']');
      assert.ok(!_hitAny(fS, jaMarker), label + ': solo 生成では省略されること [' + src + ']');
    }
    // scale だけで実際に差分が生まれること（伝播が生きている総合指標; 実測23/224ファイル）
    const diffCount = Object.keys(fL).filter(f => f in fS && fL[f] !== fS[f]).length;
    assert.ok(diffCount >= 10, 'scale反転だけで10ファイル以上に差分が出ること (実測: ' + diffCount + ')');
  });

  test('scaleのみ反転で scaleゲート付きコンテンツが分岐する（en生成）', () => {
    const ansLarge = answersViaApp('large');
    const ansSoloFlip = { ...ansLarge, scale: 'solo' };
    const fL = generate({ ...ansLarge }, 'ScaleTest', 'en');
    const fS = generate({ ...ansSoloFlip }, 'ScaleTest', 'en');
    for (const [label, , enMarker, src] of LARGE_ONLY_MARKERS) {
      assert.ok(_hitAny(fL, enMarker), label + ': [en] large 生成に出力されること [' + src + ']');
      assert.ok(!_hitAny(fS, enMarker), label + ': [en] solo 生成では省略されること [' + src + ']');
    }
  });

  test('p25 容量計画の数値が large で拡大される (_isLargeScale)', () => {
    const ansLarge = answersViaApp('large');
    const fL = generate({ ...ansLarge }, 'ScaleTest', 'ja');
    const fM = generate({ ...ansLarge, scale: 'medium' }, 'ScaleTest', 'ja');
    const perfL = Object.entries(fL).filter(([, c]) => String(c).includes('ピーク QPS')).map(([, c]) => c).join('\n');
    const perfM = Object.entries(fM).filter(([, c]) => String(c).includes('ピーク QPS')).map(([, c]) => c).join('\n');
    assert.ok(/\*\*180\*\*/.test(perfL), 'large: ピーク QPS 180 (MAU 100,000 前提)');
    assert.ok(/\*\*18\*\*/.test(perfM) && !/\*\*180\*\*/.test(perfM), 'medium: ピーク QPS 18 (MAU 10,000 前提)');
  });

  test("p:['scale'] を持つ compat ルールがアプリ構築回答で発火する", () => {
    const scaleRuleIds = new Set(sb.COMPAT_RULES.filter(r => (r.p || []).includes('scale')).map(r => r.id));
    assert.ok(scaleRuleIds.size >= 5, 'scale を p ゲートに持つルールが存在すること');
    const ansLarge = answersViaApp('large');
    const firedLarge = (sb.checkCompat(ansLarge) || []).map(i => i.id).filter(id => scaleRuleIds.has(id));
    assert.ok(firedLarge.length >= 1, 'large でscaleゲート付きルールが1件以上発火すること (実測: ops-large-no-runbook 等)');
    // scale キーを消すと p ゲートで全スキップ = v9.36 以前の死に状態（回帰ガード）
    const ansNoScale = { ...ansLarge };
    delete ansNoScale.scale;
    const firedNoScale = (sb.checkCompat(ansNoScale) || []).map(i => i.id).filter(id => scaleRuleIds.has(id));
    assert.equal(firedNoScale.length, 0, 'scale 欠落時は p ゲートにより発火ゼロ（欠落検知は answer-keys.test.js 側の責務）');
  });
});
