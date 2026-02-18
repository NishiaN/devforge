// utils.test.js — Unit tests for state and common utility functions
// Tests: sanitizeName, fileSlug, sanitize, _jp, escAttr, pluralize, isNone, hasDM, isQActive logic
// ~23 tests

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// ── Minimal DOM shim ──
// esc() uses createElement + textContent → innerHTML; simulate browser HTML escaping
const _mkEl = () => {
  let _text = '';
  return {
    get textContent() { return _text; },
    set textContent(v) { _text = String(v); },
    get innerHTML() {
      return _text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    style: {},
    setAttribute: () => {},
    appendChild: () => {},
    classList: { add: () => {}, remove: () => {} },
  };
};

const store = {};
global.localStorage = {
  getItem: (k) => store[k] || null,
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};
global.document = {
  createElement: () => _mkEl(),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: { appendChild: () => {} },
  head: { appendChild: () => {} },
  documentElement: { setAttribute: () => {} },
  addEventListener: () => {},
};
global.window = { onerror: null, onunhandledrejection: null, location: { search: '' } };
global.navigator = { language: 'ja' };
global.setTimeout = setTimeout;

// ── Load modules via new Function() so that S and its closures share the same scope ──
// (eval with `let` creates block-scoped vars inaccessible outside; new Function avoids this)
const stateCode = fs.readFileSync('src/core/state.js', 'utf-8');
const commonCode = fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var ');
const env = new Function(
  stateCode + '\n' + commonCode +
  '\nreturn {S, sanitize, sanitizeName, fileSlug, _jp, escAttr, esc, hasDM, pluralize, isNone};'
)();
const { S, sanitize, sanitizeName, fileSlug, _jp, escAttr, esc, hasDM, pluralize, isNone } = env;

// ══════════════════════════════════════════════
// sanitizeName()
// ══════════════════════════════════════════════
describe('sanitizeName()', () => {
  test('strips < > " \' & / \\ characters', () => {
    // All dangerous chars removed
    assert.equal(sanitizeName('<script>'), 'script');
    assert.equal(sanitizeName('"quoted"'), 'quoted');
    assert.equal(sanitizeName("it's"), 'its');
    assert.equal(sanitizeName('a&b'), 'ab');
  });

  test('strips path traversal characters', () => {
    assert.equal(sanitizeName('path/to\\file'), 'pathtofile');
  });

  test('limits to 100 characters', () => {
    const long = 'a'.repeat(200);
    assert.equal(sanitizeName(long).length, 100);
  });

  test('returns empty string for empty input', () => {
    assert.equal(sanitizeName(''), '');
  });

  test('returns empty string for null/undefined/non-string', () => {
    assert.equal(sanitizeName(null), '');
    assert.equal(sanitizeName(undefined), '');
    assert.equal(sanitizeName(123), '');
  });

  test('preserves safe characters (letters, numbers, spaces, hyphens)', () => {
    assert.equal(sanitizeName('My Project 123'), 'My Project 123');
    assert.equal(sanitizeName('alpha-beta_gamma'), 'alpha-beta_gamma');
  });
});

// ══════════════════════════════════════════════
// fileSlug()
// ══════════════════════════════════════════════
describe('fileSlug()', () => {
  test('converts spaces to hyphens', () => {
    assert.equal(fileSlug('My Project'), 'My-Project');
  });

  test('collapses multiple spaces or underscores to single hyphen', () => {
    assert.equal(fileSlug('My  Project'), 'My-Project');
    assert.equal(fileSlug('my_project'), 'my-project');
    assert.equal(fileSlug('my__project'), 'my-project');
  });

  test('removes non-alphanumeric characters (except hyphen)', () => {
    assert.equal(fileSlug('my<>project!@#'), 'myproject');
  });

  test('trims leading and trailing hyphens', () => {
    assert.equal(fileSlug('-my-project-'), 'my-project');
  });

  test('falls back to devforge-project for empty or all-symbol input', () => {
    assert.equal(fileSlug(''), 'devforge-project');
    assert.equal(fileSlug(null), 'devforge-project');
    assert.equal(fileSlug('!!!'), 'devforge-project');
  });

  test('limits output to 80 characters', () => {
    const long = 'a'.repeat(200);
    assert.ok(fileSlug(long).length <= 80);
  });

  test('produces consistent slug for typical project names', () => {
    assert.equal(fileSlug('LMS App'), 'LMS-App');
    assert.equal(fileSlug('my-app'), 'my-app');
  });
});

// ══════════════════════════════════════════════
// sanitize()
// ══════════════════════════════════════════════
describe('sanitize()', () => {
  test('strips HTML tags', () => {
    assert.equal(sanitize('<b>bold</b>'), 'bold');
    assert.equal(sanitize('<script>alert(1)</script>'), 'alert(1)');
    assert.equal(sanitize('<img src=x onerror=alert(1)>'), '');
  });

  test('limits to default max length of 500', () => {
    const long = 'a'.repeat(600);
    assert.equal(sanitize(long).length, 500);
  });

  test('respects custom max length', () => {
    const long = 'a'.repeat(200);
    assert.equal(sanitize(long, 50).length, 50);
  });

  test('returns empty string for null/undefined/non-string', () => {
    assert.equal(sanitize(null), '');
    assert.equal(sanitize(undefined), '');
    assert.equal(sanitize(123), '');
  });

  test('returns trimmed content', () => {
    assert.equal(sanitize('  hello  '), 'hello');
  });
});

// ══════════════════════════════════════════════
// _jp() — safe JSON.parse with fallback
// ══════════════════════════════════════════════
describe('_jp()', () => {
  test('parses valid JSON object', () => {
    assert.deepEqual(_jp('{"a":1}', {}), { a: 1 });
  });

  test('parses valid JSON array', () => {
    assert.deepEqual(_jp('[1,2,3]', []), [1, 2, 3]);
  });

  test('returns default for invalid JSON', () => {
    assert.deepEqual(_jp('not json', {}), {});
    assert.equal(_jp('{broken', 42), 42);
  });

  test('returns default for null input', () => {
    assert.equal(_jp(null, 42), 42);
  });

  test('returns default for undefined input', () => {
    assert.equal(_jp(undefined, 'fallback'), 'fallback');
  });
});

// ══════════════════════════════════════════════
// escAttr() — HTML attribute escaping
// ══════════════════════════════════════════════
describe('escAttr()', () => {
  test('escapes double quotes to &quot;', () => {
    assert.ok(escAttr('"value"').includes('&quot;'));
  });

  test('escapes single quotes with backslash', () => {
    assert.ok(escAttr("it's").includes("\\'"));
  });

  test('escapes backslash', () => {
    assert.ok(escAttr('a\\b').includes('\\\\'));
  });

  test('handles non-string input (coerces to string)', () => {
    assert.equal(typeof escAttr(123), 'string');
    assert.equal(typeof escAttr(null), 'string');
  });
});

// ══════════════════════════════════════════════
// pluralize() — smart table name pluralization
// ══════════════════════════════════════════════
describe('pluralize()', () => {
  test('regular nouns get -s suffix', () => {
    assert.equal(pluralize('User'), 'users');
    assert.equal(pluralize('Post'), 'posts');
    assert.equal(pluralize('Tag'), 'tags');
    assert.equal(pluralize('Comment'), 'comments');
  });

  test('irregular nouns use correct plural form', () => {
    assert.equal(pluralize('Person'), 'people');
    assert.equal(pluralize('Child'), 'children');
    assert.equal(pluralize('Quiz'), 'quizzes');
    assert.equal(pluralize('Status'), 'statuses');
    assert.equal(pluralize('Category'), 'categories');
    assert.equal(pluralize('Entry'), 'entries');
  });

  test('uncountable nouns remain unchanged', () => {
    assert.equal(pluralize('Progress'), 'progress');
    assert.equal(pluralize('Data'), 'data');
    assert.equal(pluralize('Settings'), 'settings');
    assert.equal(pluralize('Feedback'), 'feedback');
    assert.equal(pluralize('Media'), 'media');
  });

  test('nouns ending in s/x/ch/sh get -es suffix', () => {
    assert.equal(pluralize('Box'), 'boxes');
    assert.equal(pluralize('Match'), 'matches');
    assert.equal(pluralize('Flash'), 'flashes');
  });

  test('nouns ending in consonant+y get -ies suffix', () => {
    assert.equal(pluralize('Story'), 'stories');
    assert.equal(pluralize('Reply'), 'replies');
  });
});

// ══════════════════════════════════════════════
// isNone() — "none" check in any language
// ══════════════════════════════════════════════
describe('isNone()', () => {
  test('returns true for falsy values', () => {
    assert.equal(isNone(''), true);
    assert.equal(isNone(null), true);
    assert.equal(isNone(undefined), true);
  });

  test('returns true for none/None/なし strings', () => {
    assert.equal(isNone('none'), true);
    assert.equal(isNone('None'), true);
    assert.equal(isNone('なし'), true);
  });

  test('returns false for any other value', () => {
    assert.equal(isNone('Supabase'), false);
    assert.equal(isNone('Express'), false);
    assert.equal(isNone('あり'), false);
    assert.equal(isNone('firebase'), false);
  });
});

// ══════════════════════════════════════════════
// hasDM() — dev_methods includes check
// ══════════════════════════════════════════════
describe('hasDM()', () => {
  test('returns true when dev_methods includes the method', () => {
    S.answers = { dev_methods: 'TDD, BDD, ペアプログラミング' };
    assert.equal(hasDM('TDD'), true);
    assert.equal(hasDM('BDD'), true);
  });

  test('returns false when dev_methods does not include the method', () => {
    S.answers = { dev_methods: 'TDD' };
    assert.equal(hasDM('BDD'), false);
    assert.equal(hasDM('マルチAgent協調'), false);
  });

  test('returns false when dev_methods is missing or empty', () => {
    S.answers = {};
    assert.equal(hasDM('TDD'), false);
    S.answers = { dev_methods: '' };
    assert.equal(hasDM('TDD'), false);
  });
});

// ══════════════════════════════════════════════
// isQActive() logic — condition-based question visibility
// ══════════════════════════════════════════════
describe('isQActive() condition logic', () => {
  // Inline the pure logic (extracted from wizard.js for unit testability)
  function isQActiveLocal(q, answers) {
    if (!q.condition) return true;
    const [k, fn] = Object.entries(q.condition)[0];
    return fn(answers[k] || '');
  }

  test('returns true when question has no condition', () => {
    assert.equal(isQActiveLocal({ id: 'q1' }, {}), true);
    assert.equal(isQActiveLocal({ id: 'q2', q: 'Frontend?' }, { frontend: 'React' }), true);
  });

  test('dev_env_type shown only for BaaS backends', () => {
    // condition: {backend: v => /Supabase|Firebase|Convex/i.test(v)}
    const q = { id: 'dev_env_type', condition: { backend: v => /Supabase|Firebase|Convex/i.test(v) } };
    assert.equal(isQActiveLocal(q, { backend: 'Supabase' }), true);
    assert.equal(isQActiveLocal(q, { backend: 'Firebase Firestore' }), true);
    assert.equal(isQActiveLocal(q, { backend: 'Express' }), false);
    assert.equal(isQActiveLocal(q, { backend: '' }), false);
  });

  test('ORM question hidden for Firebase/Supabase backends', () => {
    // condition: {backend: v => !/Firebase|Supabase|Convex|なし|None|static/i.test(v)}
    const q = { id: 'orm', condition: { backend: v => !/Firebase|Supabase|Convex|なし|None|static/i.test(v) } };
    assert.equal(isQActiveLocal(q, { backend: 'Express' }), true);
    assert.equal(isQActiveLocal(q, { backend: 'Supabase' }), false);
    assert.equal(isQActiveLocal(q, { backend: 'Firebase Firestore' }), false);
    assert.equal(isQActiveLocal(q, { backend: 'None' }), false);
  });

  test('auth question hidden when backend is static/None', () => {
    // condition: {backend: v => !/なし|None|static/i.test(v)}
    const q = { id: 'auth', condition: { backend: v => !/なし|None|static/i.test(v) } };
    assert.equal(isQActiveLocal(q, { backend: 'Supabase' }), true);
    assert.equal(isQActiveLocal(q, { backend: 'Express' }), true);
    assert.equal(isQActiveLocal(q, { backend: 'None' }), false);
    assert.equal(isQActiveLocal(q, { backend: 'なし（静的サイト）' }), false);
  });

  test('returns false when answer is missing and condition requires a match', () => {
    const q = { id: 'q1', condition: { frontend: v => v.includes('React') } };
    // Empty string passed when answer is undefined → condition returns false
    assert.equal(isQActiveLocal(q, {}), false);
  });
});
