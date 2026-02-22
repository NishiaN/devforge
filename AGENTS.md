# AGENTS.md — DevForge v9.6.0

## Project
62 JS modules → single `devforge-v9.html` (~2634KB / 3000KB limit).
Vanilla JS, no frameworks. CDN: marked.js, mermaid.js, JSZip.
Generates **175+ files** across **25 pillars** from a wizard-driven Q&A session.

## Commands
```bash
node build.js          # build → devforge-v9.html
node build.js --report # build + size breakdown
npm test               # 1059 tests, all passing
npm run dev            # build + live-server :3000
```

## Module Load Order (critical — never reorder)
```
core/state.js, core/i18n.js → data/*.js → generators/*.js → ui/*.js → core/init.js
```

## Agent Roles

**UI Agent** (`src/ui/`):
- Always declare `const _ja = S.lang==='ja';` at function top (never bare `S.lang==='ja'`)
- CSS custom properties only (`--accent`, `--bg-2`, `--text`, etc.)
- Test both dark/light themes and ja/en languages

**Generator Agent** (`src/generators/`):
- Start every generator function with `const G = S.genLang==='ja';`
- Never use `${}` inside single-quoted strings — use concatenation
- Always use `+=` when building strings (`doc + 'text'` does nothing)
- `getEntityColumns(name, G, knownEntities)` — always pass all 3 args

**Data Agent** (`src/data/`):
- 48 standard presets (`PR` / `_mp()`), 138 field presets (`PR_FIELD` / `_fpd()`)
- 10 extended categories + 40 presets in `presets-ext2.js` (62nd module)
- techdb.js: 338 entries; compat-rules.js: 91 rules (13E+53W+25I)
- `detectDomain(purpose)` returns exactly 32 domains — never hardcode unlisted ones

**Test Agent** (`test/`):
- 1059 tests across 27 test files; harness: `eval(fs.readFileSync(...))` pattern
- `test/harness.js` loads `presets-ext2.js` — file must exist in git or CI crashes
- Run `node build.js` before `npm test` when build.test.js reads from output file

## Key Helpers (common.js, globally scoped)
- `resolveORM(a)` — 5 ORMs + BaaS + Python default; returns `{name,dir,isBaaS,isPython}`
- `resolveAuth(a)` — JWT library by backend language
- `detectDomain(purpose)` — 32-domain inference from purpose text
- `inferStakeholder(domain)` — enterprise/team/developer/startup
- `genADR(a,pn)` — ADR doc generation (docs/00)
- `genArchIntegrityCheck()` — docs/82; C-A〜C-L integrity checks
- `save()`, `esc(s)`, `escAttr(s)`, `_jp(s,d)`, `sanitize(s,max)`, `toast(msg)`

## After Any Change
```bash
npm test && node build.js
```

**See CLAUDE.md for complete documentation** — authoritative source of truth.
