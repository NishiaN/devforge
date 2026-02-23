# DevForge v9.6 コンテキスト網羅性補完計画

生成日: 2026-02-23
ビルドサイズ制約: 現状 2703KB / 3000KB (残 297KB)

## 実施順序（最適解）

### Phase 1 — 即効補完 (推定 +53KB)

#### [P1-C] KPIテンプレート32ドメイン化 (+10KB) ★最優先
- ファイル: src/generators/p1.js
- 内容: SUCCESS_METRICS を 8→32 ドメイン対応に拡張

#### [P1-A] REVERSE_FLOW_MAP 17ドメイン追加 (+18KB)
- ファイル: src/generators/p10.js
- 追加: insurance, legal, hr, travel, manufacturing, logistics,
         newsletter, creator, collab, devtool, portfolio, tool,
         event, realestate, automation, gamify, ai

#### [P1-B] DOMAIN_IMPL_PATTERN 6ドメイン追加 (+12KB)
- ファイル: src/generators/common.js
- 追加: agriculture, energy, government, travel, media, logistics

#### [P1-D] エンティティ定義補完 (+13KB)
- ファイル: src/generators/common.js (ENTITY_COLUMNS)
- 追加: restaurant, factory, construction, agri(standard), energy, media

### Phase 2 — コンテキスト品質向上 (推定 +70KB)

#### [P2-D] Semantic Compat Rules 10件追加 (+10KB)
- ファイル: src/data/compat-rules.js

#### [P2-A] ADR自動生成 (+25KB)
- ファイル: src/generators/docs.js
- 出力: docs/82-2_architecture_decision_records.md

#### [P2-C] Cross-Pillar依存マップ (+15KB)
- 出力: docs/00_pillar_dependency_map.md

#### [P2-B] コスト見積もりテンプレート (+20KB)
- ファイル: src/generators/p13.js
- 出力: docs/xx_cost_estimation.md

## ステータス
- [x] P1-C: KPI拡張 — 8→32ドメイン対応完了
- [x] P1-A: REVERSE_FLOW_MAP — 検証済み（既に32ドメイン対応）
- [x] P1-B: DOMAIN_IMPL_PATTERN — 24→32ドメイン対応完了（8ドメイン追加）
- [x] P1-D: ENTITY_COLUMNS — 検証済み（既に全ドメイン対応）
- [x] P2-D: Semantic Compat Rules — 94→104ルール（15E+61W+28I）
- [x] P2-A: ADR生成 — docs/82-2_architecture_decision_records.md 追加
- [x] P2-C: Cross-Pillar Map — docs/00_pillar_dependency_map.md 追加
- [x] P2-B: コスト見積もり — docs/48-2_cost_estimation.md 追加

## 完了結果
- ビルドサイズ: 2763KB / 3000KB (残 237KB)
- テスト: 1065/1065 全通過
- 生成ファイル数: +3 (178+ファイル)
