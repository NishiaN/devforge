# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# DevForge v9.5.0

## Documentation Structure

DevForge v9's documentation is optimized into role-specific files:

- **CLAUDE.md** (this file) — Core development guidelines, critical rules, common bugs, quick reference
- **docs/CLAUDE-REFERENCE.md** — Detailed reference: complete data structures, generated output catalog, pillar addition guide, compression patterns, test patterns
- **docs/CLAUDE-TROUBLESHOOTING.md** — Environment setup, git workflow, deployment, troubleshooting
- **docs/AI_CODING_PROMPTS.md** — 36 AI prompt templates (spec review, MVP implementation, test generation, refactoring, security audit, etc.)
- **未来志向アプリ開発戦略フレームワーク（2026-2035）.md** (local only) — 28 strategic frameworks for future app development (2026-2035 horizon)

## Architecture
- **55 modules** in `src/` → `node build.js` → single `devforge-v9.html` (~1835KB)
- Vanilla JS, no frameworks. CSS custom properties. CDN: marked.js, mermaid.js, JSZip.
- **AI Development OS**: Generates 134+ files including context intelligence, operations playbooks, business models, growth strategies, industry-specific strategic intelligence, ops intelligence, future strategy intelligence, polymorphic development intelligence, prompt genome engine, prompt ops pipeline, enterprise SaaS blueprint, CI/CD intelligence, and path-specific AI rules
- **Security-hardened**: Phase 1 (CSP, SRI, sanitization) + Phase 2 (16 XSS/injection fixes) + Pillar ⑫ (context-aware security audit prompts)
- **Latest**: v9.5.x — Pillar ⑳ (CI/CD Intelligence) + Creative UX Pack (9-expert brainstorm, AI model guide, UX journey, expertHints), 36 launcher templates, 20 pillars total

## Build & Test
```bash
# Build
node build.js              # Produces devforge-v9.html (~1835KB, limit 2000KB)
node build.js --no-minify  # Skip minification (debug)
node build.js --report     # Show size report
node build.js --check-css  # Validate CSS custom properties

# Test
npm test                   # Run all tests (527 tests, all passing)
npm run test:watch         # Watch mode for test development
node --test test/gen-coherence.test.js  # Run single test file
node --test test/data-coverage.test.js  # Run data integrity tests
node --test test/security.test.js       # Run security tests (26 tests)

# Development
npm run dev                # Build + live-server on port 3000
npm run open               # Build + open in browser
npm run check              # Syntax check extracted JS

# Workflow: Edit src/ → npm test → node build.js → npm run open → commit
```

## Build Process Deep Dive

`build.js` concatenates 55 modules into single HTML:

1. **Read modules** in dependency order (defined in `jsFiles` array)
2. **Read CSS** from `styles/all.css`
3. **Minify** (unless `--no-minify` flag) — CSS/JS basic minification
4. **Inject** into `template.html` structure
5. **Write** to `devforge-v9.html`
6. **Validate** size ≤2000KB (warn if exceeded)

**Current Status:** ~1835KB / 2000KB limit (~92% utilized, P20 CI/CD Intelligence complete, room for expansion)

### ⚠️ Critical: Minification Strategy

**Hybrid approach using esbuild + legacy minifier:**
- **CSS**: esbuild with `minify: true` (production quality)
- **JavaScript**: Legacy regex-based minifier (safe for concatenated modules)
  - esbuild's `transformSync()` adds overhead when processing large concatenated code
  - Legacy minifier preserves comments in strings (no context-aware parsing)
- **Comment removal is DISABLED**: Generated docs contain `/* ... */` and `//` inside strings
- **Fallback**: If esbuild unavailable, uses legacy for both CSS and JS

### Module Load Order (Critical!)
```javascript
// Core state MUST load first
'core/state.js', 'core/i18n.js',
// Data before generators
'data/presets.js', 'data/questions.js', 'data/techdb.js',
// Generators depend on data
'generators/common.js', 'generators/p1-sdd.js',
// UI last
'ui/wizard.js', 'ui/render.js',
// Init triggers after all modules loaded
'core/init.js'
```

⚠️ **Changing module order can break dependencies!**

## Module Map
| Category | Files | Purpose |
|----------|-------|---------|
| core/ | state, i18n, events, tour, init | State, language, shortcuts |
| data/ | presets(41), questions, techdb, compat-rules, gen-templates, helpdata | Static data (41 presets: 36 original + 5 new: CRM, Social, Logistics, Survey, Job Board) |
| generators/ | index, p1-sdd, p2-devcontainer, p3-mcp, p4-airules, p5-quality, p7-roadmap, p9-designsystem (v2: Figma MCP, Anti-AI checklist), p10-reverse, p11-implguide (skill_guide.md), p12-security (context-aware audit prompts), p13-strategy (industry intelligence), p14-ops (ops intelligence), p15-future (market/UX/ecosystem/regulatory strategy), p16-deviq (polymorphic development intelligence), p17-promptgenome (CRITERIA 8-axis + AI Maturity), p18-promptops (ReAct + LLMOps + Prompt Registry), p19-enterprise (multi-tenant arch + workflow engine + admin dashboard + enterprise components), docs, common | 130+ file generation engine (19 pillars) |
| ui/ | wizard, render, edit, help, confirm, complexity, toc, voice, project, presets, preview, editor, diff, export, explorer, dashboard, templates, qbar, cmdpalette | UI components |
| styles/ | all.css | Theme (dark/light), responsive |

## Key State: `S` (Global State Object)
Located in `src/core/state.js`. Call `save()` after mutations to persist to localStorage.

**Core Fields:**
- `phase`, `step` — Wizard navigation (0-2, 0-N)
- `answers` — User's project answers (Object)
- `files` — Generated file map: `{[path]: content}`
- `projectName` — Current project name
- `preset` — Selected preset ('lms', 'saas', 'custom', etc.)
- `skill` — User skill level ('beginner'|'intermediate'|'pro')

**Language & Theme:**
- `lang` — UI language ('ja'|'en')
- `genLang` — Generation output language ('ja'|'en')
- `theme` — Dark/light mode ('dark'|'light')

**Advanced:**
- `editedFiles` — User-modified files tracking
- `prevFiles` — Previous generation for diff view
- `skipped` — Array of skipped question IDs
- `progress` — Phase completion tracking
- `pillar` — Current pillar view (0-8)
- `previewFile` — Currently previewed file path
- `qbarDismissed` — QBar minimized to FAB state (boolean)
- `pinnedFiles` — User-pinned files for quick access (Array)
- `recentFiles` — Recently viewed files, max 10, MRU order (Array)

**Helper Functions (state.js):**
- `save()` — Persist to localStorage (with 4MB size warning)
- `load()` — Restore from localStorage (with v8→v9 migration + type validation)
- `esc(s)` — HTML entity escape (for display text)
- `escAttr(s)` — Attribute escape (for onclick/href values)
- `_jp(s, default)` — Safe JSON.parse with fallback
- `sanitize(s, max)` — Strip HTML, limit length
- `sanitizeName(s)` — Remove dangerous chars
- `fileSlug(s)` — Convert to filename-safe slug
- `toast(msg)` — Show 2.2s toast notification
- `hasDM(method)` — Check if dev_methods includes method

## Critical Rules
1. **Edit `src/` only** — never edit `devforge-v9.html` directly
2. **No `${expr}` in single-quoted strings** — use concatenation
3. **Generator functions**: define `const G = S.genLang==='ja';` at function top
4. **UI text**: use `S.lang` + `t('key')` or ternary
5. **TechDB req**: use English codes + `reqLabel()` for display
6. **CSS**: use custom properties (`--accent`, `--bg-2`, `--text`, etc.)
7. **State**: call `save()` after S mutations
8. **getEntityColumns**: always pass 3rd arg `knownEntities` to filter undefined FK refs
9. **ENTITY_METHODS**: REST API methods are entity-specific (see common.js)

## Common Bugs & Security Best Practices

### String Concatenation Bugs
**Most Common Error:** Missing `+=` operator when building strings

```javascript
// ❌ CRITICAL BUG: Results in empty output
let doc = '# Title\n';
doc + 'Content here\n';  // This does NOTHING!

// ✅ Correct: Use += to append
let doc = '# Title\n';
doc += 'Content here\n';
```

**Detection:** If generated files (especially Mermaid diagrams) appear empty, check for missing `+=` operators.

### Entity Name Collisions
**Problem:** Different presets may define entities with the same name but different schemas.

**Solution:**
1. Use descriptive names: `ContactMessage` vs `Contact` (CRM)
2. Check `ENTITY_COLUMNS` for existing keys before adding new entities
3. Update `DOMAIN_ENTITIES` to use the new name
4. Update preset `entities` field

### CSS Custom Property Undefined
**Symptom:** UI elements have no background/border/color

**Fix:** Add missing variable to `:root` and `[data-theme="light"]` in `styles/all.css`

### Conditional Question Progress Bugs
**Problem:** Progress bar counts questions that aren't applicable (e.g., ORM question when using Supabase)

**Solution:** Always use `isQActive(q)` before counting/displaying questions (see `src/ui/wizard.js`)

### Security: Input Sanitization

**Always sanitize user input** before storing, displaying, or using in file paths:

```javascript
// ✅ URL hash import (allowlist approach)
if(data.projectName) {
  S.projectName = sanitizeName(data.projectName);
  if(data.answers) S.answers = data.answers;  // Only allowed fields
  // Never: Object.assign(S, data) — allows injection!
}

// ✅ JSON import sanitization + proto pollution protection
Object.keys(data.state.answers).forEach(k => {
  if(['__proto__','constructor','prototype'].includes(k)) {
    delete data.state.answers[k]; return;
  }
  if(typeof data.state.answers[k] === 'string') {
    data.state.answers[k] = sanitize(data.state.answers[k]);
  } else {
    delete data.state.answers[k];
  }
});
```

### Security: XSS Prevention Patterns

**Critical Rules:**

1. **Use `esc()` for display text**, `escAttr()` for HTML attributes
2. **Mermaid diagrams: Use textContent, NOT innerHTML** (prevents XSS from unescaped content)
3. **window.open: Always add CSP meta** (restrict capabilities in new windows)
4. **Use `_jp()` instead of `JSON.parse()` for localStorage** (handles invalid JSON gracefully + null/undefined safety)
   - `JSON.parse(null)` returns `null` (not an error), bypassing default values
   - `_jp()` includes explicit null guard: `if(s==null)return d;`
5. **Validate href protocols** (only allow http/https)

See Phase 2 security audit for detailed examples.

### Bilingual Consistency
**Common Mistakes:**
1. Adding Japanese-only fields to presets (missing `targetEn`, `featuresEn`, `purposeEn`)
2. Updating numbers in one language but not the other
3. Using dynamic `S.lang` in data files (gets evaluated once at load time)

**Fix:**
- Always add both `ja` and `en` versions
- Search for all instances when updating numbers (41 presets, 134+ files, 20 pillars)
- Use static strings in data files, not `S.lang` conditionals

### Cross-Reference Number Updates
**Critical Pattern:** When updating quantitative values (rule counts, file counts, test counts), verify consistency across:

1. **Source files**: `src/data/compat-rules.js`, `src/core/tour.js`, `src/index.html`
2. **Test files**: `test/compat.test.js` (header comment)
3. **Documentation**: `CLAUDE.md`, `README.md`, `.cursor/rules`
4. **Usage guide**: `devforge-v9-usage-guide.html` (multiple locations)
5. **Build output**: Run `npm test` to verify actual test count

**Workflow:**
```bash
# After changing counts in source
npm test                    # Get actual test count
grep -r "OLD_NUMBER" .      # Find all references
node build.js               # Rebuild HTML
npm run open                # Visual verification
```

**Recent Updates (2026-02-19):**
- Pillars ⑰ (Prompt Genome) + ⑱ (Prompt Ops) added: 16→18 pillars
- Tests: 335→457 (added promptgenome.test.js 22 + promptops.test.js 26 + mermaid.test.js + utils.test.js)
- Generated files: 118+→126+ (docs/65-72 added)
- Templates: 23→32 (Launcher PT expanded for P16/P17/P18)
- Docs count: 72 numbered files in docs/

**Recent Updates (v9.4.0):**
- Pillar ⑲ (Enterprise SaaS Blueprint) added: 18→19 pillars
- Tests: 457→483 (added enterprise.test.js 26 tests)
- Generated files: 126+→130+ (docs/73-76 added: enterprise arch, workflow engine, admin dashboard, enterprise components)
- Templates: 32→34 (added Enterprise Architecture Review + Workflow Process Audit)
- Docs count: 76 numbered files in docs/
- Build size: ~1707KB→~1764KB (54 modules)

**Recent Updates (v9.5.x — Pillar ⑳ CI/CD Intelligence):**
- Pillar ⑳ (CI/CD Intelligence) added: 19→20 pillars
- Tests: 497→527 (added cicd.test.js 30 tests)
- Generated files: 130+→134+ (docs/77-80: cicd_pipeline_design, deployment_strategy, quality_gate_matrix, release_engineering)
- Docs count: 76→80 numbered files in docs/
- Build size: ~1789KB→~1835KB (55 modules)
- All domains generate CI/CD docs (no domain skip, unlike P19)
- Deploy target config: 9 targets (Vercel/Firebase/CF/Railway/Fly/Render/AWS/Docker/Netlify)
- Domain-specific: fintech→dual-approval+compliance audit, healthcare→HIPAA+PHI scan, ec→payment smoke test, iot→firmware build

**Recent Updates (v9.4.x — Creative UX Pack):**
- Templates: 34→36 (added 🎭 9-Expert Brainstorm + 🎯 UX Journey Design + 🤖 AI Model Selection; enhanced old brainstorm)
- AI_REC map in `launcher.js`: all 36 templates tagged with recommended AI model (Gemini/Claude/ChatGPT/Copilot)
- **expertHints system**: `src/data/helpdata.js` — 4 key questions (purpose/target/mvp_features/screens) now include `expertHints[]` arrays with 9-expert creative prompts per question; displayed in `src/ui/help.js` help popup with `cycleExpertHint()` / `_renderExpertHint()` rotation
- Hero section: icard[0] → "3つの悪夢を解決" storytelling, icard[1] → "19の柱×130+ファイル" reframing
- Tour: 10→11 steps (added "9-Expert Brainstorm" step); build.test.js assertion updated accordingly
- Post-gen guide: 5→6 steps per skill level (added brainstorm/creative step for all 3 levels)
- Build size: ~1764KB→~1789KB

### Property Name Mismatches with Helper-Generated Objects
**Problem:** Accessing properties on objects created by helper functions without checking the actual property structure.

**Detection:** If domain-specific sections in generated docs are empty, check property names against the helper function that creates the object.

**Prevention:** When using objects from helpers like `_dpb()`, `_tm()`, check the helper definition to see exact property names it generates.

### Missing Entity Definitions
**Problem:** `DOMAIN_ENTITIES` references entities that don't exist in `ENTITY_COLUMNS`.

**Solution:**
1. Search ENTITY_COLUMNS for the entity name
2. If missing, add column definition following the pattern of similar entities
3. Use compression constants (`_U`, `_SA`, `_T`, `_D`, etc.) where applicable
4. Verify with `npm test` to ensure FK references are valid

### Invalid Domain References
**Problem:** Using domain strings that `detectDomain()` never returns.

**Solution:**
1. Check `detectDomain()` in common.js for the complete list of 32 valid domains
2. Never hardcode domain strings without verifying they're in detectDomain()

### Test Coverage Maintenance
**Files to update when adding domains:**
- `test/data-coverage.test.js` — Four domain arrays (DOMAIN_ENTITIES, DOMAIN_QA_MAP, DOMAIN_PLAYBOOK, DOMAIN_OPS tests)
- `test/gen-coherence.test.js` — Add generator eval() if testing new pillars
- `test/ops.test.js` — Add P14 ops intelligence tests for new domains

### Accessibility (a11y)
Don't forget ARIA attributes:
```javascript
// ✅ Include aria-selected
tabs.forEach(t => {
  t.classList.add('active');
  t.setAttribute('aria-selected', 'true');
});
```

### Error Handling
Always add error handlers for async operations:
```javascript
voiceRec.onend = () => { resetUI(); };
voiceRec.onerror = () => { resetUI(); };  // Prevents UI freeze
```

### Compatibility Rules System
**Location:** `src/data/compat-rules.js`

The compatibility checker validates tech stack combinations with **58 rules** (11 error + 37 warn + 10 info).

**Rule Structure:** `{id, p:['field1','field2'], lv:'error'|'warn'|'info', t:conditionFn, ja, en, fix, fixFn}`

**Guidelines:**
- Add `fix` properties to warn/error rules where automatic correction is safe
- Don't add fixes to skill-level warnings (user choice, not technical issue)
- Don't add fixes to informational warnings about preview features

**Recent Expansion (v9.3.1):**
- **Rule 55**: Flutter + NextAuth/Auth.js incompatibility (WARN)
- **Rule 56**: Django/Spring/Laravel + Netlify limitations (WARN)
- **Rule 57**: NestJS + Netlify limitations (WARN)
- **Rule 58**: Flutter + Firebase synergy (INFO)

**Adding New Rules Checklist:**
1. Add rule to `src/data/compat-rules.js` with unique ID
2. Update header comment with new totals (ERROR/WARN/INFO)
3. Update section comment (e.g., "Mobile ↔ Auth (3 WARN)")
4. Add test cases to `test/compat.test.js` (both positive and negative)
5. Update test header comment
6. Update all documentation references (see Cross-Reference section above)
7. Run `npm test` to verify all 527 tests pass

## Key Data Structures & Helper Functions

→ See `docs/CLAUDE-REFERENCE.md` for detailed reference documentation.

**Essential functions from `src/generators/common.js`:**
- **`detectDomain(purpose)`** — Infer domain from purpose text (32 domains: education, ec, marketplace, community, content, analytics, booking, saas, iot, realestate, legal, hr, fintech, portfolio, tool, ai, automation, event, gamify, collab, devtool, creator, newsletter, manufacturing, logistics, agriculture, energy, media, government, travel, insurance)
- **`getEntityColumns(name, G, knownEntities)`** — Get columns for entity (ALWAYS pass 3 args)
- **`getEntityMethods(name)`** — Get allowed REST methods for entity
- **`resolveAuth(answers)`** — Determine auth architecture from answers
- **`pluralize(name)`** — Smart table name pluralization

**Essential functions from `src/ui/wizard.js`:**
- **`isQActive(q)`** — Check if question's condition is met (centralizes conditional question evaluation)

**expertHints system (added Creative UX Pack):**
- **`src/data/helpdata.js`** — `HELP_DATA[id].ja.expertHints[]` / `.en.expertHints[]` — arrays of `{icon, name, hint}` for 4 questions: `purpose`, `target`, `mvp_features`, `screens`
- **`src/ui/help.js`** — `showHelp()` reads `expertHints`, stores in `window._ehData` / `window._ehIdx`, renders via `_renderExpertHint(_ja)` helper
- **`cycleExpertHint()`** — global function, increments `window._ehIdx` mod length, updates `.help-expert-hint` DOM in place (no re-render)
- **CSS classes**: `.help-expert-hint`, `.help-eh-head`, `.help-eh-text`, `.help-eh-next` in `styles/all.css`

**New in v9.2.0 — DOMAIN_OPS (Ops Intelligence):**
- **`DOMAIN_OPS`** — 32-domain operational requirements (SLO, Feature Flags, Jobs, Backup, Hardening)
- **Structure:** `{slo, flags_ja, flags_en, jobs_ja, jobs_en, backup_ja, backup_en, hardening_ja, hardening_en}`
- **Usage in P14:** `const ops = DOMAIN_OPS[domain] || DOMAIN_OPS._default;`
- **SLO examples:** fintech/health: 99.99%, education/ec/saas: 99.9%, portfolio/tool: 99%
- **Feature Flags:** Domain-specific kill switches (e.g., fintech: "取引停止キルスイッチ", ec: "決済機能停止")
- **Jobs:** Background job patterns (e.g., BaaS: Vercel Cron/pg_cron, Traditional: BullMQ)
- **Backup:** RPO/RTO requirements by domain criticality
- **Hardening:** Domain-specific security/ops best practices (e.g., fintech: 冪等性キー必須, health: PHI暗号化)

## Adding Translations

1. **Add keys to `src/core/i18n.js`:** `I18N = {ja: {key: '日本語'}, en: {key: 'English'}}`
2. **Use in UI code:** `t('key')` or inline ternary `S.lang === 'ja' ? '日本語' : 'English'`
3. **For generated content:** `const G = S.genLang === 'ja'; content = G ? '日本語' : 'English';`

## Adding New Presets

Edit `src/data/presets.js` and add to `PR` object using `_mp()` helper:

```javascript
const PR = {
  my_preset: _mp({  // Use _mp() helper for compression
    name: '日本語名',
    nameEn: 'English Name',
    icon: '🎯',
    purpose: '日本語の目的説明',
    purposeEn: 'English purpose description',
    target: ['ターゲット1', 'ターゲット2'],
    targetEn: ['Target1', 'Target2'],
    // Only specify fields that differ from _PD defaults
    features: ['機能1', '機能2', '機能3'],
    featuresEn: ['Feature1', 'Feature2', 'Feature3'],
    entities: 'Entity1, Entity2, Entity3',
    payment: 'stripe'  // Override default
  })
};
```

**Steps:**
1. Add preset to `src/data/presets.js` using `_mp()` compression
2. Add required entities to `src/generators/common.js` ENTITY_COLUMNS
3. Add ER relationships to `inferER()` if needed
4. Update preset count in `test/presets.test.js` (line 10-11)

**Current count:** 41 presets (including custom)

## Adding New Pillars

→ See `docs/CLAUDE-REFERENCE.md` for detailed 6-step process.

**Summary:** Create generator → Register in build system → Update UI & i18n → Update docs → Add tests → Check size budget (≤2000KB)

**⚠️ Easy to miss:** Add an `else if(pillar===N)` branch to `buildFileTree()` in `src/ui/preview.js` (line ~426). Each pillar tab maps to an index (P1=0 … P19=18). Without this, the pillar's docs are invisible in the file tree even though they exist in `S.files`.

## Generated Output

DevForge generates **134+ files** (base: 90 files, +4 for skills/ when ai_auto=multi/full/orch, +1 for business_model.md when payment≠none, +3 for P14 ops docs, +4 for P15 future strategy docs, +4 for P16 dev IQ docs, +4 for P17 prompt genome docs, +4 for P18 prompt ops docs, +4 for P19 enterprise docs (for SaaS-like domains), +4 for P20 CI/CD docs (all domains), +6 for .claude/ structure).

→ See `docs/CLAUDE-REFERENCE.md` for complete file catalog.

**New in v9.3.0 (Phase 4: CLAUDE.md 3-layer split + Cross-Platform Support):**
- `CLAUDE.md` — Thin root (~1.5K tokens, compressed from ~3K)
- `.claude/rules/spec.md` — Spec-driven development rules (auto-loads for .spec/**)
- `.claude/rules/frontend.md` — Framework-specific FE rules (auto-loads for src/components/**, app/**)
- `.claude/rules/backend.md` — Architecture-aware BE rules (auto-loads for src/api/**, src/lib/**)
- `.claude/rules/test.md` — Testing methodology rules (auto-loads for **.test.*, **.spec.*)
- `.claude/rules/ops.md` — Operations & deployment rules (auto-loads for .github/**, docs/34_*, docs/53_*, docs/54_*)
- `.claude/settings.json` — Permissions, context config, dangerous command warnings
- `.gitattributes` — Line ending normalization (prevents Windows CRLF issues)
- `.editorconfig` — Editor settings standardization
- `docs/64_cross_platform_guide.md` — Cross-platform development guide (line endings, DevContainer, BaaS dev modes)

**New in v9.2.0 (Pillar ⑭):**
- `docs/53_ops_runbook.md` — Ops Plane design (Feature Flags, SLO/SLI, Observability, Jobs, Backup, Rate Limiting)
- `docs/54_ops_checklist.md` — Day-1 ops readiness checklist (12 Ops Capabilities Matrix)
- `docs/55_ops_plane_design.md` — Ops Plane Architecture (12 Ops Capabilities impl patterns, Circuit Breaker, Evidence-Based Ops, Dev×Ops AI separation, Admin Console security)
- `docs/56_market_positioning.md` — Market positioning & competitive intelligence (MOAT analysis, GTM strategy, unit economics)
- `docs/57_user_experience_strategy.md` — User experience & retention strategy (personas, user journeys, accessibility, digital wellbeing)
- `docs/58_ecosystem_strategy.md` — Ecosystem & platform strategy (API-as-product, DX, FinOps, community strategy)
- `docs/59_regulatory_foresight.md` — Regulatory foresight & sustainability (2026-2030 horizon, EU AI Act, ESG metrics)

**New in v9.3.x (Pillars ⑰⑱):**
- `docs/65_prompt_genome.md` — Prompt genome analysis (CRITERIA 8-axis framework, approach scoring)
- `docs/66_ai_maturity_assessment.md` — AI maturity level assessment (3-level model: Assist/Augment/Autonomous)
- `docs/67_prompt_composition_guide.md` — Prompt composition guide (12 approaches + synergy matrix)
- `docs/68_prompt_kpi_dashboard.md` — Prompt KPI dashboard (metrics per approach + measurement plan)
- `docs/69_prompt_ops_pipeline.md` — Prompt Ops pipeline (5-stage lifecycle management)
- `docs/70_react_workflow.md` — ReAct workflow (6-phase × 4-stage protocol)
- `docs/71_llmops_dashboard.md` — LLMOps dashboard (3-level stack: Basic/Advanced/Enterprise)
- `docs/72_prompt_registry.md` — Prompt registry (versioned catalog + governance)

**New in v9.4.0 (Pillar ⑲):**
- `docs/73_enterprise_architecture.md` — Multi-tenant arch (RLS/schema/DB/hybrid patterns, org ER, permission matrix, invite flow)
- `docs/74_workflow_engine.md` — Business workflow state machines (approval/ticket/order/contract/onboarding, Mermaid stateDiagram)
- `docs/75_admin_dashboard_spec.md` — Admin dashboard spec (KPI cards, business metrics, workload analytics, role-based views)
- `docs/76_enterprise_components.md` — Enterprise component catalog (8 components: StatusBadge, ApprovalBar, DataTable, NotificationBell, OrgSwitcher, OnboardingStepper, AuditTimeline, InviteManager)

**Key pillars:**
- **.spec/** — constitution, specification, technical-plan, tasks, verification
- **.devcontainer/** — devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh
- **.claude/** — 3-layer AI rules (thin root + path-specific rules + settings)
- **docs/** — 76 documents including architecture, ER, API, screen, test-cases, security, release, WBS, prompt-playbook, design_system, qa_strategy, reverse_engineering, growth_intelligence, skill_guide, security_intelligence (OWASP 2025), threat_model, compliance_matrix, ai_security, security_testing, industry_blueprint, tech_radar, stakeholder_strategy, operational_excellence, ops_runbook, ops_checklist, prompt_genome, ai_maturity, prompt_composition, prompt_kpi, prompt_ops_pipeline, react_workflow, llmops_dashboard, prompt_registry, enterprise_architecture, workflow_engine, admin_dashboard_spec, enterprise_components
- **AI rules** — CLAUDE.md (thin), .claude/rules/ (5 files), .claude/settings.json, AI_BRIEF.md, .cursorrules, .clinerules, .windsurfrules, AGENTS.md, skills/ (project.md, factory.md, catalog.md, pipelines.md, skill_map.md, agents/)
- **CI/CD** — .github/workflows/ci.yml

## AI Prompt Launcher (Pillar ⑧)

DevForge includes a **Prompt Launcher** that generates structured prompts by auto-injecting project context (name, stack, auth, entities) into 36 specialized templates:

**Key Templates:**
- 🔍 **Spec Review** — 4-step structured review (mission → requirements → architecture → consistency)
- 🚀 **MVP Implementation** — Select priority task from tasks.md, implement with types → data → logic → UI → tests
- 🧪 **Test Generation** — Reference docs/07, create normal → error → boundary tests (Vitest format)
- ♻️ **Refactoring** — Detect SOLID violations, estimate effort (S/M/L), prioritize
- 🔒 **Security Audit** — OWASP Top 10 checklist with status (✅/⚠️/❌)
- 📝 **Doc Completion** — Gap analysis + generate most critical missing doc
- 🐛 **QA/Bug Detection** — Domain-specific bug patterns, test plan, priority matrix
- 🔧 **Debug Support** — Cross-reference error_logs.md, 5 Whys analysis, fix code
- 📐 **Architecture Consistency** — Detect layer violations, verify tech policy alignment
- ⚡ **Performance Optimization** — NFR comparison, bottleneck identification, improvement roadmap
- 🔌 **API Integration** — Type-safe client code with error handling + test skeleton
- ♿ **Accessibility Audit** — WCAG 2.1 AA 4-principle check + axe-core tests
- 🔄 **Migration Support** — Schema conversion scripts, validation queries, deploy plan
- 📊 **Code Metrics** — Cyclomatic/cognitive complexity, coupling, DRY violations, ROI prioritization
- 🌍 **i18n Implementation** — Extract strings, define translation keys, generate JSON, replace with t()
- 🧬 **Optimal Methodology** — Select optimal dev methodology from DEV_METHODOLOGY_MAP (P16)
- 🎭 **9-Expert Brainstorm** — 9 expert personas (Creative/Tech/Business/Academic/Science/User/Disruptor/Humor/Explorer) generate ideas + 3-axis evaluation (appeal × feasibility × validity)
- 🎯 **UX Journey Design** — Lv.0-5 progressive disclosure user journey (persona/pain/UX pattern/churn risk/action per level) + "3 Nightmares" anti-failure UI design
- 🤖 **AI Model Selection** — Per-dev-phase AI model matching (Gemini=precision, Claude=ethics, ChatGPT=creativity, Copilot=balance) with natural prompt examples
- 🏭 **Industry Analysis** — Industry-specific blueprint + tech radar + stakeholder strategy
- 🔮 **Next-Gen UX** — Next-gen UX patterns + cognitive load audit
- 🧠 **Cognitive Load Analysis** — Cognitive complexity audit + simplification roadmap
- 🧩 **Prompt Genome Analysis** — CRITERIA 8-axis prompt evaluation (P17)
- 📊 **AI Maturity Review** — AI maturity level assessment + upgrade roadmap (P17)
- 🔄 **ReAct Debug Loop** — ReAct 6-phase debugging protocol (P18)
- 🔧 **Prompt Ops Review** — Prompt Ops pipeline + LLMOps dashboard review (P18)
- 🏢 **Enterprise Architecture Review** — Multi-tenant arch, RLS, org model, permission matrix review (P19)
- 📋 **Workflow Process Audit** — Approval/ticket/order state machine audit, SLA compliance (P19)

**AI Model Recommendation Badges:** Each template card shows a recommended AI model via `AI_REC` map in `src/ui/launcher.js`. Gemini=precision tasks (review/arch/metrics), Claude=ethical/UX tasks (risk/ux_journey/strategy), ChatGPT=creative tasks (brainstorm/nextgen/cognitive), Copilot=balanced tasks (implement/test/debug).

→ See `docs/AI_CODING_PROMPTS.md` for full template details and usage examples.

## Test Architecture
| File | Tests | Purpose |
|------|-------|---------|
| gen-coherence.test.js | 253 assertions | Full LMS generation + structural validation + post-generation audit (C2-C10) |
| snapshot.test.js | 53 tests | 6 scenario regression (LMS/Blog/EC/English/PropertyMgmt/Helpdesk) + context engineering + skills validation + quality files + P12 security intelligence + P13 industry detection + P14 ops + P4 .claude/ structure (6 new tests) |
| data-coverage.test.js | 40 tests | Data integrity: entity coverage, FK validation, domain detection (32 domains), playbook completeness, DOMAIN_OPS coverage, DOMAIN_MARKET coverage (3 new P15 tests), P19 entity tests (Organization/OrgMember/OrgInvite) |
| r27-regression.test.js | 17 tests | Bug fixes: prices, FK, KPI, ports |
| r28-regression.test.js | 19 tests | Quality: REST methods, AC, scope_out, verification |
| build.test.js | build | Build size ≤2000KB, pillar function existence (P1-P19) |
| compat.test.js | 75 tests + 7 synergy | Compatibility validation (58 rules: 11 ERROR, 37 WARN, 10 INFO) + calcSynergy unit tests |
| security.test.js | 26 tests | Security: CSP, SRI, sanitization, XSS prevention, proto pollution, .claude/settings.json safety (2 new tests) |
| ops.test.js | 16 tests | Ops Intelligence (P14): runbook generation, checklist, ops plane design, SLO adaptation, domain-specific flags, observability stack, circuit breaker, audit schema |
| future.test.js | 16 tests | Future Strategy Intelligence (P15): DOMAIN_MARKET coverage, PERSONA_ARCHETYPES coverage, GTM_STRATEGY, REGULATORY_HORIZON, doc generation (56-59), mermaid diagrams, bilingual content |
| deviq.test.js | 20 tests | Polymorphic Development Intelligence (P16): DEV_METHODOLOGY_MAP (32 domains), PHASE_PROMPTS (6 phases), INDUSTRY_STRATEGY (15 industries), NEXT_GEN_UX (4 keywords), doc generation (60-63), Mermaid diagrams, bilingual content |
| promptgenome.test.js | 22 tests | Prompt Genome Engine (P17): CRITERIA_FRAMEWORK (8 axes), AI_MATURITY_MODEL (3 levels), _APPROACHES (12), getSynergy, APPROACH_KPI, doc generation (65-68), bilingual content |
| promptops.test.js | 26 tests | Prompt Engineering OS (P18): REACT_PROTOCOL (6 phases × 4 stages), LLMOPS_STACK (3 levels), PROMPT_LIFECYCLE (5 stages), doc generation (69-72), no template literal contamination |
| enterprise.test.js | 33 tests | Enterprise SaaS Blueprint (P19): ENTERPRISE_ARCH_PATTERNS (4), WORKFLOW_TEMPLATES (5), ADMIN_DASHBOARD_SPECS (4), ENTERPRISE_COMPONENTS (8), gen73-76 output, bilingual, domain skip logic, pattern selection (7 chip→selKey mapping tests) |
| cicd.test.js | 30 tests | CI/CD Intelligence (P20): PIPELINE_STAGES (9), DEPLOY_STRATEGIES (4), QUALITY_GATES (5), RELEASE_MODELS (3), DEPLOY_TARGET_CONFIG (9), gen77-80 output, bilingual, all-domain generation, deploy target customization (9 targets), domain-specific gates (fintech/healthcare/ec/iot), Docker JA key normalization, template literal contamination |
| presets.test.js | 4 tests | Preset count (41), bilingual names, tech fields, purpose |
| Others | ~21 tests | i18n, state, techdb |

**Total: 527 tests (all passing, 100% pass rate) + 7 synergy unit tests**

## Writing Tests

→ See `docs/CLAUDE-REFERENCE.md` for test patterns (snapshot/regression, unit tests).

## Git Workflow & Deployment

→ See `docs/CLAUDE-TROUBLESHOOTING.md` for:
- First-time setup (git config)
- Standard commit flow
- SSH vs HTTPS
- Built HTML tracking
- GitHub Pages deployment

## Forbidden
- No raw SQL in application code (OK: DDL/RLS in migrations)
- No `any` types
- No console.log in production
- No hardcoded secrets

## Strategic Context

For long-term strategic planning and future-proofing your application architecture, refer to:

**未来志向アプリ開発戦略フレームワーク（2026-2035）.md** — Comprehensive 28-strategy framework covering:
- **Tier 1 (Critical)**: Agentic AI, LLM Orchestration, Zero Trust Security, SBOM/Supply Chain Security, Spatial Computing
- **Tier 2 (High Priority)**: Sovereign AI, Cyber Resilience, Composable Architecture (MACH), Real-time Collaboration (CRDT/Local-First)
- **Tier 3 (Important)**: Content Authenticity (C2PA), FinOps, Decentralized Identity (DID/SSI)
- **Integrated Priority Matrix**: 28-strategy evaluation with business impact, technical feasibility, ROI, competitive advantage, risk, future adaptability
- **Roadmap (2026-2035)**: Phased implementation from foundation (Year 1) to ecosystem leadership (Year 5-10)

This framework integrates with DevForge's generated output to guide architectural decisions, technology selection, and future-proofing strategies.

## Troubleshooting

→ See `docs/CLAUDE-TROUBLESHOOTING.md` for:
- Build fails with "SyntaxError"
- Tests fail after adding new generator
- Generated files missing entities
- LocalStorage quota exceeded
- i18n key not found
- Module dependency errors
- HTML Entity Escaping Issues
- Node.js Not Found (WSL/nvm)
