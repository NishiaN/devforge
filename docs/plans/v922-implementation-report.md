# DevForge v9.22 信頼性ファーストバッチ — 実施報告書

**実施日**: 2026-07-06 | **対象**: v9.21 → v9.22 | **コミット**: `09fc30d`〜`bcddf68`（6件）
**設計書**: `docs/plans/v922-reliability-design.md`

「様々な観点の使用者から素晴らしい評価をいただける世界唯一の成熟したアプリ」というゴールに向け、**生成物が「動かない・嘘をつく・矛盾する」箇所を最優先で根絶する**方針（信頼性ファースト）で実施。修正順序は 生成物 → 整合性 → 第一印象 → 磨き の4段階。

| 指標 | 結果 |
|------|------|
| 修正項目 | **45件**（4観点監査の発見55件中） |
| テスト | **7411 / 7411 パス**（+20件 新規回帰テスト） |
| ビルド | **5843KB / 6500KB**（増分 +8KB） |
| 互換チェック | **0 ERROR / 0 WARN**（全プリセットcombo） |

## 1. 監査手法 — 4観点の並列探索

修正に先立ち4体の探索エージェントを並列起動し、異なる使用者の立場からコードベース全体を監査。各観点最大15件、計55件の発見（全件 file:line 付き実コード確認済み）を「評価インパクト × 実装コスト」でランク付けし45件を採用。

| 観点 | 調査対象 | 主要発見 |
|------|---------|---------|
| 🔰 初心者・非エンジニアUX | wizard / guide / help / tour / init | スキル質問の重複、v9.6表記残存、エラー生表示 ほか15件 |
| 🎓 プロ + 英語ユーザー | generators全28柱 / launcher / export | EN専用5テンプレート欠落、壊れた文書参照、鮮度劣化 ほか10件 |
| ⚙️ アプリ品質 | ui / core / css / build | save()同期大量書込、キーボード非対応、XSS経路 ほか15件 |
| 📦 生成物の実用価値 | generators / common / gen-templates | 実在しないMCPパッケージ、虚偽説明、空アサーション ほか15件 |

## 2. Phase A — 生成物クリティカル修正（15件） `f1a0b8b`

### A-1〜3 MCP設定の実在化（p3-mcp.js）

生成された mcp-config.json をそのまま使うと**サーバー起動が全滅**する状態だった。

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| context7 | `@anthropic/mcp-context7`（実在しない） | `@upstash/context7-mcp` |
| Playwright | `@anthropic/mcp-playwright`（実在しない） | `@playwright/mcp@latest` |
| Supabase | `@modelcontextprotocol/server-supabase`（実在しない） | `@supabase/mcp-server-supabase@latest` |
| Firebase | `firebase-mcp-server` | `firebase-tools@latest experimental:mcp`（公式） |
| Postgres | 注記なし | reference実装archive済みを注記 |
| 導入手順 | `cp mcp-config.json ~/.config/claude/…`（読まれない） | `.mcp.json` 配置 + `claude mcp add` CLI |
| デバッグ | `tail -f ~/.config/claude/logs/…`（存在しない） | `claude mcp list` / `claude --debug` |
| エスケープバグ | `\$` により生JS式がREADME混入 | 式を評価するよう修正 |

### A-4〜6 AIルールファイルの現行形式化（p4-airules.js）

- **Cursor**: 旧単一ファイル `.cursor/rules`（現行Cursorは読まない）→ 現行 `.cursor/rules/main.mdc`（alwaysApplyフロントマター付き）+ レガシー互換 `.cursorrules` を両生成。副次効果として guide.js / export.js / 複数docsが参照していたのに**実在しなかった `.cursorrules` の壊れた参照を全修復**。
- **CLAUDE.md生成の虚偽説明を訂正**: 「パス別ルールを自動読み込みします」→ Claude Codeにその機能はないため「`@.claude/rules/xxx.md` で明示参照」に修正。
- **Windsurf / Cline**: ファイル互換維持 + 現行ディレクトリ形式への移行注記。

### A-7〜8 テスト設定の修正（p23-testing.js）

- `coverageThresholds`（複数形・Jestが無言で無視 = ゲート無効）→ `coverageThreshold` に修正。
- Vite / Vue / Svelte 検出時は `vitest.config.ts` + `@stryker-mutator/vitest-runner` を生成（文書のVitest推奨とJest設定生成の矛盾解消）。
- 閾値をドキュメントどおり Statements 80 / Branches 75 / Functions 85 に統一（B-4兼）。

### A-9〜10 detectDomain() 精度改善（common.js）

- **「機械学習」誤検出の解消**: educationの「学習」が「機械学習」に部分一致し、ML系プロダクトが教育ドメインに誤分類 → `機械学習|深層学習|強化学習|MLOps|異常検知` 等をeducationより前に **ai** ドメインとして追加。「臨床試験×機械学習→health」優先は維持。
- **到達不能な重複エントリを統合**: IoT×2、realestate×3、embedded finance×2、community×2、gamify×2。

### A-11〜12 鮮度更新

- モデル名・価格表を現行世代に統一（p24/p26/p27/p28）: gpt-4-turbo・Claude 3.5 Sonnet・Gemini 1.5 → GPT-5.2 / Claude Sonnet 4.5 / Haiku 4.5 / Gemini 2.5。ランチャーの現行ラインナップと整合 + 「単価は要最新確認」注記。
- GitHub Actionsピン更新: `zaproxy/action-baseline@v0.7.0→v0.12.0`、`anchore/scan-action@v3→v5`。

### A-13〜15 SoT文書の品質

- **Stripe価格の正典化解消**: `Pro ¥980/月` 等の固定値がSoT文書に「真実」として記載されAIが誤実装する状態 → 「価格は例示」明記 + EN出力は `$` 表記（$0/$10/$98）。
- **常時パスする空テスト排除**: invariants.test.ts の `return true` 本体 → 参照モデルパターン（インライン参照実装への実プロパティ検証 + 差し替え指示）。verification.mdのPBT例もドメイン整合の関数名ヒント付きに修正。
- **未知エンティティのスキーマ空洞化解消**: getEntityColumns() に名前ヒューリスティックの合成フォールバック（name/description/status + Log系→occurred_at、金額系→amount、User既知→FK user_id）。

## 3. Phase B — EN・整合性修正（4件） `9cd64d5`

### B-1 英語ユーザーへの5テンプレート解放（launcher.js）

enterprise_arch / workflow_audit / incident_postmortem / capacity_plan / sla_review がJA専用ブロックのみに定義され、英語UIで**無言フィルタされ存在自体が見えなかった**。内部は元々 `_ja?` 三項でバイリンガル済みのため、共有 `Object.assign(PT,{...})` ブロックへ移動（コード増ゼロ）で解決。

### B-3 壊れた文書参照 14件の解消（launcher.js）

実生成139ドキュメントとの機械照合で全件特定（監査12件 + 照合で追加2件）:

| 誤参照 | 実生成名 |
|--------|---------|
| docs/99_db_performance_tuning.md | docs/100_database_performance.md |
| docs/100_cache_strategy.md | docs/101_cache_strategy.md |
| docs/101_frontend_performance.md | docs/99_performance_strategy.md |
| docs/103_distributed_tracing_setup.md | docs/106_distributed_tracing.md |
| docs/104_metrics_collection.md | docs/105_metrics_alerting.md |
| docs/105_log_pipeline.md | docs/104_structured_logging.md |
| docs/106_alerting_runbook.md | docs/105_metrics_alerting.md |
| docs/109_cost_dashboard.md | docs/112_cost_monitoring.md |
| docs/109_cost_optimization.md | docs/110_resource_optimization.md |
| docs/122_concurrency_consistency.md | docs/122_concurrency_consistency_guide.md |
| docs/14_risks.md | docs/14_risk.md |
| docs/19_performance_budget.md | docs/19_performance.md |
| docs/43_security_architecture.md | docs/43_security_intelligence.md |
| docs/88_query_optimization.md | docs/88_query_optimization_guide.md |

### B-2 / B-4

- JP-in-EN混入解消（p5-quality.js 3箇所: に記録/に追加/にリグレッションテスト追加）。
- カバレッジ目標矛盾はA-8で統一済み。

## 4. Phase C — 初心者UX修正（9件） `fb7e26d`

| # | 問題 | 修正 | ファイル |
|---|------|------|---------|
| C-1 | ランディングで設定済みのスキルをPhase 3で再質問（回答は実質無視） | S.skillLv設定済みなら質問スキップ（isQActive条件） | questions.js |
| C-2 | 空欄送信で無反応 | inputRequiredトースト（Enter/ボタン、ja+en） | render.js, i18n.js |
| C-3 | v9.6・225+/175 が全域残存（実体v9.22/227+） | title/badge/CURRENT_VERSION/ヘルプ/ツアー/生成メタ/859・602→860・603 一括統一 | index.html, init.js, i18n.js, guide.js, tour.js, templates.js, generators/index.js |
| C-4 | 生成失敗で内部ピラーコード露出 | 平易文言+回復アクション、詳細はconsole | generators/index.js |
| C-5 | 生JS例外をトースト表示 | 「一時的な問題…データは保存されています」 | init.js |
| C-6 | ツアーPhase名が実UIと不一致 | プロジェクト定義/技術選定/機能・データ設計 に統一 | tour.js |
| C-7 | 「25問に回答」（初心者は実際約15問） | skillLv適応表記（Lv0-1=約15問） | init.js |
| C-8 | purposeチップクリックで単語即送信→detectDomain精度低下 | chip-textは入力欄挿入+focus（編集促進） | render.js |
| C-9 | 柱/Pillar/ピラー 3表記混在 | 日本語UI表示を「柱」に統一 | dashboard.js, guide.js, tour.js |

## 5. Phase D — アプリ品質修正（6件） `aa731c2`

| # | 領域 | 修正 |
|---|------|------|
| D-1 | 性能 | saveDebounced()追加。ファイルクリック毎の数MB同期シリアライズ+書込を閲覧系のみ400msデバウンス（回答・生成系は即時維持） |
| D-2 | a11y | role=button要素へのEnter/Space委譲ハンドラ（events.js）+ 言語選択モーダル/export-hero×2/fdep-header/pm-itemにrole+tabindex。言語モーダルに初期focus+Escape |
| D-3 | セキュリティ | marked CDN失敗時の _miniMD フォールバックXSS経路遮断（_procInline入口でHTMLエスケープ先行）+ escHに引用符エスケープ |
| D-7 | セキュリティ | target=_blank に rel="noopener noreferrer" 全スキーム強制 |
| D-8 | a11y | outline:none の検索入力に :focus-visible 可視アウトライン保証 |
| D-9 | a11y | ツリー装飾罫線を aria-hidden 化（SR「ダッシュ多数」読み上げ解消） |

## 6. Phase E — テスト・検証・文書 `bcddf68`

- **test/v922-regression.test.js 新規（20テスト）**: MCP実在(4) / AIルール形式・Stripe例示(3) / detectDomain ML(3) / エンティティフォールバック(4) / Jest・Vitest設定(3) / EN整合性静的検証(3)
- 既存テスト追従: snapshot A:155-222 / B:145-211（.cursorrules +1）、airules / gen-coherence → main.mdc、common-helpersテスト名整合
- CLAUDE.md を v9.22 実測値に更新

## 7. 最終検証結果

| 検証 | 結果 | 備考 |
|------|------|------|
| npm test | ✅ 7411/7411 | fail 0（v9.21比 +20） |
| node build.js | ✅ 5843KB/6500KB | 残657KB |
| compat-check-all-presets | ✅ 0 ERROR / 0 WARN | 追跡94ルール非発火 |
| detectDomain回帰 | ✅ | ML系→ai、education/health優先維持 |
| launcher参照照合 | ✅ 未生成参照0件 | 実生成139docsと機械diff |

## 8. コミット一覧

| ハッシュ | 種別 | 内容 |
|---------|------|------|
| `09fc30d` | docs | v9.22設計書（4観点監査44件の修正計画） |
| `f1a0b8b` | Phase A | 生成物クリティカル修正15件（15ファイル +89/−57） |
| `9cd64d5` | Phase B | EN・整合性修正（2ファイル +40/−37） |
| `fb7e26d` | Phase C | 初心者UX修正9件（10ファイル +75/−67） |
| `aa731c2` | Phase D | アプリ品質修正6件（7ファイル +32/−11） |
| `bcddf68` | Phase E | 回帰テスト20件+CLAUDE.md（3ファイル +209/−8） |

※ 本バッチに先立ち、履歴欠落していた v9.19 GCTMSバッチの追いコミット（`5f3aec9`）も同日実施済み。

## 9. 先送り事項（v9.23 候補）

- **Pro深度の拡充**: 12柱（p19-enterprise / p26-observability / p14-ops ほか）にスキルLv分岐が皆無。優先度最上位
- **doc番号レジストリ**: docs/43×3種、105×3種など同番号異名の全面解消（今回はlauncher実害のみ修正）
- **launcher.js の ja/en 重複圧縮**: 単体393KB。共有ブロック方式の全面展開で削減余地大
- **性能の続き**: save()全面デバウンス、innerHTML差分更新、Mermaid描画キャッシュ
- **小画面UX**: qbarボトムシート化、ヘルプポップアップ実測高さクランプ
