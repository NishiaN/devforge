# DevForge v9.0

> ウィザード形式でプロジェクト仕様書62ファイルを自動生成するWebアプリ

## 概要

DevForgeは、対話形式の質問に答えるだけで、プロジェクト開発に必要な仕様書・設計書・AI設定ファイル・DevContainer環境・CI/CDパイプラインなど **62ファイル** を自動生成するツールです。

### 特徴
- 🏗️ **26プリセット** — LMS, EC, SaaS, ブログ, コミュニティ等
- 🌐 **日英バイリンガル** — UI・生成物ともに日本語/英語対応
- 🤖 **AI最適化出力** — CLAUDE.md, AI_BRIEF.md (~920トークン), .cursorrules
- 🔧 **BaaS対応** — Supabase/Firebase/Convex のアーキテクチャ自動判定
- 💳 **Stripe統合** — 料金プラン, Webhook, RLS自動生成
- 🔒 **RBAC自動生成** — ロール別権限, RLSポリシー
- ✅ **35互換性ルール** — 技術スタック間の矛盾を自動検出
- 📊 **ドメイン推論** — 8ドメイン別KPI・スコープ外・受入条件

## クイックスタート

```bash
# インストール
git clone https://github.com/<your-username>/devforge-v9.git
cd devforge-v9
npm install

# ビルド
node build.js

# テスト
npm test  # 127テスト + 248アサーション

# 使う
open devforge-v9.html  # ブラウザで開く
```

## 生成ファイル (62ファイル)

### .spec/ — SDD仕様書
| ファイル | 内容 |
|---------|------|
| constitution.md | プロジェクト憲法 (使命/KPI/技術原則/セキュリティ/スコープ) |
| specification.md | 機能仕様書 (受入条件付き) |
| technical-plan.md | 技術計画書 (ER/RLS/Stripe/Sprint) |
| tasks.md | Sprint別タスク一覧 |
| verification.md | 検証計画書 (機能別チェックリスト付き) |

### .devcontainer/ — 開発環境
devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh

### docs/ — ドキュメント群
アーキテクチャ, ER図, API設計, 画面設計, テストケース, セキュリティ, リリースチェックリスト, WBS, プロンプトプレイブック, タスク(GitHub Issues形式)

### AI設定ファイル
CLAUDE.md, AI_BRIEF.md, .cursorrules, .clinerules, .windsurfrules, AGENTS.md, .cursor/rules

### CI/CD
.github/workflows/ci.yml

## 開発

### プロジェクト構造
```
src/
├── core/       # state, i18n, events, tour, init
├── data/       # presets(26), questions, techdb, compat-rules
├── generators/ # p1-sdd, p2-devcontainer, p3-mcp, p4-airules, p7-roadmap, docs, common
├── ui/         # wizard, render, edit, preview, export, explorer, dashboard...
└── styles/     # all.css (dark/light theme)
test/           # 9 test files, 127 tests
build.js        # Concatenates 39 modules → single HTML
```

### ルール
1. `src/` のみ編集 — `devforge-v9.html` は直接編集しない
2. 単一引用符内で `${}` を使わない — 文字列結合を使う
3. Generator関数の先頭で `const G = S.genLang==='ja';` を定義
4. `getEntityColumns(name, G, knownEntities)` — 第3引数は必須
5. 編集後は必ず `npm test && node build.js`

### テスト構成
| ファイル | テスト数 | 内容 |
|---------|---------|------|
| gen-coherence | 248 assertions | LMS全体生成+構造検証 |
| snapshot | 28 | 4シナリオ回帰テスト |
| r27-regression | 17 | バグ修正検証 |
| r28-regression | 19 | 品質改善検証 |
| build | 1 | ビルドサイズ ≤500KB |
| compat | 8 | 互換性ルール |
| その他 | ~14 | i18n, presets, state, techdb |

## AI Coding対応

### Cursor
`.cursorrules` と `.cursor/rules` を自動読み込み。

### Claude Code
`CLAUDE.md` を自動読み込み。

### Windsurf / Cline
`.windsurfrules` / `.clinerules` を自動読み込み。

### Devin / その他
`AGENTS.md` を参照。

## License
MIT
