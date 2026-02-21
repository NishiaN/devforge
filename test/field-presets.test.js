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
const FIELD_CAT_DEFAULTS = h.FIELD_CAT_DEFAULTS;
const THEME_OVERLAYS = h.THEME_OVERLAYS;

describe('Field Presets (PR_FIELD)', () => {
  const fieldKeys = Object.keys(PR_FIELD);
  const VALID_FIELDS = new Set([
    'engineering','science','agriculture','medical','social',
    'humanities','education_field','art','interdisciplinary',
    'environment','architecture','sports','welfare','tourism',
    'biotech','mobility','cybersecurity','fintech_field','smart_factory','cross_theme',
    // Phase L: 14 new categories
    'gaming','video','live_event','publishing','gambling',
    'podcast','music_biz','housing','food','mental_health',
    'fashion','shopping','pet','car_life'
  ]);
  const VALID_SCALES = ['solo','small','medium','large'];
  const META_DIMS = ['revenue','regulation','apiDep','agentLv','multimodal','onDevice'];

  it('PR_FIELD has 138 entries', () => {
    assert.equal(fieldKeys.length, 138);
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
  const REQUIRED_SCALE_FIELDS = ['frontend','backend','deploy','ai_auto','database','auth','css_fw','dev_methods','dev_methodsEn'];

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
  it('covers all 138 field presets', () => {
    assert.equal(Object.keys(FIELD_CAT_MAP).length, 138);
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
  it('has 34 field category entries', () => {
    assert.equal(Object.keys(FIELD_TREND).length, 34);
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
  it('FIELD_CATS_JA has 35 buttons (all + 34 fields)', () => {
    assert.equal(FIELD_CATS_JA.length, 35);
  });

  it('FIELD_CATS_EN has 35 buttons (all + 34 fields)', () => {
    assert.equal(FIELD_CATS_EN.length, 35);
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

describe('FIELD_CAT_DEFAULTS (Layer 2)', () => {
  const VALID_FIELDS = [
    'engineering','science','agriculture','medical','social',
    'humanities','education_field','art','interdisciplinary',
    'environment','architecture','sports','welfare','tourism',
    'biotech','mobility','cybersecurity','fintech_field','smart_factory','cross_theme',
    // Phase L: 14 new categories
    'gaming','video','live_event','publishing','gambling',
    'podcast','music_biz','housing','food','mental_health',
    'fashion','shopping','pet','car_life'
  ];
  const VALID_PAYMENT = new Set(['none','stripe','stripe_billing','ec_build']);
  const VALID_MOBILE = new Set(['none','Expo (React Native)','Flutter','PWA']);

  it('covers all 34 field categories', () => {
    assert.equal(Object.keys(FIELD_CAT_DEFAULTS).length, 34);
    for (const f of VALID_FIELDS) {
      assert.ok(FIELD_CAT_DEFAULTS[f], `Missing category: ${f}`);
    }
  });

  it('every category has bilingual target arrays', () => {
    for (const f of VALID_FIELDS) {
      const d = FIELD_CAT_DEFAULTS[f];
      assert.ok(Array.isArray(d.target), `${f} target not array`);
      assert.ok(d.target.length >= 2, `${f} target too short`);
      assert.ok(Array.isArray(d.targetEn), `${f} targetEn not array`);
      assert.ok(d.targetEn.length >= 2, `${f} targetEn too short`);
    }
  });

  it('every category has bilingual screens arrays (≥3)', () => {
    for (const f of VALID_FIELDS) {
      const d = FIELD_CAT_DEFAULTS[f];
      assert.ok(Array.isArray(d.screens), `${f} screens not array`);
      assert.ok(d.screens.length >= 3, `${f} screens too short`);
      assert.ok(Array.isArray(d.screensEn), `${f} screensEn not array`);
      assert.ok(d.screensEn.length >= 3, `${f} screensEn too short`);
    }
  });

  it('target/targetEn lengths match per category', () => {
    for (const f of VALID_FIELDS) {
      const d = FIELD_CAT_DEFAULTS[f];
      assert.equal(d.target.length, d.targetEn.length, `${f} target/targetEn length mismatch`);
    }
  });

  it('screens/screensEn lengths match per category', () => {
    for (const f of VALID_FIELDS) {
      const d = FIELD_CAT_DEFAULTS[f];
      assert.equal(d.screens.length, d.screensEn.length, `${f} screens/screensEn length mismatch`);
    }
  });

  it('payment values are valid (none|stripe|stripe_billing|ec_build)', () => {
    for (const f of VALID_FIELDS) {
      const d = FIELD_CAT_DEFAULTS[f];
      assert.ok(VALID_PAYMENT.has(d.payment), `${f} invalid payment: ${d.payment}`);
    }
  });

  it('mobile values are valid (none|Expo|Flutter|PWA)', () => {
    for (const f of VALID_FIELDS) {
      const d = FIELD_CAT_DEFAULTS[f];
      assert.ok(VALID_MOBILE.has(d.mobile), `${f} invalid mobile: ${d.mobile}`);
    }
  });

  it('every category has org_model field', () => {
    const VALID_ORG = new Set(['シングルテナント','マルチテナント(RLS)','ワークスペース型','組織+チーム階層']);
    for (const f of VALID_FIELDS) {
      const d = FIELD_CAT_DEFAULTS[f];
      assert.ok(VALID_ORG.has(d.org_model), `${f} invalid org_model: ${d.org_model}`);
    }
  });
});

describe('PR_FIELD individual overrides', () => {
  it('edu_tutor_bot overrides target to students/parents', () => {
    const fp = PR_FIELD['edu_tutor_bot'];
    assert.ok(fp.target, 'edu_tutor_bot missing target override');
    const targets = Array.isArray(fp.target) ? fp.target : fp.target.split(', ');
    assert.ok(targets.some(t => /保護者|Parents/i.test(t)), 'edu_tutor_bot target should include parents');
  });

  it('arch_realestate overrides target to investors', () => {
    const fp = PR_FIELD['arch_realestate'];
    assert.ok(fp.target, 'arch_realestate missing target override');
    const targets = Array.isArray(fp.target) ? fp.target : fp.target.split(', ');
    assert.ok(targets.some(t => /投資家|Investor/i.test(t)), 'arch_realestate target should include investors');
  });

  it('sport_stadium overrides target to fans', () => {
    const fp = PR_FIELD['sport_stadium'];
    assert.ok(fp.target, 'sport_stadium missing target override');
    const targets = Array.isArray(fp.target) ? fp.target : fp.target.split(', ');
    assert.ok(targets.some(t => /ファン|Fan/i.test(t)), 'sport_stadium target should include fans');
  });

  it('sport_injury overrides mobile to Expo', () => {
    const fp = PR_FIELD['sport_injury'];
    assert.equal(fp.mobile, 'Expo (React Native)', 'sport_injury mobile should be Expo');
  });

  it('welf_record overrides mobile to Expo', () => {
    const fp = PR_FIELD['welf_record'];
    assert.equal(fp.mobile, 'Expo (React Native)', 'welf_record mobile should be Expo');
  });
});

describe('PR_FIELD meta value integrity', () => {
  const VALID_REVENUE = new Set(['subscription','btob','subsidy','freemium','usage','license','ec']);
  const VALID_REGULATION = new Set(['low','moderate','medium','high','strict','highest']);
  const VALID_ON_DEVICE = new Set(['cloud','edge_cloud','on_device','on_premise']);

  it('all meta.revenue values are valid', () => {
    for (const k of Object.keys(PR_FIELD)) {
      const m = PR_FIELD[k].meta;
      assert.ok(VALID_REVENUE.has(m.revenue), `${k} invalid meta.revenue: ${m.revenue}`);
    }
  });

  it('all meta.regulation values are valid', () => {
    for (const k of Object.keys(PR_FIELD)) {
      const m = PR_FIELD[k].meta;
      assert.ok(VALID_REGULATION.has(m.regulation), `${k} invalid meta.regulation: ${m.regulation}`);
    }
  });

  it('all meta.onDevice values are valid', () => {
    for (const k of Object.keys(PR_FIELD)) {
      const m = PR_FIELD[k].meta;
      assert.ok(VALID_ON_DEVICE.has(m.onDevice), `${k} invalid meta.onDevice: ${m.onDevice}`);
    }
  });

  it('subscription revenue presets count ≥10', () => {
    const count = Object.values(PR_FIELD).filter(p => p.meta.revenue === 'subscription').length;
    assert.ok(count >= 10, `Expected ≥10 subscription presets, got ${count}`);
  });

  it('strict regulation presets count ≥10', () => {
    const count = Object.values(PR_FIELD).filter(p => p.meta.regulation === 'strict').length;
    assert.ok(count >= 10, `Expected ≥10 strict regulation presets, got ${count}`);
  });
});

describe('Standard preset new fields (Phase M)', () => {
  const _PD = h._PD;

  it('_PD has deploy field', () => {
    assert.ok(_PD.deploy, '_PD missing deploy');
  });

  it('_PD has dev_methods field', () => {
    assert.ok(_PD.dev_methods, '_PD missing dev_methods');
    assert.ok(_PD.dev_methodsEn, '_PD missing dev_methodsEn');
  });

  it('saas.screens includes ダッシュボード and プラン管理', () => {
    const s = PR['saas'];
    assert.ok(Array.isArray(s.screens), 'saas.screens not array');
    assert.ok(s.screens.some(x => x.includes('ダッシュボード')), 'saas.screens missing dashboard');
    assert.ok(s.screens.some(x => x.includes('プラン')), 'saas.screens missing plan');
  });

  it('ec.screens includes カート and チェックアウト', () => {
    const s = PR['ec'];
    assert.ok(s.screens.some(x => x.includes('カート')), 'ec.screens missing cart');
    assert.ok(s.screens.some(x => x.includes('チェックアウト')), 'ec.screens missing checkout');
  });

  it('saas.org_model is マルチテナント(RLS)', () => {
    assert.equal(PR['saas'].org_model, 'マルチテナント(RLS)', 'saas.org_model mismatch');
  });

  it('collab.org_model is ワークスペース型', () => {
    assert.equal(PR['collab'].org_model, 'ワークスペース型', 'collab.org_model mismatch');
  });

  it('lms.deploy is Firebase Hosting', () => {
    assert.equal(PR['lms'].deploy, 'Firebase Hosting', 'lms.deploy mismatch');
  });

  it('social.deploy is Firebase Hosting', () => {
    assert.equal(PR['social'].deploy, 'Firebase Hosting', 'social.deploy mismatch');
  });
});

describe('Phase L: 14 new domain categories', () => {
  const NEW_CATS = ['gaming','video','live_event','publishing','gambling',
    'podcast','music_biz','housing','food','mental_health',
    'fashion','shopping','pet','car_life'];
  const NEW_CAT_KEYS = {
    gaming:['game_npc','game_procgen','game_esports','game_testing'],
    video:['video_gen','video_edit','video_subtitle','video_analytics'],
    live_event:['event_mgmt','event_immersive','event_venue','event_fan'],
    publishing:['pub_manga','pub_novel','pub_translate','pub_ip'],
    gambling:['gamble_responsible','gamble_fraud','gamble_personalize','gamble_analytics'],
    podcast:['pod_production','pod_transcript','pod_voice','pod_monetize'],
    music_biz:['music_compose','music_analysis','music_copyright','music_edu'],
    housing:['house_smart','house_design','house_maintain','house_match'],
    food:['food_recipe','food_nutrition','food_restaurant','food_supply'],
    mental_health:['mental_cbt','mental_stress','mental_sleep','mental_burnout'],
    fashion:['fashion_stylist','fashion_tryon','fashion_sustain','fashion_trend'],
    shopping:['shop_budget','shop_points','shop_price','shop_sustain'],
    pet:['pet_health','pet_behavior','pet_insurance','pet_ec'],
    car_life:['car_predict','car_ev','car_valuation','car_safety']
  };

  it('all 14 new categories exist in FIELD_CAT_DEFAULTS', () => {
    for (const cat of NEW_CATS) {
      assert.ok(FIELD_CAT_DEFAULTS[cat], `Missing new category: ${cat}`);
    }
  });

  it('each new category has exactly 4 presets in PR_FIELD', () => {
    for (const [cat, keys] of Object.entries(NEW_CAT_KEYS)) {
      for (const k of keys) {
        assert.ok(PR_FIELD[k], `Missing preset: ${k} (category: ${cat})`);
        assert.equal(PR_FIELD[k].field, cat, `${k}.field should be ${cat}`);
      }
    }
  });

  it('new presets have valid bilingual names', () => {
    for (const keys of Object.values(NEW_CAT_KEYS)) {
      for (const k of keys) {
        const p = PR_FIELD[k];
        assert.ok(p.name, `${k} missing name`);
        assert.ok(p.nameEn, `${k} missing nameEn`);
      }
    }
  });

  it('FIELD_CATS_JA/EN include all 14 new categories', () => {
    for (const cat of NEW_CATS) {
      assert.ok(FIELD_CATS_JA.some(c => c.key === cat), `FIELD_CATS_JA missing: ${cat}`);
      assert.ok(FIELD_CATS_EN.some(c => c.key === cat), `FIELD_CATS_EN missing: ${cat}`);
    }
  });

  it('FIELD_TREND includes all 14 new categories with valid scores', () => {
    for (const cat of NEW_CATS) {
      assert.ok(cat in FIELD_TREND, `FIELD_TREND missing: ${cat}`);
      const stars = FIELD_TREND[cat];
      assert.ok(Number.isInteger(stars) && stars >= 1 && stars <= 5,
        `FIELD_TREND.${cat}=${stars} is not 1-5`);
    }
  });
});

describe('THEME_OVERLAYS', () => {
  const EXPECTED_THEMES = ['theme_security','theme_a11y','theme_sustainability',
    'theme_agent','theme_analytics','theme_on_device'];
  const OVERLAY_FIELDS = ['addFeatures','addFeaturesEn','addEntities','addScreens','addScreensEn','metaOverride'];

  it('has 6 theme overlay entries', () => {
    assert.ok(THEME_OVERLAYS, 'THEME_OVERLAYS not defined');
    assert.equal(Object.keys(THEME_OVERLAYS).length, 6);
  });

  it('all 6 expected themes exist', () => {
    for (const theme of EXPECTED_THEMES) {
      assert.ok(THEME_OVERLAYS[theme], `Missing theme overlay: ${theme}`);
    }
  });

  it('each theme has all required fields', () => {
    for (const theme of EXPECTED_THEMES) {
      const ov = THEME_OVERLAYS[theme];
      for (const field of OVERLAY_FIELDS) {
        assert.ok(field in ov, `${theme} missing field: ${field}`);
      }
    }
  });

  it('addFeatures and addFeaturesEn are non-empty arrays', () => {
    for (const theme of EXPECTED_THEMES) {
      const ov = THEME_OVERLAYS[theme];
      assert.ok(Array.isArray(ov.addFeatures) && ov.addFeatures.length > 0,
        `${theme}.addFeatures should be non-empty array`);
      assert.ok(Array.isArray(ov.addFeaturesEn) && ov.addFeaturesEn.length > 0,
        `${theme}.addFeaturesEn should be non-empty array`);
    }
  });

  it('addFeatures and addFeaturesEn have matching lengths', () => {
    for (const theme of EXPECTED_THEMES) {
      const ov = THEME_OVERLAYS[theme];
      assert.equal(ov.addFeatures.length, ov.addFeaturesEn.length,
        `${theme} addFeatures/addFeaturesEn length mismatch`);
    }
  });

  it('addScreens and addScreensEn are non-empty arrays with matching lengths', () => {
    for (const theme of EXPECTED_THEMES) {
      const ov = THEME_OVERLAYS[theme];
      assert.ok(Array.isArray(ov.addScreens) && ov.addScreens.length > 0,
        `${theme}.addScreens should be non-empty array`);
      assert.equal(ov.addScreens.length, ov.addScreensEn.length,
        `${theme} addScreens/addScreensEn length mismatch`);
    }
  });

  it('metaOverride is an object', () => {
    for (const theme of EXPECTED_THEMES) {
      assert.equal(typeof THEME_OVERLAYS[theme].metaOverride, 'object',
        `${theme}.metaOverride should be object`);
    }
  });
});
