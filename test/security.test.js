const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// Test security enhancements added in security hardening phase
test('Security Enhancements', async (t) => {
  // Read built HTML
  const html = fs.readFileSync('devforge-v9.html', 'utf-8');

  await t.test('CSP meta tag exists', () => {
    assert.ok(html.includes('Content-Security-Policy'), 'CSP meta tag should exist');
    assert.ok(html.includes('default-src'), 'CSP should have default-src directive');
    assert.ok(html.includes('script-src'), 'CSP should have script-src directive');
    assert.ok(html.includes("object-src 'none'"), 'CSP should block object-src');
  });

  await t.test('SRI integrity hashes exist', () => {
    assert.ok(html.includes('integrity="sha384-'), 'Should have SRI integrity hashes');
    assert.ok(html.includes('crossorigin="anonymous"'), 'Should have crossorigin attribute');
    // Check for JSZip SRI
    assert.ok(html.match(/jszip.*integrity/i), 'JSZip should have SRI hash');
    // Check for marked SRI
    assert.ok(html.match(/marked.*integrity/i), 'Marked should have SRI hash');
  });

  await t.test('State injection prevention - allowlist approach exists', () => {
    assert.ok(html.includes('_SAFE_KEYS'), 'Should have _SAFE_KEYS allowlist');
    assert.ok(html.includes("'phase','step','answers'"), 'Allowlist should include core state keys');
    assert.ok(html.includes('hasOwnProperty'), 'Should use hasOwnProperty check');
    // Ensure Object.assign(S, o) is NOT present without allowlist
    const dangerousPattern = /Object\.assign\(S,\s*[a-z]\)/;
    if (dangerousPattern.test(html)) {
      // If found, ensure it's in a comment or not in state loading context
      const matches = html.match(dangerousPattern);
      assert.ok(matches.every(m => {
        const context = html.substring(html.indexOf(m) - 100, html.indexOf(m) + 100);
        return context.includes('//') || context.includes('/*');
      }), 'Object.assign(S, o) should not be used for state loading');
    }
  });

  await t.test('HTML sanitizer function exists', () => {
    assert.ok(html.includes('_sanitizeHTML'), 'Should have _sanitizeHTML function');
    assert.ok(html.includes('allowedTags'), 'Sanitizer should have allowedTags');
    assert.ok(html.includes('allowedAttrs'), 'Sanitizer should have allowedAttrs');
    assert.ok(html.includes('javascript:'), 'Sanitizer should check for javascript: protocol');
  });

  await t.test('URL hash import has prototype pollution protection', () => {
    assert.ok(html.includes('__proto__'), 'Should filter __proto__ in URL hash import');
    assert.ok(html.includes('constructor'), 'Should filter constructor in URL hash import');
    assert.ok(html.includes('prototype'), 'Should filter prototype in URL hash import');
  });

  await t.test('CI/CD generator includes npm audit step', () => {
    // Check that the source code contains npm audit
    const docsJs = fs.readFileSync('src/generators/docs.js', 'utf-8');
    assert.ok(docsJs.includes('npm audit'), 'CI/CD generation code should include npm audit');
    assert.ok(docsJs.includes('--audit-level=high'), 'CI/CD should use audit-level high');
  });

  await t.test('Security doc generator has CSP/CORS/rate limit templates', () => {
    // Check that the generator code includes security examples
    const docsJs = fs.readFileSync('src/generators/docs.js', 'utf-8');
    assert.ok(docsJs.includes('cspExamples'), 'Should have CSP examples variable');
    assert.ok(docsJs.includes('corsExamples'), 'Should have CORS examples variable');
    assert.ok(docsJs.includes('rateLimitExamples'), 'Should have rate limit examples variable');
    assert.ok(docsJs.includes('Content-Security-Policy'), 'Should have CSP header example');
    assert.ok(docsJs.includes('Access-Control-Allow-Origin'), 'Should have CORS header example');
    assert.ok(docsJs.includes('express-rate-limit'), 'Should have rate limiting example');
  });

  await t.test('Generated .env.example has security variables', () => {
    const S = { files: {}, answers: {}, skill: 'intermediate', lang: 'ja', genLang: 'ja' };
    const save = () => {};
    eval(fs.readFileSync('src/generators/p2-devcontainer.js', 'utf-8'));

    const answers = {
      project_name: 'TestProject',
      purpose: 'Test app',
      frontend: 'React + Next.js',
      backend: 'Express + Node.js',
      database: 'PostgreSQL',
      mvp_features: 'Auth, CRUD'
    };

    genPillar2_DevContainer(answers, 'TestProject');

    const envFile = S.files['.env.example'];
    assert.ok(envFile, '.env.example should exist');
    assert.ok(envFile.includes('ALLOWED_ORIGINS'), 'Should have ALLOWED_ORIGINS variable');
    assert.ok(envFile.includes('RATE_LIMIT_MAX'), 'Should have RATE_LIMIT_MAX variable');
    assert.ok(envFile.includes('RATE_LIMIT_WINDOW_MS'), 'Should have RATE_LIMIT_WINDOW_MS variable');
  });

  await t.test('Export functions use escHtml for paths', () => {
    assert.ok(html.includes('escHtml(path)'), 'Export should escape file paths');
    assert.ok(html.includes('escHtml(S.projectName)'), 'Export should escape project name');
  });

  await t.test('Compat-fix buttons use escAttr', () => {
    assert.ok(html.includes('escAttr'), 'Compat-fix buttons should use escAttr function');
    const compatAlertMatch = html.match(/function showCompatAlert/);
    if (compatAlertMatch) {
      const funcStart = html.indexOf(compatAlertMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 2000);
      assert.ok(funcBody.includes('escAttr'), 'showCompatAlert should use escAttr for onclick attributes');
    }
  });

  // Phase 2 security tests
  await t.test('Mermaid uses textContent instead of innerHTML', () => {
    assert.ok(html.includes('_mmBlocks'), 'Should use _mmBlocks placeholder array for Mermaid');
    assert.ok(html.includes('.textContent=c'), 'Should use textContent to inject Mermaid code');
    assert.ok(!html.match(/\.innerHTML.*mermaid.*replace.*&lt;/), 'Should NOT use innerHTML for unescaped Mermaid');
  });

  await t.test('Dashboard project info uses esc()', () => {
    assert.ok(html.includes('esc(v)'), 'Dashboard project info should escape values with esc(v)');
  });

  await t.test('Dashboard compat-fix uses escAttr()', () => {
    assert.ok(html.includes('escAttr(c.fix.f)'), 'Dashboard compat-fix should escape field names');
    assert.ok(html.includes('escAttr(c.fix.s)'), 'Dashboard compat-fix should escape suggested values');
  });

  await t.test('Audit messages use esc()', () => {
    const auditMatch = html.match(/function finishGen/);
    if (auditMatch) {
      const funcStart = html.indexOf(auditMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 3000);
      assert.ok(funcBody.includes('esc(f.msg)'), 'Audit findings should escape messages');
    }
  });

  await t.test('Explorer answers use esc()', () => {
    assert.ok(html.includes('esc(a.frontend'), 'Explorer should escape frontend answer');
    assert.ok(html.includes('esc(a.backend'), 'Explorer should escape backend answer');
  });

  await t.test('prevToolbar uses escAttr for paths', () => {
    const toolbarMatch = html.match(/function prevToolbar/);
    if (toolbarMatch) {
      const funcStart = html.indexOf(toolbarMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 1000);
      assert.ok(funcBody.includes("escAttr(path)"), 'prevToolbar should escape path in onclick attributes');
      assert.ok(funcBody.includes("esc(path)"), 'prevToolbar should escape path in display text');
    }
  });

  await t.test('File tree uses escAttr for paths', () => {
    const treeMatch = html.match(/function buildFileTree|function showFileTree/);
    if (treeMatch) {
      const funcStart = html.indexOf(treeMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 5000);
      assert.ok(funcBody.includes("escAttr(f.path)"), 'File tree should escape file paths in onclick');
      assert.ok(funcBody.includes("esc(f.path)") || funcBody.includes("esc(f.name)"), 'File tree should escape file names in display');
    }
  });

  await t.test('window.open has CSP meta tag', () => {
    assert.ok(html.includes('_CSP_META'), 'Should define _CSP_META constant');
    const printMatch = html.match(/function printCurrentFile|function exportPDF/);
    if (printMatch) {
      const funcStart = html.indexOf(printMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 2000);
      assert.ok(funcBody.includes('_CSP_META') || funcBody.includes('Content-Security-Policy'), 'window.open HTML should include CSP meta');
    }
  });

  await t.test('_jp safe JSON.parse helper exists', () => {
    assert.ok(html.includes('function _jp'), '_jp helper function should exist');
    assert.ok(html.match(/function _jp\([^)]+\)\{if\(s==null\)return d;try\{return JSON\.parse/), '_jp should have null guard and wrap JSON.parse in try-catch');
  });

  await t.test('importProject has proto pollution filter', () => {
    const importMatch = html.match(/function importProject/);
    if (importMatch) {
      const funcStart = html.indexOf(importMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 3000);
      assert.ok(funcBody.includes("'__proto__','constructor','prototype'"), 'importProject should filter dangerous keys');
      assert.ok(funcBody.includes('delete data.state.answers'), 'importProject should delete dangerous answer keys');
      assert.ok(funcBody.includes('delete data.state.files'), 'importProject should delete dangerous file keys');
    }
  });

  await t.test('help.js has href protocol validation', () => {
    const helpMatch = html.match(/function showHelp/);
    if (helpMatch) {
      const funcStart = html.indexOf(helpMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 1500);
      assert.ok(funcBody.includes('safeLink'), 'help.js should create safeLink variable');
      assert.ok(funcBody.includes("startsWith('https://')") || funcBody.includes("startsWith('http://')"), 'help.js should validate URL protocol');
    }
  });

  await t.test('state.js has type validation in load()', () => {
    const loadMatch = html.match(/function load\(/);
    if (loadMatch) {
      const funcStart = html.indexOf(loadMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 2000);
      assert.ok(funcBody.includes("typeof o.phase==='number'"), 'load() should validate phase type');
      assert.ok(funcBody.includes("typeof o.answers==='object'"), 'load() should validate answers type');
      assert.ok(funcBody.includes("!Array.isArray(o.answers)"), 'load() should reject array for answers');
      assert.ok(funcBody.includes("!Array.isArray(o.files)"), 'load() should reject array for files');
    }
  });

  await t.test('escAttr is globally defined in state.js', () => {
    assert.ok(html.includes('function escAttr'), 'escAttr should be globally defined');
    // Ensure it's near other global functions like esc, sanitize
    const escMatch = html.match(/function esc\(/);
    if (escMatch) {
      const funcStart = html.indexOf(escMatch[0]);
      const nearbyCode = html.substring(funcStart, funcStart + 500);
      assert.ok(nearbyCode.includes('escAttr'), 'escAttr should be near esc() in state.js section');
    }
  });

  await t.test('showCompatAlert uses esc for messages', () => {
    const alertMatch = html.match(/function showCompatAlert/);
    if (alertMatch) {
      const funcStart = html.indexOf(alertMatch[0]);
      const funcBody = html.substring(funcStart, funcStart + 2000);
      assert.ok(funcBody.includes('esc(iss.msg)'), 'showCompatAlert should escape issue messages');
    }
  });

  // ═══ Phase 4: .claude/settings.json Security Tests ═══
  await t.test('.claude/settings.json does not expose sensitive data', () => {
    // Initialize test environment
    const S = {answers:{},skill:'intermediate',lang:'ja',preset:'custom',projectName:'T',phase:1,step:0,skipped:[],files:{},editedFiles:{},prevFiles:{},genLang:'en',previewFile:null,pillar:0};
    eval(fs.readFileSync('src/data/presets.js','utf-8').replace('const PR','var PR'));
    eval(fs.readFileSync('src/generators/common.js','utf-8').replace(/const /g,'var '));
    eval(fs.readFileSync('src/generators/p4-airules.js','utf-8'));

    genPillar4_AIRules({
      purpose: 'Test app',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestApp');

    const settings = JSON.parse(S.files['.claude/settings.json']);

    // Should not contain any actual secrets
    const str = JSON.stringify(settings);
    assert.ok(!str.includes('sk-'), 'Should not contain API keys');
    assert.ok(!str.includes('password'), 'Should not contain passwords');
    assert.ok(!str.match(/secret[^s]/i), 'Should not contain secret values (except "secrets" as word)');
    assert.ok(!str.includes('token'), 'Should not contain token values');

    // Should only contain configuration
    assert.ok(settings.permissions, 'Should have permissions config');
    assert.ok(settings.context, 'Should have context config');
    assert.ok(settings.rules, 'Should have rules config');
  });

  await t.test('.claude/settings.json dangerous commands are comprehensive', () => {
    // Initialize test environment
    const S = {answers:{},skill:'intermediate',lang:'ja',preset:'custom',projectName:'T',phase:1,step:0,skipped:[],files:{},editedFiles:{},prevFiles:{},genLang:'en',previewFile:null,pillar:0};
    eval(fs.readFileSync('src/data/presets.js','utf-8').replace('const PR','var PR'));
    eval(fs.readFileSync('src/generators/common.js','utf-8').replace(/const /g,'var '));
    eval(fs.readFileSync('src/generators/p4-airules.js','utf-8'));

    genPillar4_AIRules({
      purpose: 'Test',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL'
    }, 'Test');

    const settings = JSON.parse(S.files['.claude/settings.json']);
    const dangerousCmds = settings.permissions.dangerousCommands.requireConfirmation;

    // Should require confirmation for destructive operations
    assert.ok(dangerousCmds.includes('rm -rf'), 'Should protect against rm -rf');
    assert.ok(dangerousCmds.includes('git push --force'), 'Should protect against force push');
    assert.ok(dangerousCmds.includes('git reset --hard'), 'Should protect against hard reset');
    assert.ok(dangerousCmds.includes('DROP TABLE'), 'Should protect against DROP TABLE');
    assert.ok(dangerousCmds.includes('DELETE FROM'), 'Should protect against DELETE FROM');
  });
});
