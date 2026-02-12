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
      prompt:'docs/23_tasks.mdから最優先タスク(P0またはIssue #1)を1つ選んで実装してください。\n\n実装手順:\n1. 型定義を作成 (TypeScript interface/type)\n2. データアクセス層を実装 (ORM/SDK)\n3. ビジネスロジックを実装\n4. UIコンポーネントを実装\n5. Vitestユニットテストを作成\n\nconstitution.mdの設計原則に従い、technical-plan.mdのアーキテクチャに沿ってください。',
      fmt:'ファイルパス付きコードブロック:\n```typescript:path/to/file.ts\n// code\n```\n必ずテストを含めてください。'},
    test:{icon:'🧪',label:'テスト生成',desc:'テストケース自動作成',
      sys:'あなたはQAエンジニアです。仕様書からテストケースを網羅的に作成します。',
      prompt:'docs/07_test_cases.mdを参照し、以下の順序でテストケースを生成してください:\n1. 正常系(Happy Path): 基本的なCRUD操作\n2. 異常系(Error Cases): バリデーションエラー、権限エラー\n3. 境界値(Boundary): 空文字列、最大長、NULL\n\n各テストケースには期待結果を明記してください。',
      fmt:'Vitestテストファイル:\n```typescript:tests/xxx.test.ts\nimport { describe, it, expect } from \'vitest\';\n// tests\n```'},
    refactor:{icon:'♻️',label:'リファクタ提案',desc:'構造改善と技術的負債の解消',
      sys:'あなたはコードレビュアーです。アーキテクチャの改善提案を行います。',
      prompt:'以下の仕様書の技術設計を分析し、リファクタリング提案をしてください。各指摘に工数見積り(S=1-2h/M=3-8h/L=1-2日)を付与してください。\n\nチェック項目:\n- SOLID原則の違反\n- 責務の分離不足(Fat Controller等)\n- スケーラビリティの問題\n- パフォーマンスボトルネック\n- 技術的負債',
      fmt:'Markdown表:\n| 問題 | 違反している原則 | 改善案 | 工数 | 優先度 |\n|------|------------------|--------|------|--------|\n| ... | SRP | ... | M | P1 |'},
    security:{icon:'🔒',label:'セキュリティ監査',desc:'脆弱性とベストプラクティス',
      sys:'あなたはセキュリティエンジニアです。OWASP Top 10を基準に監査します。',
      prompt:'以下の仕様書のセキュリティ面をOWASP Top 10の各項目別にチェックしてください:\n\n1. A01:2021 – Broken Access Control\n2. A02:2021 – Cryptographic Failures\n3. A03:2021 – Injection\n4. A04:2021 – Insecure Design\n5. A05:2021 – Security Misconfiguration\n6. A06:2021 – Vulnerable Components\n7. A07:2021 – Authentication Failures\n8. A08:2021 – Data Integrity Failures\n9. A09:2021 – Logging Failures\n10. A10:2021 – SSRF\n\n各項目の状態を✅(OK)/⚠️(注意)/❌(脆弱)で評価してください。',
      fmt:'Markdown表:\n| OWASP# | 項目 | 状態 | 詳細 | 推奨対策 |\n|--------|------|------|------|----------|\n| A01 | Access Control | ⚠️ | ... | ... |'},
    docs:{icon:'📝',label:'ドキュメント補完',desc:'不足文書の特定と生成',
      sys:'あなたはテクニカルライターです。開発ドキュメントの品質を高めます。',
      prompt:'以下の仕様書群を分析し、2パート構成で出力してください:\n\n**Part 1: ギャップ分析**\n既存ドキュメントと理想状態の差分を表形式で列挙\n\n**Part 2: 最重要ドキュメント生成**\nギャップ分析で最も優先度が高いドキュメント1つを全文生成してください。\n\n候補:\n- API仕様の詳細化(OpenAPI YAML)\n- シーケンス図(Mermaid)\n- デプロイ手順書(Step-by-step)\n- エラーハンドリング設計',
      fmt:'Part 1: Markdown表\nPart 2: 完全なドキュメント(Markdown)'},
    debug:{icon:'🔧',label:'デバッグ支援',desc:'エラー原因分析と修正提案',
      sys:'あなたは経験豊富なデバッグスペシャリストです。エラーログとスタックトレースから根本原因を特定します。',
      prompt:'以下の手順でデバッグ分析を実行:\n1. docs/25_error_logs.mdの既存パターンと照合（再発or新規を判定）\n2. エラー/スタックトレースの根本原因を特定（5 Whys分析）\n3. docs/37_bug_prevention.mdのチェックリストから該当バグカテゴリを特定\n4. 修正コードと再発防止策を提案\n5. docs/25_error_logs.mdに追記するエントリをドラフト',
      fmt:'## 診断結果\n| 項目 | 内容 |\n|------|------|\n| エラー種別 | ... |\n| 根本原因 | ... |\n| 影響範囲 | ... |\n\n## 修正コード\n```typescript:path/to/file.ts\n// fix\n```\n\n## error_logsエントリ\n- 症状/原因/解決策/防止策'},
    arch:{icon:'📐',label:'アーキテクチャ整合性',desc:'設計と実装の乖離を検出',
      sys:'あなたはソフトウェアアーキテクトです。仕様書のアーキテクチャと実装の整合性を検証します。',
      prompt:'アーキテクチャ整合性チェック:\n1. docs/03_architecture.mdのレイヤー構造・パターン定義を確認\n2. .spec/technical-plan.mdの技術方針との一致を検証\n3. コードが定義済みレイヤー境界を違反していないか検査\n4. docs/26_design_system.mdのコンポーネント規約との整合性を確認\n5. 違反箇所に修正案とリファクタリング手順を提示',
      fmt:'Markdown表:\n| # | 違反箇所 | 定義元 | 違反内容 | 深刻度 | 修正案 |\n|---|---------|--------|---------|--------|--------|\n\n## アーキテクチャ適合スコア: X/10'},
    perf:{icon:'⚡',label:'パフォーマンス最適化',desc:'ボトルネック特定と改善提案',
      sys:'あなたはパフォーマンスエンジニアです。非機能要件に基づきボトルネックを特定します。',
      prompt:'パフォーマンス分析:\n1. .spec/constitution.mdの非機能要件（NFR）からパフォーマンス目標値を抽出\n2. Core Web Vitals目標（LCP<2.5s, FID<100ms, CLS<0.1）と比較\n3. N+1クエリ、不要な再レンダリング、バンドルサイズ問題を検出\n4. 各問題に改善前/改善後の推定値を付与\n5. 優先度順の改善ロードマップを作成',
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
  }:{
    review:{icon:'🔍',label:'Spec Review',desc:'Find contradictions, gaps & improvements',
      sys:'You are an experienced tech lead and SDD architect.',
      prompt:'Review the following specs in 4 steps:\n1. Verify mission and KPIs in constitution.md\n2. Check requirement coverage in specification.md\n3. Evaluate architecture validity in technical-plan.md\n4. Identify overall consistency and gaps\n\nAssign priority to each finding (P0=critical/P1=important/P2=recommended).',
      fmt:'Markdown table:\n| # | File | Finding | Priority | Recommended Action |\n|---|------|---------|----------|--------------------|\n| 1 | .spec/xxx.md | ... | P0 | ... |'},
    implement:{icon:'🚀',label:'MVP Build',desc:'Start implementation from specs',
      sys:'You are a full-stack developer. You implement faithfully according to SDD specs.',
      prompt:'Select the highest priority task (P0 or Issue #1) from docs/23_tasks.md and implement it.\n\nImplementation steps:\n1. Create type definitions (TypeScript interface/type)\n2. Implement data access layer (ORM/SDK)\n3. Implement business logic\n4. Implement UI components\n5. Create Vitest unit tests\n\nFollow design principles in constitution.md and architecture in technical-plan.md.',
      fmt:'Code blocks with file paths:\n```typescript:path/to/file.ts\n// code\n```\nMust include tests.'},
    test:{icon:'🧪',label:'Test Generation',desc:'Auto-generate test cases',
      sys:'You are a QA engineer. You create comprehensive test cases from specifications.',
      prompt:'Reference docs/07_test_cases.md and generate test cases in this order:\n1. Happy Path: Basic CRUD operations\n2. Error Cases: Validation errors, permission errors\n3. Boundary: Empty strings, max length, NULL\n\nSpecify expected results for each test case.',
      fmt:'Vitest test file:\n```typescript:tests/xxx.test.ts\nimport { describe, it, expect } from \'vitest\';\n// tests\n```'},
    refactor:{icon:'♻️',label:'Refactor Proposal',desc:'Architecture improvements & tech debt',
      sys:'You are a code reviewer focused on architecture improvements.',
      prompt:'Analyze the technical design in these specs and propose refactoring. Assign effort estimates (S=1-2h/M=3-8h/L=1-2d) to each finding.\n\nCheck items:\n- SOLID principle violations\n- Separation of concerns issues (Fat Controllers, etc.)\n- Scalability problems\n- Performance bottlenecks\n- Technical debt',
      fmt:'Markdown table:\n| Issue | Violated Principle | Improvement | Effort | Priority |\n|-------|-------------------|-------------|--------|----------|\n| ... | SRP | ... | M | P1 |'},
    security:{icon:'🔒',label:'Security Audit',desc:'Vulnerabilities & best practices',
      sys:'You are a security engineer. You audit against OWASP Top 10.',
      prompt:'Check security aspects of these specs against each OWASP Top 10 item:\n\n1. A01:2021 – Broken Access Control\n2. A02:2021 – Cryptographic Failures\n3. A03:2021 – Injection\n4. A04:2021 – Insecure Design\n5. A05:2021 – Security Misconfiguration\n6. A06:2021 – Vulnerable Components\n7. A07:2021 – Authentication Failures\n8. A08:2021 – Data Integrity Failures\n9. A09:2021 – Logging Failures\n10. A10:2021 – SSRF\n\nEvaluate each item as ✅(OK)/⚠️(Warning)/❌(Vulnerable).',
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
      prompt:'Architecture compliance check:\n1. Review layer structure and patterns in docs/03_architecture.md\n2. Verify alignment with .spec/technical-plan.md technical decisions\n3. Inspect code for layer boundary violations\n4. Check consistency with docs/26_design_system.md component conventions\n5. Propose fixes and refactoring steps for each violation',
      fmt:'Markdown table:\n| # | Location | Source | Violation | Severity | Fix |\n|---|----------|--------|-----------|----------|-----|\n\n## Architecture Compliance Score: X/10'},
    perf:{icon:'⚡',label:'Performance Optimization',desc:'Identify bottlenecks & suggest fixes',
      sys:'You are a performance engineer. You identify bottlenecks against NFR targets and propose improvements.',
      prompt:'Performance analysis:\n1. Extract performance targets from NFR section in .spec/constitution.md\n2. Compare against Core Web Vitals targets (LCP<2.5s, FID<100ms, CLS<0.1)\n3. Detect N+1 queries, unnecessary re-renders, bundle size issues\n4. Provide before/after estimates for each issue\n5. Create a prioritized improvement roadmap',
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
    qa:{icon:'🐛',label:_ja?'QA・バグ検出':'QA & Bug Detection',desc:_ja?'ドメイン別バグパターンとQA戦略を基にテスト計画を生成':'Generate test plan based on domain-specific bug patterns and QA strategy',
      sys:_ja?'あなたはQAエンジニアです。docs/28_qa_strategy.mdのドメイン別バグパターンを参照し、具体的なテストシナリオを設計してください。':'You are a QA engineer. Reference docs/28_qa_strategy.md domain-specific bug patterns to design concrete test scenarios.',
      prompt:_ja?'以下の手順で実行:\n1. docs/28_qa_strategy.mdの重点領域を確認\n2. 各重点領域に対し具体的テストケースを3つ以上作成\n3. よくあるバグパターンに対する回帰テストを設計\n4. 業界横断チェックリストの該当項目を検証\n5. 優先度マトリクスに基づきテスト実行順序を決定':'Follow these steps:\n1. Review focus areas from docs/28_qa_strategy.md\n2. Create 3+ concrete test cases per focus area\n3. Design regression tests for common bug patterns\n4. Verify applicable cross-cutting checklist items\n5. Determine test execution order based on priority matrix',
      fmt:_ja?'Markdown表形式: テストID|カテゴリ|シナリオ|期待結果|優先度(CRITICAL/HIGH/MED/LOW)':'Markdown table: TestID|Category|Scenario|Expected Result|Priority(CRITICAL/HIGH/MED/LOW)'},
  };

  /* ── Header ── */
  let h=`<div class="exp-header"><h3>🤖 ${_ja?'AI プロンプトランチャー':'AI Prompt Launcher'}</h3>
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

  /* ── Prompt templates ── */
  h+=`<div class="launch-templates"><h4>${_ja?'📋 プロンプトテンプレート':'📋 Prompt Templates'}</h4>`;
  Object.entries(PT).forEach(([key,t])=>{
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
  const ctx='Project: '+pn+'\nStack: '+(a.frontend||'React')+' + '+(a.backend||'Node.js')+' + '+(a.database||'PostgreSQL')+'\nAuth: '+(a.auth||'N/A')+'\nEntities: '+(a.data_entities||'N/A');
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
