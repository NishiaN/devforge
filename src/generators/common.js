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
    const _be=a.backend||'';
    if(/Python|Django|FastAPI/i.test(_be)) tokenVerify='PyJWT decode() / python-jose jwt.decode()';
    else if(/Spring/.test(_be)) tokenVerify='java-jwt / jjwt (io.jsonwebtoken)';
    else if(/Go/.test(_be)) tokenVerify='golang-jwt (github.com/golang-jwt/jwt/v5)';
    else tokenVerify='jsonwebtoken verify() / jose jwtVerify()';
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

// ── B3b: ORM Single Source of Truth Resolution ──
function resolveORM(a){
  const be=a.backend||'';
  if(/Supabase|Firebase|Convex/.test(be)){
    return {name:be.includes('Supabase')?'Supabase Client':be.includes('Firebase')?'Firebase SDK':'Convex',
            dir:be.includes('Supabase')?'supabase':be.includes('Firebase')?'functions':'convex',
            isBaaS:true,isPython:false};
  }
  const orm=a.orm||'';
  const isPy=/Python|Django|FastAPI/i.test(be);
  if(orm.includes('Drizzle'))    return {name:'Drizzle ORM',dir:'drizzle',isBaaS:false,isPython:false};
  if(orm.includes('TypeORM'))    return {name:'TypeORM',dir:'typeorm',isBaaS:false,isPython:false};
  if(orm.includes('SQLAlchemy')) return {name:'SQLAlchemy',dir:'alembic',isBaaS:false,isPython:true};
  if(orm.includes('Kysely'))     return {name:'Kysely',dir:'kysely',isBaaS:false,isPython:false};
  if(isPy) return {name:'SQLAlchemy',dir:'alembic',isBaaS:false,isPython:true};
  return {name:'Prisma ORM',dir:'prisma',isBaaS:false,isPython:false};
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
    if(orm.includes('TypeORM')){deps['typeorm']='^0.3';deps['reflect-metadata']='^0.2';
      scripts['db:migrate']='typeorm migration:run';scripts['db:generate']='typeorm migration:generate';}
    if(orm.includes('Kysely')){deps['kysely']='^0.27';devDeps['kysely-codegen']='^0.16';
      scripts['db:migrate']='kysely migrate:latest';}
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
  analytics:{core:['User','Organization','OrgMember','Dashboard','DataSource','Widget','Report','Chart'],warn:['Post','Comment','Product'],suggest:{}},
  booking:{core:['User','Service','Booking','TimeSlot','Review','Payment'],warn:['Post','Cart','Lesson'],suggest:{Product:'Service',Order:'Booking'}},
  saas:{core:['User','Organization','OrgMember','Workspace','Project','Task','Subscription','Invoice'],warn:[],suggest:{Product:'Plan',Order:'Subscription'}},
  portfolio:{core:['User','Project','Skill','Experience','ContactMessage'],warn:['Product','Order','Cart','Payment'],suggest:{}},
  tool:{core:['User','Organization','OrgMember','Workspace','Task','Setting','Log'],warn:['Product','Order','Cart'],suggest:{}},
  iot:{core:['User','Device','Sensor','SensorData','Alert','Dashboard'],warn:['Product','Order','Cart'],suggest:{}},
  realestate:{core:['User','Property','Category','Viewing','Contract','RealEstateAgent'],warn:['Product','Order','Cart'],suggest:{Product:'Property',Order:'Viewing'}},
  legal:{core:['User','Contract','Template','Review','Client','Document'],warn:['Product','Order','Cart'],suggest:{}},
  hr:{core:['User','Organization','OrgMember','JobPosting','Applicant','Interview','Evaluation','Department'],warn:['Product','Order','Cart'],suggest:{}},
  fintech:{core:['User','Account','Transaction','Transfer','Card','Statement'],warn:['Post','Comment','Course'],suggest:{}},
  health:{core:['User','Patient','Doctor','Appointment','MedicalRecord','Prescription'],warn:['Product','Order','Cart'],suggest:{Product:'Service',Order:'Appointment'}},
  ai:{core:['User','Conversation','Message','Prompt','Agent','Tool','ApiUsage'],warn:['Product','Order','Cart'],suggest:{}},
  automation:{core:['User','Organization','OrgMember','Workflow','Trigger','Action','Execution','Connection','Log'],warn:['Product','Order'],suggest:{}},
  event:{core:['User','Event','Ticket','Attendee','Venue','Session','Survey'],warn:['Product','Order'],suggest:{Product:'Ticket',Order:'Booking'}},
  gamify:{core:['User','Badge','Challenge','Reward','Leaderboard','PointLog','Achievement'],warn:['Product','Order','Cart'],suggest:{}},
  collab:{core:['User','Organization','OrgMember','Document','Workspace','Comment','Version','Permission','Activity'],warn:['Product','Order','Cart'],suggest:{}},
  devtool:{core:['User','ApiKey','Project','RequestLog','Webhook','Documentation'],warn:['Product','Order','Cart'],suggest:{}},
  creator:{core:['User','Content','Subscription','Payment','Tier','Comment','Tip'],warn:['Order','Cart'],suggest:{}},
  newsletter:{core:['User','Post','Subscriber','Campaign','Analytics','Plan'],warn:['Product','Order','Cart'],suggest:{Product:'Plan',Order:'Subscription'}},
  manufacturing:{core:['User','Product','ProductionOrder','Inventory','WorkOrder','Machine','QualityCheck'],warn:['Post','Comment','Course'],suggest:{Product:'Component'}},
  logistics:{core:['User','Shipment','Package','Warehouse','Route','Delivery','Vehicle'],warn:['Post','Comment','Course'],suggest:{}},
  agriculture:{core:['User','Farm','Crop','Field','Sensor','Harvest','Equipment'],warn:['Product','Order','Cart'],suggest:{}},
  energy:{core:['User','Device','Meter','Reading','Alert','Tariff','Report'],warn:['Post','Comment','Product'],suggest:{}},
  media:{core:['User','Content','Program','Episode','Subscriber','Comment','Like'],warn:['Product','Order','Cart'],suggest:{Product:'Subscription',Order:'View'}},
  government:{core:['User','Application','Document','Department','Approval','Citizen','Service'],warn:['Product','Order','Cart'],suggest:{}},
  travel:{core:['User','Booking','Itinerary','Hotel','Flight','Review','Payment'],warn:['Post','Comment','Course'],suggest:{}},
  insurance:{core:['User','Policy','Claim','Customer','Quote','Document','Payment'],warn:['Product','Order','Cart'],suggest:{}},
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
const _C='content:TEXT::コンテンツ:Content';
const _ADDR='address:TEXT::住所:Address';
const _SUBJ='subject:VARCHAR(255)::件名:Subject';
const _URL='url:TEXT::URL:URL';
const _REASON='reason:TEXT::理由:Reason';
const _MSG='message:TEXT::メッセージ:Message';
const _COMPANY='company:VARCHAR(255)::会社名:Company';
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
  // ── Enterprise/Multi-tenant ──
  Organization:['slug:VARCHAR(100):UNIQUE NOT NULL:スラグ:Slug','status:VARCHAR(20):DEFAULT \'active\':ステータス:Status','plan:VARCHAR(20):DEFAULT \'free\':プラン:Plan','logo_url:TEXT::ロゴURL:Logo URL'],
  OrgMember:['org_id:UUID:FK(Organization) NOT NULL:組織ID:Organization ID',_U,'role:VARCHAR(20):DEFAULT \'member\':ロール:Role','joined_at:TIMESTAMP:DEFAULT now():参加日:Joined at'],
  OrgInvite:['org_id:UUID:FK(Organization) NOT NULL:組織ID:Organization ID','email:VARCHAR(255):NOT NULL:メール:Email','role:VARCHAR(20):DEFAULT \'member\':ロール:Role','token:UUID:DEFAULT gen_random_uuid():トークン:Token','expires_at:TIMESTAMP:NOT NULL:期限:Expires at','redeemed_at:TIMESTAMP::利用日:Redeemed at'],
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
  Vaccination:['pet_id:UUID:FK(Pet) NOT NULL:ペットID:Pet ID','vaccine_name:VARCHAR(255):NOT NULL:ワクチン名:Vaccine name','administered_at:TIMESTAMP:NOT NULL:接種日:Administered at','next_due:DATE::次回予定:Next due','veterinarian_id:UUID:FK(Veterinarian):獣医ID:Veterinarian ID',_N],
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
  Response:['ticket_id:UUID:FK(SupportTicket) NOT NULL:チケットID:Ticket ID','responder_id:UUID:FK(User) NOT NULL:回答者ID:Responder ID','content:TEXT:NOT NULL:内容:Content','is_public:BOOLEAN:DEFAULT true:公開:Public'],
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
  // ── B-1 fix: Missing entities ──
  Schedule:[_U,'technician_id:UUID:FK(User) NOT NULL:技術者ID:Technician ID','work_order_id:UUID:FK(WorkOrder) NOT NULL:作業指示ID:Work Order ID','scheduled_date:DATE:NOT NULL:予定日:Scheduled Date','start_time:TIME::開始時刻:Start Time','end_time:TIME::終了時刻:End Time',_SA],
  Feedback:[_U,'article_id:UUID:FK(Article) NOT NULL:記事ID:Article ID','rating:INTEGER:CHECK(rating BETWEEN 1 AND 5):評価:Rating','comment:TEXT::コメント:Comment',_SA],
  // ── B-2 fix: Entity name collision resolution ──
  SupportTicket:[_U,'subject:VARCHAR(255):NOT NULL:件名:Subject',_D,'priority_id:UUID:FK(Priority) NOT NULL:優先度ID:Priority ID','category_id:UUID:FK(Category):カテゴリID:Category ID','assigned_agent_id:UUID:FK(User):担当者ID:Assigned Agent ID',_SP,'sla_id:UUID:FK(SLA):SLA ID:SLA ID'],
  SupportAgent:[_U,'agent_name:VARCHAR(255):NOT NULL:サポート担当者名:Support agent name','email:VARCHAR(255)::メール:Email','department:VARCHAR(100)::部署:Department','specialization:VARCHAR(100)::専門分野:Specialization','is_available:BOOLEAN:DEFAULT true:対応可能:Available',_SA],
  RealEstateAgent:[_U,'agent_name:VARCHAR(255):NOT NULL:エージェント名:Agent name','license_number:VARCHAR(100)::免許番号:License number','company:VARCHAR(255)::所属会社:Company','phone:VARCHAR(50)::電話:Phone',_SA,'rating:DECIMAL(3,2)::評価:Rating'],
  // ── Task B: New 8-domain entities (32-domain expansion) ──
  // Manufacturing (3)
  ProductionOrder:[_U,'product_id:UUID:FK(Product) NOT NULL:製品ID:Product ID','quantity:INTEGER:NOT NULL:数量:Quantity','scheduled_date:DATE:NOT NULL:予定日:Scheduled Date','completion_date:DATE::完了日:Completion Date',_SP],
  Machine:[_U,'machine_name:VARCHAR(255):NOT NULL:機械名:Machine name','machine_type:VARCHAR(100)::種別:Type','location:VARCHAR(255)::設置場所:Location',_SA,'last_maintenance:DATE::最終保守日:Last maintenance'],
  QualityCheck:[_U,'production_order_id:UUID:FK(ProductionOrder) NOT NULL:製造指示ID:Production Order ID','inspector_id:UUID:FK(User):検査者ID:Inspector ID','result:VARCHAR(50):NOT NULL:結果:Result','defects:INTEGER:DEFAULT 0:不良数:Defect count',_N],
  // Logistics (3)
  Package:[_U,'shipment_id:UUID:FK(Shipment) NOT NULL:出荷ID:Shipment ID','weight:DECIMAL(10,2)::重量kg:Weight kg','dimensions:VARCHAR(100)::寸法:Dimensions','tracking_number:VARCHAR(100)::追跡番号:Tracking number',_SA],
  Delivery:[_U,'shipment_id:UUID:FK(Shipment) NOT NULL:出荷ID:Shipment ID','driver_id:UUID:FK(User):ドライバーID:Driver ID','delivered_at:TIMESTAMP::配達日時:Delivered at','recipient_name:VARCHAR(255)::受取人:Recipient',_SA],
  Vehicle:[_U,'plate_number:VARCHAR(50):NOT NULL:ナンバー:Plate number','vehicle_type:VARCHAR(100)::車種:Vehicle type','capacity:DECIMAL(10,2)::積載量:Capacity',_SA],
  // Agriculture (5)
  Farm:[_U,'farm_name:VARCHAR(255):NOT NULL:農場名:Farm name','location:VARCHAR(255)::所在地:Location','area_hectares:DECIMAL(10,2)::面積ha:Area hectares','owner_id:UUID:FK(User):オーナーID:Owner ID'],
  Crop:[_U,'crop_name:VARCHAR(255):NOT NULL:作物名:Crop name','variety:VARCHAR(255)::品種:Variety','planting_date:DATE::播種日:Planting date','expected_harvest:DATE::収穫予定:Expected harvest',_SA],
  Field:[_U,'farm_id:UUID:FK(Farm) NOT NULL:農場ID:Farm ID','field_name:VARCHAR(255):NOT NULL:圃場名:Field name','area_hectares:DECIMAL(10,2)::面積ha:Area hectares','soil_type:VARCHAR(100)::土壌:Soil type','crop_id:UUID:FK(Crop):作物ID:Crop ID'],
  Harvest:[_U,'field_id:UUID:FK(Field) NOT NULL:圃場ID:Field ID','crop_id:UUID:FK(Crop) NOT NULL:作物ID:Crop ID','harvest_date:DATE:NOT NULL:収穫日:Harvest date','quantity_kg:DECIMAL(10,2):NOT NULL:収穫量kg:Quantity kg','grade:VARCHAR(50)::等級:Grade'],
  Equipment:[_U,'equipment_name:VARCHAR(255):NOT NULL:機材名:Equipment name','equipment_type:VARCHAR(100)::種別:Type',_SA,'last_maintenance:DATE::最終保守日:Last maintenance'],
  // Energy (3)
  Meter:[_U,'device_id:UUID:FK(Device):デバイスID:Device ID','meter_number:VARCHAR(100):NOT NULL:メーター番号:Meter number','meter_type:VARCHAR(50)::種別:Type','location:VARCHAR(255)::設置場所:Location',_SA],
  Reading:[_U,'meter_id:UUID:FK(Meter) NOT NULL:メーターID:Meter ID','value:DECIMAL(12,4):NOT NULL:計測値:Value','unit:VARCHAR(20):DEFAULT \'kWh\':単位:Unit','recorded_at:TIMESTAMP:NOT NULL:記録日時:Recorded at','quality:VARCHAR(20)::品質:Quality'],
  Tariff:[_U,'tariff_name:VARCHAR(255):NOT NULL:料金プラン名:Tariff name','rate:DECIMAL(10,4):NOT NULL:単価:Rate','unit:VARCHAR(20):DEFAULT \'kWh\':単位:Unit','valid_from:DATE:NOT NULL:開始日:Valid from','valid_to:DATE::終了日:Valid to'],
  // Media (2)
  Program:[_U,'program_name:VARCHAR(255):NOT NULL:番組名:Program name','genre:VARCHAR(100)::ジャンル:Genre',_D,_SA,'thumbnail_url:TEXT::サムネイル:Thumbnail URL'],
  Episode:[_U,'program_id:UUID:FK(Program) NOT NULL:番組ID:Program ID','episode_number:INTEGER:NOT NULL:話数:Episode number',_T,'duration_min:INTEGER::時間(分):Duration min','video_url:TEXT::動画URL:Video URL','published_at:TIMESTAMP::公開日:Published at'],
  // Government (2)
  Application:[_U,'citizen_id:UUID:FK(User) NOT NULL:市民ID:Citizen ID','application_type:VARCHAR(100):NOT NULL:申請種別:Application type',_D,_SP,'submitted_at:TIMESTAMP::提出日:Submitted at','reviewed_by:UUID:FK(User):審査者ID:Reviewed by'],
  Citizen:[_U,'citizen_name:VARCHAR(255):NOT NULL:氏名:Citizen name','address:TEXT::住所:Address','phone:VARCHAR(50)::電話:Phone','national_id:VARCHAR(100)::マイナンバー:National ID',_SA],
  // Travel (3)
  Itinerary:[_U,'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID','itinerary_name:VARCHAR(255):NOT NULL:旅程名:Itinerary name','start_date:DATE:NOT NULL:開始日:Start date','end_date:DATE:NOT NULL:終了日:End date',_SA],
  Hotel:[_U,'hotel_name:VARCHAR(255):NOT NULL:ホテル名:Hotel name','location:VARCHAR(255)::所在地:Location','star_rating:INTEGER::星評価:Star rating','price_per_night:DECIMAL(10,2)::1泊料金:Price per night',_SA],
  Flight:[_U,'airline:VARCHAR(255):NOT NULL:航空会社:Airline','flight_number:VARCHAR(20):NOT NULL:便名:Flight number','departure:VARCHAR(255):NOT NULL:出発地:Departure','arrival:VARCHAR(255):NOT NULL:到着地:Arrival','departure_time:TIMESTAMP:NOT NULL:出発時刻:Departure time','arrival_time:TIMESTAMP:NOT NULL:到着時刻:Arrival time','price:DECIMAL(10,2)::料金:Price'],
  // Insurance (2)
  Policy:[_U,'customer_id:UUID:FK(Customer) NOT NULL:顧客ID:Customer ID','policy_type:VARCHAR(100):NOT NULL:保険種別:Policy type','premium:DECIMAL(10,2):NOT NULL:保険料:Premium','coverage:DECIMAL(12,2)::補償額:Coverage','start_date:DATE:NOT NULL:開始日:Start date','end_date:DATE:NOT NULL:終了日:End date',_SA],
  Quote:[_U,'customer_id:UUID:FK(Customer) NOT NULL:顧客ID:Customer ID','policy_type:VARCHAR(100):NOT NULL:保険種別:Policy type','premium:DECIMAL(10,2):NOT NULL:見積保険料:Estimated premium','coverage:DECIMAL(12,2)::補償額:Coverage',_SP,'valid_until:DATE::有効期限:Valid until'],
  // ── Engineering field ──
  InspectionRecord:[_U,'equipment_id:UUID:FK(Equipment) NOT NULL:設備ID:Equipment ID','inspection_date:TIMESTAMP:DEFAULT NOW:点検日時:Inspection date','inspector_id:UUID:FK(User) NOT NULL:点検者ID:Inspector ID','result:VARCHAR(20):DEFAULT \'pass\':結果:Result','findings:TEXT::所見:Findings','next_due:DATE::次回予定:Next due',_N],
  AnomalyEvent:[_U,'equipment_id:UUID:FK(Equipment) NOT NULL:設備ID:Equipment ID','detected_at:TIMESTAMP:DEFAULT NOW:検知日時:Detected at','severity:VARCHAR(20):DEFAULT \'warning\':重要度:Severity','anomaly_type:VARCHAR(100)::異常種別:Anomaly type','value:DECIMAL(15,5)::測定値:Value','threshold:DECIMAL(15,5)::閾値:Threshold','resolved_at:TIMESTAMP::解決日時:Resolved at',_SP],
  InspectionSchedule:[_U,'equipment_id:UUID:FK(Equipment) NOT NULL:設備ID:Equipment ID','frequency:VARCHAR(50):NOT NULL:頻度:Frequency','next_due:DATE:NOT NULL:次回予定日:Next due','assigned_to:UUID:FK(User):担当者ID:Assigned to',_IA],
  SimulationModel:[_U,_T,_D,'model_type:VARCHAR(50)::モデル種別:Model type','parameters:JSONB::パラメータ:Parameters',_SA,'version:VARCHAR(20)::バージョン:Version'],
  SimResult:[_U,'model_id:UUID:FK(SimulationModel) NOT NULL:モデルID:Model ID','run_at:TIMESTAMP:DEFAULT NOW:実行日時:Run at','output:JSONB::出力:Output','status:VARCHAR(20):DEFAULT \'completed\':ステータス:Status','error:TEXT::エラー:Error','duration_ms:INT::実行時間ms:Duration ms'],
  SimInput:[_U,'model_id:UUID:FK(SimulationModel) NOT NULL:モデルID:Model ID',_T,'inputs:JSONB:NOT NULL:入力値:Inputs'],
  CADFile:[_U,_T,'file_url:TEXT:NOT NULL:ファイルURL:File URL','format:VARCHAR(20)::フォーマット:Format','version:VARCHAR(20)::バージョン:Version','project_id:UUID:FK(Project):プロジェクトID:Project ID',_SA,'file_size_mb:DECIMAL(8,2)::ファイルサイズMB:File size MB'],
  DesignReview:[_U,'cad_file_id:UUID:FK(CADFile) NOT NULL:CADファイルID:CAD file ID','reviewer_id:UUID:FK(User) NOT NULL:レビュアーID:Reviewer ID',_SP,'comments:TEXT::コメント:Comments','approved_at:TIMESTAMP::承認日時:Approved at'],
  QualityProcess:[_U,_T,_D,'process_type:VARCHAR(50)::プロセス種別:Process type',_IA,'standard:VARCHAR(100)::規格:Standard'],
  ProcessStep:['process_id:UUID:FK(QualityProcess) NOT NULL:プロセスID:Process ID',_T,_D,_SO,'acceptance_criteria:TEXT::合格基準:Acceptance criteria','duration_min:INT::所要時間(分):Duration min'],
  Defect:[_U,'product_id:VARCHAR(100)::製品ID:Product ID','defect_type:VARCHAR(100):NOT NULL:不具合種別:Defect type','severity:VARCHAR(20):DEFAULT \'minor\':重要度:Severity','location:TEXT::発生箇所:Location','detected_at:TIMESTAMP:DEFAULT NOW:検出日時:Detected at',_SP,'corrective_action:TEXT::是正処置:Corrective action'],
  // ── Science field ──
  ExperimentData:[_U,_T,_D,'experiment_type:VARCHAR(50)::実験種別:Experiment type','data:JSONB::データ:Data','measurement_unit:VARCHAR(50)::単位:Measurement unit','recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at'],
  ExperimentRun:[_U,_T,'experiment_type:VARCHAR(50)::実験種別:Experiment type','parameters:JSONB::パラメータ:Parameters','started_at:TIMESTAMP:NOT NULL:開始日時:Started at','ended_at:TIMESTAMP::終了日時:Ended at','status:VARCHAR(20):DEFAULT \'running\':ステータス:Status','result_summary:TEXT::結果概要:Result summary'],
  DataPoint:['source_id:UUID::ソースID:Source ID','source_type:VARCHAR(50)::ソース種別:Source type','x_value:DECIMAL(20,8)::X値:X value','y_value:DECIMAL(20,8)::Y値:Y value','z_value:DECIMAL(20,8)::Z値:Z value','label:VARCHAR(100)::ラベル:Label','recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at'],
  ResearchPaper:[_U,_T,'authors:JSONB:NOT NULL:著者:Authors','abstract:TEXT::アブストラクト:Abstract','doi:VARCHAR(100)::DOI:DOI','journal:VARCHAR(255)::掲載誌:Journal','published_year:INT::発行年:Published year','url:TEXT::URL:URL','keywords:JSONB::キーワード:Keywords'],
  PaperSummary:[_U,'paper_id:UUID:FK(ResearchPaper) NOT NULL:論文ID:Paper ID','summary:TEXT:NOT NULL:要約:Summary','key_findings:JSONB::主要発見:Key findings','model_used:VARCHAR(50)::使用モデル:Model used','generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'],
  MathFormula:[_U,_T,'latex:TEXT:NOT NULL:LaTeX:LaTeX','category:VARCHAR(50)::カテゴリ:Category','description:TEXT::説明:Description','is_verified:BOOLEAN:DEFAULT false:検証済:Verified','usage_context:TEXT::使用文脈:Usage context'],
  ObservationLog:[_U,_T,'location:VARCHAR(255)::観測地点:Location','observed_at:TIMESTAMP:NOT NULL:観測日時:Observed at','instrument:VARCHAR(100)::機器:Instrument','conditions:JSONB::観測条件:Conditions','raw_data:JSONB::生データ:Raw data'],
  // ── Agriculture field ──
  CropDiagnosis:[_U,'crop_id:UUID:FK(Crop) NOT NULL:作物ID:Crop ID','field_id:UUID:FK(Field) NOT NULL:圃場ID:Field ID','diagnosed_at:TIMESTAMP:DEFAULT NOW:診断日時:Diagnosed at','condition:VARCHAR(50):NOT NULL:状態:Condition','disease_id:VARCHAR(100)::病害ID:Disease ID','severity:VARCHAR(20):DEFAULT \'low\':重要度:Severity','recommendation:TEXT::推奨処置:Recommendation','image_url:TEXT::画像URL:Image URL'],
  WeatherForecast:[_U,'location:VARCHAR(255):NOT NULL:地点:Location','forecast_date:DATE:NOT NULL:予報日:Forecast date','temperature_max:DECIMAL(5,1)::最高気温:Temp max','temperature_min:DECIMAL(5,1)::最低気温:Temp min','precipitation_mm:DECIMAL(6,1)::降水量mm:Precipitation','humidity_pct:INT::湿度(%):Humidity','wind_speed:DECIMAL(5,1)::風速:Wind speed','source:VARCHAR(100)::データソース:Data source'],
  SoilAnalysis:[_U,'field_id:UUID:FK(Field) NOT NULL:圃場ID:Field ID','analyzed_at:TIMESTAMP:DEFAULT NOW:分析日時:Analyzed at','ph:DECIMAL(4,2)::pH:pH','nitrogen_ppm:DECIMAL(8,2)::窒素ppm:Nitrogen ppm','phosphorus_ppm:DECIMAL(8,2)::リン酸ppm:Phosphorus ppm','potassium_ppm:DECIMAL(8,2)::カリウムppm:Potassium ppm','organic_matter_pct:DECIMAL(5,2)::有機物(%):Organic matter','recommendation:TEXT::施肥推奨:Recommendation'],
  IrrigationSchedule:['field_id:UUID:FK(Field) NOT NULL:圃場ID:Field ID',_U,'day_of_week:INT::曜日(0-6):Day of week','start_time:TIME::開始時刻:Start time','duration_min:INT::時間(分):Duration min','volume_liters:DECIMAL(10,2)::水量L:Volume liters',_IA,'trigger_soil_moisture:DECIMAL(5,2)::土壌水分閾値:Trigger moisture'],
  // ── Medical field ──
  SymptomCheck:[_U,'patient_id:UUID:FK(Patient):患者ID:Patient ID','symptoms:JSONB:NOT NULL:症状:Symptoms','severity:VARCHAR(20):DEFAULT \'moderate\':重症度:Severity','ai_assessment:TEXT::AI評価:AI assessment','recommended_action:TEXT::推奨対応:Recommended action','checked_at:TIMESTAMP:DEFAULT NOW:チェック日時:Checked at'],
  DrugInteraction:[_U,'drug_a:VARCHAR(255):NOT NULL:薬剤A:Drug A','drug_b:VARCHAR(255):NOT NULL:薬剤B:Drug B','severity:VARCHAR(20):NOT NULL:重症度:Severity','mechanism:TEXT::相互作用機序:Mechanism','recommendation:TEXT::推奨事項:Recommendation','source:VARCHAR(255)::情報源:Source'],
  MedicalDocument:[_U,'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','doc_type:VARCHAR(50):NOT NULL:文書種別:Document type','content:TEXT::内容:Content','summary:TEXT::要約:Summary','file_url:TEXT::ファイルURL:File URL','created_at:TIMESTAMP:DEFAULT NOW:作成日時:Created at',_SA],
  RehabSession:[_U,'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','therapist_id:UUID:FK(User) NOT NULL:療法士ID:Therapist ID','session_date:DATE:NOT NULL:セッション日:Session date',_DUR,'exercises:JSONB::運動メニュー:Exercises','pain_level:INT::痛みレベル(0-10):Pain level','notes:TEXT::メモ:Notes'],
  RehabGoal:[_U,'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','goal_description:TEXT:NOT NULL:目標内容:Goal description','target_date:DATE::目標日:Target date','status:VARCHAR(20):DEFAULT \'in_progress\':状態:Status','progress_pct:INT:DEFAULT 0:進捗(%):Progress(%)','achieved_at:TIMESTAMP::達成日時:Achieved at'],
  // ── Social Science field ──
  LegalCase:[_U,'case_title:VARCHAR(255):NOT NULL:案件名:Case title','case_type:VARCHAR(100)::種別:Case type','client_id:UUID:FK(User):依頼者ID:Client ID','status:VARCHAR(20):DEFAULT \'open\':ステータス:Status','filed_at:TIMESTAMP::提出日:Filed at','jurisdiction:VARCHAR(100)::管轄:Jurisdiction',_N],
  MarketResearch:[_U,_T,_D,'industry:VARCHAR(100)::業種:Industry','methodology:VARCHAR(100)::調査手法:Methodology','sample_size:INT::サンプル数:Sample size','started_at:TIMESTAMP::開始日:Started at','completed_at:TIMESTAMP::完了日:Completed at',_SA],
  ResearchData:['research_id:UUID::調査ID:Research ID',_U,'data_type:VARCHAR(50):NOT NULL:データ種別:Data type','data:JSONB:NOT NULL:データ:Data','source:VARCHAR(255)::データソース:Data source','collected_at:TIMESTAMP:DEFAULT NOW:収集日時:Collected at'],
  FinancialReport:[_U,_T,'report_type:VARCHAR(50):NOT NULL:レポート種別:Report type','period_start:DATE:NOT NULL:期間開始:Period start','period_end:DATE:NOT NULL:期間終了:Period end','data:JSONB::財務データ:Financial data','generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at',_SA],
  SocialPost:['platform:VARCHAR(50):NOT NULL:プラットフォーム:Platform','post_id:VARCHAR(255):NOT NULL:投稿ID:Post ID','author:VARCHAR(255)::著者:Author','content:TEXT::投稿内容:Content','posted_at:TIMESTAMP::投稿日時:Posted at','likes:INT:DEFAULT 0:いいね数:Likes','shares:INT:DEFAULT 0:シェア数:Shares'],
  SentimentAnalysis:['post_id:VARCHAR(255)::投稿ID:Post ID',_U,'sentiment:VARCHAR(20):NOT NULL:感情:Sentiment','score:DECIMAL(5,4)::スコア:Score','topics:JSONB::トピック:Topics','analyzed_at:TIMESTAMP:DEFAULT NOW:分析日時:Analyzed at'],
  // ── Humanities field ──
  LiteratureSource:[_U,_T,'author:VARCHAR(255)::著者:Author','period:VARCHAR(100)::時代:Period','source_type:VARCHAR(50)::資料種別:Source type','language:VARCHAR(50)::言語:Language','transcription:TEXT::翻刻テキスト:Transcription','digitized_url:TEXT::デジタル化URL:Digitized URL'],
  TextAnalysis:[_U,'source_id:UUID:FK(LiteratureSource):文献ID:Source ID','analysis_type:VARCHAR(50):NOT NULL:分析種別:Analysis type','result:JSONB:NOT NULL:結果:Result','model_used:VARCHAR(50)::使用モデル:Model used','generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'],
  Translation:[_U,'source_text:TEXT:NOT NULL:原文:Source text','source_lang:VARCHAR(10):NOT NULL:原語:Source language','target_lang:VARCHAR(10):NOT NULL:対象言語:Target language','translated_text:TEXT:NOT NULL:訳文:Translated text','model_used:VARCHAR(50)::使用モデル:Model used','quality_score:DECIMAL(5,4)::品質スコア:Quality score'],
  TranslationSegment:['translation_id:UUID:FK(Translation) NOT NULL:翻訳ID:Translation ID','segment_index:INT:NOT NULL:セグメント番号:Segment index','source_segment:TEXT:NOT NULL:原文セグメント:Source segment','target_segment:TEXT:NOT NULL:訳文セグメント:Target segment','is_reviewed:BOOLEAN:DEFAULT false:レビュー済:Reviewed'],
  StyleReport:[_U,'content_id:UUID::コンテンツID:Content ID',_T,'metrics:JSONB:NOT NULL:指標:Metrics','suggestions:JSONB::改善提案:Suggestions','score:DECIMAL(5,2)::スコア:Score','generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'],
  Courseware:[_U,_T,_D,'subject:VARCHAR(100)::科目:Subject','target_level:VARCHAR(50)::対象レベル:Target level','content:TEXT::内容:Content','format:VARCHAR(50)::形式:Format',_SD,'language:VARCHAR(10):DEFAULT \'ja\':言語:Language'],
  // ── Education field ──
  LearningPlan:[_U,_T,_D,'subject:VARCHAR(100)::科目:Subject','target_date:DATE::目標日:Target date','daily_minutes:INT::1日学習時間(分):Daily minutes','status:VARCHAR(20):DEFAULT \'active\':ステータス:Status','ai_generated:BOOLEAN:DEFAULT false:AI生成:AI generated'],
  LearningGoal:[_U,'plan_id:UUID:FK(LearningPlan) NOT NULL:プランID:Plan ID',_T,'target_skill:VARCHAR(255)::目標スキル:Target skill','measurable_criteria:TEXT::測定基準:Measurable criteria','deadline:DATE::期限:Deadline','achieved_at:TIMESTAMP::達成日時:Achieved at','progress_pct:INT:DEFAULT 0:進捗(%):Progress(%)'],
  QuizResult:[_U,'quiz_id:UUID:FK(Quiz) NOT NULL:クイズID:Quiz ID','score:INT:NOT NULL:スコア:Score','max_score:INT:NOT NULL:満点:Max score','answers:JSONB::回答:Answers','taken_at:TIMESTAMP:DEFAULT NOW:受験日時:Taken at','time_taken_sec:INT::所要時間(秒):Time taken'],
  StudySession:[_U,'subject:VARCHAR(100):NOT NULL:科目:Subject','started_at:TIMESTAMP:NOT NULL:開始日時:Started at','ended_at:TIMESTAMP::終了日時:Ended at','duration_min:INT::学習時間(分):Duration min','focus_score:INT::集中スコア:Focus score','notes:TEXT::メモ:Notes'],
  // ── Art & Design field ──
  ArtWork:[_U,_T,'artist_id:UUID:FK(User) NOT NULL:作家ID:Artist ID','medium:VARCHAR(100)::制作手法:Medium','year_created:INT::制作年:Year created','image_url:TEXT::画像URL:Image url','style_tags:JSONB::スタイルタグ:Style tags',_SA,'price:DECIMAL(10,2)::価格:Price'],
  GeneratedImage:[_U,'prompt:TEXT:NOT NULL:プロンプト:Prompt','model:VARCHAR(50):NOT NULL:使用モデル:Model','image_url:TEXT:NOT NULL:画像URL:Image URL','style_preset_id:UUID:FK(StylePreset):スタイルID:Style preset ID','generation_params:JSONB::生成パラメータ:Generation params','generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'],
  StylePreset:[_U,_T,_D,'prompt_fragment:TEXT::プロンプト断片:Prompt fragment','negative_prompt:TEXT::ネガティブプロンプト:Negative prompt','preview_url:TEXT::プレビューURL:Preview URL','is_public:BOOLEAN:DEFAULT false:公開:Public','usage_count:INT:DEFAULT 0:使用回数:Usage count'],
  MusicTrack:[_U,_T,'genre:VARCHAR(50)::ジャンル:Genre','duration_sec:INT::長さ(秒):Duration sec','bpm:INT::BPM:BPM','key_signature:VARCHAR(10)::調:Key','file_url:TEXT::ファイルURL:File URL','model_used:VARCHAR(50)::使用モデル:Model used','status:VARCHAR(20):DEFAULT \'draft\':ステータス:Status'],
  Arrangement:[_U,'track_id:UUID:FK(MusicTrack) NOT NULL:トラックID:Track ID',_T,'description:TEXT::説明:Description','instruments:JSONB::楽器:Instruments','score_url:TEXT::楽譜URL:Score URL',_SA],
  PortfolioItem:[_U,'artwork_id:UUID:FK(ArtWork):作品ID:Artwork ID',_T,'item_type:VARCHAR(50)::種別:Item type','media_url:TEXT:NOT NULL:メディアURL:Media URL','description:TEXT::説明:Description',_SO,'is_featured:BOOLEAN:DEFAULT false:フィーチャー:Featured'],
  // ── Interdisciplinary field ──
  KnowledgeItem:[_U,_T,'content:TEXT:NOT NULL:内容:Content',_CAT,'source_url:TEXT::出典URL:Source URL','tags:JSONB::タグ:Tags','embedding:JSONB::埋め込み:Embedding','is_verified:BOOLEAN:DEFAULT false:検証済:Verified'],
  ResearchQuery:[_U,'query:TEXT:NOT NULL:検索クエリ:Query','domain:VARCHAR(50)::分野:Domain','results:JSONB::結果:Results','sources_count:INT:DEFAULT 0:ソース数:Sources count','answered_at:TIMESTAMP::回答日時:Answered at','status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status'],
  Community:[_U,'community_name:VARCHAR(255):NOT NULL:コミュニティ名:Community name','description:TEXT::説明:Description','is_private:BOOLEAN:DEFAULT false:非公開:Private','member_count:INT:DEFAULT 0:メンバー数:Member count',_SA],
  // ── Environment/Energy field ──
  CarbonEmission:[_U,'source_type:VARCHAR(50):NOT NULL:排出源種別:Source type','scope:INT:DEFAULT 1:スコープ(1-3):Scope','amount_kg_co2e:DECIMAL(12,4):NOT NULL:排出量kgCO2e:Amount kg CO2e','period_start:DATE:NOT NULL:期間開始:Period start','period_end:DATE:NOT NULL:期間終了:Period end','calculation_method:VARCHAR(100)::算定方法:Calculation method'],
  EnergyAsset:[_U,'asset_name:VARCHAR(255):NOT NULL:資産名:Asset name','asset_type:VARCHAR(50):NOT NULL:種別:Asset type','capacity_kw:DECIMAL(10,2)::定格出力kW:Capacity kW','location:VARCHAR(255)::設置場所:Location',_SA,'installation_date:DATE::設置日:Installation date'],
  EnvAssessment:[_U,_T,_D,'project_id:UUID:FK(Project):プロジェクトID:Project ID','assessment_type:VARCHAR(50)::評価種別:Assessment type','findings:JSONB::調査結果:Findings',_SP,'reviewed_at:TIMESTAMP::審査日:Reviewed at','reviewer_id:UUID:FK(User):審査者ID:Reviewer ID'],
  ESGReport:[_U,_T,'fiscal_year:INT:NOT NULL:会計年度:Fiscal year','environmental_score:DECIMAL(5,2)::E(環境)スコア:E score','social_score:DECIMAL(5,2)::S(社会)スコア:S score','governance_score:DECIMAL(5,2)::G(ガバナンス)スコア:G score','data:JSONB::ESGデータ:ESG data','published_at:TIMESTAMP::公開日時:Published at',_SA],
  RenewableSource:[_U,'source_name:VARCHAR(255):NOT NULL:電源名:Source name','source_type:VARCHAR(50):NOT NULL:再エネ種別:Source type','capacity_kw:DECIMAL(10,2):NOT NULL:出力kW:Capacity kW','location:VARCHAR(255)::設置場所:Location','installed_at:DATE::設置日:Installed at',_SA,'forecast_accuracy:DECIMAL(5,2)::予測精度(%):Forecast accuracy'],
  // ── Architecture/Urban Planning field ──
  BIMModel:[_U,_T,'project_id:UUID:FK(Project):プロジェクトID:Project ID','file_url:TEXT:NOT NULL:ファイルURL:File URL','format:VARCHAR(20)::フォーマット:Format','version:VARCHAR(20)::バージョン:Version','lod:INT::LOD(0-500):LOD','element_count:INT::要素数:Element count'],
  BuildingElement:['bim_model_id:UUID:FK(BIMModel) NOT NULL:BIMモデルID:BIM model ID','element_type:VARCHAR(50):NOT NULL:要素種別:Element type','ifc_guid:VARCHAR(50):UNIQUE:IFC GUID:IFC GUID','properties:JSONB::プロパティ:Properties',_M],
  ZoningCheck:[_U,'location:TEXT:NOT NULL:場所:Location','latitude:DECIMAL(10,7)::緯度:Latitude','longitude:DECIMAL(10,7)::経度:Longitude','zone_type:VARCHAR(100)::用途地域:Zone type','building_coverage:DECIMAL(5,2)::建蔽率(%):Building coverage','floor_area_ratio:DECIMAL(5,2)::容積率(%):Floor area ratio','applicable_regulations:JSONB::適用法規:Applicable regulations','checked_at:TIMESTAMP:DEFAULT NOW:確認日時:Checked at'],
  UrbanModel:[_U,_T,_D,'area_name:VARCHAR(255)::地区名:Area name','geometry:JSONB::ジオメトリ:Geometry','simulation_type:VARCHAR(50)::シミュレーション種別:Simulation type','parameters:JSONB::パラメータ:Parameters',_SA],
  PropertyValuation:[_U,'property_id:UUID:FK(Property) NOT NULL:物件ID:Property ID','valuation_date:DATE:NOT NULL:評価日:Valuation date','estimated_value:DECIMAL(14,2):NOT NULL:推定価値:Estimated value','method:VARCHAR(50)::評価方法:Method','comparable_data:JSONB::比較データ:Comparable data','confidence:VARCHAR(20)::信頼度:Confidence'],
  // ── Sports/Athletics field ──
  Athlete:[_U,'athlete_name:VARCHAR(255):NOT NULL:アスリート名:Athlete name','sport:VARCHAR(50):NOT NULL:競技:Sport','position:VARCHAR(100)::ポジション:Position','date_of_birth:DATE::生年月日:Date of birth','team_id:VARCHAR(100)::チームID:Team ID',_SA,'height_cm:INT::身長cm:Height cm','weight_kg:DECIMAL(5,1)::体重kg:Weight kg'],
  PerformanceLog:[_U,'athlete_id:UUID:FK(Athlete) NOT NULL:アスリートID:Athlete ID','recorded_at:TIMESTAMP:DEFAULT NOW:記録日時:Recorded at','metrics:JSONB:NOT NULL:パフォーマンス指標:Metrics','event:VARCHAR(100)::競技種目:Event','conditions:JSONB::コンディション:Conditions',_N],
  InjuryReport:[_U,'athlete_id:UUID:FK(Athlete) NOT NULL:アスリートID:Athlete ID','injury_type:VARCHAR(100):NOT NULL:怪我種別:Injury type','body_part:VARCHAR(100)::部位:Body part','severity:VARCHAR(20):DEFAULT \'minor\':重症度:Severity','occurred_at:TIMESTAMP:DEFAULT NOW:受傷日時:Occurred at','expected_recovery_days:INT::回復予定日数:Recovery days',_SP,'doctor_id:UUID:FK(User):担当医ID:Doctor ID'],
  TrainingPlan:[_U,'athlete_id:UUID:FK(Athlete) NOT NULL:アスリートID:Athlete ID',_T,_D,'start_date:DATE:NOT NULL:開始日:Start date','end_date:DATE::終了日:End date','sessions:JSONB::セッション計画:Sessions',_SA,'coach_id:UUID:FK(User):コーチID:Coach ID'],
  GameEvent:[_U,'event_name:VARCHAR(255):NOT NULL:大会名:Event name','sport:VARCHAR(50)::競技:Sport','venue_id:UUID:FK(Venue):会場ID:Venue ID','starts_at:TIMESTAMP:NOT NULL:開始日時:Starts at','ends_at:TIMESTAMP:NOT NULL:終了日時:Ends at','capacity:INT::定員:Capacity',_SA],
  StadiumEvent:[_U,'event_name:VARCHAR(255):NOT NULL:イベント名:Event name','venue_id:UUID:FK(Venue) NOT NULL:会場ID:Venue ID','starts_at:TIMESTAMP:NOT NULL:開始日時:Starts at','ticket_price:DECIMAL(10,2)::チケット料金:Ticket price','total_tickets:INT::総チケット数:Total tickets','sold_tickets:INT:DEFAULT 0:販売済:Sold tickets',_SA],
  Coach:[_U,'coach_name:VARCHAR(255):NOT NULL:コーチ名:Coach name','sport:VARCHAR(50)::担当競技:Sport','certification:TEXT::資格:Certification','is_available:BOOLEAN:DEFAULT true:対応可能:Available','rating:DECIMAL(3,2)::評価:Rating'],
  // ── Welfare/Care field ──
  CarePlan:[_U,'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','care_type:VARCHAR(50):NOT NULL:ケア種別:Care type','goals:JSONB::目標:Goals','services:JSONB::サービス内容:Services','started_at:DATE:NOT NULL:開始日:Started at','reviewed_at:DATE::見直し日:Reviewed at',_SA,'care_manager_id:UUID:FK(User):ケアマネージャーID:Care manager ID'],
  CareActivity:[_U,'care_plan_id:UUID:FK(CarePlan) NOT NULL:ケアプランID:Care plan ID','patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','activity_type:VARCHAR(50):NOT NULL:活動種別:Activity type','performed_at:TIMESTAMP:DEFAULT NOW:実施日時:Performed at',_DUR,'notes:TEXT::メモ:Notes','caregiver_id:UUID:FK(User):介護者ID:Caregiver ID'],
  CognitionTest:[_U,'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','test_type:VARCHAR(50):NOT NULL:検査種別:Test type','score:INT:NOT NULL:スコア:Score','max_score:INT:NOT NULL:満点:Max score','tested_at:TIMESTAMP:DEFAULT NOW:検査日時:Tested at','evaluator_id:UUID:FK(User):評価者ID:Evaluator ID',_N],
  MonitoringAlert:[_U,'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type','severity:VARCHAR(20):DEFAULT \'warning\':重要度:Severity','message:TEXT:NOT NULL:メッセージ:Message','triggered_at:TIMESTAMP:DEFAULT NOW:発生日時:Triggered at','acknowledged_at:TIMESTAMP::確認日時:Acknowledged at','responder_id:UUID:FK(User):対応者ID:Responder ID'],
  EmploymentMatch:[_U,'job_seeker_id:UUID:FK(User) NOT NULL:求職者ID:Job seeker ID','employer_id:UUID:FK(User) NOT NULL:雇用者ID:Employer ID','match_score:DECIMAL(5,2)::マッチスコア:Match score','status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status','matched_at:TIMESTAMP:DEFAULT NOW:マッチ日時:Matched at','job_title:VARCHAR(255)::職種:Job title','support_type:VARCHAR(100)::支援種別:Support type'],
  CareRecord:[_U,'patient_id:UUID:FK(Patient) NOT NULL:患者ID:Patient ID','caregiver_id:UUID:FK(User) NOT NULL:介護者ID:Caregiver ID','record_date:TIMESTAMP:DEFAULT NOW:記録日時:Record date','record_type:VARCHAR(50):NOT NULL:記録種別:Record type','content:TEXT:NOT NULL:内容:Content','vital_signs:JSONB::バイタルサイン:Vital signs'],
  // ── Tourism/Hospitality field ──
  Attraction:['attraction_name:VARCHAR(255):NOT NULL:観光スポット名:Attraction name','location:TEXT::場所:Location','latitude:DECIMAL(10,7)::緯度:Latitude','longitude:DECIMAL(10,7)::経度:Longitude','category:VARCHAR(50)::カテゴリ:Category',_D,'image_url:TEXT::画像URL:Image URL','rating:DECIMAL(3,2)::評価:Rating',_SA],
  TravelPlan:[_U,_T,'destination:VARCHAR(255):NOT NULL:目的地:Destination','start_date:DATE:NOT NULL:開始日:Start date','end_date:DATE:NOT NULL:終了日:End date','budget:DECIMAL(10,2)::予算:Budget','plan_data:JSONB::プラン詳細:Plan data','ai_generated:BOOLEAN:DEFAULT false:AI生成:AI generated'],
  TourismStats:['region:VARCHAR(255):NOT NULL:地域:Region','period:DATE:NOT NULL:集計期間:Period','visitor_count:INT::訪問者数:Visitor count','revenue_jpy:DECIMAL(14,2)::観光消費額:Revenue','avg_stay_days:DECIMAL(5,2)::平均滞在日数:Avg stay days','top_attractions:JSONB::人気スポット:Top attractions','source:VARCHAR(100)::データソース:Data source'],
  HotelOperation:[_U,'hotel_id:UUID:FK(Hotel) NOT NULL:ホテルID:Hotel ID','date:DATE:NOT NULL:日付:Date','occupancy_rate:DECIMAL(5,2)::稼働率(%):Occupancy rate','revenue:DECIMAL(12,2)::売上:Revenue','checkins:INT::チェックイン数:Checkins','checkouts:INT::チェックアウト数:Checkouts','staff_count:INT::スタッフ数:Staff count'],
  ConciergeBotSession:[_U,'language:VARCHAR(10):DEFAULT \'ja\':言語:Language','messages:JSONB::メッセージ履歴:Messages','topic:VARCHAR(100)::トピック:Topic','satisfaction_score:INT::満足度:Satisfaction','started_at:TIMESTAMP:DEFAULT NOW:開始日時:Started at','ended_at:TIMESTAMP::終了日時:Ended at'],
  // ── Biotech/LifeScience ──
  Compound:[_U,'compound_name:VARCHAR(255):NOT NULL:化合物名:Compound name','smiles:TEXT::SMILES:SMILES','molecular_formula:VARCHAR(100)::分子式:Molecular formula','molecular_weight:DECIMAL(10,4)::分子量:Molecular weight','source:VARCHAR(100)::由来:Source',_SA,'properties:JSONB::物性:Properties'],
  MolecularTarget:[_U,_T,'target_type:VARCHAR(50)::ターゲット種別:Target type','gene_name:VARCHAR(100)::遺伝子名:Gene name','protein_name:VARCHAR(255)::タンパク質名:Protein name','disease_area:VARCHAR(100)::疾患領域:Disease area',_D],
  BindingResult:[_U,'compound_id:UUID:FK(Compound) NOT NULL:化合物ID:Compound ID','target_id:UUID:FK(MolecularTarget) NOT NULL:ターゲットID:Target ID','binding_affinity:DECIMAL(15,6)::結合親和性:Binding affinity','ic50:DECIMAL(15,6)::IC50:IC50','assay_type:VARCHAR(100)::アッセイ種別:Assay type','tested_at:TIMESTAMP:DEFAULT NOW:試験日:Tested at',_N],
  GenomeSample:[_U,'sample_id:VARCHAR(100):UNIQUE NOT NULL:サンプルID:Sample ID','species:VARCHAR(100)::種:Species','tissue_type:VARCHAR(100)::組織種別:Tissue type','collection_date:DATE::採取日:Collection date','quality_score:DECIMAL(5,2)::品質スコア:Quality score','sequencing_platform:VARCHAR(100)::シーケンサー:Sequencing platform',_SA],
  VariantCall:[_U,'sample_id:UUID:FK(GenomeSample) NOT NULL:サンプルID:Sample ID','chromosome:VARCHAR(20)::染色体:Chromosome','position:BIGINT::位置:Position','ref_allele:VARCHAR(255)::参照アリル:Ref allele','alt_allele:VARCHAR(255)::変異アリル:Alt allele','quality:DECIMAL(8,2)::品質スコア:Quality','impact:VARCHAR(20)::影響度:Impact'],
  GeneticRisk:[_U,'sample_id:UUID:FK(GenomeSample) NOT NULL:サンプルID:Sample ID','disease:VARCHAR(255):NOT NULL:疾患:Disease','risk_score:DECIMAL(5,4):NOT NULL:リスクスコア:Risk score','percentile:INT::パーセンタイル:Percentile','variants_count:INT::関連変異数:Variants count','calculated_at:TIMESTAMP:DEFAULT NOW:算出日時:Calculated at'],
  ClinicalTrial:[_U,_T,_D,'phase:VARCHAR(20):NOT NULL:フェーズ:Phase','compound_id:UUID:FK(Compound):化合物ID:Compound ID','indication:VARCHAR(255)::適応症:Indication','start_date:DATE::開始日:Start date','end_date:DATE::終了日:End date','status:VARCHAR(20):DEFAULT \'recruiting\':ステータス:Status','sponsor:VARCHAR(255)::スポンサー:Sponsor'],
  TrialSubject:[_U,'trial_id:UUID:FK(ClinicalTrial) NOT NULL:試験ID:Trial ID','subject_code:VARCHAR(50):UNIQUE:被験者コード:Subject code','enrolled_at:TIMESTAMP:DEFAULT NOW:登録日時:Enrolled at','arm:VARCHAR(50)::群:Arm',_SA,'age:INT::年齢:Age','gender:VARCHAR(20)::性別:Gender'],
  AdverseEvent:[_U,'trial_id:UUID:FK(ClinicalTrial) NOT NULL:試験ID:Trial ID','subject_id:UUID:FK(TrialSubject) NOT NULL:被験者ID:Subject ID','event_name:VARCHAR(255):NOT NULL:有害事象名:Event name','severity:VARCHAR(20):NOT NULL:重症度:Severity','onset_date:DATE:NOT NULL:発現日:Onset date','resolved_date:DATE::回復日:Resolved date','causality:VARCHAR(50)::因果関係:Causality'],
  ProteinStructure:[_U,'protein_name:VARCHAR(255):NOT NULL:タンパク質名:Protein name','pdb_id:VARCHAR(10)::PDB ID:PDB ID','sequence:TEXT::アミノ酸配列:Sequence','structure_url:TEXT::構造ファイルURL:Structure file URL','resolution_angstrom:DECIMAL(5,2)::分解能Å:Resolution','method:VARCHAR(100)::決定方法:Method'],
  OmicsDataset:[_U,_T,'omics_type:VARCHAR(50):NOT NULL:オミクス種別:Omics type','sample_count:INT::サンプル数:Sample count','feature_count:INT::フィーチャー数:Feature count','platform:VARCHAR(100)::プラットフォーム:Platform','data_url:TEXT::データURL:Data URL','processed:BOOLEAN:DEFAULT false:処理済:Processed'],
  BioAnalysis:[_U,'dataset_id:UUID:FK(OmicsDataset):データセットID:Dataset ID',_T,'analysis_type:VARCHAR(50):NOT NULL:解析種別:Analysis type','parameters:JSONB::パラメータ:Parameters','results:JSONB::結果:Results','status:VARCHAR(20):DEFAULT \'pending\':ステータス:Status','completed_at:TIMESTAMP::完了日時:Completed at'],
  // ── Mobility/Autonomous ──
  DrivingSession:[_U,'vehicle_id:VARCHAR(100)::車両ID:Vehicle ID','started_at:TIMESTAMP:NOT NULL:開始日時:Started at','ended_at:TIMESTAMP::終了日時:Ended at','distance_km:DECIMAL(10,3)::走行距離km:Distance km','route:JSONB::経路:Route','mode:VARCHAR(20):DEFAULT \'manual\':走行モード:Mode','events:JSONB::イベント:Events'],
  SimScenario:[_U,_T,_D,'scenario_type:VARCHAR(50)::シナリオ種別:Scenario type','parameters:JSONB::パラメータ:Parameters','difficulty:VARCHAR(20)::難易度:Difficulty',_IA],
  SafetyEval:[_U,'session_id:UUID:FK(DrivingSession):セッションID:Session ID','scenario_id:UUID:FK(SimScenario):シナリオID:Scenario ID','metric:VARCHAR(100):NOT NULL:評価指標:Metric','score:DECIMAL(5,2):NOT NULL:スコア:Score','details:JSONB::詳細:Details','evaluated_at:TIMESTAMP:DEFAULT NOW:評価日時:Evaluated at'],
  TrafficSignal:[_U,'intersection_id:VARCHAR(100):NOT NULL:交差点ID:Intersection ID','location:TEXT::場所:Location','latitude:DECIMAL(10,7)::緯度:Latitude','longitude:DECIMAL(10,7)::経度:Longitude','phase_plan:JSONB::信号現示計画:Phase plan',_SA,'last_sync:TIMESTAMP::最終同期:Last sync'],
  TrafficSensor:[_U,'sensor_id:VARCHAR(100):NOT NULL:センサーID:Sensor ID','location:TEXT::設置場所:Location','sensor_type:VARCHAR(50)::種別:Sensor type',_SA,'vehicle_count:INT:DEFAULT 0:通過台数:Vehicle count'],
  TrafficModel:[_U,_T,_D,'area:JSONB::対象エリア:Area','algorithm:VARCHAR(100)::アルゴリズム:Algorithm','parameters:JSONB::パラメータ:Parameters',_SA,'trained_at:TIMESTAMP::学習日時:Trained at'],
  ChargeStation:[_U,'station_name:VARCHAR(255):NOT NULL:充電スタンド名:Station name','location:TEXT::場所:Location','latitude:DECIMAL(10,7)::緯度:Latitude','longitude:DECIMAL(10,7)::経度:Longitude','charger_count:INT:NOT NULL:充電器数:Charger count','max_kw:DECIMAL(8,2)::最大出力kW:Max kW',_SA,'operator_id:UUID:FK(User):運営者ID:Operator ID'],
  ChargeSession:[_U,'station_id:UUID:FK(ChargeStation) NOT NULL:スタンドID:Station ID','ev_id:UUID:FK(EVBattery):EV ID:EV ID','started_at:TIMESTAMP:NOT NULL:開始日時:Started at','ended_at:TIMESTAMP::終了日時:Ended at','energy_kwh:DECIMAL(8,3)::充電量kWh:Energy kWh','cost:DECIMAL(10,2)::料金:Cost',_SA],
  EVBattery:[_U,'vehicle_id:VARCHAR(100):NOT NULL:車両ID:Vehicle ID','capacity_kwh:DECIMAL(8,2):NOT NULL:容量kWh:Capacity kWh','current_soc_pct:DECIMAL(5,2)::現在SOC(%):Current SOC','health_pct:DECIMAL(5,2)::バッテリー健全性(%):Battery health','chemistry:VARCHAR(50)::電池化学:Chemistry','last_updated:TIMESTAMP:DEFAULT NOW:最終更新:Last updated'],
  TripPlan:[_U,'origin:TEXT:NOT NULL:出発地:Origin','destination:TEXT:NOT NULL:目的地:Destination','departure_time:TIMESTAMP:NOT NULL:出発時刻:Departure time','modes:JSONB::交通手段:Modes','route_segments:JSONB::ルートセグメント:Route segments','total_duration_min:INT::総所要時間(分):Total duration','total_cost:DECIMAL(10,2)::総費用:Total cost'],
  TransitOption:['trip_plan_id:UUID:FK(TripPlan) NOT NULL:TripプランID:Trip plan ID','mode:VARCHAR(50):NOT NULL:交通手段:Mode','line:VARCHAR(100)::路線:Line','departure:TEXT::出発:Departure','arrival:TEXT::到着:Arrival','duration_min:INT::所要時間(分):Duration min','cost:DECIMAL(10,2)::料金:Cost',_SO],
  MobilityPass:[_U,'pass_type:VARCHAR(50):NOT NULL:パス種別:Pass type','valid_from:DATE:NOT NULL:有効開始:Valid from','valid_until:DATE:NOT NULL:有効終了:Valid until','modes_included:JSONB::対象交通手段:Modes included','balance:DECIMAL(10,2)::残高:Balance',_SA,'stripe_subscription_id:TEXT::StripeサブスクID:Stripe sub ID'],
  // ── Cybersecurity ──
  ThreatAlert:[_U,'alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type','severity:VARCHAR(20):DEFAULT \'medium\':重要度:Severity','source_ip:VARCHAR(45)::送信元IP:Source IP','destination_ip:VARCHAR(45)::宛先IP:Dest IP','description:TEXT::説明:Description','detected_at:TIMESTAMP:DEFAULT NOW:検知日時:Detected at','acknowledged_at:TIMESTAMP::確認日時:Acknowledged at',_SP],
  SecurityIncident:[_U,_T,_D,'incident_type:VARCHAR(50):NOT NULL:インシデント種別:Incident type','severity:VARCHAR(20):DEFAULT \'medium\':重要度:Severity','reported_at:TIMESTAMP:DEFAULT NOW:報告日時:Reported at','resolved_at:TIMESTAMP::解決日時:Resolved at','affected_systems:JSONB::影響システム:Affected systems',_SP,'assigned_to:UUID:FK(User):担当者ID:Assigned to'],
  IncidentResponse:[_U,'incident_id:UUID:FK(SecurityIncident) NOT NULL:インシデントID:Incident ID','action_type:VARCHAR(50):NOT NULL:対応種別:Action type','description:TEXT:NOT NULL:内容:Description','performed_at:TIMESTAMP:DEFAULT NOW:実施日時:Performed at','outcome:TEXT::結果:Outcome','responder_id:UUID:FK(User):対応者ID:Responder ID'],
  VulnScan:[_U,'target:VARCHAR(500):NOT NULL:対象:Target','scan_type:VARCHAR(50):NOT NULL:スキャン種別:Scan type','started_at:TIMESTAMP:NOT NULL:開始日時:Started at','completed_at:TIMESTAMP::完了日時:Completed at','findings:JSONB::発見事項:Findings','critical_count:INT:DEFAULT 0:クリティカル数:Critical count','high_count:INT:DEFAULT 0:高リスク数:High count',_SA],
  PenTestReport:[_U,_T,'scope:TEXT:NOT NULL:スコープ:Scope','methodology:TEXT::手法:Methodology','findings:JSONB:NOT NULL:発見事項:Findings','risk_rating:VARCHAR(20)::リスク評価:Risk rating','executive_summary:TEXT::エグゼクティブサマリー:Executive summary','tested_at:TIMESTAMP:NOT NULL:実施日:Tested at','report_url:TEXT::レポートURL:Report URL'],
  RemediationTask:[_U,'vuln_scan_id:UUID:FK(VulnScan):スキャンID:Vuln scan ID','title:VARCHAR(255):NOT NULL:タイトル:Title','description:TEXT::説明:Description','severity:VARCHAR(20)::重要度:Severity','due_date:DATE::期限:Due date',_SP,'assigned_to:UUID:FK(User):担当者ID:Assigned to','completed_at:TIMESTAMP::完了日時:Completed at'],
  PhishingCampaign:[_U,_T,_D,'campaign_type:VARCHAR(50):NOT NULL:キャンペーン種別:Campaign type','target_count:INT::対象者数:Target count','sent_count:INT:DEFAULT 0:送信数:Sent count','clicked_count:INT:DEFAULT 0:クリック数:Clicked count','reported_count:INT:DEFAULT 0:報告数:Reported count','launched_at:TIMESTAMP::実施日時:Launched at',_SA],
  SecurityTraining:[_U,'trainee_id:UUID:FK(User) NOT NULL:受講者ID:Trainee ID','course_name:VARCHAR(255):NOT NULL:コース名:Course name','completed_at:TIMESTAMP::完了日時:Completed at','score:INT::スコア:Score','certificate_url:TEXT::証明書URL:Certificate URL',_SA],
  SecurityPolicy:[_U,_T,'policy_type:VARCHAR(50)::ポリシー種別:Policy type','content:TEXT:NOT NULL:内容:Content','version:VARCHAR(20)::バージョン:Version','effective_date:DATE:NOT NULL:施行日:Effective date','review_date:DATE::見直し日:Review date',_SA,'owner_id:UUID:FK(User):オーナーID:Owner ID'],
  ComplianceGap:[_U,'framework:VARCHAR(100):NOT NULL:フレームワーク:Framework','control_id:VARCHAR(100)::統制ID:Control ID','description:TEXT:NOT NULL:説明:Description','gap_type:VARCHAR(50)::ギャップ種別:Gap type','severity:VARCHAR(20):DEFAULT \'medium\':重要度:Severity',_SP,'remediation_plan:TEXT::是正計画:Remediation plan','due_date:DATE::期限:Due date'],
  // ── Fintech Field ──
  CreditApplication:[_U,'applicant_id:UUID:FK(User) NOT NULL:申請者ID:Applicant ID','product_type:VARCHAR(50):NOT NULL:商品種別:Product type','requested_amount:DECIMAL(12,2):NOT NULL:申請金額:Requested amount','purpose:VARCHAR(255)::目的:Purpose','applied_at:TIMESTAMP:DEFAULT NOW:申請日時:Applied at',_SP,'assigned_reviewer:UUID:FK(User):審査担当者ID:Assigned reviewer'],
  CreditScore:[_U,'applicant_id:UUID:FK(User) NOT NULL:申請者ID:Applicant ID','score:INT:NOT NULL:スコア:Score','grade:VARCHAR(5)::グレード:Grade','factors:JSONB::要因:Factors','model_version:VARCHAR(20)::モデルバージョン:Model version','calculated_at:TIMESTAMP:DEFAULT NOW:算出日時:Calculated at','expires_at:TIMESTAMP::有効期限:Expires at'],
  CreditDecision:[_U,'application_id:UUID:FK(CreditApplication) NOT NULL:申請ID:Application ID','decision:VARCHAR(20):NOT NULL:判定:Decision','approved_amount:DECIMAL(12,2)::承認金額:Approved amount','interest_rate:DECIMAL(5,4)::金利:Interest rate','reason:TEXT::理由:Reason','decided_at:TIMESTAMP:DEFAULT NOW:判定日時:Decided at','decided_by:UUID:FK(User):判定者ID:Decided by'],
  FraudAlert:[_U,'transaction_id:VARCHAR(255)::取引ID:Transaction ID','alert_type:VARCHAR(50):NOT NULL:アラート種別:Alert type','risk_score:DECIMAL(5,4):NOT NULL:リスクスコア:Risk score','amount:DECIMAL(12,2)::金額:Amount','triggered_at:TIMESTAMP:DEFAULT NOW:検知日時:Triggered at',_SP,'reviewed_by:UUID:FK(User):審査者ID:Reviewed by','false_positive:BOOLEAN::誤検知:False positive'],
  SARReport:[_U,'reference_number:VARCHAR(100):UNIQUE:参照番号:Reference number','subject_type:VARCHAR(50):NOT NULL:対象種別:Subject type','suspicious_activity:TEXT:NOT NULL:疑わしい活動:Suspicious activity','amount:DECIMAL(14,2)::金額:Amount','reported_at:TIMESTAMP:DEFAULT NOW:報告日時:Reported at',_SP,'submitted_to:VARCHAR(100)::提出先:Submitted to'],
  CryptoPortfolio:[_U,'wallet_address:VARCHAR(255)::ウォレットアドレス:Wallet address','chain:VARCHAR(50):NOT NULL:チェーン:Chain','total_value_usd:DECIMAL(14,4)::総額USD:Total value USD','holdings:JSONB::保有資産:Holdings','last_updated:TIMESTAMP:DEFAULT NOW:最終更新:Last updated'],
  DeFiPosition:[_U,'portfolio_id:UUID:FK(CryptoPortfolio) NOT NULL:ポートフォリオID:Portfolio ID','protocol:VARCHAR(100):NOT NULL:プロトコル:Protocol','position_type:VARCHAR(50)::ポジション種別:Position type','assets:JSONB::資産:Assets','apr:DECIMAL(8,4)::APR(%):APR','health_factor:DECIMAL(8,4)::健全性指標:Health factor','last_updated:TIMESTAMP:DEFAULT NOW:最終更新:Last updated'],
  SmartContractAudit:[_U,'contract_address:VARCHAR(255)::コントラクトアドレス:Contract address','chain:VARCHAR(50)::チェーン:Chain',_T,'findings:JSONB::発見事項:Findings','severity_summary:JSONB::重要度サマリー:Severity summary','audited_at:TIMESTAMP:NOT NULL:監査日:Audited at','report_url:TEXT::レポートURL:Report URL',_SA],
  FinancialPlan:[_U,_T,_D,'income:DECIMAL(12,2)::年収:Income','expenses:DECIMAL(12,2)::年間支出:Expenses','savings_goal:DECIMAL(12,2)::貯蓄目標:Savings goal','investment_goal:DECIMAL(12,2)::投資目標:Investment goal','plan_data:JSONB::プラン詳細:Plan data',_SA],
  InvestmentAdvice:[_U,'plan_id:UUID:FK(FinancialPlan):プランID:Financial plan ID','asset_class:VARCHAR(100):NOT NULL:資産クラス:Asset class','allocation_pct:DECIMAL(5,2):NOT NULL:配分(%):Allocation','rationale:TEXT::根拠:Rationale','risk_level:VARCHAR(20)::リスク水準:Risk level','generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'],
  // ── Smart Factory/Manufacturing DX ──
  DigitalTwinModel:[_U,_T,_D,'entity_type:VARCHAR(50):NOT NULL:エンティティ種別:Entity type','physical_id:VARCHAR(255)::物理ID:Physical ID','model_url:TEXT::モデルURL:Model URL','sync_interval_sec:INT:DEFAULT 60:同期間隔(秒):Sync interval','last_sync:TIMESTAMP::最終同期:Last sync',_SA],
  FactoryLine:[_U,'line_name:VARCHAR(255):NOT NULL:ライン名:Line name','location:VARCHAR(255)::場所:Location','capacity_per_hour:INT::時間生産数:Capacity per hour',_SA,'twin_id:UUID:FK(DigitalTwinModel):デジタルツインID:Twin ID','supervisor_id:UUID:FK(User):監督者ID:Supervisor ID'],
  RobotTask:[_U,'robot_id:VARCHAR(100):NOT NULL:ロボットID:Robot ID','task_type:VARCHAR(50):NOT NULL:タスク種別:Task type','payload:JSONB::タスク内容:Payload','priority:INT:DEFAULT 0:優先度:Priority',_SP,'started_at:TIMESTAMP::開始日時:Started at','completed_at:TIMESTAMP::完了日時:Completed at','error:TEXT::エラー:Error'],
  RobotConfig:[_U,'robot_id:VARCHAR(100):NOT NULL:ロボットID:Robot ID',_T,'capabilities:JSONB::能力:Capabilities','parameters:JSONB::パラメータ:Parameters',_SA,'firmware_version:VARCHAR(50)::ファームウェア:Firmware','last_calibrated:TIMESTAMP::最終キャリブレーション:Last calibrated'],
  CoordinationPlan:[_U,_T,_D,'robots:JSONB:NOT NULL:対象ロボット:Robots','schedule:JSONB::スケジュール:Schedule',_SA,'line_id:UUID:FK(FactoryLine):ラインID:Line ID','production_order_id:UUID:FK(ProductionOrder):製造指示ID:Production order'],
  SupplyNode:['node_name:VARCHAR(255):NOT NULL:ノード名:Node name','node_type:VARCHAR(50):NOT NULL:ノード種別:Node type','location:TEXT::場所:Location','capacity:DECIMAL(12,2)::容量:Capacity','current_stock:DECIMAL(12,2)::現在庫:Current stock',_SA,'lead_time_days:INT::リードタイム(日):Lead time'],
  DemandForecast:[_U,'product_id:VARCHAR(100):NOT NULL:製品ID:Product ID','forecast_period:DATE:NOT NULL:予測期間:Forecast period','forecast_qty:DECIMAL(12,2):NOT NULL:予測数量:Forecast qty','confidence:DECIMAL(5,2)::信頼区間(%):Confidence','model_used:VARCHAR(100)::使用モデル:Model used','generated_at:TIMESTAMP:DEFAULT NOW:生成日時:Generated at'],
  ProcurementOrder:[_U,'supplier_id:UUID:FK(User) NOT NULL:仕入先ID:Supplier ID','items:JSONB:NOT NULL:発注品目:Items','total_amount:DECIMAL(12,2):NOT NULL:発注金額:Total amount','order_date:DATE:NOT NULL:発注日:Order date','expected_delivery:DATE::納期:Expected delivery',_SP,'approved_by:UUID:FK(User):承認者ID:Approved by'],
  QualityInspection:[_U,'production_order_id:UUID:FK(ProductionOrder) NOT NULL:製造指示ID:Production order ID','line_id:UUID:FK(FactoryLine):ラインID:Line ID','sample_size:INT:NOT NULL:検査数:Sample size','defect_count:INT:DEFAULT 0:不良数:Defect count','pass:BOOLEAN:NOT NULL:合否:Pass','inspection_type:VARCHAR(50)::検査種別:Inspection type','inspected_at:TIMESTAMP:DEFAULT NOW:検査日時:Inspected at'],
  DefectRecord:[_U,'production_order_id:UUID:FK(ProductionOrder) NOT NULL:製造指示ID:Production order ID','defect_type:VARCHAR(100):NOT NULL:不良種別:Defect type','severity:VARCHAR(20):DEFAULT \'minor\':重症度:Severity','location:TEXT::発生箇所:Location','root_cause:TEXT::根本原因:Root cause',_SP,'corrective_action:TEXT::是正処置:Corrective action','cost_impact:DECIMAL(10,2)::コスト影響:Cost impact'],
  // ── Cross-Theme ──
  AgentConfig:[_U,_T,_D,'agent_type:VARCHAR(50):NOT NULL:エージェント種別:Agent type','model:VARCHAR(50)::使用モデル:Model','system_prompt:TEXT::システムプロンプト:System prompt','tools_config:JSONB::ツール設定:Tools config','memory_type:VARCHAR(50)::メモリ種別:Memory type',_IA,'max_iterations:INT:DEFAULT 10:最大反復:Max iterations'],
  AgentTask:[_U,'config_id:UUID:FK(AgentConfig) NOT NULL:設定ID:Config ID','task_description:TEXT:NOT NULL:タスク内容:Task description','input:JSONB::入力:Input','output:JSONB::出力:Output','status:VARCHAR(20):DEFAULT \'queued\':ステータス:Status','started_at:TIMESTAMP::開始日時:Started at','completed_at:TIMESTAMP::完了日時:Completed at','tokens_used:INT::使用トークン:Tokens used'],
  AgentLog:['task_id:UUID:FK(AgentTask) NOT NULL:タスクID:Agent task ID','step_number:INT:NOT NULL:ステップ番号:Step number','action_type:VARCHAR(50):NOT NULL:アクション種別:Action type','thought:TEXT::思考:Thought','observation:TEXT::観察:Observation','logged_at:TIMESTAMP:DEFAULT NOW:ログ日時:Logged at'],
  ToolDefinition:[_U,'tool_name:VARCHAR(100):NOT NULL:ツール名:Tool name','tool_type:VARCHAR(50):NOT NULL:ツール種別:Tool type',_D,'schema:JSONB:NOT NULL:スキーマ:Schema','endpoint:TEXT::エンドポイント:Endpoint',_IA,'api_key_id:UUID:FK(ApiKey):APIキーID:API key ID'],
  DeviceProfile:[_U,'device_name:VARCHAR(255):NOT NULL:デバイス名:Device name','device_type:VARCHAR(50):NOT NULL:デバイス種別:Device type','os:VARCHAR(50)::OS:OS','memory_mb:INT::メモリMB:Memory MB','compute_tflops:DECIMAL(8,4)::計算能力TFLOPS:Compute TFLOPS',_SA,'registered_at:TIMESTAMP:DEFAULT NOW:登録日時:Registered at'],
  ModelDeployment:[_U,'model_name:VARCHAR(255):NOT NULL:モデル名:Model name','model_version:VARCHAR(50):NOT NULL:バージョン:Model version','device_id:UUID:FK(DeviceProfile):デバイスID:Device ID','runtime:VARCHAR(50)::ランタイム:Runtime','quantization:VARCHAR(50)::量子化:Quantization','deployed_at:TIMESTAMP:DEFAULT NOW:デプロイ日時:Deployed at',_SA,'latency_ms:INT::レイテンシms:Latency ms'],
  InferenceLog:[_U,'deployment_id:UUID:FK(ModelDeployment) NOT NULL:デプロイID:Deployment ID','input_tokens:INT::入力トークン:Input tokens','output_tokens:INT::出力トークン:Output tokens','latency_ms:INT::レイテンシms:Latency ms','power_mw:DECIMAL(8,2)::消費電力mW:Power mW','logged_at:TIMESTAMP:DEFAULT NOW:ログ日時:Logged at'],
  EdgeConfig:[_U,'device_id:UUID:FK(DeviceProfile) NOT NULL:デバイスID:Device ID','config_name:VARCHAR(100):NOT NULL:設定名:Config name','sync_interval_sec:INT:DEFAULT 300:同期間隔(秒):Sync interval','offline_ttl_sec:INT:DEFAULT 86400:オフラインTTL(秒):Offline TTL','models:JSONB::モデルリスト:Models',_IA,'last_push:TIMESTAMP::最終プッシュ:Last push'],
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
    // ── 8 new domains (before content to avoid collision) ──
    [/製造|工場|生産管理|ファクトリー|manufacturing|factory|production.?management|smart.*factory/i,'manufacturing'],
    [/物流|配送|倉庫|logistics|delivery|warehouse|tracking/i,'logistics'],
    [/農業|スマート農業|agriculture|farming|crop.?management/i,'agriculture'],
    [/エネルギー|電力|energy|power.?management|再生可能/i,'energy'],
    [/メディア|放送|配信|ストリーミング|media|streaming|broadcasting/i,'media'],
    [/自治体|行政|申請管理|government|municipal|civic|public.?service/i,'government'],
    [/旅行|ツアー|travel|tour|宿泊予約|hotel.?booking/i,'travel'],
    [/保険|insurance|保険テック|insurtech|契約管理|claim.?management/i,'insurance'],
    // ── content pattern (media/メディア removed to prevent collision) ──
    [/コンテンツ|content|ブログ|blog|knowledge.?base|ナレッジベース/i,'content'],
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
  // Helpdesk
  if(has('SupportAgent')&&has('SupportTicket')) rels.push('SupportAgent 1 ──N SupportTicket');
  if(has('SupportAgent')&&has('Response')) rels.push('SupportAgent 1 ──N Response');
  // ── Task B: New 8-domain relationships ──
  // Manufacturing
  if(has('Product')&&has('ProductionOrder')) rels.push('Product 1 ──N ProductionOrder');
  if(has('Machine')&&has('ProductionOrder')) rels.push('Machine 1 ──N ProductionOrder');
  if(has('ProductionOrder')&&has('QualityCheck')) rels.push('ProductionOrder 1 ──N QualityCheck');
  // Logistics
  if(has('Shipment')&&has('Package')) rels.push('Shipment 1 ──N Package');
  if(has('Shipment')&&has('Delivery')) rels.push('Shipment 1 ──1 Delivery');
  if(has('Vehicle')&&has('Shipment')) rels.push('Vehicle 1 ──N Shipment');
  // Agriculture
  if(has('Farm')&&has('Field')) rels.push('Farm 1 ──N Field');
  if(has('Field')&&has('Harvest')) rels.push('Field 1 ──N Harvest');
  if(has('Crop')&&has('Harvest')) rels.push('Crop 1 ──N Harvest');
  if(has('Field')&&has('Crop')) rels.push('Field N ──1 Crop');
  // Energy
  if(has('Device')&&has('Meter')) rels.push('Device 1 ──N Meter');
  if(has('Meter')&&has('Reading')) rels.push('Meter 1 ──N Reading');
  // Media
  if(has('Program')&&has('Episode')) rels.push('Program 1 ──N Episode');
  // Government
  if(has('User')&&has('Application')) rels.push('User 1 ──N Application');
  if(has('Department')&&has('Service')) rels.push('Department 1 ──N Service');
  // Travel
  if(has('User')&&has('Itinerary')) rels.push('User 1 ──N Itinerary');
  if(has('Itinerary')&&has('Booking')) rels.push('Itinerary 1 ──N Booking');
  if(has('Hotel')&&has('Booking')) rels.push('Hotel 1 ──N Booking');
  // Insurance
  if(has('Customer')&&has('Policy')) rels.push('Customer 1 ──N Policy');
  if(has('Customer')&&has('Quote')) rels.push('Customer 1 ──N Quote');
  if(has('Policy')&&has('Claim')) rels.push('Policy 1 ──N Claim');
  // Enterprise/Multi-tenant
  if(has('Organization')&&has('OrgMember')) rels.push('Organization 1 ──N OrgMember');
  if(has('Organization')&&has('OrgInvite')) rels.push('Organization 1 ──N OrgInvite');
  if(has('User')&&has('OrgMember')) rels.push('User 1 ──N OrgMember');
  if(has('Organization')&&has('Workspace')) rels.push('Organization 1 ──N Workspace');

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
    focus_ja:['学習進捗のバックエンド同期','WCAG 2.2 AA準拠','未成年データ保護(FERPA)','コンテンツ配信安定性'],
    focus_en:['Backend sync for progress','WCAG 2.2 AA compliance','Minor data protection (FERPA)','Content delivery stability'],
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
  },
  manufacturing:{
    focus_ja:['生産計画精度','在庫管理','品質管理','設備保全'],
    focus_en:['Production planning accuracy','Inventory management','Quality control','Equipment maintenance'],
    bugs_ja:['在庫数不一致','不良品見逃し','設備故障未検知'],
    bugs_en:['Inventory count mismatch','Defect missed','Equipment failure undetected'],
    priority:'Security:MED|Performance:HIGH|DataIntegrity:CRITICAL|UX:MED|Compliance:HIGH'
  },
  logistics:{
    focus_ja:['配送追跡精度','倉庫在庫同期','ルート最適化','配達時刻予測'],
    focus_en:['Delivery tracking accuracy','Warehouse inventory sync','Route optimization','Delivery time prediction'],
    bugs_ja:['追跡情報更新遅延','在庫引当ミス','配送遅延通知漏れ'],
    bugs_en:['Tracking update delays','Inventory allocation errors','Delayed delivery notification miss'],
    priority:'Security:MED|Performance:HIGH|DataIntegrity:HIGH|UX:CRITICAL|Compliance:MED'
  },
  agriculture:{
    focus_ja:['センサーデータ精度','灌漑自動制御','収穫予測','病害検知'],
    focus_en:['Sensor data accuracy','Irrigation automation','Harvest prediction','Pest detection'],
    bugs_ja:['センサー異常値','灌漑制御失敗','収穫量誤差','病害見逃し'],
    bugs_en:['Sensor anomalies','Irrigation control failure','Harvest estimate errors','Pest detection miss'],
    priority:'Security:LOW|Performance:MED|DataIntegrity:HIGH|UX:MED|Compliance:MED'
  },
  energy:{
    focus_ja:['メーター計測精度','需給予測','アラート閾値','請求計算'],
    focus_en:['Meter reading accuracy','Demand forecasting','Alert thresholds','Billing calculation'],
    bugs_ja:['計測値異常','需給予測外れ','アラート未送信','請求額誤差'],
    bugs_en:['Reading anomalies','Forecast errors','Alert not sent','Billing amount errors'],
    priority:'Security:HIGH|Performance:MED|DataIntegrity:CRITICAL|UX:MED|Compliance:CRITICAL'
  },
  media:{
    focus_ja:['コンテンツ配信品質','DRM保護','視聴履歴追跡','レコメンド精度'],
    focus_en:['Content delivery quality','DRM protection','Viewing history tracking','Recommendation accuracy'],
    bugs_ja:['ストリーミング途切れ','DRM回避','視聴履歴漏れ','レコメンド不適切'],
    bugs_en:['Streaming interruptions','DRM bypass','Missing view history','Inappropriate recommendations'],
    priority:'Security:HIGH|Performance:CRITICAL|DataIntegrity:MED|UX:CRITICAL|Compliance:HIGH'
  },
  government:{
    focus_ja:['個人情報保護','申請処理追跡','電子署名検証','アクセシビリティ'],
    focus_en:['Personal data protection','Application tracking','Digital signature verification','Accessibility'],
    bugs_ja:['個人情報漏洩','申請状態不整合','署名検証失敗','アクセシビリティ不備'],
    bugs_en:['Personal data leakage','Application status inconsistency','Signature verification failure','Accessibility gaps'],
    priority:'Security:CRITICAL|Performance:MED|DataIntegrity:CRITICAL|UX:HIGH|Compliance:CRITICAL'
  },
  travel:{
    focus_ja:['予約確定性','在庫同期','決済完全性','キャンセル処理'],
    focus_en:['Booking confirmation','Inventory sync','Payment integrity','Cancellation handling'],
    bugs_ja:['ダブルブッキング','在庫更新遅延','決済失敗未通知','キャンセル料誤算'],
    bugs_en:['Double booking','Inventory update delays','Payment failure not notified','Cancellation fee errors'],
    priority:'Security:HIGH|Performance:HIGH|DataIntegrity:CRITICAL|UX:CRITICAL|Compliance:MED'
  },
  insurance:{
    focus_ja:['見積精度','契約管理','保険金請求処理','コンプライアンス'],
    focus_en:['Quote accuracy','Policy management','Claim processing','Compliance'],
    bugs_ja:['見積計算誤差','契約更新漏れ','請求処理遅延','監査証跡不足'],
    bugs_en:['Quote calculation errors','Policy renewal miss','Claim processing delays','Insufficient audit trails'],
    priority:'Security:CRITICAL|Performance:MED|DataIntegrity:CRITICAL|UX:HIGH|Compliance:CRITICAL'
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
// Compression constants for prevent patterns
const _PVJ='|対策:';const _PVE='|Fix: ';
const _dpb=(i_ja,i_en,c_ja,c_en,p_ja,p_en,ctx_ja,ctx_en,sk_ja,sk_en)=>({impl_ja:i_ja,impl_en:i_en,compliance_ja:c_ja,compliance_en:c_en,prevent_ja:p_ja,prevent_en:p_en,ctx_ja:ctx_ja,ctx_en:ctx_en,skill_ja:sk_ja,skill_en:sk_en});

const DOMAIN_PLAYBOOK={
  education:_dpb(
    ['学習目標→知識体系→カリキュラム→評価基準(例:TOEIC 650→900=300h)','成績データ→パターン分析→弱点特定→個別最適化(正答率<60%優先)','理解度テスト→習熟判定→次単元解放(≥80%進む、<60%再履修)'],
    ['Goal→Knowledge map→Curriculum→Assessment (e.g. TOEIC 650→900=300hrs)','Grade data→Pattern analysis→Weakness ID→Personalization (prioritize <60%)','Test→Mastery→Unlock next (≥80% proceed, <60% retry)'],
    [_CF+':学生データ暗号化、保護者同意、保持5年','WCAG 2.2 AA、スクリーンリーダー対応',_CG+':Right to be forgotten'],
    [_CF+': student data encrypt, parental consent, 5yr retention','WCAG 2.2 AA, screen reader',_CG+': Right to be forgotten'],
    ['進捗消失|localStorage超過'+_PVJ+'IndexedDB移行','カンニング検出漏れ|タブ監視のみ'+_PVJ+'Proctorio+視線追跡','学習時間水増し|非アクティブカウント'+_PVJ+'操作監視、5分で停止'],
    ['Progress loss|localStorage quota'+_PVE+'IndexedDB','Cheating miss|Tab-only monitor'+_PVE+'Proctorio+eye track','Time inflation|Counts inactive'+_PVE+'Activity monitor, 5min pause'],
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
    ['二重決済|冪等性未実装'+_PVJ+'Stripe key、ボタン無効化','在庫切れ購入|race condition'+_PVJ+'SELECT FOR UPDATE、3フェーズ','カゴ落ち60%|決済離脱'+_PVJ+'住所補完、Apple Pay、ゲスト許可'],
    ['Double charge|No idempotency'+_PVE+'Stripe key, disable button','Stockout purchase|Race condition'+_PVE+'SELECT FOR UPDATE, 3-phase','60% abandon|Checkout friction'+_PVE+'Address autocomplete, Apple Pay, guest'],
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
    ['テナント分離漏れ|RLS未設定'+_PVJ+'RLS必須、tenant_id必須','Rate limit突破|backoff未実装'+_PVJ+'2^n待機、Circuit Breaker','オンボード離脱50%|設定複雑'+_PVJ+'ツアー、プリセット、Aha!短縮'],
    ['Tenant isolation|Missing RLS'+_PVE+'Enforce RLS, tenant_id required','Rate limit|No backoff'+_PVE+'2^n wait, Circuit Breaker','50% onboard drop|Complex setup'+_PVE+'Tour, presets, shorten Aha!'],
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
    ['二重送金|残高チェック不足'+_PVJ+'SELECT FOR UPDATE、冪等性','不正検出漏れ|ルールのみ'+_PVJ+'LightGBM、行動学習','金利ズレ|浮動小数点誤差'+_PVJ+'Decimal、整数演算'],
    ['Double transfer|Insufficient check'+_PVE+'SELECT FOR UPDATE, idempotency','Fraud miss|Rule-only'+_PVE+'LightGBM, behavior learning','Interest error|Float rounding'+_PVE+'Decimal, integer math'],
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
    ['診断ミス|データ不足'+_PVJ+'必須入力増、禁忌チェック','通知されない|許可OFF'+_PVJ+'ガイダンス、PWA、SMS','連携エラー|スコープ不足'+_PVJ+'権限明示、再認証、リトライ'],
    ['Diagnostic error|Insufficient data'+_PVE+'Increase inputs, contraindication check','No notification|Permission OFF'+_PVE+'Guidance, PWA, SMS','Integration error|Scope insufficient'+_PVE+'Specify permissions, re-auth, retry'],
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
    ['ダブルブッキング|競合状態'+_PVJ+'Lock、3段階、5分同期+バッファ','待ち通知されない|接続切断'+_PVJ+'SSE fallback、SMS/Email、30秒以内','価格急変クレーム|更新頻度高'+_PVJ+'30分固定、理由表示'],
    ['Double booking|Race condition'+_PVE+'Lock, 3-phase, 5min sync+buffer','Waitlist no notify|Connection loss'+_PVE+'SSE fallback, SMS/Email, within 30sec','Price change complaint|Too frequent'+_PVE+'30min hold, show reason'],
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
    ['認証バイパス|JWT検証不足'+_PVJ+'全ルートで検証、7日期限、リフレッシュ','N+1クエリ|個別取得'+_PVJ+'JOIN、eager loading、監視>10アラート','遅延|全件取得、INDEX未設定'+_PVJ+'ページネーション(limit 20)、INDEX、APM'],
    ['Auth bypass|Insufficient JWT validation'+_PVE+'Enforce all routes, 7d expiry, refresh','N+1 query|Individual fetch'+_PVE+'JOIN, eager loading, monitor>10 alert','Delay|Fetch all, no INDEX'+_PVE+'Pagination (limit 20), INDEX, APM'],
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
    ['マッチング精度低|データ不足|ルール→100件でML','不正評価|サクラ|検知:短期間集中、IPクラスタ','手数料計算ミス|複雑割引'+_PVJ+'事前見積、決済前確認'],
    ['Matching accuracy low|Insufficient data|Rules→ML after 100','Fake reviews|Shilling|Detect: burst period, IP cluster','Fee calc error|Complex discount'+_PVE+'Pre-estimate, confirm before payment'],
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
    ['スパム|reCAPTCHA未導入'+_PVJ+'v3、5件/分制限','XSS脆弱性|サニタイズ不足'+_PVJ+'DOMPurify、CSP','フィルターバブル|類似のみ'+_PVJ+'多様性注入20%'],
    ['Spam|No reCAPTCHA'+_PVE+'v3, 5/min limit','XSS vulnerability|Insufficient sanitize'+_PVE+'DOMPurify, CSP','Filter bubble|Similarity only'+_PVE+'Inject diversity 20%'],
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
  ai:_dpb(['プロンプト→生成→評価→改善','会話履歴→コンテキスト→応答品質','トークン→コスト→最適化'],['Prompt→Generate→Evaluate→Improve','History→Context→Quality','Token→Cost→Optimize'],[_CG+':データ処理同意','OpenAI ToS準拠','プロンプト暗号化'],[_CG+': data consent','OpenAI ToS compliance','Prompt encryption'],['プロンプト漏洩|ログ保存'+_PVJ+'暗号化、アクセス制御','トークン超過|無制限生成'+_PVJ+'制限設定、アラート'],[' Prompt leak|Log storage'+_PVE+'encrypt, access control','Token overuse|Unlimited'+_PVE+'limits, alerts'],['生成→architecture.md(AI), api_spec.md','履歴→stakeholders.md, security.md'],['Generate→architecture.md(AI), api_spec.md','History→stakeholders.md, security.md'],'プロンプト最適化|コスト削減|入力:履歴、トークン数|判断:>1000トークン→要約、重複→キャッシュ|出力:最適化案','Prompt Optimization|Cost reduction|Input: history, tokens|Judgment: >1000 tokens→summarize, duplicate→cache|Output: optimization plan'),
  automation:_dpb(['トリガー→実行→完了→通知','エラー→リトライ→成功→記録','ワークフロー→最適化→測定'],['Trigger→Execute→Complete→Notify','Error→Retry→Success→Log','Workflow→Optimize→Measure'],[_CG+':自動化同意','実行ログ保存','エラー通知'],[_CG+': automation consent','Execution logs','Error notification'],['無限ループ|終了条件なし'+_PVJ+'最大実行回数、タイムアウト','リトライ過多|無制限'+_PVJ+'指数バックオフ、上限設定'],['Infinite loop|No exit'+_PVE+'max runs, timeout','Retry overuse|Unlimited'+_PVE+'exponential backoff, limit'],['実行→architecture.md(workflow), api_spec.md','エラー→error_logs.md, stakeholders.md'],['Execute→architecture.md(workflow), api_spec.md','Error→error_logs.md, stakeholders.md'],'ワークフロー効率化|実行時間短縮|入力:実行ログ、ステップ時間|判断:>60s→並列化候補、失敗率>10%→要改善|出力:最適化案、期待時間削減','Workflow Efficiency|Reduce execution time|Input: logs, step duration|Judgment: >60s→parallel candidate, fail>10%→improve|Output: optimization, expected savings'),
  event:_dpb(['企画→告知→販売→開催','チケット→購入→検証→入場','キャンセル→返金→再販売'],['Plan→Announce→Sell→Hold','Ticket→Purchase→Verify→Entry','Cancel→Refund→Resell'],['個人情報保護法:氏名、メール暗号化','特商法:返金規定明記','会場規約:安全管理'],[' Privacy Act: name, email encrypt','Commercial Act: refund policy','Venue: safety management'],['定員超過|競合販売'+_PVJ+'SELECT FOR UPDATE、在庫ロック','QR重複|生成ミス'+_PVJ+'UUID、検証チェック'],['Oversell|Race condition'+_PVE+'SELECT FOR UPDATE, lock','QR duplicate|Generation error'+_PVE+'UUID, validation'],['販売→architecture.md(ticket), security.md','検証→architecture.md(QR), api_spec.md'],['Sales→architecture.md(ticket), security.md','Verify→architecture.md(QR), api_spec.md'],'チケット販売最適化|売上最大化|入力:販売履歴、残席、需要|判断:残席<20%→値上げ候補、売行き悪い→割引検討|出力:価格戦略、期待売上','Ticket Sales Optimization|Maximize revenue|Input: sales history, remaining, demand|Judgment: remaining<20%→price up candidate, slow sales→discount|Output: pricing strategy, expected revenue'),
  gamify:_dpb(['参加→達成→獲得→継続','ポイント→バッジ→ランキング→報酬','行動→測定→分析→最適化'],['Join→Achieve→Earn→Continue','Points→Badges→Ranking→Rewards','Behavior→Measure→Analyze→Optimize'],[_CG+':ポイント管理透明性','利用規約:ポイント有効期限','不正防止:行動監視'],[_CG+': point management transparency','ToS: point expiration','Fraud: behavior monitoring'],['ポイント重複付与|冪等性なし'+_PVJ+'トランザクション、重複チェック','ランキング操作|不正行動'+_PVJ+'異常検知、手動確認'],['Duplicate points|No idempotency'+_PVE+'transaction, duplicate check','Ranking manipulation|Fraud'+_PVE+'anomaly detection, manual review'],['達成→architecture.md(gamify), api_spec.md','不正→error_logs.md, security.md'],['Achievement→architecture.md(gamify), api_spec.md','Fraud→error_logs.md, security.md'],'エンゲージメント向上|継続率改善|入力:行動ログ、達成率|判断:完了<30%→難易度調整、離脱>50%→報酬見直し|出力:改善案、期待継続率','Engagement Improvement|Retention increase|Input: behavior logs, completion|Judgment: complete<30%→adjust difficulty, churn>50%→review rewards|Output: improvement plan, expected retention'),
  collab:_dpb(['作成→編集→同期→保存','競合→解決→マージ→履歴','権限→承認→共有→通知'],['Create→Edit→Sync→Save','Conflict→Resolve→Merge→History','Permission→Approve→Share→Notify'],[_CG+':データ処理同意','利用規約:編集権限、削除30日','セキュリティ:暗号化通信、アクセスログ'],[_CG+': data processing consent','ToS: edit permission, delete 30d','Security: encrypted communication, access log'],['編集消失|競合解決失敗'+_PVJ+'OT/CRDT、定期保存','権限漏れ|チェック不足'+_PVJ+'RLS、middleware検証'],['Edit loss|Conflict resolution failure'+_PVE+'OT/CRDT, periodic save','Permission bypass|Insufficient check'+_PVE+'RLS, middleware validation'],['同期→architecture.md(realtime), api_spec.md','権限→security.md, test_cases/'],['Sync→architecture.md(realtime), api_spec.md','Permission→security.md, test_cases/'],'競合解決最適化|編集消失防止|入力:編集履歴、競合頻度|判断:競合>5/h→通知強化、消失>1%→保存頻度増|出力:最適化案','Conflict Resolution Optimization|Prevent edit loss|Input: edit history, conflict rate|Judgment: conflicts>5/h→enhance notification, loss>1%→increase save frequency|Output: optimization plan'),
  devtool:_dpb(['登録→発行→使用→追跡','リクエスト→検証→実行→記録','エラー→通知→対応→改善'],['Register→Issue→Use→Track','Request→Verify→Execute→Log','Error→Notify→Respond→Improve'],[_CG+':データ処理同意','利用規約:レート制限、使用制限','セキュリティ:APIキー暗号化、IP制限'],[_CG+': data processing consent','ToS: rate limits, usage limits','Security: API key encryption, IP restriction'],['キー漏洩|平文保存'+_PVJ+'暗号化、ハッシュ化、定期ローテーション','レート突破|制限なし'+_PVJ+'Redis、sliding window'],['Key leakage|Plain text'+_PVE+'encrypt, hash, regular rotation','Rate bypass|No limits'+_PVE+'Redis, sliding window'],['認証→security.md, api_spec.md','使用→architecture.md(tracking), stakeholders.md'],['Auth→security.md, api_spec.md','Usage→architecture.md(tracking), stakeholders.md'],'API使用最適化|コスト削減|入力:リクエストログ、エラー率|判断:エラー>5%→要改善、重複>30%→キャッシュ候補|出力:最適化案、期待削減率','API Usage Optimization|Cost reduction|Input: request logs, error rate|Judgment: error>5%→improve, duplicate>30%→cache candidate|Output: optimization plan, expected reduction'),
  creator:_dpb(['作成→公開→収益化→分析','サブスク→課金→継続→解約','ファン→交流→支援→成長'],['Create→Publish→Monetize→Analyze','Subscribe→Charge→Continue→Cancel','Fan→Engage→Support→Grow'],[_CG+':データ処理同意','資金決済法:前払式、第三者型','利用規約:手数料、返金規定'],[_CG+': data processing consent','Payment Services Act: prepaid, third-party','ToS: fees, refund policy'],['解約後課金|サブスク解約漏れ'+_PVJ+'Webhook検証、定期確認','投げ銭未着|決済失敗'+_PVJ+'リトライ、通知'],['Charge after cancel|Subscription cancel miss'+_PVE+'webhook verification, periodic check','Tip not received|Payment failure'+_PVE+'retry, notification'],['課金→architecture.md(subscription), security.md','支援→architecture.md(tip), api_spec.md'],['Billing→architecture.md(subscription), security.md','Support→architecture.md(tip), api_spec.md'],'収益最適化|ファン増加|入力:収益データ、ファン行動|判断:離脱>30%→ティア見直し、成長<10%→施策追加|出力:改善案、期待収益','Revenue Optimization|Fan growth|Input: revenue data, fan behavior|Judgment: churn>30%→review tiers, growth<10%→add tactics|Output: improvement plan, expected revenue'),
  newsletter:_dpb(['作成→配信→開封→分析','購読→確認→受信→解除','セグメント→ターゲット→パーソナライズ'],['Create→Send→Open→Analyze','Subscribe→Confirm→Receive→Unsubscribe','Segment→Target→Personalize'],[_CG+':配信同意、オプトイン','特定電子メール法:配信者明記、解除リンク','個人情報保護法:購読者情報暗号化'],[_CG+': sending consent, opt-in','Anti-Spam Act: sender info, unsubscribe link','Privacy Act: subscriber info encryption'],['解除後配信|リスト更新漏れ'+_PVJ+'即時反映、定期同期','スパム判定|SPF/DKIM未設定'+_PVJ+'認証設定、レピュテーション管理'],['Send after unsubscribe|List update miss'+_PVE+'immediate reflect, periodic sync','Spam flagged|No SPF/DKIM'+_PVE+'auth setup, reputation management'],['配信→architecture.md(email), api_spec.md','分析→stakeholders.md, architecture.md(analytics)'],['Send→architecture.md(email), api_spec.md','Analytics→stakeholders.md, architecture.md(analytics)'],'配信最適化|開封率向上|入力:配信履歴、開封率、クリック率|判断:開封<20%→件名改善、クリック<5%→CTA最適化|出力:改善案、期待開封率','Delivery Optimization|Improve open rate|Input: send history, open rate, click rate|Judgment: open<20%→improve subject, click<5%→optimize CTA|Output: improvement plan, expected open rate'),
  manufacturing:_dpb(['需要予測→生産計画→製造→出荷','材料→加工→検査→在庫','設備→保守→稼働→記録'],['Forecast→Plan→Manufacture→Ship','Material→Process→Inspect→Stock','Equipment→Maintain→Operate→Log'],[_CG+':製造データ保護','製造物責任法:品質記録5年保持','ISO 9001:品質マネジメント'],[_CG+': manufacturing data protection','Product Liability Act: quality records 5yr','ISO 9001: quality management'],['在庫差異|カウント誤差'+_PVJ+'バーコード、定期棚卸','不良品流出|検査漏れ'+_PVJ+'全数検査、統計的手法'],['Inventory mismatch|Count errors'+_PVE+'barcode, periodic inventory','Defect escape|Inspection miss'+_PVE+'100% inspection, statistical methods'],['生産→architecture.md(production), api_spec.md','品質→test_cases/, error_logs.md'],['Production→architecture.md(production), api_spec.md','Quality→test_cases/, error_logs.md'],'生産効率化|稼働率向上|入力:生産ログ、稼働時間|判断:稼働率<70%→改善候補、不良率>5%→工程見直し|出力:改善案、期待効率','Production Efficiency|Improve utilization|Input: production logs, uptime|Judgment: utilization<70%→improve, defect>5%→review process|Output: improvement plan, expected efficiency'),
  logistics:_dpb(['受注→引当→出荷→配送','倉庫→ピッキング→梱包→発送','ルート→配送→追跡→完了'],['Order→Allocate→Ship→Deliver','Warehouse→Pick→Pack→Send','Route→Deliver→Track→Complete'],[_CG+':配送先情報暗号化','運送約款:配送条件明記','個人情報保護法:不在票記録7日削除'],[_CG+': delivery address encryption','Shipping terms: conditions','Privacy Act: absence slip 7d deletion'],['ダブル引当|在庫競合'+_PVJ+'SELECT FOR UPDATE、ロック','配送遅延|ルート非最適'+_PVJ+'AI最適化、リアルタイム調整'],['Double allocation|Inventory race'+_PVE+'SELECT FOR UPDATE, lock','Delivery delay|Non-optimal route'+_PVE+'AI optimization, real-time adjustment'],['配送→architecture.md(delivery), api_spec.md','追跡→stakeholders.md, architecture.md(tracking)'],['Delivery→architecture.md(delivery), api_spec.md','Tracking→stakeholders.md, architecture.md(tracking)'],'配送最適化|コスト削減|入力:配送履歴、燃料費、時間|判断:迂回>15%→ルート見直し、不在>30%→通知強化|出力:最適化案、期待削減','Delivery Optimization|Cost reduction|Input: delivery history, fuel, time|Judgment: detour>15%→review route, absence>30%→enhance notification|Output: optimization plan, expected reduction'),
  agriculture:_dpb(['計画→播種→育成→収穫','センサー→監視→制御→記録','作物→収穫→選別→出荷'],['Plan→Sow→Grow→Harvest','Sensor→Monitor→Control→Log','Crop→Harvest→Sort→Ship'],[_CG+':農地データ保護','GAP:適正農業規範','食品衛生法:トレーサビリティ'],[_CG+': farm data protection','GAP: good agricultural practice','Food Sanitation Act: traceability'],['病害見逃し|検知遅延'+_PVJ+'画像AI、早期アラート','灌漑失敗|センサー故障'+_PVJ+'冗長化、定期校正'],['Pest miss|Detection delay'+_PVE+'image AI, early alert','Irrigation failure|Sensor fault'+_PVE+'redundancy, periodic calibration'],['収穫→architecture.md(harvest), api_spec.md','センサー→architecture.md(IoT), error_logs.md'],['Harvest→architecture.md(harvest), api_spec.md','Sensor→architecture.md(IoT), error_logs.md'],'収穫量予測|計画最適化|入力:気象データ、生育記録|判断:予測誤差>20%→モデル再訓練、病害リスク>30%→予防散布|出力:予測量、対策案','Harvest Prediction|Optimize planning|Input: weather data, growth records|Judgment: forecast error>20%→retrain model, pest risk>30%→preventive spray|Output: predicted yield, countermeasures'),
  energy:_dpb(['計測→集計→分析→請求','需要予測→供給調整→配電→記録','アラート→通知→対応→改善'],['Measure→Aggregate→Analyze→Bill','Forecast→Adjust→Distribute→Log','Alert→Notify→Respond→Improve'],['電気事業法:計量精度±2%','個人情報保護法:使用量データ暗号化',_CG+':データ処理同意'],[' Electricity Act: metering ±2%','Privacy Act: usage data encryption',_CG+': data processing consent'],['計測誤差|検針ミス'+_PVJ+'スマートメーター、定期校正','需給予測外れ|気象変動'+_PVJ+'AI予測、リアルタイム調整'],['Metering error|Reading miss'+_PVE+'smart meter, periodic calibration','Forecast miss|Weather change'+_PVE+'AI forecast, real-time adjustment'],['計測→architecture.md(metering), api_spec.md','需給→stakeholders.md, architecture.md(forecast)'],['Metering→architecture.md(metering), api_spec.md','Supply→stakeholders.md, architecture.md(forecast)'],'需給最適化|コスト削減|入力:計測データ、気象予測|判断:ピーク需要>90%容量→調整、予測誤差>10%→改善|出力:最適化案、期待削減','Supply-Demand Optimization|Cost reduction|Input: metering data, weather forecast|Judgment: peak demand>90% capacity→adjust, forecast error>10%→improve|Output: optimization plan, expected reduction'),
  media:_dpb(['企画→制作→配信→視聴','コンテンツ→エンコード→CDN→再生','視聴者→エンゲージ→サブスク→継続'],['Plan→Produce→Distribute→View','Content→Encode→CDN→Play','Viewer→Engage→Subscribe→Retain'],['著作権法:コンテンツ保護、DRM',_CG+':視聴履歴暗号化','放送法:適正配信、記録保持'],[' Copyright Act: content protection, DRM',_CG+': viewing history encryption','Broadcasting Act: proper distribution, record retention'],['DRM回避|保護不足'+_PVJ+'Widevine L1、定期更新','ストリーム途切れ|CDN障害'+_PVJ+'Multi-CDN、フェイルオーバー'],['DRM bypass|Insufficient protection'+_PVE+'Widevine L1, regular updates','Stream interruption|CDN failure'+_PVE+'Multi-CDN, failover'],['配信→architecture.md(streaming), security.md','視聴→stakeholders.md, architecture.md(analytics)'],['Distribution→architecture.md(streaming), security.md','Viewing→stakeholders.md, architecture.md(analytics)'],'視聴最適化|継続率向上|入力:視聴履歴、離脱率|判断:離脱>60%→コンテンツ改善、バッファ>5%→CDN最適化|出力:改善案、期待継続率','Viewing Optimization|Improve retention|Input: viewing history, churn rate|Judgment: churn>60%→improve content, buffering>5%→optimize CDN|Output: improvement plan, expected retention'),
  government:_dpb(['申請→受付→審査→承認','市民→本人確認→申請→交付','データ→集計→分析→公開'],['Apply→Receive→Review→Approve','Citizen→Verify→Apply→Issue','Data→Aggregate→Analyze→Publish'],['個人情報保護法:厳格保護、監査','行政手続法:透明性、標準処理期間','公文書管理法:記録保持、開示'],[' Privacy Act: strict protection, audit','Administrative Procedure Act: transparency, standard processing time','Public Records Act: record retention, disclosure'],['個人情報漏洩|アクセス制御不足'+_PVJ+'RLS、監査ログ、定期監査','処理遅延|手動処理'+_PVJ+'ワークフロー自動化、進捗可視化'],['Personal data leakage|Insufficient access control'+_PVE+'RLS, audit log, periodic audit','Processing delay|Manual processing'+_PVE+'workflow automation, progress visibility'],['申請→architecture.md(application), security.md','承認→stakeholders.md, test_cases/'],['Application→architecture.md(application), security.md','Approval→stakeholders.md, test_cases/'],'処理効率化|待ち時間短縮|入力:処理履歴、待機時間|判断:待機>30日→優先処理、差戻し>30%→要件明確化|出力:改善案、期待処理時間','Processing Efficiency|Reduce waiting time|Input: processing history, wait time|Judgment: wait>30d→prioritize, rejection>30%→clarify requirements|Output: improvement plan, expected processing time'),
  travel:_dpb(['検索→比較→予約→決済','旅程→ホテル→航空券→完了','レビュー→評価→次回→リピート'],['Search→Compare→Book→Pay','Itinerary→Hotel→Flight→Complete','Review→Rate→Next→Repeat'],['旅行業法:取引条件説明、記録保持',_CG+':予約情報暗号化','個人情報保護法:パスポート情報厳格保護'],[' Travel Business Act: terms explanation, record retention',_CG+': booking info encryption','Privacy Act: strict passport info protection'],['ダブルブッキング|在庫競合'+_PVJ+'SELECT FOR UPDATE、リアルタイム同期','キャンセル料誤算|計算ロジックミス'+_PVJ+'テストケース充実、手数料テーブル'],['Double booking|Inventory race'+_PVE+'SELECT FOR UPDATE, real-time sync','Cancellation fee error|Calculation logic miss'+_PVE+'rich test cases, fee table'],['予約→architecture.md(booking), security.md','決済→architecture.md(payment), api_spec.md'],['Booking→architecture.md(booking), security.md','Payment→architecture.md(payment), api_spec.md'],'予約最適化|稼働率向上|入力:予約履歴、空室率|判断:空室>40%→価格調整、キャンセル>20%→ペナルティ見直し|出力:最適化案、期待稼働率','Booking Optimization|Improve occupancy|Input: booking history, vacancy rate|Judgment: vacancy>40%→adjust pricing, cancel>20%→review penalty|Output: optimization plan, expected occupancy'),
  insurance:_dpb(['見積→契約→請求→支払','査定→審査→承認→振込','更新→通知→継続→解約'],['Quote→Contract→Claim→Pay','Assessment→Review→Approve→Transfer','Renew→Notify→Continue→Cancel'],[_CG+':契約情報暗号化','保険業法:適正審査、記録保持','金融商品取引法:説明義務、書面交付'],[_CG+': contract info encryption','Insurance Act: proper review, record retention','Financial Instruments Act: disclosure obligation, document issuance'],['見積誤差|計算ミス'+_PVJ+'テストケース充実、監査','請求処理遅延|手動審査'+_PVJ+'AI審査、自動承認閾値'],['Quote error|Calculation miss'+_PVE+'rich test cases, audit','Claim delay|Manual review'+_PVE+'AI review, auto-approve threshold'],['見積→architecture.md(quote), api_spec.md','請求→stakeholders.md, architecture.md(claim)'],['Quote→architecture.md(quote), api_spec.md','Claim→stakeholders.md, architecture.md(claim)'],'請求最適化|処理時間短縮|入力:請求履歴、審査時間|判断:審査>14日→優先、不正疑い>5%→AI審査強化|出力:改善案、期待処理時間','Claim Optimization|Reduce processing time|Input: claim history, review time|Judgment: review>14d→prioritize, fraud suspect>5%→enhance AI review|Output: improvement plan, expected processing time')
};

// Growth Intelligence data
const _dg=(fj,fe,cvr,eq,lj,le,pj,pe)=>({fj,fe,cvr,eq,lj,le,pj,pe});
const DOMAIN_GROWTH={
  ec:_dg(
    ['訪問','商品閲覧','カート追加','決済完了','リピート'],
    ['Visit','Browse','Add to Cart','Checkout','Repeat'],
    [100,40,12,3,1.2],
    'Revenue = Traffic × Browse_CVR × Cart_CVR × Checkout_CVR × AOV × Repeat',
    ['SEO/広告流入増','レコメンド精度','カート放棄防止','決済UX簡素化','ポイント/会員制度'],
    ['SEO/ad traffic','Recommendation accuracy','Cart abandon prevention','Checkout UX','Loyalty program'],
    ['単品:¥3,000-5,000','おすすめ:¥5,000-8,000','プレミアム:¥10,000+'],
    ['Basic:$30-50','Recommended:$50-80','Premium:$100+']
  ),
  saas:_dg(
    ['LP訪問','サインアップ','Aha体験','有料転換','拡張/紹介'],
    ['LP Visit','Signup','Aha Moment','Paid Convert','Expand/Refer'],
    [100,30,18,5.4,2.7],
    'MRR = Signups × Activation × Paid_CVR × ARPU - Churn',
    ['LP CVR改善','オンボーディング最適化','フリーミアム導線','チャーン防止','紹介プログラム'],
    ['Optimize LP CVR','Improve onboarding','Free-to-paid path','Churn prevention','Referral program'],
    ['Free:¥0','Pro:¥980/月','Enterprise:¥9,800/月'],
    ['Free:$0','Pro:$10/mo','Enterprise:$100/mo']
  ),
  education:_dg(
    ['認知','無料体験','受講開始','修了','上位コース'],
    ['Awareness','Free Trial','Enroll','Complete','Upsell'],
    [100,25,10,6,2.4],
    'Revenue = Students × Trial_CVR × Enroll_CVR × Price + Upsell',
    ['コンテンツSEO','体験レッスン品質','松竹梅価格','修了率(ゲーミフィケーション)','上位コース提案'],
    ['Content SEO','Trial quality','3-tier pricing','Completion rate (gamify)','Upsell suggestion'],
    ['入門:¥3,000','標準:¥9,800','プレミアム:¥29,800'],
    ['Intro:$30','Standard:$100','Premium:$300']
  ),
  fintech:_dg(
    ['登録','KYC完了','初回取引','アクティブ利用','プレミアム転換'],
    ['Register','KYC Complete','First Txn','Active Use','Premium'],
    [100,60,30,20,5],
    'Revenue = Users × KYC_Rate × Active × Txn_Vol × Fee + Premium_MRR',
    ['広告/PR','KYC UX簡素化','初回ボーナス','定期利用促進','プレミアム訴求'],
    ['Ads/PR','Simplify KYC','First-time bonus','Regular use incentive','Premium pitch'],
    ['無料:基本取引','Pro:¥980/月','法人:¥29,800/月'],
    ['Free:basic','Pro:$10/mo','Business:$300/mo']
  ),
  booking:_dg(
    ['検索','空き確認','予約','来店/利用','リピート'],
    ['Search','Availability','Book','Visit','Rebook'],
    [100,60,20,17,7],
    'Revenue = Searches × Book_CVR × Show_Rate × Price × Commission',
    ['SEO/口コミ','リアルタイム在庫','予約UX','リマインダー','リピート割引'],
    ['SEO/reviews','Real-time inventory','Booking UX','Reminders','Repeat discounts'],
    ['通常:¥3,000-5,000/回','人気:¥8,000/回','プレミアム:¥15,000/回'],
    ['Standard:$30-50','Popular:$80','Premium:$150']
  ),
  community:_dg(
    ['訪問','登録','初投稿','アクティブ化','有料/寄付'],
    ['Visit','Register','First Post','Active','Paid/Donate'],
    [100,20,8,3,0.6],
    'Revenue = MAU × Active_Rate × Paid_CVR × ARPU + Ad_Revenue',
    ['口コミ/招待','ウェルカムガイド','投稿促進(バッジ)','文化醸成','プレミアム機能'],
    ['Word of mouth','Welcome guide','Post incentive (badges)','Culture building','Premium features'],
    ['無料:基本','Pro:¥500/月','サポーター:¥3,000/月'],
    ['Free:basic','Pro:$5/mo','Supporter:$30/mo']
  ),
  marketplace:_dg(
    ['訪問','検索/閲覧','問合せ/入札','成約','リピート/評価'],
    ['Visit','Search','Inquiry/Bid','Deal','Repeat/Rate'],
    [100,50,15,6,2.4],
    'GMV = Listings × Bid_Rate × Close_Rate × Avg_Deal',
    ['出品者獲得','検索精度','マッチング最適化','エスクロー信頼性','評価制度'],
    ['Acquire sellers','Search accuracy','Matching optimization','Escrow trust','Rating system'],
    ['出品無料→成約手数料8%','プレミアム掲載:¥2,000/月','Featured:¥5,000/回'],
    ['Free list→8% commission','Premium:$20/mo','Featured:$50/time']
  ),
  content:_dg(
    ['訪問','記事閲覧','購読登録','エンゲージ','課金'],
    ['Visit','Browse','Subscribe','Engage','Pay'],
    [100,35,8,4,1.2],
    'Revenue = PV × Subscribe_CVR × Engage_Rate × Paid_CVR × ARPU + Ad',
    ['SEO/SNS拡散','コンテンツ品質','メルマガ育成','コメント/共有促進','有料コンテンツ訴求'],
    ['SEO/SNS spread','Content quality','Newsletter nurture','Comment/share incentive','Paid content pitch'],
    ['無料:基本閲覧','購読:¥500/月','プレミアム:¥1,500/月'],
    ['Free:basic','Subscribe:$5/mo','Premium:$15/mo']
  ),
  analytics:_dg(
    ['トライアル','データ接続','ダッシュボード利用','レポート共有','エンタープライズ'],
    ['Trial','Data Connect','Dashboard Use','Report Share','Enterprise'],
    [100,60,35,15,4],
    'ARR = Trials × Connect_CVR × Active × Share × Enterprise_Rate × ACV',
    ['無料枠拡大','データソース連携強化','テンプレート充実','チーム機能','カスタマイズ支援'],
    ['Expand free tier','Enhance data source connectors','Rich templates','Team features','Customization support'],
    ['Free:3ダッシュボード','Pro:¥9,800/月','Enterprise:¥98,000/月'],
    ['Free:3 dashboards','Pro:$100/mo','Enterprise:$1,000/mo']
  ),
  iot:_dg(
    ['デバイス登録','データストリーム','アラート運用','分析利用','スケール'],
    ['Device Register','Data Stream','Alert Ops','Analytics','Scale'],
    [100,70,50,30,8],
    'Revenue = Devices × Stream_Rate × Alert_Engage × Analytics_Use × Scale_Rate × ARPU',
    ['デバイス配布促進','接続安定性','閾値調整UX','BIツール連携','大規模プラン'],
    ['Device distribution','Connection stability','Threshold tuning UX','BI integration','Enterprise plan'],
    ['無料:5デバイス','Standard:¥2,000/月(50台)','Enterprise:¥50,000/月(1000台+)'],
    ['Free:5 devices','Standard:$20/mo(50)','Enterprise:$500/mo(1000+)']
  ),
  realestate:_dg(
    ['物件検索','詳細閲覧','問合せ','内見予約','契約'],
    ['Search','Detail View','Inquiry','Viewing','Contract'],
    [100,25,8,3,1.2],
    'Revenue = Listings × View_CVR × Inquiry_CVR × Viewing_CVR × Contract × Commission',
    ['SEO/ポータル連携','写真/VR品質','チャット対応','スケジュール調整','電子契約導入'],
    ['SEO/portal integration','Photo/VR quality','Chat support','Schedule coordination','E-contract'],
    ['掲載無料→成約手数料3%','プレミアム:¥5,000/月','VR撮影:¥30,000/回'],
    ['Free list→3% commission','Premium:$50/mo','VR photo:$300/time']
  ),
  legal:_dg(
    ['問合せ','相談予約','案件契約','進行管理','継続/更新'],
    ['Inquiry','Consult','Contract','Case Mgmt','Renew'],
    [100,40,20,18,8],
    'Revenue = Inquiries × Consult_CVR × Contract_CVR × Avg_Fee + Retainer',
    ['SEO/専門性訴求','初回相談無料','料金透明性','進捗可視化','顧問契約提案'],
    ['SEO/expertise','Free first consult','Transparent pricing','Progress visibility','Retainer proposal'],
    ['相談:¥10,000/回','案件:¥300,000-500,000','顧問:¥100,000/月'],
    ['Consult:$100','Case:$3,000-5,000','Retainer:$1,000/mo']
  ),
  hr:_dg(
    ['求人掲載','応募受付','書類選考','面接実施','採用決定'],
    ['Job Post','Application','Screening','Interview','Hire'],
    [100,30,15,8,3],
    'Hires = Postings × Apply_Rate × Screen_Pass × Interview_CVR × Offer_Accept',
    ['求人SEO','ATS連携','自動スクリーニング','面接スケジューラ','オファー管理'],
    ['Job SEO','ATS integration','Auto screening','Interview scheduler','Offer management'],
    ['無料:3求人/月','Standard:¥50,000/月','Enterprise:¥200,000/月'],
    ['Free:3 posts/mo','Standard:$500/mo','Enterprise:$2,000/mo']
  ),
  health:_dg(
    ['登録','初回記録','習慣化(7日)','アクティブ継続','プレミアム'],
    ['Register','First Log','Habit(7d)','Active','Premium'],
    [100,55,30,18,5],
    'Revenue = Users × First_Log × Habit × Active × Premium_CVR × ARPU',
    ['広告/医療機関提携','入力簡素化','リマインダー/報酬','データ可視化','AI分析/コーチング'],
    ['Ads/clinic partnership','Simplify input','Reminder/reward','Data visualization','AI analysis/coaching'],
    ['Free:基本記録','Pro:¥980/月','家族:¥2,480/月'],
    ['Free:basic log','Pro:$10/mo','Family:$25/mo']
  ),
  portfolio:_dg(
    ['サイト訪問','作品閲覧','問合せフォーム','ミーティング','契約'],
    ['Visit','Work View','Inquiry','Meeting','Contract'],
    [100,50,8,4,1.6],
    'Revenue = Visitors × View_Engage × Inquiry_CVR × Meeting × Contract_CVR × Project_Fee',
    ['SEO/SNS発信','作品質/量','CTA最適化','オンライン面談','見積自動化'],
    ['SEO/SNS','Portfolio quality/quantity','Optimize CTA','Online meeting','Auto quote'],
    ['無料:基本サイト','Pro:¥980/月(独自ドメイン)','ビジネス:¥2,980/月(分析)'],
    ['Free:basic','Pro:$10/mo(custom domain)','Business:$30/mo(analytics)']
  ),
  tool:_dg(
    ['発見','インストール/登録','初回利用','日常利用','有料化'],
    ['Discovery','Install/Register','First Use','Daily Use','Monetize'],
    [100,40,25,12,3],
    'Revenue = Installs × First_Use × Daily_Use × Paid_CVR × ARPU',
    ['App Store最適化','オンボーディング','リマインダー','習慣形成','プレミアム訴求'],
    ['App Store optimization','Onboarding','Reminders','Habit formation','Premium pitch'],
    ['Free:基本機能','Pro:¥500/月','ライフタイム:¥4,980'],
    ['Free:basic','Pro:$5/mo','Lifetime:$50']
  ),
  ai:_dg(
    ['サインアップ','初回プロンプト','アクティブ利用','習慣化','Pro升級'],
    ['Signup','First Prompt','Active Use','Habit','Pro Upgrade'],
    [100,70,45,25,8],
    'Revenue = Signups × First_Prompt × Active × Habit × Pro_CVR × ARPU',
    ['無料枠拡大','プロンプトテンプレート','品質向上','使い放題訴求','API提供'],
    ['Expand free tier','Prompt templates','Quality improvement','Unlimited pitch','API access'],
    ['Free:20回/月','Pro:¥2,000/月(無制限)','Enterprise:¥20,000/月(API)'],
    ['Free:20/mo','Pro:$20/mo(unlimited)','Enterprise:$200/mo(API)']
  ),
  automation:_dg(
    ['トライアル','初ワークフロー作成','自動化運用','複数フロー拡大','エンタープライズ'],
    ['Trial','First Workflow','Automation Ops','Multi-Flow','Enterprise'],
    [100,50,30,15,5],
    'ARR = Trials × First_Flow × Ops × Multi × Enterprise_CVR × ACV',
    ['テンプレート充実','ノーコードUI','インテグレーション拡大','エラーハンドリング','SLA保証'],
    ['Rich templates','No-code UI','Expand integrations','Error handling','SLA guarantee'],
    ['Free:3フロー','Pro:¥5,000/月(無制限)','Enterprise:¥50,000/月(専用サポート)'],
    ['Free:3 flows','Pro:$50/mo(unlimited)','Enterprise:$500/mo(dedicated support)']
  ),
  event:_dg(
    ['イベント発見','詳細閲覧','チケット購入','イベント参加','リピート参加'],
    ['Discover','View Details','Buy Ticket','Attend','Repeat'],
    [100,40,12,10,4],
    'Revenue = Events × View × Purchase × Attend × Repeat × Ticket_Price × Commission',
    ['SEO/SNS拡散','イベント詳細充実','決済UX簡素化','リマインダー','フォローアップ'],
    ['SEO/SNS spread','Rich event details','Simple checkout','Reminders','Follow-up'],
    ['掲載無料→チケット手数料10%','有料掲載:¥5,000/月','スポンサー枠:¥50,000'],
    ['Free list→10% ticket fee','Paid list:$50/mo','Sponsor:$500']
  ),
  gamify:_dg(
    ['ユーザー登録','初アチーブメント','デイリーアクティブ','ランキング参加','課金'],
    ['Register','First Achievement','Daily Active','Ranking','Pay'],
    [100,70,40,20,5],
    'Revenue = Users × First_Achieve × DAU × Ranking × Pay_CVR × ARPPU',
    ['チュートリアル充実','早期報酬','デイリーミッション','競争要素','限定アイテム'],
    ['Rich tutorial','Early reward','Daily mission','Competition','Limited items'],
    ['無料:基本プレイ','月額:¥980','アイテム:¥120-¥10,000'],
    ['Free:basic','Monthly:$10','Items:$1-$100']
  ),
  collab:_dg(
    ['招待/登録','初回編集','日常コラボ','チーム拡大','エンタープライズ'],
    ['Invite/Register','First Edit','Daily Collab','Team Expand','Enterprise'],
    [100,60,40,20,6],
    'ARR = Invites × First_Edit × Daily × Team_Expand × Enterprise_CVR × ACV',
    ['招待インセンティブ','リアルタイム同期品質','通知最適化','ロール/権限管理','SSO/監査ログ'],
    ['Invite incentive','Real-time sync quality','Optimize notifications','Role/permission','SSO/audit log'],
    ['Free:3人','Team:¥1,500/月(10人)','Enterprise:¥15,000/月(無制限)'],
    ['Free:3users','Team:$15/mo(10)','Enterprise:$150/mo(unlimited)']
  ),
  devtool:_dg(
    ['発見','APIキー発行','初回コール','統合完了','有料化'],
    ['Discovery','API Key','First Call','Integration','Monetize'],
    [100,50,35,20,6],
    'Revenue = Signups × Key_Issue × First_Call × Integration × Paid_CVR × ARPU',
    ['ドキュメント充実','Playground提供','SDK/ライブラリ','Rate limit最適化','エンタープライズサポート'],
    ['Rich docs','Playground','SDK/library','Optimize rate limit','Enterprise support'],
    ['Free:1,000リクエスト/月','Pro:¥5,000/月(10万)','Enterprise:¥50,000/月(無制限)'],
    ['Free:1,000/mo','Pro:$50/mo(100k)','Enterprise:$500/mo(unlimited)']
  ),
  creator:_dg(
    ['フォロー','無料コンテンツ閲覧','購読登録','投げ銭/購入','スーパーファン'],
    ['Follow','Free Content','Subscribe','Tip/Buy','Super Fan'],
    [100,60,15,6,1.5],
    'Revenue = Followers × Free_View × Subscribe_CVR × Tip_Rate × Super_Fan × ARPPU',
    ['SNS連携','無料コンテンツ品質','購読特典充実','投げ銭導線','限定コンテンツ'],
    ['SNS integration','Free content quality','Rich subscriber perks','Tip flow','Exclusive content'],
    ['無料:基本閲覧','購読:¥500-2,000/月','投げ銭:¥100-10,000'],
    ['Free:basic','Subscribe:$5-20/mo','Tip:$1-100']
  ),
  newsletter:_dg(
    ['ランディング','購読登録','メール開封','リンククリック','有料転換/紹介'],
    ['Landing','Subscribe','Email Open','Click','Paid/Refer'],
    [100,25,15,6,1.5],
    'Revenue = Visits × Subscribe × Open × Click × Paid_CVR × ARPU',
    ['LP最適化','ダブルオプトイン','件名A/Bテスト','CTAクリア化','有料版訴求'],
    ['Optimize LP','Double opt-in','Subject A/B test','Clear CTA','Paid pitch'],
    ['無料:月4通','Pro:¥980/月(週刊)','スポンサー枠:¥50,000'],
    ['Free:4/mo','Pro:$10/mo(weekly)','Sponsor slot:$500']
  ),
  manufacturing:_dg(
    ['需要予測','生産開始','品質検査','出荷完了','リピート発注'],
    ['Forecast','Start Production','Quality Check','Ship','Reorder'],
    [100,85,75,70,35],
    'Revenue = Orders × Production × Quality_Pass × Ship × Reorder × Unit_Price',
    ['需要予測AI','生産効率化','全数検査','納期厳守','品質実績'],
    ['Forecast AI','Production efficiency','100% inspection','On-time delivery','Quality track record'],
    ['標準:¥500/個','量産:¥300/個','カスタム:¥1,000/個'],
    ['Standard:$5/unit','Mass:$3/unit','Custom:$10/unit']
  ),
  logistics:_dg(
    ['発注','引当','出荷','配送','完了'],
    ['Order','Allocate','Ship','Deliver','Complete'],
    [100,90,85,80,75],
    'Revenue = Orders × Allocation × Ship × Delivery × Complete × Delivery_Fee',
    ['リアルタイム在庫','AI配送最適化','追跡通知','不在対策','再配達削減'],
    ['Real-time inventory','AI route optimization','Tracking alerts','Absence handling','Redelivery reduction'],
    ['通常:¥500/個','速達:¥800/個','当日:¥1,500/個'],
    ['Standard:$5','Express:$8','Same-day:$15']
  ),
  agriculture:_dg(
    ['播種','育成','モニタリング','収穫','出荷'],
    ['Sow','Grow','Monitor','Harvest','Ship'],
    [100,90,85,75,60],
    'Revenue = Plots × Grow × Monitor × Harvest × Ship × Price_per_kg',
    ['適期播種','IoTモニタリング','病害早期検知','収穫タイミング最適化','品質選別'],
    ['Optimal sowing','IoT monitoring','Early pest detection','Harvest timing optimization','Quality sorting'],
    ['A級:¥300/kg','B級:¥150/kg','加工用:¥50/kg'],
    ['Grade-A:$3/kg','Grade-B:$1.5/kg','Processing:$0.5/kg']
  ),
  energy:_dg(
    ['契約','メーター設置','定期計測','請求','継続'],
    ['Contract','Meter Install','Measure','Bill','Renew'],
    [100,95,90,88,80],
    'Revenue = Contracts × Install × Measure × Bill × Renew × Unit_Price',
    ['プラン提案','スマートメーター','AI需給予測','自動請求','省エネ提案'],
    ['Plan proposals','Smart meters','AI forecast','Auto-billing','Energy-saving tips'],
    ['基本:¥20/kWh','ピーク:¥30/kWh','夜間:¥10/kWh'],
    ['Basic:$0.20/kWh','Peak:$0.30/kWh','Night:$0.10/kWh']
  ),
  media:_dg(
    ['発見','視聴開始','習慣視聴','サブスク登録','継続'],
    ['Discover','Start Watching','Habit','Subscribe','Retain'],
    [100,60,35,10,7],
    'Revenue = Visitors × Start × Habit × Subscribe × Retain × ARPU + Ad_Revenue',
    ['SEO/SNS拡散','レコメンド精度','オリジナルコンテンツ','プレミアム訴求','継続特典'],
    ['SEO/SNS spread','Recommendation accuracy','Original content','Premium pitch','Retention perks'],
    ['無料:広告付き','ベーシック:¥980/月','プレミアム:¥1,980/月'],
    ['Free:with ads','Basic:$10/mo','Premium:$20/mo']
  ),
  government:_dg(
    ['認知','アカウント登録','初回申請','定期利用','推奨'],
    ['Awareness','Register','First Application','Regular Use','Recommend'],
    [100,45,30,15,8],
    'Usage = Citizens × Register × First_App × Regular × Satisfaction',
    ['広報強化','オンライン化促進','UI簡素化','窓口サポート','利便性向上'],
    ['PR enhancement','Online promotion','UI simplification','Counter support','Convenience improvement'],
    ['基本:無料','証明書発行:¥300','速達:¥500'],
    ['Basic:free','Certificate:$3','Express:$5']
  ),
  travel:_dg(
    ['検索','比較','予約','旅行完了','リピート'],
    ['Search','Compare','Book','Travel','Repeat'],
    [100,50,15,12,4],
    'Revenue = Searches × Compare × Book × Travel × Repeat × Avg_Booking × Commission',
    ['比較機能充実','価格保証','レビュー表示','サポート24h','リピート特典'],
    ['Rich comparison','Price guarantee','Review display','24h support','Repeat perks'],
    ['手数料:8%','プレミアム会員:¥5,000/年','保険:¥2,000/旅行'],
    ['Commission:8%','Premium membership:$50/yr','Insurance:$20/trip']
  ),
  insurance:_dg(
    ['見積取得','比較検討','契約','請求利用','継続'],
    ['Get Quote','Compare','Contract','Claim','Renew'],
    [100,60,25,15,12],
    'Revenue = Quotes × Compare × Contract × Premium × Renew',
    ['見積簡素化','プラン比較ツール','オンライン契約','請求サポート','継続割引'],
    ['Simplified quotes','Plan comparison tool','Online contract','Claims support','Renewal discount'],
    ['基本:¥3,000/月','充実:¥5,000/月','プレミアム:¥10,000/月'],
    ['Basic:$30/mo','Enhanced:$50/mo','Premium:$100/mo']
  ),
  _default:_dg(
    ['認知','登録','利用開始','習慣化','課金/推薦'],
    ['Awareness','Register','First Use','Habit','Pay/Refer'],
    [100,25,12,5,2],
    'Revenue = Users × Activation × Retention × ARPU',
    ['認知拡大(SEO/SNS)','登録フロー簡素化','Aha体験短縮','通知/メール','価格最適化'],
    ['Awareness (SEO/SNS)','Simplify registration','Shorten Aha moment','Push/email','Optimize pricing'],
    ['Free:基本','Standard:¥980/月','Premium:¥4,980/月'],
    ['Free:basic','Standard:$10/mo','Premium:$50/mo']
  )
};

// ── Domain Ops Intelligence (SLO, Feature Flags, Jobs, Backup, Hardening) ──
const _dop=(slo,fj,fe,jj,je,bj,be,hj,he)=>({slo,flags_ja:fj,flags_en:fe,jobs_ja:jj,jobs_en:je,backup_ja:bj,backup_en:be,hardening_ja:hj,hardening_en:he});

const DOMAIN_OPS={
  fintech:_dop('99.99%',
    ['取引停止キルスイッチ','送金上限フラグ','メンテナンスモード'],
    ['Transaction kill switch','Transfer limit flag','Maintenance mode'],
    ['日次残高照合バッチ','不正検知スコアリング','利息計算ジョブ'],
    ['Daily balance reconciliation','Fraud detection scoring','Interest calculation job'],
    ['WAL+S3 (RPO:1min,RTO:15min)','PITR必須、トランザクションログ保持7年'],
    ['WAL+S3 (RPO:1min,RTO:15min)','PITR required, txn logs 7yr retention'],
    ['冪等性キー必須','監査ログHMAC署名','SELECT FOR UPDATE必須','金額はDecimal型'],
    ['Idempotency key required','Audit log HMAC signature','SELECT FOR UPDATE mandatory','Amount as Decimal type']),
  health:_dop('99.99%',
    ['診断機能停止スイッチ','処方箋発行制限','緊急メンテナンス'],
    ['Diagnostic feature kill switch','Prescription issuance limit','Emergency maintenance'],
    ['健康データ匿名化バッチ','リマインダー通知ジョブ','バイタルデータ集計'],
    ['Health data anonymization batch','Reminder notification job','Vital data aggregation'],
    ['暗号化バックアップ (RPO:5min,RTO:30min)','HIPAA準拠ストレージ、90日保持'],
    ['Encrypted backup (RPO:5min,RTO:30min)','HIPAA-compliant storage, 90d retention'],
    ['PHI暗号化必須(AES-256)','アクセスログ全件記録','禁忌チェック必須','BAA契約必須'],
    ['PHI encryption required (AES-256)','All access logged','Contraindication check mandatory','BAA contract required']),
  education:_dop('99.9%',
    ['学習コンテンツ配信停止','試験モード切替','新規登録制限'],
    ['Content delivery pause','Exam mode toggle','Registration limit'],
    ['進捗データ日次集計','証明書発行ジョブ','学習リマインダー'],
    ['Daily progress aggregation','Certificate issuance job','Learning reminders'],
    ['差分バックアップ日次 (RPO:1day,RTO:4h)','成績データ5年保持(FERPA)'],
    ['Daily differential backup (RPO:1day,RTO:4h)','Grade data 5yr retention (FERPA)'],
    ['進捗データIndexedDB保存','カンニング検知ログ','保護者同意記録','タイムアウト自動保存'],
    ['Progress to IndexedDB','Cheating detection logs','Parental consent records','Auto-save on timeout']),
  ec:_dop('99.95%',
    ['決済機能停止','在庫同期停止','カート機能制限'],
    ['Payment feature disable','Inventory sync pause','Cart feature limit'],
    ['在庫同期ジョブ(5分毎)','カゴ落ちメール送信','売上集計バッチ'],
    ['Inventory sync job (every 5min)','Abandoned cart email','Sales aggregation batch'],
    ['時系列バックアップ毎時 (RPO:1h,RTO:2h)','トランザクションログ3年保持'],
    ['Hourly time-series backup (RPO:1h,RTO:2h)','Transaction logs 3yr retention'],
    ['在庫SELECT FOR UPDATE','決済冪等性キー','価格整数演算','二重決済防止ボタン無効化'],
    ['Inventory SELECT FOR UPDATE','Payment idempotency key','Price integer math','Double charge prevention button disable']),
  saas:_dop('99.9%',
    ['新規サインアップ制限','特定機能無効化','テナント分離強制モード'],
    ['Signup limit','Feature disable toggle','Tenant isolation enforce mode'],
    ['使用量集計ジョブ(1時間毎)','解約予測スコアリング','通知配信キュー'],
    ['Usage aggregation job (hourly)','Churn prediction scoring','Notification delivery queue'],
    ['増分バックアップ日次 (RPO:1day,RTO:4h)','テナントデータ隔離、30日削除猶予'],
    ['Daily incremental backup (RPO:1day,RTO:4h)','Tenant data isolation, 30d delete grace'],
    ['RLS必須(tenant_id)','Rate limit (100req/min)','オンボーディングツアー必須','API認証全エンドポイント'],
    ['RLS mandatory (tenant_id)','Rate limit (100req/min)','Onboarding tour required','API auth on all endpoints']),
  booking:_dop('99.9%',
    ['予約受付停止','空き枠更新停止','価格変更制限'],
    ['Booking intake pause','Availability update pause','Price change limit'],
    ['空き枠同期ジョブ(5分毎)','リマインダー送信(予約24h前)','キャンセル待ち通知'],
    ['Availability sync job (every 5min)','Reminder send (24h before)','Waitlist notification'],
    ['スナップショット毎時 (RPO:1h,RTO:2h)','予約履歴1年保持'],
    ['Hourly snapshot (RPO:1h,RTO:2h)','Booking history 1yr retention'],
    ['ダブルブッキング防止Lock','5分バッファ設定','SSE fallback実装','30分価格固定'],
    ['Double booking prevention lock','5min buffer','SSE fallback impl','30min price hold']),
  community:_dop('99.5%',
    ['投稿機能制限','モデレーション強化モード','通報処理優先'],
    ['Post feature limit','Moderation strict mode','Report processing priority'],
    ['スパム検知バッチ(10分毎)','通報審査キュー','エンゲージメント集計'],
    ['Spam detection batch (every 10min)','Report review queue','Engagement aggregation'],
    ['日次バックアップ (RPO:1day,RTO:6h)','投稿データ圧縮保存'],
    ['Daily backup (RPO:1day,RTO:6h)','Post data compressed storage'],
    ['XSS防止(DOMPurify+CSP)','Rate limit 5post/min','reCAPTCHA v3','フィルターバブル20%多様性注入'],
    ['XSS prevention (DOMPurify+CSP)','Rate limit 5post/min','reCAPTCHA v3','Filter bubble 20% diversity inject']),
  marketplace:_dop('99.5%',
    ['出品機能停止','取引エスクロー強制','評価投稿制限'],
    ['Listing feature pause','Escrow enforce','Review post limit'],
    ['マッチング最適化ジョブ','評価信頼性スコアリング','エスクロー解放バッチ'],
    ['Matching optimization job','Review trust scoring','Escrow release batch'],
    ['日次バックアップ (RPO:1day,RTO:4h)','取引履歴5年保持'],
    ['Daily backup (RPO:1day,RTO:4h)','Transaction history 5yr retention'],
    ['エスクロー48h保護','偽装評価検知(IPクラスタ)','手数料事前見積','販売者開示必須'],
    ['Escrow 48h protection','Fake review detection (IP cluster)','Fee pre-estimate','Seller disclosure required']),
  content:_dop('99.5%',
    ['記事公開停止','CDN配信制限','画像アップロード制限'],
    ['Article publish pause','CDN delivery limit','Image upload limit'],
    ['画像最適化バッチ','SEOサイトマップ生成','アクセス集計ジョブ'],
    ['Image optimization batch','SEO sitemap generation','Access aggregation job'],
    ['週次バックアップ (RPO:1week,RTO:12h)','記事3年保持'],
    ['Weekly backup (RPO:1week,RTO:12h)','Articles 3yr retention'],
    ['WebP自動変換','srcset生成','Lighthouse監視','構造化データJSON-LD'],
    ['Auto WebP conversion','srcset generation','Lighthouse monitoring','Structured data JSON-LD']),
  analytics:_dop('99.5%',
    ['ダッシュボード更新停止','リアルタイム集計制限','アラート送信制限'],
    ['Dashboard update pause','Realtime aggregation limit','Alert send limit'],
    ['事前集計バッチ(15分毎)','異常検知ジョブ','レポート生成キュー'],
    ['Pre-aggregation batch (every 15min)','Anomaly detection job','Report generation queue'],
    ['週次バックアップ (RPO:1week,RTO:8h)','ログ3ヶ月、集計1年保持'],
    ['Weekly backup (RPO:1week,RTO:8h)','Logs 3mo, aggregated 1yr retention'],
    ['Materialized view使用','Redis 5分キャッシュ','最低1000件サンプリング','3σ異常検知'],
    ['Use materialized views','Redis 5min cache','Minimum 1000 sample','3σ anomaly detection']),
  iot:_dop('99.5%',
    ['デバイス登録停止','データ収集制限','ファームウェア配信停止'],
    ['Device registration pause','Data collection limit','Firmware distribution pause'],
    ['センサーデータ集計(1分毎)','異常値アラートジョブ','バッテリー状態監視'],
    ['Sensor data aggregation (every 1min)','Anomaly alert job','Battery status monitoring'],
    ['時系列DB (RPO:5min,RTO:30min)','センサーデータ3ヶ月保持'],
    ['Time-series DB (RPO:5min,RTO:30min)','Sensor data 3mo retention'],
    ['オフライン動作対応','指数バックオフ再送','A/Bパーティション','チェックサム検証'],
    ['Offline operation support','Exponential backoff retry','A/B partition','Checksum verification']),
  realestate:_dop('99.5%',
    ['物件登録停止','内見予約制限','契約署名停止'],
    ['Property registration pause','Viewing limit','Contract signing pause'],
    ['物件情報同期(1時間毎)','内見リマインダー送信','契約期限通知'],
    ['Property sync (hourly)','Viewing reminder send','Contract deadline notification'],
    ['日次バックアップ (RPO:1day,RTO:6h)','契約データ7年保持'],
    ['Daily backup (RPO:1day,RTO:6h)','Contract data 7yr retention'],
    ['Google Maps API緯度経度検証','内見重複防止Lock','クーリングオフ8日記録','重要事項説明ログ'],
    ['Google Maps API lat/long validation','Viewing conflict lock','8d cooling-off record','Important matters log']),
  legal:_dop('99.9%',
    ['契約生成停止','承認フロー強制','期限アラート制限'],
    ['Contract generation pause','Approval flow enforce','Deadline alert limit'],
    ['期限リマインダー(3段階)','バージョン履歴保存','監査ログ集計'],
    ['Deadline reminder (3-tier)','Version history save','Audit log aggregation'],
    ['暗号化バックアップ日次 (RPO:1day,RTO:4h)','契約10年保持'],
    ['Encrypted daily backup (RPO:1day,RTO:4h)','Contracts 10yr retention'],
    ['契約テンプレート変数チェックリスト','diff表示必須','ロック機能','電子署名タイムスタンプ'],
    ['Contract template variable checklist','Diff display required','Lock feature','E-signature timestamp']),
  hr:_dop('99.5%',
    ['応募受付停止','評価記録制限','給与計算停止'],
    ['Application intake pause','Evaluation record limit','Payroll calculation pause'],
    ['勤怠集計バッチ(日次)','給与計算ジョブ(月次)','応募者リマインダー'],
    ['Attendance aggregation batch (daily)','Payroll calculation job (monthly)','Applicant reminder'],
    ['日次バックアップ (RPO:1day,RTO:6h)','勤怠3年、応募者1年保持'],
    ['Daily backup (RPO:1day,RTO:6h)','Attendance 3yr, applicants 1yr retention'],
    ['TZ統一(UTC)','深夜割増22-5時','360度評価','不適切質問禁止チェック'],
    ['Unify TZ (UTC)','Late-night premium 10PM-5AM','360 review','Inappropriate question check']),
  portfolio:_dop('99%',
    ['問合せフォーム停止','画像アップロード制限','プロジェクト公開制限'],
    ['Contact form pause','Image upload limit','Project publish limit'],
    ['画像最適化バッチ','アクセス解析集計','SEOスコア計測'],
    ['Image optimization batch','Access analytics aggregation','SEO score measurement'],
    ['週次バックアップ (RPO:1week,RTO:24h)','作品データ3年保持'],
    ['Weekly backup (RPO:1week,RTO:24h)','Work data 3yr retention'],
    ['WebP+srcset','Lazy loading','OGP生成','Core Web Vitals監視(LCP≤2.5s)'],
    ['WebP+srcset','Lazy loading','OGP generation','Core Web Vitals monitoring (LCP≤2.5s)']),
  tool:_dop('99%',
    ['エクスポート制限','自動化実行停止','API連携制限'],
    ['Export limit','Automation execution pause','API integration limit'],
    ['エクスポートキュー','自動化スケジューラー','設定同期バッチ'],
    ['Export queue','Automation scheduler','Settings sync batch'],
    ['週次バックアップ (RPO:1week,RTO:12h)','設定データ1年保持'],
    ['Weekly backup (RPO:1week,RTO:12h)','Settings data 1yr retention'],
    ['UTF-8 BOM対応','CSV区切り文字検証','ショートカット競合回避','Polyfill使用'],
    ['UTF-8 BOM support','CSV delimiter validation','Shortcut conflict avoidance','Use polyfills']),
  ai:_dop('99%',
    ['プロンプト送信制限','生成停止','トークン上限強制'],
    ['Prompt send limit','Generation pause','Token limit enforce'],
    ['トークン集計ジョブ','コスト最適化分析','キャッシュ整理'],
    ['Token aggregation job','Cost optimization analysis','Cache cleanup'],
    ['週次バックアップ (RPO:1week,RTO:12h)','プロンプト履歴暗号化保存90日'],
    ['Weekly backup (RPO:1week,RTO:12h)','Prompt history encrypted 90d retention'],
    ['プロンプト暗号化','トークン>1000要約','重複キャッシュ','アクセス制御'],
    ['Prompt encryption','Token>1000 summarize','Duplicate cache','Access control']),
  automation:_dop('99%',
    ['ワークフロー実行停止','トリガー無効化','通知送信制限'],
    ['Workflow execution pause','Trigger disable','Notification send limit'],
    ['ワークフロー実行ログ','リトライキュー','実行時間最適化分析'],
    ['Workflow execution logs','Retry queue','Execution time optimization analysis'],
    ['週次バックアップ (RPO:1week,RTO:12h)','実行履歴3ヶ月保持'],
    ['Weekly backup (RPO:1week,RTO:12h)','Execution history 3mo retention'],
    ['最大実行回数制限','指数バックオフ','タイムアウト設定','無限ループ防止'],
    ['Max execution limit','Exponential backoff','Timeout config','Infinite loop prevention']),
  event:_dop('99.5%',
    ['チケット販売停止','QR検証制限','キャンセル処理停止'],
    ['Ticket sales pause','QR verification limit','Cancel processing pause'],
    ['在庫同期ジョブ(5分毎)','リマインダー送信(開催1日前)','入場QR生成'],
    ['Inventory sync job (every 5min)','Reminder send (1d before)','Entry QR generation'],
    ['時系列バックアップ (RPO:1h,RTO:2h)','チケット履歴5年保持'],
    ['Time-series backup (RPO:1h,RTO:2h)','Ticket history 5yr retention'],
    ['定員超過防止Lock','UUID QR生成','QR検証チェック','返金規定明記'],
    ['Oversell prevention lock','UUID QR generation','QR verification check','Refund policy explicit']),
  gamify:_dop('99%',
    ['ポイント付与停止','ランキング更新制限','バッジ獲得停止'],
    ['Point grant pause','Leaderboard update limit','Badge unlock pause'],
    ['ポイント集計ジョブ','ランキング更新バッチ','不正行動検知'],
    ['Point aggregation job','Leaderboard update batch','Fraud behavior detection'],
    ['日次バックアップ (RPO:1day,RTO:6h)','ポイント履歴1年保持'],
    ['Daily backup (RPO:1day,RTO:6h)','Point history 1yr retention'],
    ['ポイントトランザクション','重複付与防止','異常行動検知','ランキング精度100%'],
    ['Point transaction','Duplicate grant prevention','Anomaly behavior detection','Leaderboard accuracy 100%']),
  collab:_dop('99.5%',
    ['編集機能制限','リアルタイム同期停止','共有制限'],
    ['Edit feature limit','Realtime sync pause','Share limit'],
    ['競合解決ジョブ','定期保存(30秒毎)','バージョン履歴保存'],
    ['Conflict resolution job','Periodic save (every 30s)','Version history save'],
    ['日次バックアップ (RPO:1day,RTO:4h)','編集履歴30日保持'],
    ['Daily backup (RPO:1day,RTO:4h)','Edit history 30d retention'],
    ['OT/CRDT実装','定期保存30秒','RLS権限検証','アクセスログ記録'],
    ['OT/CRDT implementation','Periodic save 30s','RLS permission verification','Access log recording']),
  devtool:_dop('99.5%',
    ['APIキー発行停止','レート制限強化','リクエスト制限'],
    ['API key issuance pause','Rate limit strict','Request limit'],
    ['使用量集計ジョブ','エラー率監視','キーローテーション'],
    ['Usage aggregation job','Error rate monitoring','Key rotation'],
    ['日次バックアップ (RPO:1day,RTO:6h)','リクエストログ90日保持'],
    ['Daily backup (RPO:1day,RTO:6h)','Request logs 90d retention'],
    ['APIキー暗号化','定期ローテーション','IP制限','Redis sliding window'],
    ['API key encryption','Regular rotation','IP restriction','Redis sliding window']),
  creator:_dop('99.5%',
    ['課金処理停止','投げ銭制限','サブスク新規停止'],
    ['Billing process pause','Tip limit','Subscription signup pause'],
    ['課金処理ジョブ','Webhook検証','解約処理バッチ'],
    ['Billing process job','Webhook verification','Cancellation batch'],
    ['日次バックアップ (RPO:1day,RTO:4h)','課金履歴7年保持'],
    ['Daily backup (RPO:1day,RTO:4h)','Billing history 7yr retention'],
    ['Webhook検証必須','解約後課金防止','定期確認','決済リトライ'],
    ['Webhook verification required','Prevent charge after cancel','Periodic check','Payment retry']),
  newsletter:_dop('99%',
    ['配信停止','購読登録制限','解除処理制限'],
    ['Delivery pause','Subscription limit','Unsubscribe processing limit'],
    ['配信キュー','開封率集計','クリック率分析'],
    ['Delivery queue','Open rate aggregation','Click rate analysis'],
    ['週次バックアップ (RPO:1week,RTO:12h)','購読者データ3年保持'],
    ['Weekly backup (RPO:1week,RTO:12h)','Subscriber data 3yr retention'],
    ['SPF/DKIM設定','解除即時反映','定期同期','レピュテーション管理'],
    ['SPF/DKIM setup','Immediate unsubscribe reflect','Periodic sync','Reputation management']),
  manufacturing:_dop('99.9%',
    ['生産ライン停止','品質検査強化モード','出荷制限'],
    ['Production line stop','Enhanced quality inspection mode','Shipping limit'],
    ['生産計画最適化バッチ','在庫差異調整ジョブ','設備保全スケジューラ'],
    ['Production plan optimization batch','Inventory variance adjustment job','Equipment maintenance scheduler'],
    ['日次バックアップ+WAL (RPO:1h,RTO:4h)','生産データ5年保持(製造物責任法)'],
    ['Daily backup+WAL (RPO:1h,RTO:4h)','Production data 5yr retention (Product Liability Act)'],
    ['全数検査記録','トレーサビリティ確保','冪等性キー(在庫操作)','ロット番号必須'],
    ['100% inspection record','Ensure traceability','Idempotency key (inventory ops)','Lot number required']),
  logistics:_dop('99.9%',
    ['配送受付停止','緊急配送優先モード','ルート変更制限'],
    ['Delivery acceptance stop','Emergency delivery priority mode','Route change limit'],
    ['配送ルート最適化バッチ','追跡情報同期ジョブ','配送完了通知キュー'],
    ['Delivery route optimization batch','Tracking info sync job','Delivery completion notification queue'],
    ['日次バックアップ (RPO:4h,RTO:8h)','配送履歴3年保持'],
    ['Daily backup (RPO:4h,RTO:8h)','Delivery history 3yr retention'],
    ['GPS精度検証','在庫ロック必須','配送状態追跡','温度ログ(冷蔵品)'],
    ['GPS accuracy verification','Inventory lock required','Delivery status tracking','Temperature log (refrigerated)']),
  agriculture:_dop('99%',
    ['灌漑システム停止','収穫作業制限','センサー校正モード'],
    ['Irrigation system stop','Harvest operation limit','Sensor calibration mode'],
    ['気象データ同期','収穫予測バッチ','病害検知ジョブ'],
    ['Weather data sync','Harvest prediction batch','Pest detection job'],
    ['週次バックアップ (RPO:1day,RTO:24h)','生育データ3年保持'],
    ['Weekly backup (RPO:1day,RTO:24h)','Growth data 3yr retention'],
    ['センサー冗長化','異常値アラート','定期校正','トレーサビリティ記録'],
    ['Sensor redundancy','Anomaly alert','Periodic calibration','Traceability record']),
  energy:_dop('99.99%',
    ['計測停止(緊急時)','料金計算制限','需給調整モード'],
    ['Metering stop (emergency)','Billing calculation limit','Supply-demand adjustment mode'],
    ['メーター読取バッチ','需給予測ジョブ','請求計算バッチ'],
    ['Meter reading batch','Supply-demand forecast job','Billing calculation batch'],
    ['リアルタイムレプリケーション (RPO:1min,RTO:15min)','計測データ10年保持(電気事業法)'],
    ['Real-time replication (RPO:1min,RTO:15min)','Metering data 10yr retention (Electricity Act)'],
    ['計測精度±2%以内','冪等性キー必須','監査ログ全件','スマートメーター暗号化'],
    ['Metering accuracy ±2%','Idempotency key required','All audit logs','Smart meter encryption']),
  media:_dop('99.95%',
    ['ストリーミング配信停止','コンテンツアップロード制限','DRM強化モード'],
    ['Streaming distribution stop','Content upload limit','Enhanced DRM mode'],
    ['エンコーディングキュー','視聴履歴集計','レコメンド更新バッチ'],
    ['Encoding queue','Viewing history aggregation','Recommendation update batch'],
    ['日次バックアップ+CDN (RPO:12h,RTO:4h)','視聴履歴3年保持'],
    ['Daily backup+CDN (RPO:12h,RTO:4h)','Viewing history 3yr retention'],
    ['DRM保護必須','Multi-CDN構成','バッファリング<3%','著作権透かし埋込'],
    ['DRM protection required','Multi-CDN config','Buffering<3%','Copyright watermark embedding']),
  government:_dop('99.95%',
    ['申請受付停止','緊急メンテナンス','審査プロセス制限'],
    ['Application acceptance stop','Emergency maintenance','Review process limit'],
    ['申請データ集計','承認通知キュー','統計データ生成'],
    ['Application data aggregation','Approval notification queue','Statistical data generation'],
    ['日次バックアップ+監査ログ (RPO:1h,RTO:2h)','申請データ永久保持(公文書管理法)'],
    ['Daily backup+audit log (RPO:1h,RTO:2h)','Application data permanent retention (Public Records Act)'],
    ['個人情報暗号化必須','全操作監査ログ','RLS厳格適用','WCAG 2.2 AA準拠'],
    ['Personal info encryption required','All operations audit logged','Strict RLS application','WCAG 2.2 AA compliance']),
  travel:_dop('99.9%',
    ['予約受付停止','キャンセル処理制限','決済機能停止'],
    ['Booking acceptance stop','Cancellation processing limit','Payment feature stop'],
    ['在庫同期バッチ','予約確認通知','キャンセル料計算ジョブ'],
    ['Inventory sync batch','Booking confirmation notification','Cancellation fee calculation job'],
    ['日次バックアップ (RPO:4h,RTO:8h)','予約履歴5年保持(旅行業法)'],
    ['Daily backup (RPO:4h,RTO:8h)','Booking history 5yr retention (Travel Business Act)'],
    ['冪等性キー必須','在庫ロック','ダブルブッキング検証','キャンセルポリシー明記'],
    ['Idempotency key required','Inventory lock','Double booking verification','Clear cancellation policy']),
  insurance:_dop('99.99%',
    ['見積発行停止','請求受付制限','支払処理制限'],
    ['Quote issuance stop','Claim acceptance limit','Payment processing limit'],
    ['保険料計算バッチ','請求審査ジョブ','契約更新通知'],
    ['Premium calculation batch','Claim review job','Contract renewal notification'],
    ['リアルタイムレプリケーション (RPO:1min,RTO:15min)','契約データ永久保持(保険業法)'],
    ['Real-time replication (RPO:1min,RTO:15min)','Contract data permanent retention (Insurance Act)'],
    ['全取引監査ログ','見積計算検証','請求データ暗号化','不正検知AI'],
    ['All transaction audit logs','Quote calculation verification','Claim data encryption','Fraud detection AI']),
  _default:_dop('99%',
    ['メンテナンスモード','機能制限','新規登録停止'],
    ['Maintenance mode','Feature limit','Signup pause'],
    ['日次集計バッチ','通知送信キュー','データクリーンアップ'],
    ['Daily aggregation batch','Notification send queue','Data cleanup'],
    ['日次バックアップ (RPO:1day,RTO:12h)','ユーザーデータ1年保持'],
    ['Daily backup (RPO:1day,RTO:12h)','User data 1yr retention'],
    ['JWT検証全ルート','Rate limit適用','ページネーション(limit 20)','INDEX設定'],
    ['JWT validation all routes','Apply rate limit','Pagination (limit 20)','INDEX setup'])
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
  // C2b: API design docs mentioning API Gateway in BaaS project
  if(arch.pattern==='baas'){
    const apiDocContent=Object.keys(files).filter(k=>k.startsWith('docs/')&&/api/i.test(k)).map(k=>files[k]||'').join('\n');
    if(apiDocContent.includes('API Gateway')){
      findings.push({level:'warn',msg:G?'BaaS構成のAPIドキュメントにAPI Gatewayが記載されています':'API Gateway referenced in API docs for BaaS architecture'});
    }
  }
  if(arch.pattern==='bff'&&techPlan.includes('api/')){
    // Only warn if separate api/ directory exists (should use app/api/)
    if(techPlan.includes('├── api/')){
      findings.push({level:'warn',msg:G?'BFF構成では api/ ディレクトリは不要です（app/api/ を使用）':'BFF pattern should not have separate api/ directory (use app/api/)'});
    }
  }

  // C3: Scope vs features conflict (answers-level check)
  const scopeOut=(a.scope_out||'').toLowerCase();
  const mobileAns=(a.mobile||'').toLowerCase();
  if((scopeOut.includes('ネイティブ')||scopeOut.includes('native'))&&(mobileAns.includes('expo')||mobileAns.includes('react native')||mobileAns.includes('flutter'))){
    findings.push({level:'warn',msg:G?'scope_outにネイティブアプリがありますがmobile設定と矛盾しています':'scope_out excludes native but mobile answer uses a native framework'});
  }
  // C3b: Check generated spec files too
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
    findings.push({level:'warn',msg:G?'Next.jsなのに.envにVITE_があります':'Next.js but .env uses VITE_ prefix'});
  }

  // C9: Monitoring matches deploy target (check all monitoring docs)
  const deploy=a.deploy||'';
  const allMonContent=Object.keys(files).filter(k=>k.startsWith('docs/')&&/monitor/i.test(k)).map(k=>files[k]||'').join('\n');
  const monCheck=(allMonContent||files['docs/17_monitoring.md']||'');
  if(!deploy.includes('Vercel')&&monCheck.includes('Vercel Analytics')){
    findings.push({level:'warn',msg:G?'デプロイ先がVercelではないのにVercel Analyticsが記載されています':'Non-Vercel deploy but Vercel Analytics in monitoring doc'});
  }

  // C10: BaaS should not have Prisma deps
  if(arch.isBaaS&&((pkg.devDependencies||{})['prisma']||deps['@prisma/client'])){
    findings.push({level:'warn',msg:G?'BaaS構成なのにPrisma依存があります':'BaaS stack but Prisma dependencies present'});
  }

  return findings;
}

// ── D: Architecture Integrity Check Report (docs/82) ──
function genArchIntegrityCheck(files,a,compatResults,auditFindings){
  const G=S.genLang==='ja';
  const rows=[];
  let redCount=0,orangeCount=0,yellowCount=0;

  // 1. compat violations (ERROR/WARN only)
  (compatResults||[]).forEach(function(r){
    if(r.level==='error'){
      redCount++;
      rows.push({loc:r.id||'compat',src:'compat-rules.js',issue:r.msg,
        sev:'🔴 ERROR',fix:r.fix||(G?'スタック設定を見直してください':'Review stack configuration')});
    }else if(r.level==='warn'){
      orangeCount++;
      rows.push({loc:r.id||'compat',src:'compat-rules.js',issue:r.msg,
        sev:'🟠 WARN',fix:r.fix||(G?'設定を確認してください':'Check configuration')});
    }
  });

  // 2. audit findings (ERROR/WARN only)
  (auditFindings||[]).forEach(function(f){
    if(f.level==='error'){
      redCount++;
      rows.push({loc:'docs/*.md',src:'postGenerationAudit',issue:f.msg,
        sev:'🔴 ERROR',fix:G?'生成後チェック参照':'See post-generation audit'});
    }else if(f.level==='warn'){
      orangeCount++;
      rows.push({loc:'docs/*.md',src:'postGenerationAudit',issue:f.msg,
        sev:'🟠 WARN',fix:G?'生成後チェック参照':'See post-generation audit'});
    }
  });

  // 3. New architecture checks
  const be=a.backend||'';
  const orm=a.orm||'';
  const arch=resolveArch(a);
  const isBaaS=arch.isBaaS;
  const isPy=/Python|Django|FastAPI/i.test(be);
  const isGo=/\bGo\b|Golang/.test(be);

  // C-A: ORM-Backend language compatibility
  if(!isBaaS){
    if(isPy&&orm&&!orm.includes('SQLAlchemy')&&!isNone(orm)){
      redCount++;
      rows.push({loc:'answers.backend+orm',src:G?'アーキテクチャチェック':'Architecture check',
        issue:G?'Python/FastAPI/DjangoバックエンドにはSQLAlchemyが適切ですが、'+orm+'が選択されています':
               'Python/FastAPI/Django backend should use SQLAlchemy, but '+orm+' is selected',
        sev:'🔴 ERROR',fix:G?'ORM選択をSQLAlchemyに変更してください':'Change ORM selection to SQLAlchemy'});
    }
    if(isGo&&orm&&(orm.includes('Prisma')||orm.includes('SQLAlchemy'))&&!isNone(orm)){
      orangeCount++;
      rows.push({loc:'answers.backend+orm',src:G?'アーキテクチャチェック':'Architecture check',
        issue:G?'GoバックエンドにはGORM/sqlxが適切ですが、'+orm+'が選択されています':
               'Go backend should use GORM/sqlx, but '+orm+' is selected',
        sev:'🟠 WARN',fix:G?'ORM選択をGORM/sqlxに変更してください':'Change ORM to GORM/sqlx'});
    }
  }

  // C-C: CORS configuration for split deployment
  if(arch.pattern==='split'){
    const corsPresent=Object.values(files).some(function(v){return (v||'').includes('CORS')||(v||'').includes('cors');});
    if(!corsPresent){
      orangeCount++;
      rows.push({loc:'.claude/rules/backend.md',src:G?'アーキテクチャチェック':'Architecture check',
        issue:G?'フロント/バック分離構成ではCORS設定が必要ですが、生成ドキュメントに記述がありません':
               'Split deployment requires CORS configuration but none found in generated docs',
        sev:'🟠 WARN',fix:G?'backend.mdにCORS設定を追加してください':'Add CORS configuration to backend rules'});
    }
  }

  // C-D: Async infrastructure
  const feats=(a.mvp_features||'').toLowerCase();
  const hasAsync=feats.includes('バックグラウンド')||feats.includes('background')||
                 feats.includes('非同期')||feats.includes('async queue');
  if(hasAsync&&!isBaaS){
    const qPresent=Object.values(files).some(function(v){
      return (v||'').includes('BullMQ')||(v||'').includes('Celery')||(v||'').includes('Inngest');
    });
    if(!qPresent){
      yellowCount++;
      rows.push({loc:'docs/09_release_checklist.md',src:G?'アーキテクチャチェック':'Architecture check',
        issue:G?'非同期処理機能が要求されていますが、キューシステム(BullMQ/Celery/Inngest)の記述がありません':
               'Async processing required but no queue system (BullMQ/Celery/Inngest) found',
        sev:'🟡 INFO',fix:G?'BullMQ/Celery/Inngestを技術スタックに追加':'Add BullMQ/Celery/Inngest to tech stack'});
    }
  }

  // C-E: Soft delete middleware documentation
  const hasSoftDelete=Object.values(files).some(function(v){return (v||'').includes('deleted_at');});
  const hasMW=Object.values(files).some(function(v){
    return (v||'').includes('soft delete middleware')||(v||'').includes('論理削除ミドルウェア');
  });
  if(hasSoftDelete&&!hasMW){
    yellowCount++;
    rows.push({loc:'.spec/technical-plan.md',src:G?'アーキテクチャチェック':'Architecture check',
      issue:G?'deleted_atカラムが定義されていますが、論理削除ミドルウェアの説明がありません':
             'deleted_at columns defined but soft delete middleware description not found',
      sev:'🟡 INFO',fix:G?'ORMミドルウェアで論理削除フィルタを実装':'Implement soft delete filter in ORM middleware'});
  }

  // Score calculation
  const score=Math.max(0,10.0-redCount*1.0-orangeCount*0.5-yellowCount*0.25);
  const scoreStr=score.toFixed(1);
  const scoreEmoji=score>=9?'✅':score>=7?'⚠️':'❌';
  const scoreLabel=score>=9?(G?'優良 — 整合性が高い水準にあります':'Excellent — High integrity'):
    score>=7?(G?'良好 — 軽微な改善が必要です':'Good — Minor improvements needed'):
    (G?'要改善 — 構造的な問題があります':'Needs Improvement — Structural issues present');

  // Strengths
  const strengths=[];
  if(!redCount) strengths.push(G?'重大な整合性エラーなし':'No critical integrity errors');
  const authR=resolveAuth(a);
  if(authR.sot&&authR.sot!=='JWT + OAuth 2.0') strengths.push(G?'認証SoT明確: '+authR.sot:'Auth SoT clearly defined: '+authR.sot);
  if(arch.pattern) strengths.push(G?'アーキテクチャパターン確立: '+arch.pattern.toUpperCase():'Architecture pattern established: '+arch.pattern.toUpperCase());
  if(!isBaaS&&hasSoftDelete) strengths.push(G?'論理削除(deleted_at)スキーマ実装':'Soft delete (deleted_at) schema implemented');
  if(!strengths.length) strengths.push(G?'基本構成の確認が完了しています':'Basic configuration verification complete');

  // Weaknesses
  const weaknesses=[];
  if(redCount>0) weaknesses.push(G?redCount+'件のエラー修正が必要':redCount+' error(s) require immediate fix');
  if(orangeCount>0) weaknesses.push(G?orangeCount+'件の警告を確認してください':orangeCount+' warning(s) need review');
  if(yellowCount>0) weaknesses.push(G?yellowCount+'件の改善提案があります':yellowCount+' improvement suggestion(s)');
  if(!weaknesses.length) weaknesses.push(G?'重大な弱点なし':'No critical weaknesses identified');

  // Refactoring steps
  const steps=[];
  rows.filter(function(r){return r.sev.includes('ERROR');}).forEach(function(r,i){
    steps.push((i+1)+'. **['+(G?'エラー':'ERROR')+'] '+r.loc+'** — '+r.fix);
  });
  rows.filter(function(r){return r.sev.includes('WARN');}).slice(0,3).forEach(function(r){
    steps.push((steps.length+1)+'. **['+(G?'警告':'WARN')+'] '+r.loc+'** — '+r.fix);
  });
  if(!steps.length) steps.push(G?'1. 現在のアーキテクチャを維持し、定期的な整合性チェックを実施してください':
    '1. Maintain current architecture and perform periodic integrity checks');

  // Violation table
  const hdr1=G?'違反箇所':'Location';
  const hdr2=G?'定義元':'Source';
  const hdr3=G?'違反内容':'Issue';
  const hdr4=G?'深刻度':'Severity';
  const hdr5=G?'修正案':'Fix';
  const tableRows=rows.length?rows.map(function(r,i){
    return '| '+(i+1)+' | '+r.loc+' | '+r.src+' | '+r.issue+' | '+r.sev+' | '+r.fix+' |';
  }).join('\n'):(G?'| — | — | — | 違反なし ✅ | — | — |':'| — | — | — | No violations ✅ | — | — |');

  const now=new Date().toISOString().split('T')[0];
  const proj=(a.purpose||'N/A').slice(0,60);
  const titleJa='アーキテクチャ整合性チェック報告書';
  const titleEn='Architecture Integrity Check Report';

  files['docs/82_architecture_integrity_check.md']=
    '# '+titleJa+' / '+titleEn+'\n\n'+
    '> '+(G?'生成日: ':'Generated: ')+now+' | '+(G?'プロジェクト: ':'Project: ')+proj+'\n\n'+
    '## '+(G?'違反テーブル / Violation Table':'Violation Table / 違反テーブル')+'\n\n'+
    '| # | '+hdr1+' | '+hdr2+' | '+hdr3+' | '+hdr4+' | '+hdr5+' |\n'+
    '|---|------------|-------------|----------------|----------|-----------|\n'+
    tableRows+'\n\n'+
    '## '+(G?'アーキテクチャ適合スコア':'Architecture Compliance Score')+': '+scoreStr+'/10\n\n'+
    scoreEmoji+' '+scoreLabel+'\n\n'+
    '## '+(G?'評価理由 / Evaluation Rationale':'Evaluation Rationale / 評価理由')+'\n\n'+
    '### '+(G?'強み / Strengths':'Strengths / 強み')+'\n\n'+
    strengths.map(function(s){return '- '+s;}).join('\n')+'\n\n'+
    '### '+(G?'弱み / Weaknesses':'Weaknesses / 弱み')+'\n\n'+
    weaknesses.map(function(w){return '- '+w;}).join('\n')+'\n\n'+
    '## '+(G?'リファクタリング手順 / Refactoring Steps':'Refactoring Steps / リファクタリング手順')+'\n\n'+
    steps.join('\n')+'\n\n'+
    '---\n'+
    '*'+(G?'このレポートはDevForge v9により自動生成されました':'This report was auto-generated by DevForge v9')+'*\n';
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

// ═══ Pillar 11: Implementation Intelligence Data Structures ═══

// ── App Type Detection ──
function detectAppType(a){
  const fe=a.frontend||'';
  const be=a.backend||'';
  const mob=a.mobile||'none';

  // Realtime apps
  if((a.mvp_features||'').match(/(リアルタイム|realtime|チャット|chat|通知|notification|ライブ|live)/i)) return 'realtime';

  // Mobile-first
  if(mob!=='none'&&mob!=='なし') return 'mobile';

  // API-only (no frontend)
  if(isNone(fe)||fe==='API only') return 'api_only';

  // PWA
  if(fe.includes('PWA')||(a.mvp_features||'').includes('PWA')) return 'pwa';

  // SSR frameworks
  if(fe.includes('Next')||fe.includes('Nuxt')||fe.includes('Remix')||fe.includes('SvelteKit')) return 'ssr';

  // SPA default
  return 'spa';
}

// ── Domain-Specific Implementation Pattern Helper ──
function _dip(impl_ja,impl_en,pseudo,guard_ja,guard_en){
  return {impl_ja:impl_ja,impl_en:impl_en,pseudo:pseudo,guard_ja:guard_ja,guard_en:guard_en};
}

// ── Domain Implementation Patterns (32 domains) ──
const DOMAIN_IMPL_PATTERN={
  education:_dip(
    ['進捗トラッキングはイベントソーシングで実装','コース完了判定はサーバーサイドで検証','レッスン順序制御はFKと順序カラムで管理'],
    ['Implement progress tracking with event sourcing','Validate course completion server-side','Control lesson order with FK and sequence column'],
    'function trackProgress(userId,lessonId,courseId){\n  const event={type:"LESSON_COMPLETED",userId,lessonId,timestamp:Date.now()};\n  emit(event);\n  const progress=getLessonProgress(userId,courseId);\n  if(progress.completed===progress.total) emit({type:"COURSE_COMPLETED",userId,courseId});\n}',
    ['未完了レッスンへのスキップを防止','進捗率の逆戻り禁止','修了証明書の改ざん防止'],
    ['Prevent skipping to incomplete lessons','Disallow progress regression','Prevent certificate tampering']
  ),
  ec:_dip(
    ['在庫ロックは楽観的ロック(version列)で実装','決済は冪等性キー必須','カート→注文確定は2フェーズコミット'],
    ['Implement inventory locking with optimistic lock (version column)','Payment must use idempotency key','Cart to order confirmation uses 2-phase commit'],
    'function reserveInventory(productId,qty){\n  const row=db.query("SELECT stock,version FROM products WHERE id=? FOR UPDATE",[productId]);\n  if(row.stock<qty) throw new Error("Out of stock");\n  db.execute("UPDATE products SET stock=stock-?, version=version+1 WHERE id=? AND version=?",[qty,productId,row.version]);\n}',
    ['在庫数マイナス防止','同時購入による在庫過剰引当て','決済と在庫確保の不整合'],
    ['Prevent negative stock','Prevent over-allocation from concurrent purchases','Prevent payment-inventory inconsistency']
  ),
  fintech:_dip(
    ['残高更新はトランザクション必須','二重送金防止は送金テーブルにユニーク制約','監査ログはイミュータブルテーブル'],
    ['Balance updates require transactions','Prevent double transfers with unique constraint on transfer table','Audit logs use immutable table'],
    'function transfer(fromId,toId,amount,idempotencyKey){\n  db.transaction(()=>{\n    db.execute("INSERT INTO transfers (from_user,to_user,amount,idempotency_key) VALUES (?,?,?,?)",[fromId,toId,amount,idempotencyKey]);\n    db.execute("UPDATE accounts SET balance=balance-? WHERE user_id=?",[amount,fromId]);\n    db.execute("UPDATE accounts SET balance=balance+? WHERE user_id=?",[amount,toId]);\n    db.execute("INSERT INTO audit_logs (action,user_id,details) VALUES (?,?,?)",["TRANSFER",fromId,JSON.stringify({toId,amount})]);\n  });\n}',
    ['残高マイナス防止','送金の二重実行','監査ログの削除・改ざん'],
    ['Prevent negative balance','Prevent double execution of transfers','Prevent deletion/tampering of audit logs']
  ),
  health:_dip(
    ['患者データは暗号化カラムで保存','アクセスログは全操作記録','同意管理は専用テーブルで管理'],
    ['Store patient data in encrypted columns','Record all operations in access logs','Manage consent with dedicated table'],
    'function accessPatientRecord(doctorId,patientId,purpose){\n  if(!hasConsent(patientId,purpose)) throw new Error("No consent");\n  const record=db.query("SELECT decrypt(medical_data) FROM patients WHERE id=?",[patientId]);\n  db.execute("INSERT INTO access_logs (doctor_id,patient_id,purpose,timestamp) VALUES (?,?,?,?)",[doctorId,patientId,purpose,Date.now()]);\n  return record;\n}',
    ['同意なしアクセス防止','暗号化キー漏洩','アクセスログ削除'],
    ['Prevent access without consent','Prevent encryption key leakage','Prevent access log deletion']
  ),
  marketplace:_dip(
    ['取引エスクローはステートマシンで管理','評価の相互投稿は取引完了後のみ許可','手数料計算はサーバーサイド'],
    ['Manage escrow transactions with state machine','Allow mutual reviews only after transaction completion','Calculate fees server-side'],
    'function completeTransaction(txId){\n  const tx=db.query("SELECT * FROM transactions WHERE id=? FOR UPDATE",[txId]);\n  if(tx.status!=="escrow") throw new Error("Invalid state");\n  const fee=tx.amount*0.05;\n  db.transaction(()=>{\n    db.execute("UPDATE accounts SET balance=balance+? WHERE user_id=?",[tx.amount-fee,tx.seller_id]);\n    db.execute("UPDATE accounts SET balance=balance+? WHERE user_id=?",[fee,"platform"]);\n    db.execute("UPDATE transactions SET status=\'completed\' WHERE id=?",[txId]);\n  });\n}',
    ['エスクロー状態の不正遷移','手数料計算の改ざん','評価の不正投稿'],
    ['Prevent invalid escrow state transition','Prevent fee calculation tampering','Prevent fraudulent reviews']
  ),
  community:_dip(
    ['投稿のモデレーションはキューで非同期処理','スパム検出はレート制限+コンテンツフィルタ','ユーザーブロックは双方向テーブル'],
    ['Process post moderation asynchronously with queue','Detect spam with rate limiting + content filter','Manage user blocks with bidirectional table'],
    'function createPost(userId,content){\n  if(isRateLimited(userId)) throw new Error("Rate limit exceeded");\n  const postId=db.insert("INSERT INTO posts (user_id,content,status) VALUES (?,?,\'pending\')",[userId,content]);\n  queue.push({task:"MODERATE_POST",postId:postId});\n  return postId;\n}',
    ['スパム投稿の大量作成','モデレーション回避','ブロックユーザーの相互作用'],
    ['Prevent mass spam posting','Prevent moderation bypass','Prevent blocked user interaction']
  ),
  content:_dip(
    ['コンテンツ公開はスケジューラで予約投稿','バージョン管理はdraft/publishedテーブル分離','メディアアップロードは署名付きURL'],
    ['Schedule content publishing with scheduler','Manage versions with separate draft/published tables','Use signed URLs for media uploads'],
    'function schedulePublish(contentId,publishAt){\n  db.execute("UPDATE contents SET status=\'scheduled\',publish_at=? WHERE id=?",[publishAt,contentId]);\n  scheduler.add({task:"PUBLISH_CONTENT",contentId:contentId,runAt:publishAt});\n}',
    ['未公開コンテンツの漏洩','公開日時の改ざん','メディアファイルの不正アクセス'],
    ['Prevent unpublished content leakage','Prevent publish date tampering','Prevent unauthorized media access']
  ),
  analytics:_dip(
    ['イベント収集はバッチ挿入で高速化','集計はマテリアライズドビュー','リアルタイム更新はWebSocket'],
    ['Speed up event collection with batch insert','Use materialized views for aggregation','Use WebSocket for realtime updates'],
    'function trackEvent(userId,eventType,properties){\n  eventBuffer.push({userId,eventType,properties,timestamp:Date.now()});\n  if(eventBuffer.length>=100){\n    db.batchInsert("INSERT INTO events (user_id,event_type,properties,timestamp) VALUES ?",eventBuffer);\n    eventBuffer=[];\n  }\n}',
    ['イベント欠損','集計の遅延','ダッシュボードの過負荷'],
    ['Prevent event loss','Prevent aggregation delays','Prevent dashboard overload']
  ),
  booking:_dip(
    ['予約の排他制御は行ロック+タイムアウト','キャンセルポリシーはステータス遷移で管理','リマインダーはスケジューラで自動送信'],
    ['Control booking exclusivity with row lock + timeout','Manage cancellation policy with status transition','Auto-send reminders with scheduler'],
    'function createBooking(userId,slotId,startTime){\n  db.transaction(()=>{\n    const slot=db.query("SELECT * FROM slots WHERE id=? FOR UPDATE",[slotId]);\n    if(slot.status!=="available") throw new Error("Slot unavailable");\n    db.execute("INSERT INTO bookings (user_id,slot_id,start_time,status) VALUES (?,?,?,\'confirmed\')",[userId,slotId,startTime]);\n    db.execute("UPDATE slots SET status=\'booked\' WHERE id=?",[slotId]);\n    scheduler.add({task:"SEND_REMINDER",bookingId:bookingId,runAt:startTime-3600000});\n  });\n}',
    ['ダブルブッキング','キャンセル不可期間の無視','リマインダー送信漏れ'],
    ['Prevent double booking','Prevent ignoring non-cancellable period','Prevent missed reminder sending']
  ),
  saas:_dip(
    ['プラン制限はミドルウェアでチェック','使用量メーターはカウンターテーブル','サブスク更新はWebhookで同期'],
    ['Check plan limits in middleware','Track usage with counter table','Sync subscription updates with webhook'],
    'function checkLimit(userId,feature){\n  const plan=db.query("SELECT plan FROM users WHERE id=?",[userId]);\n  const usage=db.query("SELECT count FROM usage WHERE user_id=? AND feature=?",[userId,feature]);\n  const limit=PLAN_LIMITS[plan.plan][feature];\n  if(usage.count>=limit) throw new Error("Limit exceeded");\n}',
    ['プラン制限の回避','使用量カウントの不整合','サブスク状態のズレ'],
    ['Prevent plan limit bypass','Prevent usage count inconsistency','Prevent subscription state drift']
  ),
  portfolio:_dip(
    ['作品公開はステータスフラグ','タグ検索はインデックス必須','アクセス解析はログテーブル'],
    ['Control work visibility with status flag','Tag search requires index','Track analytics with log table'],
    'function publishWork(userId,workId){\n  db.execute("UPDATE works SET status=\'published\',published_at=? WHERE id=? AND user_id=?",[Date.now(),workId,userId]);\n  db.execute("INSERT INTO activity_logs (user_id,action,target_id) VALUES (?,\'PUBLISH\',?)",[userId,workId]);\n}',
    ['非公開作品の漏洩','タグスパム','統計の不正操作'],
    ['Prevent private work leakage','Prevent tag spam','Prevent stat manipulation']
  ),
  tool:_dip(
    ['API呼び出しはレート制限必須','結果キャッシュはTTL付きRedis','エラーはリトライ+フォールバック'],
    ['Apply rate limiting to API calls','Cache results with TTL in Redis','Implement retry + fallback for errors'],
    'function callAPI(userId,endpoint,params){\n  const cacheKey=`api:${endpoint}:${JSON.stringify(params)}`;\n  const cached=redis.get(cacheKey);\n  if(cached) return cached;\n  const result=fetch(endpoint,params);\n  redis.set(cacheKey,result,{EX:300});\n  return result;\n}',
    ['APIレート超過','キャッシュ汚染','エラー時のユーザー影響'],
    ['Prevent API rate excess','Prevent cache pollution','Prevent user impact on errors']
  ),
  iot:_dip(
    ['デバイスデータはタイムシリーズDB','異常検知はしきい値+アラート','ファームウェア更新はバージョン管理'],
    ['Store device data in time-series DB','Detect anomalies with threshold + alert','Manage firmware updates with versioning'],
    'function recordSensorData(deviceId,sensorType,value){\n  influxDB.write({measurement:sensorType,tags:{deviceId},fields:{value},timestamp:Date.now()});\n  if(value>THRESHOLD[sensorType]){\n    alert.send({type:"ANOMALY",deviceId,sensorType,value});\n  }\n}',
    ['データ欠損','異常検知の遅延','不正ファームウェア配信'],
    ['Prevent data loss','Prevent anomaly detection delay','Prevent malicious firmware distribution']
  ),
  realestate:_dip(
    ['物件ステータスは排他制御','内見予約は重複チェック','契約書は電子署名'],
    ['Control property status with exclusive lock','Check duplicates for viewing appointments','Use e-signature for contracts'],
    'function reserveViewing(userId,propertyId,datetime){\n  db.transaction(()=>{\n    const existing=db.query("SELECT * FROM viewings WHERE property_id=? AND datetime=?",[propertyId,datetime]);\n    if(existing) throw new Error("Slot taken");\n    db.execute("INSERT INTO viewings (user_id,property_id,datetime,status) VALUES (?,?,?,\'confirmed\')",[userId,propertyId,datetime]);\n  });\n}',
    ['物件ステータスの不整合','内見ダブルブッキング','契約書の改ざん'],
    ['Prevent property status inconsistency','Prevent viewing double booking','Prevent contract tampering']
  ),
  legal:_dip(
    ['契約文書はバージョン管理','アクセス権限は役割ベース','変更履歴はイミュータブル'],
    ['Manage contracts with versioning','Control access with role-based permissions','Track change history immutably'],
    'function updateContract(userId,contractId,newContent){\n  const current=db.query("SELECT version FROM contracts WHERE id=?",[contractId]);\n  db.transaction(()=>{\n    db.execute("INSERT INTO contract_versions (contract_id,version,content,updated_by) VALUES (?,?,?,?)",[contractId,current.version+1,newContent,userId]);\n    db.execute("UPDATE contracts SET version=version+1 WHERE id=?",[contractId]);\n  });\n}',
    ['契約内容の不正変更','アクセス権限の逸脱','変更履歴の削除'],
    ['Prevent unauthorized contract changes','Prevent access permission violation','Prevent change history deletion']
  ),
  hr:_dip(
    ['応募者データは暗号化','選考ステータスはワークフロー','オファー承諾は電子署名'],
    ['Encrypt applicant data','Manage selection status with workflow','Use e-signature for offer acceptance'],
    'function updateApplicantStatus(applicantId,newStatus){\n  const current=db.query("SELECT status FROM applicants WHERE id=?",[applicantId]);\n  if(!isValidTransition(current.status,newStatus)) throw new Error("Invalid transition");\n  db.execute("UPDATE applicants SET status=?,updated_at=? WHERE id=?",[newStatus,Date.now(),applicantId]);\n  db.execute("INSERT INTO status_history (applicant_id,from_status,to_status) VALUES (?,?,?)",[applicantId,current.status,newStatus]);\n}',
    ['個人情報漏洩','選考ステータスの不正遷移','オファー条件の改ざん'],
    ['Prevent personal info leakage','Prevent invalid status transition','Prevent offer condition tampering']
  ),
  ai:_dip(
    ['プロンプトはテンプレート管理','API呼び出しはキュー+リトライ','生成結果はバージョン保存'],
    ['Manage prompts with templates','Use queue + retry for API calls','Save generation results with versioning'],
    'function generateContent(userId,promptId,params){\n  const template=db.query("SELECT template FROM prompts WHERE id=?",[promptId]);\n  const prompt=renderTemplate(template,params);\n  const job={userId,prompt,status:"pending"};\n  queue.push(job);\n  return job.id;\n}',
    ['プロンプトインジェクション','APIコスト暴走','生成結果の紛失'],
    ['Prevent prompt injection','Prevent API cost runaway','Prevent loss of generation results']
  ),
  automation:_dip(
    ['ワークフローはDAGで定義','実行履歴は全ステップ記録','失敗時は自動リトライ'],
    ['Define workflows with DAG','Record all steps in execution history','Auto-retry on failure'],
    'function executeWorkflow(workflowId,input){\n  const steps=db.query("SELECT * FROM workflow_steps WHERE workflow_id=? ORDER BY sequence",[workflowId]);\n  let context=input;\n  for(const step of steps){\n    try{\n      context=executeStep(step,context);\n      db.execute("INSERT INTO execution_logs (workflow_id,step_id,status,output) VALUES (?,?,\'success\',?)",[workflowId,step.id,context]);\n    }catch(e){\n      db.execute("INSERT INTO execution_logs (workflow_id,step_id,status,error) VALUES (?,?,\'failed\',?)",[workflowId,step.id,e.message]);\n      if(step.retry) retry(step,context);\n    }\n  }\n}',
    ['循環依存の発生','ステップ実行順序の誤り','失敗時のデータ不整合'],
    ['Prevent circular dependencies','Prevent step execution order errors','Prevent data inconsistency on failure']
  ),
  event:_dip(
    ['参加登録は定員チェック','チケット発行はユニークコード','入場管理はQRスキャン'],
    ['Check capacity for registration','Issue tickets with unique code','Manage entry with QR scan'],
    'function registerEvent(userId,eventId){\n  db.transaction(()=>{\n    const event=db.query("SELECT capacity,(SELECT COUNT(*) FROM registrations WHERE event_id=?) as current FROM events WHERE id=? FOR UPDATE",[eventId,eventId]);\n    if(event.current>=event.capacity) throw new Error("Event full");\n    const ticketCode=generateUniqueCode();\n    db.execute("INSERT INTO registrations (user_id,event_id,ticket_code,status) VALUES (?,?,?,\'confirmed\')",[userId,eventId,ticketCode]);\n  });\n}',
    ['定員超過登録','チケットコード重複','不正入場'],
    ['Prevent over-capacity registration','Prevent ticket code duplication','Prevent unauthorized entry']
  ),
  gamify:_dip(
    ['ポイント付与はトランザクション','ランキングは集計テーブル','実績解除はサーバー検証'],
    ['Award points with transaction','Use aggregation table for ranking','Verify achievement unlock server-side'],
    'function awardPoints(userId,points,reason){\n  db.transaction(()=>{\n    db.execute("UPDATE users SET points=points+? WHERE id=?",[points,userId]);\n    db.execute("INSERT INTO point_logs (user_id,points,reason,timestamp) VALUES (?,?,?,?)",[userId,points,reason,Date.now()]);\n    checkAchievements(userId);\n  });\n}',
    ['ポイント不正取得','ランキング操作','実績の不正解除'],
    ['Prevent point fraud','Prevent ranking manipulation','Prevent achievement unlock fraud']
  ),
  collab:_dip(
    ['リアルタイム編集はOT/CRDT','競合解決は最終書込み優先','バージョン履歴は差分保存'],
    ['Implement realtime editing with OT/CRDT','Resolve conflicts with last-write-wins','Save version history as diffs'],
    'function applyEdit(docId,userId,operation){\n  const doc=getDocument(docId);\n  const transformed=transformOperation(operation,doc.pendingOps);\n  applyOperation(doc,transformed);\n  broadcast({docId,userId,operation:transformed});\n  saveVersion(docId,transformed);\n}',
    ['編集競合によるデータ破損','バージョン履歴の肥大化','同時編集の遅延'],
    ['Prevent data corruption from edit conflicts','Prevent version history bloat','Prevent concurrent edit latency']
  ),
  devtool:_dip(
    ['コマンド実行はサンドボックス','ログ出力はストリーミング','ビルド成果物はキャッシュ'],
    ['Execute commands in sandbox','Stream log output','Cache build artifacts'],
    'function executeCommand(cmd,env){\n  const sandbox=createSandbox(env);\n  const process=sandbox.exec(cmd);\n  process.stdout.on("data",(chunk)=>{\n    stream.write(chunk);\n  });\n  process.on("exit",(code)=>{\n    if(code===0) cacheArtifacts(sandbox.output);\n  });\n}',
    ['任意コード実行','ログの機密情報漏洩','キャッシュ汚染'],
    ['Prevent arbitrary code execution','Prevent sensitive info leakage in logs','Prevent cache pollution']
  ),
  creator:_dip(
    ['コンテンツ収益化はサブスク+投げ銭','収益分配は自動計算','著作権は電子透かし'],
    ['Monetize content with subscription + tips','Auto-calculate revenue sharing','Protect copyright with watermark'],
    'function tipCreator(userId,creatorId,amount){\n  db.transaction(()=>{\n    db.execute("UPDATE accounts SET balance=balance-? WHERE user_id=?",[amount,userId]);\n    const platformFee=amount*0.1;\n    db.execute("UPDATE accounts SET balance=balance+? WHERE user_id=?",[amount-platformFee,creatorId]);\n    db.execute("INSERT INTO transactions (from_user,to_user,amount,type) VALUES (?,?,?,\'tip\')",[userId,creatorId,amount]);\n  });\n}',
    ['収益計算の誤り','手数料の不正操作','コンテンツの無断転載'],
    ['Prevent revenue calculation errors','Prevent fee manipulation','Prevent unauthorized content reuse']
  ),
  newsletter:_dip(
    ['配信リストは購読ステータス管理','メール送信はキュー+レート制限','開封率はピクセルトラッキング'],
    ['Manage distribution list with subscription status','Send emails with queue + rate limiting','Track open rate with pixel tracking'],
    'function sendNewsletter(newsletterId,subscriberIds){\n  subscriberIds.forEach(id=>{\n    const trackingPixel=generateTrackingPixel(newsletterId,id);\n    const email=renderEmail(newsletterId,{trackingPixel});\n    queue.push({task:"SEND_EMAIL",to:id,content:email});\n  });\n}',
    ['購読解除の無視','配信レート超過','開封率の不正操作'],
    ['Prevent ignoring unsubscription','Prevent sending rate excess','Prevent open rate manipulation']
  ),
  _default:_dip(
    ['データ整合性はトランザクション','エラーハンドリングは必須','ログ記録は全操作'],
    ['Ensure data integrity with transactions','Error handling is mandatory','Log all operations'],
    'function performOperation(data){\n  try{\n    db.transaction(()=>{\n      validateInput(data);\n      const result=processData(data);\n      logOperation(result);\n      return result;\n    });\n  }catch(e){\n    logError(e);\n    throw e;\n  }\n}',
    ['データ不整合','エラーの握りつぶし','操作履歴の欠落'],
    ['Prevent data inconsistency','Prevent error suppression','Prevent operation history loss']
  )
};

// ── App Type Implementation Patterns ──
const APP_TYPE_MAP={
  spa:{
    patterns_ja:['状態管理はRedux/Zustand','ルーティングはReact Router','認証はトークンベース','API呼び出しはaxios/fetch'],
    patterns_en:['State management with Redux/Zustand','Routing with React Router','Token-based auth','API calls with axios/fetch'],
    antipatterns_ja:['SEOが必要なのにSPA','初回ロードが遅い','認証トークンをlocalStorageに平文保存'],
    antipatterns_en:['Using SPA when SEO is required','Slow initial load','Storing auth tokens in localStorage plaintext']
  },
  ssr:{
    patterns_ja:['データフェッチはgetServerSideProps','SEOメタタグは動的生成','認証はサーバーセッション','静的ページはISR'],
    patterns_en:['Data fetching with getServerSideProps','Dynamically generate SEO meta tags','Server-side session auth','Static pages with ISR'],
    antipatterns_ja:['全ページSSR(不要なページまで)','サーバー負荷考慮なし','クライアント状態とサーバー状態の不一致'],
    antipatterns_en:['SSR all pages (even unnecessary ones)','No server load consideration','Client-server state mismatch']
  },
  pwa:{
    patterns_ja:['Service Workerでオフライン対応','マニフェストファイル必須','プッシュ通知はVAPID','キャッシュ戦略はCache First'],
    patterns_en:['Offline support with Service Worker','Manifest file required','Push notifications with VAPID','Cache strategy: Cache First'],
    antipatterns_ja:['キャッシュクリア手段なし','オフライン時のUX考慮不足','バックグラウンド同期なし'],
    antipatterns_en:['No cache clearing mechanism','Poor offline UX consideration','No background sync']
  },
  mobile:{
    patterns_ja:['ネイティブ機能はExpo Modules','状態管理はRedux Toolkit','ナビゲーションはReact Navigation','プッシュ通知はExpo Notifications'],
    patterns_en:['Native features with Expo Modules','State management with Redux Toolkit','Navigation with React Navigation','Push notifications with Expo Notifications'],
    antipatterns_ja:['Webビューだけでネイティブ未活用','Android/iOS差分の考慮なし','バッテリー消費の最適化なし'],
    antipatterns_en:['Only WebView without native features','No Android/iOS difference consideration','No battery consumption optimization']
  },
  api_only:{
    patterns_ja:['RESTはOpenAPI仕様書','GraphQLはスキーマファースト','認証はJWT+リフレッシュトークン','レート制限は必須'],
    patterns_en:['REST with OpenAPI spec','GraphQL with schema-first','Auth with JWT + refresh token','Rate limiting required'],
    antipatterns_ja:['エラーレスポンス統一なし','バージョニング戦略なし','ドキュメント未整備'],
    antipatterns_en:['No unified error response','No versioning strategy','Poor documentation']
  },
  realtime:{
    patterns_ja:['WebSocketはSocket.io','状態同期はFirebase/Supabase Realtime','再接続ロジック必須','メッセージキューはRedis Pub/Sub'],
    patterns_en:['WebSocket with Socket.io','State sync with Firebase/Supabase Realtime','Reconnection logic required','Message queue with Redis Pub/Sub'],
    antipatterns_ja:['再接続時の状態復元なし','メッセージ順序保証なし','スケーラビリティ考慮不足'],
    antipatterns_en:['No state restoration on reconnect','No message order guarantee','Poor scalability consideration']
  }
};

// ── Cross-Cutting Implementation Concerns ──
const CROSS_CUTTING_IMPL={
  auth:{
    ja:['パスワードはbcryptでハッシュ化(rounds=12)','セッショントークンはhttpOnly cookie','CSRF対策はトークン検証','MFAは2段階認証アプリ'],
    en:['Hash passwords with bcrypt (rounds=12)','Session token in httpOnly cookie','CSRF protection with token verification','MFA with authenticator app']
  },
  error:{
    ja:['エラーは集約ハンドラで統一処理','スタックトレースは本番環境で非表示','エラーログはSentry/Cloudwatch','ユーザーには安全なメッセージ表示'],
    en:['Unified error handling with aggregated handler','Hide stack traces in production','Error logs with Sentry/Cloudwatch','Show safe messages to users']
  },
  cache:{
    ja:['頻繁アクセスデータはRedisキャッシュ','キャッシュキーは名前空間付き','TTLは用途別に設定','キャッシュ削除はイベント駆動'],
    en:['Cache frequently accessed data in Redis','Cache keys with namespace','Set TTL per use case','Cache invalidation event-driven']
  },
  i18n:{
    ja:['翻訳ファイルはJSONで管理','言語切替はクッキー保存','日時フォーマットはIntl API','RTL言語対応はCSS論理プロパティ'],
    en:['Manage translations with JSON files','Store language switch in cookie','Date format with Intl API','RTL support with CSS logical properties']
  },
  audit:{
    ja:['重要操作は全て監査ログ記録','ログはイミュータブルテーブル','誰が・いつ・何を・なぜを記録','保存期間はコンプライアンス準拠'],
    en:['Record all critical operations in audit log','Logs in immutable table','Record who/when/what/why','Retention period compliant with regulations']
  },
  upload:{
    ja:['ファイルサイズ制限必須','MIMEタイプ検証(拡張子に頼らない)','アップロードは署名付きURL','マルウェアスキャンはClamAV'],
    en:['File size limit required','MIME type validation (not relying on extension)','Upload with signed URL','Malware scan with ClamAV']
  },
  rate:{
    ja:['APIはユーザー/IP別にレート制限','制限超過時は429ステータス','Retry-Afterヘッダー必須','管理者APIは別枠'],
    en:['Rate limit API per user/IP','Return 429 on limit exceeded','Retry-After header required','Admin API separate limit']
  },
  validation:{
    ja:['入力検証はクライアント+サーバー両方','サーバーサイド検証を信頼の境界','SQLインジェクション対策はORM/prepared statement','XSS対策はエスケープ+CSP'],
    en:['Input validation on both client and server','Server-side validation as trust boundary','SQL injection prevention with ORM/prepared statement','XSS prevention with escaping + CSP']
  }
};

