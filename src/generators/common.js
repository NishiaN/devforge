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
  portfolio:{core:['User','Project','Skill','Experience','Contact'],warn:['Product','Order','Cart','Payment'],suggest:{}},
  tool:{core:['User','Workspace','Task','Setting','Log'],warn:['Product','Order','Cart'],suggest:{}},
  iot:{core:['User','Device','Sensor','SensorData','Alert','Dashboard'],warn:['Product','Order','Cart'],suggest:{}},
  realestate:{core:['User','Property','Category','Viewing','Contract','Agent'],warn:['Product','Order','Cart'],suggest:{Product:'Property',Order:'Viewing'}},
  legal:{core:['User','Contract','Template','Review','Client','Document'],warn:['Product','Order','Cart'],suggest:{}},
  hr:{core:['User','JobPosting','Applicant','Interview','Evaluation','Department'],warn:['Product','Order','Cart'],suggest:{}},
  fintech:{core:['User','Account','Transaction','Transfer','Card','Statement'],warn:['Post','Comment','Course'],suggest:{}},
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
  Contact:['email:VARCHAR(255):NOT NULL:メールアドレス:Email','subject:VARCHAR(255)::件名:Subject','body:TEXT:NOT NULL:本文:Body','status:VARCHAR(20):DEFAULT \'unread\':対応状態:Status'],
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
    [/教育|学習|education|learning|lms|コース|course/i,'education'],
    [/\bEC\b|eコマース|e-commerce|ショップ|\bshop\b|\bcommerce\b/i,'ec'],
    [/マーケットプレイス|marketplace/i,'marketplace'],
    [/コミュニティ|community|フォーラム|forum/i,'community'],
    [/コンテンツ|content|メディア|media|ブログ|blog/i,'content'],
    [/分析|analytics|可視化|ダッシュボード/i,'analytics'],
    [/予約|booking|スケジュール/i,'booking'],
    [/saas|サブスク|subscription/i,'saas'],
    [/IoT|デバイス|device|sensor|センサー/i,'iot'],
    [/不動産|物件|real.?estate|property/i,'realestate'],
    [/法務|契約|legal|contract|コンプライアンス/i,'legal'],
    [/人事|HR|採用|recruit|hiring/i,'hr'],
    [/金融|fintech|銀行|bank|決済管理/i,'fintech'],
    [/ポートフォリオ|portfolio/i,'portfolio'],
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
};

// Match feature name to FEATURE_DETAILS entry
function getFeatureDetail(featureName){
  for(const[pattern,detail]of Object.entries(FEATURE_DETAILS)){
    if(new RegExp(pattern,'i').test(featureName)) return detail;
  }
  return null;
}

// ── B9: URL/Routing Table Generation ──
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

