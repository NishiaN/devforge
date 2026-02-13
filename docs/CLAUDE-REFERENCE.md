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
- **DOMAIN_ENTITIES**: Core entities per domain with warnings & suggestions (24 domains: 16 original + 8 new)
- **DOMAIN_QA_MAP**: 24 domain-specific QA strategies (added 8: AI, Automation, Event, Gamify, Collab, DevTool, Creator, Newsletter)
- **DOMAIN_PLAYBOOK**: 24 complete domain playbooks with implementation flows, compliance rules, bug prevention, context mapping, and AI skills
- **DOMAIN_GROWTH**: Growth intelligence data for 8 domains + default (funnel stages, CVR benchmarks, growth equations, levers, pricing strategies)

**Helper Functions:**
- **`pluralize(name)`** — Smart table name pluralization
- **`getEntityColumns(name, G, knownEntities)`** — Get columns for entity (ALWAYS pass 3 args)
- **`getEntityMethods(name)`** — Get allowed REST methods for entity
- **`detectDomain(purpose)`** — Infer domain from purpose text (24 domains supported)
  - Returns: 'education', 'ec', 'marketplace', 'community', 'content', 'analytics', 'booking', 'saas', 'iot', 'realestate', 'legal', 'hr', 'fintech', 'portfolio', 'tool', 'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter', or null
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

## Generated Output (92+ files)

When users complete the wizard, DevForge generates **92+ files** (base: 79 files, +4 when ai_auto=multi/full/orch for skills/ md Package, +1 when payment≠none for docs/38_business_model.md):

### Core Specifications
- **.spec/** — constitution.md, specification.md, technical-plan.md, tasks.md, verification.md

### Development Environment
- **.devcontainer/** — devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh

### Documentation (51 files)
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
- Run `node build.js --report` to verify ≤1200KB
- Current budget remaining: ~90KB

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
