// P18: Prompt Engineering OS
// Generates: docs/69_prompt_ops_pipeline.md, 70_react_workflow.md, 71_llmops_dashboard.md, 72_prompt_registry.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

// REACT_PROTOCOL: 6 phases x 4 ReAct stages
function _rp(id,name_ja,name_en,r_ja,r_en,a_ja,a_en,o_ja,o_en,v_ja,v_en){
  return {id,name_ja,name_en,reason:{ja:r_ja,en:r_en},act:{ja:a_ja,en:a_en},
    observe:{ja:o_ja,en:o_en},verify:{ja:v_ja,en:v_en}};
}
var REACT_PROTOCOL=[
  _rp('concept','Phase 0: 構想','Phase 0: Concept',
    '要件分解・依存分析・不確実性の特定','Decompose requirements, analyze dependencies, identify uncertainties',
    'read_spec, search_similar, list_constraints','read_spec, search_similar, list_constraints',
    '類似事例の適用可能性を評価','Evaluate applicability of similar cases',
    '要件網羅性チェック（漏れ・矛盾・あいまい性）','Requirement coverage check (omissions, contradictions, ambiguities)'
  ),
  _rp('design','Phase 1: 設計','Phase 1: Design',
    'アーキテクチャ選定・ToT3案生成・トレードオフ評価','Architecture selection, ToT 3-option generation, trade-off evaluation',
    'read_docs, grep_patterns, compare_options','read_docs, grep_patterns, compare_options',
    '設計案の実現可能性と整合性を比較','Compare feasibility and consistency of design options',
    'SOLID/DRY準拠・スケーラビリティ・セキュリティ確認','SOLID/DRY compliance, scalability, security check'
  ),
  _rp('implement','Phase 2: 実装','Phase 2: Implement',
    'タスク分解・優先順位決定・依存関係の解決','Task decomposition, priority setting, dependency resolution',
    'write_code, read_file, run_lint','write_code, read_file, run_lint',
    'コンパイル結果・型エラー・lint警告を確認','Check compilation results, type errors, lint warnings',
    '型安全・lint通過・テスト通過を確認','Verify type safety, lint pass, test pass'
  ),
  _rp('test','Phase 3: テスト','Phase 3: Test',
    'テスト戦略立案・カバレッジ計画・リスク優先度設定','Plan test strategy, coverage targets, risk prioritization',
    'run_test, read_coverage, analyze_failures','run_test, read_coverage, analyze_failures',
    'テスト結果・失敗分析・カバレッジギャップを確認','Check test results, failure analysis, coverage gaps',
    'カバレッジ閾値達成・全テスト通過・回帰なし','Coverage threshold met, all tests pass, no regressions'
  ),
  _rp('review','Phase 4: レビュー','Phase 4: Review',
    'コード品質・セキュリティ・パフォーマンスの評価基準設定','Set criteria for code quality, security, performance evaluation',
    'grep_code, read_diff, static_analysis','grep_code, read_diff, static_analysis',
    '脆弱性・複雑度・テスト不足箇所を特定','Identify vulnerabilities, complexity issues, insufficient tests',
    'OWASP/CRITERIA準拠・SOLID違反なし・レビューコメント解決','OWASP/CRITERIA compliance, no SOLID violations, review comments resolved'
  ),
  _rp('deploy','Phase 5: デプロイ','Phase 5: Deploy',
    'リスク評価・ロールバック計画・デプロイ戦略の決定','Risk assessment, rollback planning, deployment strategy decision',
    'run_deploy, check_health, monitor_logs','run_deploy, check_health, monitor_logs',
    'ヘルスチェック結果・エラーレート・レイテンシを確認','Check health status, error rate, latency',
    'SLO達成・監視アラート正常・ロールバック手順確認済み','SLO achieved, monitoring alerts normal, rollback procedure verified'
  )
];

// LLMOPS_STACK: 3 maturity levels x tool recommendations
function _los(lv,label_ja,label_en,tools_ja,tools_en,metrics_ja,metrics_en,setup_ja,setup_en){
  return {lv,label_ja,label_en,tools_ja,tools_en,metrics_ja,metrics_en,setup_ja,setup_en};
}
var LLMOPS_STACK=[
  _los(1,'AI支援 (Assisted)','AI Assisted',
    'スプレッドシート・手動ログ・Notionプロンプトデータベース',
    'Spreadsheet, manual logs, Notion prompt database',
    ['成功/失敗率','平均応答時間','主観的品質スコア','コスト/月'],
    ['Success/failure rate','Avg response time','Subjective quality score','Cost/month'],
    'CSVテンプレート配布・週次レビューチェックリスト・Slackでの成功例共有',
    'Distribute CSV templates, weekly review checklist, share success cases via Slack'
  ),
  _los(2,'AI協調 (Augmented)','AI Augmented',
    'LangSmith / Langfuse・GitHub Actions CI統合・プロンプトバージョン管理',
    'LangSmith / Langfuse, GitHub Actions CI integration, prompt version control',
    ['CRITERIA平均スコア','コスト/クエリ','レイテンシP95','プロンプト成功率'],
    ['CRITERIA avg score','Cost/query','Latency P95','Prompt success rate'],
    'API キー設定・Webhook連携・ダッシュボード構築・自動アラート設定',
    'API key setup, webhook integration, dashboard build, automated alert configuration'
  ),
  _los(3,'AI自律 (Autonomous)','AI Autonomous',
    'カスタム評価パイプライン・Self-Eval Agent・Prompt CI/CD自動化',
    'Custom evaluation pipeline, Self-Eval Agent, Prompt CI/CD automation',
    ['自動CRITERIAスコア','A/B勝率','プロンプト劣化検知レート','自動改善回数'],
    ['Auto CRITERIA score','A/B win rate','Prompt degradation detection rate','Auto-improvement count'],
    'Prompt CI/CDパイプライン構築・自動ロールバック設定・継続評価ループ',
    'Build Prompt CI/CD pipeline, configure auto-rollback, set up continuous evaluation loop'
  )
];

// PROMPT_LIFECYCLE: 5 stages
var PROMPT_LIFECYCLE=[
  {id:'draft',name_ja:'起草',name_en:'Draft',
   desc_ja:'プロンプト初稿の作成。目的・役割・指示を明確化しCRITERIA 8軸で自己採点。',
   desc_en:'Create initial prompt draft. Clarify purpose, role, instructions; self-score with CRITERIA 8 axes.',
   check_ja:['目的と期待出力が明確か','役割定義が具体的か','CRITERIA Context≥3を達成しているか','テンプレートリテラル汚染がないか（変数展開構文の混入禁止）'],
   check_en:['Is purpose and expected output clear','Is role definition specific','Does Context CRITERIA score ≥3','No template literal contamination (no variable interpolation syntax)']},
  {id:'review',name_ja:'レビュー',name_en:'Review',
   desc_ja:'CRITERIA 8軸スコアリング実施。チームレビューまたはAIセルフレビュー。閾値未達は差し戻し。',
   desc_en:'Conduct CRITERIA 8-axis scoring. Team review or AI self-review. Return if below threshold.',
   check_ja:['CRITERIA総合スコア≥3.5/5','Instructions軸≥4 (詳細な手順が明記)','Execution Rules軸≥3 (禁止事項・形式が明示)','ピアレビュー完了'],
   check_en:['CRITERIA total score ≥3.5/5','Instructions axis ≥4 (detailed steps documented)','Execution Rules ≥3 (prohibitions and format explicit)','Peer review complete']},
  {id:'test',name_ja:'テスト',name_en:'Test',
   desc_ja:'5ケース以上のテスト入力で出力品質を検証。A/Bテストで旧バージョンと比較。',
   desc_en:'Validate output quality with 5+ test inputs. Compare with previous version via A/B test.',
   check_ja:['正常系5件以上でテスト実施','境界値ケースを含むか','旧バージョン比で品質改善確認','エラーハンドリング応答が適切か'],
   check_en:['5+ normal case tests executed','Boundary value cases included','Quality improvement vs previous version verified','Error handling response appropriate']},
  {id:'deploy',name_ja:'デプロイ',name_en:'Deploy',
   desc_ja:'バージョンタグを付与してプロンプトレジストリに登録。段階的ロールアウト（10%→50%→100%）。',
   desc_en:'Assign version tag and register in prompt registry. Staged rollout (10%→50%→100%).',
   check_ja:['バージョン番号(v1.2.3形式)が付与済み','レジストリへの登録完了','ロールバックポイント設定済み','10%トラフィックで24h監視済み'],
   check_en:['Version number (v1.2.3 format) assigned','Registry registration complete','Rollback point configured','10% traffic monitored for 24h']},
  {id:'monitor',name_ja:'監視',name_en:'Monitor',
   desc_ja:'本番メトリクスをリアルタイム監視。品質劣化を検知した場合は自動アラートとロールバック。',
   desc_en:'Real-time monitoring of production metrics. Auto-alert and rollback on quality degradation.',
   check_ja:['成功率<80%でアラート発火','コスト/クエリが予算内か','P95レイテンシが閾値内か','月次でプロンプトゲノム(doc65)更新'],
   check_en:['Alert fires if success rate <80%','Cost/query within budget','P95 latency within threshold','Monthly prompt genome (doc65) update']}
];

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

function gen69(G, domain, meth, matLv, a, pn) {
  var d = G ? '# Prompt Ops パイプライン — ' + pn + '\n\n' : '# Prompt Ops Pipeline — ' + pn + '\n\n';
  d += G ? '> プロンプトCI/CDパイプライン。ライフサイクル管理・バージョン制御・A/Bテスト・ロールバック。\n\n' :
           '> Prompt CI/CD pipeline. Lifecycle management, version control, A/B testing, rollback.\n\n';

  // Lifecycle stages
  d += G ? '## 🔄 Prompt Lifecycle 5ステージ\n\n' : '## 🔄 Prompt Lifecycle 5 Stages\n\n';
  d += G ? '| ステージ | 説明 | 主要チェック |\n|----------|------|-------------|\n' :
           '| Stage | Description | Key Checks |\n|-------|-------------|------------|\n';
  PROMPT_LIFECYCLE.forEach(function(s) {
    var checks = G ? s.check_ja.slice(0, 2).join(' / ') : s.check_en.slice(0, 2).join(' / ');
    d += '| **' + (G ? s.name_ja : s.name_en) + '** | ' + (G ? s.desc_ja.substring(0, 60) : s.desc_en.substring(0, 60)) + '... | ' + checks + ' |\n';
  });
  d += '\n';

  // Detailed checklist per stage
  d += G ? '## ✅ ステージ別チェックリスト\n\n' : '## ✅ Stage-by-Stage Checklist\n\n';
  PROMPT_LIFECYCLE.forEach(function(s) {
    d += '### ' + (G ? s.name_ja : s.name_en) + '\n\n';
    d += G ? s.desc_ja + '\n\n' : s.desc_en + '\n\n';
    var checks = G ? s.check_ja : s.check_en;
    checks.forEach(function(c) { d += '- [ ] ' + c + '\n'; });
    // Domain-specific extra check
    if (domain === 'fintech') {
      d += G ? '- [ ] ' + (s.id === 'review' ? '規制要件チェック（金融庁・PCI DSS準拠）' : '金融ドメイン固有の検証完了') + '\n' :
               '- [ ] ' + (s.id === 'review' ? 'Regulatory compliance check (FSA, PCI DSS)' : 'Finance domain-specific validation complete') + '\n';
    } else if (domain === 'health') {
      d += G ? '- [ ] PHI（個人健康情報）の漏洩リスクなし\n' : '- [ ] No PHI (personal health info) leak risk\n';
    }
    d += '\n';
  });

  // Version control strategy
  d += G ? '## 🗂️ バージョン制御戦略\n\n' : '## 🗂️ Version Control Strategy\n\n';
  d += G ? '### Gitベースのプロンプト管理\n\n' : '### Git-based Prompt Management\n\n';
  d += G ? '```\nprompts/\n  {domain}/\n    {usecase}-v{major}.{minor}.{patch}.md   # バージョン付きプロンプト\n    {usecase}-CURRENT.md                   # 現行バージョンへのシンボリックリンク\n    CHANGELOG.md                           # 変更履歴\n    EVALUATION.md                          # CRITERIA評価ログ\n```\n\n' :
           '```\nprompts/\n  {domain}/\n    {usecase}-v{major}.{minor}.{patch}.md   # Versioned prompt\n    {usecase}-CURRENT.md                   # Symlink to current version\n    CHANGELOG.md                           # Change history\n    EVALUATION.md                          # CRITERIA evaluation log\n```\n\n';
  d += G ? '**バージョニング規則:**\n\n' : '**Versioning Rules:**\n\n';
  d += G ? '- `MAJOR`: 役割・目的の根本的変更\n- `MINOR`: 新しい指示ブロック追加・CRITERIA軸の改善\n- `PATCH`: 誤字修正・表現の微調整\n\n' :
           '- `MAJOR`: Fundamental change to role or purpose\n- `MINOR`: New instruction blocks, CRITERIA axis improvements\n- `PATCH`: Typo fixes, minor expression adjustments\n\n';

  // A/B test framework
  d += G ? '## 🧪 A/Bテストフレームワーク\n\n' : '## 🧪 A/B Test Framework\n\n';
  d += G ? '### メトリクス定義\n\n' : '### Metrics Definition\n\n';
  d += G ? '| メトリクス | 計算式 | 有意差基準 |\n|-----------|--------|----------|\n' :
           '| Metric | Formula | Significance Threshold |\n|--------|---------|------------------------|\n';
  var metrics = G ? [
    ['CRITERIA改善率', '(新スコア - 旧スコア) / 旧スコア × 100', '≥ 10%'],
    ['タスク成功率', '期待出力数 / 総テスト数 × 100', '≥ 80%'],
    ['応答品質スコア', 'CRITERIA 8軸加重平均', '≥ 4.0/5'],
    ['コスト効率', '(旧コスト - 新コスト) / 旧コスト × 100', '≥ 5%']
  ] : [
    ['CRITERIA improvement rate', '(New score - Old score) / Old score × 100', '≥ 10%'],
    ['Task success rate', 'Expected outputs / Total tests × 100', '≥ 80%'],
    ['Response quality score', 'CRITERIA 8-axis weighted average', '≥ 4.0/5'],
    ['Cost efficiency', '(Old cost - New cost) / Old cost × 100', '≥ 5%']
  ];
  metrics.forEach(function(m) {
    d += '| ' + m[0] + ' | `' + m[1] + '` | ' + m[2] + ' |\n';
  });
  d += '\n';

  // Rollback procedure
  d += G ? '## 🔙 ロールバック手順\n\n' : '## 🔙 Rollback Procedure\n\n';
  d += G ? '**自動ロールバック判定基準** (Level ' + matLv + ' 対応):\n\n' :
           '**Auto-Rollback Criteria** (Level ' + matLv + ' adapted):\n\n';
  if (matLv >= 2) {
    d += G ? '- 成功率が24時間で10%以上低下した場合\n- CRITERIA平均スコアが3.0を下回った場合\n- P95レイテンシが閾値の150%を超えた場合\n\n' :
             '- Success rate drops >10% over 24 hours\n- CRITERIA avg score falls below 3.0\n- P95 latency exceeds 150% of threshold\n\n';
  } else {
    d += G ? '- 手動モニタリングで品質低下を検知した場合にロールバック\n\n' :
             '- Manual rollback when quality degradation detected via monitoring\n\n';
  }
  d += G ? '**手順:**\n1. 前バージョンのプロンプトID確認\n2. `CURRENT.md`を前バージョンへ切り戻し\n3. インシデントレポートに記録\n4. 根本原因分析後に再デプロイ\n\n' :
           '**Steps:**\n1. Confirm previous version prompt ID\n2. Revert `CURRENT.md` to previous version\n3. Record in incident report\n4. Re-deploy after root cause analysis\n\n';

  // Mermaid pipeline diagram
  d += '```mermaid\n';
  d += 'graph LR\n';
  d += '  D[' + (G ? '起草' : 'Draft') + '] -->|CRITERIA≥3| R[' + (G ? 'レビュー' : 'Review') + ']\n';
  d += '  R -->|' + (G ? 'スコア≥3.5' : 'Score≥3.5') + '| T[' + (G ? 'テスト' : 'Test') + ']\n';
  d += '  R -->|' + (G ? '不合格' : 'Fail') + '| D\n';
  d += '  T -->|A/B' + (G ? '勝利' : ' Win') + '| P[' + (G ? 'デプロイ' : 'Deploy') + ']\n';
  d += '  T -->|' + (G ? '不合格' : 'Fail') + '| D\n';
  d += '  P -->|10%→50%→100%| M[' + (G ? '監視' : 'Monitor') + ']\n';
  d += '  M -->|' + (G ? '品質劣化' : 'Degradation') + '| D\n';
  d += '  style P fill:#4f46e5,color:#fff\n';
  d += '```\n';

  return d;
}

function gen70(G, domain, matLv, a, pn) {
  var d = G ? '# ReAct 自律ワークフロー — ' + pn + '\n\n' : '# ReAct Autonomous Workflow — ' + pn + '\n\n';
  d += G ? '> 6フェーズ × Reason→Act→Observe→Verify の自律開発サイクル。自己デバッグループ付き。\n\n' :
           '> 6 phases × Reason→Act→Observe→Verify autonomous development cycle. Self-debug loop included.\n\n';

  // ReAct protocol definition
  d += G ? '## 🔄 ReActプロトコル定義\n\n' : '## 🔄 ReAct Protocol Definition\n\n';
  d += G ? '| ステージ | 役割 | 説明 |\n|----------|------|------|\n' :
           '| Stage | Role | Description |\n|-------|------|-------------|\n';
  var stages = G ? [
    ['Reason (思考)', 'プランニング', '次のアクションを決定する前に、現状・目標・制約を分析する'],
    ['Act (実行)', 'ツール実行', 'reasonで決定したアクションを具体的なツール呼び出しで実行する'],
    ['Observe (観察)', '結果評価', 'ツール実行の結果を客観的に観察し、期待との差異を特定する'],
    ['Verify (検証)', '品質確認', '事前定義した成功基準に照らして、出力の品質を検証する']
  ] : [
    ['Reason', 'Planning', 'Before next action, analyze current state, goals, and constraints'],
    ['Act', 'Tool execution', 'Execute action determined in Reason phase via specific tool calls'],
    ['Observe', 'Result evaluation', 'Objectively observe tool execution results, identify gaps from expectations'],
    ['Verify', 'Quality check', 'Validate output quality against predefined success criteria']
  ];
  stages.forEach(function(s) {
    d += '| **' + s[0] + '** | ' + s[1] + ' | ' + s[2] + ' |\n';
  });
  d += '\n';

  // 6-phase ReAct cycles
  d += G ? '## 📋 6フェーズ × ReActサイクル\n\n' : '## 📋 6 Phases × ReAct Cycles\n\n';
  REACT_PROTOCOL.forEach(function(phase) {
    d += '### ' + (G ? phase.name_ja : phase.name_en) + '\n\n';
    d += G ? '| ReActステージ | 内容 |\n|--------------|------|\n' :
             '| ReAct Stage | Content |\n|-------------|----------|\n';
    d += '| **Reason** | ' + (G ? phase.reason.ja : phase.reason.en) + ' |\n';
    d += '| **Act** | `' + (G ? phase.act.ja : phase.act.en) + '` |\n';
    d += '| **Observe** | ' + (G ? phase.observe.ja : phase.observe.en) + ' |\n';
    d += '| **Verify** | ' + (G ? phase.verify.ja : phase.verify.en) + ' |\n';
    // Domain-specific tool extensions
    if (domain === 'fintech') {
      d += G ? '| **Domain+** | `compliance_check` (金融規制自動チェック) |\n' :
               '| **Domain+** | `compliance_check` (automated financial regulation check) |\n';
    } else if (domain === 'health') {
      d += G ? '| **Domain+** | `phi_scan` (PHI漏洩リスク検出) |\n' :
               '| **Domain+** | `phi_scan` (PHI leak risk detection) |\n';
    }
    d += '\n';
  });

  // Self-debug loop
  d += G ? '## 🔁 自己デバッグループ\n\n' : '## 🔁 Self-Debug Loop\n\n';
  d += G ? '**エラー発生時の自律修復プロセス (最大3反復):**\n\n' :
           '**Autonomous repair process on error (max 3 iterations):**\n\n';
  d += G ? '```\nError → Reason (根本原因分析)\n      → Act (修正実行)\n      → Observe (修正結果確認)\n      → Verify (修正の有効性確認)\n      → [まだ失敗の場合] → 次の反復 (max 3回)\n      → [3回失敗] → 人間へのエスカレーション\n```\n\n' :
           '```\nError → Reason (root cause analysis)\n      → Act (apply fix)\n      → Observe (verify fix result)\n      → Verify (validate fix effectiveness)\n      → [still failing] → next iteration (max 3)\n      → [3 failures] → escalate to human\n```\n\n';
  d += G ? '**失敗復旧パターン:**\n\n' : '**Failure Recovery Patterns:**\n\n';
  var recovery = G ? [
    ['retry', '一時的エラー（ネットワーク・タイムアウト）', '同じActを最大3回リトライ。指数バックオフ適用'],
    ['fallback', '機能的エラー（ツール失敗・API拒否）', '代替ツールまたはアプローチに切り替え'],
    ['escalate', '判断が必要な複合エラー', '人間への委譲。エラー内容・試行履歴を要約して提供']
  ] : [
    ['retry', 'Transient errors (network, timeout)', 'Retry same Act up to 3 times with exponential backoff'],
    ['fallback', 'Functional errors (tool failure, API rejection)', 'Switch to alternative tool or approach'],
    ['escalate', 'Complex errors requiring judgment', 'Delegate to human with error summary and attempt history']
  ];
  recovery.forEach(function(r) {
    d += '**' + r[0].toUpperCase() + '**: ' + r[1] + '\n→ ' + r[2] + '\n\n';
  });

  // Mermaid ReAct state machine
  d += '```mermaid\n';
  d += 'graph TD\n';
  d += '  S[' + (G ? '開始' : 'Start') + '] --> R[Reason]\n';
  d += '  R --> A[Act]\n';
  d += '  A --> O[Observe]\n';
  d += '  O --> V{Verify}\n';
  d += '  V -->|' + (G ? '成功' : 'Pass') + '| N[' + (G ? '次フェーズ' : 'Next Phase') + ']\n';
  d += '  V -->|' + (G ? '失敗 iter<3' : 'Fail iter<3') + '| R\n';
  d += '  V -->|' + (G ? '失敗 iter=3' : 'Fail iter=3') + '| E[' + (G ? 'エスカレーション' : 'Escalate') + ']\n';
  d += '  style N fill:#22c55e,color:#fff\n';
  d += '  style E fill:#ef4444,color:#fff\n';
  d += '```\n';

  return d;
}

function gen71(G, matLv, a, pn) {
  var d = G ? '# LLMOps 評価ダッシュボード — ' + pn + '\n\n' : '# LLMOps Evaluation Dashboard — ' + pn + '\n\n';
  d += G ? '> AI成熟度レベル ' + matLv + ' に最適化されたLLMOpsスタック・評価メトリクス・コスト最適化戦略。\n\n' :
           '> LLMOps stack, evaluation metrics, and cost optimization strategies optimized for AI Maturity Level ' + matLv + '.\n\n';

  // Recommended stack for current maturity level
  var stack = LLMOPS_STACK[matLv - 1];
  d += G ? '## 🛠️ 推奨LLMOpsスタック (Level ' + matLv + ': ' + stack.label_ja + ')\n\n' :
           '## 🛠️ Recommended LLMOps Stack (Level ' + matLv + ': ' + stack.label_en + ')\n\n';
  d += G ? '**ツール:** ' + stack.tools_ja + '\n\n' : '**Tools:** ' + stack.tools_en + '\n\n';
  d += G ? '**セットアップ:** ' + stack.setup_ja + '\n\n' : '**Setup:** ' + stack.setup_en + '\n\n';

  // All 3 levels comparison
  d += G ? '## 📊 成熟度別LLMOpsスタック比較\n\n' : '## 📊 LLMOps Stack Comparison by Maturity\n\n';
  d += G ? '| レベル | ツール | 主要メトリクス | セットアップ |\n|--------|--------|--------------|-------------|\n' :
           '| Level | Tools | Key Metrics | Setup |\n|-------|-------|-------------|-------|\n';
  LLMOPS_STACK.forEach(function(s) {
    var active = s.lv === matLv ? ' ← **現在**' : '';
    d += '| **Level ' + s.lv + ': ' + (G ? s.label_ja : s.label_en) + '**' + (G ? active : active.replace('現在', 'Current')) + ' | ' +
         (G ? s.tools_ja.substring(0, 40) : s.tools_en.substring(0, 40)) + '... | ' +
         (G ? s.metrics_ja.slice(0, 2).join(', ') : s.metrics_en.slice(0, 2).join(', ')) + ' | ' +
         (G ? s.setup_ja.substring(0, 30) : s.setup_en.substring(0, 30)) + '... |\n';
  });
  d += '\n';

  // CRITERIA integration metrics
  d += G ? '## 📈 評価メトリクス定義 (CRITERIA連携)\n\n' : '## 📈 Evaluation Metrics Definition (CRITERIA Integration)\n\n';
  d += G ? '> docs/65 Prompt Genome の CRITERIA 8軸をLLMOpsメトリクスに自動統合します。\n\n' :
           '> Automatically integrates CRITERIA 8-axis from docs/65 Prompt Genome into LLMOps metrics.\n\n';
  d += G ? '| CRITERIA軸 | 重み | LLMOpsメトリクス | 計測方法 |\n|-----------|------|----------------|----------|\n' :
           '| CRITERIA Axis | Weight | LLMOps Metric | Measurement |\n|--------------|--------|---------------|-------------|\n';
  var criteriaMetrics = G ? [
    ['Context', '15%', 'コンテキスト品質スコア', 'LangSmith評価テンプレートで自動採点'],
    ['Instructions', '20%', '指示明確性スコア', 'テスト入力5件の出力整合率で計算'],
    ['Execution Rules', '15%', 'ルール遵守率', '出力の禁止事項違反数をカウント'],
    ['Thought Process', '10%', 'CoT品質スコア', '推論ステップの論理的一貫性を評価'],
    ['Reflection', '10%', '自己修正率', 'セルフクリティーク後の改善度を計測'],
    ['Iteration', '10%', '反復改善効率', '各反復での品質向上率を算出'],
    ['Adaptation', '10%', 'コンテキスト適応率', 'ドメイン別出力品質の一致度'],
    ['Role', '10%', '役割一貫性スコア', '役割逸脱回数 / 総出力数']
  ] : [
    ['Context', '15%', 'Context quality score', 'Auto-scored with LangSmith evaluation template'],
    ['Instructions', '20%', 'Instruction clarity score', 'Output consistency rate across 5 test inputs'],
    ['Execution Rules', '15%', 'Rule adherence rate', 'Count prohibition violations in output'],
    ['Thought Process', '10%', 'CoT quality score', 'Evaluate logical consistency of reasoning steps'],
    ['Reflection', '10%', 'Self-correction rate', 'Measure improvement after self-critique'],
    ['Iteration', '10%', 'Iterative improvement efficiency', 'Calculate quality gain rate per iteration'],
    ['Adaptation', '10%', 'Context adaptation rate', 'Domain-specific output quality match rate'],
    ['Role', '10%', 'Role consistency score', 'Role deviations / total outputs']
  ];
  criteriaMetrics.forEach(function(m) {
    d += '| **' + m[0] + '** | ' + m[1] + ' | ' + m[2] + ' | ' + m[3] + ' |\n';
  });
  d += '\n';

  // Cost optimization
  d += G ? '## 💰 コスト最適化戦略\n\n' : '## 💰 Cost Optimization Strategy\n\n';
  var costStrategies = G ? [
    ['トークン予算管理', 'Phase 0-1は簡潔プロンプト(I=3)、Phase 2-3は詳細プロンプト(I=5)に分けてコスト管理'],
    ['キャッシュ戦略', '同一コンテキストへの繰り返しクエリはセマンティックキャッシュで70%コスト削減'],
    ['モデル選定ガイド', '探索タスク→Haiku、設計・実装→Sonnet、アーキテクチャ・監査→Opus/Gemini Pro'],
    ['バッチ処理', 'リアルタイム不要なA/Bテスト・評価処理はバッチAPIで50%コスト削減']
  ] : [
    ['Token budget management', 'Use concise prompts (I=3) for Phase 0-1, detailed (I=5) for Phase 2-3'],
    ['Cache strategy', 'Semantic cache for repeated queries on same context, 70% cost reduction'],
    ['Model selection guide', 'Exploration→Haiku, Design/Implementation→Sonnet, Architecture/Audit→Opus/Gemini Pro'],
    ['Batch processing', 'Use batch API for non-real-time A/B tests and evaluations, 50% cost reduction']
  ];
  costStrategies.forEach(function(c) {
    d += '**' + c[0] + ':** ' + c[1] + '\n\n';
  });

  // Mermaid LLMOps architecture
  d += '```mermaid\n';
  d += 'graph TD\n';
  d += '  P[' + (G ? 'プロンプト実行' : 'Prompt Execution') + '] --> T[' + (G ? 'トレーシング' : 'Tracing') + ']\n';
  d += '  T --> C[CRITERIA ' + (G ? '自動評価' : 'Auto Eval') + ']\n';
  d += '  C --> D[' + (G ? 'ダッシュボード' : 'Dashboard') + ']\n';
  d += '  D --> A{' + (G ? 'アラート閾値?' : 'Alert threshold?') + '}\n';
  d += '  A -->|' + (G ? '超過' : 'Exceeded') + '| R[' + (G ? 'ロールバック' : 'Rollback') + ']\n';
  d += '  A -->|OK| O[' + (G ? '継続最適化' : 'Continuous Opt') + ']\n';
  d += '  O --> AB[A/B ' + (G ? 'テスト' : 'Test') + ']\n';
  d += '  AB --> P\n';
  d += '  style C fill:#4f46e5,color:#fff\n';
  d += '```\n';

  return d;
}

function gen72(G, domain, meth, matLv, a, pn) {
  var d = G ? '# [META]プロンプトレジストリ — ' + pn + '\n\n' : '# [META] Prompt Registry — ' + pn + '\n\n';
  d += G ? '> Template-ID管理・バージョニング・ドメイン別テンプレートカタログ。P17 docs/65との連携運用。\n\n' :
           '> Template-ID management, versioning, domain-specific template catalog. Operates with P17 docs/65.\n\n';

  // [META] template structure
  d += G ? '## 🧬 [META]テンプレート構造定義\n\n' : '## 🧬 [META] Template Structure Definition\n\n';
  d += G ? '> [META]ブロックは4層アーキテクチャのLayer 1（不変層）に対応します。\n\n' :
           '> The [META] block corresponds to Layer 1 (Immutable) in the 4-layer architecture.\n\n';
  d += '```\n[META]\nTemplate-ID: {DOMAIN}-{USECASE}-v{MAJOR}.{MINOR}.{PATCH}\nDomain: ' + domain + '\nUsecase: {specific-task}\nMaturity-Level: ' + matLv + '\nCRITERIA-Targets:\n  Context: {target}/5\n  Role: {target}/5\n  Instructions: {target}/5\n  Thought-Process: {target}/5\n  Execution-Rules: {target}/5\n  Reflection: {target}/5\n  Iteration: {target}/5\n  Adaptation: {target}/5\n  Total-Weighted: {target}/5\nVersion-History:\n  - v1.0.0: {initial creation}\n  - v1.1.0: {improvement note}\nRegistry-Path: docs/72_prompt_registry.md\nRef-Genome: docs/65_prompt_genome.md\n[/META]\n```\n\n';

  // Template-ID naming convention
  d += G ? '## 📋 Template-ID 命名規則\n\n' : '## 📋 Template-ID Naming Convention\n\n';
  d += G ? '```\n{DOMAIN}-{PHASE}-{USECASE}-v{MAJOR}.{MINOR}.{PATCH}\n例: ' + domain.toUpperCase() + '-P2-IMPLEMENT-v1.2.0\n    ' + domain.toUpperCase() + '-P4-REVIEW-v2.0.0\n    ' + domain.toUpperCase() + '-P5-DEPLOY-v1.0.3\n```\n\n' :
           '```\n{DOMAIN}-{PHASE}-{USECASE}-v{MAJOR}.{MINOR}.{PATCH}\nExample: ' + domain.toUpperCase() + '-P2-IMPLEMENT-v1.2.0\n         ' + domain.toUpperCase() + '-P4-REVIEW-v2.0.0\n         ' + domain.toUpperCase() + '-P5-DEPLOY-v1.0.3\n```\n\n';

  // Domain-specific template catalog
  d += G ? '## 📚 ' + domain + 'ドメイン テンプレートカタログ\n\n' :
           '## 📚 ' + domain + ' Domain Template Catalog\n\n';

  // Top 5 prompts for detected domain
  var domainTemplates = [];
  if (domain === 'fintech') {
    domainTemplates = G ? [
      {id: 'FINTECH-P1-RISK-DESIGN-v1.0.0', use: 'リスクエンジン設計', ctx: 5, inst: 5, er: 5, total: '4.8'},
      {id: 'FINTECH-P2-TRANSACTION-v1.2.0', use: '取引フロー実装', ctx: 5, inst: 5, er: 5, total: '4.7'},
      {id: 'FINTECH-P3-COMPLIANCE-v1.0.0', use: 'コンプライアンスチェック', ctx: 4, inst: 5, er: 5, total: '4.6'},
      {id: 'FINTECH-P4-AUDIT-v2.0.0', use: 'セキュリティ監査', ctx: 5, inst: 5, er: 5, total: '4.8'},
      {id: 'FINTECH-P5-INCIDENT-v1.0.0', use: 'インシデント対応', ctx: 4, inst: 4, er: 5, total: '4.4'}
    ] : [
      {id: 'FINTECH-P1-RISK-DESIGN-v1.0.0', use: 'Risk engine design', ctx: 5, inst: 5, er: 5, total: '4.8'},
      {id: 'FINTECH-P2-TRANSACTION-v1.2.0', use: 'Transaction flow implementation', ctx: 5, inst: 5, er: 5, total: '4.7'},
      {id: 'FINTECH-P3-COMPLIANCE-v1.0.0', use: 'Compliance check', ctx: 4, inst: 5, er: 5, total: '4.6'},
      {id: 'FINTECH-P4-AUDIT-v2.0.0', use: 'Security audit', ctx: 5, inst: 5, er: 5, total: '4.8'},
      {id: 'FINTECH-P5-INCIDENT-v1.0.0', use: 'Incident response', ctx: 4, inst: 4, er: 5, total: '4.4'}
    ];
  } else if (domain === 'education') {
    domainTemplates = G ? [
      {id: 'EDU-P1-CURRICULUM-v1.0.0', use: 'カリキュラム設計', ctx: 4, inst: 5, er: 4, total: '4.4'},
      {id: 'EDU-P2-LEARNING-FLOW-v1.1.0', use: '学習フロー実装', ctx: 5, inst: 5, er: 4, total: '4.6'},
      {id: 'EDU-P3-ASSESSMENT-v1.0.0', use: '評価・テスト設計', ctx: 4, inst: 5, er: 4, total: '4.4'},
      {id: 'EDU-P4-PROGRESS-v1.0.0', use: '進捗トラッキング', ctx: 4, inst: 4, er: 4, total: '4.2'},
      {id: 'EDU-P5-ENGAGEMENT-v1.0.0', use: 'エンゲージメント改善', ctx: 5, inst: 4, er: 3, total: '4.1'}
    ] : [
      {id: 'EDU-P1-CURRICULUM-v1.0.0', use: 'Curriculum design', ctx: 4, inst: 5, er: 4, total: '4.4'},
      {id: 'EDU-P2-LEARNING-FLOW-v1.1.0', use: 'Learning flow implementation', ctx: 5, inst: 5, er: 4, total: '4.6'},
      {id: 'EDU-P3-ASSESSMENT-v1.0.0', use: 'Assessment & test design', ctx: 4, inst: 5, er: 4, total: '4.4'},
      {id: 'EDU-P4-PROGRESS-v1.0.0', use: 'Progress tracking', ctx: 4, inst: 4, er: 4, total: '4.2'},
      {id: 'EDU-P5-ENGAGEMENT-v1.0.0', use: 'Engagement improvement', ctx: 5, inst: 4, er: 3, total: '4.1'}
    ];
  } else {
    // Generic domain templates
    var domUpper = domain.substring(0, 4).toUpperCase();
    domainTemplates = G ? [
      {id: domUpper + '-P1-DESIGN-v1.0.0', use: 'アーキテクチャ設計', ctx: 5, inst: 5, er: 4, total: '4.6'},
      {id: domUpper + '-P2-IMPLEMENT-v1.0.0', use: 'コア機能実装', ctx: 5, inst: 5, er: 5, total: '4.7'},
      {id: domUpper + '-P3-TEST-v1.0.0', use: 'テスト戦略', ctx: 4, inst: 5, er: 4, total: '4.4'},
      {id: domUpper + '-P4-REVIEW-v1.0.0', use: 'コードレビュー', ctx: 4, inst: 4, er: 5, total: '4.3'},
      {id: domUpper + '-P5-DEPLOY-v1.0.0', use: 'デプロイ・運用', ctx: 4, inst: 4, er: 5, total: '4.3'}
    ] : [
      {id: domUpper + '-P1-DESIGN-v1.0.0', use: 'Architecture design', ctx: 5, inst: 5, er: 4, total: '4.6'},
      {id: domUpper + '-P2-IMPLEMENT-v1.0.0', use: 'Core feature implementation', ctx: 5, inst: 5, er: 5, total: '4.7'},
      {id: domUpper + '-P3-TEST-v1.0.0', use: 'Test strategy', ctx: 4, inst: 5, er: 4, total: '4.4'},
      {id: domUpper + '-P4-REVIEW-v1.0.0', use: 'Code review', ctx: 4, inst: 4, er: 5, total: '4.3'},
      {id: domUpper + '-P5-DEPLOY-v1.0.0', use: 'Deploy & operations', ctx: 4, inst: 4, er: 5, total: '4.3'}
    ];
  }

  d += G ? '| Template-ID | ユースケース | Context | Instructions | Exec.Rules | 総合 |\n|-------------|------------|---------|-------------|-----------|------|\n' :
           '| Template-ID | Usecase | Context | Instructions | Exec.Rules | Total |\n|-------------|---------|---------|-------------|-----------|-------|\n';
  domainTemplates.forEach(function(t) {
    d += '| `' + t.id + '` | ' + t.use + ' | ' + t.ctx + '/5 | ' + t.inst + '/5 | ' + t.er + '/5 | **' + t.total + '/5** |\n';
  });
  d += '\n';

  // Version history format
  d += G ? '## 📝 バージョン履歴フォーマット\n\n' : '## 📝 Version History Format\n\n';
  d += G ? '```markdown\n## CHANGELOG — {Template-ID}\n\n### v1.1.0 — {date}\n- **改善**: Instructionsブロックに禁止事項5条を追加 (+0.5 CRITERIA)\n- **測定**: 成功率 72% → 85% (+13%)\n- **理由**: テスト5件中3件でルール違反が検出されたため\n\n### v1.0.0 — {date}\n- **初回**: 基本テンプレート作成\n- **CRITERIA**: Context=4, Instructions=4, ExecRules=3, Total=3.8\n```\n\n' :
           '```markdown\n## CHANGELOG — {Template-ID}\n\n### v1.1.0 — {date}\n- **Improvement**: Added 5 prohibition rules to Instructions block (+0.5 CRITERIA)\n- **Measurement**: Success rate 72% → 85% (+13%)\n- **Reason**: Rule violations detected in 3/5 test cases\n\n### v1.0.0 — {date}\n- **Initial**: Basic template creation\n- **CRITERIA**: Context=4, Instructions=4, ExecRules=3, Total=3.8\n```\n\n';

  // Cross-reference
  d += G ? '## 🔗 クロスリファレンス\n\n' : '## 🔗 Cross-Reference\n\n';
  d += G ? '| ドキュメント | 関係性 |\n|------------|--------|\n' :
           '| Document | Relationship |\n|----------|-------------|\n';
  d += G ? '| docs/65_prompt_genome.md | プロンプトDNA設計 → このRegistryで運用化 |\n' :
           '| docs/65_prompt_genome.md | Prompt DNA design → operationalized in this Registry |\n';
  d += G ? '| docs/66_ai_maturity_assessment.md | 成熟度Level ' + matLv + ' → スタック選定に反映 |\n' :
           '| docs/66_ai_maturity_assessment.md | Maturity Level ' + matLv + ' → reflected in stack selection |\n';
  d += G ? '| docs/69_prompt_ops_pipeline.md | Lifecycle管理 → RegistryのDeploy/Monitorステージと連携 |\n' :
           '| docs/69_prompt_ops_pipeline.md | Lifecycle management → linked with Registry Deploy/Monitor stages |\n';
  d += G ? '| docs/71_llmops_dashboard.md | メトリクス収集 → Registryのパフォーマンストラッキング |\n' :
           '| docs/71_llmops_dashboard.md | Metrics collection → Registry performance tracking |\n';
  d += '\n';

  // Mermaid registry architecture
  d += '```mermaid\n';
  d += 'graph TD\n';
  d += '  G65[docs/65<br/>Prompt Genome] -->|' + (G ? 'DNA設計' : 'DNA Design') + '| R[' + (G ? 'Registryに登録' : 'Register in Registry') + ']\n';
  d += '  R --> V[' + (G ? 'バージョン管理' : 'Version Control') + ']\n';
  d += '  V --> D[' + (G ? 'デプロイ' : 'Deploy') + ']\n';
  d += '  D --> M[docs/71<br/>LLMOps ' + (G ? '監視' : 'Monitor') + ']\n';
  d += '  M -->|' + (G ? '品質低下' : 'Degradation') + '| G65\n';
  d += '  D --> P[docs/69<br/>Pipeline]\n';
  d += '  style R fill:#4f46e5,color:#fff\n';
  d += '```\n';

  return d;
}

function genPillar18_PromptOps(a, pn) {
  var G = S.genLang === 'ja';
  var domain = detectDomain(a.purpose || '') || 'saas';
  var meth = DEV_METHODOLOGY_MAP[domain] || DEV_METHODOLOGY_MAP._default;
  var aiAuto = a.ai_auto || '';
  var matLv = /自律|orch|autonomous/i.test(aiAuto) ? 3 :
              /マルチ|multi|full/i.test(aiAuto) ? 2 : 1;
  S.files['docs/69_prompt_ops_pipeline.md'] = gen69(G, domain, meth, matLv, a, pn);
  S.files['docs/70_react_workflow.md'] = gen70(G, domain, matLv, a, pn);
  S.files['docs/71_llmops_dashboard.md'] = gen71(G, matLv, a, pn);
  S.files['docs/72_prompt_registry.md'] = gen72(G, domain, meth, matLv, a, pn);
}
