# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# DevForge v9.5.0

## Documentation Structure

DevForge v9's documentation is optimized into role-specific files:

- **CLAUDE.md** (this file) — Core development guidelines, critical rules, common bugs, quick reference
- **docs/CLAUDE-REFERENCE.md** — Detailed reference: complete data structures, generated output catalog, pillar addition guide, compression patterns, test patterns
- **docs/CLAUDE-TROUBLESHOOTING.md** — Environment setup, git workflow, deployment, troubleshooting
- **docs/AI_CODING_PROMPTS.md** — 37 AI prompt templates (spec review, MVP implementation, test generation, refactoring, security audit, etc.)
- **未来志向アプリ開発戦略フレームワーク（2026-2035）.md** (local only) — 28 strategic frameworks for future app development (2026-2035 horizon)

## Architecture
- **55 modules** in `src/` → `node build.js` → single `devforge-v9.html` (~2118KB)
- Vanilla JS, no frameworks. CSS custom properties. CDN: marked.js, mermaid.js, JSZip.
- **AI Development OS**: Generates 135+ files including context intelligence, operations playbooks, business models, growth strategies, industry-specific strategic intelligence, ops intelligence, future strategy intelligence, polymorphic development intelligence, prompt genome engine, prompt ops pipeline, enterprise SaaS blueprint, CI/CD intelligence, and path-specific AI rules
- **Security-hardened**: Phase 1 (CSP, SRI, sanitization) + Phase 2 (16 XSS/injection fixes) + Pillar ⑫ (context-aware security audit prompts)
- **Latest**: v9.6.0 — Phase J-O complete: 82 field presets × 4 scales + 48 standard presets + 7-Level Skill System + Sidebar Pillar Icon Grid (5×4) + 20 pillars + Preset→Wizard 25/25 question pre-fill (Phase K/L/M/N/O)

## Build & Test
```bash
# Build
node build.js              # Produces devforge-v9.html (~2118KB, limit 3000KB)
node build.js --no-minify  # Skip minification (debug)
node build.js --report     # Show size report
node build.js --check-css  # Validate CSS custom properties

# Test
npm test                   # Run all tests (670 tests, all passing)
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
6. **Validate** size ≤3000KB (warn if exceeded)

**Current Status:** ~2118KB / 3000KB limit (~70.6% utilized, Phase A-O complete)

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
| data/ | presets(48+field), questions, techdb, compat-rules, gen-templates, helpdata | Static data (48 standard presets + 82 field presets via `PR_FIELD`; `_mp()` for standard, `_fpd()` for field) |
| generators/ | index, p1-sdd, p2-devcontainer, p3-mcp, p4-airules, p5-quality, p7-roadmap, p9-designsystem (v2: Figma MCP, Anti-AI checklist), p10-reverse, p11-implguide (skill_guide.md + gen81 UX audit), p12-security (context-aware audit prompts), p13-strategy (industry intelligence), p14-ops (ops intelligence), p15-future (market/UX/ecosystem/regulatory strategy), p16-deviq (polymorphic development intelligence), p17-promptgenome (CRITERIA 8-axis + AI Maturity), p18-promptops (ReAct + LLMOps + Prompt Registry), p19-enterprise (multi-tenant arch + workflow engine + admin dashboard + enterprise components), p20-cicd (CI/CD intelligence), docs, common | 135+ file generation engine (20 pillars) |
| ui/ | wizard, render, edit, help, confirm, complexity, toc, voice, project, presets, preview, editor, diff, export, explorer, dashboard, templates, qbar, cmdpalette, **sidebar** (pillar icon grid + file tree + progress) | UI components |
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
- `pillar` — Current pillar view (0-19)
- `skillLv` — Fine-grained skill level (0-6 int); coexists with `skill` (3-tier string); `SKILL_TIERS[]` + `skillTier(lv)` in state.js
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
10. **`_ja` local var required in UI files**: `build.test.js` rejects bare `S.lang==='ja'` in `src/ui/` files. Always declare `const _ja=S.lang==='ja';` at function top and use `_ja` throughout. Core files (`src/core/`) may use `const ja=S.lang==='ja'`.

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
- Search for all instances when updating numbers (48 standard presets, 135+ files, 20 pillars)
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

→ See `docs/CLAUDE-REFERENCE.md` for Phase A-J change history. See `memory/phases.md` for Phase K-O details.
- **Current:** 670 tests | ~2118KB | 55 modules | 20 pillars | 135+ files | 130 presets (48 standard + 82 field) | Preset→Wizard coverage 25/25

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
7. Run `npm test` to verify all 670 tests pass

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

**Preset→Wizard matching system (`src/ui/presets.js`):**
- **`_applyUniversalPostProcess(_en)`** — Runs after all preset branches; infers answers from already-set values. Coverage: 25/25 questions for standard+field presets
  - N-3: `dev_env_type` from BaaS backend (Firebase/Supabase → 'ローカル開発')
  - N-4: `org_model` from `detectDomain(purpose)` (12 domain map)
  - N-5: `ai_tools` from `ai_auto` level (Vibe→Cursor+Claude, Multi-Agent→+Copilot, Orchestrator→+Antigravity)
  - N-6 (G-6): `success` KPI from domain — **32 domains** (standard presets only)
  - N-7: `orm` from backend (Python→SQLAlchemy, NestJS→TypeORM, else→Prisma; BaaS skip)
  - N-8: `scope_out` from absent payment/mobile/ai_auto (→ 決済機能/ネイティブアプリ/AI機能)
  - N-9: `future_features` from absent features (always 分析レポート+チーム機能)
  - G-1: `success` KPI for field presets from `PR_FIELD[key].field` category (20 categories)
  - G-2: `skill_level` from `S.skillLv` (0-1→Beginner, 2-4→Intermediate, 5-6→Professional)
  - G-3: `learning_goal` from `deadline` (3ヶ月→集中, 6ヶ月→標準, 12ヶ月→じっくり)
  - G-4: `learning_path` from backend/mobile/ai_auto/payment (BaaS→React+BaaS, Expo→Fullstack+Mobile, etc.)
- **`FIELD_CAT_DEFAULTS`** (20 categories) — Layer 2 category defaults for field presets (target, screens, payment, mobile, org_model)
- **`_SCALE_DEFAULTS`** (4 scales) — Layer 1 base for field presets (frontend, backend, deploy, ai_auto, css_fw, dev_methods)
- ⚠️ `Firebase Auth` chip: added to auth chip list in `questions.js` (non-beginner tier) — matches the value set by `_applyUniversalPostProcess` for Firebase backends

**expertHints system (added Creative UX Pack):**
- **`src/data/helpdata.js`** — `HELP_DATA[id].ja.expertHints[]` / `.en.expertHints[]` — arrays of `{icon, name, hint}` for 4 questions: `purpose`, `target`, `mvp_features`, `screens`
- **`src/ui/help.js`** — `showHelp()` reads `expertHints`, stores in `window._ehData` / `window._ehIdx`, renders via `_renderExpertHint(_ja)` helper
- **`cycleExpertHint()`** — global function, increments `window._ehIdx` mod length, updates `.help-expert-hint` DOM in place (no re-render)
- **CSS classes**: `.help-expert-hint`, `.help-eh-head`, `.help-eh-text`, `.help-eh-next` in `styles/all.css`

**Sidebar Pillar Icon Grid (v9.5.x):**
- **`src/ui/sidebar.js`** — `PILLAR_ICONS[20]`, `GEN_TO_PILLAR[20]` (gen step → pillar tab), `PILLAR_FIRST_FILE[20]` (pillar tab → first file path)
- **`renderPillarGrid()`** — renders 20 icon buttons; `inactive` when no files, `completed` when files exist; called from `initSidebar()` + `updateSidebarLabels()` + `finishGen()` + `clearFiles()`
- **`clickPillarIcon(genIdx)`** — switches `.piltab` active state, calls `showFileTree()` + `previewFile()` for regular pillars; `showExplorer/showDashboard/showAILauncher` for special pillars (4/5/7)
- **CSS**: `.sb-pillar-grid`, `.sb-pillar-icon` with `.inactive`/`.processing`/`.completed` states; reuses existing `@keyframes pillarPulse` — **do not add a duplicate declaration**
- **`src/generators/index.js`**: per-step `.processing`→`.completed` transition using pre-captured `_sbIc=_sbGrid.children[si]` (captured before `setTimeout`)

**7-Level Skill System (v9.5.x):**
- `S.skillLv` (0-6 int) and `S.skill` (beginner/intermediate/pro) coexist; `skillTier(lv)` maps lv→string
- `pickSkillLv(n)` in `src/data/presets.js` — clamps 0-6, syncs both fields, updates `#skillFineLabel`
- `pickSkill(t)` extended to also set `skillLv` to tier default (beginner→1, intermediate→3, pro→5)
- `load()` migration: if `skillLv` invalid, infer from `S.skill`
- **Lv-specific behaviors** (search for `S.skillLv` to find all gates):
  - Lv0: saas preset forced + Firebase default (`autoFillPhase2Defaults()`); `#heroLv0Hint` shown; `generateAll()` shows "チャットの質問に答えてから" toast instead of FE/BE/DB jargon
  - Lv0-1: badge filter (4 pillars only, `init.js`); icard simplification (`init.js`); `showCompatAlert()` errors-only; `_aiQs` shows micro-steps; `_startHere` card + ZIP urgency in `showExportGrid()`; token count hidden in export summary
  - Lv2: KPI chip count=8 (bridge); token count visible
  - Lv4+: recommended badge hidden; confirm dialog skipped (`wizard.js`: `S.skillLv>=5`)
  - Lv6+: evangelist section in docs/42; community sharing step in `guide.js`

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

**Current count:** 48 standard presets + 82 field presets (`PR_FIELD`) = 130 total (including custom)

**Field preset pattern** (`_fpd()` helper, `S.preset = 'field:KEY'`):
```javascript
PR_FIELD['biotech_drug'] = _fpd({
  name: 'バイオテクノロジー・創薬', nameEn: 'Biotech/Drug Discovery',
  field: 'biotech', scale: 'medium',   // field= must match FIELD_CAT_DEFAULTS key
  entities: 'Compound, Trial, Researcher',
  // Layer 1: _SCALE_DEFAULTS[scale]; Layer 2: FIELD_CAT_DEFAULTS[field]; Layer 3: fp direct; Layer 4: meta inference
});
```
Update `test/field-presets.test.js` assertion when adding to `PR_FIELD`. The `field` property must be one of the 20 `FIELD_CAT_DEFAULTS` keys for `success` KPI to be auto-inferred (G-1).

## Adding New Pillars

→ See `docs/CLAUDE-REFERENCE.md` for detailed 6-step process.

**Summary:** Create generator → Register in build system → Update UI & i18n → Update docs → Add tests → Check size budget (≤3000KB)

**⚠️ Easy to miss:** Add an `else if(pillar===N)` branch to `buildFileTree()` in `src/ui/preview.js` (line ~426). Each pillar tab maps to an index (P1=0 … P20=19). Without this, the pillar's docs are invisible in the file tree even though they exist in `S.files`.

**⚠️ Also update:** `PILLAR_FIRST_FILE` array in `src/ui/sidebar.js` (add the new pillar's first file at index N) and `GEN_TO_PILLAR` if the new gen step doesn't map 1:1 to the pillar index. Update Hero Section per the pattern documented in MEMORY.md.

## Generated Output

DevForge generates **135+ files** (base: 90 files, +4 for skills/ when ai_auto=multi/full/orch, +1 for business_model.md when payment≠none, +3 for P14 ops docs, +4 for P15 future strategy docs, +4 for P16 dev IQ docs, +4 for P17 prompt genome docs, +4 for P18 prompt ops docs, +4 for P19 enterprise docs (for SaaS-like domains), +4 for P20 CI/CD docs (all domains), +1 for docs/81_ux_proficiency_audit.md (all), +6 for .claude/ structure).

→ See `docs/CLAUDE-REFERENCE.md` for complete file catalog (per-version listings).

**Key pillars:**
- **.spec/** — constitution, specification, technical-plan, tasks, verification
- **.devcontainer/** — devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh
- **.claude/** — 3-layer AI rules (thin root + path-specific rules + settings)
- **docs/** — 81 documents including architecture, ER, API, screen, test-cases, security, release, WBS, prompt-playbook, design_system, qa_strategy, reverse_engineering, growth_intelligence, skill_guide, security_intelligence (OWASP 2025), threat_model, compliance_matrix, ai_security, security_testing, industry_blueprint, tech_radar, stakeholder_strategy, operational_excellence, ops_runbook, ops_checklist, prompt_genome, ai_maturity, prompt_composition, prompt_kpi, prompt_ops_pipeline, react_workflow, llmops_dashboard, prompt_registry, enterprise_architecture, workflow_engine, admin_dashboard_spec, enterprise_components, cicd_pipeline_design, deployment_strategy, quality_gate_matrix, release_engineering, ux_proficiency_audit
- **AI rules** — CLAUDE.md (thin), .claude/rules/ (5 files), .claude/settings.json, AI_BRIEF.md, .cursorrules, .clinerules, .windsurfrules, AGENTS.md, skills/ (project.md, factory.md, catalog.md, pipelines.md, skill_map.md, agents/)
- **CI/CD** — .github/workflows/ci.yml

## AI Prompt Launcher (Pillar ⑧)

DevForge includes a **Prompt Launcher** with **37 templates** that auto-inject project context (name, stack, auth, entities). Categories: spec/impl/test/debug/refactor/security/performance/ux/ai/ops.

**AI Model Recommendation Badges:** `AI_REC` map in `src/ui/launcher.js` — Gemini=precision (review/arch/metrics), Claude=ethical/UX (risk/ux_journey/strategy), ChatGPT=creative (brainstorm/nextgen/cognitive), Copilot=balanced (implement/test/debug).

→ See `docs/AI_CODING_PROMPTS.md` for full template list and details.

## Test Architecture

| Category | Test Files | ~Tests |
|----------|-----------|--------|
| Core/regression | gen-coherence, snapshot, r27-regression, r28-regression, build | ~342 |
| Data/coverage | data-coverage, presets, field-presets | ~62 |
| Security/compat | security, compat (+7 synergy) | ~108 |
| Pillars (P14-P20+skill) | ops, future, deviq, promptgenome, promptops, enterprise, cicd, skill-level | ~184 |
| Preset matching (Phase N/O) | phase-n (N-1〜N-9 + O G-1〜G-6, 60 tests) | ~60 |
| Other | i18n, state, techdb | ~23 |

**Total: 670 tests (all passing) + 7 synergy unit tests**

→ See `docs/CLAUDE-REFERENCE.md` for per-file test details.

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
