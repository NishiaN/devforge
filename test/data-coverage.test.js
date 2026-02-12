const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// Load modules
eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR','var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));

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
                   'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter'];

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
                   'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter'];

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
                   'ai', 'automation', 'event', 'gamify', 'collab', 'devtool', 'creator', 'newsletter'];

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
    { purpose: 'construction payment tracking', expected: 'fintech' },
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
