#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
// Load common.js to get ENTITY_COLUMNS keys
const common=fs.readFileSync('src/generators/common.js','utf8');
const match=common.match(/const ENTITY_COLUMNS=\{([\s\S]*?)\n\};/);
const keys=new Set();
if(match){
  const body=match[1];
  const entityLines=body.match(/^\s+[A-Z][A-Za-z]+:\[/gm)||[];
  entityLines.forEach(function(l){
    const m=l.match(/([A-Z][A-Za-z]+):/);
    if(m)keys.add(m[1]);
  });
}
console.log('Defined entities:', keys.size);
// Load all preset files
const presetFiles=[
  'src/data/presets.js','src/data/presets-ext.js','src/data/presets-ext2.js',
  'src/data/presets-ext3.js','src/data/presets-ext4.js','src/data/presets-ext5.js',
  'src/data/presets-ext6.js','src/data/presets-ext7.js','src/data/presets-ext8.js',
  'src/data/presets-ext9.js','src/data/presets-ext10.js','src/data/presets-ext11.js'
];
const missing=new Map();
presetFiles.forEach(function(f){
  if(!fs.existsSync(f))return;
  const text=fs.readFileSync(f,'utf8');
  const entityMatches=text.match(/entities:\s*['"][^'"]*['"]/g)||[];
  entityMatches.forEach(function(m){
    const val=m.replace(/entities:\s*['"]|['"]/g,'');
    val.split(',').map(function(s){return s.trim();}).filter(Boolean).forEach(function(e){
      if(!keys.has(e)){
        missing.set(e,(missing.get(e)||0)+1);
      }
    });
  });
});
const sorted=[...missing.entries()].sort(function(a,b){return b[1]-a[1];});
console.log('Total missing:', sorted.length);
console.log('Top 60:');
sorted.slice(0,60).forEach(function(entry){
  console.log('  '+entry[0]+' ('+entry[1]+')');
});
