/* ── Pillar ⑦ Roadmap (9 files) — uses GT (gen-templates.js) — Phase B ── */
/* Domain-specific learning items and resources */
var _P7_DOMAIN={
  fintech:{
    skills_ja:['金融規制・コンプライアンス基礎 (FISC安全基準)','PCI-DSS Level 1/2 準拠チェックリスト','セキュリティ審査 (ペネトレーションテスト)','金融API標準 (Open Banking / ISO 20022)'],
    skills_en:['Financial regulation basics (PCI-DSS)','PCI-DSS compliance checklist','Security audit (penetration testing)','Financial API standards (Open Banking / ISO 20022)'],
    res_ja:['[金融庁ガイドライン](https://www.fsa.go.jp/news/r3/sonota/20211109/01.pdf)','[FISC安全対策基準](https://www.fisc.or.jp/)','[OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)'],
    res_en:['[OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)','[PCI DSS Quick Reference](https://www.pcisecuritystandards.org/)','[Open Banking UK API](https://www.openbanking.org.uk/)']},
  health:{
    skills_ja:['HIPAA/個人情報保護法の医療データ規制','HL7 FHIR APIの基礎 (医療データ標準)','医療データの匿名化・仮名化技術','患者同意管理 (Consent Management)'],
    skills_en:['HIPAA/healthcare data privacy regulations','HL7 FHIR API basics (healthcare data standard)','Medical data anonymization/pseudonymization','Patient consent management'],
    res_ja:['[HL7 FHIR 仕様](https://www.hl7.org/fhir/)','[個人情報保護委員会 医療ガイドライン](https://www.ppc.go.jp/)'],
    res_en:['[HL7 FHIR Specification](https://www.hl7.org/fhir/)','[HIPAA for Developers](https://www.hhs.gov/hipaa/)']},
  ec:{
    skills_ja:['Stripe/決済API統合 (Webhook・返金・サブスク)','在庫管理ロジック (オーバーセル防止)','注文・配送ステータス設計','ECセキュリティ (3DS2・PCI-DSS準拠)'],
    skills_en:['Stripe/payment API (Webhooks, refunds, subscriptions)','Inventory management (oversell prevention)','Order/shipping status state machine','EC security (3DS2, PCI-DSS compliance)'],
    res_ja:['[Stripe Docs](https://stripe.com/docs)','[決済代行選定ガイド](https://www.meti.go.jp/shingikai/mono_info_service/ec_machizukuri/index.html)'],
    res_en:['[Stripe Documentation](https://stripe.com/docs)','[Shopify App Dev](https://shopify.dev/docs/apps)']},
  ai:{
    skills_ja:['LLM API統合 (OpenAI / Anthropic)','RAG パターン (Retrieval-Augmented Generation)','ベクトル埋め込み・類似検索 (pgvector / Pinecone)','プロンプトエンジニアリング・ガードレール設計'],
    skills_en:['LLM API integration (OpenAI / Anthropic)','RAG pattern (Retrieval-Augmented Generation)','Vector embeddings & similarity search (pgvector)','Prompt engineering & guardrail design'],
    res_ja:['[Anthropic Developer Docs](https://docs.anthropic.com/)','[LangChain Docs](https://python.langchain.com/docs/)','[Vercel AI SDK](https://sdk.vercel.ai/docs)'],
    res_en:['[Anthropic Developer Docs](https://docs.anthropic.com/)','[LangChain Docs](https://python.langchain.com/docs/)','[Vercel AI SDK](https://sdk.vercel.ai/docs)']},
  iot:{
    skills_ja:['MQTTプロトコル・IoTメッセージングパターン','時系列DB設計 (InfluxDB / TimescaleDB)','Edge Computing基礎','デバイスプロビジョニング・OTA更新'],
    skills_en:['MQTT protocol & IoT messaging patterns','Time-series DB design (InfluxDB / TimescaleDB)','Edge computing basics','Device provisioning & OTA updates'],
    res_ja:['[AWS IoT Core](https://docs.aws.amazon.com/iot/latest/developerguide/)','[InfluxDB Docs](https://docs.influxdata.com/)'],
    res_en:['[AWS IoT Core Docs](https://docs.aws.amazon.com/iot/)','[InfluxDB Documentation](https://docs.influxdata.com/)']},
  education:{
    skills_ja:['SCORM/xAPI (eラーニング標準)','動画ストリーミング統合 (HLS / Mux)','学習進捗追跡・バッジシステム設計','コンテンツDRM保護'],
    skills_en:['SCORM/xAPI (e-learning standards)','Video streaming integration (HLS / Mux)','Learning progress tracking & badge system','Content DRM protection'],
    res_ja:['[Mux Video API](https://docs.mux.com/)','[ADL xAPI Spec](https://adlnet.gov/projects/xapi/)'],
    res_en:['[Mux Video API Docs](https://docs.mux.com/)','[xAPI Specification](https://adlnet.gov/projects/xapi/)']},
  marketplace:{
    skills_ja:['二者間決済・エスクロー実装','出品者・購入者ダッシュボード設計','レビュー・評価システム','手数料・精算ロジック'],
    skills_en:['Two-sided payments & escrow implementation','Seller & buyer dashboard design','Review & rating system','Commission & payout logic'],
    res_ja:['[Stripe Connect](https://stripe.com/docs/connect)','[Marketplace UX Patterns](https://www.nngroup.com/articles/marketplace-ux/)'],
    res_en:['[Stripe Connect Docs](https://stripe.com/docs/connect)','[Marketplace UX Patterns](https://www.nngroup.com/articles/marketplace-ux/)']},
  community:{
    skills_ja:['コンテンツモデレーション・通報システム','スパム対策・レート制限','メンション・通知設計','フォロー・フィードアルゴリズム'],
    skills_en:['Content moderation & reporting system','Spam prevention & rate limiting','Mention & notification design','Follow & feed algorithm'],
    res_ja:['[Discourse API](https://docs.discourse.org/)','[Moderation Best Practices (Trust & Safety)](https://www.tspa.io/)'],
    res_en:['[Community Platform Design](https://www.cmxhub.com/)','[Discourse Developer Guide](https://docs.discourse.org/)']},
  booking:{
    skills_ja:['同時予約・競合制御 (悲観的ロック)','タイムゾーン・DST処理','キャンセルポリシー・返金ロジック','キャパシティ管理とウェイトリスト'],
    skills_en:['Concurrent booking & conflict control (pessimistic locking)','Timezone & DST handling','Cancellation policy & refund logic','Capacity management & waitlist'],
    res_ja:['[Cal.com Open Source](https://github.com/calcom/cal.com)','[Calendly API Docs](https://developer.calendly.com/)'],
    res_en:['[Cal.com GitHub](https://github.com/calcom/cal.com)','[Calendly API](https://developer.calendly.com/)']},
  saas:{
    skills_ja:['マルチテナント設計 (RLS/スキーマ分離)','サブスク管理・プラン変更ロジック','使用量メータリング','オンボーディングフロー設計'],
    skills_en:['Multi-tenant design (RLS / schema isolation)','Subscription management & plan changes','Usage metering','Onboarding flow design'],
    res_ja:['[Stripe Billing](https://stripe.com/docs/billing)','[SaaS Metrics Guide](https://www.keybanc.com/capital-markets/investment-banking/saas/)'],
    res_en:['[Stripe Billing Docs](https://stripe.com/docs/billing)','[SaaS Metrics 2.0](https://www.keybanc.com/capital-markets/investment-banking/saas/)']},
  realestate:{
    skills_ja:['契約・更新管理ワークフロー','修繕リクエスト・チケットシステム','家賃収入・費用レポート','物件写真・媒体管理'],
    skills_en:['Contract & renewal management workflow','Maintenance request & ticket system','Rental income & expense reporting','Property photo & media management'],
    res_ja:['[RESO データ標準](https://www.reso.org/)','[国交省 不動産ID](https://www.mlit.go.jp/)'],
    res_en:['[RESO Data Standard](https://www.reso.org/)','[Propertyware Developer Docs](https://developer.propertyware.com/)']},
  legal:{
    skills_ja:['電子署名連携 (DocuSign / Adobe Sign)','ドキュメントバージョン管理','承認ワークフロー設計','機密文書アクセス制御'],
    skills_en:['E-signature integration (DocuSign / Adobe Sign)','Document version management','Approval workflow design','Confidential document access control'],
    res_ja:['[DocuSign Developer](https://developers.docusign.com/)','[Adobe Sign API](https://opensource.adobe.com/acrobat-sign/developer_guide/)'],
    res_en:['[DocuSign eSignature API](https://developers.docusign.com/)','[Adobe Sign Developer Guide](https://opensource.adobe.com/acrobat-sign/developer_guide/)']},
  hr:{
    skills_ja:['採用パイプライン・ATS設計','面接スケジュール管理','評価・スコアカード設計','給与・勤怠連携'],
    skills_en:['Recruitment pipeline & ATS design','Interview scheduling','Evaluation & scorecard design','Payroll & attendance integration'],
    res_ja:['[Greenhouse API](https://developers.greenhouse.io/)','[厚労省 労働法ガイド](https://www.mhlw.go.jp/index.html)'],
    res_en:['[Greenhouse Harvest API](https://developers.greenhouse.io/)','[Workday Platform API](https://community.workday.com/)']},
  content:{
    skills_ja:['全文検索 (Elasticsearch/Algolia)','コンテンツバージョン履歴','アクセス権限・下書き管理','MDX/リッチテキストエディタ統合'],
    skills_en:['Full-text search (Elasticsearch / Algolia)','Content version history','Access permissions & draft management','MDX / rich text editor integration'],
    res_ja:['[Algolia Docs](https://www.algolia.com/doc/)','[Contentful API](https://www.contentful.com/developers/docs/)'],
    res_en:['[Algolia Documentation](https://www.algolia.com/doc/)','[Sanity CMS Docs](https://www.sanity.io/docs)']},
  analytics:{
    skills_ja:['KPI集計・マテリアライズドビュー設計','ダッシュボード可視化 (Chart.js/Recharts)','リアルタイムデータパイプライン','コホート分析・ファネル設計'],
    skills_en:['KPI aggregation & materialized views','Dashboard visualization (Chart.js / Recharts)','Real-time data pipeline','Cohort analysis & funnel design'],
    res_ja:['[Apache Superset](https://superset.apache.org/)','[dbt Core Docs](https://docs.getdbt.com/)'],
    res_en:['[Apache Superset Docs](https://superset.apache.org/docs/)','[dbt Core Docs](https://docs.getdbt.com/)']},
  portfolio:{
    skills_ja:['SSG/SSRによる高速表示最適化','SEO メタタグ・OGP設定','お問い合わせフォーム実装','ダーク/ライトモード切替'],
    skills_en:['SSG/SSR for fast page load optimization','SEO meta tags & OGP configuration','Contact form implementation','Dark/light mode toggle'],
    res_ja:['[Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)','[web.dev Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)'],
    res_en:['[Next.js Deployment Docs](https://nextjs.org/docs/pages/building-your-application/deploying)','[web.dev Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)']},
  tool:{
    skills_ja:['APIキー発行・ローテーション','使用量モニタリング・クォータ管理','Webhook配信とリトライロジック','SDKドキュメント自動生成'],
    skills_en:['API key issuance & rotation','Usage monitoring & quota management','Webhook delivery & retry logic','Auto-generated SDK documentation'],
    res_ja:['[OpenAPI Generator](https://openapi-generator.tech/)','[Swagger UI Docs](https://swagger.io/docs/open-source-tools/swagger-ui/)'],
    res_en:['[OpenAPI Generator](https://openapi-generator.tech/)','[ReadMe Developer Hub](https://readme.com/)']},
  event:{
    skills_ja:['チケット重複防止・楽観的ロック','キャパシティ管理・ウェイトリスト','QRコード生成・入場管理','スポンサー・ブース管理'],
    skills_en:['Duplicate ticket prevention & optimistic locking','Capacity management & waitlist','QR code generation & gate management','Sponsor & booth management'],
    res_ja:['[Eventbrite API](https://www.eventbrite.com/platform/api)','[Stripe Payment Links](https://stripe.com/docs/payment-links)'],
    res_en:['[Eventbrite API Docs](https://www.eventbrite.com/platform/api)','[Pretix Event Ticketing](https://docs.pretix.eu/)']},
  creator:{
    skills_ja:['サブスクリプション管理とアクセス制御','クリエイター収益化・ペイアウト','コンテンツ限定公開とDRM','ファン・コメントシステム'],
    skills_en:['Subscription management & access control','Creator monetization & payouts','Exclusive content & DRM','Fan & comment system'],
    res_ja:['[Stripe Connect](https://stripe.com/docs/connect)','[Patreon API](https://docs.patreon.com/)'],
    res_en:['[Stripe Connect for Platforms](https://stripe.com/docs/connect)','[Memberstack Docs](https://www.memberstack.com/docs)']},
  newsletter:{
    skills_ja:['配信レート制限とバウンス管理','メール開封率・クリック追跡','配信停止 (Unsubscribe) 処理','SPF/DKIM/DMARC設定'],
    skills_en:['Delivery rate limiting & bounce management','Email open/click tracking','Unsubscribe handling','SPF / DKIM / DMARC configuration'],
    res_ja:['[Resend API](https://resend.com/docs)','[Postmark Docs](https://postmarkapp.com/developer)'],
    res_en:['[Resend API Docs](https://resend.com/docs)','[Sendgrid Email API](https://docs.sendgrid.com/)']},
  gamify:{
    skills_ja:['ポイント不正防止・冪等性保証','リアルタイムランキング更新 (Redis Sorted Set)','バッジ・アチーブメントアンロック検証','ゲーミフィケーション心理設計'],
    skills_en:['Point fraud prevention & idempotency','Real-time leaderboard (Redis Sorted Set)','Badge & achievement unlock validation','Gamification psychology design'],
    res_ja:['[Redis Sorted Sets](https://redis.io/docs/data-types/sorted-sets/)','[Octalysis Framework](https://yukaichou.com/gamification-examples/octalysis-complete-gamification-framework/)'],
    res_en:['[Redis Sorted Set Docs](https://redis.io/docs/data-types/sorted-sets/)','[Gamification Design Guide](https://www.gamified.uk/gamification-framework/)']},
  collab:{
    skills_ja:['OT/CRDT競合解決アルゴリズム','リアルタイム同期 (WebSocket/Yjs)','バージョン管理・差分表示','権限管理と招待システム'],
    skills_en:['OT/CRDT conflict resolution algorithm','Real-time sync (WebSocket / Yjs)','Version management & diff display','Permission management & invite system'],
    res_ja:['[Yjs Documentation](https://docs.yjs.dev/)','[Liveblocks Docs](https://liveblocks.io/docs)'],
    res_en:['[Yjs Docs](https://docs.yjs.dev/)','[Liveblocks Platform](https://liveblocks.io/docs)']},
  devtool:{
    skills_ja:['APIキー発行・失効システム','Webhookシグネチャ検証・配信保証','開発者向けSDK設計','使用量課金・Stripe Metered Billing'],
    skills_en:['API key issuance & revocation system','Webhook signature verification & delivery guarantee','Developer-facing SDK design','Usage billing with Stripe Metered Billing'],
    res_ja:['[Stripe Metered Billing](https://stripe.com/docs/billing/subscriptions/usage-based)','[OpenAPI Specification](https://spec.openapis.org/)'],
    res_en:['[Stripe Metered Billing Docs](https://stripe.com/docs/billing/subscriptions/usage-based)','[API Design Patterns (Manning)](https://www.manning.com/books/api-design-patterns)']},
  travel:{
    skills_ja:['空き室・在庫の競合制御','複数通貨・為替レート対応','キャンセルポリシー・部分返金','GDS/OTA連携API'],
    skills_en:['Availability & inventory conflict control','Multi-currency & exchange rate support','Cancellation policy & partial refunds','GDS / OTA integration API'],
    res_ja:['[Amadeus Travel API](https://developers.amadeus.com/)','[Booking.com Partner API](https://developers.booking.com/)'],
    res_en:['[Amadeus for Developers](https://developers.amadeus.com/)','[Airbnb Engineering Blog](https://medium.com/airbnb-engineering)']},
  insurance:{
    skills_ja:['保険証券ライフサイクル管理','クレーム処理ワークフロー','保険料計算エンジン','金融庁ガイドライン準拠'],
    skills_en:['Policy lifecycle management','Claims processing workflow','Premium calculation engine','Financial regulatory compliance'],
    res_ja:['[金融庁 保険業法](https://www.fsa.go.jp/news/r3/hoken/index.html)','[OpenInsurance Specification](https://openinsurance.io/)'],
    res_en:['[OpenInsurance Specification](https://openinsurance.io/)','[Majesco Insurance Platform](https://www.majesco.com/)']},
  media:{
    skills_ja:['動画ストリーミング (HLS/DASH)','CDN最適化とオリジンシールド','コンテンツ保護 (DRM/Widevine)','エンコードパイプライン設計'],
    skills_en:['Video streaming (HLS / DASH)','CDN optimization & origin shield','Content protection (DRM / Widevine)','Encoding pipeline design'],
    res_ja:['[Mux Video API](https://docs.mux.com/)','[Cloudflare Stream](https://developers.cloudflare.com/stream/)'],
    res_en:['[Mux Developer Docs](https://docs.mux.com/)','[Cloudflare Stream API](https://developers.cloudflare.com/stream/)']},
  government:{
    skills_ja:['電子申請フォーム設計 (WCAG 2.1 AA)','住民データ保護とマイナンバー法','セキュリティ審査・ISMAP認定','デジタル庁標準準拠'],
    skills_en:['Electronic application form design (WCAG 2.1 AA)','Citizen data protection & privacy law','Security certification & audit','Government digital standard compliance'],
    res_ja:['[デジタル庁デザインシステム](https://design.digital.go.jp/)','[e-Gov API](https://www.e-gov.go.jp/)'],
    res_en:['[WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)','[UK Government Design System](https://design-system.service.gov.uk/)']},
  manufacturing:{
    skills_ja:['MES/ERP連携設計','品質管理・検査記録システム','サプライチェーン可視化','ISO 9001/13485準拠対応'],
    skills_en:['MES / ERP integration design','Quality control & inspection record system','Supply chain visibility','ISO 9001/13485 compliance'],
    res_ja:['[OPC UA Specification](https://reference.opcfoundation.org/)','[AWS IoT SiteWise](https://docs.aws.amazon.com/iot-sitewise/)'],
    res_en:['[OPC UA Foundation](https://opcfoundation.org/)','[AWS IoT SiteWise Docs](https://docs.aws.amazon.com/iot-sitewise/)']},
  logistics:{
    skills_ja:['リアルタイム位置追跡 (WebSocket/GPS)','ルート最適化アルゴリズム','配送ステータス管理','倉庫管理システム (WMS) 連携'],
    skills_en:['Real-time location tracking (WebSocket / GPS)','Route optimization algorithm','Delivery status management','Warehouse management system (WMS) integration'],
    res_ja:['[Google Maps Platform](https://developers.google.com/maps)','[OpenRouteService](https://openrouteservice.org/dev/)'],
    res_en:['[Google Maps Routes API](https://developers.google.com/maps/documentation/routes)','[OpenRouteService API](https://openrouteservice.org/dev/)']},
  agriculture:{
    skills_ja:['農業センサーデータ収集 (MQTT)','収穫予測モデル (ML統合)','農薬・肥料使用記録 (JGAP準拠)','圃場管理・地図連携'],
    skills_en:['Agricultural sensor data collection (MQTT)','Harvest forecasting model (ML integration)','Pesticide & fertilizer records (JGAP)','Field management & map integration'],
    res_ja:['[農林水産省 スマート農業](https://www.maff.go.jp/j/kanbo/smart/)','[Google Earth Engine](https://earthengine.google.com/)'],
    res_en:['[NASA EarthData API](https://earthdata.nasa.gov/)','[OpenAgri Open API](https://openagri.eu/)']},
  energy:{
    skills_ja:['リアルタイム電力モニタリング','ピーク需要予測と負荷分散','スマートグリッド連携 (ECHONET)','FIT/FIP制度対応ロジック'],
    skills_en:['Real-time power monitoring','Peak demand forecasting & load balancing','Smart grid integration (ECHONET / OpenADR)','FIT / FIP regulation logic'],
    res_ja:['[ECHONET Lite](https://echonet.jp/spec_v113_lite/)','[経産省 エネルギー政策](https://www.meti.go.jp/policy/energy_environment/)'],
    res_en:['[OpenADR Alliance](https://www.openadr.org/)','[Energy Web Foundation](https://energy-web-foundation.gitbook.io/)']},
  automation:{
    skills_ja:['ワークフロー実行保証 (べき等性)','エラー検出・自動リトライ設計','ジョブキュー設計 (BullMQ/Temporal)','ステータス追跡・監視ダッシュボード'],
    skills_en:['Workflow execution guarantee (idempotency)','Error detection & auto-retry design','Job queue design (BullMQ / Temporal)','Status tracking & monitoring dashboard'],
    res_ja:['[Temporal Docs](https://docs.temporal.io/)','[BullMQ Documentation](https://docs.bullmq.io/)'],
    res_en:['[Temporal Documentation](https://docs.temporal.io/)','[BullMQ Docs](https://docs.bullmq.io/)']},
};
function _p7DomainSection(domain,G,T){
  var d=_P7_DOMAIN[domain];if(!d)return '';
  var skills=G?d.skills_ja:d.skills_en;
  var res=G?d.res_ja:d.res_en;
  var out='\n## '+(G?'ドメイン固有スキル ('+domain+')':'Domain-Specific Skills ('+domain+')')+'\n';
  skills.forEach(function(s){out+='- [ ] '+s+'\n';});
  out+='\n### '+(G?'参考リソース':'References')+'\n';
  res.forEach(function(r){out+=r+'\n';});
  return out;
}

function genPillar7_Roadmap(a,pn){
  const T=k=>(GT[S.genLang]||GT.en)[k]||GT.en[k]||k;
  const level=a.skill_level||'Intermediate';const goal=a.learning_goal||(S.genLang==='ja'?'6ヶ月標準':'6-month standard');
  const fe=a.frontend||'React + Next.js';const be=a.backend||'Node.js + Express';
  const mob=a.mobile||T('none');const ai=a.ai_auto||T('none');const pay=a.payment||T('none');
  const noMob=mob===GT.ja.none||mob===GT.en.none;const noAI=ai===GT.ja.none||ai===GT.en.none;const noPay=pay===GT.ja.none||pay===GT.en.none;
  const isB=level.includes('Beginner');const isP=level.includes('Professional');
  const _auth=resolveAuth(a);const _arch=resolveArch(a);
  const _ormR=resolveORM(a);const _orm=_ormR.name;
  const months=goal.includes('3')?3:goal.includes('12')?12:6;
  const slug=pn.toLowerCase().replace(/[^a-z0-9]/g,'-');

  /* ── 1. LEARNING_PATH.md ── */
  const lpath=a.learning_path||'';
  const _p7dom=detectDomain(a.purpose);const _p7G=S.genLang==='ja';
  S.files['roadmap/LEARNING_PATH.md']=`# ${pn} — ${T('lp_title')}
> ${T('lp_skill')}: ${level} | ${T('lp_target')}: ${goal}${lpath?' | '+T('lp_path')+': '+lpath:''} | Generated by DevForge v9

## Layer 1: ${T('l1')} ${isB?'[Month 1-2]':'[Week 1-2]'}
${isB?`- [ ] ${T('html5b')}\n- [ ] ${T('css3b')}\n- [ ] ${T('jsb')}`:`- [ ] ${T('tsAdv')}\n- [ ] ${T('cssAdv')}`}

## Layer 2: ${T('l2')} [${isB?'Month 3-4':'Month 1-2'}]
- [ ] ${fe} ${T('setup')}
- [ ] Tailwind CSS + shadcn/ui
- [ ] ${T('stMgmt')} (Zustand/Redux)
- [ ] React Query (${T('dataFetch')})
- [ ] ${T('testing')} (Vitest + Playwright)

## Layer 3: ${T('l3')} [${isB?'Month 5-6':'Month 2-3'}]
- [ ] ${be} ${T('setup')}
- [ ] ${T('dbDesign')} + ${_orm}
- [ ] REST API / GraphQL
- [ ] ${T('auth')} (${_auth.sot})
${!noMob?`\n## Layer 3.5: ${T('l3m')} [Month ${isB?7:4}-${isB?8:5}]\n- [ ] ${mob} ${T('mobEnv')}\n- [ ] ${T('mobNav')}\n- [ ] ${T('mobNative')}\n- [ ] ${T('mobStore')}\n`:''}
## Layer 4: DevOps [${isB?'Month '+(noMob?7:9):'Month '+(noMob?4:6)}]
- [ ] Docker + DevContainer
- [ ] GitHub Actions CI/CD
- [ ] ${a.deploy||'Vercel'} ${T('deploy')}
- [ ] ${T('monitor')}

## Layer 5: ${T('l5')} [${isB?'Month '+(noMob?8:10):'Month '+(noMob?5:7)}]
- [ ] ${(a.ai_tools||'Cursor').split(', ')[0]} ${T('aiUse')}
- [ ] ${T('mcpCfg')}
- [ ] ${T('aiOpt')}
${!noAI?`- [ ] ${ai} ${T('practice')}\n`:''}${!noPay?`\n## Layer 6: ${T('l6')} [Month ${months-1}-${months}]\n- [ ] ${pay}\n- [ ] ${T('billing')}\n- [ ] ${T('opsScale')}\n`:''}
## Layer 7: ${T('l7')} [${T('l7span')}]
${(a.dev_methods||'TDD').split(', ').map(m=>'- [ ] '+m+' '+T('practice')).join('\n')}
${a.future_features?`\n## ${T('ff_title')} [${T('ff_span')}]\n${a.future_features.split(', ').map((f,i)=>'- [ ] Phase '+(i<2?2:3)+': '+f+' — '+T('ff_integrate')).join('\n')}\n`:''}${_p7dom?_p7DomainSection(_p7dom,_p7G,T):''}`;


  /* ── 2. TECH_STACK_GUIDE.md ── */
  const feR=fe.includes('Next')?T('nextR'):fe.includes('Vue')?T('vueR'):T('feGenR');
  const beR=be.includes('Supabase')?T('supaR'):be.includes('Express')?T('expR'):be.includes('NestJS')?T('nestR'):T('beGenR');
  const dbVal=a.database||'PostgreSQL';
  const dbR=dbVal.includes('Postgre')?T('pgR'):T('dbGenR');
  const dpVal=a.deploy||'Vercel';
  const dpR=dpVal.includes('Vercel')?T('vercelR'):T('deployGenR');

  S.files['roadmap/TECH_STACK_GUIDE.md']=`# ${pn} — ${T('ts_title')}
> Generated by DevForge v9

## ${T('ts_selected')}
| ${T('cat')} | ${T('tech')} | ${T('rationale')} |
|---------|------|------|
| ${T('feLabel')} | ${fe} | ${feR} |
| ${T('beLabel')} | ${be} | ${beR} |
| ${T('dbLabel')} | ${dbVal} | ${dbR} |
| ${T('deployLabel')} | ${dpVal} | ${dpR} |
${!noMob?`| ${T('mobileLabel')} | ${mob} | ${mob.includes('Expo')?T('expoR'):T('mobGenR')} |\n`:''}${!noPay?`| ${T('payLabel')} | ${pay} | ${T('payR')} |\n`:''}
## ${T('ts_deps')}
\`\`\`
${fe} ←→ ${be} ←→ ${dbVal}
  ↓           ↓
Tailwind    ${_orm}
  ↓           ↓
shadcn/ui   ${dpVal}
\`\`\`

## ${T('ts_versions')}
- Node.js: 22 LTS
- React: 19+
- Next.js: 15+
- TypeScript: 5.7+
- ${_orm}: ${_arch.isBaaS?"SDK latest":"6+"}
`;

  /* ── 3. MOBILE_GUIDE.md ── */
  S.files['roadmap/MOBILE_GUIDE.md']=!noMob?`# ${pn} — ${T('mob_title')}
> ${mob} | Generated by DevForge v9

## ${T('mob_env')}
\`\`\`bash
npx create-expo-app ${slug}-mobile --template blank-typescript
cd ${slug}-mobile
npx expo install expo-router expo-camera expo-notifications
\`\`\`

## ${T('mob_dir')}
\`\`\`
app/
├── (tabs)/
│   ├── index.tsx       # ${T('mob_home')}
│   ├── explore.tsx     # ${T('mob_explore')}
│   └── profile.tsx     # ${T('mob_profile')}
├── _layout.tsx         # ${T('mob_root')}
└── +not-found.tsx      # 404
\`\`\`

## EAS Build${T('mob_eas')}
\`\`\`json
{ "build": { "production": { "distribution": "store" }, "preview": { "distribution": "internal" } } }
\`\`\`

## ${T('mob_libs')}
- NativeWind (Tailwind for RN)
- React Native Reanimated (${T('mob_anim')})
- FlashList (${T('mob_list')})
- Expo Image (${T('mob_img')})
`:`# ${T('mob_title')}\n\n${T('mob_none')}`;

  /* ── 4. TOOLS_SETUP.md ── */
  const aiTools=(a.ai_tools||'Cursor').split(', ');
  const toolLines=aiTools.map(t=>`- **${t}**: ${t==='Cursor'?'https://cursor.sh/':t.includes('Antigravity')?'https://antigravity.google/':t.includes('Claude')?'Claude Code CLI: npm install -g @anthropic-ai/claude-code':t.includes('Aider')?'pip install aider-chat (BYOK)':t.includes('Amazon Q')?T('tool_vsInst')+' / aws.amazon.com/q/developer/':t.includes('Augment')?T('tool_vsInst')+' / augmentcode.com':t.includes('Tabnine')?T('tool_vsInst')+' / tabnine.com':t.includes('OpenRouter')?'https://openrouter.ai/ (API key)':t.includes('Copilot')?T('tool_vsInst'):T('tool_official')}`).join('\n');

  S.files['roadmap/TOOLS_SETUP.md']=`# ${pn} — ${T('tool_title')}
> Generated by DevForge v9

## 1. ${T('tool_essential')}
\`\`\`bash
# Node.js (${T('tool_rec')}: v22 LTS)
# https://nodejs.org/

# ${T('tool_pkgmgr')}
npm install -g pnpm

# ${T('tool_init')}
pnpm create next-app ${slug} --typescript --tailwind --eslint

# ${T('tool_docker')}
docker compose up -d
\`\`\`

## 2. ${T('tool_ai')}
${toolLines}

## 3. VS Code ${T('tool_ext')}
- ESLint, Prettier, Tailwind CSS IntelliSense
- ${_arch.isBaaS?(be.includes("Supabase")?"supabase.supabase-vscode":"ms-azuretools.vscode-azurefunctions"):"prisma.prisma"}, GitLens, Error Lens
- GitHub Copilot (${T('tool_used')})

## 4. ${T('tool_env')} (.env.example)
\`\`\`
DATABASE_URL="postgresql://dev:devpass@localhost:5432/${slug.replace(/-/g,'_')}"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
${pay.includes('Stripe')?'STRIPE_SECRET_KEY="sk_test_..."\nSTRIPE_PUBLISHABLE_KEY="pk_test_..."\nSTRIPE_WEBHOOK_SECRET="whsec_..."':''}
\`\`\`
`;

  /* ── 5. RESOURCES.md ── */
  /* Specialist domain tools lookup (DOMAIN_TOOLS_DB, presets-ext2.js) */
  var _p7res_dom='';
  {var _p7Gx=S.genLang==='ja';var _p7pfx={'civil_':'civil_eng','bt_':'braintech','dl_':'digital_legacy','ds_':'data_sovereignty','sp_':'space_data','cr_':'climate_resilience','av_':'ai_avatar','ct_':'civic_tech','cc_':'childcare','nm_':'nomad_life'};var _p7dtdb_key=null;if(typeof DOMAIN_TOOLS_DB!=='undefined'&&S.preset&&S.preset.indexOf('field:')===0){var _p7pid=S.preset.slice(6);for(var _p7k in _p7pfx){if(_p7pid.indexOf(_p7k)===0){_p7dtdb_key=_p7pfx[_p7k];break;}}}if(_p7dtdb_key&&DOMAIN_TOOLS_DB[_p7dtdb_key]){var _p7db=DOMAIN_TOOLS_DB[_p7dtdb_key];_p7res_dom='\n## '+(_p7Gx?'ドメイン固有ツール推奨表 ('+_p7dtdb_key+')':'Domain-Specific Tools ('+_p7dtdb_key+')')+'\n\n';_p7res_dom+='| '+(_p7Gx?'規模':'Scale')+' | '+(_p7Gx?'推奨ツール':'Recommended Tools')+' |\n|------|------|\n';[['solo',_p7Gx?'Solo（1名）':'Solo (1)'],['small',_p7Gx?'Small（2-10名）':'Small (2-10)'],['medium',_p7Gx?'Medium（11-50名）':'Medium (11-50)'],['large',_p7Gx?'Large（50名+）':'Large (50+)']].forEach(function(r){if(_p7db[r[0]]&&_p7db[r[0]].length)_p7res_dom+='| '+r[1]+' | '+_p7db[r[0]].join(', ')+' |\n';});_p7res_dom+='\n';}}
  S.files['roadmap/RESOURCES.md']=`# ${pn} — ${T('res_title')}
> Generated by DevForge v9

## ${T('res_official')}
${fe.includes('React')?'- [React](https://react.dev/)\n- [Next.js](https://nextjs.org/docs)':''}
${fe.includes('Vue')?'- [Vue 3](https://vuejs.org/)\n- [Nuxt](https://nuxt.com/)':''}
${be.includes('Node')?'- [Node.js](https://nodejs.org/docs/)':''}
${be.includes('Supabase')?'- [Supabase](https://supabase.com/docs)':''}
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [${_orm}](${_ormR.isBaaS?(be.includes('Supabase')?'https://supabase.com/docs':be.includes('Firebase')?'https://firebase.google.com/docs':'https://docs.convex.dev'):_orm.includes('Drizzle')?'https://orm.drizzle.team/docs/overview':_orm.includes('TypeORM')?'https://typeorm.io':_orm.includes('SQLAlchemy')?'https://docs.sqlalchemy.org':_orm.includes('Kysely')?'https://kysely.dev/docs/getting-started':'https://www.prisma.io/docs'})

## ${T('res_ai')}
- [CLAUDE.md ${T('res_bp')}](https://docs.anthropic.com/)
- [Cursor ${T('res_docs')}](https://docs.cursor.com/)
- [MCP ${T('res_proto')}](https://modelcontextprotocol.io/)
${!noAI?`- [Vibe Coding ${T('res_patterns')}](https://vibecoding.dev/)`:''}\

## ${T('res_books')}
- "${T('res_fullstack')}" (${isB?T('res_beg'):T('res_int')})
- "${T('res_tsPractice')}"
- "${(a.dev_methods||'TDD').split(', ')[0]}${T('res_design')}"
${!noPay?`- "${T('res_saas')}"\n- "${T('res_headless')}"`:''}\
${_p7res_dom}`;

  /* ── 6. MILESTONES.md ── */
  const msLabels=T('ms_m');
  S.files['roadmap/MILESTONES.md']=`# ${pn} — ${T('ms_title')}
> ${T('ms_target')}: ${goal} | Generated by DevForge v9

${Array.from({length:months},(_,i)=>`## Month ${i+1}: ${(typeof msLabels==='object'?msLabels:GT.en.ms_m)[Math.min(i,6)]}
- [ ] ${T('ms_criteria')}
- [ ] ${T('ms_review')}
- [ ] ${T('ms_retro')}`).join('\n\n')}
`;

  /* ── 7. AI_WORKFLOW.md ── */
  S.files['roadmap/AI_WORKFLOW.md']=`# ${pn} — ${T('aiw_title')}
> Generated by DevForge v9

## ${T('aiw_flow')}
\`\`\`
1. ${T('aiw_s1')} → 2. ${T('aiw_s2')} → 3. ${T('aiw_s3')} → 4. ${T('aiw_s4')} → 5. ${T('aiw_s5')} → 6. ${T('aiw_s6')}
\`\`\`

## ${T('aiw_select')}
| ${T('aiw_task')} | ${T('aiw_rec')} | ${T('rationale')} |
|--------|-----------|------|
| ${T('aiw_newfile')} | ${aiTools[0]} | ${T('aiw_ctx')} |
| ${T('aiw_bugfix')} | Claude Code | ${T('aiw_term')} |
| ${T('aiw_testgen')} | GitHub Copilot | ${T('aiw_inline')} |
| ${T('aiw_refactor')} | Cursor | ${T('aiw_multi')} |

## ${T('aiw_mcp')}
1. **context7**: ${T('aiw_mcp1')}
2. **filesystem**: ${T('aiw_mcp2')}
3. **playwright**: ${T('aiw_mcp3')}

## ${T('aiw_prompt')}

### 1. ${T('aiw_addFeature')}
\`\`\`
${T('aiw_promptText')}
\`\`\`

### 2. ${T('aiw_bugfixPrompt')}
\`\`\`
${T('aiw_bugfixText')}
\`\`\`

### 3. ${T('aiw_refactorPrompt')}
\`\`\`
${T('aiw_refactorText')}
\`\`\`
`;

  /* ── 8. AI_AUTONOMOUS.md ── */
  const aiIsVibe=ai.includes('Vibe');const aiIsMulti=ai.includes('マルチ')||ai.includes('Multi');const aiIsFull=ai.includes('フル')||ai.includes('Full');
  S.files['roadmap/AI_AUTONOMOUS.md']=!noAI?`# ${pn} — ${T('aia_title')}
> ${T('aia_level')}: ${ai} | Generated by DevForge v9

## ${T('aia_vibe')}
${T('aia_vibeDesc')}

### ${T('aia_basic')}
1. **${T('aia_f1')}**: ${T('aia_f1ex')}
2. **${T('aia_f2')}**: ${T('aia_f2ex')}
3. **${T('aia_f3')}**: ${T('aia_f3ex')}
4. **${T('aia_f4')}**: ${T('aia_f4ex')}

### ${T('aia_tools')}
${aiIsVibe?`- ${T('aia_vibe1')}\n- ${T('aia_vibe2')}\n- ${T('aia_vibe3')}`:''}
${aiIsMulti?`- ${T('aia_multi1')}\n- ${T('aia_multi2')}\n- ${T('aia_multi3')}`:''}
${aiIsFull?`- ${T('aia_full1')}\n- ${T('aia_full2')}\n- ${T('aia_full3')}\n- ${T('aia_async1')}`:''}

### ${T('aia_bp')}
1. ${T('aia_bp1')}
2. ${T('aia_bp2')}
3. ${T('aia_bp3')}
4. ${T('aia_bp4')}
`:`# ${T('aia_title')}\n\n${T('aia_none')}${aiTools[0]}${T('aia_none2')}`;

  /* ── 9. SAAS_COMMERCE_GUIDE.md ── */
  S.files['roadmap/SAAS_COMMERCE_GUIDE.md']=!noPay?`# ${pn} — ${T('sc_title')}
> ${T('sc_selected')}: ${pay} | Generated by DevForge v9

## ${T('sc_compare')}
| ${T('sc_platform')} | ${T('sc_rate')} | MoR | ${T('sc_feat')} |
|---------------|------|-----|------|
| Stripe | 2.9%+30¢ | Beta | ${T('sc_stripe')} |
| Paddle | 5%+50¢ | ✅ | ${T('sc_paddle')} |
| Lemon Squeezy (Stripe) | 5%+50¢ | ✅ | ${T('sc_lemon')} |

${pay.includes('Stripe')?`## ${T('sc_impl')}
\`\`\`bash
npm install stripe @stripe/stripe-js
\`\`\`

### Checkout Session
\`\`\`typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  mode: 'subscription',
  success_url: '/success',
  cancel_url: '/cancel',
});
\`\`\`

### ${T('sc_webhook')}
\`\`\`typescript
// POST /api/webhooks/stripe
const event = stripe.webhooks.constructEvent(body, sig, secret);
switch(event.type) {
  case 'checkout.session.completed': // ${T('sc_paid')}
  case 'invoice.paid': // ${T('sc_renew')}
  case 'customer.subscription.deleted': // ${T('sc_cancel')}
}
\`\`\`
`:''}${pay.includes('CMS')?`## ${T('sc_cms')} (microCMS)
\`\`\`bash
npm install microcms-js-sdk
\`\`\`

\`\`\`typescript
import { createClient } from 'microcms-js-sdk';
const client = createClient({
  serviceDomain: 'your-domain',
  apiKey: process.env.MICROCMS_API_KEY!,
});
const data = await client.getList({ endpoint: 'articles' });
\`\`\`
`:''}${pay.includes('EC')?`## ${T('sc_ec')} (Medusa)
\`\`\`bash
npx create-medusa-app@latest
\`\`\`
- ${T('sc_prodMgmt')}: Admin Dashboard
- ${T('sc_payment')}: Stripe Plugin
- ${T('sc_ship')}: ${T('sc_fulfill')}
`:''}
`:`# ${T('sc_title')}\n\n${T('sc_none')}`;
  S.files['roadmap/AI_ONBOARDING.md']=gen_ai_onboarding(S.genLang==='ja',a);
}

function gen_ai_onboarding(G,a){
  var doc='';
  var level=a.skill_level||'Intermediate';
  var isB=level.includes('Beginner');
  var isPro=level.includes('Professional');
  doc+='# '+(G?'AI開発ツール習得ガイド':'AI Development Tools Mastery Guide')+'\n\n';
  doc+='> '+(G?'スキルレベル: '+level+' | Generated by DevForge v9':'Skill Level: '+level+' | Generated by DevForge v9')+'\n\n';
  doc+='## '+(G?'§1 AIツール選定マトリクス':'§1 AI Tool Selection Matrix')+'\n\n';
  doc+='| '+(G?'タイプ':'Type')+' | '+(G?'ツール例':'Examples')+' | '+(G?'コスト':'Cost')+' | '+(G?'セットアップ':'Setup Ease')+' | '+(G?'推奨場面':'Best For')+' |\n';
  doc+='|------|----------|------|------------|----------|\n';
  doc+='| Editor | Cursor, Windsurf | $20/mo | '+(G?'簡単':'Easy')+' | '+(G?'日常コーディング':'Daily coding')+'|\n';
  doc+='| Desktop | Claude Desktop, ChatGPT | $20/mo | '+(G?'非常に簡単':'Very easy')+' | '+(G?'質問・設計相談':'Q&A, design discussion')+'|\n';
  doc+='| Extension | GitHub Copilot | $10/mo | '+(G?'簡単':'Easy')+' | '+(G?'IDE内補完':'IDE autocomplete')+'|\n';
  doc+='| CLI | Claude Code | $20+/mo | '+(G?'中程度':'Moderate')+' | '+(G?'大規模リファクタ・自動化':'Large refactors, automation')+'|\n\n';
  doc+='### '+(G?'プロジェクト規模別推奨':'Recommendation by Project Scale')+'\n\n';
  doc+='- '+(G?'**個人**: Cursor (GUI) → 認知負荷最小・即座に価値を実感':'**Solo**: Cursor (GUI) → minimal cognitive load, immediate value')+'\n';
  doc+='- '+(G?'**チーム**: GitHub Copilot + Claude Code → 均一品質':'**Team**: GitHub Copilot + Claude Code → uniform quality')+'\n';
  doc+='- '+(G?'**エンタープライズ**: Claude Code + カスタムMCP → 社内ナレッジ統合':'**Enterprise**: Claude Code + custom MCP → integrate internal knowledge')+'\n\n';
  doc+='## '+(G?'§2 3ステップ習得パス':'§2 3-Step Mastery Path')+'\n\n';
  doc+='### Step 1: '+(G?'GUI完結ツールで心理的安全性を確立 (Week 1-2)':'GUI Tools — Establish Psychological Safety (Week 1-2)')+'\n\n';
  doc+='**'+(G?'推奨ツール':'Recommended Tool')+'**: Cursor / Windsurf\n\n';
  doc+=(G?'#### 到達基準チェックリスト':'#### Achievement Criteria Checklist')+'\n';
  doc+='- [ ] '+(G?'コードの自動補完を使って機能追加ができる':'Can add features using auto-completion')+'\n';
  doc+='- [ ] '+(G?'チャットでエラーの原因を説明してもらえる':'Can get error explanations via chat')+'\n';
  doc+='- [ ] '+(G?'AI提案コードをレビューして安全にマージできる':'Can review and safely merge AI-suggested code')+'\n\n';
  doc+='### Step 2: '+(G?'CLI移行・Plan Mode活用 (Week 3-4)':'CLI Migration, Plan Mode (Week 3-4)')+'\n\n';
  doc+='**'+(G?'推奨ツール':'Recommended Tool')+'**: Claude Code\n\n';
  doc+='```bash\n# Plan Modeでリスクなく設計を相談\nclaude --plan "ユーザー認証機能を追加したい"\n\n# 承認後に実行\nclaude "認証機能を実装してください"\n```\n\n';
  doc+=(G?'#### 到達基準チェックリスト':'#### Achievement Criteria Checklist')+'\n';
  doc+='- [ ] '+(G?'Plan Modeで実装方針を確認してから作業を始められる':'Can confirm implementation via Plan Mode before working')+'\n';
  doc+='- [ ] '+(G?'CLAUDE.mdでプロジェクト固有ルールをAIに伝えられる':'Can communicate project rules to AI via CLAUDE.md')+'\n';
  doc+='- [ ] '+(G?'バッチ処理・リファクタリングを安全に委任できる':'Can safely delegate batch processing and refactoring')+'\n\n';
  if(!isB){
    doc+='### Step 3: '+(G?'マルチAgent協調 (Month 2+)':'Multi-Agent Coordination (Month 2+)')+'\n\n';
    doc+='**'+(G?'推奨構成':'Recommended Setup')+'**: Claude Code + GitHub Copilot + Devin/Codex\n\n';
    doc+=(G?'#### 到達基準チェックリスト':'#### Achievement Criteria Checklist')+'\n';
    doc+='- [ ] '+(G?'Creator/Operatorの役割分離ができている':'Creator/Operator role separation is established')+'\n';
    doc+='- [ ] '+(G?'plan.md経由でAgent間ハンドオフができる':'Agent handoff via plan.md is working')+'\n';
    doc+='- [ ] '+(G?'月次AIコストをROI計算できる':'Can calculate monthly AI cost ROI')+'\n\n';
  }
  if(!isPro){
    doc+='## '+(G?'§3 非エンジニア向けSOP自動化':'§3 SOP Automation for Non-Engineers')+'\n\n';
    doc+='### '+(G?'業務自動化テンプレート':'Business Automation Templates')+'\n\n';
    doc+='**'+(G?'日次レポート自動生成':'Daily Report Auto-Generation')+'**\n';
    doc+='```\n'+(G?'プロンプト: "昨日のコミット履歴からchangelog.mdを更新してください"':'Prompt: "Update changelog.md from yesterday\'s commit history"')+'\n```\n\n';
    doc+='**'+(G?'コードレビュー自動化':'Code Review Automation')+'**\n';
    doc+='```\n'+(G?'プロンプト: "PRの変更をレビューしてセキュリティ・パフォーマンス問題を指摘してください"':'Prompt: "Review PR changes and point out security/performance issues"')+'\n```\n\n';
    doc+='### '+(G?'認知負荷管理: 情報量の段階的開示':'Cognitive Load Management: Progressive Disclosure')+'\n\n';
    doc+='1. '+(G?'**レベル1**: AIに「何をすべきか」だけ聞く':'**Level 1**: Ask AI only "what should I do"')+'\n';
    doc+='2. '+(G?'**レベル2**: AIに「どうやるか」を確認してから実装委任':'**Level 2**: Confirm "how to do it" with AI before delegating')+'\n';
    doc+='3. '+(G?'**レベル3**: AIが自律的に複数ステップを実行 (監視のみ)':'**Level 3**: AI executes multiple steps autonomously (monitor only)')+'\n\n';
  }else{
    doc+='## '+(G?'§3 高度な自動化パターン (Pro)':'§3 Advanced Automation Patterns (Pro)')+'\n\n';
    doc+='- '+(G?'**Sub-agents**: `claude --subagent` でタスク並列分散実行':'**Sub-agents**: Parallel task distribution with `claude --subagent`')+'\n';
    doc+='- '+(G?'**Skills**: 再利用可能なプロンプトをskills/ディレクトリで管理':'**Skills**: Manage reusable prompts in skills/ directory')+'\n';
    doc+='- '+(G?'**Hooks**: ファイル保存/コミット時の自動AI処理':'**Hooks**: Automatic AI processing on file save/commit')+'\n\n';
  }
  doc+='## '+(G?'§4 学習リソースマップ':'§4 Learning Resource Map')+'\n\n';
  if(isB){
    doc+='### '+(G?'Beginner向けリソース':'Beginner Resources')+'\n\n';
    doc+='- '+(G?'**公式ドキュメント**: Claude Code Getting Started':'**Official Docs**: Claude Code Getting Started')+'\n';
    doc+='- '+(G?'**動画**: Cursor入門 (YouTube) — GUI操作の基礎':'**Videos**: Cursor Introduction (YouTube) — GUI basics')+'\n';
    doc+='- '+(G?'**実践課題**: このプロジェクトのREADME.mdをAIと一緒に充実させる':'**Practice**: Enhance this project\'s README.md together with AI')+'\n';
  }else{
    doc+='### '+(G?'Intermediate/Pro向けリソース':'Intermediate/Pro Resources')+'\n\n';
    doc+='- '+(G?'**公式ドキュメント**: Claude Code MCP — カスタムツール統合':'**Official Docs**: Claude Code MCP — Custom tool integration')+'\n';
    doc+='- '+(G?'**コミュニティ**: Claude Discord / GitHub Discussions':'**Community**: Claude Discord / GitHub Discussions')+'\n';
    doc+='- '+(G?'**実践課題**: このプロジェクトのCI/CDパイプラインをAIで最適化する':'**Practice**: Optimize this project\'s CI/CD pipeline with AI')+'\n';
  }
  return doc;
}
