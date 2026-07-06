# v9.22 信頼性ファーストバッチ — 設計・実装計画

**日付**: 2026-07-06 | **承認**: 済 | **方針**: 生成物の「動かない・嘘・矛盾」根絶を最優先

4観点並列監査 (初心者UX / プロ+EN / アプリ品質 / 生成物実用価値) の55件から44件を採用。
Pro深度 (12柱のisPro分岐追加) と doc番号レジストリは v9.23 へ先送り。

## Phase A — 生成物クリティカル修正 (15件)

| # | ファイル | 修正内容 |
|---|---------|---------|
| A-1 | p3-mcp.js:56-68 | MCPパッケージ名を実在名に: `@upstash/context7-mcp` / `@playwright/mcp` / `@supabase/mcp-server-supabase`、postgres archive注記 |
| A-2 | p3-mcp.js:126-129 | 導入手順を `claude mcp add` + `.mcp.json` に修正 |
| A-3 | p3-mcp.js:138 | `\$` エスケープバグ修正 (生JS式が出力混入) |
| A-4 | p4-airules.js:149 | `.cursor/rules` → `.cursor/rules/main.mdc` (globフロントマター付き) |
| A-5 | p4-airules.js:1014,1038-1043 | CLAUDE.md虚偽説明修正: パス別自動読込→手動 `@.claude/rules/xxx.md` 参照 |
| A-6 | p4-airules.js:151-152 | .windsurfrules/.clinerules はファイル維持+現行ディレクトリ形式への移行注記 |
| A-7 | p23-testing.js:420 | `coverageThresholds` → `coverageThreshold` |
| A-8 | p23-testing.js:420,438 | Vitest検出時 vitest.config.ts + @stryker-mutator/vitest-runner 分岐。閾値80/75/85統一 (B-4兼) |
| A-9 | common.js:1677 | detectDomain: education の `学習` を機械学習除外に絞る (ML系→ai誤検出防止) |
| A-10 | common.js:1695-1716 | detectDomain 重複エントリ統合 (IoT×2, realestate×3, embedded finance×2) |
| A-11 | p24:148-149 / p26:886-888 / p27:381-384 / p28:532,539 | モデル名・価格を現行世代に更新 + 「単価は要最新確認」注記 |
| A-12 | p12-security.js:961,1681 / p20-cicd.js:732 | zaproxy@v0.12, anchore現行メジャーにピン更新 |
| A-13 | p1-sdd.js:185-186,319-320 / p4-airules.js:398-405 | Stripe価格を「例示」と明示 + EN出力は $ 表記 (G分岐) |
| A-14 | p1-sdd.js:672-674,713-715 | PBTの例をドメイン整合に + 空アサーション→DOMAIN_INVARIANTS由来の実アサーション |
| A-15 | common.js:1655-1656 | getEntityColumns 未知エンティティにドメイン推論フォールバック |

## Phase B — EN・整合性 (4件)

| # | ファイル | 修正内容 |
|---|---------|---------|
| B-1 | launcher.js:668-1126 | EN PTブロックに欠落5テンプレート追加 (enterprise_arch/workflow_audit/incident_postmortem/capacity_plan/sla_review) |
| B-2 | p5-quality.js:434,439,441 | JP-in-EN 3箇所修正 |
| B-3 | launcher.js:242,294,358,426-434,470-486,542他 | 存在しない文書名参照12件を実生成名に修正 |
| B-4 | (A-8に統合) | カバレッジ目標 80/75/85 統一 |

## Phase C — 初心者UX (8件)

| # | ファイル | 修正内容 |
|---|---------|---------|
| C-1 | questions.js:180 / wizard.js | skill_level質問: S.skillLv設定済みならisQActiveでスキップ |
| C-2 | render.js:134-136 | 空欄送信時トースト表示 |
| C-3 | init.js:255 / index.html:7,41 / i18n.js / guide.js:14,21 | バージョン9.22.0統一、「225+/175」→「227+」 |
| C-4 | generators/index.js:140 | 生成失敗トースト平易化+回復アクション |
| C-5 | init.js:3-4 | グローバルエラーを安心文言に (詳細はconsoleのみ) |
| C-6 | tour.js:12 | ツアーPhase名を実UI名に統一 |
| C-7 | index.html:48 / init.js:176 | 「25問」→skillLv適応表記 |
| C-9 | guide.js/tour.js/init.js/i18n.js | 用語「柱（Pillar）」統一 |

## Phase D — アプリ品質 (6件)

| # | ファイル | 修正内容 |
|---|---------|---------|
| D-1 | state.js:258 / preview.js:610 | 閲覧系save()のみデバウンス (回答・生成系は即時維持) |
| D-2 | generators/index.js:22-23 + clickable div 8箇所 | キーボード対応 (role/tabindex/keydown 共通ヘルパ) |
| D-3 | preview.js:35,83,85 | _miniMD に escH() 先行適用 (XSS遮断) |
| D-7 | preview.js:10-11,120 | target=_blank へ noopener 強制 |
| D-8 | all.css | focus-visible 可視アウトライン保証 |
| D-9 | preview.js:352,354 | SRセパレータ aria-hidden化 |

## Phase E — テスト・検証・文書

- 新規テスト: MCPパッケージ名 / detectDomain(機械学習→非education) / coverageThreshold / EN 5テンプレート / escH
- `npm test` + `node build.js` + `compat-check-all-presets.js` 全パス
- snapshot/gen-quality レンジ調整は必要時のみ
- CLAUDE.md / MEMORY.md 更新

## 制約・検証基準

- サイズ: +30〜60KB想定 (現5835KB / 上限6500KB)
- 7391+テスト全パス / 0 WARN (2665 combos)
- コミットは Phase 単位 (A/B/C/D/E)
- 規約: `const G = S.genLang==='ja'` / UI `const _ja` / `${expr}` 単引用禁止 / save()必須 / esc/escAttr

## 先送り (v9.23 候補)

- E. Pro深度: p19-enterprise / p26-observability / p14-ops へ isPro 分岐
- doc番号レジストリ (番号重複の全面解消)
- launcher.js の ja/en 重複テキスト圧縮 (523KB→)
- save() 全面デバウンス化・innerHTML差分更新・mermaidキャッシュ
