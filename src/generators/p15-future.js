// P15: Future Strategy Intelligence Generator
// Generates: docs/56_market_positioning.md, 57_user_experience_strategy.md, 58_ecosystem_strategy.md, 59_regulatory_foresight.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

// DOMAIN_MARKET: Market positioning & strategy data (24 domains + default)
const DOMAIN_MARKET = {
  education: {
    moat_ja: 'ネットワーク効果（学習コミュニティ）、データモート（学習分析）',
    moat_en: 'Network effects (learning community), Data moat (learning analytics)',
    gtm_ja: 'PLG（フリーミアム）+ 学校向けエンタープライズSLG',
    gtm_en: 'PLG (freemium) + Enterprise SLG for schools',
    ux_ja: 'ゲーミフィケーション、ストリーク維持、修了証、ソーシャル学習',
    ux_en: 'Gamification, streak maintenance, certificates, social learning',
    eco_ja: 'LTI統合、SSO（学校アカウント）、教材マーケットプレイス',
    eco_en: 'LTI integration, SSO (school accounts), content marketplace',
    reg_ja: 'FERPA（米）、COPPA（児童）、EU教育データ保護、日本個人情報保護法',
    reg_en: 'FERPA (US), COPPA (children), EU education data protection, Japan APPI',
    esg_ja: 'デジタル格差解消、アクセシビリティ、オープン教材',
    esg_en: 'Digital divide reduction, accessibility, open educational resources'
  },
  ec: {
    moat_ja: 'データモート（購買行動）、スイッチングコスト（ウィッシュリスト）',
    moat_en: 'Data moat (purchase behavior), Switching costs (wishlists)',
    gtm_ja: 'マーケットプレイス型PLG + SEO/SNS広告',
    gtm_en: 'Marketplace PLG + SEO/social ads',
    ux_ja: 'ウィッシュリスト、レコメンド、ワンクリック決済、リピート購入割引',
    ux_en: 'Wishlists, recommendations, one-click checkout, repeat discounts',
    eco_ja: '配送API統合、決済プロバイダ、在庫管理SaaS連携',
    eco_en: 'Shipping API integration, payment providers, inventory SaaS',
    reg_ja: '特定商取引法、割賦販売法、EU消費者保護指令、PSD2',
    reg_en: 'E-commerce regulations, consumer protection, PSD2 (EU)',
    esg_ja: 'サステナブル配送、返品削減、カーボンニュートラル配送オプション',
    esg_en: 'Sustainable shipping, return reduction, carbon-neutral delivery'
  },
  fintech: {
    moat_ja: 'ブランド信頼（セキュリティ実績）、規制参入障壁',
    moat_en: 'Brand trust (security track record), regulatory barriers',
    gtm_ja: 'エンタープライズSLG、規制準拠先行',
    gtm_en: 'Enterprise SLG, compliance-first approach',
    ux_ja: 'セキュリティ透明性、リアルタイム通知、簡潔な取引履歴',
    ux_en: 'Security transparency, real-time alerts, clear transaction history',
    eco_ja: 'Banking API（Open Banking）、会計ソフト連携、KYC/AMLサービス',
    eco_en: 'Banking APIs (Open Banking), accounting software, KYC/AML services',
    reg_ja: '金融商品取引法、資金決済法、PSD2、EU AI Act高リスク、DORA',
    reg_en: 'Financial regulations, PSD2, EU AI Act high-risk, DORA',
    esg_ja: '金融包摂、責任ある融資、カーボンフットプリント開示',
    esg_en: 'Financial inclusion, responsible lending, carbon disclosure'
  },
  health: {
    moat_ja: 'データモート（健康記録）、規制参入障壁、信頼ブランド',
    moat_en: 'Data moat (health records), regulatory barriers, trust brand',
    gtm_ja: 'B2B2C（医療機関経由）、規制準拠先行',
    gtm_en: 'B2B2C (via healthcare providers), compliance-first',
    ux_ja: 'プライバシー透明性、アクセシビリティ、多言語対応',
    ux_en: 'Privacy transparency, accessibility, multilingual support',
    eco_ja: 'EHR統合（HL7 FHIR）、遠隔診療API、医療機器連携',
    eco_en: 'EHR integration (HL7 FHIR), telemedicine APIs, device connectivity',
    reg_ja: 'HIPAA（米）、医療法、EU AI Act高リスク、MDR/IVDR、GDPR特別カテゴリ',
    reg_en: 'HIPAA (US), medical device regulations, EU AI Act high-risk, GDPR special categories',
    esg_ja: '健康格差解消、アクセシビリティ、医療データ倫理',
    esg_en: 'Health equity, accessibility, medical data ethics'
  },
  saas: {
    moat_ja: 'スイッチングコスト（データロックイン）、ネットワーク効果（マルチテナント）',
    moat_en: 'Switching costs (data lock-in), Network effects (multi-tenant)',
    gtm_ja: 'PLG（フリートライアル）+ エンタープライズSLG',
    gtm_en: 'PLG (free trial) + Enterprise SLG',
    ux_ja: 'セルフサービスオンボード、プログレッシブディスクロージャー、使用量可視化',
    ux_en: 'Self-service onboarding, progressive disclosure, usage visibility',
    eco_ja: 'SSO/SCIM統合、API公開、Webhooks、マーケットプレイス（Salesforce/Slack）',
    eco_en: 'SSO/SCIM integration, public APIs, webhooks, marketplace (Salesforce/Slack)',
    reg_ja: 'GDPR、SOC2、ISO27001、各国データローカライゼーション',
    reg_en: 'GDPR, SOC2, ISO27001, data localization laws',
    esg_ja: 'クラウドカーボン最適化、リモートワーク支援、デジタルウェルビーイング',
    esg_en: 'Cloud carbon optimization, remote work enablement, digital wellbeing'
  },
  marketplace: {
    moat_ja: 'ネットワーク効果（両面市場）、データモート（マッチング精度）',
    moat_en: 'Network effects (two-sided market), Data moat (matching accuracy)',
    gtm_ja: '供給側先行獲得 → 需要側獲得、地域集中戦略',
    gtm_en: 'Supply-side acquisition first, geographic clustering',
    ux_ja: '信頼シグナル（レビュー・認証）、摩擦低減（即時マッチング）',
    ux_en: 'Trust signals (reviews, verification), friction reduction (instant matching)',
    eco_ja: '決済エスクロー、ID検証API、保険パートナー、配送統合',
    eco_en: 'Payment escrow, ID verification APIs, insurance partners, shipping integration',
    reg_ja: 'プラットフォーム責任法、DMA（EU）、DSA（EU）、独禁法',
    reg_en: 'Platform liability, DMA (EU), DSA (EU), antitrust laws',
    esg_ja: 'ギグワーカー保護、透明な手数料、地域経済活性化',
    esg_en: 'Gig worker protection, transparent fees, local economy support'
  },
  community: {
    moat_ja: 'ネットワーク効果（強）、スイッチングコスト（ソーシャルグラフ）',
    moat_en: 'Strong network effects, Switching costs (social graph)',
    gtm_ja: 'バイラルPLG、インフルエンサー活用、ニッチコミュニティ先行',
    gtm_en: 'Viral PLG, influencer activation, niche community first',
    ux_ja: 'デイリーエンゲージメントフック、UGC推奨、モデレーション品質',
    ux_en: 'Daily engagement hooks, UGC promotion, moderation quality',
    eco_ja: 'OAuth統合、通知API、UGCモデレーションAI、広告ネットワーク',
    eco_en: 'OAuth integration, notification APIs, UGC moderation AI, ad networks',
    reg_ja: 'DSA（EU）、COPPA（児童）、名誉毀損法、EU AI Act（コンテンツ推薦）',
    reg_en: 'DSA (EU), COPPA (children), defamation laws, EU AI Act (content recommendation)',
    esg_ja: 'デジタルウェルビーイング、ヘイトスピーチ対策、児童保護',
    esg_en: 'Digital wellbeing, hate speech prevention, child protection'
  },
  content: {
    moat_ja: 'ブランド信頼、コンテンツライブラリ、ネットワーク効果（購読者）',
    moat_en: 'Brand trust, content library, Network effects (subscribers)',
    gtm_ja: 'コンテンツSEO、ニュースレター、フリーミアム',
    gtm_en: 'Content SEO, newsletters, freemium model',
    ux_ja: 'パーソナライゼーション、読書進捗、オフラインアクセス',
    ux_en: 'Personalization, reading progress, offline access',
    eco_ja: 'CMS統合、CDN、広告ネットワーク、サブスクリプション決済',
    eco_en: 'CMS integration, CDN, ad networks, subscription payments',
    reg_ja: '著作権法、DSA（EU）、プライバシー（Cookie同意）',
    reg_en: 'Copyright laws, DSA (EU), privacy (cookie consent)',
    esg_ja: 'ジャーナリズム倫理、アクセシビリティ、ファクトチェック',
    esg_en: 'Journalism ethics, accessibility, fact-checking'
  },
  booking: {
    moat_ja: '在庫独占契約、データモート（需要予測）、ブランド信頼',
    moat_en: 'Exclusive inventory, Data moat (demand forecasting), Brand trust',
    gtm_ja: 'SEO（予約キーワード）、メタサーチ統合、提携先拡大',
    gtm_en: 'SEO (booking keywords), metasearch integration, partner expansion',
    ux_ja: 'リアルタイム在庫、価格比較、柔軟キャンセルポリシー',
    ux_en: 'Real-time availability, price comparison, flexible cancellation',
    eco_ja: 'GDS統合（旅行）、カレンダー同期、決済・エスクロー',
    eco_en: 'GDS integration (travel), calendar sync, payment/escrow',
    reg_ja: '旅行業法、消費者保護法、EU Package Travel Directive',
    reg_en: 'Travel industry regulations, consumer protection, EU Package Travel Directive',
    esg_ja: 'サステナブルツーリズム、カーボンオフセット、地域経済支援',
    esg_en: 'Sustainable tourism, carbon offset, local economy support'
  },
  iot: {
    moat_ja: '技術モート（デバイス統合）、データモート（センサーデータ）',
    moat_en: 'Technology moat (device integration), Data moat (sensor data)',
    gtm_ja: 'B2B（デバイスメーカー提携）、垂直統合戦略',
    gtm_en: 'B2B (device manufacturer partnerships), vertical integration',
    ux_ja: 'デバイス自動検出、ゼロタッチプロビジョニング、リアルタイムダッシュボード',
    ux_en: 'Auto device discovery, zero-touch provisioning, real-time dashboards',
    eco_ja: 'デバイスSDK、MQTT/CoAP、クラウドプロバイダIoTサービス',
    eco_en: 'Device SDKs, MQTT/CoAP, cloud provider IoT services',
    reg_ja: 'サイバーセキュリティ法、EU Cyber Resilience Act、電波法',
    reg_en: 'Cybersecurity laws, EU Cyber Resilience Act, radio regulations',
    esg_ja: 'デバイス長寿命化、電力効率、e-waste削減',
    esg_en: 'Device longevity, power efficiency, e-waste reduction'
  },
  realestate: {
    moat_ja: '在庫独占（物件データ）、ブランド信頼、地域ネットワーク',
    moat_en: 'Exclusive inventory (property data), Brand trust, local networks',
    gtm_ja: 'SEO（地域検索）、不動産会社提携、オフライン連携',
    gtm_en: 'SEO (local search), realtor partnerships, offline integration',
    ux_ja: 'VRツアー、AIマッチング、モバイルファースト',
    ux_en: 'VR tours, AI matching, mobile-first',
    eco_ja: 'MLS統合、住宅ローンAPI、スマートホーム連携',
    eco_en: 'MLS integration, mortgage APIs, smart home connectivity',
    reg_ja: '宅建業法、不動産登記法、Fair Housing Act（米）',
    reg_en: 'Real estate licensing, property registration, Fair Housing Act (US)',
    esg_ja: 'エネルギー効率開示、グリーンビルディング認証',
    esg_en: 'Energy efficiency disclosure, green building certifications'
  },
  legal: {
    moat_ja: 'ブランド信頼（機密性）、規制参入障壁、データモート（判例）',
    moat_en: 'Brand trust (confidentiality), regulatory barriers, Data moat (case law)',
    gtm_ja: 'エンタープライズSLG、弁護士会提携、垂直特化',
    gtm_en: 'Enterprise SLG, bar association partnerships, vertical specialization',
    ux_ja: 'セキュリティ透明性、文書バージョニング、電子署名',
    ux_en: 'Security transparency, document versioning, e-signatures',
    eco_ja: '電子署名API、裁判所ファイリングシステム、リーガルリサーチDB',
    eco_en: 'E-signature APIs, court filing systems, legal research databases',
    reg_ja: '弁護士法、EU AI Act高リスク（司法）、電子署名法',
    reg_en: 'Legal practice regulations, EU AI Act high-risk (judiciary), e-signature laws',
    esg_ja: '司法アクセス向上、プロボノ支援、透明な料金',
    esg_en: 'Access to justice, pro bono support, transparent pricing'
  },
  hr: {
    moat_ja: 'データモート（人材マッチング）、スイッチングコスト（統合HCM）',
    moat_en: 'Data moat (talent matching), Switching costs (integrated HCM)',
    gtm_ja: 'PLG（小規模）+ エンタープライズSLG、HR Tech展示会',
    gtm_en: 'PLG (SMB) + Enterprise SLG, HR Tech conferences',
    ux_ja: 'セルフサービスESS、モバイルファースト、多言語対応',
    ux_en: 'Self-service ESS, mobile-first, multilingual support',
    eco_ja: 'HRIS統合、給与計算API、バックグラウンドチェック、SSO/SCIM',
    eco_en: 'HRIS integration, payroll APIs, background checks, SSO/SCIM',
    reg_ja: '労働法、GDPR（従業員データ）、EU AI Act高リスク（採用AI）',
    reg_en: 'Labor laws, GDPR (employee data), EU AI Act high-risk (recruitment AI)',
    esg_ja: 'DEI指標、賃金透明性、従業員ウェルビーイング',
    esg_en: 'DEI metrics, pay transparency, employee wellbeing'
  },
  analytics: {
    moat_ja: 'データモート（蓄積データ）、スイッチングコスト（ダッシュボード依存）',
    moat_en: 'Data moat (accumulated data), Switching costs (dashboard dependency)',
    gtm_ja: 'PLG（無料枠）、データエンジニアコミュニティ、CLG',
    gtm_en: 'PLG (free tier), data engineer community, CLG',
    ux_ja: 'ノーコードダッシュボード、リアルタイムアラート、共有可能レポート',
    ux_en: 'No-code dashboards, real-time alerts, shareable reports',
    eco_ja: 'データソース統合（50+）、BI tool連携、Reverse ETL',
    eco_en: 'Data source integrations (50+), BI tool connectivity, Reverse ETL',
    reg_ja: 'GDPR（分析データ）、CCPA、Cookie同意',
    reg_en: 'GDPR (analytics data), CCPA, cookie consent',
    esg_ja: 'データ倫理、透明なアルゴリズム、プライバシー保護分析',
    esg_en: 'Data ethics, transparent algorithms, privacy-preserving analytics'
  },
  portfolio: {
    moat_ja: 'ブランド信頼（実績）、ネットワーク効果（テンプレート共有）',
    moat_en: 'Brand trust (track record), Network effects (template sharing)',
    gtm_ja: 'フリーミアム、コンテンツマーケティング、SEO',
    gtm_en: 'Freemium, content marketing, SEO',
    ux_ja: 'テンプレート選択、ドラッグ&ドロップ、カスタムドメイン',
    ux_en: 'Template selection, drag & drop, custom domains',
    eco_ja: 'CMS統合、CDN、SNS連携、Analytics統合',
    eco_en: 'CMS integration, CDN, social media connectivity, analytics',
    reg_ja: 'GDPR（訪問者データ）、著作権、アクセシビリティ法',
    reg_en: 'GDPR (visitor data), copyright, accessibility laws',
    esg_ja: 'アクセシビリティ標準、カーボン効率（ホスティング）',
    esg_en: 'Accessibility standards, carbon-efficient hosting'
  },
  tool: {
    moat_ja: 'ネットワーク効果（プラグインエコシステム）、技術モート',
    moat_en: 'Network effects (plugin ecosystem), Technology moat',
    gtm_ja: '開発者PLG、GitHub/VSCode Marketplace、CLG',
    gtm_en: 'Developer PLG, GitHub/VSCode Marketplace, CLG',
    ux_ja: 'CLI優先、ドキュメント充実、クイックスタート',
    ux_en: 'CLI-first, comprehensive docs, quick start guides',
    eco_ja: 'プラグインAPI、CI/CD統合、Language Server Protocol',
    eco_en: 'Plugin APIs, CI/CD integration, Language Server Protocol',
    reg_ja: 'オープンソースライセンス、GDPR（テレメトリ）',
    reg_en: 'Open source licenses, GDPR (telemetry)',
    esg_ja: 'オープンソース貢献、開発者教育、アクセシビリティ',
    esg_en: 'Open source contribution, developer education, accessibility'
  },
  ai: {
    moat_ja: 'データモート（トレーニングデータ）、技術モート（モデル）、規制参入障壁',
    moat_en: 'Data moat (training data), Technology moat (models), Regulatory barriers',
    gtm_ja: 'API-first PLG、開発者コミュニティ、垂直特化',
    gtm_en: 'API-first PLG, developer community, vertical specialization',
    ux_ja: 'プロンプトガイド、レート制限可視化、モデル選択UI',
    ux_en: 'Prompt guides, rate limit visibility, model selection UI',
    eco_ja: 'モデルプロバイダAPI、Vector DB、MLOpsツール統合',
    eco_en: 'Model provider APIs, Vector DBs, MLOps tool integration',
    reg_ja: 'EU AI Act、著作権（生成AI）、透明性義務、日本AI原則',
    reg_en: 'EU AI Act, copyright (generative AI), transparency obligations, Japan AI principles',
    esg_ja: 'AIカーボンフットプリント、バイアス監査、説明可能性',
    esg_en: 'AI carbon footprint, bias auditing, explainability'
  },
  automation: {
    moat_ja: 'ネットワーク効果（統合数）、スイッチングコスト（ワークフロー依存）',
    moat_en: 'Network effects (integration count), Switching costs (workflow dependency)',
    gtm_ja: 'PLG（テンプレート）、統合マーケットプレイス',
    gtm_en: 'PLG (templates), integration marketplace',
    ux_ja: 'ノーコードビルダー、テンプレートライブラリ、エラーハンドリング可視化',
    ux_en: 'No-code builder, template library, error handling visibility',
    eco_ja: '1000+統合、Webhooks、API公開、RPA連携',
    eco_en: '1000+ integrations, webhooks, public APIs, RPA connectivity',
    reg_ja: 'GDPR（データ処理）、各種業界規制（金融・医療）',
    reg_en: 'GDPR (data processing), industry-specific regulations (finance, health)',
    esg_ja: '業務効率化（CO2削減）、デジタルスキル向上',
    esg_en: 'Operational efficiency (CO2 reduction), digital skill enhancement'
  },
  event: {
    moat_ja: 'ネットワーク効果（参加者）、データモート（イベントデータ）',
    moat_en: 'Network effects (attendees), Data moat (event data)',
    gtm_ja: 'フリーミアム、イベント主催者コミュニティ、提携',
    gtm_en: 'Freemium, event organizer community, partnerships',
    ux_ja: 'モバイルチケット、ネットワーキング機能、ハイブリッドイベント対応',
    ux_en: 'Mobile ticketing, networking features, hybrid event support',
    eco_ja: '決済統合、CRM連携、ストリーミングAPI、カレンダー同期',
    eco_en: 'Payment integration, CRM connectivity, streaming APIs, calendar sync',
    reg_ja: 'チケット販売規制、GDPR、アクセシビリティ法',
    reg_en: 'Ticket sales regulations, GDPR, accessibility laws',
    esg_ja: 'バーチャル参加オプション、カーボンオフセット、インクルーシブデザイン',
    esg_en: 'Virtual attendance options, carbon offset, inclusive design'
  },
  gamify: {
    moat_ja: 'ネットワーク効果（マルチプレイヤー）、データモート（プレイヤー行動）',
    moat_en: 'Network effects (multiplayer), Data moat (player behavior)',
    gtm_ja: 'フリーミアム、バイラル拡散、インフルエンサー',
    gtm_en: 'Freemium, viral spread, influencer marketing',
    ux_ja: 'オンボーディングチュートリアル、進捗可視化、ソーシャル共有',
    ux_en: 'Onboarding tutorial, progress visualization, social sharing',
    eco_ja: '決済統合（IAP）、ゲームエンジン統合、広告ネットワーク',
    eco_en: 'Payment integration (IAP), game engine integration, ad networks',
    reg_ja: 'COPPA（児童）、ガチャ規制、GDPR、各国ゲーム規制',
    reg_en: 'COPPA (children), loot box regulations, GDPR, gaming regulations',
    esg_ja: 'デジタルウェルビーイング、健全なコミュニティ、依存症対策',
    esg_en: 'Digital wellbeing, healthy community, addiction prevention'
  },
  collab: {
    moat_ja: 'ネットワーク効果（チーム）、スイッチングコスト（共同作業データ）',
    moat_en: 'Network effects (teams), Switching costs (collaborative data)',
    gtm_ja: 'PLG（個人）→ チーム拡大 → エンタープライズ',
    gtm_en: 'PLG (individual) → team expansion → enterprise',
    ux_ja: 'リアルタイム同期、コメント・メンション、バージョン履歴',
    ux_en: 'Real-time sync, comments/mentions, version history',
    eco_ja: 'SSO/SCIM、Slack/Teams統合、ファイルストレージ連携',
    eco_en: 'SSO/SCIM, Slack/Teams integration, file storage connectivity',
    reg_ja: 'GDPR、SOC2、各国データローカライゼーション',
    reg_en: 'GDPR, SOC2, data localization laws',
    esg_ja: 'リモートワーク促進、アクセシビリティ、デジタルウェルビーイング',
    esg_en: 'Remote work enablement, accessibility, digital wellbeing'
  },
  devtool: {
    moat_ja: 'ネットワーク効果（エコシステム）、技術モート、開発者ロイヤルティ',
    moat_en: 'Network effects (ecosystem), Technology moat, developer loyalty',
    gtm_ja: '開発者PLG、GitHub/ドキュメント、CLG',
    gtm_en: 'Developer PLG, GitHub/docs, CLG',
    ux_ja: 'CLI優先、豊富なドキュメント、活発なコミュニティ',
    ux_en: 'CLI-first, comprehensive docs, active community',
    eco_ja: 'CI/CD統合、IDE拡張、Language Server、パッケージマネージャ',
    eco_en: 'CI/CD integration, IDE extensions, Language Server, package managers',
    reg_ja: 'オープンソースライセンス、GDPR（テレメトリ）',
    reg_en: 'Open source licenses, GDPR (telemetry)',
    esg_ja: 'オープンソース貢献、開発者教育、インクルーシブコミュニティ',
    esg_en: 'Open source contribution, developer education, inclusive community'
  },
  creator: {
    moat_ja: 'ネットワーク効果（クリエイター×ファン）、データモート（オーディエンス分析）',
    moat_en: 'Network effects (creator × fans), Data moat (audience analytics)',
    gtm_ja: 'クリエイターPLG、インフルエンサー先行獲得',
    gtm_en: 'Creator PLG, influencer early acquisition',
    ux_ja: 'コンテンツスケジューラ、収益ダッシュボード、ファンエンゲージメントツール',
    ux_en: 'Content scheduler, revenue dashboard, fan engagement tools',
    eco_ja: '決済統合、SNS連携、Email/SMS API、ストリーミング統合',
    eco_en: 'Payment integration, social media connectivity, email/SMS APIs, streaming',
    reg_ja: 'GDPR、著作権、決済規制、各国税法',
    reg_en: 'GDPR, copyright, payment regulations, tax laws',
    esg_ja: 'クリエイター公正報酬、コンテンツモデレーション、透明な手数料',
    esg_en: 'Fair creator compensation, content moderation, transparent fees'
  },
  newsletter: {
    moat_ja: 'データモート（購読者）、ブランド信頼、スイッチングコスト（メールリスト）',
    moat_en: 'Data moat (subscribers), Brand trust, Switching costs (email list)',
    gtm_ja: 'コンテンツSEO、紹介プログラム、フリーミアム',
    gtm_en: 'Content SEO, referral programs, freemium',
    ux_ja: 'パーソナライゼーション、配信時間最適化、読了率可視化',
    ux_en: 'Personalization, send time optimization, read rate visibility',
    eco_ja: 'Email API、CMS統合、決済統合、広告ネットワーク',
    eco_en: 'Email APIs, CMS integration, payment integration, ad networks',
    reg_ja: 'CAN-SPAM（米）、GDPR、ePrivacy指令',
    reg_en: 'CAN-SPAM (US), GDPR, ePrivacy Directive',
    esg_ja: 'スパム対策、アクセシビリティ（HTML Email）、購読管理透明性',
    esg_en: 'Anti-spam, accessibility (HTML email), subscription transparency'
  },
  _default: {
    moat_ja: 'ネットワーク効果、データモート、スイッチングコスト、ブランド信頼、技術モート',
    moat_en: 'Network effects, Data moat, Switching costs, Brand trust, Technology moat',
    gtm_ja: 'PLG（プロダクト主導成長）+ SLG（営業主導）ハイブリッド',
    gtm_en: 'PLG (Product-Led Growth) + SLG (Sales-Led) hybrid',
    ux_ja: 'セルフサービスオンボード、プログレッシブディスクロージャー、リテンションフック',
    ux_en: 'Self-service onboarding, progressive disclosure, retention hooks',
    eco_ja: 'API公開、主要SaaS統合、マーケットプレイス戦略',
    eco_en: 'Public APIs, major SaaS integrations, marketplace strategy',
    reg_ja: 'GDPR、各国データ保護法、業界固有規制',
    reg_en: 'GDPR, data protection laws, industry-specific regulations',
    esg_ja: 'カーボンフットプリント最適化、アクセシビリティ、デジタル倫理',
    esg_en: 'Carbon footprint optimization, accessibility, digital ethics'
  }
};

// PERSONA_ARCHETYPES: 24 domains × 3 personas (primary/secondary/edge)
const PERSONA_ARCHETYPES = {
  education: {
    primary_ja: '大学生（18-24歳、スキル習得、キャリア準備）',
    primary_en: 'University student (18-24, skill acquisition, career prep)',
    secondary_ja: '社会人学習者（25-45歳、リスキリング、時間制約）',
    secondary_en: 'Working professional (25-45, reskilling, time-constrained)',
    edge_ja: '教育機関管理者（LMS導入、ROI評価、コンプライアンス）',
    edge_en: 'Educational admin (LMS adoption, ROI assessment, compliance)'
  },
  ec: {
    primary_ja: 'オンライン買い物客（25-45歳、利便性重視、モバイル）',
    primary_en: 'Online shopper (25-45, convenience-focused, mobile)',
    secondary_ja: '比較検討型購入者（価格・レビュー重視、デスクトップ）',
    secondary_en: 'Research-driven buyer (price/review-focused, desktop)',
    edge_ja: 'ギフト購入者（時間制約、ラッピング・配送重視）',
    edge_en: 'Gift buyer (time-constrained, gift wrap/shipping-focused)'
  },
  fintech: {
    primary_ja: 'スモールビジネスオーナー（30-50歳、財務管理、時間効率）',
    primary_en: 'Small business owner (30-50, financial management, time efficiency)',
    secondary_ja: '個人投資家（25-40歳、リスク管理、リアルタイムデータ）',
    secondary_en: 'Individual investor (25-40, risk management, real-time data)',
    edge_ja: 'CFO/経理担当（コンプライアンス、監査証跡、統合）',
    edge_en: 'CFO/Accountant (compliance, audit trail, integration)'
  },
  health: {
    primary_ja: '患者（慢性疾患管理、服薬遵守、医師コミュニケーション）',
    primary_en: 'Patient (chronic disease mgmt, medication adherence, doctor comms)',
    secondary_ja: '医療提供者（効率化、EHR統合、リモートモニタリング）',
    secondary_en: 'Healthcare provider (efficiency, EHR integration, remote monitoring)',
    edge_ja: '高齢者（アクセシビリティ、シンプルUI、介護者連携）',
    edge_en: 'Elderly patient (accessibility, simple UI, caregiver coordination)'
  },
  saas: {
    primary_ja: 'チームリード（5-20人、生産性向上、予算管理）',
    primary_en: 'Team lead (5-20 people, productivity boost, budget management)',
    secondary_ja: 'エンドユーザー（日常業務、使いやすさ、学習コスト低）',
    secondary_en: 'End user (daily tasks, ease of use, low learning curve)',
    edge_ja: 'IT管理者（セキュリティ、SSO/SCIM、API統合）',
    edge_en: 'IT admin (security, SSO/SCIM, API integration)'
  },
  marketplace: {
    primary_ja: 'サービス提供者（収益最大化、評価管理、集客）',
    primary_en: 'Service provider (revenue maximization, rating mgmt, customer acquisition)',
    secondary_ja: '顧客（信頼性、価格比較、レビュー）',
    secondary_en: 'Customer (trust, price comparison, reviews)',
    edge_ja: 'プラットフォーム運営者（不正防止、品質管理、手数料最適化）',
    edge_en: 'Platform operator (fraud prevention, quality control, fee optimization)'
  },
  community: {
    primary_ja: 'アクティブメンバー（毎日投稿、コミュニティ貢献、評価）',
    primary_en: 'Active member (daily posts, community contribution, reputation)',
    secondary_ja: 'ラーカー（情報収集、投稿少、モバイル）',
    secondary_en: 'Lurker (info gathering, low posting, mobile)',
    edge_ja: 'モデレーター（コミュニティ健全性、ルール執行、紛争解決）',
    edge_en: 'Moderator (community health, rule enforcement, dispute resolution)'
  },
  content: {
    primary_ja: '定期読者（25-45歳、トピック追跡、ニュースレター購読）',
    primary_en: 'Regular reader (25-45, topic tracking, newsletter subscription)',
    secondary_ja: 'SNS流入者（バイラル記事、スキミング、モバイル）',
    secondary_en: 'Social media referral (viral articles, skimming, mobile)',
    edge_ja: '有料購読者（深い分析、アーカイブアクセス、広告なし）',
    edge_en: 'Paid subscriber (deep analysis, archive access, ad-free)'
  },
  booking: {
    primary_ja: '旅行者（30-50歳、価格比較、レビュー重視）',
    primary_en: 'Traveler (30-50, price comparison, review-focused)',
    secondary_ja: 'ビジネス旅行者（時間効率、ロイヤルティプログラム、経費精算）',
    secondary_en: 'Business traveler (time efficiency, loyalty programs, expense reporting)',
    edge_ja: 'グループオーガナイザー（複数予約、柔軟キャンセル、グループ割引）',
    edge_en: 'Group organizer (bulk bookings, flexible cancellation, group discounts)'
  },
  iot: {
    primary_ja: 'コンシューマー（スマートホーム、簡単セットアップ、モバイル管理）',
    primary_en: 'Consumer (smart home, easy setup, mobile management)',
    secondary_ja: '産業ユーザー（運用効率、予知保全、ROI）',
    secondary_en: 'Industrial user (operational efficiency, predictive maintenance, ROI)',
    edge_ja: 'システムインテグレーター（複雑統合、カスタマイズ、API）',
    edge_en: 'System integrator (complex integration, customization, APIs)'
  },
  realestate: {
    primary_ja: '住宅購入者（初回・リピート、エリア検索、価格比較）',
    primary_en: 'Home buyer (first-time/repeat, area search, price comparison)',
    secondary_ja: '賃貸希望者（モバイル、迅速対応、バーチャルツアー）',
    secondary_en: 'Renter (mobile, quick response, virtual tours)',
    edge_ja: '不動産エージェント（リード管理、CRM統合、マーケティング）',
    edge_en: 'Real estate agent (lead mgmt, CRM integration, marketing)'
  },
  legal: {
    primary_ja: '弁護士（ケース管理、文書作成、時間追跡）',
    primary_en: 'Attorney (case management, document drafting, time tracking)',
    secondary_ja: '法務チーム（契約管理、コンプライアンス、コラボレーション）',
    secondary_en: 'Legal team (contract mgmt, compliance, collaboration)',
    edge_ja: 'クライアント（ケース進捗可視化、セキュア通信、請求透明性）',
    edge_en: 'Client (case progress visibility, secure comms, billing transparency)'
  },
  hr: {
    primary_ja: 'HR担当者（採用、オンボード、従業員記録）',
    primary_en: 'HR professional (recruitment, onboarding, employee records)',
    secondary_ja: '従業員（セルフサービスESS、給与明細、休暇申請）',
    secondary_en: 'Employee (self-service ESS, pay stubs, leave requests)',
    edge_ja: 'マネージャー（パフォーマンス管理、承認ワークフロー、チーム分析）',
    edge_en: 'Manager (performance mgmt, approval workflows, team analytics)'
  },
  analytics: {
    primary_ja: 'データアナリスト（ダッシュボード作成、SQL、可視化）',
    primary_en: 'Data analyst (dashboard creation, SQL, visualization)',
    secondary_ja: 'ビジネスユーザー（ノーコード、定型レポート、KPI追跡）',
    secondary_en: 'Business user (no-code, standard reports, KPI tracking)',
    edge_ja: 'データエンジニア（ETL、パフォーマンス最適化、API統合）',
    edge_en: 'Data engineer (ETL, performance optimization, API integration)'
  },
  portfolio: {
    primary_ja: 'クリエイティブプロフェッショナル（デザイナー・開発者、作品展示、顧客獲得）',
    primary_en: 'Creative professional (designer/developer, work showcase, client acquisition)',
    secondary_ja: '求職者（実績アピール、PDF/印刷、シンプルUI）',
    secondary_en: 'Job seeker (achievement showcase, PDF/print, simple UI)',
    edge_ja: 'エージェンシー（クライアントポータル、複数プロジェクト、ブランディング）',
    edge_en: 'Agency (client portal, multiple projects, branding)'
  },
  tool: {
    primary_ja: '開発者（効率化、自動化、CLI優先）',
    primary_en: 'Developer (efficiency, automation, CLI-first)',
    secondary_ja: 'パワーユーザー（カスタマイズ、ショートカット、拡張機能）',
    secondary_en: 'Power user (customization, shortcuts, extensions)',
    edge_ja: 'チームリード（標準化、ベストプラクティス、オンボード）',
    edge_en: 'Team lead (standardization, best practices, onboarding)'
  },
  ai: {
    primary_ja: '開発者（API統合、プロンプトエンジニアリング、コスト最適化）',
    primary_en: 'Developer (API integration, prompt engineering, cost optimization)',
    secondary_ja: 'ビジネスユーザー（ノーコードAI、テンプレート、即効性）',
    secondary_en: 'Business user (no-code AI, templates, quick wins)',
    edge_ja: 'MLエンジニア（ファインチューニング、モデル評価、パフォーマンス）',
    edge_en: 'ML engineer (fine-tuning, model evaluation, performance)'
  },
  automation: {
    primary_ja: 'ビジネスユーザー（ノーコード、テンプレート、時間節約）',
    primary_en: 'Business user (no-code, templates, time savings)',
    secondary_ja: '開発者（API統合、複雑ワークフロー、エラーハンドリング）',
    secondary_en: 'Developer (API integration, complex workflows, error handling)',
    edge_ja: 'IT管理者（セキュリティ、監査、ガバナンス）',
    edge_en: 'IT admin (security, auditing, governance)'
  },
  event: {
    primary_ja: 'イベント主催者（チケット販売、参加者管理、ROI）',
    primary_en: 'Event organizer (ticket sales, attendee mgmt, ROI)',
    secondary_ja: '参加者（モバイルチケット、スケジュール、ネットワーキング）',
    secondary_en: 'Attendee (mobile tickets, schedule, networking)',
    edge_ja: 'スポンサー（ブランド露出、リード獲得、分析）',
    edge_en: 'Sponsor (brand exposure, lead generation, analytics)'
  },
  gamify: {
    primary_ja: 'カジュアルプレイヤー（モバイル、短セッション、ソーシャル）',
    primary_en: 'Casual player (mobile, short sessions, social)',
    secondary_ja: 'ハードコアプレイヤー（競争、ランキング、進捗）',
    secondary_en: 'Hardcore player (competition, leaderboards, progression)',
    edge_ja: 'ゲーム開発者（分析、A/Bテスト、マネタイズ最適化）',
    edge_en: 'Game developer (analytics, A/B testing, monetization optimization)'
  },
  collab: {
    primary_ja: 'チームメンバー（日常コラボ、リアルタイム同期、通知）',
    primary_en: 'Team member (daily collaboration, real-time sync, notifications)',
    secondary_ja: 'プロジェクトマネージャー（進捗追跡、タスク割当、レポート）',
    secondary_en: 'Project manager (progress tracking, task assignment, reporting)',
    edge_ja: '外部コラボレーター（ゲストアクセス、権限制限、セキュア共有）',
    edge_en: 'External collaborator (guest access, limited permissions, secure sharing)'
  },
  devtool: {
    primary_ja: 'フルスタック開発者（CLI、IDE統合、ドキュメント）',
    primary_en: 'Full-stack developer (CLI, IDE integration, docs)',
    secondary_ja: 'フロントエンド開発者（DX、デバッグ、ホットリロード）',
    secondary_en: 'Frontend developer (DX, debugging, hot reload)',
    edge_ja: 'DevOps/SRE（CI/CD統合、監視、パフォーマンス）',
    edge_en: 'DevOps/SRE (CI/CD integration, monitoring, performance)'
  },
  creator: {
    primary_ja: 'コンテンツクリエイター（収益化、オーディエンス成長、分析）',
    primary_en: 'Content creator (monetization, audience growth, analytics)',
    secondary_ja: 'ファン（限定コンテンツ、クリエイター支援、コミュニティ）',
    secondary_en: 'Fan (exclusive content, creator support, community)',
    edge_ja: 'マネージャー/エージェント（複数クリエイター、契約、レポート）',
    edge_en: 'Manager/Agent (multiple creators, contracts, reporting)'
  },
  newsletter: {
    primary_ja: 'ライター（執筆、スケジュール、成長）',
    primary_en: 'Writer (writing, scheduling, growth)',
    secondary_ja: '購読者（パーソナライゼーション、読みやすさ、購読管理）',
    secondary_en: 'Subscriber (personalization, readability, subscription mgmt)',
    edge_ja: '編集者（複数ライター、承認ワークフロー、分析）',
    edge_en: 'Editor (multiple writers, approval workflows, analytics)'
  },
  _default: {
    primary_ja: 'エンドユーザー（日常利用、使いやすさ、価値実現）',
    primary_en: 'End user (daily use, ease of use, value realization)',
    secondary_ja: 'ビジネスユーザー（ROI、効率化、統合）',
    secondary_en: 'Business user (ROI, efficiency, integration)',
    edge_ja: '管理者（セキュリティ、コンプライアンス、ガバナンス）',
    edge_en: 'Admin (security, compliance, governance)'
  }
};

// GTM_STRATEGY: 4 stakeholder types
const GTM_STRATEGY = {
  startup: {
    model_ja: 'PLG（プロダクト主導成長）',
    model_en: 'PLG (Product-Led Growth)',
    channel_ja: 'フリーミアム、バイラル拡散、コンテンツマーケティング、コミュニティ',
    channel_en: 'Freemium, viral spread, content marketing, community',
    cac_ltv_ja: 'CAC: $50-200, LTV: $500-2000, ペイバック: 6-12ヶ月',
    cac_ltv_en: 'CAC: $50-200, LTV: $500-2000, Payback: 6-12 months'
  },
  enterprise: {
    model_ja: 'SLG（営業主導成長）',
    model_en: 'SLG (Sales-Led Growth)',
    channel_ja: 'エンタープライズ営業、パートナー、展示会、ホワイトペーパー',
    channel_en: 'Enterprise sales, partnerships, conferences, whitepapers',
    cac_ltv_ja: 'CAC: $5000-50000, LTV: $50000-500000, ペイバック: 12-24ヶ月',
    cac_ltv_en: 'CAC: $5000-50000, LTV: $50000-500000, Payback: 12-24 months'
  },
  developer: {
    model_ja: 'CLG（コミュニティ主導成長）',
    model_en: 'CLG (Community-Led Growth)',
    channel_ja: 'GitHub、ドキュメント、開発者コミュニティ、OSS、技術ブログ',
    channel_en: 'GitHub, documentation, dev community, OSS, technical blogs',
    cac_ltv_ja: 'CAC: $20-100, LTV: $200-2000, ペイバック: 3-6ヶ月',
    cac_ltv_en: 'CAC: $20-100, LTV: $200-2000, Payback: 3-6 months'
  },
  team: {
    model_ja: 'ハイブリッド（PLG + SLG）',
    model_en: 'Hybrid (PLG + SLG)',
    channel_ja: 'フリートライアル → チーム拡大 → エンタープライズ営業',
    channel_en: 'Free trial → team expansion → enterprise sales',
    cac_ltv_ja: 'CAC: $200-2000, LTV: $2000-20000, ペイバック: 9-18ヶ月',
    cac_ltv_en: 'CAC: $200-2000, LTV: $2000-20000, Payback: 9-18 months'
  }
};

// REGULATORY_HORIZON: Global regulations timeline 2026-2030
const REGULATORY_HORIZON = {
  timeline_ja: [
    '2026年: EU AI Act全面施行 - 高リスクAI規制',
    '2027年: ePrivacy規則施行 - Cookie規制強化',
    '2028年: DMA完全適用 - プラットフォーム規制',
    '2029年: 米国連邦プライバシー法成立見込み',
    '2030年: EU Cyber Resilience Act完全施行'
  ],
  timeline_en: [
    '2026: EU AI Act full enforcement - high-risk AI regulations',
    '2027: ePrivacy Regulation enforcement - stricter cookie rules',
    '2028: DMA full applicability - platform regulations',
    '2029: US federal privacy law expected',
    '2030: EU Cyber Resilience Act full enforcement'
  ],
  ai_act_risk_ja: {
    high: 'fintech, health, legal, hr（採用AI）— 厳格義務（透明性・監査・人間監視）',
    limited: 'community, content, ai（汎用）— 透明性義務のみ',
    minimal: 'portfolio, tool, devtool — 自主規制'
  },
  ai_act_risk_en: {
    high: 'fintech, health, legal, hr (recruitment AI) — strict obligations (transparency, auditing, human oversight)',
    limited: 'community, content, ai (general) — transparency obligations only',
    minimal: 'portfolio, tool, devtool — self-regulation'
  },
  data_sovereignty_ja: [
    'EU: Schrems II後継判決でクラウド法対応必須',
    '中国: データ越境規制強化（PIPL）',
    '日本: デジタル庁によるガバメントクラウド推進'
  ],
  data_sovereignty_en: [
    'EU: Post-Schrems II rulings require Cloud Act compliance',
    'China: Stricter cross-border data rules (PIPL)',
    'Japan: Digital Agency promotes government cloud adoption'
  ]
};

// ============================================================================
// GENERATOR FUNCTION
// ============================================================================

function genPillar15(answers) {
  const G = S.genLang === 'ja';
  const domain = detectDomain(answers.purpose || '');
  const mkt = DOMAIN_MARKET[domain] || DOMAIN_MARKET._default;
  const personas = PERSONA_ARCHETYPES[domain] || PERSONA_ARCHETYPES._default;
  const stakeholder = answers.stakeholder || 'startup';
  const gtm = GTM_STRATEGY[stakeholder] || GTM_STRATEGY.startup;
  const arch = answers.architecture || 'baas';
  const deploy = answers.deployment || 'vercel';

  S.files['docs/56_market_positioning.md'] = gen56Market(G, domain, mkt, gtm, stakeholder);
  S.files['docs/57_user_experience_strategy.md'] = gen57UX(G, domain, personas, mkt);
  S.files['docs/58_ecosystem_strategy.md'] = gen58Ecosystem(G, domain, mkt, arch, deploy, answers);
  S.files['docs/59_regulatory_foresight.md'] = gen59Regulatory(G, domain, mkt, answers);
}

// ============================================================================
// DOC 56: Market Positioning & Competitive Intelligence
// ============================================================================
function gen56Market(G, domain, mkt, gtm, stakeholder) {
  let doc = '';
  doc += G ? '# 56. 市場ポジショニング & 競合インテリジェンス\n\n' : '# 56. Market Positioning & Competitive Intelligence\n\n';
  doc += G ? '**対象:** ビジネス/PdM、投資家/経営層\n\n' : '**Audience:** Business/PdM, Investors/Executives\n\n';

  // 1. Market Landscape
  doc += G ? '## 1. 市場ランドスケープ概観\n\n' : '## 1. Market Landscape Overview\n\n';
  doc += G
    ? '**ドメイン:** ' + domain + '\n\n'
    : '**Domain:** ' + domain + '\n\n';

  const tamMap = {
    education: G ? '$300B（グローバルEdTech市場、2026）' : '$300B (Global EdTech, 2026)',
    ec: G ? '$6T（グローバルEC市場、2026）' : '$6T (Global E-commerce, 2026)',
    fintech: G ? '$310B（フィンテック市場、2026）' : '$310B (Fintech market, 2026)',
    health: G ? '$500B（デジタルヘルス市場、2026）' : '$500B (Digital health, 2026)',
    saas: G ? '$200B（グローバルSaaS市場、2026）' : '$200B (Global SaaS, 2026)',
    marketplace: G ? '$2T（シェアリングエコノミー、2026）' : '$2T (Sharing economy, 2026)',
    _default: G ? '$XB（市場規模は個別調査が必要）' : '$XB (Market size requires custom research)'
  };
  const tam = tamMap[domain] || tamMap._default;

  doc += G ? '**TAM（総有効市場）:** ' + tam + '\n\n' : '**TAM (Total Addressable Market):** ' + tam + '\n\n';
  doc += G
    ? '**SAM/SOM:** 地域・顧客セグメント・価格帯で絞り込み（例: 日本大学向けLMS = TAMの0.5%）\n\n'
    : '**SAM/SOM:** Narrow by region, customer segment, pricing (e.g., Japan university LMS = 0.5% TAM)\n\n';

  // 2. SWOT Analysis
  doc += G ? '## 2. SWOT分析フレームワーク\n\n' : '## 2. SWOT Analysis Framework\n\n';
  doc += '| ' + (G ? '項目' : 'Item') + ' | ' + (G ? '説明' : 'Description') + ' |\n';
  doc += '|---|---|\n';
  doc += '| **Strengths** | ' + (G ? '技術スタック選択の強み（例: BaaS=高速MVP、TypeScript=型安全）' : 'Tech stack strengths (e.g., BaaS=fast MVP, TypeScript=type safety)') + ' |\n';
  doc += '| **Weaknesses** | ' + (G ? 'ベンダーロックイン、スケール制約、初期スキル要件' : 'Vendor lock-in, scale constraints, initial skill requirements') + ' |\n';
  doc += '| **Opportunities** | ' + (G ? '市場成長、規制追い風、新規セグメント' : 'Market growth, regulatory tailwinds, new segments') + ' |\n';
  doc += '| **Threats** | ' + (G ? '競合、規制リスク、技術陳腐化' : 'Competition, regulatory risks, tech obsolescence') + ' |\n\n';

  // 3. MOAT Analysis
  doc += G ? '## 3. MOAT分析（5類型）\n\n' : '## 3. MOAT Analysis (5 Types)\n\n';
  doc += G ? '**ドメイン別MOAT:** ' + mkt.moat_ja + '\n\n' : '**Domain-specific MOAT:** ' + mkt.moat_en + '\n\n';

  doc += '```mermaid\nmindmap\n  root((MOAT))\n';
  doc += '    ' + (G ? 'ネットワーク効果' : 'Network Effects') + '\n';
  doc += '      ' + (G ? 'ユーザー増→価値増' : 'More users → More value') + '\n';
  doc += '    ' + (G ? 'データモート' : 'Data Moat') + '\n';
  doc += '      ' + (G ? '蓄積データ→精度向上' : 'Accumulated data → Better accuracy') + '\n';
  doc += '    ' + (G ? 'スイッチングコスト' : 'Switching Costs') + '\n';
  doc += '      ' + (G ? 'データ移行困難' : 'Data migration difficulty') + '\n';
  doc += '    ' + (G ? 'ブランド信頼' : 'Brand Trust') + '\n';
  doc += '      ' + (G ? 'セキュリティ実績' : 'Security track record') + '\n';
  doc += '    ' + (G ? '技術モート' : 'Technology Moat') + '\n';
  doc += '      ' + (G ? '独自技術・特許' : 'Proprietary tech/patents') + '\n';
  doc += '```\n\n';

  // 4. Go-to-Market Strategy
  doc += G ? '## 4. Go-to-Market戦略\n\n' : '## 4. Go-to-Market Strategy\n\n';
  doc += G ? '**ステークホルダー型:** ' + stakeholder + '\n\n' : '**Stakeholder Type:** ' + stakeholder + '\n\n';
  doc += '- **' + (G ? 'モデル' : 'Model') + ':** ' + (G ? gtm.model_ja : gtm.model_en) + '\n';
  doc += '- **' + (G ? 'チャネル' : 'Channels') + ':** ' + (G ? gtm.channel_ja : gtm.channel_en) + '\n';
  doc += '- **' + (G ? 'ユニットエコノミクス' : 'Unit Economics') + ':** ' + (G ? gtm.cac_ltv_ja : gtm.cac_ltv_en) + '\n\n';

  doc += G ? '**ドメイン別推奨チャネル:** ' + mkt.gtm_ja + '\n\n' : '**Domain-specific Channels:** ' + mkt.gtm_en + '\n\n';

  // 5. Unit Economics
  doc += G ? '## 5. ユニットエコノミクス指標\n\n' : '## 5. Unit Economics Metrics\n\n';
  doc += '```mermaid\ngraph LR\n';
  doc += '  A[' + (G ? 'CAC<br/>顧客獲得コスト' : 'CAC<br/>Customer Acquisition Cost') + '] -->|' + (G ? 'ペイバック期間' : 'Payback Period') + '| B[' + (G ? 'LTV<br/>顧客生涯価値' : 'LTV<br/>Lifetime Value') + ']\n';
  doc += '  B --> C[' + (G ? 'LTV/CAC比率<br/>3:1が健全' : 'LTV/CAC Ratio<br/>3:1 is healthy') + ']\n';
  doc += '  A --> D[' + (G ? 'マーケティング' : 'Marketing') + ']\n';
  doc += '  A --> E[' + (G ? 'セールス' : 'Sales') + ']\n';
  doc += '  A --> F[' + (G ? 'オンボード' : 'Onboarding') + ']\n';
  doc += '```\n\n';

  doc += G
    ? '**ドメイン別ペイバック期間ベンチマーク:**\n- fintech/health: 18-24ヶ月（規制・信頼構築コスト）\n- education/SaaS: 6-12ヶ月（標準的PLG）\n- marketplace: 3-6ヶ月（ネットワーク効果加速）\n\n'
    : '**Domain-specific Payback Benchmarks:**\n- fintech/health: 18-24 months (regulatory/trust costs)\n- education/SaaS: 6-12 months (standard PLG)\n- marketplace: 3-6 months (network effects acceleration)\n\n';

  doc += G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n';
  doc += G ? '**戦略基盤:** ' : '**Strategy Foundation:** ';
  doc += '[Industry Blueprint](./48_industry_blueprint.md), [Stakeholder Strategy](./50_stakeholder_strategy.md)\n\n';
  doc += G ? '**成長:** ' : '**Growth:** ';
  doc += '[Growth Intelligence](./41_growth_intelligence.md), [User Experience Strategy](./57_user_experience_strategy.md)\n\n';
  doc += G ? '**エコシステム:** ' : '**Ecosystem:** ';
  doc += '[Ecosystem Strategy](./58_ecosystem_strategy.md)\n\n';

  doc += G ? '---\n\n**次のステップ:** doc 57（UX戦略）、doc 58（エコシステム戦略）で市場ポジショニングを実行戦術に落とし込む。\n' : '---\n\n**Next Steps:** Translate market positioning into execution tactics in doc 57 (UX Strategy), doc 58 (Ecosystem Strategy).\n';

  return doc;
}

// ============================================================================
// DOC 57: User Experience & Retention Strategy
// ============================================================================
function gen57UX(G, domain, personas, mkt) {
  let doc = '';
  doc += G ? '# 57. ユーザー体験 & リテンション戦略\n\n' : '# 57. User Experience & Retention Strategy\n\n';
  doc += G ? '**対象:** エンドユーザー、ビジネス/PdM\n\n' : '**Audience:** End Users, Business/PdM\n\n';

  // 1. Persona Matrix
  doc += G ? '## 1. ペルソナ定義マトリクス\n\n' : '## 1. Persona Definition Matrix\n\n';
  doc += '| ' + (G ? 'タイプ' : 'Type') + ' | ' + (G ? 'ペルソナ' : 'Persona') + ' |\n';
  doc += '|---|---|\n';
  doc += '| ' + (G ? 'プライマリ' : 'Primary') + ' | ' + (G ? personas.primary_ja : personas.primary_en) + ' |\n';
  doc += '| ' + (G ? 'セカンダリ' : 'Secondary') + ' | ' + (G ? personas.secondary_ja : personas.secondary_en) + ' |\n';
  doc += '| ' + (G ? 'エッジケース' : 'Edge Case') + ' | ' + (G ? personas.edge_ja : personas.edge_en) + ' |\n\n';

  // 2. User Journey Map
  doc += G ? '## 2. ユーザージャーニーマップ（5ステージ）\n\n' : '## 2. User Journey Map (5 Stages)\n\n';
  doc += '```mermaid\njourney\n';
  doc += '  title ' + (G ? 'ユーザージャーニー' : 'User Journey') + '\n';
  doc += '  section ' + (G ? '発見' : 'Discovery') + '\n';
  doc += '    ' + (G ? 'SEO/SNS流入: 3: ' : 'SEO/Social inflow: 3: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '    ' + (G ? 'ランディングページ: 4: ' : 'Landing page: 4: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '  section ' + (G ? '評価' : 'Evaluation') + '\n';
  doc += '    ' + (G ? '機能確認: 4: ' : 'Feature check: 4: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '    ' + (G ? '価格比較: 3: ' : 'Pricing compare: 3: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '  section ' + (G ? 'オンボード' : 'Onboarding') + '\n';
  doc += '    ' + (G ? 'サインアップ: 5: ' : 'Sign up: 5: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '    ' + (G ? '初期設定: 2: ' : 'Initial setup: 2: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '  section ' + (G ? 'エンゲージ' : 'Engagement') + '\n';
  doc += '    ' + (G ? '日常利用: 5: ' : 'Daily use: 5: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '    ' + (G ? '価値実現: 5: ' : 'Value realization: 5: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '  section ' + (G ? '推奨' : 'Advocacy') + '\n';
  doc += '    ' + (G ? '友人紹介: 4: ' : 'Referral: 4: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '    ' + (G ? 'レビュー投稿: 3: ' : 'Review posting: 3: ') + (G ? 'ユーザー' : 'User') + '\n';
  doc += '```\n\n';

  doc += G
    ? '**ドロップオフリスクポイント:**\n- 発見→評価: 複雑な価格表、遅いページ\n- 評価→オンボード: 長いサインアップフォーム\n- オンボード→エンゲージ: 初期設定の複雑さ（**Time-to-Value最優先**）\n\n'
    : '**Drop-off Risk Points:**\n- Discovery → Evaluation: Complex pricing, slow page\n- Evaluation → Onboarding: Long signup forms\n- Onboarding → Engagement: Complex initial setup (**Time-to-Value is critical**)\n\n';

  // 3. Onboarding Strategy
  doc += G ? '## 3. オンボーディング戦略\n\n' : '## 3. Onboarding Strategy\n\n';
  doc += G
    ? '**Time-to-Value目標:** ドメイン別\n- SaaS/tool/devtool: **5分以内**（クイックスタート必須）\n- education/content: **15分以内**（初回コンテンツ消費）\n- marketplace/ec: **30分以内**（初回取引/購入）\n\n'
    : '**Time-to-Value Goals:** By domain\n- SaaS/tool/devtool: **Within 5 minutes** (quick start required)\n- education/content: **Within 15 minutes** (first content consumption)\n- marketplace/ec: **Within 30 minutes** (first transaction/purchase)\n\n';

  doc += G
    ? '**プログレッシブディスクロージャー原則:**\n1. 最小限の初期設定（email + password のみ）\n2. 段階的機能開示（使用頻度順）\n3. コンテキストヘルプ（ツールチップ、ウォークスルー）\n\n'
    : '**Progressive Disclosure Principles:**\n1. Minimal initial setup (email + password only)\n2. Gradual feature exposure (by usage frequency)\n3. Contextual help (tooltips, walkthroughs)\n\n';

  // 4. Retention & Expansion
  doc += G ? '## 4. リテンション & 拡張フレームワーク\n\n' : '## 4. Retention & Expansion Framework\n\n';
  doc += G ? '**ドメイン別リテンションレバー:** ' + mkt.ux_ja + '\n\n' : '**Domain-specific Retention Levers:** ' + mkt.ux_en + '\n\n';

  doc += '```mermaid\ngraph TD\n';
  doc += '  A[' + (G ? '新規ユーザー' : 'New User') + '] --> B[' + (G ? 'アクティブ化' : 'Activation') + ']\n';
  doc += '  B --> C[' + (G ? 'エンゲージメント' : 'Engagement') + ']\n';
  doc += '  C --> D[' + (G ? 'リテンション' : 'Retention') + ']\n';
  doc += '  D --> E[' + (G ? '収益化' : 'Monetization') + ']\n';
  doc += '  E --> F[' + (G ? '推奨' : 'Referral') + ']\n';
  doc += '  F -.->|' + (G ? 'バイラルループ' : 'Viral Loop') + '| A\n';
  doc += '  C -.->|' + (G ? 'チャーン' : 'Churn') + '| G[' + (G ? '離脱' : 'Exit') + ']\n';
  doc += '```\n\n';

  doc += G
    ? '**チャーン予測シグナル:**\n- ログイン頻度低下（7日間未ログイン）\n- 主要機能未使用（30日間）\n- サポート問い合わせ増加\n- ダウングレードリクエスト\n\n'
    : '**Churn Prediction Signals:**\n- Decreased login frequency (7 days inactive)\n- Core feature non-usage (30 days)\n- Increased support tickets\n- Downgrade requests\n\n';

  doc += G
    ? '**RICE優先度テンプレート（機能開発）:**\n- **Reach（リーチ）:** 影響ユーザー数/月\n- **Impact（影響）:** 1-3スケール（3=高）\n- **Confidence（確信度）:** %（データ有=100%, 仮説=50%）\n- **Effort（工数）:** 人月\n- **スコア:** (R × I × C) / E\n\n'
    : '**RICE Prioritization Template (Feature Development):**\n- **Reach:** # users impacted/month\n- **Impact:** 1-3 scale (3=high)\n- **Confidence:** % (data-backed=100%, hypothesis=50%)\n- **Effort:** person-months\n- **Score:** (R × I × C) / E\n\n';

  // 5. Accessibility
  doc += G ? '## 5. アクセシビリティ競争優位\n\n' : '## 5. Accessibility Competitive Advantage\n\n';
  doc += G
    ? '**WCAG 2.2 AA準拠チェックリスト:**\n- [ ] キーボードナビゲーション完全対応\n- [ ] スクリーンリーダー最適化（ARIA属性）\n- [ ] 色コントラスト比 4.5:1以上\n- [ ] フォーカスインジケータ可視化\n- [ ] 動画字幕・音声説明\n\n'
    : '**WCAG 2.2 AA Compliance Checklist:**\n- [ ] Full keyboard navigation\n- [ ] Screen reader optimization (ARIA attributes)\n- [ ] Color contrast ratio ≥4.5:1\n- [ ] Visible focus indicators\n- [ ] Video captions & audio descriptions\n\n';

  doc += G
    ? '**EU Accessibility Act 2025対応:** EC/fintech/booking/content は2025年6月までに対応義務。\n\n'
    : '**EU Accessibility Act 2025:** EC/fintech/booking/content must comply by June 2025.\n\n';

  // 6. Digital Wellbeing
  doc += G ? '## 6. デジタルウェルビーイング設計\n\n' : '## 6. Digital Wellbeing Design\n\n';
  doc += G
    ? '**ダークパターン回避（ドメイン別）:**\n- **EC:** 偽の在庫切れ、偽のタイマー → 透明な在庫表示\n- **community/gamify:** 無限スクロール → 明示的な「もっと見る」\n- **SaaS:** 解約妨害 → 1クリック解約\n\n'
    : '**Dark Pattern Avoidance (by domain):**\n- **EC:** Fake scarcity, fake timers → Transparent inventory\n- **community/gamify:** Infinite scroll → Explicit "Load more"\n- **SaaS:** Cancellation obstruction → 1-click cancellation\n\n';

  doc += G
    ? '**倫理的デザイン指標:**\n- ユーザー自律性（設定コントロール）\n- 透明性（アルゴリズム説明）\n- データ最小化（必要最小限収集）\n\n'
    : '**Ethical Design Metrics:**\n- User autonomy (control settings)\n- Transparency (algorithm explanations)\n- Data minimization (collect only essentials)\n\n';

  doc += G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n';
  doc += G ? '**デザイン:** ' : '**Design:** ';
  doc += '[Design System](./26_design_system.md)\n\n';
  doc += G ? '**戦略:** ' : '**Strategy:** ';
  doc += '[Market Positioning](./56_market_positioning.md), [Ecosystem Strategy](./58_ecosystem_strategy.md)\n\n';
  doc += G ? '**運用:** ' : '**Operations:** ';
  doc += '[Ops Plane Design](./55_ops_plane_design.md)\n\n';

  doc += G ? '---\n\n**次のステップ:** doc 58（エコシステム戦略）でパートナーシップを通じたUX向上を検討。\n' : '---\n\n**Next Steps:** Explore UX enhancement through partnerships in doc 58 (Ecosystem Strategy).\n';

  return doc;
}

// ============================================================================
// DOC 58: Ecosystem & Platform Strategy
// ============================================================================
function gen58Ecosystem(G, domain, mkt, arch, deploy, answers) {
  let doc = '';
  doc += G ? '# 58. エコシステム & プラットフォーム戦略\n\n' : '# 58. Ecosystem & Platform Strategy\n\n';
  doc += G ? '**対象:** パートナー、開発チーム、投資家\n\n' : '**Audience:** Partners, Dev Team, Investors\n\n';

  // 1. API-as-Product Strategy
  doc += G ? '## 1. API-as-Product戦略\n\n' : '## 1. API-as-Product Strategy\n\n';
  doc += '```mermaid\ngraph LR\n';
  doc += '  A[Internal API] --> B[Partner API]\n';
  doc += '  B --> C[Public API]\n';
  doc += '  C --> D[API Marketplace]\n';
  doc += '  A -.->|' + (G ? 'DX改善' : 'DX Improvement') + '| A\n';
  doc += '  B -.->|' + (G ? 'SLA・認証' : 'SLA/Auth') + '| B\n';
  doc += '  C -.->|' + (G ? 'ドキュメント・SDK' : 'Docs/SDKs') + '| C\n';
  doc += '  D -.->|' + (G ? 'マネタイズ' : 'Monetization') + '| D\n';
  doc += '```\n\n';

  doc += G
    ? '**成熟モデル:**\n1. **Internal（内部）:** 自社プロダクト用API、DX投資開始\n2. **Partner（パートナー）:** 選定パートナーにAPI提供、SLA・認証追加\n3. **Public（公開）:** 開発者向けドキュメント・SDK、レート制限\n4. **Marketplace（マーケットプレイス）:** API収益化、サードパーティアプリ\n\n'
    : '**Maturity Model:**\n1. **Internal:** APIs for own products, DX investment begins\n2. **Partner:** API access for select partners, SLA/auth added\n3. **Public:** Developer docs/SDKs, rate limiting\n4. **Marketplace:** API monetization, third-party apps\n\n';

  doc += G ? '**ドメイン別APIプロダクト機会:** ' + mkt.eco_ja + '\n\n' : '**Domain-specific API Product Opportunities:** ' + mkt.eco_en + '\n\n';

  const apiMonetize = G
    ? '**マネタイズモデル:** リクエスト課金、ティア制、プレミアムエンドポイント、SLA保証プラン'
    : '**Monetization Models:** Per-request pricing, tier-based, premium endpoints, SLA-backed plans';
  doc += apiMonetize + '\n\n';

  // 2. Integration Partnership Map
  doc += G ? '## 2. インテグレーションパートナーシップマップ\n\n' : '## 2. Integration Partnership Map\n\n';
  doc += '| ' + (G ? 'ティア' : 'Tier') + ' | ' + (G ? '優先度' : 'Priority') + ' | ' + (G ? '例' : 'Examples') + ' |\n';
  doc += '|---|---|---|\n';
  doc += '| Tier 1 | ' + (G ? '必須統合' : 'Essential integrations') + ' | ' + (G ? 'SSO、決済、Email（全ドメイン）' : 'SSO, payments, email (all domains)') + ' |\n';
  doc += '| Tier 2 | ' + (G ? 'ドメイン特化' : 'Domain-specific') + ' | ' + (G ? mkt.eco_ja : mkt.eco_en) + ' |\n';
  doc += '| Tier 3 | ' + (G ? 'ニッチ・地域特化' : 'Niche/regional') + ' | ' + (G ? 'ローカル決済、地域規制ツール' : 'Local payments, regional compliance tools') + ' |\n\n';

  // 3. Developer Experience (DX) Strategy
  doc += G ? '## 3. Developer Experience (DX) 戦略\n\n' : '## 3. Developer Experience (DX) Strategy\n\n';
  doc += '```mermaid\ngraph TD\n';
  doc += '  A[' + (G ? 'Golden Path' : 'Golden Path') + '] --> B[' + (G ? 'ドキュメント' : 'Documentation') + ']\n';
  doc += '  A --> C[' + (G ? 'CLI/SDK' : 'CLI/SDKs') + ']\n';
  doc += '  A --> D[' + (G ? 'テンプレート' : 'Templates') + ']\n';
  doc += '  B --> E[' + (G ? 'クイックスタート' : 'Quick Start') + ']\n';
  doc += '  B --> F[' + (G ? 'APIリファレンス' : 'API Reference') + ']\n';
  doc += '  C --> G[' + (G ? '多言語SDK' : 'Multi-lang SDKs') + ']\n';
  doc += '  D --> H[' + (G ? 'ボイラープレート' : 'Boilerplates') + ']\n';
  doc += '```\n\n';

  doc += G
    ? '**内部プラットフォームエンジニアリング（IDP）:**\n- **Golden Path:** 推奨技術スタック・デプロイ手順の標準化\n- **セルフサービス:** 開発者が承認待ちなしでリソースプロビジョニング\n- **ドキュメント駆動:** Architecture Decision Records (ADR)、Runbook\n\n'
    : '**Internal Platform Engineering (IDP):**\n- **Golden Path:** Standardized tech stack & deployment procedures\n- **Self-Service:** Developers provision resources without approval wait\n- **Docs-Driven:** Architecture Decision Records (ADR), Runbooks\n\n';

  // 4. FinOps / Cloud Cost Strategy
  doc += G ? '## 4. FinOps / クラウドコスト戦略\n\n' : '## 4. FinOps / Cloud Cost Strategy\n\n';
  const finopsArch = arch === 'baas'
    ? (G ? 'BaaS（Supabase/Firebase）: 従量課金、スケール時コスト急増リスク → コスト監視必須' : 'BaaS (Supabase/Firebase): Pay-as-you-go, risk of cost surge at scale → Cost monitoring essential')
    : (G ? 'Traditional（PostgreSQL+Express）: 固定コスト（VPS/RDS）、スケール予測容易' : 'Traditional (PostgreSQL+Express): Fixed costs (VPS/RDS), easier scale prediction');
  doc += '**アーキテクチャ別コスト特性:**\n- ' + finopsArch + '\n\n';

  const finopsDeploy = deploy === 'vercel'
    ? (G ? 'Vercel/Netlify: 無料枠超過後$$$、帯域課金注意' : 'Vercel/Netlify: $$$ after free tier, watch bandwidth costs')
    : deploy === 'cloudflare'
    ? (G ? 'Cloudflare Pages: 最安（無料枠広い）、Workers KV課金' : 'Cloudflare Pages: Cheapest (generous free tier), Workers KV billing')
    : deploy === 'aws'
    ? (G ? 'AWS: 柔軟だが複雑、Reserved Instances/Savings Plans活用' : 'AWS: Flexible but complex, use Reserved Instances/Savings Plans')
    : (G ? 'VPS（$5-20/月）、予測可能' : 'VPS ($5-20/mo), predictable');
  doc += '**デプロイ先別推奨:**\n- ' + finopsDeploy + '\n\n';

  doc += G
    ? '**ドメイン別コストホットスポット:**\n- **analytics/ai:** データストレージ・計算量\n- **community/content:** CDN帯域\n- **marketplace/ec:** トランザクション・決済手数料\n\n'
    : '**Domain-specific Cost Hotspots:**\n- **analytics/ai:** Data storage & compute\n- **community/content:** CDN bandwidth\n- **marketplace/ec:** Transactions & payment fees\n\n';

  // 5. Community & OSS Strategy
  doc += G ? '## 5. コミュニティ & OSS戦略\n\n' : '## 5. Community & OSS Strategy\n\n';
  const ossStrategy = ['tool', 'devtool', 'ai'].includes(domain)
    ? (G ? '**OSS-First戦略:** コア機能OSSで公開 → コミュニティ貢献 → エンタープライズ機能で収益化（例: GitLab、Supabase）' : '**OSS-First Strategy:** Open-source core → community contributions → monetize enterprise features (e.g., GitLab, Supabase)')
    : (G ? '**選択的OSS:** ツール・ライブラリのみOSS、コアビジネスロジックはプロプライエタリ' : '**Selective OSS:** Tools/libraries OSS, core business logic proprietary');
  doc += ossStrategy + '\n\n';

  doc += G
    ? '**ドメイン別コミュニティパターン:**\n- **developer/devtool:** GitHub Discussions、Discord、技術ブログ\n- **education:** 教育者コミュニティ、コース共有\n- **community/content:** UGCプラットフォーム、モデレーター育成\n\n'
    : '**Domain-specific Community Patterns:**\n- **developer/devtool:** GitHub Discussions, Discord, technical blogs\n- **education:** Educator community, course sharing\n- **community/content:** UGC platform, moderator training\n\n';

  doc += G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n';
  doc += G ? '**技術基盤:** ' : '**Tech Foundation:** ';
  doc += '[Tech Radar](./49_tech_radar.md), [Architecture](./03_architecture.md)\n\n';
  doc += G ? '**実装:** ' : '**Implementation:** ';
  doc += '[Implementation Playbook](./39_implementation_playbook.md)\n\n';
  doc += G ? '**戦略:** ' : '**Strategy:** ';
  doc += '[Market Positioning](./56_market_positioning.md), [User Experience Strategy](./57_user_experience_strategy.md)\n\n';

  doc += G ? '---\n\n**次のステップ:** doc 59（規制フォーサイト）でエコシステム拡大時の規制リスクを評価。\n' : '---\n\n**Next Steps:** Assess regulatory risks during ecosystem expansion in doc 59 (Regulatory Foresight).\n';

  return doc;
}

// ============================================================================
// DOC 59: Regulatory Foresight & Sustainability
// ============================================================================
function gen59Regulatory(G, domain, mkt, answers) {
  const deploy = answers.deployment || 'vercel';
  let doc = '';
  doc += G ? '# 59. 規制フォーサイト & サステナビリティ\n\n' : '# 59. Regulatory Foresight & Sustainability\n\n';
  doc += G ? '**対象:** 規制/コンプライアンス、投資家、ビジネス\n\n' : '**Audience:** Regulatory/Compliance, Investors, Business\n\n';

  // 1. Regulatory Horizon Scanner
  doc += G ? '## 1. 規制ホライズンスキャナー（2026-2030）\n\n' : '## 1. Regulatory Horizon Scanner (2026-2030)\n\n';
  doc += '```mermaid\ntimeline\n';
  doc += '  title ' + (G ? '規制タイムライン' : 'Regulatory Timeline') + '\n';
  const timeline = G ? REGULATORY_HORIZON.timeline_ja : REGULATORY_HORIZON.timeline_en;
  timeline.forEach(item => {
    const year = item.match(/\d{4}/)[0];
    const desc = item.replace(/^\d{4}年?:\s*/, '');
    doc += '  ' + year + ' : ' + desc + '\n';
  });
  doc += '```\n\n';

  doc += G ? '**ドメイン別規制影響度:** ' + mkt.reg_ja + '\n\n' : '**Domain-specific Regulatory Impact:** ' + mkt.reg_en + '\n\n';

  // 2. EU AI Act Assessment
  doc += G ? '## 2. EU AI Act対応度アセスメント\n\n' : '## 2. EU AI Act Compliance Assessment\n\n';
  const useAI = answers.ai_auto && answers.ai_auto !== 'none';
  if (useAI) {
    const aiRisk = ['fintech', 'health', 'legal', 'hr'].includes(domain);
    const riskLevel = aiRisk ? (G ? '高リスク' : 'High-Risk') : (G ? '限定リスク' : 'Limited Risk');
    const aiActDesc = G ? REGULATORY_HORIZON.ai_act_risk_ja : REGULATORY_HORIZON.ai_act_risk_en;
    doc += '**AIリスク分類:** ' + riskLevel + '\n\n';
    doc += '**該当規制:** ' + (aiRisk ? aiActDesc.high : aiActDesc.limited) + '\n\n';

    if (aiRisk) {
      doc += G
        ? '**必須ドキュメント:**\n- [ ] AIシステムリスク評価書\n- [ ] データセット品質・バイアス監査\n- [ ] 透明性レポート（ユーザー向けAI使用説明）\n- [ ] 人間監視プロセス文書\n\n'
        : '**Required Documentation:**\n- [ ] AI system risk assessment\n- [ ] Dataset quality & bias audit\n- [ ] Transparency report (user-facing AI usage explanation)\n- [ ] Human oversight process documentation\n\n';
    }
  } else {
    doc += G ? '**AI未使用** — EU AI Act直接適用なし（ただし将来のAI導入時は再評価）\n\n' : '**No AI usage** — EU AI Act not directly applicable (re-assess upon future AI adoption)\n\n';
  }

  // 3. ESG & Sustainability
  doc += G ? '## 3. ESG & サステナビリティ指標\n\n' : '## 3. ESG & Sustainability Metrics\n\n';
  doc += '```mermaid\nmindmap\n  root((ESG))\n    ' + (G ? '環境' : 'Environmental') + '\n      ' + (G ? 'カーボンフットプリント' : 'Carbon Footprint') + '\n      ' + (G ? 'グリーンホスティング' : 'Green Hosting') + '\n    ' + (G ? '社会' : 'Social') + '\n      ' + (G ? 'アクセシビリティ' : 'Accessibility') + '\n      ' + (G ? 'DEI指標' : 'DEI Metrics') + '\n    ' + (G ? 'ガバナンス' : 'Governance') + '\n      ' + (G ? 'データ倫理' : 'Data Ethics') + '\n      ' + (G ? '透明性' : 'Transparency') + '\n```\n\n';

  const carbonDeploy = deploy === 'cloudflare'
    ? (G ? 'Cloudflare（100%再生可能エネルギー）' : 'Cloudflare (100% renewable energy)')
    : deploy === 'vercel'
    ? (G ? 'Vercel（カーボンニュートラル目標、AWS Graviton使用）' : 'Vercel (carbon-neutral goal, AWS Graviton)')
    : (G ? 'クラウドプロバイダの再生可能エネルギー利用率を確認' : 'Check cloud provider renewable energy usage');
  doc += G
    ? '**カーボンフットプリント推定:**\n- デプロイ先: ' + carbonDeploy + '\n- ドメイン別: analytics/ai（高計算量）> community/content（帯域）> portfolio（低）\n\n'
    : '**Carbon Footprint Estimation:**\n- Deployment: ' + carbonDeploy + '\n- By domain: analytics/ai (high compute) > community/content (bandwidth) > portfolio (low)\n\n';

  doc += G ? '**ドメイン別ESG優先事項:** ' + mkt.esg_ja + '\n\n' : '**Domain-specific ESG Priorities:** ' + mkt.esg_en + '\n\n';

  doc += G
    ? '**CSRD/SEC開示要件（2026-2027）:**\n- EU CSRD: 大企業は2024年度から、中小企業は2026年度から（段階適用）\n- SEC Climate Rule: 米国上場企業、Scope 1/2排出量開示義務\n\n'
    : '**CSRD/SEC Disclosure Requirements (2026-2027):**\n- EU CSRD: Large companies from FY2024, SMEs from FY2026 (phased)\n- SEC Climate Rule: US public companies, Scope 1/2 emissions disclosure\n\n';

  // 4. Data Sovereignty & Privacy Evolution
  doc += G ? '## 4. データ主権 & プライバシー進化\n\n' : '## 4. Data Sovereignty & Privacy Evolution\n\n';
  const sovereignty = G ? REGULATORY_HORIZON.data_sovereignty_ja : REGULATORY_HORIZON.data_sovereignty_en;
  sovereignty.forEach(item => {
    doc += '- ' + item + '\n';
  });
  doc += '\n';

  doc += G
    ? '**PETs（プライバシー強化技術）ロードマップ:**\n- **2026:** 連合学習（Federated Learning）の主流化（health/fintech）\n- **2027:** 差分プライバシー（Differential Privacy）義務化検討\n- **2028:** 完全同型暗号（FHE）商用化加速\n\n'
    : '**PETs (Privacy-Enhancing Technologies) Roadmap:**\n- **2026:** Federated Learning mainstream (health/fintech)\n- **2027:** Differential Privacy regulation consideration\n- **2028:** Fully Homomorphic Encryption (FHE) commercialization accelerates\n\n';

  doc += G
    ? '**児童プライバシー進化:**\n- COPPA改正（米、2026予定）: 13歳→16歳に引き上げ検討\n- UK Age Appropriate Design Code: EU全域への拡大\n\n'
    : '**Children Privacy Evolution:**\n- COPPA revision (US, expected 2026): Age threshold 13→16 under consideration\n- UK Age Appropriate Design Code: Expansion to EU-wide\n\n';

  // 5. Resilience Engineering
  doc += G ? '## 5. レジリエンスエンジニアリング\n\n' : '## 5. Resilience Engineering\n\n';
  doc += G
    ? '**カオスエンジニアリング準備度チェックリスト:**\n- [ ] 本番環境で障害注入実験（Chaos Monkey）\n- [ ] Incident Response Playbook整備\n- [ ] ポストモーテム文化（Blameless）\n- [ ] SLOベースアラート（P14参照）\n\n'
    : '**Chaos Engineering Readiness Checklist:**\n- [ ] Fault injection experiments in production (Chaos Monkey)\n- [ ] Incident Response Playbook\n- [ ] Blameless postmortem culture\n- [ ] SLO-based alerting (see P14)\n\n';

  if (domain === 'fintech') {
    doc += G
      ? '**EU DORA（金融）コンプライアンス（2025年1月施行）:**\n- [ ] ICTリスク管理フレームワーク\n- [ ] サードパーティリスク評価（クラウドプロバイダ）\n- [ ] インシデント報告（72時間以内）\n- [ ] デジタルレジリエンステスト（年次）\n\n'
      : '**EU DORA (Finance) Compliance (Effective Jan 2025):**\n- [ ] ICT risk management framework\n- [ ] Third-party risk assessment (cloud providers)\n- [ ] Incident reporting (within 72 hours)\n- [ ] Digital resilience testing (annual)\n\n';
  }

  doc += G
    ? '**アンチフラジャイル原則:**\n- 障害から学習（ポストモーテム）\n- 小さな障害を歓迎（大障害を防ぐ）\n- オプショナリティ（技術選択の柔軟性維持）\n\n'
    : '**Antifragile Principles:**\n- Learn from failures (postmortems)\n- Welcome small failures (prevent large ones)\n- Optionality (maintain tech choice flexibility)\n\n';

  doc += G ? '## 📚 関連ドキュメント\n\n' : '## 📚 Related Documents\n\n';
  doc += G ? '**セキュリティ:** ' : '**Security:** ';
  doc += '[Security Intelligence](./43_security_intelligence.md), [Compliance Matrix](./45_compliance_matrix.md), [AI Security](./46_ai_security.md)\n\n';
  doc += G ? '**戦略:** ' : '**Strategy:** ';
  doc += '[Industry Blueprint](./48_industry_blueprint.md), [Ecosystem Strategy](./58_ecosystem_strategy.md)\n\n';
  doc += G ? '**計画:** ' : '**Planning:** ';
  doc += '[Roadmap](./10_gantt.md)\n\n';

  doc += G ? '---\n\n**次のステップ:** 規制タイムラインをプロダクトロードマップ（docs/10_gantt.md）に反映。四半期ごとにこのドキュメントを更新し、新規制を監視。\n' : '---\n\n**Next Steps:** Reflect regulatory timeline into product roadmap (docs/10_gantt.md). Update this document quarterly to monitor new regulations.\n';

  return doc;
}

// ============================================================================
// EXPORTS
// ============================================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { genPillar15, DOMAIN_MARKET, PERSONA_ARCHETYPES, GTM_STRATEGY, REGULATORY_HORIZON };
}
