const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./harness.js');

const PR = h.sandbox.PR;

describe('Presets', () => {
  const keys = Object.keys(PR);

  it('has 41 presets (including custom)', () => {
    assert.equal(keys.length, 41);
  });

  it('every preset has bilingual name', () => {
    for (const key of keys) {
      if (key === 'custom') continue; // blank template
      const p = PR[key];
      assert.ok(p.name, `${key} missing name`);
      assert.ok(p.nameEn, `${key} missing nameEn`);
      assert.ok(p.icon, `${key} missing icon`);
    }
  });

  it('every preset has required tech fields', () => {
    for (const key of keys) {
      if (key === 'custom') continue; // blank template
      const p = PR[key];
      assert.ok(p.frontend, `${key} missing frontend`);
      assert.ok(p.backend !== undefined, `${key} missing backend`);
      assert.ok(p.entities, `${key} missing entities`);
    }
  });

  it('every preset has bilingual purpose', () => {
    for (const key of keys) {
      if (key === 'custom') continue; // blank template
      const p = PR[key];
      assert.ok(p.purpose, `${key} missing purpose`);
      assert.ok(p.purposeEn, `${key} missing purposeEn`);
    }
  });
});
