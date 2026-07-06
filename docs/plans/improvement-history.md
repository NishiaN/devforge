# DevForge 改善履歴

**最終更新**: 2026-07-06 | **現在値**: v9.36 / 7500 tests / 5930KB (6500KB上限) / 116 launcher templates / 28 pillars / 227+ generated files

このドキュメントは DevForge の改善バッチ履歴の正典です。各バッチの詳細設計・実施報告は `docs/plans/` 配下、過去バッチ(ext5〜v9.18)の詳細はプロジェクトメモリ `memory/history.md` を参照。

---

## サマリ: 品質改善の到達点

2026-07-06 のセッションで v9.19（履歴欠落の追いコミット）から v9.27 まで9バッチを実施。**生成物の信頼性を「動かない・嘘・矛盾・壊れた参照・レンダリング欠陥ゼロ」まで引き上げ、スキルLv適応を全28柱で完結、AI開発の4層（Prompt→Context→Harness→Loop）を揃えた。**

| 指標 | v9.19開始時 | v9.27現在 | 変化 |
|------|-----------|----------|------|
| テスト | 7391 | **7449** | +58（全て回帰網） |
| ビルドサイズ | 5835KB | 5906KB | +71KB（残594KB） |
| スキルLv適応 | 16/28柱(実態) | **28/28柱** | 完結 |
| launcher テンプレート | 115 | **116** | +1 |
| 生成物の致命傷 | 多数 | **ゼロ** | — |

---

## セッション履歴（2026-07-06）

### v9.19 — GCTMSハーネスエンジニアリング統合（追いコミット） `5f3aec9`
MEMORY.md では完了記録があったが git 履歴から欠落していた変更を確定。docs/135 メモリアーキテクチャ + docs/136 GCTMSガイド + settings.json 3ゾーンパーミッション。**発見経緯**: セッション冒頭の状況確認で、v9.20/v9.21 が v9.19 を含まずにコミットされていたことを検出。

### v9.22 — 信頼性ファーストバッチ（4観点監査 45件） `f1a0b8b`〜`bcddf68`
4体の探索エージェントを並列起動し、初心者UX / プロ+EN / アプリ品質 / 生成物実用価値 の4観点で55件を発見、45件を修正。

- **Phase A（生成物クリティカル 15件）**: 実在しないMCPパッケージ→実在名、Claude Code導入手順を現行仕様（`.mcp.json`/`claude mcp add`）、`.cursor/rules/*.mdc` 現行形式、CLAUDE.md虚偽説明修正、detectDomain「機械学習→education誤検出」解消、Jest無言無効化キー修正、モデル/価格鮮度更新
- **Phase B（EN・整合性 4件）**: EN専用5テンプレート解放、壊れた文書参照14件解消、JP-in-EN混入修正
- **Phase C（初心者UX 9件）**: スキル質問重複解消、v9.6→v9.22全域統一、エラー文言平易化、用語「柱」統一
- **Phase D（アプリ品質 6件）**: save()デバウンス、キーボード完全対応、marked CDN失敗時のXSS経路遮断、noopener強制
- **Phase E**: 回帰テスト20件

詳細: `docs/plans/v922-reliability-design.md`, `docs/plans/v922-implementation-report.md`

### v9.23 — Pro深度バッチ（スキルLv適応 28/28完結） `bbdedb8`〜`87a5f1c`
適応ゼロだった12柱すべてに Pro セクション（skillLv≥5）+ 4柱に Beg入門を追加。**ADD-only原則**で既存コンテンツ無改変、snapshot完全無影響。

| Group | 柱 | Pro深度 |
|-------|-----|---------|
| G1 | p19/p14/p26 | SSO/SCIM+テナント分離テスト / プログレッシブデリバリー / テールサンプリング+マルチバーンレート |
| G2 | p24/p28/p5 | レッドチームCI / Counterfactual実装 / フレーキー隔離+ミューテーションゲート |
| G3 | p13/p15/p16 | RICE+70-20-10ポートフォリオ / シナリオプランニング2×2 / DORA 4メトリクス |
| G4 | p17/p18/p10 | 評価ハーネス3層 / 回帰テストCI / アーキテクチャ適応度関数 |

詳細: `docs/plans/v923-pro-depth-design.md`, `docs/plans/v923-implementation-report.md`

### v9.24 — 体感性能+モバイルバッチ `8ee365f`
- Mermaid SVGキャッシュ（テーマ別キー、再訪時の再レンダリングスキップ）
- サイドバー差分更新（ファイルクリック毎の227件全再構築を解消 → 「最近」節のみ差分）
- ナビ系 save() のデバウンス化 9箇所（データ操作系は即時保存を堅持）
- 小画面UX（qbar max-height+スクロール、ヘルプポップアップ実測高さクランプ）

### v9.25 — 生成物クロスリファレンス完全解消 `bc1ab6a`
フル生成の生成md内に存在した壊れた相互参照 約27件をソース根絶。最大の発生源は `docs/00_pillar_dependency_map` の25ノードの `file:` 定義（旧名・変種名）。条件付きファイル（docs/38決済 / docs/98-2 XAI）への無条件参照を4箇所ガード。2シナリオ×2言語の xref-zero 回帰テスト新設。

### v9.26 — E2E成果物完全性 `fa35b1b`
先送りリスト2件（launcher圧縮・ダッシュボード差分化）を着手前に再評価し、どちらも非優先と判断（前者=残614KBで低緊急・高リスク、後者=filterTechDBが既にdisplayトグル最適化済）。方針転換し、**実バンドルをE2E検査**して実バグを発見: `docs/41` の互換性アラートが `checkCompat()` の存在しないフィールド（`r.severity`/`r.msg_ja`）を読み `undefined` を出力していた。checkCompatの実shape `{level, msg}` に修正。コードフェンス除外のテンプレ漏洩検出+JSON有効性+crown-jewel非空の回帰テスト新設。

### v9.27 — ループエンジニアリング統合（参考資料活用） `4536a4f`
参考資料「ループエンジニアリング」を DevForge の GCTMS(docs/136)の**真上の層**として統合。読むだけでなく**動くループ資産を生成**:

- **docs/137_loop_engineering_guide.md**: Prompt→Context→Harness→Loop 4層 / 5アクション / 6パーツ / 評価役分離。skillLv適応
- **`.claude/settings.json` フック**: PostToolUse=型チェック / Stop=フルテスト。スタック適応（Node→tsc+npm test, Python→pyright+pytest, Vite→vitest, Rust→cargo）
- **`.claude/agents/fixer.md`**: 2回失敗時の行き詰まり打破エージェント（推測禁止/model:opus）
- **CLAUDE.md ループ協議節**: 完了の再定義+停止条件+2つの禁止+@fixer
- launcher `loop_design🔁` テンプレ（116個目）

これで docs/135(Memory)→136(GCTMS Harness)→137(Loop) の4層が揃った。

### v9.28 — UI層クロスリファレンス整合
先送り3件を再評価（launcher圧縮=非優先据置 / 7アンチパターン=保留据置 / **doc番号レジストリ=着手**）。調査の結果、生成md内（v9.25で解消済み）ではなく **UI層に旧命名スキームの参照が大量残存**していたことが判明:

- **qbar `showAIMarkdown`**: `docs/01_architecture` 等の旧名3件 → AIコンテキスト出力からアーキテクチャ/ER/API設計が無言で欠落していた実バグ。実名（03/04/05）に修正
- **dashboard ドメイン別チェックリスト**: fintech/saas/booking の3ボタンが存在しないファイルを `previewFile` → docs/45・73_enterprise_architecture・122_concurrency_consistency_guide に修正
- **export `EXPORT_ROLES`**: 4ロールの priority 9件+prefixes 8件が旧名（06_api_design/07_db_design/22_security/05_roadmap/10_design_system 等）→ ロール別パネル・ZIPから意図ファイルが欠落・誤混入していたのを全面実名化
- **templates.js P22/P23/P24 説明文**: 87-96 の旧名 9件（ja+en 6行）を実名化し、説明内容も実docに対応付け直し
- **compat-rules why文**: `docs/13_payment.md`（存在しない）→ `docs/38_business_model.md` 4件 + 「生成されず」の実挙動に文言正確化
- **docs.js 条件付きパス**: fintech限定 docs/126 の `08_auth` 参照、BDD手法選択時の `93_bdd_scenarios` 参照（いずれもv9.25の2シナリオでは発火せず残存）を修正
- **回帰テスト新設** `test/v928-ui-xref.test.js`（10件）: 5ドメインシナリオ×2言語の生成ユニバースに対し ①UI 6ファイルの docs 参照実在 ②templates 裸名 ③EXPORT_ROLES prefix 生存 ④fintech+payment+BDD の生成物xref を保証

7459 tests / 5906KB。同番号異名の実害（08/93）はこれで解消（00 の3ファイルは意図的なメタ番号）。

### v9.29 — compat why文の実挙動整合（小バッチ）
先送りの「scope_out×決済 why文検証」を実測で完了。生成物挙動を主張する why文 5件のうち3組が実挙動と不一致だった:

- **sem-scope-payment**: 「docs/38/45に非実装明記」と主張 → 実際は docs/107_project_governance.md のみに対象外記録。文言を実挙動（107記録+38生成の矛盾）に書き換え。**途中で切れていた why_en**（"(Stripe, etc." で文終了）も修復
- **dom-ec-nopay / dom-saas-nopay**: 「docs/45にPCI等が含まれません」→ 実測では payment未設定でも45はPCIに言及（汎用行）。主張を検証済み事実（38未生成+決済設計の欠落）に限定
- launcher CI/CDテンプレの出力例 `ci-cd.yml` → 実生成名 `ci.yml` に統一（ja+en）

検証で判明した副産物: scope_out の反映先が限定的 → v9.30候補へ。
**訂正 (v9.30時)**: 「docs/107にしか反映されない」は誤り（検証出力のtail切り詰めによる見落とし）。実際は **.spec/constitution.md §7**（gen-quality Q3でテスト済みの設計挙動）+ docs/107 の2箇所。

### v9.30 — scope_out のAI可視化 `e68bb8e後続`
v9.29の副産物候補を精査し、前提を訂正した上で真のギャップを特定: scope_out は constitution §7 に届くが、**AIが自動で読む CLAUDE.md と、最初に読ませる AI_BRIEF.md には無かった** — AIツールがスコープ外機能を実装してしまう実害リスク。

- **生成CLAUDE.md 禁止事項**: 「スコープ外機能の実装禁止: <値>（.spec/constitution.md §7 参照）」を条件付き追加
- **AI_BRIEF.md Stack節**: 「スコープ外: <値>」1行を条件付き追加（トークン増 <10、上限1400に余裕）
- どちらも `なし`/`none`/未設定では追加されない ADD-only
- **v9.29 why文を再訂正**: sem-scope-payment に constitution §7 を明記（107のみ→2箇所）
- test/v930-scopeout-ai.test.js 新設（4件: ja/en反映+トークン上限+なし/未設定の非追加）

7463 tests / 5907KB。教訓: **検証出力を tail で切り詰めたまま結論を出さない**（v9.29の誤記の原因）。

### v9.31 — EN生成の日本語ハードコード根絶（6エージェント並列）
E2E検査第2弾として「英語回答+EN生成」の全生成物をスキャン → **36ファイル180行**（+条件付きパス41行）に生成器ハードコードの日本語混入を発見。ソースファイル排他分担で5+1エージェント並列修正:

- **p19** docs/76 (66行): `_ec`ファクトリにvariants_en/a11y_en/framework_en追加
- **p24/p28/p17/p11** docs/97/98/128/130/131-2/40: Mermaidラベル・評価メトリクス・AIリスクTier等。**131-2の三項演算子分岐ずれ実バグ**発見修正
- **p20/p21/p22/p23** docs/78/80/86/88/90/92/93: デプロイ戦略・APIテスト・DB最適化コメント等。**p23のen_target死にデータ実バグ**発見修正
- **docs.js** docs/05/13/114/118/122/123/126: 用語集EN側の日本語剥がしレンダリング修正含む
- **common他** README(著者名は意図的に維持)/CLAUDE.md(EN側はEN曖昧語をban)/SETUP/AI_ONBOARDING/41/43/45/53/58/59/109/110/132/63-2/SECURITY_CHECKLIST。**docs/41はcheckCompat()がS.lang(UI言語)でmsg選択していた実バグ** → genLang整合スワップで修正
- **第2弾（条件付きパス）**: health→125、manufacturing+FastAPI+AWS+large→127/117/120/technical-plan SQLAlchemy docstring（41行+隣接漢字のみ12行）
- **test/v931-en-purity.test.js 新設**（6件）: 5シナリオ×EN生成でかな混入ゼロ（README著者名のみ許容）+JA回帰ガード

7469 tests / 5925KB（EN追加で+18KB）。実バグ3件（131-2分岐ずれ/p23死にデータ/41のS.lang混同）も同時解消。

### v9.32 — EN生成の漢字のみ残留根絶（4エージェント並列）
先送り筆頭を着手前実測: 5シナリオ×EN生成の全行スキャンで**ユニーク79行/延べ262箇所**を確認 — 懸念された「中国語共有語の判別難」は実際にはほぼ発生せず、全件が明確な日本語残留（`15分/15m`併記・`/月`・`必須`/`推奨`・`約Xh`・全角`〜`レンジ・`※`等）だった。インベントリでソース17ファイルに全数マッピング後、v9.31プロトコル（排他分担+JA byte-identical+EN側のみ）で4体並列修正:

- **A: docs.js**（17行）: docs/17/107/118のRTO/RPO併記・`T-{種別}-{連番}`→`T-{type}-{seq}`・`CR番号`・docs/121のDoppler `Free〜`/`DB暗号化`/`suppression管理`・WBS `約Xh`・docs/00 `108文書`・docs/20 `(汎用)`（演算子優先度で常に汎用表示だった潜在バグをEN側でドメイン名表示に修正）・**docs/120 `CAP定理`**（事前ヒントの「p11側」は誤りで実体はdocs.js:1621 — 担当が正しく特定、D の担当外報告とも一致）
- **B: p27/p13/p25**（19行）: docs/109/110/112の`/月`・`$26/月〜`・`DDoS保護`・`CPU 70%目標`、docs/48-2の`$0〜$25`レンジ、docs/99 `~2MB/件`。**二次掃引でスキャン未捕捉のBegスキルLv条件付き行3件**（`100GB帯域`等）も回収
- **C: p12/p1/p5/p14/p16**(17行): APPI は `nameEn` フィールド追加方式でJA無変更、.spec の `〜200`/`(日付 〜)`、docs/54の`任意`/`件`閾値（**government/insurance条件付きバリアントも二次掃引で回収**）、docs/63-2の`DRY違反`等、**Python+バックグラウンド機能限定のかな含みRedis行**（v9.31未到達分岐）
- **D: p20/p28/p22/p24/p3/p11/p4**（15行）: docs/79 `🔴必須`×8、docs/78 `1x〜14.4x`、docs/128/130 `施行`/`推奨`、docs/87/88、docs/95 `scopeEn`追加、docs/132、docs/39/40 `※`→`Note:`、skills/factory `MCP混同`
- **統括で2件追加修正**: `DB側で管理`（かな1文字のみ→v9.31の2文字連続検出をすり抜け）と docs/83 `200 OK・201 Created`（`・`=カタカナブロック単発で両検出器の隙間）— **新テストの全行検査だけが捕捉した盲点**
- **test/v932-kanji-purity.test.js 新設**（6件）: 5シナリオ×ENで CJK漢字+日本語全角記号（、。・「」〜※等）ゼロ+JA回帰ガード
- **検証**: 再スキャン0件 / JA byte-identical をSHA1ベースライン照合で確認（5シナリオ×ja 1080ファイル差分0）/ 7475 tests / 5927KB

副産物発見: **npm test の既存フレーク** — build.test.js がスイート中に `node build.js` を実行し、並行の security.test.js が書き込み途中の devforge-v9.html を読むと11件連鎖失敗する（再実行で解消・スタンドアロンは常時合格）。先送りリストに追加。

### v9.33 — npm test フレーク解消（build.test.js の一時ファイルビルド化）

着手前実測: バンドル(devforge-v9.html)を読むテストファイルは build.test.js と security.test.js の2つのみ。`node --test test/*.test.js` はファイル単位で並列実行され、build.test.js 冒頭の `execSync('node build.js')` が6MBの実ファイルを直接上書きするため、並行の security.test.js が書き込み途中を読むと連鎖失敗する構図を確認。先送りリストの第1案（一時ファイルビルド化）が決定的（プラットフォーム依存なし・並列性維持）と判断。

- **build.js**: `--out=path` 出力先オーバーライド追加（未指定時は従来どおり devforge-v9.html、完了メッセージは basename 表示に変更）
- **test/build.test.js**: ビルド先を `os.tmpdir()/devforge-v9.build-test-{pid}.html` に変更（tmpfs 側なので 9p ドライブへの書き込み自体を回避）+ `after()` で削除。既存38テストは一時出力に対して従来どおり全数検証
- **検証**: フルスイート3回連続 7475件全合格 + スイート実行前後で devforge-v9.html の mtime 不変（=スイート中の実ファイル書き込みゼロを機構的に確認）+ 通常ビルドのメッセージ/サイズ不変
- **注意**: npm test は実バンドルを更新しなくなった。security.test.js は事前ビルド済みバンドルを読むため「ビルド→テスト」の順序は引き続き必須（CLAUDE.md に明記）

7475 tests / 5927KB（サイズ変化なし）。CLAUDE.md の陳腐化数値（v9.27表記/5906KB/7449 tests）も現行値に更新。

### v9.34 — 全プリセット完全性掃引（新規改善軸の発掘、実バグ2件）

先送りリストが小粒のみになったため新軸を発掘: v9.26 の出力完全性検査（5シナリオ）を**全プリセット実生成**に拡張。標準257×ja/en + 分野603×ja/en（初回はmedium）= 1718生成の全ファイルを undefined漏出/`[object Object]`/NaN/散文中`${}`漏洩/無効JSON/空ファイルで全数スキャン → **818ヒット・ユニーク2欠陥**を発見:

- **docs/53 (p14-ops.js)**: rateLimits の重要操作キーがドメイン毎に異なる（payment/booking/bid/tokens/…）のに、出力側が `limits.write||limits.payment||…` の6キー固定チェーンで参照 → **22/29ドメインで `- **重要操作**: undefined`（742/1718生成 = 43%で再現）**。CLAUDE.md が警告する `_orm` チェーンと同型。修正は「api/alert 以外のキーを動的に取得」でキー追加に恒久対応
- **docs/44 (p12-security.js)**: `STRIDE_PATTERNS.hasFile` だけ `R`(Repudiation) キー欠落 → ファイル/画像列を持つエンティティ（Product等）の R 列が `undefined`（76/1718生成）。`R:'MED'` 追加（hasUserId と同水準）
- **修正後の拡張掃引**: 分野プリセットを4スケール全部に拡張した **5330生成で検出ゼロ**（乾くまで掃引）
- **scripts/sweep-preset-integrity.js 恒久化**: 全プリセット×言語×スケール掃引を再実行可能に（0件期待・検出時は非0 exit）。プリセット追加後の検証手順に組込み可
- **test/v934-preset-integrity.test.js 新設**（8件）: 旧チェーンが取りこぼす6ドメイン（ai/marketplace/iot/booking/automation/devtool）の docs/53 実生成検証 + Product エンティティの docs/44 STRIDE表 + STRIDE_PATTERNS 全パターン6キー完備の構造ガード。プリセットはドメイン検出で動的選択（改名に頑健）

7483 tests / 5927KB。教訓: **「N個のうち大半で壊れているが誰も見ない」系は列挙生成でしか見つからない** — 両バグとも柱導入時（2026-02、約5ヶ月前）から存在し、サンプルシナリオ検査（v9.26の5シナリオ）・7475件のユニットテストのどちらもスルーしていた（43%のプリセットで再現するのに、検査対象シナリオのドメインがたまたま全部旧チェーンのキーを持っていた）。

### v9.35 — 列挙生成検査の横展開（xref/Mermaid/フェンス + 回答キー誤用の系統バグ発掘）

先送りリスト筆頭を実施: sweep-preset-integrity.js に検出器3本追加（C13相当のxref整合・C14相当のMermaid有効性・コードフェンス閉じ忘れ）→ 5330生成全数掃引。**初回42,707ヒット（79ユニーク）**から実バグ8件+検査器自体のバグ2件を修正:

**検査器（postGenerationAudit）自体のバグ2件** — 実アプリで毎生成、ユーザーに誤警告+docs/82スコア誤減点:
- **C14 `_validStarts` に mindmap 欠落**: docs/30/56/59 の有効な mindmap 図（mermaid 10.9.1対応済）を「Mermaid構文異常」と誤警告（掃引~12,000ヒット相当）
- **C13 が docs/82 を誤検出**: 82は監査結果を受けて監査**後**に生成される設計（index.js finishGen: audit L157 → 82生成 L160）→ 監査時点で常に未存在 → docs/00系の正当な参照が毎回「未生成ドキュメントへの参照」警告に

**フェンス閉じ忘れ3件**（全生成で再現、markdown描画が壊れる）:
- docs/33 (p5-quality.js) / docs/43 (p12-security.js): 閉じ `'```'` の直前に `\n` が無くコード行末に連結 → 行頭に来ずフェンス未閉止。**missing-`+=`と並ぶ新頻出パターン「missing-`\n`」**
- docs/84 (p21-api.js): 閉じフェンスがエンティティループ**内** → 1体目の後でYAMLブロックが閉じ、2体目のpathsがフェンス外に露出

**docs/107 DEC-009 の条件退化1件**（2回目掃引の残67ヒット）: JA側が `/なし/` のみテスト → `payment:'none'`（EN小文字）のプリセットで存在しない docs/38 を参照。`/なし|none/i` に統一

**回答キー誤用の系統バグ6箇所**（回帰テスト作成中の前提検証で発覚 — 掃引では見えない）: `a.entities`（正: `data_entities`）×5 + `a.features`（正: `mvp_features`）×1。フォールバックが「妥当な値」のため undefined 掃引をすり抜けていた:
- p21-api.js:399 → **docs/84 のスキーマ/パスが全生成で User/Post 固定**（プロジェクトの実エンティティを無視）
- p22-database.js → docs/87 エンティティ別テーブル定義例が**全生成でサイレント欠落**
- p23-testing.js → docs/91 エンティティ別フィクスチャが**全生成でサイレント欠落**
- docs.js:1553/1678 → docs/119 エンティティ数が常に1 / docs/120 シャード候補が固定リスト
- p21-api.js:320 → `_hasRT` 常に false → リアルタイムプロトコル節が死にセクション

修正は既存の正しいサイト（p21:279, p25:267）と同型の `a.entities||a.data_entities||…` に統一。**修正後の第3回掃引: 5330生成・検出ゼロ**。test/v935-doc-structure.test.js 新設10件（フェンス偶数全数・docs/84フェンス内包/実エンティティ反映・docs/87/91セクション存在・DEC-009・audit偽陽性ゼロ+検出器動作維持）。CLAUDE.md の分野プリセット数 603→602 補正（テスト・実測とも602が正）。

7493 tests / 5927KB（サイズ変化なし）。

### v9.36 — 回答キー誤用の静的検査（+scale欠落・死にルール2本の発掘）

先送りリスト筆頭を実施。価値実測（questions.js id集合 vs ソース `a.xxx` 参照の差集合grep）の段階で、計画の再発防止を超える**新種の実バグ群**が発覚:

**実バグ1: `S.answers.scale` がアプリ内のどこからも書き込まれていなかった**
- ジェネレータ30箇所+compatルール~116参照が `a.scale||'medium'` フォールバック — フィールドプリセットで solo/large を選んでもスケール条件付きコンテンツは常に medium 相当
- `p:['scale',...]` を持つcompatルール群はアプリ実行時に一度も発火しない（pゲートがキー欠落でスキップ）
- **テスト・検証スクリプトは全て scale を注入していたため機械検証に映らない** — 「誤キー+妥当なフォールバック」（v9.35教訓）のスクリプト注入版
- 修正: フィールドプリセット適用時に `S.answers.scale=_fieldScale` + `S.answers._meta_regulation=fp.meta.regulation` を設定（compat-check-all-presets.js も同じ注入に整合）

**実バグ2: compat-rules.js の `a.entities` 誤用6箇所 — うち死にルール2本**
- `compliance-no-audit-trail`: `p:['purpose','entities']` ゲートが**v9.20導入以来一度も発火不能**（アプリ・検証スクリプト両方で）。復活させると240組合せで発火 → ルール校正（solo除外+health判定を meta.regulation high/strict または医療キーワードに精緻化）+ **高規制プリセット136件の entities に AuditLog 追記**（チェックリスト5の未執行分の追い付け）→ カスケードで7エンティティ閾値超過9件に ページネーション追記（チェックリスト6）
- `db-no-n1-guard`: `a.entities` 参照で manyEnts が常に false → 発火不能。修正で復活
- `compliance-no-dpa` / `tenant-no-rls` / `tenant-shared-db-large`: entities 由来の検出が常に空（過小検出）
- `fix:{f:'entities'}` ×2: 「修正を適用」ボタンが存在しないキーへ書き込む no-op → 追記型 fixFn（data_entities）へ

**実バグ3: テストフィクスチャ自体の誤キー17箇所**（api/cost/database/performance/testing/compat/gen-quality の7ファイル）: `entities:` で回答を組んでおり、**コード側の誤キーとフィクスチャ側の誤キーが相殺して合格していた**（compat.test.js の db-no-n1-guard テスト2件が典型）。v9.35がフォールバック `a.entities||` を残した理由もこのフィクスチャ依存

**恒久化**: test/answer-keys.test.js 新設7件 — ①正キー集合構築（questions.js id + `S.answers.<k>=` 代入の和集合、自己保守型）②ジェネレータ全域 `a.<key>` 全数照合 ③旧誤用キー全面禁止 ④compat-rules `a.<key>` 照合 ⑤p配列ゲートキー照合（発火不能ルール検出）⑥fix/fixFn/chain 書込先照合 ⑦scale設定の回帰。ジェネレータ8箇所の死にフォールバック（`a.entities||`/`a.features||`）も除去し検査を例外なしの厳格形に。おまけ: build.js のプリセットカウンタが `function _fpd(` 宣言を数えて+1していた誤警告（602 vs 603）を修正

検証: compat-check 0 ERROR/0 WARN（2665組合せ）+ sweep 5330生成ゼロ + 7500 tests 全合格。5930KB（+3KB: AuditLog×136+ページネーション×9+ルール校正）

---

## 手法上の教訓（横断）

- **ADD-only原則**: スキルLv/Pro深度追加は「追加のみ・非表示化なし」でsnapshot（intermediate想定）を壊さない。v9.23/v9.27で全面適用
- **E2E検査の価値**: ユニットテスト（構造検証）は「実際にレンダリングされた成果物」の欠陥（undefined出力・テンプレ漏洩）を見逃す。v9.26で実証、v9.31（EN日本語混入221行）で再実証
- **先送りの再評価**: バックログ項目も着手前に価値を測る。v9.26で「既に最適化済み/低緊急」を発見し方針転換
- **テストはビルド後に実行**: security等がdevforge-v9.htmlを読むため、古いビルドで誤検出
- **snapshot harness流用**: `const S`→`var S` 置換が必須（constはevalスコープ外に漏れない）、generate()第3引数がgenLang
- **検証出力をtailで切り詰めたまま結論を出さない**: v9.29の誤記（scope_out反映先の見落とし）の原因。全数出力かファイル書き出しで確認
- **並列修正はソースファイル排他分担**: v9.31で6エージェント並列成功。インベントリ(JSON)先行生成→各自grep特定→「JA byte-identical維持+EN側のみ追加」の厳格ルール+担当外は報告のみ（v9.32で4体再現成功 — 事前ヒントが誤っていてもgrepで実体特定+担当外報告が機能）
- **単一シグナル検出は隙間を生む**: 「かな2文字連続」検出と「かな行除外」スキャンの組み合わせでは、かな1文字混じり（`DB側で管理`）やカタカナブロック単発（`200 OK・201`）が両方をすり抜けた（v9.32）。探索用スキャン（絞り込み優先）と保証用テスト（全行×全文字クラス）は役割を分け、テスト側は検出条件を緩めない
- **テスト失敗はまず切り分け**: フルスイートで失敗したら、当該テストのスタンドアロン実行+再実行で「自分の変更起因」か「並行実行フレーク」かを切り分けてから原因追跡する。v9.32のsecurity 11件連鎖失敗はbuild.test.js再ビルド×バンドル読取の既存競合だった
- **列挙生成検査**: データテーブル（ドメイン別・プリセット別）を参照する出力コードは「大半のエントリで壊れていても代表シナリオ検査を全部すり抜ける」ことがある（v9.34: 43%再現バグが5ヶ月潜伏）。全エントリ実生成×機械スキャンが唯一の網。検出器は探索用（絞り込み）と保証用（全数）を分ける原則（v9.32）と同根
- **検査器自体も検査対象**: アプリ内蔵の監査（C13/C14）を掃引側に複製して全数突き合わせたら、監査自体の偽陽性2件（mindmap欠落・docs/82生成順序）が浮上した（v9.35）。検査ロジックのコピーを別経路で走らせると「検査器のバグ」と「生成物のバグ」が同時に見える
- **「妥当なフォールバック」は掃引の死角**: `a.entities||'User, Post'` のような誤キー+もっともらしい既定値は undefined を出さないため機械スキャン不可視（docs/84 が全生成 User/Post 固定で5ヶ月潜伏）。テスト作成時に「実際の入力値が出力に現れるか」の前提アサーションを書くことでのみ発覚（v9.35）。回答オブジェクトのキーは `data_entities`/`mvp_features` — ジェネレータで `a.entities`/`a.features` を見たら即誤り
- **missing-`\n` はmissing-`+=`に次ぐ頻出パターン**: 閉じ ``` の直前に改行が無いとコード行末に連結され行頭に来ず、フェンスが閉じない（v9.35で2件）。閉じフェンスは `'\n```\n\n'` 形を推奨。ループ内で閉じフェンスを書くと複数回出力される（docs/84）
- **検証ハーネスが正解を注入すると本番経路の欠落が見えない**: scale はテスト・compat-check・sweep が全て自前で注入していたため、「アプリ本体が一度も書き込んでいない」ことに5ヶ月間どの機械検証も気づけなかった（v9.36）。ハーネスの回答構築はアプリの適用関数を通すか、少なくとも注入キー集合をアプリの代入キー集合と突き合わせる
- **フィクスチャとコードが同じ誤りを共有すると相殺して合格する**: コードが誤キー `a.entities` を読み、テストも誤キー `entities:` で回答を組んでいたため、両方が間違ったまま7ファイル17箇所で緑だった（v9.36）。「正」の定義（questions.js の id 集合）から独立に導出する静的検査だけがこの共謀を破れる
- **死にコード（ルール）はバグの貯蔵庫**: 一度も発火しないルール（p配列の誤キー）を復活させると、その背後に未執行の品質基準（高規制プリセット136件のAuditLog欠落）とカスケード（ページネーション閾値超過9件）が積もっていた（v9.36）。「発火ゼロ」はルールの健全性ではなく検査対象

---

## 過去バッチ（v9.18以前）

ext5〜ext22（プリセット257/603到達）、P28 XAI（86番目モジュール）、v9.7（entity-ext復活 +280KB）〜v9.21（UX改善）の詳細は `memory/history.md` に記録。主要マイルストーン:

- **v9.7**: entity-ext dead-codeバグ修正で858 ENTITY_COLUMNS復活
- **v9.14〜v9.16**: DOMAIN_INVARIANTS拡張、P19 Enterprise 32/32完結
- **v9.19**: GCTMS（Guard/Context/Tool/Memory/Supervision）ハーネス導入
- **v9.20**: DOMAIN_INVARIANTS 32/32・TechDB 538完結
- **v9.21**: ドメインヒント32/32・UX改善

---

## 先送り事項（v9.37+ 候補）

- **scale伝播の実挙動確認**（新・筆頭候補）: v9.36で `S.answers.scale` がフィールドプリセットから初めて生成系に届くようになった。スケール条件付きコンテンツ（p21 `_isLarge83`・p25 `_isLargeScale`・compat scale系ルール等）が solo/large 選択で意図通り分岐するかを実生成で確認し、スケール別の生成差分をテスト化する（sweep はscale×4を回すが「差分が出ること」は検証していない）
- **ハーネス注入キーの整合テスト**: sweep/compat-check が answers に注入するキー集合をアプリの代入キー集合（answer-keys.test.js の VALID 相当）と突き合わせる小テスト。v9.36教訓「ハーネスが正解を注入すると本番欠落が見えない」の恒久化
- **launcher.js ja/en 圧縮**（393KB）: サイズ逼迫時に着手（現在570KB余裕）。v9.22で確立した共有ブロック方式の全面展開
- **7アンチパターン明示チェックリスト**: 参考資料の残り題材（既存設計と重複多く保留中）
- **why_ja 350B超過3件のトリム**: Netlify Functions×2 + Python logging（387〜530B）。機能影響なし・低優先
- 完了済: ~~scope_out AI可視化~~(v9.30) | ~~scope_out why文検証~~(v9.29) | ~~doc番号レジストリ~~(v9.28) | ~~EN日本語根絶(かな)~~(v9.31) | ~~漢字のみEN掃引~~(v9.32) | ~~npm testフレーク解消~~(v9.33) | ~~全プリセット完全性掃引~~(v9.34) | ~~列挙生成検査の横展開(xref/Mermaid/フェンス)~~(v9.35) | ~~回答キー誤用の静的検査~~(v9.36)

**次回セッションの開始点**: この先送りリストの筆頭から再評価（着手前に価値を実測 — v9.26/v9.29の教訓）。scale伝播確認は「ブラウザかsnapshotハーネスで同一フィールドプリセットを solo と large で生成→差分比較」が最速の価値実測。
