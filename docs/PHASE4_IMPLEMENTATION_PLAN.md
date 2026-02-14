# Phase 4: CLAUDE.md 3-Layer Split — 実装計画書

**目的:** 生成されるCLAUDE.mdを3層に分割し、AI開発効率を最大化する

**推定工数:** 2-3時間
**推定サイズ影響:** +8-10KB
**難易度:** 高（複雑な文字列生成ロジック）

---

## 📋 現状分析

### 現在の構造（v9.2.0）
- **単一CLAUDE.md** (~3Kトークン) — すべてのルールが1ファイルに凝縮
- **問題点:**
  - トークン消費が大きい（毎回全ルール読み込み）
  - パス別最適化ができない
  - Claude.ai の `.claude/rules/` システムを活用していない

### 目標構造（v9.3.0）
```
root/
├── CLAUDE.md                    # Layer A: 薄いルート (~1.5K tokens)
└── .claude/
    ├── rules/                   # Layer B: パス別ルール
    │   ├── spec.md             # .spec/** 専用
    │   ├── frontend.md         # src/components/**, app/** 専用
    │   ├── backend.md          # src/api/**, src/lib/** 専用
    │   ├── test.md             # **/*.test.*, **/*.spec.* 専用
    │   └── ops.md              # .github/**, docs/34_*, docs/53_*, docs/54_* 専用
    └── settings.json           # Layer C: 権限・コンテキスト設定
```

---

## 🎯 実装ステップ

### Step 1: Layer A — 薄いルートCLAUDE.md

**ファイル:** `src/generators/p4-airules.js` の `genCLAUDEMD()` 関数を更新

**内容:**
1. プロジェクト概要（名前、スタック、認証）
2. 必須ルール（Forbidden、Auth SoT）
3. Rule Filesへの参照リンク
4. ワークフローサイクル（圧縮版）

**圧縮前 (~3K tokens) → 圧縮後 (~1.5K tokens)**

```markdown
# ${pn} — Development Rules

## Overview
- **Stack**: ${fe} + ${be} + ${db}
- **Architecture**: ${archNote}
- **Auth SoT**: ${auth.sot}
- **Methods**: ${devMethods}

## Critical Rules
### Forbidden
${forbidden}

### Auth Source of Truth
All auth state MUST come from ${auth.sot}. Never duplicate auth logic.

## Rule Files
For path-specific detailed rules, see:
- `.claude/rules/spec.md` — Specification-driven development rules
- `.claude/rules/frontend.md` — Frontend development rules
- `.claude/rules/backend.md` — Backend development rules
- `.claude/rules/test.md` — Testing methodology rules
- `.claude/rules/ops.md` — Operations and deployment rules

**When working on specific paths**, Claude will automatically load the relevant rule file.

## Workflow
1. **Feature** → Check `.spec/` → Implement → Test → Commit
2. **Bug** → Reproduce → Fix → Test → Commit
3. **Always** → Run tests before commit

## Quick Reference
- Spec Dir: `.spec/`
- Docs Dir: `docs/`
- Test Command: \`npm test\`
- Build Command: \`npm run build\`
```

---

### Step 2: Layer B — `.claude/rules/` パス別ルール

**ファイル:** 5つの新しいルールファイルを生成

#### 2-1. `.claude/rules/spec.md`

```yaml
---
paths:
  - ".spec/**"
alwaysApply: false
---

# Spec-Driven Development Rules

## File Selection Matrix
| Task Type | Read Files | Write Files |
|-----------|------------|-------------|
| Feature Planning | constitution, specification | specification, technical-plan |
| Architecture Design | specification, technical-plan | technical-plan, tasks |
| Task Breakdown | specification, technical-plan, tasks | tasks, verification |
| Implementation | All .spec files | (Code files, not .spec) |
| Verification | verification | verification (update status) |

## Spec Integrity Rules
1. **Constitution is immutable** — Never edit after initial creation
2. **Specification is the source of truth** — All features defined here first
3. **Technical-plan must match specification** — No implementation without spec
4. **Tasks must reference specification** — Every task links to requirements
5. **Verification validates specification** — Test against acceptance criteria

## Workflow
\`\`\`mermaid
graph LR
  A[Feature Request] --> B[Update specification]
  B --> C[Update technical-plan]
  C --> D[Generate tasks]
  D --> E[Implement]
  E --> F[Update verification]
\`\`\`
```

#### 2-2. `.claude/rules/frontend.md`

**スタック別ルール生成** (React/Vue/Svelte/Next)

```javascript
// 動的生成ロジック
function genFrontendRules(fe, G) {
  const rules = {
    react: {
      conventions: ['Functional components + hooks', 'Props destructuring', 'Avoid default exports for components'],
      stateManagement: 'Context API for global state, useState/useReducer for local',
      styling: 'CSS Modules or Tailwind, avoid inline styles',
      patterns: ['Custom hooks for reusable logic', 'Error boundaries for error handling', 'Suspense for lazy loading']
    },
    vue: {
      conventions: ['Composition API (Vue 3)', 'Script setup syntax', 'Single-file components'],
      stateManagement: 'Pinia for global state, reactive() for local',
      styling: 'Scoped styles in SFC',
      patterns: ['Composables for reusable logic', 'Provide/inject for deep prop passing', 'Teleport for modals']
    },
    // ... other frameworks
  };

  const frameworkKey = fe.includes('React') ? 'react' : fe.includes('Vue') ? 'vue' : 'react';
  const r = rules[frameworkKey];

  return `---
paths:
  - "src/components/**"
  - "app/**"
  - "pages/**"
alwaysApply: false
---

# Frontend Development Rules (${fe})

## Conventions
${r.conventions.map(c => `- ${c}`).join('\n')}

## State Management
${r.stateManagement}

## Styling
${r.styling}

## Patterns
${r.patterns.map(p => `- ${p}`).join('\n')}

## Testing
- Unit tests for utilities: Vitest
- Component tests: Testing Library
- E2E tests: Playwright
`;
}
```

#### 2-3. `.claude/rules/backend.md`

**アーキテクチャ別ルール生成** (BaaS/BFF/Traditional)

```javascript
function genBackendRules(arch, be, G) {
  if (arch.isBaaS) {
    return `---
paths:
  - "src/lib/**"
  - "supabase/**"
  - "app/**/actions.ts"
alwaysApply: false
---

# Backend Rules (BaaS: ${be})

## Architecture Pattern
- **BaaS Integration**: No separate Express server
- **Server Actions**: Use Next.js Server Actions for mutations
- **RLS**: Row-Level Security policies for ALL tables
- **Auth**: ${be} handles authentication

## Database Rules
1. **No raw SQL in application code** — Use ${be} client methods
2. **OK: DDL/RLS in migrations** — \`supabase/migrations/*.sql\`
3. **All tables MUST have RLS** — Enable and define policies
4. **Foreign keys required** — Maintain referential integrity

## Security
- Service role key ONLY in server-side code
- Anon key OK for client-side
- Never expose service role to client
- Validate all inputs in Server Actions
`;
  } else if (arch.pattern === 'bff') {
    return `--- (BFF pattern rules) ---`;
  } else {
    return `--- (Traditional pattern rules) ---`;
  }
}
```

#### 2-4. `.claude/rules/test.md`

**開発手法別テストルール** (TDD/BDD/DDD)

```markdown
---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "tests/**"
alwaysApply: false
---

# Testing Methodology Rules

## Test-Driven Development (TDD)
1. **Red** → Write failing test first
2. **Green** → Write minimal code to pass
3. **Refactor** → Improve code while keeping tests green

## Test Structure (AAA Pattern)
\`\`\`typescript
describe('Feature', () => {
  it('should do something', () => {
    // Arrange - Setup
    const input = 'test';

    // Act - Execute
    const result = doSomething(input);

    // Assert - Verify
    expect(result).toBe('expected');
  });
});
\`\`\`

## Coverage Requirements
- Unit tests: ≥80% coverage
- Integration tests: Critical paths
- E2E tests: User journeys

## Test Naming
- Descriptive: `should [expected behavior] when [condition]`
- Good: `should return 401 when user is not authenticated`
- Bad: `test1`, `testAuth`
```

#### 2-5. `.claude/rules/ops.md`

**新規作成 — P14 Ops Intelligence参照**

```markdown
---
paths:
  - ".github/**"
  - "docs/34_*"
  - "docs/53_*"
  - "docs/54_*"
alwaysApply: false
---

# Operations & Deployment Rules

## Reference Documents
- **Ops Runbook**: \`docs/53_ops_runbook.md\` — SLO/SLI, Feature Flags, Observability
- **Ops Checklist**: \`docs/54_ops_checklist.md\` — 12 Ops Capabilities
- **Incident Response**: \`docs/34_incident_response.md\` — On-call procedures

## Deployment Safety
1. **Never skip hooks** — \`--no-verify\` only with explicit approval
2. **Never force push to main** — Protect production branch
3. **Always test in staging first** — Production deploys after staging validation
4. **Rollback plan required** — Know how to revert before deploying

## Feature Flags (see docs/53)
- Use for gradual rollouts
- Kill switches for critical features
- Test flag states in CI/CD

## Monitoring (see docs/53)
- SLO violations trigger alerts
- Error rate thresholds by domain
- Observability stack per deployment target

## Backup & Recovery (see docs/53)
- RPO/RTO requirements by domain
- Test restore procedures regularly
- Document recovery runbooks
```

---

### Step 3: Layer C — `.claude/settings.json`

**セキュリティ・権限設定**

```json
{
  "permissions": {
    "allowedTools": [
      "Read",
      "Write",
      "Edit",
      "Bash",
      "Glob",
      "Grep",
      "WebFetch"
    ],
    "dangerousCommands": {
      "requireConfirmation": [
        "rm -rf",
        "git push --force",
        "git reset --hard",
        "DROP TABLE",
        "DELETE FROM"
      ]
    }
  },
  "context": {
    "specDir": ".spec/",
    "docsDir": "docs/",
    "testCommand": "npm test",
    "buildCommand": "npm run build"
  },
  "rules": {
    "autoLoadByPath": true,
    "strictMode": false
  }
}
```

---

## 🔧 実装詳細

### コード変更箇所

**ファイル:** `src/generators/p4-airules.js`

```javascript
function genPillar4_AIRules(a, pn) {
  const G = S.genLang === 'ja';
  // ... existing code ...

  // ═══ NEW: Generate .claude/ structure ═══

  // Layer A: Thin root CLAUDE.md
  const thinCLAUDE = genThinCLAUDE(a, pn, G);
  S.files['CLAUDE.md'] = thinCLAUDE;

  // Layer B: Rule files
  S.files['.claude/rules/spec.md'] = genSpecRules(G);
  S.files['.claude/rules/frontend.md'] = genFrontendRules(a.frontend, G);
  S.files['.claude/rules/backend.md'] = genBackendRules(resolveArch(a), a.backend, G);
  S.files['.claude/rules/test.md'] = genTestRules(a.dev_methods, G);
  S.files['.claude/rules/ops.md'] = genOpsRules(G);

  // Layer C: Settings
  S.files['.claude/settings.json'] = JSON.stringify({
    permissions: {
      allowedTools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep', 'WebFetch']
    },
    context: {
      specDir: '.spec/',
      docsDir: 'docs/'
    }
  }, null, 2);

  // ═══ Existing: Other AI rules (unchanged) ═══
  S.files['AI_BRIEF.md'] = genAIBrief(a, pn);
  S.files['.cursorrules'] = genCursorRules(a, pn);
  // ... rest of existing code ...
}

// ═══ NEW: Helper functions ═══

function genThinCLAUDE(a, pn, G) {
  const arch = resolveArch(a);
  const auth = resolveAuth(a);
  const fe = a.frontend || 'React';
  const be = a.backend || 'Node.js + Express';
  const db = a.database || 'PostgreSQL';
  const archNote = G ? {
    baas: 'BaaS統合パターン',
    bff: 'BFF パターン',
    split: 'フロント/バック分離',
    traditional: '従来型'
  }[arch.pattern] : {
    baas: 'BaaS Integration',
    bff: 'BFF Pattern',
    split: 'FE/BE Split',
    traditional: 'Traditional'
  }[arch.pattern];

  const forbidden = arch.isBaaS
    ? `- No raw SQL in app code (use client methods)\n  - OK: DDL/RLS in migrations\n- No separate server (use ${be} functions)\n- No manual JWT (use ${auth.sot})`
    : arch.pattern === 'bff'
    ? `- No separate Express (use Next.js API Routes)\n- No \`any\` types\n- No console.log in prod\n- No hardcoded secrets`
    : `- No \`any\` types\n- No console.log in prod\n- No hardcoded secrets\n- No raw SQL (use ORM)\n  - OK: DDL in migrations`;

  return `# ${pn} ${G ? '— 開発ルール' : '— Development Rules'}

## ${G ? '概要' : 'Overview'}
- **${G ? 'スタック' : 'Stack'}**: ${fe} + ${be} + ${db}
- **${G ? 'アーキテクチャ' : 'Architecture'}**: ${archNote}
- **${G ? '認証' : 'Auth'} SoT**: ${auth.sot}
- **${G ? '開発手法' : 'Methods'}**: ${a.dev_methods || 'TDD'}

## ${G ? '必須ルール' : 'Critical Rules'}

### ${G ? '禁止事項' : 'Forbidden'}
${forbidden}

### ${G ? '認証の唯一の情報源' : 'Auth Source of Truth'}
${G
  ? `すべての認証状態は ${auth.sot} から取得すること。認証ロジックを重複させない。`
  : `All auth state MUST come from ${auth.sot}. Never duplicate auth logic.`}

## ${G ? 'ルールファイル' : 'Rule Files'}
${G
  ? 'パス別の詳細ルールは以下を参照:'
  : 'For path-specific detailed rules, see:'}

- \`.claude/rules/spec.md\` ${G ? '— 仕様駆動開発ルール' : '— Spec-driven development'}
- \`.claude/rules/frontend.md\` ${G ? '— フロントエンド開発ルール' : '— Frontend development'}
- \`.claude/rules/backend.md\` ${G ? '— バックエンド開発ルール' : '— Backend development'}
- \`.claude/rules/test.md\` ${G ? '— テスト手法ルール' : '— Testing methodology'}
- \`.claude/rules/ops.md\` ${G ? '— 運用・デプロイルール' : '— Operations & deployment'}

${G
  ? '**特定のパスで作業する際**、Claudeは関連するルールファイルを自動読み込みします。'
  : '**When working on specific paths**, Claude will automatically load the relevant rule file.'}

## ${G ? 'ワークフロー' : 'Workflow'}
1. **${G ? '機能' : 'Feature'}** → \`.spec/\` ${G ? '確認' : 'check'} → ${G ? '実装' : 'implement'} → ${G ? 'テスト' : 'test'} → ${G ? 'コミット' : 'commit'}
2. **${G ? 'バグ' : 'Bug'}** → ${G ? '再現' : 'reproduce'} → ${G ? '修正' : 'fix'} → ${G ? 'テスト' : 'test'} → ${G ? 'コミット' : 'commit'}
3. **${G ? '常に' : 'Always'}** → ${G ? 'コミット前にテスト実行' : 'Run tests before commit'}

## ${G ? 'クイックリファレンス' : 'Quick Reference'}
- ${G ? '仕様ディレクトリ' : 'Spec Dir'}: \`.spec/\`
- ${G ? 'ドキュメント' : 'Docs Dir'}: \`docs/\`
- ${G ? 'テストコマンド' : 'Test Command'}: \`npm test\`
- ${G ? 'ビルドコマンド' : 'Build Command'}: \`npm run build\`
`;
}

function genSpecRules(G) {
  return `---
paths:
  - ".spec/**"
alwaysApply: false
---

# ${G ? '仕様駆動開発ルール' : 'Spec-Driven Development Rules'}

## ${G ? 'ファイル選択マトリクス' : 'File Selection Matrix'}
| ${G ? 'タスク種別' : 'Task Type'} | ${G ? '読むファイル' : 'Read Files'} | ${G ? '書くファイル' : 'Write Files'} |
|-----------|------------|-------------|
| ${G ? '機能企画' : 'Feature Planning'} | constitution, specification | specification, technical-plan |
| ${G ? 'アーキテクチャ設計' : 'Architecture Design'} | specification, technical-plan | technical-plan, tasks |
| ${G ? 'タスク分解' : 'Task Breakdown'} | specification, technical-plan, tasks | tasks, verification |
| ${G ? '実装' : 'Implementation'} | ${G ? 'すべての.specファイル' : 'All .spec files'} | ${G ? '(コードファイル、.specは書かない)' : '(Code files, not .spec)'} |
| ${G ? '検証' : 'Verification'} | verification | ${G ? 'verification (ステータス更新)' : 'verification (update status)'} |

## ${G ? '仕様整合性ルール' : 'Spec Integrity Rules'}
1. **constitution ${G ? 'は不変' : 'is immutable'}** — ${G ? '初回作成後は編集しない' : 'Never edit after initial creation'}
2. **specification ${G ? 'が真実の源' : 'is source of truth'}** — ${G ? 'すべての機能をここで最初に定義' : 'All features defined here first'}
3. **technical-plan ${G ? 'は specification と一致' : 'must match specification'}** — ${G ? '仕様なしに実装しない' : 'No implementation without spec'}
4. **tasks ${G ? 'は specification を参照' : 'must reference specification'}** — ${G ? 'すべてのタスクは要件にリンク' : 'Every task links to requirements'}
5. **verification ${G ? 'は specification を検証' : 'validates specification'}** — ${G ? '受入基準に対してテスト' : 'Test against acceptance criteria'}

## ${G ? 'ワークフロー' : 'Workflow'}
\`\`\`mermaid
graph LR
  A[${G ? '機能要求' : 'Feature Request'}] --> B[${G ? 'specification更新' : 'Update specification'}]
  B --> C[${G ? 'technical-plan更新' : 'Update technical-plan'}]
  C --> D[${G ? 'tasks生成' : 'Generate tasks'}]
  D --> E[${G ? '実装' : 'Implement'}]
  E --> F[${G ? 'verification更新' : 'Update verification'}]
\`\`\`
`;
}

function genFrontendRules(fe, G) {
  // ... (上記の動的生成ロジック)
}

function genBackendRules(arch, be, G) {
  // ... (上記の動的生成ロジック)
}

function genTestRules(devMethods, G) {
  // ... (テスト手法別ルール)
}

function genOpsRules(G) {
  return `---
paths:
  - ".github/**"
  - "docs/34_*"
  - "docs/53_*"
  - "docs/54_*"
alwaysApply: false
---

# ${G ? '運用・デプロイルール' : 'Operations & Deployment Rules'}

## ${G ? '参照ドキュメント' : 'Reference Documents'}
- **${G ? 'Ops Runbook' : 'Ops Runbook'}**: \`docs/53_ops_runbook.md\` — SLO/SLI, Feature Flags, Observability
- **${G ? 'Ops Checklist' : 'Ops Checklist'}**: \`docs/54_ops_checklist.md\` — 12 Ops Capabilities
- **${G ? 'インシデント対応' : 'Incident Response'}**: \`docs/34_incident_response.md\` — ${G ? 'オンコール手順' : 'On-call procedures'}

## ${G ? 'デプロイ安全性' : 'Deployment Safety'}
1. **${G ? 'フックをスキップしない' : 'Never skip hooks'}** — \`--no-verify\` ${G ? 'は明示的承認時のみ' : 'only with explicit approval'}
2. **main ${G ? 'への強制プッシュ禁止' : 'force push prohibited'}** — ${G ? '本番ブランチ保護' : 'Protect production branch'}
3. **${G ? 'ステージングで先にテスト' : 'Test in staging first'}** — ${G ? 'ステージング検証後に本番デプロイ' : 'Production after staging validation'}
4. **${G ? 'ロールバック計画必須' : 'Rollback plan required'}** — ${G ? 'デプロイ前に戻し方を把握' : 'Know how to revert before deploying'}

## ${G ? 'Feature Flags' : 'Feature Flags'} (${G ? 'docs/53参照' : 'see docs/53'})
- ${G ? '段階的ロールアウトに使用' : 'Use for gradual rollouts'}
- ${G ? '重要機能のキルスイッチ' : 'Kill switches for critical features'}
- ${G ? 'CI/CDでフラグ状態をテスト' : 'Test flag states in CI/CD'}

## ${G ? 'モニタリング' : 'Monitoring'} (${G ? 'docs/53参照' : 'see docs/53'})
- ${G ? 'SLO違反でアラート発火' : 'SLO violations trigger alerts'}
- ${G ? 'ドメイン別エラー率閾値' : 'Error rate thresholds by domain'}
- ${G ? 'デプロイターゲット別Observabilityスタック' : 'Observability stack per deployment target'}

## ${G ? 'バックアップ・リカバリ' : 'Backup & Recovery'} (${G ? 'docs/53参照' : 'see docs/53'})
- ${G ? 'ドメイン別RPO/RTO要件' : 'RPO/RTO requirements by domain'}
- ${G ? 'リストア手順を定期的にテスト' : 'Test restore procedures regularly'}
- ${G ? 'リカバリRunbookを文書化' : 'Document recovery runbooks'}
`;
}
```

---

## 🧪 テスト追加

### test/snapshot.test.js

```javascript
// 既存のgenerate()関数の後にアサーションを追加

test('generates .claude/ structure', () => {
  const files = generate({
    purpose: 'Build a web app',
    frontend: 'React',
    backend: 'Express',
    database: 'PostgreSQL'
  }, 'TestApp');

  // Layer A
  assert.ok(files['CLAUDE.md'], 'Should have root CLAUDE.md');
  assert.ok(files['CLAUDE.md'].length < 3000, 'Root CLAUDE.md should be thin (~1.5K tokens)');

  // Layer B - Rule files
  assert.ok(files['.claude/rules/spec.md'], 'Should have spec rules');
  assert.ok(files['.claude/rules/frontend.md'], 'Should have frontend rules');
  assert.ok(files['.claude/rules/backend.md'], 'Should have backend rules');
  assert.ok(files['.claude/rules/test.md'], 'Should have test rules');
  assert.ok(files['.claude/rules/ops.md'], 'Should have ops rules');

  // Layer C - Settings
  assert.ok(files['.claude/settings.json'], 'Should have settings.json');
  const settings = JSON.parse(files['.claude/settings.json']);
  assert.ok(settings.permissions, 'Settings should have permissions');
  assert.ok(settings.context, 'Settings should have context');
});

test('.claude/rules files have YAML frontmatter', () => {
  const files = generate({ purpose: 'Test', frontend: 'React', backend: 'Express', database: 'PostgreSQL' }, 'Test');

  const ruleFiles = [
    '.claude/rules/spec.md',
    '.claude/rules/frontend.md',
    '.claude/rules/backend.md',
    '.claude/rules/test.md',
    '.claude/rules/ops.md'
  ];

  ruleFiles.forEach(path => {
    const content = files[path];
    assert.ok(content.startsWith('---\n'), `${path} should start with YAML frontmatter`);
    assert.ok(content.includes('paths:'), `${path} should have paths field`);
    assert.ok(content.includes('alwaysApply:'), `${path} should have alwaysApply field`);
  });
});
```

### test/security.test.js

```javascript
test('.claude/settings.json does not expose sensitive data', () => {
  S.files = {};
  S.genLang = 'en';
  genPillar4_AIRules({
    purpose: 'Test app',
    frontend: 'React',
    backend: 'Express',
    database: 'PostgreSQL'
  }, 'TestApp');

  const settings = JSON.parse(S.files['.claude/settings.json']);

  // Should not contain any actual secrets
  const str = JSON.stringify(settings);
  assert.ok(!str.includes('sk-'), 'Should not contain API keys');
  assert.ok(!str.includes('password'), 'Should not contain passwords');
  assert.ok(!str.includes('secret'), 'Should not contain secret values');
});
```

---

## 📊 生成ファイル数の変化

| Before (v9.2.0) | After (v9.3.0) | 差分 |
|----------------|----------------|------|
| 100+ files | **106+ files** | +6 |

**内訳:**
- CLAUDE.md (既存、圧縮版に置換)
- `.claude/rules/spec.md` (+1)
- `.claude/rules/frontend.md` (+1)
- `.claude/rules/backend.md` (+1)
- `.claude/rules/test.md` (+1)
- `.claude/rules/ops.md` (+1)
- `.claude/settings.json` (+1)

---

## 🎯 期待される効果

1. **トークン消費削減** — 3K → 1.5K + 必要なルールのみ読み込み
2. **パス別最適化** — 作業中のファイルに関連するルールのみ適用
3. **メンテナンス性向上** — ルールが論理的に分離され、更新が容易
4. **Claude.ai統合** — `.claude/rules/`システムをフル活用
5. **後方互換性** — ルートCLAUDE.mdだけでも動作（旧ツール対応）

---

## ⚠️ 注意事項

### 1. 文字列エスケープ
- バッククォート内でのテンプレートリテラルは `\`` でエスケープ
- YAML frontmatter内の特殊文字に注意

### 2. ファイル生成順序
- CLAUDE.md を最初に生成（他のAIルールより前）
- 依存関係なし（独立して生成可能）

### 3. 既存機能との整合性
- `.cursorrules`, `.clinerules`, `.windsurfrules` は変更なし（後方互換性）
- `AI_BRIEF.md` も既存のまま

### 4. サイズ予算
- 推定: +8-10KB (minified)
- 現在: 1209KB → 目標: ~1218KB (制限1220KB内)

---

## 📝 実装チェックリスト

### コード実装
- [ ] `genThinCLAUDE()` 関数実装
- [ ] `genSpecRules()` 関数実装
- [ ] `genFrontendRules()` 関数実装（スタック別分岐）
- [ ] `genBackendRules()` 関数実装（アーキテクチャ別分岐）
- [ ] `genTestRules()` 関数実装（手法別分岐）
- [ ] `genOpsRules()` 関数実装
- [ ] `.claude/settings.json` 生成ロジック
- [ ] p4-airules.js に統合

### テスト
- [ ] snapshot.test.js に `.claude/` 構造テスト追加
- [ ] YAML frontmatter検証テスト追加
- [ ] security.test.js に settings.json セキュリティテスト追加
- [ ] 既存テスト全パス確認

### ドキュメント
- [ ] CLAUDE.md にPhase 4完了の記載追加
- [ ] 生成ファイル数: 100+ → 106+
- [ ] バージョン: v9.2.0 → v9.3.0
- [ ] Module Map更新不要（ロジック変更のみ）

### ビルド検証
- [ ] `npm test` 全パス
- [ ] `node build.js --report` サイズ確認（≤1220KB）
- [ ] ブラウザでLMS生成テスト
- [ ] `.claude/` ファイルが正しく生成されることを確認

---

## 🚀 実装後の次ステップ（v9.3.0 → v9.4.0）

将来的な拡張候補:

1. **動的ルールローダー** — 作業中のファイルパスに応じて関連ルールを強調表示
2. **ルールバリデーター** — YAML frontmatter構文チェック
3. **カスタムルール追加** — ユーザーが独自ルールを追加できる仕組み
4. **ルール競合検出** — 複数ルールが矛盾する場合の警告

---

## 📞 サポート

実装時の参考:
- 既存コード: `src/generators/p4-airules.js` L1-500
- テスト参考: `test/snapshot.test.js` L52-120
- YAML仕様: https://yaml.org/spec/1.2/spec.html

---

**実装準備完了。このドキュメントに従って Phase 4 を実装してください。**
