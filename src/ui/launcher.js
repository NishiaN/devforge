/* ── Pillar ⑧ AI Prompt Launcher ── */
function showAILauncher(){
  pushView({pillar:7,type:'launcher',file:null});
  const body=$('prevBody');const _ja=S.lang==='ja';
  const files=S.files;const fKeys=Object.keys(files);
  const hasFiles=fKeys.length>0;

  /* ── Token estimation per folder ── */
  const folders={};
  fKeys.forEach(k=>{
    const dir=k.includes('/')?k.split('/')[0]:'root';
    if(!folders[dir])folders[dir]={files:[],chars:0,tokens:0};
    folders[dir].files.push(k);
    const c=files[k].length;
    folders[dir].chars+=c;
    folders[dir].tokens+=Math.round(c/4);
  });
  const totalTokens=Object.values(folders).reduce((s,f)=>s+f.tokens,0);

  /* ── Prompt templates ── */
  const PT=_ja?{
    review:{icon:'🔍',label:'仕様レビュー',desc:'矛盾・不足・改善点を指摘',
      sys:'あなたは経験豊富なテックリード兼SDDアーキテクトです。',
      prompt:'以下の仕様書群を4ステップでレビューしてください:\n1. constitution.mdの使命とKPIを確認\n2. specification.mdの要件網羅性をチェック\n3. technical-plan.mdのアーキテクチャ妥当性を評価\n4. 全体の整合性と不足事項を指摘\n\n各指摘には優先度(P0=致命的/P1=重要/P2=推奨)を付与してください。',
      fmt:'Markdown表:\n| # | ファイル | 指摘 | 優先度 | 推奨アクション |\n|---|---------|------|--------|----------------|\n| 1 | .spec/xxx.md | ... | P0 | ... |'},
    implement:{icon:'🚀',label:'MVP実装',desc:'仕様書からMVP開発開始',
      sys:'あなたはフルスタック開発者です。SDD仕様書に忠実に実装します。',
      prompt:'docs/23_tasks.mdから最優先タスク(P0またはIssue #1)を1つ選んで実装してください。\n\n実装手順:\n1. 型定義を作成 (TypeScript interface/type)\n2. データアクセス層を実装 (ORM/SDK)\n3. ビジネスロジックを実装\n4. UIコンポーネントを実装\n5. Vitestユニットテストを作成\n\nconstitution.mdの設計原則に従い、technical-plan.mdのアーキテクチャに沿ってください。\n\ndocs/39_implementation_playbook.mdのドメイン別実装パターンを参照し、業種固有のベストプラクティスに従ってください。\ndocs/40_ai_dev_runbook.mdのWSCI（Write→Self-Critique→Improve）ワークフローで品質検証を実施してください。\ndocs/31_industry_playbook.mdのドメイン固有チェックリストも確認してください。',
      fmt:'ファイルパス付きコードブロック:\n```typescript:path/to/file.ts\n// code\n```\n必ずテストを含めてください。'},
    test:{icon:'🧪',label:'テスト生成',desc:'テストケース自動作成',
      sys:'あなたはQAエンジニアです。仕様書からテストケースを網羅的に作成します。',
      prompt:'docs/07_test_cases.mdを参照し、以下の順序でテストケースを生成してください:\n1. 正常系(Happy Path): 基本的なCRUD操作\n2. 異常系(Error Cases): バリデーションエラー、権限エラー\n3. 境界値(Boundary): 空文字列、最大長、NULL\n4. docs/33_test_matrix.mdのテスト優先度マトリクスで実行順序を決定\n5. docs/36_test_strategy.mdの戦略に沿って非機能テストも追加\n\n各テストケースには期待結果を明記してください。',
      fmt:'Vitestテストファイル:\n```typescript:tests/xxx.test.ts\nimport { describe, it, expect } from \'vitest\';\n// tests\n```'},
    refactor:{icon:'♻️',label:'リファクタ提案',desc:'構造改善と技術的負債の解消',
      sys:'あなたはコードレビュアーです。アーキテクチャの改善提案を行います。',
      prompt:'以下の仕様書の技術設計を分析し、リファクタリング提案をしてください。各指摘に工数見積り(S=1-2h/M=3-8h/L=1-2日)を付与してください。\n\nチェック項目:\n- SOLID原則の違反\n- 責務の分離不足(Fat Controller等)\n- スケーラビリティの問題\n- パフォーマンスボトルネック\n- 技術的負債',
      fmt:'Markdown表:\n| 問題 | 違反している原則 | 改善案 | 工数 | 優先度 |\n|------|------------------|--------|------|--------|\n| ... | SRP | ... | M | P1 |'},
    security:{icon:'🔒',label:'セキュリティ監査',desc:'脆弱性とベストプラクティス',
      sys:'あなたはセキュリティエンジニアです。OWASP Top 10 2025を基準に監査します。',
      prompt:'以下のセキュリティドキュメントを事前に確認してください:\n'+
        '- docs/43_security_intelligence.md (スタック適応型チェックリスト)\n'+
        '- docs/44_threat_model.md (STRIDE脅威分析)\n'+
        '- docs/45_compliance_matrix.md (コンプライアンス要件)\n'+
        '- docs/46_ai_security.md (AI/LLMセキュリティ)\n'+
        '- docs/47_security_testing.md (テストテンプレート)\n\n'+
        '仕様書のセキュリティ面をOWASP Top 10 2025の各項目別にチェックしてください:\n'+
        '1. A01 – アクセス制御の不備\n2. A02 – セキュリティ設定ミス\n'+
        '3. A03 – ソフトウェアサプライチェーン\n4. A04 – SSRF（入力検証・URL制限）\n'+
        '5. A05 – 安全でない設計\n6. A06 – 脆弱で古いコンポーネント\n'+
        '7. A07 – 識別と認証の失敗\n8. A08 – ソフトウェアとデータの整合性の不備\n'+
        '9. A09 – セキュリティログと監視の不備\n10. A10 – インフラ保護（DNS Rebinding・Egress制限）\n\n'+
        'docs/08_security.mdの設計と実装の乖離もチェックしてください。\n'+
        'docs/53_ops_runbook.mdのA09項目（セキュリティログ・監視）との整合性も確認してください。\n'+
        '各項目の状態を✅(OK)/⚠️(注意)/❌(脆弱)で評価してください。',
      fmt:'Markdown表:\n| OWASP# | 項目 | 状態 | 詳細 | 推奨対策 |\n|--------|------|------|------|----------|\n| A01 | Access Control | ⚠️ | ... | ... |'},
    docs:{icon:'📝',label:'ドキュメント補完',desc:'不足文書の特定と生成',
      sys:'あなたはテクニカルライターです。開発ドキュメントの品質を高めます。',
      prompt:'以下の仕様書群を分析し、2パート構成で出力してください:\n\n**Part 1: ギャップ分析**\n既存ドキュメントと理想状態の差分を表形式で列挙\n\n**Part 2: 最重要ドキュメント生成**\nギャップ分析で最も優先度が高いドキュメント1つを全文生成してください。\n\n候補:\n- API仕様の詳細化(OpenAPI YAML)\n- シーケンス図(Mermaid)\n- デプロイ手順書(Step-by-step)\n- エラーハンドリング設計',
      fmt:'Part 1: Markdown表\nPart 2: 完全なドキュメント(Markdown)'},
    debug:{icon:'🔧',label:'デバッグ支援',desc:'エラー原因分析と修正提案',
      sys:'あなたは経験豊富なデバッグスペシャリストです。エラーログとスタックトレースから根本原因を特定します。',
      prompt:'以下の手順でデバッグ分析を実行:\n1. docs/25_error_logs.mdの既存パターンと照合（再発or新規を判定）\n2. エラー/スタックトレースの根本原因を特定（5 Whys分析）\n3. docs/37_bug_prevention.mdのチェックリストから該当バグカテゴリを特定\n4. 修正コードと再発防止策を提案\n5. docs/25_error_logs.mdに追記するエントリをドラフト\n6. 重大度が高い場合、docs/34_incident_response.mdのインシデント対応フローに従う',
      fmt:'## 診断結果\n| 項目 | 内容 |\n|------|------|\n| エラー種別 | ... |\n| 根本原因 | ... |\n| 影響範囲 | ... |\n\n## 修正コード\n```typescript:path/to/file.ts\n// fix\n```\n\n## error_logsエントリ\n- 症状/原因/解決策/防止策'},
    arch:{icon:'📐',label:'アーキテクチャ整合性',desc:'設計と実装の乖離を検出',
      sys:'あなたはソフトウェアアーキテクトです。仕様書のアーキテクチャと実装の整合性を検証します。',
      prompt:'アーキテクチャ整合性チェック:\n1. docs/03_architecture.mdのレイヤー構造・パターン定義を確認\n2. .spec/technical-plan.mdの技術方針との一致を検証\n3. コードが定義済みレイヤー境界を違反していないか検査\n4. docs/27_sequence_diagrams.mdのシーケンスフローとの整合性を確認\n5. docs/26_design_system.mdのコンポーネント規約との整合性を確認\n6. 違反箇所に修正案とリファクタリング手順を提示',
      fmt:'Markdown表:\n| # | 違反箇所 | 定義元 | 違反内容 | 深刻度 | 修正案 |\n|---|---------|--------|---------|--------|--------|\n\n## アーキテクチャ適合スコア: X/10'},
    perf:{icon:'⚡',label:'パフォーマンス最適化',desc:'ボトルネック特定と改善提案',
      sys:'あなたはパフォーマンスエンジニアです。非機能要件に基づきボトルネックを特定します。',
      prompt:'パフォーマンス分析:\n1. .spec/constitution.mdの非機能要件（NFR）からパフォーマンス目標値を抽出\n2. docs/41_growth_intelligence.mdのパフォーマンスバジェットとCore Web Vitals目標値を確認\n3. N+1クエリ、不要な再レンダリング、バンドルサイズ問題を検出\n4. 各問題に改善前/改善後の推定値を付与\n5. 優先度順の改善ロードマップを作成\n6. docs/19_performance.mdのパフォーマンス設計パターンと照合\n7. docs/17_monitoring.mdの監視メトリクス（レイテンシ・スループット）との整合性を確認',
      fmt:'## ボトルネック一覧\n| # | 箇所 | 種別 | 現状推定 | 目標値 | 改善策 | 効果 |\n|---|------|------|---------|--------|--------|------|\n\n## 改善コード例\n```typescript:path/to/file.ts\n// optimized\n```'},
    api:{icon:'🔌',label:'API統合コード生成',desc:'外部API連携コードの自動生成',
      sys:'あなたはインテグレーションエンジニアです。型安全なAPI統合コードを生成します。',
      prompt:'API統合コード生成:\n1. docs/05_api_design.mdのエンドポイント定義と認証方式を確認\n2. docs/04_er_diagram.mdのエンティティスキーマからリクエスト/レスポンス型を定義\n3. エラーハンドリング（リトライ・タイムアウト・レート制限）を含む統合コードを生成\n4. docs/08_security.mdのセキュリティ要件に準拠した実装にする\n5. 統合テストのスケルトンを作成',
      fmt:'```typescript:lib/api/client.ts\n// API client with types\n```\n```typescript:lib/api/types.ts\n// Request/Response types\n```\n```typescript:tests/api/integration.test.ts\n// Integration tests\n```'},
    a11y:{icon:'♿',label:'アクセシビリティ監査',desc:'WCAG 2.1準拠チェックと修正',
      sys:'あなたはアクセシビリティ専門家です。WCAG 2.1 AA基準でUIを監査します。',
      prompt:'アクセシビリティ監査:\n1. docs/26_design_system.mdのデザイントークン（色コントラスト・フォントサイズ）を確認\n2. docs/06_screen_design.mdの画面一覧から主要画面のUI要素を特定\n3. WCAG 2.1 AA 4原則（知覚可能・操作可能・理解可能・堅牢）で評価\n4. 各違反に具体的なHTML/ARIA修正コードを提示\n5. docs/57_user_experience_strategy.mdのアクセシビリティ戦略・デジタルウェルビーイングセクションを参照し、UX包括性の観点で追加評価\n6. axe-coreによる自動テストコードを生成',
      fmt:'## WCAG 2.1 AA 監査結果\n| # | 基準 | 画面 | 要素 | 状態 | 修正コード |\n|---|------|------|------|------|------------|\n\n## 自動テスト\n```typescript:tests/a11y.test.ts\n// axe-core tests\n```'},
    migrate:{icon:'🔄',label:'マイグレーション支援',desc:'技術スタック移行計画の策定',
      sys:'あなたはマイグレーションアーキテクトです。データ整合性を保ちながら段階的移行を計画します。',
      prompt:'マイグレーション計画策定:\n1. .spec/technical-plan.mdから現行スタック構成を確認\n2. docs/04_er_diagram.mdからデータスキーマとリレーションを把握\n3. 移行先に合わせたスキーマ変換スクリプトとデータ検証クエリを生成\n4. ブルーグリーンまたはカナリアデプロイによるリスク最小化計画を作成\n5. ロールバック手順を各フェーズに明記',
      fmt:'## マイグレーション計画\n| フェーズ | 作業内容 | 期間 | ロールバック | リスク |\n|---------|---------|------|------------|--------|\n\n## スキーマ変換\n```sql\n-- migration script\n```\n\n## データ検証\n```sql\n-- validation queries\n```'},
    metrics:{icon:'📊',label:'コードメトリクス分析',desc:'複雑度・保守性の定量評価',
      sys:'あなたはソフトウェアメトリクスアナリストです。コード品質を定量的に評価します。',
      prompt:'コードメトリクス分析:\n1. 循環的複雑度（Cyclomatic Complexity）を関数単位で計測\n2. 認知的複雑度（Cognitive Complexity）で理解しにくい箇所を特定\n3. 結合度と凝集度を分析（依存関係の多いモジュールを検出）\n4. 重複コード率とDRY違反箇所を特定\n5. 改善ROI（効果/工数）の高い順に改善計画を提示',
      fmt:'## メトリクスサマリー\n| メトリクス | 値 | 基準 | 判定 |\n|-----------|-----|------|------|\n| 平均循環的複雑度 | X | <10 | ✅/⚠️/❌ |\n\n## ホットスポット\n| ファイル | 関数 | 複雑度 | 改善案 | 工数 |\n|---------|------|--------|--------|------|'},
    i18n:{icon:'🌍',label:'国際化実装',desc:'i18n対応コードの生成',
      sys:'あなたは国際化エンジニアです。既存コードに最小限の変更でi18n対応を追加します。',
      prompt:'国際化実装:\n1. コードからハードコードされた文字列を全て抽出\n2. 翻訳キーの命名規則を定義（scope.component.element形式）\n3. 翻訳ファイル（JSON）を日本語・英語で生成\n4. コードを翻訳関数（t()）呼び出しに置換\n5. 日付・数値・通貨のロケール対応フォーマッターを追加',
      fmt:'## 抽出された文字列\n| キー | 日本語 | English |\n|------|--------|----------|\n\n```json:locales/ja.json\n{}\n```\n```json:locales/en.json\n{}\n```\n\n## 変換後コード\n```typescript:path/to/file.ts\n// i18n-ready code\n```'},
    growth:{icon:'📈',label:'グロース戦略',desc:'成長ファネル・KPI・価格戦略の最適化',
      sys:'あなたはグロースエンジニアです。データドリブンな成長戦略を設計します。',
      prompt:'グロース分析:\n1. docs/41_growth_intelligence.mdの成長ファネルとCVRベンチマークを確認\n2. 現在のスタック構成のシナジースコアを評価\n3. ドメイン別グロース方程式に基づきボトルネックを特定\n4. 5つの成長レバーを優先度順に提案\n5. 松竹梅の3段階価格戦略を設計（行動経済学: 妥協効果・アンカリング）\n6. docs/48_industry_blueprint.mdの業界成長パターン（TAM/SAM/SOM戦略）と照合\n7. docs/50_stakeholder_strategy.mdのターゲット戦略との整合性を検証\n8. docs/56_market_positioning.mdの市場ポジショニング・競合分析をグロースファネルに統合し、差別化優位を特定',
      fmt:'## ファネル分析\n| ステージ | 現状CVR | 目標CVR | 改善施策 |\n\n## 成長レバー\n| # | レバー | 期待効果 | 工数 | 優先度 |\n\n## 価格戦略\n| プラン | 価格 | 機能 | ターゲット |'},
    reverse:{icon:'🎯',label:'ゴール逆算設計',desc:'目標からの逆算計画とギャップ分析',
      sys:'あなたはプロジェクトストラテジストです。ゴールから逆算して計画を策定します。',
      prompt:'ゴール逆算分析:\n1. docs/29_reverse_engineering.mdのゴール定義とリバースフローを確認\n2. docs/30_goal_decomposition.mdのゴールツリーとサブゴールを分析\n3. 現状と目標のギャップを定量的に評価\n4. 優先度マトリクスでマイルストーンを再編成\n5. 依存関係チェーンを検証し、クリティカルパスを特定',
      fmt:'## ギャップ分析\n| 目標 | 現状 | ギャップ | 対策 | 期限 |\n\n## クリティカルパス\n```mermaid\ngantt\n```\n\n## マイルストーン\n| MS | 完了基準 | 依存 | リスク |'},
    incident:{icon:'🚨',label:'インシデント対応',desc:'障害対応ランブック・ポストモーテム作成',
      sys:'あなたはSREエンジニアです。インシデント対応と再発防止を専門とします。',
      prompt:'インシデント対応:\n1. docs/34_incident_response.mdのインシデント対応フローを確認\n2. docs/25_error_logs.mdから関連する過去のエラーパターンを特定\n3. 影響範囲（ユーザー数・機能・データ）を評価\n4. 緊急対応手順（ロールバック・フェイルオーバー）を策定\n5. ポストモーテム（タイムライン・根本原因・改善アクション）をドラフト\n6. docs/53_ops_runbook.mdのSLO/SLI基準と照合し、SLO違反の有無を判定\n7. docs/55_ops_plane_design.mdのサーキットブレーカー設定を確認し、自動遮断の妥当性を評価',
      fmt:'## 影響評価\n| 項目 | 内容 |\n| 影響範囲 | ... |\n| 深刻度 | SEV1/2/3 |\n\n## 対応手順\n1. 検知 → 2. トリアージ → 3. 対応 → 4. 復旧 → 5. 振り返り\n\n## ポストモーテム\n| タイムライン | アクション | 担当 |'},
    onboard:{icon:'🎓',label:'オンボーディング',desc:'新メンバー・AIエージェント向け引き継ぎ資料',
      sys:'あなたはテクニカルオンボーディングスペシャリストです。新しい開発者が最速で戦力化する資料を作成します。',
      prompt:'オンボーディング資料作成:\n1. CLAUDE.mdとAI_BRIEF.mdからプロジェクト概要を要約\n2. .spec/constitution.mdの設計原則とdocs/03_architecture.mdのアーキテクチャを図解\n3. docs/42_skill_guide.mdのスキルレベル別ワークフローを整理\n4. 最初の1週間のタスクリストを.spec/tasks.mdから抽出\n5. よくある落とし穴をdocs/37_bug_prevention.mdから抽出しFAQ化\n6. .claude/rules/の5ファイル構造（spec.md, frontend.md, backend.md, test.md, ops.md）を説明\n7. docs/55_ops_plane_design.mdのDev×Ops責任マトリクスで役割分担を明記',
      fmt:'## プロジェクト概要（5分で理解）\n\n## アーキテクチャ図\n```mermaid\n```\n\n## 最初の1週間\n| 日 | タスク | 参照ファイル |\n\n## FAQ\n| 質問 | 回答 |'},
    cicd:{icon:'⚙️',label:'CI/CD設計',desc:'デプロイパイプラインと品質ゲートの設計',
      sys:'あなたはDevOpsエンジニアです。CI/CDパイプラインと品質ゲートを設計します。',
      prompt:'CI/CD Intelligence レビュー:\n1. docs/77_cicd_pipeline_design.mdの9ステージパイプライン設計を確認し、プロジェクト固有の改善点を指摘\n2. docs/78_deployment_strategy.mdの推奨デプロイ戦略（blue-green/canary等）の妥当性を評価\n3. docs/79_quality_gate_matrix.mdの品質ゲート閾値（カバレッジ・パフォーマンス予算）をレビュー\n4. docs/80_release_engineering.mdのブランチモデル・セマンティックバージョニング・Renovate設定を確認\n5. docs/53_ops_runbook.mdのSLO品質ゲート（エラー率・レイテンシ閾値）との整合性を確認\n6. docs/54_ops_checklist.mdの運用準備チェックリストをリリースゲートに統合\n7. 不足している品質ゲートや最適化余地を特定し、優先度付きで提示',
      fmt:'## パイプライン設計\n```mermaid\nflowchart LR\n```\n\n## 品質ゲートレビュー\n| ステージ | チェック項目 | 閾値 | 現状 | 改善案 |\n\n## GitHub Actions\n```yaml\n# .github/workflows/ci-cd.yml\n```'},
    ops:{icon:'🛡️',label:'Ops準備レビュー',desc:'SLO検証・Feature Flag・サーキットブレーカー設定監査',
      sys:'あなたはSRE/Platform Engineerです。運用準備の妥当性を検証します。',
      prompt:'Ops準備レビュー:\n1. docs/53_ops_runbook.mdのSLO/SLI定義がドメイン要件に適合しているか検証\n2. Feature Flagの網羅性チェック（課金・通知・外部API等の重要機能に対するキルスイッチ）\n3. docs/55_ops_plane_design.mdのサーキットブレーカー閾値（エラー率・タイムアウト）の妥当性を評価\n4. docs/54_ops_checklist.mdの12 Ops Capabilities（Observability, Jobs, Backup等）の実装状況を検証\n5. RPO/RTOが業界基準（Fintech: RPO<5分/RTO<15分等）に適合しているか照合\n6. docs/17_monitoring.mdの監視体制とObservability整合性をチェック\n7. Ops Readiness スコア（12項目）を算出し、不足項目を抽出',
      fmt:'## Ops Readiness スコア\n| Capability | 状態 | 妥当性 | 改善アクション |\n|------------|------|--------|----------------|\n| SLO定義 | ✅/⚠️/❌ | 99.9%(要件: 99.99%) | ... |\n\n## SLO妥当性評価\n| SLI | 現在設定 | ドメイン推奨 | 判定 |\n\n## 改善ロードマップ\n| 優先度 | 項目 | 期限 | 担当 |'},
    strategy:{icon:'🏢',label:'戦略インテリジェンス',desc:'業界ブループリント・テックレーダー・ステークホルダー戦略',
      sys:'あなたはProduct Strategist/Business Analystです。事業戦略の整合性を検証します。',
      prompt:'戦略インテリジェンス分析:\n1. docs/48_industry_blueprint.mdの業界ブループリントとの適合度を検証（TAM/SAM/SOM戦略、規制遵守）\n2. docs/49_tech_radar.mdのテックレーダー評価（Adopt/Trial/Assess/Hold）と技術選定の整合性をチェック\n3. docs/50_stakeholder_strategy.mdのステークホルダー戦略（ターゲット・KPI・成長指標）との乖離を検出\n4. docs/51_operational_excellence.mdの運用成熟度ギャップ分析（現状Lv1→目標Lv3等）\n5. docs/52_advanced_scenarios.mdのロードマップから短期アクション（3ヶ月以内）を抽出\n6. docs/41_growth_intelligence.mdの成長方程式とビジネスモデルの整合性を評価\n7. docs/56_market_positioning.mdのMOAT分析・GTM戦略・ユニットエコノミクスを戦略スコアカードに統合\n8. docs/58_ecosystem_strategy.mdのエコシステム戦略・API-as-Product・DX評価を戦略に統合\n9. 戦略スコアカード（5軸評価）を作成し、優先改善領域を提示',
      fmt:'## 戦略スコアカード\n| 軸 | スコア(1-5) | 評価 | ギャップ |\n|-----|------------|------|----------|\n| 業界適合 | X/5 | ... | ... |\n| 技術選定 | X/5 | ... | ... |\n\n## テックレーダー評価\n| 技術 | 現状採用判断 | Radar推奨 | 乖離理由 |\n\n## 短期アクションプラン（3ヶ月）\n| # | アクション | KPI | 担当 | 期限 |'},
    risk:{icon:'⚖️',label:'リスク・コンプライアンス',desc:'4軸リスク再評価・STRIDE残存リスク・コンプライアンス充足',
      sys:'あなたはRisk Analyst/Compliance Officerです。リスクとコンプライアンスを統合評価します。',
      prompt:'リスク・コンプライアンス分析:\n1. docs/14_risks.mdの4軸リスク（技術・組織・法務・運用）を再評価し、現在の緩和策の有効性を検証\n2. docs/45_compliance_matrix.mdのコンプライアンス充足度（GDPR, PCI-DSS等）をチェック\n3. docs/44_threat_model.mdのSTRIDE脅威分析から残存リスクTOP5を抽出\n4. docs/53_ops_runbook.mdのSLO運用リスク（SLO未達ペナルティ・エスカレーション体制）を評価\n5. リスクヒートマップ（発生確率×影響度）を作成し、P0リスクを特定\n6. コンプライアンス自動監査（Terraform Sentinel/OPA等）の導入状況を確認\n7. docs/59_regulatory_foresight.mdの規制対応（EU AI Act・ESGメトリクス・2026-2030展望）をリスク再評価に統合\n8. リスク緩和策TOP5を優先度順に提示（技術的対策・プロセス改善・保険等）',
      fmt:'## リスクヒートマップ\n| リスク | 確率 | 影響度 | スコア | 緩和策 | 状態 |\n|--------|------|--------|--------|--------|------|\n| ... | H/M/L | H/M/L | X | ... | ✅/⚠️/❌ |\n\n## コンプライアンス充足度\n| 規制 | 要求項目数 | 充足数 | 充足率 | 未対応項目 |\n\n## 残存リスクTOP5\n| # | リスク | STRIDE分類 | 現状緩和策 | 推奨追加対策 | 工数 |'},
    qa:{icon:'🐛',label:_ja?'QA・バグ検出':'QA & Bug Detection',desc:_ja?'ドメイン別バグパターンとQA戦略を基にテスト計画を生成':'Generate test plan based on domain-specific bug patterns and QA strategy',
      sys:_ja?'あなたはQAエンジニアです。docs/28_qa_strategy.mdのドメイン別バグパターンを参照し、具体的なテストシナリオを設計してください。':'You are a QA engineer. Reference docs/28_qa_strategy.md domain-specific bug patterns to design concrete test scenarios.',
      prompt:_ja?'以下の手順で実行:\n1. docs/28_qa_strategy.mdの重点領域を確認\n2. 各重点領域に対し具体的テストケースを3つ以上作成\n3. docs/32_qa_blueprint.mdの品質ゲートチェックリストと照合\n4. docs/33_test_matrix.mdのマトリクスに基づきカバレッジを検証\n5. よくあるバグパターンに対する回帰テストを設計\n6. 業界横断チェックリストの該当項目を検証\n7. 優先度マトリクスに基づきテスト実行順序を決定':'Follow these steps:\n1. Review focus areas from docs/28_qa_strategy.md\n2. Create 3+ concrete test cases per focus area\n3. Cross-reference with docs/32_qa_blueprint.md quality gate checklist\n4. Verify coverage against docs/33_test_matrix.md matrix\n5. Design regression tests for common bug patterns\n6. Verify applicable cross-cutting checklist items\n7. Determine test execution order based on priority matrix',
      fmt:_ja?'Markdown表形式: テストID|カテゴリ|シナリオ|期待結果|優先度(CRITICAL/HIGH/MED/LOW)':'Markdown table: TestID|Category|Scenario|Expected Result|Priority(CRITICAL/HIGH/MED/LOW)'},
    methodology:{icon:'🧬',label:_ja?'ドメイン最適手法':'Optimal Methodology',desc:_ja?'docs/60参照し最適設計アプローチを深堀り':'Deep-dive optimal design approach from docs/60',
      sys:_ja?'あなたは経験豊富な設計アーキテクトです。docs/60_methodology_intelligence.mdの選定手法を基に、具体的な実装戦略を提案してください。':'You are an experienced design architect. Propose concrete implementation strategy based on selected methodology from docs/60_methodology_intelligence.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/60_methodology_intelligence.mdの第一選択・第二選択手法を確認\n2. 各手法のキーワードに基づく具体的な実装パターンを3つ以上提案\n3. 12設計アプローチの適合度評価を参照し、優先度マトリクスを作成\n4. 組み合わせシナジーを技術的に実現する方法を提案\n5. フェーズ別実装計画（Phase 1: 基盤→Phase 2: 拡張→Phase 3: 最適化）の詳細化':'Follow these steps:\n1. Review primary/secondary approaches from docs/60_methodology_intelligence.md\n2. Propose 3+ concrete implementation patterns based on each approach keywords\n3. Create priority matrix referencing 12 design approaches fit evaluation\n4. Propose technical methods to realize combination synergies\n5. Detail phased implementation plan (Phase 1: Foundation→Phase 2: Expansion→Phase 3: Optimization)',
      fmt:_ja?'Markdown表形式: フェーズ|手法|実装パターン|期待効果|工数(S/M/L)':'Markdown table: Phase|Approach|Implementation Pattern|Expected Effect|Effort(S/M/L)'},
    brainstorm:{icon:'🎭',label:_ja?'9人の専門家ブレスト':'9-Expert Brainstorm',desc:_ja?'創造工学の9視点で固定観念を突破':'Break fixed ideas with 9 creative perspectives',
      sys:_ja?'あなたは9人の専門家が同居する創造的思考システムです。各専門家の個性を維持しながら、プロジェクトに関する多角的なアイデアを生成します。\n\n専門家チーム:\n①🎨クリエイティブ(美・物語・体験重視)\n②⚙️技術専門家(実現可能性・最適化重視)\n③📊ビジネス(収益・市場・競争優位重視)\n④📚学術研究者(エビデンス・理論・先行研究重視)\n⑤🔬科学者(仮説検証・データ・測定重視)\n⑥👤ユーザー代表(使いやすさ・感情・日常動線重視)\n⑦💥ディスラプター(既成概念破壊・逆張り重視)\n⑧😄ユーモリスト(楽しさ・驚き・記憶に残る体験重視)\n⑨🧭冒険家(大胆さ・リスクテイク・未踏領域重視)':'You are a creative thinking system where 9 experts coexist. Generate multi-perspective ideas while maintaining each expert\'s personality.\n\nExpert Team:\n①🎨Creative (aesthetics, storytelling, experience)\n②⚙️Technical (feasibility, optimization)\n③📊Business (revenue, market, competitive advantage)\n④📚Academic (evidence, theory, prior research)\n⑤🔬Scientist (hypothesis testing, data, measurement)\n⑥👤User Rep (usability, emotions, daily workflows)\n⑦💥Disruptor (challenging norms, contrarian thinking)\n⑧😄Humorist (fun, surprise, memorable experiences)\n⑨🧭Adventurer (boldness, risk-taking, unexplored territory)',
      prompt:_ja?'以下のプロジェクトについて、9人の専門家が順番にアイデアを1つずつ提案してください。\n\n【フォーマット】各専門家ごとに:\n- アイデア名（10文字以内）\n- 提案内容（3文）\n\n全員の提案後、3軸評価マトリクスを作成:\n| アイデア | 魅力度(1-5) | 実現可能性(1-5) | 妥当性(1-5) | 総合 |\n\n最後に「クロスポリネーション」として、異なる専門家のアイデアを組み合わせた「最強のハイブリッド案」を1つ提案。':'For the following project, each of the 9 experts proposes one idea in sequence.\n\n【Format】For each expert:\n- Idea name (10 words max)\n- Proposal (3 sentences)\n\nAfter all proposals, create a 3-axis evaluation matrix:\n| Idea | Appeal(1-5) | Feasibility(1-5) | Validity(1-5) | Total |\n\nFinally propose one "Cross-Pollination" hybrid idea combining concepts from different experts.',
      fmt:_ja?'## 9専門家アイデア\n| 専門家 | アイデア名 | 提案内容 |\n\n## 3軸評価マトリクス\n| アイデア | 魅力度 | 実現可能性 | 妥当性 | 総合 |\n\n## クロスポリネーション案\n**組み合わせ**: 専門家X×専門家Y\n**ハイブリッドアイデア**: ...':'## 9-Expert Ideas\n| Expert | Idea Name | Proposal |\n\n## 3-Axis Evaluation Matrix\n| Idea | Appeal | Feasibility | Validity | Total |\n\n## Cross-Pollination Proposal\n**Combination**: Expert X × Expert Y\n**Hybrid Idea**: ...'},
    ux_journey:{icon:'🎯',label:_ja?'UXジャーニー設計':'UX Journey Design',desc:_ja?'Lv.0-5段階的開示でアプリのUXを設計':'Design app UX with Lv.0-5 progressive disclosure',
      sys:_ja?'あなたはUXデザイン専門家です。段階的開示・認知負荷管理・ペインポイントストーリーテリングの3つの視点でユーザージャーニーを設計します。':'You are a UX design expert. Design user journeys from 3 perspectives: progressive disclosure, cognitive load management, and pain point storytelling.',
      prompt:_ja?'以下のプロジェクトのターゲットアプリについて、Lv.0（完全初心者）からLv.5（エキスパート）までの6段階ユーザージャーニーを設計してください:\n\n各Lvで:\n①ペルソナ（年齢・職業・ITリテラシー）\n②つまずきポイント（具体的な操作ミス・混乱箇所）\n③必要なUXパターン（オンボーディング/ツールチップ/段階的開示等）\n④離脱リスク（何があると諦めるか）\n⑤改善アクション（具体的UI変更案）\n\n次に「3つの悪夢」を特定:\n- 悪夢①: ユーザーが最も恐れる失敗体験\n- 悪夢②: 二番目に怖い体験\n- 悪夢③: 三番目に怖い体験\n\n各悪夢に対し、それを防ぐUI設計を提案してください。':'Design a 6-level user journey (Lv.0=complete beginner to Lv.5=expert) for this project:\n\nFor each Lv:\n①Persona (age, occupation, IT literacy)\n②Stumbling points (specific mistakes, confusion areas)\n③Required UX patterns (onboarding/tooltip/progressive disclosure etc.)\n④Churn risk (what makes users give up)\n⑤Improvement action (specific UI change)\n\nThen identify "3 Nightmares":\n- Nightmare①: The failure experience users fear most\n- Nightmare②: Second most feared\n- Nightmare③: Third most feared\n\nPropose UI designs that prevent each nightmare.',
      fmt:_ja?'## Lv別ジャーニーマップ\n| Lv | ペルソナ | つまずき | UXパターン | 離脱リスク | 改善アクション |\n\n## 3つの悪夢分析\n| 悪夢 | 体験 | 防ぐUI設計 |\n\n## Mermaid Journey図\n```mermaid\njourney\n  title ユーザージャーニー\n```':'## Lv-by-Lv Journey Map\n| Lv | Persona | Stumbling | UX Pattern | Churn Risk | Improvement |\n\n## 3 Nightmares Analysis\n| Nightmare | Experience | Preventive UI Design |\n\n## Mermaid Journey Diagram\n```mermaid\njourney\n  title User Journey\n```'},
    ai_model_guide:{icon:'🤖',label:_ja?'AIモデル使い分け':'AI Model Selection',desc:_ja?'開発フェーズ別に最適AIモデルを選定':'Select optimal AI model per dev phase',
      sys:_ja?'あなたはAIモデル活用の専門家です。各AIモデルの「個性」（Gemini=正確性・広い知識、Claude=倫理・洗練、ChatGPT=創造性・自由度、Copilot=バランス・コード補完）を深く理解し、タスク適性を分析します。':'You are an AI model utilization expert. You deeply understand each AI model\'s "personality" (Gemini=accuracy & broad knowledge, Claude=ethics & refinement, ChatGPT=creativity & freedom, Copilot=balance & code completion) and analyze task suitability.',
      prompt:_ja?'以下のプロジェクトの各開発フェーズで最適なAIモデルを提案してください:\n\nフェーズ: ①設計・アーキテクチャ ②実装・コーディング ③テスト・QA ④コードレビュー ⑤デプロイ・Ops\n\n各フェーズで:\n1. 推奨モデル（第一/第二候補）\n2. 選定理由（そのモデルの個性がなぜこのフェーズに合うか）\n3. ナチュラルプロンプト例（「ハンマー型」—使う道具の特性を活かした指示）\n4. 避けるべきアンチパターン（そのモデルが苦手なこと）\n\n最後に「AIモデル切替タイミング」ガイドを作成。':'Propose the optimal AI model for each development phase of this project:\n\nPhases: ①Design/Architecture ②Implementation/Coding ③Testing/QA ④Code Review ⑤Deploy/Ops\n\nFor each phase:\n1. Recommended model (primary/secondary)\n2. Selection reason (why this model\'s personality fits this phase)\n3. Natural prompt example ("hammer type" — instructions that leverage the tool\'s strengths)\n4. Anti-patterns to avoid (what this model struggles with)\n\nFinally create an "AI Model Switching Timing" guide.',
      fmt:_ja?'## フェーズ別AIモデル推奨\n| フェーズ | 推奨AI | 理由 | ナチュラルプロンプト例 | アンチパターン |\n\n## AIモデル個性マップ\n| モデル | 強み | 弱み | 最適ユースケース |\n\n## 切替タイミングガイド\n- 設計→実装: ...\n- 実装→レビュー: ...':'## AI Model Recommendations by Phase\n| Phase | Recommended AI | Reason | Natural Prompt Example | Anti-patterns |\n\n## AI Model Personality Map\n| Model | Strengths | Weaknesses | Best Use Case |\n\n## Switching Timing Guide\n- Design→Impl: ...\n- Impl→Review: ...'},
    industry:{icon:'🏭',label:_ja?'業界特化分析':'Industry Deep Dive',desc:_ja?'docs/62で規制・落とし穴を検証':'Verify regulations & pitfalls from docs/62',
      sys:_ja?'あなたは業界コンプライアンス専門家です。docs/62_industry_deep_dive.mdの業界特有の落とし穴とアーキテクチャパターンを基に、リスク分析を実施してください。':'You are an industry compliance expert. Conduct risk analysis based on industry-specific pitfalls and architecture patterns from docs/62_industry_deep_dive.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/62_industry_deep_dive.mdの主要規制リストを確認し、現在の技術スタックでの準拠状況を評価\n2. 業界特有の落とし穴一覧から、このプロジェクトで該当する項目をピックアップ\n3. 各落とし穴に対する対策の実装状況を検証（✅実装済/⚠️部分的/❌未実装）\n4. docs/45_compliance_matrix.mdのコンプライアンスマトリクスと照合し、ギャップを特定\n5. 推奨アーキテクチャパターン（認証レイヤー、暗号化ストレージ、監査ログ）の実装計画を策定':'Follow these steps:\n1. Review key regulations from docs/62_industry_deep_dive.md and assess compliance status with current tech stack\n2. Pick applicable items from industry-specific pitfalls list\n3. Verify implementation status of countermeasures for each pitfall (✅Implemented/⚠️Partial/❌Not implemented)\n4. Cross-reference with docs/45_compliance_matrix.md compliance matrix to identify gaps\n5. Develop implementation plan for recommended architecture patterns (auth layer, encrypted storage, audit log)',
      fmt:_ja?'## 規制準拠状況\n| 規制 | 要求事項 | 実装状況 | ギャップ | 対策優先度 |\n\n## 落とし穴チェック\n| # | 落とし穴 | 該当性 | 対策状況 | 実装計画 |\n\n## アーキテクチャ改善提案\n```mermaid\ngraph LR\n```':'## Regulatory Compliance\n| Regulation | Requirements | Status | Gap | Priority |\n\n## Pitfall Check\n| # | Pitfall | Applicability | Status | Plan |\n\n## Architecture Improvement\n```mermaid\ngraph LR\n```'},
    nextgen:{icon:'🔮',label:_ja?'次世代UX探索':'Next-Gen UX',desc:_ja?'docs/63でAgentic/Spatial/Calm設計':'Agentic/Spatial/Calm design from docs/63',
      sys:_ja?'あなたは次世代UX設計のスペシャリストです。docs/63_next_gen_ux_strategy.mdのPolymorphic Engineコンセプトを基に、革新的なUX提案を行ってください。':'You are a next-gen UX design specialist. Propose innovative UX based on Polymorphic Engine concept from docs/63_next_gen_ux_strategy.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/63_next_gen_ux_strategy.mdのThe Context Loop（Sensing→Thinking→Morphing→Acting）フレームワークを確認\n2. 4つの次世代UXキーワード（Agentic Workflow、Generative UI、Spatial Computing、Calm Technology）のプロジェクト適用プロンプトを選択\n3. 選択したキーワードを主要機能（例: ダッシュボード、検索、予約）に適用した具体的なUI設計案を3つ以上提案\n4. ドメイン特化適用例を参照し、業種固有のベストプラクティスを反映\n5. 各提案の実装難易度（S/M/L）、期待UX改善効果、技術的実現可能性を評価':'Follow these steps:\n1. Review The Context Loop (Sensing→Thinking→Morphing→Acting) framework from docs/63_next_gen_ux_strategy.md\n2. Select project application prompts for 4 next-gen UX keywords (Agentic Workflow, Generative UI, Spatial Computing, Calm Technology)\n3. Propose 3+ concrete UI design proposals applying selected keywords to main features (e.g., dashboard, search, booking)\n4. Reference domain-specific application examples and reflect industry-specific best practices\n5. Evaluate implementation difficulty (S/M/L), expected UX improvement effect, and technical feasibility for each proposal',
      fmt:_ja?'## UX提案\n| # | キーワード | 適用機能 | 具体的設計 | 難易度 | 効果 | 実現可能性 |\n\n## Polymorphic Engineフロー\n```mermaid\ngraph LR\n  Sensing --> Thinking --> Morphing --> Acting\n```\n\n## 実装ロードマップ\n| Phase | 機能 | キーワード | 期待効果 | 工数 |':'## UX Proposals\n| # | Keyword | Feature | Design | Difficulty | Effect | Feasibility |\n\n## Polymorphic Engine Flow\n```mermaid\ngraph LR\n  Sensing --> Thinking --> Morphing --> Acting\n```\n\n## Implementation Roadmap\n| Phase | Feature | Keyword | Effect | Effort |'},
    cognitive:{icon:'🧠',label:_ja?'認知負荷分析':'Cognitive Load Analysis',desc:_ja?'docs/60で認知負荷とフロー状態を設計':'Cognitive load & flow state design from docs/60',
      sys:_ja?'あなたは認知科学とUXの専門家です。docs/60_methodology_intelligence.mdの認知負荷最小化・フロー状態設計の観点から、UI/UX改善を提案してください。':'You are a cognitive science and UX expert. Propose UI/UX improvements from cognitive load minimization and flow state design perspectives in docs/60_methodology_intelligence.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/60_methodology_intelligence.mdの12設計アプローチ適合度評価から、「認知負荷最小化」「フロー状態設計」の適合度を確認\n2. 主要画面（ダッシュボード、一覧、詳細、フォーム）ごとに認知負荷を分析（情報量、選択肢数、階層深度）\n3. フロー状態を阻害する要素（中断、待機時間、複雑な操作）を特定\n4. 認知負荷削減策（プログレッシブ開示、デフォルト値、スマート検索）を提案\n5. フロー状態維持策（キーボードショートカット、オートセーブ、コンテキスト保持）を提案\n6. docs/26_design_system.mdのデザインシステムとの整合性を検証':'Follow these steps:\n1. Check fit for "Cognitive Load Min." and "Flow State Design" from 12 design approaches evaluation in docs/60_methodology_intelligence.md\n2. Analyze cognitive load for each main screen (dashboard, list, detail, form): info volume, choice count, hierarchy depth\n3. Identify flow state inhibitors (interruptions, wait time, complex operations)\n4. Propose cognitive load reduction measures (progressive disclosure, default values, smart search)\n5. Propose flow state maintenance measures (keyboard shortcuts, auto-save, context preservation)\n6. Verify consistency with design system in docs/26_design_system.md',
      fmt:_ja?'## 認知負荷分析\n| 画面 | 情報量 | 選択肢数 | 階層深度 | 認知負荷スコア(1-10) | 改善案 |\n\n## フロー状態阻害要因\n| # | 要因 | 影響度 | 削減策 | 期待効果 |\n\n## 改善ロードマップ\n| 優先度 | 施策 | 対象画面 | 工数 | 効果 |':'## Cognitive Load Analysis\n| Screen | Info Volume | Choices | Depth | Load Score(1-10) | Improvement |\n\n## Flow State Inhibitors\n| # | Inhibitor | Impact | Reduction | Effect |\n\n## Improvement Roadmap\n| Priority | Measure | Target Screen | Effort | Effect |'},
    genome:{icon:'🧩',label:_ja?'プロンプトゲノム分析':'Prompt Genome Analysis',desc:_ja?'docs/65でCRITERIA 8軸プロンプト品質を最適化':'Optimize prompt quality with CRITERIA 8-axis from docs/65',
      sys:_ja?'あなたはプロンプトエンジニアリングの専門家です。docs/65_prompt_genome.mdのCRITERIA 8軸フレームワーク（Context/Role/Instructions/Thought Process/Execution Rules/Reflection/Iteration/Adaptation）を基に、プロンプト品質の分析と改善提案を行います。':'You are a prompt engineering expert. Analyze prompt quality and provide improvement proposals based on the CRITERIA 8-axis framework (Context/Role/Instructions/Thought Process/Execution Rules/Reflection/Iteration/Adaptation) from docs/65_prompt_genome.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/65_prompt_genome.mdのプロンプトDNAプロファイル（ドメイン・アプローチ・成熟度レベル）を確認\n2. 現在使用しているプロンプトをCRITERIA 8軸で評価（各軸1-5点、加重スコアを算出）\n3. スコアが低い軸（3点以下）の改善案を具体的に提案\n4. フェーズ別プロンプトライブラリから最適なテンプレートを選択\n5. 成熟度レベル（Level 1/2/3）に適した適応バリアントを提案\n6. docs/67_prompt_composition_guide.mdの4層アーキテクチャ（Meta/Structure/Content/Adaptation）を適用した複合プロンプトを設計':'Follow these steps:\n1. Review Prompt DNA profile (domain, approach, maturity level) from docs/65_prompt_genome.md\n2. Evaluate current prompts on CRITERIA 8 axes (1-5 points each, calculate weighted score)\n3. Propose specific improvements for low-scoring axes (3 points or below)\n4. Select optimal templates from phase-by-phase prompt library\n5. Propose maturity-level-appropriate variants (Level 1/2/3)\n6. Design composite prompts applying 4-layer architecture (Meta/Structure/Content/Adaptation) from docs/67_prompt_composition_guide.md',
      fmt:_ja?'## CRITERIA評価\n| 軸 | 重み | 現スコア | 目標 | 改善案 |\n|-----|------|---------|------|--------|\n| Context | 15% | ? | 5 | ... |\n\n**加重総スコア**: ? / 5\n\n## 改善後プロンプト\n```\n[CRITERIA準拠の改善プロンプト]\n```\n\n## 4層設計\n| Layer | 内容 |\n|-------|------|\n| Meta | ... |\n| Structure | ... |\n| Content | ... |\n| Adaptation | ... |':'## CRITERIA Evaluation\n| Axis | Weight | Current | Target | Improvement |\n|------|--------|---------|--------|-------------|\n| Context | 15% | ? | 5 | ... |\n\n**Weighted Total Score**: ? / 5\n\n## Improved Prompt\n```\n[CRITERIA-compliant improved prompt]\n```\n\n## 4-Layer Design\n| Layer | Content |\n|-------|--------|\n| Meta | ... |\n| Structure | ... |\n| Content | ... |\n| Adaptation | ... |'},
    react_debug:{icon:'🔄',label:_ja?'ReActデバッグ':'ReAct Debug Loop',desc:_ja?'Reason→Act→Observe→Verifyの自律デバッグサイクル':'Autonomous debug cycle with Reason→Act→Observe→Verify',
      sys:_ja?'あなたはReActプロトコルの専門家です。docs/70_react_workflow.mdのReAct 4ステージ（Reason→Act→Observe→Verify）と自己デバッグループを用いて、問題を自律的に診断・修正します。':'You are a ReAct protocol expert. Diagnose and fix problems autonomously using the 4-stage ReAct cycle (Reason→Act→Observe→Verify) and self-debug loop from docs/70_react_workflow.md.',
      prompt:_ja?'以下のReActサイクルで問題を解決してください:\n\n**Reason (思考)**: 現在のエラー・バグ・問題を分析。根本原因の仮説を3つ列挙。\n\n**Act (実行)**: 最も可能性が高い仮説を検証するアクションを実行。docs/70_react_workflow.mdのフェーズ別ツール選定を参照。\n\n**Observe (観察)**: アクション結果を客観的に記録。期待と実際の差異を特定。\n\n**Verify (検証)**: 問題が解決されたか成功基準（型安全・テスト通過・lint通過）で確認。\n\n失敗の場合は自己デバッグループ（最大3反復）を実施。3回失敗したら人間へエスカレーション。':'Resolve the problem using the following ReAct cycle:\n\n**Reason**: Analyze current error/bug/problem. List 3 root cause hypotheses.\n\n**Act**: Execute action to test most likely hypothesis. Reference phase-specific tool selection from docs/70_react_workflow.md.\n\n**Observe**: Objectively record action results. Identify gaps between expected and actual.\n\n**Verify**: Confirm problem resolved against success criteria (type safety, tests pass, lint pass).\n\nIf failed, run self-debug loop (max 3 iterations). Escalate to human after 3 failures.',
      fmt:_ja?'## Reason\n**根本原因仮説:**\n1. ...\n2. ...\n3. ...\n\n## Act\n**実行:** `{tool} {args}`\n\n## Observe\n**結果:** ...\n**期待との差異:** ...\n\n## Verify\n**成功基準達成:** [ ] 型安全 [ ] テスト通過 [ ] lint通過\n**次のアクション:** ...\n\n---\n_iter 1/3 — 解決 / 未解決 → 次反復_':'## Reason\n**Root Cause Hypotheses:**\n1. ...\n2. ...\n3. ...\n\n## Act\n**Execute:** `{tool} {args}`\n\n## Observe\n**Result:** ...\n**Gap from expected:** ...\n\n## Verify\n**Success criteria met:** [ ] Type safe [ ] Tests pass [ ] Lint pass\n**Next action:** ...\n\n---\n_iter 1/3 — Resolved / Unresolved → next iteration_'},
    prompt_ops:{icon:'🔧',label:_ja?'プロンプトOpsレビュー':'Prompt Ops Review',desc:_ja?'プロンプト品質をCRITERIA基準で評価・改善提案':'Evaluate prompt quality against CRITERIA and suggest improvements',
      sys:_ja?'あなたはLLMOpsとプロンプトCI/CDの専門家です。docs/69_prompt_ops_pipeline.md（ライフサイクル管理）、docs/71_llmops_dashboard.md（メトリクス）、docs/72_prompt_registry.md（テンプレートカタログ）を参照し、プロンプトの運用品質を総合評価します。':'You are an LLMOps and Prompt CI/CD expert. Comprehensively evaluate prompt operational quality by referencing docs/69_prompt_ops_pipeline.md (lifecycle management), docs/71_llmops_dashboard.md (metrics), and docs/72_prompt_registry.md (template catalog).',
      prompt:_ja?'以下の手順でプロンプトの運用品質を評価・改善してください:\n\n1. **ライフサイクルチェック** (docs/69): 対象プロンプトが5ステージ（起草→レビュー→テスト→デプロイ→監視）のどこにあるかを特定。現ステージのチェックリストを評価。\n\n2. **LLMOpsメトリクス評価** (docs/71): 現在のAI成熟度レベルに対応するスタックのメトリクス（成功率・コスト・レイテンシ）を確認し、閾値との差異を計算。\n\n3. **CRITERIA連携スコアリング** (docs/65 + docs/71): CRITERIA 8軸の現スコアをLLMOpsメトリクスにマッピング。スコアが低い軸（3以下）の改善案を提示。\n\n4. **Registryへの登録提案** (docs/72): Template-ID命名規則に従い、バージョン番号・CRITERIA目標スコアをドラフト。\n\n5. **A/Bテスト計画**: 改善後バージョンとの比較計画を作成（メトリクス定義・有意差基準）。':'Evaluate and improve prompt operational quality following these steps:\n\n1. **Lifecycle check** (docs/69): Identify which of 5 stages (Draft→Review→Test→Deploy→Monitor) the target prompt is in. Evaluate current stage checklist.\n\n2. **LLMOps metrics evaluation** (docs/71): Review stack metrics for current AI maturity level (success rate, cost, latency) and calculate gap from thresholds.\n\n3. **CRITERIA-integrated scoring** (docs/65 + docs/71): Map CRITERIA 8-axis current scores to LLMOps metrics. Present improvements for low-scoring axes (3 or below).\n\n4. **Registry registration proposal** (docs/72): Draft Template-ID following naming convention with version number and CRITERIA target scores.\n\n5. **A/B test plan**: Create comparison plan for improved version (metric definitions, significance thresholds).',
      fmt:_ja?'## ライフサイクル状況\n現ステージ: {Draft/Review/Test/Deploy/Monitor}\n未達チェック: [ ] ...\n\n## LLMOpsメトリクス\n| メトリクス | 現在値 | 閾値 | 評価 |\n|-----------|--------|------|------|\n\n## CRITERIA改善提案\n| 軸 | 現スコア | 目標 | 改善案 |\n\n## Template-ID案\n`{DOMAIN}-{PHASE}-{USECASE}-v{X}.{Y}.{Z}`\n\n## A/Bテスト計画\n- 検証メトリクス: ...\n- 有意差基準: CRITERIA改善率 ≥10%':'## Lifecycle Status\nCurrent stage: {Draft/Review/Test/Deploy/Monitor}\nFailing checks: [ ] ...\n\n## LLMOps Metrics\n| Metric | Current | Threshold | Status |\n|--------|---------|-----------|--------|\n\n## CRITERIA Improvement Proposals\n| Axis | Current | Target | Improvement |\n\n## Template-ID Proposal\n`{DOMAIN}-{PHASE}-{USECASE}-v{X}.{Y}.{Z}`\n\n## A/B Test Plan\n- Validation metric: ...\n- Significance threshold: CRITERIA improvement ≥10%'},
    maturity:{icon:'📊',label:_ja?'AI成熟度レビュー':'AI Maturity Review',desc:_ja?'docs/66でチームAI成熟度を評価し次のレベルへ':'Assess team AI maturity and level up from docs/66',
      sys:_ja?'あなたは組織のAI採用・成熟度向上のコンサルタントです。docs/66_ai_maturity_assessment.mdの5次元評価マトリクスを基に、現在のAI成熟度を診断し、次のレベルへの移行計画を策定します。':'You are a consultant for organizational AI adoption and maturity improvement. Diagnose current AI maturity and develop a transition plan to the next level based on the 5-dimension evaluation matrix from docs/66_ai_maturity_assessment.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/66_ai_maturity_assessment.mdの現在の成熟度レベル（Level 1/2/3）と特徴を確認\n2. 5次元評価マトリクス（プロンプト設計力・AI協調力・品質保証・チームプラクティス・効果測定）で現在のチーム状況を自己評価（各次元1-3点）\n3. 各次元のギャップ分析（現状 vs 目標レベル）を実施\n4. 段階的採用ロードマップ（フェーズ1→2→3）の現在地を特定\n5. 次レベルへの最優先アクション3つを提案（工数・効果・リスクを評価）\n6. docs/68_prompt_kpi_dashboard.mdのKPI指標と照合し、測定可能な成功基準を設定':'Follow these steps:\n1. Review current maturity level (Level 1/2/3) and characteristics from docs/66_ai_maturity_assessment.md\n2. Self-assess current team status on 5-dimension evaluation matrix (prompt design, AI collaboration, QA, team practices, measurement): 1-3 points each\n3. Conduct gap analysis for each dimension (current vs target level)\n4. Identify current position in phased adoption roadmap (Phase 1→2→3)\n5. Propose top 3 priority actions for next level (evaluate effort, effect, and risk)\n6. Set measurable success criteria by cross-referencing KPI metrics in docs/68_prompt_kpi_dashboard.md',
      fmt:_ja?'## 現状診断\n| 次元 | 現状 | 目標 | ギャップ | 優先度 |\n|------|------|------|---------|--------|\n| プロンプト設計力 | Level ? | Level ? | ... | P? |\n\n**総合成熟度**: Level ? → Level ?\n\n## 次レベルへの3大アクション\n1. **アクション1**: ... (工数: M, 効果: 高)\n2. **アクション2**: ...\n3. **アクション3**: ...\n\n## 成功KPI\n| KPI | 現状値 | 目標値 | 計測方法 |':'## Current Assessment\n| Dimension | Current | Target | Gap | Priority |\n|-----------|---------|--------|-----|----------|\n| Prompt Design | Level ? | Level ? | ... | P? |\n\n**Overall Maturity**: Level ? → Level ?\n\n## Top 3 Actions for Next Level\n1. **Action 1**: ... (Effort: M, Effect: High)\n2. **Action 2**: ...\n3. **Action 3**: ...\n\n## Success KPIs\n| KPI | Current | Target | Measurement |'},
    enterprise_arch:{icon:'🏢',label:_ja?'エンタープライズアーキ':'Enterprise Arch Review',desc:_ja?'docs/73でマルチテナント・RLS・組織モデルを検証':'Verify multi-tenant, RLS, org model from docs/73',
      sys:_ja?'あなたはエンタープライズSaaSアーキテクトです。マルチテナント設計、RLSポリシー、組織データモデルのレビューを専門とします。docs/73_enterprise_architecture.mdを参照し、セキュリティ・スケーラビリティ・権限設計を総合評価します。':'You are an enterprise SaaS architect specializing in multi-tenant design, RLS policies, and org data models. Review the architecture comprehensively using docs/73_enterprise_architecture.md.',
      prompt:_ja?'以下の手順でエンタープライズアーキテクチャをレビューしてください:\n\n1. **テナント分離評価** (docs/73 §テナント分離戦略): 採用パターン（RLS/Schema/DB）の適切性を判断。テナント数・規制要件・コストの観点からトレードオフを評価。\n\n2. **組織データモデル検証**: Organization/OrgMember/OrgInviteのER関係が正しいか確認。FK整合性・インデックス・RLSポリシーの漏れを指摘。\n\n3. **権限マトリクス監査** (docs/73 §権限マトリクス): Owner/Admin/Member/Viewerの4階層が適切に分離されているか。最小権限原則の適用を確認。\n\n4. **RLSポリシーレビュー** (docs/43_security_intelligence.md §RLS): 全テーブルでorg_idフィルタが適用されているか。クロステナントアクセスの可能性を洗い出し。\n\n5. **スケーリング判断**: 現在のテナント数予測から最適なアーキテクチャパターンを推奨。':'Review the enterprise architecture following these steps:\n\n1. **Tenant isolation assessment** (docs/73 §Tenant Isolation): Judge appropriateness of selected pattern (RLS/Schema/DB). Evaluate trade-offs from tenant count, regulatory, and cost perspectives.\n\n2. **Org data model validation**: Verify ER relationships for Organization/OrgMember/OrgInvite. Identify FK integrity issues, missing indexes, and RLS policy gaps.\n\n3. **Permission matrix audit** (docs/73 §Permission Matrix): Verify 4-tier Owner/Admin/Member/Viewer separation. Confirm least-privilege principle application.\n\n4. **RLS policy review** (docs/43 §RLS): Check org_id filter applied to all tables. Surface any cross-tenant access risks.\n\n5. **Scaling recommendation**: Recommend optimal architecture pattern based on projected tenant count.',
      fmt:_ja?'## テナント分離評価\n| 評価項目 | 現状 | 推奨 | 優先度 |\n|---------|------|------|--------|\n| 分離パターン | RLS/Schema/DB | ... | P? |\n\n## 組織ERモデル問題点\n| テーブル | 問題 | 修正案 |\n\n## 権限マトリクス違反\n| リソース | 現状 | 正しい設定 |\n\n## RLSポリシー漏れ\n| テーブル | 問題 | 修正SQL |':'## Tenant Isolation Assessment\n| Item | Current | Recommended | Priority |\n|------|---------|-------------|----------|\n| Pattern | RLS/Schema/DB | ... | P? |\n\n## Org ER Model Issues\n| Table | Issue | Fix |\n\n## Permission Matrix Violations\n| Resource | Current | Correct |\n\n## RLS Policy Gaps\n| Table | Issue | Fix SQL |'},
    workflow_audit:{icon:'📋',label:_ja?'ワークフロー監査':'Workflow Process Audit',desc:_ja?'docs/74で承認・チケット・注文フローのステートマシンを検証':'Audit approval/ticket/order state machines from docs/74',
      sys:_ja?'あなたはビジネスプロセス設計とワークフローエンジンの専門家です。docs/74_workflow_engine.mdのステートマシン定義・承認チェーン・SLAトラッキングをレビューし、実装の完全性と正確性を評価します。':'You are a business process design and workflow engine expert. Review state machine definitions, approval chains, and SLA tracking in docs/74_workflow_engine.md to evaluate implementation completeness and accuracy.',
      prompt:_ja?'以下の手順でワークフロープロセスを監査してください:\n\n1. **ステートマシン完全性チェック** (docs/74): 全ワークフロー（承認/チケット/注文等）の状態遷移が網羅されているか確認。デッドロック・孤立状態・欠損遷移を特定。\n\n2. **承認チェーン適切性評価**: 選択された承認パターン（単一/順次/並列/委任/閾値）がビジネス要件に合っているか判断。\n\n3. **SLAトラッキング実装確認**: 各ワークフローのSLA期限設定・エスカレーション通知・自動リマインダーが実装されているか確認。\n\n4. **通知トリガー完全性**: 状態変化ごとの通知先・チャネル・タイミングが定義されているか確認。未定義のトリガーを指摘。\n\n5. **ドメイン固有最適化**: detectDomain()の結果に基づき、ドメイン特有のワークフロー要件が反映されているか評価。':'Audit workflow processes following these steps:\n\n1. **State machine completeness** (docs/74): Verify all workflow state transitions are covered (approval/ticket/order etc). Identify deadlocks, orphan states, and missing transitions.\n\n2. **Approval chain appropriateness**: Determine if selected pattern (single/sequential/parallel/delegation/threshold) matches business requirements.\n\n3. **SLA tracking implementation**: Verify SLA deadline settings, escalation notifications, and auto-reminders are implemented for each workflow.\n\n4. **Notification trigger completeness**: Confirm notification recipients, channels, and timing are defined for each state change. Flag undefined triggers.\n\n5. **Domain-specific optimization**: Evaluate if domain-specific workflow requirements are reflected based on detectDomain() result.',
      fmt:_ja?'## ステートマシン問題\n| ワークフロー | 問題種別 | 詳細 | 修正提案 |\n|------------|---------|------|--------|\n\n## SLAギャップ\n| ワークフロー | 設定SLA | 推奨SLA | 差異 |\n\n## 未定義通知トリガー\n| 状態変化 | 本来の通知先 | 実装状況 |\n\n## 優先修正アクション\n1. P0: ...\n2. P1: ...\n3. P2: ...':'## State Machine Issues\n| Workflow | Issue Type | Detail | Fix |\n|---------|-----------|--------|-----|\n\n## SLA Gaps\n| Workflow | Set SLA | Recommended | Gap |\n\n## Missing Notification Triggers\n| State Change | Expected Recipients | Status |\n\n## Priority Fix Actions\n1. P0: ...\n2. P1: ...\n3. P2: ...'},
  }:{
    review:{icon:'🔍',label:'Spec Review',desc:'Find contradictions, gaps & improvements',
      sys:'You are an experienced tech lead and SDD architect.',
      prompt:'Review the following specs in 4 steps:\n1. Verify mission and KPIs in constitution.md\n2. Check requirement coverage in specification.md\n3. Evaluate architecture validity in technical-plan.md\n4. Identify overall consistency and gaps\n\nAssign priority to each finding (P0=critical/P1=important/P2=recommended).',
      fmt:'Markdown table:\n| # | File | Finding | Priority | Recommended Action |\n|---|------|---------|----------|--------------------|\n| 1 | .spec/xxx.md | ... | P0 | ... |'},
    implement:{icon:'🚀',label:'MVP Build',desc:'Start implementation from specs',
      sys:'You are a full-stack developer. You implement faithfully according to SDD specs.',
      prompt:'Select the highest priority task (P0 or Issue #1) from docs/23_tasks.md and implement it.\n\nImplementation steps:\n1. Create type definitions (TypeScript interface/type)\n2. Implement data access layer (ORM/SDK)\n3. Implement business logic\n4. Implement UI components\n5. Create Vitest unit tests\n\nFollow design principles in constitution.md and architecture in technical-plan.md.\n\nReference docs/39_implementation_playbook.md for domain-specific implementation patterns and industry best practices.\nApply docs/40_ai_dev_runbook.md WSCI (Write→Self-Critique→Improve) workflow for quality validation.\nCheck docs/31_industry_playbook.md domain-specific checklists.',
      fmt:'Code blocks with file paths:\n```typescript:path/to/file.ts\n// code\n```\nMust include tests.'},
    test:{icon:'🧪',label:'Test Generation',desc:'Auto-generate test cases',
      sys:'You are a QA engineer. You create comprehensive test cases from specifications.',
      prompt:'Reference docs/07_test_cases.md and generate test cases in this order:\n1. Happy Path: Basic CRUD operations\n2. Error Cases: Validation errors, permission errors\n3. Boundary: Empty strings, max length, NULL\n4. Use docs/33_test_matrix.md priority matrix to determine execution order\n5. Add non-functional tests following docs/36_test_strategy.md strategy\n\nSpecify expected results for each test case.',
      fmt:'Vitest test file:\n```typescript:tests/xxx.test.ts\nimport { describe, it, expect } from \'vitest\';\n// tests\n```'},
    refactor:{icon:'♻️',label:'Refactor Proposal',desc:'Architecture improvements & tech debt',
      sys:'You are a code reviewer focused on architecture improvements.',
      prompt:'Analyze the technical design in these specs and propose refactoring. Assign effort estimates (S=1-2h/M=3-8h/L=1-2d) to each finding.\n\nCheck items:\n- SOLID principle violations\n- Separation of concerns issues (Fat Controllers, etc.)\n- Scalability problems\n- Performance bottlenecks\n- Technical debt',
      fmt:'Markdown table:\n| Issue | Violated Principle | Improvement | Effort | Priority |\n|-------|-------------------|-------------|--------|----------|\n| ... | SRP | ... | M | P1 |'},
    security:{icon:'🔒',label:'Security Audit',desc:'Vulnerabilities & best practices',
      sys:'You are a security engineer. You audit against OWASP Top 10 2025.',
      prompt:'Reference these security documents first:\n'+
        '- docs/43_security_intelligence.md (Stack-adaptive checklist)\n'+
        '- docs/44_threat_model.md (STRIDE threat analysis)\n'+
        '- docs/45_compliance_matrix.md (Compliance requirements)\n'+
        '- docs/46_ai_security.md (AI/LLM security)\n'+
        '- docs/47_security_testing.md (Test templates)\n\n'+
        'Check security aspects against OWASP Top 10 2025:\n'+
        '1. A01 – Broken Access Control\n2. A02 – Security Misconfiguration\n'+
        '3. A03 – Software Supply Chain\n4. A04 – SSRF (Input Validation & URL Restrictions)\n'+
        '5. A05 – Insecure Design\n6. A06 – Vulnerable and Outdated Components\n'+
        '7. A07 – Identification and Authentication Failures\n8. A08 – Software and Data Integrity Failures\n'+
        '9. A09 – Security Logging and Monitoring Failures\n10. A10 – Infrastructure Protection (DNS Rebinding & Egress)\n\n'+
        'Also check for drift between docs/08_security.md design and implementation.\n'+
        'Verify alignment between docs/53_ops_runbook.md A09 item (security logging/monitoring) and current setup.\n'+
        'Evaluate each item as ✅(OK)/⚠️(Warning)/❌(Vulnerable).',
      fmt:'Markdown table:\n| OWASP# | Item | Status | Details | Recommended Fix |\n|--------|------|--------|---------|------------------|\n| A01 | Access Control | ⚠️ | ... | ... |'},
    docs:{icon:'📝',label:'Doc Completion',desc:'Identify missing docs & generate them',
      sys:'You are a technical writer focused on development documentation quality.',
      prompt:'Analyze these specs and output in 2 parts:\n\n**Part 1: Gap Analysis**\nList gaps between existing docs and ideal state in table format\n\n**Part 2: Generate Critical Document**\nGenerate ONE highest-priority document from gap analysis in full.\n\nCandidates:\n- API spec details (OpenAPI YAML)\n- Sequence diagrams (Mermaid)\n- Deployment guide (step-by-step)\n- Error handling design',
      fmt:'Part 1: Markdown table\nPart 2: Complete document (Markdown)'},
    debug:{icon:'🔧',label:'Debug Assistant',desc:'Root cause analysis & fix suggestions',
      sys:'You are an experienced debugging specialist. You identify root causes from error logs and stack traces.',
      prompt:'Debug analysis:\n1. Cross-reference docs/25_error_logs.md patterns (recurrence vs new issue)\n2. Identify root cause of the error/stack trace (5 Whys analysis)\n3. Match against bug categories in docs/37_bug_prevention.md checklist\n4. Propose fix code and prevention measures\n5. Draft an entry for docs/25_error_logs.md',
      fmt:'## Diagnosis\n| Item | Detail |\n|------|--------|\n| Error Type | ... |\n| Root Cause | ... |\n| Impact Scope | ... |\n\n## Fix Code\n```typescript:path/to/file.ts\n// fix\n```\n\n## error_logs.md Entry\n- Symptom/Cause/Fix/Prevention'},
    arch:{icon:'📐',label:'Architecture Compliance',desc:'Detect spec-implementation drift',
      sys:'You are a software architect. You verify alignment between specs and implementation.',
      prompt:'Architecture compliance check:\n1. Review layer structure and patterns in docs/03_architecture.md\n2. Verify alignment with .spec/technical-plan.md technical decisions\n3. Inspect code for layer boundary violations\n4. Check consistency with docs/27_sequence_diagrams.md sequence flows\n5. Check consistency with docs/26_design_system.md component conventions\n6. Propose fixes and refactoring steps for each violation',
      fmt:'Markdown table:\n| # | Location | Source | Violation | Severity | Fix |\n|---|----------|--------|-----------|----------|-----|\n\n## Architecture Compliance Score: X/10'},
    perf:{icon:'⚡',label:'Performance Optimization',desc:'Identify bottlenecks & suggest fixes',
      sys:'You are a performance engineer. You identify bottlenecks against NFR targets and propose improvements.',
      prompt:'Performance analysis:\n1. Extract performance targets from NFR section in .spec/constitution.md\n2. Review docs/41_growth_intelligence.md performance budgets and Core Web Vitals targets (LCP<2.5s, FID<100ms, CLS<0.1)\n3. Detect N+1 queries, unnecessary re-renders, bundle size issues\n4. Provide before/after estimates for each issue\n5. Create a prioritized improvement roadmap\n6. Cross-reference docs/19_performance.md performance design patterns\n7. Verify alignment with docs/17_monitoring.md metrics (latency/throughput)',
      fmt:'## Bottleneck List\n| # | Location | Type | Current Est. | Target | Fix | Impact |\n|---|----------|------|-------------|--------|-----|--------|\n\n## Optimized Code\n```typescript:path/to/file.ts\n// optimized\n```'},
    api:{icon:'🔌',label:'API Integration Generator',desc:'Generate type-safe API integration code',
      sys:'You are an integration engineer. You generate type-safe API integration code.',
      prompt:'Generate API integration code:\n1. Review endpoints and auth in docs/05_api_design.md\n2. Define request/response types from docs/04_er_diagram.md entity schemas\n3. Generate integration code with error handling (retry, timeout, rate limiting)\n4. Ensure compliance with docs/08_security.md security requirements\n5. Create integration test skeletons',
      fmt:'```typescript:lib/api/client.ts\n// API client with types\n```\n```typescript:lib/api/types.ts\n// Request/Response types\n```\n```typescript:tests/api/integration.test.ts\n// Integration tests\n```'},
    a11y:{icon:'♿',label:'Accessibility Audit',desc:'WCAG 2.1 compliance check & fixes',
      sys:'You are an accessibility expert. You audit UI components against WCAG 2.1 AA.',
      prompt:'Accessibility audit:\n1. Review design tokens (color contrast, font sizes) in docs/26_design_system.md\n2. Identify key UI elements from docs/06_screen_design.md screen list\n3. Evaluate against WCAG 2.1 AA 4 principles (Perceivable, Operable, Understandable, Robust)\n4. Provide specific HTML/ARIA fix code for each violation\n5. Reference docs/57_user_experience_strategy.md accessibility strategy and digital wellbeing sections for inclusive UX additional assessment\n6. Generate axe-core automated tests',
      fmt:'## WCAG 2.1 AA Audit Results\n| # | Criterion | Screen | Element | Status | Fix Code |\n|---|-----------|--------|---------|--------|----------|\n\n## Automated Tests\n```typescript:tests/a11y.test.ts\n// axe-core tests\n```'},
    migrate:{icon:'🔄',label:'Migration Assistant',desc:'Tech stack migration planning',
      sys:'You are a migration architect. You plan phased migrations while guaranteeing data integrity.',
      prompt:'Create migration plan:\n1. Review current stack from .spec/technical-plan.md\n2. Understand data schemas and relationships from docs/04_er_diagram.md\n3. Generate schema conversion scripts and data validation queries\n4. Create risk-minimized deployment plan (blue-green or canary)\n5. Document rollback steps for each phase',
      fmt:'## Migration Plan\n| Phase | Tasks | Duration | Rollback | Risk |\n|-------|-------|----------|----------|------|\n\n## Schema Conversion\n```sql\n-- migration script\n```\n\n## Data Validation\n```sql\n-- validation queries\n```'},
    metrics:{icon:'📊',label:'Code Metrics Analysis',desc:'Quantitative quality evaluation',
      sys:'You are a software metrics analyst. You quantitatively evaluate code quality.',
      prompt:'Code metrics analysis:\n1. Measure Cyclomatic Complexity per function\n2. Evaluate Cognitive Complexity and identify hard-to-understand sections\n3. Analyze coupling and cohesion (detect high-dependency modules)\n4. Identify code duplication and DRY violations\n5. Present improvement plan ordered by ROI (impact/effort)',
      fmt:'## Metrics Summary\n| Metric | Value | Threshold | Status |\n|--------|-------|-----------|--------|\n| Avg Cyclomatic Complexity | X | <10 | ✅/⚠️/❌ |\n\n## Hotspots (Priority Order)\n| File | Function | Complexity | Improvement | Effort |\n|------|----------|------------|-------------|--------|'},
    i18n:{icon:'🌍',label:'i18n Generator',desc:'Add internationalization to existing code',
      sys:'You are an internationalization engineer. You add i18n support with minimal changes.',
      prompt:'Implement internationalization:\n1. Extract all hardcoded strings from the code\n2. Define translation key naming convention (scope.component.element)\n3. Generate translation files (JSON) for Japanese and English\n4. Replace strings with translation function (t()) calls\n5. Add locale-aware formatters for dates, numbers, currencies',
      fmt:'## Extracted Strings\n| Key | Japanese | English |\n|-----|----------|----------|\n\n```json:locales/ja.json\n{}\n```\n```json:locales/en.json\n{}\n```\n\n## Converted Code\n```typescript:path/to/file.ts\n// i18n-ready code\n```'},
    growth:{icon:'📈',label:'Growth Strategy',desc:'Optimize growth funnels, KPIs & pricing',
      sys:'You are a growth engineer. You design data-driven growth strategies.',
      prompt:'Growth analysis:\n1. Review growth funnel and CVR benchmarks in docs/41_growth_intelligence.md\n2. Evaluate stack synergy score for current configuration\n3. Identify bottlenecks using domain-specific growth equation\n4. Propose 5 growth levers in priority order\n5. Design 3-tier pricing strategy (behavioral economics: compromise effect, anchoring)\n6. Cross-reference docs/48_industry_blueprint.md industry growth patterns (TAM/SAM/SOM strategy)\n7. Validate alignment with docs/50_stakeholder_strategy.md target strategy\n8. Integrate docs/56_market_positioning.md market positioning and competitive analysis into growth funnel to identify differentiation advantages',
      fmt:'## Funnel Analysis\n| Stage | Current CVR | Target CVR | Improvement |\n\n## Growth Levers\n| # | Lever | Expected Impact | Effort | Priority |\n\n## Pricing Strategy\n| Plan | Price | Features | Target |'},
    reverse:{icon:'🎯',label:'Goal Reverse Design',desc:'Reverse-plan from goals with gap analysis',
      sys:'You are a project strategist. You reverse-engineer plans from goals.',
      prompt:'Goal reverse analysis:\n1. Review goal definition and reverse flow in docs/29_reverse_engineering.md\n2. Analyze goal tree and sub-goals in docs/30_goal_decomposition.md\n3. Quantitatively evaluate gap between current state and targets\n4. Reorganize milestones using priority matrix\n5. Verify dependency chain and identify critical path',
      fmt:'## Gap Analysis\n| Goal | Current | Gap | Action | Deadline |\n\n## Critical Path\n```mermaid\ngantt\n```\n\n## Milestones\n| MS | Criteria | Dependencies | Risk |'},
    incident:{icon:'🚨',label:'Incident Response',desc:'Create runbooks & post-mortems',
      sys:'You are an SRE engineer specializing in incident response and prevention.',
      prompt:'Incident response:\n1. Review incident response flow in docs/34_incident_response.md\n2. Identify related past error patterns from docs/25_error_logs.md\n3. Assess impact scope (users, features, data)\n4. Create emergency procedures (rollback, failover)\n5. Draft post-mortem (timeline, root cause, improvement actions)\n6. Cross-reference docs/53_ops_runbook.md SLO/SLI baseline to determine SLO violations\n7. Review docs/55_ops_plane_design.md circuit breaker settings to assess auto-cutoff validity',
      fmt:'## Impact Assessment\n| Item | Detail |\n| Scope | ... |\n| Severity | SEV1/2/3 |\n\n## Response Steps\n1. Detect → 2. Triage → 3. Respond → 4. Recover → 5. Review\n\n## Post-Mortem\n| Timeline | Action | Owner |'},
    onboard:{icon:'🎓',label:'Onboarding',desc:'Handoff docs for new members & AI agents',
      sys:'You are a technical onboarding specialist. You create materials for fastest developer ramp-up.',
      prompt:'Create onboarding materials:\n1. Summarize project from CLAUDE.md and AI_BRIEF.md\n2. Diagram design principles from .spec/constitution.md and architecture from docs/03_architecture.md\n3. Organize skill-level workflows from docs/42_skill_guide.md\n4. Extract first-week task list from .spec/tasks.md\n5. Create FAQ from common pitfalls in docs/37_bug_prevention.md\n6. Explain .claude/rules/ 5-file structure (spec.md, frontend.md, backend.md, test.md, ops.md)\n7. Clarify Dev×Ops responsibility matrix from docs/55_ops_plane_design.md',
      fmt:'## Project Overview (5-min read)\n\n## Architecture Diagram\n```mermaid\n```\n\n## First Week\n| Day | Task | Reference File |\n\n## FAQ\n| Question | Answer |'},
    cicd:{icon:'⚙️',label:'CI/CD Intelligence Review',desc:'Review CI/CD pipeline, deploy strategy & quality gates',
      sys:'You are a DevOps engineer. You review CI/CD pipelines and quality gates.',
      prompt:'CI/CD Intelligence Review:\n1. Review docs/77_cicd_pipeline_design.md 9-stage pipeline and identify project-specific improvements\n2. Evaluate docs/78_deployment_strategy.md recommended deploy strategy (blue-green/canary etc.) validity\n3. Review docs/79_quality_gate_matrix.md quality gate thresholds (coverage, performance budget)\n4. Verify docs/80_release_engineering.md branch model, semantic versioning, and Renovate config\n5. Check alignment with docs/53_ops_runbook.md SLO quality gates (error rate/latency thresholds)\n6. Integrate docs/54_ops_checklist.md ops readiness checklist into release gates\n7. Identify missing quality gates or optimization opportunities with prioritized recommendations',
      fmt:'## Pipeline Design\n```mermaid\nflowchart LR\n```\n\n## Quality Gate Review\n| Stage | Check | Threshold | Current | Improvement |\n\n## GitHub Actions\n```yaml\n# .github/workflows/ci-cd.yml\n```'},
    ops:{icon:'🛡️',label:'Ops Readiness Review',desc:'Validate SLO, Feature Flags, Circuit Breaker settings',
      sys:'You are an SRE/Platform Engineer. You validate operational readiness.',
      prompt:'Ops Readiness Review:\n1. Verify docs/53_ops_runbook.md SLO/SLI definitions match domain requirements\n2. Check Feature Flag coverage (kill switches for payments, notifications, external APIs, etc.)\n3. Assess docs/55_ops_plane_design.md circuit breaker thresholds (error rate/timeout) validity\n4. Validate docs/54_ops_checklist.md 12 Ops Capabilities implementation (Observability, Jobs, Backup, etc.)\n5. Verify RPO/RTO meets industry standards (e.g., Fintech: RPO<5min/RTO<15min)\n6. Check docs/17_monitoring.md monitoring alignment with Observability requirements\n7. Calculate Ops Readiness Score (12 items) and identify gaps',
      fmt:'## Ops Readiness Score\n| Capability | Status | Validity | Improvement Action |\n|------------|--------|----------|--------------------|\n| SLO Definition | ✅/⚠️/❌ | 99.9% (req: 99.99%) | ... |\n\n## SLO Validity Assessment\n| SLI | Current Setting | Domain Recommended | Verdict |\n\n## Improvement Roadmap\n| Priority | Item | Deadline | Owner |'},
    strategy:{icon:'🏢',label:'Strategic Intelligence',desc:'Industry blueprint, tech radar, stakeholder strategy',
      sys:'You are a Product Strategist/Business Analyst. You validate business strategy alignment.',
      prompt:'Strategic Intelligence Analysis:\n1. Verify docs/48_industry_blueprint.md industry blueprint alignment (TAM/SAM/SOM, regulatory compliance)\n2. Check docs/49_tech_radar.md tech radar ratings (Adopt/Trial/Assess/Hold) vs current tech choices\n3. Detect gaps in docs/50_stakeholder_strategy.md stakeholder strategy (targets, KPIs, growth metrics)\n4. Analyze docs/51_operational_excellence.md operational maturity gap (current Lv1→target Lv3)\n5. Extract short-term actions (within 3 months) from docs/52_advanced_scenarios.md\n6. Evaluate business model alignment with docs/41_growth_intelligence.md growth equation\n7. Integrate docs/56_market_positioning.md MOAT analysis, GTM strategy, and unit economics into strategic scorecard\n8. Integrate docs/58_ecosystem_strategy.md ecosystem strategy, API-as-Product, and DX assessment into strategy\n9. Create strategic scorecard (5-axis assessment) and prioritize improvement areas',
      fmt:'## Strategic Scorecard\n| Axis | Score(1-5) | Assessment | Gap |\n|------|------------|------------|-----|\n| Industry Fit | X/5 | ... | ... |\n| Tech Choice | X/5 | ... | ... |\n\n## Tech Radar Assessment\n| Technology | Current Adoption | Radar Recommendation | Gap Reason |\n\n## Short-Term Action Plan (3 months)\n| # | Action | KPI | Owner | Deadline |'},
    risk:{icon:'⚖️',label:'Risk & Compliance',desc:'4-axis risk re-assessment, STRIDE residual risks, compliance',
      sys:'You are a Risk Analyst/Compliance Officer. You perform integrated risk and compliance assessment.',
      prompt:'Risk & Compliance Analysis:\n1. Re-assess docs/14_risks.md 4-axis risks (technical, organizational, legal, operational) and validate mitigation effectiveness\n2. Check docs/45_compliance_matrix.md compliance coverage (GDPR, PCI-DSS, etc.)\n3. Extract TOP5 residual risks from docs/44_threat_model.md STRIDE threat analysis\n4. Evaluate docs/53_ops_runbook.md SLO operational risks (SLO breach penalties, escalation)\n5. Create risk heatmap (probability × impact) and identify P0 risks\n6. Verify compliance automation (Terraform Sentinel/OPA) implementation status\n7. Integrate docs/59_regulatory_foresight.md regulatory foresight (EU AI Act, ESG metrics, 2026-2030 horizon) into risk re-assessment\n8. Present TOP5 risk mitigation measures in priority order (technical controls, process improvements, insurance, etc.)',
      fmt:'## Risk Heatmap\n| Risk | Probability | Impact | Score | Mitigation | Status |\n|------|-------------|--------|-------|------------|--------|\n| ... | H/M/L | H/M/L | X | ... | ✅/⚠️/❌ |\n\n## Compliance Coverage\n| Regulation | Required Items | Met Items | Coverage % | Unmet Items |\n\n## TOP5 Residual Risks\n| # | Risk | STRIDE Category | Current Mitigation | Recommended Additional Controls | Effort |'},
    qa:{icon:'🐛',label:_ja?'QA・バグ検出':'QA & Bug Detection',desc:_ja?'ドメイン別バグパターンとQA戦略を基にテスト計画を生成':'Generate test plan based on domain-specific bug patterns and QA strategy',
      sys:_ja?'あなたはQAエンジニアです。docs/28_qa_strategy.mdのドメイン別バグパターンを参照し、具体的なテストシナリオを設計してください。':'You are a QA engineer. Reference docs/28_qa_strategy.md domain-specific bug patterns to design concrete test scenarios.',
      prompt:_ja?'以下の手順で実行:\n1. docs/28_qa_strategy.mdの重点領域を確認\n2. 各重点領域に対し具体的テストケースを3つ以上作成\n3. docs/32_qa_blueprint.mdの品質ゲートチェックリストと照合\n4. docs/33_test_matrix.mdのマトリクスに基づきカバレッジを検証\n5. よくあるバグパターンに対する回帰テストを設計\n6. 業界横断チェックリストの該当項目を検証\n7. 優先度マトリクスに基づきテスト実行順序を決定':'Follow these steps:\n1. Review focus areas from docs/28_qa_strategy.md\n2. Create 3+ concrete test cases per focus area\n3. Cross-reference with docs/32_qa_blueprint.md quality gate checklist\n4. Verify coverage against docs/33_test_matrix.md matrix\n5. Design regression tests for common bug patterns\n6. Verify applicable cross-cutting checklist items\n7. Determine test execution order based on priority matrix',
      fmt:_ja?'Markdown表形式: テストID|カテゴリ|シナリオ|期待結果|優先度(CRITICAL/HIGH/MED/LOW)':'Markdown table: TestID|Category|Scenario|Expected Result|Priority(CRITICAL/HIGH/MED/LOW)'},
    methodology:{icon:'🧬',label:_ja?'ドメイン最適手法':'Optimal Methodology',desc:_ja?'docs/60参照し最適設計アプローチを深堀り':'Deep-dive optimal design approach from docs/60',
      sys:_ja?'あなたは経験豊富な設計アーキテクトです。docs/60_methodology_intelligence.mdの選定手法を基に、具体的な実装戦略を提案してください。':'You are an experienced design architect. Propose concrete implementation strategy based on selected methodology from docs/60_methodology_intelligence.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/60_methodology_intelligence.mdの第一選択・第二選択手法を確認\n2. 各手法のキーワードに基づく具体的な実装パターンを3つ以上提案\n3. 12設計アプローチの適合度評価を参照し、優先度マトリクスを作成\n4. 組み合わせシナジーを技術的に実現する方法を提案\n5. フェーズ別実装計画（Phase 1: 基盤→Phase 2: 拡張→Phase 3: 最適化）の詳細化':'Follow these steps:\n1. Review primary/secondary approaches from docs/60_methodology_intelligence.md\n2. Propose 3+ concrete implementation patterns based on each approach keywords\n3. Create priority matrix referencing 12 design approaches fit evaluation\n4. Propose technical methods to realize combination synergies\n5. Detail phased implementation plan (Phase 1: Foundation→Phase 2: Expansion→Phase 3: Optimization)',
      fmt:_ja?'Markdown表形式: フェーズ|手法|実装パターン|期待効果|工数(S/M/L)':'Markdown table: Phase|Approach|Implementation Pattern|Expected Effect|Effort(S/M/L)'},
    brainstorm:{icon:'🎭',label:_ja?'9人の専門家ブレスト':'9-Expert Brainstorm',desc:_ja?'創造工学の9視点で固定観念を突破':'Break fixed ideas with 9 creative perspectives',
      sys:_ja?'あなたは9人の専門家が同居する創造的思考システムです。各専門家の個性を維持しながら、プロジェクトに関する多角的なアイデアを生成します。\n\n専門家チーム:\n①🎨クリエイティブ(美・物語・体験重視)\n②⚙️技術専門家(実現可能性・最適化重視)\n③📊ビジネス(収益・市場・競争優位重視)\n④📚学術研究者(エビデンス・理論・先行研究重視)\n⑤🔬科学者(仮説検証・データ・測定重視)\n⑥👤ユーザー代表(使いやすさ・感情・日常動線重視)\n⑦💥ディスラプター(既成概念破壊・逆張り重視)\n⑧😄ユーモリスト(楽しさ・驚き・記憶に残る体験重視)\n⑨🧭冒険家(大胆さ・リスクテイク・未踏領域重視)':'You are a creative thinking system where 9 experts coexist. Generate multi-perspective ideas while maintaining each expert\'s personality.\n\nExpert Team:\n①🎨Creative (aesthetics, storytelling, experience)\n②⚙️Technical (feasibility, optimization)\n③📊Business (revenue, market, competitive advantage)\n④📚Academic (evidence, theory, prior research)\n⑤🔬Scientist (hypothesis testing, data, measurement)\n⑥👤User Rep (usability, emotions, daily workflows)\n⑦💥Disruptor (challenging norms, contrarian thinking)\n⑧😄Humorist (fun, surprise, memorable experiences)\n⑨🧭Adventurer (boldness, risk-taking, unexplored territory)',
      prompt:_ja?'以下のプロジェクトについて、9人の専門家が順番にアイデアを1つずつ提案してください。\n\n【フォーマット】各専門家ごとに:\n- アイデア名（10文字以内）\n- 提案内容（3文）\n\n全員の提案後、3軸評価マトリクスを作成:\n| アイデア | 魅力度(1-5) | 実現可能性(1-5) | 妥当性(1-5) | 総合 |\n\n最後に「クロスポリネーション」として、異なる専門家のアイデアを組み合わせた「最強のハイブリッド案」を1つ提案。':'For the following project, each of the 9 experts proposes one idea in sequence.\n\n【Format】For each expert:\n- Idea name (10 words max)\n- Proposal (3 sentences)\n\nAfter all proposals, create a 3-axis evaluation matrix:\n| Idea | Appeal(1-5) | Feasibility(1-5) | Validity(1-5) | Total |\n\nFinally propose one "Cross-Pollination" hybrid idea combining concepts from different experts.',
      fmt:_ja?'## 9専門家アイデア\n| 専門家 | アイデア名 | 提案内容 |\n\n## 3軸評価マトリクス\n| アイデア | 魅力度 | 実現可能性 | 妥当性 | 総合 |\n\n## クロスポリネーション案\n**組み合わせ**: 専門家X×専門家Y\n**ハイブリッドアイデア**: ...':'## 9-Expert Ideas\n| Expert | Idea Name | Proposal |\n\n## 3-Axis Evaluation Matrix\n| Idea | Appeal | Feasibility | Validity | Total |\n\n## Cross-Pollination Proposal\n**Combination**: Expert X × Expert Y\n**Hybrid Idea**: ...'},
    ux_journey:{icon:'🎯',label:_ja?'UXジャーニー設計':'UX Journey Design',desc:_ja?'Lv.0-5段階的開示でアプリのUXを設計':'Design app UX with Lv.0-5 progressive disclosure',
      sys:_ja?'あなたはUXデザイン専門家です。段階的開示・認知負荷管理・ペインポイントストーリーテリングの3つの視点でユーザージャーニーを設計します。':'You are a UX design expert. Design user journeys from 3 perspectives: progressive disclosure, cognitive load management, and pain point storytelling.',
      prompt:_ja?'以下のプロジェクトのターゲットアプリについて、Lv.0（完全初心者）からLv.5（エキスパート）までの6段階ユーザージャーニーを設計してください:\n\n各Lvで:\n①ペルソナ（年齢・職業・ITリテラシー）\n②つまずきポイント（具体的な操作ミス・混乱箇所）\n③必要なUXパターン（オンボーディング/ツールチップ/段階的開示等）\n④離脱リスク（何があると諦めるか）\n⑤改善アクション（具体的UI変更案）\n\n次に「3つの悪夢」を特定:\n- 悪夢①: ユーザーが最も恐れる失敗体験\n- 悪夢②: 二番目に怖い体験\n- 悪夢③: 三番目に怖い体験\n\n各悪夢に対し、それを防ぐUI設計を提案してください。':'Design a 6-level user journey (Lv.0=complete beginner to Lv.5=expert) for this project:\n\nFor each Lv:\n①Persona (age, occupation, IT literacy)\n②Stumbling points (specific mistakes, confusion areas)\n③Required UX patterns (onboarding/tooltip/progressive disclosure etc.)\n④Churn risk (what makes users give up)\n⑤Improvement action (specific UI change)\n\nThen identify "3 Nightmares":\n- Nightmare①: The failure experience users fear most\n- Nightmare②: Second most feared\n- Nightmare③: Third most feared\n\nPropose UI designs that prevent each nightmare.',
      fmt:_ja?'## Lv別ジャーニーマップ\n| Lv | ペルソナ | つまずき | UXパターン | 離脱リスク | 改善アクション |\n\n## 3つの悪夢分析\n| 悪夢 | 体験 | 防ぐUI設計 |\n\n## Mermaid Journey図\n```mermaid\njourney\n  title ユーザージャーニー\n```':'## Lv-by-Lv Journey Map\n| Lv | Persona | Stumbling | UX Pattern | Churn Risk | Improvement |\n\n## 3 Nightmares Analysis\n| Nightmare | Experience | Preventive UI Design |\n\n## Mermaid Journey Diagram\n```mermaid\njourney\n  title User Journey\n```'},
    ai_model_guide:{icon:'🤖',label:_ja?'AIモデル使い分け':'AI Model Selection',desc:_ja?'開発フェーズ別に最適AIモデルを選定':'Select optimal AI model per dev phase',
      sys:_ja?'あなたはAIモデル活用の専門家です。各AIモデルの「個性」（Gemini=正確性・広い知識、Claude=倫理・洗練、ChatGPT=創造性・自由度、Copilot=バランス・コード補完）を深く理解し、タスク適性を分析します。':'You are an AI model utilization expert. You deeply understand each AI model\'s "personality" (Gemini=accuracy & broad knowledge, Claude=ethics & refinement, ChatGPT=creativity & freedom, Copilot=balance & code completion) and analyze task suitability.',
      prompt:_ja?'以下のプロジェクトの各開発フェーズで最適なAIモデルを提案してください:\n\nフェーズ: ①設計・アーキテクチャ ②実装・コーディング ③テスト・QA ④コードレビュー ⑤デプロイ・Ops\n\n各フェーズで:\n1. 推奨モデル（第一/第二候補）\n2. 選定理由（そのモデルの個性がなぜこのフェーズに合うか）\n3. ナチュラルプロンプト例（「ハンマー型」—使う道具の特性を活かした指示）\n4. 避けるべきアンチパターン（そのモデルが苦手なこと）\n\n最後に「AIモデル切替タイミング」ガイドを作成。':'Propose the optimal AI model for each development phase of this project:\n\nPhases: ①Design/Architecture ②Implementation/Coding ③Testing/QA ④Code Review ⑤Deploy/Ops\n\nFor each phase:\n1. Recommended model (primary/secondary)\n2. Selection reason (why this model\'s personality fits this phase)\n3. Natural prompt example ("hammer type" — instructions that leverage the tool\'s strengths)\n4. Anti-patterns to avoid (what this model struggles with)\n\nFinally create an "AI Model Switching Timing" guide.',
      fmt:_ja?'## フェーズ別AIモデル推奨\n| フェーズ | 推奨AI | 理由 | ナチュラルプロンプト例 | アンチパターン |\n\n## AIモデル個性マップ\n| モデル | 強み | 弱み | 最適ユースケース |\n\n## 切替タイミングガイド\n- 設計→実装: ...\n- 実装→レビュー: ...':'## AI Model Recommendations by Phase\n| Phase | Recommended AI | Reason | Natural Prompt Example | Anti-patterns |\n\n## AI Model Personality Map\n| Model | Strengths | Weaknesses | Best Use Case |\n\n## Switching Timing Guide\n- Design→Impl: ...\n- Impl→Review: ...'},
    industry:{icon:'🏭',label:_ja?'業界特化分析':'Industry Deep Dive',desc:_ja?'docs/62で規制・落とし穴を検証':'Verify regulations & pitfalls from docs/62',
      sys:_ja?'あなたは業界コンプライアンス専門家です。docs/62_industry_deep_dive.mdの業界特有の落とし穴とアーキテクチャパターンを基に、リスク分析を実施してください。':'You are an industry compliance expert. Conduct risk analysis based on industry-specific pitfalls and architecture patterns from docs/62_industry_deep_dive.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/62_industry_deep_dive.mdの主要規制リストを確認し、現在の技術スタックでの準拠状況を評価\n2. 業界特有の落とし穴一覧から、このプロジェクトで該当する項目をピックアップ\n3. 各落とし穴に対する対策の実装状況を検証（✅実装済/⚠️部分的/❌未実装）\n4. docs/45_compliance_matrix.mdのコンプライアンスマトリクスと照合し、ギャップを特定\n5. 推奨アーキテクチャパターン（認証レイヤー、暗号化ストレージ、監査ログ）の実装計画を策定':'Follow these steps:\n1. Review key regulations from docs/62_industry_deep_dive.md and assess compliance status with current tech stack\n2. Pick applicable items from industry-specific pitfalls list\n3. Verify implementation status of countermeasures for each pitfall (✅Implemented/⚠️Partial/❌Not implemented)\n4. Cross-reference with docs/45_compliance_matrix.md compliance matrix to identify gaps\n5. Develop implementation plan for recommended architecture patterns (auth layer, encrypted storage, audit log)',
      fmt:_ja?'## 規制準拠状況\n| 規制 | 要求事項 | 実装状況 | ギャップ | 対策優先度 |\n\n## 落とし穴チェック\n| # | 落とし穴 | 該当性 | 対策状況 | 実装計画 |\n\n## アーキテクチャ改善提案\n```mermaid\ngraph LR\n```':'## Regulatory Compliance\n| Regulation | Requirements | Status | Gap | Priority |\n\n## Pitfall Check\n| # | Pitfall | Applicability | Status | Plan |\n\n## Architecture Improvement\n```mermaid\ngraph LR\n```'},
    nextgen:{icon:'🔮',label:_ja?'次世代UX探索':'Next-Gen UX',desc:_ja?'docs/63でAgentic/Spatial/Calm設計':'Agentic/Spatial/Calm design from docs/63',
      sys:_ja?'あなたは次世代UX設計のスペシャリストです。docs/63_next_gen_ux_strategy.mdのPolymorphic Engineコンセプトを基に、革新的なUX提案を行ってください。':'You are a next-gen UX design specialist. Propose innovative UX based on Polymorphic Engine concept from docs/63_next_gen_ux_strategy.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/63_next_gen_ux_strategy.mdのThe Context Loop（Sensing→Thinking→Morphing→Acting）フレームワークを確認\n2. 4つの次世代UXキーワード（Agentic Workflow、Generative UI、Spatial Computing、Calm Technology）のプロジェクト適用プロンプトを選択\n3. 選択したキーワードを主要機能（例: ダッシュボード、検索、予約）に適用した具体的なUI設計案を3つ以上提案\n4. ドメイン特化適用例を参照し、業種固有のベストプラクティスを反映\n5. 各提案の実装難易度（S/M/L）、期待UX改善効果、技術的実現可能性を評価':'Follow these steps:\n1. Review The Context Loop (Sensing→Thinking→Morphing→Acting) framework from docs/63_next_gen_ux_strategy.md\n2. Select project application prompts for 4 next-gen UX keywords (Agentic Workflow, Generative UI, Spatial Computing, Calm Technology)\n3. Propose 3+ concrete UI design proposals applying selected keywords to main features (e.g., dashboard, search, booking)\n4. Reference domain-specific application examples and reflect industry-specific best practices\n5. Evaluate implementation difficulty (S/M/L), expected UX improvement effect, and technical feasibility for each proposal',
      fmt:_ja?'## UX提案\n| # | キーワード | 適用機能 | 具体的設計 | 難易度 | 効果 | 実現可能性 |\n\n## Polymorphic Engineフロー\n```mermaid\ngraph LR\n  Sensing --> Thinking --> Morphing --> Acting\n```\n\n## 実装ロードマップ\n| Phase | 機能 | キーワード | 期待効果 | 工数 |':'## UX Proposals\n| # | Keyword | Feature | Design | Difficulty | Effect | Feasibility |\n\n## Polymorphic Engine Flow\n```mermaid\ngraph LR\n  Sensing --> Thinking --> Morphing --> Acting\n```\n\n## Implementation Roadmap\n| Phase | Feature | Keyword | Effect | Effort |'},
    cognitive:{icon:'🧠',label:_ja?'認知負荷分析':'Cognitive Load Analysis',desc:_ja?'docs/60で認知負荷とフロー状態を設計':'Cognitive load & flow state design from docs/60',
      sys:_ja?'あなたは認知科学とUXの専門家です。docs/60_methodology_intelligence.mdの認知負荷最小化・フロー状態設計の観点から、UI/UX改善を提案してください。':'You are a cognitive science and UX expert. Propose UI/UX improvements from cognitive load minimization and flow state design perspectives in docs/60_methodology_intelligence.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/60_methodology_intelligence.mdの12設計アプローチ適合度評価から、「認知負荷最小化」「フロー状態設計」の適合度を確認\n2. 主要画面（ダッシュボード、一覧、詳細、フォーム）ごとに認知負荷を分析（情報量、選択肢数、階層深度）\n3. フロー状態を阻害する要素（中断、待機時間、複雑な操作）を特定\n4. 認知負荷削減策（プログレッシブ開示、デフォルト値、スマート検索）を提案\n5. フロー状態維持策（キーボードショートカット、オートセーブ、コンテキスト保持）を提案\n6. docs/26_design_system.mdのデザインシステムとの整合性を検証':'Follow these steps:\n1. Check fit for "Cognitive Load Min." and "Flow State Design" from 12 design approaches evaluation in docs/60_methodology_intelligence.md\n2. Analyze cognitive load for each main screen (dashboard, list, detail, form): info volume, choice count, hierarchy depth\n3. Identify flow state inhibitors (interruptions, wait time, complex operations)\n4. Propose cognitive load reduction measures (progressive disclosure, default values, smart search)\n5. Propose flow state maintenance measures (keyboard shortcuts, auto-save, context preservation)\n6. Verify consistency with design system in docs/26_design_system.md',
      fmt:_ja?'## 認知負荷分析\n| 画面 | 情報量 | 選択肢数 | 階層深度 | 認知負荷スコア(1-10) | 改善案 |\n\n## フロー状態阻害要因\n| # | 要因 | 影響度 | 削減策 | 期待効果 |\n\n## 改善ロードマップ\n| 優先度 | 施策 | 対象画面 | 工数 | 効果 |':'## Cognitive Load Analysis\n| Screen | Info Volume | Choices | Depth | Load Score(1-10) | Improvement |\n\n## Flow State Inhibitors\n| # | Inhibitor | Impact | Reduction | Effect |\n\n## Improvement Roadmap\n| Priority | Measure | Target Screen | Effort | Effect |'},
    genome:{icon:'🧩',label:_ja?'プロンプトゲノム分析':'Prompt Genome Analysis',desc:_ja?'docs/65でCRITERIA 8軸プロンプト品質を最適化':'Optimize prompt quality with CRITERIA 8-axis from docs/65',
      sys:_ja?'あなたはプロンプトエンジニアリングの専門家です。docs/65_prompt_genome.mdのCRITERIA 8軸フレームワーク（Context/Role/Instructions/Thought Process/Execution Rules/Reflection/Iteration/Adaptation）を基に、プロンプト品質の分析と改善提案を行います。':'You are a prompt engineering expert. Analyze prompt quality and provide improvement proposals based on the CRITERIA 8-axis framework (Context/Role/Instructions/Thought Process/Execution Rules/Reflection/Iteration/Adaptation) from docs/65_prompt_genome.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/65_prompt_genome.mdのプロンプトDNAプロファイル（ドメイン・アプローチ・成熟度レベル）を確認\n2. 現在使用しているプロンプトをCRITERIA 8軸で評価（各軸1-5点、加重スコアを算出）\n3. スコアが低い軸（3点以下）の改善案を具体的に提案\n4. フェーズ別プロンプトライブラリから最適なテンプレートを選択\n5. 成熟度レベル（Level 1/2/3）に適した適応バリアントを提案\n6. docs/67_prompt_composition_guide.mdの4層アーキテクチャ（Meta/Structure/Content/Adaptation）を適用した複合プロンプトを設計':'Follow these steps:\n1. Review Prompt DNA profile (domain, approach, maturity level) from docs/65_prompt_genome.md\n2. Evaluate current prompts on CRITERIA 8 axes (1-5 points each, calculate weighted score)\n3. Propose specific improvements for low-scoring axes (3 points or below)\n4. Select optimal templates from phase-by-phase prompt library\n5. Propose maturity-level-appropriate variants (Level 1/2/3)\n6. Design composite prompts applying 4-layer architecture (Meta/Structure/Content/Adaptation) from docs/67_prompt_composition_guide.md',
      fmt:_ja?'## CRITERIA評価\n| 軸 | 重み | 現スコア | 目標 | 改善案 |\n|-----|------|---------|------|--------|\n| Context | 15% | ? | 5 | ... |\n\n**加重総スコア**: ? / 5\n\n## 改善後プロンプト\n```\n[CRITERIA準拠の改善プロンプト]\n```\n\n## 4層設計\n| Layer | 内容 |\n|-------|------|\n| Meta | ... |\n| Structure | ... |\n| Content | ... |\n| Adaptation | ... |':'## CRITERIA Evaluation\n| Axis | Weight | Current | Target | Improvement |\n|------|--------|---------|--------|-------------|\n| Context | 15% | ? | 5 | ... |\n\n**Weighted Total Score**: ? / 5\n\n## Improved Prompt\n```\n[CRITERIA-compliant improved prompt]\n```\n\n## 4-Layer Design\n| Layer | Content |\n|-------|--------|\n| Meta | ... |\n| Structure | ... |\n| Content | ... |\n| Adaptation | ... |'},
    react_debug:{icon:'🔄',label:_ja?'ReActデバッグ':'ReAct Debug Loop',desc:_ja?'Reason→Act→Observe→Verifyの自律デバッグサイクル':'Autonomous debug cycle with Reason→Act→Observe→Verify',
      sys:_ja?'あなたはReActプロトコルの専門家です。docs/70_react_workflow.mdのReAct 4ステージ（Reason→Act→Observe→Verify）と自己デバッグループを用いて、問題を自律的に診断・修正します。':'You are a ReAct protocol expert. Diagnose and fix problems autonomously using the 4-stage ReAct cycle (Reason→Act→Observe→Verify) and self-debug loop from docs/70_react_workflow.md.',
      prompt:_ja?'以下のReActサイクルで問題を解決してください:\n\n**Reason (思考)**: 現在のエラー・バグ・問題を分析。根本原因の仮説を3つ列挙。\n\n**Act (実行)**: 最も可能性が高い仮説を検証するアクションを実行。docs/70_react_workflow.mdのフェーズ別ツール選定を参照。\n\n**Observe (観察)**: アクション結果を客観的に記録。期待と実際の差異を特定。\n\n**Verify (検証)**: 問題が解決されたか成功基準（型安全・テスト通過・lint通過）で確認。\n\n失敗の場合は自己デバッグループ（最大3反復）を実施。3回失敗したら人間へエスカレーション。':'Resolve the problem using the following ReAct cycle:\n\n**Reason**: Analyze current error/bug/problem. List 3 root cause hypotheses.\n\n**Act**: Execute action to test most likely hypothesis. Reference phase-specific tool selection from docs/70_react_workflow.md.\n\n**Observe**: Objectively record action results. Identify gaps between expected and actual.\n\n**Verify**: Confirm problem resolved against success criteria (type safety, tests pass, lint pass).\n\nIf failed, run self-debug loop (max 3 iterations). Escalate to human after 3 failures.',
      fmt:_ja?'## Reason\n**根本原因仮説:**\n1. ...\n2. ...\n3. ...\n\n## Act\n**実行:** `{tool} {args}`\n\n## Observe\n**結果:** ...\n**期待との差異:** ...\n\n## Verify\n**成功基準達成:** [ ] 型安全 [ ] テスト通過 [ ] lint通過\n**次のアクション:** ...\n\n---\n_iter 1/3 — 解決 / 未解決 → 次反復_':'## Reason\n**Root Cause Hypotheses:**\n1. ...\n2. ...\n3. ...\n\n## Act\n**Execute:** `{tool} {args}`\n\n## Observe\n**Result:** ...\n**Gap from expected:** ...\n\n## Verify\n**Success criteria met:** [ ] Type safe [ ] Tests pass [ ] Lint pass\n**Next action:** ...\n\n---\n_iter 1/3 — Resolved / Unresolved → next iteration_'},
    prompt_ops:{icon:'🔧',label:_ja?'プロンプトOpsレビュー':'Prompt Ops Review',desc:_ja?'プロンプト品質をCRITERIA基準で評価・改善提案':'Evaluate prompt quality against CRITERIA and suggest improvements',
      sys:_ja?'あなたはLLMOpsとプロンプトCI/CDの専門家です。docs/69_prompt_ops_pipeline.md（ライフサイクル管理）、docs/71_llmops_dashboard.md（メトリクス）、docs/72_prompt_registry.md（テンプレートカタログ）を参照し、プロンプトの運用品質を総合評価します。':'You are an LLMOps and Prompt CI/CD expert. Comprehensively evaluate prompt operational quality by referencing docs/69_prompt_ops_pipeline.md (lifecycle management), docs/71_llmops_dashboard.md (metrics), and docs/72_prompt_registry.md (template catalog).',
      prompt:_ja?'以下の手順でプロンプトの運用品質を評価・改善してください:\n\n1. **ライフサイクルチェック** (docs/69): 対象プロンプトが5ステージ（起草→レビュー→テスト→デプロイ→監視）のどこにあるかを特定。現ステージのチェックリストを評価。\n\n2. **LLMOpsメトリクス評価** (docs/71): 現在のAI成熟度レベルに対応するスタックのメトリクス（成功率・コスト・レイテンシ）を確認し、閾値との差異を計算。\n\n3. **CRITERIA連携スコアリング** (docs/65 + docs/71): CRITERIA 8軸の現スコアをLLMOpsメトリクスにマッピング。スコアが低い軸（3以下）の改善案を提示。\n\n4. **Registryへの登録提案** (docs/72): Template-ID命名規則に従い、バージョン番号・CRITERIA目標スコアをドラフト。\n\n5. **A/Bテスト計画**: 改善後バージョンとの比較計画を作成（メトリクス定義・有意差基準）。':'Evaluate and improve prompt operational quality following these steps:\n\n1. **Lifecycle check** (docs/69): Identify which of 5 stages (Draft→Review→Test→Deploy→Monitor) the target prompt is in. Evaluate current stage checklist.\n\n2. **LLMOps metrics evaluation** (docs/71): Review stack metrics for current AI maturity level (success rate, cost, latency) and calculate gap from thresholds.\n\n3. **CRITERIA-integrated scoring** (docs/65 + docs/71): Map CRITERIA 8-axis current scores to LLMOps metrics. Present improvements for low-scoring axes (3 or below).\n\n4. **Registry registration proposal** (docs/72): Draft Template-ID following naming convention with version number and CRITERIA target scores.\n\n5. **A/B test plan**: Create comparison plan for improved version (metric definitions, significance thresholds).',
      fmt:_ja?'## ライフサイクル状況\n現ステージ: {Draft/Review/Test/Deploy/Monitor}\n未達チェック: [ ] ...\n\n## LLMOpsメトリクス\n| メトリクス | 現在値 | 閾値 | 評価 |\n|-----------|--------|------|------|\n\n## CRITERIA改善提案\n| 軸 | 現スコア | 目標 | 改善案 |\n\n## Template-ID案\n`{DOMAIN}-{PHASE}-{USECASE}-v{X}.{Y}.{Z}`\n\n## A/Bテスト計画\n- 検証メトリクス: ...\n- 有意差基準: CRITERIA改善率 ≥10%':'## Lifecycle Status\nCurrent stage: {Draft/Review/Test/Deploy/Monitor}\nFailing checks: [ ] ...\n\n## LLMOps Metrics\n| Metric | Current | Threshold | Status |\n|--------|---------|-----------|--------|\n\n## CRITERIA Improvement Proposals\n| Axis | Current | Target | Improvement |\n\n## Template-ID Proposal\n`{DOMAIN}-{PHASE}-{USECASE}-v{X}.{Y}.{Z}`\n\n## A/B Test Plan\n- Validation metric: ...\n- Significance threshold: CRITERIA improvement ≥10%'},
    maturity:{icon:'📊',label:_ja?'AI成熟度レビュー':'AI Maturity Review',desc:_ja?'docs/66でチームAI成熟度を評価し次のレベルへ':'Assess team AI maturity and level up from docs/66',
      sys:_ja?'あなたは組織のAI採用・成熟度向上のコンサルタントです。docs/66_ai_maturity_assessment.mdの5次元評価マトリクスを基に、現在のAI成熟度を診断し、次のレベルへの移行計画を策定します。':'You are a consultant for organizational AI adoption and maturity improvement. Diagnose current AI maturity and develop a transition plan to the next level based on the 5-dimension evaluation matrix from docs/66_ai_maturity_assessment.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/66_ai_maturity_assessment.mdの現在の成熟度レベル（Level 1/2/3）と特徴を確認\n2. 5次元評価マトリクス（プロンプト設計力・AI協調力・品質保証・チームプラクティス・効果測定）で現在のチーム状況を自己評価（各次元1-3点）\n3. 各次元のギャップ分析（現状 vs 目標レベル）を実施\n4. 段階的採用ロードマップ（フェーズ1→2→3）の現在地を特定\n5. 次レベルへの最優先アクション3つを提案（工数・効果・リスクを評価）\n6. docs/68_prompt_kpi_dashboard.mdのKPI指標と照合し、測定可能な成功基準を設定':'Follow these steps:\n1. Review current maturity level (Level 1/2/3) and characteristics from docs/66_ai_maturity_assessment.md\n2. Self-assess current team status on 5-dimension evaluation matrix (prompt design, AI collaboration, QA, team practices, measurement): 1-3 points each\n3. Conduct gap analysis for each dimension (current vs target level)\n4. Identify current position in phased adoption roadmap (Phase 1→2→3)\n5. Propose top 3 priority actions for next level (evaluate effort, effect, and risk)\n6. Set measurable success criteria by cross-referencing KPI metrics in docs/68_prompt_kpi_dashboard.md',
      fmt:_ja?'## 現状診断\n| 次元 | 現状 | 目標 | ギャップ | 優先度 |\n|------|------|------|---------|--------|\n| プロンプト設計力 | Level ? | Level ? | ... | P? |\n\n**総合成熟度**: Level ? → Level ?\n\n## 次レベルへの3大アクション\n1. **アクション1**: ... (工数: M, 効果: 高)\n2. **アクション2**: ...\n3. **アクション3**: ...\n\n## 成功KPI\n| KPI | 現状値 | 目標値 | 計測方法 |':'## Current Assessment\n| Dimension | Current | Target | Gap | Priority |\n|-----------|---------|--------|-----|----------|\n| Prompt Design | Level ? | Level ? | ... | P? |\n\n**Overall Maturity**: Level ? → Level ?\n\n## Top 3 Actions for Next Level\n1. **Action 1**: ... (Effort: M, Effect: High)\n2. **Action 2**: ...\n3. **Action 3**: ...\n\n## Success KPIs\n| KPI | Current | Target | Measurement |'},
  };

  /* ── Header ── */
  let h=`<div class="exp-header"><h3>🤖 ${_ja?'AI プロンプトランチャー':'AI Prompt Launcher'} <button class="btn btn-xs" onclick="showManual('launcher-guide')">📖 ${_ja?'使い方':'Manual'}</button></h3>
  <p>${_ja
    ?'生成した仕様書をAIツールに一括投入。テンプレートを選んでコピー'
    :'Feed generated specs to AI tools. Pick a template and copy'}</p></div>`;

  /* ── Token overview ── */
  if(hasFiles){
    h+=`<div class="launch-stats">
      <div class="launch-stat"><span class="launch-num">${fKeys.length}</span><span class="launch-lbl">${_ja?'ファイル':'Files'}</span></div>
      <div class="launch-stat"><span class="launch-num">${totalTokens.toLocaleString()}</span><span class="launch-lbl">${_ja?'推定トークン':'Est. Tokens'}</span></div>
      <div class="launch-stat"><span class="launch-num">${Object.keys(folders).length}</span><span class="launch-lbl">${_ja?'フォルダ':'Folders'}</span></div>
    </div>`;

    /* ── Folder breakdown ── */
    h+=`<div class="launch-folders"><h4>${_ja?'📂 フォルダ別トークン':'📂 Tokens by Folder'}</h4>`;
    const sortedDirs=Object.entries(folders).sort((a,b)=>b[1].tokens-a[1].tokens);
    sortedDirs.forEach(([dir,info])=>{
      const pct=Math.round(info.tokens/totalTokens*100);
      h+=`<div class="launch-folder-row">
        <label><input type="checkbox" checked data-dir="${dir}" onchange="updateLaunchPreview()"> <strong>${dir}/</strong></label>
        <span>${info.files.length} ${_ja?'ファイル':'files'} · ${info.tokens.toLocaleString()} tok (${pct}%)</span>
        <div class="launch-bar"><div class="launch-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
    });
    h+=`</div>`;

    /* ── Model fit indicator ── */
    const models=[
      {name:'Claude Opus 4.6',ctx:1000000,icon:'🟣'},
      {name:'Claude Sonnet 4.5',ctx:200000,icon:'🔵'},
      {name:'GPT-5.2',ctx:400000,icon:'🟢'},
      {name:'Gemini 2.5 Pro',ctx:1000000,icon:'🟡'},
      {name:'Claude Haiku 4.5',ctx:200000,icon:'🟣'},
      {name:'Gemini 3 Flash',ctx:200000,icon:'🟡'},
    ];
    h+=`<div class="launch-models"><h4>${_ja?'🤖 モデル適合':'🤖 Model Fit'}</h4>`;
    models.forEach(m=>{
      const pct=Math.min(100,Math.round(totalTokens/m.ctx*100));
      const ok=pct<80;
      h+=`<div class="launch-model-row">${m.icon} ${m.name} <span class="launch-model-pct ${ok?'launch-ok':'launch-warn'}">${pct}% ${ok?(_ja?'余裕':'OK'):(pct<100?(_ja?'注意':'tight'):(_ja?'超過':'over'))}</span></div>`;
    });
    h+=`</div>`;
  } else {
    h+=`<div class="empty-preview-sm">${_ja?'⚠️ まず質問に回答してファイルを生成してください':'⚠️ Answer questions first to generate files'}</div>`;
  }

  /* ── Prompt templates (ordered by dev lifecycle) ── */
  const AI_REC={review:'Gemini',arch:'Gemini',reverse:'Claude',implement:'Copilot',api:'Copilot',i18n:'Copilot',test:'Copilot',qa:'Copilot',security:'Gemini',a11y:'Gemini',perf:'Gemini',metrics:'Gemini',refactor:'Claude',debug:'Copilot',incident:'Copilot',ops:'Gemini',docs:'Claude',migrate:'Claude',cicd:'Copilot',growth:'ChatGPT',strategy:'Claude',methodology:'Claude',brainstorm:'ChatGPT',ux_journey:'Claude',ai_model_guide:'Gemini',industry:'Gemini',nextgen:'ChatGPT',cognitive:'Claude',genome:'Claude',maturity:'Claude',react_debug:'Copilot',prompt_ops:'Claude',enterprise_arch:'Gemini',workflow_audit:'Claude',risk:'Claude',onboard:'Claude'};
  const templateOrder=['review','arch','reverse','implement','api','i18n','test','qa','security','a11y','perf','metrics','refactor','debug','incident','ops','docs','migrate','cicd','growth','strategy','methodology','brainstorm','ux_journey','ai_model_guide','industry','nextgen','cognitive','genome','maturity','react_debug','prompt_ops','enterprise_arch','workflow_audit','risk','onboard'];
  h+=`<div class="launch-templates"><h4>${_ja?'📋 プロンプトテンプレート':'📋 Prompt Templates'}</h4>`;
  templateOrder.forEach(key=>{
    const t=PT[key];
    if(!t)return;
    h+=`<div class="launch-tpl" onclick="selectLaunchTemplate('${key}')">
      <div class="launch-tpl-icon">${t.icon}</div>
      <div class="launch-tpl-info"><strong>${t.label}</strong><span>${t.desc}</span></div>
      ${AI_REC[key]?'<span class="launch-airec" title="'+(_ja?'推奨AI':'Recommended AI')+'">'+AI_REC[key]+'</span>':''}
    </div>`;
  });
  h+=`</div>`;

  /* ── Output area ── */
  h+=`<div class="launch-output" id="launchOutput">
    <div class="launch-output-head">
      <h4 id="launchOutputTitle"></h4>
      <div class="prev-toolbar-r">
        <button class="btn btn-xs btn-p" onclick="copyLaunchPrompt()">📋 ${_ja?'コピー':'Copy'}</button>
        <button class="btn btn-xs btn-g" onclick="$('launchOutput').style.display='none'">✕</button>
      </div>
    </div>
    <div class="launch-output-meta" id="launchOutputMeta"></div>
    <pre class="launch-output-pre" id="launchOutputPre"></pre>
  </div>`;

  body.innerHTML=h;

  /* ── State: store prompt templates for later use ── */
  window._launchPT=PT;
  window._launchFolders=folders;
  window._launchFiles=files;
}

/* ── Select prompt template ── */
function selectLaunchTemplate(key){
  const _ja=S.lang==='ja';
  const PT=window._launchPT;
  const t=PT[key];if(!t)return;
  const selectedFiles=getSelectedLaunchFiles();
  const content=selectedFiles.map(([k,v])=>`--- ${k} ---\n${v}`).join('\n\n');
  const selTokens=Math.round(content.length/4);

  const a=S.answers;const pn=S.projectName||'Project';
  const ctx='Project: '+pn+'\nStack: '+(a.frontend||'N/A')+' + '+(a.backend||'N/A')+' + '+(a.database||'N/A')+'\nAuth: '+(a.auth||'N/A')+'\nEntities: '+(a.data_entities||'N/A');
  const full='# System\n'+t.sys+'\n\n# Context\n'+ctx+'\n\n# Task\n'+t.prompt+'\n\n# Output Format\n'+t.fmt+'\n\n---\n\n'+content;

  const out=$('launchOutput');out.style.display='block';
  $('launchOutputTitle').textContent=`${t.icon} ${t.label}`;
  $('launchOutputMeta').textContent=`${selectedFiles.length} ${_ja?'ファイル':'files'} · ~${selTokens.toLocaleString()} tokens`;
  $('launchOutputPre').textContent=full.slice(0,2000)+(full.length>2000?`\n\n... (${_ja?'残り':'remaining'} ${(full.length-2000).toLocaleString()} chars)`:'');
  window._launchFullPrompt=full;
  out.scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* ── Get selected files from checkboxes ── */
function getSelectedLaunchFiles(){
  const checks=document.querySelectorAll('.launch-folder-row input[type=checkbox]');
  const selectedDirs=new Set();
  checks.forEach(c=>{if(c.checked)selectedDirs.add(c.dataset.dir);});
  const files=window._launchFiles||S.files;
  return Object.entries(files).filter(([k])=>{
    const dir=k.includes('/')?k.split('/')[0]:'root';
    return selectedDirs.has(dir);
  });
}

/* ── Update preview when checkbox changes ── */
function updateLaunchPreview(){
  const sel=getSelectedLaunchFiles();
  const tokens=sel.reduce((s,e)=>s+Math.round(e[1].length/4),0);
  // Update stats if output is showing
  const meta=$('launchOutputMeta');
  if(meta&&$('launchOutput').style.display!=='none'){
    const _ja=S.lang==='ja';
    meta.textContent=`${sel.length} ${_ja?'ファイル':'files'} · ~${tokens.toLocaleString()} tokens`;
  }
}

/* ── Copy to clipboard ── */
function copyLaunchPrompt(){
  const _ja=S.lang==='ja';
  const text=window._launchFullPrompt;
  if(!text)return;
  navigator.clipboard.writeText(text).then(()=>{
    toast(_ja?'📋 プロンプトをコピーしました':'📋 Prompt copied to clipboard');
  }).catch(()=>{
    // Fallback
    const ta=document.createElement('textarea');ta.value=text;
    document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
    toast(_ja?'📋 コピー完了':'📋 Copied');
  });
}
