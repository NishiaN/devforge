// Generation coherence test — verifies generated docs are internally consistent
const fs=require('fs');
const assert=require('node:assert/strict');
const S={answers:{},skill:'pro',lang:'ja',preset:'custom',projectName:'TestProject',phase:1,step:0,skipped:[],files:{},editedFiles:{},prevFiles:{},genLang:'ja',previewFile:null,pillar:0};
const save=()=>{};const _lsGet=()=>null;const _lsSet=()=>{};const _lsRm=()=>{};const sanitize=v=>v;

eval(fs.readFileSync('src/data/questions.js','utf-8'));
eval(fs.readFileSync('src/data/presets.js','utf-8').replace('const PR','var PR'));
eval(fs.readFileSync('src/data/compat-rules.js','utf-8'));
eval(fs.readFileSync('src/generators/common.js','utf-8').replace(/const /g,'var '));
eval(fs.readFileSync('src/generators/p1-sdd.js','utf-8'));
eval(fs.readFileSync('src/generators/p2-devcontainer.js','utf-8'));
eval(fs.readFileSync('src/generators/p3-mcp.js','utf-8'));
eval(fs.readFileSync('src/generators/p4-airules.js','utf-8'));
eval(fs.readFileSync('src/generators/p5-quality.js','utf-8'));
eval(fs.readFileSync('src/data/gen-templates.js','utf-8').replace('const GT','var GT'));
eval(fs.readFileSync('src/generators/p7-roadmap.js','utf-8'));
eval(fs.readFileSync('src/generators/p9-designsystem.js','utf-8'));
eval(fs.readFileSync('src/generators/p10-reverse.js','utf-8').replace('const REVERSE_FLOW_MAP','var REVERSE_FLOW_MAP'));
eval(fs.readFileSync('src/generators/p11-implguide.js','utf-8'));
eval(fs.readFileSync('src/generators/docs.js','utf-8'));
eval(fs.readFileSync('src/generators/p20-cicd.js','utf-8'));

let pass=0,fail=0;
function check(name,cond){
  if(cond){pass++;console.log(`✅ ${name}`);}
  else{fail++;console.log(`❌ ${name}`);}
}

// ═══ B6: NFR adapts to skill level ═══
console.log('━━ B6: NFR Skill Level Adaptation ━━');
for(const lv of ['beginner','intermediate','pro']){
  S.skill=lv;S.genLang='ja';S.files={};
  S.answers={purpose:'テストプロジェクト',target:'開発者',frontend:'React + Next.js',
    backend:'Node.js + Express',database:'PostgreSQL',deploy:'Vercel',
    mvp_features:'ログイン, ダッシュボード',dev_methods:'TDD'};
  genPillar1_SDD(S.answers,'TestProject');
  const spec=S.files['.spec/specification.md']||'';
  
  if(lv==='beginner'){
    check(`${lv}: latency < 1000ms`,spec.includes('1000ms'));
    check(`${lv}: availability=ベストエフォート`,spec.includes('ベストエフォート'));
    check(`${lv}: concurrent=〜50`,spec.includes('〜50'));
  } else if(lv==='intermediate'){
    check(`${lv}: latency < 500ms`,spec.includes('500ms'));
    check(`${lv}: availability=99%`,spec.includes('99%')&&!spec.includes('99.9%'));
    check(`${lv}: concurrent=〜200`,spec.includes('〜200'));
  } else {
    check(`${lv}: latency < 200ms`,spec.includes('200ms'));
    check(`${lv}: availability=99.9%`,spec.includes('99.9%'));
    check(`${lv}: concurrent=1000+`,spec.includes('1000+'));
  }
}

// ═══ Architecture diagram: Pattern-aware output ═══
console.log('\n━━ Architecture: Pattern-aware output ━━');
// Case 1: Express + Next.js + Vercel → BFF pattern (no API Gateway)
S.skill='pro';S.genLang='ja';S.files={};
S.answers={purpose:'テスト',target:'開発者',frontend:'React + Next.js',
  backend:'Node.js + Express',database:'PostgreSQL',deploy:'Vercel',
  mvp_features:'ログイン',dev_methods:'TDD'};
genPillar1_SDD(S.answers,'Test');
const techPlan1=S.files['.spec/technical-plan.md']||'';
check('Next+Express+Vercel: BFF pattern',techPlan1.includes('BFF')&&techPlan1.includes('API Routes'));
check('Next+Express+Vercel: no API Gateway',!techPlan1.includes('API Gateway'));

// Case 2: Express + Vite + Vercel → split pattern
S.files={};
S.answers={...S.answers,frontend:'React (Vite SPA)'};
genPillar1_SDD(S.answers,'Test');
const techPlan1b=S.files['.spec/technical-plan.md']||'';
check('Vite+Express+Vercel: split pattern',techPlan1b.includes('Railway/Render'));

// Case 3: Supabase → BaaS pattern
S.files={};
S.answers={...S.answers,frontend:'React + Next.js',backend:'Supabase',database:'Supabase (PostgreSQL)'};
genPillar1_SDD(S.answers,'Test');
const techPlan2=S.files['.spec/technical-plan.md']||'';
check('Supabase: BaaS pattern',techPlan2.includes('BaaS')&&techPlan2.includes('Auth + DB'));
check('Supabase: RLS policy section',techPlan2.includes('RLS'));
check('Supabase: no prisma directory',!techPlan2.includes('prisma/'));
check('Supabase: has supabase directory',techPlan2.includes('supabase/'));

// Case 4: Express + Railway → traditional pattern
S.files={};
S.answers={...S.answers,backend:'Node.js + Express',database:'PostgreSQL',deploy:'Railway'};
genPillar1_SDD(S.answers,'Test');
const techPlan3=S.files['.spec/technical-plan.md']||'';
check('Express+Railway: traditional pattern',techPlan3.includes('[Node.js + Express]'));

// ═══ DevContainer: DB service matches backend ═══
console.log('\n━━ DevContainer: BaaS-aware service ━━');
S.files={};
S.answers={frontend:'React + Next.js',backend:'Node.js + Express',database:'PostgreSQL',
  deploy:'Vercel',dev_methods:'TDD'};
genPillar2_DevContainer(S.answers,'Test');
const compose1=S.files['.devcontainer/docker-compose.yml']||'';
check('Express+PostgreSQL: postgres in compose',compose1.includes('postgres:16'));

S.files={};
S.answers={...S.answers,backend:'Firebase',database:'Firebase Firestore'};
genPillar2_DevContainer(S.answers,'Test');
const compose2=S.files['.devcontainer/docker-compose.yml']||'';
check('Firebase: no postgres in compose',!compose2.includes('postgres:16'));
const postCreate2=S.files['.devcontainer/post-create.sh']||'';
check('Firebase: emulators in post-create',postCreate2.includes('firebase'));

S.files={};
S.answers={...S.answers,backend:'Supabase',database:'Supabase (PostgreSQL)'};
genPillar2_DevContainer(S.answers,'Test');
const compose3=S.files['.devcontainer/docker-compose.yml']||'';
check('Supabase: no raw postgres in compose',!compose3.includes('postgres:16'));
const postCreate3=S.files['.devcontainer/post-create.sh']||'';
check('Supabase: supabase start in post-create',postCreate3.includes('supabase start'));
const env3=S.files['.env.example']||'';
check('Supabase: env has SUPABASE_URL',env3.includes('SUPABASE_URL'));

// ═══ B3: Auth SoT consistency across files ═══
console.log('\n━━ Auth SoT: Cross-file consistency ━━');
S.files={};
S.answers={purpose:'テスト',target:'開発者',frontend:'React + Next.js',
  backend:'Supabase',database:'Supabase (PostgreSQL)',deploy:'Vercel',
  auth:'Supabase Auth, Google OAuth',mvp_features:'ログイン',dev_methods:'TDD'};
genPillar1_SDD(S.answers,'Test');
const constitution=S.files['.spec/constitution.md']||'';
const spec2=S.files['.spec/specification.md']||'';
const tp2=S.files['.spec/technical-plan.md']||'';
const tasks2=S.files['.spec/tasks.md']||'';
const verify2=S.files['.spec/verification.md']||'';
check('Auth SoT in constitution',constitution.includes('Supabase Auth'));
check('Auth SoT in spec table',spec2.includes('Supabase Auth'));
check('Auth SoT in technical plan',tp2.includes('Supabase Auth'));
check('Auth SoT in tasks (Sprint 0)',tasks2.includes('Supabase Auth'));
check('Auth SoT in verification',verify2.includes('Supabase Auth'));
check('Google OAuth in constitution',constitution.includes('Google OAuth'));

// NextAuth scenario
S.files={};
S.answers={...S.answers,backend:'Node.js + Express',auth:'Auth.js/NextAuth, Google OAuth, GitHub OAuth'};
genPillar1_SDD(S.answers,'Test');
const constNA=S.files['.spec/constitution.md']||'';
check('NextAuth: resolved to Auth.js',constNA.includes('Auth.js'));

// ═══ B4: scope_out auto-adjustment ═══
console.log('\n━━ Scope_out: Auto-adjustment ━━');
S.files={};
S.answers={purpose:'テスト',target:'開発者',frontend:'React + Next.js',
  backend:'Node.js + Express',database:'PostgreSQL',deploy:'Vercel',
  mvp_features:'ログイン',dev_methods:'TDD',
  scope_out:'ネイティブアプリ, 管理画面',mobile:'Expo (React Native)'};
genPillar1_SDD(S.answers,'Test');
const scopeConst=S.files['.spec/constitution.md']||'';
check('scope_out: ネイティブアプリ rewritten',!scopeConst.includes('## 7') || !(/ネイティブアプリ[^（]/.test(scopeConst)));
check('scope_out: Expo Web UI noted',scopeConst.includes('Expo Web UI'));
check('scope_out: 管理画面 preserved',scopeConst.includes('管理画面'));

// EN version
S.genLang='en';S.files={};
S.answers={...S.answers,scope_out:'native apps, admin panel'};
genPillar1_SDD(S.answers,'Test');
const scopeEN=S.files['.spec/constitution.md']||'';
check('scope_out EN: native apps rewritten',!scopeEN.includes('native apps,'));
check('scope_out EN: Expo Web UI noted',scopeEN.includes('Expo Web UI'));
S.genLang='ja';

// ═══ B7: Schedule single source ═══
console.log('\n━━ Schedule: Single source ━━');
S.files={};
S.answers={purpose:'テスト',target:'開発者',frontend:'React + Next.js',
  backend:'Node.js + Express',database:'PostgreSQL',deploy:'Vercel',
  mvp_features:'ログイン, CRUD',screens:'ダッシュボード, ログイン',
  dev_methods:'TDD',mobile:'none'};
genPillar1_SDD(S.answers,'Test');
const tasks3=S.files['.spec/tasks.md']||'';
check('Schedule: has start date',tasks3.includes(new Date().toISOString().split('T')[0]));
check('Schedule: no mobile = 5 weeks',tasks3.includes('5 週間'));
check('Schedule: no Sprint 4',!tasks3.includes('Sprint 4'));

S.files={};
S.answers={...S.answers,mobile:'Expo (React Native)'};
genPillar1_SDD(S.answers,'Test');
const tasks4=S.files['.spec/tasks.md']||'';
check('Schedule: with mobile = 6 weeks',tasks4.includes('6 週間'));
check('Schedule: has Sprint 4 Mobile',tasks4.includes('Sprint 4'));

// ═══ B8: Package.json real dependencies ═══
console.log('\n━━ Package.json: Real dependencies ━━');
S.files={};
S.answers={frontend:'React + Next.js',backend:'Node.js + Express',
  database:'PostgreSQL',orm:'Prisma',deploy:'Vercel'};
genCommonFiles(S.answers,'TestProject');
const pkg=JSON.parse(S.files['package.json']||'{}');
check('pkg: has next dependency',!!pkg.dependencies['next']);
check('pkg: has react dependency',!!pkg.dependencies['react']);
check('pkg: has express dependency',!!pkg.dependencies['express']);
check('pkg: has prisma devDep',!!pkg.devDependencies['prisma']);
check('pkg: has @prisma/client',!!pkg.dependencies['@prisma/client']);
check('pkg: has vitest',!!pkg.devDependencies['vitest']);
check('pkg: has typescript',!!pkg.devDependencies['typescript']);
check('pkg: db:push script uses prisma',pkg.scripts['db:push']&&pkg.scripts['db:push'].includes('prisma'));

// Supabase scenario
S.files={};
S.answers={frontend:'React + Next.js',backend:'Supabase',database:'Supabase (PostgreSQL)',deploy:'Vercel'};
genCommonFiles(S.answers,'SupaProject');
const pkgS=JSON.parse(S.files['package.json']||'{}');
check('pkg(supabase): has @supabase/supabase-js',!!pkgS.dependencies['@supabase/supabase-js']);
check('pkg(supabase): no express',!pkgS.dependencies['express']);
check('pkg(supabase): no prisma',!pkgS.devDependencies['prisma']);

// ═══ B5: ER Inference & Domain Validation ═══
console.log('\n━━ B5: ER Inference ━━');
// Education domain + Product → warning
const er1=inferER({purpose:'教育・学習支援プラットフォーム',data_entities:'User, Course, Lesson, Product, Order'});
check('B5: education domain detected',er1.domain==='education');
check('B5: Product warned in education',er1.warnings.some(w=>w.includes('Product')));
check('B5: Course→Lesson relationship',er1.relationships.some(r=>r.includes('Course')&&r.includes('Lesson')));
check('B5: User→Order relationship',er1.relationships.some(r=>r.includes('User')&&r.includes('Order')));
check('B5: suggestion Product→Course',er1.suggestions.some(s=>s.from==='Product'&&s.to==='Course'));

// EC domain - no warnings for Product/Order
const er2=inferER({purpose:'ECサイト・オンラインショップ',data_entities:'User, Product, Category, Order, Cart'});
check('B5: ec domain detected',er2.domain==='ec');
check('B5: no warnings for ec entities',er2.warnings.length===0);
check('B5: Product→Category relationship',er2.relationships.some(r=>r.includes('Product')&&r.includes('Category')));
check('B5: Order→Product relationship',er2.relationships.some(r=>r.includes('Order')&&r.includes('Product')));

// Community domain
const er3=inferER({purpose:'コミュニティプラットフォーム',data_entities:'User, Post, Comment, Tag'});
check('B5: community domain detected',er3.domain==='community');
check('B5: Post→Comment relationship',er3.relationships.some(r=>r.includes('Post')&&r.includes('Comment')));
check('B5: Post↔Tag relationship',er3.relationships.some(r=>r.includes('Post')&&r.includes('Tag')));

// No domain match → null
const er4=inferER({purpose:'特殊なプロジェクト',data_entities:'User, Widget'});
check('B5: unknown domain returns null',er4.domain===null);

// ER in generated tech plan
S.genLang='ja';S.files={};S.skill='pro';
S.answers={purpose:'教育・学習支援プラットフォーム',target:'学生',frontend:'React + Next.js',
  backend:'Node.js + Express',database:'PostgreSQL',deploy:'Vercel',
  data_entities:'User, Course, Lesson, Progress, Product',mvp_features:'ログイン',dev_methods:'TDD'};
genPillar1_SDD(S.answers,'Test');
const tp5=S.files['.spec/technical-plan.md']||'';
check('B5: tech plan has relationships section',tp5.includes('リレーション'));
check('B5: tech plan has domain warning',tp5.includes('ドメイン適合性'));

// ═══ B9: URL/Routing Table ═══
console.log('\n━━ B9: Routing Table ━━');
const routes1=genRoutes({screens:'ダッシュボード, 設定, プロフィール',mvp_features:'ログイン'});
check('B9: has landing route',routes1.some(r=>r.path==='/'&&!r.auth));
check('B9: has login route',routes1.some(r=>r.path==='/login'&&!r.auth));
check('B9: has dashboard route',routes1.some(r=>r.path==='/dashboard'&&r.auth));
check('B9: has settings route',routes1.some(r=>r.path==='/settings'&&r.auth));
check('B9: has profile route',routes1.some(r=>r.path==='/profile'&&r.auth));
check('B9: no duplicates',new Set(routes1.map(r=>r.path)).size===routes1.length);

// Routes appear in generated spec
S.files={};
S.answers={purpose:'テスト',target:'開発者',frontend:'React + Next.js',
  backend:'Node.js + Express',database:'PostgreSQL',deploy:'Vercel',
  screens:'ダッシュボード, 設定',mvp_features:'ログイン',dev_methods:'TDD'};
genPillar1_SDD(S.answers,'Test');
const spec9=S.files['.spec/specification.md']||'';
check('B9: spec has routing section',spec9.includes('ルーティング')||spec9.includes('Routing'));
check('B9: spec has URL column',spec9.includes('/dashboard'));
check('B9: spec has auth column',spec9.includes('🔒'));
check('B9: spec has public column',spec9.includes('🌐'));

// ═══ C: Post-Generation Audit ═══
console.log('\n━━ C: Post-Generation Audit ━━');
// Clean generation should have 0 errors
S.files={};
S.answers={purpose:'テスト',target:'開発者',frontend:'React + Next.js',
  backend:'Supabase',database:'Supabase (PostgreSQL)',deploy:'Vercel',
  auth:'Supabase Auth, Google OAuth',mvp_features:'ログイン',dev_methods:'TDD'};
genPillar1_SDD(S.answers,'Test');
genPillar2_DevContainer(S.answers,'Test');
genCommonFiles(S.answers,'Test');
const audit1=postGenerationAudit(S.files,S.answers);
const audit1Errs=audit1.filter(f=>f.level==='error');
check('C: clean Supabase stack = 0 errors',audit1Errs.length===0);

// Supabase + raw postgres in compose → error
S.files['.devcontainer/docker-compose.yml']='postgres:16 fake compose';
const audit2=postGenerationAudit(S.files,S.answers);
check('C: Supabase + raw postgres = error',audit2.some(f=>f.level==='error'&&f.msg.includes('PostgreSQL')));

// Missing supabase-js in package.json → warn
S.files['package.json']=JSON.stringify({dependencies:{},devDependencies:{}});
const audit3=postGenerationAudit(S.files,S.answers);
check('C: missing supabase-js = warn',audit3.some(f=>f.level==='warn'&&f.msg.includes('supabase-js')));

// C2: BaaS + API Gateway
S.files={};S.answers.backend='Supabase';S.answers.frontend='React + Next.js';
S.files['docs/14_api.md']='# API Design\n\n## Gateway\n\nAPI Gatewayを使用します。';
const audit4=postGenerationAudit(S.files,S.answers);
check('C2: BaaS + API Gateway = warn',audit4.some(f=>f.level==='warn'&&f.msg.includes('API Gateway')));

// C3: scope_out vs native feature conflict
S.files={};S.answers={scope_out:'ネイティブアプリ',mobile:'Expo (React Native)',frontend:'React + Next.js',backend:'Supabase'};
const audit5=postGenerationAudit(S.files,S.answers);
check('C3: scope_out native + mobile = warn',audit5.some(f=>f.level==='warn'&&(f.msg.includes('scope_out')||f.msg.includes('ネイティブ'))));

// C8: .env prefix mismatch (VITE_ in Next.js project)
S.files={};S.answers={frontend:'React + Next.js',backend:'Node.js + Express'};
S.files['.env.example']='VITE_API_URL=http://localhost:3000\nVITE_APP_NAME=Test';
const audit6=postGenerationAudit(S.files,S.answers);
check('C8: VITE_ prefix in Next.js = warn',audit6.some(f=>f.level==='warn'&&f.msg.includes('VITE_')));

// C9: Non-Vercel deploy + Vercel Analytics
S.files={};S.answers={deploy:'Netlify',frontend:'React + Next.js'};
S.files['docs/28_monitoring.md']='# Monitoring\n\nVercel Analytics を使用します。';
const audit7=postGenerationAudit(S.files,S.answers);
check('C9: Netlify + Vercel Analytics = warn',audit7.some(f=>f.level==='warn'&&f.msg.includes('Vercel Analytics')));

// C10: BaaS + Prisma dependency
S.files={};S.answers={backend:'Supabase',database:'Supabase (PostgreSQL)'};
S.files['package.json']=JSON.stringify({dependencies:{'@prisma/client':'5.0.0'},devDependencies:{prisma:'5.0.0'}});
const audit8=postGenerationAudit(S.files,S.answers);
check('C10: BaaS + Prisma dep = warn',audit8.some(f=>f.level==='warn'&&f.msg.includes('Prisma')));

// ═══ P4-AIRules: Context-aware ═══
console.log('\n━━ P4: AI Rules Context-Aware ━━');
S.genLang='ja';S.files={};S.skill='pro';
S.answers={purpose:'教育・学習支援',target:'学生',frontend:'React + Next.js',
  backend:'Supabase',database:'Supabase (PostgreSQL)',deploy:'Vercel',
  auth:'Supabase Auth, Google OAuth',data_entities:'User, Course',
  dev_methods:'TDD',mvp_features:'ログイン'};
genPillar4_AIRules(S.answers,'TestEd');
const claude=S.files['CLAUDE.md']||'';
check('P4: CLAUDE.md has auth SoT',claude.includes('Supabase Auth'));
check('P4: CLAUDE.md has architecture',claude.includes('BaaS'));
check('P4: CLAUDE.md has Supabase Client',claude.includes('Supabase Client'));
check('P4: CLAUDE.md forbidden has no Express',claude.includes('No separate Express'));
const cursorR=S.files['.cursor/rules']||'';
check('P4: cursor rules has auth SoT',cursorR.includes('Supabase Auth'));
check('P4: cursor rules has architecture',cursorR.includes('BaaS'));

// Express scenario
S.files={};
S.answers={...S.answers,backend:'Node.js + Express',database:'PostgreSQL',auth:'Auth.js/NextAuth'};
genPillar4_AIRules(S.answers,'TestExp');
const claude2=S.files['CLAUDE.md']||'';
check('P4: Express CLAUDE has Auth.js',claude2.includes('Auth.js'));
check('P4: Express CLAUDE has BFF',claude2.includes('BFF')||claude2.includes('API Routes'));

// ═══ P3-MCP: Context-aware ═══
console.log('\n━━ P3: MCP Context-Aware ━━');
S.files={};
S.answers={purpose:'テスト',frontend:'React + Next.js',backend:'Supabase',
  database:'Supabase (PostgreSQL)',deploy:'Vercel',auth:'Supabase Auth',
  data_entities:'User, Course, Lesson',dev_methods:'TDD',ai_tools:'Cursor'};
genPillar3_MCP(S.answers,'TestMCP');
const ctx=S.files['.mcp/project-context.md']||'';
check('P3: context has auth SoT',ctx.includes('Supabase Auth'));
check('P3: context has architecture',ctx.includes('BaaS'));
check('P3: context has relationships',ctx.includes('Course')&&ctx.includes('Lesson'));
const manifest=S.files['.mcp/tools-manifest.json']||'';
check('P3: manifest has supabase MCP',manifest.includes('supabase'));

// ═══ Docs: Context-aware ═══
console.log('\n━━ Docs: Context-Aware ━━');
S.files={};S.skill='beginner';
S.answers={purpose:'教育・学習支援プラットフォーム',target:'学生',
  frontend:'React + Next.js',backend:'Supabase',database:'Supabase (PostgreSQL)',
  deploy:'Vercel',auth:'Supabase Auth',data_entities:'User, Course, Lesson',
  mvp_features:'ログイン, コース管理',screens:'ダッシュボード, ログイン',
  dev_methods:'TDD',ai_tools:'Cursor'};
genDocs21(S.answers,'TestDocs');
const req=S.files['docs/02_requirements.md']||'';
check('Docs: beginner NFR <1000ms',req.includes('1000ms'));
const archDoc=S.files['docs/03_architecture.md']||'';
check('Docs: arch doc has BaaS pattern',archDoc.includes('BaaS'));
check('Docs: arch doc no API Layer',!archDoc.includes('API Layer'));
const apiDoc=S.files['docs/05_api_design.md']||'';
check('Docs: API design has Supabase token',apiDoc.includes('Supabase JWT'));
const secDoc=S.files['docs/08_security.md']||'';
check('Docs: security has Supabase Auth',secDoc.includes('Supabase Auth'));
const playbook=S.files['docs/22_prompt_playbook.md']||'';
check('Docs: playbook no hardcoded Prisma',!playbook.includes('Prisma'));
check('Docs: playbook has Supabase Client',playbook.includes('Supabase Client'));
const erDoc=S.files['docs/04_er_diagram.md']||'';
check('Docs: ER uses smart relationships',erDoc.includes('Course')&&erDoc.includes('Lesson'));

// Pro skill level check
S.skill='pro';S.files={};
genDocs21(S.answers,'TestDocs2');
const req2=S.files['docs/02_requirements.md']||'';
check('Docs: pro NFR <200ms',req2.includes('200ms'));

// ═══ P7-Roadmap: Context-aware ═══
console.log('\n━━ P7: Roadmap Context-Aware ━━');
S.files={};S.genLang='ja';S.skill='intermediate';
S.answers={purpose:'テスト',target:'開発者',frontend:'React + Next.js',
  backend:'Supabase',database:'Supabase (PostgreSQL)',deploy:'Vercel',
  auth:'Supabase Auth',data_entities:'User',dev_methods:'TDD',
  skill_level:'Intermediate',learning_goal:'6ヶ月標準',ai_tools:'Cursor'};
genPillar7_Roadmap(S.answers,'TestRoad');
const lp=S.files['roadmap/LEARNING_PATH.md']||'';
check('P7: learning path has Supabase Client',lp.includes('Supabase Client'));
check('P7: learning path has correct auth',lp.includes('Supabase Auth'));
check('P7: learning path no hardcoded Prisma',!lp.includes('+ Prisma'));

// ═══ Preset scenario: semantic compat ═══
// LMS preset + scope_out ネイティブ + mobile Expo = should fire A1
const lmsCompat=checkCompat({
  scope_out:'ネイティブアプリ, リアルタイム通信',
  mobile:'Expo (React Native)',
  frontend:'React + Next.js',backend:'Node.js + Express',
});
check('LMS+NativeScope+Expo: sem-scope-mobile fires',
  lmsCompat.some(c=>c.id==='sem-scope-mobile'&&c.level==='error'));

// Education + Product/Order = should fire A7
const eduCompat=checkCompat({
  purpose:'教育・学習支援プラットフォーム',
  data_entities:'User, Course, Lesson, Product, Order',
});
check('Education+Product: sem-purpose-entities fires',
  eduCompat.some(c=>c.id==='sem-purpose-entities'));

// ═══ CAP-002: Vite SPA + Supabase + Netlify scenario ═══
console.log('\n━━ CAP-002: FE/Deploy/BaaS Context ━━');
S.skill='intermediate';S.genLang='ja';S.files={};
const cap2Ans={purpose:'教育・学習支援AIエージェント',target:'学生, 管理者',
  frontend:'React (Vite SPA)',backend:'Supabase',database:'Supabase (PostgreSQL)',
  deploy:'Netlify',auth:'Supabase Auth, Google OAuth',mobile:'React Native (bare)',
  scope_out:'AI機能, API公開, ネイティブアプリ',payment:'Stripe',
  mvp_features:'ユーザー認証, コンテンツ投稿, コメント機能, サブスクリプション',
  screens:'ランディングページ, ダッシュボード, 詳細ページ, 設定, 管理画面(P2)',
  data_entities:'User, Post, Comment, Category',dev_methods:'TDD',ai_tools:'Cursor',orm:'Prisma'};
S.answers=cap2Ans;
genPillar1_SDD(cap2Ans,'AIエージェント');
genPillar2_DevContainer(cap2Ans,'AIエージェント');
genCommonFiles(cap2Ans,'AIエージェント');
genDocs21(cap2Ans,'AIエージェント');
genPillar4_AIRules(cap2Ans,'AIエージェント');

// D1: .env prefix
const c2Env=S.files['.env.example']||'';
check('D1: Vite SPA uses VITE_ prefix',c2Env.includes('VITE_SUPABASE_URL'));
check('D1: No NEXT_PUBLIC in Vite env',!c2Env.includes('NEXT_PUBLIC'));

// D2: .gitignore
const c2Gi=S.files['.gitignore']||'';
check('D2: Vite gitignore has dist/',c2Gi.includes('dist/'));
check('D2: Vite gitignore no .next/',!c2Gi.includes('.next/'));

// D3: Performance
const c2Perf=S.files['docs/19_performance.md']||'';
check('D3: Vite perf no next/image',!c2Perf.includes('next/image'));
check('D3: Vite perf has vite-imagetools',c2Perf.includes('vite-imagetools'));

// D4: Monitoring
const c2Mon=S.files['docs/17_monitoring.md']||'';
check('D4: Netlify deploy has Netlify Analytics',c2Mon.includes('Netlify'));
check('D4: No Vercel Analytics for Netlify deploy',!c2Mon.includes('Vercel Analytics'));
check('D4: Supabase monitor has Dashboard',c2Mon.includes('Supabase Dashboard'));

// E1: API Design BaaS
const c2Api=S.files['docs/05_api_design.md']||'';
check('E1: BaaS API no /api/v1',!c2Api.includes('/api/v1'));
check('E1: BaaS API has supabase.from',c2Api.includes('supabase.from'));
check('E1: BaaS API doc title has SDK',c2Api.includes('SDK'));

// E2: Playbook BaaS
const c2Pb=S.files['docs/22_prompt_playbook.md']||'';
check('E2: BaaS playbook no /api/v1 CRUD',!c2Pb.includes('/api/v1'));
check('E2: BaaS playbook has Supabase Client',c2Pb.includes('Supabase Client'));

// E3: No Jest
const c2Verify=S.files['.spec/verification.md']||'';
check('E3: No Jest in verification',!c2Verify.includes('Jest'));

// F1: Routing URL sanitization
const c2Spec=S.files['.spec/specification.md']||'';
check('F1: No Japanese in route URLs',!/\/[ぁ-んァ-ヶ一-龥]/.test((c2Spec.split(/Routing|ルーティング/)[1]||'').split(/Data Model|データモデル/)[0]||''));
check('F1: Landing deduped to /',c2Spec.includes("| `/` | ランディング"));
check('F1: Admin mapped to /admin',c2Spec.includes('/admin'));

// F3: Screen auth - landing page section should say 不要
const c2Sd=S.files['docs/06_screen_design.md']||'';
const c2SdLines=c2Sd.split('\n');
const landingIdx=c2SdLines.findIndex(l=>l.includes('ランディング')&&l.includes('###'));
const landingBlock=landingIdx>=0?c2SdLines.slice(landingIdx,landingIdx+5).join('\n'):'';
check('F3: Landing page auth=不要',landingBlock.includes('不要'));

// G1: ER no Comment→Category
const c2Er=S.files['docs/04_er_diagram.md']||'';
check('G1: No Comment→Category',!c2Er.includes('Comment ||--o{ Category'));
check('G1: Post→Comment relationship',c2Er.includes('Post ||--o{ Comment'));
check('G1: User→Post relationship',c2Er.includes('User ||--o{ Post'));

// G2: FK columns - find entity sections
const postEntitySection=(c2Er.split('### Post')[1]||'').split('###')[0];
const commentEntitySection=(c2Er.split('### Comment')[1]||'').split('###')[0];
check('G2: Post has user_id FK',postEntitySection.includes('user_id'));
check('G2: Comment has post_id FK',commentEntitySection.includes('post_id'));

// H1: DevContainer port 54323
const c2Dc=JSON.parse(S.files['.devcontainer/devcontainer.json']||'{}');
check('H1: Supabase Studio port 54323',(c2Dc.forwardPorts||[]).includes(54323));

// H2: Auth SPA-aware
const c2Tp=S.files['.spec/technical-plan.md']||'';
check('H2: Vite SPA auth=client-side',c2Tp.includes('client-side'));

// H3+H4: No Prisma deps for BaaS
const c2Pkg=JSON.parse(S.files['package.json']||'{}');
check('H3: No @prisma/client in BaaS',!c2Pkg.dependencies['@prisma/client']);
check('H3: No prisma devDep in BaaS',!(c2Pkg.devDependencies||{})['prisma']);
check('H4: No db:push script in BaaS',!c2Pkg.scripts['db:push']);

// Verify Next.js scenario still works correctly
console.log('\n━━ CAP-002: Next.js + Vercel contrast ━━');
S.files={};S.genLang='ja';
const nextAns={purpose:'ECサイト',frontend:'React + Next.js',backend:'Node.js + Express',
  database:'PostgreSQL',deploy:'Vercel',auth:'NextAuth, Google OAuth',
  mvp_features:'ログイン, 商品一覧',screens:'ランディングページ, ダッシュボード',
  data_entities:'User, Product, Order, Category',dev_methods:'TDD',ai_tools:'Cursor',orm:'Prisma'};
S.answers=nextAns;
genPillar1_SDD(nextAns,'ECサイト');
genPillar2_DevContainer(nextAns,'ECサイト');
genCommonFiles(nextAns,'ECサイト');
genDocs21(nextAns,'ECサイト');
const nEnv=S.files['.env.example']||'';
const nGi=S.files['.gitignore']||'';
const nPerf=S.files['docs/19_performance.md']||'';
const nMon=S.files['docs/17_monitoring.md']||'';
const nApi=S.files['docs/05_api_design.md']||'';
const nPkg=JSON.parse(S.files['package.json']||'{}');
check('Next.js env uses NEXT_PUBLIC',nEnv.includes('NEXT_PUBLIC')||nEnv.includes('DATABASE_URL'));
check('Next.js gitignore has .next/',nGi.includes('.next/'));
check('Next.js perf uses next/image',nPerf.includes('next/image'));
check('Next.js Vercel monitor has Vercel Analytics',nMon.includes('Vercel'));
check('Next.js API has /api/v1',nApi.includes('/api/v1'));
check('Next.js has prisma dep',!!(nPkg.devDependencies||{})['prisma']);
check('Next.js has db:push',!!nPkg.scripts['db:push']);

// ═══ Round 25: Rich Entity Columns + Feature Details ═══
console.log('\n━━ R25: Entity Columns & Feature Details ━━');

// --- LMS Scenario ---
S.files={};S.genLang='ja';S.skill='intermediate';
const lmsAns={purpose:'SaaS型学習管理システム',target:'学生, 講師, 管理者',
  frontend:'React + Next.js',backend:'Supabase',database:'Supabase (PostgreSQL)',
  deploy:'Vercel',auth:'Supabase Auth, Google OAuth',payment:'Stripe',
  mvp_features:'ユーザー認証, コース管理, 進捗管理, サブスクリプション, 管理ダッシュボード',
  screens:'ランディング, ダッシュボード, コース詳細, 設定, 管理画面, 決済ページ',
  data_entities:'User, Course, Lesson, Progress, Enrollment',
  dev_methods:'TDD',ai_tools:'Cursor',orm:'Prisma'};
S.answers=lmsAns;
genPillar1_SDD(lmsAns,'LMS');genPillar2_DevContainer(lmsAns,'LMS');
genCommonFiles(lmsAns,'LMS');genDocs21(lmsAns,'LMS');

const lmsEr=S.files['docs/04_er_diagram.md']||'';
const lmsTp=S.files['.spec/technical-plan.md']||'';
const lmsSpec=S.files['.spec/specification.md']||'';
const lmsTest=S.files['docs/07_test_cases.md']||'';
const lmsPb=S.files['docs/22_prompt_playbook.md']||'';

// R25-A: Rich Entity Columns in ER Diagram
check('R25-A1: Course has price column in ER',lmsEr.includes('price'));
check('R25-A2: Course has status column in ER',lmsEr.includes('status'));
check('R25-A3: Course has instructor_id FK in ER',lmsEr.includes('instructor_id'));
check('R25-A4: Lesson has sort_order in ER',lmsEr.includes('sort_order'));
check('R25-A5: Lesson has duration_min in ER',lmsEr.includes('duration_min'));
check('R25-A6: Progress has user_id FK',lmsEr.includes('user_id')&&(lmsEr.split('### Progress')[1]||'').includes('user_id'));
check('R25-A7: Progress has lesson_id FK',lmsEr.includes('lesson_id'));
check('R25-A8: Progress has score column',lmsEr.includes('score'));
check('R25-A9: Enrollment has user_id FK',(lmsEr.split('### Enrollment')[1]||'').includes('user_id'));
check('R25-A10: Enrollment has course_id FK',(lmsEr.split('### Enrollment')[1]||'').includes('course_id'));
check('R25-A11: Enrollment has enrolled_at',lmsEr.includes('enrolled_at'));
check('R25-A12: User has email column in ER',lmsEr.includes('email'));
check('R25-A13: No generic name column for rich entities',!(lmsEr.split('### Course')[1]||'').split('###')[0].includes('| name |'));

// R25-B: Rich Entity Columns in Technical Plan
check('R25-B1: Course has price in tech-plan',lmsTp.includes('price: DECIMAL'));
check('R25-B2: Course has status in tech-plan',lmsTp.includes("status: VARCHAR"));
check('R25-B3: Progress has user_id in tech-plan',(lmsTp.split('### Progress')[1]||'').split('###')[0].includes('user_id'));
check('R25-B4: Progress has lesson_id in tech-plan',(lmsTp.split('### Progress')[1]||'').split('###')[0].includes('lesson_id'));
check('R25-B5: Enrollment has course_id in tech-plan',(lmsTp.split('### Enrollment')[1]||'').split('###')[0].includes('course_id'));

// R25-C: inferER fixed relationships (no chain format)
check('R25-C1: User→Progress relationship',lmsTp.includes('User 1') && lmsTp.includes('Progress'));
check('R25-C2: User→Enrollment relationship',lmsTp.includes('User 1') && lmsTp.includes('Enrollment'));
check('R25-C3: Course→Enrollment relationship',lmsTp.includes('Course 1') && lmsTp.includes('Enrollment'));
check('R25-C4: Lesson→Progress relationship',lmsTp.includes('Lesson 1') && lmsTp.includes('Progress'));
check('R25-C5: No chain format in relationships',!lmsTp.includes('──N Enrollment ──N'));
check('R25-C6: ER mermaid has User→Progress',lmsEr.includes('User ||--o{ Progress'));
check('R25-C7: ER mermaid has Course→Enrollment',lmsEr.includes('Course ||--o{ Enrollment'));

// R25-D: Feature Acceptance Criteria in Specification
check('R25-D1: Auth has acceptance criteria',lmsSpec.includes('受入条件'));
check('R25-D2: Auth criteria: password registration',lmsSpec.includes('メール+パスワード'));
check('R25-D3: Auth criteria: social login with auth provider',lmsSpec.includes('ソーシャルログイン'));
check('R25-D4: Auth criteria: password reset',lmsSpec.includes('パスワードリセット'));
check('R25-D5: Course criteria: draft/published',lmsSpec.includes('下書き') && lmsSpec.includes('公開'));
check('R25-D6: Course criteria: instructor-only edit',lmsSpec.includes('講師のみ'));
check('R25-D7: Progress criteria: lesson completion',lmsSpec.includes('レッスン完了'));
check('R25-D8: Subscription criteria: Stripe Checkout',lmsSpec.includes('Stripe Checkout'));
check('R25-D9: Subscription criteria: Webhook',lmsSpec.includes('Webhook'));
check('R25-D10: Admin criteria: role check',lmsSpec.includes('role=admin'));

// R25-E: Feature-specific Test Cases
check('R25-E1: Auth test: duplicate email',lmsTest.includes('重複メール')||lmsTest.includes('Duplicate email'));
check('R25-E2: Auth test: invalid token',lmsTest.includes('無効トークン')||lmsTest.includes('Invalid token'));
check('R25-E3: Course test: draft→published',lmsTest.includes('draft→published')||lmsTest.includes('ステータス変更'));
check('R25-E4: Course test: other instructor edit',lmsTest.includes('他講師')||lmsTest.includes('other instructor'));
check('R25-E5: Progress test: lesson completion',lmsTest.includes('レッスン完了')||lmsTest.includes('lesson complete'));
check('R25-E6: Subscription test: Webhook',lmsTest.includes('Webhook')||lmsTest.includes('webhook'));
check('R25-E7: Admin test: non-admin access 403',lmsTest.includes('一般ユーザー')||lmsTest.includes('Non-admin'));

// R25-F: Playbook Enhanced
check('R25-F1: Playbook has entity columns',lmsPb.includes('price') || lmsPb.includes('DECIMAL'));
check('R25-F2: Playbook feature has acceptance criteria',lmsPb.includes('受入条件'));

// --- EC Scenario (verify entity columns work for different domain) ---
S.files={};S.genLang='ja';
const ecAns={purpose:'ECサイト',frontend:'React + Next.js',backend:'Node.js + Express',
  database:'PostgreSQL',deploy:'Vercel',auth:'NextAuth',
  mvp_features:'商品管理, 注文, カート, レビュー',
  screens:'ランディング, 商品一覧, 商品詳細, カート, チェックアウト',
  data_entities:'User, Product, Category, Order, Cart, Review',
  dev_methods:'TDD',ai_tools:'Cursor',orm:'Prisma'};
S.answers=ecAns;
genPillar1_SDD(ecAns,'ECShop');genDocs21(ecAns,'ECShop');

const ecEr=S.files['docs/04_er_diagram.md']||'';
const ecTp=S.files['.spec/technical-plan.md']||'';
const ecSpec=S.files['.spec/specification.md']||'';
const ecTest=S.files['docs/07_test_cases.md']||'';

// R25-G: EC Entity Columns
check('R25-G1: Product has price',ecEr.includes('price'));
check('R25-G2: Product has sku',ecEr.includes('sku'));
check('R25-G3: Product has stock',ecEr.includes('stock'));
check('R25-G4: Product has category_id FK',ecEr.includes('category_id'));
check('R25-G5: Order has user_id FK',(ecEr.split('### Order')[1]||'').split('###')[0].includes('user_id'));
check('R25-G6: Order has total',(ecEr.split('### Order')[1]||'').split('###')[0].includes('total'));
check('R25-G7: Order has stripe_session_id',ecEr.includes('stripe_session_id'));
check('R25-G8: Category has slug',ecEr.includes('slug'));
check('R25-G9: Review has rating',(ecEr.split('### Review')[1]||'').split('###')[0].includes('rating'));
check('R25-G10: Cart has quantity',ecEr.includes('quantity'));

// R25-H: EC Relationships  
check('R25-H1: Product→Review relationship',ecEr.includes('Product ||--o{ Review'));
check('R25-H2: Product→Cart relationship',ecEr.includes('Product ||--o{ Cart'));
check('R25-H3: Order↔Product M2M',ecEr.includes('Order }o--o{ Product'));
check('R25-H4: Category self-ref',ecEr.includes('Category') && ecEr.includes('self-ref'));
check('R25-H5: User→Order relationship',ecEr.includes('User ||--o{ Order'));
check('R25-H6: User→Review relationship',ecEr.includes('User ||--o{ Review'));

// R25-I: EC Test Cases
check('R25-I1: Product test: negative price',ecTest.includes('負数')||ecTest.includes('Negative'));
check('R25-I2: Product test: SKU duplicate',ecTest.includes('SKU')||ecTest.includes('sku'));
check('R25-I3: Order test: cart to order',ecTest.includes('カート')||ecTest.includes('cart'));

// --- Unknown entity fallback ---
S.files={};S.genLang='en';
const unknownAns={purpose:'Custom tool',frontend:'React',backend:'Node.js',
  data_entities:'User, Widget, Gadget',mvp_features:'Widget management',
  screens:'Dashboard',dev_methods:'TDD',ai_tools:'Cursor',orm:'Prisma'};
S.answers=unknownAns;
genDocs21(unknownAns,'Tool');
const unkEr=S.files['docs/04_er_diagram.md']||'';
check('R25-J1: Unknown entity gets name column',unkEr.includes('Gadget') && (unkEr.split('### Gadget')[1]||'').includes('name'));
check('R25-J2: Unknown entity still has id/timestamps',unkEr.includes('uuid id PK'));

S.genLang='ja'; // restore

// ═══ Round 25: Quality Enhancement Tests ═══
console.log('\n━━ R25 Quality Enhancement ━━');

// Generate LMS scenario with Stripe + admin
S.files={};S.genLang='ja';S.skill='intermediate';
const r25Ans={purpose:'SaaS型学習管理システム',target:'学生, 講師, 管理者',
  frontend:'React + Next.js',backend:'Supabase',database:'Supabase (PostgreSQL)',
  deploy:'Vercel',auth:'Supabase Auth, Google OAuth',payment:'Stripe',
  mvp_features:'ユーザー認証, コース管理, 進捗管理, サブスクリプション, 管理ダッシュボード',
  screens:'ランディング, ダッシュボード, コース詳細, 設定, 管理画面, 決済ページ',
  data_entities:'User, Course, Lesson, Progress, Enrollment',
  dev_methods:'TDD',ai_tools:'Cursor',orm:'Prisma',scope_out:'ネイティブアプリ'};
S.answers=r25Ans;
genPillar1_SDD(r25Ans,'LMS');
genPillar2_DevContainer(r25Ans,'LMS');
genCommonFiles(r25Ans,'LMS');
genDocs21(r25Ans,'LMS');

const r25api=S.files['docs/05_api_design.md']||'';
const r25screen=S.files['docs/06_screen_design.md']||'';
const r25sec=S.files['docs/08_security.md']||'';
const r25tp=S.files['.spec/technical-plan.md']||'';
const r25ci=S.files['.github/workflows/ci.yml']||'';

// K1: Smart pluralization
console.log('  K1: Pluralization');
check('K1-1: progress table not progresss',r25api.includes("'progress'")&&!r25api.includes("'progresss'"));
check('K1-2: enrollments correctly pluralized',r25api.includes("'enrollments'"));
check('K1-3: courses correctly pluralized',r25api.includes("'courses'"));

// K2: API SDK uses entity columns not { name }
console.log('  K2: API Entity Columns');
check('K2-1: Course insert has description or price',r25api.includes('description')||r25api.includes('price'));
check('K2-2: Progress insert has user_id',r25api.includes('userId')&&r25api.includes('progress'));
check('K2-3: Enrollment insert has user_id/course_id',r25api.includes("'enrollments'")&&r25api.includes('userId'));
check('K2-4: No generic { name } in Supabase insert',!r25api.includes("insert({ name })"));

// K3: Screen flow intelligence
console.log('  K3: Screen Flow');
check('K3-1: Landing→Dashboard flow',r25screen.includes('S0 --> S1')||r25screen.includes('ランディング')&&r25screen.includes('ダッシュボード'));
check('K3-2: Dashboard→Settings bidirectional',r25screen.includes('S3 --> S1')||r25screen.includes('Settings --> Dashboard'));
check('K3-3: Admin marked as admin-only',r25screen.includes('管理者のみ')||r25screen.includes('admin only'));
check('K3-4: Detail→Payment flow',r25screen.includes('S2 --> S5')||r25screen.includes('コース詳細')&&r25screen.includes('決済'));

// K4: Screen component enrichment
console.log('  K4: Screen Components');
check('K4-1: Landing has hero/CTA components',r25screen.includes('ヒーロー')||r25screen.includes('CTA')||r25screen.includes('Hero'));
check('K4-2: Dashboard has stats/graph components',r25screen.includes('統計')||r25screen.includes('グラフ')||r25screen.includes('Stats'));
check('K4-3: Admin has user management',r25screen.includes('ユーザー管理')||r25screen.includes('User management'));
check('K4-4: Payment has Stripe Elements',r25screen.includes('Stripe')||r25screen.includes('決済フォーム'));

// K5: Security RBAC
console.log('  K5: RBAC');
check('K5-1: Security doc has RBAC section',r25sec.includes('RBAC'));
check('K5-2: Role table has admin',r25sec.includes('admin'));
check('K5-3: Role table has user',r25sec.includes('user'));
check('K5-4: Admin route protection mentioned',r25sec.includes('/admin'));

// K6: Stripe payment security
console.log('  K6: Payment Security');
check('K6-1: Security doc has Stripe section',r25sec.includes('Stripe')||r25sec.includes('決済セキュリティ'));
check('K6-2: Webhook signature verification',r25sec.includes('STRIPE_WEBHOOK_SECRET')||r25sec.includes('署名検証'));
check('K6-3: PCI DSS mentioned',r25sec.includes('PCI'));

// K7: Stripe in tech-plan
console.log('  K7: Stripe Tech Plan');
check('K7-1: Tech plan has Stripe/Payment section',r25tp.includes('決済設計')||r25tp.includes('Payment Design'));
check('K7-2: Webhook flow diagram',r25tp.includes('invoice.paid'));
check('K7-3: Subscription table design',r25tp.includes('stripe_subscription_id'));
check('K7-4: Plan pricing table',r25tp.includes('Free')&&r25tp.includes('Pro')&&r25tp.includes('Enterprise'));

// K8: Per-table RLS policies
console.log('  K8: RLS Policies');
check('K8-1: RLS has CREATE POLICY statements',r25tp.includes('CREATE POLICY'));
check('K8-2: User table has auth.uid() = id',r25tp.includes('auth.uid() = id'));
check('K8-3: Progress table has user_id policy',r25tp.includes('progress')&&r25tp.includes('auth.uid() = user_id'));
check('K8-4: Course table has instructor_id policy',r25tp.includes('courses_select')&&r25tp.includes('instructor_id'));

// K9: CI/CD workflow
console.log('  K9: CI/CD');
check('K9-1: ci.yml generated',r25ci.length>0);
check('K9-2: Has lint step',r25ci.includes('lint'));
check('K9-3: Has test step',r25ci.includes('test'));
check('K9-4: Has build step',r25ci.includes('build'));
check('K9-5: Targets main branch',r25ci.includes('main'));

// K10: Contrast test with Vite + Netlify (no Stripe, no admin)
S.files={};
const r25bAns={purpose:'ブログプラットフォーム',target:'ブロガー',
  frontend:'React + Vite',backend:'Supabase',database:'Supabase (PostgreSQL)',
  deploy:'Netlify',auth:'Supabase Auth',
  mvp_features:'記事投稿, カテゴリ管理',
  screens:'ランディング, ダッシュボード, 記事詳細, 設定',
  data_entities:'User, Post, Category, Tag, Comment',
  dev_methods:'TDD',ai_tools:'Cursor',orm:''};
S.answers=r25bAns;
genPillar1_SDD(r25bAns,'Blog');
genCommonFiles(r25bAns,'Blog');
genDocs21(r25bAns,'Blog');

const r25bSec=S.files['docs/08_security.md']||'';
const r25bTp=S.files['.spec/technical-plan.md']||'';
const r25bApi=S.files['docs/05_api_design.md']||'';
const r25bRel=S.files['docs/09_release_checklist.md']||'';
console.log('  K10: Contrast (Blog/Vite/Netlify)');
check('K10-1: No RBAC in security (no admin target)',!r25bSec.includes('RBAC'));
check('K10-2: No Stripe in tech plan',!r25bTp.includes('Stripe'));
check('K10-3: Post insert has title/body',r25bApi.includes('title')||r25bApi.includes('body'));
check('K10-4: Comment insert has user_id',r25bApi.includes('user_id')&&r25bApi.includes('comment'));
check('K10-5: Release checklist mentions Netlify',r25bRel.includes('Netlify'));
check('K10-6: posts table (correct plural)',r25bApi.includes("'posts'"));
check('K10-7: categories table (correct plural)',r25bApi.includes("'categories'"));

// ═══ gen81: UX Proficiency Audit doc ═══
console.log('\n━━ gen81: UX Proficiency Audit ━━');
S.files={};S.genLang='ja';
S.projectName='TestProject';
S.answers={target:'ユーザー',screens:'ダッシュボード, 設定',auth:'NextAuth',mvp_features:'ログイン, ダッシュボード'};
gen81();
check('gen81: docs/81_ux_proficiency_audit.md exists',!!S.files['docs/81_ux_proficiency_audit.md']);
const doc81=S.files['docs/81_ux_proficiency_audit.md']||'';
check('gen81: has Lv.0 through Lv.6 headers',['Lv.0','Lv.1','Lv.2','Lv.3','Lv.4','Lv.5','Lv.6'].every(lv=>doc81.includes(lv)));

// ═══ Cross-reference validation ═══
console.log('\n━━ Cross-reference validation ━━');
// Verify inferStakeholder() returns correct values for key domains
if(typeof inferStakeholder==='function'){
  check('inferStakeholder(fintech)=enterprise', inferStakeholder('fintech')==='enterprise');
  check('inferStakeholder(saas)=team', inferStakeholder('saas')==='team');
  check('inferStakeholder(devtool)=developer', inferStakeholder('devtool')==='developer');
  check('inferStakeholder(unknown)=startup', inferStakeholder('unknown')==='startup');
}
// Verify isNone() catches all variants
check('isNone(なし)=true', isNone('なし')===true);
check('isNone(None)=true', isNone('None')===true);
check('isNone(none)=true', isNone('none')===true);
check('isNone(Stripe)=false', isNone('Stripe')===false);

// ═══ SUMMARY ═══
console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`# pass ${pass}`);
if(fail>0) console.log(`# fail ${fail}`);
assert.strictEqual(fail, 0, `gen-coherence: ${fail} checks failed (see ❌ above)`);
