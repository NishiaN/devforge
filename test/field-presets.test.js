const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./harness.js');

const PR_FIELD = h.PR_FIELD;
const FIELD_CAT_MAP = h.FIELD_CAT_MAP;
const FIELD_TREND = h.FIELD_TREND;
const _SCALE_DEFAULTS = h._SCALE_DEFAULTS;
const FIELD_CATS_JA = h.FIELD_CATS_JA;
const FIELD_CATS_EN = h.FIELD_CATS_EN;
const PR = h.PR;

describe('Field Presets (PR_FIELD)', () => {
  const fieldKeys = Object.keys(PR_FIELD);
  const VALID_FIELDS = new Set([
    'engineering','science','agriculture','medical','social',
    'humanities','education_field','art','interdisciplinary',
    'environment','architecture','sports','welfare','tourism',
    'biotech','mobility','cybersecurity','fintech_field','smart_factory','cross_theme'
  ]);
  const VALID_SCALES = ['solo','small','medium','large'];
  const META_DIMS = ['revenue','regulation','apiDep','agentLv','multimodal','onDevice'];

  it('PR_FIELD has 82 entries', () => {
    assert.equal(fieldKeys.length, 82);
  });

  it('every field preset has bilingual name and icon', () => {
    for (const k of fieldKeys) {
      const p = PR_FIELD[k];
      assert.ok(p.name, `${k} missing name`);
      assert.ok(p.nameEn, `${k} missing nameEn`);
      assert.ok(p.icon, `${k} missing icon`);
    }
  });

  it('every field preset has bilingual purpose', () => {
    for (const k of fieldKeys) {
      const p = PR_FIELD[k];
      assert.ok(p.purpose, `${k} missing purpose`);
      assert.ok(p.purposeEn, `${k} missing purposeEn`);
    }
  });

  it('every field preset has entities string', () => {
    for (const k of fieldKeys) {
      const p = PR_FIELD[k];
      assert.ok(p.entities && p.entities.length > 0, `${k} missing entities`);
    }
  });

  it('every field preset has a valid field category', () => {
    for (const k of fieldKeys) {
      const p = PR_FIELD[k];
      assert.ok(
        VALID_FIELDS.has(p.field),
        `${k} has invalid field: ${p.field}`
      );
    }
  });

  it('every field preset has scaleHint with 4 scales × ja/en', () => {
    for (const k of fieldKeys) {
      const p = PR_FIELD[k];
      assert.ok(p.scaleHint, `${k} missing scaleHint`);
      for (const scale of VALID_SCALES) {
        assert.ok(p.scaleHint[scale], `${k} missing scaleHint.${scale}`);
        assert.equal(typeof p.scaleHint[scale].ja, 'string', `${k}.scaleHint.${scale}.ja not string`);
        assert.equal(typeof p.scaleHint[scale].en, 'string', `${k}.scaleHint.${scale}.en not string`);
      }
    }
  });

  it('every field preset has meta with all 6 dimensions', () => {
    for (const k of fieldKeys) {
      const p = PR_FIELD[k];
      assert.ok(p.meta, `${k} missing meta`);
      for (const dim of META_DIMS) {
        assert.ok(p.meta[dim], `${k} missing meta.${dim}`);
      }
    }
  });

  it('no key collision between PR and PR_FIELD', () => {
    const standardKeys = new Set(Object.keys(PR));
    for (const k of fieldKeys) {
      assert.ok(!standardKeys.has(k), `Key collision: ${k} exists in both PR and PR_FIELD`);
    }
  });
});

describe('_SCALE_DEFAULTS', () => {
  const REQUIRED_SCALE_FIELDS = ['frontend','backend','deploy','ai_auto'];

  it('has 4 scale entries', () => {
    assert.equal(Object.keys(_SCALE_DEFAULTS).length, 4);
  });

  it('each scale has required fields', () => {
    for (const scale of ['solo','small','medium','large']) {
      const s = _SCALE_DEFAULTS[scale];
      assert.ok(s, `missing scale: ${scale}`);
      for (const f of REQUIRED_SCALE_FIELDS) {
        assert.ok(s[f], `${scale} missing ${f}`);
      }
    }
  });
});

describe('FIELD_CAT_MAP', () => {
  it('covers all 82 field presets', () => {
    assert.equal(Object.keys(FIELD_CAT_MAP).length, 82);
  });

  it('all FIELD_CAT_MAP values match PR_FIELD[key].field', () => {
    for (const [k, fieldVal] of Object.entries(FIELD_CAT_MAP)) {
      assert.ok(PR_FIELD[k], `FIELD_CAT_MAP key ${k} not in PR_FIELD`);
      assert.equal(
        fieldVal,
        PR_FIELD[k].field,
        `FIELD_CAT_MAP[${k}]='${fieldVal}' but PR_FIELD[${k}].field='${PR_FIELD[k].field}'`
      );
    }
  });
});

describe('FIELD_TREND', () => {
  it('has 19 field category entries', () => {
    assert.equal(Object.keys(FIELD_TREND).length, 19);
  });

  it('all trend values are integers 1-5', () => {
    for (const [field, stars] of Object.entries(FIELD_TREND)) {
      assert.ok(
        Number.isInteger(stars) && stars >= 1 && stars <= 5,
        `FIELD_TREND.${field}=${stars} is not 1-5`
      );
    }
  });
});

describe('FIELD_CATS_JA / FIELD_CATS_EN', () => {
  it('FIELD_CATS_JA has 21 buttons (all + 20 fields)', () => {
    assert.equal(FIELD_CATS_JA.length, 21);
  });

  it('FIELD_CATS_EN has 21 buttons (all + 20 fields)', () => {
    assert.equal(FIELD_CATS_EN.length, 21);
  });

  it('both start with an all category', () => {
    assert.equal(FIELD_CATS_JA[0].key, 'all');
    assert.equal(FIELD_CATS_EN[0].key, 'all');
  });

  it('JA/EN have matching keys', () => {
    assert.equal(FIELD_CATS_JA.length, FIELD_CATS_EN.length);
    for (let i = 0; i < FIELD_CATS_JA.length; i++) {
      assert.equal(FIELD_CATS_JA[i].key, FIELD_CATS_EN[i].key, `Key mismatch at index ${i}`);
    }
  });
});
