# DevForge v9

**AI Development OS** — Answer questions, auto-generate 196+ project files across 27 pillars.

> Single-file web app. No install. Open `devforge-v9.html` in any browser and start building.

---

## What it does

DevForge turns a wizard-driven Q&A session into a complete project specification suite:

- **196+ files** — specs, AI rules, devcontainer, CI/CD, roadmap, docs, and more
- **27 pillars** — from SDD and security to FinOps and observability
- **143 standard presets** + **502 field-specific presets** (biotech, robotics, genomics, …)
- **395-entry TechDB** — stack comparison with recommendations
- **53 AI prompt templates** — one-click feed to Claude, Cursor, Copilot, Windsurf, etc.
- **Bilingual** — Japanese / English UI and generated output

---

## Quick start

1. Download `devforge-v9.html`
2. Open it in Chrome / Edge / Firefox
3. Pick a skill level → choose a preset → answer Phase 1–3 questions → click **Generate**
4. Download ZIP or copy all files to your AI tool

---

## 27 Pillars

| # | Pillar | Key Output |
|---|--------|-----------|
| ① | SDD Integration | constitution, specification, technical-plan, tasks, verification |
| ② | DevContainer | devcontainer.json, Dockerfile, docker-compose.yml |
| ③ | MCP Config | project-context.md, tools-manifest.json, mcp-config.json |
| ④ | AI Rules | CLAUDE.md, .cursorrules, .windsurfrules, AGENTS.md, skills/ |
| ⑤ | Parallel Explorer | 7-stack comparison + recommendation ranking |
| ⑥ | Dashboard | Context visualization + TechDB browser |
| ⑦ | Roadmap | Interactive learning path (layer-based progress) |
| ⑧ | AI Launcher | 53 prompt templates + token estimation |
| ⑨ | Design System | Design tokens + sequence diagrams |
| ⑩ | Reverse Engineering | Goal-driven reverse planning |
| ⑪ | Impl Guide | Domain-specific patterns + AI runbook |
| ⑫ | Security | OWASP/STRIDE audit prompts, compliance |
| ⑬ | Strategic Intelligence | Industry blueprint + tech radar |
| ⑭ | Ops Intelligence | SLO/SLI, Feature Flags, 12 Ops Capabilities |
| ⑮ | Future Strategy | Market + UX + ecosystem foresight (2026–2035) |
| ⑯ | Dev IQ | 32 domains × 12 approaches |
| ⑰ | Prompt Genome | CRITERIA 8-axis quality scoring |
| ⑱ | Prompt Ops | ReAct workflow + LLMOps dashboard |
| ⑲ | Enterprise SaaS | Multi-tenant design + org model |
| ⑳ | CI/CD Intelligence | 9-stage pipeline + deploy strategy |
| ㉑ | API Intelligence | REST/GraphQL + OpenAPI + OWASP |
| ㉒ | DB Intelligence | ORM schema + N+1 fix + migration |
| ㉓ | Test Intelligence | Test pyramid + E2E + Web Vitals |
| ㉔ | AI Safety | 4-layer guardrails + prompt injection defense |
| ㉕ | Performance | Core Web Vitals + cache + Lighthouse CI |
| ㉖ | Observability | OpenTelemetry + RED/USE metrics + Grafana |
| ㉗ | Cost Optimization | FinOps maturity + budget alerts + AI cost analysis |

---

## Development

```bash
# Install dev dependencies
npm install

# Build (concatenate + minify → devforge-v9.html)
node build.js

# Build with size report
node build.js --report

# Run all tests (6122 tests)
npm test

# Build + open in browser
npm run dev

# Verify 0 compat errors across all preset combos
node scripts/compat-check-all-presets.js
```

**Build limit:** 5000KB (current: ~4012KB)

### Architecture

73 JS modules in `src/` are concatenated in dependency order into a single HTML file:

```
core/state.js, core/i18n.js
  → data/*.js  (presets, questions, techdb, compat-rules, …)
  → generators/*.js  (p1–p27, docs, common)
  → ui/*.js  (wizard, render, sidebar, launcher, …)
  → core/init.js
```

All functions are globally scoped. `S` is the global state object. Call `save()` after any mutation.

See [`CLAUDE.md`](CLAUDE.md) for the full contributor guide.

---

## Stats

| | |
|--|--|
| Modules | 73 JS |
| Build size | ~4012KB |
| Tests | 6122 |
| Standard presets | 143 |
| Field presets | 502 |
| TechDB entries | 395 |
| Compat rules | 202 |
| Launcher templates | 53 |
| Generated files | 196+ |
| Pillars | 27 |

---

© 2026 エンジニアリングのタネ制作委員会 / by にしあん
