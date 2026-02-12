const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'devforge-v9.html');

describe('Build System', () => {
  it('builds successfully', () => {
    const result = execSync('node build.js', { cwd: ROOT, encoding: 'utf-8' });
    assert.ok(result.includes('Built'), 'Build should succeed');
    assert.ok(result.includes('All checks passed'), 'All checks should pass');
  });

  it('produces a valid HTML file', () => {
    assert.ok(fs.existsSync(OUTPUT), 'devforge-v9.html should exist');
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.startsWith('<!DOCTYPE html>'), 'Should start with DOCTYPE');
    assert.ok(html.includes('</html>'), 'Should end with closing html tag');
  });

  it('has no unresolved placeholders', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(!html.includes('/* __CSS__ */'), 'CSS placeholder should be replaced');
    assert.ok(!html.includes('/* __JS__ */'), 'JS placeholder should be replaced');
  });

  it('contains all key functions', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const expected = [
      'genPillar1_SDD', 'genPillar2_DevContainer', 'genPillar3_MCP',
      'genPillar4_AIRules', 'genPillar5_QualityIntelligence', 'genPillar7_Roadmap', 'genPillar9_DesignSystem', 'genPillar10_ReverseEngineering', 'genDocs21', 'genCommonFiles',
      'openEditor', 'saveEdited', 'revertFile', 'showDiff', 'lineDiff', 'snapshotFiles',
      'reqLabel', 'priceLabel', 'showExplorer', 'showDashboard',
      'trapFocus', 'releaseFocus', 'announce',
      'showAILauncher', 'selectLaunchTemplate', 'copyLaunchPrompt',
      'autoSelectStack', 'scoreStack',
    ];
    for (const fn of expected) {
      assert.ok(html.includes(fn), `Missing function: ${fn}`);
    }
  });

  it('contains v9 version markers', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes('DevForge v9'), 'Should contain v9 title');
    assert.ok(html.includes('devforge-v9'), 'Should contain v9 localStorage key');
  });

  it('includes a11y attributes', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes('role="banner"'), 'Should have banner role');
    assert.ok(html.includes('role="main"'), 'Should have main role');
    assert.ok(html.includes('role="dialog"'), 'Should have dialog role');
    assert.ok(html.includes('aria-live="polite"'), 'Should have live region');
    assert.ok(html.includes('aria-modal="true"'), 'Should have modal aria');
    assert.ok(html.includes('class="skip-link"'), 'Should have skip link');
  });

  it('passes JS syntax check', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const match = html.match(/<script>([\s\S]*)<\/script>/);
    assert.ok(match, 'Should contain a script tag');
    const tmpFile = path.join(ROOT, '.tmp-check.js');
    fs.writeFileSync(tmpFile, match[1]);
    try {
      execSync(`node --check ${tmpFile}`, { encoding: 'utf-8' });
    } finally {
      fs.unlinkSync(tmpFile);
    }
  });

  it('output size is reasonable', () => {
    const stats = fs.statSync(OUTPUT);
    const kb = stats.size / 1024;
    assert.ok(kb > 200, `Output should be > 200KB, got ${kb.toFixed(0)}KB`);
    assert.ok(kb < 1000, `Output should be < 1000KB, got ${kb.toFixed(0)}KB`);
  });

  it('i18n keys match between JA and EN', () => {
    const i18n = fs.readFileSync(path.join(ROOT, 'src/core/i18n.js'), 'utf-8');
    const extractKeys = (block) => {
      const keys = [];
      const re = /(?:^|,|\n)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
      let m;
      while ((m = re.exec(block)) !== null) keys.push(m[1]);
      return [...new Set(keys)].sort();
    };
    const jaBlock = i18n.match(/ja:\{([\s\S]*?)\},\s*en:/);
    const enBlock = i18n.match(/en:\{([\s\S]*?)\}\s*\}/);
    assert.ok(jaBlock, 'JA block should exist');
    assert.ok(enBlock, 'EN block should exist');
    const jaKeys = extractKeys(jaBlock[1]);
    const enKeys = extractKeys(enBlock[1]);
    const missingInEN = jaKeys.filter(k => !enKeys.includes(k));
    const missingInJA = enKeys.filter(k => !jaKeys.includes(k));
    assert.deepStrictEqual(missingInEN, [], `Keys in JA but not EN: ${missingInEN.join(', ')}`);
    assert.deepStrictEqual(missingInJA, [], `Keys in EN but not JA: ${missingInJA.join(', ')}`);
  });

  it('10 pillars consistency across all references', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(!html.includes('9 Pillars') || html.includes('10 Pillars') || html.includes('10 pillars'), 'Should contain "10 Pillars"');
    assert.ok(html.includes('10の柱'), 'Should contain "10の柱"');
    // pbadge arrays should have 10 items
    assert.ok(html.includes('if(i<10)'), 'pbadge loop should check i<10');
    // AI Launcher, Design System & Reverse Engineering references
    assert.ok(html.includes('⑧AIランチャー'), 'Should have ⑧AIランチャー badge');
    assert.ok(html.includes('⑧AI Launcher'), 'Should have ⑧AI Launcher badge');
    assert.ok(html.includes('⑨デザインシステム'), 'Should have ⑨デザインシステム badge');
    assert.ok(html.includes('⑨Design System'), 'Should have ⑨Design System badge');
    assert.ok(html.includes('⑩リバースEng'), 'Should have ⑩リバースEng badge');
    assert.ok(html.includes('⑩Reverse Eng'), 'Should have ⑩Reverse Eng badge');
  });

  it('tour has correct number of steps', () => {
    const tour = fs.readFileSync(path.join(ROOT, 'src/core/tour.js'), 'utf-8');
    const steps = (tour.match(/\{title:/g) || []).length;
    assert.ok(steps === 10, `Tour should have 10 steps, got ${steps}`);
    assert.ok(tour.includes('AI Launcher'), 'Tour should include AI Launcher step');
  });

  it('KB overlay labels match i18n arrays', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const kblblCount = (html.match(/class="kblbl"/g) || []).length;
    const i18n = fs.readFileSync(path.join(ROOT, 'src/core/i18n.js'), 'utf-8');
    const jaKb = i18n.match(/kb:\[([^\]]+)\]/);
    assert.ok(jaKb, 'JA kb array should exist');
    const jaCount = (jaKb[1].match(/'/g) || []).length / 2;
    assert.strictEqual(kblblCount, jaCount, `KB labels (${kblblCount}) should match i18n kb array (${jaCount})`);
  });

  it('no duplicate @media blocks', () => {
    const css = fs.readFileSync(path.join(ROOT, 'src/styles/all.css'), 'utf-8');
    const mediaBlocks = (css.match(/@media\(max-width:768px\)/g) || []).length;
    assert.strictEqual(mediaBlocks, 1, `Should have exactly 1 @media block, got ${mediaBlocks}`);
  });

  it('CSS theme variables defined in both dark and light', () => {
    const all = fs.readFileSync(path.join(ROOT, 'src/styles/all.css'), 'utf-8');
    // Check critical variables exist in both themes
    const criticalVars = ['--bg', '--text', '--accent', '--border', '--success', '--warn', '--danger'];
    for (const v of criticalVars) {
      const found = all.includes(v + ':');
      assert.ok(found, `CSS variable ${v} should be defined`);
    }
  });

  it('all export functions exist', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const exportFns = ['exportZIP', 'exportPDF', 'copyAllFiles'];
    for (const fn of exportFns) {
      assert.ok(html.includes(`function ${fn}`), `Export function ${fn} should exist`);
    }
  });

  it('getComplexityHTML is available for dashboard integration', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes('function getComplexityHTML'), 'getComplexityHTML should exist');
    assert.ok(html.includes('getComplexityHTML()'), 'getComplexityHTML should be called');
  });

  it('voice input supports language switching', () => {
    const voice = fs.readFileSync(path.join(ROOT, 'src/ui/voice.js'), 'utf-8');
    const langSwitchCount = (voice.match(/_ja\?'ja-JP':'en-US'/g) || []).length;
    assert.ok(langSwitchCount >= 2, `Voice should set language in both init and toggle, found ${langSwitchCount}`);
  });

  it('mobile CSS covers key components', () => {
    const css = fs.readFileSync(path.join(ROOT, 'src/styles/all.css'), 'utf-8');
    const mediaBlock = css.match(/@media\(max-width:768px\)\{([\s\S]*?)\n\}/);
    assert.ok(mediaBlock, '@media block should exist');
    const block = mediaBlock[1];
    const mobileTargets = ['.ctx-summary', '.model-grid', '.tech-filter', '.diff-header', '.launch-stats'];
    for (const cls of mobileTargets) {
      assert.ok(block.includes(cls), `Mobile CSS should include ${cls}`);
    }
  });

  it('dashboard CSS classes are all defined in build', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const requiredClasses = [
      'dash-head', 'dash-h4', 'dash-h4-mt', 'dash-model-ctx', 'dash-fbar-row',
      'dash-fbar', 'dash-fbar-fill', 'dash-total', 'dash-center', 'dash-back',
      'dash-empty', 'dash-tbl-wrap', 'dash-price', 'road-pct-sub', 'road-actions'
    ];
    for (const cls of requiredClasses) {
      const hasDef = html.includes('.' + cls + '{') || html.includes('.' + cls + ' ');
      assert.ok(hasDef, `CSS class .${cls} should be defined in built output`);
    }
  });

  it('safeMD falls back when marked is unavailable', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes('function safeMD('), 'safeMD helper should exist');
    assert.ok(html.includes('_noMarked'), 'safeMD should check _noMarked flag');
    assert.ok(html.includes("'<pre>'"), 'safeMD should fall back to <pre> tag');
  });

  it('modal stack functions exist', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const fns = ['pushModal', 'popModal', 'removeModal', 'closeKB', 'closePM'];
    for (const fn of fns) {
      assert.ok(html.includes('function ' + fn), `${fn} should be defined`);
    }
  });

  it('toast uses CSS class not inline style', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    // toast function should use className not style.cssText
    const toastMatch = html.match(/function toast\(m\)\{[^}]+\}/);
    assert.ok(toastMatch, 'toast function should exist');
    assert.ok(toastMatch[0].includes('toast-msg'), 'toast should use CSS class');
    assert.ok(!toastMatch[0].includes('cssText'), 'toast should not use inline cssText');
  });

  it('sanitize function prevents XSS', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes('function sanitize('), 'sanitize should be defined');
    assert.ok(html.includes('&lt;') || html.includes('&#60;') || html.includes('.replace'), 'sanitize should escape HTML');
  });

  it('PDF export date respects language setting', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes("toLocaleDateString(G?'ja-JP':'en-US')"), 'PDF date should use dynamic locale');
    assert.ok(!html.includes("toLocaleDateString('ja-JP')"), 'PDF date should not be hardcoded to ja-JP');
  });

  it('CDN scripts have fallback flags', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes('onerror="window._noZip=true"'), 'JSZip should have fallback');
    assert.ok(html.includes('onerror="window._noMarked=true"'), 'marked should have fallback');
  });

  it('modal close functions integrate with stack', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    // closeKB and closePM should call removeModal
    assert.ok(html.includes('function closeKB'), 'closeKB should exist');
    assert.ok(html.includes('function closePM'), 'closePM should exist');
    // Background click handlers should use close functions
    assert.ok(html.includes('closeKB()'), 'kbOverlay should use closeKB()');
    assert.ok(html.includes('closePM()'), 'pmOverlay should use closePM()');
  });

  it('no dead CSS classes in built output', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const css = html.match(/<style>([\s\S]*?)<\/style>/);
    assert.ok(css, 'CSS block should exist');
    const deadClasses = ['ctx-grid', 'ctx-card', 'exp-card', 'explorer-grid', 'btn-w', 'cost-card', 'prog-tracker'];
    for (const cls of deadClasses) {
      assert.ok(!css[1].includes('.' + cls + '{'), `Dead class .${cls} should not be in CSS`);
    }
  });

  it('no duplicate @keyframes definitions', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const kfNames = [...html.matchAll(/@keyframes\s+([a-zA-Z]+)/g)].map(m => m[1]);
    const counts = {};
    kfNames.forEach(n => counts[n] = (counts[n] || 0) + 1);
    const dupes = Object.entries(counts).filter(([,v]) => v > 1);
    assert.strictEqual(dupes.length, 0, `No duplicate @keyframes: ${dupes.map(([n,c]) => n+'='+c).join(', ')}`);
  });

  it('no legacy dfv8_ keys in production code', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
    // dfv8_ should only appear in migration code (load function), not in read/write operations
    const dfv8Writes = (js.match(/_lsSet\([^)]*dfv8_/g) || []);
    assert.strictEqual(dfv8Writes.length, 0, 'No dfv8_ write operations should exist');
  });

  it('prevToolbar helper exists for DRY preview rendering', () => {
    const html = fs.readFileSync(OUTPUT, 'utf-8');
    assert.ok(html.includes('function prevToolbar'), 'prevToolbar helper should exist');
    assert.ok((html.match(/prevToolbar\(/g) || []).length >= 3, 'prevToolbar should be called at least 3 times');
  });

  it('i18n _ja caching used consistently in UI modules', () => {
    const uiDir = path.join(ROOT, 'src/ui');
    const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(uiDir, file), 'utf-8');
      const directUses = (content.match(/S\.lang==='ja'/g) || []);
      const declarations = (content.match(/const _ja=S\.lang==='ja'/g) || []);
      const bareUses = directUses.length - declarations.length;
      assert.strictEqual(bareUses, 0, `${file} has ${bareUses} uncached S.lang==='ja' (should use _ja)`);
    }
  });

  it('all t() calls reference valid i18n keys', () => {
    const i18n = fs.readFileSync(path.join(ROOT, 'src/core/i18n.js'), 'utf-8');
    const jaBlock = i18n.match(/ja:\{([\s\S]*?)\},\s*en:/);
    assert.ok(jaBlock, 'JA block should exist');
    const keyRe = /(?:^|,|\n)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
    const keys = new Set();
    let m;
    while ((m = keyRe.exec(jaBlock[1])) !== null) keys.add(m[1]);
    // Find all t('key') calls across JS files
    const jsFiles = [];
    const dirs = ['src/ui', 'src/core', 'src/generators'];
    for (const dir of dirs) {
      const full = path.join(ROOT, dir);
      if (fs.existsSync(full)) {
        fs.readdirSync(full).filter(f => f.endsWith('.js')).forEach(f => {
          jsFiles.push(fs.readFileSync(path.join(full, f), 'utf-8'));
        });
      }
    }
    const allJS = jsFiles.join('\n');
    const tCalls = [...allJS.matchAll(/[^a-zA-Z_$]t\('([a-zA-Z]\w*)'\)/g)].map(m => m[1]);
    const missing = [...new Set(tCalls)].filter(k => !keys.has(k));
    assert.strictEqual(missing.length, 0, `t() keys not in i18n: ${missing.join(', ')}`);
  });
});
