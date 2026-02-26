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
  d += '  D["' + (G ? '起草' : 'Draft') + '"] -->|CRITERIA≥3| R["' + (G ? 'レビュー' : 'Review') + '"]\n';
  d += '  R -->|' + (G ? 'スコア≥3.5' : 'Score≥3.5') + '| T["' + (G ? 'テスト' : 'Test') + '"]\n';
  d += '  R -->|' + (G ? '不合格' : 'Fail') + '| D\n';
  d += '  T -->|A/B' + (G ? '勝利' : ' Win') + '| P["' + (G ? 'デプロイ' : 'Deploy') + '"]\n';
  d += '  T -->|' + (G ? '不合格' : 'Fail') + '| D\n';
  d += '  P -->|10%→50%→100%| M["' + (G ? '監視' : 'Monitor') + '"]\n';
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
  d += '  S["' + (G ? '開始' : 'Start') + '"] --> R["Reason"]\n';
  d += '  R --> A["Act"]\n';
  d += '  A --> O["Observe"]\n';
  d += '  O --> V{"Verify"}\n';
  d += '  V -->|' + (G ? '成功' : 'Pass') + '| N["' + (G ? '次フェーズ' : 'Next Phase') + '"]\n';
  d += '  V -->|' + (G ? '失敗 iter<3' : 'Fail iter<3') + '| R\n';
  d += '  V -->|' + (G ? '失敗 iter=3' : 'Fail iter=3') + '| E["' + (G ? 'エスカレーション' : 'Escalate') + '"]\n';
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
  d += '  P["' + (G ? 'プロンプト実行' : 'Prompt Execution') + '"] --> T["' + (G ? 'トレーシング' : 'Tracing') + '"]\n';
  d += '  T --> C["CRITERIA ' + (G ? '自動評価' : 'Auto Eval') + '"]\n';
  d += '  C --> D["' + (G ? 'ダッシュボード' : 'Dashboard') + '"]\n';
  d += '  D --> A{"' + (G ? 'アラート閾値?' : 'Alert threshold?') + '"}\n';
  d += '  A -->|' + (G ? '超過' : 'Exceeded') + '| R["' + (G ? 'ロールバック' : 'Rollback') + '"]\n';
  d += '  A -->|OK| O["' + (G ? '継続最適化' : 'Continuous Opt') + '"]\n';
  d += '  O --> AB["A/B ' + (G ? 'テスト' : 'Test') + '"]\n';
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
  } else if (domain === 'health') {
    domainTemplates = G ? [
      {id:'HEALTH-P1-PHI-DESIGN-v1.0.0',use:'PHI設計・暗号化',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'HEALTH-P2-APPOINTMENT-v1.0.0',use:'予約フロー実装',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'HEALTH-P3-COMPLIANCE-v1.0.0',use:'HIPAA準拠チェック',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'HEALTH-P4-AUDIT-v1.0.0',use:'アクセス監査ログ設計',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'HEALTH-P5-INTEROP-v1.0.0',use:'電子カルテ連携',ctx:4,inst:4,er:4,total:'4.3'}
    ]:[
      {id:'HEALTH-P1-PHI-DESIGN-v1.0.0',use:'PHI design & encryption',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'HEALTH-P2-APPOINTMENT-v1.0.0',use:'Appointment flow implementation',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'HEALTH-P3-COMPLIANCE-v1.0.0',use:'HIPAA compliance check',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'HEALTH-P4-AUDIT-v1.0.0',use:'Access audit log design',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'HEALTH-P5-INTEROP-v1.0.0',use:'EHR integration',ctx:4,inst:4,er:4,total:'4.3'}
    ];
  } else if (domain === 'saas') {
    domainTemplates = G ? [
      {id:'SAAS-P1-ONBOARD-v1.0.0',use:'オンボーディング設計',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'SAAS-P2-MULTITENANT-v1.1.0',use:'マルチテナント実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'SAAS-P3-BILLING-v1.0.0',use:'課金・プラン設計',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'SAAS-P4-CHURN-v1.0.0',use:'チャーン予測・対策',ctx:5,inst:4,er:4,total:'4.4'},
      {id:'SAAS-P5-SCALE-v1.0.0',use:'スケーリング戦略',ctx:4,inst:5,er:4,total:'4.4'}
    ]:[
      {id:'SAAS-P1-ONBOARD-v1.0.0',use:'Onboarding design',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'SAAS-P2-MULTITENANT-v1.1.0',use:'Multi-tenant implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'SAAS-P3-BILLING-v1.0.0',use:'Billing & plan design',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'SAAS-P4-CHURN-v1.0.0',use:'Churn prediction & prevention',ctx:5,inst:4,er:4,total:'4.4'},
      {id:'SAAS-P5-SCALE-v1.0.0',use:'Scaling strategy',ctx:4,inst:5,er:4,total:'4.4'}
    ];
  } else if (domain === 'ai') {
    domainTemplates = G ? [
      {id:'AI-P1-PROMPT-DESIGN-v1.0.0',use:'プロンプト設計・最適化',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'AI-P2-RAG-IMPL-v1.1.0',use:'RAGシステム実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AI-P3-HALLUCINATION-v1.0.0',use:'幻覚検知・対策',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AI-P4-EVAL-v1.0.0',use:'AI応答品質評価',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'AI-P5-SAFETY-v1.0.0',use:'AIセーフティ設計',ctx:5,inst:5,er:5,total:'4.8'}
    ]:[
      {id:'AI-P1-PROMPT-DESIGN-v1.0.0',use:'Prompt design & optimization',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'AI-P2-RAG-IMPL-v1.1.0',use:'RAG system implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AI-P3-HALLUCINATION-v1.0.0',use:'Hallucination detection & prevention',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AI-P4-EVAL-v1.0.0',use:'AI response quality evaluation',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'AI-P5-SAFETY-v1.0.0',use:'AI safety design',ctx:5,inst:5,er:5,total:'4.8'}
    ];
  } else if (domain === 'ec') {
    domainTemplates = G ? [
      {id:'EC-P1-CART-DESIGN-v1.0.0',use:'カート・決済設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'EC-P2-INVENTORY-v1.0.0',use:'在庫管理実装',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'EC-P3-RECOMMEND-v1.0.0',use:'レコメンドエンジン',ctx:4,inst:5,er:4,total:'4.4'},
      {id:'EC-P4-SEO-v1.0.0',use:'SEO・商品ページ最適化',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'EC-P5-ABANDON-v1.0.0',use:'カゴ落ち対策',ctx:5,inst:4,er:4,total:'4.4'}
    ]:[
      {id:'EC-P1-CART-DESIGN-v1.0.0',use:'Cart & checkout design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'EC-P2-INVENTORY-v1.0.0',use:'Inventory management implementation',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'EC-P3-RECOMMEND-v1.0.0',use:'Recommendation engine',ctx:4,inst:5,er:4,total:'4.4'},
      {id:'EC-P4-SEO-v1.0.0',use:'SEO & product page optimization',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'EC-P5-ABANDON-v1.0.0',use:'Cart abandonment prevention',ctx:5,inst:4,er:4,total:'4.4'}
    ];
  } else if (domain === 'marketplace') {
    domainTemplates = G ? [
      {id:'MKT-P1-ESCROW-v1.0.0',use:'エスクロー決済設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MKT-P2-MATCHING-v1.0.0',use:'マッチングアルゴリズム',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MKT-P3-FRAUD-v1.0.0',use:'不正検知システム',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MKT-P4-REVIEW-v1.0.0',use:'評価システム設計',ctx:4,inst:4,er:4,total:'4.3'},
      {id:'MKT-P5-DISPUTE-v1.0.0',use:'紛争解決フロー',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'MKT-P1-ESCROW-v1.0.0',use:'Escrow payment design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MKT-P2-MATCHING-v1.0.0',use:'Matching algorithm',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MKT-P3-FRAUD-v1.0.0',use:'Fraud detection system',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MKT-P4-REVIEW-v1.0.0',use:'Review system design',ctx:4,inst:4,er:4,total:'4.3'},
      {id:'MKT-P5-DISPUTE-v1.0.0',use:'Dispute resolution flow',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'government') {
    domainTemplates = G ? [
      {id:'GOV-P1-A11Y-v1.0.0',use:'アクセシビリティ設計(JIS X 8341)',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'GOV-P2-EAPP-v1.0.0',use:'電子申請フロー実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'GOV-P3-AUDIT-v1.0.0',use:'監査証跡設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'GOV-P4-SECURITY-v1.0.0',use:'行政セキュリティ要件',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'GOV-P5-PRIVACY-v1.0.0',use:'個人情報保護設計',ctx:5,inst:5,er:5,total:'4.9'}
    ]:[
      {id:'GOV-P1-A11Y-v1.0.0',use:'Accessibility design (WCAG 2.2)',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'GOV-P2-EAPP-v1.0.0',use:'E-application flow implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'GOV-P3-AUDIT-v1.0.0',use:'Audit trail design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'GOV-P4-SECURITY-v1.0.0',use:'Government security requirements',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'GOV-P5-PRIVACY-v1.0.0',use:'Privacy protection design',ctx:5,inst:5,er:5,total:'4.9'}
    ];
  } else if (domain === 'insurance') {
    domainTemplates = G ? [
      {id:'INS-P1-QUOTE-v1.0.0',use:'見積算出ロジック設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'INS-P2-CLAIMS-v1.0.0',use:'クレーム処理フロー',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'INS-P3-FRAUD-v1.0.0',use:'不正請求検知',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'INS-P4-ACTUARIAL-v1.0.0',use:'保険数理ロジック実装',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'INS-P5-COMPLIANCE-v1.0.0',use:'保険業法コンプライアンス',ctx:5,inst:5,er:5,total:'4.9'}
    ]:[
      {id:'INS-P1-QUOTE-v1.0.0',use:'Quote calculation logic design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'INS-P2-CLAIMS-v1.0.0',use:'Claims processing flow',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'INS-P3-FRAUD-v1.0.0',use:'Fraudulent claims detection',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'INS-P4-ACTUARIAL-v1.0.0',use:'Actuarial logic implementation',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'INS-P5-COMPLIANCE-v1.0.0',use:'Insurance regulation compliance',ctx:5,inst:5,er:5,total:'4.9'}
    ];
  } else if (domain === 'booking') {
    domainTemplates = G ? [
      {id:'BKG-P1-AVAILABILITY-v1.0.0',use:'空き枠管理・競合制御',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'BKG-P2-PAYMENT-v1.0.0',use:'予約決済フロー実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'BKG-P3-CONFLICT-v1.0.0',use:'二重予約防止設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'BKG-P4-REMINDER-v1.0.0',use:'リマインダー通知設計',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'BKG-P5-CANCEL-v1.0.0',use:'キャンセルポリシー実装',ctx:4,inst:5,er:4,total:'4.4'}
    ]:[
      {id:'BKG-P1-AVAILABILITY-v1.0.0',use:'Availability management & conflict control',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'BKG-P2-PAYMENT-v1.0.0',use:'Booking payment flow implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'BKG-P3-CONFLICT-v1.0.0',use:'Double-booking prevention design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'BKG-P4-REMINDER-v1.0.0',use:'Reminder notification design',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'BKG-P5-CANCEL-v1.0.0',use:'Cancellation policy implementation',ctx:4,inst:5,er:4,total:'4.4'}
    ];
  } else if (domain === 'collab') {
    domainTemplates = G ? [
      {id:'COLLAB-P1-SYNC-v1.0.0',use:'リアルタイム同期設計(OT/CRDT)',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'COLLAB-P2-CONFLICT-v1.0.0',use:'競合解決ロジック実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COLLAB-P3-PERMISSION-v1.0.0',use:'権限管理・RBAc設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COLLAB-P4-VERSION-v1.0.0',use:'バージョン履歴管理',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'COLLAB-P5-PRESENCE-v1.0.0',use:'プレゼンス機能実装',ctx:4,inst:4,er:4,total:'4.2'}
    ]:[
      {id:'COLLAB-P1-SYNC-v1.0.0',use:'Real-time sync design (OT/CRDT)',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'COLLAB-P2-CONFLICT-v1.0.0',use:'Conflict resolution logic implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COLLAB-P3-PERMISSION-v1.0.0',use:'Permission management & RBAC design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COLLAB-P4-VERSION-v1.0.0',use:'Version history management',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'COLLAB-P5-PRESENCE-v1.0.0',use:'Presence feature implementation',ctx:4,inst:4,er:4,total:'4.2'}
    ];
  } else if (domain === 'hr') {
    domainTemplates = G ? [
      {id:'HR-P1-RECRUIT-v1.0.0',use:'採用フロー・ATS設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'HR-P2-ONBOARD-v1.0.0',use:'オンボーディング自動化',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'HR-P3-EVAL-v1.0.0',use:'人事評価システム設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'HR-P4-PAYROLL-v1.0.0',use:'給与計算ロジック実装',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'HR-P5-OFFBOARD-v1.0.0',use:'退職手続きワークフロー',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'HR-P1-RECRUIT-v1.0.0',use:'Recruiting flow & ATS design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'HR-P2-ONBOARD-v1.0.0',use:'Onboarding automation',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'HR-P3-EVAL-v1.0.0',use:'Performance evaluation system design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'HR-P4-PAYROLL-v1.0.0',use:'Payroll calculation logic implementation',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'HR-P5-OFFBOARD-v1.0.0',use:'Offboarding workflow',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'analytics') {
    domainTemplates = G ? [
      {id:'ANLYT-P1-DASHBOARD-v1.0.0',use:'ダッシュボード設計・最適化',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'ANLYT-P2-KPI-v1.0.0',use:'KPI集計ロジック実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ANLYT-P3-REALTIME-v1.0.0',use:'リアルタイムデータ処理',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ANLYT-P4-REPORT-v1.0.0',use:'レポート自動生成設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'ANLYT-P5-PREDICT-v1.0.0',use:'予測分析・MLパイプライン',ctx:5,inst:5,er:4,total:'4.7'}
    ]:[
      {id:'ANLYT-P1-DASHBOARD-v1.0.0',use:'Dashboard design & optimization',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'ANLYT-P2-KPI-v1.0.0',use:'KPI aggregation logic implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ANLYT-P3-REALTIME-v1.0.0',use:'Real-time data processing',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ANLYT-P4-REPORT-v1.0.0',use:'Automated report generation design',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'ANLYT-P5-PREDICT-v1.0.0',use:'Predictive analytics & ML pipeline',ctx:5,inst:5,er:4,total:'4.7'}
    ];
  } else if (domain === 'community') {
    domainTemplates = G ? [
      {id:'COMM-P1-MODERATE-v1.0.0',use:'モデレーション・通報設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COMM-P2-ENGAGE-v1.0.0',use:'エンゲージメント機能実装',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'COMM-P3-SPAM-v1.0.0',use:'スパム・不正アカウント対策',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COMM-P4-NOTIFY-v1.0.0',use:'通知システム設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'COMM-P5-GROWTH-v1.0.0',use:'コミュニティ成長戦略',ctx:5,inst:4,er:3,total:'4.1'}
    ]:[
      {id:'COMM-P1-MODERATE-v1.0.0',use:'Moderation & reporting design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COMM-P2-ENGAGE-v1.0.0',use:'Engagement feature implementation',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'COMM-P3-SPAM-v1.0.0',use:'Spam & fake account prevention',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'COMM-P4-NOTIFY-v1.0.0',use:'Notification system design',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'COMM-P5-GROWTH-v1.0.0',use:'Community growth strategy',ctx:5,inst:4,er:3,total:'4.1'}
    ];
  } else if (domain === 'iot') {
    domainTemplates = G ? [
      {id:'IOT-P1-DEVICE-v1.0.0',use:'デバイス認証・管理設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'IOT-P2-DATA-v1.0.0',use:'センサーデータ収集・処理',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'IOT-P3-ALERT-v1.0.0',use:'異常検知・アラート設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'IOT-P4-UPDATE-v1.0.0',use:'OTAアップデート実装',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'IOT-P5-OFFLINE-v1.0.0',use:'オフライン動作・再接続処理',ctx:5,inst:5,er:4,total:'4.7'}
    ]:[
      {id:'IOT-P1-DEVICE-v1.0.0',use:'Device authentication & management design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'IOT-P2-DATA-v1.0.0',use:'Sensor data collection & processing',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'IOT-P3-ALERT-v1.0.0',use:'Anomaly detection & alert design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'IOT-P4-UPDATE-v1.0.0',use:'OTA update implementation',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'IOT-P5-OFFLINE-v1.0.0',use:'Offline operation & reconnection handling',ctx:5,inst:5,er:4,total:'4.7'}
    ];
  } else if (domain === 'creator') {
    domainTemplates = G ? [
      {id:'CRT-P1-MONETIZE-v1.0.0',use:'収益化・サブスク設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CRT-P2-CONTENT-v1.0.0',use:'コンテンツ管理・DRM設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CRT-P3-PAYOUT-v1.0.0',use:'クリエイターペイアウト実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CRT-P4-ENGAGE-v1.0.0',use:'ファンエンゲージメント機能',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'CRT-P5-ANALYTICS-v1.0.0',use:'収益・視聴統計分析',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'CRT-P1-MONETIZE-v1.0.0',use:'Monetization & subscription design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CRT-P2-CONTENT-v1.0.0',use:'Content management & DRM design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CRT-P3-PAYOUT-v1.0.0',use:'Creator payout implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CRT-P4-ENGAGE-v1.0.0',use:'Fan engagement features',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'CRT-P5-ANALYTICS-v1.0.0',use:'Revenue & view analytics',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'gamify') {
    domainTemplates = G ? [
      {id:'GMF-P1-POINT-v1.0.0',use:'ポイント・不正防止設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'GMF-P2-LEADERBOARD-v1.0.0',use:'リアルタイムランキング実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'GMF-P3-BADGE-v1.0.0',use:'バッジ・実績システム設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'GMF-P4-STREAK-v1.0.0',use:'ストリーク・習慣化機能',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'GMF-P5-BALANCE-v1.0.0',use:'ゲームバランス調整設計',ctx:5,inst:5,er:4,total:'4.7'}
    ]:[
      {id:'GMF-P1-POINT-v1.0.0',use:'Points & anti-fraud design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'GMF-P2-LEADERBOARD-v1.0.0',use:'Real-time leaderboard implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'GMF-P3-BADGE-v1.0.0',use:'Badge & achievement system design',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'GMF-P4-STREAK-v1.0.0',use:'Streak & habit-forming features',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'GMF-P5-BALANCE-v1.0.0',use:'Game balance tuning design',ctx:5,inst:5,er:4,total:'4.7'}
    ];
  } else if (domain === 'media') {
    domainTemplates = G ? [
      {id:'MEDIA-P1-STREAM-v1.0.0',use:'ストリーミング配信設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MEDIA-P2-CDN-v1.0.0',use:'CDN最適化・コンテンツ配信',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MEDIA-P3-DRM-v1.0.0',use:'DRM・コンテンツ保護設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MEDIA-P4-RECOMMEND-v1.0.0',use:'コンテンツレコメンド設計',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MEDIA-P5-TRANSCODE-v1.0.0',use:'動画トランスコード実装',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'MEDIA-P1-STREAM-v1.0.0',use:'Streaming delivery design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MEDIA-P2-CDN-v1.0.0',use:'CDN optimization & content delivery',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MEDIA-P3-DRM-v1.0.0',use:'DRM & content protection design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MEDIA-P4-RECOMMEND-v1.0.0',use:'Content recommendation design',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MEDIA-P5-TRANSCODE-v1.0.0',use:'Video transcoding implementation',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'content') {
    domainTemplates = G ? [
      {id:'CONT-P1-CMS-v1.0.0',use:'CMS設計・ヘッドレス構成',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'CONT-P2-SEARCH-v1.0.0',use:'全文検索・タグ設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CONT-P3-WORKFLOW-v1.0.0',use:'コンテンツワークフロー管理',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'CONT-P4-SEO-v1.0.0',use:'SEO・メタタグ最適化',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'CONT-P5-VERSION-v1.0.0',use:'バージョン管理・下書き設計',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'CONT-P1-CMS-v1.0.0',use:'CMS design & headless configuration',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'CONT-P2-SEARCH-v1.0.0',use:'Full-text search & tag design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'CONT-P3-WORKFLOW-v1.0.0',use:'Content workflow management',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'CONT-P4-SEO-v1.0.0',use:'SEO & meta tag optimization',ctx:4,inst:4,er:4,total:'4.2'},
      {id:'CONT-P5-VERSION-v1.0.0',use:'Version control & draft design',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'realestate') {
    domainTemplates = G ? [
      {id:'RE-P1-LISTING-v1.0.0',use:'物件掲載・検索設計',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'RE-P2-CONTRACT-v1.0.0',use:'契約・更新管理フロー',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'RE-P3-VIEWING-v1.0.0',use:'内見予約システム設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'RE-P4-PAYMENT-v1.0.0',use:'賃貸・決済フロー実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'RE-P5-REPORT-v1.0.0',use:'収益・修繕レポート設計',ctx:4,inst:4,er:4,total:'4.2'}
    ]:[
      {id:'RE-P1-LISTING-v1.0.0',use:'Property listing & search design',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'RE-P2-CONTRACT-v1.0.0',use:'Contract & renewal management flow',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'RE-P3-VIEWING-v1.0.0',use:'Property viewing booking system',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'RE-P4-PAYMENT-v1.0.0',use:'Rental payment flow implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'RE-P5-REPORT-v1.0.0',use:'Revenue & maintenance report design',ctx:4,inst:4,er:4,total:'4.2'}
    ];
  } else if (domain === 'legal') {
    domainTemplates = G ? [
      {id:'LEGAL-P1-REVIEW-v1.0.0',use:'契約書レビュー設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'LEGAL-P2-ESIGN-v1.0.0',use:'電子署名連携実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LEGAL-P3-CASE-v1.0.0',use:'案件管理ワークフロー',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LEGAL-P4-SEARCH-v1.0.0',use:'法令・判例検索設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'LEGAL-P5-BILLING-v1.0.0',use:'タイムビリング・請求設計',ctx:4,inst:5,er:5,total:'4.6'}
    ]:[
      {id:'LEGAL-P1-REVIEW-v1.0.0',use:'Contract review design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'LEGAL-P2-ESIGN-v1.0.0',use:'E-signature integration implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LEGAL-P3-CASE-v1.0.0',use:'Case management workflow',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LEGAL-P4-SEARCH-v1.0.0',use:'Legal & case law search design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'LEGAL-P5-BILLING-v1.0.0',use:'Time billing & invoicing design',ctx:4,inst:5,er:5,total:'4.6'}
    ];
  } else if (domain === 'automation') {
    domainTemplates = G ? [
      {id:'AUTO-P1-TRIGGER-v1.0.0',use:'トリガー・条件設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AUTO-P2-STEP-v1.0.0',use:'ステップ実行エンジン実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AUTO-P3-RETRY-v1.0.0',use:'エラーリトライ・冪等性設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'AUTO-P4-MONITOR-v1.0.0',use:'ワークフロー監視・ログ設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'AUTO-P5-SCALE-v1.0.0',use:'並列実行・スケール設計',ctx:5,inst:5,er:4,total:'4.7'}
    ]:[
      {id:'AUTO-P1-TRIGGER-v1.0.0',use:'Trigger & condition design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AUTO-P2-STEP-v1.0.0',use:'Step execution engine implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AUTO-P3-RETRY-v1.0.0',use:'Error retry & idempotency design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'AUTO-P4-MONITOR-v1.0.0',use:'Workflow monitoring & log design',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'AUTO-P5-SCALE-v1.0.0',use:'Parallel execution & scale design',ctx:5,inst:5,er:4,total:'4.7'}
    ];
  } else if (domain === 'event') {
    domainTemplates = G ? [
      {id:'EVT-P1-TICKET-v1.0.0',use:'チケット発行・重複防止',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'EVT-P2-CAPACITY-v1.0.0',use:'キャパシティ管理設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'EVT-P3-CHECKIN-v1.0.0',use:'QRコードチェックイン実装',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'EVT-P4-REFUND-v1.0.0',use:'キャンセル・返金処理設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'EVT-P5-LIVE-v1.0.0',use:'ライブ配信連携実装',ctx:4,inst:4,er:4,total:'4.2'}
    ]:[
      {id:'EVT-P1-TICKET-v1.0.0',use:'Ticket issuance & duplicate prevention',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'EVT-P2-CAPACITY-v1.0.0',use:'Capacity management design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'EVT-P3-CHECKIN-v1.0.0',use:'QR code check-in implementation',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'EVT-P4-REFUND-v1.0.0',use:'Cancellation & refund handling design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'EVT-P5-LIVE-v1.0.0',use:'Live streaming integration',ctx:4,inst:4,er:4,total:'4.2'}
    ];
  } else if (domain === 'devtool') {
    domainTemplates = G ? [
      {id:'DEVT-P1-API-v1.0.0',use:'APIキー発行・スコープ設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'DEVT-P2-WEBHOOK-v1.0.0',use:'Webhookシグネチャ・配信設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'DEVT-P3-SDK-v1.0.0',use:'SDK設計・ドキュメント生成',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'DEVT-P4-RATELIMIT-v1.0.0',use:'レート制限・使用量課金設計',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'DEVT-P5-DEBUG-v1.0.0',use:'デバッグ・ログ・トレース設計',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'DEVT-P1-API-v1.0.0',use:'API key issuance & scope design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'DEVT-P2-WEBHOOK-v1.0.0',use:'Webhook signature & delivery design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'DEVT-P3-SDK-v1.0.0',use:'SDK design & doc generation',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'DEVT-P4-RATELIMIT-v1.0.0',use:'Rate limiting & usage billing design',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'DEVT-P5-DEBUG-v1.0.0',use:'Debug, logging & trace design',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'newsletter') {
    domainTemplates = G ? [
      {id:'NEWS-P1-SEND-v1.0.0',use:'メール配信・レート制限設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'NEWS-P2-SEGMENT-v1.0.0',use:'セグメント配信設計',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'NEWS-P3-TRACK-v1.0.0',use:'開封率・CTR追跡実装',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'NEWS-P4-BOUNCE-v1.0.0',use:'バウンス・スパム対策設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'NEWS-P5-UNSUB-v1.0.0',use:'配信停止・コンプライアンス設計',ctx:5,inst:5,er:5,total:'4.9'}
    ]:[
      {id:'NEWS-P1-SEND-v1.0.0',use:'Email send & rate limit design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'NEWS-P2-SEGMENT-v1.0.0',use:'Segment delivery design',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'NEWS-P3-TRACK-v1.0.0',use:'Open rate & CTR tracking implementation',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'NEWS-P4-BOUNCE-v1.0.0',use:'Bounce & spam prevention design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'NEWS-P5-UNSUB-v1.0.0',use:'Unsubscribe & CAN-SPAM compliance design',ctx:5,inst:5,er:5,total:'4.9'}
    ];
  } else if (domain === 'manufacturing') {
    domainTemplates = G ? [
      {id:'MFG-P1-MES-v1.0.0',use:'MES連携・生産管理設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MFG-P2-QC-v1.0.0',use:'品質管理・検査記録設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MFG-P3-SUPPLY-v1.0.0',use:'サプライチェーン可視化実装',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MFG-P4-OEE-v1.0.0',use:'OEE計測・設備効率化設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'MFG-P5-TRACE-v1.0.0',use:'トレーサビリティ・ロット管理',ctx:5,inst:5,er:5,total:'4.8'}
    ]:[
      {id:'MFG-P1-MES-v1.0.0',use:'MES integration & production management design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MFG-P2-QC-v1.0.0',use:'Quality control & inspection records design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'MFG-P3-SUPPLY-v1.0.0',use:'Supply chain visibility implementation',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'MFG-P4-OEE-v1.0.0',use:'OEE measurement & equipment efficiency design',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'MFG-P5-TRACE-v1.0.0',use:'Traceability & lot management',ctx:5,inst:5,er:5,total:'4.8'}
    ];
  } else if (domain === 'logistics') {
    domainTemplates = G ? [
      {id:'LOGI-P1-TRACK-v1.0.0',use:'リアルタイム追跡設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LOGI-P2-ROUTE-v1.0.0',use:'ルート最適化アルゴリズム',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LOGI-P3-STATUS-v1.0.0',use:'配送ステータス管理設計',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'LOGI-P4-POD-v1.0.0',use:'配送証明(POD)設計',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'LOGI-P5-RETURN-v1.0.0',use:'返品・逆物流フロー設計',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'LOGI-P1-TRACK-v1.0.0',use:'Real-time tracking design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LOGI-P2-ROUTE-v1.0.0',use:'Route optimization algorithm',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'LOGI-P3-STATUS-v1.0.0',use:'Delivery status management design',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'LOGI-P4-POD-v1.0.0',use:'Proof of delivery (POD) design',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'LOGI-P5-RETURN-v1.0.0',use:'Returns & reverse logistics flow design',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'agriculture') {
    domainTemplates = G ? [
      {id:'AGRI-P1-SENSOR-v1.0.0',use:'センサーデータ収集・処理設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AGRI-P2-FORECAST-v1.0.0',use:'収穫予測・気象データ連携',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'AGRI-P3-RECORD-v1.0.0',use:'農薬・肥料記録管理設計',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'AGRI-P4-TRACE-v1.0.0',use:'農産物トレーサビリティ設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AGRI-P5-IOT-v1.0.0',use:'農業IoT・自動化設計',ctx:5,inst:5,er:4,total:'4.7'}
    ]:[
      {id:'AGRI-P1-SENSOR-v1.0.0',use:'Sensor data collection & processing design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AGRI-P2-FORECAST-v1.0.0',use:'Harvest forecasting & weather data integration',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'AGRI-P3-RECORD-v1.0.0',use:'Pesticide & fertilizer record management design',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'AGRI-P4-TRACE-v1.0.0',use:'Agricultural product traceability design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'AGRI-P5-IOT-v1.0.0',use:'Farm IoT & automation design',ctx:5,inst:5,er:4,total:'4.7'}
    ];
  } else if (domain === 'energy') {
    domainTemplates = G ? [
      {id:'ENRG-P1-MONITOR-v1.0.0',use:'電力モニタリング設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ENRG-P2-PEAK-v1.0.0',use:'ピーク需要管理設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ENRG-P3-BILLING-v1.0.0',use:'電力請求・計量設計',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'ENRG-P4-GRID-v1.0.0',use:'スマートグリッド連携実装',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'ENRG-P5-RENEW-v1.0.0',use:'再生可能エネルギー管理',ctx:4,inst:5,er:4,total:'4.5'}
    ]:[
      {id:'ENRG-P1-MONITOR-v1.0.0',use:'Power monitoring design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ENRG-P2-PEAK-v1.0.0',use:'Peak demand management design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'ENRG-P3-BILLING-v1.0.0',use:'Power billing & metering design',ctx:5,inst:5,er:5,total:'4.9'},
      {id:'ENRG-P4-GRID-v1.0.0',use:'Smart grid integration implementation',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'ENRG-P5-RENEW-v1.0.0',use:'Renewable energy management',ctx:4,inst:5,er:4,total:'4.5'}
    ];
  } else if (domain === 'travel') {
    domainTemplates = G ? [
      {id:'TRVL-P1-SEARCH-v1.0.0',use:'在庫・空き室検索設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TRVL-P2-BOOK-v1.0.0',use:'予約フロー・決済実装',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TRVL-P3-MULTI-v1.0.0',use:'複数通貨・多言語対応設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'TRVL-P4-CANCEL-v1.0.0',use:'キャンセルポリシー管理設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TRVL-P5-REVIEW-v1.0.0',use:'レビュー・評価システム設計',ctx:4,inst:4,er:4,total:'4.2'}
    ]:[
      {id:'TRVL-P1-SEARCH-v1.0.0',use:'Inventory & availability search design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TRVL-P2-BOOK-v1.0.0',use:'Booking flow & payment implementation',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TRVL-P3-MULTI-v1.0.0',use:'Multi-currency & multilingual design',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'TRVL-P4-CANCEL-v1.0.0',use:'Cancellation policy management design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TRVL-P5-REVIEW-v1.0.0',use:'Review & rating system design',ctx:4,inst:4,er:4,total:'4.2'}
    ];
  } else if (domain === 'portfolio') {
    domainTemplates = G ? [
      {id:'PORT-P1-SEO-v1.0.0',use:'SEO・Core Web Vitals最適化',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'PORT-P2-DESIGN-v1.0.0',use:'レスポンシブデザイン実装',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'PORT-P3-CONTACT-v1.0.0',use:'問い合わせフォーム設計',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'PORT-P4-PERF-v1.0.0',use:'パフォーマンス最適化設計',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'PORT-P5-DEPLOY-v1.0.0',use:'静的サイトデプロイ設計',ctx:4,inst:4,er:4,total:'4.2'}
    ]:[
      {id:'PORT-P1-SEO-v1.0.0',use:'SEO & Core Web Vitals optimization',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'PORT-P2-DESIGN-v1.0.0',use:'Responsive design implementation',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'PORT-P3-CONTACT-v1.0.0',use:'Contact form design',ctx:4,inst:5,er:5,total:'4.6'},
      {id:'PORT-P4-PERF-v1.0.0',use:'Performance optimization design',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'PORT-P5-DEPLOY-v1.0.0',use:'Static site deployment design',ctx:4,inst:4,er:4,total:'4.2'}
    ];
  } else if (domain === 'tool') {
    domainTemplates = G ? [
      {id:'TOOL-P1-API-v1.0.0',use:'APIキー管理・レート制限設計',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TOOL-P2-UX-v1.0.0',use:'ツールUX・タスク完了フロー',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'TOOL-P3-DOCS-v1.0.0',use:'ドキュメント・使い方ガイド生成',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'TOOL-P4-MONITOR-v1.0.0',use:'使用量モニタリング設計',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'TOOL-P5-INTEG-v1.0.0',use:'外部サービス連携設計',ctx:5,inst:5,er:4,total:'4.7'}
    ]:[
      {id:'TOOL-P1-API-v1.0.0',use:'API key management & rate limit design',ctx:5,inst:5,er:5,total:'4.8'},
      {id:'TOOL-P2-UX-v1.0.0',use:'Tool UX & task completion flow',ctx:5,inst:5,er:4,total:'4.7'},
      {id:'TOOL-P3-DOCS-v1.0.0',use:'Documentation & usage guide generation',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'TOOL-P4-MONITOR-v1.0.0',use:'Usage monitoring design',ctx:4,inst:5,er:4,total:'4.5'},
      {id:'TOOL-P5-INTEG-v1.0.0',use:'External service integration design',ctx:5,inst:5,er:4,total:'4.7'}
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

  // Domain-specific prompt context notes from DOMAIN_IMPL_PATTERN
  var _g72pat = typeof DOMAIN_IMPL_PATTERN !== 'undefined' ? (DOMAIN_IMPL_PATTERN[domain] || null) : null;
  if(_g72pat && _g72pat.impl_ja && _g72pat.impl_ja.length > 0) {
    d += G ? '### 💡 ドメイン固有プロンプト文脈ノート (' + domain + ')\n\n' : '### 💡 Domain-Specific Prompt Context Notes (' + domain + ')\n\n';
    d += G ? '> P2-IMPLEMENT テンプレートのContextブロックに含めるべき業種固有知識:\n\n' :
             '> Domain-specific knowledge to include in the Context block of P2-IMPLEMENT template:\n\n';
    var _g72impl = G ? _g72pat.impl_ja : _g72pat.impl_en;
    _g72impl.forEach(function(imp){ d += '- ' + imp + '\n'; });
    d += '\n';
  }

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
  d += '  G65["docs/65<br/>Prompt Genome"] -->|' + (G ? 'DNA設計' : 'DNA Design') + '| R["' + (G ? 'Registryに登録' : 'Register in Registry') + '"]\n';
  d += '  R --> V["' + (G ? 'バージョン管理' : 'Version Control') + '"]\n';
  d += '  V --> D["' + (G ? 'デプロイ' : 'Deploy') + '"]\n';
  d += '  D --> M["docs/71<br/>LLMOps ' + (G ? '監視' : 'Monitor') + '"]\n';
  d += '  M -->|' + (G ? '品質低下' : 'Degradation') + '| G65\n';
  d += '  D --> P["docs/69<br/>Pipeline"]\n';
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
