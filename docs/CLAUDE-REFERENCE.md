# CLAUDE.md Reference Documentation

This document contains detailed reference information for DevForge v9 development. See `CLAUDE.md` for core guidelines.

---

## Key Data Structures & Helper Functions

### src/generators/common.js
**Data Structures:**
- **ENTITY_COLUMNS**: 145+ entity schemas with FK/constraints (includes 4 補完: Examination, Claim, Milestone, Inventory + 14 new preset entities)
- **ENTITY_METHODS**: REST API method restrictions per entity (added 5: AuditLog, PointLog, Achievement, ClickLog, SensorData)
- **FEATURE_DETAILS**: 31 feature patterns with acceptance criteria & test cases (added 10: Social, Settings, MFA, Webhook, Onboarding, API Key, Audit, Map, Import, Template)
- **SCREEN_COMPONENTS**: UI component dictionary by screen type
- **DOMAIN_ENTITIES**: Core entities per domain with warnings & suggestions (32 domains)
- **DOMAIN_QA_MAP**: 32 domain-specific QA strategies
- **DOMAIN_PLAYBOOK**: 32 complete domain playbooks with implementation flows, compliance rules, bug prevention, context mapping, and AI skills
- **DOMAIN_GROWTH**: Growth intelligence data for 8 domains + default (funnel stages, CVR benchmarks, growth equations, levers, pricing strategies)

**Helper Functions:**
- **`pluralize(name)`** — Smart table name pluralization
- **`getEntityColumns(name, G, knownEntities)`** — Get columns for entity (ALWAYS pass 3 args)
- **`getEntityMethods(name)`** — Get allowed REST methods for entity
- **`detectDomain(purpose)`** — Infer domain from purpose text (32 domains supported)
  - Returns: 'education', 'ec', 'marketplace', 'community', 'content', 'analytics', 'booking', 'saas', 'iot', 'realestate', 'legal', 'hr', 'fintech', 'portfolio', 'tool', 'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter', 'health', 'media', 'government', 'travel', 'insurance', 'manufacturing', 'logistics', 'agriculture', 'energy', or null
  - Used by: AI skills catalog generation, domain-specific KPI/acceptance criteria, MCP tool recommendations
  - Pattern matching: regex-based on Japanese/English keywords in purpose text (specific patterns first, generic last)
- **`resolveAuth(answers)`** — Determine auth architecture from answers
- **`getScreenComponents(screenName, G)`** — Get UI components for screen type

### src/generators/p3-mcp.js
**Enhanced MCP Generation (240 lines):**
- **Backend-specific MCP servers**: Supabase, Firebase, PostgreSQL, MongoDB, Docker
- **Domain-specific tool recommendations**: Uses `detectDomain()` to suggest relevant MCP tools
- **Enhanced project-context.md**: Auth details, domain context, dev methods, generated file structure
- **tools-manifest.json**: Server list, recommendations (core/backend/domain), categories (dev/test/deploy)
- **mcp-config.json**: Environment variable placeholders for selected backends
- **.mcp/README.md**: Installation guide, usage examples, troubleshooting

### src/generators/p10-reverse.js
**Data Structures:**
- **REVERSE_FLOW_MAP**: 15 domain-specific reverse engineering templates + \_default
  - Each domain has: goal (ja/en), flow steps (ja/en), KPIs (ja/en), risks (ja/en)
  - Used by `genPillar10_ReverseEngineering()` with `detectDomain()` to select template

### src/generators/p12-security.js
**Pillar ⑫: Security Intelligence** — Context-aware security audit prompts and OWASP 2025 compliance.

**Data Structures:**
- **OWASP_2025**: 10-item security checklist database (A01-A10)
  - Each item has: id, ja/en labels, checks (ja/en), stack-specific checks
  - Stack adapters: supabase, firebase, express, github, npm, vercel, docker
- **COMPLIANCE_DB**: 7 compliance frameworks (PCI DSS, HIPAA, GDPR, ISMAP, SOC 2, FERPA, ASVS)
  - Each framework: name, applicable domains, requirements (ja/en), implementation guidance
- **STRIDE_PATTERNS**: Threat scoring patterns (hasUserId, isPayment, isPublic, hasFile, default)

**Helper Functions:**
- **`_chk(ja, en)`** — Generate checkbox markdown
- **`_lvl(lv)`** — Security level label (CRITICAL → 🔴 Critical)
- **`_owaspSection(item, backend)`** — Generate OWASP section with stack checks
- **`_compSection(comp, G)`** — Generate compliance framework section

### src/generators/p13-strategy.js
**Pillar ⑬: Strategic Intelligence** — Industry-specific strategic intelligence for 32 industries.

**Data Structures:**
- **INDUSTRY_INTEL**: 33 entries (32 industries + \_default)
  - **24 original domains:** education, ec, marketplace, community, content, analytics, booking, saas, portfolio, tool, iot, realestate, legal, hr, fintech, health, ai, automation, event, gamify, collab, devtool, creator, newsletter
  - **8 new industries:** manufacturing, logistics, agriculture, energy, media, government, travel, insurance
  - Each entry has: reg (regulations, ja/en), arch (architecture patterns, ja/en), fail (failure factors, ja/en), trend (2026-2030 trends, ja/en), bm (business models, ja/en)
  - Covers compliance requirements, recommended architectures, common pitfalls, technology trends, and revenue models
- **STAKEHOLDER_STRATEGY**: 4 stakeholder types (startup, enterprise, developer, team)
  - Each type has: phases (ja/en), debt_mgmt (technical debt management, ja/en), team (team composition, ja/en), budget (allocation guidance, ja/en)
- **OPERATIONAL_FRAMEWORKS**: 4 operational excellence dimensions (original)
  - tech_debt: Classification and SQALE approach (ja/en)
  - dr_bcp: RTO/RPO targets and 3-2-1 backup (ja/en)
  - green_it: Framework-specific energy efficiency (ja/en)
  - team_design: Conway's Law and Two-Pizza Team (ja/en)
- **OPERATIONAL_FRAMEWORKS_EXT**: 4 extended operational frameworks (new)
  - ai_ethics: Fairlearn/AIF360, SHAP/LIME, HITL, EU AI Act compliance (ja/en)
  - zero_trust: BeyondCorp 7 principles, IAM+FIDO2, micro-segmentation, EDR/XDR (ja/en)
  - data_governance: DataHub/Amundsen, Great Expectations, dynamic masking, data mesh (ja/en)
  - globalization: i18n/l10n, Unicode/RTL, Locize/Phrase, data residency (ja/en)
- **EXTREME_SCENARIOS**: 6 advanced implementation patterns
  - break_glass: Emergency access (OPA/Rego, ABAC) for health/government
  - k_anonymity: De-identification pipeline for health/hr/fintech
  - geo_partition: Data residency (CockroachDB/YugabyteDB) for fintech/ec/saas/health/government
  - carbon_aware: Carbon-aware scaling (KEDA) for manufacturing/energy/ec/analytics
  - post_quantum: ML-KEM (Kyber) + DID for fintech/government/legal
  - strangler_fig: Legacy migration (Nginx traffic split) for all domains
- **PRAGMATIC_SCENARIOS**: 5 high-impact implementation patterns
  - disposable_arch: Pre-PMF speed (Supabase RLS) for startups
  - ai_hitl: Human-in-the-loop (LangChain) for teams
  - small_data_stack: Mid-size enterprise DX (Fivetran→Snowflake→dbt) for enterprises
  - silver_tech: Elderly-friendly (FIDO2, LINE, VUI) for teams
  - dora_platform: DORA metrics + Backstage for enterprises
- **TECH_RADAR_BASE**: Technology classification matrix
  - frontend/backend/infrastructure/ai: Adopt/Trial/Assess/Hold classification
  - domain-specific: Technology recommendations per industry

**Helper Functions:**
- **`_si(reg_ja,reg_en, arch_ja,arch_en, fail_ja,fail_en, trend_ja,trend_en, bm_ja,bm_en)`** — Compression helper for INDUSTRY_INTEL entries
- **`detectIndustry(purpose)`** — Extended industry detection (32 industries: uses `detectDomain()` first, then checks 8 new industries via regex patterns)
- **`detectStakeholder(target)`** — Infer stakeholder type from target answer (startup, enterprise, developer, team)
- **`genPillar13_StrategicIntelligence(a, pn)`** — Generates 5 strategic documents:
  - docs/48_industry_blueprint.md — Industry-specific regulations, architectures, failure factors, business models
  - docs/49_tech_radar.md — 2026-2030 technology trends with Adopt/Trial/Assess/Hold classification
  - docs/50_stakeholder_strategy.md — Phase-based development strategies for stakeholder type
  - docs/51_operational_excellence.md — Technical debt management, DR/BCP, Green IT, team design (4 original frameworks)
  - docs/52_advanced_scenarios.md — Extended frameworks (AI ethics, zero trust, data governance, globalization), extreme scenarios (filtered by domain), pragmatic scenarios (filtered by stakeholder)

**Integration:**
- Uses `detectIndustry()` (extends `detectDomain()` with 8 new industries) to select industry-specific intelligence from INDUSTRY_INTEL
- Uses `detectStakeholder()` to customize development strategy based on target audience
- Cross-references with Pillar ⑫ Security Intelligence (docs/45 compliance matrix)
- Integrates with tech stack selection for architecture recommendations
- Filters extreme scenarios by detected domain/industry
- Filters pragmatic scenarios by detected stakeholder type

### src/core/i18n.js
- **`t(key)`** — Get translated string for current `S.lang`
- **`I18N`** — Translation dictionary (ja/en)

### src/ui/wizard.js
- **`isQActive(q)`** — Check if question's condition is met (centralizes conditional question evaluation)
- **`updProgress()`** — Update progress bar and sidebar (only counts active questions)
- **`showQ()`** — Display current question (skips inactive conditional questions)
- **`findNext()`** — Find next unanswered question (respects conditions)

**Conditional Questions:**
Questions can have a `condition` field that determines if they should be shown:
```javascript
{
  id: 'orm',
  condition: {
    backend: (v) => !['Firebase', 'Supabase', 'Convex', 'static', 'None'].includes(v)
  }
  // Only shown when backend is NOT a BaaS or static
}
```

**Critical:** When working with wizard questions:
- Use `isQActive(q)` to check if question should be shown/counted
- Progress counting must exclude inactive questions (`if(!isQActive(q))return;`)
- UI styling: inactive questions get `.q-na` class (opacity:0.3, line-through)
- Affected questions: `database`, `orm`, `data_entities`, `auth`, `ai_tools`

---

## Generated Output (118+ files)

When users complete the wizard, DevForge generates **118+ files** (base: 90 files, +4 when ai_auto=multi/full/orch for skills/ Package, +1 when payment≠none for docs/38_business_model.md, +3 for P14 ops docs, +4 for P15 future strategy docs, +4 for P16 dev IQ docs, +6 for .claude/ structure):

### Core Specifications
- **.spec/** — constitution.md, specification.md, technical-plan.md, tasks.md, verification.md

### Development Environment
- **.devcontainer/** — devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh
- **.gitattributes** — Line ending normalization (enforces LF, prevents Windows CRLF issues)
- **.editorconfig** — Editor settings standardization (indent, line endings, charset)

### Documentation (52 files)
- **docs/** — architecture.md, ER.md, API.md, screen.md, test-cases.md, security.md, release.md, WBS.md, prompt-playbook.md, tasks.md
- **progress.md (24)** — Project tracking
- **error_logs.md (25)** — Error management
- **design_system.md (26)** — v2: Visual Enhancement Dictionary, Figma MCP, Anti-AI Checklist
- **sequence_diagrams.md (27)** — Interaction flows
- **qa_strategy.md (28)** — Quality assurance
- **reverse_engineering.md (29)** — Goal decomposition
- **goal_decomposition.md (30)** — Task breakdown
- **industry_playbook.md (31)** — Domain best practices
- **qa_blueprint.md (32)** — Testing framework
- **test_matrix.md (33)** — Test coverage
- **incident_response.md (34)** — Error handling
- **sitemap.md (35)** — Site structure
- **test_strategy.md (36)** — Testing approach
- **bug_prevention.md (37)** — Proactive QA
- **business_model.md (38)*** — Revenue strategy (when payment ≠ none)
- **implementation_playbook.md (39)** — Dev guidelines
- **ai_dev_runbook.md (40)** — AI-assisted development
- **growth_intelligence.md (41)** — Growth strategies
- **skill_guide.md (42)** — Manus Skills integration
- **security_intelligence.md (43)** — OWASP 2025 adaptive audit
- **threat_model.md (44)** — STRIDE analysis
- **compliance_matrix.md (45)** — Domain-specific compliance
- **ai_security.md (46)** — Context-aware adversarial prompts
- **security_testing.md (47)** — RLS/Rules tests, Zod schemas
- **industry_blueprint.md (48)** — Industry-specific regulations, architectures, failure factors, business models
- **tech_radar.md (49)** — 2026-2030 technology trends (Adopt/Trial/Assess/Hold classification)
- **stakeholder_strategy.md (50)** — Phase-based development strategies for stakeholder type
- **operational_excellence.md (51)** — Technical debt management, DR/BCP, Green IT, team design
- **advanced_scenarios.md (52)** — Extreme & pragmatic scenarios for edge case planning
- **ops_runbook.md (53)** — Ops Plane design (Feature Flags, SLO/SLI, Observability, Jobs, Backup, Rate Limiting)
- **ops_checklist.md (54)** — Day-1 ops readiness checklist (12 Ops Capabilities Matrix)
- **ops_plane_design.md (55)** — Ops Plane Architecture (12 Ops Capabilities impl patterns, Circuit Breaker, Evidence-Based Ops)
- **market_positioning.md (56)** — Market positioning & competitive intelligence (MOAT analysis, GTM strategy, unit economics)
- **user_experience_strategy.md (57)** — User experience & retention strategy (personas, user journeys, accessibility, digital wellbeing)
- **ecosystem_strategy.md (58)** — Ecosystem & platform strategy (API-as-product, DX, FinOps, community strategy)
- **regulatory_foresight.md (59)** — Regulatory foresight & sustainability (2026-2030 horizon, EU AI Act, ESG metrics)
- **methodology_intelligence.md (60)** — Optimal development methodology selection (12 design approaches, domain-specific fit evaluation)
- **ai_brainstorm_playbook.md (61)** — AI brainstorming prompts (6 phases × project-specific templates, Polymorphic Engine framework)
- **industry_deep_dive.md (62)** — Industry-specific deep dive (15 industries: regulations, tech stacks, pitfalls, architecture patterns)
- **next_gen_ux_strategy.md (63)** — Next-generation UX strategy (Polymorphic Engine: Agentic Workflow, Generative UI, Spatial Computing, Calm Technology)
- **cross_platform_guide.md (64)** — Cross-platform development guide (line ending normalization, .editorconfig, DevContainer, BaaS dev environment modes)

### AI Rules & Skills
- **AI rules** — CLAUDE.md (with File Selection Matrix & Context Compression Protocol), AI_BRIEF.md (with Context Loading Strategy, ~1200 tokens), .cursorrules, .clinerules, .windsurfrules, AGENTS.md (with Agent Specialization Matrix), .cursor/rules
- **skills/** (when ai_auto ≠ None) — project.md, factory.md, catalog.md*, pipelines.md*, README.md**, skill_map.md**, agents/coordinator.md**, agents/reviewer.md**

### CI/CD
- **.github/workflows/ci.yml**

\* Generated when ai_auto ≠ None
\*\* Generated when ai_auto = multi/full/orch

### Key Features

**docs/41_growth_intelligence.md** (always generated):
- 7 sections: Stack Compatibility Score, Domain Growth Funnel, Growth Equation, Growth Levers, Pricing Strategy (松竹梅), Performance Budget, Related Documents
- Integrates calcSynergy() for 5-dimension tech stack analysis
- Domain-specific funnels with CVR benchmarks (8 domains: ec, saas, education, fintech, booking, community, marketplace + default)
- Mermaid funnel diagrams with stage-by-stage conversion rates
- Growth equations tailored to business domain (e.g., MRR = Signups × Activation × Paid_CVR × ARPU - Churn)
- 5 prioritized growth levers per domain
- 3-tier pricing strategy with behavioral economics (compromise effect, anchoring)
- Core Web Vitals targets with business impact metrics
- Framework-specific performance optimization tips (Next.js, Vue/Nuxt, SPA)

**Skills System (Manus Skills Integration):**

**skills/project.md** (always generated):
- 5 core skills: spec-review, code-gen, test-gen, doc-gen, refactor
- Factory Template for creating custom skills
- Each skill has: Role, Purpose, Input, Judgment, Output, Next

**skills/catalog.md** (when ai_auto ≠ None):
- 4 core development skills (Planning, Design, Production, Operations)
- 2-4 domain-specific skills per domain (15 domains: education, ec, saas, community, booking, health, marketplace, content, analytics, business, iot, realestate, legal, hr, fintech)
- 19 detailed skills with Input/Process/Output (14 core skills + 5 domain-specific skills)
- Advanced skills for Multi-Agent/Full Autonomous levels (including Auto Code Review and Auto Doc Update)

**skills/pipelines.md** (when ai_auto ≠ None):
- 1-5 autonomous pipelines based on ai_auto level (vibe/agentic/multi/full/orch)
- Feature Development, Bug Fix, Release, CI/CD Integration pipelines
- Mermaid flowcharts for each pipeline
- Decision gates and error handling protocols

**Security Intelligence System (Pillar ⑫):**

**docs/43_security_intelligence.md** (always generated):
- OWASP Top 10 2025 adaptive audit checklist (stack-specific checks for Supabase/Firebase/Express)
- Security Headers configuration (CSP with nonce, HSTS, X-Frame-Options)
- Shared Responsibility Model (BaaS vs self-hosted)
- Secrets Management (3-tier: dev/.env.local, CI/CD/GitHub Secrets, prod/Secrets Manager)
- Authentication & Session Security (auth.sot-specific: Supabase Auth, Firebase Auth, NextAuth, custom JWT)

**docs/44_threat_model.md** (always generated):
- System overview with trust boundaries (Mermaid flowchart)
- STRIDE threat analysis per entity (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation)
- Entity security classification (CRITICAL/HIGH/MED/STD based on columns)
- Attack surface analysis (external input points, high-risk features)
- Threat-Mitigation matrix with implementation status

**docs/45_compliance_matrix.md** (always generated):
- Domain-specific compliance frameworks (PCI DSS for fintech/ec, HIPAA for health, FERPA for education, GDPR for all, etc.)
- Requirement checklists with implementation guidance
- Always includes OWASP ASVS Level 2 as baseline

**docs/46_ai_security.md** (always generated):
- 5 base context-aware adversarial prompts (authorization, input validation, error handling, secrets, session)
- Conditional stack-specific prompts (Supabase RLS audit, Firebase Security Rules audit)
- Conditional compliance-specific prompts (references docs/45)
- AI development risks (Velocity Paradox, Package Hallucination, Shadow Code)
- Agent security patterns (HITL gates, sandboxing, indirect prompt injection defense)
- Privacy mode settings for AI development tools

**docs/47_security_testing.md** (always generated):
- RLS Policy Tests (pgTAP for Supabase)
- Input Validation Schemas (Zod with entity-specific constraints)
- API Security Tests (auth bypass, IDOR, rate limiting)
- OWASP ZAP CI/CD integration
- Penetration testing checklist

**Context-Aware Prompt Pattern:**
The adversarial prompts in doc46 adapt to project context:
1. **Entity Security Classification**: Analyzes columns to classify as CRITICAL/HIGH/MED/STD
   - Payment/Order/Transaction entities → CRITICAL
   - Entities with user_id → HIGH
   - Entities with file columns → MED
   - Others → STD
2. **Backend-Specific Context**:
   - Supabase: RLS policy audit prompt with table list
   - Firebase: Security Rules audit prompt with collection list
   - Express: Middleware audit prompt
3. **Compliance-Specific Context**:
   - Detects applicable frameworks via domain (education→FERPA, fintech→PCI DSS)
   - Adds compliance audit prompt referencing docs/45
4. **Stack-Specific Details**:
   - Environment variables (SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, etc.)
   - Auth implementation details (auth.sot, tokenType, tokenVerify)
   - Entity columns for input validation

**Integration:**
- **AI Prompt Launcher** (launcher.js): Security Audit template uses OWASP 2025 + refs docs/43-47
- **Prompt Playbook** (docs.js): Phase 3-3 Security Audit section added

---

## Adding New Pillars

Adding a new pillar (like Pillar ⑩ Reverse Engineering) requires coordinated changes across 10+ files:

### 1. Create Generator (`src/generators/pN-name.js`)
```javascript
function genPillarN_Name(a, pn) {
  const G = S.genLang === 'ja';
  // Use detectDomain() if domain-specific
  const domain = detectDomain(a.purpose) || '_default';

  // Generate files
  S.files['docs/XX_filename.md'] = content;
}
```

### 2. Register in Build System
- **`build.js`**: Add to `jsFiles` array (order matters!)
- **`src/generators/index.js`**: Add step to `steps` array
- Update header comment: `/* ═══ FILE GENERATION ENGINE — N PILLARS ═══ */`

### 3. Update UI & i18n
- **`src/core/i18n.js`**: Add pillar name to `pillar` arrays (ja/en), update `heroDesc` counts
- **`src/core/init.js`**: Add to `pbJa`/`pbEn` arrays, update `if(i<N)` guard, update `icJa`/`icEn` text
- **`src/ui/preview.js`**:
  - Add `else if(i===N)` in `initPillarTabs()`
  - Add `else if(pillar===N)` in `buildFileTree()`
- **`src/ui/dashboard.js`**: Add to `pillarChecks` array, add color to `pillarColors`
- **`src/ui/templates.js`**: Update help modal (overview, pillars section, guide section), update all file counts

### 4. Update Documentation
- **`devforge-v9-usage-guide.html`**: Update stats and file counts
- **`CLAUDE.md`**: Update module count, generator list, file count, generated output section
- **`README.md`** (if exists): Update pillar count

### 5. Add Tests
- **`test/snapshot.test.js`**:
  - `eval()` the new generator file
  - Call `genPillarN_Name()` in `generate()` function
  - Add file existence tests
  - Add content validation tests
  - Update file count range
- **`test/build.test.js`**: Update pillar consistency test

### 6. Size Budget Check
- Estimate new generator size (~10-20KB typical)
- Run `node build.js --report` to verify ≤2000KB
- Current budget remaining: ~778KB

**Reference Implementations:**
- Pillar ⑩ (Reverse Engineering): Domain-specific goal decomposition with REVERSE_FLOW_MAP
- Pillar ⑫ (Security Intelligence): Context-aware prompts with conditional stack/compliance sections

---

## Compression Patterns (Critical for Size Management)

To stay under 1200KB limit, the codebase uses compression patterns:

### 1. Preset Defaults (`src/data/presets.js`)
```javascript
// Default values shared by most presets
const _PD = {
  frontend: 'React + Next.js',
  backend: 'Supabase',
  mobile: 'none',
  ai_auto: 'none',
  payment: 'none'
};

// Helper merges defaults with preset-specific values
function _mp(p) { return Object.assign({}, _PD, p); }

// Usage: Only specify values that differ from defaults
const PR = {
  saas: _mp({
    name: 'SaaSアプリ',
    features: [...],
    payment: 'stripe'  // Override default
    // frontend, backend, mobile, ai_auto inherit from _PD
  })
};
```

⚠️ **When adding presets:** Use `_mp()` and only specify non-default fields to save ~200 bytes per preset.

### 2. Common Entity Columns (`src/generators/common.js`)
```javascript
// Reusable column definitions (used 50+ times across entities)
const _U = 'user_id:UUID:FK(User) NOT NULL:ユーザーID:User ID';
const _SA = "status:VARCHAR(20):DEFAULT 'active':ステータス:Status";
const _SD = "status:VARCHAR(20):DEFAULT 'draft':ステータス:Status";
const _T = 'title:VARCHAR(255):NOT NULL:タイトル:Title';
const _D = 'description:TEXT::説明:Description';

// Usage in ENTITY_COLUMNS
const ENTITY_COLUMNS = {
  Post: [_U, _T, _D, _SA],  // Reuses common columns
  Comment: [_U, 'post_id:UUID:FK(Post) NOT NULL:...', _D, _SA]
};
```

⚠️ **When adding entities:** Check if columns match existing constants (\_U, \_SA, \_SD, \_T, \_D, etc.) to maintain compression.

---

## Writing Tests

### Snapshot/Regression Test Pattern
See `test/r28-regression.test.js` for reference:

```javascript
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// Load all required modules
const S = {answers:{}, skill:'intermediate', lang:'ja', genLang:'ja', /* ... */};
const save=()=>{}; const _lsGet=()=>null; const _lsSet=()=>{}; const _lsRm=()=>{};
eval(fs.readFileSync('src/data/questions.js', 'utf-8'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8'));
// ... load other dependencies

function gen(answers, name, lang) {
  S.files = {}; S.genLang = lang || 'ja';
  S.answers = answers;
  genPillar1_SDD(answers, name);
  genPillar2_DevContainer(answers, name);
  // ... call all generators
  return { ...S.files };
}

test('should generate correct structure', () => {
  const files = gen({
    purpose: 'Test App',
    frontend: 'React + Next.js',
    backend: 'Supabase',
    data_entities: 'User, Post',
    mvp_features: 'User auth, Posts',
    // ... full answers
  }, 'TestProject');

  assert.ok(files['.spec/constitution.md']);
  assert.match(files['.spec/constitution.md'], /Test App/);
});
```

### Unit Test Pattern
For isolated functions:
```javascript
const { pluralize } = require('../src/generators/common.js');
test('pluralize', () => {
  assert.equal(pluralize('User'), 'users');
  assert.equal(pluralize('Category'), 'categories');
});
```

---

## Test Architecture (Detailed)

| File | Tests | Purpose |
|------|-------|---------|
| gen-coherence.test.js | 1 | Full LMS generation + structural validation + post-generation audit (C2-C10) |
| snapshot.test.js | 154 | 6 scenario regression (LMS/Blog/EC/English/PropertyMgmt/Helpdesk) + P12-P25 docs existence, context engineering, skills, quality files |
| data-coverage.test.js | 38 | Data integrity: entity coverage, FK validation, domain detection (32 domains), DOMAIN_OPS/MARKET, P19 entity tests |
| r27-regression.test.js | 17 | Bug fixes: prices, FK, KPI, ports |
| r28-regression.test.js | 19 | Quality: REST methods, AC, scope_out, verification |
| build.test.js | 37 | Build size ≤3000KB, pillar function existence (P1-P25), sbPillarGrid, PILLAR array lengths, tour steps, i18n kb sync |
| compat.test.js | 1 | Compatibility validation (136 rules: 22 ERROR, 83 WARN, 31 INFO) + calcSynergy unit tests |
| security.test.js | 29 | Security: CSP, SRI, sanitization, XSS prevention, proto pollution, .claude/settings.json safety |
| ops.test.js | 15 | Ops Intelligence (P14): runbook, checklist, ops plane design, SLO adaptation, observability, circuit breaker |
| future.test.js | 16 | Future Strategy (P15): DOMAIN_MARKET, PERSONA_ARCHETYPES, GTM_STRATEGY, REGULATORY_HORIZON, docs 56-59 |
| deviq.test.js | 20 | Dev IQ (P16): DEV_METHODOLOGY_MAP (32 domains), PHASE_PROMPTS, INDUSTRY_STRATEGY, NEXT_GEN_UX, docs 60-63 |
| promptgenome.test.js | 22 | Prompt Genome (P17): CRITERIA_FRAMEWORK (8 axes), AI_MATURITY_MODEL (3 Lv), _APPROACHES (12), docs 65-68 |
| promptops.test.js | 22 | Prompt Ops (P18): REACT_PROTOCOL (6 phases × 4 stages), LLMOPS_STACK (3 Lv), PROMPT_LIFECYCLE (5 stages), docs 69-72 |
| enterprise.test.js | 27 | Enterprise (P19): ENTERPRISE_ARCH_PATTERNS (4), WORKFLOW_TEMPLATES (5), docs 73-76, domain skip logic |
| cicd.test.js | 30 | CI/CD (P20): PIPELINE_STAGES (9), DEPLOY_STRATEGIES (4), QUALITY_GATES (5), RELEASE_MODELS (3), docs 77-80 |
| skill-level.test.js | 33 | 7-Level Skill System: SKILL_NAMES (7), pickSkillLv, Lv0/Lv2/Lv4/Lv6 behaviors, db_intelligence/ai_safety/test_intel templates |
| presets.test.js | 4 | Preset count (48 standard), bilingual names, tech fields, purpose |
| field-presets.test.js | 56 | Field preset system: PR_FIELD=138, FIELD_CAT_MAP=138, FIELD_CATS=35, FIELD_TREND=34, THEME_OVERLAYS=6 |
| gen-quality.test.js | 239 | Suites 1-23: generation quality across all pillars (P1-P25), ORM/Auth/Payment coherence |
| phase-n.test.js | 93 | N-1〜N-9 preset→wizard auto-fill + G-1〜G-7 skill/deadline/learning-path inference |
| complexity.test.js | 16 | Complexity scoring, getComplexityMini, risk thresholds |
| mermaid.test.js | 14 | Mermaid diagram syntax validation across 10+ diagram types |
| utils.test.js | 43 | Utility functions: esc, escAttr, sanitize, fileSlug, sanitizeName, _jp, _lsGet |
| Others | 25 | i18n (15), state (5), techdb (5) |

**Total: 971 tests (all passing, 100% pass rate)**

---

## AI Prompt Launcher Templates (Full List)

40 templates in `src/ui/launcher.js`. Auto-inject project context (name, stack, auth, entities).
Order: `review › arch › reverse › implement › api › i18n › test › test_intel › qa › security › ai_safety › a11y › perf › metrics › refactor › debug › incident › ops › docs › migrate › db_intelligence › cicd › growth › strategy › methodology › brainstorm › ux_journey › ux_audit › ai_model_guide › industry › nextgen › cognitive › genome › maturity › react_debug › prompt_ops › enterprise_arch › workflow_audit › risk › onboard`

**Review & Audit group:**
- 🔍 **Spec Review** — 4-step structured review (mission → requirements → architecture → consistency)
- 📐 **Architecture Compliance** — Detect layer violations, verify tech policy alignment
- 🎯 **Goal Reverse Design** — Reverse-plan from goals, gap analysis, milestone priority matrix
- 🔒 **Security Audit** — OWASP Top 10 2025 + docs/43-47 + docs/95-98 AI safety refs (✅/⚠️/❌)
- 🤖🛡️ **AI Safety Review** — EU AI Act/NIST AI RMF; 6-category risk screening, 4-layer guardrails, injection defense (P24)
- ♿ **Accessibility Audit** — WCAG 2.1 AA 4-principle check + axe-core tests
- ⚡ **Performance Optimization** — NFR comparison, bottleneck identification; refs docs/99-102 (P25)
- 📊 **Code Metrics** — Cyclomatic/cognitive complexity, coupling, DRY violations, ROI prioritization
- 🏢 **Enterprise Architecture Review** — Multi-tenant arch, RLS, org model, permission matrix (P19)
- 📋 **Workflow Process Audit** — Approval/ticket/order state machine audit, SLA compliance (P19)
- ⚖️ **Risk & Compliance** — 4-axis risk, STRIDE residual risks, regulatory compliance heatmap
- 🔬 **UX Proficiency Audit** — 7-level UX audit with project context (strategy category)

**Implement & Dev group:**
- 🚀 **MVP Implementation** — Select priority task from tasks.md, implement with types → data → logic → UI → tests
- 🔌 **API Integration Generator** — Type-safe client code; refs docs/83-86 RESTful 6-principles + OWASP API Security Top 10 (P21)
- 🌍 **i18n Implementation** — Extract strings, define keys, generate JSON, replace with t()
- 🧪 **Test Generation** — Reference docs/07 + docs/91-94; normal/error/boundary tests, coverage targets (P23)
- 🔬🧪 **Testing Strategy Intelligence** — Test pyramid, coverage 80%/75%/85%, E2E Playwright, Core Web Vitals (P23)
- 🐛 **QA/Bug Detection** — Domain-specific bug patterns, test plan, priority matrix
- ♻️ **Refactoring** — Detect SOLID violations, estimate effort (S/M/L), prioritize
- 🔧 **Debug Assistant** — Cross-reference error_logs.md, 5 Whys analysis, fix code
- 🚨 **Incident Response** — Create runbooks, post-mortems; SLO violation assessment
- 📝 **Doc Completion** — Gap analysis + generate most critical missing doc
- 🔄 **Migration Assistant** — Schema conversion scripts, validation queries; refs docs/89-90 zero-downtime patterns
- 🗄️ **DB Design Intelligence** — Schema/query/migration review; refs docs/87-90 N+1/EXPLAIN/PITR (P22)
- ⚙️ **CI/CD Intelligence Review** — 9-stage pipeline, deploy strategy, quality gates review (P20)

**Strategy & UX group:**
- 📈 **Growth Strategy** — Funnel CVR, growth levers, 3-tier pricing; refs docs/41/48/50/56
- 🏢 **Strategic Intelligence** — Industry blueprint TAM/SAM/SOM, tech radar, stakeholder strategy
- 🧬 **Optimal Methodology** — Select optimal dev methodology from DEV_METHODOLOGY_MAP (P16)
- 🎭 **9-Expert Brainstorm** — 9 expert personas generate ideas + 3-axis evaluation + cross-pollination
- 🎯 **UX Journey Design** — Lv.0-5 progressive disclosure journey + "3 Nightmares" anti-failure UI
- 🔬 **UX Proficiency Audit** — 7-level UX gap analysis with structural gap map
- 🏭 **Industry Deep Dive** — Industry-specific pitfalls, regulatory compliance, arch patterns (P16)
- 🔮 **Next-Gen UX** — Agentic Workflow/Generative UI/Spatial Computing/Calm Technology (P16)
- 🧠 **Cognitive Load Analysis** — Cognitive complexity audit + flow state simplification roadmap

**AI & Prompt group:**
- 🤖 **AI Model Selection** — Per-dev-phase AI model matching (Gemini/Claude/ChatGPT/Copilot) with natural prompt examples
- 🧩 **Prompt Genome Analysis** — CRITERIA 8-axis prompt evaluation + 4-layer composite design (P17)
- 📊 **AI Maturity Review** — 5-dimension AI maturity assessment + level-up roadmap (P17)
- 🔄 **ReAct Debug Loop** — Reason→Act→Observe→Verify autonomous debug cycle (P18)
- 🔧 **Prompt Ops Review** — Prompt Ops lifecycle + LLMOps metrics + Registry Template-ID (P18)

**Ops & DevOps group:**
- 🛡️ **Ops Readiness Review** — SLO/SLI validation, Feature Flags, circuit breaker, 12 Ops Capabilities
- 🎓 **Onboarding** — Handoff docs for new members & AI agents; CLAUDE.md summary, FAQ, .claude/rules structure

---

## Generated Output Catalog (Per-Version)

### New in v9.3.0 (Phase 4: CLAUDE.md 3-layer split + Cross-Platform)
- `.claude/rules/spec.md` — Spec-driven development rules (auto-loads for .spec/**)
- `.claude/rules/frontend.md` — Framework-specific FE rules (auto-loads for src/components/**, app/**)
- `.claude/rules/backend.md` — Architecture-aware BE rules (auto-loads for src/api/**, src/lib/**)
- `.claude/rules/test.md` — Testing methodology rules (auto-loads for **.test.*, **.spec.*)
- `.claude/rules/ops.md` — Operations & deployment rules (auto-loads for .github/**, docs/34_*, docs/53_*, docs/54_*)
- `.claude/settings.json` — Permissions, context config, dangerous command warnings
- `.gitattributes` — Line ending normalization (prevents Windows CRLF issues)
- `.editorconfig` — Editor settings standardization
- `docs/64_cross_platform_guide.md` — Cross-platform development guide

### New in v9.2.0 (Pillar ⑭)
- `docs/53_ops_runbook.md` — Ops Plane design (Feature Flags, SLO/SLI, Observability, Jobs, Backup, Rate Limiting)
- `docs/54_ops_checklist.md` — Day-1 ops readiness checklist (12 Ops Capabilities Matrix)
- `docs/55_ops_plane_design.md` — Ops Plane Architecture (12 Ops Capabilities impl patterns, Circuit Breaker, Evidence-Based Ops)
- `docs/56_market_positioning.md` — Market positioning & competitive intelligence (MOAT analysis, GTM strategy, unit economics)
- `docs/57_user_experience_strategy.md` — User experience & retention strategy (personas, user journeys, accessibility, digital wellbeing)
- `docs/58_ecosystem_strategy.md` — Ecosystem & platform strategy (API-as-product, DX, FinOps, community strategy)
- `docs/59_regulatory_foresight.md` — Regulatory foresight & sustainability (2026-2030 horizon, EU AI Act, ESG metrics)

### New in v9.3.x (Pillars ⑰⑱)
- `docs/65_prompt_genome.md` — Prompt genome analysis (CRITERIA 8-axis framework, approach scoring)
- `docs/66_ai_maturity_assessment.md` — AI maturity level assessment (3-level model: Assist/Augment/Autonomous)
- `docs/67_prompt_composition_guide.md` — Prompt composition guide (12 approaches + synergy matrix)
- `docs/68_prompt_kpi_dashboard.md` — Prompt KPI dashboard (metrics per approach + measurement plan)
- `docs/69_prompt_ops_pipeline.md` — Prompt Ops pipeline (5-stage lifecycle management)
- `docs/70_react_workflow.md` — ReAct workflow (6-phase × 4-stage protocol)
- `docs/71_llmops_dashboard.md` — LLMOps dashboard (3-level stack: Basic/Advanced/Enterprise)
- `docs/72_prompt_registry.md` — Prompt registry (versioned catalog + governance)

### New in v9.4.0 (Pillar ⑲)
- `docs/73_enterprise_architecture.md` — Multi-tenant arch (RLS/schema/DB/hybrid patterns, org ER, permission matrix, invite flow)
- `docs/74_workflow_engine.md` — Business workflow state machines (approval/ticket/order/contract/onboarding, Mermaid stateDiagram)
- `docs/75_admin_dashboard_spec.md` — Admin dashboard spec (KPI cards, business metrics, workload analytics, role-based views)
- `docs/76_enterprise_components.md` — Enterprise component catalog (8 components: StatusBadge, ApprovalBar, DataTable, NotificationBell, OrgSwitcher, OnboardingStepper, AuditTimeline, InviteManager)

### New in v9.5.x (Pillar ⑳ + 7-level skill)
- `docs/77_cicd_pipeline_design.md` — CI/CD pipeline design (9 stages, GitHub Actions, quality gates)
- `docs/78_deployment_strategy.md` — Deployment strategy (blue-green/canary/rolling/feature-flag)
- `docs/79_quality_gate_matrix.md` — Quality gate matrix (5 gates, domain-specific rules)
- `docs/80_release_engineering.md` — Release engineering (3 release models, 9 deploy targets)
- `docs/81_ux_proficiency_audit.md` — 7-level UX proficiency audit with project context (all domains)

### New in v9.6.x (Pillars ㉑㉒㉓㉔㉕ + Field Presets Phase L)
- `docs/82_architecture_integrity_check.md` — Always generated; ORM/Auth/CORS/async/soft-delete integrity (10.0 scale, C-A〜C-L checks)
- `docs/83_api_design_principles.md` — RESTful 6 principles (resource naming, HTTP verbs, idempotency, pagination, versioning, error design)
- `docs/84_openapi_specification.md` — OpenAPI 3.1 spec (dynamic paths/schemas from answers, BaaS SDK approach)
- `docs/85_api_security_checklist.md` — OWASP API Security Top 10 (2023) + stack-adaptive auth/authorization checklist
- `docs/86_api_testing_strategy.md` — API test strategy (k6 load testing, integration test scenarios, contract testing)
- `docs/87_database_design_principles.md` — Naming conventions, index design, normalization guidelines, per-ORM patterns
- `docs/88_query_optimization_guide.md` — N+1 detection, EXPLAIN ANALYZE patterns, query profiling, index recommendations
- `docs/89_migration_strategy.md` — Zero-downtime Expand-Contract pattern, multi-phase rollout, rollback procedures
- `docs/90_backup_disaster_recovery.md` — RTO/RPO targets by domain, PITR policies, DR runbook, backup verification
- `docs/91_testing_strategy.md` — Test pyramid (Unit/Integration/E2E) + framework selection (Jest/Vitest/pytest/JUnit)
- `docs/92_coverage_design.md` — Coverage targets (Statements 80%/Branches 75%/Functions 85%), mutation testing (Stryker)
- `docs/93_e2e_test_architecture.md` — Playwright POM pattern, storageState auth, mobile Detox/Maestro, CI YAML
- `docs/94_performance_testing.md` — Core Web Vitals (LCP<2.5s/INP<200ms/CLS<0.1), Lighthouse CI, k6/Locust scenarios
- `docs/95_ai_safety_framework.md` — 6-category AI risk (bias/privacy/security/transparency/dependency/misinformation), EU AI Act classification
- `docs/96_ai_guardrail_implementation.md` — 4-layer guardrails (input validation → content moderation → output validation → audit log)
- `docs/97_ai_model_evaluation.md` — RAGAS metrics (Faithfulness/Relevancy/Context Precision), Langfuse observability
- `docs/98_prompt_injection_defense.md` — Direct/Indirect Injection attack patterns + defense implementation
- `docs/99_performance_strategy.md` — Performance strategy overview, budget allocation, monitoring approach
- `docs/100_database_performance.md` — DB-specific tuning, connection pool, slow query identification, index strategy
- `docs/101_cache_strategy.md` — Cache layer design (CDN/Redis/HTTP Cache/Query Cache), invalidation patterns
- `docs/102_performance_monitoring.md` — APM provider selection (Sentry/Datadog/New Relic/CloudWatch), performance budget alerts

---

## Version History (Phase A-J)

### Phase D UX Improvements (D1-D5)
- D1: `beforeunload` handler — warns when files exist and ZIP not saved (`S._zipDone` flag set in `exportZIP()`)
- D2: Preset filter for Lv0-1 — `_beginnerPresets` (5 presets only); catBar + compare button hidden for `S.skillLv<=1`
- D3: Sidebar Pillar Grid Lv0-1 filter — `_bpFilter` hides 16 pillars, shows only SDD/AIルール/デザイン/ランチャー
- D4: Pillar Tabs Lv0-1 filter — `_ptFilter` in `applyLang()`, same 4-pillar filter
- D5: `AI_TOOL_RECIPES` — added Cline + Gemini recipes in `ui/templates.js`

### Phase E UX Improvements (E1-E8 — beginner experience final polish)
- E1: `S._zipDone=false` reset in `doGenerate()` + `clearFiles()` (beforeunload reactivates after regen)
- E2: Sidebar key files banner uses `S.skillLv<=1` (consistent with all other skill gates)
- E3: QBar AI Launcher shown to all skill levels; Explorer remains beginner-hidden
- E4: Tour filtered to 6 steps for Lv0-1 (`_getTourSteps()` now uses `var steps` + filter)
- E5: Welcome message in `start()` for Lv0-1 — reassures before first question
- E6: Post-gen guide CTA simplified for Lv0-1 (ZIP + Let's Go only; full 5-button set for Lv2+)
- E7: Skip button shows '後で回答OK' for Lv0-1; `const _ja` declared at `renderInputFor()` top
- E8: Phase completion milestone toast for Lv0-1 in `phaseEnd()` ('あと2ステップ' etc.)

### Phase A/B/C UX Improvements
- `showCompatAlert()` filters to errors-only for `S.skillLv<=1` (no warn/info noise for beginners)
- `generateAll()` shows friendly toast for Lv0-1 instead of "FE/BE/DB" jargon
- `applyLang()` in `init.js`: Lv0-1 hides 16 pillar badges (shows only 4: SDD/AIルール/AIランチャー/デザイン), simplifies icards[1-2] + hides icards[3-5]
- `showExportGrid()` in `generators/index.js`: three `S.skillLv` gates — heroCard urgency (Lv0-1), `_aiQs` micro-steps vs tool recipe (Lv0-1 vs Lv2+), `_startHere` 3-file spotlight (Lv0-1 only). Token count hidden for Lv0-1.
- `showPostGenGuide()` in `guide.js`: reads `S.skillLv` (not `S.answers.skill_level`) as primary signal
- `save()` in `state.js`: shows toast at 3.5MB (warn) and 4MB (error), try/catch on `localStorage.setItem`
- New CSS classes (all.css): `.ai-quickstart`, `.ai-qs-micro-label`, `.ai-qs-detail-micro`, `.ai-qs-recovery`, `.ai-qs-rp`, `.export-hero-urgent`, `.export-hero-urgent-label`, `.start-here-card`, `.start-here-file`, `@keyframes heroUrgentPulse`

### Phase F UX (F1-F8)
- F1: Launcher Lv0-1 filter (8 templates + "全表示" toggle)
- F2: `statPillarNum` id added to index.html; Lv0-1: pillar=4/files=主要/heroDesc簡略
- F3: dashboard.js — `S.skill!=='beginner'` → `S.skillLv>=3`
- F4: pbadges/pillarTabs Lv0-1 labels overridden to plain-language names
- F5: Lv0-1 icard[0] changed to "📖 設計書を自動で作る"
- F6: micro-steps具体化+リカバリー Lv0-1は展開表示; all.css: `.ai-qs-recovery-open`
- F7: sidebar renderSidebarFiles — Lv0-1: full files section collapsed via `<details>`
- F8: renderPillarGrid — Lv0-1: tooltip plain-text via `_bgTips`

### Phase G Round 2 (G2-1–G2-7)
- G2-1: `shareURL()` key names fixed (`p/a/pr`→`projectName/answers/preset`) + Unicode `decodeURIComponent(escape(atob(...)))`; `_SAFE_KEYS` includes `skillLv`
- G2-2: project.js `_SAFE_KEYS` includes `skillLv` (switchProject + importProject)
- G2-3: cmdpalette.js `exportJSON()` → `exportProject()` (fixed nonexistent function call)
- G2-4: guide.js Lv3 bridge card (`S.skillLv===3` — ⑫セキュリティ/コマンドパレット/⑳CI/CD)
- G2-5: launcher.js `LAUNCH_SKILL_REC.advanced` added; recKeys: Lv0-1→beginner, Lv2-3→intermediate, Lv4→advanced, Lv5+→pro
- G2-6: generators/index.js `_powerOps` (`S.skillLv>=4`); CSS `.power-ops-panel/.power-ops-title/.power-ops-btns`
- G2-7: shareURL() Lv6 success message includes SNS/blog sharing recommendation

### Phase H (H-1–H-16)
- H-1: `showDiffView()` added to diff.js (Lv4+ Power Ops Diff View now works)
- H-2: `showManual()` apply(this,arguments) — section nav fixed
- H-3: Dashboard pillarChecks/Map/Colors now covers P16-P20 (13→18 pillars)
- H-4/5/6/7: Number fixes — 37テンプレート, 135+ファイル, 20の柱 (all files updated)
- H-8: `switchSidebarTab()` aria-selected updated on tab change
- H-9/10: Export cards + start-here-file keyboard support (role=button + Enter/Space)
- H-11: wizard.js `phaseEnd()` `S.skill==='beginner'` → `S.skillLv<=1`
- H-12: sidebar `renderSidebarFiles()` → scrollIntoView for active file
- H-13: preview.js pillar 1 adds .gitattributes/.editorconfig/docs/64
- H-14: shareURL card hidden in mgmtGroup for Lv4+ (Power Ops already has it)
- H-15: `autoFillPhase2Defaults()` auto-sets auth based on backend
- H-16: `loadTemplateList()` dead code removed from templates.js

### Phase I (I-A–I-D)
- A: templates.js counts 37/48 (was 34/41)
- B: `_lsUsage()` + `_SAFE_KEYS` moved to module level + delete confirmation + storage bar (project.js)
- C: 44px touch targets + swipe fix (resize-aware) + 3rd mobile tab 📁ファイル
- D: 7 new standard presets (factory/agri/energy/media/gov/travel/insurance) → 48 total; SYNERGY_DOMAIN expanded (18→41+ entries)

### Phase J — Field Presets (v9.6.0)
- `src/data/presets.js`: PR_FIELD (82 entries), `_SCALE_DEFAULTS` (4 scales), `_fpd()` helper, FIELD_CAT_MAP (82), FIELD_CATS_JA/EN (21 each), FIELD_TREND (19 fields)
- `src/generators/common.js`: +142 entities for 20 academic/industry domains
- `src/ui/presets.js`: `_presetMode('standard'|'field')`, `pickFieldPreset()`, `_switchPresetMode()`; `S.preset` prefixed `'field:'`; Lv0-1: mode toggle hidden
- ⚠️ `var presetName`/`var preFilledCount` at line ~346 (NOT `const` — avoids hoisting conflict)
- `test/field-presets.test.js`: 18 tests; `test/harness.js`: PR_FIELD/FIELD_CAT_MAP/FIELD_CATS_JA/EN/FIELD_TREND/_SCALE_DEFAULTS getters

### Phase K — Field Preset → Wizard Question 最適マッチング
- `FIELD_CAT_DEFAULTS` (20 categories) — Layer 2 category defaults for target/screens/payment/mobile
- start() field preset branch: 4-layer logic (scale→category→fp→meta inference)
- PR_FIELD individual overrides: 7 presets with custom target/payment/mobile
- Coverage: 7/25 → 11/25 questions pre-filled (target+screens+payment+mobile added)
- `test/field-presets.test.js`: +12 tests (FIELD_CAT_DEFAULTS×7 + individual overrides×5)

### Phase ④⑤ — 生成品質改善 (v9.6.x)
- `future_features` → constitution §8 + LEARNING_PATH roadmap section (p1-sdd.js + p7-roadmap.js)
- `learning_path` → LEARNING_PATH.md header `| 学習パス: ... |` (p7-roadmap.js)
- ORM bug fix: `_orm` handles Prisma/Drizzle/TypeORM/SQLAlchemy/Kysely (p7-roadmap.js)
- `ai_tools` → prompt_composition_guide AI tool optimization table (p17-promptgenome.js gen67)
- `dev_env_type` → release_engineering branch strategy section (p20-cicd.js gen80)
- `gen-templates.js`: ff_title/ff_span/ff_integrate/lp_path (JA+EN)
- `test/gen-quality.test.js`: 59 tests covering Suites 1-12

### Phase 保守計画 — 品質・堅牢性改善 (v9.6.x+)
- **Phase 1**: gen-coherence.test.js + compat.test.js: assert追加でサイレント失敗を排除; `postGenerationAudit` C2/C3/C8/C9 バグ修正
- **Phase 2**: 調査のみ — `_SAFE_KEYS`, `detectDomain()` fallback, INDUSTRY_TEST_MATRIX は全て問題なし
- **Phase 3**: 調査のみ — genPillar15 引数, GEN_TO_PILLAR, P17/P18 undefined ガード は全て問題なし
- **Phase 4**: `_applyUniversalPostProcess`: static backend での早期 return を廃止し G-1〜G-4 が常に実行されるよう修正; `load()` skillLv に `!isNaN` + `Math.round` + clamp 強化
- **Phase 5**: compat-rules.js: 2ルール追加 (`mob-flutter-supabase` INFO + `mob-expo-drizzle` WARN) → 60ルール (11+38+11)
- **Phase 6**: .cursorrules/CLAUDE.md/CLAUDE-REFERENCE.md を 734テスト/2129KB/60ルール に更新
- **Phase 7**: compat-rules.js: 14ルール追加 (122→136: 6 ERROR + 7 WARN + 1 INFO) — Python/Java/Go+Firebase Hosting、FastAPI+Cloudflare、ORM+NoSQL不整合、dom-saas/government/legal、mob-flutter-drizzle/kysely、db-redis-primary; 1480テスト/3112KB

