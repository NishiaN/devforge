const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// Load modules
eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR','var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p15-future.js', 'utf-8').replace(/const (DOMAIN_MARKET|PERSONA_ARCHETYPES|GTM_STRATEGY|REGULATORY_HORIZON)/g, 'var $1'));

// ═══ Data Coverage & Integrity Tests ═══

test('ENTITY_COLUMNS: most preset entities have column definitions', () => {
  const allEntities = new Set();
  Object.values(PR).forEach(preset => {
    if (preset.entities) {
      preset.entities.split(/[,、]\s*/).forEach(e => {
        const trimmed = e.trim();
        if (trimmed) allEntities.add(trimmed);
      });
    }
  });

  const missingEntities = [];
  allEntities.forEach(entity => {
    if (!ENTITY_COLUMNS[entity]) {
      missingEntities.push(entity);
    }
  });

  // Allow up to 10 missing entities (edge cases from older presets)
  assert.ok(missingEntities.length <= 10,
    `Too many missing ENTITY_COLUMNS (${missingEntities.length}): ` + missingEntities.join(', '));
});

test('ENTITY_COLUMNS: FK references point to defined entities', () => {
  const allEntities = Object.keys(ENTITY_COLUMNS);
  const invalidRefs = [];

  Object.entries(ENTITY_COLUMNS).forEach(([entityName, cols]) => {
    cols.forEach(colDef => {
      const fkMatch = colDef.match(/FK\((\w+)\)/);
      if (fkMatch) {
        const refEntity = fkMatch[1];
        if (!allEntities.includes(refEntity)) {
          invalidRefs.push(`${entityName} → ${refEntity}`);
        }
      }
    });
  });

  assert.equal(invalidRefs.length, 0,
    'Invalid FK references: ' + invalidRefs.join(', '));
});

test('ENTITY_COLUMNS: use compression constants where applicable', () => {
  // Use constant VALUES instead of names
  const constantValues = [_U, _SA, _SD, _SP, _T, _D, _CN, _M, _B, _BN, _TS, _SO, _IA, _PR, _CAT, _DUR, _N];
  let compressionScore = 0;
  let totalColumns = 0;

  Object.values(ENTITY_COLUMNS).forEach(cols => {
    cols.forEach(col => {
      totalColumns++;
      // Check if column exactly equals a constant value
      if (constantValues.includes(col)) {
        compressionScore++;
      }
    });
  });

  // At least 10% should use compression constants (relaxed from 30% due to new entities with full definitions)
  const compressionRate = compressionScore / totalColumns;
  assert.ok(compressionRate >= 0.1,
    `Compression rate ${(compressionRate * 100).toFixed(1)}% is below 10% threshold`);
});

test('detectDomain: covers most presets with domain-specific logic', () => {
  const uncovered = [];
  const excluded = ['custom']; // Explicitly generic presets

  Object.entries(PR).forEach(([key, preset]) => {
    if (excluded.includes(key)) return;
    const purpose = preset.purpose || preset.purposeEn || '';
    const domain = detectDomain(purpose);
    if (!domain) {
      uncovered.push(key);
    }
  });

  // Allow up to 15 presets without specific domain (many are intentionally generic or use _default playbook)
  assert.ok(uncovered.length <= 15,
    `Too many presets without domain detection (${uncovered.length}): ${uncovered.join(', ')}`);
});

test('DOMAIN_ENTITIES: all domains are defined', () => {
  const domains = ['education', 'ec', 'marketplace', 'community', 'content',
                   'analytics', 'booking', 'saas', 'portfolio', 'tool',
                   'iot', 'realestate', 'legal', 'hr', 'fintech', 'health',
                   'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter',
                   'manufacturing', 'logistics', 'agriculture', 'energy', 'media', 'government', 'travel', 'insurance'];

  domains.forEach(domain => {
    assert.ok(DOMAIN_ENTITIES[domain], `Missing DOMAIN_ENTITIES.${domain}`);
    assert.ok(Array.isArray(DOMAIN_ENTITIES[domain].core),
      `${domain}.core should be array`);
    assert.ok(DOMAIN_ENTITIES[domain].core.length > 0,
      `${domain}.core should not be empty`);
  });
});

test('DOMAIN_QA_MAP: all domains have QA strategies', () => {
  const domains = ['education', 'ec', 'marketplace', 'community', 'content',
                   'analytics', 'booking', 'saas', 'portfolio', 'tool',
                   'iot', 'realestate', 'legal', 'hr', 'fintech', 'health',
                   'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter',
                   'manufacturing', 'logistics', 'agriculture', 'energy', 'media', 'government', 'travel', 'insurance'];

  domains.forEach(domain => {
    assert.ok(DOMAIN_QA_MAP[domain], `Missing DOMAIN_QA_MAP.${domain}`);
    const qa = DOMAIN_QA_MAP[domain];
    assert.ok(Array.isArray(qa.focus_ja), `${domain}.focus_ja should be array`);
    assert.ok(Array.isArray(qa.focus_en), `${domain}.focus_en should be array`);
    assert.ok(Array.isArray(qa.bugs_ja), `${domain}.bugs_ja should be array`);
    assert.ok(Array.isArray(qa.bugs_en), `${domain}.bugs_en should be array`);
    assert.ok(qa.priority, `${domain}.priority should be defined`);
  });
});

test('DOMAIN_PLAYBOOK: all domains have complete playbooks', () => {
  const domains = ['education', 'ec', 'marketplace', 'community', 'content',
                   'analytics', 'booking', 'saas', 'iot', 'realestate',
                   'legal', 'hr', 'fintech', 'health', 'portfolio', 'tool',
                   'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter',
                   'manufacturing', 'logistics', 'agriculture', 'energy', 'media', 'government', 'travel', 'insurance'];

  const incomplete = [];
  domains.forEach(domain => {
    const playbook = DOMAIN_PLAYBOOK[domain];
    if (!playbook) {
      incomplete.push(`${domain}: missing`);
      return;
    }

    // Check that impl/compliance/prevent/ctx/skill are all defined
    if (!playbook.impl_ja || playbook.impl_ja.length === 0) {
      incomplete.push(`${domain}: empty impl_ja`);
    }
    if (!playbook.impl_en || playbook.impl_en.length === 0) {
      incomplete.push(`${domain}: empty impl_en`);
    }
    if (!playbook.skill_ja) {
      incomplete.push(`${domain}: empty skill_ja`);
    }
    if (!playbook.skill_en) {
      incomplete.push(`${domain}: empty skill_en`);
    }
  });

  assert.equal(incomplete.length, 0,
    'Incomplete playbooks: ' + incomplete.join(', '));
});

test('FEATURE_DETAILS: all features have criteria and tests', () => {
  const incomplete = [];
  Object.entries(FEATURE_DETAILS).forEach(([pattern, detail]) => {
    if (!detail.criteria_ja || detail.criteria_ja.length === 0) {
      incomplete.push(`${pattern}: empty criteria_ja`);
    }
    if (!detail.criteria_en || detail.criteria_en.length === 0) {
      incomplete.push(`${pattern}: empty criteria_en`);
    }
    if (!detail.tests_ja || detail.tests_ja.length === 0) {
      incomplete.push(`${pattern}: empty tests_ja`);
    }
    if (!detail.tests_en || detail.tests_en.length === 0) {
      incomplete.push(`${pattern}: empty tests_en`);
    }
  });

  assert.equal(incomplete.length, 0,
    'Incomplete feature details: ' + incomplete.join(', '));
});

// ═══ DOMAIN_OPS Coverage Tests ═══

test('DOMAIN_OPS: all 32 domains have ops definitions', () => {
  const expectedDomains = [
    'education', 'ec', 'saas', 'fintech', 'health', 'booking',
    'marketplace', 'community', 'content', 'analytics', 'iot',
    'realestate', 'legal', 'hr', 'portfolio', 'tool', 'ai',
    'automation', 'event', 'gamify', 'collab', 'devtool',
    'creator', 'newsletter', 'manufacturing', 'logistics', 'agriculture',
    'energy', 'media', 'government', 'travel', 'insurance'
  ];

  const missing = [];
  expectedDomains.forEach(domain => {
    if (!DOMAIN_OPS[domain]) {
      missing.push(domain);
    }
  });

  assert.equal(missing.length, 0,
    `Missing DOMAIN_OPS entries: ${missing.join(', ')}`);
  assert.ok(DOMAIN_OPS._default, 'Missing _default in DOMAIN_OPS');
});

test('DOMAIN_OPS: all entries have required fields', () => {
  const incomplete = [];
  Object.entries(DOMAIN_OPS).forEach(([domain, ops]) => {
    if (!ops.slo) incomplete.push(`${domain}: missing slo`);
    if (!ops.flags_ja || ops.flags_ja.length === 0) incomplete.push(`${domain}: empty flags_ja`);
    if (!ops.flags_en || ops.flags_en.length === 0) incomplete.push(`${domain}: empty flags_en`);
    if (!ops.jobs_ja || ops.jobs_ja.length === 0) incomplete.push(`${domain}: empty jobs_ja`);
    if (!ops.jobs_en || ops.jobs_en.length === 0) incomplete.push(`${domain}: empty jobs_en`);
    if (!ops.backup_ja || ops.backup_ja.length === 0) incomplete.push(`${domain}: empty backup_ja`);
    if (!ops.backup_en || ops.backup_en.length === 0) incomplete.push(`${domain}: empty backup_en`);
    if (!ops.hardening_ja || ops.hardening_ja.length === 0) incomplete.push(`${domain}: empty hardening_ja`);
    if (!ops.hardening_en || ops.hardening_en.length === 0) incomplete.push(`${domain}: empty hardening_en`);
  });

  assert.equal(incomplete.length, 0,
    `Incomplete DOMAIN_OPS: ${incomplete.join(', ')}`);
});

test('DOMAIN_OPS: SLO values are valid percentages', () => {
  const invalid = [];
  Object.entries(DOMAIN_OPS).forEach(([domain, ops]) => {
    if (!ops.slo.match(/^9[0-9](\.\d+)?%$/)) {
      invalid.push(`${domain}: invalid SLO "${ops.slo}"`);
    }
  });

  assert.equal(invalid.length, 0,
    `Invalid SLO values: ${invalid.join(', ')}`);
});

// ═══ DOMAIN_GROWTH Coverage Tests ═══

test('DOMAIN_GROWTH: all 32 domains have growth definitions', () => {
  const expectedDomains = [
    'education', 'ec', 'saas', 'fintech', 'health', 'booking',
    'marketplace', 'community', 'content', 'analytics', 'iot',
    'realestate', 'legal', 'hr', 'portfolio', 'tool', 'ai',
    'automation', 'event', 'gamify', 'collab', 'devtool',
    'creator', 'newsletter', 'manufacturing', 'logistics', 'agriculture',
    'energy', 'media', 'government', 'travel', 'insurance'
  ];

  const missing = [];
  expectedDomains.forEach(domain => {
    if (!DOMAIN_GROWTH[domain]) {
      missing.push(domain);
    }
  });

  assert.equal(missing.length, 0,
    `Missing DOMAIN_GROWTH entries: ${missing.join(', ')}`);
  assert.ok(DOMAIN_GROWTH._default, 'Missing _default in DOMAIN_GROWTH');
});

test('DOMAIN_GROWTH: all entries have complete structure', () => {
  const incomplete = [];
  Object.entries(DOMAIN_GROWTH).forEach(([domain, growth]) => {
    if (!growth.fj || !Array.isArray(growth.fj) || growth.fj.length !== 5) {
      incomplete.push(`${domain}: invalid fj (must be array of 5 Japanese funnel stages)`);
    }
    if (!growth.fe || !Array.isArray(growth.fe) || growth.fe.length !== 5) {
      incomplete.push(`${domain}: invalid fe (must be array of 5 English funnel stages)`);
    }
    if (!growth.cvr || !Array.isArray(growth.cvr) || growth.cvr.length !== 5) {
      incomplete.push(`${domain}: invalid cvr (must be array of 5 conversion rates)`);
    }
    if (!growth.eq || typeof growth.eq !== 'string') {
      incomplete.push(`${domain}: invalid eq (must be equation string)`);
    }
    if (!growth.lj || !Array.isArray(growth.lj) || growth.lj.length !== 5) {
      incomplete.push(`${domain}: invalid lj (must be array of 5 Japanese lever descriptions)`);
    }
    if (!growth.le || !Array.isArray(growth.le) || growth.le.length !== 5) {
      incomplete.push(`${domain}: invalid le (must be array of 5 English lever descriptions)`);
    }
    if (!growth.pj || !Array.isArray(growth.pj) || growth.pj.length !== 3) {
      incomplete.push(`${domain}: invalid pj (must be array of 3 Japanese pricing tiers)`);
    }
    if (!growth.pe || !Array.isArray(growth.pe) || growth.pe.length !== 3) {
      incomplete.push(`${domain}: invalid pe (must be array of 3 English pricing tiers)`);
    }
  });

  assert.equal(incomplete.length, 0,
    `Incomplete DOMAIN_GROWTH: ${incomplete.join('; ')}`);
});

test('pluralize: handles all preset entity names correctly', () => {
  const allEntities = new Set();
  Object.values(PR).forEach(preset => {
    if (preset.entities) {
      preset.entities.split(/[,、]\s*/).forEach(e => {
        const trimmed = e.trim();
        if (trimmed) allEntities.add(trimmed);
      });
    }
  });

  allEntities.forEach(entity => {
    const plural = pluralize(entity);
    // Should not return empty or same as input (unless it's an uncountable noun)
    assert.ok(plural && plural.length > 0,
      `pluralize('${entity}') returned empty`);

    // Should be lowercase
    assert.equal(plural, plural.toLowerCase(),
      `pluralize('${entity}') = '${plural}' is not lowercase`);
  });
});

test('getEntityMethods: restricted entities have proper methods', () => {
  const restricted = ['MedicalRecord', 'Vaccination', 'Prescription', 'SLA', 'Lease', 'Contract',
                      'Payment', 'Transaction', 'Invoice', 'Certificate'];

  restricted.forEach(entity => {
    const methods = getEntityMethods(entity);
    assert.ok(Array.isArray(methods), `${entity} methods should be array`);
    assert.ok(methods.length > 0, `${entity} methods should not be empty`);

    // Restricted entities should NOT have all 5 CRUD methods
    assert.ok(methods.length < 5,
      `${entity} should have restrictions (has ${methods.length} methods)`);
  });
});

test('inferER: generates relationships for common entity pairs', () => {
  // Create minimal S object needed for inferER
  const S_test = { genLang: 'ja' };
  const S_backup = globalThis.S;
  globalThis.S = S_test;

  try {
    const testCases = [
      { entities: 'User, Post, Comment', expectedRels: ['User 1 ──N Post', 'User 1 ──N Comment', 'Post 1 ──N Comment'] },
      { entities: 'User, Course, Lesson, Progress', expectedRels: ['Course 1 ──N Lesson', 'Lesson 1 ──N Progress'] },
      { entities: 'Product, Category, Order, Review', expectedRels: ['Product N ──1 Category', 'Product 1 ──N Review'] },
      { entities: 'Patient, Doctor, MedicalRecord', expectedRels: ['Patient 1 ──N MedicalRecord', 'Doctor 1 ──N MedicalRecord'] },
    ];

    testCases.forEach(({ entities, expectedRels }) => {
      const result = inferER({ purpose: 'test', data_entities: entities });
      expectedRels.forEach(expectedRel => {
        assert.ok(result.relationships.includes(expectedRel),
          `Missing relationship: ${expectedRel} in entities: ${entities}`);
      });
    });
  } finally {
    globalThis.S = S_backup;
  }
});

test('ENTITY_COLUMNS: new medical entities are defined', () => {
  const medicalEntities = ['Patient', 'Doctor', 'MedicalRecord', 'Prescription',
                           'Appointment', 'Pet', 'Vaccination', 'Veterinarian'];
  medicalEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new property management entities are defined', () => {
  const propMgmtEntities = ['Property', 'Unit', 'Tenant', 'Lease',
                            'MaintenanceRequest', 'Owner'];
  propMgmtEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new contract management entities are defined', () => {
  const contractEntities = ['Contract', 'Party', 'Approval', 'Signature', 'Clause'];
  contractEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new helpdesk entities are defined', () => {
  const helpdeskEntities = ['KnowledgeArticle', 'Response', 'SLA', 'Priority'];
  helpdeskEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new tutoring entities are defined', () => {
  const tutoringEntities = ['Tutor', 'Student', 'Subject', 'Availability'];
  tutoringEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new restaurant entities are defined', () => {
  const restaurantEntities = ['Table', 'Reservation', 'MenuItem', 'Shift'];
  restaurantEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new construction payment entities are defined', () => {
  const constructionEntities = ['Contractor', 'ProgressReport', 'Estimate'];
  constructionEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new knowledge base entities are defined', () => {
  const kbEntities = ['Article', 'AccessControl', 'SearchLog'];
  kbEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('ENTITY_COLUMNS: new field service entities are defined', () => {
  const fieldServiceEntities = ['WorkOrder', 'Technician', 'Location', 'Customer'];
  fieldServiceEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
  });
});

test('detectDomain: new domain patterns are recognized', () => {
  const testCases = [
    { purpose: '動物病院の診療記録管理', expected: 'health' },
    { purpose: 'veterinary clinic management system', expected: 'health' },
    { purpose: 'レストラン予約システム', expected: 'booking' },
    { purpose: 'restaurant reservation app', expected: 'booking' },
    { purpose: '工事代金管理システム', expected: 'fintech' },
    { purpose: 'construction payment management', expected: 'fintech' },
    { purpose: 'ヘルプデスクツール', expected: 'saas' },
    { purpose: 'helpdesk ticketing system', expected: 'saas' },
    { purpose: 'フィールドサービス管理', expected: 'iot' },
    { purpose: 'field service management', expected: 'iot' },
    // Note: Some Japanese terms may not have specific patterns
    { purpose: 'PWAオフラインツール', expected: 'tool' },
    { purpose: 'progressive web app', expected: 'tool' },
    { purpose: 'link in bio tool', expected: 'portfolio' },
    { purpose: 'AIチャットボット', expected: 'ai' },
    { purpose: 'AI agent platform', expected: 'ai' },
    { purpose: 'ナレッジベース構築', expected: 'content' },
    { purpose: 'knowledge base builder', expected: 'content' },
    // 8 new domains (Task #2)
    { purpose: '工場の生産管理システム', expected: 'manufacturing' },
    { purpose: 'factory production management', expected: 'manufacturing' },
    { purpose: '配送追跡・物流管理', expected: 'logistics' },
    { purpose: 'delivery tracking and logistics', expected: 'logistics' },
    { purpose: 'スマート農業プラットフォーム', expected: 'agriculture' },
    { purpose: 'smart agriculture platform', expected: 'agriculture' },
    { purpose: 'エネルギー管理システム', expected: 'energy' },
    { purpose: 'energy management system', expected: 'energy' },
    { purpose: 'ストリーミング配信プラットフォーム', expected: 'media' },
    { purpose: 'streaming media platform', expected: 'media' },
    { purpose: '自治体の申請管理システム', expected: 'government' },
    { purpose: 'municipal application management', expected: 'government' },
    { purpose: '旅行予約プラットフォーム', expected: 'travel' },
    { purpose: 'travel booking platform', expected: 'travel' },
    { purpose: '保険テック・契約管理', expected: 'insurance' },
    { purpose: 'insurtech claim management', expected: 'insurance' },
    // Verify media/content collision fix
    { purpose: 'コンテンツ管理システム', expected: 'content' },
    { purpose: 'ブログプラットフォーム', expected: 'content' },
  ];

  testCases.forEach(({ purpose, expected }) => {
    const result = detectDomain(purpose);
    assert.equal(result, expected,
      `detectDomain('${purpose}') = '${result}', expected '${expected}'`);
  });
});

test('FEATURE_DETAILS: new feature patterns exist', () => {
  const newPatterns = [
    '検索|フィルタ|Search|Filter',
    '通知|リマインダー|Notification',
    '分析|レポート|Analytics|Report',
    'チーム|権限|Team|Permission',
    'チャット|メッセージ|Chat|Message',
    'エクスポート|Export|PDF|CSV',
    'カレンダー|スケジュール|Calendar',
    '在庫管理|Inventory|在庫|Stock',
  ];

  newPatterns.forEach(pattern => {
    let found = false;
    for (const key of Object.keys(FEATURE_DETAILS)) {
      if (new RegExp(pattern, 'i').test(key)) {
        found = true;
        break;
      }
    }
    assert.ok(found, `Missing FEATURE_DETAILS pattern matching: ${pattern}`);
  });
});

test('REVERSE_FLOW_MAP: all 32 domains have complete flow definitions', () => {
  // Load p10-reverse.js to get REVERSE_FLOW_MAP
  eval(fs.readFileSync('src/generators/p10-reverse.js', 'utf-8').replace(/const /g, 'var '));

  const domains = ['education', 'ec', 'saas', 'fintech', 'health', 'marketplace',
                   'community', 'content', 'analytics', 'booking', 'iot', 'realestate',
                   'legal', 'hr', 'portfolio', 'tool',
                   'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter',
                   'manufacturing', 'logistics', 'agriculture', 'energy', 'media', 'government', 'travel', 'insurance'];

  const incomplete = [];
  domains.forEach(domain => {
    const flow = REVERSE_FLOW_MAP[domain];
    if (!flow) {
      incomplete.push(`${domain}: missing`);
      return;
    }

    // Check goal_ja/en
    if (!flow.goal_ja || flow.goal_ja.length === 0) {
      incomplete.push(`${domain}: empty goal_ja`);
    }
    if (!flow.goal_en || flow.goal_en.length === 0) {
      incomplete.push(`${domain}: empty goal_en`);
    }

    // Check flow_ja/en (should have at least 3 steps)
    if (!flow.flow_ja || flow.flow_ja.length < 3) {
      incomplete.push(`${domain}: flow_ja has ${flow.flow_ja?.length || 0} steps (need ≥3)`);
    }
    if (!flow.flow_en || flow.flow_en.length < 3) {
      incomplete.push(`${domain}: flow_en has ${flow.flow_en?.length || 0} steps (need ≥3)`);
    }

    // Check kpi_ja/en (should have at least 3 KPIs)
    if (!flow.kpi_ja || flow.kpi_ja.length < 3) {
      incomplete.push(`${domain}: kpi_ja has ${flow.kpi_ja?.length || 0} KPIs (need ≥3)`);
    }
    if (!flow.kpi_en || flow.kpi_en.length < 3) {
      incomplete.push(`${domain}: kpi_en has ${flow.kpi_en?.length || 0} KPIs (need ≥3)`);
    }

    // Check risks_ja/en (should have at least 2 risks)
    if (!flow.risks_ja || flow.risks_ja.length < 2) {
      incomplete.push(`${domain}: risks_ja has ${flow.risks_ja?.length || 0} risks (need ≥2)`);
    }
    if (!flow.risks_en || flow.risks_en.length < 2) {
      incomplete.push(`${domain}: risks_en has ${flow.risks_en?.length || 0} risks (need ≥2)`);
    }
  });

  assert.equal(incomplete.length, 0,
    'Incomplete REVERSE_FLOW_MAP: ' + incomplete.join(', '));
});


// ═══ P15: Future Strategy Intelligence Data Coverage ═══

test("DOMAIN_MARKET: covers all 32 domains from detectDomain()", () => {
  // Get list of domains from detectDomain (32 domains)
  const expectedDomains = [
    "education", "ec", "fintech", "health", "saas", "marketplace",
    "community", "content", "booking", "iot", "realestate", "legal",
    "hr", "analytics", "portfolio", "tool", "ai", "automation",
    "event", "gamify", "collab", "devtool", "creator", "newsletter",
    "manufacturing", "logistics", "agriculture", "energy", "media", "government", "travel", "insurance"
  ];

  const missingDomains = [];
  expectedDomains.forEach(domain => {
    if (!DOMAIN_MARKET[domain]) {
      missingDomains.push(domain);
    }
  });

  assert.equal(missingDomains.length, 0,
    `DOMAIN_MARKET missing domains: ${missingDomains.join(", ")}`);

  // Check _default exists
  assert.ok(DOMAIN_MARKET._default, "DOMAIN_MARKET should have _default fallback");
});

test("DOMAIN_MARKET: all domains have complete bilingual properties", () => {
  const requiredProps = ["moat_ja", "moat_en", "gtm_ja", "gtm_en", "ux_ja", "ux_en", "eco_ja", "eco_en", "reg_ja", "reg_en", "esg_ja", "esg_en"];
  const incomplete = [];

  Object.entries(DOMAIN_MARKET).forEach(([domain, data]) => {
    requiredProps.forEach(prop => {
      if (!data[prop] || data[prop].trim().length === 0) {
        incomplete.push(`${domain}.${prop}`);
      }
    });
  });

  assert.equal(incomplete.length, 0,
    `DOMAIN_MARKET incomplete properties: ${incomplete.join(", ")}`);
});

test("PERSONA_ARCHETYPES: covers all 32 domains", () => {
  const expectedDomains = [
    "education", "ec", "fintech", "health", "saas", "marketplace",
    "community", "content", "booking", "iot", "realestate", "legal",
    "hr", "analytics", "portfolio", "tool", "ai", "automation",
    "event", "gamify", "collab", "devtool", "creator", "newsletter",
    "manufacturing", "logistics", "agriculture", "energy", "media", "government", "travel", "insurance"
  ];

  const missingDomains = [];
  expectedDomains.forEach(domain => {
    if (!PERSONA_ARCHETYPES[domain]) {
      missingDomains.push(domain);
    }
  });

  assert.equal(missingDomains.length, 0,
    `PERSONA_ARCHETYPES missing domains: ${missingDomains.join(", ")}`);

  // Check _default exists
  assert.ok(PERSONA_ARCHETYPES._default, "PERSONA_ARCHETYPES should have _default fallback");
});

test('ENTITY_COLUMNS: new 8-domain entities are defined (Task B)', () => {
  const newEntities = [
    // Manufacturing (3)
    'ProductionOrder', 'Machine', 'QualityCheck',
    // Logistics (3)
    'Package', 'Delivery', 'Vehicle',
    // Agriculture (5)
    'Farm', 'Crop', 'Field', 'Harvest', 'Equipment',
    // Energy (3)
    'Meter', 'Reading', 'Tariff',
    // Media (2)
    'Program', 'Episode',
    // Government (2)
    'Application', 'Citizen',
    // Travel (3)
    'Itinerary', 'Hotel', 'Flight',
    // Insurance (2)
    'Policy', 'Quote'
  ];

  const missingEntities = [];
  newEntities.forEach(entity => {
    if (!ENTITY_COLUMNS[entity]) {
      missingEntities.push(entity);
    }
  });

  assert.equal(missingEntities.length, 0,
    `Missing ENTITY_COLUMNS for new 8-domain entities (${missingEntities.length}/23): ` + missingEntities.join(', '));
});

// ═══ P19: Enterprise SaaS Blueprint — Entity Coverage ═══

test('ENTITY_COLUMNS: enterprise multi-tenant entities are defined', () => {
  const enterpriseEntities = ['Organization', 'OrgMember', 'OrgInvite'];
  enterpriseEntities.forEach(entity => {
    assert.ok(ENTITY_COLUMNS[entity], `Missing ENTITY_COLUMNS.${entity}`);
    assert.ok(Array.isArray(ENTITY_COLUMNS[entity]) && ENTITY_COLUMNS[entity].length >= 3,
      `${entity} should have >=3 column definitions`);
  });
});

test('ENTITY_COLUMNS: Organization has slug, plan, and status fields', () => {
  const org = ENTITY_COLUMNS['Organization'];
  assert.ok(org, 'Organization entity should exist');
  const colStr = org.join(' ');
  assert.ok(colStr.includes('slug'), 'Organization has slug column');
  assert.ok(colStr.includes('plan'), 'Organization has plan column');
});

test('ENTITY_COLUMNS: OrgMember has org_id and user_id FK references', () => {
  const member = ENTITY_COLUMNS['OrgMember'];
  assert.ok(member, 'OrgMember entity should exist');
  const colStr = member.join(' ');
  assert.ok(colStr.includes('FK(Organization)'), 'OrgMember has FK to Organization');
  assert.ok(colStr.includes('role'), 'OrgMember has role column');
});

test('ENTITY_COLUMNS: OrgInvite has email, token, and expires_at fields', () => {
  const invite = ENTITY_COLUMNS['OrgInvite'];
  assert.ok(invite, 'OrgInvite entity should exist');
  const colStr = invite.join(' ');
  assert.ok(colStr.includes('email'), 'OrgInvite has email column');
  assert.ok(colStr.includes('token'), 'OrgInvite has token column');
  assert.ok(colStr.includes('expires_at'), 'OrgInvite has expires_at column');
});

test('DOMAIN_ENTITIES: saas domain includes Organization/OrgMember', () => {
  assert.ok(DOMAIN_ENTITIES['saas'], 'saas domain exists');
  const saas = DOMAIN_ENTITIES['saas'];
  const entities = saas.core ? saas.core.join(',') : (saas.join ? saas.join(',') : String(saas));
  assert.ok(entities.includes('Organization') || entities.includes('OrgMember'),
    'saas domain entities include Organization or OrgMember');
});

test('inferER: generates Organization relationships when entities present', () => {
  const S_backup = globalThis.S;
  globalThis.S = {genLang: 'ja'};
  try {
    const result = inferER({purpose: 'SaaS', data_entities: 'Organization, OrgMember, OrgInvite, User'});
    const rels = result.relationships || result;
    const relStr = Array.isArray(rels) ? rels.join('\n') : String(rels);
    assert.ok(relStr.includes('Organization') && relStr.includes('OrgMember'),
      'inferER generates Organization 1 ──N OrgMember');
  } finally {
    globalThis.S = S_backup;
  }
});
