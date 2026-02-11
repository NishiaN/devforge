# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# DevForge v9.0

## Architecture
- **41 modules** in `src/` → `node build.js` → single `devforge-v9.html` (~639KB)
- Vanilla JS, no frameworks. CSS custom properties. CDN: marked.js, mermaid.js, JSZip.

## Build & Test
```bash
# Build
node build.js              # Produces devforge-v9.html (~639KB)
node build.js --no-minify  # Skip minification (debug)
node build.js --report     # Show size report
node build.js --check-css  # Validate CSS custom properties

# Test
npm test                   # Run all tests (178 tests, 49+ passing)
npm run test:watch         # Watch mode for test development
node --test test/gen-coherence.test.js  # Run single test file
node --test test/data-coverage.test.js  # Run data integrity tests

# Development
npm run dev                # Build + live-server on port 3000
npm run open               # Build + open in browser
npm run check              # Syntax check extracted JS
```

## Build Process Deep Dive

`build.js` concatenates 41 modules into single HTML:

1. **Read modules** in dependency order (defined in `jsFiles` array)
2. **Read CSS** from `styles/all.css`
3. **Minify** (unless `--no-minify` flag)
   - CSS: remove comments, collapse whitespace
   - JS: basic minification (not obfuscation)
4. **Inject** into `template.html` structure
5. **Write** to `devforge-v9.html`
6. **Validate** size ≤700KB (warn if exceeded)

### Module Load Order (Critical!)
```javascript
// Core state MUST load first
'core/state.js',
'core/i18n.js',
// Data before generators
'data/presets.js',
'data/questions.js',
'data/techdb.js',
// Generators depend on data
'generators/common.js',
'generators/p1-sdd.js',
// UI last
'ui/wizard.js',
'ui/render.js',
// Init triggers after all modules loaded
'core/init.js'
```

⚠️ **Changing module order can break dependencies!**

## Module Map
| Category | Files | Purpose |
|----------|-------|---------|
| core/ | state, i18n, events, tour, init | State, language, shortcuts |
| data/ | presets(36), questions, techdb, compat-rules, gen-templates, helpdata | Static data |
| generators/ | index, p1-sdd, p2-devcontainer, p3-mcp, p4-airules, p7-roadmap, p9-designsystem, p10-reverse, docs, common | 68-file generation engine |
| ui/ | wizard, render, edit, help, confirm, complexity, toc, voice, project, presets, preview, editor, diff, export, explorer, dashboard, templates | UI components |
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

**Helper Functions (state.js):**
- `save()` — Persist to localStorage
- `load()` — Restore from localStorage (with v8→v9 migration)
- `sanitize(s, max)` — Strip HTML, limit length
- `sanitizeName(s)` — Remove dangerous chars
- `fileSlug(s)` — Convert to filename-safe slug
- `toast(msg)` — Show 2.2s toast notification
- `hasDM(method)` — Check if dev_methods includes method
- `esc(s)` — HTML entity escape

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

## Coding Examples

### ❌ Wrong: Template literal in single-quoted string
```javascript
const msg = 'Hello ${name}';  // Won't interpolate!
```

### ✅ Correct: Use concatenation
```javascript
const msg = 'Hello ' + name;
```

### ❌ Wrong: Missing G constant
```javascript
function genDoc(answers, name) {
  return S.genLang === 'ja' ? '日本語' : 'English';
}
```

### ✅ Correct: Define G at function top
```javascript
function genDoc(answers, name) {
  const G = S.genLang === 'ja';
  return G ? '日本語' : 'English';
}
```

### ❌ Wrong: Missing 3rd arg to getEntityColumns
```javascript
const cols = getEntityColumns('User', G);  // May include undefined FK refs!
```

### ✅ Correct: Pass knownEntities
```javascript
const entities = ['User', 'Post', 'Comment'];
const cols = getEntityColumns('User', G, entities);
```

## Development Workflow
1. Make changes in `src/` modules
2. Run `npm test` to verify no regressions
3. Run `node build.js` to generate updated HTML
4. Test in browser with `npm run open`
5. Before commit: ensure all tests pass + build succeeds

## Git Workflow & Deployment

### First-Time Setup
```bash
# Configure Git identity (if not set)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Or use GitHub noreply email
git config user.email "[username]@users.noreply.github.com"
```

### Standard Commit Flow
```bash
# 1. Make changes in src/
# 2. Test
npm test

# 3. Build
node build.js

# 4. Review changes
git status
git diff

# 5. Stage files (prefer specific files over git add .)
git add src/core/state.js devforge-v9.html

# 6. Commit with Co-Authored-By
git commit -m "feat: Add new feature

Description of changes here.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 7. Push
git push
```

### SSH vs HTTPS
- **SSH** (recommended): Requires SSH key setup, no password prompts
- **HTTPS**: Requires Personal Access Token (PAT), passwords deprecated

**Set up SSH:**
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copy and add to GitHub Settings → SSH Keys
git remote set-url origin git@github.com:user/repo.git
```

### Built HTML Tracking
- By default, `devforge-v9.html` is gitignored (build artifact)
- For GitHub Pages: **must commit** the built HTML
- Trade-off: Larger diffs, but enables static hosting

## Key Data Structures & Helper Functions

### src/generators/common.js
**Data Structures:**
- **ENTITY_COLUMNS**: 127 entity schemas with FK/constraints (medical, property mgmt, contracts, helpdesk, tutoring, restaurant, construction, knowledge base, field service, etc.)
- **ENTITY_METHODS**: REST API method restrictions per entity
- **FEATURE_DETAILS**: 21 feature patterns with acceptance criteria & test cases (auth, courses, subscriptions, search, notifications, analytics, team mgmt, chat, export, calendar, inventory, etc.)
- **SCREEN_COMPONENTS**: UI component dictionary by screen type
- **DOMAIN_ENTITIES**: Core entities per domain with warnings & suggestions
- **DOMAIN_QA_MAP**: 16 domain-specific QA strategies (focus areas, common bugs, priorities)
- **DOMAIN_PLAYBOOK**: 16 complete domain playbooks with implementation flows, compliance rules, bug prevention, context mapping, and AI skills

### src/generators/p10-reverse.js
**Data Structures:**
- **REVERSE_FLOW_MAP**: 15 domain-specific reverse engineering templates + \_default
  - Each domain has: goal (ja/en), flow steps (ja/en), KPIs (ja/en), risks (ja/en)
  - Used by `genPillar10_ReverseEngineering()` with `detectDomain()` to select template

**Helper Functions:**
- **`pluralize(name)`** — Smart table name pluralization
- **`getEntityColumns(name, G, knownEntities)`** — Get columns for entity (ALWAYS pass 3 args)
- **`getEntityMethods(name)`** — Get allowed REST methods for entity
- **`detectDomain(purpose)`** — Infer domain from purpose text (15 domains supported)
  - Returns: 'education', 'ec', 'marketplace', 'community', 'content', 'analytics', 'booking', 'saas', 'iot', 'realestate', 'legal', 'hr', 'fintech', 'portfolio', 'tool', or null
  - Used by: AI skills catalog generation, domain-specific KPI/acceptance criteria
  - Pattern matching: regex-based on Japanese/English keywords in purpose text
- **`resolveAuth(answers)`** — Determine auth architecture from answers
- **`getScreenComponents(screenName, G)`** — Get UI components for screen type

### src/core/state.js
- **`save()`** — Persist state to localStorage
- **`load()`** — Restore state from localStorage
- **`sanitize(s, max=500)`** — Strip HTML, limit chars
- **`sanitizeName(s)`** — Remove dangerous chars for names
- **`fileSlug(s)`** — Convert to filename-safe slug
- **`toast(msg)`** — Show 2.2s notification
- **`hasDM(method)`** — Check if dev_methods includes method
- **`esc(s)`** — HTML entity escape

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

## Adding Translations

1. **Add keys to `src/core/i18n.js`:**
```javascript
const I18N = {
  ja: {
    myNewKey: '日本語テキスト',
    // ...
  },
  en: {
    myNewKey: 'English text',
    // ...
  }
};
```

2. **Use in UI code:**
```javascript
const t = (k) => I18N[S.lang][k] || k;
// UI text
const label = t('myNewKey');
// Or inline ternary for short text
const text = S.lang === 'ja' ? '日本語' : 'English';
```

3. **For generated content**, use `G` constant:
```javascript
const G = S.genLang === 'ja';
const content = G ? '生成された日本語' : 'Generated English';
```

## Adding New Presets

Edit `src/data/presets.js` and add to `PR` object:

```javascript
const PR = {
  my_preset: {
    name: '日本語名',
    nameEn: 'English Name',
    icon: '🎯',
    purpose: '日本語の目的説明',
    purposeEn: 'English purpose description',
    target: ['ターゲット1', 'ターゲット2'],
    targetEn: ['Target1', 'Target2'],
    frontend: 'React + Next.js',
    backend: 'Supabase',
    features: ['機能1', '機能2', '機能3'],
    featuresEn: ['Feature1', 'Feature2', 'Feature3'],
    entities: 'Entity1, Entity2, Entity3',
    mobile: 'none',  // or 'Expo (React Native)'
    ai_auto: 'none',  // or 'Vibe Coding入門' | 'マルチAgent協調'
    payment: 'stripe'  // or 'none' | 'ec_build'
  },
  // ... rest of PR
};
```

⚠️ **Update preset count in README.md if adding/removing presets.**

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
- Run `node build.js --report` to verify ≤700KB
- Current budget remaining: ~101KB (as of Industry Intelligence Engine)

**Reference Implementation:** See commits for Pillar ⑩ (Reverse Engineering) for complete example.

### Compression Patterns (Critical for Size Management)

To stay under 700KB limit, the codebase uses compression patterns:

**1. Preset Defaults (`src/data/presets.js`)**
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

**2. Common Entity Columns (`src/generators/common.js`)**
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

## Generated Output (67-69 files)
When users complete the wizard, DevForge generates **67-69 files** (base: 67 files, +2 when ai_auto ≠ None for skills/catalog.md and skills/pipelines.md):
- **.spec/** — constitution.md, specification.md, technical-plan.md, tasks.md, verification.md
- **.devcontainer/** — devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh
- **docs/** — architecture.md, ER.md, API.md, screen.md, test-cases.md, security.md, release.md, WBS.md, prompt-playbook.md, tasks.md, **progress.md (24)**, **error_logs.md (25)**, **design_system.md (26)**, **sequence_diagrams.md (27)**, **qa_strategy.md (28)**, **reverse_engineering.md (29)**, **goal_decomposition.md (30)**, **industry_playbook.md (31)**
- **AI rules** — CLAUDE.md (with Workflow Cycle & Context Management), AI_BRIEF.md (with Context Protocol, ~1200 tokens), .cursorrules, .clinerules, .windsurfrules, AGENTS.md, .cursor/rules, **skills/** (project.md, catalog.md*, pipelines.md*)
- **CI/CD** — .github/workflows/ci.yml

\* **skills/catalog.md** and **skills/pipelines.md** are generated only when ai_auto ≠ None

### Skills System (Manus Skills Integration)
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

**Recent Enhancement (Phase 1 Context Engineering):**
- Added `docs/24_progress.md` — AI-updateable progress tracker with Sprint-based task management
- Added `docs/25_error_logs.md` — Error recording system for preventing bug recurrence
- Enhanced CLAUDE.md with Workflow Cycle (5 steps) and Context Management principles
- Enhanced AI_BRIEF.md with 7-step Context Protocol

**Recent Enhancement (Pillar 9: Design System):**
- Added `docs/26_design_system.md` — Design tokens, color palettes, typography, spacing, component catalog (framework-aware for Tailwind/Vuetify/Material)
- Added `docs/27_sequence_diagrams.md` — Mermaid sequence diagrams for auth flows (Supabase/Firebase/Auth.js), CRUD operations, payment flows (Stripe)

**Recent Enhancement (AI Skills & Agent Pipelines - Balanced Expansion):**
- Enhanced `skills/project.md` — Factory Template format with 5 core skills
- Expanded `skills/catalog.md` — 15 domains supported (education, ec, saas, community, booking, health, marketplace, content, analytics, business, iot, realestate, legal, hr, fintech)
- 19 detailed skills with Input/Process/Output specifications (14 core + 5 domain-specific: デバイス管理, 物件管理, 契約レビュー, 採用フロー, 取引検証)
- 4 advanced skills with full details for Multi-Agent level (Parallel Review, Auto Code Review, Auto Doc Update, Compression)
- Added `skills/pipelines.md` — Autonomous agent pipelines with Mermaid flowcharts (1-5 pipelines based on ai_auto level)
- Enhanced `AGENTS.md` — Pipeline coordination section
- Enhanced `detectDomain()` in common.js — Now supports 15 domains with IoT, real estate, legal, HR, and fintech detection patterns

## Test Architecture
| File | Tests | Purpose |
|------|-------|---------|
| gen-coherence.test.js | 248 assertions | Full LMS generation + structural validation |
| snapshot.test.js | 38 tests | 6 scenario regression (LMS/Blog/EC/English/PropertyMgmt/Helpdesk) + context engineering + skills validation |
| data-coverage.test.js | 28 tests | Data integrity: entity coverage, FK validation, domain detection, playbook completeness |
| r27-regression.test.js | 17 tests | Bug fixes: prices, FK, KPI, ports |
| r28-regression.test.js | 19 tests | Quality: REST methods, AC, scope_out, verification |
| build.test.js | build | Build size ≤700KB |
| compat.test.js | 45 tests | Compatibility validation |
| Others | ~21 tests | i18n, presets, state, techdb |

**Total: 178 tests (49+ passing, some edge case tests expected to have minor failures)**

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

## Size Budget Management

DevForge has a strict **700KB size limit** for the built HTML file. Current size: **639KB** (~61KB under budget).

### Expansion Strategy
When adding new features, follow the "Balanced Expansion" approach:
1. **Estimate size impact** before implementing
2. **Use compression patterns** (see Compression Patterns section)
3. **Prioritize high-value additions** (core skills > niche features)
4. **Test frequently** with `node build.js --report`

### Recent Expansion (Feb 2026)
- **Budget allocated**: 100KB (from 600KB→700KB limit increase)
- **Actual usage**: ~24KB (Industry Intelligence Engine: 15 domains, docs/31, context protocols)
- **Added**: Industry Intelligence Engine, DOMAIN_PLAYBOOK, domain-specific compliance/bugs/skills
- **Remaining budget**: 101KB for future enhancements

### Size Optimization Tips
- Reuse common patterns (see `_U`, `_SA`, `_SD`, `_T`, `_D`, `_CN`, `_M`, `_B`, etc. in common.js)
- Use abbreviations in compressed strings (e.g., `G` for `S.genLang==='ja'`)
- Use `_dpb()` helper for domain playbooks to reduce duplication
- Avoid duplicate text across presets/domains
- Test with `node build.js --report` to see module breakdown
- Current compression rate: ~10% of entity columns use shared constants

## Environment
- **Node.js**: Required for build/test. If using WSL with nvm, ensure nvm is loaded in shell
- **Browser**: Generated HTML runs in any modern browser (Chrome, Firefox, Safari, Edge)
- **CDN Dependencies**: marked.js, mermaid.js, JSZip (loaded at runtime)

## GitHub Pages Deployment

### Initial Setup
1. Repository must be **Public** (Pages unavailable for Private repos on Free plan)
2. Settings → Pages → Source: `Deploy from a branch`
3. Branch: `main`, Folder: `/ (root)`

### Important: Built HTML Must Be Committed
- `devforge-v9.html` is in `.gitignore` by default (build artifact)
- For GitHub Pages, **comment out** the line in `.gitignore`:
  ```gitignore
  # devforge-v9.html  ← Comment this for Pages deployment
  ```
- Commit the built HTML: `git add -f devforge-v9.html`
- Push to trigger deployment

### Troubleshooting Pages
- **"Not Found" on Pages settings**: Repository must be Public
- **404 on site**: Ensure `index.html` and `devforge-v9.html` are committed
- **Changes not reflected**: Hard refresh (`Ctrl+Shift+R`) or wait 1-2 minutes for cache
- **Deployment history**: Check https://github.com/[user]/[repo]/deployments

## Forbidden
- No raw SQL in application code (OK: DDL/RLS in migrations)
- No `any` types
- No console.log in production
- No hardcoded secrets

## Troubleshooting

### Build fails with "SyntaxError"
- Check for `${}` inside single-quoted strings — use concatenation
- Verify all functions close their braces
- Run `npm run check` to validate syntax

### Tests fail after adding new generator
- Ensure new generator is loaded in test files with `eval(fs.readFileSync(...))`
- Verify generator doesn't mutate global state unexpectedly
- Check that `const G = S.genLang === 'ja';` is defined at function top

### Generated files missing entities
- Verify entity names are passed to `getEntityColumns(name, G, knownEntities)`
- Check `data_entities` answer is parsed correctly in generator
- Ensure entity name matches ENTITY_COLUMNS keys in `common.js`

### LocalStorage quota exceeded
- DevForge stores ~500KB per project in localStorage
- Clear old projects via Project Manager (⌘/Ctrl+P)
- Browser limit: ~5-10MB depending on browser

### i18n key not found
- Ensure key exists in both `I18N.ja` and `I18N.en`
- Use `t('key')` function, not direct `I18N[key]` access
- Check for typos in key names

### Module dependency errors
- Verify module load order in `build.js` → `jsFiles` array
- Core modules must load before UI modules
- Data modules must load before generators

### HTML Entity Escaping Issues
**Symptom:** Literal `</div>` or `<div>` text appears on page

**Cause:** Using HTML entities (`&lt;`, `&gt;`) instead of actual tags in `innerHTML`

**Example:**
```javascript
// ❌ Wrong: Creates literal text "</div>"
el.innerHTML = '<div>&lt;/div>';

// ✅ Correct: Creates proper closing tag
el.innerHTML = '<div></div>';
```

**Common locations:**
- Dynamic content generation (tour.js, render.js)
- Template strings building HTML
- Copy-paste from HTML-encoded sources

**Fix:** Search for `&lt;` and `&gt;` in source files, replace with `<` and `>`

### Node.js Not Found (WSL/nvm)
**Symptom:** `bash: node: command not found`

**Cause:** nvm not loaded in current shell session

**Fix:**
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
node build.js
```

**Permanent fix:** Add to `~/.bashrc` (already done if nvm installed correctly)

### Wizard progress shows wrong completion percentage
**Symptom:** Progress bar shows questions as "unanswered" even though they're not applicable (e.g., `orm` question when using Supabase)

**Cause:** Progress counting doesn't respect conditional questions

**Fix:** Ensure all progress-related functions use `isQActive(q)`:
```javascript
// ✅ Correct: Only count active questions
ph.questions.forEach(q => {
  if(!isQActive(q)) return;  // Skip inactive
  total++;
  if(S.answers[q.id]) done++;
});

// ❌ Wrong: Counts all questions regardless of conditions
total += ph.questions.length;
```

**Common locations to check:**
- `updProgress()` — Progress bar calculation
- `initPills()` — Sidebar question list initialization
- `findNext()` — Next unanswered question search
