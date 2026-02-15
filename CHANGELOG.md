# Changelog

All notable changes to DevForge v9 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (2026-02-15)
- **Cross-Platform Support**: Added `.gitattributes` for line ending normalization (prevents Windows CRLF issues)
- **Cross-Platform Support**: Added `.editorconfig` for editor settings standardization
- **Cross-Platform Guide**: New `docs/64_cross_platform_guide.md` with comprehensive troubleshooting
- **BaaS Dev Environment Modes**: New `dev_env_type` question for BaaS users with 3 modes:
  - **Local Development**: Auto-start emulators (offline-capable)
  - **Cloud Direct**: Connect to remote BaaS without emulators
  - **Hybrid**: Generate both configurations, manual switching via `.env.local`
- **Conditional DevContainer**: `post-create.sh` now adapts based on selected dev environment mode
- **Conditional .env.example**: Environment variables adapt to Local/Cloud/Hybrid mode
- **10 New Tests**: Cross-platform file validation, dev environment mode testing (335 tests total)

### Changed (2026-02-15)
- **File Count**: Increased from 111+ to 114+ files (base: 87 → 90)
- **Documentation**: Updated all file count references across codebase
- **P2 DevContainer**: Enhanced generator with dev environment type support
- **Test Suite**: Updated test count from 325 to 335 (all passing)
- **Build Size**: 1598KB (under 2000KB limit)

### Fixed (2026-02-15)
- Windows compatibility: CRLF line ending issues in shell scripts
- Cross-platform editor inconsistencies

---

## [9.3.0] - 2026-02-14

### Added
- **Pillar ⑯**: Polymorphic Development Intelligence (P16)
  - `docs/60_methodology_intelligence.md` — Development methodology selection
  - `docs/61_ai_brainstorm_playbook.md` — AI brainstorming prompts
  - `docs/62_industry_deep_dive.md` — Industry-specific deep dive
  - `docs/63_next_gen_ux_strategy.md` — Next-generation UX strategy
- **CLAUDE.md 3-Layer Split**: Thin root (~1.5K tokens) + path-specific rules
  - `.claude/rules/spec.md` — Spec-driven development
  - `.claude/rules/frontend.md` — Framework-specific FE rules
  - `.claude/rules/backend.md` — Architecture-aware BE rules
  - `.claude/rules/test.md` — Testing methodology
  - `.claude/rules/ops.md` — Operations & deployment
  - `.claude/settings.json` — Permissions & context config

### Changed
- Token consumption reduced from ~3K to ~1.5K through 3-layer CLAUDE.md split
- File count increased to 115+ (base: 87 + conditionals)

---

## [9.2.0] - 2026-02-13

### Added
- **Pillar ⑮**: Future Strategy Intelligence (P15)
  - `docs/56_market_positioning.md`
  - `docs/57_user_experience_strategy.md`
  - `docs/58_ecosystem_strategy.md`
  - `docs/59_regulatory_foresight.md`
- **Pillar ⑭**: Ops Intelligence (P14)
  - `docs/53_ops_runbook.md`
  - `docs/54_ops_checklist.md`
  - `docs/55_ops_plane_design.md`

### Changed
- File count increased to 111+ files
- Test count: 305+ tests (all passing)

---

## [9.0.0] - 2026-01

Initial release of DevForge v9 with 15 pillars and AI Development OS.

### Features
- 41 project presets
- 257 technology database entries
- 58 compatibility rules
- 16 pillar system
- Bilingual (Japanese/English) support
- AI rules for 10+ tools (Claude Code, Cursor, Windsurf, etc.)
- DevContainer automation
- MCP server configuration
- Interactive roadmap with 7-layer learning paths

[Unreleased]: https://github.com/NishiaN/devforge/compare/v9.3.0...HEAD
[9.3.0]: https://github.com/NishiaN/devforge/compare/v9.2.0...v9.3.0
[9.2.0]: https://github.com/NishiaN/devforge/compare/v9.0.0...v9.2.0
[9.0.0]: https://github.com/NishiaN/devforge/releases/tag/v9.0.0
