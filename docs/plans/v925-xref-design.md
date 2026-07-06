# v9.25 生成物クロスリファレンス完全解消バッチ — 設計

**日付**: 2026-07-06 | **前提**: v9.24 (`8ee365f`)

**発見**: フル生成 (シナリオA相当) の生成md内に、存在しないファイルへの参照が~27件。
v9.22 B-3でlauncher側は解消済みだが、**生成ドキュメント自身の相互参照**に旧名・変種名・タイポが残存。
C13監査はwarn表示のみで修正はされないため、ソース側で根絶する。

## Phase 一覧

| # | 項目 | 内容 |
|---|------|------|
| A | 壊れ参照のソース修正 (~27件) | docs/00系(12+)/17/19/64/78/118/136/40/.claude/rules の参照を実生成名へ |
| B | xref-zero 回帰テスト新設 | フル生成→全md走査→未生成参照0件をアサート (シナリオA+B両方; 82等ハーネス外生成ファイルは許容リスト) |
| C | 検証+文書 | npm test (ビルド後) / build / compat; CLAUDE.md/MEMORY更新 |

## 修正対象 (実測)

| 参照元 | 壊れ参照 → 修正先 |
|--------|------------------|
| docs/00_pillar_dependency_map ほか | 91_test_strategy→91_testing_strategy 他 ~12件 (旧名残存) |
| docs/17_monitoring | 105_cost_intelligence/106_tech_debt/112_cost_optimization_runbook → 現P27名 |
| docs/19_performance | 99_performance_budget/100_web_vitals/101_caching/102_database_performance → 現P25名 |
| docs/136_harness_engineering_guide | 43_security_plan → 43_security_intelligence (変種不一致) |
| docs/64/78/118/40/.claude/rules/spec.md | 各1-2件 |

## 検証基準
- 新テスト: 2シナリオでbroken xref = 0 / 既存7429テスト全パス / <6500KB / 0 WARN

## 先送り継続 (v9.26候補)
- launcher.js ja/en 圧縮 (393KB) / ダッシュボードinnerHTML差分化
