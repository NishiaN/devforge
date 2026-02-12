/* ── Pillar ④ AI Agent Rules (Phase B: Context-Aware, 11 files) ── */
function genPillar4_AIRules(a,pn){
  const G=S.genLang==='ja';
  const db=a.database||'PostgreSQL';
  const be=a.backend||'Node.js + Express';
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const orm=arch.isBaaS?(be.includes('Supabase')?'Supabase Client SDK':be.includes('Firebase')?'Firebase SDK':'Convex Client'):(a.orm&&a.orm.includes('Drizzle')?'Drizzle ORM':'Prisma ORM');
  const archNote=G?{baas:'BaaS統合パターン（サーバーレス）',bff:'BFF パターン（Next.js API Routes統合）',split:'フロント/バック分離（別ホスト）',traditional:'従来型クライアント-サーバー'}[arch.pattern]:{baas:'BaaS Integration (serverless)',bff:'BFF Pattern (Next.js API Routes)',split:'FE/BE Split (separate hosts)',traditional:'Traditional Client-Server'}[arch.pattern];

  const core=`Project: ${pn}
Stack: ${a.frontend||'React'} + ${be} + ${db}
Architecture: ${archNote}
Auth SoT: ${auth.sot}
Methods: ${a.dev_methods||'TDD'}
Entities: ${a.data_entities||'users'}
Purpose: ${a.purpose||'N/A'}`;

  const coreRules=`1. Always use TypeScript with strict mode
2. Follow ${(a.dev_methods||'TDD').split(', ')[0]} methodology
3. Write tests before implementation
4. Use ${a.frontend||'React'} conventions
5. Database: ${db} with ${orm}
6. Auth: ${auth.sot} — token type: ${auth.tokenType}
7. Architecture: ${archNote}
8. Follow project structure in .spec/technical-plan.md`;

  const forbidden=arch.isBaaS?
    `- No raw SQL in application code (use ${orm} methods)
  - OK: DDL/RLS/migration SQL in supabase/migrations/
- No separate Express/Fastify server (use ${be} functions)
- No manual JWT handling (use ${auth.sot})`:
    arch.pattern==='bff'?
    `- No separate Express server (use Next.js API Routes)
- No \`any\` types
- No console.log in production
- No hardcoded secrets`:
    `- No \`any\` types
- No console.log in production
- No hardcoded secrets
- No raw SQL in application code (use ${orm})
  - OK: DDL/migration SQL in migration files`;

  // Cursor-specific rules
  const cursorRules=`You are an AI assistant for "${pn}".
${core}

## Rules
${coreRules}

## Cursor-Specific
- Use @workspace to reference project context
- Use @file to reference spec files (.spec/, docs/)
- Leverage multi-file editing for related changes
- Before editing, read relevant specs with @file`;

  // Cline-specific rules
  const clineRules=`You are an AI assistant for "${pn}".
${core}

## Rules
${coreRules}

## Cline-Specific
- Follow Plan→Act loop for each task
- After task completion: run npm test
- Update docs/24_progress.md after completing tasks
- Log errors to docs/25_error_logs.md`;

  // Windsurf-specific rules
  const windsurfRules=`You are an AI assistant for "${pn}".
${core}

## Rules
${coreRules}

## Windsurf-Specific
- Leverage Cascade for context-aware coding
- Create Flows for repetitive tasks
- Keep context focused: AI_BRIEF.md + current task only
- Use Flows to automate test generation`;

  // Copilot (generic rules only)
  const copilotRules=`You are an AI assistant for "${pn}".
${core}

## Rules
${coreRules}`;

  S.files['.cursor/rules']=cursorRules;
  S.files['.github/copilot-instructions.md']=`# GitHub Copilot Instructions\n${copilotRules}`;
  S.files['.windsurfrules']=windsurfRules;
  S.files['.clinerules']=clineRules;
  S.files['.kiro/spec.md']=`# Kiro Spec\n${core}\n\n## Spec Files\nSee .spec/ directory for full specifications.`;
  // Generate domain context rotation table
  const domain=detectDomain(a.purpose)||'_default';
  const pb=DOMAIN_PLAYBOOK[domain]||DOMAIN_PLAYBOOK._default;
  let domainCtx='';
  if(pb&&pb.ctx_ja&&pb.ctx_ja.length>0&&pb.ctx_ja[0]!==''){
    domainCtx='\n\n## Domain Context Rotation\n| '+(G?'タスク種別':'Task Type')+' | '+(G?'参照ドキュメント':'Reference Docs')+' |\n|------|------|\n';
    const ctx=G?pb.ctx_ja:pb.ctx_en;
    ctx.forEach(c=>{
      const[task,docs]=c.split('→');
      domainCtx+='| '+task+' | '+docs+' |\n';
    });
  }

  S.files['CLAUDE.md']=`# CLAUDE.md — ${pn}\n${core}\n\n## Spec-Driven Development\nRead .spec/constitution.md first.\nAll changes must align with .spec/specification.md.\nUse .spec/tasks.md as the source of truth for work items.\n\n## Auth\n- Source of Truth: ${auth.sot}\n- Token: ${auth.tokenType}\n- Verification: ${auth.tokenVerify}\n${auth.social.length?'- Providers: '+auth.social.join(', '):''}\n\n## Code Style\n- TypeScript strict\n- ESLint + Prettier\n- Vitest for testing\n- ${orm} for ${db}\n\n## Forbidden\n${forbidden}\n\n## Workflow Cycle\n1. Read docs/ → Select needed context\n2. Plan → Outline approach before coding\n3. Implement → Code with tests\n4. Update docs/24_progress.md → Mark completed tasks\n5. Log errors to docs/25_error_logs.md → Prevent recurrence\n\n## Thinking Protocol\nBefore implementing any change:\n1. State the task in one sentence\n2. List files that will be modified\n3. Identify potential side effects\n4. Implement → Test → Verify\n\n## Context Management\n- Write: All specs live in docs/ — read before coding\n- Select: Only load files relevant to current task\n- Compress: If context is large, read AI_BRIEF.md (~3K tokens) instead\n- Isolate: Use subagents for research, keep main context clean${domainCtx}\n\n## Key Context Files\n| File | When to Read | Tokens |\n|------|-------------|--------|\n| AI_BRIEF.md | Always (start here) | ~3K |\n| .spec/constitution.md | Before any change | ~1K |\n| .spec/tasks.md | Before picking work | ~1K |\n| docs/24_progress.md | Before/after tasks | ~0.5K |\n| docs/25_error_logs.md | When debugging | ~0.5K |`;
  S.files['AGENTS.md']=`# AGENTS.md — ${pn}\n\n## Agent Guidelines\n${core}\n\n## Task Assignment\n- Frontend agent: UI components, pages, styling\n- Backend agent: ${arch.isBaaS?a.backend+' functions, RLS policies':arch.pattern==='bff'?'Next.js API Routes, middleware':'API routes, database, auth'}\n- Test agent: Unit tests, E2E tests\n- DevOps agent: CI/CD, deployment\n\n## Coordination\n- All agents must read .spec/ before starting\n- Use tasks.md for work coordination\n- Commit with conventional commits`;
  S.files['codex-instructions.md']=`# Codex Instructions (OpenAI)\n${copilotRules}\n\n## Codex Agent Mode\n- Use agentic mode for multi-file refactoring\n- Verify changes with npm test before committing\n- Respect .spec/ constraints`;
  S.files['skills/project.md']=`# ${pn} ${G?'— AIスキル':'— AI Skills'}\n${G?'工場テンプレート形式。詳細はskills/catalog.md参照':'Factory Template format. See skills/catalog.md for details'}\n\n${G?'## スキル':'## Skills'}\n\n### 1. spec-review\n- **${G?'役割':'Role'}**: ${G?'設計':'Design'}\n- **${G?'目的':'Purpose'}**: ${G?'.spec/検証':'Verify .spec/'}\n- **${G?'入力':'Input'}**: .spec/constitution.md, specification.md\n- **${G?'判断':'Judgment'}**: ${G?'矛盾0件':' 0 contradictions'}\n- **${G?'次':'Next'}**: code-gen\n\n### 2. code-gen\n- **${G?'役割':'Role'}**: ${G?'制作':'Production'}\n- **${G?'目的':'Purpose'}**: ${G?'コード生成':'Generate code'}\n- **${G?'入力':'Input'}**: .spec/technical-plan.md\n- **${G?'判断':'Judgment'}**: ${G?'エラー0':'0 errors'}\n- **${G?'次':'Next'}**: test-gen\n\n### 3. test-gen\n- **${G?'役割':'Role'}**: ${G?'制作':'Production'}\n- **${G?'目的':'Purpose'}**: ${G?'テスト生成':'Generate tests'}\n- **${G?'入力':'Input'}**: ${G?'新規コード':'New code'}\n- **${G?'判断':'Judgment'}**: ${G?'カバレッジ80%+':'Coverage ≥80%'}\n- **${G?'次':'Next'}**: deploy-check\n\n### 4. doc-gen\n- **${G?'役割':'Role'}**: ${G?'運用':'Operations'}\n- **${G?'目的':'Purpose'}**: ${G?'ドキュメント生成':'Generate docs'}\n- **${G?'判断':'Judgment'}**: ${G?'未文書化0':'0 undocumented'}\n- **${G?'次':'Next'}**: refactor\n\n### 5. refactor\n- **${G?'役割':'Role'}**: ${G?'設計':'Design'}\n- **${G?'目的':'Purpose'}**: ${G?'リファクタリング提案':'Suggest refactoring'}\n- **${G?'判断':'Judgment'}**: ${G?'重複10%↓':'Duplication ≤10%'}\n- **${G?'次':'Next'}**: spec-review\n\n${G?'## テンプレート':'## Template'}\n\`\`\`markdown\n### [skill-id]\n- **${G?'役割':'Role'}**: [Planning/Design/Production/Operations]\n- **${G?'目的':'Purpose'}**: [${G?'何をするか':'What it does'}]\n- **${G?'判断':'Judgment'}**: [${G?'成功条件':'Success criteria'}]\n- **${G?'次':'Next'}**: [${G?'次のスキル':'Next skill'}]\n\`\`\`\n`;
  S.files['.gemini/settings.json']=`{\n  "project": "${pn}",\n  "model": "gemini-3-pro",\n  "context": {\n    "spec_dir": ".spec/",\n    "include": ["src/", "package.json", "tsconfig.json"],\n    "exclude": ["node_modules/", "dist/"]\n  },\n  "safety": "balanced",\n  "tools": ["code_execution", "grounding"]\n}`;
  S.files['.ai/hooks.yml']=`# AI Hooks Configuration
hooks:
  pre-commit:
    - name: lint-check
      command: npm run lint
    - name: type-check
      command: npx tsc --noEmit
  pre-push:
    - name: test
      command: npm test
  post-generate:
    - name: format
      command: npx prettier --write .
`;

  // ═══ AI_BRIEF.md — Condensed Single-File Spec for AI Agents ═══
  // Goal: ~3000 tokens containing everything an AI needs to start coding
  const entities=(a.data_entities||'User').split(/[,、]\s*/).map(e=>e.trim()).filter(Boolean);
  const features=(a.mvp_features||'CRUD').split(', ').filter(Boolean);
  const screens=(a.screens||'Dashboard').split(', ').filter(Boolean);
  const fe=a.frontend||'React';
  const deploy=a.deploy||'Vercel';

  // Build compact DB schema
  const dbSchema=entities.map(en=>{
    const cols=getEntityColumns(en,G,entities);
    const colList=cols.map(c=>{
      const fk=c.constraint.includes('FK')?` → ${c.constraint.match(/FK\((\w+)\)/)?.[1]||'?'}`:'';
      const req=c.constraint.includes('NOT NULL')?'!':'';
      return `${c.col}${req}:${c.type.replace('VARCHAR(255)','str').replace('VARCHAR(100)','str').replace('VARCHAR(50)','str').replace('VARCHAR(20)','enum').replace('DECIMAL(10,2)','decimal').replace('BOOLEAN','bool').replace('TIMESTAMP','ts').replace('BIGINT','bigint').replace('JSONB','json').replace('UUID','uuid').replace('TEXT','text').replace('DATE','date').replace('TIME','time').replace('INT','int')}${fk}`;
    }).join(', ');
    return `  ${en}: id:uuid(PK)${colList?', '+colList:''}, created_at:ts, updated_at:ts`;
  }).join('\n');

  // Build compact ER relationships
  const erData=inferER(a);
  const erCompact=erData.relationships.map(r=>r.replace(/\s+/g,' ')).join('; ');

  // Build compact features with acceptance criteria
  const featureCompact=features.map(f=>{
    const fd=getFeatureDetail(f);
    if(fd){
      const criteria=(G?fd.criteria_ja:fd.criteria_en).map(c=>c.replace(/\{auth\}/g,a.auth||'OAuth'));
      return `  ${f}: ${criteria.slice(0,4).join(' / ')}`;
    }
    return `  ${f}`;
  }).join('\n');

  // Build compact routes
  const routes=genRoutes(a);
  const routeCompact=routes.map(r=>`${r.auth?'🔒':'🌐'} ${r.path} → ${r.name}`).join(', ');

  // Per-table RLS (compact)
  let rlsCompact='';
  if(arch.isBaaS&&be.includes('Supabase')){
    rlsCompact=entities.map(en=>{
      const cols=getEntityColumns(en,G,entities);
      const ownerCol=en.toLowerCase()==='user'?'id':cols.find(c=>c.col==='user_id'||c.col==='owner_id'||c.col==='instructor_id'||c.col==='provider_id')?.col;
      if(!ownerCol) return `  ${pluralize(en)}: authenticated=SELECT`;
      return `  ${pluralize(en)}: auth.uid()=${ownerCol} → SELECT/INSERT/UPDATE/DELETE`;
    }).join('\n');
  }

  // Stripe section (compact)
  let stripeCompact='';
  if(a.payment&&(a.payment||'').includes('Stripe')){
    stripeCompact=`
## Payment (Stripe)
Plans: Free(¥0) / Pro(¥980/mo) / Enterprise(¥9,800/mo)
Webhook: POST /api/webhook/stripe
  invoice.paid → subscription.status=active
  customer.subscription.deleted → status=canceled
Tables: subscriptions(user_id, stripe_subscription_id, stripe_customer_id, status, plan, current_period_end)
Keys: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`;
  }

  // RBAC section (compact)
  let rbacCompact='';
  const hasAdminBrief=/管理者|admin/i.test(a.target||'');
  if(hasAdminBrief){
    rbacCompact=`
## RBAC
Roles: user(own data) / admin(all data, user mgmt)${/講師|instructor/i.test(a.target||'')?` / instructor(own content+students)`:''}
Column: profiles.role
Admin routes: /admin/ → role=admin check`;
  }

  S.files['AI_BRIEF.md']=`# ${pn} — AI Implementation Brief
> ${G?'このファイル1つで開発開始可能。':'Start coding with this single file.'} ~3K tokens.

## Stack
${fe} + ${be} + ${a.database||'PostgreSQL'} → ${deploy}
Auth: ${auth.sot} (${auth.tokenType})
ORM: ${orm}
Pattern: ${archNote}

## Context Protocol
1. Start: Read THIS file (AI_BRIEF.md)
2. Deep dive: .spec/{constitution,specification}.md
3. Current state: docs/24_progress.md
4. Before coding: Relevant docs/ file
5. After task: Update docs/24_progress.md
6. On error: Log to docs/25_error_logs.md
7. Context full: Keep AI_BRIEF.md + current task only

## DB Schema
\`\`\`
${dbSchema}
\`\`\`

## Relationships
${erCompact}
${rlsCompact?'\n## RLS Policies\n'+rlsCompact:''}

## Features (MVP)
${featureCompact}

## Routes
${routeCompact}
${stripeCompact}${rbacCompact}

## Dev Rules
- TypeScript strict, Vitest, Playwright
- ${(a.dev_methods||'TDD').split(', ')[0]} methodology
- ${orm} for DB access
- ${auth.sot} for all auth
- Forbidden: ${arch.isBaaS?'raw SQL, Express server, manual JWT':'any types, console.log in prod, hardcoded secrets'}

## File Structure
.spec/           → ${G?'仕様書':'Specifications'} (constitution, specification, technical-plan, tasks, verification)
docs/            → ${G?'設計ドキュメント':'Design documents'} (ER, API, screen, test cases, security, etc.)
.devcontainer/   → ${G?'開発環境':'Dev environment'}
CLAUDE.md        → ${G?'Claude Code用ルール':'Claude Code rules'}
.cursor/rules    → ${G?'Cursor用ルール':'Cursor rules'}

## Quick Start
1. \`npm install\` → setup dependencies
2. Read this file → understand full spec
3. Create DB schema (see DB Schema above)
4. Implement features top-to-bottom (see Features)
5. Run \`npm test\` after each feature
`;

  // ═══ Phase 2 & 3: Skills Catalog + Pipelines (only if ai_auto ≠ None) ═══
  const aiAuto=a.ai_auto||'';
  if(aiAuto&&!isNone(aiAuto)){
    // Detect domain for domain-specific skills
    const domain=detectDomain(a.purpose);

    // Compressed: role:name_ja:name_en:purpose_ja:purpose_en:judgment_ja:judgment_en
    const coreSkills=['0:要件レビュー:Req Review:要件検証:Verify reqs:欠落0:0 gaps','1:設計検証:Arch Review:技術評価:Eval tech:P0リスク0:0 P0 risks','2:実装支援:Code Support:実装支援:Impl support:エラー0:0 errors','3:デプロイ検証:Deploy Check:デプロイ前チェック:Pre-deploy check:全PASS:All PASS'];

    const domainSkillsMap={
      education:['1:教材設計:Curriculum:教材設計:Design curriculum:説明可能:Explainable','2:問題生成:Quiz Gen:問題生成:Gen quiz:各3問:3 each'],
      ec:['1:商品検証:Catalog:商品検証:Verify catalog:必須100%:Req 100%','1:決済検証:Checkout:決済検証:Verify checkout:OWASP準拠:OWASP OK'],
      saas:['0:機能仕様:Feature Spec:機能仕様:Feature spec:AC3+:≥3 AC','1:API設計:API Design:API設計:API design:違反0:0 violations'],
      community:['1:モデレーション:Moderation:モデレーション:Moderation:違反1%↓:≤1% violations','3:分析:Analytics:行動分析:Behavior analysis:可視化:Visualized'],
      booking:['0:予約設計:Booking Logic:予約設計:Booking logic:重複0:0 duplicates','2:リマインダー:Reminder:通知最適化:Optimize notify:到達95%+:≥95% delivery'],
      health:['1:記録検証:Health Log:健康記録検証:Verify health logs:異常値0:0 anomalies','2:目標設定:Goal Setting:目標達成率計算:Calc goal achievement:達成率可視化:Visualized rate'],
      marketplace:['0:取引設計:Trade Design:取引フロー設計:Design trade flow:安全性確保:Safety ensured','1:レビュー検証:Review Check:レビュー信頼性検証:Verify review trust:偽装0:0 fake'],
      content:['2:配信最適化:Delivery Opt:コンテンツ配信最適化:Optimize content delivery:遅延100ms↓:≤100ms delay','3:分析:Analytics:閲覧分析:View analytics:エンゲージ可視化:Engagement vis'],
      analytics:['1:ダッシュボード設計:Dashboard:ダッシュボード設計:Design dashboard:KPI明確:Clear KPI','2:レポート生成:Report Gen:レポート自動生成:Auto-gen reports:正確性100%:100% accuracy'],
      business:['0:CRM設計:CRM Design:顧客管理設計:Design CRM:リード漏れ0:0 lead loss','1:営業フロー:Sales Flow:営業プロセス最適化:Optimize sales process:CVR向上:Improve CVR'],
      iot:['1:デバイス管理:Device Mgmt:デバイス管理:Device management:全台接続:All connected','2:センサー分析:Sensor Analysis:センサーデータ分析:Analyze sensor data:異常検知:Anomaly detected','3:アラート設計:Alert Design:アラート設計:Design alerts:誤報1%↓:≤1% false alarm'],
      realestate:['0:物件管理:Property Mgmt:物件データ管理:Manage property data:登録100%:100% listed','1:内見予約:Viewing:内見予約管理:Manage viewings:重複0:0 overlaps','2:契約検証:Contract:契約書検証:Verify contracts:必須項目100%:100% required'],
      legal:['0:契約レビュー:Contract Review:契約書レビュー:Review contracts:リスク条項0:0 risk clauses','1:コンプライアンス:Compliance:法令準拠チェック:Compliance check:違反0:0 violations','3:文書管理:Doc Mgmt:文書バージョン管理:Doc version control:最新版追跡:Latest tracked'],
      hr:['0:採用フロー:Hiring Flow:採用プロセス設計:Design hiring flow:漏れ0:0 gaps','1:評価設計:Eval Design:評価制度設計:Design evaluation:基準明確:Clear criteria','3:オンボーディング:Onboarding:入社手続き管理:Manage onboarding:完了率100%:100% completion'],
      fintech:['1:取引検証:Tx Validation:取引データ検証:Validate transactions:不正0:0 fraud','1:リスク分析:Risk Analysis:リスク評価:Risk assessment:P0対応済:P0 addressed','3:レポート生成:Report Gen:財務レポート:Financial reports:正確性100%:100% accuracy'],
      ai:['0:プロンプト設計:Prompt Design:プロンプト最適化:Optimize prompts:精度90%+:≥90% accuracy','1:RAG構築:RAG Setup:コンテキスト管理:Manage context:関連性95%+:≥95% relevance','2:モデル評価:Model Eval:応答品質評価:Eval response quality:幻覚1%↓:≤1% hallucination'],
      automation:['0:ワークフロー設計:Workflow Design:自動化フロー設計:Design automation flow:漏れ0:0 gaps','1:条件分岐:Branching:条件分岐ロジック:Branching logic:網羅100%:100% coverage','2:エラーハンドリング:Error Handling:リトライ・フォールバック:Retry & fallback:復旧率98%+:≥98% recovery'],
      event:['0:チケット設計:Ticket Design:チケット販売設計:Design ticket sales:在庫管理100%:100% inventory','1:参加者管理:Attendee Mgmt:参加者管理:Manage attendees:重複0:0 duplicates','2:通知最適化:Notify Opt:イベント通知最適化:Optimize event notifications:到達95%+:≥95% delivery'],
      gamify:['0:ポイント設計:Point Design:ポイントシステム設計:Design point system:整合性100%:100% consistency','1:バッジ条件:Badge Logic:バッジ獲得条件:Badge unlock logic:漏れ0:0 gaps','2:ランキング:Leaderboard:ランキング計算:Calc leaderboard:精度100%:100% accuracy'],
      collab:['0:同期設計:Sync Design:リアルタイム同期設計:Design realtime sync:遅延200ms↓:≤200ms latency','1:競合解決:Conflict Resolve:競合解決アルゴリズム:Conflict resolution:損失0:0 data loss','2:バージョン管理:Versioning:変更履歴管理:Manage change history:追跡100%:100% tracked'],
      devtool:['0:API設計:API Design:開発者API設計:Design developer API:DX評価4.5+:≥4.5 DX','1:SDK構築:SDK Build:SDK・サンプル構築:Build SDK & samples:カバレッジ80%+:≥80% coverage','2:ドキュメント:Docs:ドキュメント生成:Generate docs:網羅性95%+:≥95% completeness'],
      creator:['0:収益化設計:Monetization:収益化戦略設計:Design monetization:収益源3+:≥3 revenue streams','1:ファン管理:Fan Mgmt:ファンコミュニティ管理:Manage fan community:エンゲージ8%+:≥8% engagement','2:分析:Analytics:クリエイター分析:Creator analytics:インサイト可視化:Insights vis'],
      newsletter:['0:コンテンツ戦略:Content Strategy:配信コンテンツ戦略:Delivery content strategy:開封率25%+:≥25% open rate','1:セグメント設計:Segment Design:セグメント配信設計:Design segment delivery:精度95%+:≥95% accuracy','2:A/Bテスト:A/B Test:A/Bテスト設計:Design A/B test:統計的有意性:Statistical significance']
    };

    const domainSkills=domainSkillsMap[domain]||[];
    const allSkills=[...coreSkills,...domainSkills];

    const roleNames=G?['企画 (Planning)','設計 (Design)','制作 (Production)','運用 (Operations)']:['Planning','Design','Production','Operations'];

    // Enhanced skill details (19 skills: 14 core + 5 domain-specific)
    const skillDetails={
      '教材設計':{input:'docs/03,04',process:G?'ER図→学習フロー抽出→難易度分類→構成生成':'ER→flow→difficulty→curriculum',output:G?'構成マップ(md)':'Curriculum (md)'},
      '機能仕様':{input:'.spec/constitution',process:G?'使命→ストーリー抽出→受入条件3つ→優先度付与':'Mission→stories→3 AC→priority',output:G?'仕様書(md)':'Spec (md)'},
      'API設計':{input:'docs/04,05',process:G?'ER→エンドポイント生成→REST命名チェック→標準化':'ER→endpoints→REST check→standardize',output:G?'API仕様(OpenAPI)':'API spec (OpenAPI)'},
      '決済検証':{input:'docs/08',process:G?'OWASP照合→Webhook検証→RLSチェック':'OWASP→webhook→RLS',output:G?'チェックリスト':'Checklist'},
      '要件レビュー':{input:'.spec/constitution,specification',process:G?'使命→KPI照合→機能網羅チェック→欠落列挙':'Mission→KPI check→feature coverage→list gaps',output:G?'矛盾リスト+修正案':'Gap list + fix proposal'},
      '設計検証':{input:'.spec/technical-plan',process:G?'スタック評価→依存関係チェック→リスク分析→代替案':'Stack eval→deps check→risk→alternatives',output:G?'リスク評価表':'Risk assessment'},
      '実装支援':{input:'.spec/specification,technical-plan',process:G?'仕様読込→型定義→CRUD実装→テスト生成':'Read spec→types→CRUD impl→gen tests',output:G?'実装コード+テスト':'Code + tests'},
      'デプロイ検証':{input:'docs/09,ci.yml',process:G?'環境変数チェック→ビルド検証→ヘルスチェック→ロールバック確認':'Env check→build verify→health→rollback',output:G?'デプロイレポート':'Deploy report'},
      '問題生成':{input:'docs/03,Lesson',process:G?'学習目標抽出→難易度設定→正常系3問+異常系3問→解説生成':'Goals→difficulty→3 normal+3 edge→explanations',output:G?'問題セット(JSON)':'Quiz set (JSON)'},
      '商品検証':{input:'Product,Category',process:G?'必須フィールド検査→SKU重複チェック→価格妥当性→画像存在確認':'Required fields→SKU dup→price valid→image check',output:G?'検証レポート':'Validation report'},
      'モデレーション':{input:'Post,Comment',process:G?'禁止語チェック→スパム判定→報告集計→対応優先度付与':'Banned words→spam detect→report aggregate→priority',output:G?'モデレーションキュー':'Moderation queue'},
      '予約設計':{input:'Service,TimeSlot',process:G?'空き枠計算→重複検出→バッファ設定→通知設計':'Availability calc→dup detect→buffer→notify design',output:G?'予約ロジック仕様':'Booking logic spec'},
      '記録検証':{input:'HealthLog,Goal',process:G?'入力値範囲チェック→異常値検出→トレンド分析→アラート条件設定':'Range check→anomaly detect→trend→alert config',output:G?'健康レポート':'Health report'},
      'CRM設計':{input:'User,Contact',process:G?'リード定義→ファネル設計→スコアリング→自動化ルール':'Lead def→funnel→scoring→automation rules',output:G?'CRM設計書':'CRM design doc'},
      'デバイス管理':{input:'Device,Sensor',process:G?'デバイス登録→接続状態監視→ファーム更新管理→ログ収集':'Register→monitor→firmware→logs',output:G?'デバイス管理画面':'Device dashboard'},
      '物件管理':{input:'Property,Category',process:G?'物件登録→写真管理→間取り設定→公開管理':'Register→photos→floor plan→publish',output:G?'物件データベース':'Property DB'},
      '契約レビュー':{input:'Contract,Template',process:G?'テンプレート照合→リスク条項検出→期限チェック→承認フロー':'Template match→risk detect→deadline→approval',output:G?'レビュー結果':'Review result'},
      '採用フロー':{input:'JobPosting,Applicant',process:G?'求人作成→応募管理→面接調整→評価集約→内定':'Post→apply→interview→eval→offer',output:G?'採用パイプライン':'Hiring pipeline'},
      '取引検証':{input:'Transaction,Account',process:G?'残高確認→二重支払チェック→限度額検証→監査ログ':'Balance→dup check→limit→audit log',output:G?'検証レポート':'Validation report'}
    };

    let catalogMd=`# ${pn} ${G?'— AIスキルカタログ':'— AI Skills Catalog'}\n${G?'ドメイン特化スキル + コア開発スキル':'Domain-specific skills + core development skills'}\n\n`;

    roleNames.forEach((role,idx)=>{
      const roleSkills=allSkills.filter(s=>parseInt(s.split(':')[0])===idx);
      if(roleSkills.length===0)return;
      catalogMd+=`## ${role}\n\n`;
      roleSkills.forEach(s=>{
        const[,nameJa,nameEn,purposeJa,purposeEn,judgmentJa,judgmentEn]=s.split(':');
        const name=G?nameJa:nameEn;
        const purpose=G?purposeJa:purposeEn;
        const judgment=G?judgmentJa:judgmentEn;
        const detail=skillDetails[nameJa]||skillDetails[nameEn];
        catalogMd+=`### ${name}\n- **${G?'目的':'Purpose'}**: ${purpose}\n- **${G?'判断基準':'Judgment'}**: ${judgment}\n`;
        if(detail){
          catalogMd+=`- **${G?'入力':'Input'}**: ${detail.input}\n- **${G?'処理':'Process'}**: ${detail.process}\n- **${G?'出力':'Output'}**: ${detail.output}\n`;
        }else{
          catalogMd+=`- **${G?'入力':'Input'}**: ${G?'関連ドキュメント':'Relevant documents'}\n- **${G?'出力':'Output'}**: ${G?'検証レポート/生成物':'Validation report / deliverables'}\n`;
        }
        catalogMd+='\n';
      });
    });

    // Advanced skills based on ai_auto level
    const hasMultiAgent=aiAuto.includes('Multi')||aiAuto.includes('マルチ')||aiAuto.includes('Full')||aiAuto.includes('フル')||aiAuto.includes('Orch');
    const hasFullAuto=aiAuto.includes('Full')||aiAuto.includes('フル')||aiAuto.includes('Orch');

    if(hasMultiAgent){
      catalogMd+=`## ${G?'高度スキル':'Advanced'}\n`;
      catalogMd+=`### ${G?'並列レビュー':'Parallel Review'}\n- **${G?'目的':'Purpose'}**: ${G?'複数エージェントで同時レビュー':'Multi-agent simultaneous review'}\n- **${G?'判断':'Judgment'}**: ${G?'全合意':'All agree'}\n- **${G?'入力':'Input'}**: ${G?'対象コード':'Target code'}\n- **${G?'処理':'Process'}**: ${G?'分割→並列レビュー→結果マージ→合意形成':'Split→parallel review→merge→consensus'}\n- **${G?'出力':'Output'}**: ${G?'統合レビュー':'Unified review'}\n\n`;
      catalogMd+=`### ${G?'コードレビュー自動化':'Auto Code Review'}\n- **${G?'目的':'Purpose'}**: ${G?'PR単位で自動コードレビュー':'Auto review per PR'}\n- **${G?'判断':'Judgment'}**: ${G?'問題0件':'0 issues'}\n- **${G?'入力':'Input'}**: ${G?'PRの差分':'PR diff'}\n- **${G?'処理':'Process'}**: ${G?'差分解析→パターンチェック→セキュリティスキャン→提案生成':'Diff→pattern check→security scan→suggestions'}\n- **${G?'出力':'Output'}**: ${G?'レビューコメント':'Review comments'}\n\n`;
      catalogMd+=`### ${G?'ドキュメント自動更新':'Auto Doc Update'}\n- **${G?'目的':'Purpose'}**: ${G?'コード変更に連動してドキュメント更新':'Update docs on code changes'}\n- **${G?'判断':'Judgment'}**: ${G?'乖離0':'0 drift'}\n- **${G?'入力':'Input'}**: ${G?'変更コード+既存docs/':'Changed code + existing docs/'}\n- **${G?'処理':'Process'}**: ${G?'変更検出→影響ドキュメント特定→差分生成→反映':'Detect change→find affected docs→gen diff→apply'}\n- **${G?'出力':'Output'}**: ${G?'更新済ドキュメント':'Updated docs'}\n\n`;
      catalogMd+=`### ${G?'圧縮':'Compression'}\n- **${G?'判断':'Judgment'}**: ${G?'トークン80%削減':'80% token reduction'}\n\n`;
    }
    if(hasFullAuto){
      catalogMd+=`## ${G?'自律':'Autonomous'}\n### ${G?'統括':'Orchestration'}\n- **${G?'判断':'Judgment'}**: ${G?'全完了':'All done'}\n### ${G?'自己修復':'Self-Heal'}\n- **${G?'判断':'Judgment'}**: ${G?'リトライ成功':'Retry OK'}\n\n`;
    }

    // Domain-specific skill
    const domainPb=DOMAIN_PLAYBOOK[domain]||DOMAIN_PLAYBOOK._default;
    if(domainPb&&domainPb.skill_ja&&domainPb.skill_ja!==''){
      const skillParts=(G?domainPb.skill_ja:domainPb.skill_en).split('|');
      if(skillParts.length>=5){
        catalogMd+=`## ${G?'業種特化スキル':'Domain-Specific'}\n### ${G?'業種カスタムスキル':'Custom Domain Skill'}\n`;
        catalogMd+=`- **${G?'役割':'Role'}**: ${skillParts[0]}\n`;
        catalogMd+=`- **${G?'目的':'Purpose'}**: ${skillParts[1]}\n`;
        catalogMd+=`- **${G?'入力':'Input'}**: ${skillParts[2]}\n`;
        catalogMd+=`- **${G?'判断基準':'Judgment'}**: ${skillParts[3]}\n`;
        catalogMd+=`- **${G?'出力':'Output'}**: ${skillParts[4]}\n\n`;
      }
    }

    catalogMd+=`${G?'## 工場テンプレート':'## Factory Template'}\n${G?'詳細はskills/project.mdを参照':'See skills/project.md for template details'}\n`;

    S.files['skills/catalog.md']=catalogMd;

    // ═══ Phase 3: Pipelines (simplified) ═══
    const aiLevel=aiAuto.includes('Vibe')||aiAuto.includes('入門')?'vibe':aiAuto.includes('Agentic')||aiAuto.includes('開発')?'agentic':aiAuto.includes('Multi')||aiAuto.includes('マルチ')?'multi':aiAuto.includes('Full')||aiAuto.includes('フル')?'full':'orch';
    const basePipe={n:'Feature Dev',t:'New task',s:['req-review','arch-validate','code-gen','test-gen','deploy-check'],g:aiLevel==='vibe'||aiLevel==='agentic'?'human':'auto'};
    const bugPipe={n:'Bug Fix',t:'Bug report',s:['reproduce','root-cause','fix','test','log'],g:aiLevel==='vibe'?'human':'auto'};
    const pipelines=[basePipe];
    if(aiLevel!=='vibe')pipelines.push(bugPipe);
    if(aiLevel==='full'||aiLevel==='orch')pipelines.push({n:'Release',t:'Version tag',s:['qa','staging','security','prod'],g:'staging'});

    let pipelineMd=`# ${pn} ${G?'— パイプライン':'— Pipelines'}\n\n`;
    pipelines.forEach(p=>{
      pipelineMd+=`## ${p.n}\n- **${G?'トリガー':'Trigger'}**: ${p.t}\n- **${G?'スキル':'Skills'}**: ${p.s.join(' → ')}\n- **${G?'ゲート':'Gate'}**: ${p.g}\n- **${G?'エラー':'Error'}**: ${G?'ログ → リトライ':'log → retry'}\n\n\`\`\`mermaid\ngraph LR\n  T[${G?'開始':'Start'}]`;
      p.s.forEach((s,i)=>pipelineMd+=` --> S${i+1}[${s}]`);
      pipelineMd+=` --> Done[${G?'完了':'Done'}]\n\`\`\`\n\n`;
    });
    pipelineMd+=`${G?'## 実行方法':'## Execution'}\n1. ${G?'トリガー':'Trigger'}\n2. ${G?'スキル実行':'Run skills'}\n3. ${G?'PASS → 次':'PASS → next'}\n`;

    S.files['skills/pipelines.md']=pipelineMd;

    // ═══ skills/factory.md (Manus Skills Factory Template) ═══
    const thinkingAxis={
      education:G?'理解できるか?':'Understandable?',
      ec:G?'コンバージョンするか?':'Converts?',
      saas:G?'ユーザー価値があるか?':'User value?',
      fintech:G?'安全か?':'Secure?',
      health:G?'正確か?':'Accurate?',
      marketplace:G?'信頼できるか?':'Trustworthy?',
      community:G?'健全か?':'Healthy?',
      content:G?'エンゲージメントするか?':'Engaging?',
      analytics:G?'正確か?':'Accurate?',
      booking:G?'重複しないか?':'No conflicts?',
      business:G?'効率的か?':'Efficient?',
      iot:G?'接続できるか?':'Connected?',
      realestate:G?'成約するか?':'Converts?',
      legal:G?'準拠しているか?':'Compliant?',
      hr:G?'公平か?':'Fair?',
      ai:G?'幻覚がないか?':'No hallucinations?',
      automation:G?'自動化できるか?':'Automatable?',
      event:G?'満足できるか?':'Satisfying?',
      gamify:G?'継続できるか?':'Retaining?',
      collab:G?'同期できるか?':'Synced?',
      devtool:G?'使いやすいか?':'Developer-friendly?',
      creator:G?'収益化できるか?':'Monetizable?',
      newsletter:G?'開封されるか?':'Opened?'
    };
    const axis=thinkingAxis[domain]||(G?'目標達成できるか?':'Goal-achievable?');

    let factoryMd='# '+(G?'Manus Skills式スキルファクトリー':'Manus Skills Factory Template')+'\n\n';
    factoryMd+=G?'**重要**: このテンプレートは「1スキル=1判断」原則に基づき、カスタムスキルを設計するためのファクトリーです。AIエージェントは、新しいタスクに遭遇した際、このフォーマットでスキルを定義してください。\n\n':'**IMPORTANT**: This template follows "1 Skill = 1 Judgment" principle for designing custom skills. AI agents MUST use this format when defining new skills for encountered tasks.\n\n';

    factoryMd+=(G?'## 原則: 1スキル=1判断':'## Principle: 1 Skill = 1 Judgment')+'\n\n';
    factoryMd+=G?'- **スキルは判断単位**: 複数の判断を1スキルに詰め込まない\n- **判断基準は明確**: "PASS/FAIL"または"数値目標"で測定可能\n- **入力→処理→判断→出力**: この4ステップで完結する\n\n':'- **Skill is a judgment unit**: Don\'t pack multiple judgments into one skill\n- **Judgment criteria are clear**: Measurable as "PASS/FAIL" or "numerical targets"\n- **Input → Process → Judge → Output**: Complete in these 4 steps\n\n';

    factoryMd+=(G?'## ドメイン別思考軸':'## Domain-Specific Thinking Axis')+'\n\n';
    factoryMd+='**'+(G?'現在のドメイン':'Current Domain')+'**: '+domain+'\n';
    factoryMd+='**'+(G?'中心的な問い':'Central Question')+'**: **'+axis+'**\n\n';
    factoryMd+=G?'すべてのスキルは、この思考軸に沿った判断を行うべきです。\n\n':'All skills should make judgments aligned with this thinking axis.\n\n';

    factoryMd+=(G?'## スキル定義フォーマット':'## Skill Definition Format')+'\n\n```\n';
    factoryMd+=(G?'### スキル名: 【具体的な判断内容】':'### Skill Name: [Specific Judgment]')+'\n\n';
    factoryMd+='**'+(G?'役割':'Role')+'** (Planning/Design/Production/Operations): '+(G?'該当フェーズを選択':'Select applicable phase')+'\n\n';
    factoryMd+='**'+(G?'目的':'Purpose')+'**: '+(G?'このスキルが何を判断するか（1文で）':'What this skill judges (one sentence)')+'\n\n';
    factoryMd+='**'+(G?'入力':'Input')+'**:\n- '+(G?'必要なファイル/データ':'Required files/data')+'\n- '+(G?'前提条件':'Prerequisites')+'\n\n';
    factoryMd+='**'+(G?'処理':'Processing')+'**:\n1. '+(G?'ステップ1':'Step 1')+'\n2. '+(G?'ステップ2':'Step 2')+'\n3. '+(G?'ステップ3':'Step 3')+'\n\n';
    factoryMd+='**'+(G?'判断基準':'Judgment Criteria')+'**: '+(G?'PASS条件（測定可能）':'PASS condition (measurable)')+'\n';
    factoryMd+=(G?'- 例: エラー0件, カバレッジ80%+, 応答時間2秒以下':'- Example: 0 errors, coverage ≥80%, response time ≤2s')+'\n\n';
    factoryMd+='**'+(G?'出力':'Output')+'**:\n- PASS/'+(G?'FAIL':'FAIL')+'\n- '+(G?'判断理由':'Reason')+'\n- '+(G?'次のアクション':'Next action')+'\n```\n\n';

    factoryMd+=(G?'## カスタムスキル作成手順':'## Custom Skill Creation Steps')+'\n\n';
    factoryMd+='1. **'+(G?'判断内容を特定':'Identify judgment')+'**\n   - '+(G?'何を判断するか明確にする':'Clarify what to judge')+'\n   - '+(G?'複数の判断がある場合は分割する':'Split if multiple judgments exist')+'\n\n';
    factoryMd+='2. **'+(G?'入力を定義':'Define inputs')+'**\n   - '+(G?'必要なドキュメント/ファイルをリスト':'List required documents/files')+'\n   - '+(G?'前提条件を明記':'Specify prerequisites')+'\n\n';
    factoryMd+='3. **'+(G?'処理ステップを分解':'Break down processing')+'**\n   - '+(G?'3-5ステップで記述':'Describe in 3-5 steps')+'\n   - '+(G?'各ステップは具体的に':'Each step should be concrete')+'\n\n';
    factoryMd+='4. **'+(G?'判断基準を数値化':'Quantify criteria')+'**\n   - '+(G?'測定可能な基準にする':'Make measurable criteria')+'\n   - '+(G?'思考軸に沿っているか確認':'Check alignment with thinking axis')+'\n\n';
    factoryMd+='5. **'+(G?'出力を設計':'Design output')+'**\n   - PASS/FAIL + '+(G?'理由':'reason')+'\n   - '+(G?'次のアクション（次のスキル名 or 完了）':'Next action (next skill name or complete)')+'\n\n';

    factoryMd+=(G?'## サンプルスキル':'## Sample Skill')+'\n\n```\n';
    factoryMd+=(G?'### スキル名: データベース設計検証':'### Skill Name: Database Design Validation')+'\n\n';
    factoryMd+='**'+(G?'役割':'Role')+'**: Design\n\n';
    factoryMd+='**'+(G?'目的':'Purpose')+'**: '+(G?'ER図とentitiesが一致し、FK参照が正しいか判断':'Judge if ER diagram matches entities and FK references are correct')+'\n\n';
    factoryMd+='**'+(G?'入力':'Input')+'**:\n- docs/04_er_diagram.md\n- .spec/technical-plan.md (entities)\n\n';
    factoryMd+='**'+(G?'処理':'Processing')+'**:\n1. '+(G?'ER図から全エンティティ抽出':'Extract all entities from ER diagram')+'\n2. '+(G?'technical-planのentitiesリストと照合':'Compare with entities list in technical-plan')+'\n3. '+(G?'FK参照先が全て存在するか確認':'Verify all FK references exist')+'\n\n';
    factoryMd+='**'+(G?'判断基準':'Judgment Criteria')+'**: '+(G?'不一致0件 AND FK未定義0件':'0 mismatches AND 0 undefined FKs')+'\n\n';
    factoryMd+='**'+(G?'出力':'Output')+'**:\n- PASS/'+(G?'FAIL':'FAIL')+'\n- '+(G?'不一致リスト（あれば）':'Mismatch list (if any)')+'\n- '+(G?'次: API設計検証':'Next: API Design Validation')+'\n```\n\n';

    factoryMd+=(G?'## ドメイン別スキル例':'## Domain-Specific Skill Examples')+'\n\n';
    if(domainSkills.length>0){
      factoryMd+=(G?'現在のドメイン（':'Current domain (')+domain+(G?'）の登録済みスキル:':') registered skills:')+'\n';
      domainSkills.forEach((sk,i)=>{
        const[r,nJa,nEn,pJa,pEn,jJa,jEn]=sk.split(':');
        factoryMd+=(i+1)+'. **'+(G?nJa:nEn)+'** - '+(G?jJa:jEn)+'\n';
      });
    }else{
      factoryMd+=G?'（このドメインはまだスキルが登録されていません。上記フォーマットで作成してください）':'(No skills registered for this domain yet. Create using the format above)';
    }
    factoryMd+='\n';

    S.files['skills/factory.md']=factoryMd;

    // ═══ Phase 4: AGENTS.md enhancement ═══
    S.files['AGENTS.md']+=`\n\n## Pipeline Coordination\n- Pipelines: skills/pipelines.md\n- Catalog: skills/catalog.md\n- Gates: ${aiLevel==='vibe'||aiLevel==='agentic'?'human':'auto'}\n- Error: docs/25 → retry → escalate\n- Context: AI_BRIEF.md only\n`;
  }
}

