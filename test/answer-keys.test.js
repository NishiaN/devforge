/* ═══ v9.36: 回答キー誤用の静的検査 ═══
 * questions.js の質問id集合 + src全域の S.answers.<key>= 代入集合を「正キー集合」とし、
 * ジェネレータ / compat-rules の a.<key> 参照・p配列・fix先フィールドを突き合わせる。
 * 背景: v9.35で a.entities/a.features 誤用6箇所が5ヶ月潜伏（誤キー+妥当なフォールバックは
 * undefined掃引に映らない）。v9.36で compat-rules 側にも6箇所+発火不能ルール2本を発見。 */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

function walkJs(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkJs(p, out);
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}

/* ── 正キー集合の構築 ── */
function collectValidKeys() {
  const keys = new Set();
  const qsrc = fs.readFileSync(path.join(SRC, 'data', 'questions.js'), 'utf8');
  for (const m of qsrc.matchAll(/id:'([a-zA-Z_][\w]*)'/g)) keys.add(m[1]);
  for (const f of walkJs(SRC, [])) {
    const s = fs.readFileSync(f, 'utf8');
    // S.answers.<key> = ...（==/=== を除外）
    for (const m of s.matchAll(/S\.answers\.([a-zA-Z_$][\w$]*)\s*=(?!=)/g)) keys.add(m[1]);
  }
  return keys;
}

/* 単独変数 a のプロパティ参照を抽出（data.a.x 等は前方の . / 識別子文字で除外） */
function scanARefs(src) {
  const refs = [];
  const re = /(?<![\w$.])a\.([a-zA-Z_$][\w$]*)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const line = src.slice(0, m.index).split('\n').length;
    refs.push({ key: m[1], line });
  }
  return refs;
}

const VALID = collectValidKeys();

test('正キー集合: 質問id26件+代入キーを含む', () => {
  for (const k of ['purpose', 'data_entities', 'mvp_features', 'scale', 'dev_schedule', 'skill_level', 'scope_out']) {
    assert.ok(VALID.has(k), `正キー集合に ${k} が含まれること`);
  }
  assert.ok(VALID.size >= 26, `正キー集合は26件以上（実際: ${VALID.size}）`);
  // 誤用キーが「正キー」として混入していないこと（=誰も S.answers.entities= と書いていない）
  assert.ok(!VALID.has('entities'), '誤キー entities が代入されていないこと');
  assert.ok(!VALID.has('features'), '誤キー features が代入されていないこと');
});

test('ジェネレータ全域: a.<key> 参照が全て正キー集合内', () => {
  const genDir = path.join(SRC, 'generators');
  const violations = [];
  for (const f of walkJs(genDir, [])) {
    const src = fs.readFileSync(f, 'utf8');
    for (const r of scanARefs(src)) {
      if (!VALID.has(r.key)) violations.push(path.basename(f) + ':' + r.line + ' a.' + r.key);
    }
  }
  assert.deepStrictEqual(violations, [], '未知の回答キー参照: ' + violations.join(', '));
});

test('ジェネレータ: 旧誤用キー a.entities / a.features を全面禁止（v9.35回帰）', () => {
  for (const f of walkJs(path.join(SRC, 'generators'), [])) {
    const src = fs.readFileSync(f, 'utf8');
    assert.ok(!/(?<![\w$.])a\.entities\b/.test(src), path.basename(f) + ': a.entities は常にundefined（正: a.data_entities）');
    assert.ok(!/(?<![\w$.])a\.(features)\b(?!\w)/.test(src), path.basename(f) + ': a.features は常にundefined（正: a.mvp_features）');
  }
});

test('compat-rules: t/cond/fixFn 内の a.<key> 参照が全て正キー集合内', () => {
  const src = fs.readFileSync(path.join(SRC, 'data', 'compat-rules.js'), 'utf8');
  const violations = [];
  for (const r of scanARefs(src)) {
    if (!VALID.has(r.key)) violations.push('compat-rules.js:' + r.line + ' a.' + r.key);
  }
  assert.deepStrictEqual(violations, [], '未知の回答キー参照: ' + violations.join(', '));
});

test('compat-rules: p配列（前提ゲート）のキーが全て正キー集合内', () => {
  // p にない正キーでも p ゲートは真偽判定に使うだけだが、存在しないキーは「絶対に発火しないルール」を生む
  const src = fs.readFileSync(path.join(SRC, 'data', 'compat-rules.js'), 'utf8');
  const violations = [];
  for (const m of src.matchAll(/p:\[([^\]]*)\]/g)) {
    const line = src.slice(0, m.index).split('\n').length;
    for (const km of m[1].matchAll(/'([\w]+)'/g)) {
      if (!VALID.has(km[1])) violations.push('compat-rules.js:' + line + " p:'" + km[1] + "'");
    }
  }
  assert.deepStrictEqual(violations, [], '発火不能ルール（存在しない前提キー）: ' + violations.join(', '));
});

test('compat-rules: fix/fixFn/chain の書込先 f キーが全て正キー集合内', () => {
  // f が誤キーだと「修正を適用」ボタンが何も直さない（S.answers[誤キー] への無効書込）
  const src = fs.readFileSync(path.join(SRC, 'data', 'compat-rules.js'), 'utf8');
  const violations = [];
  for (const m of src.matchAll(/\bf:'([\w]+)'/g)) {
    if (!VALID.has(m[1])) {
      const line = src.slice(0, m.index).split('\n').length;
      violations.push('compat-rules.js:' + line + " f:'" + m[1] + "'");
    }
  }
  assert.deepStrictEqual(violations, [], '無効な修正書込先: ' + violations.join(', '));
});

test('presets.js: フィールドプリセット適用が S.answers.scale を設定（v9.36回帰）', () => {
  // scale はウィザード質問に無くプリセットUI選択のみが供給源。未設定だと
  // ジェネレータ30箇所+compatルール~116参照が常にmediumフォールバックになる
  const src = fs.readFileSync(path.join(SRC, 'ui', 'presets.js'), 'utf8');
  assert.ok(/S\.answers\.scale=_fieldScale/.test(src), 'S.answers.scale=_fieldScale の設定が存在すること');
});
