# DevForge v9.23 Pro深度バッチ — 実施報告書

**実施日**: 2026-07-06 | **対象**: v9.22 → v9.23 | **コミット**: `ebcf238`〜`87a5f1c`（6件）
**設計書**: `docs/plans/v923-pro-depth-design.md`

**ゴール**: スキルLv適応を**真の28/28柱で完結**させる。v9.22監査で「12柱にスキルLv分岐ゼロ — 初心者とプロがバイト単位で同一の出力を受け取る」と判明した最後のギャップを解消。

| 指標 | 結果 |
|------|------|
| 対象柱 | **12柱** に Pro節 (skillLv>=5) + うち4柱に Beg入門 (Lv<=1) |
| テスト | **7429 / 7429 パス**（+18件 新規スキル深度テスト） |
| ビルド | **5883KB / 6500KB**（増分 +40KB、残617KB） |
| 互換チェック | **0 ERROR / 0 WARN**（全プリセットcombo） |

## 1. 設計原則 — ADD-only

過去バッチ（v9.12）の教訓を全面適用:

- **既存コンテンツは無改変・非表示化なし** — Pro/Beg セクションを追加のみ → snapshot テスト（intermediate想定）は完全無影響、レンジ変更ゼロ
- 判定は安全パターンで統一: `const lv=S.skillLv!=null?S.skillLv:(S.skill==='beginner'?1:S.skill==='pro'?5:3)`
- 全セクション ja+en 両対応

## 2. Group 1 — 運用/エンタープライズ `bbdedb8`

| 柱 | 対象doc | 追加内容 |
|-----|---------|---------|
| p19-enterprise | docs/73 | **Pro**: SSO実装チェックリスト（SAML 2.0 vs OIDC比較・負のテスト・JITプロビジョニング・SSO強制モード）、SCIM 2.0エンドポイント仕様（ソフト無効化・冪等性）、テナント分離テスト戦略（クロステナント漏洩・RLSバイパス検査・IDOR/JWT改ざん観点） |
| p14-ops | docs/53 | **Pro**: プログレッシブデリバリー（カナリア分析メトリクス表・自動ロールバック条件・1%→100%段階昇格・Argo Rollouts/Flagger）、Runbook as Code（自動化L1→L3昇格基準）。**Beg**: 運用はじめの3ステップ |
| p26-observability | docs/103, docs/105 | **Pro**: Head vs Tail サンプリング比較 + OTel Collector tail_sampling設定例（エラー100%/遅延100%/正常5%）、マルチウィンドウ・マルチバーンレートアラート（14.4x/6x/1x 3段構成 + Prometheus実装、docs/78 SOREゲートと閾値系統一） |

## 3. Group 2 — 安全/品質 `baf2413`

| 柱 | 対象doc | 追加内容 |
|-----|---------|---------|
| p24-aisafety | docs/95 | **Pro**: レッドチーム評価のCI自動化（promptfoo redteam workflow・PRブロックゲート3種・夜間フル+PR時サブセット2段構成・docs/131-2攻撃コーパス連携）。**Beg**: AI安全はじめの3ステップ |
| p28-xai | docs/128 | **Pro**: Counterfactual説明の実装（DiCEコード例・Proximity/Sparsity/Actionability/Diversity品質基準・「何を変えれば承認されるか」UI統合、docs/98-2連携） |
| p5-quality | docs/32 | **Pro**: フレーキーテスト隔離プロセス（検出→隔離→修正→復帰の4ステップSLA・隔離上限2%ルール）、ミューテーションスコアゲート（Stryker段階導入 break:50→+10/四半期）。**Beg**: 品質保証はじめの3ステップ |

## 4. Group 3 — 戦略/IQ `48ac9af`

| 柱 | 対象doc | 追加内容 |
|-----|---------|---------|
| p13-strategy | docs/50 | **Pro**: RICE優先度スコアリング（定義表・運用ルール3則）、技術投資ポートフォリオ 70-20-10（負債返済15%明示確保） |
| p15-future | docs/56 | **Pro**: シナリオプランニング2×2（半日ワークショップ手順・AI規制×AIコストの実例マトリクス・ロバスト戦略/オプション戦略の切り分け・トリガー指標運用） |
| p16-deviq | docs/60 | **Pro**: DORA 4メトリクス計測ガイド（定義・計測ソース・Elite目安・GitHub Actions最小実装・個人評価禁止等の運用注意） |

## 5. Group 4 — プロンプト/逆算 `e8ea732`

| 柱 | 対象doc | 追加内容 |
|-----|---------|---------|
| p17-promptgenome | docs/65 | **Pro**: プロンプト評価ハーネス3層アーキテクチャ（決定的/統計的/LLM-Judge・コスト比較）、ゴールデン/エッジセット構築法、Judge自体の人間採点突合（一致率80%基準）、promptfoo設定例 |
| p18-promptops | docs/69 | **Pro**: プロンプト回帰テストCI（3トリガー対応表・スナップショット+許容差分方式・ベースラインbless運用・temperature=0+3回多数決のフレーク対策） |
| p10-reverse | docs/29 | **Pro**: アーキテクチャ適応度関数（dependency-cruiser/madge/k6/size-limit/ESLint境界の5関数例・ADR紐付け運用）。**Beg**: リバースエンジニアリング（逆算設計）入門 |

## 6. Group 5 — テスト・検証 `87a5f1c`

**`test/v923-skill-depth.test.js` 新規（18テスト）** — 4方向の回帰網:

| 方向 | 件数 | 検証内容 |
|------|------|---------|
| Pro出現 | 13 | skillLv=5 で12柱全てのProマーカーが出力に存在 |
| Int非出現 | 2 | skillLv=3 で Pro/Begマーカーが**存在しない**（ADD-only保証） |
| Beg出現 | 1 | skillLv=0 で4柱のBeg入門が存在 |
| ENバイリンガル | 2 | EN出力にPro節が英語で出現 + 日本語混入なし |

**ハーネス知見**（MEMORY.md記録済み）: snapshot.test.js のハーネス流用時は `const S`→`var S` 置換が必須（constはevalスコープ外に漏れない）。generate() は第3引数が genLang（S.genLang直接設定は上書きされる）。

## 7. 最終検証結果

| 検証 | 結果 |
|------|------|
| npm test | ✅ 7429/7429（v9.22比 +18） |
| node build.js | ✅ 5883KB / 6500KB（+40KB） |
| compat-check-all-presets | ✅ 0 ERROR / 0 WARN |
| Group毎の柱別テスト | ✅ G1:216 / G2:221 / G3:213 / G4:220 全パス |

## 8. コミット一覧

| ハッシュ | 内容 |
|---------|------|
| `ebcf238` | 設計書（12柱一括完結計画） |
| `bbdedb8` | G1: p19/p14/p26（運用/Ent） |
| `baf2413` | G2: p24/p28/p5（安全/品質） |
| `48ac9af` | G3: p13/p15/p16（戦略/IQ） |
| `e8ea732` | G4: p17/p18/p10（プロンプト/逆算） |
| `87a5f1c` | G5: テスト18件 + CLAUDE.md |

## 9. 先送り事項（v9.24 候補）

- **launcher.js ja/en 重複圧縮**: 単体393KB（バンドル最大級）。v9.22 B-1で確立した共有ブロック方式の全面展開でサイズ削減余地大
- **doc番号レジストリ**: docs/43×3種・105×3種など柱組合せによる同番号異名の全面解消
- **性能の続き**: save()全面デバウンス、ダッシュボード/ツリーのinnerHTML差分更新、Mermaid描画キャッシュ
- **小画面UX**: qbarボトムシート化、ヘルプポップアップ実測高さクランプ
