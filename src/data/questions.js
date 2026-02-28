/* ═══ QUESTIONS (Skill-Aware Dynamic) ═══ */
/* KPI chip builder — purpose-linked dynamic chips */
function _kpiChips(ja,lv){
  const p=(S.answers.purpose||'').toLowerCase();
  // Common KPIs (always shown)
  const common=ja
    ?['📈 月間1000ユーザー','📈 DAU 100+','😊 NPS 50以上','⚡ レスポンス200ms以内','⚡ 稼働率99.9%+']
    :['📈 1,000 MAU','📈 100+ DAU','😊 NPS 50+','⚡ <200ms response','⚡ 99.9%+ uptime'];
  // Purpose-specific KPI pools
  const pools=ja?{
    saas:['💰 月売上10万円(MRR)','🔄 月間チャーン5%以下','🔄 DAU/MAU比率30%+','💰 LTV5万円','🔄 機能利用率80%+','💰 ARPU500円'],
    ec:['💰 GMV月100万円','💰 CV率3%+','🏪 カート放棄30%以下','🏪 客単価3000円','🏪 取引完了率95%+','😊 レビュー評価4.5★+'],
    marketplace:['💰 GMV月100万円','💰 テイクレート10%','🏪 月500新規出品','🏪 取引完了率95%+','👥 需給バランス比率'],
    education:['📚 コース完了率80%+','📚 クイズ合格率70%+','📚 視聴完了率70%+','📚 月100修了証発行','🔄 7日連続利用率50%+','🔄 セッション時間5分+'],
    community:['👥 日次投稿50件+','👥 メンバー月10%増','👥 UGC率30%+','👥 アクティブグループ70%+','🔄 DAU/MAU比率30%+'],
    content:['📚 月30記事公開','📚 月間5000PV','📚 開封率30%+','📚 CTR 5%+','🔄 セッション時間5分+','💰 購読者月10%増'],
    analytics:['🏢 レポート作成1分以内','🏢 日次100万件処理','😊 CSAT 4.5/5','⚡ エラー率0.1%以下'],
    automation:['🤖 手動作業70%削減','🤖 処理時間50%短縮','⚡ エラー率0.1%以下','⚡ API成功率99.5%+','🏢 タスク完了率90%+'],
    ai:['🤖 AI正答率90%+','🤖 有人対応20%以下','🤖 生成品質スコア4/5','🤖 プロンプト成功率85%+','😊 CSAT 4.5/5'],
    portfolio:['📈 月間5000PV','📚 CTR 5%+','⚡ LCP 2.5秒以内','😊 問合せ率3%+'],
    booking:['🏪 予約転換率60%+','🏪 リソース稼働率80%+','🏪 ノーショー5%以下','😊 CSAT 4.5/5','💰 月間予約500件+'],
    fintech:['💰 月間取引高1000万円','🏢 不正検知率99%+','⚡ 決済成功率99.5%+','😊 CSAT 4.5/5'],
    hr:['🏢 採用日数30日以内','🏢 オファー承諾率80%+','🏢 オンボーディング完了率95%+','😊 従業員満足度4/5'],
    health:['🔄 7日連続利用率50%+','🔄 目標達成率60%+','📚 データ記録率80%+','😊 ユーザー継続率70%+'],
    iot:['⚡ デバイス稼働率95%+','⚡ データ遅延1秒以内','⚡ アラート応答5分以内','🏢 デバイス接続1000台+'],
    event:['🏪 チケット販売率80%+','😊 参加者満足度4.5/5','👥 リピート参加率40%+','💰 イベント収益目標達成'],
    gamify:['🔄 バッジ獲得率60%+','🔄 デイリークエスト完了率50%+','🔄 リーダーボード参加率30%+','📈 エンゲージメント率40%+'],
    collab:['👥 同時編集5人+','👥 編集頻度日次10回+','🔄 機能利用率80%+','😊 NPS 50以上'],
    devtool:['📈 API呼出月10万回','📈 開発者登録月100人+','📚 ドキュメントカバレッジ90%+','⚡ API成功率99.5%+'],
    creator:['💰 ファンLTV1万円','💰 コンテンツ収益化率20%+','👥 ファンエンゲージメント率30%+','📈 購読者月10%増'],
    newsletter:['📚 開封率30%+','📚 CTR 5%+','💰 有料購読者月5%増','📈 購読者月10%増'],
    chatbot:['🤖 自動解決率80%+','🤖 有人対応20%以下','😊 CSAT 4.5/5','⚡ 応答時間2秒以内'],
    pwa:['📈 インストール率10%+','📈 オフライン利用率20%+','🔄 プッシュ通知開封率30%+','⚡ LCP 2.5秒以内'],
    tool:['🏢 タスク完了率90%+','🏢 処理時間50%短縮','😊 CSAT 4.5/5','⚡ 稼働率99.9%+','🔄 機能利用率80%+']
  }:{
    saas:['💰 $1K MRR','🔄 <5% monthly churn','🔄 30%+ DAU/MAU','💰 $500 LTV','🔄 80%+ feature adoption','💰 $5 ARPU'],
    ec:['💰 $10K GMV','💰 3%+ conversion','🏪 <30% cart abandon','🏪 $30 AOV','🏪 95%+ fulfillment','😊 4.5★+ reviews'],
    marketplace:['💰 $10K GMV','💰 10% take rate','🏪 500 listings/mo','🏪 95%+ fulfillment','👥 Supply/demand balance'],
    education:['📚 80%+ completion','📚 70%+ quiz pass','📚 70%+ watch-through','📚 100 certs/month','🔄 50%+ 7-day streak','🔄 5min+ session'],
    community:['👥 50+ posts/day','👥 10%+ member growth/mo','👥 30%+ UGC ratio','👥 70%+ active groups','🔄 30%+ DAU/MAU'],
    content:['📚 30 posts/month','📚 5,000 PV/month','📚 30%+ open rate','📚 5%+ CTR','🔄 5min+ session','💰 10%+ subscriber growth/mo'],
    analytics:['🏢 Reports in <1min','🏢 1M records/day','😊 CSAT 4.5/5','⚡ <0.1% error rate'],
    automation:['🤖 70% manual reduction','🤖 50% time saved','⚡ <0.1% error rate','⚡ 99.5%+ API success','🏢 90%+ task completion'],
    ai:['🤖 90%+ AI accuracy','🤖 <20% human handoff','🤖 4/5 quality score','🤖 85%+ prompt success','😊 CSAT 4.5/5'],
    portfolio:['📈 5,000 PV/month','📚 5%+ CTR','⚡ LCP <2.5s','😊 3%+ inquiry rate'],
    booking:['🏪 60%+ booking conv.','🏪 80%+ utilization','🏪 <5% no-show','😊 CSAT 4.5/5','💰 500+ bookings/mo'],
    fintech:['💰 $100K transactions/mo','🏢 99%+ fraud detection','⚡ 99.5%+ payment success','😊 CSAT 4.5/5'],
    hr:['🏢 <30 days time-to-hire','🏢 80%+ offer acceptance','🏢 95%+ onboarding','😊 4/5 employee satisfaction'],
    health:['🔄 50%+ 7-day streak','🔄 60%+ goal achievement','📚 80%+ data logging','😊 70%+ user retention'],
    iot:['⚡ 95%+ device uptime','⚡ <1s data latency','⚡ <5min alert response','🏢 1,000+ devices'],
    event:['🏪 80%+ sell-through','😊 4.5/5 attendee satisfaction','👥 40%+ repeat attendance','💰 Revenue target met'],
    gamify:['🔄 60%+ badge earn rate','🔄 50%+ daily quest','🔄 30%+ leaderboard participation','📈 40%+ engagement rate'],
    collab:['👥 5+ concurrent editors','👥 10+ daily edits','🔄 80%+ feature adoption','😊 NPS 50+'],
    devtool:['📈 100K API calls/mo','📈 100+ devs/month','📚 90%+ docs coverage','⚡ 99.5%+ API success'],
    creator:['💰 $100 fan LTV','💰 20%+ monetization rate','👥 30%+ fan engagement','📈 10%+ subscriber growth/mo'],
    newsletter:['📚 30%+ open rate','📚 5%+ CTR','💰 5%+ paid subscriber growth/mo','📈 10%+ subscriber growth/mo'],
    chatbot:['🤖 80%+ auto-resolution','🤖 <20% human handoff','😊 CSAT 4.5/5','⚡ <2s response time'],
    pwa:['📈 10%+ install rate','📈 20%+ offline usage','🔄 30%+ push open rate','⚡ LCP <2.5s'],
    tool:['🏢 90%+ task completion','🏢 50% time saved','😊 CSAT 4.5/5','⚡ 99.9%+ uptime','🔄 80%+ feature adoption']
  };
  // Field preset category KPI override (checked before purpose-text regex)
  if((S.preset||'').slice(0,6)==='field:'&&typeof PR_FIELD!=='undefined'){
    var _fpKi=PR_FIELD[S.preset.slice(6)];var _fpCK=_fpKi?(_fpKi.field||''):'';
    var _fpKP=ja?{engineering:['🏭 ライン稼働率95%+','⚡ 不良品率0.1%以下','⚡ アラート5分以内'],science:['📚 再現率95%+','📚 分析精度90%+','⚡ 処理速度50%向上'],agriculture:['🌾 収穫量15%増','🌾 農薬20%削減','⚡ 記録率80%+'],medical:['😊 医師効率30%向上','⚡ 誤診防止95%+','😊 患者満足度4.5/5'],social:['📈 月間5万リーチ','💰 エンゲージメント5%+','📈 シェア3%+'],humanities:['📚 処理速度50%向上','📚 検索精度90%+'],education_field:['📚 完了率80%+','📚 合格率75%+','🔄 7日継続50%+'],art:['💰 月10件販売','💰 収益20%増','👥 エンゲージメント30%+'],interdisciplinary:['🏢 完了率90%+','📈 効率50%向上'],environment:['🌿 CO2 10%削減','🌿 ESGスコア向上','⚡ エネルギー効率15%+'],architecture:['🏗️ 工数30%削減','😊 顧客満足度4.5/5'],sports:['🏆 パフォーマンス10%向上','🏆 怪我20%削減','🔄 継続率80%+'],welfare:['😊 負担30%削減','😊 満足度4.5/5','📚 記録精度95%+'],tourism:['🏪 予約率60%+','😊 満足度4.5/5','💰 客単価30%増'],biotech:['💊 候補絞り込み50%向上','⚡ 分析精度95%+'],mobility:['🚗 運行効率20%向上','⚡ 遅延5%以下','🚗 満足度4.5/5'],cybersecurity:['🔒 検知率99%+','🔒 対応30分以内','⚡ 誤検知1%以下'],fintech_field:['💰 速度50%向上','🏢 違反ゼロ','⚡ 稼働99.99%+'],smart_factory:['🏭 生産20%向上','⚡ 稼働率95%+','🏭 不良0.5%以下'],cross_theme:['🏢 効率40%向上','📈 導入率90%+','😊 継続率80%+']}:{engineering:['🏭 95%+ line utilization','⚡ <0.1% defect rate','⚡ <5min alert'],science:['📚 95%+ reproducibility','📚 90%+ accuracy','⚡ 50% faster'],agriculture:['🌾 15% yield increase','🌾 20% less pesticide','⚡ 80%+ logging'],medical:['😊 30% doctor efficiency','⚡ 95%+ error prevention','😊 4.5/5 satisfaction'],social:['📈 50K reach/month','💰 5%+ engagement','📈 3%+ share'],humanities:['📚 50% faster processing','📚 90%+ search accuracy'],education_field:['📚 80%+ completion','📚 75%+ pass rate','🔄 50%+ streak'],art:['💰 10 sales/month','💰 20%+ revenue','👥 30%+ engagement'],interdisciplinary:['🏢 90%+ completion','📈 50% efficiency gain'],environment:['🌿 10% CO2 reduction','🌿 Better ESG score','⚡ 15% energy saving'],architecture:['🏗️ 30% time saved','😊 4.5/5 client satisfaction'],sports:['🏆 10% performance gain','🏆 20% injury reduction','🔄 80%+ adherence'],welfare:['😊 30% burden reduction','😊 4.5/5 satisfaction','📚 95%+ accuracy'],tourism:['🏪 60%+ booking rate','😊 4.5/5 satisfaction','💰 30% more spending'],biotech:['💊 50% faster screening','⚡ 95%+ accuracy'],mobility:['🚗 20% efficiency','⚡ <5% delay','🚗 4.5/5 satisfaction'],cybersecurity:['🔒 99%+ detection','🔒 <30min response','⚡ <1% false positives'],fintech_field:['💰 50% faster transactions','🏢 zero violations','⚡ 99.99%+ uptime'],smart_factory:['🏭 20% production gain','⚡ 95%+ uptime','🏭 <0.5% defects'],cross_theme:['🏢 40% efficiency','📈 90%+ adoption','😊 80%+ retention']};
    if(_fpCK&&_fpKP[_fpCK]){var _fks=new Set();var _fka=[...common,..._fpKP[_fpCK]].filter(c=>{if(_fks.has(c))return false;_fks.add(c);return true;});if(lv==='beginner')return _fka.slice(0,6);if(lv==='pro')return _fka;var _fkc=S.skillLv===2?8:10;return _fka.slice(0,_fkc);}
  }
  // Detect purpose category from answer
  const detect=[
    [/SaaS|サブスク|subscription/i,'saas'],
    [/EC|Eコマース|E-Commerce|ショップ|shop|commerce/i,'ec'],
    [/マーケットプレイス|marketplace|売り手.*買い手|buyer.*seller/i,'marketplace'],
    [/教育|学習|Education|Learning|LMS|コース|course/i,'education'],
    [/コミュニティ|community|フォーラム|forum|交流/i,'community'],
    [/コンテンツ|content|メディア|media|ブログ|blog|ニュース|news|配信/i,'content'],
    [/IoT|デバイス|device|センサー|sensor|監視|monitor/i,'iot'],
    [/分析|analytics|可視化|visualiz|ダッシュボード|dashboard|データ分析|data.*analy/i,'analytics'],
    [/チャットボット|chatbot|FAQ|カスタマー.*サポート|customer.*support/i,'chatbot'],
    [/AI|人工知能|エージェント|agent|対話型/i,'ai'],
    [/自動化|automat|ワークフロー|workflow|RPA|iPaaS/i,'automation'],
    [/ポートフォリオ|portfolio|実績|showcase/i,'portfolio'],
    [/予約|booking|スケジュール|schedule|予約/i,'booking'],
    [/金融|fintech|決済|payment|家計|budget|請求|invoice/i,'fintech'],
    [/HR|採用|recruit|人事|hiring/i,'hr'],
    [/健康|health|フィットネス|fitness|ウェルネス|wellness/i,'health'],
    [/イベント|event|チケット|ticket|開催/i,'event'],
    [/ゲーミ|gamif|ゲーム|game|ポイント|point|バッジ|badge/i,'gamify'],
    [/コラボ|collab|共同|同時編集|realtime/i,'collab'],
    [/開発者|developer|devtool|API|ユーティリティ|utility/i,'devtool'],
    [/クリエイター|creator|ファン|fan|コンテンツ販売/i,'creator'],
    [/ニュースレター|newsletter|メール配信|mail/i,'newsletter'],
    [/PWA|プログレッシブ|モバイルファースト|mobile.?first/i,'pwa'],
    [/業務|business|効率化|ツール|tool/i,'tool'],
  ];
  let matched=[];
  for(const[rx,key]of detect){if(rx.test(p)&&pools[key]){matched.push(...pools[key]);break;}}
  // If no match, add generic SaaS+tool mix
  if(!matched.length){
    const fallback=pools['saas'];
    matched.push(...fallback.slice(0,3));
  }
  // Deduplicate
  const seen=new Set();const all=[...common,...matched].filter(c=>{if(seen.has(c))return false;seen.add(c);return true;});
  // Skill-level trim
  if(lv==='beginner')return all.slice(0,6);
  if(lv==='pro')return all;
  // Lv2 (Getting Started) gets 8 chips as a stepping-stone between beginner(6) and intermediate(10)
  var kpiCount=S.skillLv===2?8:10;
  return all.slice(0,kpiCount);
}
function _uniq(a){var s=new Set();return a.filter(v=>{if(s.has(v))return false;s.add(v);return true;});}
function getQ(){
  const lv=S.skill;
  const ja=S.lang==='ja';
  var _qfpk=(S.preset||'').slice(0,6)==='field:'?S.preset.slice(6):'';
  var _qfpo=(_qfpk&&typeof PR_FIELD!=='undefined')?PR_FIELD[_qfpk]:null;
  var _qfpc=(_qfpo&&typeof FIELD_CAT_DEFAULTS!=='undefined')?FIELD_CAT_DEFAULTS[_qfpo.field]:null;
  function _fpPre(qId){
    if(!_qfpo)return [];
    var _ta=function(v){return Array.isArray(v)?v:String(v||'').split(',').map(function(s){return s.trim();}).filter(Boolean);};
    if(qId==='target'){var _t=((!ja)&&_qfpo.targetEn)||_qfpo.target||((!ja)&&_qfpc&&_qfpc.targetEn)||(_qfpc&&_qfpc.target)||[];return _ta(_t);}
    if(qId==='mvp_features'){var _f=((!ja)&&_qfpo.featuresEn)||_qfpo.features||[];return _ta(_f);}
    if(qId==='screens'){var _s=((!ja)&&_qfpo.screensEn)||_qfpo.screens||((!ja)&&_qfpc&&_qfpc.screensEn)||(_qfpc&&_qfpc.screens)||[];return _ta(_s);}
    if(qId==='data_entities'){return _ta(_qfpo.entities||'');}
    return [];
  }
  return {
  1:{name:ja?'プロジェクト定義':'Project Definition',questions:[
    {id:'purpose',q:ja?'プロジェクトの目的':'Project Purpose',type:'chip-text',chips:ja?['業務効率化ツール','コンテンツ配信','教育・学習支援','EC・マーケットプレイス','コミュニティ構築','ポートフォリオ','データ分析・可視化','自動化ツール','SaaS']:['Business Tool','Content Delivery','Education','E-Commerce','Community','Portfolio','Data Analytics','Automation','SaaS'],placeholder:ja?'自由入力…':'Type freely...',tip:ja?'「誰が何をできるようになるか」を明確に':'Clarify "who can do what"',help:'purpose'},
    {id:'target',q:ja?'ターゲットユーザー':'Target Users',type:'chip-multi',chips:_uniq([..._fpPre('target'),...(ja?['学生','フリーランス','スタートアップ','中小企業','エンジニア','デザイナー','教育者','一般消費者','管理者','経営者']:['Students','Freelancers','Startups','SMBs','Engineers','Designers','Educators','Consumers','Admins','Executives'])]),placeholder:ja?'追加…':'Add...',tip:ja?'具体的なペルソナをイメージしましょう':'Imagine a specific persona',help:'target'},
    {id:'success',q:ja?'成功指標（KPI）':'Success Metrics (KPI)',type:'chip-multi',chips:_kpiChips(ja,lv),placeholder:ja?'追加…':'Add...',tip:ja?'3〜5つに絞りましょう（プロジェクト種別に応じた指標を提案中）':'Pick 3-5 (suggestions based on your project type)',help:'success'},
    {id:'scope_out',q:ja?'スコープ外（やらないこと）':'Out of Scope',type:'chip-multi',chips:ja?['チャット機能','動画配信','決済機能','多言語対応','ネイティブアプリ','AI機能','管理画面','API公開','SNS連携','プッシュ通知']:['Chat','Video streaming','Payments','i18n','Native app','AI features','Admin panel','Public API','Social media','Push notifications'],placeholder:ja?'追加…':'Add...',tip:ja?'スコープを絞ることがMVP完成の鍵':'Scoping down is key to MVP success',help:'scope_out'},
    {id:'deadline',q:ja?'リリース目標':'Release Target',type:'options',options:[{label:ja?'2週間':'2 weeks',desc:ja?'超MVP':'Ultra MVP'},{label:ja?'1ヶ月':'1 month',desc:ja?'基本機能':'Basic features'},{label:ja?'3ヶ月':'3 months',desc:ja?'本格MVP':'Full MVP'},{label:ja?'6ヶ月':'6 months',desc:'v1.0'}],tip:ja?'MVPを優先しましょう':'Prioritize MVP',help:'deadline'},
  ]},
  2:{name:ja?'技術選定':'Tech Stack',questions:[
    {id:'frontend',q:ja?'フロントエンド':'Frontend',type:'options',options:[{label:'React + Next.js',desc:ja?'SSR/SSG/ISR — 求人最多・エコシステム最大':'SSR/SSG/ISR — most jobs & largest ecosystem'},{label:'React (Vite SPA)',desc:ja?'CSR高速 — 管理画面やSaaS向け':'Fast CSR — for admin panels & SaaS'},...(lv!=='beginner'?[{label:'Vue 3 + Nuxt',desc:ja?'学習容易・日本コミュニティ充実':'Easy to learn, strong JP community'},{label:'Svelte + SvelteKit',desc:ja?'最小バンドル・高速':'Smallest bundle, fast'},
{label:'Astro',desc:ja?'コンテンツサイト・静的サイト':'Content & static sites'}]:[]),...(lv==='pro'?[{label:'Angular',desc:ja?'エンタープライズ大規模':'Enterprise scale'},{label:'React Router v7 (Remix)',desc:ja?'Web標準・フレームワーク統合':'Web standards, framework-unified'}]:[])],tip:ja?'知っている技術が最速です':'Pick what you know',help:'frontend'},
    {id:'css_fw',q:ja?'CSSフレームワーク':'CSS Framework',type:'options',help:'css_fw',options:[{label:'Tailwind CSS',desc:ja?'2026年シェア1位 — ユーティリティファースト':'#1 in 2026 — utility-first'},{label:'shadcn/ui + Tailwind',desc:ja?'Radix UI + Tailwind — コピペUI':'Radix UI + Tailwind — copy-paste UI'},{label:'Bootstrap',desc:ja?'レガシー互換・クラス名でスタイル':'Legacy compat, class-based styling'},...(lv!=='beginner'?[{label:'CSS Modules',desc:ja?'スコープ付きCSS':'Scoped CSS'},
{label:'Vanilla CSS',desc:ja?'フレームワーク不使用':'No framework'}]:[])],tip:ja?'Tailwind CSSが2026年のデファクト':'Tailwind CSS is the 2026 standard'},
    {id:'backend',q:ja?'バックエンド/DB':'Backend/DB',type:'options',options:[{label:'Firebase',desc:ja?'Google BaaS — 最速プロトタイプ':'Google BaaS — fastest prototype'},{label:'Supabase',desc:ja?'OSS PostgreSQL BaaS — 急成長中':'OSS PostgreSQL BaaS — rapid growth'},...(lv!=='beginner'?[{label:'Node.js + Express',desc:ja?'実績豊富・エコシステム最大・Express 5.x':'Most proven, largest ecosystem, Express 5.x'},{label:'Node.js + Fastify',desc:ja?'Express 5x高速':'5x faster than Express'},
{label:'Node.js + NestJS',desc:ja?'DI・TypeScript完全対応':'DI, full TypeScript support'}]:[]),...(lv==='pro'?[{label:'Python + FastAPI',desc:ja?'AI/ML連携最適・非同期':'Best for AI/ML, async'},{label:'Python + Django',desc:ja?'フルスタック・管理画面付き':'Full-stack with admin panel'},{label:'Java + Spring Boot',desc:ja?'金融・エンタープライズ':'Finance & enterprise'},{label:'Go + Gin',desc:ja?'高パフォーマンス・マイクロサービス':'High-perf microservices'},
{label:'Hono',desc:ja?'Edge Runtime・超軽量':'Edge Runtime, ultra-light'},{label:'Bun + Hono',desc:ja?'Bun Runtime・高速起動・ネイティブ速度':'Bun Runtime — fast startup, native speed'},{label:'Deno + Hono',desc:ja?'Deno Runtime・セキュアデフォルト':'Deno Runtime — secure by default'}]:[]),{label:ja?'なし（静的サイト）':'None (static site)',desc:ja?'バックエンド不要':'No backend needed'}],tip:ja?'BaaSならコード不要で開始可能':'BaaS needs no server code',help:'backend'},
    {id:'database',q:ja?'データベース':'Database',type:'options',help:'database',condition:{backend:v=>!/なし|None|static/i.test(v)},options:[{label:'PostgreSQL',desc:ja?'2026年SQL推奨1位 — 堅牢・拡張性':'#1 SQL in 2026 — robust & extensible'},{label:'Supabase (PostgreSQL)',desc:ja?'BaaS + リアルタイム + Auth付き':'BaaS + realtime + Auth included'},{label:'Firebase Firestore',desc:ja?'NoSQL BaaS — スキーマレス':'NoSQL BaaS — schemaless'},...(lv!=='beginner'?[{label:'MongoDB',desc:ja?'ドキュメントDB — 柔軟スキーマ':'Document DB — flexible schema'},
{label:'MySQL',desc:ja?'実績豊富 — WordPress/Laravel':'Proven track record — WordPress/Laravel'}]:[]),...(lv==='pro'?[{label:'SQLite',desc:ja?'組込み/Edge — Turso互換':'Embedded/Edge — Turso compatible'},{label:'Redis',desc:ja?'キャッシュ/セッション/Pub-Sub':'Cache/Session/Pub-Sub'},{label:'Neon',desc:ja?'サーバーレスPostgreSQL':'Serverless PostgreSQL'},{label:'Turso (LibSQL)',desc:ja?'グローバルEdge SQLite — Drizzle最適':'Global Edge SQLite — best with Drizzle'},{label:'Cloudflare D1',desc:ja?'Workers専用SQLite — Edge最安':'Workers-native SQLite — cheapest edge DB'}]:[])],tip:ja?'迷ったらPostgreSQL':'When in doubt, PostgreSQL'},
    {id:'orm',q:ja?'ORM':'ORM',type:'options',help:'orm',condition:{backend:v=>!/Firebase|Supabase|Convex|なし|None|static/i.test(v)},options:[{label:'Prisma',desc:ja?'2026年Node.js ORM 1位 — 型安全・Studio付き':'#1 Node.js ORM 2026 — type-safe + Studio'},{label:'Drizzle',desc:ja?'軽量・SQLライク — TypeScript完全対応':'Lightweight SQL-like — full TypeScript'},...(lv!=='beginner'?[{label:'TypeORM',desc:ja?'デコレータベース — NestJS親和':'Decorator-based — NestJS compatible'}]:[]),...(lv==='pro'?[{label:'SQLAlchemy (Python)',desc:ja?'Python標準ORM':'Python standard ORM'},
{label:'Kysely',desc:ja?'SQL型安全ビルダー':'Type-safe SQL builder'}]:[]),{label:ja?'なし / BaaS使用':'None / Using BaaS',desc:ja?'Firebase/Supabase利用時':'When using Firebase/Supabase'}],tip:ja?'PrismaのStudioはDB管理に便利':'Prisma Studio is great for DB management'},
    {id:'dev_env_type',q:ja?'開発環境タイプ':'Dev Environment Type',type:'options',
      condition:{backend:v=>/Supabase|Firebase|Convex/i.test(v)},
      options:[
        {label:ja?'ローカル開発':'Local Development',desc:ja?'ローカルエミュレーターを自動起動':'Auto-start local emulators'},
        {label:ja?'クラウド接続':'Cloud Direct',desc:ja?'リモートBaaSに直接接続（エミュレーターなし）':'Connect to remote BaaS (no emulators)'},
        {label:ja?'ハイブリッド':'Hybrid',desc:ja?'両方の設定を生成、手動切替':'Generate both, switch manually'}
      ],
      tip:ja?'ローカル開発はオフラインでも動作可能':'Local development works offline too',
      help:'dev_env_type'},
    {id:'mobile',q:ja?'モバイル対応 ★v8':'Mobile Support ★v8',type:'options',help:'mobile',options:[{label:'Expo (React Native)',desc:ja?'推奨 — SDK55・EAS Build/Submit・OTA・React共有80%+':'Recommended — SDK55, EAS Build/Submit, OTA, 80%+ React reuse'},...(lv!=='beginner'?[{label:'Flutter',desc:ja?'Dart製・ピクセルパーフェクトUI・マルチプラットフォーム':'Dart, pixel-perfect UI, multi-platform'},
{label:'React Native (bare)',desc:ja?'ネイティブモジュール完全制御':'Full native module control'}]:[]),...(lv==='pro'?[{label:ja?'Swift/Kotlin (ネイティブ)':'Swift/Kotlin (Native)',desc:ja?'最高パフォーマンス・プラットフォーム固有':'Best performance, platform-specific'}]:[]),{label:'PWA',desc:ja?'Service Worker — インストール可能Web':'Service Worker — installable web'},{label:ja?'なし':'None',desc:ja?'Web専用':'Web only'}],tip:ja?'ExpoならReact知識をそのままモバイルへ':'Expo lets you reuse React skills for mobile'},
    {id:'ai_auto',q:ja?'AI自律開発レベル ★v8':'AI Dev Level ★v8',type:'options',help:'ai_auto',options:[{label:ja?'Vibe Coding入門':'Vibe Coding Intro',desc:ja?'Level 1 — AIペアプログラミング・Tab補完':'Level 1 — AI pair programming, Tab completion'},...(lv!=='beginner'?[{label:ja?'エージェント型開発':'Agentic Dev',desc:ja?'Level 2 — Cursor Agent/Cline/Antigravity マルチファイル編集':'Level 2 — Cursor Agent/Cline/Antigravity multi-file editing'},
{label:ja?'マルチAgent協調':'Multi-Agent',desc:ja?'Level 2-3 — Antigravity Manager View/Sub-Agents並列実行':'Level 2-3 — Antigravity Manager View/Sub-Agents parallel exec'}]:[]),...(lv==='pro'?[{label:ja?'フル自律開発':'Full Autonomous',desc:ja?'Level 3 — Claude Code Subagents/Jules(非同期)/Agent Teams':'Level 3 — Claude Code Subagents/Jules(async)/Agent Teams'},
{label:ja?'オーケストレーター':'Orchestrator',desc:ja?'Agent Architect — CI/CD統合・本番パイプライン':'Agent Architect — CI/CD integration, prod pipeline'}]:[]),{label:ja?'なし':'None',desc:ja?'手動コーディング':'Manual coding'}],tip:ja?'2028年までに新規本番コードの40%がVibe Coding生成 (Gartner)':'40% of new production code via Vibe Coding by 2028 (Gartner)'},
    {id:'payment',q:ja?'決済・CMS・EC ★v8':'Payment/CMS/EC ★v8',type:'chip-multi',chips:ja?['Stripe決済','Stripe Billing (サブスク)',...(lv!=='beginner'?['Paddle (SaaS MoR)','Lemon Squeezy (デジタル商品)','Polar (OSS収益化)']:[]),'microCMS (国産ヘッドレス)',...(lv!=='beginner'?['Strapi (OSS CMS)','Sanity','Contentful']:[]),...(lv==='pro'?['Medusa (OSS EC)','Shopify Hydrogen','Stripe Connect (マーケットプレイス)','Saleor (Python EC)']:[]),'なし']:['Stripe','Stripe Billing (Sub)',...(lv!=='beginner'?['Paddle (SaaS MoR)',
'Lemon Squeezy (Digital)','Polar (OSS Monetize)']:[]),'microCMS (JP Headless)',...(lv!=='beginner'?['Strapi (OSS CMS)','Sanity','Contentful']:[]),...(lv==='pro'?['Medusa (OSS EC)','Shopify Hydrogen','Stripe Connect (Marketplace)','Saleor (Python EC)']:[]),'None'],
placeholder:ja?'追加…':'Add...',tip:ja?'Stripeが最も導入しやすい。MoR=税務処理代行':'Stripe is easiest to integrate. MoR = tax handling',help:'payment'},
    {id:'ai_tools',q:ja?'AIコーディングツール（複数可）':'AI Coding Tools (multi)',type:'chip-multi',condition:{ai_auto:v=>v&&!/none|なし/i.test(v)},chips:['Cursor','Claude Code','GitHub Copilot','Google Antigravity',...(lv!=='beginner'?['Windsurf','Cline/RooCode','Kiro','Gemini CLI','Aider','Amazon Q Developer']:[]),...(lv==='pro'?['Codex (OpenAI)','Augment Code','Bolt.new','Devin','Lovable','Continue.dev','Tabnine']:[])],placeholder:ja?'追加…':'Add...',tip:ja?'Cursor / Antigravity (IDE) + Claude Code (CLI) が最強コンビ':'Cursor / Antigravity (IDE) + Claude Code (CLI) is the strongest combo',help:'ai_tools'},
    {id:'deploy',q:ja?'デプロイ先':'Deployment',type:'options',options:[{label:'Vercel',desc:ja?'Next.js最適・無料枠充実・Edge Functions':'Best for Next.js, generous free tier, Edge Functions'},{label:'Firebase Hosting',desc:ja?'Firebase統合・Google CDN':'Firebase integration, Google CDN'},...(lv!=='beginner'?[{label:'Cloudflare Pages',desc:ja?'エッジ最速・Workers統合':'Fastest edge, Workers integration'},{label:'Railway',desc:ja?'フルスタック簡単デプロイ・PostgreSQL付き':'Easy full-stack deploy with PostgreSQL'},
{label:'Fly.io',desc:ja?'Dockerベース・グローバルエッジ':'Docker-based, global edge'},{label:'Render',desc:ja?'フルスタック簡単デプロイ・無料枠あり':'Easy full-stack deploy, free tier'}]:[]),...(lv==='pro'?[{label:'AWS (EC2/ECS/Lambda)',desc:ja?'フルカスタム・IaC':'Full custom, IaC'},{label:ja?'Docker (自前)':'Docker (self-hosted)',desc:ja?'完全制御・K8s対応':'Full control, K8s ready'},{label:'Cloudflare Workers',desc:ja?'V8 Edge Runtime・ゼロコールドスタート':'V8 Edge Runtime, zero cold start'},{label:'Deno Deploy',desc:ja?'Deno専用グローバルエッジ・GitOps':'Deno-native global edge, GitOps'}]:[]),{label:'Netlify',desc:ja?'静的/JAMstack — 無料枠充実':'Static/JAMstack — generous free tier'}],tip:ja?'Vercel/Netlify無料枠で十分':'Vercel/Netlify free tiers are plenty',help:'deploy'},
    {id:'dev_methods',q:ja?'駆動開発手法（複数可）':'Dev Methods (multi)',type:'chip-multi',chips:[...(lv==='beginner'?(ja?['TDD（テスト駆動）','BDD（振る舞い駆動）','SDD（仕様駆動）']:['TDD (Test-Driven)','BDD (Behavior-Driven)','SDD (Spec-Driven)']):(ja?['TDD（テスト駆動）','BDD（振る舞い駆動）','SDD（仕様駆動）','DDD（ドメイン駆動）','FDD（機能駆動）',...(lv==='pro'?['MDD（モデル駆動）']:[])]:['TDD (Test-Driven)','BDD (Behavior-Driven)','SDD (Spec-Driven)','DDD (Domain-Driven)','FDD (Feature-Driven)',...(lv==='pro'?['MDD (Model-Driven)']:[])]))],
placeholder:ja?'追加…':'Add...',tip:lv==='beginner'?(ja?'TDD + SDD がAI駆動開発の基本':'TDD + SDD are AI-driven dev basics'):(ja?'SDD→BDD→TDD→DDD の組み合わせが最強':'SDD→BDD→TDD→DDD combo is strongest'),help:'dev_methods'},
  ]},
  3:{name:ja?'機能・データ設計':'Feature & Data Design',questions:[
    {id:'mvp_features',q:ja?'MVP機能（3〜5個推奨）':'MVP Features (3-5 recommended)',type:'chip-multi',sortable:true,chips:_uniq([..._fpPre('mvp_features'),...(ja?['ユーザー登録・ログイン','プロフィール編集','ダッシュボード','一覧表示・検索','詳細ページ','作成・編集・削除','ファイルアップロード','通知機能','お気に入り','コメント機能','シェア機能','設定画面',...(lv!=='beginner'?['API連携','管理画面','エクスポート','多言語','サブスクリプション']:[]),...(lv==='pro'?['リアルタイム同期','Webhook','RBAC','監査ログ','マルチテナント']:[])]
    :['User Auth','Profile Edit','Dashboard','List & Search','Detail Page','CRUD','File Upload','Notifications','Favorites','Comments','Share','Settings',...(lv!=='beginner'?['API Integration','Admin Panel','Export','i18n','Subscription']:[]),...(lv==='pro'?['Realtime Sync','Webhook','RBAC','Audit Log','Multi-tenant']:[])])]),placeholder:ja?'追加…':'Add...',tip:ja?'3〜5個に絞りましょう':'Keep it to 3-5',help:'mvp_features'},
    {id:'org_model',q:ja?'組織・テナント構造':'Organization & Tenant Structure',type:'chip-text',condition:{purpose:v=>/saas|analytics|collab|hr|tool|automation|fintech|legal|ec|marketplace|logistics|insurance/i.test(detectDomain(v||'')||'')},chips:ja?['シングルテナント','マルチテナント(RLS)','ワークスペース型','組織+チーム階層']:['Single-tenant','Multi-tenant (RLS)','Workspace-based','Org + Team hierarchy'],placeholder:ja?'追加…':'Add...',tip:ja?'マルチテナントはRLS設計・組織モデルを生成します':'Multi-tenant generates RLS design & org model',help:'org_model'},
    {id:'future_features',q:ja?'将来追加機能':'Future Features',type:'chip-multi',chips:ja?['課金・サブスク','チーム機能','カレンダー連携','チャット','分析レポート','AI機能','モバイルアプリ','API公開','外部連携','A/Bテスト']
    :['Billing','Team features','Calendar','Chat','Analytics','AI features','Mobile app','Public API','Integrations','A/B testing'],placeholder:ja?'追加…':'Add...',tip:ja?'Phase 2, 3として計画':'Plan for Phase 2, 3',help:'future_features'},
    {id:'data_entities',q:ja?'データテーブル':'Data Entities',type:'chip-multi',condition:{backend:v=>!/なし|None|static/i.test(v)},chips:_uniq([..._fpPre('data_entities'),...['User','Post','Comment','Tag','Category','Product','Order','Task','Project','Message','Notification','File','Setting','Log',...(lv!=='beginner'?['Course','Lesson','Progress','Quiz','Certificate','Event','Group','Review','Invoice','Subscription']:[])]]),placeholder:ja?'追加…':'Add...',tip:ja?'英語・単数形が標準':'English, singular form is standard',help:'data_entities'},
    {id:'auth',q:ja?'認証方式':'Authentication',type:'chip-multi',condition:{backend:v=>!/なし|None|static/i.test(v)},chips:ja?['メール/パスワード','Google OAuth','GitHub OAuth','Magic Link',...(lv!=='beginner'?['Auth.js/NextAuth','Clerk','Firebase Auth','Supabase Auth']:[]),...(lv==='pro'?['SSO/SAML','MFA','API Key']:[])]
    :['Email/Password','Google OAuth','GitHub OAuth','Magic Link',...(lv!=='beginner'?['Auth.js/NextAuth','Clerk','Firebase Auth','Supabase Auth']:[]),...(lv==='pro'?['SSO/SAML','MFA','API Key']:[])],placeholder:'',tip:ja?'OAuth系は実装簡単でUX向上':'OAuth is easy to implement and improves UX',help:'auth'},
    {id:'screens',q:ja?'主要画面':'Key Screens',type:'chip-multi',sortable:true,chips:_uniq([..._fpPre('screens'),...(ja?['ランディングページ','ログイン/登録','ダッシュボード','一覧ページ','詳細ページ','作成/編集フォーム','プロフィール','設定','404エラー','お問い合わせ',...(lv!=='beginner'?['管理画面','分析画面','オンボーディング']:[]),...(lv==='pro'?['APIドキュメント','ステータスページ','利用規約']:[])]
    :['Landing Page','Login/Register','Dashboard','List Page','Detail Page','Create/Edit Form','Profile','Settings','404 Error','Contact',...(lv!=='beginner'?['Admin Panel','Analytics','Onboarding']:[]),...(lv==='pro'?['API Docs','Status Page','Terms of Service']:[])])]),placeholder:ja?'追加…':'Add...',tip:ja?'ワイヤーフレームを描くとスムーズ':'Wireframing helps a lot',help:'screens'},
    {id:'skill_level',q:ja?'スキルレベル確認':'Confirm Skill Level',type:'options',help:'skill_level',options:[{label:'Beginner',desc:ja?'HTML/CSS学習中 — 初心者向けロードマップ':'Learning HTML/CSS — beginner roadmap'},{label:'Intermediate',desc:ja?'React/Node.js経験あり — 中級者パス':'React/Node.js experience — intermediate path'},{label:'Professional',desc:ja?'フルスタック実務経験 — プロ向け高度パス':'Full-stack production exp — advanced path'}],tip:ja?'ロードマップの難易度に影響します':'Affects roadmap difficulty'},
    {id:'learning_goal',q:ja?'学習目標期間':'Learning Timeline',type:'options',help:'learning_goal',options:[{label:ja?'3ヶ月集中':'3 months intensive',desc:ja?'集中的に学習':'Focused learning'},{label:ja?'6ヶ月標準':'6 months standard',desc:ja?'バランスよく':'Balanced pace'},{label:ja?'12ヶ月じっくり':'12 months thorough',desc:ja?'深く理解':'Deep understanding'}],tip:ja?'ロードマップのペースに影響します':'Affects roadmap pace'},
    {id:'learning_path',q:ja?'学習パターン ★v8':'Learning Pattern ★v8',type:'options',help:'learning_path',options:[{label:ja?'PERN Stack':'PERN Stack',desc:ja?'React+Node.js+PostgreSQL — 最も汎用的':'React+Node.js+PostgreSQL — most versatile'},{label:ja?'React + BaaS':'React + BaaS',desc:ja?'Firebase/Supabase — 最短ルート':'Firebase/Supabase — fastest route'},
...(lv!=='beginner'?[{label:ja?'フルスタック+モバイル':'Fullstack+Mobile',desc:ja?'React+Next.js+Expo — Web+Mobile統合':'React+Next.js+Expo — Web+Mobile unified'}]:[]),...(lv==='pro'?[{label:ja?'AI自律オーケストレーター':'AI Orchestrator',desc:ja?'Claude Code中心 — Agent Architect特化':'Claude Code focused — Agent Architect path'},
{label:ja?'SaaS収益化特化':'SaaS Monetization',desc:ja?'Stripe+microCMS+Next.js — 収益化パス':'Stripe+microCMS+Next.js — monetization path'}]:[])],tip:ja?'ロードマップの学習パスを決定します':'Determines your learning path'},
  ]},
  };
}
