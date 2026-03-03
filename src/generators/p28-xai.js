/* ═══ PILLAR ㉘ XAI INTELLIGENCE ═══ */
/* Generates: docs/128-131 (always) + docs/131-2 (AI + high-risk OR agent mode) */

var FAIRNESS_METRICS=[
  {id:'demographic_parity',ja:'人口統計的パリティ',en:'Demographic Parity',
   formula:'P(Ŷ=1|A=0) = P(Ŷ=1|A=1)',
   ja_desc:'保護属性に関わらず陽性予測率が等しい',
   en_desc:'Equal positive prediction rate regardless of protected attribute',
   use_case_ja:'採用・融資審査・広告配信',use_case_en:'Hiring, loan approval, ad delivery',
   tool:'Fairlearn: MetricFrame'},
  {id:'equalized_odds',ja:'均等化オッズ',en:'Equalized Odds',
   formula:'TPR(A=0)=TPR(A=1) AND FPR(A=0)=FPR(A=1)',
   ja_desc:'真陽性率・偽陽性率が両グループで等しい',
   en_desc:'Equal TPR and FPR across both groups',
   use_case_ja:'医療診断・再犯予測・保険査定',use_case_en:'Medical diagnosis, recidivism, insurance',
   tool:'AIF360: EqualizedOdds'},
  {id:'calibration',ja:'キャリブレーション',en:'Calibration',
   formula:'P(Y=1|Ŷ=p,A=a) = p ∀a',
   ja_desc:'確率スコアが実際の発生確率と一致している',
   en_desc:'Predicted probability scores match actual occurrence rates',
   use_case_ja:'信用スコア・医療リスクスコア',use_case_en:'Credit scoring, medical risk scoring',
   tool:'sklearn: calibration_curve'},
  {id:'predictive_parity',ja:'予測パリティ',en:'Predictive Parity',
   formula:'P(Y=1|Ŷ=1,A=0) = P(Y=1|Ŷ=1,A=1)',
   ja_desc:'陽性予測値が両グループで等しい',
   en_desc:'Equal positive predictive value across groups',
   use_case_ja:'採用スクリーニング・融資承認',use_case_en:'Hiring screening, loan approval',
   tool:'Fairlearn: MetricFrame PPV'},
  {id:'individual_fairness',ja:'個人フェアネス',en:'Individual Fairness',
   formula:'d(x,x\')≤ε ⟹ |f(x)-f(x\')|≤δ',
   ja_desc:'類似した個人は類似した結果を受けるべき',
   en_desc:'Similar individuals should receive similar outcomes',
   use_case_ja:'パーソナライズ・レコメンドシステム',use_case_en:'Personalization, recommendation systems',
   tool:'Fairlearn: ThresholdOptimizer'},
];

var DRIFT_DETECTORS=[
  {id:'psi',name:'PSI',full:'Population Stability Index',
   formula:'PSI = Σ (Actual% - Expected%) × ln(Actual%/Expected%)',
   threshold_ja:'<0.1: 安定 / 0.1-0.2: 注意 / >0.2: 再学習必要',
   threshold_en:'<0.1: stable / 0.1-0.2: caution / >0.2: retrain needed',
   use_case_ja:'フィーチャー分布ドリフト検出',use_case_en:'Feature distribution drift detection',
   lib:'custom or nannyml'},
  {id:'kl_divergence',name:'KL Divergence',full:'Kullback-Leibler Divergence',
   formula:'KL(P‖Q) = Σ P(x) ln(P(x)/Q(x))',
   threshold_ja:'>0.05 で注意、>0.1 で再学習検討',
   threshold_en:'>0.05 caution, >0.1 consider retraining',
   use_case_ja:'確率分布の差異検出',use_case_en:'Probability distribution divergence',
   lib:'scipy: entropy'},
  {id:'wasserstein',name:'Wasserstein',full:'Earth Mover\'s Distance',
   formula:'W(P,Q) = inf_{γ∈Γ(P,Q)} E[d(X,Y)]',
   threshold_ja:'ベースライン比較で相対閾値を設定',
   threshold_en:'Set relative threshold vs. baseline',
   use_case_ja:'連続分布のシフト検出',use_case_en:'Continuous distribution shift detection',
   lib:'scipy: wasserstein_distance'},
  {id:'ks_test',name:'KS Test',full:'Kolmogorov-Smirnov Test',
   formula:'D = sup_x |F_n(x) - F(x)|',
   threshold_ja:'p-value < 0.05 で分布変化あり',
   threshold_en:'p-value < 0.05 indicates distribution change',
   use_case_ja:'数値フィーチャーのドリフト検出',use_case_en:'Numeric feature drift detection',
   lib:'scipy: ks_2samp'},
  {id:'adwin',name:'ADWIN',full:'Adaptive Windowing',
   formula:'Sliding window with adaptive width detection',
   threshold_ja:'delta=0.002 (デフォルト)、ストリームデータ向け',
   threshold_en:'delta=0.002 (default), designed for stream data',
   use_case_ja:'リアルタイムコンセプトドリフト検出',use_case_en:'Real-time concept drift detection',
   lib:'river: drift.ADWIN'},
];

var AI_RISK_TIERS=[
  {tier:0,level:'Unacceptable',ja:'受容不可',color:'🔴',
   ja_desc:'人間の監視なしに人権・生命に影響する自律的AI意思決定',
   en_desc:'Autonomous AI decisions affecting human rights or safety without human oversight',
   examples_ja:['社会スコアリングシステム','リアルタイム生体認証監視','司法判断の完全自動化'],
   examples_en:['Social scoring systems','Real-time biometric mass surveillance','Fully automated judicial decisions'],
   action:'禁止'},
  {tier:1,level:'High-Risk',ja:'高リスク',color:'🟠',
   ja_desc:'重要インフラ・採用・信用評価・医療診断・法執行への影響',
   en_desc:'Critical infrastructure, hiring, credit, medical diagnosis, law enforcement',
   examples_ja:['医療AI診断支援','採用候補者スクリーニング','信用スコアリング','再犯リスク評価'],
   examples_en:['Medical AI diagnosis support','Hiring candidate screening','Credit scoring','Recidivism risk assessment'],
   action:'適合性評価・人間監視・透明性開示が必要'},
  {tier:2,level:'Limited',ja:'限定リスク',color:'🟡',
   ja_desc:'人間との対話を含むが意思決定に直接影響しないAI',
   en_desc:'AI interacting with humans but not directly impacting decisions',
   examples_ja:['チャットボット・バーチャルアシスタント','ディープフェイク検出','感情分析'],
   examples_en:['Chatbots & virtual assistants','Deepfake detection','Sentiment analysis'],
   action:'透明性開示（AIであることの通知）'},
  {tier:3,level:'Minimal',ja:'最小リスク',color:'🟢',
   ja_desc:'リスクが極めて低いAIアプリケーション',
   en_desc:'AI applications with minimal risk',
   examples_ja:['スパムフィルター','AIゲーム','在庫管理最適化'],
   examples_en:['Spam filters','AI games','Inventory optimization'],
   action:'特別な規制なし（任意の倫理ガイドライン適用を推奨）'},
];

var RED_TEAM_ATTACKS=[
  {owasp:'LLM01',name:'Prompt Injection',ja:'プロンプトインジェクション',
   severity:'🔴 CRITICAL',
   ja_test:'悪意あるプロンプトでシステムプロンプトを上書きできるか確認',
   en_test:'Test if malicious prompts can override system prompt instructions',
   ja_mit:'入力サニタイズ・構造化出力強制・権限分離',en_mit:'Input sanitization, structured output, privilege separation'},
  {owasp:'LLM02',name:'Insecure Output Handling',ja:'安全でない出力処理',
   severity:'🔴 HIGH',
   ja_test:'LLM出力がXSS/SQLi/RCEに利用可能か確認',
   en_test:'Verify LLM output cannot be exploited for XSS/SQLi/RCE',
   ja_mit:'出力エンコード・CSPヘッダー・パラメタライズドクエリ',en_mit:'Output encoding, CSP headers, parameterized queries'},
  {owasp:'LLM03',name:'Training Data Poisoning',ja:'学習データポイズニング',
   severity:'🟠 HIGH',
   ja_test:'ファインチューニングデータセットの整合性検証',
   en_test:'Verify fine-tuning dataset integrity and provenance',
   ja_mit:'データ来歴追跡・異常検知・データ品質ゲート',en_mit:'Data provenance tracking, anomaly detection, data quality gates'},
  {owasp:'LLM04',name:'Model Denial of Service',ja:'モデルサービス拒否',
   severity:'🟠 MEDIUM',
   ja_test:'大量トークン消費・無限ループリクエストでのDoS試行',
   en_test:'Test DoS via high token consumption or infinite loop requests',
   ja_mit:'レート制限・トークン上限・タイムアウト設定',en_mit:'Rate limiting, token caps, timeout configuration'},
  {owasp:'LLM05',name:'Supply Chain Vulnerabilities',ja:'サプライチェーン脆弱性',
   severity:'🟠 MEDIUM',
   ja_test:'サードパーティモデル・プラグインの依存関係検証',
   en_test:'Audit third-party model/plugin dependency integrity',
   ja_mit:'依存関係固定・定期的な脆弱性スキャン・SBOM管理',en_mit:'Dependency pinning, regular vulnerability scanning, SBOM'},
  {owasp:'LLM06',name:'Sensitive Information Disclosure',ja:'機密情報開示',
   severity:'🔴 HIGH',
   ja_test:'学習データ・システムプロンプト・PII漏洩の確認',
   en_test:'Test for training data, system prompt, and PII leakage',
   ja_mit:'PIIフィルタリング・差分プライバシー・出力検証',en_mit:'PII filtering, differential privacy, output validation'},
  {owasp:'LLM07',name:'Insecure Plugin Design',ja:'安全でないプラグイン設計',
   severity:'🟠 MEDIUM',
   ja_test:'プラグインの過剰権限・入力検証バイパスの確認',
   en_test:'Test for excessive plugin permissions and input validation bypass',
   ja_mit:'最小権限の原則・プラグイン入力スキーマ検証・サンドボックス化',en_mit:'Least privilege, plugin input schema validation, sandboxing'},
  {owasp:'LLM08',name:'Excessive Agency',ja:'過剰なエージェント権限',
   severity:'🔴 HIGH',
   ja_test:'エージェントによる意図しないアクション実行の確認',
   en_test:'Test for unintended actions executed by agents',
   ja_mit:'人間確認ステップ・操作ログ・ロールバック機能',en_mit:'Human-in-the-loop, operation logging, rollback capability'},
];

function _xaiDomain(a){
  var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
  var isHighRisk=/health|fintech|insurance|legal/i.test(dom);
  var isMedical=/health|medical|clinic|病院|医療/i.test(dom+(a.purpose||''));
  var isFintech=/fintech|banking|finance|金融|銀行/i.test(dom+(a.purpose||''));
  var isLegal=/legal|law|弁護士|法務|司法/i.test(dom+(a.purpose||''));
  return {domain:dom,isHighRisk:isHighRisk,isMedical:isMedical,isFintech:isFintech,isLegal:isLegal};
}
function _hasAIForXAI(a){
  return a.ai_auto&&!/なし|None/i.test(a.ai_auto)&&a.ai_auto!=='';
}
function _isAgentMode28(a){
  return /orchestrator|オーケストレーター|multi.?agent|マルチ.?エージェント/i.test(a.ai_auto||'');
}

function genPillar28_XAIIntelligence(a,pn){
  gen128(a,pn);
  gen129(a,pn);
  gen130(a,pn);
  gen131(a,pn);
  var hasAI=_hasAIForXAI(a);
  var xd=_xaiDomain(a);
  var isAgent=_isAgentMode28(a);
  if(hasAI&&(xd.isHighRisk||isAgent))gen131_2(a,pn);
}

/* ── doc128: XAI Intelligence Architecture ── */
function gen128(a,pn){
  const G=S.genLang==='ja';
  const xd=_xaiDomain(a);
  const hasAI=_hasAIForXAI(a);
  const scale=a.scale||'medium';
  let doc='# '+(G?'XAIインテリジェンス・アーキテクチャ':'XAI Intelligence Architecture')+'\n\n';
  doc+='> '+(G?'説明可能AI (XAI) システムのアーキテクチャ設計 — パイプライン・規制対応・メトリクスダッシュボード':'Explainable AI (XAI) system architecture — pipeline, regulatory compliance, metrics dashboard')+'\n\n';

  doc+='## '+(G?'§1 XAIシステムアーキテクチャ概要':'§1 XAI System Architecture Overview')+'\n\n';
  doc+='```\n';
  doc+=G?
    'リクエスト → 推論エンジン → 帰属計算 → 説明ストア → UI/API\n':
    'Request → Inference Engine → Attribution Engine → Explanation Store → UI/API\n';
  doc+='    ↓               ↓              ↓               ↓\n';
  doc+=G?
    'ログ収集      モデルレジストリ   フェアネス監視    監査証跡\n':
    'Log Collect   Model Registry   Fairness Monitor  Audit Trail\n';
  doc+='```\n\n';

  doc+='| '+(G?'パターン':'Pattern')+' | '+(G?'説明':'Description')+' | '+(G?'適合ユースケース':'Best For')+' |\n';
  doc+='|---|---|---|\n';
  doc+='| '+(G?'同期':'Synchronous')+' | '+(G?'推論と同時にリアルタイム説明生成':'Real-time explanation generated with inference')+' | '+(G?'医療診断・融資審査':'Medical diagnosis, loan approval')+' |\n';
  doc+='| '+(G?'非同期':'Asynchronous')+' | '+(G?'バックグラウンドで説明を事後生成':'Explanation generated post-hoc in background')+' | '+(G?'レコメンドシステム・バッチ処理':'Recommendation, batch processing')+' |\n';
  doc+='| '+(G?'ハイブリッド':'Hybrid')+' | '+(G?'軽量同期 + 詳細非同期の組み合わせ':'Lightweight sync + detailed async combined')+' | '+(G?'汎用SaaSシステム':'General SaaS systems')+' |\n\n';

  if(xd.isHighRisk){
    doc+='> ⚠️ '+(G?'高リスクドメイン ('+xd.domain+') のため同期パターンを推奨します。EU AI Act Article 13 に基づき、意思決定の根拠を即時提供できる設計が必要です。':'High-risk domain ('+xd.domain+') detected. Synchronous pattern recommended. EU AI Act Article 13 requires immediate provision of decision rationale.')+'\n\n';
  }

  doc+='## '+(G?'§2 説明パイプライン設計':'§2 Explanation Pipeline Design')+'\n\n';
  doc+='### '+(G?'5ステージパイプライン':'5-Stage Pipeline')+'\n\n';
  doc+='```\n';
  doc+='Stage 1: Input Validation\n';
  doc+='  → '+(G?'入力データのスキーマ検証・PII検出・コンテキスト収集':'Input schema validation, PII detection, context collection')+'\n\n';
  doc+='Stage 2: Model Inference\n';
  doc+='  → '+(G?'予測実行・中間層アクティベーション保存・信頼度スコア計算':'Run prediction, save intermediate activations, compute confidence scores')+'\n\n';
  doc+='Stage 3: Attribution Computation\n';
  doc+='  → '+(G?'SHAP / LIME / Integrated Gradients で特徴量重要度を計算':'Compute feature importance via SHAP/LIME/Integrated Gradients')+'\n\n';
  doc+='Stage 4: Explanation Caching\n';
  doc+='  → '+(G?'説明結果をRedis/DB にキャッシュ (TTL: 医療=0 / 一般=3600s)':'Cache explanation results in Redis/DB (TTL: medical=0/general=3600s)')+'\n\n';
  doc+='Stage 5: UI Rendering\n';
  doc+='  → '+(G?'Force Plot / Bar Chart / Counterfactual をUI層でレンダリング':'Render Force Plot/Bar Chart/Counterfactual in UI layer')+'\n';
  doc+='```\n\n';

  doc+='### TypeScript Interface\n\n';
  doc+='```typescript\ninterface ExplanationRequest {\n  modelId: string;\n  inputData: Record<string, unknown>;\n  explanationType: \'shap\' | \'lime\' | \'integrated_gradients\';\n  userContext?: { role: string; domain: string };\n}\n\ninterface ExplanationResponse {\n  predictionId: string;\n  score: number;\n  confidence: number;\n  featureImportance: Array<{ feature: string; value: number; impact: number }>;\n  explanation: string;\n  regulatoryMetadata?: { euAiActArticle: string; timestamp: string };\n}\n```\n\n';
  doc+='> '+(G?'📘 XAI技法選定マトリクスの詳細は `docs/98-2_xai_transparency_guide.md §1` を参照':'📘 See `docs/98-2_xai_transparency_guide.md §1` for XAI technique selection matrix')+'\n\n';

  doc+='## '+(G?'§3 グローバルAI規制比較マトリクス':'§3 Global AI Regulation Comparison Matrix')+'\n\n';
  doc+='| '+(G?'規制':'Regulation')+' | '+(G?'管轄':'Jurisdiction')+' | '+(G?'対象':'Scope')+' | '+(G?'主要要件':'Key Requirements')+' | '+(G?'施行':'Enforcement')+'|\n';
  doc+='|---|---|---|---|---|\n';
  doc+='| EU AI Act | EU | '+(G?'高リスクAI':'High-risk AI')+' | '+(G?'適合性評価・透明性・人間監視':'Conformity assessment, transparency, human oversight')+' | 2026施行 (2024/8公布) |\n';
  doc+='| US EO 14110 | USA | '+(G?'基盤モデル':'Foundation models')+' | '+(G?'安全性評価報告・AI識別ウォーターマーク':'Safety eval reporting, AI watermarking')+' | '+(G?'行政命令（拘束力あり）':'Executive order (binding)')+' |\n';
  doc+='| '+(G?'AI戦略会議ガイドライン':'Japan AI Strategy Council')+' | '+(G?'日本':'Japan')+' | '+(G?'汎用AI':'General AI')+' | '+(G?'透明性・公平性・安全性の自主的遵守':'Voluntary compliance: transparency, fairness, safety')+' | '+(G?'任意（法制化検討中）':'Voluntary (legislation under review)')+' |\n';
  doc+='| '+(G?'アルゴリズム規制':'Algorithmic Regulation')+' | '+(G?'中国':'China')+' | '+(G?'レコメンドAI':'Recommendation AI')+' | '+(G?'アルゴリズム透明性・利用者通知義務':'Algorithm transparency, user notification')+' | 2022施行 |\n';
  doc+='| AIDA (draft) | '+(G?'カナダ':'Canada')+' | '+(G?'高影響AI':'High-impact AI')+' | '+(G?'説明可能性・バイアス対策・インシデント報告':'Explainability, bias mitigation, incident reporting')+' | '+(G?'審議中':'Under review')+' |\n\n';

  if(xd.isMedical){
    doc+='### '+(G?'医療ドメイン固有要件':'Medical Domain Requirements')+'\n\n';
    doc+='- '+(G?'**PMDA (薬機法)**: AIを用いた医療機器ソフトウェア (SaMD) は第三者認証が必要':'**PMDA (Pharmaceutical Affairs Act)**: AI-based SaMD requires third-party certification')+'\n';
    doc+='- '+(G?'**HIPAA**: AI予測結果を含む患者記録の説明可能性と監査証跡が必要':'**HIPAA**: Explainability and audit trail required for patient records including AI predictions')+'\n';
    doc+='- '+(G?'**EU MDR**: AIによる診断支援ツールはClass IIa以上に分類される可能性あり':'**EU MDR**: AI diagnostic support tools may be classified Class IIa or higher')+'\n\n';
  }
  if(xd.isFintech){
    doc+='### '+(G?'フィンテックドメイン固有要件':'Fintech Domain Requirements')+'\n\n';
    doc+='- '+(G?'**Basel III/IV**: AIモデルリスク管理 — SR 11-7ガイドラインに準拠':'**Basel III/IV**: AI model risk management — comply with SR 11-7 guidelines')+'\n';
    doc+='- '+(G?'**ECHR Article 22**: AIによる与信判断への異議申し立て権':'**ECHR Article 22**: Right to contest AI-based credit decisions')+'\n';
    doc+='- '+(G?'**金融庁ガイドライン**: AIを用いたモデルリスク管理の態勢整備が求められる':'**FSA Guidelines**: AI model risk management framework required')+'\n\n';
  }

  doc+='## '+(G?'§4 責任あるAIメトリクスダッシュボード':'§4 Responsible AI Metrics Dashboard')+'\n\n';
  doc+='### '+(G?'5 KPIs':'5 KPIs')+'\n\n';
  doc+='| KPI | '+(G?'定義':'Definition')+' | '+(G?'目標値':'Target')+' | '+(G?'測定手段':'Measurement')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| Explanation Coverage | '+(G?'説明が生成されたリクエスト割合':'% requests with explanation generated')+' | ≥ 95% | Prometheus counter |\n';
  doc+='| Explanation Latency P95 | '+(G?'説明生成のP95レイテンシ':'P95 latency for explanation generation')+' | ≤ 500ms | Prometheus histogram |\n';
  doc+='| User Understanding Score | '+(G?'ユーザーが説明を理解できた割合 (調査)':'% users who found explanation understandable (survey)')+' | ≥ 70% | UX survey |\n';
  doc+='| Fairness Score | '+(G?'人口統計的パリティ差異 (|ΔDP|)':'Demographic parity difference |ΔDP|')+' | ≤ 0.05 | Fairlearn MetricFrame |\n';
  doc+='| Drift Alert Rate | '+(G?'ドリフトアラートが発火した週次割合':'Weekly % of drift alerts triggered')+' | ≤ 5% | Evidently AI |\n\n';

  doc+='### Prometheus Queries\n\n';
  doc+='```promql\n# Explanation Coverage\nrate(xai_explanation_generated_total[5m]) / rate(model_inference_total[5m])\n\n# Explanation Latency P95\nhistogram_quantile(0.95, rate(xai_explanation_duration_seconds_bucket[5m]))\n\n# Fairness Score (custom metric)\nxai_fairness_demographic_parity_diff{model="'+pn.toLowerCase().replace(/\s/g,'-')+'"}\n```\n\n';
  doc+='> '+(G?'📊 Grafana テンプレートID: 18921 (Responsible AI Dashboard) | 詳細は docs/106-2 §1 参照':'📊 Grafana template ID: 18921 (Responsible AI Dashboard) | See docs/106-2 §1 for details')+'\n\n';

  doc+='## '+(G?'§5 クロスリファレンスマップ':'§5 Cross-Reference Map')+'\n\n';
  doc+='| '+(G?'トピック':'Topic')+' | '+(G?'参照先':'Reference')+' | '+(G?'内容':'Content')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| XAI技法選定 | docs/98-2 §1 | '+(G?'SHAP/LIME/IG/Attention/Counterfactual マトリクス':'SHAP/LIME/IG/Attention/Counterfactual matrix')+' |\n';
  doc+='| フェアネスパイプライン | docs/129 | '+(G?'バイアス検出・緩和・継続監視':'Bias detection, mitigation, continuous monitoring')+' |\n';
  doc+='| AIガバナンス | docs/130 | '+(G?'AI審査委員会・リスク分類・ポリシー':'AI Review Board, risk classification, policy')+' |\n';
  doc+='| モデルライフサイクル | docs/131 | '+(G?'データ来歴・ドリフト検出・再学習':'Data lineage, drift detection, retraining')+' |\n';
  doc+='| AIランタイム監視 | docs/106-2 | '+(G?'LLMコスト・ハルシネーション・SLI/SLO':'LLM cost, hallucination, SLI/SLO')+' |\n';
  doc+='| セキュリティ | docs/43 | '+(G?'ゼロトラストAIエージェントゲートウェイ':'Zero Trust AI Agent Gateway')+' |\n';
  doc+='| レッドチーム | docs/131-2 | '+(G?'OWASP LLM Top 10・敵対的テスト':'OWASP LLM Top 10, adversarial testing')+' |\n\n';

  S.files['docs/128_xai_intelligence_architecture.md']=doc;
}

/* ── doc129: Fairness & Bias Pipeline ── */
function gen129(a,pn){
  const G=S.genLang==='ja';
  const xd=_xaiDomain(a);
  const scale=a.scale||'medium';
  let doc='# '+(G?'フェアネス・バイアスパイプライン':'Fairness & Bias Pipeline')+'\n\n';
  doc+='> '+(G?'本番グレードのバイアス検出・緩和・継続監視の完全実装ガイド':'Production-grade bias detection, mitigation, and continuous monitoring implementation guide')+'\n\n';

  doc+='## '+(G?'§1 フェアネスメトリクス参照':'§1 Fairness Metrics Reference')+'\n\n';
  doc+='| '+(G?'メトリクス':'Metric')+' | '+(G?'数式':'Formula')+' | '+(G?'推奨ドメイン':'Recommended Domain')+' | '+(G?'ツール':'Tool')+'|\n';
  doc+='|---|---|---|---|\n';
  FAIRNESS_METRICS.forEach(function(m){
    doc+='| **'+(G?m.ja:m.en)+'** | `'+m.formula+'` | '+(G?m.use_case_ja:m.use_case_en)+' | '+m.tool+' |\n';
    doc+='| | '+(G?m.ja_desc:m.en_desc)+' | | |\n';
  });
  doc+='\n';

  doc+='### '+(G?'ドメイン別メトリクス選択フローチャート':'Domain-specific Metric Selection Flowchart')+'\n\n';
  doc+='```\n';
  doc+=G?
    'AIシステムの目的は？\n├─ 採用・融資・審査 → Demographic Parity + Equalized Odds\n├─ 医療診断・リスクスコア → Calibration + Equalized Odds\n├─ コンテンツ推薦 → Individual Fairness + Predictive Parity\n└─ その他 → Demographic Parity (ベースライン)\n':
    'What is the AI system\'s purpose?\n├─ Hiring/loans/screening → Demographic Parity + Equalized Odds\n├─ Medical diagnosis/risk → Calibration + Equalized Odds\n├─ Content recommendation → Individual Fairness + Predictive Parity\n└─ Other → Demographic Parity (baseline)\n';
  doc+='```\n\n';

  doc+='## '+(G?'§2 バイアス検出パイプライン':'§2 Bias Detection Pipeline')+'\n\n';
  doc+='```\n';
  doc+=G?
    '1. データプロファイリング\n   → 保護属性の分布確認 (性別/年齢/国籍/障害)\n   → クラスラベルの不均衡検出\n   → 欠損値と代入バイアスの評価\n\n2. スライス分析\n   → 保護属性ごとのモデル性能分解\n   → 交差クループ (例: 女性×高齢) の評価\n   → ロングテールグループの特定\n\n3. メトリクス計算\n   → Demographic Parity Difference\n   → Equalized Odds Difference\n   → Calibration Error\n\n4. 閾値評価\n   → 許容差: |ΔDP| ≤ 0.05 (標準) / ≤ 0.02 (医療・法務)\n\n5. アラートと報告\n   → Slack/PagerDuty 通知\n   → 月次フェアネスレポート生成\n':
    '1. Data Profiling\n   → Analyze protected attribute distributions (gender/age/nationality/disability)\n   → Detect class label imbalance\n   → Evaluate missing values and imputation bias\n\n2. Slice Analysis\n   → Decompose model performance by protected attribute\n   → Evaluate intersectional groups (e.g., women×elderly)\n   → Identify long-tail groups\n\n3. Metric Computation\n   → Demographic Parity Difference\n   → Equalized Odds Difference\n   → Calibration Error\n\n4. Threshold Evaluation\n   → Tolerance: |ΔDP| ≤ 0.05 (standard) / ≤ 0.02 (medical/legal)\n\n5. Alert and Reporting\n   → Slack/PagerDuty notifications\n   → Monthly fairness report generation\n';
  doc+='```\n\n';

  doc+='### Python (Fairlearn)\n\n';
  doc+='```python\nfrom fairlearn.metrics import MetricFrame, demographic_parity_difference\nfrom fairlearn.metrics import equalized_odds_difference\nimport pandas as pd\n\n# '+(G?'フェアネスメトリクスフレームの作成':'Create fairness metric frame')+'\nmetric_frame = MetricFrame(\n    metrics={\n        "accuracy": accuracy_score,\n        "precision": precision_score,\n        "recall": recall_score,\n    },\n    y_true=y_test,\n    y_pred=y_pred,\n    sensitive_features=X_test["protected_attr"]\n)\n\n# '+(G?'人口統計的パリティ差異の計算':'Compute demographic parity difference')+'\ndp_diff = demographic_parity_difference(\n    y_test, y_pred,\n    sensitive_features=X_test["protected_attr"]\n)\nprint(f"Demographic Parity Difference: {dp_diff:.4f}")\nassert abs(dp_diff) <= 0.05, f"'+(G?'フェアネス閾値超過':'Fairness threshold exceeded')+': {dp_diff}"\n```\n\n';

  doc+='## '+(G?'§3 前処理緩和手法':'§3 Pre-processing Mitigation')+'\n\n';
  doc+='| '+(G?'手法':'Method')+' | '+(G?'説明':'Description')+' | '+(G?'精度低下':'Accuracy Trade-off')+' | '+(G?'推奨シナリオ':'Best For')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| Reweighing | '+(G?'サンプル重みを調整して差別を低減':'Adjust sample weights to reduce discrimination')+' | '+(G?'低 (1-3%)':'Low (1-3%)')+' | '+(G?'クラス不均衡時':'Class imbalance')+' |\n';
  doc+='| Disparate Impact Remover | '+(G?'保護属性と相関する特徴量を変換':'Transform features correlated with protected attr')+' | '+(G?'中 (3-7%)':'Med (3-7%)')+' | '+(G?'構造的バイアスが強い場合':'Strong structural bias')+' |\n';
  doc+='| LFR (Learning Fair Reps) | '+(G?'公平な潜在表現を学習':'Learn fair latent representations')+' | '+(G?'中-高 (5-10%)':'Med-High (5-10%)')+' | '+(G?'ディープラーニングモデル':'Deep learning models')+' |\n';
  doc+='| Optimized Preprocessing | '+(G?'フェアネス制約付き最適化':'Fairness-constrained optimization')+' | '+(G?'低-中 (2-5%)':'Low-Med (2-5%)')+' | '+(G?'高精度が求められる場合':'High accuracy required')+' |\n\n';

  doc+='## '+(G?'§4 後処理緩和手法':'§4 Post-processing Mitigation')+'\n\n';
  doc+='```python\nfrom fairlearn.postprocessing import ThresholdOptimizer\n\n# '+(G?'閾値最適化によるフェアネス改善':'Improve fairness via threshold optimization')+'\noptimized_model = ThresholdOptimizer(\n    estimator=base_model,\n    constraints="equalized_odds",\n    objective="balanced_accuracy_score",\n    predict_method="predict_proba"\n)\noptimized_model.fit(X_train, y_train,\n    sensitive_features=X_train["protected_attr"])\ny_pred_fair = optimized_model.predict(X_test,\n    sensitive_features=X_test["protected_attr"])\n```\n\n';

  doc+='| '+(G?'手法':'Method')+' | '+(G?'説明':'Description')+' | '+(G?'適用タイミング':'When to Apply')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| Reject Option Classification | '+(G?'不確実な予測を反転させてフェアネス向上':'Flip uncertain predictions to improve fairness')+' | '+(G?'2値分類問題':'Binary classification')+' |\n';
  doc+='| Calibrated Equalized Odds | '+(G?'均等化オッズ制約付きキャリブレーション':'Calibration with equalized odds constraint')+' | '+(G?'確率スコアが必要な場合':'When probability scores needed')+' |\n';
  doc+='| Threshold Optimizer | '+(G?'グループ別決定境界を最適化':'Optimize decision boundaries per group')+' | '+(G?'複数の保護属性がある場合':'Multiple protected attributes')+' |\n\n';

  doc+='## '+(G?'§5 継続的フェアネス監視':'§5 Continuous Fairness Monitoring')+'\n\n';
  if(scale==='solo'){
    doc+='> '+(G?'ℹ️ solo構成ではシンプルな週次バッチ評価を推奨します。':'ℹ️ For solo scale, simple weekly batch evaluation is recommended.')+'\n\n';
  }
  doc+='### CI/CD Fairness Gate\n\n';
  doc+='```yaml\n# .github/workflows/fairness-check.yml\n- name: Fairness Gate\n  run: |\n    python scripts/fairness_check.py \\\n      --model artifacts/model.pkl \\\n      --test-data data/test_with_protected.csv \\\n      --threshold 0.05 \\\n      --metric demographic_parity\n  # '+(G?'失敗時はモデルデプロイをブロック':'Block model deployment on failure')+'\n```\n\n';

  doc+='### Prometheus Fairness Metrics\n\n';
  doc+='```promql\n# Demographic Parity Difference\nfairness_demographic_parity_diff{model="'+pn.toLowerCase().replace(/\s/g,'-')+'",split="test"}\n\n# Equalized Odds Difference by group\nfairness_equalized_odds_diff{model="'+pn.toLowerCase().replace(/\s/g,'-')+'",group="A"}\n```\n\n';
  doc+='> '+(G?'📘 ドリフト後の再学習パイプラインは `docs/131 §4` を参照':'📘 See `docs/131 §4` for post-drift retraining pipeline')+'\n\n';

  doc+='## '+(G?'§6 データカードテンプレート (Google Data Cards Playbook)':'§6 Data Card Template (Google Data Cards Playbook)')+'\n\n';
  doc+='```yaml\ndata_card:\n  name: "'+(pn||'Project')+' Training Dataset"\n  version: "1.0.0"\n  last_updated: "'+new Date().toISOString().split('T')[0]+'"\n\n  overview:\n    description: "'+(G?'モデル学習に使用するデータセット概要':'Dataset overview for model training')+'"\n    intended_use: "'+(G?'機械学習モデルの学習・評価':'ML model training and evaluation')+'"\n    out_of_scope: "'+(G?'規制対象の高リスク自律判断':'Regulated high-risk autonomous decisions')+'"\n\n  provenance:\n    sources: []\n    collection_method: ""\n    date_range: ""\n    geographic_coverage: ""\n\n  composition:\n    total_records: 0\n    protected_attributes: ["gender", "age", "nationality"]\n    class_distribution: {}\n    known_biases: []\n\n  preprocessing:\n    steps: []\n    tools: []\n\n  fairness:\n    metrics_evaluated: ["demographic_parity", "equalized_odds"]\n    known_limitations: []\n    mitigation_applied: []\n\n  maintenance:\n    update_cadence: "monthly"\n    owner: ""\n    contact: ""\n```\n\n';

  S.files['docs/129_fairness_bias_pipeline.md']=doc;
}

/* ── doc130: AI Governance Framework ── */
function gen130(a,pn){
  const G=S.genLang==='ja';
  const xd=_xaiDomain(a);
  const scale=a.scale||'medium';
  const hasAI=_hasAIForXAI(a);

  let doc='# '+(G?'AIガバナンスフレームワーク':'AI Governance Framework')+'\n\n';
  doc+='> '+(G?'組織全体のAI倫理・リスク管理・説明責任の体系的フレームワーク':'Systematic framework for organizational AI ethics, risk management, and accountability')+'\n\n';

  doc+='## '+(G?'§1 AI審査委員会 (AI Review Board) 憲章':'§1 AI Review Board Charter')+'\n\n';
  if(scale==='solo'){
    doc+='> '+(G?'ℹ️ solo構成では簡略版ガバナンス: 個人責任チェックリスト + 定期セルフレビューで代替可能':'ℹ️ For solo scale, simplified governance: personal accountability checklist + periodic self-review')+'\n\n';
    doc+='### '+(G?'個人AIガバナンスチェックリスト':'Personal AI Governance Checklist')+'\n\n';
    doc+='- [ ] '+(G?'AIシステムのリスク自己評価 (年1回)':'Self-assessment of AI system risks (annually)')+'\n';
    doc+='- [ ] '+(G?'フェアネスメトリクスのモニタリング (月1回)':'Fairness metric monitoring (monthly)')+'\n';
    doc+='- [ ] '+(G?'モデルドリフトの確認 (週1回)':'Model drift check (weekly)')+'\n';
    doc+='- [ ] '+(G?'インシデントログの更新 (発生時)':'Incident log update (as needed)')+'\n\n';
  }else{
    doc+='### '+(G?'委員会構成':'Board Composition')+'\n\n';
    doc+='| '+(G?'役職':'Role')+' | '+(G?'責任':'Responsibilities')+' | '+(G?'必須':'Required')+'|\n';
    doc+='|---|---|---|\n';
    doc+='| AI '+(G?'倫理責任者':'Ethics Officer')+' | '+(G?'倫理方針策定・外部コンプライアンス':'Ethics policy, external compliance')+' | ✅ |\n';
    doc+='| '+(G?'最高データ責任者 (CDO)':'Chief Data Officer (CDO)')+' | '+(G?'データ品質・プライバシー・カード管理':'Data quality, privacy, data cards')+' | '+(scale==='large'?'✅':'推奨')+' |\n';
    doc+='| '+(G?'ML/AIエンジニアリングリード':'ML/AI Engineering Lead')+' | '+(G?'技術実装・テスト・デプロイ監視':'Technical implementation, testing, deployment')+' | ✅ |\n';
    doc+='| '+(G?'法務・コンプライアンス':'Legal & Compliance')+' | '+(G?'規制対応・契約レビュー':'Regulatory compliance, contract review')+' | '+(scale==='large'?'✅':'推奨')+' |\n';
    doc+='| '+(G?'ドメイン専門家 (外部)':'Domain Expert (External)')+' | '+(G?'独立した第三者視点でのレビュー':'Independent third-party review')+' | '+(xd.isHighRisk?'✅':G?'任意':'Optional')+' |\n\n';

    doc+='### '+(G?'審査サイクル':'Review Cadence')+'\n\n';
    doc+='- '+(G?'**週次**: 自動フェアネス・ドリフト監視ダッシュボード確認':'**Weekly**: Automated fairness & drift monitoring dashboard review')+'\n';
    doc+='- '+(G?'**月次**: インシデントレビュー・メトリクストレンド分析':'**Monthly**: Incident review, metrics trend analysis')+'\n';
    doc+='- '+(G?'**四半期**: AIシステム全体の影響評価・リスク再分類':'**Quarterly**: Full AI system impact assessment, risk reclassification')+'\n';
    doc+='- '+(G?'**年次**: ガバナンス方針の全面見直し・外部監査':'**Annual**: Full governance policy review, external audit')+'\n\n';
  }

  doc+='## '+(G?'§2 AIシステムレジストリ':'§2 AI System Registry')+'\n\n';
  doc+='```typescript\ninterface AISystemRegistryEntry {\n  // '+(G?'基本情報':'Basic Info')+'\n  id: string;                    // "ai-sys-001"\n  name: string;                  // "'+(pn||'System')+' AI Engine"\n  version: string;               // "2.1.0"\n  owner: string;                 // "engineering-team"\n\n  // '+(G?'分類':'Classification')+'\n  riskTier: "unacceptable" | "high-risk" | "limited" | "minimal";\n  domain: string;                // "'+(xd.domain||'general')+'"\n  deploymentEnv: "production" | "staging" | "development";\n\n  // EU AI Act Article 13 Metadata\n  euAiAct: {\n    riskCategory: string;\n    conformityAssessment: boolean;\n    humanOversightMechanism: string;\n    explainabilityMethod: "SHAP" | "LIME" | "IG" | "none";\n    dataCardPath: string;\n  };\n\n  // '+(G?'監視設定':'Monitoring Config')+'\n  monitoring: {\n    fairnessThreshold: number;   // 0.05\n    driftAlertPSI: number;       // 0.2\n    retrainingTrigger: string;   // "psi > 0.2 OR accuracy_drop > 5%"\n  };\n\n  // '+(G?'承認履歴':'Approval History')+'\n  approvals: Array<{\n    date: string;\n    approver: string;\n    outcome: "approved" | "rejected" | "conditional";\n    notes: string;\n  }>;\n}\n```\n\n';

  doc+='## '+(G?'§3 リスク分類ワークフロー (4ティア)':'§3 Risk Classification Workflow (4-tier)')+'\n\n';
  AI_RISK_TIERS.forEach(function(t){
    doc+='### '+t.color+' Tier '+t.tier+': '+(G?t.ja:t.level)+'\n\n';
    doc+='- **'+(G?'定義':'Definition')+'**: '+(G?t.ja_desc:t.en_desc)+'\n';
    doc+='- **'+(G?'対処':'Action')+'**: '+t.action+'\n';
    doc+='- **'+(G?'例':'Examples')+'**: '+(G?(t.examples_ja||[]).join(', '):(t.examples_en||[]).join(', '))+'\n\n';
  });

  doc+='### '+(G?'分類フロー':'Classification Decision Flow')+'\n\n';
  doc+='```\n';
  doc+=G?
    '人間の権限・基本的権利に重大な影響 AND 人間監視なし?\n  → YES → Tier 0 (受容不可)\n  → NO ↓\n重要インフラ・採用・医療・法執行への影響?\n  → YES → Tier 1 (高リスク) → 適合性評価が必要\n  → NO ↓\n人間との対話を含む?\n  → YES → Tier 2 (限定リスク) → 透明性開示が必要\n  → NO → Tier 3 (最小リスク)\n':
    'Significant impact on human rights/fundamental rights AND no human oversight?\n  → YES → Tier 0 (Unacceptable)\n  → NO ↓\nImpact on critical infrastructure, hiring, medical, law enforcement?\n  → YES → Tier 1 (High-Risk) → Conformity assessment required\n  → NO ↓\nInvolves human interaction?\n  → YES → Tier 2 (Limited Risk) → Transparency disclosure required\n  → NO → Tier 3 (Minimal Risk)\n';
  doc+='```\n\n';

  if(xd.isHighRisk){
    doc+='> ⚠️ **'+(G?'プロジェクト判定':'Project Assessment')+'**: '+(G?xd.domain+'ドメインは「高リスク (Tier 1)」に分類されます。EU AI Act 適合性評価とフェアネスパイプライン (docs/129) の実装が必要です。':xd.domain+' domain is classified as "High-Risk (Tier 1)". EU AI Act conformity assessment and fairness pipeline (docs/129) implementation required.')+'\n\n';
  }

  doc+='## '+(G?'§4 AI影響評価 (AIA) テンプレート':'§4 AI Impact Assessment (AIA) Template')+'\n\n';
  doc+='```markdown\n## AI影響評価書 / AI Impact Assessment\n\n**システム名**: '+pn+'\n**評価日**: '+new Date().toISOString().split('T')[0]+'\n**評価者**: \n\n### 1. '+(G?'システム概要':'System Description')+'\n- '+(G?'目的':'Purpose')+': \n- '+(G?'対象ユーザー':'Target Users')+': \n- '+(G?'自動化レベル':'Automation Level')+': \n\n### 2. '+(G?'ステークホルダー分析':'Stakeholder Analysis')+'\n- '+(G?'直接影響者':'Direct Impacted')+': \n- '+(G?'間接影響者':'Indirect Impacted')+': \n- '+(G?'脆弱なグループ':'Vulnerable Groups')+': \n\n### 3. '+(G?'権利・自由への影響':'Rights & Freedoms Impact')+'\n- '+(G?'プライバシーリスク':'Privacy Risk')+': '+(G?'低/中/高':'Low/Med/High')+'\n- '+(G?'差別リスク':'Discrimination Risk')+': '+(G?'低/中/高':'Low/Med/High')+'\n- '+(G?'自律性の侵害':'Autonomy Infringement')+': '+(G?'なし/あり':'None/Present')+'\n\n### 4. '+(G?'データ管理':'Data Management')+'\n- '+(G?'学習データソース':'Training Data Sources')+': \n- '+(G?'保護属性の処理':'Protected Attribute Handling')+': \n- '+(G?'データ保持期間':'Data Retention')+': \n\n### 5. '+(G?'アルゴリズム透明性':'Algorithm Transparency')+'\n- '+(G?'モデルタイプ':'Model Type')+': \n- '+(G?'説明可能性手法':'Explainability Method')+': \n- '+(G?'人間監視メカニズム':'Human Oversight Mechanism')+': \n\n### 6. '+(G?'リスク緩和策':'Risk Mitigation')+'\n- [ ] '+(G?'フェアネスメトリクス監視 (docs/129)':'Fairness metrics monitoring (docs/129)')+'\n- [ ] '+(G?'ドリフト検出 (docs/131)':'Drift detection (docs/131)')+'\n- [ ] '+(G?'インシデント対応計画 (docs/34)':'Incident response plan (docs/34)')+'\n\n### 7. '+(G?'承認':'Sign-off')+'\n- '+(G?'承認者':'Approved By')+': \n- '+(G?'承認日':'Date')+': \n- '+(G?'次回見直し':'Next Review')+': \n```\n\n';

  doc+='## '+(G?'§5 責任あるAIポリシーテンプレート (スケール適応)':'§5 Responsible AI Policy Template (Scale-adaptive)')+'\n\n';
  if(scale==='solo'){
    doc+='```markdown\n# '+(G?'個人AI利用方針':'Personal AI Usage Policy')+'\n\n1. '+(G?'AIシステムの目的を明確にし、意図しない用途への転用を行わない':'Clearly define AI system purpose; do not repurpose for unintended uses')+'\n2. '+(G?'AIの判断を盲目的に信頼せず、人間による検証を怠らない':'Do not blindly trust AI decisions; always apply human verification')+'\n3. '+(G?'データのプライバシーと機密性を保護する':'Protect data privacy and confidentiality')+'\n4. '+(G?'フェアネスに関わる問題を発見した場合、直ちに記録・修正する':'Document and fix fairness issues immediately when discovered')+'\n```\n\n';
  }else if(scale==='large'){
    doc+='```markdown\n# '+(G?'エンタープライズAI倫理・ガバナンス方針':'Enterprise AI Ethics & Governance Policy')+'\n\n## '+(G?'原則':'Principles')+'\n1. '+(G?'人間中心設計: AIは人間の意思決定を補完し、代替しない':'Human-centered: AI augments, not replaces, human decision-making')+'\n2. '+(G?'透明性: すべての高リスクAI意思決定に説明を提供する':'Transparency: provide explanations for all high-risk AI decisions')+'\n3. '+(G?'公平性: 保護属性に基づく差別的結果を防止する':'Fairness: prevent discriminatory outcomes based on protected attributes')+'\n4. '+(G?'安全性: リスクに比例した保護措置を実装する':'Safety: implement protections proportional to risks')+'\n5. '+(G?'説明責任: AIシステムのオーナーシップと責任を明確にする':'Accountability: clearly define AI system ownership and responsibility')+'\n\n## '+(G?'適用範囲':'Scope')+'\n- '+(G?'本方針はすべての本番AIシステムに適用される':'This policy applies to all production AI systems')+'\n- '+(G?'外部委託AIサービスも含む':'Includes outsourced AI services')+'\n\n## '+(G?'コンプライアンス':'Compliance')+'\n- EU AI Act (2026施行)\n- ISO/IEC 42001\n- NIST AI RMF\n```\n\n';
  }else{
    doc+='```markdown\n# '+(G?'AI利用ガバナンス方針':'AI Usage Governance Policy')+'\n\n## '+(G?'目的':'Purpose')+'\n'+(G?'本方針は、AIシステムの責任ある開発・運用のための基準を定める':'This policy establishes standards for responsible AI development and operation')+'\n\n## '+(G?'適用原則':'Applied Principles')+'\n1. '+(G?'透明性: AI意思決定の根拠を説明可能にする':'Transparency: make AI decision rationale explainable')+'\n2. '+(G?'公平性: 定期的なフェアネス評価を実施する':'Fairness: conduct regular fairness evaluations')+'\n3. '+(G?'安全性: インシデント対応計画を整備する':'Safety: maintain incident response plan')+'\n\n## '+(G?'レビューサイクル':'Review Cycle')+'\n- '+(G?'四半期ごとにフェアネスレポートをレビュー':'Review fairness reports quarterly')+'\n- '+(G?'年次でAIA (AI影響評価) を更新':'Update AIA annually')+'\n```\n\n';
  }

  doc+='## '+(G?'§6 AIインシデントレスポンス':'§6 AI Incident Response')+'\n\n';
  doc+='| '+(G?'インシデントタイプ':'Incident Type')+' | '+(G?'検出方法':'Detection')+' | '+(G?'対応フロー':'Response Flow')+' | '+(G?'参照':'Reference')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| '+(G?'バイアス/差別の顕在化':'Bias/Discrimination')+' | '+(G?'フェアネスアラート':'Fairness alert')+' | '+(G?'モデル一時停止→影響評価→緩和→再デプロイ':'Pause model→Impact assess→Mitigate→Redeploy')+' | docs/129 |\n';
  doc+='| '+(G?'ハルシネーション多発':'Hallucination Spike')+' | '+(G?'RAGAS スコア低下':'RAGAS score drop')+' | '+(G?'RAGパイプライン検証→グラウンディング強化':'Verify RAG→Strengthen grounding')+' | docs/106-2 |\n';
  doc+='| '+(G?'機密情報漏洩':'Data Leakage')+' | '+(G?'出力監視フィルター':'Output monitoring filter')+' | '+(G?'即座シャットダウン→フォレンジック→パッチ':'Immediate shutdown→Forensics→Patch')+' | docs/34 |\n';
  doc+='| '+(G?('敵対的攻撃 (プロンプトインジェクション)'):'Adversarial Attack (Prompt Injection)')+' | '+(G?'インジェクション検知':'Injection detection')+' | '+(G?'ブロック→ログ→パターン更新':'Block→Log→Update patterns')+' | docs/131-2 |\n';
  doc+='| '+(G?'モデル性能劣化':'Model Performance Degradation')+' | '+(G?'ドリフトアラート':'Drift alert')+' | '+(G?'ドリフト分析→再学習トリガー':'Drift analysis→Retrain trigger')+' | docs/131 |\n\n';
  doc+='> '+(G?'📘 セキュリティインシデント対応の詳細は `docs/34_security_incident.md` を参照':'📘 See `docs/34_security_incident.md` for security incident response details')+'\n\n';

  S.files['docs/130_ai_governance_framework.md']=doc;
}

/* ── doc131: Model Lifecycle Intelligence ── */
function gen131(a,pn){
  const G=S.genLang==='ja';
  const scale=a.scale||'medium';
  const hasAI=_hasAIForXAI(a);
  const backend=a.backend||'';
  let doc='# '+(G?'モデルライフサイクル・インテリジェンス':'Model Lifecycle Intelligence')+'\n\n';
  doc+='> '+(G?'データ来歴・バージョン管理・ドリフト検出・再学習パイプラインの完全ガイド':'Complete guide for data lineage, versioning, drift detection, and retraining pipelines')+'\n\n';

  doc+='## '+(G?'§1 データ来歴とプロベナンス':'§1 Data Lineage & Provenance')+'\n\n';
  doc+='### '+(G?'来歴スキーマ':'Provenance Schema')+'\n\n';
  doc+='```python\n# '+(G?'データ来歴追跡スキーマ':'Data provenance tracking schema')+'\nfrom dataclasses import dataclass\nfrom typing import List, Optional\nfrom datetime import datetime\n\n@dataclass\nclass DataProvenance:\n    dataset_id: str\n    version: str\n    created_at: datetime\n    source_systems: List[str]\n    transformation_steps: List[str]\n    quality_score: float           # 0.0-1.0\n    pii_scanned: bool\n    fairness_audited: bool\n    approved_by: Optional[str]\n    data_card_path: str            # docs/129 §6\n```\n\n';

  doc+='### DVC Pipeline\n\n';
  doc+='```yaml\n# dvc.yaml\nstages:\n  data_collection:\n    cmd: python src/data/collect.py\n    outs:\n      - data/raw/\n    params:\n      - params.yaml:\n          - data.source\n          - data.date_range\n\n  preprocessing:\n    cmd: python src/data/preprocess.py\n    deps:\n      - data/raw/\n    outs:\n      - data/processed/\n    metrics:\n      - metrics/data_quality.json:\n          cache: false\n\n  fairness_audit:\n    cmd: python scripts/fairness_check.py\n    deps:\n      - data/processed/\n    metrics:\n      - metrics/fairness.json:\n          cache: false\n```\n\n';

  doc+='## '+(G?'§2 モデルバージョニングとレジストリ':'§2 Model Versioning & Registry')+'\n\n';
  doc+='```python\nimport mlflow\nimport mlflow.sklearn\n\n# '+(G?'MLflow実験管理':'MLflow experiment management')+'\nmlflow.set_experiment("'+pn.toLowerCase().replace(/\s/g,'-')+'-model-training")\n\nwith mlflow.start_run():\n    # '+(G?'ハイパーパラメータのログ':'Log hyperparameters')+'\n    mlflow.log_params({\n        "model_type": "RandomForest",\n        "n_estimators": 100,\n        "fairness_constraint": "equalized_odds"\n    })\n\n    # '+(G?'モデル学習':'Train model')+'\n    model.fit(X_train, y_train)\n\n    # '+(G?'メトリクスのログ':'Log metrics')+'\n    mlflow.log_metrics({\n        "accuracy": accuracy_score(y_test, y_pred),\n        "fairness_dp_diff": dp_diff,\n        "calibration_error": cal_error\n    })\n\n    # '+(G?'モデルの登録':'Register model')+'\n    mlflow.sklearn.log_model(\n        model, "model",\n        registered_model_name="'+pn.toLowerCase().replace(/\s/g,'-')+'-classifier"\n    )\n```\n\n';

  doc+='### '+(G?'モデルライフサイクルステージ':'Model Lifecycle Stages')+'\n\n';
  doc+='```\n';
  doc+=G?
    'Development → Staging → Production → Archived\n     ↓              ↓            ↓           ↓\n  ユニットテスト  統合テスト   A/Bテスト   定期見直し\n  フェアネス評価  負荷テスト   ドリフト監視  コスト分析\n':
    'Development → Staging → Production → Archived\n     ↓              ↓            ↓           ↓\n  Unit tests   Integration    A/B testing   Periodic\n  Fairness     Load tests     Drift monitor  Cost analysis\n';
  doc+='```\n\n';

  doc+='## '+(G?'§3 ドリフト検出とモニタリング':'§3 Drift Detection & Monitoring')+'\n\n';
  doc+='### '+(G?'3種類のドリフト':'3 Types of Drift')+'\n\n';
  doc+='| '+(G?'タイプ':'Type')+' | '+(G?'定義':'Definition')+' | '+(G?'症状':'Symptoms')+' | '+(G?'検出手法':'Detection')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| Data Drift | '+(G?'入力データ分布の変化':'Input data distribution shift')+' | '+(G?'PSI増加・フィーチャー分布変化':'PSI increase, feature distribution change')+' | PSI, KS-test |\n';
  doc+='| Concept Drift | '+(G?'入出力関係の変化':'Input-output relationship change')+' | '+(G?'精度低下・予測分布変化':'Accuracy drop, prediction distribution change')+' | ADWIN, DDM |\n';
  doc+='| Prediction Drift | '+(G?'予測値分布の変化':'Predicted value distribution shift')+' | '+(G?'ポジティブ予測率の急変':'Sudden positive prediction rate change')+' | PSI on predictions |\n\n';

  doc+='### '+(G?'5つの検出手法と閾値':'5 Detection Methods & Thresholds')+'\n\n';
  doc+='| '+(G?'手法':'Method')+' | '+(G?'数式':'Formula')+' | '+(G?'閾値':'Threshold')+' | '+(G?'ライブラリ':'Library')+'|\n';
  doc+='|---|---|---|---|\n';
  DRIFT_DETECTORS.forEach(function(d){
    doc+='| **'+d.name+'** | `'+d.formula+'` | '+(G?d.threshold_ja:d.threshold_en)+' | '+d.lib+' |\n';
  });
  doc+='\n';

  doc+='### Python (Evidently AI)\n\n';
  doc+='```python\nfrom evidently.test_suite import TestSuite\nfrom evidently.tests import TestNumberOfDriftedColumns\nfrom evidently.tests import TestShareOfDriftedColumns\nfrom evidently import ColumnMapping\n\n# '+(G?'ドリフト検出スイートの設定':'Configure drift detection suite')+'\ndata_drift_suite = TestSuite(tests=[\n    TestNumberOfDriftedColumns(lt=5),\n    TestShareOfDriftedColumns(lt=0.3),\n])\n\n# '+(G?'参照データ vs 現在データの比較':'Compare reference vs current data')+'\ndata_drift_suite.run(\n    reference_data=reference_df,\n    current_data=current_df,\n    column_mapping=ColumnMapping(\n        target="label",\n        prediction="prediction",\n        numerical_features=num_features\n    )\n)\n\n# '+(G?'結果の評価':'Evaluate results')+'\nresult = data_drift_suite.as_dict()\nif not result["summary"]["all_passed"]:\n    trigger_retraining_pipeline()\n    alert_team("'+(G?'データドリフト検出':'Data Drift Detected')+'", result)\n```\n\n';

  doc+='### Prometheus Integration\n\n';
  doc+='```python\nfrom prometheus_client import Gauge, Counter\n\n# '+(G?'ドリフトメトリクス定義':'Define drift metrics')+'\nmodel_drift_psi = Gauge(\n    "model_feature_psi",\n    "'+(G?'フィーチャーのPSI値':'Feature PSI value')+' ",\n    ["feature_name", "model_id"]\n)\nmodel_retraining_total = Counter(\n    "model_retraining_triggered_total",\n    "'+(G?'再学習トリガー回数':'Retraining trigger count')+' ",\n    ["trigger_reason"]\n)\n```\n\n';

  doc+='## '+(G?'§4 自動再学習パイプライン':'§4 Automated Retraining Pipeline')+'\n\n';
  doc+='### '+(G?'トリガー条件':'Trigger Conditions')+'\n\n';
  doc+='| '+(G?'条件':'Condition')+' | '+(G?'閾値':'Threshold')+' | '+(G?'優先度':'Priority')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| Data Drift (PSI) | > 0.2 | '+(G?'高':'High')+' |\n';
  doc+='| '+(G?'精度低下':'Accuracy Drop')+' | > 5% | '+(G?'高':'High')+' |\n';
  doc+='| '+(G?'フェアネス劣化':'Fairness Degradation')+' | |ΔDP| > 0.05 | '+(G?'高':'High')+' |\n';
  doc+='| '+(G?'定期スケジュール':'Scheduled')+' | '+(scale==='large'?G?'週次':'Weekly':G?'月次':'Monthly')+' | '+(G?'低':'Low')+' |\n\n';

  doc+='```yaml\n# .github/workflows/model-retrain.yml\nname: Model Retraining\non:\n  schedule:\n    - cron: "'+(scale==='large'?'0 2 * * 1':'0 2 1 * *')+'"\n  workflow_dispatch:\n    inputs:\n      trigger_reason:\n        description: "Trigger reason (drift/accuracy/fairness/scheduled)"\n\njobs:\n  retrain:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Validate Data\n        run: python scripts/validate_training_data.py\n      - name: Train Model\n        run: python src/train.py\n      - name: Evaluate Fairness\n        run: python scripts/fairness_check.py\n      - name: A/B Test Gate\n        run: python scripts/ab_test_compare.py --threshold 0.02\n      - name: Deploy if Approved\n        if: success()\n        run: python scripts/deploy_model.py --stage production\n```\n\n';

  doc+='## '+(G?'§5 モデルA/Bテスト':'§5 A/B Testing for Models')+'\n\n';
  doc+='```python\nimport random\nfrom typing import Union\n\nclass ModelABRouter:\n    def __init__(self, model_a, model_b, traffic_split: float = 0.1):\n        self.model_a = model_a    # '+(G?'現行モデル':'Current model')+'\n        self.model_b = model_b    # '+(G?'新モデル':'New model (candidate)')+'\n        self.split = traffic_split  # '+(G?'新モデルへのトラフィック割合':'Traffic % to new model')+'\n\n    def predict(self, X, user_id: str):\n        # '+(G?'決定論的A/Bルーティング':'Deterministic A/B routing')+'\n        use_b = int(user_id.split(\'-\')[-1], 16) % 100 < self.split * 100\n        model = self.model_b if use_b else self.model_a\n        variant = \'B\' if use_b else \'A\'\n        prediction = model.predict(X)\n\n        # '+(G?'A/B実験メトリクスのログ':'Log A/B experiment metrics')+'\n        ab_experiment_results.labels(\n            variant=variant, model_version=model.version\n        ).inc()\n        return prediction\n```\n\n';

  doc+='| '+(G?'評価メトリクス':'Evaluation Metrics')+' | '+(G?'最小改善幅':'Min Improvement')+' | '+(G?'統計的有意性':'Statistical Significance')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| '+(G?'精度':'Accuracy')+' | > +1% | p < 0.05 |\n';
  doc+='| '+(G?'フェアネス':'Fairness')+' (|ΔDP|) | < -0.01 | p < 0.05 |\n';
  doc+='| '+(G?'レイテンシ':'Latency')+' P95 | < +50ms | - |\n\n';

  doc+='## '+(G?'§6 モデル廃止とロールバック':'§6 Model Deprecation & Rollback')+'\n\n';
  doc+='### '+(G?'廃止ポリシー':'Deprecation Policy')+'\n\n';
  doc+='| '+(G?'ドメイン':'Domain')+' | '+(G?'最低保持期間':'Min Retention')+' | '+(G?'理由':'Reason')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| '+(G?'医療':'Medical')+' | 10'+(G?'年':'years')+' | '+(G?'医療機器規制 (PMDA/FDA)':'Medical device regulation (PMDA/FDA)')+' |\n';
  doc+='| '+(G?'金融':'Financial')+' | 7'+(G?'年':'years')+' | '+(G?'金融規制・訴訟リスク':'Financial regulation, litigation risk')+' |\n';
  doc+='| '+(G?'一般':'General')+' | 2'+(G?'年':'years')+' | '+(G?'監査対応':'Audit compliance')+' |\n\n';

  doc+='```python\ndef rollback_model(model_id: str, reason: str):\n    """'+(G?'即時ロールバック + 監査ログ記録':'Immediate rollback + audit log recording')+'"""\n    # '+(G?'前バージョンを本番に昇格':'Promote previous version to production')+'\n    mlflow_client.transition_model_version_stage(\n        name=model_id, version=get_previous_version(model_id),\n        stage="Production"\n    )\n    # '+(G?'現行バージョンをアーカイブ':'Archive current version')+'\n    mlflow_client.transition_model_version_stage(\n        name=model_id, version=get_current_version(model_id),\n        stage="Archived"\n    )\n    # '+(G?'監査ログ記録':'Record audit log')+'\n    audit_log.record(action="model_rollback", model_id=model_id,\n                     reason=reason, timestamp=datetime.utcnow())\n    alert_team(f"'+(G?'モデルロールバック実行':'Model Rollback Executed')+': {model_id} — {reason}")\n```\n\n';

  S.files['docs/131_model_lifecycle_intelligence.md']=doc;
}

/* ── doc131-2: AI Red Team & Adversarial Testing (conditional) ── */
function gen131_2(a,pn){
  const G=S.genLang==='ja';
  const isAgent=_isAgentMode28(a);
  const xd=_xaiDomain(a);
  let doc='# '+(G?'AIレッドチーム・敵対的テスト':'AI Red Team & Adversarial Testing')+'\n\n';
  doc+='> '+(G?'LLM/AIシステムの安全性を系統的に評価するレッドチーム方法論とOWASP LLM Top 10対応':'Systematic red team methodology and OWASP LLM Top 10 coverage for evaluating LLM/AI system safety')+'\n\n';

  doc+='## '+(G?'§1 レッドチーム方法論':'§1 Red Teaming Methodology')+'\n\n';
  doc+='### '+(G?'チーム構成':'Team Composition')+'\n\n';
  doc+='| '+(G?'役割':'Role')+' | '+(G?'担当':'Responsibility')+' | '+(G?'必須':'Required')+'|\n';
  doc+='|---|---|---|\n';
  doc+='| Red Team Lead | '+(G?'テスト計画・スコープ定義・レポート作成':'Test plan, scope definition, reporting')+' | ✅ |\n';
  doc+='| '+(G?'ドメイン専門家':'Domain Expert')+' | '+(G?xd.isHighRisk?'医療/金融/法務の規制知識とリスク特定':'Domain-specific risk identification and regulatory knowledge':'ドメイン固有のリスク特定')+' | '+(xd.isHighRisk?'✅':G?'推奨':'Recommended')+' |\n';
  doc+='| '+(G?'セキュリティエンジニア':'Security Engineer')+' | '+(G?'テクニカルアタック実行・ツール操作':'Execute technical attacks, operate tools')+' | ✅ |\n';
  doc+='| '+(G?'社会科学者/倫理専門家':'Social Scientist/Ethicist')+' | '+(G?'バイアス・差別・心理的ハームの評価':'Evaluate bias, discrimination, psychological harms')+' | '+(G?'推奨':'Recommended')+' |\n\n';

  doc+='### '+(G?'レッドチームフェーズ':'Red Team Phases')+'\n\n';
  doc+='```\n';
  doc+=G?
    'Phase 1: スコープ定義 (1-2日)\n  → テスト対象システム・エンドポイント定義\n  → 攻撃シナリオの優先順位付け\n  → ルール・倫理的制約の確認\n\nPhase 2: 情報収集 (2-3日)\n  → システムプロンプト・API構造の偵察\n  → 入出力形式の把握\n  → 既知の脆弱パターンの確認\n\nPhase 3: 攻撃実行 (3-5日)\n  → OWASP LLM Top 10 ベースのテスト\n  → ツール支援による自動化テスト\n  → マニュアルクリエイティブテスト\n\nPhase 4: 報告 (1-2日)\n  → 発見事項の重大度分類\n  → 緩和策の推奨\n  → エグゼクティブサマリー作成\n':
    'Phase 1: Scope Definition (1-2 days)\n  → Define target systems and endpoints\n  → Prioritize attack scenarios\n  → Confirm rules of engagement and ethical constraints\n\nPhase 2: Reconnaissance (2-3 days)\n  → Probe system prompts and API structure\n  → Understand I/O formats\n  → Review known vulnerability patterns\n\nPhase 3: Attack Execution (3-5 days)\n  → OWASP LLM Top 10 based testing\n  → Automated testing with tools\n  → Manual creative testing\n\nPhase 4: Reporting (1-2 days)\n  → Classify severity of findings\n  → Recommend mitigations\n  → Prepare executive summary\n';
  doc+='```\n\n';
  doc+='> '+(G?'📘 AIガードレール実装の詳細は `docs/98_prompt_injection_defense.md` を参照':'📘 See `docs/98_prompt_injection_defense.md` for AI guardrail implementation details')+'\n\n';

  doc+='## '+(G?'§2 攻撃タクソノミー (OWASP LLM Top 10)':'§2 Attack Taxonomy (OWASP LLM Top 10)')+'\n\n';
  doc+='| OWASP ID | '+(G?'攻撃名':'Attack')+' | '+(G?'深刻度':'Severity')+' | '+(G?'テスト手法':'Test Method')+' | '+(G?'緩和策':'Mitigation')+'|\n';
  doc+='|---|---|---|---|---|\n';
  RED_TEAM_ATTACKS.forEach(function(atk){
    doc+='| '+atk.owasp+' | **'+(G?atk.ja:atk.name)+'** | '+atk.severity+' | '+(G?atk.ja_test:atk.en_test)+' | '+(G?atk.ja_mit:atk.en_mit)+' |\n';
  });
  doc+='\n';

  doc+='## '+(G?'§3 敵対的テストツール':'§3 Adversarial Testing Tools')+'\n\n';
  doc+='| '+(G?'ツール':'Tool')+' | '+(G?'用途':'Use Case')+' | '+(G?'ライセンス':'License')+' | '+(G?'設定':'Config')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| **Garak** | LLM '+(G?'プローブ・脆弱性スキャン':'probe & vulnerability scan')+' | Apache-2.0 | `garak --model_type openai --model_name gpt-4o` |\n';
  doc+='| **promptfoo** | '+(G?'プロンプトテスト・レッドチーム自動化':'Prompt testing & red team automation')+' | MIT | `promptfoo redteam run` |\n';
  doc+='| **Counterfit** | '+(G?'機械学習モデル攻撃フレームワーク':'ML model attack framework')+' | MIT | `cf target --name '+pn.toLowerCase()+'` |\n';
  doc+='| **ART** | '+(G?'敵対的ロバストネスツールキット':'Adversarial Robustness Toolbox')+' | MIT | `from art.attacks.evasion import FastGradientMethod` |\n';
  doc+='| **TextAttack** | NLP '+(G?'敵対的例生成':'adversarial example generation')+' | MIT | `textattack attack --model bert-base-cased` |\n\n';

  doc+='### Garak Config Example\n\n';
  doc+='```yaml\n# garak_config.yaml\nmodel:\n  type: "openai"\n  name: "gpt-4o"\n  api_key_env: "OPENAI_API_KEY"\n\nprobes:\n  - promptinject\n  - knownbadsignatures\n  - continuation\n  - atkgen\n  - dan          # Do Anything Now jailbreak\n\ndetectors:\n  - always.Fail\n  - mitigation.MitigationBypass\n\nreport:\n  format: "html"\n  output: "reports/garak_report_'+new Date().toISOString().split('T')[0]+'.html"\n```\n\n';

  doc+='## '+(G?'§4 レッドチームテスト計画テンプレート':'§4 Red Team Test Plan Template')+'\n\n';
  doc+='```markdown\n## '+(G?'AIレッドチームテスト計画':'AI Red Team Test Plan')+'\n\n**'+(G?'プロジェクト':'Project')+'**: '+pn+'\n**'+(G?'日付':'Date')+'**: '+new Date().toISOString().split('T')[0]+'\n**'+(G?'バージョン':'Version')+'**: 1.0\n\n### '+(G?'スコープ':'Scope')+'\n- '+(G?'対象エンドポイント':'Target Endpoints')+': \n- '+(G?'対象外':'Out of Scope')+': \n- '+(G?'テスト環境':'Test Environment')+': staging\n\n### '+(G?'ルール・倫理的制約':'Rules of Engagement')+'\n1. '+(G?'本番環境へのアクセス禁止':'No access to production environment')+'\n2. '+(G?'実際のユーザーデータを使用しない':'No use of real user data')+'\n3. '+(G?'発見した脆弱性は24時間以内に報告':'Report vulnerabilities within 24 hours')+'\n4. '+(G?'テスト活動のフルログを保持':'Maintain full logs of test activities')+'\n\n### '+(G?'優先テストシナリオ':'Priority Test Scenarios')+'\n| '+(G?'優先度':'Priority')+' | '+(G?'シナリオ':'Scenario')+' | OWASP ID |\n|---|---|---|\n| P1 | '+(G?'プロンプトインジェクションによるシステムプロンプト漏洩':'System prompt leakage via prompt injection')+' | LLM01 |\n| P1 | '+(G?'機密情報の抽出':'Sensitive information extraction')+' | LLM06 |\n| P2 | '+(G?'ジェイルブレイクによる安全フィルタ回避':'Safety filter bypass via jailbreak')+' | LLM01 |\n| P2 | '+(G?'DoSトークン消費攻撃':'DoS token consumption attack')+' | LLM04 |\n\n### '+(G?'スコアリングルーブリック':'Scoring Rubric')+'\n| '+(G?'深刻度':'Severity')+' | '+(G?'条件':'Criteria')+' | '+(G?'対応SLA':'Response SLA')+'|\n|---|---|---|\n| Critical | '+(G?'データ漏洩・権限昇格':'Data leakage, privilege escalation')+' | 24h |\n| High | '+(G?'ガードレール回避・安全フィルタ無効化':'Guardrail bypass, safety filter disable')+' | 72h |\n| Medium | '+(G?'情報漏洩・サービス品質低下':'Information disclosure, service degradation')+' | 1w |\n| Low | '+(G?'軽微な情報開示':'Minor information disclosure')+' | 2w |\n```\n\n';

  if(isAgent){
    doc+='## '+(G?'§5 マルチエージェント固有の敵対的シナリオ':'§5 Multi-Agent Adversarial Scenarios')+'\n\n';
    doc+='> '+(G?'マルチエージェント/オーケストレーター構成特有の攻撃パターン':'Attack patterns specific to multi-agent/orchestrator configurations')+'\n\n';
    doc+='| '+(G?'攻撃パターン':'Attack Pattern')+' | '+(G?'説明':'Description')+' | '+(G?'緩和策':'Mitigation')+'|\n';
    doc+='|---|---|---|\n';
    doc+='| Agent Hijacking | '+(G?'悪意あるツール呼び出しでエージェントを乗っ取る':'Hijack agent via malicious tool calls')+' | '+(G?'ツールスキーマ厳密化・サンドボックス化':'Strict tool schemas, sandboxing')+' |\n';
    doc+='| Prompt Smuggling | '+(G?'エージェント間通信にインジェクションを埋め込む':'Embed injections in inter-agent communication')+' | '+(G?'エージェント間メッセージの署名検証':'Sign and verify inter-agent messages')+' |\n';
    doc+='| Resource Exhaustion | '+(G?'再帰的タスク生成でリソースを枯渇させる':'Exhaust resources via recursive task generation')+' | '+(G?'タスク深度制限・コスト上限':'Task depth limit, cost ceiling')+' |\n';
    doc+='| Privilege Escalation | '+(G?'下位エージェントが上位権限を取得する':'Sub-agent acquires higher-level permissions')+' | '+(G?'最小権限の原則・権限昇格ログ':'Least privilege, escalation audit log')+' |\n\n';
    doc+='> '+(G?'📘 エージェント権限マトリクスと監査証跡の設計は `docs/43_security_intelligence.md` のゼロトラストAIエージェントゲートウェイセクションを参照':'📘 See Zero Trust AI Agent Gateway section in `docs/43_security_intelligence.md` for agent permission matrix and audit trail design')+'\n\n';
  }

  S.files['docs/131-2_ai_red_team_adversarial.md']=doc;
}
