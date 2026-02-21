// P17: Prompt Genome Engine
// Generates: docs/65_prompt_genome.md, 66_ai_maturity_assessment.md, 67_prompt_composition_guide.md, 68_prompt_kpi_dashboard.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

// CRITERIA_FRAMEWORK: 8-axis prompt quality scoring (total weight = 100)
function _cri(key, weight, rubric_ja, rubric_en, guide_ja, guide_en) {
  return { key, weight, rubric_ja, rubric_en, guide_ja, guide_en };
}
const CRITERIA_FRAMEWORK = [
  _cri('Context', 15,
    'コンテキスト設定', 'Context Setting',
    '1=文脈なし, 3=基本的な背景, 5=完全なプロジェクト文脈・ドメイン知識・制約条件を含む',
    '1=No context, 3=Basic background, 5=Full project context, domain knowledge, and constraints'),
  _cri('Role', 10,
    '役割定義', 'Role Definition',
    '1=役割なし, 3=一般的な役割, 5=具体的な専門スキル・経験年数・視点を明示した役割',
    '1=No role, 3=Generic role, 5=Specific expertise, years of experience, and perspective defined'),
  _cri('Instructions', 20,
    '指示の明確性', 'Instruction Clarity',
    '1=曖昧な指示, 3=ステップあり, 5=番号付き手順・成果物・制約・除外事項を含む詳細指示',
    '1=Vague instructions, 3=Has steps, 5=Numbered steps with deliverables, constraints, and exclusions'),
  _cri('Thought Process', 10,
    '思考プロセス要求', 'Thought Process Request',
    '1=要求なし, 3=考えてから答えて, 5=CoT/ToT/ReAct等の思考フレームワーク指定',
    '1=Not requested, 3=Think before answer, 5=CoT/ToT/ReAct or other thinking framework specified'),
  _cri('Execution Rules', 15,
    '実行ルール', 'Execution Rules',
    '1=ルールなし, 3=基本制約, 5=禁止事項・形式要件・品質基準を明示した実行ルール',
    '1=No rules, 3=Basic constraints, 5=Explicit prohibitions, format requirements, and quality standards'),
  _cri('Reflection', 10,
    '振り返り要求', 'Reflection Request',
    '1=なし, 3=最後に確認して, 5=自己批評→改善ループ(WSCI)の明示的指示',
    '1=None, 3=Review at end, 5=Explicit self-critique and improvement loop (WSCI) instructions'),
  _cri('Iteration', 10,
    'イテレーション設計', 'Iteration Design',
    '1=一回きり, 3=フィードバック可, 5=反復プロセス・評価基準・収束条件を設計済み',
    '1=One-shot, 3=Feedback possible, 5=Iterative process with evaluation criteria and convergence conditions'),
  _cri('Adaptation', 10,
    '適応性', 'Adaptation',
    '1=固定, 3=言語切替可, 5=コンテキスト・スキルレベル・出力形式を動的に適応',
    '1=Fixed, 3=Language switchable, 5=Dynamically adapts context, skill level, and output format')
];

// AI_MATURITY_MODEL: 3-level organizational AI maturity
function _mat(lv, label_ja, label_en, chars_ja, chars_en, pats_ja, pats_en, prac_ja, prac_en) {
  return { lv, label_ja, label_en, chars_ja, chars_en, pats_ja, pats_en, prac_ja, prac_en };
}
const AI_MATURITY_MODEL = [
  _mat(1, 'AI支援 (Assisted)', 'AI Assisted',
    'コード補完・コードレビュー限定、手動レビュー必須、個人ベースのAI活用',
    'Code completion and review only, mandatory manual review, individual-based AI usage',
    '定型テンプレート使用、CRITERIA準拠の基本プロンプト、単一AIとの対話',
    'Using standard templates, basic CRITERIA-compliant prompts, single AI interaction',
    'プロンプトライブラリ構築、成功例の共有、基本CRITERIA評価',
    'Build prompt library, share success cases, basic CRITERIA evaluation'),
  _mat(2, 'AI協調 (Augmented)', 'AI Augmented',
    'アーキテクチャ提案・設計レビュー、CRITERIA準拠プロンプト設計、チームでAI活用',
    'Architecture proposals and design reviews, CRITERIA-compliant prompt design, team-based AI usage',
    'マルチAgent協調パターン、反復改善ループ、文脈注入テンプレート',
    'Multi-agent coordination patterns, iterative improvement loops, context injection templates',
    'ペアプログラミング(人間+AI)、CRITERIA定期評価、チームプロンプト管理',
    'Pair programming (human+AI), regular CRITERIA evaluation, team prompt management'),
  _mat(3, 'AI自律 (Autonomous)', 'AI Autonomous',
    '自律実行・継続的改善、戦略判断のみ人間、組織全体でAI活用',
    'Autonomous execution and continuous improvement, humans for strategic decisions only, organization-wide AI usage',
    'ゲノム駆動プロンプト・自己進化、オーケストレーション設計、品質自動評価',
    'Genome-driven self-evolving prompts, orchestration design, automated quality evaluation',
    'AIオーケストレーション、プロンプトCI/CD、効果自動測定・最適化',
    'AI orchestration, prompt CI/CD, automated measurement and optimization')
];

// _APPROACHES: 12 design approaches (from DEV_METHODOLOGY_MAP primary/secondary)
const _APPROACHES = [
  {id:'flow', ja:'フロー状態設計', en:'Flow State Design'},
  {id:'emo', ja:'エモーショナル', en:'Emotional Design'},
  {id:'prog', ja:'プログレッシブ開示', en:'Progressive Disclosure'},
  {id:'data', ja:'データドリブン', en:'Data-Driven'},
  {id:'cog', ja:'認知負荷最小化', en:'Cognitive Load Min.'},
  {id:'time', ja:'時間価値最大化', en:'Time Value Max.'},
  {id:'ctx', ja:'コンテキスト適応', en:'Context Adaptive'},
  {id:'res', ja:'レジリエント', en:'Resilient'},
  {id:'inc', ja:'インクルーシブ', en:'Inclusive'},
  {id:'atm', ja:'アトミック設計', en:'Atomic Design'},
  {id:'eco', ja:'エコシステム統合', en:'Ecosystem Integration'},
  {id:'prf', ja:'パフォーマンス最優先', en:'Performance First'}
];

// _SYNERGY_RAW: Upper-triangle synergy matrix (12x12)
// Values: 1=conflict, 3=neutral, 5=strong synergy
// Row order matches _APPROACHES index (flow,emo,prog,data,cog,time,ctx,res,inc,atm,eco,prf)
const _SYNERGY_RAW = [
  [5,4,5,3,5,4,4,3,4,3,3,3], // flow
  [0,5,4,5,3,5,4,2,5,3,3,2], // emo
  [0,0,5,4,5,4,5,3,5,4,3,3], // prog
  [0,0,0,5,4,4,5,4,3,4,4,4], // data
  [0,0,0,0,5,5,4,3,4,5,3,4], // cog
  [0,0,0,0,0,5,4,3,3,4,3,5], // time
  [0,0,0,0,0,0,5,4,4,3,5,4], // ctx
  [0,0,0,0,0,0,0,5,3,4,4,4], // res
  [0,0,0,0,0,0,0,0,5,3,3,2], // inc
  [0,0,0,0,0,0,0,0,0,5,4,4], // atm
  [0,0,0,0,0,0,0,0,0,0,5,3], // eco
  [0,0,0,0,0,0,0,0,0,0,0,5]  // prf
];

function getSynergy(i, j) {
  if (i === j) return 5;
  var r = Math.min(i, j), c = Math.max(i, j);
  return _SYNERGY_RAW[r][c];
}

// APPROACH_KPI: KPIs for each of 12 approaches
const APPROACH_KPI = {
  flow:  {metrics_ja:['セッション継続時間','タスク完了率','中断回数','再訪問率'],       metrics_en:['Session duration','Task completion rate','Interruption count','Return visit rate'],       tools_ja:'Hotjar, FullStory', tools_en:'Hotjar, FullStory'},
  emo:   {metrics_ja:['NPS(推奨意向)','感情評価スコア','SNSシェア率','離脱率'],         metrics_en:['NPS','Emotional rating score','SNS share rate','Bounce rate'],                           tools_ja:'SurveyMonkey, Amplitude', tools_en:'SurveyMonkey, Amplitude'},
  prog:  {metrics_ja:['段階完了率','離脱ステップ','機能発見率','チュートリアル完了率'], metrics_en:['Stage completion rate','Drop-off step','Feature discovery rate','Tutorial completion'],    tools_ja:'Mixpanel, Heap', tools_en:'Mixpanel, Heap'},
  data:  {metrics_ja:['CVR','A/Bテスト勝率','予測精度','データ活用率'],                 metrics_en:['CVR','A/B test win rate','Prediction accuracy','Data utilization rate'],                  tools_ja:'Optimizely, Statsig', tools_en:'Optimizely, Statsig'},
  cog:   {metrics_ja:['タスク完了時間','エラー率','ヘルプアクセス数','認知負荷スコア'], metrics_en:['Task completion time','Error rate','Help access count','Cognitive load score'],            tools_ja:'UserZoom, Maze', tools_en:'UserZoom, Maze'},
  time:  {metrics_ja:['Time to Value','操作ステップ数','自動化率','1クリック達成率'],   metrics_en:['Time to value','Operation steps','Automation rate','One-click achievement rate'],         tools_ja:'Amplitude, PostHog', tools_en:'Amplitude, PostHog'},
  ctx:   {metrics_ja:['パーソナライズ効果','文脈一致率','レコメンド精度','戻り率'],     metrics_en:['Personalization effect','Context match rate','Recommendation accuracy','Return rate'],    tools_ja:'Segment, Braze', tools_en:'Segment, Braze'},
  res:   {metrics_ja:['SLA達成率','MTTR','障害頻度','エラー自動復旧率'],                metrics_en:['SLA achievement rate','MTTR','Failure frequency','Auto-recovery rate'],                  tools_ja:'Datadog, PagerDuty', tools_en:'Datadog, PagerDuty'},
  inc:   {metrics_ja:['WCAG準拠率','アクセシビリティスコア','多様性カバレッジ','支援技術対応率'], metrics_en:['WCAG compliance rate','Accessibility score','Diversity coverage','Assistive tech support'], tools_ja:'axe-core, WAVE', tools_en:'axe-core, WAVE'},
  atm:   {metrics_ja:['コンポーネント再利用率','デザイン一貫性スコア','実装速度','バグ発生率'], metrics_en:['Component reuse rate','Design consistency score','Implementation speed','Bug rate'],      tools_ja:'Storybook, Chromatic', tools_en:'Storybook, Chromatic'},
  eco:   {metrics_ja:['API統合数','エコシステム活用率','外部連携CVR','プラットフォーム効果'], metrics_en:['API integration count','Ecosystem utilization rate','External integration CVR','Platform effect'], tools_ja:'Zapier, MuleSoft', tools_en:'Zapier, MuleSoft'},
  prf:   {metrics_ja:['Core Web Vitals','p95レイテンシ','リソース使用率','スループット'],   metrics_en:['Core Web Vitals','p95 latency','Resource utilization','Throughput'],                      tools_ja:'Lighthouse, k6', tools_en:'Lighthouse, k6'}
};

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

function gen65(G, domain, meth, matLv, a, pn) {
  var d = G ? '# プロンプトゲノム — ' + pn + '\n\n' : '# Prompt Genome — ' + pn + '\n\n';
  d += G ? '> プロジェクト固有の"プロンプトDNA"ライブラリ。CRITERIA 8軸品質スコア付き。\n\n' :
           '> Project-specific "Prompt DNA" library with CRITERIA 8-axis quality scoring.\n\n';

  // DNA Profile
  d += G ? '## 🧬 プロンプトDNAプロファイル\n\n' : '## 🧬 Prompt DNA Profile\n\n';
  d += G ? '| 項目 | 値 |\n|------|----|\n' : '| Item | Value |\n|------|-------|\n';
  d += G ? '| プロジェクト | ' + pn + ' |\n' : '| Project | ' + pn + ' |\n';
  d += G ? '| ドメイン | ' + domain + ' |\n' : '| Domain | ' + domain + ' |\n';
  d += G ? '| 主要アプローチ | ' + meth.primary_ja + ' |\n' : '| Primary Approach | ' + meth.primary_en + ' |\n';
  d += G ? '| 副次アプローチ | ' + meth.secondary_ja + ' |\n' : '| Secondary Approach | ' + meth.secondary_en + ' |\n';
  d += G ? '| AI成熟度レベル | Level ' + matLv + ' (' + AI_MATURITY_MODEL[matLv-1].label_ja + ') |\n' :
           '| AI Maturity Level | Level ' + matLv + ' (' + AI_MATURITY_MODEL[matLv-1].label_en + ') |\n';
  d += G ? '| スタック | ' + (a.frontend||'') + ' + ' + (a.backend||'') + ' |\n\n' :
           '| Stack | ' + (a.frontend||'') + ' + ' + (a.backend||'') + ' |\n\n';

  // Genome signature Mermaid
  d += '```mermaid\n';
  d += 'graph TD\n';
  d += '  DNA[🧬 Prompt DNA] --> C[CRITERIA Framework]\n';
  d += '  DNA --> M[' + (G ? 'AI成熟度 Level ' : 'AI Maturity Level ') + matLv + ']\n';
  d += '  DNA --> A[' + (G ? meth.primary_ja.split(' ')[0] : meth.primary_en.split(' ')[0]) + ']\n';
  d += '  C --> C1[Context 15%]\n';
  d += '  C --> C2[Instructions 20%]\n';
  d += '  C --> C3[Execution 15%]\n';
  d += '  M --> M1[' + (G ? AI_MATURITY_MODEL[matLv-1].pats_ja.split('、')[0] : AI_MATURITY_MODEL[matLv-1].pats_en.split(',')[0].trim()) + ']\n';
  d += '  A --> A1[' + (G ? meth.kw_ja[0] : meth.kw_en[0]) + ']\n';
  d += '  A --> A2[' + (G ? meth.kw_ja[1] : meth.kw_en[1]) + ']\n';
  d += '```\n\n';

  // CRITERIA Scoring Guide
  d += G ? '## 📊 CRITERIA 8軸品質スコアリング\n\n' : '## 📊 CRITERIA 8-Axis Quality Scoring\n\n';
  d += G ? '| 軸 | 重み | 評価基準 | 5点ガイド |\n|-----|------|----------|----------|\n' :
           '| Axis | Weight | Rubric | 5-Point Guide |\n|------|--------|--------|---------------|\n';
  CRITERIA_FRAMEWORK.forEach(function(c) {
    d += '| ' + c.key + ' | ' + c.weight + '% | ' + (G ? c.rubric_ja : c.rubric_en) + ' | ' + (G ? c.guide_ja : c.guide_en) + ' |\n';
  });
  d += '\n';

  // Phase-by-phase prompts with CRITERIA scores
  var phases = [
    {ph:'0', ja:'コンセプト検証', en:'Concept Validation'},
    {ph:'1', ja:'設計・仕様化', en:'Design & Specification'},
    {ph:'2', ja:'実装', en:'Implementation'},
    {ph:'3', ja:'品質保証', en:'Quality Assurance'},
    {ph:'4', ja:'デプロイ', en:'Deployment'},
    {ph:'5', ja:'運用・改善', en:'Operations & Improvement'}
  ];

  d += G ? '## 🎯 フェーズ別プロンプトライブラリ\n\n' : '## 🎯 Phase-by-Phase Prompt Library\n\n';

  var criteriaScores = [
    {ctx:4, role:4, inst:5, tp:4, er:4, rf:3, it:4, ad:3}, // Phase 0
    {ctx:5, role:5, inst:5, tp:5, er:5, rf:4, it:4, ad:4}, // Phase 1
    {ctx:5, role:5, inst:5, tp:4, er:5, rf:5, it:5, ad:4}, // Phase 2
    {ctx:4, role:4, inst:5, tp:4, er:5, rf:5, it:5, ad:3}, // Phase 3
    {ctx:4, role:5, inst:5, tp:3, er:5, rf:4, it:3, ad:4}, // Phase 4
    {ctx:5, role:4, inst:5, tp:5, er:4, rf:5, it:5, ad:5}  // Phase 5
  ];

  phases.forEach(function(ph, idx) {
    var sc = criteriaScores[idx];
    var total = Math.round(
      sc.ctx*0.15 + sc.role*0.10 + sc.inst*0.20 + sc.tp*0.10 +
      sc.er*0.15 + sc.rf*0.10 + sc.it*0.10 + sc.ad*0.10
    );
    d += '### Phase ' + ph.ph + ': ' + (G ? ph.ja : ph.en) + '\n\n';
    d += G ? '**CRITERIA スコア**: ' : '**CRITERIA Score**: ';
    d += 'C=' + sc.ctx + ' R=' + sc.role + ' I=' + sc.inst + ' T=' + sc.tp +
         ' E=' + sc.er + ' Rf=' + sc.rf + ' It=' + sc.it + ' A=' + sc.ad +
         ' → **' + total + '/5**\n\n';

    // Level-adaptive prompt
    if (matLv === 1) {
      d += G ? '**Level 1 (AI支援) 推奨プロンプト:**\n\n' : '**Level 1 (Assisted) Recommended Prompt:**\n\n';
      d += G ? '```\nあなたは' + domain + 'ドメインの専門家です。\n' + pn + 'プロジェクトの' + ph.ja + 'フェーズで、\n' +
               'ステップバイステップで' + (meth.kw_ja[idx % 4] || meth.kw_ja[0]) + 'を考慮した提案をしてください。\n各提案には根拠と具体的なアクションを含めてください。\n```\n\n' :
               '```\nYou are a ' + domain + ' domain expert.\nFor ' + pn + ' project\'s ' + ph.en + ' phase,\nprovide step-by-step suggestions considering ' + (meth.kw_en[idx % 4] || meth.kw_en[0]) + '.\nInclude rationale and specific actions for each suggestion.\n```\n\n';
    } else if (matLv === 2) {
      d += G ? '**Level 2 (AI協調) 推奨プロンプト:**\n\n' : '**Level 2 (Augmented) Recommended Prompt:**\n\n';
      d += G ? '```\n役割: ' + domain + 'ドメインのシニアアーキテクト\nプロジェクト: ' + pn + '\nフェーズ: ' + ph.ja + '\n\n' +
               'CRITERIA準拠の思考プロセス:\n1. コンテキスト確認: ' + meth.rationale_ja.substring(0, 60) + '...\n' +
               '2. ' + (G ? meth.kw_ja[0] : meth.kw_en[0]) + 'の観点から3つの選択肢を提案\n3. 各選択肢のトレードオフを評価\n4. 最終推奨と実装ロードマップを提示\n' +
               '\n禁止: 根拠なしの断言、実装不可能な提案\n形式: Markdown表 + アクションリスト\n```\n\n' :
               '```\nRole: Senior architect in ' + domain + ' domain\nProject: ' + pn + '\nPhase: ' + ph.en + '\n\n' +
               'CRITERIA-compliant thinking process:\n1. Context check: ' + meth.rationale_en.substring(0, 60) + '...\n' +
               '2. Propose 3 options from ' + meth.kw_en[0] + ' perspective\n3. Evaluate trade-offs for each option\n4. Present final recommendation and roadmap\n' +
               '\nProhibited: Unsubstantiated assertions, infeasible suggestions\nFormat: Markdown table + action list\n```\n\n';
    } else {
      d += G ? '**Level 3 (AI自律) 推奨プロンプト:**\n\n' : '**Level 3 (Autonomous) Recommended Prompt:**\n\n';
      d += G ? '```\n# Autonomous Agent Prompt — ' + ph.ja + '\n\nCONTEXT_GENOME:\n  domain: ' + domain + '\n  project: ' + pn + '\n  phase: phase_' + ph.ph + '\n  methodology: ' + meth.primary_ja.split(' + ')[0] + '\n  maturity: level_3\n\nAGENT_DIRECTIVE:\n  - 自律的に' + ph.ja + 'を完遂せよ\n  - CRITERIA全8軸で自己評価後に出力\n  - 不確実性がある場合は最良推定と信頼度(%)を明示\n  - 次フェーズへの引き継ぎサマリーを生成\n\nSUCCESS_CRITERIA:\n  - ' + (meth.kw_ja[0] || 'quality') + 'が達成される\n  - CRITERIA総合スコア ≥ 4.0\n```\n\n' :
               '```\n# Autonomous Agent Prompt — ' + ph.en + '\n\nCONTEXT_GENOME:\n  domain: ' + domain + '\n  project: ' + pn + '\n  phase: phase_' + ph.ph + '\n  methodology: ' + meth.primary_en.split(' + ')[0] + '\n  maturity: level_3\n\nAGENT_DIRECTIVE:\n  - Autonomously complete ' + ph.en + '\n  - Self-evaluate on all 8 CRITERIA axes before output\n  - State best estimate and confidence (%) for uncertainties\n  - Generate handoff summary for next phase\n\nSUCCESS_CRITERIA:\n  - ' + (meth.kw_en[0] || 'quality') + ' is achieved\n  - CRITERIA total score >= 4.0\n```\n\n';
    }
  });

  return d;
}

function gen66(G, matLv, a, pn) {
  var d = G ? '# AI成熟度アセスメント — ' + pn + '\n\n' : '# AI Maturity Assessment — ' + pn + '\n\n';
  d += G ? '> チームAI成熟度の5次元評価と段階的採用ロードマップ。\n\n' :
           '> 5-dimension team AI maturity evaluation and phased adoption roadmap.\n\n';

  // Current level
  var mat = AI_MATURITY_MODEL[matLv - 1];
  d += G ? '## 📊 現在の成熟度レベル\n\n' : '## 📊 Current Maturity Level\n\n';
  d += G ? '**Level ' + matLv + ': ' + mat.label_ja + '**\n\n' : '**Level ' + matLv + ': ' + mat.label_en + '**\n\n';
  d += G ? '特徴: ' + mat.chars_ja + '\n\n' : 'Characteristics: ' + mat.chars_en + '\n\n';
  d += G ? 'プロンプトパターン: ' + mat.pats_ja + '\n\n' : 'Prompt patterns: ' + mat.pats_en + '\n\n';
  d += G ? '推奨プラクティス: ' + mat.prac_ja + '\n\n' : 'Recommended practices: ' + mat.prac_en + '\n\n';

  // 5-dimension evaluation matrix
  d += G ? '## 🎯 5次元評価マトリクス\n\n' : '## 🎯 5-Dimension Evaluation Matrix\n\n';
  var dims = G ? [
    ['プロンプト設計力', 'テンプレート活用', 'CRITERIA準拠設計', 'ゲノム駆動設計'],
    ['AI協調力', '単発タスク依頼', 'マルチターン対話', 'マルチAgent統合'],
    ['品質保証', '手動レビュー', '半自動品質チェック', '自動CRITERIA評価'],
    ['チームプラクティス', '個人学習', 'ペアプログラミング', 'AIオーケストレーション'],
    ['効果測定', '定性的感想', 'KPI定期計測', 'リアルタイム最適化']
  ] : [
    ['Prompt Design', 'Template usage', 'CRITERIA-compliant design', 'Genome-driven design'],
    ['AI Collaboration', 'One-shot task requests', 'Multi-turn dialogue', 'Multi-agent integration'],
    ['Quality Assurance', 'Manual review', 'Semi-automated QA', 'Automated CRITERIA evaluation'],
    ['Team Practices', 'Individual learning', 'Pair programming', 'AI orchestration'],
    ['Measurement', 'Qualitative feedback', 'Regular KPI tracking', 'Real-time optimization']
  ];
  d += G ? '| 次元 | Level 1 | Level 2 | Level 3 |\n|------|---------|---------|----------|\n' :
           '| Dimension | Level 1 | Level 2 | Level 3 |\n|-----------|---------|---------|----------|\n';
  dims.forEach(function(dim) {
    d += '| **' + dim[0] + '** | ' + dim[1] + ' | ' + dim[2] + ' | ' + dim[3] + ' |\n';
  });
  d += '\n';

  // Maturity transition flow
  d += '```mermaid\n';
  d += 'graph LR\n';
  d += '  L1[Level 1<br/>' + (G ? 'AI支援' : 'Assisted') + '] -->|' + (G ? 'CRITERIA習得' : 'CRITERIA mastery') + '| L2[Level 2<br/>' + (G ? 'AI協調' : 'Augmented') + ']\n';
  d += '  L2 -->|' + (G ? 'オーケストレーション' : 'Orchestration') + '| L3[Level 3<br/>' + (G ? 'AI自律' : 'Autonomous') + ']\n';
  d += '  style L' + matLv + ' fill:#4f46e5,color:#fff\n';
  d += '```\n\n';

  // 3-phase adoption roadmap
  d += G ? '## 🗺️ 段階的採用ロードマップ\n\n' : '## 🗺️ Phased Adoption Roadmap\n\n';
  var roadmap = G ? [
    ['フェーズ1: 基盤構築 (0-3ヶ月)', 'プロンプトライブラリ構築、CRITERIA基礎学習、成功例の共有と文書化'],
    ['フェーズ2: チーム展開 (3-6ヶ月)', 'ペアプログラミング導入、CRITERIA定期評価、チームプロンプト管理ツール選定'],
    ['フェーズ3: 自律化 (6-12ヶ月)', 'AIオーケストレーション導入、プロンプトCI/CD構築、効果自動測定と継続最適化']
  ] : [
    ['Phase 1: Foundation (0-3 months)', 'Build prompt library, learn CRITERIA basics, share and document success cases'],
    ['Phase 2: Team Rollout (3-6 months)', 'Introduce pair programming, regular CRITERIA evaluation, select team prompt management tools'],
    ['Phase 3: Autonomy (6-12 months)', 'Deploy AI orchestration, build prompt CI/CD, automate measurement and continuous optimization']
  ];
  roadmap.forEach(function(r, i) {
    var active = (i + 1 === matLv) ? (G ? ' ← **現在地**' : ' ← **Current**') : '';
    d += '### ' + r[0] + active + '\n' + r[1] + '\n\n';
  });

  // Next level actions
  if (matLv < 3) {
    d += G ? '## ⬆️ 次レベルへのアクション\n\n' : '## ⬆️ Actions for Next Level\n\n';
    var nextMat = AI_MATURITY_MODEL[matLv];
    d += G ? '**目標: Level ' + (matLv + 1) + ' ' + nextMat.label_ja + '**\n\n' :
             '**Target: Level ' + (matLv + 1) + ' ' + nextMat.label_en + '**\n\n';
    d += G ? '推奨アクション: ' + nextMat.prac_ja + '\n' : 'Recommended actions: ' + nextMat.prac_en + '\n';
  }

  return d;
}

function gen67(G, domain, meth, a, pn) {
  var d = G ? '# プロンプト合成ガイド — ' + pn + '\n\n' : '# Prompt Composition Guide — ' + pn + '\n\n';
  d += G ? '> 12設計アプローチのシナジーマトリクス + 4層テンプレートアーキテクチャ。\n\n' :
           '> Synergy matrix of 12 design approaches + 4-layer template architecture.\n\n';

  // Synergy matrix
  d += G ? '## 🔀 12×12 シナジーマトリクス\n\n' : '## 🔀 12×12 Synergy Matrix\n\n';
  d += G ? '凡例: 5=強シナジー, 3=中立, 1=競合\n\n' : 'Legend: 5=Strong synergy, 3=Neutral, 1=Conflict\n\n';
  var header = '| ' + (G ? 'アプローチ' : 'Approach') + ' |';
  _APPROACHES.forEach(function(ap) { header += ' ' + ap.id + ' |'; });
  d += header + '\n';
  d += '|' + '--------|'.repeat(_APPROACHES.length + 1) + '\n';
  _APPROACHES.forEach(function(ap, i) {
    var row = '| **' + (G ? ap.ja : ap.en) + '** |';
    _APPROACHES.forEach(function(_, j) {
      var s = getSynergy(i, j);
      var cell = s === 5 ? '**5**' : s === 1 ? '*1*' : String(s);
      row += ' ' + cell + ' |';
    });
    d += row + '\n';
  });
  d += '\n';

  // Project-specific synergy analysis
  var primIdx = _APPROACHES.findIndex(function(ap) { return meth.primary_en.toLowerCase().includes(ap.en.toLowerCase().split(' ')[0].toLowerCase()); });
  var secIdx = _APPROACHES.findIndex(function(ap) { return meth.secondary_en.toLowerCase().includes(ap.en.toLowerCase().split(' ')[0].toLowerCase()); });
  if (primIdx < 0) primIdx = 0;
  if (secIdx < 0) secIdx = 2;

  d += G ? '## 🎯 プロジェクト固有シナジー分析\n\n' : '## 🎯 Project-Specific Synergy Analysis\n\n';
  d += G ? '**ドメイン**: ' + domain + '\n' : '**Domain**: ' + domain + '\n';
  d += G ? '**主要アプローチ**: ' + meth.primary_ja + ' (index: ' + primIdx + ')\n' :
           '**Primary Approach**: ' + meth.primary_en + ' (index: ' + primIdx + ')\n';
  d += G ? '**副次アプローチ**: ' + meth.secondary_ja + ' (index: ' + secIdx + ')\n\n' :
           '**Secondary Approach**: ' + meth.secondary_en + ' (index: ' + secIdx + ')\n\n';

  var synergyScore = getSynergy(primIdx, secIdx);
  d += G ? '**組合せシナジースコア**: ' + synergyScore + '/5 ' :
           '**Combination Synergy Score**: ' + synergyScore + '/5 ';
  d += synergyScore >= 4 ? (G ? '✅ 高シナジー\n\n' : '✅ High Synergy\n\n') :
       synergyScore >= 3 ? (G ? '⚡ 中程度\n\n' : '⚡ Moderate\n\n') :
                           (G ? '⚠️ トレードオフあり\n\n' : '⚠️ Trade-off exists\n\n');

  // High-synergy partners for primary approach
  d += G ? '**主要アプローチとの高シナジーパートナー (スコア≥4):**\n\n' :
           '**High-synergy partners for primary approach (score>=4):**\n\n';
  _APPROACHES.forEach(function(ap, i) {
    if (i === primIdx) return;
    var s = getSynergy(primIdx, i);
    if (s >= 4) {
      d += '- ' + (G ? ap.ja : ap.en) + ': ' + s + '/5\n';
    }
  });
  d += '\n';

  // 4-layer template architecture
  d += G ? '## 🏗️ 4層テンプレートアーキテクチャ\n\n' : '## 🏗️ 4-Layer Template Architecture\n\n';
  var layers = G ? [
    ['Layer 1: Meta (不変層)', '目的・役割・倫理制約。プロジェクト横断で共有。変更頻度: 低',
     '```\nMETA: あなたは{domain}の専門家。倫理的・安全・根拠ある提案のみ行う。\n```'],
    ['Layer 2: Structure (骨格層)', 'タスク構造・思考フロー・出力フォーマット。フェーズ単位で共有。変更頻度: 中',
     '```\nSTRUCTURE:\n1. 現状分析 → 2. 選択肢生成 → 3. 評価 → 4. 推奨\n形式: Markdown表\n```'],
    ['Layer 3: Content (コンテンツ層)', 'プロジェクト固有の文脈・データ・制約。タスク単位で変更。変更頻度: 高',
     '```\nCONTENT:\n  project: ' + pn + '\n  stack: ' + (a.frontend||'') + '\n  domain: ' + domain + '\n```'],
    ['Layer 4: Adaptation (適応層)', '言語・スキルレベル・出力形式の動的調整。実行時に注入。変更頻度: 動的',
     '```\nADAPTATION:\n  lang: ja\n  skill: intermediate\n  format: markdown\n```']
  ] : [
    ['Layer 1: Meta (Immutable)', 'Purpose, role, ethical constraints. Shared across projects. Change frequency: Low',
     '```\nMETA: You are a {domain} expert. Only ethical, safe, evidence-based suggestions.\n```'],
    ['Layer 2: Structure (Skeleton)', 'Task structure, thinking flow, output format. Shared per phase. Change frequency: Medium',
     '```\nSTRUCTURE:\n1. Current state analysis → 2. Option generation → 3. Evaluation → 4. Recommendation\nFormat: Markdown table\n```'],
    ['Layer 3: Content (Content)', 'Project-specific context, data, constraints. Changed per task. Change frequency: High',
     '```\nCONTENT:\n  project: ' + pn + '\n  stack: ' + (a.frontend||'') + '\n  domain: ' + domain + '\n```'],
    ['Layer 4: Adaptation (Adaptive)', 'Dynamic adjustment of language, skill level, output format. Injected at runtime. Change frequency: Dynamic',
     '```\nADAPTATION:\n  lang: en\n  skill: intermediate\n  format: markdown\n```']
  ];
  layers.forEach(function(layer) {
    d += '### ' + layer[0] + '\n' + layer[1] + '\n\n' + layer[2] + '\n\n';
  });

  // Composite prompt patterns (3 trade-off patterns)
  d += G ? '## ⚖️ 複合プロンプトパターン（3つのトレードオフ）\n\n' : '## ⚖️ Composite Prompt Patterns (3 Trade-offs)\n\n';
  var patterns = G ? [
    ['詳細 vs 速度', 'CRITERIA高スコア(I=5,Er=5)は詳細だが時間がかかる。Level 1ではI=3で速度優先',
     '解決策: フェーズ初期はI=3の軽量テンプレート、設計フェーズはI=5の詳細テンプレートを使い分け'],
    ['汎用 vs 特化', '汎用プロンプトは再利用性高いが精度低下。特化プロンプトは精度高いが保守コスト',
     '解決策: Layer 1-2を汎用、Layer 3-4を特化にする4層分離パターン'],
    ['自律 vs 制御', 'Level 3 (自律)は速いが予測困難。Level 1 (手動)は安全だが遅い',
     '解決策: 成熟度に応じた段階的自律化。失敗コストが高いタスクはLevel 1を維持']
  ] : [
    ['Detail vs Speed', 'High CRITERIA score (I=5, Er=5) is detailed but time-consuming. Level 1 prioritizes speed with I=3',
     'Solution: Use lightweight I=3 templates in early phases, detailed I=5 templates in design phases'],
    ['Generic vs Specialized', 'Generic prompts have high reusability but lower accuracy. Specialized prompts have high accuracy but maintenance cost',
     'Solution: 4-layer separation: Layers 1-2 generic, Layers 3-4 specialized'],
    ['Autonomy vs Control', 'Level 3 (Autonomous) is fast but unpredictable. Level 1 (Manual) is safe but slow',
     'Solution: Gradual autonomy based on maturity. Keep Level 1 for high-failure-cost tasks']
  ];
  patterns.forEach(function(p, i) {
    d += '**' + (i+1) + '. ' + p[0] + '**\n\n' + p[1] + '\n\n' + p[2] + '\n\n';
  });

  // ai_tools: tool-specific prompt optimization table
  var aiTools = (a.ai_tools || 'Cursor').split(', ');
  d += G ? '## 🛠️ AIツール別プロンプト最適化\n\n' : '## 🛠️ Tool-Specific Prompt Optimization\n\n';
  d += '| ' + (G ? 'ツール' : 'Tool') + ' | ' + (G ? '最適パターン' : 'Optimal Pattern') + ' | ' + (G ? '推奨アプローチ' : 'Recommended Approach') + ' |\n';
  d += '|---|---|---|\n';
  aiTools.forEach(function(t) {
    var tt = t.trim();
    if (tt.includes('Cursor')) {
      d += '| Cursor | ' + (G ? 'ワークスペース参照 (@workspace)' : 'Workspace reference (@workspace)') + ' | ' + (G ? 'コンテキスト付き指示で高精度' : 'Context-rich instructions for precision') + ' |\n';
    } else if (tt.includes('Claude')) {
      d += '| Claude Code | ' + (G ? 'サブエージェント委任' : 'Subagent delegation') + ' | ' + (G ? 'タスク分割+autonomous実行' : 'Task decomposition + autonomous execution') + ' |\n';
    } else if (tt.includes('Copilot')) {
      d += '| GitHub Copilot | ' + (G ? 'インライン補完' : 'Inline completion') + ' | ' + (G ? 'テスト→実装の順序でTDD' : 'TDD: tests first, then implementation') + ' |\n';
    } else if (tt.includes('Aider')) {
      d += '| Aider | ' + (G ? 'Git統合編集' : 'Git-integrated editing') + ' | ' + (G ? '差分ベースの指示' : 'Diff-based instructions') + ' |\n';
    } else if (tt.includes('Antigravity')) {
      d += '| Antigravity | ' + (G ? 'Agent-first IDE' : 'Agent-first IDE') + ' | ' + (G ? 'Managerビューでタスク管理' : 'Manager view for task orchestration') + ' |\n';
    } else {
      d += '| ' + tt + ' | ' + (G ? '汎用プロンプト' : 'General prompt') + ' | ' + (G ? 'CoT+制約明示' : 'CoT + explicit constraints') + ' |\n';
    }
  });
  d += '\n';

  if (a.ai_auto && !/なし|none/i.test(a.ai_auto)) {
    d += '## ' + (G ? 'AI出力ガードレール (Guardrails)' : 'AI Output Guardrails') + '\n\n';
    d += '### ' + (G ? '入力フィルタリング' : 'Input Filtering') + '\n\n';
    d += '| ' + (G ? '制御' : 'Control') + ' | ' + (G ? '実装' : 'Implementation') + ' |\n|------|------|\n';
    d += '| ' + (G ? 'プロンプトインジェクション検知' : 'Prompt injection detection') + ' | ' + (G ? '禁止パターン正規表現 + LLM-as-judge' : 'Forbidden-pattern regex + LLM-as-judge') + ' |\n';
    d += '| ' + (G ? '禁止カテゴリ拒否' : 'Forbidden category rejection') + ' | ' + (G ? 'コンテンツポリシー分類器' : 'Content policy classifier') + ' |\n';
    d += '| ' + (G ? 'PII 検出・マスキング' : 'PII detection & masking') + ' | ' + (G ? '正規表現 + Presidio / GLiNER' : 'Regex + Presidio / GLiNER') + ' |\n';
    d += '\n### ' + (G ? '出力検証' : 'Output Validation') + '\n\n';
    d += '| ' + (G ? '検証' : 'Validation') + ' | ' + (G ? '手法' : 'Method') + ' |\n|------|------|\n';
    d += '| ' + (G ? 'JSON Schema検証' : 'JSON Schema validation') + ' | ' + (G ? '構造化出力の型安全性保証' : 'Guarantee type-safety of structured outputs') + ' |\n';
    d += '| Range check | ' + (G ? '数値・列挙値の範囲検証' : 'Validate numeric/enum ranges') + ' |\n';
    d += '| ' + (G ? 'ハルシネーション検知' : 'Hallucination detection') + ' | ' + (G ? '参照文書との一貫性スコア (≥0.85)' : 'Consistency score vs. reference docs (≥0.85)') + ' |\n';
    d += '\n### ' + (G ? '信頼度キャリブレーション' : 'Confidence Calibration') + '\n\n';
    d += '| ' + (G ? '手法' : 'Method') + ' | ' + (G ? '説明' : 'Detail') + ' |\n|------|------|\n';
    d += '| ' + (G ? '信頼度スコア付与' : 'Confidence scoring') + ' | ' + (G ? 'ロジット確率 or 自己評価プロンプト' : 'Logit probabilities or self-evaluation prompt') + ' |\n';
    d += '| ' + (G ? '低信頼度時の HITL' : 'HITL on low confidence') + ' | ' + (G ? 'スコア < 0.7 → 人間レビューキュー' : 'Score < 0.7 → human review queue') + ' |\n';
    d += '\n';
  }

  return d;
}

function gen68(G, domain, meth, a, pn) {
  var d = G ? '# プロンプトKPIダッシュボード — ' + pn + '\n\n' : '# Prompt KPI Dashboard — ' + pn + '\n\n';
  d += G ? '> アプローチ別成功指標 + 測定計画 + AI効果測定。\n\n' :
           '> Approach-specific success metrics + measurement plan + AI effectiveness tracking.\n\n';

  // Primary/secondary approach KPI matrix
  var approaches = meth.primary_en.toLowerCase();
  var primKey = 'flow';
  var secKey = 'prog';
  Object.keys(APPROACH_KPI).forEach(function(key) {
    if (approaches.includes(key.substring(0, 3))) primKey = key;
  });
  var secApproaches = meth.secondary_en.toLowerCase();
  Object.keys(APPROACH_KPI).forEach(function(key) {
    if (secApproaches.includes(key.substring(0, 3))) secKey = key;
  });

  var primKPI = APPROACH_KPI[primKey];
  var secKPI = APPROACH_KPI[secKey];

  d += G ? '## 📊 アプローチ別KPIマトリクス\n\n' : '## 📊 Approach-Specific KPI Matrix\n\n';
  d += G ? '### 主要アプローチ: ' + meth.primary_ja + '\n\n' : '### Primary Approach: ' + meth.primary_en + '\n\n';
  d += G ? '| KPI | ベースライン | 目標値 | 計測ツール |\n|-----|------------|--------|----------|\n' :
           '| KPI | Baseline | Target | Measurement Tool |\n|-----|----------|--------|------------------|\n';
  (G ? primKPI.metrics_ja : primKPI.metrics_en).forEach(function(m) {
    d += '| ' + m + ' | TBD | TBD | ' + (G ? primKPI.tools_ja : primKPI.tools_en) + ' |\n';
  });
  d += '\n';

  d += G ? '### 副次アプローチ: ' + meth.secondary_ja + '\n\n' : '### Secondary Approach: ' + meth.secondary_en + '\n\n';
  d += G ? '| KPI | ベースライン | 目標値 | 計測ツール |\n|-----|------------|--------|----------|\n' :
           '| KPI | Baseline | Target | Measurement Tool |\n|-----|----------|--------|------------------|\n';
  (G ? secKPI.metrics_ja : secKPI.metrics_en).forEach(function(m) {
    d += '| ' + m + ' | TBD | TBD | ' + (G ? secKPI.tools_ja : secKPI.tools_en) + ' |\n';
  });
  d += '\n';

  // Measurement plan
  d += G ? '## 📅 測定計画\n\n' : '## 📅 Measurement Plan\n\n';
  var mplan = G ? [
    ['Baseline計測 (Week 1-2)', '現状KPIを計測してベースラインを確立。ツールのセットアップと初期データ収集'],
    ['Optimization (Week 3-8)', 'CRITERIA評価とKPI計測を週次で実施。A/Bテストでプロンプト改善を検証'],
    ['Continuous (Week 9+)', '月次レポートとKPI評価。四半期ごとにプロンプトゲノムを更新・進化']
  ] : [
    ['Baseline Measurement (Week 1-2)', 'Measure current KPIs to establish baseline. Set up tools and collect initial data'],
    ['Optimization (Week 3-8)', 'Weekly CRITERIA evaluation and KPI measurement. Validate prompt improvements with A/B tests'],
    ['Continuous (Week 9+)', 'Monthly reports and KPI review. Update and evolve prompt genome quarterly']
  ];
  mplan.forEach(function(mp) {
    d += '### ' + mp[0] + '\n' + mp[1] + '\n\n';
  });

  // AI effectiveness metrics
  d += G ? '## 🤖 AI効果測定指標\n\n' : '## 🤖 AI Effectiveness Metrics\n\n';
  d += G ? '| 指標 | 計算式 | 目標値 |\n|------|--------|--------|\n' :
           '| Metric | Formula | Target |\n|--------|---------|--------|\n';
  var metrics = G ? [
    ['プロンプト成功率', '(期待出力数 / 総プロンプト数) × 100', '≥ 80%'],
    ['自動化率', '(AI処理タスク数 / 総タスク数) × 100', '≥ 60%'],
    ['CRITERIA平均スコア', '全プロンプトのCRITERIA加重平均', '≥ 4.0 / 5'],
    ['反復改善効率', '(改善後スコア - 初回スコア) / 反復回数', '≥ 0.3 / 回'],
    ['開発速度向上率', '(AI導入後速度 / 導入前速度 - 1) × 100', '≥ 30%']
  ] : [
    ['Prompt Success Rate', '(Expected output count / Total prompts) × 100', '≥ 80%'],
    ['Automation Rate', '(AI-handled tasks / Total tasks) × 100', '≥ 60%'],
    ['Average CRITERIA Score', 'Weighted CRITERIA average across all prompts', '≥ 4.0 / 5'],
    ['Iterative Improvement Efficiency', '(Post-improvement score - Initial score) / Iterations', '≥ 0.3 / iteration'],
    ['Development Speed Improvement', '(Post-AI speed / Pre-AI speed - 1) × 100', '≥ 30%']
  ];
  metrics.forEach(function(m) {
    d += '| ' + m[0] + ' | `' + m[1] + '` | ' + m[2] + ' |\n';
  });
  d += '\n';

  // KPI measurement flow Mermaid
  d += '```mermaid\n';
  d += 'graph TD\n';
  d += '  M[' + (G ? 'KPI計測開始' : 'KPI Measurement Start') + '] --> B[' + (G ? 'Baseline確立' : 'Establish Baseline') + ']\n';
  d += '  B --> P[' + (G ? 'プロンプト実行' : 'Execute Prompts') + ']\n';
  d += '  P --> C[' + (G ? 'CRITERIA評価' : 'CRITERIA Evaluation') + ']\n';
  d += '  C --> K[' + (G ? 'KPI計測' : 'KPI Measurement') + ']\n';
  d += '  K --> R{' + (G ? '目標達成?' : 'Target Met?') + '}\n';
  d += '  R -->|' + (G ? 'YES' : 'YES') + '| N[' + (G ? '次フェーズ' : 'Next Phase') + ']\n';
  d += '  R -->|' + (G ? 'NO' : 'NO') + '| I[' + (G ? 'プロンプト改善' : 'Improve Prompts') + ']\n';
  d += '  I --> P\n';
  d += '```\n';

  return d;
}

function genPillar17_PromptGenome(a, pn) {
  var G = S.genLang === 'ja';
  var domain = detectDomain(a.purpose || '');
  var meth = DEV_METHODOLOGY_MAP[domain] || DEV_METHODOLOGY_MAP._default;
  var aiAuto = a.ai_auto || '';
  var matLv = /自律|orch|autonomous/i.test(aiAuto) ? 3 :
              /マルチ|multi|full/i.test(aiAuto) ? 2 : 1;
  S.files['docs/65_prompt_genome.md'] = gen65(G, domain, meth, matLv, a, pn);
  S.files['docs/66_ai_maturity_assessment.md'] = gen66(G, matLv, a, pn);
  S.files['docs/67_prompt_composition_guide.md'] = gen67(G, domain, meth, a, pn);
  S.files['docs/68_prompt_kpi_dashboard.md'] = gen68(G, domain, meth, a, pn);
}
