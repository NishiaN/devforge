/* ═══ Common Helpers for Cross-Generator Consistency ═══ */

// ── Smart Table Pluralization ──
function pluralize(name){
  const lower=name.toLowerCase();
  // Uncountable
  if(/^(progress|media|data|feedback|equipment|information|news|analytics|metadata|settings)$/i.test(name)) return lower;
  // Irregular
  const irreg={person:'people',child:'children',quiz:'quizzes',status:'statuses',category:'categories',entry:'entries'};
  if(irreg[lower]) return irreg[lower];
  // Standard rules
  if(lower.endsWith('s')||lower.endsWith('x')||lower.endsWith('ch')||lower.endsWith('sh')) return lower+'es';
  if(lower.endsWith('y')&&!/[aeiou]y$/i.test(lower)) return lower.slice(0,-1)+'ies';
  return lower+'s';
}

// ── Check if value is "none" in any language ──
function isNone(v){
  return !v||v==='none'||v==='None'||v==='なし';
}

// ── Screen Component Dictionary ──
const SCREEN_COMPONENTS={
  'ランディング|landing|LP|トップ|home':{
    components_ja:['ヒーローセクション(CTA)','特徴/メリット一覧','料金プラン比較表','ユーザーレビュー/実績','FAQ アコーディオン','フッター(リンク集)'],
    components_en:['Hero section with CTA','Features / benefits list','Pricing comparison table','Testimonials / social proof','FAQ accordion','Footer with links'],
  },
  'ダッシュボード|dashboard':{
    components_ja:['統計カード(KPI数値)','アクティビティグラフ(recharts)','最近のアクティビティ一覧','クイックアクションボタン','サイドバーナビゲーション'],
    components_en:['Stats cards (KPI metrics)','Activity chart (recharts)','Recent activity feed','Quick action buttons','Sidebar navigation'],
  },
  '設定|settings|プロフィール|profile':{
    components_ja:['プロフィール編集フォーム','パスワード変更','通知設定トグル','テーマ切替(ダーク/ライト)','アカウント削除'],
    components_en:['Profile edit form','Password change','Notification toggles','Theme switch (dark/light)','Account deletion'],
  },
  '管理|admin':{
    components_ja:['ユーザー管理テーブル(検索/フィルタ/ページネーション)','コンテンツ承認キュー','売上/統計グラフ','監査ログビューア','システム設定'],
    components_en:['User management table (search/filter/pagination)','Content approval queue','Revenue / stats charts','Audit log viewer','System settings'],
  },
  '一覧|list|検索|search|コース|course|商品|product':{
    components_ja:['検索バー + フィルタサイドバー','カード/リスト切替','ページネーション/無限スクロール','ソート(新着/人気/価格)','空状態メッセージ'],
    components_en:['Search bar + filter sidebar','Card / list toggle','Pagination / infinite scroll','Sort (newest/popular/price)','Empty state message'],
  },
  '詳細|detail':{
    components_ja:['メインコンテンツ表示','メタ情報サイドバー','関連コンテンツ','レビュー/コメントセクション','シェアボタン','CTAボタン(購入/受講開始)'],
    components_en:['Main content display','Meta info sidebar','Related content','Reviews / comments section','Share buttons','CTA button (buy/enroll)'],
  },
  '決済|payment|billing|checkout':{
    components_ja:['プラン比較カード','Stripe Elements決済フォーム','注文サマリー','クーポン入力','決済完了/エラー表示'],
    components_en:['Plan comparison cards','Stripe Elements payment form','Order summary','Coupon input','Payment success / error display'],
  },
  'ログイン|login|サインイン|signin':{
    components_ja:['メール/パスワードフォーム','ソーシャルログインボタン','パスワードリセットリンク','新規登録リンク','バリデーションメッセージ'],
    components_en:['Email / password form','Social login buttons','Password reset link','Register link','Validation messages'],
  },
  '新規登録|register|signup':{
    components_ja:['ステップフォーム(基本情報→確認)','利用規約同意チェック','ソーシャル登録ボタン','パスワード強度メーター','ログインリンク'],
    components_en:['Step form (info → confirm)','Terms agreement checkbox','Social signup buttons','Password strength meter','Login link'],
  },
};

function getScreenComponents(screenName,G){
  for(const[pattern,detail]of Object.entries(SCREEN_COMPONENTS)){
    if(new RegExp(pattern,'i').test(screenName)){return G?detail.components_ja:detail.components_en;}
  }
  return null;
}

// ── B3: Auth Source of Truth Resolution ──
function resolveAuth(a){
  const be=a.backend||'';const fe=a.frontend||'';const auth=a.auth||'';
  let sot,tokenType,tokenVerify,provider;

  if(be.includes('Supabase')){
    const isSPA=fe.includes('Vite')||fe.includes('SPA')||(!fe.includes('Next')&&!fe.includes('Nuxt')&&!fe.includes('Remix'));
    sot='Supabase Auth';tokenType='Supabase JWT (access_token)';
    tokenVerify=isSPA?'Supabase client library (client-side: supabase.auth.getUser()) + RLS':'Supabase client library (server-side: supabase.auth.getUser())';
    provider='supabase';
  } else if(be.includes('Firebase')){
    sot='Firebase Auth';tokenType='Firebase ID Token';
    tokenVerify='Firebase Admin SDK (admin.auth().verifyIdToken())';
    provider='firebase';
  } else if(fe.includes('Next.js')&&(auth.includes('NextAuth')||auth.includes('Auth.js'))){
    sot='Auth.js (NextAuth v5)';tokenType='Session Token (server-side session)';
    tokenVerify='Auth.js getServerSession() / auth() middleware';
    provider='authjs';
  } else if(auth.includes('Supabase Auth')){
    sot='Supabase Auth (standalone)';tokenType='Supabase JWT';
    tokenVerify='Supabase client library';
    provider='supabase';
  } else {
    // Fallback: use user's auth answer or JWT default
    sot=auth||'JWT + OAuth 2.0';tokenType='Bearer Token (JWT)';
    tokenVerify='jsonwebtoken verify() / jose jwtVerify()';
    provider='jwt';
  }
  // Social providers from auth chip
  const social=[];
  if(auth.includes('Google'))social.push('Google OAuth');
  if(auth.includes('GitHub'))social.push('GitHub OAuth');
  if(auth.includes('Apple'))social.push('Apple Sign In');
  if(auth.includes('メール')||auth.includes('Email'))social.push('Email/Password');
  if(auth.includes('Magic')||auth.includes('マジック'))social.push('Magic Link');
  return {sot,tokenType,tokenVerify,provider,social};
}

// ── B1: Architecture Pattern Resolution ──
function resolveArch(a){
  const fe=a.frontend||'React + Next.js';const be=a.backend||'Node.js + Express';
  const db=a.database||'PostgreSQL';const deploy=a.deploy||'Vercel';
  const mob=a.mobile||'';
  const isBaaS=/Supabase|Firebase|Convex/.test(be);
  const isNextJS=fe.includes('Next.js');
  const isServerBE=/Express|Fastify|NestJS|Hono|Django|FastAPI|Spring|Go/.test(be);
  const isVercel=deploy.includes('Vercel');
  let pattern,diagram,note='';

  if(isBaaS){
    pattern='baas';
    const baasName=be.includes('Supabase')?'Supabase':be.includes('Firebase')?'Firebase':'Convex';
    diagram=`[Client] → [${fe}] → [${baasName} (Auth + DB + Functions)]`;
    if(mob&&!isNone(mob)&&!mob.includes('PWA'))
      diagram+=`\n[Mobile - ${mob}] → [${baasName} (Auth + DB + Functions)]`;
    note=`${baasName} handles auth, database, and serverless functions as a unified backend.`;
  } else if(isVercel&&isNextJS&&isServerBE){
    pattern='bff';
    diagram=`[Client] → [Next.js (SSR + API Routes)] → [${db}]`;
    if(mob&&!isNone(mob)&&!mob.includes('PWA'))
      diagram+=`\n[Mobile - ${mob}] → [Next.js API Routes] → [${db}]`;
    note=`Express logic is integrated into Next.js API Routes for Vercel deployment. No separate backend server needed.`;
  } else if(isVercel&&isServerBE&&!isNextJS){
    pattern='split';
    diagram=`[Client] → [${fe} (Vercel)]\n       → [${be} (Railway/Render)] → [${db}]`;
    if(mob&&!isNone(mob)&&!mob.includes('PWA'))
      diagram+=`\n[Mobile - ${mob}] → [${be} (Railway/Render)] → [${db}]`;
    note=`${be} requires a separate server host (Railway/Render/Fly.io). Vercel serves frontend only.`;
  } else {
    pattern='traditional';
    diagram=`[Client] → [${fe}] → [${be}] → [${db}]`;
    if(mob&&!isNone(mob)&&!mob.includes('PWA'))
      diagram+=`\n[Mobile - ${mob}] → [${be}] → [${db}]`;
  }
  return {pattern,diagram,note,isBaaS,isNextJS};
}

// ── B7: Schedule Single Source ──
function buildSchedule(a){
  const hasMobile=a.mobile&&!isNone(a.mobile)&&!a.mobile.includes('PWA');
  const startDate=new Date().toISOString().split('T')[0];
  const sprints=[
    {name:'Sprint 0',weeks:'Week 1',focus_ja:'環境構築',focus_en:'Setup'},
    {name:'Sprint 1',weeks:'Week 2-3',focus_ja:'コア機能',focus_en:'Core Features'},
    {name:'Sprint 2',weeks:'Week 3-4',focus_ja:'UI/UX',focus_en:'UI/UX'},
    {name:'Sprint 3',weeks:'Week 4-5',focus_ja:'テスト・デプロイ',focus_en:'Test & Deploy'},
  ];
  if(hasMobile) sprints.push({name:'Sprint 4',weeks:'Week 5-6',focus_ja:'モバイル対応',focus_en:'Mobile'});
  const totalWeeks=hasMobile?6:5;
  return {startDate,totalWeeks,sprints,hasMobile};
}

// ── B8: Package.json Real Dependencies ──
function buildDeps(a){
  const fe=a.frontend||'';const be=a.backend||'';const db=a.database||'';
  const orm=a.orm||'';const deploy=a.deploy||'';const auth=resolveAuth(a);
  const deps={};const devDeps={};const scripts={};

  // Frontend
  if(fe.includes('Next.js')){
    deps['next']='^15';deps['react']='^19';deps['react-dom']='^19';
    scripts.dev='next dev';scripts.build='next build';scripts.start='next start';scripts.lint='next lint';
  } else if(fe.includes('Vite')||fe.includes('Vue')||fe.includes('Svelte')){
    deps['vite']='^6';
    scripts.dev='vite';scripts.build='vite build';scripts.preview='vite preview';
  }
  if(fe.includes('Vue')){deps['vue']='^3';}
  if(fe.includes('Svelte')){deps['svelte']='^5';}
  if(fe.includes('Angular')){scripts.dev='ng serve';scripts.build='ng build';}

  // Backend
  if(be.includes('Express')){deps['express']='^5';}
  if(be.includes('Fastify')){deps['fastify']='^5';}
  if(be.includes('Hono')){deps['hono']='^4';}
  if(be.includes('Supabase')){deps['@supabase/supabase-js']='^2';deps['@supabase/ssr']='^0.5';}
  if(be.includes('Firebase')){deps['firebase']='^11';devDeps['firebase-tools']='^13';}
  if(be.includes('Convex')){deps['convex']='^1';}

  // ORM / DB — skip for BaaS (user orm input irrelevant)
  const isBaaS=/Supabase|Firebase|Convex/.test(be);
  if(!isBaaS){
    if(orm.includes('Prisma')){devDeps['prisma']='^6';deps['@prisma/client']='^6';
      scripts['db:push']='prisma db push';scripts['db:studio']='prisma studio';scripts['db:generate']='prisma generate';}
    if(orm.includes('Drizzle')){deps['drizzle-orm']='^0.38';devDeps['drizzle-kit']='^0.30';
      scripts['db:push']='drizzle-kit push';scripts['db:studio']='drizzle-kit studio';}
  }

  // Auth
  if(auth.provider==='authjs'){deps['next-auth']='^5';}

  // Payment
  const hasPay=a.payment&&!/なし|None|none/.test(a.payment);
  if(hasPay&&(a.payment||'').includes('Stripe')){deps['stripe']='^17';}

  // Common devDeps
  devDeps['typescript']='^5.7';devDeps['@types/node']='^22';
  devDeps['vitest']='^3';devDeps['@playwright/test']='^1.50';
  devDeps['eslint']='^9';devDeps['prettier']='^3';
  scripts.test='vitest';scripts['test:e2e']='playwright test';
  scripts.lint=scripts.lint||'eslint .';

  return {deps,devDeps,scripts};
}

// ── B5: Domain Entity Validation & ER Inference ──
const DOMAIN_ENTITIES={
  education:{core:['User','Course','Lesson','Progress','Quiz','Enrollment'],warn:['Product','Order','Cart'],suggest:{Product:'Course',Order:'Enrollment',Cart:'Wishlist'}},
  ec:{core:['User','Product','Category','Order','Cart','Payment','Review'],warn:['Course','Lesson','Progress'],suggest:{}},
  marketplace:{core:['User','Listing','Order','Review','Message','Category'],warn:['Course','Lesson'],suggest:{}},
  community:{core:['User','Post','Comment','Tag','Like','Follow'],warn:['Product','Order','Cart','Payment'],suggest:{Product:'Resource',Order:'Invitation'}},
  content:{core:['User','Post','Category','Tag','Comment','Media'],warn:['Product','Order','Cart'],suggest:{Product:'Content',Order:'Subscription'}},
  analytics:{core:['User','Dashboard','DataSource','Widget','Report','Chart'],warn:['Post','Comment','Product'],suggest:{}},
  booking:{core:['User','Service','Booking','TimeSlot','Review','Payment'],warn:['Post','Cart','Lesson'],suggest:{Product:'Service',Order:'Booking'}},
  saas:{core:['User','Workspace','Project','Task','Subscription','Invoice'],warn:[],suggest:{Product:'Plan',Order:'Subscription'}},
  portfolio:{core:['User','Project','Skill','Experience','ContactMessage'],warn:['Product','Order','Cart','Payment'],suggest:{}},
  tool:{core:['User','Workspace','Task','Setting','Log'],warn:['Product','Order','Cart'],suggest:{}},
  iot:{core:['User','Device','Sensor','SensorData','Alert','Dashboard'],warn:['Product','Order','Cart'],suggest:{}},
  realestate:{core:['User','Property','Category','Viewing','Contract','Agent'],warn:['Product','Order','Cart'],suggest:{Product:'Property',Order:'Viewing'}},
  legal:{core:['User','Contract','Template','Review','Client','Document'],warn:['Product','Order','Cart'],suggest:{}},
  hr:{core:['User','JobPosting','Applicant','Interview','Evaluation','Department'],warn:['Product','Order','Cart'],suggest:{}},
  fintech:{core:['User','Account','Transaction','Transfer','Card','Statement'],warn:['Post','Comment','Course'],suggest:{}},
  health:{core:['User','Patient','Doctor','Appointment','MedicalRecord','Prescription'],warn:['Product','Order','Cart'],suggest:{Product:'Service',Order:'Appointment'}},
  ai:{core:['User','Conversation','Message','Prompt','Agent','Tool','ApiUsage'],warn:['Product','Order','Cart'],suggest:{}},
  automation:{core:['User','Workflow','Trigger','Action','Execution','Connection','Log'],warn:['Product','Order'],suggest:{}},
  event:{core:['User','Event','Ticket','Attendee','Venue','Session','Survey'],warn:['Product','Order'],suggest:{Product:'Ticket',Order:'Booking'}},
  gamify:{core:['User','Badge','Challenge','Reward','Leaderboard','PointLog','Achievement'],warn:['Product','Order','Cart'],suggest:{}},
  collab:{core:['User','Document','Workspace','Comment','Version','Permission','Activity'],warn:['Product','Order','Cart'],suggest:{}},
  devtool:{core:['User','ApiKey','Project','RequestLog','Webhook','Documentation'],warn:['Product','Order','Cart'],suggest:{}},
  creator:{core:['User','Content','Subscription','Payment','Tier','Comment','Tip'],warn:['Order','Cart'],suggest:{}},
  newsletter:{core:['User','Post','Subscriber','Campaign','Analytics','Plan'],warn:['Product','Order','Cart'],suggest:{Product:'Plan',Order:'Subscription'}},
};

// ── Entity Column Dictionary ──
// Format: 'column_name:TYPE:CONSTRAINT:DESC_JA:DESC_EN'
// Common column patterns (for compression)
const _U='user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID';
const _SA="status:VARCHAR(20):DEFAULT 'active':ステータス:Status";
const _SD="status:VARCHAR(20):DEFAULT 'draft':ステータス:Status";
const _SP="status:VARCHAR(20):DEFAULT 'pending':ステータス:Status";
const _T='title:VARCHAR(255):NOT NULL:タイトル:Title';
const _D='description:TEXT::説明:Description';
const _CN='config:JSONB::設定:Config';
const _M='metadata:JSONB::メタデータ:Metadata';
const _B='body:TEXT::本文:Body';
const _BN='body:TEXT:NOT NULL:本文:Body';
const _TS='created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at';
const _SO='sort_order:INT:DEFAULT 0:表示順:Display order';
const _IA='is_active:BOOLEAN:DEFAULT true:有効:Active';
const _PR='price:DECIMAL(10,2):NOT NULL:価格:Price';
const _CAT='category:VARCHAR(100)::カテゴリ:Category';
const _DUR='duration_min:INT::所要時間(分):Duration(min)';
const _N='notes:TEXT::メモ:Notes';
const ENTITY_COLUMNS={
  User:['email:VARCHAR(255):UNIQUE NOT NULL:メールアドレス:Email','avatar_url:TEXT::アバターURL:Avatar URL','role:VARCHAR(20):DEFAULT \'user\':ユーザー権限:User role'],
  Course:['description:TEXT::コース説明:Course description','price:DECIMAL(10,2):DEFAULT 0:価格:Price','status:VARCHAR(20):DEFAULT \'draft\':公開状態:Publish status','thumbnail_url:TEXT::サムネイル:Thumbnail','instructor_id:UUID:FK(User):講師ID:Instructor ID'],
  Lesson:[_SO,'content_type:VARCHAR(20):DEFAULT \'text\':コンテンツ種別:Content type',_DUR,'video_url:TEXT::動画URL:Video URL','is_free:BOOLEAN:DEFAULT false:無料公開:Free access'],
  Progress:[_U,'lesson_id:UUID:FK(Lesson) NOT NULL:レッスンID:Lesson ID','status:VARCHAR(20):DEFAULT \'not_started\':進捗状態:Progress status','completed_at:TIMESTAMP::完了日時:Completed at','score:INT::スコア:Score'],
  Quiz:['lesson_id:UUID:FK(Lesson) NOT NULL:レッスンID:Lesson ID','question:TEXT:NOT NULL:問題文:Question text','options:JSONB::選択肢:Options','correct_answer:TEXT:NOT NULL:正解:Correct answer','order:INT:DEFAULT 0:表示順:Display order'],
  Enrollment:[_U,'course_id:UUID:FK(Course) NOT NULL:コースID:Course ID','enrolled_at:TIMESTAMP:DEFAULT NOW:受講開始日:Enrolled at','expires_at:TIMESTAMP::有効期限:Expires at',_SA],
  Certificate:[_U,'course_id:UUID:FK(Course) NOT NULL:コースID:Course ID','issued_at:TIMESTAMP:DEFAULT NOW:発行日:Issued at','certificate_url:TEXT::証明書URL:Certificate URL'],
  Product:[_D,_PR,'stock:INT:DEFAULT 0:在庫数:Stock','sku:VARCHAR(100):UNIQUE:SKU:SKU','image_url:TEXT::商品画像:Product image','category_id:UUID:FK(Category):カテゴリID:Category ID',_SA],
  Category:['slug:VARCHAR(100):UNIQUE:スラグ:Slug',_D,'parent_id:UUID:FK(Category):親カテゴリ:Parent category',_SO],
  Order:[_U,'total:DECIMAL(10,2):NOT NULL:合計金額:Total',_SP,'stripe_session_id:TEXT::Stripe Session ID:Stripe Session ID','shipping_address:JSONB::配送先:Shipping address'],
  Cart:[_U,'product_id:UUID:FK(Product) NOT NULL:商品ID:Product ID','quantity:INT:DEFAULT 1:数量:Quantity'],
  Review:[_U,'rating:INT:NOT NULL:評価(1-5):Rating(1-5)',_B],
  Post:[_U,_T,_B,_SD,'published_at:TIMESTAMP::公開日時:Published at','slug:VARCHAR(255):UNIQUE:スラグ:Slug'],
  Comment:[_U,'post_id:UUID:FK(Post) NOT NULL:投稿ID:Post ID',_BN],
  Tag:['slug:VARCHAR(100):UNIQUE NOT NULL:スラグ:Slug'],
  Media:[_U,'url:TEXT:NOT NULL:ファイルURL:File URL','mime_type:VARCHAR(50)::MIMEタイプ:MIME type','size_bytes:BIGINT::ファイルサイズ:File size'],
  Like:[_U,'post_id:UUID:FK(Post) NOT NULL:投稿ID:Post ID'],
  Follow:['follower_id:UUID:FK(User) NOT NULL:フォロワーID:Follower ID','following_id:UUID:FK(User) NOT NULL:フォロー対象ID:Following ID'],
  Message:['sender_id:UUID:FK(User) NOT NULL:送信者ID:Sender ID','receiver_id:UUID:FK(User) NOT NULL:受信者ID:Receiver ID',_BN,'read_at:TIMESTAMP::既読日時:Read at'],
  Listing:[_U,_T,_D,_PR,_SA,'category_id:UUID:FK(Category):カテゴリID:Category ID'],
  Service:['provider_id:UUID:FK(User) NOT NULL:提供者ID:Provider ID',_D,'price:DECIMAL(10,2)::料金:Price',_DUR],
  Booking:[_U,'service_id:UUID:FK(Service) NOT NULL:サービスID:Service ID','starts_at:TIMESTAMP:NOT NULL:開始日時:Starts at','ends_at:TIMESTAMP:NOT NULL:終了日時:Ends at',_SP],
  TimeSlot:['service_id:UUID:FK(Service) NOT NULL:サービスID:Service ID','day_of_week:INT:NOT NULL:曜日(0-6):Day of week','start_time:TIME:NOT NULL:開始時刻:Start time','end_time:TIME:NOT NULL:終了時刻:End time','is_available:BOOLEAN:DEFAULT true:利用可能:Available'],
  Workspace:['owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID','slug:VARCHAR(100):UNIQUE:スラグ:Slug','plan:VARCHAR(20):DEFAULT \'free\':プラン:Plan'],
  Project:['workspace_id:UUID:FK(Workspace):ワークスペースID:Workspace ID',_SA,_D],
  Task:['project_id:UUID:FK(Project):プロジェクトID:Project ID','assignee_id:UUID:FK(User):担当者ID:Assignee ID','status:VARCHAR(20):DEFAULT \'todo\':タスク状態:Status','priority:INT:DEFAULT 0:優先度:Priority','due_date:DATE::期日:Due date'],
  Subscription:[_U,'stripe_subscription_id:TEXT:UNIQUE:StripeサブスクID:Stripe Sub ID','stripe_customer_id:TEXT::Stripe顧客ID:Stripe Customer ID',_SA,'plan:VARCHAR(20):NOT NULL:プラン名:Plan name','current_period_end:TIMESTAMP::現在期間終了:Current period end'],
  Invoice:[_U,'amount:DECIMAL(10,2):NOT NULL:金額:Amount',_SP,'stripe_invoice_id:TEXT::Stripe請求ID:Stripe Invoice ID','paid_at:TIMESTAMP::支払日:Paid at'],
  Payment:[_U,'amount:DECIMAL(10,2):NOT NULL:金額:Amount','method:VARCHAR(20)::支払方法:Payment method',_SP,'stripe_payment_id:TEXT::Stripe決済ID:Stripe Payment ID'],
  Dashboard:[_U,'layout:JSONB::レイアウト設定:Layout config'],
  Widget:['dashboard_id:UUID:FK(Dashboard) NOT NULL:ダッシュボードID:Dashboard ID','type:VARCHAR(50):NOT NULL:ウィジェット種別:Widget type',_CN,'position:INT:DEFAULT 0:表示位置:Position'],
  DataSource:['workspace_id:UUID:FK(Workspace):ワークスペースID:Workspace ID','type:VARCHAR(50):NOT NULL:データソース種別:Source type','connection_config:JSONB::接続設定:Connection config'],
  Device:[_U,'device_name:VARCHAR(255):NOT NULL:デバイス名:Device name','device_type:VARCHAR(50)::デバイス種別:Device type',_SA],
  Sensor:['device_id:UUID:FK(Device) NOT NULL:デバイスID:Device ID','sensor_type:VARCHAR(50):NOT NULL:センサー種別:Sensor type','unit:VARCHAR(20)::単位:Unit'],
  Alert:[_U,'severity:VARCHAR(20):DEFAULT \'info\':重要度:Severity','message:TEXT:NOT NULL:メッセージ:Message','acknowledged_at:TIMESTAMP::確認日時:Acknowledged at'],
  Notification:[_U,_T,_B,'read_at:TIMESTAMP::既読日時:Read at','type:VARCHAR(50):DEFAULT \'general\':通知種別:Type'],
  AuditLog:[_U,'action:VARCHAR(100):NOT NULL:操作:Action','resource_type:VARCHAR(50)::対象リソース:Resource type','resource_id:UUID::対象ID:Resource ID',_M],
  Skill:[_CAT,'level:INT:DEFAULT 0:レベル:Level'],
  Experience:['user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID','company:VARCHAR(255)::企業名:Company','title:VARCHAR(255)::役職:Title','start_date:DATE::開始日:Start date','end_date:DATE::終了日:End date','description:TEXT::説明:Description'],
  ContactMessage:['email:VARCHAR(255):NOT NULL:メールアドレス:Email','subject:VARCHAR(255)::件名:Subject','body:TEXT:NOT NULL:本文:Body','status:VARCHAR(20):DEFAULT \'unread\':対応状態:Status'],
  // ── SaaS/Workspace ──
  Team:['workspace_id:UUID:FK(Workspace) NOT NULL:ワークスペースID:Workspace ID','role:VARCHAR(20):DEFAULT \'member\':チーム権限:Team role'],
  Activity:[_U,'action:VARCHAR(100):NOT NULL:操作種別:Action type','resource_type:VARCHAR(50)::対象リソース:Resource type','resource_id:UUID::対象ID:Resource ID',_M],
  // ── AI/Chat ──
  Conversation:[_U,_T,'model:VARCHAR(50)::使用モデル:Model used','token_count:INT:DEFAULT 0:トークン数:Token count',_SA],
  Prompt:[_U,_T,'content:TEXT:NOT NULL:プロンプト内容:Prompt content','category:VARCHAR(50)::カテゴリ:Category','is_public:BOOLEAN:DEFAULT false:公開設定:Public'],
  ApiUsage:[_U,'endpoint:VARCHAR(255):NOT NULL:エンドポイント:Endpoint','tokens_used:INT:NOT NULL:使用トークン:Tokens used','cost:DECIMAL(10,4)::コスト:Cost','request_at:TIMESTAMP:DEFAULT NOW:リクエスト日時:Request at'],
  Agent:[_U,'agent_name:VARCHAR(255):NOT NULL:エージェント名:Agent name','system_prompt:TEXT::システムプロンプト:System prompt','model:VARCHAR(50)::使用モデル:Model',_SA,_CN],
  Tool:['agent_id:UUID:FK(Agent) NOT NULL:エージェントID:Agent ID','tool_name:VARCHAR(100):NOT NULL:ツール名:Tool name','tool_type:VARCHAR(50)::ツール種別:Tool type',_CN,'is_enabled:BOOLEAN:DEFAULT true:有効:Enabled'],
  Template:[_U,_T,'content:TEXT:NOT NULL:テンプレート内容:Content','category:VARCHAR(50)::カテゴリ:Category','usage_count:INT:DEFAULT 0:使用回数:Usage count'],
  Generation:[_U,'template_id:UUID:FK(Template):テンプレートID:Template ID','input:TEXT::入力:Input','output:TEXT::出力:Output','model:VARCHAR(50)::使用モデル:Model','tokens_used:INT::使用トークン:Tokens used','status:VARCHAR(20):DEFAULT \'completed\':ステータス:Status'],
  Content:[_U,_T,_B,'content_type:VARCHAR(50)::コンテンツ種別:Content type',_SD,'published_at:TIMESTAMP::公開日時:Published at'],
  CreditUsage:[_U,'credits_used:INT:NOT NULL:使用クレジット:Credits used','action:VARCHAR(100)::操作:Action','balance_after:INT::残高:Balance after'],
  // ── Automation/Workflow ──
  Workflow:[_U,_T,_D,_SD,'is_active:BOOLEAN:DEFAULT false:有効:Active',_CN],
  Trigger:['workflow_id:UUID:FK(Workflow) NOT NULL:ワークフローID:Workflow ID','trigger_type:VARCHAR(50):NOT NULL:トリガー種別:Trigger type',_CN,'is_enabled:BOOLEAN:DEFAULT true:有効:Enabled'],
  Action:['workflow_id:UUID:FK(Workflow) NOT NULL:ワークフローID:Workflow ID','action_type:VARCHAR(50):NOT NULL:アクション種別:Action type',_SO,_CN],
  Execution:['workflow_id:UUID:FK(Workflow) NOT NULL:ワークフローID:Workflow ID','status:VARCHAR(20):DEFAULT \'running\':実行状態:Status','started_at:TIMESTAMP:DEFAULT NOW:開始日時:Started at','completed_at:TIMESTAMP::完了日時:Completed at','error:TEXT::エラー:Error','output:JSONB::出力:Output'],
  Connection:[_U,'service:VARCHAR(100):NOT NULL:サービス名:Service','credentials:JSONB::認証情報:Credentials',_SA],
  Log:[_U,'level:VARCHAR(20):DEFAULT \'info\':レベル:Level','message:TEXT:NOT NULL:メッセージ:Message',_M],
  // ── Marketplace ──
  Transaction:['buyer_id:UUID:FK(User) NOT NULL:購入者ID:Buyer ID','seller_id:UUID:FK(User) NOT NULL:販売者ID:Seller ID','amount:DECIMAL(10,2):NOT NULL:金額:Amount','fee:DECIMAL(10,2):DEFAULT 0:手数料:Fee',_SP,'stripe_transfer_id:TEXT::Stripe送金ID:Stripe transfer ID'],
  // ── Chatbot ──
  Bot:[_U,'bot_name:VARCHAR(255):NOT NULL:ボット名:Bot name','welcome_message:TEXT::ウェルカムメッセージ:Welcome message','model:VARCHAR(50)::使用モデル:Model',_SA],
  Intent:['bot_id:UUID:FK(Bot) NOT NULL:ボットID:Bot ID','intent_name:VARCHAR(100):NOT NULL:インテント名:Intent name','examples:JSONB::例文:Examples','response_template:TEXT::応答テンプレート:Response template'],
  KnowledgeBase:['bot_id:UUID:FK(Bot) NOT NULL:ボットID:Bot ID',_T,'content:TEXT:NOT NULL:内容:Content','embedding:JSONB::埋め込みベクトル:Embedding vector','source_url:TEXT::ソースURL:Source URL'],
  Handoff:['conversation_id:UUID:FK(Conversation) NOT NULL:会話ID:Conversation ID','agent_id:UUID:FK(User):担当者ID:Agent ID','reason:TEXT::理由:Reason',_SP,'resolved_at:TIMESTAMP::解決日時:Resolved at'],
  // ── Fintech ──
  Account:[_U,'account_name:VARCHAR(255):NOT NULL:口座名:Account name','account_type:VARCHAR(50)::口座種別:Account type','balance:DECIMAL(12,2):DEFAULT 0:残高:Balance','currency:VARCHAR(3):DEFAULT \'JPY\':通貨:Currency','institution:VARCHAR(255)::金融機関:Institution'],
  Budget:[_U,'category:VARCHAR(100):NOT NULL:カテゴリ:Category','amount:DECIMAL(10,2):NOT NULL:予算額:Budget amount','period:VARCHAR(20):DEFAULT \'monthly\':期間:Period','spent:DECIMAL(10,2):DEFAULT 0:使用額:Spent'],
  Report:[_U,_T,'report_type:VARCHAR(50)::レポート種別:Report type',_CN,'generated_at:TIMESTAMP::生成日時:Generated at','data:JSONB::データ:Data'],
  // ── DevTool ──
  ApiKey:[_U,'key_prefix:VARCHAR(20):NOT NULL:キー接頭辞:Key prefix','key_hash:TEXT:NOT NULL:キーハッシュ:Key hash','label:VARCHAR(100)::ラベル:Label','permissions:JSONB::権限:Permissions','last_used_at:TIMESTAMP::最終使用日:Last used','expires_at:TIMESTAMP::有効期限:Expires at'],
  RequestLog:['api_key_id:UUID:FK(ApiKey):APIキーID:API Key ID','method:VARCHAR(10):NOT NULL:HTTPメソッド:HTTP method','path:VARCHAR(500):NOT NULL:パス:Path','status_code:INT::ステータスコード:Status code','latency_ms:INT::レイテンシ(ms):Latency(ms)','ip_address:VARCHAR(45)::IPアドレス:IP address'],
  Documentation:[_T,'slug:VARCHAR(255):UNIQUE:スラグ:Slug','content:TEXT:NOT NULL:内容:Content',_CAT,_SO,'version:VARCHAR(20)::バージョン:Version'],
  // ── Creator ──
  Tip:['sender_id:UUID:FK(User) NOT NULL:送信者ID:Sender ID','receiver_id:UUID:FK(User) NOT NULL:受信者ID:Receiver ID','amount:DECIMAL(10,2):NOT NULL:金額:Amount','message:TEXT::メッセージ:Message','status:VARCHAR(20):DEFAULT \'completed\':ステータス:Status'],
  Tier:[_U,'tier_name:VARCHAR(100):NOT NULL:ティア名:Tier name',_PR,_D,'benefits:JSONB::特典:Benefits'],
  // ── Newsletter ──
  Subscriber:['email:VARCHAR(255):UNIQUE NOT NULL:メールアドレス:Email',_U,_SA,'subscribed_at:TIMESTAMP:DEFAULT NOW:購読開始日:Subscribed at','tags:JSONB::タグ:Tags'],
  Campaign:[_U,_T,'subject:VARCHAR(255)::件名:Subject',_B,_SD,'scheduled_at:TIMESTAMP::配信予定:Scheduled at','sent_at:TIMESTAMP::配信日時:Sent at'],
  Analytics:['campaign_id:UUID:FK(Campaign):キャンペーンID:Campaign ID','metric:VARCHAR(50):NOT NULL:指標:Metric','value:DECIMAL(12,2):NOT NULL:値:Value','recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at'],
  Plan:['plan_name:VARCHAR(100):NOT NULL:プラン名:Plan name',_PR,'interval:VARCHAR(20):DEFAULT \'monthly\':課金間隔:Billing interval','features:JSONB::機能:Features','stripe_price_id:TEXT::Stripe価格ID:Stripe price ID',_IA],
  // ── PWA ──
  SyncQueue:[_U,'action:VARCHAR(50):NOT NULL:操作:Action','payload:JSONB:NOT NULL:データ:Payload',_SP,'retry_count:INT:DEFAULT 0:リトライ数:Retry count'],
  Setting:[_U,'key:VARCHAR(100):NOT NULL:設定キー:Setting key','value:JSONB::設定値:Value'],
  // ── Booking ──
  Staff:[_U,'specialty:VARCHAR(100)::専門分野:Specialty','is_available:BOOLEAN:DEFAULT true:利用可能:Available','calendar_config:JSONB::カレンダー設定:Calendar config'],
  Reminder:['booking_id:UUID:FK(Booking):予約ID:Booking ID','remind_at:TIMESTAMP:NOT NULL:リマインド日時:Remind at','method:VARCHAR(20):DEFAULT \'email\':通知方法:Method','sent:BOOLEAN:DEFAULT false:送信済:Sent'],
  // ── Event ──
  Event:[_U,_T,_D,'venue_id:UUID:FK(Venue):会場ID:Venue ID','starts_at:TIMESTAMP:NOT NULL:開始日時:Starts at','ends_at:TIMESTAMP:NOT NULL:終了日時:Ends at','capacity:INT::定員:Capacity',_SD,'is_online:BOOLEAN:DEFAULT false:オンライン:Online'],
  Ticket:['event_id:UUID:FK(Event) NOT NULL:イベントID:Event ID','ticket_type:VARCHAR(50):NOT NULL:チケット種別:Ticket type','price:DECIMAL(10,2):DEFAULT 0:価格:Price','quantity:INT:NOT NULL:枚数:Quantity','sold:INT:DEFAULT 0:販売済:Sold'],
  Attendee:['event_id:UUID:FK(Event) NOT NULL:イベントID:Event ID',_U,'ticket_id:UUID:FK(Ticket):チケットID:Ticket ID','status:VARCHAR(20):DEFAULT \'registered\':参加状態:Status','checked_in_at:TIMESTAMP::チェックイン日時:Checked in at'],
  Venue:['venue_name:VARCHAR(255):NOT NULL:会場名:Venue name','address:TEXT::住所:Address','capacity:INT::収容人数:Capacity','latitude:DECIMAL(10,7)::緯度:Latitude','longitude:DECIMAL(10,7)::経度:Longitude'],
  Session:['event_id:UUID:FK(Event) NOT NULL:イベントID:Event ID',_T,'speaker:VARCHAR(255)::登壇者:Speaker','starts_at:TIMESTAMP:NOT NULL:開始:Starts at','ends_at:TIMESTAMP:NOT NULL:終了:Ends at','room:VARCHAR(100)::部屋:Room'],
  Survey:['event_id:UUID:FK(Event):イベントID:Event ID',_T,'questions:JSONB:NOT NULL:質問:Questions',_IA],
  // ── Health ──
  HealthLog:[_U,'log_type:VARCHAR(50):NOT NULL:記録種別:Log type','value:DECIMAL(10,2):NOT NULL:値:Value','unit:VARCHAR(20)::単位:Unit','logged_at:TIMESTAMP:DEFAULT NOW:記録日時:Logged at',_N],
  Workout:[_U,'workout_type:VARCHAR(50):NOT NULL:運動種別:Workout type',_DUR,'calories:INT::消費カロリー:Calories','intensity:VARCHAR(20)::強度:Intensity',_N],
  Meal:[_U,'meal_type:VARCHAR(20):NOT NULL:食事種別:Meal type','food_items:JSONB::食品:Food items','calories:INT::カロリー:Calories','photo_url:TEXT::写真URL:Photo URL','logged_at:TIMESTAMP:DEFAULT NOW:記録日時:Logged at'],
  Goal:[_U,'goal_type:VARCHAR(50):NOT NULL:目標種別:Goal type','target_value:DECIMAL(10,2):NOT NULL:目標値:Target value','current_value:DECIMAL(10,2):DEFAULT 0:現在値:Current value','unit:VARCHAR(20)::単位:Unit','deadline:DATE::期限:Deadline',_SA],
  // ── HR ──
  JobPosting:['department_id:UUID:FK(Department):部署ID:Department ID',_T,_D,'employment_type:VARCHAR(50)::雇用形態:Employment type','salary_range:VARCHAR(100)::給与レンジ:Salary range','status:VARCHAR(20):DEFAULT \'open\':募集状態:Status','closes_at:DATE::締切日:Closes at'],
  Applicant:['job_id:UUID:FK(JobPosting) NOT NULL:求人ID:Job ID',_U,'applicant_name:VARCHAR(255):NOT NULL:氏名:Name','email:VARCHAR(255):NOT NULL:メール:Email','resume_url:TEXT::履歴書URL:Resume URL','status:VARCHAR(20):DEFAULT \'applied\':選考状態:Status','applied_at:TIMESTAMP:DEFAULT NOW:応募日:Applied at'],
  Interview:['applicant_id:UUID:FK(Applicant) NOT NULL:応募者ID:Applicant ID','interviewer_id:UUID:FK(User) NOT NULL:面接官ID:Interviewer ID','scheduled_at:TIMESTAMP:NOT NULL:予定日時:Scheduled at','duration_min:INT:DEFAULT 60:所要時間(分):Duration(min)','interview_type:VARCHAR(50)::面接種別:Type','status:VARCHAR(20):DEFAULT \'scheduled\':ステータス:Status',_N],
  Evaluation:['applicant_id:UUID:FK(Applicant) NOT NULL:応募者ID:Applicant ID','evaluator_id:UUID:FK(User) NOT NULL:評価者ID:Evaluator ID','score:INT:NOT NULL:スコア:Score','criteria:JSONB::評価基準:Criteria','comments:TEXT::コメント:Comments'],
  Department:['department_name:VARCHAR(255):NOT NULL:部署名:Department name','parent_id:UUID:FK(Department):親部署ID:Parent ID','head_id:UUID:FK(User):部長ID:Head ID'],
  Onboarding:[_U,'checklist:JSONB::チェックリスト:Checklist','progress:INT:DEFAULT 0:進捗(%):Progress(%)','mentor_id:UUID:FK(User):メンターID:Mentor ID','start_date:DATE::開始日:Start date','status:VARCHAR(20):DEFAULT \'in_progress\':ステータス:Status'],
  // ── Link in Bio ──
  Page:[_U,'slug:VARCHAR(100):UNIQUE NOT NULL:スラグ:Slug',_T,'bio:TEXT::自己紹介:Bio','theme_id:UUID:FK(Theme):テーマID:Theme ID','is_published:BOOLEAN:DEFAULT true:公開:Published'],
  Link:['page_id:UUID:FK(Page) NOT NULL:ページID:Page ID',_T,'url:TEXT:NOT NULL:URL:URL',_SO,_IA,'click_count:INT:DEFAULT 0:クリック数:Clicks'],
  Theme:['theme_name:VARCHAR(100):NOT NULL:テーマ名:Theme name','css_config:JSONB::CSSスタイル:CSS config','preview_url:TEXT::プレビューURL:Preview URL','is_premium:BOOLEAN:DEFAULT false:プレミアム:Premium'],
  ClickLog:['link_id:UUID:FK(Link) NOT NULL:リンクID:Link ID','referrer:TEXT::リファラー:Referrer','user_agent:TEXT::ユーザーエージェント:User agent','ip_hash:VARCHAR(64)::IPハッシュ:IP hash','country:VARCHAR(2)::国コード:Country code'],
  Integration:[_U,'service:VARCHAR(100):NOT NULL:サービス名:Service','access_token:TEXT::アクセストークン:Access token',_CN,_SA],
  // ── Gamification ──
  Badge:['badge_name:VARCHAR(100):NOT NULL:バッジ名:Badge name',_D,'icon_url:TEXT::アイコンURL:Icon URL','criteria:JSONB::獲得条件:Criteria','points:INT:DEFAULT 0:ポイント:Points'],
  Challenge:[_T,_D,'challenge_type:VARCHAR(50)::種別:Type','reward_points:INT:DEFAULT 0:報酬ポイント:Reward points','starts_at:TIMESTAMP::開始日:Starts at','ends_at:TIMESTAMP::終了日:Ends at',_SA],
  Reward:['reward_name:VARCHAR(255):NOT NULL:報酬名:Reward name',_D,'cost_points:INT:NOT NULL:必要ポイント:Cost points','stock:INT:DEFAULT -1:在庫(-1=無制限):Stock','reward_type:VARCHAR(50)::報酬種別:Type'],
  Leaderboard:[_U,'score:INT:DEFAULT 0:スコア:Score','rank:INT::順位:Rank','period:VARCHAR(20):DEFAULT \'all_time\':期間:Period'],
  PointLog:[_U,'points:INT:NOT NULL:ポイント:Points','action:VARCHAR(100):NOT NULL:操作:Action','balance_after:INT::残高:Balance after'],
  Achievement:[_U,'badge_id:UUID:FK(Badge) NOT NULL:バッジID:Badge ID','earned_at:TIMESTAMP:DEFAULT NOW:獲得日時:Earned at'],
  // ── Collab ──
  Document:['workspace_id:UUID:FK(Workspace):ワークスペースID:Workspace ID','owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID',_T,'content:TEXT::内容:Content','doc_type:VARCHAR(50):DEFAULT \'text\':ドキュメント種別:Document type','is_public:BOOLEAN:DEFAULT false:公開:Public'],
  Version:['document_id:UUID:FK(Document) NOT NULL:ドキュメントID:Document ID','author_id:UUID:FK(User) NOT NULL:著者ID:Author ID','content:TEXT:NOT NULL:内容:Content','version_number:INT:NOT NULL:バージョン:Version number','change_summary:TEXT::変更概要:Change summary'],
  Permission:['document_id:UUID:FK(Document) NOT NULL:ドキュメントID:Document ID',_U,'role:VARCHAR(20):DEFAULT \'viewer\':権限:Role','granted_at:TIMESTAMP:DEFAULT NOW:付与日時:Granted at'],
  // ── IoT ──
  SensorData:['sensor_id:UUID:FK(Sensor) NOT NULL:センサーID:Sensor ID','value:DECIMAL(15,5):NOT NULL:測定値:Value','recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at','quality:VARCHAR(20):DEFAULT \'good\':品質:Quality'],
  Command:['device_id:UUID:FK(Device) NOT NULL:デバイスID:Device ID','command_type:VARCHAR(50):NOT NULL:コマンド種別:Command type','payload:JSONB::ペイロード:Payload',_SP,'executed_at:TIMESTAMP::実行日時:Executed at'],
  DeviceGroup:['group_name:VARCHAR(255):NOT NULL:グループ名:Group name',_D,_U],
  // ── Community ──
  Group:['owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID','group_name:VARCHAR(255):NOT NULL:グループ名:Group name',_D,'is_private:BOOLEAN:DEFAULT false:非公開:Private','member_count:INT:DEFAULT 0:メンバー数:Member count'],
  // Webhook (devtool)
  Webhook:[_U,'url:TEXT:NOT NULL:Webhook URL:Webhook URL','events:JSONB:NOT NULL:イベント:Events','secret:TEXT::シークレット:Secret',_IA,'last_triggered_at:TIMESTAMP::最終実行:Last triggered'],
  // ── Medical/Clinic ──
  Patient:[_U,'patient_name:VARCHAR(255):NOT NULL:患者名:Patient name','date_of_birth:DATE::生年月日:Date of birth','gender:VARCHAR(20)::性別:Gender','blood_type:VARCHAR(10)::血液型:Blood type','allergies:TEXT::アレルギー:Allergies','emergency_contact:VARCHAR(255)::緊急連絡先:Emergency contact'],
  Doctor:[_U,'doctor_name:VARCHAR(255):NOT NULL:医師名:Doctor name','specialty:VARCHAR(100)::専門分野:Specialty','license_number:VARCHAR(100)::医師免許番号:License number','is_available:BOOLEAN:DEFAULT true:対応可能:Available'],
  MedicalRecord:['patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','doctor_id:UUID:FK(Doctor) NOT NULL:医師ID:Doctor ID','visit_date:TIMESTAMP:DEFAULT NOW:受診日:Visit date','diagnosis:TEXT::診断:Diagnosis','treatment:TEXT::治療:Treatment','symptoms:TEXT::症状:Symptoms',_N],
  Prescription:['medical_record_id:UUID:FK(MedicalRecord) NOT NULL:診療記録ID:Medical record ID','medication_name:VARCHAR(255):NOT NULL:薬剤名:Medication name','dosage:VARCHAR(100):NOT NULL:用量:Dosage','frequency:VARCHAR(100)::頻度:Frequency','duration_days:INT::処方日数:Duration(days)',_N],
  Appointment:['patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','doctor_id:UUID:FK(Doctor) NOT NULL:医師ID:Doctor ID','scheduled_at:TIMESTAMP:NOT NULL:予約日時:Scheduled at',_DUR,'reason:TEXT::受診理由:Reason',_SP,_N],
  Pet:['owner_id:UUID:FK(User) NOT NULL:飼い主ID:Owner ID','pet_name:VARCHAR(255):NOT NULL:ペット名:Pet name','species:VARCHAR(50):NOT NULL:種別:Species','breed:VARCHAR(100)::品種:Breed','date_of_birth:DATE::生年月日:Date of birth','weight_kg:DECIMAL(5,2)::体重(kg):Weight(kg)','medical_notes:TEXT::医療メモ:Medical notes'],
  Vaccination:['pet_id:UUID:FK(Pet) NOT NULL:ペットID:Pet ID','vaccine_name:VARCHAR(255):NOT NULL:ワクチン名:Vaccine name','administered_at:TIMESTAMP:NOT NULL:接種日:Administered at','next_due:DATE::次回予定:Next due','veterinarian_id:UUID:FK(Doctor):獣医ID:Veterinarian ID',_N],
  Veterinarian:[_U,'vet_name:VARCHAR(255):NOT NULL:獣医名:Vet name','specialty:VARCHAR(100)::専門分野:Specialty','license_number:VARCHAR(100)::免許番号:License number','is_available:BOOLEAN:DEFAULT true:対応可能:Available'],
  // ── Property Management ──
  Property:['owner_id:UUID:FK(User) NOT NULL:オーナーID:Owner ID','property_name:VARCHAR(255):NOT NULL:物件名:Property name','address:TEXT:NOT NULL:住所:Address','property_type:VARCHAR(50)::物件種別:Property type','units:INT:DEFAULT 1:ユニット数:Units',_SA],
  Unit:['property_id:UUID:FK(Property) NOT NULL:物件ID:Property ID','unit_number:VARCHAR(50):NOT NULL:ユニット番号:Unit number','bedrooms:INT::寝室数:Bedrooms','bathrooms:INT::浴室数:Bathrooms','area_sqm:DECIMAL(8,2)::面積(m²):Area(sqm)','monthly_rent:DECIMAL(10,2)::月額家賃:Monthly rent','status:VARCHAR(20):DEFAULT \'available\':状態:Status'],
  Tenant:[_U,'tenant_name:VARCHAR(255):NOT NULL:入居者名:Tenant name','email:VARCHAR(255)::メール:Email','phone:VARCHAR(50)::電話番号:Phone',_N],
  Lease:['unit_id:UUID:FK(Unit) NOT NULL:ユニットID:Unit ID','tenant_id:UUID:FK(Tenant) NOT NULL:入居者ID:Tenant ID','start_date:DATE:NOT NULL:開始日:Start date','end_date:DATE:NOT NULL:終了日:End date','monthly_rent:DECIMAL(10,2):NOT NULL:月額家賃:Monthly rent','deposit:DECIMAL(10,2)::敷金:Deposit','status:VARCHAR(20):DEFAULT \'active\':状態:Status'],
  MaintenanceRequest:['unit_id:UUID:FK(Unit) NOT NULL:ユニットID:Unit ID','tenant_id:UUID:FK(Tenant) NOT NULL:入居者ID:Tenant ID',_T,_D,'category:VARCHAR(50)::カテゴリ:Category',_SP,'assigned_to:UUID:FK(User):担当者ID:Assigned to','completed_at:TIMESTAMP::完了日時:Completed at'],
  Owner:[_U,'owner_name:VARCHAR(255):NOT NULL:オーナー名:Owner name','email:VARCHAR(255)::メール:Email','phone:VARCHAR(50)::電話番号:Phone','properties_count:INT:DEFAULT 0:所有物件数:Properties count'],
  // ── Contract Management ──
  Contract:['contract_name:VARCHAR(255):NOT NULL:契約名:Contract name','contract_type:VARCHAR(50)::契約種別:Contract type','start_date:DATE::開始日:Start date','end_date:DATE::終了日:End date','auto_renew:BOOLEAN:DEFAULT false:自動更新:Auto renew','status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status','document_url:TEXT::契約書URL:Document URL','value:DECIMAL(12,2)::契約額:Contract value'],
  Party:['contract_id:UUID:FK(Contract) NOT NULL:契約ID:Contract ID','party_name:VARCHAR(255):NOT NULL:当事者名:Party name','party_type:VARCHAR(50):NOT NULL:当事者種別:Party type','contact_email:VARCHAR(255)::連絡先メール:Contact email','signatory:VARCHAR(255)::署名者:Signatory'],
  Approval:['contract_id:UUID:FK(Contract) NOT NULL:契約ID:Contract ID','approver_id:UUID:FK(User) NOT NULL:承認者ID:Approver ID','status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status','approved_at:TIMESTAMP::承認日時:Approved at','comments:TEXT::コメント:Comments'],
  Signature:['contract_id:UUID:FK(Contract) NOT NULL:契約ID:Contract ID','signer_id:UUID:FK(User) NOT NULL:署名者ID:Signer ID','signed_at:TIMESTAMP:DEFAULT NOW:署名日時:Signed at','signature_hash:TEXT::署名ハッシュ:Signature hash','ip_address:VARCHAR(45)::IPアドレス:IP address'],
  Clause:['contract_id:UUID:FK(Contract) NOT NULL:契約ID:Contract ID','clause_number:VARCHAR(20)::条項番号:Clause number',_T,'content:TEXT:NOT NULL:内容:Content',_SO],
  // ── Helpdesk ──
  KnowledgeArticle:[_T,'slug:VARCHAR(255):UNIQUE:スラグ:Slug','content:TEXT:NOT NULL:内容:Content',_CAT,_SA,'view_count:INT:DEFAULT 0:閲覧数:View count','helpful_count:INT:DEFAULT 0:役立った数:Helpful count'],
  Response:['ticket_id:UUID:FK(Task) NOT NULL:チケットID:Ticket ID','responder_id:UUID:FK(User) NOT NULL:回答者ID:Responder ID','content:TEXT:NOT NULL:内容:Content','is_public:BOOLEAN:DEFAULT true:公開:Public'],
  SLA:['name:VARCHAR(100):NOT NULL:SLA名:SLA name','priority:VARCHAR(20):NOT NULL:優先度:Priority','response_time_hours:INT:NOT NULL:応答時間(時):Response time(hours)','resolution_time_hours:INT:NOT NULL:解決時間(時):Resolution time(hours)',_IA],
  Priority:[_U,'priority_level:VARCHAR(20):NOT NULL:優先度:Priority level','color:VARCHAR(7)::色:Color',_SO],
  // ── Tutoring ──
  Tutor:[_U,'tutor_name:VARCHAR(255):NOT NULL:講師名:Tutor name','bio:TEXT::自己紹介:Bio','hourly_rate:DECIMAL(8,2)::時給:Hourly rate','is_verified:BOOLEAN:DEFAULT false:認証済:Verified','rating:DECIMAL(3,2)::評価:Rating'],
  Student:[_U,'student_name:VARCHAR(255):NOT NULL:生徒名:Student name','grade_level:VARCHAR(50)::学年:Grade level','parent_email:VARCHAR(255)::保護者メール:Parent email',_N],
  Subject:['subject_name:VARCHAR(100):NOT NULL:科目名:Subject name',_D,_CAT],
  Availability:['tutor_id:UUID:FK(Tutor) NOT NULL:講師ID:Tutor ID','day_of_week:INT:NOT NULL:曜日(0-6):Day of week','start_time:TIME:NOT NULL:開始時刻:Start time','end_time:TIME:NOT NULL:終了時刻:End time','is_available:BOOLEAN:DEFAULT true:利用可能:Available'],
  // ── Restaurant ──
  Table:['table_number:VARCHAR(20):NOT NULL:テーブル番号:Table number','capacity:INT:NOT NULL:定員:Capacity','location:VARCHAR(50)::場所:Location',_SA],
  Reservation:['table_id:UUID:FK(Table) NOT NULL:テーブルID:Table ID',_U,'guest_name:VARCHAR(255):NOT NULL:予約者名:Guest name','guest_count:INT:NOT NULL:人数:Guest count','reserved_at:TIMESTAMP:NOT NULL:予約日時:Reserved at',_SP,'special_requests:TEXT::特別リクエスト:Special requests'],
  MenuItem:[_T,_D,'category:VARCHAR(50)::カテゴリ:Category',_PR,'image_url:TEXT::画像URL:Image URL','is_available:BOOLEAN:DEFAULT true:提供可能:Available','allergens:JSONB::アレルゲン:Allergens'],
  Shift:['staff_id:UUID:FK(User) NOT NULL:スタッフID:Staff ID','shift_date:DATE:NOT NULL:勤務日:Shift date','start_time:TIME:NOT NULL:開始時刻:Start time','end_time:TIME:NOT NULL:終了時刻:End time','role:VARCHAR(50)::役割:Role',_SA],
  // ── Construction Payment ──
  Contractor:['contractor_name:VARCHAR(255):NOT NULL:業者名:Contractor name','contact_person:VARCHAR(255)::担当者:Contact person','email:VARCHAR(255)::メール:Email','phone:VARCHAR(50)::電話番号:Phone','license_number:VARCHAR(100)::免許番号:License number',_SA],
  ProgressReport:['project_id:UUID:FK(Project) NOT NULL:プロジェクトID:Project ID','contractor_id:UUID:FK(Contractor) NOT NULL:業者ID:Contractor ID','report_date:DATE:NOT NULL:報告日:Report date','completion_percentage:INT:NOT NULL:完了率(%):Completion(%)','work_summary:TEXT::作業概要:Work summary','photo_urls:JSONB::写真URL:Photo URLs',_SP],
  Estimate:['project_id:UUID:FK(Project) NOT NULL:プロジェクトID:Project ID','contractor_id:UUID:FK(Contractor) NOT NULL:業者ID:Contractor ID','estimate_number:VARCHAR(50)::見積番号:Estimate number','total_amount:DECIMAL(12,2):NOT NULL:総額:Total amount','line_items:JSONB::明細:Line items',_SP,'valid_until:DATE::有効期限:Valid until'],
  // ── Knowledge Base (Advanced) ──
  Article:[_U,_T,'slug:VARCHAR(255):UNIQUE:スラグ:Slug','content:TEXT:NOT NULL:内容:Content',_CAT,_SD,'view_count:INT:DEFAULT 0:閲覧数:View count','version:INT:DEFAULT 1:バージョン:Version'],
  AccessControl:['article_id:UUID:FK(Article) NOT NULL:記事ID:Article ID',_U,'role:VARCHAR(20):DEFAULT \'viewer\':権限:Role','granted_at:TIMESTAMP:DEFAULT NOW:付与日時:Granted at'],
  SearchLog:['query:VARCHAR(500):NOT NULL:検索クエリ:Search query',_U,'results_count:INT::結果数:Results count','clicked_article_id:UUID:FK(Article):クリック記事ID:Clicked article ID','searched_at:TIMESTAMP:DEFAULT NOW:検索日時:Searched at'],
  // ── Field Service ──
  WorkOrder:['customer_id:UUID:FK(User) NOT NULL:顧客ID:Customer ID','technician_id:UUID:FK(User):技術者ID:Technician ID',_T,_D,'location:TEXT:NOT NULL:場所:Location','scheduled_at:TIMESTAMP::予定日時:Scheduled at',_SP,'priority:VARCHAR(20):DEFAULT \'medium\':優先度:Priority','completed_at:TIMESTAMP::完了日時:Completed at'],
  Technician:[_U,'technician_name:VARCHAR(255):NOT NULL:技術者名:Technician name','skills:JSONB::スキル:Skills','certification:TEXT::資格:Certification','is_available:BOOLEAN:DEFAULT true:対応可能:Available','current_location:TEXT::現在地:Current location'],
  Location:['location_name:VARCHAR(255):NOT NULL:場所名:Location name','address:TEXT:NOT NULL:住所:Address','latitude:DECIMAL(10,7)::緯度:Latitude','longitude:DECIMAL(10,7)::経度:Longitude','contact_name:VARCHAR(255)::担当者名:Contact name','contact_phone:VARCHAR(50)::電話番号:Contact phone'],
  Customer:[_U,'customer_name:VARCHAR(255):NOT NULL:顧客名:Customer name','company:VARCHAR(255)::会社名:Company','email:VARCHAR(255)::メール:Email','phone:VARCHAR(50)::電話番号:Phone','billing_address:TEXT::請求先住所:Billing address',_N],
  // ── Missing entities (A1) ──
  Examination:['patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','doctor_id:UUID:FK(Doctor) NOT NULL:医師ID:Doctor ID','exam_date:TIMESTAMP:DEFAULT NOW:検査日:Exam date','exam_type:VARCHAR(100)::検査種別:Exam type','findings:TEXT::所見:Findings','diagnosis_code:VARCHAR(50)::診断コード:Diagnosis code',_N,_SA],
  Claim:['patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','invoice_id:UUID:FK(Invoice):請求書ID:Invoice ID','claim_number:VARCHAR(100):UNIQUE:請求番号:Claim number','claim_date:DATE:NOT NULL:請求日:Claim date','amount:DECIMAL(10,2):NOT NULL:金額:Amount','insurance_provider:VARCHAR(255)::保険者:Insurance provider',_SP,'paid_at:TIMESTAMP::支払日:Paid at'],
  Milestone:['contract_id:UUID:FK(Contract) NOT NULL:契約ID:Contract ID',_T,_D,'due_date:DATE::期限:Due date','completion_percentage:INT:DEFAULT 0:完了率(%):Completion(%)','payment_amount:DECIMAL(12,2)::支払額:Payment amount',_SP,'completed_at:TIMESTAMP::完了日時:Completed at'],
  Inventory:['item_name:VARCHAR(255):NOT NULL:品目名:Item name','sku:VARCHAR(100):UNIQUE:SKU:SKU','quantity:INT:DEFAULT 0:在庫数:Quantity','unit:VARCHAR(20)::単位:Unit','location:VARCHAR(255)::保管場所:Location','reorder_level:INT:DEFAULT 0:発注点:Reorder level',_SA],
  // ── New preset entities (C1) ──
  Contact:[_U,'contact_name:VARCHAR(255):NOT NULL:連絡先名:Contact name','company_id:UUID:FK(Company):企業ID:Company ID','email:VARCHAR(255)::メール:Email','phone:VARCHAR(50)::電話番号:Phone','position:VARCHAR(100)::役職:Position',_N,_SA],
  Deal:[_U,'deal_name:VARCHAR(255):NOT NULL:案件名:Deal name','contact_id:UUID:FK(Contact):連絡先ID:Contact ID','company_id:UUID:FK(Company):企業ID:Company ID','amount:DECIMAL(12,2)::金額:Amount','stage:VARCHAR(50):DEFAULT \'lead\':ステージ:Stage','probability:INT:DEFAULT 0:確度(%):Probability(%)','expected_close_date:DATE::成約予定日:Expected close',_N],
  Company:['company_name:VARCHAR(255):NOT NULL:企業名:Company name','industry:VARCHAR(100)::業種:Industry','website:TEXT::ウェブサイト:Website','employee_count:INT::従業員数:Employee count','annual_revenue:DECIMAL(15,2)::年間売上:Annual revenue',_N,_SA],
  Pipeline:['pipeline_name:VARCHAR(255):NOT NULL:パイプライン名:Pipeline name','stages:JSONB:NOT NULL:ステージ:Stages',_SO,_IA],
  Shipment:['tracking_number:VARCHAR(100):UNIQUE NOT NULL:追跡番号:Tracking number','origin:TEXT:NOT NULL:出発地:Origin','destination:TEXT:NOT NULL:目的地:Destination','route_id:UUID:FK(Route):ルートID:Route ID','driver_id:UUID:FK(Driver):ドライバーID:Driver ID',_SP,'shipped_at:TIMESTAMP::出荷日時:Shipped at','delivered_at:TIMESTAMP::配達日時:Delivered at','weight_kg:DECIMAL(8,2)::重量(kg):Weight(kg)'],
  Route:['route_name:VARCHAR(255):NOT NULL:ルート名:Route name','waypoints:JSONB:NOT NULL:経由地:Waypoints','distance_km:DECIMAL(10,2)::距離(km):Distance(km)','estimated_duration_min:INT::所要時間(分):Duration(min)',_IA],
  Warehouse:['warehouse_name:VARCHAR(255):NOT NULL:倉庫名:Warehouse name','address:TEXT:NOT NULL:住所:Address','capacity:INT::容量:Capacity','current_stock_count:INT:DEFAULT 0:現在庫数:Current stock',_SA],
  Driver:[_U,'driver_name:VARCHAR(255):NOT NULL:ドライバー名:Driver name','license_number:VARCHAR(100)::免許番号:License number','vehicle_type:VARCHAR(50)::車両種別:Vehicle type','is_available:BOOLEAN:DEFAULT true:稼働可能:Available','current_location:TEXT::現在地:Current location'],
  Form:[_U,_T,_D,_SA,'is_template:BOOLEAN:DEFAULT false:テンプレート:Template','response_count:INT:DEFAULT 0:回答数:Response count'],
  Question:['form_id:UUID:FK(Form) NOT NULL:フォームID:Form ID','question_text:TEXT:NOT NULL:質問文:Question text','question_type:VARCHAR(50):NOT NULL:質問種別:Question type','options:JSONB::選択肢:Options','is_required:BOOLEAN:DEFAULT false:必須:Required',_SO],
  Answer:['form_id:UUID:FK(Form) NOT NULL:フォームID:Form ID','question_id:UUID:FK(Question) NOT NULL:質問ID:Question ID',_U,'answer_value:TEXT::回答値:Answer value','submitted_at:TIMESTAMP:DEFAULT NOW:回答日時:Submitted at'],
  Job:['job_title:VARCHAR(255):NOT NULL:職種:Job title','company:VARCHAR(255):NOT NULL:企業名:Company','location:VARCHAR(255)::勤務地:Location','salary_range:VARCHAR(100)::給与レンジ:Salary range','job_type:VARCHAR(50)::雇用形態:Job type',_D,'status:VARCHAR(20):DEFAULT \'open\':募集状態:Status','posted_at:TIMESTAMP:DEFAULT NOW:掲載日:Posted at'],
  SavedJob:[_U,'job_id:UUID:FK(Job) NOT NULL:求人ID:Job ID','saved_at:TIMESTAMP:DEFAULT NOW:保存日時:Saved at',_N],
  // Reverse Engineering & Goal Management
  UserGoal:[_U,'goal_title:VARCHAR(255):NOT NULL:目標タイトル:Goal title','target_value:VARCHAR(100)::目標値:Target value','current_value:VARCHAR(100)::現在値:Current value','deadline:DATE::期限:Deadline','priority:VARCHAR(20):DEFAULT \'medium\':優先度:Priority',_SA,'achieved_at:TIMESTAMP::達成日時:Achieved at'],
  ReversePlan:[_U,'plan_title:VARCHAR(255):NOT NULL:計画タイトル:Plan title','goal_id:UUID:FK(UserGoal):目標ID:Goal ID','strategy:TEXT::戦略:Strategy','total_steps:INT:DEFAULT 0:総ステップ数:Total steps','completed_steps:INT:DEFAULT 0:完了ステップ数:Completed steps',_SA],
  PlanStep:['plan_id:UUID:FK(ReversePlan) NOT NULL:計画ID:Plan ID','step_order:INT:NOT NULL:ステップ順序:Step order','step_title:VARCHAR(255):NOT NULL:ステップタイトル:Step title',_D,'estimated_hours:DECIMAL(5,1)::推定時間:Estimated hours',_SA,'completed_at:TIMESTAMP::完了日時:Completed at'],
  ProgressTracking:['plan_id:UUID:FK(ReversePlan) NOT NULL:計画ID:Plan ID','tracked_at:TIMESTAMP:DEFAULT NOW:記録日時:Tracked at','progress_pct:DECIMAL(5,2)::進捗率:Progress pct','velocity:DECIMAL(5,2)::ベロシティ:Velocity','blockers:TEXT::障害:Blockers',_N],
  PlanAdjustment:['plan_id:UUID:FK(ReversePlan) NOT NULL:計画ID:Plan ID','adjusted_at:TIMESTAMP:DEFAULT NOW:調整日時:Adjusted at','reason:TEXT:NOT NULL:調整理由:Reason','old_value:TEXT::旧値:Old value','new_value:TEXT::新値:New value',_N],
  // ── Missing domain entities (M1 fix) ──
  Chart:[_U,'chart_type:VARCHAR(50):NOT NULL:チャート種別:Chart type','data_source:VARCHAR(100)::データソース:Data source',_CN,'query_config:JSONB::クエリ設定:Query config',_T],
  Viewing:['property_id:UUID:FK(Property) NOT NULL:物件ID:Property ID',_U,'scheduled_at:TIMESTAMP:NOT NULL:見学予定日時:Scheduled at',_SP,'feedback:TEXT::感想:Feedback','attended:BOOLEAN:DEFAULT false:出席:Attended'],
  Client:['client_name:VARCHAR(255):NOT NULL:依頼者名:Client name','company:VARCHAR(255)::企業名:Company','email:VARCHAR(255)::メール:Email','phone:VARCHAR(50)::電話番号:Phone',_SA,_N],
  Transfer:['from_account:UUID:FK(Account) NOT NULL:送金元口座:From account','to_account:UUID:FK(Account) NOT NULL:送金先口座:To account','amount:DECIMAL(12,2):NOT NULL:金額:Amount','currency:VARCHAR(3):DEFAULT \'JPY\':通貨:Currency','reference:VARCHAR(255)::参照番号:Reference',_SP],
  Card:['account_id:UUID:FK(Account) NOT NULL:口座ID:Account ID','card_number:VARCHAR(20):NOT NULL:カード番号:Card number','card_type:VARCHAR(20)::カード種別:Card type','expiry_date:VARCHAR(7)::有効期限:Expiry date',_SA,'credit_limit:DECIMAL(10,2)::限度額:Credit limit'],
  Statement:['account_id:UUID:FK(Account) NOT NULL:口座ID:Account ID','period_start:DATE:NOT NULL:期間開始:Period start','period_end:DATE:NOT NULL:期間終了:Period end','opening_balance:DECIMAL(12,2):NOT NULL:期首残高:Opening balance','closing_balance:DECIMAL(12,2):NOT NULL:期末残高:Closing balance','statement_url:TEXT::明細書URL:Statement URL'],
};

// ═══ Entity REST method restrictions ═══
// Entities not listed get full CRUD: GET, GET/:id, POST, PUT/:id, DELETE/:id
const ENTITY_METHODS={
  // Immutable records: create + read only (no update/delete)
  Payment:['GET','GET/:id','POST'],
  Transaction:['GET','GET/:id','POST'],
  Invoice:['GET','GET/:id','POST'],
  // Audit/log: read only
  Log:['GET','GET/:id'],
  RequestLog:['GET','GET/:id'],
  Activity:['GET','GET/:id'],
  Execution:['GET','GET/:id'],
  Handoff:['GET','GET/:id'],
  // User-owned singletons: no GET/:id (use auth context)
  Cart:['GET','POST','PATCH/:id','DELETE/:id'],
  Setting:['GET','PATCH'],
  // User: PATCH preferred over PUT
  User:['GET','GET/:id','POST','PATCH/:id'],
  // Enrollment/subscription: create + read + cancel (soft delete)
  Enrollment:['GET','GET/:id','POST','PATCH/:id'],
  Subscription:['GET','GET/:id','POST','PATCH/:id'],
  Attendee:['GET','GET/:id','POST','PATCH/:id','DELETE/:id'],
  // Certificate: issue only
  Certificate:['GET','GET/:id','POST'],
  // Medical records: create + read only (no modification for compliance)
  MedicalRecord:['GET','GET/:id','POST'],
  Vaccination:['GET','GET/:id','POST'],
  Prescription:['GET','GET/:id','POST'],
  // SLA: read-only (managed by admin)
  SLA:['GET','GET/:id'],
  // Contracts & Leases: limited modification (status updates only via PATCH)
  Lease:['GET','GET/:id','POST','PATCH/:id'],
  Contract:['GET','GET/:id','POST','PATCH/:id'],
  // Append-only/Read-only (A3)
  AuditLog:['GET','GET/:id'],
  PointLog:['GET','GET/:id'],
  Achievement:['GET','GET/:id','POST'],
  ClickLog:['GET','GET/:id','POST'],
  SensorData:['GET','GET/:id','POST'],
};
function getEntityMethods(entityName){
  return ENTITY_METHODS[entityName]||['GET','GET/:id','POST','PUT/:id','DELETE/:id'];
}

// Parse entity column definition string
function getEntityColumns(entityName,G,knownEntities){
  const cols=ENTITY_COLUMNS[entityName];
  if(!cols) return [];
  return cols.map(c=>{
    const [col,type,constraint,descJa,descEn]=c.split(':');
    return {col,type:type||'TEXT',constraint:constraint||'',desc:G?(descJa||col):(descEn||col)};
  }).filter(c=>{
    // If knownEntities provided, filter out FK references to undefined entities
    if(!knownEntities) return true;
    const fkMatch=c.constraint.match(/FK\((\w+)\)/);
    if(!fkMatch) return true;
    return knownEntities.includes(fkMatch[1]);
  });
}

function detectDomain(purpose){
  const p=(purpose||'').toLowerCase();
  const detect=[
    // Specific patterns first (higher priority)
    [/教育|学習|education|learning|lms|コース|course|tutoring|家庭教師/i,'education'],
    [/\bEC\b|eコマース|e-commerce|ショップ|\bshop\b|\bcommerce\b/i,'ec'],
    [/マーケットプレイス|marketplace/i,'marketplace'],
    [/ゲーミ|gamification|gamify|バッジ|ポイント|リーダーボード/i,'gamify'],
    [/saas|サブスク|subscription|helpdesk|ヘルプデスク|チケット管理/i,'saas'],
    [/イベント|event.?management|カンファレンス|セミナー|チケット販売/i,'event'],
    [/ニュースレター|newsletter|メール配信|メルマガ|購読/i,'newsletter'],
    [/クリエイター|creator|ファン|コンテンツ販売|投げ銭/i,'creator'],
    [/コミュニティ|community|フォーラム|forum/i,'community'],
    [/コンテンツ|content|メディア|media|ブログ|blog|knowledge.?base|ナレッジベース/i,'content'],
    [/分析|analytics|可視化|ダッシュボード/i,'analytics'],
    [/予約|booking|スケジュール|restaurant|レストラン|飲食店/i,'booking'],
    [/AIエージェント|ai.?agent|chatbot|チャットボット|対話型|FAQ/i,'ai'],
    [/自動化|automation|workflow|ワークフロー|RPA|ノーコード/i,'automation'],
    [/共同編集|collaboration|collab|リアルタイム編集/i,'collab'],
    [/開発者ツール|dev.?tool|API管理|APIキー/i,'devtool'],
    [/IoT|デバイス|device|sensor|センサー|field.?service|フィールドサービス/i,'iot'],
    [/不動産|物件|real.?estate|property.?mgmt|property.?management/i,'realestate'],
    [/法務|契約|legal|contract.?mgmt|contract.?management|コンプライアンス/i,'legal'],
    [/人事|HR|採用|recruit|hiring/i,'hr'],
    [/金融|fintech|銀行|bank|決済管理|construction.?pay|工事代金/i,'fintech'],
    [/医療|ヘルスケア|health|medical|clinic|病院|patient|患者|veterinary|動物病院|ペット/i,'health'],
    [/ポートフォリオ|portfolio|link.?in.?bio|linkbio/i,'portfolio'],
    [/pwa|progressive.?web|オフライン|offline/i,'tool'],
    // Generic patterns last (lower priority)
    [/業務|business|効率化|ツール|tool/i,'tool'],
  ];
  for(const[rx,key]of detect){if(rx.test(p))return key;}
  return null;
}
function inferER(a){
  const G=S.genLang==='ja';
  const domain=detectDomain(a.purpose);
  const entities=(a.data_entities||'').split(/[,、]\s*/).map(e=>e.trim()).filter(Boolean);
  const warnings=[];
  const suggestions=[];

  if(domain&&DOMAIN_ENTITIES[domain]){
    const d=DOMAIN_ENTITIES[domain];
    entities.forEach(e=>{
      if(d.warn.includes(e)){
        const alt=d.suggest[e];
        if(alt){
          warnings.push(G?`⚠️ ${e} は${domain}ドメインでは ${alt} に置き換えることを推奨`:`⚠️ Consider replacing ${e} with ${alt} for ${domain} domain`);
          suggestions.push({from:e,to:alt});
        } else {
          warnings.push(G?`ℹ️ ${e} は${domain}ドメインでは一般的ではありません`:`ℹ️ ${e} is uncommon in ${domain} domain`);
        }
      }
    });
  }

  // ER relationships — returns simple pairs only (no chain format)
  const rels=[];
  const has=(n)=>entities.some(e=>e.toLowerCase()===n.toLowerCase());
  // User → various
  if(has('User')&&has('Post')) rels.push('User 1 ──N Post');
  if(has('User')&&has('Comment')) rels.push('User 1 ──N Comment');
  if(has('User')&&has('Order')) rels.push('User 1 ──N Order');
  if(has('User')&&has('Booking')) rels.push('User 1 ──N Booking');
  if(has('User')&&has('Review')) rels.push('User 1 ──N Review');
  if(has('User')&&has('Progress')) rels.push('User 1 ──N Progress');
  if(has('User')&&has('Enrollment')) rels.push('User 1 ──N Enrollment');
  if(has('User')&&has('Message')) rels.push('User 1 ──N Message');
  if(has('User')&&has('Notification')) rels.push('User 1 ──N Notification');
  if(has('User')&&has('Subscription')) rels.push('User 1 ──N Subscription');
  if(has('User')&&has('Listing')) rels.push('User 1 ──N Listing');
  if(has('User')&&has('Workspace')) rels.push('User N ──M Workspace (via Member)');
  // Content
  if(has('Post')&&has('Comment')) rels.push('Post 1 ──N Comment');
  if(has('Post')&&has('Tag')) rels.push('Post N ──M Tag');
  if(has('Post')&&has('Like')) rels.push('Post 1 ──N Like');
  if(has('Post')&&has('Media')) rels.push('Post 1 ──N Media');
  // EC
  if(has('Product')&&has('Category')) rels.push('Product N ──1 Category');
  if(has('Product')&&has('Order')) rels.push('Order N ──M Product (via OrderItem)');
  if(has('Product')&&has('Review')) rels.push('Product 1 ──N Review');
  if(has('Product')&&has('Cart')) rels.push('Product 1 ──N Cart');
  if(has('Order')&&has('Payment')) rels.push('Order 1 ──1 Payment');
  // Education
  if(has('Course')&&has('Lesson')) rels.push('Course 1 ──N Lesson');
  if(has('Course')&&has('Enrollment')) rels.push('Course 1 ──N Enrollment');
  if(has('Course')&&has('Review')) rels.push('Course 1 ──N Review');
  if(has('Course')&&has('Quiz')) rels.push('Course 1 ──N Quiz');
  if(has('Lesson')&&has('Quiz')) rels.push('Lesson 1 ──N Quiz');
  if(has('Lesson')&&has('Progress')) rels.push('Lesson 1 ──N Progress');
  // Booking
  if(has('Service')&&has('Booking')) rels.push('Service 1 ──N Booking');
  if(has('Service')&&has('TimeSlot')) rels.push('Service 1 ──N TimeSlot');
  // SaaS/Project
  if(has('Workspace')&&has('Project')) rels.push('Workspace 1 ──N Project');
  if(has('Project')&&has('Task')) rels.push('Project 1 ──N Task');
  if(has('Dashboard')&&has('Widget')) rels.push('Dashboard 1 ──N Widget');
  // Listing
  if(has('Listing')&&has('Category')) rels.push('Listing N ──1 Category');
  // IoT
  if(has('Device')&&has('Sensor')) rels.push('Device 1 ──N Sensor');
  // Category self-ref
  if(has('Category')) rels.push('Category 0 ──N Category');
  // Medical/Clinic
  if(has('Patient')&&has('MedicalRecord')) rels.push('Patient 1 ──N MedicalRecord');
  if(has('Doctor')&&has('MedicalRecord')) rels.push('Doctor 1 ──N MedicalRecord');
  if(has('MedicalRecord')&&has('Prescription')) rels.push('MedicalRecord 1 ──N Prescription');
  if(has('Patient')&&has('Appointment')) rels.push('Patient 1 ──N Appointment');
  if(has('Doctor')&&has('Appointment')) rels.push('Doctor 1 ──N Appointment');
  if(has('Pet')&&has('Vaccination')) rels.push('Pet 1 ──N Vaccination');
  // Property Management
  if(has('Property')&&has('Unit')) rels.push('Property 1 ──N Unit');
  if(has('Unit')&&has('Lease')) rels.push('Unit 1 ──N Lease');
  if(has('Tenant')&&has('Lease')) rels.push('Tenant 1 ──N Lease');
  if(has('Unit')&&has('MaintenanceRequest')) rels.push('Unit 1 ──N MaintenanceRequest');
  // Contract Management
  if(has('Contract')&&has('Party')) rels.push('Contract 1 ──N Party');
  if(has('Contract')&&has('Approval')) rels.push('Contract 1 ──N Approval');
  if(has('Contract')&&has('Signature')) rels.push('Contract 1 ──N Signature');
  if(has('Contract')&&has('Milestone')) rels.push('Contract 1 ──N Milestone');
  // Restaurant
  if(has('Table')&&has('Reservation')) rels.push('Table 1 ──N Reservation');
  if(has('Order')&&has('MenuItem')) rels.push('Order N ──M MenuItem (via OrderItem)');
  if(has('Table')&&has('Order')) rels.push('Table 1 ──N Order');
  // HR
  if(has('JobPosting')&&has('Applicant')) rels.push('JobPosting 1 ──N Applicant');
  if(has('Applicant')&&has('Interview')) rels.push('Applicant 1 ──N Interview');
  if(has('Applicant')&&has('Evaluation')) rels.push('Applicant 1 ──N Evaluation');
  if(has('Department')&&has('JobPosting')) rels.push('Department 1 ──N JobPosting');
  // Construction
  if(has('Project')&&has('Contractor')) rels.push('Project N ──M Contractor');
  if(has('Project')&&has('ProgressReport')) rels.push('Project 1 ──N ProgressReport');
  if(has('Project')&&has('Estimate')) rels.push('Project 1 ──N Estimate');
  // Knowledge Base
  if(has('Article')&&has('SearchLog')) rels.push('Article 1 ──N SearchLog');
  if(has('Article')&&has('AccessControl')) rels.push('Article 1 ──N AccessControl');
  // Field Service
  if(has('WorkOrder')&&has('Technician')) rels.push('WorkOrder N ──1 Technician');
  if(has('WorkOrder')&&has('Location')) rels.push('WorkOrder N ──1 Location');
  if(has('Customer')&&has('WorkOrder')) rels.push('Customer 1 ──N WorkOrder');
  if(has('WorkOrder')&&has('Inventory')) rels.push('WorkOrder N ──M Inventory (via WorkOrderItem)');
  // Gaming
  if(has('User')&&has('Badge')) rels.push('User N ──M Badge (via Achievement)');
  if(has('User')&&has('Challenge')) rels.push('User N ──M Challenge');
  if(has('User')&&has('PointLog')) rels.push('User 1 ──N PointLog');
  if(has('Badge')&&has('Achievement')) rels.push('Badge 1 ──N Achievement');
  // Medical (Examination & Claim)
  if(has('Patient')&&has('Examination')) rels.push('Patient 1 ──N Examination');
  if(has('Doctor')&&has('Examination')) rels.push('Doctor 1 ──N Examination');
  if(has('Patient')&&has('Claim')) rels.push('Patient 1 ──N Claim');
  if(has('Invoice')&&has('Claim')) rels.push('Invoice 1 ──1 Claim');

  return {domain,warnings,suggestions,relationships:rels};
}

// ── Feature Detail Dictionary ──
// Provides acceptance criteria and test cases per feature pattern
const FEATURE_DETAILS={
  'ユーザー認証|認証|Auth|ログイン|Login|SignUp':{
    criteria_ja:['メール+パスワードでの新規登録','ソーシャルログイン({auth})','パスワードリセットメール送信','セッション管理・自動トークンリフレッシュ','ログアウト後のトークン無効化','プロフィール表示・編集'],
    criteria_en:['Email + password registration','Social login ({auth})','Password reset email','Session management / auto token refresh','Token invalidation on logout','Profile view & edit'],
    tests_ja:[['正常系: メール+パスワードで登録','201, ユーザー作成・セッション開始'],['正常系: ソーシャルログイン','302, OAuth認証→コールバック→セッション'],['正常系: パスワードリセット','200, リセットメール送信'],['異常系: 重複メールで登録','409/422, メール重複エラー'],['異常系: 不正パスワード(8文字未満)','422, バリデーションエラー'],['異常系: 無効トークンでアクセス','401, Unauthorized']],
    tests_en:[['Normal: Register with email+password','201, user created + session start'],['Normal: Social login','302, OAuth → callback → session'],['Normal: Password reset','200, reset email sent'],['Error: Duplicate email','409/422, email already exists'],['Error: Weak password(<8 chars)','422, validation error'],['Error: Invalid token','401, Unauthorized']],
  },
  'コース管理|コース|Course|講座':{
    criteria_ja:['コース作成(タイトル/説明/サムネイル/価格)','コース一覧(検索/フィルタ/ページネーション)','コース詳細表示','下書き↔公開のステータス管理','講師のみ編集可能(RLS)','カテゴリ/タグによる分類'],
    criteria_en:['Create course (title/desc/thumbnail/price)','List courses (search/filter/pagination)','Course detail view','Draft ↔ published status toggle','Instructor-only edit (RLS)','Category/tag classification'],
    tests_ja:[['正常系: コース作成(全フィールド)','201, DBにコース保存'],['正常系: ステータス変更(draft→published)','200, 公開日時記録'],['正常系: 一覧検索+フィルタ','200, フィルタ結果返却'],['異常系: 未認証でコース作成','401'],['異常系: 他講師のコースを編集','403 (RLS拒否)'],['異常系: タイトル空で作成','422, バリデーション']],
    tests_en:[['Normal: Create course (all fields)','201, course saved'],['Normal: Status change (draft→published)','200, publish date recorded'],['Normal: List with search+filter','200, filtered results'],['Error: Create without auth','401'],['Error: Edit other instructor\'s course','403 (RLS denied)'],['Error: Create with empty title','422, validation']],
  },
  '進捗管理|進捗|Progress|学習進捗':{
    criteria_ja:['レッスン完了の記録','コース全体の進捗率算出','学習履歴の一覧表示','完了条件: レッスンページ閲覧完了','進捗ダッシュボード(統計/グラフ)'],
    criteria_en:['Record lesson completion','Calculate overall course progress','Learning history list','Completion: lesson page viewed','Progress dashboard (stats/charts)'],
    tests_ja:[['正常系: レッスン完了を記録','200, progress.status=completed'],['正常系: コース進捗率取得','200, {progress_pct: 60}'],['正常系: 全完了でコース修了','200, enrollment.status=completed'],['異常系: 未受講コースの進捗記録','403/404'],['異常系: 同レッスン二重完了','200, 冪等(既存更新)']],
    tests_en:[['Normal: Mark lesson complete','200, progress.status=completed'],['Normal: Get course progress','200, {progress_pct: 60}'],['Normal: All done = course complete','200, enrollment.status=completed'],['Error: Progress on unenrolled course','403/404'],['Error: Double complete same lesson','200, idempotent']],
  },
  'サブスクリプション|課金|Billing|Stripe|決済|Payment|サブスク':{
    criteria_ja:['プラン選択画面(Free/Pro/Enterprise)','Stripe Checkout セッション作成','Webhook処理(invoice.paid, customer.subscription.deleted)','課金状態表示(アクティブ/期限切れ/解約済)','プラン変更/解約フロー','無料トライアル期間設定'],
    criteria_en:['Plan selection (Free/Pro/Enterprise)','Create Stripe Checkout session','Webhook (invoice.paid, subscription.deleted)','Billing status display (active/expired/canceled)','Plan change / cancel flow','Free trial period config'],
    tests_ja:[['正常系: Checkout セッション作成','200, checkout URL返却'],['正常系: Webhook invoice.paid 受信','200, subscription.status=active'],['正常系: プラン変更(Pro→Enterprise)','200, 次期間から適用'],['正常系: サブスク解約','200, 期間末まで有効'],['異常系: 無効Webhook署名','400, 署名検証失敗'],['異常系: 未認証でCheckout作成','401']],
    tests_en:[['Normal: Create checkout session','200, checkout URL returned'],['Normal: Webhook invoice.paid','200, subscription.status=active'],['Normal: Plan change (Pro→Enterprise)','200, applied next period'],['Normal: Cancel subscription','200, valid until period end'],['Error: Invalid webhook signature','400, sig verification failed'],['Error: Checkout without auth','401']],
  },
  '管理(ダッシュボード|画面)|Admin|管理者|ダッシュボード管理':{
    criteria_ja:['管理者ログイン(role=adminチェック)','ユーザー一覧/検索/停止','コンテンツ管理(一覧/承認/削除)','売上/統計ダッシュボード','監査ログ閲覧'],
    criteria_en:['Admin login (role=admin check)','User list/search/suspend','Content management (list/approve/delete)','Revenue/stats dashboard','Audit log viewer'],
    tests_ja:[['正常系: 管理者でアクセス','200, 管理画面表示'],['正常系: ユーザー停止','200, user.status=suspended'],['正常系: コンテンツ承認','200, content.status=approved'],['異常系: 一般ユーザーで管理画面アクセス','403'],['異常系: 管理者が自分を停止','422/403']],
    tests_en:[['Normal: Admin access','200, admin panel displayed'],['Normal: Suspend user','200, user.status=suspended'],['Normal: Approve content','200, content.status=approved'],['Error: Non-admin access','403'],['Error: Admin suspend self','422/403']],
  },
  '商品管理|商品|Product|商品一覧':{
    criteria_ja:['商品登録(名前/説明/価格/画像/SKU)','商品一覧(検索/カテゴリフィルタ/ページネーション)','在庫管理(入荷/出荷)','商品詳細表示','カテゴリ管理(CRUD/階層構造)'],
    criteria_en:['Register product (name/desc/price/image/SKU)','Product list (search/filter/pagination)','Inventory management','Product detail view','Category management (CRUD/hierarchy)'],
    tests_ja:[['正常系: 商品登録','201, 商品DBに保存'],['正常系: 在庫更新','200, stock数更新'],['正常系: カテゴリフィルタ','200, フィルタ結果'],['異常系: 価格が負数','422'],['異常系: SKU重複','409/422'],['異常系: 在庫0で購入','422, 在庫不足']],
    tests_en:[['Normal: Register product','201, saved to DB'],['Normal: Update stock','200, stock updated'],['Normal: Category filter','200, filtered results'],['Error: Negative price','422'],['Error: Duplicate SKU','409/422'],['Error: Buy with 0 stock','422, out of stock']],
  },
  '注文|Order|カート|Cart|購入':{
    criteria_ja:['カートに商品追加/数量変更/削除','カートから注文作成','注文履歴一覧','注文ステータス管理(pending→paid→shipped→delivered)','注文キャンセル(条件付き)'],
    criteria_en:['Add/update/remove cart items','Create order from cart','Order history list','Order status flow (pending→paid→shipped→delivered)','Conditional order cancel'],
    tests_ja:[['正常系: カート追加→注文作成','201, order作成+cart空に'],['正常系: 注文ステータス更新','200, status遷移'],['正常系: 注文キャンセル(pending)','200, status=cancelled'],['異常系: 空カートで注文','422'],['異常系: shipped後キャンセル','422, キャンセル不可']],
    tests_en:[['Normal: Cart add → create order','201, order created + cart cleared'],['Normal: Update order status','200, status transition'],['Normal: Cancel (pending)','200, status=cancelled'],['Error: Order from empty cart','422'],['Error: Cancel after shipped','422, not cancellable']],
  },
  'コメント|Comment|レビュー|Review':{
    criteria_ja:['コメント/レビュー投稿(本文+評価)','一覧表示(ページネーション)','投稿者のみ編集/削除可能','不適切コンテンツの報告機能'],
    criteria_en:['Post comment/review (body+rating)','List with pagination','Author-only edit/delete','Report inappropriate content'],
    tests_ja:[['正常系: レビュー投稿(rating=5)','201, レビュー保存'],['正常系: 自分のレビュー削除','204'],['異常系: 未認証で投稿','401'],['異常系: 他人のレビュー削除','403'],['異常系: rating範囲外(0 or 6)','422']],
    tests_en:[['Normal: Post review (rating=5)','201, review saved'],['Normal: Delete own review','204'],['Error: Post without auth','401'],['Error: Delete other\'s review','403'],['Error: Rating out of range','422']],
  },
  '投稿|Post|記事|Article|ブログ|Blog|コンテンツ投稿':{
    criteria_ja:['記事作成(タイトル/本文/スラグ/サムネイル)','下書き↔公開のステータス管理','一覧表示(検索/タグフィルタ/ページネーション)','Markdown/リッチテキストエディタ','OGP/SEOメタデータ設定'],
    criteria_en:['Create post (title/body/slug/thumbnail)','Draft ↔ published status','List (search/tag filter/pagination)','Markdown/rich text editor','OGP/SEO metadata'],
    tests_ja:[['正常系: 記事作成(下書き)','201, status=draft'],['正常系: 公開','200, published_at記録'],['正常系: スラグ検索','200, 記事返却'],['異常系: スラグ重複','409/422'],['異常系: 未認証で作成','401']],
    tests_en:[['Normal: Create draft post','201, status=draft'],['Normal: Publish','200, published_at set'],['Normal: Slug search','200, post returned'],['Error: Duplicate slug','409/422'],['Error: Create without auth','401']],
  },
  '予約|Booking|スケジュール|Appointment':{
    criteria_ja:['空き枠表示(カレンダービュー)','予約作成(日時/サービス選択)','予約確認メール送信','予約キャンセル/変更','リマインダー通知'],
    criteria_en:['Available slots (calendar view)','Create booking (date/service)','Booking confirmation email','Cancel/reschedule booking','Reminder notification'],
    tests_ja:[['正常系: 空き枠から予約作成','201, booking作成'],['正常系: 予約キャンセル','200, status=cancelled'],['異常系: 過去日時で予約','422'],['異常系: 同時刻に二重予約','409, 枠なし'],['異常系: 未認証で予約','401']],
    tests_en:[['Normal: Book from available slot','201, booking created'],['Normal: Cancel booking','200, status=cancelled'],['Error: Book past datetime','422'],['Error: Double book same slot','409, no availability'],['Error: Book without auth','401']],
  },
  'タスク管理|タスク|Task|Todo|プロジェクト管理':{
    criteria_ja:['タスク作成(タイトル/担当者/期日/優先度)','カンバンボード表示(todo/in_progress/done)','ドラッグ&ドロップでステータス変更','フィルタ(担当者/優先度/期日)','期日リマインダー通知'],
    criteria_en:['Create task (title/assignee/due/priority)','Kanban board (todo/in_progress/done)','D&D status change','Filter (assignee/priority/due)','Due date reminder'],
    tests_ja:[['正常系: タスク作成','201, task保存'],['正常系: ステータス変更(todo→done)','200, status更新'],['正常系: 担当者フィルタ','200, フィルタ結果'],['異常系: 他ワークスペースのタスク編集','403'],['異常系: タイトル空で作成','422']],
    tests_en:[['Normal: Create task','201, task saved'],['Normal: Status change (todo→done)','200, status updated'],['Normal: Filter by assignee','200, filtered'],['Error: Edit other workspace task','403'],['Error: Create with empty title','422']],
  },
  'ファイルアップロード|Upload|メディア|Media|画像':{
    criteria_ja:['ファイルアップロード(ドラッグ&ドロップ対応)','アップロード制限(10MB/画像・PDF)','プレビュー表示','ストレージ管理(Supabase Storage/S3)'],
    criteria_en:['File upload (drag & drop)','Upload limit (10MB/image/PDF)','Preview display','Storage (Supabase Storage/S3)'],
    tests_ja:[['正常系: 画像アップロード','201, URL返却'],['正常系: プレビュー表示','200, 画像取得'],['異常系: 10MB超ファイル','413/422, サイズ制限'],['異常系: 非対応形式(.exe)','422, 形式エラー'],['異常系: 未認証アップロード','401']],
    tests_en:[['Normal: Image upload','201, URL returned'],['Normal: Preview','200, image fetched'],['Error: >10MB file','413/422, size limit'],['Error: Unsupported format(.exe)','422'],['Error: Upload without auth','401']],
  },
  '検索|フィルタ|Search|Filter|絞り込み':{
    criteria_ja:['全文検索(タイトル/本文)','複合フィルタ(カテゴリ/タグ/日付範囲)','ソート(新着/人気/価格)','ページネーション(無限スクロール対応)','検索履歴保存'],
    criteria_en:['Full-text search (title/body)','Multi-filter (category/tag/date range)','Sort (newest/popular/price)','Pagination (infinite scroll)','Search history'],
    tests_ja:[['正常系: キーワード検索','200, マッチ結果返却'],['正常系: フィルタ+ソート組合せ','200, 複合条件適用'],['正常系: ページネーション','200, offset/limit適用'],['異常系: 不正なソート値','422, バリデーション'],['異常系: 空クエリ','200, 全件返却']],
    tests_en:[['Normal: Keyword search','200, matched results'],['Normal: Filter + sort combo','200, multi-condition applied'],['Normal: Pagination','200, offset/limit applied'],['Error: Invalid sort value','422, validation'],['Error: Empty query','200, all results']],
  },
  '通知|リマインダー|Notification|Reminder|アラート':{
    criteria_ja:['プッシュ通知(ブラウザ/モバイル)','メール通知(Resend/SendGrid)','通知一覧表示','既読/未読管理','通知設定(ON/OFF切替)','リマインダー自動送信'],
    criteria_en:['Push notifications (browser/mobile)','Email notifications (Resend/SendGrid)','Notification list','Read/unread management','Notification settings toggle','Auto reminder send'],
    tests_ja:[['正常系: 通知作成+送信','201, 通知DB保存+送信'],['正常系: 既読更新','200, read_at記録'],['正常系: 通知設定OFF','200, 送信スキップ'],['異常系: 未認証で通知一覧','401'],['異常系: 他ユーザーの通知既読','403']],
    tests_en:[['Normal: Create + send notification','201, saved + sent'],['Normal: Mark as read','200, read_at set'],['Normal: Notifications OFF','200, sending skipped'],['Error: List without auth','401'],['Error: Mark other\'s notification','403']],
  },
  '分析|レポート|Analytics|Report|統計|集計':{
    criteria_ja:['KPI集計(日次/週次/月次)','グラフ表示(recharts/Chart.js)','CSV/PDFエクスポート','カスタムレポート作成','リアルタイム更新(WebSocket/SSE)'],
    criteria_en:['KPI aggregation (daily/weekly/monthly)','Chart display (recharts/Chart.js)','CSV/PDF export','Custom report builder','Real-time updates (WebSocket/SSE)'],
    tests_ja:[['正常系: 期間指定集計','200, 集計結果返却'],['正常系: CSVエクスポート','200, CSV生成'],['正常系: グラフデータ取得','200, データポイント配列'],['異常系: 未来日で集計','422, 日付バリデーション'],['異常系: 大量データでタイムアウト','503/504, クエリ最適化必要']],
    tests_en:[['Normal: Aggregate by period','200, aggregated results'],['Normal: CSV export','200, CSV generated'],['Normal: Get chart data','200, data points array'],['Error: Aggregate future dates','422, date validation'],['Error: Large data timeout','503/504, query optimization needed']],
  },
  'チーム|権限|Team|Permission|RBAC|招待':{
    criteria_ja:['チーム作成・メンバー招待','ロール管理(owner/admin/member/viewer)','招待メール送信','権限チェック(RLS/middleware)','チームメンバー一覧表示'],
    criteria_en:['Create team & invite members','Role management (owner/admin/member/viewer)','Send invitation email','Permission check (RLS/middleware)','Team member list'],
    tests_ja:[['正常系: メンバー招待','201, 招待メール送信'],['正常系: ロール変更(member→admin)','200, 権限更新'],['正常系: メンバー削除','204'],['異常系: viewer権限でメンバー招待','403, 権限不足'],['異常系: 重複招待','409, 既存メンバー']],
    tests_en:[['Normal: Invite member','201, invitation sent'],['Normal: Change role (member→admin)','200, permission updated'],['Normal: Remove member','204'],['Error: Viewer invites member','403, insufficient permissions'],['Error: Duplicate invitation','409, already member']],
  },
  'チャット|メッセージ|Chat|Message|DM|リアルタイム':{
    criteria_ja:['リアルタイムメッセージ送受信(WebSocket/Supabase Realtime)','メッセージ一覧(ページネーション)','未読件数表示','既読管理','ファイル添付','メッセージ削除(24時間以内)'],
    criteria_en:['Real-time messaging (WebSocket/Supabase Realtime)','Message list (pagination)','Unread count','Read receipts','File attachment','Delete message (within 24h)'],
    tests_ja:[['正常系: メッセージ送信','201, 送受信者に配信'],['正常系: 既読更新','200, read_at記録'],['正常系: 未読件数取得','200, {unread: 5}'],['異常系: 未認証で送信','401'],['異常系: 24時間後に削除','422, 削除不可']],
    tests_en:[['Normal: Send message','201, delivered to sender/receiver'],['Normal: Mark as read','200, read_at set'],['Normal: Get unread count','200, {unread: 5}'],['Error: Send without auth','401'],['Error: Delete after 24h','422, cannot delete']],
  },
  'エクスポート|Export|PDF|CSV|ダウンロード':{
    criteria_ja:['CSV一括エクスポート','PDF生成(請求書/契約書/レポート)','エクスポート履歴保存','バックグラウンド処理(大量データ)','ZIP圧縮(複数ファイル)'],
    criteria_en:['Bulk CSV export','PDF generation (invoices/contracts/reports)','Export history','Background processing (large data)','ZIP compression (multi-file)'],
    tests_ja:[['正常系: CSV一括エクスポート','200, CSV生成+ダウンロード'],['正常系: PDF請求書生成','200, PDF URL返却'],['正常系: 複数ファイルZIP','200, ZIP生成'],['異常系: 大量データでメモリ不足','500, バッチ処理推奨'],['異常系: 未認証でエクスポート','401']],
    tests_en:[['Normal: Bulk CSV export','200, CSV generated + download'],['Normal: Generate PDF invoice','200, PDF URL returned'],['Normal: Multi-file ZIP','200, ZIP created'],['Error: Large data OOM','500, recommend batch'],['Error: Export without auth','401']],
  },
  'カレンダー|スケジュール|Calendar|Schedule|日程調整':{
    criteria_ja:['カレンダー表示(日/週/月ビュー)','予定作成・編集・削除','ドラッグ&ドロップで日時変更','Googleカレンダー連携','定期予定設定(毎週/毎月)'],
    criteria_en:['Calendar view (day/week/month)','Create/edit/delete events','D&D reschedule','Google Calendar sync','Recurring events (weekly/monthly)'],
    tests_ja:[['正常系: 予定作成','201, カレンダーに表示'],['正常系: D&Dで日時変更','200, starts_at更新'],['正常系: 定期予定作成','201, 繰り返し設定保存'],['異常系: 過去日時で作成','422, 日付バリデーション'],['異常系: 重複予定作成','409, 枠なし']],
    tests_en:[['Normal: Create event','201, shown on calendar'],['Normal: D&D reschedule','200, starts_at updated'],['Normal: Create recurring event','201, recurrence saved'],['Error: Create in past','422, date validation'],['Error: Double-book slot','409, conflict']],
  },
  '在庫管理|Inventory|在庫|Stock|入出庫':{
    criteria_ja:['在庫数リアルタイム表示','入庫/出庫記録','在庫アラート(低在庫/過剰在庫)','ロット管理(賞味期限/シリアル番号)','棚卸し機能'],
    criteria_en:['Real-time stock display','Inbound/outbound records','Stock alerts (low/excess)','Lot management (expiry/serial)','Inventory count'],
    tests_ja:[['正常系: 入庫記録','201, 在庫数増加'],['正常系: 出庫記録','200, 在庫数減少'],['正常系: 低在庫アラート','200, stock<10で通知'],['異常系: 在庫0で出庫','422, 在庫不足'],['異常系: 負数で入庫','422, 数量バリデーション']],
    tests_en:[['Normal: Inbound record','201, stock increased'],['Normal: Outbound record','200, stock decreased'],['Normal: Low stock alert','200, notify when stock<10'],['Error: Outbound with 0 stock','422, out of stock'],['Error: Negative inbound','422, quantity validation']],
  },
  'ソーシャル|フォロー|いいね|Social|Follow|Like|Share':{
    criteria_ja:['ユーザーフォロー/アンフォロー','フォロワー/フォロー中一覧','いいね機能','シェア機能','フィードタイムライン(フォロー中のみ)','ブロック機能'],
    criteria_en:['User follow/unfollow','Followers/following list','Like feature','Share feature','Feed timeline (following only)','Block feature'],
    tests_ja:[['正常系: ユーザーフォロー','201, フォロー記録'],['正常系: いいね追加','201, Like記録'],['正常系: フィード取得','200, フォロー中の投稿のみ'],['異常系: 自分をフォロー','422, 自己フォロー不可'],['異常系: 重複いいね','409, 既存いいね']],
    tests_en:[['Normal: Follow user','201, follow recorded'],['Normal: Add like','201, Like saved'],['Normal: Get feed','200, following posts only'],['Error: Self-follow','422, cannot follow self'],['Error: Duplicate like','409, already liked']],
  },
  '設定|環境設定|Settings|Preferences|Config':{
    criteria_ja:['プロフィール編集','パスワード変更','メール通知設定','プライバシー設定','テーマ切替(ダーク/ライト)','言語設定','アカウント削除'],
    criteria_en:['Profile edit','Password change','Email notification settings','Privacy settings','Theme toggle (dark/light)','Language settings','Account deletion'],
    tests_ja:[['正常系: プロフィール更新','200, 変更反映'],['正常系: パスワード変更','200, パスワードハッシュ更新'],['正常系: 通知OFF','200, 設定保存'],['異常系: 弱いパスワード','422, バリデーション'],['異常系: アカウント削除(確認なし)','400, 確認必須']],
    tests_en:[['Normal: Update profile','200, changes applied'],['Normal: Change password','200, hash updated'],['Normal: Notifications OFF','200, setting saved'],['Error: Weak password','422, validation'],['Error: Delete account (no confirm)','400, confirmation required']],
  },
  'MFA|2FA|二段階認証|多要素認証|TOTP':{
    criteria_ja:['TOTPセットアップ(QRコード表示)','バックアップコード生成','ログイン時のOTP検証','信頼済みデバイス登録','MFA無効化(パスワード確認)'],
    criteria_en:['TOTP setup (QR code)','Backup code generation','OTP verification on login','Trusted device registration','Disable MFA (password confirm)'],
    tests_ja:[['正常系: TOTP有効化','200, QRコード+秘密鍵返却'],['正常系: OTP検証','200, ログイン成功'],['正常系: バックアップコード使用','200, コード無効化'],['異常系: 不正OTP','401, 認証失敗'],['異常系: 期限切れOTP','401, タイムアウト']],
    tests_en:[['Normal: Enable TOTP','200, QR code + secret returned'],['Normal: Verify OTP','200, login success'],['Normal: Use backup code','200, code invalidated'],['Error: Invalid OTP','401, auth failed'],['Error: Expired OTP','401, timeout']],
  },
  'Webhook|連携|Integration|API連携':{
    criteria_ja:['Webhook URL登録','イベント選択(作成/更新/削除)','署名検証(HMAC)','リトライ設定(最大3回)','Webhook履歴・ログ','テストペイロード送信'],
    criteria_en:['Webhook URL registration','Event selection (create/update/delete)','Signature verification (HMAC)','Retry settings (max 3)','Webhook history & logs','Test payload send'],
    tests_ja:[['正常系: Webhook登録','201, URL保存+シークレット生成'],['正常系: イベントトリガー','200, Webhook送信'],['正常系: 署名検証','200, HMACマッチ'],['異常系: 不正署名','401, 検証失敗'],['異常系: 3回リトライ失敗','500, Webhook無効化']],
    tests_en:[['Normal: Register webhook','201, URL saved + secret generated'],['Normal: Event trigger','200, webhook sent'],['Normal: Verify signature','200, HMAC match'],['Error: Invalid signature','401, verification failed'],['Error: 3 retries failed','500, webhook disabled']],
  },
  'オンボーディング|チュートリアル|Onboarding|Tutorial|ガイド':{
    criteria_ja:['初回ログイン時のステップ表示','チェックリスト進捗管理','ツールチップガイド','スキップ機能','完了時のバッジ/報酬'],
    criteria_en:['Step display on first login','Checklist progress tracking','Tooltip guides','Skip feature','Badge/reward on completion'],
    tests_ja:[['正常系: チェックリスト表示','200, 未完了ステップ返却'],['正常系: ステップ完了','200, 進捗更新'],['正常系: スキップ','200, オンボーディング終了'],['異常系: 完了済みステップを再度完了','200, 冪等'],['正常系: 全ステップ完了','200, バッジ付与']],
    tests_en:[['Normal: Show checklist','200, incomplete steps returned'],['Normal: Complete step','200, progress updated'],['Normal: Skip','200, onboarding ended'],['Error: Re-complete finished step','200, idempotent'],['Normal: All steps done','200, badge granted']],
  },
  'APIキー|開発者|API Key|Developer|トークン管理':{
    criteria_ja:['APIキー発行(プレフィックス表示)','権限スコープ設定(read/write)','有効期限設定','キー無効化/削除','使用状況ダッシュボード','レート制限設定'],
    criteria_en:['API key issuance (prefix display)','Permission scope (read/write)','Expiration date setting','Key revocation/deletion','Usage dashboard','Rate limit config'],
    tests_ja:[['正常系: APIキー発行','201, キー返却(1回のみ)'],['正常系: スコープ制限でアクセス','200, read権限OK'],['正常系: キー無効化','204, 以降401'],['異常系: 有効期限切れキー','401, Expired'],['異常系: レート制限超過','429, Too Many Requests']],
    tests_en:[['Normal: Issue API key','201, key returned (once)'],['Normal: Scoped access','200, read permission OK'],['Normal: Revoke key','204, 401 after'],['Error: Expired key','401, Expired'],['Error: Rate limit exceeded','429, Too Many Requests']],
  },
  '監査ログ|履歴|Audit|Log|History|アクティビティ':{
    criteria_ja:['全操作の記録(作成/更新/削除)','ユーザー・IPアドレス記録','タイムスタンプ','フィルタ・検索機能','エクスポート(CSV/JSON)','保持期間設定(90日)'],
    criteria_en:['Record all operations (create/update/delete)','User & IP address logging','Timestamp','Filter & search','Export (CSV/JSON)','Retention period (90 days)'],
    tests_ja:[['正常系: ログ記録','201, AuditLog保存'],['正常系: ログ検索','200, フィルタ結果返却'],['正常系: CSV エクスポート','200, CSV生成'],['異常系: 管理者以外がアクセス','403, 権限不足'],['正常系: 90日以前のログ削除','200, 自動削除']],
    tests_en:[['Normal: Log record','201, AuditLog saved'],['Normal: Log search','200, filtered results'],['Normal: CSV export','200, CSV generated'],['Error: Non-admin access','403, insufficient permissions'],['Normal: Delete logs >90 days','200, auto-deleted']],
  },
  '地図|位置情報|Map|Location|Geo|GPS':{
    criteria_ja:['地図表示(Google Maps/Mapbox)','位置情報取得(Geolocation API)','住所→座標変換(Geocoding)','近隣検索(半径N km以内)','ルート案内','マーカー/ピン表示'],
    criteria_en:['Map display (Google Maps/Mapbox)','Location acquisition (Geolocation API)','Address→coordinate (Geocoding)','Nearby search (within N km)','Route guidance','Marker/pin display'],
    tests_ja:[['正常系: 位置情報取得','200, 緯度経度返却'],['正常系: 住所→座標変換','200, ジオコーディング成功'],['正常系: 近隣検索','200, 半径5km以内の結果'],['異常系: 位置情報拒否','403, Geolocation denied'],['異常系: 不正な住所','422, ジオコーディング失敗']],
    tests_en:[['Normal: Get location','200, lat/lng returned'],['Normal: Address→coordinate','200, geocoding success'],['Normal: Nearby search','200, results within 5km'],['Error: Location denied','403, Geolocation denied'],['Error: Invalid address','422, geocoding failed']],
  },
  'インポート|移行|Import|Migration|データ取込':{
    criteria_ja:['CSVインポート','Excel(XLSX)インポート','データバリデーション','重複チェック','エラーレポート','バックグラウンド処理(大量データ)','ロールバック機能'],
    criteria_en:['CSV import','Excel (XLSX) import','Data validation','Duplicate check','Error report','Background processing (large data)','Rollback feature'],
    tests_ja:[['正常系: CSVインポート(100件)','201, 100件登録'],['正常系: バリデーションエラー','422, エラー行リスト返却'],['正常系: 重複スキップ','200, 重複行除外'],['異常系: 不正フォーマット','422, CSVパース失敗'],['正常系: 大量データ(10万件)','202, バックグラウンド処理']],
    tests_en:[['Normal: Import CSV (100 rows)','201, 100 rows inserted'],['Normal: Validation error','422, error row list returned'],['Normal: Skip duplicates','200, duplicate rows excluded'],['Error: Invalid format','422, CSV parse failed'],['Normal: Large data (100k rows)','202, background processing']],
  },
  'テンプレート|ワークフロー|Template|Workflow|自動化':{
    criteria_ja:['テンプレート作成・保存','変数/プレースホルダー','条件分岐','承認フロー','スケジュール実行','実行履歴・ログ'],
    criteria_en:['Template creation & save','Variables/placeholders','Conditional branching','Approval flow','Scheduled execution','Execution history & logs'],
    tests_ja:[['正常系: テンプレート作成','201, テンプレート保存'],['正常系: 変数展開','200, プレースホルダー置換'],['正常系: 条件分岐実行','200, 条件マッチで分岐'],['異常系: 不正な変数名','422, バリデーション'],['正常系: スケジュール実行','200, 毎日9時に自動実行']],
    tests_en:[['Normal: Create template','201, template saved'],['Normal: Variable expansion','200, placeholders replaced'],['Normal: Conditional execution','200, branched on condition'],['Error: Invalid variable name','422, validation'],['Normal: Scheduled execution','200, auto-run daily at 9am']],
  },
  'リバースエンジニアリング|逆算|Reverse|Goal|目標分解':{
    criteria_ja:['目標設定(KPI+期限)','逆算プラン生成','ステップ分割(工数見積)','進捗トラッキング','計画調整履歴','ベロシティ測定'],
    criteria_en:['Goal setting (KPI + deadline)','Reverse plan generation','Step breakdown (effort estimation)','Progress tracking','Plan adjustment history','Velocity measurement'],
    tests_ja:[['正常系: 目標作成','201, UserGoal保存'],['正常系: 逆算プラン生成','201, ReversePlan+PlanStep'],['正常系: 進捗記録','200, ProgressTracking追加'],['正常系: 計画調整','200, PlanAdjustment記録'],['正常系: ベロシティ算出','200, {velocity: 1.2}']],
    tests_en:[['Normal: Create goal','201, UserGoal saved'],['Normal: Generate reverse plan','201, ReversePlan+PlanStep'],['Normal: Record progress','200, ProgressTracking added'],['Normal: Adjust plan','200, PlanAdjustment recorded'],['Normal: Calculate velocity','200, {velocity: 1.2}']],
  },
  'スキル自動化|Skill|Manus|タスク分解':{
    criteria_ja:['スキル定義(Input/Process/Output)','スキルカタログ','パイプライン設計','エージェント連携','実行履歴'],
    criteria_en:['Skill definition (Input/Process/Output)','Skill catalog','Pipeline design','Agent coordination','Execution history'],
    tests_ja:[['正常系: スキル登録','201, スキル保存'],['正常系: パイプライン実行','200, 全ステップ完了'],['異常系: 無限ループ検出','500, タイムアウト'],['正常系: 並列実行','200, 3スキル同時実行']],
    tests_en:[['Normal: Register skill','201, skill saved'],['Normal: Execute pipeline','200, all steps completed'],['Error: Infinite loop detection','500, timeout'],['Normal: Parallel execution','200, 3 skills concurrent']],
  },
  '品質インテリジェンス|QA|Quality|テスト戦略':{
    criteria_ja:['業種別テストマトリクス','リスク優先度評価','典型バグパターン','ツール推奨','カバレッジ可視化'],
    criteria_en:['Industry test matrix','Risk priority assessment','Common bug patterns','Tool recommendations','Coverage visualization'],
    tests_ja:[['正常系: テストマトリクス生成','200, 15業種対応'],['正常系: リスク評価','200, Security:HIGH検出'],['正常系: バグパターンマッチ','200, 既知パターン3件']],
    tests_en:[['Normal: Generate test matrix','200, 15 industries supported'],['Normal: Risk assessment','200, Security:HIGH detected'],['Normal: Bug pattern match','200, 3 known patterns']],
  },
  'チケット管理|Issue|Bug|タスク':{
    criteria_ja:['チケット作成(タイトル/説明/優先度)','ステータス管理(Open/InProgress/Done)','担当者割当','コメント/履歴','ラベル/タグ','検索/フィルタ'],
    criteria_en:['Create ticket (title/desc/priority)','Status management (Open/InProgress/Done)','Assignee assignment','Comments/history','Labels/tags','Search/filter'],
    tests_ja:[['正常系: チケット作成','201, チケット保存'],['正常系: ステータス変更','200, Open→InProgress'],['正常系: コメント追加','201, コメント保存'],['異常系: 未認証でアクセス','401'],['正常系: フィルタ検索','200, priority=high結果']],
    tests_en:[['Normal: Create ticket','201, ticket saved'],['Normal: Change status','200, Open→InProgress'],['Normal: Add comment','201, comment saved'],['Error: Unauthorized access','401'],['Normal: Filter search','200, priority=high results']],
  },
  'ゲーミフィケーション|Gamification|ポイント|バッジ':{
    criteria_ja:['ポイント付与ルール','バッジ獲得条件','リーダーボード','レベルシステム','実績解除','進捗可視化'],
    criteria_en:['Point reward rules','Badge unlock conditions','Leaderboard','Level system','Achievement unlock','Progress visualization'],
    tests_ja:[['正常系: ポイント付与','200, +10pt記録'],['正常系: バッジ獲得','201, Achievement追加'],['正常系: リーダーボード','200, Top10返却'],['異常系: 二重付与','422, 冪等性エラー'],['正常系: レベルアップ','200, Lv2達成']],
    tests_en:[['Normal: Award points','200, +10pt recorded'],['Normal: Unlock badge','201, Achievement added'],['Normal: Leaderboard','200, Top10 returned'],['Error: Double award','422, idempotency error'],['Normal: Level up','200, Lv2 reached']],
  },
};

// Match feature name to FEATURE_DETAILS entry
function getFeatureDetail(featureName){
  for(const[pattern,detail]of Object.entries(FEATURE_DETAILS)){
    if(new RegExp(pattern,'i').test(featureName)) return detail;
  }
  return null;
}

// ── Domain-specific QA Strategy Map ──
const DOMAIN_QA_MAP={
  education:{
    focus_ja:['学習進捗のバックエンド同期','WCAG 2.1 AA準拠','未成年データ保護(FERPA)','コンテンツ配信安定性'],
    focus_en:['Backend sync for progress','WCAG 2.1 AA compliance','Minor data protection (FERPA)','Content delivery stability'],
    bugs_ja:['localStorage依存による進捗消失','クイズ正誤判定ミス','ブラウザ別音声再生不具合'],
    bugs_en:['Progress lost on localStorage clear','Quiz scoring errors','Audio playback failures per browser'],
    priority:'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:CRITICAL|Compliance:HIGH'
  },
  ec:{
    focus_ja:['同時購入の在庫競合','決済フロー完全性','カート操作の冪等性','スパイクトラフィック耐性'],
    focus_en:['Concurrent inventory conflicts','Payment flow integrity','Cart operation idempotency','Spike traffic resilience'],
    bugs_ja:['同一商品を複数ユーザーが同時購入','カート追加ボタン連打で数量倍増','決済中断時の在庫戻し漏れ'],
    bugs_en:['Same item bought by multiple users simultaneously','Rapid cart add button clicks double quantity','Inventory not returned on payment cancellation'],
    priority:'Security:CRITICAL|Performance:HIGH|DataIntegrity:CRITICAL|UX:HIGH|Compliance:MED'
  },
  saas:{
    focus_ja:['マルチテナント分離(RLS)','プラン別機能制限','サブスク更新・解約処理','API rate limiting'],
    focus_en:['Multi-tenant isolation (RLS)','Plan-based feature restrictions','Subscription renewal/cancellation','API rate limiting'],
    bugs_ja:['テナント間データ漏洩','プラン変更時の機能アクセス制御不備','サブスク解約後も課金継続'],
    bugs_en:['Data leakage between tenants','Feature access control failure on plan change','Billing continues after cancellation'],
    priority:'Security:CRITICAL|Performance:HIGH|DataIntegrity:HIGH|UX:MED|Compliance:HIGH'
  },
  community:{
    focus_ja:['投稿フィルタリング(不適切コンテンツ)','通報・モデレーション','スパム対策','リアルタイム同期'],
    focus_en:['Content filtering (inappropriate)','Reporting & moderation','Spam prevention','Real-time sync'],
    bugs_ja:['XSS脆弱性(投稿にスクリプト注入)','通報機能の不正利用','スパムボットによる大量投稿'],
    bugs_en:['XSS vulnerability (script injection in posts)','Report feature abuse','Mass posting by spam bots'],
    priority:'Security:HIGH|Performance:MED|DataIntegrity:MED|UX:HIGH|Compliance:MED'
  },
  booking:{
    focus_ja:['同時予約競合','キャンセル・変更処理','タイムゾーン処理','外部カレンダー連携'],
    focus_en:['Concurrent booking conflicts','Cancellation/modification handling','Timezone handling','External calendar integration'],
    bugs_ja:['同一枠を複数ユーザーが予約','タイムゾーン計算ミスで時刻ずれ','キャンセル時の返金処理漏れ'],
    bugs_en:['Same slot booked by multiple users','Timezone calculation errors cause time mismatches','Refund process omitted on cancellation'],
    priority:'Security:MED|Performance:HIGH|DataIntegrity:CRITICAL|UX:CRITICAL|Compliance:MED'
  },
  fintech:{
    focus_ja:['トランザクション完全性(ACID)','二重処理防止','監査ログ完全性','PCI DSS準拠'],
    focus_en:['Transaction integrity (ACID)','Double-processing prevention','Audit log completeness','PCI DSS compliance'],
    bugs_ja:['送金ボタン連打で二重送金','残高計算の浮動小数点誤差','監査ログの欠損'],
    bugs_en:['Double transfer on rapid send button clicks','Floating-point errors in balance calculations','Missing audit log entries'],
    priority:'Security:CRITICAL|Performance:MED|DataIntegrity:CRITICAL|UX:MED|Compliance:CRITICAL'
  },
  iot:{
    focus_ja:['デバイス認証・認可','オフライン動作','ファームウェア更新','デバイス間同期'],
    focus_en:['Device authentication & authorization','Offline operation','Firmware updates','Device-to-device sync'],
    bugs_ja:['不正デバイスのAPI接続','オフライン時のデータ消失','ファームウェア更新失敗で文鎮化'],
    bugs_en:['Unauthorized device API access','Data loss in offline mode','Bricked devices from failed firmware updates'],
    priority:'Security:CRITICAL|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:MED'
  },
  realestate:{
    focus_ja:['物件検索パフォーマンス','地図連携精度','内見予約管理','物件状態同期'],
    focus_en:['Property search performance','Map integration accuracy','Viewing appointment management','Property status sync'],
    bugs_ja:['成約済み物件が検索表示','地図ピン位置のずれ','内見予約の重複'],
    bugs_en:['Sold properties shown in search','Map pin location misalignment','Duplicate viewing appointments'],
    priority:'Security:MED|Performance:HIGH|DataIntegrity:HIGH|UX:CRITICAL|Compliance:MED'
  },
  content:{
    focus_ja:['CDN配信最適化','画像・動画エンコード','オフライン閲覧','コンテンツ推薦精度'],
    focus_en:['CDN delivery optimization','Image/video encoding','Offline viewing','Content recommendation accuracy'],
    bugs_ja:['高負荷時の動画再生停止','画像遅延読み込み失敗','オフラインキャッシュ容量超過'],
    bugs_en:['Video playback stops under high load','Image lazy loading failures','Offline cache quota exceeded'],
    priority:'Security:LOW|Performance:CRITICAL|DataIntegrity:MED|UX:CRITICAL|Compliance:LOW'
  },
  hr:{
    focus_ja:['個人情報保護(GDPR/CCPA)','採用プロセス公平性','評価データ整合性','権限管理'],
    focus_en:['Personal data protection (GDPR/CCPA)','Hiring process fairness','Evaluation data integrity','Permission management'],
    bugs_ja:['退職者のデータアクセス残存','評価スコア計算ミス','応募者情報の漏洩'],
    bugs_en:['Former employee retains data access','Evaluation score calculation errors','Applicant info leakage'],
    priority:'Security:CRITICAL|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:CRITICAL'
  },
  analytics:{
    focus_ja:['集計パフォーマンス','データパイプライン信頼性','リアルタイム更新','可視化精度'],
    focus_en:['Aggregation performance','Data pipeline reliability','Real-time updates','Visualization accuracy'],
    bugs_ja:['大量データ集計でタイムアウト','ETL処理の部分失敗','グラフ表示の数値ずれ'],
    bugs_en:['Timeout on large data aggregation','Partial ETL process failures','Graph display value discrepancies'],
    priority:'Security:MED|Performance:CRITICAL|DataIntegrity:CRITICAL|UX:HIGH|Compliance:MED'
  },
  health:{
    focus_ja:['患者データ保護(HIPAA)','処方・診断記録の正確性','医療機器連携','緊急時可用性'],
    focus_en:['Patient data protection (HIPAA)','Prescription/diagnosis record accuracy','Medical device integration','Emergency availability'],
    bugs_ja:['患者間データ混在','処方箋の記録ミス','医療機器データ取得失敗'],
    bugs_en:['Patient data cross-contamination','Prescription record errors','Medical device data acquisition failures'],
    priority:'Security:CRITICAL|Performance:HIGH|DataIntegrity:CRITICAL|UX:CRITICAL|Compliance:CRITICAL'
  },
  marketplace:{
    focus_ja:['出品者・購入者間トラスト','エスクロー処理','レビュー信頼性','手数料計算'],
    focus_en:['Seller-buyer trust','Escrow processing','Review authenticity','Fee calculation'],
    bugs_ja:['評価の不正操作','エスクロー解放タイミングミス','手数料計算エラー'],
    bugs_en:['Review manipulation','Escrow release timing errors','Fee calculation mistakes'],
    priority:'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:HIGH|Compliance:MED'
  },
  legal:{
    focus_ja:['契約ドキュメント完全性','電子署名有効性','バージョン管理','監査証跡'],
    focus_en:['Contract document integrity','Electronic signature validity','Version control','Audit trail'],
    bugs_ja:['契約書の改ざん','署名検証失敗','バージョン履歴消失'],
    bugs_en:['Contract document tampering','Signature verification failures','Version history loss'],
    priority:'Security:CRITICAL|Performance:MED|DataIntegrity:CRITICAL|UX:MED|Compliance:CRITICAL'
  },
  tool:{
    focus_ja:['操作レスポンス速度','データエクスポート完全性','ショートカット動作','エラー復旧'],
    focus_en:['Operation response speed','Data export completeness','Shortcut functionality','Error recovery'],
    bugs_ja:['大量データ操作で固まる','エクスポート時の文字化け','ショートカットキー競合'],
    bugs_en:['Freezes on large data operations','Character encoding issues in exports','Shortcut key conflicts'],
    priority:'Security:LOW|Performance:HIGH|DataIntegrity:MED|UX:CRITICAL|Compliance:LOW'
  },
  portfolio:{
    focus_ja:['SEO最適化','レスポンシブ対応','画像最適化(WebP)','表示速度(Core Web Vitals)'],
    focus_en:['SEO optimization','Responsive design','Image optimization (WebP)','Display speed (Core Web Vitals)'],
    bugs_ja:['モバイル表示崩れ','画像遅延読み込み失敗','SNS OGP未設定'],
    bugs_en:['Mobile layout breaks','Image lazy loading failures','Missing SNS OGP tags'],
    priority:'Security:LOW|Performance:HIGH|DataIntegrity:LOW|UX:CRITICAL|Compliance:LOW'
  },
  ai:{
    focus_ja:['プロンプトインジェクション対策','トークン使用量管理','レスポンス速度','会話履歴保存'],
    focus_en:['Prompt injection prevention','Token usage management','Response speed','Conversation history persistence'],
    bugs_ja:['プロンプト漏洩','トークン超過課金','会話履歴消失','レート制限超過'],
    bugs_en:['Prompt leakage','Token overcharge','Conversation loss','Rate limit exceeded'],
    priority:'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:HIGH|Compliance:MED'
  },
  automation:{
    focus_ja:['ワークフロー実行信頼性','エラーハンドリング','リトライ設定','実行履歴保存'],
    focus_en:['Workflow execution reliability','Error handling','Retry configuration','Execution history logging'],
    bugs_ja:['無限ループ','エラー時の通知漏れ','リトライ回数制限なし','実行ログ欠損'],
    bugs_en:['Infinite loops','Missing error notifications','Unlimited retries','Missing execution logs'],
    priority:'Security:MED|Performance:HIGH|DataIntegrity:HIGH|UX:MED|Compliance:LOW'
  },
  event:{
    focus_ja:['チケット在庫管理','QRコード検証','キャンセルポリシー','タイムゾーン処理'],
    focus_en:['Ticket inventory management','QR code verification','Cancellation policy','Timezone handling'],
    bugs_ja:['定員超過販売','QRコード重複','返金処理漏れ','時刻ずれ'],
    bugs_en:['Overselling capacity','Duplicate QR codes','Missing refunds','Time mismatches'],
    priority:'Security:MED|Performance:HIGH|DataIntegrity:CRITICAL|UX:HIGH|Compliance:MED'
  },
  gamify:{
    focus_ja:['ポイント計算正確性','バッジ獲得条件','ランキング公平性','不正防止'],
    focus_en:['Point calculation accuracy','Badge criteria enforcement','Ranking fairness','Fraud prevention'],
    bugs_ja:['ポイント重複付与','バッジ不正獲得','ランキング操作','負数ポイント'],
    bugs_en:['Duplicate point grants','Badge exploitation','Ranking manipulation','Negative points'],
    priority:'Security:MED|Performance:MED|DataIntegrity:HIGH|UX:HIGH|Compliance:LOW'
  },
  collab:{
    focus_ja:['同時編集競合解決','バージョン管理','権限管理','リアルタイム同期'],
    focus_en:['Concurrent edit conflict resolution','Version control','Permission management','Real-time sync'],
    bugs_ja:['編集内容消失','バージョン履歴欠損','権限チェック漏れ','同期遅延'],
    bugs_en:['Edit loss','Missing version history','Permission bypass','Sync delays'],
    priority:'Security:HIGH|Performance:HIGH|DataIntegrity:CRITICAL|UX:CRITICAL|Compliance:MED'
  },
  devtool:{
    focus_ja:['APIキー管理','レート制限','使用量追跡','Webhook信頼性'],
    focus_en:['API key management','Rate limiting','Usage tracking','Webhook reliability'],
    bugs_ja:['キー漏洩','レート制限バイパス','使用量カウント漏れ','Webhook失敗'],
    bugs_en:['Key leakage','Rate limit bypass','Usage count miss','Webhook failures'],
    priority:'Security:CRITICAL|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:MED'
  },
  creator:{
    focus_ja:['サブスク課金管理','コンテンツ配信','投げ銭処理','ファン管理'],
    focus_en:['Subscription billing','Content delivery','Tip processing','Fan management'],
    bugs_ja:['解約後も課金','コンテンツ漏洩','投げ銭未着金','ファン通知漏れ'],
    bugs_en:['Billing after cancellation','Content leakage','Tip not received','Missing fan notifications'],
    priority:'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:HIGH|Compliance:HIGH'
  },
  newsletter:{
    focus_ja:['配信到達率','購読解除','スパムフィルタ回避','開封率追跡'],
    focus_en:['Delivery rate','Unsubscribe handling','Spam filter avoidance','Open rate tracking'],
    bugs_ja:['メール未到達','購読解除後も配信','スパム判定','開封トラッキング失敗'],
    bugs_en:['Email not delivered','Sending after unsubscribe','Spam flagged','Open tracking failures'],
    priority:'Security:MED|Performance:MED|DataIntegrity:MED|UX:HIGH|Compliance:HIGH'
  }
};

// ── Cross-cutting QA Patterns ──
const QA_CROSS_CUTTING={
  concurrency:{ja:'同時アクセス競合テスト',en:'Concurrent access race condition test',domains:['fintech','ec','booking','community','saas']},
  idempotency:{ja:'二重処理防止(冪等性)',en:'Double-processing prevention (idempotency)',domains:['fintech','ec','booking']},
  spike:{ja:'スパイクトラフィック耐性(通常の100倍)',en:'Spike traffic resilience (100x normal)',domains:['ec','content','community','booking']},
  offline:{ja:'オフライン/劣化ネットワーク動作',en:'Offline/degraded network operation',domains:['iot','content','community']},
  tenant:{ja:'マルチテナント分離(RLS)',en:'Multi-tenant isolation (RLS)',domains:['saas','analytics']},
  api_resilience:{ja:'外部API耐障害性(タイムアウト/リトライ/フォールバック)',en:'External API resilience (timeout/retry/fallback)',domains:['booking','saas','ec','analytics']},
  a11y:{ja:'アクセシビリティ(WCAG)',en:'Accessibility (WCAG)',domains:['education','content','hr']},
  audit:{ja:'監査ログ完全性',en:'Audit log completeness',domains:['fintech','saas','hr','legal']},
  rate_limiting:{ja:'レート制限(APIキー/IP単位)',en:'Rate limiting (per API key/IP)',domains:['saas','devtool','fintech','ai']},
  data_export:{ja:'データエクスポート(CSV/JSON/Excel)',en:'Data export (CSV/JSON/Excel)',domains:['saas','analytics','hr']},
  notification:{ja:'通知配信(Email/Push/SMS)',en:'Notification delivery (Email/Push/SMS)',domains:['saas','community','event','newsletter']},
  realtime:{ja:'リアルタイム更新(WebSocket/SSE)',en:'Realtime updates (WebSocket/SSE)',domains:['collab','community','analytics','iot']}
};

// ── Industry Test Matrix (15 Industries) ──
const _tm=(cf_ja,cf_en,tf_ja,tf_en,tb_ja,tb_en,t_ja,t_en,p)=>({critical_functions_ja:cf_ja,critical_functions_en:cf_en,test_focus_ja:tf_ja,test_focus_en:tf_en,typical_bugs_ja:tb_ja,typical_bugs_en:tb_en,tools_ja:t_ja,tools_en:t_en,priority:p});
const INDUSTRY_TEST_MATRIX={
  fintech:_tm(['決済処理','残高更新','取引履歴','KYC検証'],['Payment processing','Balance updates','Transaction history','KYC verification'],['金額計算精度','同時取引競合','不正検知','監査ログ完全性'],['Amount calculation accuracy','Concurrent transaction conflicts','Fraud detection','Audit log completeness'],['浮動小数点誤差','二重決済','トランザクション分離不足','ログ欠損'],['Floating point errors','Double payments','Transaction isolation failures','Missing logs'],['Jest(単体)','Playwright(E2E)','k6(負荷)','SonarQube(静的解析)'],['Jest (unit)','Playwright (E2E)','k6 (load)','SonarQube (static)'],'Security:HIGH|Performance:HIGH|DataIntegrity:HIGH|UX:MED|Compliance:HIGH'),
  health:_tm(['患者情報管理','診療記録','処方箋','予約管理'],['Patient information','Medical records','Prescriptions','Appointment scheduling'],['PHI保護(HIPAA)','データ暗号化','アクセス制御','監査証跡'],['PHI protection (HIPAA)','Data encryption','Access control','Audit trail'],['暗号化漏れ','権限チェック不足','ログ改ざん','データ漏洩'],['Encryption gaps','Insufficient permission checks','Log tampering','Data leaks'],['Jest','Cypress','OWASP ZAP(セキュリティ)','Trivy(脆弱性)'],['Jest','Cypress','OWASP ZAP (security)','Trivy (vulnerabilities)'],'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:HIGH'),
  ec:_tm(['商品検索','カート操作','決済','在庫管理'],['Product search','Cart operations','Checkout','Inventory management'],['在庫同期','決済フロー','クーポン適用','配送計算'],['Inventory sync','Payment flow','Coupon application','Shipping calculation'],['在庫不整合','カート競合','クーポン二重適用','決済タイムアウト'],['Inventory mismatch','Cart conflicts','Double coupon usage','Payment timeout'],['Vitest','Playwright','Lighthouse(UX)','k6'],['Vitest','Playwright','Lighthouse (UX)','k6'],'Security:HIGH|Performance:HIGH|DataIntegrity:HIGH|UX:HIGH|Compliance:MED'),
  saas:_tm(['認証','ユーザー管理','課金','プラン変更'],['Authentication','User management','Billing','Plan changes'],['マルチテナント分離','API制限','Webhook配信','データ移行'],['Multi-tenant isolation','API rate limits','Webhook delivery','Data migration'],['テナント間漏洩','レート制限抜け','Webhook失敗','移行データ欠損'],['Cross-tenant leakage','Rate limit bypass','Webhook failures','Migration data loss'],['Jest','Playwright','Postman(API)','Grafana k6'],['Jest','Playwright','Postman (API)','Grafana k6'],'Security:HIGH|Performance:HIGH|DataIntegrity:HIGH|UX:MED|Compliance:MED'),
  social:_tm(['投稿','コメント','いいね','通知'],['Posts','Comments','Likes','Notifications'],['リアルタイム更新','スパム検知','モデレーション','通知配信'],['Realtime updates','Spam detection','Moderation','Notification delivery'],['通知遅延','スパム漏れ','モデレーション誤判定','N+1クエリ'],['Notification delays','Spam leakage','False moderation','N+1 queries'],['Vitest','Playwright','WebSocket Tester','Apache JMeter'],['Vitest','Playwright','WebSocket Tester','Apache JMeter'],'Security:MED|Performance:HIGH|DataIntegrity:MED|UX:HIGH|Compliance:MED'),
  education:_tm(['学習進捗','クイズ','成績管理','証明書発行'],['Learning progress','Quizzes','Grade management','Certificate issuance'],['進捗同期','クイズ採点','WCAG準拠','FERPA遵守'],['Progress sync','Quiz grading','WCAG compliance','FERPA compliance'],['進捗消失','採点ミス','アクセシビリティ欠陥','未成年データ保護不足'],['Progress loss','Grading errors','Accessibility defects','Minor data protection gaps'],['Jest','Cypress','axe DevTools(a11y)','Lighthouse'],['Jest','Cypress','axe DevTools (a11y)','Lighthouse'],'Security:MED|Performance:MED|DataIntegrity:HIGH|UX:HIGH|Compliance:HIGH'),
  gaming:_tm(['ポイント付与','ランキング','実績解除','リーダーボード'],['Point rewards','Rankings','Achievement unlock','Leaderboard'],['ポイント整合性','ランキング更新','不正検知','同時アクセス'],['Point consistency','Ranking updates','Cheat detection','Concurrent access'],['ポイント二重付与','ランキング不整合','不正ポイント獲得','競合状態'],['Double point awards','Ranking inconsistency','Cheating','Race conditions'],['Vitest','Playwright','Redis (cache)','k6'],['Vitest','Playwright','Redis (cache)','k6'],'Security:MED|Performance:HIGH|DataIntegrity:HIGH|UX:HIGH|Compliance:LOW'),
  iot:_tm(['センサーデータ収集','デバイス制御','アラート','ダッシュボード'],['Sensor data collection','Device control','Alerts','Dashboard'],['データ精度','通信安定性','バッテリー効率','オフライン動作'],['Data accuracy','Communication stability','Battery efficiency','Offline operation'],['センサー誤差','通信断','バッテリー消耗','データ欠損'],['Sensor errors','Communication failures','Battery drain','Data loss'],['Pytest','Selenium','MQTT Explorer','Postman'],['Pytest','Selenium','MQTT Explorer','Postman'],'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:MED'),
  travel:_tm(['予約','空室検索','決済','キャンセル'],['Booking','Availability search','Payment','Cancellation'],['在庫同期','ダブルブッキング防止','キャンセルポリシー','多言語対応'],['Inventory sync','Double booking prevention','Cancellation policy','Multi-language support'],['ダブルブッキング','在庫不整合','キャンセル料計算ミス','決済失敗'],['Double bookings','Inventory mismatch','Cancellation fee errors','Payment failures'],['Jest','Playwright','k6','i18next (i18n)'],['Jest','Playwright','k6','i18next (i18n)'],'Security:HIGH|Performance:HIGH|DataIntegrity:HIGH|UX:HIGH|Compliance:MED'),
  logistics:_tm(['配送追跡','在庫管理','ルート最適化','倉庫管理'],['Shipment tracking','Inventory management','Route optimization','Warehouse management'],['追跡精度','在庫同期','配送時間予測','GPS精度'],['Tracking accuracy','Inventory sync','Delivery time prediction','GPS accuracy'],['追跡更新遅延','在庫不整合','ルート計算ミス','GPS誤差'],['Tracking update delays','Inventory mismatch','Route calculation errors','GPS inaccuracy'],['Vitest','Playwright','Google Maps API','k6'],['Vitest','Playwright','Google Maps API','k6'],'Security:MED|Performance:HIGH|DataIntegrity:HIGH|UX:MED|Compliance:MED'),
  realestate:_tm(['物件検索','内見予約','契約管理','入居者管理'],['Property search','Viewing appointments','Contract management','Tenant management'],['検索精度','契約ステータス','家賃計算','期限管理'],['Search accuracy','Contract status','Rent calculation','Deadline management'],['検索漏れ','契約状態不整合','家賃計算ミス','期限通知漏れ'],['Missing search results','Contract state inconsistency','Rent calculation errors','Missing deadline notifications'],['Jest','Playwright','Mapbox (map)','Cron (schedule)'],['Jest','Playwright','Mapbox (map)','Cron (schedule)'],'Security:MED|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:MED'),
  media:_tm(['記事投稿','コメント','購読管理','アクセス分析'],['Article publishing','Comments','Subscription management','Analytics'],['SEO最適化','画像最適化','コメントモデレーション','アクセス解析'],['SEO optimization','Image optimization','Comment moderation','Access analytics'],['SEOメタ欠損','画像読込遅延','スパムコメント','アクセス集計ミス'],['Missing SEO meta','Slow image loading','Spam comments','Analytics errors'],['Vitest','Playwright','Lighthouse','Google Analytics'],['Vitest','Playwright','Lighthouse','Google Analytics'],'Security:MED|Performance:HIGH|DataIntegrity:MED|UX:HIGH|Compliance:MED'),
  hr:_tm(['応募管理','面接スケジュール','評価記録','オファー発行'],['Application management','Interview scheduling','Evaluation records','Offer issuance'],['応募者データ保護','評価公平性','GDPR遵守','通知配信'],['Applicant data protection','Evaluation fairness','GDPR compliance','Notification delivery'],['データ漏洩','評価バイアス','GDPR違反','通知遅延'],['Data leaks','Evaluation bias','GDPR violations','Notification delays'],['Jest','Cypress','OWASP ZAP','Mailgun (email)'],['Jest','Cypress','OWASP ZAP','Mailgun (email)'],'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:HIGH'),
  marketing:_tm(['キャンペーン管理','A/Bテスト','コンバージョン計測','セグメント配信'],['Campaign management','A/B testing','Conversion tracking','Segment delivery'],['コンバージョン精度','セグメント正確性','配信タイミング','ROI計算'],['Conversion accuracy','Segment accuracy','Delivery timing','ROI calculation'],['コンバージョン重複計測','セグメント漏れ','配信遅延','ROI計算ミス'],['Duplicate conversion tracking','Segment gaps','Delivery delays','ROI calculation errors'],['Vitest','Playwright','Google Tag Manager','Mixpanel'],['Vitest','Playwright','Google Tag Manager','Mixpanel'],'Security:MED|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:MED'),
  government:_tm(['申請受付','審査','承認','証明書発行'],['Application intake','Review','Approval','Certificate issuance'],['アクセシビリティ','セキュリティ','監査証跡','長期保管'],['Accessibility','Security','Audit trail','Long-term storage'],['a11y欠陥','権限エラー','監査ログ欠損','データ消失'],['a11y defects','Permission errors','Missing audit logs','Data loss'],['Jest','Cypress','axe DevTools','OWASP ZAP'],['Jest','Cypress','axe DevTools','OWASP ZAP'],'Security:HIGH|Performance:MED|DataIntegrity:HIGH|UX:HIGH|Compliance:HIGH'),
};

// ── Domain Intelligence Playbook (Implementation/Compliance/Prevention/Context/Skills) ──
const _CF='FERPA';const _CP='PCI DSS';const _CH='HIPAA';const _CG='GDPR';
const _dpb=(i_ja,i_en,c_ja,c_en,p_ja,p_en,ctx_ja,ctx_en,sk_ja,sk_en)=>({impl_ja:i_ja,impl_en:i_en,compliance_ja:c_ja,compliance_en:c_en,prevent_ja:p_ja,prevent_en:p_en,ctx_ja:ctx_ja,ctx_en:ctx_en,skill_ja:sk_ja,skill_en:sk_en});

const DOMAIN_PLAYBOOK={
  education:_dpb(
    ['学習目標→知識体系→カリキュラム→評価基準(例:TOEIC 650→900=300h)','成績データ→パターン分析→弱点特定→個別最適化(正答率<60%優先)','理解度テスト→習熟判定→次単元解放(≥80%進む、<60%再履修)'],
    ['Goal→Knowledge map→Curriculum→Assessment (e.g. TOEIC 650→900=300hrs)','Grade data→Pattern analysis→Weakness ID→Personalization (prioritize <60%)','Test→Mastery→Unlock next (≥80% proceed, <60% retry)'],
    [_CF+':学生データ暗号化、保護者同意、保持5年','WCAG 2.1 AA、スクリーンリーダー対応',_CG+':Right to be forgotten'],
    [_CF+': student data encrypt, parental consent, 5yr retention','WCAG 2.1 AA, screen reader',_CG+': Right to be forgotten'],
    ['進捗消失|localStorage超過|対策:IndexedDB移行','カンニング検出漏れ|タブ監視のみ|対策:Proctorio+視線追跡','学習時間水増し|非アクティブカウント|対策:操作監視、5分で停止'],
    ['Progress loss|localStorage quota|Fix: IndexedDB','Cheating miss|Tab-only monitor|Fix: Proctorio+eye track','Time inflation|Counts inactive|Fix: Activity monitor, 5min pause'],
    ['新機能→requirements.md, design_system.md, error_logs.md','バグ→error_logs.md, test_cases/, architecture.md','分析→architecture.md(model), api_spec.md'],
    ['Feature→requirements.md, design_system.md, error_logs.md','Bug→error_logs.md, test_cases/, architecture.md','Analysis→architecture.md(model), api_spec.md'],
    '学習効果測定|カリキュラム最適化|入力:学習履歴JSON、目標|判断:<60%復習、60-79%補助、≥80%解放|出力:優先リスト、推定時間',
    'Learning Effectiveness|Optimize curriculum|Input: history JSON, target|Judgment: <60% review, 60-79% supplemental, ≥80% unlock|Output: priority list, estimate'
  ),
  ec:_dpb(
    ['購買→カート→決済完了→リピート(初回割30%→LTV 3.2x、カゴ落ち60%→回収18%)','在庫→需要予測→発注→欠品防止(90日平均+季節係数)','客単価→レコメンド→クロスセル→向上(3点提示でCTR 12%)'],
    ['Intent→Cart→Checkout→Repeat (30% discount→3.2x LTV, 60% abandon→18% recovery)','Inventory→Forecast→Reorder→Prevention (90d avg+seasonal)','Spending→Recommend→Cross-sell→Increase (3 items→12% CTR)'],
    [_CP+':トークン化、Stripe Radar、年次認証','特商法:運営者、返品、配送料','薬機法/景表法:誇大禁止'],
    [_CP+': tokenization, Stripe Radar, annual cert','Commercial Act: operator, return, shipping','Pharma/Ad Law: no exaggeration'],
    ['二重決済|冪等性未実装|対策:Stripe key、ボタン無効化','在庫切れ購入|race condition|対策:SELECT FOR UPDATE、3フェーズ','カゴ落ち60%|決済離脱|対策:住所補完、Apple Pay、ゲスト許可'],
    ['Double charge|No idempotency|Fix: Stripe key, disable button','Stockout purchase|Race condition|Fix: SELECT FOR UPDATE, 3-phase','60% abandon|Checkout friction|Fix: Address autocomplete, Apple Pay, guest'],
    ['決済→architecture.md(Stripe), security.md, error_logs.md','在庫→architecture.md(inventory), api_spec.md(stock)','レコメンド→stakeholders.md(ML), api_spec.md'],
    ['Payment→architecture.md(Stripe), security.md, error_logs.md','Inventory→architecture.md(inventory), api_spec.md(stock)','Recommend→stakeholders.md(ML), api_spec.md'],
    'カゴ落ち防止|決済完了率向上|入力:Analytics、Stripe、アンケート|判断:離脱>50%要改善、入力>3分補完、エラー>5%手段追加|出力:改善リスト、A/Bテスト、期待効果',
    'Cart Abandon Prevention|Improve completion|Input: Analytics, Stripe, survey|Judgment: abandon>50% improve, fill>3min autocomplete, error>5% add methods|Output: improvement list, A/B test, impact'
  ),
  saas:_dpb(
    ['MRR目標→顧客数→CAC→予算(MRR $50k、チャーン5%→+30顧客/月)','解約率→施策→改善→削減(オンボード<50%→ツアー+22%)','使用率→指標→アップセル→ARPU(週ログイン<2回リスク)'],
    ['MRR target→Customers→CAC→Budget (MRR $50k, 5% churn→+30/mo)','Churn→Tactics→Improve→Reduce (onboard<50%→tour+22%)','Usage→Metrics→Upsell→ARPU (weekly<2 risk)'],
    ['SOC 2 Type II:暗号化、検知、監査',_CG+':DPA、開示、ポータビリティ','利用規約:SLA 99.9%、削除30日'],
    ['SOC 2 Type II: encrypt, detect, audit',_CG+': DPA, disclose, portability','ToS: SLA 99.9%, delete 30d'],
    ['テナント分離漏れ|RLS未設定|対策:RLS必須、tenant_id必須','Rate limit突破|backoff未実装|対策:2^n待機、Circuit Breaker','オンボード離脱50%|設定複雑|対策:ツアー、プリセット、Aha!短縮'],
    ['Tenant isolation|Missing RLS|Fix: Enforce RLS, tenant_id required','Rate limit|No backoff|Fix: 2^n wait, Circuit Breaker','50% onboard drop|Complex setup|Fix: Tour, presets, shorten Aha!'],
    ['分離→architecture.md(RLS), security.md, test_cases/','解約→stakeholders.md(CS), progress.md, api_spec.md','機能→requirements.md, design_system.md'],
    ['Isolation→architecture.md(RLS), security.md, test_cases/','Churn→stakeholders.md(CS), progress.md, api_spec.md','Feature→requirements.md, design_system.md'],
    'チャーン予測|解約リスク検知|入力:行動ログ、契約情報|判断:ログイン<2かつ問合せ≥3高リスク、使用率<30%中リスク|出力:スコア、予測日、アクション',
    'Churn Prediction|Detect risk|Input: behavior logs, contract|Judgment: logins<2 AND tickets≥3 high risk, usage<30% medium|Output: score, date, actions'
  ),
  fintech:_dpb(
    ['投資目標→リターン→リスク→配分(60歳5,000万円→年利6.8%)','信用→与信→金利→管理(FICO 650-699→50万円、15%)','取引→異常検知→判定→ブロック(深夜高額→ML 92%→凍結)'],
    ['Goal→Return→Risk→Allocation (60yo ¥50M→6.8% return)','Credit→Limit→Rate→Manage (FICO 650-699→¥500k, 15%)','Transaction→Detect→Judge→Block (3AM high→ML 92%→freeze)'],
    ['金融庁:第二種、資金移動業',_CP+':600万件超、四半期スキャン','収益移転防止:eKYC、届出、7年保存'],
    ['FSA: Type II, Funds Transfer',_CP+': >6M/yr, quarterly scan','AML/KYC: eKYC, report, 7yr retention'],
    ['二重送金|残高チェック不足|対策:SELECT FOR UPDATE、冪等性','不正検出漏れ|ルールのみ|対策:LightGBM、行動学習','金利ズレ|浮動小数点誤差|対策:Decimal、整数演算'],
    ['Double transfer|Insufficient check|Fix: SELECT FOR UPDATE, idempotency','Fraud miss|Rule-only|Fix: LightGBM, behavior learning','Interest error|Float rounding|Fix: Decimal, integer math'],
    ['送金→architecture.md(transaction), security.md(PCI DSS)','検知→architecture.md(ML), api_spec.md(fraud)','計算→architecture.md(interest), test_cases/, error_logs.md'],
    ['Transfer→architecture.md(transaction), security.md(PCI DSS)','Fraud→architecture.md(ML), api_spec.md(fraud)','Interest→architecture.md(interest), test_cases/, error_logs.md'],
    '与信審査|融資判定|入力:スコア、年収、勤続、借入、延滞|判断:≥720承認30%8%、650-719承認20%15%、<650人間審査|出力:可否、限度額、金利、返済計画',
    'Credit Underwriting|Loan decision|Input: score, income, tenure, debt, delinquency|Judgment: ≥720 approve 30% 8%, 650-719 approve 20% 15%, <650 manual|Output: decision, limit, rate, repayment'
  ),
  health:_dpb(
    ['目標→リスク→改善プラン→予防(糖尿病35%→17.5%に体重-8kg)','症状→候補→検査→医療機関(頭痛+熱38.5℃+咳→インフルA 78%)','服薬→遵守率→効果→最適化(飲み忘れ30%→リマインダー85%)'],
    ['Goal→Risk→Plan→Prevention (diabetes 35%→17.5% via -8kg)','Symptom→Candidates→Tests→Facility (headache+fever 38.5℃+cough→Flu A 78%)','Medication→Adherence→Effect→Optimize (30% miss→reminder 85%)'],
    [_CH+':PHI暗号化、監査、BAA','医療機器:診断=クラスII、記録=非該当、届出','個情保護:匿名加工、オプトアウト'],
    [_CH+': PHI encrypt, audit, BAA','Medical device: diagnostic=Class II, records=non-device','Privacy: anonymize, opt-out'],
    ['診断ミス|データ不足|対策:必須入力増、禁忌チェック','通知されない|許可OFF|対策:ガイダンス、PWA、SMS','連携エラー|スコープ不足|対策:権限明示、再認証、リトライ'],
    ['Diagnostic error|Insufficient data|Fix: Increase inputs, contraindication check','No notification|Permission OFF|Fix: Guidance, PWA, SMS','Integration error|Scope insufficient|Fix: Specify permissions, re-auth, retry'],
    ['診断→architecture.md(ML), security.md(HIPAA), test_cases/','服薬→architecture.md(notification), api_spec.md, error_logs.md','連携→architecture.md(HealthKit), sequence_diagrams/'],
    ['Diagnostic→architecture.md(ML), security.md(HIPAA), test_cases/','Medication→architecture.md(notification), api_spec.md, error_logs.md','Integration→architecture.md(HealthKit), sequence_diagrams/'],
    '健康リスク予測|発症リスク予測|入力:健診データ、生活習慣、家族歴|判断:10年>30%高リスク、BMI≥25かつ血糖≥110糖尿病予備群|出力:スコア、目標、削減率、根拠',
    'Health Risk Prediction|Predict onset|Input: checkup data, lifestyle, family history|Judgment: 10yr>30% high risk, BMI≥25 AND sugar≥110 prediabetes|Output: scores, goals, reduction, evidence'
  ),
  booking:_dpb(
    ['可能枠→予測→動的価格→稼働率(19-20時満席→18時割20%)','空室→判定→制限→収益(週末2泊以上、直前50%オフ)','キャンセル率→前払い→防止→保護(15%→カード登録で3%)'],
    ['Slots→Forecast→Dynamic price→Occupancy (7-8PM full→6PM 20% off)','Vacancy→Detect→Restriction→Revenue (weekend 2-night min, last-min 50% off)','Cancel rate→Prepay→Prevent→Protect (15%→card reg 3%)'],
    ['旅行業法:第三種登録、管理、掲示','景表法:二重価格規制、おとり禁止','キャンセル:返金明示、手数料上限'],
    ['Travel Act: Type III reg, mgmt, display','Gift Act: dual price reg, bait prohibit','Cancel: refund disclose, fee cap'],
    ['ダブルブッキング|競合状態|対策:Lock、3段階、5分同期+バッファ','待ち通知されない|接続切断|対策:SSE fallback、SMS/Email、30秒以内','価格急変クレーム|更新頻度高|対策:30分固定、理由表示'],
    ['Double booking|Race condition|Fix: Lock, 3-phase, 5min sync+buffer','Waitlist no notify|Connection loss|Fix: SSE fallback, SMS/Email, within 30sec','Price change complaint|Too frequent|Fix: 30min hold, show reason'],
    ['予約→architecture.md(inventory), sequence_diagrams/(flow), security.md','価格→architecture.md(pricing), api_spec.md, stakeholders.md','キャンセル→architecture.md(policy), api_spec.md, error_logs.md'],
    ['Booking→architecture.md(inventory), sequence_diagrams/(flow), security.md','Pricing→architecture.md(pricing), api_spec.md, stakeholders.md','Cancel→architecture.md(policy), api_spec.md, error_logs.md'],
    '在庫最適化|稼働率収益最大化|入力:履歴、季節変動、イベント|判断:<60%割引、>90%値上げ、繁忙期制限、直前大幅割|出力:価格帯、制御ルール、期待値',
    'Inventory Optimization|Maximize occupancy revenue|Input: history, seasonal, events|Judgment: <60% discount, >90% increase, peak restrict, last-min deep discount|Output: price range, rules, expected'
  ),
  _default:_dpb(
    ['目標→KPI→機能→優先度(売上月100万円→CVR 2%→決済最優先)','ペイン→解決策→MVP→検証(情報過多→AIレコメンド→3パターン→A/B)','データ→ロジック→API→UI(User-Post-Comment→CRUD+検索→REST→画面)'],
    ['Goal→KPI→Features→Priority (sales ¥1M/mo→CVR 2%→payment first)','Pain→Solution→MVP→Validation (overload→AI recommend→3 patterns→A/B)','Data→Logic→API→UI (User-Post-Comment→CRUD+search→REST→screens)'],
    [_CG+':処理合法性、権利(アクセス・削除)、Cookie同意','OWASP Top 10、SQLi/XSS防止、パスワードハッシュ(bcrypt)','規約:必須記載、保持期限、第三者提供'],
    [_CG+': lawful processing, rights (access, delete), cookie consent','OWASP Top 10, SQLi/XSS prevent, password hash (bcrypt)','ToS: mandatory items, retention, third-party'],
    ['認証バイパス|JWT検証不足|対策:全ルートで検証、7日期限、リフレッシュ','N+1クエリ|個別取得|対策:JOIN、eager loading、監視>10アラート','遅延|全件取得、INDEX未設定|対策:ページネーション(limit 20)、INDEX、APM'],
    ['Auth bypass|Insufficient JWT validation|Fix: Enforce all routes, 7d expiry, refresh','N+1 query|Individual fetch|Fix: JOIN, eager loading, monitor>10 alert','Delay|Fetch all, no INDEX|Fix: Pagination (limit 20), INDEX, APM'],
    ['機能→requirements.md, architecture.md, design_system.md','バグ→error_logs.md, test_cases/, architecture.md','性能→architecture.md(optimize), sequence_diagrams/'],
    ['Feature→requirements.md, architecture.md, design_system.md','Bug→error_logs.md, test_cases/, architecture.md','Performance→architecture.md(optimize), sequence_diagrams/'],
    '要件整理|曖昧→構造化|入力:議事録、ストーリー、目標|判断:Must/Should/Won'+"'"+'t、Mustは数値目標、依存明示|出力:要件定義書、ER図、遷移図、選定理由',
    'Requirements Refinement|Ambiguous→Structured|Input: minutes, stories, goals|Judgment: Must/Should/Won'+"'"+'t, Must has numeric targets, dependencies explicit|Output: requirements doc, ER, transitions, rationale'
  ),
  marketplace:_dpb(
    ['出品→審査→マッチング→取引(手数料10%、エスクロー48h保護)','評価→信頼→プレミアム販売者(評価4.8+、100件→優先表示)','トラブル→仲裁→解決(通常7日、エスクロー解放延長)'],
    ['Listing→Review→Match→Transaction (10% fee, 48h escrow protection)','Rating→Trust→Premium seller (4.8+, 100 items→priority)','Dispute→Arbitrate→Resolve (7d standard, escrow hold extended)'],
    ['特商法:販売者開示、エスクロー、解決支援','景表法:おとり広告禁止、二重価格規制',_CG+':販売者・購入者情報保護'],
    [_CP+', Commercial Act: seller disclosure, escrow, dispute','Gift Act: prohibit bait ads, dual price reg',_CG+': seller/buyer info protection'],
    ['マッチング精度低|データ不足|ルール→100件でML','不正評価|サクラ|検知:短期間集中、IPクラスタ','手数料計算ミス|複雑割引|対策:事前見積、決済前確認'],
    ['Matching accuracy low|Insufficient data|Rules→ML after 100','Fake reviews|Shilling|Detect: burst period, IP cluster','Fee calc error|Complex discount|Fix: Pre-estimate, confirm before payment'],
    ['出品→requirements.md, api_spec.md(listing), test_cases/','評価→architecture.md(trust), api_spec.md, error_logs.md','仲裁→architecture.md(dispute), sequence_diagrams/, stakeholders.md'],
    ['Listing→requirements.md, api_spec.md(listing), test_cases/','Rating→architecture.md(trust), api_spec.md, error_logs.md','Arbitration→architecture.md(dispute), sequence_diagrams/, stakeholders.md'],
    'マッチング最適化|需給最適化|入力:履歴、評価、在庫、需要|判断:評価≥4.5優先、過去取引>10優遇、需要>供給値上げ推奨|出力:ランキング、価格提案、需給バランス',
    'Matching Optimization|Supply-demand optimization|Input: history, ratings, inventory, demand|Judgment: rating≥4.5 priority, past trades>10 favor, demand>supply suggest increase|Output: ranking, price suggestions, balance'
  ),
  community:_dpb(
    ['投稿→モデレーション→配信→エンゲージメント(自動検知+人間審査)','ユーザー→フォロー→フィード生成→ランキング(友達→興味→トレンド)','通報→審査→対応→再発防止(24h以内対応、3回で自動BAN)'],
    ['Post→Moderate→Distribute→Engage (auto-detect+human review)','User→Follow→Feed generation→Ranking (friends→interests→trending)','Report→Review→Action→Prevention (respond within 24h, 3 strikes auto-ban)'],
    ['投稿ガイド:誹謗中傷禁止、モデレーション、通報',_CG+':ユーザー生成コンテンツ責任、削除権','利用規約:著作権侵害即削除、荒らし対策'],
    [_CG+', Posting: prohibit defamation, moderation, report',_CG+': UGC liability, right to delete','ToS: copyright infringement immediate delete, anti-trolling'],
    ['スパム|reCAPTCHA未導入|対策:v3、5件/分制限','XSS脆弱性|サニタイズ不足|対策:DOMPurify、CSP','フィルターバブル|類似のみ|対策:多様性注入20%'],
    ['Spam|No reCAPTCHA|Fix: v3, 5/min limit','XSS vulnerability|Insufficient sanitize|Fix: DOMPurify, CSP','Filter bubble|Similarity only|Fix: Inject diversity 20%'],
    ['投稿→requirements.md, api_spec.md(post), security.md(XSS)','モデレーション→architecture.md(ML), stakeholders.md, error_logs.md','エンゲージメント→architecture.md(feed), api_spec.md, test_cases/'],
    ['Posting→requirements.md, api_spec.md(post), security.md(XSS)','Moderation→architecture.md(ML), stakeholders.md, error_logs.md','Engagement→architecture.md(feed), api_spec.md, test_cases/'],
    'コンテンツモデレーション|不適切投稿検知|入力:投稿テキスト、画像、通報履歴|判断:NGワード→即削除、グレー→人間審査、通報≥3緊急、過去違反者厳格|出力:判定、理由、対応、学習データ',
    'Content Moderation|Detect inappropriate posts|Input: post text, images, report history|Judgment: banned words→immediate delete, gray→human review, reports≥3 urgent, past violators strict|Output: decision, reason, action, training data'
  ),
  content:_dpb(
    ['制作→公開→配信→分析(CDN、画像最適化、SEO)','SEO→キーワード→ランク→流入(タイトル60字、メタ160字、構造化データ)','著作権→ライセンス→保護→収益化(CC BY-SA、DMCA対応)'],
    ['Create→Publish→Distribute→Analyze (CDN, image optimization, SEO)','SEO→Keywords→Rank→Traffic (title 60 chars, meta 160, structured data)','Copyright→License→Protect→Monetize (CC BY-SA, DMCA response)'],
    ['著作権:DMCA対応、コンテンツID、ライセンス(CC BY-SA)','肖像権:モデルリリース、ぼかし処理',_CG+':Cookie同意、アクセス解析匿名化'],
    [_CG+', Copyright: DMCA, content ID, license (CC BY-SA)','Portrait rights: model release, blur processing',_CG+': cookie consent, analytics anonymization'],
    ['再生エラー|非対応コーデック|HLS、複数解像度','画像遅延|最適化不足|WebP、srcset、CDN','SEO順位低|構造化データ不足|JSON-LD、sitemap、robots.txt'],
    ['Playback error|Unsupported codec|HLS, multiple resolutions','Image lag|Insufficient optimization|WebP, srcset, CDN','Low SEO rank|Missing structured data|JSON-LD, sitemap, robots.txt'],
    ['配信→architecture.md(CDN), api_spec.md, design_system.md','SEO→requirements.md, api_spec.md(sitemap), test_cases/','著作権→architecture.md(DMCA), stakeholders.md, error_logs.md'],
    ['Distribution→architecture.md(CDN), api_spec.md, design_system.md','SEO→requirements.md, api_spec.md(sitemap), test_cases/','Copyright→architecture.md(DMCA), stakeholders.md, error_logs.md'],
    'SEO最適化|検索順位向上|入力:ページ、キーワード、競合|判断:タイトル≤60字、h1-h6階層、内部リンク≥3、表示速度≤2.5s|出力:最適化案、期待順位、修正箇所',
    'SEO Optimization|Improve search rank|Input: pages, keywords, competitors|Judgment: title≤60 chars, h1-h6 hierarchy, internal links≥3, load time≤2.5s|Output: optimization plan, expected rank, fixes'
  ),
  analytics:_dpb(
    ['データ収集→集計→可視化→洞察(イベント追跡、セッション分析)','異常検知→アラート→調査→対応(閾値監視、パターン学習)','レポート→ダッシュボード→共有→意思決定(KPI、トレンド、予測)'],
    ['Collect→Aggregate→Visualize→Insight (event tracking, session analysis)','Anomaly detect→Alert→Investigate→Respond (threshold monitor, pattern learning)','Report→Dashboard→Share→Decide (KPI, trends, forecasts)'],
    [_CG+':匿名化、集計のみ、個人特定不可','アクセス解析:Cookie同意、オプトアウト','データ保持:分析用1年、ログ3ヶ月'],
    [_CG+': anonymize, aggregated only, no personal ID','Analytics: cookie consent, opt-out','Data retention: analytics 1yr, logs 3mo'],
    ['表示遅延|リアルタイム集計重い|事前集計、Redis、materialized view','精度低|サンプリング不足|最低1000件、季節調整','ダッシュボード遅延|N+1クエリ|集計テーブル、キャッシュ5分'],
    ['Display delay|Heavy real-time aggregation|Pre-aggregate, Redis, materialized view','Low accuracy|Insufficient sampling|Minimum 1000 records, seasonal adjustment','Dashboard lag|N+1 queries|Aggregation tables, cache 5min'],
    ['収集→architecture.md(pipeline), api_spec.md, sequence_diagrams/','集計→architecture.md(aggregation), test_cases/, error_logs.md','可視化→design_system.md, api_spec.md(dashboard), requirements.md'],
    ['Collection→architecture.md(pipeline), api_spec.md, sequence_diagrams/','Aggregation→architecture.md(aggregation), test_cases/, error_logs.md','Visualization→design_system.md, api_spec.md(dashboard), requirements.md'],
    '異常検知|パターン異常検出|入力:時系列データ、閾値、履歴|判断:3σ超→アラート、前日比>50%注意、週次トレンド乖離|出力:異常スコア、原因候補、推奨対応',
    'Anomaly Detection|Pattern anomaly detection|Input: time-series, thresholds, history|Judgment: >3σ→alert, day-over-day>50% caution, weekly trend deviation|Output: anomaly score, cause candidates, recommended actions'
  ),
  iot:_dpb(
    ['デバイス登録→認証→データ収集→制御(MQTT、CoAP、証明書認証)','センサーデータ→処理→アラート→対応(閾値監視、異常検知)','ファームウェア更新→配信→適用→確認(OTA、ロールバック)'],
    ['Device registration→Auth→Data collection→Control (MQTT, CoAP, cert auth)','Sensor data→Process→Alert→Respond (threshold monitor, anomaly detection)','Firmware update→Distribute→Apply→Verify (OTA, rollback)'],
    ['電波法:技適、周波数遵守','製造物責任法:欠陥損害賠償',_CG+':デバイスデータ収集同意、匿名化'],
    [_CG+', Radio Act: tech conformity, frequency','Product Liability: defect liability',_CG+': device data collection consent, anonymization'],
    ['切断|不安定ネットワーク|オフライン動作、ローカルキュー、指数バックオフ','ファームウェア失敗|文鎮化|A/Bパーティション、ロールバック、チェックサム','バッテリー消耗|ポーリング頻度高|間引き、差分送信、スリープモード'],
    ['Disconnect|Unstable network|Offline operation, local queue, exponential backoff','Firmware failure|Bricked device|A/B partition, rollback, checksum','Battery drain|High polling frequency|Throttling, delta transmission, sleep mode'],
    ['デバイス→architecture.md(MQTT), security.md(auth), api_spec.md','データ→architecture.md(pipeline), sequence_diagrams/, test_cases/','更新→architecture.md(OTA), error_logs.md, stakeholders.md'],
    ['Device→architecture.md(MQTT), security.md(auth), api_spec.md','Data→architecture.md(pipeline), sequence_diagrams/, test_cases/','Update→architecture.md(OTA), error_logs.md, stakeholders.md'],
    'デバイス管理|接続状態監視制御|入力:デバイスID、センサー値、接続履歴|判断:切断>5分アラート、異常値→再送要求、バッテリー<10%省電力|出力:ステータス、コマンド、予測寿命',
    'Device Management|Monitor connection & control|Input: device ID, sensor values, connection history|Judgment: disconnect>5min alert, anomalous values→resend request, battery<10% power save|Output: status, commands, predicted lifespan'
  ),
  realestate:_dpb(
    ['物件登録→審査→公開→検索(画像、間取り、地図連携)','内見予約→確認→実施→フィードバック(カレンダー、リマインダー)','契約→重要事項説明→署名→完了(電子契約、クーリングオフ8日)'],
    ['Property registration→Review→Publish→Search (images, floor plan, map integration)','Viewing→Confirm→Conduct→Feedback (calendar, reminders)','Contract→Important matters→Sign→Complete (e-contract, 8d cooling-off)'],
    ['宅建業法:重要事項説明、契約書交付、クーリングオフ','表示規約:徒歩80m/分、築年数、面積正確',_CG+':個人情報保護、物件情報管理'],
    [_CG+', Real Estate Act: important matters, contract, cooling-off','Display Standards: walking 80m/min, age, area accurate',_CG+': personal info protection, property info mgmt'],
    ['情報不整合|外部連携遅延|1時間同期、差分検知、成約済み非表示','地図ずれ|ジオコーディング精度|Google Maps API、緯度経度検証','内見重複|空き枠管理不足|Lock、3段階確認、バッファ30分'],
    ['Info inconsistency|External sync delay|Hourly sync, detect diff, hide sold','Map misalignment|Geocoding accuracy|Google Maps API, lat/long validation','Viewing conflict|Insufficient slot mgmt|Lock, 3-phase confirm, 30min buffer'],
    ['物件→architecture.md(search), api_spec.md(property), design_system.md','内見→architecture.md(booking), sequence_diagrams/, test_cases/','契約→architecture.md(e-contract), security.md, stakeholders.md'],
    ['Property→architecture.md(search), api_spec.md(property), design_system.md','Viewing→architecture.md(booking), sequence_diagrams/, test_cases/','Contract→architecture.md(e-contract), security.md, stakeholders.md'],
    '物件管理|検索最適化推奨|入力:物件DB、検索履歴、成約データ|判断:検索上位≤10件、成約率<3%価格見直し、問合せ≥5未成約要改善|出力:ランキング、価格提案、改善点',
    'Property Management|Search optimization & recommendations|Input: property DB, search history, contract data|Judgment: top search results≤10, contract rate<3% revise price, inquiries≥5 without contract→improve|Output: ranking, price suggestions, improvements'
  ),
  legal:_dpb(
    ['契約作成→レビュー→承認→署名(テンプレート、バージョン管理)','案件管理→期日→アラート→対応(タスク、カレンダー、通知)','ドキュメント管理→検索→共有→監査証跡(暗号化、アクセス制御)'],
    ['Contract creation→Review→Approve→Sign (templates, versioning)','Case management→Deadline→Alert→Respond (tasks, calendar, notifications)','Document mgmt→Search→Share→Audit trail (encryption, access control)'],
    ['弁護士法:非弁禁止、法律相談は有資格者','個情保護:守秘義務、報告義務','電子署名法:電子署名の有効性、タイムスタンプ'],
    [_CG+', Attorney Act: prohibit unauthorized, licensed only','Privacy: confidentiality, reporting obligation','E-Signature Act: e-signature validity, timestamp'],
    ['契約生成ミス|変数置換漏れ|必須チェックリスト、プレビュー必須、レビューフロー','バージョン混在|履歴管理不足|Git-like管理、diff表示、ロック','期日漏れ|通知設定不足|3段階リマインダー(7日前、3日前、当日)'],
    ['Contract error|Missing variable substitution|Mandatory checklist, preview required, review flow','Version confusion|Insufficient history|Git-like management, diff display, locking','Deadline miss|Insufficient notifications|3-tier reminders (7d, 3d, same-day)'],
    ['契約→architecture.md(template), api_spec.md, sequence_diagrams/','レビュー→architecture.md(approval), stakeholders.md, test_cases/','監査→architecture.md(audit), security.md, error_logs.md'],
    ['Contract→architecture.md(template), api_spec.md, sequence_diagrams/','Review→architecture.md(approval), stakeholders.md, test_cases/','Audit→architecture.md(audit), security.md, error_logs.md'],
    '契約レビュー|リスク条項検出|入力:契約書テキスト、テンプレート、チェックリスト|判断:必須条項欠落→警告、リスク用語検出(無制限責任、排他的)、期限≤7日注意|出力:検出リスト、重要度、修正案',
    'Contract Review|Detect risk clauses|Input: contract text, templates, checklist|Judgment: missing mandatory clauses→warn, detect risk terms (unlimited liability, exclusive), deadline≤7d caution|Output: detected list, severity, revision suggestions'
  ),
  hr:_dpb(
    ['求人作成→公開→応募→選考(ATS、スクリーニング、面接)','評価→フィードバック→育成→昇進(1on1、目標管理、360度評価)','勤怠→集計→給与→支払(打刻、残業、有休管理)'],
    ['Job posting→Publish→Apply→Screen (ATS, screening, interviews)','Evaluation→Feedback→Develop→Promote (1-on-1, goal mgmt, 360 review)','Attendance→Aggregate→Payroll→Pay (clock-in, overtime, leave mgmt)'],
    ['労働基準法:勤怠記録3年、残業45h上限','個情保護:不適切質問禁止、候補者情報管理','雇用機会均等法:差別禁止、公平な選考'],
    [_CG+', Labor Standards: attendance 3yr, overtime 45h max','Privacy: prohibit inappropriate questions, candidate info mgmt','Equal Opportunity: prohibit discrimination, fair screening'],
    ['勤怠ミス|TZ未考慮、深夜日跨ぎ|UTC統一、深夜割増22-5時、月次突合','評価バイアス|主観のみ|360度評価、定量指標、校正会議','応募者漏れ|手動管理|ATS、自動ステータス更新、リマインダー'],
    ['Attendance error|TZ not considered, midnight crossing|Unify UTC, late-night premium 10PM-5AM, monthly reconcile','Evaluation bias|Subjective only|360 review, quantitative metrics, calibration meeting','Applicant miss|Manual mgmt|ATS, auto-status update, reminders'],
    ['勤怠→architecture.md(attendance), api_spec.md, test_cases/','評価→architecture.md(evaluation), stakeholders.md, requirements.md','採用→architecture.md(ATS), sequence_diagrams/, error_logs.md'],
    ['Attendance→architecture.md(attendance), api_spec.md, test_cases/','Evaluation→architecture.md(evaluation), stakeholders.md, requirements.md','Hiring→architecture.md(ATS), sequence_diagrams/, error_logs.md'],
    '採用フロー|選考最適化|入力:応募者データ、履歴書、面接記録|判断:必須スキル不足→不合格、経験≥3年優遇、カルチャーフィット評価|出力:合否判定、スコア、次ステップ',
    'Hiring Flow|Optimize screening|Input: applicant data, resumes, interview records|Judgment: missing required skills→reject, experience≥3yrs favor, culture fit assessment|Output: pass/fail, score, next steps'
  ),
  portfolio:_dpb(
    ['制作→公開→SEO→集客(レスポンシブ、画像最適化、Core Web Vitals)','プロジェクト→カテゴリ→フィルタ→表示(ポートフォリオサイト)','問合せ→フォーム→通知→対応(スパム対策、自動返信)'],
    ['Create→Publish→SEO→Attract (responsive, image optimization, Core Web Vitals)','Project→Category→Filter→Display (portfolio site)','Contact→Form→Notify→Respond (spam protection, auto-reply)'],
    [_CG+':Cookie同意、アクセス解析','著作権:作品ライセンス明示、転載禁止','肖像権:モデルリリース、ぼかし'],
    [_CG+': cookie consent, analytics','Copyright: specify work license, prohibit repost','Portrait rights: model release, blur'],
    ['画像未最適化|元サイズ配信|WebP、srcset、lazy loading','モバイル崩れ|レスポンシブ不足|Tailwind、ブレークポイント検証','SEO低順位|メタ不足|OGP、構造化データ、sitemap'],
    ['Image unoptimized|Serve original size|WebP, srcset, lazy loading','Mobile layout breaks|Insufficient responsive|Tailwind, breakpoint validation','Low SEO rank|Missing meta|OGP, structured data, sitemap'],
    ['制作→design_system.md, requirements.md, api_spec.md','SEO→architecture.md(SEO), test_cases/, stakeholders.md','問合せ→architecture.md(contact), security.md, error_logs.md'],
    ['Creation→design_system.md, requirements.md, api_spec.md','SEO→architecture.md(SEO), test_cases/, stakeholders.md','Contact→architecture.md(contact), security.md, error_logs.md'],
    'SEO最適化|表示速度改善|入力:ページHTML、画像、CSS|判断:LCP≤2.5s、FID≤100ms、CLS≤0.1、画像WebP化、CSS圧縮|出力:スコア、改善リスト、期待順位',
    'SEO Optimization|Improve page speed|Input: page HTML, images, CSS|Judgment: LCP≤2.5s, FID≤100ms, CLS≤0.1, image→WebP, CSS minify|Output: score, improvement list, expected rank'
  ),
  tool:_dpb(
    ['タスク→自動化→効率化→測定(ショートカット、マクロ、スクリプト)','データ→エクスポート→変換→活用(CSV、JSON、API連携)','設定→カスタマイズ→共有→同期(テーマ、プリセット、クラウド)'],
    ['Task→Automate→Streamline→Measure (shortcuts, macros, scripts)','Data→Export→Transform→Utilize (CSV, JSON, API integration)','Settings→Customize→Share→Sync (themes, presets, cloud)'],
    [_CG+':データ処理同意、エクスポート権','利用規約:使用制限、データ保持期間','セキュリティ:API認証、暗号化通信'],
    [_CG+': data processing consent, export rights','ToS: usage limits, data retention','Security: API auth, encrypted communication'],
    ['互換性|最新API(Safari未対応)|Polyfill、Can I Use、クロスブラウザテスト','エクスポート失敗|文字コード|UTF-8 BOM、CSV区切り文字検証','ショートカット競合|他ツール衝突|設定可能化、デフォルト変更、ガイド'],
    ['Compatibility|Latest API (Safari unsupported)|Polyfill, Can I Use, cross-browser test','Export failure|Character encoding|UTF-8 BOM, CSV delimiter validation','Shortcut conflict|Collision with other tools|Make configurable, change defaults, guide'],
    ['自動化→architecture.md(automation), api_spec.md, test_cases/','エクスポート→architecture.md(export), error_logs.md, stakeholders.md','設定→design_system.md, requirements.md, api_spec.md'],
    ['Automation→architecture.md(automation), api_spec.md, test_cases/','Export→architecture.md(export), error_logs.md, stakeholders.md','Settings→design_system.md, requirements.md, api_spec.md'],
    'ワークフロー自動化|反復作業削減|入力:タスクログ、操作履歴、頻度|判断:週≥3回→自動化候補、手順≥5ステップ優先、エラー率>10%要改善|出力:自動化案、期待削減時間、実装難易度',
    'Workflow Automation|Reduce repetitive tasks|Input: task logs, operation history, frequency|Judgment: weekly≥3 times→automation candidate, steps≥5 prioritize, error rate>10% improve|Output: automation plan, expected time savings, implementation difficulty'
  ),
  ai:_dpb(['プロンプト→生成→評価→改善','会話履歴→コンテキスト→応答品質','トークン→コスト→最適化'],['Prompt→Generate→Evaluate→Improve','History→Context→Quality','Token→Cost→Optimize'],[_CG+':データ処理同意','OpenAI ToS準拠','プロンプト暗号化'],[_CG+': data consent','OpenAI ToS compliance','Prompt encryption'],['プロンプト漏洩|ログ保存|対策:暗号化、アクセス制御','トークン超過|無制限生成|対策:制限設定、アラート'],[' Prompt leak|Log storage|Fix: encrypt, access control','Token overuse|Unlimited|Fix: limits, alerts'],['生成→architecture.md(AI), api_spec.md','履歴→stakeholders.md, security.md'],['Generate→architecture.md(AI), api_spec.md','History→stakeholders.md, security.md'],'プロンプト最適化|コスト削減|入力:履歴、トークン数|判断:>1000トークン→要約、重複→キャッシュ|出力:最適化案','Prompt Optimization|Cost reduction|Input: history, tokens|Judgment: >1000 tokens→summarize, duplicate→cache|Output: optimization plan'),
  automation:_dpb(['トリガー→実行→完了→通知','エラー→リトライ→成功→記録','ワークフロー→最適化→測定'],['Trigger→Execute→Complete→Notify','Error→Retry→Success→Log','Workflow→Optimize→Measure'],[_CG+':自動化同意','実行ログ保存','エラー通知'],[_CG+': automation consent','Execution logs','Error notification'],['無限ループ|終了条件なし|対策:最大実行回数、タイムアウト','リトライ過多|無制限|対策:指数バックオフ、上限設定'],['Infinite loop|No exit|Fix: max runs, timeout','Retry overuse|Unlimited|Fix: exponential backoff, limit'],['実行→architecture.md(workflow), api_spec.md','エラー→error_logs.md, stakeholders.md'],['Execute→architecture.md(workflow), api_spec.md','Error→error_logs.md, stakeholders.md'],'ワークフロー効率化|実行時間短縮|入力:実行ログ、ステップ時間|判断:>60s→並列化候補、失敗率>10%→要改善|出力:最適化案、期待時間削減','Workflow Efficiency|Reduce execution time|Input: logs, step duration|Judgment: >60s→parallel candidate, fail>10%→improve|Output: optimization, expected savings'),
  event:_dpb(['企画→告知→販売→開催','チケット→購入→検証→入場','キャンセル→返金→再販売'],['Plan→Announce→Sell→Hold','Ticket→Purchase→Verify→Entry','Cancel→Refund→Resell'],['個人情報保護法:氏名、メール暗号化','特商法:返金規定明記','会場規約:安全管理'],[' Privacy Act: name, email encrypt','Commercial Act: refund policy','Venue: safety management'],['定員超過|競合販売|対策:SELECT FOR UPDATE、在庫ロック','QR重複|生成ミス|対策:UUID、検証チェック'],['Oversell|Race condition|Fix: SELECT FOR UPDATE, lock','QR duplicate|Generation error|Fix: UUID, validation'],['販売→architecture.md(ticket), security.md','検証→architecture.md(QR), api_spec.md'],['Sales→architecture.md(ticket), security.md','Verify→architecture.md(QR), api_spec.md'],'チケット販売最適化|売上最大化|入力:販売履歴、残席、需要|判断:残席<20%→値上げ候補、売行き悪い→割引検討|出力:価格戦略、期待売上','Ticket Sales Optimization|Maximize revenue|Input: sales history, remaining, demand|Judgment: remaining<20%→price up candidate, slow sales→discount|Output: pricing strategy, expected revenue'),
  gamify:_dpb(['参加→達成→獲得→継続','ポイント→バッジ→ランキング→報酬','行動→測定→分析→最適化'],['Join→Achieve→Earn→Continue','Points→Badges→Ranking→Rewards','Behavior→Measure→Analyze→Optimize'],[_CG+':ポイント管理透明性','利用規約:ポイント有効期限','不正防止:行動監視'],[_CG+': point management transparency','ToS: point expiration','Fraud: behavior monitoring'],['ポイント重複付与|冪等性なし|対策:トランザクション、重複チェック','ランキング操作|不正行動|対策:異常検知、手動確認'],['Duplicate points|No idempotency|Fix: transaction, duplicate check','Ranking manipulation|Fraud|Fix: anomaly detection, manual review'],['達成→architecture.md(gamify), api_spec.md','不正→error_logs.md, security.md'],['Achievement→architecture.md(gamify), api_spec.md','Fraud→error_logs.md, security.md'],'エンゲージメント向上|継続率改善|入力:行動ログ、達成率|判断:完了<30%→難易度調整、離脱>50%→報酬見直し|出力:改善案、期待継続率','Engagement Improvement|Retention increase|Input: behavior logs, completion|Judgment: complete<30%→adjust difficulty, churn>50%→review rewards|Output: improvement plan, expected retention'),
  collab:_dpb(['作成→編集→同期→保存','競合→解決→マージ→履歴','権限→承認→共有→通知'],['Create→Edit→Sync→Save','Conflict→Resolve→Merge→History','Permission→Approve→Share→Notify'],[_CG+':データ処理同意','利用規約:編集権限、削除30日','セキュリティ:暗号化通信、アクセスログ'],[_CG+': data processing consent','ToS: edit permission, delete 30d','Security: encrypted communication, access log'],['編集消失|競合解決失敗|対策:OT/CRDT、定期保存','権限漏れ|チェック不足|対策:RLS、middleware検証'],['Edit loss|Conflict resolution failure|Fix: OT/CRDT, periodic save','Permission bypass|Insufficient check|Fix: RLS, middleware validation'],['同期→architecture.md(realtime), api_spec.md','権限→security.md, test_cases/'],['Sync→architecture.md(realtime), api_spec.md','Permission→security.md, test_cases/'],'競合解決最適化|編集消失防止|入力:編集履歴、競合頻度|判断:競合>5/h→通知強化、消失>1%→保存頻度増|出力:最適化案','Conflict Resolution Optimization|Prevent edit loss|Input: edit history, conflict rate|Judgment: conflicts>5/h→enhance notification, loss>1%→increase save frequency|Output: optimization plan'),
  devtool:_dpb(['登録→発行→使用→追跡','リクエスト→検証→実行→記録','エラー→通知→対応→改善'],['Register→Issue→Use→Track','Request→Verify→Execute→Log','Error→Notify→Respond→Improve'],[_CG+':データ処理同意','利用規約:レート制限、使用制限','セキュリティ:APIキー暗号化、IP制限'],[_CG+': data processing consent','ToS: rate limits, usage limits','Security: API key encryption, IP restriction'],['キー漏洩|平文保存|対策:暗号化、ハッシュ化、定期ローテーション','レート突破|制限なし|対策:Redis、sliding window'],['Key leakage|Plain text|Fix: encrypt, hash, regular rotation','Rate bypass|No limits|Fix: Redis, sliding window'],['認証→security.md, api_spec.md','使用→architecture.md(tracking), stakeholders.md'],['Auth→security.md, api_spec.md','Usage→architecture.md(tracking), stakeholders.md'],'API使用最適化|コスト削減|入力:リクエストログ、エラー率|判断:エラー>5%→要改善、重複>30%→キャッシュ候補|出力:最適化案、期待削減率','API Usage Optimization|Cost reduction|Input: request logs, error rate|Judgment: error>5%→improve, duplicate>30%→cache candidate|Output: optimization plan, expected reduction'),
  creator:_dpb(['作成→公開→収益化→分析','サブスク→課金→継続→解約','ファン→交流→支援→成長'],['Create→Publish→Monetize→Analyze','Subscribe→Charge→Continue→Cancel','Fan→Engage→Support→Grow'],[_CG+':データ処理同意','資金決済法:前払式、第三者型','利用規約:手数料、返金規定'],[_CG+': data processing consent','Payment Services Act: prepaid, third-party','ToS: fees, refund policy'],['解約後課金|サブスク解約漏れ|対策:Webhook検証、定期確認','投げ銭未着|決済失敗|対策:リトライ、通知'],['Charge after cancel|Subscription cancel miss|Fix: webhook verification, periodic check','Tip not received|Payment failure|Fix: retry, notification'],['課金→architecture.md(subscription), security.md','支援→architecture.md(tip), api_spec.md'],['Billing→architecture.md(subscription), security.md','Support→architecture.md(tip), api_spec.md'],'収益最適化|ファン増加|入力:収益データ、ファン行動|判断:離脱>30%→ティア見直し、成長<10%→施策追加|出力:改善案、期待収益','Revenue Optimization|Fan growth|Input: revenue data, fan behavior|Judgment: churn>30%→review tiers, growth<10%→add tactics|Output: improvement plan, expected revenue'),
  newsletter:_dpb(['作成→配信→開封→分析','購読→確認→受信→解除','セグメント→ターゲット→パーソナライズ'],['Create→Send→Open→Analyze','Subscribe→Confirm→Receive→Unsubscribe','Segment→Target→Personalize'],[_CG+':配信同意、オプトイン','特定電子メール法:配信者明記、解除リンク','個人情報保護法:購読者情報暗号化'],[_CG+': sending consent, opt-in','Anti-Spam Act: sender info, unsubscribe link','Privacy Act: subscriber info encryption'],['解除後配信|リスト更新漏れ|対策:即時反映、定期同期','スパム判定|SPF/DKIM未設定|対策:認証設定、レピュテーション管理'],['Send after unsubscribe|List update miss|Fix: immediate reflect, periodic sync','Spam flagged|No SPF/DKIM|Fix: auth setup, reputation management'],['配信→architecture.md(email), api_spec.md','分析→stakeholders.md, architecture.md(analytics)'],['Send→architecture.md(email), api_spec.md','Analytics→stakeholders.md, architecture.md(analytics)'],'配信最適化|開封率向上|入力:配信履歴、開封率、クリック率|判断:開封<20%→件名改善、クリック<5%→CTA最適化|出力:改善案、期待開封率','Delivery Optimization|Improve open rate|Input: send history, open rate, click rate|Judgment: open<20%→improve subject, click<5%→optimize CTA|Output: improvement plan, expected open rate')
};

// Get domain-specific QA strategy
function getDomainQA(domain,G){
  const qa=DOMAIN_QA_MAP[domain];
  if(!qa)return null;
  const cross=Object.values(QA_CROSS_CUTTING).filter(c=>c.domains.includes(domain));
  return {focus:G?qa.focus_ja:qa.focus_en,bugs:G?qa.bugs_ja:qa.bugs_en,priority:qa.priority,crossCutting:cross.map(c=>G?c.ja:c.en)};
}

/// ── B9: URL/Routing Table Generation ──
function genRoutes(a){
  const G=S.genLang==='ja';
  const routes=[
    {path:'/',name:G?'ランディング':'Landing',auth:false},
    {path:'/login',name:G?'ログイン':'Login',auth:false},
    {path:'/register',name:G?'新規登録':'Register',auth:false},
  ];
  // Screen name → URL mapping (Japanese & English)
  const MAP=[
    [/ランディング|landing|LP|トップ|top|ホーム|home/i,'/',false],
    [/ログイン|login|サインイン|signin/i,'/login',false],
    [/新規登録|register|signup|サインアップ/i,'/register',false],
    [/ダッシュボード|dashboard/i,'/dashboard',true],
    [/設定|setting/i,'/settings',true],
    [/プロフィール|profile|マイページ/i,'/profile',true],
    [/管理|admin/i,'/admin',true],
    [/検索|search/i,'/search',false],
    [/通知|notification/i,'/notifications',true],
    [/メッセージ|message|チャット|chat/i,'/messages',true],
    [/一覧|list|リスト/i,'/list',true],
    [/詳細|detail/i,'/[id]',true],
    [/作成|create|新規作成/i,'/create',true],
    [/編集|edit/i,'/[id]/edit',true],
    [/課金|billing|サブスク|subscription|料金|pricing/i,'/pricing',false],
    [/お問い合わせ|contact/i,'/contact',false],
    [/利用規約|terms/i,'/terms',false],
    [/about|概要/i,'/about',false],
  ];
  const screens=(a.screens||'').split(', ').filter(Boolean);
  screens.forEach(s=>{
    const raw=s.replace(/\(P[0-2]\)/gi,'').trim();
    const matched=MAP.find(([rx])=>rx.test(raw));
    if(matched){routes.push({path:matched[1],name:raw,auth:matched[2]});}
    else{
      const slug=raw.replace(/[ぁ-んァ-ヶ一-龥々〇〻\u3400-\u9FFF\uF900-\uFAFF]/g,'')
        .toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
      routes.push({path:'/'+(slug||'page'),name:raw,auth:true});
    }
  });
  const seen=new Set();
  return routes.filter(r=>{if(seen.has(r.path))return false;seen.add(r.path);return true;});
}

// ── C: Post-Generation Audit ──
function postGenerationAudit(files,a){
  const findings=[];
  const G=S.genLang==='ja';
  const constitution=files['.spec/constitution.md']||'';
  const spec=files['.spec/specification.md']||'';
  const techPlan=files['.spec/technical-plan.md']||'';
  const tasks=files['.spec/tasks.md']||'';
  const verify=files['.spec/verification.md']||'';

  // C1: Auth SoT consistency
  const auth=resolveAuth(a);
  const authInConst=constitution.includes(auth.sot);
  const authInSpec=spec.includes(auth.sot);
  const authInTP=techPlan.includes(auth.sot);
  if(!authInConst||!authInSpec||!authInTP){
    findings.push({level:'error',msg:G?'認証SoTが全文書で一致していません':'Auth SoT inconsistent across documents'});
  }

  // C2: Architecture pattern consistency
  const arch=resolveArch(a);
  if(arch.pattern==='baas'&&techPlan.includes('API Gateway')){
    findings.push({level:'error',msg:G?'BaaS構成なのにAPI Gatewayが記載されています':'API Gateway present in BaaS architecture'});
  }
  if(arch.pattern==='bff'&&techPlan.includes('api/')){
    // Only warn if separate api/ directory exists (should use app/api/)
    if(techPlan.includes('├── api/')){
      findings.push({level:'warn',msg:G?'BFF構成では api/ ディレクトリは不要です（app/api/ を使用）':'BFF pattern should not have separate api/ directory (use app/api/)'});
    }
  }

  // C3: Scope vs features conflict
  const scopeOut=(a.scope_out||'').toLowerCase();
  if(scopeOut.includes('ネイティブ')&&spec.includes('Expo')&&!constitution.includes('Expo Web UI')){
    findings.push({level:'error',msg:G?'スコープ外「ネイティブ」と仕様のExpo記述が矛盾':'Scope excludes native but spec includes Expo'});
  }

  // C4: Entity domain warnings
  const er=inferER(a);
  er.warnings.forEach(w=>findings.push({level:'warn',msg:w}));

  // C5: Schedule date present
  if(tasks&&!tasks.includes(new Date().toISOString().split('T')[0].slice(0,7))){
    findings.push({level:'info',msg:G?'タスクの開始日が今月と異なります':'Task start date differs from current month'});
  }

  // C6: DevContainer matches backend
  const compose=files['.devcontainer/docker-compose.yml']||'';
  const be=a.backend||'';
  if(be.includes('Supabase')&&compose.includes('postgres:16')){
    findings.push({level:'error',msg:G?'Supabase構成なのにDevContainerが素PostgreSQLです':'Supabase stack but DevContainer uses raw PostgreSQL'});
  }
  if(be.includes('Firebase')&&compose.includes('postgres:16')){
    findings.push({level:'error',msg:G?'Firebase構成なのにDevContainerにPostgreSQLがあります':'Firebase stack but DevContainer includes PostgreSQL'});
  }

  // C7: Package.json dependencies match stack
  const pkg=files['package.json']?JSON.parse(files['package.json']):{};
  const deps=pkg.dependencies||{};
  if(be.includes('Supabase')&&!deps['@supabase/supabase-js']){
    findings.push({level:'warn',msg:G?'Supabase使用なのにpackage.jsonに@supabase/supabase-jsがありません':'Supabase stack but @supabase/supabase-js missing from package.json'});
  }
  if(be.includes('Express')&&!deps['express']){
    findings.push({level:'warn',msg:G?'Express使用なのにpackage.jsonにexpressがありません':'Express stack but express missing from package.json'});
  }

  // C8: .env prefix matches frontend
  const envFile=files['.env.example']||'';
  const feRaw=a.frontend||'';
  if(feRaw.includes('Vite')&&envFile.includes('NEXT_PUBLIC_')){
    findings.push({level:'error',msg:G?'Vite SPAなのに.envにNEXT_PUBLIC_があります':'Vite SPA but .env uses NEXT_PUBLIC_ prefix'});
  }
  if(feRaw.includes('Next')&&envFile.includes('VITE_')){
    findings.push({level:'error',msg:G?'Next.jsなのに.envにVITE_があります':'Next.js but .env uses VITE_ prefix'});
  }

  // C9: Monitoring matches deploy target
  const monDoc=files['docs/17_monitoring.md']||'';
  const deploy=a.deploy||'';
  if(!deploy.includes('Vercel')&&monDoc.includes('Vercel Analytics')){
    findings.push({level:'warn',msg:G?'デプロイ先がVercelではないのにVercel Analyticsが記載されています':'Non-Vercel deploy but Vercel Analytics in monitoring doc'});
  }

  // C10: BaaS should not have Prisma deps
  if(arch.isBaaS&&((pkg.devDependencies||{})['prisma']||deps['@prisma/client'])){
    findings.push({level:'warn',msg:G?'BaaS構成なのにPrisma依存があります':'BaaS stack but Prisma dependencies present'});
  }

  return findings;
}

function genCommonFiles(a,pn){
  const G=S.genLang==='ja';
  S.files['README.md']=`# ${pn}

> Generated by [DevForge v9](https://github.com/) — ${G?'AI駆動開発統合プラットフォーム':'AI-driven Development Platform'}

## ${G?'概要':'Overview'}
${a.purpose||'N/A'}

## ${G?'技術スタック':'Tech Stack'}
- Frontend: ${a.frontend||'React + Next.js'}
- Backend: ${a.backend||'Node.js'}
- Database: ${a.database||'PostgreSQL'}
- Deploy: ${a.deploy||'Vercel'}
${!isNone(a.mobile)?`- Mobile: ${a.mobile}\n`:''}
## ${G?'セットアップ':'Setup'}
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/${pn.toLowerCase().replace(/[^a-z0-9]/g,'-')}.git
cd ${pn.toLowerCase().replace(/[^a-z0-9]/g,'-')}
npm install
cp .env.example .env.local
npm run dev
\`\`\`

## ${G?'プロジェクト構造':'Project Structure'}
- \`.spec/\` — ${G?'SDD仕様書（柱①）':'SDD specs (Pillar 1)'}
- \`.devcontainer/\` — ${G?'開発環境（柱②）':'Dev environment (Pillar 2)'}
- \`.mcp/\` — ${G?'MCP設定（柱③）':'MCP config (Pillar 3)'}
- \`CLAUDE.md\` etc. — ${G?'AIルール（柱④）':'AI rules (Pillar 4)'}
- \`roadmap/\` — ${G?'学習ロードマップ（柱⑦）':'Learning roadmap (Pillar 7)'}
- \`docs/\` — ${G?'開発ドキュメント（21ファイル）':'Dev documents (21 files)'}

## ${G?'駆動開発手法':'Dev Methods'}
${(a.dev_methods||'TDD').split(', ').join(' / ')}

## ${G?'ライセンス':'License'}
MIT

---
${G?'© 2026 エンジニアリングのタネ制作委員会 ｜ 作成者：にしあん':'© 2026 Engineering no Tane Committee | by にしあん'}
`;

  const isNextFE=(a.frontend||'').includes('Next');
  const gitIgnoreLines=['node_modules/',isNextFE?'.next/':'dist/','build/','.env','.env.local','*.log','.DS_Store','coverage/','.turbo/'];
  if((a.backend||'').includes('Supabase')) gitIgnoreLines.push('.supabase/');
  S.files['.gitignore']=gitIgnoreLines.join('\n')+'\n';

  const pkgDeps=buildDeps(a);
  S.files['package.json']=JSON.stringify({
    name:pn.toLowerCase().replace(/[^a-z0-9]/g,'-'),
    version:'0.1.0',
    private:true,
    scripts:pkgDeps.scripts,
    dependencies:pkgDeps.deps,devDependencies:pkgDeps.devDeps
  },null,2);

  S.files['LICENSE']=`MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${pn}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\n
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n
\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`;
}

