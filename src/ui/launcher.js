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
      prompt:'アクセシビリティ監査:\n1. docs/26_design_system.mdのデザイントークン（色コントラスト・フォントサイズ）を確認\n2. docs/06_screen_design.mdの画面一覧から主要画面のUI要素を特定\n3. WCAG 2.1 AA 4原則（知覚可能・操作可能・理解可能・堅牢）で評価\n4. 各違反に具体的なHTML/ARIA修正コードを提示\n5. axe-coreによる自動テストコードを生成',
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
      prompt:'グロース分析:\n1. docs/41_growth_intelligence.mdの成長ファネルとCVRベンチマークを確認\n2. 現在のスタック構成のシナジースコアを評価\n3. ドメイン別グロース方程式に基づきボトルネックを特定\n4. 5つの成長レバーを優先度順に提案\n5. 松竹梅の3段階価格戦略を設計（行動経済学: 妥協効果・アンカリング）\n6. docs/48_industry_blueprint.mdの業界成長パターン（TAM/SAM/SOM戦略）と照合\n7. docs/50_stakeholder_strategy.mdのターゲット戦略との整合性を検証',
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
      prompt:'CI/CD設計:\n1. .github/workflows/ci.ymlの現行パイプラインを分析\n2. docs/09_release_checklist.mdのリリースチェックリストを品質ゲートに変換\n3. docs/36_test_strategy.mdのテスト戦略をパイプラインステージに統合\n4. .spec/verification.mdの検証基準を自動化可能な形式に変換\n5. ブルーグリーン/カナリアデプロイ戦略を提案\n6. docs/53_ops_runbook.mdのSLO品質ゲート（エラー率・レイテンシ閾値）を追加\n7. docs/54_ops_checklist.mdの運用準備チェックリストをリリースゲートに統合',
      fmt:'## パイプライン設計\n```mermaid\nflowchart LR\n```\n\n## 品質ゲート\n| ステージ | チェック項目 | 閾値 | 失敗時 |\n\n## GitHub Actions\n```yaml\n# .github/workflows/ci.yml\n```'},
    ops:{icon:'🛡️',label:'Ops準備レビュー',desc:'SLO検証・Feature Flag・サーキットブレーカー設定監査',
      sys:'あなたはSRE/Platform Engineerです。運用準備の妥当性を検証します。',
      prompt:'Ops準備レビュー:\n1. docs/53_ops_runbook.mdのSLO/SLI定義がドメイン要件に適合しているか検証\n2. Feature Flagの網羅性チェック（課金・通知・外部API等の重要機能に対するキルスイッチ）\n3. docs/55_ops_plane_design.mdのサーキットブレーカー閾値（エラー率・タイムアウト）の妥当性を評価\n4. docs/54_ops_checklist.mdの12 Ops Capabilities（Observability, Jobs, Backup等）の実装状況を検証\n5. RPO/RTOが業界基準（Fintech: RPO<5分/RTO<15分等）に適合しているか照合\n6. docs/17_monitoring.mdの監視体制とObservability整合性をチェック\n7. Ops Readiness スコア（12項目）を算出し、不足項目を抽出',
      fmt:'## Ops Readiness スコア\n| Capability | 状態 | 妥当性 | 改善アクション |\n|------------|------|--------|----------------|\n| SLO定義 | ✅/⚠️/❌ | 99.9%(要件: 99.99%) | ... |\n\n## SLO妥当性評価\n| SLI | 現在設定 | ドメイン推奨 | 判定 |\n\n## 改善ロードマップ\n| 優先度 | 項目 | 期限 | 担当 |'},
    strategy:{icon:'🏢',label:'戦略インテリジェンス',desc:'業界ブループリント・テックレーダー・ステークホルダー戦略',
      sys:'あなたはProduct Strategist/Business Analystです。事業戦略の整合性を検証します。',
      prompt:'戦略インテリジェンス分析:\n1. docs/48_industry_blueprint.mdの業界ブループリントとの適合度を検証（TAM/SAM/SOM戦略、規制遵守）\n2. docs/49_tech_radar.mdのテックレーダー評価（Adopt/Trial/Assess/Hold）と技術選定の整合性をチェック\n3. docs/50_stakeholder_strategy.mdのステークホルダー戦略（ターゲット・KPI・成長指標）との乖離を検出\n4. docs/51_operational_excellence.mdの運用成熟度ギャップ分析（現状Lv1→目標Lv3等）\n5. docs/52_advanced_scenarios.mdのロードマップから短期アクション（3ヶ月以内）を抽出\n6. docs/41_growth_intelligence.mdの成長方程式とビジネスモデルの整合性を評価\n7. 戦略スコアカード（5軸評価）を作成し、優先改善領域を提示',
      fmt:'## 戦略スコアカード\n| 軸 | スコア(1-5) | 評価 | ギャップ |\n|-----|------------|------|----------|\n| 業界適合 | X/5 | ... | ... |\n| 技術選定 | X/5 | ... | ... |\n\n## テックレーダー評価\n| 技術 | 現状採用判断 | Radar推奨 | 乖離理由 |\n\n## 短期アクションプラン（3ヶ月）\n| # | アクション | KPI | 担当 | 期限 |'},
    risk:{icon:'⚖️',label:'リスク・コンプライアンス',desc:'4軸リスク再評価・STRIDE残存リスク・コンプライアンス充足',
      sys:'あなたはRisk Analyst/Compliance Officerです。リスクとコンプライアンスを統合評価します。',
      prompt:'リスク・コンプライアンス分析:\n1. docs/14_risks.mdの4軸リスク（技術・組織・法務・運用）を再評価し、現在の緩和策の有効性を検証\n2. docs/45_compliance_matrix.mdのコンプライアンス充足度（GDPR, PCI-DSS等）をチェック\n3. docs/44_threat_model.mdのSTRIDE脅威分析から残存リスクTOP5を抽出\n4. docs/53_ops_runbook.mdのSLO運用リスク（SLO未達ペナルティ・エスカレーション体制）を評価\n5. リスクヒートマップ（発生確率×影響度）を作成し、P0リスクを特定\n6. コンプライアンス自動監査（Terraform Sentinel/OPA等）の導入状況を確認\n7. リスク緩和策TOP5を優先度順に提示（技術的対策・プロセス改善・保険等）',
      fmt:'## リスクヒートマップ\n| リスク | 確率 | 影響度 | スコア | 緩和策 | 状態 |\n|--------|------|--------|--------|--------|------|\n| ... | H/M/L | H/M/L | X | ... | ✅/⚠️/❌ |\n\n## コンプライアンス充足度\n| 規制 | 要求項目数 | 充足数 | 充足率 | 未対応項目 |\n\n## 残存リスクTOP5\n| # | リスク | STRIDE分類 | 現状緩和策 | 推奨追加対策 | 工数 |'},
    qa:{icon:'🐛',label:_ja?'QA・バグ検出':'QA & Bug Detection',desc:_ja?'ドメイン別バグパターンとQA戦略を基にテスト計画を生成':'Generate test plan based on domain-specific bug patterns and QA strategy',
      sys:_ja?'あなたはQAエンジニアです。docs/28_qa_strategy.mdのドメイン別バグパターンを参照し、具体的なテストシナリオを設計してください。':'You are a QA engineer. Reference docs/28_qa_strategy.md domain-specific bug patterns to design concrete test scenarios.',
      prompt:_ja?'以下の手順で実行:\n1. docs/28_qa_strategy.mdの重点領域を確認\n2. 各重点領域に対し具体的テストケースを3つ以上作成\n3. docs/32_qa_blueprint.mdの品質ゲートチェックリストと照合\n4. docs/33_test_matrix.mdのマトリクスに基づきカバレッジを検証\n5. よくあるバグパターンに対する回帰テストを設計\n6. 業界横断チェックリストの該当項目を検証\n7. 優先度マトリクスに基づきテスト実行順序を決定':'Follow these steps:\n1. Review focus areas from docs/28_qa_strategy.md\n2. Create 3+ concrete test cases per focus area\n3. Cross-reference with docs/32_qa_blueprint.md quality gate checklist\n4. Verify coverage against docs/33_test_matrix.md matrix\n5. Design regression tests for common bug patterns\n6. Verify applicable cross-cutting checklist items\n7. Determine test execution order based on priority matrix',
      fmt:_ja?'Markdown表形式: テストID|カテゴリ|シナリオ|期待結果|優先度(CRITICAL/HIGH/MED/LOW)':'Markdown table: TestID|Category|Scenario|Expected Result|Priority(CRITICAL/HIGH/MED/LOW)'},
    methodology:{icon:'🧬',label:_ja?'ドメイン最適手法':'Optimal Methodology',desc:_ja?'docs/60参照し最適設計アプローチを深堀り':'Deep-dive optimal design approach from docs/60',
      sys:_ja?'あなたは経験豊富な設計アーキテクトです。docs/60_methodology_intelligence.mdの選定手法を基に、具体的な実装戦略を提案してください。':'You are an experienced design architect. Propose concrete implementation strategy based on selected methodology from docs/60_methodology_intelligence.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/60_methodology_intelligence.mdの第一選択・第二選択手法を確認\n2. 各手法のキーワードに基づく具体的な実装パターンを3つ以上提案\n3. 12設計アプローチの適合度評価を参照し、優先度マトリクスを作成\n4. 組み合わせシナジーを技術的に実現する方法を提案\n5. フェーズ別実装計画（Phase 1: 基盤→Phase 2: 拡張→Phase 3: 最適化）の詳細化':'Follow these steps:\n1. Review primary/secondary approaches from docs/60_methodology_intelligence.md\n2. Propose 3+ concrete implementation patterns based on each approach keywords\n3. Create priority matrix referencing 12 design approaches fit evaluation\n4. Propose technical methods to realize combination synergies\n5. Detail phased implementation plan (Phase 1: Foundation→Phase 2: Expansion→Phase 3: Optimization)',
      fmt:_ja?'Markdown表形式: フェーズ|手法|実装パターン|期待効果|工数(S/M/L)':'Markdown table: Phase|Approach|Implementation Pattern|Expected Effect|Effort(S/M/L)'},
    brainstorm:{icon:'💡',label:_ja?'AI壁打ちセッション':'AI Brainstorm',desc:_ja?'docs/61のPolymorphicフレームで探索':'Explore with Polymorphic framework from docs/61',
      sys:_ja?'あなたは創造的な問題解決のエキスパートです。docs/61_ai_brainstorm_playbook.mdのプロジェクト固有プロンプトを活用し、高度な提案を引き出してください。':'You are a creative problem-solving expert. Use project-specific prompts from docs/61_ai_brainstorm_playbook.md to extract advanced proposals.',
      prompt:_ja?'以下の手順で実行:\n1. docs/61_ai_brainstorm_playbook.mdから現在のフェーズ（Phase 0-5）に対応するプロンプトを選択\n2. 選択したプロンプトをプロジェクト文脈（技術スタック、ドメイン、選定手法）と組み合わせて実行\n3. Polymorphic Engineの4段階フレーム（Sensing→Thinking→Morphing→Acting）の観点で回答を分析\n4. 得られたインサイトを該当ドキュメント（例: docs/03_architecture.md）への反映案として整理\n5. 次に実行すべきプロンプトを提案':'Follow these steps:\n1. Select prompts for current phase (Phase 0-5) from docs/61_ai_brainstorm_playbook.md\n2. Execute selected prompts combined with project context (tech stack, domain, methodology)\n3. Analyze answers from Polymorphic Engine 4-stage framework perspective (Sensing→Thinking→Morphing→Acting)\n4. Organize insights as reflection proposals into relevant docs (e.g., docs/03_architecture.md)\n5. Propose next prompts to execute',
      fmt:_ja?'## インサイト\n| フェーズ | プロンプトID | 得られた提案 | 反映先ドキュメント |\n\n## 次のアクション\n- 実行すべきプロンプト: ...':'## Insights\n| Phase | Prompt ID | Proposal | Target Document |\n\n## Next Actions\n- Prompts to execute: ...'},
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
      prompt:'Accessibility audit:\n1. Review design tokens (color contrast, font sizes) in docs/26_design_system.md\n2. Identify key UI elements from docs/06_screen_design.md screen list\n3. Evaluate against WCAG 2.1 AA 4 principles (Perceivable, Operable, Understandable, Robust)\n4. Provide specific HTML/ARIA fix code for each violation\n5. Generate axe-core automated tests',
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
      prompt:'Growth analysis:\n1. Review growth funnel and CVR benchmarks in docs/41_growth_intelligence.md\n2. Evaluate stack synergy score for current configuration\n3. Identify bottlenecks using domain-specific growth equation\n4. Propose 5 growth levers in priority order\n5. Design 3-tier pricing strategy (behavioral economics: compromise effect, anchoring)\n6. Cross-reference docs/48_industry_blueprint.md industry growth patterns (TAM/SAM/SOM strategy)\n7. Validate alignment with docs/50_stakeholder_strategy.md target strategy',
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
    cicd:{icon:'⚙️',label:'CI/CD Design',desc:'Design deploy pipelines & quality gates',
      sys:'You are a DevOps engineer. You design CI/CD pipelines and quality gates.',
      prompt:'CI/CD design:\n1. Analyze current pipeline in .github/workflows/ci.yml\n2. Convert docs/09_release_checklist.md checklist into quality gates\n3. Integrate docs/36_test_strategy.md test strategy into pipeline stages\n4. Convert .spec/verification.md criteria into automatable format\n5. Propose blue-green/canary deployment strategy\n6. Add docs/53_ops_runbook.md SLO quality gates (error rate/latency thresholds)\n7. Integrate docs/54_ops_checklist.md ops readiness checklist as release gates',
      fmt:'## Pipeline Design\n```mermaid\nflowchart LR\n```\n\n## Quality Gates\n| Stage | Check | Threshold | On Failure |\n\n## GitHub Actions\n```yaml\n# .github/workflows/ci.yml\n```'},
    ops:{icon:'🛡️',label:'Ops Readiness Review',desc:'Validate SLO, Feature Flags, Circuit Breaker settings',
      sys:'You are an SRE/Platform Engineer. You validate operational readiness.',
      prompt:'Ops Readiness Review:\n1. Verify docs/53_ops_runbook.md SLO/SLI definitions match domain requirements\n2. Check Feature Flag coverage (kill switches for payments, notifications, external APIs, etc.)\n3. Assess docs/55_ops_plane_design.md circuit breaker thresholds (error rate/timeout) validity\n4. Validate docs/54_ops_checklist.md 12 Ops Capabilities implementation (Observability, Jobs, Backup, etc.)\n5. Verify RPO/RTO meets industry standards (e.g., Fintech: RPO<5min/RTO<15min)\n6. Check docs/17_monitoring.md monitoring alignment with Observability requirements\n7. Calculate Ops Readiness Score (12 items) and identify gaps',
      fmt:'## Ops Readiness Score\n| Capability | Status | Validity | Improvement Action |\n|------------|--------|----------|--------------------|\n| SLO Definition | ✅/⚠️/❌ | 99.9% (req: 99.99%) | ... |\n\n## SLO Validity Assessment\n| SLI | Current Setting | Domain Recommended | Verdict |\n\n## Improvement Roadmap\n| Priority | Item | Deadline | Owner |'},
    strategy:{icon:'🏢',label:'Strategic Intelligence',desc:'Industry blueprint, tech radar, stakeholder strategy',
      sys:'You are a Product Strategist/Business Analyst. You validate business strategy alignment.',
      prompt:'Strategic Intelligence Analysis:\n1. Verify docs/48_industry_blueprint.md industry blueprint alignment (TAM/SAM/SOM, regulatory compliance)\n2. Check docs/49_tech_radar.md tech radar ratings (Adopt/Trial/Assess/Hold) vs current tech choices\n3. Detect gaps in docs/50_stakeholder_strategy.md stakeholder strategy (targets, KPIs, growth metrics)\n4. Analyze docs/51_operational_excellence.md operational maturity gap (current Lv1→target Lv3)\n5. Extract short-term actions (within 3 months) from docs/52_advanced_scenarios.md\n6. Evaluate business model alignment with docs/41_growth_intelligence.md growth equation\n7. Create strategic scorecard (5-axis assessment) and prioritize improvement areas',
      fmt:'## Strategic Scorecard\n| Axis | Score(1-5) | Assessment | Gap |\n|------|------------|------------|-----|\n| Industry Fit | X/5 | ... | ... |\n| Tech Choice | X/5 | ... | ... |\n\n## Tech Radar Assessment\n| Technology | Current Adoption | Radar Recommendation | Gap Reason |\n\n## Short-Term Action Plan (3 months)\n| # | Action | KPI | Owner | Deadline |'},
    risk:{icon:'⚖️',label:'Risk & Compliance',desc:'4-axis risk re-assessment, STRIDE residual risks, compliance',
      sys:'You are a Risk Analyst/Compliance Officer. You perform integrated risk and compliance assessment.',
      prompt:'Risk & Compliance Analysis:\n1. Re-assess docs/14_risks.md 4-axis risks (technical, organizational, legal, operational) and validate mitigation effectiveness\n2. Check docs/45_compliance_matrix.md compliance coverage (GDPR, PCI-DSS, etc.)\n3. Extract TOP5 residual risks from docs/44_threat_model.md STRIDE threat analysis\n4. Evaluate docs/53_ops_runbook.md SLO operational risks (SLO breach penalties, escalation)\n5. Create risk heatmap (probability × impact) and identify P0 risks\n6. Verify compliance automation (Terraform Sentinel/OPA) implementation status\n7. Present TOP5 risk mitigation measures in priority order (technical controls, process improvements, insurance, etc.)',
      fmt:'## Risk Heatmap\n| Risk | Probability | Impact | Score | Mitigation | Status |\n|------|-------------|--------|-------|------------|--------|\n| ... | H/M/L | H/M/L | X | ... | ✅/⚠️/❌ |\n\n## Compliance Coverage\n| Regulation | Required Items | Met Items | Coverage % | Unmet Items |\n\n## TOP5 Residual Risks\n| # | Risk | STRIDE Category | Current Mitigation | Recommended Additional Controls | Effort |'},
    qa:{icon:'🐛',label:_ja?'QA・バグ検出':'QA & Bug Detection',desc:_ja?'ドメイン別バグパターンとQA戦略を基にテスト計画を生成':'Generate test plan based on domain-specific bug patterns and QA strategy',
      sys:_ja?'あなたはQAエンジニアです。docs/28_qa_strategy.mdのドメイン別バグパターンを参照し、具体的なテストシナリオを設計してください。':'You are a QA engineer. Reference docs/28_qa_strategy.md domain-specific bug patterns to design concrete test scenarios.',
      prompt:_ja?'以下の手順で実行:\n1. docs/28_qa_strategy.mdの重点領域を確認\n2. 各重点領域に対し具体的テストケースを3つ以上作成\n3. docs/32_qa_blueprint.mdの品質ゲートチェックリストと照合\n4. docs/33_test_matrix.mdのマトリクスに基づきカバレッジを検証\n5. よくあるバグパターンに対する回帰テストを設計\n6. 業界横断チェックリストの該当項目を検証\n7. 優先度マトリクスに基づきテスト実行順序を決定':'Follow these steps:\n1. Review focus areas from docs/28_qa_strategy.md\n2. Create 3+ concrete test cases per focus area\n3. Cross-reference with docs/32_qa_blueprint.md quality gate checklist\n4. Verify coverage against docs/33_test_matrix.md matrix\n5. Design regression tests for common bug patterns\n6. Verify applicable cross-cutting checklist items\n7. Determine test execution order based on priority matrix',
      fmt:_ja?'Markdown表形式: テストID|カテゴリ|シナリオ|期待結果|優先度(CRITICAL/HIGH/MED/LOW)':'Markdown table: TestID|Category|Scenario|Expected Result|Priority(CRITICAL/HIGH/MED/LOW)'},
    methodology:{icon:'🧬',label:_ja?'ドメイン最適手法':'Optimal Methodology',desc:_ja?'docs/60参照し最適設計アプローチを深堀り':'Deep-dive optimal design approach from docs/60',
      sys:_ja?'あなたは経験豊富な設計アーキテクトです。docs/60_methodology_intelligence.mdの選定手法を基に、具体的な実装戦略を提案してください。':'You are an experienced design architect. Propose concrete implementation strategy based on selected methodology from docs/60_methodology_intelligence.md.',
      prompt:_ja?'以下の手順で実行:\n1. docs/60_methodology_intelligence.mdの第一選択・第二選択手法を確認\n2. 各手法のキーワードに基づく具体的な実装パターンを3つ以上提案\n3. 12設計アプローチの適合度評価を参照し、優先度マトリクスを作成\n4. 組み合わせシナジーを技術的に実現する方法を提案\n5. フェーズ別実装計画（Phase 1: 基盤→Phase 2: 拡張→Phase 3: 最適化）の詳細化':'Follow these steps:\n1. Review primary/secondary approaches from docs/60_methodology_intelligence.md\n2. Propose 3+ concrete implementation patterns based on each approach keywords\n3. Create priority matrix referencing 12 design approaches fit evaluation\n4. Propose technical methods to realize combination synergies\n5. Detail phased implementation plan (Phase 1: Foundation→Phase 2: Expansion→Phase 3: Optimization)',
      fmt:_ja?'Markdown表形式: フェーズ|手法|実装パターン|期待効果|工数(S/M/L)':'Markdown table: Phase|Approach|Implementation Pattern|Expected Effect|Effort(S/M/L)'},
    brainstorm:{icon:'💡',label:_ja?'AI壁打ちセッション':'AI Brainstorm',desc:_ja?'docs/61のPolymorphicフレームで探索':'Explore with Polymorphic framework from docs/61',
      sys:_ja?'あなたは創造的な問題解決のエキスパートです。docs/61_ai_brainstorm_playbook.mdのプロジェクト固有プロンプトを活用し、高度な提案を引き出してください。':'You are a creative problem-solving expert. Use project-specific prompts from docs/61_ai_brainstorm_playbook.md to extract advanced proposals.',
      prompt:_ja?'以下の手順で実行:\n1. docs/61_ai_brainstorm_playbook.mdから現在のフェーズ（Phase 0-5）に対応するプロンプトを選択\n2. 選択したプロンプトをプロジェクト文脈（技術スタック、ドメイン、選定手法）と組み合わせて実行\n3. Polymorphic Engineの4段階フレーム（Sensing→Thinking→Morphing→Acting）の観点で回答を分析\n4. 得られたインサイトを該当ドキュメント（例: docs/03_architecture.md）への反映案として整理\n5. 次に実行すべきプロンプトを提案':'Follow these steps:\n1. Select prompts for current phase (Phase 0-5) from docs/61_ai_brainstorm_playbook.md\n2. Execute selected prompts combined with project context (tech stack, domain, methodology)\n3. Analyze answers from Polymorphic Engine 4-stage framework perspective (Sensing→Thinking→Morphing→Acting)\n4. Organize insights as reflection proposals into relevant docs (e.g., docs/03_architecture.md)\n5. Propose next prompts to execute',
      fmt:_ja?'## インサイト\n| フェーズ | プロンプトID | 得られた提案 | 反映先ドキュメント |\n\n## 次のアクション\n- 実行すべきプロンプト: ...':'## Insights\n| Phase | Prompt ID | Proposal | Target Document |\n\n## Next Actions\n- Prompts to execute: ...'},
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
  const templateOrder=['review','arch','reverse','implement','api','i18n','test','qa','security','a11y','perf','metrics','refactor','debug','incident','ops','docs','migrate','cicd','growth','strategy','methodology','brainstorm','industry','nextgen','cognitive','genome','maturity','risk','onboard'];
  h+=`<div class="launch-templates"><h4>${_ja?'📋 プロンプトテンプレート':'📋 Prompt Templates'}</h4>`;
  templateOrder.forEach(key=>{
    const t=PT[key];
    if(!t)return;
    h+=`<div class="launch-tpl" onclick="selectLaunchTemplate('${key}')">
      <div class="launch-tpl-icon">${t.icon}</div>
      <div class="launch-tpl-info"><strong>${t.label}</strong><span>${t.desc}</span></div>
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
