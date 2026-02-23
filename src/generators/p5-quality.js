/* ═══ Quality Intelligence Engine (Industry-Adaptive QA Strategy) ═══ */
function genPillar5_QualityIntelligence(a,pn){
  const G=S.genLang==='ja';
  const domain=detectDomain(a.purpose)||'_default';
  const purpose=a.purpose||'';
  const features=(a.mvp_features||'').split(/[,、\n]/).map(s=>s.trim()).filter(Boolean);
  const entities=(a.data_entities||'').split(/[,、]\s*/).map(s=>s.trim()).filter(Boolean);

  // Infer industry from domain or default to saas
  const industryMap={
    fintech:'fintech',health:'health',ec:'ec',saas:'saas',community:'social',
    education:'education',gamify:'gaming',iot:'iot',booking:'travel',
    realestate:'realestate',content:'media',hr:'hr',analytics:'marketing',
    marketplace:'ec',business:'saas',legal:'government',portfolio:'media',
    tool:'saas',ai:'saas',automation:'saas',event:'travel',collab:'saas',
    devtool:'saas',creator:'media',newsletter:'media'
  };
  const industry=industryMap[domain]||'saas';
  const tm=INDUSTRY_TEST_MATRIX[industry]||INDUSTRY_TEST_MATRIX.saas;

  // ═══ docs/32_qa_blueprint.md ═══
  let doc32='# '+(G?'業種適応型QAブループリント':'Industry-Adaptive QA Blueprint')+'\n\n';
  doc32+=G?'**重要**: このドキュメントは、業種特有のQA戦略とリスク評価を提供します。AIエージェントは、テスト計画策定時に必ずこのブループリントを参照してください。\n\n':'**IMPORTANT**: This document provides industry-specific QA strategies and risk assessments. AI agents MUST reference this blueprint when creating test plans.\n\n';

  // Industry Overview
  doc32+=(G?'## 対象業種':'## Target Industry')+'\n\n';
  doc32+='**'+(G?'業種':'Industry')+'**: '+industry+'\n';
  doc32+='**'+(G?'ドメイン':'Domain')+'**: '+domain+'\n';
  doc32+='**'+(G?'プロジェクト目的':'Project Purpose')+'**: '+purpose+'\n\n';

  // Critical Functions
  doc32+=(G?'## 重要機能（Critical Functions）':'## Critical Functions')+'\n\n';
  doc32+=G?'この業種で最も重要視すべき機能:\n\n':'Most critical functions for this industry:\n\n';
  const critFuncs=G?tm.critical_functions_ja:tm.critical_functions_en;
  critFuncs.forEach((cf,i)=>{
    doc32+=(i+1)+'. **'+cf+'**\n';
  });
  doc32+='\n';

  // Test Focus Areas
  doc32+=(G?'## テスト重点領域':'## Test Focus Areas')+'\n\n';
  const testFocus=G?tm.test_focus_ja:tm.test_focus_en;
  testFocus.forEach((tf,i)=>{
    doc32+='### '+(i+1)+'. '+tf+'\n\n';
    // Add test details based on focus area
    if(i===0){
      doc32+=G?'- テストケース: 正常系・異常系・境界値\n- カバレッジ目標: 80%+\n- 自動化: 必須\n\n':'- Test cases: Normal, error, boundary\n- Coverage target: 80%+\n- Automation: Required\n\n';
    }else if(i===1){
      doc32+=G?'- 静的解析ツール使用\n- コードレビュー必須\n- OWASP Top 10準拠\n\n':'- Use static analysis tools\n- Code review required\n- OWASP Top 10 compliance\n\n';
    }else if(i===2){
      doc32+=G?'- 負荷テスト実施\n- レスポンスタイム測定\n- リソース監視\n\n':'- Conduct load testing\n- Measure response time\n- Monitor resources\n\n';
    }else{
      doc32+=G?'- 実機テスト推奨\n- ユーザビリティ評価\n- アクセシビリティチェック\n\n':'- Real device testing recommended\n- Usability evaluation\n- Accessibility check\n\n';
    }
  });

  // Risk Priority Matrix
  doc32+=(G?'## リスク優先度マトリクス':'## Risk Priority Matrix')+'\n\n';
  const priObj={};
  tm.priority.split('|').forEach(p=>{
    const[k,v]=p.split(':');
    priObj[k]=v;
  });
  doc32+='| '+(G?'カテゴリ':'Category')+' | '+(G?'優先度':'Priority')+' | '+(G?'対策':'Mitigation')+' |\n';
  doc32+='|----------|----------|----------|\n';
  const catMap={
    Security:G?'セキュリティ':'Security',
    Performance:G?'パフォーマンス':'Performance',
    DataIntegrity:G?'データ整合性':'Data Integrity',
    UX:'UX',
    Compliance:G?'コンプライアンス':'Compliance'
  };
  Object.entries(catMap).forEach(([key,label])=>{
    const priority=priObj[key]||'MED';
    const mitigation=priority==='HIGH'||priority==='CRITICAL'?(G?'専門家レビュー・自動化テスト':'Expert review, automated tests'):(G?'定期チェック':'Regular checks');
    doc32+='| '+label+' | '+priority+' | '+mitigation+' |\n';
  });
  doc32+='\n';

  // Typical Bugs & Prevention
  doc32+=(G?'## 典型的バグパターン':'## Typical Bug Patterns')+'\n\n';
  const typicalBugs=G?tm.typical_bugs_ja:tm.typical_bugs_en;
  typicalBugs.forEach((bug,i)=>{
    doc32+='### '+(i+1)+'. '+bug+'\n\n';
    doc32+='**'+(G?'検出方法':'Detection')+'**: ';
    if(i===0){
      doc32+=G?'単体テスト・統合テスト\n':'Unit tests, integration tests\n';
    }else if(i===1){
      doc32+=G?'E2Eテスト・手動テスト\n':'E2E tests, manual tests\n';
    }else if(i===2){
      doc32+=G?'コードレビュー・静的解析\n':'Code review, static analysis\n';
    }else{
      doc32+=G?'ログ監視・アラート\n':'Log monitoring, alerts\n';
    }
    doc32+='**'+(G?'予防策':'Prevention')+'**: ';
    if(i===0){
      doc32+=G?'設計段階でのレビュー、早期プロトタイプ検証\n':'Design review, early prototype validation\n';
    }else if(i===1){
      doc32+=G?'ペアプログラミング、TDD実践\n':'Pair programming, TDD practice\n';
    }else{
      doc32+=G?'チェックリスト使用、自動化\n':'Use checklists, automation\n';
    }
    doc32+='\n';
  });

  // Recommended Tools
  doc32+=(G?'## 推奨テストツール':'## Recommended Testing Tools')+'\n\n';
  const tools=G?tm.tools_ja:tm.tools_en;
  tools.forEach((tool,i)=>{
    const[name,type]=tool.split(/[（(]/);
    const cleanType=(type||'').replace(/[）)]/g,'');
    doc32+=(i+1)+'. **'+name.trim()+'**';
    if(cleanType){
      doc32+=' - '+cleanType;
    }
    doc32+='\n';
  });
  doc32+='\n';

  // Risk Heatmap
  doc32+=(G?'## リスクヒートマップ':'## Risk Heatmap')+'\n\n';
  doc32+='```\n';
  doc32+=(G?'影響度 ＼ 発生確率  │  低    中    高':'Impact \\ Probability │  Low   Med   High')+'\n';
  doc32+='─────────────────┼──────────────────\n';
  const highRisk=priObj.Security==='HIGH'||priObj.Security==='CRITICAL'?'🔴':'🟡';
  const medRisk=priObj.DataIntegrity==='HIGH'?'🟡':'🟢';
  doc32+=(G?'      大          │  🟡    🟡    ':'      High         │  🟡    🟡    ')+highRisk+'\n';
  doc32+=(G?'      中          │  🟢    🟡    🟡':'      Med          │  🟢    🟡    🟡')+'\n';
  doc32+=(G?'      小          │  🟢    🟢    ':'      Low          │  🟢    🟢    ')+medRisk+'\n';
  doc32+='```\n\n';
  doc32+=G?'🔴 = 即対応必須 | 🟡 = 計画的対応 | 🟢 = 定期チェック\n\n':'🔴 = Immediate action | 🟡 = Planned action | 🟢 = Regular check\n\n';

  // Compliance Checklist
  if(priObj.Compliance==='HIGH'||priObj.Compliance==='CRITICAL'){
    doc32+=(G?'## コンプライアンスチェックリスト':'## Compliance Checklist')+'\n\n';
    const compStd={
      fintech:'PCI DSS',health:'HIPAA',education:'FERPA',hr:'GDPR',
      legal:'SOX',government:'WCAG 2.2 AA'
    }[industry]||'GDPR';
    doc32+='**'+(G?'準拠基準':'Standard')+'**: '+compStd+'\n\n';
    doc32+='- [ ] '+(G?'データ暗号化（保存時・転送時）':'Data encryption (at rest & in transit)')+'\n';
    doc32+='- [ ] '+(G?'アクセスログ記録':'Access log recording')+'\n';
    doc32+='- [ ] '+(G?'データ保持期間管理':'Data retention management')+'\n';
    doc32+='- [ ] '+(G?'監査証跡完全性':'Audit trail completeness')+'\n';
    doc32+='- [ ] '+(G?'インシデント対応手順':'Incident response procedures')+'\n\n';
  }

  S.files['docs/32_qa_blueprint.md']=doc32;

  // ═══ docs/33_test_matrix.md ═══
  let doc33='# '+(G?'具体的テストマトリクス':'Concrete Test Matrix')+'\n\n';
  doc33+=G?'**重要**: このマトリクスは、実装すべきテストケースの具体例を提供します。AIエージェントは、テスト実装時にこのマトリクスをテンプレートとして使用してください。\n\n':'**IMPORTANT**: This matrix provides concrete test case examples. AI agents MUST use this matrix as a template when implementing tests.\n\n';

  // Test Case Template
  doc33+=(G?'## テストケーステンプレート':'## Test Case Template')+'\n\n';
  doc33+='| '+(G?'機能':'Feature')+' | '+(G?'テストケース':'Test Case')+' | '+(G?'期待結果':'Expected Result')+' | '+(G?'優先度':'Priority')+' |\n';
  doc33+='|------|------|------|------|\n';

  // Generate test cases for critical functions
  critFuncs.slice(0,3).forEach((func,i)=>{
    const pri=i===0?'P0':(i===1?'P1':'P2');
    // Normal case
    doc33+='| '+func+' | '+(G?'正常系: ':'Normal: ')+(G?'有効なデータで実行':'Execute with valid data')+' | '+(G?'成功':'Success')+' (200/201) | '+pri+' |\n';
    // Error case
    doc33+='| '+func+' | '+(G?'異常系: ':'Error: ')+(G?'不正なデータ':'Invalid data')+' | '+(G?'エラー':'Error')+' (400/422) | '+pri+' |\n';
    // Boundary case
    if(i===0){
      doc33+='| '+func+' | '+(G?'境界値: ':'Boundary: ')+(G?'最大/最小値':'Max/min values')+' | '+(G?'適切に処理':'Handled properly')+' | '+pri+' |\n';
    }
  });
  doc33+='\n';

  // Bug Pattern × Detection × Prevention
  doc33+=(G?'## バグパターン × 検出方法 × 予防策':'## Bug Pattern × Detection × Prevention')+'\n\n';
  doc33+='| '+(G?'バグパターン':'Bug Pattern')+' | '+(G?'検出方法':'Detection Method')+' | '+(G?'予防策':'Prevention')+' |\n';
  doc33+='|----------|----------|----------|\n';
  typicalBugs.forEach((bug,i)=>{
    const detection=i===0?(G?'単体テスト':'Unit tests'):(i===1?(G?'E2Eテスト':'E2E tests'):(i===2?(G?'静的解析':'Static analysis'):(G?'ログ監視':'Log monitoring')));
    const prevention=i===0?(G?'設計レビュー':'Design review'):(i===1?'TDD':(i===2?(G?'チェックリスト':'Checklist'):(G?'自動化':'Automation')));
    doc33+='| '+bug+' | '+detection+' | '+prevention+' |\n';
  });
  doc33+='\n';

  // Cross-Cutting Concerns Test Cases
  doc33+=(G?'## 業界横断テストケース':'## Cross-Cutting Test Cases')+'\n\n';
  const crossCutting=Object.values(QA_CROSS_CUTTING).filter(c=>c.domains.includes(domain)||c.domains.includes(industry));
  if(crossCutting.length>0){
    crossCutting.forEach((cc,i)=>{
      const label=G?cc.ja:cc.en;
      doc33+='### '+(i+1)+'. '+label+'\n\n';
      // Generate sample test case
      if(label.includes('同時')||label.includes('Concurrent')){
        doc33+='- '+(G?'100人同時アクセステスト':'100 concurrent users test')+'\n';
        doc33+='- '+(G?'期待: データ競合0件':'Expected: 0 race conditions')+'\n\n';
      }else if(label.includes('冪等')||label.includes('Idempot')){
        doc33+='- '+(G?'同一リクエスト2回送信':'Send same request twice')+'\n';
        doc33+='- '+(G?'期待: 結果同一、副作用1回のみ':'Expected: Same result, side effect once only')+'\n\n';
      }else if(label.includes('スパイク')||label.includes('Spike')){
        doc33+='- '+(G?'通常の100倍トラフィック':'100x normal traffic')+'\n';
        doc33+='- '+(G?'期待: エラー率5%以下':'Expected: Error rate ≤5%')+'\n\n';
      }else if(label.includes('レート')||label.includes('Rate')){
        doc33+='- '+(G?'制限超過リクエスト':'Request beyond limit')+'\n';
        doc33+='- '+(G?'期待: 429 Too Many Requests':'Expected: 429 Too Many Requests')+'\n\n';
      }else{
        doc33+='- '+(G?'機能テスト実施':'Functional test')+'\n';
        doc33+='- '+(G?'期待: 仕様通り動作':'Expected: Works as specified')+'\n\n';
      }
    });
  }else{
    doc33+=G?'（該当する業界横断テストパターンなし）\n\n':'(No applicable cross-cutting patterns)\n\n';
  }

  // Tool-Specific Test Examples
  doc33+=(G?'## ツール別テスト例':'## Tool-Specific Test Examples')+'\n\n';
  tools.slice(0,3).forEach((tool,i)=>{
    const[name]=tool.split(/[（(]/);
    doc33+='### '+name.trim()+'\n\n```javascript\n';
    if(name.includes('Jest')||name.includes('Vitest')){
      doc33+="describe('"+critFuncs[0]+"', () => {\n";
      doc33+="  test('should return success with valid data', async () => {\n";
      doc33+="    const result = await "+critFuncs[0].toLowerCase().replace(/\s+/g,'')+"(validData);\n";
      doc33+="    expect(result.status).toBe(200);\n";
      doc33+="  });\n});\n";
    }else if(name.includes('Playwright')||name.includes('Cypress')){
      doc33+="test('"+critFuncs[0]+"', async ({ page }) => {\n";
      doc33+="  await page.goto('/"+critFuncs[0].toLowerCase().replace(/\s+/g,'-')+"');\n";
      doc33+="  await page.click('button[type=\"submit\"]');\n";
      doc33+="  await expect(page.locator('.success')).toBeVisible();\n";
      doc33+="});\n";
    }else{
      doc33+="// "+name.trim()+(G?' 使用例':' usage example')+"\n";
      doc33+="// "+(G?'設定と実行手順はドキュメント参照':'Refer to documentation for setup and execution')+"\n";
    }
    doc33+='```\n\n';
  });

  // Coverage Goals
  doc33+=(G?'## カバレッジ目標':'## Coverage Goals')+'\n\n';
  doc33+='| '+(G?'カテゴリ':'Category')+' | '+(G?'目標':'Target')+' |\n';
  doc33+='|----------|----------|\n';
  doc33+='| '+(G?'ライン':'Line')+' | ≥80% |\n';
  doc33+='| '+(G?'ブランチ':'Branch')+' | ≥70% |\n';
  doc33+='| '+(G?'関数':'Function')+' | ≥85% |\n';
  doc33+='| '+(G?'ステートメント':'Statement')+' | ≥80% |\n';
  doc33+='\n';
  doc33+=G?'**注**: 重要機能（P0）は100%カバレッジを目指す\n\n':'**Note**: Critical functions (P0) should aim for 100% coverage\n\n';

  // M5: Boundary value testing methodology
  doc33+=(G?'## 境界値テスト手法 (Boundary Value Analysis)':'## Boundary Value Analysis')+'\n\n';
  doc33+=(G?'境界値分析では最小値・最大値の前後を含む6値でテストします。\n\n':'Test 6 values around min/max boundaries for each input.\n\n');
  doc33+='| '+(G?'値':'Value')+' | '+(G?'説明':'Description')+' | '+(G?'例 (1〜100の入力)':'Example (input 1–100)')+' |\n';
  doc33+='|------|------|------|\n';
  doc33+='| min-1 | '+(G?'最小値未満 (無効)':'Below minimum (invalid)')+' | 0 |\n';
  doc33+='| min | '+(G?'最小値 (有効)':'Minimum (valid)')+' | 1 |\n';
  doc33+='| min+1 | '+(G?'最小値+1 (有効)':'Min+1 (valid)')+' | 2 |\n';
  doc33+='| max-1 | '+(G?'最大値-1 (有効)':'Max-1 (valid)')+' | 99 |\n';
  doc33+='| max | '+(G?'最大値 (有効)':'Maximum (valid)')+' | 100 |\n';
  doc33+='| max+1 | '+(G?'最大値超過 (無効)':'Above maximum (invalid)')+' | 101 |\n\n';

  // M6: Load test methodology
  doc33+=(G?'## 負荷テスト手法':'## Load Test Methodology')+'\n\n';
  doc33+='| '+(G?'ツール':'Tool')+' | '+(G?'用途':'Use')+' | '+(G?'シナリオ':'Scenario')+' |\n';
  doc33+='|------|------|------|\n';
  doc33+='| k6 | '+(G?'スクリプトベース負荷テスト':'Script-based load testing')+' | '+(G?'VU数増加・スパイク・ソークテスト':'Ramp-up, spike, soak tests')+' |\n';
  doc33+='| Artillery | '+(G?'YAMLベース・マルチプロトコル':'YAML-based, multi-protocol')+' | '+(G?'HTTP/WebSocket/GraphQL シナリオ':'HTTP/WebSocket/GraphQL scenarios')+' |\n';
  doc33+='| Locust | '+(G?'Python DSL・分散テスト':'Python DSL, distributed')+' | '+(G?'大規模同時接続テスト':'Large-scale concurrent user tests')+' |\n\n';
  doc33+=(G?'**シナリオ分類**: ① Smoke (1VU) → ② Load (想定ピーク) → ③ Stress (限界) → ④ Soak (24h持続)\n\n':'**Scenario Types**: ① Smoke (1VU) → ② Load (expected peak) → ③ Stress (breaking point) → ④ Soak (24h sustained)\n\n');

  S.files['docs/33_test_matrix.md']=doc33;

  // ═══ B1: docs/34_incident_response.md (~10KB) ═══
  let doc34='# '+(G?'インシデント対応プレイブック':'Incident Response Playbook')+'\n\n';
  doc34+=G?'**重要**: このプレイブックは本番障害発生時の対応手順を定義します。全メンバーは事前にこの手順を理解し、障害発生時は冷静に実行してください。\n\n':'**IMPORTANT**: This playbook defines incident response procedures for production outages. All team members MUST understand these procedures beforehand and execute calmly during incidents.\n\n';

  // Severity Classification
  doc34+=(G?'## Severity分類':'## Severity Classification')+'\n\n';
  doc34+='| Severity | '+(G?'定義':'Definition')+' | '+(G?'対応時間':'Response Time')+' | '+(G?'具体例 ('+domain+')':'Examples ('+domain+')')+' |\n';
  doc34+='|----------|------|------|------|\n';

  // Domain-specific examples
  const s1Ex={
    ec:G?'決済処理停止':'Payment processing down',
    fintech:G?'残高不整合・取引停止':'Balance inconsistency, trading halt',
    health:G?'患者データ消失':'Patient data loss',
    education:G?'試験データ消失':'Exam data loss',
    saas:G?'全サービス停止':'Complete service outage',
    community:G?'個人情報漏洩':'Personal data breach',
    booking:G?'予約システム停止':'Booking system down',
    marketplace:G?'取引決済停止':'Transaction payment down',
    iot:G?'全デバイス接続断':'All devices disconnected',
    realestate:G?'契約データ消失':'Contract data loss',
    legal:G?'機密情報漏洩':'Confidential data breach',
    hr:G?'給与データ漏洩':'Payroll data breach',
    travel:G?'予約システム停止・重複予約大量発生':'Booking system down, mass duplicate reservations',
    government:G?'個人情報漏洩・申請データ消失':'Personal data breach, application data loss',
    insurance:G?'保険証券データ消失・クレーム処理停止':'Policy data loss, claims processing halted',
    manufacturing:G?'生産管理システム全停止':'Production management system down',
    logistics:G?'配送追跡停止・荷物紛失データ':'Tracking system down, parcel loss data',
    media:G?'コンテンツ配信全停止・DRM漏洩':'Content delivery halted, DRM breach',
    gamify:G?'ポイントデータ不整合・ランキング消失':'Point data corruption, leaderboard lost',
    collab:G?'ドキュメントデータ消失・バージョン破損':'Document data loss, version corruption',
    creator:G?'収益データ消失・支払い停止':'Revenue data loss, payment halted',
    analytics:G?'集計データ消失・ダッシュボード停止':'Aggregated data loss, dashboard down',
    event:G?'チケット二重販売・決済停止':'Duplicate ticket sales, payment halted'
  }[domain]||(G?'サービス全停止':'Complete service down');

  const s2Ex={
    ec:G?'カート機能障害':'Cart malfunction',
    fintech:G?'一部取引遅延':'Partial transaction delays',
    health:G?'予約機能障害':'Appointment feature down',
    education:G?'動画再生不可':'Video playback failure',
    saas:G?'主要機能停止':'Core feature down',
    community:G?'投稿機能停止':'Post feature down',
    booking:G?'通知送信失敗':'Notification delivery failure',
    iot:G?'一部デバイス障害':'Partial device failures',
    fintech:G?'一部取引遅延':'Partial transaction delays',
    realestate:G?'内見予約機能停止':'Viewing booking feature down',
    legal:G?'文書検索機能障害':'Document search malfunction',
    hr:G?'勤怠記録機能停止':'Attendance recording down',
    marketplace:G?'商品検索停止':'Product search down',
    travel:G?'空き室検索停止':'Availability search down',
    government:G?'申請受付機能停止':'Application submission down',
    insurance:G?'見積もり機能障害':'Quote generation failure',
    manufacturing:G?'品質記録機能停止':'Quality record entry down',
    logistics:G?'配送ルート計算障害':'Route calculation failure',
    media:G?'ストリーミング品質劣化':'Streaming quality degraded',
    gamify:G?'ポイント付与遅延':'Point reward delays',
    collab:G?'リアルタイム同期停止':'Real-time sync halted',
    creator:G?'コンテンツ配信停止':'Content delivery down',
    event:G?'チケット予約機能停止':'Ticket booking down'
  }[domain]||(G?'主要機能停止':'Core feature down');

  const s3Ex={
    ec:G?'検索精度低下':'Search accuracy degraded',
    saas:G?'パフォーマンス低下':'Performance degradation',
    education:G?'レスポンス遅延':'Response delays',
    health:G?'グラフ表示遅延':'Chart rendering slow',
    fintech:G?'レポート生成遅延':'Report generation delays',
    booking:G?'カレンダー表示遅延':'Calendar rendering slow',
    community:G?'フィード読み込み遅延':'Feed loading slow',
    marketplace:G?'商品一覧表示遅延':'Product listing slow',
    iot:G?'センサーデータ遅延':'Sensor data delay',
    travel:G?'検索結果表示遅延':'Search results slow',
    government:G?'申請フォーム表示遅延':'Application form slow',
    insurance:G?'証券一覧表示遅延':'Policy list slow',
    manufacturing:G?'生産レポート表示遅延':'Production report slow',
    collab:G?'ドキュメント読み込み遅延':'Document loading slow',
    gamify:G?'ランキング更新遅延':'Leaderboard update slow',
    media:G?'メタデータ取得遅延':'Metadata fetch slow'
  }[domain]||(G?'性能劣化':'Performance degradation');

  const s4Ex=G?'軽微なUI不具合':'Minor UI glitch';

  doc34+='| S1 🔴 | '+(G?'サービス停止・データ損失':'Service down, data loss')+' | '+( G?'15分以内':'≤15 min')+' | '+s1Ex+' |\n';
  doc34+='| S2 🟠 | '+(G?'主要機能停止':'Core feature down')+' | '+(G?'1時間以内':'≤1 hour')+' | '+s2Ex+' |\n';
  doc34+='| S3 🟡 | '+(G?'性能劣化':'Performance degraded')+' | '+(G?'24時間以内':'≤24 hours')+' | '+s3Ex+' |\n';
  doc34+='| S4 🟢 | '+(G?'軽微な不具合':'Minor bug')+' | '+(G?'次回リリース':'Next release')+' | '+s4Ex+' |\n\n';

  // Runbook Template
  doc34+=(G?'## Runbookテンプレート':'## Runbook Template')+'\n\n';
  doc34+=(G?'### 1. 検知 (Detection)':'### 1. Detection')+'\n\n';
  doc34+='- **'+(G?'アラート':'Alert')+'**: '+(G?'監視ツール（CloudWatch/Datadog/Sentry）からアラート受信':'Receive alert from monitoring tool (CloudWatch/Datadog/Sentry)')+'\n';
  doc34+='- **'+(G?'確認':'Verify')+'**: '+(G?'ダッシュボードでメトリクス確認':'Check metrics on dashboard')+'\n';
  doc34+='- **'+(G?'影響範囲特定':'Scope')+'**: '+(G?'全ユーザー or 特定機能 or 特定リージョン':'All users / specific feature / specific region')+'\n\n';

  doc34+=(G?'### 2. トリアージ (Triage)':'### 2. Triage')+'\n\n';
  doc34+='- **Severity'+(G?'判定':'Classification')+'**: '+(G?'上記分類表に基づき判定':'Classify based on table above')+'\n';
  doc34+='- **'+(G?'初動':'Initial Action')+'**: S1/S2'+(G?'は即座にインシデントチャネル開設':'→ Open incident channel immediately')+'\n';
  doc34+='- **'+(G?'担当者招集':'Assemble Team')+'**: '+(G?'オンコール担当 + バックエンド + インフラ':'On-call + Backend + Infra')+'\n\n';

  doc34+=(G?'### 3. 緩和 (Mitigation)':'### 3. Mitigation')+'\n\n';
  doc34+='**'+(G?'優先順位':'Priority')+'**: '+(G?'復旧 > 原因究明':'Recovery > Root cause analysis')+'\n\n';
  doc34+=(G?'緩和策の例:':'Mitigation examples:')+'\n';
  doc34+='- '+(G?'ロールバック: 直近デプロイが原因の場合':'Rollback: If caused by recent deploy')+'\n';
  doc34+='- '+(G?'スケールアップ: リソース不足の場合':'Scale up: If resource exhaustion')+'\n';
  doc34+='- '+(G?'機能無効化: 特定機能が原因の場合':'Disable feature: If specific feature causes issue')+'\n';
  doc34+='- '+(G?'キャッシュクリア: データ不整合の場合':'Clear cache: If data inconsistency')+'\n';
  doc34+='- '+(G?'手動データ修正: DB不整合の場合':'Manual data fix: If DB inconsistency')+'\n\n';

  doc34+=(G?'### 4. 根本原因分析 (Root Cause Analysis)':'### 4. Root Cause Analysis')+'\n\n';
  doc34+=(G?'復旧後に実施:':'After recovery:')+'\n';
  doc34+='- **'+(G?'ログ分析':'Log Analysis')+'**: docs/25_error_logs.md'+(G?'に記録':'に記録')+'\n';
  doc34+='- **5 Whys**: '+(G?'根本原因まで深掘り':'Dig deep until root cause')+'\n';
  doc34+='- **'+(G?'タイムライン作成':'Timeline')+'**: '+(G?'発生→検知→対応→復旧の時系列':'Occurrence → Detection → Response → Recovery')+'\n\n';

  doc34+=(G?'### 5. 再発防止 (Prevention)':'### 5. Prevention')+'\n\n';
  doc34+='- **'+(G?'修正チケット作成':'Fix Ticket')+'**: .spec/tasks.md'+(G?'に追加':'に追加')+'\n';
  doc34+='- **'+(G?'監視追加':'Add Monitoring')+'**: '+(G?'同様の障害を早期検知できるアラート追加':'Add alerts to detect similar issues early')+'\n';
  doc34+='- **'+(G?'テスト追加':'Add Tests')+'**: docs/33_test_matrix.md'+(G?'にリグレッションテスト追加':'に追加')+'\n';
  doc34+='- **'+(G?'ドキュメント更新':'Update Docs')+'**: '+(G?'本プレイブックに新たな対処法追加':'Add new procedures to this playbook')+'\n\n';

  // Escalation Matrix
  doc34+=(G?'## エスカレーションマトリクス':'## Escalation Matrix')+'\n\n';
  doc34+='| Severity | '+  (G?'初動（分）':'Initial (min)')+' | '+(G?'エスカレーション（分）':'Escalation (min)')+' | '+(G?'通知先':'Notify')+' |\n';
  doc34+='|----------|------|------|------|\n';
  doc34+='| S1 🔴 | 15 | 30 | '+(G?'CTO + 全エンジニア':'CTO + All engineers')+' |\n';
  doc34+='| S2 🟠 | 60 | 120 | '+(G?'テックリード + 該当チーム':'Tech lead + Relevant team')+' |\n';
  doc34+='| S3 🟡 | 1440 (24h) | - | '+(G?'担当者のみ':'Assignee only')+' |\n';
  doc34+='| S4 🟢 | - | - | '+(G?'次回計画会議で':'Next planning meeting')+' |\n\n';

  // Post-Mortem Template
  doc34+=(G?'## ポストモーテムテンプレート':'## Post-Mortem Template')+'\n\n';
  doc34+='```markdown\n';
  doc34+='# '+(G?'ポストモーテム: [障害タイトル]':'Post-Mortem: [Incident Title]')+'\n\n';
  doc34+='**'+(G?'発生日時':'Date')+'**: YYYY-MM-DD HH:MM\n';
  doc34+='**Severity**: S1/S2/S3/S4\n';
  doc34+='**'+(G?'影響':'Impact')+'**: '+(G?'影響を受けたユーザー数・機能':'Affected users, features')+'\n';
  doc34+='**'+(G?'検知→復旧時間':'Detection to Recovery')+'**: XX'+(G?'分':'min')+'\n\n';
  doc34+='## '+(G?'何が起きたか':'What Happened')+'\n'+(G?'障害の概要を1-2文で':'1-2 sentence summary')+'\n\n';
  doc34+='## '+(G?'タイムライン':'Timeline')+'\n';
  doc34+='- HH:MM - '+(G?'障害発生':'Incident occurred')+'\n';
  doc34+='- HH:MM - '+(G?'アラート検知':'Alert detected')+'\n';
  doc34+='- HH:MM - '+(G?'対応開始':'Response started')+'\n';
  doc34+='- HH:MM - '+(G?'復旧完了':'Recovery completed')+'\n\n';
  doc34+='## '+(G?'根本原因':'Root Cause')+'\n'+(G?'5 Whysの結果':'Result of 5 Whys')+'\n\n';
  doc34+='## '+(G?'再発防止策':'Prevention Measures')+'\n';
  doc34+='- [ ] '+(G?'アクションアイテム1':'Action item 1')+'\n';
  doc34+='- [ ] '+(G?'アクションアイテム2':'Action item 2')+'\n';
  doc34+='```\n\n';

  // Domain-Specific Runbooks
  const domainPlaybook=DOMAIN_PLAYBOOK[domain]||DOMAIN_PLAYBOOK._default;
  if(domainPlaybook&&domainPlaybook.prevent_ja){
    doc34+=(G?'## ドメイン固有の注意事項 ('+domain+')':'## Domain-Specific Notes ('+domain+')')+'\n\n';
    const preventList=G?domainPlaybook.prevent_ja:domainPlaybook.prevent_en;
    preventList.forEach((p,i)=>{
      doc34+=(i+1)+'. '+p+'\n';
    });
    doc34+='\n';
  }

  // Link to error logs
  doc34+=(G?'## 関連ドキュメント':'## Related Documents')+'\n\n';
  doc34+='- **docs/25_error_logs.md** — '+(G?'過去の障害記録':'Past incident records')+'\n';
  doc34+='- **docs/37_bug_prevention.md** — '+(G?'バグ予防チェックリスト':'Bug prevention checklist')+'\n';
  doc34+='- **.spec/verification.md** — '+(G?'リリース前検証手順':'Pre-release verification')+'\n\n';

  S.files['docs/34_incident_response.md']=doc34;

  // ═══ B3: docs/36_test_strategy.md (~12KB) ═══
  let doc36='# '+(G?'フェーズ別テスト戦略':'Phase-Based Testing Strategy')+'\n\n';
  doc36+=G?'**重要**: このドキュメントは開発フェーズごとのテスト戦略を定義します。各フェーズで必要なテストを実施し、品質を段階的に向上させてください。\n\n':'**IMPORTANT**: This document defines testing strategies for each development phase. Execute required tests at each phase to progressively improve quality.\n\n';

  // Phase 1: Design Review
  doc36+=(G?'## Phase 1: 設計レビュー':'## Phase 1: Design Review')+'\n\n';
  doc36+=(G?'**目的**: 実装前に設計の整合性とセキュリティリスクを検証':'**Purpose**: Verify design consistency and security risks before implementation')+'\n\n';

  doc36+='### 1.1 '+(G?'.spec/ 整合性チェック':'.spec/ Consistency Check')+'\n\n';
  doc36+='**'+(G?'検証項目':'Checks')+'**:\n';
  doc36+='- [ ] constitution.md ⇔ specification.md '+(G?'の機能一致':'feature alignment')+'\n';
  doc36+='- [ ] specification.md ⇔ technical-plan.md '+(G?'のスタック一致':'stack alignment')+'\n';
  doc36+='- [ ] tasks.md '+(G?'の全タスクがspecに対応':'all tasks map to spec')+'\n';
  doc36+='- [ ] verification.md '+(G?'の検証項目が全機能をカバー':'verification covers all features')+'\n\n';

  doc36+='### 1.2 ER'+(G?'図検証':'Diagram Verification')+'\n\n';
  doc36+='**'+(G?'検証項目':'Checks')+'**:\n';
  doc36+='- [ ] '+(G?'全エンティティがdata_entitiesに存在':'All entities exist in data_entities')+'\n';
  doc36+='- [ ] FK'+(G?'参照先が全て定義済み':'references are all defined')+'\n';
  doc36+='- [ ] '+(G?'循環参照がない':'No circular references')+'\n';
  doc36+='- [ ] '+(G?'孤立エンティティがない':'No orphaned entities')+'\n\n';

  doc36+='### 1.3 '+(G?'セキュリティ脅威モデル':'Security Threat Modeling')+'\n\n';
  doc36+='**'+(G?'実施内容':'Activities')+'**:\n';
  doc36+='- **STRIDE'+(G?'分析':'Analysis')+'**: '+(G?'なりすまし・改ざん・否認・情報漏洩・DoS・権限昇格':'Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation')+'\n';
  doc36+='- **OWASP Top 10**: docs/08_security.md '+(G?'と照合':'check against')+'\n';
  doc36+='- **'+(G?'データフロー図':'Data Flow Diagram')+'**: '+(G?'機密データの経路確認':'Verify sensitive data paths')+'\n\n';

  // Phase 2: Integration Testing
  doc36+=(G?'## Phase 2: 統合テスト':'## Phase 2: Integration Testing')+'\n\n';
  doc36+=(G?'**目的**: API・認証・データフローの統合動作を検証':'**Purpose**: Verify integrated behavior of API, auth, and data flows')+'\n\n';

  doc36+='### 2.1 API'+(G?'コントラクトテスト':'Contract Testing')+'\n\n';
  doc36+='**'+(G?'ツール':'Tool')+'**: '+( tools.find(t=>t.includes('Pact')||t.includes('契約'))||'Pact / Contract tests')+'\n\n';
  doc36+='**'+(G?'検証項目':'Checks')+'**:\n';
  doc36+='- [ ] '+(G?'全エンドポイントがdocs/05_api_design.mdに存在':'All endpoints exist in docs/05_api_design.md')+'\n';
  doc36+='- [ ] '+(G?'リクエスト・レスポンススキーマ一致':'Request/response schema match')+'\n';
  doc36+='- [ ] '+(G?'エラーコードが仕様通り':'Error codes match spec')+'\n\n';

  const authBackend=a.backend||'';
  const authFlow=authBackend.includes('Supabase')?'Supabase Auth':authBackend.includes('Firebase')?'Firebase Auth':'Auth.js';
  doc36+='### 2.2 '+(G?'認証フローテスト ('+authFlow+')':'Auth Flow Testing ('+authFlow+')')+'\n\n';
  doc36+='**'+(G?'テストケース':'Test Cases')+'**:\n';
  doc36+='- [ ] '+(G?'サインアップ → メール確認 → ログイン':'Signup → Email verify → Login')+'\n';
  doc36+='- [ ] '+(G?'パスワードリセット':'Password reset')+'\n';
  doc36+='- [ ] '+(G?'トークン有効期限切れ → リフレッシュ':'Token expiry → Refresh')+'\n';
  if(authBackend.includes('Supabase')){
    doc36+='- [ ] RLS'+(G?'ポリシーが全テーブルで動作':'policies work on all tables')+'\n';
  }
  doc36+='- [ ] '+(G?'不正トークンでアクセス拒否':'Invalid token → Access denied')+'\n\n';

  doc36+='### 2.3 '+(G?'データ整合性テスト':'Data Integrity Testing')+'\n\n';
  doc36+='**'+(G?'検証項目':'Checks')+'**:\n';
  doc36+='- [ ] FK'+(G?'違反時にエラー':'violation → Error')+'\n';
  doc36+='- [ ] UNIQUE'+(G?'制約違反時にエラー':'constraint violation → Error')+'\n';
  doc36+='- [ ] '+(G?'カスケード削除が正しく動作':'Cascade delete works correctly')+'\n';
  doc36+='- [ ] '+(G?'トランザクション失敗時にロールバック':'Transaction failure → Rollback')+'\n\n';

  // Phase 3: Pre-Release Testing
  doc36+=(G?'## Phase 3: リリース前テスト':'## Phase 3: Pre-Release Testing')+'\n\n';
  doc36+=(G?'**目的**: 本番環境で発生しうる問題を事前検出':'**Purpose**: Detect issues that could occur in production')+'\n\n';

  doc36+='### 3.1 E2E'+(G?'シナリオテスト':'Scenario Testing')+'\n\n';
  doc36+='**'+(G?'ツール':'Tool')+'**: '+(tools.find(t=>t.includes('Playwright')||t.includes('Cypress'))||'Playwright / Cypress')+'\n\n';
  doc36+='**'+(G?'主要シナリオ':'Critical Scenarios')+'**:\n';
  features.slice(0,5).forEach((f,i)=>{
    doc36+=(i+1)+'. '+f+' '+(G?'の完全フロー':'complete flow')+'\n';
  });
  doc36+='\n';

  doc36+='### 3.2 '+(G?'並行性テスト':'Concurrency Testing')+'\n\n';
  doc36+='**'+(G?'シナリオ':'Scenarios')+'**:\n';
  // Domain-specific concurrency scenarios
  if(domain==='ec'||domain==='marketplace'){
    doc36+='- [ ] '+(G?'最後の1個問題: 2人が同時に最後の在庫を購入':'Last item problem: 2 users buy last stock simultaneously')+'\n';
  }
  if(domain==='fintech'){
    doc36+='- [ ] '+(G?'二重送金: 同一送金リクエストを2回送信':'Double payment: Send same payment request twice')+'\n';
  }
  if(domain==='booking'||domain==='realestate'){
    doc36+='- [ ] '+(G?'ダブルブッキング: 同一時間帯に2件予約':'Double booking: 2 bookings for same time slot')+'\n';
  }
  doc36+='- [ ] '+(G?'楽観的ロック: バージョン競合時の処理':'Optimistic lock: Version conflict handling')+'\n';
  doc36+='- [ ] '+(G?'デッドロック: 複数トランザクション衝突':'Deadlock: Multiple transaction collision')+'\n\n';

  doc36+='### 3.3 '+(G?'パフォーマンスベンチマーク':'Performance Benchmarking')+'\n\n';
  doc36+='**'+(G?'ツール':'Tool')+'**: k6 / Artillery / Locust\n\n';
  doc36+='**'+(G?'ベンチマーク目標':'Benchmark Targets')+'**:\n';
  doc36+='- **'+(G?'レスポンスタイム':'Response Time')+'**: P95 ≤ 500ms\n';
  doc36+='- **'+(G?'スループット':'Throughput')+'**: ≥ 100 req/sec\n';
  doc36+='- **'+(G?'同時接続':'Concurrent Users')+'**: 1000+ '+(G?'ユーザーで安定':'users stable')+'\n';
  doc36+='- **'+(G?'エラー率':'Error Rate')+'**: ≤ 0.1%\n\n';

  // Phase 4: Post-Release Monitoring
  doc36+=(G?'## Phase 4: リリース後監視':'## Phase 4: Post-Release Monitoring')+'\n\n';
  doc36+=(G?'**目的**: 本番環境での異常を早期検知':'**Purpose**: Early detection of anomalies in production')+'\n\n';

  doc36+='### 4.1 '+(G?'インシデント検知閾値':'Incident Detection Thresholds')+'\n\n';
  doc36+='| '+(G?'メトリクス':'Metric')+' | '+(G?'警告':'Warning')+' | '+(G?'重大':'Critical')+' |\n';
  doc36+='|----------|----------|----------|\n';
  doc36+='| '+(G?'エラー率':'Error Rate')+' | >1% | >5% |\n';
  doc36+='| P95 '+(G?'レスポンス':'Response')+' | >1s | >3s |\n';
  doc36+='| CPU'+(G?'使用率':'Usage')+' | >70% | >90% |\n';
  doc36+='| '+(G?'メモリ':'Memory')+' | >80% | >95% |\n';
  doc36+='| DB'+(G?'接続数':'Connections')+' | >80% | >95% |\n\n';

  doc36+='### 4.2 '+(G?'回帰アラート':'Regression Alerts')+'\n\n';
  doc36+='**'+(G?'監視項目':'Monitor')+'**:\n';
  doc36+='- **'+(G?'エラースパイク':'Error Spike')+'**: '+(G?'直近1時間のエラー数が前週平均の3倍':'Errors in last hour >3x weekly average')+'\n';
  doc36+='- **'+(G?'レイテンシ劣化':'Latency Degradation')+'**: P95 '+(G?'が前日比1.5倍':'is 1.5x vs yesterday')+'\n';
  doc36+='- **'+(G?'コンバージョン低下':'Conversion Drop')+'**: '+(G?'主要KPIが前週比20%低下':'Key KPI down 20% vs last week')+'\n\n';

  doc36+='### 4.3 '+(G?'ドメイン別監視 ('+domain+')':'Domain-Specific Monitoring ('+domain+')')+'\n\n';
  // Domain-specific monitoring
  if(domain==='ec'||domain==='marketplace'){
    doc36+='- **'+(G?'決済成功率':'Payment Success Rate')+'**: ≥98%\n';
    doc36+='- **'+(G?'カゴ落ち率':'Cart Abandonment')+'**: ≤30%\n';
  }else if(domain==='fintech'){
    doc36+='- **'+(G?'取引処理時間':'Transaction Processing Time')+'**: ≤2s\n';
    doc36+='- **'+(G?'残高不整合':'Balance Inconsistency')+'**: 0 件/日\n';
  }else if(domain==='booking'||domain==='realestate'){
    doc36+='- **'+(G?'予約重複':'Booking Duplicates')+'**: 0 件/日\n';
    doc36+='- **'+(G?'通知到達率':'Notification Delivery')+'**: ≥95%\n';
  }else if(domain==='iot'){
    doc36+='- **'+(G?'デバイス接続率':'Device Connection Rate')+'**: ≥99%\n';
    doc36+='- **'+(G?'データ欠損':'Data Loss')+'**: ≤0.1%\n';
  }else{
    doc36+='- **'+(G?'主要機能可用性':'Core Feature Availability')+'**: ≥99.9%\n';
    doc36+='- **'+(G?'ユーザーエラー報告':'User Error Reports')+'**: '+(G?'月次トレンド監視':'Monitor monthly trend')+'\n';
  }
  doc36+='\n';

  // ── KPI Regression Testing (P5-P10 Feedback Loop) ──
  doc36+='### 4.4 '+(G?'KPIリグレッションテスト':'KPI Regression Testing')+'\n\n';
  doc36+=(G?'**重要**: docs/29_reverse_engineering.md で定義されたゴールKPIを継続的に監視し、リリース後もゴール達成度を追跡してください。\n\n':'**IMPORTANT**: Continuously monitor goal KPIs defined in docs/29_reverse_engineering.md and track goal achievement post-release.\n\n');

  // Access REVERSE_FLOW_MAP if available (loaded from p10-reverse.js)
  if(typeof REVERSE_FLOW_MAP!=='undefined'){
    const flowMap=REVERSE_FLOW_MAP[domain]||REVERSE_FLOW_MAP._default;
    const kpis=G?flowMap.kpi_ja:flowMap.kpi_en;
    doc36+='**'+(G?'監視対象KPI':'KPIs to Monitor')+'** ('+(G?'docs/29から':'from docs/29')+'):\n';
    kpis.forEach((kpi,i)=>{
      doc36+=(i+1)+'. '+kpi+'\n';
    });
    doc36+='\n';
  }else{
    // Fallback if REVERSE_FLOW_MAP not available
    doc36+='**'+(G?'監視対象KPI':'KPIs to Monitor')+'**: '+(G?'docs/29_reverse_engineering.md 参照':'See docs/29_reverse_engineering.md')+'\n\n';
  }

  doc36+='**'+(G?'テスト頻度':'Test Frequency')+'**: '+(G?'週次':'Weekly')+'\n';
  doc36+='**'+(G?'アラート条件':'Alert Condition')+'**: '+(G?'目標値から20%以上乖離':'Deviation >20% from target')+'\n';
  doc36+='**'+(G?'対応フロー':'Response Flow')+'**:\n';
  doc36+='1. '+(G?'KPI乖離検出 → docs/25_error_logs.md に記録':'KPI deviation detected → Log in docs/25_error_logs.md')+'\n';
  doc36+='2. '+(G?'原因分析 (5 Whys) → 根本原因特定':'Root cause analysis (5 Whys)')+'\n';
  doc36+='3. '+(G?'改善施策実施 → docs/30_goal_decomposition.md のギャップマトリクス更新':'Implement improvements → Update gap matrix in docs/30_goal_decomposition.md')+'\n';
  doc36+='4. '+(G?'効果測定 → KPI回復確認':'Measure impact → Verify KPI recovery')+'\n\n';

  doc36+='**'+(G?'相互参照':'Cross-References')+'**:\n';
  doc36+='- **docs/29_reverse_engineering.md** — '+(G?'ゴールKPI定義':'Goal KPI definitions')+'\n';
  doc36+='- **docs/30_goal_decomposition.md** — '+(G?'ギャップ分析マトリクス':'Gap analysis matrix')+'\n';
  doc36+='- **docs/24_progress.md** — '+(G?'進捗トラッキング':'Progress tracking')+'\n\n';

  // Stack-Specific Tool Configuration
  doc36+=(G?'## スタック別ツール設定':'## Stack-Specific Tool Configuration')+'\n\n';
  const testTool=tools.find(t=>t.includes('Vitest'))?'Vitest':tools.find(t=>t.includes('Jest'))?'Jest':'Vitest';
  const e2eTool=tools.find(t=>t.includes('Playwright'))?'Playwright':tools.find(t=>t.includes('Cypress'))?'Cypress':'Playwright';

  doc36+='### '+testTool+' '+(G?'設定':'Configuration')+'\n\n';
  doc36+='```javascript\n';
  doc36+='// vitest.config.js / jest.config.js\n';
  doc36+='export default {\n';
  doc36+='  coverage: {\n';
  doc36+='    provider: \'v8\',\n';
  doc36+='    reporter: [\'text\', \'json\', \'html\'],\n';
  doc36+='    lines: 80,\n';
  doc36+='    functions: 85,\n';
  doc36+='    branches: 70,\n';
  doc36+='    statements: 80,\n';
  doc36+='  },\n';
  doc36+='  testTimeout: 10000,\n';
  doc36+='};\n```\n\n';

  doc36+='### '+e2eTool+' '+(G?'設定':'Configuration')+'\n\n';
  doc36+='```javascript\n';
  if(e2eTool==='Playwright'){
    doc36+='// playwright.config.js\n';
    doc36+='export default {\n';
    doc36+='  testDir: \'./e2e\',\n';
    doc36+='  timeout: 30000,\n';
    doc36+='  retries: process.env.CI ? 2 : 0,\n';
    doc36+='  use: {\n';
    doc36+='    baseURL: process.env.BASE_URL || \'http://localhost:3000\',\n';
    doc36+='    trace: \'on-first-retry\',\n';
    doc36+='  },\n';
    doc36+='};\n';
  }else{
    doc36+='// cypress.config.js\n';
    doc36+='export default {\n';
    doc36+='  e2e: {\n';
    doc36+='    baseUrl: \'http://localhost:3000\',\n';
    doc36+='    video: false,\n';
    doc36+='    screenshotOnRunFailure: true,\n';
    doc36+='  },\n';
    doc36+='};\n';
  }
  doc36+='```\n\n';

  // Related Documents
  doc36+=(G?'## 関連ドキュメント':'## Related Documents')+'\n\n';
  doc36+='- **docs/07_test_cases.md** — '+(G?'テストケース詳細':'Detailed test cases')+'\n';
  doc36+='- **docs/33_test_matrix.md** — '+(G?'具体的テスト例':'Concrete test examples')+'\n';
  doc36+='- **docs/37_bug_prevention.md** — '+(G?'バグ予防チェックリスト':'Bug prevention checklist')+'\n';
  doc36+='- **.spec/verification.md** — '+(G?'リリース前検証':'Pre-release verification')+'\n\n';

  S.files['docs/36_test_strategy.md']=doc36;

  // ═══ B4: docs/37_bug_prevention.md (~8KB) ═══
  let doc37='# '+(G?'バグ予防チェックリスト':'Bug Prevention Checklist')+'\n\n';
  doc37+=G?'**重要**: このチェックリストは、実装・レビュー・テスト時に必ず確認すべき項目をリスト化しています。見落としを防ぎ、品質を向上させるために活用してください。\n\n':'**IMPORTANT**: This checklist lists items that MUST be verified during implementation, review, and testing. Use this to prevent oversights and improve quality.\n\n';

  // Priority-Ordered Checklist (based on INDUSTRY_TEST_MATRIX.priority)
  doc37+=(G?'## 優先度順チェックリスト ('+domain+'に最適化)':'## Priority-Ordered Checklist (Optimized for '+domain+')')+'\n\n';
  const priorityOrder=['Security','DataIntegrity','Performance','UX','Compliance'];
  const domainPriority={};
  tm.priority.split('|').forEach(p=>{
    const[k,v]=p.split(':');
    domainPriority[k]=v;
  });
  // Sort by priority (CRITICAL > HIGH > MED > LOW)
  const sortedPriorities=priorityOrder.sort((a,b)=>{
    const order={CRITICAL:0,HIGH:1,MED:2,LOW:3};
    return order[domainPriority[a]||'MED']-order[domainPriority[b]||'MED'];
  });

  sortedPriorities.forEach((cat,idx)=>{
    const priority=domainPriority[cat]||'MED';
    const icon=priority==='CRITICAL'||priority==='HIGH'?'🔴':(priority==='MED'?'🟡':'🟢');
    const label={
      Security:G?'セキュリティ':'Security',
      DataIntegrity:G?'データ整合性':'Data Integrity',
      Performance:G?'パフォーマンス':'Performance',
      UX:'UX',
      Compliance:G?'コンプライアンス':'Compliance'
    }[cat];

    doc37+='### '+(idx+1)+'. '+icon+' '+label+' ('+priority+')\n\n';

    if(cat==='Security'){
      doc37+='- [ ] '+(G?'ユーザー入力は全てサニタイズ済み':'All user inputs sanitized')+'\n';
      doc37+='- [ ] SQL'+(G?'インジェクション対策（ORMのパラメタライズドクエリ使用）':'injection prevention (use ORM parameterized queries)')+'\n';
      doc37+='- [ ] XSS'+(G?'対策（出力時エスケープ）':'prevention (escape on output)')+'\n';
      doc37+='- [ ] CSRF'+(G?'トークン実装':'token implemented')+'\n';
      doc37+='- [ ] '+(G?'認証なしでアクセスできるエンドポイントがない':'No unauthenticated endpoint access')+'\n';
      doc37+='- [ ] '+(G?'パスワードはハッシュ化（bcrypt/Argon2）':'Passwords hashed (bcrypt/Argon2)')+'\n';
      doc37+='- [ ] '+(G?'環境変数に機密情報なし（.envから読込）':'No secrets in code (load from .env)')+'\n';
    }else if(cat==='DataIntegrity'){
      doc37+='- [ ] FK'+(G?'制約が全て定義済み':'constraints all defined')+'\n';
      doc37+='- [ ] UNIQUE'+(G?'制約が適切に設定':'constraints properly set')+'\n';
      doc37+='- [ ] NOT NULL'+(G?'制約が必須フィールドに設定':'constraints on required fields')+'\n';
      doc37+='- [ ] '+(G?'トランザクション境界が明確':'Transaction boundaries clear')+'\n';
      doc37+='- [ ] '+(G?'楽観的/悲観的ロックが必要箇所に実装':'Optimistic/pessimistic locks where needed')+'\n';
      doc37+='- [ ] '+(G?'カスケード削除が意図通り':'Cascade deletes work as intended')+'\n';
    }else if(cat==='Performance'){
      doc37+='- [ ] N+1'+(G?'クエリ問題がない':'query problem eliminated')+'\n';
      doc37+='- [ ] '+(G?'インデックスが検索フィールドに設定':'Indexes on search fields')+'\n';
      doc37+='- [ ] '+(G?'ページネーション実装（大量データ対応）':'Pagination for large datasets')+'\n';
      doc37+='- [ ] '+(G?'キャッシュ戦略が適切':'Caching strategy appropriate')+'\n';
      doc37+='- [ ] '+(G?'画像・動画は最適化済み':'Images/videos optimized')+'\n';
    }else if(cat==='UX'){
      doc37+='- [ ] '+(G?'ローディング状態表示':'Loading state displayed')+'\n';
      doc37+='- [ ] '+(G?'エラーメッセージがユーザーフレンドリー':'User-friendly error messages')+'\n';
      doc37+='- [ ] '+(G?'バリデーションメッセージが具体的':'Specific validation messages')+'\n';
      doc37+='- [ ] '+(G?'空状態メッセージ（データなし時）':'Empty state message (no data)')+'\n';
      doc37+='- [ ] '+(G?'モバイルレスポンシブ':'Mobile responsive')+'\n';
    }else if(cat==='Compliance'){
      doc37+='- [ ] '+(G?'個人情報取扱い同意取得':'Personal data consent obtained')+'\n';
      doc37+='- [ ] '+(G?'データ削除機能実装（GDPR対応）':'Data deletion feature (GDPR)')+'\n';
      doc37+='- [ ] '+(G?'アクセスログ記録':'Access logging')+'\n';
      doc37+='- [ ] '+(G?'監査証跡完全性':'Audit trail completeness')+'\n';
    }
    doc37+='\n';
  });

  // 6-Category Bug Classification
  doc37+=(G?'## 6カテゴリバグ分類':'## 6-Category Bug Classification')+'\n\n';
  const bugCategories=[
    {ja:'機能バグ',en:'Functional',check_ja:'仕様通り動作するか',check_en:'Works as specified'},
    {ja:'UI/UXバグ',en:'UI/UX',check_ja:'見た目・操作性に問題ないか',check_en:'Appearance and usability OK'},
    {ja:'データバグ',en:'Data',check_ja:'データ不整合・消失がないか',check_en:'No data inconsistency or loss'},
    {ja:'パフォーマンスバグ',en:'Performance',check_ja:'レスポンス時間が許容範囲か',check_en:'Response time acceptable'},
    {ja:'セキュリティバグ',en:'Security',check_ja:'脆弱性がないか',check_en:'No vulnerabilities'},
    {ja:'統合バグ',en:'Integration',check_ja:'外部サービス連携が正常か',check_en:'External service integration OK'}
  ];
  bugCategories.forEach((cat,i)=>{
    const label=G?cat.ja:cat.en;
    const check=G?cat.check_ja:cat.check_en;
    doc37+='### '+(i+1)+'. '+label+'\n';
    doc37+='**'+(G?'チェック':'Check')+'**: '+check+'\n';
    doc37+='**'+(G?'検出方法':'Detection')+'**: ';
    if(i<2){
      doc37+=G?'単体テスト・E2Eテスト':'Unit tests, E2E tests';
    }else if(i<4){
      doc37+=G?'統合テスト・手動検証':'Integration tests, manual verification';
    }else{
      doc37+=G?'静的解析・ペネトレーションテスト':'Static analysis, penetration tests';
    }
    doc37+='\n';
    doc37+='**'+(G?'予防策':'Prevention')+'**: ';
    if(i<2){
      doc37+=G?'仕様レビュー・プロトタイプ検証':'Spec review, prototype validation';
    }else if(i<4){
      doc37+=G?'コードレビュー・TDD実践':'Code review, TDD practice';
    }else{
      doc37+=G?'セキュリティガイドライン遵守':'Follow security guidelines';
    }
    doc37+='\n\n';
  });

  // Concurrency Scenarios (Domain-Specific)
  doc37+=(G?'## 並行性シナリオ ('+domain+'特化)':'## Concurrency Scenarios ('+domain+'-Specific)')+'\n\n';
  if(domain==='ec'||domain==='marketplace'){
    doc37+='### 1. '+(G?'最後の1個問題':'Last Item Problem')+'\n';
    doc37+='**'+(G?'シナリオ':'Scenario')+'**: '+(G?'在庫1個の商品に2人が同時に購入ボタンをクリック':'2 users click buy on item with stock=1 simultaneously')+'\n';
    doc37+='**'+(G?'期待動作':'Expected')+'**: '+(G?'1人は成功、1人は在庫切れエラー':'1 succeeds, 1 gets out-of-stock error')+'\n';
    doc37+='**'+(G?'実装方法':'Implementation')+'**: '+(G?'楽観的ロック or SELECT FOR UPDATE':'Optimistic lock or SELECT FOR UPDATE')+'\n\n';
  }
  if(domain==='fintech'){
    doc37+='### 2. '+(G?'二重送金問題':'Double Payment Problem')+'\n';
    doc37+='**'+(G?'シナリオ':'Scenario')+'**: '+(G?'同一送金リクエストを短時間に2回送信':'Send same payment request twice in short interval')+'\n';
    doc37+='**'+(G?'期待動作':'Expected')+'**: '+(G?'1回のみ実行、2回目は重複エラー':'Execute once, 2nd returns duplicate error')+'\n';
    doc37+='**'+(G?'実装方法':'Implementation')+'**: '+(G?'冪等性キー（idempotency key）':'Idempotency key')+'\n\n';
  }
  if(domain==='booking'||domain==='realestate'){
    doc37+='### 3. '+(G?'ダブルブッキング問題':'Double Booking Problem')+'\n';
    doc37+='**'+(G?'シナリオ':'Scenario')+'**: '+(G?'同一時間帯に2件の予約が同時に作成される':'2 bookings for same time slot created simultaneously')+'\n';
    doc37+='**'+(G?'期待動作':'Expected')+'**: '+(G?'1件は成功、1件は時間帯重複エラー':'1 succeeds, 1 gets time slot conflict error')+'\n';
    doc37+='**'+(G?'実装方法':'Implementation')+'**: '+(G?'UNIQUE制約 (service_id, time_slot) + トランザクション':'UNIQUE constraint (service_id, time_slot) + transaction')+'\n\n';
  }else{
    doc37+='### '+(G?'一般的な並行性問題':'General Concurrency Issues')+'\n';
    doc37+='- **'+(G?'データ競合':'Race Condition')+'**: '+(G?'トランザクション分離レベル設定':'Set transaction isolation level')+'\n';
    doc37+='- **'+(G?'デッドロック':'Deadlock')+'**: '+(G?'ロック順序を統一':'Unify lock order')+'\n';
    doc37+='- **'+(G?'Lost Update':'Lost Update')+'**: '+(G?'楽観的ロックで防止':'Prevent with optimistic lock')+'\n\n';
  }

  // 7 Common Oversights
  doc37+=(G?'## 7つの見落としやすい項目':'## 7 Common Oversights')+'\n\n';
  doc37+='### 1. '+(G?'タイムゾーン':'Timezone')+'\n';
  doc37+='- [ ] '+(G?'DBにUTC保存、表示時にユーザータイムゾーンで変換':'Store in DB as UTC, convert to user timezone on display')+'\n';
  doc37+='- [ ] '+(G?'日時計算はライブラリ使用（date-fns/dayjs）':'Use library for date calculations (date-fns/dayjs)')+'\n\n';

  doc37+='### 2. Unicode/Emoji\n';
  doc37+='- [ ] VARCHAR'+(G?'サイズは文字数ではなくバイト数で考慮':'size in bytes, not characters')+'\n';
  doc37+='- [ ] '+(G?'絵文字対応（utf8mb4）':'Emoji support (utf8mb4)')+'\n\n';

  doc37+='### 3. '+(G?'並行変更':'Concurrent Modification')+'\n';
  doc37+='- [ ] '+(G?'同一データを2人が同時編集→Last Write Wins問題':'2 users edit same data → Last Write Wins problem')+'\n';
  doc37+='- [ ] '+(G?'バージョンカラムで楽観的ロック':'Optimistic lock with version column')+'\n\n';

  doc37+='### 4. '+(G?'ファイルアップロード':'File Upload')+'\n';
  doc37+='- [ ] '+(G?'ファイルサイズ制限':'File size limit')+'\n';
  doc37+='- [ ] '+(G?'MIMEタイプ検証':'MIME type validation')+'\n';
  doc37+='- [ ] '+(G?'ファイル名サニタイズ':'Filename sanitization')+'\n';
  doc37+='- [ ] '+(G?'ウイルススキャン（本番推奨）':'Virus scan (recommended in prod)')+'\n\n';

  doc37+='### 5. '+(G?'レート制限':'Rate Limiting')+'\n';
  doc37+='- [ ] API'+(G?'エンドポイントにレート制限実装':'rate limiting on endpoints')+'\n';
  doc37+='- [ ] '+(G?'ログイン試行回数制限（ブルートフォース対策）':'Login attempt limit (brute force prevention)')+'\n\n';

  doc37+='### 6. '+(G?'メール配信':'Email Delivery')+'\n';
  doc37+='- [ ] '+(G?'送信失敗時のリトライ':'Retry on delivery failure')+'\n';
  doc37+='- [ ] '+(G?'送信履歴記録':'Record delivery history')+'\n';
  doc37+='- [ ] '+(G?'スパム判定されない設定（SPF/DKIM）':'SPF/DKIM to avoid spam')+'\n\n';

  doc37+='### 7. '+(G?'ブラウザストレージ':'Browser Storage')+'\n';
  doc37+='- [ ] localStorage'+(G?'に機密情報保存しない':'no sensitive data')+'\n';
  doc37+='- [ ] '+(G?'容量上限（5-10MB）を考慮':'Consider quota (5-10MB)')+'\n';
  doc37+='- [ ] '+(G?'ユーザーが削除できる仕組み':'User can clear data')+'\n\n';

  // Related Documents
  doc37+=(G?'## 関連ドキュメント':'## Related Documents')+'\n\n';
  doc37+='- **docs/32_qa_blueprint.md** — '+(G?'業種別QA戦略':'Industry-specific QA strategy')+'\n';
  doc37+='- **docs/33_test_matrix.md** — '+(G?'具体的テストマトリクス':'Concrete test matrix')+'\n';
  doc37+='- **docs/36_test_strategy.md** — '+(G?'フェーズ別テスト戦略':'Phase-based testing strategy')+'\n';
  doc37+='- **docs/34_incident_response.md** — '+(G?'インシデント対応':'Incident response')+'\n\n';

  S.files['docs/37_bug_prevention.md']=doc37;
}
