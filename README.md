# DevForge v9.3.0

[![CI](https://github.com/NishiaN/devforge/actions/workflows/ci.yml/badge.svg)](https://github.com/NishiaN/devforge/actions/workflows/ci.yml)

> 111+ファイルの開発ドキュメント・AI設定を自動生成するAI駆動開発プラットフォーム

## 概要

DevForgeは、対話形式の質問に答えるだけで、プロジェクト開発に必要な仕様書・設計書・AI設定ファイル・DevContainer環境・CI/CDパイプラインなど **111+ファイル** を自動生成するAI駆動開発プラットフォームです。

### 特徴
- 🏗️ **41プリセット** — LMS, EC, SaaS, ブログ, コミュニティ, 不動産管理, 契約管理, ヘルプデスク, 家庭教師, 動物病院, 飲食店, CRM, SNS, 物流, アンケート, 求人等
- 🌐 **日英バイリンガル** — UI・生成物ともに日本語/英語対応
- 🤖 **AI最適化出力** — CLAUDE.md, AI_BRIEF.md (~1200トークン), .cursorrules
- 🚀 **AIプロンプトランチャー** — プロジェクトコンテキスト自動注入、15種のプロンプトテンプレート（仕様レビュー、MVP実装、テスト生成、リファクタ、セキュリティ監査、ドキュメント補完、QA・バグ検出、デバッグ支援、アーキテクチャ整合性、パフォーマンス最適化、API統合、アクセシビリティ監査、マイグレーション支援、コードメトリクス、国際化実装）
- 🔧 **BaaS対応** — Supabase/Firebase/Convex のアーキテクチャ自動判定
- 💳 **Stripe統合** — 料金プラン, Webhook, RLS自動生成
- 🔒 **RBAC自動生成** — ロール別権限, RLSポリシー
- ✅ **58互換性ルール** — 技術スタック間の矛盾を自動検出
- 📊 **ドメイン推論** — 32ドメイン別KPI・スコープ外・受入条件（教育、EC、SaaS、コミュニティ、予約、健康、マーケットプレイス、コンテンツ、分析、ビジネス、IoT、不動産、法務、人事、金融、AI、自動化、イベント、ゲーミフィケーション、コラボ、開発ツール、クリエイター、ニュースレター、製造、物流、農業、エネルギー、メディア、行政、旅行、保険）
- 🧪 **品質インテリジェンス** — 業種別QA戦略、テストマトリクス、インシデント対応
- 🏗️ **実装インテリジェンス** — 32ドメイン別実装パターン、AI運用手順書
- 🧠 **AI開発OS** — コンテキスト管理、ファイル選択マトリクス、エージェント連携

## クイックスタート

```bash
# インストール
git clone https://github.com/<your-username>/devforge-v9.git
cd devforge-v9
npm install

# ビルド
node build.js

# テスト
npm test  # 305+テスト（全通過）

# 使う
open devforge-v9.html  # ブラウザで開く
```

## 生成ファイル (111+ファイル)

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

### docs/ — ドキュメント群（40種）
アーキテクチャ, ER図, API設計, 画面設計, テストケース, セキュリティ, リリースチェックリスト, WBS, プロンプトプレイブック, タスク(GitHub Issues形式), 進捗管理, エラーログ, デザインシステム, シーケンス図, QA戦略, リバースエンジニアリング, ゴール分解, 業種別プレイブック, QA設計図, テストマトリクス, インシデント対応, サイトマップ, テスト戦略, バグ防止, ビジネスモデル*, 実装プレイブック, AI開発手順書

\* payment≠none の場合のみ生成

### AI設定ファイル（12+種）
CLAUDE.md, AI_BRIEF.md, .cursorrules, .clinerules, .windsurfrules, AGENTS.md, .cursor/rules, **skills/** (project.md, catalog.md*, pipelines.md*, factory.md, README.md**, skill_map.md**, agents/coordinator.md**, agents/reviewer.md**, impl-patterns.md*)

\* ai_auto≠none の場合のみ生成
\*\* ai_auto=multi/full/orch の場合のみ生成

**スキルシステム（Manus Skills統合）:**
- **project.md**: 5つのコアスキル（spec-review、code-gen、test-gen、doc-gen、refactor）+ 工場テンプレート
- **catalog.md\***: 32ドメイン対応（教育、EC、SaaS、コミュニティ、予約、健康、マーケットプレイス、コンテンツ、分析、ビジネス、IoT、不動産、法務、人事、金融、AI、自動化、イベント、ゲーミフィケーション、コラボ、開発ツール、クリエイター、ニュースレター、製造、物流、農業、エネルギー、メディア、行政、旅行、保険）、19つの詳細化スキル（14コアスキル + 5ドメイン固有スキル）
- **pipelines.md\***: 自律パイプライン（1-5パイプライン、ai_autoレベルに応じて）+ Mermaidフローチャート
- **factory.md**: Manus Skills工場テンプレート（32ドメイン対応の思考軸システム）
- **impl-patterns.md\***: 実装スキルカタログ（Manus Skills形式）

### CI/CD
.github/workflows/ci.yml

## Pillar ⑧ AI プロンプトランチャー

生成した仕様書をAIツールに一括投入するための機能。プロジェクトコンテキスト（プロジェクト名・スタック・認証・エンティティ）を自動注入し、構造化されたプロンプトを生成します。

### 15のプロンプトテンプレート

| テンプレート | 説明 | 出力形式 |
|-------------|------|---------|
| 🔍 **仕様レビュー** | 4ステップ構造化レビュー（使命確認→要件網羅性→アーキテクチャ評価→整合性チェック） | Markdown表（#/ファイル/指摘/優先度/アクション） |
| 🚀 **MVP実装** | tasks.mdから最優先タスク1件を選択して実装（型定義→データアクセス→ビジネスロジック→UI→テスト） | ファイルパス付きコードブロック + テスト |
| 🧪 **テスト生成** | docs/07参照、正常系→異常系→境界値の順序でテスト作成 | Vitestテストファイル |
| ♻️ **リファクタ提案** | SOLID原則違反・責務分離不足を検出、工数見積り(S/M/L)付き | Markdown表（問題/違反原則/改善案/工数/優先度） |
| 🔒 **セキュリティ監査** | OWASP Top 10項目別チェック、状態評価(✅/⚠️/❌) | Markdown表（OWASP#/項目/状態/詳細/対策） |
| 📝 **ドキュメント補完** | 2パート構成（ギャップ分析表 + 最重要ドキュメント全文生成） | Part 1: 表 / Part 2: 完全ドキュメント |
| 🐛 **QA・バグ検出** | ドメイン別バグパターン参照、テスト計画生成、優先度マトリクス | Markdown表（テストID/シナリオ/期待結果/優先度） |
| 🔧 **デバッグ支援** | error_logs.md照合、5 Whys分析、修正コード提案 | 診断表 + 修正コード + error_logsエントリ |
| 📐 **アーキテクチャ整合性** | レイヤー違反検出、技術方針整合性検証、適合スコア | Markdown表（違反箇所/定義元/深刻度/修正案） |
| ⚡ **パフォーマンス最適化** | NFR目標値比較、ボトルネック特定、改善ロードマップ | Markdown表（箇所/種別/現状/目標/改善策） |
| 🔌 **API統合コード生成** | 型定義、エラーハンドリング付き統合コード、テストスケルトン | API client + 型定義 + テストコード |
| ♿ **アクセシビリティ監査** | WCAG 2.1 AA 4原則チェック、HTML/ARIA修正コード | Markdown表 + axe-coreテスト |
| 🔄 **マイグレーション支援** | スキーマ変換スクリプト、検証クエリ、デプロイ計画 | フェーズ表 + SQLスクリプト |
| 📊 **コードメトリクス分析** | 循環的/認知的複雑度、結合度、DRY違反、改善ROI順 | メトリクスサマリー + ホットスポット表 |
| 🌍 **国際化実装** | 文字列抽出、翻訳キー定義、JSON生成、t()関数置換 | 翻訳JSON + 変換コード |

### 使い方

1. プロジェクト設定を完了し、ファイルを生成
2. **Pillar ⑧ AI プロンプトランチャー**を開く
3. フォルダ別トークン数を確認し、必要なフォルダを選択
4. テンプレートを選択（例: 仕様レビュー）
5. 生成されたプロンプトをコピー
6. AIツール（Claude、Cursor、Windsurf等）に貼り付けて実行

### 自動注入されるコンテキスト

```markdown
# Context
Project: プロジェクト名
Stack: React + Next.js + Supabase (PostgreSQL)
Auth: Supabase Auth
Entities: User, Course, Lesson, Progress
```

### ツール別AI設定ファイル

プロンプトランチャーと連携して、各ツール専用の最適化ルールを生成：

- **Cursor** (`.cursor/rules`): `@workspace`/`@file` 参照、マルチファイル編集
- **Cline** (`.clinerules`): Plan→Act ループ、`npm test`、`progress.md` 更新
- **Windsurf** (`.windsurfrules`): Cascade 活用、Flows 作成、コンテキスト集中
- **Copilot** (`.github/copilot-instructions.md`): コア開発ルール

すべてのツールに **Thinking Protocol** 搭載（実装前4ステップチェックリスト）。

## 開発

### プロジェクト構造
```
src/
├── core/       # state, i18n, events, tour, init
├── data/       # presets(41), questions, techdb, compat-rules
├── generators/ # p1-sdd, p2-devcontainer, p3-mcp, p4-airules, p5-quality, p7-roadmap, p9-designsystem, p10-reverse, p11-implguide, docs, common
├── ui/         # wizard, render, edit, preview, export, explorer, dashboard...
└── styles/     # all.css (dark/light theme)
test/           # 304+ tests
build.js        # Concatenates 47 modules → single HTML
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
| snapshot | 41 | 6シナリオ回帰テスト (LMS/Blog/EC/English/PropertyMgmt/Helpdesk) |
| data-coverage | 28 | データ整合性（エンティティカバレッジ、FK検証、32ドメイン検出、プレイブック完全性） |
| r27-regression | 17 | バグ修正検証 |
| r28-regression | 19 | 品質改善検証 |
| build | 1 | ビルドサイズ ≤2000KB |
| compat | 75+7 | 互換性ルール (58 rules + 7 synergy tests) |
| その他 | ~21 | i18n, presets, state, techdb |

**Total: 305+ tests** (品質インテリジェンス・実装インテリジェンス・戦略インテリジェンス・運用インテリジェンス・未来戦略検証含む、全パス）

## ドキュメント構造

DevForge v9のドキュメントは、用途別に最適化された3つのファイルで構成されています：

### 📘 CLAUDE.md (16KB)
**コア開発ガイドライン** — 頻繁に参照する必須情報
- アーキテクチャ & ビルドプロセス
- Critical Rules（9つの開発ルール）
- Common Bugs & Security Best Practices
- Quick Reference（主要関数とデータ構造）

### 📙 docs/CLAUDE-REFERENCE.md (18KB)
**詳細リファレンス** — 深い実装時に参照
- Key Data Structures & Helper Functions（完全版）
- Generated Output（88+ファイルカタログ）
- Adding New Pillars（6ステップガイド）
- Compression Patterns（サイズ管理）
- Writing Tests（パターン集）

### 📕 docs/CLAUDE-TROUBLESHOOTING.md (5KB)
**環境構築 & トラブルシューティング**
- Environment（Node.js, Browser, CDN）
- Git Workflow & Deployment（SSH/HTTPS設定）
- GitHub Pages Deployment（設定手順）
- Troubleshooting（よくある問題と解決策）

### 📚 docs/guides/ja/
**日本語ガイド集**（9ファイル、~540KB）
- AIエージェントと共に開発するための完全なドキュメント体系
- AI感のないWeb制作
- DevForge-v9-Skills-Complete-Guide
- FigmaAIで実現する脱AI感Web制作入門ガイド
- Manus Skills 完全統合ガイド
- アプリ駆動開発でプログラムのバグや機能不全箇所を洗い出す方法とは
- アプリ駆動開発とAI拡張型エコシステムにおける包括的セキュリティ検証・強化フレームワーク
- 全業種・全アプリタイプ対応 リバースエンジニアリング実装ガイド完全版
- 多視点アプリ開発戦略ガイド 2026-2030

**最適化成果:** CLAUDE.md を43.4KB→16.2KB（62.6%削減）、情報100%保持

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
