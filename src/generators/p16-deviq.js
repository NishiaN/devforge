// P16: Polymorphic Development Intelligence Generator
// Generates: docs/60_methodology_intelligence.md, 61_ai_brainstorm_playbook.md, 62_industry_deep_dive.md, 63_next_gen_ux_strategy.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

// DEV_METHODOLOGY_MAP: Domain-specific optimal methodology combinations (32 domains + default)
// Maps domains to optimal combinations of 12 design approaches from 駆動開発 AI壁打ちプロンプトテンプレート集
const DEV_METHODOLOGY_MAP = {
  education: {
    primary_ja: 'フロー状態設計 + プログレッシブ開示',
    primary_en: 'Flow State + Progressive Disclosure',
    secondary_ja: '認知負荷最小化 + インクルーシブ',
    secondary_en: 'Cognitive Load Min. + Inclusive',
    rationale_ja: '学習は集中フロー維持が最重要。情報を段階的に開示し、認知負荷を抑えつつ、多様な学習スタイルに対応する必要がある。',
    rationale_en: 'Learning requires sustained flow. Information should be progressively disclosed while minimizing cognitive load and supporting diverse learning styles.',
    kw_ja: ['フロー維持','マイクロラーニング','段階的開示','アクセシブル'],
    kw_en: ['Flow state','Microlearning','Progressive disclosure','Accessible']
  },
  ec: {
    primary_ja: 'エモーショナル + 時間価値最大化',
    primary_en: 'Emotional + Time Value Max.',
    secondary_ja: 'コンテキスト適応 + データドリブン',
    secondary_en: 'Context Adaptive + Data-Driven',
    rationale_ja: 'ECは感情価値（欲しい！）と効率（すぐ買える）の両立が鍵。文脈に応じたレコメンド、データ分析による継続的CVR改善が必須。',
    rationale_en: 'E-commerce requires balancing emotional value (desire) with efficiency (quick purchase). Context-aware recommendations and data-driven CVR optimization are essential.',
    kw_ja: ['一目惚れUI','ワンクリック購入','パーソナライズ','A/Bテスト'],
    kw_en: ['Love at first sight UI','One-click purchase','Personalization','A/B testing']
  },
  fintech: {
    primary_ja: 'レジリエント + データドリブン',
    primary_en: 'Resilient + Data-Driven',
    secondary_ja: '認知負荷最小化 + インクルーシブ',
    secondary_en: 'Cognitive Load Min. + Inclusive',
    rationale_ja: '金融は信頼が命。エラー回復力、セキュリティ透明性、誰にでも分かりやすいUI、データに基づく不正検知が重要。',
    rationale_en: 'Finance demands trust. Error resilience, security transparency, intuitive UI for all users, and data-driven fraud detection are critical.',
    kw_ja: ['冪等性','自己修復','透明な取引履歴','金融リテラシー配慮'],
    kw_en: ['Idempotency','Self-healing','Transparent transaction history','Financial literacy consideration']
  },
  health: {
    primary_ja: 'レジリエント + インクルーシブ',
    primary_en: 'Resilient + Inclusive',
    secondary_ja: 'プログレッシブ開示 + 認知負荷最小化',
    secondary_en: 'Progressive Disclosure + Cognitive Load Min.',
    rationale_ja: '医療は可用性99.99%必須。高齢者・障がい者対応、プライバシー配慮、専門用語の段階的説明が求められる。',
    rationale_en: 'Healthcare requires 99.99% availability. Elderly/disabled support, privacy consideration, and progressive explanation of medical terms are essential.',
    kw_ja: ['WCAG AAA','緊急時フェイルセーフ','平易な医療情報','多言語対応'],
    kw_en: ['WCAG AAA','Emergency failsafe','Plain medical info','Multilingual']
  },
  saas: {
    primary_ja: 'プログレッシブ開示 + データドリブン',
    primary_en: 'Progressive Disclosure + Data-Driven',
    secondary_ja: '時間価値最大化 + アトミック設計',
    secondary_en: 'Time Value Max. + Atomic Design',
    rationale_ja: 'SaaSは自己学習とオンボーディングが成否を分ける。段階的に機能を開示し、使用量データでUX改善、再利用可能なコンポーネント設計。',
    rationale_en: 'SaaS success depends on self-learning and onboarding. Progressive feature disclosure, usage data for UX improvement, and reusable component design.',
    kw_ja: ['セルフサービス','使用量可視化','コンポーネントライブラリ','PQLトラッキング'],
    kw_en: ['Self-service','Usage visibility','Component library','PQL tracking']
  },
  marketplace: {
    primary_ja: 'データドリブン + レジリエント',
    primary_en: 'Data-Driven + Resilient',
    secondary_ja: 'エモーショナル + インクルーシブ',
    secondary_en: 'Emotional + Inclusive',
    rationale_ja: 'マーケットプレイスは信頼シグナル（レビュー）とマッチング精度がKPI。エラー回復（決済失敗等）、多様なユーザー層対応が必須。',
    rationale_en: 'Marketplace KPIs are trust signals (reviews) and matching accuracy. Error recovery (payment failure) and diverse user support are essential.',
    kw_ja: ['レビュー信頼性','リアルタイムマッチング','エスクロー','多様性配慮'],
    kw_en: ['Review credibility','Real-time matching','Escrow','Diversity consideration']
  },
  community: {
    primary_ja: 'エモーショナル + データドリブン',
    primary_en: 'Emotional + Data-Driven',
    secondary_ja: 'フロー状態設計 + インクルーシブ',
    secondary_en: 'Flow State + Inclusive',
    rationale_ja: 'コミュニティはエンゲージメントが全て。感情的つながり、フロー状態維持（無限スクロール）、データ分析による有害コンテンツ排除。',
    rationale_en: 'Community is all about engagement. Emotional connection, flow state maintenance (infinite scroll), and data-driven harmful content removal.',
    kw_ja: ['UGC推奨','デイリーストリーク','モデレーション','セーフスペース'],
    kw_en: ['UGC promotion','Daily streak','Moderation','Safe space']
  },
  content: {
    primary_ja: 'フロー状態設計 + エモーショナル',
    primary_en: 'Flow State + Emotional',
    secondary_ja: 'プログレッシブ開示 + データドリブン',
    secondary_en: 'Progressive Disclosure + Data-Driven',
    rationale_ja: 'コンテンツ消費は没入体験とストーリーテリングが鍵。読了率・視聴完了率をKPIにデータ分析。',
    rationale_en: 'Content consumption requires immersive experience and storytelling. Read/watch completion rates are key KPIs for data analysis.',
    kw_ja: ['ストーリーテリング','読了率','レコメンドエンジン','没入UI'],
    kw_en: ['Storytelling','Completion rate','Recommendation engine','Immersive UI']
  },
  analytics: {
    primary_ja: 'データドリブン + 認知負荷最小化',
    primary_en: 'Data-Driven + Cognitive Load Min.',
    secondary_ja: 'プログレッシブ開示 + 時間価値最大化',
    secondary_en: 'Progressive Disclosure + Time Value Max.',
    rationale_ja: '分析ツールは複雑性との戦い。情報の段階的開示、直感的ダッシュボード、クイック分析機能が重要。',
    rationale_en: 'Analytics tools battle complexity. Progressive information disclosure, intuitive dashboards, and quick analysis features are crucial.',
    kw_ja: ['ビジュアル分析','ドリルダウン','クイックインサイト','認知負荷設計'],
    kw_en: ['Visual analytics','Drill-down','Quick insights','Cognitive load design']
  },
  booking: {
    primary_ja: '時間価値最大化 + コンテキスト適応',
    primary_en: 'Time Value Max. + Context Adaptive',
    secondary_ja: 'レジリエント + プログレッシブ開示',
    secondary_en: 'Resilient + Progressive Disclosure',
    rationale_ja: '予約は時間軸が命。最短での予約完了、キャンセル/変更の柔軟性、在庫リアルタイム反映が必須。',
    rationale_en: 'Booking is all about time. Quick reservation completion, flexible cancellation/changes, and real-time inventory are essential.',
    kw_ja: ['カレンダーUI','リアルタイム在庫','ワンクリック予約','自動リマインド'],
    kw_en: ['Calendar UI','Real-time inventory','One-click booking','Auto reminder']
  },
  iot: {
    primary_ja: 'レジリエント + コンテキスト適応',
    primary_en: 'Resilient + Context Adaptive',
    secondary_ja: 'データドリブン + サステナブル',
    secondary_en: 'Data-Driven + Sustainable',
    rationale_ja: 'IoTはオフライン耐性とエッジ処理が鍵。センサーデータ分析、省電力設計、自己修復機能。',
    rationale_en: 'IoT requires offline resilience and edge processing. Sensor data analysis, power-saving design, and self-healing functions.',
    kw_ja: ['エッジコンピューティング','オフラインファースト','省電力','異常検知'],
    kw_en: ['Edge computing','Offline-first','Power-saving','Anomaly detection']
  },
  realestate: {
    primary_ja: 'エモーショナル + データドリブン',
    primary_en: 'Emotional + Data-Driven',
    secondary_ja: 'コンテキスト適応 + プログレッシブ開示',
    secondary_en: 'Context Adaptive + Progressive Disclosure',
    rationale_ja: '不動産は感情的決断と理性的比較の両立。VRツアー、周辺情報、価格トレンド分析、ライフスタイル提案。',
    rationale_en: 'Real estate balances emotional decisions with rational comparison. VR tours, neighborhood info, price trend analysis, lifestyle proposals.',
    kw_ja: ['VRツアー','周辺情報統合','価格分析','ライフスタイル提案'],
    kw_en: ['VR tour','Neighborhood integration','Price analysis','Lifestyle proposal']
  },
  legal: {
    primary_ja: 'レジリエント + 認知負荷最小化',
    primary_en: 'Resilient + Cognitive Load Min.',
    secondary_ja: 'データドリブン + インクルーシブ',
    secondary_en: 'Data-Driven + Inclusive',
    rationale_ja: '法務は正確性とトレーサビリティが命。専門用語の平易化、バージョン管理、監査ログ、アクセシビリティ。',
    rationale_en: 'Legal requires accuracy and traceability. Plain language for jargon, version control, audit logs, and accessibility.',
    kw_ja: ['バージョン管理','監査ログ','平易な法律用語','電子署名'],
    kw_en: ['Version control','Audit log','Plain legal language','E-signature']
  },
  hr: {
    primary_ja: 'インクルーシブ + データドリブン',
    primary_en: 'Inclusive + Data-Driven',
    secondary_ja: 'エモーショナル + 認知負荷最小化',
    secondary_en: 'Emotional + Cognitive Load Min.',
    rationale_ja: 'HRは多様性と公平性が最重要。バイアス排除、データ駆動採用、従業員体験（EX）設計。',
    rationale_en: 'HR prioritizes diversity and equity. Bias elimination, data-driven recruitment, and employee experience (EX) design.',
    kw_ja: ['バイアス排除','従業員体験','スキル可視化','多様性指標'],
    kw_en: ['Bias elimination','Employee experience','Skill visibility','Diversity metrics']
  },
  portfolio: {
    primary_ja: 'エモーショナル + アトミック設計',
    primary_en: 'Emotional + Atomic Design',
    secondary_ja: 'フロー状態設計 + サステナブル',
    secondary_en: 'Flow State + Sustainable',
    rationale_ja: 'ポートフォリオはストーリーテリングと美的体験。再利用可能コンポーネント、滑らかな遷移、軽量設計。',
    rationale_en: 'Portfolio is about storytelling and aesthetic experience. Reusable components, smooth transitions, and lightweight design.',
    kw_ja: ['ストーリーテリング','マイクロインタラクション','コンポーネント','軽量化'],
    kw_en: ['Storytelling','Micro-interactions','Components','Lightweight']
  },
  tool: {
    primary_ja: '時間価値最大化 + 認知負荷最小化',
    primary_en: 'Time Value Max. + Cognitive Load Min.',
    secondary_ja: 'プログレッシブ開示 + アトミック設計',
    secondary_en: 'Progressive Disclosure + Atomic Design',
    rationale_ja: 'ツールは生産性が全て。最短操作、ショートカット、段階的な高度機能開示、一貫したUI。',
    rationale_en: 'Tools are all about productivity. Minimal operations, shortcuts, progressive advanced feature disclosure, consistent UI.',
    kw_ja: ['ショートカット','クイックアクション','コマンドパレット','一貫性'],
    kw_en: ['Shortcuts','Quick actions','Command palette','Consistency']
  },
  ai: {
    primary_ja: 'AIファースト + コンテキスト適応',
    primary_en: 'AI-First + Context Adaptive',
    secondary_ja: 'データドリブン + プログレッシブ開示',
    secondary_en: 'Data-Driven + Progressive Disclosure',
    rationale_ja: 'AIアプリは文脈理解と継続学習が鍵。プロンプト設計、フィードバックループ、段階的な信頼構築。',
    rationale_en: 'AI apps require context understanding and continuous learning. Prompt design, feedback loops, and progressive trust building.',
    kw_ja: ['プロンプト最適化','フィードバックループ','信頼構築','説明可能性'],
    kw_en: ['Prompt optimization','Feedback loop','Trust building','Explainability']
  },
  automation: {
    primary_ja: 'レジリエント + AIファースト',
    primary_en: 'Resilient + AI-First',
    secondary_ja: '時間価値最大化 + データドリブン',
    secondary_en: 'Time Value Max. + Data-Driven',
    rationale_ja: '自動化は信頼性と効率。エラー自己修復、AI判断、実行ログ、ROI可視化。',
    rationale_en: 'Automation requires reliability and efficiency. Error self-healing, AI judgment, execution logs, ROI visibility.',
    kw_ja: ['自己修復','AI判断','実行ログ','ROI可視化'],
    kw_en: ['Self-healing','AI judgment','Execution log','ROI visibility']
  },
  event: {
    primary_ja: '時間価値最大化 + エモーショナル',
    primary_en: 'Time Value Max. + Emotional',
    secondary_ja: 'コンテキスト適応 + データドリブン',
    secondary_en: 'Context Adaptive + Data-Driven',
    rationale_ja: 'イベントは時間軸とワクワク感。リアルタイム更新、ソーシャル機能、参加前後の体験設計。',
    rationale_en: 'Events are about timeline and excitement. Real-time updates, social features, pre/post-event experience design.',
    kw_ja: ['リアルタイム','ソーシャル','カウントダウン','思い出機能'],
    kw_en: ['Real-time','Social','Countdown','Memory feature']
  },
  gamify: {
    primary_ja: 'フロー状態設計 + エモーショナル',
    primary_en: 'Flow State + Emotional',
    secondary_ja: 'データドリブン + プログレッシブ開示',
    secondary_en: 'Data-Driven + Progressive Disclosure',
    rationale_ja: 'ゲーミフィケーションは没入とモチベーション。難易度調整、報酬設計、プログレス可視化。',
    rationale_en: 'Gamification is about immersion and motivation. Difficulty adjustment, reward design, progress visualization.',
    kw_ja: ['難易度調整','報酬設計','プログレス可視化','ストリーク'],
    kw_en: ['Difficulty adjustment','Reward design','Progress visualization','Streak']
  },
  collab: {
    primary_ja: 'レジリエント + フロー状態設計',
    primary_en: 'Resilient + Flow State',
    secondary_ja: 'コンテキスト適応 + データドリブン',
    secondary_en: 'Context Adaptive + Data-Driven',
    rationale_ja: 'コラボツールは同期性と競合解決。リアルタイムOT/CRDT、プレゼンス、コンフリクト自動解決。',
    rationale_en: 'Collaboration tools require synchronization and conflict resolution. Real-time OT/CRDT, presence, auto conflict resolution.',
    kw_ja: ['リアルタイム同期','CRDT','プレゼンス','競合解決'],
    kw_en: ['Real-time sync','CRDT','Presence','Conflict resolution']
  },
  devtool: {
    primary_ja: '時間価値最大化 + アトミック設計',
    primary_en: 'Time Value Max. + Atomic Design',
    secondary_ja: 'データドリブン + 認知負荷最小化',
    secondary_en: 'Data-Driven + Cognitive Load Min.',
    rationale_ja: '開発ツールは生産性とDX。ショートカット、拡張性、メトリクス可視化、学習曲線最小化。',
    rationale_en: 'Dev tools prioritize productivity and DX. Shortcuts, extensibility, metrics visualization, minimal learning curve.',
    kw_ja: ['CLI/GUI両立','拡張性','メトリクス','ドキュメント'],
    kw_en: ['CLI/GUI hybrid','Extensibility','Metrics','Documentation']
  },
  creator: {
    primary_ja: 'フロー状態設計 + エモーショナル',
    primary_en: 'Flow State + Emotional',
    secondary_ja: 'AIファースト + アトミック設計',
    secondary_en: 'AI-First + Atomic Design',
    rationale_ja: 'クリエイターツールは創作フロー維持が命。AI補助、テンプレート、無限キャンバス、保存の自動化。',
    rationale_en: 'Creator tools prioritize creative flow. AI assistance, templates, infinite canvas, auto-save.',
    kw_ja: ['無限キャンバス','AI補助','自動保存','テンプレート'],
    kw_en: ['Infinite canvas','AI assistance','Auto-save','Templates']
  },
  newsletter: {
    primary_ja: 'エモーショナル + データドリブン',
    primary_en: 'Emotional + Data-Driven',
    secondary_ja: '時間価値最大化 + コンテキスト適応',
    secondary_en: 'Time Value Max. + Context Adaptive',
    rationale_ja: 'ニュースレターは開封率とエンゲージメント。A/Bテスト、セグメント配信、パーソナライズ、配信時間最適化。',
    rationale_en: 'Newsletters prioritize open rates and engagement. A/B testing, segmented delivery, personalization, optimal timing.',
    kw_ja: ['開封率最適化','セグメント','A/Bテスト','パーソナライズ'],
    kw_en: ['Open rate optimization','Segmentation','A/B testing','Personalization']
  },
  manufacturing: {
    primary_ja: 'レジリエント + データドリブン',
    primary_en: 'Resilient + Data-Driven',
    secondary_ja: '時間価値最大化 + サステナブル',
    secondary_en: 'Time Value Max. + Sustainable',
    rationale_ja: '製造は稼働率と品質。予知保全、リアルタイムモニタリング、省エネ、トレーサビリティ。',
    rationale_en: 'Manufacturing prioritizes uptime and quality. Predictive maintenance, real-time monitoring, energy-saving, traceability.',
    kw_ja: ['予知保全','IoT連携','省エネ','品質管理'],
    kw_en: ['Predictive maintenance','IoT integration','Energy-saving','Quality control']
  },
  logistics: {
    primary_ja: '時間価値最大化 + レジリエント',
    primary_en: 'Time Value Max. + Resilient',
    secondary_ja: 'データドリブン + コンテキスト適応',
    secondary_en: 'Data-Driven + Context Adaptive',
    rationale_ja: '物流はスピードと正確性。リアルタイム追跡、ルート最適化、異常検知、配送時間予測。',
    rationale_en: 'Logistics prioritizes speed and accuracy. Real-time tracking, route optimization, anomaly detection, delivery time prediction.',
    kw_ja: ['リアルタイム追跡','ルート最適化','異常検知','配送予測'],
    kw_en: ['Real-time tracking','Route optimization','Anomaly detection','Delivery prediction']
  },
  agriculture: {
    primary_ja: 'データドリブン + サステナブル',
    primary_en: 'Data-Driven + Sustainable',
    secondary_ja: 'IoT連携 + コンテキスト適応',
    secondary_en: 'IoT Integration + Context Adaptive',
    rationale_ja: '農業はデータ活用と環境配慮。センサーデータ分析、気象予測連携、資源最適化、トレーサビリティ。',
    rationale_en: 'Agriculture prioritizes data utilization and environmental care. Sensor data analysis, weather forecast integration, resource optimization, traceability.',
    kw_ja: ['センサー分析','気象連携','資源最適化','トレーサビリティ'],
    kw_en: ['Sensor analysis','Weather integration','Resource optimization','Traceability']
  },
  energy: {
    primary_ja: 'レジリエント + サステナブル',
    primary_en: 'Resilient + Sustainable',
    secondary_ja: 'データドリブン + 時間価値最大化',
    secondary_en: 'Data-Driven + Time Value Max.',
    rationale_ja: 'エネルギーは安定供給と脱炭素。需給予測、ピークシフト、再エネ統合、停電耐性。',
    rationale_en: 'Energy prioritizes stable supply and decarbonization. Demand forecasting, peak shifting, renewable integration, blackout resilience.',
    kw_ja: ['需給予測','ピークシフト','再エネ統合','停電耐性'],
    kw_en: ['Demand forecasting','Peak shifting','Renewable integration','Blackout resilience']
  },
  media: {
    primary_ja: 'フロー状態設計 + エモーショナル',
    primary_en: 'Flow State + Emotional',
    secondary_ja: 'データドリブン + コンテキスト適応',
    secondary_en: 'Data-Driven + Context Adaptive',
    rationale_ja: 'メディアは没入とストーリーテリング。視聴完了率、レコメンド、デバイス最適化、オフライン再生。',
    rationale_en: 'Media prioritizes immersion and storytelling. Completion rate, recommendations, device optimization, offline playback.',
    kw_ja: ['没入体験','レコメンド','デバイス最適化','オフライン'],
    kw_en: ['Immersive experience','Recommendations','Device optimization','Offline']
  },
  government: {
    primary_ja: 'インクルーシブ + レジリエント',
    primary_en: 'Inclusive + Resilient',
    secondary_ja: '認知負荷最小化 + データドリブン',
    secondary_en: 'Cognitive Load Min. + Data-Driven',
    rationale_ja: '行政はアクセシビリティと信頼性。WCAG AAA準拠、多言語対応、災害時稼働、監査ログ。',
    rationale_en: 'Government prioritizes accessibility and reliability. WCAG AAA compliance, multilingual support, disaster resilience, audit logs.',
    kw_ja: ['WCAG AAA','多言語','災害対応','監査ログ'],
    kw_en: ['WCAG AAA','Multilingual','Disaster response','Audit log']
  },
  travel: {
    primary_ja: 'エモーショナル + コンテキスト適応',
    primary_en: 'Emotional + Context Adaptive',
    secondary_ja: 'データドリブン + 時間価値最大化',
    secondary_en: 'Data-Driven + Time Value Max.',
    rationale_ja: '旅行はワクワク感と利便性。パーソナライズ提案、リアルタイム情報、オフライン対応、思い出機能。',
    rationale_en: 'Travel prioritizes excitement and convenience. Personalized suggestions, real-time info, offline support, memory features.',
    kw_ja: ['パーソナライズ','リアルタイム','オフライン','思い出'],
    kw_en: ['Personalized','Real-time','Offline','Memory']
  },
  insurance: {
    primary_ja: 'レジリエント + 認知負荷最小化',
    primary_en: 'Resilient + Cognitive Load Min.',
    secondary_ja: 'データドリブン + インクルーシブ',
    secondary_en: 'Data-Driven + Inclusive',
    rationale_ja: '保険は信頼性と分かりやすさ。専門用語の平易化、リスク可視化、迅速な審査・支払い、バイアス排除。',
    rationale_en: 'Insurance prioritizes reliability and clarity. Plain language for jargon, risk visualization, quick claims processing, bias elimination.',
    kw_ja: ['平易な約款','リスク可視化','迅速審査','バイアス排除'],
    kw_en: ['Plain policy','Risk visualization','Quick claims','Bias elimination']
  },
  _default: {
    primary_ja: 'データドリブン + 認知負荷最小化',
    primary_en: 'Data-Driven + Cognitive Load Min.',
    secondary_ja: '時間価値最大化 + レジリエント',
    secondary_en: 'Time Value Max. + Resilient',
    rationale_ja: '汎用アプリは測定可能性とユーザビリティが基本。データ分析、直感的UI、効率性、エラー回復力。',
    rationale_en: 'General apps prioritize measurability and usability. Data analysis, intuitive UI, efficiency, error resilience.',
    kw_ja: ['測定可能性','直感的UI','効率性','回復力'],
    kw_en: ['Measurability','Intuitive UI','Efficiency','Resilience']
  }
};

// PHASE_PROMPTS: 6-phase AI brainstorming prompt templates (from 駆動開発 AI壁打ちプロンプトテンプレート集)
const PHASE_PROMPTS = {
  p0: {
    title_ja: 'Phase 0: プロジェクト初期構想',
    title_en: 'Phase 0: Project Conception',
    tpl: [
      {
        id: 'approach_select',
        label_ja: '設計アプローチ選定',
        label_en: 'Design Approach Selection',
        prompt_ja: 'プロジェクト「{projectName}」（業種: {domain}）において、最適な設計アプローチを12の選択肢（フロー状態、認知負荷最小化、時間価値最大化、コンテキスト適応、プログレッシブ開示、レジリエント、アトミック、データドリブン、インクルーシブ、エモーショナル、AIファースト、サステナブル）から3-5個選定してください。各アプローチの選定理由と期待効果を明記し、組み合わせシナジーを分析してください。',
        prompt_en: 'For project "{projectName}" (domain: {domain}), select 3-5 optimal design approaches from 12 options (Flow State, Cognitive Load Min., Time Value Max., Context Adaptive, Progressive Disclosure, Resilient, Atomic, Data-Driven, Inclusive, Emotional, AI-First, Sustainable). Provide selection rationale, expected effects, and analyze synergies.'
      },
      {
        id: 'constraint_analysis',
        label_ja: '制約条件分析',
        label_en: 'Constraint Analysis',
        prompt_ja: 'プロジェクト「{projectName}」の制約条件（予算/期間/リソース/技術スタック: {stack}）を分析し、トレードオフパターン（速度優先/品質優先/バランス型）を提示してください。各パターンのメリット・デメリット、リスク管理計画、段階的実装ロードマップを含めてください。',
        prompt_en: 'Analyze constraints for "{projectName}" (budget/timeline/resources/tech stack: {stack}). Present trade-off patterns (speed-first/quality-first/balanced). Include merits, demerits, risk management plan, and phased implementation roadmap.'
      },
      {
        id: 'kpi_define',
        label_ja: '成功指標（KPI）定義',
        label_en: 'Success Metrics (KPI) Definition',
        prompt_ja: 'プロジェクト「{projectName}」の選定設計アプローチ（{methodology}）に基づき、測定可能な成功指標を定義してください。ユーザー体験指標（例: タスク完了時間、初回成功率）、ビジネス指標（CVR、継続率、LTV）、技術指標（LCP、FID、CLS、エラー率）を含め、測定方法とダッシュボード設計を提案してください。',
        prompt_en: 'Define measurable success metrics for "{projectName}" based on selected methodology ({methodology}). Include UX metrics (e.g., task completion time, first-time success rate), business metrics (CVR, retention, LTV), and technical metrics (LCP, FID, CLS, error rate). Propose measurement methods and dashboard design.'
      }
    ]
  },
  p1: {
    title_ja: 'Phase 1: 要件定義',
    title_en: 'Phase 1: Requirements',
    tpl: [
      {
        id: 'user_analysis',
        label_ja: '多角的ユーザー分析',
        label_en: 'Multi-faceted User Analysis',
        prompt_ja: 'プロジェクト「{projectName}」のターゲットユーザーを、行動分析（データドリブン視点）、認知分析（認知負荷視点）、感情分析（エモーショナル視点）、文脈分析（コンテキスト視点）の4軸で深掘りしてください。各視点から得られるインサイトと設計への示唆を明記してください。',
        prompt_en: 'Deep-dive target users for "{projectName}" from 4 perspectives: behavioral analysis (data-driven), cognitive analysis (cognitive load), emotional analysis (emotional), and contextual analysis (context). Clarify insights and design implications from each perspective.'
      },
      {
        id: 'problem_mapping',
        label_ja: '問題構造マッピング',
        label_en: 'Problem Structure Mapping',
        prompt_ja: 'プロジェクト「{projectName}」が解決する問題を構造化してください。根本原因（5 Whys分析）、問題の影響範囲、競合他社の解決策、差別化ポイント、価値提案をマッピングし、Mermaidマインドマップ形式で可視化してください。',
        prompt_en: 'Structure the problem "{projectName}" solves. Map root causes (5 Whys analysis), impact scope, competitor solutions, differentiation points, and value proposition. Visualize as Mermaid mindmap.'
      },
      {
        id: 'feature_priority',
        label_ja: '機能優先度マトリクス',
        label_en: 'Feature Priority Matrix',
        prompt_ja: 'プロジェクト「{projectName}」の機能候補を、MoSCoW法（Must/Should/Could/Won\'t）で分類し、さらにKano分析（基本品質/性能品質/魅力品質）でユーザー満足度への影響を評価してください。MVP（最小実行可能製品）に含める機能を明示してください。',
        prompt_en: 'Classify feature candidates for "{projectName}" using MoSCoW (Must/Should/Could/Won\'t) and evaluate user satisfaction impact with Kano analysis (basic/performance/delight). Specify features for MVP.'
      }
    ]
  },
  p2: {
    title_ja: 'Phase 2: 設計',
    title_en: 'Phase 2: Design',
    tpl: [
      {
        id: 'info_arch',
        label_ja: '情報アーキテクチャ設計',
        label_en: 'Information Architecture Design',
        prompt_ja: 'プロジェクト「{projectName}」の情報アーキテクチャを、認知負荷最小化の観点で設計してください。ナビゲーション階層（最大3クリックルール）、カテゴリー分類（カードソート結果を反映）、検索設計（ファセット/フィルター）、パンくずリスト設計を含めてください。Mermaid図で可視化してください。',
        prompt_en: 'Design information architecture for "{projectName}" from cognitive load minimization perspective. Include navigation hierarchy (max 3-click rule), category classification (reflecting card sort results), search design (faceted/filtered), breadcrumb design. Visualize with Mermaid.'
      },
      {
        id: 'interaction',
        label_ja: 'インタラクション設計',
        label_en: 'Interaction Design',
        prompt_ja: 'プロジェクト「{projectName}」の主要インタラクションを、フロー状態維持の観点で設計してください。マイクロインタラクション（ボタンフィードバック、ローディング、エラー表示）、画面遷移アニメーション、ジェスチャー対応、キーボードショートカット、音声入力対応を検討してください。',
        prompt_en: 'Design key interactions for "{projectName}" from flow state maintenance perspective. Consider micro-interactions (button feedback, loading, error display), screen transition animations, gesture support, keyboard shortcuts, and voice input support.'
      },
      {
        id: 'design_system',
        label_ja: 'デザインシステム構築',
        label_en: 'Design System Construction',
        prompt_ja: 'プロジェクト「{projectName}」のデザインシステムを、アトミック設計の観点で構築してください。デザイントークン（色/タイポグラフィ/スペーシング）、コンポーネントライブラリ（Atoms/Molecules/Organisms）、アクセシビリティガイドライン（WCAG 2.1 AA準拠）、ダークモード対応を含めてください。',
        prompt_en: 'Build design system for "{projectName}" from atomic design perspective. Include design tokens (color/typography/spacing), component library (Atoms/Molecules/Organisms), accessibility guidelines (WCAG 2.1 AA compliance), and dark mode support.'
      }
    ]
  },
  p3: {
    title_ja: 'Phase 3: 実装',
    title_en: 'Phase 3: Implementation',
    tpl: [
      {
        id: 'arch_design',
        label_ja: 'アーキテクチャ設計',
        label_en: 'Architecture Design',
        prompt_ja: 'プロジェクト「{projectName}」（技術スタック: {stack}）のアーキテクチャを、レジリエント設計の観点で構築してください。レイヤー構造（プレゼンテーション/ビジネスロジック/データアクセス）、依存性注入、エラーハンドリング（リトライ/サーキットブレーカー）、ロギング戦略、ヘルスチェックを含めてください。',
        prompt_en: 'Design architecture for "{projectName}" (tech stack: {stack}) from resilient design perspective. Include layer structure (presentation/business logic/data access), dependency injection, error handling (retry/circuit breaker), logging strategy, and health checks.'
      },
      {
        id: 'perf_strategy',
        label_ja: 'パフォーマンス戦略',
        label_en: 'Performance Strategy',
        prompt_ja: 'プロジェクト「{projectName}」のパフォーマンス戦略を、時間価値最大化の観点で策定してください。Core Web Vitals目標値（LCP<2.5s、FID<100ms、CLS<0.1）、バンドルサイズ削減、画像最適化、CDN活用、キャッシュ戦略、遅延ローディングを含めてください。',
        prompt_en: 'Develop performance strategy for "{projectName}" from time value maximization perspective. Include Core Web Vitals targets (LCP<2.5s, FID<100ms, CLS<0.1), bundle size reduction, image optimization, CDN utilization, caching strategy, and lazy loading.'
      },
      {
        id: 'error_recovery',
        label_ja: 'エラー回復設計',
        label_en: 'Error Recovery Design',
        prompt_ja: 'プロジェクト「{projectName}」のエラー回復戦略を設計してください。エラー分類（リトライ可能/不可能）、ユーザー通知（エラーメッセージのトーン＆マナー）、自動リトライロジック、ロールバック戦略、フォールバック処理を含めてください。',
        prompt_en: 'Design error recovery strategy for "{projectName}". Include error classification (retryable/non-retryable), user notification (error message tone & manner), auto-retry logic, rollback strategy, and fallback processing.'
      }
    ]
  },
  p4: {
    title_ja: 'Phase 4: テスト',
    title_en: 'Phase 4: Testing',
    tpl: [
      {
        id: 'test_strategy',
        label_ja: 'テスト戦略立案',
        label_en: 'Test Strategy Planning',
        prompt_ja: 'プロジェクト「{projectName}」のテスト戦略を、データドリブンの観点で立案してください。テストピラミッド（ユニット70%/統合20%/E2E10%）、カバレッジ目標（statements 80%、branches 70%）、テスト自動化（Vitest/Playwright）、性能テスト、セキュリティテスト（OWASP Top 10）を含めてください。',
        prompt_en: 'Plan test strategy for "{projectName}" from data-driven perspective. Include test pyramid (unit 70%/integration 20%/E2E 10%), coverage targets (statements 80%, branches 70%), test automation (Vitest/Playwright), performance testing, and security testing (OWASP Top 10).'
      },
      {
        id: 'user_test',
        label_ja: 'ユーザーテスト設計',
        label_en: 'User Testing Design',
        prompt_ja: 'プロジェクト「{projectName}」のユーザーテストを設計してください。テストシナリオ（タスク完了/エラー回復）、評価指標（タスク成功率/完了時間/満足度）、リクルート基準（ペルソナ適合性）、ファシリテーションスクリプト、インサイト抽出方法を含めてください。',
        prompt_en: 'Design user testing for "{projectName}". Include test scenarios (task completion/error recovery), evaluation metrics (task success rate/completion time/satisfaction), recruitment criteria (persona fit), facilitation script, and insight extraction method.'
      },
      {
        id: 'ab_test',
        label_ja: 'A/Bテスト設計',
        label_en: 'A/B Test Design',
        prompt_ja: 'プロジェクト「{projectName}」のA/Bテストを設計してください。仮説設定（改善候補とその根拠）、サンプルサイズ計算（統計的有意水準α=0.05、検出力β=0.8）、セグメント分割、測定指標（プライマリ/セカンダリ）、実験期間、判定基準を含めてください。',
        prompt_en: 'Design A/B testing for "{projectName}". Include hypothesis setting (improvement candidates and rationale), sample size calculation (α=0.05, β=0.8), segmentation, measurement metrics (primary/secondary), experiment duration, and decision criteria.'
      }
    ]
  },
  p5: {
    title_ja: 'Phase 5: 改善・運用',
    title_en: 'Phase 5: Improvement & Operations',
    tpl: [
      {
        id: 'data_analysis',
        label_ja: 'データ分析と改善',
        label_en: 'Data Analysis & Improvement',
        prompt_ja: 'プロジェクト「{projectName}」のデータ分析基盤を構築してください。ファネル分析（コンバージョン率）、コホート分析（定着率）、ユーザー行動分析（ヒートマップ/セッションリプレイ）、異常検知（アラート設定）、ダッシュボード設計（経営/現場向け）を含めてください。',
        prompt_en: 'Build data analysis infrastructure for "{projectName}". Include funnel analysis (conversion rate), cohort analysis (retention rate), user behavior analysis (heatmap/session replay), anomaly detection (alert settings), and dashboard design (for management/operations).'
      },
      {
        id: 'tech_debt',
        label_ja: '技術的負債管理',
        label_en: 'Technical Debt Management',
        prompt_ja: 'プロジェクト「{projectName}」の技術的負債を管理してください。負債の分類（コード品質/設計/ドキュメント/テスト）、優先度評価（ビジネス影響×解消難易度）、返済計画（20%ルール: スプリントの20%を負債返済に充てる）、予防策を含めてください。',
        prompt_en: 'Manage technical debt for "{projectName}". Include debt classification (code quality/design/documentation/testing), priority evaluation (business impact × resolution difficulty), repayment plan (20% rule: allocate 20% of sprint to debt repayment), and prevention measures.'
      },
      {
        id: 'continuous_improvement',
        label_ja: '継続的改善サイクル',
        label_en: 'Continuous Improvement Cycle',
        prompt_ja: 'プロジェクト「{projectName}」の継続的改善サイクルを設計してください。改善のトリガー（KPI悪化/ユーザーフィードバック/競合動向）、仮説生成プロセス、実験設計（A/Bテスト/Feature Flag）、効果測定、ナレッジ蓄積（成功/失敗事例のドキュメント化）を含めてください。',
        prompt_en: 'Design continuous improvement cycle for "{projectName}". Include improvement triggers (KPI degradation/user feedback/competitor trends), hypothesis generation process, experiment design (A/B testing/Feature Flags), impact measurement, and knowledge accumulation (documenting success/failure cases).'
      }
    ]
  }
};

// INDUSTRY_STRATEGY: Industry-specific deep-dive strategies (15 industries from 全方位・アプリ開発戦略完全ガイド)
const INDUSTRY_STRATEGY = {
  healthcare: {
    regs_ja: ['HIPAA（米）', '医療法', '薬機法', 'GDPR特別カテゴリ', 'EU AI Act高リスク'],
    regs_en: ['HIPAA (US)', 'Medical Practitioner\'s Act', 'Pharmaceutical Act', 'GDPR special categories', 'EU AI Act high-risk'],
    stack_ja: 'FHIR + HIPAA準拠クラウド（AWS/Azure/GCP） + E2E暗号化 + 監査ログ + バックアップ',
    stack_en: 'FHIR + HIPAA-compliant cloud (AWS/Azure/GCP) + E2E encryption + audit logs + backup',
    pitfalls_ja: ['PHI（個人健康情報）漏洩', '同意管理不備', 'アクセス制御の甘さ', '監査ログ不足'],
    pitfalls_en: ['PHI leakage', 'Consent management gaps', 'Weak access control', 'Insufficient audit logs']
  },
  finance: {
    regs_ja: ['金融商品取引法', '資金決済法', 'PSD2（EU）', 'DORA', 'SOX法'],
    regs_en: ['Financial Instruments Act', 'Payment Services Act', 'PSD2 (EU)', 'DORA', 'SOX Act'],
    stack_ja: 'Banking API（Plaid/Yodlee） + KYC/AML + 冪等性設計 + サーキットブレーカー + トランザクション管理',
    stack_en: 'Banking APIs (Plaid/Yodlee) + KYC/AML + idempotent design + circuit breaker + transaction management',
    pitfalls_ja: ['二重請求', 'トランザクション不整合', '不正検知の遅れ', 'KYC手続きの煩雑さ'],
    pitfalls_en: ['Double charging', 'Transaction inconsistency', 'Delayed fraud detection', 'Complex KYC procedures']
  },
  manufacturing: {
    regs_ja: ['ISO 9001（品質）', 'ISO 14001（環境）', 'ISO 45001（労働安全）', 'CE認証'],
    regs_en: ['ISO 9001 (quality)', 'ISO 14001 (environment)', 'ISO 45001 (occupational safety)', 'CE marking'],
    stack_ja: 'IoT連携（MQTT/OPC-UA） + エッジコンピューティング + 予知保全AI + デジタルツイン',
    stack_en: 'IoT integration (MQTT/OPC-UA) + edge computing + predictive maintenance AI + digital twin',
    pitfalls_ja: ['ダウンタイム', 'データサイロ', 'レガシー機器統合', '省エネ目標未達'],
    pitfalls_en: ['Downtime', 'Data silos', 'Legacy equipment integration', 'Energy-saving target shortfall']
  },
  education: {
    regs_ja: ['FERPA（米）', 'COPPA（児童）', '個人情報保護法', 'EU教育データ保護'],
    regs_en: ['FERPA (US)', 'COPPA (children)', 'APPI (Japan)', 'EU education data protection'],
    stack_ja: 'LTI統合 + SSO（学校アカウント） + LRS（学習記録） + SCORM/xAPI + アクセシビリティ（WCAG AA）',
    stack_en: 'LTI integration + SSO (school accounts) + LRS (learning records) + SCORM/xAPI + accessibility (WCAG AA)',
    pitfalls_ja: ['児童データ保護不備', 'LMS統合の失敗', 'アクセシビリティ未対応', '学習分析の倫理問題'],
    pitfalls_en: ['Child data protection gaps', 'LMS integration failure', 'Accessibility non-compliance', 'Learning analytics ethics']
  },
  retail: {
    regs_ja: ['特定商取引法', '割賦販売法', '景品表示法', 'EU消費者保護指令'],
    regs_en: ['Act on Specified Commercial Transactions', 'Installment Sales Act', 'Act against Unjustifiable Premiums', 'EU consumer protection directives'],
    stack_ja: 'Stripe/PayPal + 在庫管理SaaS + 配送API統合 + レコメンドエンジン + ポイントシステム',
    stack_en: 'Stripe/PayPal + inventory management SaaS + shipping API integration + recommendation engine + loyalty system',
    pitfalls_ja: ['在庫切れ表示遅延', '決済失敗', '配送遅延', 'レコメンド精度低下'],
    pitfalls_en: ['Delayed out-of-stock display', 'Payment failure', 'Shipping delays', 'Recommendation accuracy decline']
  },
  realestate: {
    regs_ja: ['宅地建物取引業法', '建築基準法', '都市計画法', '不動産登記法'],
    regs_en: ['Real Estate Transaction Act', 'Building Standards Act', 'City Planning Act', 'Real Estate Registration Act'],
    stack_ja: 'GIS/地図API（Mapbox/Google Maps） + VRツアー + 不動産DB連携 + 価格推定AI',
    stack_en: 'GIS/map APIs (Mapbox/Google Maps) + VR tours + real estate DB integration + price estimation AI',
    pitfalls_ja: ['物件情報の古さ', '周辺情報不足', 'VR体験の重さ', '価格推定の不正確さ'],
    pitfalls_en: ['Outdated property info', 'Insufficient neighborhood data', 'Heavy VR experience', 'Inaccurate price estimation']
  },
  logistics: {
    regs_ja: ['貨物自動車運送事業法', '道路交通法', '関税法', 'IATA規則（航空）'],
    regs_en: ['Motor Freight Transportation Act', 'Road Traffic Act', 'Customs Act', 'IATA regulations (air)'],
    stack_ja: 'GPS追跡 + ルート最適化AI + 倉庫管理システム（WMS） + 配送API統合',
    stack_en: 'GPS tracking + route optimization AI + warehouse management system (WMS) + delivery API integration',
    pitfalls_ja: ['配送遅延', 'ルート非最適化', '在庫不一致', 'ラストワンマイル問題'],
    pitfalls_en: ['Delivery delays', 'Route non-optimization', 'Inventory mismatch', 'Last-mile problem']
  },
  agriculture: {
    regs_ja: ['農薬取締法', '食品衛生法', '有機JAS規格', 'GAP認証'],
    regs_en: ['Agricultural Chemicals Regulation Act', 'Food Sanitation Act', 'Organic JAS standards', 'GAP certification'],
    stack_ja: 'IoTセンサー（土壌/気象） + 気象予測API + トレーサビリティ（ブロックチェーン） + ドローン連携',
    stack_en: 'IoT sensors (soil/weather) + weather forecast API + traceability (blockchain) + drone integration',
    pitfalls_ja: ['センサーデータ欠損', '気象予測の不正確さ', 'トレーサビリティ不備', '資源の無駄'],
    pitfalls_en: ['Sensor data loss', 'Inaccurate weather forecasts', 'Traceability gaps', 'Resource waste']
  },
  energy: {
    regs_ja: ['電気事業法', '省エネ法', 'FIT/FIP制度', 'カーボンニュートラル目標'],
    regs_en: ['Electricity Business Act', 'Energy Conservation Act', 'FIT/FIP schemes', 'Carbon neutral targets'],
    stack_ja: '需給予測AI + スマートメーター連携 + 再エネ統合（VPP） + ピークシフト制御',
    stack_en: 'Demand forecasting AI + smart meter integration + renewable integration (VPP) + peak shifting control',
    pitfalls_ja: ['需給予測ミス', '停電リスク', '再エネ統合の難しさ', 'ピークカット不足'],
    pitfalls_en: ['Demand forecast errors', 'Blackout risk', 'Renewable integration challenges', 'Insufficient peak cutting']
  },
  media: {
    regs_ja: ['著作権法', '放送法', 'EU著作権指令', 'DMCA（米）'],
    regs_en: ['Copyright Act', 'Broadcasting Act', 'EU Copyright Directive', 'DMCA (US)'],
    stack_ja: 'CDN（Cloudflare/Fastly） + DRM + レコメンドエンジン + ABRストリーミング + オフライン再生',
    stack_en: 'CDN (Cloudflare/Fastly) + DRM + recommendation engine + ABR streaming + offline playback',
    pitfalls_ja: ['著作権侵害', 'バッファリング', 'レコメンド精度低下', 'DRM複雑さ'],
    pitfalls_en: ['Copyright infringement', 'Buffering', 'Recommendation accuracy decline', 'DRM complexity']
  },
  government: {
    regs_ja: ['行政機関個人情報保護法', '情報公開法', 'デジタル庁ガイドライン', 'ウェブアクセシビリティ指針'],
    regs_en: ['Act on Protection of Personal Information held by Administrative Organs', 'Information Disclosure Act', 'Digital Agency guidelines', 'Web accessibility guidelines'],
    stack_ja: 'WCAG AAA準拠 + 多言語対応（機械翻訳） + マイナンバー連携 + 災害時BCP + 監査ログ',
    stack_en: 'WCAG AAA compliance + multilingual support (machine translation) + My Number integration + disaster BCP + audit logs',
    pitfalls_ja: ['アクセシビリティ不備', '災害時ダウン', '多言語対応不足', '監査ログ不備'],
    pitfalls_en: ['Accessibility gaps', 'Disaster downtime', 'Insufficient multilingual support', 'Inadequate audit logs']
  },
  travel: {
    regs_ja: ['旅行業法', '旅券法', 'IATA規則', 'EU Package Travel Directive'],
    regs_en: ['Travel Agency Act', 'Passport Act', 'IATA regulations', 'EU Package Travel Directive'],
    stack_ja: 'GDS/OTA API統合 + 地図API + 多言語対応 + オフライン地図 + リアルタイム情報',
    stack_en: 'GDS/OTA API integration + map APIs + multilingual support + offline maps + real-time info',
    pitfalls_ja: ['予約情報の不一致', 'リアルタイム情報不足', 'オフライン対応不備', '多言語品質'],
    pitfalls_en: ['Booking info mismatch', 'Insufficient real-time info', 'Poor offline support', 'Multilingual quality']
  },
  hr: {
    regs_ja: ['労働基準法', '雇用機会均等法', '個人情報保護法', 'GDPR（EU人事データ）'],
    regs_en: ['Labor Standards Act', 'Equal Employment Opportunity Act', 'APPI', 'GDPR (EU HR data)'],
    stack_ja: 'ATS（採用管理） + スキル可視化 + バイアス排除AI + 勤怠管理 + タレントマネジメント',
    stack_en: 'ATS (applicant tracking) + skill visualization + bias elimination AI + attendance management + talent management',
    pitfalls_ja: ['採用バイアス', 'スキル評価の曖昧さ', '勤怠データ不正確', '離職率予測の難しさ'],
    pitfalls_en: ['Hiring bias', 'Vague skill assessment', 'Inaccurate attendance data', 'Turnover prediction challenges']
  },
  legal: {
    regs_ja: ['弁護士法', '司法書士法', '個人情報保護法', 'EU法務データ保護'],
    regs_en: ['Attorney Act', 'Judicial Scrivener Act', 'APPI', 'EU legal data protection'],
    stack_ja: 'バージョン管理（Git） + 電子署名 + 監査ログ + 文書検索（全文検索） + AI契約レビュー',
    stack_en: 'Version control (Git) + e-signature + audit logs + document search (full-text) + AI contract review',
    pitfalls_ja: ['バージョン管理不備', '監査ログ不足', '電子署名の法的有効性', 'AI誤判定'],
    pitfalls_en: ['Version control gaps', 'Insufficient audit logs', 'E-signature legal validity', 'AI misjudgment']
  },
  insurance: {
    regs_ja: ['保険業法', '金融商品取引法', 'EU保険販売指令（IDD）', 'ソルベンシー規制'],
    regs_en: ['Insurance Business Act', 'Financial Instruments Act', 'EU Insurance Distribution Directive (IDD)', 'Solvency regulations'],
    stack_ja: 'リスク評価AI + 迅速審査 + バイアス排除 + 透明な保険料計算 + クレーム管理',
    stack_en: 'Risk assessment AI + quick underwriting + bias elimination + transparent premium calculation + claims management',
    pitfalls_ja: ['リスク評価バイアス', '審査遅延', '保険料計算の不透明さ', 'クレーム処理遅延'],
    pitfalls_en: ['Risk assessment bias', 'Underwriting delays', 'Opaque premium calculation', 'Claims processing delays']
  }
};

// NEXT_GEN_UX: Next-generation UX keywords (from キーワード別有能な壁打ちプロンプト集)
const NEXT_GEN_UX = {
  agentic: {
    label_ja: 'エージェンティック・ワークフロー',
    label_en: 'Agentic Workflow',
    desc_ja: 'AIが自律的にタスクを分解・実行し、ユーザーは「承認」だけを行う。操作ではなく、依頼する体験。',
    desc_en: 'AI autonomously decomposes and executes tasks; users only approve. Experience of delegation, not operation.',
    prompt_ja: 'プロジェクト「{projectName}」の機能「{feature}」について、現在はユーザーが手動で操作する仕様になっています。これを「Agentic Workflow（自律的エージェント）」の観点で再設計してください。\n\n1. **User-in-the-loopの最小化**: ユーザーの承認が必要な「決定的な瞬間」だけを残し、それ以外のプロセス（前準備・後処理）を自動化するフロー図を描いてください。\n2. **例外処理の自律化**: エラーが起きた際、ユーザーに通知する前にエージェントが自己解決（リトライ、代替案の探索）を行うロジックを提案してください。\n3. **成果物**: 従来のUI画面遷移図ではなく、エージェントの「思考プロセス（Chain of Thought）」と「状態遷移図」を出力してください。',
    prompt_en: 'For feature "{feature}" in project "{projectName}", currently users manually operate. Redesign from "Agentic Workflow" perspective.\n\n1. **Minimize User-in-the-loop**: Keep only "critical moments" requiring user approval; automate pre/post-processing. Draw flow diagram.\n2. **Autonomous Exception Handling**: Propose logic where agents self-resolve (retry, alternative exploration) before notifying users.\n3. **Deliverable**: Output agent "Chain of Thought" and state transition diagram, not traditional UI flow.'
  },
  generative_ui: {
    label_ja: 'ジェネレーティブUI',
    label_en: 'Generative UI',
    desc_ja: '固定画面を廃止し、文脈（Context）に応じてAIがUIコンポーネントを即座に生成。Vercel v0的な体験。',
    desc_en: 'Abolish fixed screens; AI generates UI components instantly based on context. Vercel v0-like experience.',
    prompt_ja: 'プロジェクト「{projectName}」の機能「{feature}」において、固定的なレイアウトを廃止し、「Generative UI（文脈に応じたUI生成）」を導入したいと考えています。\n\n以下の3つの異なるシチュエーションにおいて、AIが生成すべき「最適なUIコンポーネントの構成」をそれぞれ定義してください。\n\n- **Case A**: ユーザーが急いでおり、結論だけを知りたい時\n- **Case B**: ユーザーが探索モードで、詳細な情報を比較検討したい時\n- **Case C**: 通信環境が悪く、最小限のテキストベースで操作したい時\n\nそれぞれのケースで、どの情報を優先表示し、どの装飾を削ぎ落とすべきかのルールを提示してください。',
    prompt_en: 'For feature "{feature}" in project "{projectName}", abolish fixed layouts and introduce "Generative UI".\n\nDefine optimal UI component composition AI should generate for each scenario:\n\n- **Case A**: User is in a hurry, wants only conclusions\n- **Case B**: User is in exploration mode, wants detailed comparison\n- **Case C**: Poor network, wants minimal text-based operation\n\nFor each case, present rules for what info to prioritize and what decoration to remove.'
  },
  spatial: {
    label_ja: 'スペーシャル・コンピューティング',
    label_en: 'Spatial Computing',
    desc_ja: '2D画面内でも「奥行き」や「重なり」を用いて情報の優先度を直感的に伝える。Vision Pro的な深度設計。',
    desc_en: 'Use depth and layering to intuitively convey info priority even in 2D screens. Vision Pro-like depth design.',
    prompt_ja: 'プロジェクト「{projectName}」の画面「{screen}」は情報量が多く、平面的なUIでは煩雑です。\n\nここに「Spatial Computing（空間と深度の概念）」を取り入れ、情報の階層構造をZ軸（奥行き）で整理してください。\n\n1. **マテリアル設計**: 最も重要な要素、背景要素、一時的な要素それぞれに、どのような「質感（Glassmorphism等）」と「影（Elevation）」を与えるべきか？\n2. **フォーカス制御**: ユーザーが注目している要素以外をどのように「ボケ（Blur）」させたり、暗くしたりして、視線誘導を行うべきか？\n3. **汎用ルール**: 今後機能が増えても破綻しないための「レイヤー深度のガイドライン（Level 1〜Level 5）」を策定してください。',
    prompt_en: 'Screen "{screen}" in project "{projectName}" has high info density; flat UI is cluttered.\n\nApply "Spatial Computing" to organize info hierarchy with Z-axis depth.\n\n1. **Material Design**: What texture (Glassmorphism, etc.) and shadow (Elevation) for most important, background, and temporary elements?\n2. **Focus Control**: How to blur or darken non-focused elements for gaze guidance?\n3. **General Rules**: Establish layer depth guidelines (Level 1~5) resilient to future feature additions.'
  },
  calm: {
    label_ja: 'カーム・テクノロジー',
    label_en: 'Calm Technology',
    desc_ja: 'ユーザーの注意を奪わず、生活の背景（アンビエント）に溶け込む技術。穏やかな通知、周辺視野での気配。',
    desc_en: 'Technology that doesn\'t demand attention; blends into life background (ambient). Gentle notifications, peripheral presence.',
    prompt_ja: 'プロジェクト「{projectName}」の機能「{feature}」は、ユーザーにとって有用ですが、頻繁な通知や派手な主張は避けたいと考えています。\n\n以下の制約で仕様を洗練させてください。\n\n1. **周辺視野への配置**: ユーザーが意識的に見ようとした時だけ詳細が見え、普段は視界の端で「気配」だけを感じさせるUI表現（色相の変化、微細なアニメーションなど）は？\n2. **非侵襲的なフィードバック**: アラート音やバイブレーションを使わず、ユーザーに状態変化（完了、エラーなど）を伝える、五感に訴えるアイデア（Hapticの波形、光の明滅リズムなど）を提案してください。',
    prompt_en: 'Feature "{feature}" in project "{projectName}" is useful but should avoid frequent notifications or flashy assertions.\n\nRefine spec with these constraints:\n\n1. **Peripheral Vision Placement**: UI expressions (hue changes, subtle animations) where details appear only when user consciously looks, otherwise just "presence" at vision edge?\n2. **Non-invasive Feedback**: Ideas appealing to senses (haptic waveforms, light blinking rhythms) to convey state changes (completion, error) without alert sounds or vibrations.'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Map domain to closest industry (for INDUSTRY_STRATEGY lookup)
function mapDomainToIndustry(domain) {
  const mapping = {
    health: 'healthcare',
    fintech: 'finance',
    manufacturing: 'manufacturing',
    education: 'education',
    ec: 'retail',
    realestate: 'realestate',
    logistics: 'logistics',
    agriculture: 'agriculture',
    energy: 'energy',
    content: 'media',
    media: 'media',
    government: 'government',
    travel: 'travel',
    hr: 'hr',
    legal: 'legal',
    insurance: 'insurance'
  };
  return mapping[domain] || null;
}

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

function gen60(G, domain, meth, a, pn) {
  let doc = '';
  doc += G ? '# 60. 開発手法インテリジェンス\n\n' : '# 60. Methodology Intelligence\n\n';
  doc += G ? '> **プロジェクト**: ' + pn + '\n' : '> **Project**: ' + pn + '\n';
  doc += G ? '> **ドメイン**: ' + domain + '\n\n' : '> **Domain**: ' + domain + '\n\n';
  doc += G ? '## 最適開発手法の選定\n\n' : '## Optimal Methodology Selection\n\n';
  doc += G ? '### 選定結果\n\n' : '### Selection Result\n\n';
  doc += G ? '**第一選択**: ' + meth.primary_ja + '\n\n' : '**Primary**: ' + meth.primary_en + '\n\n';
  doc += G ? '**第二選択**: ' + meth.secondary_ja + '\n\n' : '**Secondary**: ' + meth.secondary_en + '\n\n';
  doc += G ? '**選定理由**:\n\n' + meth.rationale_ja + '\n\n' : '**Rationale**:\n\n' + meth.rationale_en + '\n\n';
  doc += G ? '**キーワード**: ' : '**Keywords**: ';
  doc += (G ? meth.kw_ja : meth.kw_en).join(', ') + '\n\n';

  doc += G ? '## 12設計アプローチ適合度評価\n\n' : '## 12 Design Approaches Fit Evaluation\n\n';
  doc += G ? '各アプローチのドメイン適合度を5段階評価（★★★★★ = 最適、☆☆☆☆☆ = 不適）:\n\n' : 'Domain fit for each approach (★★★★★ = optimal, ☆☆☆☆☆ = unsuitable):\n\n';

  const approaches = [
    {ja: 'フロー状態設計', en: 'Flow State Design'},
    {ja: '認知負荷最小化', en: 'Cognitive Load Min.'},
    {ja: '時間価値最大化', en: 'Time Value Max.'},
    {ja: 'コンテキスト適応', en: 'Context Adaptive'},
    {ja: 'プログレッシブ開示', en: 'Progressive Disclosure'},
    {ja: 'レジリエント設計', en: 'Resilient Design'},
    {ja: 'アトミック設計', en: 'Atomic Design'},
    {ja: 'データドリブン', en: 'Data-Driven'},
    {ja: 'インクルーシブ', en: 'Inclusive'},
    {ja: 'エモーショナル', en: 'Emotional'},
    {ja: 'AIファースト', en: 'AI-First'},
    {ja: 'サステナブル', en: 'Sustainable'}
  ];

  const primaryKw = G ? meth.kw_ja : meth.kw_en;
  doc += '| ' + (G ? 'アプローチ' : 'Approach') + ' | ' + (G ? '適合度' : 'Fit') + ' | ' + (G ? '理由' : 'Rationale') + ' |\n';
  doc += '|---|---|---|\n';

  approaches.forEach(ap => {
    const name = G ? ap.ja : ap.en;
    const isPrimary = (G ? meth.primary_ja : meth.primary_en).includes(name);
    const isSecondary = (G ? meth.secondary_ja : meth.secondary_en).includes(name);
    const stars = isPrimary ? '★★★★★' : isSecondary ? '★★★★☆' : primaryKw.some(k => name.includes(k.split('').slice(0,2).join(''))) ? '★★★☆☆' : '★★☆☆☆';
    const reason = isPrimary ? (G ? 'ドメイン最適解' : 'Domain optimal') : isSecondary ? (G ? '重要な補完要素' : 'Important complement') : (G ? '状況次第で有効' : 'Situationally useful');
    doc += '| ' + name + ' | ' + stars + ' | ' + reason + ' |\n';
  });
  doc += '\n';

  doc += G ? '## 実装優先順位\n\n' : '## Implementation Priority\n\n';
  doc += G ? '### Phase 1: 基盤構築（MVP）\n\n' : '### Phase 1: Foundation (MVP)\n\n';
  doc += '- ' + (G ? meth.primary_ja : meth.primary_en) + '\n';
  doc += G ? '  - ' + (G ? meth.kw_ja[0] : meth.kw_en[0]) + 'を最優先で実装\n' : '  - Implement ' + (G ? meth.kw_en[0] : meth.kw_en[0]) + ' first\n';
  doc += G ? '  - 基本的なユーザーフロー確立\n\n' : '  - Establish basic user flow\n\n';

  doc += G ? '### Phase 2: 拡張\n\n' : '### Phase 2: Expansion\n\n';
  doc += '- ' + (G ? meth.secondary_ja : meth.secondary_en) + '\n';
  doc += G ? '  - 第一選択の弱点を補完\n' : '  - Complement primary weaknesses\n';
  doc += G ? '  - 追加機能の実装\n\n' : '  - Implement additional features\n\n';

  doc += G ? '### Phase 3: 最適化\n\n' : '### Phase 3: Optimization\n\n';
  doc += G ? '- データドリブン + 継続的改善\n' : '- Data-Driven + Continuous Improvement\n';
  doc += G ? '  - A/Bテストによる検証\n' : '  - Validation via A/B testing\n';
  doc += G ? '  - KPI測定と改善サイクル確立\n\n' : '  - Establish KPI measurement and improvement cycle\n\n';

  doc += G ? '## 組み合わせシナジー分析\n\n' : '## Combination Synergy Analysis\n\n';
  doc += '**' + (G ? meth.primary_ja : meth.primary_en) + '** × **' + (G ? meth.secondary_ja : meth.secondary_en) + '**\n\n';
  doc += G ? '→ **相乗効果**: ' + domain + 'ドメインにおいて、' : '→ **Synergy**: In ' + domain + ' domain, ';
  doc += G ? '第一選択が「強み」を、第二選択が「弱点補完」を担うことで、バランスの取れた体験を実現。\n\n' : 'primary provides "strengths" while secondary "complements weaknesses" for balanced experience.\n\n';

  doc += G ? '## 適合度スコアリング（Mermaid互換性マトリクス）\n\n' : '## Fit Scoring (Mermaid Compatibility Matrix)\n\n';
  doc += '```mermaid\n';
  doc += 'graph TD\n';
  doc += '  A[' + domain + ' ' + (G ? 'ドメイン' : 'Domain') + '] --> B[' + (G ? meth.primary_ja : meth.primary_en) + ']\n';
  doc += '  A --> C[' + (G ? meth.secondary_ja : meth.secondary_en) + ']\n';
  doc += '  B --> D[' + (G ? meth.kw_ja[0] : meth.kw_en[0]) + ']\n';
  doc += '  B --> E[' + (G ? meth.kw_ja[1] : meth.kw_en[1]) + ']\n';
  doc += '  C --> F[' + (G ? meth.kw_ja[2] : meth.kw_en[2]) + ']\n';
  doc += '  C --> G[' + (G ? meth.kw_ja[3] : meth.kw_en[3]) + ']\n';
  doc += '```\n\n';

  doc += G ? '---\n\n**次のステップ**: `docs/61_ai_brainstorm_playbook.md` で、このプロジェクト専用のAI壁打ちプロンプト集を確認してください。\n' : '---\n\n**Next Step**: Check `docs/61_ai_brainstorm_playbook.md` for project-specific AI brainstorming prompts.\n';

  return doc;
}

function gen61(G, domain, meth, a, pn) {
  let doc = '';
  doc += G ? '# 61. AI壁打ちプロンプト・プレイブック\n\n' : '# 61. AI Brainstorming Prompt Playbook\n\n';
  doc += G ? '> **プロジェクト**: ' + pn + '\n' : '> **Project**: ' + pn + '\n';
  doc += G ? '> **ドメイン**: ' + domain + '\n' : '> **Domain**: ' + domain + '\n';
  doc += G ? '> **選定手法**: ' + meth.primary_ja + ' + ' + meth.secondary_ja + '\n\n' : '> **Selected Methodology**: ' + meth.primary_en + ' + ' + meth.secondary_en + '\n\n';

  doc += G ? '## 使い方\n\n' : '## How to Use\n\n';
  doc += G ? 'このドキュメントは、**プロジェクト固有の文脈を注入済み**のAI壁打ちプロンプト集です。\n\n' : 'This document contains **project-specific context-injected** AI brainstorming prompts.\n\n';
  doc += G ? '各プロンプトをコピーし、Claude/ChatGPT/Copilotに貼り付けて、高度な提案を引き出してください。\n\n' : 'Copy each prompt and paste into Claude/ChatGPT/Copilot to extract high-level proposals.\n\n';

  const stack = (a.frontend || '') + ' + ' + (a.backend || '') + ' + ' + (a.database || '');
  const feature = G ? '主要機能（例: ダッシュボード/検索/予約など）' : 'main feature (e.g., dashboard/search/booking)';

  Object.keys(PHASE_PROMPTS).forEach(phaseKey => {
    const phase = PHASE_PROMPTS[phaseKey];
    doc += '## ' + (G ? phase.title_ja : phase.title_en) + '\n\n';

    phase.tpl.forEach((tpl, idx) => {
      doc += '### ' + (idx + 1) + '. ' + (G ? tpl.label_ja : tpl.label_en) + '\n\n';
      doc += '```\n';
      let prompt = G ? tpl.prompt_ja : tpl.prompt_en;
      prompt = prompt.replace(/{projectName}/g, pn);
      prompt = prompt.replace(/{domain}/g, domain);
      prompt = prompt.replace(/{methodology}/g, G ? meth.primary_ja + ' + ' + meth.secondary_ja : meth.primary_en + ' + ' + meth.secondary_en);
      prompt = prompt.replace(/{stack}/g, stack);
      prompt = prompt.replace(/{feature}/g, feature);
      doc += prompt + '\n';
      doc += '```\n\n';
    });
  });

  doc += G ? '---\n\n**Tips**: プロンプト実行後、得られた回答を `docs/` 配下の該当ドキュメント（例: `docs/03_architecture.md`、`docs/07_test_cases.md`）に反映してください。\n' : '---\n\n**Tips**: After running prompts, reflect answers into relevant docs (e.g., `docs/03_architecture.md`, `docs/07_test_cases.md`).\n';

  return doc;
}

function gen62(G, domain, indStrategy, a, pn) {
  let doc = '';
  doc += G ? '# 62. 業界特化ディープダイブ\n\n' : '# 62. Industry-Specific Deep Dive\n\n';
  doc += G ? '> **プロジェクト**: ' + pn + '\n' : '> **Project**: ' + pn + '\n';
  doc += G ? '> **ドメイン**: ' + domain + '\n\n' : '> **Domain**: ' + domain + '\n\n';

  if (!indStrategy) {
    doc += G ? '**注意**: このドメインに対応する業界特化戦略はまだ定義されていません。\n\n' : '**Note**: Industry-specific strategy for this domain is not yet defined.\n\n';
    doc += G ? '汎用的なベストプラクティスに従ってください。\n' : 'Follow general best practices.\n';
    return doc;
  }

  doc += G ? '## 規制・コンプライアンス\n\n' : '## Regulations & Compliance\n\n';
  doc += G ? '### 主要規制\n\n' : '### Key Regulations\n\n';
  const regs = G ? indStrategy.regs_ja : indStrategy.regs_en;
  regs.forEach(r => {
    doc += '- ' + r + '\n';
  });
  doc += '\n';

  doc += G ? '### 推奨技術スタック\n\n' : '### Recommended Tech Stack\n\n';
  doc += (G ? indStrategy.stack_ja : indStrategy.stack_en) + '\n\n';

  doc += G ? '## 業界特有の落とし穴\n\n' : '## Industry-Specific Pitfalls\n\n';
  doc += G ? '以下は、この業界でよくある失敗パターンです。設計・実装時に必ず確認してください。\n\n' : 'Common failure patterns in this industry. Always verify during design/implementation.\n\n';
  const pitfalls = G ? indStrategy.pitfalls_ja : indStrategy.pitfalls_en;
  doc += '| # | ' + (G ? '落とし穴' : 'Pitfall') + ' | ' + (G ? '対策' : 'Countermeasure') + ' |\n';
  doc += '|---|---|---|\n';
  pitfalls.forEach((p, i) => {
    const counter = G ?
      (p.includes('漏洩') ? 'E2E暗号化 + アクセス制御' :
       p.includes('不備') ? '監査ログ + バージョン管理' :
       p.includes('遅延') ? 'リアルタイム処理 + 優先度キュー' :
       p.includes('不正確') ? 'データ検証 + 異常検知' : 'ベストプラクティス準拠') :
      (p.includes('leakage') ? 'E2E encryption + access control' :
       p.includes('gaps') ? 'Audit logs + version control' :
       p.includes('delays') ? 'Real-time processing + priority queue' :
       p.includes('Inaccurate') ? 'Data validation + anomaly detection' : 'Follow best practices');
    doc += '| ' + (i + 1) + ' | ' + p + ' | ' + counter + ' |\n';
  });
  doc += '\n';

  doc += G ? '## アーキテクチャ推奨パターン\n\n' : '## Recommended Architecture Patterns\n\n';
  doc += '```mermaid\n';
  doc += 'graph LR\n';
  doc += '  A[' + (G ? 'クライアント' : 'Client') + '] --> B[API Gateway]\n';
  doc += '  B --> C[' + (G ? '認証レイヤー' : 'Auth Layer') + ']\n';
  doc += '  C --> D[' + (G ? 'ビジネスロジック' : 'Business Logic') + ']\n';
  doc += '  D --> E[' + (G ? 'データレイヤー' : 'Data Layer') + ']\n';
  doc += '  E --> F[' + (G ? '暗号化ストレージ' : 'Encrypted Storage') + ']\n';
  doc += '  D --> G[' + (G ? '監査ログ' : 'Audit Log') + ']\n';
  doc += '```\n\n';

  doc += G ? '---\n\n**参考**: `docs/43_security_intelligence.md` で業界特化のセキュリティチェックリストを確認してください。\n' : '---\n\n**Reference**: Check `docs/43_security_intelligence.md` for industry-specific security checklists.\n';

  return doc;
}

function gen63(G, domain, meth, a, pn) {
  let doc = '';
  doc += G ? '# 63. 次世代UX戦略 — Polymorphic Engine\n\n' : '# 63. Next-Gen UX Strategy — Polymorphic Engine\n\n';
  doc += G ? '> **プロジェクト**: ' + pn + '\n' : '> **Project**: ' + pn + '\n';
  doc += G ? '> **ドメイン**: ' + domain + '\n\n' : '> **Domain**: ' + domain + '\n\n';

  doc += G ? '## Polymorphic Engineとは\n\n' : '## What is Polymorphic Engine\n\n';
  doc += G ? 'このアプリに「完成形」はありません。ユーザーの状況、スキル、感情に合わせて、**アプリ自体がアメーバのように機能と姿をリアルタイムに書き換え続ける（Polymorph）**システムです。\n\n' : 'This app has no "final form". It **polymorphs like an amoeba**, continuously rewriting functionality and appearance in real-time based on user context, skills, and emotions.\n\n';

  doc += G ? '### The Context Loop（4段階フレーム）\n\n' : '### The Context Loop (4-Stage Framework)\n\n';
  doc += '```mermaid\n';
  doc += 'graph LR\n';
  doc += '  A[1. Sensing ' + (G ? '感知' : 'Perception') + '] --> B[2. Thinking ' + (G ? '推論' : 'Reasoning') + ']\n';
  doc += '  B --> C[3. Morphing ' + (G ? '変異' : 'Transformation') + ']\n';
  doc += '  C --> D[4. Acting ' + (G ? '作用' : 'Action') + ']\n';
  doc += '  D --> A\n';
  doc += '```\n\n';

  doc += '1. **Sensing (' + (G ? '感知' : 'Perception') + ')**: ' + (G ? 'タップの強さ、迷い、時間、位置から「心理状態」を読む' : 'Read psychological state from tap strength, hesitation, time, location') + '\n';
  doc += '2. **Thinking (' + (G ? '推論' : 'Reasoning') + ')**: ' + (G ? 'ユーザーの意図を予測し、バックグラウンド処理を開始' : 'Predict user intent and start background processing') + '\n';
  doc += '3. **Morphing (' + (G ? '変異' : 'Transformation') + ')**: ' + (G ? 'UI構造と情報の深度（Z軸）をリアルタイムに再構築' : 'Rebuild UI structure and info depth (Z-axis) in real-time') + '\n';
  doc += '4. **Acting (' + (G ? '作用' : 'Action') + ')**: ' + (G ? '最もストレスのない方法で結果を伝える' : 'Convey results in the least stressful way') + '\n\n';

  doc += G ? '## 4つの次世代UXキーワード適用\n\n' : '## Applying 4 Next-Gen UX Keywords\n\n';

  Object.keys(NEXT_GEN_UX).forEach(key => {
    const ux = NEXT_GEN_UX[key];
    doc += '### ' + (G ? ux.label_ja : ux.label_en) + '\n\n';
    doc += '**' + (G ? '概要' : 'Overview') + '**: ' + (G ? ux.desc_ja : ux.desc_en) + '\n\n';
    doc += '**' + (G ? 'プロジェクト適用プロンプト' : 'Project-Specific Prompt') + '**:\n\n';
    doc += '```\n';
    let prompt = G ? ux.prompt_ja : ux.prompt_en;
    prompt = prompt.replace(/{projectName}/g, pn);
    prompt = prompt.replace(/{feature}/g, G ? '主要機能' : 'main feature');
    prompt = prompt.replace(/{screen}/g, G ? '主要画面' : 'main screen');
    doc += prompt + '\n';
    doc += '```\n\n';
  });

  doc += G ? '## ドメイン特化適用例\n\n' : '## Domain-Specific Application Examples\n\n';
  doc += G ? '**' + domain + 'ドメインにおける推奨適用**:\n\n' : '**Recommended application for ' + domain + ' domain**:\n\n';

  if (domain === 'education') {
    doc += G ? '- **Agentic**: AI学習アシスタントが自律的に次の学習コンテンツを提案\n' : '- **Agentic**: AI learning assistant autonomously suggests next learning content\n';
    doc += G ? '- **Generative UI**: 学習者の理解度に応じて説明の詳細度を動的調整\n' : '- **Generative UI**: Dynamically adjust explanation detail based on learner comprehension\n';
    doc += G ? '- **Spatial**: 重要な概念を手前に配置、補足情報は奥にボカして配置\n' : '- **Spatial**: Place key concepts in front, blur supplementary info in back\n';
    doc += G ? '- **Calm**: 集中フロー維持のため、通知は最小限に\n\n' : '- **Calm**: Minimize notifications to maintain concentration flow\n\n';
  } else if (domain === 'fintech') {
    doc += G ? '- **Agentic**: 異常取引検知時、AIが自動で一時停止・ユーザー確認\n' : '- **Agentic**: AI auto-pauses and confirms with user upon anomaly detection\n';
    doc += G ? '- **Generative UI**: 取引状況（急ぎ/確認）に応じてUI構成を切り替え\n' : '- **Generative UI**: Switch UI composition based on transaction context (urgent/confirm)\n';
    doc += G ? '- **Spatial**: セキュリティ警告を最前面、通常情報は背景化\n' : '- **Spatial**: Security alerts in foreground, normal info in background\n';
    doc += G ? '- **Calm**: 取引完了は穏やかな通知、不正検知時のみアラート\n\n' : '- **Calm**: Gentle notification for transaction completion, alert only for fraud detection\n\n';
  } else {
    doc += G ? '- **Agentic**: ユーザーの意図を予測し、先回りして処理\n' : '- **Agentic**: Predict user intent and process ahead\n';
    doc += G ? '- **Generative UI**: 文脈に応じてUIを動的生成\n' : '- **Generative UI**: Dynamically generate UI based on context\n';
    doc += G ? '- **Spatial**: 情報の優先度を深度（Z軸）で表現\n' : '- **Spatial**: Express info priority with depth (Z-axis)\n';
    doc += G ? '- **Calm**: 通知は周辺視野に配置、侵襲性を最小化\n\n' : '- **Calm**: Place notifications in peripheral vision, minimize intrusiveness\n\n';
  }

  doc += G ? '---\n\n**実装ガイド**: `docs/39_implementation_playbook.md` でドメイン別実装パターンを確認し、次世代UXを技術的に実現する方法を学んでください。\n' : '---\n\n**Implementation Guide**: Check `docs/39_implementation_playbook.md` for domain-specific implementation patterns to technically realize next-gen UX.\n';

  return doc;
}

// Main P16 generator function
function genPillar16_DevIQ(a, pn) {
  const G = S.genLang === 'ja';
  const domain = detectDomain(a.purpose || '');
  const meth = DEV_METHODOLOGY_MAP[domain] || DEV_METHODOLOGY_MAP._default;
  const ind = mapDomainToIndustry(domain);
  const indStrategy = ind ? (INDUSTRY_STRATEGY[ind] || null) : null;

  S.files['docs/60_methodology_intelligence.md'] = gen60(G, domain, meth, a, pn);
  S.files['docs/61_ai_brainstorm_playbook.md'] = gen61(G, domain, meth, a, pn);
  S.files['docs/62_industry_deep_dive.md'] = gen62(G, domain, indStrategy, a, pn);
  S.files['docs/63_next_gen_ux_strategy.md'] = gen63(G, domain, meth, a, pn);
}
