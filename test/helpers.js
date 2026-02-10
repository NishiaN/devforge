/* ═══ Test Helper — Minimal browser shim for DevForge testing ═══ */
const fs = require('fs');
const path = require('path');

function createTestEnv() {
  // Minimal DOM shim
  const store = {};
  global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
  global.document = {
    createElement: () => ({ style: {}, setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} }, addEventListener: () => {} }),
    getElementById: () => null,
    querySelectorAll: () => [],
    querySelector: () => null,
    head: { appendChild: () => {} },
    body: { appendChild: () => {} },
    documentElement: { setAttribute: () => {} },
    addEventListener: () => {},
  };
  global.window = { onerror: null, onunhandledrejection: null, location: { search: '' } };
  global.navigator = { language: 'ja' };
  global.setTimeout = setTimeout;

  // Load and eval source modules in order
  const srcDir = path.join(__dirname, '..', 'src');
  const modules = [
    'core/state.js',
    'data/presets.js',
    'core/i18n.js',
    'data/techdb.js',
    'data/gen-templates.js',
  ];

  let code = '';
  for (const mod of modules) {
    const fp = path.join(srcDir, mod);
    if (fs.existsSync(fp)) {
      code += fs.readFileSync(fp, 'utf-8') + '\n';
    }
  }

  // Eval in this context
  const fn = new Function(code + '\nreturn {S, I18N, REQ_LABELS, PRICE_LABELS, reqLabel, priceLabel, GT, TECH_DB, PRESETS:PR, save, load, _lsGet, _lsSet};');
  return fn();
}

module.exports = { createTestEnv };
