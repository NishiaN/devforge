#!/usr/bin/env node
// build.js — DevForge v9 builder
// Usage: node build.js [--no-minify] [--check-css] [--report]

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const NO_MINIFY = args.includes('--no-minify');
const CHECK_CSS = args.includes('--check-css');
const REPORT = args.includes('--report');

const SRC = path.join(__dirname, 'src');

// CSS files (order matters for cascading)
const cssFiles = [
  'styles/all.css',
];

// JS modules (order matters for dependencies)
const jsFiles = [
  // Core (state, utils, i18n)
  'core/state.js',
  'core/i18n.js',

  // Data (presets, questions, techdb)
  'data/presets.js',
  'data/questions.js',
  'data/techdb.js',
  'data/helpdata.js',
  'data/compat-rules.js',
  'data/resources.js',
  'data/gen-templates.js',

  // UI (wizard flow)
  'ui/wizard.js',
  'ui/render.js',
  'ui/edit.js',
  'ui/help.js',
  'ui/guide.js',
  'ui/confirm.js',
  'ui/complexity.js',
  'ui/toc.js',
  'ui/voice.js',
  'ui/project.js',
  'ui/presets.js',
  'ui/preview.js',

  // Generators (file generation engine)
  'generators/index.js',
  'generators/p1-sdd.js',
  'generators/p2-devcontainer.js',
  'generators/p3-mcp.js',
  'generators/p4-airules.js',
  'generators/p5-quality.js',
  'generators/p7-roadmap.js',
  'generators/p9-designsystem.js',
  'generators/p10-reverse.js',
  'generators/docs.js',
  'generators/common.js',

  // UI (export, dashboard, etc.)
  'ui/editor.js',
  'ui/diff.js',
  'ui/export.js',
  'ui/explorer.js',
  'ui/launcher.js',
  'ui/dashboard.js',
  'ui/templates.js',

  // Core (events, tour, init — must be last)
  'core/events.js',
  'core/tour.js',
  'core/init.js',
];

function readFile(relPath) {
  const fullPath = path.join(SRC, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing: ${relPath}`);
    process.exit(1);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

// Read HTML shell
let html = readFile('index.html');

// Concatenate CSS
const css = cssFiles.map(f => {
  const content = readFile(f);
  return `/* === ${f} === */\n${content}`;
}).join('\n\n');

// Concatenate JS
const js = jsFiles.map(f => {
  const content = readFile(f);
  return `/* === ${f} === */\n${content}`;
}).join('\n\n');

// Lightweight minification (no dependencies)
function minCSS(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, '')   // Remove comments
    .replace(/\s*([{}:;,>~+])\s*/g, '$1') // Remove spaces around selectors
    .replace(/;\}/g, '}')                // Remove last semicolons
    .replace(/\s+/g, ' ')               // Collapse whitespace
    .trim();
}
function minJS(s) {
  return s
    .replace(/\/\* ===.*?=== \*\/\n?/g, '') // Remove module headers
    .replace(/\/\*[\s\S]*?\*\//g, '')        // Remove block comments
    .replace(/\n\s*\/\/.*/g, '')             // Remove line comments (start of line only)
    .replace(/\n{2,}/g, '\n')               // Collapse blank lines
    .trim();
}

// Replace placeholders (with optional minification)
html = html.replace('/* __CSS__ */', () => NO_MINIFY ? css : minCSS(css));
html = html.replace('/* __JS__ */', () => NO_MINIFY ? js : minJS(js));

// Write output
const outPath = path.join(__dirname, 'devforge-v9.html');
fs.writeFileSync(outPath, html);

const sizeKB = (Buffer.byteLength(html) / 1024).toFixed(0);
const moduleCount = jsFiles.length;
console.log(`✅ Built devforge-v9.html (${sizeKB}KB, ${moduleCount} modules${NO_MINIFY ? ', unminified' : ''})`);

// Verify: check for common issues
const issues = [];
if (html.includes('/* __CSS__ */')) issues.push('CSS placeholder not replaced');
if (html.includes('/* __JS__ */')) issues.push('JS placeholder not replaced');
if (!html.includes('const KEY=')) issues.push('Missing state initialization');
if (!html.includes('function showQ(')) issues.push('Missing showQ function');
if (!html.includes('function genPillar1_SDD(')) issues.push('Missing generator');
// TechDB dynamic count check: no hardcoded count in display elements
const techCountMatches = html.match(/>\d{3}<\/div><div class="lbl" id="statTech/);
if (techCountMatches) issues.push('Hardcoded tech count in stat display — use _TECH_COUNT');
if (!html.includes('_TECH_COUNT=TECH_DB.length')) issues.push('Missing _TECH_COUNT dynamic definition');

if (issues.length) {
  console.error('⚠️  Issues found:');
  issues.forEach(i => console.error(`   - ${i}`));
} else {
  console.log('✅ All checks passed');
}

// Optional: Dead CSS detection
if (CHECK_CSS) {
  const htmlSrc = readFile('index.html');
  // Check dead CSS classes
  const classesInCSS = [...css.matchAll(/\.([a-z][a-z0-9_-]*)\s*[{,: ]/g)].map(m => m[1]);
  const unique = [...new Set(classesInCSS)];
  const dead = unique.filter(cls => !js.includes(cls) && !htmlSrc.includes(cls));
  if (dead.length) {
    console.log(`\n⚠️  ${dead.length} potentially unused CSS classes:`);
    dead.forEach(c => console.log(`   .${c}`));
  } else {
    console.log('✅ No dead CSS classes detected');
  }
  // Check unused CSS variables (defined but never referenced via var())
  const defined = [...css.matchAll(/--([a-z0-9-]+)\s*:/g)].map(m => m[1]);
  const uniqueVars = [...new Set(defined)];
  const deadVars = uniqueVars.filter(v => {
    const varPatterns = [`var(--${v})`, `var(--${v},`];
    return !varPatterns.some(p => css.includes(p) || js.includes(p) || htmlSrc.includes(p));
  });
  if (deadVars.length) {
    console.log(`⚠️  ${deadVars.length} potentially unused CSS variables:`);
    deadVars.forEach(v => console.log(`   --${v}`));
  } else {
    console.log('✅ No unused CSS variables detected');
  }
  // Check duplicate @keyframes
  const kfNames = [...css.matchAll(/@keyframes\s+([a-zA-Z]+)/g)].map(m => m[1]);
  const kfCounts = {};
  kfNames.forEach(n => kfCounts[n] = (kfCounts[n] || 0) + 1);
  const dupKf = Object.entries(kfCounts).filter(([,v]) => v > 1);
  if (dupKf.length) {
    console.log(`⚠️  Duplicate @keyframes:`);
    dupKf.forEach(([n,c]) => console.log(`   ${n}: ${c}x`));
  } else {
    console.log('✅ No duplicate @keyframes');
  }
}

if (REPORT) {
  const zlib = require('zlib');
  const gzSize = zlib.gzipSync(fs.readFileSync(outPath)).length;
  const cssMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const jsMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  const cssLen = cssMatch ? cssMatch[1].length : 0;
  const jsLen = jsMatch ? jsMatch[1].length : 0;
  const htmlLen = html.length - cssLen - jsLen;
  const pct = (n) => (n / html.length * 100).toFixed(1);
  const kb = (n) => (n / 1024).toFixed(1);
  console.log(`\n📊 DevForge v9 Build Report`);
  console.log(`  Total:  ${kb(html.length)}KB (${kb(gzSize)}KB gzip)`);
  console.log(`  CSS:    ${kb(cssLen)}KB (${pct(cssLen)}%)`);
  console.log(`  JS:     ${kb(jsLen)}KB (${pct(jsLen)}%)`);
  console.log(`  HTML:   ${kb(htmlLen)}KB (${pct(htmlLen)}%)`);
  // JS breakdown by directory
  const dirs = {};
  const modSizes = [];
  jsFiles.forEach(f => {
    const content = readFile(f);
    const dir = f.includes('/') ? f.split('/')[0] : 'root';
    dirs[dir] = (dirs[dir] || 0) + content.length;
    modSizes.push({ name: f, size: content.length });
  });
  console.log(`\n  JS breakdown:`);
  Object.entries(dirs).sort((a,b) => b[1] - a[1]).forEach(([d,s]) => {
    console.log(`    ${(d+'/').padEnd(16)} ${kb(s).padStart(6)}KB (${(s/jsLen*100).toFixed(0)}%)`);
  });
  console.log(`\n  Top modules:`);
  modSizes.sort((a,b) => b.size - a.size).slice(0, 8).forEach(m => {
    console.log(`    ${m.name.padEnd(30)} ${kb(m.size).padStart(6)}KB`);
  });
}
