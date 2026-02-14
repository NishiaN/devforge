/* ═══ PILLAR ⑬: STRATEGIC INTELLIGENCE ═══ */

// Strategic Intelligence helper (10 args → 10 bilingual properties)
const _si = (reg_ja,reg_en, arch_ja,arch_en, fail_ja,fail_en, trend_ja,trend_en, bm_ja,bm_en) => ({
  reg_ja, reg_en,      // 業種別規制・コンプライアンス (string[], 3-4 items)
  arch_ja, arch_en,    // アーキテクチャパターン (string[], 2-3 items)
  fail_ja, fail_en,    // 失敗要因 (string[], 3 items)
  trend_ja, trend_en,  // 2026-2030トレンド (string[], 3-4 items)
  bm_ja, bm_en         // ビジネスモデル (string[], 2-3 items, format: "model|revenue|target")
});

// Industry Intelligence Database (32 domains + default)
const INDUSTRY_INTEL = {
  education: _si(
    ['FERPA準拠(学生記録保護)','COPPA準拠(13歳未満ユーザー)','アクセシビリティ(WCAG 2.1 AA以上)'],
    ['FERPA compliance (student record protection)','COPPA compliance (users under 13)','Accessibility (WCAG 2.1 AA minimum)'],
    ['適応学習システム(AI活用)','マイクロラーニング設計','xAPI/SCORM標準対応'],
    ['Adaptive learning (AI-powered)','Microlearning architecture','xAPI/SCORM standards compliance'],
    ['進捗追跡の不備→離脱率増加','動画配信コスト過小見積もり','証明書偽造防止不足'],
    ['Poor progress tracking → high dropout','Video streaming cost underestimation','Insufficient certificate anti-fraud measures'],
    ['生成AI統合(パーソナライズ学習)','VR/AR実習コンテンツ','ブロックチェーン証明書'],
    ['Generative AI integration (personalized learning)','VR/AR practical training','Blockchain certificates'],
    ['サブスク|月額課金|個人・企業研修','マーケットプレイス|手数料15-30%|講師・受講者','フリーミアム|プレミアム機能課金|個人学習者'],
    ['Subscription|Monthly fee|Individuals & corporate training','Marketplace|15-30% commission|Instructors & learners','Freemium|Premium features|Individual learners']
  ),
  ec: _si(
    ['PCI DSS 4.0.1(カード情報)','景品表示法(誇大広告規制)','特定商取引法(返品・キャンセルポリシー)'],
    ['PCI DSS 4.0.1 (card data)','Consumer protection laws','Refund & cancellation policy compliance'],
    ['ヘッドレスコマース(Shopify Storefront API)','在庫最適化(需要予測AI)','Jamstack構成(Next.js + Stripe)'],
    ['Headless commerce (Shopify Storefront API)','Inventory optimization (demand forecasting AI)','Jamstack architecture (Next.js + Stripe)'],
    ['カゴ落ち率70%超え(決済UX不備)','在庫切れ表示遅延→信用失墜','SEO対策不足→集客失敗'],
    ['Cart abandonment >70% (poor checkout UX)','Stock-out display delay → loss of trust','Insufficient SEO → customer acquisition failure'],
    ['ライブコマース統合','音声検索対応','AR試着機能','サステナビリティ表示(CO2排出量)'],
    ['Live commerce integration','Voice search optimization','AR try-on features','Sustainability labels (CO2 emissions)'],
    ['直販|商品販売|消費者','マーケットプレイス|手数料10-20%|出品者・購入者','D2C|定期購入|ブランドファン'],
    ['Direct sales|Product revenue|Consumers','Marketplace|10-20% commission|Sellers & buyers','D2C|Subscription box|Brand fans']
  ),
  marketplace: _si(
    ['エスクロー決済必須(消費者保護)','出品者KYC(本人確認)','レビュー操作防止'],
    ['Escrow payment (consumer protection)','Seller KYC verification','Review manipulation prevention'],
    ['二面市場設計(supply/demand balance)','レビュー・評価システム(信頼構築)','検索ランキングアルゴリズム'],
    ['Two-sided marketplace design (supply/demand balance)','Review & rating system (trust building)','Search ranking algorithm'],
    ['供給側不足→品質低下悪循環','手数料高すぎ→競合流出','不正出品者排除遅延'],
    ['Supply shortage → quality decline spiral','Excessive fees → seller churn','Delayed fraud seller removal'],
    ['ギグエコノミー拡大','Stripe Connect進化(即時決済)','AIマッチング精度向上'],
    ['Gig economy expansion','Stripe Connect evolution (instant payouts)','AI-powered matching accuracy'],
    ['手数料|取引額の15-25%|出品者・購入者','広告収益|スポンサー枠|出品者','サブスク|プレミアム機能|パワーセラー'],
    ['Commission|15-25% of transaction|Sellers & buyers','Advertising|Sponsored listings|Sellers','Subscription|Premium features|Power sellers']
  ),
  community: _si(
    ['GDPR準拠(ユーザーデータ保護)','コンテンツモデレーション(違法コンテンツ対策)','未成年保護(年齢確認)'],
    ['GDPR compliance (user data protection)','Content moderation (illegal content removal)','Minor protection (age verification)'],
    ['WebSocket/SSE(リアルタイム通信)','スレッド型ディスカッション設計','ユーザーレピュテーションシステム'],
    ['WebSocket/SSE (real-time communication)','Threaded discussion architecture','User reputation system'],
    ['スパム・荒らし対策不足→品質低下','モデレーション負荷過多','エンゲージメント低下→過疎化'],
    ['Insufficient spam prevention → quality degradation','Moderation overload','Low engagement → ghost town effect'],
    ['AI自動モデレーション','分散型SNS(ActivityPub)','音声・動画コミュニティ拡大'],
    ['AI-powered auto-moderation','Decentralized social (ActivityPub)','Voice & video community expansion'],
    ['広告|インプレッション課金|企業広告主','プレミアム会員|月額・年額|コアユーザー','投げ銭|手数料10%|クリエイター'],
    ['Advertising|CPM/CPC|Corporate advertisers','Premium membership|Monthly/annual|Core users','Tipping|10% fee|Creators']
  ),
  content: _si(
    ['著作権管理(DMCA対応)','アクセシビリティ(字幕・音声説明)','広告表示規制'],
    ['Copyright management (DMCA compliance)','Accessibility (captions & audio description)','Advertising regulations'],
    ['ヘッドレスCMS(Strapi/Contentful)','CDN配信最適化(画像WebP化)','検索エンジン最適化(構造化データ)'],
    ['Headless CMS (Strapi/Contentful)','CDN optimization (WebP images)','SEO (structured data)'],
    ['コンテンツ重複(SEOペナルティ)','画像最適化不足→読込遅延','更新頻度低下→検索順位下落'],
    ['Content duplication (SEO penalty)','Insufficient image optimization → slow loading','Low update frequency → ranking drop'],
    ['生成AI記事作成支援','動画要約AI','パーソナライズドコンテンツ配信'],
    ['Generative AI writing assistance','Video summarization AI','Personalized content delivery'],
    ['広告|PV・広告枠|読者','サブスク|有料記事・会員限定|コアファン','アフィリエイト|成果報酬|読者→購入'],
    ['Advertising|PV & ad slots|Readers','Subscription|Paywalled articles|Core fans','Affiliate|Performance fee|Reader purchases']
  ),
  analytics: _si(
    ['データローカリティ(GDPR/CCPA)','匿名化処理(個人特定防止)','監査ログ保存'],
    ['Data locality (GDPR/CCPA)','Anonymization (PII removal)','Audit log retention'],
    ['リアルタイムストリーム処理(Apache Kafka/Flink)','列指向DB(ClickHouse/BigQuery)','埋め込み分析SDK'],
    ['Real-time stream processing (Kafka/Flink)','Columnar DB (ClickHouse/BigQuery)','Embedded analytics SDK'],
    ['データパイプライン障害→分析停止','可視化複雑すぎ→ユーザー混乱','コスト爆発(クエリ最適化不足)'],
    ['Data pipeline failure → analysis halt','Overly complex dashboards → user confusion','Cost explosion (poor query optimization)'],
    ['自然言語クエリ(生成AI)','予測分析精度向上(ML)','リアルタイム異常検知'],
    ['Natural language queries (generative AI)','Predictive analytics accuracy (ML)','Real-time anomaly detection'],
    ['SaaS|ユーザー数・データ量課金|企業分析チーム','埋め込み|導入企業課金|SaaS提供者','コンサル|導入・カスタマイズ支援|エンタープライズ'],
    ['SaaS|Users & data volume|Enterprise analytics teams','Embedded|Per-deployment|SaaS providers','Consulting|Implementation & customization|Enterprise']
  ),
  booking: _si(
    ['個人情報保護(予約者情報)','キャンセルポリシー明示','決済代行業者登録(必要に応じ)'],
    ['Personal data protection (reservation info)','Clear cancellation policy','Payment facilitator registration (if applicable)'],
    ['カレンダー同期(Google/Outlook)','タイムゾーン自動変換','空き枠リアルタイム更新'],
    ['Calendar sync (Google/Outlook)','Automatic timezone conversion','Real-time availability updates'],
    ['ダブルブッキング発生(排他制御不足)','キャンセル処理遅延→返金トラブル','リマインド通知漏れ→ノーショー増加'],
    ['Double booking (insufficient locking)','Delayed cancellation → refund issues','Missed reminders → no-show increase'],
    ['AIスケジュール最適化','動的価格設定(需要予測)','ビデオ会議統合(Zoom/Teams)'],
    ['AI schedule optimization','Dynamic pricing (demand forecasting)','Video conferencing integration (Zoom/Teams)'],
    ['手数料|予約額の10-15%|サービス提供者・顧客','SaaS|月額固定・予約数課金|店舗・施設','フリーミアム|基本無料・上位機能課金|個人事業主'],
    ['Commission|10-15% of booking|Service providers & customers','SaaS|Monthly fee + per-booking|Stores & facilities','Freemium|Basic free + premium features|Solopreneurs']
  ),
  saas: _si(
    ['SOC 2 Type II認証','GDPR/CCPA準拠','SLA保証(稼働率99.9%以上)'],
    ['SOC 2 Type II certification','GDPR/CCPA compliance','SLA guarantee (99.9%+ uptime)'],
    ['マルチテナント設計(tenant isolation)','API-first設計(拡張性)','使用量ベース課金システム'],
    ['Multi-tenant architecture (tenant isolation)','API-first design (extensibility)','Usage-based billing system'],
    ['チャーン率高い(オンボーディング不足)','スケーラビリティ不足→障害頻発','セキュリティ事故→信用失墜'],
    ['High churn (poor onboarding)','Scalability issues → frequent outages','Security breach → trust collapse'],
    ['PLG(Product-Led Growth)戦略','AI Copilot機能標準化','Vertical SaaS台頭'],
    ['PLG (Product-Led Growth) strategy','AI Copilot features standardization','Vertical SaaS rise'],
    ['サブスク|月額・年額・ユーザー数課金|企業・チーム','フリーミアム|基本無料・上位機能課金|個人・中小企業','使用量課金|API呼び出し・ストレージ従量|開発者'],
    ['Subscription|Monthly/annual/per-user|Enterprises & teams','Freemium|Basic free + premium|Individuals & SMBs','Usage-based|API calls & storage|Developers']
  ),
  portfolio: _si(
    ['著作権表示(作品保護)','プライバシーポリシー(問い合わせフォーム)','アクセシビリティ(WCAG準拠)'],
    ['Copyright notice (work protection)','Privacy policy (contact forms)','Accessibility (WCAG compliance)'],
    ['静的サイト生成(Next.js/Astro)','CMS統合(Notion/Contentful)','高速CDN配信(Vercel/Cloudflare)'],
    ['Static site generation (Next.js/Astro)','CMS integration (Notion/Contentful)','Fast CDN delivery (Vercel/Cloudflare)'],
    ['読込速度遅い(画像最適化不足)','更新頻度低い→陳腐化','SEO対策不足→発見されない'],
    ['Slow loading (insufficient image optimization)','Low update frequency → outdated','Insufficient SEO → not discoverable'],
    ['Bento Grid UIトレンド','3Dインタラクション(Three.js)','ダークモードデフォルト'],
    ['Bento Grid UI trend','3D interactions (Three.js)','Dark mode by default'],
    ['直接受注|プロジェクト単価|クライアント企業','コンテンツ販売|有料note・教材|個人学習者','コンサル|時間単価|企業・個人'],
    ['Direct orders|Project fee|Client companies','Content sales|Paid articles & courses|Individual learners','Consulting|Hourly rate|Companies & individuals']
  ),
  tool: _si(
    ['GDPR準拠(ユーザーデータ)','APIキー管理(セキュリティ)','利用規約明示'],
    ['GDPR compliance (user data)','API key management (security)','Clear terms of service'],
    ['PWA対応(オフライン動作)','クライアントサイド処理優先(プライバシー)','拡張機能提供(Browser Extension)'],
    ['PWA support (offline functionality)','Client-side processing (privacy)','Browser extension availability'],
    ['複雑すぎて使われない','ブラウザ依存機能(互換性問題)','競合ツールに埋もれる'],
    ['Too complex to use','Browser-dependent features (compatibility issues)','Lost in competitive landscape'],
    ['ローカルファーストツール','WebAssembly活用(高速化)','プライバシー重視設計'],
    ['Local-first tools','WebAssembly adoption (performance)','Privacy-focused design'],
    ['フリーミアム|基本無料・上位機能課金|個人・開発者','買い切り|一括購入|プロユーザー','オープンソース|寄付・スポンサー|コミュニティ'],
    ['Freemium|Basic free + premium|Individuals & developers','One-time purchase|Upfront payment|Pro users','Open source|Donations & sponsors|Community']
  ),
  iot: _si(
    ['データプライバシー(センサーデータ)','セキュリティ認証(デバイス接続)','電波法準拠(無線デバイス)'],
    ['Data privacy (sensor data)','Security certification (device connection)','Radio law compliance (wireless devices)'],
    ['MQTT/CoAP(軽量プロトコル)','時系列DB(InfluxDB/TimescaleDB)','エッジコンピューティング(遅延削減)'],
    ['MQTT/CoAP (lightweight protocols)','Time-series DB (InfluxDB/TimescaleDB)','Edge computing (latency reduction)'],
    ['デバイスファームウェア脆弱性','通信途絶時のデータロスト','スケーラビリティ不足(デバイス急増時)'],
    ['Device firmware vulnerabilities','Data loss during communication outages','Scalability issues (rapid device growth)'],
    ['5G活用(低遅延通信)','AIエッジ推論(リアルタイム処理)','デジタルツイン統合'],
    ['5G utilization (low-latency communication)','AI edge inference (real-time processing)','Digital twin integration'],
    ['SaaS|デバイス数・データ量課金|企業IoT管理','ハードウェア販売|デバイス販売・保守|製造業・施設','データ販売|分析データ提供|データ活用企業'],
    ['SaaS|Per-device & data volume|Enterprise IoT management','Hardware sales|Device sales & maintenance|Manufacturers & facilities','Data monetization|Analytics data|Data-driven companies']
  ),
  realestate: _si(
    ['宅建業法準拠(物件情報正確性)','個人情報保護(内覧者情報)','電子契約法対応'],
    ['Real estate transaction law compliance','Personal data protection (viewing applicants)','Electronic contract law compliance'],
    ['地図統合(Google Maps API)','VRツアー(360度動画)','AI物件レコメンド'],
    ['Map integration (Google Maps API)','VR tours (360° video)','AI property recommendations'],
    ['物件情報更新遅延→トラブル','内覧スケジュール重複','契約書電子化対応遅れ'],
    ['Delayed property info updates → disputes','Double-booked viewings','Slow adoption of electronic contracts'],
    ['AIバーチャル内覧','ブロックチェーン登記','スマートコントラクト契約'],
    ['AI virtual viewings','Blockchain property registry','Smart contract agreements'],
    ['仲介手数料|物件価格の3-6%|売主・買主','広告収益|物件掲載料|不動産会社','SaaS|月額・物件数課金|不動産会社'],
    ['Brokerage fee|3-6% of property price|Sellers & buyers','Advertising|Listing fees|Real estate agencies','SaaS|Monthly + per-property|Real estate agencies']
  ),
  legal: _si(
    ['弁護士法準拠(非弁行為禁止)','秘匿特権保護(クライアント情報)','電子契約法対応'],
    ['Attorney law compliance (unauthorized practice prohibition)','Attorney-client privilege protection','Electronic signature law compliance'],
    ['ドキュメント管理(バージョン管理)','検索精度(全文検索・タグ)','暗号化保存(機密文書)'],
    ['Document management (version control)','Search accuracy (full-text & tags)','Encrypted storage (confidential documents)'],
    ['検索機能貧弱→文書発見困難','バージョン管理不備→差分不明','アクセス制御不足→情報漏洩'],
    ['Poor search → document discovery difficulty','Inadequate version control → diff tracking issues','Insufficient access control → data leakage'],
    ['契約レビューAI(リスク検出)','自動契約書生成','eディスカバリー対応'],
    ['AI contract review (risk detection)','Automated contract generation','eDiscovery support'],
    ['SaaS|ユーザー数・ストレージ課金|法律事務所','コンサル|導入支援・カスタマイズ|大手事務所','テンプレート販売|契約書雛形販売|中小企業'],
    ['SaaS|Per-user & storage|Law firms','Consulting|Implementation & customization|Large firms','Template sales|Contract template sales|SMBs']
  ),
  hr: _si(
    ['労働基準法準拠(勤怠管理)','個人情報保護(応募者情報)','差別禁止(公平採用)'],
    ['Labor standards law compliance','Personal data protection (applicant info)','Non-discrimination (fair hiring)'],
    ['ATS(応募者追跡システム)','評価管理(360度評価)','勤怠管理統合'],
    ['ATS (Applicant Tracking System)','Performance management (360° reviews)','Attendance management integration'],
    ['応募者体験悪い→優秀人材逃す','評価基準曖昧→不満増加','システム複雑→利用率低下'],
    ['Poor candidate experience → talent loss','Vague evaluation criteria → dissatisfaction','System complexity → low adoption'],
    ['AIスクリーニング(応募書類)','スキルベース採用拡大','リモートワーク管理統合'],
    ['AI screening (applications)','Skills-based hiring expansion','Remote work management integration'],
    ['SaaS|従業員数課金|企業人事部','採用代行|手数料・成功報酬|企業','評価コンサル|導入・運用支援|大手企業'],
    ['SaaS|Per-employee|Corporate HR departments','Recruitment agency|Fee & success fee|Companies','Evaluation consulting|Implementation & support|Large enterprises']
  ),
  fintech: _si(
    ['金融商品取引法準拠','資金決済法(資金移動業)','マネーロンダリング対策(KYC/AML)'],
    ['Financial instruments law compliance','Payment services law','Anti-money laundering (KYC/AML)'],
    ['リアルタイム残高更新(イベントソーシング)','二要素認証必須(セキュリティ)','監査ログ(全取引記録)'],
    ['Real-time balance updates (event sourcing)','Mandatory 2FA (security)','Audit logs (all transactions)'],
    ['セキュリティ事故→信用失墜','規制対応遅延→サービス停止','UX複雑→離脱率高'],
    ['Security breach → trust collapse','Regulatory delay → service suspension','Complex UX → high churn'],
    ['埋め込み金融(Embedded Finance)','即時決済拡大(リアルタイムグロス決済)','CBDC(中央銀行デジタル通貨)対応'],
    ['Embedded finance','Instant payment expansion (real-time gross settlement)','CBDC (Central Bank Digital Currency) readiness'],
    ['手数料|送金・為替手数料|個人・企業','金利収益|預金・融資金利差|個人・企業','SaaS|API利用・取引量課金|フィンテック企業'],
    ['Transaction fees|Transfer & FX fees|Individuals & companies','Interest income|Deposit-loan spread|Individuals & companies','SaaS|API usage & transaction volume|Fintech companies']
  ),
  health: _si(
    ['HIPAA準拠(米国・患者情報保護)','医療法準拠(日本)','電子カルテ標準規格(HL7 FHIR)'],
    ['HIPAA compliance (US patient data protection)','Medical law compliance','Electronic health records standard (HL7 FHIR)'],
    ['暗号化必須(保管・転送時)','アクセス制御厳格(最小権限)','監査ログ(全アクセス記録)'],
    ['Encryption required (at-rest & in-transit)','Strict access control (least privilege)','Audit logs (all access records)'],
    ['情報漏洩→巨額罰金','システム障害→診療停止','連携不備→データ分断'],
    ['Data breach → massive fines','System outage → treatment halt','Integration issues → data silos'],
    ['遠隔診療拡大(オンライン診療)','AIドクター支援(診断補助)','ウェアラブル統合(健康データ)'],
    ['Telemedicine expansion','AI doctor assistance (diagnosis support)','Wearable integration (health data)'],
    ['診療報酬|保険請求|患者・保険者','SaaS|月額・施設数課金|クリニック・病院','データ活用|匿名化データ販売|製薬・研究機関'],
    ['Medical fees|Insurance claims|Patients & insurers','SaaS|Monthly + per-facility|Clinics & hospitals','Data monetization|Anonymized data sales|Pharma & research']
  ),
  ai: _si(
    ['AI倫理ガイドライン準拠','個人データ学習制限(GDPR)','生成物著作権明示'],
    ['AI ethics guidelines compliance','Personal data training restrictions (GDPR)','Generated content copyright disclosure'],
    ['プロンプト管理(バージョン管理)','RAG(Retrieval-Augmented Generation)','コンテキスト圧縮(トークン節約)'],
    ['Prompt management (version control)','RAG (Retrieval-Augmented Generation)','Context compression (token optimization)'],
    ['幻覚(Hallucination)→誤情報提供','コスト爆発(API呼び出し過多)','プロンプトインジェクション攻撃'],
    ['Hallucinations → misinformation','Cost explosion (excessive API calls)','Prompt injection attacks'],
    ['マルチモーダルAI(画像・動画・音声)','ローカルLLM活用(プライバシー)','AI Agent自律化'],
    ['Multimodal AI (image/video/audio)','Local LLM adoption (privacy)','Autonomous AI agents'],
    ['API課金|トークン・リクエスト従量|開発者・企業','SaaS|月額・ユーザー数課金|企業チーム','コンサル|導入・カスタマイズ支援|エンタープライズ'],
    ['API billing|Tokens & requests|Developers & companies','SaaS|Monthly + per-user|Enterprise teams','Consulting|Implementation & customization|Enterprise']
  ),
  automation: _si(
    ['データプライバシー(自動処理データ)','API利用規約準拠(連携サービス)','監査ログ保存'],
    ['Data privacy (automated processing)','API terms compliance (integrated services)','Audit log retention'],
    ['ワークフロー設計(DAG管理)','エラーハンドリング(リトライ戦略)','WebHook受信(イベント駆動)'],
    ['Workflow design (DAG management)','Error handling (retry strategies)','WebHook reception (event-driven)'],
    ['ワークフロー複雑化→保守困難','エラー通知不足→障害気づかず','連携サービス変更→動作停止'],
    ['Workflow complexity → maintenance difficulty','Insufficient error notifications → undetected failures','Service API changes → workflow breakage'],
    ['AI Agentワークフロー','ノーコード自動化拡大','リアルタイムトリガー精度向上'],
    ['AI agent workflows','No-code automation expansion','Real-time trigger accuracy improvement'],
    ['SaaS|ワークフロー数・実行回数課金|企業・個人','フリーミアム|基本無料・上位機能課金|中小企業','コンサル|業務自動化設計支援|エンタープライズ'],
    ['SaaS|Workflows & executions|Companies & individuals','Freemium|Basic free + premium|SMBs','Consulting|Business automation design|Enterprise']
  ),
  event: _si(
    ['個人情報保護(参加者情報)','チケット転売防止(規制準拠)','払い戻しポリシー明示'],
    ['Personal data protection (attendee info)','Ticket resale prevention (regulation compliance)','Clear refund policy'],
    ['チケット販売(Stripe決済)','QRコードチェックイン','参加者管理(バッジ印刷)'],
    ['Ticket sales (Stripe payment)','QR code check-in','Attendee management (badge printing)'],
    ['チケット偽造対策不足','当日混雑→チェックイン遅延','キャンセル処理トラブル'],
    ['Insufficient anti-counterfeit measures','Check-in delays on event day','Cancellation processing issues'],
    ['ハイブリッドイベント拡大(オンライン配信)','NFTチケット','AIネットワーキング支援'],
    ['Hybrid event expansion (online streaming)','NFT tickets','AI networking assistance'],
    ['チケット販売|手数料10-20%|主催者・参加者','スポンサー収益|広告・ブース販売|企業スポンサー','SaaS|月額・イベント数課金|イベント運営会社'],
    ['Ticket sales|10-20% commission|Organizers & attendees','Sponsor revenue|Ads & booth sales|Corporate sponsors','SaaS|Monthly + per-event|Event management companies']
  ),
  gamify: _si(
    ['個人情報保護(ユーザー行動データ)','景品規制(高額報酬制限)','ギャンブル性回避'],
    ['Personal data protection (user behavior data)','Prize regulations (high-value reward limits)','Gambling avoidance'],
    ['ポイント管理(残高・履歴)','バッジシステム(達成トリガー)','リーダーボード(ランキング更新)'],
    ['Point management (balance & history)','Badge system (achievement triggers)','Leaderboard (ranking updates)'],
    ['報酬インフレ→モチベーション低下','不正獲得対策不足','ゲーミフィケーション設計失敗→飽きられる'],
    ['Reward inflation → motivation decline','Insufficient fraud prevention','Poor gamification design → user boredom'],
    ['NFTバッジ(ブロックチェーン)','AIパーソナライズチャレンジ','ソーシャルゲーミフィケーション'],
    ['NFT badges (blockchain)','AI personalized challenges','Social gamification'],
    ['広告|インプレッション課金|企業広告主','アプリ内課金|ポイント・アイテム購入|ユーザー','SaaS|月額・ユーザー数課金|企業導入'],
    ['Advertising|CPM/CPC|Corporate advertisers','In-app purchases|Points & items|Users','SaaS|Monthly + per-user|Enterprise adoption']
  ),
  collab: _si(
    ['データプライバシー(共同編集データ)','GDPR準拠(ユーザーデータ)','アクセス制御(権限管理)'],
    ['Data privacy (collaborative data)','GDPR compliance (user data)','Access control (permission management)'],
    ['CRDT(衝突解決アルゴリズム)','WebSocket(リアルタイム同期)','バージョン履歴(変更追跡)'],
    ['CRDT (conflict resolution)','WebSocket (real-time sync)','Version history (change tracking)'],
    ['同期ラグ→編集衝突頻発','権限管理複雑→誤操作','オフライン対応不足→データロスト'],
    ['Sync lag → frequent edit conflicts','Complex permissions → user errors','Insufficient offline support → data loss'],
    ['AIコラボ支援(要約・提案)','音声・動画コラボ拡大','ブロックチェーン所有権証明'],
    ['AI collaboration assistance (summaries & suggestions)','Voice & video collaboration expansion','Blockchain ownership proof'],
    ['SaaS|月額・ユーザー数課金|企業・チーム','フリーミアム|基本無料・上位機能課金|個人・中小企業','エンタープライズ|カスタマイズ・専用環境|大手企業'],
    ['SaaS|Monthly + per-user|Companies & teams','Freemium|Basic free + premium|Individuals & SMBs','Enterprise|Customization & dedicated env|Large enterprises']
  ),
  devtool: _si(
    ['APIキー管理(セキュリティ)','利用規約明示(レート制限・SLA)','オープンソースライセンス'],
    ['API key management (security)','Clear terms (rate limits & SLA)','Open source licensing'],
    ['APIファースト設計','SDK提供(多言語)','WebHook配信(イベント通知)'],
    ['API-first design','SDK provision (multi-language)','WebHook delivery (event notifications)'],
    ['ドキュメント不足→導入障壁','レート制限厳しすぎ→離脱','障害通知遅延→信頼低下'],
    ['Insufficient documentation → adoption barrier','Overly strict rate limits → churn','Delayed outage notifications → trust decline'],
    ['OpenAPI 3.1標準化','GraphQL採用拡大','開発者体験(DX)重視設計'],
    ['OpenAPI 3.1 standardization','GraphQL adoption expansion','Developer experience (DX) focused design'],
    ['API課金|リクエスト従量|開発者・企業','SaaS|月額・機能課金|企業','オープンソース|エンタープライズサポート有償|大手企業'],
    ['API billing|Per-request|Developers & companies','SaaS|Monthly + features|Companies','Open source|Paid enterprise support|Large enterprises']
  ),
  creator: _si(
    ['著作権保護(コンテンツ)','決済代行業者登録(手数料収受)','税務対応(クリエイター収益)'],
    ['Copyright protection (content)','Payment facilitator registration (fee collection)','Tax compliance (creator revenue)'],
    ['サブスク管理(Stripe Billing)','投げ銭決済(少額決済)','コンテンツ配信(DRM保護)'],
    ['Subscription management (Stripe Billing)','Tipping payment (micro-transactions)','Content delivery (DRM protection)'],
    ['手数料高すぎ→クリエイター不満','コンテンツ海賊版対策不足','収益化ハードル高い→離脱'],
    ['Excessive fees → creator dissatisfaction','Insufficient piracy prevention','High monetization barrier → churn'],
    ['AI生成コンテンツ統合','NFTコンテンツ販売','ライブストリーミング収益化'],
    ['AI-generated content integration','NFT content sales','Live streaming monetization'],
    ['手数料|クリエイター収益の10-20%|クリエイター・ファン','サブスク|月額会員費|ファン','投げ銭|少額課金・手数料|ファン'],
    ['Commission|10-20% of creator revenue|Creators & fans','Subscription|Monthly membership|Fans','Tipping|Micro-transactions + fee|Fans']
  ),
  newsletter: _si(
    ['GDPR準拠(購読者データ)','CAN-SPAM法準拠(米国・配信規制)','オプトイン必須(同意取得)'],
    ['GDPR compliance (subscriber data)','CAN-SPAM Act compliance (US anti-spam)','Opt-in required (consent acquisition)'],
    ['配信管理(SendGrid/Resend)','購読者セグメント(タグ付け)','A/Bテスト(件名・本文)'],
    ['Delivery management (SendGrid/Resend)','Subscriber segmentation (tagging)','A/B testing (subject & body)'],
    ['スパム判定→到達率低下','配信停止処理遅延→苦情','コンテンツ単調→開封率低下'],
    ['Spam flagging → low deliverability','Delayed unsubscribe → complaints','Monotonous content → low open rate'],
    ['AI記事生成支援','パーソナライズド配信(行動ベース)','音声ニュースレター'],
    ['AI article generation assistance','Personalized delivery (behavior-based)','Audio newsletters'],
    ['サブスク|有料ニュースレター月額|読者','広告|スポンサード記事|企業広告主','アフィリエイト|紹介手数料|読者→購入'],
    ['Subscription|Paid newsletter monthly|Readers','Advertising|Sponsored articles|Corporate advertisers','Affiliate|Referral commission|Reader purchases']
  ),
  manufacturing: _si(
    ['ISO 9001品質','IEC 62443産業制御セキュリティ','製造物責任法(PL法)トレーサビリティ'],
    ['ISO 9001 quality management','IEC 62443 industrial control security','Product liability law traceability'],
    ['Digital Twin(工場シミュレーション)','Edge AI(予知保全)','OPC UA(設備連携標準)'],
    ['Digital Twin (factory simulation)','Edge AI (predictive maintenance)','OPC UA (equipment interoperability)'],
    ['予知保全未導入→突発停止','品質データ分断→原因追跡困難','OTセキュリティ脆弱性'],
    ['No predictive maintenance → sudden downtime','Quality data silos → root cause tracking difficulty','OT security vulnerabilities'],
    ['予知保全AI拡大','協働ロボット(cobot)統合','Scope1-3カーボン管理'],
    ['Predictive maintenance AI expansion','Collaborative robot (cobot) integration','Scope 1-3 carbon management'],
    ['ライセンス|工場・デバイス数課金|製造業','SaaS|月額・機能課金|製造業','SI|導入・カスタマイズ|大手製造業'],
    ['License|Per-factory/device|Manufacturers','SaaS|Monthly + features|Manufacturers','SI|Implementation & customization|Large manufacturers']
  ),
  logistics: _si(
    ['貨物運送事業法','2024年問題(労働時間規制)','倉庫業法','関税法(NACCS連携)'],
    ['Freight carrier business law','2024 problem (driver hour limits)','Warehouse business law','Customs law (NACCS integration)'],
    ['ルート最適化(OR-Tools)','WMS(倉庫管理)','GPS+5G追跡','ブロックチェーン(トレーサビリティ)'],
    ['Route optimization (OR-Tools)','WMS (warehouse management)','GPS + 5G tracking','Blockchain traceability'],
    ['配送遅延→顧客不満','在庫不足・過剰→コスト増','ドライバー不足→需要対応困難'],
    ['Delivery delays → customer dissatisfaction','Stock shortage/excess → cost increase','Driver shortage → demand response difficulty'],
    ['自動配送ロボット・ドローン','ブロックチェーン透明化','AGV(無人搬送車)','リアルタイム需給マッチ'],
    ['Autonomous delivery robots/drones','Blockchain transparency','AGV (automated guided vehicles)','Real-time supply-demand matching'],
    ['SaaS|配送・在庫管理|物流企業','手数料|配送マッチング|荷主・配送業者','SI|導入・カスタマイズ|大手物流'],
    ['SaaS|Delivery & inventory mgmt|Logistics companies','Commission|Delivery matching|Shippers & carriers','SI|Implementation & customization|Large logistics']
  ),
  agriculture: _si(
    ['農薬取締法','種苗法(品種保護)','GAP(農業生産工程管理)','ドローン規制(航空法)'],
    ['Agricultural chemicals control law','Plant variety protection law','GAP (Good Agricultural Practice)','Drone regulations (aviation law)'],
    ['LoRaWAN(センサー通信)','衛星画像分析(Sentinel-2)','AI病害虫診断','需給マッチングプラットフォーム'],
    ['LoRaWAN (sensor communication)','Satellite imagery analysis (Sentinel-2)','AI pest/disease diagnosis','Supply-demand matching platform'],
    ['センサー故障→データ欠損','天候依存リスク高い','IT習熟度低い→導入困難'],
    ['Sensor failures → data loss','High weather dependency risk','Low IT literacy → adoption difficulty'],
    ['精密農業(変量施肥)','ドローン散布','需給マッチング拡大','カーボンクレジット取引'],
    ['Precision agriculture (variable rate application)','Drone spraying','Supply-demand matching expansion','Carbon credit trading'],
    ['SaaS|センサー・データ分析|農家','ハードウェア販売|デバイス販売|農家','データ販売|気象・需給データ|JA・食品メーカー'],
    ['SaaS|Sensors & data analytics|Farmers','Hardware sales|Device sales|Farmers','Data monetization|Weather & supply data|Co-ops & food manufacturers']
  ),
  energy: _si(
    ['電気事業法(保安・需給調整)','再エネ特措法(FIT/FIP)','省エネ法・温対法','GHGプロトコル(Scope1-3)'],
    ['Electricity business law (safety & supply-demand)','Renewable energy law (FIT/FIP)','Energy conservation & climate laws','GHG Protocol (Scope 1-3)'],
    ['DERMS(分散電源管理)','スマートメーター連携','発電予測AI(気象データ)','P2P電力取引プラットフォーム'],
    ['DERMS (distributed energy resource mgmt)','Smart meter integration','Generation forecasting AI (weather data)','P2P electricity trading platform'],
    ['系統不安定(再エネ変動)','蓄電池劣化管理不足','出力制御→収益減'],
    ['Grid instability (renewable fluctuations)','Insufficient battery degradation mgmt','Output curtailment → revenue loss'],
    ['P2P電力取引拡大','VPP(仮想発電所)','カーボンNFT','AI需要予測高度化'],
    ['P2P electricity trading expansion','VPP (virtual power plant)','Carbon NFT','Advanced AI demand forecasting'],
    ['SaaS|発電・需給管理|発電事業者','PPA(電力購入契約)|長期契約|企業','データ販売|需給・カーボンデータ|エネルギー企業'],
    ['SaaS|Generation & demand mgmt|Power producers','PPA (power purchase agreement)|Long-term contract|Corporations','Data monetization|Supply & carbon data|Energy companies']
  ),
  media: _si(
    ['著作権法(権利処理・DRM)','放送法(番組基準)','青少年保護育成条例','景品表示法(ガチャ確率)'],
    ['Copyright law (rights & DRM)','Broadcasting law (program standards)','Youth protection ordinances','Prize labeling law (gacha rates)'],
    ['HLS/DASH/CMAF配信(低遅延)','DRM(Widevine/FairPlay)','AI生成コンテンツ補助','インタラクティブ配信'],
    ['HLS/DASH/CMAF streaming (low latency)','DRM (Widevine/FairPlay)','AI-generated content assistance','Interactive streaming'],
    ['海賊版対策不足','審査遅延→配信開始遅れ','配信コスト過大'],
    ['Insufficient anti-piracy measures','Review delays → delayed launch','Excessive streaming costs'],
    ['インタラクティブストリーミング','空間Computing(VR/AR)','AI制作支援拡大','UGC収益化'],
    ['Interactive streaming','Spatial computing (VR/AR)','AI production assistance expansion','UGC monetization'],
    ['サブスク|月額課金|視聴者','広告|インプレッション課金|企業広告主','ライセンス|コンテンツ販売|配信プラットフォーム'],
    ['Subscription|Monthly fee|Viewers','Advertising|CPM/CPC|Corporate advertisers','Licensing|Content sales|Streaming platforms']
  ),
  government: _si(
    ['公的個人認証法(JPKI)','行政機関個人情報保護法','デジタル手続法(オンライン化原則)','ISMAP(政府調達基準)'],
    ['JPKI (public key infrastructure)','Administrative personal data protection law','Digital procedure law (online-first)','ISMAP (government procurement standards)'],
    ['Gov Cloud(AWS/Azure/GCP)','LGWAN接続','FIDO2(パスワードレス)','オープンデータプラットフォーム'],
    ['Gov Cloud (AWS/Azure/GCP)','LGWAN (government network) integration','FIDO2 (passwordless)','Open data platform'],
    ['レガシー移行失敗','アクセシビリティ不足(a11y)','セキュリティインシデント→信用失墜'],
    ['Legacy migration failure','Insufficient accessibility (a11y)','Security incidents → trust collapse'],
    ['オープンデータ拡大','AIチャットボット(行政手続き)','ブロックチェーン公証','マイナンバー連携拡大'],
    ['Open data expansion','AI chatbot (administrative procedures)','Blockchain notarization','My Number integration expansion'],
    ['受託|システム開発|政府機関','SaaS|Gov Cloud・行政サービス|地方自治体','保守|運用・サポート|政府機関'],
    ['Contract|System development|Government agencies','SaaS|Gov Cloud & admin services|Local governments','Maintenance|Operations & support|Government agencies']
  ),
  travel: _si(
    ['旅行業法(登録・約款)','旅館業法・民泊新法','PCI DSS(予約決済)','GDPR(訪日客データ)'],
    ['Travel agency law (registration & terms)','Hotel business law & vacation rental law','PCI DSS (reservation payment)','GDPR (international visitor data)'],
    ['PMS統合(Oracle/Cloudbeds)','チャネルマネージャー(OTA在庫統合)','動的価格設定(需要予測AI)','多言語対応(DeepL API)'],
    ['PMS integration (Oracle/Cloudbeds)','Channel manager (OTA inventory integration)','Dynamic pricing (demand forecasting AI)','Multi-language support (DeepL API)'],
    ['OTA依存度高い→手数料負担','シーズン変動大きい→稼働率低下','口コミ管理不足→評価低下'],
    ['High OTA dependency → commission burden','Large seasonal fluctuations → low occupancy','Insufficient review mgmt → rating decline'],
    ['AIコンシェルジュ(24h対応)','VRプレビュー(予約前内見)','サステナブルツーリズム','非接触チェックイン拡大'],
    ['AI concierge (24h support)','VR preview (pre-booking tours)','Sustainable tourism','Contactless check-in expansion'],
    ['手数料|予約手数料10-20%|宿泊施設・OTA','SaaS|月額・施設数課金|宿泊施設','広告|スポンサー枠|観光施設'],
    ['Commission|10-20% booking fee|Accommodations & OTAs','SaaS|Monthly + per-facility|Accommodations','Advertising|Sponsored listings|Tourist facilities']
  ),
  insurance: _si(
    ['保険業法(募集・引受・ソルベンシー)','保険法(告知義務)','IFRS 17(国際会計基準)','金融ADR(紛争解決)'],
    ['Insurance business law (solicitation/underwriting/solvency)','Insurance law (duty of disclosure)','IFRS 17 (accounting standards)','Financial ADR (dispute resolution)'],
    ['Guidewire/Duck Creek(基幹)','テレマティクス(運転スコア分析)','Wearable統合(健康保険)','パラメトリック保険(スマートコントラクト)'],
    ['Guidewire/Duck Creek (core systems)','Telematics (driving score analysis)','Wearable integration (health insurance)','Parametric insurance (smart contracts)'],
    ['引受プロセス遅延','不正請求検知不足','商品設計複雑→顧客理解困難'],
    ['Underwriting process delays','Insufficient fraud detection','Complex product design → customer confusion'],
    ['組み込み保険(Embedded)拡大','AIリスク評価高度化','オンデマンド保険(短期・細分化)','健康増進型保険'],
    ['Embedded insurance expansion','Advanced AI risk assessment','On-demand insurance (short-term/micro)','Wellness-linked insurance'],
    ['保険料|契約保険料|契約者','代理店手数料|販売手数料|代理店','SaaS|保険業務効率化|保険会社'],
    ['Premium|Contract premium|Policyholders','Agent commission|Sales commission|Agents','SaaS|Insurance operations efficiency|Insurance companies']
  ),
  _default: _si(
    ['GDPR/CCPA準拠(一般データ保護)','利用規約・プライバシーポリシー必須','アクセシビリティ(WCAG 2.1)'],
    ['GDPR/CCPA compliance (general data protection)','Terms & privacy policy required','Accessibility (WCAG 2.1)'],
    ['3層アーキテクチャ(UI/API/DB)','認証・認可分離','RESTful API設計'],
    ['3-tier architecture (UI/API/DB)','Auth/authz separation','RESTful API design'],
    ['セキュリティ対策不足→情報漏洩','スケーラビリティ不足→障害','UX設計不備→離脱率高'],
    ['Insufficient security → data breach','Scalability issues → outages','Poor UX design → high churn'],
    ['AI統合加速','リアルタイム機能拡大','プライバシー重視設計'],
    ['Accelerated AI integration','Real-time feature expansion','Privacy-focused design'],
    ['SaaS|月額課金|企業・個人','フリーミアム|基本無料・上位機能課金|個人・中小企業','広告|インプレッション課金|企業広告主'],
    ['SaaS|Monthly fee|Companies & individuals','Freemium|Basic free + premium|Individuals & SMBs','Advertising|CPM/CPC|Corporate advertisers']
  )
};

// Stakeholder Strategy Database (4 types)
const STAKEHOLDER_STRATEGY = {
  startup: {
    name_ja: 'スタートアップ',
    name_en: 'Startup',
    phases_ja: ['MVP構築(2-4週)','PMF検証(1-3ヶ月)','スケール準備(3-6ヶ月)','成長フェーズ(6ヶ月〜)'],
    phases_en: ['MVP Build (2-4 weeks)','PMF Validation (1-3 months)','Scale Prep (3-6 months)','Growth Phase (6+ months)'],
    tech_debt_ja: 'MVP期は技術的負債許容。PMF後にリファクタリング集中投資。スケール前に負債返済80%目標。',
    tech_debt_en: 'Tolerate tech debt during MVP. Invest in refactoring post-PMF. Target 80% debt repayment before scaling.',
    team_ja: 'フルスタック1-2名 → フロント/バック分離(3-5名) → 専門化(10名〜)',
    team_en: 'Full-stack 1-2 → Front/Back split (3-5) → Specialization (10+)',
    budget_ja: '開発70% / インフラ10% / マーケ15% / セキュリティ5%',
    budget_en: 'Dev 70% / Infra 10% / Marketing 15% / Security 5%'
  },
  enterprise: {
    name_ja: 'エンタープライズ',
    name_en: 'Enterprise',
    phases_ja: ['PoC実施(1-2ヶ月)','パイロット導入(3-6ヶ月)','段階的展開(6-12ヶ月)','最適化(継続)'],
    phases_en: ['PoC (1-2 months)','Pilot Deployment (3-6 months)','Phased Rollout (6-12 months)','Optimization (ongoing)'],
    tech_debt_ja: 'レガシー移行計画必須。Strangler Figパターン推奨。技術的負債管理をKPI化(SQALE Rating)。',
    tech_debt_en: 'Legacy migration plan required. Strangler Fig pattern recommended. Manage tech debt as KPI (SQALE Rating).',
    team_ja: 'アーキテクト主導 → 複数チーム(機能別) → Platform Engineering組織',
    team_en: 'Architect-led → Multi-teams (feature-based) → Platform Engineering org',
    budget_ja: '開発50% / インフラ20% / セキュリティ20% / コンプライアンス10%',
    budget_en: 'Dev 50% / Infra 20% / Security 20% / Compliance 10%'
  },
  developer: {
    name_ja: '開発者(個人・少人数)',
    name_en: 'Developer (Solo/Small Team)',
    phases_ja: ['週末プロジェクト(1-2週)','サイドプロジェクト(1-3ヶ月)','プロダクト化(3-6ヶ月)','運用・成長'],
    phases_en: ['Weekend Project (1-2 weeks)','Side Project (1-3 months)','Productization (3-6 months)','Operations & Growth'],
    tech_debt_ja: '初期はスピード優先。ユーザー獲得後にリファクタリング。自動化ツール積極活用。',
    tech_debt_en: 'Prioritize speed initially. Refactor after user acquisition. Leverage automation tools.',
    team_ja: 'ソロ → デュアル(フロント/バック分担) → 小規模チーム(3-5名)',
    team_en: 'Solo → Duo (front/back split) → Small team (3-5)',
    budget_ja: '開発80%(時間投資) / インフラ15% / マーケ5%(オーガニック重視)',
    budget_en: 'Dev 80% (time investment) / Infra 15% / Marketing 5% (organic focus)'
  },
  team: {
    name_ja: '標準チーム',
    name_en: 'Standard Team',
    phases_ja: ['Sprint 0(環境構築)','MVP開発(2-4週)','v1.0リリース(2-3ヶ月)','成長フェーズ'],
    phases_en: ['Sprint 0 (Setup)','MVP Dev (2-4 weeks)','v1.0 Release (2-3 months)','Growth Phase'],
    tech_debt_ja: '20%ルール適用(Sprint時間の20%を負債返済)。四半期ごとにリファクタリングSprint実施。',
    tech_debt_en: '20% rule (dedicate 20% of sprint to debt repayment). Quarterly refactoring sprints.',
    team_ja: 'クロスファンクショナルチーム(5-9名) → Two-Pizza Team原則',
    team_en: 'Cross-functional team (5-9) → Two-Pizza Team principle',
    budget_ja: '開発60% / インフラ15% / マーケ15% / セキュリティ10%',
    budget_en: 'Dev 60% / Infra 15% / Marketing 15% / Security 10%'
  }
};

// Operational Excellence Frameworks
const OPERATIONAL_FRAMEWORKS = {
  tech_debt: {
    title_ja: '技術的負債管理フレームワーク',
    title_en: 'Technical Debt Management Framework',
    quadrant_ja: ['意図的・戦略的(MVP速度優先)','意図的・戦術的(一時的回避)','非意図的・戦略的(設計誤認識)','非意図的・戦術的(スキル不足)'],
    quadrant_en: ['Deliberate-Strategic (MVP speed)','Deliberate-Tactical (temporary workaround)','Inadvertent-Strategic (design misunderstanding)','Inadvertent-Tactical (skill gap)'],
    sqale_ja: 'SQALE金額換算: 負債1時間 = エンジニア時給 × 1.5倍(遅延コスト込)',
    sqale_en: 'SQALE monetization: 1hr debt = Engineer hourly rate × 1.5 (delay cost included)',
    rule_ja: '20%ルール: Sprint時間の20%を負債返済に割り当て',
    rule_en: '20% Rule: Dedicate 20% of sprint time to debt repayment'
  },
  dr_bcp: {
    title_ja: '災害復旧・BCP',
    title_en: 'Disaster Recovery & BCP',
    rto_rpo_ja: 'RTO(Recovery Time Objective): 目標復旧時間 / RPO(Recovery Point Objective): 目標復旧時点',
    rto_rpo_en: 'RTO (Recovery Time Objective) / RPO (Recovery Point Objective)',
    tier_ja: ['Tier 1: RTO<1h, RPO<15min (Critical)','Tier 2: RTO<4h, RPO<1h (High)','Tier 3: RTO<24h, RPO<4h (Medium)'],
    tier_en: ['Tier 1: RTO<1h, RPO<15min (Critical)','Tier 2: RTO<4h, RPO<1h (High)','Tier 3: RTO<24h, RPO<4h (Medium)'],
    backup_ja: '3-2-1ルール: 3コピー・2種類メディア・1オフサイト',
    backup_en: '3-2-1 Rule: 3 copies, 2 media types, 1 offsite',
    incident_ja: '検知 → トリアージ → 対応 → 復旧 → 事後レビュー(Postmortem)',
    incident_en: 'Detection → Triage → Response → Recovery → Postmortem'
  },
  green_it: {
    title_ja: 'Green IT・カーボンニュートラル',
    title_en: 'Green IT & Carbon Neutrality',
    framework_ja: ['Serverless優先(アイドル時間削減)','CDN活用(ネットワーク排出削減)','画像最適化(WebP/AVIF)','不要リソース削除(Zombie resources)'],
    framework_en: ['Serverless-first (reduce idle time)','CDN utilization (reduce network emissions)','Image optimization (WebP/AVIF)','Remove zombie resources'],
    carbon_ja: 'Cloud Carbon Footprint計測(AWS/Azure/GCP)',
    carbon_en: 'Cloud Carbon Footprint measurement (AWS/Azure/GCP)',
    sla_ja: '再エネ100%データセンター選択(Google Cloud/AWS Graviton)',
    sla_en: 'Choose 100% renewable energy data centers (Google Cloud/AWS Graviton)'
  },
  team_design: {
    title_ja: 'チーム設計・Conway\'s Law対応',
    title_en: 'Team Design & Conway\'s Law',
    conway_ja: 'アーキテクチャと組織構造を一致させる(マイクロサービス → 機能別チーム)',
    conway_en: 'Align architecture with org structure (Microservices → Feature teams)',
    two_pizza_ja: 'Two-Pizza Team: 1チーム5-9名(ピザ2枚で足りる人数)',
    two_pizza_en: 'Two-Pizza Team: 5-9 members per team',
    dora_ja: 'DORA metrics計測(デプロイ頻度・変更リードタイム・MTTR・変更失敗率)',
    dora_en: 'DORA metrics (Deployment frequency, Lead time, MTTR, Change failure rate)'
  }
};

// Extended Operational Frameworks (4 new topics)
const OPERATIONAL_FRAMEWORKS_EXT = {
  ai_ethics: {
    title_ja: 'AI倫理・ガバナンス',
    title_en: 'AI Ethics & Governance',
    principles_ja: ['公平性(Fairness)','説明可能性(Explainability)','透明性(Transparency)','プライバシー','セキュリティ'],
    principles_en: ['Fairness','Explainability','Transparency','Privacy','Security'],
    impl_ja: 'Fairlearn/AIF360でバイアス検知、SHAP/LIMEで説明可能性、Human-in-the-loop(低信頼度時)',
    impl_en: 'Bias detection (Fairlearn/AIF360), Explainability (SHAP/LIME), Human-in-the-loop (low confidence)',
    compliance_ja: 'EU AI Act準拠、AIリスク分類(高/限定/最小/禁止)',
    compliance_en: 'EU AI Act compliance, AI risk classification (High/Limited/Minimal/Prohibited)'
  },
  zero_trust: {
    title_ja: 'ゼロトラストセキュリティ',
    title_en: 'Zero Trust Security',
    principles_ja: '境界防御撤廃、常に検証、最小特権、セグメンテーション、暗号化、監視',
    principles_en: 'No perimeter, Always verify, Least privilege, Segmentation, Encryption, Monitoring',
    impl_ja: 'IAM(Azure AD/Okta)+FIDO2、マイクロセグメンテーション(Kubernetes NetworkPolicy)、EDR/XDR',
    impl_en: 'IAM (Azure AD/Okta) + FIDO2, Micro-segmentation (Kubernetes NetworkPolicy), EDR/XDR',
    beyondcorp_ja: 'BeyondCorp 7原則: デバイス信頼、ユーザー検証、コンテキスト認識',
    beyondcorp_en: 'BeyondCorp 7 principles: Device trust, User verification, Context awareness'
  },
  data_governance: {
    title_ja: 'データガバナンス',
    title_en: 'Data Governance',
    elements_ja: ['データカタログ','品質管理(DQ)','リネージ(系譜)','セキュリティ','データメッシュ'],
    elements_en: ['Data Catalog','Data Quality (DQ)','Lineage','Security','Data Mesh'],
    stack_ja: 'DataHub/Amundsen(カタログ)、Great Expectations(品質)、動的マスキング(Snowflake/BigQuery)',
    stack_en: 'DataHub/Amundsen (catalog), Great Expectations (quality), Dynamic masking (Snowflake/BigQuery)',
    mesh_ja: 'データメッシュ原則: ドメイン所有、データプロダクト思考、セルフサービスインフラ',
    mesh_en: 'Data Mesh principles: Domain ownership, Data as product, Self-serve infrastructure'
  },
  globalization: {
    title_ja: 'グローバル展開(i18n/l10n)',
    title_en: 'Globalization (i18n/l10n)',
    i18n_ja: 'Unicode対応、RTL(右→左)対応、ハードコード排除、pluralization',
    i18n_en: 'Unicode support, RTL (right-to-left), No hardcoded strings, Pluralization',
    l10n_ja: '言語リソース管理(Locize/Phrase)、地域別フォーマット(日付・通貨・住所)',
    l10n_en: 'Language resource mgmt (Locize/Phrase), Regional formats (date/currency/address)',
    infra_ja: 'エッジロケーション(CDN)活用、データレジデンシー(GDPR/各国法令)',
    infra_en: 'Edge locations (CDN), Data residency (GDPR/local regulations)'
  }
};

// Extreme Implementation Scenarios (6 advanced patterns)
const EXTREME_SCENARIOS = {
  break_glass: {
    title_ja: 'Break-glass緊急アクセス(Healthcare/Gov)',
    title_en: 'Break-glass Emergency Access (Healthcare/Gov)',
    desc_ja: '通常はアクセス不可、緊急時のみ理由入力で全医師許可。監査ログ必須。',
    desc_en: 'Normally denied, emergency mode allows all doctors with reason input. Audit log required.',
    tech: 'OPA/Rego, ABAC (Attribute-Based Access Control)',
    domains: ['health', 'government']
  },
  k_anonymity: {
    title_ja: 'k-匿名化パイプライン(個人特定防止)',
    title_en: 'k-Anonymity Pipeline (De-identification)',
    desc_ja: '準識別子(年齢・郵便番号・性別)の組み合わせでk人以上のグループを形成。',
    desc_en: 'Form groups of k+ individuals using quasi-identifiers (age/zip/gender).',
    tech: 'Pandas (generalization), k≥3 enforcement',
    domains: ['health', 'hr', 'fintech']
  },
  geo_partition: {
    title_ja: 'ジオパーティショニング(データレジデンシー)',
    title_en: 'Geo-Partitioning (Data Residency)',
    desc_ja: 'SQLレベルでデータ配置リージョンを制御。GDPR/各国法令対応。',
    desc_en: 'Control physical data placement at SQL level. GDPR/local law compliance.',
    tech: 'CockroachDB / YugabyteDB (geo-partitioning)',
    domains: ['fintech', 'ec', 'saas', 'health', 'government']
  },
  carbon_aware: {
    title_ja: 'カーボンアウェアスケーリング(Green IT)',
    title_en: 'Carbon-Aware Scaling (Green IT)',
    desc_ja: '電力CO2排出係数に基づき、非必須処理を抑制。KEDA外部トリガー。',
    desc_en: 'Scale down non-critical workloads based on carbon intensity. KEDA external trigger.',
    tech: 'KEDA, Carbon Intensity API',
    domains: ['manufacturing', 'energy', 'ec', 'analytics']
  },
  post_quantum: {
    title_ja: 'ポスト量子暗号+DID(未来対応)',
    title_en: 'Post-Quantum Cryptography + DID (Future-Ready)',
    desc_ja: 'NIST標準ML-KEM(Kyber)ハイブリッド鍵交換、Verifiable Credentials。',
    desc_en: 'NIST-standardized ML-KEM (Kyber) hybrid key exchange, Verifiable Credentials.',
    tech: 'ML-KEM (Kyber), DID (Decentralized Identifiers)',
    domains: ['fintech', 'government', 'legal']
  },
  strangler_fig: {
    title_ja: 'Strangler Figパターン(段階的移行)',
    title_en: 'Strangler Fig Pattern (Gradual Migration)',
    desc_ja: 'Nginxでトラフィック分割。レガシー→新システムへ徐々に移行。',
    desc_en: 'Traffic splitting via Nginx. Gradual migration from legacy to new system.',
    tech: 'Nginx split_clients, Canary release',
    domains: ['_all']
  }
};

// Pragmatic Implementation Scenarios (5 high-impact patterns)
const PRAGMATIC_SCENARIOS = {
  disposable_arch: {
    title_ja: '使い捨てアーキテクチャ(PMF前スピード特化)',
    title_en: 'Disposable Architecture (Pre-PMF Speed)',
    desc_ja: 'BaaS極限活用(Supabase RLS)、API開発スキップ。PMF後に再設計。',
    desc_en: 'Extreme BaaS usage (Supabase RLS), Skip API development. Redesign post-PMF.',
    stakeholder: 'startup',
    tech: 'Supabase / Firebase + Next.js (Vercel)'
  },
  ai_hitl: {
    title_ja: 'AI協働型(Human-in-the-loop)',
    title_en: 'AI Collaboration (Human-in-the-loop)',
    desc_ja: 'AI回答を人間が修正→修正データを学習サイクルへ即座に還元。',
    desc_en: 'Humans correct AI responses → Corrections fed back to learning cycle.',
    stakeholder: 'team',
    tech: 'LangChain, Streamlit, Feedback DB'
  },
  small_data_stack: {
    title_ja: 'スモールデータ基盤(中堅企業DX)',
    title_en: 'Small Data Stack (Mid-size Enterprise DX)',
    desc_ja: '高価なデータ基盤不要。dbt+Great Expectationsで品質担保。',
    desc_en: 'No expensive data platform. dbt + Great Expectations for quality.',
    stakeholder: 'enterprise',
    tech: 'Fivetran (Extract) → Snowflake → dbt (Transform)'
  },
  silver_tech: {
    title_ja: 'シルバーテック(高齢者対応)',
    title_en: 'Silver Tech (Elderly-Friendly)',
    desc_ja: '脱パスワード、LINE完結、音声UI優先。日本市場必須対応。',
    desc_en: 'Passwordless, LINE-first, Voice UI priority. Essential for Japanese market.',
    stakeholder: 'team',
    tech: 'FIDO2, LINE Login, Web Speech API'
  },
  dora_platform: {
    title_ja: 'DORA指標+Platform Engineering',
    title_en: 'DORA Metrics + Platform Engineering',
    desc_ja: 'Backstageで"Golden Path"提供。開発者の認知負荷削減。',
    desc_en: 'Backstage provides "Golden Path". Reduce developer cognitive load.',
    stakeholder: 'enterprise',
    tech: 'Backstage, GitHub Actions, DORA metrics dashboard'
  }
};

// Tech Radar Base Data (Adopt/Trial/Assess/Hold)
const TECH_RADAR_BASE = {
  frontend: {
    adopt: ['React 19','Next.js 15','Tailwind CSS','TypeScript','Zod'],
    trial: ['Astro','Qwik','htmx','React Server Components'],
    assess: ['Svelte 5','Solid.js','Web Components'],
    hold: ['jQuery','Angular.js','Backbone.js']
  },
  backend: {
    adopt: ['Node.js 22 LTS','Hono','Fastify','PostgreSQL','Redis'],
    trial: ['Bun','Deno 2','Cloudflare Workers','Edge Runtime','gRPC'],
    assess: ['Rust (Actix/Axum)','Go (Gin/Echo)','Zig','WebAssembly (WASI)'],
    hold: ['PHP 7.x','Python 2.x','MongoDB (as primary DB)']
  },
  infrastructure: {
    adopt: ['Docker','Vercel','Railway','Supabase','Stripe'],
    trial: ['SST (Serverless Stack)','Terraform','Pulumi','Cloudflare Pages','Backstage'],
    assess: ['Kubernetes (for scale)','Fly.io','Render'],
    hold: ['Heroku','AWS Elastic Beanstalk','Self-hosted without automation']
  },
  ai: {
    adopt: ['Claude 4.5/4.6','GPT-4o','Vercel AI SDK','OpenAI SDK'],
    trial: ['Claude Code','Cursor','Anthropic MCP','AI Agents'],
    assess: ['Local LLMs (Ollama)','Fine-tuning','Vector DBs (Pinecone/Weaviate)'],
    hold: ['GPT-3.5 (outdated)','Non-streaming responses','Prompt without streaming']
  },
  mobile: {
    adopt: ['React Native (Expo)','Flutter'],
    trial: ['Kotlin Multiplatform (KMP)','Compose Multiplatform','SwiftUI','Jetpack Compose'],
    assess: ['Tauri v2','visionOS / RealityKit'],
    hold: ['Cordova','Ionic 4','Xamarin']
  }
};

/// Helper: Industry detection (wraps detectDomain - 32 domains)
function detectIndustry(purpose) {
  // Simplified wrapper - detectDomain() now handles all 32 domains
  const d = detectDomain(purpose);
  return d || '_default';
}

// Helper: Detect stakeholder type from target
function detectStakeholder(target) {
  if (!target) return 'team';
  const t = target.toLowerCase();
  if (t.includes('startup') || t.includes('スタートアップ') || t.includes('起業') || t.includes('freelancer') || t.includes('フリーランス')) return 'startup';
  if (t.includes('executive') || t.includes('役員') || t.includes('enterprise') || t.includes('大企業') || t.includes('admin') || t.includes('管理者')) return 'enterprise';
  if (t.includes('engineer') && !t.includes('startup') || t.includes('エンジニア') || t.includes('developer') || t.includes('開発者')) return 'developer';
  return 'team';
}

// Main Generator Function
function genPillar13_StrategicIntelligence(a, pn) {
  const G = S.genLang === 'ja';
  const domain = detectIndustry(a.purpose) || '_default';
  const intel = INDUSTRY_INTEL[domain] || INDUSTRY_INTEL._default;
  const target = a.target || '';
  const stakeholderType = detectStakeholder(target);
  const stakeholder = STAKEHOLDER_STRATEGY[stakeholderType];
  const frontend = a.frontend || 'React + Next.js';
  const backend = a.backend || 'Supabase';
  const database = a.database || 'PostgreSQL';
  const deploy = a.deploy || 'Vercel';

  // ═══ DOC 48: Industry Blueprint ═══
  let doc48 = '';
  doc48 += '# ' + (G ? '業種別設計図: ' : 'Industry Blueprint: ') + (G ? domain : domain) + '\n\n';
  doc48 += '> ' + (G ? 'プロジェクト: ' : 'Project: ') + pn + '\n';
  doc48 += '> ' + (G ? 'ドメイン: ' : 'Domain: ') + domain + '\n';
  doc48 += '> ' + (G ? '生成日: ' : 'Generated: ') + new Date().toISOString().split('T')[0] + '\n\n';

  doc48 += '## ' + (G ? '1. 規制・コンプライアンス要件' : '1. Regulatory & Compliance Requirements') + '\n\n';
  const regs = G ? intel.reg_ja : intel.reg_en;
  regs.forEach(r => doc48 += '- ' + r + '\n');
  doc48 += '\n' + (G ? '**関連ドキュメント:** ' : '**Related Documents:** ') + '[Compliance Matrix](./45_compliance_matrix.md) | [Security Intelligence](./43_security_intelligence.md)\n\n';

  doc48 += '## ' + (G ? '2. 推奨アーキテクチャパターン' : '2. Recommended Architecture Patterns') + '\n\n';
  const archs = G ? intel.arch_ja : intel.arch_en;
  archs.forEach(ar => doc48 += '- **' + ar + '**\n');
  doc48 += '\n### ' + (G ? '現在のスタック適合度' : 'Current Stack Compatibility') + '\n\n';
  doc48 += '| ' + (G ? 'レイヤー' : 'Layer') + ' | ' + (G ? '選択技術' : 'Selected Tech') + ' | ' + (G ? '業種推奨' : 'Industry Rec') + ' | ' + (G ? '適合度' : 'Fit') + ' |\n';
  doc48 += '|---|---|---|---|\n';

  // Frontend compatibility
  const isFrontendGood = frontend.includes('Next.js') || frontend.includes('React') || frontend.includes('Vue');
  doc48 += '| Frontend | ' + frontend + ' | React/Next.js/Vue | ' + (isFrontendGood ? '✅ ' + (G ? '良好' : 'Good') : '⚠️ ' + (G ? '要検討' : 'Review')) + ' |\n';

  // Backend compatibility
  const isBackendGood = backend.includes('Supabase') || backend.includes('Firebase') || backend.includes('Express') || backend.includes('Fastify') || backend.includes('Hono');
  doc48 += '| Backend | ' + backend + ' | BaaS/Node.js | ' + (isBackendGood ? '✅ ' + (G ? '良好' : 'Good') : '⚠️ ' + (G ? '要検討' : 'Review')) + ' |\n';

  // Database compatibility
  const isDbGood = database.includes('PostgreSQL') || database.includes('Supabase') || database.includes('Firebase');
  doc48 += '| Database | ' + database + ' | PostgreSQL/Firebase | ' + (isDbGood ? '✅ ' + (G ? '良好' : 'Good') : '⚠️ ' + (G ? '要検討' : 'Review')) + ' |\n\n';

  doc48 += '## ' + (G ? '3. 失敗要因 Top 3' : '3. Top 3 Failure Factors') + '\n\n';
  const fails = G ? intel.fail_ja : intel.fail_en;
  fails.forEach((f, i) => {
    doc48 += '### ' + (G ? '失敗要因' : 'Failure Factor') + ' ' + (i + 1) + ': ' + f + '\n\n';
    doc48 += (G ? '**回避策:**\n' : '**Mitigation:**\n');
    doc48 += '- [ ] ' + (G ? 'チェックリスト項目を追加' : 'Add checklist item') + '\n';
    doc48 += '- [ ] ' + (G ? 'モニタリング設定' : 'Set up monitoring') + '\n';
    doc48 += '- [ ] ' + (G ? 'テスト戦略に組み込み' : 'Incorporate into test strategy') + '\n\n';
  });

  doc48 += '## ' + (G ? '4. ビジネスモデル比較' : '4. Business Model Comparison') + '\n\n';
  const bms = G ? intel.bm_ja : intel.bm_en;
  doc48 += '| ' + (G ? 'モデル' : 'Model') + ' | ' + (G ? '収益源' : 'Revenue') + ' | ' + (G ? 'ターゲット' : 'Target') + ' |\n';
  doc48 += '|---|---|---|\n';
  bms.forEach(bm => {
    const parts = bm.split('|');
    if (parts.length === 3) {
      doc48 += '| ' + parts[0] + ' | ' + parts[1] + ' | ' + parts[2] + ' |\n';
    }
  });
  doc48 += '\n';

  doc48 += (G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n');
  doc48 += (G ? '**戦略:** ' : '**Strategy:** ');
  doc48 += '[Tech Radar](./49_tech_radar.md), [Stakeholder Strategy](./50_stakeholder_strategy.md), [Market Positioning](./56_market_positioning.md)\n\n';
  doc48 += (G ? '**運用:** ' : '**Operations:** ');
  doc48 += '[Operational Excellence](./51_operational_excellence.md)\n\n';
  doc48 += (G ? '**基盤:** ' : '**Foundation:** ');
  doc48 += '[Architecture](./03_architecture.md), [Business Model](./38_business_model.md)\n';

  S.files['docs/48_industry_blueprint.md'] = doc48;

  // ═══ DOC 49: Tech Radar ═══
  let doc49 = '';
  doc49 += '# ' + (G ? '技術トレンドレーダー 2026-2030' : 'Technology Radar 2026-2030') + '\n\n';
  doc49 += '> ' + (G ? 'プロジェクト: ' : 'Project: ') + pn + '\n';
  doc49 += '> ' + (G ? '基準日: ' : 'As of: ') + new Date().toISOString().split('T')[0] + '\n\n';

  doc49 += '## ' + (G ? '1. 技術分類マトリクス' : '1. Technology Classification Matrix') + '\n\n';

  ['frontend', 'backend', 'infrastructure', 'ai'].forEach(cat => {
    const radar = TECH_RADAR_BASE[cat];
    doc49 += '### ' + cat.charAt(0).toUpperCase() + cat.slice(1) + '\n\n';
    doc49 += '| ' + (G ? 'カテゴリ' : 'Category') + ' | ' + (G ? '技術' : 'Technologies') + ' |\n';
    doc49 += '|---|---|\n';
    doc49 += '| 🟢 **Adopt** ' + (G ? '(即採用)' : '(Adopt Now)') + ' | ' + radar.adopt.join(', ') + ' |\n';
    doc49 += '| 🔵 **Trial** ' + (G ? '(試験導入)' : '(Trial)') + ' | ' + radar.trial.join(', ') + ' |\n';
    doc49 += '| 🟡 **Assess** ' + (G ? '(評価中)' : '(Assess)') + ' | ' + radar.assess.join(', ') + ' |\n';
    doc49 += '| 🔴 **Hold** ' + (G ? '(保留・非推奨)' : '(Hold/Avoid)') + ' | ' + radar.hold.join(', ') + ' |\n\n';
  });

  doc49 += '## ' + (G ? '2. 業種別注目技術(2026-2030)' : '2. Domain-Specific Trends (2026-2030)') + '\n\n';
  const trends = G ? intel.trend_ja : intel.trend_en;
  trends.forEach((tr, i) => {
    doc49 += '### ' + (G ? 'トレンド' : 'Trend') + ' ' + (i + 1) + ': ' + tr + '\n\n';
    doc49 += (G ? '**採用タイムライン:**\n' : '**Adoption Timeline:**\n');
    doc49 += '- ' + (G ? '即時(2026 Q1-Q2): 技術検証・PoC実施' : 'Immediate (2026 Q1-Q2): Tech validation & PoC') + '\n';
    doc49 += '- ' + (G ? '中期(2026 Q3-Q4): パイロット導入' : 'Mid-term (2026 Q3-Q4): Pilot deployment') + '\n';
    doc49 += '- ' + (G ? '長期(2027-2030): 本格展開' : 'Long-term (2027-2030): Full rollout') + '\n\n';
  });

  doc49 += '## ' + (G ? '3. スタック進化ロードマップ' : '3. Stack Evolution Roadmap') + '\n\n';
  doc49 += '```mermaid\n';
  doc49 += 'timeline\n';
  doc49 += '  title ' + (G ? 'スタック進化ロードマップ' : 'Stack Evolution Roadmap') + '\n';
  // Sanitize tech names for timeline (remove colons that break syntax)
  const safeFE = frontend.replace(/:/g, ' -');
  const safeBE = backend.replace(/:/g, ' -');
  const safeDB = database.replace(/:/g, ' -');
  doc49 += '  ' + (G ? '現在(2026 Q1)' : 'Current (2026 Q1)') + ' : ' + safeFE + ' : ' + safeBE + ' : ' + safeDB + '\n';
  doc49 += '  ' + (G ? '6ヶ月後(2026 Q3)' : '6 Months (2026 Q3)') + ' : ' + (G ? 'パフォーマンス最適化' : 'Performance optimization') + ' : ' + (G ? 'AI機能統合' : 'AI feature integration') + '\n';
  doc49 += '  ' + (G ? '1年後(2027 Q1)' : '1 Year (2027 Q1)') + ' : ' + (G ? 'スケーラビリティ強化' : 'Scalability enhancement') + ' : ' + (G ? 'リアルタイム機能拡充' : 'Real-time features expansion') + '\n';
  doc49 += '  ' + (G ? '3年後(2029 Q1)' : '3 Years (2029 Q1)') + ' : ' + (G ? '次世代アーキテクチャ移行' : 'Next-gen architecture migration') + ' : ' + (G ? '完全AI統合' : 'Full AI integration') + '\n';
  doc49 += '```\n\n';

  doc49 += (G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n');
  doc49 += (G ? '**戦略基盤:** ' : '**Strategy Foundation:** ');
  doc49 += '[Industry Blueprint](./48_industry_blueprint.md), [Architecture](./03_architecture.md)\n\n';
  doc49 += (G ? '**実装:** ' : '**Implementation:** ');
  doc49 += '[Implementation Playbook](./39_implementation_playbook.md), [Roadmap](./10_gantt.md)\n\n';
  doc49 += (G ? '**運用:** ' : '**Operations:** ');
  doc49 += '[Operational Excellence](./51_operational_excellence.md)\n';

  S.files['docs/49_tech_radar.md'] = doc49;

  // ═══ DOC 50: Stakeholder Strategy ═══
  let doc50 = '';
  doc50 += '# ' + (G ? 'ステークホルダー別開発戦略: ' : 'Stakeholder Strategy: ') + (G ? stakeholder.name_ja : stakeholder.name_en) + '\n\n';
  doc50 += '> ' + (G ? 'プロジェクト: ' : 'Project: ') + pn + '\n';
  doc50 += '> ' + (G ? 'タイプ: ' : 'Type: ') + stakeholderType + '\n';
  doc50 += '> ' + (G ? '生成日: ' : 'Generated: ') + new Date().toISOString().split('T')[0] + '\n\n';

  doc50 += '## ' + (G ? '1. 開発フェーズ戦略' : '1. Development Phase Strategy') + '\n\n';
  const phases = G ? stakeholder.phases_ja : stakeholder.phases_en;
  phases.forEach((ph, i) => {
    doc50 += '### ' + (G ? 'フェーズ' : 'Phase') + ' ' + (i + 1) + ': ' + ph + '\n\n';
    doc50 += (G ? '**主要タスク:**\n' : '**Key Tasks:**\n');
    doc50 += '- [ ] ' + (G ? 'タスク1' : 'Task 1') + '\n';
    doc50 += '- [ ] ' + (G ? 'タスク2' : 'Task 2') + '\n';
    doc50 += '- [ ] ' + (G ? 'タスク3' : 'Task 3') + '\n\n';
  });

  doc50 += '## ' + (G ? '2. 技術的負債管理戦略' : '2. Technical Debt Management Strategy') + '\n\n';
  doc50 += (G ? stakeholder.tech_debt_ja : stakeholder.tech_debt_en) + '\n\n';
  doc50 += (G ? '**具体的アクション:**\n' : '**Concrete Actions:**\n');
  doc50 += '- [ ] ' + (G ? '負債リストを作成(Issue tracking)' : 'Create debt list (Issue tracking)') + '\n';
  doc50 += '- [ ] ' + (G ? 'SQALE Rating計測ツール導入(SonarQube)' : 'Implement SQALE Rating tool (SonarQube)') + '\n';
  doc50 += '- [ ] ' + (G ? '四半期ごとにリファクタリングSprint実施' : 'Conduct quarterly refactoring sprints') + '\n\n';

  doc50 += '## ' + (G ? '3. チーム構成推奨' : '3. Team Composition Recommendations') + '\n\n';
  doc50 += (G ? stakeholder.team_ja : stakeholder.team_en) + '\n\n';
  doc50 += '```mermaid\n';
  doc50 += 'graph LR\n';
  if (stakeholderType === 'startup') {
    doc50 += '  A[Full-stack 1-2] --> B[Front/Back 3-5]\n';
    doc50 += '  B --> C[Specialized 10+]\n';
  } else if (stakeholderType === 'enterprise') {
    doc50 += '  A[Architect] --> B[Team 1]\n';
    doc50 += '  A --> C[Team 2]\n';
    doc50 += '  A --> D[Platform Eng]\n';
  } else if (stakeholderType === 'developer') {
    doc50 += '  A[Solo] --> B[Duo]\n';
    doc50 += '  B --> C[Small Team 3-5]\n';
  } else {
    doc50 += '  A[Cross-functional 5-9] --> B[Two-Pizza Team]\n';
  }
  doc50 += '```\n\n';

  doc50 += '## ' + (G ? '4. 予算配分ガイド' : '4. Budget Allocation Guide') + '\n\n';
  doc50 += '**' + (G ? '推奨配分:' : 'Recommended allocation:') + '**\n\n';
  doc50 += (G ? stakeholder.budget_ja : stakeholder.budget_en) + '\n\n';

  doc50 += (G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n');
  doc50 += (G ? '**戦略:** ' : '**Strategy:** ');
  doc50 += '[Industry Blueprint](./48_industry_blueprint.md), [Operational Excellence](./51_operational_excellence.md)\n\n';
  doc50 += (G ? '**計画:** ' : '**Planning:** ');
  doc50 += '[Goal Decomposition](./30_goal_decomposition.md), [WBS](./11_wbs.md), [Roadmap](./10_gantt.md)\n\n';
  doc50 += (G ? '**成長:** ' : '**Growth:** ');
  doc50 += '[Growth Intelligence](./41_growth_intelligence.md)\n';

  S.files['docs/50_stakeholder_strategy.md'] = doc50;

  // ═══ DOC 51: Operational Excellence ═══
  let doc51 = '';
  doc51 += '# ' + (G ? '運用卓越性' : 'Operational Excellence') + '\n\n';
  doc51 += '> ' + (G ? 'プロジェクト: ' : 'Project: ') + pn + '\n';
  doc51 += '> ' + (G ? '生成日: ' : 'Generated: ') + new Date().toISOString().split('T')[0] + '\n\n';

  // Tech Debt
  const td = OPERATIONAL_FRAMEWORKS.tech_debt;
  doc51 += '## ' + (G ? '1. 技術的負債管理' : '1. Technical Debt Management') + '\n\n';
  doc51 += '### ' + (G ? td.title_ja : td.title_en) + '\n\n';
  doc51 += (G ? '**4象限分類:**\n' : '**4-Quadrant Classification:**\n');
  const quadrants = G ? td.quadrant_ja : td.quadrant_en;
  quadrants.forEach((q, i) => doc51 += (i + 1) + '. ' + q + '\n');
  doc51 += '\n**SQALE:** ' + (G ? td.sqale_ja : td.sqale_en) + '\n\n';
  doc51 += '**' + (G ? td.rule_ja : td.rule_en) + '**\n\n';

  // DR/BCP
  const dr = OPERATIONAL_FRAMEWORKS.dr_bcp;
  doc51 += '## ' + (G ? '2. 災害復旧・BCP' : '2. Disaster Recovery & BCP') + '\n\n';
  doc51 += '### ' + (G ? dr.title_ja : dr.title_en) + '\n\n';
  doc51 += (G ? dr.rto_rpo_ja : dr.rto_rpo_en) + '\n\n';
  const tiers = G ? dr.tier_ja : dr.tier_en;
  tiers.forEach(t => doc51 += '- ' + t + '\n');
  doc51 += '\n**' + (G ? 'バックアップ戦略:' : 'Backup Strategy:') + '** ' + (G ? dr.backup_ja : dr.backup_en) + '\n\n';
  doc51 += '**' + (G ? 'インシデント対応フロー:' : 'Incident Response Flow:') + '** ' + (G ? dr.incident_ja : dr.incident_en) + '\n\n';

  // Green IT
  const green = OPERATIONAL_FRAMEWORKS.green_it;
  doc51 += '## ' + (G ? '3. Green IT・カーボンニュートラル' : '3. Green IT & Carbon Neutrality') + '\n\n';
  const frameworks = G ? green.framework_ja : green.framework_en;
  frameworks.forEach(f => doc51 += '- ' + f + '\n');
  doc51 += '\n**' + (G ? '計測:' : 'Measurement:') + '** ' + (G ? green.carbon_ja : green.carbon_en) + '\n\n';
  doc51 += '**' + (G ? 'インフラ選択:' : 'Infrastructure:') + '** ' + (G ? green.sla_ja : green.sla_en) + '\n\n';

  // Team Design
  const team = OPERATIONAL_FRAMEWORKS.team_design;
  doc51 += '## ' + (G ? '4. チーム設計・Conway\'s Law対応' : '4. Team Design & Conway\'s Law') + '\n\n';
  doc51 += '**' + (G ? 'Conway\'s Law:' : 'Conway\'s Law:') + '** ' + (G ? team.conway_ja : team.conway_en) + '\n\n';
  doc51 += '**' + (G ? team.two_pizza_ja : team.two_pizza_en) + '**\n\n';
  doc51 += '**DORA Metrics:** ' + (G ? team.dora_ja : team.dora_en) + '\n\n';

  doc51 += (G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n');
  doc51 += (G ? '**戦略:** ' : '**Strategy:** ');
  doc51 += '[Stakeholder Strategy](./50_stakeholder_strategy.md), [Industry Blueprint](./48_industry_blueprint.md)\n\n';
  doc51 += (G ? '**運用実装:** ' : '**Ops Implementation:** ');
  doc51 += '[Ops Runbook](./53_ops_runbook.md), [Ops Checklist](./54_ops_checklist.md)\n\n';
  doc51 += (G ? '**品質:** ' : '**Quality:** ');
  doc51 += '[QA Strategy](./28_qa_strategy.md), [Test Strategy](./36_test_strategy.md), [Incident Response](./34_incident_response.md)\n';

  S.files['docs/51_operational_excellence.md'] = doc51;

  // ═══ DOC 52: Advanced Scenarios ═══
  let doc52 = '';
  doc52 += '# ' + (G ? '先端実装シナリオ集' : 'Advanced Implementation Scenarios') + '\n\n';
  doc52 += '> ' + (G ? 'プロジェクト: ' : 'Project: ') + pn + '\n';
  doc52 += '> ' + (G ? 'ドメイン: ' : 'Domain: ') + domain + '\n';
  doc52 += '> ' + (G ? 'ステークホルダー: ' : 'Stakeholder: ') + stakeholderType + '\n';
  doc52 += '> ' + (G ? '生成日: ' : 'Generated: ') + new Date().toISOString().split('T')[0] + '\n\n';

  doc52 += '## ' + (G ? '1. 拡張運用フレームワーク' : '1. Extended Operational Frameworks') + '\n\n';

  // AI Ethics
  const ai_eth = OPERATIONAL_FRAMEWORKS_EXT.ai_ethics;
  doc52 += '### ' + (G ? ai_eth.title_ja : ai_eth.title_en) + '\n\n';
  doc52 += (G ? '**5原則:** ' : '**5 Principles:** ');
  const principles = G ? ai_eth.principles_ja : ai_eth.principles_en;
  doc52 += principles.join(', ') + '\n\n';
  doc52 += (G ? '**実装:** ' : '**Implementation:** ') + (G ? ai_eth.impl_ja : ai_eth.impl_en) + '\n\n';
  doc52 += (G ? '**コンプライアンス:** ' : '**Compliance:** ') + (G ? ai_eth.compliance_ja : ai_eth.compliance_en) + '\n\n';

  // Zero Trust
  const zt = OPERATIONAL_FRAMEWORKS_EXT.zero_trust;
  doc52 += '### ' + (G ? zt.title_ja : zt.title_en) + '\n\n';
  doc52 += (G ? '**原則:** ' : '**Principles:** ') + (G ? zt.principles_ja : zt.principles_en) + '\n\n';
  doc52 += (G ? '**実装:** ' : '**Implementation:** ') + (G ? zt.impl_ja : zt.impl_en) + '\n\n';
  doc52 += (G ? '**BeyondCorp:** ' : '**BeyondCorp:** ') + (G ? zt.beyondcorp_ja : zt.beyondcorp_en) + '\n\n';

  // Data Governance
  const dg = OPERATIONAL_FRAMEWORKS_EXT.data_governance;
  doc52 += '### ' + (G ? dg.title_ja : dg.title_en) + '\n\n';
  doc52 += (G ? '**要素:** ' : '**Elements:** ');
  const elements = G ? dg.elements_ja : dg.elements_en;
  doc52 += elements.join(', ') + '\n\n';
  doc52 += (G ? '**スタック:** ' : '**Stack:** ') + (G ? dg.stack_ja : dg.stack_en) + '\n\n';
  doc52 += (G ? '**データメッシュ:** ' : '**Data Mesh:** ') + (G ? dg.mesh_ja : dg.mesh_en) + '\n\n';

  // Globalization
  const glob = OPERATIONAL_FRAMEWORKS_EXT.globalization;
  doc52 += '### ' + (G ? glob.title_ja : glob.title_en) + '\n\n';
  doc52 += (G ? '**i18n:** ' : '**i18n:** ') + (G ? glob.i18n_ja : glob.i18n_en) + '\n\n';
  doc52 += (G ? '**l10n:** ' : '**l10n:** ') + (G ? glob.l10n_ja : glob.l10n_en) + '\n\n';
  doc52 += (G ? '**インフラ:** ' : '**Infrastructure:** ') + (G ? glob.infra_ja : glob.infra_en) + '\n\n';

  doc52 += '## ' + (G ? '2. 極限実装シナリオ' : '2. Extreme Implementation Scenarios') + '\n\n';
  doc52 += (G ? '**対象:** このドメインに関連する先端実装パターン\n\n' : '**Scope:** Advanced patterns relevant to this domain\n\n');

  // Filter extreme scenarios by domain
  Object.keys(EXTREME_SCENARIOS).forEach(key => {
    const sc = EXTREME_SCENARIOS[key];
    if (sc.domains.includes('_all') || sc.domains.includes(domain)) {
      doc52 += '### ' + (G ? sc.title_ja : sc.title_en) + '\n\n';
      doc52 += (G ? sc.desc_ja : sc.desc_en) + '\n\n';
      doc52 += '**' + (G ? '技術:' : 'Technology:') + '** ' + sc.tech + '\n\n';
    }
  });

  doc52 += '## ' + (G ? '3. 実利シナリオ' : '3. Pragmatic Scenarios') + '\n\n';
  doc52 += (G ? '**対象:** このステークホルダータイプに推奨される高効率パターン\n\n' : '**Scope:** High-impact patterns for this stakeholder type\n\n');

  // Filter pragmatic scenarios by stakeholder
  Object.keys(PRAGMATIC_SCENARIOS).forEach(key => {
    const sc = PRAGMATIC_SCENARIOS[key];
    if (sc.stakeholder === stakeholderType || sc.stakeholder === 'team') {
      doc52 += '### ' + (G ? sc.title_ja : sc.title_en) + '\n\n';
      doc52 += (G ? sc.desc_ja : sc.desc_en) + '\n\n';
      doc52 += '**' + (G ? '技術:' : 'Technology:') + '** ' + sc.tech + '\n\n';
    }
  });

  doc52 += (G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n');
  doc52 += '- [Industry Blueprint](./48_industry_blueprint.md)\n';
  doc52 += '- [Tech Radar](./49_tech_radar.md)\n';
  doc52 += '- [Stakeholder Strategy](./50_stakeholder_strategy.md)\n';
  doc52 += '- [Operational Excellence](./51_operational_excellence.md)\n';
  doc52 += '- [Security Intelligence](./43_security_intelligence.md)\n';
  doc52 += '- [Compliance Matrix](./45_compliance_matrix.md)\n';

  S.files['docs/52_advanced_scenarios.md'] = doc52;
}
