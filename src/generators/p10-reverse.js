/* ═══ Pillar 10: Reverse Engineering (Goal-Driven Planning) ═══ */

// ── Domain-Specific Reverse Flow Map (15 domains + default) ──
const REVERSE_FLOW_MAP={
  education:{
    goal_ja:'学習成果の最大化',goal_en:'Maximize Learning Outcomes',
    flow_ja:['学習成果・修了率KPI定義','カリキュラム・コンテンツ設計','学習進捗測定機能','リマインド・通知自動化'],
    flow_en:['Define learning outcomes & completion KPIs','Design curriculum & content','Implement progress tracking','Automate reminders & notifications'],
    kpi_ja:['コース修了率 ≥70%','平均学習時間/週 ≥3h','課題提出率 ≥80%','受講者満足度 ≥4.2/5'],
    kpi_en:['Course completion rate ≥70%','Avg study time/week ≥3h','Assignment submission ≥80%','Learner satisfaction ≥4.2/5'],
    risks_ja:['コンテンツ制作遅延','学習者離脱率高','評価基準曖昧'],
    risks_en:['Content production delays','High learner dropout','Vague grading criteria']
  },
  ec:{
    goal_ja:'売上・CVR最大化',goal_en:'Maximize Revenue & CVR',
    flow_ja:['売上目標・CVR設定','商品戦略（価格・在庫）','UI/UX最適化（カート・決済）','集客施策（SEO・広告）'],
    flow_en:['Set revenue & CVR targets','Product strategy (pricing/inventory)','Optimize UI/UX (cart/checkout)','Marketing (SEO/ads)'],
    kpi_ja:['CVR ≥2.5%','平均注文額 ≥5,000円','カート放棄率 ≤60%','リピート率 ≥30%'],
    kpi_en:['CVR ≥2.5%','Avg order value ≥$50','Cart abandonment ≤60%','Repeat rate ≥30%'],
    risks_ja:['在庫切れ・欠品','決済エラー率高','物流遅延'],
    risks_en:['Stock-outs','High payment errors','Shipping delays']
  },
  saas:{
    goal_ja:'MRR成長・チャーン率低減',goal_en:'MRR Growth & Churn Reduction',
    flow_ja:['MRR・チャーン率目標設定','機能優先度決定（MVPコア機能）','オンボーディング最適化','リテンション施策'],
    flow_en:['Set MRR & churn targets','Prioritize features (MVP core)','Optimize onboarding','Retention strategies'],
    kpi_ja:['MRR成長率 ≥10%/月','チャーン率 ≤5%/月','アクティベーション率 ≥60%','NPS ≥40'],
    kpi_en:['MRR growth ≥10%/mo','Churn ≤5%/mo','Activation rate ≥60%','NPS ≥40'],
    risks_ja:['機能スコープ過多','オンボーディング離脱','競合参入'],
    risks_en:['Feature scope creep','Onboarding drop-offs','Competitor entry']
  },
  fintech:{
    goal_ja:'取引量・信頼性・規制準拠',goal_en:'Transaction Volume, Trust & Compliance',
    flow_ja:['規制準拠要件確認（金融庁・GDPR等）','セキュリティ基盤（暗号化・2FA）','取引フロー設計','監視・監査体制'],
    flow_en:['Verify compliance (FSA/GDPR)','Security foundation (encryption/2FA)','Design transaction flow','Monitoring & audit'],
    kpi_ja:['取引成功率 ≥99.5%','平均決済時間 ≤3秒','セキュリティインシデント 0件','監査合格率 100%'],
    kpi_en:['Transaction success ≥99.5%','Avg payment time ≤3s','Security incidents: 0','Audit pass rate: 100%'],
    risks_ja:['規制変更対応遅延','不正検知精度不足','システム障害時の資金保全'],
    risks_en:['Slow regulatory adaptation','Weak fraud detection','Fund security during outages']
  },
  health:{
    goal_ja:'患者満足度・診療効率向上',goal_en:'Patient Satisfaction & Efficiency',
    flow_ja:['診療目標・待ち時間KPI設定','予約システム最適化','電子カルテ連携','患者フィードバック収集'],
    flow_en:['Set care goals & wait time KPIs','Optimize booking system','EHR integration','Patient feedback collection'],
    kpi_ja:['予約充足率 ≥85%','平均待ち時間 ≤15分','診察時間 15分/人','患者満足度 ≥4.5/5'],
    kpi_en:['Booking rate ≥85%','Avg wait time ≤15min','Consult time: 15min/patient','Patient satisfaction ≥4.5/5'],
    risks_ja:['医療情報漏洩','予約重複・ダブルブッキング','システム障害時の診療継続'],
    risks_en:['Medical data breach','Booking conflicts','Service continuity during outages']
  },
  marketplace:{
    goal_ja:'取引量・GMV最大化',goal_en:'Maximize Transactions & GMV',
    flow_ja:['GMV目標設定','マッチング精度向上','エスクロー決済実装','評価システム信頼性'],
    flow_en:['Set GMV targets','Improve matching accuracy','Implement escrow','Rating system trust'],
    kpi_ja:['GMV成長率 ≥15%/月','マッチング成約率 ≥40%','平均評価 ≥4.3/5','紛争解決時間 ≤48h'],
    kpi_en:['GMV growth ≥15%/mo','Match conversion ≥40%','Avg rating ≥4.3/5','Dispute resolution ≤48h'],
    risks_ja:['不正出品・詐欺','決済トラブル','評価操作'],
    risks_en:['Fraud listings','Payment disputes','Rating manipulation']
  },
  community:{
    goal_ja:'ユーザーエンゲージメント向上',goal_en:'User Engagement Growth',
    flow_ja:['エンゲージメントKPI設定（DAU/MAU）','コンテンツ推薦アルゴリズム','モデレーション自動化','コミュニティガイドライン策定'],
    flow_en:['Set engagement KPIs (DAU/MAU)','Content recommendation algo','Automate moderation','Define community guidelines'],
    kpi_ja:['DAU/MAU比率 ≥30%','投稿数 ≥500/日','平均滞在時間 ≥20分','通報処理時間 ≤2h'],
    kpi_en:['DAU/MAU ratio ≥30%','Posts ≥500/day','Avg session ≥20min','Report handling ≤2h'],
    risks_ja:['荒らし・スパム増加','コンテンツ品質低下','ユーザー離脱'],
    risks_en:['Spam/trolling surge','Content quality decay','User churn']
  },
  content:{
    goal_ja:'コンテンツ配信・エンゲージメント',goal_en:'Content Delivery & Engagement',
    flow_ja:['配信KPI設定（PV・滞在時間）','コンテンツパイプライン構築','SEO最適化','収益化戦略'],
    flow_en:['Set delivery KPIs (PV/session time)','Build content pipeline','SEO optimization','Monetization strategy'],
    kpi_ja:['PV ≥10,000/日','平均滞在時間 ≥3分','直帰率 ≤60%','広告CTR ≥1.5%'],
    kpi_en:['PV ≥10,000/day','Avg time ≥3min','Bounce rate ≤60%','Ad CTR ≥1.5%'],
    risks_ja:['コンテンツ制作遅延','SEO順位下落','広告収益減'],
    risks_en:['Content production delays','SEO ranking drop','Ad revenue decline']
  },
  analytics:{
    goal_ja:'データ分析精度・レポート自動化',goal_en:'Analytics Accuracy & Automation',
    flow_ja:['分析KPI・ダッシュボード設計','データパイプライン構築','可視化ツール選定','自動レポート生成'],
    flow_en:['Design analytics KPIs & dashboards','Build data pipeline','Select viz tools','Auto report generation'],
    kpi_ja:['データ鮮度 ≤1時間','ダッシュボード応答時間 ≤2秒','レポート自動化率 ≥80%','データ精度 ≥99%'],
    kpi_en:['Data freshness ≤1h','Dashboard response ≤2s','Report automation ≥80%','Data accuracy ≥99%'],
    risks_ja:['データパイプライン障害','分析精度不足','レポート遅延'],
    risks_en:['Data pipeline failures','Poor analysis accuracy','Report delays']
  },
  booking:{
    goal_ja:'予約充足率・キャンセル率最適化',goal_en:'Booking Rate & Cancellation Optimization',
    flow_ja:['予約目標・キャンセルKPI設定','在庫管理システム構築','通知・リマインダー自動化','決済・キャンセルポリシー'],
    flow_en:['Set booking & cancellation KPIs','Build inventory system','Automate notifications','Payment & cancellation policy'],
    kpi_ja:['予約充足率 ≥75%','キャンセル率 ≤15%','平均予約単価 ≥8,000円','リピート率 ≥40%'],
    kpi_en:['Booking rate ≥75%','Cancellation ≤15%','Avg booking value ≥$80','Repeat rate ≥40%'],
    risks_ja:['ダブルブッキング','直前キャンセル','在庫更新遅延'],
    risks_en:['Double booking','Last-minute cancellations','Inventory sync delays']
  },
  iot:{
    goal_ja:'デバイス安定稼働・データ収集',goal_en:'Device Uptime & Data Collection',
    flow_ja:['稼働率・データ収集KPI設定','デバイス管理・認証基盤','データストリーミング構築','異常検知・アラート'],
    flow_en:['Set uptime & data KPIs','Device mgmt & auth','Build data streaming','Anomaly detection & alerts'],
    kpi_ja:['デバイス稼働率 ≥99%','データ取得頻度 ≥1回/分','異常検知精度 ≥95%','アラート応答時間 ≤5分'],
    kpi_en:['Device uptime ≥99%','Data frequency ≥1/min','Anomaly accuracy ≥95%','Alert response ≤5min'],
    risks_ja:['デバイス接続不安定','データ欠損','セキュリティ侵害'],
    risks_en:['Unstable connections','Data loss','Security breaches']
  },
  realestate:{
    goal_ja:'成約率・物件掲載数最大化',goal_en:'Conversion & Listing Maximization',
    flow_ja:['成約KPI・物件掲載目標設定','検索・フィルタ最適化','内見予約システム','契約書類デジタル化'],
    flow_en:['Set conversion & listing KPIs','Optimize search/filters','Viewing booking system','Digital contracts'],
    kpi_ja:['成約率 ≥15%','物件掲載数 ≥500件','内見予約率 ≥30%','契約処理時間 ≤7日'],
    kpi_en:['Conversion ≥15%','Listings ≥500','Viewing rate ≥30%','Contract time ≤7 days'],
    risks_ja:['物件情報更新遅延','内見日程調整トラブル','契約書類不備'],
    risks_en:['Listing update delays','Viewing schedule conflicts','Contract errors']
  },
  legal:{
    goal_ja:'案件処理効率・文書精度向上',goal_en:'Case Efficiency & Doc Accuracy',
    flow_ja:['案件処理時間・精度KPI設定','文書管理・検索システム','契約レビュー自動化','請求・タイムトラッキング'],
    flow_en:['Set case time & accuracy KPIs','Doc mgmt & search system','Auto contract review','Billing & time tracking'],
    kpi_ja:['案件処理時間 ≤14日/件','文書検索精度 ≥98%','契約レビュー時間 ≤24h','請求精度 100%'],
    kpi_en:['Case time ≤14 days','Doc search accuracy ≥98%','Contract review ≤24h','Billing accuracy 100%'],
    risks_ja:['文書紛失・漏洩','契約ミス・解釈齟齬','請求ミス'],
    risks_en:['Doc loss/leaks','Contract errors','Billing mistakes']
  },
  hr:{
    goal_ja:'採用効率・従業員満足度向上',goal_en:'Hiring Efficiency & Employee Satisfaction',
    flow_ja:['採用KPI・従業員満足度目標設定','ATS（採用管理）構築','オンボーディング自動化','パフォーマンス評価システム'],
    flow_en:['Set hiring & satisfaction KPIs','Build ATS','Automate onboarding','Performance review system'],
    kpi_ja:['採用充足率 ≥90%','Time to hire ≤30日','従業員満足度 ≥4.0/5','離職率 ≤10%/年'],
    kpi_en:['Hiring fill rate ≥90%','Time to hire ≤30 days','Employee satisfaction ≥4.0/5','Turnover ≤10%/yr'],
    risks_ja:['採用プロセス遅延','候補者離脱','従業員エンゲージメント低下'],
    risks_en:['Hiring delays','Candidate drop-offs','Low engagement']
  },
  portfolio:{
    goal_ja:'訪問者エンゲージメント・問い合わせ獲得',goal_en:'Visitor Engagement & Lead Generation',
    flow_ja:['訪問・問い合わせKPI設定','作品ポートフォリオ構築','SEO・SNS連携','問い合わせフォーム最適化'],
    flow_en:['Set visit & lead KPIs','Build project portfolio','SEO & social integration','Optimize contact form'],
    kpi_ja:['月間訪問者 ≥500人','平均滞在時間 ≥2分','問い合わせ率 ≥3%','SNS流入 ≥30%'],
    kpi_en:['Monthly visitors ≥500','Avg session ≥2min','Contact rate ≥3%','Social traffic ≥30%'],
    risks_ja:['作品更新停滞','SEO順位低下','問い合わせ減少'],
    risks_en:['Stale portfolio','SEO drop','Lead decline']
  },
  tool:{
    goal_ja:'ユーザー利用頻度・機能満足度',goal_en:'User Frequency & Feature Satisfaction',
    flow_ja:['利用KPI・機能満足度目標設定','コア機能実装優先','UI/UX最適化','ドキュメント・サポート'],
    flow_en:['Set usage & satisfaction KPIs','Prioritize core features','Optimize UI/UX','Docs & support'],
    kpi_ja:['週間利用頻度 ≥3回','機能満足度 ≥4.3/5','エラー率 ≤1%','問い合わせ応答時間 ≤24h'],
    kpi_en:['Weekly usage ≥3x','Feature satisfaction ≥4.3/5','Error rate ≤1%','Support response ≤24h'],
    risks_ja:['機能複雑化','使い方不明','競合ツール台頭'],
    risks_en:['Feature complexity','Unclear usage','Competitor tools']
  },
  _default:{
    goal_ja:'プロダクト完成・ローンチ',goal_en:'Product Completion & Launch',
    flow_ja:['ゴール・成功指標定義','要件分解・優先順位付け','技術スタック選定','実装計画・スケジュール'],
    flow_en:['Define goals & success metrics','Decompose requirements & prioritize','Select tech stack','Implementation plan & schedule'],
    kpi_ja:['MVP完成率 100%','テストカバレッジ ≥80%','バグ修正率 ≥95%','ローンチ予定通り'],
    kpi_en:['MVP completion 100%','Test coverage ≥80%','Bug fix rate ≥95%','Launch on schedule'],
    risks_ja:['スコープ拡大','技術負債蓄積','リソース不足'],
    risks_en:['Scope creep','Tech debt accumulation','Resource shortage']
  }
};

function genPillar10_ReverseEngineering(a,pn){
  const G=S.genLang==='ja';
  const domain=detectDomain(a.purpose)||'_default';
  const rf=REVERSE_FLOW_MAP[domain]||REVERSE_FLOW_MAP._default;
  const purpose=a.purpose||'';
  const mvp=a.mvp_features||'';
  const entities=(a.data_entities||'').split(/[,、]\s*/).map(s=>s.trim()).filter(Boolean);
  const features=mvp.split(/[,、\n]/).map(s=>s.trim()).filter(Boolean);
  const skill=S.skill||'intermediate';

  // ═══ docs/29_reverse_engineering.md ═══
  let doc29='# '+(G?'リバースエンジニアリング（ゴール逆算型プランニング）':'Reverse Engineering (Goal-Driven Planning)')+'\n\n';
  doc29+=G?'**重要**: このドキュメントは「ゴールから逆算して実装ステップを導出する」リバースエンジニアリング手法を提示します。AIエージェントは、実装前にこのフローを参照し、目標達成に向けた最適な順序でタスクを進めてください。\n\n':'**IMPORTANT**: This document presents reverse engineering methodology to derive implementation steps from goals. AI agents MUST reference this flow before implementation to proceed in optimal order for goal achievement.\n\n';

  // ── Goal Definition ──
  doc29+=(G?'## ゴール定義':'## Goal Definition')+'\n\n';
  doc29+='**'+(G?'プロダクトの目的':'Product Purpose')+'**: '+purpose+'\n\n';
  doc29+='**'+(G?'中心ゴール':'Central Goal')+'**: '+(G?rf.goal_ja:rf.goal_en)+'\n\n';
  doc29+='**'+(G?'成功指標（KPI）':'Success Metrics (KPIs)')+'**:\n';
  const kpis=G?rf.kpi_ja:rf.kpi_en;
  kpis.forEach(k=>doc29+='- '+k+'\n');
  doc29+='\n';

  // ── Reverse Flow (Domain-Specific) ──
  doc29+=(G?'## 逆算フロー（'+domain+'ドメイン特化）':'## Reverse Flow ('+domain+' Domain-Specific)')+'\n\n';
  doc29+=G?'ゴールから逆算して、以下の順序で実装を進めます：\n\n':'Working backward from the goal, implement in this order:\n\n';
  const flowSteps=G?rf.flow_ja:rf.flow_en;
  flowSteps.forEach((step,i)=>{
    doc29+=(i+1)+'. **'+step+'**\n';
    if(i===0){
      doc29+=(G?'   - 測定可能なKPIを定義（定量的目標）\n   - 目標達成の判断基準を明確化\n':'   - Define measurable KPIs (quantitative targets)\n   - Clarify success criteria\n')+'\n';
    }else if(i===1){
      doc29+=(G?'   - KPI達成に直結する機能・コンテンツを設計\n   - 優先順位付け（Impact × Effort マトリクス）\n':'   - Design features/content directly contributing to KPIs\n   - Prioritize (Impact × Effort matrix)\n')+'\n';
    }else if(i===2){
      doc29+=(G?'   - 実装スケジュール・タスク分解\n   - 依存関係チェーン整理\n':'   - Implementation schedule & task decomposition\n   - Dependency chain organization\n')+'\n';
    }else{
      doc29+=(G?'   - 自動化・効率化施策\n   - 継続的改善サイクル構築\n':'   - Automation & efficiency measures\n   - Continuous improvement cycle\n')+'\n';
    }
  });

  // ── Implementation-Level Reverse Flow (Industry Playbook) ──
  const pb=DOMAIN_PLAYBOOK[domain]||DOMAIN_PLAYBOOK._default;
  if(pb&&pb.impl_ja&&pb.impl_ja.length>0&&pb.impl_ja[0]!==''){
    doc29+=(G?'## 実装レベル・リバースフロー（業種特化パターン）':'## Implementation-Level Reverse Flow (Industry-Specific Patterns)')+'\n\n';
    doc29+=G?'具体的なデータフロー・ビジネスロジックの実装パターン:\n\n':'Concrete data flow & business logic implementation patterns:\n\n';
    const implPatterns=G?pb.impl_ja:pb.impl_en;
    implPatterns.forEach((pattern,i)=>{
      doc29+=(i+1)+'. '+pattern+'\n\n';
    });
  }

  // ── Milestone Schedule (Mermaid Gantt) ──
  doc29+=(G?'## マイルストーン逆算スケジュール':'## Milestone Reverse Schedule')+'\n\n```mermaid\ngantt\n    title '+(G?'ゴール達成までのマイルストーン':'Milestones to Goal Achievement')+'\n    dateFormat YYYY-MM-DD\n    section '+(G?'Phase 1: 基盤構築':'Phase 1: Foundation')+'\n';
  flowSteps.slice(0,2).forEach((step,i)=>{
    const start=i===0?'2026-03-01':'2026-03-15';
    const end=i===0?'2026-03-14':'2026-03-31';
    doc29+'    '+step.replace(/[:\-（）()]/g,' ')+' :'+start+', '+end+'\n';
  });
  doc29+='    section '+(G?'Phase 2: MVP実装':'Phase 2: MVP Implementation')+'\n';
  if(flowSteps.length>2){
    const step=flowSteps[2];
    doc29+'    '+step.replace(/[:\-（）()]/g,' ')+' :2026-04-01, 2026-04-21\n';
  }
  doc29+='    section '+(G?'Phase 3: 最適化':'Phase 3: Optimization')+'\n';
  if(flowSteps.length>3){
    const step=flowSteps[3];
    doc29+'    '+step.replace(/[:\-（）()]/g,' ')+' :2026-04-22, 2026-05-10\n';
  }
  doc29+='    section '+(G?'Phase 4: ローンチ':'Phase 4: Launch')+'\n';
  doc29+='    '+(G?'最終テスト・デプロイ':'Final testing & deploy')+' :milestone, 2026-05-11, 0d\n';
  doc29+='```\n\n';

  // ── Risk & Blocker Analysis ──
  doc29+=(G?'## リスク・ブロッカー分析':'## Risk & Blocker Analysis')+'\n\n';
  doc29+='| '+(G?'リスク項目':'Risk Item')+' | '+(G?'影響度':'Impact')+' | '+(G?'発生確率':'Probability')+' | '+(G?'対策':'Mitigation')+' |\n|------|------|------|------|\n';
  const risks=G?rf.risks_ja:rf.risks_en;
  risks.forEach((risk,i)=>{
    const impact=i===0?'High':(i===1?'Medium':'Low');
    const prob=i===0?'Medium':(i===1?'High':'Low');
    const mitigation=G?(
      i===0?'早期プロトタイプ検証':'定期レビュー会'
    ):(
      i===0?'Early prototype validation':'Regular review meetings'
    );
    doc29+='| '+risk+' | '+impact+' | '+prob+' | '+mitigation+' |\n';
  });
  doc29+='\n';

  // ── Progress Tracking ──
  doc29+=(G?'## 進捗トラッキング':'## Progress Tracking')+'\n\n';
  doc29+=G?'**重要**: `docs/24_progress.md` を使用して実装進捗を記録してください。各マイルストーン完了時にステータスを更新し、ブロッカーがあれば即座に記録してください。\n\n':'**IMPORTANT**: Use `docs/24_progress.md` to track implementation progress. Update status upon milestone completion and log blockers immediately.\n\n';
  doc29+=(G?'**推奨ワークフロー**:':'**Recommended Workflow**:')+'\n';
  doc29+='1. '+(G?'各Phase開始時: 24_progress.md にスプリント目標を記載':'Phase start: Log sprint goal in 24_progress.md')+'\n';
  doc29+='2. '+(G?'実装中: タスク完了ごとにステータス更新':'During implementation: Update status per task completion')+'\n';
  doc29+='3. '+(G?'ブロッカー発生時: 25_error_logs.md に原因・対策を記録':'On blocker: Log cause & mitigation in 25_error_logs.md')+'\n';
  doc29+='4. '+(G?'Phase完了時: KPI達成度を確認・記録':'Phase complete: Verify & log KPI achievement')+'\n\n';

  S.files['docs/29_reverse_engineering.md']=doc29;

  // ═══ docs/30_goal_decomposition.md ═══
  let doc30='# '+(G?'ゴール分解・ギャップ分析':'Goal Decomposition & Gap Analysis')+'\n\n';
  doc30+=G?'**重要**: このドキュメントは、中心ゴールをサブゴール階層に分解し、現状とのギャップ・優先度を明確化します。AIエージェントは、実装順序を決定する際にこのマトリクスを参照してください。\n\n':'**IMPORTANT**: This document decomposes the central goal into sub-goal hierarchies and clarifies gaps & priorities. AI agents MUST reference this matrix when determining implementation order.\n\n';

  // ── Goal Tree (Mermaid mindmap) ──
  doc30+=(G?'## ゴールツリー':'## Goal Tree')+'\n\n```mermaid\nmindmap\n  root(('+(G?rf.goal_ja:rf.goal_en)+'))\n';
  // Level 1: Flow steps
  flowSteps.slice(0,3).forEach((step,i)=>{
    doc30+'    '+step.replace(/[（）()]/g,'')+'\n';
    // Level 2: Features (sample 2 per step)
    if(i===0&&kpis.length>0){
      doc30+'      '+kpis[0].split(' ')[0]+'\n';
      if(kpis.length>1)doc30+'      '+kpis[1].split(' ')[0]+'\n';
    }else if(i===1&&features.length>0){
      doc30+'      '+features[0]+'\n';
      if(features.length>1)doc30+'      '+features[1]+'\n';
    }else if(i===2&&entities.length>0){
      doc30+'      '+entities[0]+(G?' 実装':' implementation')+'\n';
      if(entities.length>1)doc30+'      '+entities[1]+(G?' 実装':' implementation')+'\n';
    }
  });
  doc30+'```\n\n';

  // ── Sub-Goal Decomposition (3-5 levels) ──
  doc30+=(G?'## サブゴール分解（3-5階層）':'## Sub-Goal Decomposition (3-5 Levels)')+'\n\n';
  doc30+='### '+(G?'レベル1: 戦略目標':'Level 1: Strategic Goals')+'\n';
  flowSteps.slice(0,2).forEach((step,i)=>{
    doc30+=(i+1)+'. **'+step+'**\n';
  });
  doc30+='\n### '+(G?'レベル2: 戦術目標':'Level 2: Tactical Goals')+'\n';
  if(features.length>0){
    features.slice(0,4).forEach((f,i)=>{
      doc30+=(i+1)+'. '+f+'\n';
    });
  }else{
    doc30+='1. '+(G?'MVP機能実装':'MVP feature implementation')+'\n';
    doc30+='2. '+(G?'UI/UX最適化':'UI/UX optimization')+'\n';
  }
  doc30+='\n### '+(G?'レベル3: 実装タスク':'Level 3: Implementation Tasks')+'\n';
  if(entities.length>0){
    entities.slice(0,3).forEach((ent,i)=>{
      doc30+=(i+1)+'. '+ent+(G?' CRUD実装':' CRUD implementation')+'\n';
    });
  }else{
    doc30+='1. '+(G?'データベース設計':'Database design')+'\n';
    doc30+='2. '+(G?'API実装':'API implementation')+'\n';
  }
  doc30+='\n';

  // ── Gap Analysis Matrix ──
  doc30+=(G?'## ギャップ分析マトリクス':'## Gap Analysis Matrix')+'\n\n';
  doc30+='| '+(G?'サブゴール':'Sub-Goal')+' | '+(G?'現状':'Current State')+' | '+(G?'目標':'Target')+' | '+(G?'ギャップ':'Gap')+' | '+(G?'対策':'Action')+' |\n|------|------|------|------|------|\n';
  flowSteps.slice(0,3).forEach((step,i)=>{
    const current=G?(i===0?'未定義':'未実装'):(i===0?'Undefined':'Not implemented');
    const target=G?(i===0?'KPI定義完了':'MVP実装完了'):(i===0?'KPI defined':'MVP implemented');
    const gap=G?(i===0?'測定可能な指標が不明':'機能未開発'):(i===0?'Measurable metrics unclear':'Features not developed');
    const action=G?(i===0?'24_progress.mdに記載':'開発開始'):(i===0?'Log in 24_progress.md':'Start development');
    doc30+='| '+step+' | '+current+' | '+target+' | '+gap+' | '+action+' |\n';
  });
  doc30+='\n';

  // ── Priority Matrix (Impact × Effort) ──
  doc30+=(G?'## 優先度マトリクス（Impact × Effort）':'## Priority Matrix (Impact × Effort)')+'\n\n';
  doc30+='```\n';
  doc30+='          '+(G?'大':'High')+'      |\n';
  doc30+='  Impact  '+(G?'中':'Med')+'  '+(G?'🟢P1':'🟢P1')+'  | '+(G?'🟡P2':'🟡P2')+'\n';
  doc30+='          '+(G?'小':'Low')+'  '+(G?'🟡P2':'🟡P2')+'  | '+(G?'⚪P3':'⚪P3')+'\n';
  doc30+='          ─────┼─────\n';
  doc30+='          '+(G?'低':'Low')+'  '+(G?'高':'High')+'\n';
  doc30+='             Effort\n';
  doc30+'```\n\n';
  doc30+='**'+(G?'優先順位':'Priority')+'**:\n';
  doc30+='- '+(G?'🟢 P1 (高Impact・低Effort): ':'🟢 P1 (High Impact, Low Effort): ')+(flowSteps[0]||'Core feature')+'\n';
  doc30+='- '+(G?'🟡 P2 (高Impact・高Effort または 中Impact): ':'🟡 P2 (High Impact & Effort or Med Impact): ')+(flowSteps[1]||'Secondary features')+'\n';
  doc30+='- '+(G?'⚪ P3 (低Impact): ':'⚪ P3 (Low Impact): ')+(G?'Nice-to-have機能':'Nice-to-have features')+'\n\n';

  // ── Dependency Chain (Mermaid flowchart) ──
  doc30+=(G?'## 依存関係チェーン':'## Dependency Chain')+'\n\n```mermaid\nflowchart TD\n';
  const node1=G?'A[KPI定義]':'A[Define KPIs]';
  const node2=G?'B[機能設計]':'B[Design Features]';
  const node3=G?'C[DB設計]':'C[Design DB]';
  const node4=G?'D[API実装]':'D[Implement API]';
  const node5=G?'E[UI実装]':'E[Implement UI]';
  const node6=G?'F[テスト]':'F[Testing]';
  const node7=G?'G[デプロイ]':'G[Deploy]';
  doc30+'  '+node1+' --> '+node2+'\n';
  doc30+'  '+node2+' --> '+node3+'\n';
  doc30+'  '+node3+' --> '+node4+'\n';
  doc30+'  '+node4+' --> '+node5+'\n';
  doc30+'  '+node5+' --> '+node6+'\n';
  doc30+'  '+node6+' --> '+node7+'\n';
  doc30+='  style A fill:#4ade80\n';
  doc30+='  style B fill:#4ade80\n';
  doc30+='  style C fill:#fbbf24\n';
  doc30+='  style D fill:#fbbf24\n';
  doc30+='  style E fill:#fbbf24\n';
  doc30+='  style F fill:#f87171\n';
  doc30+='  style G fill:#f87171\n';
  doc30+='```\n\n';
  doc30+=G?'**凡例**: 🟢 完了 | 🟡 進行中 | 🔴 未着手\n\n':'**Legend**: 🟢 Complete | 🟡 In Progress | 🔴 Not Started\n\n';

  // ── Implementation Checklist ──
  doc30+=(G?'## 実装チェックリスト':'## Implementation Checklist')+'\n\n';
  flowSteps.forEach((step,i)=>{
    doc30+='- [ ] **'+step+'**\n';
    if(i===0){
      doc30+='  - [ ] '+(G?'KPI指標を24_progress.mdに記載':'Log KPI metrics in 24_progress.md')+'\n';
      doc30+='  - [ ] '+(G?'測定方法確定（Analytics等）':'Define measurement method (Analytics, etc.)')+'\n';
    }else if(i===1){
      doc30+='  - [ ] '+(G?'機能要件定義':'Define feature requirements')+'\n';
      doc30+='  - [ ] '+(G?'優先度決定':'Determine priority')+'\n';
    }else if(i===2){
      doc30+='  - [ ] '+(G?'DB/API実装':'Implement DB/API')+'\n';
      doc30+='  - [ ] '+(G?'テストケース作成':'Create test cases')+'\n';
    }else{
      doc30+='  - [ ] '+(G?'自動化スクリプト作成':'Create automation scripts')+'\n';
      doc30+='  - [ ] '+(G?'継続的改善ループ構築':'Build continuous improvement loop')+'\n';
    }
  });
  doc30+='\n';

  S.files['docs/30_goal_decomposition.md']=doc30;
}
