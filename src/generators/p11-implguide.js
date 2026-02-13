/* ═══ Pillar 11: Implementation Intelligence ═══ */

function genPillar11_ImplIntelligence(a,pn){
  const G=S.genLang==='ja';
  const domain=detectDomain(a.purpose)||'_default';
  const appType=detectAppType(a);
  const aiLevel=a.ai_auto||'none';
  const frontend=a.frontend||'React + Vite';
  const backend=a.backend||'Supabase';
  const db=a.database||'PostgreSQL';

  // ── docs/39_implementation_playbook.md ──
  const pattern=DOMAIN_IMPL_PATTERN[domain]||DOMAIN_IMPL_PATTERN._default;
  const appTypePattern=APP_TYPE_MAP[appType]||APP_TYPE_MAP.spa;
  const entities=(a.data_entities||'User').split(',').map(e=>e.trim());

  let doc39='';
  doc39+='# '+(G?'実装プレイブック':'Implementation Playbook')+'\n\n';
  doc39+=(G?'**プロジェクト**：':'**Project**: ')+pn+'\n';
  doc39+=(G?'**業種**：':'**Domain**: ')+(G?'検知結果 - ':'Detected - ')+domain+'\n';
  doc39+=(G?'**アプリタイプ**：':'**App Type**: ')+appType+'\n';
  doc39+=(G?'**生成日**：':'**Generated**: ')+new Date().toISOString().split('T')[0]+'\n\n';
  doc39+='---\n\n';

  // 1. Domain-Specific Implementation Patterns
  doc39+='## '+(G?'1. 業種別実装パターン':'1. Domain-Specific Implementation Patterns')+'\n\n';
  doc39+='### '+(G?'推奨実装手法':'Recommended Practices')+'\n';
  (G?pattern.impl_ja:pattern.impl_en).forEach((p,i)=>{
    doc39+=(i+1)+'. '+p+'\n';
  });
  doc39+='\n### '+(G?'ガードレール（防止すべき典型バグ）':'Guard Rails (Typical Bugs to Prevent)')+'\n';
  (G?pattern.guard_ja:pattern.guard_en).forEach((g,i)=>{
    doc39+='- ❌ '+g+'\n';
  });
  doc39+='\n### '+(G?'擬似コードテンプレート':'Pseudo-code Template')+'\n';
  doc39+='```javascript\n';
  doc39+=pattern.pseudo+'\n';
  doc39+='```\n\n';

  // 2. Stack-Specific Guidance
  doc39+='## '+(G?'2. スタック固有ガイダンス':'2. Stack-Specific Guidance')+'\n\n';
  doc39+='### '+(G?'フロントエンド：':'Frontend: ')+frontend+'\n';
  if(frontend.includes('Next')){
    doc39+=(G?'- App Routerを使用（Pages Routerは非推奨）\n':'- Use App Router (Pages Router deprecated)\n');
    doc39+=(G?'- サーバーコンポーネントを優先、クライアントコンポーネントは必要最小限\n':'- Prefer Server Components, minimize Client Components\n');
    doc39+=(G?'- データフェッチはasync/await直接記述\n':'- Data fetching with async/await directly\n');
  }else if(frontend.includes('Vite')||frontend.includes('SPA')){
    doc39+=(G?'- 状態管理はZustand推奨（Reduxは大規模のみ）\n':'- State management with Zustand (Redux for large-scale only)\n');
    doc39+=(G?'- コード分割はReact.lazy+Suspense\n':'- Code splitting with React.lazy + Suspense\n');
    doc39+=(G?'- ビルド最適化はVite plugin-react-swc\n':'- Build optimization with Vite plugin-react-swc\n');
  }else if(frontend.includes('Vue')){
    doc39+=(G?'- Composition API優先\n':'- Prefer Composition API\n');
    doc39+=(G?'- 状態管理はPinia\n':'- State management with Pinia\n');
    doc39+=(G?'- TypeScript strict mode推奨\n':'- Recommend TypeScript strict mode\n');
  }
  doc39+='\n### '+(G?'バックエンド：':'Backend: ')+backend+'\n';
  if(backend.includes('Supabase')){
    doc39+=(G?'- Row Level Security (RLS)を全テーブルに設定\n':'- Set Row Level Security (RLS) on all tables\n');
    doc39+=(G?'- Supabase Edgeは軽量処理のみ（重い処理は別途API）\n':'- Supabase Edge for lightweight tasks only (heavy tasks in separate API)\n');
    doc39+=(G?'- Realtime subscriptionsは必要最小限（コスト注意）\n':'- Minimize Realtime subscriptions (cost consideration)\n');
  }else if(backend.includes('Firebase')){
    doc39+=(G?'- Firestore Security Rulesを厳格に設定\n':'- Strictly configure Firestore Security Rules\n');
    doc39+=(G?'- Cloud Functionsは第2世代推奨\n':'- Recommend Cloud Functions Gen 2\n');
    doc39+=(G?'- コスト最適化：読み取り回数削減、複合クエリ活用\n':'- Cost optimization: reduce reads, use composite queries\n');
  }else if(backend.includes('Node')){
    doc39+=(G?'- Express middlewareでバリデーション統一\n':'- Unified validation with Express middleware\n');
    doc39+=(G?'- エラーハンドリングは集約ハンドラ\n':'- Centralized error handler\n');
    doc39+=(G?'- 環境変数は.envで管理、dotenv-safe推奨\n':'- Manage env vars with .env, recommend dotenv-safe\n');
  }
  doc39+='\n### '+(G?'データベース：':'Database: ')+db+'\n';
  if(db.includes('PostgreSQL')){
    doc39+=(G?'- マイグレーションツールはPrisma/Drizzle\n':'- Migration tool: Prisma/Drizzle\n');
    doc39+=(G?'- インデックスは外部キー・検索条件カラムに必須\n':'- Indexes required on FKs and search columns\n');
    doc39+=(G?'- トランザクション分離レベルはREAD COMMITTED（デフォルト）\n':'- Transaction isolation: READ COMMITTED (default)\n');
  }else if(db.includes('MongoDB')){
    doc39+=(G?'- スキーマ検証はMongooseで定義\n':'- Schema validation with Mongoose\n');
    doc39+=(G?'- インデックスはクエリパフォーマンス分析後に作成\n':'- Create indexes after query performance analysis\n');
    doc39+=(G?'- 大規模データはシャーディング検討\n':'- Consider sharding for large-scale data\n');
  }
  doc39+='\n';

  // 3. App Type Best Practices
  doc39+='## '+(G?'3. アプリタイプ別ベストプラクティス':'3. App Type Best Practices')+'\n\n';
  doc39+='### '+(G?'推奨パターン':'Recommended Patterns')+' ('+appType+')\n';
  (G?appTypePattern.patterns_ja:appTypePattern.patterns_en).forEach(p=>{
    doc39+='- ✅ '+p+'\n';
  });
  doc39+='\n### '+(G?'アンチパターン（避けるべき）':'Anti-patterns (Avoid)')+'\n';
  (G?appTypePattern.antipatterns_ja:appTypePattern.antipatterns_en).forEach(ap=>{
    doc39+='- ⚠️ '+ap+'\n';
  });
  doc39+='\n';

  // 4. Entity-Specific Pseudo-code
  doc39+='## '+(G?'4. エンティティ別擬似コード':'4. Entity-Specific Pseudo-code')+'\n\n';
  entities.slice(0,3).forEach(ent=>{
    const cols=getEntityColumns(ent,G,entities);
    if(!cols||cols.length===0){
      doc39+='### '+ent+'\n';
      doc39+=(G?'※ 未定義エンティティ。ENTITY_COLUMNSに追加してください。\n\n':'※ Undefined entity. Add to ENTITY_COLUMNS.\n\n');
      return;
    }
    const methods=getEntityMethods(ent)||['GET','POST','PUT','DELETE'];
    doc39+='### '+ent+'\n';
    doc39+='```javascript\n';
    if(methods.includes('POST')){
      doc39+='// CREATE\n';
      doc39+='async function create'+ent+'(data) {\n';
      doc39+='  validateInput(data); // '+(G?'入力検証':'Input validation')+'\n';
      doc39+='  const result = await db.insert("'+pluralize(ent)+'", data);\n';
      doc39+='  logAudit("CREATE_'+ent.toUpperCase()+'", result.id); // '+(G?'監査ログ':'Audit log')+'\n';
      doc39+='  return result;\n';
      doc39+='}\n\n';
    }
    if(methods.includes('GET')){
      doc39+='// READ\n';
      doc39+='async function get'+ent+'(id) {\n';
      doc39+='  const result = await db.query("SELECT * FROM '+pluralize(ent)+' WHERE id = ?", [id]);\n';
      doc39+='  if (!result) throw new NotFoundError();\n';
      doc39+='  return result;\n';
      doc39+='}\n\n';
    }
    if(methods.includes('PUT')){
      doc39+='// UPDATE\n';
      doc39+='async function update'+ent+'(id, data) {\n';
      doc39+='  validateInput(data);\n';
      doc39+='  await db.transaction(async () => {\n';
      doc39+='    const current = await db.query("SELECT * FROM '+pluralize(ent)+' WHERE id = ? FOR UPDATE", [id]);\n';
      doc39+='    await db.execute("UPDATE '+pluralize(ent)+' SET ... WHERE id = ?", [..., id]);\n';
      doc39+='    logAudit("UPDATE_'+ent.toUpperCase()+'", id);\n';
      doc39+='  });\n';
      doc39+='}\n\n';
    }
    if(methods.includes('DELETE')){
      doc39+='// DELETE (Soft delete recommended)\n';
      doc39+='async function delete'+ent+'(id) {\n';
      doc39+='  await db.execute("UPDATE '+pluralize(ent)+' SET deleted_at = NOW() WHERE id = ?", [id]);\n';
      doc39+='  logAudit("DELETE_'+ent.toUpperCase()+'", id);\n';
      doc39+='}\n';
    }
    doc39+='```\n\n';
  });

  // 5. Cross-Cutting Concerns Checklist
  doc39+='## '+(G?'5. 横断的関心事チェックリスト':'5. Cross-Cutting Concerns Checklist')+'\n\n';
  Object.entries(CROSS_CUTTING_IMPL).forEach(([key,val])=>{
    const title={auth:G?'認証・認可':'Auth',error:G?'エラーハンドリング':'Error Handling',cache:G?'キャッシュ':'Cache',i18n:G?'国際化':'i18n',audit:G?'監査ログ':'Audit Log',upload:G?'ファイルアップロード':'File Upload',rate:G?'レート制限':'Rate Limiting',validation:G?'入力検証':'Validation'}[key]||key;
    doc39+='### '+title+'\n';
    (G?val.ja:val.en).forEach(item=>{
      doc39+='- [ ] '+item+'\n';
    });
    doc39+='\n';
  });

  doc39+='---\n';
  doc39+=(G?'*このプレイブックはDevForge v9が自動生成しました。プロジェクト固有の要件に応じて調整してください。*\n':'*This playbook was auto-generated by DevForge v9. Adjust according to project-specific requirements.*\n');

  S.files['docs/39_implementation_playbook.md']=doc39;

  // ── docs/40_ai_dev_runbook.md ──
  let doc40='';
  doc40+='# '+(G?'AI開発運用手順書':'AI Development Runbook')+'\n\n';
  doc40+=(G?'**プロジェクト**：':'**Project**: ')+pn+'\n';
  doc40+=(G?'**AIレベル**：':'**AI Level**: ')+aiLevel+'\n';
  doc40+=(G?'**生成日**：':'**Generated**: ')+new Date().toISOString().split('T')[0]+'\n\n';
  doc40+='---\n\n';

  // 1. AI Operation Workflow
  doc40+='## '+(G?'1. AI運用ワークフロー':'1. AI Operation Workflow')+'\n\n';
  if(aiLevel==='none'||aiLevel==='なし'){
    doc40+=(G?'※ AIレベルが「なし」のため、基本的なフローのみ記載します。\n\n':'※ AI level is "none", only basic flow described.\n\n');
    doc40+='### '+(G?'基本フロー':'Basic Flow')+'\n';
    doc40+='1. '+(G?'仕様書レビュー（手動）':'Manual spec review')+'\n';
    doc40+='2. '+(G?'実装（コード記述）':'Implementation (coding)')+'\n';
    doc40+='3. '+(G?'テスト実行':'Run tests')+'\n';
    doc40+='4. '+(G?'デプロイ':'Deploy')+'\n';
  }else{
    doc40+='### '+(G?'Write → Select → Compress → Isolate サイクル':'Write → Select → Compress → Isolate Cycle')+'\n\n';
    doc40+='#### Phase 1: Write (仕様生成)\n';
    doc40+=(G?'- AI Brief (`AI_BRIEF.md`) を読み込み\n':'- Load AI Brief (`AI_BRIEF.md`)\n');
    doc40+=(G?'- SDD仕様書 (`.spec/constitution.md`) を確認\n':'- Review SDD specs (`.spec/constitution.md`)\n');
    doc40+=(G?'- 実装プレイブック (`docs/39_implementation_playbook.md`) で業種別パターン確認\n':'- Check domain patterns in Implementation Playbook (`docs/39_implementation_playbook.md`)\n');
    doc40+=(G?'- タスク分解：`docs/30_goal_decomposition.md` 参照\n':'- Task decomposition: refer to `docs/30_goal_decomposition.md`\n');
    doc40+='\n#### Phase 2: Select (ファイル選択)\n';
    doc40+=(G?'- **タスク別ファイル選択マトリクス**を使用（下記参照）\n':'- Use **Task-Specific File Selection Matrix** (see below)\n');
    doc40+=(G?'- トークン見積もり：1ファイル = 平均500-2000トークン\n':'- Token estimate: 1 file = avg 500-2000 tokens\n');
    doc40+=(G?'- 優先度：仕様書 > エンティティ定義 > 実装ガイド > テストケース\n':'- Priority: Specs > Entity definitions > Impl guide > Test cases\n');
    doc40+='\n#### Phase 3: Compress (コンテキスト圧縮)\n';
    doc40+=(G?'- コンテキスト使用量80%超過時に発動\n':'- Activate when context usage exceeds 80%\n');
    doc40+=(G?'- 圧縮対象：過去の会話履歴、参照済みファイルの要約化\n':'- Compress: past conversation history, summarize referenced files\n');
    doc40+=(G?'- 保持対象：現在のタスク、直近のエラーログ\n':'- Preserve: current task, recent error logs\n');
    doc40+='\n#### Phase 4: Isolate (サブエージェント分離)\n';
    doc40+=(G?'- 独立タスクは専用エージェントに委譲\n':'- Delegate independent tasks to specialized agents\n');
    doc40+=(G?'- ハンドオフ時はサマリーのみ共有（詳細は不要）\n':'- Share only summary on handoff (details unnecessary)\n');
    doc40+=(G?'- エージェント間引継ぎ：YAMLフォーマット（`AGENTS.md`参照）\n':'- Inter-agent handoff: YAML format (see `AGENTS.md`)\n');
    doc40+='\n';
  }

  // 2. File Selection Matrix
  doc40+='## '+(G?'2. タスク別ファイル選択マトリクス':'2. Task-Specific File Selection Matrix')+'\n\n';
  doc40+='| '+(G?'タスクタイプ':'Task Type')+' | '+(G?'必読ファイル':'Must-Read Files')+' | '+(G?'推奨ファイル':'Recommended Files')+' |\n';
  doc40+='|---|---|---|\n';
  doc40+='| '+(G?'新機能実装':'New Feature')+' | `.spec/constitution.md`, `docs/04_er_diagram.md`, `docs/39_implementation_playbook.md` | `docs/26_design_system.md`, `docs/06_screen_design.md` |\n';
  doc40+='| '+(G?'バグ修正':'Bug Fix')+' | `docs/25_error_logs.md`, `docs/37_bug_prevention.md`, `docs/07_test_cases.md` | `docs/34_incident_response.md`, `docs/33_test_matrix.md` |\n';
  doc40+='| '+(G?'テスト追加':'Add Tests')+' | `docs/07_test_cases.md`, `docs/36_test_strategy.md`, `docs/33_test_matrix.md` | `.spec/verification.md`, `docs/28_qa_strategy.md` |\n';
  doc40+='| '+(G?'リファクタリング':'Refactoring')+' | `docs/03_architecture.md`, `docs/39_implementation_playbook.md` | `docs/26_design_system.md`, `CLAUDE.md` |\n';
  doc40+='| '+(G?'ドキュメント更新':'Doc Update')+' | `.spec/specification.md`, `docs/24_progress.md` | `docs/31_industry_playbook.md`, `AI_BRIEF.md` |\n';
  doc40+='| '+(G?'API実装':'API Impl')+' | `docs/05_api_design.md`, `docs/04_er_diagram.md`, `docs/08_security.md` | `docs/39_implementation_playbook.md`, `docs/28_qa_strategy.md` |\n';
  doc40+='\n';

  // 3. Error Recovery Protocol
  doc40+='## '+(G?'3. エラー復旧プロトコル':'3. Error Recovery Protocol')+'\n\n';
  doc40+='### '+(G?'業種別典型エラーと対処法':'Domain-Specific Typical Errors & Solutions')+'\n\n';
  const domainErrors={
    education:{ja:'進捗率100%超過 → イベントソーシングの集計ロジック確認',en:'Progress >100% → Check event sourcing aggregation logic'},
    ec:{ja:'在庫マイナス → 楽観的ロックのversion列チェック漏れ',en:'Negative stock → Missing optimistic lock version check'},
    fintech:{ja:'残高不一致 → トランザクション境界の見直し',en:'Balance mismatch → Review transaction boundaries'},
    health:{ja:'同意なしアクセス → hasConsent()の条件分岐追加',en:'Unauthorized access → Add hasConsent() condition'},
    marketplace:{ja:'手数料計算エラー → サーバーサイド検証の強化',en:'Fee calculation error → Strengthen server-side validation'},
    _default:{ja:'データ不整合 → トランザクション漏れ確認',en:'Data inconsistency → Check missing transactions'}
  };
  const errMsg=domainErrors[domain]||domainErrors._default;
  doc40+='**'+domain+'**: '+(G?errMsg.ja:errMsg.en)+'\n\n';

  doc40+='### '+(G?'一般的エラー対処フロー':'General Error Handling Flow')+'\n';
  doc40+='1. '+(G?'`docs/25_error_logs.md` にエラー記録':'Record error in `docs/25_error_logs.md`')+'\n';
  doc40+='2. '+(G?'`docs/37_bug_prevention.md` のチェックリスト確認':'Check checklist in `docs/37_bug_prevention.md`')+'\n';
  doc40+='3. '+(G?'該当ファイルの修正':'Fix relevant files')+'\n';
  doc40+='4. '+(G?'テスト追加（再発防止）':'Add tests (prevent recurrence)')+'\n';
  doc40+='5. '+(G?'`docs/24_progress.md` に対応記録':'Record response in `docs/24_progress.md`')+'\n';
  doc40+='\n';

  // 4. Context Management Strategy
  doc40+='## '+(G?'4. コンテキスト管理戦略':'4. Context Management Strategy')+'\n\n';
  doc40+='### '+(G?'トークン予算配分':'Token Budget Allocation')+'\n';
  doc40+='- '+(G?'タスク指示・会話：40%':'Task instructions & conversation: 40%')+'\n';
  doc40+='- '+(G?'仕様書・設計：30%':'Specs & design: 30%')+'\n';
  doc40+='- '+(G?'実装ガイド・進捗：20%':'Impl guide & progress: 20%')+'\n';
  doc40+='- '+(G?'バッファ（エラーログなど）：10%':'Buffer (error logs, etc.): 10%')+'\n';
  doc40+='\n### '+(G?'圧縮タイミング':'Compression Timing')+'\n';
  doc40+='- '+(G?'コンテキスト使用量 < 50%：圧縮不要':'Context usage < 50%: No compression needed')+'\n';
  doc40+='- '+(G?'50% ~ 80%：過去の会話履歴を要約':'50% ~ 80%: Summarize past conversation')+'\n';
  doc40+='- '+(G?'80% ~ 95%：参照ファイルを要約、古いエラーログ削除':'80% ~ 95%: Summarize files, delete old error logs')+'\n';
  doc40+='- '+(G?'95%超：サブエージェント分離またはタスク分割':'> 95%: Isolate sub-agent or split task')+'\n';
  doc40+='\n';

  // 5. Agent Handoff Protocol
  if(aiLevel==='multi'||aiLevel==='full'||aiLevel==='orch'){
    doc40+='## '+(G?'5. エージェント間ハンドオフ手順':'5. Agent Handoff Protocol')+'\n\n';
    doc40+=(G?'詳細は `AGENTS.md` の「Agent Specialization Matrix」参照。\n\n':'See `AGENTS.md` "Agent Specialization Matrix" for details.\n\n');
    doc40+='### '+(G?'ハンドオフYAMLフォーマット':'Handoff YAML Format')+'\n';
    doc40+='```yaml\n';
    doc40+='from_agent: planning\n';
    doc40+='to_agent: implementation\n';
    doc40+='task: Implement User authentication flow\n';
    doc40+='context:\n';
    doc40+='  entities: [User, Session]\n';
    doc40+='  auth_method: Supabase Auth\n';
    doc40+='  files_to_read:\n';
    doc40+='    - .spec/constitution.md\n';
    doc40+='    - docs/04_er_diagram.md\n';
    doc40+='    - docs/39_implementation_playbook.md\n';
    doc40+='status: pending\n';
    doc40+='```\n\n';
  }

  doc40+='---\n';
  doc40+=(G?'*この運用手順書はDevForge v9が自動生成しました。AIレベルに応じて適宜カスタマイズしてください。*\n':'*This runbook was auto-generated by DevForge v9. Customize according to AI level.*\n');

  S.files['docs/40_ai_dev_runbook.md']=doc40;

  // ── skills/impl-patterns.md (conditional) ──
  if(aiLevel!=='none'&&aiLevel!=='なし'){
    let skillDoc='';
    skillDoc+='# '+(G?'実装パターンスキルカタログ':'Implementation Patterns Skill Catalog')+'\n\n';
    skillDoc+=(G?'> Manus Skills形式の実装スキル定義\n\n':'> Implementation skills in Manus Skills format\n\n');
    skillDoc+='**'+(G?'業種':'Domain')+'**: '+domain+'\n';
    skillDoc+='**'+(G?'スタック':'Stack')+'**: '+frontend+' + '+backend+'\n\n';
    skillDoc+='---\n\n';

    // Thinking Axis for Domain
    skillDoc+='## '+(G?'思考軸（Thinking Axis）':'Thinking Axis')+'\n\n';
    const thinkingAxis={
      education:{ja:['学習進捗の可視化','コンテンツの段階的解放','修了判定の厳格性'],en:['Visualize learning progress','Gradual content unlocking','Strict completion criteria']},
      ec:{ja:['在庫の正確性','決済の冪等性','カート放棄防止'],en:['Inventory accuracy','Payment idempotency','Cart abandonment prevention']},
      fintech:{ja:['トランザクション整合性','監査ログの完全性','コンプライアンス準拠'],en:['Transaction consistency','Audit log completeness','Compliance adherence']},
      health:{ja:['患者データ保護','同意管理','アクセス監査'],en:['Patient data protection','Consent management','Access auditing']},
      _default:{ja:['データ整合性','セキュリティ','ユーザー体験'],en:['Data integrity','Security','User experience']}
    };
    const axis=(thinkingAxis[domain]||thinkingAxis._default);
    (G?axis.ja:axis.en).forEach((a,i)=>{
      skillDoc+=(i+1)+'. '+a+'\n';
    });
    skillDoc+='\n';

    // 4-Layer Skills
    skillDoc+='## '+(G?'4層スキル構造':'4-Layer Skill Structure')+'\n\n';
    const layers=[
      {id:'planning',name_ja:'企画層',name_en:'Planning',skills_ja:['要件定義','技術選定'],skills_en:['Requirement definition','Tech stack selection']},
      {id:'design',name_ja:'設計層',name_en:'Design',skills_ja:['ER設計','API設計'],skills_en:['ER design','API design']},
      {id:'production',name_ja:'制作層',name_en:'Production',skills_ja:['実装','テスト'],skills_en:['Implementation','Testing']},
      {id:'operations',name_ja:'運用層',name_en:'Operations',skills_ja:['モニタリング','インシデント対応'],skills_en:['Monitoring','Incident response']}
    ];
    layers.forEach(layer=>{
      skillDoc+='### '+(G?layer.name_ja:layer.name_en)+'\n';
      (G?layer.skills_ja:layer.skills_en).forEach(sk=>{
        skillDoc+='- '+sk+'\n';
      });
      skillDoc+='\n';
    });

    // Detailed Skill: Domain-Specific Implementation
    skillDoc+='## '+(G?'詳細スキル：業種別実装':'Detailed Skill: Domain Implementation')+'\n\n';
    skillDoc+='### '+(G?'スキル名':'Skill Name')+'\n';
    skillDoc+='**'+domain+' Implementation Pattern**\n\n';
    skillDoc+='### Input\n';
    skillDoc+='- '+(G?'エンティティ定義 (`docs/04_er_diagram.md`)':'Entity definitions (`docs/04_er_diagram.md`)')+'\n';
    skillDoc+='- '+(G?'機能要件 (`.spec/constitution.md`)':'Feature requirements (`.spec/constitution.md`)')+'\n';
    skillDoc+='- '+(G?'実装プレイブック (`docs/39_implementation_playbook.md`)':'Implementation playbook (`docs/39_implementation_playbook.md`)')+'\n';
    skillDoc+='\n### Process\n';
    skillDoc+='1. '+(G?'業種別パターンを確認':'Review domain-specific patterns')+'\n';
    skillDoc+='2. '+(G?'擬似コードをプロジェクトエンティティに適用':'Apply pseudo-code to project entities')+'\n';
    skillDoc+='3. '+(G?'ガードレール（典型バグ）を考慮した実装':'Implement considering guard rails (typical bugs)')+'\n';
    skillDoc+='4. '+(G?'横断的関心事チェックリストで検証':'Validate with cross-cutting concerns checklist')+'\n';
    skillDoc+='\n### Output\n';
    skillDoc+='- '+(G?'実装コード（CRUD + ビジネスロジック）':'Implementation code (CRUD + business logic)')+'\n';
    skillDoc+='- '+(G?'テストケース（ガードレール検証含む）':'Test cases (including guard rail validation)')+'\n';
    skillDoc+='\n### '+(G?'判断基準':'Judgment Criteria')+'\n';
    skillDoc+='- '+(G?'全てのガードレールに対応するテストが存在するか':'Tests exist for all guard rails?')+'\n';
    skillDoc+='- '+(G?'横断的関心事チェックリストが全てチェック済みか':'All cross-cutting concerns checked?')+'\n';
    skillDoc+='- '+(G?'業種固有の制約（コンプライアンス等）を満たしているか':'Domain-specific constraints (compliance, etc.) satisfied?')+'\n';
    skillDoc+='\n### '+(G?'次のスキル':'Next Skill')+'\n';
    skillDoc+='- '+(G?'テスト実行 → バグ修正 → デプロイ準備':'Run tests → Fix bugs → Prepare deploy')+'\n';
    skillDoc+='\n';

    skillDoc+='---\n';
    skillDoc+=(G?'*このスキルカタログはDevForge v9が自動生成しました。*\n':'*This skill catalog was auto-generated by DevForge v9.*\n');

    S.files['skills/impl-patterns.md']=skillDoc;
  }

  // ── docs/42_skill_guide.md ──
  const skill=S.skill||'intermediate';
  const skLabel={beginner:G?'初心者':'Beginner',intermediate:G?'中級者':'Intermediate',pro:G?'上級者':'Professional'};
  const skIcon={beginner:'⭐',intermediate:'⭐⭐',pro:'⭐⭐⭐'};
  const skMark=G?' **← あなたのレベル**':' **<-- YOUR LEVEL**';
  const _lv=(lv,items)=>{
    const active=lv===skill?skMark:'';
    let s='### '+skIcon[lv]+' '+skLabel[lv]+active+'\n\n';
    items.forEach(it=>{s+=it+'\n';});
    s+='\n';
    return s;
  };

  let doc42='# '+pn+' — '+(G?'スキルレベル別ガイド':'Skill-Level Guide')+'\n\n';
  doc42+=(G?'**あなたのレベル**: ':'**Your Level**: ')+skIcon[skill]+' '+skLabel[skill]+'\n';
  doc42+=(G?'**業種**: ':'**Domain**: ')+domain+'\n';
  doc42+=(G?'**生成日**: ':'**Generated**: ')+new Date().toISOString().split('T')[0]+'\n\n';
  doc42+='---\n\n';

  // Sec 1: Getting Started
  doc42+='## '+(G?'1. 最初にやること（生成直後の第一歩）':'1. Getting Started (First Steps After Generation)')+'\n\n';
  doc42+=_lv('beginner',G?[
    '1. `CLAUDE.md` をAIツール（Cursor/Claude Code）にコピペ → AIがプロジェクト全体を理解',
    '2. `.spec/constitution.md` を読んでプロジェクトの目的・範囲を確認',
    '3. `docs/24_progress.md` を開いてタスク進捗管理を開始',
    '4. `.devcontainer/` フォルダがある場合、VS Code/Cursorで「Reopen in Container」で開発環境を即構築'
  ]:[
    '1. Copy `CLAUDE.md` into your AI tool (Cursor/Claude Code) — AI understands your entire project',
    '2. Read `.spec/constitution.md` to understand project purpose and scope',
    '3. Open `docs/24_progress.md` to start tracking progress',
    '4. If `.devcontainer/` exists, use "Reopen in Container" in VS Code/Cursor for instant dev setup'
  ]);
  doc42+=_lv('intermediate',G?[
    '1. `AI_BRIEF.md` をAIに投入（~1200トークンで全仕様を圧縮）',
    '2. `docs/39_implementation_playbook.md` で業種別実装パターンを確認',
    '3. `docs/40_ai_dev_runbook.md` のWSCI（Write/Select/Compress/Isolate）ワークフローに従う',
    '4. `.cursorrules` / `.windsurfrules` をプロジェクトルートに配置してAIルールを自動適用'
  ]:[
    '1. Feed `AI_BRIEF.md` to AI (~1200 tokens, compressed full spec)',
    '2. Review domain patterns in `docs/39_implementation_playbook.md`',
    '3. Follow WSCI (Write/Select/Compress/Isolate) workflow in `docs/40_ai_dev_runbook.md`',
    '4. Place `.cursorrules` / `.windsurfrules` in project root for auto AI rules'
  ]);
  doc42+=_lv('pro',G?[
    '1. `.devcontainer/` でチーム全員の環境を統一（Docker Compose構成済み）',
    '2. `AGENTS.md` の Agent Specialization Matrix でマルチエージェント役割定義',
    '3. `mcp-config.json` を設定し、context7/filesystem/playwright等のMCPツールを有効化',
    '4. `skills/pipelines.md` のCI/CDパイプラインを `.github/workflows/ci.yml` と統合'
  ]:[
    '1. Deploy `.devcontainer/` to standardize team environments (Docker Compose pre-configured)',
    '2. Define multi-agent roles via Agent Specialization Matrix in `AGENTS.md`',
    '3. Configure `mcp-config.json` to enable context7/filesystem/playwright MCP tools',
    '4. Integrate `skills/pipelines.md` CI/CD pipelines with `.github/workflows/ci.yml`'
  ]);

  // Sec 2: File Usage Map
  doc42+='## '+(G?'2. ファイル活用マップ':'2. File Usage Map')+'\n\n';
  doc42+='| '+(G?'タスク':'Task')+' | '+(G?'最初に読む':'Read First')+' | '+(G?'次に参照':'Then Refer')+' |\n|------|------------|----------|\n';
  const fmap=G?[
    ['コーディング開始','CLAUDE.md','.spec/constitution.md'],
    ['DB設計理解','docs/04_er_diagram.md','docs/05_api_design.md'],
    ['テスト作成','docs/07_test_cases.md','docs/36_test_strategy.md'],
    ['セキュリティ確認','docs/08_security.md','docs/34_incident_response.md'],
    ['デプロイ準備','docs/09_release_checklist.md','.github/workflows/ci.yml'],
    ['成長戦略確認','docs/41_growth_intelligence.md','docs/30_goal_decomposition.md'],
    ['バグ予防','docs/37_bug_prevention.md','docs/25_error_logs.md']
  ]:[
    ['Start coding','CLAUDE.md','.spec/constitution.md'],
    ['Understand DB','docs/04_er_diagram.md','docs/05_api_design.md'],
    ['Write tests','docs/07_test_cases.md','docs/36_test_strategy.md'],
    ['Security review','docs/08_security.md','docs/34_incident_response.md'],
    ['Deploy prep','docs/09_release_checklist.md','.github/workflows/ci.yml'],
    ['Growth strategy','docs/41_growth_intelligence.md','docs/30_goal_decomposition.md'],
    ['Bug prevention','docs/37_bug_prevention.md','docs/25_error_logs.md']
  ];
  fmap.forEach(r=>{doc42+='| '+r[0]+' | `'+r[1]+'` | `'+r[2]+'` |\n';});
  doc42+='\n';

  // Sec 3: Mistakes & Cautions
  doc42+='## '+(G?'3. 注意事項とよくある失敗':'3. Common Mistakes & Cautions')+'\n\n';
  doc42+=_lv('beginner',G?[
    '- ❌ `.spec/` を読まずにコーディング開始 → ✅ 必ず `constitution.md` を先に読む',
    '- ❌ `docs/08_security.md` を無視 → ✅ 認証・RLS・CORS設定を確認してから実装',
    '- ❌ 全ファイルを一度に使おうとする → ✅ まず `.spec/tasks.md` の1タスクに集中',
    '- ❌ テストを後回し → ✅ `docs/07_test_cases.md` のケースを実装と同時に書く',
    '- ❌ エラーログを記録しない → ✅ `docs/25_error_logs.md` のフォーマットで記録'
  ]:[
    '- ❌ Start coding without reading `.spec/` → ✅ Always read `constitution.md` first',
    '- ❌ Ignoring `docs/08_security.md` → ✅ Review auth, RLS, CORS before implementation',
    '- ❌ Trying to use all files at once → ✅ Focus on one task from `.spec/tasks.md`',
    '- ❌ Postponing tests → ✅ Write tests alongside implementation using `docs/07_test_cases.md`',
    '- ❌ Not logging errors → ✅ Use `docs/25_error_logs.md` format for tracking'
  ]);
  doc42+=_lv('intermediate',G?[
    '- ❌ `docs/39_implementation_playbook.md` のドメインパターンを無視 → ✅ 業種固有のバグパターンを事前確認',
    '- ❌ 品質ゲートを省略 → ✅ `docs/32_qa_blueprint.md` のチェックリストを実施',
    '- ❌ AIへのモノリシックプロンプト → ✅ `docs/22_prompt_playbook.md` のフェーズ別テンプレート使用',
    '- ❌ 生成物をそのまま使う → ✅ プロジェクト固有の要件に合わせてカスタマイズ'
  ]:[
    '- ❌ Ignoring domain patterns in `docs/39_implementation_playbook.md` → ✅ Review domain-specific bugs first',
    '- ❌ Skipping quality gates → ✅ Run `docs/32_qa_blueprint.md` checklists',
    '- ❌ Monolithic AI prompts → ✅ Use phase-specific templates from `docs/22_prompt_playbook.md`',
    '- ❌ Using generated files as-is → ✅ Customize to project-specific requirements'
  ]);
  doc42+=_lv('pro',G?[
    '- ❌ MVP段階での過剰設計 → ✅ `docs/30_goal_decomposition.md` の優先度マトリクスに従う',
    '- ❌ Agent間のコンテキスト共有不足 → ✅ `AGENTS.md` のハンドオフプロトコル遵守',
    '- ❌ パフォーマンス最適化の後回し → ✅ `docs/41_growth_intelligence.md` のCWV目標を初期から意識'
  ]:[
    '- ❌ Over-engineering at MVP stage → ✅ Follow priority matrix in `docs/30_goal_decomposition.md`',
    '- ❌ Poor context sharing between agents → ✅ Follow handoff protocol in `AGENTS.md`',
    '- ❌ Deferring performance optimization → ✅ Target CWV goals in `docs/41_growth_intelligence.md` from day 1'
  ]);

  // Sec 4: Workflow
  doc42+='## '+(G?'4. 開発ワークフロー':'4. Development Workflow')+'\n\n';
  doc42+=_lv('beginner',G?[
    '```',
    '.spec/tasks.md → 1タスク選択 → CLAUDE.mdをAIに渡す → コード実装 → テスト → docs/24_progress.md更新',
    '```',
    (G?'> **ポイント**: 1タスクずつ順番に。完了したら progress.md にチェック。':'> **Key**: One task at a time. Check off in progress.md when done.')
  ]:[
    '```',
    '.spec/tasks.md → Pick 1 task → Feed CLAUDE.md to AI → Implement → Test → Update docs/24_progress.md',
    '```',
    '> **Key**: One task at a time. Check off in progress.md when done.'
  ]);
  doc42+=_lv('intermediate',G?[
    '```',
    'AI_BRIEF.md投入 → docs/39パターン確認 → 実装 → docs/32品質チェック → docs/22プロンプトでレビュー依頼',
    '```',
    '> **ポイント**: AI_BRIEF.md でコンテキスト圧縮、プレイブックでドメインパターン適用。'
  ]:[
    '```',
    'Feed AI_BRIEF.md → Check docs/39 patterns → Implement → docs/32 quality check → Review via docs/22 prompts',
    '```',
    '> **Key**: Compress context with AI_BRIEF.md, apply domain patterns from playbook.'
  ]);
  doc42+=_lv('pro',G?[
    '```',
    'AGENTS.md役割定義 → skills/pipelines.md自動化 → 並列実装 → CI/CD統合 → docs/34インシデント対応準備',
    '```',
    '> **ポイント**: Agent Teams で並列開発。verification.md で品質判定を自動化。'
  ]:[
    '```',
    'AGENTS.md role setup → skills/pipelines.md automation → Parallel impl → CI/CD → docs/34 incident prep',
    '```',
    '> **Key**: Parallel dev with Agent Teams. Automate quality judgment via verification.md.'
  ]);

  // Sec 5: AI Tool Usage
  doc42+='## '+(G?'5. AIツール活用戦略':'5. AI Tool Usage Strategy')+'\n\n';
  doc42+=_lv('beginner',G?[
    '1. `CLAUDE.md` 全文をAIにコピペ（Ctrl+Shift+Cで全ファイル一括コピーも可）',
    '2. 「`.spec/tasks.md` の○○を実装して」と具体的に指示',
    '3. エラーが出たら `docs/25_error_logs.md` のフォーマットで記録してAIに渡す'
  ]:[
    '1. Copy entire `CLAUDE.md` into AI (or use Ctrl+Shift+C for bulk copy)',
    '2. Give specific instructions: "Implement XX from `.spec/tasks.md`"',
    '3. On errors, log in `docs/25_error_logs.md` format and share with AI'
  ]);
  doc42+=_lv('intermediate',G?[
    '1. `AI_BRIEF.md` でコンテキスト圧縮投入（~1200トークン）',
    '2. `.cursorrules` / `.windsurfrules` でツール固有ルールを自動適用',
    '3. `docs/22_prompt_playbook.md` のフェーズ別プロンプトテンプレート活用',
    '4. 複数AIツールを使い分け：設計=Claude Code、実装=Cursor、レビュー=Copilot'
  ]:[
    '1. Feed `AI_BRIEF.md` for compressed context (~1200 tokens)',
    '2. Use `.cursorrules` / `.windsurfrules` for tool-specific auto rules',
    '3. Use phase-specific prompt templates from `docs/22_prompt_playbook.md`',
    '4. Multi-tool strategy: Design=Claude Code, Implement=Cursor, Review=Copilot'
  ]);
  doc42+=_lv('pro',G?[
    '1. `AGENTS.md` の Agent Specialization Matrix で役割分担',
    '2. `skills/pipelines.md` で自動パイプライン構築（Feature/BugFix/Release）',
    '3. `mcp-config.json` でcontext7/filesystem/playwright等を統合',
    '4. Claude Code Subagents / Antigravity Manager View で並列実行'
  ]:[
    '1. Define role assignments via Agent Specialization Matrix in `AGENTS.md`',
    '2. Build auto pipelines with `skills/pipelines.md` (Feature/BugFix/Release)',
    '3. Integrate context7/filesystem/playwright via `mcp-config.json`',
    '4. Run parallel with Claude Code Subagents / Antigravity Manager View'
  ]);

  // Sec 6: Quality Checklist
  doc42+='## '+(G?'6. 品質チェックリスト':'6. Quality Checklist')+'\n\n';
  doc42+=_lv('beginner',G?[
    '- [ ] テストが通る（`npm test`）',
    '- [ ] `console.log` を本番コードから除去',
    '- [ ] `docs/08_security.md` のセキュリティ項目を確認',
    '- [ ] `docs/24_progress.md` を更新',
    '- [ ] `docs/25_error_logs.md` に未解決エラーがない'
  ]:[
    '- [ ] Tests pass (`npm test`)',
    '- [ ] Remove `console.log` from production code',
    '- [ ] Review security items in `docs/08_security.md`',
    '- [ ] Update `docs/24_progress.md`',
    '- [ ] No unresolved errors in `docs/25_error_logs.md`'
  ]);
  doc42+=_lv('intermediate',G?[
    '- [ ] テストカバレッジ 80%以上',
    '- [ ] `docs/32_qa_blueprint.md` の業種別チェック完了',
    '- [ ] `docs/37_bug_prevention.md` のパターン対応済み',
    '- [ ] `docs/26_design_system.md` のトークン準拠',
    '- [ ] `docs/28_qa_strategy.md` のクロスカッティング項目確認',
    '- [ ] APIレスポンスが `docs/05_api_design.md` と一致',
    '- [ ] `.spec/verification.md` の検証基準をクリア',
    '- [ ] `docs/27_sequence_diagrams.md` のフロー通りに実装'
  ]:[
    '- [ ] Test coverage >= 80%',
    '- [ ] Domain checks in `docs/32_qa_blueprint.md` complete',
    '- [ ] Bug patterns in `docs/37_bug_prevention.md` addressed',
    '- [ ] Design tokens conform to `docs/26_design_system.md`',
    '- [ ] Cross-cutting items in `docs/28_qa_strategy.md` verified',
    '- [ ] API responses match `docs/05_api_design.md`',
    '- [ ] Pass `.spec/verification.md` criteria',
    '- [ ] Implementation follows `docs/27_sequence_diagrams.md` flows'
  ]);
  doc42+=_lv('pro',G?[
    '- [ ] 中級者チェック全項目 + 以下:',
    '- [ ] `docs/41_growth_intelligence.md` のCore Web Vitals目標達成',
    '- [ ] `docs/19_performance.md` のパフォーマンス基準クリア',
    '- [ ] `docs/34_incident_response.md` のインシデント対応手順テスト済み',
    '- [ ] `.spec/verification.md` の全検証項目を自動テストでカバー',
    '- [ ] エッジケース: 同時アクセス、大量データ、ネットワーク障害',
    '- [ ] `docs/20_a11y.md` のアクセシビリティ基準準拠'
  ]:[
    '- [ ] All intermediate checks PLUS:',
    '- [ ] Core Web Vitals targets from `docs/41_growth_intelligence.md` met',
    '- [ ] Performance criteria from `docs/19_performance.md` passed',
    '- [ ] Incident response in `docs/34_incident_response.md` tested',
    '- [ ] All `.spec/verification.md` criteria covered by automated tests',
    '- [ ] Edge cases: concurrent access, large datasets, network failures',
    '- [ ] Accessibility standards from `docs/20_a11y.md` met'
  ]);

  // Sec 7: Growth Path
  doc42+='## '+(G?'7. レベルアップの道筋':'7. Growth Path')+'\n\n';
  doc42+=_lv('beginner',G?[
    '**⭐→⭐⭐ への道:**',
    '1. `.spec/` の全ファイルを理解する（特に `specification.md` と `technical-plan.md`）',
    '2. `docs/39_implementation_playbook.md` の業種パターンを1つ実装してみる',
    '3. `AI_BRIEF.md` を使ったコンテキスト圧縮技法を習得',
    '4. 2つ以上のAIツールを使い分けてみる'
  ]:[
    '**⭐→⭐⭐ Path:**',
    '1. Understand all files in `.spec/` (especially `specification.md` and `technical-plan.md`)',
    '2. Implement one domain pattern from `docs/39_implementation_playbook.md`',
    '3. Learn context compression using `AI_BRIEF.md`',
    '4. Try using 2+ AI tools for different tasks'
  ]);
  doc42+=_lv('intermediate',G?[
    '**⭐⭐→⭐⭐⭐ への道:**',
    '1. `AGENTS.md` を使ったマルチエージェント開発を試す',
    '2. `skills/pipelines.md` のパイプラインをCI/CDと統合',
    '3. `docs/41_growth_intelligence.md` のグロース方程式を実際のデータで検証',
    '4. `mcp-config.json` でMCPツールチェーンを構築'
  ]:[
    '**⭐⭐→⭐⭐⭐ Path:**',
    '1. Try multi-agent development with `AGENTS.md`',
    '2. Integrate `skills/pipelines.md` pipelines with CI/CD',
    '3. Validate growth equations from `docs/41_growth_intelligence.md` with real data',
    '4. Build MCP tool chain via `mcp-config.json`'
  ]);
  doc42+=_lv('pro',G?[
    '**⭐⭐⭐ マスターへの道:**',
    '1. 独自のAIスキル定義（`skills/factory.md` のテンプレート活用）',
    '2. チームメンバーへのDevForge導入とメンタリング',
    '3. ドメイン固有のカスタムパイプライン構築',
    '4. OSSコントリビューション・アーキテクチャレビューのリード'
  ]:[
    '**⭐⭐⭐ Path to Mastery:**',
    '1. Define custom AI skills (using `skills/factory.md` templates)',
    '2. Introduce DevForge to team and mentor adoption',
    '3. Build domain-specific custom pipelines',
    '4. Lead OSS contributions and architecture reviews'
  ]);

  // Sec 8: Domain Tips
  const dtips={
    education:G?['`docs/08_security.md` → FERPA/学生データ保護を必ず確認','進捗トラッキングはゲーミフィケーション要素と連携','コース完了率KPIを `docs/30_goal_decomposition.md` で設定']:['Review FERPA/student data protection in `docs/08_security.md`','Link progress tracking with gamification elements','Set course completion KPIs in `docs/30_goal_decomposition.md`'],
    fintech:G?['`docs/08_security.md` → PCI DSS/KYC対応を最優先で確認','トランザクション整合性テストを `docs/07_test_cases.md` に追加','金融規制コンプライアンスを `docs/31_industry_playbook.md` で確認']:['Prioritize PCI DSS/KYC in `docs/08_security.md`','Add transaction integrity tests to `docs/07_test_cases.md`','Check financial compliance in `docs/31_industry_playbook.md`'],
    health:G?['`docs/08_security.md` → HIPAA準拠を確認','患者データ暗号化を `.spec/technical-plan.md` で検証','監査ログを `docs/05_api_design.md` に追加']:['Verify HIPAA compliance in `docs/08_security.md`','Validate patient data encryption in `.spec/technical-plan.md`','Add audit logging to `docs/05_api_design.md`'],
    ec:G?['決済テストは必ずStripeテストキーで実施','在庫管理の同時アクセス対策を `docs/37_bug_prevention.md` で確認','カート放棄防止策を `docs/41_growth_intelligence.md` で確認']:['Always test payments with Stripe test keys','Check concurrent access for inventory in `docs/37_bug_prevention.md`','Review cart abandonment prevention in `docs/41_growth_intelligence.md`'],
    saas:G?['フリーミアム設計は `docs/41_growth_intelligence.md` のファネル参照','マルチテナント設計を `.spec/technical-plan.md` で確認','チャーン防止KPIを `docs/30_goal_decomposition.md` で設定']:['Reference funnel in `docs/41_growth_intelligence.md` for freemium design','Verify multi-tenant design in `.spec/technical-plan.md`','Set churn prevention KPIs in `docs/30_goal_decomposition.md`']
  };
  const tips=dtips[domain]||( G?['プロジェクト固有の制約を `.spec/constitution.md` で再確認','業種別プレイブックを `docs/31_industry_playbook.md` で確認','品質基準を `docs/32_qa_blueprint.md` で確認']:['Re-check project constraints in `.spec/constitution.md`','Review domain playbook in `docs/31_industry_playbook.md`','Verify quality criteria in `docs/32_qa_blueprint.md`']);
  doc42+='## '+(G?'8. 業種別アドバイス（'+domain+'）':'8. Domain-Specific Tips ('+domain+')')+'\n\n';
  tips.forEach((t,i)=>{doc42+=(i+1)+'. '+t+'\n';});
  doc42+='\n';

  // Footer
  doc42+='---\n';
  doc42+=(G?'*このガイドはDevForge v9が `S.skill='+skill+'` に基づいて自動生成しました。*\n':'*This guide was auto-generated by DevForge v9 based on `S.skill='+skill+'`.*\n');

  S.files['docs/42_skill_guide.md']=doc42;
}
