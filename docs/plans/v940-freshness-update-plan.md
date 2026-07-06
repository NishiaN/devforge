# v9.40+ 中身の鮮度アップデート計画（techdb以外）

**策定**: 2026-07-06 | **前提**: techdb本体はv9.40で照査済（538→548）。本計画はそれ以外の鮮度敏感箇所。

## 洗い出し結果（実測スコープ）

| # | 領域 | 実測 | 現状→あるべき | 外部照会 |
|---|------|------|--------------|---------|
| 1 | Claudeモデル ID（生成物） | `claude-opus-4-6`6回/2file, `claude-sonnet-4-5/4-6`3回（p24/p26のコード例・料金表・設定値） | 4.6→**4.8**, Sonnet 4.5→**Sonnet 5**（haiku-4-5=現行維持） | 不要 |
| 2 | Claudeモデル（アプリUI） | dashboard.js/launcher.js モデル一覧「Opus 4.6/Sonnet 4.5」, p27-cost料金表 | 同上＋ctx確認 | 一部 |
| 3 | GPT/Gemini モデル | `GPT-4`45回/10file, `gpt-4o`4回, GPT-5/gpt-5.2/Gemini 2/3混在 | GPT-5.2/Gemini 3へ統一（例示選別） | **要** |
| 4 | AIモデル料金表 | p26-observability(per-token), p27-cost($3/$15/1M等) | 2026-07実勢へ | **要** |
| 5 | Node版数ピン | Docker`node:22`×3 と CI`node-version:"20"`×3 不整合 | 22 LTSに統一 | 不要 |
| 6 | CDNライブラリ版数 | marked 12.0.2 / mermaid 10.9.1 / jszip 3.10.1 | 最新+integrity再計算 | **要** |
| 7 | GitHub Actions版数 | checkout@v4×20 他 | v5等の有無 | **要** |
| 8 | MCP protocolVersion | `"2024-11-05"` | 最新spec版 | **要** |
| 9 | 年号/GPT-4例示（プロース） | presets 7file, 2024/2025年 | 選別更新 | 判断要 |

## 更新計画（Tier順）

### Tier 1 — 権威情報あり・低リスク（即実行）
- Claudeモデル ID一括更新: `claude-opus-4-6→claude-opus-4-8` / `claude-sonnet-4-5,4-6→claude-sonnet-5`（生成物5file＋UI2file）。haiku-4-5は現行=維持
- UIモデル一覧の表示名（Opus 4.6→4.8, Sonnet 4.5→Sonnet 5）
- Node版数統一: CI `20→22`（Docker 22と整合）
- 検証: build→test→実生成でモデルID確認。回帰低

### Tier 2 — 外部照会（並列サブエージェント, techdb v9.40と同方式）
- Claude/GPT/Gemini の2026-07現行モデル名（GPT-5.2系・Gemini 3系の正確な最新）
- AIモデル料金表 per-token/per-1M（p26/p27）
- 適用前に実データ突合（v9.40教訓）

### Tier 3 — 外部照会＋ビルド影響（中リスク・個別慎重）
- CDN版数（marked/mermaid/jszip）: 版数＋integrityハッシュ両更新→mermaid新構文がC14監査に影響しないか実生成確認
- GitHub Actions版数、MCP protocolVersion: 最新spec確認

### Tier 4 — 低優先・判断要
- presetsの「GPT-4搭載」例示45件: 意図的legacyを選別、汎用表現化 or GPT-5.2化
- 年号ハードコード: 例示残置、版数系のみ

## 実装順（最適解）
1. Tier 2/3の外部照会エージェントを先行並列起動（時間がかかるため）
2. 待機中にTier 1を権威情報で即実行・コミット
3. エージェント結果を実データ突合してTier 2/3適用
4. Tier 4を方針決定後に選別適用
5. 各Tierでbuild+test、最終sweep、記録

## 現行モデルID（権威・システム既知）
- Opus 4.8=`claude-opus-4-8` / Sonnet 5=`claude-sonnet-5` / Haiku 4.5=`claude-haiku-4-5` / Fable 5=`claude-fable-5`
