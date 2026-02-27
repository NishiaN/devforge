const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTestEnv } = require('./helpers');

describe('State Management', () => {
  it('initializes with default state', () => {
    const env = createTestEnv();
    assert.ok(env.S, 'S should exist');
    assert.equal(env.S._v, 9, 'Version should be 9');
    assert.equal(typeof env.S.files, 'object');
    assert.equal(typeof env.S.answers, 'object');
  });

  it('has editedFiles and prevFiles fields', () => {
    const env = createTestEnv();
    assert.equal(typeof env.S.editedFiles, 'object');
    assert.equal(typeof env.S.prevFiles, 'object');
  });

  it('has genLang field', () => {
    const env = createTestEnv();
    assert.ok('genLang' in env.S, 'genLang should exist in state');
  });

  it('saves and loads state via localStorage', () => {
    const env = createTestEnv();
    env.S.projectName = 'TestProject';
    env.save();
    const stored = localStorage.getItem('devforge-v9');
    assert.ok(stored, 'State should be saved to localStorage');
    const parsed = JSON.parse(stored);
    assert.equal(parsed.projectName, 'TestProject');
  });

  it('preserves data through save/load cycle', () => {
    localStorage.clear();
    const env = createTestEnv();
    env.S.projectName = 'CycleTest';
    env.S.answers = { frontend: 'React + Next.js', backend: 'Express' };
    env.save();
    env.S.projectName = '';
    env.S.answers = {};
    env.load();
    assert.equal(env.S.projectName, 'CycleTest');
    assert.equal(env.S.answers.frontend, 'React + Next.js');
  });

  it('has correct default values for skill fields', () => {
    const env = createTestEnv();
    assert.equal(env.S.skillLv, 3, 'skillLv default should be 3');
    assert.equal(env.S.skill, 'intermediate', 'skill default should be intermediate');
    assert.equal(env.S.pillar, 0, 'pillar default should be 0');
    assert.equal(env.S.genLang, 'ja', 'genLang default should be ja');
  });

  it('has correct default values for new state fields', () => {
    const env = createTestEnv();
    assert.equal(env.S.exportedOnce, false, 'exportedOnce default should be false');
    assert.ok(Array.isArray(env.S.compatAcked), 'compatAcked should be an array');
    assert.equal(env.S.compatAcked.length, 0, 'compatAcked should start empty');
    assert.ok(Array.isArray(env.S.pinnedFiles), 'pinnedFiles should be an array');
    assert.equal(env.S.pinnedFiles.length, 0, 'pinnedFiles should start empty');
    assert.ok(Array.isArray(env.S.recentFiles), 'recentFiles should be an array');
    assert.equal(env.S.recentFiles.length, 0, 'recentFiles should start empty');
  });

  it('skillTier maps levels 0-6 correctly', () => {
    const env = createTestEnv();
    const { skillTier } = env;
    assert.equal(skillTier(0), 'beginner');
    assert.equal(skillTier(1), 'beginner');
    assert.equal(skillTier(2), 'intermediate');
    assert.equal(skillTier(3), 'intermediate');
    assert.equal(skillTier(4), 'pro');
    assert.equal(skillTier(5), 'pro');
    assert.equal(skillTier(6), 'pro');
  });

  it('load() restores new state fields', () => {
    localStorage.clear();
    const env = createTestEnv();
    env.S.skillLv = 5;
    env.S.exportedOnce = true;
    env.S.compatAcked = ['rule-1', 'rule-2'];
    env.S.pinnedFiles = ['src/index.ts'];
    env.S.recentFiles = ['src/app.ts', 'src/utils.ts'];
    env.S.pillar = 4;
    env.S.genLang = 'en';
    env.save();
    // reset to defaults
    env.S.skillLv = 3;
    env.S.exportedOnce = false;
    env.S.compatAcked = [];
    env.S.pinnedFiles = [];
    env.S.recentFiles = [];
    env.S.pillar = 0;
    env.S.genLang = 'ja';
    env.load();
    assert.equal(env.S.skillLv, 5, 'skillLv should be restored');
    assert.equal(env.S.exportedOnce, true, 'exportedOnce should be restored');
    assert.deepEqual(env.S.compatAcked, ['rule-1', 'rule-2'], 'compatAcked should be restored');
    assert.deepEqual(env.S.pinnedFiles, ['src/index.ts'], 'pinnedFiles should be restored');
    assert.deepEqual(env.S.recentFiles, ['src/app.ts', 'src/utils.ts'], 'recentFiles should be restored');
    assert.equal(env.S.pillar, 4, 'pillar should be restored');
    assert.equal(env.S.genLang, 'en', 'genLang should be restored');
  });
});
