const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTestEnv } = require('./helpers');

describe('i18n — reqLabel', () => {
  it('returns Japanese labels when lang=ja', () => {
    const env = createTestEnv();
    env.S.lang = 'ja';
    assert.equal(env.reqLabel('required'), '必須');
    assert.equal(env.reqLabel('recommended'), '推奨');
    assert.equal(env.reqLabel('optional'), '選択');
    assert.equal(env.reqLabel('top1'), '推奨No.1');
  });

  it('returns English labels when lang=en', () => {
    const env = createTestEnv();
    env.S.lang = 'en';
    assert.equal(env.reqLabel('required'), 'Required');
    assert.equal(env.reqLabel('recommended'), 'Recommended');
    assert.equal(env.reqLabel('optional'), 'Optional');
    assert.equal(env.reqLabel('top1'), 'Top Pick');
  });

  it('returns code as fallback for unknown values', () => {
    const env = createTestEnv();
    env.S.lang = 'en';
    assert.equal(env.reqLabel('unknown-code'), 'unknown-code');
  });
});

describe('i18n — priceLabel', () => {
  it('returns Japanese price labels', () => {
    const env = createTestEnv();
    env.S.lang = 'ja';
    assert.equal(env.priceLabel('free'), '無料');
    assert.equal(env.priceLabel('usage'), '従量制');
    assert.equal(env.priceLabel('paid'), '有料');
    assert.equal(env.priceLabel('free-25'), '無料〜$25');
    assert.equal(env.priceLabel('free-tier'), '無料〜');
  });

  it('returns English price labels', () => {
    const env = createTestEnv();
    env.S.lang = 'en';
    assert.equal(env.priceLabel('free'), 'Free');
    assert.equal(env.priceLabel('usage'), 'Usage-based');
    assert.equal(env.priceLabel('paid'), 'Paid');
    assert.equal(env.priceLabel('free-25'), 'Free–$25');
    assert.equal(env.priceLabel('free-tier'), 'Free tier');
  });

  it('returns empty string for falsy input', () => {
    const env = createTestEnv();
    assert.equal(env.priceLabel(''), '');
    assert.equal(env.priceLabel(undefined), '');
    assert.equal(env.priceLabel(null), '');
  });
});

describe('i18n — GT (GenTemplates)', () => {
  it('has ja and en dictionaries', () => {
    const env = createTestEnv();
    assert.ok(env.GT.ja, 'GT.ja should exist');
    assert.ok(env.GT.en, 'GT.en should exist');
  });

  it('both langs have same keys', () => {
    const env = createTestEnv();
    const jaKeys = Object.keys(env.GT.ja).sort();
    const enKeys = Object.keys(env.GT.en).sort();
    assert.deepEqual(jaKeys, enKeys, 'JA and EN should have identical keys');
  });

  it('no EN value is empty', () => {
    const env = createTestEnv();
    for (const [key, val] of Object.entries(env.GT.en)) {
      if (typeof val === 'string') {
        assert.ok(val.length > 0, `GT.en.${key} should not be empty`);
      }
    }
  });

  it('t() helper returns correct language', () => {
    const env = createTestEnv();
    assert.ok(env.GT.t, 'GT.t should exist');
    env.S.lang = 'ja'; env.S.genLang = 'ja';
    assert.equal(env.GT.t('l1'), 'Web基盤');
    env.S.genLang = 'en';
    assert.equal(env.GT.t('l1'), 'Web Fundamentals');
  });
});

describe('TechDB integrity', () => {
  it('has 200+ entries', () => {
    const env = createTestEnv();
    assert.ok(env.TECH_DB.length >= 200, `Expected 200+, got ${env.TECH_DB.length}`);
  });

  it('all entries have required fields', () => {
    const env = createTestEnv();
    for (const entry of env.TECH_DB) {
      assert.ok(entry.name, 'Entry missing name');
      assert.ok(entry.cat, `${entry.name} missing cat`);
      assert.ok(entry.req, `${entry.name} missing req`);
    }
  });

  it('all req values are valid codes', () => {
    const env = createTestEnv();
    const validReqs = new Set(Object.keys(env.REQ_LABELS.en));
    for (const entry of env.TECH_DB) {
      assert.ok(validReqs.has(entry.req), `${entry.name}: invalid req="${entry.req}"`);
    }
  });

  it('all price values have labels in both languages', () => {
    const env = createTestEnv();
    const priceEntries = env.TECH_DB.filter(e => e.price);
    for (const entry of priceEntries) {
      const jaLabel = env.PRICE_LABELS.ja[entry.price];
      const enLabel = env.PRICE_LABELS.en[entry.price];
      if (!jaLabel && !enLabel) {
        assert.ok(
          entry.price.startsWith('$') || entry.price.includes('%') || entry.price.includes('¥'),
          `${entry.name}: price="${entry.price}" has no label and is not a raw price`
        );
      }
    }
  });
});

describe('Presets', () => {
  it('has bilingual names for all presets', () => {
    const env = createTestEnv();
    for (const [key, preset] of Object.entries(env.PRESETS)) {
      if (key === 'custom') continue;
      assert.ok(preset.name, `Preset ${key} missing name`);
      assert.ok(preset.nameEn, `Preset ${key} missing nameEn`);
      assert.ok(preset.purpose, `Preset ${key} missing purpose`);
      assert.ok(preset.purposeEn, `Preset ${key} missing purposeEn`);
    }
  });
});
