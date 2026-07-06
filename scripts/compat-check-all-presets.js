#!/usr/bin/env node
/**
 * Compat check against all presets (standard + field × 4 scales).
 * v9.38: answers are built via the APP's real apply path (ui/presets.js start(),
 * through test/app-answers.js) instead of hand-rolled Object.assign injection.
 * 手組み注入はアプリ実回答と乖離する（v9.36: scale欠落が不可視 / v9.38実測:
 * フィールドプリセット16キー欠落・7キー値相違 → 46 ERROR + 4063 WARN が見えていなかった）。
 * Reports any ERROR or WARN hits grouped by rule ID. Expected: 0 / 0.
 */
const app = require('../test/app-answers.js');
const sb = app.sb;
const SCALES = ['solo', 'small', 'medium', 'large'];

const hits = {};  // { ruleId: { level, entries: [{presetKey, scale}] } }
let totalChecked = 0;

function record(ruleId, level, presetKey, scale) {
  if (!hits[ruleId]) hits[ruleId] = { level, entries: [] };
  hits[ruleId].entries.push({ presetKey, scale });
}

// ── Standard presets ──
process.stdout.write('Checking standard presets…');
const PR = sb.PR;
for (const key of Object.keys(PR)) {
  const answers = app.answersForStandard(key);
  const results = sb.checkCompat(answers);
  for (const r of results) {
    if (r.level === 'error' || r.level === 'warn') {
      record(r.id, r.level, key, 'standard');
    }
  }
  totalChecked++;
}
console.log(` ${Object.keys(PR).length} done.`);

// ── Field presets × 4 scales ──
process.stdout.write('Checking field presets × 4 scales…');
const PR_FIELD = sb.PR_FIELD;
for (const key of Object.keys(PR_FIELD)) {
  for (const scale of SCALES) {
    const answers = app.answersForField(key, scale);
    const results = sb.checkCompat(answers);
    for (const r of results) {
      if (r.level === 'error' || r.level === 'warn') {
        record(r.id, r.level, key, scale);
      }
    }
    totalChecked++;
  }
}
console.log(` ${Object.keys(PR_FIELD).length} presets × 4 done.`);

// ── Report ──
console.log('\n════════════════════════════════════════════');
console.log(`Checked ${totalChecked} combos (${Object.keys(PR).length} standard + ${Object.keys(PR_FIELD).length}×4 field)`);
console.log('════════════════════════════════════════════\n');

const NEW_RULE_IDS = [
  'dom-gaming-noauth','dom-childcare-minors','dom-cybersec-noaudit','sec-sensitive-entity-norls',
  'dom-logistics-nopay','dom-health-mobile-noencrypt','dom-rpa-nomonitor',
  'be-firebase-stripe-webhook','mob-expo-websocket','be-express-nosecurity-headers',
  'sec-mobile-biometric','perf-realtime-noredis','perf-mobile-offline','be-batch-serverless',
  // docs/121 security design rules (+6)
  'sec-no-secrets-mgr','sec-no-sbom','sec-sensitive-no-classify',
  'sec-no-sast','sec-container-no-scan','sec-no-security-metrics',
  // API performance rules (+4)
  'perf-no-compression','perf-no-etag','api-no-deprecation-plan','perf-rest-no-fieldselect',
  // docs/122 concurrency & docs/123 frontend rules (+8)
  'scale-booking-no-idempotency','fe-spa-payment-no-csp','scale-large-no-circuit-breaker',
  'scale-write-heavy-no-queue','fe-large-no-codesplit','org-rls-large-no-audit',
  'dev-tdd-no-coverage','ai-prompt-no-version',
  // Observability rules (+6)
  'obs-large-no-structured-log','obs-no-error-tracking','obs-no-alerting-config',
  'obs-no-health-endpoint','obs-production-no-sla','obs-no-log-retention',
  // ext17 infrastructure & reliability rules (+6)
  'db-large-no-read-replica','db-no-connection-pool','fe-large-no-error-boundary',
  'ops-no-rollback-plan','sec-no-secret-rotation','perf-large-no-cdn',
  // ext18 testing/ml/a11y/cache rules (+8)
  'test-no-coverage-gate','test-large-no-e2e','ml-no-model-monitoring','ai-no-eval-framework',
  'a11y-no-wcag-target','cache-large-no-redis','queue-no-deadletter','feat-flag-no-cleanup',
  // 参考資料ベース品質改善 (+2)
  'api-realtime-http-polling','sec-large-no-authz-model',
  // XAI/AIランタイム監視/ゼロトラストエージェント (+3)
  'ai-high-risk-no-xai','ai-no-cost-monitoring','ai-agent-no-boundary',
  // P28 XAI Intelligence pillar (+3)
  'ai-no-fairness-pipeline','ai-large-no-governance','ai-no-drift-monitoring',
  // v9.9 Phase D: mobile/frontend/AI boundary rules (+6)
  'mob-flutter-firebase-auth-mismatch','fe-spa-baas-realtime-scale',
  'ai-large-no-rate-limit','ai-agent-no-fallback','fe-large-no-ssr','mob-payment-no-ssl-pin',
  // v9.10 Phase D: CSS conflict, serverless, test framework, auth, CSP rules (+6)
  'fe-css-framework-conflict','be-serverless-cold-start','be-serverless-db-pool',
  'test-framework-conflict','auth-clerk-flutter-mismatch','fe-ssr-missing-csp',
  // v9.11 Phase E: domain coverage & DB partitioning rules (+4)
  'db-mongo-no-schema-validation','test-no-contract-test','obs-no-domain-metrics','db-large-no-partitioning',
  // v9.12 Phase E: design system, test framework, scale rules (+3)
  'ds-no-dark-mode','test-no-framework','scale-solo-enterprise',
  // v9.13 Phase E: WS+serverless, i18n global, mobile token storage (+3)
  'be-ws-serverless-incompatible','fe-no-i18n-needed','mob-insecure-token-storage',
  // v9.14 Phase D: domain invariants, staged deploy (+2)
  'qa-high-risk-no-invariant-test','ops-scale-no-staged-deploy',
  // v9.15 Phase 1: N+1 guard, mixed auth, runbook, deep link, preview deploy (+5)
  'db-no-n1-guard','be-mixed-auth-provider','ops-large-no-runbook','mob-large-no-deep-link','ci-no-preview-deploy',
  // v9.16 Phase C: a11y, api versioning, health check, db backup, prompt injection (+5)
  'fe-no-a11y-tool','api-no-versioning','ops-no-health-check','db-no-backup-strategy','ai-no-prompt-injection',
];

const errorRules = Object.entries(hits).filter(([,v])=>v.level==='error');
const warnRules  = Object.entries(hits).filter(([,v])=>v.level==='warn');

if (errorRules.length === 0 && warnRules.length === 0) {
  console.log('✅ No ERROR or WARN hits on any preset combo.\n');
} else {
  if (errorRules.length > 0) {
    console.log(`❌ ERROR rules firing (${errorRules.length} rules):\n`);
    for (const [id, {entries}] of errorRules) {
      const isNew = NEW_RULE_IDS.includes(id) ? ' ← NEW' : '';
      console.log(`  [ERROR] ${id}${isNew} — ${entries.length} hit(s):`);
      for (const e of entries) console.log(`    • ${e.presetKey} (${e.scale})`);
    }
    console.log('');
  }
  if (warnRules.length > 0) {
    console.log(`⚠️  WARN rules firing (${warnRules.length} rules):\n`);
    for (const [id, {entries}] of warnRules) {
      const isNew = NEW_RULE_IDS.includes(id) ? ' ← NEW' : '';
      console.log(`  [WARN] ${id}${isNew} — ${entries.length} hit(s):`);
      for (const e of entries) console.log(`    • ${e.presetKey} (${e.scale})`);
    }
    console.log('');
  }
}

// New-rule summary
const newHits = NEW_RULE_IDS.filter(id => hits[id]);
console.log('── New rules ('+NEW_RULE_IDS.length+' tracked) ──');
if (newHits.length === 0) {
  console.log('✅ None of the '+NEW_RULE_IDS.length+' new rules fire on any existing preset.\n');
} else {
  for (const id of newHits) {
    const {level, entries} = hits[id];
    console.log(`  [${level.toUpperCase()}] ${id} — ${entries.length} hit(s):`);
    for (const e of entries) console.log(`    • ${e.presetKey} (${e.scale})`);
  }
}
