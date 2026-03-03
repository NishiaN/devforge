# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# DevForge v9.6.0

**AI Development OS** — 86 JS modules in `src/` → single `devforge-v9.html` (~4534KB / 6000KB limit).
Generates **225+ files** across **28 pillars** from a wizard-driven Q&A session.

## Documentation Map

- **CLAUDE.md** (this file) — critical rules, common bugs, quick reference
- **docs/CLAUDE-REFERENCE.md** — data structures, generated output catalog, pillar addition guide, test patterns
- **docs/CLAUDE-TROUBLESHOOTING.md** — environment setup, git workflow, deployment

## Build & Test

```bash
node build.js                          # → devforge-v9.html (~4970KB, limit 6000KB)
node build.js --no-minify              # debug (skip minification)
node build.js --report                 # build + size breakdown by module
npm test                               # 7269 tests, all passing (v9.10)
node --test test/gen-quality.test.js   # single test file
npm run dev                            # build + live-server :3000
npm run check                          # syntax-check extracted JS
node scripts/compat-check-all-presets.js  # verify 0 ERROR / 0 WARN across all preset combos

# Workflow: Edit src/ → npm test → node build.js → npm run open → commit
```

**Minification:** CSS via esbuild; JS via legacy regex minifier (comment removal DISABLED — generated docs contain `/* */` and `//` inside strings).

**✅ entity-ext.js dead-code bug FIXED (v9.7)**: `legacyMinJS` regex was changed from `[\s\S]*?` to `[^\n]*` (single-line only) and entity-ext.js header was converted to single-line, preventing the ~287KB of `ENTITY_COLUMNS` definitions from being stripped. `getEntityColumns()` now returns full 858-entry column data. Build size increased ~280KB (5089→5369KB) after fix.

## Architecture

Vanilla JS, no frameworks. CDN: marked.js, mermaid.js, JSZip.

**Module load order is critical** — defined in `jsFiles` array in `build.js`:
```
core/state.js, core/i18n.js  →  data/*.js  →  generators/*.js  →  ui/*.js  →  core/init.js
```
Never reorder without checking dependencies.

| Category | Purpose |
|----------|---------|
| `core/` | State (`S`), i18n (`t()`), keyboard events, wizard tour, app init |
| `data/` | 257 standard presets (`PR`/`_mp()`), 603 field presets (`PR_FIELD`/`_fpd()`), questions, techdb (478 entries), compat-rules (298 rules), gen-templates (bilingual GT dict), helpdata |
| `ui/launcher.js` | 90 prompt templates; `templateOrder[90]`, `AI_REC`, `LAUNCH_CAT_MAP`, `TEMPLATE_SCOPE`, `LAUNCH_SKILL_REC` maps; `DOC_GROUPS` for semantic doc grouping |
| `generators/` | `index.js` orchestrator + `p1`–`p28` pillars + `docs.js` + `common.js` |
| `ui/` | wizard, render, presets, preview, sidebar, editor, diff, export, explorer, dashboard, launcher, templates, qbar, cmdpalette, help, voice |
| `styles/all.css` | Theme (dark/light), responsive; CSS custom properties only |

## Global State: `S`

Defined in `src/core/state.js`. **Always call `save()` after mutations.**

```
S.answers       — wizard Q&A object
S.files         — generated file map {[path]: content}
S.preset        — 'saas' | 'field:biotech_drug' | 'custom'
S.lang          — UI language 'ja'|'en'
S.genLang       — generation output language 'ja'|'en'
S.skill         — 'beginner'|'intermediate'|'pro'
S.skillLv       — 0-6 (coexists with S.skill; skillTier(lv) maps to string)
S.pillar        — active pillar tab 0-26
S.editedFiles   — user-modified files set
S.pinnedFiles   — pinned file paths []
S.recentFiles   — MRU file paths [], max 10
```

Key helpers (all globally scoped): `save()`, `esc(s)`, `escAttr(s)`, `_jp(s,d)`, `sanitize(s,max)`, `sanitizeName(s)`, `fileSlug(s)`, `toast(msg)`, `hasDM(method)`.

## Critical Rules

1. **Edit `src/` only** — never touch `devforge-v9.html` directly
2. **No `${expr}` in single-quoted strings** — use concatenation
3. **Generator functions**: always start with `const G = S.genLang==='ja';`
4. **UI files**: declare `const _ja = S.lang==='ja';` at function top; never bare `S.lang==='ja'` — `build.test.js` will reject it. (Core files may use `const ja=...`)
5. **`getEntityColumns(name, G, knownEntities)`** — always pass all 3 args
6. **`save()`** after every `S` mutation
7. **Bilingual**: always add both `ja` + `en` fields; i18n arrays must stay in sync with `.kblbl` count in `index.html`
8. **CSS**: custom properties only (`--accent`, `--bg-2`, `--text`, etc.); add new vars to both `:root` and `[data-theme="light"]`. **Layout**: `.app` uses `min-height:100vh` (no overflow) for onboarding; add `.ws-on` class to `.app` when transitioning to workspace — this applies `height:100vh; overflow:hidden` for the 3-panel fixed layout. Always add via `$('app').classList.add('ws-on')` in any code that shows `#ws`.
9. **New UI modules**: two slots in `build.js` jsFiles — wizard-flow UI goes after `ui/preview.js` (before generators); dashboard/export UI goes after `generators/common.js` (before `core/events.js`)
10. **New state fields**: add default in `S` AND add restore line in `load()`

## Common Bugs

**Missing `+=`** — the most frequent error. `doc + 'text'` does nothing; always `doc += 'text'`. Empty generated files (especially Mermaid diagrams) almost always mean a missing `+=`.

**`_orm` detection in p7-roadmap.js** — checks all 5 ORMs: Prisma / Drizzle / TypeORM / SQLAlchemy / Kysely. Don't add new ORM checks without updating this chain.

**Entity name collisions** — different presets may define the same entity name with different schemas. Use descriptive names (`ContactMessage` not `Contact`) and check `ENTITY_COLUMNS` before adding.

**Invalid domain references** — `detectDomain()` in `common.js` returns exactly 32 domains. Never hardcode a domain string not in that list.

**Conditional questions** — always use `isQActive(q)` (in `src/ui/wizard.js`) before counting/displaying questions; prevents progress bar counting inapplicable questions.

**Property mismatches on helper objects** — if domain sections are empty, check the exact property names output by helpers like `_dpb()`, `_tm()`.

**Prototype pollution** — JSON imports must explicitly delete `__proto__`, `constructor`, `prototype` keys before `Object.assign`. Use `sanitize()` on all string values.

**XSS**: `esc()` for display text, `escAttr()` for attribute values, `textContent` (not `innerHTML`) for Mermaid, `_jp()` instead of `JSON.parse()` for localStorage.

**`@keyframes pillarPulse`** — already declared in `all.css`; do NOT add a duplicate.

## Preset → Wizard System

`_applyUniversalPostProcess()` in `src/ui/presets.js` auto-fills 25/25 wizard answers after any preset is selected:

- **N-3** `dev_env_type` ← BaaS backend (Firebase/Supabase → 'ローカル開発')
- **N-4** `org_model` ← `detectDomain(purpose)` (12-domain map)
- **N-5** `ai_tools` ← `ai_auto` level
- **N-6** `success` ← domain KPI (32 domains, standard presets)
- **N-7** `orm` ← backend language (Python→SQLAlchemy, NestJS→TypeORM, BaaS→skip, else→Prisma)
- **N-8** `scope_out` ← absent payment/mobile/ai_auto features
- **N-9** `future_features` ← always includes 分析レポート + チーム機能
- **G-1** `success` ← `FIELD_CAT_DEFAULTS[field]` (field presets, 34 categories)
- **G-2** `skill_level` ← `S.skillLv` (0-1→Beginner, 2-4→Intermediate, 5-6→Professional)
- **G-3** `learning_goal` ← `deadline` answer
- **G-4** `learning_path` ← backend/mobile/ai_auto/payment combination

Field presets use a 4-layer merge: `_SCALE_DEFAULTS[scale]` → `FIELD_CAT_DEFAULTS[field]` → direct preset fields → meta inference.

**N-8 `scope_out` condition**: only explicitly-set `'none'`/`'なし'` values add to scope_out — empty/unset does NOT. (`_pa&&/none|なし/i.test(_pa)`, not `!_pa||...`)

**PR key ≠ UI display name** — standard preset keys differ from their UI labels. Key examples:
`lms` (教育), `insurance_mgmt` (保険), `legal_docs` (法務), `gov_portal` (行政), `agri` (農業)
Always look up actual keys via `Object.keys(PR)` when writing test scripts.

**`detectDomain(purpose)`** — first-match priority array in `src/generators/common.js`. Order matters:
high-priority biotech/welfare → manufacturing-HRMS → education → EC → ... → domain-specific (manufacturing/logistics/agri/energy/gov/travel/insurance) → high-priority health → high-priority fintech → IoT → realestate → content → analytics → booking → ai → automation → ... → generic tool.
When adding patterns, place unambiguous domain keywords BEFORE the generic patterns they would otherwise hit.

## Adding Standard Presets

```javascript
// src/data/presets.js — add to PR object
saas_variant: _mp({
  name: '名前', nameEn: 'Name', icon: '🎯',
  purpose: '...', purposeEn: '...',
  target: ['...'], targetEn: ['...'],
  features: ['...'], featuresEn: ['...'],
  entities: 'User, Team, ...',
  payment: 'stripe',        // only override _PD defaults
}),
```

Then: add any new entities to `ENTITY_COLUMNS` in `common.js`; update count in `test/presets.test.js`.

**Field preset** (`_fpd()` helper): `field` must match one of the 44 `FIELD_CAT_DEFAULTS` keys (20 original + 14 in `presets-ext.js` + 10 in `presets-ext2.js`). Update `test/field-presets.test.js` count assertion.

**Field preset `meta` constraints** — validated by `test/field-presets.test.js`; invalid values cause test failures:
- `meta.revenue`: must be one of `subscription | btob | subsidy | freemium | usage | license | ec`
- `meta.onDevice`: must be one of `cloud | edge_cloud | on_device | on_premise` (NOT `'hybrid'`)

After adding presets, run `node scripts/compat-check-all-presets.js` to confirm 0 ERROR / 0 WARN.

## Adding New Pillars

Full 6-step process in `docs/CLAUDE-REFERENCE.md`. Key steps often missed:

1. Add `else if(pillar===N)` branch in `buildFileTree()` in `src/ui/preview.js` — without this the pillar's files are invisible in the file tree
2. Add entry to `PILLAR_FIRST_FILE[N]` and `GEN_TO_PILLAR[N]` in `src/ui/sidebar.js`
3. Update Hero Section in `src/index.html` + `src/core/init.js` (pbadge count + icard arrays)
4. Update `test/build.test.js` pbadge count assertion
5. Check size budget: `node build.js --report` (warn ≥5700KB, fail ≥6000KB)

## Adding Compat Rules

File: `src/data/compat-rules.js` — currently 298 rules (33E+140W+125I). All rules have `why_ja`/`why_en`.
**Launcher templates**: `src/ui/launcher.js` — currently 90 templates. When adding: register in `TEMPLATE_SCOPE`, both ja+en PT blocks, `AI_REC`, `templateOrder`, `LAUNCH_CAT_MAP`, `LAUNCH_SKILL_REC`; update button text count; update `test/skill-level.test.js` templateOrder.length assertion.
Structure: `{id, p:['field1','field2'], lv:'error'|'warn'|'info', t:conditionFn, ja, en, fix, fixFn, why_ja, why_en}`
`why_ja`/`why_en`: When set, shows "▶ なぜ？" expandable card in wizard alerts. **Size limits: `why_ja` ≤350B, `why_en` ≤270B** (UTF-8 bytes; CI 5000KB budget). Japanese is 3 bytes/char — keep to ≤115 characters.
After adding: update header comment totals, add tests to `test/compat.test.js`, update CLAUDE.md rule count.

## Test Architecture

| Category | Files | ~Tests |
|----------|-------|--------|
| Core/regression | gen-coherence, snapshot, r27/r28-regression, build | ~342 |
| Data/coverage | data-coverage, presets, field-presets | ~116 |
| Security/compat | security, compat (+7 synergy) | ~136 |
| Pillars (P14-P20+skill) | ops, future, deviq, promptgenome, promptops, enterprise, cicd, skill-level | ~184 |
| Generator tests | airules, strategy, reverse, observability | ~75 |
| Gen quality | gen-quality (Suites 1-400, ~6184 tests) | ~6184 |
| Preset matching | phase-n (N-1〜N-9 + G-1〜G-7, 68 tests) | ~68 |
| Other | i18n, state, techdb, utils, complexity, mermaid, help-hints | ~46 |

**Total: 7269 tests** | Test harness pattern: `eval(fs.readFileSync(...))` to load src files; global `S` mock at top.

**When adding domains**, update: `test/data-coverage.test.js` (4 arrays), `test/gen-coherence.test.js`, `test/ops.test.js`.

## Generated Output

212+ files. Conditional extras: `skills/` (+4, when ai_auto≠none), `business_model.md` (+1, when payment≠none), enterprise docs (+4, for SaaS-like domains), P19 skips 20/32 domains. `scaffolding/SETUP.md` always generated.

`docs/82_architecture_integrity_check.md` — always generated; scores ORM/Auth/CORS/async/soft-delete integrity (10.0 scale).

**File count ranges** (used in tests): `snapshot.test.js` A:148–215/B:138–204; `gen-quality.test.js` A25 120–222.

Key output structure:
- `.spec/` — constitution, specification, technical-plan, tasks, verification
- `.devcontainer/` — devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh
- `.claude/` — thin CLAUDE.md + 5 path-specific rules + settings.json
- `docs/` — 127 documents (00_devforge_guide … 127_manufacturing_iot_guide)
  - `docs/107_project_governance.md` — always generated; governance, decisions log, issue/CR management
  - `docs/108_uat_acceptance.md` — always generated; UAT scenarios (from features), Go/No-Go, defect mgmt
- AI rules — AI_BRIEF.md, .cursorrules, .clinerules, .windsurfrules, AGENTS.md, skills/
- CI/CD — .github/workflows/ci.yml

## Forbidden

- Raw SQL in application code (DDL/RLS in migrations is OK)
- `any` types
- `console.log` in production
- Hardcoded secrets
