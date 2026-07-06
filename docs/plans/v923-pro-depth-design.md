# v9.23 Pro深度バッチ — 設計・実装計画

**日付**: 2026-07-06 | **承認**: 済 (12柱一括完結) | **前提**: v9.22 (`de8cd25`)

**ゴール**: スキルLv適応 28/28柱完結。適応ゼロの12柱に Pro (skillLv>=5) セクション + 一部 Beg (Lv<=1) 入門を追加。

## 安全設計
- **ADD-only**: 既存コンテンツ非改変・非表示化なし → snapshot (intermediate) 無影響、レンジ変更不要
- 判定: `const lv=S.skillLv!=null?S.skillLv:(S.skill==='beginner'?1:S.skill==='pro'?5:3);`
- ja+en 両対応 / サイズ +25〜40KB 見込み

## 実装マトリクス

| Grp | 柱 | Pro追加 (lv>=5) | Beg追加 (lv<=1) | 主対象doc |
|-----|-----|----------------|-----------------|----------|
| 1 | p19-enterprise | SSO(SAML/OIDC)+SCIM実装チェックリスト、テナント分離テスト戦略 | — | docs/73 |
| 1 | p14-ops | プログレッシブデリバリー(カナリア分析)、ランブック自動化 | 運用はじめの3ステップ | docs/53 |
| 1 | p26-observability | テールサンプリング、マルチウィンドウburn-rateアラート | — | docs/103/105 |
| 2 | p24-aisafety | レッドチーム評価CI自動化 | AI安全はじめの3ステップ | docs/95/97 |
| 2 | p28-xai | Counterfactual説明の実装パターン | — | docs/128 |
| 2 | p5-quality | フレーキーテスト隔離+ミューテーションゲート | 品質保証はじめの3ステップ | docs/28/32 |
| 3 | p13-strategy | RICEスコアリング+技術投資ポートフォリオ | — | docs/48/50 |
| 3 | p15-future | シナリオプランニング2×2 | — | docs/56系 |
| 3 | p16-deviq | DORA 4メトリクス計測ガイド | — | docs/60 |
| 4 | p17-promptgenome | プロンプト評価ハーネス設計 | — | docs/65 |
| 4 | p18-promptops | プロンプト回帰テストCI | — | docs/69系 |
| 4 | p10-reverse | アーキテクチャ適応度関数 | リバース工学入門 | docs/29 |
| 5 | test/v923-skill-depth.test.js 新規 (~15) + 全検証 + CLAUDE.md/MEMORY更新 | | | |

## 検証基準
- 各Group後: 対象柱テスト + syntax check。Group毎コミット
- 最終: npm test 全パス / build <6500KB / compat 0 WARN
- 新テスト: skillLv=5でPro節出現 + skillLv=3で非出現 (両方向)
