/**
 * DevForge v9 Test Harness
 * Loads source modules into a vm context for testing
 * Note: const/let in vm.runInContext don't attach to sandbox,
 * so we convert them to var for key declarations.
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const mockDocument = {
  createElement() {
    return {
      style:{cssText:''},textContent:'',innerHTML:'',className:'',
      classList:{add(){},remove(){},toggle(){}},
      appendChild(){},remove(){},setAttribute(){},getAttribute(){return null;},
      querySelectorAll(){return[];},querySelector(){return null;},
      contains(){return false;},addEventListener(){},
    };
  },
  getElementById(){return null;},
  addEventListener(){},
  querySelectorAll(){return[];},
  body:{appendChild(){}},
};

const sandbox = {
  document:mockDocument,
  window:{innerHeight:800,innerWidth:1200},
  navigator:{userAgent:'node-test'},
  localStorage:{
    _data:{},
    getItem(k){return this._data[k]??null;},
    setItem(k,v){this._data[k]=String(v);},
    removeItem(k){delete this._data[k];},
  },
  setTimeout:(fn)=>fn(),
  console,JSON,Object,Array,Math,String,Number,
  parseInt,parseFloat,RegExp,Date,Error,Map,Set,Promise,
  encodeURIComponent,decodeURIComponent,
  Uint8Array,ArrayBuffer,TextEncoder,TextDecoder,
};
vm.createContext(sandbox);

const srcDir = path.join(__dirname,'..','src');

function loadModule(relPath) {
  let code = fs.readFileSync(path.join(srcDir,relPath),'utf8');
  // Convert top-level const/let to var so they attach to sandbox
  code = code.replace(/^(const|let)\s+/gm, 'var ');
  try { vm.runInContext(code, sandbox, {filename:relPath}); }
  catch(e){ console.warn(`⚠️ ${relPath}: ${e.message}`); }
}

loadModule('core/state.js');
loadModule('data/techdb.js');
loadModule('data/helpdata.js');
loadModule('data/presets.js');

module.exports = {
  sandbox,
  get S(){return sandbox.S;},
  set S(v){sandbox.S=v;},
  reqLabel:(...a)=>sandbox.reqLabel(...a),
  priceLabel:(...a)=>sandbox.priceLabel(...a),
  get HELP_DATA(){return sandbox.HELP_DATA;},
  get TECH_DB(){return sandbox.TECH_DB;},
  get PRESETS(){return sandbox.PRESETS;},
  get PR(){return sandbox.PR;},
  get PR_FIELD(){return sandbox.PR_FIELD;},
  get FIELD_CAT_MAP(){return sandbox.FIELD_CAT_MAP;},
  get FIELD_CATS_JA(){return sandbox.FIELD_CATS_JA;},
  get FIELD_CATS_EN(){return sandbox.FIELD_CATS_EN;},
  get FIELD_TREND(){return sandbox.FIELD_TREND;},
  get _SCALE_DEFAULTS(){return sandbox._SCALE_DEFAULTS;},
  get FIELD_CAT_DEFAULTS(){return sandbox.FIELD_CAT_DEFAULTS;},
  get _PD(){return sandbox._PD;},
  get REQ_LABELS(){return sandbox.REQ_LABELS;},
  esc:(...a)=>sandbox.esc(...a),
  hasDM:(...a)=>sandbox.hasDM(...a),
  save:()=>sandbox.save(),
  load:()=>sandbox.load(),
  localStorage:sandbox.localStorage,
  resetState(){
    sandbox.S={phase:0,step:0,answers:{},projectName:'',
      skill:'intermediate',preset:'custom',lang:'ja',
      genLang:'ja',theme:'dark',pillar:0,previewFile:null,
      files:{},skipped:[],progress:{},
      editedFiles:{},prevFiles:{},_v:9};
  },
  loadModule,
};
