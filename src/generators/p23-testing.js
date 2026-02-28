// P23: Testing Intelligence
// Generates: docs/91_testing_strategy.md, 92_coverage_design.md,
//            93_e2e_test_architecture.md, 94_performance_testing.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

var TEST_PYRAMID=[
  {layer:'Unit',ja:'ユニットテスト',ratio:'70%',ja_goal:'関数・クラス単位の論理検証',en_goal:'Verify logic at function/class level',ja_tool:'Jest / Vitest / pytest / JUnit',en_tool:'Jest / Vitest / pytest / JUnit'},
  {layer:'Integration',ja:'統合テスト',ratio:'20%',ja_goal:'API・DB・外部サービス連携の検証',en_goal:'Verify API, DB, external service integration',ja_tool:'Supertest / pytest / RestAssured',en_tool:'Supertest / pytest / RestAssured'},
  {layer:'E2E',ja:'E2Eテスト',ratio:'10%',ja_goal:'ユーザーフロー全体の動作確認',en_goal:'Verify full user flows end-to-end',ja_tool:'Playwright / Cypress',en_tool:'Playwright / Cypress'},
];

var COVERAGE_TOOLS={
  node:{tool:'Istanbul (nyc) / V8 Coverage',config:'jest.config.js: coverageProvider',ja_cmd:'jest --coverage',en_cmd:'jest --coverage'},
  python:{tool:'pytest-cov + coverage.py',config:'pytest.ini: addopts = --cov',ja_cmd:'pytest --cov=app --cov-report=xml',en_cmd:'pytest --cov=app --cov-report=xml'},
  java:{tool:'JaCoCo',config:'build.gradle: jacocoTestReport',ja_cmd:'./gradlew test jacocoTestReport',en_cmd:'./gradlew test jacocoTestReport'},
};

var COVERAGE_TARGETS=[
  {layer:'Unit',ja:'ビジネスロジック層',en:'Business logic layer',target:'≥ 80%',ja_note:'ユーティリティ・ヘルパーも含む',en_note:'Include utilities and helpers'},
  {layer:'Integration',ja:'APIエンドポイント',en:'API endpoints',target:'≥ 60%',ja_note:'ハッピーパス + 主要エラーケース',en_note:'Happy path + major error cases'},
  {layer:'E2E',ja:'クリティカルパス',en:'Critical paths',target:'主要フロー100%',en_target:'Key flows 100%',ja_note:'ログイン・決済・コアCRUD',en_note:'Login, payment, core CRUD'},
];

var E2E_PATTERNS=[
  {id:'pom',ja:'Page Object Model (POM)',en:'Page Object Model (POM)',
   ja_desc:'ページのUI操作をクラスに集約し、テストの保守性を高める',
   en_desc:'Encapsulate page UI interactions in classes for maintainability'},
  {id:'fixtures',ja:'フィクスチャ管理',en:'Fixture Management',
   ja_desc:'テストデータをfixturesフォルダに集約。テスト間の独立性を保つ',
   en_desc:'Centralize test data in fixtures folder. Maintain test isolation'},
  {id:'selectors',ja:'セレクター戦略',en:'Selector Strategy',
   ja_desc:'data-testid属性を使用。CSSクラスや文言に依存しない',
   en_desc:'Use data-testid attributes. Avoid CSS class or text dependencies'},
];

var WEB_VITALS=[
  {metric:'LCP',name:'Largest Contentful Paint',good:'≤ 2.5s',needs:'≤ 4.0s',poor:'> 4.0s',
   ja_tip:'画像の最適化・サーバーレスポンス改善・CDN活用',en_tip:'Optimize images, server response time, use CDN'},
  {metric:'INP',name:'Interaction to Next Paint',good:'≤ 200ms',needs:'≤ 500ms',poor:'> 500ms',
   ja_tip:'JavaScriptの実行時間削減・長いタスクを分割',en_tip:'Reduce JS execution time, split long tasks'},
  {metric:'CLS',name:'Cumulative Layout Shift',good:'≤ 0.1',needs:'≤ 0.25',poor:'> 0.25',
   ja_tip:'画像・広告にwidth/height指定。動的コンテンツの領域確保',en_tip:'Specify width/height for images/ads. Reserve space for dynamic content'},
];

/* Domain-specific test strategies */
var DOMAIN_TEST_EXTRA={
  fintech:{
    cov_ja:['決済フロー (Payment Flow) → ≥95% カバレッジ必須','トランザクション分離 (Serializable) の境界値テスト','AML/KYCルールのユニットテスト完全カバー','認証2段階フローの全パスカバー'],
    cov_en:['Payment flow coverage ≥ 95% required','Transaction isolation (Serializable) boundary tests','Full unit coverage for AML/KYC rules','Full coverage for 2FA auth flow'],
    e2e_ja:['支払い完了フロー (Stripe/card → success/failure)','認証2FA フロー (TOTP/SMS)','取引履歴ページネーションのE2E','不正検知アラートのUI確認'],
    e2e_en:['Payment checkout flow (success/failure)','2FA authentication flow (TOTP/SMS)','Transaction history pagination E2E','Fraud alert UI validation'],
    perf_ja:['同時決済 100並列 → エラー率 < 0.1% 目標','タイムアウト設定: 決済API 5s / 認証API 2s','DB ロックタイムアウト境界値テスト'],
    perf_en:['100 concurrent payments → error rate < 0.1%','Timeout: payment API 5s / auth API 2s','DB lock timeout boundary test']},
  health:{
    cov_ja:['患者記録CRUD → 100% カバレッジ','同意管理フロー (Consent) の境界値テスト','PHIアクセスログ記録の完全テスト','HIPAA監査トレイル生成の検証'],
    cov_en:['Patient record CRUD → 100% coverage','Consent management flow boundary tests','PHI access log recording full test','HIPAA audit trail generation validation'],
    e2e_ja:['患者記録作成→参照→更新→論理削除フロー','診断書・処方箋PDFダウンロードE2E','権限別アクセス制御 (医師/看護師/患者) の検証'],
    e2e_en:['Patient record create→read→update→soft-delete flow','Medical report PDF download E2E','Role-based access control (doctor/nurse/patient) validation'],
    perf_ja:['EMRクエリ P95 ≤ 500ms (1000レコード)','同時200セッション接続テスト','バックアップ/リストア時間計測'],
    perf_en:['EMR query P95 ≤ 500ms (1000 records)','Concurrent 200 session load test','Backup/restore time measurement']},
  ec:{
    cov_ja:['カート操作→在庫管理連携 → ≥90% カバレッジ','在庫0時の注文防止ロジック (オーバーセル防止) の完全テスト','決済Webhookハンドラのユニットテスト'],
    cov_en:['Cart→inventory integration coverage ≥ 90%','Oversell prevention logic full unit coverage','Payment webhook handler unit tests'],
    e2e_ja:['カート追加→決済→注文確認メールフロー','在庫切れ商品の購入不可確認','クーポン適用→割引額計算→決済フロー'],
    e2e_en:['Add to cart→checkout→order confirmation email flow','Out-of-stock purchase prevention check','Coupon apply→discount calc→checkout flow'],
    perf_ja:['フラッシュセール模擬: 10K同時リクエスト → 在庫競合テスト','商品一覧ページ: P95 ≤ 1s (1000商品)'],
    perf_en:['Flash sale simulation: 10K concurrent requests → inventory contention','Product listing page: P95 ≤ 1s (1000 items)']},
  ai:{
    cov_ja:['LLMレスポンスパーサー → ≥85% カバレッジ','プロンプトインジェクション防御ロジックの完全テスト','RAGパイプラインのユニットテスト (モック使用)'],
    cov_en:['LLM response parser coverage ≥ 85%','Prompt injection defense logic full coverage','RAG pipeline unit tests (with mocks)'],
    e2e_ja:['チャット送信→ストリーミングレスポンスのE2E','API タイムアウト処理 (30s超過) の確認','会話履歴の永続化と復元フロー'],
    e2e_en:['Chat send→streaming response E2E','API timeout handling (>30s) validation','Conversation history persistence and restore flow'],
    perf_ja:['LLM API レイテンシ P95 ≤ 5s (ストリーミング除く)','同時チャット 50セッション→エラー率 < 1%'],
    perf_en:['LLM API latency P95 ≤ 5s (excl. streaming)','50 concurrent chat sessions → error rate < 1%']},
};

// ============================================================================
// HELPERS
// ============================================================================

function _testFE(a){
  var fe=a.frontend||'';
  if(/Next/i.test(fe)) return 'nextjs';
  if(/Vite|CRA/i.test(fe)) return 'react';
  if(/Vue|Nuxt/i.test(fe)) return 'vue';
  if(/Svelte|SvelteKit/i.test(fe)) return 'svelte';
  if(/Astro/i.test(fe)) return 'astro';
  return 'react';
}

function _testBE(a){
  var be=a.backend||'';
  if(/Python|FastAPI|Django/i.test(be)) return 'python';
  if(/Spring|Java/i.test(be)) return 'java';
  if(/Supabase|Firebase|Convex/i.test(be)) return 'baas';
  return 'node';
}

function _unitFramework(feType, beType, G){
  if(beType==='python') return G?'pytest + pytest-asyncio (非同期対応)':'pytest + pytest-asyncio (async support)';
  if(beType==='java') return G?'JUnit 5 + Mockito + AssertJ':'JUnit 5 + Mockito + AssertJ';
  if(feType==='vue'||feType==='svelte') return 'Vitest + @testing-library';
  return 'Jest + @testing-library/react';
}

// ============================================================================
// GENERATOR
// ============================================================================

function genPillar23_TestingIntelligence(a,pn){
  var G=S.genLang==='ja';
  var feType=_testFE(a);
  var beType=_testBE(a);
  gen91(a,pn,G,feType,beType);
  gen92(a,pn,G,feType,beType);
  gen93(a,pn,G,feType,beType);
  gen94(a,pn,G,feType,beType);
}

// doc 91: Testing Strategy
function gen91(a,pn,G,feType,beType){
  var unitFw=_unitFramework(feType,beType,G);
  var isBaaS=beType==='baas';
  var isPy=beType==='python';
  var isJava=beType==='java';

  var doc='';
  doc+='# '+(G?'テスト戦略':'Testing Strategy')+'\n\n';
  doc+=(G
    ?'> **プロジェクト**: '+pn+' | **フロントエンド**: '+(a.frontend||'N/A')+' | **バックエンド**: '+(a.backend||'N/A')+'\n\n'
    :'> **Project**: '+pn+' | **Frontend**: '+(a.frontend||'N/A')+' | **Backend**: '+(a.backend||'N/A')+'\n\n'
  );

  // Test pyramid
  doc+='## '+(G?'テストピラミッド':'Test Pyramid')+'\n\n';
  doc+='| '+(G?'層':'Layer')+' | '+(G?'割合':'Ratio')+' | '+(G?'目的':'Goal')+' | '+(G?'ツール':'Tools')+' |\n';
  doc+='|------|--------|------|------|\n';
  TEST_PYRAMID.forEach(function(t){
    doc+='| '+(G?t.ja:t.layer)+' | '+t.ratio+' | '+(G?t.ja_goal:t.en_goal)+' | '+(G?t.ja_tool:t.en_tool)+' |\n';
  });
  doc+='\n';

  // Framework selection
  doc+='## '+(G?'推奨テストフレームワーク':'Recommended Test Frameworks')+'\n\n';

  // Frontend
  doc+='### '+(G?'フロントエンド ('+feType.toUpperCase()+')':'Frontend ('+feType.toUpperCase()+')')+'\n\n';
  if(feType==='nextjs'){
    doc+='```bash\n# Install\nnpm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom\n\n# Or Vitest (faster, Vite-native)\nnpm install -D vitest @testing-library/react @testing-library/jest-dom jsdom\n```\n\n';
    doc+='```typescript\n// __tests__/components/Button.test.tsx\nimport { render, screen, fireEvent } from \'@testing-library/react\';\nimport Button from \'@/components/Button\';\n\ndescribe(\'Button\', () => {\n  it(\'renders with label\', () => {\n    render(<Button label="Click me" onClick={jest.fn()} />);\n    expect(screen.getByText(\'Click me\')).toBeInTheDocument();\n  });\n\n  it(\'calls onClick when clicked\', () => {\n    const handleClick = jest.fn();\n    render(<Button label="Click me" onClick={handleClick} />);\n    fireEvent.click(screen.getByText(\'Click me\'));\n    expect(handleClick).toHaveBeenCalledTimes(1);\n  });\n});\n```\n\n';
  } else if(feType==='vue'){
    doc+='```bash\nnpm install -D vitest @vue/test-utils @testing-library/vue jsdom\n```\n\n';
    doc+='```typescript\n// tests/unit/MyComponent.test.ts\nimport { mount } from \'@vue/test-utils\';\nimport MyComponent from \'@/components/MyComponent.vue\';\n\ndescribe(\'MyComponent\', () => {\n  it(\'renders slot content\', () => {\n    const wrapper = mount(MyComponent, {\n      slots: { default: \'Hello\' }\n    });\n    expect(wrapper.text()).toContain(\'Hello\');\n  });\n});\n```\n\n';
  } else {
    doc+='```bash\n# Vitest (Vite projects)\nnpm install -D vitest @testing-library/react @testing-library/jest-dom jsdom\n```\n\n';
    doc+='```typescript\n// src/__tests__/App.test.tsx\nimport { render, screen } from \'@testing-library/react\';\nimport { describe, it, expect } from \'vitest\';\nimport App from \'../App\';\n\ndescribe(\'App\', () => {\n  it(\'renders headline\', () => {\n    render(<App />);\n    expect(screen.getByRole(\'heading\')).toBeInTheDocument();\n  });\n});\n```\n\n';
  }

  // Backend
  doc+='### '+(G?'バックエンド':'Backend')+'\n\n';
  if(isPy){
    doc+='```bash\npip install pytest pytest-asyncio httpx pytest-cov\n```\n\n';
    doc+='```python\n# tests/test_api.py\nimport pytest\nfrom httpx import AsyncClient\nfrom app.main import app\n\n@pytest.mark.asyncio\nasync def test_health_check():\n    async with AsyncClient(app=app, base_url="http://test") as ac:\n        response = await ac.get("/health")\n    assert response.status_code == 200\n    assert response.json()["status"] == "ok"\n\n@pytest.mark.asyncio\nasync def test_create_user(db_session):\n    async with AsyncClient(app=app, base_url="http://test") as ac:\n        response = await ac.post("/users", json={"email": "test@example.com", "name": "Test"})\n    assert response.status_code == 201\n    assert response.json()["email"] == "test@example.com"\n```\n\n';
  } else if(isJava){
    doc+='```java\n// src/test/java/com/example/UserControllerTest.java\n@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)\n@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)\nclass UserControllerTest {\n    @Autowired\n    private TestRestTemplate restTemplate;\n\n    @Test\n    void shouldCreateUser() {\n        var request = new CreateUserRequest("test@example.com", "Test User");\n        var response = restTemplate.postForEntity("/api/users", request, UserDto.class);\n        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);\n        assertThat(response.getBody().email()).isEqualTo("test@example.com");\n    }\n}\n```\n\n';
  } else if(isBaaS){
    doc+=(G
      ?'BaaS構成ではサーバーレスロジックのユニットテストに集中します。\n\n'
      :'For BaaS architecture, focus unit tests on serverless logic and edge functions.\n\n'
    );
    doc+='```typescript\n// tests/functions/processOrder.test.ts\nimport { describe, it, expect, vi } from \'vitest\';\nimport { processOrder } from \'../functions/processOrder\';\n\ndescribe(\'processOrder\', () => {\n  it(\'validates required fields\', async () => {\n    await expect(processOrder({ userId: \'\', items: [] })).rejects.toThrow(\'userId is required\');\n  });\n\n  it(\'calculates total correctly\', async () => {\n    const result = await processOrder({ userId: \'u1\', items: [{ price: 100, qty: 2 }] });\n    expect(result.total).toBe(200);\n  });\n});\n```\n\n';
  } else {
    doc+='```bash\nnpm install -D jest @types/jest supertest @types/supertest ts-jest\n```\n\n';
    doc+='```typescript\n// tests/integration/users.test.ts\nimport request from \'supertest\';\nimport app from \'../../src/app\';\nimport { db } from \'../../src/db\';\n\nafterAll(async () => { await db.$disconnect(); });\n\ndescribe(\'POST /api/users\', () => {\n  it(\'creates a user and returns 201\', async () => {\n    const res = await request(app)\n      .post(\'/api/users\')\n      .send({ email: \'test@example.com\', name: \'Test\' });\n    expect(res.status).toBe(201);\n    expect(res.body.email).toBe(\'test@example.com\');\n  });\n\n  it(\'returns 400 for duplicate email\', async () => {\n    const res = await request(app)\n      .post(\'/api/users\')\n      .send({ email: \'existing@example.com\' });\n    expect(res.status).toBe(400);\n  });\n});\n```\n\n';
  }

  // TDD workflow
  doc+='## '+(G?'TDD ワークフロー (AI駆動)':'TDD Workflow (AI-Driven)')+'\n\n';
  doc+='```\n';
  doc+=(G
    ?'1. RED   — 失敗するテストを先に書く (Claude Code に仕様を渡す)\n2. GREEN — 最小限のコードでテストを通す\n3. REFACTOR — テストを維持しながらコードを改善\n4. COMMIT — CI が GREEN のときのみコミット\n'
    :'1. RED   — Write failing tests first (pass spec to Claude Code)\n2. GREEN — Write minimal code to pass tests\n3. REFACTOR — Improve code while keeping tests green\n4. COMMIT — Commit only when CI is GREEN\n'
  );
  doc+='```\n\n';

  // Domain-specific test focus (DOMAIN_QA_MAP)
  var domainQ=detectDomain(a.purpose||'');
  var dqa=typeof DOMAIN_QA_MAP!=='undefined'?(DOMAIN_QA_MAP[domainQ]||null):null;
  if(dqa){
    doc+='## '+(G?'ドメイン別テスト重点領域 ('+domainQ+')':'Domain-Specific Test Focus ('+domainQ+')')+'\n\n';
    doc+='### '+(G?'テスト優先マトリクス':'Test Priority Matrix')+'\n\n';
    var prioItems=dqa.priority.split('|');
    doc+='| '+(G?'品質特性':'Quality Attribute')+' | '+(G?'優先度':'Priority')+' |\n|------|------|\n';
    prioItems.forEach(function(p){
      var parts=p.split(':');
      if(parts.length===2) doc+='| '+parts[0]+' | '+parts[1]+' |\n';
    });
    doc+='\n';
    doc+='### '+(G?'重点テスト領域':'Key Test Areas')+'\n\n';
    var focuses=G?dqa.focus_ja:dqa.focus_en;
    focuses.forEach(function(f){doc+='- ✅ '+f+'\n';});
    doc+='\n';
    doc+='### '+(G?'既知バグパターン（回帰テスト必須）':'Known Bug Patterns (regression tests required)')+'\n\n';
    var bugs=G?dqa.bugs_ja:dqa.bugs_en;
    bugs.forEach(function(b){doc+='- ⚠️ '+b+'\n';});
    doc+='\n';
  }

  // Entity-specific test fixtures
  var _p91ents=(a.entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
  if(_p91ents.length){
    var _p91ent=_p91ents[0];
    var _p91cols=getEntityColumns(_p91ent,G,_p91ents);
    if(_p91cols.length){
      doc+='## '+(G?'エンティティ別テストフィクスチャ例 ('+_p91ent+')':'Entity Test Fixtures ('+_p91ent+')')+'\n\n';
      var _p91obj={};
      _p91cols.forEach(function(c){
        if(!c)return;
        var cn=c.col,ct=(c.type||'').toUpperCase();
        if(/^(id|created_at|updated_at|deleted_at)$/.test(cn))return;
        if(/UUID/.test(ct))_p91obj[cn]='"'+cn+'-uuid"';
        else if(/^INT|BIGINT|SMALLINT/.test(ct))_p91obj[cn]='1';
        else if(/DECIMAL|FLOAT|NUMERIC/.test(ct))_p91obj[cn]='9.99';
        else if(/BOOL/.test(ct))_p91obj[cn]='true';
        else if(/TIMESTAMP|DATE/.test(ct))_p91obj[cn]='"2024-01-01T00:00:00Z"';
        else if(/JSON/.test(ct))_p91obj[cn]='{}';
        else _p91obj[cn]='"'+cn.replace(/_/g,'-')+'"';
      });
      var _p91lines=Object.keys(_p91obj).map(function(k){return '  '+k+': '+_p91obj[k];});
      if(isPy){
        doc+='```python\n# tests/fixtures/'+_p91ent.toLowerCase()+'_fixture.py\nSAMPLE_DATA = {\n';
        _p91lines.forEach(function(l){doc+=l+',\n';});
        doc+='}\n```\n\n';
      } else {
        doc+='```typescript\n// tests/fixtures/'+_p91ent[0].toLowerCase()+_p91ent.slice(1)+'.fixture.ts\nimport type { '+_p91ent+' } from \'@/types\';\n\nexport const sample'+_p91ent+': Partial<'+_p91ent+'> = {\n';
        _p91lines.forEach(function(l){doc+=l+',\n';});
        doc+='};\n```\n\n';
      }
      var _p91reqCol=_p91cols.find(function(c){return c&&/NOT NULL/.test(c.constraint||'')&&!/DEFAULT/.test(c.constraint||'')&&!/^(id|created_at|updated_at|deleted_at)$/.test(c.col||'');});
      if(_p91reqCol){
        var _p91rf=_p91reqCol.col;
        doc+='```typescript\n// '+(G?'必須フィールドバリデーションテスト':'Required field validation')+'\nit(\'rejects missing '+_p91rf+'\', async () => {\n  const data = { ...sample'+_p91ent+' };\n  delete (data as any).'+_p91rf+';\n  await expect(service.create(data)).rejects.toThrow();\n});\n```\n\n';
      }
    }
  }

  S.files['docs/91_testing_strategy.md']=doc;
}

// doc 92: Coverage Design
function gen92(a,pn,G,feType,beType){
  var isPy=beType==='python';
  var isJava=beType==='java';
  var covTool=isPy?COVERAGE_TOOLS.python:isJava?COVERAGE_TOOLS.java:COVERAGE_TOOLS.node;

  var doc='';
  doc+='# '+(G?'カバレッジ設計':'Coverage Design')+'\n\n';
  doc+='> **'+(G?'カバレッジツール':'Coverage Tool')+'**: '+covTool.tool+'\n\n';

  // Targets
  doc+='## '+(G?'カバレッジ目標':'Coverage Targets')+'\n\n';
  doc+='| '+(G?'層':'Layer')+' | '+(G?'対象':'Target')+' | '+(G?'目標':'Goal')+' | '+(G?'備考':'Notes')+' |\n';
  doc+='|------|------|------|------|\n';
  COVERAGE_TARGETS.forEach(function(c){
    var tgt=G?(c.target+(c.en_target?'':'')):c.target;
    doc+='| '+(G?c.layer:c.layer)+' | '+(G?c.ja:c.en)+' | '+tgt+' | '+(G?c.ja_note:c.en_note)+' |\n';
  });
  doc+='\n';

  // Tool config
  doc+='## '+(G?'ツール設定 ('+covTool.tool+')':'Tool Configuration ('+covTool.tool+')')+'\n\n';

  if(isPy){
    doc+='```ini\n# pytest.ini\n[pytest]\naddopts = --cov=app --cov-report=term-missing --cov-report=xml --cov-fail-under=80\ntestpaths = tests\n```\n\n';
    doc+='```yaml\n# GitHub Actions\n- name: Run tests with coverage\n  run: pytest\n- name: Upload coverage to Codecov\n  uses: codecov/codecov-action@v4\n  with:\n    file: ./coverage.xml\n    fail_ci_if_error: true\n```\n\n';
  } else if(isJava){
    doc+='```kotlin\n// build.gradle.kts\ntasks.jacocoTestCoverageVerification {\n    violationRules {\n        rule {\n            limit {\n                minimum = "0.80".toBigDecimal()\n            }\n        }\n    }\n}\ntasks.check { dependsOn(tasks.jacocoTestCoverageVerification) }\n```\n\n';
  } else {
    doc+='```javascript\n// jest.config.js\nmodule.exports = {\n  coverageProvider: \'v8\',\n  collectCoverageFrom: [\'src/**/*.{ts,tsx}\', \'!src/**/*.d.ts\', \'!src/**/index.ts\'],\n  coverageThresholds: {\n    global: { branches: 70, functions: 80, lines: 80, statements: 80 }\n  },\n  coverageReporters: [\'text\', \'lcov\', \'html\'],\n};\n```\n\n';
    doc+='```yaml\n# .github/workflows/ci.yml\n- name: Test with coverage\n  run: '+covTool.en_cmd+'\n- name: Upload coverage\n  uses: codecov/codecov-action@v4\n  with:\n    fail_ci_if_error: true\n```\n\n';
  }

  // What NOT to test
  doc+='## '+(G?'テストしないもの (カバレッジ数値を上げるためだけに書かない)':'What NOT to Test (never write tests just to raise numbers)')+'\n\n';
  var notTest=G
    ?['単純なgetter/setter','サードパーティライブラリの内部動作','環境変数の設定値そのもの','型定義ファイル (.d.ts)','自動生成コード (prisma client等)']
    :['Simple getters/setters','Third-party library internals','Environment variable values themselves','Type definition files (.d.ts)','Auto-generated code (e.g., prisma client)'];
  notTest.forEach(function(n){doc+='- '+n+'\n';});
  doc+='\n';

  // Mutation testing hint
  doc+='## '+(G?'ミューテーションテスト (上級)':'Mutation Testing (Advanced)')+'\n\n';
  doc+=(G
    ?'カバレッジ80%を達成後、ミューテーションテストでテスト品質を検証します。\n\n'
    :'After reaching 80% coverage, use mutation testing to verify test quality.\n\n'
  );
  doc+='```bash\n'+(isPy?'# mutmut (Python)\npip install mutmut\nmutmut run\nmutmut results':'# Stryker (JavaScript/TypeScript)\nnpm install -D @stryker-mutator/core @stryker-mutator/jest-runner\nnpx stryker run')+'\n```\n\n';

  // Domain-specific coverage priorities
  var _d92=detectDomain(a.purpose||'');
  var _de92=_d92&&DOMAIN_TEST_EXTRA[_d92];
  if(_de92){
    doc+='## '+(G?'ドメイン固有カバレッジ優先 ('+_d92+')':'Domain Coverage Priorities ('+_d92+')')+'\n\n';
    (G?_de92.cov_ja:_de92.cov_en).forEach(function(c){doc+='- '+c+'\n';});
    doc+='\n';
  }

  S.files['docs/92_coverage_design.md']=doc;
}

// doc 93: E2E Test Architecture
function gen93(a,pn,G,feType,beType){
  var isMobile=/Expo|Flutter|React Native/i.test(a.mobile||'');
  var hasAuth=a.auth&&!(typeof isNone==='function'?isNone(a.auth):/なし|none/i.test(a.auth));

  var doc='';
  doc+='# '+(G?'E2Eテストアーキテクチャ':'E2E Test Architecture')+'\n\n';
  doc+='> '+(G?'推奨ツール: **Playwright** (クロスブラウザ・並列実行対応)':'Recommended: **Playwright** (cross-browser, parallel execution)')+'\n\n';

  // Tool comparison
  doc+='## '+(G?'ツール比較':'Tool Comparison')+'\n\n';
  doc+='| '+(G?'観点':'Aspect')+' | Playwright | Cypress |\n';
  doc+='|------|------------|--------|\n';
  doc+='| '+(G?'クロスブラウザ':'Cross-browser')+' | ✅ Chrome/Firefox/Safari | ⚠️ Chrome/Firefox |\n';
  doc+='| '+(G?'並列実行':'Parallel')+' | ✅ ネイティブサポート | 💰 有料プランのみ |\n';
  doc+='| '+(G?'モバイルエミュレーション':'Mobile emulation')+' | ✅ | ⚠️ 限定的 |\n';
  doc+='| '+(G?'セットアップ':'Setup')+' | '+(G?'やや複雑':'Slightly complex')+' | '+(G?'シンプル':'Simple')+' |\n';
  doc+='| '+(G?'推奨用途':'Best for')+' | '+(G?'本番環境E2E':'Production E2E')+' | '+(G?'開発中の素早いテスト':'Dev-time quick tests')+' |\n';
  doc+='\n';

  // Playwright setup
  doc+='## '+(G?'Playwright セットアップ':'Playwright Setup')+'\n\n';
  doc+='```bash\nnpm install -D @playwright/test\nnpx playwright install  # Install browsers\n```\n\n';
  doc+='```typescript\n// playwright.config.ts\nimport { defineConfig, devices } from \'@playwright/test\';\n\nexport default defineConfig({\n  testDir: \'./e2e\',\n  timeout: 30_000,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 2 : undefined,\n  reporter: [[\'html\'], [\'github\']],\n  use: {\n    baseURL: process.env.BASE_URL || \'http://localhost:3000\',\n    trace: \'on-first-retry\',\n    screenshot: \'only-on-failure\',\n  },\n  projects: [\n    { name: \'chromium\', use: { ...devices[\'Desktop Chrome\'] } },\n    { name: \'firefox\',  use: { ...devices[\'Desktop Firefox\'] } },\n    { name: \'mobile\',   use: { ...devices[\'iPhone 14\'] } },\n  ],\n});\n```\n\n';

  // Page Object Model
  doc+='## '+(G?'Page Object Model (POM)':'Page Object Model (POM)')+'\n\n';
  E2E_PATTERNS.forEach(function(p){
    doc+='### '+(G?p.ja:p.en)+'\n\n'+(G?p.ja_desc:p.en_desc)+'\n\n';
  });
  doc+='```typescript\n// e2e/pages/LoginPage.ts\nimport { Page, Locator } from \'@playwright/test\';\n\nexport class LoginPage {\n  readonly emailInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(private page: Page) {\n    this.emailInput    = page.getByTestId(\'email-input\');\n    this.passwordInput = page.getByTestId(\'password-input\');\n    this.submitButton  = page.getByTestId(\'login-submit\');\n  }\n\n  async goto() { await this.page.goto(\'/login\'); }\n\n  async login(email: string, password: string) {\n    await this.emailInput.fill(email);\n    await this.passwordInput.fill(password);\n    await this.submitButton.click();\n  }\n}\n```\n\n';

  // Auth handling
  if(hasAuth){
    doc+='## '+(G?'認証の扱い (storageState)':'Auth Handling (storageState)')+'\n\n';
    doc+='```typescript\n// e2e/setup/auth.setup.ts\nimport { test as setup } from \'@playwright/test\';\n\nsetup(\'authenticate\', async ({ page }) => {\n  await page.goto(\'/login\');\n  await page.getByTestId(\'email-input\').fill(process.env.TEST_USER_EMAIL!);\n  await page.getByTestId(\'password-input\').fill(process.env.TEST_USER_PASSWORD!);\n  await page.getByTestId(\'login-submit\').click();\n  await page.waitForURL(\'/dashboard\');\n  // Save auth state for reuse across tests\n  await page.context().storageState({ path: \'e2e/.auth/user.json\' });\n});\n```\n\n';
  }

  // Mobile
  if(isMobile){
    doc+='## '+(G?'モバイルE2Eテスト (Detox / Maestro)':'Mobile E2E Testing (Detox / Maestro)')+'\n\n';
    doc+=(G
      ?'Expo/React Nativeプロジェクトには**Maestro** (シンプル) または **Detox** (高精度) を推奨します。\n\n'
      :'For Expo/React Native projects, use **Maestro** (simple) or **Detox** (precise) for mobile E2E.\n\n'
    );
    doc+='```yaml\n# .maestro/login_flow.yaml\nappId: com.example.app\n---\n- launchApp\n- tapOn: "Email"\n- inputText: "test@example.com"\n- tapOn: "Password"\n- inputText: "password123"\n- tapOn: "Login"\n- assertVisible: "Welcome"\n```\n\n';
  }

  // Domain-specific E2E scenarios
  var _d93=detectDomain(a.purpose||'');
  var _de93=_d93&&DOMAIN_TEST_EXTRA[_d93];
  if(_de93){
    doc+='## '+(G?'ドメイン固有E2Eシナリオ ('+_d93+')':'Domain E2E Scenarios ('+_d93+')')+'\n\n';
    (G?_de93.e2e_ja:_de93.e2e_en).forEach(function(s){doc+='- [ ] '+s+'\n';});
    doc+='\n';
  }

  // CI
  doc+='## CI '+(G?'統合':'Integration')+'\n\n';
  doc+='```yaml\n# .github/workflows/e2e.yml\nname: E2E Tests\non: [push, pull_request]\njobs:\n  e2e:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: \'20\' }\n      - run: npm ci\n      - run: npx playwright install --with-deps chromium\n      - name: Run E2E\n        run: npx playwright test\n        env:\n          BASE_URL: http://localhost:3000\n          CI: true\n      - uses: actions/upload-artifact@v4\n        if: failure()\n        with:\n          name: playwright-report\n          path: playwright-report/\n```\n\n';

  S.files['docs/93_e2e_test_architecture.md']=doc;
}

// doc 94: Performance Testing
function gen94(a,pn,G,feType,beType){
  var isBaaS=beType==='baas';
  var isPy=beType==='python';
  var isNext=feType==='nextjs';

  var doc='';
  doc+='# '+(G?'パフォーマンステスト':'Performance Testing')+'\n\n';
  doc+='> **'+(G?'プロジェクト':'Project')+'**: '+pn+'\n\n';

  // Web Vitals
  doc+='## '+(G?'Core Web Vitals 目標値':'Core Web Vitals Targets')+'\n\n';
  doc+='| Metric | Good | '+(G?'改善が必要':'Needs Improvement')+' | Poor | '+(G?'改善のヒント':'Tips')+' |\n';
  doc+='|--------|------|-------|------|------|\n';
  WEB_VITALS.forEach(function(v){
    doc+='| **'+v.metric+'** ('+v.name+') | 🟢 '+v.good+' | 🟡 '+v.needs+' | 🔴 '+v.poor+' | '+(G?v.ja_tip:v.en_tip)+' |\n';
  });
  doc+='\n';

  // Lighthouse CI
  doc+='## Lighthouse CI\n\n';
  doc+='```bash\nnpm install -D @lhci/cli\n```\n\n';
  doc+='```yaml\n# lighthouserc.yml\nci:\n  collect:\n    url:\n      - \'http://localhost:3000\'\n      - \'http://localhost:3000/dashboard\'\n    numberOfRuns: 3\n  assert:\n    assertions:\n      categories:performance: [\'error\', {minScore: 0.85}]\n      categories:accessibility: [\'error\', {minScore: 0.90}]\n      categories:best-practices: [\'warn\', {minScore: 0.90}]\n      first-contentful-paint: [\'warn\', {maxNumericValue: 2000}]\n      largest-contentful-paint: [\'error\', {maxNumericValue: 2500}]\n      cumulative-layout-shift: [\'error\', {maxNumericValue: 0.1}]\n  upload:\n    target: temporary-public-storage\n```\n\n';
  doc+='```yaml\n# GitHub Actions integration\n- name: Lighthouse CI\n  run: |\n    npm run build\n    npm run start &\n    sleep 5\n    npx lhci autorun\n  env:\n    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}\n```\n\n';

  // Backend load testing
  doc+='## '+(G?'バックエンド負荷テスト':'Backend Load Testing')+'\n\n';
  if(isPy){
    doc+='```python\n# locust/locustfile.py\nfrom locust import HttpUser, task, between\n\nclass APIUser(HttpUser):\n    wait_time = between(1, 3)\n\n    @task(3)\n    def get_users(self):\n        self.client.get("/api/users")\n\n    @task(1)\n    def create_user(self):\n        self.client.post("/api/users", json={\n            "email": f"user{self.user_id}@example.com",\n            "name": "Load Test User"\n        })\n\n# Run: locust -f locust/locustfile.py --host=http://localhost:8000\n# UI: http://localhost:8089\n```\n\n';
  } else {
    doc+='```javascript\n// k6/load-test.js\nimport http from \'k6/http\';\nimport { check, sleep } from \'k6\';\n\nexport const options = {\n  stages: [\n    { duration: \'30s\', target: 20 },   // Ramp up\n    { duration: \'1m\',  target: 50 },   // Sustain\n    { duration: \'30s\', target: 0 },    // Ramp down\n  ],\n  thresholds: {\n    http_req_duration: [\'p(95)<500\'],  // 95% requests < 500ms\n    http_req_failed:   [\'rate<0.01\'],  // Error rate < 1%\n  },\n};\n\nexport default function () {\n  const res = http.get(`${__ENV.BASE_URL}/api/users`);\n  check(res, {\n    \'status 200\': (r) => r.status === 200,\n    \'response time OK\': (r) => r.timings.duration < 500,\n  });\n  sleep(1);\n}\n// Run: k6 run --env BASE_URL=http://localhost:3000 k6/load-test.js\n```\n\n';
  }

  // Next.js specific
  if(isNext){
    doc+='## '+(G?'Next.js パフォーマンス最適化チェックリスト':'Next.js Performance Optimization Checklist')+'\n\n';
    var items=G
      ?['Image: `next/image` でWebP自動変換 + lazy load','Font: `next/font` でCLS防止','Bundle: `next build` → `next analyze` でバンドル分析','ISR/SSG: 動的ページをISR化してTTFB改善','React Server Components: Clientバンドルを最小化']
      :['Image: `next/image` for WebP auto-convert + lazy load','Font: `next/font` to prevent CLS','Bundle: `next build` → `next analyze` for bundle analysis','ISR/SSG: Convert dynamic pages to ISR for TTFB improvement','React Server Components: Minimize client bundle size'];
    items.forEach(function(it){doc+='- [ ] '+it+'\n';});
    doc+='\n';
  }

  // BaaS specific
  if(isBaaS){
    doc+='## '+(G?'BaaS パフォーマンス注意点':'BaaS Performance Notes')+'\n\n';
    doc+=(G
      ?'- **コールドスタート対策**: Edge Functionsを活用してレイテンシを最小化\n- **リアルタイム接続**: Supabase Realtime / Firestoreリスナーの購読解除を徹底\n- **クエリ最適化**: 必要なカラムのみ SELECT (`.select(\'id, name\')`) でデータ転送量削減\n'
      :'- **Cold start mitigation**: Use Edge Functions to minimize latency\n- **Realtime connections**: Always unsubscribe Supabase Realtime / Firestore listeners\n- **Query optimization**: SELECT only required columns (`.select(\'id, name\')`) to reduce data transfer\n'
    );
    doc+='\n';
  }

  // Performance budget
  doc+='## '+(G?'パフォーマンスバジェット':'Performance Budget')+'\n\n';
  doc+='| '+(G?'リソース':'Resource')+' | '+(G?'上限':'Budget')+' | '+(G?'計測方法':'Measure')+' |\n';
  doc+='|------|--------|--------|\n';
  doc+='| Total JS (gzip) | < 250KB | Webpack Bundle Analyzer |\n';
  doc+='| Total CSS (gzip) | < 50KB | PurgeCSS / Tailwind |\n';
  doc+='| '+(G?'初回レンダリング':'First render')+' (LCP) | < 2.5s | Lighthouse CI |\n';
  doc+='| '+(G?'APIレスポンス (p95)':'API response (p95)')+' | < 500ms | k6 / Locust |\n';
  doc+='| '+(G?'DBクエリ':'DB query')+' (p95) | < 100ms | pg_stat_statements |\n';
  doc+='\n';

  // Domain-specific load test scenarios
  var _d94=detectDomain(a.purpose||'');
  var _de94=_d94&&DOMAIN_TEST_EXTRA[_d94];
  if(_de94&&_de94.perf_ja){
    doc+='## '+(G?'ドメイン固有負荷テストシナリオ ('+_d94+')':'Domain Load Test Scenarios ('+_d94+')')+'\n\n';
    (G?_de94.perf_ja:_de94.perf_en).forEach(function(s){doc+='- '+s+'\n';});
    doc+='\n';
  }

  S.files['docs/94_performance_testing.md']=doc;
}
