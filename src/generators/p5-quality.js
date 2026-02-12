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
      legal:'SOX',government:'WCAG 2.1 AA'
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
      doc33+"});\n";
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

  S.files['docs/33_test_matrix.md']=doc33;
}
