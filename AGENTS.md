# AGENTS.md — DevForge v9.0

## Project
39-module web app → builds to single HTML (~484KB).
Vanilla JS + CSS custom properties + CDN libs (marked.js, mermaid.js, JSZip).
Generates 62 project spec files from wizard answers.

## Build: `node build.js`
## Test: `npm test` (127 tests + 248 assertions)

## Agent Roles
- **UI Agent**: `src/ui/` — CSS custom properties, test both themes/languages
- **Generator Agent**: `src/generators/` — Define `const G=S.genLang==='ja'` at top. Never `${}` in single quotes
- **Data Agent**: `src/data/` — 26 presets, ENTITY_COLUMNS (30+ entities), FEATURE_DETAILS, ENTITY_METHODS, compat-rules
- **I18N Agent**: `src/core/i18n.js` + `src/data/` — Every string needs JA+EN
- **Test Agent**: `test/` — 127 tests across 9 test files

## After Changes: `npm test && node build.js`

## Key Data Maps (common.js)
- `ENTITY_COLUMNS` — 30+ entity column definitions with FK/constraint/i18n
- `ENTITY_METHODS` — REST API method restrictions per entity (18 entries)
- `FEATURE_DETAILS` — Domain-specific acceptance criteria per feature
- `getEntityColumns(name, G, knownEntities)` — Always pass knownEntities (3rd arg)
- `getEntityMethods(name)` — Returns allowed HTTP methods
- `detectDomain(purpose)` — Returns domain key for KPI/scope inference
