# DevForge v9 — Round 8 更新計画

## 調査日: 2026-02-09
## 調査範囲: AI最新モデル + 関連ツール価格 + コードベース整合性

---

## 🔍 調査結果サマリー

### A. AIモデル（2026年2月時点の最新）

| プロバイダ | 最新モデル | コンテキスト | 現コード | 要更新 |
|-----------|-----------|------------|---------|-------|
| Anthropic | **Claude Opus 4.6** (2026/2/5) | 1M (beta header) | Claude Opus 4.5 / Claude 4.5 Opus | ✅ 要更新 |
| Anthropic | **Claude Sonnet 4.5** | 200K (1M beta) | Claude Sonnet 4.5 | ✅ ctx追記 |
| Anthropic | **Claude Haiku 4.5** | 200K | なし | ✅ 要追加 |
| OpenAI | **GPT-5.2** (2025/12) | 400K | GPT-4o (128K) | ✅ 要更新（大幅遅れ） |
| OpenAI | **GPT-5.3-Codex** (2026/2/5) | — | なし | ✅ 要追加 |
| Google | **Gemini 2.5 Pro** (stable) | 1M | Gemini 2.5 Pro (1M) | ⚪ 正確 |
| Google | **Gemini 3 Pro** (preview) | 1M | なし | ✅ 要追加 |
| Google | **Gemini 3 Flash** (2026/1) | 200K | なし | ✅ 要追加 |

### B. AIツール価格・状態

| ツール | 現コード | 最新状況 | 要更新 |
|--------|---------|---------|-------|
| Cursor | $20 (top1) | $20 (正確) | ⚪ OK |
| Claude Code | $20〜$200 | Pro $20 + API従量制 | ⚪ OK |
| GitHub Copilot | $10〜$39 | $10〜$39 (正確) | ⚪ OK |
| Windsurf | $15〜 (optional) | $15 (Cognition傘下へ) | ✅ 注釈更新 |
| Kiro | free-tier | **$19/mo Pro** (有料化) | ✅ 要更新 |
| OpenAI Codex | free-tier | **GPT-5.3-Codex** (大幅進化) | ✅ 名称+価格更新 |
| Devin | $20〜$500 | Cognition (Windsurf親会社) $20〜 | ⚪ OK |
| Replit Agent | $25 | $25 (正確) | ⚪ OK |

### C. 新規追加候補ツール

| ツール | カテゴリ | 理由 |
|--------|---------|------|
| Gemini CLI | ai/cli | Google公式CLI。Gemini 3 Flash対応 |
| Antigravity | ai/ide | Google製AI IDE（ただし安全性問題あり→optional/pro） |

### D. コードベース整合性問題

| 問題 | 箇所 | 詳細 |
|------|-----|------|
| **モデル名不統一** | dashboard.js vs launcher.js | `Claude 4.5 Opus` vs `Claude Opus 4.5` (語順不一致) |
| **GPT-4o大幅古い** | 両ファイル | GPT-5.2 (400K) が最新。GPT-4o→GPT-4.1→GPT-5→5.1→5.2と4世代遅れ |
| **Haiku未掲載** | モデル適合度 | Haiku 4.5 (200K) はコスト最適解なのに表示なし |
| **Gemini 3未反映** | モデル適合度 | Gemini 3 Pro/Flash がリリース済みだが未反映 |

---

## 📋 更新タスク一覧

### Task 1: モデル適合度の更新（dashboard.js + launcher.js）

**変更前（dashboard.js）:**
```js
{name:'Claude 4.5 Opus',ctx:1000000,color:'var(--accent)'},
{name:'Claude 4.5 Sonnet',ctx:200000,color:'var(--accent-2)'},
{name:'GPT-4o',ctx:128000,color:'var(--success)'},
{name:'Gemini 2.5 Pro',ctx:1000000,color:'var(--warn)'},
```

**変更後（dashboard.js）:**
```js
{name:'Claude Opus 4.6',ctx:1000000,color:'var(--accent)'},
{name:'Claude Sonnet 4.5',ctx:200000,color:'var(--accent-2)'},
{name:'GPT-5.2',ctx:400000,color:'var(--success)'},
{name:'Gemini 2.5 Pro',ctx:1000000,color:'var(--warn)'},
{name:'Claude Haiku 4.5',ctx:200000,color:'var(--accent)'},
{name:'Gemini 3 Flash',ctx:200000,color:'var(--warn)'},
```

**変更前（launcher.js）:**
```js
{name:'Claude Opus 4.5',ctx:1000000,icon:'🟣'},
{name:'Claude Sonnet 4.5',ctx:200000,icon:'🔵'},
{name:'GPT-4o',ctx:128000,icon:'🟢'},
{name:'Gemini 2.5 Pro',ctx:1000000,icon:'🟡'},
```

**変更後（launcher.js）:**
```js
{name:'Claude Opus 4.6',ctx:1000000,icon:'🟣'},
{name:'Claude Sonnet 4.5',ctx:200000,icon:'🔵'},
{name:'GPT-5.2',ctx:400000,icon:'🟢'},
{name:'Gemini 2.5 Pro',ctx:1000000,icon:'🟡'},
{name:'Claude Haiku 4.5',ctx:200000,icon:'🟣'},
{name:'Gemini 3 Flash',ctx:200000,icon:'🟡'},
```

### Task 2: TechDB更新（data/techdb.js）

**更新:**
- `Kiro`: price `'free-tier'` → `'$19'`
- `OpenAI Codex`: name → `'OpenAI Codex (GPT-5.3)'`, price → `'usage'`

**追加エントリ:**
```js
{name:'Gemini CLI',cat:'ai',sub:'cli',req:'optional',level:'int',price:'free-tier'},
{name:'GPT-5.3-Codex',cat:'ai_auto',sub:'agentic',req:'optional',level:'pro',price:'usage'},
```

### Task 3: Questions更新（data/questions.js）

**ai_tools チップリスト更新:**
- Intermediate追加: `'Gemini CLI'`
- Pro: `'OpenAI Codex'` → `'Codex (GPT-5.3)'`
- Pro追加: `'Antigravity (Google)'`（ただし注意書き付き）

### Task 4: P4 AIルール生成の更新（generators/p4-airules.js）

**追加ファイル:**
- `.gemini/settings.json` — Gemini CLI用プロジェクト設定

**既存ファイル内容改善:**
- `CLAUDE.md`: `Prisma for database` → ユーザー選択DBに動的対応
- `codex-instructions.md` → `codex-instructions.md` (GPT-5.3-Codex対応に更新)

### Task 5: テスト更新

- モデル名変更に伴うテストケース修正（もしモデル名をテストしている箇所があれば）
- 新規TechDBエントリのカウント検証

---

## ⚠️ リスク評価

| リスク | 影響度 | 対策 |
|--------|-------|------|
| モデル名変更でUI表示が崩れる | 低 | 文字数は同等。Opus 4.5→4.6で1文字増のみ |
| 6モデル表示でレイアウト溢れ | 中 | CSSグリッドが2列→3列対応か確認必要 |
| GPT-5.2の400Kがまだ不安定 | 低 | 公式ドキュメント確認済み。400K confirmed |
| Gemini 3がまだpreview | 低 | "preview"注記を付与 |
| ビルドサイズ増加 | 低 | TechDB 2エントリ + モデル2追加 = ~200B程度 |

---

## 📊 変更影響範囲

| ファイル | 変更種別 | 行数見積 |
|---------|---------|---------|
| src/ui/dashboard.js | モデル配列更新 | ~5行 |
| src/ui/launcher.js | モデル配列更新 | ~5行 |
| src/data/techdb.js | エントリ更新+追加 | ~8行 |
| src/data/questions.js | チップリスト更新 | ~3行 |
| src/generators/p4-airules.js | ファイル追加+内容改善 | ~15行 |
| test/build.test.js | テスト修正 | ~3行 |
| **合計** | | **~39行** |

---

## 実行順序

1. Task 1: モデル適合度更新 → ビルド → テスト
2. Task 2: TechDB更新 → ビルド → テスト
3. Task 3: Questions更新 → ビルド → テスト
4. Task 4: P4 AIルール → ビルド → テスト
5. Task 5: 最終テスト → サイズ確認
