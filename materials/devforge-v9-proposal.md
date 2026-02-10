# DevForge v9.0 進化提案書
## v8.3 → v9.0 Evolution Proposal

> 作成日: 2026-02-08
> 作成者: Claude (Anthropic) for にしあん
> 対象: エンジニアリングのタネ制作委員会

---

## 1. 現状分析 (v8.3 As-Is)

### 1.1 アーキテクチャ概要

```
devforge-v8.html (単一ファイル 240KB)
├── HTML:     140行  ( 4%)  ← 最小限のDOM骨格
├── CSS:      408行  (16%)  ← カスタムプロパティ + ダーク/ライト
└── JS:     2,502行  (80%)  ← 89関数・全ロジック
    ├── State管理:        S オブジェクト + localStorage
    ├── I18N:             I18N辞書 + t() + G ternary
    ├── プリセット:       26テンプレート（JA/EN対応）
    ├── ウィザード:       Phase 1-3 質問フロー
    ├── ファイル生成:     8関数 → 60+ファイル
    ├── プレビュー:       marked.js + mermaid.js
    ├── エクスポート:     ZIP / PDF / URL / Copy
    ├── ダッシュボード:   トークン数・モデル適合度
    └── TechDB:          230+エントリ
```

### 1.2 数値で見る現状

| 指標 | 値 | 評価 |
|------|-----|------|
| 総ファイルサイズ | 240KB | ⚠️ 単一ファイルの限界に近い |
| JavaScript比率 | 80% (170KB) | ⚠️ DOM操作とテンプレートが混在 |
| 関数数 | 89 | ⚠️ 名前空間汚染 (全てグローバル) |
| createElement呼び出し | 57回 | ⚠️ 手動DOM操作が多い |
| innerHTML代入 | 41回 | ⚠️ XSSリスク（自己完結なので実害は低い） |
| G? 三項演算子 | 157箇所 | ⚠️ テンプレート内の可読性低下 |
| JA-onlyのまま残存 | 511行 | 🔴 TechDB 231行 + UI残り275行 |
| CDN依存 | 3 (JSZip, marked, mermaid) | ✅ 最小限 |
| ビルドツール | 不要 | ✅ ゼロ設定 |
| プリセット | 26種 (JA/EN) | ✅ 充実 |

### 1.3 強み（維持すべき点）

1. **ゼロ設定**: ブラウザで開くだけで動作
2. **完全オフライン**: CDN読み込み後はネット不要
3. **シングルファイル**: 配布・共有が極めて容易
4. **対話型UX**: チャット風ウィザードの親しみやすさ
5. **60+ファイル生成**: 7つの柱による網羅的カバレッジ
6. **バイリンガル**: UI + 生成ファイルの JA/EN 対応

### 1.4 課題（v9で解決すべき点）

| 優先度 | 課題 | 影響 |
|--------|------|------|
| 🔴 P0 | TechDB 231行が日本語のみ | 英語ユーザーに不完全な体験 |
| 🔴 P0 | グローバル関数89個 | 名前衝突・保守性の低下 |
| 🟡 P1 | 再生成時に差分が見えない | ユーザーが変更箇所を把握不能 |
| 🟡 P1 | 生成ファイルの編集機能なし | 生成後の微調整ができない |
| 🟡 P1 | AI連携機能なし | "AI駆動"を謳いながらAI未活用 |
| 🟢 P2 | 単一ファイル240KBの肥大化 | 開発時のナビゲーション困難 |
| 🟢 P2 | テスト自動化なし | リグレッション検出が手動 |
| 🟢 P2 | Pillar⑤並列探索が未実装 | 7つの柱のうち1つが欠落 |

---

## 2. v9.0 設計方針

### 2.1 基本原則

```
"単一ファイルの美学を守りつつ、開発体験を近代化する"
```

1. **配布は引き続きシングルファイル** — ユーザーが受け取るのは1つのHTML
2. **開発はモジュール分割** — ビルドで結合して単一ファイルに
3. **段階的移行** — 一度に全て変えず、フェーズ分けで進化
4. **後方互換** — v8のlocalStorageデータをv9で読み込み可能

### 2.2 アーキテクチャ (To-Be)

```
devforge-v9/
├── src/
│   ├── index.html              ← HTMLシェル
│   ├── styles/
│   │   ├── base.css            ← リセット + カスタムプロパティ
│   │   ├── components.css      ← UIコンポーネント
│   │   ├── wizard.css          ← ウィザード固有
│   │   └── themes.css          ← ダーク/ライト
│   ├── core/
│   │   ├── state.js            ← Sオブジェクト + save/load + migration
│   │   ├── i18n.js             ← I18N辞書 + t() + applyLang()
│   │   ├── router.js           ← 画面遷移管理
│   │   └── events.js           ← ショートカット + イベント委譲
│   ├── data/
│   │   ├── presets.js           ← 26プリセット (JA/EN)
│   │   ├── techdb.js            ← 230+ TechDB (JA/EN)
│   │   └── questions.js         ← Phase 1-3 質問定義
│   ├── generators/
│   │   ├── index.js             ← generateAll orchestrator
│   │   ├── pillar1-sdd.js       ← .spec/ 5ファイル
│   │   ├── pillar2-devcontainer.js
│   │   ├── pillar3-mcp.js
│   │   ├── pillar4-airules.js
│   │   ├── pillar5-explore.js   ← 🆕 並列探索
│   │   ├── pillar7-roadmap.js
│   │   ├── docs.js              ← 23ドキュメント
│   │   └── common.js            ← README等
│   ├── ui/
│   │   ├── wizard.js            ← チャットUI + 質問レンダリング
│   │   ├── preview.js           ← ファイルツリー + プレビュー
│   │   ├── dashboard.js         ← Context Dashboard
│   │   ├── editor.js            ← 🆕 インラインエディタ
│   │   └── export.js            ← ZIP/PDF/URL/Copy
│   └── app.js                   ← エントリポイント
├── build.js                     ← 結合スクリプト (20行)
├── devforge-v9.html             ← ビルド出力 (配布用)
├── package.json
├── CLAUDE.md
└── ...
```

### 2.3 ビルドシステム

**最小構成**: フレームワーク導入はしない。`build.js` 1ファイルで結合。

```javascript
// build.js — 20行のビルドスクリプト
const fs = require('fs');
const html = fs.readFileSync('src/index.html', 'utf8');
const css = ['base','components','wizard','themes']
  .map(f => fs.readFileSync(`src/styles/${f}.css`, 'utf8')).join('\n');
const js = ['core/state','core/i18n','core/router','core/events',
  'data/presets','data/techdb','data/questions',
  'generators/index','generators/pillar1-sdd',/*...*/
  'ui/wizard','ui/preview','ui/dashboard','ui/editor','ui/export',
  'app']
  .map(f => fs.readFileSync(`src/${f}.js`, 'utf8')).join('\n');

const out = html
  .replace('/* __CSS__ */', css)
  .replace('/* __JS__ */', `(function(){${js}})();`); // IIFE で名前空間隔離
fs.writeFileSync('devforge-v9.html', out);
console.log(`✅ Built: ${(out.length/1024).toFixed(0)}KB`);
```

**メリット**: ゼロ依存、Node.js があれば動作、3秒でビルド完了。

---

## 3. 新機能提案

### 3.1 🆕 Pillar ⑤ 並列探索エンジン (P1)

v8で未実装だったPillar⑤を実現。ユーザーの回答に基づき、複数の技術構成パターンを自動生成・比較。

```
┌─────────────────────────────────────────────┐
│  📊 並列探索: 3パターン比較                  │
├─────────┬─────────┬─────────────────────────┤
│ 🟢 堅実 │ 🟡 均衡 │ 🔴 先進                 │
├─────────┼─────────┼─────────────────────────┤
│ Next.js │ Remix   │ Astro + HTMX            │
│ Prisma  │ Drizzle │ EdgeDB                   │
│ Vercel  │ Railway │ Fly.io + Cloudflare      │
├─────────┼─────────┼─────────────────────────┤
│ 学習: ★☆│ 学習: ★★│ 学習: ★★★              │
│ 速度: ★★│ 速度: ★★│ 速度: ★★★              │
│ 安定: ★★★│安定: ★★│ 安定: ★☆               │
└─────────┴─────────┴─────────────────────────┘
  [🟢 この構成で生成] [比較PDFをエクスポート]
```

**実装方針**: TechDB 230+エントリのメタデータ（安定性・学習コスト・パフォーマンス）を活用し、ユーザーのスキルレベル・納期・チーム規模に応じてスコアリング。

### 3.2 🆕 インラインエディタ (P1)

生成後のファイルをブラウザ内で直接編集可能に。

```
┌─────────────────────────────────────────────┐
│ 📝 .spec/constitution.md          [保存][↩️] │
├─────────────────────────────────────────────┤
│ # MyApp — Project Constitution              │
│                                             │
│ ## 1. Mission                               │
│ Build a subscription platform for...  ← 編集│
│                                             │
│ ## 2. Target Users                          │
│ Startups, SMBs                     ← 編集  │
├─────────────────────────────────────────────┤
│ 💡 変更あり: 保存してエクスポートに反映     │
└─────────────────────────────────────────────┘
```

**実装**: `<textarea>` + `S.files[path]` の双方向バインド。変更マーカー付き。

### 3.3 🆕 差分ビュー (P1)

設定変更後の再生成時に、前回との差分をハイライト表示。

```
constitution.md  [+12行 -3行 ~5行]
─────────────────────────────────
  ## 4. Tech Principles            (unchanged)
- - Frontend: React + Next.js      (removed)
+ - Frontend: Vue + Nuxt           (added)
  - Backend: Node.js + Express     (unchanged)
+ - Mobile: React Native           (added)
```

**実装**: 簡易 diff アルゴリズム (Myers diff の簡略版、50行程度)。再生成前に `S.prevFiles` にスナップショット保存。

### 3.4 🆕 AI連携プロンプトランチャー (P2)

生成ファイルを直接AIツールに投入するワンクリック機能。

```
┌────────────────────────────────────────┐
│ 🤖 AI連携                              │
├────────────────────────────────────────┤
│ [Claude] 全仕様書をClaudeに送信        │
│ [Cursor] .cursor/rules をコピー        │
│ [ChatGPT] カスタムInstructionsに変換   │
│ [Copilot] copilot-instructions コピー  │
├────────────────────────────────────────┤
│ 📋 カスタムプロンプト生成              │
│ "この仕様書を元に [______] を作って"   │
│                          [生成&コピー] │
└────────────────────────────────────────┘
```

### 3.5 🆕 プロジェクトインポート (P2)

既存プロジェクトの `package.json` や `README.md` をドラッグ&ドロップで読み込み、自動で回答を推定。

```javascript
// package.json → answers 推定ロジック
{
  "next": "14.x"     → frontend: "React + Next.js"
  "prisma": "*"      → database: "PostgreSQL" (推定)
  "stripe": "*"      → payment: "stripe"
  "@supabase/ssr": "*" → backend: "Supabase"
}
```

### 3.6 🆕 TechDB完全バイリンガル化 (P0)

230+エントリすべてに英語フィールドを追加。

```javascript
// Before (v8)
{name:'React',cat:'frontend',sub:'framework',req:'選択',level:'mid'}

// After (v9)
{name:'React',cat:'frontend',catEn:'Frontend',sub:'framework',subEn:'Framework',
 req:'選択',reqEn:'Choose',level:'mid',
 desc:'UIライブラリ',descEn:'UI Library',
 score:{stability:9,learning:6,perf:8}} // 並列探索用スコア
```

---

## 4. 段階的移行計画

### Phase A: 基盤整備 (1-2週間)

**目標**: v8.3のコードをモジュール分割し、ビルドパイプラインを確立

| タスク | 見積り | 成果物 |
|--------|--------|--------|
| build.js 作成 | 2h | ビルドスクリプト |
| HTML/CSS/JS 分離 | 4h | src/ ディレクトリ構造 |
| グローバル関数のIIFE化 | 3h | 名前空間隔離 |
| CI追加 (syntax check) | 1h | GitHub Actions |
| v8→v9 state migration | 2h | localStorage互換 |

**検証**: `npm run build` で生成した `devforge-v9.html` が v8.3 と同一動作

### Phase B: i18n完成 + TechDB (2-3週間)

**目標**: 完全バイリンガル化

| タスク | 見積り | 成果物 |
|--------|--------|--------|
| TechDB 231行のEN追加 | 6h | techdb.js (JA/EN) |
| UI残存275行のEN化 | 4h | 完全バイリンガルUI |
| ロードマップ本文のEN化 | 4h | roadmap生成の完全EN |
| i18n テスト | 2h | JA/EN切替の全画面確認 |

### Phase C: 新機能 (3-4週間)

**目標**: v9.0 の差別化機能を実装

| タスク | 見積り | 優先度 |
|--------|--------|--------|
| インラインエディタ | 6h | P1 |
| 差分ビュー | 8h | P1 |
| Pillar⑤ 並列探索 | 12h | P1 |
| AI連携ランチャー | 4h | P2 |
| プロジェクトインポート | 8h | P2 |

### Phase D: 品質向上 (1-2週間)

| タスク | 見積り | 成果物 |
|--------|--------|--------|
| E2Eテスト (Playwright) | 6h | 主要フロー自動テスト |
| アクセシビリティ改善 | 4h | WCAG 2.1 AA |
| パフォーマンス最適化 | 3h | Lighthouse 95+ |
| ドキュメント整備 | 3h | 開発者ガイド |

---

## 5. 技術的詳細

### 5.1 State Migration (v8 → v9)

```javascript
// src/core/state.js
const CURRENT_VERSION = 9;

function migrateState(s) {
  if (!s._v || s._v < 9) {
    // v8 → v9: genLang のデフォルト値追加
    s.genLang = s.genLang || s.lang || 'ja';
    // v9 新フィールド
    s.editedFiles = {};     // ユーザー編集済みファイル
    s.prevFiles = {};       // 差分用スナップショット
    s.exploreChoice = null; // 並列探索の選択
    s._v = CURRENT_VERSION;
  }
  return s;
}
```

### 5.2 イベント委譲パターン

v8の57個の `createElement` + 個別イベントリスナーを、イベント委譲に置き換え。

```javascript
// Before (v8) — 各要素にonclick
const btn = document.createElement('button');
btn.onclick = () => doSomething();
container.appendChild(btn);

// After (v9) — data属性 + 委譲
// HTML: <button data-action="doSomething">
document.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action && actions[action]) actions[action](e);
});
```

### 5.3 テンプレートエンジン (軽量)

G? 三項演算子157箇所の可読性改善。

```javascript
// Before (v8)
S.files['spec.md'] = `# ${G?'プロジェクト憲法':'Constitution'}
${G?'## 1. 使命':'## 1. Mission'}
${a.purpose||(G?'（未定義）':'(Undefined)')}`;

// After (v9) — テンプレート辞書パターン
const T = genTemplates[S.genLang]; // 'ja' or 'en'
S.files['spec.md'] = `# ${T.constitution_title}
${T.section_mission}
${a.purpose || T.undefined}`;

// genTemplates.js
const genTemplates = {
  ja: { constitution_title:'プロジェクト憲法', section_mission:'## 1. 使命', undefined:'（未定義）' },
  en: { constitution_title:'Constitution', section_mission:'## 1. Mission', undefined:'(Undefined)' }
};
```

**効果**: テンプレート本文の可読性が劇的に向上。翻訳者が辞書だけ見れば修正可能。

### 5.4 差分アルゴリズム

```javascript
// 簡易行単位diff (Myers diffの簡略版)
function lineDiff(oldText, newText) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result = [];
  // LCSベースの差分検出 (50行程度の実装)
  // 戻り値: [{type:'same'|'add'|'del', line:'...'}]
  return result;
}
```

---

## 6. KPI・成功指標

| 指標 | v8.3 現状 | v9.0 目標 |
|------|-----------|-----------|
| ファイルサイズ (配布) | 240KB | 280KB以下 |
| ソースファイル数 (開発) | 1 | 20+ |
| 関数のグローバル汚染 | 89個 | 0 (IIFE内) |
| i18n完全対応率 | ~65% | 100% |
| TechDBバイリンガル | 0% | 100% |
| 生成可能ファイル数 | 60+ | 70+ |
| Pillar実装率 | 6/7 (86%) | 7/7 (100%) |
| テストカバレッジ | 0% | 主要フロー80% |
| Lighthouse Score | 未計測 | 95+ |
| キーボードアクセシビリティ | 部分対応 | 完全対応 |

---

## 7. リスクと対策

| リスク | 確率 | 影響 | 対策 |
|--------|------|------|------|
| モジュール分割で既存機能が壊れる | 高 | 高 | Phase Aで厳密な動作比較テスト |
| 配布ファイルサイズの肥大化 | 中 | 中 | TechDB/プリセットの圧縮、不要CSSの削除 |
| ビルドステップ追加による敷居上昇 | 低 | 中 | `npm run build` 1コマンド、ドキュメント整備 |
| v8 localStorage との非互換 | 低 | 高 | migrateState() による段階的マイグレーション |

---

## 8. 推奨実装順序

```
Week 1-2:  Phase A — モジュール分割 + ビルド基盤
Week 3-4:  Phase B — TechDB完全EN化 + UI i18n完成
Week 5-6:  Phase C-1 — インラインエディタ + 差分ビュー
Week 7-8:  Phase C-2 — Pillar⑤並列探索エンジン
Week 9:    Phase C-3 — AI連携 + インポート
Week 10:   Phase D — テスト + a11y + パフォーマンス
Week 11:   リリース候補 + ドキュメント
Week 12:   v9.0 GA リリース 🚀
```

**総見積り**: 約 80-100 時間（12週間・週8時間ペース）

---

## 9. v8.3 → v9.0 サマリー

```
v8.3 (現在)                    v9.0 (目標)
─────────────                  ─────────────
単一ファイル 240KB      →      単一ファイル 280KB (配布)
                               モジュール分割 20+ (開発)
グローバル関数 89個     →      IIFE内・名前空間隔離
i18n 65%               →      i18n 100%
TechDB JA-only         →      TechDB JA/EN + スコア
Pillar⑤ 未実装        →      並列探索エンジン搭載
ファイル編集 不可       →      インラインエディタ
差分表示 なし          →      再生成差分ビュー
AI連携 なし            →      プロンプトランチャー
インポート なし        →      package.json 自動推定
テスト なし            →      E2E テスト (Playwright)
```

---

© 2026 エンジニアリングのタネ制作委員会 ｜ 作成者：にしあん
