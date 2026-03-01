// Compat rules functional test (229 rules: 33 ERROR + 125 WARN + 71 INFO)
const assert=require('node:assert/strict');
const S={lang:'ja',skill:'pro'};
eval(require('fs').readFileSync('src/data/compat-rules.js','utf-8'));
eval(require('fs').readFileSync('src/generators/common.js','utf-8')); // For detectDomain

const tests=[
  {name:'Expo+Vue=ERROR',a:{frontend:'Vue 3 + Nuxt',mobile:'Expo (React Native)'},expect:'error'},
  {name:'Astro+Expo=ERROR',a:{frontend:'Astro',mobile:'Expo (React Native)'},expect:'error'},
  {name:'Static+Mobile=INFO',a:{backend:'なし（静的サイト）',mobile:'Expo (React Native)'},expect:'info',id:'be-mobile-static'},
  {name:'Python+Prisma=ERROR',a:{backend:'Python + FastAPI',orm:'Prisma'},expect:'error'},
  {name:'Java+Prisma=ERROR',a:{backend:'Java + Spring Boot',orm:'Prisma'},expect:'error'},
  {name:'Node+SQLAlchemy=ERROR',a:{backend:'Node.js + Express',orm:'SQLAlchemy (Python)'},expect:'error'},
  {name:'Static+ORM=WARN',a:{backend:'なし（静的サイト）',orm:'Prisma'},expect:'warn',id:'be-orm-static'},
  {name:'Firebase+MongoDB=WARN',a:{backend:'Firebase',database:'MongoDB'},expect:'warn'},
  {name:'Supabase+Firestore=WARN',a:{backend:'Supabase',database:'Firebase Firestore'},expect:'warn'},
  {name:'Static+DB=WARN',a:{backend:'なし（静的サイト）',database:'PostgreSQL'},expect:'warn'},
  {name:'Python+Firestore=WARN',a:{backend:'Python + FastAPI',database:'Firebase Firestore'},expect:'warn'},
  {name:'Drizzle+MongoDB=ERROR',a:{orm:'Drizzle ORM',database:'MongoDB'},expect:'error',id:'orm-drizzle-mongo'},
  {name:'Java+Vercel=WARN',a:{backend:'Java + Spring Boot',deploy:'Vercel'},expect:'warn'},
  {name:'Firebase+Vercel=WARN',a:{backend:'Firebase',deploy:'Vercel'},expect:'warn'},
  {name:'Supabase+FirebaseH=WARN',a:{backend:'Supabase',deploy:'Firebase Hosting'},expect:'warn'},
  {name:'NestJS+Vercel=WARN',a:{backend:'Node.js + NestJS',deploy:'Vercel'},expect:'warn'},
  {name:'Django+Vercel=WARN',a:{backend:'Python + Django',deploy:'Vercel'},expect:'warn'},
  {name:'Angular+Vercel=WARN',a:{frontend:'Angular',deploy:'Vercel'},expect:'warn'},
  {name:'Nuxt+FirebaseH=WARN',a:{frontend:'Vue 3 + Nuxt',deploy:'Firebase Hosting'},expect:'warn'},
  {name:'FullAuto+Beginner=WARN',a:{ai_auto:'フル自律開発',skill_level:'Beginner'},expect:'warn'},
  {name:'Orch+Intermediate=WARN',a:{ai_auto:'オーケストレーター',skill_level:'Intermediate'},expect:'warn'},
  {name:'Multi+Beginner=WARN',a:{ai_auto:'マルチAgent協調',skill_level:'Beginner'},expect:'warn'},
  {name:'Static+Stripe=WARN',a:{backend:'なし（静的サイト）',payment:'Stripe決済'},expect:'warn'},
  {name:'Saleor+Express=WARN',a:{backend:'Node.js + Express',payment:'Saleor (Python EC)'},expect:'warn'},
  // OK cases (should have no issues)
  {name:'React+Expo=OK',a:{frontend:'React + Next.js',mobile:'Expo (React Native)'},expect:'none'},
  {name:'Express+Prisma=OK',a:{backend:'Node.js + Express',orm:'Prisma'},expect:'info'},
  {name:'Next+Vercel=OK',a:{frontend:'React + Next.js',deploy:'Vercel'},expect:'info'},
  {name:'Supabase+SupaDB=OK',a:{backend:'Supabase',database:'Supabase (PostgreSQL)'},expect:'none'},
  {name:'Firebase+Firestore=OK',a:{backend:'Firebase',database:'Firebase Firestore'},expect:'none'},
  {name:'Pro+FullAuto=noSkillMismatch',a:{ai_auto:'フル自律開発',skill_level:'Professional'},expect:'none',id:'ai-auto-skill-mismatch'},
  {name:'Antigravity+Windsurf=warn',a:{ai_tools:'Google Antigravity, Windsurf'},expect:'warn'},
  {name:'Antigravity only=OK',a:{ai_tools:'Google Antigravity, Claude Code'},expect:'none'},
  {name:'OpenRouter=info',a:{ai_tools:'Cursor, OpenRouter'},expect:'info'},
  // ── Phase A: Semantic Consistency Rules ──
  // A1: scope_out native vs mobile
  {name:'Scope:ネイティブ+Mobile=ERROR',a:{scope_out:'ネイティブアプリ, リアルタイム通信',mobile:'Expo (React Native)'},expect:'error',id:'sem-scope-mobile'},
  {name:'Scope:native+Mobile=ERROR',a:{scope_out:'native apps, realtime',mobile:'Expo (React Native)'},expect:'error',id:'sem-scope-mobile'},
  {name:'Scope:ネイティブ+NoMobile=OK',a:{scope_out:'ネイティブアプリ',mobile:'none'},expect:'none'},
  {name:'Scope:ネイティブ+PWA=OK',a:{scope_out:'ネイティブアプリ',mobile:'PWA'},expect:'none'},
  // A2: scope_out 決済 vs payment
  {name:'Scope:決済+Stripe=WARN',a:{scope_out:'決済機能, 多言語対応',payment:'Stripe決済'},expect:'warn',id:'sem-scope-payment'},
  {name:'Scope:EC+Pay=WARN',a:{scope_out:'EC機能',payment:'Stripe決済'},expect:'warn',id:'sem-scope-payment'},
  // A3: scope_out EC vs entities
  {name:'Scope:EC+Product=WARN',a:{scope_out:'EC機能',data_entities:'User, Product, Order'},expect:'warn',id:'sem-scope-entities'},
  // A4: Vercel+Express (no Next.js)
  {name:'Vercel+Express-noNext=WARN',a:{deploy:'Vercel',backend:'Node.js + Express',frontend:'React (Vite SPA)'},expect:'warn',id:'sem-deploy-express'},
  {name:'Vercel+Express+Next=OK(info)',a:{deploy:'Vercel',backend:'Node.js + Express',frontend:'React + Next.js'},expect:'info',id:'sem-deploy-bff'},
  // A5: Supabase + NextAuth
  {name:'Supabase+NextAuth=WARN',a:{backend:'Supabase',auth:'Auth.js/NextAuth'},expect:'warn',id:'sem-auth-supa-nextauth'},
  {name:'Supabase+SupaAuth=OK',a:{backend:'Supabase',auth:'Supabase Auth'},expect:'none'},
  // A6: non-Supabase + Supabase Auth
  {name:'Express+SupaAuth=WARN',a:{backend:'Node.js + Express',auth:'Supabase Auth'},expect:'warn',id:'sem-auth-nosupa-supaauth'},
  // A7: education + Product/Order
  {name:'Education+Product=INFO',a:{purpose:'教育・学習支援プラットフォーム',data_entities:'User, Course, Product, Order'},expect:'info',id:'sem-purpose-entities'},
  {name:'Education+Course=OK',a:{purpose:'教育・学習支援プラットフォーム',data_entities:'User, Course, Lesson, Progress'},expect:'none'},
  // A8: Next+Express+Vercel (BFF info)
  {name:'Next+Express+Vercel=INFO',a:{deploy:'Vercel',backend:'Node.js + Express',frontend:'React + Next.js'},expect:'info',id:'sem-deploy-bff'},
  // Security Rules
  {name:'Fintech+NoMFA=WARN',a:{purpose:'金融取引プラットフォーム',mvp_features:'認証, 取引履歴'},expect:'warn',id:'dom-sec-nomfa'},
  {name:'Health+NoMFA=WARN',a:{purpose:'医療記録管理システム',mvp_features:'認証, カルテ管理'},expect:'warn',id:'dom-sec-nomfa'},
  {name:'Legal+NoMFA=WARN',a:{purpose:'法務文書管理',mvp_features:'認証, 契約管理'},expect:'warn',id:'dom-sec-nomfa'},
  {name:'Fintech+MFA=OK',a:{purpose:'金融取引プラットフォーム',mvp_features:'認証, MFA, 取引履歴'},expect:'none'},
  {name:'Fintech+NoMFA+solo=OK',a:{purpose:'金融取引プラットフォーム',mvp_features:'認証, 取引履歴',scale:'solo'},expect:'none',id:'dom-sec-nomfa'},
  {name:'Health+NoMFA+solo=OK',a:{purpose:'医療記録管理システム',mvp_features:'認証, カルテ管理',scale:'solo'},expect:'none',id:'dom-sec-nomfa'},
  {name:'Payment+NoAuth=ERROR',a:{payment:'Stripe決済',auth:'なし'},expect:'error',id:'dom-sec-pay-noauth'},
  {name:'Payment+Auth=OK',a:{payment:'Stripe決済',auth:'Supabase Auth'},expect:'none'},
  {name:'Sensitive+NoAuth=WARN',a:{data_entities:'Patient, MedicalRecord',auth:'なし'},expect:'warn',id:'dom-sec-sensitive-noauth'},
  {name:'Transaction+NoAuth=WARN',a:{data_entities:'User, Transaction, Payment',auth:'なし'},expect:'warn',id:'dom-sec-sensitive-noauth'},
  {name:'Sensitive+Auth=OK',a:{data_entities:'Patient, MedicalRecord',auth:'Supabase Auth'},expect:'none'},
  // Domain ↔ Backend/Infra rules
  {name:'Health+Firebase=WARN',a:{purpose:'medical records system',backend:'Firebase'},expect:'warn',id:'dom-health-firebase'},
  {name:'Health+Supabase=noFirebaseWARN',a:{purpose:'medical records system',backend:'Supabase'},expect:'none',id:'dom-health-firebase'},
  {name:'IoT+Static=WARN',a:{purpose:'IoT device management platform',backend:'なし（静的サイト）'},expect:'warn',id:'dom-iot-static'},
  {name:'IoT+Firebase=noStaticWARN',a:{purpose:'IoT device management platform',backend:'Firebase'},expect:'none',id:'dom-iot-static'},
  {name:'Community+NoAuth=WARN',a:{purpose:'community forum platform',auth:'なし'},expect:'warn',id:'dom-community-noauth'},
  {name:'Community+Auth=OK',a:{purpose:'community forum platform',auth:'Supabase Auth'},expect:'none',id:'dom-community-noauth'},
  {name:'Fintech+NoAudit=WARN',a:{purpose:'fintech payment platform',data_entities:'User, Account, Transaction'},expect:'warn',id:'dom-fintech-noaudit'},
  {name:'Fintech+AuditLog=OK',a:{purpose:'fintech payment platform',data_entities:'User, Account, Transaction, AuditLog'},expect:'none',id:'dom-fintech-noaudit'},
  // Domain ↔ Payment/Realtime rules
  {name:'Booking+NoPay=WARN',a:{purpose:'restaurant booking system',payment:'なし'},expect:'warn',id:'dom-booking-nopay'},
  {name:'Booking+Stripe=OK',a:{purpose:'restaurant booking system',payment:'Stripe決済'},expect:'none',id:'dom-booking-nopay'},
  {name:'Marketplace+NoPay=WARN',a:{purpose:'marketplace platform',payment:'なし'},expect:'warn',id:'dom-marketplace-nopay'},
  {name:'Marketplace+Stripe=OK',a:{purpose:'marketplace platform',payment:'Stripe決済'},expect:'none',id:'dom-marketplace-nopay'},
  {name:'Collab+Static=WARN',a:{purpose:'collaboration tool',backend:'なし（静的サイト）'},expect:'warn',id:'dom-collab-static'},
  {name:'Collab+Supabase=OK',a:{purpose:'collaboration tool',backend:'Supabase'},expect:'none',id:'dom-collab-static'},
  {name:'Gamify+Static=WARN',a:{purpose:'gamification platform',backend:'なし（静的サイト）'},expect:'warn',id:'dom-gamify-static'},
  {name:'Gamify+Firebase=OK',a:{purpose:'gamification platform',backend:'Firebase'},expect:'none',id:'dom-gamify-static'},
  // Domain ↔ Monetization/Service rules
  {name:'Event+NoPay=WARN',a:{purpose:'event management platform',payment:'なし'},expect:'warn',id:'dom-event-nopay'},
  {name:'Event+Stripe=OK',a:{purpose:'event management platform',payment:'Stripe決済'},expect:'none',id:'dom-event-nopay'},
  {name:'Creator+NoPay=WARN',a:{purpose:'creator content platform',payment:'なし'},expect:'warn',id:'dom-creator-nopay'},
  {name:'Creator+Stripe=OK',a:{purpose:'creator content platform',payment:'Stripe決済'},expect:'none',id:'dom-creator-nopay'},
  {name:'Newsletter+NoEmail=INFO',a:{purpose:'newsletter platform',mvp_features:'認証, 購読管理'},expect:'info',id:'dom-newsletter-noemail'},
  {name:'Newsletter+Resend=OK',a:{purpose:'newsletter platform',mvp_features:'認証, 購読管理, Resend'},expect:'none',id:'dom-newsletter-noemail'},
  {name:'Government+NoAuth=WARN',a:{purpose:'government civic service platform',auth:'なし'},expect:'warn',id:'dom-government-noauth'},
  {name:'Government+Auth=OK',a:{purpose:'government civic service platform',auth:'Supabase Auth'},expect:'none',id:'dom-government-noauth'},
  {name:'Insurance+NoAudit=WARN',a:{purpose:'insurance claims management platform',data_entities:'User, Policy, Claim, Payment'},expect:'warn',id:'dom-insurance-noaudit'},
  {name:'Insurance+AuditLog=OK',a:{purpose:'insurance claims management platform',data_entities:'User, Policy, Claim, Payment, AuditLog'},expect:'none',id:'dom-insurance-noaudit'},
  {name:'Media+NoCDN=INFO',a:{purpose:'media streaming platform',mvp_features:'動画アップロード, 再生機能'},expect:'info',id:'dom-media-nocdn'},
  {name:'Media+CDN=OK',a:{purpose:'media streaming platform',mvp_features:'動画アップロード, Cloudflare CDN, 再生機能'},expect:'none',id:'dom-media-nocdn'},
  // Cloudflare Workers compatibility
  {name:'Django+CF=ERROR',a:{backend:'Python + Django',deploy:'Cloudflare Workers'},expect:'error',id:'be-dep-heavy-cf'},
  {name:'Spring+CF=ERROR',a:{backend:'Java + Spring Boot',deploy:'Cloudflare Workers'},expect:'error',id:'be-dep-heavy-cf'},
  {name:'Express+CF=WARN',a:{backend:'Node.js + Express',deploy:'Cloudflare Workers'},expect:'warn',id:'be-dep-node-cf'},
  {name:'NestJS+CF=WARN',a:{backend:'Node.js + NestJS',deploy:'Cloudflare Workers'},expect:'warn',id:'be-dep-node-cf'},
  {name:'Hono+CF=INFO',a:{backend:'Node.js + Hono',deploy:'Cloudflare Workers'},expect:'info',id:'be-dep-hono-cf'},
  {name:'CF+Firestore=WARN',a:{deploy:'Cloudflare Workers',database:'Firebase Firestore'},expect:'warn',id:'dep-db-cf-fs'},
  // Mobile + Auth
  {name:'Mobile+NoAuth=WARN',a:{mobile:'Expo (React Native)',auth:'なし'},expect:'warn',id:'mob-noauth'},
  {name:'Mobile+NextAuth=WARN',a:{mobile:'Expo (React Native)',auth:'Auth.js/NextAuth'},expect:'warn',id:'mob-auth-nextauth'},
  {name:'Mobile+SupaAuth=OK',a:{mobile:'Expo (React Native)',auth:'Supabase Auth'},expect:'none'},
  // Flutter + Auth
  {name:'Flutter+NextAuth=WARN',a:{mobile:'Flutter',auth:'Auth.js/NextAuth'},expect:'warn',id:'mob-auth-flutter-nextauth'},
  {name:'Flutter+SupaAuth=OK',a:{mobile:'Flutter',auth:'Supabase Auth'},expect:'none'},
  // Netlify deploy limitations
  {name:'Django+Netlify=WARN',a:{backend:'Python + Django',deploy:'Netlify'},expect:'warn',id:'be-dep-heavy-netlify'},
  {name:'Spring+Netlify=WARN',a:{backend:'Java + Spring Boot',deploy:'Netlify'},expect:'warn',id:'be-dep-heavy-netlify'},
  {name:'NestJS+Netlify=WARN',a:{backend:'Node.js + NestJS',deploy:'Netlify'},expect:'warn',id:'be-dep-nest-netlify'},
  {name:'NestJS+FirebaseHosting=WARN',a:{backend:'Node.js + NestJS',deploy:'Firebase Hosting'},expect:'warn',id:'be-dep-nest-fbh'},
  {name:'Express+Netlify=WARN',a:{backend:'Node.js + Express',deploy:'Netlify'},expect:'warn',id:'be-dep-express-netlify'},
  {name:'Express+FirebaseHosting=WARN',a:{backend:'Node.js + Express',deploy:'Firebase Hosting'},expect:'warn',id:'be-dep-express-fbh'},
  {name:'Fastify+FirebaseHosting=WARN',a:{backend:'Node.js + Fastify',deploy:'Firebase Hosting'},expect:'warn',id:'be-dep-express-fbh'},
  {name:'NestJS+Railway=noDepWARN',a:{backend:'Node.js + NestJS',deploy:'Railway'},expect:'info'},
  {name:'Express+Railway=noDepWARN',a:{backend:'Node.js + Express',deploy:'Railway'},expect:'info'},
  // Flutter + Firebase synergy
  {name:'Flutter+Firebase=INFO',a:{mobile:'Flutter',backend:'Firebase'},expect:'info',id:'mob-flutter-firebase'},
  {name:'Flutter+Supabase=INFO',a:{mobile:'Flutter',backend:'Supabase'},expect:'info',id:'mob-flutter-supabase'},
  {name:'Expo+Firebase=noFlutterINFO',a:{mobile:'Expo (React Native)',backend:'Firebase'},expect:'none'},
  // New Phase 5 rules
  {name:'Expo+Drizzle=WARN',a:{mobile:'Expo (React Native)',orm:'Drizzle ORM'},expect:'warn',id:'mob-expo-drizzle'},
  {name:'Flutter+Drizzle=noExpoWARN',a:{mobile:'Flutter',orm:'Drizzle ORM'},expect:'none',id:'mob-expo-drizzle'},
  {name:'Expo+Prisma=OK',a:{mobile:'Expo (React Native)',orm:'Prisma'},expect:'none'},
  // Kysely compat rules
  {name:'Python+Kysely=ERROR',a:{backend:'Python + FastAPI',orm:'Kysely'},expect:'error',id:'be-orm-py-prisma'},
  {name:'Java+Kysely=ERROR',a:{backend:'Java + Spring Boot',orm:'Kysely'},expect:'error',id:'be-orm-java-prisma'},
  {name:'Go+Kysely=ERROR',a:{backend:'Go + Gin',orm:'Kysely'},expect:'error',id:'be-orm-java-prisma'},
  {name:'Express+Kysely=OK',a:{backend:'Node.js + Express',orm:'Kysely'},expect:'info'},
  {name:'Kysely+Firestore=ERROR',a:{orm:'Kysely',database:'Firebase Firestore'},expect:'error',id:'orm-kysely-fs'},
  {name:'Kysely+MongoDB=ERROR',a:{orm:'Kysely',database:'MongoDB'},expect:'error',id:'orm-kysely-mongo'},
  {name:'Kysely+PostgreSQL=OK',a:{orm:'Kysely',database:'PostgreSQL'},expect:'none'},
  {name:'Expo+Kysely=WARN',a:{mobile:'Expo (React Native)',orm:'Kysely'},expect:'warn',id:'mob-expo-kysely'},
  {name:'Flutter+Kysely=noExpoWARN',a:{mobile:'Flutter',orm:'Kysely'},expect:'none',id:'mob-expo-kysely'},
  // API品質ルール
  {name:'GraphQL=DataLoaderWARN',a:{backend:'Express.js + Node.js + GraphQL'},expect:'warn',id:'api-graphql-no-dataloader'},
  {name:'Supabase=noDataLoaderWARN',a:{backend:'Supabase'},expect:'none',id:'api-graphql-no-dataloader'},
  {name:'FastAPI=RateLimitINFO',a:{backend:'FastAPI (Python)'},expect:'info',id:'api-rest-no-ratelimit'},
  {name:'NestJS=RateLimitINFO',a:{backend:'Node.js + NestJS'},expect:'info',id:'api-rest-no-ratelimit'},
  {name:'Supabase=noRateLimitINFO',a:{backend:'Supabase'},expect:'none',id:'api-rest-no-ratelimit'},
  // DB設計ルール
  {name:'MongoDB+Prisma=WARN',a:{database:'MongoDB',orm:'Prisma ORM'},expect:'warn',id:'db-mongo-prisma'},
  {name:'MongoDB+Mongoose=noWARN',a:{database:'MongoDB',orm:'Mongoose'},expect:'none',id:'db-mongo-prisma'},
  {name:'SQLite+Vercel=WARN',a:{database:'SQLite',deploy:'Vercel'},expect:'warn',id:'db-sqlite-prod'},
  {name:'SQLite+local=noWARN',a:{database:'SQLite',deploy:'ローカルのみ'},expect:'none',id:'db-sqlite-prod'},
  {name:'MySQL+Kysely=INFO',a:{database:'MySQL',orm:'Kysely'},expect:'info',id:'db-mysql-kysely'},
  {name:'PostgreSQL+Kysely=noINFO',a:{database:'PostgreSQL (Neon)',orm:'Kysely'},expect:'none',id:'db-mysql-kysely'},
  // テスト品質ルール
  {name:'Auth+Next.js+Playwright=E2Ewarn',a:{auth:'NextAuth.js',frontend:'React / Next.js',mobile:'なし',mvp_features:'Playwright E2Eテスト, ダッシュボード'},expect:'warn',id:'test-e2e-auth-storagestate'},
  {name:'Auth+Next.js+Cypress=E2Ewarn',a:{auth:'NextAuth.js',frontend:'React / Next.js',mobile:'なし',mvp_features:'Cypress E2Eテスト'},expect:'warn',id:'test-e2e-auth-storagestate'},
  {name:'Auth+Next.js+noE2E=noWarn',a:{auth:'NextAuth.js',frontend:'React / Next.js',mobile:'なし',mvp_features:'チャット機能, ダッシュボード'},expect:'none',id:'test-e2e-auth-storagestate'},
  {name:'Auth+Expo=noE2Ewarn',a:{auth:'Supabase Auth',frontend:'React / Next.js',mobile:'Expo (React Native)',mvp_features:'Playwright E2Eテスト'},expect:'none',id:'test-e2e-auth-storagestate'},
  {name:'NoAuth+Next.js=noE2Ewarn',a:{auth:'なし',frontend:'React / Next.js',mobile:'なし',mvp_features:'Playwright E2Eテスト'},expect:'none',id:'test-e2e-auth-storagestate'},
  {name:'Next.js=WebKitINFO',a:{frontend:'React / Next.js',mobile:'なし'},expect:'info',id:'test-playwright-webkit'},
  {name:'Vue=WebKitINFO',a:{frontend:'Vue 3 + Nuxt',mobile:'なし'},expect:'info',id:'test-playwright-webkit'},
  {name:'Expo-only=noWebKitINFO',a:{frontend:'React / Next.js',mobile:'Expo (React Native)'},expect:'none',id:'test-playwright-webkit'},
  {name:'Express=StrykerINFO',a:{backend:'Node.js + Express'},expect:'info',id:'test-mutation-stryker'},
  {name:'NestJS=StrykerINFO',a:{backend:'NestJS + tRPC'},expect:'info',id:'test-mutation-stryker'},
  {name:'FastAPI=noStrykerINFO',a:{backend:'Python / FastAPI'},expect:'none',id:'test-mutation-stryker'},
  // AI安全性ルール
  {name:'AI+NoGuardrail=WARN',a:{ai_auto:'Claude APIを活用したチャット',mvp_features:'チャット機能, ファイルアップロード'},expect:'warn',id:'ai-guardrail-missing'},
  {name:'AI+Guardrail=OK',a:{ai_auto:'Claude APIを活用したチャット',mvp_features:'チャット機能, ガードレール設定, 入力フィルタ'},expect:'none',id:'ai-guardrail-missing'},
  {name:'NoAI+NoGuardrail=OK',a:{ai_auto:'なし',mvp_features:'チャット機能'},expect:'none',id:'ai-guardrail-missing'},
  {name:'UPPDefault+NoGuardrail=OK',a:{ai_auto:'マルチAgent協調',mvp_features:'チャット機能'},expect:'none',id:'ai-guardrail-missing'},
  {name:'VibeCode+NoGuardrail=OK',a:{ai_auto:'Vibe Coding入門',mvp_features:'チャット機能'},expect:'none',id:'ai-guardrail-missing'},
  {name:'AI+Solo+NoGuardrail=OK',a:{ai_auto:'OpenAI GPT-4 API統合',mvp_features:'チャット機能',scale:'solo'},expect:'none',id:'ai-guardrail-missing'},
  {name:'AI+NoAuth=LLMwarn',a:{ai_auto:'OpenAI API統合',auth:'なし'},expect:'warn',id:'ai-noauth-llm'},
  {name:'AI+Auth=noLLMwarn',a:{ai_auto:'OpenAI API統合',auth:'Supabase Auth'},expect:'none',id:'ai-noauth-llm'},
  {name:'AI+Patient=PIIwarn',a:{ai_auto:'Claude API医療AI',data_entities:'Patient, MedicalRecord, Doctor'},expect:'warn',id:'ai-pii-masking'},
  {name:'AI+NoPII=noPIIwarn',a:{ai_auto:'Claude API',data_entities:'User, Post, Comment'},expect:'none',id:'ai-pii-masking'},
  {name:'AI+PII+masking=noPIIwarn',a:{ai_auto:'Claude API医療AI',data_entities:'Patient, MedicalRecord',mvp_features:'診断支援, PII匿名化'},expect:'none',id:'ai-pii-masking'},
  {name:'AI+Express=RateLimitINFO',a:{ai_auto:'Claude API',backend:'Node.js + Express'},expect:'info',id:'ai-ratelimit-reminder'},
  {name:'AI+BaaS=noRateLimitINFO',a:{ai_auto:'Claude API',backend:'Firebase'},expect:'none',id:'ai-ratelimit-reminder'},
  {name:'Ollama+Vercel=infraINFO',a:{ai_auto:'Ollama (ローカルLLM) + llama3',deploy:'Vercel'},expect:'info',id:'ai-local-model-infra'},
  // Cross-pillar P21/P22/P25
  {name:'4ents=OpenAPIremind',a:{data_entities:'User,Post,Comment,Tag',mvp_features:'投稿管理'},expect:'info',id:'api-openapi-remind'},
  {name:'3ents=noOpenAPIremind',a:{data_entities:'User,Post,Comment',mvp_features:'投稿管理'},expect:'none',id:'api-openapi-remind'},
  {name:'5ents+Prisma=N1risk',a:{orm:'Prisma ORM',data_entities:'User,Post,Comment,Tag,Category'},expect:'info',id:'orm-n1-risk'},
  {name:'5ents+noORM=noN1risk',a:{orm:'',data_entities:'User,Post,Comment,Tag,Category'},expect:'none',id:'orm-n1-risk'},
  {name:'Vercel+PostgreSQL=backupRemind',a:{deploy:'Vercel',database:'PostgreSQL (Neon)'},expect:'info',id:'prod-backup-remind'},
  {name:'noDeployDB=noBackupRemind',a:{deploy:'localhost',database:'SQLite'},expect:'none',id:'prod-backup-remind'},
  // ── Cross-layer rules CL-1〜CL-12 ──
  {name:'Vercel+PG+noPool=WARN',a:{deploy:'Vercel',database:'PostgreSQL'},expect:'warn',id:'infra-pg-no-pool'},
  {name:'Vercel+PG+pooler=noPoolWARN',a:{deploy:'Vercel',database:'Neon (PostgreSQL)',mvp_features:'Connection pooling, auth'},expect:'none',id:'infra-pg-no-pool'},
  {name:'Railway+PG=noPoolWARN',a:{deploy:'Railway',database:'PostgreSQL'},expect:'none',id:'infra-pg-no-pool'},
  {name:'FastAPI+PG=syncWARN',a:{backend:'Python + FastAPI',database:'PostgreSQL (Neon)'},expect:'warn',id:'be-python-sync-driver'},
  {name:'Django+PG=noSyncWARN',a:{backend:'Python + Django',database:'PostgreSQL (Neon)'},expect:'none',id:'be-python-sync-driver'},
  {name:'Fintech+CustomJWT=WARN',a:{auth:'Custom JWT (jose)',purpose:'金融取引決済プラットフォーム'},expect:'warn',id:'auth-enterprise-jwt'},
  {name:'SaaS+CustomJWT=noWARN',a:{auth:'Custom JWT (jose)',purpose:'SaaSダッシュボード管理'},expect:'none',id:'auth-enterprise-jwt'},
  {name:'7ents+noPagination=WARN',a:{data_entities:'User,Post,Comment,Tag,Category,Like,Follow',mvp_features:'投稿管理機能'},expect:'warn',id:'api-large-no-pagination'},
  {name:'7ents+pagination=noWARN',a:{data_entities:'User,Post,Comment,Tag,Category,Like,Follow',mvp_features:'投稿管理, ページネーション機能'},expect:'none',id:'api-large-no-pagination'},
  {name:'6ents+noPagination=noWARN',a:{data_entities:'User,Post,Comment,Tag,Category,Like',mvp_features:'投稿管理'},expect:'none',id:'api-large-no-pagination'},
  {name:'7ents+noPagination+solo=noWARN',a:{data_entities:'User,Post,Comment,Tag,Category,Like,Follow',mvp_features:'投稿管理機能',scale:'solo'},expect:'none',id:'api-large-no-pagination'},
  {name:'Vercel+noMonitor=INFO',a:{deploy:'Vercel',mvp_features:'認証機能, ファイル管理'},expect:'info',id:'infra-prod-no-monitoring'},
  {name:'Vercel+Sentry=noMonitorINFO',a:{deploy:'Vercel',mvp_features:'認証, Sentryエラー監視'},expect:'none',id:'infra-prod-no-monitoring'},
  {name:'Supabase+2ents+noRLS=INFO',a:{backend:'Supabase',data_entities:'User,Post'},expect:'info',id:'supa-no-rls'},
  {name:'Supabase+RLS=noINFO',a:{backend:'Supabase',data_entities:'User,Post',mvp_features:'RLSポリシー設定'},expect:'none',id:'supa-no-rls'},
  {name:'Firebase+noRLS=noINFO',a:{backend:'Firebase',data_entities:'User,Post'},expect:'none',id:'supa-no-rls'},
  {name:'EC+ReactSPA=SEOwarn',a:{frontend:'React (Vite SPA)',purpose:'ECサイト 商品販売'},expect:'warn',id:'fe-seo-nossr'},
  {name:'EC+Nextjs=noSEOwarn',a:{frontend:'React + Next.js',purpose:'ECサイト 商品販売'},expect:'none',id:'fe-seo-nossr'},
  {name:'Next+noA11y=INFO',a:{frontend:'React + Next.js',mvp_features:'認証, ダッシュボード'},expect:'info',id:'a11y-no-axe'},
  {name:'Next+axe=noA11yINFO',a:{frontend:'React + Next.js',mvp_features:'axeアクセシビリティテスト'},expect:'none',id:'a11y-no-axe'},
  {name:'Vercel+PG+noPriv=INFO',a:{deploy:'Vercel',database:'PostgreSQL (Neon)'},expect:'info',id:'zt-db-privilege'},
  {name:'Vercel+PG+roles=noPrivINFO',a:{deploy:'Vercel',database:'PostgreSQL (Neon)',mvp_features:'DB権限ロール設定'},expect:'none',id:'zt-db-privilege'},
  {name:'Express+noCORS=WARN',a:{backend:'Node.js + Express',deploy:'Vercel'},expect:'warn',id:'api-cors-wildcard'},
  {name:'Supabase+noCORS=noWARN',a:{backend:'Supabase',deploy:'Vercel'},expect:'none',id:'api-cors-wildcard'},
  {name:'GraphQL+noDepth=WARN',a:{backend:'Express.js + Node.js + GraphQL',mvp_features:'ユーザー管理'},expect:'warn',id:'api-graphql-depth-limit'},
  {name:'GraphQL+depth=noWARN',a:{backend:'Express.js + Node.js + GraphQL',mvp_features:'depth-limitクエリ制限'},expect:'none',id:'api-graphql-depth-limit'},
  {name:'PG+noMigration=INFO',a:{database:'PostgreSQL (Neon)',orm:'なし（BaaS利用）'},expect:'info',id:'db-migration-tool'},
  {name:'PG+Prisma=noMigrationINFO',a:{database:'PostgreSQL (Neon)',orm:'Prisma ORM'},expect:'none',id:'db-migration-tool'},
  // ── Semantic / Runtime Compatibility (10 new rules) ──
  // be-firebase-prisma (ERROR)
  {name:'Firebase+Prisma=ERROR',a:{backend:'Firebase',orm:'Prisma'},expect:'error',id:'be-firebase-prisma'},
  {name:'Firebase+FirebaseSDK=noERROR',a:{backend:'Firebase',orm:'Firebase Admin SDK'},expect:'none',id:'be-firebase-prisma'},
  {name:'Supabase+Prisma=noFirebasePrismaERROR',a:{backend:'Supabase',orm:'Prisma'},expect:'none',id:'be-firebase-prisma'},
  // be-firebase-typeorm (ERROR)
  {name:'Firebase+TypeORM=ERROR',a:{backend:'Firebase',orm:'TypeORM'},expect:'error',id:'be-firebase-typeorm'},
  {name:'Firebase+AdminSDK=noTypeORMERROR',a:{backend:'Firebase',orm:'Firebase Admin SDK'},expect:'none',id:'be-firebase-typeorm'},
  {name:'NestJS+TypeORM=noFirebaseTypeORMERROR',a:{backend:'Node.js + NestJS',orm:'TypeORM'},expect:'none',id:'be-firebase-typeorm'},
  // mt-supabase-no-rls (ERROR)
  {name:'Supabase+B2B+noRLS=ERROR',a:{backend:'Supabase',org_model:'B2B company management',mvp_features:'認証, ダッシュボード'},expect:'error',id:'mt-supabase-no-rls'},
  {name:'Supabase+team+RLS=noERROR',a:{backend:'Supabase',org_model:'team collaboration',mvp_features:'RLS policy, 認証'},expect:'none',id:'mt-supabase-no-rls'},
  {name:'Firebase+B2B=noRLSERROR',a:{backend:'Firebase',org_model:'B2B enterprise'},expect:'none',id:'mt-supabase-no-rls'},
  // deploy-sqlite-vercel (WARN)
  {name:'SQLite+Vercel=deployWARN',a:{database:'SQLite',deploy:'Vercel'},expect:'warn',id:'deploy-sqlite-vercel'},
  {name:'SQLite+Railway=noDeployWARN',a:{database:'SQLite',deploy:'Railway'},expect:'none',id:'deploy-sqlite-vercel'},
  {name:'PostgreSQL+Vercel=noSQLiteWARN',a:{database:'PostgreSQL',deploy:'Vercel'},expect:'none',id:'deploy-sqlite-vercel'},
  // db-pg-vercel-nopool (WARN)
  {name:'PG+Vercel+noPool(new)=WARN',a:{deploy:'Vercel',database:'PostgreSQL'},expect:'warn',id:'db-pg-vercel-nopool'},
  {name:'Neon+Vercel=noPoolWARN',a:{deploy:'Vercel',database:'Neon (PostgreSQL)'},expect:'none',id:'db-pg-vercel-nopool'},
  {name:'Railway+PG=noPoolNewWARN',a:{deploy:'Railway',database:'PostgreSQL'},expect:'none',id:'db-pg-vercel-nopool'},
  // be-nestjs-beginner (WARN)
  {name:'NestJS+Beginner=WARN',a:{backend:'Node.js + NestJS',skill_level:'Beginner'},expect:'warn',id:'be-nestjs-beginner'},
  {name:'NestJS+Pro=noBeginnerWARN',a:{backend:'Node.js + NestJS',skill_level:'Professional'},expect:'none',id:'be-nestjs-beginner'},
  {name:'Express+Beginner=noNestWARN',a:{backend:'Node.js + Express',skill_level:'Beginner'},expect:'none',id:'be-nestjs-beginner'},
  // orm-sqlalchemy-vercel (WARN)
  {name:'SQLAlchemy+Vercel=WARN',a:{orm:'SQLAlchemy (Python)',deploy:'Vercel'},expect:'warn',id:'orm-sqlalchemy-vercel'},
  {name:'SQLAlchemy+Railway=noVercelWARN',a:{orm:'SQLAlchemy (Python)',deploy:'Railway'},expect:'none',id:'orm-sqlalchemy-vercel'},
  {name:'Prisma+Vercel=noSQLAlchemyWARN',a:{orm:'Prisma',deploy:'Vercel'},expect:'none',id:'orm-sqlalchemy-vercel'},
  // pay-stripe-static-be (WARN)
  {name:'Stripe+Static=WebhookWARN',a:{payment:'Stripe決済',backend:'なし（静的サイト）'},expect:'warn',id:'pay-stripe-static-be'},
  {name:'Stripe+Express=noWebhookWARN',a:{payment:'Stripe決済',backend:'Node.js + Express'},expect:'none',id:'pay-stripe-static-be'},
  {name:'Stripe+None=noWebhookWARN',a:{payment:'なし',backend:'なし（静的サイト）'},expect:'none',id:'pay-stripe-static-be'},
  // fe-nextjs-realtime-naked (INFO)
  {name:'Next+Realtime+noPusher=INFO',a:{frontend:'React + Next.js',mvp_features:'リアルタイムチャット, 通知機能'},expect:'info',id:'fe-nextjs-realtime-naked'},
  {name:'Next+Realtime+Pusher=noINFO',a:{frontend:'React + Next.js',mvp_features:'リアルタイムチャット, Pusher統合'},expect:'none',id:'fe-nextjs-realtime-naked'},
  {name:'Next+NoRealtime=noRealtimeINFO',a:{frontend:'React + Next.js',mvp_features:'認証, ダッシュボード'},expect:'none',id:'fe-nextjs-realtime-naked'},
  // auth-baas-custom-jwt (INFO)
  {name:'Firebase+CustomJWT=INFO',a:{backend:'Firebase',auth:'JWT (jose)'},expect:'info',id:'auth-baas-custom-jwt'},
  {name:'Supabase+CustomJWT=INFO',a:{backend:'Supabase',auth:'JWT (custom)'},expect:'info',id:'auth-baas-custom-jwt'},
  {name:'Firebase+FirebaseAuth=noJWTINFO',a:{backend:'Firebase',auth:'Firebase Auth'},expect:'none',id:'auth-baas-custom-jwt'},
  // deploy-cloudflare-node-orm (INFO)
  {name:'CF+Prisma=EdgeINFO',a:{orm:'Prisma',deploy:'Cloudflare Workers'},expect:'info',id:'deploy-cloudflare-node-orm'},
  {name:'CF+SQLAlchemy=EdgeINFO',a:{orm:'SQLAlchemy (Python)',deploy:'Cloudflare Workers'},expect:'info',id:'deploy-cloudflare-node-orm'},
  {name:'CF+Drizzle=noEdgeINFO',a:{orm:'Drizzle ORM',deploy:'Cloudflare Workers'},expect:'none',id:'deploy-cloudflare-node-orm'},
  // dom-saas-nopay (WARN)
  {name:'SaaS+noPay=WARN',a:{purpose:'SaaS subscription management platform',payment:'なし'},expect:'warn',id:'dom-saas-nopay'},
  {name:'SaaS+Stripe=noSaasPayWARN',a:{purpose:'SaaS subscription management platform',payment:'Stripe決済'},expect:'none',id:'dom-saas-nopay'},
  // dom-government-firebase (WARN)
  {name:'Government+Firebase=WARN',a:{purpose:'government portal for citizen services',backend:'Firebase'},expect:'warn',id:'dom-government-firebase'},
  {name:'Government+Supabase=noGovFirebaseWARN',a:{purpose:'government portal for citizen services',backend:'Supabase'},expect:'none',id:'dom-government-firebase'},
  // dom-legal-noaudit (WARN)
  {name:'Legal+noAudit=WARN',a:{purpose:'legal document management system',data_entities:'User, Contract, Case, Document'},expect:'warn',id:'dom-legal-noaudit'},
  {name:'Legal+AuditLog=noLegalWARN',a:{purpose:'legal document management system',data_entities:'User, Contract, Case, AuditLog'},expect:'none',id:'dom-legal-noaudit'},
  // mob-flutter-drizzle (WARN)
  {name:'Flutter+Drizzle=WARN',a:{mobile:'Flutter',orm:'Drizzle ORM'},expect:'warn',id:'mob-flutter-drizzle'},
  {name:'Expo+Drizzle=noFlutterDrizzleWARN',a:{mobile:'Expo (React Native)',orm:'Drizzle ORM'},expect:'none',id:'mob-flutter-drizzle'},
  // mob-flutter-kysely (WARN)
  {name:'Flutter+Kysely=WARN',a:{mobile:'Flutter',orm:'Kysely'},expect:'warn',id:'mob-flutter-kysely'},
  {name:'Flutter+Prisma=noFlutterKyselyWARN',a:{mobile:'Flutter',orm:'Prisma'},expect:'none',id:'mob-flutter-kysely'},
  // be-dep-py-fbh (ERROR)
  {name:'FastAPI+FirebaseHosting=ERROR',a:{backend:'Python + FastAPI',deploy:'Firebase Hosting'},expect:'error',id:'be-dep-py-fbh'},
  {name:'FastAPI+Railway=noPyFBHERROR',a:{backend:'Python + FastAPI',deploy:'Railway'},expect:'none',id:'be-dep-py-fbh'},
  // be-dep-java-fbh (ERROR)
  {name:'Spring+FirebaseHosting=ERROR',a:{backend:'Java + Spring Boot',deploy:'Firebase Hosting'},expect:'error',id:'be-dep-java-fbh'},
  {name:'Spring+Railway=noJavaFBHERROR',a:{backend:'Java + Spring Boot',deploy:'Railway'},expect:'none',id:'be-dep-java-fbh'},
  // be-dep-py-cf (ERROR)
  {name:'FastAPI+Cloudflare=ERROR',a:{backend:'Python + FastAPI',deploy:'Cloudflare Workers'},expect:'error',id:'be-dep-py-cf'},
  {name:'Django+Cloudflare=noPyCfERROR',a:{backend:'Python + Django',deploy:'Cloudflare Workers'},expect:'none',id:'be-dep-py-cf'},
  // sem-auth-nofb-fbauth (WARN)
  {name:'FirebaseAuth+Express=WARN',a:{auth:'Firebase Auth',backend:'Node.js + Express'},expect:'warn',id:'sem-auth-nofb-fbauth'},
  {name:'FirebaseAuth+Firebase=noFbAuthWARN',a:{auth:'Firebase Auth',backend:'Firebase'},expect:'none',id:'sem-auth-nofb-fbauth'},
  // db-redis-primary (WARN)
  {name:'RedisOnly=WARN',a:{database:'Redis'},expect:'warn',id:'db-redis-primary'},
  {name:'Redis+PG=noRedisPrimaryWARN',a:{database:'Redis + PostgreSQL'},expect:'none',id:'db-redis-primary'},
  // orm-typeorm-fs (ERROR)
  {name:'TypeORM+Firestore=ERROR',a:{orm:'TypeORM',database:'Firebase Firestore'},expect:'error',id:'orm-typeorm-fs'},
  {name:'TypeORM+PostgreSQL=noTypeORMFsERROR',a:{orm:'TypeORM',database:'PostgreSQL'},expect:'none',id:'orm-typeorm-fs'},
  // orm-sqla-fs (ERROR)
  {name:'SQLAlchemy+Firestore=ERROR',a:{orm:'SQLAlchemy (Python)',database:'Firebase Firestore'},expect:'error',id:'orm-sqla-fs'},
  {name:'SQLAlchemy+PostgreSQL=noSQLAFsERROR',a:{orm:'SQLAlchemy (Python)',database:'PostgreSQL'},expect:'none',id:'orm-sqla-fs'},
  // orm-sqla-mongo (ERROR)
  {name:'SQLAlchemy+MongoDB=ERROR',a:{orm:'SQLAlchemy (Python)',database:'MongoDB'},expect:'error',id:'orm-sqla-mongo'},
  {name:'Prisma+MongoDB=noSQLAMongoERROR',a:{orm:'Prisma',database:'MongoDB'},expect:'none',id:'orm-sqla-mongo'},
  // orm-typeorm-mongo (INFO)
  {name:'TypeORM+MongoDB=INFO',a:{orm:'TypeORM',database:'MongoDB'},expect:'info',id:'orm-typeorm-mongo'},
  {name:'Mongoose+MongoDB=noTypeORMMongoINFO',a:{orm:'Mongoose',database:'MongoDB'},expect:'none',id:'orm-typeorm-mongo'},
  // be-dep-java-netlify (ERROR)
  {name:'Spring+Netlify=ERROR',a:{backend:'Java + Spring Boot',deploy:'Netlify'},expect:'error',id:'be-dep-java-netlify'},
  {name:'Spring+Railway=noJavaNetlifyERROR',a:{backend:'Java + Spring Boot',deploy:'Railway'},expect:'none',id:'be-dep-java-netlify'},
  // auth-dual-baas (WARN)
  {name:'FirebaseAuth+SupabaseAuth=WARN',a:{auth:'Firebase Auth + Supabase Auth'},expect:'warn',id:'auth-dual-baas'},
  {name:'FirebaseAuthOnly=noDualBaasWARN',a:{auth:'Firebase Auth'},expect:'none',id:'auth-dual-baas'},
  // be-nextjs-typeorm (WARN)
  {name:'Nextjs+TypeORM=WARN',a:{backend:'Next.js',orm:'TypeORM'},expect:'warn',id:'be-nextjs-typeorm'},
  {name:'Nextjs+Prisma=noNextjsTypeORMWARN',a:{backend:'Next.js',orm:'Prisma ORM'},expect:'none',id:'be-nextjs-typeorm'},
  // orm-prisma-fs (ERROR)
  {name:'Prisma+Firestore=ERROR',a:{orm:'Prisma',database:'Firebase Firestore'},expect:'error',id:'orm-prisma-fs'},
  {name:'Prisma+PostgreSQL=noPrismaFsERROR',a:{orm:'Prisma',database:'PostgreSQL (Neon)'},expect:'none',id:'orm-prisma-fs'},
  // db-supabase-typeorm (WARN)
  {name:'Supabase+TypeORM=WARN',a:{database:'Supabase (PostgreSQL)',orm:'TypeORM'},expect:'warn',id:'db-supabase-typeorm'},
  {name:'Supabase+Drizzle=noSupabaseTypeORMWARN',a:{database:'Supabase (PostgreSQL)',orm:'Drizzle ORM'},expect:'none',id:'db-supabase-typeorm'},
  // orm-prisma-supabase (INFO)
  {name:'Supabase+Prisma=INFO',a:{database:'Supabase (PostgreSQL)',orm:'Prisma ORM'},expect:'info',id:'orm-prisma-supabase'},
  {name:'Neon+Prisma=noPrismaSupabaseINFO',a:{database:'Neon (PostgreSQL)',orm:'Prisma ORM'},expect:'none',id:'orm-prisma-supabase'},
  // be-dep-fastapi-vercel (WARN)
  {name:'FastAPI+Vercel=WARN',a:{backend:'Python + FastAPI',deploy:'Vercel'},expect:'warn',id:'be-dep-fastapi-vercel'},
  {name:'FastAPI+Railway=noFastapiVercelWARN',a:{backend:'Python + FastAPI',deploy:'Railway'},expect:'none',id:'be-dep-fastapi-vercel'},
  // be-dep-fastapi-netlify (WARN)
  {name:'FastAPI+Netlify=WARN',a:{backend:'Python + FastAPI',deploy:'Netlify'},expect:'warn',id:'be-dep-fastapi-netlify'},
  {name:'Django+Netlify=noFastapiNetlifyWARN',a:{backend:'Python + Django',deploy:'Netlify'},expect:'none',id:'be-dep-fastapi-netlify'},
  // fe-nextjs-firebase (WARN)
  {name:'Nextjs+FirebaseHosting=WARN',a:{frontend:'React + Next.js',deploy:'Firebase Hosting'},expect:'warn',id:'fe-nextjs-firebase'},
  {name:'Nextjs+Vercel=noNextjsFirebaseWARN',a:{frontend:'React + Next.js',deploy:'Vercel'},expect:'none',id:'fe-nextjs-firebase'},
  {name:'ReactSPA+FirebaseHosting=noNextjsFirebaseWARN',a:{frontend:'React (Vite SPA)',deploy:'Firebase Hosting'},expect:'none',id:'fe-nextjs-firebase'},
  // be-dep-go-cf (ERROR)
  {name:'Go+Cloudflare=ERROR',a:{backend:'Go (Gin)',deploy:'Cloudflare Workers'},expect:'error',id:'be-dep-go-cf'},
  {name:'Go+Railway=noGoCfERROR',a:{backend:'Go (Gin)',deploy:'Railway'},expect:'none',id:'be-dep-go-cf'},
  // auth-firebase-supabase-rls (WARN)
  {name:'FirebaseAuth+SupabaseDB=WARN',a:{auth:'Firebase Auth',database:'Supabase (PostgreSQL)'},expect:'warn',id:'auth-firebase-supabase-rls'},
  {name:'SupabaseAuth+SupabaseDB=noRlsWARN',a:{auth:'Supabase Auth',database:'Supabase (PostgreSQL)'},expect:'none',id:'auth-firebase-supabase-rls'},
  // be-dep-deno-netlify (WARN)
  {name:'Deno+Netlify=WARN',a:{backend:'Deno + Hono',deploy:'Netlify'},expect:'warn',id:'be-dep-deno-netlify'},
  {name:'Deno+DenoDeply=noDenNetlifyWARN',a:{backend:'Deno + Hono',deploy:'Deno Deploy'},expect:'none',id:'be-dep-deno-netlify'},
  // fe-astro-firebase (WARN)
  {name:'Astro+FirebaseHosting=WARN',a:{frontend:'Astro',deploy:'Firebase Hosting'},expect:'warn',id:'fe-astro-firebase'},
  {name:'Astro+Vercel=noAstroFbhWARN',a:{frontend:'Astro',deploy:'Vercel'},expect:'none',id:'fe-astro-firebase'},
  {name:'Nextjs+FirebaseHosting=noAstroFbhWARN',a:{frontend:'React + Next.js',deploy:'Firebase Hosting'},expect:'none',id:'fe-astro-firebase'},
  // orm-mongoose-pg (WARN)
  {name:'Mongoose+PostgreSQL=WARN',a:{orm:'Mongoose',database:'PostgreSQL (Neon)'},expect:'warn',id:'orm-mongoose-pg'},
  {name:'Mongoose+MongoDB=noMongoosePgWARN',a:{orm:'Mongoose',database:'MongoDB'},expect:'none',id:'orm-mongoose-pg'},
  // be-dep-bun-cf (ERROR)
  {name:'Bun+Cloudflare=ERROR',a:{backend:'Bun + Hono',deploy:'Cloudflare Workers'},expect:'error',id:'be-dep-bun-cf'},
  {name:'Bun+Railway=noBunCfERROR',a:{backend:'Bun + Hono',deploy:'Railway'},expect:'none',id:'be-dep-bun-cf'},
  // auth-cognito-supabase (WARN)
  {name:'Cognito+SupabaseDB=WARN',a:{auth:'AWS Cognito',database:'Supabase (PostgreSQL)'},expect:'warn',id:'auth-cognito-supabase'},
  {name:'SupabaseAuth+SupabaseDB=noCognitoWARN',a:{auth:'Supabase Auth',database:'Supabase (PostgreSQL)'},expect:'none',id:'auth-cognito-supabase'},
  // be-dep-spring-vercel (ERROR) — Spring Boot + Vercel
  {name:'SpringBoot+Vercel=ERROR',a:{backend:'Spring Boot (Java)',deploy:'Vercel'},expect:'error',id:'be-dep-spring-vercel'},
  {name:'SpringBoot+Railway=noSpringVercelERROR',a:{backend:'Spring Boot (Java)',deploy:'Railway'},expect:'none',id:'be-dep-spring-vercel'},
  // be-dep-bun-vercel (ERROR) — Bun + Vercel
  {name:'Bun+Vercel=ERROR',a:{backend:'Bun + Hono',deploy:'Vercel'},expect:'error',id:'be-dep-bun-vercel'},
  {name:'Node+Vercel=noBunVercelERROR',a:{backend:'Node.js + Express',deploy:'Vercel'},expect:'none',id:'be-dep-bun-vercel'},
  // orm-mongoose-fs (ERROR) — Mongoose + Firestore
  {name:'Mongoose+Firestore=ERROR',a:{orm:'Mongoose',database:'Firestore'},expect:'error',id:'orm-mongoose-fs'},
  {name:'Mongoose+MongoDB=noMongooseFsERROR',a:{orm:'Mongoose',database:'MongoDB'},expect:'none',id:'orm-mongoose-fs'},
  // auth-nextauth-supabase-rls (WARN) — NextAuth + Supabase
  {name:'NextAuth+SupabaseDB=WARN',a:{auth:'NextAuth (Auth.js)',database:'Supabase (PostgreSQL)'},expect:'warn',id:'auth-nextauth-supabase-rls'},
  {name:'SupabaseAuth+SupabaseDB=noNextAuthRlsWARN',a:{auth:'Supabase Auth',database:'Supabase (PostgreSQL)'},expect:'none',id:'auth-nextauth-supabase-rls'},
  // auth-clerk-firebase (WARN) — Clerk + Firebase/Firestore
  {name:'Clerk+Firebase=WARN',a:{auth:'Clerk',backend:'Firebase'},expect:'warn',id:'auth-clerk-firebase'},
  {name:'FirebaseAuth+Firebase=noClerkFbWARN',a:{auth:'Firebase Auth',backend:'Firebase'},expect:'none',id:'auth-clerk-firebase'},
  // be-dep-deno-vercel (ERROR) — Deno + Vercel
  {name:'Deno+Vercel=ERROR',a:{backend:'Deno + Hono',deploy:'Vercel'},expect:'error',id:'be-dep-deno-vercel'},
  {name:'Deno+DenoDeploy=noDenoVercelERROR',a:{backend:'Deno + Hono',deploy:'Deno Deploy'},expect:'none',id:'be-dep-deno-vercel'},
  // be-dep-bun-netlify (ERROR) — Bun + Netlify
  {name:'Bun+Netlify=ERROR',a:{backend:'Bun + Hono',deploy:'Netlify'},expect:'error',id:'be-dep-bun-netlify'},
  {name:'Bun+Railway=noBunNetlifyERROR',a:{backend:'Bun + Hono',deploy:'Railway'},expect:'none',id:'be-dep-bun-netlify'},
  // dom-hr-noaudit (WARN) — HR domain without AuditLog
  {name:'HR+noAudit=WARN',a:{purpose:'HR recruiting and personnel management tool',data_entities:'User, JobPosting, Applicant, Interview, Evaluation'},expect:'warn',id:'dom-hr-noaudit'},
  {name:'HR+AuditLog=noHRAuditWARN',a:{purpose:'HR recruiting and personnel management tool',data_entities:'User, JobPosting, Applicant, AuditLog'},expect:'none',id:'dom-hr-noaudit'},
  // dom-education-noauth (WARN) — Education domain without auth
  {name:'Education+noAuth=WARN',a:{purpose:'e-learning LMS education platform for students',auth:'なし'},expect:'warn',id:'dom-education-noauth'},
  {name:'Education+Auth=noEduAuthWARN',a:{purpose:'e-learning LMS education platform for students',auth:'Firebase Auth'},expect:'none',id:'dom-education-noauth'},
  // dom-travel-nopay (WARN) — Travel domain without payment
  {name:'Travel+noPay=WARN',a:{purpose:'travel booking platform for tours and hotels',payment:'なし'},expect:'warn',id:'dom-travel-nopay'},
  {name:'Travel+Stripe=noTravelPayWARN',a:{purpose:'travel booking platform for tours and hotels',payment:'Stripe決済'},expect:'none',id:'dom-travel-nopay'},
  // dom-realestate-nopay (INFO) — Real estate domain without payment
  {name:'RealEstate+noPay=INFO',a:{purpose:'real estate property listing and management platform',payment:'なし'},expect:'info',id:'dom-realestate-nopay'},
  {name:'RealEstate+Stripe=noRealEstatePayINFO',a:{purpose:'real estate property listing and management platform',payment:'Stripe決済'},expect:'none',id:'dom-realestate-nopay'},
  // obs-cf-no-sdk-node (INFO) — Cloudflare Workers + Node.js BE
  {name:'Express+Cloudflare=obsINFO',a:{backend:'Node.js + Express',deploy:'Cloudflare Workers'},expect:'info',id:'obs-cf-no-sdk-node'},
  {name:'FastAPI+Cloudflare=noObsCfINFO',a:{backend:'Python + FastAPI',deploy:'Cloudflare Workers'},expect:'none',id:'obs-cf-no-sdk-node'},
  // obs-vercel-otel (INFO) — Vercel deploy
  {name:'Vercel=obsVercelINFO',a:{deploy:'Vercel'},expect:'info',id:'obs-vercel-otel'},
  {name:'Railway=noObsVercelINFO',a:{deploy:'Railway'},expect:'none',id:'obs-vercel-otel'},
  // obs-baas-limited (INFO) — Firebase/Supabase backend + deploy
  {name:'Firebase+Vercel+obsLimited=INFO',a:{backend:'Firebase',deploy:'Firebase Hosting'},expect:'info',id:'obs-baas-limited'},
  {name:'Supabase+Vercel+obsLimited=INFO',a:{backend:'Supabase',deploy:'Vercel'},expect:'info',id:'obs-baas-limited'},
  {name:'Express+Vercel+noObsBaasINFO',a:{backend:'Node.js + Express',deploy:'Vercel'},expect:'none',id:'obs-baas-limited'},
  // obs-py-structlog (INFO) — Python backend
  {name:'FastAPI+obsStructlog=INFO',a:{backend:'Python + FastAPI'},expect:'info',id:'obs-py-structlog'},
  {name:'Express+noObsPyINFO',a:{backend:'Node.js + Express'},expect:'none',id:'obs-py-structlog'},
  // obs-java-javaagent (INFO) — Java/Spring backend
  {name:'Spring+obsJavaagent=INFO',a:{backend:'Java + Spring Boot'},expect:'info',id:'obs-java-javaagent'},
  {name:'Express+noObsJavaINFO',a:{backend:'Node.js + Express'},expect:'none',id:'obs-java-javaagent'},
  // ── Phase C: 14 new rules ──
  // dom-gaming-noauth (WARN) — gaming purpose + auth=none
  {name:'gaming+noauth=WARN',a:{purpose:'オンラインマルチプレイゲームプラットフォーム',auth:'なし'},expect:'warn',id:'dom-gaming-noauth'},
  {name:'gaming+realauth=noWARN',a:{purpose:'オンラインゲーム',auth:'Supabase Auth'},expect:'none',id:'dom-gaming-noauth'},
  {name:'gaming+noauth+solo=noWARN',a:{purpose:'ゲーミングアプリ',auth:'なし',scale:'solo'},expect:'none',id:'dom-gaming-noauth'},
  // dom-childcare-minors (WARN) — childcare + payment + no MFA
  {name:'childcare+pay+noMFA=WARN',a:{purpose:'保育園管理アプリ',payment:'Stripe決済'},expect:'warn',id:'dom-childcare-minors'},
  {name:'childcare+pay+MFA=noWARN',a:{purpose:'保育園管理アプリ',payment:'Stripe決済',mvp_features:'多要素認証（MFA）'},expect:'none',id:'dom-childcare-minors'},
  {name:'childcare+nopay=noWARN',a:{purpose:'保育園管理アプリ',payment:'none'},expect:'none',id:'dom-childcare-minors'},
  // dom-cybersec-noaudit (WARN) — SOC/cybersec without audit entities
  {name:'DevSecOps+noAudit=WARN',a:{purpose:'DevSecOps脆弱性スキャンとパイプライン自動化',data_entities:'User, ScanConfig, Pipeline, Report'},expect:'warn',id:'dom-cybersec-noaudit'},
  {name:'cybersec+withAudit=noWARN',a:{purpose:'DevSecOps脆弱性スキャンとパイプライン自動化',data_entities:'User, VulnScan, RemediationTask, AuditLog'},expect:'none',id:'dom-cybersec-noaudit'},
  {name:'cybersec+withSecEvent=noWARN',a:{purpose:'サイバーセキュリティSOCプラットフォーム',data_entities:'User, SecurityEvent, Playbook, ThreatIndicator'},expect:'none',id:'dom-cybersec-noaudit'},
  // sec-sensitive-entity-norls (WARN) — Supabase + sensitive entities + no org_model
  {name:'Supabase+MedicalRecord+noRLS=WARN',a:{backend:'Supabase',data_entities:'User, MedicalRecord, Doctor, Prescription'},expect:'warn',id:'sec-sensitive-entity-norls'},
  {name:'Supabase+MedicalRecord+RLS=noWARN',a:{backend:'Supabase',data_entities:'User, MedicalRecord, Doctor',org_model:'マルチテナント(RLS)'},expect:'none',id:'sec-sensitive-entity-norls'},
  {name:'Express+MedicalRecord=noWARN',a:{backend:'Node.js + Express',data_entities:'User, MedicalRecord, Doctor'},expect:'none',id:'sec-sensitive-entity-norls'},
  {name:'Supabase+HealthLog+noRLS=WARN',a:{backend:'Supabase',data_entities:'User, HealthLog, Workout'},expect:'warn',id:'sec-sensitive-entity-norls'},
  // dom-logistics-nopay (INFO) — logistics without payment
  {name:'fleet+nopay=INFO',a:{purpose:'フリート配送管理システム'},expect:'info',id:'dom-logistics-nopay'},
  {name:'logistics+stripe=noINFO',a:{purpose:'物流管理サービス',payment:'Stripe決済'},expect:'none',id:'dom-logistics-nopay'},
  // dom-health-mobile-noencrypt (INFO) — health + Expo mobile
  {name:'health+expo=INFO',a:{purpose:'健康管理・フィットネスアプリ',mobile:'Expo (React Native)'},expect:'info',id:'dom-health-mobile-noencrypt'},
  {name:'health+noMobile=noINFO',a:{purpose:'健康管理アプリ'},expect:'none',id:'dom-health-mobile-noencrypt'},
  // dom-rpa-nomonitor (INFO) — RPA without monitoring
  {name:'rpa+nomonitor=INFO',a:{purpose:'RPA自動化ボット管理プラットフォーム'},expect:'info',id:'dom-rpa-nomonitor'},
  {name:'rpa+monitor=noINFO',a:{purpose:'RPA自動化ボット管理プラットフォーム',mvp_features:'実行ログ・監視ダッシュボード'},expect:'none',id:'dom-rpa-nomonitor'},
  // be-firebase-stripe-webhook (INFO) — Firebase + payment
  {name:'Firebase+stripe=INFO',a:{backend:'Firebase',payment:'Stripe決済'},expect:'info',id:'be-firebase-stripe-webhook'},
  {name:'Firebase+nopay=noINFO',a:{backend:'Firebase',payment:'none'},expect:'none',id:'be-firebase-stripe-webhook'},
  // mob-expo-websocket (INFO) — Expo + realtime purpose
  {name:'expo+realtime=INFO',a:{mobile:'Expo (React Native)',purpose:'リアルタイムチャット・メッセージングアプリ'},expect:'info',id:'mob-expo-websocket'},
  {name:'expo+norealtimePurpose=noINFO',a:{mobile:'Expo (React Native)',purpose:'タスク管理ツール'},expect:'none',id:'mob-expo-websocket'},
  // be-express-nosecurity-headers (INFO) — Express backend
  {name:'Express+medium=INFO',a:{backend:'Node.js + Express'},expect:'info',id:'be-express-nosecurity-headers'},
  {name:'Express+solo=noINFO',a:{backend:'Node.js + Express',scale:'solo'},expect:'none',id:'be-express-nosecurity-headers'},
  {name:'NestJS=noExpressINFO',a:{backend:'Node.js + NestJS'},expect:'none',id:'be-express-nosecurity-headers'},
  // sec-mobile-biometric (INFO) — Expo + payment
  {name:'expo+pay=biometricINFO',a:{mobile:'Expo (React Native)',payment:'Stripe決済'},expect:'info',id:'sec-mobile-biometric'},
  {name:'expo+nopay=noBiometricINFO',a:{mobile:'Expo (React Native)',payment:'none'},expect:'none',id:'sec-mobile-biometric'},
  // perf-realtime-noredis (INFO) — Node.js + realtime purpose
  {name:'express+realtimePurpose+noRedis=INFO',a:{backend:'Node.js + Express',purpose:'リアルタイムチャットサービス'},expect:'info',id:'perf-realtime-noredis'},
  {name:'express+realtime+redis=noINFO',a:{backend:'Node.js + Express',purpose:'リアルタイムチャットサービス',mvp_features:'Redis Pub/Sub'},expect:'none',id:'perf-realtime-noredis'},
  // perf-mobile-offline (INFO) — Expo + field-service purpose
  {name:'expo+field=offlineINFO',a:{mobile:'Expo (React Native)',purpose:'農業現場作業管理アプリ'},expect:'info',id:'perf-mobile-offline'},
  {name:'expo+field+offline=noINFO',a:{mobile:'Expo (React Native)',purpose:'農業現場オフライン対応作業管理'},expect:'none',id:'perf-mobile-offline'},
  // be-batch-serverless (INFO) — DataPipeline entity + Vercel/Firebase Hosting
  {name:'DataPipeline+Vercel=INFO',a:{data_entities:'DataPipeline, ETLJob, Transform',deploy:'Vercel'},expect:'info',id:'be-batch-serverless'},
  {name:'DataPipeline+Railway=noINFO',a:{data_entities:'DataPipeline, ETLJob, Transform',deploy:'Railway'},expect:'none',id:'be-batch-serverless'},
  // ── Phase D: 15 new rules ──
  // dom-manufacturing-noaudit (WARN) — large-scale manufacturing without AuditLog
  {name:'manufacturing+large+noAudit=WARN',a:{purpose:'製造品質管理システム',data_entities:'User, Product, QCResult, Machine',scale:'large'},expect:'warn',id:'dom-manufacturing-noaudit'},
  {name:'manufacturing+large+withAudit=noWARN',a:{purpose:'製造品質管理システム',data_entities:'User, Product, QCResult, AuditLog',scale:'large'},expect:'none',id:'dom-manufacturing-noaudit'},
  {name:'manufacturing+medium+noAudit=noWARN',a:{purpose:'製造品質管理システム',data_entities:'User, Product, QCResult',scale:'medium'},expect:'none',id:'dom-manufacturing-noaudit'},
  // dom-manufacturing-noiot (INFO) — smart factory without IoT
  {name:'smartFactory+noIoT=INFO',a:{purpose:'スマートファクトリー設備稼働監視システム'},expect:'info',id:'dom-manufacturing-noiot'},
  {name:'smartFactory+withMQTT=noINFO',a:{purpose:'スマートファクトリー設備稼働監視システム',mvp_features:'MQTT連携,センサーデータ収集'},expect:'none',id:'dom-manufacturing-noiot'},
  // dom-medical-noencrypt (ERROR) — EHR without encryption
  {name:'EHR+PatientRecord+noEncrypt=ERROR',a:{purpose:'電子カルテシステム病院向け',data_entities:'User, PatientRecord, Diagnosis, Prescription'},expect:'error',id:'dom-medical-noencrypt'},
  {name:'EHR+PatientRecord+withEncrypt=noERROR',a:{purpose:'電子カルテシステム病院向け',data_entities:'User, PatientRecord, Diagnosis',mvp_features:'データ暗号化(AES-256)'},expect:'none',id:'dom-medical-noencrypt'},
  {name:'EHR+noSensitiveEntity=noERROR',a:{purpose:'電子カルテシステム',data_entities:'User, Staff, Schedule'},expect:'none',id:'dom-medical-noencrypt'},
  // dom-medical-noaudit (WARN) — clinical system without AuditLog
  {name:'clinical+MedRecord+noAudit=WARN',a:{purpose:'クリニック管理システム',data_entities:'User, PatientRecord, Prescription, Diagnosis'},expect:'warn',id:'dom-medical-noaudit'},
  {name:'clinical+MedRecord+withAudit=noWARN',a:{purpose:'クリニック管理システム',data_entities:'User, PatientRecord, Prescription, AuditLog'},expect:'none',id:'dom-medical-noaudit'},
  // dom-education-nolti (INFO) — LMS without LTI/SCORM
  {name:'LMS+noLTI=INFO',a:{purpose:'学習管理システムプラットフォーム'},expect:'info',id:'dom-education-nolti'},
  {name:'LMS+withLTI=noINFO',a:{purpose:'学習管理システムプラットフォーム',mvp_features:'LTI 1.3連携,SCORM対応'},expect:'none',id:'dom-education-nolti'},
  // dom-fintech-no2fa (ERROR) — banking/securities without MFA
  {name:'digitalBanking+noMFA=ERROR',a:{purpose:'デジタル銀行プラットフォームオンライン決済'},expect:'error',id:'dom-fintech-no2fa'},
  {name:'digitalBanking+withMFA=noERROR',a:{purpose:'デジタル銀行プラットフォームオンライン決済',mvp_features:'多要素認証（MFA）'},expect:'none',id:'dom-fintech-no2fa'},
  {name:'investment+noMFA=noERROR',a:{purpose:'投資ポートフォリオ管理'},expect:'none',id:'dom-fintech-no2fa'},
  // ai-medical-legal-noguard (WARN) — AI medical/legal without guardrail
  {name:'medAI+noGuard=WARN',a:{purpose:'医療AI診断支援システム',ai_auto:'AIオーケストレーター'},expect:'warn',id:'ai-medical-legal-noguard'},
  {name:'medAI+withGuard=noWARN',a:{purpose:'医療AI診断支援システム',ai_auto:'AIオーケストレーター',mvp_features:'ガードレール設定,HITL'},expect:'none',id:'ai-medical-legal-noguard'},
  {name:'medAI+noAI=noWARN',a:{purpose:'医療AI診断支援システム',ai_auto:'none'},expect:'none',id:'ai-medical-legal-noguard'},
  // fe-react-legacy-state (INFO) — React + legacy state management
  {name:'React+Redux=INFO',a:{frontend:'React + Next.js',mvp_features:'Redux状態管理'},expect:'info',id:'fe-react-legacy-state'},
  {name:'React+ReduxToolkit=noINFO',a:{frontend:'React + Next.js',mvp_features:'Redux Toolkit'},expect:'none',id:'fe-react-legacy-state'},
  {name:'React+Zustand=noINFO',a:{frontend:'React + Next.js',mvp_features:'Zustand状態管理'},expect:'none',id:'fe-react-legacy-state'},
  // perf-large-entity-noindex (WARN) — many entities without index at large scale
  {name:'12entities+large+noIndex=WARN',a:{data_entities:'User, Team, Project, Task, Comment, Tag, File, Notification, AuditLog, Role, Permission, Session',scale:'large'},expect:'warn',id:'perf-large-entity-noindex'},
  {name:'12entities+large+withIndex=noWARN',a:{data_entities:'User, Team, Project, Task, Comment, Tag, File, Notification, AuditLog, Role, Permission, Session',scale:'large',mvp_features:'複合インデックス設計'},expect:'none',id:'perf-large-entity-noindex'},
  {name:'5entities+large+noIndex=noWARN',a:{data_entities:'User, Team, Project, Task, Comment',scale:'large'},expect:'none',id:'perf-large-entity-noindex'},
  // sec-sensitive-nobackup (WARN) — sensitive entities without backup at large scale
  {name:'MedicalRecord+large+noBackup=WARN',a:{data_entities:'User, MedicalRecord, Doctor, Prescription',scale:'large'},expect:'warn',id:'sec-sensitive-nobackup'},
  {name:'MedicalRecord+large+withBackup=noWARN',a:{data_entities:'User, MedicalRecord, Doctor',scale:'large',mvp_features:'バックアップ・DR計画'},expect:'none',id:'sec-sensitive-nobackup'},
  {name:'MedicalRecord+medium+noBackup=noWARN',a:{data_entities:'User, MedicalRecord, Doctor',scale:'medium'},expect:'none',id:'sec-sensitive-nobackup'},
  // cl-monorepo-notools (INFO) — monorepo without management tools
  {name:'monorepo+noTools=INFO',a:{dev_methods:'モノレポ構成'},expect:'info',id:'cl-monorepo-notools'},
  {name:'monorepo+Turborepo=noINFO',a:{dev_methods:'モノレポ構成',mvp_features:'Turborepo,pnpm workspace'},expect:'none',id:'cl-monorepo-notools'},
  // cl-baas-customlogic (INFO) — Firebase with 10+ entities
  {name:'Firebase+10entities=INFO',a:{backend:'Firebase',data_entities:'User, Team, Project, Task, Comment, Tag, File, Notification, AuditLog, Role'},expect:'info',id:'cl-baas-customlogic'},
  {name:'Firebase+5entities=noINFO',a:{backend:'Firebase',data_entities:'User, Team, Project, Task, Comment'},expect:'none',id:'cl-baas-customlogic'},
  // cl-ai-nomonitoring (WARN) — high AI autonomy without monitoring
  {name:'fullAuto+noMonitor=WARN',a:{ai_auto:'フル自律開発'},expect:'warn',id:'cl-ai-nomonitoring'},
  {name:'orchestrator+withMonitor=noWARN',a:{ai_auto:'AIオーケストレーター',mvp_features:'Langfuse AI監視'},expect:'none',id:'cl-ai-nomonitoring'},
  {name:'copilot+noMonitor=noWARN',a:{ai_auto:'コーディングアシスタント（Copilot等）'},expect:'none',id:'cl-ai-nomonitoring'},
  // cl-api-noversioning (INFO) — large Node.js/Python API without versioning
  {name:'Express+large+noVersion=INFO',a:{backend:'Node.js + Express',scale:'large'},expect:'info',id:'cl-api-noversioning'},
  {name:'Express+large+withVersion=noINFO',a:{backend:'Node.js + Express',scale:'large',mvp_features:'/v1/ APIバージョニング'},expect:'none',id:'cl-api-noversioning'},
  {name:'Express+medium+noVersion=noINFO',a:{backend:'Node.js + Express',scale:'medium'},expect:'none',id:'cl-api-noversioning'},
  // cl-payment-nowebhook (WARN) — large Node.js + payment without webhook
  {name:'Express+pay+large+noWebhook=WARN',a:{payment:'Stripe決済',backend:'Node.js + Express',scale:'large'},expect:'warn',id:'cl-payment-nowebhook'},
  {name:'Express+pay+large+withWebhook=noWARN',a:{payment:'Stripe決済',backend:'Node.js + Express',scale:'large',mvp_features:'Stripe Webhook署名検証'},expect:'none',id:'cl-payment-nowebhook'},
  {name:'Express+pay+medium+noWebhook=noWARN',a:{payment:'Stripe決済',backend:'Node.js + Express',scale:'medium'},expect:'none',id:'cl-payment-nowebhook'},
];

let pass=0,fail=0;
tests.forEach(t=>{
  const res=checkCompat(t.a);
  let ok;
  if(t.id){
    // Check for specific rule by ID
    const match=res.find(r=>r.id===t.id);
    if(t.expect==='none') ok=!match;
    else ok=match&&match.level===t.expect;
  } else {
    const got=res.length===0?'none':res[0].level;
    ok=got===t.expect;
  }
  const got=t.id?(res.find(r=>r.id===t.id)||{level:'none'}).level:(res.length===0?'none':res[0].level);
  console.log((ok?'✅':'❌')+' '+t.name+' → '+got+(ok?'':' (expected '+t.expect+')'));
  ok?pass++:fail++;
});
console.log('---');
console.log(pass+'/'+tests.length+' passed, '+fail+' failed');

// ── calcSynergy Unit Tests ──
console.log('\n━━ calcSynergy Tests ━━');
const synergyTests = [
  {
    name: 'Null/undefined input returns default',
    input: null,
    expect: { overall: 60, d1: 60, d2: 60, d3: 60, d4: 60, d5: 60 }
  },
  {
    name: 'High synergy: Next.js + Supabase + Vercel + education',
    input: {
      frontend: 'React + Next.js',
      backend: 'Supabase',
      database: 'Supabase (PostgreSQL)',
      deploy: 'Vercel',
      purpose: '教育・学習支援プラットフォーム',
      skill_level: 'Professional'
    },
    expectMin: { overall: 85, d1: 85, d2: 85, d3: 80, d4: 85 }
  },
  {
    name: 'Low synergy: Angular + Express + Firebase Hosting',
    input: {
      frontend: 'Angular',
      backend: 'Node.js + Express',
      deploy: 'Firebase Hosting',
      skill_level: 'Professional'
    },
    expectMax: { overall: 75, d1: 75 }
  },
  {
    name: 'Domain bonus: fintech + PostgreSQL + Stripe',
    input: {
      frontend: 'React + Next.js',
      backend: 'Node.js + Express',
      purpose: '金融取引プラットフォーム',
      database: 'PostgreSQL',
      payment: 'Stripe決済',
      skill_level: 'Professional'
    },
    expectMin: { overall: 68, d5: 90 }  // Pro skill level guarantees d5=90
  },
  {
    name: 'BaaS ecosystem unity: Supabase full stack',
    input: {
      frontend: 'React + Next.js',
      backend: 'Supabase',
      database: 'Supabase (PostgreSQL)',
      auth: 'Supabase Auth',
      skill_level: 'Professional'
    },
    expectMin: { overall: 73, d1: 85, d5: 90 }  // High FE-BE affinity + Pro skill level
  },
  {
    name: 'Beginner + complex stack lowers d5',
    input: {
      frontend: 'React + Next.js',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      orm: 'Prisma',
      skill_level: 'Beginner'
    },
    expectMax: { d5: 70 }
  },
  {
    name: 'Pro always gets d5=90',
    input: {
      frontend: 'Vue 3 + Nuxt',
      backend: 'Python + Django',
      skill_level: 'Professional'
    },
    expectMin: { d5: 90 },
    expectMax: { d5: 90 }
  }
];

let synergyPass = 0, synergyFail = 0;
synergyTests.forEach(t => {
  const result = calcSynergy(t.input);
  let ok = true;
  let reason = '';

  if (t.expect) {
    // Exact match test
    Object.keys(t.expect).forEach(k => {
      if (result[k] !== t.expect[k]) {
        ok = false;
        reason = `${k}: got ${result[k]}, expected ${t.expect[k]}`;
      }
    });
  } else {
    // Min/max range test
    if (t.expectMin) {
      Object.keys(t.expectMin).forEach(k => {
        if (result[k] < t.expectMin[k]) {
          ok = false;
          reason = `${k}: got ${result[k]}, expected >= ${t.expectMin[k]}`;
        }
      });
    }
    if (t.expectMax) {
      Object.keys(t.expectMax).forEach(k => {
        if (result[k] > t.expectMax[k]) {
          ok = false;
          reason = `${k}: got ${result[k]}, expected <= ${t.expectMax[k]}`;
        }
      });
    }
  }

  console.log((ok ? '✅' : '❌') + ' ' + t.name + (ok ? '' : ` (${reason})`));
  ok ? synergyPass++ : synergyFail++;
});
console.log('---');
console.log(synergyPass + '/' + synergyTests.length + ' calcSynergy tests passed');
assert.strictEqual(fail, 0, `compat: ${fail} compat rule checks failed (see ❌ above)`);
assert.strictEqual(synergyFail, 0, `compat: ${synergyFail} synergy checks failed (see ❌ above)`);
