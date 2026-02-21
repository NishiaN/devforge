# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# DevForge v9.6.0

**AI Development OS** — 57 JS modules in `src/` → single `devforge-v9.html` (~2249KB / 3000KB limit).
Generates **143+ files** across **22 pillars** from a wizard-driven Q&A session.

## Documentation Map

- **CLAUDE.md** (this file) — critical rules, common bugs, quick reference
- **docs/CLAUDE-REFERENCE.md** — data structures, generated output catalog, pillar addition guide, test patterns
- **docs/CLAUDE-TROUBLESHOOTING.md** — environment setup, git workflow, deployment

## Build & Test

```bash
node build.js                          # → devforge-v9.html (~2148KB, limit 3000KB)
node build.js --no-minify              # debug (skip minification)
npm test                               # 847 tests, all passing
node --test test/gen-quality.test.js   # single test file
npm run dev                            # build + live-server :3000
npm run check                          # syntax-check extracted JS

# Workflow: Edit src/ → npm test → node build.js → npm run open → commit
```

**Minification:** CSS via esbuild; JS via legacy regex minifier (comment removal DISABLED — generated docs contain `/* */` and `//` inside strings).

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
| `data/` | 48 standard presets (`PR`/`_mp()`), 82 field presets (`PR_FIELD`/`_fpd()`), questions, techdb, compat-rules (60 rules), gen-templates (bilingual GT dict), helpdata |
| `generators/` | `index.js` orchestrator + `p1`–`p20` pillars + `docs.js` + `common.js` |
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
S.pillar        — active pillar tab 0-19
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
8. **CSS**: custom properties only (`--accent`, `--bg-2`, `--text`, etc.); add new vars to both `:root` and `[data-theme="light"]`
9. **New UI modules**: add to `build.js` jsFiles after `ui/preview.js`, before generators
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
- **G-1** `success` ← `FIELD_CAT_DEFAULTS[field]` (field presets, 20 categories)
- **G-2** `skill_level` ← `S.skillLv` (0-1→Beginner, 2-4→Intermediate, 5-6→Professional)
- **G-3** `learning_goal` ← `deadline` answer
- **G-4** `learning_path` ← backend/mobile/ai_auto/payment combination

Field presets use a 4-layer merge: `_SCALE_DEFAULTS[scale]` → `FIELD_CAT_DEFAULTS[field]` → direct preset fields → meta inference.

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

**Field preset** (`_fpd()` helper): `field` must match one of the 20 `FIELD_CAT_DEFAULTS` keys. Update `test/field-presets.test.js` count assertion.

## Adding New Pillars

Full 6-step process in `docs/CLAUDE-REFERENCE.md`. Key steps often missed:

1. Add `else if(pillar===N)` branch in `buildFileTree()` in `src/ui/preview.js` — without this the pillar's files are invisible in the file tree
2. Add entry to `PILLAR_FIRST_FILE[N]` and `GEN_TO_PILLAR[N]` in `src/ui/sidebar.js`
3. Update Hero Section in `src/index.html` + `src/core/init.js` (pbadge count + icard arrays)
4. Update `test/build.test.js` pbadge count assertion
5. Check size budget: `node build.js --report` (warn ≥2800KB, fail ≥3000KB)

## Adding Compat Rules

File: `src/data/compat-rules.js` — currently 68 rules (13 error + 42 warn + 13 info).
Structure: `{id, p:['field1','field2'], lv:'error'|'warn'|'info', t:conditionFn, ja, en, fix, fixFn}`
After adding: update header comment totals, add tests to `test/compat.test.js`, update CLAUDE.md rule count.

## Test Architecture

| Category | Files | ~Tests |
|----------|-------|--------|
| Core/regression | gen-coherence, snapshot, r27/r28-regression, build | ~342 |
| Data/coverage | data-coverage, presets, field-presets | ~62 |
| Security/compat | security, compat (+7 synergy) | ~108 |
| Pillars (P14-P20+skill) | ops, future, deviq, promptgenome, promptops, enterprise, cicd, skill-level | ~184 |
| Gen quality | gen-quality (Suites 1-17, 120 tests) | ~121 |
| Preset matching | phase-n (N-1〜N-9 + G-1〜G-6, 60 tests) | ~60 |
| Other | i18n, state, techdb | ~23 |

**Total: 847 tests** | Test harness pattern: `eval(fs.readFileSync(...))` to load src files; global `S` mock at top.

**When adding domains**, update: `test/data-coverage.test.js` (4 arrays), `test/gen-coherence.test.js`, `test/ops.test.js`.

## Generated Output

136+ files. Conditional extras: `skills/` (+4, when ai_auto≠none), `business_model.md` (+1, when payment≠none), enterprise docs (+4, for SaaS-like domains), P19 skips 20/32 domains.

`docs/82_architecture_integrity_check.md` — always generated; scores ORM/Auth/CORS/async/soft-delete integrity (10.0 scale).

Key output structure:
- `.spec/` — constitution, specification, technical-plan, tasks, verification
- `.devcontainer/` — devcontainer.json, Dockerfile, docker-compose.yml, post-create.sh
- `.claude/` — thin CLAUDE.md + 5 path-specific rules + settings.json
- `docs/` — 90 documents (01_project_overview … 90_backup_disaster_recovery)
- AI rules — AI_BRIEF.md, .cursorrules, .clinerules, .windsurfrules, AGENTS.md, skills/
- CI/CD — .github/workflows/ci.yml

## Forbidden

- Raw SQL in application code (DDL/RLS in migrations is OK)
- `any` types
- `console.log` in production
- Hardcoded secrets
