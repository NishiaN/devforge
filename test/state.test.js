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
});
