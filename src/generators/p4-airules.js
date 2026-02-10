/* ── Pillar ④ AI Agent Rules (Phase B: Context-Aware, 11 files) ── */
function genPillar4_AIRules(a,pn){
  const G=S.genLang==='ja';
  const db=a.database||'PostgreSQL';
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const orm=arch.isBaaS?(a.backend.includes('Supabase')?'Supabase Client SDK':a.backend.includes('Firebase')?'Firebase SDK':'Convex Client'):(a.orm&&a.orm.includes('Drizzle')?'Drizzle ORM':'Prisma ORM');
  const archNote=G?{baas:'BaaS統合パターン（サーバーレス）',bff:'BFF パターン（Next.js API Routes統合）',split:'フロント/バック分離（別ホスト）',traditional:'従来型クライアント-サーバー'}[arch.pattern]:{baas:'BaaS Integration (serverless)',bff:'BFF Pattern (Next.js API Routes)',split:'FE/BE Split (separate hosts)',traditional:'Traditional Client-Server'}[arch.pattern];

  const core=`Project: ${pn}
Stack: ${a.frontend||'React'} + ${a.backend||'Node.js'} + ${db}
Architecture: ${archNote}
Auth SoT: ${auth.sot}
Methods: ${a.dev_methods||'TDD'}
Entities: ${a.data_entities||'users'}
Purpose: ${a.purpose||'N/A'}`;

  const rules=`You are an AI assistant for "${pn}".
${core}

## Rules
1. Always use TypeScript with strict mode
2. Follow ${(a.dev_methods||'TDD').split(', ')[0]} methodology
3. Write tests before implementation
4. Use ${a.frontend||'React'} conventions
5. Database: ${db} with ${orm}
6. Auth: ${auth.sot} — token type: ${auth.tokenType}
7. Architecture: ${archNote}
8. Keep functions small and focused
9. Use meaningful variable names
10. Add JSDoc comments for public APIs
11. Handle errors gracefully
12. Follow project structure in .spec/technical-plan.md`;

  const forbidden=arch.isBaaS?
    `- No raw SQL in application code (use ${orm} methods)
  - OK: DDL/RLS/migration SQL in supabase/migrations/
- No separate Express/Fastify server (use ${a.backend} functions)
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

  S.files['.cursor/rules']=rules;
  S.files['.github/copilot-instructions.md']=`# GitHub Copilot Instructions\n${rules}`;
  S.files['.windsurfrules']=rules;
  S.files['.clinerules']=rules;
  S.files['.kiro/spec.md']=`# Kiro Spec\n${core}\n\n## Spec Files\nSee .spec/ directory for full specifications.`;
  S.files['CLAUDE.md']=`# CLAUDE.md — ${pn}\n${core}\n\n## Spec-Driven Development\nRead .spec/constitution.md first.\nAll changes must align with .spec/specification.md.\nUse .spec/tasks.md as the source of truth for work items.\n\n## Auth\n- Source of Truth: ${auth.sot}\n- Token: ${auth.tokenType}\n- Verification: ${auth.tokenVerify}\n${auth.social.length?'- Providers: '+auth.social.join(', '):''}\n\n## Code Style\n- TypeScript strict\n- ESLint + Prettier\n- Vitest for testing\n- ${orm} for ${db}\n\n## Forbidden\n${forbidden}\n\n## Workflow Cycle\n1. Read docs/ → Select needed context\n2. Plan → Outline approach before coding\n3. Implement → Code with tests\n4. Update docs/24_progress.md → Mark completed tasks\n5. Log errors to docs/25_error_logs.md → Prevent recurrence\n\n## Context Management\n- Write: All specs live in docs/ — read before coding\n- Select: Only load files relevant to current task\n- Compress: If context is large, read AI_BRIEF.md (~3K tokens) instead\n- Isolate: Use subagents for research, keep main context clean\n\n## Key Context Files\n| File | When to Read | Tokens |\n|------|-------------|--------|\n| AI_BRIEF.md | Always (start here) | ~3K |\n| .spec/constitution.md | Before any change | ~1K |\n| .spec/tasks.md | Before picking work | ~1K |\n| docs/24_progress.md | Before/after tasks | ~0.5K |\n| docs/25_error_logs.md | When debugging | ~0.5K |`;
  S.files['AGENTS.md']=`# AGENTS.md — ${pn}\n\n## Agent Guidelines\n${core}\n\n## Task Assignment\n- Frontend agent: UI components, pages, styling\n- Backend agent: ${arch.isBaaS?a.backend+' functions, RLS policies':arch.pattern==='bff'?'Next.js API Routes, middleware':'API routes, database, auth'}\n- Test agent: Unit tests, E2E tests\n- DevOps agent: CI/CD, deployment\n\n## Coordination\n- All agents must read .spec/ before starting\n- Use tasks.md for work coordination\n- Commit with conventional commits`;
  S.files['codex-instructions.md']=`# Codex Instructions (OpenAI)\n${rules}\n\n## Codex Agent Mode\n- Use agentic mode for multi-file refactoring\n- Verify changes with npm test before committing\n- Respect .spec/ constraints`;
  S.files['skills/project.md']=`# Project Skills — ${pn}\n${core}\n\n## Available Skills\n- spec-review: Review changes against .spec/\n- test-gen: Generate tests for new code\n- doc-gen: Generate documentation\n- refactor: Suggest refactoring opportunities`;
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
  const entities=(a.data_entities||'User').split(', ').filter(Boolean);
  const features=(a.mvp_features||'CRUD').split(', ').filter(Boolean);
  const screens=(a.screens||'Dashboard').split(', ').filter(Boolean);
  const fe=a.frontend||'React';const be=a.backend||'Node.js';
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
}

