/* ── Pillar ④ AI Agent Rules (Phase B: Context-Aware, 11 files) ── */
function genPillar4_AIRules(a,pn){
  const G=S.genLang==='ja';
  const db=a.database||'PostgreSQL';
  const be=a.backend||'Node.js + Express';
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const _ormR=resolveORM(a);const orm=_ormR.name;
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

  // ═══ A1: File Selection Matrix (Task-specific context loading) ═══
  const fileSelectionMatrix=G?
    '| タスク種別 | 推奨読込ファイル | 推定トークン |\n|---------|---------------|----------|\n| 🆕 新規機能 | AI_BRIEF.md + .spec/specification.md + docs/04_er_diagram.md | ~6K |\n| 🐛 バグ修正 | AI_BRIEF.md + docs/25_error_logs.md + 該当ソースファイル | ~4K |\n| 📝 設計レビュー | .spec/constitution.md + .spec/specification.md + docs/32_qa_blueprint.md | ~7K |\n| 🔒 セキュリティ | docs/08_security.md + docs/25_error_logs.md + .spec/verification.md | ~5K |\n| 🧪 テスト作成 | docs/07_test_cases.md + docs/33_test_matrix.md + 対象コード | ~6K |\n| 📚 ドキュメント | AI_BRIEF.md + 該当実装 + .spec/specification.md | ~5K |\n| 🚀 デプロイ | docs/09_release.md + .github/workflows/ci.yml + .devcontainer/ | ~3K |\n| 🎯 計画・マイルストーン | docs/29_reverse_engineering.md + docs/30_goal_decomposition.md + .spec/tasks.md | ~5K |\n| 🔍 調査タスク | AI_BRIEF.md のみ（詳細はサブエージェントに委譲） | ~3K |\n| 📋 戦略・コンプライアンス | docs/48_industry_blueprint.md + docs/50_stakeholder_strategy.md | ~5K |':
    '| Task Type | Recommended Files | Est. Tokens |\n|-----------|------------------|-------------|\n| 🆕 New Feature | AI_BRIEF.md + .spec/specification.md + docs/04_er_diagram.md | ~6K |\n| 🐛 Bug Fix | AI_BRIEF.md + docs/25_error_logs.md + relevant source | ~4K |\n| 📝 Design Review | .spec/constitution.md + .spec/specification.md + docs/32_qa_blueprint.md | ~7K |\n| 🔒 Security | docs/08_security.md + docs/25_error_logs.md + .spec/verification.md | ~5K |\n| 🧪 Test Writing | docs/07_test_cases.md + docs/33_test_matrix.md + target code | ~6K |\n| 📚 Documentation | AI_BRIEF.md + implementation + .spec/specification.md | ~5K |\n| 🚀 Deployment | docs/09_release.md + .github/workflows/ci.yml + .devcontainer/ | ~3K |\n| 🎯 Planning / Milestones | docs/29_reverse_engineering.md + docs/30_goal_decomposition.md + .spec/tasks.md | ~5K |\n| 🔍 Research | AI_BRIEF.md only (delegate details to sub-agents) | ~3K |\n| 📋 Strategic / Compliance | docs/48_industry_blueprint.md + docs/50_stakeholder_strategy.md | ~5K |';

  // detectIndustry() は p13 で function宣言（ホイスティングで利用可能）
  // INDUSTRY_INTEL は p13 の const（ランタイム時にはアクセス可能）
  const _ind=typeof detectIndustry==='function'?detectIndustry(a.purpose):null;
  const _ii=_ind&&typeof INDUSTRY_INTEL!=='undefined'?INDUSTRY_INTEL[_ind]:null;
  const domainRisksMd=_ii?(G?
    '\n## コンプライアンス & ドメインリスク\n\n### 規制要件\n'+_ii.reg_ja.map(r=>'- '+r).join('\n')+'\n\n### 主要失敗要因\n'+_ii.fail_ja.map(f=>'- ⚠️ '+f).join('\n')+'\n':
    '\n## Compliance & Domain Risks\n\n### Regulatory Requirements\n'+_ii.reg_en.map(r=>'- '+r).join('\n')+'\n\n### Key Failure Factors\n'+_ii.fail_en.map(f=>'- ⚠️ '+f).join('\n')+'\n'
  ):'';

  // ═══ Phase 4: CLAUDE.md 3-Layer Split ═══
  // Layer A: Thin root CLAUDE.md (~1.5K tokens, compressed from ~3K)
  S.files['CLAUDE.md']=genThinCLAUDE(a,pn,auth,forbidden,G,arch,domainRisksMd);

  // Layer B: Path-specific rule files
  S.files['.claude/rules/spec.md']=genSpecRules(G,fileSelectionMatrix,domainCtx);
  S.files['.claude/rules/frontend.md']=genFrontendRules(a.frontend||'React',G);
  S.files['.claude/rules/backend.md']=genBackendRules(arch,be,a.backend||'Node.js + Express',G,orm);
  S.files['.claude/rules/test.md']=genTestRules(a.dev_methods||'TDD',G);
  S.files['.claude/rules/ops.md']=genOpsRules(G);

  // Layer C: Settings
  S.files['.claude/settings.json']=JSON.stringify({
    permissions:{
      allowedTools:['Read','Write','Edit','Bash','Glob','Grep','WebFetch'],
      dangerousCommands:{
        requireConfirmation:['rm -rf','git push --force','git reset --hard','DROP TABLE','DELETE FROM']
      }
    },
    context:{
      specDir:'.spec/',
      docsDir:'docs/',
      testCommand:'npm test',
      buildCommand:'npm run build'
    },
    rules:{
      autoLoadByPath:true,
      strictMode:false
    }
  },null,2);
  // ═══ A3: AGENTS.md Sub-agent Coordination Enhancement ═══
  const agentSpecMatrix=G?
    '| エージェント | 専門領域 | 必要コンテキスト | トークン予算 |\n|----------|--------|-------------|----------|\n| Planner | 計画・マイルストーン | docs/29_reverse_engineering.md + docs/30_goal_decomposition.md + .spec/tasks.md | ~5K |\n| Frontend | UI/UX実装 | AI_BRIEF.md + docs/06_screen_design.md + docs/26_design_system.md | ~5K |\n| Backend | API/DB実装 | AI_BRIEF.md + docs/04_er_diagram.md + docs/05_api_design.md | ~6K |\n| Test | テスト作成 | AI_BRIEF.md + docs/07_test_cases.md + docs/33_test_matrix.md | ~6K |\n| QA | 品質検証 | docs/32_qa_blueprint.md + docs/37_bug_prevention.md | ~4K |\n| DevOps | デプロイ | docs/09_release_checklist.md + .devcontainer/ + .github/workflows/ | ~3K |\n| Research | 調査専門 | AI_BRIEF.md のみ（結論返却） | ~3K |':
    '| Agent | Specialization | Required Context | Token Budget |\n|-------|---------------|------------------|-------------|\n| Planner | Planning & milestones | docs/29_reverse_engineering.md + docs/30_goal_decomposition.md + .spec/tasks.md | ~5K |\n| Frontend | UI/UX impl | AI_BRIEF.md + docs/06_screen_design.md + docs/26_design_system.md | ~5K |\n| Backend | API/DB impl | AI_BRIEF.md + docs/04_er_diagram.md + docs/05_api_design.md | ~6K |\n| Test | Test creation | AI_BRIEF.md + docs/07_test_cases.md + docs/33_test_matrix.md | ~6K |\n| QA | Quality assurance | docs/32_qa_blueprint.md + docs/37_bug_prevention.md | ~4K |\n| DevOps | Deployment | docs/09_release_checklist.md + .devcontainer/ + .github/workflows/ | ~3K |\n| Research | Investigation | AI_BRIEF.md only (return conclusion) | ~3K |';

  const handoffProtocol=G?
    '\n## Handoff Protocol（引継ぎフォーマット）\n\n**引継ぎ時に必ず含める情報**:\n```yaml\nfrom: [引継ぎ元エージェント名]\nto: [引継ぎ先エージェント名]\ntask: [タスク概要 1文]\ncontext: [必要最小限のコンテキスト]\ndeliverables:\n  - [成果物1]\n  - [成果物2]\nnext_action: [次のアクション]\nblocking_issues: [ブロッカーがあれば]\n```\n\n**Summary-Only Import原則**:\n- 調査エージェントは全文返却禁止\n- 結論(3行) + 推奨事項(3つ) + 次のアクションのみ\n- メインエージェントは要約のみコンテキストに追加\n':
    '\n## Handoff Protocol\n\n**Required information in handoff**:\n```yaml\nfrom: [Source agent name]\nto: [Target agent name]\ntask: [Task summary in 1 sentence]\ncontext: [Minimal necessary context]\ndeliverables:\n  - [Deliverable 1]\n  - [Deliverable 2]\nnext_action: [Next action]\nblocking_issues: [If any blockers]\n```\n\n**Summary-Only Import Principle**:\n- Research agents MUST NOT return full text\n- Conclusion (3 lines) + Recommendations (3 bullets) + Next action only\n- Main agent adds summary only to context\n';

  S.files['AGENTS.md']=`# AGENTS.md — ${pn}\n\n## Agent Guidelines\n${core}\n\n## Task Assignment\n- Frontend agent: UI components, pages, styling\n- Backend agent: ${arch.isBaaS?a.backend+' functions, RLS policies':arch.pattern==='bff'?'Next.js API Routes, middleware':'API routes, database, auth'}\n- Test agent: Unit tests, E2E tests\n- DevOps agent: CI/CD, deployment\n\n## Agent Specialization Matrix\n${G?'**エージェント種別と責任範囲**':'**Agent types and responsibilities**'}\n\n${agentSpecMatrix}${handoffProtocol}\n\n## Coordination\n- All agents must read .spec/ before starting\n- Use tasks.md for work coordination\n- Commit with conventional commits`;
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

  const _trb=typeof TECH_RADAR_BASE!=='undefined'?TECH_RADAR_BASE:null;
  const briefDomainRisk=_ii?(G?
    '\n## ドメインリスク\n'+_ii.fail_ja.slice(0,3).map(f=>'- '+f).join('\n')+'\n':
    '\n## Domain Risks\n'+_ii.fail_en.slice(0,3).map(f=>'- '+f).join('\n')+'\n'
  ):'';
  // Tech Radar: 選択技術の分類を表示
  const _feRadar=_trb?(['frontend','backend','infrastructure','ai'].map(cat=>{
    const r=_trb[cat];if(!r)return '';
    const all=[...r.adopt.map(t=>t+':Adopt'),...r.trial.map(t=>t+':Trial'),...r.assess.map(t=>t+':Assess'),...r.hold.map(t=>t+':Hold')];
    // ユーザー選択技術とマッチ
    const stack=[a.frontend,a.backend,a.database,a.deploy].filter(Boolean).join(' ');
    return all.filter(e=>stack.includes(e.split(':')[0].split(' ')[0])).join(', ');
  }).filter(Boolean).join(', ')):'';
  const briefTechRadar=_feRadar?(G?'\nTech Radar: '+_feRadar+'\n':'\nTech Radar: '+_feRadar+'\n'):'';

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

## Context Loading Strategy
**Phase-based file loading priority**:

${G?'- **Phase 0 企画**: .spec/constitution.md → .spec/specification.md + docs/29_reverse_engineering.md':'- **Phase 0 Planning**: .spec/constitution.md → .spec/specification.md + docs/29_reverse_engineering.md'}
${G?'- **Phase 1 設計**: + docs/04_er_diagram.md + docs/05_api_design.md + docs/30_goal_decomposition.md + docs/32_qa_blueprint.md':'- **Phase 1 Design**: + docs/04_er_diagram.md + docs/05_api_design.md + docs/30_goal_decomposition.md + docs/32_qa_blueprint.md'}
${G?'- **Phase 2 実装**: + AI_BRIEF.md (主要) + docs/24_progress.md + 該当ソース':'- **Phase 2 Implementation**: + AI_BRIEF.md (primary) + docs/24_progress.md + relevant source'}
${G?'- **Phase 3 テスト**: + docs/07_test_cases.md + docs/33_test_matrix.md + docs/36_test_strategy.md':'- **Phase 3 Testing**: + docs/07_test_cases.md + docs/33_test_matrix.md + docs/36_test_strategy.md'}
${G?'- **Phase 4 運用**: + docs/34_incident_response.md + docs/09_release_checklist.md + docs/25_error_logs.md':'- **Phase 4 Operations**: + docs/34_incident_response.md + docs/09_release_checklist.md + docs/25_error_logs.md'}

**Token budget allocation**:
${G?'- 🎯 現在タスク: 40% (4K)':'- 🎯 Current task: 40% (4K)'}
${G?'- 📋 Spec/設計: 30% (3K)':'- 📋 Spec/design: 30% (3K)'}
${G?'- 📊 進捗/履歴: 20% (2K)':'- 📊 Progress/history: 20% (2K)'}
${G?'- 🔄 予備バッファ: 10% (1K)':'- 🔄 Reserve buffer: 10% (1K)'}

**New files reference** (${G?'最新生成ファイル':'latest generated files'}):
- docs/29_reverse_engineering.md ${G?'— ゴール逆算プランニング':'— Goal-driven planning'}
- docs/30_goal_decomposition.md ${G?'— ゴール分解・ギャップ分析':'— Goal decomposition & gap analysis'}
- docs/34_incident_response.md ${G?'— 障害対応':'— Incident response'}
- docs/35_sitemap.md ${G?'— 情報設計':'— Information architecture'}
- docs/36_test_strategy.md ${G?'— フェーズ別テスト戦略':'— Phase-based testing'}
- docs/37_bug_prevention.md ${G?'— バグ予防':'— Bug prevention'}
- docs/38_business_model.md ${G?'— ビジネスモデル (payment≠none時)':'— Business model (if payment≠none)'}
- skills/agents/*.md ${G?'— エージェント定義 (ai_auto=multi/full時)':'— Agent definitions (if ai_auto=multi/full)'}
- docs/83-102 ${G?'— P21-25: API/DB/テスト/AI安全/パフォーマンス':'— P21-25: API/DB/Testing/AI Safety/Performance'}

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
${stripeCompact}${rbacCompact}${briefDomainRisk}${briefTechRadar}

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
    const domain=detectDomain(a.purpose||'');

    // Compressed: role:name_ja:name_en:purpose_ja:purpose_en:judgment_ja:judgment_en
    const coreSkills=['0:ゴール逆算:Goal Reversal:KPI→機能→実装の逆算:KPI → Features → Impl:ギャップ0:0 gaps','0:要件レビュー:Req Review:要件検証:Verify reqs:欠落0:0 gaps','1:設計検証:Arch Review:技術評価:Eval tech:P0リスク0:0 P0 risks','2:実装支援:Code Support:実装支援:Impl support:エラー0:0 errors','3:デプロイ検証:Deploy Check:デプロイ前チェック:Pre-deploy check:全PASS:All PASS'];

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
      newsletter:['0:コンテンツ戦略:Content Strategy:配信コンテンツ戦略:Delivery content strategy:開封率25%+:≥25% open rate','1:セグメント設計:Segment Design:セグメント配信設計:Design segment delivery:精度95%+:≥95% accuracy','2:A/Bテスト:A/B Test:A/Bテスト設計:Design A/B test:統計的有意性:Statistical significance'],
      travel:['0:旅程設計:Trip Design:旅程・予約フロー設計:Design trip & booking flow:重複予約0:0 overbooking','1:在庫管理:Availability:空き室・在庫管理:Manage availability & inventory:過剰予約0:0 oversell','2:キャンセル処理:Cancellation:キャンセルポリシー実装:Implement cancellation policy:返金正確:Accurate refunds'],
      government:['0:申請設計:Application Design:電子申請フロー設計:Design e-application flow:アクセシビリティ準拠:A11y compliant','1:審査フロー:Review Flow:審査ワークフロー設計:Design review workflow:漏れ0:0 gaps','2:個人情報保護:Privacy:個人情報保護設計:Design privacy protection:暗号化100%:100% encrypted'],
      insurance:['0:証券設計:Policy Design:保険証券設計:Design insurance policy:必須項目100%:100% fields complete','1:クレーム処理:Claims:クレーム処理ワークフロー:Claims processing workflow:SLA準拠:SLA compliant','2:リスク評価:Risk Assess:リスク評価ロジック:Risk assessment logic:精度95%+:≥95% accuracy'],
      manufacturing:['0:生産設計:Production Design:生産フロー設計:Design production flow:効率最大化:Maximize efficiency','1:品質管理:Quality Control:品質検査記録:Quality inspection records:不良品0:0 defects','2:在庫最適化:Inventory Opt:在庫最適化ロジック:Inventory optimization:欠品0:0 stockouts'],
      logistics:['0:配送設計:Delivery Design:配送フロー設計:Design delivery flow:遅延0:0 delays','1:追跡システム:Tracking:荷物追跡システム:Package tracking system:可視性100%:100% visibility','2:ルート最適化:Route Opt:配送ルート最適化:Optimize delivery routes:コスト削減:Cost reduced'],
      agriculture:['0:栽培管理:Crop Mgmt:作物データ管理:Manage crop data:記録100%:100% recorded','1:センサー分析:Sensor Analysis:農場センサー分析:Farm sensor analysis:異常検知:Anomaly detected','2:収穫予測:Harvest Forecast:収穫量予測モデル:Crop yield prediction:精度85%+:≥85% accuracy'],
      energy:['0:消費設計:Energy Design:エネルギー消費設計:Design energy consumption:最適化10%+:≥10% optimized','1:監視システム:Monitoring:エネルギー監視:Energy monitoring:リアルタイム:Realtime','2:節約分析:Savings Analysis:節約効果分析:Analyze savings:可視化:Visualized'],
      media:['0:コンテンツ設計:Content Design:メディアコンテンツ設計:Design media content:DRM準拠:DRM compliant','1:配信最適化:Streaming Opt:CDN・ストリーミング最適化:Optimize CDN & streaming:バッファリング3%↓:≤3% buffering','2:アクセス制御:Access Control:コンテンツアクセス制御:Content access control:不正アクセス0:0 unauthorized'],
      portfolio:['0:SEO最適化:SEO Opt:ポートフォリオSEO最適化:Portfolio SEO optimize:Core Web Vitals合格:Pass CWV','1:問い合わせ設計:Contact Design:問い合わせフォーム設計:Design contact form:到達100%:100% delivery'],
      tool:['0:UX設計:UX Design:ツールUX設計:Design tool UX:タスク完了率95%+:≥95% task completion','1:ドキュメント:Docs:使い方ドキュメント生成:Generate usage docs:網羅性90%+:≥90% coverage']
    };

    const domainSkills=domainSkillsMap[domain]||[];
    const allSkills=[...coreSkills,...domainSkills];

    const roleNames=G?['企画 (Planning)','設計 (Design)','制作 (Production)','運用 (Operations)']:['Planning','Design','Production','Operations'];

    // Template helpers for compression
    const _fld=(fj,fe,val)=>`- **${G?fj:fe}**: ${val}\n`;
    // Compressed skill details helper (19 skills)
    const _sd=(i,pj,pe,oj,oe)=>({input:i,process:G?pj:pe,output:G?oj:oe});
    const skillDetails={
      '教材設計':_sd('docs/03,04','ER図→学習フロー抽出→難易度分類→構成生成','ER→flow→difficulty→curriculum','構成マップ(md)','Curriculum (md)'),
      '機能仕様':_sd('.spec/constitution','使命→ストーリー抽出→受入条件3つ→優先度付与','Mission→stories→3 AC→priority','仕様書(md)','Spec (md)'),
      'API設計':_sd('docs/04,05','ER→エンドポイント生成→REST命名チェック→標準化','ER→endpoints→REST check→standardize','API仕様(OpenAPI)','API spec (OpenAPI)'),
      '決済検証':_sd('docs/08','OWASP照合→Webhook検証→RLSチェック','OWASP→webhook→RLS','チェックリスト','Checklist'),
      '要件レビュー':_sd('.spec/constitution,specification','使命→KPI照合→機能網羅チェック→欠落列挙','Mission→KPI check→feature coverage→list gaps','矛盾リスト+修正案','Gap list + fix proposal'),
      '設計検証':_sd('.spec/technical-plan','スタック評価→依存関係チェック→リスク分析→代替案','Stack eval→deps check→risk→alternatives','リスク評価表','Risk assessment'),
      '実装支援':_sd('.spec/specification,technical-plan','仕様読込→型定義→CRUD実装→テスト生成','Read spec→types→CRUD impl→gen tests','実装コード+テスト','Code + tests'),
      'デプロイ検証':_sd('docs/09,ci.yml','環境変数チェック→ビルド検証→ヘルスチェック→ロールバック確認','Env check→build verify→health→rollback','デプロイレポート','Deploy report'),
      '問題生成':_sd('docs/03,Lesson','学習目標抽出→難易度設定→正常系3問+異常系3問→解説生成','Goals→difficulty→3 normal+3 edge→explanations','問題セット(JSON)','Quiz set (JSON)'),
      '商品検証':_sd('Product,Category','必須フィールド検査→SKU重複チェック→価格妥当性→画像存在確認','Required fields→SKU dup→price valid→image check','検証レポート','Validation report'),
      'モデレーション':_sd('Post,Comment','禁止語チェック→スパム判定→報告集計→対応優先度付与','Banned words→spam detect→report aggregate→priority','モデレーションキュー','Moderation queue'),
      '予約設計':_sd('Service,TimeSlot','空き枠計算→重複検出→バッファ設定→通知設計','Availability calc→dup detect→buffer→notify design','予約ロジック仕様','Booking logic spec'),
      '記録検証':_sd('HealthLog,Goal','入力値範囲チェック→異常値検出→トレンド分析→アラート条件設定','Range check→anomaly detect→trend→alert config','健康レポート','Health report'),
      'CRM設計':_sd('User,Contact','リード定義→ファネル設計→スコアリング→自動化ルール','Lead def→funnel→scoring→automation rules','CRM設計書','CRM design doc'),
      'デバイス管理':_sd('Device,Sensor','デバイス登録→接続状態監視→ファーム更新管理→ログ収集','Register→monitor→firmware→logs','デバイス管理画面','Device dashboard'),
      '物件管理':_sd('Property,Category','物件登録→写真管理→間取り設定→公開管理','Register→photos→floor plan→publish','物件データベース','Property DB'),
      '契約レビュー':_sd('Contract,Template','テンプレート照合→リスク条項検出→期限チェック→承認フロー','Template match→risk detect→deadline→approval','レビュー結果','Review result'),
      '採用フロー':_sd('JobPosting,Applicant','求人作成→応募管理→面接調整→評価集約→内定','Post→apply→interview→eval→offer','採用パイプライン','Hiring pipeline'),
      '取引検証':_sd('Transaction,Account','残高確認→二重支払チェック→限度額検証→監査ログ','Balance→dup check→limit→audit log','検証レポート','Validation report')
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
        catalogMd+=`### ${name}\n`+_fld('目的','Purpose',purpose)+_fld('判断基準','Judgment',judgment);
        if(detail){
          catalogMd+=_fld('入力','Input',detail.input)+_fld('処理','Process',detail.process)+_fld('出力','Output',detail.output);
        }else{
          catalogMd+=_fld('入力','Input',G?'関連ドキュメント':'Relevant documents')+_fld('出力','Output',G?'検証レポート/生成物':'Validation report / deliverables');
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
      newsletter:G?'開封されるか?':'Opened?',
      travel:G?'快適な旅を実現できるか?':'Great travel experience?',
      government:G?'市民に安全に届くか?':'Safely reaches citizens?',
      insurance:G?'正確に保障できるか?':'Accurately covered?',
      manufacturing:G?'品質を維持できるか?':'Quality maintained?',
      logistics:G?'確実に届くか?':'Reliably delivered?',
      agriculture:G?'収穫を最大化できるか?':'Harvest maximized?',
      energy:G?'効率化できるか?':'Energy-efficient?',
      media:G?'視聴体験を最大化できるか?':'Viewing experience maximized?'
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

    // ═══ C2: md Package Distribution (~10KB, ai_auto=multi/full/orch only) ═══
    const isMultiOrAbove=aiLevel==='multi'||aiLevel==='full'||aiLevel==='orch';

    if(isMultiOrAbove){
      // skills/README.md - Package overview
      let skillsReadme='# '+pn+' Skills Package\n\n';
      skillsReadme+=G?'**世界唯一のAI Development OS**: このパッケージは、AIエージェントが自律的に開発を進めるための完全なスキル体系です。\n\n':'**World\'s First AI Development OS**: This package is a complete skill system for AI agents to autonomously develop software.\n\n';

      skillsReadme+=(G?'## クイックスタート':'## Quick Start')+'\n\n';
      skillsReadme+='1. **'+(G?'全体像を把握':'Understand overview')+'**: `skills/skill_map.md` '+(G?'でスキル依存関係を確認':'for skill dependency map')+'\n';
      skillsReadme+='2. **'+(G?'詳細を確認':'Check details')+'**: `skills/catalog.md` '+(G?'で全スキル詳細を確認':'for all skill details')+'\n';
      skillsReadme+='3. **'+(G?'パイプライン実行':'Execute pipeline')+'**: `skills/pipelines.md` '+(G?'で自動化フロー確認':'for automation flows')+'\n';
      skillsReadme+='4. **'+(G?'カスタムスキル作成':'Create custom skills')+'**: `skills/factory.md` '+(G?'のテンプレート使用':'using template')+'\n\n';

      skillsReadme+=(G?'## ファイル構成':'## File Structure')+'\n\n';
      skillsReadme+='```\n';
      skillsReadme+='skills/\n';
      skillsReadme+='├── README.md          # '+(G?'このファイル':'This file')+'\n';
      skillsReadme+='├── skill_map.md       # '+(G?'依存関係マップ':'Dependency map')+'\n';
      skillsReadme+='├── catalog.md         # '+(G?'全スキルカタログ':'Full catalog')+'\n';
      skillsReadme+='├── pipelines.md       # '+(G?'自動化パイプライン':'Automation pipelines')+'\n';
      skillsReadme+='├── factory.md         # '+(G?'スキル工場テンプレート':'Skill factory template')+'\n';
      skillsReadme+='├── project.md         # '+( G?'プロジェクトスキル':'Project skills')+'\n';
      skillsReadme+='└── agents/\n';
      skillsReadme+='    ├── coordinator.md # '+(G?'オーケストレーター':'Coordinator agent')+'\n';
      skillsReadme+='    └── reviewer.md    # '+(G?'レビューアー':'Reviewer agent')+'\n';
      skillsReadme+='```\n\n';

      skillsReadme+=(G?'## AI成熟度モデル':'## AI Maturity Model')+'\n\n';
      skillsReadme+=(G?'**現在レベル**: '+aiLevel.toUpperCase():'**Current Level**: '+aiLevel.toUpperCase())+'\n\n';

      const maturityLevels=[
        {level:'Prompt',desc_ja:'個別プロンプト',desc_en:'Individual prompts',current:aiLevel==='vibe'},
        {level:'Skill',desc_ja:'スキル単位（1スキル=1判断）',desc_en:'Skill-based (1 skill = 1 judgment)',current:aiLevel==='agentic'},
        {level:'Agent',desc_ja:'エージェント単位（複数スキル統合）',desc_en:'Agent-based (multiple skills)',current:aiLevel==='multi'},
        {level:'Package',desc_ja:'パッケージ単位（スキル群配布）',desc_en:'Package-based (skill sets)',current:aiLevel==='full'},
        {level:'Series',desc_ja:'シリーズ単位（業種別パッケージ群）',desc_en:'Series-based (industry packages)',current:aiLevel==='orch'}
      ];

      maturityLevels.forEach((m,i)=>{
        const arrow=m.current?'👉 ':'   ';
        const label=G?m.desc_ja:m.desc_en;
        skillsReadme+=arrow+(i+1)+'. **'+m.level+'** - '+label+(m.current?' ✅':'')+'\n';
      });
      skillsReadme+='\n';

      skillsReadme+=(G?'## 使い方':'## Usage')+'\n\n';
      skillsReadme+='### '+(G?'スキル実行':'Execute Skill')+'\n';
      skillsReadme+='```javascript\n';
      skillsReadme+='// 1. '+(G?'スキルを選択':'Select skill')+'\n';
      skillsReadme+='const skill = getSkill(\'spec-review\');\n\n';
      skillsReadme+='// 2. '+(G?'入力を準備':'Prepare input')+'\n';
      skillsReadme+='const input = {\n';
      skillsReadme+='  files: [\'/.spec/constitution.md\', \'.spec/specification.md\'],\n';
      skillsReadme+='  context: AI_BRIEF\n';
      skillsReadme+='};\n\n';
      skillsReadme+='// 3. '+(G?'実行':'Execute')+'\n';
      skillsReadme+='const result = await executeSkill(skill, input);\n\n';
      skillsReadme+='// 4. '+(G?'判定':'Judge')+'\n';
      skillsReadme+='if (result.judgment === \'PASS\') {\n';
      skillsReadme+='  // '+(G?'次のスキルへ':'Proceed to next skill')+'\n';
      skillsReadme+='} else {\n';
      skillsReadme+='  // '+(G?'修正して再実行':'Fix and re-execute')+'\n';
      skillsReadme+='}\n';
      skillsReadme+='```\n\n';

      S.files['skills/README.md']=skillsReadme;

      // skills/skill_map.md - Dependency map with 4-layer business model
      let skillMapMd='# '+pn+' Skill Map\n\n';
      skillMapMd+=G?'**スキル依存関係マップ**: すべてのスキルの依存関係と4層ビジネスモデルを可視化します。\n\n':'**Skill Dependency Map**: Visualizes all skill dependencies and 4-layer business model.\n\n';

      skillMapMd+=(G?'## 4層ビジネスモデル':'## 4-Layer Business Model')+'\n\n';
      skillMapMd+='```mermaid\ngraph TB\n';
      skillMapMd+='  subgraph P['+(G?'企画':'Planning')+']\n';
      skillMapMd+='    P1['+( G?'要件レビュー':'Req Review')+']\n';
      skillMapMd+='  end\n';
      skillMapMd+='  subgraph D['+(G?'設計':'Design')+']\n';
      skillMapMd+='    D1['+(G?'設計検証':'Arch Review')+']\n';
      skillMapMd+='    D2['+(G?'API設計':'API Design')+']\n';
      skillMapMd+='  end\n';
      skillMapMd+='  subgraph C['+(G?'制作':'Production')+']\n';
      skillMapMd+='    C1['+(G?'実装支援':'Code Support')+']\n';
      skillMapMd+='    C2['+(G?'テスト生成':'Test Gen')+']\n';
      skillMapMd+='  end\n';
      skillMapMd+='  subgraph O['+(G?'運用':'Operations')+']\n';
      skillMapMd+='    O1['+(G?'デプロイ検証':'Deploy Check')+']\n';
      skillMapMd+='    O2['+(G?'ドキュメント生成':'Doc Gen')+']\n';
      skillMapMd+='  end\n\n';
      skillMapMd+='  P1 --> D1\n';
      skillMapMd+='  D1 --> D2\n';
      skillMapMd+='  D2 --> C1\n';
      skillMapMd+='  C1 --> C2\n';
      skillMapMd+='  C2 --> O1\n';
      skillMapMd+='  O1 --> O2\n';
      skillMapMd+='  O2 -.->|'+(G?'振り返り':'Retrospective')+'| P1\n';
      skillMapMd+='```\n\n';

      skillMapMd+=(G?'## スキル一覧':'## Skill List')+'\n\n';
      skillMapMd+='| '+(G?'スキルID':'Skill ID')+' | '+(G?'役割':'Role')+' | '+(G?'依存':'Depends On')+' | '+(G?'次':'Next')+' |\n';
      skillMapMd+='|----------|------|------|------|\n';
      skillMapMd+='| spec-review | Planning | - | arch-review |\n';
      skillMapMd+='| arch-review | Design | spec-review | api-design |\n';
      skillMapMd+='| api-design | Design | arch-review | code-gen |\n';
      skillMapMd+='| code-gen | Production | api-design | test-gen |\n';
      skillMapMd+='| test-gen | Production | code-gen | deploy-check |\n';
      skillMapMd+='| deploy-check | Operations | test-gen | doc-gen |\n';
      skillMapMd+='| doc-gen | Operations | deploy-check | - |\n\n';

      skillMapMd+=(G?'## 関連ドキュメント':'## Related Documents')+'\n\n';
      skillMapMd+='- **skills/catalog.md** — '+(G?'全スキル詳細':'All skill details')+'\n';
      skillMapMd+='- **skills/pipelines.md** — '+(G?'実行フロー':'Execution flows')+'\n';
      skillMapMd+='- **skills/factory.md** — '+(G?'カスタムスキル作成':'Custom skill creation')+'\n\n';

      S.files['skills/skill_map.md']=skillMapMd;

      // skills/agents/coordinator.md - Orchestrator agent definition
      let coordMd='# Coordinator Agent\n\n';
      coordMd+=G?'**役割**: 複数エージェントの統括・タスク配分・進捗管理\n\n':'**Role**: Orchestrate multiple agents, task allocation, progress management\n\n';

      coordMd+=(G?'## 責務':'## Responsibilities')+'\n\n';
      coordMd+='1. **'+(G?'タスク分解':'Task Decomposition')+'**: '+(G?'大きなタスクを実行可能な単位に分割':'Break large tasks into executable units')+'\n';
      coordMd+='2. **'+(G?'エージェント割当':'Agent Assignment')+'**: '+(G?'各タスクに最適なエージェントを割当':'Assign optimal agent to each task')+'\n';
      coordMd+='3. **'+(G?'進捗監視':'Progress Monitoring')+'**: docs/24_progress.md '+(G?'を更新':'updates')+'\n';
      coordMd+='4. **'+(G?'ブロッカー解消':'Blocker Resolution')+'**: '+(G?'依存関係の問題を検出・解決':'Detect and resolve dependency issues')+'\n\n';

      coordMd+=(G?'## 入力':'## Input')+'\n\n';
      coordMd+='- .spec/tasks.md '+(G?'— 全タスクリスト':'— All tasks list')+'\n';
      coordMd+='- docs/24_progress.md '+(G?'— 現在の進捗':'— Current progress')+'\n';
      coordMd+='- AI_BRIEF.md '+(G?'— プロジェクト全体像':'— Project overview')+'\n\n';

      coordMd+=(G?'## 判断基準':'## Judgment Criteria')+'\n\n';
      coordMd+='- [ ] '+(G?'全タスクが適切に割当済み':'All tasks properly assigned')+'\n';
      coordMd+='- [ ] '+(G?'ブロッカー0件':'0 blockers')+'\n';
      coordMd+='- [ ] '+(G?'進捗が予定通り':'Progress on track')+'\n\n';

      coordMd+=(G?'## 出力':'## Output')+'\n\n';
      coordMd+='- '+(G?'更新された.spec/tasks.md':'Updated .spec/tasks.md')+'\n';
      coordMd+='- '+(G?'更新されたdocs/24_progress.md':'Updated docs/24_progress.md')+'\n';
      coordMd+='- '+(G?'次のフェーズへの移行可否判定':'Go/No-go decision for next phase')+'\n\n';

      S.files['skills/agents/coordinator.md']=coordMd;

      // skills/agents/reviewer.md - Reviewer agent definition
      let reviewerMd='# Reviewer Agent\n\n';
      reviewerMd+=G?'**役割**: コード品質・設計整合性・セキュリティの自動レビュー\n\n':'**Role**: Automated review of code quality, design consistency, and security\n\n';

      reviewerMd+=(G?'## 責務':'## Responsibilities')+'\n\n';
      reviewerMd+='1. **'+(G?'コード品質':'Code Quality')+'**: '+(G?'TypeScript strict準拠、ESLintエラー0':'TypeScript strict, 0 ESLint errors')+'\n';
      reviewerMd+='2. **'+(G?'設計整合性':'Design Consistency')+'**: .spec/specification.md '+(G?'との一致':'alignment')+'\n';
      reviewerMd+='3. **'+(G?'セキュリティ':'Security')+'**: docs/08_security.md '+(G?'のチェックリスト確認':'checklist verification')+'\n';
      reviewerMd+='4. **'+(G?'テストカバレッジ':'Test Coverage')+'**: ≥80%\n\n';

      reviewerMd+=(G?'## 入力':'## Input')+'\n\n';
      reviewerMd+='- '+(G?'変更されたコードファイル':'Modified code files')+'\n';
      reviewerMd+='- .spec/specification.md\n';
      reviewerMd+='- docs/32_qa_blueprint.md\n';
      reviewerMd+='- docs/37_bug_prevention.md\n\n';

      reviewerMd+=(G?'## 判断基準':'## Judgment Criteria')+'\n\n';
      reviewerMd+='- [ ] '+(G?'全テスト PASS':'All tests PASS')+'\n';
      reviewerMd+='- [ ] '+(G?'カバレッジ ≥80%':'Coverage ≥80%')+'\n';
      reviewerMd+='- [ ] '+(G?'セキュリティ違反 0件':'0 security violations')+'\n';
      reviewerMd+='- [ ] .spec/'+(G?'整合性確認済':'consistency verified')+'\n\n';

      reviewerMd+=(G?'## 出力':'## Output')+'\n\n';
      reviewerMd+='- PASS / FAIL\n';
      reviewerMd+='- '+(G?'問題リスト（あれば）':'Issue list (if any)')+'\n';
      reviewerMd+='- '+(G?'改善提案':'Improvement suggestions')+'\n\n';

      S.files['skills/agents/reviewer.md']=reviewerMd;
    }

    // ═══ Phase 4: AGENTS.md enhancement ═══
    S.files['AGENTS.md']+=`\n\n## Pipeline Coordination\n- Pipelines: skills/pipelines.md\n- Catalog: skills/catalog.md\n- Gates: ${aiLevel==='vibe'||aiLevel==='agentic'?'human':'auto'}\n- Error: docs/25 → retry → escalate\n- Context: AI_BRIEF.md only\n`;
  }
}

// ═══ Phase 4: Helper Functions for CLAUDE.md 3-Layer Split ═══

function genThinCLAUDE(a,pn,auth,forbidden,G,arch,domainRisksMd){
  const fe=a.frontend||'React';
  const be=a.backend||'Node.js + Express';
  const db=a.database||'PostgreSQL';
  const archNote=G?{
    baas:'BaaS統合パターン',
    bff:'BFF パターン',
    split:'フロント/バック分離',
    traditional:'従来型'
  }[arch.pattern]:{
    baas:'BaaS Integration',
    bff:'BFF Pattern',
    split:'FE/BE Split',
    traditional:'Traditional'
  }[arch.pattern];
  const devMethods=a.dev_methods||'TDD';

  return `# ${pn} ${G?'— 開発ルール':'— Development Rules'}

## ${G?'概要':'Overview'}
- **${G?'スタック':'Stack'}**: ${fe} + ${be} + ${db}
- **${G?'アーキテクチャ':'Architecture'}**: ${archNote}
- **${G?'認証':'Auth'} SoT**: ${auth.sot}
- **${G?'開発手法':'Methods'}**: ${devMethods}

## ${G?'必須ルール':'Critical Rules'}

### ${G?'禁止事項':'Forbidden'}
${forbidden}
${domainRisksMd}

### ${G?'認証の唯一の情報源':'Auth Source of Truth'}
${G?`すべての認証状態は ${auth.sot} から取得すること。認証ロジックを重複させない。`:`All auth state MUST come from ${auth.sot}. Never duplicate auth logic.`}

## ${G?'ルールファイル':'Rule Files'}
${G?'パス別の詳細ルールは以下を参照:':'For path-specific detailed rules, see:'}

- \`.claude/rules/spec.md\` ${G?'— 仕様駆動開発ルール':'— Spec-driven development'}
- \`.claude/rules/frontend.md\` ${G?'— フロントエンド開発ルール':'— Frontend development'}
- \`.claude/rules/backend.md\` ${G?'— バックエンド開発ルール':'— Backend development'}
- \`.claude/rules/test.md\` ${G?'— テスト手法ルール':'— Testing methodology'}
- \`.claude/rules/ops.md\` ${G?'— 運用・デプロイルール':'— Operations & deployment'}

${G?'**特定のパスで作業する際**、Claudeは関連するルールファイルを自動読み込みします。':'**When working on specific paths**, Claude will automatically load the relevant rule file.'}

## ${G?'ワークフロー':'Workflow'}
1. **${G?'機能':'Feature'}** → \`.spec/\` ${G?'確認':'check'} → ${G?'実装':'implement'} → ${G?'テスト':'test'} → ${G?'コミット':'commit'}
2. **${G?'バグ':'Bug'}** → ${G?'再現':'reproduce'} → ${G?'修正':'fix'} → ${G?'テスト':'test'} → ${G?'コミット':'commit'}
3. **${G?'常に':'Always'}** → ${G?'コミット前にテスト実行':'Run tests before commit'}

## ${G?'クイックリファレンス':'Quick Reference'}
- ${G?'仕様ディレクトリ':'Spec Dir'}: \`.spec/\`
- ${G?'ドキュメント':'Docs Dir'}: \`docs/\`
- ${G?'テストコマンド':'Test Command'}: \`npm test\`
- ${G?'ビルドコマンド':'Build Command'}: \`npm run build\`
`;
}

function genSpecRules(G,fileSelectionMatrix,domainCtx){
  return `---
paths:
  - ".spec/**"
alwaysApply: false
---

# ${G?'仕様駆動開発ルール':'Spec-Driven Development Rules'}

## ${G?'ファイル選択マトリクス':'File Selection Matrix'}
| ${G?'タスク種別':'Task Type'} | ${G?'読むファイル':'Read Files'} | ${G?'書くファイル':'Write Files'} |
|-----------|------------|-------------|
| ${G?'機能企画':'Feature Planning'} | constitution, specification | specification, technical-plan |
| ${G?'アーキテクチャ設計':'Architecture Design'} | specification, technical-plan | technical-plan, tasks |
| ${G?'タスク分解':'Task Breakdown'} | specification, technical-plan, tasks | tasks, verification |
| ${G?'実装':'Implementation'} | ${G?'すべての.specファイル':'All .spec files'} | ${G?'(コードファイル、.specは書かない)':'(Code files, not .spec)'} |
| ${G?'検証':'Verification'} | verification | ${G?'verification (ステータス更新)':'verification (update status)'} |

## ${G?'仕様整合性ルール':'Spec Integrity Rules'}
1. **constitution ${G?'は不変':'is immutable'}** — ${G?'初回作成後は編集しない':'Never edit after initial creation'}
2. **specification ${G?'が真実の源':'is source of truth'}** — ${G?'すべての機能をここで最初に定義':'All features defined here first'}
3. **technical-plan ${G?'は specification と一致':'must match specification'}** — ${G?'仕様なしに実装しない':'No implementation without spec'}
4. **tasks ${G?'は specification を参照':'must reference specification'}** — ${G?'すべてのタスクは要件にリンク':'Every task links to requirements'}
5. **verification ${G?'は specification を検証':'validates specification'}** — ${G?'受入基準に対してテスト':'Test against acceptance criteria'}

## ${G?'ワークフロー':'Workflow'}
\`\`\`mermaid
graph LR
  A[${G?'機能要求':'Feature Request'}] --> B[${G?'specification更新':'Update specification'}]
  B --> C[${G?'technical-plan更新':'Update technical-plan'}]
  C --> D[${G?'tasks生成':'Generate tasks'}]
  D --> E[${G?'実装':'Implement'}]
  E --> F[${G?'verification更新':'Update verification'}]
\`\`\`

## ${G?'タスク別推奨ファイル':'Task-Specific Recommended Files'}
${fileSelectionMatrix}
${domainCtx}
`;
}

function genFrontendRules(fe,G){
  const frameworkKey=fe.includes('React')?'react':fe.includes('Vue')?'vue':fe.includes('Svelte')?'svelte':'react';
  const rules={
    react:{
      conventions_ja:['関数コンポーネント + Hooks','Props分割代入','コンポーネントはdefault exportを避ける'],
      conventions_en:['Functional components + hooks','Props destructuring','Avoid default exports for components'],
      state_ja:'グローバル状態はContext API、ローカルはuseState/useReducer',
      state_en:'Context API for global state, useState/useReducer for local',
      styling_ja:'CSS ModulesまたはTailwind、インラインスタイル避ける',
      styling_en:'CSS Modules or Tailwind, avoid inline styles',
      patterns_ja:['再利用ロジックはカスタムフック','エラーハンドリングはError Boundary','遅延ロードはSuspense'],
      patterns_en:['Custom hooks for reusable logic','Error boundaries for error handling','Suspense for lazy loading']
    },
    vue:{
      conventions_ja:['Composition API (Vue 3)','script setupシンタックス','単一ファイルコンポーネント'],
      conventions_en:['Composition API (Vue 3)','Script setup syntax','Single-file components'],
      state_ja:'グローバル状態はPinia、ローカルはreactive()',
      state_en:'Pinia for global state, reactive() for local',
      styling_ja:'SFC内でscoped styles',
      styling_en:'Scoped styles in SFC',
      patterns_ja:['再利用ロジックはComposables','深いpropsはprovide/inject','モーダルはTeleport'],
      patterns_en:['Composables for reusable logic','Provide/inject for deep prop passing','Teleport for modals']
    },
    svelte:{
      conventions_ja:['リアクティブ宣言','プロップスの型定義','ストアでグローバル状態'],
      conventions_en:['Reactive declarations','Type props','Stores for global state'],
      state_ja:'グローバル状態はストア、ローカルはlet',
      state_en:'Stores for global state, let for local',
      styling_ja:'コンポーネント内でscoped styles',
      styling_en:'Scoped styles in component',
      patterns_ja:['再利用ロジックはアクション','スロットで構成','トランジションAPI'],
      patterns_en:['Actions for reusable logic','Slots for composition','Transition API']
    }
  };
  const r=rules[frameworkKey];

  return `---
paths:
  - "src/components/**"
  - "app/**"
  - "pages/**"
alwaysApply: false
---

# ${G?'フロントエンド開発ルール':'Frontend Development Rules'} (${fe})

## ${G?'規約':'Conventions'}
${(G?r.conventions_ja:r.conventions_en).map(c=>'- '+c).join('\n')}

## ${G?'状態管理':'State Management'}
${G?r.state_ja:r.state_en}

## ${G?'スタイリング':'Styling'}
${G?r.styling_ja:r.styling_en}

## ${G?'パターン':'Patterns'}
${(G?r.patterns_ja:r.patterns_en).map(p=>'- '+p).join('\n')}

## ${G?'テスト':'Testing'}
- ${G?'ユーティリティのユニットテスト: Vitest':'Unit tests for utilities: Vitest'}
- ${G?'コンポーネントテスト: Testing Library':'Component tests: Testing Library'}
- ${G?'E2Eテスト: Playwright':'E2E tests: Playwright'}
`;
}

function genBackendRules(arch,be,beRaw,G,orm){
  // Detect BFF from backend string if arch didn't catch it
  const isBFF=arch.pattern==='bff'||beRaw.includes('API Routes')||beRaw.includes('API routes');

  if(arch.isBaaS){
    return `---
paths:
  - "src/lib/**"
  - "supabase/**"
  - "app/**/actions.ts"
alwaysApply: false
---

# ${G?'バックエンドルール':'Backend Rules'} (BaaS: ${be})

## ${G?'アーキテクチャパターン':'Architecture Pattern'}
- **BaaS ${G?'統合':'Integration'}**: ${G?'別のExpressサーバーなし':'No separate Express server'}
- **Server Actions**: ${G?'Next.js Server Actionsをミューテーションに使用':'Use Next.js Server Actions for mutations'}
- **RLS**: ${G?'すべてのテーブルに行レベルセキュリティポリシー':'Row-Level Security policies for ALL tables'}
- **${G?'認証':'Auth'}**: ${be} ${G?'が認証を処理':'handles authentication'}

## ${G?'データベースルール':'Database Rules'}
1. **${G?'アプリケーションコードに生SQLなし':'No raw SQL in application code'}** — ${be} ${G?'のクライアントメソッド使用':'client methods'}
2. **${G?'OK: マイグレーションのDDL/RLS':'OK: DDL/RLS in migrations'}** — \`supabase/migrations/*.sql\`
3. **${G?'すべてのテーブルにRLS必須':'All tables MUST have RLS'}** — ${G?'有効化してポリシー定義':'Enable and define policies'}
4. **${G?'外部キー必須':'Foreign keys required'}** — ${G?'参照整合性を維持':'Maintain referential integrity'}

## ${G?'セキュリティ':'Security'}
- ${G?'Service roleキーはサーバーサイドのみ':'Service role key ONLY in server-side code'}
- ${G?'Anonキーはクライアントサイド可':'Anon key OK for client-side'}
- ${G?'Service roleをクライアントに公開しない':'Never expose service role to client'}
- ${G?'Server Actionsですべての入力を検証':'Validate all inputs in Server Actions'}
`;
  }else if(isBFF){
    return `---
paths:
  - "app/api/**"
  - "src/lib/**"
alwaysApply: false
---

# ${G?'バックエンドルール':'Backend Rules'} (BFF: ${beRaw})

## ${G?'アーキテクチャパターン':'Architecture Pattern'}
- **BFF (Backend For Frontend)**: ${G?'Next.js API Routesを統合':'Next.js API Routes integration'}
- **${G?'別サーバーなし':'No separate server'}**: ${G?'すべてAPI Routesで処理':'Handle all via API Routes'}
- **${G?'ミドルウェア':'Middleware'}**: ${G?'認証・CORS・レート制限':'Auth, CORS, rate limiting'}

## ${G?'データベースルール':'Database Rules'}
1. **ORM ${G?'使用':'use'}**: ${orm||'Prisma ORM'}
2. **${G?'型安全':'Type safety'}**: ${G?'DB→TypeScript自動生成':'DB → TypeScript auto-generation'}
3. **${G?'マイグレーション':'Migrations'}**: ${G?'バージョン管理、ロールバック可能':'Versioned, rollbackable'}

## ${G?'セキュリティ':'Security'}
- ${G?'すべてのAPI Routesで入力検証':'Validate inputs in all API Routes'}
- ${G?'環境変数でシークレット管理':'Secrets in environment variables'}
- ${G?'CSRFトークン使用':'Use CSRF tokens'}
- ${G?'レート制限実装':'Implement rate limiting'}
`;
  }else{
    return `---
paths:
  - "src/api/**"
  - "src/routes/**"
  - "src/controllers/**"
alwaysApply: false
---

# ${G?'バックエンドルール':'Backend Rules'} (${G?'従来型':'Traditional'}: ${beRaw})

## ${G?'アーキテクチャパターン':'Architecture Pattern'}
- **${G?'クライアント-サーバー分離':'Client-Server separation'}**: ${G?'フロントとバックは別ホスト':'FE and BE on separate hosts'}
- **API ${G?'駆動':'driven'}**: RESTful ${G?'または':'or'} GraphQL
- **${G?'認証':'Auth'}**: JWT ${G?'または':'or'} session-based

## ${G?'データベースルール':'Database Rules'}
1. **ORM ${G?'使用':'use'}**: ${orm||'Prisma ORM'}
2. **${G?'生SQLなし':'No raw SQL'}** (${G?'マイグレーションは除く':'except migrations'})
3. **${G?'トランザクション':'Transactions'}**: ${G?'複数テーブル更新時は必須':'Required for multi-table updates'}
4. **${G?'接続プーリング':'Connection pooling'}**: ${G?'本番環境で必須':'Required in production'}

## ${G?'セキュリティ':'Security'}
- CORS ${G?'適切に設定':'properly configured'}
- ${G?'入力検証':'Input validation'} (Zod, Joi)
- ${G?'出力サニタイズ':'Output sanitization'}
- ${G?'レート制限':'Rate limiting'} (express-rate-limit)
- ${G?'ヘルメット使用':'Use Helmet'} (security headers)
`;
  }
}

function genTestRules(devMethods,G){
  const hasTDD=devMethods.includes('TDD');
  const hasBDD=devMethods.includes('BDD');
  const hasDDD=devMethods.includes('DDD');

  let rules=`---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "tests/**"
alwaysApply: false
---

# ${G?'テスト手法ルール':'Testing Methodology Rules'}

`;

  if(hasTDD){
    rules+=`## ${G?'テスト駆動開発 (TDD)':'Test-Driven Development (TDD)'}
1. **Red** → ${G?'失敗するテストを先に書く':'Write failing test first'}
2. **Green** → ${G?'テストを通す最小限のコード':'Write minimal code to pass'}
3. **Refactor** → ${G?'テストをグリーンに保ちながらコード改善':'Improve code while keeping tests green'}

`;
  }

  rules+=`## ${G?'テスト構造 (AAAパターン)':'Test Structure (AAA Pattern)'}
\`\`\`typescript
describe('Feature', () => {
  it('should do something', () => {
    // Arrange - ${G?'セットアップ':'Setup'}
    const input = 'test';

    // Act - ${G?'実行':'Execute'}
    const result = doSomething(input);

    // Assert - ${G?'検証':'Verify'}
    expect(result).toBe('expected');
  });
});
\`\`\`

## ${G?'カバレッジ要件':'Coverage Requirements'}
- ${G?'ユニットテスト: ≥80% カバレッジ':'Unit tests: ≥80% coverage'}
- ${G?'統合テスト: 重要パス':'Integration tests: Critical paths'}
- ${G?'E2Eテスト: ユーザージャーニー':'E2E tests: User journeys'}

## ${G?'テスト命名':'Test Naming'}
- ${G?'説明的':'Descriptive'}: \`should [${G?'期待動作':'expected behavior'}] when [${G?'条件':'condition'}]\`
- ${G?'良い例':'Good'}: \`should return 401 when user is not authenticated\`
- ${G?'悪い例':'Bad'}: \`test1\`, \`testAuth\`
`;

  return rules;
}

function genOpsRules(G){
  return `---
paths:
  - ".github/**"
  - "docs/34_*"
  - "docs/53_*"
  - "docs/54_*"
  - "docs/55_*"
alwaysApply: false
---

# ${G?'運用・デプロイルール':'Operations & Deployment Rules'}

## ${G?'参照ドキュメント':'Reference Documents'}
- **${G?'Ops Runbook':'Ops Runbook'}**: \`docs/53_ops_runbook.md\` — SLO/SLI, Feature Flags, Observability
- **${G?'Ops Checklist':'Ops Checklist'}**: \`docs/54_ops_checklist.md\` — 12 Ops Capabilities
- **${G?'Ops Plane Design':'Ops Plane Design'}**: \`docs/55_ops_plane_design.md\` — Ops Plane Architecture, Circuit Breaker, Evidence-Based Ops, Dev×Ops Separation
- **${G?'インシデント対応':'Incident Response'}**: \`docs/34_incident_response.md\` — ${G?'オンコール手順':'On-call procedures'}

## ${G?'デプロイ安全性':'Deployment Safety'}
1. **${G?'フックをスキップしない':'Never skip hooks'}** — \`--no-verify\` ${G?'は明示的承認時のみ':'only with explicit approval'}
2. **main ${G?'への強制プッシュ禁止':'force push prohibited'}** — ${G?'本番ブランチ保護':'Protect production branch'}
3. **${G?'ステージングで先にテスト':'Test in staging first'}** — ${G?'ステージング検証後に本番デプロイ':'Production after staging validation'}
4. **${G?'ロールバック計画必須':'Rollback plan required'}** — ${G?'デプロイ前に戻し方を把握':'Know how to revert before deploying'}

## ${G?'Feature Flags':'Feature Flags'} (${G?'docs/53参照':'see docs/53'})
- ${G?'段階的ロールアウトに使用':'Use for gradual rollouts'}
- ${G?'重要機能のキルスイッチ':'Kill switches for critical features'}
- ${G?'CI/CDでフラグ状態をテスト':'Test flag states in CI/CD'}

## ${G?'モニタリング':'Monitoring'} (${G?'docs/53参照':'see docs/53'})
- ${G?'SLO違反でアラート発火':'SLO violations trigger alerts'}
- ${G?'ドメイン別エラー率閾値':'Error rate thresholds by domain'}
- ${G?'デプロイターゲット別Observabilityスタック':'Observability stack per deployment target'}

## ${G?'バックアップ・リカバリ':'Backup & Recovery'} (${G?'docs/53参照':'see docs/53'})
- ${G?'ドメイン別RPO/RTO要件':'RPO/RTO requirements by domain'}
- ${G?'リストア手順を定期的にテスト':'Test restore procedures regularly'}
- ${G?'リカバリRunbookを文書化':'Document recovery runbooks'}

## ${G?'Dev × Ops 責任分離':'Dev × Ops Responsibility Separation'} (${G?'docs/55参照':'see docs/55'})
**Dev Agent ${G?'(このエージェント)':'(This Agent)'}**:
- ${G?'機能実装・テスト・コードレビュー・バグ修正':'Feature implementation, testing, code review, bug fixes'}
- ${G?'編集範囲':'Edit scope'}: \`src/\` ${G?'配下のみ':'only'}

**Ops Agent ${G?'(人間またはOps AI)':'(Human or Ops AI)'}**:
- ${G?'モニタリング・Feature Flag操作・インシデント対応・バックアップ検証':'Monitoring, Feature Flag operations, incident response, backup validation'}
- ${G?'編集範囲':'Edit scope'}: ${G?'全体 (本番環境操作含む)':'All (including production ops)'}

**${G?'共有契約':'Shared Contract'}**:
- \`.spec/constitution.md\` + \`CLAUDE.md\` + \`docs/53-55\` ${G?'を双方が参照':'referenced by both parties'}

**${G?'破壊的操作 (4-eyes 必須)':'Destructive Operations (4-eyes required)'}**:
- \`git reset --hard\`, \`git clean -f\`, \`DROP TABLE\`, \`DELETE\` ${G?'等は承認後のみ実行':'etc. Execute only after approval'}
- ${G?'参照':'Reference'}: \`.claude/settings.json\` \`requireConfirmation\` ${G?'リスト':'list'}
`;
}

