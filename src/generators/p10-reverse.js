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
  ai:{
    goal_ja:'AI精度・応答速度・ユーザー満足度',goal_en:'AI Accuracy, Response Speed & User Satisfaction',
    flow_ja:['AI精度・応答速度KPI設定','プロンプト最適化・モデル選定','コンテキスト管理・RAG構築','ユーザーフィードバック学習'],
    flow_en:['Set AI accuracy & speed KPIs','Prompt optimization & model selection','Context management & RAG','User feedback learning'],
    kpi_ja:['応答精度 ≥90%','平均応答時間 ≤2秒','ユーザー満足度 ≥4.5/5','フィードバック反映率 ≥80%'],
    kpi_en:['Response accuracy ≥90%','Avg response time ≤2s','User satisfaction ≥4.5/5','Feedback incorporation ≥80%'],
    risks_ja:['幻覚(ハルシネーション)','コンテキスト破綻','レート制限超過'],
    risks_en:['Hallucinations','Context loss','Rate limit exceeded']
  },
  automation:{
    goal_ja:'自動化率・エラー率・処理時間',goal_en:'Automation Rate, Error Rate & Processing Time',
    flow_ja:['自動化率・エラー率KPI設定','ワークフロー設計・条件分岐','監視・リトライ機構','継続的改善ループ'],
    flow_en:['Set automation & error KPIs','Workflow design & branching','Monitoring & retry mechanism','Continuous improvement loop'],
    kpi_ja:['自動化率 ≥80%','エラー率 ≤3%','処理時間短縮 ≥50%','手動介入率 ≤10%'],
    kpi_en:['Automation rate ≥80%','Error rate ≤3%','Processing time reduction ≥50%','Manual intervention ≤10%'],
    risks_ja:['無限ループ','条件分岐ミス','監視漏れ'],
    risks_en:['Infinite loops','Branching errors','Monitoring gaps']
  },
  event:{
    goal_ja:'参加率・満足度・収益最大化',goal_en:'Participation, Satisfaction & Revenue Maximization',
    flow_ja:['参加率・満足度KPI設定','チケット販売戦略','イベント管理システム','事後フォローアップ'],
    flow_en:['Set participation & satisfaction KPIs','Ticket sales strategy','Event management system','Post-event follow-up'],
    kpi_ja:['参加率 ≥85%','満足度 ≥4.5/5','チケット売上目標達成 ≥95%','リピート参加率 ≥40%'],
    kpi_en:['Participation ≥85%','Satisfaction ≥4.5/5','Ticket sales goal ≥95%','Repeat participation ≥40%'],
    risks_ja:['集客不足','当日キャンセル','運営トラブル'],
    risks_en:['Low attendance','Last-minute cancellations','Operational issues']
  },
  gamify:{
    goal_ja:'エンゲージメント・継続率向上',goal_en:'Engagement & Retention Improvement',
    flow_ja:['エンゲージメントKPI設定','ポイント・バッジシステム設計','リーダーボード・チャレンジ','報酬最適化'],
    flow_en:['Set engagement KPIs','Design points & badges system','Leaderboard & challenges','Reward optimization'],
    kpi_ja:['DAU/MAU比率 ≥35%','平均セッション時間 ≥15分','ポイント獲得率 ≥70%','バッジ解除率 ≥50%'],
    kpi_en:['DAU/MAU ratio ≥35%','Avg session ≥15min','Point earn rate ≥70%','Badge unlock rate ≥50%'],
    risks_ja:['ポイントインフレ','不正獲得','モチベーション低下'],
    risks_en:['Point inflation','Cheating','Motivation decline']
  },
  collab:{
    goal_ja:'共同作業効率・同期精度',goal_en:'Collaboration Efficiency & Sync Accuracy',
    flow_ja:['コラボレーションKPI設定','リアルタイム同期基盤','競合解決アルゴリズム','バージョン管理・履歴'],
    flow_en:['Set collaboration KPIs','Real-time sync foundation','Conflict resolution algorithm','Version control & history'],
    kpi_ja:['同期遅延 ≤200ms','競合発生率 ≤5%','データ損失 0件','同時編集ユーザー数 ≥10人'],
    kpi_en:['Sync latency ≤200ms','Conflict rate ≤5%','Data loss: 0','Concurrent users ≥10'],
    risks_ja:['データ競合','同期遅延','接続断'],
    risks_en:['Data conflicts','Sync delays','Connection loss']
  },
  devtool:{
    goal_ja:'開発者体験・API採用率',goal_en:'Developer Experience & API Adoption',
    flow_ja:['DX・API採用率KPI設定','API設計・ドキュメント','SDK・サンプルコード','コミュニティ・サポート'],
    flow_en:['Set DX & adoption KPIs','API design & docs','SDKs & sample code','Community & support'],
    kpi_ja:['API採用率 ≥50社','ドキュメント満足度 ≥4.5/5','問い合わせ応答時間 ≤4h','SDK利用率 ≥70%'],
    kpi_en:['API adoption ≥50 companies','Doc satisfaction ≥4.5/5','Support response ≤4h','SDK usage ≥70%'],
    risks_ja:['API仕様変更','ドキュメント不足','サポート遅延'],
    risks_en:['API breaking changes','Insufficient docs','Support delays']
  },
  creator:{
    goal_ja:'クリエイター収益・ファンエンゲージメント',goal_en:'Creator Revenue & Fan Engagement',
    flow_ja:['収益・ファンKPI設定','コンテンツ収益化戦略','ファンコミュニティ構築','分析・インサイト提供'],
    flow_en:['Set revenue & fan KPIs','Content monetization strategy','Build fan community','Analytics & insights'],
    kpi_ja:['月間収益 ≥100,000円','ファン数 ≥500人','エンゲージメント率 ≥8%','リピート課金率 ≥60%'],
    kpi_en:['Monthly revenue ≥$1,000','Fans ≥500','Engagement rate ≥8%','Repeat payment ≥60%'],
    risks_ja:['収益化遅延','ファン離脱','コンテンツ枯渇'],
    risks_en:['Monetization delays','Fan churn','Content shortage']
  },
  newsletter:{
    goal_ja:'開封率・クリック率・購読者増',goal_en:'Open Rate, Click Rate & Subscriber Growth',
    flow_ja:['開封率・購読者KPI設定','コンテンツ戦略・配信頻度','セグメント配信・A/Bテスト','購読者獲得施策'],
    flow_en:['Set open rate & subscriber KPIs','Content strategy & frequency','Segment delivery & A/B test','Subscriber acquisition'],
    kpi_ja:['開封率 ≥25%','クリック率 ≥3%','購読者増加率 ≥10%/月','解除率 ≤2%'],
    kpi_en:['Open rate ≥25%','Click rate ≥3%','Subscriber growth ≥10%/mo','Unsubscribe ≤2%'],
    risks_ja:['スパム判定','コンテンツ質低下','配信遅延'],
    risks_en:['Spam filtering','Content quality decline','Delivery delays']
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

  // ── Milestone Schedule (Mermaid Gantt) ── Dynamic dates from today
  const today=new Date();
  const formatDate=(d)=>{const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day;};
  const addDays=(d,days)=>{const r=new Date(d);r.setDate(r.getDate()+days);return r;};

  const p1Start=addDays(today,7);
  const p1Mid=addDays(today,14);
  const p1End=addDays(today,21);
  const p2Start=addDays(today,21);
  const p2End=addDays(today,35);
  const p3Start=addDays(today,35);
  const p3End=addDays(today,56);
  const p4Start=addDays(today,56);
  const p4End=addDays(today,70);

  doc29+=(G?'## マイルストーン逆算スケジュール':'## Milestone Reverse Schedule')+'\n\n```mermaid\ngantt\n    title '+(G?'ゴール達成までのマイルストーン':'Milestones to Goal Achievement')+'\n    dateFormat YYYY-MM-DD\n    section '+(G?'Phase 1: 基盤構築':'Phase 1: Foundation')+'\n';
  flowSteps.slice(0,2).forEach((step,i)=>{
    const start=i===0?formatDate(p1Start):formatDate(p1Mid);
    const end=i===0?formatDate(addDays(p1Mid,-1)):formatDate(p1End);
    doc29+='    '+step.replace(/[:\-（）()]/g,' ')+' :'+start+', '+end+'\n';
  });
  doc29+='    section '+(G?'Phase 2: MVP実装':'Phase 2: MVP Implementation')+'\n';
  if(flowSteps.length>2){
    const step=flowSteps[2];
    doc29+='    '+step.replace(/[:\-（）()]/g,' ')+' :'+formatDate(p2Start)+', '+formatDate(p2End)+'\n';
  }
  doc29+='    section '+(G?'Phase 3: 最適化':'Phase 3: Optimization')+'\n';
  if(flowSteps.length>3){
    const step=flowSteps[3];
    doc29+='    '+step.replace(/[:\-（）()]/g,' ')+' :'+formatDate(p3Start)+', '+formatDate(p3End)+'\n';
  }
  doc29+='    section '+(G?'Phase 4: ローンチ':'Phase 4: Launch')+'\n';
  doc29+='    '+(G?'最終テスト・デプロイ':'Final testing & deploy')+' :milestone, '+formatDate(p4End)+', 0d\n';
  doc29+='```\n\n';

  // ── Risk & Blocker Analysis ── Use domain-specific prevent strategies
  doc29+=(G?'## リスク・ブロッカー分析':'## Risk & Blocker Analysis')+'\n\n';
  doc29+='| '+(G?'リスク項目':'Risk Item')+' | '+(G?'影響度':'Impact')+' | '+(G?'発生確率':'Probability')+' | '+(G?'対策':'Mitigation')+' |\n|------|------|------|------|\n';
  const risks=G?rf.risks_ja:rf.risks_en;
  const playbook=DOMAIN_PLAYBOOK[domain]||DOMAIN_PLAYBOOK._default;
  const preventList=playbook?(G?playbook.prevent_ja:playbook.prevent_en):[];
  risks.forEach((risk,i)=>{
    const impact=i===0?'High':(i===1?'Medium':'Low');
    const prob=i===0?'Medium':(i===1?'High':'Low');
    let mitigation='';
    if(preventList&&preventList.length>i){
      const preventEntry=preventList[i];
      const segments=preventEntry.split(/[:|]/);
      if(segments.length>=3){
        mitigation=segments[segments.length-1].trim();
      }else{
        mitigation=segments[segments.length-1].trim();
      }
    }
    if(!mitigation||mitigation===''){
      mitigation=G?(i===0?'早期プロトタイプ検証':'定期レビュー会'):(i===0?'Early prototype validation':'Regular review meetings');
    }
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
    doc30+='    '+step.replace(/[（）()]/g,'')+'\n';
    // Level 2: Features (sample 2 per step)
    if(i===0&&kpis.length>0){
      doc30+='      '+kpis[0].split(' ')[0]+'\n';
      if(kpis.length>1)doc30+='      '+kpis[1].split(' ')[0]+'\n';
    }else if(i===1&&features.length>0){
      doc30+='      '+features[0]+'\n';
      if(features.length>1)doc30+='      '+features[1]+'\n';
    }else if(i===2&&entities.length>0){
      doc30+='      '+entities[0]+(G?' 実装':' implementation')+'\n';
      if(entities.length>1)doc30+='      '+entities[1]+(G?' 実装':' implementation')+'\n';
    }
  });
  doc30+='```\n\n';

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
  doc30+='```\n\n';
  doc30+='**'+(G?'優先順位':'Priority')+'**:\n';
  doc30+='- '+(G?'🟢 P1 (高Impact・低Effort): ':'🟢 P1 (High Impact, Low Effort): ')+(flowSteps[0]||'Core feature')+'\n';
  doc30+='- '+(G?'🟡 P2 (高Impact・高Effort または 中Impact): ':'🟡 P2 (High Impact & Effort or Med Impact): ')+(flowSteps[1]||'Secondary features')+'\n';
  doc30+='- '+(G?'⚪ P3 (低Impact): ':'⚪ P3 (Low Impact): ')+(G?'Nice-to-have機能':'Nice-to-have features')+'\n\n';

  // ── Dependency Chain (Mermaid flowchart) ── Stack-aware based on resolveArch
  const arch=resolveArch(a);
  doc30+=(G?'## 依存関係チェーン':'## Dependency Chain')+'\n\n```mermaid\nflowchart TD\n';
  const node1=G?'A[KPI定義]':'A[Define KPIs]';
  const node2=G?'B[機能設計]':'B[Design Features]';
  let node3,node4,node5,node6,node7;
  if(arch.isBaaS){
    // BaaS: No traditional API layer, use schema + RLS/Rules
    node3=G?'C[スキーマ設計]':'C[Design Schema]';
    node4=G?'D[RLS/Rules実装]':'D[Implement RLS/Rules]';
    node5=G?'E[UI実装]':'E[Implement UI]';
    node6=G?'F[テスト]':'F[Testing]';
    node7=G?'G[デプロイ]':'G[Deploy]';
  }else if(arch.pattern==='bff'){
    // BFF: API Routes within Next.js
    node3=G?'C[DB設計]':'C[Design DB]';
    node4=G?'D[API Routes実装]':'D[Implement API Routes]';
    node5=G?'E[Pages実装]':'E[Implement Pages]';
    node6=G?'F[テスト]':'F[Testing]';
    node7=G?'G[デプロイ]':'G[Deploy]';
  }else{
    // Traditional: Separate FE/BE
    node3=G?'C[DB設計]':'C[Design DB]';
    node4=G?'D[API実装]':'D[Implement API]';
    node5=G?'E[UI実装]':'E[Implement UI]';
    node6=G?'F[テスト]':'F[Testing]';
    node7=G?'G[デプロイ]':'G[Deploy]';
  }
  doc30+='  '+node1+' --> '+node2+'\n';
  doc30+='  '+node2+' --> '+node3+'\n';
  doc30+='  '+node3+' --> '+node4+'\n';
  doc30+='  '+node4+' --> '+node5+'\n';
  doc30+='  '+node5+' --> '+node6+'\n';
  doc30+='  '+node6+' --> '+node7+'\n';
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

  // ═══ C3: Goal Tracking Schema (~4KB) ═══
  doc30+=(G?'## Goal Tracking スキーマ':'## Goal Tracking Schema')+'\n\n';
  doc30+=G?'**重要**: 目標達成の進捗を追跡するための5テーブル構成。データベースに実装することで、KPIの可視化と継続的改善が可能になります。\n\n':'**IMPORTANT**: 5-table schema for tracking goal progress. Implement in database to enable KPI visualization and continuous improvement.\n\n';

  doc30+='### 1. UserGoal\n';
  doc30+=(G?'**目的**: ユーザー別・プロジェクト別の目標管理':'**Purpose**: Goal management per user/project')+'\n\n';
  doc30+='```sql\n';
  doc30+='CREATE TABLE user_goals (\n';
  doc30+='  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n';
  doc30+='  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n';
  doc30+='  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,\n';
  doc30+='  goal_type VARCHAR(50) NOT NULL, -- '+(G?'\'revenue\', \'cvr\', \'mrr\', \'churn\', \'engagement\' 等':'\'revenue\', \'cvr\', \'mrr\', \'churn\', \'engagement\', etc.')+'\n';
  doc30+='  target_value DECIMAL(10,2) NOT NULL, -- '+(G?'目標値':'Target value')+'\n';
  doc30+='  current_value DECIMAL(10,2) DEFAULT 0, -- '+(G?'現在値':'Current value')+'\n';
  doc30+='  deadline DATE,\n';
  doc30+='  status VARCHAR(20) DEFAULT \'active\', -- \'active\', \'completed\', \'failed\'\n';
  doc30+='  created_at TIMESTAMP DEFAULT NOW(),\n';
  doc30+='  updated_at TIMESTAMP DEFAULT NOW()\n';
  doc30+=');\n```\n\n';

  doc30+='### 2. ReversePlan\n';
  doc30+=(G?'**目的**: 目標達成のためのリバースプランニング':'**Purpose**: Reverse planning for goal achievement')+'\n\n';
  doc30+='```sql\n';
  doc30+='CREATE TABLE reverse_plans (\n';
  doc30+='  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n';
  doc30+='  goal_id UUID NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,\n';
  doc30+='  title VARCHAR(255) NOT NULL,\n';
  doc30+='  description TEXT,\n';
  doc30+='  total_steps INT DEFAULT 4, -- '+(G?'標準4ステップ':'Standard 4 steps')+'\n';
  doc30+='  completed_steps INT DEFAULT 0,\n';
  doc30+='  status VARCHAR(20) DEFAULT \'draft\', -- \'draft\', \'active\', \'completed\'\n';
  doc30+='  created_at TIMESTAMP DEFAULT NOW(),\n';
  doc30+='  updated_at TIMESTAMP DEFAULT NOW()\n';
  doc30+=');\n```\n\n';

  doc30+='### 3. PlanStep\n';
  doc30+=(G?'**目的**: プランの各ステップ詳細':'**Purpose**: Details of each plan step')+'\n\n';
  doc30+='```sql\n';
  doc30+='CREATE TABLE plan_steps (\n';
  doc30+='  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n';
  doc30+='  plan_id UUID NOT NULL REFERENCES reverse_plans(id) ON DELETE CASCADE,\n';
  doc30+='  step_order INT NOT NULL, -- 1, 2, 3, 4\n';
  doc30+='  title VARCHAR(255) NOT NULL,\n';
  doc30+='  description TEXT,\n';
  doc30+='  status VARCHAR(20) DEFAULT \'pending\', -- \'pending\', \'in_progress\', \'completed\'\n';
  doc30+='  started_at TIMESTAMP,\n';
  doc30+='  completed_at TIMESTAMP,\n';
  doc30+='  created_at TIMESTAMP DEFAULT NOW(),\n';
  doc30+='  updated_at TIMESTAMP DEFAULT NOW(),\n';
  doc30+='  UNIQUE(plan_id, step_order)\n';
  doc30+=');\n```\n\n';

  doc30+='### 4. ProgressTracking\n';
  doc30+=(G?'**目的**: KPI進捗の時系列データ':'**Purpose**: Time-series KPI progress data')+'\n\n';
  doc30+='```sql\n';
  doc30+='CREATE TABLE progress_tracking (\n';
  doc30+='  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n';
  doc30+='  goal_id UUID NOT NULL REFERENCES user_goals(id) ON DELETE CASCADE,\n';
  doc30+='  measured_value DECIMAL(10,2) NOT NULL,\n';
  doc30+='  measured_at TIMESTAMP DEFAULT NOW(),\n';
  doc30+='  notes TEXT,\n';
  doc30+='  created_at TIMESTAMP DEFAULT NOW()\n';
  doc30+=');\n\n';
  doc30+='CREATE INDEX idx_progress_goal_time ON progress_tracking(goal_id, measured_at DESC);\n';
  doc30+='```\n\n';

  doc30+='### 5. PlanAdjustment\n';
  doc30+=(G?'**目的**: プラン修正履歴（継続的改善）':'**Purpose**: Plan adjustment history (continuous improvement)')+'\n\n';
  doc30+='```sql\n';
  doc30+='CREATE TABLE plan_adjustments (\n';
  doc30+='  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n';
  doc30+='  plan_id UUID NOT NULL REFERENCES reverse_plans(id) ON DELETE CASCADE,\n';
  doc30+='  reason TEXT NOT NULL, -- '+(G?'調整理由':'Reason for adjustment')+'\n';
  doc30+='  before_value TEXT, -- JSON: '+(G?'調整前の値':'Before values')+'\n';
  doc30+='  after_value TEXT, -- JSON: '+(G?'調整後の値':'After values')+'\n';
  doc30+='  adjusted_by UUID REFERENCES users(id),\n';
  doc30+='  adjusted_at TIMESTAMP DEFAULT NOW()\n';
  doc30+=');\n```\n\n';

  doc30+=(G?'## スキーマ使用例':'## Schema Usage Example')+'\n\n';
  doc30+='```javascript\n';
  doc30+='// 1. '+(G?'目標作成':'Create goal')+'\n';
  doc30+='const goal = await supabase.from(\'user_goals\').insert({\n';
  doc30+='  user_id: userId,\n';
  doc30+='  goal_type: \'mrr\',\n';
  doc30+='  target_value: 100000, // '+(G?'目標MRR: 10万円/月':'Target MRR: $1000/mo')+'\n';
  doc30+='  deadline: \'2026-06-30\',\n';
  doc30+='}).select().single();\n\n';
  doc30+='// 2. '+(G?'リバースプラン作成':'Create reverse plan')+'\n';
  doc30+='const plan = await supabase.from(\'reverse_plans\').insert({\n';
  doc30+='  goal_id: goal.id,\n';
  doc30+='  title: \'MRR '+flowSteps[0]+'\',\n';
  doc30+='  total_steps: 4\n';
  doc30+='}).select().single();\n\n';
  doc30+='// 3. '+(G?'進捗記録':'Record progress')+'\n';
  doc30+='await supabase.from(\'progress_tracking\').insert({\n';
  doc30+='  goal_id: goal.id,\n';
  doc30+='  measured_value: 45000, // '+(G?'現在のMRR':'Current MRR')+'\n';
  doc30+='  notes: \'Month 2 progress\'\n';
  doc30+='});\n\n';
  doc30+='// 4. '+(G?'目標達成率計算':'Calculate achievement rate')+'\n';
  doc30+='const achievementRate = (goal.current_value / goal.target_value) * 100;\n';
  doc30+='```\n\n';

  S.files['docs/30_goal_decomposition.md']=doc30;

  // ═══ C1: Business Model & Monetization (~8KB, conditional) ═══
  const hasPay=a.payment&&!isNone(a.payment);
  if(hasPay){
    const domain=detectDomain(a.purpose)||'_default';
    let doc38='# '+pn+' — '+(G?'ビジネスモデル・収益化戦略':'Business Model & Monetization Strategy')+'\n\n';
    doc38+=G?'**重要**: このドキュメントはビジネス視点からの収益モデル・価格戦略・コンバージョンファネルを定義します。エンジニアリングとビジネス戦略を接続する重要なドキュメントです。\n\n':'**IMPORTANT**: This document defines revenue model, pricing strategy, and conversion funnel from business perspective. Critical bridge between engineering and business strategy.\n\n';

    // Revenue Model Analysis
    doc38+=(G?'## 収益モデル分析':'## Revenue Model Analysis')+'\n\n';

    const revenueModels={
      saas:{model:G?'サブスクリプション':'Subscription',tiers:G?'Free / Pro (¥980/月) / Enterprise (¥9,800/月)':'Free / Pro ($10/mo) / Enterprise ($100/mo)',primary:G?'月次定期課金':'Monthly recurring revenue'},
      ec:{model:G?'手数料 + 決済手数料':'Commission + Payment fees',tiers:G?'出品者手数料5% + 決済手数料3.6%':'Seller fee 5% + Payment fee 3.6%',primary:G?'取引総額(GMV)の一定割合':'% of GMV'},
      marketplace:{model:G?'取引手数料':'Transaction fees',tiers:G?'出品者5% + 購入者3% or 一律8%':'Seller 5% + Buyer 3% or Flat 8%',primary:G?'成約時手数料':'Commission on completion'},
      education:{model:G?'フリーミアム':'Freemium',tiers:G?'無料コンテンツ → プレミアムコース購入':'Free content → Premium course purchase',primary:G?'コース販売 + サブスク':'Course sales + Subscription'},
      fintech:{model:G?'取引手数料 + サブスク':'Transaction fees + Subscription',tiers:G?'無料取引(上限あり) / Pro (¥980/月 無制限)':'Free trades (limited) / Pro ($10/mo unlimited)',primary:G?'取引量 + 有料会員':'Transaction volume + Paid members'},
      booking:{model:G?'予約手数料':'Booking fees',tiers:G?'予約1件あたり10% or 月額サブスク':'10% per booking or Monthly subscription',primary:G?'予約成立時の手数料':'Commission on booking'},
      content:{model:G?'広告 + サブスク':'Ads + Subscription',tiers:G?'無料(広告表示) / プレミアム(¥480/月 広告なし)':'Free (with ads) / Premium ($5/mo ad-free)',primary:G?'広告収益 + 有料会員':'Ad revenue + Paid members'},
      community:{model:G?'フリーミアム':'Freemium',tiers:G?'基本無料 / プレミアム機能(¥500/月)':'Free basic / Premium features ($5/mo)',primary:G?'有料会員 + 広告':'Paid members + Ads'}
    };
    const revModel=revenueModels[domain]||{model:G?'サブスクリプション':'Subscription',tiers:G?'Free / Pro / Enterprise':'Free / Pro / Enterprise',primary:G?'月次定期課金':'Monthly recurring revenue'};

    doc38+='**'+(G?'推奨モデル':'Recommended Model')+'** ('+domain+'): '+revModel.model+'\n\n';
    doc38+='**'+(G?'料金体系':'Pricing Tiers')+'**:\n'+revModel.tiers+'\n\n';
    doc38+='**'+(G?'主要収益源':'Primary Revenue')+'**: '+revModel.primary+'\n\n';

    // Pricing Strategy
    doc38+=(G?'## 価格戦略':'## Pricing Strategy')+'\n\n';
    doc38+='### Tier'+(G?'設計':'Design')+'\n\n';
    doc38+='| Tier | '+(G?'価格':'Price')+' | '+(G?'主要機能':'Key Features')+' | '+(G?'ターゲット':'Target')+' |\n';
    doc38+='|------|------|------|------|\n';
    doc38+='| Free | ¥0 | '+(G?'基本機能・制限あり':'Basic features, limited')+' | '+(G?'個人・お試し':'Personal, trial')+' |\n';
    doc38+='| Pro | ¥980/'+( G?'月':'mo')+' | '+(G?'全機能・制限緩和':'All features, relaxed limits')+' | '+(G?'小規模チーム':'Small teams')+' |\n';
    doc38+='| Enterprise | ¥9,800/'+( G?'月':'mo')+' | '+(G?'無制限・専用サポート':'Unlimited, dedicated support')+' | '+(G?'大企業':'Enterprise')+' |\n\n';

    // Conversion Funnel (Mermaid)
    doc38+=(G?'## コンバージョンファネル':'## Conversion Funnel')+'\n\n';
    doc38+='```mermaid\ngraph TD\n';
    doc38+='  A['+(G?'訪問':'Visit')+' 🌐] -->|30%| B['+(G?'サインアップ':'Signup')+' ✍️]\n';
    doc38+='  B -->|60%| C['+(G?'アクティベーション':'Activate')+' ⚡]\n';
    doc38+='  C -->|20%| D['+(G?'有料転換':'Convert')+' 💳]\n';
    doc38+='  D -->|70%| E['+(G?'継続利用':'Retain')+' 🔁]\n\n';
    doc38+='  style A fill:#e1f5ff\n';
    doc38+='  style B fill:#fff4e6\n';
    doc38+='  style C fill:#e8f5e9\n';
    doc38+='  style D fill:#f3e5f5\n';
    doc38+='  style E fill:#fce4ec\n';
    doc38+='```\n\n';

    // KPI per stage
    doc38+='### '+(G?'ステージ別KPI':'KPIs per Stage')+'\n\n';
    doc38+='| '+(G?'ステージ':'Stage')+' | KPI | '+(G?'目標':'Target')+' | '+(G?'改善施策':'Improvement Actions')+' |\n';
    doc38+='|------|------|------|------|\n';
    doc38+='| '+(G?'訪問→サインアップ':'Visit→Signup')+' | '+( G?'サインアップ率':'Signup rate')+' | ≥30% | '+(G?'LP最適化・信頼性向上':'Optimize LP, build trust')+' |\n';
    doc38+='| '+(G?'サインアップ→アクティベーション':'Signup→Activation')+' | '+(G?'アクティベーション率':'Activation rate')+' | ≥60% | '+(G?'オンボーディング改善':'Improve onboarding')+' |\n';
    doc38+='| '+(G?'アクティベーション→有料転換':'Activation→Conversion')+' | '+(G?'有料転換率':'Conversion rate')+' | ≥20% | '+(G?'価値提示・限定オファー':'Show value, limited offer')+' |\n';
    doc38+='| '+(G?'有料転換→継続':'Conversion→Retention')+' | '+(G?'継続率':'Retention rate')+' | ≥70% | '+(G?'定期エンゲージメント':'Regular engagement')+' |\n\n';

    // Unit Economics
    doc38+=(G?'## ユニットエコノミクス':'## Unit Economics')+'\n\n';
    doc38+='### '+(G?'概算テンプレート':'Estimation Template')+'\n\n';
    doc38+='**CAC** ('+(G?'顧客獲得コスト':'Customer Acquisition Cost')+')\n';
    doc38+='- '+(G?'広告費':'Ad spend')+': ¥100,000/'+( G?'月':'mo')+'\n';
    doc38+='- '+(G?'新規顧客':'New customers')+': 100/'+( G?'月':'mo')+'\n';
    doc38+='- **CAC = ¥1,000/'+( G?'顧客':'customer')+'**\n\n';

    doc38+='**LTV** ('+(G?'顧客生涯価値':'Lifetime Value')+')\n';
    doc38+='- ARPU ('+(G?'ユーザー単価':'Avg Revenue per User')+'): ¥980/'+( G?'月':'mo')+'\n';
    doc38+='- '+(G?'平均利用期間':'Avg lifetime')+': 12'+( G?'ヶ月':'months')+'\n';
    doc38+='- **LTV = ¥11,760**\n\n';

    doc38+='**LTV/CAC '+(G?'比率':'Ratio')+'**\n';
    doc38+='- LTV/CAC = ¥11,760 / ¥1,000 = **11.76**\n';
    doc38+='- '+(G?'目標':'Target')+': **≥3** ('+(G?'健全':'healthy')+')\n';
    doc38+='- '+(G?'評価':'Assessment')+': ✅ '+(G?'優秀':'Excellent')+'\n\n';

    doc38+='**Payback '+(G?'期間':'Period')+'**\n';
    doc38+='- CAC / ARPU = ¥1,000 / ¥980 = **1.02'+( G?'ヶ月':'months')+'**\n';
    doc38+='- '+(G?'目標':'Target')+': **≤12'+( G?'ヶ月':'months')+'**\n';
    doc38+='- '+(G?'評価':'Assessment')+': ✅ '+(G?'優秀':'Excellent')+'\n\n';

    // Monetization Tactics
    doc38+=(G?'## 収益化戦術':'## Monetization Tactics')+'\n\n';

    const domainTactics={
      saas:G?['無料トライアル14日','使用量制限で有料誘導','年払い割引(2ヶ月分)']:['14-day free trial','Usage limits to drive upgrades','Annual discount (2mo free)'],
      ec:G?['初回注文クーポン','まとめ買い割引','会員ランク制度']:['First order coupon','Bulk purchase discount','Member rank system'],
      education:G?['最初の3レッスン無料','修了証発行は有料','コミュニティアクセス(有料)']:['First 3 lessons free','Paid certificate issuance','Premium community access'],
      marketplace:G?['初回取引手数料無料','大口出品者割引','プレミアム掲載']:['First transaction fee-free','Volume seller discount','Premium listings'],
      fintech:G?['少額取引無料','即時送金は有料','投資アドバイス(有料)']:['Small transaction free','Instant transfer paid','Investment advice (paid)']
    };
    const tactics=domainTactics[domain]||(G?['無料トライアル','使用量制限','年払い割引']:['Free trial','Usage limits','Annual discount']);

    tactics.forEach((tactic,i)=>{
      doc38+=(i+1)+'. **'+tactic+'**\n';
    });
    doc38+='\n';

    // Growth Levers
    const rfMap=REVERSE_FLOW_MAP[domain]||REVERSE_FLOW_MAP._default;
    doc38+=(G?'## 成長レバー':'## Growth Levers')+'\n\n';
    doc38+=G?'このドメインの主要なKPI（目標値は docs/30_goal_decomposition.md 参照）:\n\n':'Key KPIs for this domain (targets in docs/30_goal_decomposition.md):\n\n';
    const kpis=G?rfMap.kpi_ja:rfMap.kpi_en;
    kpis.forEach((kpi,i)=>{
      doc38+=(i+1)+'. '+kpi+'\n';
    });
    doc38+='\n';

    // Related Documents
    doc38+=(G?'## 関連ドキュメント':'## Related Documents')+'\n\n';
    doc38+='- **docs/30_goal_decomposition.md** — '+(G?'目標分解とKPI':'Goal decomposition & KPIs')+'\n';
    doc38+='- **.spec/constitution.md** — '+(G?'プロジェクトビジョン':'Project vision')+'\n';
    doc38+='- **docs/24_progress.md** — '+(G?'進捗追跡':'Progress tracking')+'\n';
    doc38+='- **docs/05_api_design.md** — '+(G?'決済API実装':'Payment API implementation')+'\n\n';

    S.files['docs/38_business_model.md']=doc38;
  }

  // ═══ C2: Growth Intelligence (always generated) ═══
  const gdomain=detectDomain(a.purpose)||'_default';
  const gd=DOMAIN_GROWTH[gdomain]||DOMAIN_GROWTH._default;
  let doc41='# '+pn+' — '+(G?'グロースインテリジェンス':'Growth Intelligence')+'\n\n';

  // Section 1: Stack Compatibility Score
  const syn=calcSynergy(a);
  doc41+='## '+(G?'1. スタック相性スコア':'1. Tech Stack Compatibility Score')+'\n\n';
  doc41+='| '+(G?'次元':'Dimension')+' | '+(G?'スコア':'Score')+' | '+(G?'説明':'Description')+' |\n|-----|-------|------|\n';
  const dimNames=G?['FE↔BE親和性','エコシステム統一性','ドメイン適合度','デプロイ整合性','複雑度バランス']:['FE↔BE Affinity','Ecosystem Unity','Domain Fit','Deploy Alignment','Complexity Balance'];
  [syn.d1,syn.d2,syn.d3,syn.d4,syn.d5].forEach((s,i)=>{
    doc41+='| '+dimNames[i]+' | '+s+'/100 | '+(s>=80?(G?'✅ 良好':'✅ Good'):s>=60?(G?'⚠️ 改善余地':'⚠️ Room to improve'):(G?'❌ 要対策':'❌ Action needed'))+' |\n';
  });
  doc41+='\n'+(G?'**総合スタックスコア**: ':'**Overall Stack Score**: ')+syn.overall+'/100\n\n';

  // Compat warnings
  const cw=checkCompat(a);
  if(cw.length>0){
    doc41+='### '+(G?'互換性アラート':'Compatibility Alerts')+'\n\n';
    cw.slice(0,8).forEach(r=>{
      doc41+='- '+(r.severity==='error'?'❌':'⚠️')+' **'+r.id+'**: '+(G?r.msg_ja:r.msg_en)+'\n';
    });
    doc41+='\n';
  }

  // Section 2: Growth Funnel (Mermaid)
  const stages=G?gd.fj:gd.fe;
  doc41+='## '+(G?'2. ドメイン別グロースファネル':'2. Domain Growth Funnel')+'\n\n';
  doc41+='```mermaid\ngraph LR\n';
  stages.forEach((s,i)=>{
    if(i<stages.length-1) doc41+='  S'+i+'["'+s+' ('+gd.cvr[i]+'%)"] --> S'+(i+1)+'["'+stages[i+1]+' ('+gd.cvr[i+1]+'%)"]\n';
  });
  doc41+='```\n\n';
  doc41+='| '+(G?'ステージ':'Stage')+' | '+(G?'ベンチマーク':'Benchmark')+' | '+(G?'前段からのCVR':'Stage CVR')+' |\n|--------|-----------|----------|\n';
  stages.forEach((s,i)=>{
    const cvr=i===0?'-':((gd.cvr[i]/gd.cvr[i-1]*100).toFixed(1)+'%');
    doc41+='| '+s+' | '+gd.cvr[i]+'% | '+cvr+' |\n';
  });
  doc41+='\n';

  // Section 3: Growth Equation
  doc41+='## '+(G?'3. グロース方程式':'3. Growth Equation')+'\n\n';
  doc41+='```\n'+gd.eq+'\n```\n\n';
  doc41+=(G?'**感度分析**: 各変数を10%改善すると、全体収益は約10%向上（複利効果で実際はそれ以上）。複数のレバーを同時に改善することで掛け算的成長が可能。\n\n':'**Sensitivity**: Improving each variable by 10% yields ~10% revenue lift (compounding makes it higher). Simultaneously improving multiple levers creates multiplicative growth.\n\n');

  // Section 4: Growth Levers
  const levers=G?gd.lj:gd.le;
  doc41+='## '+(G?'4. グロースレバー（優先順）':'4. Growth Levers (Prioritized)')+'\n\n';
  levers.forEach((l,i)=>{doc41+=(i+1)+'. '+l+'\n';});
  doc41+='\n';

  // Section 5: Pricing Strategy
  doc41+='## '+(G?'5. 価格戦略（松竹梅モデル）':'5. Pricing Strategy (Three-Tier Model)')+'\n\n';
  const prices=G?gd.pj:gd.pe;
  const tierNames=G?['🥉 松（エントリー）','🥈 竹（メイン）★推奨','🥇 梅（プレミアム）']:['🥉 Good (Entry)','🥈 Better (Main) ★Recommended','🥇 Best (Premium)'];
  doc41+='| '+(G?'ティア':'Tier')+' | '+(G?'価格帯':'Price Range')+' |\n|------|------|\n';
  prices.forEach((p,i)=>{doc41+='| '+tierNames[i]+' | '+p+' |\n';});
  doc41+='\n'+(G?'> **心理効果**: 3択を提示すると中間（竹）が選ばれやすい（妥協効果）。最上位は「アンカー」として竹の割安感を演出する。\n\n':'> **Psychology**: Presenting 3 options makes the middle tier most popular (compromise effect). The top tier serves as an anchor to make the middle tier feel like good value.\n\n');

  // Section 6: Performance Budget
  doc41+='## '+(G?'6. パフォーマンス予算':'6. Performance Budget')+'\n\n';
  doc41+='| '+(G?'指標':'Metric')+' | '+(G?'目標':'Target')+' | '+(G?'ビジネスインパクト':'Business Impact')+' |\n|------|------|-------|\n';
  doc41+='| LCP | < 2.5s | '+(G?'離脱率-25%':'Bounce rate -25%')+' |\n';
  doc41+='| FID | < 100ms | '+(G?'UXスコア+20pt':'UX score +20pt')+' |\n';
  doc41+='| CLS | < 0.1 | '+(G?'信頼性+15%':'Trust +15%')+' |\n';
  doc41+='| '+(G?'初回バンドル':'Initial Bundle')+' | < 200KB (gzip) | '+(G?'FCP改善':'FCP improvement')+' |\n\n';
  // Tech-specific tips
  const fe=a.frontend||'';
  if(fe.includes('Next')){
    doc41+=(G?'**Next.js最適化**: ISR活用, next/image, Edge Middleware, Server Components優先\n\n':'**Next.js Optimization**: Use ISR, next/image, Edge Middleware, prefer Server Components\n\n');
  }else if(fe.includes('Vue')||fe.includes('Nuxt')){
    doc41+=(G?'**Vue/Nuxt最適化**: Lazy Hydration, コンポーネント分割, auto-imports\n\n':'**Vue/Nuxt Optimization**: Lazy Hydration, component splitting, auto-imports\n\n');
  }else{
    doc41+=(G?'**SPA最適化**: React.lazy + Suspense, ルート分割, Dynamic Import\n\n':'**SPA Optimization**: React.lazy + Suspense, route splitting, Dynamic Import\n\n');
  }

  // Section 7: Cross-references
  doc41+='## '+(G?'7. 関連ドキュメント':'7. Related Documents')+'\n\n';
  doc41+='- **docs/30_goal_decomposition.md** — '+(G?'目標分解とKPI':'Goal decomposition & KPIs')+'\n';
  doc41+='- **docs/38_business_model.md** — '+(G?'ビジネスモデル詳細（決済設定時）':'Business model details (when payment configured)')+'\n';
  doc41+='- **docs/24_progress.md** — '+(G?'進捗追跡':'Progress tracking')+'\n';
  doc41+='- **docs/28_qa_strategy.md** — '+(G?'品質戦略':'QA strategy')+'\n\n';

  S.files['docs/41_growth_intelligence.md']=doc41;
}
