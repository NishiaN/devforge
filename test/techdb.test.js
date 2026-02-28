const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./harness.js');

describe('TechDB', () => {
  it('has 395 entries', () => {
    assert.equal(h.TECH_DB.length, 395);
  });

  it('all entries have required fields', () => {
    for (const t of h.TECH_DB) {
      assert.ok(t.name, `Missing name: ${JSON.stringify(t).slice(0,60)}`);
      assert.ok(t.cat, `${t.name} missing cat`);
      assert.ok(t.req, `${t.name} missing req`);
      assert.ok(t.level, `${t.name} missing level`);
    }
  });

  it('req values are English codes, not Japanese', () => {
    const validReq = ['required','top1','top2','rec-jp','rec-oss','recommended','optional'];
    for (const t of h.TECH_DB) {
      assert.ok(validReq.includes(t.req), `${t.name} has invalid req: ${t.req}`);
    }
  });

  it('price values have no standalone Japanese text', () => {
    const jaPattern = /^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/;
    for (const t of h.TECH_DB) {
      if (t.price) {
        assert.ok(!jaPattern.test(t.price), `${t.name} has pure-JA price: ${t.price}`);
      }
    }
  });

  it('REQ_LABELS has both ja and en', () => {
    assert.ok(h.REQ_LABELS.ja);
    assert.ok(h.REQ_LABELS.en);
    assert.equal(Object.keys(h.REQ_LABELS.ja).length, Object.keys(h.REQ_LABELS.en).length);
  });

  it('has no duplicate names', () => {
    const names = h.TECH_DB.map(t => t.name);
    const seen = new Set();
    const dups = [];
    for (const n of names) {
      if (seen.has(n)) dups.push(n);
      seen.add(n);
    }
    assert.deepEqual(dups, [], `Duplicate TECH_DB names: ${dups.join(', ')}`);
  });

  it('all core categories are represented', () => {
    const cats = new Set(h.TECH_DB.map(t => t.cat));
    const required = ['lang','front','back','mobile','data','devops','test','ai','method'];
    for (const c of required) {
      assert.ok(cats.has(c), `Missing category: ${c}`);
    }
  });

  it('level field values are non-empty strings', () => {
    for (const t of h.TECH_DB) {
      assert.ok(typeof t.level === 'string' && t.level.length > 0,
        `${t.name} has invalid level: ${t.level}`);
    }
  });
});
