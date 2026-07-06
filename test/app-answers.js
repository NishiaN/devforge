/**
 * app-answers.js — アプリ実適用経路の回答ビルダー（v9.38）
 *
 * sweep/compat-check/テストがプリセットから回答を組む時、手組みの Object.assign では
 * アプリの実回答と乖離する（v9.36: scale欠落が5ヶ月不可視 / v9.37-38実測:
 * フィールドプリセットで16キー欠落・7キー値相違 — _SCALE_DEFAULTS 4層マージ不通過）。
 * 本モジュールは ui/presets.js の start() を DOM 最小スタブで直接呼び、
 * アプリが実際に作る回答オブジェクトをそのまま返す。
 *
 * 使い方:
 *   const app = require('../test/app-answers.js');   // harness を内部で共有
 *   const ans = app.answersForStandard('saas');
 *   const ans2 = app.answersForField('edu_progress', 'large');
 *   app.sb — 背後の harness sandbox（checkCompat 等へのアクセス用）
 *
 * 注意: data/presets*.js は harness が全ロード済み。ここで再ロードすると
 * PR/PR_FIELD が基本セットに巻き戻るため、loadModule しないこと。
 */
const h = require('./harness.js');
const sb = h.sandbox;

// start() が触る UI 依存の最小スタブ（$('nameIn').value がプロジェクト名になる）
const _fakeEl = () => ({ value: 'Test Project', style: {}, classList: { add() {}, remove() {}, toggle() {} } });
sb.$ = () => _fakeEl();
sb.sanitizeName = s => s;
sb.sanitize = s => s;
sb.toast = () => {}; sb.save = () => {}; sb.saveProject = () => {};
sb.initPills = () => {}; sb.updProgress = () => {}; sb.showQ = () => {};
sb.addMsg = () => {}; sb.initSidebar = () => {};
h.loadModule('data/questions.js');
h.loadModule('data/compat-rules.js');
h.loadModule('generators/common.js'); // detectDomain
h.loadModule('ui/presets.js');        // start() / _applyUniversalPostProcess

function resetS(overrides) {
  sb.S = Object.assign({
    phase: 0, step: 0, answers: {}, projectName: 'Test Project',
    skill: 'intermediate', preset: 'custom', lang: 'ja',
    genLang: 'ja', theme: 'dark', pillar: 0, previewFile: null,
    files: {}, skipped: [], progress: {},
    editedFiles: {}, prevFiles: {}, _v: 9, skillLv: 3,
    pinnedFiles: [], recentFiles: [], exportedOnce: false, compatAcked: [],
  }, overrides || {});
}

/** 標準プリセット key → アプリ start() が作る回答（deep copy） */
function answersForStandard(key, opts) {
  resetS(Object.assign({ preset: key }, (opts && opts.S) || {}));
  sb.start();
  return JSON.parse(JSON.stringify(sb.S.answers));
}

/** フィールドプリセット key + scale → アプリ start() が作る回答（deep copy） */
function answersForField(key, scale, opts) {
  resetS(Object.assign({ preset: 'field:' + key }, (opts && opts.S) || {}));
  sb._fieldScale = scale;
  sb._selectedThemeOverlays = new Set();
  sb.start();
  return JSON.parse(JSON.stringify(sb.S.answers));
}

module.exports = { sb, resetS, answersForStandard, answersForField };
